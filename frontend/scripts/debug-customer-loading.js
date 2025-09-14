// ============================================================================
// DEBUG CUSTOMER LOADING
// ============================================================================
// Debug script to check why customers are not loading in the frontend

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugCustomerLoading() {
  try {
    console.log('🔍 Debugging Customer Loading...\n');
    
    // Test 1: Check if we can connect to Supabase
    console.log('1️⃣ Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('accounts')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.log('❌ Supabase connection failed:', testError.message);
      return;
    }
    console.log('✅ Supabase connection successful');
    console.log('');
    
    // Test 2: Check total accounts in database
    console.log('2️⃣ Checking total accounts in database...');
    const { count: totalAccounts, error: countError } = await supabase
      .from('accounts')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log('❌ Error counting accounts:', countError.message);
    } else {
      console.log(`✅ Total accounts in database: ${totalAccounts}`);
    }
    console.log('');
    
    // Test 3: Check accounts for the specific tenant
    const targetTenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';
    console.log(`3️⃣ Checking accounts for tenant: ${targetTenantId}`);
    
    const { data: tenantAccounts, error: tenantError } = await supabase
      .from('accounts')
      .select('id, name, phone, tenant_id, status')
      .eq('tenant_id', targetTenantId)
      .order('name');
    
    if (tenantError) {
      console.log('❌ Error fetching tenant accounts:', tenantError.message);
    } else {
      console.log(`✅ Found ${tenantAccounts.length} accounts for tenant:`);
      tenantAccounts.forEach(account => {
        console.log(`   - ${account.name} (${account.phone}) - ${account.status}`);
      });
    }
    console.log('');
    
    // Test 4: Test the exact query that the frontend uses
    console.log('4️⃣ Testing frontend query (with all related data)...');
    const { data: frontendQuery, error: frontendError } = await supabase
      .from('accounts')
      .select(`
        *,
        customer_profiles (*),
        customer_contacts (*),
        locations (*),
        work_orders (*),
        jobs (*)
      `)
      .eq('tenant_id', targetTenantId)
      .order('name');
    
    if (frontendError) {
      console.log('❌ Frontend query failed:', frontendError.message);
    } else {
      console.log(`✅ Frontend query successful: ${frontendQuery.length} accounts`);
      frontendQuery.forEach(account => {
        console.log(`   - ${account.name} (${account.phone})`);
      });
    }
    console.log('');
    
    // Test 5: Check if there are any RLS issues
    console.log('5️⃣ Testing RLS policies...');
    const { data: rlsTest, error: rlsError } = await supabase
      .from('accounts')
      .select('id, name')
      .eq('tenant_id', targetTenantId)
      .limit(1);
    
    if (rlsError) {
      console.log('❌ RLS policy issue:', rlsError.message);
      console.log('   This might be blocking the frontend from seeing data');
    } else {
      console.log('✅ RLS policies allow access to tenant data');
    }
    console.log('');
    
    // Test 6: Check all unique tenants
    console.log('6️⃣ All unique tenants in the system:');
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
    console.log(`   Total accounts: ${totalAccounts || 'Unknown'}`);
    console.log(`   Tenant accounts: ${tenantAccounts?.length || 0}`);
    console.log(`   Frontend query accounts: ${frontendQuery?.length || 0}`);
    
    if (tenantAccounts?.length === 0) {
      console.log('⚠️  No accounts found for the target tenant!');
      console.log('   Check if accounts were properly updated with the correct tenant_id');
    }
    
  } catch (error) {
    console.error('❌ Error in customer loading debug:', error);
  }
}

// Run the debug
debugCustomerLoading();


















