/**
 * @file symbols.ts
 * @description Astrological symbol utilities
 */

const PLANET_SYMBOLS: Record<string, string> = {
  'sun': '☉',
  'moon': '☽',
  'mercury': '☿',
  'venus': '♀',
  'mars': '♂',
  'jupiter': '♃',
  'saturn': '♄',
  'uranus': '♅',
  'neptune': '♆',
  'pluto': '♇',
  'chiron': '⚷',
  'lilith': '⚸',
  'mean lilith': '⚸',
  'true lilith': '⚸',
  'north node': '☊',
  'south node': '☋',
  'rahu': '☊',
  'ketu': '☋'
};

const ZODIAC_SYMBOLS: Record<string, string> = {
  'aries': '♈', 'ari': '♈',
  'taurus': '♉', 'tau': '♉',
  'gemini': '♊', 'gem': '♊',
  'cancer': '♋', 'can': '♋',
  'leo': '♌',
  'virgo': '♍', 'vir': '♍',
  'libra': '♎', 'lib': '♎',
  'scorpio': '♏', 'sco': '♏',
  'sagittarius': '♐', 'sag': '♐',
  'capricorn': '♑', 'cap': '♑',
  'aquarius': '♒', 'aqu': '♒',
  'pisces': '♓', 'pis': '♓'
};

const ASPECT_SYMBOLS: Record<string | number, string> = {
  'conjunction': '☌', 0: '☌',
  'opposition': '☍', 180: '☍',
  'trine': '△', 120: '△',
  'square': '□', 90: '□',
  'sextile': '⚹', 60: '⚹',
  'quincunx': '⚻', 150: '⚻',
  'semi-sextile': '⚺', 30: '⚺',
  'semi-square': '∠', 45: '∠',
  'sesquiquadrate': '⚼', 135: '⚼'
};

const HOUSE_SYMBOLS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const ZODIAC_SYMBOL_ARRAY = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

export function getPlanetSymbol(name: string | null | undefined): string {
  if (!name) return '•';
  const normalized = name.toString().toLowerCase().trim();
  return PLANET_SYMBOLS[normalized] || '•';
}

export function getZodiacSymbol(nameOrIndex: string | number): string {
  if (typeof nameOrIndex === 'number') {
    // Strict index validation - return fallback for out of bounds
    if (nameOrIndex < 0 || nameOrIndex >= 12) {
      return '•';
    }
    return ZODIAC_SYMBOL_ARRAY[nameOrIndex] || '•';
  }
  const normalized = nameOrIndex.toLowerCase().trim();
  return ZODIAC_SYMBOLS[normalized] || '•';
}

export function getAspectSymbol(nameOrAngle: string | number): string {
  const key = typeof nameOrAngle === 'string' ? nameOrAngle.toLowerCase().trim() : nameOrAngle;
  return ASPECT_SYMBOLS[key] || '';
}

export function getHouseSymbol(houseNumber: number, zeroIndexed: boolean = false): string {
  const index = zeroIndexed ? houseNumber : houseNumber - 1;
  return HOUSE_SYMBOLS[index] || '';
}

export function getAllPlanetSymbols(): Record<string, string> {
  return {
    Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
    Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
    Chiron: '⚷', Lilith: '⚸', 'North Node': '☊', 'South Node': '☋'
  };
}

export function getAllZodiacSymbols(): string[] {
  return [...ZODIAC_SYMBOL_ARRAY];
}

export function isValidPlanetName(name: string): boolean {
  if (!name) return false;
  return PLANET_SYMBOLS.hasOwnProperty(name.toLowerCase().trim());
}

export function isValidZodiacSign(nameOrIndex: string | number): boolean {
  if (typeof nameOrIndex === 'number') {
    return nameOrIndex >= 0 && nameOrIndex < 12;
  }
  return ZODIAC_SYMBOLS.hasOwnProperty(nameOrIndex.toLowerCase().trim());
}

// Export zodiac sign names and abbreviations for use in tests and displays
export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
] as const;

export const ZODIAC_SIGNS_ABBREV = [
  'Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir',
  'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'
] as const;

// Export zodiac symbols as an array (different from the internal ZODIAC_SYMBOLS object)
export { ZODIAC_SYMBOL_ARRAY as ZODIAC_SYMBOLS };

// Export planet order for consistent display ordering
export const PLANET_ORDER = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
  'chiron', 'lilith', 'northNode'
] as const;

// Re-export getMoonPhaseSymbol from moon-phase module for convenience
export { getMoonPhaseSymbol } from '../moon-phase/index.js';
