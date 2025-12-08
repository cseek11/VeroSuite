/* eslint-env node */
/* eslint-disable no-undef */
// Test-only supabase helper
import { createClient } from '@supabase/supabase-js';

// This will help us test the connection without the full app
const testSupabaseConnection = async () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('Testing Supabase connection...');
  console.log('URL:', supabaseUrl);
  console.log('Key exists:', !!supabaseKey);
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Test 1: Check if we can connect
    console.log('Test 1: Checking connection...');
    const { data, error } = await supabase.from('jobs').select('count').limit(1);
    console.log('Connection test result:', { data, error });
    
    // Test 2: Check if we can see the table structure
    console.log('Test 2: Checking table structure...');
    const { data: structure, error: structureError } = await supabase
      .from('jobs')
      .select('*')
      .limit(1);
    console.log('Structure test result:', { structure, structureError });
    
    // Test 3: Check RLS policies
    console.log('Test 3: Checking RLS...');
    const { data: rlsTest, error: rlsError } = await supabase
      .from('jobs')
      .select('id, tenant_id')
      .limit(1);
    console.log('RLS test result:', { rlsTest, rlsError });
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

export { testSupabaseConnection };


