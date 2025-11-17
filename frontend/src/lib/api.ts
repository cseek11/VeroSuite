// ============================================================================
// LEGACY API FUNCTIONS (DEPRECATED)
// ============================================================================
// This file is deprecated. All functionality has been moved to enhanced-api.ts
// to prevent multiple Supabase client instances and provide better type safety.

// IMPORTANT: Do not use this file for new development.
// Use enhanced-api.ts instead for all database operations.

export const DEPRECATED_API_NOTICE = `
This API file is deprecated and should not be used.

Please use the following instead:
- enhanced-api.ts for all database operations
- secure-api-client.ts for secure operations with tenant isolation

All mock data and functions have been removed.
`;

import { logger } from '@/utils/logger';

// Export a warning function to help developers migrate
export const showDeprecationWarning = () => {
  logger.warn('DEPRECATED: api.ts is no longer supported. Use enhanced-api.ts instead.', {}, 'api');
  logger.warn('DEPRECATED API NOTICE', { notice: DEPRECATED_API_NOTICE }, 'api');
};