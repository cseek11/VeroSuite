"use strict";
/**
 * Response Structure Pattern Tests
 *
 * Simplified tests that focus on the response extraction pattern
 * without requiring full API mocking. These tests verify the
 * extraction logic that should be used across all API clients.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
/**
 * Response extraction pattern - matches what's in enhanced-api.ts
 */
function extractDataArray(response) {
    // Check if response.data.data exists (double-nested structure from controller wrapping DTO)
    if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
    }
    // Check if response.data.technicians exists (alternative nested structure)
    else if (response && response.data && response.data.technicians && Array.isArray(response.data.technicians)) {
        return response.data.technicians;
    }
    // Check if response.data is a direct array
    else if (response && response.data && Array.isArray(response.data)) {
        return response.data;
    }
    // Check if response is a direct array
    else if (Array.isArray(response)) {
        return response;
    }
    // Check if response.technicians exists (alternative format)
    else if (response && response.technicians && Array.isArray(response.technicians)) {
        return response.technicians;
    }
    return [];
}
(0, vitest_1.describe)('Response Structure Extraction Pattern', function () {
    (0, vitest_1.describe)('Double-Nested Structure (Controller-wrapped DTO)', function () {
        (0, vitest_1.it)('should extract from { data: { data: [...] } } - technicians pattern', function () {
            var response = {
                data: {
                    data: [
                        { id: '1', first_name: 'John', last_name: 'Doe' },
                        { id: '2', first_name: 'Jane', last_name: 'Smith' },
                    ],
                    pagination: { page: 1, limit: 20, total: 2 },
                    success: true,
                },
                meta: { version: '2.0', count: 2 },
            };
            var result = extractDataArray(response);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result.length).toBe(2);
            (0, vitest_1.expect)(result[0]).toHaveProperty('id', '1');
            (0, vitest_1.expect)(result[0]).toHaveProperty('first_name', 'John');
        });
        (0, vitest_1.it)('should extract from { data: { data: [...] } } - accounts pattern', function () {
            var response = {
                data: {
                    data: [
                        { id: 'acc-1', name: 'Account 1' },
                    ],
                    pagination: { page: 1, limit: 20, total: 1 },
                },
                meta: { version: '1.0', count: 1 },
            };
            var result = extractDataArray(response);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result.length).toBe(1);
            (0, vitest_1.expect)(result[0]).toHaveProperty('id', 'acc-1');
        });
        (0, vitest_1.it)('should extract from { data: { data: [...] } } - work orders pattern', function () {
            var response = {
                data: {
                    data: [
                        { id: 'wo-1', description: 'Work Order 1' },
                    ],
                    pagination: { page: 1, limit: 20, total: 1 },
                },
                meta: { version: '1.0', count: 1 },
            };
            var result = extractDataArray(response);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result.length).toBe(1);
            (0, vitest_1.expect)(result[0]).toHaveProperty('id', 'wo-1');
        });
    });
    (0, vitest_1.describe)('Single-Nested Structure', function () {
        (0, vitest_1.it)('should extract from { data: [...] }', function () {
            var response = {
                data: [
                    { id: '1', name: 'Item 1' },
                    { id: '2', name: 'Item 2' },
                ],
                meta: { version: '2.0', count: 2 },
            };
            var result = extractDataArray(response);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result.length).toBe(2);
        });
    });
    (0, vitest_1.describe)('Alternative Formats', function () {
        (0, vitest_1.it)('should extract from { data: { technicians: [...] } }', function () {
            var response = {
                data: {
                    technicians: [
                        { id: '1', name: 'Tech 1' },
                    ],
                    total: 1,
                },
                meta: {},
            };
            var result = extractDataArray(response);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result.length).toBe(1);
        });
        (0, vitest_1.it)('should extract from { technicians: [...] }', function () {
            var response = {
                technicians: [
                    { id: '1', name: 'Tech 1' },
                ],
            };
            var result = extractDataArray(response);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result.length).toBe(1);
        });
        (0, vitest_1.it)('should extract from direct array', function () {
            var response = [
                { id: '1', name: 'Item 1' },
                { id: '2', name: 'Item 2' },
            ];
            var result = extractDataArray(response);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result.length).toBe(2);
        });
    });
    (0, vitest_1.describe)('Edge Cases', function () {
        (0, vitest_1.it)('should return empty array for null', function () {
            var result = extractDataArray(null);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result.length).toBe(0);
        });
        (0, vitest_1.it)('should return empty array for undefined', function () {
            var result = extractDataArray(undefined);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result.length).toBe(0);
        });
        (0, vitest_1.it)('should return empty array when data is not an array', function () {
            var response = {
                data: {
                    data: { message: 'No items' }, // Not an array!
                },
            };
            var result = extractDataArray(response);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result.length).toBe(0);
        });
        (0, vitest_1.it)('should return empty array for unexpected structure', function () {
            var response = {
                unexpected: 'structure',
                with: { nested: 'data' },
            };
            var result = extractDataArray(response);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result.length).toBe(0);
        });
    });
    (0, vitest_1.describe)('Regression Tests', function () {
        (0, vitest_1.it)('should prevent "Unexpected response format" for double-nested structure', function () {
            // This is the exact structure that caused the technicians bug
            var response = {
                data: {
                    data: [
                        { id: 'tech-1', first_name: 'John', last_name: 'Doe' },
                        { id: 'tech-2', first_name: 'Jane', last_name: 'Smith' },
                    ],
                    pagination: { page: 1, limit: 20, total: 2 },
                    success: true,
                },
                meta: { version: '2.0', count: 2 },
            };
            var result = extractDataArray(response);
            // Should extract correctly, not return empty array
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result.length).toBe(2);
            (0, vitest_1.expect)(result[0]).toHaveProperty('id', 'tech-1');
            (0, vitest_1.expect)(result[0]).toHaveProperty('first_name', 'John');
        });
        (0, vitest_1.it)('should handle empty double-nested structure', function () {
            var response = {
                data: {
                    data: [],
                    pagination: { page: 1, limit: 20, total: 0 },
                },
                meta: { version: '2.0', count: 0 },
            };
            var result = extractDataArray(response);
            (0, vitest_1.expect)(Array.isArray(result)).toBe(true);
            (0, vitest_1.expect)(result.length).toBe(0);
        });
    });
    (0, vitest_1.describe)('Pattern Detection', function () {
        (0, vitest_1.it)('should detect double-nested structure', function () {
            var _a;
            var response = {
                data: {
                    data: [{ id: '1' }],
                },
            };
            var isDoubleNested = ((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.data) && Array.isArray(response.data.data);
            (0, vitest_1.expect)(isDoubleNested).toBe(true);
        });
        (0, vitest_1.it)('should detect single-nested structure', function () {
            var response = {
                data: [{ id: '1' }],
            };
            var isSingleNested = (response === null || response === void 0 ? void 0 : response.data) && Array.isArray(response.data);
            (0, vitest_1.expect)(isSingleNested).toBe(true);
        });
    });
});
