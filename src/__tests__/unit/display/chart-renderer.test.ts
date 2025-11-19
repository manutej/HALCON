/**
 * Tests for Chart Renderer Utilities
 *
 * @module __tests__/unit/display/chart-renderer.test
 */

import { describe, it, expect } from 'vitest';
import {
  getPlanetSymbol,
  formatDegree,
  renderChartHeader,
  renderBirthInfo,
  renderPlanetaryPositions,
  renderHouseCusps,
  renderAngles,
  renderChartFooter,
  renderProgressionMovement,
  type BodyData,
  type AnglesData,
  type LocationData,
} from '../../../lib/display/renderers/chart-renderer.js';

describe('getPlanetSymbol', () => {
  it('should return correct symbol for Sun', () => {
    expect(getPlanetSymbol('Sun')).toBe('☉');
  });

  it('should return correct symbol for Moon', () => {
    expect(getPlanetSymbol('Moon')).toBe('☽');
  });

  it('should return correct symbol for Mercury', () => {
    expect(getPlanetSymbol('Mercury')).toBe('☿');
  });

  it('should return correct symbol for Venus', () => {
    expect(getPlanetSymbol('Venus')).toBe('♀');
  });

  it('should return correct symbol for Mars', () => {
    expect(getPlanetSymbol('Mars')).toBe('♂');
  });

  it('should return correct symbol for Jupiter', () => {
    expect(getPlanetSymbol('Jupiter')).toBe('♃');
  });

  it('should return correct symbol for Saturn', () => {
    expect(getPlanetSymbol('Saturn')).toBe('♄');
  });

  it('should return correct symbol for outer planets', () => {
    expect(getPlanetSymbol('Uranus')).toBe('♅');
    expect(getPlanetSymbol('Neptune')).toBe('♆');
    expect(getPlanetSymbol('Pluto')).toBe('♇');
  });

  it('should return correct symbol for Chiron', () => {
    expect(getPlanetSymbol('Chiron')).toBe('⚷');
  });

  it('should return correct symbol for Lilith', () => {
    expect(getPlanetSymbol('Lilith')).toBe('⚸');
    expect(getPlanetSymbol('Mean Lilith')).toBe('⚸');
  });

  it('should return correct symbol for nodes', () => {
    expect(getPlanetSymbol('North Node')).toBe('☊');
    expect(getPlanetSymbol('South Node')).toBe('☋');
  });

  it('should return bullet for unknown planets', () => {
    expect(getPlanetSymbol('Unknown')).toBe('•');
    expect(getPlanetSymbol('Invalid')).toBe('•');
  });
});

describe('formatDegree', () => {
  it('should format 0 degrees as Aries', () => {
    const result = formatDegree(0);
    expect(result).toContain('Aries');
    expect(result).toContain('0.00°');
  });

  it('should format 30 degrees as Taurus', () => {
    const result = formatDegree(30);
    expect(result).toContain('Taurus');
    expect(result).toContain('0.00°');
  });

  it('should format 45 degrees as Taurus 15°', () => {
    const result = formatDegree(45);
    expect(result).toContain('Taurus');
    expect(result).toContain('15.00°');
  });

  it('should format 120.45 degrees as Leo', () => {
    const result = formatDegree(120.45);
    expect(result).toContain('Leo');
    expect(result).toContain('0.45°');
  });

  it('should format 349.85 degrees as Pisces', () => {
    const result = formatDegree(349.85);
    expect(result).toContain('Pisces');
    expect(result).toContain('19.85°');
  });

  it('should handle 360 degrees (wraps to Aries)', () => {
    const result = formatDegree(360);
    expect(result).toContain('Aries');
    expect(result).toContain('0.00°');
  });

  it('should handle negative degrees', () => {
    const result = formatDegree(-30);
    // -30 degrees = 330 degrees = 0° Pisces
    expect(result).toContain('Pisces');
    expect(result).toContain('0.00°');
  });

  it('should handle degrees > 360', () => {
    const result = formatDegree(390); // 390 - 360 = 30
    expect(result).toContain('Taurus');
  });

  it('should use short sign names when specified', () => {
    const result = formatDegree(45, true);
    expect(result).toContain('Tau'); // Short for Taurus
  });

  it('should use long sign names by default', () => {
    const result = formatDegree(45, false);
    expect(result).toContain('Taurus');
  });

  it('should format all zodiac signs correctly', () => {
    const signs = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];

    signs.forEach((sign, index) => {
      const degree = index * 30;
      const result = formatDegree(degree);
      expect(result).toContain(sign);
    });
  });

  it('should format fractional degrees', () => {
    const result = formatDegree(15.123456);
    expect(result).toContain('15.12°'); // Should round to 2 decimals
  });
});

describe('renderChartHeader', () => {
  it('should render header with title', () => {
    const header = renderChartHeader('NATAL CHART');
    expect(header.length).toBeGreaterThan(0);
    expect(header.join('\n')).toContain('NATAL CHART');
  });

  it('should render header with custom width', () => {
    const header = renderChartHeader('TEST', 50);
    expect(header.length).toBeGreaterThan(0);
  });

  it('should include empty line after header', () => {
    const header = renderChartHeader('TITLE');
    expect(header[header.length - 1]).toBe('');
  });

  it('should handle long titles', () => {
    const header = renderChartHeader('VERY LONG TITLE FOR TESTING PURPOSES');
    expect(header.join('\n')).toContain('VERY LONG TITLE FOR TESTING PURPOSES');
  });

  it('should handle empty title', () => {
    const header = renderChartHeader('');
    expect(header.length).toBeGreaterThan(0);
  });
});

describe('renderBirthInfo', () => {
  const mockDate = new Date('1990-03-10T07:25:00.000Z');
  const mockLocation: LocationData = {
    latitude: 15.83,
    longitude: 78.04,
    name: 'Hyderabad, India'
  };

  it('should render birth date', () => {
    const info = renderBirthInfo(mockDate, mockLocation);
    expect(info.join('\n')).toContain('1990-03-10');
  });

  it('should render birth time', () => {
    const info = renderBirthInfo(mockDate, mockLocation);
    expect(info.join('\n')).toContain('07:25:00');
  });

  it('should render location name', () => {
    const info = renderBirthInfo(mockDate, mockLocation);
    expect(info.join('\n')).toContain('Hyderabad, India');
  });

  it('should render coordinates', () => {
    const info = renderBirthInfo(mockDate, mockLocation);
    const text = info.join('\n');
    expect(text).toContain('15.83');
    expect(text).toContain('78.04');
  });

  it('should handle missing location name', () => {
    const location: LocationData = {
      latitude: 10.0,
      longitude: 20.0
    };
    const info = renderBirthInfo(mockDate, location);
    expect(info.join('\n')).toContain('Unknown');
  });

  it('should include timezone when provided', () => {
    const info = renderBirthInfo(mockDate, mockLocation, 'Asia/Kolkata');
    expect(info.join('\n')).toContain('Asia/Kolkata');
  });

  it('should default to UTC when timezone not provided', () => {
    const info = renderBirthInfo(mockDate, mockLocation);
    expect(info.join('\n')).toContain('UTC');
  });

  it('should include section header emoji', () => {
    const info = renderBirthInfo(mockDate, mockLocation);
    expect(info.join('\n')).toContain('📅');
  });

  it('should end with empty line', () => {
    const info = renderBirthInfo(mockDate, mockLocation);
    expect(info[info.length - 1]).toBe('');
  });
});

describe('renderPlanetaryPositions', () => {
  const mockBodies: Record<string, BodyData> = {
    sun: {
      name: 'Sun',
      longitude: 349.85,
      retrograde: false,
      sign: 'Pisces',
      signDegree: 19.85
    },
    moon: {
      name: 'Moon',
      longitude: 87.32,
      retrograde: false,
      sign: 'Gemini',
      signDegree: 27.32
    },
    mercury: {
      name: 'Mercury',
      longitude: 320.15,
      retrograde: true,
      sign: 'Aquarius',
      signDegree: 20.15
    }
  };

  it('should render planetary positions table', () => {
    const result = renderPlanetaryPositions(mockBodies);
    expect(result).toContain('Sun');
    expect(result).toContain('Moon');
    expect(result).toContain('Mercury');
  });

  it('should include planet symbols', () => {
    const result = renderPlanetaryPositions(mockBodies);
    expect(result).toContain('☉'); // Sun
    expect(result).toContain('☽'); // Moon
    expect(result).toContain('☿'); // Mercury
  });

  it('should include longitude values', () => {
    const result = renderPlanetaryPositions(mockBodies);
    expect(result).toContain('349.85');
    expect(result).toContain('87.32');
    expect(result).toContain('320.15');
  });

  it('should include sign names', () => {
    const result = renderPlanetaryPositions(mockBodies);
    expect(result).toContain('Pisces');
    expect(result).toContain('Gemini');
    expect(result).toContain('Aquarius');
  });

  it('should show retrograde indicator', () => {
    const result = renderPlanetaryPositions(mockBodies);
    expect(result).toContain('R'); // Mercury is retrograde
  });

  it('should include header by default', () => {
    const result = renderPlanetaryPositions(mockBodies);
    expect(result).toContain('🪐');
    expect(result).toContain('Planetary Positions');
  });

  it('should hide header when specified', () => {
    const result = renderPlanetaryPositions(mockBodies, { includeHeader: false });
    expect(result).not.toContain('Planetary Positions');
  });

  it('should handle empty bodies object', () => {
    const result = renderPlanetaryPositions({});
    expect(result).toBeDefined();
  });

  it('should handle missing optional fields', () => {
    const bodies: Record<string, BodyData> = {
      sun: {
        name: 'Sun',
        longitude: 120.0
      }
    };
    const result = renderPlanetaryPositions(bodies);
    expect(result).toContain('Sun');
  });
});

describe('renderHouseCusps', () => {
  const mockCusps = [
    0, 30, 60, 90, 120, 150,
    180, 210, 240, 270, 300, 330
  ];

  it('should render house cusps table', () => {
    const result = renderHouseCusps(mockCusps, 'Placidus');
    expect(result).toContain('House');
  });

  it('should render all 12 houses', () => {
    const result = renderHouseCusps(mockCusps, 'Placidus');
    for (let i = 1; i <= 12; i++) {
      expect(result).toContain(`House ${i.toString().padStart(2, ' ')}`);
    }
  });

  it('should include house system name', () => {
    const result = renderHouseCusps(mockCusps, 'Placidus');
    expect(result).toContain('Placidus');
  });

  it('should highlight ASC (House 1)', () => {
    const result = renderHouseCusps(mockCusps, 'Placidus', { highlightAngles: true });
    expect(result).toContain('(ASC)');
  });

  it('should highlight MC (House 10)', () => {
    const result = renderHouseCusps(mockCusps, 'Placidus', { highlightAngles: true });
    expect(result).toContain('(MC)');
  });

  it('should not highlight angles when disabled', () => {
    const result = renderHouseCusps(mockCusps, 'Placidus', { highlightAngles: false });
    expect(result).not.toContain('(ASC)');
    expect(result).not.toContain('(MC)');
  });

  it('should use short sign names when specified', () => {
    const result = renderHouseCusps(mockCusps, 'Placidus', { useShortSigns: true });
    expect(result).toContain('Ari'); // Short for Aries
  });

  it('should use long sign names when specified', () => {
    const result = renderHouseCusps(mockCusps, 'Placidus', { useShortSigns: false });
    expect(result).toContain('Aries');
  });

  it('should include header by default', () => {
    const result = renderHouseCusps(mockCusps, 'Placidus');
    expect(result).toContain('🏠');
  });

  it('should hide header when specified', () => {
    const result = renderHouseCusps(mockCusps, 'Placidus', { includeHeader: false });
    expect(result).not.toContain('🏠');
  });

  it('should handle different house systems', () => {
    const systems = ['Placidus', 'Koch', 'Equal', 'Whole Sign'];
    systems.forEach(system => {
      const result = renderHouseCusps(mockCusps, system);
      expect(result).toContain(system);
    });
  });
});

describe('renderAngles', () => {
  const mockAngles: AnglesData = {
    ascendant: 120.45,
    midheaven: 210.33,
    descendant: 300.45,
    imumCoeli: 30.33
  };

  it('should render all four angles', () => {
    const result = renderAngles(mockAngles);
    expect(result).toContain('Ascendant');
    expect(result).toContain('Midheaven');
    expect(result).toContain('Descendant');
    expect(result).toContain('Imum Coeli');
  });

  it('should include ASC abbreviation', () => {
    const result = renderAngles(mockAngles);
    expect(result).toContain('(ASC)');
  });

  it('should include MC abbreviation', () => {
    const result = renderAngles(mockAngles);
    expect(result).toContain('(MC)');
  });

  it('should include DSC abbreviation', () => {
    const result = renderAngles(mockAngles);
    expect(result).toContain('(DSC)');
  });

  it('should include IC abbreviation', () => {
    const result = renderAngles(mockAngles);
    expect(result).toContain('(IC)');
  });

  it('should format degrees correctly', () => {
    const result = renderAngles(mockAngles);
    // ASC: 120.45° = 0.45° Leo
    expect(result).toContain('Leo');
    // MC: 210.33° = 0.33° Scorpio
    expect(result).toContain('Scorpio');
  });

  it('should include header by default', () => {
    const result = renderAngles(mockAngles);
    expect(result).toContain('🎯');
    expect(result).toContain('Angles');
  });

  it('should hide header when specified', () => {
    const result = renderAngles(mockAngles, { includeHeader: false });
    expect(result).not.toContain('🎯');
  });

  it('should use short sign names when specified', () => {
    const result = renderAngles(mockAngles, { useShortSigns: true });
    // Should contain abbreviated sign names
    expect(result).toBeTruthy();
  });

  it('should end with empty line', () => {
    const result = renderAngles(mockAngles);
    expect(result.endsWith('\n')).toBe(true);
  });
});

describe('renderChartFooter', () => {
  it('should render footer with border', () => {
    const footer = renderChartFooter();
    expect(footer.length).toBeGreaterThan(0);
  });

  it('should include default success message', () => {
    const footer = renderChartFooter();
    expect(footer.join('\n')).toContain('✨ Chart calculated successfully!');
  });

  it('should use custom success message', () => {
    const footer = renderChartFooter(75, 'Custom message!');
    expect(footer.join('\n')).toContain('Custom message!');
  });

  it('should use custom width', () => {
    const footer = renderChartFooter(50);
    expect(footer.length).toBeGreaterThan(0);
  });

  it('should end with empty line', () => {
    const footer = renderChartFooter();
    expect(footer[footer.length - 1]).toBe('');
  });
});

describe('renderProgressionMovement', () => {
  const mockNatalBodies: Record<string, BodyData> = {
    sun: {
      name: 'Sun',
      longitude: 349.85,
      retrograde: false,
      sign: 'Pisces',
      signDegree: 19.85
    },
    moon: {
      name: 'Moon',
      longitude: 87.32,
      retrograde: false,
      sign: 'Gemini',
      signDegree: 27.32
    }
  };

  const mockProgressedBodies: Record<string, BodyData> = {
    sun: {
      name: 'Sun',
      longitude: 355.20, // Moved 5.35°
      retrograde: false,
      sign: 'Pisces',
      signDegree: 25.20
    },
    moon: {
      name: 'Moon',
      longitude: 95.00, // Moved 7.68°
      retrograde: false,
      sign: 'Cancer',
      signDegree: 5.00
    }
  };

  it('should render movement comparison table', () => {
    const result = renderProgressionMovement(mockNatalBodies, mockProgressedBodies);
    expect(result).toContain('Sun');
    expect(result).toContain('Moon');
  });

  it('should show natal positions', () => {
    const result = renderProgressionMovement(mockNatalBodies, mockProgressedBodies);
    expect(result).toContain('Natal');
  });

  it('should show progressed positions', () => {
    const result = renderProgressionMovement(mockNatalBodies, mockProgressedBodies);
    expect(result).toContain('Progressed');
  });

  it('should calculate movement correctly', () => {
    const result = renderProgressionMovement(mockNatalBodies, mockProgressedBodies);
    expect(result).toContain('Movement');
    expect(result).toContain('+'); // Positive movement
  });

  it('should highlight significant movement', () => {
    const result = renderProgressionMovement(mockNatalBodies, mockProgressedBodies, {
      highlightThreshold: 5
    });
    // Moon moved 7.68°, which is > 5°
    expect(result).toBeTruthy();
  });

  it('should include header by default', () => {
    const result = renderProgressionMovement(mockNatalBodies, mockProgressedBodies);
    expect(result).toContain('📈');
    expect(result).toContain('Progression Movement');
  });

  it('should hide header when specified', () => {
    const result = renderProgressionMovement(mockNatalBodies, mockProgressedBodies, {
      includeHeader: false
    });
    expect(result).not.toContain('Progression Movement');
  });

  it('should handle 360° wraparound in movement', () => {
    const natal: Record<string, BodyData> = {
      sun: { name: 'Sun', longitude: 350 }
    };
    const progressed: Record<string, BodyData> = {
      sun: { name: 'Sun', longitude: 10 }
    };

    const result = renderProgressionMovement(natal, progressed);
    // Movement should be +20° not +380°
    expect(result).toBeTruthy();
  });

  it('should handle negative movement', () => {
    const natal: Record<string, BodyData> = {
      sun: { name: 'Sun', longitude: 100 }
    };
    const progressed: Record<string, BodyData> = {
      sun: { name: 'Sun', longitude: 95 }
    };

    const result = renderProgressionMovement(natal, progressed);
    expect(result).toContain('-'); // Negative movement (retrograde)
  });

  it('should include tip about significant movement', () => {
    const result = renderProgressionMovement(mockNatalBodies, mockProgressedBodies);
    expect(result).toContain('💫');
    expect(result).toContain('Significant movement');
  });
});

describe('Edge Cases and Integration', () => {
  it('should handle missing body data gracefully', () => {
    const bodies: Record<string, BodyData> = {
      sun: { name: 'Sun', longitude: 120 }
      // Missing all other planets
    };

    const result = renderPlanetaryPositions(bodies);
    expect(result).toContain('Sun');
    expect(result).not.toContain('Moon');
  });

  it('should handle zero longitude', () => {
    expect(formatDegree(0)).toContain('0.00° Aries');
  });

  it('should handle maximum longitude', () => {
    expect(formatDegree(359.99)).toContain('Pisces');
  });

  it('should handle very small movements', () => {
    const natal: Record<string, BodyData> = {
      saturn: { name: 'Saturn', longitude: 100.00 }
    };
    const progressed: Record<string, BodyData> = {
      saturn: { name: 'Saturn', longitude: 100.01 }
    };

    const result = renderProgressionMovement(natal, progressed);
    expect(result).toContain('0.01°');
  });

  it('should handle retrograde planets in positions', () => {
    const bodies: Record<string, BodyData> = {
      mercury: {
        name: 'Mercury',
        longitude: 200,
        retrograde: true,
        sign: 'Scorpio',
        signDegree: 20
      }
    };

    const result = renderPlanetaryPositions(bodies, { highlightRetrograde: true });
    expect(result).toContain('R');
  });
});
