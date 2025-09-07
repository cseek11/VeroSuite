// ============================================================================
// DEBUG TENANT MISMATCH
// ============================================================================
// Debug script to check tenant mismatch between user and accounts

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugTenantMismatch() {
  try {
    console.log('🔍 Debugging Tenant Mismatch...\n');
    
    // Check current user session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.log('❌ Error getting user:', userError.message);
      console.log('   You may not be logged in');
      return;
    }
    
    if (!user) {
      console.log('❌ No user found - please log in first');
      return;
    }
    
    console.log('✅ User found:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Tenant ID from metadata: ${user.user_metadata?.tenant_id || 'Not set'}`);
    console.log('');
    
    // Check what customers exist for the target tenant
    const targetTenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';
    console.log(`🔍 Checking customers for target tenant: ${targetTenantId}`);
    
    const { data: targetCustomers, error: targetError } = await supabase
      .from('accounts')
      .select('name, phone, tenant_id')
      .eq('tenant_id', targetTenantId)
      .order('name');
    
    if (targetError) {
      console.log('❌ Error fetching target customers:', targetError.message);
    } else {
      console.log(`✅ Found ${targetCustomers.length} customers for target tenant:`);
      targetCustomers.forEach(customer => {
        console.log(`   - ${customer.name} (${customer.phone})`);
      });
    }
    console.log('');
    
    // Check what customers exist for the user's tenant
    const userTenantId = user.user_metadata?.tenant_id;
    if (userTenantId) {
      console.log(`🔍 Checking customers for user's tenant: ${userTenantId}`);
      
      const { data: userCustomers, error: userCustomersError } = await supabase
        .from('accounts')
        .select('name, phone, tenant_id')
        .eq('tenant_id', userTenantId)
        .order('name');
      
      if (userCustomersError) {
        console.log('❌ Error fetching user customers:', userCustomersError.message);
      } else {
        console.log(`✅ Found ${userCustomers.length} customers for user's tenant:`);
        userCustomers.forEach(customer => {
          console.log(`   - ${customer.name} (${customer.phone})`);
        });
      }
    } else {
      console.log('⚠️  User has no tenant ID in metadata');
    }
    console.log('');
    
    // Show all unique tenants
    console.log('🔍 All unique tenants in the system:');
    const { data: allTenants, error: tenantsError } = await supabase
      .from('accounts')
      .select('tenant_id')
      .order('tenant_id');
    
    if (tenantsError) {
      console.log('❌ Error fetching tenants:', tenantsError.message);
    } else {
      const uniqueTenants = [...new Set(allTenants.map(c => c.tenant_id))];
      console.log(`✅ Found ${uniqueTenants.length} unique tenants:`);
      uniqueTenants.forEach(tenantId => {
        console.log(`   - ${tenantId}`);
      });
    }
    console.log('');
    
    console.log('📋 Summary:');
    console.log(`   Target tenant: ${targetTenantId}`);
    console.log(`   User tenant: ${userTenantId || 'Not set'}`);
    console.log('   If these don\'t match, the search will return no results');
    
  } catch (error) {
    console.error('❌ Error in tenant debugging:', error);
  }
}

// Run the debug
debugTenantMismatch();








