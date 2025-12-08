// ============================================================================
// SEARCH PERFORMANCE TEST SCRIPT
// ============================================================================
// Tests the enhanced search functionality with various scenarios

import { createClient } from '@supabase/supabase-js';
import { SearchUtils } from '../src/utils/searchUtils.ts';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
      const results = SearchUtils.searchCustomers(customers, testCase.search);
      
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
      const query = SearchUtils.buildSearchQuery(search);
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
