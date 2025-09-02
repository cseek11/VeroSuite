// ============================================================================
// TEST DATABASE FUNCTION
// ============================================================================
// Simple script to test if the search_customers_multi_word function exists

import { createClient } from '@supabase/supabase-js';

// Get environment variables from process.env
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  console.log('💡 You can set them manually in your terminal:');
  console.log('   $env:VITE_SUPABASE_URL="your-url"');
  console.log('   $env:VITE_SUPABASE_ANON_KEY="your-key"');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseFunction() {
  try {
    console.log('🔍 Testing database function...');
    
    // Test 1: Check authentication
    console.log('\n📋 Test 1: Checking authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('⚠️  Not authenticated, trying anonymous access...');
    } else if (user) {
      console.log('✅ Authenticated as:', user.email);
    } else {
      console.log('ℹ️  No user session, using anonymous access');
    }
    
    // Test 2: Try to call the function
    console.log('\n📋 Test 2: Testing function call...');
    const { data: result, error } = await supabase.rpc('search_customers_multi_word', {
      p_search_term: 'test',
      p_tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
      p_limit: 5,
      p_offset: 0
    });
    
    if (error) {
      console.log('❌ Function call failed:', error.message);
      console.log('🔧 This means the function needs to be deployed to your database');
      return false;
    } else {
      console.log('✅ Function call successful!');
      console.log('📊 Results:', result ? result.length : 0, 'items');
      return true;
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting database function test...\n');
  
  const success = await testDatabaseFunction();
  
  if (success) {
    console.log('\n🎉 Database function is working correctly!');
    console.log('✅ The search should now work in your app');
  } else {
    console.log('\n🔧 Database function needs to be deployed');
    console.log('📝 Please run the SQL from search-performance-optimization.sql in your Supabase SQL Editor');
  }
}

// Add timeout to prevent hanging
const timeout = setTimeout(() => {
  console.log('⏰ Test timed out after 10 seconds');
  process.exit(1);
}, 10000);

main()
  .then(() => {
    clearTimeout(timeout);
    process.exit(0);
  })
  .catch((error) => {
    clearTimeout(timeout);
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
