"use strict";
/**
 * Offline Queue Service
 * Manages queued dashboard operations when offline and syncs when back online
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
exports.offlineQueueService = void 0;
var logger_1 = require("@/utils/logger");
var enhanced_api_1 = require("@/lib/enhanced-api");
var QUEUE_STORAGE_KEY = 'dashboard_offline_queue';
var MAX_RETRIES = 3;
var SYNC_INTERVAL = 5000; // 5 seconds
var OfflineQueueService = /** @class */ (function () {
    function OfflineQueueService() {
        Object.defineProperty(this, "queue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "syncInterval", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "isOnline", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: navigator.onLine
        });
        Object.defineProperty(this, "listeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        this.loadQueue();
        this.setupOnlineListener();
        this.startSyncInterval();
    }
    /**
     * Load queue from storage
     */
    Object.defineProperty(OfflineQueueService.prototype, "loadQueue", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            try {
                var stored = localStorage.getItem(QUEUE_STORAGE_KEY);
                if (stored) {
                    this.queue = JSON.parse(stored);
                    logger_1.logger.debug('Loaded offline queue', { count: this.queue.length }, 'offline-queue');
                }
            }
            catch (error) {
                logger_1.logger.error('Failed to load offline queue', { error: error }, 'offline-queue');
                this.queue = [];
            }
        }
    });
    /**
     * Save queue to storage
     */
    Object.defineProperty(OfflineQueueService.prototype, "saveQueue", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            try {
                localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
                this.notifyListeners();
            }
            catch (error) {
                logger_1.logger.error('Failed to save offline queue', { error: error }, 'offline-queue');
            }
        }
    });
    /**
     * Setup online/offline listeners
     */
    Object.defineProperty(OfflineQueueService.prototype, "setupOnlineListener", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _this = this;
            window.addEventListener('online', function () {
                logger_1.logger.info('Connection restored, syncing queue', {}, 'offline-queue');
                _this.isOnline = true;
                _this.syncQueue();
            });
            window.addEventListener('offline', function () {
                logger_1.logger.info('Connection lost, queueing operations', {}, 'offline-queue');
                _this.isOnline = false;
            });
        }
    });
    /**
     * Start sync interval
     */
    Object.defineProperty(OfflineQueueService.prototype, "startSyncInterval", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _this = this;
            if (this.syncInterval) {
                clearInterval(this.syncInterval);
            }
            this.syncInterval = setInterval(function () {
                if (_this.isOnline && _this.queue.length > 0) {
                    _this.syncQueue();
                }
            }, SYNC_INTERVAL);
        }
    });
    /**
     * Add operation to queue
     */
    Object.defineProperty(OfflineQueueService.prototype, "enqueue", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (operation) {
            var queuedOp = __assign(__assign({}, operation), { id: "op-".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9)), timestamp: Date.now(), retries: 0, status: 'pending' });
            this.queue.push(queuedOp);
            this.saveQueue();
            logger_1.logger.debug('Operation queued', { operation: queuedOp.id, type: queuedOp.type }, 'offline-queue');
            // Try to sync immediately if online
            if (this.isOnline) {
                this.syncQueue();
            }
            return queuedOp.id;
        }
    });
    /**
     * Sync queue with backend
     */
    Object.defineProperty(OfflineQueueService.prototype, "syncQueue", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var pendingOps, _i, pendingOps_1, op, error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.isOnline) {
                                return [2 /*return*/];
                            }
                            pendingOps = this.queue.filter(function (op) { return op.status === 'pending' || op.status === 'failed'; });
                            if (pendingOps.length === 0) {
                                return [2 /*return*/];
                            }
                            logger_1.logger.debug('Syncing queue', { count: pendingOps.length }, 'offline-queue');
                            _i = 0, pendingOps_1 = pendingOps;
                            _a.label = 1;
                        case 1:
                            if (!(_i < pendingOps_1.length)) return [3 /*break*/, 7];
                            op = pendingOps_1[_i];
                            if (op.retries >= MAX_RETRIES) {
                                op.status = 'failed';
                                op.error = 'Max retries exceeded';
                                this.saveQueue();
                                return [3 /*break*/, 6];
                            }
                            op.status = 'syncing';
                            this.saveQueue();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.executeOperation(op)];
                        case 3:
                            _a.sent();
                            op.status = 'completed';
                            logger_1.logger.debug('Operation synced', { operation: op.id }, 'offline-queue');
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            op.retries++;
                            op.status = 'failed';
                            op.error = error_1 instanceof Error ? error_1.message : String(error_1);
                            logger_1.logger.error('Operation sync failed', { error: error_1, operation: op.id, retries: op.retries }, 'offline-queue');
                            return [3 /*break*/, 5];
                        case 5:
                            this.saveQueue();
                            _a.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 1];
                        case 7:
                            // Remove completed operations after a delay
                            setTimeout(function () {
                                _this.queue = _this.queue.filter(function (op) { return op.status !== 'completed'; });
                                _this.saveQueue();
                            }, 10000); // Keep completed ops for 10 seconds for UI feedback
                            return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Execute a queued operation
     */
    Object.defineProperty(OfflineQueueService.prototype, "executeOperation", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (op) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = op.resource;
                            switch (_a) {
                                case 'region': return [3 /*break*/, 1];
                                case 'layout': return [3 /*break*/, 3];
                                case 'template': return [3 /*break*/, 5];
                            }
                            return [3 /*break*/, 7];
                        case 1: return [4 /*yield*/, this.executeRegionOperation(op)];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 3: return [4 /*yield*/, this.executeLayoutOperation(op)];
                        case 4:
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 5: return [4 /*yield*/, this.executeTemplateOperation(op)];
                        case 6:
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 7: throw new Error("Unknown resource type: ".concat(op.resource));
                        case 8: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Execute region operation
     */
    Object.defineProperty(OfflineQueueService.prototype, "executeRegionOperation", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (op) {
            return __awaiter(this, void 0, void 0, function () {
                var layoutId, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            layoutId = op.data.layout_id;
                            if (!layoutId) {
                                throw new Error('Layout ID required for region operations');
                            }
                            _a = op.type;
                            switch (_a) {
                                case 'create': return [3 /*break*/, 1];
                                case 'update': return [3 /*break*/, 3];
                                case 'delete': return [3 /*break*/, 5];
                                case 'reorder': return [3 /*break*/, 7];
                            }
                            return [3 /*break*/, 9];
                        case 1: return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.createRegion(layoutId, op.data)];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 9];
                        case 3:
                            if (!op.resourceId)
                                throw new Error('Resource ID required for update');
                            return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.updateRegion(layoutId, op.resourceId, op.data)];
                        case 4:
                            _b.sent();
                            return [3 /*break*/, 9];
                        case 5:
                            if (!op.resourceId)
                                throw new Error('Resource ID required for delete');
                            return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.deleteRegion(layoutId, op.resourceId)];
                        case 6:
                            _b.sent();
                            return [3 /*break*/, 9];
                        case 7: return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.reorderRegions(layoutId, op.data.regionIds)];
                        case 8:
                            _b.sent();
                            return [3 /*break*/, 9];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Execute layout operation
     */
    Object.defineProperty(OfflineQueueService.prototype, "executeLayoutOperation", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (op) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (op.type) {
                        case 'update':
                            // TODO: Implement layout update when API method is available
                            throw new Error('Layout update not yet implemented - no API method available');
                        default:
                            throw new Error("Unsupported layout operation: ".concat(op.type));
                    }
                    return [2 /*return*/];
                });
            });
        }
    });
    /**
     * Execute template operation
     */
    Object.defineProperty(OfflineQueueService.prototype, "executeTemplateOperation", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (op) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = op.type;
                            switch (_a) {
                                case 'create': return [3 /*break*/, 1];
                                case 'update': return [3 /*break*/, 3];
                                case 'delete': return [3 /*break*/, 5];
                            }
                            return [3 /*break*/, 7];
                        case 1: return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.templates.create(op.data)];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 3:
                            if (!op.resourceId)
                                throw new Error('Resource ID required for update');
                            return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.templates.update(op.resourceId, op.data)];
                        case 4:
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 5:
                            if (!op.resourceId)
                                throw new Error('Resource ID required for delete');
                            return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.templates.delete(op.resourceId)];
                        case 6:
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 7: throw new Error("Unsupported template operation: ".concat(op.type));
                        case 8: return [2 /*return*/];
                    }
                });
            });
        }
    });
    /**
     * Get queue status
     */
    Object.defineProperty(OfflineQueueService.prototype, "getQueueStatus", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return {
                total: this.queue.length,
                pending: this.queue.filter(function (op) { return op.status === 'pending'; }).length,
                syncing: this.queue.filter(function (op) { return op.status === 'syncing'; }).length,
                failed: this.queue.filter(function (op) { return op.status === 'failed'; }).length,
                completed: this.queue.filter(function (op) { return op.status === 'completed'; }).length
            };
        }
    });
    /**
     * Get all queued operations
     */
    Object.defineProperty(OfflineQueueService.prototype, "getQueue", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __spreadArray([], this.queue, true);
        }
    });
    /**
     * Clear completed operations
     */
    Object.defineProperty(OfflineQueueService.prototype, "clearCompleted", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            this.queue = this.queue.filter(function (op) { return op.status !== 'completed'; });
            this.saveQueue();
        }
    });
    /**
     * Retry failed operations
     */
    Object.defineProperty(OfflineQueueService.prototype, "retryFailed", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            this.queue.forEach(function (op) {
                if (op.status === 'failed' && op.retries < MAX_RETRIES) {
                    op.status = 'pending';
                    delete op.error;
                }
            });
            this.saveQueue();
            this.syncQueue();
        }
    });
    /**
     * Remove operation from queue
     */
    Object.defineProperty(OfflineQueueService.prototype, "removeOperation", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (id) {
            this.queue = this.queue.filter(function (op) { return op.id !== id; });
            this.saveQueue();
        }
    });
    /**
     * Subscribe to queue changes
     */
    Object.defineProperty(OfflineQueueService.prototype, "subscribe", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (listener) {
            var _this = this;
            this.listeners.add(listener);
            return function () {
                _this.listeners.delete(listener);
            };
        }
    });
    /**
     * Notify listeners of queue changes
     */
    Object.defineProperty(OfflineQueueService.prototype, "notifyListeners", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _this = this;
            this.listeners.forEach(function (listener) {
                try {
                    listener(__spreadArray([], _this.queue, true));
                }
                catch (error) {
                    logger_1.logger.error('Error in queue listener', { error: error }, 'offline-queue');
                }
            });
        }
    });
    /**
     * Check if online
     */
    Object.defineProperty(OfflineQueueService.prototype, "isOnlineNow", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return this.isOnline;
        }
    });
    return OfflineQueueService;
}());
// Singleton instance
exports.offlineQueueService = new OfflineQueueService();
