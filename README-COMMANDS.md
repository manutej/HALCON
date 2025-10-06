# HALCON Commands - Cosmic Productivity CLI

## 🌟 Overview

HALCON provides a suite of command-line tools for astrological calculations and cosmic timing insights. All commands work together to provide a seamless experience for integrating astrology into your daily workflow.

---

## 📦 Installation

### 1. Add to PATH

```bash
# Already added to ~/.zshrc:
export PATH="/Users/manu/Documents/LUXOR/PROJECTS/HALCON/commands:$PATH"

# Reload shell
source ~/.zshrc
```

### 2. Verify Installation

```bash
halcon --help
```

### 3. Configure Claude API Key (Optional - for Natural Language Interface)

To use the natural language chart parsing feature, you need a Claude API key:

1. **Get your API key** from [Anthropic Console](https://console.anthropic.com/)

2. **Add it to your environment**:
   ```bash
   cd /Users/manu/Documents/LUXOR/PROJECTS/HALCON/claude-sdk-microservice
   echo "CLAUDE_API_KEY=your-api-key-here" >> .env
   ```

3. **Verify it works**:
   ```bash
   halcon chart mar 10 1990, kurnool india, 12:55 PM (manu)
   ```

**Note:** The structured interface (`halcon chart --date ... --time ... --lat ... --lon ...`) works without an API key. Only the natural language parsing requires Claude API access.

---

## 🎯 Available Commands

### **`halcon`** - Main Command Router

Central hub for all HALCON astrological tools.

```bash
halcon <command> [options]
```

**Sub-commands:**
- `transits` - Current planetary positions
- `chart` - Generate natal birth chart
- `progressions` - Secondary progressions
- `aspects` - Current planetary aspects

---

### **`halcon transits`** - Current Planetary Positions

Shows real-time positions of all major planets.

**Usage:**
```bash
halcon transits
halcon transits --date 2025-12-25
```

**Output:**
```
🌟 Current Planetary Transits
─────────────────────────────────────────────────────────────────
☉ Sun          7.40° Libra
☽ Moon        10.96° Capricorn
☿ Mercury     20.09° Libra
♀ Venus       13.22° Virgo
♂ Mars         5.40° Scorpio
♃ Jupiter     22.38° Cancer
♄ Saturn      27.81° Pisces
♅ Uranus       1.22° Gemini
♆ Neptune      2.68° Taurus
♇ Pluto        1.41° Aquarius

🌙 Moon Phase: First Quarter (53%)
─────────────────────────────────────────────────────────────────
```

**Standalone Command:**
```bash
transits  # Works directly too!
```

---

### **`halcon chart`** - Natal Birth Chart

Generate a complete natal chart with planetary positions.

#### **🎯 Natural Language Interface (NEW!)**

Use natural language to generate charts without memorizing flags or looking up coordinates!

**Usage:**
```bash
halcon chart Month Day Year, City Country, Time AM/PM (Name)
```

**Examples:**
```bash
# With name
halcon chart mar 10 1990, kurnool india, 12:55 PM (manu)

# Without name
halcon chart june 21 1985, london uk, 9:15 AM

# With "local time" keyword
halcon chart dec 25 2000, new york usa, 6:30 PM local time
```

**Features:**
- ✨ Automatic geocoding - looks up coordinates for you
- 🌍 Works with any city worldwide
- 🕐 Understands 12-hour (AM/PM) and 24-hour time formats
- 📝 Optional name in parentheses
- 🤖 Powered by Claude AI for intelligent parsing

**Requirements:**
- Set `CLAUDE_API_KEY` in `/Users/manu/Documents/LUXOR/PROJECTS/HALCON/claude-sdk-microservice/.env`
- Get your API key from: https://console.anthropic.com/

---

#### **Traditional Structured Interface**

**Usage:**
```bash
halcon chart --date 1990-01-15 --time 14:30:00 --lat 40.7128 --lon -74.0060
halcon chart -d 1985-06-21 -t 09:15:00 --lat 51.5074 --lon -0.1278 --city "London"
```

**Required Parameters:**
- `--date, -d` - Birth date (YYYY-MM-DD)
- `--time, -t` - Birth time (HH:MM:SS)
- `--lat` - Birth latitude
- `--lon` - Birth longitude

**Optional Parameters:**
- `--name` - Chart name
- `--city` - Birth city
- `--format` - Output format: simple, detailed, json
- `--houses` - House system: placidus, equal, whole-sign

**Example:**
```bash
halcon chart --date 1990-01-15 --time 14:30:00 --lat 40.7128 --lon -74.0060 --city "New York"
```

---

### **`halcon progressions`** - Secondary Progressions

Calculate secondary progressions (1 day = 1 year).

**Usage:**
```bash
halcon progressions --date 1990-01-15 --time 14:30:00 --lat 40.7128 --lon -74.0060
halcon progressions -d 1985-06-21 -t 09:15:00 --lat 51.5074 --lon -0.1278 --age 35
```

**Required Parameters:**
- `--date, -d` - Birth date (YYYY-MM-DD)
- `--time, -t` - Birth time (HH:MM:SS)
- `--lat` - Birth latitude
- `--lon` - Birth longitude

**Optional Parameters:**
- `--progress-to` - Date to progress to (default: **today** ⚡)
- `--age` - Or specify age in years
- `--name` - Person's name (for profile save)
- `--city` - Birth city

**🔄 Dynamic Calculation:**
**Progressions are ALWAYS calculated to the current date** unless you specify `--progress-to`.

**How It Works:**
Secondary progressions use the formula **1 day after birth = 1 year of life**.

**Example:** If you're 35 years old, your progressed chart shows planetary positions **35 days after your birth**.

**Important:**
- Run today → Shows progressions for TODAY
- Run tomorrow → Shows progressions for TOMORROW
- Run next year → Shows progressions for NEXT YEAR

**Real ephemeris data is fetched every time** - no caching!

**Example:**
```bash
halcon progressions --date 1990-01-15 --time 14:30:00 --lat 40.7128 --lon -74.0060 --age 30
```

**Output:**
```
Birth Date: 1990-01-15 14:30:00
Progressed Date: 1990-02-14 14:30:00
Age: 30 years (= 30 days progressed)

📊 Natal Chart (Birth Positions):
─────────────────────────────────────────────────────────────────
[Shows birth positions]

🔮 Progressed Chart (Current Age: 30 years):
─────────────────────────────────────────────────────────────────
[Shows progressed positions]
```

---

### **`halcon aspects`** - Planetary Aspects

Calculate current planetary aspects (angular relationships).

**Usage:**
```bash
halcon aspects
halcon aspects --date 2025-12-25
halcon aspects --orb 6
```

**Optional Parameters:**
- `--date, -d` - Date for aspects (default: today)
- `--orb` - Orb tolerance in degrees (default: 8)

**Aspects Calculated:**
- **Conjunction (0°)** ☌ - Blending energies
- **Sextile (60°)** ⚹ - Opportunity
- **Square (90°)** □ - Tension, challenge
- **Trine (120°)** △ - Harmony, flow
- **Opposition (180°)** ☍ - Polarity, awareness

**Example Output:**
```
Major Aspects:
═══════════════════════════════════════════════════════════════
☌ Sun        Conjunction  Mercury    ±2.15°
△ Moon       Trine        Jupiter    ±0.50°
□ Mars       Square       Saturn     ±4.30°
☍ Venus      Opposition   Neptune    EXACT
═══════════════════════════════════════════════════════════════

Total: 4 aspects found
```

---

## 👤 User Profiles System

Save and quickly access birth chart data using simple profile names.

### **What Are Profiles?**

Profiles store natal birth chart information so you don't have to re-enter dates, times, and locations. Once saved, you can access charts and progressions instantly.

### **How to Save a Profile**

When generating a chart with a name, you'll be prompted to save:

```bash
halcon chart march 10 1990, kurnool india, 12:55 PM \(manu\)
# ... chart displays ...

💾 Save this profile? (y/yes or n/no): y
✅ Profile saved: manu
```

### **Profile Storage**

Profiles are stored in: `~/.halcon/profiles.json`

**What's Stored:**
```json
{
  "name": "manu",
  "date": "1990-03-10",
  "time": "12:55:00",
  "latitude": 15.8309,
  "longitude": 78.0425,
  "location": "Kurnool, India",
  "createdAt": "2025-09-30T...",
  "updatedAt": "2025-09-30T..."
}
```

### **Using Saved Profiles**

```bash
# View natal chart
halcon chart manu

# Calculate current progressions
halcon progressions manu

# Calculate progressions to specific date
halcon progressions manu --to 2026-01-01
```

### **🔍 STATIC vs DYNAMIC Behavior**

**Important distinction:**

| Command | Behavior | Result |
|---------|----------|--------|
| `halcon chart manu` | **STATIC** | Always shows natal chart (birth positions) |
| `halcon progressions manu` | **DYNAMIC** | Calculates to current date - **changes daily!** |

**Example:**
```bash
# Today (Sept 30, 2025)
$ halcon progressions manu
Age: 35 years
Progressed Date: 1990-04-15 (35 days after birth)

# Tomorrow (Oct 1, 2025)
$ halcon progressions manu
Age: 35 years
Progressed Date: 1990-04-15 (35 days after birth)
# ^ Same age, but slightly different planetary positions due to ephemeris precision

# Next year (Sept 30, 2026)
$ halcon progressions manu
Age: 36 years
Progressed Date: 1990-04-16 (36 days after birth)
# ^ New age, new progressed positions
```

**Why?**
- **Profiles store natal data only** (your birth information)
- **Progressions are calculated dynamically** using: `birth date + (current age in days)`
- **Real ephemeris data is fetched** every time from Swiss Ephemeris

**No caching!** Each run calculates fresh astronomical positions.

### **Profile Management**

**List all profiles:**
```bash
# View available profiles (feature coming soon)
cat ~/.halcon/profiles.json | grep "\"name\""
```

**Delete a profile:**
```bash
# Edit the profiles file directly
nano ~/.halcon/profiles.json
```

---

## 🛠️ MCP Servers (Claude Desktop Integration)

HALCON includes MCP servers that give Claude direct access to astrological data.

### **Configured Servers:**

1. **ephemeris** - Our custom ephemeris server
   - Tools: `get_transits`, `get_planet_position`, `calculate_moon_phase`
   - Source: ephemeris.fyi API

2. **geocoding** - Location lookup server
   - Tools: `geocode_location`, `reverse_geocode`, `get_timezone`
   - Source: OpenStreetMap Nominatim

3. **swiss-ephemeris** - Swiss Ephemeris MCP server
   - Tools: `calculate_planetary_positions`, `calculate_transits`, `calculate_solar_revolution`, `calculate_synastry`
   - Source: Swiss Ephemeris library

### **Using MCP Servers in Claude:**

After restarting Claude Desktop, ask:
- "What are the current planetary transits?"
- "Find coordinates for Paris, France"
- "Where is Mars right now?"
- "Calculate synastry between these two charts"

Claude will automatically use the MCP servers.

---

## 📊 Data Sources

### **Primary:** ephemeris.fyi
- Swiss Ephemeris based
- Fast, reliable API
- All major planets
- Moon phases

### **Fallback:** Thelemistas Ephemeris
- CSV format
- Backup if primary fails

### **Alternative:** Swiss Ephemeris MCP Server
- Full Swiss Ephemeris library
- Synastry calculations
- Solar returns
- More advanced features

---

## 🎨 Output Symbols

**Planets:**
- ☉ Sun
- ☽ Moon
- ☿ Mercury
- ♀ Venus
- ♂ Mars
- ♃ Jupiter
- ♄ Saturn
- ♅ Uranus
- ♆ Neptune
- ♇ Pluto

**Aspects:**
- ☌ Conjunction (0°)
- ⚹ Sextile (60°)
- □ Square (90°)
- △ Trine (120°)
- ☍ Opposition (180°)

**Other:**
- ℞ Retrograde
- 🌙 Moon Phase

---

## 💡 Common Use Cases

### **Morning Cosmic Check-in**
```bash
halcon transits
```

### **Birth Chart for Client**
```bash
# First, get coordinates
# In Claude: "Find coordinates for London, UK"
# Claude uses geocoding server: 51.5074, -0.1278

halcon chart --date 1985-06-21 --time 09:15:00 --lat 51.5074 --lon -0.1278 --city "London"
```

### **Check Current Aspects for Decision-Making**
```bash
halcon aspects --orb 6
```

### **Your Current Progressions**
```bash
halcon progressions --date YOUR_BIRTH_DATE --time YOUR_BIRTH_TIME --lat YOUR_LAT --lon YOUR_LON
```

---

## 🐛 Troubleshooting

### **Command not found**

```bash
# Reload shell configuration
source ~/.zshrc

# Verify PATH
echo $PATH | grep HALCON
```

### **API timeout errors**

The system has automatic fallbacks:
1. Tries ephemeris.fyi first
2. Falls back to Thelemistas API
3. Uses sample data if all fail

### **MCP servers not appearing in Claude**

1. Check config:
```bash
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

2. Restart Claude Desktop completely (Cmd+Q, then reopen)

3. Check logs:
```bash
tail -f ~/Library/Logs/Claude/mcp*.log
```

---

## 📁 File Structure

```
HALCON/
├── commands/
│   ├── halcon          # Main router
│   ├── transits        # Transits command
│   ├── chart           # Chart command
│   ├── progressions    # Progressions command
│   └── aspects         # Aspects command
├── claude-sdk-microservice/
│   ├── src/mcp/
│   │   ├── ephemeris-server.ts   # Ephemeris MCP
│   │   └── geocoding-server.ts   # Geocoding MCP
│   ├── mcp-ephemeris              # Ephemeris startup
│   ├── mcp-geocoding              # Geocoding startup
│   └── transits                   # Transits CLI
└── README-COMMANDS.md             # This file
```

---

## 🚀 Quick Start Guide

### **1. Setup** (Already Done!)
```bash
source ~/.zshrc
```

### **2. Try It Out**
```bash
# See current transits
halcon transits

# Get help
halcon --help
```

### **3. Use in Claude Desktop**
1. Restart Claude Desktop (Cmd+Q, reopen)
2. Ask: "What are the current planetary transits?"
3. Claude uses MCP servers automatically!

---

## 🔧 How It Works (Technical Details)

### **Architecture Overview**

```
User Input
    ↓
Natural Language → Claude API (parsing only)
    ↓
Geocoding → OpenStreetMap Nominatim
    ↓
Profile Storage (optional) → ~/.halcon/profiles.json
    ↓
Date Calculation → JavaScript Date arithmetic
    ↓
Ephemeris Data → ephemeris.fyi API → Swiss Ephemeris → NASA JPL DE431
    ↓
Display
```

### **What Claude AI Does vs Doesn't Do**

**Claude AI is ONLY used for:**
- ✅ Parsing natural language input ("march 10 1990, kurnool india, 12:55 PM")
- ✅ Extracting structured data (date, time, location, name)

**Claude AI is NOT used for:**
- ❌ Calculating planetary positions
- ❌ Calculating progressions
- ❌ Any astronomical calculations

### **Astronomical Calculations**

All planetary positions come from **Swiss Ephemeris** via ephemeris.fyi API:

1. **Data Source:** NASA JPL DE431 ephemeris (professional-grade)
2. **Accuracy:** Sub-arcsecond precision
3. **Same data used by:** Professional astrologers, planetarium software, NASA

### **Profile System**

**Storage:**
- Location: `~/.halcon/profiles.json`
- Format: JSON
- Contains: Natal birth data only

**What's stored:**
```json
{
  "name": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM:SS",
  "latitude": number,
  "longitude": number,
  "location": "City, Country"
}
```

**What's NOT stored:**
- Planetary positions
- Calculated progressions
- Chart data

### **Progression Calculations**

**Formula:** `progressed_date = birth_date + (age_in_years × 1 day)`

**Process:**
1. Load natal birth date from profile
2. Calculate current age: `today - birth_date`
3. Convert age to days: `age_in_years × 1 day`
4. Calculate progressed date: `birth_date + age_in_days`
5. Fetch ephemeris for progressed date
6. Compare natal vs progressed positions

**Example (for age 35):**
- Birth: March 10, 1990
- Today: September 30, 2025
- Age: 35 years
- Progressed date: March 10, 1990 + 35 days = **April 14, 1990**
- Fetch planetary positions for April 14, 1990
- Display natal (March 10) vs progressed (April 14)

### **No Caching, Always Fresh**

Every command fetches real-time ephemeris data:
- `halcon chart manu` → Fetches natal positions
- `halcon progressions manu` → Fetches natal + progressed positions
- No cached results
- Always current astronomical data

### **Data Flow: Natural Language to Chart**

```
"march 10 1990, kurnool india, 12:55 PM (manu)"
    ↓
Claude API: Parse → {date: "1990-03-10", time: "12:55:00", location: "kurnool india", name: "manu"}
    ↓
Nominatim API: Geocode → {lat: 15.8309, lon: 78.0425}
    ↓
Profile Manager: Save? (y/n)
    ↓
Ephemeris API: Fetch positions for 1990-03-10T12:55:00Z
    ↓
Display: Chart with planetary positions
```

---

## ♈ Astrological System

### **Zodiac System: Tropical (Western)**

HALCON uses the **Tropical Zodiac**, the standard system in Western astrology:

- **0° Aries** = Vernal Equinox (Spring)
- **0° Cancer** = Summer Solstice
- **0° Libra** = Autumn Equinox
- **0° Capricorn** = Winter Solstice

**Tropical vs Sidereal:**
- ✅ **Tropical** (used): Based on Earth's seasons and equinoxes
- ❌ **Sidereal** (not used): Based on fixed star constellations

**Why Tropical?**
- Swiss Ephemeris defaults to tropical
- Standard for Western psychological astrology
- Aligns with seasonal energy cycles
- Most widely used in modern Western practice

### **House System: Not Yet Implemented**

**Current Status:**
- 🌟 Planetary positions: ✅ Fully implemented
- 🏠 House cusps: ❌ Not yet calculated
- 📐 Angles (ASC/MC): ❌ Not yet calculated

**What You Get:**
```bash
$ halcon chart manu
☉ Sun         19.69° Pisces    # ✅ Planetary positions
☽ Moon         9.06° Virgo     # ✅ Signs and degrees
☿ Mercury     11.96° Pisces    # ✅ Retrograde indicators
# ... but no house placements yet
```

**Coming Soon:**
House calculations with multiple systems:
- Placidus (most common)
- Equal House
- Whole Sign
- Koch
- Regiomontanus

**Current Workaround:**
Use the Swiss Ephemeris MCP server in Claude Desktop:
```
"Calculate my birth chart with houses for March 10, 1990, 12:55 PM in Kurnool, India"
```
Claude will use the `swiss-ephemeris` MCP server which includes house calculations.

### **Aspect Calculations**

**Supported Aspects:**
- ☌ Conjunction (0°) - Orb: 8°
- ⚹ Sextile (60°) - Orb: 6°
- □ Square (90°) - Orb: 8°
- △ Trine (120°) - Orb: 8°
- ☍ Opposition (180°) - Orb: 8°

**Usage:**
```bash
halcon aspects              # Current transiting aspects
halcon aspects --orb 6      # Tighter orbs
```

**Note:** Aspects between natal planets are calculated, but natal-to-transit aspects (transits to your birth chart) are not yet implemented.

### **Data Accuracy**

**Source:** Swiss Ephemeris via ephemeris.fyi API
- **Based on:** NASA JPL DE431 ephemeris
- **Precision:** Sub-arcsecond accuracy
- **Same data as:** Professional astrology software, planetariums
- **Updates:** Real-time (no caching)

**Tropical by Default:**
Swiss Ephemeris calculates tropical positions by default. No conversion or ayanamsa is applied.

---

## 📚 Additional Resources

- **MCP Documentation:** `README-MCP.md`
- **API Documentation:** `docs/NATAL-CHART-API.md`
- **Astro Analysis:** `docs/ASTRO-ANALYSIS.md`
- **Ephemeris APIs:** `docs/EPHEMERIS-API-REFERENCES.md`
- **System Context:** `requirements/system-context.md`

---

**Built with ❤️ for HALCON - Cosmic Productivity Platform**