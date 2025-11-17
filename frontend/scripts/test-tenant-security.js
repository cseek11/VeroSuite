// ============================================================================
// TEST TENANT SECURITY IMPLEMENTATION
// ============================================================================
// Test script to verify tenant validation is working correctly

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testTenantSecurity() {
  console.log('🔒 Testing Tenant Security Implementation...\n');
  
  try {
    // Test 1: Check if validation functions exist
    console.log('1️⃣ Testing if validation functions exist...');
    
    const { data: functions, error: functionsError } = await supabase
      .from('pg_proc')
      .select('proname')
      .in('proname', ['validate_user_tenant_access', 'get_user_tenant_id']);
    
    if (functionsError) {
      console.log('❌ Error checking functions:', functionsError.message);
    } else {
      console.log('✅ Functions found:', functions.map(f => f.proname));
    }
    
    // Test 2: Test with correct tenant ID
    console.log('\n2️⃣ Testing with correct tenant ID...');
    const { data: validResult, error: validError } = await supabase
      .rpc('validate_user_tenant_access', {
        user_email: 'admin@veropestsolutions.com',
        claimed_tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28'
      });
    
    if (validError) {
      console.log('❌ Valid test failed:', validError.message);
    } else {
      console.log('✅ Valid tenant access test passed:', validResult);
    }
    
    // Test 3: Test with wrong tenant ID
    console.log('\n3️⃣ Testing with wrong tenant ID...');
    const { data: invalidResult, error: invalidError } = await supabase
      .rpc('validate_user_tenant_access', {
        user_email: 'admin@veropestsolutions.com',
        claimed_tenant_id: 'fb39f15b-b382-4525-8404-1e32ca1486c9'
      });
    
    if (invalidError) {
      console.log('✅ Invalid tenant access correctly rejected:', invalidError.message);
    } else {
      console.log('❌ Invalid tenant access should have been rejected, but got:', invalidResult);
    }
    
    // Test 4: Test with non-existent user
    console.log('\n4️⃣ Testing with non-existent user...');
    const { data: noUserResult, error: noUserError } = await supabase
      .rpc('validate_user_tenant_access', {
        user_email: 'nonexistent@example.com',
        claimed_tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28'
      });
    
    if (noUserError) {
      console.log('✅ Non-existent user correctly rejected:', noUserError.message);
    } else {
      console.log('❌ Non-existent user should have been rejected, but got:', noUserResult);
    }
    
    // Test 5: Test get_user_tenant_id function
    console.log('\n5️⃣ Testing get_user_tenant_id function...');
    const { data: tenantIdResult, error: tenantIdError } = await supabase
      .rpc('get_user_tenant_id', {
        user_email: 'admin@veropestsolutions.com'
      });
    
    if (tenantIdError) {
      console.log('❌ Get tenant ID failed:', tenantIdError.message);
    } else {
      console.log('✅ User tenant ID:', tenantIdResult);
    }
    
    console.log('\n🎉 Tenant security tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
testTenantSecurity();





































