// ============================================================================
// SIMPLIFIED SEARCH PERFORMANCE TEST
// ============================================================================
// Tests the enhanced search functionality with various scenarios

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Simple search utility functions for testing
const normalizePhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
};

const matchPhone = (searchTerm, phone, phoneDigits) => {
  if (!phone || !searchTerm) return false;
  
  const searchDigits = searchTerm.replace(/\D/g, '');
  const normalizedPhoneDigits = phoneDigits || normalizePhone(phone);
  
  if (searchDigits.length > 0) {
    return normalizedPhoneDigits.includes(searchDigits) || phone.includes(searchTerm);
  }
  
  return phone.toLowerCase().includes(searchTerm.toLowerCase());
};

const tokenizeSearch = (searchTerm) => {
  return searchTerm.toLowerCase().split(/\s+/).filter(token => token.length > 0);
};

const matchAddress = (searchTerm, address, city, state, zip) => {
  if (!searchTerm) return false;
  
  const tokens = tokenizeSearch(searchTerm);
  const addressFields = [address, city, state, zip].filter(Boolean).map(field => field.toLowerCase());
  
  if (tokens.length > 1) {
    return tokens.every(token => 
      addressFields.some(field => field.includes(token))
    );
  } else {
    return addressFields.some(field => field.includes(searchTerm.toLowerCase()));
  }
};

const calculateRelevance = (searchTerm, customer) => {
  const searchLower = searchTerm.toLowerCase();
  const matchedFields = [];
  let relevance = 0;

  // Phone number matching (highest priority for digits)
  if (matchPhone(searchTerm, customer.phone, customer.phone_digits)) {
    matchedFields.push('phone');
    relevance += 100;
    if (customer.phone.toLowerCase().includes(searchLower)) {
      relevance += 50;
    }
  }

  // Name matching (high priority)
  if (customer.name?.toLowerCase().includes(searchLower)) {
    matchedFields.push('name');
    relevance += 80;
    if (customer.name.toLowerCase() === searchLower) {
      relevance += 40;
    }
  }

  // Address matching
  if (matchAddress(searchTerm, customer.address, customer.city, customer.state, customer.zip_code)) {
    matchedFields.push('address');
    relevance += 60;
  }

  // Email matching
  if (customer.email?.toLowerCase().includes(searchLower)) {
    matchedFields.push('email');
    relevance += 40;
    if (customer.email.toLowerCase() === searchLower) {
      relevance += 20;
    }
  }

  // Status matching
  if (customer.status?.toLowerCase().includes(searchLower)) {
    matchedFields.push('status');
    relevance += 30;
  }

  // Account type matching
  if (customer.account_type?.toLowerCase().includes(searchLower)) {
    matchedFields.push('account_type');
    relevance += 30;
  }

  return {
    customer,
    relevance,
    matchedFields
  };
};

const searchCustomers = (customers, searchTerm) => {
  if (!searchTerm.trim()) {
    return customers.map(customer => ({
      customer,
      relevance: 0,
      matchedFields: []
    }));
  }

  const results = [];

  for (const customer of customers) {
    const result = calculateRelevance(searchTerm, customer);
    if (result.relevance > 0) {
      results.push(result);
    }
  }

  return results.sort((a, b) => b.relevance - a.relevance);
};

// Test cases for search validation
const testCases = [
  // Phone number tests
  { name: 'Phone - Full formatted', search: '(412) 555-1234', expected: 'Should find exact match' },
  { name: 'Phone - Digits only', search: '4125551234', expected: 'Should find same customer' },
  { name: 'Phone - Partial digits', search: '5551234', expected: 'Should find customer with 555-1234' },
  { name: 'Phone - Area code only', search: '412', expected: 'Should find all 412 area code customers' },
  
  // Address tests
  { name: 'Address - Full address', search: '321 Oak Street', expected: 'Should find exact address' },
  { name: 'Address - Partial street', search: '321 oak', expected: 'Should find 321 Oak Street' },
  { name: 'Address - Street name only', search: 'oak', expected: 'Should find all Oak addresses' },
  { name: 'Address - City only', search: 'pittsburgh', expected: 'Should find all Pittsburgh customers' },
  
  // Name tests
  { name: 'Name - Full name', search: 'John Smith', expected: 'Should find exact name' },
  { name: 'Name - Partial name', search: 'john', expected: 'Should find John Smith' },
  { name: 'Name - Last name only', search: 'smith', expected: 'Should find John Smith' },
  
  // Email tests
  { name: 'Email - Full email', search: 'john@example.com', expected: 'Should find exact email' },
  { name: 'Email - Partial email', search: 'john@', expected: 'Should find john@example.com' },
  { name: 'Email - Domain only', search: 'example.com', expected: 'Should find all example.com emails' },
  
  // Mixed tests
  { name: 'Mixed - Phone and name', search: '412 john', expected: 'Should find John with 412 area code' },
  { name: 'Mixed - Address and status', search: 'oak active', expected: 'Should find active customers on Oak' },
];

async function testSearchPerformance() {
  try {
    console.log('🔍 Testing Search Performance...\n');
    
    // Get all customers for testing
    const { data: customers, error } = await supabase
      .from('accounts')
      .select('*')
      .limit(50); // Limit for testing
    
    if (error) {
      throw error;
    }
    
    console.log(`📊 Testing with ${customers.length} customers\n`);
    
    // Test each search case
    for (const testCase of testCases) {
      console.log(`🧪 Testing: ${testCase.name}`);
      console.log(`   Search: "${testCase.search}"`);
      console.log(`   Expected: ${testCase.expected}`);
      
      const startTime = performance.now();
      
      // Test client-side search
      const results = searchCustomers(customers, testCase.search);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.log(`   Results: ${results.length} matches found`);
      console.log(`   Duration: ${duration.toFixed(2)}ms`);
      
      if (results.length > 0) {
        console.log(`   Top match: ${results[0].customer.name} (relevance: ${results[0].relevance})`);
        console.log(`   Matched fields: ${results[0].matchedFields.join(', ')}`);
      }
      
      console.log('');
    }
    
    // Test server-side search query building
    console.log('🔧 Testing Server-Side Query Building:');
    const sampleSearches = ['5551234', '321 oak', 'john smith'];
    
    for (const search of sampleSearches) {
      const phoneDigits = search.replace(/\D/g, '');
      let query = `name.ilike.%${search}%,email.ilike.%${search}%`;
      
      if (phoneDigits.length > 0) {
        query += `,phone.ilike.%${search}%,phone.ilike.%${phoneDigits}%`;
      } else {
        query += `,phone.ilike.%${search}%`;
      }
      
      const tokens = tokenizeSearch(search);
      if (tokens.length > 1) {
        tokens.forEach(token => {
          query += `,address.ilike.%${token}%,city.ilike.%${token}%,state.ilike.%${token}%,zip_code.ilike.%${token}%`;
        });
      } else {
        query += `,address.ilike.%${search}%,city.ilike.%${search}%,state.ilike.%${search}%,zip_code.ilike.%${search}%`;
      }
      
      query += `,account_type.ilike.%${search}%,status.ilike.%${search}%`;
      
      console.log(`   Search: "${search}"`);
      console.log(`   Query: ${query.substring(0, 100)}...`);
      console.log('');
    }
    
    console.log('✅ Search performance test completed!');
    
  } catch (error) {
    console.error('❌ Error testing search performance:', error);
  }
}

// Run the test
testSearchPerformance();
