// ============================================================================
// DIAGNOSE SEARCH FUNCTION ISSUES
// ============================================================================
// Script to diagnose what's wrong with the search function

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnoseSearch() {
  try {
    console.log('🔍 Diagnosing Search Function Issues...\n');

    // Check 1: What functions exist
    console.log('1️⃣ Checking what functions exist...');
    const { data: functions, error: funcError } = await supabase
      .from('information_schema.routines')
      .select('routine_name, routine_type, data_type')
      .eq('routine_schema', 'public')
      .ilike('routine_name', '%search%');

    if (funcError) {
      console.log('❌ Function check failed:', funcError.message);
    } else {
      console.log('✅ Functions found:', functions?.length || 0);
      functions?.forEach(f => {
        console.log(`   - ${f.routine_name} (${f.routine_type}, returns: ${f.data_type})`);
      });
    }

    // Check 2: What columns exist in accounts table
    console.log('\n2️⃣ Checking accounts table structure...');
    const { data: columns, error: colError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'accounts')
      .eq('table_schema', 'public')
      .order('ordinal_position');

    if (colError) {
      console.log('❌ Column check failed:', colError.message);
    } else {
      console.log('✅ Accounts table columns:', columns?.length || 0);
      columns?.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
    }

    // Check 3: Try a simple direct query
    console.log('\n3️⃣ Testing direct query to accounts...');
    const { data: directResults, error: directError } = await supabase
      .from('accounts')
      .select('id, name, email, phone, address, city, state, zip_code, status, account_type, created_at, updated_at')
      .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
      .limit(2);

    if (directError) {
      console.log('❌ Direct query failed:', directError.message);
    } else {
      console.log('✅ Direct query successful:', directResults?.length || 0, 'results');
      if (directResults?.length > 0) {
        console.log('   Sample record:', directResults[0]);
      }
    }

    // Check 4: Try to call the function with minimal parameters
    console.log('\n4️⃣ Testing function call with minimal parameters...');
    const { data: funcResults, error: funcCallError } = await supabase.rpc(
      'search_customers_enhanced',
      {
        p_search_term: '',
        p_tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
        p_limit: 1,
        p_offset: 0
      }
    );

    if (funcCallError) {
      console.log('❌ Function call failed:', funcCallError.message);
      console.log('   Error details:', funcCallError);
    } else {
      console.log('✅ Function call successful:', funcResults?.length || 0, 'results');
      if (funcResults?.length > 0) {
        console.log('   Sample result:', funcResults[0]);
      }
    }

    console.log('\n🎉 Diagnosis completed!');

  } catch (error) {
    console.error('❌ Diagnosis failed:', error);
  }
}

// Run the diagnosis
diagnoseSearch();






