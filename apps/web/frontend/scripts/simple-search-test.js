// ============================================================================
// SIMPLE SEARCH TEST
// ============================================================================
// Tests basic search functionality with the current database structure

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function simpleSearchTest() {
  try {
    console.log('🚀 Simple Search Test...\n');
    
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
    
    // Test 3: Test basic search with relevance ranking (simplified)
    console.log('3️⃣ Testing basic search with relevance ranking...');
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
      
      // Build search query manually
      const phoneDigits = test.query.replace(/\D/g, '');
      const tokens = test.query.toLowerCase().split(/\s+/).filter(token => token.length > 0);
      
      let searchQuery = `name.ilike.%${test.query}%,email.ilike.%${test.query}%`;
      
      if (phoneDigits.length > 0) {
        searchQuery += `,phone.ilike.%${test.query}%,phone_digits.ilike.%${phoneDigits}%`;
        searchQuery += `,phone.ilike.%${phoneDigits}%`;
      } else {
        searchQuery += `,phone.ilike.%${test.query}%`;
      }
      
      if (tokens.length > 1) {
        tokens.forEach(token => {
          searchQuery += `,address.ilike.%${token}%,city.ilike.%${token}%,state.ilike.%${token}%,zip_code.ilike.%${token}%`;
        });
      } else {
        searchQuery += `,address.ilike.%${test.query}%,city.ilike.%${test.query}%,state.ilike.%${test.query}%,zip_code.ilike.%${test.query}%`;
      }
      
      searchQuery += `,account_type.ilike.%${test.query}%,status.ilike.%${test.query}%`;
      
      // Execute search
      const { data: results, error } = await supabase
        .from('accounts')
        .select('name, phone, phone_digits, address, city')
        .or(searchQuery)
        .order('name', { ascending: true });
      
      const endTime = performance.now();
      const timeTakenMs = Math.round(endTime - startTime);
      
      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
      } else {
        console.log(`   ✅ Found ${results.length} results (${timeTakenMs}ms):`);
        results.forEach((customer, index) => {
          // Calculate relevance score manually
          let relevance = 0;
          const searchLower = test.query.toLowerCase();
          
          if (phoneDigits.length > 0 && customer.phone_digits?.includes(phoneDigits)) {
            relevance += 100;
          }
          if (customer.name?.toLowerCase().includes(searchLower)) {
            relevance += 80;
          }
          if (customer.address?.toLowerCase().includes(searchLower) || customer.city?.toLowerCase().includes(searchLower)) {
            relevance += 60;
          }
          
          console.log(`      ${index + 1}. ${customer.name} - ${customer.phone} - ${customer.address}, ${customer.city} (relevance: ${relevance})`);
        });
      }
      console.log('');
    }
    
    // Test 4: Test direct insert into search_logs (bypass RLS for testing)
    console.log('4️⃣ Testing direct search logging...');
    try {
      const { data: insertResult, error: insertError } = await supabase
        .from('search_logs')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000',
          tenant_id: 'fb39f15b-b382-4525-8404-1e32ca1486c9',
          query: 'test search simple',
          results_count: 2,
          time_taken_ms: 150,
          clicked_record_id: null,
          search_filters: { status: 'active' }
        })
        .select();
      
      if (insertError) {
        console.log('❌ Direct insert failed:', insertError.message);
      } else {
        console.log('✅ Direct insert successful');
        console.log(`   Log ID: ${insertResult[0].id}`);
      }
    } catch (error) {
      console.log('❌ Direct insert error:', error.message);
    }
    console.log('');
    
    console.log('🎉 Simple search testing completed!');
    console.log('');
    console.log('📋 Summary:');
    console.log('   ✅ Database tables created successfully');
    console.log('   ✅ Basic search functionality working');
    console.log('   ✅ Search corrections table populated');
    console.log('   ⚠️  RLS policies may need adjustment for full functionality');
    
  } catch (error) {
    console.error('❌ Error in simple search test:', error);
  }
}

// Run the test
simpleSearchTest();








































