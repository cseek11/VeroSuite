"use strict";
// ============================================================================
// LEGACY API FUNCTIONS (DEPRECATED)
// ============================================================================
// This file is deprecated. All functionality has been moved to enhanced-api.ts
// to prevent multiple Supabase client instances and provide better type safety.
Object.defineProperty(exports, "__esModule", { value: true });
exports.showDeprecationWarning = exports.DEPRECATED_API_NOTICE = void 0;
// IMPORTANT: Do not use this file for new development.
// Use enhanced-api.ts instead for all database operations.
exports.DEPRECATED_API_NOTICE = "\nThis API file is deprecated and should not be used.\n\nPlease use the following instead:\n- enhanced-api.ts for all database operations\n- secure-api-client.ts for secure operations with tenant isolation\n\nAll mock data and functions have been removed.\n";
var logger_1 = require("@/utils/logger");
// Export a warning function to help developers migrate
var showDeprecationWarning = function () {
    logger_1.logger.warn('DEPRECATED: api.ts is no longer supported. Use enhanced-api.ts instead.', {}, 'api');
    logger_1.logger.warn('DEPRECATED API NOTICE', { notice: exports.DEPRECATED_API_NOTICE }, 'api');
};
exports.showDeprecationWarning = showDeprecationWarning;
