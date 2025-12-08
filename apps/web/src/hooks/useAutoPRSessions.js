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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAutoPRSessions = void 0;
var react_1 = require("react");
var logger_1 = require("@/utils/logger");
var auth_1 = require("@/stores/auth");
/**
 * Hook for fetching Auto-PR session data from the backend API
 *
 * API endpoint: GET /api/v1/sessions
 * Returns: SessionData from the session state files
 */
var useAutoPRSessions = function () {
    var _a = (0, react_1.useState)({
        active_sessions: {},
        completed_sessions: [],
    }), sessions = _a[0], setSessions = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var fetchSessions = function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, errorMessage, errorData, _a, data, err_1, errorMessage, networkError;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 8, 9, 10]);
                    setLoading(true);
                    setError(null);
                    token = auth_1.useAuthStore.getState().token;
                    if (!token) {
                        throw new Error('Authentication required. Please log in.');
                    }
                    return [4 /*yield*/, fetch('/api/v1/sessions', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(token),
                            },
                            credentials: 'include', // Include cookies for authentication
                        })];
                case 1:
                    response = _b.sent();
                    if (!!response.ok) return [3 /*break*/, 6];
                    errorMessage = "Failed to fetch sessions: ".concat(response.status, " ").concat(response.statusText);
                    if (response.status === 401) {
                        errorMessage = 'Authentication required. Please log in.';
                    }
                    else if (response.status === 404) {
                        errorMessage = 'API endpoint not found. Please ensure the backend server is running on port 3001.';
                    }
                    else if (response.status >= 500) {
                        errorMessage = "Backend server error: ".concat(response.status, " ").concat(response.statusText);
                    }
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, response.json()];
                case 3:
                    errorData = _b.sent();
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    }
                    return [3 /*break*/, 5];
                case 4:
                    _a = _b.sent();
                    return [3 /*break*/, 5];
                case 5: throw new Error(errorMessage);
                case 6: return [4 /*yield*/, response.json()];
                case 7:
                    data = _b.sent();
                    // Debug logging
                    logger_1.logger.debug('Raw session data received from API', {
                        activeSessions: Object.keys(data.active_sessions || {}),
                        activeCount: Object.keys(data.active_sessions || {}).length,
                        completedCount: (data.completed_sessions || []).length,
                        dataKeys: Object.keys(data),
                    }, 'useAutoPRSessions');
                    setSessions(data);
                    logger_1.logger.info('Session data loaded successfully', {
                        activeCount: Object.keys(data.active_sessions || {}).length,
                        completedCount: (data.completed_sessions || []).length,
                        activeSessionIds: Object.keys(data.active_sessions || {}),
                    }, 'useAutoPRSessions');
                    return [3 /*break*/, 10];
                case 8:
                    err_1 = _b.sent();
                    errorMessage = err_1 instanceof Error ? err_1.message : 'Failed to load sessions';
                    // Check if it's a network error (backend not running)
                    if (err_1 instanceof TypeError && err_1.message.includes('fetch')) {
                        networkError = 'Cannot connect to backend API. Please ensure the backend server is running on http://localhost:3001';
                        logger_1.logger.error('Failed to fetch session data - network error', new Error(networkError), 'useAutoPRSessions');
                        setError(networkError);
                    }
                    else {
                        logger_1.logger.error('Failed to fetch session data', new Error(errorMessage), 'useAutoPRSessions');
                        setError(errorMessage);
                    }
                    // Set empty data on error to allow UI to show error message
                    setSessions({
                        active_sessions: {},
                        completed_sessions: [],
                    });
                    return [3 /*break*/, 10];
                case 9:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        fetchSessions();
        var interval = setInterval(fetchSessions, 30000); // Refresh every 30s
        return function () { return clearInterval(interval); };
    }, []);
    var completeSession = function (sessionId) { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, err_2, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    token = auth_1.useAuthStore.getState().token;
                    if (!token) {
                        throw new Error('Authentication required. Please log in.');
                    }
                    return [4 /*yield*/, fetch("/api/v1/sessions/".concat(sessionId, "/complete"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(token),
                            },
                            credentials: 'include', // Include cookies for authentication
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        if (response.status === 401) {
                            throw new Error('Authentication required. Please log in.');
                        }
                        else if (response.status === 404) {
                            throw new Error("Session with ID ".concat(sessionId, " not found."));
                        }
                        else {
                            throw new Error("Failed to complete session: ".concat(response.status, " ").concat(response.statusText));
                        }
                    }
                    logger_1.logger.info('Session completed successfully', { sessionId: sessionId }, 'useAutoPRSessions');
                    return [4 /*yield*/, fetchSessions()];
                case 2:
                    _a.sent(); // Reload after completion
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    errorMessage = err_2 instanceof Error ? err_2.message : 'Failed to complete session';
                    logger_1.logger.error('Failed to complete session', new Error(errorMessage), 'useAutoPRSessions');
                    throw new Error(errorMessage);
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return {
        sessions: sessions,
        loading: loading,
        error: error,
        refetch: fetchSessions,
        completeSession: completeSession,
    };
};
exports.useAutoPRSessions = useAutoPRSessions;
