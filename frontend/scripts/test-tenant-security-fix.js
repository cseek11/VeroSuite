// ============================================================================
// TEST TENANT SECURITY FIX
// ============================================================================
// Test script to verify the tenant security fix is working correctly

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testTenantSecurityFix() {
  console.log('🔒 Testing Tenant Security Fix...\n');
  
  try {
    // Test 1: Get user's actual tenant ID from database
    console.log('1️⃣ Getting user\'s actual tenant ID from database...');
    const { data: actualTenantId, error: tenantError } = await supabase
      .rpc('get_user_tenant_id', {
        user_email: 'admin@veropestsolutions.com'
      });
    
    if (tenantError) {
      console.log('❌ Get tenant ID failed:', tenantError.message);
      return;
    }
    
    console.log('✅ User\'s actual tenant ID:', actualTenantId);
    
    // Test 2: Test validation with CORRECT tenant ID
    console.log('\n2️⃣ Testing validation with CORRECT tenant ID...');
    const { data: correctResult, error: correctError } = await supabase
      .rpc('validate_user_tenant_access', {
        user_email: 'admin@veropestsolutions.com',
        claimed_tenant_id: actualTenantId
      });
    
    if (correctError) {
      console.log('❌ Correct tenant validation failed:', correctError.message);
    } else {
      console.log('✅ Correct tenant validation passed:', correctResult);
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
      console.log('❌ WRONG TENANT WAS ALLOWED! Security issue!');
      console.log('   Result:', wrongResult);
    }
    
    // Test 4: Test validation with ANOTHER real tenant ID
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
      console.log('❌ ANOTHER TENANT WAS ALLOWED! Security issue!');
      console.log('   Result:', anotherResult);
    }
    
    // Test 5: Test with a completely random tenant ID
    console.log('\n5️⃣ Testing validation with RANDOM tenant ID...');
    const randomTenantId = '12345678-1234-1234-1234-123456789012';
    
    const { data: randomResult, error: randomError } = await supabase
      .rpc('validate_user_tenant_access', {
        user_email: 'admin@veropestsolutions.com',
        claimed_tenant_id: randomTenantId
      });
    
    if (randomError) {
      console.log('✅ Random tenant correctly rejected:', randomError.message);
    } else {
      console.log('❌ RANDOM TENANT WAS ALLOWED! Security issue!');
      console.log('   Result:', randomResult);
    }
    
    console.log('\n🎯 SECURITY TEST RESULTS:');
    if (correctResult && wrongError && anotherError && randomError) {
      console.log('✅ SECURITY IS WORKING CORRECTLY!');
      console.log('   ✅ Correct tenant: ALLOWED');
      console.log('   ✅ Wrong tenant: REJECTED');
      console.log('   ✅ Another tenant: REJECTED');
      console.log('   ✅ Random tenant: REJECTED');
      console.log('✅ The security fix is successful!');
    } else {
      console.log('❌ SECURITY ISSUE DETECTED!');
      console.log('   Correct tenant:', correctResult ? 'ALLOWED' : 'REJECTED');
      console.log('   Wrong tenant:', wrongError ? 'REJECTED' : 'ALLOWED');
      console.log('   Another tenant:', anotherError ? 'REJECTED' : 'ALLOWED');
      console.log('   Random tenant:', randomError ? 'REJECTED' : 'ALLOWED');
      console.log('❌ The security fix needs more work!');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testTenantSecurityFix();















