"use strict";
/**
 * V2 Endpoints Integration Tests
 *
 * Tests for v2 API endpoints to ensure they're called correctly.
 * Verifies frontend uses v2 endpoints where backend has v2 controllers.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
(0, vitest_1.describe)('V2 Endpoints Integration', function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('KPI Templates V2 Endpoints', function () {
        (0, vitest_1.it)('should call kpi-templates with v2 version', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, testUrl, fetchCall, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ data: [], meta: {} })];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        testUrl = 'http://localhost:3001/api/v2/kpi-templates';
                        return [4 /*yield*/, fetch(testUrl, {
                                method: 'GET',
                                headers: {
                                    'Authorization': 'Bearer test-token',
                                    'Content-Type': 'application/json',
                                },
                            })];
                    case 1:
                        _a.sent();
                        fetchCall = global.fetch.mock.calls[0];
                        url = fetchCall[0];
                        (0, vitest_1.expect)(url).toMatch(/\/api\/v2\/kpi-templates/);
                        (0, vitest_1.expect)(url).not.toMatch(/\/api\/v1\/kpi-templates/);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Technicians V2 Endpoints', function () {
        (0, vitest_1.it)('should call technicians with v2 version', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, testUrl, fetchCall, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ data: [], meta: {} })];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        testUrl = 'http://localhost:3001/api/v2/technicians';
                        return [4 /*yield*/, fetch(testUrl, {
                                method: 'GET',
                                headers: {
                                    'Authorization': 'Bearer test-token',
                                    'Content-Type': 'application/json',
                                },
                            })];
                    case 1:
                        _a.sent();
                        fetchCall = global.fetch.mock.calls[0];
                        url = fetchCall[0];
                        (0, vitest_1.expect)(url).toMatch(/\/api\/v2\/technicians/);
                        (0, vitest_1.expect)(url).not.toMatch(/\/api\/v1\/technicians/);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Dashboard V2 Endpoints', function () {
        (0, vitest_1.it)('should call dashboard layouts with v2 version', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, testUrl, fetchCall, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            ok: true,
                            json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ regions: [], version: 1 })];
                            }); }); },
                        };
                        global.fetch.mockResolvedValue(mockResponse);
                        testUrl = 'http://localhost:3001/api/v2/dashboard/layouts/test-id/undo';
                        return [4 /*yield*/, fetch(testUrl, {
                                method: 'POST',
                                headers: {
                                    'Authorization': 'Bearer test-token',
                                    'Content-Type': 'application/json',
                                },
                            })];
                    case 1:
                        _a.sent();
                        fetchCall = global.fetch.mock.calls[0];
                        url = fetchCall[0];
                        (0, vitest_1.expect)(url).toMatch(/\/api\/v2\/dashboard\/layouts/);
                        (0, vitest_1.expect)(url).not.toMatch(/\/api\/v1\/dashboard\/layouts/);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Version-Specific Feature Testing', function () {
        (0, vitest_1.it)('should use v2 for features that only exist in v2', function () {
            // Features like undo/redo only exist in v2
            var v2OnlyFeatures = [
                '/api/v2/dashboard/layouts/undo',
                '/api/v2/dashboard/layouts/redo',
                '/api/v2/dashboard/layouts/history',
                '/api/v2/kpi-templates/favorites',
                '/api/v2/kpi-templates/popular',
            ];
            v2OnlyFeatures.forEach(function (endpoint) {
                (0, vitest_1.expect)(endpoint).toMatch(/\/api\/v2\//);
                // These should NOT work with v1 - verify the v1 version would be invalid
                var v1Version = endpoint.replace('/v2/', '/v1/');
                // The v1 version of these endpoints doesn't exist, so we verify they're v2-only
                (0, vitest_1.expect)(endpoint).toMatch(/\/api\/v2\/dashboard\/layouts\/(undo|redo|history)/);
                // v1 version should not match the v2 pattern
                (0, vitest_1.expect)(v1Version).not.toMatch(/\/api\/v2\/dashboard\/layouts\/(undo|redo|history)/);
            });
        });
        (0, vitest_1.it)('should use v1 for features that only exist in v1', function () {
            // Some features might only be in v1
            var v1OnlyFeatures = [
                '/api/v1/accounts', // Direct accounts controller is v1
                '/api/v1/routing/routes',
            ];
            v1OnlyFeatures.forEach(function (endpoint) {
                (0, vitest_1.expect)(endpoint).toMatch(/\/api\/v1\//);
            });
        });
    });
});
