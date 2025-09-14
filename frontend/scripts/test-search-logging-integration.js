// ============================================================================
// TEST SEARCH LOGGING INTEGRATION
// ============================================================================
// Test script to verify search logging functionality is working

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSearchLoggingIntegration() {
  console.log('🔍 Testing Search Logging Integration...\n');
  
  try {
    // Test 1: Check if search_logs table exists and is accessible
    console.log('1️⃣ Checking search_logs table...');
    const { data: logsData, error: logsError } = await supabase
      .from('search_logs')
      .select('*')
      .limit(1);
    
    if (logsError) {
      console.log('❌ search_logs table error:', logsError.message);
      return;
    }
    console.log('✅ search_logs table accessible');
    
    // Test 2: Check if search_corrections table exists and is accessible
    console.log('\n2️⃣ Checking search_corrections table...');
    const { data: correctionsData, error: correctionsError } = await supabase
      .from('search_corrections')
      .select('*')
      .limit(1);
    
    if (correctionsError) {
      console.log('❌ search_corrections table error:', correctionsError.message);
      return;
    }
    console.log('✅ search_corrections table accessible');
    
    // Test 3: Check if log_search_query function exists
    console.log('\n3️⃣ Testing log_search_query function...');
    const { data: logResult, error: logError } = await supabase
      .rpc('log_search_query', {
        p_user_id: '00000000-0000-0000-0000-000000000000', // Test UUID
        p_tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28', // Test tenant
        p_query: 'test search query',
        p_results_count: 5,
        p_time_taken_ms: 150,
        p_search_filters: { status: 'active' }
      });
    
    if (logError) {
      console.log('❌ log_search_query function error:', logError.message);
    } else {
      console.log('✅ log_search_query function working, log ID:', logResult);
    }
    
    // Test 4: Check if get_search_analytics function exists
    console.log('\n4️⃣ Testing get_search_analytics function...');
    const { data: analyticsResult, error: analyticsError } = await supabase
      .rpc('get_search_analytics', {
        p_tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
        p_days_back: 30
      });
    
    if (analyticsError) {
      console.log('❌ get_search_analytics function error:', analyticsError.message);
    } else {
      console.log('✅ get_search_analytics function working');
      console.log('   Analytics data:', analyticsResult[0]);
    }
    
    // Test 5: Check if get_user_tenant_id function exists (for authentication)
    console.log('\n5️⃣ Testing get_user_tenant_id function...');
    const { data: tenantResult, error: tenantError } = await supabase
      .rpc('get_user_tenant_id', {
        user_email: 'admin@veropestsolutions.com'
      });
    
    if (tenantError) {
      console.log('❌ get_user_tenant_id function error:', tenantError.message);
    } else {
      console.log('✅ get_user_tenant_id function working, tenant ID:', tenantResult);
    }
    
    // Test 6: Check current search logs count
    console.log('\n6️⃣ Checking current search logs...');
    const { data: currentLogs, error: currentLogsError } = await supabase
      .from('search_logs')
      .select('id, query, results_count, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (currentLogsError) {
      console.log('❌ Error fetching current logs:', currentLogsError.message);
    } else {
      console.log('✅ Current search logs:');
      currentLogs.forEach((log, index) => {
        console.log(`   ${index + 1}. "${log.query}" - ${log.results_count} results (${log.created_at})`);
      });
    }
    
    // Test 7: Check current search corrections
    console.log('\n7️⃣ Checking current search corrections...');
    const { data: currentCorrections, error: currentCorrectionsError } = await supabase
      .from('search_corrections')
      .select('*')
      .order('confidence_score', { ascending: false })
      .limit(5);
    
    if (currentCorrectionsError) {
      console.log('❌ Error fetching current corrections:', currentCorrectionsError.message);
    } else {
      console.log('✅ Current search corrections:');
      currentCorrections.forEach((correction, index) => {
        console.log(`   ${index + 1}. "${correction.original_query}" → "${correction.corrected_query}" (${correction.confidence_score})`);
      });
    }
    
    console.log('\n🎯 SEARCH LOGGING INTEGRATION TEST RESULTS:');
    if (logsData !== null && correctionsData !== null && !logError && !analyticsError && !tenantError) {
      console.log('✅ ALL TESTS PASSED!');
      console.log('   ✅ search_logs table: ACCESSIBLE');
      console.log('   ✅ search_corrections table: ACCESSIBLE');
      console.log('   ✅ log_search_query function: WORKING');
      console.log('   ✅ get_search_analytics function: WORKING');
      console.log('   ✅ get_user_tenant_id function: WORKING');
      console.log('✅ Search logging integration is ready!');
    } else {
      console.log('❌ SOME TESTS FAILED!');
      console.log('   Check the errors above and fix the database functions.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testSearchLoggingIntegration();















