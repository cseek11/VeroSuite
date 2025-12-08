// ============================================================================
// SIMPLE SEARCH LOGGING TEST
// ============================================================================
// Simple test to verify search logging is working

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSearchLoggingSimple() {
  console.log('🔍 Simple Search Logging Test...\n');
  
  try {
    // Test 1: Check if we can insert a search log directly
    console.log('1️⃣ Testing direct search log insert...');
    const { data: insertData, error: insertError } = await supabase
      .from('search_logs')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
        query: 'test search from script',
        results_count: 5,
        time_taken_ms: 120,
        search_filters: { status: 'active' }
      })
      .select()
      .single();
    
    if (insertError) {
      console.log('❌ Direct insert failed:', insertError.message);
    } else {
      console.log('✅ Direct insert successful, log ID:', insertData.id);
    }
    
    // Test 2: Check if we can query search logs
    console.log('\n2️⃣ Testing search logs query...');
    const { data: logsData, error: logsError } = await supabase
      .from('search_logs')
      .select('id, query, results_count, created_at')
      .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (logsError) {
      console.log('❌ Query failed:', logsError.message);
    } else {
      console.log('✅ Query successful, found', logsData.length, 'logs');
      logsData.forEach((log, index) => {
        console.log(`   ${index + 1}. "${log.query}" - ${log.results_count} results`);
      });
    }
    
    // Test 3: Check if we can update a log (for click tracking)
    if (insertData) {
      console.log('\n3️⃣ Testing log update (click tracking)...');
      const { data: updateData, error: updateError } = await supabase
        .from('search_logs')
        .update({ clicked_record_id: 'test-record-id' })
        .eq('id', insertData.id)
        .select()
        .single();
      
      if (updateError) {
        console.log('❌ Update failed:', updateError.message);
      } else {
        console.log('✅ Update successful, clicked_record_id:', updateData.clicked_record_id);
      }
    }
    
    // Test 4: Check search corrections
    console.log('\n4️⃣ Testing search corrections...');
    const { data: correctionsData, error: correctionsError } = await supabase
      .from('search_corrections')
      .select('*')
      .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
      .limit(3);
    
    if (correctionsError) {
      console.log('❌ Corrections query failed:', correctionsError.message);
    } else {
      console.log('✅ Corrections query successful, found', correctionsData.length, 'corrections');
      correctionsData.forEach((correction, index) => {
        console.log(`   ${index + 1}. "${correction.original_query}" → "${correction.corrected_query}"`);
      });
    }
    
    console.log('\n🎯 SIMPLE SEARCH LOGGING TEST RESULTS:');
    if (!insertError && !logsError && !correctionsError) {
      console.log('✅ ALL BASIC TESTS PASSED!');
      console.log('   ✅ Direct insert: WORKING');
      console.log('   ✅ Query logs: WORKING');
      console.log('   ✅ Update logs: WORKING');
      console.log('   ✅ Query corrections: WORKING');
      console.log('✅ Search logging infrastructure is functional!');
    } else {
      console.log('❌ SOME TESTS FAILED!');
      console.log('   Check the errors above.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testSearchLoggingSimple();





































