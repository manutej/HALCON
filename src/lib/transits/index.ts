/**
 * Transits Calculation Library
 * @module lib/transits
 *
 * Calculates current planetary positions (transits) for any given date and location
 */

import { calculateChart } from '../swisseph/index.js';
import type { GeoCoordinates, ChartData } from '../swisseph/types.js';
import { calculateMoonPhase, type MoonPhase } from '../moon-phase/index.js';

export interface TransitData {
  timestamp: Date;
  location: GeoCoordinates;
  bodies: ChartData['bodies'];
  moonPhase: MoonPhase;
}

/**
 * Calculate transits (planetary positions) for a specific date
 *
 * @param date - Date/time for transit calculation
 * @param location - Geographic coordinates
 * @returns Transit data including planetary positions and moon phase
 */
export async function calculateTransits(
  date: Date,
  location: GeoCoordinates
): Promise<TransitData> {
  // Calculate chart for the given date
  const chart = await calculateChart(date, location, {
    houseSystem: 'placidus',
    includeChiron: true,
    includeLilith: true,
    includeNodes: true
  });

  // Calculate moon phase
  const moonPhase = calculateMoonPhase(
    chart.bodies.sun.longitude,
    chart.bodies.moon.longitude
  );

  return {
    timestamp: date,
    location,
    bodies: chart.bodies,
    moonPhase
  };
}

/**
 * Validate transit date
 *
 * @param date - Date to validate
 * @param fieldName - Field name for error messages
 */
export function validateTransitDate(date: Date, fieldName: string = 'Date'): void {
  if (isNaN(date.getTime())) {
    throw new Error(`${fieldName} is invalid`);
  }
}

/**
 * Format transit data for display
 *
 * @param transits - Transit data to format
 * @returns Formatted string for display
 */
export function formatTransitOutput(transits: TransitData): string {
  const lines: string[] = [];

  // Header
  lines.push('═'.repeat(75));
  lines.push('                    PLANETARY TRANSITS');
  lines.push('═'.repeat(75));
  lines.push('');

  // Date/Time
  const isoString = transits.timestamp.toISOString();
  const [dateStr, timeWithMs] = isoString.split('T');
  const timeStr = timeWithMs?.split('.')[0] || '00:00:00';

  lines.push(`Date: ${dateStr}`);
  lines.push(`Time: ${timeStr} UTC`);
  lines.push(`Location: ${transits.location.name || 'Unknown'}`);
  lines.push('');

  // Moon Phase
  lines.push(`Moon Phase: ${transits.moonPhase.name}`);
  lines.push(`Illumination: ${transits.moonPhase.illumination.toFixed(1)}%`);
  lines.push('');

  // Planetary Positions
  lines.push('Planetary Positions:');
  lines.push('─'.repeat(70));

  const planetOrder = [
    'sun', 'moon', 'mercury', 'venus', 'mars',
    'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'
  ];

  planetOrder.forEach(key => {
    const body = transits.bodies[key as keyof typeof transits.bodies];
    if (body) {
      const retrograde = body.retrograde ? ' (R)' : '';
      const sign = body.sign || 'Unknown';
      const signDegree = body.signDegree !== undefined ? body.signDegree.toFixed(2).padStart(5) : '0.00 ';
      lines.push(
        `${body.name.padEnd(10)}  ${body.longitude.toFixed(2).padStart(7)}°   ${sign.padEnd(15)}  ${signDegree}°${retrograde}`
      );
    }
  });

  lines.push('─'.repeat(70));
  lines.push('');

  return lines.join('\n');
}
