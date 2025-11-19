/**
 * Chart Renderer Utilities
 *
 * Provides specialized rendering functions for astrological chart data:
 * - Birth information
 * - Planetary positions
 * - House cusps
 * - Angles (ASC, MC, DSC, IC)
 *
 * @module lib/display/renderers/chart-renderer
 */

import chalk from 'chalk';
import { drawHeader, drawSectionHeader, drawBorder } from './borders.js';
import { TableBuilder } from './table-builder.js';

/**
 * Planet symbol mapping
 */
const PLANET_SYMBOLS: Record<string, string> = {
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
  'South Node': '☋',
};

/**
 * Zodiac sign abbreviations
 */
const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const ZODIAC_SIGNS_SHORT = [
  'Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir',
  'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'
];

/**
 * Body data interface (matches Swiss Ephemeris output)
 */
export interface BodyData {
  name: string;
  longitude: number;
  latitude?: number;
  distance?: number;
  speed?: number;
  retrograde?: boolean;
  sign?: string;
  signDegree?: number;
}

/**
 * Angles data interface
 */
export interface AnglesData {
  ascendant: number;
  midheaven: number;
  descendant: number;
  imumCoeli: number;
}

/**
 * Location data interface
 */
export interface LocationData {
  latitude: number;
  longitude: number;
  name?: string;
}

/**
 * Get planet symbol for a given name
 *
 * @param name - Planet name
 * @returns Unicode symbol or bullet point
 */
export function getPlanetSymbol(name: string): string {
  return PLANET_SYMBOLS[name] || '•';
}

/**
 * Format degrees to sign notation (e.g., "15.45° Aries")
 *
 * @param degrees - Longitude in degrees (0-360)
 * @param useShortNames - Use abbreviated sign names (default: false)
 * @returns Formatted degree string
 *
 * @example
 * ```typescript
 * formatDegree(45.23); // "15.23° Taurus"
 * formatDegree(45.23, true); // "15.23° Tau"
 * ```
 */
export function formatDegree(degrees: number, useShortNames: boolean = false): string {
  const normalized = ((degrees % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const signDegree = normalized % 30;

  const signs = useShortNames ? ZODIAC_SIGNS_SHORT : ZODIAC_SIGNS;

  return `${signDegree.toFixed(2)}° ${signs[signIndex]}`;
}

/**
 * Render chart header
 *
 * @param title - Chart title
 * @param width - Header width (default: 75)
 * @returns Formatted header lines
 *
 * @example
 * ```typescript
 * const header = renderChartHeader('NATAL CHART');
 * console.log(header.join('\n'));
 * ```
 */
export function renderChartHeader(title: string, width: number = 75): string[] {
  return [
    drawHeader(title, width),
    ''
  ];
}

/**
 * Render birth information section
 *
 * @param birthDate - Birth date/time
 * @param location - Birth location
 * @param timezone - Optional timezone info
 * @returns Formatted birth info lines
 *
 * @example
 * ```typescript
 * const info = renderBirthInfo(
 *   new Date('1990-03-10T07:25:00Z'),
 *   { latitude: 15.83, longitude: 78.04, name: 'Hyderabad, India' }
 * );
 * ```
 */
export function renderBirthInfo(
  birthDate: Date,
  location: LocationData,
  timezone?: string
): string[] {
  const lines: string[] = [];

  lines.push(drawSectionHeader('📅', 'Birth Information', chalk.bold.yellow));

  const isoString = birthDate.toISOString();
  const [dateStr, timeWithMs] = isoString.split('T');
  const timeStr = timeWithMs?.split('.')[0] || '00:00:00';

  lines.push(chalk.greenBright(`   Date: ${dateStr}`));
  lines.push(chalk.greenBright(`   Time: ${timeStr} ${timezone || 'UTC'}`));
  lines.push(chalk.greenBright(`   Location: ${location.name || 'Unknown'}`));
  lines.push(chalk.greenBright(
    `   Coordinates: ${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°`
  ));
  lines.push('');

  return lines;
}

/**
 * Render planetary positions table
 *
 * @param bodies - Object containing planetary body data
 * @param options - Rendering options
 * @returns Formatted table string
 *
 * @example
 * ```typescript
 * const table = renderPlanetaryPositions({
 *   sun: { name: 'Sun', longitude: 349.85, retrograde: false, sign: 'Pisces', signDegree: 19.85 },
 *   moon: { name: 'Moon', longitude: 87.32, retrograde: false, sign: 'Gemini', signDegree: 27.32 }
 * });
 * ```
 */
export function renderPlanetaryPositions(
  bodies: Record<string, BodyData>,
  options: {
    includeHeader?: boolean;
    indent?: number;
    rowColor?: (str: string) => string;
    highlightRetrograde?: boolean;
  } = {}
): string {
  const {
    includeHeader = true,
    indent = 3,
    rowColor = chalk.whiteBright,
    highlightRetrograde = true,
  } = options;

  const lines: string[] = [];

  // Section header
  if (includeHeader) {
    lines.push(drawSectionHeader('🪐', 'Planetary Positions', chalk.bold.yellow));
  }

  // Build table
  const table = new TableBuilder()
    .addColumn({ header: 'Planet', width: 12, alignment: 'left' })
    .addColumn({ header: 'Longitude', width: 10, alignment: 'right' })
    .addColumn({ header: 'Sign', width: 15, alignment: 'left' })
    .addColumn({ header: 'Degree', width: 8, alignment: 'right' })
    .addColumn({ header: 'Retrograde', width: 10, alignment: 'center' })
    .setIndent(indent)
    .setHeaderColor(chalk.gray)
    .setSeparatorColor(chalk.gray);

  // Planet order
  const planetOrder = [
    'sun', 'moon', 'mercury', 'venus', 'mars',
    'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
    'chiron', 'lilith', 'northNode'
  ];

  // Add rows
  planetOrder.forEach(key => {
    const body = bodies[key];
    if (body) {
      const symbol = getPlanetSymbol(body.name);
      const name = `${symbol} ${body.name}`;
      const lon = `${body.longitude.toFixed(2)}°`;
      const sign = body.sign || '';
      const deg = body.signDegree !== undefined ? `${body.signDegree.toFixed(2)}°` : '';
      const retro = body.retrograde ? (highlightRetrograde ? chalk.red('R') : 'R') : '';

      table.addRow([name, lon, sign, deg, retro], rowColor);
    }
  });

  lines.push(table.build());
  lines.push('');

  return lines.join('\n');
}

/**
 * Render house cusps table
 *
 * @param cusps - Array of 12 house cusp longitudes
 * @param houseSystem - House system name
 * @param options - Rendering options
 * @returns Formatted table string
 *
 * @example
 * ```typescript
 * const table = renderHouseCusps(
 *   [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
 *   'Placidus'
 * );
 * ```
 */
export function renderHouseCusps(
  cusps: number[],
  houseSystem: string = 'placidus',
  options: {
    includeHeader?: boolean;
    indent?: number;
    useShortSigns?: boolean;
    highlightAngles?: boolean;
  } = {}
): string {
  const {
    includeHeader = true,
    indent = 3,
    useShortSigns = true,
    highlightAngles = true,
  } = options;

  const lines: string[] = [];

  // Section header
  if (includeHeader) {
    lines.push(drawSectionHeader('🏠', `Houses (${houseSystem})`, chalk.bold.yellow));
  }

  // Build table
  const table = new TableBuilder()
    .addColumn({ header: 'House', width: 8, alignment: 'left' })
    .addColumn({ header: 'Cusp', width: 18, alignment: 'left' })
    .addColumn({ header: '', width: 10, alignment: 'left' })
    .setIndent(indent)
    .setHeaderColor(chalk.gray)
    .setSeparatorColor(chalk.gray)
    .setShowHeader(false);

  // Add rows
  cusps.forEach((cusp, index) => {
    const houseNum = `House ${(index + 1).toString().padStart(2, ' ')}`;
    const cuspFormatted = formatDegree(cusp, useShortSigns);

    // Highlight special houses (ASC = House 1, MC = House 10)
    let special = '';
    if (highlightAngles) {
      if (index === 0) special = chalk.gray('(ASC)');
      if (index === 9) special = chalk.gray('(MC)');
    }

    const color = highlightAngles && (index === 0 || index === 9)
      ? chalk.magentaBright
      : chalk.white;

    table.addRow([houseNum, cuspFormatted, special], color);
  });

  lines.push(table.build());
  lines.push('');

  return lines.join('\n');
}

/**
 * Render angles (ASC, MC, DSC, IC)
 *
 * @param angles - Angles data
 * @param options - Rendering options
 * @returns Formatted angles section
 *
 * @example
 * ```typescript
 * const angles = renderAngles({
 *   ascendant: 120.45,
 *   midheaven: 210.33,
 *   descendant: 300.45,
 *   imumCoeli: 30.33
 * });
 * ```
 */
export function renderAngles(
  angles: AnglesData,
  options: {
    includeHeader?: boolean;
    useShortSigns?: boolean;
    indent?: number;
  } = {}
): string {
  const {
    includeHeader = true,
    useShortSigns = false,
    indent = 3,
  } = options;

  const lines: string[] = [];
  const indentation = ' '.repeat(indent);

  // Section header
  if (includeHeader) {
    lines.push(drawSectionHeader('🎯', 'Angles', chalk.bold.yellow));
  }

  lines.push(chalk.cyanBright(`${indentation}Ascendant (ASC): ${formatDegree(angles.ascendant, useShortSigns)}`));
  lines.push(chalk.cyanBright(`${indentation}Midheaven (MC):  ${formatDegree(angles.midheaven, useShortSigns)}`));
  lines.push(chalk.cyanBright(`${indentation}Descendant (DSC): ${formatDegree(angles.descendant, useShortSigns)}`));
  lines.push(chalk.cyanBright(`${indentation}Imum Coeli (IC):  ${formatDegree(angles.imumCoeli, useShortSigns)}`));
  lines.push('');

  return lines.join('\n');
}

/**
 * Render complete chart footer
 *
 * @param width - Footer width (default: 75)
 * @param successMessage - Optional success message
 * @returns Formatted footer lines
 */
export function renderChartFooter(
  width: number = 75,
  successMessage: string = '✨ Chart calculated successfully!'
): string[] {
  return [
    drawBorder(width, chalk.bold.cyan),
    chalk.green(successMessage),
    ''
  ];
}

/**
 * Render progression movement comparison
 *
 * @param natalBodies - Natal planetary positions
 * @param progressedBodies - Progressed planetary positions
 * @param options - Rendering options
 * @returns Formatted movement table
 */
export function renderProgressionMovement(
  natalBodies: Record<string, BodyData>,
  progressedBodies: Record<string, BodyData>,
  options: {
    includeHeader?: boolean;
    indent?: number;
    highlightThreshold?: number;
  } = {}
): string {
  const {
    includeHeader = true,
    indent = 3,
    highlightThreshold = 5,
  } = options;

  const lines: string[] = [];

  // Section header
  if (includeHeader) {
    lines.push(drawSectionHeader('📈', 'Progression Movement', chalk.bold.yellow));
  }

  // Build table
  const table = new TableBuilder()
    .addColumn({ header: 'Planet', width: 12, alignment: 'left' })
    .addColumn({ header: 'Natal', width: 15, alignment: 'left' })
    .addColumn({ header: 'Progressed', width: 15, alignment: 'left' })
    .addColumn({ header: 'Movement', width: 12, alignment: 'right' })
    .setIndent(indent)
    .setHeaderColor(chalk.gray)
    .setSeparatorColor(chalk.gray);

  // Planet order
  const planetOrder = [
    'sun', 'moon', 'mercury', 'venus', 'mars',
    'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'
  ];

  // Add rows
  planetOrder.forEach(key => {
    const natal = natalBodies[key];
    const progressed = progressedBodies[key];

    if (natal && progressed) {
      const symbol = getPlanetSymbol(natal.name);
      const name = `${symbol} ${natal.name}`;
      const natalPos = formatDegree(natal.longitude, true);
      const progressedPos = formatDegree(progressed.longitude, true);

      // Calculate movement (handle 360° wraparound)
      let movement = progressed.longitude - natal.longitude;
      if (movement > 180) movement -= 360;
      if (movement < -180) movement += 360;

      const movementStr = `${movement >= 0 ? '+' : ''}${movement.toFixed(2)}°`;

      // Highlight significant movement
      const rowColor = Math.abs(movement) > highlightThreshold
        ? chalk.greenBright
        : chalk.white;

      table.addRow([name, natalPos, progressedPos, movementStr], rowColor);
    }
  });

  lines.push(table.build());
  lines.push('');
  lines.push(chalk.dim(`   💫 Significant movement (>${highlightThreshold}°) highlighted in green`));
  lines.push('');

  return lines.join('\n');
}
