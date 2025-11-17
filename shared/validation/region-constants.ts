/**
 * Shared validation constants for region dashboard
 * Used by both frontend and backend to ensure consistency
 */

export const GRID_CONSTANTS = {
  /** Number of columns in the grid */
  COLUMNS: 12,
  /** Maximum column index (0-indexed, so max is COLUMNS - 1) */
  MAX_COLUMN: 11,
  /** Minimum column index */
  MIN_COLUMN: 0,
  /** Maximum row index */
  MAX_ROW: 100,
  /** Minimum row index */
  MIN_ROW: 0,
  /** Maximum column span */
  MAX_COL_SPAN: 12,
  /** Minimum column span */
  MIN_COL_SPAN: 1,
  /** Maximum row span */
  MAX_ROW_SPAN: 20,
  /** Minimum row span */
  MIN_ROW_SPAN: 1
} as const;

export const SIZE_CONSTRAINTS = {
  /** Minimum width in pixels */
  MIN_WIDTH: 100,
  /** Maximum width in pixels */
  MAX_WIDTH: 2000,
  /** Minimum height in pixels */
  MIN_HEIGHT: 100,
  /** Maximum height in pixels */
  MAX_HEIGHT: 2000,
  /** Default minimum width */
  DEFAULT_MIN_WIDTH: 200,
  /** Default minimum height */
  DEFAULT_MIN_HEIGHT: 150
} as const;

export const TEXT_CONSTRAINTS = {
  /** Maximum title length */
  MAX_TITLE_LENGTH: 100,
  /** Maximum description length */
  MAX_DESCRIPTION_LENGTH: 500,
  /** Maximum font family name length */
  MAX_FONT_FAMILY_LENGTH: 50
} as const;

export const VALIDATION_MESSAGES = {
  GRID_COL_OUT_OF_BOUNDS: (col: number) => 
    `Grid column must be between ${GRID_CONSTANTS.MIN_COLUMN} and ${GRID_CONSTANTS.MAX_COLUMN} (got ${col}). Columns are 0-indexed.`,
  GRID_COL_SPAN_OUT_OF_BOUNDS: (span: number) =>
    `Column span must be between ${GRID_CONSTANTS.MIN_COL_SPAN} and ${GRID_CONSTANTS.MAX_COL_SPAN}, got ${span}`,
  GRID_EXCEEDS_BOUNDS: (col: number, span: number) =>
    `Region extends beyond grid bounds: column ${col} + span ${span} exceeds ${GRID_CONSTANTS.COLUMNS} columns`,
  GRID_ROW_OUT_OF_BOUNDS: (row: number) =>
    `Grid row must be at least ${GRID_CONSTANTS.MIN_ROW}, got ${row}`,
  GRID_ROW_SPAN_OUT_OF_BOUNDS: (span: number) =>
    `Row span must be between ${GRID_CONSTANTS.MIN_ROW_SPAN} and ${GRID_CONSTANTS.MAX_ROW_SPAN}, got ${span}`,
  REGION_OVERLAPS: (row: number, col: number) =>
    `Region overlaps with existing region at position (${row}, ${col})`,
  MIN_WIDTH_OUT_OF_BOUNDS: (width: number) =>
    `Minimum width must be between ${SIZE_CONSTRAINTS.MIN_WIDTH} and ${SIZE_CONSTRAINTS.MAX_WIDTH} pixels, got ${width}`,
  MIN_HEIGHT_OUT_OF_BOUNDS: (height: number) =>
    `Minimum height must be between ${SIZE_CONSTRAINTS.MIN_HEIGHT} and ${SIZE_CONSTRAINTS.MAX_HEIGHT} pixels, got ${height}`,
  TITLE_TOO_LONG: (length: number) =>
    `Title must be less than ${TEXT_CONSTRAINTS.MAX_TITLE_LENGTH} characters, got ${length}`,
  DESCRIPTION_TOO_LONG: (length: number) =>
    `Description must be less than ${TEXT_CONSTRAINTS.MAX_DESCRIPTION_LENGTH} characters, got ${length}`,
  INVALID_COLOR_FORMAT: 'Invalid color format. Use hex (#RRGGBB) or rgb(r,g,b) format.',
  CONTAINS_DANGEROUS_CONTENT: 'Config contains potentially dangerous content (scripts, javascript:, event handlers)'
} as const;

/**
 * Validate grid bounds
 */
export function validateGridBounds(region: {
  grid_col: number;
  col_span: number;
  grid_row: number;
  row_span: number;
}): { valid: boolean; error?: string } {
  // Validate grid_col is within bounds
  if (region.grid_col < GRID_CONSTANTS.MIN_COLUMN || region.grid_col > GRID_CONSTANTS.MAX_COLUMN) {
    return {
      valid: false,
      error: VALIDATION_MESSAGES.GRID_COL_OUT_OF_BOUNDS(region.grid_col)
    };
  }

  // Validate col_span is within bounds
  if (region.col_span < GRID_CONSTANTS.MIN_COL_SPAN || region.col_span > GRID_CONSTANTS.MAX_COL_SPAN) {
    return {
      valid: false,
      error: VALIDATION_MESSAGES.GRID_COL_SPAN_OUT_OF_BOUNDS(region.col_span)
    };
  }

  // Validate that col + span doesn't exceed grid bounds
  if (region.grid_col + region.col_span > GRID_CONSTANTS.COLUMNS) {
    return {
      valid: false,
      error: VALIDATION_MESSAGES.GRID_EXCEEDS_BOUNDS(region.grid_col, region.col_span)
    };
  }

  // Validate grid_row is non-negative
  if (region.grid_row < GRID_CONSTANTS.MIN_ROW) {
    return {
      valid: false,
      error: VALIDATION_MESSAGES.GRID_ROW_OUT_OF_BOUNDS(region.grid_row)
    };
  }

  // Validate row_span is within bounds
  if (region.row_span < GRID_CONSTANTS.MIN_ROW_SPAN || region.row_span > GRID_CONSTANTS.MAX_ROW_SPAN) {
    return {
      valid: false,
      error: VALIDATION_MESSAGES.GRID_ROW_SPAN_OUT_OF_BOUNDS(region.row_span)
    };
  }

  return { valid: true };
}

/**
 * Check if two regions overlap
 */
export function regionsOverlap(
  region1: { grid_row: number; grid_col: number; row_span: number; col_span: number },
  region2: { grid_row: number; grid_col: number; row_span: number; col_span: number }
): boolean {
  const r1Right = region1.grid_col + region1.col_span;
  const r1Bottom = region1.grid_row + region1.row_span;
  const r2Right = region2.grid_col + region2.col_span;
  const r2Bottom = region2.grid_row + region2.row_span;

  return (
    region1.grid_col < r2Right &&
    r1Right > region2.grid_col &&
    region1.grid_row < r2Bottom &&
    r1Bottom > region2.grid_row
  );
}



