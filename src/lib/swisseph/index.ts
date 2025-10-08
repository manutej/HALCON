/**
 * Swiss Ephemeris Wrapper
 * @module lib/swisseph
 *
 * Provides a clean TypeScript interface to the Swiss Ephemeris library
 * Calculates planetary positions, houses, and angles
 */

import swisseph from 'swisseph';
import type {
  ChartData,
  ChartOptions,
  GeoCoordinates,
  CelestialBody,
  HouseSystem,
  Angles,
  Houses
} from './types';
import { getZodiacSign, getSignDegree, SwissEphPlanet } from './types';

// Initialize Swiss Ephemeris
swisseph.swe_set_ephe_path(__dirname + '/../../../node_modules/swisseph/ephe');

/**
 * Calculate complete chart data
 */
export async function calculateChart(
  date: Date | string | number,
  location: GeoCoordinates,
  options: ChartOptions = {}
): Promise<ChartData> {
  // Validate inputs
  validateDate(date);
  validateLocation(location);

  // Parse options
  const {
    houseSystem = 'placidus',
    includeChiron = true,
    includeLilith = true,
    includeNodes = true
  } = options;

  // Convert date to Date object
  const timestamp = parseDate(date);

  // Calculate Julian Day
  const julianDay = calculateJulianDay(timestamp);

  // Calculate all planetary positions
  const bodies = await calculateAllBodies(julianDay, {
    includeChiron,
    includeLilith,
    includeNodes
  });

  // Calculate houses and angles
  const { houses, angles } = calculateHousesAndAngles(
    julianDay,
    location,
    houseSystem
  );

  return {
    timestamp,
    location,
    julianDay,
    bodies,
    angles,
    houses
  };
}

/**
 * Calculate Julian Day from Date
 */
function calculateJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // JS months are 0-indexed
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;

  const result = swisseph.swe_julday(
    year,
    month,
    day,
    hour,
    swisseph.SE_GREG_CAL
  );

  return result;
}

/**
 * Calculate all celestial bodies
 */
async function calculateAllBodies(
  julianDay: number,
  options: {
    includeChiron: boolean;
    includeLilith: boolean;
    includeNodes: boolean;
  }
): Promise<ChartData['bodies']> {
  const flags = swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED;

  // Calculate traditional planets
  const sun = calculateBody(julianDay, SwissEphPlanet.SUN, 'Sun', flags);
  const moon = calculateBody(julianDay, SwissEphPlanet.MOON, 'Moon', flags);
  const mercury = calculateBody(julianDay, SwissEphPlanet.MERCURY, 'Mercury', flags);
  const venus = calculateBody(julianDay, SwissEphPlanet.VENUS, 'Venus', flags);
  const mars = calculateBody(julianDay, SwissEphPlanet.MARS, 'Mars', flags);
  const jupiter = calculateBody(julianDay, SwissEphPlanet.JUPITER, 'Jupiter', flags);
  const saturn = calculateBody(julianDay, SwissEphPlanet.SATURN, 'Saturn', flags);
  const uranus = calculateBody(julianDay, SwissEphPlanet.URANUS, 'Uranus', flags);
  const neptune = calculateBody(julianDay, SwissEphPlanet.NEPTUNE, 'Neptune', flags);
  const pluto = calculateBody(julianDay, SwissEphPlanet.PLUTO, 'Pluto', flags);

  // Calculate additional points
  const chiron = calculateBody(julianDay, SwissEphPlanet.CHIRON, 'Chiron', flags);
  const lilith = calculateBody(julianDay, SwissEphPlanet.TRUE_LILITH, 'Lilith', flags);
  const meanLilith = calculateBody(julianDay, SwissEphPlanet.LILITH, 'Mean Lilith', flags);
  const northNode = calculateBody(julianDay, SwissEphPlanet.TRUE_NODE, 'North Node', flags);

  // Calculate South Node as opposite of North Node
  const southNode: CelestialBody = {
    ...northNode,
    name: 'South Node',
    longitude: (northNode.longitude + 180) % 360,
    sign: getZodiacSign((northNode.longitude + 180) % 360),
    signDegree: getSignDegree((northNode.longitude + 180) % 360)
  };

  return {
    sun,
    moon,
    mercury,
    venus,
    mars,
    jupiter,
    saturn,
    uranus,
    neptune,
    pluto,
    chiron,
    lilith,
    meanLilith,
    northNode,
    southNode
  };
}

/**
 * Calculate single celestial body
 */
function calculateBody(
  julianDay: number,
  planetId: number,
  name: string,
  flags: number
): CelestialBody {
  const result = swisseph.swe_calc_ut(julianDay, planetId, flags);

  if (result.error || result.rflag < 0) {
    throw new Error(`Failed to calculate ${name}: ${result.error || 'calculation error'}`);
  }

  const longitude = result.longitude;
  const latitude = result.latitude;
  const distance = result.distance;
  const longitudeSpeed = result.longitudeSpeed;
  const latitudeSpeed = result.latitudeSpeed;
  const distanceSpeed = result.distanceSpeed;

  const sign = getZodiacSign(longitude);
  const signDegree = getSignDegree(longitude);
  const retrograde = longitudeSpeed < 0;

  return {
    name,
    longitude,
    latitude,
    distance,
    longitudeSpeed,
    latitudeSpeed,
    distanceSpeed,
    sign,
    signDegree,
    retrograde
  };
}

/**
 * Calculate houses and angles
 */
function calculateHousesAndAngles(
  julianDay: number,
  location: GeoCoordinates,
  houseSystem: HouseSystem
): { houses: Houses; angles: Angles } {
  // Map our house system names to Swiss Ephemeris codes
  const houseSystemMap: Record<HouseSystem, string> = {
    'placidus': 'P',
    'koch': 'K',
    'porphyrius': 'O',
    'regiomontanus': 'R',
    'campanus': 'C',
    'equal': 'A',
    'whole-sign': 'W',
    'meridian': 'X',
    'morinus': 'M',
    'alcabitus': 'B'
  };

  const systemCode = houseSystemMap[houseSystem];

  const result = swisseph.swe_houses(
    julianDay,
    location.latitude,
    location.longitude,
    systemCode
  );

  if (result.error) {
    throw new Error(`Failed to calculate houses: ${result.error}`);
  }

  // Extract house cusps (all 12 houses)
  const cusps = result.house;

  // Extract angles
  const ascendant = result.ascendant;
  const midheaven = result.mc;
  const descendant = (ascendant + 180) % 360;
  const imumCoeli = (midheaven + 180) % 360;

  return {
    houses: {
      system: houseSystem,
      cusps
    },
    angles: {
      ascendant,
      midheaven,
      descendant,
      imumCoeli
    }
  };
}

/**
 * Parse date from various formats
 */
function parseDate(date: Date | string | number): Date {
  if (date instanceof Date) {
    return date;
  }
  if (typeof date === 'string' || typeof date === 'number') {
    return new Date(date);
  }
  throw new Error('Invalid date format');
}

/**
 * Validate date
 */
function validateDate(date: Date | string | number): void {
  const parsed = parseDate(date);
  if (isNaN(parsed.getTime())) {
    throw new Error('Invalid date');
  }
}

/**
 * Validate geographic coordinates
 */
function validateLocation(location: GeoCoordinates): void {
  if (location.latitude < -90 || location.latitude > 90) {
    throw new Error('Latitude must be between -90 and 90 degrees');
  }
  if (location.longitude < -180 || location.longitude > 180) {
    throw new Error('Longitude must be between -180 and 180 degrees');
  }
}

// Export types
export * from './types';
