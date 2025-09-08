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
const testTenantId = '550e8400-e29b-41d4-a716-446655440000';

async function debugTenantIsolation() {
  console.log('🔍 Debugging Tenant Isolation Issues...');
  
  // 1. Check all customers across all tenants
  console.log('\n1. All customers in database (all tenants):');
  const { data: allCustomers, error: allError } = await supabase
    .from('customers')
    .select('id, first_name, last_name, tenant_id, created_at')
    .order('created_at', { ascending: false });
  
  if (allError) {
    console.error('❌ Error fetching customers:', allError);
    return;
  }
  
  console.log(`   Found ${allCustomers.length} customers total:`);
  allCustomers.forEach(customer => {
    console.log(`   - ${customer.first_name} ${customer.last_name} (${customer.id}) - Tenant: ${customer.tenant_id}`);
  });
  
  // 2. Check customers for our test tenant specifically
  console.log(`\n2. Customers for test tenant ${testTenantId}:`);
  const { data: tenantCustomers, error: tenantError } = await supabase
    .from('customers')
    .select('*')
    .eq('tenant_id', testTenantId);
  
  if (tenantError) {
    console.error('❌ Error fetching tenant customers:', tenantError);
    return;
  }
  
  console.log(`   Found ${tenantCustomers.length} customers for test tenant:`);
  tenantCustomers.forEach(customer => {
    console.log(`   - ${customer.first_name} ${customer.last_name} (${customer.id})`);
  });
  
  // 3. Test search with different tenant IDs
  console.log('\n3. Testing search with different tenant IDs:');
  
  // Test with our test tenant
  console.log(`   Testing with test tenant ${testTenantId}:`);
  const { data: testResults, error: testError } = await supabase.rpc('search_customers_enhanced', {
    p_tenant_id: testTenantId,
    p_search_term: 'John',
    p_limit: 10
  });
  
  if (testError) {
    console.log(`   ❌ Search failed: ${testError.message}`);
  } else {
    console.log(`   ✅ Found ${testResults.length} results`);
    testResults.forEach(result => {
      console.log(`     - ${result.name} (${result.id})`);
    });
  }
  
  // Test with a different tenant ID (if we have customers from other tenants)
  if (allCustomers.length > 0) {
    const otherTenantId = allCustomers[0].tenant_id;
    if (otherTenantId !== testTenantId) {
      console.log(`   Testing with other tenant ${otherTenantId}:`);
      const { data: otherResults, error: otherError } = await supabase.rpc('search_customers_enhanced', {
        p_tenant_id: otherTenantId,
        p_search_term: 'John',
        p_limit: 10
      });
      
      if (otherError) {
        console.log(`   ❌ Search failed: ${otherError.message}`);
      } else {
        console.log(`   ✅ Found ${otherResults.length} results`);
        otherResults.forEach(result => {
          console.log(`     - ${result.name} (${result.id})`);
        });
      }
    }
  }
  
  // 4. Check if the problem customer exists and what tenant it belongs to
  const problemCustomerId = '6ae48256-ab39-4326-bcd7-d3cd5b71c191';
  console.log(`\n4. Checking problem customer ${problemCustomerId}:`);
  
  const { data: problemCustomer, error: problemError } = await supabase
    .from('customers')
    .select('*')
    .eq('id', problemCustomerId)
    .single();
  
  if (problemError) {
    console.log(`   ❌ Customer not found: ${problemError.message}`);
  } else {
    console.log(`   ✅ Customer found:`);
    console.log(`   - Name: ${problemCustomer.first_name} ${problemCustomer.last_name}`);
    console.log(`   - Tenant: ${problemCustomer.tenant_id}`);
    console.log(`   - Created: ${problemCustomer.created_at}`);
    
    // Test search for this specific customer with its actual tenant
    console.log(`   Testing search with customer's actual tenant ${problemCustomer.tenant_id}:`);
    const { data: specificResults, error: specificError } = await supabase.rpc('search_customers_enhanced', {
      p_tenant_id: problemCustomer.tenant_id,
      p_search_term: problemCustomer.first_name,
      p_limit: 10
    });
    
    if (specificError) {
      console.log(`   ❌ Search failed: ${specificError.message}`);
    } else {
      const found = specificResults.some(r => r.id === problemCustomerId);
      console.log(`   ${found ? '✅' : '❌'} Customer ${found ? 'found' : 'not found'} in search results`);
      if (found) {
        const result = specificResults.find(r => r.id === problemCustomerId);
        console.log(`   - Search result: ${result.name}`);
      }
    }
  }
}

async function main() {
  console.log('🚀 Debugging Tenant Isolation...\n');
  
  await debugTenantIsolation();
  
  console.log('\n✅ Tenant isolation debug completed!');
}

main().catch(console.error);
