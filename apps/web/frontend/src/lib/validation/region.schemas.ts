import { z } from 'zod';
import { RegionType } from '@/routes/dashboard/types/region.types';

/**
 * Validation rules for region fields
 */
export const ValidationRules = {
  gridRow: z.number().int().min(0).max(100),
  gridCol: z.number().int().min(0).max(11),
  rowSpan: z.number().int().min(1).max(20),
  colSpan: z.number().int().min(1).max(12),
  minWidth: z.number().int().min(100).max(2000),
  minHeight: z.number().int().min(100).max(2000),
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Title contains invalid characters')
    .optional(),
  color: z.string()
    .regex(/^(#[0-9A-Fa-f]{6}|rgb\(\d{1,3},\s?\d{1,3},\s?\d{1,3}\))$/, 'Invalid color format')
    .optional(),
  displayOrder: z.number().int().min(0).optional()
};

/**
 * Config schema with XSS prevention
 */
const RegionConfigSchema = z.object({
  title: ValidationRules.title,
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  backgroundColor: ValidationRules.color,
  headerColor: ValidationRules.color,
  borderColor: ValidationRules.color,
  fontSize: z.enum(['small', 'medium', 'large']).optional(),
  fontFamily: z.string().max(50).optional(),
  padding: z.number().int().min(0).max(48).optional(),
  borderRadius: z.number().int().min(0).max(24).optional(),
  shadowDepth: z.number().int().min(0).max(5).optional(),
  enableAnimations: z.boolean().optional(),
  enableHoverEffects: z.boolean().optional()
}).refine(
  (config) => {
    // Validate config doesn't contain scripts or dangerous content
    const str = JSON.stringify(config);
    return !/<script/i.test(str) && 
           !/javascript:/i.test(str) && 
           !/on\w+\s*=/i.test(str) &&
           !/eval\(/i.test(str);
  },
  { message: 'Config contains potentially dangerous content' }
).optional();

/**
 * Widget config schema
 */
const WidgetConfigSchema = z.record(z.unknown()).refine(
  (config) => {
    const str = JSON.stringify(config);
    return !/<script/i.test(str) && !/javascript:/i.test(str);
  },
  { message: 'Widget config contains potentially dangerous content' }
).optional();

/**
 * Base region schema (without refinements, for use with .partial())
 */
const RegionBaseSchema = z.object({
  region_type: z.nativeEnum(RegionType),
  grid_row: ValidationRules.gridRow,
  grid_col: ValidationRules.gridCol,
  row_span: ValidationRules.rowSpan,
  col_span: ValidationRules.colSpan,
  min_width: ValidationRules.minWidth.optional(),
  min_height: ValidationRules.minHeight.optional(),
  is_collapsed: z.boolean().optional(),
  is_locked: z.boolean().optional(),
  is_hidden_mobile: z.boolean().optional(),
  config: RegionConfigSchema,
  widget_type: z.string().max(100).optional(),
  widget_config: WidgetConfigSchema,
  display_order: ValidationRules.displayOrder
});

/**
 * Region create schema with business rule validation
 */
export const RegionCreateSchema = RegionBaseSchema.refine(
  (data) => {
    // Business logic validation: region must fit within grid
    return data.grid_col + data.col_span <= 12;
  },
  { 
    message: 'Region extends beyond grid bounds',
    path: ['grid_col', 'col_span']
  }
).refine(
  (data) => {
    // Validate minimum size constraints
    if (data.min_width && data.min_width > data.col_span * 100) {
      return false;
    }
    if (data.min_height && data.min_height > data.row_span * 100) {
      return false;
    }
    return true;
  },
  {
    message: 'Minimum size exceeds region dimensions',
    path: ['min_width', 'min_height']
  }
);

/**
 * Region update schema (partial create schema)
 */
export const RegionUpdateSchema = RegionBaseSchema.partial().refine(
  (data) => {
    // At least one field must be updated
    return Object.keys(data).length > 0;
  },
  { message: 'No fields to update' }
).refine(
  (data) => {
    // If updating position/size, validate grid bounds
    if (data.grid_col !== undefined || data.col_span !== undefined) {
      const gridCol = data.grid_col ?? 0;
      const colSpan = data.col_span ?? 1;
      return gridCol + colSpan <= 12;
    }
    return true;
  },
  {
    message: 'Updated region extends beyond grid bounds',
    path: ['grid_col', 'col_span']
  }
);

/**
 * Region position update schema
 */
export const RegionPositionSchema = z.object({
  grid_row: ValidationRules.gridRow,
  grid_col: ValidationRules.gridCol
}).refine(
  (data) => {
    return data.grid_col <= 11;
  },
  { message: 'Column position exceeds grid bounds' }
);

/**
 * Region size update schema
 */
export const RegionSizeSchema = z.object({
  row_span: ValidationRules.rowSpan,
  col_span: ValidationRules.colSpan
}).refine(
  (data) => {
    return data.col_span <= 12;
  },
  { message: 'Column span exceeds grid bounds' }
);

/**
 * Overlap detection helper
 * Checks if a region would overlap with existing regions
 */
export function detectOverlap(
  newRegion: { grid_row: number; grid_col: number; row_span: number; col_span: number },
  existingRegions: Array<{ grid_row: number; grid_col: number; row_span: number; col_span: number; id?: string }>,
  excludeId?: string
): boolean {
  for (const existing of existingRegions) {
    if (excludeId && existing.id === excludeId) continue;
    
    // Check if rectangles overlap
    const newRight = newRegion.grid_col + newRegion.col_span;
    const newBottom = newRegion.grid_row + newRegion.row_span;
    const existingRight = existing.grid_col + existing.col_span;
    const existingBottom = existing.grid_row + existing.row_span;
    
    if (
      newRegion.grid_col < existingRight &&
      newRight > existing.grid_col &&
      newRegion.grid_row < existingBottom &&
      newBottom > existing.grid_row
    ) {
      return true;
    }
  }
  
  return false;
}

/**
 * Validate region doesn't overlap with existing regions
 */
export function validateNoOverlap(
  region: { grid_row: number; grid_col: number; row_span: number; col_span: number },
  existingRegions: Array<{ grid_row: number; grid_col: number; row_span: number; col_span: number; id?: string }>,
  excludeId?: string
): z.ZodIssue[] {
  if (detectOverlap(region, existingRegions, excludeId)) {
    return [{
      code: z.ZodIssueCode.custom,
      message: 'Region overlaps with existing region',
      path: ['grid_row', 'grid_col', 'row_span', 'col_span']
    }];
  }
  return [];
}

/**
 * Enhanced region create schema with overlap detection
 */
export function createRegionSchemaWithOverlapCheck(
  existingRegions: Array<{ grid_row: number; grid_col: number; row_span: number; col_span: number; id?: string }>
) {
  return RegionCreateSchema.superRefine((data, ctx) => {
    const overlapIssues = validateNoOverlap(
      {
        grid_row: data.grid_row,
        grid_col: data.grid_col,
        row_span: data.row_span,
        col_span: data.col_span
      },
      existingRegions
    );
    
    overlapIssues.forEach(issue => {
      ctx.addIssue(issue);
    });
  });
}

/**
 * Enhanced region update schema with overlap detection
 */
export function createRegionUpdateSchemaWithOverlapCheck(
  regionId: string,
  existingRegions: Array<{ grid_row: number; grid_col: number; row_span: number; col_span: number; id?: string }>
) {
  return RegionUpdateSchema.superRefine((data, ctx) => {
    // Only check overlap if position or size is being updated
    if (data.grid_row !== undefined || data.grid_col !== undefined || 
        data.row_span !== undefined || data.col_span !== undefined) {
      
      // Get current region for defaults
      const currentRegion = existingRegions.find(r => r.id === regionId);
      if (!currentRegion) return;
      
      const overlapIssues = validateNoOverlap(
        {
          grid_row: data.grid_row ?? currentRegion.grid_row,
          grid_col: data.grid_col ?? currentRegion.grid_col,
          row_span: data.row_span ?? currentRegion.row_span,
          col_span: data.col_span ?? currentRegion.col_span
        },
        existingRegions,
        regionId
      );
      
      overlapIssues.forEach(issue => {
        ctx.addIssue(issue);
      });
    }
  });
}

/**
 * Type exports for TypeScript inference
 */
export type RegionCreateInput = z.infer<typeof RegionCreateSchema>;
export type RegionUpdateInput = z.infer<typeof RegionUpdateSchema>;
export type RegionPositionInput = z.infer<typeof RegionPositionSchema>;
export type RegionSizeInput = z.infer<typeof RegionSizeSchema>;

