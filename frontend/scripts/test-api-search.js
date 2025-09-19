// ============================================================================
// API SEARCH TEST SCRIPT
// ============================================================================
// Tests the API search functionality directly

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testApiSearch() {
  try {
    console.log('🔍 Testing API Search Functionality...\n');
    
    // Test 1: Search for "5551234" using the same logic as the API
    console.log('1️⃣ Testing search for "5551234":');
    const searchTerm = '5551234';
    const phoneDigits = searchTerm.replace(/\D/g, '');
    
    console.log(`   Search term: "${searchTerm}"`);
    console.log(`   Phone digits: "${phoneDigits}"`);
    
    // Build the search query exactly like the API does
    let searchQuery = `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`;
    
    if (phoneDigits.length > 0) {
      searchQuery += `,phone.ilike.%${searchTerm}%,phone_digits.ilike.%${phoneDigits}%`;
      searchQuery += `,phone.ilike.%${phoneDigits}%`;
    } else {
      searchQuery += `,phone.ilike.%${searchTerm}%`;
    }
    
    // Add address search
    const addressTokens = searchTerm.split(/\s+/).filter(token => token.length > 0);
    if (addressTokens.length > 1) {
      addressTokens.forEach(token => {
        searchQuery += `,address.ilike.%${token}%,city.ilike.%${token}%,state.ilike.%${token}%,zip_code.ilike.%${token}%`;
      });
    } else {
      searchQuery += `,address.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,state.ilike.%${searchTerm}%,zip_code.ilike.%${searchTerm}%`;
    }
    
    searchQuery += `,account_type.ilike.%${searchTerm}%,status.ilike.%${searchTerm}%`;
    
    console.log(`   Search query: ${searchQuery.substring(0, 100)}...`);
    
    // Execute the search
    const { data: results, error } = await supabase
      .from('accounts')
      .select('name, phone, phone_digits')
      .or(searchQuery);
    
    if (error) {
      console.log(`   ❌ Error: ${error.message}`);
    } else {
      console.log(`   ✅ Found ${results.length} results:`);
      results.forEach(c => console.log(`      - ${c.name}: ${c.phone} (${c.phone_digits})`));
    }
    console.log('');
    
    // Test 2: Search for "john"
    console.log('2️⃣ Testing search for "john":');
    const searchTerm2 = 'john';
    const phoneDigits2 = searchTerm2.replace(/\D/g, '');
    
    let searchQuery2 = `name.ilike.%${searchTerm2}%,email.ilike.%${searchTerm2}%`;
    
    if (phoneDigits2.length > 0) {
      searchQuery2 += `,phone.ilike.%${searchTerm2}%,phone_digits.ilike.%${phoneDigits2}%`;
      searchQuery2 += `,phone.ilike.%${phoneDigits2}%`;
    } else {
      searchQuery2 += `,phone.ilike.%${searchTerm2}%`;
    }
    
    const addressTokens2 = searchTerm2.split(/\s+/).filter(token => token.length > 0);
    if (addressTokens2.length > 1) {
      addressTokens2.forEach(token => {
        searchQuery2 += `,address.ilike.%${token}%,city.ilike.%${token}%,state.ilike.%${token}%,zip_code.ilike.%${token}%`;
      });
    } else {
      searchQuery2 += `,address.ilike.%${searchTerm2}%,city.ilike.%${searchTerm2}%,state.ilike.%${searchTerm2}%,zip_code.ilike.%${searchTerm2}%`;
    }
    
    searchQuery2 += `,account_type.ilike.%${searchTerm2}%,status.ilike.%${searchTerm2}%`;
    
    const { data: results2, error: error2 } = await supabase
      .from('accounts')
      .select('name, phone, phone_digits')
      .or(searchQuery2);
    
    if (error2) {
      console.log(`   ❌ Error: ${error2.message}`);
    } else {
      console.log(`   ✅ Found ${results2.length} results:`);
      results2.forEach(c => console.log(`      - ${c.name}: ${c.phone} (${c.phone_digits})`));
    }
    console.log('');
    
    // Test 3: Search for "321 oak"
    console.log('3️⃣ Testing search for "321 oak":');
    const searchTerm3 = '321 oak';
    const phoneDigits3 = searchTerm3.replace(/\D/g, '');
    
    let searchQuery3 = `name.ilike.%${searchTerm3}%,email.ilike.%${searchTerm3}%`;
    
    if (phoneDigits3.length > 0) {
      searchQuery3 += `,phone.ilike.%${searchTerm3}%,phone_digits.ilike.%${phoneDigits3}%`;
      searchQuery3 += `,phone.ilike.%${phoneDigits3}%`;
    } else {
      searchQuery3 += `,phone.ilike.%${searchTerm3}%`;
    }
    
    const addressTokens3 = searchTerm3.split(/\s+/).filter(token => token.length > 0);
    if (addressTokens3.length > 1) {
      addressTokens3.forEach(token => {
        searchQuery3 += `,address.ilike.%${token}%,city.ilike.%${token}%,state.ilike.%${token}%,zip_code.ilike.%${token}%`;
      });
    } else {
      searchQuery3 += `,address.ilike.%${searchTerm3}%,city.ilike.%${searchTerm3}%,state.ilike.%${searchTerm3}%,zip_code.ilike.%${searchTerm3}%`;
    }
    
    searchQuery3 += `,account_type.ilike.%${searchTerm3}%,status.ilike.%${searchTerm3}%`;
    
    const { data: results3, error: error3 } = await supabase
      .from('accounts')
      .select('name, phone, phone_digits, address, city')
      .or(searchQuery3);
    
    if (error3) {
      console.log(`   ❌ Error: ${error3.message}`);
    } else {
      console.log(`   ✅ Found ${results3.length} results:`);
      results3.forEach(c => console.log(`      - ${c.name}: ${c.address}, ${c.city}`));
    }
    
  } catch (error) {
    console.error('❌ Error testing API search:', error);
  }
}

// Run the test
testApiSearch();



















