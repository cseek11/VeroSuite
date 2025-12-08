"use strict";
// ============================================================================
// SIMPLE SEARCH SERVICE - BYPASS FUNCTION ISSUES
// ============================================================================
// Direct query approach to avoid function problems
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
exports.simpleSearch = exports.SimpleSearchService = void 0;
var supabase_client_1 = require("./supabase-client");
var enhanced_api_1 = require("./enhanced-api");
var logger_1 = require("@/utils/logger");
var SimpleSearchService = /** @class */ (function () {
    function SimpleSearchService() {
    }
    /**
     * Simple search using direct Supabase queries
     */
    Object.defineProperty(SimpleSearchService.prototype, "searchCustomers", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, arguments, void 0, function (options) {
                var startTime, tenantId, _a, search, status_1, segmentId, query, searchTerm, phoneDigits, isPhoneSearch, _b, results, error, transformedResults, endTime, timeTakenMs, error_1;
                if (options === void 0) { options = {}; }
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            startTime = performance.now();
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, (0, enhanced_api_1.getTenantId)()];
                        case 2:
                            tenantId = _c.sent();
                            _a = options.search, search = _a === void 0 ? '' : _a, status_1 = options.status, segmentId = options.segmentId;
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Simple search called', { search: search, status: status_1, segmentId: segmentId, tenantId: tenantId }, 'simple-search-service');
                            }
                            query = supabase_client_1.supabase
                                .from('accounts')
                                .select('id, name, email, phone, address, city, state, zip_code, status, account_type, created_at, updated_at')
                                .eq('tenant_id', tenantId);
                            // Apply search filter if provided
                            if (search.trim()) {
                                searchTerm = search.trim();
                                phoneDigits = searchTerm.replace(/\D/g, '');
                                isPhoneSearch = phoneDigits.length >= 3;
                                if (isPhoneSearch) {
                                    // Phone number search
                                    query = query.or("phone_digits.ilike.%".concat(phoneDigits, "%"));
                                }
                                else {
                                    // Text search across multiple fields
                                    query = query.or("name.ilike.%".concat(searchTerm, "%,email.ilike.%").concat(searchTerm, "%,address.ilike.%").concat(searchTerm, "%,city.ilike.%").concat(searchTerm, "%,state.ilike.%").concat(searchTerm, "%,zip_code.ilike.%").concat(searchTerm, "%"));
                                }
                            }
                            // Apply status filter
                            if (status_1) {
                                query = query.eq('status', status_1);
                            }
                            // Apply account type filter
                            if (segmentId) {
                                query = query.eq('account_type', segmentId);
                            }
                            return [4 /*yield*/, query
                                    .order('name', { ascending: true })
                                    .limit(50)];
                        case 3:
                            _b = _c.sent(), results = _b.data, error = _b.error;
                            if (error) {
                                logger_1.logger.error('Search error', error, 'simple-search-service');
                                return [2 /*return*/, []];
                            }
                            transformedResults = (results || []).map(function (account) { return ({
                                id: account.id,
                                name: account.name || '',
                                email: account.email || '',
                                phone: account.phone || '',
                                address: account.address || '',
                                city: account.city || '',
                                state: account.state || '',
                                zip_code: account.zip_code || '',
                                status: account.status || '',
                                account_type: account.account_type || '',
                                relevance_score: 1.0, // Simple scoring for now
                                match_type: 'direct_query',
                                created_at: account.created_at,
                                updated_at: account.updated_at
                            }); });
                            endTime = performance.now();
                            timeTakenMs = Math.round(endTime - startTime);
                            if (process.env.NODE_ENV === 'development') {
                                logger_1.logger.debug('Simple search completed', {
                                    resultsCount: transformedResults.length,
                                    timeTakenMs: timeTakenMs,
                                    searchTerm: search
                                }, 'simple-search-service');
                            }
                            return [2 /*return*/, transformedResults];
                        case 4:
                            error_1 = _c.sent();
                            logger_1.logger.error('Error in simple search', error_1, 'simple-search-service');
                            return [2 /*return*/, []];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
    });
    return SimpleSearchService;
}());
exports.SimpleSearchService = SimpleSearchService;
// Export singleton instance
exports.simpleSearch = new SimpleSearchService();
