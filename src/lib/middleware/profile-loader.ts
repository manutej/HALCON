/**
 * Profile Loader Middleware
 * Eliminates duplicate profile loading logic across commands
 *
 * This middleware consolidates ~220 lines of duplicated code from:
 * - src/commands/chart.ts (lines 38-90)
 * - src/commands/houses.ts (lines 42-95)
 * - src/commands/progressions.ts (lines 40-95)
 *
 * @module lib/middleware/profile-loader
 */

import { DateTime } from 'luxon';
import { getProfileManager } from '../profiles/index.js';
import type { UserProfile } from '../profiles/index.js';
import type { GeoCoordinates } from '../swisseph/types.js';

/**
 * Options for loading profile or parsing input
 */
export interface ProfileLoadOptions {
  dateArg: string;           // First CLI argument (profile name or date)
  timeArg: string;           // Second CLI argument (time)
  latitude?: string;         // Optional latitude for argument parsing
  longitude?: string;        // Optional longitude for argument parsing
  location?: string;         // Optional location name for argument parsing
}

/**
 * Result of profile loading or argument parsing
 */
export interface ProfileLoadResult {
  dateTime: Date;                   // Birth/calculation datetime (UTC)
  location: GeoCoordinates;         // Geographic coordinates
  profileName?: string;             // Profile name (if loaded from profile)
  timezone?: string;                // IANA timezone (if from profile)
  utcOffset?: string;               // UTC offset (if from profile)
  hasTimezoneWarning?: boolean;     // True if profile lacks timezone
}

/**
 * Custom error for profile loading failures
 */
export class ProfileLoadError extends Error {
  code: string;
  availableProfiles?: Array<{ name: string; location: string }>;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'ProfileLoadError';
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Check if a string is a profile name (not a date)
 *
 * Valid profile names:
 * - Only alphanumeric, underscore, and hyphen
 * - Not "now"
 * - Not date-like patterns (YYYY-MM-DD)
 *
 * @param input - String to check
 * @returns True if likely a profile name
 */
export function isProfileName(input: string): boolean {
  if (!input || input === 'now') {
    return false;
  }

  // Reject date-like patterns (contains digits followed by hyphen followed by digits)
  // This catches YYYY-MM-DD, YYYY-MM, etc.
  if (/\d+-\d+/.test(input)) {
    return false;
  }

  // Profile names: only letters, numbers, underscore, hyphen
  return /^[a-zA-Z0-9_-]+$/.test(input);
}

/**
 * Validate profile data integrity
 *
 * Checks:
 * - Date format (YYYY-MM-DD)
 * - Time format (HH:MM:SS)
 * - Latitude range (-90 to 90)
 * - Longitude range (-180 to 180)
 *
 * @param profile - Profile to validate
 * @throws ProfileLoadError if validation fails
 */
export function validateProfileInput(profile: UserProfile): void {
  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(profile.date)) {
    throw new ProfileLoadError(
      `Invalid date format in profile: ${profile.date}. Expected YYYY-MM-DD`,
      'INVALID_DATE_FORMAT'
    );
  }

  // Validate time format
  const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
  if (!timeRegex.test(profile.time)) {
    throw new ProfileLoadError(
      `Invalid time format in profile: ${profile.time}. Expected HH:MM:SS`,
      'INVALID_TIME_FORMAT'
    );
  }

  // Validate latitude
  if (profile.latitude < -90 || profile.latitude > 90) {
    throw new ProfileLoadError(
      `Invalid latitude: ${profile.latitude}. Must be between -90 and 90`,
      'INVALID_COORDINATES'
    );
  }

  // Validate longitude
  if (profile.longitude < -180 || profile.longitude > 180) {
    throw new ProfileLoadError(
      `Invalid longitude: ${profile.longitude}. Must be between -180 and 180`,
      'INVALID_COORDINATES'
    );
  }
}

/**
 * Convert profile timezone to UTC
 *
 * @param profile - Profile with timezone information
 * @returns UTC Date object
 * @throws ProfileLoadError if datetime is invalid
 */
function convertTimezoneToUTC(profile: UserProfile): Date {
  if (!profile.timezone) {
    // No timezone: treat as UTC (backward compatibility)
    return new Date(`${profile.date}T${profile.time}Z`);
  }

  // Convert local time to UTC using Luxon
  const localDateTime = DateTime.fromFormat(
    `${profile.date} ${profile.time}`,
    'yyyy-MM-dd HH:mm:ss',
    { zone: profile.timezone }
  );

  if (!localDateTime.isValid) {
    throw new ProfileLoadError(
      `Invalid datetime in profile: ${localDateTime.invalidReason}`,
      'INVALID_DATETIME'
    );
  }

  return localDateTime.toUTC().toJSDate();
}

/**
 * Parse arguments into datetime and location
 *
 * @param options - Parse options
 * @returns DateTime and location
 * @throws ProfileLoadError if parsing fails
 */
function parseArguments(options: ProfileLoadOptions): ProfileLoadResult {
  const { dateArg, timeArg, latitude, longitude, location } = options;

  // Validate coordinates are provided
  if (!latitude || !longitude) {
    throw new ProfileLoadError(
      'Missing required coordinates: latitude and longitude are required when not using a profile',
      'MISSING_COORDINATES'
    );
  }

  // Parse coordinates
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lon)) {
    throw new ProfileLoadError(
      `Invalid coordinate values: latitude="${latitude}", longitude="${longitude}"`,
      'INVALID_COORDINATES'
    );
  }

  // Validate coordinate ranges
  if (lat < -90 || lat > 90) {
    throw new ProfileLoadError(
      `Invalid latitude: ${lat}. Must be between -90 and 90`,
      'INVALID_COORDINATES'
    );
  }

  if (lon < -180 || lon > 180) {
    throw new ProfileLoadError(
      `Invalid longitude: ${lon}. Must be between -180 and 180`,
      'INVALID_COORDINATES'
    );
  }

  // Parse date/time
  let dateTime: Date;

  if (dateArg === 'now') {
    dateTime = new Date();
  } else {
    dateTime = new Date(`${dateArg}T${timeArg}Z`);

    if (isNaN(dateTime.getTime())) {
      throw new ProfileLoadError(
        `Invalid date/time format: "${dateArg}" "${timeArg}"`,
        'INVALID_DATETIME'
      );
    }
  }

  return {
    dateTime,
    location: {
      latitude: lat,
      longitude: lon,
      name: location || 'Unknown'
    }
  };
}

/**
 * Load profile from ProfileManager
 *
 * @param profileName - Name of profile to load
 * @returns Profile load result
 * @throws ProfileLoadError if profile not found or invalid
 */
function loadProfile(profileName: string): ProfileLoadResult {
  const profileManager = getProfileManager();
  const profile = profileManager.getProfile(profileName);

  if (!profile) {
    const error = new ProfileLoadError(
      `Profile "${profileName}" not found`,
      'PROFILE_NOT_FOUND'
    );

    // Attach available profiles for helpful error messages
    error.availableProfiles = profileManager.listProfiles().map(p => ({
      name: p.name,
      location: p.location
    }));

    throw error;
  }

  // Validate profile data
  validateProfileInput(profile);

  // Convert timezone to UTC
  const dateTime = convertTimezoneToUTC(profile);

  const result: ProfileLoadResult = {
    dateTime,
    location: {
      latitude: profile.latitude,
      longitude: profile.longitude,
      name: profile.location
    },
    profileName: profile.name,
    hasTimezoneWarning: !profile.timezone
  };

  // Only set timezone/utcOffset if they exist to satisfy exactOptionalPropertyTypes
  if (profile.timezone) {
    result.timezone = profile.timezone;
  }
  if (profile.utcOffset) {
    result.utcOffset = profile.utcOffset;
  }

  return result;
}

/**
 * Load profile or parse input arguments
 *
 * Main middleware function that:
 * 1. Detects if input is a profile name or raw data
 * 2. Loads from profile with timezone conversion (if profile)
 * 3. Parses arguments (if not profile)
 * 4. Validates all inputs
 * 5. Returns consistent result format
 *
 * @param options - Load options
 * @returns Profile load result with datetime and location
 * @throws ProfileLoadError if loading/parsing fails
 *
 * @example
 * // Load from profile
 * const result = await loadProfileOrInput({
 *   dateArg: 'manu',
 *   timeArg: '00:00:00'
 * });
 *
 * @example
 * // Parse from arguments
 * const result = await loadProfileOrInput({
 *   dateArg: '1990-03-10',
 *   timeArg: '12:55:00',
 *   latitude: '15.83',
 *   longitude: '78.04',
 *   location: 'Hyderabad, India'
 * });
 */
export async function loadProfileOrInput(
  options: ProfileLoadOptions
): Promise<ProfileLoadResult> {
  const { dateArg } = options;

  // Detect if dateArg is a profile name
  if (isProfileName(dateArg)) {
    // Load from profile
    return loadProfile(dateArg);
  } else {
    // Parse from arguments
    return parseArguments(options);
  }
}
