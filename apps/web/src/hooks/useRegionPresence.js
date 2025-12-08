"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRegionPresence = useRegionPresence;
var react_1 = require("react");
var socket_io_client_1 = __importDefault(require("socket.io-client"));
var auth_1 = require("@/stores/auth");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
function useRegionPresence(_a) {
    var _this = this;
    var regionId = _a.regionId, userId = _a.userId, sessionId = _a.sessionId, _b = _a.enabled, enabled = _b === void 0 ? true : _b;
    var _c = (0, react_1.useState)([]), presence = _c[0], setPresence = _c[1];
    var _d = (0, react_1.useState)(false), isEditing = _d[0], setIsEditing = _d[1];
    var _e = (0, react_1.useState)(null), lockedBy = _e[0], setLockedBy = _e[1];
    var _f = (0, react_1.useState)(false), isConnected = _f[0], setIsConnected = _f[1];
    var socketRef = (0, react_1.useRef)(null);
    var intervalRef = (0, react_1.useRef)(null);
    var _g = (0, auth_1.useAuthStore)(), token = _g.token, tenantId = _g.tenantId;
    // Update presence via API
    var updatePresence = (0, react_1.useCallback)(function (editing) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!enabled || !regionId)
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    setIsEditing(editing);
                    // Update via API
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.updatePresence(regionId, userId, sessionId, editing)];
                case 2:
                    // Update via API
                    _b.sent();
                    // Also update via WebSocket if connected
                    if ((_a = socketRef.current) === null || _a === void 0 ? void 0 : _a.connected) {
                        socketRef.current.emit('update-presence', {
                            regionId: regionId,
                            isEditing: editing
                        });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    logger_1.logger.error('Failed to update presence', error_1, 'useRegionPresence');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [enabled, regionId, userId, sessionId]);
    // Acquire lock
    var acquireLock = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var result, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!enabled || !regionId)
                        return [2 /*return*/, false];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    // Try via WebSocket first (faster)
                    if ((_a = socketRef.current) === null || _a === void 0 ? void 0 : _a.connected) {
                        return [2 /*return*/, new Promise(function (resolve) {
                                var timeout = setTimeout(function () {
                                    resolve(false);
                                }, 2000);
                                socketRef.current.once('lock-result', function (result) {
                                    clearTimeout(timeout);
                                    if (result.success) {
                                        setIsEditing(true);
                                        setLockedBy(null);
                                    }
                                    else {
                                        setLockedBy(result.lockedBy || null);
                                    }
                                    resolve(result.success);
                                });
                                socketRef.current.emit('acquire-lock', { regionId: regionId });
                            })];
                    }
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.acquireLock(regionId)];
                case 2:
                    result = _b.sent();
                    if (!result.success) return [3 /*break*/, 4];
                    setIsEditing(true);
                    setLockedBy(null);
                    return [4 /*yield*/, updatePresence(true)];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    setLockedBy(result.lockedBy || null);
                    _b.label = 5;
                case 5: return [2 /*return*/, result.success];
                case 6:
                    error_2 = _b.sent();
                    logger_1.logger.error('Failed to acquire lock', error_2, 'useRegionPresence');
                    return [2 /*return*/, false];
                case 7: return [2 /*return*/];
            }
        });
    }); }, [enabled, regionId, updatePresence]);
    // Release lock
    var releaseLock = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var error_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!enabled || !regionId)
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    // Release via WebSocket if connected
                    if ((_a = socketRef.current) === null || _a === void 0 ? void 0 : _a.connected) {
                        socketRef.current.emit('release-lock', { regionId: regionId });
                    }
                    // Also release via API
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.releaseLock(regionId)];
                case 2:
                    // Also release via API
                    _b.sent();
                    return [4 /*yield*/, updatePresence(false)];
                case 3:
                    _b.sent();
                    setLockedBy(null);
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _b.sent();
                    logger_1.logger.error('Failed to release lock', error_3, 'useRegionPresence');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [enabled, regionId, updatePresence]);
    // Load initial presence from API
    var loadPresence = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var data, editor, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!enabled || !regionId)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.getPresence(regionId)];
                case 2:
                    data = _a.sent();
                    setPresence(data || []);
                    editor = (data || []).find(function (p) { return p.is_editing && p.user_id !== userId; });
                    if (editor) {
                        setLockedBy(editor.user_id);
                    }
                    else {
                        setLockedBy(null);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    logger_1.logger.error('Failed to load presence', error_4, 'useRegionPresence');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [enabled, regionId, userId]);
    // WebSocket connection for real-time updates
    (0, react_1.useEffect)(function () {
        if (!enabled || !regionId || !token || !tenantId)
            return;
        var backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        var socket = (0, socket_io_client_1.default)("".concat(backendUrl, "/dashboard-presence"), {
            auth: {
                token: token,
            },
            transports: ['websocket', 'polling'],
            timeout: 5000,
            autoConnect: true,
        });
        socketRef.current = socket;
        // Connection handlers
        socket.on('connect', function () {
            setIsConnected(true);
            logger_1.logger.debug('Dashboard presence WebSocket connected', { regionId: regionId }, 'useRegionPresence');
            // Join region room
            socket.emit('join-region', { regionId: regionId });
            // Load initial presence
            loadPresence();
        });
        socket.on('disconnect', function () {
            setIsConnected(false);
            logger_1.logger.debug('Dashboard presence WebSocket disconnected', { regionId: regionId }, 'useRegionPresence');
        });
        socket.on('connected', function (data) {
            logger_1.logger.debug('Dashboard presence WebSocket authenticated', data, 'useRegionPresence');
        });
        socket.on('presence-updated', function (data) {
            if (data.regionId === regionId) {
                setPresence(data.presence || []);
                // Check for locks
                var editor = (data.presence || []).find(function (p) { return p.is_editing && p.user_id !== userId; });
                if (editor) {
                    setLockedBy(editor.user_id);
                }
                else {
                    setLockedBy(null);
                }
            }
        });
        socket.on('presence-joined', function (data) {
            if (data.regionId === regionId && data.userId !== userId) {
                // Reload presence when someone joins
                loadPresence();
            }
        });
        socket.on('presence-left', function (data) {
            if (data.regionId === regionId) {
                // Reload presence when someone leaves
                loadPresence();
            }
        });
        socket.on('lock-acquired', function (data) {
            if (data.regionId === regionId) {
                setPresence(data.presence || []);
                if (data.userId !== userId) {
                    setLockedBy(data.userId);
                }
            }
        });
        socket.on('lock-released', function (data) {
            if (data.regionId === regionId) {
                setPresence(data.presence || []);
                if (data.userId === userId) {
                    setIsEditing(false);
                }
                setLockedBy(null);
            }
        });
        socket.on('error', function (error) {
            logger_1.logger.error('Dashboard presence WebSocket error', error, 'useRegionPresence');
        });
        // Fallback: Update presence periodically if WebSocket is not connected
        intervalRef.current = setInterval(function () {
            if (!socket.connected) {
                updatePresence(isEditing);
            }
        }, 30000); // 30 seconds
        return function () {
            // Leave region room
            if (socket.connected) {
                socket.emit('leave-region', { regionId: regionId });
            }
            socket.disconnect();
            socketRef.current = null;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            // Release lock on unmount
            if (isEditing) {
                releaseLock();
            }
        };
    }, [enabled, regionId, token, tenantId, userId, sessionId, loadPresence, updatePresence, isEditing, releaseLock]);
    return {
        presence: presence,
        isEditing: isEditing,
        lockedBy: lockedBy,
        isConnected: isConnected,
        acquireLock: acquireLock,
        releaseLock: releaseLock,
        updatePresence: updatePresence
    };
}
