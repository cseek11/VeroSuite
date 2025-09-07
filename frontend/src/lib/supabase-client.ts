// ============================================================================
// SHARED SUPABASE CLIENT
// ============================================================================
// Single, shared Supabase client instance for all services

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

// Create single, shared instance
export const supabase = createClient(supabaseUrl, supabasePublishableKey);

// Export the client for use in other services
export default supabase;



