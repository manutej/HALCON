# HALCON CLI Testing Guide

## House Calculation Commands

### Available Commands

HALCON provides two CLI implementations for house calculations:

1. **JavaScript CLI** (main project): `./commands/halcon houses`
2. **TypeScript CLI** (microservice): `node dist/cli/houses.js`

Both implementations support the same features with slightly different output formatting.

---

## JavaScript CLI (`./commands/halcon houses`)

### 1. Basic Commands

#### Show Help
```bash
./commands/halcon houses --help
```

#### List Available House Systems
```bash
./commands/halcon houses --list-systems
```
**Output:**
- Placidus (most common, unequal houses)
- Koch (birthplace system)
- Equal (30° each from Ascendant)
- Whole Sign (one sign per house)
- Porphyrius, Regiomontanus, Campanus, Meridian, Morinus, Alcabitus

### 2. Calculate Houses with Profile

#### Basic Calculation (Placidus - default)
```bash
./commands/halcon houses manu
```

**Output:**
```
✓ Loaded profile: manu

🏠 Calculating houses...

══════════════════════════════════════════════════════════════════════
           HOUSE CUSPS - PLACIDUS
══════════════════════════════════════════════════════════════════════

📍 Location:
   Kurnool, India
   15.83°N, 78.04°E
   1990-03-10T12:55:00.000Z

🎯 Angles:
   Ascendant (ASC): 20.05° Vir
   Midheaven (MC):  20.57° Gem
   Descendant (DSC): 20.05° Pis
   Imum Coeli (IC):  20.57° Sag

🏠 House Cusps:
   House  1   20.05° Vir (ASC)
   House  2   19.78° Lib
   [...]
```

#### Different House System
```bash
./commands/halcon houses manu --house-system koch
./commands/halcon houses manu --house-system equal
./commands/halcon houses manu --house-system whole-sign
```

#### Compare Multiple House Systems
```bash
./commands/halcon houses manu --compare
```

**Output:**
```
House 1 (Ascendant):
  placidus       : 20.05° Vir
  koch           : 20.05° Vir
  equal          : 20.05° Vir
  whole-sign     : 0.00° Vir

All Houses:
  House  placidus          koch              equal             whole-sign
  ────────────────────────────────────────────────────────────────────────────────
       1  20.05° Vir        20.05° Vir        20.05° Vir        0.00° Vir
  [...]
```

#### JSON Output
```bash
./commands/halcon houses manu --json
```

**Output:**
```json
{
  "angles": {
    "ascendant": 170.04764,
    "midheaven": 80.56517,
    "descendant": 350.04764,
    "imumCoeli": 260.56517
  },
  "houses": {
    "cusps": [
      170.04764,
      199.77858,
      [...]
    ]
  }
}
```

### 3. Manual Coordinates (Future Enhancement)

Currently profiles are required. For manual coordinates, create a profile first or use the TypeScript CLI.

---

## TypeScript CLI (`node dist/cli/houses.js`)

### 1. Setup

First build the project:
```bash
cd claude-sdk-microservice
npm run build
```

### 2. Commands

#### Basic Calculation
```bash
node dist/cli/houses.js manu
```

**Output:**
```
📋 Using profile: manu - Kurnool, India

🏠 House Cusps - Placidus System
══════════════════════════════════════════════════════════════════════
House  1: Virgo          20.05°
House  2: Libra          19.78°
[...]
```

#### Verbose Mode (with house meanings)
```bash
node dist/cli/houses.js manu -v
# OR
node dist/cli/houses.js manu --verbose
```

**Output:**
```
House  1: Virgo          20.05°  - Self, Identity, Appearance
House  2: Libra          19.78°  - Money, Values, Possessions
House  3: Scorpio        20.43°  - Communication, Siblings, Short Trips
[...]
```

#### Different House Systems
```bash
node dist/cli/houses.js manu --system koch
node dist/cli/houses.js manu --system equal
node dist/cli/houses.js manu -s whole-sign
```

#### Manual Coordinates
```bash
node dist/cli/houses.js \
  --date 1990-03-10 \
  --time 12:55:00 \
  --lat 15.83 \
  --lon 78.04
```

#### JSON Output
```bash
node dist/cli/houses.js manu --json
```

**Output:**
```json
{
  "date": "1990-03-10",
  "time": "12:55:00",
  "location": "Kurnool, India",
  "houseSystem": "Placidus",
  "cusps": [
    {
      "house": 1,
      "sign": "Virgo",
      "degree": 20.05,
      "meaning": "Self, Identity, Appearance"
    },
    [...]
  ],
  "angles": {
    "Ascendant": {...},
    "Midheaven": {...},
    "Descendant": {...},
    "IC": {...}
  }
}
```

---

## Running Tests

### Unit Tests (All House Calculations)

```bash
cd claude-sdk-microservice
npm test -- house-calculator.test.ts
```

**Test Coverage:**
- ✅ 54 tests
- ✅ 6 celebrity birth charts validated
- ✅ All 5 house systems tested
- ✅ Extreme latitudes and edge cases
- ✅ 100% pass rate

**Sample Output:**
```
PASS src/__tests__/unit/house-calculator.test.ts
  HouseCalculator
    Constructor
      ✓ should create instance with default ephemeris path
      ✓ should create instance with custom ephemeris path
    Celebrity Birth Charts - Placidus Validation
      Test Case 1: Albert Einstein
        ✓ should calculate houses accurately for Albert Einstein birth chart
      Test Case 2: Marilyn Monroe
        ✓ should calculate houses accurately for Marilyn Monroe birth chart
    [...]
Test Suites: 1 passed, 1 total
Tests:       54 passed, 54 total
```

### Watch Mode (for development)
```bash
npm test -- house-calculator.test.ts --watch
```

### With Coverage
```bash
npm test -- house-calculator.test.ts --coverage
```

### Specific Test Suite
```bash
# Test only celebrity charts
npm test -- house-calculator.test.ts -t "Celebrity Birth Charts"

# Test only edge cases
npm test -- house-calculator.test.ts -t "Edge Cases"

# Test only house systems
npm test -- house-calculator.test.ts -t "Different House Systems"
```

---

## Validation Scripts

### Automated Validation Against Swiss Ephemeris

```bash
cd /Users/manu/Documents/LUXOR/PROJECTS/HALCON
node scripts/validate_houses.mjs
```

**Output:**
```
🏠 HALCON House Calculator Validation

Testing celebrity charts against swetest...
✓ Einstein chart validated
✓ Monroe chart validated
[...]

Testing saved profiles...
✓ manu profile validated
[...]

All validations passed! ✅
```

### Timezone Bug Demonstration

```bash
node test_timezone_bug_demo.mjs
```

**Shows side-by-side comparison:**
- Buggy implementation (without 'Z')
- Fixed implementation (with 'Z')
- Swiss Ephemeris correct values

---

## Profile Management

### List Available Profiles
```bash
./commands/halcon houses invalid-profile-name
```
**Output shows all available profiles**

### Create New Profile (Future Enhancement)
Currently profiles are managed through the profile system. Check:
```bash
cat ~/.halcon/profiles.json
```

---

## Troubleshooting

### Issue: "Profile not found"
**Solution:** Check available profiles with:
```bash
./commands/halcon houses invalid-name
```

### Issue: "swetest not found"
**Solution:** Ensure Swiss Ephemeris is installed:
```bash
which swetest
# Should output: /Users/manu/bin/swetest
```

### Issue: "Invalid date/time"
**Solution:** Ensure date format is YYYY-MM-DD and time is HH:MM:SS:
```bash
./commands/halcon houses 1990-03-10 12:55:00 --latitude 15.83 --longitude 78.04
```

### Issue: Tests failing
**Solution:** Run build first:
```bash
npm run build
npm test -- house-calculator.test.ts
```

---

## Expected Behavior

### Timezone Handling ✅
- All dates/times are treated as UTC with 'Z' suffix
- No timezone offset errors (bug fixed on 2025-10-18)

### House Systems ✅
- Placidus is default (most popular)
- All 5 systems supported and tested
- Accurate to ±0.1 degrees

### Celebrity Chart Validation ✅
- All 6 celebrity charts pass validation
- Results match expert astrologer data
- Cross-validated with Swiss Ephemeris

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `--help` | Show help |
| `--list-systems` | List house systems |
| `--compare` | Compare multiple systems |
| `--json` | JSON output |
| `-v, --verbose` | Show house meanings |
| `--house-system <name>` | Use specific system |

| House System | Flag |
|--------------|------|
| placidus | P (default) |
| koch | K |
| equal | E |
| whole-sign | W |
| regiomontanus | R |

---

## Next Steps

1. Test with your own profile
2. Compare different house systems
3. Try verbose mode for house meanings
4. Export to JSON for integration
5. Run the validation scripts

For more details, see:
- `docs/PLACIDUS-RESEARCH.md` - Mathematical background
- `docs/swetest-validation.md` - Validation methodology
- `docs/HOUSE_CALCULATION_COMPLETION_SUMMARY.md` - Complete project summary
