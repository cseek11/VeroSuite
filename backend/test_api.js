// Simple test script to verify Supabase API
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAccountsAPI() {
  try {
    console.log('Testing accounts API...');
    
    // Test 1: Check if we can connect to Supabase
    console.log('1. Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('accounts')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Supabase connection failed:', testError);
      return;
    }
    console.log('✅ Supabase connection successful');
    
    // Test 2: Count total accounts
    console.log('2. Counting total accounts...');
    const { count, error: countError } = await supabase
      .from('accounts')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Count query failed:', countError);
      return;
    }
    console.log(`✅ Found ${count} accounts in database`);
    
    // Test 3: Get first few accounts
    console.log('3. Fetching first 3 accounts...');
    const { data: accounts, error: fetchError } = await supabase
      .from('accounts')
      .select('*')
      .limit(3);
    
    if (fetchError) {
      console.error('❌ Fetch query failed:', fetchError);
      return;
    }
    
    console.log('✅ Successfully fetched accounts:');
    accounts.forEach((account, index) => {
      console.log(`   ${index + 1}. ${account.name} (${account.account_type}) - ${account.city}, ${account.state}`);
    });
    
    // Test 4: Check tenant filtering
    console.log('4. Testing tenant filtering...');
    const { data: tenantAccounts, error: tenantError } = await supabase
      .from('accounts')
      .select('tenant_id')
      .limit(1);
    
    if (tenantError) {
      console.error('❌ Tenant query failed:', tenantError);
      return;
    }
    
    if (tenantAccounts.length > 0) {
      console.log(`✅ Found accounts with tenant_id: ${tenantAccounts[0].tenant_id}`);
    } else {
      console.log('⚠️  No accounts found');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

testAccountsAPI();
