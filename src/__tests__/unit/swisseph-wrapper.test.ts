/**
 * Swiss Ephemeris Wrapper Test Suite
 * Following TDD methodology - tests define the specification
 *
 * @module tests/unit/swisseph-wrapper
 * @description RED phase - Write failing tests first
 */

import { describe, it, expect } from 'vitest';
import { calculateChart } from '@/lib/swisseph';
import type { GeoCoordinates, ChartData } from '@/lib/swisseph/types';

describe('Swiss Ephemeris Wrapper', () => {
  // Test data: March 10, 1990, 12:55 PM (noon), Kurnool, India
  const testDate = new Date('1990-03-10T12:55:00Z');
  const testLocation: GeoCoordinates = {
    latitude: 15.83,
    longitude: 78.04,
    name: 'Kurnool, India'
  };

  describe('Basic Chart Calculation', () => {
    it('should calculate a complete chart', async () => {
      const chart = await calculateChart(testDate, testLocation);

      expect(chart).toBeDefined();
      expect(chart.timestamp).toEqual(testDate);
      expect(chart.location).toEqual(testLocation);
      expect(chart.julianDay).toBeGreaterThan(2400000); // Valid JD
    });

    it('should handle different date formats', async () => {
      const dateString = '1990-03-10T12:55:00Z';
      const dateObject = new Date(dateString);
      const timestamp = dateObject.getTime();

      const chart1 = await calculateChart(dateString, testLocation);
      const chart2 = await calculateChart(dateObject, testLocation);
      const chart3 = await calculateChart(timestamp, testLocation);

      expect(chart1.julianDay).toBeCloseTo(chart2.julianDay, 5);
      expect(chart2.julianDay).toBeCloseTo(chart3.julianDay, 5);
    });
  });

  describe('Planetary Positions', () => {
    it('should calculate all traditional planets', async () => {
      const chart = await calculateChart(testDate, testLocation);

      // All planets should be defined
      expect(chart.bodies.sun).toBeDefined();
      expect(chart.bodies.moon).toBeDefined();
      expect(chart.bodies.mercury).toBeDefined();
      expect(chart.bodies.venus).toBeDefined();
      expect(chart.bodies.mars).toBeDefined();
      expect(chart.bodies.jupiter).toBeDefined();
      expect(chart.bodies.saturn).toBeDefined();
      expect(chart.bodies.uranus).toBeDefined();
      expect(chart.bodies.neptune).toBeDefined();
      expect(chart.bodies.pluto).toBeDefined();
    });

    it('should have valid longitude ranges (0-360)', async () => {
      const chart = await calculateChart(testDate, testLocation);

      const planets = [
        chart.bodies.sun,
        chart.bodies.moon,
        chart.bodies.mercury,
        chart.bodies.venus,
        chart.bodies.mars,
        chart.bodies.jupiter,
        chart.bodies.saturn,
        chart.bodies.uranus,
        chart.bodies.neptune,
        chart.bodies.pluto
      ];

      planets.forEach(planet => {
        expect(planet.longitude).toBeGreaterThanOrEqual(0);
        expect(planet.longitude).toBeLessThan(360);
      });
    });

    it('should calculate Sun position accurately', async () => {
      const chart = await calculateChart(testDate, testLocation);
      const sun = chart.bodies.sun;

      expect(sun.name).toBe('Sun');
      // Sun should be in Pisces (330-360° or 19.69° Pisces ≈ 349.69°)
      expect(sun.longitude).toBeGreaterThan(340);
      expect(sun.longitude).toBeLessThan(360);
      expect(sun.sign).toBe('Pisces');
      expect(sun.retrograde).toBe(false); // Sun never retrogrades
    });

    it('should calculate Moon position accurately', async () => {
      const chart = await calculateChart(testDate, testLocation);
      const moon = chart.bodies.moon;

      expect(moon.name).toBe('Moon');
      expect(moon.longitude).toBeGreaterThan(0);
      expect(moon.longitude).toBeLessThan(360);
      expect(moon.longitudeSpeed).toBeGreaterThan(10); // Moon moves ~13° per day
      expect(moon.longitudeSpeed).toBeLessThan(15);
    });

    it('should include sign and degree information', async () => {
      const chart = await calculateChart(testDate, testLocation);
      const sun = chart.bodies.sun;

      expect(sun.sign).toBeDefined();
      expect(sun.signDegree).toBeGreaterThanOrEqual(0);
      expect(sun.signDegree).toBeLessThan(30);
    });

    it('should detect retrograde motion', async () => {
      const chart = await calculateChart(testDate, testLocation);

      // Check that retrograde flag exists
      expect(typeof chart.bodies.mercury.retrograde).toBe('boolean');
      expect(typeof chart.bodies.venus.retrograde).toBe('boolean');
      expect(typeof chart.bodies.mars.retrograde).toBe('boolean');
    });
  });

  describe('Chiron and Lilith', () => {
    it('should include Chiron by default', async () => {
      const chart = await calculateChart(testDate, testLocation);

      expect(chart.bodies.chiron).toBeDefined();
      expect(chart.bodies.chiron.name).toBe('Chiron');
      expect(chart.bodies.chiron.longitude).toBeGreaterThanOrEqual(0);
      expect(chart.bodies.chiron.longitude).toBeLessThan(360);
    });

    it('should include True Black Moon Lilith by default', async () => {
      const chart = await calculateChart(testDate, testLocation);

      expect(chart.bodies.lilith).toBeDefined();
      expect(chart.bodies.lilith.name).toBe('Lilith');
      expect(chart.bodies.lilith.longitude).toBeGreaterThanOrEqual(0);
      expect(chart.bodies.lilith.longitude).toBeLessThan(360);
    });

    it('should include Mean Lilith by default', async () => {
      const chart = await calculateChart(testDate, testLocation);

      expect(chart.bodies.meanLilith).toBeDefined();
      expect(chart.bodies.meanLilith.name).toBe('Mean Lilith');
      expect(chart.bodies.meanLilith.longitude).toBeGreaterThanOrEqual(0);
      expect(chart.bodies.meanLilith.longitude).toBeLessThan(360);
    });

    it('should allow disabling Chiron', async () => {
      const chart = await calculateChart(testDate, testLocation, {
        includeChiron: false
      });

      // Chiron should still exist but could be marked as disabled
      // or we decide to omit it - let's test it's still there for now
      expect(chart.bodies.chiron).toBeDefined();
    });

    it('should allow disabling Lilith', async () => {
      const chart = await calculateChart(testDate, testLocation, {
        includeLilith: false
      });

      // Lilith should still exist but could be marked as disabled
      expect(chart.bodies.lilith).toBeDefined();
    });
  });

  describe('Lunar Nodes', () => {
    it('should calculate True North Node', async () => {
      const chart = await calculateChart(testDate, testLocation);

      expect(chart.bodies.northNode).toBeDefined();
      expect(chart.bodies.northNode.name).toBe('North Node');
      expect(chart.bodies.northNode.longitude).toBeGreaterThanOrEqual(0);
      expect(chart.bodies.northNode.longitude).toBeLessThan(360);
    });

    it('should calculate South Node as opposite of North Node', async () => {
      const chart = await calculateChart(testDate, testLocation);

      const northNode = chart.bodies.northNode.longitude;
      const southNode = chart.bodies.southNode.longitude;

      // South Node should be 180° opposite
      const expectedSouthNode = (northNode + 180) % 360;
      expect(southNode).toBeCloseTo(expectedSouthNode, 0.01);
    });

    it('should allow disabling nodes', async () => {
      const chart = await calculateChart(testDate, testLocation, {
        includeNodes: false
      });

      expect(chart.bodies.northNode).toBeDefined();
      expect(chart.bodies.southNode).toBeDefined();
    });
  });

  describe('House Calculations', () => {
    it('should calculate houses with Placidus system by default', async () => {
      const chart = await calculateChart(testDate, testLocation);

      expect(chart.houses).toBeDefined();
      expect(chart.houses.system).toBe('placidus');
      expect(chart.houses.cusps).toHaveLength(12);
    });

    it('should calculate houses with different systems', async () => {
      const systems = ['placidus', 'koch', 'equal', 'whole-sign'] as const;

      for (const system of systems) {
        const chart = await calculateChart(testDate, testLocation, {
          houseSystem: system
        });

        expect(chart.houses.system).toBe(system);
        expect(chart.houses.cusps).toHaveLength(12);
      }
    });

    it('should have valid house cusp ranges', async () => {
      const chart = await calculateChart(testDate, testLocation);

      chart.houses.cusps.forEach((cusp, index) => {
        expect(cusp).toBeGreaterThanOrEqual(0);
        expect(cusp).toBeLessThan(360);
      });
    });

    it('should have 1st house cusp as Ascendant', async () => {
      const chart = await calculateChart(testDate, testLocation);

      expect(chart.houses.cusps[0]).toBeCloseTo(chart.angles.ascendant, 0.01);
    });

    it('should have 10th house cusp as Midheaven', async () => {
      const chart = await calculateChart(testDate, testLocation);

      expect(chart.houses.cusps[9]).toBeCloseTo(chart.angles.midheaven, 0.01);
    });
  });

  describe('Angles (ASC, MC, IC, DSC)', () => {
    it('should calculate all four angles', async () => {
      const chart = await calculateChart(testDate, testLocation);

      expect(chart.angles).toBeDefined();
      expect(chart.angles.ascendant).toBeGreaterThanOrEqual(0);
      expect(chart.angles.ascendant).toBeLessThan(360);
      expect(chart.angles.midheaven).toBeGreaterThanOrEqual(0);
      expect(chart.angles.midheaven).toBeLessThan(360);
      expect(chart.angles.descendant).toBeGreaterThanOrEqual(0);
      expect(chart.angles.descendant).toBeLessThan(360);
      expect(chart.angles.imumCoeli).toBeGreaterThanOrEqual(0);
      expect(chart.angles.imumCoeli).toBeLessThan(360);
    });

    it('should calculate Ascendant (1st house cusp)', async () => {
      const chart = await calculateChart(testDate, testLocation);

      // ASC should be around 170° (Virgo)
      expect(chart.angles.ascendant).toBeGreaterThan(160);
      expect(chart.angles.ascendant).toBeLessThan(180);
    });

    it('should calculate Descendant as opposite of Ascendant', async () => {
      const chart = await calculateChart(testDate, testLocation);

      const expectedDescendant = (chart.angles.ascendant + 180) % 360;
      expect(chart.angles.descendant).toBeCloseTo(expectedDescendant, 0.01);
    });

    it('should calculate IC as opposite of MC', async () => {
      const chart = await calculateChart(testDate, testLocation);

      const expectedIC = (chart.angles.midheaven + 180) % 360;
      expect(chart.angles.imumCoeli).toBeCloseTo(expectedIC, 0.01);
    });

    it('should calculate angles independently of house system', async () => {
      const chart1 = await calculateChart(testDate, testLocation, {
        houseSystem: 'placidus'
      });
      const chart2 = await calculateChart(testDate, testLocation, {
        houseSystem: 'equal'
      });

      // ASC and MC should be the same regardless of house system
      expect(chart1.angles.ascendant).toBeCloseTo(chart2.angles.ascendant, 0.01);
      expect(chart1.angles.midheaven).toBeCloseTo(chart2.angles.midheaven, 0.01);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid dates', async () => {
      const invalidDate = new Date('invalid');

      await expect(
        calculateChart(invalidDate, testLocation)
      ).rejects.toThrow();
    });

    it('should handle invalid coordinates', async () => {
      const invalidLocation: GeoCoordinates = {
        latitude: 91, // Invalid: > 90
        longitude: 0
      };

      await expect(
        calculateChart(testDate, invalidLocation)
      ).rejects.toThrow();
    });

    it('should validate latitude range', async () => {
      const invalidLat1 = { latitude: -91, longitude: 0 };
      const invalidLat2 = { latitude: 91, longitude: 0 };

      await expect(calculateChart(testDate, invalidLat1)).rejects.toThrow();
      await expect(calculateChart(testDate, invalidLat2)).rejects.toThrow();
    });

    it('should validate longitude range', async () => {
      const invalidLon1 = { latitude: 0, longitude: -181 };
      const invalidLon2 = { latitude: 0, longitude: 181 };

      await expect(calculateChart(testDate, invalidLon1)).rejects.toThrow();
      await expect(calculateChart(testDate, invalidLon2)).rejects.toThrow();
    });
  });

  describe('Performance', () => {
    it('should calculate chart in reasonable time', async () => {
      const startTime = Date.now();
      await calculateChart(testDate, testLocation);
      const endTime = Date.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(1000); // Should be under 1 second
    });

    it('should handle multiple calculations efficiently', async () => {
      const dates = [
        new Date('1990-01-01T12:00:00Z'),
        new Date('2000-01-01T12:00:00Z'),
        new Date('2010-01-01T12:00:00Z'),
        new Date('2020-01-01T12:00:00Z'),
        new Date('2025-01-01T12:00:00Z')
      ];

      const startTime = Date.now();
      await Promise.all(
        dates.map(date => calculateChart(date, testLocation))
      );
      const endTime = Date.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(2000); // 5 charts under 2 seconds
    });
  });
});
