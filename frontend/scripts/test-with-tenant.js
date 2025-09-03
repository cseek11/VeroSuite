// ============================================================================
// TENANT-AWARE SEARCH TEST
// ============================================================================
// Tests search functionality with tenant filtering

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testWithTenant() {
  try {
    console.log('🔍 Testing Search with Tenant Filtering...\n');
    
    // First, let's see what tenant IDs exist
    console.log('1️⃣ Checking available tenant IDs:');
    const { data: tenants, error: tenantError } = await supabase
      .from('accounts')
      .select('tenant_id')
      .limit(10);
    
    if (tenantError) {
      console.log(`   ❌ Error: ${tenantError.message}`);
    } else {
      const uniqueTenants = [...new Set(tenants.map(t => t.tenant_id))];
      console.log(`   Found tenant IDs: ${uniqueTenants.join(', ')}`);
    }
    console.log('');
    
    // Test search without tenant filtering
    console.log('2️⃣ Testing search for "5551234" WITHOUT tenant filtering:');
    const { data: resultsNoTenant, error: errorNoTenant } = await supabase
      .from('accounts')
      .select('name, phone, phone_digits, tenant_id')
      .or('phone_digits.ilike.%5551234%');
    
    if (errorNoTenant) {
      console.log(`   ❌ Error: ${errorNoTenant.message}`);
    } else {
      console.log(`   ✅ Found ${resultsNoTenant.length} results:`);
      resultsNoTenant.forEach(c => console.log(`      - ${c.name}: ${c.phone} (tenant: ${c.tenant_id})`));
    }
    console.log('');
    
    // Test search with tenant filtering (using first tenant ID)
    if (tenants && tenants.length > 0) {
      const firstTenantId = tenants[0].tenant_id;
      console.log(`3️⃣ Testing search for "5551234" WITH tenant filtering (tenant: ${firstTenantId}):`);
      
      const { data: resultsWithTenant, error: errorWithTenant } = await supabase
        .from('accounts')
        .select('name, phone, phone_digits, tenant_id')
        .eq('tenant_id', firstTenantId)
        .or('phone_digits.ilike.%5551234%');
      
      if (errorWithTenant) {
        console.log(`   ❌ Error: ${errorWithTenant.message}`);
      } else {
        console.log(`   ✅ Found ${resultsWithTenant.length} results:`);
        resultsWithTenant.forEach(c => console.log(`      - ${c.name}: ${c.phone} (tenant: ${c.tenant_id})`));
      }
      console.log('');
    }
    
    // Test the exact API logic with tenant filtering
    console.log('4️⃣ Testing exact API logic with tenant filtering:');
    const searchTerm = '5551234';
    const phoneDigits = searchTerm.replace(/\D/g, '');
    
    let searchQuery = `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`;
    
    if (phoneDigits.length > 0) {
      searchQuery += `,phone.ilike.%${searchTerm}%,phone_digits.ilike.%${phoneDigits}%`;
      searchQuery += `,phone.ilike.%${phoneDigits}%`;
    } else {
      searchQuery += `,phone.ilike.%${searchTerm}%`;
    }
    
    const addressTokens = searchTerm.split(/\s+/).filter(token => token.length > 0);
    if (addressTokens.length > 1) {
      addressTokens.forEach(token => {
        searchQuery += `,address.ilike.%${token}%,city.ilike.%${token}%,state.ilike.%${token}%,zip_code.ilike.%${token}%`;
      });
    } else {
      searchQuery += `,address.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,state.ilike.%${searchTerm}%,zip_code.ilike.%${searchTerm}%`;
    }
    
    searchQuery += `,account_type.ilike.%${searchTerm}%,status.ilike.%${searchTerm}%`;
    
    if (tenants && tenants.length > 0) {
      const firstTenantId = tenants[0].tenant_id;
      
      const { data: apiResults, error: apiError } = await supabase
        .from('accounts')
        .select('name, phone, phone_digits, tenant_id')
        .eq('tenant_id', firstTenantId)
        .or(searchQuery);
      
      if (apiError) {
        console.log(`   ❌ Error: ${apiError.message}`);
      } else {
        console.log(`   ✅ Found ${apiResults.length} results:`);
        apiResults.forEach(c => console.log(`      - ${c.name}: ${c.phone} (tenant: ${c.tenant_id})`));
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing with tenant:', error);
  }
}

// Run the test
testWithTenant();






