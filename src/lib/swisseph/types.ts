/**
 * Swiss Ephemeris Type Definitions
 * @module lib/swisseph/types
 */

/**
 * Geographic coordinates
 */
export interface GeoCoordinates {
  latitude: number;   // Degrees (-90 to 90)
  longitude: number;  // Degrees (-180 to 180)
  altitude?: number;  // Meters above sea level (optional)
  name?: string;      // Location name (optional)
}

/**
 * House system types supported by Swiss Ephemeris
 */
export type HouseSystem =
  | 'placidus'      // P - Placidus (most common)
  | 'koch'          // K - Koch
  | 'porphyrius'    // O - Porphyrius
  | 'regiomontanus' // R - Regiomontanus
  | 'campanus'      // C - Campanus
  | 'equal'         // A - Equal (from Ascendant)
  | 'whole-sign'    // W - Whole Sign
  | 'meridian'      // X - Axial rotation (Meridian)
  | 'morinus'       // M - Morinus
  | 'alcabitus';    // B - Alcabitus

/**
 * Celestial body with position and velocity
 */
export interface CelestialBody {
  name: string;           // Body name (e.g., "Sun", "Moon")
  longitude: number;      // Ecliptic longitude (0-360°)
  latitude: number;       // Ecliptic latitude
  distance: number;       // Distance from Earth (AU)
  longitudeSpeed: number; // Daily motion in longitude
  latitudeSpeed: number;  // Daily motion in latitude
  distanceSpeed: number;  // Daily change in distance
  sign: string;           // Zodiac sign name
  signDegree: number;     // Degrees within sign (0-30)
  retrograde: boolean;    // Is planet retrograde?
}

/**
 * Angles (important chart points)
 */
export interface Angles {
  ascendant: number;  // ASC - Rising sign (1st house cusp)
  midheaven: number;  // MC - Midheaven (10th house cusp)
  descendant: number; // DSC - Descendant (7th house cusp)
  imumCoeli: number;  // IC - Imum Coeli (4th house cusp)
}

/**
 * House cusps
 */
export interface Houses {
  system: HouseSystem;  // House system used
  cusps: number[];      // 12 house cusps (degrees 0-360)
}

/**
 * Complete chart data
 */
export interface ChartData {
  // Metadata
  timestamp: Date;
  location: GeoCoordinates;
  julianDay: number;

  // Celestial bodies
  bodies: {
    // Traditional planets
    sun: CelestialBody;
    moon: CelestialBody;
    mercury: CelestialBody;
    venus: CelestialBody;
    mars: CelestialBody;
    jupiter: CelestialBody;
    saturn: CelestialBody;
    uranus: CelestialBody;
    neptune: CelestialBody;
    pluto: CelestialBody;

    // Additional points
    chiron: CelestialBody;      // ⚷ Chiron
    lilith: CelestialBody;      // ⚸ True Black Moon Lilith
    meanLilith: CelestialBody;  // Mean Lilith
    northNode: CelestialBody;   // True North Node
    southNode: CelestialBody;   // South Node
  };

  // Angles
  angles: Angles;

  // Houses
  houses: Houses;
}

/**
 * Options for chart calculation
 */
export interface ChartOptions {
  houseSystem?: HouseSystem;     // Default: 'placidus'
  includeChiron?: boolean;        // Default: true
  includeLilith?: boolean;        // Default: true
  includeNodes?: boolean;         // Default: true
}

/**
 * Swiss Ephemeris planet IDs
 * @see https://www.astro.com/swisseph/swephprg.htm
 */
export enum SwissEphPlanet {
  SUN = 0,
  MOON = 1,
  MERCURY = 2,
  VENUS = 3,
  MARS = 4,
  JUPITER = 5,
  SATURN = 6,
  URANUS = 7,
  NEPTUNE = 8,
  PLUTO = 9,
  MEAN_NODE = 10,
  TRUE_NODE = 11,
  CHIRON = 15,
  LILITH = 12,      // Mean Lilith (Osculating)
  TRUE_LILITH = 13  // True/Osculating Black Moon
}

/**
 * Zodiac signs
 */
export const ZODIAC_SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces'
] as const;

export type ZodiacSign = typeof ZODIAC_SIGNS[number];

/**
 * Get zodiac sign from longitude
 */
export function getZodiacSign(longitude: number): ZodiacSign {
  const normalized = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  return ZODIAC_SIGNS[signIndex];
}

/**
 * Get degrees within sign from longitude
 */
export function getSignDegree(longitude: number): number {
  const normalized = ((longitude % 360) + 360) % 360;
  return normalized % 30;
}
