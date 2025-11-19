/**
 * @file formatters.ts
 * @description Display formatting utilities for astrological data
 *
 * Provides consistent formatting for:
 * - Degrees and zodiac positions
 * - Geographic coordinates
 * - Dates and times
 * - Angular measurements
 */

/**
 * Options for formatting degrees
 */
export interface FormatDegreeOptions {
  /** Number of decimal places (default: 2) */
  precision?: number;
  /** Sign format: 'full', 'abbreviated', or 'symbol' (default: 'full') */
  signFormat?: 'full' | 'abbreviated' | 'symbol';
  /** Include degrees-minutes-seconds format (default: false) */
  includeDMS?: boolean;
  /** Include seconds in DMS format (default: false) */
  includeSeconds?: boolean;
}

/**
 * Options for formatting coordinates
 */
export interface FormatCoordinatesOptions {
  /** Number of decimal places (default: 2) */
  precision?: number;
  /** Output format: 'decimal' or 'dms' (default: 'decimal') */
  format?: 'decimal' | 'dms';
}

/**
 * Options for formatting time
 */
export interface FormatTimeOptions {
  /** Use 12-hour format with AM/PM (default: false) */
  format12Hour?: boolean;
  /** Include seconds (default: true) */
  includeSeconds?: boolean;
}

/**
 * Options for formatting date
 */
export interface FormatDateOptions {
  /** Date format: 'iso', 'long', 'short' (default: 'iso') */
  format?: 'iso' | 'long' | 'short';
}

/**
 * Degrees, minutes, seconds object
 */
export interface DMSObject {
  degrees: number;
  minutes: number;
  seconds: number;
}

// Zodiac sign names
const ZODIAC_SIGNS_FULL = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const ZODIAC_SIGNS_ABBREVIATED = [
  'Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir',
  'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'
];

const ZODIAC_SIGNS_SYMBOLS = [
  '♈', '♉', '♊', '♋', '♌', '♍',
  '♎', '♏', '♐', '♑', '♒', '♓'
];

/**
 * Normalize angle to 0-360 range
 */
export function normalizeAngle(degrees: number): number {
  if (!isFinite(degrees)) {
    return 0;
  }

  let normalized = degrees % 360;

  if (normalized < 0) {
    normalized += 360;
  }

  // Handle JavaScript's -0 edge case
  if (Object.is(normalized, -0)) {
    normalized = 0;
  }

  return normalized;
}

/**
 * Convert decimal degrees to degrees-minutes-seconds
 */
export function degreesToDMS(degrees: number, precision: number = 0): DMSObject {
  const sign = degrees < 0 ? -1 : 1;
  const absDegrees = Math.abs(degrees);

  const d = Math.floor(absDegrees);
  const minFloat = (absDegrees - d) * 60;
  const m = Math.floor(minFloat);
  const s = (minFloat - m) * 60;

  return {
    degrees: d * sign,
    minutes: m,
    seconds: precision === 0 ? Math.round(s) : Number(s.toFixed(precision))
  };
}

/**
 * Convert degrees-minutes-seconds to decimal degrees
 */
export function DMStoDegrees(degrees: number, minutes: number, seconds: number): number {
  const sign = degrees < 0 ? -1 : 1;
  const absDegrees = Math.abs(degrees);

  return sign * (absDegrees + minutes / 60 + seconds / 3600);
}

/**
 * Format degrees as zodiac position
 */
export function formatDegree(degrees: number, options: FormatDegreeOptions = {}): string {
  if (!isFinite(degrees)) {
    return 'Invalid degree';
  }

  const {
    precision = 2,
    signFormat = 'full',
    includeDMS = false,
    includeSeconds = false
  } = options;

  const normalized = normalizeAngle(degrees);
  const signIndex = Math.floor(normalized / 30);
  const signDegree = normalized % 30;

  let signName: string;
  switch (signFormat) {
    case 'abbreviated':
      signName = ZODIAC_SIGNS_ABBREVIATED[signIndex] || 'Unknown';
      break;
    case 'symbol':
      signName = ZODIAC_SIGNS_SYMBOLS[signIndex] || '?';
      break;
    case 'full':
    default:
      signName = ZODIAC_SIGNS_FULL[signIndex] || 'Unknown';
  }

  let degreeStr: string;
  if (includeDMS) {
    const dms = degreesToDMS(signDegree, includeSeconds ? 0 : undefined);
    if (includeSeconds) {
      degreeStr = `${dms.degrees}°${dms.minutes.toString().padStart(2, '0')}'${dms.seconds.toString().padStart(2, '0')}"`;
    } else {
      degreeStr = `${dms.degrees}°${dms.minutes.toString().padStart(2, '0')}'`;
    }
  } else {
    if (precision === 0) {
      degreeStr = `${Math.round(signDegree)}°`;
    } else {
      degreeStr = `${signDegree.toFixed(precision)}°`;
    }
  }

  return `${degreeStr} ${signName}`;
}

/**
 * Format geographic coordinates
 */
export function formatCoordinates(
  latitude: number,
  longitude: number,
  options: FormatCoordinatesOptions = {}
): string {
  const { precision = 2, format = 'decimal' } = options;

  if (!isFinite(latitude) || !isFinite(longitude)) {
    return 'Invalid coordinates';
  }

  if (latitude < -90 || latitude > 90) {
    return 'Invalid coordinates';
  }

  if (longitude < -180 || longitude > 180) {
    return 'Invalid coordinates';
  }

  const latDir = latitude >= 0 ? 'N' : 'S';
  const lonDir = longitude >= 0 ? 'E' : 'W';

  const absLat = Math.abs(latitude);
  const absLon = Math.abs(longitude);

  if (format === 'dms') {
    const latDMS = degreesToDMS(absLat);
    const lonDMS = degreesToDMS(absLon);

    return `${latDMS.degrees}°${latDMS.minutes.toString().padStart(2, '0')}'${latDMS.seconds.toString().padStart(2, '0')}"${latDir}, ` +
           `${lonDMS.degrees}°${lonDMS.minutes.toString().padStart(2, '0')}'${lonDMS.seconds.toString().padStart(2, '0')}"${lonDir}`;
  } else {
    if (precision === 0) {
      return `${Math.round(absLat)}°${latDir}, ${Math.round(absLon)}°${lonDir}`;
    } else {
      return `${absLat.toFixed(precision)}°${latDir}, ${absLon.toFixed(precision)}°${lonDir}`;
    }
  }
}

/**
 * Format time from Date object
 */
export function formatTime(date: Date, options: FormatTimeOptions = {}): string {
  const { format12Hour = false, includeSeconds = true } = options;

  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  if (format12Hour) {
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    if (includeSeconds) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`;
    } else {
      return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
  } else {
    if (includeSeconds) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  }
}

/**
 * Format date from Date object
 */
export function formatDate(date: Date, options: FormatDateOptions = {}): string {
  const { format = 'iso' } = options;

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  switch (format) {
    case 'long': {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${monthNames[month]} ${day}, ${year}`;
    }

    case 'short': {
      const monthStr = (month + 1).toString().padStart(2, '0');
      const dayStr = day.toString().padStart(2, '0');
      return `${monthStr}/${dayStr}/${year}`;
    }

    case 'iso':
    default: {
      const monthStr = (month + 1).toString().padStart(2, '0');
      const dayStr = day.toString().padStart(2, '0');
      return `${year}-${monthStr}-${dayStr}`;
    }
  }
}
