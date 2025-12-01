#!/usr/bin/env node
/**
 * HALCON Analysis Command
 * Generate comprehensive astrological snapshot analysis using Claude AI
 *
 * Combines natal chart, transits, progressions, and aspects into a unified analysis
 *
 * @module commands/analysis
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { DateTime } from 'luxon';
import Anthropic from '@anthropic-ai/sdk';
import { calculateChart } from '../lib/swisseph/index.js';
import type { ChartOptions, ChartData } from '../lib/swisseph/types.js';
import { calculateProgressedDate, calculateAge } from '../lib/progressions/index.js';
import { loadProfileOrInput } from '../lib/middleware/profile-loader.js';
import { formatDegree } from '../lib/display/formatters.js';

const program = new Command();

interface AnalysisData {
  profile: {
    name?: string;
    birthDate: Date;
    location: {
      name: string;
      latitude: number;
      longitude: number;
    };
  };
  natal: ChartData;
  transits: ChartData;
  progressed: ChartData;
  progression: {
    age: number;
    progressedDate: Date;
  };
  aspects: Array<{
    planet1: string;
    planet2: string;
    aspect: string;
    orb: number;
  }>;
}

/**
 * Calculate aspects between planets
 */
function calculateAspects(bodies: ChartData['bodies'], orb: number = 8): AnalysisData['aspects'] {
  const aspects: AnalysisData['aspects'] = [];
  const aspectTypes = [
    { name: 'Conjunction', angle: 0, symbol: '☌' },
    { name: 'Sextile', angle: 60, symbol: '⚹' },
    { name: 'Square', angle: 90, symbol: '□' },
    { name: 'Trine', angle: 120, symbol: '△' },
    { name: 'Opposition', angle: 180, symbol: '☍' }
  ];

  const planetKeys = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

  for (let i = 0; i < planetKeys.length; i++) {
    for (let j = i + 1; j < planetKeys.length; j++) {
      const p1 = bodies[planetKeys[i] as keyof typeof bodies];
      const p2 = bodies[planetKeys[j] as keyof typeof bodies];

      if (!p1 || !p2) continue;

      let diff = Math.abs(p1.longitude - p2.longitude);
      if (diff > 180) diff = 360 - diff;

      for (const aspectType of aspectTypes) {
        const aspectOrb = Math.abs(diff - aspectType.angle);
        if (aspectOrb <= orb) {
          aspects.push({
            planet1: p1.name,
            planet2: p2.name,
            aspect: `${aspectType.symbol} ${aspectType.name}`,
            orb: Math.round(aspectOrb * 100) / 100
          });
        }
      }
    }
  }

  return aspects.sort((a, b) => a.orb - b.orb);
}

/**
 * Format chart data for Claude analysis
 */
function formatDataForAnalysis(data: AnalysisData): string {
  const { profile, natal, transits, progressed, progression, aspects } = data;

  let output = `# Astrological Data for Analysis\n\n`;

  // Profile info
  output += `## Subject Information\n`;
  output += `- Name: ${profile.name || 'Unknown'}\n`;
  output += `- Birth Date: ${profile.birthDate.toISOString().split('T')[0]}\n`;
  output += `- Birth Location: ${profile.location.name} (${profile.location.latitude.toFixed(2)}°N, ${profile.location.longitude.toFixed(2)}°E)\n`;
  output += `- Current Age: ${progression.age.toFixed(1)} years\n\n`;

  // Natal Chart
  output += `## Natal Chart\n`;
  output += `| Planet | Sign | Degree | Retrograde |\n`;
  output += `|--------|------|--------|------------|\n`;
  const planetOrder = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  for (const key of planetOrder) {
    const body = natal.bodies[key as keyof typeof natal.bodies];
    if (body) {
      output += `| ${body.name} | ${body.sign} | ${body.signDegree.toFixed(2)}° | ${body.retrograde ? 'R' : ''} |\n`;
    }
  }
  output += `\n### Natal Angles\n`;
  output += `- Ascendant: ${formatDegree(natal.angles.ascendant)}\n`;
  output += `- Midheaven (MC): ${formatDegree(natal.angles.midheaven)}\n`;
  output += `- Descendant: ${formatDegree(natal.angles.descendant)}\n`;
  output += `- IC: ${formatDegree(natal.angles.imumCoeli)}\n\n`;

  // Current Transits
  output += `## Current Transits (${new Date().toISOString().split('T')[0]})\n`;
  output += `| Planet | Sign | Degree | Retrograde |\n`;
  output += `|--------|------|--------|------------|\n`;
  for (const key of planetOrder) {
    const body = transits.bodies[key as keyof typeof transits.bodies];
    if (body) {
      output += `| ${body.name} | ${body.sign} | ${body.signDegree.toFixed(2)}° | ${body.retrograde ? 'R' : ''} |\n`;
    }
  }
  output += `\n`;

  // Progressions
  output += `## Secondary Progressions (Age ${progression.age.toFixed(1)})\n`;
  output += `Progressed Date: ${progression.progressedDate.toISOString().split('T')[0]}\n\n`;
  output += `| Planet | Natal | Progressed | Movement |\n`;
  output += `|--------|-------|------------|----------|\n`;
  for (const key of planetOrder) {
    const natalBody = natal.bodies[key as keyof typeof natal.bodies];
    const progBody = progressed.bodies[key as keyof typeof progressed.bodies];
    if (natalBody && progBody) {
      const movement = progBody.longitude - natalBody.longitude;
      const movementStr = movement >= 0 ? `+${movement.toFixed(2)}°` : `${movement.toFixed(2)}°`;
      output += `| ${natalBody.name} | ${natalBody.signDegree.toFixed(1)}° ${natalBody.sign} | ${progBody.signDegree.toFixed(1)}° ${progBody.sign} | ${movementStr} |\n`;
    }
  }
  output += `\n### Progressed Angles\n`;
  output += `- Progressed ASC: ${formatDegree(progressed.angles.ascendant)}\n`;
  output += `- Progressed MC: ${formatDegree(progressed.angles.midheaven)}\n\n`;

  // Major Aspects
  output += `## Natal Aspects (top 10 by orb)\n`;
  output += `| Planet 1 | Aspect | Planet 2 | Orb |\n`;
  output += `|----------|--------|----------|-----|\n`;
  for (const aspect of aspects.slice(0, 10)) {
    output += `| ${aspect.planet1} | ${aspect.aspect} | ${aspect.planet2} | ${aspect.orb}° |\n`;
  }

  return output;
}

/**
 * Generate analysis using Claude
 */
async function generateAnalysis(data: AnalysisData, analysisType: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  const client = new Anthropic({ apiKey });

  const formattedData = formatDataForAnalysis(data);

  const systemPrompt = `You are an expert astrologer providing insightful, practical analysis. Your interpretations blend traditional and modern techniques with psychological insight.

Key principles:
1. Focus on the most significant patterns and themes
2. Identify key transits affecting the natal chart NOW
3. Note important progressed positions and their implications
4. Be specific about timing when relevant
5. Provide actionable insights, not fatalistic predictions
6. Keep the tone empowering and balanced
7. Use clear, accessible language

Format your response with clear sections and bullet points for readability.`;

  const userPrompt = `${formattedData}

Please provide a ${analysisType} astrological analysis based on this data. Focus on:

1. **Current Energy Snapshot**: What's the dominant theme right now based on transits to the natal chart?

2. **Key Transit Highlights**: Identify the 3-5 most significant current transits and their effects.

3. **Progression Insights**: What major progressed positions are active and what do they indicate?

4. **Opportunities & Challenges**: What should the subject focus on or be aware of?

5. **Practical Guidance**: Specific, actionable advice for the coming weeks.

Keep the analysis concise but insightful (around 500-700 words).`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [
      { role: 'user', content: userPrompt }
    ],
    system: systemPrompt
  });

  const textBlock = response.content.find(block => block.type === 'text');
  return textBlock ? textBlock.text : 'Analysis generation failed.';
}

/**
 * Display raw data summary (when no API key)
 */
function displayDataSummary(data: AnalysisData): void {
  const { profile, natal, transits, progressed, progression, aspects } = data;

  console.log(chalk.bold.cyan('\n' + '═'.repeat(75)));
  console.log(chalk.bold.white('                    HALCON ASTROLOGICAL SNAPSHOT'));
  console.log(chalk.bold.cyan('═'.repeat(75) + '\n'));

  // Profile
  console.log(chalk.bold.yellow(`👤 Profile: ${profile.name || 'Unknown'}`));
  console.log(chalk.gray(`   Birth: ${profile.birthDate.toISOString().split('T')[0]} | ${profile.location.name}`));
  console.log(chalk.gray(`   Current Age: ${progression.age.toFixed(1)} years\n`));

  // Key Natal Placements
  console.log(chalk.bold.yellow('🌟 Key Natal Placements:'));
  const sun = natal.bodies.sun;
  const moon = natal.bodies.moon;
  console.log(chalk.white(`   ☉ Sun: ${sun?.signDegree.toFixed(0)}° ${sun?.sign}`));
  console.log(chalk.white(`   ☽ Moon: ${moon?.signDegree.toFixed(0)}° ${moon?.sign}`));
  console.log(chalk.white(`   ASC: ${formatDegree(natal.angles.ascendant)}`));
  console.log(chalk.white(`   MC: ${formatDegree(natal.angles.midheaven)}\n`));

  // Current Transits
  console.log(chalk.bold.yellow('🌌 Current Transits (Key Planets):'));
  const transitPlanets = ['saturn', 'jupiter', 'uranus', 'neptune', 'pluto'];
  for (const key of transitPlanets) {
    const body = transits.bodies[key as keyof typeof transits.bodies];
    if (body) {
      const retro = body.retrograde ? chalk.red(' R') : '';
      console.log(chalk.white(`   ${body.name.padEnd(8)}: ${body.signDegree.toFixed(1).padStart(5)}° ${body.sign.padEnd(11)}${retro}`));
    }
  }
  console.log();

  // Progressed Highlights
  console.log(chalk.bold.yellow('🔮 Progressed Positions:'));
  const progSun = progressed.bodies.sun;
  const progMoon = progressed.bodies.moon;
  console.log(chalk.white(`   ☉ Prog Sun: ${progSun?.signDegree.toFixed(1)}° ${progSun?.sign}`));
  console.log(chalk.white(`   ☽ Prog Moon: ${progMoon?.signDegree.toFixed(1)}° ${progMoon?.sign}`));
  console.log(chalk.white(`   Prog ASC: ${formatDegree(progressed.angles.ascendant)}`));
  console.log(chalk.white(`   Prog MC: ${formatDegree(progressed.angles.midheaven)}\n`));

  // Top Aspects
  console.log(chalk.bold.yellow('⚡ Strongest Natal Aspects:'));
  for (const aspect of aspects.slice(0, 5)) {
    console.log(chalk.white(`   ${aspect.planet1.padEnd(8)} ${aspect.aspect.padEnd(14)} ${aspect.planet2.padEnd(8)} (${aspect.orb}°)`));
  }
  console.log();

  console.log(chalk.bold.cyan('═'.repeat(75)));
  console.log(chalk.gray('💡 Set ANTHROPIC_API_KEY for AI-powered interpretation'));
  console.log(chalk.bold.cyan('═'.repeat(75) + '\n'));
}

program
  .name('halcon-analysis')
  .description('Generate comprehensive astrological snapshot analysis')
  .version('0.1.0')
  .argument('[profile]', 'Profile name', '')
  .option('--type <type>', 'Analysis type (general, career, love, spiritual)', 'general')
  .option('--json', 'Output raw data as JSON')
  .option('--data-only', 'Show data summary without AI analysis')
  .action(async (profileArg, options) => {
    try {
      if (!profileArg) {
        console.error(chalk.red('❌ Error: Profile name is required'));
        console.log(chalk.gray('   Usage: halcon analysis <profile>'));
        console.log(chalk.gray('   Example: halcon analysis manu'));
        process.exit(1);
      }

      console.log(chalk.cyan('\n🔮 Gathering astrological data...\n'));

      // Load profile
      const { dateTime: birthDateTime, location, profileName } = await loadProfileOrInput({
        dateArg: profileArg,
        timeArg: '',
        latitude: undefined,
        longitude: undefined,
        location: undefined
      });

      const chartOptions: ChartOptions = {
        houseSystem: 'placidus',
        includeChiron: true,
        includeLilith: true,
        includeNodes: true
      };

      // Calculate natal chart
      console.log(chalk.gray('   ✓ Calculating natal chart...'));
      const natal = await calculateChart(birthDateTime, location, chartOptions);

      // Calculate current transits
      console.log(chalk.gray('   ✓ Calculating current transits...'));
      const transits = await calculateChart(new Date(), { latitude: 0, longitude: 0, name: 'Greenwich' }, chartOptions);

      // Calculate progressions
      console.log(chalk.gray('   ✓ Calculating progressions...'));
      const targetDate = new Date();
      const progression = calculateProgressedDate(birthDateTime, targetDate);
      const age = calculateAge(birthDateTime, targetDate);
      const progressed = await calculateChart(progression.progressedDate, location, chartOptions);

      // Calculate aspects
      console.log(chalk.gray('   ✓ Calculating aspects...\n'));
      const aspects = calculateAspects(natal.bodies);

      const analysisData: AnalysisData = {
        profile: {
          name: profileName,
          birthDate: birthDateTime,
          location: {
            name: location.name || 'Unknown',
            latitude: location.latitude,
            longitude: location.longitude
          }
        },
        natal,
        transits,
        progressed,
        progression: {
          age,
          progressedDate: progression.progressedDate
        },
        aspects
      };

      if (options.json) {
        console.log(JSON.stringify(analysisData, null, 2));
        return;
      }

      if (options.dataOnly || !process.env.ANTHROPIC_API_KEY) {
        displayDataSummary(analysisData);
        return;
      }

      // Generate AI analysis
      console.log(chalk.cyan('🤖 Generating AI analysis...\n'));
      const analysis = await generateAnalysis(analysisData, options.type);

      console.log(chalk.bold.cyan('═'.repeat(75)));
      console.log(chalk.bold.white('                    HALCON ASTROLOGICAL ANALYSIS'));
      console.log(chalk.bold.cyan('═'.repeat(75) + '\n'));
      console.log(chalk.white(analysis));
      console.log(chalk.bold.cyan('\n' + '═'.repeat(75)));
      console.log(chalk.green('✨ Analysis complete!'));
      console.log(chalk.bold.cyan('═'.repeat(75) + '\n'));

    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse();
}

export { program };
