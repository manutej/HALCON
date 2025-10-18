// Test date parsing from profile data

const profile = {
  date: "1990-03-10",
  time: "12:55:00"
};

// How HALCON parses it (from houses.ts line 66)
const dateTime = new Date(`${profile.date}T${profile.time}`);

console.log("Profile data:");
console.log(`  Date: ${profile.date}`);
console.log(`  Time: ${profile.time}`);
console.log();

console.log("Parsed Date object:");
console.log(`  toString(): ${dateTime.toString()}`);
console.log(`  toISOString(): ${dateTime.toISOString()}`);
console.log(`  toUTCString(): ${dateTime.toUTCString()}`);
console.log();

console.log("Date components:");
console.log(`  getUTCFullYear(): ${dateTime.getUTCFullYear()}`);
console.log(`  getUTCMonth(): ${dateTime.getUTCMonth()} (0-indexed, so +1 = ${dateTime.getUTCMonth() + 1})`);
console.log(`  getUTCDate(): ${dateTime.getUTCDate()}`);
console.log(`  getUTCHours(): ${dateTime.getUTCHours()}`);
console.log(`  getUTCMinutes(): ${dateTime.getUTCMinutes()}`);
console.log(`  getUTCSeconds(): ${dateTime.getUTCSeconds()}`);
console.log();

const hour = dateTime.getUTCHours() + dateTime.getUTCMinutes() / 60 + dateTime.getUTCSeconds() / 3600;
console.log(`Calculated hour: ${hour}`);
console.log();

console.log("LOCAL TIME COMPONENTS:");
console.log(`  getFullYear(): ${dateTime.getFullYear()}`);
console.log(`  getMonth(): ${dateTime.getMonth()} (0-indexed, so +1 = ${dateTime.getMonth() + 1})`);
console.log(`  getDate(): ${dateTime.getDate()}`);
console.log(`  getHours(): ${dateTime.getHours()}`);
console.log(`  getMinutes(): ${dateTime.getMinutes()}`);
console.log(`  getSeconds(): ${dateTime.getSeconds()}`);
console.log();

console.log("OBSERVATION:");
console.log("When parsing '1990-03-10T12:55:00' without a timezone,");
console.log("JavaScript interprets it as LOCAL TIME, not UTC!");
console.log();
console.log("The profile has time '12:55:00' which should be interpreted");
console.log("as the LOCAL time in Kurnool, India (UTC+5:30).");
console.log();
console.log("To calculate correctly, we need:");
console.log("1. Either store timezone in profile");
console.log("2. Or clarify if stored time is local or UTC");
console.log("3. Convert to UTC before calculating Julian Day");
