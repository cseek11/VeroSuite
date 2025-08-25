// Test customer API with anon key
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8'
);

async function testCustomerAPIAnon() {
  try {
    console.log('Testing customer API with anon key...');
    
    // Test 1: Check if we can access accounts table
    console.log('1. Testing accounts table access...');
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('*')
      .limit(5);
    
    if (accountsError) {
      console.error('❌ Error accessing accounts:', accountsError);
      return;
    }
    
    console.log(`✅ Found ${accounts.length} accounts in database`);
    accounts.forEach((account, index) => {
      console.log(`   ${index + 1}. ${account.name} - ${account.city}, ${account.state} - Tenant: ${account.tenant_id}`);
    });
    
    // Test 2: Check specific tenant
    console.log('\n2. Testing tenant-specific query...');
    const tenantId = 'fb39f15b-b382-4525-8404-1e32ca1486c9';
    const { data: tenantAccounts, error: tenantError } = await supabase
      .from('accounts')
      .select('*')
      .eq('tenant_id', tenantId);
    
    if (tenantError) {
      console.error('❌ Error querying tenant accounts:', tenantError);
      return;
    }
    
    console.log(`✅ Found ${tenantAccounts.length} accounts for tenant ${tenantId}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCustomerAPIAnon();



