"use strict";
// ============================================================================
// ENHANCED API CLIENT - Comprehensive Pest Control Management System
// ============================================================================
// This file provides a unified API client for all database operations
// with multi-tenant support, type safety, and comprehensive error handling
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
exports.enhancedApi = exports.userKpis = exports.kpiTemplates = exports.financial = exports.inventory = exports.billing = exports.company = exports.authApi = exports.analytics = exports.technicianSkills = exports.serviceAreas = exports.compliance = exports.communication = exports.paymentMethods = exports.pricing = exports.customerSegments = exports.serviceCategories = exports.serviceTypes = exports.locations = exports.jobs = exports.workOrders = exports.customerContacts = exports.customerProfiles = exports.customers = exports.getTenantId = void 0;
var supabase_client_1 = require("./supabase-client");
var api_utils_1 = require("./api-utils");
var logger_1 = require("@/utils/logger");
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
var getTenantId = function () { return __awaiter(void 0, void 0, void 0, function () {
    var user, tenantIdFromMetadata, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, supabase_client_1.supabase.auth.getUser()];
            case 1:
                user = (_b.sent()).data.user;
                if (user) {
                    tenantIdFromMetadata = (_a = user.user_metadata) === null || _a === void 0 ? void 0 : _a.tenant_id;
                    if (tenantIdFromMetadata) {
                        logger_1.logger.debug('User tenant ID retrieved from metadata', { tenantId: tenantIdFromMetadata }, 'enhanced-api');
                        return [2 /*return*/, tenantIdFromMetadata];
                    }
                    // For development, use a default tenant ID since RPC function doesn't exist
                    logger_1.logger.debug('No authenticated user found, using fallback tenant ID for development', {}, 'enhanced-api');
                    return [2 /*return*/, '7193113e-ece2-4f7b-ae8c-176df4367e28']; // Default tenant ID
                }
                // If no user, use fallback tenant ID for development
                logger_1.logger.debug('No authenticated user found, using fallback tenant ID for development', {}, 'enhanced-api');
                return [2 /*return*/, '7193113e-ece2-4f7b-ae8c-176df4367e28']; // Default tenant ID
            case 2:
                error_1 = _b.sent();
                logger_1.logger.error('Error resolving tenant ID', error_1, 'enhanced-api');
                logger_1.logger.debug('Using fallback tenant ID due to error', {}, 'enhanced-api');
                return [2 /*return*/, '7193113e-ece2-4f7b-ae8c-176df4367e28']; // Default tenant ID
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTenantId = getTenantId;
var getUserId = function () { return __awaiter(void 0, void 0, void 0, function () {
    var user, authData, parsed, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, supabase_client_1.supabase.auth.getUser()];
            case 1:
                user = (_b.sent()).data.user;
                if (user) {
                    logger_1.logger.debug('User ID retrieved from auth', { userId: user.id }, 'enhanced-api');
                    return [2 /*return*/, user.id];
                }
                authData = localStorage.getItem('verofield_auth');
                if (authData) {
                    parsed = JSON.parse(authData);
                    if ((_a = parsed.user) === null || _a === void 0 ? void 0 : _a.id) {
                        logger_1.logger.debug('User ID retrieved from localStorage', { userId: parsed.user.id }, 'enhanced-api');
                        return [2 /*return*/, parsed.user.id];
                    }
                }
                throw new Error('No authenticated user found');
            case 2:
                error_2 = _b.sent();
                logger_1.logger.error('Error getting user ID', error_2, 'enhanced-api');
                logger_1.logger.debug('Using fallback user ID due to error', {}, 'enhanced-api');
                return [2 /*return*/, '85b4bc59-650a-4fdf-beac-1dd2ba3066f4']; // Default user ID for development
            case 3: return [2 /*return*/];
        }
    });
}); };
var getAuthToken = function () { return __awaiter(void 0, void 0, void 0, function () {
    var authData, parsed, session, supabaseError_1, jwtToken, error, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                authData = localStorage.getItem('verofield_auth');
                if (authData) {
                    try {
                        parsed = JSON.parse(authData);
                        if (parsed.token) {
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Auth token retrieved from localStorage (backend token)', {}, 'enhanced-api');
                            }
                            return [2 /*return*/, parsed.token];
                        }
                    }
                    catch (parseError) {
                        // If parsing fails, try as direct token string
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('Auth data is not JSON, trying as direct token', {}, 'enhanced-api');
                        }
                    }
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, supabase_client_1.supabase.auth.getSession()];
            case 2:
                session = (_a.sent()).data.session;
                if (session === null || session === void 0 ? void 0 : session.access_token) {
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Auth token retrieved from Supabase session', {}, 'enhanced-api');
                    }
                    return [2 /*return*/, session.access_token];
                }
                return [3 /*break*/, 4];
            case 3:
                supabaseError_1 = _a.sent();
                if (process.env.NODE_ENV === 'development') {
                    logger_1.logger.debug('Supabase session check failed', { error: supabaseError_1 }, 'enhanced-api');
                }
                return [3 /*break*/, 4];
            case 4:
                jwtToken = localStorage.getItem('jwt');
                if (jwtToken) {
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Auth token retrieved from jwt key', {}, 'enhanced-api');
                    }
                    return [2 /*return*/, jwtToken];
                }
                error = new Error('No authentication token found. Please log in again.');
                error.isAuthError = true;
                throw error;
            case 5:
                error_3 = _a.sent();
                if (error_3 === null || error_3 === void 0 ? void 0 : error_3.isAuthError) {
                    logger_1.logger.warn('No auth token available - user may not be logged in', {}, 'enhanced-api');
                    throw error_3;
                }
                logger_1.logger.error('Error getting auth token', error_3, 'enhanced-api');
                throw new Error('Authentication required. Please log in again.');
            case 6: return [2 /*return*/];
        }
    });
}); };
// New function to validate tenant access for a specific claimed tenant ID
var handleApiError = function (error, context) {
    var _a, _b;
    var errorMessage = 'Unknown error';
    var errorDetails = null;
    if (error && typeof error === 'object') {
        if ('response' in error) {
            var response = error.response;
            errorMessage = response.statusText || "HTTP ".concat(response.status);
            // Try to extract error details if available
            if (response._bodyInit) {
                try {
                    var errorBody = JSON.parse(response._bodyInit);
                    errorDetails = errorBody;
                    if (errorBody.message) {
                        if (Array.isArray(errorBody.message)) {
                            errorMessage = errorBody.message.join(', ');
                        }
                        else {
                            errorMessage = errorBody.message;
                        }
                    }
                    else if (errorBody.error) {
                        errorMessage = errorBody.error;
                    }
                }
                catch (_c) {
                    // If parsing fails, use status text
                }
            }
        }
        else if ('message' in error) {
            errorMessage = error.message;
        }
    }
    else if (error instanceof Error) {
        errorMessage = error.message;
        // Check if error has validation details from api-utils
        if (error.details) {
            if (Array.isArray(error.details)) {
                errorDetails = error.details;
                errorMessage = "".concat(errorMessage, "\n").concat(errorDetails.join('\n'));
            }
            else if (typeof error.details === 'object' && error.details.errors) {
                // NestJS ValidationPipe format nested in details
                errorDetails = error.details.errors;
                errorMessage = error.details.message || errorMessage;
            }
        }
        // Check if error has response data attached
        if ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) {
            var responseData_1 = error.response.data;
            if (responseData_1.errors && Array.isArray(responseData_1.errors)) {
                errorDetails = responseData_1.errors;
                errorMessage = responseData_1.message || errorMessage;
            }
            else if (responseData_1.message) {
                errorMessage = Array.isArray(responseData_1.message)
                    ? responseData_1.message.join(', ')
                    : responseData_1.message;
            }
        }
    }
    // Combine message and details for full error message
    var fullMessage = errorMessage;
    if (errorDetails && Array.isArray(errorDetails) && errorDetails.length > 0) {
        fullMessage = "".concat(errorMessage, "\n\nValidation errors:\n").concat(errorDetails.map(function (e, i) { return "  ".concat(i + 1, ". ").concat(e); }).join('\n'));
    }
    var responseData = (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data;
    logger_1.logger.error("API Error in ".concat(context), {
        error: error,
        details: errorDetails,
        message: errorMessage,
        fullMessage: fullMessage,
        responseData: responseData
    }, 'enhanced-api');
    // Create error with validation details if available
    var finalError = new Error("Failed to ".concat(context, ": ").concat(fullMessage));
    if (errorDetails) {
        finalError.validationErrors = errorDetails;
    }
    throw finalError;
};
// ============================================================================
// CUSTOMER MANAGEMENT API
// ============================================================================
exports.customers = {
    // Get all customers with optional filtering
    getAll: function (filters) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, query, searchTerm, phoneDigits, searchQuery_1, addressTokens, _a, data, error, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    query = supabase_client_1.supabase
                        .from('accounts')
                        .select('*')
                        .eq('tenant_id', tenantId);
                    if (filters === null || filters === void 0 ? void 0 : filters.search) {
                        searchTerm = filters.search.trim();
                        if (searchTerm.length > 0) {
                            phoneDigits = searchTerm.replace(/\D/g, '');
                            searchQuery_1 = "name.ilike.%".concat(searchTerm, "%,email.ilike.%").concat(searchTerm, "%");
                            // Enhanced phone search using phone_digits column for better partial matching
                            if (phoneDigits.length > 0) {
                                // Search both formatted phone and normalized phone_digits
                                searchQuery_1 += ",phone.ilike.%".concat(searchTerm, "%,phone_digits.ilike.%").concat(phoneDigits, "%");
                                // Also search for phone numbers that contain the digits anywhere
                                // This handles cases like searching "5551234" matching "(412) 555-1234"
                                searchQuery_1 += ",phone.ilike.%".concat(phoneDigits, "%");
                            }
                            else {
                                searchQuery_1 += ",phone.ilike.%".concat(searchTerm, "%");
                            }
                            addressTokens = searchTerm.split(/\s+/).filter(function (token) { return token.length > 0; });
                            if (addressTokens.length > 1) {
                                // Multi-word search: each token must match somewhere in address fields
                                addressTokens.forEach(function (token) {
                                    searchQuery_1 += ",address.ilike.%".concat(token, "%,city.ilike.%").concat(token, "%,state.ilike.%").concat(token, "%,zip_code.ilike.%").concat(token, "%");
                                });
                            }
                            else {
                                // Single word search
                                searchQuery_1 += ",address.ilike.%".concat(searchTerm, "%,city.ilike.%").concat(searchTerm, "%,state.ilike.%").concat(searchTerm, "%,zip_code.ilike.%").concat(searchTerm, "%");
                            }
                            // Add account type search
                            searchQuery_1 += ",account_type.ilike.%".concat(searchTerm, "%");
                            // Add status search
                            searchQuery_1 += ",status.ilike.%".concat(searchTerm, "%");
                            query = query.or(searchQuery_1);
                        }
                    }
                    if (filters === null || filters === void 0 ? void 0 : filters.status) {
                        query = query.eq('status', filters.status);
                    }
                    if (filters === null || filters === void 0 ? void 0 : filters.segmentId) {
                        query = query.eq('segment_id', filters.segmentId);
                    }
                    return [4 /*yield*/, query.order('name')];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 3:
                    error_4 = _b.sent();
                    logger_1.logger.error('Error fetching customers', error_4, 'enhanced-api');
                    throw error_4;
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // Get customer by ID with all related data
    getById: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, accountData, accountError, _b, customerData, customerError, transformedCustomer, error_5;
        var _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    _l.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _l.sent();
                    // Primary: Fetch from accounts table (real customer data)
                    logger_1.logger.debug('Fetching customer from accounts table', { customerId: id }, 'enhanced-api');
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('accounts')
                            .select('*')
                            .eq('id', id)
                            .eq('tenant_id', tenantId)
                            .single()];
                case 2:
                    _a = _l.sent(), accountData = _a.data, accountError = _a.error;
                    if (accountData && !accountError) {
                        logger_1.logger.debug('Customer loaded from accounts table', { customerName: accountData.name }, 'enhanced-api');
                        return [2 /*return*/, accountData];
                    }
                    // Fallback: Try customers table (test data)
                    logger_1.logger.debug('Customer not found in accounts table, trying customers table', { customerId: id }, 'enhanced-api');
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('customers')
                            .select('*')
                            .eq('id', id)
                            .eq('tenant_id', tenantId)
                            .single()];
                case 3:
                    _b = _l.sent(), customerData = _b.data, customerError = _b.error;
                    if (customerData && !customerError) {
                        transformedCustomer = {
                            id: customerData.id,
                            name: "".concat(customerData.first_name, " ").concat(customerData.last_name),
                            email: customerData.email,
                            phone: customerData.phone,
                            address: customerData.address,
                            city: customerData.city,
                            state: customerData.state,
                            zip_code: customerData.zip_code,
                            status: customerData.status,
                            account_type: customerData.account_type,
                            created_at: customerData.created_at,
                            updated_at: customerData.updated_at,
                            tenant_id: customerData.tenant_id,
                            // Set defaults for missing fields
                            ar_balance: 0,
                            property_type: (_c = customerData.property_type) !== null && _c !== void 0 ? _c : '',
                            property_size: (_d = customerData.property_size) !== null && _d !== void 0 ? _d : '',
                            access_instructions: (_e = customerData.access_instructions) !== null && _e !== void 0 ? _e : '',
                            emergency_contact: (_f = customerData.emergency_contact) !== null && _f !== void 0 ? _f : '',
                            preferred_contact_method: (_g = customerData.preferred_contact_method) !== null && _g !== void 0 ? _g : '',
                            billing_address: (_h = customerData.billing_address) !== null && _h !== void 0 ? _h : '',
                            payment_method: (_j = customerData.payment_method) !== null && _j !== void 0 ? _j : '',
                            billing_cycle: (_k = customerData.billing_cycle) !== null && _k !== void 0 ? _k : ''
                        };
                        logger_1.logger.debug('Customer loaded from customers table', { customerName: transformedCustomer.name }, 'enhanced-api');
                        return [2 /*return*/, transformedCustomer];
                    }
                    logger_1.logger.error('Customer not found in either table', accountError || customerError, 'enhanced-api');
                    throw accountError || customerError;
                case 4:
                    error_5 = _l.sent();
                    return [2 /*return*/, handleApiError(error_5, 'fetch customer')];
                case 5: return [2 /*return*/];
            }
        });
    }); },
    // Create new customer
    create: function (customerData) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('accounts')
                            .insert(__assign(__assign({}, customerData), { tenant_id: tenantId }))
                            .select()
                            .single()];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 3:
                    error_6 = _b.sent();
                    return [2 /*return*/, handleApiError(error_6, 'create customer')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // Update customer
    update: function (id, updates) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, allowedAccountColumns_1, filteredAccountUpdates_1, _a, accountData, accountError, allowedCustomerColumns_1, filteredCustomerUpdates_1, _b, customerData, customerError, transformedCustomer, error_7;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    _m.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _m.sent();
                    // Primary: Update in accounts table (real customer data)
                    logger_1.logger.debug('Updating customer in accounts table', { customerId: id }, 'enhanced-api');
                    allowedAccountColumns_1 = [
                        'name', 'email', 'phone', 'address', 'city', 'state', 'zip_code',
                        'status', 'account_type', 'notes', 'ar_balance',
                        'company_name', 'contact_person'
                    ];
                    filteredAccountUpdates_1 = {};
                    Object.entries(updates || {}).forEach(function (_a) {
                        var key = _a[0], value = _a[1];
                        if (allowedAccountColumns_1.includes(key)) {
                            filteredAccountUpdates_1[key] = value;
                        }
                    });
                    // Always touch updated_at when updating accounts
                    filteredAccountUpdates_1.updated_at = new Date().toISOString();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('accounts')
                            .update(filteredAccountUpdates_1)
                            .eq('id', id)
                            .eq('tenant_id', tenantId)
                            .select()
                            .single()];
                case 2:
                    _a = _m.sent(), accountData = _a.data, accountError = _a.error;
                    if (accountData && !accountError) {
                        logger_1.logger.debug('Customer updated in accounts table', { customerName: accountData.name }, 'enhanced-api');
                        return [2 /*return*/, accountData];
                    }
                    // Fallback: Try customers table (test data)
                    logger_1.logger.debug('Customer not found in accounts table, trying customers table', { customerId: id }, 'enhanced-api');
                    allowedCustomerColumns_1 = [
                        'first_name', 'last_name', 'email', 'phone', 'address', 'city', 'state',
                        'zip_code', 'country', 'status', 'account_type', 'notes'
                    ];
                    filteredCustomerUpdates_1 = {};
                    Object.entries(updates || {}).forEach(function (_a) {
                        var key = _a[0], value = _a[1];
                        if (allowedCustomerColumns_1.includes(key)) {
                            filteredCustomerUpdates_1[key] = value;
                        }
                    });
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('customers')
                            .update(__assign(__assign(__assign({}, filteredCustomerUpdates_1), (updates.name && {
                            first_name: updates.name.split(' ')[0] || '',
                            last_name: updates.name.split(' ').slice(1).join(' ') || ''
                        })), { updated_at: new Date().toISOString() }))
                            .eq('id', id)
                            .eq('tenant_id', tenantId)
                            .select()
                            .single()];
                case 3:
                    _b = _m.sent(), customerData = _b.data, customerError = _b.error;
                    if (customerData && !customerError) {
                        transformedCustomer = {
                            id: customerData.id,
                            name: "".concat(customerData.first_name, " ").concat(customerData.last_name),
                            email: customerData.email,
                            phone: customerData.phone,
                            address: customerData.address,
                            city: customerData.city,
                            state: customerData.state,
                            zip_code: customerData.zip_code,
                            status: customerData.status,
                            account_type: customerData.account_type,
                            created_at: customerData.created_at,
                            updated_at: customerData.updated_at,
                            tenant_id: customerData.tenant_id,
                            // Set defaults for missing fields
                            ar_balance: (_c = updates.ar_balance) !== null && _c !== void 0 ? _c : 0,
                            property_type: (_d = customerData.property_type) !== null && _d !== void 0 ? _d : '',
                            property_size: (_e = customerData.property_size) !== null && _e !== void 0 ? _e : '',
                            access_instructions: (_f = customerData.access_instructions) !== null && _f !== void 0 ? _f : '',
                            emergency_contact: (_g = customerData.emergency_contact) !== null && _g !== void 0 ? _g : '',
                            preferred_contact_method: (_h = customerData.preferred_contact_method) !== null && _h !== void 0 ? _h : '',
                            billing_address: (_j = customerData.billing_address) !== null && _j !== void 0 ? _j : '',
                            payment_method: (_k = customerData.payment_method) !== null && _k !== void 0 ? _k : '',
                            billing_cycle: (_l = customerData.billing_cycle) !== null && _l !== void 0 ? _l : ''
                        };
                        logger_1.logger.debug('Customer updated in customers table', { customerName: transformedCustomer.name }, 'enhanced-api');
                        return [2 /*return*/, transformedCustomer];
                    }
                    logger_1.logger.error('Customer not found in either table', accountError || customerError, 'enhanced-api');
                    throw accountError || customerError;
                case 4:
                    error_7 = _m.sent();
                    return [2 /*return*/, handleApiError(error_7, 'update customer')];
                case 5: return [2 /*return*/];
            }
        });
    }); },
    // Delete customer
    delete: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, error, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _a.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('accounts')
                            .delete()
                            .eq('id', id)
                            .eq('tenant_id', tenantId)];
                case 2:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    return [3 /*break*/, 4];
                case 3:
                    error_8 = _a.sent();
                    return [2 /*return*/, handleApiError(error_8, 'delete customer')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // Search customers (alias for getAll with search filter)
    search: function (filters) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, exports.customers.getAll(__assign({ search: filters.query }, filters))];
        });
    }); }
};
// ============================================================================
// CUSTOMER PROFILES API
// ============================================================================
exports.customerProfiles = {
    getByCustomerId: function (customerId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, error_9;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('customer_profiles')
                            .select('*')
                            .eq('customer_id', customerId)
                            .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 2:
                    error_9 = _b.sent();
                    return [2 /*return*/, handleApiError(error_9, 'fetch customer profile')];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    // Dashboard Customer Experience APIs
    getExperienceMetrics: function () { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, customers_1, customersError, totalCustomers, activeCustomers, retentionRate, error_10;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('accounts')
                            .select('id, status, created_at')
                            .eq('tenant_id', tenantId)];
                case 2:
                    _a = _b.sent(), customers_1 = _a.data, customersError = _a.error;
                    if (customersError)
                        throw customersError;
                    totalCustomers = (customers_1 === null || customers_1 === void 0 ? void 0 : customers_1.length) || 0;
                    activeCustomers = (customers_1 === null || customers_1 === void 0 ? void 0 : customers_1.filter(function (c) { return c.status === 'active'; }).length) || 0;
                    retentionRate = totalCustomers > 0 ? (activeCustomers / totalCustomers) * 100 : 0;
                    // TODO: Replace with actual data when feedback/survey tables are implemented
                    return [2 /*return*/, {
                            totalCustomers: totalCustomers,
                            satisfactionScore: 4.5, // Placeholder - should come from actual feedback data
                            responseTime: '2.3 hours', // Placeholder - should come from support tickets
                            retentionRate: retentionRate.toFixed(1),
                            complaints: 0, // Placeholder - should come from actual complaint data
                            testimonials: 0 // Placeholder - should come from actual testimonial data
                        }];
                case 3:
                    error_10 = _b.sent();
                    return [2 /*return*/, handleApiError(error_10, 'fetch customer experience metrics')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getRecentFeedback: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                // TODO: Replace with actual feedback table when implemented
                // For now, return empty array until feedback system is built
                return [2 /*return*/, []];
                // Future implementation would look like:
                // const { data, error } = await supabase
                //   .from('customer_feedback')
                //   .select('*')
                //   .eq('tenant_id', tenantId)
                //   .order('created_at', { ascending: false })
                //   .limit(10);
                //
                // if (error) throw error;
                // return data || [];
            }
            catch (error) {
                return [2 /*return*/, handleApiError(error, 'fetch recent customer feedback')];
                return [2 /*return*/, []];
            }
            return [2 /*return*/];
        });
    }); },
    create: function (profileData) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, error_11;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('customer_profiles')
                            .insert(profileData)
                            .select()
                            .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 2:
                    error_11 = _b.sent();
                    return [2 /*return*/, handleApiError(error_11, 'create customer profile')];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    update: function (customerId, updates) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, error_12;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('customer_profiles')
                            .update(updates)
                            .eq('customer_id', customerId)
                            .select()
                            .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 2:
                    error_12 = _b.sent();
                    return [2 /*return*/, handleApiError(error_12, 'update customer profile')];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// ============================================================================
// CUSTOMER CONTACTS API
// ============================================================================
exports.customerContacts = {
    getByCustomerId: function (customerId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, error_13;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('customer_contacts')
                            .select('*')
                            .eq('customer_id', customerId)
                            .order('created_at', { ascending: false })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 2:
                    error_13 = _b.sent();
                    return [2 /*return*/, handleApiError(error_13, 'fetch customer contacts')];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    create: function (contactData) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, error_14;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('customer_contacts')
                            .insert(contactData)
                            .select()
                            .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 2:
                    error_14 = _b.sent();
                    return [2 /*return*/, handleApiError(error_14, 'create customer contact')];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    update: function (id, updates) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, error_15;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('customer_contacts')
                            .update(updates)
                            .eq('id', id)
                            .select()
                            .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 2:
                    error_15 = _b.sent();
                    return [2 /*return*/, handleApiError(error_15, 'update customer contact')];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    delete: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var error, error_16;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('customer_contacts')
                            .delete()
                            .eq('id', id)];
                case 1:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    return [3 /*break*/, 3];
                case 2:
                    error_16 = _a.sent();
                    return [2 /*return*/, handleApiError(error_16, 'delete customer contact')];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// ============================================================================
// WORK ORDERS API
// ============================================================================
exports.workOrders = {
    getAll: function (filters) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, query, _a, data, error, error_17;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    query = supabase_client_1.supabase
                        .from('work_orders')
                        .select("\n          *,\n          accounts (name, email, phone),\n          service_types (*)\n        ")
                        .eq('tenant_id', tenantId);
                    if (filters === null || filters === void 0 ? void 0 : filters.search) {
                        query = query.or("description.ilike.%".concat(filters.search, "%"));
                    }
                    if (filters === null || filters === void 0 ? void 0 : filters.status) {
                        query = query.eq('status', filters.status);
                    }
                    return [4 /*yield*/, query.order('created_at', { ascending: false })];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 3:
                    error_17 = _b.sent();
                    return [2 /*return*/, handleApiError(error_17, 'fetch work orders')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getByCustomerId: function (customerId) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_18;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('work_orders')
                            .select("\n          *,\n          accounts (*),\n          service_types (*),\n          jobs (*)\n        ")
                            .eq('tenant_id', tenantId)
                            .eq('customer_id', customerId)
                            .order('created_at', { ascending: false })];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 3:
                    error_18 = _b.sent();
                    return [2 /*return*/, handleApiError(error_18, 'fetch work orders by customer')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getById: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_19;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('work_orders')
                            .select("\n          *,\n          accounts (*),\n          service_types (*),\n          jobs (*)\n        ")
                            .eq('id', id)
                            .eq('tenant_id', tenantId)
                            .single()];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 3:
                    error_19 = _b.sent();
                    return [2 /*return*/, handleApiError(error_19, 'fetch work order')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    create: function (workOrderData) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_20;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('work_orders')
                            .insert(__assign(__assign({}, workOrderData), { tenant_id: tenantId }))
                            .select()
                            .single()];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 3:
                    error_20 = _b.sent();
                    return [2 /*return*/, handleApiError(error_20, 'create work order')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    update: function (id, updates) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_21;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('work_orders')
                            .update(updates)
                            .eq('id', id)
                            .eq('tenant_id', tenantId)
                            .select()
                            .single()];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 3:
                    error_21 = _b.sent();
                    return [2 /*return*/, handleApiError(error_21, 'update work order')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    delete: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, error, error_22;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _a.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('work_orders')
                            .delete()
                            .eq('id', id)
                            .eq('tenant_id', tenantId)];
                case 2:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    return [3 /*break*/, 4];
                case 3:
                    error_22 = _a.sent();
                    return [2 /*return*/, handleApiError(error_22, 'delete work order')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // List work orders (alias for getAll with pagination)
    list: function (filters) { return __awaiter(void 0, void 0, void 0, function () {
        var data, page, limit, total, totalPages, startIndex, endIndex, paginatedData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.workOrders.getAll(filters)];
                case 1:
                    data = _a.sent();
                    page = (filters === null || filters === void 0 ? void 0 : filters.page) || 1;
                    limit = (filters === null || filters === void 0 ? void 0 : filters.limit) || 20;
                    total = data.length;
                    totalPages = Math.ceil(total / limit);
                    startIndex = (page - 1) * limit;
                    endIndex = startIndex + limit;
                    paginatedData = data.slice(startIndex, endIndex);
                    return [2 /*return*/, {
                            data: paginatedData,
                            pagination: {
                                page: page,
                                limit: limit,
                                total: total,
                                totalPages: totalPages
                            }
                        }];
            }
        });
    }); }
};
// ============================================================================
// JOBS API
// ============================================================================
exports.jobs = {
    getAll: function (filters) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, query, _a, data, error, error_23;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    query = supabase_client_1.supabase
                        .from('jobs')
                        .select("\n          *,\n          accounts (name, email, phone),\n          work_orders (*),\n          technicians (first_name, last_name, email)\n        ")
                        .eq('tenant_id', tenantId);
                    if (filters === null || filters === void 0 ? void 0 : filters.search) {
                        query = query.or("description.ilike.%".concat(filters.search, "%"));
                    }
                    if (filters === null || filters === void 0 ? void 0 : filters.status) {
                        query = query.eq('status', filters.status);
                    }
                    if (filters === null || filters === void 0 ? void 0 : filters.date) {
                        query = query.eq('scheduled_date', filters.date);
                    }
                    return [4 /*yield*/, query.order('scheduled_date', { ascending: false })];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 3:
                    error_23 = _b.sent();
                    return [2 /*return*/, handleApiError(error_23, 'fetch jobs')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getByDateRange: function (startDate, endDate) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, testError, _a, data, error, error_24;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _c.sent();
                    logger_1.logger.debug('Jobs API Debug', { tenantId: tenantId, startDate: startDate, endDate: endDate }, 'enhanced-api');
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('jobs')
                            .select('id')
                            .limit(1)];
                case 2:
                    testError = (_c.sent()).error;
                    if (testError) {
                        logger_1.logger.error('Jobs table test failed', testError, 'enhanced-api');
                        // If jobs table doesn't exist, return empty array instead of throwing error
                        if (testError.code === 'PGRST116' || ((_b = testError.message) === null || _b === void 0 ? void 0 : _b.includes('relation "jobs" does not exist'))) {
                            logger_1.logger.warn('Jobs table does not exist, returning empty array', {}, 'enhanced-api');
                            return [2 /*return*/, []];
                        }
                        throw testError;
                    }
                    logger_1.logger.debug('Jobs table exists, proceeding with full query', {}, 'enhanced-api');
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('jobs')
                            .select("\n          *,\n          accounts (name, email, phone),\n          work_orders (*),\n          technicians (first_name, last_name, email)\n        ")
                            .eq('tenant_id', tenantId)
                            .gte('scheduled_date', startDate)
                            .lte('scheduled_date', endDate)
                            .order('scheduled_date', { ascending: true })];
                case 3:
                    _a = _c.sent(), data = _a.data, error = _a.error;
                    logger_1.logger.debug('Supabase Query Result', { hasData: !!data, hasError: !!error, dataCount: (data === null || data === void 0 ? void 0 : data.length) || 0 }, 'enhanced-api');
                    if (error) {
                        logger_1.logger.error('Supabase Error Details', error, 'enhanced-api');
                        throw error;
                    }
                    logger_1.logger.debug('Jobs fetched successfully', { jobCount: (data === null || data === void 0 ? void 0 : data.length) || 0 }, 'enhanced-api');
                    return [2 /*return*/, data || []];
                case 4:
                    error_24 = _c.sent();
                    logger_1.logger.error('Jobs API Error Details', error_24, 'enhanced-api');
                    // Instead of throwing error, return empty array to prevent UI crashes
                    logger_1.logger.warn('Returning empty array due to error', {}, 'enhanced-api');
                    return [2 /*return*/, []];
                case 5: return [2 /*return*/];
            }
        });
    }); },
    getByCustomerId: function (customerId) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_25;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('jobs')
                            .select("\n          *,\n          accounts (name, email, phone),\n          work_orders (*),\n          technicians (first_name, last_name, email)\n        ")
                            .eq('tenant_id', tenantId)
                            .eq('account_id', customerId)
                            .order('scheduled_date', { ascending: false })];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 3:
                    error_25 = _b.sent();
                    return [2 /*return*/, handleApiError(error_25, 'fetch jobs by customer')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getById: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_26;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('jobs')
                            .select("\n          *,\n          accounts (*),\n          work_orders (*),\n          technicians (*)\n        ")
                            .eq('id', id)
                            .eq('tenant_id', tenantId)
                            .single()];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 3:
                    error_26 = _b.sent();
                    return [2 /*return*/, handleApiError(error_26, 'fetch job')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    create: function (jobData) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_27;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('jobs')
                            .insert(__assign(__assign({}, jobData), { tenant_id: tenantId }))
                            .select()
                            .single()];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 3:
                    error_27 = _b.sent();
                    return [2 /*return*/, handleApiError(error_27, 'create job')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    update: function (id, updates) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_28;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('jobs')
                            .update(updates)
                            .eq('id', id)
                            .eq('tenant_id', tenantId)
                            .select()
                            .single()];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 3:
                    error_28 = _b.sent();
                    return [2 /*return*/, handleApiError(error_28, 'update job')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    delete: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, error, error_29;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _a.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('jobs')
                            .delete()
                            .eq('id', id)
                            .eq('tenant_id', tenantId)];
                case 2:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    return [3 /*break*/, 4];
                case 3:
                    error_29 = _a.sent();
                    return [2 /*return*/, handleApiError(error_29, 'delete job')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // List jobs (alias for getAll with date filter)
    list: function (filters) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (filters === null || filters === void 0 ? void 0 : filters.scheduled_date) {
                return [2 /*return*/, exports.jobs.getByDateRange(filters.scheduled_date, filters.scheduled_date)];
            }
            return [2 /*return*/, exports.jobs.getAll(filters)];
        });
    }); },
    /**
     * Check for scheduling conflicts before assigning a job
     * @param technicianId - Technician ID to check
     * @param scheduledDate - Date of the job (ISO string)
     * @param startTime - Start time (HH:mm format)
     * @param endTime - End time (HH:mm format)
     * @param excludeJobIds - Job IDs to exclude from conflict check (for rescheduling)
     * @returns Conflict detection result
     */
    checkConflicts: function (technicianId, scheduledDate, startTime, endTime, excludeJobIds) { return __awaiter(void 0, void 0, void 0, function () {
        var token, error_30;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, getAuthToken()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)('/api/v1/jobs/check-conflicts', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(token),
                            },
                            body: JSON.stringify({
                                technician_id: technicianId,
                                scheduled_date: scheduledDate,
                                scheduled_start_time: startTime,
                                scheduled_end_time: endTime,
                                exclude_job_ids: excludeJobIds || [],
                            }),
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_30 = _a.sent();
                    return [2 /*return*/, handleApiError(error_30, 'check job conflicts')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // Recurring jobs
    recurring: {
        /**
         * Create a recurring job template
         */
        createTemplate: function (templateData) { return __awaiter(void 0, void 0, void 0, function () {
            var token, error_31;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)('/api/v1/jobs/recurring', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': "Bearer ".concat(token),
                                },
                                body: JSON.stringify(templateData),
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_31 = _a.sent();
                        return [2 /*return*/, handleApiError(error_31, 'create recurring job template')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        /**
         * Get all recurring job templates
         */
        list: function () {
            var args_1 = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args_1[_i] = arguments[_i];
            }
            return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (activeOnly) {
                var token, url, data, error_32;
                if (activeOnly === void 0) { activeOnly = false; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, getAuthToken()];
                        case 1:
                            token = _a.sent();
                            url = "/api/v1/jobs/recurring".concat(activeOnly ? '?active_only=true' : '');
                            return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)(url, {
                                    headers: {
                                        'Authorization': "Bearer ".concat(token),
                                        'Content-Type': 'application/json',
                                    },
                                })];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, data || []];
                        case 3:
                            error_32 = _a.sent();
                            return [2 /*return*/, handleApiError(error_32, 'list recurring job templates')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        /**
         * Get a specific recurring job template
         */
        get: function (templateId) { return __awaiter(void 0, void 0, void 0, function () {
            var token, error_33;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("/api/v1/jobs/recurring/".concat(templateId), {
                                headers: {
                                    'Authorization': "Bearer ".concat(token),
                                    'Content-Type': 'application/json',
                                },
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_33 = _a.sent();
                        return [2 /*return*/, handleApiError(error_33, 'get recurring job template')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        /**
         * Update a recurring job template
         */
        update: function (templateId, updates) { return __awaiter(void 0, void 0, void 0, function () {
            var token, error_34;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("/api/v1/jobs/recurring/".concat(templateId), {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': "Bearer ".concat(token),
                                },
                                body: JSON.stringify(updates),
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_34 = _a.sent();
                        return [2 /*return*/, handleApiError(error_34, 'update recurring job template')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        /**
         * Delete a recurring job template
         */
        delete: function (templateId_1) {
            var args_1 = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args_1[_i - 1] = arguments[_i];
            }
            return __awaiter(void 0, __spreadArray([templateId_1], args_1, true), void 0, function (templateId, deleteAllJobs) {
                var token, url, error_35;
                if (deleteAllJobs === void 0) { deleteAllJobs = false; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, getAuthToken()];
                        case 1:
                            token = _a.sent();
                            url = "/api/v1/jobs/recurring/".concat(templateId).concat(deleteAllJobs ? '?delete_all_jobs=true' : '');
                            return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)(url, {
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': "Bearer ".concat(token),
                                        'Content-Type': 'application/json',
                                    },
                                })];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_35 = _a.sent();
                            return [2 /*return*/, handleApiError(error_35, 'delete recurring job template')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        /**
         * Generate jobs from a recurring template
         */
        generate: function (templateId, generateUntil) { return __awaiter(void 0, void 0, void 0, function () {
            var token, error_36;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("/api/v1/jobs/recurring/".concat(templateId, "/generate"), {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': "Bearer ".concat(token),
                                },
                                body: JSON.stringify({
                                    generate_until: generateUntil,
                                    skip_existing: true,
                                }),
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_36 = _a.sent();
                        return [2 /*return*/, handleApiError(error_36, 'generate recurring jobs')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        /**
         * Skip a single occurrence of a recurring job
         */
        skipOccurrence: function (jobId) { return __awaiter(void 0, void 0, void 0, function () {
            var token, error_37;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("/api/v1/jobs/".concat(jobId, "/skip-recurrence"), {
                                method: 'PUT',
                                headers: {
                                    'Authorization': "Bearer ".concat(token),
                                    'Content-Type': 'application/json',
                                },
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_37 = _a.sent();
                        return [2 /*return*/, handleApiError(error_37, 'skip recurring job occurrence')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
    },
};
// ============================================================================
// LOCATIONS API
// ============================================================================
exports.locations = {
    getByCustomerId: function (customerId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, error_38;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('locations')
                            .select('*')
                            .eq('customer_id', customerId)
                            .order('created_at', { ascending: false })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 2:
                    error_38 = _b.sent();
                    return [2 /*return*/, handleApiError(error_38, 'fetch locations')];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    create: function (locationData) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, error_39;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('locations')
                            .insert(locationData)
                            .select()
                            .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 2:
                    error_39 = _b.sent();
                    return [2 /*return*/, handleApiError(error_39, 'create location')];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    update: function (id, updates) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, error_40;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('locations')
                            .update(updates)
                            .eq('id', id)
                            .select()
                            .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 2:
                    error_40 = _b.sent();
                    return [2 /*return*/, handleApiError(error_40, 'update location')];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    delete: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var error, error_41;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('locations')
                            .delete()
                            .eq('id', id)];
                case 1:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    return [3 /*break*/, 3];
                case 2:
                    error_41 = _a.sent();
                    return [2 /*return*/, handleApiError(error_41, 'delete location')];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// ============================================================================
// SERVICE TYPES API
// ============================================================================
exports.serviceTypes = {
    getAll: function () { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_42;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_types')
                            .select("\n          *,\n          service_categories (*)\n        ")
                            .eq('tenant_id', tenantId)
                            .order('service_name')];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 3:
                    error_42 = _b.sent();
                    return [2 /*return*/, handleApiError(error_42, 'fetch service types')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getById: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_43;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_types')
                            .select("\n          *,\n          service_categories (*)\n        ")
                            .eq('id', id)
                            .eq('tenant_id', tenantId)
                            .single()];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 3:
                    error_43 = _b.sent();
                    return [2 /*return*/, handleApiError(error_43, 'fetch service type')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    create: function (serviceTypeData) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_44;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_types')
                            .insert(__assign(__assign({}, serviceTypeData), { tenant_id: tenantId }))
                            .select()
                            .single()];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 3:
                    error_44 = _b.sent();
                    return [2 /*return*/, handleApiError(error_44, 'create service type')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    update: function (id, updates) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_45;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_types')
                            .update(updates)
                            .eq('id', id)
                            .eq('tenant_id', tenantId)
                            .select()
                            .single()];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 3:
                    error_45 = _b.sent();
                    return [2 /*return*/, handleApiError(error_45, 'update service type')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    delete: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, error, error_46;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _a.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_types')
                            .delete()
                            .eq('id', id)
                            .eq('tenant_id', tenantId)];
                case 2:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    return [3 /*break*/, 4];
                case 3:
                    error_46 = _a.sent();
                    return [2 /*return*/, handleApiError(error_46, 'delete service type')];
                case 4: return [2 /*return*/];
            }
        });
    }); }
};
// ============================================================================
// SERVICE CATEGORIES API
// ============================================================================
exports.serviceCategories = {
    getAll: function () { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_47;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_categories')
                            .select('*')
                            .eq('tenant_id', tenantId)
                            .order('category_name')];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 3:
                    error_47 = _b.sent();
                    return [2 /*return*/, handleApiError(error_47, 'fetch service categories')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    create: function (categoryData) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_48;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_categories')
                            .insert(__assign(__assign({}, categoryData), { tenant_id: tenantId }))
                            .select()
                            .single()];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 3:
                    error_48 = _b.sent();
                    return [2 /*return*/, handleApiError(error_48, 'create service category')];
                case 4: return [2 /*return*/];
            }
        });
    }); }
};
// ============================================================================
// CUSTOMER SEGMENTS API
// ============================================================================
exports.customerSegments = {
    getAll: function () { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_49;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('customer_segments')
                            .select('*')
                            .eq('tenant_id', tenantId)
                            .order('segment_name')];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 3:
                    error_49 = _b.sent();
                    return [2 /*return*/, handleApiError(error_49, 'fetch customer segments')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    create: function (segmentData) { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_50;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('customer_segments')
                            .insert(__assign(__assign({}, segmentData), { tenant_id: tenantId }))
                            .select()
                            .single()];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 3:
                    error_50 = _b.sent();
                    return [2 /*return*/, handleApiError(error_50, 'create customer segment')];
                case 4: return [2 /*return*/];
            }
        });
    }); }
};
// ============================================================================
// PRICING API
// ============================================================================
exports.pricing = {
    getTiers: function () { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_51;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('pricing_tiers')
                            .select('*')
                            .eq('tenant_id', tenantId)
                            .order('tier_name')];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 3:
                    error_51 = _b.sent();
                    return [2 /*return*/, handleApiError(error_51, 'fetch pricing tiers')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getServicePricing: function () { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_52;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_pricing')
                            .select("\n          *,\n          service_types (*),\n          pricing_tiers (*)\n        ")
                            .eq('tenant_id', tenantId)];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 3:
                    error_52 = _b.sent();
                    return [2 /*return*/, handleApiError(error_52, 'fetch service pricing')];
                case 4: return [2 /*return*/];
            }
        });
    }); }
};
// ============================================================================
// PAYMENT METHODS API
// ============================================================================
exports.paymentMethods = {
    getByCustomerId: function (customerId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, error_53;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('payment_methods')
                            .select('*')
                            .eq('customer_id', customerId)
                            .order('created_at', { ascending: false })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 2:
                    error_53 = _b.sent();
                    return [2 /*return*/, handleApiError(error_53, 'fetch payment methods')];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    create: function (paymentMethodData) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, error_54;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('payment_methods')
                            .insert(paymentMethodData)
                            .select()
                            .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 2:
                    error_54 = _b.sent();
                    return [2 /*return*/, handleApiError(error_54, 'create payment method')];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    delete: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var error, error_55;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('payment_methods')
                            .delete()
                            .eq('id', id)];
                case 1:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    return [3 /*break*/, 3];
                case 2:
                    error_55 = _a.sent();
                    return [2 /*return*/, handleApiError(error_55, 'delete payment method')];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
// ============================================================================
// COMMUNICATION API
// ============================================================================
exports.communication = {
    getTemplates: function () { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_56;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('communication_templates')
                            .select('*')
                            .eq('tenant_id', tenantId)
                            .order('template_name')];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 3:
                    error_56 = _b.sent();
                    return [2 /*return*/, handleApiError(error_56, 'fetch communication templates')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getAutomatedCommunications: function () { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_57;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('automated_communications')
                            .select("\n          *,\n          communication_templates (*)\n        ")
                            .eq('tenant_id', tenantId)
                            .order('created_at', { ascending: false })];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 3:
                    error_57 = _b.sent();
                    return [2 /*return*/, handleApiError(error_57, 'fetch automated communications')];
                case 4: return [2 /*return*/];
            }
        });
    }); }
};
// ============================================================================
// COMPLIANCE API
// ============================================================================
exports.compliance = {
    getRequirements: function () { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_58;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('compliance_requirements')
                            .select('*')
                            .eq('tenant_id', tenantId)
                            .order('name')];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 3:
                    error_58 = _b.sent();
                    return [2 /*return*/, handleApiError(error_58, 'fetch compliance requirements')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getRecords: function () { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_59;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('compliance_records')
                            .select("\n          *,\n          compliance_requirements (*),\n          accounts (name)\n        ")
                            .eq('tenant_id', tenantId)
                            .order('created_at', { ascending: false })];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 3:
                    error_59 = _b.sent();
                    return [2 /*return*/, handleApiError(error_59, 'fetch compliance records')];
                case 4: return [2 /*return*/];
            }
        });
    }); }
};
// ============================================================================
// SERVICE AREAS API
// ============================================================================
exports.serviceAreas = {
    getAll: function () { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_60;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_areas')
                            .select('*')
                            .eq('tenant_id', tenantId)
                            .order('area_name')];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 3:
                    error_60 = _b.sent();
                    return [2 /*return*/, handleApiError(error_60, 'fetch service areas')];
                case 4: return [2 /*return*/];
            }
        });
    }); }
};
// ============================================================================
// TECHNICIAN SKILLS API
// ============================================================================
exports.technicianSkills = {
    getAll: function () { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_61;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('technician_skills')
                            .select("\n          *,\n          service_types (*),\n          technicians (first_name, last_name)\n        ")
                            .eq('tenant_id', tenantId)];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 3:
                    error_61 = _b.sent();
                    return [2 /*return*/, handleApiError(error_61, 'fetch technician skills')];
                case 4: return [2 /*return*/];
            }
        });
    }); }
};
// ============================================================================
// ANALYTICS API
// ============================================================================
exports.analytics = {
    getCustomerAnalytics: function () { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_62;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('customer_analytics')
                            .select('*')
                            .eq('tenant_id', tenantId)
                            .order('created_at', { ascending: false })];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 3:
                    error_62 = _b.sent();
                    return [2 /*return*/, handleApiError(error_62, 'fetch customer analytics')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getServiceAnalytics: function () { return __awaiter(void 0, void 0, void 0, function () {
        var tenantId, _a, data, error, error_63;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    tenantId = _b.sent();
                    return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_analytics')
                            .select('*')
                            .eq('tenant_id', tenantId)
                            .order('created_at', { ascending: false })];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 3:
                    error_63 = _b.sent();
                    return [2 /*return*/, handleApiError(error_63, 'fetch service analytics')];
                case 4: return [2 /*return*/];
            }
        });
    }); }
};
// ============================================================================
// AUTH API
// ============================================================================
exports.authApi = {
    signIn: function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
        var response, errorData, data, error_64;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch('http://localhost:3001/api/v1/auth/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email: email, password: password }),
                        })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    errorData = _a.sent();
                    logger_1.logger.error('Login request failed', { status: response.status, errorData: errorData }, 'enhanced-api');
                    throw new Error(errorData.message || 'Login failed');
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 5:
                    error_64 = _a.sent();
                    logger_1.logger.error('Error during signIn', error_64, 'enhanced-api');
                    throw error_64;
                case 6: return [2 /*return*/];
            }
        });
    }); },
    signUp: function (email, password, metadata) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, supabase_client_1.supabase.auth.signUp({
                        email: email,
                        password: password,
                        options: {
                            data: metadata !== null && metadata !== void 0 ? metadata : {}
                        }
                    })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
            }
        });
    }); },
    signOut: function () { return __awaiter(void 0, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabase_client_1.supabase.auth.signOut()];
                case 1:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    return [2 /*return*/];
            }
        });
    }); },
    getCurrentUser: function () { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData) {
                        throw new Error('No authentication token found');
                    }
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token) {
                        throw new Error('No authentication token found');
                    }
                    return [4 /*yield*/, fetch('http://localhost:3001/api/v1/auth/me', {
                            method: 'GET',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Failed to get current user');
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.user];
            }
        });
    }); },
    resetPassword: function (email) { return __awaiter(void 0, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabase_client_1.supabase.auth.resetPasswordForEmail(email)];
                case 1:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    return [2 /*return*/];
            }
        });
    }); }
};
// ============================================================================
// COMPANY SETTINGS API
// ============================================================================
exports.company = {
    // Get company settings
    getSettings: function () { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, response, error_65;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v1/company/settings", {
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch company settings: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_65 = _a.sent();
                    logger_1.logger.error('Failed to fetch company settings', error_65, 'enhanced-api');
                    throw error_65;
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // Upload company logo with type
    uploadLogo: function (file_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([file_1], args_1, true), void 0, function (file, logoType) {
            var authData, token, parsed, formData, response, error_66, errorText, error_67;
            if (logoType === void 0) { logoType = 'header'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        authData = localStorage.getItem('verofield_auth');
                        if (!authData)
                            throw new Error('User not authenticated');
                        token = void 0;
                        try {
                            parsed = JSON.parse(authData);
                            token = parsed.token || parsed;
                        }
                        catch (_b) {
                            token = authData;
                        }
                        if (!token)
                            throw new Error('No access token found');
                        logger_1.logger.debug("Uploading ".concat(logoType, " logo file"), { fileName: file.name, fileSize: file.size }, 'enhanced-api');
                        formData = new FormData();
                        formData.append('logo', file);
                        formData.append('logoType', logoType);
                        response = void 0;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetch("http://localhost:3001/api/v1/company/logo", {
                                method: 'POST',
                                headers: {
                                    'Authorization': "Bearer ".concat(token),
                                },
                                body: formData,
                            })];
                    case 2:
                        response = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_66 = _a.sent();
                        logger_1.logger.error('Network error uploading logo', error_66, 'enhanced-api');
                        throw error_66;
                    case 4:
                        if (!!response.ok) return [3 /*break*/, 6];
                        return [4 /*yield*/, response.text()];
                    case 5:
                        errorText = _a.sent();
                        logger_1.logger.error('Logo upload failed', new Error("".concat(response.status, " ").concat(response.statusText, ": ").concat(errorText)), 'enhanced-api');
                        throw new Error("Failed to upload logo: ".concat(response.statusText));
                    case 6: return [4 /*yield*/, response.json()];
                    case 7: return [2 /*return*/, _a.sent()];
                    case 8:
                        error_67 = _a.sent();
                        logger_1.logger.error('Failed to upload logo', error_67, 'enhanced-api');
                        throw error_67;
                    case 9: return [2 /*return*/];
                }
            });
        });
    },
    // Delete company logo
    deleteLogo: function (logoType) { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, response, errorText, result, error_68;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    logger_1.logger.debug("Deleting ".concat(logoType, " logo"), {}, 'enhanced-api');
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v1/company/logo/".concat(logoType), {
                            method: 'DELETE',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    errorText = _a.sent();
                    logger_1.logger.error('Logo deletion failed', new Error("".concat(response.status, " ").concat(response.statusText, ": ").concat(errorText)), 'enhanced-api');
                    throw new Error("Failed to delete logo: ".concat(response.statusText));
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    result = _a.sent();
                    logger_1.logger.debug('Delete response received', { success: !!result }, 'enhanced-api');
                    return [2 /*return*/, result];
                case 5:
                    error_68 = _a.sent();
                    logger_1.logger.error('Failed to delete logo', error_68, 'enhanced-api');
                    throw error_68;
                case 6: return [2 /*return*/];
            }
        });
    }); },
    // Update company settings
    updateSettings: function (settings) { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, response, errorText, error_69;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    logger_1.logger.debug('Sending company settings data', { hasSettings: !!settings }, 'enhanced-api');
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v1/company/settings", {
                            method: 'PUT',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(settings),
                        })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    errorText = _a.sent();
                    logger_1.logger.error('Server response error', new Error("".concat(response.status, " ").concat(response.statusText, ": ").concat(errorText)), 'enhanced-api');
                    throw new Error("Failed to update company settings: ".concat(response.statusText, " - ").concat(errorText));
                case 3: return [4 /*yield*/, response.json()];
                case 4: return [2 /*return*/, _a.sent()];
                case 5:
                    error_69 = _a.sent();
                    logger_1.logger.error('Failed to update company settings', error_69, 'enhanced-api');
                    throw error_69;
                case 6: return [2 /*return*/];
            }
        });
    }); },
};
// BILLING API
// ============================================================================
exports.billing = {
    // Invoice Management
    getInvoices: function (accountId, status) { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, params, response, error_70, error_71;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    params = new URLSearchParams();
                    if (accountId)
                        params.append('accountId', accountId);
                    if (status)
                        params.append('status', status);
                    response = void 0;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v1/billing/invoices?".concat(params.toString()), {
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 2:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_70 = _a.sent();
                    logger_1.logger.error('Network error fetching invoices', error_70, 'enhanced-api');
                    throw error_70;
                case 4:
                    if (!response.ok) {
                        throw new Error("Failed to fetch invoices: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 5: return [2 /*return*/, _a.sent()];
                case 6:
                    error_71 = _a.sent();
                    logger_1.logger.error('Failed to fetch invoices', error_71, 'enhanced-api');
                    return [2 /*return*/, handleApiError(error_71, 'fetch invoices')];
                case 7: return [2 /*return*/];
            }
        });
    }); },
    getInvoiceById: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, response, error_72;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v1/billing/invoices/".concat(id), {
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        if (response.status === 404)
                            return [2 /*return*/, null];
                        throw new Error("Failed to fetch invoice: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_72 = _a.sent();
                    return [2 /*return*/, handleApiError(error_72, 'fetch invoice')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    createInvoice: function (invoiceData) { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, response, errorText, errorData, error_73;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    return [4 /*yield*/, fetch('http://localhost:3001/api/v1/billing/invoices', {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(invoiceData),
                        })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    errorText = _a.sent();
                    logger_1.logger.error('Backend error response', new Error(errorText), 'enhanced-api');
                    try {
                        errorData = JSON.parse(errorText);
                        logger_1.logger.error('Parsed error data', errorData, 'enhanced-api');
                        throw new Error("Failed to create invoice: ".concat(errorData.message || response.statusText));
                    }
                    catch (_c) {
                        throw new Error("Failed to create invoice: ".concat(response.statusText, " - ").concat(errorText));
                    }
                    _a.label = 3;
                case 3: return [4 /*yield*/, response.json()];
                case 4: return [2 /*return*/, _a.sent()];
                case 5:
                    error_73 = _a.sent();
                    return [2 /*return*/, handleApiError(error_73, 'create invoice')];
                case 6: return [2 /*return*/];
            }
        });
    }); },
    updateInvoice: function (id, updates) { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, response, error_74;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v1/billing/invoices/".concat(id), {
                            method: 'PUT',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(updates),
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to update invoice: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_74 = _a.sent();
                    return [2 /*return*/, handleApiError(error_74, 'update invoice')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    deleteInvoice: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, response, error_75;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v1/billing/invoices/".concat(id), {
                            method: 'DELETE',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to delete invoice: ".concat(response.statusText));
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_75 = _a.sent();
                    return [2 /*return*/, handleApiError(error_75, 'delete invoice')];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    // Payment Management
    getPayments: function (invoiceId) { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, params, response, error_76;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    params = new URLSearchParams();
                    if (invoiceId)
                        params.append('invoiceId', invoiceId);
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v1/billing/payments?".concat(params.toString()), {
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch payments: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_76 = _a.sent();
                    return [2 /*return*/, handleApiError(error_76, 'fetch payments')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    processPayment: function (invoiceId, paymentData) { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, response, error_77;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v1/billing/invoices/".concat(invoiceId, "/pay"), {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(paymentData),
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to process payment: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_77 = _a.sent();
                    return [2 /*return*/, handleApiError(error_77, 'process payment')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // Payment Method Management
    getPaymentMethods: function (accountId) { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, params, response, error_78;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    params = new URLSearchParams();
                    if (accountId)
                        params.append('accountId', accountId);
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v1/billing/payment-methods?".concat(params.toString()), {
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch payment methods: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_78 = _a.sent();
                    return [2 /*return*/, handleApiError(error_78, 'fetch payment methods')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    createPaymentMethod: function (paymentMethodData) { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, response, error_79;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    return [4 /*yield*/, fetch('http://localhost:3001/api/v1/billing/payment-methods', {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(paymentMethodData),
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to create payment method: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_79 = _a.sent();
                    return [2 /*return*/, handleApiError(error_79, 'create payment method')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    deletePaymentMethod: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, response, error_80;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v1/billing/payment-methods/".concat(id), {
                            method: 'DELETE',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to delete payment method: ".concat(response.statusText));
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_80 = _a.sent();
                    return [2 /*return*/, handleApiError(error_80, 'delete payment method')];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    // Billing Analytics
    getBillingAnalytics: function () { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, response, error_81;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    return [4 /*yield*/, fetch('http://localhost:3001/api/v1/billing/analytics/overview', {
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch billing analytics: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_81 = _a.sent();
                    return [2 /*return*/, handleApiError(error_81, 'fetch billing analytics')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getRevenueAnalytics: function (startDate, endDate) { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, params, response, error_82, error_83;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    params = new URLSearchParams();
                    if (startDate)
                        params.append('startDate', startDate);
                    if (endDate)
                        params.append('endDate', endDate);
                    response = void 0;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v1/billing/analytics/revenue?".concat(params.toString()), {
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 2:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_82 = _a.sent();
                    logger_1.logger.error('Network error fetching revenue analytics', error_82, 'enhanced-api');
                    throw error_82;
                case 4:
                    if (!response.ok) {
                        throw new Error("Failed to fetch revenue analytics: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 5: return [2 /*return*/, _a.sent()];
                case 6:
                    error_83 = _a.sent();
                    logger_1.logger.error('Failed to fetch revenue analytics', error_83, 'enhanced-api');
                    return [2 /*return*/, handleApiError(error_83, 'fetch revenue analytics')];
                case 7: return [2 /*return*/];
            }
        });
    }); },
    // Stripe Payment Integration
    createStripePaymentIntent: function (invoiceId) { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, response, error_84;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v1/billing/invoices/".concat(invoiceId, "/stripe-payment-intent"), {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to create payment intent: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_84 = _a.sent();
                    return [2 /*return*/, handleApiError(error_84, 'create Stripe payment intent')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getStripePaymentStatus: function (paymentIntentId) { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, response, error_85;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v1/billing/stripe/payment-status/".concat(paymentIntentId), {
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to get payment status: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_85 = _a.sent();
                    return [2 /*return*/, handleApiError(error_85, 'get Stripe payment status')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // AR Management
    getARSummary: function () { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, response, error_86;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v1/billing/ar-summary", {
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to get AR summary: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_86 = _a.sent();
                    return [2 /*return*/, handleApiError(error_86, 'get AR summary')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    retryFailedPayment: function (invoiceId) { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, response, errorText, error_87;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v1/billing/invoices/".concat(invoiceId, "/retry-payment"), {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    errorText = _a.sent();
                    throw new Error("Failed to retry payment: ".concat(errorText || response.statusText));
                case 3: return [4 /*yield*/, response.json()];
                case 4: return [2 /*return*/, _a.sent()];
                case 5:
                    error_87 = _a.sent();
                    return [2 /*return*/, handleApiError(error_87, 'retry failed payment')];
                case 6: return [2 /*return*/];
            }
        });
    }); },
    getPaymentAnalytics: function (startDate, endDate) { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, params, url, response, error_88, error_89;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    params = new URLSearchParams();
                    if (startDate)
                        params.append('startDate', startDate);
                    if (endDate)
                        params.append('endDate', endDate);
                    url = "http://localhost:3001/api/v1/billing/analytics/payments".concat(params.toString() ? "?".concat(params.toString()) : '');
                    response = void 0;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch(url, {
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 2:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_88 = _a.sent();
                    logger_1.logger.error('Network error getting payment analytics', error_88, 'enhanced-api');
                    throw error_88;
                case 4:
                    if (!response.ok) {
                        throw new Error("Failed to get payment analytics: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 5: return [2 /*return*/, _a.sent()];
                case 6:
                    error_89 = _a.sent();
                    logger_1.logger.error('Failed to get payment analytics', error_89, 'enhanced-api');
                    return [2 /*return*/, handleApiError(error_89, 'get payment analytics')];
                case 7: return [2 /*return*/];
            }
        });
    }); },
    createRecurringPayment: function (invoiceId, data) { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, response, errorText, error_90;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v1/billing/invoices/".concat(invoiceId, "/recurring-payment"), {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data),
                        })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    errorText = _a.sent();
                    throw new Error("Failed to create recurring payment: ".concat(errorText || response.statusText));
                case 3: return [4 /*yield*/, response.json()];
                case 4: return [2 /*return*/, _a.sent()];
                case 5:
                    error_90 = _a.sent();
                    return [2 /*return*/, handleApiError(error_90, 'create recurring payment')];
                case 6: return [2 /*return*/];
            }
        });
    }); },
    getRecurringPayment: function (subscriptionId) { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, response, error_91;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v1/billing/recurring-payments/".concat(subscriptionId), {
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to get recurring payment: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_91 = _a.sent();
                    return [2 /*return*/, handleApiError(error_91, 'get recurring payment')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    cancelRecurringPayment: function (subscriptionId_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([subscriptionId_1], args_1, true), void 0, function (subscriptionId, immediately) {
            var authData, token, parsed, response, errorText, error_92;
            if (immediately === void 0) { immediately = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        authData = localStorage.getItem('verofield_auth');
                        if (!authData)
                            throw new Error('User not authenticated');
                        token = void 0;
                        try {
                            parsed = JSON.parse(authData);
                            token = parsed.token || parsed;
                        }
                        catch (_b) {
                            token = authData;
                        }
                        if (!token)
                            throw new Error('No access token found');
                        return [4 /*yield*/, fetch("http://localhost:3001/api/v1/billing/recurring-payments/".concat(subscriptionId, "/cancel"), {
                                method: 'POST',
                                headers: {
                                    'Authorization': "Bearer ".concat(token),
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ immediately: immediately }),
                            })];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.text()];
                    case 2:
                        errorText = _a.sent();
                        throw new Error("Failed to cancel recurring payment: ".concat(errorText || response.statusText));
                    case 3: return [4 /*yield*/, response.json()];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5:
                        error_92 = _a.sent();
                        return [2 /*return*/, handleApiError(error_92, 'cancel recurring payment')];
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    getPaymentRetryHistory: function (invoiceId) { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, response, error_93;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v1/billing/invoices/".concat(invoiceId, "/payment-retry-history"), {
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to get payment retry history: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_93 = _a.sent();
                    return [2 /*return*/, handleApiError(error_93, 'get payment retry history')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getOverdueInvoices: function () { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, response, error_94;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v1/billing/overdue-invoices", {
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to get overdue invoices: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_94 = _a.sent();
                    return [2 /*return*/, handleApiError(error_94, 'get overdue invoices')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getPaymentTracking: function (startDate, endDate) { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, params, response, error_95, error_96;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    params = new URLSearchParams();
                    if (startDate)
                        params.append('startDate', startDate);
                    if (endDate)
                        params.append('endDate', endDate);
                    response = void 0;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v1/billing/payment-tracking?".concat(params.toString()), {
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 2:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_95 = _a.sent();
                    logger_1.logger.error('Network error getting payment tracking', error_95, 'enhanced-api');
                    throw error_95;
                case 4:
                    if (!response.ok) {
                        throw new Error("Failed to get payment tracking: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 5: return [2 /*return*/, _a.sent()];
                case 6:
                    error_96 = _a.sent();
                    logger_1.logger.error('Failed to get payment tracking', error_96, 'enhanced-api');
                    return [2 /*return*/, handleApiError(error_96, 'get payment tracking')];
                case 7: return [2 /*return*/];
            }
        });
    }); },
    sendInvoiceReminder: function (invoiceIds, message) { return __awaiter(void 0, void 0, void 0, function () {
        var authData, token, parsed, payload, response, error_97, errorText, error_98;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    authData = localStorage.getItem('verofield_auth');
                    if (!authData)
                        throw new Error('User not authenticated');
                    token = void 0;
                    try {
                        parsed = JSON.parse(authData);
                        token = parsed.token || parsed;
                    }
                    catch (_b) {
                        token = authData;
                    }
                    if (!token)
                        throw new Error('No access token found');
                    payload = {};
                    if (invoiceIds.length === 1) {
                        payload.invoice_id = invoiceIds[0];
                    }
                    else {
                        payload.invoice_ids = invoiceIds;
                    }
                    if (message) {
                        payload.message = message;
                    }
                    response = void 0;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch('http://localhost:3001/api/v1/billing/invoices/send-reminder', {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(payload),
                        })];
                case 2:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_97 = _a.sent();
                    logger_1.logger.error('Network error sending invoice reminder', error_97, 'enhanced-api');
                    throw error_97;
                case 4:
                    if (!!response.ok) return [3 /*break*/, 6];
                    return [4 /*yield*/, response.text()];
                case 5:
                    errorText = _a.sent();
                    throw new Error("Failed to send reminder: ".concat(errorText || response.statusText));
                case 6: return [4 /*yield*/, response.json()];
                case 7: return [2 /*return*/, _a.sent()];
                case 8:
                    error_98 = _a.sent();
                    logger_1.logger.error('Failed to send invoice reminder', error_98, 'enhanced-api');
                    return [2 /*return*/, handleApiError(error_98, 'send invoice reminder')];
                case 9: return [2 /*return*/];
            }
        });
    }); }
};
exports.inventory = {
    getComplianceData: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                // TODO: Replace with actual inventory data when inventory system is implemented
                return [2 /*return*/, {
                        totalItems: 0,
                        lowStock: 0,
                        outOfStock: 0,
                        expiringSoon: 0,
                        complianceRate: 0,
                        safetyScore: 0
                    }];
            }
            catch (error) {
                return [2 /*return*/, handleApiError(error, 'fetch inventory compliance data')];
                return [2 /*return*/, {
                        totalItems: 0,
                        lowStock: 0,
                        outOfStock: 0,
                        expiringSoon: 0,
                        complianceRate: 0,
                        safetyScore: 0
                    }];
            }
            return [2 /*return*/];
        });
    }); },
    getCategories: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                // TODO: Replace with actual inventory categories when implemented
                return [2 /*return*/, []];
            }
            catch (error) {
                return [2 /*return*/, handleApiError(error, 'fetch inventory categories')];
                return [2 /*return*/, []];
            }
            return [2 /*return*/];
        });
    }); },
    getComplianceAlerts: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                // TODO: Replace with actual compliance alerts when implemented
                return [2 /*return*/, []];
            }
            catch (error) {
                return [2 /*return*/, handleApiError(error, 'fetch compliance alerts')];
                return [2 /*return*/, []];
            }
            return [2 /*return*/];
        });
    }); },
    getRecentInspections: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                // TODO: Replace with actual inspection data when implemented
                return [2 /*return*/, []];
            }
            catch (error) {
                return [2 /*return*/, handleApiError(error, 'fetch recent inspections')];
                return [2 /*return*/, []];
            }
            return [2 /*return*/];
        });
    }); }
};
// ============================================================================
// FINANCIAL API (Dashboard Components)
// ============================================================================
exports.financial = {
    getSnapshot: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                // TODO: Replace with actual financial data when implemented
                return [2 /*return*/, {
                        currentMonth: {
                            revenue: 0,
                            expenses: 0,
                            profit: 0,
                            jobsCompleted: 0,
                            averageJobValue: 0,
                            outstandingInvoices: 0
                        },
                        previousMonth: {
                            revenue: 0,
                            expenses: 0,
                            profit: 0
                        },
                        yearly: {
                            revenue: 0,
                            expenses: 0,
                            profit: 0
                        }
                    }];
            }
            catch (error) {
                return [2 /*return*/, handleApiError(error, 'fetch financial snapshot')];
                return [2 /*return*/, {
                        currentMonth: {
                            revenue: 0,
                            expenses: 0,
                            profit: 0,
                            jobsCompleted: 0,
                            averageJobValue: 0,
                            outstandingInvoices: 0
                        },
                        previousMonth: {
                            revenue: 0,
                            expenses: 0,
                            profit: 0
                        },
                        yearly: {
                            revenue: 0,
                            expenses: 0,
                            profit: 0
                        }
                    }];
            }
            return [2 /*return*/];
        });
    }); },
    getRevenueBreakdown: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                // TODO: Replace with actual revenue breakdown when implemented
                return [2 /*return*/, []];
            }
            catch (error) {
                return [2 /*return*/, handleApiError(error, 'fetch revenue breakdown')];
                return [2 /*return*/, []];
            }
            return [2 /*return*/];
        });
    }); },
    getRecentTransactions: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                // TODO: Replace with actual transaction data when implemented
                return [2 /*return*/, []];
            }
            catch (error) {
                return [2 /*return*/, handleApiError(error, 'fetch recent transactions')];
                return [2 /*return*/, []];
            }
            return [2 /*return*/];
        });
    }); },
};
// ============================================================================
// KPI TEMPLATES API
// ============================================================================
exports.kpiTemplates = {
    // Get all KPI templates with filtering
    list: function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (filters) {
            var token, cleanFilters, response, data, result, error_99;
            if (filters === void 0) { filters = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        cleanFilters = Object.fromEntries(Object.entries(filters).filter(function (_a) {
                            var _ = _a[0], value = _a[1];
                            return value !== undefined && value !== null && value !== '';
                        }));
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v2/kpi-templates?".concat(new URLSearchParams(cleanFilters)), {
                                headers: {
                                    'Authorization': "Bearer ".concat(token),
                                    'Content-Type': 'application/json',
                                },
                            })];
                    case 2:
                        response = _a.sent();
                        data = (response === null || response === void 0 ? void 0 : response.data) || response;
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('API Response (kpiTemplates.list)', {
                                hasData: !!data,
                                hasTemplates: !!data.templates,
                                dataType: typeof data,
                                dataIsArray: Array.isArray(data)
                            }, 'enhanced-api');
                        }
                        result = data.templates || data || [];
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('Returning KPI templates', {
                                resultType: typeof result,
                                resultIsArray: Array.isArray(result),
                                resultCount: Array.isArray(result) ? result.length : 0
                            }, 'enhanced-api');
                        }
                        return [2 /*return*/, result];
                    case 3:
                        error_99 = _a.sent();
                        return [2 /*return*/, handleApiError(error_99, 'fetch KPI templates')];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // Get a specific KPI template
    get: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, result, error_100;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, getAuthToken()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v2/kpi-templates/".concat(id), {
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    // Handle v2 response format: { data, meta }
                    return [2 /*return*/, (result === null || result === void 0 ? void 0 : result.data) || result];
                case 4:
                    error_100 = _a.sent();
                    return [2 /*return*/, handleApiError(error_100, 'fetch KPI template')];
                case 5: return [2 /*return*/];
            }
        });
    }); },
    // Create a new KPI template
    create: function (templateData) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, _b, _c, _d, error_101;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 4, , 5]);
                    _c = (_b = supabase_client_1.supabase
                        .from('kpi_templates'))
                        .insert;
                    _d = [__assign({}, templateData)];
                    _e = {};
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    _e.tenant_id = _f.sent();
                    return [4 /*yield*/, getUserId()];
                case 2: return [4 /*yield*/, _c.apply(_b, [__assign.apply(void 0, _d.concat([(_e.created_by = _f.sent(), _e)]))])
                        .select()
                        .single()];
                case 3:
                    _a = _f.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 4:
                    error_101 = _f.sent();
                    return [2 /*return*/, handleApiError(error_101, 'create KPI template')];
                case 5: return [2 /*return*/];
            }
        });
    }); },
    // Update an existing KPI template
    update: function (id, updates) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, _b, _c, _d, error_102;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 3, , 4]);
                    _c = (_b = supabase_client_1.supabase
                        .from('kpi_templates')
                        .update(updates)
                        .eq('id', id))
                        .eq;
                    _d = ['tenant_id'];
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1: return [4 /*yield*/, _c.apply(_b, _d.concat([_e.sent()]))
                        .select()
                        .single()];
                case 2:
                    _a = _e.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 3:
                    error_102 = _e.sent();
                    return [2 /*return*/, handleApiError(error_102, 'update KPI template')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // Delete a KPI template
    delete: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var error, _a, _b, _c, error_103;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 3, , 4]);
                    _b = (_a = supabase_client_1.supabase
                        .from('kpi_templates')
                        .delete()
                        .eq('id', id))
                        .eq;
                    _c = ['tenant_id'];
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent()]))];
                case 2:
                    error = (_d.sent()).error;
                    if (error)
                        throw error;
                    return [3 /*break*/, 4];
                case 3:
                    error_103 = _d.sent();
                    return [2 /*return*/, handleApiError(error_103, 'delete KPI template')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // Use a template to create a user KPI
    useTemplate: function (templateId, userKpiData) { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, result, error_104;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, getAuthToken()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v2/kpi-templates/use", {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(__assign(__assign({}, userKpiData), { template_id: templateId }))
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    // Handle v2 response format: { data, meta }
                    return [2 /*return*/, (result === null || result === void 0 ? void 0 : result.data) || result];
                case 4:
                    error_104 = _a.sent();
                    return [2 /*return*/, handleApiError(error_104, 'use KPI template')];
                case 5: return [2 /*return*/];
            }
        });
    }); },
    // Track template usage
    trackUsage: function (templateId, action) { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, result, error_105;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, getAuthToken()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v2/kpi-templates/track-usage", {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                template_id: templateId,
                                action: action
                            })
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    // Handle v2 response format: { data, meta }
                    return [2 /*return*/, (result === null || result === void 0 ? void 0 : result.data) || result];
                case 4:
                    error_105 = _a.sent();
                    return [2 /*return*/, handleApiError(error_105, 'track template usage')];
                case 5: return [2 /*return*/];
            }
        });
    }); },
    // Get user's favorited templates
    getFavorites: function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, errorText, result, data, error_106;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, getAuthToken()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v2/kpi-templates/favorites", {
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.text()];
                case 3:
                    errorText = _a.sent();
                    logger_1.logger.error('Favorites API error', new Error("".concat(response.status, " ").concat(response.statusText, ": ").concat(errorText)), 'enhanced-api');
                    // If it's a 400 error, the table might not exist or there's a schema issue
                    if (response.status === 400) {
                        logger_1.logger.warn('Favorites API returned 400 - this might be a database schema issue', {}, 'enhanced-api');
                    }
                    // Gracefully degrade to empty list so UI still works
                    return [2 /*return*/, []];
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    result = _a.sent();
                    data = (result === null || result === void 0 ? void 0 : result.data) || result;
                    return [2 /*return*/, Array.isArray(data) ? data : []];
                case 6:
                    error_106 = _a.sent();
                    logger_1.logger.error('Favorites API network error', error_106, 'enhanced-api');
                    return [2 /*return*/, handleApiError(error_106, 'get favorited templates')];
                case 7: return [2 /*return*/];
            }
        });
    }); },
    // Check if template is favorited
    getFavoriteStatus: function (templateId) { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, result, data, error_107;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, getAuthToken()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v2/kpi-templates/".concat(templateId, "/favorite-status"), {
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    data = (result === null || result === void 0 ? void 0 : result.data) || result;
                    return [2 /*return*/, (data === null || data === void 0 ? void 0 : data.isFavorited) !== undefined ? data : { isFavorited: (data === null || data === void 0 ? void 0 : data.isFavorited) || false }];
                case 4:
                    error_107 = _a.sent();
                    return [2 /*return*/, handleApiError(error_107, 'get template favorite status')];
                case 5: return [2 /*return*/];
            }
        });
    }); },
    // Get popular templates
    getPopular: function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (limit) {
            var token, response, result, data, error_108;
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, fetch("http://localhost:3001/api/v2/kpi-templates/popular?limit=".concat(limit), {
                                headers: {
                                    'Authorization': "Bearer ".concat(token),
                                    'Content-Type': 'application/json',
                                },
                            })];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("HTTP error! status: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        result = _a.sent();
                        data = (result === null || result === void 0 ? void 0 : result.data) || result;
                        return [2 /*return*/, Array.isArray(data) ? data : []];
                    case 4:
                        error_108 = _a.sent();
                        return [2 /*return*/, handleApiError(error_108, 'fetch popular KPI templates')];
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    // Get featured templates
    getFeatured: function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, result, data, templates, error_109;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, getAuthToken()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, fetch("http://localhost:3001/api/v2/kpi-templates?is_featured=true", {
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    data = (result === null || result === void 0 ? void 0 : result.data) || result;
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('API Response (kpiTemplates.list)', {
                            hasData: !!data,
                            hasTemplates: !!data.templates,
                            dataType: typeof data,
                            dataIsArray: Array.isArray(data)
                        }, 'enhanced-api');
                    }
                    templates = data.templates || data || [];
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Returning KPI templates', {
                            resultType: typeof templates,
                            resultIsArray: Array.isArray(templates),
                            resultCount: Array.isArray(templates) ? templates.length : 0
                        }, 'enhanced-api');
                    }
                    return [2 /*return*/, templates];
                case 4:
                    error_109 = _a.sent();
                    return [2 /*return*/, handleApiError(error_109, 'fetch featured KPI templates')];
                case 5: return [2 /*return*/];
            }
        });
    }); }
};
// ============================================================================
// USER KPIS API
// ============================================================================
exports.userKpis = {
    // Get user's KPIs
    list: function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, data, error_110;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, getAuthToken()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v2/kpis/user", {
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 2:
                    response = _a.sent();
                    data = (response === null || response === void 0 ? void 0 : response.data) || response;
                    return [2 /*return*/, Array.isArray(data) ? data : []];
                case 3:
                    error_110 = _a.sent();
                    return [2 /*return*/, handleApiError(error_110, 'fetch user KPIs')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // Get a specific user KPI
    get: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, _b, _c, _d, _e, _f, _g, error_111;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _h.trys.push([0, 4, , 5]);
                    _d = (_c = supabase_client_1.supabase
                        .from('user_kpis')
                        .select("\n            *,\n            template:kpi_templates(*)\n          ")
                        .eq('id', id))
                        .eq;
                    _e = ['tenant_id'];
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    _f = (_b = _d.apply(_c, _e.concat([_h.sent()])))
                        .eq;
                    _g = ['user_id'];
                    return [4 /*yield*/, getUserId()];
                case 2: return [4 /*yield*/, _f.apply(_b, _g.concat([_h.sent()]))
                        .single()];
                case 3:
                    _a = _h.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 4:
                    error_111 = _h.sent();
                    return [2 /*return*/, handleApiError(error_111, 'fetch user KPI')];
                case 5: return [2 /*return*/];
            }
        });
    }); },
    // Create a new user KPI
    create: function (kpiData) { return __awaiter(void 0, void 0, void 0, function () {
        var authToken, response, errorData, result, error_112;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    logger_1.logger.debug('Enhanced API - Creating user KPI', { hasKpiData: !!kpiData }, 'enhanced-api');
                    return [4 /*yield*/, getAuthToken()];
                case 1:
                    authToken = _a.sent();
                    return [4 /*yield*/, fetch("http://localhost:3001/api/kpis", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(authToken),
                            },
                            body: JSON.stringify(kpiData),
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    errorData = _a.sent();
                    logger_1.logger.error('Backend error response', errorData, 'enhanced-api');
                    throw new Error(errorData.message || "HTTP error! status: ".concat(response.status));
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    result = _a.sent();
                    logger_1.logger.debug('Successfully created KPI', { hasResult: !!result }, 'enhanced-api');
                    return [2 /*return*/, result];
                case 6:
                    error_112 = _a.sent();
                    logger_1.logger.error('Enhanced API error', error_112, 'enhanced-api');
                    return [2 /*return*/, handleApiError(error_112, 'create user KPI')];
                case 7: return [2 /*return*/];
            }
        });
    }); },
    // Update a user KPI
    update: function (id, updates) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, _b, _c, _d, _e, _f, _g, error_113;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _h.trys.push([0, 4, , 5]);
                    _d = (_c = supabase_client_1.supabase
                        .from('user_kpis')
                        .update(updates)
                        .eq('id', id))
                        .eq;
                    _e = ['tenant_id'];
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    _f = (_b = _d.apply(_c, _e.concat([_h.sent()])))
                        .eq;
                    _g = ['user_id'];
                    return [4 /*yield*/, getUserId()];
                case 2: return [4 /*yield*/, _f.apply(_b, _g.concat([_h.sent()]))
                        .select()
                        .single()];
                case 3:
                    _a = _h.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 4:
                    error_113 = _h.sent();
                    return [2 /*return*/, handleApiError(error_113, 'update user KPI')];
                case 5: return [2 /*return*/];
            }
        });
    }); },
    // Delete a user KPI
    delete: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var error, _a, _b, _c, _d, _e, _f, error_114;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _g.trys.push([0, 4, , 5]);
                    _c = (_b = supabase_client_1.supabase
                        .from('user_kpis')
                        .delete()
                        .eq('id', id))
                        .eq;
                    _d = ['tenant_id'];
                    return [4 /*yield*/, (0, exports.getTenantId)()];
                case 1:
                    _e = (_a = _c.apply(_b, _d.concat([_g.sent()])))
                        .eq;
                    _f = ['user_id'];
                    return [4 /*yield*/, getUserId()];
                case 2: return [4 /*yield*/, _e.apply(_a, _f.concat([_g.sent()]))];
                case 3:
                    error = (_g.sent()).error;
                    if (error)
                        throw error;
                    return [3 /*break*/, 5];
                case 4:
                    error_114 = _g.sent();
                    return [2 /*return*/, handleApiError(error_114, 'delete user KPI')];
                case 5: return [2 /*return*/];
            }
        });
    }); }
};
// ============================================================================
// TECHNICIANS API
// ============================================================================
var technicians = {
    // Get all technicians
    list: function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, baseUrl, url, response, error_115, anyError;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, getAuthToken()];
                case 1:
                    token = _a.sent();
                    baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
                    url = "".concat(baseUrl, "/v2/technicians");
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Fetching technicians', { url: url, baseUrl: baseUrl }, 'enhanced-api');
                    }
                    return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)(url, {
                            headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }
                        })];
                case 2:
                    response = _a.sent();
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.debug('Technicians API response', { response: response, responseType: typeof response, isArray: Array.isArray(response) }, 'enhanced-api');
                    }
                    // Handle paginated response - extract data array if present
                    // Backend controller wraps TechnicianListResponseDto in { data: result, meta: {...} }
                    // TechnicianListResponseDto has structure: { data: [...], pagination: {...}, success: true, ... }
                    // So final response is: { data: { data: [...], pagination: {...}, ... }, meta: {...} }
                    // Check if response.data.data exists (double-nested structure from controller wrapping DTO)
                    if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('Extracted technicians from response.data.data (controller-wrapped DTO)', { count: response.data.data.length }, 'enhanced-api');
                        }
                        return [2 /*return*/, response.data.data];
                    }
                    // Check if response.data.technicians exists (alternative nested structure)
                    else if (response && response.data && response.data.technicians && Array.isArray(response.data.technicians)) {
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('Extracted technicians from response.data.technicians', { count: response.data.technicians.length }, 'enhanced-api');
                        }
                        return [2 /*return*/, response.data.technicians];
                    }
                    // Check if response.data is a direct array
                    else if (response && response.data && Array.isArray(response.data)) {
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('Extracted technicians from response.data (direct array)', { count: response.data.length }, 'enhanced-api');
                        }
                        return [2 /*return*/, response.data];
                    }
                    // Check if response is a direct array
                    else if (Array.isArray(response)) {
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('Response is direct array', { count: response.length }, 'enhanced-api');
                        }
                        return [2 /*return*/, response];
                    }
                    // Check if response.technicians exists (alternative format)
                    else if (response && response.technicians && Array.isArray(response.technicians)) {
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('Extracted technicians from response.technicians', { count: response.technicians.length }, 'enhanced-api');
                        }
                        return [2 /*return*/, response.technicians];
                    }
                    if (process.env.NODE_ENV === 'development') {
                        logger_1.logger.warn('Unexpected response format for technicians', { response: response }, 'enhanced-api');
                    }
                    return [2 /*return*/, []];
                case 3:
                    error_115 = _a.sent();
                    anyError = error_115;
                    logger_1.logger.error('Error fetching technicians', { error: anyError, message: anyError === null || anyError === void 0 ? void 0 : anyError.message, status: anyError === null || anyError === void 0 ? void 0 : anyError.status }, 'enhanced-api');
                    return [2 /*return*/, handleApiError(anyError, 'list technicians')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // Get technician availability
    getAvailability: function (technicianId, startDate, endDate) { return __awaiter(void 0, void 0, void 0, function () {
        var token, baseUrl, url, response, data, error_116;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, getAuthToken()];
                case 1:
                    token = _a.sent();
                    baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
                    url = "".concat(baseUrl, "/v2/technicians/").concat(technicianId, "/availability");
                    if (startDate && endDate) {
                        url += "?start_date=".concat(startDate, "&end_date=").concat(endDate);
                    }
                    return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)(url, {
                            headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }
                        })];
                case 2:
                    response = _a.sent();
                    data = (response === null || response === void 0 ? void 0 : response.data) || response;
                    return [2 /*return*/, data];
                case 3:
                    error_116 = _a.sent();
                    return [2 /*return*/, handleApiError(error_116, 'get technician availability')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // Set availability pattern
    setAvailability: function (technicianId_1, dayOfWeek_1, startTime_1, endTime_1) {
        var args_1 = [];
        for (var _i = 4; _i < arguments.length; _i++) {
            args_1[_i - 4] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([technicianId_1, dayOfWeek_1, startTime_1, endTime_1], args_1, true), void 0, function (technicianId, dayOfWeek, startTime, endTime, isActive) {
            var token, baseUrl, url, response, error_117;
            if (isActive === void 0) { isActive = true; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
                        url = "".concat(baseUrl, "/v2/technicians/").concat(technicianId, "/availability");
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)(url, {
                                method: 'POST',
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    day_of_week: dayOfWeek,
                                    start_time: startTime,
                                    end_time: endTime,
                                    is_active: isActive
                                })
                            })];
                    case 2:
                        response = _a.sent();
                        // Handle v2 response format
                        return [2 /*return*/, (response === null || response === void 0 ? void 0 : response.data) || response];
                    case 3:
                        error_117 = _a.sent();
                        return [2 /*return*/, handleApiError(error_117, 'set technician availability')];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // Get available technicians for a time slot
    getAvailable: function (date, startTime, endTime) { return __awaiter(void 0, void 0, void 0, function () {
        var token, baseUrl, url, response, data, error_118;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, getAuthToken()];
                case 1:
                    token = _a.sent();
                    baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
                    url = "".concat(baseUrl, "/v2/technicians/available?date=").concat(date, "&start_time=").concat(startTime, "&end_time=").concat(endTime);
                    return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)(url, {
                            headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }
                        })];
                case 2:
                    response = _a.sent();
                    data = (response === null || response === void 0 ? void 0 : response.data) || response;
                    return [2 /*return*/, data || []];
                case 3:
                    error_118 = _a.sent();
                    return [2 /*return*/, handleApiError(error_118, 'get available technicians')];
                case 4: return [2 /*return*/];
            }
        });
    }); }
};
// ============================================================================
// ROUTING API
// ============================================================================
var routing = {
    // Get routes for a specific date or all routes
    getRoutes: function (date) { return __awaiter(void 0, void 0, void 0, function () {
        var token, url, data, error_119;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, getAuthToken()];
                case 1:
                    token = _a.sent();
                    url = date
                        ? "http://localhost:3001/api/v1/routing/routes?date=".concat(date)
                        : 'http://localhost:3001/api/v1/routing/routes';
                    return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)(url, {
                            headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }
                        })];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data || []];
                case 3:
                    error_119 = _a.sent();
                    return [2 /*return*/, handleApiError(error_119, 'get routes')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // Optimize route for a specific technician
    optimizeRoute: function (technicianId, date) { return __awaiter(void 0, void 0, void 0, function () {
        var token, data, error_120;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, getAuthToken()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v1/routing/optimize/".concat(technicianId, "?date=").concat(date), {
                            method: 'POST',
                            headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }
                        })];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 3:
                    error_120 = _a.sent();
                    return [2 /*return*/, handleApiError(error_120, 'optimize route')];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // Get route metrics for a date range
    getMetrics: function (startDate, endDate) { return __awaiter(void 0, void 0, void 0, function () {
        var token, data, error_121;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, getAuthToken()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v1/routing/metrics?start_date=".concat(startDate, "&end_date=").concat(endDate), {
                            headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }
                        })];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 3:
                    error_121 = _a.sent();
                    return [2 /*return*/, handleApiError(error_121, 'get route metrics')];
                case 4: return [2 /*return*/];
            }
        });
    }); }
};
// ============================================================================
// MAIN EXPORT
// ============================================================================
exports.enhancedApi = {
    customers: exports.customers,
    customerProfiles: exports.customerProfiles,
    customerContacts: exports.customerContacts,
    workOrders: exports.workOrders,
    jobs: exports.jobs,
    locations: exports.locations,
    serviceTypes: exports.serviceTypes,
    serviceCategories: exports.serviceCategories,
    customerSegments: exports.customerSegments,
    pricing: exports.pricing,
    paymentMethods: exports.paymentMethods,
    communication: exports.communication,
    compliance: exports.compliance,
    serviceAreas: exports.serviceAreas,
    technicianSkills: exports.technicianSkills,
    technicians: technicians,
    analytics: exports.analytics,
    billing: exports.billing,
    inventory: exports.inventory,
    financial: exports.financial,
    company: exports.company,
    kpiTemplates: exports.kpiTemplates,
    userKpis: exports.userKpis,
    routing: routing,
    auth: exports.authApi,
    // Dashboard layouts/cards persistence (server-side)
    dashboardLayouts: {
        getOrCreateDefault: function () { return __awaiter(void 0, void 0, void 0, function () {
            var token, data, error_122;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v1/dashboard/layouts/default", {
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }
                            })];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        error_122 = _a.sent();
                        return [2 /*return*/, handleApiError(error_122, 'load default dashboard layout')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        listCards: function (layoutId) { return __awaiter(void 0, void 0, void 0, function () {
            var token, data, error_123;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v1/dashboard/layouts/".concat(layoutId, "/cards"), {
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }
                            })];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data || []];
                    case 3:
                        error_123 = _a.sent();
                        return [2 /*return*/, handleApiError(error_123, 'list dashboard cards')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        // Region methods
        listRegions: function (layoutId) { return __awaiter(void 0, void 0, void 0, function () {
            var token, data, error_124;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v1/dashboard/layouts/".concat(layoutId, "/regions"), {
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }
                            })];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data || []];
                    case 3:
                        error_124 = _a.sent();
                        return [2 /*return*/, handleApiError(error_124, 'list dashboard regions')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        createRegion: function (layoutId, regionData) { return __awaiter(void 0, void 0, void 0, function () {
            var token, sanitizedData, data, error_125;
            var _a, _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        _h.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _h.sent();
                        sanitizedData = __assign(__assign({}, regionData), { grid_row: Math.max(0, typeof regionData.grid_row === 'string' ? parseInt(regionData.grid_row, 10) : ((_a = regionData.grid_row) !== null && _a !== void 0 ? _a : 0)), grid_col: Math.max(0, Math.min(11, typeof regionData.grid_col === 'string' ? parseInt(regionData.grid_col, 10) : ((_b = regionData.grid_col) !== null && _b !== void 0 ? _b : 0))), row_span: Math.max(1, Math.min(20, typeof regionData.row_span === 'string' ? parseInt(regionData.row_span, 10) : ((_c = regionData.row_span) !== null && _c !== void 0 ? _c : 1))), col_span: Math.max(1, Math.min(12, typeof regionData.col_span === 'string' ? parseInt(regionData.col_span, 10) : ((_d = regionData.col_span) !== null && _d !== void 0 ? _d : 1))), min_width: typeof regionData.min_width === 'string' ? parseInt(regionData.min_width, 10) : ((_e = regionData.min_width) !== null && _e !== void 0 ? _e : 200), min_height: typeof regionData.min_height === 'string' ? parseInt(regionData.min_height, 10) : ((_f = regionData.min_height) !== null && _f !== void 0 ? _f : 150), display_order: typeof regionData.display_order === 'string' ? parseInt(regionData.display_order, 10) : ((_g = regionData.display_order) !== null && _g !== void 0 ? _g : 0) });
                        // Ensure col + span doesn't exceed 12
                        if (sanitizedData.grid_col + sanitizedData.col_span > 12) {
                            sanitizedData.col_span = 12 - sanitizedData.grid_col;
                        }
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('Creating region', { layoutId: layoutId, sanitizedData: sanitizedData }, 'enhanced-api');
                        }
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v1/dashboard/layouts/".concat(layoutId, "/regions"), {
                                method: 'POST',
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' },
                                body: JSON.stringify(sanitizedData)
                            })];
                    case 2:
                        data = _h.sent();
                        return [2 /*return*/, data];
                    case 3:
                        error_125 = _h.sent();
                        return [2 /*return*/, handleApiError(error_125, 'create dashboard region')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        updateRegion: function (layoutId, regionId, updates) { return __awaiter(void 0, void 0, void 0, function () {
            var token, data, error_126;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        if (process.env.NODE_ENV === 'development') {
                            logger_1.logger.debug('Updating region', { layoutId: layoutId, regionId: regionId, updates: updates }, 'enhanced-api');
                        }
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v1/dashboard/layouts/".concat(layoutId, "/regions/").concat(regionId), {
                                method: 'PUT',
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' },
                                body: JSON.stringify(updates)
                            })];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        error_126 = _a.sent();
                        return [2 /*return*/, handleApiError(error_126, 'update dashboard region')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        deleteRegion: function (layoutId, regionId) { return __awaiter(void 0, void 0, void 0, function () {
            var token, data, error_127;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v1/dashboard/layouts/".concat(layoutId, "/regions/").concat(regionId), {
                                method: 'DELETE',
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }
                            })];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        error_127 = _a.sent();
                        return [2 /*return*/, handleApiError(error_127, 'delete dashboard region')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        reorderRegions: function (layoutId, regionIds) { return __awaiter(void 0, void 0, void 0, function () {
            var token, data, error_128;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v1/dashboard/layouts/".concat(layoutId, "/regions/reorder"), {
                                method: 'POST',
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' },
                                body: JSON.stringify({ region_ids: regionIds })
                            })];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        error_128 = _a.sent();
                        return [2 /*return*/, handleApiError(error_128, 'reorder dashboard regions')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        getRoleDefaults: function (role) { return __awaiter(void 0, void 0, void 0, function () {
            var token, data, error_129;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v1/dashboard/regions/defaults/".concat(role), {
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }
                            })];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data || []];
                    case 3:
                        error_129 = _a.sent();
                        return [2 /*return*/, handleApiError(error_129, 'get role defaults')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        // Versioning methods
        getVersions: function (layoutId) { return __awaiter(void 0, void 0, void 0, function () {
            var token, data, error_130;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v1/dashboard/layouts/".concat(layoutId, "/versions"), {
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }
                            })];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data || []];
                    case 3:
                        error_130 = _a.sent();
                        return [2 /*return*/, handleApiError(error_130, 'get layout versions')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        createVersion: function (layoutId, status, notes) { return __awaiter(void 0, void 0, void 0, function () {
            var token, data, error_131;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v1/dashboard/layouts/".concat(layoutId, "/versions"), {
                                method: 'POST',
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: status, notes: notes })
                            })];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        error_131 = _a.sent();
                        return [2 /*return*/, handleApiError(error_131, 'create layout version')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        publishVersion: function (layoutId, versionId, notes) { return __awaiter(void 0, void 0, void 0, function () {
            var token, data, error_132;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v1/dashboard/layouts/".concat(layoutId, "/publish"), {
                                method: 'POST',
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' },
                                body: JSON.stringify({ version_id: versionId, notes: notes })
                            })];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        error_132 = _a.sent();
                        return [2 /*return*/, handleApiError(error_132, 'publish layout version')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        revertToVersion: function (layoutId, versionId) { return __awaiter(void 0, void 0, void 0, function () {
            var token, data, error_133;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v1/dashboard/layouts/".concat(layoutId, "/revert/").concat(versionId), {
                                method: 'POST',
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }
                            })];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        error_133 = _a.sent();
                        return [2 /*return*/, handleApiError(error_133, 'revert to version')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        // Undo/Redo methods
        undoLayout: function (layoutId) { return __awaiter(void 0, void 0, void 0, function () {
            var token, data, error_134;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v2/dashboard/layouts/".concat(layoutId, "/undo"), {
                                method: 'POST',
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }
                            })];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        error_134 = _a.sent();
                        return [2 /*return*/, handleApiError(error_134, 'undo layout')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        redoLayout: function (layoutId) { return __awaiter(void 0, void 0, void 0, function () {
            var token, data, error_135;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v2/dashboard/layouts/".concat(layoutId, "/redo"), {
                                method: 'POST',
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }
                            })];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        error_135 = _a.sent();
                        return [2 /*return*/, handleApiError(error_135, 'redo layout')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        getLayoutHistory: function (layoutId_1) {
            var args_1 = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args_1[_i - 1] = arguments[_i];
            }
            return __awaiter(void 0, __spreadArray([layoutId_1], args_1, true), void 0, function (layoutId, limit) {
                var token, data, error_136;
                if (limit === void 0) { limit = 50; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, getAuthToken()];
                        case 1:
                            token = _a.sent();
                            return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v2/dashboard/layouts/".concat(layoutId, "/history?limit=").concat(limit), {
                                    headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }
                                })];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, data];
                        case 3:
                            error_136 = _a.sent();
                            return [2 /*return*/, handleApiError(error_136, 'get layout history')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        // Widget registry methods
        getApprovedWidgets: function () { return __awaiter(void 0, void 0, void 0, function () {
            var token, data, error_137;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v1/dashboard/widgets/approved", {
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }
                            })];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data || []];
                    case 3:
                        error_137 = _a.sent();
                        return [2 /*return*/, handleApiError(error_137, 'get approved widgets')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        registerWidget: function (widgetData) { return __awaiter(void 0, void 0, void 0, function () {
            var token, data, error_138;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v1/dashboard/widgets/register", {
                                method: 'POST',
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' },
                                body: JSON.stringify(widgetData)
                            })];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        error_138 = _a.sent();
                        return [2 /*return*/, handleApiError(error_138, 'register widget')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        // Presence methods
        getPresence: function (regionId) { return __awaiter(void 0, void 0, void 0, function () {
            var token, data, error_139;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/dashboard/regions/".concat(regionId, "/presence"), {
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }
                            })];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data || []];
                    case 3:
                        error_139 = _a.sent();
                        return [2 /*return*/, handleApiError(error_139, 'get region presence')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        updatePresence: function (regionId, userId, sessionId, isEditing) { return __awaiter(void 0, void 0, void 0, function () {
            var token, error_140;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/dashboard/regions/".concat(regionId, "/presence"), {
                                method: 'POST',
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' },
                                body: JSON.stringify({ userId: userId, sessionId: sessionId, isEditing: isEditing })
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_140 = _a.sent();
                        return [2 /*return*/, handleApiError(error_140, 'update region presence')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        // Template methods
        templates: {
            list: function () { return __awaiter(void 0, void 0, void 0, function () {
                var token, response, error_141;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, getAuthToken()];
                        case 1:
                            token = _a.sent();
                            return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v2/dashboard/templates", {
                                    headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }
                                })];
                        case 2:
                            response = _a.sent();
                            return [2 /*return*/, (response === null || response === void 0 ? void 0 : response.data) || []];
                        case 3:
                            error_141 = _a.sent();
                            return [2 /*return*/, handleApiError(error_141, 'list templates')];
                        case 4: return [2 /*return*/];
                    }
                });
            }); },
            get: function (id) { return __awaiter(void 0, void 0, void 0, function () {
                var token, response, error_142;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, getAuthToken()];
                        case 1:
                            token = _a.sent();
                            return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v2/dashboard/templates/".concat(id), {
                                    headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }
                                })];
                        case 2:
                            response = _a.sent();
                            return [2 /*return*/, response === null || response === void 0 ? void 0 : response.data];
                        case 3:
                            error_142 = _a.sent();
                            return [2 /*return*/, handleApiError(error_142, 'get template')];
                        case 4: return [2 /*return*/];
                    }
                });
            }); },
            create: function (template) { return __awaiter(void 0, void 0, void 0, function () {
                var token, response, error_143;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, getAuthToken()];
                        case 1:
                            token = _a.sent();
                            return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v2/dashboard/templates", {
                                    method: 'POST',
                                    headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' },
                                    body: JSON.stringify(template)
                                })];
                        case 2:
                            response = _a.sent();
                            return [2 /*return*/, response === null || response === void 0 ? void 0 : response.data];
                        case 3:
                            error_143 = _a.sent();
                            return [2 /*return*/, handleApiError(error_143, 'create template')];
                        case 4: return [2 /*return*/];
                    }
                });
            }); },
            update: function (id, template) { return __awaiter(void 0, void 0, void 0, function () {
                var token, response, error_144;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, getAuthToken()];
                        case 1:
                            token = _a.sent();
                            return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v2/dashboard/templates/".concat(id), {
                                    method: 'PUT',
                                    headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' },
                                    body: JSON.stringify(template)
                                })];
                        case 2:
                            response = _a.sent();
                            return [2 /*return*/, response === null || response === void 0 ? void 0 : response.data];
                        case 3:
                            error_144 = _a.sent();
                            return [2 /*return*/, handleApiError(error_144, 'update template')];
                        case 4: return [2 /*return*/];
                    }
                });
            }); },
            delete: function (id) { return __awaiter(void 0, void 0, void 0, function () {
                var token, error_145;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, getAuthToken()];
                        case 1:
                            token = _a.sent();
                            return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/v2/dashboard/templates/".concat(id), {
                                    method: 'DELETE',
                                    headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }
                                })];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_145 = _a.sent();
                            return [2 /*return*/, handleApiError(error_145, 'delete template')];
                        case 4: return [2 /*return*/];
                    }
                });
            }); }
        },
        acquireLock: function (regionId) { return __awaiter(void 0, void 0, void 0, function () {
            var token, data, error_146;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/dashboard/regions/".concat(regionId, "/lock"), {
                                method: 'POST',
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' },
                                body: JSON.stringify({ action: 'acquire' })
                            })];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data || { success: false }];
                    case 3:
                        error_146 = _a.sent();
                        return [2 /*return*/, handleApiError(error_146, 'acquire region lock')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        releaseLock: function (regionId) { return __awaiter(void 0, void 0, void 0, function () {
            var token, error_147;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/dashboard/regions/".concat(regionId, "/lock"), {
                                method: 'POST',
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' },
                                body: JSON.stringify({ action: 'release' })
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_147 = _a.sent();
                        return [2 /*return*/, handleApiError(error_147, 'release region lock')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        // Migration method
        migrateCardsToRegions: function (layoutId) { return __awaiter(void 0, void 0, void 0, function () {
            var token, data, error_148;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/dashboard/migrate/cards-to-regions", {
                                method: 'POST',
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' },
                                body: JSON.stringify({ layoutId: layoutId })
                            })];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        error_148 = _a.sent();
                        return [2 /*return*/, handleApiError(error_148, 'migrate cards to regions')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        upsertCard: function (layoutId, card) { return __awaiter(void 0, void 0, void 0, function () {
            var token, body, data, error_149;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        body = __assign({ layout_id: layoutId }, card);
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/dashboard/cards", {
                                method: 'PUT',
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' },
                                body: JSON.stringify(body)
                            })];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        error_149 = _a.sent();
                        return [2 /*return*/, handleApiError(error_149, 'upsert dashboard card')];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        deleteCard: function (cardId) { return __awaiter(void 0, void 0, void 0, function () {
            var token, error_150;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getAuthToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, api_utils_1.enhancedApiCall)("http://localhost:3001/api/dashboard/cards/".concat(cardId), {
                                method: 'DELETE',
                                headers: { 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_150 = _a.sent();
                        return [2 /*return*/, handleApiError(error_150, 'delete dashboard card')];
                    case 4: return [2 /*return*/];
                }
            });
        }); }
    },
    // Alias for customers.search
    accounts: {
        search: function (filters) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, exports.customers.search(filters)];
            });
        }); },
    },
    // Alias for technicians.list
    users: {
        list: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, technicians.list()];
            });
        }); },
    }
};
exports.default = exports.enhancedApi;
