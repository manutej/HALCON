/**
 * Tests for Astrological Symbols Utility
 * @module lib/display/__tests__/symbols.test
 */

import { describe, it, expect } from 'vitest';
import {
  getPlanetSymbol,
  getZodiacSymbol,
  getMoonPhaseSymbol,
  PLANET_ORDER,
  ZODIAC_SIGNS,
  ZODIAC_SIGNS_ABBREV,
  ZODIAC_SYMBOLS
} from '../../lib/display/symbols.js';

describe('symbols', () => {
  describe('getPlanetSymbol', () => {
    it('should return correct symbols for all major planets', () => {
      expect(getPlanetSymbol('Sun')).toBe('☉');
      expect(getPlanetSymbol('Moon')).toBe('☽');
      expect(getPlanetSymbol('Mercury')).toBe('☿');
      expect(getPlanetSymbol('Venus')).toBe('♀');
      expect(getPlanetSymbol('Mars')).toBe('♂');
      expect(getPlanetSymbol('Jupiter')).toBe('♃');
      expect(getPlanetSymbol('Saturn')).toBe('♄');
      expect(getPlanetSymbol('Uranus')).toBe('♅');
      expect(getPlanetSymbol('Neptune')).toBe('♆');
      expect(getPlanetSymbol('Pluto')).toBe('♇');
    });

    it('should return correct symbols for special points', () => {
      expect(getPlanetSymbol('Chiron')).toBe('⚷');
      expect(getPlanetSymbol('Lilith')).toBe('⚸');
      expect(getPlanetSymbol('Mean Lilith')).toBe('⚸');
      expect(getPlanetSymbol('North Node')).toBe('☊');
      expect(getPlanetSymbol('South Node')).toBe('☋');
    });

    it('should return fallback symbol for unknown planets', () => {
      expect(getPlanetSymbol('Unknown')).toBe('•');
      expect(getPlanetSymbol('Ceres')).toBe('•');
      expect(getPlanetSymbol('')).toBe('•');
    });

    it('should be case-insensitive', () => {
      expect(getPlanetSymbol('sun')).toBe('☉');
      expect(getPlanetSymbol('Sun')).toBe('☉');
      expect(getPlanetSymbol('SUN')).toBe('☉');
      expect(getPlanetSymbol('MOON')).toBe('☽');
      expect(getPlanetSymbol('Moon')).toBe('☽');
      expect(getPlanetSymbol('moon')).toBe('☽');
    });
  });

  describe('getZodiacSymbol', () => {
    it('should return correct symbols for all zodiac signs by name', () => {
      expect(getZodiacSymbol('Aries')).toBe('♈');
      expect(getZodiacSymbol('Taurus')).toBe('♉');
      expect(getZodiacSymbol('Gemini')).toBe('♊');
      expect(getZodiacSymbol('Cancer')).toBe('♋');
      expect(getZodiacSymbol('Leo')).toBe('♌');
      expect(getZodiacSymbol('Virgo')).toBe('♍');
      expect(getZodiacSymbol('Libra')).toBe('♎');
      expect(getZodiacSymbol('Scorpio')).toBe('♏');
      expect(getZodiacSymbol('Sagittarius')).toBe('♐');
      expect(getZodiacSymbol('Capricorn')).toBe('♑');
      expect(getZodiacSymbol('Aquarius')).toBe('♒');
      expect(getZodiacSymbol('Pisces')).toBe('♓');
    });

    it('should return correct symbols for all zodiac signs by index', () => {
      expect(getZodiacSymbol(0)).toBe('♈'); // Aries
      expect(getZodiacSymbol(1)).toBe('♉'); // Taurus
      expect(getZodiacSymbol(2)).toBe('♊'); // Gemini
      expect(getZodiacSymbol(3)).toBe('♋'); // Cancer
      expect(getZodiacSymbol(4)).toBe('♌'); // Leo
      expect(getZodiacSymbol(5)).toBe('♍'); // Virgo
      expect(getZodiacSymbol(6)).toBe('♎'); // Libra
      expect(getZodiacSymbol(7)).toBe('♏'); // Scorpio
      expect(getZodiacSymbol(8)).toBe('♐'); // Sagittarius
      expect(getZodiacSymbol(9)).toBe('♑'); // Capricorn
      expect(getZodiacSymbol(10)).toBe('♒'); // Aquarius
      expect(getZodiacSymbol(11)).toBe('♓'); // Pisces
    });

    it('should return fallback for unknown sign names', () => {
      expect(getZodiacSymbol('Unknown')).toBe('•');
      expect(getZodiacSymbol('Ophiuchus')).toBe('•');
      expect(getZodiacSymbol('')).toBe('•');
    });

    it('should return fallback for invalid indices', () => {
      expect(getZodiacSymbol(-1)).toBe('•');
      expect(getZodiacSymbol(12)).toBe('•');
      expect(getZodiacSymbol(100)).toBe('•');
    });

    it('should be case-insensitive for sign names', () => {
      expect(getZodiacSymbol('aries')).toBe('♈');
      expect(getZodiacSymbol('Aries')).toBe('♈');
      expect(getZodiacSymbol('ARIES')).toBe('♈');
      expect(getZodiacSymbol('TAURUS')).toBe('♉');
      expect(getZodiacSymbol('Taurus')).toBe('♉');
      expect(getZodiacSymbol('taurus')).toBe('♉');
    });
  });

  describe('getMoonPhaseSymbol', () => {
    it('should return correct symbols for all moon phases', () => {
      expect(getMoonPhaseSymbol('New Moon')).toBe('🌑');
      expect(getMoonPhaseSymbol('Waxing Crescent')).toBe('🌒');
      expect(getMoonPhaseSymbol('First Quarter')).toBe('🌓');
      expect(getMoonPhaseSymbol('Waxing Gibbous')).toBe('🌔');
      expect(getMoonPhaseSymbol('Full Moon')).toBe('🌕');
      expect(getMoonPhaseSymbol('Waning Gibbous')).toBe('🌖');
      expect(getMoonPhaseSymbol('Third Quarter')).toBe('🌗');
      expect(getMoonPhaseSymbol('Waning Crescent')).toBe('🌘');
    });

    it('should return fallback for unknown phase', () => {
      expect(getMoonPhaseSymbol('Unknown Phase')).toBe('🌙');
      expect(getMoonPhaseSymbol('')).toBe('🌙');
    });
  });

  describe('PLANET_ORDER constant', () => {
    it('should contain all major planets in correct order', () => {
      expect(PLANET_ORDER).toEqual([
        'sun',
        'moon',
        'mercury',
        'venus',
        'mars',
        'jupiter',
        'saturn',
        'uranus',
        'neptune',
        'pluto',
        'chiron',
        'lilith',
        'northNode'
      ]);
    });

    it('should be read-only array', () => {
      expect(Array.isArray(PLANET_ORDER)).toBe(true);
      expect(PLANET_ORDER.length).toBe(13);
    });
  });

  describe('ZODIAC_SIGNS constant', () => {
    it('should contain all 12 zodiac sign names', () => {
      expect(ZODIAC_SIGNS).toEqual([
        'Aries',
        'Taurus',
        'Gemini',
        'Cancer',
        'Leo',
        'Virgo',
        'Libra',
        'Scorpio',
        'Sagittarius',
        'Capricorn',
        'Aquarius',
        'Pisces'
      ]);
    });

    it('should be read-only array with 12 elements', () => {
      expect(Array.isArray(ZODIAC_SIGNS)).toBe(true);
      expect(ZODIAC_SIGNS.length).toBe(12);
    });
  });

  describe('ZODIAC_SIGNS_ABBREV constant', () => {
    it('should contain all 12 zodiac sign abbreviations', () => {
      expect(ZODIAC_SIGNS_ABBREV).toEqual([
        'Ari',
        'Tau',
        'Gem',
        'Can',
        'Leo',
        'Vir',
        'Lib',
        'Sco',
        'Sag',
        'Cap',
        'Aqu',
        'Pis'
      ]);
    });

    it('should be read-only array with 12 elements', () => {
      expect(Array.isArray(ZODIAC_SIGNS_ABBREV)).toBe(true);
      expect(ZODIAC_SIGNS_ABBREV.length).toBe(12);
    });
  });

  describe('ZODIAC_SYMBOLS constant', () => {
    it('should contain all 12 zodiac symbols in correct order', () => {
      expect(ZODIAC_SYMBOLS).toEqual([
        '♈', // Aries
        '♉', // Taurus
        '♊', // Gemini
        '♋', // Cancer
        '♌', // Leo
        '♍', // Virgo
        '♎', // Libra
        '♏', // Scorpio
        '♐', // Sagittarius
        '♑', // Capricorn
        '♒', // Aquarius
        '♓'  // Pisces
      ]);
    });

    it('should be read-only array with 12 elements', () => {
      expect(Array.isArray(ZODIAC_SYMBOLS)).toBe(true);
      expect(ZODIAC_SYMBOLS.length).toBe(12);
    });

    it('should match getZodiacSymbol by index', () => {
      for (let i = 0; i < ZODIAC_SYMBOLS.length; i++) {
        expect(getZodiacSymbol(i)).toBe(ZODIAC_SYMBOLS[i]);
      }
    });
  });

  describe('integration', () => {
    it('should provide consistent symbols across functions and constants', () => {
      // Verify zodiac symbols match
      ZODIAC_SIGNS.forEach((sign: string, index: number) => {
        expect(getZodiacSymbol(sign)).toBe(ZODIAC_SYMBOLS[index]);
        expect(getZodiacSymbol(index)).toBe(ZODIAC_SYMBOLS[index]);
      });
    });

    it('should handle all planet order entries', () => {
      const validPlanets = PLANET_ORDER.filter((p: string) => p !== 'northNode' && p !== 'lilith');

      // All planet names should return non-fallback symbols
      validPlanets.forEach((planetKey: string) => {
        const capitalizedName = planetKey.charAt(0).toUpperCase() + planetKey.slice(1);
        const symbol = getPlanetSymbol(capitalizedName);
        expect(symbol).not.toBe('•'); // Should not be fallback
      });
    });
  });
});
