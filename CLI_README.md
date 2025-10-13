# HALCON CLI Commands

Command-line interface for HALCON astrological calculations using Swiss Ephemeris.

## Installation

```bash
npm install
```

## Available Commands

### 1. Chart Command (`halcon-chart`)

Calculate and display complete natal charts with planetary positions, houses, and angles.

#### Usage

```bash
npm run chart -- [date] [time] [options]
```

#### Arguments

- `[date]` - Birth date in YYYY-MM-DD format (default: 'now')
- `[time]` - Birth time in HH:MM:SS format (default: '12:00:00')

#### Options

- `--latitude <degrees>` - Latitude in degrees (default: 0)
- `--longitude <degrees>` - Longitude in degrees (default: 0)
- `--location <name>` - Location name for display
- `--house-system <system>` - House system to use (default: 'placidus')
- `--no-chiron` - Exclude Chiron from calculations
- `--no-lilith` - Exclude Lilith from calculations
- `--no-nodes` - Exclude lunar nodes from calculations
- `--json` - Output as JSON instead of formatted text

#### Examples

**Basic chart calculation:**
```bash
npm run chart -- 1990-03-10 12:55:00 --latitude 15.83 --longitude 78.04 --location "Kurnool, India"
```

**Chart for current time:**
```bash
npm run chart -- now --latitude 40.7128 --longitude -74.0060 --location "New York"
```

**JSON output:**
```bash
npm run chart -- 1990-03-10 12:55:00 --latitude 15.83 --longitude 78.04 --json
```

**Different house system:**
```bash
npm run chart -- 1990-03-10 12:55:00 --latitude 15.83 --longitude 78.04 --house-system koch
```

#### Output

The chart command displays:
- Birth date, time, and location
- Chart angles (Ascendant, Midheaven, Descendant, IC)
- Planetary positions with:
  - Longitude
  - Zodiac sign
  - Degree within sign
  - Retrograde status
- House cusps (12 houses)

### 2. Houses Command (`halcon-houses`)

Calculate and display house cusps and angles, with support for comparing multiple house systems.

#### Usage

```bash
npm run houses -- [date] [time] [options]
```

#### Arguments

- `[date]` - Date in YYYY-MM-DD format (default: 'now')
- `[time]` - Time in HH:MM:SS format (default: '12:00:00')

#### Options

- `--latitude <degrees>` - Latitude in degrees (required for calculations)
- `--longitude <degrees>` - Longitude in degrees (required for calculations)
- `--location <name>` - Location name for display
- `--house-system <system>` - House system to use (default: 'placidus')
- `--list-systems` - List all available house systems
- `--compare` - Compare multiple house systems side-by-side
- `--json` - Output as JSON instead of formatted text

#### Examples

**List available house systems:**
```bash
npm run houses -- --list-systems
```

**Calculate houses:**
```bash
npm run houses -- 1990-03-10 12:55:00 --latitude 15.83 --longitude 78.04 --location "Kurnool, India"
```

**Compare house systems:**
```bash
npm run houses -- 1990-03-10 12:55:00 --latitude 15.83 --longitude 78.04 --compare
```

**Different house system:**
```bash
npm run houses -- 1990-03-10 12:55:00 --latitude 15.83 --longitude 78.04 --house-system whole-sign
```

#### Supported House Systems

- **placidus** - Placidus (most common, unequal houses)
- **koch** - Koch (birthplace system)
- **equal** - Equal (30° each from Ascendant)
- **whole-sign** - Whole Sign (one sign per house)
- **porphyrius** - Porphyrius (space division)
- **regiomontanus** - Regiomontanus (rational method)
- **campanus** - Campanus (prime vertical)
- **meridian** - Meridian (axial rotation)
- **morinus** - Morinus (equator system)
- **alcabitus** - Alcabitus (ancient system)

## Architecture

The CLI commands are built on top of the Swiss Ephemeris wrapper library:

```
src/
├── commands/
│   ├── chart.ts         # Chart calculation CLI
│   └── houses.ts        # House calculation CLI
└── lib/
    └── swisseph/
        ├── index.ts     # Swiss Ephemeris wrapper
        └── types.ts     # TypeScript type definitions
```

### Swiss Ephemeris Wrapper

The commands use the modular Swiss Ephemeris wrapper (`src/lib/swisseph/index.ts`) which provides:

- Type-safe TypeScript interface
- Comprehensive planetary calculations (Sun through Pluto, plus Chiron, Lilith, Nodes)
- Multiple house system support
- Chart angle calculations
- Input validation
- Error handling

### Programmatic Usage

You can also use the Swiss Ephemeris wrapper directly in your code:

```typescript
import { calculateChart } from './src/lib/swisseph/index.js';

const chart = await calculateChart(
  new Date('1990-03-10T12:55:00Z'),
  {
    latitude: 15.83,
    longitude: 78.04,
    name: 'Kurnool, India'
  },
  {
    houseSystem: 'placidus',
    includeChiron: true,
    includeLilith: true,
    includeNodes: true
  }
);

console.log(chart.bodies.sun);
console.log(chart.angles);
console.log(chart.houses);
```

## Data Sources

- Ephemeris data: Swiss Ephemeris library (`node_modules/swisseph/ephe`)
- Planetary calculations: NASA JPL DE406 ephemeris
- Precision: Sub-arcsecond accuracy

## Time Zones

All times are treated as UTC. If you have local time, convert to UTC before using:

```bash
# For IST (UTC+5:30), subtract 5:30 from local time
# Local: 12:55 PM IST = 07:25 AM UTC
npm run chart -- 1990-03-10 07:25:00 --latitude 15.83 --longitude 78.04
```

## Output Formats

### Text Format (Default)

Beautiful formatted output with:
- Unicode symbols for planets and angles
- Color-coded sections (angles, planets, houses)
- Tabular layout for easy reading

### JSON Format (`--json`)

Machine-readable JSON output with full precision:

```json
{
  "timestamp": "1990-03-10T12:55:00.000Z",
  "location": {
    "latitude": 15.83,
    "longitude": 78.04
  },
  "bodies": {
    "sun": {
      "name": "Sun",
      "longitude": 349.98255202440964,
      "sign": "Pisces",
      "signDegree": 19.982552024409642,
      "retrograde": false
    },
    ...
  },
  "angles": {
    "ascendant": 28.130506,
    "midheaven": 5.474821,
    ...
  },
  "houses": {
    "system": "placidus",
    "cusps": [28.130506, 28.854392, ...]
  }
}
```

## Development

### Running Tests

```bash
npm run test           # Run all tests
npm run test:watch     # Watch mode
npm run test:verify    # Run once (CI mode)
```

### Type Checking

```bash
npm run typecheck
```

### Building

```bash
npm run build
```

## Troubleshooting

### "Cannot find module 'swisseph'"

Run `npm install` to install dependencies.

### "Ephemeris file not found"

Ensure Swiss Ephemeris data is installed in `node_modules/swisseph/ephe/`.

### Incorrect calculations

- Verify date/time is in UTC
- Check latitude/longitude values (-90 to 90, -180 to 180)
- Ensure date format is YYYY-MM-DD

## Credits

- Swiss Ephemeris library by Astrodienst AG
- HALCON development team

## License

MIT
