"use strict";
// ============================================================================
// SHARED SUPABASE CLIENT
// ============================================================================
// Single, shared Supabase client instance for all services
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
var logger_1 = require("@/utils/logger");
// Initialize Supabase client
var supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
var supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!supabaseUrl || !supabasePublishableKey) {
    logger_1.logger.error('Missing Supabase environment variables', {}, 'supabase-client');
    throw new Error('Missing Supabase environment variables');
}
// Create single, shared instance
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabasePublishableKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true
    },
    global: {
        headers: {
            apikey: supabasePublishableKey,
            Authorization: "Bearer ".concat(supabasePublishableKey)
        }
    }
});
// Export the client for use in other services
exports.default = exports.supabase;
