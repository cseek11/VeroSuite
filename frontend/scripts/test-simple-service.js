// ============================================================================
// TEST SIMPLE SEARCH SERVICE
// ============================================================================
// Test the simple search service that bypasses the function issues

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSimpleService() {
  try {
    console.log('🧪 Testing Simple Search Service...\n');

    const tenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';

    // Test 1: Empty search (should return all customers)
    console.log('1️⃣ Testing empty search...');
    let query = supabase
      .from('accounts')
      .select('id, name, email, phone, address, city, state, zip_code, status, account_type, created_at, updated_at')
      .eq('tenant_id', tenantId);

    const { data: emptyResults, error: emptyError } = await query
      .order('name', { ascending: true })
      .limit(5);

    if (emptyError) {
      console.log('❌ Empty search failed:', emptyError.message);
    } else {
      console.log('✅ Empty search successful:', emptyResults?.length || 0, 'results');
      if (emptyResults?.length > 0) {
        console.log('   First result:', emptyResults[0].name);
      }
    }

    // Test 2: Name search
    console.log('\n2️⃣ Testing name search...');
    const { data: nameResults, error: nameError } = await supabase
      .from('accounts')
      .select('id, name, email, phone, address, city, state, zip_code, status, account_type, created_at, updated_at')
      .eq('tenant_id', tenantId)
      .or('name.ilike.%john%')
      .order('name', { ascending: true })
      .limit(5);

    if (nameError) {
      console.log('❌ Name search failed:', nameError.message);
    } else {
      console.log('✅ Name search successful:', nameResults?.length || 0, 'results');
      if (nameResults?.length > 0) {
        console.log('   First result:', nameResults[0].name);
      }
    }

    // Test 3: Phone search
    console.log('\n3️⃣ Testing phone search...');
    const { data: phoneResults, error: phoneError } = await supabase
      .from('accounts')
      .select('id, name, email, phone, address, city, state, zip_code, status, account_type, created_at, updated_at')
      .eq('tenant_id', tenantId)
      .or('phone_digits.ilike.%555%')
      .order('name', { ascending: true })
      .limit(5);

    if (phoneError) {
      console.log('❌ Phone search failed:', phoneError.message);
    } else {
      console.log('✅ Phone search successful:', phoneResults?.length || 0, 'results');
      if (phoneResults?.length > 0) {
        console.log('   First result:', phoneResults[0].name, '(phone:', phoneResults[0].phone, ')');
      }
    }

    // Test 4: Address search
    console.log('\n4️⃣ Testing address search...');
    const { data: addressResults, error: addressError } = await supabase
      .from('accounts')
      .select('id, name, email, phone, address, city, state, zip_code, status, account_type, created_at, updated_at')
      .eq('tenant_id', tenantId)
      .or('address.ilike.%oak%')
      .order('name', { ascending: true })
      .limit(5);

    if (addressError) {
      console.log('❌ Address search failed:', addressError.message);
    } else {
      console.log('✅ Address search successful:', addressResults?.length || 0, 'results');
      if (addressResults?.length > 0) {
        console.log('   First result:', addressResults[0].name, '(address:', addressResults[0].address, ')');
      }
    }

    console.log('\n🎉 Simple service testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testSimpleService();



















