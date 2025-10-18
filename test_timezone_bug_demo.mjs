#!/usr/bin/env node
/**
 * HALCON Timezone Bug Demonstration
 *
 * This script demonstrates the timezone parsing bug in HALCON's
 * house calculation system and shows the fix.
 */

import swisseph from 'swisseph';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Initialize Swiss Ephemeris
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
swisseph.swe_set_ephe_path(join(__dirname, './node_modules/swisseph/ephe'));

console.log('HALCON TIMEZONE BUG DEMONSTRATION');
console.log('='.repeat(80));
console.log();

// Test data: Manu's profile
const profile = {
  date: "1990-03-10",
  time: "12:55:00",
  latitude: 15.8309251,
  longitude: 78.0425373
};

console.log('PROFILE DATA:');
console.log(`  Date: ${profile.date}`);
console.log(`  Time: ${profile.time} (NO TIMEZONE SPECIFIED)`);
console.log(`  Location: ${profile.latitude}°N, ${profile.longitude}°E`);
console.log();

// ============================================================================
// BUGGY VERSION (Current HALCON behavior)
// ============================================================================

console.log('1. BUGGY VERSION (Current HALCON behavior)');
console.log('-'.repeat(80));

const buggyDateTime = new Date(`${profile.date}T${profile.time}`);
console.log(`  Parsed string: "${profile.date}T${profile.time}"`);
console.log(`  JavaScript interprets as: ${buggyDateTime.toString()}`);
console.log(`  Converts to UTC: ${buggyDateTime.toISOString()}`);
console.log();

const buggyYear = buggyDateTime.getUTCFullYear();
const buggyMonth = buggyDateTime.getUTCMonth() + 1;
const buggyDay = buggyDateTime.getUTCDate();
const buggyHour = buggyDateTime.getUTCHours() +
                  buggyDateTime.getUTCMinutes() / 60 +
                  buggyDateTime.getUTCSeconds() / 3600;

console.log(`  UTC Components: ${buggyDay}.${buggyMonth}.${buggyYear} ${buggyHour.toFixed(4)} hours`);

const buggyJD = swisseph.swe_julday(buggyYear, buggyMonth, buggyDay, buggyHour, swisseph.SE_GREG_CAL);
const buggyResult = swisseph.swe_houses(buggyJD, profile.latitude, profile.longitude, 'P');

console.log(`  Julian Day: ${buggyJD.toFixed(6)}`);
console.log(`  Ascendant: ${buggyResult.ascendant.toFixed(6)}°`);
console.log(`  Midheaven: ${buggyResult.mc.toFixed(6)}°`);
console.log();

// ============================================================================
// FIXED VERSION (Adding 'Z' suffix for UTC)
// ============================================================================

console.log('2. FIXED VERSION (Adding "Z" suffix for UTC)');
console.log('-'.repeat(80));

const fixedDateTime = new Date(`${profile.date}T${profile.time}Z`);  // Note the 'Z'!
console.log(`  Parsed string: "${profile.date}T${profile.time}Z"`);
console.log(`  JavaScript interprets as: ${fixedDateTime.toString()}`);
console.log(`  Converts to UTC: ${fixedDateTime.toISOString()}`);
console.log();

const fixedYear = fixedDateTime.getUTCFullYear();
const fixedMonth = fixedDateTime.getUTCMonth() + 1;
const fixedDay = fixedDateTime.getUTCDate();
const fixedHour = fixedDateTime.getUTCHours() +
                  fixedDateTime.getUTCMinutes() / 60 +
                  fixedDateTime.getUTCSeconds() / 3600;

console.log(`  UTC Components: ${fixedDay}.${fixedMonth}.${fixedYear} ${fixedHour.toFixed(4)} hours`);

const fixedJD = swisseph.swe_julday(fixedYear, fixedMonth, fixedDay, fixedHour, swisseph.SE_GREG_CAL);
const fixedResult = swisseph.swe_houses(fixedJD, profile.latitude, profile.longitude, 'P');

console.log(`  Julian Day: ${fixedJD.toFixed(6)}`);
console.log(`  Ascendant: ${fixedResult.ascendant.toFixed(6)}°`);
console.log(`  Midheaven: ${fixedResult.mc.toFixed(6)}°`);
console.log();

// ============================================================================
// COMPARISON
// ============================================================================

console.log('3. COMPARISON');
console.log('-'.repeat(80));

const jdDiff = fixedJD - buggyJD;
const hoursDiff = jdDiff * 24;
const ascDiff = fixedResult.ascendant - buggyResult.ascendant;
const mcDiff = fixedResult.mc - buggyResult.midheaven;

console.log(`  Julian Day difference: ${jdDiff.toFixed(6)} days = ${hoursDiff.toFixed(2)} hours`);
console.log(`  Ascendant difference: ${ascDiff.toFixed(6)}°`);
console.log(`  Midheaven difference: ${mcDiff.toFixed(6)}°`);
console.log();

// ============================================================================
// VERIFICATION AGAINST SWETEST
// ============================================================================

console.log('4. VERIFICATION AGAINST SWETEST');
console.log('-'.repeat(80));

console.log('  Expected values (from swetest):');
console.log(`    Julian Day: 2447961.038194`);
console.log(`    Ascendant: 170.046743°`);
console.log(`    Midheaven: 80.565393°`);
console.log();

console.log('  Buggy version matches?');
console.log(`    JD: ${Math.abs(buggyJD - 2447961.038194) < 0.001 ? '✅' : '❌'} (${buggyJD.toFixed(6)})`);
console.log(`    ASC: ${Math.abs(buggyResult.ascendant - 170.046743) < 0.01 ? '✅' : '❌'} (${buggyResult.ascendant.toFixed(6)}°)`);
console.log(`    MC: ${Math.abs(buggyResult.mc - 80.565393) < 0.01 ? '✅' : '❌'} (${buggyResult.mc.toFixed(6)}°)`);
console.log();

console.log('  Fixed version matches?');
console.log(`    JD: ${Math.abs(fixedJD - 2447961.038194) < 0.001 ? '✅' : '❌'} (${fixedJD.toFixed(6)})`);
console.log(`    ASC: ${Math.abs(fixedResult.ascendant - 170.046743) < 0.01 ? '✅' : '❌'} (${fixedResult.ascendant.toFixed(6)}°)`);
console.log(`    MC: ${Math.abs(fixedResult.mc - 80.565393) < 0.01 ? '✅' : '❌'} (${fixedResult.mc.toFixed(6)}°)`);
console.log();

// ============================================================================
// SWETEST COMMAND
// ============================================================================

console.log('5. MANUAL VERIFICATION');
console.log('-'.repeat(80));
console.log('  Run this swetest command to verify:');
console.log();
console.log(`  /Users/manu/bin/swetest -b10.3.1990 -ut12:55:00 \\`);
console.log(`    -house${profile.longitude},${profile.latitude},P \\`);
console.log(`    -geopos${profile.longitude},${profile.latitude}`);
console.log();

// ============================================================================
// SUMMARY
// ============================================================================

console.log('='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log();
console.log('BUG IDENTIFIED:');
console.log('  JavaScript Date constructor treats ISO 8601 strings WITHOUT timezone');
console.log('  as LOCAL time, not UTC. This causes wrong calculations.');
console.log();
console.log('SOLUTION:');
console.log('  Always append "Z" suffix to ensure UTC interpretation:');
console.log('    WRONG: new Date("1990-03-10T12:55:00")');
console.log('    RIGHT: new Date("1990-03-10T12:55:00Z")');
console.log();
console.log('IMPACT:');
console.log('  All house calculations from saved profiles are incorrect.');
console.log('  The offset varies depending on the machine\'s timezone.');
console.log();
console.log('NEXT STEPS:');
console.log('  1. Fix date parsing in src/commands/houses.ts');
console.log('  2. Add timezone field to UserProfile interface');
console.log('  3. Add tests to prevent regression');
console.log('  4. Document timezone handling in user guide');
console.log();
