# Ephemeris API References

## Overview

This document contains reference documentation for the ephemeris APIs and services used in HALCON.

---

## 1. ephemeris.fyi

**URL:** https://ephemeris.fyi/
**GitHub:** Not available (commercial/hosted service)
**Type:** REST API with Swiss Ephemeris backend

### Description
A modern REST API for astronomical and astrological calculations powered by Swiss Ephemeris.

### Base URL
```
https://ephemeris.fyi/ephemeris/
```

### Available Endpoints

#### 1. Get Single Body Position
```http
GET /ephemeris/get_single_body_position
```

**Parameters:**
- `body` - Celestial body (sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto)
- `latitude` - Geographic latitude
- `longitude` - Geographic longitude
- `datetime` - ISO 8601 formatted date and time

**Example:**
```bash
curl "https://ephemeris.fyi/ephemeris/get_single_body_position?body=sun&latitude=40.7128&longitude=-74.0060&datetime=2025-01-01T12:00:00Z"
```

#### 2. Get Multiple Bodies Ephemeris Data
```http
GET /ephemeris/get_ephemeris_data
```

**Parameters:**
- `bodies` - Comma-separated list of celestial bodies
- `latitude` - Geographic latitude
- `longitude` - Geographic longitude
- `datetime` - ISO 8601 formatted date and time

**Example:**
```bash
curl "https://ephemeris.fyi/ephemeris/get_ephemeris_data?bodies=sun,moon,mars&latitude=40.7128&longitude=-74.0060&datetime=2025-01-01T12:00:00Z"
```

#### 3. Calculate Aspects
```http
GET /ephemeris/calculate_aspects
```

**Parameters:**
- `bodies` - Comma-separated list of celestial bodies
- `latitude` - Geographic latitude
- `longitude` - Geographic longitude
- `datetime` - ISO 8601 formatted date and time

**Example:**
```bash
curl "https://ephemeris.fyi/ephemeris/calculate_aspects?bodies=sun,moon,mars&latitude=40.7128&longitude=-74.0060&datetime=2025-01-01T12:00:00Z"
```

### Supported Bodies
- mercury
- venus
- mars
- jupiter
- saturn
- uranus
- neptune
- pluto
- sun
- moon
- chiron

### Response Format
Returns JSON with detailed astronomical data including:
- Equinox ecliptic longitude/latitude
- Apparent positions
- Right ascension and declination
- Constellation
- Altitude/azimuth (topocentric)
- Transit times
- Moon phase information
- Aspect calculations

### Example Response Structure
```json
{
  "sun": {
    "equinoxEclipticLonLat": {
      "0": 3.2655196052277913,  // Radians
      "1": -0.0000026163378933795156,
      "2": 1.0015528017186819
    },
    "apparentLongitude": 187.09571835459903,  // Degrees
    "apparentLongitudeString": "187°5'44\"",
    "apparentLongitude30String": "7°5'44\"",  // Degrees within sign
    "constellation": "Vir Virginis"
  },
  "moon": {
    "apparentLongitude": 277.1349422895715,
    "phaseQuarter": 1,
    "phaseQuarterString": "First Quarter",
    "illuminatedFraction": 0.5015704496897917
  }
}
```

### Integration in HALCON
- **File:** `src/services/astro-analysis/astro-data-fetcher.ts`
- **Method:** `fetchFromEphemerisFyi()`
- **Usage:** Primary data source for transits command
- **Parser:** `parseEphemerisFyiResponse()` - Converts radians to degrees, extracts nested data

### Notes
- Free API, no authentication required
- Radians need conversion to degrees
- Complex nested JSON structure
- Excellent accuracy (Swiss Ephemeris based)

---

## 2. Swiss Ephemeris MCP Server

**GitHub:** https://github.com/dm0lz/swiss-ephemeris-mcp-server
**Type:** MCP Server (Model Context Protocol)
**License:** GPL (Swiss Ephemeris license applies)

### Description
A full-featured MCP server providing astrological calculations using the Swiss Ephemeris library. Offers more comprehensive calculations than simple API endpoints.

### Installation
```bash
git clone https://github.com/dm0lz/swiss-ephemeris-mcp-server.git
cd swiss-ephemeris-mcp-server
npm install
```

### Prerequisites
- Swiss Ephemeris `swetest` command must be installed
- Node.js 18+

### Tools Provided

#### 1. calculate_planetary_positions
Calculate positions of all planets for a given datetime and location.

**Parameters:**
- `datetime` - ISO8601 format
- `latitude` - Geographic latitude
- `longitude` - Geographic longitude

**Returns:**
- Planetary positions
- House cusps
- Ascendant and Midheaven
- Additional chart points

#### 2. calculate_transits
Calculate planetary transits for a specific period.

**Parameters:**
- `datetime` - ISO8601 format
- `planet` - Planet name
- Additional transit-specific parameters

#### 3. calculate_solar_revolution
Calculate solar return chart (birthday chart for current year).

**Parameters:**
- Birth date and time
- Current location
- Year for solar return

#### 4. calculate_synastry
Calculate relationship compatibility between two charts.

**Parameters:**
- Chart 1: datetime, latitude, longitude
- Chart 2: datetime, latitude, longitude

**Returns:**
- Synastry aspects
- Composite chart points
- Compatibility indicators

### MCP Configuration

**Claude Desktop config:**
```json
{
  "mcpServers": {
    "swiss-ephemeris": {
      "command": "node",
      "args": ["/path/to/swiss-ephemeris-mcp-server/index.js"],
      "env": {}
    }
  }
}
```

### Integration in HALCON
- **Location:** `/tmp/swiss-ephemeris-mcp-server/`
- **Config:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Status:** Alternative/advanced calculations
- **Access:** Through Claude Desktop MCP integration

### Advantages
- More comprehensive than ephemeris.fyi
- Synastry calculations
- Solar returns
- Full Swiss Ephemeris feature set
- MCP protocol for Claude integration

### Usage in Claude
After configuration, ask Claude:
- "Calculate my solar return for this year"
- "Show synastry between these two birth charts"
- "Calculate planetary positions with houses"

---

## 3. Thelemistas Ephemeris API

**URL:** http://apps.thelemistas.org/ephemeris_data.cgi
**Type:** CGI/CSV API
**Status:** Fallback (currently experiencing timeouts)

### Description
Simple ephemeris API returning CSV-formatted planetary positions.

### Endpoint
```http
GET http://apps.thelemistas.org/ephemeris_data.cgi
```

**Parameters:**
- `d` - Date/time in format: `YYYY-MM-DDTHH:MM:SS+TZ`
- `p` - Planets, joined with `+` (e.g., `sun+moon+mercury`)

**Example:**
```bash
curl "http://apps.thelemistas.org/ephemeris_data.cgi?d=2025-09-30T00:00:00+00:00&p=sun+moon"
```

### Response Format
CSV format:
```
200
SU,187:06:01.76,-00:00:00.53,1.0015528,1:01:09.00
MO,277:08:05.45,-04:58:16.42,0.0026608,13:12:33.00
```

**Fields:**
1. Planet code (SU, MO, ME, VE, MA, JU, SA, UR, NE, PL)
2. Longitude (degrees:minutes:seconds)
3. Latitude (degrees:minutes:seconds)
4. Distance (AU)
5. Speed (degrees:minutes:seconds per day)

### Planet Codes
- SU: Sun
- MO: Moon
- ME: Mercury
- VE: Venus
- MA: Mars
- JU: Jupiter
- SA: Saturn
- UR: Uranus
- NE: Neptune
- PL: Pluto

### Integration in HALCON
- **File:** `src/services/astro-analysis/astro-data-fetcher.ts`
- **Method:** `fetchCurrentPositions()`
- **Parser:** `parseEphemerisResponse()`
- **Status:** Fallback when ephemeris.fyi fails

### Notes
- Simple CSV format
- Currently experiencing connectivity issues
- Used as fallback only
- Requires coordinate parsing

---

## 4. OpenStreetMap Nominatim (Geocoding)

**URL:** https://nominatim.openstreetmap.org/
**Type:** REST API for geocoding
**License:** Open Database License

### Description
Free geocoding service for converting location names to coordinates.

### Endpoints

#### Search (Geocoding)
```http
GET https://nominatim.openstreetmap.org/search
```

**Parameters:**
- `q` - Query string (location name)
- `format` - Response format (json, xml)
- `limit` - Number of results

**Example:**
```bash
curl "https://nominatim.openstreetmap.org/search?q=London,UK&format=json&limit=1"
```

#### Reverse (Reverse Geocoding)
```http
GET https://nominatim.openstreetmap.org/reverse
```

**Parameters:**
- `lat` - Latitude
- `lon` - Longitude
- `format` - Response format (json, xml)

**Example:**
```bash
curl "https://nominatim.openstreetmap.org/reverse?lat=51.5074&lon=-0.1278&format=json"
```

### Integration in HALCON
- **File:** `src/mcp/geocoding-server.ts`
- **MCP Server:** geocoding
- **Tools:**
  - `geocode_location` - Name to coordinates
  - `reverse_geocode` - Coordinates to name
  - `get_timezone` - Estimate timezone

### Usage in Claude
- "Find coordinates for Paris, France"
- "What city is at latitude 40.7128, longitude -74.0060?"

### Notes
- Free, no API key required
- Rate limiting: reasonable usage
- Must include User-Agent header
- Returns detailed address components

---

## Comparison Matrix

| Feature | ephemeris.fyi | Swiss Ephemeris MCP | Thelemistas |
|---------|---------------|---------------------|-------------|
| **Format** | JSON (nested) | MCP/JSON | CSV |
| **Authentication** | None | None | None |
| **Planets** | 10 + Chiron | All + Asteroids | 10 major |
| **Houses** | No | Yes | No |
| **Aspects** | Yes | Yes | No |
| **Synastry** | No | Yes | No |
| **Solar Returns** | No | Yes | No |
| **Speed** | Fast | Medium | Fast |
| **Reliability** | ✅ Excellent | ✅ Excellent | ⚠️ Timeouts |
| **Accuracy** | Swiss Ephemeris | Swiss Ephemeris | Unknown |
| **Cost** | Free | Free | Free |

---

## HALCON Data Flow

```
User Command (halcon transits)
    ↓
AstroDataFetcher.fetchExtendedData()
    ↓
Try: ephemeris.fyi (Primary)
    ↓
Fallback: Thelemistas (Secondary)
    ↓
Parse & Format
    ↓
Display to User
```

**For Claude Desktop:**
```
User Query in Claude
    ↓
Claude chooses MCP tool
    ↓
Option 1: ephemeris MCP (our server)
    ↓ calls
    AstroDataFetcher → ephemeris.fyi

Option 2: swiss-ephemeris MCP
    ↓ calls
    Swiss Ephemeris Library directly

Option 3: geocoding MCP
    ↓ calls
    OpenStreetMap Nominatim
```

---

## Future Enhancements

### Potential Additional APIs
1. **AstroAPI** - https://api.astroapi.com
2. **Astrodienst** - https://www.astro.com/swisseph/
3. **TimeZoneDB** - For accurate timezone lookups

### Planned Improvements
- Cache responses to reduce API calls
- Implement request queuing for rate limits
- Add error recovery strategies
- Support for more celestial bodies
- Vedic/Sidereal zodiac calculations

---

## References

### Official Documentation
- **Swiss Ephemeris:** https://www.astro.com/swisseph/swephinfo_e.htm
- **Swiss Ephemeris Programmer's Manual:** https://www.astro.com/swisseph/swisseph.htm
- **OpenStreetMap Nominatim:** https://nominatim.org/release-docs/latest/api/Search/
- **Model Context Protocol (MCP):** https://modelcontextprotocol.io/

### Source Code
- **Swiss Ephemeris MCP Server:** https://github.com/dm0lz/swiss-ephemeris-mcp-server
- **MCP SDK:** https://github.com/modelcontextprotocol/sdk
- **HALCON Ephemeris MCP:** `src/mcp/ephemeris-server.ts`
- **HALCON Geocoding MCP:** `src/mcp/geocoding-server.ts`

### Academic Resources
- JPL DE431 Ephemeris (NASA)
- IAU Standards for Astronomical Calculations
- Astrological Calculation Methods (Placidus, etc.)

---

**Last Updated:** September 30, 2025
**Maintained by:** HALCON Development Team