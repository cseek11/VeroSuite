// ============================================================================
// ENHANCED SEARCH TEST SCRIPT (FIXED VERSION)
// ============================================================================
// Tests the fixed enhanced search functionality with logging and relevance ranking

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEnhancedSearchFixed() {
  try {
    console.log('🚀 Testing Enhanced Search Functionality (Fixed Version)...\n');
    
    // Test 1: Check if search_logs table exists
    console.log('1️⃣ Checking search_logs table...');
    const { data: logs, error: logsError } = await supabase
      .from('search_logs')
      .select('*')
      .limit(1);
    
    if (logsError) {
      console.log('❌ search_logs table not found:', logsError.message);
    } else {
      console.log('✅ search_logs table exists');
    }
    console.log('');
    
    // Test 2: Check if search_corrections table exists
    console.log('2️⃣ Checking search_corrections table...');
    const { data: corrections, error: correctionsError } = await supabase
      .from('search_corrections')
      .select('*')
      .limit(5);
    
    if (correctionsError) {
      console.log('❌ search_corrections table not found:', correctionsError.message);
    } else {
      console.log('✅ search_corrections table exists');
      console.log(`   Found ${corrections.length} initial corrections:`);
      corrections.forEach(c => {
        console.log(`   - "${c.original_query}" → "${c.corrected_query}" (confidence: ${c.confidence_score})`);
      });
    }
    console.log('');
    
    // Test 3: Test the new search function with relevance ranking
    console.log('3️⃣ Testing new search function with relevance ranking...');
    const testSearches = [
      { query: '5551234', expected: 'Should find John Smith with phone priority' },
      { query: 'john', expected: 'Should find John Smith with name priority' },
      { query: '321 oak', expected: 'Should find Robert Brown with address priority' },
      { query: '234', expected: 'Should find both customers but rank by relevance' }
    ];
    
    for (const test of testSearches) {
      console.log(`   Testing: "${test.query}"`);
      console.log(`   Expected: ${test.expected}`);
      
      const startTime = performance.now();
      
      // Use the new search function
      const { data: results, error } = await supabase.rpc('search_customers_with_relevance', {
        p_search_term: test.query,
        p_tenant_id: 'fb39f15b-b382-4525-8404-1e32ca1486c9'
      });
      
      const endTime = performance.now();
      const timeTakenMs = Math.round(endTime - startTime);
      
      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
      } else {
        console.log(`   ✅ Found ${results.length} results (${timeTakenMs}ms):`);
        results.forEach((customer, index) => {
          console.log(`      ${index + 1}. ${customer.name} - ${customer.phone} - ${customer.address}, ${customer.city} (relevance: ${customer.relevance_score})`);
        });
      }
      console.log('');
    }
    
    // Test 4: Test search logging function
    console.log('4️⃣ Testing search logging function...');
    try {
      const testLogData = {
        p_user_id: '00000000-0000-0000-0000-000000000000',
        p_tenant_id: 'fb39f15b-b382-4525-8404-1e32ca1486c9',
        p_query: 'test search fixed',
        p_results_count: 2,
        p_time_taken_ms: 150,
        p_clicked_record_id: null,
        p_search_filters: { status: 'active' }
      };
      
      const { data: logResult, error: logError } = await supabase.rpc('log_search', testLogData);
      
      if (logError) {
        console.log('❌ Search logging failed:', logError.message);
      } else {
        console.log('✅ Search logging successful');
        console.log(`   Log ID: ${logResult}`);
      }
    } catch (error) {
      console.log('❌ Search logging error:', error.message);
    }
    console.log('');
    
    // Test 5: Test search analytics function
    console.log('5️⃣ Testing search analytics function...');
    try {
      const { data: analytics, error: analyticsError } = await supabase.rpc('get_search_analytics', {
        p_tenant_id: 'fb39f15b-b382-4525-8404-1e32ca1486c9',
        p_days_back: 30
      });
      
      if (analyticsError) {
        console.log('❌ Search analytics failed:', analyticsError.message);
      } else {
        console.log('✅ Search analytics successful:');
        console.log(`   Total searches: ${analytics.total_searches || 0}`);
        console.log(`   Average results: ${analytics.avg_results_count || 0}`);
        console.log(`   Average time: ${analytics.avg_time_taken_ms || 0}ms`);
        console.log(`   Click-through rate: ${analytics.click_through_rate || 0}%`);
      }
    } catch (error) {
      console.log('❌ Search analytics error:', error.message);
    }
    console.log('');
    
    console.log('🎉 Enhanced search testing completed!');
    
  } catch (error) {
    console.error('❌ Error testing enhanced search:', error);
  }
}

// Run the test
testEnhancedSearchFixed();





























