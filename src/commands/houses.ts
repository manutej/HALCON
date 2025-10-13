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
import type { GeoCoordinates, HouseSystem } from '../lib/swisseph/types.js';

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

      // Validate required options for calculations
      if (!options.latitude || !options.longitude) {
        console.error(chalk.red('❌ --latitude and --longitude are required for house calculations'));
        console.log(chalk.yellow('Use --list-systems to see available house systems without calculating'));
        process.exit(1);
      }

      // Parse date/time
      const dateStr = dateArg === 'now' ? new Date().toISOString() : dateArg;
      const dateTime = new Date(`${dateStr}T${timeArg}`);

      if (isNaN(dateTime.getTime())) {
        console.error(chalk.red('❌ Invalid date/time'));
        process.exit(1);
      }

      // Parse location
      const location: GeoCoordinates = {
        latitude: parseFloat(options.latitude),
        longitude: parseFloat(options.longitude),
        name: options.location
      };

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
 * List available house systems
 */
function listHouseSystems() {
  console.log(chalk.bold.cyan('\n🏠 Available House Systems:\n'));

  const systems = [
    { name: 'placidus', description: 'Placidus (most common, unequal houses)' },
    { name: 'koch', description: 'Koch (birthplace system)' },
    { name: 'equal', description: 'Equal (30° each from Ascendant)' },
    { name: 'whole-sign', description: 'Whole Sign (one sign per house)' },
    { name: 'porphyrius', description: 'Porphyrius (space division)' },
    { name: 'regiomontanus', description: 'Regiomontanus (rational method)' },
    { name: 'campanus', description: 'Campanus (prime vertical)' },
    { name: 'meridian', description: 'Meridian (axial rotation)' },
    { name: 'morinus', description: 'Morinus (equator system)' },
    { name: 'alcabitus', description: 'Alcabitus (ancient system)' }
  ];

  systems.forEach(sys => {
    console.log(chalk.white(`  • ${chalk.bold(sys.name.padEnd(15))} - ${sys.description}`));
  });

  console.log(chalk.gray('\nUsage: halcon-houses --house-system <system>\n'));
}

/**
 * Display houses for a single system
 */
async function displayHouses(
  date: Date,
  location: GeoCoordinates,
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

  // Display
  console.log(chalk.bold.cyan('═'.repeat(70)));
  console.log(chalk.bold.white(`           HOUSE CUSPS - ${system.toUpperCase()}`));
  console.log(chalk.bold.cyan('═'.repeat(70)));
  console.log();

  // Info
  console.log(chalk.bold.yellow('📍 Location:'));
  console.log(chalk.white(`   ${location.name || 'Unknown'}`));
  console.log(chalk.white(`   ${location.latitude.toFixed(2)}°N, ${location.longitude.toFixed(2)}°E`));
  console.log(chalk.white(`   ${date.toISOString()}`));
  console.log();

  // Angles
  console.log(chalk.bold.yellow('🎯 Angles:'));
  console.log(chalk.white(`   Ascendant (ASC): ${formatDegree(chart.angles.ascendant)}`));
  console.log(chalk.white(`   Midheaven (MC):  ${formatDegree(chart.angles.midheaven)}`));
  console.log(chalk.white(`   Descendant (DSC): ${formatDegree(chart.angles.descendant)}`));
  console.log(chalk.white(`   Imum Coeli (IC):  ${formatDegree(chart.angles.imumCoeli)}`));
  console.log();

  // Houses
  console.log(chalk.bold.yellow('🏠 House Cusps:'));
  console.log(chalk.gray('   ' + '─'.repeat(45)));
  console.log(chalk.gray('   House      Cusp'));
  console.log(chalk.gray('   ' + '─'.repeat(45)));

  chart.houses.cusps.forEach((cusp: number, index: number) => {
    const houseNum = (index + 1).toString().padStart(2);
    const special = index === 0 ? ' (ASC)' : index === 9 ? ' (MC)' : '';
    console.log(chalk.white(`   House ${houseNum}   ${formatDegree(cusp)}${chalk.gray(special)}`));
  });

  console.log(chalk.gray('   ' + '─'.repeat(45)));
  console.log();
  console.log(chalk.bold.cyan('═'.repeat(70)));
  console.log(chalk.green('✨ Houses calculated successfully!'));
  console.log();
}

/**
 * Compare multiple house systems
 */
async function compareHouseSystems(date: Date, location: GeoCoordinates) {
  console.log(chalk.cyan('\n🔍 Comparing house systems...\n'));

  const systems: HouseSystem[] = ['placidus', 'koch', 'equal', 'whole-sign'];
  const results = [];

  for (const system of systems) {
    const chart = await calculateChart(date, location, { houseSystem: system });
    results.push({ system, chart });
  }

  console.log(chalk.bold.cyan('═'.repeat(80)));
  console.log(chalk.bold.white('                    HOUSE SYSTEM COMPARISON'));
  console.log(chalk.bold.cyan('═'.repeat(80)));
  console.log();

  // Compare house 1 (ASC) across systems
  console.log(chalk.bold.yellow('House 1 (Ascendant):'));
  results.forEach(r => {
    console.log(chalk.white(`  ${r.system.padEnd(15)}: ${formatDegree(r.chart.houses.cusps[0])}`));
  });
  console.log();

  // Compare all houses in table format
  console.log(chalk.bold.yellow('All Houses:'));
  console.log(chalk.gray('  House  ' + systems.map(s => s.padEnd(18)).join('')));
  console.log(chalk.gray('  ' + '─'.repeat(80)));

  for (let i = 0; i < 12; i++) {
    const houseNum = (i + 1).toString().padStart(6);
    const cusps = results.map(r => formatDegree(r.chart.houses.cusps[i]).padEnd(18));
    console.log(chalk.white(`  ${houseNum}  ${cusps.join('')}`));
  }

  console.log();
  console.log(chalk.bold.cyan('═'.repeat(80)));
  console.log(chalk.green('✨ Comparison complete!'));
  console.log();
}

/**
 * Format degrees with sign
 */
function formatDegree(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const signDegree = normalized % 30;

  const signs = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir',
                 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];

  return `${signDegree.toFixed(2)}° ${signs[signIndex]}`;
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse();
}

export { program };
