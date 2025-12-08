"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var react_1 = require("@testing-library/react");
var vitest_1 = require("vitest");
var useRegionLayout_1 = require("../useRegionLayout");
var region_types_1 = require("@/routes/dashboard/types/region.types");
var enhancedApi = __importStar(require("@/lib/enhanced-api"));
// Mock the enhanced API
vitest_1.vi.mock('@/lib/enhanced-api', function () { return ({
    enhancedApi: {
        dashboardLayouts: {
            listRegions: vitest_1.vi.fn(),
            createRegion: vitest_1.vi.fn(),
            updateRegion: vitest_1.vi.fn(),
            deleteRegion: vitest_1.vi.fn(),
            reorderRegions: vitest_1.vi.fn(),
            getRoleDefaults: vitest_1.vi.fn()
        }
    }
}); });
// Mock the region store
var mockLoadRegions = vitest_1.vi.fn().mockResolvedValue([]);
var mockAddRegion = vitest_1.vi.fn();
var mockRemoveRegion = vitest_1.vi.fn();
var mockUpdateRegion = vitest_1.vi.fn();
var mockReorderRegions = vitest_1.vi.fn();
var mockFlushUpdates = vitest_1.vi.fn();
// Create a mutable mock state that can be updated
var mockErrors = new Map();
var mockLoading = new Set();
vitest_1.vi.mock('@/stores/regionStore', function () { return ({
    useRegionStore: vitest_1.vi.fn(function (selector) {
        var mockState = {
            regions: new Map(),
            loading: mockLoading,
            errors: mockErrors,
            conflicts: new Map(),
            getRegionsByLayout: function () { return []; },
            loadRegions: mockLoadRegions,
            addRegion: mockAddRegion,
            updateRegion: mockUpdateRegion,
            removeRegion: mockRemoveRegion,
            reorderRegions: mockReorderRegions,
            flushUpdates: mockFlushUpdates
        };
        return selector(mockState);
    })
}); });
(0, vitest_1.describe)('useRegionLayout', function () {
    var layoutId = 'test-layout-id';
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        mockErrors = new Map();
        mockLoading = new Set();
    });
    (0, vitest_1.it)('should load regions on mount', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockRegions, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockRegions = [
                        {
                            id: '1',
                            layout_id: layoutId,
                            region_type: region_types_1.RegionType.SCHEDULING,
                            grid_row: 0,
                            grid_col: 0,
                            row_span: 1,
                            col_span: 1
                        }
                    ];
                    vitest_1.vi.mocked(enhancedApi.enhancedApi.dashboardLayouts.listRegions).mockResolvedValue(mockRegions);
                    mockLoadRegions.mockResolvedValue(mockRegions);
                    result = (0, react_1.renderHook)(function () {
                        return (0, useRegionLayout_1.useRegionLayout)({ layoutId: layoutId, autoSave: true });
                    }).result;
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            (0, vitest_1.expect)(result.current.loading).toBe(false);
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mockLoadRegions).toHaveBeenCalledWith(layoutId);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should add a region', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockRegion, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockRegion = {
                        id: 'new-region',
                        layout_id: layoutId,
                        region_type: region_types_1.RegionType.ANALYTICS,
                        grid_row: 0,
                        grid_col: 0,
                        row_span: 1,
                        col_span: 1
                    };
                    vitest_1.vi.mocked(enhancedApi.enhancedApi.dashboardLayouts.createRegion).mockResolvedValue(mockRegion);
                    mockAddRegion.mockResolvedValue(undefined);
                    result = (0, react_1.renderHook)(function () {
                        return (0, useRegionLayout_1.useRegionLayout)({ layoutId: layoutId, autoSave: true });
                    }).result;
                    return [4 /*yield*/, (0, react_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, result.current.addRegion(region_types_1.RegionType.ANALYTICS)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mockAddRegion).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should remove a region', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.mocked(enhancedApi.enhancedApi.dashboardLayouts.deleteRegion).mockResolvedValue({ success: true });
                    mockRemoveRegion.mockResolvedValue(undefined);
                    result = (0, react_1.renderHook)(function () {
                        return (0, useRegionLayout_1.useRegionLayout)({ layoutId: layoutId, autoSave: true });
                    }).result;
                    return [4 /*yield*/, (0, react_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, result.current.removeRegion('region-id')];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(mockRemoveRegion).toHaveBeenCalledWith(layoutId, 'region-id');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should update region position', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = (0, react_1.renderHook)(function () {
                        return (0, useRegionLayout_1.useRegionLayout)({ layoutId: layoutId, autoSave: true });
                    }).result;
                    return [4 /*yield*/, (0, react_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, result.current.updateRegionPosition('region-id', 2, 3)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    // Verify update was called (through store)
                    (0, vitest_1.expect)(result.current.error).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should handle errors gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
        var error, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    error = new Error('Failed to load regions');
                    vitest_1.vi.mocked(enhancedApi.enhancedApi.dashboardLayouts.listRegions).mockRejectedValue(error);
                    mockLoadRegions.mockRejectedValue(error);
                    // Set error in mock store
                    mockErrors.set(layoutId, error);
                    result = (0, react_1.renderHook)(function () {
                        return (0, useRegionLayout_1.useRegionLayout)({ layoutId: layoutId, autoSave: true });
                    }).result;
                    return [4 /*yield*/, (0, react_1.waitFor)(function () {
                            (0, vitest_1.expect)(result.current.error).toBeTruthy();
                        }, { timeout: 3000 })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)((_a = result.current.error) === null || _a === void 0 ? void 0 : _a.message).toBe('Failed to load regions');
                    return [2 /*return*/];
            }
        });
    }); });
});
