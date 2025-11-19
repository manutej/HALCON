/**
 * Display Renderer Utilities
 *
 * Central export for all display rendering utilities used across HALCON commands.
 *
 * @module lib/display/renderers
 */

// Border utilities
export {
  DEFAULT_WIDTH,
  BORDER_CHARS,
  drawHeader,
  drawSeparator,
  drawBorder,
  drawSectionHeader,
  drawBox,
} from './borders.js';

// Table builder
export {
  TableBuilder,
  createTable,
  type ColumnDefinition,
  type ColumnAlignment,
  type TableRow,
} from './table-builder.js';

// Chart renderers
export {
  getPlanetSymbol,
  formatDegree,
  renderChartHeader,
  renderBirthInfo,
  renderPlanetaryPositions,
  renderHouseCusps,
  renderAngles,
  renderChartFooter,
  renderProgressionMovement,
  type BodyData,
  type AnglesData,
  type LocationData,
} from './chart-renderer.js';
