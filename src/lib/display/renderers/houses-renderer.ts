/**
 * Display renderers for house cusps and angles
 * @module lib/display/renderers/houses-renderer
 */

import chalk from 'chalk';
import { formatDegree } from '../formatters.js';
import type { GeoCoordinates, HouseSystem } from '../../swisseph/types.js';

/**
 * Render house cusps and angles in formatted display
 */
export function renderHouses(
  chart: any,
  location: GeoCoordinates,
  date: Date,
  system: string
): void {
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
  console.log(chalk.white(`   Ascendant (ASC): ${formatDegree(chart.angles.ascendant, { signFormat: 'abbreviated' })}`));
  console.log(chalk.white(`   Midheaven (MC):  ${formatDegree(chart.angles.midheaven, { signFormat: 'abbreviated' })}`));
  console.log(chalk.white(`   Descendant (DSC): ${formatDegree(chart.angles.descendant, { signFormat: 'abbreviated' })}`));
  console.log(chalk.white(`   Imum Coeli (IC):  ${formatDegree(chart.angles.imumCoeli, { signFormat: 'abbreviated' })}`));
  console.log();

  // Houses
  console.log(chalk.bold.yellow('🏠 House Cusps:'));
  console.log(chalk.gray('   ' + '─'.repeat(45)));
  console.log(chalk.gray('   House      Cusp'));
  console.log(chalk.gray('   ' + '─'.repeat(45)));

  chart.houses.cusps.forEach((cusp: number, index: number) => {
    const houseNum = (index + 1).toString().padStart(2);
    const special = index === 0 ? ' (ASC)' : index === 9 ? ' (MC)' : '';
    console.log(chalk.white(`   House ${houseNum}   ${formatDegree(cusp, { signFormat: 'abbreviated' })}${chalk.gray(special)}`));
  });

  console.log(chalk.gray('   ' + '─'.repeat(45)));
  console.log();
  console.log(chalk.bold.cyan('═'.repeat(70)));
  console.log(chalk.green('✨ Houses calculated successfully!'));
  console.log();
}

/**
 * Render house system comparison table
 */
export function renderHouseComparison(
  results: Array<{ system: HouseSystem; chart: any }>
): void {
  const systems = results.map(r => r.system);

  console.log(chalk.bold.cyan('═'.repeat(80)));
  console.log(chalk.bold.white('                    HOUSE SYSTEM COMPARISON'));
  console.log(chalk.bold.cyan('═'.repeat(80)));
  console.log();

  // Compare house 1 (ASC) across systems
  console.log(chalk.bold.yellow('House 1 (Ascendant):'));
  results.forEach(r => {
    const ascendant = r.chart.houses.cusps[0];
    if (ascendant !== undefined) {
      console.log(chalk.white(`  ${r.system.padEnd(15)}: ${formatDegree(ascendant, { signFormat: 'abbreviated' })}`));
    }
  });
  console.log();

  // Compare all houses in table format
  console.log(chalk.bold.yellow('All Houses:'));
  console.log(chalk.gray('  House  ' + systems.map(s => s.padEnd(18)).join('')));
  console.log(chalk.gray('  ' + '─'.repeat(80)));

  for (let i = 0; i < 12; i++) {
    const houseNum = (i + 1).toString().padStart(6);
    const cusps = results.map(r => {
      const cusp = r.chart.houses.cusps[i];
      return cusp !== undefined ? formatDegree(cusp, { signFormat: 'abbreviated' }).padEnd(18) : 'N/A'.padEnd(18);
    });
    console.log(chalk.white(`  ${houseNum}  ${cusps.join('')}`));
  }

  console.log();
  console.log(chalk.bold.cyan('═'.repeat(80)));
  console.log(chalk.green('✨ Comparison complete!'));
  console.log();
}

/**
 * List available house systems
 */
export function listHouseSystems(): void {
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
