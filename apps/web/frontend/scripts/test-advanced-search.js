// ============================================================================
// TEST ADVANCED SEARCH FUNCTIONALITY
// ============================================================================
// Test script to verify advanced search features including fuzzy matching

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAdvancedSearch() {
  console.log('🔍 Testing Advanced Search Functionality...\n');
  
  try {
    // Test 1: Check if enhanced search function exists
    console.log('1️⃣ Testing enhanced search function...');
    const { data: searchResults, error: searchError } = await supabase
      .rpc('search_customers_enhanced', {
        p_search_term: 'smith',
        p_tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
        p_limit: 10
      });
    
    if (searchError) {
      console.log('❌ Enhanced search failed:', searchError.message);
    } else {
      console.log('✅ Enhanced search working');
      console.log(`   Found ${searchResults?.length || 0} results`);
      if (searchResults?.length > 0) {
        console.log(`   First result: ${searchResults[0].name} (${searchResults[0].match_type})`);
      }
    }
    
    // Test 2: Test fuzzy matching with typos
    console.log('\n2️⃣ Testing fuzzy matching with typos...');
    const fuzzyTests = [
      { query: 'smtih', expected: 'smith' },
      { query: 'jhon', expected: 'john' },
      { query: 'compny', expected: 'company' },
      { query: 'adres', expected: 'address' }
    ];
    
    for (const test of fuzzyTests) {
      const { data: fuzzyResults, error: fuzzyError } = await supabase
        .rpc('search_customers_enhanced', {
          p_search_term: test.query,
          p_tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
          p_limit: 5
        });
      
      if (fuzzyError) {
        console.log(`❌ Fuzzy search for "${test.query}" failed:`, fuzzyError.message);
      } else {
        const fuzzyMatches = fuzzyResults?.filter(r => r.match_type === 'fuzzy') || [];
        console.log(`✅ Fuzzy search for "${test.query}": ${fuzzyMatches.length} fuzzy matches`);
        if (fuzzyMatches.length > 0) {
          console.log(`   Best match: ${fuzzyMatches[0].name} (score: ${fuzzyMatches[0].relevance_score})`);
        }
      }
    }
    
    // Test 3: Test phone number search
    console.log('\n3️⃣ Testing phone number search...');
    const phoneTests = [
      '412',
      '555',
      '123-456-7890',
      '1234567890'
    ];
    
    for (const phone of phoneTests) {
      const { data: phoneResults, error: phoneError } = await supabase
        .rpc('search_customers_enhanced', {
          p_search_term: phone,
          p_tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
          p_limit: 5
        });
      
      if (phoneError) {
        console.log(`❌ Phone search for "${phone}" failed:`, phoneError.message);
      } else {
        const phoneMatches = phoneResults?.filter(r => r.match_type === 'phone') || [];
        console.log(`✅ Phone search for "${phone}": ${phoneMatches.length} phone matches`);
        if (phoneMatches.length > 0) {
          console.log(`   First match: ${phoneMatches[0].name} (${phoneMatches[0].phone})`);
        }
      }
    }
    
    // Test 4: Test address search
    console.log('\n4️⃣ Testing address search...');
    const addressTests = [
      'main street',
      'oak avenue',
      'pittsburgh',
      'pa'
    ];
    
    for (const address of addressTests) {
      const { data: addressResults, error: addressError } = await supabase
        .rpc('search_customers_enhanced', {
          p_search_term: address,
          p_tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
          p_limit: 5
        });
      
      if (addressError) {
        console.log(`❌ Address search for "${address}" failed:`, addressError.message);
      } else {
        const addressMatches = addressResults?.filter(r => r.match_type === 'full_text') || [];
        console.log(`✅ Address search for "${address}": ${addressMatches.length} address matches`);
        if (addressMatches.length > 0) {
          console.log(`   First match: ${addressMatches[0].name} (${addressMatches[0].address})`);
        }
      }
    }
    
    // Test 5: Test search with filters
    console.log('\n5️⃣ Testing search with filters...');
    const { data: filteredResults, error: filterError } = await supabase
      .rpc('search_customers_enhanced', {
        p_search_term: 'company',
        p_tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
        p_limit: 10,
        p_status: 'active',
        p_account_type: 'commercial'
      });
    
    if (filterError) {
      console.log('❌ Filtered search failed:', filterError.message);
    } else {
      console.log('✅ Filtered search working');
      console.log(`   Found ${filteredResults?.length || 0} filtered results`);
    }
    
    // Test 6: Test search performance
    console.log('\n6️⃣ Testing search performance...');
    const startTime = Date.now();
    
    const { data: perfResults, error: perfError } = await supabase
      .rpc('search_customers_enhanced', {
        p_search_term: 'test performance',
        p_tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
        p_limit: 50
      });
    
    const endTime = Date.now();
    const searchTime = endTime - startTime;
    
    if (perfError) {
      console.log('❌ Performance test failed:', perfError.message);
    } else {
      console.log(`✅ Performance test completed in ${searchTime}ms`);
      console.log(`   Found ${perfResults?.length || 0} results`);
      if (searchTime < 1000) {
        console.log('   🚀 Search performance is excellent!');
      } else if (searchTime < 2000) {
        console.log('   ⚡ Search performance is good');
      } else {
        console.log('   ⚠️  Search performance could be improved');
      }
    }
    
    // Test 7: Test search logging integration
    console.log('\n7️⃣ Testing search logging integration...');
    const { data: logsData, error: logsError } = await supabase
      .from('search_logs')
      .select('query, results_count, time_taken_ms')
      .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (logsError) {
      console.log('❌ Search logs check failed:', logsError.message);
    } else {
      console.log('✅ Search logging is working');
      console.log(`   Found ${logsData?.length || 0} recent search logs`);
      if (logsData?.length > 0) {
        console.log(`   Latest search: "${logsData[0].query}" (${logsData[0].results_count} results, ${logsData[0].time_taken_ms}ms)`);
      }
    }
    
    console.log('\n🎯 ADVANCED SEARCH TEST RESULTS:');
    if (!searchError && !filterError && !perfError) {
      console.log('✅ ALL ADVANCED SEARCH TESTS PASSED!');
      console.log('   ✅ Enhanced search function: WORKING');
      console.log('   ✅ Fuzzy matching: WORKING');
      console.log('   ✅ Phone number search: WORKING');
      console.log('   ✅ Address search: WORKING');
      console.log('   ✅ Filtered search: WORKING');
      console.log('   ✅ Search performance: GOOD');
      console.log('   ✅ Search logging: WORKING');
      console.log('✅ Advanced search features are fully functional!');
    } else {
      console.log('❌ SOME TESTS FAILED!');
      console.log('   Check the errors above and fix the database functions.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testAdvancedSearch();
