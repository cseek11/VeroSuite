// ============================================================================
// VERIFY SCHEMA FIX
// ============================================================================
// Test that the schema changes fixed the function issues

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifySchemaFix() {
  try {
    console.log('🔍 Verifying Schema Fix...\n');

    const tenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';

    // Test 1: Check if the function now works
    console.log('1️⃣ Testing the fixed search function...');
    const { data: funcResults, error: funcError } = await supabase.rpc(
      'search_customers_enhanced',
      {
        p_search_term: '',
        p_tenant_id: tenantId,
        p_limit: 5,
        p_offset: 0
      }
    );

    if (funcError) {
      console.log('❌ Function still failing:', funcError.message);
      console.log('   Error details:', funcError);
    } else {
      console.log('✅ Function working! Results:', funcResults?.length || 0);
      if (funcResults?.length > 0) {
        console.log('   First result:', funcResults[0].name);
        console.log('   Column types match:', {
          name: typeof funcResults[0].name,
          email: typeof funcResults[0].email,
          phone: typeof funcResults[0].phone,
          address: typeof funcResults[0].address
        });
      }
    }

    // Test 2: Test search functionality
    console.log('\n2️⃣ Testing search with the function...');
    const { data: searchResults, error: searchError } = await supabase.rpc(
      'search_customers_enhanced',
      {
        p_search_term: 'john',
        p_tenant_id: tenantId,
        p_limit: 5,
        p_offset: 0
      }
    );

    if (searchError) {
      console.log('❌ Search still failing:', searchError.message);
    } else {
      console.log('✅ Search working! Results:', searchResults?.length || 0);
      if (searchResults?.length > 0) {
        console.log('   Search result:', searchResults[0].name);
      }
    }

    // Test 3: Verify direct query still works (backup)
    console.log('\n3️⃣ Verifying direct query still works...');
    const { data: directResults, error: directError } = await supabase
      .from('accounts')
      .select('id, name, email, phone, address, city, state, zip_code, status, account_type, created_at, updated_at')
      .eq('tenant_id', tenantId)
      .limit(2);

    if (directError) {
      console.log('❌ Direct query failed:', directError.message);
    } else {
      console.log('✅ Direct query working:', directResults?.length || 0, 'results');
    }

    console.log('\n🎉 Schema fix verification completed!');

  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

// Run the verification
verifySchemaFix();






