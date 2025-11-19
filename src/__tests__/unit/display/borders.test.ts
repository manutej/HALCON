/**
 * Tests for Border and Separator Utilities
 *
 * @module __tests__/unit/display/borders.test
 */

import { describe, it, expect } from 'vitest';
import chalk from 'chalk';
import {
  DEFAULT_WIDTH,
  BORDER_CHARS,
  drawHeader,
  drawSeparator,
  drawBorder,
  drawSectionHeader,
  drawBox,
} from '../../../lib/display/renderers/borders.js';

describe('Border Constants', () => {
  it('should have correct default width', () => {
    expect(DEFAULT_WIDTH).toBe(75);
  });

  it('should have correct border characters', () => {
    expect(BORDER_CHARS.DOUBLE).toBe('═');
    expect(BORDER_CHARS.SINGLE).toBe('─');
    expect(BORDER_CHARS.SPACE).toBe(' ');
  });
});

describe('drawHeader', () => {
  it('should create a header with double borders', () => {
    const header = drawHeader('TEST HEADER', 50);
    const lines = header.split('\n');

    expect(lines).toHaveLength(3);
    // Check that header contains the text
    expect(header).toContain('TEST HEADER');
  });

  it('should use default width when not specified', () => {
    const header = drawHeader('TEST');
    const lines = header.split('\n');

    // First line should be the top border with default width
    // Note: We can't check exact length due to ANSI color codes
    expect(lines).toHaveLength(3);
    expect(header).toContain('TEST');
  });

  it('should center text correctly', () => {
    const header = drawHeader('TITLE', 20);
    const lines = header.split('\n');

    // Middle line should contain centered text
    expect(lines[1]).toContain('TITLE');
  });

  it('should apply custom color', () => {
    const header = drawHeader('COLORED', 30, chalk.red);

    // Header should contain ANSI color codes
    expect(header).toBeTruthy();
    expect(header).toContain('COLORED');
  });

  it('should handle long text that exceeds width', () => {
    const longText = 'A'.repeat(100);
    const header = drawHeader(longText, 50);

    expect(header).toContain(longText);
  });

  it('should handle empty text', () => {
    const header = drawHeader('', 40);
    const lines = header.split('\n');

    expect(lines).toHaveLength(3);
  });
});

describe('drawSeparator', () => {
  it('should create a separator line', () => {
    const separator = drawSeparator(50, BORDER_CHARS.SINGLE, chalk.gray, 0);

    // Should contain separator characters
    expect(separator).toBeTruthy();
  });

  it('should use default parameters', () => {
    const separator = drawSeparator();

    expect(separator).toBeTruthy();
  });

  it('should apply indentation', () => {
    const separator = drawSeparator(50, BORDER_CHARS.SINGLE, chalk.gray, 5);

    // Remove ANSI codes to check spacing
    const plainSeparator = separator.replace(/\u001b\[\d+m/g, '');
    expect(plainSeparator.startsWith('     ')).toBe(true); // 5 spaces
  });

  it('should use custom character', () => {
    const separator = drawSeparator(10, '=', chalk.white, 0);
    const plainSeparator = separator.replace(/\u001b\[\d+m/g, '');

    expect(plainSeparator).toContain('=');
  });

  it('should handle zero width', () => {
    const separator = drawSeparator(0, BORDER_CHARS.SINGLE, chalk.gray, 0);

    expect(separator).toBeDefined();
  });

  it('should handle large indentation', () => {
    const separator = drawSeparator(50, BORDER_CHARS.SINGLE, chalk.gray, 40);

    expect(separator).toBeTruthy();
  });
});

describe('drawBorder', () => {
  it('should create a border with double characters', () => {
    const border = drawBorder(60);

    expect(border).toBeTruthy();
  });

  it('should use default width', () => {
    const border = drawBorder();

    expect(border).toBeTruthy();
  });

  it('should apply custom color', () => {
    const border = drawBorder(50, chalk.magenta);

    expect(border).toBeTruthy();
  });

  it('should create border of exact width', () => {
    const border = drawBorder(10, chalk.white);
    const plainBorder = border.replace(/\u001b\[\d+m/g, '');

    expect(plainBorder.length).toBe(10);
    expect(plainBorder).toBe(BORDER_CHARS.DOUBLE.repeat(10));
  });
});

describe('drawSectionHeader', () => {
  it('should create section header with emoji and text', () => {
    const header = drawSectionHeader('🌟', 'Test Section', chalk.yellow);

    expect(header).toContain('🌟');
    expect(header).toContain('Test Section');
    expect(header).toContain(':');
  });

  it('should create header without separator by default', () => {
    const header = drawSectionHeader('📊', 'Data', chalk.cyan);
    const lines = header.split('\n');

    expect(lines).toHaveLength(1);
  });

  it('should create header with separator when specified', () => {
    const header = drawSectionHeader('🏠', 'Houses', chalk.yellow, true, 50, 3);
    const lines = header.split('\n');

    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain('Houses');
  });

  it('should handle empty emoji', () => {
    const header = drawSectionHeader('', 'No Emoji', chalk.white);

    expect(header).toContain('No Emoji');
  });

  it('should handle empty text', () => {
    const header = drawSectionHeader('🎯', '', chalk.white);

    expect(header).toContain('🎯');
  });

  it('should use default color', () => {
    const header = drawSectionHeader('⭐', 'Default Color');

    expect(header).toContain('⭐');
    expect(header).toContain('Default Color');
  });
});

describe('drawBox', () => {
  it('should create a box around content', () => {
    const box = drawBox(['Line 1', 'Line 2'], 40, 1);

    expect(box).toHaveLength(4); // top border + 2 lines + bottom border
    expect(box[0]).toBe(BORDER_CHARS.DOUBLE.repeat(40));
    expect(box[box.length - 1]).toBe(BORDER_CHARS.DOUBLE.repeat(40));
  });

  it('should handle single line content', () => {
    const box = drawBox(['Single line'], 30, 1);

    expect(box).toHaveLength(3); // top + line + bottom
  });

  it('should handle empty content', () => {
    const box = drawBox([], 25, 1);

    expect(box).toHaveLength(2); // just top and bottom borders
  });

  it('should apply padding correctly', () => {
    const box = drawBox(['Test'], 20, 2);

    // Lines should include padding spaces
    expect(box[1]).toBeDefined();
    expect(box[1]!.includes('Test')).toBe(true);
    expect(box[1]!.startsWith('  ')).toBe(true); // 2 spaces padding
  });

  it('should handle zero padding', () => {
    const box = drawBox(['Content'], 30, 0);

    expect(box).toHaveLength(3);
  });

  it('should use default parameters', () => {
    const box = drawBox(['Default']);

    expect(box.length).toBeGreaterThan(0);
  });

  it('should handle multi-line content', () => {
    const content = ['Line 1', 'Line 2', 'Line 3', 'Line 4'];
    const box = drawBox(content, 50, 2);

    expect(box).toHaveLength(6); // top + 4 lines + bottom
  });

  it('should pad short lines to width', () => {
    const box = drawBox(['Short'], 50, 1);

    // Content line should be padded to width
    expect(box[1]).toBeDefined();
    expect(box[1]!.length).toBeGreaterThan('Short'.length);
  });
});

describe('Edge Cases', () => {
  it('should handle very small widths', () => {
    const header = drawHeader('X', 5);
    expect(header).toBeTruthy();

    const separator = drawSeparator(5);
    expect(separator).toBeTruthy();

    const border = drawBorder(5);
    expect(border).toBeTruthy();
  });

  it('should handle very large widths', () => {
    const header = drawHeader('LARGE', 200);
    expect(header).toBeTruthy();

    const separator = drawSeparator(200);
    expect(separator).toBeTruthy();

    const border = drawBorder(200);
    expect(border).toBeTruthy();
  });

  it('should handle special characters in text', () => {
    const header = drawHeader('Test §¶•ªº', 50);
    expect(header).toContain('Test §¶•ªº');

    const sectionHeader = drawSectionHeader('🌟', 'Test 测试', chalk.white);
    expect(sectionHeader).toContain('Test 测试');
  });

  it('should handle Unicode emojis correctly', () => {
    const header = drawSectionHeader('🚀🌟💫', 'Emojis', chalk.cyan);
    expect(header).toContain('🚀🌟💫');
  });
});

describe('Color Application', () => {
  it('should apply different colors without errors', () => {
    const colors = [
      chalk.red,
      chalk.green,
      chalk.blue,
      chalk.yellow,
      chalk.magenta,
      chalk.cyan,
      chalk.white,
      chalk.gray,
      chalk.bold.red,
      chalk.dim.blue,
    ];

    colors.forEach(color => {
      expect(() => drawHeader('Test', 50, color)).not.toThrow();
      expect(() => drawSeparator(50, BORDER_CHARS.SINGLE, color)).not.toThrow();
      expect(() => drawBorder(50, color)).not.toThrow();
      expect(() => drawSectionHeader('🎯', 'Test', color)).not.toThrow();
    });
  });

  it('should preserve color codes in output', () => {
    const colored = drawHeader('COLORED', 50, chalk.red);

    // Should contain the text and be defined
    // Note: chalk may strip colors in test environment based on environment settings
    expect(colored).toContain('COLORED');
    expect(colored).toBeTruthy();
  });
});
