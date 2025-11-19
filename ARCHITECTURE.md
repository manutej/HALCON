# HALCON Architecture Documentation

**Project**: HALCON - Cosmic Productivity Platform
**Last Updated**: 2025-11-19
**Version**: 2.0
**Status**: Active Development

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [CLI Commands Architecture](#cli-commands-architecture)
4. [Shared Utilities Pattern](#shared-utilities-pattern)
5. [Directory Structure](#directory-structure)
6. [Design Principles](#design-principles)
7. [Best Practices](#best-practices)
8. [Adding New Commands](#adding-new-commands)
9. [Testing Strategy](#testing-strategy)
10. [Future Architecture](#future-architecture)

---

## Overview

HALCON is a cosmic productivity platform that combines astrological calculations with CLI tools and a React-based web interface. The system is built on TypeScript with a focus on code quality, maintainability, and Test-Driven Development (TDD).

### Core Technologies

- **Language**: TypeScript (strict mode)
- **Astrological Engine**: Swiss Ephemeris
- **CLI Framework**: Commander.js
- **UI Framework**: React 18 + Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library
- **Date/Time**: Luxon (timezone support)
- **Terminal Output**: Chalk (colors)

### Key Features

- Natal chart calculations
- House system calculations (5 systems supported)
- Planetary transits with moon phases
- Secondary progressions
- Profile management with timezone support
- Beautiful terminal output
- JSON export option
- Web UI with orbital navigation

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     HALCON PLATFORM                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│      CLI INTERFACE        │   │      WEB INTERFACE        │
│                           │   │                           │
│  ┌─────────────────────┐ │   │  ┌─────────────────────┐ │
│  │ Commands            │ │   │  │ React Components    │ │
│  │ - chart             │ │   │  │ - OrbitalDashboard  │ │
│  │ - houses            │ │   │  │ - PlanetInfo        │ │
│  │ - transits          │ │   │  │ - CosmicWeather     │ │
│  │ - progressions      │ │   │  └─────────────────────┘ │
│  └─────────────────────┘ │   │                           │
│  ┌─────────────────────┐ │   │  ┌─────────────────────┐ │
│  │ Shared Utilities    │ │   │  │ Zustand Store       │ │
│  │ - formatters        │ │   │  │ - App state         │ │
│  │ - symbols           │ │   │  │ - User profile      │ │
│  └─────────────────────┘ │   │  └─────────────────────┘ │
└───────────┬───────────────┘   └───────────┬───────────────┘
            │                               │
            └───────────────┬───────────────┘
                            ▼
            ┌───────────────────────────────┐
            │      CORE LIBRARIES           │
            │                               │
            │  ┌─────────────────────────┐ │
            │  │ Swiss Ephemeris         │ │
            │  │ - Planet calculations   │ │
            │  │ - House calculations    │ │
            │  └─────────────────────────┘ │
            │                               │
            │  ┌─────────────────────────┐ │
            │  │ Profile Manager         │ │
            │  │ - Profile storage       │ │
            │  │ - Timezone conversion   │ │
            │  └─────────────────────────┘ │
            │                               │
            │  ┌─────────────────────────┐ │
            │  │ Transits                │ │
            │  │ Moon Phase              │ │
            │  │ Progressions            │ │
            │  └─────────────────────────┘ │
            └───────────────────────────────┘
```

---

## CLI Commands Architecture

### Overview

The CLI architecture follows a **shared utilities pattern** to eliminate code duplication and ensure consistency across all commands.

### Architecture Diagram (Current State - Phase 1 Complete)

```
src/
├── commands/                    # CLI commands (business logic)
│   ├── chart.ts                # Natal chart command (257 lines)
│   │   ├── [DUPLICATE] formatDegree()
│   │   └── [DUPLICATE] getPlanetSymbol()
│   │
│   ├── houses.ts               # House calculations (292 lines)
│   │   └── [DUPLICATE] formatDegree()
│   │
│   ├── progressions.ts         # Secondary progressions (404 lines)
│   │   ├── [DUPLICATE] formatDegree()
│   │   └── [DUPLICATE] getPlanetSymbol()
│   │
│   └── transits.ts             # Transits (213 lines) ✅ REFACTORED
│       ├── import { formatDegree } from '../utils/formatters.js'
│       └── import { getPlanetSymbol } from '../utils/symbols.js'
│
├── lib/                        # Core libraries
│   ├── display/                # Display utilities (comprehensive)
│   │   ├── formatters.ts       # Advanced formatters (326 lines)
│   │   │   ├── formatDegree()
│   │   │   ├── formatCoordinate()
│   │   │   ├── formatCoordinates()
│   │   │   └── formatDateTime()
│   │   └── __tests__/
│   │       └── symbols.test.ts
│   │
│   ├── swisseph/               # Swiss Ephemeris wrapper
│   │   ├── index.ts
│   │   └── types.ts
│   │
│   ├── profiles/               # Profile management
│   │   └── index.ts
│   │
│   ├── transits/               # Transit calculations
│   │   └── index.ts
│   │
│   ├── moon-phase/             # Moon phase calculations
│   │   └── index.ts
│   │
│   └── progressions/           # Progression calculations
│       └── index.ts
│
└── utils/                      # Utility functions (lightweight)
    ├── formatters.ts           # Simple formatters (44 lines)
    │   ├── formatDegree()
    │   └── formatCoordinates()
    │
    └── symbols.ts              # Planet symbols (62 lines)
        ├── PLANET_SYMBOLS
        ├── getPlanetSymbol()
        ├── PLANET_ORDER
        └── EXTENDED_PLANET_ORDER
```

### Command Structure Pattern

All CLI commands follow this standard structure:

```typescript
#!/usr/bin/env node
/**
 * HALCON [Command Name] Command
 * [Brief description]
 *
 * @module commands/[command-name]
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { DateTime } from 'luxon';

// Import from core libraries
import { calculateSomething } from '../lib/some-library/index.js';
import type { SomeType } from '../lib/some-library/types.js';
import { getProfileManager } from '../lib/profiles/index.js';

// Import shared utilities ✅ ALWAYS USE SHARED UTILITIES
import { formatDegree, formatCoordinates } from '../utils/formatters.js';
import { getPlanetSymbol, PLANET_ORDER } from '../utils/symbols.js';

const program = new Command();

program
  .name('halcon-[command]')
  .description('[Command description]')
  .version('0.1.0')
  .argument('[profile]', 'Profile name', '')
  .option('--date <date>', 'Date (YYYY-MM-DD)', '')
  .option('--json', 'Output as JSON')
  .action(async (profileArg, options) => {
    try {
      // 1. Input parsing and validation
      // 2. Load profile or parse manual input
      // 3. Perform calculations
      // 4. Display results

    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse();
}

export { program };
```

---

## Shared Utilities Pattern

### Two-Tier Utility System

HALCON uses a two-tier utility system to balance comprehensiveness with simplicity:

#### Tier 1: Comprehensive Utilities (`lib/display/`)

**Purpose**: Advanced formatting with full options
**Location**: `src/lib/display/formatters.ts`
**Features**: Type-safe interfaces, multiple formats, extensive options

```typescript
import { formatDegree, formatDateTime } from '../lib/display/formatters.js';

// Advanced formatting
formatDegree(45.5, { signFormat: 'symbol', includeMinutes: true });
// "15°30' ♉"

formatDateTime(date, { style: 'long', includeTime: true, timezone: 'America/New_York' });
// "November 19, 2025, 9:30 AM"
```

#### Tier 2: Lightweight Utilities (`utils/`)

**Purpose**: Simple, fast formatters for common use cases
**Location**: `src/utils/formatters.ts` and `src/utils/symbols.ts`
**Features**: Minimal dependencies, optimized for performance

```typescript
import { formatDegree, formatCoordinates } from '../utils/formatters.js';
import { getPlanetSymbol, PLANET_ORDER } from '../utils/symbols.js';

// Simple formatting
formatDegree(45.5);  // "15.50° Taurus"
formatDegree(45.5, true);  // "15.50° Tau" (abbreviated)

formatCoordinates(40.71, -74.01);  // "40.71°N, 74.01°W"

getPlanetSymbol('Sun');  // '☉'
```

### When to Use Which

| Use Case | Use `lib/display/` | Use `utils/` |
|----------|-------------------|--------------|
| Need advanced options | ✅ Yes | No |
| Need symbol format signs | ✅ Yes | No |
| Need DMS format | ✅ Yes | No |
| Need timezone support | ✅ Yes | No |
| Simple, basic formatting | No | ✅ Yes |
| Performance critical | No | ✅ Yes |
| Minimal imports | No | ✅ Yes |

---

## Directory Structure

### Complete Project Structure

```
HALCON/
├── .claude/                    # Claude Code configuration
│   ├── commands/               # Custom slash commands
│   └── skills/                 # Skills (if any)
│
├── commands/                   # Executable bash wrappers
│   ├── halcon                  # Main entry point
│   ├── chart                   # Chart command wrapper
│   ├── houses                  # Houses command wrapper
│   ├── transits                # Transits command wrapper
│   └── progressions            # Progressions command wrapper
│
├── docs/                       # Documentation
│   ├── progress.md             # Development progress tracking
│   ├── REFACTORING-COMPLETE.md # CLI refactoring documentation
│   ├── architecture-review-cli-commands.md
│   └── refactoring-roadmap-cli.md
│
├── scripts/                    # Utility scripts
│   ├── migrate_timezones.mjs   # Profile migration
│   └── validate_houses.mjs     # House validation
│
├── src/                        # Source code
│   ├── commands/               # CLI command implementations
│   │   ├── chart.ts            # Natal chart command
│   │   ├── houses.ts           # House calculations
│   │   ├── transits.ts         # Transit calculations
│   │   └── progressions.ts     # Secondary progressions
│   │
│   ├── lib/                    # Core libraries
│   │   ├── display/            # Display utilities
│   │   │   ├── formatters.ts   # Comprehensive formatters
│   │   │   ├── README.md       # Display utilities guide
│   │   │   └── __tests__/      # Tests
│   │   │
│   │   ├── swisseph/           # Swiss Ephemeris wrapper
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── profiles/           # Profile management
│   │   │   └── index.ts
│   │   │
│   │   ├── transits/           # Transit calculations
│   │   │   └── index.ts
│   │   │
│   │   ├── moon-phase/         # Moon phase calculations
│   │   │   └── index.ts
│   │   │
│   │   └── progressions/       # Progression calculations
│   │       └── index.ts
│   │
│   ├── utils/                  # Utility functions
│   │   ├── formatters.ts       # Lightweight formatters
│   │   ├── symbols.ts          # Planet symbols
│   │   ├── display/            # Display utilities (empty currently)
│   │   └── README.md           # Utils guide
│   │
│   ├── components/             # React components (web UI)
│   │   ├── atoms/              # Atomic components
│   │   ├── molecules/          # Molecular components
│   │   └── organisms/          # Organism components
│   │
│   ├── stores/                 # Zustand state management
│   │   └── useAppStore.ts
│   │
│   ├── hooks/                  # React hooks
│   │   └── useSwissEph.ts
│   │
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts
│   │
│   └── __tests__/              # Test files
│       ├── unit/               # Unit tests
│       ├── integration/        # Integration tests
│       └── e2e/                # End-to-end tests
│
├── ARCHITECTURE.md             # This file
├── CLAUDE.md                   # Claude Code configuration
├── package.json                # Project configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── vitest.config.ts            # Vitest configuration
```

---

## Design Principles

### 1. DRY (Don't Repeat Yourself)

**Principle**: Every piece of knowledge should have a single, unambiguous, authoritative representation.

**Application in HALCON:**
- Shared utilities eliminate duplicate functions
- Single source of truth for formatters and symbols
- Profile loading logic will be centralized (Phase 3)

**Example:**
```typescript
// ❌ BAD - Duplication
// In chart.ts:
function formatDegree(degrees: number): string { /* ... */ }

// In houses.ts:
function formatDegree(degrees: number): string { /* ... */ }

// ✅ GOOD - Shared utility
// In utils/formatters.ts:
export function formatDegree(degrees: number): string { /* ... */ }

// In chart.ts:
import { formatDegree } from '../utils/formatters.js';
```

### 2. Separation of Concerns

**Principle**: Different concerns should be handled by different modules.

**Application in HALCON:**
- **Commands**: Business logic, user input/output
- **Libraries**: Core calculations
- **Utilities**: Formatting and display
- **Types**: Type definitions

**Example:**
```typescript
// ✅ GOOD - Separated concerns
// commands/transits.ts - User interaction
const transits = await calculateTransits(date, location);
displayTransits(transits);

// lib/transits/index.ts - Calculation logic
export function calculateTransits(date: Date, location: GeoCoordinates) { /* ... */ }

// utils/formatters.ts - Display formatting
export function formatDegree(degrees: number) { /* ... */ }
```

### 3. Type Safety

**Principle**: Use TypeScript's type system to catch errors at compile time.

**Application in HALCON:**
- Strict TypeScript mode enabled
- Interfaces for all data structures
- Type-safe options objects
- No `any` types without justification

**Example:**
```typescript
// ✅ GOOD - Type-safe interface
interface DegreeFormatOptions {
  signFormat?: 'full' | 'abbreviated' | 'symbol';
  precision?: number;
  includeMinutes?: boolean;
}

function formatDegree(degrees: number, options?: DegreeFormatOptions): string

// Type error caught at compile time
formatDegree(45.5, { signFormat: 'invalid' });  // ❌ Error!
```

### 4. Testability

**Principle**: Code should be easy to test in isolation.

**Application in HALCON:**
- Pure functions whenever possible
- Dependency injection for external services
- Mocking external dependencies
- TDD methodology (write tests first)

**Example:**
```typescript
// ✅ GOOD - Pure, testable function
export function formatDegree(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360;
  // ... pure calculation
  return result;
}

// Easy to test
expect(formatDegree(45.5)).toBe('15.50° Taurus');
```

### 5. Progressive Enhancement

**Principle**: Build in layers, with each layer adding functionality.

**Application in HALCON:**
- Phase 1: Shared utilities (Complete)
- Phase 2: Refactor commands (Planned)
- Phase 3: Advanced refactoring (Future)

---

## Best Practices

### Importing Utilities

**Always use shared utilities instead of duplicating code:**

```typescript
// ✅ GOOD - Import from shared utilities
import { formatDegree, formatCoordinates } from '../utils/formatters.js';
import { getPlanetSymbol, PLANET_ORDER } from '../utils/symbols.js';

// ❌ BAD - Duplicate function
function formatDegree(degrees: number): string { /* ... */ }
```

### Error Handling

**Provide clear, helpful error messages:**

```typescript
// ✅ GOOD - Clear error with guidance
if (!profile) {
  console.error(chalk.red(`❌ Profile "${profileName}" not found`));
  console.log(chalk.yellow('Available profiles:'));
  profiles.forEach(p => {
    console.log(chalk.cyan(`  ${p.name} - ${p.location}`));
  });
  process.exit(1);
}

// ❌ BAD - Vague error
throw new Error('Profile not found');
```

### Consistent Formatting

**Use the same formatter consistently within a command:**

```typescript
// ✅ GOOD - Consistent formatting
houses.cusps.forEach(cusp => {
  console.log(formatDegree(cusp, { signFormat: 'abbreviated' }));
});

// ❌ BAD - Inconsistent
houses.cusps.forEach((cusp, i) => {
  const format = i % 2 === 0 ? 'full' : 'abbreviated';
  console.log(formatDegree(cusp, { signFormat: format }));
});
```

### TypeScript Types

**Use proper types, avoid `any`:**

```typescript
// ✅ GOOD - Proper types
interface ChartData {
  timestamp: Date;
  location: GeoCoordinates;
  bodies: Record<string, CelestialBodyPosition>;
}

function displayChart(chart: ChartData): void { /* ... */ }

// ❌ BAD - Using any
function displayChart(chart: any): void { /* ... */ }
```

---

## Adding New Commands

### Step-by-Step Guide

#### 1. Create Command File

**Location**: `src/commands/[command-name].ts`

```typescript
#!/usr/bin/env node
/**
 * HALCON [Command Name] Command
 * [Brief description]
 *
 * @module commands/[command-name]
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { DateTime } from 'luxon';

// Import shared utilities
import { formatDegree, formatCoordinates } from '../utils/formatters.js';
import { getPlanetSymbol, PLANET_ORDER } from '../utils/symbols.js';

// Import core libraries
import { getProfileManager } from '../lib/profiles/index.js';

const program = new Command();

program
  .name('halcon-[command]')
  .description('[Description]')
  .version('0.1.0')
  .argument('[profile]', 'Profile name', '')
  .option('--json', 'Output as JSON')
  .action(async (profileArg, options) => {
    try {
      // Implementation
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse();
}

export { program };
```

#### 2. Create Bash Wrapper

**Location**: `commands/[command-name]`

```bash
#!/bin/bash
npx tsx src/commands/[command-name].ts "$@"
```

#### 3. Make Executable

```bash
chmod +x commands/[command-name]
```

#### 4. Add to package.json (Optional)

```json
{
  "bin": {
    "halcon-[command]": "./commands/[command-name]"
  }
}
```

#### 5. Write Tests First (TDD)

**Location**: `src/__tests__/unit/[command-name].test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { someFunction } from '../../lib/[library]/index.js';

describe('[Command Name]', () => {
  it('should do something', () => {
    const result = someFunction(input);
    expect(result).toBe(expected);
  });
});
```

#### 6. Implement Core Logic

If needed, create library in `src/lib/[library-name]/index.ts`.

#### 7. Test Manually

```bash
npx tsx src/commands/[command-name].ts --help
npx tsx src/commands/[command-name].ts [args]
```

### Example: Adding "Aspects" Command

```typescript
#!/usr/bin/env node
/**
 * HALCON Aspects Command
 * Calculate and display aspects between planets
 *
 * @module commands/aspects
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { getProfileManager } from '../lib/profiles/index.js';
import { calculateAspects } from '../lib/aspects/index.js';
import { formatDegree } from '../utils/formatters.js';
import { getPlanetSymbol } from '../utils/symbols.js';

const program = new Command();

program
  .name('halcon-aspects')
  .description('Calculate planetary aspects')
  .version('0.1.0')
  .argument('[profile]', 'Profile name', '')
  .option('--orb <degrees>', 'Maximum orb', '8')
  .option('--json', 'Output as JSON')
  .action(async (profileArg, options) => {
    try {
      // Load profile
      const profileManager = getProfileManager();
      const profile = profileManager.getProfile(profileArg);

      // Calculate aspects
      const aspects = await calculateAspects(profile, {
        maxOrb: parseFloat(options.orb)
      });

      // Display
      if (options.json) {
        console.log(JSON.stringify(aspects, null, 2));
      } else {
        displayAspects(aspects);
      }
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

function displayAspects(aspects: any) {
  console.log(chalk.bold.cyan('═'.repeat(70)));
  console.log(chalk.bold.white('                    ASPECTS'));
  console.log(chalk.bold.cyan('═'.repeat(70)));

  aspects.forEach((aspect: any) => {
    const planet1 = getPlanetSymbol(aspect.planet1);
    const planet2 = getPlanetSymbol(aspect.planet2);
    const angle = formatDegree(aspect.angle);

    console.log(chalk.white(`${planet1} ${aspect.type} ${planet2}: ${angle} (orb: ${aspect.orb.toFixed(2)}°)`));
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse();
}

export { program };
```

---

## Testing Strategy

### Test-Driven Development (TDD)

**Required Process**:
1. **RED**: Write failing tests first
2. **GREEN**: Write minimal code to pass tests
3. **REFACTOR**: Improve code while keeping tests green

### Test Coverage Goals

| Module | Target Coverage | Status |
|--------|----------------|--------|
| Core libraries | >90% | Varies |
| Commands | >80% | Varies |
| Utilities | >90% | Partial |
| Components | >80% | Partial |

### Test Types

#### 1. Unit Tests

**Purpose**: Test individual functions in isolation
**Location**: `src/__tests__/unit/`

```typescript
describe('formatDegree', () => {
  it('should format degrees with full sign names', () => {
    expect(formatDegree(45.5)).toBe('15.50° Taurus');
  });

  it('should handle 360° wraparound', () => {
    expect(formatDegree(360)).toBe('0.00° Aries');
  });
});
```

#### 2. Integration Tests

**Purpose**: Test interaction between modules
**Location**: `src/__tests__/integration/`

```typescript
describe('Transits Integration', () => {
  it('should calculate transits with profile', async () => {
    const profile = profileManager.getProfile('test');
    const transits = await calculateTransits(new Date(), profile.location);

    expect(transits.bodies.sun).toBeDefined();
    expect(transits.moonPhase).toBeDefined();
  });
});
```

#### 3. End-to-End Tests

**Purpose**: Test full command execution
**Location**: `src/__tests__/e2e/`

```typescript
describe('Chart Command E2E', () => {
  it('should generate chart for profile', async () => {
    const result = await exec('npx tsx src/commands/chart.ts testprofile');
    expect(result.stdout).toContain('NATAL CHART');
    expect(result.stdout).toContain('Planetary Positions');
  });
});
```

---

## Future Architecture

### Phase 2: Complete Command Refactoring (Planned)

**Goal**: Refactor remaining commands to use shared utilities

**Changes**:
- Refactor `chart.ts`, `houses.ts`, `progressions.ts`
- Remove all duplicate utility functions
- Add comprehensive test coverage

**Expected Benefits**:
- 100% duplication elimination
- 8% reduction in command code
- Consistent output across all commands

### Phase 3: Advanced Refactoring (Future)

**Goal**: Extract middleware and renderers

#### Profile Loading Middleware

**Location**: `src/lib/middleware/profile-loader.ts`

```typescript
export interface ProfileLoadOptions {
  dateArg?: string;
  timeArg?: string;
  latitude?: string;
  longitude?: string;
  allowManualInput?: boolean;
}

export interface ProfileLoadResult {
  dateTime: Date;
  location: GeoCoordinates;
  profileName: string;
}

export async function loadProfileOrInput(
  options: ProfileLoadOptions
): Promise<ProfileLoadResult> {
  // Centralized profile loading logic
  // ~200 lines of duplicate code eliminated
}
```

#### Display Renderers

**Location**: `src/lib/display/renderers/`

```typescript
// chart-renderer.ts
export function renderChart(chart: ChartData, options: RenderOptions): void {
  // Centralized chart rendering
  // Separates display logic from business logic
}

// houses-renderer.ts
export function renderHouses(houses: HouseCusps, options: RenderOptions): void {
  // Centralized house rendering
}
```

#### Error Handler Middleware

**Location**: `src/lib/middleware/error-handler.ts`

```typescript
export class ValidationError extends Error {
  constructor(
    message: string,
    public suggestions: string[]
  ) {
    super(message);
  }
}

export function handleCommandError(error: unknown): never {
  // Standardized error handling
  // Consistent error messages
  // Helpful suggestions
}
```

### Expected Final Architecture (Phase 3 Complete)

```
src/
├── commands/                   # Thin orchestration layer
│   ├── chart.ts               # ~80 lines (69% reduction)
│   ├── houses.ts              # ~80 lines (73% reduction)
│   ├── transits.ts            # ~70 lines (71% reduction)
│   └── progressions.ts        # ~100 lines (75% reduction)
│
├── lib/
│   ├── display/
│   │   ├── formatters.ts      # Shared formatters
│   │   ├── symbols.ts         # Shared symbols
│   │   └── renderers/         # Display renderers
│   │       ├── chart-renderer.ts
│   │       ├── houses-renderer.ts
│   │       ├── transits-renderer.ts
│   │       └── progressions-renderer.ts
│   │
│   └── middleware/
│       ├── profile-loader.ts  # Shared profile loading
│       └── error-handler.ts   # Standardized errors
```

**Expected Improvements**:
- 73% reduction in command code
- 100% duplication elimination
- Perfect separation of concerns
- Easy to add new commands
- Consistent user experience

---

## Conclusion

The HALCON architecture is designed for maintainability, testability, and extensibility. By following the shared utilities pattern and adhering to established design principles, the codebase remains clean, consistent, and easy to extend.

**Current State** (Phase 1 Complete):
- ✅ Shared utilities established
- ✅ Pattern proven with transits command
- ✅ Documentation comprehensive
- 📋 Phase 2 and Phase 3 planned

**Next Steps**:
1. Complete Phase 2: Refactor remaining commands
2. Add comprehensive test coverage
3. Plan Phase 3: Extract middleware and renderers

---

**Document Version**: 1.0
**Last Updated**: 2025-11-19
**Status**: Active Development
**Related Documents**:
- [CLI Refactoring Documentation](./docs/REFACTORING-COMPLETE.md)
- [Progress Tracking](./docs/progress.md)
- [Architecture Review](./docs/architecture-review-cli-commands.md)
- [Refactoring Roadmap](./docs/refactoring-roadmap-cli.md)
