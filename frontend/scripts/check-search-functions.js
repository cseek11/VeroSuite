// ============================================================================
// CHECK AVAILABLE SEARCH FUNCTIONS
// ============================================================================
// Script to check what search functions are available in the database

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSearchFunctions() {
  console.log('🔍 Checking Available Search Functions...\n');
  
  try {
    // Test 1: Check if search_customers_enhanced exists
    console.log('1️⃣ Testing search_customers_enhanced function...');
    const { data: enhancedResults, error: enhancedError } = await supabase
      .rpc('search_customers_enhanced', {
        p_search_term: 'test',
        p_tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
        p_limit: 5
      });
    
    if (enhancedError) {
      console.log('❌ search_customers_enhanced failed:', enhancedError.message);
    } else {
      console.log('✅ search_customers_enhanced working');
      console.log(`   Found ${enhancedResults?.length || 0} results`);
    }
    
    // Test 2: Check if simple search function exists
    console.log('\n2️⃣ Testing simple search function...');
    const { data: simpleResults, error: simpleError } = await supabase
      .rpc('search_customers_simple', {
        p_search_term: 'test',
        p_tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
        p_limit: 5
      });
    
    if (simpleError) {
      console.log('❌ search_customers_simple failed:', simpleError.message);
    } else {
      console.log('✅ search_customers_simple working');
      console.log(`   Found ${simpleResults?.length || 0} results`);
    }
    
    // Test 3: Check if vector search function exists
    console.log('\n3️⃣ Testing vector search function...');
    const { data: vectorResults, error: vectorError } = await supabase
      .rpc('search_customers_vector', {
        p_embedding: 'test',
        p_tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
        p_limit: 5,
        p_similarity_threshold: 0.7
      });
    
    if (vectorError) {
      console.log('❌ search_customers_vector failed:', vectorError.message);
    } else {
      console.log('✅ search_customers_vector working');
      console.log(`   Found ${vectorResults?.length || 0} results`);
    }
    
    // Test 4: Check direct table access
    console.log('\n4️⃣ Testing direct table access...');
    const { data: tableResults, error: tableError } = await supabase
      .from('accounts')
      .select('id, name, email, phone')
      .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
      .limit(5);
    
    if (tableError) {
      console.log('❌ Direct table access failed:', tableError.message);
    } else {
      console.log('✅ Direct table access working');
      console.log(`   Found ${tableResults?.length || 0} accounts`);
      if (tableResults?.length > 0) {
        console.log(`   First account: ${tableResults[0].name}`);
      }
    }
    
    // Test 5: Check search columns
    console.log('\n5️⃣ Checking search columns...');
    const { data: columnResults, error: columnError } = await supabase
      .from('accounts')
      .select('id, name, search_vector, name_trigram, address_trigram, phone_digits')
      .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
      .limit(1);
    
    if (columnError) {
      console.log('❌ Search columns check failed:', columnError.message);
    } else {
      console.log('✅ Search columns check working');
      if (columnResults?.length > 0) {
        const account = columnResults[0];
        console.log(`   search_vector: ${account.search_vector ? 'exists' : 'null'}`);
        console.log(`   name_trigram: ${account.name_trigram ? 'exists' : 'null'}`);
        console.log(`   address_trigram: ${account.address_trigram ? 'exists' : 'null'}`);
        console.log(`   phone_digits: ${account.phone_digits ? 'exists' : 'null'}`);
      }
    }
    
    console.log('\n🎯 SEARCH FUNCTIONS SUMMARY:');
    console.log(`   Enhanced search: ${enhancedError ? '❌' : '✅'}`);
    console.log(`   Simple search: ${simpleError ? '❌' : '✅'}`);
    console.log(`   Vector search: ${vectorError ? '❌' : '✅'}`);
    console.log(`   Direct table access: ${tableError ? '❌' : '✅'}`);
    console.log(`   Search columns: ${columnError ? '❌' : '✅'}`);
    
  } catch (error) {
    console.error('❌ Check failed:', error);
  }
}

// Run the check
checkSearchFunctions();







