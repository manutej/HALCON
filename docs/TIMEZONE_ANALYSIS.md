# HALCON Timezone Analysis & Solution

**Date**: 2025-10-18
**Issue**: CET-168 - Add timezone conversion for profile birth times
**Priority**: HIGH/URGENT

---

## Current Situation Analysis

### What's Actually Happening

**Code Review Findings:**

1. **Line 67** in `src/commands/houses.ts`:
   ```typescript
   // FIXED: Add 'Z' to treat as UTC to prevent timezone issues
   dateTime = new Date(`${profile.date}T${profile.time}Z`);
   ```

2. **Line 142** in `claude-sdk-microservice/src/cli/houses.ts`:
   ```typescript
   const birthDateTime = new Date(`${date}T${time}Z`);
   ```

**The 'Z' suffix forces UTC interpretation** - this is CORRECT for Swiss Ephemeris (which requires UTC).

### The Real Problem

**Profile Storage:**
```typescript
// profile-manager.ts - Line 5-14
export interface UserProfile {
  name: string;
  date: string;        // YYYY-MM-DD
  time: string;        // HH:MM:SS  ← NO TIMEZONE INFO!
  latitude: number;
  longitude: number;
  location: string;    // City, Country
  createdAt: string;
  updatedAt: string;
}
```

**The Issue:**
- Profiles store time as `"12:55:00"` without timezone context
- User thinks: "I was born at 12:55 PM in India"
- System interprets: "12:55 UTC" (because of the 'Z' suffix)
- Reality: Birth was 12:55 IST = 07:25 UTC

**Result:**
- ❌ Houses calculated for 12:55 UTC instead of 07:25 UTC
- ❌ ~5.5 hour error = ~82° longitude offset
- ✅ Sun/planets relatively unaffected (slower moving)
- ❌ Houses very wrong (highly time-sensitive)

---

## Correct Flow (What We Need)

### Desired Workflow

```
User Input (Local Time)
    ↓
Profile Storage (Local Time + Timezone)
    ↓
Conversion Layer (Local → UTC)
    ↓
Swiss Ephemeris Calculation (UTC)
    ↓
Results
```

### Example

**User Input:**
- Birth: March 10, 1990, 12:55 PM
- Location: Kurnool, India (IST = UTC+5:30)

**Profile Should Store:**
```json
{
  "date": "1990-03-10",
  "time": "12:55:00",
  "timezone": "Asia/Kolkata",
  "utc_offset": "+05:30",
  "latitude": 15.83,
  "longitude": 78.04
}
```

**Calculation Should Use:**
```javascript
// Convert local time to UTC
const localDateTime = "1990-03-10T12:55:00"; // India time
const timezone = "Asia/Kolkata";
const utcDateTime = convertToUTC(localDateTime, timezone);
// Result: "1990-03-10T07:25:00Z"

// Pass to Swiss Ephemeris
calculateHouses(new Date(utcDateTime), lat, lon);
```

---

## Solution Components

### 1. Profile Schema Enhancement

**Add to UserProfile interface:**
```typescript
export interface UserProfile {
  name: string;
  date: string;           // YYYY-MM-DD
  time: string;           // HH:MM:SS (LOCAL TIME)
  timezone: string;       // NEW: IANA timezone (e.g., "Asia/Kolkata")
  utcOffset?: string;     // NEW: Optional, for historical accuracy (e.g., "+05:30")
  latitude: number;
  longitude: number;
  location: string;
  createdAt: string;
  updatedAt: string;
}
```

### 2. Timezone Conversion Layer

**Use luxon library (already in dependencies):**
```typescript
import { DateTime } from 'luxon';

function convertLocalToUTC(
  date: string,     // "1990-03-10"
  time: string,     // "12:55:00"
  timezone: string  // "Asia/Kolkata"
): Date {
  // Create DateTime in local timezone
  const localDateTime = DateTime.fromFormat(
    `${date} ${time}`,
    'yyyy-MM-dd HH:mm:ss',
    { zone: timezone }
  );

  // Convert to UTC
  const utcDateTime = localDateTime.toUTC();

  // Return as JavaScript Date
  return utcDateTime.toJSDate();
}
```

### 3. MCP Time Server Integration

**Reference**: https://mcpservers.org/servers/modelcontextprotocol/time

**Features:**
- Convert between timezones
- Get current time in any timezone
- Calculate timezone offsets
- Handle DST (Daylight Saving Time)

**Installation:**
```json
// Add to mcp-config.json
{
  "mcpServers": {
    "time": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-time"]
    }
  }
}
```

**Usage:**
```typescript
// Get timezone info for location
const timezoneInfo = await mcp.time.getTimezone({
  latitude: 15.83,
  longitude: 78.04
});
// Returns: { timezone: "Asia/Kolkata", offset: "+05:30" }

// Convert time
const utcTime = await mcp.time.convertTimezone({
  datetime: "1990-03-10T12:55:00",
  fromTimezone: "Asia/Kolkata",
  toTimezone: "UTC"
});
// Returns: "1990-03-10T07:25:00Z"
```

---

## Implementation Plan

### Phase 1: Profile Schema Migration (Immediate)

1. **Update UserProfile interface** with timezone fields
2. **Create migration script** to update existing profiles:
   ```bash
   npm run migrate:timezones
   ```
   - Prompt user for each profile's timezone
   - Recalculate UTC times
   - Save updated profiles

3. **Modify profile creation** to require timezone

### Phase 2: MCP Time Server Integration (Short-term)

1. **Install MCP time server**
2. **Add timezone detection** from coordinates
3. **Implement conversion helpers** using MCP

### Phase 3: CLI Enhancements (Medium-term)

1. **Add --timezone flag** for manual calculations
2. **Show both local and UTC** in output:
   ```
   Birth Time (Local): 1990-03-10 12:55:00 IST (Asia/Kolkata)
   Birth Time (UTC):   1990-03-10 07:25:00 UTC
   ```
3. **Auto-detect timezone** from location name

---

## Migration Strategy for Existing Profiles

### Current Profiles (from your system)
```
manu - Kurnool, India
melo - Laredo, USA
pablo - Panama City, Panama
Osiris - Caracas, Venezuela
diego - Panama City, Panama
```

### Migration Steps

1. **Create migration script:**
   ```bash
   node scripts/migrate_timezones.mjs
   ```

2. **For each profile:**
   - Show: "Profile: manu (Kurnool, India)"
   - Show: "Current stored time: 12:55:00"
   - Detect timezone from coordinates: "Asia/Kolkata (IST, UTC+5:30)"
   - Ask: "Is this the LOCAL time at birth? (Y/n)"
   - Calculate UTC: "UTC time would be: 07:25:00"
   - Confirm: "Recalculate houses with UTC time? (Y/n)"
   - Update profile with timezone
   - Recalculate and save

3. **Backup original profiles** to `~/.halcon/profiles.backup.json`

---

## Testing Plan

### 1. Validate Timezone Conversion
```bash
# Test known conversions
India (IST):      12:55 IST    → 07:25 UTC ✅
USA (EST):        12:55 EST    → 17:55 UTC ✅
Panama (no DST):  12:55 EST    → 17:55 UTC ✅
Venezuela (VET):  12:55 VET    → 16:25 UTC ✅
```

### 2. Validate House Calculations
```bash
# Before fix
./commands/halcon houses manu
# Ascendant: ~268° (WRONG)

# After fix
./commands/halcon houses manu
# Ascendant: ~170° (CORRECT)
```

### 3. Edge Cases
- Birth during DST transition
- Historical dates before timezone standardization
- Locations that changed timezones
- UTC births (timezone = "UTC", no conversion needed)

---

## Immediate Action Items

### Priority 1 (This Week)
- [ ] Update Linear issue CET-168 with this analysis
- [ ] Add MCP time server to documentation
- [ ] Create profile migration script
- [ ] Test timezone conversion with luxon

### Priority 2 (Next Week)
- [ ] Implement MCP time server integration
- [ ] Update UserProfile schema
- [ ] Migrate existing profiles
- [ ] Recalculate all house positions

### Priority 3 (Following Week)
- [ ] Add CLI timezone flags
- [ ] Show dual time display (local + UTC)
- [ ] Auto-detect timezone from coordinates
- [ ] Comprehensive testing

---

## References

- **MCP Time Server**: https://mcpservers.org/servers/modelcontextprotocol/time
- **Luxon Documentation**: https://moment.github.io/luxon/
- **IANA Timezone Database**: https://www.iana.org/time-zones
- **Swiss Ephemeris**: Requires UTC time input
- **Linear Issue**: CET-168

---

## Conclusion

**Summary:**
- ✅ Code correctly uses 'Z' suffix for UTC (this is RIGHT)
- ❌ Profiles lack timezone information (this is the PROBLEM)
- ❌ User input assumed to be UTC instead of local time (this causes errors)

**Solution:**
1. Add timezone field to profiles
2. Convert local time → UTC before calculations
3. Use MCP time server for timezone operations
4. Migrate existing profiles with user confirmation

**Impact:**
- All existing profiles need recalculation
- House positions will change (for the better!)
- Sun/planets positions should remain similar

This is HIGH priority as it affects accuracy of all astrological calculations.
