#!/usr/bin/env node

/**
 * HALCON Profile Timezone Migration Script
 *
 * This script migrates existing profiles to include timezone information.
 * It will:
 * 1. Load all existing profiles
 * 2. For each profile, detect timezone from coordinates
 * 3. Prompt user to confirm or provide correct timezone
 * 4. Calculate UTC offset at birth time
 * 5. Update profile with timezone info
 * 6. Create backup of original profiles
 *
 * Usage:
 *   node scripts/migrate_timezones.mjs
 *   node scripts/migrate_timezones.mjs --dry-run    # Preview changes without saving
 *   node scripts/migrate_timezones.mjs --auto       # Auto-detect timezones without prompts
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import readline from 'readline';
import { DateTime } from 'luxon';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isAuto = args.includes('--auto');

// Paths
const profilesDir = path.join(os.homedir(), '.halcon');
const profilesPath = path.join(profilesDir, 'profiles.json');
const backupPath = path.join(profilesDir, 'profiles.backup.json');

// Timezone detection based on coordinates (simplified)
function detectTimezoneFromCoordinates(latitude, longitude) {
  const timezoneRanges = [
    { lon: [-180, -140], tz: 'Pacific/Honolulu', name: 'Hawaii (HST, UTC-10:00)' },
    { lon: [-140, -120], tz: 'America/Los_Angeles', name: 'Pacific Time (PST/PDT, UTC-08:00/-07:00)' },
    { lon: [-120, -105], tz: 'America/Denver', name: 'Mountain Time (MST/MDT, UTC-07:00/-06:00)' },
    { lon: [-105, -90], tz: 'America/Chicago', name: 'Central Time (CST/CDT, UTC-06:00/-05:00)' },
    { lon: [-90, -60], tz: 'America/New_York', name: 'Eastern Time (EST/EDT, UTC-05:00/-04:00)' },
    { lon: [-60, -45], tz: 'America/Caracas', name: 'Venezuela Time (VET, UTC-04:00)' },
    { lon: [-90, -75], lat: [7, 10], tz: 'America/Panama', name: 'Panama Time (EST, UTC-05:00)' },
    { lon: [-90, -75], lat: [25, 30], tz: 'America/Chicago', name: 'Laredo, Texas (CST/CDT, UTC-06:00/-05:00)' },
    { lon: [-45, -30], tz: 'America/Sao_Paulo', name: 'Brazil Time (BRT, UTC-03:00)' },
    { lon: [-30, 15], tz: 'Europe/London', name: 'GMT/BST (UTC+00:00/+01:00)' },
    { lon: [15, 30], tz: 'Europe/Paris', name: 'Central European Time (CET/CEST, UTC+01:00/+02:00)' },
    { lon: [30, 45], tz: 'Europe/Moscow', name: 'Moscow Time (MSK, UTC+03:00)' },
    { lon: [45, 90], tz: 'Asia/Kolkata', name: 'India Standard Time (IST, UTC+05:30)' },
    { lon: [90, 105], tz: 'Asia/Bangkok', name: 'Indochina Time (ICT, UTC+07:00)' },
    { lon: [105, 135], tz: 'Asia/Shanghai', name: 'China Standard Time (CST, UTC+08:00)' },
    { lon: [135, 150], tz: 'Asia/Tokyo', name: 'Japan Standard Time (JST, UTC+09:00)' },
    { lon: [150, 180], tz: 'Australia/Sydney', name: 'Australian Eastern Time (AEST/AEDT, UTC+10:00/+11:00)' }
  ];

  for (const range of timezoneRanges) {
    const lonMatch = longitude >= range.lon[0] && longitude < range.lon[1];
    const latMatch = !range.lat || (latitude >= range.lat[0] && latitude <= range.lat[1]);

    if (lonMatch && latMatch) {
      return { tz: range.tz, name: range.name };
    }
  }

  return { tz: 'UTC', name: 'Coordinated Universal Time (UTC+00:00)' };
}

// Calculate UTC offset for a specific date/time in a timezone
function calculateUTCOffset(date, time, timezone) {
  try {
    const dt = DateTime.fromFormat(
      `${date} ${time}`,
      'yyyy-MM-dd HH:mm:ss',
      { zone: timezone }
    );

    if (!dt.isValid) {
      throw new Error(`Invalid datetime: ${dt.invalidReason}`);
    }

    const offsetMinutes = dt.offset;
    const hours = Math.floor(Math.abs(offsetMinutes) / 60);
    const minutes = Math.abs(offsetMinutes) % 60;
    const sign = offsetMinutes >= 0 ? '+' : '-';

    return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  } catch (error) {
    console.error(`${colors.red}Error calculating UTC offset:${colors.reset}`, error.message);
    return null;
  }
}

// Convert local time to UTC
function convertLocalToUTC(date, time, timezone) {
  try {
    const dt = DateTime.fromFormat(
      `${date} ${time}`,
      'yyyy-MM-dd HH:mm:ss',
      { zone: timezone }
    );

    if (!dt.isValid) {
      throw new Error(`Invalid datetime: ${dt.invalidReason}`);
    }

    return dt.toUTC().toFormat('HH:mm:ss');
  } catch (error) {
    console.error(`${colors.red}Error converting to UTC:${colors.reset}`, error.message);
    return null;
  }
}

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt user for input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Main migration function
async function migrateProfiles() {
  console.log(`\n${colors.bright}${colors.cyan}╔════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}║         HALCON Profile Timezone Migration Tool                 ║${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}╚════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  if (isDryRun) {
    console.log(`${colors.yellow}[DRY RUN MODE] - No changes will be saved${colors.reset}\n`);
  }

  if (isAuto) {
    console.log(`${colors.yellow}[AUTO MODE] - Timezones will be auto-detected without prompts${colors.reset}\n`);
  }

  // Check if profiles file exists
  if (!fs.existsSync(profilesPath)) {
    console.log(`${colors.red}Error: Profiles file not found at ${profilesPath}${colors.reset}`);
    process.exit(1);
  }

  // Load existing profiles
  let profiles;
  try {
    const data = fs.readFileSync(profilesPath, 'utf-8');
    profiles = JSON.parse(data);
  } catch (error) {
    console.log(`${colors.red}Error loading profiles: ${error.message}${colors.reset}`);
    process.exit(1);
  }

  const profileNames = Object.keys(profiles);

  if (profileNames.length === 0) {
    console.log(`${colors.yellow}No profiles found to migrate.${colors.reset}`);
    rl.close();
    return;
  }

  console.log(`${colors.bright}Found ${profileNames.length} profile(s) to migrate:${colors.reset}`);
  profileNames.forEach((name, i) => {
    console.log(`  ${i + 1}. ${colors.green}${name}${colors.reset} - ${profiles[name].location}`);
  });
  console.log('');

  // Create backup
  if (!isDryRun) {
    try {
      fs.writeFileSync(backupPath, JSON.stringify(profiles, null, 2), 'utf-8');
      console.log(`${colors.green}✓ Backup created at ${backupPath}${colors.reset}\n`);
    } catch (error) {
      console.log(`${colors.red}Error creating backup: ${error.message}${colors.reset}`);
      process.exit(1);
    }
  }

  // Migrate each profile
  for (const name of profileNames) {
    const profile = profiles[name];

    console.log(`${colors.bright}${colors.magenta}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.bright}Profile: ${colors.cyan}${profile.name}${colors.reset}`);
    console.log(`${colors.dim}Location: ${profile.location}${colors.reset}`);
    console.log(`${colors.dim}Birth Date: ${profile.date}${colors.reset}`);
    console.log(`${colors.dim}Birth Time: ${profile.time} (currently stored without timezone)${colors.reset}`);
    console.log(`${colors.dim}Coordinates: ${profile.latitude}°, ${profile.longitude}°${colors.reset}\n`);

    // Detect timezone from coordinates
    const detected = detectTimezoneFromCoordinates(profile.latitude, profile.longitude);
    console.log(`${colors.yellow}Detected timezone: ${detected.tz}${colors.reset}`);
    console.log(`${colors.dim}${detected.name}${colors.reset}\n`);

    let timezone = detected.tz;

    // In auto mode, use detected timezone without prompting
    if (!isAuto) {
      const confirm = await prompt(`${colors.bright}Is this the correct timezone for ${profile.name}'s birth? (Y/n): ${colors.reset}`);

      if (confirm.toLowerCase() === 'n' || confirm.toLowerCase() === 'no') {
        const customTimezone = await prompt(`${colors.bright}Enter IANA timezone (e.g., Asia/Kolkata): ${colors.reset}`);
        timezone = customTimezone || detected.tz;
      }
    }

    // Validate timezone
    const testDt = DateTime.local().setZone(timezone);
    if (!testDt.isValid) {
      console.log(`${colors.red}Error: Invalid timezone '${timezone}'. Skipping profile.${colors.reset}\n`);
      continue;
    }

    // Calculate UTC offset at birth time
    const utcOffset = calculateUTCOffset(profile.date, profile.time, timezone);
    if (!utcOffset) {
      console.log(`${colors.red}Error: Could not calculate UTC offset. Skipping profile.${colors.reset}\n`);
      continue;
    }

    // Convert local time to UTC
    const utcTime = convertLocalToUTC(profile.date, profile.time, timezone);
    if (!utcTime) {
      console.log(`${colors.red}Error: Could not convert to UTC. Skipping profile.${colors.reset}\n`);
      continue;
    }

    console.log(`${colors.green}✓ Timezone validated: ${timezone}${colors.reset}`);
    console.log(`${colors.green}✓ UTC offset: ${utcOffset}${colors.reset}`);
    console.log(`${colors.bright}${colors.blue}Birth time conversion:${colors.reset}`);
    console.log(`  ${colors.dim}Local: ${profile.date} ${profile.time} (${timezone})${colors.reset}`);
    console.log(`  ${colors.dim}UTC:   ${profile.date} ${utcTime}Z${colors.reset}\n`);

    if (!isAuto) {
      const proceed = await prompt(`${colors.bright}Update this profile? (Y/n): ${colors.reset}`);
      if (proceed.toLowerCase() === 'n' || proceed.toLowerCase() === 'no') {
        console.log(`${colors.yellow}Skipped ${profile.name}${colors.reset}\n`);
        continue;
      }
    }

    // Update profile
    profiles[name] = {
      ...profile,
      timezone,
      utcOffset,
      updatedAt: new Date().toISOString()
    };

    console.log(`${colors.green}✓ Profile updated${colors.reset}\n`);
  }

  // Save updated profiles
  if (!isDryRun) {
    try {
      fs.writeFileSync(profilesPath, JSON.stringify(profiles, null, 2), 'utf-8');
      console.log(`${colors.bright}${colors.green}✓ All profiles migrated successfully!${colors.reset}`);
      console.log(`${colors.dim}Profiles saved to: ${profilesPath}${colors.reset}`);
      console.log(`${colors.dim}Backup saved to: ${backupPath}${colors.reset}\n`);
    } catch (error) {
      console.log(`${colors.red}Error saving profiles: ${error.message}${colors.reset}`);
      process.exit(1);
    }
  } else {
    console.log(`${colors.yellow}[DRY RUN] - Changes not saved${colors.reset}\n`);
    console.log('Preview of updated profiles:');
    console.log(JSON.stringify(profiles, null, 2));
  }

  console.log(`${colors.bright}${colors.cyan}Migration complete!${colors.reset}\n`);

  rl.close();
}

// Run migration
migrateProfiles().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  rl.close();
  process.exit(1);
});
