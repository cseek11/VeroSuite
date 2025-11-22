export declare const GRID_CONSTANTS: {
    readonly COLUMNS: 12;
    readonly MAX_COLUMN: 11;
    readonly MIN_COLUMN: 0;
    readonly MAX_ROW: 100;
    readonly MIN_ROW: 0;
    readonly MAX_COL_SPAN: 12;
    readonly MIN_COL_SPAN: 1;
    readonly MAX_ROW_SPAN: 20;
    readonly MIN_ROW_SPAN: 1;
};
export declare const SIZE_CONSTRAINTS: {
    readonly MIN_WIDTH: 100;
    readonly MAX_WIDTH: 2000;
    readonly MIN_HEIGHT: 100;
    readonly MAX_HEIGHT: 2000;
    readonly DEFAULT_MIN_WIDTH: 200;
    readonly DEFAULT_MIN_HEIGHT: 150;
};
export declare const TEXT_CONSTRAINTS: {
    readonly MAX_TITLE_LENGTH: 100;
    readonly MAX_DESCRIPTION_LENGTH: 500;
    readonly MAX_FONT_FAMILY_LENGTH: 50;
};
export declare const VALIDATION_MESSAGES: {
    readonly GRID_COL_OUT_OF_BOUNDS: (col: number) => string;
    readonly GRID_COL_SPAN_OUT_OF_BOUNDS: (span: number) => string;
    readonly GRID_EXCEEDS_BOUNDS: (col: number, span: number) => string;
    readonly GRID_ROW_OUT_OF_BOUNDS: (row: number) => string;
    readonly GRID_ROW_SPAN_OUT_OF_BOUNDS: (span: number) => string;
    readonly REGION_OVERLAPS: (row: number, col: number) => string;
    readonly MIN_WIDTH_OUT_OF_BOUNDS: (width: number) => string;
    readonly MIN_HEIGHT_OUT_OF_BOUNDS: (height: number) => string;
    readonly TITLE_TOO_LONG: (length: number) => string;
    readonly DESCRIPTION_TOO_LONG: (length: number) => string;
    readonly INVALID_COLOR_FORMAT: "Invalid color format. Use hex (#RRGGBB) or rgb(r,g,b) format.";
    readonly CONTAINS_DANGEROUS_CONTENT: "Config contains potentially dangerous content (scripts, javascript:, event handlers)";
};
export declare function validateGridBounds(region: {
    grid_col: number;
    col_span: number;
    grid_row: number;
    row_span: number;
}): {
    valid: boolean;
    error?: string;
};
export declare function regionsOverlap(region1: {
    grid_row: number;
    grid_col: number;
    row_span: number;
    col_span: number;
}, region2: {
    grid_row: number;
    grid_col: number;
    row_span: number;
    col_span: number;
}): boolean;
