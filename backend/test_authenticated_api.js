// Test customer API with authenticated user
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8'
);

async function testAuthenticatedAPI() {
  try {
    console.log('Testing authenticated customer API...');
    
    // Step 1: Authenticate the user
    console.log('1. Authenticating user...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@veropestsolutions.com',
      password: 'admin123'
    });
    
    if (authError) {
      console.error('❌ Authentication failed:', authError);
      return;
    }
    
    console.log('✅ Authentication successful!');
    console.log('User:', authData.user.email);
    console.log('User metadata:', authData.user.user_metadata);
    
    // Step 2: Test accessing accounts as authenticated user
    console.log('\n2. Testing accounts table access as authenticated user...');
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
    
    // Step 3: Test tenant-specific query
    console.log('\n3. Testing tenant-specific query...');
    const tenantId = authData.user.user_metadata?.tenant_id;
    console.log('User tenant ID:', tenantId);
    
    if (tenantId) {
      const { data: tenantAccounts, error: tenantError } = await supabase
        .from('accounts')
        .select('*')
        .eq('tenant_id', tenantId);
      
      if (tenantError) {
        console.error('❌ Error querying tenant accounts:', tenantError);
        return;
      }
      
      console.log(`✅ Found ${tenantAccounts.length} accounts for tenant ${tenantId}`);
      tenantAccounts.forEach((account, index) => {
        console.log(`   ${index + 1}. ${account.name} - ${account.city}, ${account.state}`);
      });
    } else {
      console.log('⚠️ No tenant ID found in user metadata');
    }
    
    // Step 4: Sign out
    await supabase.auth.signOut();
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAuthenticatedAPI();



