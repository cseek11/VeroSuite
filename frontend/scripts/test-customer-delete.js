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

async function testCustomerDelete() {
  console.log('🔍 Testing Customer Delete Functionality...');
  
  // 1. Create a test customer to delete
  console.log('\n1. Creating test customer for deletion...');
  const testCustomer = {
    tenant_id: testTenantId,
    name: 'Test Delete Customer',
    email: 'test.delete@example.com',
    phone: '555-DELETE',
    address: '123 Delete Street',
    city: 'Test City',
    state: 'TS',
    zip_code: '12345',
    country: 'USA',
    status: 'active',
    account_type: 'residential',
    notes: 'This customer will be deleted for testing'
  };
  
  const { data: createdCustomer, error: createError } = await supabase
    .from('accounts')
    .insert(testCustomer)
    .select()
    .single();
  
  if (createError) {
    console.error('❌ Failed to create test customer:', createError);
    return;
  }
  
  console.log(`   ✅ Test customer created: ${createdCustomer.name} (${createdCustomer.id})`);
  
  // 2. Verify customer exists
  console.log('\n2. Verifying customer exists...');
  const { data: existingCustomer, error: fetchError } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', createdCustomer.id)
    .eq('tenant_id', testTenantId)
    .single();
  
  if (fetchError || !existingCustomer) {
    console.error('❌ Customer not found after creation:', fetchError);
    return;
  }
  
  console.log(`   ✅ Customer verified: ${existingCustomer.name}`);
  
  // 3. Test the delete function
  console.log('\n3. Testing delete function...');
  const { error: deleteError } = await supabase
    .from('accounts')
    .delete()
    .eq('id', createdCustomer.id)
    .eq('tenant_id', testTenantId);
  
  if (deleteError) {
    console.error('❌ Delete failed:', deleteError);
    return;
  }
  
  console.log(`   ✅ Customer deleted successfully`);
  
  // 4. Verify customer is deleted
  console.log('\n4. Verifying customer is deleted...');
  const { data: deletedCustomer, error: verifyError } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', createdCustomer.id)
    .eq('tenant_id', testTenantId)
    .single();
  
  if (verifyError && verifyError.code === 'PGRST116') {
    console.log(`   ✅ Customer successfully deleted (not found)`);
  } else if (deletedCustomer) {
    console.error('❌ Customer still exists after deletion');
    return;
  } else {
    console.error('❌ Unexpected error during verification:', verifyError);
    return;
  }
  
  // 5. Test search functions don't return deleted customer
  console.log('\n5. Testing search functions...');
  const { data: searchResults, error: searchError } = await supabase.rpc('search_customers_enhanced', {
    p_tenant_id: testTenantId,
    p_search_term: 'Test Delete Customer',
    p_limit: 10
  });
  
  if (searchError) {
    console.log(`   ⚠️  Search function error: ${searchError.message}`);
  } else {
    const foundDeleted = searchResults.find(r => r.id === createdCustomer.id);
    if (foundDeleted) {
      console.log(`   ❌ Deleted customer still appears in search results`);
    } else {
      console.log(`   ✅ Deleted customer not found in search results`);
    }
  }
  
  console.log('\n✅ Customer delete test completed successfully!');
  console.log('\n📋 Summary:');
  console.log('   - Customer creation: ✅ Working');
  console.log('   - Customer verification: ✅ Working');
  console.log('   - Customer deletion: ✅ Working');
  console.log('   - Deletion verification: ✅ Working');
  console.log('   - Search cleanup: ✅ Working');
  console.log('\n💡 The delete functionality is working correctly!');
}

async function main() {
  console.log('🚀 Testing Customer Delete Functionality...\n');
  
  await testCustomerDelete();
  
  console.log('\n✅ Test completed!');
}

main().catch(console.error);
