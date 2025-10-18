# HALCON Validation Scripts

This directory contains validation and testing scripts for the HALCON astrological platform.

## Available Scripts

### validate_houses.mjs

**Purpose:** Validate house calculations against Swiss Ephemeris swetest tool

**Usage:**
```bash
# Validate celebrity charts (default)
node scripts/validate_houses.mjs

# Validate all saved profiles
node scripts/validate_houses.mjs --all

# Validate specific profile
node scripts/validate_houses.mjs --profile manu

# Show help
node scripts/validate_houses.mjs --help
```

**Features:**
- Tests against verified celebrity birth charts
- Compares HALCON output with Swiss Ephemeris
- Generates swetest commands for manual verification
- Validates saved user profiles
- Formats output in both decimal degrees and zodiac notation

**Celebrity Test Charts:**
- Steve Jobs (1955-02-24, San Francisco)
- Albert Einstein (1879-03-14, Ulm, Germany)
- Marie Curie (1867-11-07, Warsaw, Poland)

**Output Example:**
```
================================================================================
VALIDATING: Steve Jobs
================================================================================
Location: San Francisco, CA, USA
Birth: 1955-02-24 19:15:00 UTC

CALCULATED RESULTS:
Julian Day: 2435163.302083
Ascendant: 307.586394° = 7.5864° Aqu
Midheaven: 207.003429° = 27.0034° Lib

HOUSE CUSPS (Placidus):
  House  1: 307.586394° = 7.5864° Aqu (ASC)
  House  2: 329.135953° = 29.1360° Aqu
  ...

SWETEST VALIDATION COMMAND:
  /Users/manu/bin/swetest -b24.02.1955 -ut19:15:00 \
    -house122.419444,-37.808889,P \
    -geopos122.419444,-37.808889
```

## Documentation

See `/Users/manu/Documents/LUXOR/PROJECTS/HALCON/docs/swetest-validation.md` for:
- Complete validation report
- Bug analysis and fixes
- swetest command reference
- Comparison methodology
- Test results

## Quick Reference

### Swetest Command Format

```bash
swetest -b<day>.<month>.<year> -ut<HH:MM:SS> \
  -house<longitude>,<latitude>,<system> \
  -geopos<longitude>,<latitude>
```

### House System Codes

| Code | System |
|------|--------|
| P | Placidus |
| K | Koch |
| A | Equal |
| W | Whole Sign |
| O | Porphyrius |
| R | Regiomontanus |
| C | Campanus |

See full documentation for complete list.

## Running Validation

### Before Deployment

Always run validation before deploying changes to house calculation code:

```bash
npm run validate:houses  # (add to package.json)
# or
node scripts/validate_houses.mjs
```

### CI/CD Integration

Add to `.github/workflows/test.yml`:

```yaml
- name: Validate House Calculations
  run: node scripts/validate_houses.mjs
```

## Known Issues

See `docs/swetest-validation.md` for details on the timezone parsing bug and recommended fixes.
