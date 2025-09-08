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

async function testCRUDFix() {
  console.log('🔧 Testing CRUD Operations Fix...');
  
  // Test 1: Create customer
  console.log('\n  Testing customer creation...');
  const newCustomer = {
    tenant_id: testTenantId,
    first_name: 'CRUDTest',
    last_name: 'Customer',
    email: 'crudtest.customer@example.com',
    phone: '(555) 777-6666',
    address: '777 CRUD Street',
    city: 'Test City',
    state: 'TS',
    zip_code: '77777',
    country: 'USA',
    status: 'active',
    account_type: 'residential',
    notes: 'CRUD test customer'
  };
  
  const { data: createdCustomer, error: createError } = await supabase
    .from('customers')
    .insert(newCustomer)
    .select()
    .single();
  
  if (createError) {
    console.log(`    ❌ Customer creation: ${createError.message}`);
    return false;
  }
  
  console.log(`    ✅ Customer creation: ${createdCustomer.id}`);
  
  // Test 2: Search for created customer using different search terms
  console.log('\n  Testing search for created customer...');
  
  const searchTerms = [
    'CRUDTest',           // First name
    'Customer',           // Last name  
    'CRUDTest Customer',  // Full name
    'crudtest.customer@example.com', // Email
    '(555) 777-6666',     // Phone
    '777 CRUD Street'     // Address
  ];
  
  let foundInAnySearch = false;
  
  for (const searchTerm of searchTerms) {
    console.log(`    Searching for: "${searchTerm}"`);
    const { data: searchResults, error: searchError } = await supabase.rpc('search_customers_enhanced', {
      p_tenant_id: testTenantId,
      p_search_term: searchTerm,
      p_limit: 5
    });
    
    if (searchError) {
      console.log(`      ❌ Search failed: ${searchError.message}`);
      continue;
    }
    
    const foundCustomer = searchResults.find(r => r.id === createdCustomer.id);
    if (foundCustomer) {
      console.log(`      ✅ Found customer: ${foundCustomer.name}`);
      foundInAnySearch = true;
      break;
    } else {
      console.log(`      ❌ Customer not found in ${searchResults.length} results`);
    }
  }
  
  if (!foundInAnySearch) {
    console.log(`    ❌ Created customer not found in any search results`);
    return false;
  }
  
  console.log(`    ✅ Created customer found in search results`);
  
  // Test 3: Test multi-word search
  console.log('\n  Testing multi-word search...');
  const { data: multiWordResults, error: multiWordError } = await supabase.rpc('search_customers_multi_word', {
    p_tenant_id: testTenantId,
    p_search_term: 'CRUDTest Customer',
    p_limit: 5
  });
  
  if (multiWordError) {
    console.log(`    ❌ Multi-word search failed: ${multiWordError.message}`);
    return false;
  }
  
  const foundInMultiWord = multiWordResults.find(r => r.id === createdCustomer.id);
  if (foundInMultiWord) {
    console.log(`    ✅ Found in multi-word search: ${foundInMultiWord.name}`);
  } else {
    console.log(`    ❌ Not found in multi-word search`);
    return false;
  }
  
  // Test 4: Clean up - delete the test customer
  console.log('\n  Cleaning up test customer...');
  const { error: deleteError } = await supabase
    .from('customers')
    .delete()
    .eq('id', createdCustomer.id);
  
  if (deleteError) {
    console.log(`    ⚠️  Cleanup failed: ${deleteError.message}`);
  } else {
    console.log(`    ✅ Test customer cleaned up`);
  }
  
  return true;
}

async function main() {
  console.log('🚀 Testing CRUD Operations Fix...\n');
  
  const success = await testCRUDFix();
  
  console.log(`\n${success ? '✅' : '❌'} CRUD Operations Test: ${success ? 'PASSED' : 'FAILED'}`);
}

main().catch(console.error);
