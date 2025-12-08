"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRegionStore = void 0;
var zustand_1 = require("zustand");
var middleware_1 = require("zustand/middleware");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
var region_schemas_1 = require("@/lib/validation/region.schemas");
var offline_api_wrapper_1 = require("@/services/offline-api-wrapper");
/**
 * Request coalescing queue manager
 */
var UpdateQueueManager = /** @class */ (function () {
    function UpdateQueueManager() {
        Object.defineProperty(this, "queue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "flushTimers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "FLUSH_DELAY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 500
        }); // ms
        Object.defineProperty(this, "MAX_QUEUE_SIZE", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 10
        });
        Object.defineProperty(this, "MAX_RETRIES", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 3
        });
    }
    Object.defineProperty(UpdateQueueManager.prototype, "enqueue", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (layoutId, regionId, updates, onFlush) {
            var key = "".concat(layoutId, ":").concat(regionId);
            if (!this.queue.has(key)) {
                this.queue.set(key, []);
            }
            var queue = this.queue.get(key);
            queue.push({
                regionId: regionId,
                updates: updates,
                timestamp: Date.now(),
                retryCount: 0
            });
            // Flush immediately if queue is full
            if (queue.length >= this.MAX_QUEUE_SIZE) {
                this.flush(layoutId, regionId, onFlush);
            }
            else {
                // Schedule flush
                this.scheduleFlush(layoutId, regionId, onFlush);
            }
        }
    });
    Object.defineProperty(UpdateQueueManager.prototype, "scheduleFlush", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (layoutId, regionId, onFlush) {
            var _this = this;
            var key = "".concat(layoutId, ":").concat(regionId);
            // Clear existing timer
            var existing = this.flushTimers.get(key);
            if (existing) {
                clearTimeout(existing);
            }
            // Schedule new flush
            var timer = setTimeout(function () {
                _this.flush(layoutId, regionId, onFlush);
            }, this.FLUSH_DELAY);
            this.flushTimers.set(key, timer);
        }
    });
    Object.defineProperty(UpdateQueueManager.prototype, "flush", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (layoutId, regionId, onFlush) {
            return __awaiter(this, void 0, void 0, function () {
                var key, queue, timer, merged, error_1, errorStatus, errorMessage, validationErrors, firstEntry, backoffDelay, errorMessage, validationErrors;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            key = "".concat(layoutId, ":").concat(regionId);
                            queue = this.queue.get(key);
                            if (!queue || queue.length === 0)
                                return [2 /*return*/];
                            timer = this.flushTimers.get(key);
                            if (timer) {
                                clearTimeout(timer);
                                this.flushTimers.delete(key);
                            }
                            merged = queue.reduce(function (acc, entry) {
                                return __assign(__assign({}, acc), entry.updates);
                            }, {});
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, onFlush(regionId, merged)];
                        case 2:
                            _b.sent();
                            this.queue.delete(key);
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _b.sent();
                            errorStatus = (error_1 === null || error_1 === void 0 ? void 0 : error_1.status) ||
                                ((_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _a === void 0 ? void 0 : _a.status) ||
                                (error_1 instanceof Error && error_1.message.includes('HTTP 400') ? 400 : undefined);
                            if (errorStatus === 400) {
                                logger_1.logger.error('Validation error - not retrying', { error: error_1, layoutId: layoutId, regionId: regionId, errorStatus: errorStatus }, 'regionStore');
                                errorMessage = error_1 instanceof Error ? error_1.message : 'Validation failed';
                                // Extract the actual error message if it's in "HTTP 400: message" format
                                if (errorMessage.startsWith('HTTP 400:')) {
                                    errorMessage = errorMessage.replace('HTTP 400:', '').trim();
                                }
                                if ((error_1 === null || error_1 === void 0 ? void 0 : error_1.validationErrors) && Array.isArray(error_1.validationErrors)) {
                                    validationErrors = error_1.validationErrors;
                                    errorMessage = "Validation failed:\n".concat(validationErrors.map(function (e, i) { return "  ".concat(i + 1, ". ").concat(e); }).join('\n'));
                                }
                                toast_1.toast.error(errorMessage, 8000);
                                this.queue.delete(key);
                                throw error_1;
                            }
                            firstEntry = queue[0];
                            if (firstEntry && firstEntry.retryCount < this.MAX_RETRIES) {
                                firstEntry.retryCount++;
                                backoffDelay = Math.pow(2, firstEntry.retryCount) * 1000;
                                setTimeout(function () {
                                    _this.flush(layoutId, regionId, onFlush);
                                }, backoffDelay);
                            }
                            else {
                                // Max retries exceeded, clear queue
                                logger_1.logger.error('Update queue max retries exceeded', { error: error_1, layoutId: layoutId, regionId: regionId }, 'regionStore');
                                errorMessage = error_1 instanceof Error ? error_1.message : 'Failed to update region after multiple attempts';
                                if ((error_1 === null || error_1 === void 0 ? void 0 : error_1.validationErrors) && Array.isArray(error_1.validationErrors)) {
                                    validationErrors = error_1.validationErrors;
                                    errorMessage = "Validation failed:\n".concat(validationErrors.map(function (e, i) { return "  ".concat(i + 1, ". ").concat(e); }).join('\n'));
                                }
                                toast_1.toast.error(errorMessage, 10000); // Show for 10 seconds for critical errors
                                this.queue.delete(key);
                                throw error_1;
                            }
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(UpdateQueueManager.prototype, "clear", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (layoutId, regionId) {
            var key = "".concat(layoutId, ":").concat(regionId);
            var timer = this.flushTimers.get(key);
            if (timer) {
                clearTimeout(timer);
                this.flushTimers.delete(key);
            }
            this.queue.delete(key);
        }
    });
    return UpdateQueueManager;
}());
var queueManager = new UpdateQueueManager();
/**
 * Region store with optimistic locking and conflict resolution
 */
exports.useRegionStore = (0, zustand_1.create)()((0, middleware_1.devtools)((0, middleware_1.persist)((0, middleware_1.subscribeWithSelector)((function (set, get) { return ({
    // Initial state
    regions: new Map(),
    layouts: new Map(),
    layoutVersions: new Map(),
    loading: new Set(),
    errors: new Map(),
    conflicts: new Map(),
    updateQueue: new Map(),
    flushTimer: null,
    history: new Map(),
    // Load regions for a layout
    loadRegions: function (layoutId) { return __awaiter(void 0, void 0, void 0, function () {
        var data, regions_1, error_2, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set(function (state) {
                        var newLoading = new Set(state.loading);
                        newLoading.add(layoutId);
                        var newLayouts = new Map(state.layouts);
                        if (!newLayouts.has(layoutId)) {
                            newLayouts.set(layoutId, { regions: [], loading: true });
                        }
                        return __assign(__assign({}, state), { loading: newLoading, layouts: newLayouts });
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.listRegions(layoutId)];
                case 2:
                    data = _a.sent();
                    regions_1 = data.map(function (r) { return (__assign(__assign({}, r), { version: r.version || 1, optimistic: false })); });
                    set(function (state) {
                        var newRegions = new Map(state.regions);
                        regions_1.forEach(function (region) {
                            newRegions.set(region.id, region);
                        });
                        var newLayouts = new Map(state.layouts);
                        var layout = newLayouts.get(layoutId);
                        if (layout) {
                            newLayouts.set(layoutId, __assign(__assign({}, layout), { regions: regions_1.map(function (r) { return r.id; }), loading: false }));
                        }
                        var newLoading = new Set(state.loading);
                        newLoading.delete(layoutId);
                        var newErrors = new Map(state.errors);
                        newErrors.delete(layoutId);
                        return __assign(__assign({}, state), { regions: newRegions, layouts: newLayouts, loading: newLoading, errors: newErrors });
                    });
                    // Save initial snapshot after loading regions
                    // This allows users to undo back to the loaded state
                    get().saveLayoutSnapshot(layoutId);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    err_1 = error_2 instanceof Error ? error_2 : new Error('Failed to load regions');
                    set(function (state) {
                        var newLoading = new Set(state.loading);
                        newLoading.delete(layoutId);
                        var newErrors = new Map(state.errors);
                        newErrors.set(layoutId, err_1);
                        return __assign(__assign({}, state), { loading: newLoading, errors: newErrors });
                    });
                    throw err_1;
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // Add a new region
    addRegion: function (layoutId, type, position) { return __awaiter(void 0, void 0, void 0, function () {
        var error, state, existingRegions, gridRow, gridCol, existingRegionsForCheck, isValidPosition, found, row, col, error, found, offset, positions, _i, positions_1, _a, r, c, row, col, error, newRegion, created, versionedRegion_1, error_3, err;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!layoutId || layoutId.trim() === '') {
                        error = new Error('Layout ID is required to add a region');
                        logger_1.logger.error('Cannot add region: layoutId is missing', { layoutId: layoutId, type: type }, 'regionStore');
                        throw error;
                    }
                    state = get();
                    existingRegions = state.getRegionsByLayout(layoutId);
                    gridRow = (_b = position === null || position === void 0 ? void 0 : position.row) !== null && _b !== void 0 ? _b : 0;
                    gridCol = (_c = position === null || position === void 0 ? void 0 : position.col) !== null && _c !== void 0 ? _c : 0;
                    existingRegionsForCheck = existingRegions.map(function (r) { return ({
                        id: r.id,
                        grid_row: r.grid_row,
                        grid_col: r.grid_col,
                        row_span: r.row_span,
                        col_span: r.col_span
                    }); });
                    isValidPosition = function (row, col, rowSpan, colSpan) {
                        if (rowSpan === void 0) { rowSpan = 1; }
                        if (colSpan === void 0) { colSpan = 1; }
                        // Check bounds
                        if (col < 0 || col >= 12 || col + colSpan > 12)
                            return false;
                        if (row < 0)
                            return false;
                        // Check overlap
                        return !(0, region_schemas_1.detectOverlap)({ grid_row: row, grid_col: col, row_span: rowSpan, col_span: colSpan }, existingRegionsForCheck, undefined);
                    };
                    if (!position) {
                        found = false;
                        for (row = 0; row < 20 && !found; row++) {
                            for (col = 0; col < 12 && !found; col++) {
                                if (isValidPosition(row, col)) {
                                    gridRow = row;
                                    gridCol = col;
                                    found = true;
                                }
                            }
                        }
                        if (!found) {
                            error = new Error('No space left for a new region in this layout. Please remove some regions or resize existing ones.');
                            logger_1.logger.error('Cannot add region: no valid position found', { existingRegionsCount: existingRegions.length, maxRow: 20 }, 'regionStore');
                            throw error;
                        }
                    }
                    else {
                        // Validate provided position
                        if (!isValidPosition(gridRow, gridCol)) {
                            found = false;
                            for (offset = 1; offset <= 5 && !found; offset++) {
                                positions = [
                                    [gridRow, gridCol + offset],
                                    [gridRow, gridCol - offset],
                                    [gridRow + offset, gridCol],
                                    [gridRow - offset, gridCol]
                                ];
                                for (_i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
                                    _a = positions_1[_i], r = _a[0], c = _a[1];
                                    if (typeof r === 'number' && typeof c === 'number' && isValidPosition(r, c)) {
                                        gridRow = r;
                                        gridCol = c;
                                        found = true;
                                        logger_1.logger.warn('Requested position overlaps, using alternative', { requested: position, actual: { row: gridRow, col: gridCol } }, 'regionStore');
                                        break;
                                    }
                                }
                            }
                            if (!found) {
                                // Last resort: find any valid position
                                for (row = 0; row < 20 && !found; row++) {
                                    for (col = 0; col < 12 && !found; col++) {
                                        if (isValidPosition(row, col)) {
                                            gridRow = row;
                                            gridCol = col;
                                            found = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // Ensure position is within bounds (final safety check)
                    gridRow = Math.max(0, gridRow);
                    gridCol = Math.max(0, Math.min(gridCol, 11)); // Max column is 11 (0-indexed)
                    // Final validation before creating
                    if (!isValidPosition(gridRow, gridCol)) {
                        error = new Error("Cannot create region: position (".concat(gridRow, ", ").concat(gridCol, ") overlaps with existing regions"));
                        logger_1.logger.error('Invalid position for new region', { gridRow: gridRow, gridCol: gridCol, existingRegionsCount: existingRegions.length }, 'regionStore');
                        throw error;
                    }
                    newRegion = {
                        region_type: type,
                        grid_row: gridRow,
                        grid_col: gridCol,
                        row_span: 1,
                        col_span: 1,
                        min_width: 200,
                        min_height: 150,
                        is_collapsed: false,
                        is_locked: false,
                        is_hidden_mobile: false,
                        config: {},
                        widget_config: {},
                        display_order: existingRegions.length
                    };
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, offline_api_wrapper_1.createRegionWithOffline)(layoutId, newRegion)];
                case 2:
                    created = _d.sent();
                    versionedRegion_1 = __assign(__assign({}, created), { version: created.version || 1, optimistic: false });
                    set(function (state) {
                        var newRegions = new Map(state.regions);
                        newRegions.set(versionedRegion_1.id, versionedRegion_1);
                        var newLayouts = new Map(state.layouts);
                        var currentLayout = newLayouts.get(layoutId);
                        if (currentLayout) {
                            newLayouts.set(layoutId, __assign(__assign({}, currentLayout), { regions: __spreadArray(__spreadArray([], currentLayout.regions, true), [versionedRegion_1.id], false) }));
                        }
                        return __assign(__assign({}, state), { regions: newRegions, layouts: newLayouts });
                    });
                    // Save snapshot after successful add
                    get().saveLayoutSnapshot(layoutId);
                    return [2 /*return*/, versionedRegion_1];
                case 3:
                    error_3 = _d.sent();
                    err = error_3 instanceof Error ? error_3 : new Error('Failed to add region');
                    logger_1.logger.error('Failed to add region', { error: error_3, layoutId: layoutId, type: type, newRegion: newRegion }, 'regionStore');
                    // Extract validation errors if available
                    if (error_3 === null || error_3 === void 0 ? void 0 : error_3.validationErrors) {
                        logger_1.logger.error('Validation errors', { validationErrors: error_3.validationErrors }, 'regionStore');
                    }
                    throw err;
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // Update region with optimistic locking
    updateRegion: function (layoutId_1, regionId_1, updates_1) {
        var args_1 = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args_1[_i - 3] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([layoutId_1, regionId_1, updates_1], args_1, true), void 0, function (layoutId, regionId, updates, optimistic) {
            var state, region, result, updated_1, error_4, latest, serverRegion_1;
            if (optimistic === void 0) { optimistic = true; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        state = get();
                        region = state.regions.get(regionId);
                        if (!region) {
                            throw new Error("Region ".concat(regionId, " not found"));
                        }
                        if (!optimistic) return [3 /*break*/, 1];
                        set(function (state) {
                            var current = state.regions.get(regionId);
                            if (current) {
                                var newRegions = new Map(state.regions);
                                newRegions.set(regionId, __assign(__assign(__assign({}, current), updates), { optimistic: true, pendingUpdate: __assign(__assign({}, current.pendingUpdate), updates) }));
                                return __assign(__assign({}, state), { regions: newRegions });
                            }
                            return state;
                        });
                        // Queue for coalescing
                        queueManager.enqueue(layoutId, regionId, updates, function (id, merged) { return __awaiter(void 0, void 0, void 0, function () {
                            var currentState, currentRegion, sanitizedUpdates, sanitizeRegionConfig, result, updated_2, error_5, latest, serverRegion_2, errorMessage, validationErrors;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        currentState = get();
                                        currentRegion = currentState.regions.get(id);
                                        if (!currentRegion)
                                            return [2 /*return*/];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 5, , 9]);
                                        sanitizedUpdates = __assign({}, merged);
                                        if (!sanitizedUpdates.config) return [3 /*break*/, 3];
                                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('@/lib/sanitization')); })];
                                    case 2:
                                        sanitizeRegionConfig = (_a.sent()).sanitizeRegionConfig;
                                        sanitizedUpdates.config = sanitizeRegionConfig(sanitizedUpdates.config);
                                        _a.label = 3;
                                    case 3: return [4 /*yield*/, (0, offline_api_wrapper_1.updateRegionWithOffline)(layoutId, id, __assign(__assign({}, sanitizedUpdates), { version: currentRegion.version }))];
                                    case 4:
                                        result = _a.sent();
                                        updated_2 = __assign(__assign({}, result), { version: result.version || (currentRegion.version || 1) + 1, optimistic: false });
                                        set(function (state) {
                                            var newRegions = new Map(state.regions);
                                            newRegions.set(id, updated_2);
                                            return __assign(__assign({}, state), { regions: newRegions });
                                        });
                                        // Save snapshot after successful update
                                        get().saveLayoutSnapshot(layoutId);
                                        return [3 /*break*/, 9];
                                    case 5:
                                        error_5 = _a.sent();
                                        if (!((error_5 === null || error_5 === void 0 ? void 0 : error_5.status) === 409 || (error_5 === null || error_5 === void 0 ? void 0 : error_5.code) === 'CONFLICT')) return [3 /*break*/, 7];
                                        return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.listRegions(layoutId)];
                                    case 6:
                                        latest = _a.sent();
                                        serverRegion_2 = latest.find(function (r) { return r.id === id; });
                                        if (serverRegion_2) {
                                            set(function (state) {
                                                var local = state.regions.get(id);
                                                if (local) {
                                                    var newConflicts = new Map(state.conflicts);
                                                    newConflicts.set(id, {
                                                        regionId: id,
                                                        localVersion: local,
                                                        serverVersion: serverRegion_2,
                                                        localChanges: merged
                                                    });
                                                    return __assign(__assign({}, state), { conflicts: newConflicts });
                                                }
                                                return state;
                                            });
                                        }
                                        return [3 /*break*/, 8];
                                    case 7:
                                        errorMessage = error_5 instanceof Error ? error_5.message : 'Failed to update region';
                                        if ((error_5 === null || error_5 === void 0 ? void 0 : error_5.validationErrors) && Array.isArray(error_5.validationErrors)) {
                                            validationErrors = error_5.validationErrors;
                                            errorMessage = "Validation failed:\n".concat(validationErrors.map(function (e, i) { return "  ".concat(i + 1, ". ").concat(e); }).join('\n'));
                                        }
                                        toast_1.toast.error(errorMessage, 8000); // Show for 8 seconds for validation errors
                                        set(function (state) {
                                            var current = state.regions.get(id);
                                            if (current) {
                                                var newRegions = new Map(state.regions);
                                                newRegions.set(id, __assign(__assign(__assign({}, current), region), { optimistic: false }));
                                                return __assign(__assign({}, state), { regions: newRegions });
                                            }
                                            return state;
                                        });
                                        _a.label = 8;
                                    case 8: throw error_5;
                                    case 9: return [2 /*return*/];
                                }
                            });
                        }); });
                        // Return optimistic version
                        return [2 /*return*/, get().regions.get(regionId)];
                    case 1:
                        _a.trys.push([1, 3, , 6]);
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.updateRegion(layoutId, regionId, __assign(__assign({}, updates), { version: region.version }))];
                    case 2:
                        result = _a.sent();
                        updated_1 = __assign(__assign({}, result), { version: result.version || (region.version || 1) + 1, optimistic: false });
                        set(function (state) {
                            var newRegions = new Map(state.regions);
                            newRegions.set(regionId, updated_1);
                            return __assign(__assign({}, state), { regions: newRegions });
                        });
                        return [2 /*return*/, updated_1];
                    case 3:
                        error_4 = _a.sent();
                        if (!((error_4 === null || error_4 === void 0 ? void 0 : error_4.status) === 409 || (error_4 === null || error_4 === void 0 ? void 0 : error_4.code) === 'CONFLICT')) return [3 /*break*/, 5];
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.listRegions(layoutId)];
                    case 4:
                        latest = _a.sent();
                        serverRegion_1 = latest.find(function (r) { return r.id === regionId; });
                        if (serverRegion_1) {
                            set(function (state) {
                                var local = state.regions.get(regionId);
                                if (local) {
                                    var newConflicts = new Map(state.conflicts);
                                    newConflicts.set(regionId, {
                                        regionId: regionId,
                                        localVersion: local,
                                        serverVersion: serverRegion_1,
                                        localChanges: updates
                                    });
                                    return __assign(__assign({}, state), { conflicts: newConflicts });
                                }
                                return state;
                            });
                        }
                        _a.label = 5;
                    case 5: throw error_4;
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    // Remove region
    removeRegion: function (layoutId, regionId) { return __awaiter(void 0, void 0, void 0, function () {
        var state, regionToRemove, error_6, err;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = get();
                    regionToRemove = state.regions.get(regionId);
                    if (!regionToRemove) {
                        throw new Error("Region ".concat(regionId, " not found"));
                    }
                    // Optimistic removal
                    set(function (state) {
                        var newRegions = new Map(state.regions);
                        newRegions.delete(regionId);
                        var newLayouts = new Map(state.layouts);
                        var layout = newLayouts.get(layoutId);
                        if (layout) {
                            newLayouts.set(layoutId, __assign(__assign({}, layout), { regions: layout.regions.filter(function (id) { return id !== regionId; }) }));
                        }
                        return __assign(__assign({}, state), { regions: newRegions, layouts: newLayouts });
                    });
                    // Clear any pending updates
                    queueManager.clear(layoutId, regionId);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, offline_api_wrapper_1.deleteRegionWithOffline)(layoutId, regionId)];
                case 2:
                    _a.sent();
                    // Save snapshot after successful remove
                    get().saveLayoutSnapshot(layoutId);
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    // Rollback on error
                    set(function (state) {
                        var newRegions = new Map(state.regions);
                        newRegions.set(regionId, regionToRemove);
                        var newLayouts = new Map(state.layouts);
                        var layout = newLayouts.get(layoutId);
                        if (layout) {
                            newLayouts.set(layoutId, __assign(__assign({}, layout), { regions: __spreadArray(__spreadArray([], layout.regions, true), [regionId], false) }));
                        }
                        return __assign(__assign({}, state), { regions: newRegions, layouts: newLayouts });
                    });
                    err = error_6 instanceof Error ? error_6 : new Error('Failed to remove region');
                    logger_1.logger.error('Failed to remove region', { error: error_6, layoutId: layoutId, regionId: regionId }, 'regionStore');
                    toast_1.toast.error("Failed to remove region: ".concat(err.message));
                    throw err;
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // Reorder regions
    reorderRegions: function (layoutId, regionIds) { return __awaiter(void 0, void 0, void 0, function () {
        var error_7, err;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, offline_api_wrapper_1.reorderRegionsWithOffline)(layoutId, regionIds)];
                case 1:
                    _a.sent();
                    set(function (state) {
                        var newLayouts = new Map(state.layouts);
                        var layout = newLayouts.get(layoutId);
                        if (layout) {
                            newLayouts.set(layoutId, __assign(__assign({}, layout), { regions: regionIds }));
                        }
                        return __assign(__assign({}, state), { layouts: newLayouts });
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _a.sent();
                    err = error_7 instanceof Error ? error_7 : new Error('Failed to reorder regions');
                    logger_1.logger.error('Failed to reorder regions', { error: error_7, layoutId: layoutId }, 'regionStore');
                    throw err;
                case 3: return [2 /*return*/];
            }
        });
    }); },
    // Conflict resolution
    resolveConflict: function (regionId, resolution) { return __awaiter(void 0, void 0, void 0, function () {
        var state, conflict, layoutId, resolved, result, updated_3, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = get();
                    conflict = state.conflicts.get(regionId);
                    if (!conflict) {
                        return [2 /*return*/];
                    }
                    layoutId = conflict.localVersion.layout_id;
                    switch (resolution) {
                        case 'local':
                            // Apply local changes to server version
                            resolved = __assign(__assign(__assign({}, conflict.serverVersion), conflict.localChanges), { version: conflict.serverVersion.version || 1, optimistic: false });
                            break;
                        case 'server':
                            // Use server version
                            resolved = __assign(__assign({}, conflict.serverVersion), { version: conflict.serverVersion.version || 1, optimistic: false });
                            break;
                        case 'merge':
                            // Merge both versions (prefer server for conflicts)
                            resolved = __assign(__assign(__assign({}, conflict.serverVersion), conflict.localChanges), { version: conflict.serverVersion.version || 1, optimistic: false });
                            break;
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.updateRegion(layoutId, regionId, __assign(__assign({}, resolved), { version: resolved.version }))];
                case 2:
                    result = _a.sent();
                    updated_3 = __assign(__assign({}, result), { version: result.version || (resolved.version || 1) + 1, optimistic: false });
                    set(function (state) {
                        var newRegions = new Map(state.regions);
                        newRegions.set(regionId, updated_3);
                        var newConflicts = new Map(state.conflicts);
                        newConflicts.delete(regionId);
                        return __assign(__assign({}, state), { regions: newRegions, conflicts: newConflicts });
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_8 = _a.sent();
                    logger_1.logger.error('Failed to resolve conflict', { error: error_8, regionId: regionId, resolution: resolution }, 'regionStore');
                    throw error_8;
                case 4: return [2 /*return*/];
            }
        });
    }); },
    clearConflict: function (regionId) {
        set(function (state) {
            var newConflicts = new Map(state.conflicts);
            newConflicts.delete(regionId);
            return __assign(__assign({}, state), { conflicts: newConflicts });
        });
    },
    // Flush updates
    flushUpdates: function (layoutId) { return __awaiter(void 0, void 0, void 0, function () {
        var state, layout, _i, _a, regionId, region, error_9;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    state = get();
                    layout = state.layouts.get(layoutId);
                    if (!layout) return [3 /*break*/, 6];
                    _i = 0, _a = layout.regions;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    regionId = _a[_i];
                    region = state.regions.get(regionId);
                    if (!((region === null || region === void 0 ? void 0 : region.optimistic) && region.pendingUpdate)) return [3 /*break*/, 5];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, get().updateRegion(layoutId, regionId, region.pendingUpdate, false)];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_9 = _b.sent();
                    logger_1.logger.error('Failed to flush region update', { layoutId: layoutId, regionId: regionId, error: error_9 }, 'regionStore');
                    throw error_9;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    }); },
    clearQueue: function (layoutId) {
        var state = get();
        var layout = state.layouts.get(layoutId);
        if (layout) {
            for (var _i = 0, _a = layout.regions; _i < _a.length; _i++) {
                var regionId = _a[_i];
                queueManager.clear(layoutId, regionId);
            }
        }
    },
    // Undo/Redo
    saveLayoutSnapshot: function (layoutId) {
        var state = get();
        var regions = state.getRegionsByLayout(layoutId);
        // Create deep copy of regions for snapshot
        var snapshot = regions.map(function (region) { return (__assign(__assign({}, region), { 
            // Remove optimistic flags from snapshot
            optimistic: false })); });
        set(function (state) {
            var history = state.history.get(layoutId) || {
                snapshots: [],
                currentIndex: -1,
                maxSize: 50
            };
            // Remove any snapshots after current index (if user undid and made new changes)
            var newSnapshots = history.snapshots.slice(0, history.currentIndex + 1);
            // Add new snapshot
            newSnapshots.push(snapshot);
            // Limit history size
            if (newSnapshots.length > history.maxSize) {
                newSnapshots.shift();
            }
            var newHistory = new Map(state.history);
            newHistory.set(layoutId, {
                snapshots: newSnapshots,
                currentIndex: newSnapshots.length - 1,
                maxSize: history.maxSize
            });
            return __assign(__assign({}, state), { history: newHistory });
        });
    },
    undoLayout: function (layoutId) { return __awaiter(void 0, void 0, void 0, function () {
        var result_1, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.undoLayout(layoutId)];
                case 1:
                    result_1 = _a.sent();
                    // Update local state with server response
                    set(function (state) {
                        var newRegions = new Map(state.regions);
                        var newLayouts = new Map(state.layouts);
                        // Get current layout
                        var layout = newLayouts.get(layoutId);
                        if (!layout) {
                            logger_1.logger.warn('Layout not found in state', { layoutId: layoutId }, 'regionStore');
                            return state;
                        }
                        // Remove all current regions for this layout
                        layout.regions.forEach(function (regionId) {
                            newRegions.delete(regionId);
                        });
                        // Add regions from server response
                        result_1.regions.forEach(function (region) {
                            newRegions.set(region.id, region);
                        });
                        // Update layout with new region IDs
                        newLayouts.set(layoutId, __assign(__assign({}, layout), { regions: result_1.regions.map(function (r) { return r.id; }) }));
                        return __assign(__assign({}, state), { regions: newRegions, layouts: newLayouts, layoutVersions: new Map(state.layoutVersions).set(layoutId, result_1.version) });
                    });
                    logger_1.logger.info('Layout undone successfully', { layoutId: layoutId, version: result_1.version }, 'regionStore');
                    toast_1.toast.success('Changes undone');
                    return [2 /*return*/, true];
                case 2:
                    error_10 = _a.sent();
                    logger_1.logger.error('Failed to undo layout', { error: error_10, layoutId: layoutId }, 'regionStore');
                    toast_1.toast.error('Failed to undo changes');
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    redoLayout: function (layoutId) { return __awaiter(void 0, void 0, void 0, function () {
        var result_2, error_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.redoLayout(layoutId)];
                case 1:
                    result_2 = _a.sent();
                    // Update local state with server response
                    set(function (state) {
                        var newRegions = new Map(state.regions);
                        var newLayouts = new Map(state.layouts);
                        // Get current layout
                        var layout = newLayouts.get(layoutId);
                        if (!layout) {
                            logger_1.logger.warn('Layout not found in state', { layoutId: layoutId }, 'regionStore');
                            return state;
                        }
                        // Remove all current regions for this layout
                        layout.regions.forEach(function (regionId) {
                            newRegions.delete(regionId);
                        });
                        // Add regions from server response
                        result_2.regions.forEach(function (region) {
                            newRegions.set(region.id, region);
                        });
                        // Update layout with new region IDs
                        newLayouts.set(layoutId, __assign(__assign({}, layout), { regions: result_2.regions.map(function (r) { return r.id; }) }));
                        return __assign(__assign({}, state), { regions: newRegions, layouts: newLayouts, layoutVersions: new Map(state.layoutVersions).set(layoutId, result_2.version) });
                    });
                    logger_1.logger.info('Layout redone successfully', { layoutId: layoutId, version: result_2.version }, 'regionStore');
                    toast_1.toast.success('Changes redone');
                    return [2 /*return*/, true];
                case 2:
                    error_11 = _a.sent();
                    logger_1.logger.error('Failed to redo layout', { error: error_11, layoutId: layoutId }, 'regionStore');
                    toast_1.toast.error('Failed to redo changes');
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    canUndo: function (layoutId) {
        var state = get();
        var history = state.history.get(layoutId);
        if (!history) {
            return false;
        }
        return history.currentIndex > 0;
    },
    canRedo: function (layoutId) {
        var state = get();
        var history = state.history.get(layoutId);
        if (!history) {
            return false;
        }
        return history.currentIndex < history.snapshots.length - 1;
    },
    // Selectors
    getRegionsByLayout: function (layoutId) {
        var state = get();
        var layout = state.layouts.get(layoutId);
        if (!layout)
            return [];
        return layout.regions
            .map(function (id) { return state.regions.get(id); })
            .filter(function (r) { return r !== undefined; });
    },
    getRegion: function (regionId) {
        return get().regions.get(regionId);
    },
    hasConflicts: function () {
        return get().conflicts.size > 0;
    }
}); })), {
    name: 'region-storage',
    partialize: function (_state) { return ({
    // Only persist certain fields, not the full state
    // Regions are loaded fresh on mount
    }); }
}), { name: 'Region Store' }));
