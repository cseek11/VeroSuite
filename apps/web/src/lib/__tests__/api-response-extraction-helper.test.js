"use strict";
/**
 * API Response Extraction Helper Tests
 *
 * Tests for a reusable helper function that extracts data arrays
 * from various response structures. This can be used across
 * all API clients to prevent similar bugs.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
/**
 * Helper function to extract data array from various response structures
 * Handles:
 * - { data: { data: [...] } } (double-nested)
 * - { data: [...] } (single-nested)
 * - [...] (direct array)
 * - { items: [...] } (alternative format)
 */
function extractDataArray(response, dataKey) {
    var _a, _b;
    if (dataKey === void 0) { dataKey = 'data'; }
    // Check for double-nested: { data: { data: [...] } }
    if (((_a = response === null || response === void 0 ? void 0 : response[dataKey]) === null || _a === void 0 ? void 0 : _a[dataKey]) && Array.isArray(response[dataKey][dataKey])) {
        return response[dataKey][dataKey];
    }
    // Check for single-nested: { data: [...] }
    if ((response === null || response === void 0 ? void 0 : response[dataKey]) && Array.isArray(response[dataKey])) {
        return response[dataKey];
    }
    // Check for direct array
    if (Array.isArray(response)) {
        return response;
    }
    // Check for alternative key (e.g., { technicians: [...] })
    var alternativeKeys = ['technicians', 'items', 'results', 'list'];
    for (var _i = 0, alternativeKeys_1 = alternativeKeys; _i < alternativeKeys_1.length; _i++) {
        var key = alternativeKeys_1[_i];
        if ((response === null || response === void 0 ? void 0 : response[key]) && Array.isArray(response[key])) {
            return response[key];
        }
    }
    // Check for nested alternative key (e.g., { data: { technicians: [...] } })
    for (var _c = 0, alternativeKeys_2 = alternativeKeys; _c < alternativeKeys_2.length; _c++) {
        var key = alternativeKeys_2[_c];
        if (((_b = response === null || response === void 0 ? void 0 : response[dataKey]) === null || _b === void 0 ? void 0 : _b[key]) && Array.isArray(response[dataKey][key])) {
            return response[dataKey][key];
        }
    }
    return [];
}
(0, vitest_1.describe)('extractDataArray Helper Function', function () {
    (0, vitest_1.describe)('Double-Nested Structure', function () {
        (0, vitest_1.it)('should extract from { data: { data: [...] } }', function () {
            var response = {
                data: {
                    data: [{ id: '1' }, { id: '2' }],
                    pagination: {},
                },
                meta: {},
            };
            var result = extractDataArray(response);
            (0, vitest_1.expect)(result).toEqual([{ id: '1' }, { id: '2' }]);
            (0, vitest_1.expect)(result.length).toBe(2);
        });
        (0, vitest_1.it)('should extract from { data: { technicians: [...] } }', function () {
            var response = {
                data: {
                    technicians: [{ id: '1' }, { id: '2' }],
                    total: 2,
                },
                meta: {},
            };
            var result = extractDataArray(response);
            (0, vitest_1.expect)(result).toEqual([{ id: '1' }, { id: '2' }]);
            (0, vitest_1.expect)(result.length).toBe(2);
        });
    });
    (0, vitest_1.describe)('Single-Nested Structure', function () {
        (0, vitest_1.it)('should extract from { data: [...] }', function () {
            var response = {
                data: [{ id: '1' }, { id: '2' }],
                meta: {},
            };
            var result = extractDataArray(response);
            (0, vitest_1.expect)(result).toEqual([{ id: '1' }, { id: '2' }]);
            (0, vitest_1.expect)(result.length).toBe(2);
        });
    });
    (0, vitest_1.describe)('Direct Array', function () {
        (0, vitest_1.it)('should extract from direct array', function () {
            var response = [{ id: '1' }, { id: '2' }];
            var result = extractDataArray(response);
            (0, vitest_1.expect)(result).toEqual([{ id: '1' }, { id: '2' }]);
            (0, vitest_1.expect)(result.length).toBe(2);
        });
    });
    (0, vitest_1.describe)('Alternative Formats', function () {
        (0, vitest_1.it)('should extract from { items: [...] }', function () {
            var response = {
                items: [{ id: '1' }, { id: '2' }],
            };
            var result = extractDataArray(response);
            (0, vitest_1.expect)(result).toEqual([{ id: '1' }, { id: '2' }]);
            (0, vitest_1.expect)(result.length).toBe(2);
        });
        (0, vitest_1.it)('should extract from { results: [...] }', function () {
            var response = {
                results: [{ id: '1' }, { id: '2' }],
            };
            var result = extractDataArray(response);
            (0, vitest_1.expect)(result).toEqual([{ id: '1' }, { id: '2' }]);
            (0, vitest_1.expect)(result.length).toBe(2);
        });
    });
    (0, vitest_1.describe)('Edge Cases', function () {
        (0, vitest_1.it)('should return empty array for null response', function () {
            var result = extractDataArray(null);
            (0, vitest_1.expect)(result).toEqual([]);
            (0, vitest_1.expect)(result.length).toBe(0);
        });
        (0, vitest_1.it)('should return empty array for undefined response', function () {
            var result = extractDataArray(undefined);
            (0, vitest_1.expect)(result).toEqual([]);
            (0, vitest_1.expect)(result.length).toBe(0);
        });
        (0, vitest_1.it)('should return empty array for empty object', function () {
            var result = extractDataArray({});
            (0, vitest_1.expect)(result).toEqual([]);
            (0, vitest_1.expect)(result.length).toBe(0);
        });
        (0, vitest_1.it)('should return empty array when data is not an array', function () {
            var response = {
                data: { message: 'No items' },
            };
            var result = extractDataArray(response);
            (0, vitest_1.expect)(result).toEqual([]);
            (0, vitest_1.expect)(result.length).toBe(0);
        });
    });
    (0, vitest_1.describe)('Real-World Examples', function () {
        (0, vitest_1.it)('should handle technicians response structure', function () {
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
            (0, vitest_1.expect)(result.length).toBe(2);
            (0, vitest_1.expect)(result[0]).toHaveProperty('id', 'tech-1');
            (0, vitest_1.expect)(result[0]).toHaveProperty('first_name', 'John');
        });
        (0, vitest_1.it)('should handle accounts response structure', function () {
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
            (0, vitest_1.expect)(result.length).toBe(1);
            (0, vitest_1.expect)(result[0]).toHaveProperty('id', 'acc-1');
        });
    });
});
