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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRegionLayout = useRegionLayout;
var react_1 = require("react");
var regionStore_1 = require("@/stores/regionStore");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
/**
 * Hook that wraps the Zustand region store for backward compatibility
 * Provides the same interface as the old useState-based implementation
 */
function useRegionLayout(_a) {
    var _this = this;
    var layoutId = _a.layoutId, _b = _a.autoSave, autoSave = _b === void 0 ? true : _b, _c = _a.debounceMs, _debounceMs = _c === void 0 ? 500 : _c;
    // Get store state and actions
    var regions = (0, regionStore_1.useRegionStore)(function (state) { return state.getRegionsByLayout(layoutId); });
    var loading = (0, regionStore_1.useRegionStore)(function (state) { return state.loading.has(layoutId); });
    var error = (0, regionStore_1.useRegionStore)(function (state) { return state.errors.get(layoutId) || null; });
    var loadRegions = (0, regionStore_1.useRegionStore)(function (state) { return state.loadRegions; });
    var addRegionStore = (0, regionStore_1.useRegionStore)(function (state) { return state.addRegion; });
    var updateRegionStore = (0, regionStore_1.useRegionStore)(function (state) { return state.updateRegion; });
    var removeRegionStore = (0, regionStore_1.useRegionStore)(function (state) { return state.removeRegion; });
    var reorderRegionsStore = (0, regionStore_1.useRegionStore)(function (state) { return state.reorderRegions; });
    var flushUpdates = (0, regionStore_1.useRegionStore)(function (state) { return state.flushUpdates; });
    // Load regions on mount and when layoutId changes
    (0, react_1.useEffect)(function () {
        if (layoutId) {
            loadRegions(layoutId).catch(function (err) {
                logger_1.logger.error('Failed to load regions', { error: err, layoutId: layoutId }, 'useRegionLayout');
            });
        }
    }, [layoutId, loadRegions]);
    // Convert VersionedRegion[] to DashboardRegion[] for backward compatibility
    var dashboardRegions = (0, react_1.useMemo)(function () {
        return regions.map(function (r) {
            var version = r.version, optimistic = r.optimistic, pendingUpdate = r.pendingUpdate, region = __rest(r, ["version", "optimistic", "pendingUpdate"]);
            return region;
        });
    }, [regions]);
    // Add region
    var addRegion = (0, react_1.useCallback)(function (type, position) { return __awaiter(_this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, addRegionStore(layoutId, type, position)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    logger_1.logger.error('Failed to add region', { error: err_1, layoutId: layoutId, type: type }, 'useRegionLayout');
                    throw err_1;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [layoutId, addRegionStore]);
    // Remove region
    var removeRegion = (0, react_1.useCallback)(function (id) { return __awaiter(_this, void 0, void 0, function () {
        var err_2, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, removeRegionStore(layoutId, id)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    errorMessage = err_2 instanceof Error ? err_2.message : 'Failed to remove region';
                    logger_1.logger.error('Failed to remove region', { error: err_2, layoutId: layoutId, regionId: id }, 'useRegionLayout');
                    toast_1.toast.error("Failed to remove region: ".concat(errorMessage));
                    throw err_2;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [layoutId, removeRegionStore]);
    // Update region position
    var updateRegionPosition = (0, react_1.useCallback)(function (id, row, col) { return __awaiter(_this, void 0, void 0, function () {
        var current, clampedRow, clampedCol, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    current = regions.find(function (r) { return r.id === id; });
                    clampedRow = Math.max(0, row);
                    clampedCol = Math.max(0, Math.min(col, 11));
                    if (current === null || current === void 0 ? void 0 : current.col_span) {
                        // Ensure col + span <= 12
                        clampedCol = Math.min(clampedCol, 12 - current.col_span);
                        clampedCol = Math.max(0, clampedCol);
                    }
                    return [4 /*yield*/, updateRegionStore(layoutId, id, { grid_row: clampedRow, grid_col: clampedCol }, autoSave)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    logger_1.logger.error('Failed to update region position', { error: err_3, layoutId: layoutId, regionId: id }, 'useRegionLayout');
                    throw err_3;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [layoutId, updateRegionStore, autoSave]);
    // Update region size
    var updateRegionSize = (0, react_1.useCallback)(function (id, rowSpan, colSpan) { return __awaiter(_this, void 0, void 0, function () {
        var current, clampedRowSpan, clampedColSpan, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    current = regions.find(function (r) { return r.id === id; });
                    clampedRowSpan = Math.max(1, Math.min(rowSpan, 20));
                    clampedColSpan = Math.max(1, Math.min(colSpan, 12));
                    if ((current === null || current === void 0 ? void 0 : current.grid_col) !== undefined) {
                        // Ensure col + span <= 12
                        clampedColSpan = Math.min(clampedColSpan, 12 - current.grid_col);
                        clampedColSpan = Math.max(1, clampedColSpan);
                    }
                    return [4 /*yield*/, updateRegionStore(layoutId, id, { row_span: clampedRowSpan, col_span: clampedColSpan }, autoSave)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _a.sent();
                    logger_1.logger.error('Failed to update region size', { error: err_4, layoutId: layoutId, regionId: id }, 'useRegionLayout');
                    throw err_4;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [layoutId, updateRegionStore, autoSave, regions]);
    // Reorder regions
    var reorderRegions = (0, react_1.useCallback)(function (regionIds) { return __awaiter(_this, void 0, void 0, function () {
        var err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, reorderRegionsStore(layoutId, regionIds)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_5 = _a.sent();
                    logger_1.logger.error('Failed to reorder regions', { error: err_5, layoutId: layoutId }, 'useRegionLayout');
                    throw err_5;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [layoutId, reorderRegionsStore]);
    // Toggle collapse
    var toggleCollapse = (0, react_1.useCallback)(function (id) { return __awaiter(_this, void 0, void 0, function () {
        var region, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    region = regions.find(function (r) { return r.id === id; });
                    if (!region) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    // Save immediately for collapse (no debounce)
                    return [4 /*yield*/, updateRegionStore(layoutId, id, { is_collapsed: !region.is_collapsed }, false)];
                case 2:
                    // Save immediately for collapse (no debounce)
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_6 = _a.sent();
                    logger_1.logger.error('Failed to toggle collapse', { error: err_6, regionId: id, layoutId: layoutId }, 'useRegionLayout');
                    throw err_6;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [layoutId, regions, updateRegionStore]);
    // Toggle lock
    var toggleLock = (0, react_1.useCallback)(function (id) { return __awaiter(_this, void 0, void 0, function () {
        var region, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    region = regions.find(function (r) { return r.id === id; });
                    if (!region) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, updateRegionStore(layoutId, id, { is_locked: !region.is_locked }, autoSave)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_7 = _a.sent();
                    logger_1.logger.error('Failed to toggle lock', { error: err_7, regionId: id, layoutId: layoutId }, 'useRegionLayout');
                    throw err_7;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [layoutId, regions, updateRegionStore, autoSave]);
    // Update region (generic update method)
    var updateRegion = (0, react_1.useCallback)(function (id, updates) { return __awaiter(_this, void 0, void 0, function () {
        var err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, updateRegionStore(layoutId, id, updates, autoSave)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_8 = _a.sent();
                    logger_1.logger.error('Failed to update region', { error: err_8, layoutId: layoutId, regionId: id, updates: updates }, 'useRegionLayout');
                    throw err_8;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [layoutId, updateRegionStore, autoSave]);
    // Load role defaults
    var loadRoleDefaults = (0, react_1.useCallback)(function (role) { return __awaiter(_this, void 0, void 0, function () {
        var enhancedApi, defaults, _i, defaults_1, defaultRegion, err_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('@/lib/enhanced-api')); })];
                case 1:
                    enhancedApi = (_a.sent()).enhancedApi;
                    return [4 /*yield*/, enhancedApi.dashboardLayouts.getRoleDefaults(role)];
                case 2:
                    defaults = _a.sent();
                    _i = 0, defaults_1 = defaults;
                    _a.label = 3;
                case 3:
                    if (!(_i < defaults_1.length)) return [3 /*break*/, 6];
                    defaultRegion = defaults_1[_i];
                    return [4 /*yield*/, addRegionStore(layoutId, defaultRegion.region_type, {
                            row: defaultRegion.grid_row,
                            col: defaultRegion.grid_col
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_9 = _a.sent();
                    logger_1.logger.error('Failed to load role defaults', { error: err_9, layoutId: layoutId, role: role }, 'useRegionLayout');
                    throw err_9;
                case 8: return [2 /*return*/];
            }
        });
    }); }, [layoutId, addRegionStore]);
    // Save (flush pending updates)
    var save = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var err_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, flushUpdates(layoutId)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_10 = _a.sent();
                    logger_1.logger.error('Failed to save', { error: err_10, layoutId: layoutId }, 'useRegionLayout');
                    throw err_10;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [layoutId, flushUpdates]);
    // Reload regions
    var reload = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var err_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, loadRegions(layoutId)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_11 = _a.sent();
                    logger_1.logger.error('Failed to reload regions', { error: err_11, layoutId: layoutId }, 'useRegionLayout');
                    throw err_11;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [layoutId, loadRegions]);
    return {
        regions: dashboardRegions,
        loading: loading,
        error: error,
        addRegion: addRegion,
        removeRegion: removeRegion,
        updateRegionPosition: updateRegionPosition,
        updateRegionSize: updateRegionSize,
        reorderRegions: reorderRegions,
        toggleCollapse: toggleCollapse,
        toggleLock: toggleLock,
        loadRoleDefaults: loadRoleDefaults,
        updateRegion: updateRegion,
        save: save,
        reload: reload
    };
}
