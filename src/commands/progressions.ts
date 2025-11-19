#!/usr/bin/env node
/**
 * HALCON Progressions Command
 * Calculate and display secondary progressions
 *
 * Secondary Progressions Formula: 1 day after birth = 1 year of life
 *
 * @module commands/progressions
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { DateTime } from 'luxon';
import { calculateChart } from '../lib/swisseph/index.js';
import type { GeoCoordinates, ChartOptions } from '../lib/swisseph/types.js';
import { getProfileManager } from '../lib/profiles/index.js';
import { calculateProgressedDate, calculateAge } from '../lib/progressions/index.js';

const program = new Command();

program
  .name('halcon-progressions')
  .description('Calculate secondary progressions (1 day = 1 year)')
  .version('0.1.0')
  .argument('[profile]', 'Profile name or birth date (YYYY-MM-DD)', '')
  .argument('[time]', 'Birth time (HH:MM:SS)', '')
  .option('--latitude <degrees>', 'Latitude in degrees')
  .option('--longitude <degrees>', 'Longitude in degrees')
  .option('--location <name>', 'Location name')
  .option('--house-system <system>', 'House system (placidus, koch, equal, whole-sign)', 'placidus')
  .option('--to <date>', 'Progress to specific date (YYYY-MM-DD)', '')
  .option('--age <years>', 'Progress to specific age', '')
  .option('--json', 'Output as JSON')
  .action(async (profileOrDate, timeArg, options) => {
    try {
      let birthDateTime: Date;
      let location: GeoCoordinates;
      let profileName = '';

      // Check if first arg is a profile name (simple word, not a date)
      const isProfileName = /^[a-zA-Z0-9_-]+$/.test(profileOrDate) && profileOrDate !== '';

      if (isProfileName) {
        // Try to load profile
        const profileManager = getProfileManager();
        const profile = profileManager.getProfile(profileOrDate);

        if (!profile) {
          console.error(chalk.red(`❌ Profile "${profileOrDate}" not found`));
          console.log(chalk.yellow('Available profiles:'));
          const profiles = profileManager.listProfiles();
          if (profiles.length === 0) {
            console.log(chalk.gray('  No profiles saved'));
          } else {
            profiles.forEach(p => {
              console.log(chalk.cyan(`  ${p.name} - ${p.location}`));
            });
          }
          process.exit(1);
        }

        profileName = profile.name;
        console.log(chalk.green(`✓ Loaded profile: ${profile.name}`));

        // Use profile data with timezone conversion
        if (profile.timezone) {
          // Convert local time to UTC
          const localDateTime = DateTime.fromFormat(
            `${profile.date} ${profile.time}`,
            'yyyy-MM-dd HH:mm:ss',
            { zone: profile.timezone }
          );

          if (!localDateTime.isValid) {
            console.error(chalk.red(`❌ Invalid datetime in profile: ${localDateTime.invalidReason}`));
            process.exit(1);
          }

          birthDateTime = localDateTime.toUTC().toJSDate();

          console.log(chalk.dim(`Birth Time (Local): ${profile.date} ${profile.time} ${profile.timezone} (${profile.utcOffset || 'N/A'})`));
          console.log(chalk.dim(`Birth Time (UTC):   ${birthDateTime.toISOString()}\n`));
        } else {
          // Fallback: treat as UTC (backward compatibility)
          birthDateTime = new Date(`${profile.date}T${profile.time}Z`);
          console.log(chalk.yellow('⚠️  Profile lacks timezone information - treating time as UTC'));
          console.log(chalk.dim('   Run migration: node scripts/migrate_timezones.mjs\n'));
        }

        location = {
          latitude: profile.latitude,
          longitude: profile.longitude,
          name: profile.location
        };
      } else {
        // Parse date/time from arguments
        if (!profileOrDate || !timeArg) {
          console.error(chalk.red('❌ Please provide birth date and time, or use a profile name'));
          console.log(chalk.yellow('\nExamples:'));
          console.log(chalk.cyan('  halcon-progressions manu'));
          console.log(chalk.cyan('  halcon-progressions manu --to 2026-01-01'));
          console.log(chalk.cyan('  halcon-progressions manu --age 40'));
          console.log(chalk.cyan('  halcon-progressions 1990-03-10 12:55:00 --latitude 15.83 --longitude 78.04'));
          process.exit(1);
        }

        // Validate required options
        if (!options.latitude || !options.longitude) {
          console.error(chalk.red('❌ --latitude and --longitude are required'));
          process.exit(1);
        }

        birthDateTime = new Date(`${profileOrDate}T${timeArg}Z`);

        if (isNaN(birthDateTime.getTime())) {
          console.error(chalk.red('❌ Invalid date/time format'));
          process.exit(1);
        }

        location = {
          latitude: parseFloat(options.latitude),
          longitude: parseFloat(options.longitude),
          name: options.location || 'Unknown'
        };
      }

      // Determine target date for progression
      let targetDate: Date;

      if (options.age) {
        // User specified age
        const age = parseFloat(options.age);
        const birthDT = DateTime.fromJSDate(birthDateTime);
        targetDate = birthDT.plus({ years: age }).toJSDate();
      } else if (options.to) {
        // User specified specific date
        targetDate = new Date(options.to);
        if (isNaN(targetDate.getTime())) {
          console.error(chalk.red('❌ Invalid --to date format. Use YYYY-MM-DD'));
          process.exit(1);
        }
      } else {
        // Default: current date
        targetDate = new Date();
      }

      // Calculate progression
      const progression = calculateProgressedDate(birthDateTime, targetDate);
      const age = calculateAge(birthDateTime, targetDate);

      // Parse chart options
      const chartOptions: ChartOptions = {
        houseSystem: options.houseSystem as any,
        includeChiron: true,
        includeLilith: true,
        includeNodes: true
      };

      // Calculate natal chart
      console.log(chalk.cyan('\n🌟 Calculating natal chart...\n'));
      const natalChart = await calculateChart(birthDateTime, location, chartOptions);

      // Calculate progressed chart
      console.log(chalk.cyan('🔮 Calculating progressed positions...\n'));
      const progressedChart = await calculateChart(
        progression.progressedDate,
        location, // Progressed positions use NATAL location
        chartOptions
      );

      if (options.json) {
        console.log(JSON.stringify({
          natal: natalChart,
          progressed: progressedChart,
          progression: {
            birthDate: birthDateTime.toISOString(),
            targetDate: targetDate.toISOString(),
            progressedDate: progression.progressedDate.toISOString(),
            ageInYears: age,
            ageInDays: progression.ageInDays
          }
        }, null, 2));
        return;
      }

      // Display progressions
      displayProgressions(
        natalChart,
        progressedChart,
        birthDateTime,
        targetDate,
        progression,
        age,
        location,
        profileName
      );

    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

/**
 * Display progressions in human-readable format
 */
function displayProgressions(
  natalChart: any,
  progressedChart: any,
  birthDate: Date,
  targetDate: Date,
  progression: { progressedDate: Date; ageInYears: number; ageInDays: number },
  age: number,
  location: GeoCoordinates,
  profileName: string
) {
  const birthDT = DateTime.fromJSDate(birthDate);
  const targetDT = DateTime.fromJSDate(targetDate);
  const progressedDT = DateTime.fromJSDate(progression.progressedDate);

  // Header
  console.log(chalk.bold.cyan('═'.repeat(75)));
  console.log(chalk.bold.white('                 SECONDARY PROGRESSIONS'));
  console.log(chalk.bold.cyan('═'.repeat(75)));
  console.log();

  // Profile info
  if (profileName) {
    console.log(chalk.bold.magenta(`👤 Profile: ${profileName}`));
    console.log();
  }

  // Birth Information
  console.log(chalk.bold.yellow('📅 Natal Information:'));
  console.log(chalk.white(`   Birth Date: ${birthDT.toFormat('MMMM d, yyyy')}`));
  console.log(chalk.white(`   Birth Time: ${birthDT.toFormat('h:mm a')} UTC`));
  console.log(chalk.white(`   Location: ${location.name}`));
  console.log(chalk.white(`   Coordinates: ${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°`));
  console.log();

  // Progression Information
  console.log(chalk.bold.yellow('🔮 Progression Information:'));
  console.log(chalk.white(`   Progressed To: ${targetDT.toFormat('MMMM d, yyyy')}`));
  console.log(chalk.white(`   Current Age: ${age.toFixed(2)} years`));
  console.log(chalk.white(`   Progressed Date: ${progressedDT.toFormat('MMMM d, yyyy')} (${progression.ageInDays.toFixed(2)} days after birth)`));
  console.log(chalk.dim(`   Formula: 1 day = 1 year of life`));
  console.log();

  // Natal Positions
  console.log(chalk.bold.cyan('═'.repeat(75)));
  console.log(chalk.bold.yellow('📊 NATAL POSITIONS (Birth Chart)'));
  console.log(chalk.bold.cyan('═'.repeat(75)));
  console.log();

  displayPlanets(natalChart.bodies, false);

  // Progressed Positions
  console.log();
  console.log(chalk.bold.cyan('═'.repeat(75)));
  console.log(chalk.bold.yellow(`🌙 PROGRESSED POSITIONS (Age ${age.toFixed(2)} years)`));
  console.log(chalk.bold.cyan('═'.repeat(75)));
  console.log();

  displayPlanets(progressedChart.bodies, true);

  // Comparison (movement)
  console.log();
  console.log(chalk.bold.cyan('═'.repeat(75)));
  console.log(chalk.bold.yellow('📈 PROGRESSION MOVEMENT'));
  console.log(chalk.bold.cyan('═'.repeat(75)));
  console.log();

  displayMovement(natalChart.bodies, progressedChart.bodies);

  // Angles
  console.log();
  console.log(chalk.bold.yellow('🎯 Progressed Angles:'));
  console.log(chalk.white(`   Ascendant (ASC): ${formatDegree(progressedChart.angles.ascendant)}`));
  console.log(chalk.white(`   Midheaven (MC):  ${formatDegree(progressedChart.angles.midheaven)}`));
  console.log();

  console.log(chalk.bold.cyan('═'.repeat(75)));
  console.log(chalk.green('✨ Progressions calculated successfully!'));
  console.log(chalk.dim(`\n   💡 Tip: Use --to <date> to progress to a specific date`));
  console.log(chalk.dim(`   💡 Tip: Use --age <years> to see progressions at a specific age`));
  console.log();
}

/**
 * Display planetary positions
 */
function displayPlanets(bodies: any, isProgressed: boolean) {
  console.log(chalk.gray('   ' + '─'.repeat(70)));
  console.log(chalk.gray('   Planet       Longitude    Sign              Degree   Retrograde'));
  console.log(chalk.gray('   ' + '─'.repeat(70)));

  const planetOrder = [
    'sun', 'moon', 'mercury', 'venus', 'mars',
    'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'
  ];

  planetOrder.forEach(key => {
    const body = bodies[key];
    if (body) {
      const symbol = getPlanetSymbol(body.name);
      const name = body.name.padEnd(10);
      const lon = body.longitude.toFixed(2).padStart(7);
      const sign = body.sign.padEnd(15);
      const deg = body.signDegree.toFixed(2).padStart(5);
      const retro = body.retrograde ? chalk.red('    R') : '     ';

      const color = isProgressed ? chalk.magentaBright : chalk.whiteBright;
      console.log(color(`   ${symbol} ${name}  ${lon}°   ${sign}  ${deg}°${retro}`));
    }
  });

  console.log(chalk.gray('   ' + '─'.repeat(70)));
}

/**
 * Display movement between natal and progressed positions
 */
function displayMovement(natalBodies: any, progressedBodies: any) {
  console.log(chalk.gray('   ' + '─'.repeat(70)));
  console.log(chalk.gray('   Planet       Natal         Progressed      Movement'));
  console.log(chalk.gray('   ' + '─'.repeat(70)));

  const planetOrder = [
    'sun', 'moon', 'mercury', 'venus', 'mars',
    'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'
  ];

  planetOrder.forEach(key => {
    const natal = natalBodies[key];
    const progressed = progressedBodies[key];

    if (natal && progressed) {
      const symbol = getPlanetSymbol(natal.name);
      const name = natal.name.padEnd(10);
      const natalPos = formatDegree(natal.longitude).padEnd(12);
      const progressedPos = formatDegree(progressed.longitude).padEnd(12);

      // Calculate movement (handle 360° wraparound)
      let movement = progressed.longitude - natal.longitude;
      if (movement > 180) movement -= 360;
      if (movement < -180) movement += 360;

      const movementStr = `${movement >= 0 ? '+' : ''}${movement.toFixed(2)}°`;
      const movementColor = Math.abs(movement) > 5 ? chalk.greenBright : chalk.white;

      console.log(chalk.white(`   ${symbol} ${name}  ${natalPos}  ${progressedPos}  `) + movementColor(movementStr));
    }
  });

  console.log(chalk.gray('   ' + '─'.repeat(70)));
  console.log();
  console.log(chalk.dim('   💫 Significant movement (>5°) highlighted in green'));
}

/**
 * Format degrees with sign
 */
function formatDegree(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const signDegree = normalized % 30;

  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

  return `${signDegree.toFixed(2)}° ${signs[signIndex]}`;
}

/**
 * Get planet symbol/emoji
 */
function getPlanetSymbol(name: string): string {
  const symbols: Record<string, string> = {
    'Sun': '☉',
    'Moon': '☽',
    'Mercury': '☿',
    'Venus': '♀',
    'Mars': '♂',
    'Jupiter': '♃',
    'Saturn': '♄',
    'Uranus': '♅',
    'Neptune': '♆',
    'Pluto': '♇',
    'Chiron': '⚷',
    'Lilith': '⚸',
    'Mean Lilith': '⚸',
    'North Node': '☊',
    'South Node': '☋'
  };

  return symbols[name] || '•';
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse();
}

export { program };
