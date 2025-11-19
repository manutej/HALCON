/**
 * @file formatters.test.ts
 * @description Comprehensive tests for display formatting utilities
 *
 * Tests follow AAA (Arrange, Act, Assert) pattern
 * Coverage target: 100%
 */

import { describe, it, expect } from 'vitest';
import {
  formatDegree,
  formatCoordinates,
  formatTime,
  formatDate,
  normalizeAngle,
  degreesToDMS,
  DMStoDegrees
} from '../../../../lib/display/formatters.js';

describe('formatters', () => {
  describe('formatDegree', () => {
    describe('basic formatting', () => {
      it('should format 0 degrees as Aries', () => {
        const result = formatDegree(0);
        expect(result).toBe('0.00° Aries');
      });

      it('should format 30 degrees as Taurus', () => {
        const result = formatDegree(30);
        expect(result).toBe('0.00° Taurus');
      });

      it('should format mid-sign degrees correctly', () => {
        const result = formatDegree(45.5);
        expect(result).toBe('15.50° Taurus');
      });

      it('should format degrees in each zodiac sign', () => {
        const signs = [
          { degrees: 0, expected: '0.00° Aries' },
          { degrees: 30, expected: '0.00° Taurus' },
          { degrees: 60, expected: '0.00° Gemini' },
          { degrees: 90, expected: '0.00° Cancer' },
          { degrees: 120, expected: '0.00° Leo' },
          { degrees: 150, expected: '0.00° Virgo' },
          { degrees: 180, expected: '0.00° Libra' },
          { degrees: 210, expected: '0.00° Scorpio' },
          { degrees: 240, expected: '0.00° Sagittarius' },
          { degrees: 270, expected: '0.00° Capricorn' },
          { degrees: 300, expected: '0.00° Aquarius' },
          { degrees: 330, expected: '0.00° Pisces' }
        ];

        signs.forEach(({ degrees, expected }) => {
          expect(formatDegree(degrees)).toBe(expected);
        });
      });
    });

    describe('angle normalization', () => {
      it('should normalize negative angles', () => {
        const result = formatDegree(-30);
        expect(result).toBe('0.00° Pisces'); // 330 degrees (Pisces: 330-360°)
      });

      it('should normalize angles > 360', () => {
        const result = formatDegree(390);
        expect(result).toBe('0.00° Taurus'); // 30 degrees
      });

      it('should handle multiple rotations', () => {
        const result = formatDegree(720 + 45);
        expect(result).toBe('15.00° Taurus');
      });

      it('should handle large negative angles', () => {
        const result = formatDegree(-390);
        expect(result).toBe('0.00° Pisces'); // 330 degrees (Pisces: 330-360°)
      });
    });

    describe('precision options', () => {
      it('should format with 0 decimal places', () => {
        const result = formatDegree(45.678, { precision: 0 });
        expect(result).toBe('16° Taurus');
      });

      it('should format with 1 decimal place', () => {
        const result = formatDegree(45.678, { precision: 1 });
        expect(result).toBe('15.7° Taurus');
      });

      it('should format with 2 decimal places (default)', () => {
        const result = formatDegree(45.678);
        expect(result).toBe('15.68° Taurus');
      });

      it('should format with 4 decimal places for high precision', () => {
        const result = formatDegree(45.678912, { precision: 4 });
        expect(result).toBe('15.6789° Taurus');
      });
    });

    describe('sign format options', () => {
      it('should use full sign names by default', () => {
        const result = formatDegree(45);
        expect(result).toBe('15.00° Taurus');
      });

      it('should use abbreviated sign names', () => {
        const result = formatDegree(45, { signFormat: 'abbreviated' });
        expect(result).toBe('15.00° Tau');
      });

      it('should use symbol sign format', () => {
        const result = formatDegree(45, { signFormat: 'symbol' });
        expect(result).toBe('15.00° ♉');
      });

      it('should format all signs with abbreviated format', () => {
        const abbreviations = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir',
                              'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];

        abbreviations.forEach((abbr, index) => {
          const degrees = index * 30;
          const result = formatDegree(degrees, { signFormat: 'abbreviated' });
          expect(result).toContain(abbr);
        });
      });
    });

    describe('DMS (Degrees-Minutes-Seconds) format', () => {
      it('should format with degrees and minutes', () => {
        const result = formatDegree(45.5, { includeDMS: true });
        expect(result).toBe("15°30' Taurus");
      });

      it('should format with degrees, minutes, and seconds', () => {
        const result = formatDegree(45.508333, { includeDMS: true, includeSeconds: true });
        expect(result).toBe("15°30'30\" Taurus");
      });

      it('should handle zero minutes', () => {
        const result = formatDegree(45, { includeDMS: true });
        expect(result).toBe("15°00' Taurus");
      });

      it('should round seconds correctly', () => {
        const result = formatDegree(45.508472, { includeDMS: true, includeSeconds: true });
        expect(result).toBe("15°30'30\" Taurus"); // 15.508472° = 15° 30' 30.4992" → rounds to 30"
      });
    });

    describe('edge cases', () => {
      it('should handle exactly 360 degrees', () => {
        const result = formatDegree(360);
        expect(result).toBe('0.00° Aries');
      });

      it('should handle 29.99 degrees (end of sign)', () => {
        const result = formatDegree(29.99);
        expect(result).toBe('29.99° Aries');
      });

      it('should handle very small numbers', () => {
        const result = formatDegree(0.001);
        expect(result).toBe('0.00° Aries');
      });

      it('should handle NaN gracefully', () => {
        const result = formatDegree(NaN);
        expect(result).toBe('Invalid degree');
      });

      it('should handle Infinity gracefully', () => {
        const result = formatDegree(Infinity);
        expect(result).toBe('Invalid degree');
      });

      it('should handle -Infinity gracefully', () => {
        const result = formatDegree(-Infinity);
        expect(result).toBe('Invalid degree');
      });
    });

    describe('real-world astrological positions', () => {
      it('should format Sun at 15° Aries', () => {
        const result = formatDegree(15);
        expect(result).toBe('15.00° Aries');
      });

      it('should format Moon at 23°45 Scorpio', () => {
        const result = formatDegree(213.75);
        expect(result).toBe('3.75° Scorpio');
      });

      it('should format Ascendant at 3.72° Cancer', () => {
        const result = formatDegree(93.72);
        expect(result).toBe('3.72° Cancer');
      });
    });
  });

  describe('formatCoordinates', () => {
    describe('basic formatting', () => {
      it('should format positive latitude and longitude', () => {
        const result = formatCoordinates(40.7128, -74.0060);
        expect(result).toBe('40.71°N, 74.01°W');
      });

      it('should format negative latitude (South)', () => {
        const result = formatCoordinates(-33.8688, 151.2093);
        expect(result).toBe('33.87°S, 151.21°E');
      });

      it('should format equator and prime meridian', () => {
        const result = formatCoordinates(0, 0);
        expect(result).toBe('0.00°N, 0.00°E');
      });
    });

    describe('precision options', () => {
      it('should format with 0 decimal places', () => {
        const result = formatCoordinates(40.7128, -74.0060, { precision: 0 });
        expect(result).toBe('41°N, 74°W');
      });

      it('should format with 2 decimal places (default)', () => {
        const result = formatCoordinates(40.7128, -74.0060);
        expect(result).toBe('40.71°N, 74.01°W');
      });

      it('should format with 4 decimal places for GPS precision', () => {
        const result = formatCoordinates(40.7128, -74.0060, { precision: 4 });
        expect(result).toBe('40.7128°N, 74.0060°W');
      });
    });

    describe('DMS format', () => {
      it('should format in degrees-minutes-seconds', () => {
        const result = formatCoordinates(40.7128, -74.0060, { format: 'dms' });
        expect(result).toBe("40°42'46\"N, 74°00'22\"W");
      });

      it('should handle zero degrees in DMS', () => {
        const result = formatCoordinates(0, 0, { format: 'dms' });
        expect(result).toBe("0°00'00\"N, 0°00'00\"E");
      });
    });

    describe('edge cases', () => {
      it('should handle maximum latitude (90°)', () => {
        const result = formatCoordinates(90, 0);
        expect(result).toBe('90.00°N, 0.00°E');
      });

      it('should handle minimum latitude (-90°)', () => {
        const result = formatCoordinates(-90, 0);
        expect(result).toBe('90.00°S, 0.00°E');
      });

      it('should handle maximum longitude (180°)', () => {
        const result = formatCoordinates(0, 180);
        expect(result).toBe('0.00°N, 180.00°E');
      });

      it('should handle minimum longitude (-180°)', () => {
        const result = formatCoordinates(0, -180);
        expect(result).toBe('0.00°N, 180.00°W');
      });

      it('should handle invalid latitude (> 90)', () => {
        const result = formatCoordinates(100, 0);
        expect(result).toBe('Invalid coordinates');
      });

      it('should handle invalid longitude (> 180)', () => {
        const result = formatCoordinates(0, 200);
        expect(result).toBe('Invalid coordinates');
      });
    });

    describe('real-world locations', () => {
      it('should format New York City', () => {
        const result = formatCoordinates(40.7128, -74.0060);
        expect(result).toBe('40.71°N, 74.01°W');
      });

      it('should format Kurnool, India', () => {
        const result = formatCoordinates(15.83, 78.04);
        expect(result).toBe('15.83°N, 78.04°E');
      });

      it('should format Sydney, Australia', () => {
        const result = formatCoordinates(-33.8688, 151.2093);
        expect(result).toBe('33.87°S, 151.21°E');
      });

      it('should format Greenwich, UK', () => {
        const result = formatCoordinates(51.4778, 0.0);
        expect(result).toBe('51.48°N, 0.00°E');
      });
    });
  });

  describe('normalizeAngle', () => {
    it('should return 0-360 range for positive angles', () => {
      expect(normalizeAngle(45)).toBe(45);
      expect(normalizeAngle(180)).toBe(180);
      expect(normalizeAngle(359)).toBe(359);
    });

    it('should normalize angles >= 360', () => {
      expect(normalizeAngle(360)).toBe(0);
      expect(normalizeAngle(390)).toBe(30);
      expect(normalizeAngle(720)).toBe(0);
    });

    it('should normalize negative angles', () => {
      expect(normalizeAngle(-30)).toBe(330);
      expect(normalizeAngle(-90)).toBe(270);
      expect(normalizeAngle(-360)).toBe(0);
    });

    it('should handle decimal angles', () => {
      expect(normalizeAngle(45.5)).toBeCloseTo(45.5, 2);
      expect(normalizeAngle(360.25)).toBeCloseTo(0.25, 2);
      expect(normalizeAngle(-45.75)).toBeCloseTo(314.25, 2);
    });
  });

  describe('degreesToDMS', () => {
    it('should convert whole degrees', () => {
      const result = degreesToDMS(45);
      expect(result).toEqual({ degrees: 45, minutes: 0, seconds: 0 });
    });

    it('should convert degrees with minutes', () => {
      const result = degreesToDMS(45.5);
      expect(result).toEqual({ degrees: 45, minutes: 30, seconds: 0 });
    });

    it('should convert degrees with minutes and seconds', () => {
      const result = degreesToDMS(45.508333);
      expect(result.degrees).toBe(45);
      expect(result.minutes).toBe(30);
      expect(result.seconds).toBeCloseTo(30, 0);
    });

    it('should handle negative degrees', () => {
      const result = degreesToDMS(-45.5);
      expect(result).toEqual({ degrees: -45, minutes: 30, seconds: 0 });
    });

    it('should round seconds to specified precision', () => {
      const result = degreesToDMS(45.508472, 0);
      expect(result.seconds).toBe(30); // 15.508472° = 15° 30' 30.4992" → rounds to 30"
    });
  });

  describe('DMStoDegrees', () => {
    it('should convert whole degrees', () => {
      expect(DMStoDegrees(45, 0, 0)).toBe(45);
    });

    it('should convert degrees and minutes', () => {
      expect(DMStoDegrees(45, 30, 0)).toBe(45.5);
    });

    it('should convert degrees, minutes, and seconds', () => {
      const result = DMStoDegrees(45, 30, 30);
      expect(result).toBeCloseTo(45.508333, 5);
    });

    it('should handle negative degrees', () => {
      expect(DMStoDegrees(-45, 30, 0)).toBe(-45.5);
    });

    it('should handle maximum values (89°59\'59")', () => {
      const result = DMStoDegrees(89, 59, 59);
      expect(result).toBeCloseTo(89.999722, 5);
    });
  });

  describe('formatTime', () => {
    it('should format time in 24-hour format', () => {
      const date = new Date('2025-01-01T14:30:00Z');
      const result = formatTime(date);
      expect(result).toBe('14:30:00');
    });

    it('should format midnight correctly', () => {
      const date = new Date('2025-01-01T00:00:00Z');
      const result = formatTime(date);
      expect(result).toBe('00:00:00');
    });

    it('should format with AM/PM option', () => {
      const date = new Date('2025-01-01T14:30:00Z');
      const result = formatTime(date, { format12Hour: true });
      expect(result).toBe('2:30:00 PM');
    });

    it('should exclude seconds when option is set', () => {
      const date = new Date('2025-01-01T14:30:45Z');
      const result = formatTime(date, { includeSeconds: false });
      expect(result).toBe('14:30');
    });
  });

  describe('formatDate', () => {
    it('should format date in ISO format', () => {
      const date = new Date('2025-01-15T12:00:00Z');
      const result = formatDate(date);
      expect(result).toBe('2025-01-15');
    });

    it('should format with long format', () => {
      const date = new Date('2025-01-15T12:00:00Z');
      const result = formatDate(date, { format: 'long' });
      expect(result).toMatch(/January 15, 2025/);
    });

    it('should format with short format', () => {
      const date = new Date('2025-01-15T12:00:00Z');
      const result = formatDate(date, { format: 'short' });
      expect(result).toBe('01/15/2025');
    });
  });

  describe('integration scenarios', () => {
    it('should format a complete chart position with all options', () => {
      const longitude = 213.75;

      // Default format
      expect(formatDegree(longitude)).toBe('3.75° Scorpio');

      // Abbreviated
      expect(formatDegree(longitude, { signFormat: 'abbreviated' })).toBe('3.75° Sco');

      // Symbol
      expect(formatDegree(longitude, { signFormat: 'symbol' })).toBe('3.75° ♏');

      // DMS
      expect(formatDegree(longitude, { includeDMS: true })).toBe("3°45' Scorpio");
    });

    it('should format a complete birth location', () => {
      const lat = 15.83;
      const lon = 78.04;

      // Default
      expect(formatCoordinates(lat, lon)).toBe('15.83°N, 78.04°E');

      // High precision
      expect(formatCoordinates(lat, lon, { precision: 4 })).toBe('15.8300°N, 78.0400°E');

      // DMS
      expect(formatCoordinates(lat, lon, { format: 'dms' })).toBe("15°49'48\"N, 78°02'24\"E");
    });
  });
});
