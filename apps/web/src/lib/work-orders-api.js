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
exports.workOrdersApi = void 0;
var logger_1 = require("@/utils/logger");
var API_BASE_URL = "".concat(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api', "/v1");
var WorkOrdersApiService = /** @class */ (function () {
    function WorkOrdersApiService() {
    }
    Object.defineProperty(WorkOrdersApiService.prototype, "getAuthHeaders", {
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
                        logger_1.logger.error('Error parsing auth data', error, 'work-orders-api');
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
    Object.defineProperty(WorkOrdersApiService.prototype, "handleResponse", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (response) {
            return __awaiter(this, void 0, void 0, function () {
                var errorData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!response.ok) return [3 /*break*/, 2];
                            return [4 /*yield*/, response.json().catch(function () { return ({}); })];
                        case 1:
                            errorData = _a.sent();
                            throw new Error(errorData.message || "HTTP error! status: ".concat(response.status));
                        case 2: return [2 /*return*/, response.json()];
                    }
                });
            });
        }
    });
    Object.defineProperty(WorkOrdersApiService.prototype, "getWorkOrders", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, arguments, void 0, function (filters) {
                var params, response, _a, _b;
                var _c;
                if (filters === void 0) { filters = {}; }
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            params = new URLSearchParams();
                            if (filters.status)
                                params.append('status', filters.status);
                            if (filters.priority)
                                params.append('priority', filters.priority);
                            if (filters.assigned_to)
                                params.append('assigned_to', filters.assigned_to);
                            if (filters.customer_id)
                                params.append('customer_id', filters.customer_id);
                            if (filters.start_date)
                                params.append('start_date', filters.start_date);
                            if (filters.end_date)
                                params.append('end_date', filters.end_date);
                            if (filters.page)
                                params.append('page', filters.page.toString());
                            if (filters.limit)
                                params.append('limit', filters.limit.toString());
                            _a = fetch;
                            _b = ["".concat(API_BASE_URL, "/work-orders?").concat(params)];
                            _c = {
                                method: 'GET'
                            };
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.headers = _d.sent(),
                                    _c)]))];
                        case 2:
                            response = _d.sent();
                            return [2 /*return*/, this.handleResponse(response)];
                    }
                });
            });
        }
    });
    Object.defineProperty(WorkOrdersApiService.prototype, "getWorkOrderById", {
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
                            // Validate UUID before making API call
                            if (!id || !this.isValidUUID(id)) {
                                throw new Error("Invalid work order ID: \"".concat(id, "\". ID must be a valid UUID."));
                            }
                            _a = fetch;
                            _b = ["".concat(API_BASE_URL, "/work-orders/").concat(id)];
                            _c = {
                                method: 'GET'
                            };
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.headers = _d.sent(),
                                    _c)]))];
                        case 2:
                            response = _d.sent();
                            return [2 /*return*/, this.handleResponse(response)];
                    }
                });
            });
        }
    });
    Object.defineProperty(WorkOrdersApiService.prototype, "isValidUUID", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (str) {
            if (!str || typeof str !== 'string')
                return false;
            var uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            return uuidRegex.test(str);
        }
    });
    Object.defineProperty(WorkOrdersApiService.prototype, "createWorkOrder", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var response, _a, _b;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = fetch;
                            _b = ["".concat(API_BASE_URL, "/work-orders")];
                            _c = {
                                method: 'POST'
                            };
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.headers = _d.sent(),
                                    _c.body = JSON.stringify(data),
                                    _c)]))];
                        case 2:
                            response = _d.sent();
                            return [2 /*return*/, this.handleResponse(response)];
                    }
                });
            });
        }
    });
    Object.defineProperty(WorkOrdersApiService.prototype, "updateWorkOrder", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var response, _a, _b;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            // Validate UUID before making API call
                            if (!id || !this.isValidUUID(id)) {
                                throw new Error("Invalid work order ID: \"".concat(id, "\". ID must be a valid UUID."));
                            }
                            _a = fetch;
                            _b = ["".concat(API_BASE_URL, "/work-orders/").concat(id)];
                            _c = {
                                method: 'PUT'
                            };
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.headers = _d.sent(),
                                    _c.body = JSON.stringify(data),
                                    _c)]))];
                        case 2:
                            response = _d.sent();
                            return [2 /*return*/, this.handleResponse(response)];
                    }
                });
            });
        }
    });
    Object.defineProperty(WorkOrdersApiService.prototype, "deleteWorkOrder", {
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
                            // Validate UUID before making API call
                            if (!id || !this.isValidUUID(id)) {
                                throw new Error("Invalid work order ID: \"".concat(id, "\". ID must be a valid UUID."));
                            }
                            _a = fetch;
                            _b = ["".concat(API_BASE_URL, "/work-orders/").concat(id)];
                            _c = {
                                method: 'DELETE'
                            };
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.headers = _d.sent(),
                                    _c)]))];
                        case 2:
                            response = _d.sent();
                            return [2 /*return*/, this.handleResponse(response)];
                    }
                });
            });
        }
    });
    Object.defineProperty(WorkOrdersApiService.prototype, "getWorkOrdersByCustomer", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (customerId) {
            return __awaiter(this, void 0, void 0, function () {
                var response, _a, _b;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            // Validate UUID before making API call
                            if (!customerId || !this.isValidUUID(customerId)) {
                                throw new Error("Invalid customer ID: \"".concat(customerId, "\". ID must be a valid UUID."));
                            }
                            _a = fetch;
                            _b = ["".concat(API_BASE_URL, "/work-orders/customer/").concat(customerId)];
                            _c = {
                                method: 'GET'
                            };
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.headers = _d.sent(),
                                    _c)]))];
                        case 2:
                            response = _d.sent();
                            return [2 /*return*/, this.handleResponse(response)];
                    }
                });
            });
        }
    });
    Object.defineProperty(WorkOrdersApiService.prototype, "getWorkOrdersByTechnician", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (technicianId) {
            return __awaiter(this, void 0, void 0, function () {
                var response, _a, _b;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            // Validate UUID before making API call
                            if (!technicianId || !this.isValidUUID(technicianId)) {
                                throw new Error("Invalid technician ID: \"".concat(technicianId, "\". ID must be a valid UUID."));
                            }
                            _a = fetch;
                            _b = ["".concat(API_BASE_URL, "/work-orders/technician/").concat(technicianId)];
                            _c = {
                                method: 'GET'
                            };
                            return [4 /*yield*/, this.getAuthHeaders()];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.headers = _d.sent(),
                                    _c)]))];
                        case 2:
                            response = _d.sent();
                            return [2 /*return*/, this.handleResponse(response)];
                    }
                });
            });
        }
    });
    Object.defineProperty(WorkOrdersApiService.prototype, "changeWorkOrderStatus", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (workOrderId, newStatus, notes) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.updateWorkOrder(workOrderId, __assign({ status: newStatus }, (notes !== undefined ? { notes: notes } : {})))];
                });
            });
        }
    });
    Object.defineProperty(WorkOrdersApiService.prototype, "assignWorkOrder", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (workOrderId, technicianId, scheduledDate) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.updateWorkOrder(workOrderId, __assign({ assigned_to: technicianId }, (scheduledDate !== undefined ? { scheduled_date: scheduledDate } : {})))];
                });
            });
        }
    });
    Object.defineProperty(WorkOrdersApiService.prototype, "bulkUpdateStatus", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (workOrderIds, newStatus, notes) {
            return __awaiter(this, void 0, void 0, function () {
                var promises;
                var _this = this;
                return __generator(this, function (_a) {
                    promises = workOrderIds.map(function (id) {
                        return _this.changeWorkOrderStatus(id, newStatus, notes);
                    });
                    return [2 /*return*/, Promise.all(promises)];
                });
            });
        }
    });
    Object.defineProperty(WorkOrdersApiService.prototype, "searchWorkOrders", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_query_1) {
            return __awaiter(this, arguments, void 0, function (_query, filters) {
                var searchFilters;
                if (filters === void 0) { filters = {}; }
                return __generator(this, function (_a) {
                    searchFilters = __assign({}, filters);
                    return [2 /*return*/, this.getWorkOrders(searchFilters)];
                });
            });
        }
    });
    return WorkOrdersApiService;
}());
exports.workOrdersApi = new WorkOrdersApiService();
