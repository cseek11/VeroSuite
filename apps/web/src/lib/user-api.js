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
exports.userApi = void 0;
var logger_1 = require("@/utils/logger");
var API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
var UserApiService = /** @class */ (function () {
    function UserApiService() {
    }
    Object.defineProperty(UserApiService.prototype, "getAuthHeaders", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var token, authData, parsed, tenantId;
                return __generator(this, function (_a) {
                    token = null;
                    try {
                        authData = localStorage.getItem('verofield_auth');
                        if (authData) {
                            parsed = JSON.parse(authData);
                            token = parsed.token;
                        }
                    }
                    catch (error) {
                        logger_1.logger.error('Error parsing auth data', error, 'user-api');
                    }
                    if (!token) {
                        token = localStorage.getItem('jwt'); // Fallback
                    }
                    tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';
                    return [2 /*return*/, {
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer ".concat(token),
                            'x-tenant-id': tenantId,
                        }];
                });
            });
        }
    });
    Object.defineProperty(UserApiService.prototype, "getUsers", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var url, headers, response, error_1, errorText;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            url = "".concat(API_BASE_URL, "/v1/users");
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1:
                            headers = _a.sent();
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('User API Request', { url: url, headers: headers }, 'user-api');
                            }
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, fetch(url, {
                                    method: 'GET',
                                    headers: headers,
                                })];
                        case 3:
                            response = _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            logger_1.logger.error('Failed to fetch from user API', {
                                error: error_1 instanceof Error ? error_1.message : String(error_1),
                                url: url
                            });
                            throw error_1;
                        case 5:
                            if (!!response.ok) return [3 /*break*/, 7];
                            return [4 /*yield*/, response.text()];
                        case 6:
                            errorText = _a.sent();
                            logger_1.logger.error('User API Error', {
                                status: response.status,
                                statusText: response.statusText,
                                error: errorText
                            }, 'user-api');
                            throw new Error("Failed to fetch users: ".concat(response.statusText));
                        case 7: return [2 /*return*/, response.json()];
                    }
                });
            });
        }
    });
    Object.defineProperty(UserApiService.prototype, "createUser", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (userData) {
            return __awaiter(this, void 0, void 0, function () {
                var url, headers, response, errorText, errorMessage, errorJson, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            url = "".concat(API_BASE_URL, "/v1/users");
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1:
                            headers = _a.sent();
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Create User API Request', { url: url, headers: headers, userData: userData }, 'user-api');
                            }
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 6, , 7]);
                            return [4 /*yield*/, fetch(url, {
                                    method: 'POST',
                                    headers: headers,
                                    body: JSON.stringify(userData),
                                })];
                        case 3:
                            response = _a.sent();
                            if (!!response.ok) return [3 /*break*/, 5];
                            return [4 /*yield*/, response.text()];
                        case 4:
                            errorText = _a.sent();
                            logger_1.logger.error('Create User API Error', {
                                status: response.status,
                                statusText: response.statusText,
                                error: errorText
                            }, 'user-api');
                            errorMessage = "Failed to create user: ".concat(response.statusText);
                            try {
                                errorJson = JSON.parse(errorText);
                                if (errorJson.message) {
                                    // Handle array of messages or single message
                                    if (Array.isArray(errorJson.message)) {
                                        errorMessage = errorJson.message.join(', ');
                                    }
                                    else {
                                        errorMessage = errorJson.message;
                                    }
                                }
                                else if (errorJson.error) {
                                    errorMessage = errorJson.error;
                                }
                            }
                            catch (_b) {
                                // If parsing fails, use the raw error text if available
                                if (errorText) {
                                    errorMessage = errorText;
                                }
                            }
                            throw new Error(errorMessage);
                        case 5: return [2 /*return*/, response.json()];
                        case 6:
                            error_2 = _a.sent();
                            logger_1.logger.error('Failed to create user via API', {
                                error: error_2 instanceof Error ? error_2.message : String(error_2),
                                url: url
                            });
                            throw error_2;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(UserApiService.prototype, "syncUsers", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var url, headers, response, errorText;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            url = "".concat(API_BASE_URL, "/v1/users/sync");
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1:
                            headers = _a.sent();
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Sync Users API Request', { url: url, headers: headers }, 'user-api');
                            }
                            return [4 /*yield*/, fetch(url, {
                                    method: 'POST',
                                    headers: headers,
                                })];
                        case 2:
                            response = _a.sent();
                            if (!!response.ok) return [3 /*break*/, 4];
                            return [4 /*yield*/, response.text()];
                        case 3:
                            errorText = _a.sent();
                            logger_1.logger.error('Sync Users API Error', {
                                status: response.status,
                                statusText: response.statusText,
                                error: errorText
                            }, 'user-api');
                            throw new Error("Failed to sync users: ".concat(response.statusText));
                        case 4: return [2 /*return*/, response.json()];
                    }
                });
            });
        }
    });
    Object.defineProperty(UserApiService.prototype, "getNextEmployeeId", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, arguments, void 0, function (role) {
                var url, headers, response, errorText, data;
                if (role === void 0) { role = 'technician'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            url = "".concat(API_BASE_URL, "/v1/users/next-employee-id?role=").concat(encodeURIComponent(role));
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1:
                            headers = _a.sent();
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Get Next Employee ID API Request', { url: url, headers: headers, role: role }, 'user-api');
                            }
                            return [4 /*yield*/, fetch(url, {
                                    method: 'GET',
                                    headers: headers,
                                })];
                        case 2:
                            response = _a.sent();
                            if (!!response.ok) return [3 /*break*/, 4];
                            return [4 /*yield*/, response.text()];
                        case 3:
                            errorText = _a.sent();
                            logger_1.logger.error('Get Next Employee ID API Error', {
                                status: response.status,
                                statusText: response.statusText,
                                error: errorText
                            }, 'user-api');
                            throw new Error("Failed to get next employee ID: ".concat(response.statusText));
                        case 4: return [4 /*yield*/, response.json()];
                        case 5:
                            data = _a.sent();
                            return [2 /*return*/, data.employee_id];
                    }
                });
            });
        }
    });
    Object.defineProperty(UserApiService.prototype, "updateUser", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (userId, userData) {
            return __awaiter(this, void 0, void 0, function () {
                var url, headers, response, errorText, errorMessage, errorJson;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            url = "".concat(API_BASE_URL, "/v1/users/").concat(userId);
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1:
                            headers = _a.sent();
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Update User API Request', { url: url, headers: headers, userData: userData }, 'user-api');
                            }
                            return [4 /*yield*/, fetch(url, {
                                    method: 'PUT',
                                    headers: headers,
                                    body: JSON.stringify(userData),
                                })];
                        case 2:
                            response = _a.sent();
                            if (!!response.ok) return [3 /*break*/, 4];
                            return [4 /*yield*/, response.text()];
                        case 3:
                            errorText = _a.sent();
                            logger_1.logger.error('Update User API Error', {
                                status: response.status,
                                statusText: response.statusText,
                                error: errorText
                            }, 'user-api');
                            errorMessage = "Failed to update user: ".concat(response.statusText);
                            try {
                                errorJson = JSON.parse(errorText);
                                if (errorJson.message) {
                                    // Handle array of messages or single message
                                    if (Array.isArray(errorJson.message)) {
                                        errorMessage = errorJson.message.join(', ');
                                    }
                                    else {
                                        errorMessage = errorJson.message;
                                    }
                                }
                                else if (errorJson.error) {
                                    errorMessage = errorJson.error;
                                }
                            }
                            catch (_b) {
                                // If parsing fails, use the raw error text if available
                                if (errorText) {
                                    errorMessage = errorText;
                                }
                            }
                            throw new Error(errorMessage);
                        case 4: return [2 /*return*/, response.json()];
                    }
                });
            });
        }
    });
    Object.defineProperty(UserApiService.prototype, "getUserActivity", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (userId_1) {
            return __awaiter(this, arguments, void 0, function (userId, limit) {
                var url, headers, response;
                if (limit === void 0) { limit = 50; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            url = "".concat(API_BASE_URL, "/v1/users/").concat(userId, "/activity?limit=").concat(limit);
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1:
                            headers = _a.sent();
                            return [4 /*yield*/, fetch(url, {
                                    method: 'GET',
                                    headers: headers,
                                })];
                        case 2:
                            response = _a.sent();
                            if (!response.ok) {
                                throw new Error("Failed to fetch user activity: ".concat(response.statusText));
                            }
                            return [2 /*return*/, response.json()];
                    }
                });
            });
        }
    });
    Object.defineProperty(UserApiService.prototype, "getUserHierarchy", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var url, headers, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            url = "".concat(API_BASE_URL, "/v1/users/").concat(userId, "/hierarchy");
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1:
                            headers = _a.sent();
                            return [4 /*yield*/, fetch(url, {
                                    method: 'GET',
                                    headers: headers,
                                })];
                        case 2:
                            response = _a.sent();
                            if (!response.ok) {
                                throw new Error("Failed to fetch user hierarchy: ".concat(response.statusText));
                            }
                            return [2 /*return*/, response.json()];
                    }
                });
            });
        }
    });
    return UserApiService;
}());
exports.userApi = new UserApiService();
