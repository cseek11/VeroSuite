"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var region_schemas_1 = require("../region.schemas");
var region_types_1 = require("@/routes/dashboard/types/region.types");
(0, vitest_1.describe)('Region Validation Schemas', function () {
    (0, vitest_1.describe)('RegionCreateSchema', function () {
        (0, vitest_1.it)('should validate a valid region', function () {
            var validRegion = {
                region_type: region_types_1.RegionType.SCHEDULING,
                grid_row: 0,
                grid_col: 0,
                row_span: 2,
                col_span: 3,
                min_width: 300,
                min_height: 200,
                display_order: 0
            };
            var result = region_schemas_1.RegionCreateSchema.safeParse(validRegion);
            (0, vitest_1.expect)(result.success).toBe(true);
        });
        (0, vitest_1.it)('should reject region extending beyond grid bounds', function () {
            var _a;
            var invalidRegion = {
                region_type: region_types_1.RegionType.SCHEDULING,
                grid_row: 0,
                grid_col: 10,
                row_span: 1,
                col_span: 5, // Extends beyond 12 columns
                display_order: 0
            };
            var result = region_schemas_1.RegionCreateSchema.safeParse(invalidRegion);
            (0, vitest_1.expect)(result.success).toBe(false);
            if (!result.success && result.error) {
                (0, vitest_1.expect)((_a = result.error.issues[0]) === null || _a === void 0 ? void 0 : _a.message).toContain('grid bounds');
            }
        });
        (0, vitest_1.it)('should reject invalid grid positions', function () {
            var invalidRegion = {
                region_type: region_types_1.RegionType.SCHEDULING,
                grid_row: -1, // Invalid
                grid_col: 0,
                row_span: 1,
                col_span: 1,
                display_order: 0
            };
            var result = region_schemas_1.RegionCreateSchema.safeParse(invalidRegion);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)('should sanitize config for XSS', function () {
            var maliciousRegion = {
                region_type: region_types_1.RegionType.SCHEDULING,
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
            var result = region_schemas_1.RegionCreateSchema.safeParse(maliciousRegion);
            (0, vitest_1.expect)(result.success).toBe(false);
            if (!result.success) {
                // Title validation fails first with invalid characters, or config validation fails with dangerous content
                var errorMessages = result.error.issues.map(function (issue) { return issue.message; });
                (0, vitest_1.expect)(errorMessages.some(function (msg) {
                    return msg.includes('invalid characters') ||
                        msg.includes('dangerous content');
                })).toBe(true);
            }
        });
    });
    (0, vitest_1.describe)('detectOverlap', function () {
        (0, vitest_1.it)('should detect overlapping regions', function () {
            var region1 = { grid_row: 0, grid_col: 0, row_span: 2, col_span: 2 };
            var region2 = { grid_row: 1, grid_col: 1, row_span: 2, col_span: 2 };
            var overlaps = (0, region_schemas_1.detectOverlap)(region1, [region2]);
            (0, vitest_1.expect)(overlaps).toBe(true);
        });
        (0, vitest_1.it)('should not detect non-overlapping regions', function () {
            var region1 = { grid_row: 0, grid_col: 0, row_span: 2, col_span: 2 };
            var region2 = { grid_row: 0, grid_col: 3, row_span: 2, col_span: 2 };
            var overlaps = (0, region_schemas_1.detectOverlap)(region1, [region2]);
            (0, vitest_1.expect)(overlaps).toBe(false);
        });
        (0, vitest_1.it)('should exclude specified region from overlap check', function () {
            var region1 = { id: '1', grid_row: 0, grid_col: 0, row_span: 2, col_span: 2 };
            var region2 = { id: '1', grid_row: 0, grid_col: 0, row_span: 2, col_span: 2 };
            var overlaps = (0, region_schemas_1.detectOverlap)(region1, [region2], '1');
            (0, vitest_1.expect)(overlaps).toBe(false);
        });
    });
});
