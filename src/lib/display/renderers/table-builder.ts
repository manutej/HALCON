/**
 * Table Builder for CLI Display
 *
 * Provides a fluent interface for building formatted tables with:
 * - Column alignment (left, right, center)
 * - Padding and spacing
 * - Color support
 * - Header and separator rows
 *
 * @module lib/display/renderers/table-builder
 */

import chalk from 'chalk';
import { drawSeparator, BORDER_CHARS } from './borders.js';

/**
 * Column alignment options
 */
export type ColumnAlignment = 'left' | 'right' | 'center';

/**
 * Column definition
 */
export interface ColumnDefinition {
  /** Column header text */
  header: string;
  /** Column width in characters */
  width: number;
  /** Column alignment */
  alignment: ColumnAlignment;
  /** Whether to apply padding */
  padding?: number;
}

/**
 * Table row data
 */
export type TableRow = string[];

/**
 * Table Builder Class
 *
 * Fluent interface for building formatted tables.
 *
 * @example
 * ```typescript
 * const table = new TableBuilder()
 *   .addColumn({ header: 'Planet', width: 12, alignment: 'left' })
 *   .addColumn({ header: 'Longitude', width: 10, alignment: 'right' })
 *   .addColumn({ header: 'Sign', width: 15, alignment: 'left' })
 *   .setIndent(3)
 *   .addRow(['Sun', '120.45°', 'Leo'])
 *   .addRow(['Moon', '245.12°', 'Sagittarius'])
 *   .build();
 *
 * console.log(table);
 * ```
 */
export class TableBuilder {
  private columns: ColumnDefinition[] = [];
  private rows: TableRow[] = [];
  private indent: number = 0;
  private headerColor: (str: string) => string = chalk.gray;
  private separatorColor: (str: string) => string = chalk.gray;
  private rowColor: (str: string) => string = chalk.white;
  private showHeader: boolean = true;
  private showTopSeparator: boolean = true;
  private showBottomSeparator: boolean = true;

  /**
   * Add a column definition
   */
  addColumn(column: ColumnDefinition): this {
    this.columns.push({
      ...column,
      padding: column.padding ?? 1,
    });
    return this;
  }

  /**
   * Add multiple columns at once
   */
  addColumns(columns: ColumnDefinition[]): this {
    columns.forEach(col => this.addColumn(col));
    return this;
  }

  /**
   * Add a data row
   * Note: color parameter is reserved for future use to apply per-row colors
   */
  addRow(row: TableRow, _color?: (str: string) => string): this {
    this.rows.push(row);
    return this;
  }

  /**
   * Add multiple rows at once
   */
  addRows(rows: TableRow[]): this {
    rows.forEach(row => this.addRow(row));
    return this;
  }

  /**
   * Set the indentation for the entire table
   */
  setIndent(indent: number): this {
    this.indent = indent;
    return this;
  }

  /**
   * Set the color function for headers
   */
  setHeaderColor(color: (str: string) => string): this {
    this.headerColor = color;
    return this;
  }

  /**
   * Set the color function for separators
   */
  setSeparatorColor(color: (str: string) => string): this {
    this.separatorColor = color;
    return this;
  }

  /**
   * Set the color function for rows
   */
  setRowColor(color: (str: string) => string): this {
    this.rowColor = color;
    return this;
  }

  /**
   * Show or hide the header row
   */
  setShowHeader(show: boolean): this {
    this.showHeader = show;
    return this;
  }

  /**
   * Show or hide the top separator
   */
  setShowTopSeparator(show: boolean): this {
    this.showTopSeparator = show;
    return this;
  }

  /**
   * Show or hide the bottom separator
   */
  setShowBottomSeparator(show: boolean): this {
    this.showBottomSeparator = show;
    return this;
  }

  /**
   * Align text within a cell
   */
  private alignCell(text: string, width: number, alignment: ColumnAlignment): string {
    // Remove any ANSI color codes for width calculation
    const plainText = text.replace(/\u001b\[\d+m/g, '');
    const textLength = plainText.length;

    if (textLength >= width) {
      return text.slice(0, width);
    }

    const padding = width - textLength;

    switch (alignment) {
      case 'left':
        return text + BORDER_CHARS.SPACE.repeat(padding);
      case 'right':
        return BORDER_CHARS.SPACE.repeat(padding) + text;
      case 'center':
        const leftPad = Math.floor(padding / 2);
        const rightPad = padding - leftPad;
        return BORDER_CHARS.SPACE.repeat(leftPad) + text + BORDER_CHARS.SPACE.repeat(rightPad);
      default:
        return text;
    }
  }

  /**
   * Format a row with proper alignment and spacing
   */
  private formatRow(row: TableRow, color?: (str: string) => string): string {
    const indentation = BORDER_CHARS.SPACE.repeat(this.indent);
    const cells = row.map((cell, index) => {
      const column = this.columns[index];
      if (!column) return cell;

      const aligned = this.alignCell(cell, column.width, column.alignment);
      return aligned;
    });

    const formattedRow = cells.join(BORDER_CHARS.SPACE.repeat(2));
    const colorFn = color || this.rowColor;

    return colorFn(indentation + formattedRow);
  }

  /**
   * Build the header row
   */
  private buildHeader(): string {
    const headers = this.columns.map(col => col.header);
    return this.formatRow(headers, this.headerColor);
  }

  /**
   * Calculate total table width
   */
  private calculateTotalWidth(): number {
    const columnWidths = this.columns.reduce((sum, col) => sum + col.width, 0);
    const spacing = (this.columns.length - 1) * 2; // 2 spaces between columns
    return columnWidths + spacing;
  }

  /**
   * Build the complete table
   */
  build(): string {
    const lines: string[] = [];
    const totalWidth = this.calculateTotalWidth();

    // Top separator
    if (this.showTopSeparator) {
      lines.push(drawSeparator(totalWidth, BORDER_CHARS.SINGLE, this.separatorColor, this.indent));
    }

    // Header
    if (this.showHeader) {
      lines.push(this.buildHeader());
      lines.push(drawSeparator(totalWidth, BORDER_CHARS.SINGLE, this.separatorColor, this.indent));
    }

    // Rows
    this.rows.forEach(row => {
      lines.push(this.formatRow(row));
    });

    // Bottom separator
    if (this.showBottomSeparator) {
      lines.push(drawSeparator(totalWidth, BORDER_CHARS.SINGLE, this.separatorColor, this.indent));
    }

    return lines.join('\n');
  }

  /**
   * Build and return as an array of lines
   */
  buildLines(): string[] {
    return this.build().split('\n');
  }

  /**
   * Clear all rows (keep column definitions)
   */
  clearRows(): this {
    this.rows = [];
    return this;
  }

  /**
   * Clear all columns (and rows)
   */
  clearColumns(): this {
    this.columns = [];
    this.rows = [];
    return this;
  }

  /**
   * Reset the builder to initial state
   */
  reset(): this {
    this.columns = [];
    this.rows = [];
    this.indent = 0;
    this.headerColor = chalk.gray;
    this.separatorColor = chalk.gray;
    this.rowColor = chalk.white;
    this.showHeader = true;
    this.showTopSeparator = true;
    this.showBottomSeparator = true;
    return this;
  }
}

/**
 * Create a quick table from column definitions and data
 *
 * @param columns - Column definitions
 * @param rows - Table data rows
 * @param options - Optional configuration
 * @returns Formatted table string
 *
 * @example
 * ```typescript
 * const table = createTable(
 *   [
 *     { header: 'Name', width: 15, alignment: 'left' },
 *     { header: 'Value', width: 10, alignment: 'right' }
 *   ],
 *   [
 *     ['Sun', '120.45°'],
 *     ['Moon', '245.12°']
 *   ],
 *   { indent: 3, headerColor: chalk.yellow }
 * );
 * ```
 */
export function createTable(
  columns: ColumnDefinition[],
  rows: TableRow[],
  options: {
    indent?: number;
    headerColor?: (str: string) => string;
    separatorColor?: (str: string) => string;
    rowColor?: (str: string) => string;
    showHeader?: boolean;
  } = {}
): string {
  const builder = new TableBuilder()
    .addColumns(columns)
    .addRows(rows);

  if (options.indent !== undefined) builder.setIndent(options.indent);
  if (options.headerColor) builder.setHeaderColor(options.headerColor);
  if (options.separatorColor) builder.setSeparatorColor(options.separatorColor);
  if (options.rowColor) builder.setRowColor(options.rowColor);
  if (options.showHeader !== undefined) builder.setShowHeader(options.showHeader);

  return builder.build();
}
