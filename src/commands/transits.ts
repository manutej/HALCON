#!/usr/bin/env node
/**
 * HALCON Transits Command
 * Calculate and display current planetary positions
 *
 * @module commands/transits
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { DateTime } from 'luxon';
import { calculateTransits } from '../lib/transits/index.js';
import type { GeoCoordinates } from '../lib/swisseph/types.js';
import { getProfileManager } from '../lib/profiles/index.js';
import { getMoonPhaseSymbol } from '../lib/moon-phase/index.js';
import { formatCoordinates } from '../lib/display/formatters.js';
import { getPlanetSymbol } from '../lib/display/symbols.js';

// PLANET_ORDER constant for display
const PLANET_ORDER = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'
] as const;

const program = new Command();

program
  .name('halcon-transits')
  .description('Calculate and display current planetary positions (transits)')
  .version('0.1.0')
  .argument('[profile]', 'Profile name for natal chart comparison', '')
  .option('--date <date>', 'Transit date (YYYY-MM-DD)', '')
  .option('--latitude <degrees>', 'Latitude in degrees')
  .option('--longitude <degrees>', 'Longitude in degrees')
  .option('--location <name>', 'Location name')
  .option('--json', 'Output as JSON')
  .action(async (profileArg, options) => {
    try {
      let transitDate: Date;
      let location: GeoCoordinates;
      let profileName = '';

      // Determine date for transits
      if (options.date) {
        // Parse specific date
        const parsedDate = DateTime.fromFormat(options.date, 'yyyy-MM-dd', { zone: 'UTC' });

        if (!parsedDate.isValid) {
          console.error(chalk.red(`❌ Invalid date format: ${options.date}`));
          console.log(chalk.yellow('Use format: YYYY-MM-DD (e.g., 2025-11-19)'));
          process.exit(1);
        }

        transitDate = parsedDate.toJSDate();
      } else {
        // Default: current date/time
        transitDate = new Date();
      }

      // Check if profile provided
      const isProfileName = /^[a-zA-Z0-9_-]+$/.test(profileArg) && profileArg !== '';

      if (isProfileName) {
        // Load profile for natal chart comparison
        const profileManager = getProfileManager();
        const profile = profileManager.getProfile(profileArg);

        if (!profile) {
          console.error(chalk.red(`❌ Profile "${profileArg}" not found`));
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
        location = {
          latitude: profile.latitude,
          longitude: profile.longitude,
          name: profile.location
        };

        console.log(chalk.green(`✓ Using location from profile: ${profile.name}`));
        console.log(chalk.dim(`  ${profile.location} (${profile.latitude.toFixed(2)}°, ${profile.longitude.toFixed(2)}°)\n`));

        // Calculate natal chart for comparison (optional enhancement)
        // For now, we'll just show transits at the profile's location
      } else {
        // Use provided location or defaults
        if (options.latitude && options.longitude) {
          location = {
            latitude: parseFloat(options.latitude),
            longitude: parseFloat(options.longitude),
            name: options.location || 'Custom Location'
          };
        } else {
          // Default: Greenwich
          location = {
            latitude: 0,
            longitude: 0,
            name: options.location || 'Greenwich'
          };
        }
      }

      // Calculate transits
      console.log(chalk.cyan('🌌 Calculating planetary transits...\n'));

      const transits = await calculateTransits(transitDate, location);

      if (options.json) {
        console.log(JSON.stringify({
          transits: {
            timestamp: transits.timestamp.toISOString(),
            location: transits.location,
            bodies: transits.bodies,
            moonPhase: transits.moonPhase
          }
        }, null, 2));
        return;
      }

      // Display transits
      displayTransits(transits, profileName);

    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

/**
 * Display transits in human-readable format
 */
function displayTransits(transits: any, profileName: string) {
  const dt = DateTime.fromJSDate(transits.timestamp);

  // Header
  console.log(chalk.bold.cyan('═'.repeat(75)));
  console.log(chalk.bold.white('                    PLANETARY TRANSITS'));
  console.log(chalk.bold.cyan('═'.repeat(75)));
  console.log();

  // Profile info (if applicable)
  if (profileName) {
    console.log(chalk.bold.magenta(`👤 Profile Location: ${profileName}`));
    console.log();
  }

  // Date/Time Information
  console.log(chalk.bold.yellow('📅 Transit Information:'));
  console.log(chalk.white(`   Date: ${dt.toFormat('MMMM d, yyyy')}`));
  console.log(chalk.white(`   Time: ${dt.toFormat('h:mm a')} UTC`));
  console.log(chalk.white(`   Location: ${transits.location.name}`));
  console.log(chalk.white(`   Coordinates: ${formatCoordinates(transits.location.latitude, transits.location.longitude)}`));
  console.log();

  // Moon Phase
  const moonSymbol = getMoonPhaseSymbol(transits.moonPhase.name);
  console.log(chalk.bold.yellow(`🌙 Moon Phase:`));
  console.log(chalk.white(`   ${moonSymbol} ${transits.moonPhase.name}`));
  console.log(chalk.white(`   Illumination: ${transits.moonPhase.illumination.toFixed(1)}%`));
  console.log(chalk.white(`   Angle: ${transits.moonPhase.angle.toFixed(2)}°`));
  console.log();

  // Planetary Positions
  console.log(chalk.bold.cyan('═'.repeat(75)));
  console.log(chalk.bold.yellow('🪐 PLANETARY POSITIONS'));
  console.log(chalk.bold.cyan('═'.repeat(75)));
  console.log();

  displayPlanets(transits.bodies);

  console.log();
  console.log(chalk.bold.cyan('═'.repeat(75)));
  console.log(chalk.green('✨ Transits calculated successfully!'));
  console.log(chalk.dim(`\n   💡 Tip: Use --date YYYY-MM-DD to see transits for a specific date`));
  console.log(chalk.dim(`   💡 Tip: Use a profile name to see transits at that location`));
  console.log();
}

/**
 * Display planetary positions
 */
function displayPlanets(bodies: any) {
  console.log(chalk.gray('   ' + '─'.repeat(70)));
  console.log(chalk.gray('   Planet       Longitude    Sign              Degree   Retrograde'));
  console.log(chalk.gray('   ' + '─'.repeat(70)));

  PLANET_ORDER.forEach(key => {
    const body = bodies[key];
    if (body) {
      const symbol = getPlanetSymbol(body.name);
      const name = body.name.padEnd(10);
      const lon = body.longitude.toFixed(2).padStart(7);
      const sign = body.sign.padEnd(15);
      const deg = body.signDegree.toFixed(2).padStart(5);
      const retro = body.retrograde ? chalk.red('    R') : '     ';

      console.log(chalk.whiteBright(`   ${symbol} ${name}  ${lon}°   ${sign}  ${deg}°${retro}`));
    }
  });

  console.log(chalk.gray('   ' + '─'.repeat(70)));
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse();
}

export { program };
