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

async function debugCustomerPage() {
  console.log('🔍 Debugging Customer Page Loading Issue...');
  
  // 1. Check what tables exist
  console.log('\n1. Checking available tables...');
  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .like('table_name', '%customer%');
  
  if (tablesError) {
    console.error('❌ Error fetching tables:', tablesError);
  } else {
    console.log('   Available customer-related tables:');
    tables.forEach(table => {
      console.log(`   - ${table.table_name}`);
    });
  }
  
  // 2. Check if accounts table exists and has data
  console.log('\n2. Checking accounts table...');
  const { data: accounts, error: accountsError } = await supabase
    .from('accounts')
    .select('*')
    .eq('tenant_id', testTenantId)
    .limit(5);
  
  if (accountsError) {
    console.log(`   ❌ Accounts table error: ${accountsError.message}`);
  } else {
    console.log(`   ✅ Accounts table: Found ${accounts.length} records`);
    if (accounts.length > 0) {
      console.log('   Sample account:', accounts[0]);
    }
  }
  
  // 3. Check customers table
  console.log('\n3. Checking customers table...');
  const { data: customers, error: customersError } = await supabase
    .from('customers')
    .select('*')
    .eq('tenant_id', testTenantId)
    .limit(5);
  
  if (customersError) {
    console.log(`   ❌ Customers table error: ${customersError.message}`);
  } else {
    console.log(`   ✅ Customers table: Found ${customers.length} records`);
    if (customers.length > 0) {
      console.log('   Sample customer:', customers[0]);
    }
  }
  
  // 4. Test the enhanced API call that's failing
  console.log('\n4. Testing enhanced API call...');
  if (customers && customers.length > 0) {
    const testCustomerId = customers[0].id;
    console.log(`   Testing with customer ID: ${testCustomerId}`);
    
    // Try to fetch from accounts table (what enhanced API is doing)
    const { data: accountData, error: accountError } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', testCustomerId)
      .eq('tenant_id', testTenantId)
      .single();
    
    if (accountError) {
      console.log(`   ❌ Account fetch failed: ${accountError.message}`);
    } else {
      console.log(`   ✅ Account fetch successful:`, accountData);
    }
    
    // Try to fetch from customers table (what we should be doing)
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', testCustomerId)
      .eq('tenant_id', testTenantId)
      .single();
    
    if (customerError) {
      console.log(`   ❌ Customer fetch failed: ${customerError.message}`);
    } else {
      console.log(`   ✅ Customer fetch successful:`, customerData);
    }
  }
  
  // 5. Check if we need to create accounts table or update the API
  console.log('\n5. Recommendations:');
  if (accounts && accounts.length === 0 && customers && customers.length > 0) {
    console.log('   🔧 ISSUE FOUND: Enhanced API is looking for "accounts" table but data is in "customers" table');
    console.log('   💡 SOLUTION: Update enhanced API to use "customers" table instead of "accounts"');
  } else if (accounts && accounts.length > 0) {
    console.log('   ✅ Both tables exist with data - check data consistency');
  } else {
    console.log('   ⚠️  No data found in either table');
  }
}

async function main() {
  console.log('🚀 Debugging Customer Page Loading...\n');
  
  await debugCustomerPage();
  
  console.log('\n✅ Debug completed!');
}

main().catch(console.error);
