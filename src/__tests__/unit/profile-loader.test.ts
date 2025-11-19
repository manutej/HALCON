/**
 * Profile Loader Middleware Tests
 * Comprehensive test suite for profile loading and validation
 *
 * @module lib/middleware/__tests__/profile-loader
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { UserProfile } from '../../lib/profiles/index.js';

// Import functions to test (will be implemented)
import {
  loadProfileOrInput,
  validateProfileInput,
  isProfileName,
  type ProfileLoadOptions,
  ProfileLoadError
} from '../../lib/middleware/profile-loader.js';

// Mock profile manager
const mockProfileManager = {
  getProfile: vi.fn(),
  listProfiles: vi.fn()
};

vi.mock('../../lib/profiles/index.js', () => ({
  getProfileManager: () => mockProfileManager
}));

describe('Profile Loader Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isProfileName()', () => {
    it('should recognize valid profile names', () => {
      expect(isProfileName('manu')).toBe(true);
      expect(isProfileName('john_doe')).toBe(true);
      expect(isProfileName('test-profile')).toBe(true);
      expect(isProfileName('profile123')).toBe(true);
    });

    it('should reject date-like strings', () => {
      expect(isProfileName('2024-01-01')).toBe(false);
      expect(isProfileName('now')).toBe(false);
    });

    it('should reject invalid characters', () => {
      expect(isProfileName('test profile')).toBe(false); // space
      expect(isProfileName('test.profile')).toBe(false); // dot
      expect(isProfileName('test@profile')).toBe(false); // special char
    });

    it('should reject empty strings', () => {
      expect(isProfileName('')).toBe(false);
    });
  });

  describe('validateProfileInput()', () => {
    it('should validate correct profile data', () => {
      const profile: UserProfile = {
        name: 'test',
        date: '1990-03-10',
        time: '12:55:00',
        timezone: 'Asia/Kolkata',
        utcOffset: '+05:30',
        latitude: 15.83,
        longitude: 78.04,
        location: 'Hyderabad, India',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      expect(() => validateProfileInput(profile)).not.toThrow();
    });

    it('should throw on invalid date format', () => {
      const profile = {
        name: 'test',
        date: '1990/03/10', // Wrong format
        time: '12:55:00',
        latitude: 15.83,
        longitude: 78.04,
        location: 'Test',
        createdAt: '',
        updatedAt: ''
      };

      expect(() => validateProfileInput(profile as UserProfile)).toThrow(ProfileLoadError);
    });

    it('should throw on invalid time format', () => {
      const profile = {
        name: 'test',
        date: '1990-03-10',
        time: '12:55', // Missing seconds
        latitude: 15.83,
        longitude: 78.04,
        location: 'Test',
        createdAt: '',
        updatedAt: ''
      };

      expect(() => validateProfileInput(profile as UserProfile)).toThrow(ProfileLoadError);
    });

    it('should throw on invalid coordinates', () => {
      const profile = {
        name: 'test',
        date: '1990-03-10',
        time: '12:55:00',
        latitude: 95, // Invalid: > 90
        longitude: 78.04,
        location: 'Test',
        createdAt: '',
        updatedAt: ''
      };

      expect(() => validateProfileInput(profile as UserProfile)).toThrow(ProfileLoadError);
    });

    it('should throw on invalid longitude', () => {
      const profile = {
        name: 'test',
        date: '1990-03-10',
        time: '12:55:00',
        latitude: 15.83,
        longitude: 200, // Invalid: > 180
        location: 'Test',
        createdAt: '',
        updatedAt: ''
      };

      expect(() => validateProfileInput(profile as UserProfile)).toThrow(ProfileLoadError);
    });
  });

  describe('loadProfileOrInput() - Profile Loading', () => {
    it('should load valid profile with timezone conversion', async () => {
      const mockProfile: UserProfile = {
        name: 'manu',
        date: '1990-03-10',
        time: '12:55:00',
        timezone: 'Asia/Kolkata',
        utcOffset: '+05:30',
        latitude: 15.83,
        longitude: 78.04,
        location: 'Kurnool, India',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      mockProfileManager.getProfile.mockReturnValue(mockProfile);

      const options: ProfileLoadOptions = {
        dateArg: 'manu',
        timeArg: '00:00:00'
      };

      const result = await loadProfileOrInput(options);

      expect(result.dateTime).toBeInstanceOf(Date);
      expect(result.location.latitude).toBe(15.83);
      expect(result.location.longitude).toBe(78.04);
      expect(result.location.name).toBe('Kurnool, India');
      expect(result.profileName).toBe('manu');
      expect(result.timezone).toBe('Asia/Kolkata');

      // Verify timezone conversion (local to UTC)
      // 1990-03-10 12:55:00 IST (+05:30) = 1990-03-10 07:25:00 UTC
      expect(result.dateTime.toISOString()).toBe('1990-03-10T07:25:00.000Z');
    });

    it('should load profile without timezone (backward compatibility)', async () => {
      const mockProfile: UserProfile = {
        name: 'legacy',
        date: '1990-03-10',
        time: '12:55:00',
        // No timezone field
        latitude: 15.83,
        longitude: 78.04,
        location: 'Test Location',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      mockProfileManager.getProfile.mockReturnValue(mockProfile);

      const options: ProfileLoadOptions = {
        dateArg: 'legacy',
        timeArg: '00:00:00'
      };

      const result = await loadProfileOrInput(options);

      expect(result.dateTime).toBeInstanceOf(Date);
      expect(result.timezone).toBeUndefined();
      expect(result.hasTimezoneWarning).toBe(true);

      // Should treat as UTC when no timezone
      expect(result.dateTime.toISOString()).toBe('1990-03-10T12:55:00.000Z');
    });

    it('should throw ProfileLoadError when profile not found', async () => {
      mockProfileManager.getProfile.mockReturnValue(null);
      mockProfileManager.listProfiles.mockReturnValue([
        { name: 'john', location: 'New York' },
        { name: 'jane', location: 'London' }
      ]);

      const options: ProfileLoadOptions = {
        dateArg: 'nonexistent',
        timeArg: '00:00:00'
      };

      await expect(loadProfileOrInput(options)).rejects.toThrow(ProfileLoadError);
      await expect(loadProfileOrInput(options)).rejects.toThrow('Profile "nonexistent" not found');
    });

    it('should include available profiles in error message', async () => {
      mockProfileManager.getProfile.mockReturnValue(null);
      mockProfileManager.listProfiles.mockReturnValue([
        { name: 'manu', location: 'Kurnool, India', date: '1990-03-10', time: '12:55:00', latitude: 15.83, longitude: 78.04, createdAt: '', updatedAt: '' }
      ]);

      const options: ProfileLoadOptions = {
        dateArg: 'unknown',
        timeArg: '00:00:00'
      };

      try {
        await loadProfileOrInput(options);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ProfileLoadError);
        expect((error as ProfileLoadError).availableProfiles).toEqual([
          { name: 'manu', location: 'Kurnool, India' }
        ]);
      }
    });

    it('should handle invalid datetime in profile', async () => {
      const mockProfile: UserProfile = {
        name: 'invalid',
        date: '1990-13-45', // Invalid date
        time: '12:55:00',
        timezone: 'Asia/Kolkata',
        latitude: 15.83,
        longitude: 78.04,
        location: 'Test',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      mockProfileManager.getProfile.mockReturnValue(mockProfile);

      const options: ProfileLoadOptions = {
        dateArg: 'invalid',
        timeArg: '00:00:00'
      };

      await expect(loadProfileOrInput(options)).rejects.toThrow(ProfileLoadError);
    });
  });

  describe('loadProfileOrInput() - Argument Parsing', () => {
    it('should parse date and time from arguments', async () => {
      const options: ProfileLoadOptions = {
        dateArg: '2024-06-15',
        timeArg: '14:30:00',
        latitude: '40.7128',
        longitude: '-74.0060',
        location: 'New York, NY'
      };

      const result = await loadProfileOrInput(options);

      expect(result.dateTime).toBeInstanceOf(Date);
      expect(result.dateTime.toISOString()).toBe('2024-06-15T14:30:00.000Z');
      expect(result.location.latitude).toBe(40.7128);
      expect(result.location.longitude).toBe(-74.006);
      expect(result.location.name).toBe('New York, NY');
      expect(result.profileName).toBeUndefined();
    });

    it('should handle "now" as current time', async () => {
      const beforeTime = new Date();

      const options: ProfileLoadOptions = {
        dateArg: 'now',
        timeArg: '00:00:00',
        latitude: '0',
        longitude: '0'
      };

      const result = await loadProfileOrInput(options);
      const afterTime = new Date();

      expect(result.dateTime.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(result.dateTime.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it('should throw when required coordinates missing', async () => {
      const options: ProfileLoadOptions = {
        dateArg: '2024-06-15',
        timeArg: '14:30:00'
        // Missing latitude and longitude
      };

      await expect(loadProfileOrInput(options)).rejects.toThrow(ProfileLoadError);
      await expect(loadProfileOrInput(options)).rejects.toThrow('latitude and longitude are required');
    });

    it('should throw on invalid date format', async () => {
      const options: ProfileLoadOptions = {
        dateArg: 'invalid-date',
        timeArg: '14:30:00',
        latitude: '0',
        longitude: '0'
      };

      await expect(loadProfileOrInput(options)).rejects.toThrow(ProfileLoadError);
    });

    it('should parse coordinates as numbers', async () => {
      const options: ProfileLoadOptions = {
        dateArg: '2024-06-15',
        timeArg: '14:30:00',
        latitude: '40.7128',
        longitude: '-74.0060'
      };

      const result = await loadProfileOrInput(options);

      expect(typeof result.location.latitude).toBe('number');
      expect(typeof result.location.longitude).toBe('number');
    });

    it('should throw on invalid coordinate values', async () => {
      const options: ProfileLoadOptions = {
        dateArg: '2024-06-15',
        timeArg: '14:30:00',
        latitude: 'invalid',
        longitude: '0'
      };

      await expect(loadProfileOrInput(options)).rejects.toThrow(ProfileLoadError);
    });

    it('should use default location name when not provided', async () => {
      const options: ProfileLoadOptions = {
        dateArg: '2024-06-15',
        timeArg: '14:30:00',
        latitude: '0',
        longitude: '0'
      };

      const result = await loadProfileOrInput(options);

      expect(result.location.name).toBe('Unknown');
    });
  });

  describe('ProfileLoadError', () => {
    it('should create error with message and code', () => {
      const error = new ProfileLoadError('Test error', 'PROFILE_NOT_FOUND');

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('PROFILE_NOT_FOUND');
      expect(error.name).toBe('ProfileLoadError');
    });

    it('should support available profiles in error', () => {
      const error = new ProfileLoadError('Profile not found', 'PROFILE_NOT_FOUND');
      error.availableProfiles = [
        { name: 'test1', location: 'Location 1' },
        { name: 'test2', location: 'Location 2' }
      ];

      expect(error.availableProfiles).toHaveLength(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle profile with minimal data', async () => {
      const mockProfile: UserProfile = {
        name: 'minimal',
        date: '2000-01-01',
        time: '00:00:00',
        latitude: 0,
        longitude: 0,
        location: 'Null Island',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      mockProfileManager.getProfile.mockReturnValue(mockProfile);

      const options: ProfileLoadOptions = {
        dateArg: 'minimal',
        timeArg: '00:00:00'
      };

      const result = await loadProfileOrInput(options);

      expect(result.dateTime).toBeInstanceOf(Date);
      expect(result.location.latitude).toBe(0);
      expect(result.location.longitude).toBe(0);
    });

    it('should handle extreme valid coordinates', async () => {
      const options: ProfileLoadOptions = {
        dateArg: '2024-01-01',
        timeArg: '00:00:00',
        latitude: '89.99', // Near North Pole
        longitude: '179.99' // Near Date Line
      };

      const result = await loadProfileOrInput(options);

      expect(result.location.latitude).toBe(89.99);
      expect(result.location.longitude).toBe(179.99);
    });

    it('should handle negative coordinates', async () => {
      const options: ProfileLoadOptions = {
        dateArg: '2024-01-01',
        timeArg: '00:00:00',
        latitude: '-33.8688', // Sydney
        longitude: '151.2093'
      };

      const result = await loadProfileOrInput(options);

      expect(result.location.latitude).toBe(-33.8688);
      expect(result.location.longitude).toBe(151.2093);
    });

    it('should handle leap year date', async () => {
      const options: ProfileLoadOptions = {
        dateArg: '2024-02-29', // Leap year
        timeArg: '00:00:00',
        latitude: '0',
        longitude: '0'
      };

      const result = await loadProfileOrInput(options);

      expect(result.dateTime.toISOString()).toContain('2024-02-29');
    });
  });
});
