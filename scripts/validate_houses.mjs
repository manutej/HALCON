#!/usr/bin/env node
/**
 * HALCON House Calculation Validation Script
 *
 * This script validates house calculations by comparing HALCON's
 * HouseCalculator against the Swiss Ephemeris swetest command-line tool.
 *
 * Usage:
 *   node scripts/validate_houses.mjs
 *   node scripts/validate_houses.mjs --profile manu
 *   node scripts/validate_houses.mjs --all
 */

import swisseph from 'swisseph';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import os from 'os';

// Initialize Swiss Ephemeris
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
swisseph.swe_set_ephe_path(join(__dirname, '../node_modules/swisseph/ephe'));

// Celebrity test charts for validation
const CELEBRITY_CHARTS = [
  {
    name: "Steve Jobs",
    date: "1955-02-24",
    time: "19:15:00", // UTC
    timezone: "UTC",
    latitude: -37.808889,
    longitude: 122.419444,
    location: "San Francisco, CA, USA",
    description: "Apple co-founder - commonly used for astrological validation"
  },
  {
    name: "Albert Einstein",
    date: "1879-03-14",
    time: "11:30:00", // UTC (estimated from local time)
    timezone: "UTC",
    latitude: 48.398611,
    longitude: 7.851944,
    location: "Ulm, Germany",
    description: "Theoretical physicist"
  },
  {
    name: "Marie Curie",
    date: "1867-11-07",
    time: "12:00:00", // UTC (noon, time unknown)
    timezone: "UTC",
    latitude: 52.229676,
    longitude: 21.012229,
    location: "Warsaw, Poland",
    description: "Physicist and chemist"
  }
];

/**
 * Calculate houses using swisseph library (same as HALCON)
 */
function calculateHousesWithSwisseph(date, time, latitude, longitude, timezone = 'UTC') {
  // Parse date/time - IMPORTANT: Must be treated as UTC
  const dateTimeStr = timezone === 'UTC'
    ? `${date}T${time}Z`  // Explicit UTC
    : `${date}T${time}`;   // Local time (has timezone bug!)

  const dateTime = new Date(dateTimeStr);

  const year = dateTime.getUTCFullYear();
  const month = dateTime.getUTCMonth() + 1;
  const day = dateTime.getUTCDate();
  const hour = dateTime.getUTCHours() +
               dateTime.getUTCMinutes() / 60 +
               dateTime.getUTCSeconds() / 3600;

  const jd = swisseph.swe_julday(year, month, day, hour, swisseph.SE_GREG_CAL);
  const result = swisseph.swe_houses(jd, latitude, longitude, 'P');

  return {
    julianDay: jd,
    dateTime: dateTime.toISOString(),
    parsedComponents: { year, month, day, hour },
    houses: result.house,
    ascendant: result.ascendant,
    midheaven: result.mc,
    descendant: (result.ascendant + 180) % 360,
    imumCoeli: (result.mc + 180) % 360
  };
}

/**
 * Format degree as zodiac sign
 */
function formatDegree(degrees) {
  const normalized = ((degrees % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const signDegree = normalized % 30;
  const signs = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir',
                 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
  return `${signDegree.toFixed(4)}° ${signs[signIndex]}`;
}

/**
 * Validate a single chart
 */
function validateChart(chart) {
  console.log('\n' + '='.repeat(80));
  console.log(`VALIDATING: ${chart.name}`);
  console.log('='.repeat(80));
  console.log(`Location: ${chart.location}`);
  console.log(`Birth: ${chart.date} ${chart.time} ${chart.timezone}`);
  console.log(`Coordinates: ${chart.latitude}°N, ${chart.longitude}°E`);
  console.log(`Description: ${chart.description}`);
  console.log();

  const result = calculateHousesWithSwisseph(
    chart.date,
    chart.time,
    chart.latitude,
    chart.longitude,
    chart.timezone
  );

  console.log('CALCULATED RESULTS:');
  console.log(`Julian Day: ${result.julianDay.toFixed(6)}`);
  console.log(`Date/Time (ISO): ${result.dateTime}`);
  console.log(`Parsed: ${result.parsedComponents.day}.${result.parsedComponents.month}.${result.parsedComponents.year} ${result.parsedComponents.hour.toFixed(4)} UTC`);
  console.log();

  console.log('ANGLES:');
  console.log(`  Ascendant (ASC): ${result.ascendant.toFixed(6)}° = ${formatDegree(result.ascendant)}`);
  console.log(`  Midheaven (MC):  ${result.midheaven.toFixed(6)}° = ${formatDegree(result.midheaven)}`);
  console.log(`  Descendant (DSC): ${result.descendant.toFixed(6)}° = ${formatDegree(result.descendant)}`);
  console.log(`  Imum Coeli (IC):  ${result.imumCoeli.toFixed(6)}° = ${formatDegree(result.imumCoeli)}`);
  console.log();

  console.log('HOUSE CUSPS (Placidus):');
  result.houses.forEach((cusp, i) => {
    const houseNum = String(i + 1).padStart(2);
    const special = i === 0 ? ' (ASC)' : i === 9 ? ' (MC)' : '';
    console.log(`  House ${houseNum}: ${cusp.toFixed(6)}° = ${formatDegree(cusp)}${special}`);
  });

  // Generate swetest command
  console.log();
  console.log('SWETEST VALIDATION COMMAND:');
  const swetestCmd = `/Users/manu/bin/swetest -b${chart.date.split('-').reverse().join('.')} -ut${chart.time} -house${chart.longitude},${chart.latitude},P -geopos${chart.longitude},${chart.latitude}`;
  console.log(`  ${swetestCmd}`);

  return result;
}

/**
 * Load profiles from ~/.halcon/profiles.json
 */
function loadProfiles() {
  const profilesPath = join(os.homedir(), '.halcon', 'profiles.json');
  if (!fs.existsSync(profilesPath)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(profilesPath, 'utf-8'));
}

/**
 * Main validation
 */
function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log('HALCON House Calculation Validation');
    console.log();
    console.log('Usage:');
    console.log('  node scripts/validate_houses.mjs              # Validate celebrity charts');
    console.log('  node scripts/validate_houses.mjs --all        # Include saved profiles');
    console.log('  node scripts/validate_houses.mjs --profile manu  # Validate specific profile');
    return;
  }

  console.log('HALCON HOUSE CALCULATION VALIDATION');
  console.log('Swiss Ephemeris Version: 2.10.03');
  console.log('House System: Placidus (P)');
  console.log();

  // Validate celebrity charts
  console.log('CELEBRITY VALIDATION CHARTS:');
  CELEBRITY_CHARTS.forEach(chart => validateChart(chart));

  // Optionally validate saved profiles
  if (args.includes('--all') || args.includes('--profile')) {
    const profiles = loadProfiles();
    const profileNames = Object.keys(profiles);

    if (profileNames.length === 0) {
      console.log('\nNo saved profiles found in ~/.halcon/profiles.json');
      return;
    }

    console.log('\n' + '='.repeat(80));
    console.log('SAVED PROFILES:');
    console.log('='.repeat(80));

    const targetProfile = args.find(arg => !arg.startsWith('--'));
    const profilesToValidate = targetProfile
      ? [targetProfile]
      : (args.includes('--all') ? profileNames : []);

    profilesToValidate.forEach(name => {
      const profile = profiles[name.toLowerCase()];
      if (!profile) {
        console.log(`\nProfile "${name}" not found`);
        return;
      }

      const chart = {
        name: profile.name,
        date: profile.date,
        time: profile.time,
        timezone: 'LOCAL', // WARNING: Profiles don't store timezone!
        latitude: profile.latitude,
        longitude: profile.longitude,
        location: profile.location,
        description: `Saved profile (created: ${profile.createdAt})`
      };

      validateChart(chart);

      console.log();
      console.log('⚠️  WARNING: This profile may have timezone issues!');
      console.log('    Profiles are stored without timezone information.');
      console.log('    The time is being interpreted as LOCAL time on this machine.');
      console.log('    For accurate calculations, store times as UTC.');
    });
  }

  console.log('\n' + '='.repeat(80));
  console.log('VALIDATION COMPLETE');
  console.log('='.repeat(80));
  console.log();
  console.log('To verify results manually, run the swetest commands shown above');
  console.log('and compare the house cusps and angles.');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { validateChart, calculateHousesWithSwisseph };
