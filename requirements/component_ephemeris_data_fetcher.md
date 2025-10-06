# Component: Ephemeris Data Fetcher

## Purpose
The **Ephemeris Data Fetcher** retrieves and processes real-time zodiacal positions of celestial bodies (Sun, Moon, planets, asteroids, etc.) using high-precision ephemeris data, enabling accurate astrological calculations for the Starboard Mission Control Hub.

## Functionality
- Fetch planetary positions (longitude, latitude, declination) for a given date, time, and location.
- Support tropical and sidereal zodiacs, with optional Ayanamsa for Vedic astrology.
- Calculate lunar phases, retrogrades, sign ingresses, and void-of-course Moon periods.
- Adjust positions for user’s local time zone and geolocation.

## Implementation Details
- **Data Source**:
  - **Swiss Ephemeris** (preferred): Licensed C library based on NASA’s JPL DE431, covering 13201 BC to AD 17191 with 0.001 arcsecond precision. Supports planets, asteroids, lunar nodes, Chiron, Lilith, and Uranian points.
  - **Moshier Ephemeris** (alternative): Open-source library for local calculations, suitable for MVP.
  - **APIs**: Astro-Seek.com or Astrodienst for precomputed positions.
- **Calculations**:
  - Input: Date, time (UTC or local), latitude/longitude.
  - Output: Zodiacal positions (e.g., Sun in Leo 2°15'), retrograde status, house placements (using Placidus or other house systems).
  - Handle time zone conversions (e.g., PDT = UTC-7) and Daylight Saving Time.
- **Caching**:
  - Cache daily/hourly positions in Redis to reduce API calls.
  - Store compressed ephemeris data (e.g., Swiss Ephemeris’s 97 MB dataset).
- **Error Handling**:
  - Validate user inputs (e.g., valid date, location).
  - Fallback to default ephemeris (e.g., Moshier) if API access fails.

## Integration
- Expose an API endpoint (e.g., `/api/ephemeris?date=2025-07-24&time=16:26&lat=40.7128&lon=-74.0060`) for the dashboard and productivity components.
- Output JSON with positions, e.g.:
  ```json
  {
    "Sun": {"sign": "Leo", "degrees": 2.25, "retrograde": false},
    "Moon": {"sign": "Cancer", "degrees": 15.10, "voidOfCourse": false},
    ...
  }