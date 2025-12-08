"use strict";
/**
 * Offline API Wrapper
 * Wraps API calls to queue them when offline and execute when online
 */
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
exports.withOfflineQueue = withOfflineQueue;
exports.createRegionWithOffline = createRegionWithOffline;
exports.updateRegionWithOffline = updateRegionWithOffline;
exports.deleteRegionWithOffline = deleteRegionWithOffline;
exports.reorderRegionsWithOffline = reorderRegionsWithOffline;
var offline_queue_service_1 = require("./offline-queue.service");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var pwa_1 = require("@/utils/pwa");
/**
 * Wrap an API call with offline queue support
 */
function withOfflineQueue(operation, queueConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var online, error_1, queueId, queueId;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    online = (0, pwa_1.isOnline)();
                    if (!online) return [3 /*break*/, 5];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, operation()];
                case 2: 
                // Try to execute immediately
                return [2 /*return*/, _d.sent()];
                case 3:
                    error_1 = _d.sent();
                    // If error indicates offline (network error), queue it
                    if (((_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.message) === null || _a === void 0 ? void 0 : _a.includes('Failed to fetch')) ||
                        ((_b = error_1 === null || error_1 === void 0 ? void 0 : error_1.message) === null || _b === void 0 ? void 0 : _b.includes('NetworkError')) ||
                        ((_c = error_1 === null || error_1 === void 0 ? void 0 : error_1.message) === null || _c === void 0 ? void 0 : _c.includes('offline')) ||
                        !navigator.onLine) {
                        logger_1.logger.warn('Network error detected, queueing operation', { error: error_1 }, 'offline-api-wrapper');
                        queueId = offline_queue_service_1.offlineQueueService.enqueue(queueConfig);
                        throw new Error("Operation queued (ID: ".concat(queueId, "). Will sync when online."));
                    }
                    throw error_1;
                case 4: return [3 /*break*/, 6];
                case 5:
                    // Offline - queue the operation
                    logger_1.logger.debug('Offline, queueing operation', { type: queueConfig.type, resource: queueConfig.resource }, 'offline-api-wrapper');
                    queueId = offline_queue_service_1.offlineQueueService.enqueue(queueConfig);
                    // Return a promise that will resolve when synced
                    // For now, we'll throw an error indicating it's queued
                    // The UI should handle this gracefully
                    throw new Error("Operation queued (ID: ".concat(queueId, "). Will sync when online."));
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Create region with offline support
 */
function createRegionWithOffline(layoutId, regionData) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, withOfflineQueue(function () { return enhanced_api_1.enhancedApi.dashboardLayouts.createRegion(layoutId, regionData); }, {
                    type: 'create',
                    resource: 'region',
                    data: __assign({ layout_id: layoutId }, regionData)
                })];
        });
    });
}
/**
 * Update region with offline support
 */
function updateRegionWithOffline(layoutId, regionId, updates) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, withOfflineQueue(function () { return enhanced_api_1.enhancedApi.dashboardLayouts.updateRegion(layoutId, regionId, updates); }, {
                    type: 'update',
                    resource: 'region',
                    resourceId: regionId,
                    data: __assign({ layout_id: layoutId }, updates)
                })];
        });
    });
}
/**
 * Delete region with offline support
 */
function deleteRegionWithOffline(layoutId, regionId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, withOfflineQueue(function () { return enhanced_api_1.enhancedApi.dashboardLayouts.deleteRegion(layoutId, regionId); }, {
                    type: 'delete',
                    resource: 'region',
                    resourceId: regionId,
                    data: { layout_id: layoutId }
                })];
        });
    });
}
/**
 * Reorder regions with offline support
 */
function reorderRegionsWithOffline(layoutId, regionIds) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, withOfflineQueue(function () { return enhanced_api_1.enhancedApi.dashboardLayouts.reorderRegions(layoutId, regionIds); }, {
                    type: 'reorder',
                    resource: 'region',
                    data: { layout_id: layoutId, regionIds: regionIds }
                })];
        });
    });
}
