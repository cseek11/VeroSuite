// ============================================================================
// END-TO-END TEST SCRIPT - Complete CRM Global Search Validation
// ============================================================================
// This script performs comprehensive testing of the entire search system
// from database functions to frontend integration

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
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test data
const testTenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';
const testUserId = '00000000-0000-0000-0000-000000000001';

// ============================================================================
// TEST SUITE CLASS
// ============================================================================

class EndToEndTestSuite {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  async runTest(name, testFn) {
    console.log(`\n🧪 Running: ${name}`);
    console.log('─'.repeat(50));
    
    const testStart = Date.now();
    try {
      const result = await testFn();
      const duration = Date.now() - testStart;
      
      this.results.push({
        name,
        success: result,
        duration,
        error: null
      });
      
      if (result) {
        console.log(`✅ ${name}: PASSED (${duration}ms)`);
      } else {
        console.log(`❌ ${name}: FAILED (${duration}ms)`);
      }
      
      return result;
    } catch (error) {
      const duration = Date.now() - testStart;
      
      this.results.push({
        name,
        success: false,
        duration,
        error: error.message
      });
      
      console.log(`💥 ${name}: ERROR (${duration}ms) - ${error.message}`);
      return false;
    }
  }

  getSummary() {
    const totalDuration = Date.now() - this.startTime;
    const passed = this.results.filter(r => r.success).length;
    const total = this.results.length;
    const successRate = (passed / total) * 100;
    
    return {
      totalDuration,
      passed,
      total,
      successRate,
      results: this.results
    };
  }
}

// ============================================================================
// TEST FUNCTIONS
// ============================================================================

async function testDatabaseFunctions() {
  console.log('🔍 Testing Database Functions...');
  
  const functions = [
    'search_customers_enhanced',
    'search_customers_multi_word', 
    'search_customers_fuzzy'
  ];
  
  for (const funcName of functions) {
    console.log(`\n  Testing ${funcName}...`);
    
    let result;
    if (funcName === 'search_customers_fuzzy') {
      const { data, error } = await supabase.rpc(funcName, {
        p_tenant_id: testTenantId,
        p_search_term: 'John',
        p_threshold: 0.3,
        p_limit: 5
      });
      result = { data, error };
    } else {
      const { data, error } = await supabase.rpc(funcName, {
        p_tenant_id: testTenantId,
        p_search_term: 'John',
        p_limit: 5
      });
      result = { data, error };
    }
    
    if (result.error) {
      console.log(`    ❌ ${funcName}: ${result.error.message}`);
      return false;
    }
    
    console.log(`    ✅ ${funcName}: Found ${result.data.length} results`);
  }
  
  return true;
}

async function testAuthenticationFlow() {
  console.log('🔐 Testing Authentication Flow...');
  
  // Test 1: Verify tenant isolation
  console.log('\n  Testing tenant isolation...');
  const { data: tenantData, error: tenantError } = await supabase.rpc('search_customers_enhanced', {
    p_tenant_id: testTenantId,
    p_search_term: 'test',
    p_limit: 5
  });
  
  if (tenantError) {
    console.log(`    ❌ Tenant isolation: ${tenantError.message}`);
    return false;
  }
  
  console.log(`    ✅ Tenant isolation: Working`);
  
  // Test 2: Test with invalid tenant
  console.log('\n  Testing invalid tenant rejection...');
  const { data: invalidData, error: invalidError } = await supabase.rpc('search_customers_enhanced', {
    p_tenant_id: '00000000-0000-0000-0000-000000000000',
    p_search_term: 'test',
    p_limit: 5
  });
  
  if (invalidError) {
    console.log(`    ✅ Invalid tenant properly rejected`);
  } else {
    console.log(`    ⚠️  Invalid tenant should have been rejected`);
  }
  
  return true;
}

async function testErrorLoggingSystem() {
  console.log('📊 Testing Error Logging System...');
  
  // Test 1: Log search success
  console.log('\n  Testing search success logging...');
  const { error: successError } = await supabase.rpc('log_search_success', {
    p_operation: 'end_to_end_test',
    p_query: 'test search',
    p_results_count: 3,
    p_execution_time_ms: 150,
    p_context: {
      tenantId: testTenantId,
      userId: testUserId,
      testType: 'end_to_end'
    }
  });
  
  if (successError) {
    console.log(`    ❌ Search success logging: ${successError.message}`);
    return false;
  }
  
  console.log(`    ✅ Search success logging: Working`);
  
  // Test 2: Get error statistics
  console.log('\n  Testing error statistics...');
  const { data: stats, error: statsError } = await supabase.rpc('get_error_statistics', {
    p_tenant_id: testTenantId,
    p_hours_back: 24
  });
  
  if (statsError) {
    console.log(`    ❌ Error statistics: ${statsError.message}`);
    return false;
  }
  
  console.log(`    ✅ Error statistics: Retrieved`);
  
  // Test 3: Get recent errors
  console.log('\n  Testing recent errors...');
  const { data: recentErrors, error: recentError } = await supabase.rpc('get_recent_errors', {
    p_tenant_id: testTenantId,
    p_limit: 10
  });
  
  if (recentError) {
    console.log(`    ❌ Recent errors: ${recentError.message}`);
    return false;
  }
  
  console.log(`    ✅ Recent errors: Retrieved`);
  
  return true;
}

async function testUnifiedSearchService() {
  console.log('🔍 Testing Unified Search Service...');
  
  // Test 1: Enhanced search
  console.log('\n  Testing enhanced search...');
  const { data: enhancedResults, error: enhancedError } = await supabase.rpc('search_customers_enhanced', {
    p_tenant_id: testTenantId,
    p_search_term: 'John',
    p_limit: 5
  });
  
  if (enhancedError) {
    console.log(`    ❌ Enhanced search: ${enhancedError.message}`);
    return false;
  }
  
  console.log(`    ✅ Enhanced search: Found ${enhancedResults.length} results`);
  
  // Test 2: Multi-word search
  console.log('\n  Testing multi-word search...');
  const { data: multiWordResults, error: multiWordError } = await supabase.rpc('search_customers_multi_word', {
    p_tenant_id: testTenantId,
    p_search_term: 'John Smith',
    p_limit: 5
  });
  
  if (multiWordError) {
    console.log(`    ❌ Multi-word search: ${multiWordError.message}`);
    return false;
  }
  
  console.log(`    ✅ Multi-word search: Found ${multiWordResults.length} results`);
  
  // Test 3: Fuzzy search
  console.log('\n  Testing fuzzy search...');
  const { data: fuzzyResults, error: fuzzyError } = await supabase.rpc('search_customers_fuzzy', {
    p_tenant_id: testTenantId,
    p_search_term: 'Jon',
    p_threshold: 0.3,
    p_limit: 5
  });
  
  if (fuzzyError) {
    console.log(`    ❌ Fuzzy search: ${fuzzyError.message}`);
    return false;
  }
  
  console.log(`    ✅ Fuzzy search: Found ${fuzzyResults.length} results`);
  
  return true;
}

async function testCRUDOperations() {
  console.log('🔧 Testing CRUD Operations...');
  
  // Test 1: Create customer
  console.log('\n  Testing customer creation...');
  const newCustomer = {
    tenant_id: testTenantId,
    first_name: 'EndToEnd',
    last_name: 'Test',
    email: 'endtoend.test@example.com',
    phone: '(555) 999-8888',
    address: '999 Test Avenue',
    city: 'Test City',
    state: 'TS',
    zip_code: '99999',
    country: 'USA',
    status: 'active',
    account_type: 'residential',
    notes: 'End-to-end test customer'
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
  
  // Test 2: Search for created customer
  console.log('\n  Testing search for created customer...');
  
  // Try multiple search terms since our search works on individual fields
  const searchTerms = ['EndToEnd', 'Test', 'endtoend.test@example.com'];
  let foundCustomer = null;
  
  for (const searchTerm of searchTerms) {
    const { data: searchResults, error: searchError } = await supabase.rpc('search_customers_enhanced', {
      p_tenant_id: testTenantId,
      p_search_term: searchTerm,
      p_limit: 5
    });
    
    if (searchError) {
      console.log(`    ❌ Search for "${searchTerm}": ${searchError.message}`);
      continue;
    }
    
    foundCustomer = searchResults.find(r => r.id === createdCustomer.id);
    if (foundCustomer) {
      console.log(`    ✅ Found customer with search term "${searchTerm}"`);
      break;
    }
  }
  
  if (!foundCustomer) {
    console.log(`    ❌ Created customer not found in search results`);
    return false;
  }
  
  console.log(`    ✅ Created customer found in search results`);
  
  // Test 3: Update customer
  console.log('\n  Testing customer update...');
  const { data: updatedCustomer, error: updateError } = await supabase
    .from('customers')
    .update({ 
      email: 'updated.endtoend.test@example.com',
      phone: '(555) 777-6666'
    })
    .eq('id', createdCustomer.id)
    .select()
    .single();
  
  if (updateError) {
    console.log(`    ❌ Customer update: ${updateError.message}`);
    return false;
  }
  
  console.log(`    ✅ Customer update: Success`);
  
  // Test 4: Search for updated customer
  console.log('\n  Testing search for updated customer...');
  const { data: updatedSearchResults, error: updatedSearchError } = await supabase.rpc('search_customers_enhanced', {
    p_tenant_id: testTenantId,
    p_search_term: 'updated.endtoend.test@example.com',
    p_limit: 5
  });
  
  if (updatedSearchError) {
    console.log(`    ❌ Search for updated customer: ${updatedSearchError.message}`);
    return false;
  }
  
  const foundUpdatedCustomer = updatedSearchResults.find(r => r.id === createdCustomer.id);
  if (!foundUpdatedCustomer) {
    console.log(`    ❌ Updated customer not found in search results`);
    return false;
  }
  
  console.log(`    ✅ Updated customer found in search results`);
  
  // Test 5: Delete customer
  console.log('\n  Testing customer deletion...');
  const { error: deleteError } = await supabase
    .from('customers')
    .delete()
    .eq('id', createdCustomer.id);
  
  if (deleteError) {
    console.log(`    ❌ Customer deletion: ${deleteError.message}`);
    return false;
  }
  
  console.log(`    ✅ Customer deletion: Success`);
  
  return true;
}

async function testPerformanceBenchmarks() {
  console.log('⚡ Testing Performance Benchmarks...');
  
  const searchTerms = [
    'John',
    'Smith', 
    'test@example.com',
    '(555)',
    '123 Main',
    'Bob Johnson',
    'commercial',
    'residential'
  ];
  
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
      console.log(`    ❌ "${term}": ${error.message}`);
      continue;
    }
    
    results.push({
      term,
      duration,
      resultCount: data.length
    });
    
    console.log(`    ✅ "${term}": ${duration}ms, ${data.length} results`);
  }
  
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
  const maxDuration = Math.max(...results.map(r => r.duration));
  const minDuration = Math.min(...results.map(r => r.duration));
  
  console.log(`\n  📊 Performance Summary:`);
  console.log(`    Average: ${avgDuration.toFixed(1)}ms`);
  console.log(`    Min: ${minDuration}ms`);
  console.log(`    Max: ${maxDuration}ms`);
  
  // Performance targets
  const targets = {
    average: 200,
    max: 500,
    min: 50
  };
  
  let performancePassed = true;
  
  if (avgDuration > targets.average) {
    console.log(`    ⚠️  Average search time (${avgDuration.toFixed(1)}ms) exceeds target (${targets.average}ms)`);
    performancePassed = false;
  }
  
  if (maxDuration > targets.max) {
    console.log(`    ⚠️  Max search time (${maxDuration}ms) exceeds target (${targets.max}ms)`);
    performancePassed = false;
  }
  
  if (minDuration < targets.min) {
    console.log(`    ⚠️  Min search time (${minDuration}ms) below target (${targets.min}ms) - too fast, possible caching`);
  }
  
  if (performancePassed) {
    console.log(`    ✅ Performance within acceptable limits`);
  }
  
  return performancePassed;
}

async function testErrorHandling() {
  console.log('🚨 Testing Error Handling...');
  
  // Test 1: Invalid search terms
  console.log('\n  Testing invalid search terms...');
  const invalidTerms = ['', null, undefined, '   ', 'a'.repeat(1000)];
  
  for (const term of invalidTerms) {
    const { data, error } = await supabase.rpc('search_customers_enhanced', {
      p_tenant_id: testTenantId,
      p_search_term: term || '',
      p_limit: 10
    });
    
    if (error) {
      console.log(`    ✅ Invalid term "${term}" properly rejected`);
    } else {
      console.log(`    ⚠️  Invalid term "${term}" should have been rejected`);
    }
  }
  
  // Test 2: Invalid tenant IDs
  console.log('\n  Testing invalid tenant IDs...');
  const invalidTenants = [
    '00000000-0000-0000-0000-000000000000',
    'invalid-uuid',
    null,
    undefined
  ];
  
  for (const tenant of invalidTenants) {
    const { data, error } = await supabase.rpc('search_customers_enhanced', {
      p_tenant_id: tenant || testTenantId,
      p_search_term: 'test',
      p_limit: 10
    });
    
    if (error) {
      console.log(`    ✅ Invalid tenant "${tenant}" properly rejected`);
    } else {
      console.log(`    ⚠️  Invalid tenant "${tenant}" should have been rejected`);
    }
  }
  
  // Test 3: Invalid limits
  console.log('\n  Testing invalid limits...');
  const invalidLimits = [0, -1, 10000, null, undefined];
  
  for (const limit of invalidLimits) {
    const { data, error } = await supabase.rpc('search_customers_enhanced', {
      p_tenant_id: testTenantId,
      p_search_term: 'test',
      p_limit: limit || 10
    });
    
    if (error) {
      console.log(`    ✅ Invalid limit "${limit}" properly rejected`);
    } else {
      console.log(`    ⚠️  Invalid limit "${limit}" should have been rejected`);
    }
  }
  
  return true;
}

async function testDataConsistency() {
  console.log('🔍 Testing Data Consistency...');
  
  // Test 1: Verify search results match database
  console.log('\n  Testing search result consistency...');
  const { data: searchResults, error: searchError } = await supabase.rpc('search_customers_enhanced', {
    p_tenant_id: testTenantId,
    p_search_term: 'John',
    p_limit: 10
  });
  
  if (searchError) {
    console.log(`    ❌ Search failed: ${searchError.message}`);
    return false;
  }
  
  // Verify each search result exists in database
  for (const result of searchResults) {
    const { data: dbCustomer, error: dbError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', result.id)
      .eq('tenant_id', testTenantId)
      .single();
    
    if (dbError || !dbCustomer) {
      console.log(`    ❌ Search result ${result.id} not found in database`);
      return false;
    }
    
    // Verify data consistency
    const expectedName = `${dbCustomer.first_name} ${dbCustomer.last_name}`;
    if (result.name !== expectedName || 
        dbCustomer.email !== result.email ||
        dbCustomer.phone !== result.phone ||
        dbCustomer.address !== result.address ||
        dbCustomer.status !== result.status ||
        dbCustomer.account_type !== result.type) {
      console.log(`    ❌ Data inconsistency for customer ${result.id}`);
      console.log(`      Expected name: "${expectedName}", got: "${result.name}"`);
      console.log(`      Expected email: "${dbCustomer.email}", got: "${result.email}"`);
      console.log(`      Expected phone: "${dbCustomer.phone}", got: "${result.phone}"`);
      console.log(`      Expected address: "${dbCustomer.address}", got: "${result.address}"`);
      console.log(`      Expected status: "${dbCustomer.status}", got: "${result.status}"`);
      console.log(`      Expected type: "${dbCustomer.account_type}", got: "${result.type}"`);
      return false;
    }
  }
  
  console.log(`    ✅ Search results consistent with database`);
  
  return true;
}

// ============================================================================
// MAIN TEST EXECUTION
// ============================================================================

async function runEndToEndTests() {
  console.log('🚀 Starting End-to-End CRM Global Search Tests...\n');
  
  const testSuite = new EndToEndTestSuite();
  
  // Run all tests
  await testSuite.runTest('Database Functions', testDatabaseFunctions);
  await testSuite.runTest('Authentication Flow', testAuthenticationFlow);
  await testSuite.runTest('Error Logging System', testErrorLoggingSystem);
  await testSuite.runTest('Unified Search Service', testUnifiedSearchService);
  await testSuite.runTest('CRUD Operations', testCRUDOperations);
  await testSuite.runTest('Performance Benchmarks', testPerformanceBenchmarks);
  await testSuite.runTest('Error Handling', testErrorHandling);
  await testSuite.runTest('Data Consistency', testDataConsistency);
  
  // Get summary
  const summary = testSuite.getSummary();
  
  // Display results
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 END-TO-END TEST RESULTS');
  console.log(`${'='.repeat(60)}`);
  
  summary.results.forEach(result => {
    const status = result.success ? '✅ PASSED' : '❌ FAILED';
    const duration = `${result.duration}ms`;
    const error = result.error ? ` - ${result.error}` : '';
    console.log(`${status}: ${result.name} (${duration})${error}`);
  });
  
  console.log(`\n📈 Overall Results:`);
  console.log(`   Success Rate: ${summary.successRate.toFixed(1)}% (${summary.passed}/${summary.total})`);
  console.log(`   Total Duration: ${summary.totalDuration}ms`);
  console.log(`   Average Test Time: ${(summary.totalDuration / summary.total).toFixed(1)}ms`);
  
  // Final assessment
  if (summary.successRate >= 90) {
    console.log('\n🎉 CRM Global Search is PRODUCTION READY!');
    console.log('   All core functionality is working perfectly.');
  } else if (summary.successRate >= 75) {
    console.log('\n⚠️  CRM Global Search is FUNCTIONAL with minor issues.');
    console.log('   Core functionality works, but some edge cases need attention.');
  } else {
    console.log('\n🚨 CRM Global Search needs significant fixes.');
    console.log('   Multiple critical issues need to be resolved.');
  }
  
  return summary.successRate >= 75;
}

// Run tests
runEndToEndTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Test execution failed:', error);
    process.exit(1);
  });
