// ============================================================================
// TEST LOGIN SECURITY FIX
// ============================================================================
// Test script to verify the login security fix is working

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLoginSecurity() {
  console.log('🔒 Testing Login Security Fix...\n');
  
  try {
    // Test 1: Test normal login (should work)
    console.log('1️⃣ Testing normal login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'admin@veropestsolutions.com',
      password: 'password123'
    });
    
    if (loginError) {
      console.log('❌ Normal login failed:', loginError.message);
    } else {
      console.log('✅ Normal login successful');
      console.log('   User:', loginData.user?.email);
      console.log('   User metadata:', loginData.user?.user_metadata);
      console.log('   App metadata:', loginData.user?.app_metadata);
    }
    
    // Test 2: Get user's actual tenant ID from database
    console.log('\n2️⃣ Getting user\'s actual tenant ID from database...');
    const { data: actualTenantId, error: tenantError } = await supabase
      .rpc('get_user_tenant_id', {
        user_email: 'admin@veropestsolutions.com'
      });
    
    if (tenantError) {
      console.log('❌ Get tenant ID failed:', tenantError.message);
    } else {
      console.log('✅ User\'s actual tenant ID:', actualTenantId);
    }
    
    // Test 3: Test validation with random tenant ID
    console.log('\n3️⃣ Testing validation with RANDOM tenant ID...');
    const randomTenantId = '22222222-2222-2222-2222-222222222222';
    
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
    
    // Test 4: Test validation with correct tenant ID
    console.log('\n4️⃣ Testing validation with CORRECT tenant ID...');
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
    
    console.log('\n🎯 LOGIN SECURITY TEST RESULTS:');
    if (loginData && randomError && correctResult) {
      console.log('✅ LOGIN SECURITY IS WORKING!');
      console.log('   ✅ Normal login: SUCCESS');
      console.log('   ✅ Random tenant: REJECTED');
      console.log('   ✅ Correct tenant: ALLOWED');
      console.log('✅ The security fix is successful!');
    } else {
      console.log('❌ LOGIN SECURITY ISSUE DETECTED!');
      console.log('   Normal login:', loginData ? 'SUCCESS' : 'FAILED');
      console.log('   Random tenant:', randomError ? 'REJECTED' : 'ALLOWED');
      console.log('   Correct tenant:', correctResult ? 'ALLOWED' : 'REJECTED');
      console.log('❌ The security fix needs more work!');
    }
    
    // Sign out
    await supabase.auth.signOut();
    console.log('\n✅ Signed out');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testLoginSecurity();







