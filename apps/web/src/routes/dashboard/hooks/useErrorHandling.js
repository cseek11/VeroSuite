"use strict";
/**
 * Centralized error handling for card operations
 * Provides user-visible errors, retry mechanisms, and error tracking
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
exports.useErrorHandling = void 0;
var react_1 = require("react");
var logger_1 = require("@/utils/logger");
var cardConstants_1 = require("../utils/cardConstants");
var useErrorHandling = function () {
    var _a = (0, react_1.useState)([]), errors = _a[0], setErrors = _a[1];
    var retryOperationsRef = (0, react_1.useRef)(new Map());
    var showError = (0, react_1.useCallback)(function (message, operation, retryable, operationFn) {
        if (retryable === void 0) { retryable = false; }
        var errorId = "error-".concat(Date.now(), "-").concat(Math.random());
        var error = {
            id: errorId,
            message: message,
            operation: operation,
            timestamp: new Date(),
            retryable: retryable,
            retryCount: 0,
        };
        setErrors(function (prev) { return __spreadArray(__spreadArray([], prev, true), [error], false); });
        logger_1.logger.error("Card operation failed: ".concat(operation), new Error(message), 'CardSystem');
        // Store operation function for retry if provided
        if (retryable && operationFn) {
            retryOperationsRef.current.set(errorId, operationFn);
        }
        // Auto-dismiss non-retryable errors after 5 seconds
        if (!retryable) {
            setTimeout(function () {
                setErrors(function (prev) { return prev.filter(function (e) { return e.id !== errorId; }); });
            }, 5000);
        }
        return errorId;
    }, []);
    var clearError = (0, react_1.useCallback)(function (errorId) {
        setErrors(function (prev) { return prev.filter(function (e) { return e.id !== errorId; }); });
        retryOperationsRef.current.delete(errorId);
    }, []);
    var clearAllErrors = (0, react_1.useCallback)(function () {
        setErrors([]);
        retryOperationsRef.current.clear();
    }, []);
    var retryOperation = (0, react_1.useCallback)(function (errorId, operation) { return __awaiter(void 0, void 0, void 0, function () {
        var storedOperation, error, delay, retryError_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storedOperation = operation || retryOperationsRef.current.get(errorId);
                    if (!storedOperation) {
                        logger_1.logger.warn('No operation to retry', { errorId: errorId });
                        return [2 /*return*/];
                    }
                    error = errors.find(function (e) { return e.id === errorId; });
                    if (!error || !error.retryable) {
                        logger_1.logger.warn('Cannot retry operation', { errorId: errorId, error: error });
                        return [2 /*return*/];
                    }
                    // Check retry limit
                    if (error.retryCount >= cardConstants_1.CARD_CONSTANTS.PERSISTENCE.RETRY_ATTEMPTS) {
                        logger_1.logger.error('Max retries reached', { errorId: errorId, retryCount: error.retryCount });
                        setErrors(function (prev) { return prev.map(function (e) {
                            return e.id === errorId
                                ? __assign(__assign({}, e), { message: "".concat(e.message, " (Max retries reached)"), retryable: false }) : e;
                        }); });
                        return [2 /*return*/];
                    }
                    // Store operation for retry if provided
                    if (operation) {
                        retryOperationsRef.current.set(errorId, operation);
                    }
                    // Update retry count
                    setErrors(function (prev) { return prev.map(function (e) {
                        return e.id === errorId
                            ? __assign(__assign({}, e), { retryCount: e.retryCount + 1 }) : e;
                    }); });
                    delay = cardConstants_1.CARD_CONSTANTS.PERSISTENCE.RETRY_DELAY_BASE_MS * Math.pow(2, error.retryCount);
                    logger_1.logger.info('Retrying operation', { errorId: errorId, attempt: error.retryCount + 1, delay: delay });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, storedOperation()];
                case 3:
                    _a.sent();
                    // Success - clear error
                    clearError(errorId);
                    logger_1.logger.info('Operation retry succeeded', { errorId: errorId });
                    return [3 /*break*/, 5];
                case 4:
                    retryError_1 = _a.sent();
                    logger_1.logger.error('Operation retry failed', retryError_1, 'CardSystem');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [errors, clearError]);
    return {
        errors: errors,
        showError: showError,
        clearError: clearError,
        clearAllErrors: clearAllErrors,
        retryOperation: retryOperation,
        hasErrors: errors.length > 0,
    };
};
exports.useErrorHandling = useErrorHandling;
