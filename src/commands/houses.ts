#!/usr/bin/env node
/**
 * HALCON Houses Command
 * Calculate and display house cusps and angles
 *
 * @module commands/houses
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { calculateChart } from '../lib/swisseph/index.js';
import type { HouseSystem } from '../lib/swisseph/types.js';
import { loadProfileOrInput } from '../lib/middleware/profile-loader.js';
import { renderHouses, renderHouseComparison, listHouseSystems } from '../lib/display/renderers/houses-renderer.js';

const program = new Command();

program
  .name('halcon-houses')
  .description('Calculate house cusps and angles')
  .version('0.1.0')
  .argument('[date]', 'Date (YYYY-MM-DD)', 'now')
  .argument('[time]', 'Time (HH:MM:SS)', '12:00:00')
  .option('--latitude <degrees>', 'Latitude in degrees')
  .option('--longitude <degrees>', 'Longitude in degrees')
  .option('--location <name>', 'Location name')
  .option('--house-system <system>', 'House system', 'placidus')
  .option('--list-systems', 'List available house systems')
  .option('--compare', 'Compare multiple house systems')
  .option('--json', 'Output as JSON')
  .action(async (dateArg, timeArg, options) => {
    try {
      // List systems
      if (options.listSystems) {
        listHouseSystems();
        return;
      }

      // Load profile or parse input
      const { dateTime, location } = await loadProfileOrInput({
        dateArg,
        timeArg,
        latitude: options.latitude,
        longitude: options.longitude,
        location: options.location
      });

      // Calculate and display
      if (options.compare) {
        await compareHouseSystems(dateTime, location);
      } else {
        await displayHouses(dateTime, location, options.houseSystem, options.json);
      }

    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

/**
 * Display houses for a single system
 */
async function displayHouses(
  date: Date,
  location: any,
  system: string,
  json: boolean
) {
  console.log(chalk.cyan('\n🏠 Calculating houses...\n'));

  const chart = await calculateChart(date, location, {
    houseSystem: system as HouseSystem
  });

  if (json) {
    console.log(JSON.stringify({
      angles: chart.angles,
      houses: chart.houses
    }, null, 2));
    return;
  }

  renderHouses(chart, location, date, system);
}

/**
 * Compare multiple house systems
 */
async function compareHouseSystems(date: Date, location: any) {
  console.log(chalk.cyan('\n🔍 Comparing house systems...\n'));

  const systems: HouseSystem[] = ['placidus', 'koch', 'equal', 'whole-sign'];
  const results = [];

  for (const system of systems) {
    const chart = await calculateChart(date, location, { houseSystem: system });
    results.push({ system, chart });
  }

  renderHouseComparison(results);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse();
}

export { program };
