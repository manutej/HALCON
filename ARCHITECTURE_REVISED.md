# HALCON - Revised Modular Architecture
## Ultra-Efficient Implementation Plan with Orchestrator Design

**Version:** 3.0 (Revised for Maximum Efficiency)  
**Date:** 2025-10-06  
**Paradigm:** Modular, Layer-Based, DRY (Don't Repeat Yourself)

---

## 🧠 Architectural Philosophy

**Problem with Original Plan:**
- Treated features as silos (separate branches, separate implementations)
- Redundant code across features (aspects calculated multiple times)
- Multilingual as "feature" instead of infrastructure
- Ascendant treated separately from House Systems (they're the same calculation!)
- Chiron/Lilith as "additions" instead of core celestial bodies

**New Approach:**
- **Layered Architecture**: Foundation → Modules → Interfaces
- **Shared Core**: One ephemeris wrapper, one aspect calculator, one i18n system
- **Composable Modules**: Each feature builds on shared foundation
- **Test Once, Use Everywhere**: DRY testing strategy

---

## 🏗️ Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERFACE LAYER                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   CLI    │  │   MCP    │  │  Output  │  │   API    │  │
│  │ Commands │  │ Servers  │  │ Formatters│  │ Endpoints│  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓↑
┌─────────────────────────────────────────────────────────────┐
│                   CALCULATION MODULES                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Houses  │  │ Synastry │  │ AstroMap │  │  Solar   │  │
│  │  + ASC   │  │          │  │          │  │ Returns  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓↑
┌─────────────────────────────────────────────────────────────┐
│                    FOUNDATION LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Ephemeris  │  │   Aspects    │  │     i18n     │     │
│  │   Wrapper    │  │  Calculator  │  │  (EN/ES/FR)  │     │
│  │ (Swisseph)   │  │              │  │              │     │
│  │              │  │              │  │              │     │
│  │ • Planets    │  │ • Conjunction│  │ • Planets    │     │
│  │ • Chiron     │  │ • Trine      │  │ • Signs      │     │
│  │ • Lilith     │  │ • Square     │  │ • Houses     │     │
│  │ • Asteroids  │  │ • Sextile    │  │ • Commands   │     │
│  │ • Houses/ASC │  │ • Opposition │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Core Foundation Components (Build Once, Use Everywhere)

### 1. Swiss Ephemeris Wrapper (Most Critical)

**File:** `src/lib/swisseph/index.ts`

**Responsibilities:**
- Calculate positions for ALL celestial bodies (in one call)
- Planets: ☉ ☽ ☿ ♀ ♂ ♃ ♄ ♅ ♆ ♇
- Points: ⚷ Chiron, ⚸ Black Moon Lilith (True), ⚸ Lilith (Mean)
- Asteroids: Ceres, Pallas, Juno, Vesta
- Angles: ASC (Ascendant), MC (Midheaven), DSC (Descendant), IC (Imum Coeli)
- Houses: All 12 house cusps (any system)
- Nodes: True Node, Mean Node, South Node

**Key Design:**
```typescript
// ONE unified interface for everything
interface ChartData {
  timestamp: Date;
  location: GeoCoordinates;
  
  // All celestial bodies in one object
  bodies: {
    sun: CelestialBody;
    moon: CelestialBody;
    mercury: CelestialBody;
    venus: CelestialBody;
    mars: CelestialBody;
    jupiter: CelestialBody;
    saturn: CelestialBody;
    uranus: CelestialBody;
    neptune: CelestialBody;
    pluto: CelestialBody;
    chiron: CelestialBody;      // ⚷
    lilith: CelestialBody;      // ⚸ (True Black Moon)
    meanLilith: CelestialBody;  // Mean Lilith
    northNode: CelestialBody;
    southNode: CelestialBody;
  };
  
  // Angles (calculated with houses)
  angles: {
    ascendant: number;    // ASC - 1st house cusp
    midheaven: number;    // MC  - 10th house cusp
    descendant: number;   // DSC - 7th house cusp
    imumCoeli: number;    // IC  - 4th house cusp
  };
  
  // Houses (all systems available)
  houses: {
    system: HouseSystem;
    cusps: number[];  // 12 cusps
  };
  
  // Aspects (pre-calculated)
  aspects: Aspect[];
}

// Single calculation function
async function calculateChart(
  date: Date,
  time: string,
  location: GeoCoordinates,
  options: {
    houseSystem?: HouseSystem;
    includeChiron?: boolean;    // default: true
    includeLilith?: boolean;    // default: true
    includeAsteroids?: boolean; // default: false
    calculateAspects?: boolean; // default: true
    aspectOrb?: number;         // default: 8
  }
): Promise<ChartData>
```

**Why This is Efficient:**
- ONE Swiss Ephemeris call gets ALL data (planets, Chiron, Lilith, houses, ASC)
- No separate "Ascendant feature" - it's automatic with houses
- No separate "Chiron feature" - it's a standard celestial body
- Aspects calculated once, reused everywhere
- Multilingual labels applied at output, not calculation

---

### 2. Aspect Calculator (Shared by ALL Features)

**File:** `src/lib/aspects/index.ts`

**Responsibilities:**
- Calculate aspects between ANY two celestial bodies
- Includes Chiron and Lilith automatically
- Works for natal, synastry, transits, progressions

**Key Design:**
```typescript
interface Aspect {
  body1: string;        // "sun", "chiron", "lilith", etc.
  body2: string;
  type: AspectType;     // conjunction, trine, square, etc.
  angle: number;        // exact angle
  orb: number;          // difference from exact
  applying: boolean;    // is aspect getting tighter?
}

// Works with ANY chart data
function calculateAspects(
  chart: ChartData | CelestialBody[],
  orbLimit: number = 8,
  includeChiron: boolean = true,
  includeLilith: boolean = true
): Aspect[]

// For synastry (between two charts)
function calculateInterAspects(
  chart1: ChartData,
  chart2: ChartData,
  orbLimit: number = 8
): Aspect[]
```

**Why This is Efficient:**
- ONE aspect calculator used by: natal charts, synastry, transits, progressions
- Chiron and Lilith included by default (no separate code)
- Configurable orbs per aspect type
- Applying/separating detection built-in

---

### 3. i18n Infrastructure (Multilingual from Day 1)

**Files:**
```
src/i18n/
├── index.ts                 # i18n config
├── detector.ts              # Auto-detect language
├── locales/
│   ├── en.json
│   ├── es.json
│   └── fr.json
```

**Key Design:**
```typescript
// Celestial body names
const BODIES = {
  en: { sun: "Sun", chiron: "Chiron", lilith: "Lilith" },
  es: { sun: "Sol", chiron: "Quirón", lilith: "Lilith" },
  fr: { sun: "Soleil", chiron: "Chiron", lilith: "Lilith" }
};

// Automatic translation wrapper
function t(key: string, lang?: Language): string {
  const userLang = lang || detectLanguage() || 'en';
  return i18n.t(key, { lng: userLang });
}

// Used everywhere
console.log(t('bodies.sun'));      // Auto-detects: "Sun" / "Sol" / "Soleil"
console.log(t('bodies.chiron'));   // "Chiron" / "Quirón" / "Chiron"
console.log(t('bodies.lilith'));   // "Lilith" / "Lilith" / "Lilith"
```

**Why This is Efficient:**
- Translation done once at output layer
- Calculations use English keys internally
- One translation file, multiple languages
- Auto-detection reduces user friction

---

## 🔧 Calculation Modules (Build on Foundation)

### Module 1: Houses + Ascendant (ONE Feature)

**Why Combined:**
- Ascendant IS the 1st house cusp
- House calculation REQUIRES calculating ASC/MC/IC/DSC
- Swiss Ephemeris calculates them together

**Implementation:**
```typescript
// Houses are calculated WITH Ascendant automatically
const chart = await calculateChart(date, time, location, {
  houseSystem: 'placidus'
});

// Access angles
console.log(chart.angles.ascendant);  // ← Ascendant
console.log(chart.angles.midheaven);  // ← MC

// Access houses
console.log(chart.houses.cusps);      // ← All 12 cusps
console.log(chart.houses.cusps[0]);   // ← Same as Ascendant
```

**CLI Commands:**
```bash
# Get houses (includes ASC automatically)
halcon houses manu

# Output shows:
# ASC: 19.69° Pisces (1st House Cusp)
# MC: 29.12° Scorpio (10th House Cusp)
# House 1: 19.69° Pisces ← Ascendant
# House 2: 12.34° Aries
# ...
```

**MCP Tools:**
- `calculate_houses()` → Returns houses + angles
- `get_ascendant()` → Wrapper for `chart.angles.ascendant`

---

### Module 2: Chiron & Lilith (Core Celestial Bodies)

**Why NOT a Separate Feature:**
- Swiss Ephemeris includes Chiron and Lilith by default
- They're calculated with planets (same API call)
- Aspects with Chiron/Lilith use same aspect calculator

**Implementation:**
```typescript
// Chiron and Lilith are ALWAYS included
const chart = await calculateChart(date, time, location);

// Access just like any planet
console.log(chart.bodies.chiron);      // ⚷ Chiron position
console.log(chart.bodies.lilith);      // ⚸ True Black Moon Lilith
console.log(chart.bodies.meanLilith);  // Mean Lilith

// Aspects include Chiron/Lilith automatically
const aspects = chart.aspects;
// Will include:
// - Sun conjunct Chiron
// - Moon square Lilith
// - Venus trine Chiron
// etc.
```

**CLI Output:**
```bash
halcon chart manu

# Output includes:
☉ Sun         19.69° Pisces
☽ Moon         9.06° Virgo
☿ Mercury     11.96° Pisces
♀ Venus        2.18° Aries
♂ Mars        22.67° Cancer
♃ Jupiter     15.89° Gemini
♄ Saturn      18.45° Pisces
♅ Uranus       1.22° Capricorn
♆ Neptune      2.68° Aquarius
♇ Pluto        1.41° Scorpio
⚷ Chiron       4.52° Cancer      # ← Included automatically
⚸ Lilith      15.23° Taurus      # ← Included automatically

🔮 Aspects (including Chiron & Lilith):
☌ Sun        Conjunction  Chiron     ±2.15°
△ Venus      Trine        Lilith     ±3.50°
□ Moon       Square       Chiron     ±4.30°
```

**Configuration:**
```bash
# Hide Chiron/Lilith if desired
halcon chart manu --no-chiron --no-lilith

# Show only Chiron aspects
halcon aspects --body chiron

# Synastry with Chiron/Lilith
halcon synastry manu alice --include-chiron --include-lilith
```

---

## 🎯 Revised Implementation Order (Most Efficient)

### Phase 1: Foundation (Weeks 1-3)
**Goal:** Build core that ALL features use

**Week 1: Swiss Ephemeris Wrapper**
```
✓ Install swisseph package
✓ Write tests for planetary calculations
✓ Write tests for Chiron calculation
✓ Write tests for Lilith calculation (True + Mean)
✓ Write tests for house calculations (includes ASC/MC/IC/DSC)
✓ Implement wrapper to pass all tests
✓ Result: ONE function calculates everything
```

**Week 2: i18n Infrastructure**
```
✓ Install i18next package
✓ Create translation files (EN/ES/FR)
✓ Translate: planets, signs, houses, commands
✓ Add: Chiron, Lilith translations
✓ Implement language detector
✓ Test multilingual output
```

**Week 3: Aspect Calculator**
```
✓ Write tests for aspect detection
✓ Write tests for Chiron/Lilith aspects
✓ Write tests for orb calculations
✓ Implement aspect calculator
✓ Test with all celestial bodies
```

### Phase 2: Modules (Weeks 4-7)
**Goal:** Build calculation modules using foundation

**Week 4: Houses Module**
```
✓ Houses calculator (uses swisseph wrapper)
✓ CLI command: halcon houses
✓ MCP server: houses-server.ts
✓ Output includes ASC/MC/IC/DSC automatically
✓ Multilingual output (EN/ES/FR)
✓ Tests pass
```

**Week 5: Synastry Module**
```
✓ Synastry calculator (uses aspect calculator)
✓ Includes Chiron/Lilith in synastry
✓ CLI command: halcon synastry
✓ MCP server: synastry-server.ts
✓ Multilingual output
✓ Tests pass
```

**Week 6: Astrocartography Module**
```
✓ Astromap calculator (uses swisseph wrapper)
✓ CLI command: halcon astromap
✓ MCP server: astromap-server.ts
✓ Multilingual output
✓ Tests pass
```

**Week 7: Solar Returns Module**
```
✓ Solar return calculator (uses swisseph wrapper)
✓ CLI command: halcon solar-return
✓ MCP server: solar-return-server.ts
✓ Multilingual output
✓ Tests pass
```

### Phase 3: Integration & Polish (Week 8)
```
✓ Integration tests (all features together)
✓ Documentation (EN/ES/FR)
✓ GitHub Actions CI/CD
✓ Performance optimization
✓ Final testing
```

---

## 📁 Revised File Structure (DRY & Modular)

```
HALCON/
├── src/
│   ├── lib/
│   │   ├── swisseph/
│   │   │   ├── index.ts              # Main wrapper
│   │   │   ├── planets.ts            # Planet calculations
│   │   │   ├── chiron.ts             # Chiron (uses same API)
│   │   │   ├── lilith.ts             # Lilith (True + Mean)
│   │   │   ├── houses.ts             # Houses + ASC/MC/IC/DSC
│   │   │   └── types.ts              # Shared types
│   │   ├── aspects/
│   │   │   ├── index.ts              # Aspect calculator
│   │   │   ├── calculator.ts         # Core logic
│   │   │   └── types.ts              # Aspect types
│   │   └── i18n/
│   │       ├── index.ts              # i18n config
│   │       ├── detector.ts           # Language detection
│   │       └── locales/
│   │           ├── en.json           # English
│   │           ├── es.json           # Español
│   │           └── fr.json           # Français
│   ├── modules/
│   │   ├── houses/
│   │   │   ├── calculator.ts         # Uses swisseph wrapper
│   │   │   └── formatter.ts          # Output formatting
│   │   ├── synastry/
│   │   │   ├── calculator.ts         # Uses aspect calculator
│   │   │   └── formatter.ts
│   │   ├── astromap/
│   │   │   ├── calculator.ts
│   │   │   └── formatter.ts
│   │   └── solar-return/
│   │       ├── calculator.ts
│   │       └── formatter.ts
│   ├── commands/
│   │   ├── houses.ts                 # CLI for houses
│   │   ├── synastry.ts               # CLI for synastry
│   │   ├── astromap.ts               # CLI for astromap
│   │   └── solar-return.ts           # CLI for solar return
│   ├── mcp/
│   │   ├── houses-server.ts          # MCP for houses
│   │   ├── synastry-server.ts        # MCP for synastry
│   │   ├── astromap-server.ts        # MCP for astromap
│   │   └── solar-return-server.ts    # MCP for solar return
│   └── __tests__/
│       ├── unit/
│       │   ├── swisseph.test.ts      # Test foundation
│       │   ├── aspects.test.ts       # Test aspects
│       │   ├── i18n.test.ts          # Test translations
│       │   ├── chiron.test.ts        # Test Chiron
│       │   └── lilith.test.ts        # Test Lilith
│       └── integration/
│           ├── houses.test.ts        # Test full workflow
│           ├── synastry.test.ts      # Test full workflow
│           ├── astromap.test.ts      # Test full workflow
│           └── solar-return.test.ts  # Test full workflow
```

---

## 🧪 Testing Strategy (Test Once, Verify Everywhere)

### Foundation Tests (Most Critical)
```typescript
// swisseph.test.ts
describe('SwissEphemeris Wrapper', () => {
  it('calculates all planets in one call', async () => {
    const chart = await calculateChart(date, time, location);
    expect(chart.bodies.sun).toBeDefined();
    expect(chart.bodies.chiron).toBeDefined();
    expect(chart.bodies.lilith).toBeDefined();
  });
  
  it('calculates houses with Ascendant', async () => {
    const chart = await calculateChart(date, time, location, {
      houseSystem: 'placidus'
    });
    expect(chart.angles.ascendant).toBe(chart.houses.cusps[0]);
  });
  
  it('includes Chiron by default', async () => {
    const chart = await calculateChart(date, time, location);
    expect(chart.bodies.chiron.longitude).toBeGreaterThan(0);
  });
  
  it('includes True and Mean Lilith', async () => {
    const chart = await calculateChart(date, time, location);
    expect(chart.bodies.lilith).toBeDefined();      // True
    expect(chart.bodies.meanLilith).toBeDefined();  // Mean
  });
});

// aspects.test.ts
describe('Aspect Calculator', () => {
  it('calculates aspects including Chiron', async () => {
    const aspects = calculateAspects(chart);
    const chironAspects = aspects.filter(a => 
      a.body1 === 'chiron' || a.body2 === 'chiron'
    );
    expect(chironAspects.length).toBeGreaterThan(0);
  });
  
  it('calculates aspects including Lilith', async () => {
    const aspects = calculateAspects(chart);
    const lilithAspects = aspects.filter(a => 
      a.body1 === 'lilith' || a.body2 === 'lilith'
    );
    expect(lilithAspects.length).toBeGreaterThan(0);
  });
});
```

**Result:** If foundation tests pass, ALL features work!

---

## 🚀 Revised Timeline (8 Weeks Total)

| Week | Focus | Deliverables |
|------|-------|-------------|
| 1 | Swiss Ephemeris Wrapper | Planets, Chiron, Lilith, Houses, ASC - ALL in one |
| 2 | i18n Infrastructure | EN/ES/FR translations complete |
| 3 | Aspect Calculator | Works with all bodies including Chiron/Lilith |
| 4 | Houses Module | CLI + MCP + multilingual + ASC included |
| 5 | Synastry Module | CLI + MCP + multilingual + Chiron/Lilith |
| 6 | Astrocartography Module | CLI + MCP + multilingual |
| 7 | Solar Returns Module | CLI + MCP + multilingual |
| 8 | Integration & Polish | Testing, docs, CI/CD, performance |

**Total:** 8 weeks (vs. 16 weeks in original plan) = **50% faster!**

---

## ✅ Benefits of Revised Architecture

1. **DRY (Don't Repeat Yourself)**
   - One ephemeris wrapper (not 4)
   - One aspect calculator (not 4)
   - One i18n system (not 4)

2. **Modular & Composable**
   - Modules are independent but share foundation
   - Easy to add new features (just use foundation)

3. **Chiron & Lilith Built-In**
   - No "separate feature" - they're standard celestial bodies
   - Aspects automatically include them
   - No extra code needed

4. **Ascendant Included**
   - Calculated automatically with houses
   - No redundant calculations
   - Always accurate

5. **Multilingual from Day 1**
   - Not an afterthought
   - Translation at output layer only
   - Calculations stay pure

6. **Faster Development**
   - 8 weeks instead of 16
   - Less code to maintain
   - Fewer tests (but better coverage)

7. **Easier to Test**
   - Test foundation once → features work
   - Integration tests verify combinations
   - High confidence, low effort

---

## 🎯 Next Steps (Orchestrator Workflow)

1. **Approve revised architecture**
2. **Start with Foundation Layer** (most critical)
3. **Test foundation thoroughly** (everything depends on it)
4. **Build modules incrementally** (each uses foundation)
5. **Integrate as we go** (continuous validation)

**Ready to implement this ultra-efficient architecture! 🚀**
