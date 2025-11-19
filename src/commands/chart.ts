#!/usr/bin/env node
/**
 * HALCON Chart Command
 * Calculate and display natal chart using Swiss Ephemeris wrapper
 *
 * @module commands/chart
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { calculateChart } from '../lib/swisseph/index.js';
import type { ChartOptions } from '../lib/swisseph/types.js';
import { loadProfileOrInput } from '../lib/middleware/profile-loader.js';
import { formatDegree, formatCoordinates } from '../lib/display/formatters.js';
import { getPlanetSymbol } from '../lib/display/symbols.js';

const program = new Command();

program
  .name('halcon-chart')
  .description('Calculate and display natal chart')
  .version('0.1.0')
  .argument('[date]', 'Birth date (YYYY-MM-DD or natural language)', 'now')
  .argument('[time]', 'Birth time (HH:MM:SS)', '12:00:00')
  .option('--latitude <degrees>', 'Latitude in degrees', '0')
  .option('--longitude <degrees>', 'Longitude in degrees', '0')
  .option('--location <name>', 'Location name')
  .option('--house-system <system>', 'House system (placidus, koch, equal, whole-sign)', 'placidus')
  .option('--no-chiron', 'Exclude Chiron')
  .option('--no-lilith', 'Exclude Lilith')
  .option('--no-nodes', 'Exclude lunar nodes')
  .option('--json', 'Output as JSON')
  .action(async (dateArg, timeArg, options) => {
    try {
      // Load profile or parse input
      const { dateTime, location } = await loadProfileOrInput({
        dateArg,
        timeArg,
        latitude: options.latitude,
        longitude: options.longitude,
        location: options.location
      });

      // Parse chart options
      const chartOptions: ChartOptions = {
        houseSystem: options.houseSystem,
        includeChiron: options.chiron !== false,
        includeLilith: options.lilith !== false,
        includeNodes: options.nodes !== false
      };

      // Calculate chart
      console.log(chalk.cyan('\n🌟 Calculating natal chart...\n'));

      const chart = await calculateChart(dateTime, location, chartOptions);

      if (options.json) {
        console.log(JSON.stringify(chart, null, 2));
        return;
      }

      // Display chart
      displayChart(chart);

    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

/**
 * Display chart in human-readable format
 */
function displayChart(chart: any) {
  const { timestamp, location, bodies, angles, houses } = chart;

  // Header
  console.log(chalk.bold.cyan('═'.repeat(70)));
  console.log(chalk.bold.white('                    NATAL CHART'));
  console.log(chalk.bold.cyan('═'.repeat(70)));
  console.log();

  // Birth Info
  console.log(chalk.bold.yellow('📅 Birth Information:'));
  console.log(chalk.greenBright(`   Date: ${timestamp.toISOString().split('T')[0]}`));
  console.log(chalk.greenBright(`   Time: ${timestamp.toISOString().split('T')[1].split('.')[0]} UTC`));
  console.log(chalk.greenBright(`   Location: ${location.name || 'Unknown'}`));
  console.log(chalk.greenBright(`   Coordinates: ${formatCoordinates(location.latitude, location.longitude, { precision: 2 })}`));
  console.log();

  // Angles
  console.log(chalk.bold.yellow('🎯 Angles:'));
  console.log(chalk.cyanBright(`   Ascendant (ASC): ${formatDegree(angles.ascendant)}`));
  console.log(chalk.cyanBright(`   Midheaven (MC):  ${formatDegree(angles.midheaven)}`));
  console.log(chalk.cyanBright(`   Descendant (DSC): ${formatDegree(angles.descendant)}`));
  console.log(chalk.cyanBright(`   Imum Coeli (IC):  ${formatDegree(angles.imumCoeli)}`));
  console.log();

  // Planets
  console.log(chalk.bold.yellow('🪐 Planetary Positions:'));
  console.log(chalk.gray('   ' + '─'.repeat(66)));
  console.log(chalk.gray('   Planet       Longitude    Sign           Degree   Retrograde'));
  console.log(chalk.gray('   ' + '─'.repeat(66)));

  const planetOrder = [
    'sun', 'moon', 'mercury', 'venus', 'mars',
    'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
    'chiron', 'lilith', 'northNode'
  ];

  planetOrder.forEach(key => {
    const body = bodies[key];
    if (body) {
      const symbol = getPlanetSymbol(body.name);
      const name = body.name.padEnd(10);
      const lon = body.longitude.toFixed(2).padStart(7);
      const sign = body.sign.padEnd(12);
      const deg = body.signDegree.toFixed(2).padStart(5);
      const retro = body.retrograde ? chalk.red('    R') : '     ';

      console.log(chalk.whiteBright(`   ${symbol} ${name}  ${lon}°   ${sign}  ${deg}°${retro}`));
    }
  });

  console.log(chalk.gray('   ' + '─'.repeat(66)));
  console.log();

  // Houses
  console.log(chalk.bold.yellow(`🏠 Houses (${houses.system}):`));
  console.log(chalk.gray('   ' + '─'.repeat(40)));

  houses.cusps.forEach((cusp: number, index: number) => {
    const houseNum = (index + 1).toString().padStart(2);
    console.log(chalk.magentaBright(`   House ${houseNum}: ${formatDegree(cusp)}`));
  });

  console.log(chalk.gray('   ' + '─'.repeat(40)));
  console.log();
  console.log(chalk.bold.cyan('═'.repeat(70)));
  console.log(chalk.green('✨ Chart calculated successfully!'));
  console.log();
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse();
}

export { program };
