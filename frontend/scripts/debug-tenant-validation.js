// ============================================================================
// DEBUG TENANT VALIDATION ISSUE
// ============================================================================
// Debug script to understand why tenant validation is not working

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugTenantValidation() {
  console.log('🔍 Debugging Tenant Validation Issue...\n');
  
  try {
    // Step 1: Check current user metadata
    console.log('1️⃣ Checking current user metadata...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.log('❌ User error:', userError.message);
      return;
    }
    
    if (user) {
      console.log('✅ Current user:', user.email);
      console.log('   User metadata:', user.user_metadata);
      console.log('   App metadata:', user.app_metadata);
      console.log('   Tenant ID from metadata:', user.user_metadata?.tenant_id || user.app_metadata?.tenant_id);
    } else {
      console.log('❌ No user found');
      return;
    }
    
    // Step 2: Test validation with correct tenant ID
    console.log('\n2️⃣ Testing validation with CORRECT tenant ID...');
    const correctTenantId = user.user_metadata?.tenant_id || user.app_metadata?.tenant_id;
    
    if (correctTenantId) {
      const { data: correctResult, error: correctError } = await supabase
        .rpc('validate_user_tenant_access', {
          user_email: user.email,
          claimed_tenant_id: correctTenantId
        });
      
      if (correctError) {
        console.log('❌ Correct tenant validation failed:', correctError.message);
      } else {
        console.log('✅ Correct tenant validation passed:', correctResult);
      }
    }
    
    // Step 3: Test validation with WRONG tenant ID
    console.log('\n3️⃣ Testing validation with WRONG tenant ID...');
    const wrongTenantId = '00000000-0000-0000-0000-000000000000'; // Random UUID
    
    const { data: wrongResult, error: wrongError } = await supabase
      .rpc('validate_user_tenant_access', {
        user_email: user.email,
        claimed_tenant_id: wrongTenantId
      });
    
    if (wrongError) {
      console.log('✅ Wrong tenant correctly rejected:', wrongError.message);
    } else {
      console.log('❌ WRONG TENANT WAS ALLOWED! This is a security issue!');
      console.log('   Result:', wrongResult);
    }
    
    // Step 4: Test with another real tenant ID
    console.log('\n4️⃣ Testing validation with ANOTHER real tenant ID...');
    const anotherTenantId = 'fb39f15b-b382-4525-8404-1e32ca1486c9'; // The old tenant ID
    
    const { data: anotherResult, error: anotherError } = await supabase
      .rpc('validate_user_tenant_access', {
        user_email: user.email,
        claimed_tenant_id: anotherTenantId
      });
    
    if (anotherError) {
      console.log('✅ Another tenant correctly rejected:', anotherError.message);
    } else {
      console.log('❌ ANOTHER TENANT WAS ALLOWED! This is a security issue!');
      console.log('   Result:', anotherResult);
    }
    
    // Step 5: Check what the validation function is actually doing
    console.log('\n5️⃣ Checking validation function logic...');
    console.log('   User email:', user.email);
    console.log('   User tenant ID:', correctTenantId);
    console.log('   Testing with wrong tenant:', wrongTenantId);
    
    console.log('\n🎯 DIAGNOSIS:');
    if (wrongError && anotherError) {
      console.log('✅ Security is working correctly - wrong tenants are rejected');
    } else {
      console.log('❌ SECURITY BREACH - wrong tenants are being allowed!');
      console.log('   This needs immediate fixing!');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

// Run the debug
debugTenantValidation();







