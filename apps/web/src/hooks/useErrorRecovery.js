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
exports.useErrorRecovery = useErrorRecovery;
var react_1 = require("react");
var logger_1 = require("@/utils/logger");
/**
 * Hook for error recovery with exponential backoff retry logic
 */
function useErrorRecovery(options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    var _a = options.maxRetries, maxRetries = _a === void 0 ? 3 : _a, _b = options.initialDelay, initialDelay = _b === void 0 ? 1000 : _b, _c = options.maxDelay, maxDelay = _c === void 0 ? 30000 : _c, _d = options.backoffMultiplier, backoffMultiplier = _d === void 0 ? 2 : _d, onRetry = options.onRetry, onMaxRetriesReached = options.onMaxRetriesReached;
    var _e = (0, react_1.useState)({
        error: null,
        retryCount: 0,
        isRetrying: false,
        lastErrorTime: null
    }), state = _e[0], setState = _e[1];
    var retryTimeoutRef = (0, react_1.useRef)(null);
    var retryAttemptRef = (0, react_1.useRef)(0);
    /**
     * Calculate delay for next retry using exponential backoff
     */
    var calculateDelay = (0, react_1.useCallback)(function (attempt) {
        var delay = initialDelay * Math.pow(backoffMultiplier, attempt);
        return Math.min(delay, maxDelay);
    }, [initialDelay, backoffMultiplier, maxDelay]);
    /**
     * Execute operation with retry logic
     */
    var executeWithRetry = (0, react_1.useCallback)(function (operation, context) { return __awaiter(_this, void 0, void 0, function () {
        var lastError, _loop_1, attempt, state_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lastError = null;
                    _loop_1 = function (attempt) {
                        var delay_1, result, error_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 4, , 5]);
                                    setState(function (prev) { return (__assign(__assign({}, prev), { retryCount: attempt, isRetrying: attempt > 0, error: null })); });
                                    if (!(attempt > 0)) return [3 /*break*/, 2];
                                    delay_1 = calculateDelay(attempt - 1);
                                    logger_1.logger.info("Retrying operation (attempt ".concat(attempt, "/").concat(maxRetries, ")"), {
                                        context: context,
                                        delay: delay_1,
                                        attempt: attempt
                                    }, 'useErrorRecovery');
                                    return [4 /*yield*/, new Promise(function (resolve) {
                                            retryTimeoutRef.current = setTimeout(resolve, delay_1);
                                        })];
                                case 1:
                                    _b.sent();
                                    if (onRetry) {
                                        onRetry(attempt);
                                    }
                                    _b.label = 2;
                                case 2: return [4 /*yield*/, operation()];
                                case 3:
                                    result = _b.sent();
                                    // Success - reset state
                                    setState({
                                        error: null,
                                        retryCount: 0,
                                        isRetrying: false,
                                        lastErrorTime: null
                                    });
                                    retryAttemptRef.current = 0;
                                    return [2 /*return*/, { value: result }];
                                case 4:
                                    error_1 = _b.sent();
                                    lastError = error_1 instanceof Error ? error_1 : new Error(String(error_1));
                                    logger_1.logger.error("Operation failed (attempt ".concat(attempt + 1, "/").concat(maxRetries + 1, ")"), {
                                        error: lastError,
                                        context: context,
                                        attempt: attempt + 1
                                    }, 'useErrorRecovery');
                                    // If this was the last attempt, set error state
                                    if (attempt === maxRetries) {
                                        setState({
                                            error: lastError,
                                            retryCount: attempt + 1,
                                            isRetrying: false,
                                            lastErrorTime: Date.now()
                                        });
                                        if (onMaxRetriesReached) {
                                            onMaxRetriesReached();
                                        }
                                        throw lastError;
                                    }
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    };
                    attempt = 0;
                    _a.label = 1;
                case 1:
                    if (!(attempt <= maxRetries)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(attempt)];
                case 2:
                    state_1 = _a.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    _a.label = 3;
                case 3:
                    attempt++;
                    return [3 /*break*/, 1];
                case 4: throw lastError || new Error('Operation failed');
            }
        });
    }); }, [maxRetries, calculateDelay, onRetry, onMaxRetriesReached]);
    /**
     * Manually retry the last failed operation
     */
    var retry = (0, react_1.useCallback)(function (operation) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, executeWithRetry(operation)];
        });
    }); }, [executeWithRetry]);
    /**
     * Clear error state
     */
    var clearError = (0, react_1.useCallback)(function () {
        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
        }
        setState({
            error: null,
            retryCount: 0,
            isRetrying: false,
            lastErrorTime: null
        });
        retryAttemptRef.current = 0;
    }, []);
    /**
     * Check if error is recoverable (not a permanent error)
     */
    var isRecoverableError = (0, react_1.useCallback)(function (error) {
        // Network errors are usually recoverable
        if (error.message.includes('network') ||
            error.message.includes('fetch') ||
            error.message.includes('timeout')) {
            return true;
        }
        // 5xx server errors are usually recoverable
        if (error.message.includes('500') ||
            error.message.includes('502') ||
            error.message.includes('503') ||
            error.message.includes('504')) {
            return true;
        }
        // 429 (rate limit) is recoverable after delay
        if (error.message.includes('429')) {
            return true;
        }
        // 4xx client errors are usually not recoverable
        if (error.message.includes('400') ||
            error.message.includes('401') ||
            error.message.includes('403') ||
            error.message.includes('404')) {
            return false;
        }
        // Default to recoverable
        return true;
    }, []);
    /**
     * Get time since last error
     */
    var getTimeSinceLastError = (0, react_1.useCallback)(function () {
        if (!state.lastErrorTime) {
            return null;
        }
        return Date.now() - state.lastErrorTime;
    }, [state.lastErrorTime]);
    return {
        error: state.error,
        retryCount: state.retryCount,
        isRetrying: state.isRetrying,
        executeWithRetry: executeWithRetry,
        retry: retry,
        clearError: clearError,
        isRecoverableError: isRecoverableError,
        getTimeSinceLastError: getTimeSinceLastError,
        hasError: state.error !== null,
        canRetry: state.retryCount < maxRetries && !state.isRetrying
    };
}
