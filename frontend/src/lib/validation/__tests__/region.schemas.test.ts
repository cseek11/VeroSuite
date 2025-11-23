import { describe, it, expect } from 'vitest';
import {
  RegionCreateSchema,
  detectOverlap
} from '../region.schemas';
import { RegionType } from '@/routes/dashboard/types/region.types';

describe('Region Validation Schemas', () => {
  describe('RegionCreateSchema', () => {
    it('should validate a valid region', () => {
      const validRegion = {
        region_type: RegionType.SCHEDULING,
        grid_row: 0,
        grid_col: 0,
        row_span: 2,
        col_span: 3,
        min_width: 300,
        min_height: 200,
        display_order: 0
      };

      const result = RegionCreateSchema.safeParse(validRegion);
      expect(result.success).toBe(true);
    });

    it('should reject region extending beyond grid bounds', () => {
      const invalidRegion = {
        region_type: RegionType.SCHEDULING,
        grid_row: 0,
        grid_col: 10,
        row_span: 1,
        col_span: 5, // Extends beyond 12 columns
        display_order: 0
      };

      const result = RegionCreateSchema.safeParse(invalidRegion);
      expect(result.success).toBe(false);
      if (!result.success && result.error) {
        expect(result.error.issues[0]?.message).toContain('grid bounds');
      }
    });

    it('should reject invalid grid positions', () => {
      const invalidRegion = {
        region_type: RegionType.SCHEDULING,
        grid_row: -1, // Invalid
        grid_col: 0,
        row_span: 1,
        col_span: 1,
        display_order: 0
      };

      const result = RegionCreateSchema.safeParse(invalidRegion);
      expect(result.success).toBe(false);
    });

    it('should sanitize config for XSS', () => {
      const maliciousRegion = {
        region_type: RegionType.SCHEDULING,
        grid_row: 0,
        grid_col: 0,
        row_span: 1,
        col_span: 1,
        config: {
          title: '<script>alert("xss")</script>',
          description: 'javascript:alert(1)'
        },
        display_order: 0
      };

      const result = RegionCreateSchema.safeParse(maliciousRegion);
      expect(result.success).toBe(false);
      if (!result.success) {
        // Title validation fails first with invalid characters, or config validation fails with dangerous content
        const errorMessages = result.error.issues.map(issue => issue.message);
        expect(
          errorMessages.some(msg => 
            msg.includes('invalid characters') || 
            msg.includes('dangerous content')
          )
        ).toBe(true);
      }
    });
  });

  describe('detectOverlap', () => {
    it('should detect overlapping regions', () => {
      const region1 = { grid_row: 0, grid_col: 0, row_span: 2, col_span: 2 };
      const region2 = { grid_row: 1, grid_col: 1, row_span: 2, col_span: 2 };

      const overlaps = detectOverlap(region1, [region2]);
      expect(overlaps).toBe(true);
    });

    it('should not detect non-overlapping regions', () => {
      const region1 = { grid_row: 0, grid_col: 0, row_span: 2, col_span: 2 };
      const region2 = { grid_row: 0, grid_col: 3, row_span: 2, col_span: 2 };

      const overlaps = detectOverlap(region1, [region2]);
      expect(overlaps).toBe(false);
    });

    it('should exclude specified region from overlap check', () => {
      const region1 = { id: '1', grid_row: 0, grid_col: 0, row_span: 2, col_span: 2 };
      const region2 = { id: '1', grid_row: 0, grid_col: 0, row_span: 2, col_span: 2 };

      const overlaps = detectOverlap(region1, [region2], '1');
      expect(overlaps).toBe(false);
    });
  });
});




