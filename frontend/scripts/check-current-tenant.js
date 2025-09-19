// ============================================================================
// CHECK CURRENT TENANT
// ============================================================================
// Check what tenant the current user belongs to

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkCurrentTenant() {
  try {
    console.log('🔍 Checking Current Tenant...\n');
    
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
    console.log(`   Tenant ID: ${user.user_metadata?.tenant_id || 'Not set'}`);
    console.log('');
    
    // Check what customers belong to this tenant
    const tenantId = user.user_metadata?.tenant_id;
    if (tenantId) {
      console.log(`🔍 Checking customers for tenant: ${tenantId}`);
      const { data: customers, error: customersError } = await supabase
        .from('accounts')
        .select('name, phone, tenant_id')
        .eq('tenant_id', tenantId)
        .order('name');
      
      if (customersError) {
        console.log('❌ Error fetching customers:', customersError.message);
      } else {
        console.log(`✅ Found ${customers.length} customers for your tenant:`);
        customers.forEach(customer => {
          console.log(`   - ${customer.name} (${customer.phone})`);
        });
      }
    } else {
      console.log('⚠️  No tenant ID found in user metadata');
      console.log('   This might be why search returns no results');
    }
    console.log('');
    
    // Show all tenants for comparison
    console.log('🔍 All tenants in the system:');
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
    
  } catch (error) {
    console.error('❌ Error checking tenant:', error);
  }
}

// Run the check
checkCurrentTenant();



















