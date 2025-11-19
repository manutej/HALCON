/**
 * Secondary Progressions Utilities
 *
 * Secondary Progressions Formula: 1 day after birth = 1 year of life
 *
 * @module lib/progressions
 */

import { DateTime } from 'luxon';

/**
 * Result from calculating a progressed date
 */
export interface ProgressionResult {
  /** The progressed date (birth_date + age_in_days) */
  progressedDate: Date;
  /** Age in years at the target date */
  ageInYears: number;
  /** Age in days (same as ageInYears for secondary progressions) */
  ageInDays: number;
}

/**
 * Calculate the progressed date for secondary progressions
 * Formula: progressed_date = birth_date + (age_in_years × 1 day)
 *
 * @param birthDate - The birth date (UTC)
 * @param currentDate - The date to progress to (usually today)
 * @returns Progression result with progressed date and age information
 *
 * @example
 * ```typescript
 * const birthDate = new Date('1990-03-10T07:25:00.000Z');
 * const currentDate = new Date('2025-11-19T00:00:00.000Z');
 * const result = calculateProgressedDate(birthDate, currentDate);
 * // result.ageInYears ≈ 35.696
 * // result.progressedDate ≈ April 15, 1990
 * ```
 */
export function calculateProgressedDate(
  birthDate: Date,
  currentDate: Date
): ProgressionResult {
  const birthDT = DateTime.fromJSDate(birthDate);
  const currentDT = DateTime.fromJSDate(currentDate);

  // Calculate exact age in years (with decimals)
  const ageInYears = currentDT.diff(birthDT, 'years').years;

  // For secondary progressions: 1 year = 1 day
  const ageInDays = ageInYears;

  // Calculate progressed date: birth + ageInDays
  const progressedDT = birthDT.plus({ days: ageInDays });

  return {
    progressedDate: progressedDT.toJSDate(),
    ageInYears,
    ageInDays
  };
}

/**
 * Calculate age from birth date to a specific date
 *
 * @param birthDate - The birth date
 * @param toDate - The date to calculate age for
 * @returns Age in years (with decimal precision)
 *
 * @example
 * ```typescript
 * const birthDate = new Date('1990-03-10T00:00:00.000Z');
 * const toDate = new Date('2025-11-19T00:00:00.000Z');
 * const age = calculateAge(birthDate, toDate); // ≈ 35.696 years
 * ```
 */
export function calculateAge(birthDate: Date, toDate: Date): number {
  const birthDT = DateTime.fromJSDate(birthDate);
  const toDT = DateTime.fromJSDate(toDate);
  return toDT.diff(birthDT, 'years').years;
}

/**
 * Calculate date from age
 *
 * @param birthDate - The birth date
 * @param age - The age in years
 * @returns The date when the person reaches that age
 *
 * @example
 * ```typescript
 * const birthDate = new Date('1990-03-10T00:00:00.000Z');
 * const date = calculateDateFromAge(birthDate, 35);
 * // Returns approximately March 10, 2025
 * ```
 */
export function calculateDateFromAge(birthDate: Date, age: number): Date {
  const birthDT = DateTime.fromJSDate(birthDate);
  return birthDT.plus({ years: age }).toJSDate();
}

/**
 * Validate that a date is valid and not in the future
 *
 * @param date - The date to validate
 * @param fieldName - Name of the field for error messages
 * @throws Error if date is invalid or in the future
 */
export function validateDate(date: Date, fieldName: string = 'Date'): void {
  if (isNaN(date.getTime())) {
    throw new Error(`${fieldName} is invalid`);
  }

  if (date.getTime() > Date.now()) {
    throw new Error(`${fieldName} cannot be in the future`);
  }
}
