// Test customer API directly
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testCustomerAPI() {
  try {
    console.log('Testing customer API...');
    
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
    
    // Test 3: Check user metadata
    console.log('\n3. Testing user metadata...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error listing users:', usersError);
      return;
    }
    
    const user = users.users.find(u => u.email === 'admin@veropestsolutions.com');
    if (user) {
      console.log('✅ User found:', user.email);
      console.log('User metadata:', user.user_metadata);
      console.log('Tenant ID in metadata:', user.user_metadata?.tenant_id);
    } else {
      console.log('❌ User not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCustomerAPI();





