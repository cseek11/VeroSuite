// ============================================================================
// SHARED SUPABASE CLIENT
// ============================================================================
// Single, shared Supabase client instance for all services

import { createClient } from '@supabase/supabase-js';
import { logger } from '@/utils/logger';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  logger.error('Missing Supabase environment variables', {}, 'supabase-client');
  throw new Error('Missing Supabase environment variables');
}

// Create single, shared instance
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  global: {
    headers: {
      apikey: supabasePublishableKey,
      Authorization: `Bearer ${supabasePublishableKey}`
    }
  }
});

// Export the client for use in other services
export default supabase;



