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
import type { ChartOptions } from '../lib/swisseph/types.js';
import { calculateProgressedDate, calculateAge } from '../lib/progressions/index.js';
import { loadProfileOrInput } from '../lib/middleware/profile-loader.js';
import { displayProgressions } from '../display/renderers.js';

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
      // Load profile or parse input arguments
      const { dateTime: birthDateTime, location, profileName } = await loadProfileOrInput({
        dateArg: profileOrDate,
        timeArg,
        latitude: options.latitude,
        longitude: options.longitude,
        location: options.location
      });

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
      displayProgressions({
        natalChart,
        progressedChart,
        birthDate: birthDateTime,
        targetDate,
        progression,
        age,
        location,
        profileName
      });

    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse();
}

export { program };
