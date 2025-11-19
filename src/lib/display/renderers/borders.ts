/**
 * Border and Separator Utilities for CLI Display
 *
 * Provides consistent border and separator rendering across all HALCON commands.
 * Default width is 75 characters to match existing command output.
 *
 * @module lib/display/renderers/borders
 */

import chalk from 'chalk';

/**
 * Default width for all borders and separators
 */
export const DEFAULT_WIDTH = 75;

/**
 * Border styles
 */
export const BORDER_CHARS = {
  DOUBLE: '═',
  SINGLE: '─',
  SPACE: ' ',
} as const;

/**
 * Draw a header with double borders and centered text
 *
 * @param text - Header text to display
 * @param width - Width of the header (default: 75)
 * @param color - Chalk color function to apply to borders
 * @returns Formatted header string with borders
 *
 * @example
 * ```typescript
 * const header = drawHeader('NATAL CHART');
 * console.log(header);
 * // Output:
 * // ═══════════════════════════════════════════════════════════════════════════
 * //                            NATAL CHART
 * // ═══════════════════════════════════════════════════════════════════════════
 * ```
 */
export function drawHeader(
  text: string,
  width: number = DEFAULT_WIDTH,
  color: (str: string) => string = chalk.bold.cyan
): string {
  const topBorder = color(BORDER_CHARS.DOUBLE.repeat(width));
  const bottomBorder = color(BORDER_CHARS.DOUBLE.repeat(width));

  // Center the text (handle text longer than width)
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  const centeredText = chalk.bold.white(BORDER_CHARS.SPACE.repeat(padding) + text);

  return `${topBorder}\n${centeredText}\n${bottomBorder}`;
}

/**
 * Draw a horizontal separator line
 *
 * @param width - Width of the separator (default: 75)
 * @param char - Character to use for the separator (default: single line)
 * @param color - Chalk color function to apply
 * @param indent - Number of spaces to indent (default: 0)
 * @returns Formatted separator string
 *
 * @example
 * ```typescript
 * const separator = drawSeparator(70, BORDER_CHARS.SINGLE, chalk.gray, 3);
 * console.log(separator);
 * // Output: "   ──────────────────────────────────────────────────────────────────"
 * ```
 */
export function drawSeparator(
  width: number = DEFAULT_WIDTH,
  char: string = BORDER_CHARS.SINGLE,
  color: (str: string) => string = chalk.gray,
  indent: number = 0
): string {
  const indentation = BORDER_CHARS.SPACE.repeat(indent);
  const charCount = Math.max(0, width - indent);
  return color(indentation + char.repeat(charCount));
}

/**
 * Draw a simple single-line border
 *
 * @param width - Width of the border (default: 75)
 * @param color - Chalk color function to apply
 * @returns Formatted border string
 *
 * @example
 * ```typescript
 * const border = drawBorder(75, chalk.cyan);
 * console.log(border);
 * ```
 */
export function drawBorder(
  width: number = DEFAULT_WIDTH,
  color: (str: string) => string = chalk.bold.cyan
): string {
  return color(BORDER_CHARS.DOUBLE.repeat(width));
}

/**
 * Draw a section header with emoji and optional separator
 *
 * @param emoji - Emoji to display before text
 * @param text - Section header text
 * @param color - Chalk color function to apply
 * @param showSeparator - Whether to show a separator after the header
 * @param separatorWidth - Width of the separator line
 * @param indent - Indentation for the separator
 * @returns Formatted section header
 *
 * @example
 * ```typescript
 * const header = drawSectionHeader('🌟', 'Planetary Positions', chalk.bold.yellow);
 * console.log(header);
 * // Output: "🌟 Planetary Positions:"
 * ```
 */
export function drawSectionHeader(
  emoji: string,
  text: string,
  color: (str: string) => string = chalk.bold.yellow,
  showSeparator: boolean = false,
  separatorWidth: number = 70,
  indent: number = 3
): string {
  const header = color(`${emoji} ${text}:`);

  if (showSeparator) {
    const separator = drawSeparator(separatorWidth, BORDER_CHARS.SINGLE, chalk.gray, indent);
    return `${header}\n${separator}`;
  }

  return header;
}

/**
 * Create a box around text content
 *
 * @param content - Content to wrap in a box
 * @param width - Width of the box (default: 75)
 * @param padding - Internal padding (default: 1)
 * @returns Array of strings representing the boxed content
 *
 * @example
 * ```typescript
 * const boxed = drawBox(['Line 1', 'Line 2'], 40, 1);
 * boxed.forEach(line => console.log(line));
 * ```
 */
export function drawBox(
  content: string[],
  width: number = DEFAULT_WIDTH,
  padding: number = 1
): string[] {
  const topBorder = BORDER_CHARS.DOUBLE.repeat(width);
  const bottomBorder = BORDER_CHARS.DOUBLE.repeat(width);
  const paddingSpaces = BORDER_CHARS.SPACE.repeat(padding);

  const lines = [topBorder];

  content.forEach(line => {
    const contentWidth = width - (padding * 2);
    const paddedLine = line.padEnd(contentWidth);
    lines.push(`${paddingSpaces}${paddedLine}${paddingSpaces}`);
  });

  lines.push(bottomBorder);

  return lines;
}
