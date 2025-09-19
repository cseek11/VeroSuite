// ============================================================================
// TEST SECURITY FIX
// ============================================================================
// Test script to verify the security fix is working

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSecurityFix() {
  console.log('🔒 Testing Security Fix...\n');
  
  try {
    // Test 1: Test get_user_tenant_id function
    console.log('1️⃣ Testing get_user_tenant_id function...');
    const { data: tenantIdResult, error: tenantIdError } = await supabase
      .rpc('get_user_tenant_id', {
        user_email: 'admin@veropestsolutions.com'
      });
    
    if (tenantIdError) {
      console.log('❌ Get tenant ID failed:', tenantIdError.message);
    } else {
      console.log('✅ User tenant ID from database:', tenantIdResult);
    }
    
    // Test 2: Test validation with correct tenant ID
    console.log('\n2️⃣ Testing validation with CORRECT tenant ID...');
    const { data: validResult, error: validError } = await supabase
      .rpc('validate_user_tenant_access', {
        user_email: 'admin@veropestsolutions.com',
        claimed_tenant_id: tenantIdResult
      });
    
    if (validError) {
      console.log('❌ Valid test failed:', validError.message);
    } else {
      console.log('✅ Valid tenant access test passed:', validResult);
    }
    
    // Test 3: Test validation with WRONG tenant ID
    console.log('\n3️⃣ Testing validation with WRONG tenant ID...');
    const wrongTenantId = '00000000-0000-0000-0000-000000000000';
    
    const { data: wrongResult, error: wrongError } = await supabase
      .rpc('validate_user_tenant_access', {
        user_email: 'admin@veropestsolutions.com',
        claimed_tenant_id: wrongTenantId
      });
    
    if (wrongError) {
      console.log('✅ Wrong tenant correctly rejected:', wrongError.message);
    } else {
      console.log('❌ WRONG TENANT WAS ALLOWED! Security issue still exists!');
      console.log('   Result:', wrongResult);
    }
    
    // Test 4: Test validation with another real tenant ID
    console.log('\n4️⃣ Testing validation with ANOTHER real tenant ID...');
    const anotherTenantId = 'fb39f15b-b382-4525-8404-1e32ca1486c9';
    
    const { data: anotherResult, error: anotherError } = await supabase
      .rpc('validate_user_tenant_access', {
        user_email: 'admin@veropestsolutions.com',
        claimed_tenant_id: anotherTenantId
      });
    
    if (anotherError) {
      console.log('✅ Another tenant correctly rejected:', anotherError.message);
    } else {
      console.log('❌ ANOTHER TENANT WAS ALLOWED! Security issue still exists!');
      console.log('   Result:', anotherResult);
    }
    
    console.log('\n🎯 SECURITY TEST RESULTS:');
    if (wrongError && anotherError) {
      console.log('✅ SECURITY IS WORKING - Wrong tenants are properly rejected');
      console.log('✅ The fix is successful!');
    } else {
      console.log('❌ SECURITY BREACH - Wrong tenants are still being allowed!');
      console.log('❌ The fix did not work properly!');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testSecurityFix();
















