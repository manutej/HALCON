/**
 * Tests for Table Builder
 *
 * @module __tests__/unit/display/table-builder.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import chalk from 'chalk';
import {
  TableBuilder,
  createTable,
  type ColumnDefinition,
} from '../../../lib/display/renderers/table-builder.js';

describe('TableBuilder - Basic Functionality', () => {
  let builder: TableBuilder;

  beforeEach(() => {
    builder = new TableBuilder();
  });

  it('should create an empty table', () => {
    const table = builder.build();
    expect(table).toBeDefined();
  });

  it('should add columns', () => {
    builder.addColumn({ header: 'Name', width: 15, alignment: 'left' });
    builder.addColumn({ header: 'Value', width: 10, alignment: 'right' });

    const table = builder.build();
    expect(table).toContain('Name');
    expect(table).toContain('Value');
  });

  it('should add multiple columns at once', () => {
    const columns: ColumnDefinition[] = [
      { header: 'Col1', width: 10, alignment: 'left' },
      { header: 'Col2', width: 10, alignment: 'center' },
      { header: 'Col3', width: 10, alignment: 'right' },
    ];

    builder.addColumns(columns);
    const table = builder.build();

    expect(table).toContain('Col1');
    expect(table).toContain('Col2');
    expect(table).toContain('Col3');
  });

  it('should add rows', () => {
    builder
      .addColumn({ header: 'Planet', width: 15, alignment: 'left' })
      .addColumn({ header: 'Sign', width: 12, alignment: 'left' })
      .addRow(['Sun', 'Aries'])
      .addRow(['Moon', 'Taurus']);

    const table = builder.build();

    expect(table).toContain('Sun');
    expect(table).toContain('Moon');
    expect(table).toContain('Aries');
    expect(table).toContain('Taurus');
  });

  it('should add multiple rows at once', () => {
    builder
      .addColumn({ header: 'Name', width: 10, alignment: 'left' })
      .addRows([
        ['Row1'],
        ['Row2'],
        ['Row3'],
      ]);

    const table = builder.build();

    expect(table).toContain('Row1');
    expect(table).toContain('Row2');
    expect(table).toContain('Row3');
  });
});

describe('TableBuilder - Alignment', () => {
  let builder: TableBuilder;

  beforeEach(() => {
    builder = new TableBuilder();
  });

  it('should align text left', () => {
    builder
      .addColumn({ header: 'Left', width: 10, alignment: 'left' })
      .setShowTopSeparator(false)
      .setShowBottomSeparator(false)
      .addRow(['Test']);

    const table = builder.build();
    expect(table).toBeTruthy();
  });

  it('should align text right', () => {
    builder
      .addColumn({ header: 'Right', width: 10, alignment: 'right' })
      .setShowTopSeparator(false)
      .setShowBottomSeparator(false)
      .addRow(['Test']);

    const table = builder.build();
    expect(table).toBeTruthy();
  });

  it('should align text center', () => {
    builder
      .addColumn({ header: 'Center', width: 10, alignment: 'center' })
      .setShowTopSeparator(false)
      .setShowBottomSeparator(false)
      .addRow(['Test']);

    const table = builder.build();
    expect(table).toBeTruthy();
  });

  it('should handle mixed alignments', () => {
    builder
      .addColumn({ header: 'Left', width: 10, alignment: 'left' })
      .addColumn({ header: 'Center', width: 10, alignment: 'center' })
      .addColumn({ header: 'Right', width: 10, alignment: 'right' })
      .addRow(['L', 'C', 'R']);

    const table = builder.build();
    expect(table).toContain('L');
    expect(table).toContain('C');
    expect(table).toContain('R');
  });
});

describe('TableBuilder - Indentation', () => {
  let builder: TableBuilder;

  beforeEach(() => {
    builder = new TableBuilder();
  });

  it('should apply indentation', () => {
    builder
      .addColumn({ header: 'Test', width: 10, alignment: 'left' })
      .setIndent(5)
      .addRow(['Data']);

    const table = builder.build();
    const lines = table.split('\n');

    // Each line should start with 5 spaces (when color codes are removed)
    lines.forEach(line => {
      const plainLine = line.replace(/\u001b\[\d+m/g, '');
      if (plainLine.trim()) {
        expect(plainLine.startsWith('     ')).toBe(true);
      }
    });
  });

  it('should handle zero indentation', () => {
    builder
      .addColumn({ header: 'Test', width: 10, alignment: 'left' })
      .setIndent(0)
      .addRow(['Data']);

    const table = builder.build();
    expect(table).toBeTruthy();
  });

  it('should handle large indentation', () => {
    builder
      .addColumn({ header: 'Test', width: 10, alignment: 'left' })
      .setIndent(20)
      .addRow(['Data']);

    const table = builder.build();
    expect(table).toBeTruthy();
  });
});

describe('TableBuilder - Colors', () => {
  let builder: TableBuilder;

  beforeEach(() => {
    builder = new TableBuilder();
  });

  it('should apply header color', () => {
    builder
      .addColumn({ header: 'Test', width: 10, alignment: 'left' })
      .setHeaderColor(chalk.yellow)
      .addRow(['Data']);

    const table = builder.build();
    expect(table).toBeTruthy();
  });

  it('should apply separator color', () => {
    builder
      .addColumn({ header: 'Test', width: 10, alignment: 'left' })
      .setSeparatorColor(chalk.blue)
      .addRow(['Data']);

    const table = builder.build();
    expect(table).toBeTruthy();
  });

  it('should apply row color', () => {
    builder
      .addColumn({ header: 'Test', width: 10, alignment: 'left' })
      .setRowColor(chalk.green)
      .addRow(['Data']);

    const table = builder.build();
    expect(table).toBeTruthy();
  });

  it('should apply multiple colors', () => {
    builder
      .addColumn({ header: 'Test', width: 10, alignment: 'left' })
      .setHeaderColor(chalk.cyan)
      .setSeparatorColor(chalk.gray)
      .setRowColor(chalk.white)
      .addRow(['Data']);

    const table = builder.build();
    expect(table).toBeTruthy();
  });
});

describe('TableBuilder - Header and Separators', () => {
  let builder: TableBuilder;

  beforeEach(() => {
    builder = new TableBuilder();
  });

  it('should show header by default', () => {
    builder
      .addColumn({ header: 'Header', width: 10, alignment: 'left' })
      .addRow(['Data']);

    const table = builder.build();
    expect(table).toContain('Header');
  });

  it('should hide header when disabled', () => {
    builder
      .addColumn({ header: 'Header', width: 10, alignment: 'left' })
      .setShowHeader(false)
      .addRow(['Data']);

    const table = builder.build();
    expect(table).toContain('Data');
  });

  it('should show top separator by default', () => {
    builder
      .addColumn({ header: 'Test', width: 10, alignment: 'left' })
      .addRow(['Data']);

    const table = builder.build();
    const lines = table.split('\n');
    expect(lines.length).toBeGreaterThan(2);
  });

  it('should hide top separator when disabled', () => {
    builder
      .addColumn({ header: 'Test', width: 10, alignment: 'left' })
      .setShowTopSeparator(false)
      .addRow(['Data']);

    const table = builder.build();
    expect(table).toBeTruthy();
  });

  it('should show bottom separator by default', () => {
    builder
      .addColumn({ header: 'Test', width: 10, alignment: 'left' })
      .addRow(['Data']);

    const table = builder.build();
    const lines = table.split('\n');
    expect(lines.length).toBeGreaterThan(2);
  });

  it('should hide bottom separator when disabled', () => {
    builder
      .addColumn({ header: 'Test', width: 10, alignment: 'left' })
      .setShowBottomSeparator(false)
      .addRow(['Data']);

    const table = builder.build();
    expect(table).toBeTruthy();
  });

  it('should hide all separators and header', () => {
    builder
      .addColumn({ header: 'Test', width: 10, alignment: 'left' })
      .setShowHeader(false)
      .setShowTopSeparator(false)
      .setShowBottomSeparator(false)
      .addRow(['Data']);

    const table = builder.build();
    const lines = table.split('\n');
    expect(lines.length).toBe(1);
    expect(table).toContain('Data');
  });
});

describe('TableBuilder - Fluent Interface', () => {
  it('should support method chaining', () => {
    const table = new TableBuilder()
      .addColumn({ header: 'Name', width: 15, alignment: 'left' })
      .addColumn({ header: 'Value', width: 10, alignment: 'right' })
      .setIndent(3)
      .setHeaderColor(chalk.yellow)
      .setSeparatorColor(chalk.gray)
      .setRowColor(chalk.white)
      .addRow(['Item 1', '100'])
      .addRow(['Item 2', '200'])
      .build();

    expect(table).toContain('Name');
    expect(table).toContain('Value');
    expect(table).toContain('Item 1');
    expect(table).toContain('Item 2');
  });
});

describe('TableBuilder - Build Methods', () => {
  let builder: TableBuilder;

  beforeEach(() => {
    builder = new TableBuilder();
  });

  it('should build as string', () => {
    builder
      .addColumn({ header: 'Test', width: 10, alignment: 'left' })
      .addRow(['Data']);

    const table = builder.build();
    expect(typeof table).toBe('string');
  });

  it('should build as array of lines', () => {
    builder
      .addColumn({ header: 'Test', width: 10, alignment: 'left' })
      .addRow(['Data']);

    const lines = builder.buildLines();
    expect(Array.isArray(lines)).toBe(true);
    expect(lines.length).toBeGreaterThan(0);
  });

  it('should produce consistent output between build methods', () => {
    builder
      .addColumn({ header: 'Test', width: 10, alignment: 'left' })
      .addRow(['Data']);

    const stringOutput = builder.build();
    const arrayOutput = builder.buildLines().join('\n');

    expect(stringOutput).toBe(arrayOutput);
  });
});

describe('TableBuilder - Reset and Clear', () => {
  let builder: TableBuilder;

  beforeEach(() => {
    builder = new TableBuilder();
  });

  it('should clear rows', () => {
    builder
      .addColumn({ header: 'Test', width: 10, alignment: 'left' })
      .addRow(['Data1'])
      .addRow(['Data2'])
      .clearRows()
      .addRow(['Data3']);

    const table = builder.build();
    expect(table).not.toContain('Data1');
    expect(table).not.toContain('Data2');
    expect(table).toContain('Data3');
  });

  it('should clear columns', () => {
    builder
      .addColumn({ header: 'Col1', width: 10, alignment: 'left' })
      .addRow(['Data1'])
      .clearColumns()
      .addColumn({ header: 'Col2', width: 10, alignment: 'left' })
      .addRow(['Data2']);

    const table = builder.build();
    expect(table).not.toContain('Col1');
    expect(table).toContain('Col2');
  });

  it('should reset builder to initial state', () => {
    builder
      .addColumn({ header: 'Test', width: 10, alignment: 'left' })
      .setIndent(5)
      .setHeaderColor(chalk.red)
      .addRow(['Data'])
      .reset();

    const table = builder.build();
    // Should produce minimal output after reset
    expect(table).toBeDefined();
  });
});

describe('createTable Helper Function', () => {
  it('should create a table from column definitions and rows', () => {
    const columns: ColumnDefinition[] = [
      { header: 'Planet', width: 12, alignment: 'left' },
      { header: 'Sign', width: 15, alignment: 'left' },
    ];

    const rows = [
      ['Sun', 'Aries'],
      ['Moon', 'Taurus'],
    ];

    const table = createTable(columns, rows);

    expect(table).toContain('Planet');
    expect(table).toContain('Sign');
    expect(table).toContain('Sun');
    expect(table).toContain('Moon');
    expect(table).toContain('Aries');
    expect(table).toContain('Taurus');
  });

  it('should apply options', () => {
    const columns: ColumnDefinition[] = [
      { header: 'Name', width: 10, alignment: 'left' },
    ];

    const rows = [['Test']];

    const table = createTable(columns, rows, {
      indent: 5,
      headerColor: chalk.yellow,
      separatorColor: chalk.blue,
      rowColor: chalk.green,
      showHeader: true,
    });

    expect(table).toContain('Test');
  });

  it('should handle empty rows', () => {
    const columns: ColumnDefinition[] = [
      { header: 'Empty', width: 10, alignment: 'left' },
    ];

    const table = createTable(columns, []);
    expect(table).toContain('Empty');
  });

  it('should handle minimal configuration', () => {
    const columns: ColumnDefinition[] = [
      { header: 'Simple', width: 10, alignment: 'left' },
    ];

    const rows = [['Data']];

    const table = createTable(columns, rows);
    expect(table).toContain('Simple');
    expect(table).toContain('Data');
  });
});

describe('Edge Cases', () => {
  let builder: TableBuilder;

  beforeEach(() => {
    builder = new TableBuilder();
  });

  it('should handle empty cells', () => {
    builder
      .addColumn({ header: 'Test', width: 10, alignment: 'left' })
      .addRow(['']);

    const table = builder.build();
    expect(table).toBeDefined();
  });

  it('should handle cells with special characters', () => {
    builder
      .addColumn({ header: 'Special', width: 20, alignment: 'left' })
      .addRow(['Test §¶•ªº']);

    const table = builder.build();
    expect(table).toContain('Test §¶•ªº');
  });

  it('should handle cells with Unicode', () => {
    builder
      .addColumn({ header: 'Unicode', width: 20, alignment: 'left' })
      .addRow(['测试 Test 🌟']);

    const table = builder.build();
    expect(table).toContain('测试 Test 🌟');
  });

  it('should handle cells longer than column width', () => {
    builder
      .addColumn({ header: 'Short', width: 5, alignment: 'left' })
      .addRow(['Very Long Text']);

    const table = builder.build();
    expect(table).toBeDefined();
  });

  it('should handle mismatched row length', () => {
    builder
      .addColumn({ header: 'Col1', width: 10, alignment: 'left' })
      .addColumn({ header: 'Col2', width: 10, alignment: 'left' })
      .addRow(['Only One']);

    const table = builder.build();
    expect(table).toContain('Only One');
  });

  it('should handle extra cells in row', () => {
    builder
      .addColumn({ header: 'Col1', width: 10, alignment: 'left' })
      .addRow(['Cell1', 'Cell2', 'Cell3']);

    const table = builder.build();
    expect(table).toContain('Cell1');
  });

  it('should handle very small column widths', () => {
    builder
      .addColumn({ header: 'X', width: 1, alignment: 'left' })
      .addRow(['Y']);

    const table = builder.build();
    expect(table).toBeDefined();
  });

  it('should handle very large column widths', () => {
    builder
      .addColumn({ header: 'Wide', width: 200, alignment: 'left' })
      .addRow(['Data']);

    const table = builder.build();
    expect(table).toContain('Data');
  });
});

describe('Colored Cell Content', () => {
  let builder: TableBuilder;

  beforeEach(() => {
    builder = new TableBuilder();
  });

  it('should handle cells with ANSI color codes', () => {
    builder
      .addColumn({ header: 'Colored', width: 20, alignment: 'left' })
      .addRow([chalk.red('Red Text')]);

    const table = builder.build();
    expect(table).toBeTruthy();
  });

  it('should handle mixed colored and plain cells', () => {
    builder
      .addColumn({ header: 'Col1', width: 15, alignment: 'left' })
      .addColumn({ header: 'Col2', width: 15, alignment: 'left' })
      .addRow([chalk.green('Colored'), 'Plain']);

    const table = builder.build();
    expect(table).toBeTruthy();
  });
});
