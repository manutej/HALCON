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
import type { GeoCoordinates, ChartOptions } from '../lib/swisseph/types.js';

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
      // Parse date
      const dateStr = dateArg === 'now' ? new Date().toISOString() : dateArg;
      const dateTime = new Date(`${dateStr}T${timeArg}`);

      if (isNaN(dateTime.getTime())) {
        console.error(chalk.red('❌ Invalid date/time format'));
        console.log(chalk.yellow('Examples:'));
        console.log(chalk.cyan('  halcon-chart 1990-03-10 12:55:00'));
        console.log(chalk.cyan('  halcon-chart now'));
        process.exit(1);
      }

      // Parse location
      const location: GeoCoordinates = {
        latitude: parseFloat(options.latitude),
        longitude: parseFloat(options.longitude),
        name: options.location
      };

      // Parse options
      const chartOptions: ChartOptions = {
        houseSystem: options.houseSystem as any,
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
  console.log(chalk.white(`   Date: ${timestamp.toISOString().split('T')[0]}`));
  console.log(chalk.white(`   Time: ${timestamp.toTimeString().split(' ')[0]} UTC`));
  console.log(chalk.white(`   Location: ${location.name || 'Unknown'}`));
  console.log(chalk.white(`   Coordinates: ${location.latitude.toFixed(2)}°N, ${location.longitude.toFixed(2)}°E`));
  console.log();

  // Angles
  console.log(chalk.bold.yellow('🎯 Angles:'));
  console.log(chalk.white(`   Ascendant (ASC): ${formatDegree(angles.ascendant)}`));
  console.log(chalk.white(`   Midheaven (MC):  ${formatDegree(angles.midheaven)}`));
  console.log(chalk.white(`   Descendant (DSC): ${formatDegree(angles.descendant)}`));
  console.log(chalk.white(`   Imum Coeli (IC):  ${formatDegree(angles.imumCoeli)}`));
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

      console.log(chalk.white(`   ${symbol} ${name}  ${lon}°   ${sign}  ${deg}°${retro}`));
    }
  });

  console.log(chalk.gray('   ' + '─'.repeat(66)));
  console.log();

  // Houses
  console.log(chalk.bold.yellow(`🏠 Houses (${houses.system}):`));
  console.log(chalk.gray('   ' + '─'.repeat(40)));

  houses.cusps.forEach((cusp: number, index: number) => {
    const houseNum = (index + 1).toString().padStart(2);
    console.log(chalk.white(`   House ${houseNum}: ${formatDegree(cusp)}`));
  });

  console.log(chalk.gray('   ' + '─'.repeat(40)));
  console.log();
  console.log(chalk.bold.cyan('═'.repeat(70)));
  console.log(chalk.green('✨ Chart calculated successfully!'));
  console.log();
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
