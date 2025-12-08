"use strict";
/**
 * Compliance API Client
 * API client for compliance endpoints
 *
 * Last Updated: 2025-12-06
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
exports.complianceApi = void 0;
var logger_1 = require("@/utils/logger");
var API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
/**
 * Get authentication token for API requests
 */
var getAuthToken = function () { return __awaiter(void 0, void 0, void 0, function () {
    var authData, parsed;
    return __generator(this, function (_a) {
        try {
            authData = localStorage.getItem('verofield_auth');
            if (authData) {
                parsed = JSON.parse(authData);
                if (parsed.token) {
                    return [2 /*return*/, parsed.token];
                }
            }
            throw new Error('No authentication token found');
        }
        catch (error) {
            logger_1.logger.error('Error getting auth token', error, 'compliance-api');
            throw error;
        }
        return [2 /*return*/];
    });
}); };
/**
 * Make authenticated API request
 */
var apiRequest = function (endpoint_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([endpoint_1], args_1, true), void 0, function (endpoint, options) {
        var token, response_1, error, error_1;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, getAuthToken()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL).concat(endpoint), __assign(__assign({}, options), { headers: __assign({ 'Content-Type': 'application/json', Authorization: "Bearer ".concat(token) }, options.headers) }))];
                case 2:
                    response_1 = _a.sent();
                    if (!!response_1.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response_1.json().catch(function () { return ({ message: response_1.statusText }); })];
                case 3:
                    error = _a.sent();
                    logger_1.logger.error("API request failed: ".concat(endpoint), error, 'compliance-api');
                    throw new Error(error.message || "API request failed: ".concat(response_1.statusText));
                case 4: return [2 /*return*/, response_1.json()];
                case 5:
                    error_1 = _a.sent();
                    logger_1.logger.error("API request error: ".concat(endpoint), error_1, 'compliance-api');
                    throw error_1;
                case 6: return [2 /*return*/];
            }
        });
    });
};
/**
 * Compliance API client
 */
exports.complianceApi = {
    /**
     * Get all rule definitions (R01-R25)
     */
    getRules: function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, apiRequest('/compliance/rules')];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
                case 2:
                    error_2 = _a.sent();
                    logger_1.logger.error('Failed to fetch rules', error_2, 'compliance-api');
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    }); },
    /**
     * Get compliance checks with optional filters
     */
    getComplianceChecks: function (filters) { return __awaiter(void 0, void 0, void 0, function () {
        var params, queryString, endpoint, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    params = new URLSearchParams();
                    if (filters === null || filters === void 0 ? void 0 : filters.prNumber)
                        params.append('prNumber', filters.prNumber.toString());
                    if (filters === null || filters === void 0 ? void 0 : filters.ruleId)
                        params.append('ruleId', filters.ruleId);
                    if (filters === null || filters === void 0 ? void 0 : filters.status)
                        params.append('status', filters.status);
                    if (filters === null || filters === void 0 ? void 0 : filters.severity)
                        params.append('severity', filters.severity);
                    queryString = params.toString();
                    endpoint = "/compliance/checks".concat(queryString ? "?".concat(queryString) : '');
                    return [4 /*yield*/, apiRequest(endpoint)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
                case 2:
                    error_3 = _a.sent();
                    logger_1.logger.error('Failed to fetch compliance checks', error_3, 'compliance-api');
                    throw error_3;
                case 3: return [2 /*return*/];
            }
        });
    }); },
    /**
     * Get compliance status for a specific PR
     */
    getPRCompliance: function (prNumber) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, apiRequest("/compliance/pr/".concat(prNumber))];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
                case 2:
                    error_4 = _a.sent();
                    logger_1.logger.error("Failed to fetch PR ".concat(prNumber, " compliance"), error_4, 'compliance-api');
                    throw error_4;
                case 3: return [2 /*return*/];
            }
        });
    }); },
    /**
     * Get compliance score for a specific PR
     */
    getPRComplianceScore: function (prNumber) { return __awaiter(void 0, void 0, void 0, function () {
        var error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, apiRequest("/compliance/pr/".concat(prNumber, "/score"))];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_5 = _a.sent();
                    logger_1.logger.error("Failed to fetch PR ".concat(prNumber, " compliance score"), error_5, 'compliance-api');
                    throw error_5;
                case 3: return [2 /*return*/];
            }
        });
    }); },
    /**
     * Create a new compliance check (typically called by CI/CD)
     */
    createComplianceCheck: function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, apiRequest('/compliance/checks', {
                            method: 'POST',
                            body: JSON.stringify(data),
                        })];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_6 = _a.sent();
                    logger_1.logger.error('Failed to create compliance check', error_6, 'compliance-api');
                    throw error_6;
                case 3: return [2 /*return*/];
            }
        });
    }); },
    /**
     * Get compliance trends
     */
    getComplianceTrends: function (startDate, endDate, ruleId) { return __awaiter(void 0, void 0, void 0, function () {
        var params, queryString, endpoint, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    params = new URLSearchParams();
                    if (startDate)
                        params.append('startDate', startDate);
                    if (endDate)
                        params.append('endDate', endDate);
                    if (ruleId)
                        params.append('ruleId', ruleId);
                    queryString = params.toString();
                    endpoint = "/compliance/trends".concat(queryString ? "?".concat(queryString) : '');
                    return [4 /*yield*/, apiRequest(endpoint)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_7 = _a.sent();
                    logger_1.logger.error('Failed to fetch compliance trends', error_7, 'compliance-api');
                    throw error_7;
                case 3: return [2 /*return*/];
            }
        });
    }); },
};
