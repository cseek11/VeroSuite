// ============================================================================
// DEBUG SEARCH ISSUE
// ============================================================================
// Debug script to test search functionality and identify why no results are returned

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugSearchIssue() {
  try {
    console.log('🔍 Debugging Search Issue...\n');
    
    // Test 1: Check if we can get all customers without any filters
    console.log('1️⃣ Testing basic customer fetch without filters...');
    const { data: allCustomers, error: allError } = await supabase
      .from('accounts')
      .select('*')
      .limit(10);
    
    if (allError) {
      console.log('❌ Error fetching all customers:', allError.message);
    } else {
      console.log(`✅ Found ${allCustomers.length} customers without filters:`);
      allCustomers.forEach(customer => {
        console.log(`   - ${customer.name} (${customer.tenant_id})`);
      });
    }
    console.log('');
    
    // Test 2: Check with tenant filter
    console.log('2️⃣ Testing with tenant filter...');
    const { data: tenantCustomers, error: tenantError } = await supabase
      .from('accounts')
      .select('*')
      .eq('tenant_id', 'fb39f15b-b382-4525-8404-1e32ca1486c9')
      .limit(10);
    
    if (tenantError) {
      console.log('❌ Error fetching customers with tenant filter:', tenantError.message);
    } else {
      console.log(`✅ Found ${tenantCustomers.length} customers with tenant filter:`);
      tenantCustomers.forEach(customer => {
        console.log(`   - ${customer.name} (${customer.tenant_id})`);
      });
    }
    console.log('');
    
    // Test 3: Test search with empty search term
    console.log('3️⃣ Testing search with empty search term...');
    const { data: emptySearch, error: emptyError } = await supabase
      .from('accounts')
      .select('*')
      .eq('tenant_id', 'fb39f15b-b382-4525-8404-1e32ca1486c9')
      .order('name', { ascending: true });
    
    if (emptyError) {
      console.log('❌ Error with empty search:', emptyError.message);
    } else {
      console.log(`✅ Found ${emptySearch.length} customers with empty search:`);
      emptySearch.forEach(customer => {
        console.log(`   - ${customer.name}`);
      });
    }
    console.log('');
    
    // Test 4: Test search with a simple term
    console.log('4️⃣ Testing search with "john"...');
    const searchTerm = 'john';
    const { data: johnSearch, error: johnError } = await supabase
      .from('accounts')
      .select('*')
      .eq('tenant_id', 'fb39f15b-b382-4525-8404-1e32ca1486c9')
      .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
      .order('name', { ascending: true });
    
    if (johnError) {
      console.log('❌ Error searching for "john":', johnError.message);
    } else {
      console.log(`✅ Found ${johnSearch.length} customers searching for "john":`);
      johnSearch.forEach(customer => {
        console.log(`   - ${customer.name} (${customer.phone})`);
      });
    }
    console.log('');
    
    // Test 5: Check what happens with the complex search query
    console.log('5️⃣ Testing complex search query...');
    const complexSearchTerm = 'john';
    const phoneDigits = complexSearchTerm.replace(/\D/g, '');
    const tokens = complexSearchTerm.toLowerCase().split(/\s+/).filter(token => token.length > 0);
    
    let searchQuery = `name.ilike.%${complexSearchTerm}%,email.ilike.%${complexSearchTerm}%`;
    
    if (phoneDigits.length > 0) {
      searchQuery += `,phone.ilike.%${complexSearchTerm}%,phone_digits.ilike.%${phoneDigits}%`;
      searchQuery += `,phone.ilike.%${phoneDigits}%`;
    } else {
      searchQuery += `,phone.ilike.%${complexSearchTerm}%`;
    }
    
    if (tokens.length > 1) {
      tokens.forEach(token => {
        searchQuery += `,address.ilike.%${token}%,city.ilike.%${token}%,state.ilike.%${token}%,zip_code.ilike.%${token}%`;
      });
    } else {
      searchQuery += `,address.ilike.%${complexSearchTerm}%,city.ilike.%${complexSearchTerm}%,state.ilike.%${complexSearchTerm}%,zip_code.ilike.%${complexSearchTerm}%`;
    }
    
    searchQuery += `,account_type.ilike.%${complexSearchTerm}%,status.ilike.%${complexSearchTerm}%`;
    
    console.log('   Search query:', searchQuery);
    
    const { data: complexSearch, error: complexError } = await supabase
      .from('accounts')
      .select('*')
      .eq('tenant_id', 'fb39f15b-b382-4525-8404-1e32ca1486c9')
      .or(searchQuery)
      .order('name', { ascending: true });
    
    if (complexError) {
      console.log('❌ Error with complex search:', complexError.message);
    } else {
      console.log(`✅ Found ${complexSearch.length} customers with complex search:`);
      complexSearch.forEach(customer => {
        console.log(`   - ${customer.name} (${customer.phone})`);
      });
    }
    console.log('');
    
    console.log('🎉 Search debugging completed!');
    console.log('');
    console.log('📋 Summary:');
    console.log('   This will help identify where the search is failing');
    console.log('   Check the results above to see which step returns no data');
    
  } catch (error) {
    console.error('❌ Error in search debugging:', error);
  }
}

// Run the debug
debugSearchIssue();



















