"use strict";
// ============================================================================
// ENHANCED SEARCH UTILITIES
// ============================================================================
// Provides robust search functionality for customer data
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchUtils = void 0;
var SearchUtils = /** @class */ (function () {
    function SearchUtils() {
    }
    /**
     * Normalize phone number to digits-only for comparison
     */
    Object.defineProperty(SearchUtils, "normalizePhone", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (phone) {
            if (!phone)
                return '';
            return phone.replace(/\D/g, '');
        }
    });
    /**
     * Check if search term matches phone number (handles partial matches)
     */
    Object.defineProperty(SearchUtils, "matchPhone", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (searchTerm, phone, phoneDigits) {
            if (!phone || !searchTerm)
                return false;
            var searchDigits = searchTerm.replace(/\D/g, '');
            var normalizedPhoneDigits = phoneDigits || this.normalizePhone(phone);
            // If search is digits-only, check if it's contained in phone_digits
            if (searchDigits.length > 0) {
                return normalizedPhoneDigits.includes(searchDigits) || phone.includes(searchTerm);
            }
            // Otherwise check if search term is in phone
            return phone.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });
    /**
     * Tokenize search term for multi-word address matching
     */
    Object.defineProperty(SearchUtils, "tokenizeSearch", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (searchTerm) {
            return searchTerm.toLowerCase().split(/\s+/).filter(function (token) { return token.length > 0; });
        }
    });
    /**
     * Check if search term matches address fields
     */
    Object.defineProperty(SearchUtils, "matchAddress", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (searchTerm, address, city, state, zip) {
            if (!searchTerm)
                return false;
            var tokens = this.tokenizeSearch(searchTerm);
            var addressFields = [address, city, state, zip].filter(Boolean).map(function (field) { return field.toLowerCase(); });
            if (tokens.length > 1) {
                // Multi-word search: each token must match at least one field
                return tokens.every(function (token) {
                    return addressFields.some(function (field) { return field.includes(token); });
                });
            }
            else {
                // Single word search
                return addressFields.some(function (field) { return field.includes(searchTerm.toLowerCase()); });
            }
        }
    });
    /**
     * Calculate relevance score for search result
     */
    Object.defineProperty(SearchUtils, "calculateRelevance", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (searchTerm, customer) {
            var _a, _b, _c, _d;
            var searchLower = searchTerm.toLowerCase();
            var matchedFields = [];
            var relevance = 0;
            var matchType = 'fuzzy';
            // Phone number matching (highest priority for digits)
            if (this.matchPhone(searchTerm, customer.phone, customer.phone_digits)) {
                matchedFields.push('phone');
                relevance += 100;
                if (customer.phone.toLowerCase().includes(searchLower)) {
                    matchType = 'exact';
                    relevance += 50;
                }
            }
            // Name matching (high priority)
            if ((_a = customer.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchLower)) {
                matchedFields.push('name');
                relevance += 80;
                if (customer.name.toLowerCase() === searchLower) {
                    matchType = 'exact';
                    relevance += 40;
                }
            }
            // Address matching
            if (this.matchAddress(searchTerm, customer.address, customer.city, customer.state, customer.zip_code)) {
                matchedFields.push('address');
                relevance += 60;
            }
            // Email matching
            if ((_b = customer.email) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchLower)) {
                matchedFields.push('email');
                relevance += 40;
                if (customer.email.toLowerCase() === searchLower) {
                    matchType = 'exact';
                    relevance += 20;
                }
            }
            // Status matching
            if ((_c = customer.status) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(searchLower)) {
                matchedFields.push('status');
                relevance += 30;
            }
            // Account type matching
            if ((_d = customer.account_type) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes(searchLower)) {
                matchedFields.push('account_type');
                relevance += 30;
            }
            return {
                customer: customer,
                relevance: relevance,
                matchType: matchType,
                matchedFields: matchedFields
            };
        }
    });
    /**
     * Perform enhanced search on customer data
     */
    Object.defineProperty(SearchUtils, "searchCustomers", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (customers, searchTerm) {
            if (!searchTerm.trim()) {
                return customers.map(function (customer) { return ({
                    customer: customer,
                    relevance: 0,
                    matchType: 'fuzzy',
                    matchedFields: []
                }); });
            }
            var results = [];
            for (var _i = 0, customers_1 = customers; _i < customers_1.length; _i++) {
                var customer = customers_1[_i];
                var result = this.calculateRelevance(searchTerm, customer);
                if (result.relevance > 0) {
                    results.push(result);
                }
            }
            // Sort by relevance (highest first)
            return results.sort(function (a, b) { return b.relevance - a.relevance; });
        }
    });
    /**
     * Build Supabase search query for server-side filtering
     */
    Object.defineProperty(SearchUtils, "buildSearchQuery", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (searchTerm) {
            if (!searchTerm.trim())
                return '';
            var phoneDigits = searchTerm.replace(/\D/g, '');
            var query = "name.ilike.%".concat(searchTerm, "%,email.ilike.%").concat(searchTerm, "%");
            // Enhanced phone search
            if (phoneDigits.length > 0) {
                query += ",phone.ilike.%".concat(searchTerm, "%,phone.ilike.%").concat(phoneDigits, "%");
            }
            else {
                query += ",phone.ilike.%".concat(searchTerm, "%");
            }
            // Enhanced address search with tokenization
            var tokens = this.tokenizeSearch(searchTerm);
            if (tokens.length > 1) {
                tokens.forEach(function (token) {
                    query += ",address.ilike.%".concat(token, "%,city.ilike.%").concat(token, "%,state.ilike.%").concat(token, "%,zip_code.ilike.%").concat(token, "%");
                });
            }
            else {
                query += ",address.ilike.%".concat(searchTerm, "%,city.ilike.%").concat(searchTerm, "%,state.ilike.%").concat(searchTerm, "%,zip_code.ilike.%").concat(searchTerm, "%");
            }
            // Additional fields
            query += ",account_type.ilike.%".concat(searchTerm, "%,status.ilike.%").concat(searchTerm, "%");
            return query;
        }
    });
    return SearchUtils;
}());
exports.SearchUtils = SearchUtils;
