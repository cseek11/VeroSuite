"use strict";
/**
 * UUID Validation Pattern Tests
 *
 * Tests for UUID validation pattern that should be applied
 * to all API clients that accept UUID parameters.
 *
 * This prevents "Validation failed (uuid is expected)" errors
 * by validating UUIDs before making API calls.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
/**
 * UUID validation helper - should be used across all API clients
 */
function isValidUUID(str) {
    if (!str || typeof str !== 'string')
        return false;
    var uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}
(0, vitest_1.describe)('UUID Validation Pattern', function () {
    (0, vitest_1.describe)('Valid UUIDs', function () {
        (0, vitest_1.it)('should accept standard UUID v4 format', function () {
            var validUUIDs = [
                '123e4567-e89b-12d3-a456-426614174000',
                '7193113e-ece2-4f7b-ae8c-176df4367e28',
                '00000000-0000-0000-0000-000000000000',
                'ffffffff-ffff-ffff-ffff-ffffffffffff',
                '550e8400-e29b-41d4-a716-446655440000',
            ];
            validUUIDs.forEach(function (uuid) {
                (0, vitest_1.expect)(isValidUUID(uuid)).toBe(true);
            });
        });
        (0, vitest_1.it)('should accept uppercase UUIDs', function () {
            (0, vitest_1.expect)(isValidUUID('123E4567-E89B-12D3-A456-426614174000')).toBe(true);
        });
        (0, vitest_1.it)('should accept mixed case UUIDs', function () {
            (0, vitest_1.expect)(isValidUUID('123e4567-E89b-12D3-a456-426614174000')).toBe(true);
        });
    });
    (0, vitest_1.describe)('Invalid UUIDs', function () {
        (0, vitest_1.it)('should reject empty string', function () {
            (0, vitest_1.expect)(isValidUUID('')).toBe(false);
        });
        (0, vitest_1.it)('should reject undefined', function () {
            (0, vitest_1.expect)(isValidUUID(undefined)).toBe(false);
        });
        (0, vitest_1.it)('should reject null', function () {
            (0, vitest_1.expect)(isValidUUID(null)).toBe(false);
        });
        (0, vitest_1.it)('should reject non-string types', function () {
            (0, vitest_1.expect)(isValidUUID(123)).toBe(false);
            (0, vitest_1.expect)(isValidUUID({})).toBe(false);
            (0, vitest_1.expect)(isValidUUID([])).toBe(false);
        });
        (0, vitest_1.it)('should reject invalid formats', function () {
            var invalidUUIDs = [
                'not-a-uuid',
                '123',
                'abc-def-ghi',
                '12345678-1234-1234-1234-1234567890123', // Too long
                '1234567-1234-1234-1234-123456789012', // Too short
                '12345678-123-1234-1234-123456789012', // Invalid segment length
                '12345678-1234-123-1234-123456789012', // Invalid segment length
                '12345678-1234-1234-123-123456789012', // Invalid segment length
                '12345678-1234-1234-1234-12345678901', // Invalid segment length
                '12345678-1234-1234-1234-1234567890123', // Too long
                '12345678-1234-1234-1234-1234567890', // Too short
                '12345678-1234-1234-1234-123456789012-extra', // Extra characters
                '12345678-1234-1234-1234', // Missing segment
                '12345678-1234-1234', // Missing segments
                '12345678-1234', // Missing segments
                '12345678', // Missing segments
            ];
            invalidUUIDs.forEach(function (uuid) {
                (0, vitest_1.expect)(isValidUUID(uuid)).toBe(false);
            });
        });
        (0, vitest_1.it)('should reject UUIDs with invalid characters', function () {
            var invalidUUIDs = [
                '12345678-1234-1234-1234-12345678901g', // Invalid character 'g'
                '12345678-1234-1234-1234-12345678901G', // Invalid character 'G'
                '12345678-1234-1234-1234-12345678901z', // Invalid character 'z'
                '12345678-1234-1234-1234-12345678901!', // Invalid character '!'
                '12345678-1234-1234-1234-12345678901@', // Invalid character '@'
            ];
            invalidUUIDs.forEach(function (uuid) {
                (0, vitest_1.expect)(isValidUUID(uuid)).toBe(false);
            });
        });
    });
    (0, vitest_1.describe)('Edge Cases', function () {
        (0, vitest_1.it)('should handle whitespace', function () {
            (0, vitest_1.expect)(isValidUUID(' 123e4567-e89b-12d3-a456-426614174000 ')).toBe(false);
            (0, vitest_1.expect)(isValidUUID('123e4567-e89b-12d3-a456-426614174000 ')).toBe(false);
            (0, vitest_1.expect)(isValidUUID(' 123e4567-e89b-12d3-a456-426614174000')).toBe(false);
        });
        (0, vitest_1.it)('should handle special characters', function () {
            (0, vitest_1.expect)(isValidUUID('123e4567-e89b-12d3-a456-42661417400!')).toBe(false);
            (0, vitest_1.expect)(isValidUUID('123e4567-e89b-12d3-a456-42661417400@')).toBe(false);
            (0, vitest_1.expect)(isValidUUID('123e4567-e89b-12d3-a456-42661417400#')).toBe(false);
        });
    });
    (0, vitest_1.describe)('Usage Pattern', function () {
        (0, vitest_1.it)('should be used before API calls', function () {
            var id = '123e4567-e89b-12d3-a456-426614174000';
            // Pattern: Validate before API call
            if (!isValidUUID(id)) {
                throw new Error("Invalid ID: \"".concat(id, "\". ID must be a valid UUID."));
            }
            // Would proceed with API call here
            (0, vitest_1.expect)(id).toBe('123e4567-e89b-12d3-a456-426614174000');
        });
        (0, vitest_1.it)('should prevent API calls with invalid IDs', function () {
            var invalidId = '';
            // Pattern: Validate before API call
            if (!isValidUUID(invalidId)) {
                // Should throw error, preventing API call
                (0, vitest_1.expect)(function () {
                    if (!isValidUUID(invalidId)) {
                        throw new Error("Invalid ID: \"".concat(invalidId, "\". ID must be a valid UUID."));
                    }
                }).toThrow();
            }
        });
    });
    (0, vitest_1.describe)('Similar Endpoints Pattern', function () {
        (0, vitest_1.it)('should validate customer IDs', function () {
            var customerId = '123e4567-e89b-12d3-a456-426614174000';
            (0, vitest_1.expect)(isValidUUID(customerId)).toBe(true);
        });
        (0, vitest_1.it)('should validate technician IDs', function () {
            var technicianId = '123e4567-e89b-12d3-a456-426614174000';
            (0, vitest_1.expect)(isValidUUID(technicianId)).toBe(true);
        });
        (0, vitest_1.it)('should validate account IDs', function () {
            var accountId = '123e4567-e89b-12d3-a456-426614174000';
            (0, vitest_1.expect)(isValidUUID(accountId)).toBe(true);
        });
        (0, vitest_1.it)('should validate job IDs', function () {
            var jobId = '123e4567-e89b-12d3-a456-426614174000';
            (0, vitest_1.expect)(isValidUUID(jobId)).toBe(true);
        });
    });
});
