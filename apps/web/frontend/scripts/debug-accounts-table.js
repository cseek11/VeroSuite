import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const testTenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';

async function debugAccountsTable() {
  console.log('🔍 Debugging Accounts Table Structure...');
  
  // 1. Check accounts table structure and data
  console.log('\n1. Checking accounts table...');
  const { data: accounts, error: accountsError } = await supabase
    .from('accounts')
    .select('*')
    .eq('tenant_id', testTenantId)
    .limit(3);
  
  if (accountsError) {
    console.error('❌ Accounts table error:', accountsError);
    return;
  }
  
  console.log(`   ✅ Found ${accounts.length} accounts:`);
  accounts.forEach((account, index) => {
    console.log(`   ${index + 1}. ${account.name} (${account.id})`);
    console.log(`      - Email: ${account.email}`);
    console.log(`      - Phone: ${account.phone}`);
    console.log(`      - Status: ${account.status}`);
    console.log(`      - Type: ${account.account_type}`);
    console.log(`      - Created: ${account.created_at}`);
  });
  
  // 2. Check customers table structure and data
  console.log('\n2. Checking customers table...');
  const { data: customers, error: customersError } = await supabase
    .from('customers')
    .select('*')
    .eq('tenant_id', testTenantId)
    .limit(3);
  
  if (customersError) {
    console.error('❌ Customers table error:', customersError);
  } else {
    console.log(`   ✅ Found ${customers.length} customers:`);
    customers.forEach((customer, index) => {
      console.log(`   ${index + 1}. ${customer.first_name} ${customer.last_name} (${customer.id})`);
      console.log(`      - Email: ${customer.email}`);
      console.log(`      - Phone: ${customer.phone}`);
      console.log(`      - Status: ${customer.status}`);
      console.log(`      - Type: ${customer.account_type}`);
      console.log(`      - Created: ${customer.created_at}`);
    });
  }
  
  // 3. Test which table the search functions are using
  console.log('\n3. Testing search functions...');
  if (accounts.length > 0) {
    const testAccount = accounts[0];
    console.log(`   Testing search for: ${testAccount.name}`);
    
    // Test search by name
    const { data: searchResults, error: searchError } = await supabase.rpc('search_customers_enhanced', {
      p_tenant_id: testTenantId,
      p_search_term: testAccount.name,
      p_limit: 10
    });
    
    if (searchError) {
      console.log(`   ❌ Search failed: ${searchError.message}`);
    } else {
      const found = searchResults.find(r => r.id === testAccount.id);
      console.log(`   ${found ? '✅' : '❌'} Account found in search results: ${found ? 'YES' : 'NO'}`);
      if (found) {
        console.log(`   Search result: ${found.name} (${found.id})`);
      }
    }
  }
  
  // 4. Check if there's a mapping between accounts and customers
  console.log('\n4. Checking for account-customer mapping...');
  if (accounts.length > 0 && customers.length > 0) {
    const accountIds = accounts.map(a => a.id);
    const customerIds = customers.map(c => c.id);
    const commonIds = accountIds.filter(id => customerIds.includes(id));
    
    console.log(`   Account IDs: ${accountIds.length}`);
    console.log(`   Customer IDs: ${customerIds.length}`);
    console.log(`   Common IDs: ${commonIds.length}`);
    
    if (commonIds.length > 0) {
      console.log(`   ✅ Found ${commonIds.length} records that exist in both tables`);
    } else {
      console.log(`   ⚠️  No records found in both tables - they appear to be separate`);
    }
  }
  
  // 5. Recommendations
  console.log('\n5. Recommendations:');
  if (accounts.length > 0 && customers.length === 0) {
    console.log('   🔧 ISSUE: Customer data is in "accounts" table, but search functions use "customers" table');
    console.log('   💡 SOLUTION: Update search functions to use "accounts" table');
  } else if (accounts.length > 0 && customers.length > 0) {
    console.log('   ⚠️  Both tables have data - need to determine which is the source of truth');
  } else {
    console.log('   ❌ No data found in either table');
  }
}

async function main() {
  console.log('🚀 Debugging Accounts Table...\n');
  
  await debugAccountsTable();
  
  console.log('\n✅ Debug completed!');
}

main().catch(console.error);
