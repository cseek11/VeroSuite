"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionSizeSchema = exports.RegionPositionSchema = exports.RegionUpdateSchema = exports.RegionCreateSchema = exports.ValidationRules = void 0;
exports.detectOverlap = detectOverlap;
exports.validateNoOverlap = validateNoOverlap;
exports.createRegionSchemaWithOverlapCheck = createRegionSchemaWithOverlapCheck;
exports.createRegionUpdateSchemaWithOverlapCheck = createRegionUpdateSchemaWithOverlapCheck;
var zod_1 = require("zod");
var region_types_1 = require("@/routes/dashboard/types/region.types");
/**
 * Validation rules for region fields
 */
exports.ValidationRules = {
    gridRow: zod_1.z.number().int().min(0).max(100),
    gridCol: zod_1.z.number().int().min(0).max(11),
    rowSpan: zod_1.z.number().int().min(1).max(20),
    colSpan: zod_1.z.number().int().min(1).max(12),
    minWidth: zod_1.z.number().int().min(100).max(2000),
    minHeight: zod_1.z.number().int().min(100).max(2000),
    title: zod_1.z.string()
        .min(1, 'Title is required')
        .max(100, 'Title must be less than 100 characters')
        .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Title contains invalid characters')
        .optional(),
    color: zod_1.z.string()
        .regex(/^(#[0-9A-Fa-f]{6}|rgb\(\d{1,3},\s?\d{1,3},\s?\d{1,3}\))$/, 'Invalid color format')
        .optional(),
    displayOrder: zod_1.z.number().int().min(0).optional()
};
/**
 * Config schema with XSS prevention
 */
var RegionConfigSchema = zod_1.z.object({
    title: exports.ValidationRules.title,
    description: zod_1.z.string().max(500, 'Description must be less than 500 characters').optional(),
    backgroundColor: exports.ValidationRules.color,
    headerColor: exports.ValidationRules.color,
    borderColor: exports.ValidationRules.color,
    fontSize: zod_1.z.enum(['small', 'medium', 'large']).optional(),
    fontFamily: zod_1.z.string().max(50).optional(),
    padding: zod_1.z.number().int().min(0).max(48).optional(),
    borderRadius: zod_1.z.number().int().min(0).max(24).optional(),
    shadowDepth: zod_1.z.number().int().min(0).max(5).optional(),
    enableAnimations: zod_1.z.boolean().optional(),
    enableHoverEffects: zod_1.z.boolean().optional()
}).refine(function (config) {
    // Validate config doesn't contain scripts or dangerous content
    var str = JSON.stringify(config);
    return !/<script/i.test(str) &&
        !/javascript:/i.test(str) &&
        !/on\w+\s*=/i.test(str) &&
        !/eval\(/i.test(str);
}, { message: 'Config contains potentially dangerous content' }).optional();
/**
 * Widget config schema
 */
var WidgetConfigSchema = zod_1.z.record(zod_1.z.unknown()).refine(function (config) {
    var str = JSON.stringify(config);
    return !/<script/i.test(str) && !/javascript:/i.test(str);
}, { message: 'Widget config contains potentially dangerous content' }).optional();
/**
 * Base region schema (without refinements, for use with .partial())
 */
var RegionBaseSchema = zod_1.z.object({
    region_type: zod_1.z.nativeEnum(region_types_1.RegionType),
    grid_row: exports.ValidationRules.gridRow,
    grid_col: exports.ValidationRules.gridCol,
    row_span: exports.ValidationRules.rowSpan,
    col_span: exports.ValidationRules.colSpan,
    min_width: exports.ValidationRules.minWidth.optional(),
    min_height: exports.ValidationRules.minHeight.optional(),
    is_collapsed: zod_1.z.boolean().optional(),
    is_locked: zod_1.z.boolean().optional(),
    is_hidden_mobile: zod_1.z.boolean().optional(),
    config: RegionConfigSchema,
    widget_type: zod_1.z.string().max(100).optional(),
    widget_config: WidgetConfigSchema,
    display_order: exports.ValidationRules.displayOrder
});
/**
 * Region create schema with business rule validation
 */
exports.RegionCreateSchema = RegionBaseSchema.refine(function (data) {
    // Business logic validation: region must fit within grid
    return data.grid_col + data.col_span <= 12;
}, {
    message: 'Region extends beyond grid bounds',
    path: ['grid_col', 'col_span']
}).refine(function (data) {
    // Validate minimum size constraints
    if (data.min_width && data.min_width > data.col_span * 100) {
        return false;
    }
    if (data.min_height && data.min_height > data.row_span * 100) {
        return false;
    }
    return true;
}, {
    message: 'Minimum size exceeds region dimensions',
    path: ['min_width', 'min_height']
});
/**
 * Region update schema (partial create schema)
 */
exports.RegionUpdateSchema = RegionBaseSchema.partial().refine(function (data) {
    // At least one field must be updated
    return Object.keys(data).length > 0;
}, { message: 'No fields to update' }).refine(function (data) {
    var _a, _b;
    // If updating position/size, validate grid bounds
    if (data.grid_col !== undefined || data.col_span !== undefined) {
        var gridCol = (_a = data.grid_col) !== null && _a !== void 0 ? _a : 0;
        var colSpan = (_b = data.col_span) !== null && _b !== void 0 ? _b : 1;
        return gridCol + colSpan <= 12;
    }
    return true;
}, {
    message: 'Updated region extends beyond grid bounds',
    path: ['grid_col', 'col_span']
});
/**
 * Region position update schema
 */
exports.RegionPositionSchema = zod_1.z.object({
    grid_row: exports.ValidationRules.gridRow,
    grid_col: exports.ValidationRules.gridCol
}).refine(function (data) {
    return data.grid_col <= 11;
}, { message: 'Column position exceeds grid bounds' });
/**
 * Region size update schema
 */
exports.RegionSizeSchema = zod_1.z.object({
    row_span: exports.ValidationRules.rowSpan,
    col_span: exports.ValidationRules.colSpan
}).refine(function (data) {
    return data.col_span <= 12;
}, { message: 'Column span exceeds grid bounds' });
/**
 * Overlap detection helper
 * Checks if a region would overlap with existing regions
 */
function detectOverlap(newRegion, existingRegions, excludeId) {
    for (var _i = 0, existingRegions_1 = existingRegions; _i < existingRegions_1.length; _i++) {
        var existing = existingRegions_1[_i];
        if (excludeId && existing.id === excludeId)
            continue;
        // Check if rectangles overlap
        var newRight = newRegion.grid_col + newRegion.col_span;
        var newBottom = newRegion.grid_row + newRegion.row_span;
        var existingRight = existing.grid_col + existing.col_span;
        var existingBottom = existing.grid_row + existing.row_span;
        if (newRegion.grid_col < existingRight &&
            newRight > existing.grid_col &&
            newRegion.grid_row < existingBottom &&
            newBottom > existing.grid_row) {
            return true;
        }
    }
    return false;
}
/**
 * Validate region doesn't overlap with existing regions
 */
function validateNoOverlap(region, existingRegions, excludeId) {
    if (detectOverlap(region, existingRegions, excludeId)) {
        return [{
                code: zod_1.z.ZodIssueCode.custom,
                message: 'Region overlaps with existing region',
                path: ['grid_row', 'grid_col', 'row_span', 'col_span']
            }];
    }
    return [];
}
/**
 * Enhanced region create schema with overlap detection
 */
function createRegionSchemaWithOverlapCheck(existingRegions) {
    return exports.RegionCreateSchema.superRefine(function (data, ctx) {
        var overlapIssues = validateNoOverlap({
            grid_row: data.grid_row,
            grid_col: data.grid_col,
            row_span: data.row_span,
            col_span: data.col_span
        }, existingRegions);
        overlapIssues.forEach(function (issue) {
            ctx.addIssue(issue);
        });
    });
}
/**
 * Enhanced region update schema with overlap detection
 */
function createRegionUpdateSchemaWithOverlapCheck(regionId, existingRegions) {
    return exports.RegionUpdateSchema.superRefine(function (data, ctx) {
        var _a, _b, _c, _d;
        // Only check overlap if position or size is being updated
        if (data.grid_row !== undefined || data.grid_col !== undefined ||
            data.row_span !== undefined || data.col_span !== undefined) {
            // Get current region for defaults
            var currentRegion = existingRegions.find(function (r) { return r.id === regionId; });
            if (!currentRegion)
                return;
            var overlapIssues = validateNoOverlap({
                grid_row: (_a = data.grid_row) !== null && _a !== void 0 ? _a : currentRegion.grid_row,
                grid_col: (_b = data.grid_col) !== null && _b !== void 0 ? _b : currentRegion.grid_col,
                row_span: (_c = data.row_span) !== null && _c !== void 0 ? _c : currentRegion.row_span,
                col_span: (_d = data.col_span) !== null && _d !== void 0 ? _d : currentRegion.col_span
            }, existingRegions, regionId);
            overlapIssues.forEach(function (issue) {
                ctx.addIssue(issue);
            });
        }
    });
}
