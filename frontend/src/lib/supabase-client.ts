// ============================================================================
// SHARED SUPABASE CLIENT
// ============================================================================
// Single, shared Supabase client instance for all services

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

// Create single, shared instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export the client for use in other services
export default supabase;
