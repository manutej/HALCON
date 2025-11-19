/**
 * Tests for Transits Command
 *
 * Test coverage:
 * - Current date transits calculation
 * - Specific date transits (--date option)
 * - Date validation and error handling
 * - Moon phase calculation and naming
 * - Profile integration
 * - Output formatting (text and JSON)
 * - Planetary positions and retrograde detection
 * - Edge cases and boundary conditions
 */

import { describe, it, expect } from 'vitest';
import {
  calculateTransits,
  validateTransitDate,
  formatTransitOutput
} from '../../lib/transits/index.js';
import {
  calculateMoonPhase,
  getMoonPhaseName,
  getMoonPhaseSymbol
} from '../../lib/moon-phase/index.js';

describe('Transits - Current Date Calculation', () => {
  it('should calculate transits for current date', async () => {
    const now = new Date();
    const location = {
      latitude: 0,
      longitude: 0,
      name: 'Greenwich'
    };

    const transits = await calculateTransits(now, location);

    expect(transits).toBeDefined();
    expect(transits.timestamp).toBeInstanceOf(Date);
    expect(transits.bodies).toBeDefined();
    expect(transits.bodies.sun).toBeDefined();
    expect(transits.bodies.moon).toBeDefined();
    expect(transits.moonPhase).toBeDefined();
  });

  it('should include all major planets in transits', async () => {
    const date = new Date('2025-11-19T12:00:00.000Z');
    const location = {
      latitude: 0,
      longitude: 0,
      name: 'Greenwich'
    };

    const transits = await calculateTransits(date, location);

    // Check all major planets are present
    expect(transits.bodies.sun).toBeDefined();
    expect(transits.bodies.moon).toBeDefined();
    expect(transits.bodies.mercury).toBeDefined();
    expect(transits.bodies.venus).toBeDefined();
    expect(transits.bodies.mars).toBeDefined();
    expect(transits.bodies.jupiter).toBeDefined();
    expect(transits.bodies.saturn).toBeDefined();
    expect(transits.bodies.uranus).toBeDefined();
    expect(transits.bodies.neptune).toBeDefined();
    expect(transits.bodies.pluto).toBeDefined();
  });

  it('should calculate transits with correct timestamp', async () => {
    const testDate = new Date('2025-06-21T12:00:00.000Z'); // Summer solstice
    const location = {
      latitude: 51.5,
      longitude: -0.1,
      name: 'London'
    };

    const transits = await calculateTransits(testDate, location);

    expect(transits.timestamp.toISOString()).toBe(testDate.toISOString());
    expect(transits.location.name).toBe('London');
  });
});

describe('Transits - Specific Date Calculation', () => {
  it('should calculate transits for specific past date', async () => {
    const date = new Date('2020-01-01T00:00:00.000Z');
    const location = {
      latitude: 40.7,
      longitude: -74.0,
      name: 'New York'
    };

    const transits = await calculateTransits(date, location);

    expect(transits.timestamp.getFullYear()).toBe(2020);
    expect(transits.timestamp.getMonth()).toBe(0); // January
    expect(transits.timestamp.getDate()).toBe(1);
  });

  it('should calculate transits for specific future date', async () => {
    const date = new Date('2026-12-31T23:59:59.000Z');
    const location = {
      latitude: 0,
      longitude: 0,
      name: 'Greenwich'
    };

    const transits = await calculateTransits(date, location);

    expect(transits.timestamp.getFullYear()).toBe(2026);
    expect(transits.bodies.sun).toBeDefined();
  });

  it('should handle different times of day', async () => {
    const morning = new Date('2025-11-19T06:00:00.000Z');
    const evening = new Date('2025-11-19T18:00:00.000Z');
    const location = {
      latitude: 0,
      longitude: 0,
      name: 'Greenwich'
    };

    const transitsMorning = await calculateTransits(morning, location);
    const transitsEvening = await calculateTransits(evening, location);

    // Moon should move significantly in 12 hours (~6 degrees)
    const moonDiff = Math.abs(transitsEvening.bodies.moon.longitude - transitsMorning.bodies.moon.longitude);
    expect(moonDiff).toBeGreaterThan(5);
    expect(moonDiff).toBeLessThan(7);
  });
});

describe('Transits - Date Validation', () => {
  it('should accept valid current date', () => {
    const now = new Date();
    expect(() => validateTransitDate(now)).not.toThrow();
  });

  it('should accept valid past date', () => {
    const pastDate = new Date('1990-03-10T12:55:00.000Z');
    expect(() => validateTransitDate(pastDate)).not.toThrow();
  });

  it('should accept valid future date', () => {
    const futureDate = new Date('2030-01-01T00:00:00.000Z');
    expect(() => validateTransitDate(futureDate)).not.toThrow();
  });

  it('should reject invalid date', () => {
    const invalidDate = new Date('invalid');
    expect(() => validateTransitDate(invalidDate)).toThrow('Date is invalid');
  });

  it('should handle very old dates (ephemeris limits)', () => {
    // Swiss Ephemeris typically supports dates from ~13000 BC to ~17000 AD
    const ancientDate = new Date('1000-01-01T00:00:00.000Z');
    expect(() => validateTransitDate(ancientDate)).not.toThrow();
  });

  it('should use custom field name in error messages', () => {
    const invalidDate = new Date('invalid');
    expect(() => validateTransitDate(invalidDate, 'Transit Date')).toThrow('Transit Date is invalid');
  });
});

describe('Moon Phase - Calculation', () => {
  it('should calculate moon phase from Sun-Moon angle', () => {
    // New Moon: Sun and Moon at same longitude
    const sunLon = 45.0;
    const moonLon = 45.0;
    const phase = calculateMoonPhase(sunLon, moonLon);

    expect(phase.angle).toBeCloseTo(0, 1);
    expect(phase.illumination).toBeCloseTo(0, 1);
    expect(phase.name).toBe('New Moon');
  });

  it('should calculate first quarter moon (90° ahead)', () => {
    const sunLon = 0.0;
    const moonLon = 90.0;
    const phase = calculateMoonPhase(sunLon, moonLon);

    expect(phase.angle).toBeCloseTo(90, 1);
    expect(phase.illumination).toBeCloseTo(50, 1);
    expect(phase.name).toBe('First Quarter');
  });

  it('should calculate full moon (180° opposition)', () => {
    const sunLon = 0.0;
    const moonLon = 180.0;
    const phase = calculateMoonPhase(sunLon, moonLon);

    expect(phase.angle).toBeCloseTo(180, 1);
    expect(phase.illumination).toBeCloseTo(100, 1);
    expect(phase.name).toBe('Full Moon');
  });

  it('should calculate third quarter moon (270° ahead)', () => {
    const sunLon = 0.0;
    const moonLon = 270.0;
    const phase = calculateMoonPhase(sunLon, moonLon);

    expect(phase.angle).toBeCloseTo(270, 1);
    expect(phase.illumination).toBeCloseTo(50, 1);
    expect(phase.name).toBe('Third Quarter');
  });

  it('should handle 360° wraparound correctly', () => {
    // Sun at 350°, Moon at 10° (20° ahead)
    const sunLon = 350.0;
    const moonLon = 10.0;
    const phase = calculateMoonPhase(sunLon, moonLon);

    expect(phase.angle).toBeCloseTo(20, 1);
    expect(phase.name).toBe('Waxing Crescent');
  });

  it('should calculate waxing crescent (between 0° and 90°)', () => {
    const sunLon = 0.0;
    const moonLon = 45.0;
    const phase = calculateMoonPhase(sunLon, moonLon);

    expect(phase.angle).toBeCloseTo(45, 1);
    expect(phase.illumination).toBeGreaterThan(0);
    expect(phase.illumination).toBeLessThan(50);
    expect(phase.name).toBe('Waxing Crescent');
  });

  it('should calculate waxing gibbous (between 90° and 180°)', () => {
    const sunLon = 0.0;
    const moonLon = 135.0;
    const phase = calculateMoonPhase(sunLon, moonLon);

    expect(phase.angle).toBeCloseTo(135, 1);
    expect(phase.illumination).toBeGreaterThan(50);
    expect(phase.illumination).toBeLessThan(100);
    expect(phase.name).toBe('Waxing Gibbous');
  });

  it('should calculate waning gibbous (between 180° and 270°)', () => {
    const sunLon = 0.0;
    const moonLon = 225.0;
    const phase = calculateMoonPhase(sunLon, moonLon);

    expect(phase.angle).toBeCloseTo(225, 1);
    expect(phase.illumination).toBeGreaterThan(50);
    expect(phase.illumination).toBeLessThan(100);
    expect(phase.name).toBe('Waning Gibbous');
  });

  it('should calculate waning crescent (between 270° and 360°)', () => {
    const sunLon = 0.0;
    const moonLon = 315.0;
    const phase = calculateMoonPhase(sunLon, moonLon);

    expect(phase.angle).toBeCloseTo(315, 1);
    expect(phase.illumination).toBeGreaterThan(0);
    expect(phase.illumination).toBeLessThan(50);
    expect(phase.name).toBe('Waning Crescent');
  });
});

describe('Moon Phase - Symbol', () => {
  it('should return correct symbol for New Moon', () => {
    expect(getMoonPhaseSymbol('New Moon')).toBe('🌑');
  });

  it('should return correct symbol for Waxing Crescent', () => {
    expect(getMoonPhaseSymbol('Waxing Crescent')).toBe('🌒');
  });

  it('should return correct symbol for First Quarter', () => {
    expect(getMoonPhaseSymbol('First Quarter')).toBe('🌓');
  });

  it('should return correct symbol for Waxing Gibbous', () => {
    expect(getMoonPhaseSymbol('Waxing Gibbous')).toBe('🌔');
  });

  it('should return correct symbol for Full Moon', () => {
    expect(getMoonPhaseSymbol('Full Moon')).toBe('🌕');
  });

  it('should return correct symbol for Waning Gibbous', () => {
    expect(getMoonPhaseSymbol('Waning Gibbous')).toBe('🌖');
  });

  it('should return correct symbol for Third Quarter', () => {
    expect(getMoonPhaseSymbol('Third Quarter')).toBe('🌗');
  });

  it('should return correct symbol for Waning Crescent', () => {
    expect(getMoonPhaseSymbol('Waning Crescent')).toBe('🌘');
  });

  it('should return default symbol for unknown phase', () => {
    expect(getMoonPhaseSymbol('Unknown Phase')).toBe('🌙');
  });
});

describe('Moon Phase - Name Detection', () => {
  it('should detect New Moon (0° ± 2°)', () => {
    expect(getMoonPhaseName(0)).toBe('New Moon');
    expect(getMoonPhaseName(1)).toBe('New Moon');
    expect(getMoonPhaseName(359)).toBe('New Moon');
  });

  it('should detect First Quarter (90° ± 2°)', () => {
    expect(getMoonPhaseName(90)).toBe('First Quarter');
    expect(getMoonPhaseName(89)).toBe('First Quarter');
    expect(getMoonPhaseName(91)).toBe('First Quarter');
  });

  it('should detect Full Moon (180° ± 2°)', () => {
    expect(getMoonPhaseName(180)).toBe('Full Moon');
    expect(getMoonPhaseName(179)).toBe('Full Moon');
    expect(getMoonPhaseName(181)).toBe('Full Moon');
  });

  it('should detect Third Quarter (270° ± 2°)', () => {
    expect(getMoonPhaseName(270)).toBe('Third Quarter');
    expect(getMoonPhaseName(269)).toBe('Third Quarter');
    expect(getMoonPhaseName(271)).toBe('Third Quarter');
  });

  it('should detect Waxing Crescent (3° to 87°)', () => {
    expect(getMoonPhaseName(45)).toBe('Waxing Crescent');
    expect(getMoonPhaseName(3)).toBe('Waxing Crescent');
    expect(getMoonPhaseName(87)).toBe('Waxing Crescent');
  });

  it('should detect Waxing Gibbous (93° to 177°)', () => {
    expect(getMoonPhaseName(135)).toBe('Waxing Gibbous');
    expect(getMoonPhaseName(93)).toBe('Waxing Gibbous');
    expect(getMoonPhaseName(177)).toBe('Waxing Gibbous');
  });

  it('should detect Waning Gibbous (183° to 267°)', () => {
    expect(getMoonPhaseName(225)).toBe('Waning Gibbous');
    expect(getMoonPhaseName(183)).toBe('Waning Gibbous');
    expect(getMoonPhaseName(267)).toBe('Waning Gibbous');
  });

  it('should detect Waning Crescent (273° to 357°)', () => {
    expect(getMoonPhaseName(315)).toBe('Waning Crescent');
    expect(getMoonPhaseName(273)).toBe('Waning Crescent');
    expect(getMoonPhaseName(357)).toBe('Waning Crescent');
  });
});

describe('Transits - Planetary Positions', () => {
  it('should include retrograde status for planets', async () => {
    const date = new Date('2025-11-19T12:00:00.000Z');
    const location = {
      latitude: 0,
      longitude: 0,
      name: 'Greenwich'
    };

    const transits = await calculateTransits(date, location);

    // Mercury retrogrades ~3 times per year, check property exists
    expect(transits.bodies.mercury).toHaveProperty('retrograde');
    expect(typeof transits.bodies.mercury.retrograde).toBe('boolean');
  });

  it('should calculate zodiac sign for each planet', async () => {
    const date = new Date('2025-11-19T12:00:00.000Z');
    const location = {
      latitude: 0,
      longitude: 0,
      name: 'Greenwich'
    };

    const transits = await calculateTransits(date, location);

    // Each planet should have a sign
    expect(transits.bodies.sun.sign).toBeDefined();
    expect(transits.bodies.moon.sign).toBeDefined();
    expect(transits.bodies.mars.sign).toBeDefined();

    // Sign should be one of the 12 zodiac signs
    const zodiacSigns = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    expect(zodiacSigns).toContain(transits.bodies.sun.sign);
  });

  it('should calculate degree within sign (0-30°)', async () => {
    const date = new Date('2025-11-19T12:00:00.000Z');
    const location = {
      latitude: 0,
      longitude: 0,
      name: 'Greenwich'
    };

    const transits = await calculateTransits(date, location);

    // Degree within sign should be 0-30
    expect(transits.bodies.sun.signDegree).toBeGreaterThanOrEqual(0);
    expect(transits.bodies.sun.signDegree).toBeLessThan(30);

    expect(transits.bodies.moon.signDegree).toBeGreaterThanOrEqual(0);
    expect(transits.bodies.moon.signDegree).toBeLessThan(30);
  });

  it('should have longitude values 0-360°', async () => {
    const date = new Date('2025-11-19T12:00:00.000Z');
    const location = {
      latitude: 0,
      longitude: 0,
      name: 'Greenwich'
    };

    const transits = await calculateTransits(date, location);

    // All planets should have valid longitudes
    Object.values(transits.bodies).forEach((body: any) => {
      expect(body.longitude).toBeGreaterThanOrEqual(0);
      expect(body.longitude).toBeLessThan(360);
    });
  });
});

describe('Transits - Output Formatting', () => {
  it('should format transit data for display', async () => {
    const date = new Date('2025-11-19T12:00:00.000Z');
    const location = {
      latitude: 40.7,
      longitude: -74.0,
      name: 'New York'
    };

    const transits = await calculateTransits(date, location);
    const formatted = formatTransitOutput(transits);

    expect(formatted).toBeDefined();
    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(0);
  });

  it('should include moon phase in formatted output', async () => {
    const date = new Date('2025-11-19T12:00:00.000Z');
    const location = {
      latitude: 0,
      longitude: 0,
      name: 'Greenwich'
    };

    const transits = await calculateTransits(date, location);
    const formatted = formatTransitOutput(transits);

    expect(formatted).toContain('Moon Phase');
    expect(formatted).toContain(transits.moonPhase.name);
  });

  it('should include date/time in formatted output', async () => {
    const date = new Date('2025-11-19T12:00:00.000Z');
    const location = {
      latitude: 0,
      longitude: 0,
      name: 'Greenwich'
    };

    const transits = await calculateTransits(date, location);
    const formatted = formatTransitOutput(transits);

    expect(formatted).toContain('2025');
    expect(formatted).toContain('Greenwich');
  });
});

describe('Transits - Edge Cases', () => {
  it('should handle midnight calculations', async () => {
    const midnight = new Date('2025-01-01T00:00:00.000Z');
    const location = {
      latitude: 0,
      longitude: 0,
      name: 'Greenwich'
    };

    const transits = await calculateTransits(midnight, location);

    expect(transits.timestamp.getHours()).toBe(0);
    expect(transits.bodies.sun).toBeDefined();
  });

  it('should handle different locations (varied coordinates)', async () => {
    const date = new Date('2025-11-19T12:00:00.000Z');

    // Test different locations
    const locations = [
      { latitude: 0, longitude: 0, name: 'Greenwich' },
      { latitude: 40.7, longitude: -74.0, name: 'New York' },
      { latitude: -33.9, longitude: 151.2, name: 'Sydney' },
      { latitude: 15.83, longitude: 78.04, name: 'Nalgonda, India' }
    ];

    for (const location of locations) {
      const transits = await calculateTransits(date, location);
      expect(transits.location.name).toBe(location.name);
      expect(transits.bodies.sun).toBeDefined();
    }
  });

  it('should handle leap year dates', async () => {
    const leapDay = new Date('2024-02-29T12:00:00.000Z');
    const location = {
      latitude: 0,
      longitude: 0,
      name: 'Greenwich'
    };

    const transits = await calculateTransits(leapDay, location);

    expect(transits.timestamp.getMonth()).toBe(1); // February
    expect(transits.timestamp.getDate()).toBe(29);
  });

  it('should handle year boundaries', async () => {
    const newYear = new Date('2025-12-31T23:59:59.000Z');
    const location = {
      latitude: 0,
      longitude: 0,
      name: 'Greenwich'
    };

    const transits = await calculateTransits(newYear, location);

    expect(transits.timestamp.getFullYear()).toBe(2025);
    expect(transits.timestamp.getMonth()).toBe(11); // December
  });
});

describe('Transits - Real-world Examples', () => {
  it('should calculate transits for November 19, 2025 (reference date)', async () => {
    const date = new Date('2025-11-19T12:00:00.000Z');
    const location = {
      latitude: 0,
      longitude: 0,
      name: 'Greenwich'
    };

    const transits = await calculateTransits(date, location);

    // Sun should be in Scorpio (late November)
    // This is a known fact for this date
    expect(['Scorpio', 'Sagittarius']).toContain(transits.bodies.sun.sign);

    // Moon moves fast, just check it exists
    expect(transits.bodies.moon.longitude).toBeGreaterThanOrEqual(0);
    expect(transits.bodies.moon.longitude).toBeLessThan(360);

    // Check moon phase is calculated
    expect(transits.moonPhase).toBeDefined();
    expect(transits.moonPhase.name).toBeDefined();
    expect(transits.moonPhase.illumination).toBeGreaterThanOrEqual(0);
    expect(transits.moonPhase.illumination).toBeLessThanOrEqual(100);
  });

  it('should calculate transits for summer solstice 2025', async () => {
    const summerSolstice = new Date('2025-06-21T02:42:00.000Z'); // Approximate
    const location = {
      latitude: 51.5,
      longitude: -0.1,
      name: 'London'
    };

    const transits = await calculateTransits(summerSolstice, location);

    // Sun should be near the Cancer ingress (summer solstice happens around 0° Cancer)
    // But exact time varies, so we check it's either late Gemini or early Cancer
    expect(['Gemini', 'Cancer']).toContain(transits.bodies.sun.sign);

    // If in Gemini, should be very late (>25°)
    if (transits.bodies.sun.sign === 'Gemini') {
      expect(transits.bodies.sun.signDegree).toBeGreaterThan(25);
    } else {
      // If in Cancer, should be very early (<5°)
      expect(transits.bodies.sun.signDegree).toBeLessThan(5);
    }
  });

  it('should calculate transits for winter solstice 2025', async () => {
    const winterSolstice = new Date('2025-12-21T15:03:00.000Z'); // Approximate
    const location = {
      latitude: 51.5,
      longitude: -0.1,
      name: 'London'
    };

    const transits = await calculateTransits(winterSolstice, location);

    // Sun should be near the Capricorn ingress (winter solstice happens around 0° Capricorn)
    // But exact time varies, so we check it's either late Sagittarius or early Capricorn
    expect(['Sagittarius', 'Capricorn']).toContain(transits.bodies.sun.sign);

    // If in Sagittarius, should be very late (>25°)
    if (transits.bodies.sun.sign === 'Sagittarius') {
      expect(transits.bodies.sun.signDegree).toBeGreaterThan(25);
    } else {
      // If in Capricorn, should be very early (<5°)
      expect(transits.bodies.sun.signDegree).toBeLessThan(5);
    }
  });
});
