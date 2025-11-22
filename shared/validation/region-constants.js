"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALIDATION_MESSAGES = exports.TEXT_CONSTRAINTS = exports.SIZE_CONSTRAINTS = exports.GRID_CONSTANTS = void 0;
exports.validateGridBounds = validateGridBounds;
exports.regionsOverlap = regionsOverlap;
exports.GRID_CONSTANTS = {
    COLUMNS: 12,
    MAX_COLUMN: 11,
    MIN_COLUMN: 0,
    MAX_ROW: 100,
    MIN_ROW: 0,
    MAX_COL_SPAN: 12,
    MIN_COL_SPAN: 1,
    MAX_ROW_SPAN: 20,
    MIN_ROW_SPAN: 1
};
exports.SIZE_CONSTRAINTS = {
    MIN_WIDTH: 100,
    MAX_WIDTH: 2000,
    MIN_HEIGHT: 100,
    MAX_HEIGHT: 2000,
    DEFAULT_MIN_WIDTH: 200,
    DEFAULT_MIN_HEIGHT: 150
};
exports.TEXT_CONSTRAINTS = {
    MAX_TITLE_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 500,
    MAX_FONT_FAMILY_LENGTH: 50
};
exports.VALIDATION_MESSAGES = {
    GRID_COL_OUT_OF_BOUNDS: (col) => `Grid column must be between ${exports.GRID_CONSTANTS.MIN_COLUMN} and ${exports.GRID_CONSTANTS.MAX_COLUMN} (got ${col}). Columns are 0-indexed.`,
    GRID_COL_SPAN_OUT_OF_BOUNDS: (span) => `Column span must be between ${exports.GRID_CONSTANTS.MIN_COL_SPAN} and ${exports.GRID_CONSTANTS.MAX_COL_SPAN}, got ${span}`,
    GRID_EXCEEDS_BOUNDS: (col, span) => `Region extends beyond grid bounds: column ${col} + span ${span} exceeds ${exports.GRID_CONSTANTS.COLUMNS} columns`,
    GRID_ROW_OUT_OF_BOUNDS: (row) => `Grid row must be at least ${exports.GRID_CONSTANTS.MIN_ROW}, got ${row}`,
    GRID_ROW_SPAN_OUT_OF_BOUNDS: (span) => `Row span must be between ${exports.GRID_CONSTANTS.MIN_ROW_SPAN} and ${exports.GRID_CONSTANTS.MAX_ROW_SPAN}, got ${span}`,
    REGION_OVERLAPS: (row, col) => `Region overlaps with existing region at position (${row}, ${col})`,
    MIN_WIDTH_OUT_OF_BOUNDS: (width) => `Minimum width must be between ${exports.SIZE_CONSTRAINTS.MIN_WIDTH} and ${exports.SIZE_CONSTRAINTS.MAX_WIDTH} pixels, got ${width}`,
    MIN_HEIGHT_OUT_OF_BOUNDS: (height) => `Minimum height must be between ${exports.SIZE_CONSTRAINTS.MIN_HEIGHT} and ${exports.SIZE_CONSTRAINTS.MAX_HEIGHT} pixels, got ${height}`,
    TITLE_TOO_LONG: (length) => `Title must be less than ${exports.TEXT_CONSTRAINTS.MAX_TITLE_LENGTH} characters, got ${length}`,
    DESCRIPTION_TOO_LONG: (length) => `Description must be less than ${exports.TEXT_CONSTRAINTS.MAX_DESCRIPTION_LENGTH} characters, got ${length}`,
    INVALID_COLOR_FORMAT: 'Invalid color format. Use hex (#RRGGBB) or rgb(r,g,b) format.',
    CONTAINS_DANGEROUS_CONTENT: 'Config contains potentially dangerous content (scripts, javascript:, event handlers)'
};
function validateGridBounds(region) {
    if (region.grid_col < exports.GRID_CONSTANTS.MIN_COLUMN || region.grid_col > exports.GRID_CONSTANTS.MAX_COLUMN) {
        return {
            valid: false,
            error: exports.VALIDATION_MESSAGES.GRID_COL_OUT_OF_BOUNDS(region.grid_col)
        };
    }
    if (region.col_span < exports.GRID_CONSTANTS.MIN_COL_SPAN || region.col_span > exports.GRID_CONSTANTS.MAX_COL_SPAN) {
        return {
            valid: false,
            error: exports.VALIDATION_MESSAGES.GRID_COL_SPAN_OUT_OF_BOUNDS(region.col_span)
        };
    }
    if (region.grid_col + region.col_span > exports.GRID_CONSTANTS.COLUMNS) {
        return {
            valid: false,
            error: exports.VALIDATION_MESSAGES.GRID_EXCEEDS_BOUNDS(region.grid_col, region.col_span)
        };
    }
    if (region.grid_row < exports.GRID_CONSTANTS.MIN_ROW) {
        return {
            valid: false,
            error: exports.VALIDATION_MESSAGES.GRID_ROW_OUT_OF_BOUNDS(region.grid_row)
        };
    }
    if (region.row_span < exports.GRID_CONSTANTS.MIN_ROW_SPAN || region.row_span > exports.GRID_CONSTANTS.MAX_ROW_SPAN) {
        return {
            valid: false,
            error: exports.VALIDATION_MESSAGES.GRID_ROW_SPAN_OUT_OF_BOUNDS(region.row_span)
        };
    }
    return { valid: true };
}
function regionsOverlap(region1, region2) {
    const r1Right = region1.grid_col + region1.col_span;
    const r1Bottom = region1.grid_row + region1.row_span;
    const r2Right = region2.grid_col + region2.col_span;
    const r2Bottom = region2.grid_row + region2.row_span;
    return (region1.grid_col < r2Right &&
        r1Right > region2.grid_col &&
        region1.grid_row < r2Bottom &&
        r1Bottom > region2.grid_row);
}
//# sourceMappingURL=region-constants.js.map