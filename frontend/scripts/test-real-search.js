// ============================================================================
// TEST REAL SEARCH FUNCTIONALITY
// ============================================================================
// Test the enhanced search function with actual search terms

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRealSearch() {
  try {
    console.log('🧪 Testing Real Search Functionality...\n');

    const tenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';

    // Test 1: Empty search (should return all customers)
    console.log('1️⃣ Testing empty search...');
    const { data: emptyResults, error: emptyError } = await supabase.rpc(
      'search_customers_enhanced',
      {
        p_search_term: '',
        p_tenant_id: tenantId,
        p_limit: 10,
        p_offset: 0
      }
    );

    if (emptyError) {
      console.log('❌ Empty search failed:', emptyError.message);
    } else {
      console.log('✅ Empty search successful:', emptyResults?.length || 0, 'results');
      console.log('   Results:', emptyResults?.map(r => `${r.name} (score: ${r.relevance_score}, type: ${r.match_type})`).join(', '));
    }

    // Test 2: Search for "John" (should find John Smith)
    console.log('\n2️⃣ Testing name search for "John"...');
    const { data: johnResults, error: johnError } = await supabase.rpc(
      'search_customers_enhanced',
      {
        p_search_term: 'John',
        p_tenant_id: tenantId,
        p_limit: 10,
        p_offset: 0
      }
    );

    if (johnError) {
      console.log('❌ John search failed:', johnError.message);
    } else {
      console.log('✅ John search successful:', johnResults?.length || 0, 'results');
      johnResults?.forEach(result => {
        console.log(`   - ${result.name} (score: ${result.relevance_score}, type: ${result.match_type})`);
      });
    }

    // Test 3: Search for "555" (should find customers with 555 in phone)
    console.log('\n3️⃣ Testing phone search for "555"...');
    const { data: phoneResults, error: phoneError } = await supabase.rpc(
      'search_customers_enhanced',
      {
        p_search_term: '555',
        p_tenant_id: tenantId,
        p_limit: 10,
        p_offset: 0
      }
    );

    if (phoneError) {
      console.log('❌ Phone search failed:', phoneError.message);
    } else {
      console.log('✅ Phone search successful:', phoneResults?.length || 0, 'results');
      phoneResults?.forEach(result => {
        console.log(`   - ${result.name} (phone: ${result.phone}, score: ${result.relevance_score}, type: ${result.match_type})`);
      });
    }

    // Test 4: Search for "Oak" (should find Robert Brown with Oak Avenue)
    console.log('\n4️⃣ Testing address search for "Oak"...');
    const { data: oakResults, error: oakError } = await supabase.rpc(
      'search_customers_enhanced',
      {
        p_search_term: 'Oak',
        p_tenant_id: tenantId,
        p_limit: 10,
        p_offset: 0
      }
    );

    if (oakError) {
      console.log('❌ Oak search failed:', oakError.message);
    } else {
      console.log('✅ Oak search successful:', oakResults?.length || 0, 'results');
      oakResults?.forEach(result => {
        console.log(`   - ${result.name} (address: ${result.address}, score: ${result.relevance_score}, type: ${result.match_type})`);
      });
    }

    // Test 5: Search for "Downtown" (should find Downtown Office Complex)
    console.log('\n5️⃣ Testing specific name search for "Downtown"...');
    const { data: downtownResults, error: downtownError } = await supabase.rpc(
      'search_customers_enhanced',
      {
        p_search_term: 'Downtown',
        p_tenant_id: tenantId,
        p_limit: 10,
        p_offset: 0
      }
    );

    if (downtownError) {
      console.log('❌ Downtown search failed:', downtownError.message);
    } else {
      console.log('✅ Downtown search successful:', downtownResults?.length || 0, 'results');
      downtownResults?.forEach(result => {
        console.log(`   - ${result.name} (score: ${result.relevance_score}, type: ${result.match_type})`);
      });
    }

    console.log('\n🎉 Real search testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testRealSearch();








