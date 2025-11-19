# Display Utilities Library

Comprehensive display and formatting utilities for HALCON CLI commands.

## Overview

The `display` library provides type-safe, well-tested formatting functions for astrological data. These utilities ensure consistent output across all HALCON commands and eliminate code duplication.

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Formatters](#formatters)
4. [Code Examples](#code-examples)
5. [Type Definitions](#type-definitions)
6. [Best Practices](#best-practices)
7. [Testing](#testing)

---

## Installation

The display utilities are part of the HALCON project and are available automatically when working within the codebase.

**Import Path:**
```typescript
import { formatDegree, formatCoordinate, formatCoordinates, formatDateTime } from '../lib/display/formatters.js';
```

**Note**: Use relative paths based on your file location. For commands in `src/commands/`, use `../lib/display/formatters.js`.

---

## Quick Start

### Basic Usage

```typescript
import { formatDegree, formatCoordinates } from '../lib/display/formatters.js';

// Format a degree value
const degree = formatDegree(45.5);
console.log(degree);  // "15.50° Taurus"

// Format coordinates
const coords = formatCoordinates(40.7128, -74.0060);
console.log(coords);  // "40.7128°N, 74.0060°W"
```

### With Options

```typescript
import { formatDegree, formatCoordinate } from '../lib/display/formatters.js';

// Use abbreviated sign names
const degree = formatDegree(45.5, { signFormat: 'abbreviated' });
console.log(degree);  // "15.50° Tau"

// Use DMS (Degrees/Minutes/Seconds) format
const coord = formatCoordinate(40.7128, 'latitude', { useDMS: true });
console.log(coord);  // "40°42'46\"N"
```

---

## Formatters

### `formatDegree(degrees, options?)`

Converts absolute degrees (0-360) to zodiac sign notation.

**Parameters:**
- `degrees: number` - Absolute degrees (any number, will be normalized to 0-360)
- `options?: DegreeFormatOptions` - Optional formatting options

**Returns**: `string` - Formatted degree string

**Options:**

```typescript
interface DegreeFormatOptions {
  signFormat?: 'full' | 'abbreviated' | 'symbol';  // Default: 'full'
  precision?: number;                               // Default: 2
  includeMinutes?: boolean;                         // Default: false
  includeSeconds?: boolean;                         // Default: false (requires includeMinutes)
}
```

**Features:**
- ✅ Automatic 360° wraparound
- ✅ Negative degree handling
- ✅ Three sign format options
- ✅ Configurable precision
- ✅ DMS (Degrees/Minutes/Seconds) support

**Examples:**

```typescript
// Basic usage (full sign names, 2 decimal places)
formatDegree(45.5);  // "15.50° Taurus"
formatDegree(360);   // "0.00° Aries"
formatDegree(-30);   // "0.00° Capricorn"

// Abbreviated sign names
formatDegree(45.5, { signFormat: 'abbreviated' });  // "15.50° Tau"

// Symbol format
formatDegree(45.5, { signFormat: 'symbol' });  // "15.50° ♉"

// Custom precision
formatDegree(45.5, { precision: 4 });  // "15.5000° Taurus"
formatDegree(45.5, { precision: 0 });  // "16° Taurus"

// DMS format
formatDegree(45.5, { includeMinutes: true });  // "15°30' Taurus"
formatDegree(45.5, { includeMinutes: true, includeSeconds: true });  // "15°30'00\" Taurus"

// Combine options
formatDegree(45.5, {
  signFormat: 'abbreviated',
  includeMinutes: true
});  // "15°30' Tau"
```

**Zodiac Sign Mapping:**
- 0-30°: Aries (♈)
- 30-60°: Taurus (♉)
- 60-90°: Gemini (♊)
- 90-120°: Cancer (♋)
- 120-150°: Leo (♌)
- 150-180°: Virgo (♍)
- 180-210°: Libra (♎)
- 210-240°: Scorpio (♏)
- 240-270°: Sagittarius (♐)
- 270-300°: Capricorn (♑)
- 300-330°: Aquarius (♒)
- 330-360°: Pisces (♓)

---

### `formatCoordinate(value, type, options?)`

Formats a single geographic coordinate (latitude or longitude).

**Parameters:**
- `value: number` - Coordinate value (latitude: -90 to 90, longitude: -180 to 180)
- `type: 'latitude' | 'longitude'` - Coordinate type
- `options?: CoordinateFormatOptions` - Optional formatting options

**Returns**: `string` - Formatted coordinate string

**Options:**

```typescript
interface CoordinateFormatOptions {
  precision?: number;           // Default: 4
  includeDirection?: boolean;   // Default: true
  useDMS?: boolean;             // Default: false
}
```

**Features:**
- ✅ Automatic direction indicators (N/S/E/W)
- ✅ Configurable precision
- ✅ DMS format support
- ✅ Handles negative coordinates

**Examples:**

```typescript
// Basic latitude
formatCoordinate(40.7128, 'latitude');  // "40.7128°N"
formatCoordinate(-33.8688, 'latitude'); // "33.8688°S"

// Basic longitude
formatCoordinate(-74.0060, 'longitude');  // "74.0060°W"
formatCoordinate(151.2093, 'longitude');  // "151.2093°E"

// Custom precision
formatCoordinate(40.7128, 'latitude', { precision: 2 });  // "40.71°N"
formatCoordinate(40.7128, 'latitude', { precision: 6 });  // "40.712800°N"

// Without direction
formatCoordinate(40.7128, 'latitude', { includeDirection: false });  // "40.7128°"

// DMS format
formatCoordinate(40.7128, 'latitude', { useDMS: true });  // "40°42'46\"N"
formatCoordinate(-74.0060, 'longitude', { useDMS: true }); // "74°00'22\"W"
```

---

### `formatCoordinates(latitude, longitude, options?)`

Convenience function for formatting coordinate pairs (lat/lon together).

**Parameters:**
- `latitude: number` - Latitude value
- `longitude: number` - Longitude value
- `options?: CoordinateFormatOptions` - Optional formatting options

**Returns**: `string` - Formatted coordinate pair string

**Examples:**

```typescript
// Basic usage
formatCoordinates(40.7128, -74.0060);  // "40.7128°N, 74.0060°W"

// Southern and Eastern hemispheres
formatCoordinates(-33.8688, 151.2093);  // "33.8688°S, 151.2093°E"

// Custom precision
formatCoordinates(40.7128, -74.0060, { precision: 2 });  // "40.71°N, 74.01°W"

// DMS format
formatCoordinates(40.7128, -74.0060, { useDMS: true });
// "40°42'46\"N, 74°00'22\"W"

// Without direction
formatCoordinates(40.7128, -74.0060, { includeDirection: false });
// "40.7128°, 74.0060°"
```

---

### `formatDateTime(date, options?)`

Flexible date/time formatting with timezone support.

**Parameters:**
- `date: Date | string` - Date object or ISO string
- `options?: DateFormatOptions` - Optional formatting options

**Returns**: `string` - Formatted date/time string

**Options:**

```typescript
type DateFormatStyle = 'long' | 'short' | 'iso' | 'medium';

interface DateFormatOptions {
  style?: DateFormatStyle;      // Default: 'long'
  includeTimezone?: boolean;    // Default: false
  includeTime?: boolean;        // Default: false
  timezone?: string;            // Default: 'UTC'
}
```

**Features:**
- ✅ Multiple format styles
- ✅ Timezone support
- ✅ Optional time display
- ✅ Invalid date handling
- ✅ Accepts Date objects or ISO strings

**Examples:**

```typescript
const date = new Date('2025-11-19T14:30:00Z');

// Long format (default)
formatDateTime(date);  // "November 19, 2025"

// Short format
formatDateTime(date, { style: 'short' });  // "11/19/2025"

// Medium format
formatDateTime(date, { style: 'medium' });  // "Nov 19, 2025"

// ISO format
formatDateTime(date, { style: 'iso' });  // "2025-11-19"

// Include time
formatDateTime(date, { includeTime: true });
// "November 19, 2025, 2:30 PM"

// Include time and timezone
formatDateTime(date, { includeTime: true, includeTimezone: true });
// "November 19, 2025, 2:30 PM UTC"

// ISO with time
formatDateTime(date, { style: 'iso', includeTime: true });
// "2025-11-19T14:30:00"

// ISO with time and timezone
formatDateTime(date, { style: 'iso', includeTime: true, includeTimezone: true });
// "2025-11-19T14:30:00Z"

// Different timezone
formatDateTime(date, { includeTime: true, timezone: 'America/New_York' });
// "November 19, 2025, 9:30 AM" (EST/EDT)

// Invalid date handling
formatDateTime('invalid');  // "Invalid Date"
```

---

## Code Examples

### Example 1: Displaying Planetary Positions

```typescript
import { formatDegree } from '../lib/display/formatters.js';
import { getPlanetSymbol } from '../../utils/symbols.js';
import chalk from 'chalk';

function displayPlanets(bodies: any) {
  console.log(chalk.gray('   ' + '─'.repeat(70)));
  console.log(chalk.gray('   Planet       Longitude    Sign              Degree   Retrograde'));
  console.log(chalk.gray('   ' + '─'.repeat(70)));

  const planetOrder = ['sun', 'moon', 'mercury', 'venus', 'mars'];

  planetOrder.forEach(key => {
    const body = bodies[key];
    if (body) {
      const symbol = getPlanetSymbol(body.name);
      const name = body.name.padEnd(10);
      const lon = body.longitude.toFixed(2).padStart(7);
      const signDegree = formatDegree(body.longitude);
      const retro = body.retrograde ? chalk.red('    R') : '     ';

      console.log(chalk.white(`   ${symbol} ${name}  ${lon}°   ${signDegree}${retro}`));
    }
  });

  console.log(chalk.gray('   ' + '─'.repeat(70)));
}
```

### Example 2: Displaying Location Information

```typescript
import { formatCoordinates } from '../lib/display/formatters.js';
import chalk from 'chalk';

function displayLocation(location: GeoCoordinates) {
  console.log(chalk.bold.yellow('📍 Location:'));
  console.log(chalk.white(`   ${location.name || 'Unknown'}`));

  const coords = formatCoordinates(location.latitude, location.longitude, { precision: 2 });
  console.log(chalk.white(`   ${coords}`));
}
```

### Example 3: Displaying Birth Information

```typescript
import { formatDateTime, formatCoordinates } from '../lib/display/formatters.js';
import chalk from 'chalk';

function displayBirthInfo(timestamp: Date, location: GeoCoordinates) {
  console.log(chalk.bold.yellow('📅 Birth Information:'));

  const dateStr = formatDateTime(timestamp, { style: 'long' });
  const timeStr = formatDateTime(timestamp, { style: 'iso', includeTime: true, includeTimezone: true });
  const coords = formatCoordinates(location.latitude, location.longitude);

  console.log(chalk.greenBright(`   Date: ${dateStr}`));
  console.log(chalk.greenBright(`   Time: ${timeStr}`));
  console.log(chalk.greenBright(`   Location: ${location.name || 'Unknown'}`));
  console.log(chalk.greenBright(`   Coordinates: ${coords}`));
}
```

### Example 4: Displaying House Cusps

```typescript
import { formatDegree } from '../lib/display/formatters.js';
import chalk from 'chalk';

function displayHouses(houses: any) {
  console.log(chalk.bold.yellow(`🏠 Houses (${houses.system}):`));
  console.log(chalk.gray('   ' + '─'.repeat(40)));

  houses.cusps.forEach((cusp: number, index: number) => {
    const houseNum = (index + 1).toString().padStart(2);
    const cuspStr = formatDegree(cusp, { signFormat: 'abbreviated' });
    console.log(chalk.magentaBright(`   House ${houseNum}: ${cuspStr}`));
  });

  console.log(chalk.gray('   ' + '─'.repeat(40)));
}
```

---

## Type Definitions

### `DegreeFormatOptions`

```typescript
interface DegreeFormatOptions {
  /** Format for sign names: 'full' (Aries), 'abbreviated' (Ari), 'symbol' (♈) */
  signFormat?: 'full' | 'abbreviated' | 'symbol';

  /** Number of decimal places for degrees (default: 2) */
  precision?: number;

  /** Include minutes in the output (overrides precision) */
  includeMinutes?: boolean;

  /** Include seconds in the output (requires includeMinutes) */
  includeSeconds?: boolean;
}
```

### `CoordinateFormatOptions`

```typescript
interface CoordinateFormatOptions {
  /** Number of decimal places (default: 4) */
  precision?: number;

  /** Include direction letters (N/S/E/W) (default: true) */
  includeDirection?: boolean;

  /** Use symbols (° ' \") instead of decimal (default: false) */
  useDMS?: boolean;
}
```

### `DateFormatOptions`

```typescript
type DateFormatStyle = 'long' | 'short' | 'iso' | 'medium';

interface DateFormatOptions {
  /** Format style (default: 'long') */
  style?: DateFormatStyle;

  /** Include timezone in output (default: false) */
  includeTimezone?: boolean;

  /** Include time in output (default: false) */
  includeTime?: boolean;

  /** Timezone to display in (default: 'UTC') */
  timezone?: string;
}
```

---

## Best Practices

### 1. Use Type-Safe Options

Always use TypeScript interfaces for options:

```typescript
// ✅ Good
const options: DegreeFormatOptions = {
  signFormat: 'abbreviated',
  precision: 2
};
formatDegree(45.5, options);

// ❌ Avoid
formatDegree(45.5, { signFormat: 'abbrev' }); // Typo won't be caught
```

### 2. Choose the Right Formatter

Use comprehensive formatters from `lib/display/formatters.ts` when you need options:

```typescript
// ✅ Good - Need options
import { formatDegree } from '../lib/display/formatters.js';
formatDegree(deg, { signFormat: 'symbol' });

// ✅ Also good - Simple use case, no options
import { formatDegree } from '../utils/formatters.js';
formatDegree(deg);
```

### 3. Consistent Precision

Use consistent precision across related outputs:

```typescript
// ✅ Good - Consistent precision
const COORD_PRECISION = 2;
console.log(formatCoordinates(lat, lon, { precision: COORD_PRECISION }));

// ❌ Avoid - Inconsistent precision
console.log(formatCoordinate(lat, 'latitude', { precision: 2 }));
console.log(formatCoordinate(lon, 'longitude', { precision: 4 }));
```

### 4. Handle Invalid Input

Always validate input before formatting:

```typescript
// ✅ Good
if (!isNaN(degree) && degree !== null) {
  console.log(formatDegree(degree));
} else {
  console.log('Invalid degree value');
}

// ❌ Avoid - No validation
console.log(formatDegree(degree)); // May produce unexpected output
```

### 5. Use Constants for Options

Define formatting options as constants when used multiple times:

```typescript
// ✅ Good
const DEGREE_FORMAT_OPTIONS: DegreeFormatOptions = {
  signFormat: 'abbreviated',
  precision: 2
};

houses.cusps.forEach(cusp => {
  console.log(formatDegree(cusp, DEGREE_FORMAT_OPTIONS));
});

// ❌ Avoid - Repeated options
houses.cusps.forEach(cusp => {
  console.log(formatDegree(cusp, { signFormat: 'abbreviated', precision: 2 }));
});
```

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests for specific file
npm test -- formatters.test.ts

# Run with coverage
npm run test:coverage
```

### Test Structure

Tests are located in `src/lib/display/__tests__/`:

- `formatters.test.ts` - Tests for all formatter functions
- `symbols.test.ts` - Tests for symbol utilities

### Writing Tests

Example test structure:

```typescript
import { formatDegree } from '../formatters.js';

describe('formatDegree', () => {
  it('should format degrees with full sign names by default', () => {
    expect(formatDegree(45.5)).toBe('15.50° Taurus');
  });

  it('should handle 360° wraparound', () => {
    expect(formatDegree(360)).toBe('0.00° Aries');
    expect(formatDegree(390)).toBe('30.00° Taurus');
  });

  it('should handle negative degrees', () => {
    expect(formatDegree(-30)).toBe('0.00° Capricorn');
  });

  it('should use abbreviated signs when requested', () => {
    expect(formatDegree(45.5, { signFormat: 'abbreviated' })).toBe('15.50° Tau');
  });
});
```

---

## API Reference Summary

| Function | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| `formatDegree()` | `(degrees, options?)` | `string` | Format degrees to zodiac notation |
| `formatCoordinate()` | `(value, type, options?)` | `string` | Format single coordinate |
| `formatCoordinates()` | `(lat, lon, options?)` | `string` | Format coordinate pair |
| `formatDateTime()` | `(date, options?)` | `string` | Format date/time with timezone |

---

## Related Documentation

- [Utility Formatters](../../utils/README.md#formatters) - Lightweight formatters
- [Symbol Utilities](../../utils/README.md#symbols) - Planet symbols and constants
- [Refactoring Guide](../../../docs/REFACTORING-COMPLETE.md) - CLI refactoring overview
- [Architecture Review](../../../docs/architecture-review-cli-commands.md) - Architecture details

---

## Support

For issues, questions, or contributions:

1. Check the [Architecture Review](../../../docs/architecture-review-cli-commands.md)
2. Review [existing tests](./__ tests__/)
3. See [REFACTORING-COMPLETE.md](../../../docs/REFACTORING-COMPLETE.md) for migration examples

---

**Last Updated**: 2025-11-19
**Version**: 1.0
**Status**: Active Development
