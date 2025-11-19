/**
 * Moon Phase Calculation Utilities
 * @module lib/moon-phase
 *
 * Calculates moon phases based on Sun-Moon angular separation
 * Formula: Moon Phase = (Moon Longitude - Sun Longitude) mod 360
 */

export interface MoonPhase {
  angle: number;
  illumination: number;
  name: string;
}

/**
 * Calculate moon phase from Sun and Moon longitudes
 *
 * @param sunLongitude - Sun's ecliptic longitude (0-360°)
 * @param moonLongitude - Moon's ecliptic longitude (0-360°)
 * @returns Moon phase information
 */
export function calculateMoonPhase(sunLongitude: number, moonLongitude: number): MoonPhase {
  // Calculate angular separation (Moon ahead of Sun)
  let angle = moonLongitude - sunLongitude;

  // Normalize to 0-360 range
  if (angle < 0) {
    angle += 360;
  }
  angle = angle % 360;

  // Calculate illumination percentage
  // 0° = New Moon (0% illuminated)
  // 90° = First Quarter (50% illuminated)
  // 180° = Full Moon (100% illuminated)
  // 270° = Third Quarter (50% illuminated)
  const illumination = 50 * (1 - Math.cos((angle * Math.PI) / 180));

  // Get phase name
  const name = getMoonPhaseName(angle);

  return {
    angle,
    illumination: Math.round(illumination * 10) / 10, // Round to 1 decimal
    name
  };
}

/**
 * Get moon phase name from angle
 *
 * Phase ranges:
 * - New Moon: 0° ± 2°
 * - Waxing Crescent: 3° to 87°
 * - First Quarter: 88° to 92°
 * - Waxing Gibbous: 93° to 177°
 * - Full Moon: 178° to 182°
 * - Waning Gibbous: 183° to 267°
 * - Third Quarter: 268° to 272°
 * - Waning Crescent: 273° to 357°
 *
 * @param angle - Angular separation in degrees (0-360°)
 * @returns Moon phase name
 */
export function getMoonPhaseName(angle: number): string {
  // Normalize angle
  const normalizedAngle = ((angle % 360) + 360) % 360;

  // Define phase ranges
  if (normalizedAngle < 2 || normalizedAngle >= 358) {
    return 'New Moon';
  } else if (normalizedAngle >= 2 && normalizedAngle < 88) {
    return 'Waxing Crescent';
  } else if (normalizedAngle >= 88 && normalizedAngle < 92) {
    return 'First Quarter';
  } else if (normalizedAngle >= 92 && normalizedAngle < 178) {
    return 'Waxing Gibbous';
  } else if (normalizedAngle >= 178 && normalizedAngle < 182) {
    return 'Full Moon';
  } else if (normalizedAngle >= 182 && normalizedAngle < 268) {
    return 'Waning Gibbous';
  } else if (normalizedAngle >= 268 && normalizedAngle < 272) {
    return 'Third Quarter';
  } else {
    // 272° to 358°
    return 'Waning Crescent';
  }
}

/**
 * Get moon phase symbol/emoji
 */
export function getMoonPhaseSymbol(phaseName: string): string {
  const symbols: Record<string, string> = {
    'New Moon': '🌑',
    'Waxing Crescent': '🌒',
    'First Quarter': '🌓',
    'Waxing Gibbous': '🌔',
    'Full Moon': '🌕',
    'Waning Gibbous': '🌖',
    'Third Quarter': '🌗',
    'Waning Crescent': '🌘'
  };

  return symbols[phaseName] || '🌙';
}
