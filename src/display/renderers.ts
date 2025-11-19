/**
 * Display renderers for progressions
 * @module display/renderers
 */

import chalk from 'chalk';
import { DateTime } from 'luxon';
import type { GeoCoordinates } from '../lib/swisseph/types.js';
import { formatDegree } from '../lib/display/formatters.js';
import { getPlanetSymbol } from '../lib/display/symbols.js';

// PLANET_ORDER constant for display
const PLANET_ORDER = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'
] as const;

export interface ProgressionDisplayOptions {
  natalChart: any;
  progressedChart: any;
  birthDate: Date;
  targetDate: Date;
  progression: {
    progressedDate: Date;
    ageInYears: number;
    ageInDays: number;
  };
  age: number;
  location: GeoCoordinates;
  profileName?: string | undefined;
}

/**
 * Display progressions in human-readable format
 */
export function displayProgressions(options: ProgressionDisplayOptions): void {
  const { natalChart, progressedChart, birthDate, targetDate, progression, age, location, profileName } = options;
  
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
function displayPlanets(bodies: any, isProgressed: boolean): void {
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

      const color = isProgressed ? chalk.magentaBright : chalk.whiteBright;
      console.log(color(`   ${symbol} ${name}  ${lon}°   ${sign}  ${deg}°${retro}`));
    }
  });

  console.log(chalk.gray('   ' + '─'.repeat(70)));
}

/**
 * Display movement between natal and progressed positions
 */
function displayMovement(natalBodies: any, progressedBodies: any): void {
  console.log(chalk.gray('   ' + '─'.repeat(70)));
  console.log(chalk.gray('   Planet       Natal         Progressed      Movement'));
  console.log(chalk.gray('   ' + '─'.repeat(70)));

  PLANET_ORDER.forEach(key => {
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
