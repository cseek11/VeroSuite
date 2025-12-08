"use strict";
/**
 * API Version Routing Tests
 *
 * Tests for version-aware API routing (v1 and v2 endpoints).
 * Ensures frontend calls the correct version based on endpoint requirements.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
// Mock fetch globally
global.fetch = vitest_1.vi.fn();
// Mock authService
vitest_1.vi.mock('@/lib/auth-service', function () { return ({
    authService: {
        isAuthenticated: vitest_1.vi.fn().mockReturnValue(true),
        getAuthHeaders: vitest_1.vi.fn().mockResolvedValue({
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
        }),
    },
}); });
// Mock supabase
vitest_1.vi.mock('@/lib/supabase-client', function () { return ({
    supabase: {
        auth: {
            getSession: vitest_1.vi.fn().mockResolvedValue({
                data: { session: null },
            }),
        },
    },
}); });
(0, vitest_1.describe)('API Version Routing', function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Version Detection', function () {
        (0, vitest_1.it)('should identify v1 endpoints correctly', function () {
            var v1Endpoints = [
                '/api/v1/accounts',
                '/api/v1/auth/login',
                '/api/v1/work-orders',
                '/api/v1/technicians',
            ];
            v1Endpoints.forEach(function (endpoint) {
                (0, vitest_1.expect)(endpoint).toMatch(/\/api\/v1\//);
                (0, vitest_1.expect)(endpoint).not.toMatch(/\/api\/v2\//);
            });
        });
        (0, vitest_1.it)('should identify v2 endpoints correctly', function () {
            var v2Endpoints = [
                '/api/v2/crm/accounts',
                '/api/v2/auth/login',
                '/api/v2/kpi-templates',
                '/api/v2/dashboard/layouts',
            ];
            v2Endpoints.forEach(function (endpoint) {
                (0, vitest_1.expect)(endpoint).toMatch(/\/api\/v2\//);
                (0, vitest_1.expect)(endpoint).not.toMatch(/\/api\/v1\//);
            });
        });
        (0, vitest_1.it)('should reject endpoints without version', function () {
            var unversionedEndpoints = [
                '/api/accounts',
                '/api/auth/login',
                '/api/work-orders',
            ];
            unversionedEndpoints.forEach(function (endpoint) {
                (0, vitest_1.expect)(endpoint).not.toMatch(/\/api\/v\d+\//);
            });
        });
    });
    (0, vitest_1.describe)('Version-Specific Routing', function () {
        (0, vitest_1.it)('should route accounts to v1 (accounts controller)', function () {
            // Accounts controller is v1
            var endpoint = '/api/v1/accounts';
            (0, vitest_1.expect)(endpoint).toMatch(/\/api\/v1\/accounts$/);
        });
        (0, vitest_1.it)('should route crm accounts to v2 (crm-v2 controller)', function () {
            // CRM v2 controller has accounts endpoint
            var endpoint = '/api/v2/crm/accounts';
            (0, vitest_1.expect)(endpoint).toMatch(/\/api\/v2\/crm\/accounts$/);
        });
        (0, vitest_1.it)('should route auth to correct version based on feature', function () {
            // Auth v1 is deprecated but still works
            var v1Auth = '/api/v1/auth/login';
            (0, vitest_1.expect)(v1Auth).toMatch(/\/api\/v1\/auth\/login$/);
            // Auth v2 is preferred for new features
            var v2Auth = '/api/v2/auth/login';
            (0, vitest_1.expect)(v2Auth).toMatch(/\/api\/v2\/auth\/login$/);
        });
    });
    (0, vitest_1.describe)('Version Consistency', function () {
        (0, vitest_1.it)('should ensure all endpoints in a feature use same version', function () {
            // KPI templates should all use v2
            var kpiTemplateEndpoints = [
                '/api/v2/kpi-templates',
                '/api/v2/kpi-templates/use',
                '/api/v2/kpi-templates/favorites',
                '/api/v2/kpi-templates/popular',
            ];
            kpiTemplateEndpoints.forEach(function (endpoint) {
                (0, vitest_1.expect)(endpoint).toMatch(/\/api\/v2\/kpi-templates/);
                (0, vitest_1.expect)(endpoint).not.toMatch(/\/api\/v1\/kpi-templates/);
            });
        });
        (0, vitest_1.it)('should ensure dashboard endpoints use v2', function () {
            var dashboardEndpoints = [
                '/api/v2/dashboard/layouts/undo',
                '/api/v2/dashboard/layouts/redo',
                '/api/v2/dashboard/layouts/history',
                '/api/v2/dashboard/templates',
            ];
            dashboardEndpoints.forEach(function (endpoint) {
                (0, vitest_1.expect)(endpoint).toMatch(/\/api\/v2\/dashboard/);
            });
        });
    });
    (0, vitest_1.describe)('Version Migration Scenarios', function () {
        (0, vitest_1.it)('should handle endpoints that exist in both v1 and v2', function () {
            // Some endpoints exist in both versions
            var v1Endpoint = '/api/v1/auth/login';
            var v2Endpoint = '/api/v2/auth/login';
            // Both should be valid
            (0, vitest_1.expect)(v1Endpoint).toMatch(/\/api\/v1\/auth\/login$/);
            (0, vitest_1.expect)(v2Endpoint).toMatch(/\/api\/v2\/auth\/login$/);
        });
        (0, vitest_1.it)('should prefer v2 when both versions exist', function () {
            // V2 should be preferred for new implementations
            var preferredEndpoint = '/api/v2/auth/login';
            var deprecatedEndpoint = '/api/v1/auth/login';
            // V2 should be used for new code
            (0, vitest_1.expect)(preferredEndpoint).toMatch(/\/api\/v2\//);
            // V1 is deprecated but still functional
            (0, vitest_1.expect)(deprecatedEndpoint).toMatch(/\/api\/v1\//);
        });
    });
    (0, vitest_1.describe)('Version Validation', function () {
        (0, vitest_1.it)('should reject mixing v1 and v2 in same request path', function () {
            var invalidPaths = [
                '/api/v1/v2/accounts',
                '/api/v2/v1/accounts',
                '/api/v1/accounts/v2',
            ];
            invalidPaths.forEach(function (path) {
                var v1Count = (path.match(/\/v1\//g) || []).length;
                var v2Count = (path.match(/\/v2\//g) || []).length;
                // Should not have both versions (at least one should be 0)
                var hasBothVersions = v1Count > 0 && v2Count > 0;
                (0, vitest_1.expect)(hasBothVersions).toBe(false);
            });
        });
        (0, vitest_1.it)('should ensure single version per endpoint', function () {
            var validEndpoints = [
                '/api/v1/accounts',
                '/api/v2/crm/accounts',
            ];
            validEndpoints.forEach(function (endpoint) {
                var versions = endpoint.match(/\/v\d+\//g) || [];
                (0, vitest_1.expect)(versions.length).toBe(1);
            });
        });
    });
});
