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

async function debugAllAccounts() {
  console.log('🔍 Debugging All Accounts Data...');
  
  // 1. Check ALL accounts (no tenant filter)
  console.log('\n1. Checking ALL accounts (no tenant filter)...');
  const { data: allAccounts, error: allAccountsError } = await supabase
    .from('accounts')
    .select('*')
    .limit(10);
  
  if (allAccountsError) {
    console.error('❌ All accounts error:', allAccountsError);
  } else {
    console.log(`   ✅ Found ${allAccounts.length} total accounts:`);
    allAccounts.forEach((account, index) => {
      console.log(`   ${index + 1}. ${account.name} (${account.id})`);
      console.log(`      - Tenant: ${account.tenant_id}`);
      console.log(`      - Email: ${account.email}`);
      console.log(`      - Phone: ${account.phone}`);
      console.log(`      - Status: ${account.status}`);
      console.log(`      - Type: ${account.account_type}`);
      console.log(`      - Created: ${account.created_at}`);
    });
  }
  
  // 2. Check ALL customers (no tenant filter)
  console.log('\n2. Checking ALL customers (no tenant filter)...');
  const { data: allCustomers, error: allCustomersError } = await supabase
    .from('customers')
    .select('*')
    .limit(10);
  
  if (allCustomersError) {
    console.error('❌ All customers error:', allCustomersError);
  } else {
    console.log(`   ✅ Found ${allCustomers.length} total customers:`);
    allCustomers.forEach((customer, index) => {
      console.log(`   ${index + 1}. ${customer.first_name} ${customer.last_name} (${customer.id})`);
      console.log(`      - Tenant: ${customer.tenant_id}`);
      console.log(`      - Email: ${customer.email}`);
      console.log(`      - Phone: ${customer.phone}`);
      console.log(`      - Status: ${customer.status}`);
      console.log(`      - Type: ${customer.account_type}`);
      console.log(`      - Created: ${customer.created_at}`);
    });
  }
  
  // 3. Check unique tenant IDs
  console.log('\n3. Checking unique tenant IDs...');
  const tenantIds = new Set();
  
  allAccounts.forEach(account => tenantIds.add(account.tenant_id));
  allCustomers.forEach(customer => tenantIds.add(customer.tenant_id));
  
  console.log(`   Found ${tenantIds.size} unique tenant IDs:`);
  Array.from(tenantIds).forEach((tenantId, index) => {
    console.log(`   ${index + 1}. ${tenantId}`);
  });
  
  // 4. Test search with the first available tenant
  if (allAccounts.length > 0) {
    const firstTenantId = allAccounts[0].tenant_id;
    console.log(`\n4. Testing search with tenant: ${firstTenantId}`);
    
    const { data: searchResults, error: searchError } = await supabase.rpc('search_customers_enhanced', {
      p_tenant_id: firstTenantId,
      p_search_term: allAccounts[0].name,
      p_limit: 10
    });
    
    if (searchError) {
      console.log(`   ❌ Search failed: ${searchError.message}`);
    } else {
      console.log(`   ✅ Search successful: Found ${searchResults.length} results`);
      searchResults.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.name} (${result.id})`);
      });
    }
  }
  
  // 5. Recommendations
  console.log('\n5. Recommendations:');
  if (allAccounts.length > 0) {
    console.log('   ✅ Customer data IS in accounts table');
    console.log('   💡 SOLUTION: Update enhanced API to use accounts table as primary source');
    console.log('   🔧 ACTION: Modify getById and update methods to use accounts table');
  } else if (allCustomers.length > 0) {
    console.log('   ✅ Customer data IS in customers table');
    console.log('   💡 Current implementation is correct');
  } else {
    console.log('   ❌ No customer data found in either table');
  }
}

async function main() {
  console.log('🚀 Debugging All Accounts Data...\n');
  
  await debugAllAccounts();
  
  console.log('\n✅ Debug completed!');
}

main().catch(console.error);
