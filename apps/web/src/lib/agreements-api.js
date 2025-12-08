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
exports.agreementsApi = void 0;
var logger_1 = require("@/utils/logger");
var AgreementsApi = /** @class */ (function () {
    function AgreementsApi() {
        Object.defineProperty(this, "baseUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "".concat(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api', "/agreements")
        });
    }
    Object.defineProperty(AgreementsApi.prototype, "getAuthHeaders", {
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
                        logger_1.logger.error('Error parsing auth data', error, 'agreements-api');
                    }
                    // Fallback to direct jwt key
                    if (!token) {
                        token = localStorage.getItem('jwt');
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
    Object.defineProperty(AgreementsApi.prototype, "getAgreements", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, arguments, void 0, function (params) {
                var searchParams, response, _a, _b;
                var _c;
                if (params === void 0) { params = {}; }
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            searchParams = new URLSearchParams();
                            if (params.page)
                                searchParams.append('page', params.page.toString());
                            if (params.limit)
                                searchParams.append('limit', params.limit.toString());
                            if (params.status)
                                searchParams.append('status', params.status);
                            if (params.customerId)
                                searchParams.append('customerId', params.customerId);
                            _a = fetch;
                            _b = ["".concat(this.baseUrl, "?").concat(searchParams)];
                            _c = {
                                method: 'GET'
                            };
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.headers = _d.sent(),
                                    _c)]))];
                        case 2:
                            response = _d.sent();
                            if (!response.ok) {
                                throw new Error("Failed to fetch agreements: ".concat(response.statusText));
                            }
                            return [2 /*return*/, response.json()];
                    }
                });
            });
        }
    });
    Object.defineProperty(AgreementsApi.prototype, "getAgreement", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var response, _a, _b;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = fetch;
                            _b = ["".concat(this.baseUrl, "/").concat(id)];
                            _c = {
                                method: 'GET'
                            };
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.headers = _d.sent(),
                                    _c)]))];
                        case 2:
                            response = _d.sent();
                            if (!response.ok) {
                                throw new Error("Failed to fetch agreement: ".concat(response.statusText));
                            }
                            return [2 /*return*/, response.json()];
                    }
                });
            });
        }
    });
    Object.defineProperty(AgreementsApi.prototype, "createAgreement", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var response, _a, _b, error;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = fetch;
                            _b = [this.baseUrl];
                            _c = {
                                method: 'POST'
                            };
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.headers = _d.sent(),
                                    _c.body = JSON.stringify(data),
                                    _c)]))];
                        case 2:
                            response = _d.sent();
                            if (!!response.ok) return [3 /*break*/, 4];
                            return [4 /*yield*/, response.json()];
                        case 3:
                            error = _d.sent();
                            throw new Error(error.message || "Failed to create agreement: ".concat(response.statusText));
                        case 4: return [2 /*return*/, response.json()];
                    }
                });
            });
        }
    });
    Object.defineProperty(AgreementsApi.prototype, "updateAgreement", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var response, _a, _b, error;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = fetch;
                            _b = ["".concat(this.baseUrl, "/").concat(id)];
                            _c = {
                                method: 'PATCH'
                            };
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.headers = _d.sent(),
                                    _c.body = JSON.stringify(data),
                                    _c)]))];
                        case 2:
                            response = _d.sent();
                            if (!!response.ok) return [3 /*break*/, 4];
                            return [4 /*yield*/, response.json()];
                        case 3:
                            error = _d.sent();
                            throw new Error(error.message || "Failed to update agreement: ".concat(response.statusText));
                        case 4: return [2 /*return*/, response.json()];
                    }
                });
            });
        }
    });
    Object.defineProperty(AgreementsApi.prototype, "deleteAgreement", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var response, _a, _b, error;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = fetch;
                            _b = ["".concat(this.baseUrl, "/").concat(id)];
                            _c = {
                                method: 'DELETE'
                            };
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.headers = _d.sent(),
                                    _c)]))];
                        case 2:
                            response = _d.sent();
                            if (!!response.ok) return [3 /*break*/, 4];
                            return [4 /*yield*/, response.json()];
                        case 3:
                            error = _d.sent();
                            throw new Error(error.message || "Failed to delete agreement: ".concat(response.statusText));
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(AgreementsApi.prototype, "getAgreementStats", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, _a, _b;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = fetch;
                            _b = ["".concat(this.baseUrl, "/stats")];
                            _c = {
                                method: 'GET'
                            };
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.headers = _d.sent(),
                                    _c)]))];
                        case 2:
                            response = _d.sent();
                            if (!response.ok) {
                                throw new Error("Failed to fetch agreement stats: ".concat(response.statusText));
                            }
                            return [2 /*return*/, response.json()];
                    }
                });
            });
        }
    });
    Object.defineProperty(AgreementsApi.prototype, "getExpiringAgreements", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, arguments, void 0, function (days) {
                var response, _a, _b;
                var _c;
                if (days === void 0) { days = 30; }
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = fetch;
                            _b = ["".concat(this.baseUrl, "/expiring?days=").concat(days)];
                            _c = {
                                method: 'GET'
                            };
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.headers = _d.sent(),
                                    _c)]))];
                        case 2:
                            response = _d.sent();
                            if (!response.ok) {
                                throw new Error("Failed to fetch expiring agreements: ".concat(response.statusText));
                            }
                            return [2 /*return*/, response.json()];
                    }
                });
            });
        }
    });
    return AgreementsApi;
}());
exports.agreementsApi = new AgreementsApi();
