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

async function debugCRUDIssue() {
  console.log('🔍 Debugging CRUD Operations Issue...');
  
  // 1. Check what customers exist in the database
  console.log('\n1. Current customers in database:');
  const { data: allCustomers, error: allError } = await supabase
    .from('customers')
    .select('*')
    .eq('tenant_id', testTenantId)
    .order('created_at', { ascending: false });
  
  if (allError) {
    console.error('❌ Error fetching customers:', allError);
    return;
  }
  
  console.log(`   Found ${allCustomers.length} customers:`);
  allCustomers.forEach(customer => {
    console.log(`   - ${customer.first_name} ${customer.last_name} (${customer.id})`);
  });
  
  // 2. Test search for the most recent customer
  if (allCustomers.length > 0) {
    const recentCustomer = allCustomers[0];
    console.log(`\n2. Testing search for most recent customer: ${recentCustomer.first_name} ${recentCustomer.last_name}`);
    
    const searchTerms = [
      recentCustomer.first_name,
      recentCustomer.last_name,
      `${recentCustomer.first_name} ${recentCustomer.last_name}`,
      recentCustomer.email
    ];
    
    for (const term of searchTerms) {
      if (term) {
        console.log(`   Searching for: "${term}"`);
        const { data: searchResults, error: searchError } = await supabase.rpc('search_customers_enhanced', {
          p_tenant_id: testTenantId,
          p_search_term: term,
          p_limit: 10
        });
        
        if (searchError) {
          console.log(`   ❌ Search failed: ${searchError.message}`);
        } else {
          const found = searchResults.some(r => r.id === recentCustomer.id);
          console.log(`   ${found ? '✅' : '❌'} Found: ${searchResults.length} results, customer ${found ? 'found' : 'not found'}`);
        }
      }
    }
  }
}

async function debugDataConsistencyIssue() {
  console.log('\n🔍 Debugging Data Consistency Issue...');
  
  const problemCustomerId = '6ae48256-ab39-4326-bcd7-d3cd5b71c191';
  
  // 1. Get the actual customer data from database
  console.log(`\n1. Fetching customer data for ${problemCustomerId}:`);
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('*')
    .eq('id', problemCustomerId)
    .single();
  
  if (customerError) {
    console.error('❌ Error fetching customer:', customerError);
    return;
  }
  
  console.log('   Actual customer data:');
  console.log(`   - Name: ${customer.first_name} ${customer.last_name}`);
  console.log(`   - Email: ${customer.email}`);
  console.log(`   - Phone: ${customer.phone}`);
  console.log(`   - Address: ${customer.address}`);
  console.log(`   - Status: ${customer.status}`);
  console.log(`   - Type: ${customer.account_type}`);
  
  // 2. Test search and compare results
  console.log(`\n2. Testing search for this customer:`);
  const { data: searchResults, error: searchError } = await supabase.rpc('search_customers_enhanced', {
    p_tenant_id: testTenantId,
    p_search_term: customer.first_name,
    p_limit: 10
  });
  
  if (searchError) {
    console.error('❌ Search failed:', searchError);
    return;
  }
  
  const searchResult = searchResults.find(r => r.id === problemCustomerId);
  if (searchResult) {
    console.log('   Search result data:');
    console.log(`   - Name: ${searchResult.name}`);
    console.log(`   - Email: ${searchResult.email}`);
    console.log(`   - Phone: ${searchResult.phone}`);
    console.log(`   - Address: ${searchResult.address}`);
    console.log(`   - Status: ${searchResult.status}`);
    console.log(`   - Type: ${searchResult.type}`);
    
    // Compare the data
    console.log('\n3. Data comparison:');
    const mismatches = [];
    
    if (searchResult.name !== `${customer.first_name} ${customer.last_name}`) {
      mismatches.push(`Name: expected "${customer.first_name} ${customer.last_name}", got "${searchResult.name}"`);
    }
    if (searchResult.email !== customer.email) {
      mismatches.push(`Email: expected "${customer.email}", got "${searchResult.email}"`);
    }
    if (searchResult.phone !== customer.phone) {
      mismatches.push(`Phone: expected "${customer.phone}", got "${searchResult.phone}"`);
    }
    if (searchResult.address !== customer.address) {
      mismatches.push(`Address: expected "${customer.address}", got "${searchResult.address}"`);
    }
    if (searchResult.status !== customer.status) {
      mismatches.push(`Status: expected "${customer.status}", got "${searchResult.status}"`);
    }
    if (searchResult.type !== customer.account_type) {
      mismatches.push(`Type: expected "${customer.account_type}", got "${searchResult.type}"`);
    }
    
    if (mismatches.length === 0) {
      console.log('   ✅ All data matches perfectly!');
    } else {
      console.log('   ❌ Data mismatches found:');
      mismatches.forEach(mismatch => console.log(`   - ${mismatch}`));
    }
  } else {
    console.log('   ❌ Customer not found in search results');
  }
}

async function main() {
  console.log('🚀 Debugging Remaining Issues...\n');
  
  await debugCRUDIssue();
  await debugDataConsistencyIssue();
  
  console.log('\n✅ Debug completed!');
}

main().catch(console.error);
