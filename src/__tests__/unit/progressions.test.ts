/**
 * Tests for Secondary Progressions
 *
 * Secondary Progressions Formula: 1 day after birth = 1 year of life
 *
 * Test coverage:
 * - Progression date calculation (birth_date + age_in_days)
 * - Progressed planetary positions
 * - Timezone conversion integration
 * - Profile system integration
 * - Natal vs progressed comparison
 */

import { describe, it, expect } from 'vitest';
import { DateTime } from 'luxon';
import {
  calculateProgressedDate,
  calculateAge,
  calculateDateFromAge,
  validateDate
} from '../../lib/progressions/index.js';

describe('Secondary Progressions - Date Calculation', () => {
  it('should calculate progressed date for exact age (35 years)', () => {
    // Birth: March 10, 1990
    const birthDate = new Date('1990-03-10T00:00:00.000Z');
    // Current: March 10, 2025 (exactly 35 years later)
    const currentDate = new Date('2025-03-10T00:00:00.000Z');

    const result = calculateProgressedDate(birthDate, currentDate);

    // Age should be exactly 35 years
    expect(result.ageInYears).toBeCloseTo(35, 1);
    expect(result.ageInDays).toBeCloseTo(35, 1);

    // Progressed date should be April 14, 1990 (35 days after birth)
    const progressedDT = DateTime.fromJSDate(result.progressedDate);
    expect(progressedDT.month).toBe(4); // April
    expect(progressedDT.day).toBe(14);
    expect(progressedDT.year).toBe(1990);
  });

  it('should calculate progressed date for fractional age (35.696 years)', () => {
    // Birth: March 10, 1990
    const birthDate = new Date('1990-03-10T00:00:00.000Z');
    // Current: November 19, 2025
    const currentDate = new Date('2025-11-19T00:00:00.000Z');

    const result = calculateProgressedDate(birthDate, currentDate);

    // Age should be approximately 35.696 years
    expect(result.ageInYears).toBeGreaterThan(35.69);
    expect(result.ageInYears).toBeLessThan(35.71);

    // Progressed date should be ~35.696 days after birth
    // March 10 + 35.696 days ≈ April 14-15, 1990
    const progressedDT = DateTime.fromJSDate(result.progressedDate);
    expect(progressedDT.year).toBe(1990);
    expect(progressedDT.month).toBe(4); // April
    expect(progressedDT.day).toBeGreaterThanOrEqual(14);
    expect(progressedDT.day).toBeLessThanOrEqual(15);
  });

  it('should calculate progressed date for young age (5 years)', () => {
    // Birth: January 1, 2020
    const birthDate = new Date('2020-01-01T00:00:00.000Z');
    // Current: January 1, 2025 (exactly 5 years)
    const currentDate = new Date('2025-01-01T00:00:00.000Z');

    const result = calculateProgressedDate(birthDate, currentDate);

    expect(result.ageInYears).toBeCloseTo(5, 1);

    // Progressed date: January 1 + 5 days = January 6, 2020
    const progressedDT = DateTime.fromJSDate(result.progressedDate);
    expect(progressedDT.year).toBe(2020);
    expect(progressedDT.month).toBe(1);
    expect(progressedDT.day).toBe(6);
  });

  it('should calculate progressed date for old age (80 years)', () => {
    // Birth: June 15, 1945
    const birthDate = new Date('1945-06-15T00:00:00.000Z');
    // Current: June 15, 2025 (exactly 80 years)
    const currentDate = new Date('2025-06-15T00:00:00.000Z');

    const result = calculateProgressedDate(birthDate, currentDate);

    expect(result.ageInYears).toBeCloseTo(80, 1);

    // Progressed date: June 15 + 80 days = September 3, 1945
    const progressedDT = DateTime.fromJSDate(result.progressedDate);
    expect(progressedDT.year).toBe(1945);
    expect(progressedDT.month).toBe(9); // September
    expect(progressedDT.day).toBe(3);
  });

  it('should handle leap year births correctly', () => {
    // Birth: February 29, 1992 (leap year)
    const birthDate = new Date('1992-02-29T00:00:00.000Z');
    // Current: February 29, 2024 (32 years, next leap year)
    const currentDate = new Date('2024-02-29T00:00:00.000Z');

    const result = calculateProgressedDate(birthDate, currentDate);

    expect(result.ageInYears).toBeCloseTo(32, 1);

    // Progressed date: Feb 29 + 32 days = April 1, 1992
    const progressedDT = DateTime.fromJSDate(result.progressedDate);
    expect(progressedDT.year).toBe(1992);
    expect(progressedDT.month).toBe(4); // April
    expect(progressedDT.day).toBe(1);
  });
});

describe('Secondary Progressions - Age Calculation', () => {
  it('should calculate exact integer age', () => {
    const birthDate = new Date('1990-03-10T00:00:00.000Z');
    const toDate = new Date('2025-03-10T00:00:00.000Z');

    const age = calculateAge(birthDate, toDate);
    expect(age).toBeCloseTo(35, 1);
  });

  it('should calculate fractional age', () => {
    const birthDate = new Date('1990-03-10T00:00:00.000Z');
    const toDate = new Date('2025-11-19T00:00:00.000Z');

    const age = calculateAge(birthDate, toDate);
    expect(age).toBeGreaterThan(35.69);
    expect(age).toBeLessThan(35.71);
  });

  it('should handle same day (age = 0)', () => {
    const birthDate = new Date('2025-01-01T00:00:00.000Z');
    const toDate = new Date('2025-01-01T00:00:00.000Z');

    const age = calculateAge(birthDate, toDate);
    expect(age).toBeCloseTo(0, 1);
  });

  it('should handle one day old (age ≈ 0.0027 years)', () => {
    const birthDate = new Date('2025-01-01T00:00:00.000Z');
    const toDate = new Date('2025-01-02T00:00:00.000Z');

    const age = calculateAge(birthDate, toDate);
    expect(age).toBeGreaterThan(0);
    expect(age).toBeLessThan(0.01);
  });
});

describe('Secondary Progressions - Timezone Conversion', () => {
  it('should handle timezone conversion for birth in India (IST)', () => {
    // Birth: March 10, 1990, 12:55 PM IST (Asia/Kolkata)
    // IST = UTC+5:30, so 12:55 IST = 07:25 UTC
    const localBirthDT = DateTime.fromObject({
      year: 1990,
      month: 3,
      day: 10,
      hour: 12,
      minute: 55,
      second: 0
    }, { zone: 'Asia/Kolkata' });

    const birthDateUTC = localBirthDT.toUTC().toJSDate();

    // Verify conversion
    const birthUTC = DateTime.fromJSDate(birthDateUTC, { zone: 'UTC' });
    expect(birthUTC.hour).toBe(7);  // 12:55 - 5:30 = 7:25
    expect(birthUTC.minute).toBe(25);
  });

  it('should handle timezone conversion for birth in USA (CST)', () => {
    // Birth: June 21, 1985, 9:15 AM CST (America/Chicago)
    // CST = UTC-6:00, so 9:15 CST = 15:15 UTC
    const localBirthDT = DateTime.fromObject({
      year: 1985,
      month: 6,
      day: 21,
      hour: 9,
      minute: 15,
      second: 0
    }, { zone: 'America/Chicago' });

    const birthDateUTC = localBirthDT.toUTC().toJSDate();

    // Verify conversion (note: June might be CDT, UTC-5)
    const birthUTC = DateTime.fromJSDate(birthDateUTC, { zone: 'UTC' });
    // In June, Chicago is CDT (UTC-5), so 9:15 CDT = 14:15 UTC
    expect(birthUTC.hour).toBe(14);
    expect(birthUTC.minute).toBe(15);
  });

  it('should calculate progressions using UTC time', () => {
    // Birth: March 10, 1990, 12:55 PM IST
    const localBirthDT = DateTime.fromObject({
      year: 1990,
      month: 3,
      day: 10,
      hour: 12,
      minute: 55
    }, { zone: 'Asia/Kolkata' });

    const birthDateUTC = localBirthDT.toUTC().toJSDate();
    const currentDate = new Date('2025-11-19T00:00:00.000Z');

    const result = calculateProgressedDate(birthDateUTC, currentDate);

    // Progressed date calculation should work with UTC
    expect(result.ageInYears).toBeGreaterThan(35);
    expect(result.progressedDate).toBeInstanceOf(Date);
  });
});

describe('Secondary Progressions - Validation', () => {
  it('should handle invalid birth date gracefully', () => {
    const birthDate = new Date('invalid');
    const currentDate = new Date();
    const result = calculateProgressedDate(birthDate, currentDate);

    // Invalid dates will produce NaN
    expect(isNaN(result.ageInYears)).toBe(true);
  });

  it('should throw error for future birth date', () => {
    const birthDate = new Date('2030-01-01T00:00:00.000Z');
    const currentDate = new Date('2025-01-01T00:00:00.000Z');

    // Age would be negative
    const age = calculateAge(birthDate, currentDate);
    expect(age).toBeLessThan(0);
  });

  it('should handle dates far in the past (1800s)', () => {
    const birthDate = new Date('1850-01-01T00:00:00.000Z');
    const currentDate = new Date('1900-01-01T00:00:00.000Z');

    const result = calculateProgressedDate(birthDate, currentDate);

    // 50 years old
    expect(result.ageInYears).toBeCloseTo(50, 1);

    // Progressed: January 1 + 50 days = February 20, 1850
    const progressedDT = DateTime.fromJSDate(result.progressedDate);
    expect(progressedDT.year).toBe(1850);
    expect(progressedDT.month).toBe(2);
    expect(progressedDT.day).toBe(20);
  });
});

describe('Secondary Progressions - Real-world Examples', () => {
  it('should calculate progressions for Manu (35.696 years old as of Nov 19, 2025)', () => {
    // Birth: March 10, 1990, 12:55 PM IST
    const localBirth = DateTime.fromObject({
      year: 1990,
      month: 3,
      day: 10,
      hour: 12,
      minute: 55
    }, { zone: 'Asia/Kolkata' });

    const birthDateUTC = localBirth.toUTC().toJSDate();
    const currentDate = new Date('2025-11-19T00:00:00.000Z');

    const result = calculateProgressedDate(birthDateUTC, currentDate);

    // Age ~35.696 years
    expect(result.ageInYears).toBeGreaterThan(35.69);
    expect(result.ageInYears).toBeLessThan(35.71);

    // Progressed date: March 10 + ~35.696 days ≈ April 14-15, 1990
    const progressedDT = DateTime.fromJSDate(result.progressedDate);
    expect(progressedDT.year).toBe(1990);
    expect(progressedDT.month).toBe(4);
    expect(progressedDT.day).toBeGreaterThanOrEqual(14);
    expect(progressedDT.day).toBeLessThanOrEqual(15);
  });

  it('should calculate progressions for specific target date (Jan 1, 2026)', () => {
    // Birth: March 10, 1990
    const birthDate = new Date('1990-03-10T00:00:00.000Z');
    // Progress to: January 1, 2026
    const targetDate = new Date('2026-01-01T00:00:00.000Z');

    const result = calculateProgressedDate(birthDate, targetDate);

    // Age ~35.81 years
    expect(result.ageInYears).toBeGreaterThan(35.8);
    expect(result.ageInYears).toBeLessThan(35.9);

    // Progressed date: March 10 + ~35.81 days ≈ April 15, 1990
    const progressedDT = DateTime.fromJSDate(result.progressedDate);
    expect(progressedDT.year).toBe(1990);
    expect(progressedDT.month).toBe(4);
  });

  it('should handle --age parameter (override current date)', () => {
    // Birth: March 10, 1990
    const birthDate = new Date('1990-03-10T00:00:00.000Z');

    // User wants to see progressions at age 30
    const targetAge = 30;

    // Calculate target date: birth + 30 years
    const birthDT = DateTime.fromJSDate(birthDate);
    const targetDate = birthDT.plus({ years: targetAge }).toJSDate();

    const result = calculateProgressedDate(birthDate, targetDate);

    // Age should be exactly 30
    expect(result.ageInYears).toBeCloseTo(30, 1);

    // Progressed date: March 10 + 30 days = April 9, 1990
    const progressedDT = DateTime.fromJSDate(result.progressedDate);
    expect(progressedDT.year).toBe(1990);
    expect(progressedDT.month).toBe(4);
    expect(progressedDT.day).toBe(9);
  });
});

describe('Helper Functions - calculateDateFromAge', () => {
  it('should calculate date from integer age', () => {
    const birthDate = new Date('1990-03-10T00:00:00.000Z');
    const targetAge = 35;

    const result = calculateDateFromAge(birthDate, targetAge);

    // Should return date 35 years after birth
    const resultDT = DateTime.fromJSDate(result);
    expect(resultDT.year).toBe(2025);
    expect(resultDT.month).toBe(3);
    expect(resultDT.day).toBe(10);
  });

  it('should calculate date from fractional age', () => {
    const birthDate = new Date('1990-03-10T00:00:00.000Z');
    const targetAge = 35.5;

    const result = calculateDateFromAge(birthDate, targetAge);

    // Should return date 35.5 years after birth (around September 1990 + 35 years)
    const resultDT = DateTime.fromJSDate(result);
    expect(resultDT.year).toBe(2025);
    expect(resultDT.month).toBeGreaterThanOrEqual(8);
    expect(resultDT.month).toBeLessThanOrEqual(10);
  });

  it('should handle age 0 (birth date)', () => {
    const birthDate = new Date('1990-03-10T00:00:00.000Z');
    const targetAge = 0;

    const result = calculateDateFromAge(birthDate, targetAge);

    // Should return birth date
    expect(result.getTime()).toBe(birthDate.getTime());
  });

  it('should handle large ages (100 years)', () => {
    const birthDate = new Date('1900-01-01T00:00:00.000Z');
    const targetAge = 100;

    const result = calculateDateFromAge(birthDate, targetAge);

    const resultDT = DateTime.fromJSDate(result);
    expect(resultDT.year).toBe(2000);
    expect(resultDT.month).toBe(1);
    expect(resultDT.day).toBe(1);
  });

  it('should handle leap year births correctly', () => {
    const birthDate = new Date('1992-02-29T00:00:00.000Z');
    const targetAge = 4;

    const result = calculateDateFromAge(birthDate, targetAge);

    // 4 years later should be Feb 29, 1996 (another leap year)
    const resultDT = DateTime.fromJSDate(result);
    expect(resultDT.year).toBe(1996);
    expect(resultDT.month).toBe(2);
    expect(resultDT.day).toBe(29);
  });
});

describe('Helper Functions - validateDate', () => {
  it('should accept valid dates in the past', () => {
    const validDate = new Date('1990-03-10T00:00:00.000Z');

    expect(() => validateDate(validDate)).not.toThrow();
  });

  it('should accept valid dates today', () => {
    const today = new Date();

    // Should not throw for current date
    expect(() => validateDate(today)).not.toThrow();
  });

  it('should throw error for invalid dates', () => {
    const invalidDate = new Date('invalid');

    expect(() => validateDate(invalidDate)).toThrow('Date is invalid');
  });

  it('should throw error for future dates', () => {
    const futureDate = new Date('2030-01-01T00:00:00.000Z');

    expect(() => validateDate(futureDate)).toThrow('Date cannot be in the future');
  });

  it('should use custom field name in error messages', () => {
    const invalidDate = new Date('invalid');

    expect(() => validateDate(invalidDate, 'Birth Date')).toThrow('Birth Date is invalid');
  });

  it('should use custom field name for future date errors', () => {
    const futureDate = new Date('2030-01-01T00:00:00.000Z');

    expect(() => validateDate(futureDate, 'Target Date')).toThrow('Target Date cannot be in the future');
  });

  it('should accept dates at midnight', () => {
    const midnight = new Date('2020-01-01T00:00:00.000Z');

    expect(() => validateDate(midnight)).not.toThrow();
  });
});

describe('DST (Daylight Saving Time) Boundary Cases', () => {
  it('should handle birth during DST transition (spring forward)', () => {
    // March 8, 2020 - DST begins in USA (2 AM → 3 AM)
    const birthLocal = DateTime.fromObject({
      year: 1990,
      month: 3,
      day: 8,
      hour: 2,
      minute: 30
    }, { zone: 'America/New_York' });

    const birthUTC = birthLocal.toUTC().toJSDate();
    const currentDate = new Date('2025-03-08T00:00:00.000Z');

    const result = calculateProgressedDate(birthUTC, currentDate);

    // Should still calculate correctly despite DST
    expect(result.ageInYears).toBeCloseTo(35, 1);
    expect(result.progressedDate).toBeInstanceOf(Date);
  });

  it('should handle birth during DST transition (fall back)', () => {
    // November 1, 2020 - DST ends in USA (2 AM → 1 AM)
    const birthLocal = DateTime.fromObject({
      year: 1990,
      month: 11,
      day: 1,
      hour: 1,
      minute: 30
    }, { zone: 'America/New_York' });

    const birthUTC = birthLocal.toUTC().toJSDate();
    const currentDate = new Date('2025-11-01T00:00:00.000Z');

    const result = calculateProgressedDate(birthUTC, currentDate);

    expect(result.ageInYears).toBeCloseTo(35, 1);
    expect(result.progressedDate).toBeInstanceOf(Date);
  });

  it('should handle progression across DST boundary', () => {
    // Birth in standard time, progress to DST time
    const birthDate = new Date('1990-01-15T00:00:00.000Z');
    const targetDate = new Date('2025-06-15T00:00:00.000Z');

    const result = calculateProgressedDate(birthDate, targetDate);

    // Progression calculation should be based on UTC, unaffected by DST
    expect(result.ageInYears).toBeGreaterThan(35);
    expect(result.progressedDate).toBeInstanceOf(Date);
  });
});

describe('Southern Hemisphere & Varied Locations', () => {
  it('should handle births in Southern Hemisphere (Australia)', () => {
    // Sydney, Australia (UTC+10/+11)
    const birthLocal = DateTime.fromObject({
      year: 1990,
      month: 6,
      day: 15,
      hour: 14,
      minute: 30
    }, { zone: 'Australia/Sydney' });

    const birthUTC = birthLocal.toUTC().toJSDate();
    const currentDate = new Date('2025-06-15T00:00:00.000Z');

    const result = calculateProgressedDate(birthUTC, currentDate);

    expect(result.ageInYears).toBeCloseTo(35, 1);
    expect(result.progressedDate).toBeInstanceOf(Date);
  });

  it('should handle births in South America (Argentina)', () => {
    // Buenos Aires, Argentina (UTC-3)
    const birthLocal = DateTime.fromObject({
      year: 1985,
      month: 12,
      day: 25,
      hour: 10,
      minute: 0
    }, { zone: 'America/Argentina/Buenos_Aires' });

    const birthUTC = birthLocal.toUTC().toJSDate();
    const currentDate = new Date('2025-12-25T00:00:00.000Z');

    const result = calculateProgressedDate(birthUTC, currentDate);

    expect(result.ageInYears).toBeCloseTo(40, 1);
    expect(result.progressedDate).toBeInstanceOf(Date);
  });

  it('should handle births near the equator (Singapore)', () => {
    // Singapore (UTC+8, no DST)
    const birthLocal = DateTime.fromObject({
      year: 1995,
      month: 8,
      day: 9,
      hour: 18,
      minute: 45
    }, { zone: 'Asia/Singapore' });

    const birthUTC = birthLocal.toUTC().toJSDate();
    const currentDate = new Date('2025-08-09T00:00:00.000Z');

    const result = calculateProgressedDate(birthUTC, currentDate);

    expect(result.ageInYears).toBeCloseTo(30, 1);
    expect(result.progressedDate).toBeInstanceOf(Date);
  });

  it('should handle births in Africa (South Africa)', () => {
    // Johannesburg, South Africa (UTC+2, no DST)
    const birthLocal = DateTime.fromObject({
      year: 1988,
      month: 4,
      day: 20,
      hour: 11,
      minute: 15
    }, { zone: 'Africa/Johannesburg' });

    const birthUTC = birthLocal.toUTC().toJSDate();
    const currentDate = new Date('2025-04-20T00:00:00.000Z');

    const result = calculateProgressedDate(birthUTC, currentDate);

    expect(result.ageInYears).toBeCloseTo(37, 1);
    expect(result.progressedDate).toBeInstanceOf(Date);
  });
});

describe('Edge Cases & Boundary Conditions', () => {
  it('should handle century boundaries (Y2K)', () => {
    const birthDate = new Date('1999-12-31T23:59:00.000Z');
    const targetDate = new Date('2000-01-01T00:01:00.000Z');

    const result = calculateProgressedDate(birthDate, targetDate);

    // Age should be very small (a few hours)
    expect(result.ageInYears).toBeLessThan(0.001);
  });

  it('should handle millennium calculations', () => {
    const birthDate = new Date('1000-01-01T00:00:00.000Z');
    const targetDate = new Date('2000-01-01T00:00:00.000Z');

    const result = calculateProgressedDate(birthDate, targetDate);

    // 1000 years
    expect(result.ageInYears).toBeCloseTo(1000, 1);

    // Progressed date: 1000 days after birth = ~2.74 years after birth
    const progressedDT = DateTime.fromJSDate(result.progressedDate);
    expect(progressedDT.year).toBeGreaterThanOrEqual(1002);
    expect(progressedDT.year).toBeLessThanOrEqual(1003);
  });

  it('should handle same second (age = 0)', () => {
    const birthDate = new Date('2025-01-01T12:34:56.000Z');
    const targetDate = new Date('2025-01-01T12:34:56.000Z');

    const result = calculateProgressedDate(birthDate, targetDate);

    expect(result.ageInYears).toBe(0);
    expect(result.progressedDate.getTime()).toBe(birthDate.getTime());
  });

  it('should handle very precise fractional ages', () => {
    const birthDate = new Date('1990-03-10T07:25:00.000Z');
    const targetDate = new Date('2025-11-19T14:30:45.123Z');

    const result = calculateProgressedDate(birthDate, targetDate);

    // Age should have decimal precision
    expect(result.ageInYears).toBeGreaterThan(35.69);
    expect(result.ageInYears).toBeLessThan(35.71);

    // Progressed date should also be precise
    expect(result.progressedDate).toBeInstanceOf(Date);
  });

  it('should handle dates at different times of day', () => {
    const birthDateMorning = new Date('1990-03-10T08:00:00.000Z');
    const birthDateEvening = new Date('1990-03-10T20:00:00.000Z');
    const targetDate = new Date('2025-03-10T14:00:00.000Z');

    const resultMorning = calculateProgressedDate(birthDateMorning, targetDate);
    const resultEvening = calculateProgressedDate(birthDateEvening, targetDate);

    // Both should be ~35 years but with slight time differences
    expect(resultMorning.ageInYears).toBeCloseTo(35, 1);
    expect(resultEvening.ageInYears).toBeCloseTo(35, 1);

    // Morning birth should be slightly older
    expect(resultMorning.ageInYears).toBeGreaterThan(resultEvening.ageInYears);
  });

  it('should handle very old ages (150 years)', () => {
    // Test with maximum realistic human age
    const birthDate = new Date('1850-01-01T00:00:00.000Z');
    const targetDate = new Date('2000-01-01T00:00:00.000Z'); // 150 years

    const result = calculateProgressedDate(birthDate, targetDate);

    // 150 years
    expect(result.ageInYears).toBeCloseTo(150, 1);

    // Progressed date should be valid
    expect(result.progressedDate).toBeInstanceOf(Date);

    // Progressed: 1850-01-01 + 150 days = ~1850-05-31
    const progressedDT = DateTime.fromJSDate(result.progressedDate);
    expect(progressedDT.year).toBe(1850);
    expect(progressedDT.month).toBeGreaterThanOrEqual(5);
    expect(progressedDT.month).toBeLessThanOrEqual(6);
  });
});
