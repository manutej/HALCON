import swisseph from 'swisseph';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Initialize Swiss Ephemeris
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
swisseph.swe_set_ephe_path(join(__dirname, './node_modules/swisseph/ephe'));

// Manu's birth data
const year = 1990;
const month = 3;
const day = 10;
const hour = 12 + 55/60;  // 12:55 UTC
const latitude = 15.8309251;
const longitude = 78.0425373;

// Calculate Julian Day
const jd = swisseph.swe_julday(year, month, day, hour, swisseph.SE_GREG_CAL);

console.log("Birth Data:");
console.log(`Date: ${day}.${month}.${year} ${hour.toFixed(4)} UTC`);
console.log(`Location: ${latitude}°N, ${longitude}°E (Kurnool, India)`);
console.log(`Julian Day: ${jd}`);
console.log();

// Calculate houses - Placidus system
const result = swisseph.swe_houses(jd, latitude, longitude, 'P');

console.log("House Calculation Result:");
console.log(JSON.stringify(result, null, 2));
console.log();

console.log("House Cusps:");
result.house.forEach((cusp, i) => {
    console.log(`House ${String(i+1).padStart(2)}: ${cusp.toFixed(6)}°`);
});

console.log();
console.log("Angles:");
console.log(`Ascendant: ${result.ascendant.toFixed(6)}°`);
console.log(`MC (Midheaven): ${result.mc.toFixed(6)}°`);
console.log(`Descendant: ${((result.ascendant + 180) % 360).toFixed(6)}°`);
console.log(`IC (Imum Coeli): ${((result.mc + 180) % 360).toFixed(6)}°`);
