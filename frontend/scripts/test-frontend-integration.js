// ============================================================================
// FRONTEND INTEGRATION TEST SCRIPT
// ============================================================================
// This script tests the frontend integration of the unified search service
// with the existing CRM components

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// ============================================================================
// CONFIGURATION
// ============================================================================

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
  console.error('Required: VITE_SUPABASE_URL, SUPABASE_SECRET_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test data
const testTenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';
const testUserId = '00000000-0000-0000-0000-000000000001';

// ============================================================================
// TEST FUNCTIONS
// ============================================================================

async function testSearchIntegration() {
  console.log('🔍 Testing Search Integration...');
  
  try {
    // Test 1: Search with unified search service
    console.log('\n1. Testing unified search service...');
    const { data: searchResults, error: searchError } = await supabase.rpc('search_customers_enhanced', {
      p_tenant_id: testTenantId,
      p_search_term: 'John',
      p_limit: 5
    });
    
    if (searchError) {
      console.error('❌ Search failed:', searchError.message);
      return false;
    }
    
    console.log(`✅ Search successful: Found ${searchResults.length} results`);
    searchResults.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.name} (${result.email}) - ${Math.round(result.score * 100)}% match`);
    });
    
    // Test 2: Test search error logging
    console.log('\n2. Testing search error logging...');
    const { error: logError } = await supabase.rpc('log_search_success', {
      p_operation: 'test_search',
      p_query: 'John',
      p_results_count: searchResults.length,
      p_execution_time_ms: 150,
      p_context: {
        tenantId: testTenantId,
        userId: testUserId,
        searchType: 'enhanced'
      }
    });
    
    if (logError) {
      console.error('❌ Log search success failed:', logError.message);
      return false;
    }
    
    console.log('✅ Search success logged');
    
    // Test 3: Test error statistics
    console.log('\n3. Testing error statistics...');
    const { data: stats, error: statsError } = await supabase.rpc('get_error_statistics', {
      p_tenant_id: testTenantId,
      p_hours_back: 24
    });
    
    if (statsError) {
      console.error('❌ Get error statistics failed:', statsError.message);
      return false;
    }
    
    console.log('✅ Error statistics retrieved:', stats);
    
    return true;
    
  } catch (error) {
    console.error('❌ Search integration test failed:', error.message);
    return false;
  }
}

async function testCustomerCRUD() {
  console.log('\n🔧 Testing Customer CRUD Operations...');
  
  try {
    // Test 1: Create customer
    console.log('\n1. Testing customer creation...');
    const newCustomer = {
      tenant_id: testTenantId,
      first_name: 'Test',
      last_name: 'Customer',
      email: 'test.customer@example.com',
      phone: '(555) 123-4567',
      address: '123 Test Street',
      city: 'Test City',
      state: 'TS',
      zip_code: '12345',
      country: 'USA',
      status: 'active',
      account_type: 'residential',
      notes: 'Test customer for frontend integration'
    };
    
    const { data: createdCustomer, error: createError } = await supabase
      .from('customers')
      .insert(newCustomer)
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Customer creation failed:', createError.message);
      return false;
    }
    
    console.log('✅ Customer created:', createdCustomer.id);
    
    // Test 2: Search for created customer
    console.log('\n2. Testing search for created customer...');
    const { data: searchResults, error: searchError } = await supabase.rpc('search_customers_enhanced', {
      p_tenant_id: testTenantId,
      p_search_term: 'Test Customer',
      p_limit: 5
    });
    
    if (searchError) {
      console.error('❌ Search for created customer failed:', searchError.message);
      return false;
    }
    
    const foundCustomer = searchResults.find(r => r.id === createdCustomer.id);
    if (!foundCustomer) {
      console.error('❌ Created customer not found in search results');
      return false;
    }
    
    console.log('✅ Created customer found in search results');
    
    // Test 3: Update customer
    console.log('\n3. Testing customer update...');
    const { data: updatedCustomer, error: updateError } = await supabase
      .from('customers')
      .update({ 
        email: 'updated.test.customer@example.com',
        phone: '(555) 987-6543'
      })
      .eq('id', createdCustomer.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('❌ Customer update failed:', updateError.message);
      return false;
    }
    
    console.log('✅ Customer updated');
    
    // Test 4: Search for updated customer
    console.log('\n4. Testing search for updated customer...');
    const { data: updatedSearchResults, error: updatedSearchError } = await supabase.rpc('search_customers_enhanced', {
      p_tenant_id: testTenantId,
      p_search_term: 'updated.test.customer@example.com',
      p_limit: 5
    });
    
    if (updatedSearchError) {
      console.error('❌ Search for updated customer failed:', updatedSearchError.message);
      return false;
    }
    
    const foundUpdatedCustomer = updatedSearchResults.find(r => r.id === createdCustomer.id);
    if (!foundUpdatedCustomer) {
      console.error('❌ Updated customer not found in search results');
      return false;
    }
    
    console.log('✅ Updated customer found in search results');
    
    // Test 5: Delete customer
    console.log('\n5. Testing customer deletion...');
    const { error: deleteError } = await supabase
      .from('customers')
      .delete()
      .eq('id', createdCustomer.id);
    
    if (deleteError) {
      console.error('❌ Customer deletion failed:', deleteError.message);
      return false;
    }
    
    console.log('✅ Customer deleted');
    
    return true;
    
  } catch (error) {
    console.error('❌ Customer CRUD test failed:', error.message);
    return false;
  }
}

async function testSearchPerformance() {
  console.log('\n⚡ Testing Search Performance...');
  
  try {
    const searchTerms = ['John', 'Smith', 'test@example.com', '(555)', '123 Main'];
    const results = [];
    
    for (const term of searchTerms) {
      const startTime = Date.now();
      
      const { data, error } = await supabase.rpc('search_customers_enhanced', {
        p_tenant_id: testTenantId,
        p_search_term: term,
        p_limit: 10
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      if (error) {
        console.error(`❌ Search failed for "${term}":`, error.message);
        continue;
      }
      
      results.push({
        term,
        duration,
        resultCount: data.length
      });
      
      console.log(`✅ "${term}": ${duration}ms, ${data.length} results`);
    }
    
    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    const maxDuration = Math.max(...results.map(r => r.duration));
    const minDuration = Math.min(...results.map(r => r.duration));
    
    console.log(`\n📊 Performance Summary:`);
    console.log(`   Average: ${avgDuration.toFixed(1)}ms`);
    console.log(`   Min: ${minDuration}ms`);
    console.log(`   Max: ${maxDuration}ms`);
    
    // Performance should be under 200ms
    if (avgDuration > 200) {
      console.log('⚠️  Average search time is above 200ms target');
      return false;
    }
    
    console.log('✅ Performance within acceptable limits');
    return true;
    
  } catch (error) {
    console.error('❌ Performance test failed:', error.message);
    return false;
  }
}

async function testErrorHandling() {
  console.log('\n🚨 Testing Error Handling...');
  
  try {
    // Test 1: Invalid search term
    console.log('\n1. Testing invalid search term...');
    const { data: invalidResults, error: invalidError } = await supabase.rpc('search_customers_enhanced', {
      p_tenant_id: testTenantId,
      p_search_term: '',
      p_limit: 10
    });
    
    if (invalidError) {
      console.log('✅ Invalid search term properly rejected');
    } else {
      console.log('⚠️  Invalid search term should have been rejected');
    }
    
    // Test 2: Invalid tenant ID
    console.log('\n2. Testing invalid tenant ID...');
    const { data: invalidTenantResults, error: invalidTenantError } = await supabase.rpc('search_customers_enhanced', {
      p_tenant_id: '00000000-0000-0000-0000-000000000000',
      p_search_term: 'test',
      p_limit: 10
    });
    
    if (invalidTenantError) {
      console.log('✅ Invalid tenant ID properly rejected');
    } else {
      console.log('⚠️  Invalid tenant ID should have been rejected');
    }
    
    // Test 3: Log error
    console.log('\n3. Testing error logging...');
    const { error: logError } = await supabase.rpc('log_search_error', {
      p_operation: 'test_error',
      p_query: 'test',
      p_error_message: 'Test error for frontend integration',
      p_error_type: 'validation',
      p_severity: 'low',
      p_context: {
        tenantId: testTenantId,
        userId: testUserId,
        testType: 'frontend_integration'
      }
    });
    
    if (logError) {
      console.error('❌ Error logging failed:', logError.message);
      return false;
    }
    
    console.log('✅ Error logged successfully');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error handling test failed:', error.message);
    return false;
  }
}

// ============================================================================
// MAIN TEST EXECUTION
// ============================================================================

async function runFrontendIntegrationTests() {
  console.log('🚀 Starting Frontend Integration Tests...\n');
  
  const tests = [
    { name: 'Search Integration', fn: testSearchIntegration },
    { name: 'Customer CRUD', fn: testCustomerCRUD },
    { name: 'Search Performance', fn: testSearchPerformance },
    { name: 'Error Handling', fn: testErrorHandling }
  ];
  
  const results = [];
  
  for (const test of tests) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🧪 Running: ${test.name}`);
    console.log(`${'='.repeat(50)}`);
    
    try {
      const success = await test.fn();
      results.push({ name: test.name, success });
      
      if (success) {
        console.log(`\n✅ ${test.name}: PASSED`);
      } else {
        console.log(`\n❌ ${test.name}: FAILED`);
      }
    } catch (error) {
      console.error(`\n💥 ${test.name}: ERROR - ${error.message}`);
      results.push({ name: test.name, success: false });
    }
  }
  
  // Summary
  console.log(`\n${'='.repeat(50)}`);
  console.log('📊 FRONTEND INTEGRATION TEST RESULTS');
  console.log(`${'='.repeat(50)}`);
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  const successRate = (passed / total) * 100;
  
  results.forEach(result => {
    const status = result.success ? '✅ PASSED' : '❌ FAILED';
    console.log(`${status}: ${result.name}`);
  });
  
  console.log(`\n📈 Overall Success Rate: ${successRate.toFixed(1)}% (${passed}/${total})`);
  
  if (successRate >= 90) {
    console.log('🎉 Frontend integration is ready for production!');
  } else if (successRate >= 75) {
    console.log('⚠️  Frontend integration has minor issues but is functional');
  } else {
    console.log('🚨 Frontend integration needs significant fixes');
  }
  
  return successRate >= 75;
}

// Run tests
runFrontendIntegrationTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Test execution failed:', error);
    process.exit(1);
  });
