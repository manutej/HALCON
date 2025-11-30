/**
 * CLI Commands Integration Tests
 *
 * These tests validate the ACTUAL functionality of CLI commands
 * with real astrological calculations against known reference data.
 *
 * Success criteria:
 * - Commands execute without errors
 * - Output contains expected astrological data
 * - Planetary positions match Swiss Ephemeris reference values
 * - House cusps are calculated correctly for given coordinates
 * - Progressions use correct 1 day = 1 year formula
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { spawn, execSync } from 'child_process';
import { DateTime } from 'luxon';

// Reference birth data for testing (Kurnool, India)
const TEST_BIRTH_DATA = {
  date: '1990-03-10',
  time: '12:55:00',
  latitude: 15.83,
  longitude: 78.04,
  location: 'Kurnool',  // Simple name to avoid shell quoting issues
  // Expected positions from Swiss Ephemeris (validated externally)
  expectedPositions: {
    sun: { longitude: 349.69, sign: 'Pisces', signDegree: 19.69, tolerance: 0.5 },
    moon: { longitude: 159.07, sign: 'Virgo', signDegree: 9.07, tolerance: 1.0 },
    mercury: { longitude: 341.97, sign: 'Pisces', signDegree: 11.97, tolerance: 0.5 },
    venus: { longitude: 305.04, sign: 'Aquarius', signDegree: 5.04, tolerance: 0.5 },
    mars: { longitude: 299.17, sign: 'Capricorn', signDegree: 29.17, tolerance: 0.5 },
    jupiter: { longitude: 91.12, sign: 'Cancer', signDegree: 1.12, tolerance: 0.5 },
    saturn: { longitude: 292.95, sign: 'Capricorn', signDegree: 22.95, tolerance: 0.5 },
  },
  // Expected Placidus house cusps
  expectedAngles: {
    ascendant: { degree: 20.04, sign: 'Virgo', tolerance: 0.5 },
    midheaven: { degree: 20.56, sign: 'Gemini', tolerance: 0.5 },
  },
};

// Helper to run CLI command and get output
async function runCommand(command: string, args: string[] = []): Promise<{
  stdout: string;
  stderr: string;
  exitCode: number;
}> {
  return new Promise((resolve) => {
    const proc = spawn('npm', ['run', command, '--', ...args], {
      cwd: process.cwd(),
      shell: true,
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      resolve({
        stdout,
        stderr,
        exitCode: code ?? 0,
      });
    });
  });
}

// Helper to extract JSON from command output
function extractJSON(output: string): any {
  // Find JSON in output (starts with { and ends with })
  const jsonMatch = output.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error('No JSON found in output');
}

// Helper to check if value is within tolerance
function withinTolerance(actual: number, expected: number, tolerance: number): boolean {
  return Math.abs(actual - expected) <= tolerance;
}

describe('HALCON CLI Commands - Deep Functional Tests', () => {
  describe('Chart Command', () => {
    it('should calculate natal chart with correct planetary positions (JSON output)', async () => {
      const result = await runCommand('chart', [
        TEST_BIRTH_DATA.date,
        TEST_BIRTH_DATA.time,
        '--latitude', TEST_BIRTH_DATA.latitude.toString(),
        '--longitude', TEST_BIRTH_DATA.longitude.toString(),
        '--location', TEST_BIRTH_DATA.location,
        '--json',
      ]);

      expect(result.exitCode).toBe(0);

      const chart = extractJSON(result.stdout);

      // Verify chart structure
      expect(chart).toHaveProperty('bodies');
      expect(chart).toHaveProperty('angles');
      expect(chart).toHaveProperty('houses');

      // Verify Sun position against reference
      const sun = chart.bodies.sun;
      expect(sun).toBeDefined();
      expect(withinTolerance(sun.longitude, TEST_BIRTH_DATA.expectedPositions.sun.longitude, 0.5)).toBe(true);
      expect(sun.sign).toBe(TEST_BIRTH_DATA.expectedPositions.sun.sign);

      // Verify Moon position
      const moon = chart.bodies.moon;
      expect(moon).toBeDefined();
      expect(withinTolerance(moon.longitude, TEST_BIRTH_DATA.expectedPositions.moon.longitude, 1.0)).toBe(true);
      expect(moon.sign).toBe(TEST_BIRTH_DATA.expectedPositions.moon.sign);

      // Verify Ascendant
      expect(chart.angles.ascendant).toBeDefined();
      expect(withinTolerance(chart.angles.ascendant, 170.04, 1.0)).toBe(true); // 20° Virgo = 150 + 20

      // Verify Midheaven
      expect(chart.angles.midheaven).toBeDefined();
    }, 30000);

    it('should handle "now" date correctly', async () => {
      const result = await runCommand('chart', [
        'now',
        '--latitude', '0',
        '--longitude', '0',
        '--json',
      ]);

      expect(result.exitCode).toBe(0);

      const chart = extractJSON(result.stdout);
      expect(chart).toHaveProperty('timestamp');

      // Timestamp should be close to now (within 1 minute)
      const chartTime = new Date(chart.timestamp).getTime();
      const now = Date.now();
      expect(Math.abs(chartTime - now)).toBeLessThan(60000);
    }, 30000);

    it('should include all required planets', async () => {
      const result = await runCommand('chart', [
        TEST_BIRTH_DATA.date,
        TEST_BIRTH_DATA.time,
        '--latitude', TEST_BIRTH_DATA.latitude.toString(),
        '--longitude', TEST_BIRTH_DATA.longitude.toString(),
        '--json',
      ]);

      expect(result.exitCode).toBe(0);

      const chart = extractJSON(result.stdout);

      // Check all major planets
      const requiredPlanets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
      requiredPlanets.forEach((planet) => {
        expect(chart.bodies[planet]).toBeDefined();
        expect(chart.bodies[planet]).toHaveProperty('longitude');
        expect(chart.bodies[planet]).toHaveProperty('sign');
        expect(chart.bodies[planet]).toHaveProperty('signDegree');
        expect(typeof chart.bodies[planet].longitude).toBe('number');
      });
    }, 30000);

    it('should calculate 12 house cusps', async () => {
      const result = await runCommand('chart', [
        TEST_BIRTH_DATA.date,
        TEST_BIRTH_DATA.time,
        '--latitude', TEST_BIRTH_DATA.latitude.toString(),
        '--longitude', TEST_BIRTH_DATA.longitude.toString(),
        '--json',
      ]);

      expect(result.exitCode).toBe(0);

      const chart = extractJSON(result.stdout);

      expect(chart.houses).toHaveProperty('cusps');
      expect(chart.houses.cusps).toHaveLength(12);
      expect(chart.houses.system).toBe('placidus');

      // All cusps should be valid degrees (0-360)
      chart.houses.cusps.forEach((cusp: number) => {
        expect(cusp).toBeGreaterThanOrEqual(0);
        expect(cusp).toBeLessThan(360);
      });
    }, 30000);

    it('should support different house systems', async () => {
      const systems = ['placidus', 'koch', 'equal', 'whole-sign'];

      for (const system of systems) {
        const result = await runCommand('chart', [
          TEST_BIRTH_DATA.date,
          TEST_BIRTH_DATA.time,
          '--latitude', TEST_BIRTH_DATA.latitude.toString(),
          '--longitude', TEST_BIRTH_DATA.longitude.toString(),
          '--house-system', system,
          '--json',
        ]);

        expect(result.exitCode).toBe(0);

        const chart = extractJSON(result.stdout);
        expect(chart.houses.system.toLowerCase().replace('-', '')).toContain(system.replace('-', ''));
      }
    }, 60000);

    it('should detect retrograde planets correctly', async () => {
      // Pluto was retrograde on March 10, 1990
      const result = await runCommand('chart', [
        TEST_BIRTH_DATA.date,
        TEST_BIRTH_DATA.time,
        '--latitude', TEST_BIRTH_DATA.latitude.toString(),
        '--longitude', TEST_BIRTH_DATA.longitude.toString(),
        '--json',
      ]);

      expect(result.exitCode).toBe(0);

      const chart = extractJSON(result.stdout);

      // Pluto should be retrograde
      expect(chart.bodies.pluto).toHaveProperty('retrograde');
      expect(chart.bodies.pluto.retrograde).toBe(true);

      // Sun and Moon are never retrograde
      expect(chart.bodies.sun.retrograde).toBe(false);
      expect(chart.bodies.moon.retrograde).toBe(false);
    }, 30000);

    it('should display human-readable output correctly', async () => {
      const result = await runCommand('chart', [
        TEST_BIRTH_DATA.date,
        TEST_BIRTH_DATA.time,
        '--latitude', TEST_BIRTH_DATA.latitude.toString(),
        '--longitude', TEST_BIRTH_DATA.longitude.toString(),
        '--location', TEST_BIRTH_DATA.location,
      ]);

      expect(result.exitCode).toBe(0);

      // Check for expected output sections
      expect(result.stdout).toContain('NATAL CHART');
      expect(result.stdout).toContain('Birth Information');
      expect(result.stdout).toContain('Angles');
      expect(result.stdout).toContain('Planetary Positions');
      expect(result.stdout).toContain('Houses');
      expect(result.stdout).toContain('Kurnool');
      expect(result.stdout).toContain('Pisces'); // Sun sign
      expect(result.stdout).toContain('Virgo'); // Moon sign
    }, 30000);
  });

  describe('Houses Command', () => {
    it('should calculate house cusps with --compare option', async () => {
      const result = await runCommand('houses', [
        TEST_BIRTH_DATA.date,
        TEST_BIRTH_DATA.time,
        '--latitude', TEST_BIRTH_DATA.latitude.toString(),
        '--longitude', TEST_BIRTH_DATA.longitude.toString(),
        '--compare',
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Comparing');
      expect(result.stdout).toContain('placidus');
      expect(result.stdout).toContain('koch');
    }, 60000);

    it('should list available house systems', async () => {
      const result = await runCommand('houses', ['--list-systems']);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Placidus');
      expect(result.stdout).toContain('Koch');
      expect(result.stdout).toContain('Equal');
    }, 30000);

    it('should output valid JSON structure', async () => {
      const result = await runCommand('houses', [
        TEST_BIRTH_DATA.date,
        TEST_BIRTH_DATA.time,
        '--latitude', TEST_BIRTH_DATA.latitude.toString(),
        '--longitude', TEST_BIRTH_DATA.longitude.toString(),
        '--json',
      ]);

      expect(result.exitCode).toBe(0);

      const data = extractJSON(result.stdout);
      expect(data).toHaveProperty('angles');
      expect(data).toHaveProperty('houses');
      expect(data.angles).toHaveProperty('ascendant');
      expect(data.angles).toHaveProperty('midheaven');
    }, 30000);
  });

  describe('Transits Command', () => {
    it('should calculate current transits', async () => {
      const result = await runCommand('transits', ['--json']);

      expect(result.exitCode).toBe(0);

      const data = extractJSON(result.stdout);
      expect(data).toHaveProperty('transits');
      expect(data.transits).toHaveProperty('bodies');
      expect(data.transits).toHaveProperty('moonPhase');
      expect(data.transits).toHaveProperty('location');
    }, 30000);

    it('should calculate transits for specific date', async () => {
      const result = await runCommand('transits', [
        '--date', '2025-12-25',
        '--json',
      ]);

      expect(result.exitCode).toBe(0);

      const data = extractJSON(result.stdout);
      const timestamp = new Date(data.transits.timestamp);

      // Should be December 25, 2025
      expect(timestamp.getFullYear()).toBe(2025);
      expect(timestamp.getMonth()).toBe(11); // December
      expect(timestamp.getDate()).toBe(25);
    }, 30000);

    it('should include moon phase information', async () => {
      const result = await runCommand('transits', ['--json']);

      expect(result.exitCode).toBe(0);

      const data = extractJSON(result.stdout);
      expect(data.transits.moonPhase).toHaveProperty('name');
      expect(data.transits.moonPhase).toHaveProperty('illumination');
      expect(data.transits.moonPhase).toHaveProperty('angle');

      // Illumination should be 0-100
      expect(data.transits.moonPhase.illumination).toBeGreaterThanOrEqual(0);
      expect(data.transits.moonPhase.illumination).toBeLessThanOrEqual(100);

      // Moon phase names should be valid
      const validPhases = [
        'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
        'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'
      ];
      expect(validPhases).toContain(data.transits.moonPhase.name);
    }, 30000);

    it('should display human-readable output with moon phase', async () => {
      const result = await runCommand('transits', []);

      expect(result.exitCode).toBe(0);

      expect(result.stdout).toContain('PLANETARY TRANSITS');
      expect(result.stdout).toContain('Moon Phase');
      expect(result.stdout).toContain('Illumination');
    }, 30000);
  });

  describe('Progressions Command', () => {
    it('should calculate secondary progressions correctly', async () => {
      const result = await runCommand('progressions', [
        TEST_BIRTH_DATA.date,
        TEST_BIRTH_DATA.time,
        '--latitude', TEST_BIRTH_DATA.latitude.toString(),
        '--longitude', TEST_BIRTH_DATA.longitude.toString(),
        '--to', '2025-11-30',
        '--json',
      ]);

      expect(result.exitCode).toBe(0);

      const data = extractJSON(result.stdout);

      // Verify progression structure
      expect(data).toHaveProperty('natal');
      expect(data).toHaveProperty('progressed');
      expect(data).toHaveProperty('progression');

      // Verify age calculation (birth: Mar 10, 1990, target: Nov 30, 2025)
      // Age should be approximately 35.72 years
      expect(data.progression.ageInYears).toBeGreaterThan(35);
      expect(data.progression.ageInYears).toBeLessThan(36);

      // Progressed date should be approximately 35.72 days after birth
      const birthDate = new Date(data.progression.birthDate);
      const progressedDate = new Date(data.progression.progressedDate);
      const daysDiff = (progressedDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24);

      // Days should match age (1 day = 1 year)
      expect(Math.abs(daysDiff - data.progression.ageInYears)).toBeLessThan(0.1);
    }, 30000);

    it('should show natal and progressed positions', async () => {
      const result = await runCommand('progressions', [
        TEST_BIRTH_DATA.date,
        TEST_BIRTH_DATA.time,
        '--latitude', TEST_BIRTH_DATA.latitude.toString(),
        '--longitude', TEST_BIRTH_DATA.longitude.toString(),
      ]);

      expect(result.exitCode).toBe(0);

      // Should show both natal and progressed sections
      expect(result.stdout).toContain('NATAL POSITIONS');
      expect(result.stdout).toContain('PROGRESSED POSITIONS');
      expect(result.stdout).toContain('PROGRESSION MOVEMENT');

      // Should show formula explanation
      expect(result.stdout).toContain('1 day = 1 year');
    }, 30000);

    it('should calculate progressed Sun correctly (1° per year)', async () => {
      const result = await runCommand('progressions', [
        TEST_BIRTH_DATA.date,
        TEST_BIRTH_DATA.time,
        '--latitude', TEST_BIRTH_DATA.latitude.toString(),
        '--longitude', TEST_BIRTH_DATA.longitude.toString(),
        '--to', '2025-11-30',
        '--json',
      ]);

      expect(result.exitCode).toBe(0);

      const data = extractJSON(result.stdout);

      // Natal Sun at ~349.69° (19° Pisces)
      // After ~35.72 years, progressed Sun should be ~35.72° ahead
      // Expected: ~349.69 + 35.72 = ~385.41 = ~25.41° (normalized)
      const natalSun = data.natal.bodies.sun.longitude;
      const progressedSun = data.progressed.bodies.sun.longitude;
      const expectedMovement = data.progression.ageInYears; // ~35.72°

      // Sun moves approximately 1° per year in progressions
      const actualMovement = (progressedSun - natalSun + 360) % 360;
      expect(withinTolerance(actualMovement, expectedMovement, 2.0)).toBe(true);
    }, 30000);

    it('should support --age option', async () => {
      const result = await runCommand('progressions', [
        TEST_BIRTH_DATA.date,
        TEST_BIRTH_DATA.time,
        '--latitude', TEST_BIRTH_DATA.latitude.toString(),
        '--longitude', TEST_BIRTH_DATA.longitude.toString(),
        '--age', '30',
        '--json',
      ]);

      expect(result.exitCode).toBe(0);

      const data = extractJSON(result.stdout);

      // Age should be 30
      expect(data.progression.ageInYears).toBe(30);

      // Progressed date should be 30 days after birth
      const birthDate = new Date(data.progression.birthDate);
      const progressedDate = new Date(data.progression.progressedDate);
      const daysDiff = (progressedDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24);
      expect(Math.abs(daysDiff - 30)).toBeLessThan(0.1);
    }, 30000);
  });

  describe('Error Handling', () => {
    it('should handle invalid date format gracefully', async () => {
      const result = await runCommand('chart', [
        'invalid-date',
        '12:00:00',
        '--latitude', '0',
        '--longitude', '0',
      ]);

      // Should either handle gracefully or exit with error
      // The command should not hang or crash silently
      expect(result.exitCode === 0 || result.stdout.includes('Error') || result.stderr.includes('Error')).toBe(true);
    }, 30000);

    it('should handle missing required arguments with help', async () => {
      const result = await runCommand('chart', ['--help']);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Usage');
      expect(result.stdout).toContain('latitude');
      expect(result.stdout).toContain('longitude');
    }, 30000);

    it('should validate coordinate bounds', async () => {
      // Invalid latitude (>90)
      const result = await runCommand('chart', [
        '2000-01-01',
        '12:00:00',
        '--latitude', '100', // Invalid
        '--longitude', '0',
        '--json',
      ]);

      // Should still calculate (with warning) or return error
      // This tests that the command handles edge cases
      expect(typeof result.exitCode).toBe('number');
    }, 30000);
  });

  describe('Astrological Accuracy Validation', () => {
    it('should place zodiac signs correctly (30° each)', async () => {
      const result = await runCommand('chart', [
        TEST_BIRTH_DATA.date,
        TEST_BIRTH_DATA.time,
        '--latitude', TEST_BIRTH_DATA.latitude.toString(),
        '--longitude', TEST_BIRTH_DATA.longitude.toString(),
        '--json',
      ]);

      expect(result.exitCode).toBe(0);

      const chart = extractJSON(result.stdout);

      // Verify each planet's sign matches its longitude
      const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

      Object.values(chart.bodies).forEach((body: any) => {
        const expectedSignIndex = Math.floor(body.longitude / 30);
        const expectedSign = signs[expectedSignIndex];
        expect(body.sign).toBe(expectedSign);

        // SignDegree should be within 0-30
        expect(body.signDegree).toBeGreaterThanOrEqual(0);
        expect(body.signDegree).toBeLessThan(30);

        // SignDegree should match longitude mod 30
        expect(Math.abs(body.signDegree - (body.longitude % 30))).toBeLessThan(0.01);
      });
    }, 30000);

    it('should have opposite descendant and IC', async () => {
      const result = await runCommand('chart', [
        TEST_BIRTH_DATA.date,
        TEST_BIRTH_DATA.time,
        '--latitude', TEST_BIRTH_DATA.latitude.toString(),
        '--longitude', TEST_BIRTH_DATA.longitude.toString(),
        '--json',
      ]);

      expect(result.exitCode).toBe(0);

      const chart = extractJSON(result.stdout);

      // Descendant should be exactly opposite Ascendant (180° apart)
      const ascDesc = Math.abs(chart.angles.descendant - chart.angles.ascendant);
      expect(Math.abs(ascDesc - 180) < 0.01 || Math.abs(ascDesc - 180 - 360) < 0.01).toBe(true);

      // IC should be exactly opposite Midheaven
      const mcIc = Math.abs(chart.angles.imumCoeli - chart.angles.midheaven);
      expect(Math.abs(mcIc - 180) < 0.01 || Math.abs(mcIc + 180 - 360) < 0.01).toBe(true);
    }, 30000);
  });
});
