// ============================================================================
// TEST CURRENT STATE - Verify Current Issues
// ============================================================================
// This script tests the current state of the search functions to identify
// the exact issues that need to be fixed

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

// ============================================================================
// TEST FUNCTIONS
// ============================================================================

async function testDataConsistency() {
  console.log('🔍 Testing Data Consistency...\n');
  
  try {
    // Test enhanced search
    console.log('1. Testing enhanced search...');
    const { data: searchResults, error: searchError } = await supabase.rpc('search_customers_enhanced', {
      p_tenant_id: testTenantId,
      p_search_term: 'John',
      p_limit: 5
    });
    
    if (searchError) {
      console.log(`   ❌ Search failed: ${searchError.message}`);
      return false;
    }
    
    console.log(`   ✅ Search successful: Found ${searchResults.length} results`);
    
    // Test data consistency
    let consistencyIssues = [];
    
    for (const result of searchResults) {
      console.log(`\n   Checking result: ${result.name} (${result.id})`);
      
      // Get corresponding database record
      const { data: dbCustomer, error: dbError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', result.id)
        .eq('tenant_id', testTenantId)
        .single();
      
      if (dbError || !dbCustomer) {
        console.log(`   ❌ Search result ${result.id} not found in database`);
        consistencyIssues.push(`Search result ${result.id} not found in database`);
        continue;
      }
      
      // Check field mapping
      const expectedName = `${dbCustomer.first_name} ${dbCustomer.last_name}`;
      console.log(`   Expected name: "${expectedName}"`);
      console.log(`   Actual name: "${result.name}"`);
      
      if (result.name !== expectedName) {
        console.log(`   ❌ Name mismatch`);
        consistencyIssues.push(`Name mismatch for ${result.id}: expected "${expectedName}", got "${result.name}"`);
      } else {
        console.log(`   ✅ Name matches`);
      }
      
      console.log(`   Expected email: "${dbCustomer.email}"`);
      console.log(`   Actual email: "${result.email}"`);
      
      if (result.email !== dbCustomer.email) {
        console.log(`   ❌ Email mismatch`);
        consistencyIssues.push(`Email mismatch for ${result.id}: expected "${dbCustomer.email}", got "${result.email}"`);
      } else {
        console.log(`   ✅ Email matches`);
      }
      
      console.log(`   Expected phone: "${dbCustomer.phone}"`);
      console.log(`   Actual phone: "${result.phone}"`);
      
      if (result.phone !== dbCustomer.phone) {
        console.log(`   ❌ Phone mismatch`);
        consistencyIssues.push(`Phone mismatch for ${result.id}: expected "${dbCustomer.phone}", got "${result.phone}"`);
      } else {
        console.log(`   ✅ Phone matches`);
      }
      
      console.log(`   Expected address: "${dbCustomer.address}"`);
      console.log(`   Actual address: "${result.address}"`);
      
      if (result.address !== dbCustomer.address) {
        console.log(`   ❌ Address mismatch`);
        consistencyIssues.push(`Address mismatch for ${result.id}: expected "${dbCustomer.address}", got "${result.address}"`);
      } else {
        console.log(`   ✅ Address matches`);
      }
      
      console.log(`   Expected status: "${dbCustomer.status}"`);
      console.log(`   Actual status: "${result.status}"`);
      
      if (result.status !== dbCustomer.status) {
        console.log(`   ❌ Status mismatch`);
        consistencyIssues.push(`Status mismatch for ${result.id}: expected "${dbCustomer.status}", got "${result.status}"`);
      } else {
        console.log(`   ✅ Status matches`);
      }
      
      console.log(`   Expected type: "${dbCustomer.account_type}"`);
      console.log(`   Actual type: "${result.type}"`);
      
      if (result.type !== dbCustomer.account_type) {
        console.log(`   ❌ Type mismatch`);
        consistencyIssues.push(`Type mismatch for ${result.id}: expected "${dbCustomer.account_type}", got "${result.type}"`);
      } else {
        console.log(`   ✅ Type matches`);
      }
    }
    
    if (consistencyIssues.length === 0) {
      console.log('\n   ✅ All search results are consistent with database');
      return true;
    } else {
      console.log('\n   ❌ Data consistency issues found:');
      consistencyIssues.forEach(issue => console.log(`      - ${issue}`));
      return false;
    }
    
  } catch (error) {
    console.error('❌ Data consistency test failed:', error.message);
    return false;
  }
}

async function testInputValidation() {
  console.log('\n🚨 Testing Input Validation...\n');
  
  const validationTests = [
    { name: 'Empty search term', params: { p_tenant_id: testTenantId, p_search_term: '', p_limit: 5 } },
    { name: 'Null search term', params: { p_tenant_id: testTenantId, p_search_term: null, p_limit: 5 } },
    { name: 'Whitespace search term', params: { p_tenant_id: testTenantId, p_search_term: '   ', p_limit: 5 } },
    { name: 'Invalid tenant ID', params: { p_tenant_id: '00000000-0000-0000-0000-000000000000', p_search_term: 'test', p_limit: 5 } },
    { name: 'Invalid limit (0)', params: { p_tenant_id: testTenantId, p_search_term: 'test', p_limit: 0 } },
    { name: 'Invalid limit (-1)', params: { p_tenant_id: testTenantId, p_search_term: 'test', p_limit: -1 } },
    { name: 'Invalid limit (1001)', params: { p_tenant_id: testTenantId, p_search_term: 'test', p_limit: 1001 } },
    { name: 'Very long search term', params: { p_tenant_id: testTenantId, p_search_term: 'a'.repeat(1001), p_limit: 5 } }
  ];
  
  let validationIssues = [];
  
  for (const test of validationTests) {
    console.log(`Testing: ${test.name}...`);
    
    try {
      const { data, error } = await supabase.rpc('search_customers_enhanced', test.params);
      
      if (error) {
        console.log(`   ✅ Properly rejected: ${error.message}`);
      } else {
        console.log(`   ❌ Should have been rejected but returned ${data.length} results`);
        validationIssues.push(`${test.name} should have been rejected`);
      }
    } catch (err) {
      console.log(`   ✅ Properly rejected: ${err.message}`);
    }
  }
  
  if (validationIssues.length === 0) {
    console.log('\n   ✅ All input validation tests passed');
    return true;
  } else {
    console.log('\n   ❌ Input validation issues found:');
    validationIssues.forEach(issue => console.log(`      - ${issue}`));
    return false;
  }
}

async function testErrorLogging() {
  console.log('\n📊 Testing Error Logging...\n');
  
  try {
    // Test search success logging
    console.log('1. Testing search success logging...');
    const { error: successError } = await supabase.rpc('log_search_success', {
      p_operation: 'test_search',
      p_query: 'test query',
      p_results_count: 3,
      p_execution_time_ms: 150,
      p_context: {
        tenantId: testTenantId,
        userId: '00000000-0000-0000-0000-000000000001',
        testType: 'current_state_test'
      }
    });
    
    if (successError) {
      console.log(`   ❌ Search success logging failed: ${successError.message}`);
      return false;
    }
    
    console.log('   ✅ Search success logging working');
    
    // Test error logging
    console.log('\n2. Testing error logging...');
    const { error: logError } = await supabase.rpc('log_search_error', {
      p_operation: 'test_error',
      p_query: 'test query',
      p_error_message: 'Test error message',
      p_error_type: 'validation',
      p_severity: 'low',
      p_context: {
        tenantId: testTenantId,
        userId: '00000000-0000-0000-0000-000000000001',
        testType: 'current_state_test'
      }
    });
    
    if (logError) {
      console.log(`   ❌ Error logging failed: ${logError.message}`);
      console.log('   ⚠️  This confirms the missing log_search_error function');
      return false;
    }
    
    console.log('   ✅ Error logging working');
    return true;
    
  } catch (error) {
    console.error('❌ Error logging test failed:', error.message);
    return false;
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('🔍 Testing Current State of Search Functions...\n');
  
  const results = [];
  
  // Test data consistency
  const consistencyResult = await testDataConsistency();
  results.push({ name: 'Data Consistency', success: consistencyResult });
  
  // Test input validation
  const validationResult = await testInputValidation();
  results.push({ name: 'Input Validation', success: validationResult });
  
  // Test error logging
  const errorLoggingResult = await testErrorLogging();
  results.push({ name: 'Error Logging', success: errorLoggingResult });
  
  // Summary
  console.log('\n📊 Current State Summary:');
  console.log('=========================');
  
  results.forEach(result => {
    const status = result.success ? '✅ PASSED' : '❌ FAILED';
    console.log(`${status}: ${result.name}`);
  });
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  const successRate = (successCount / totalCount) * 100;
  
  console.log(`\nOverall Success Rate: ${successRate.toFixed(1)}% (${successCount}/${totalCount})`);
  
  if (successRate >= 90) {
    console.log('\n🎉 Current state is excellent!');
  } else if (successRate >= 75) {
    console.log('\n⚠️  Current state is good with minor issues.');
  } else {
    console.log('\n🚨 Current state needs significant improvements.');
  }
  
  // Provide recommendations
  console.log('\n🔧 Recommendations:');
  if (!consistencyResult) {
    console.log('- Fix data consistency issues in search functions');
  }
  if (!validationResult) {
    console.log('- Add proper input validation to search functions');
  }
  if (!errorLoggingResult) {
    console.log('- Deploy missing log_search_error function');
  }
  
  return successRate;
}

// Run the test
main()
  .then(successRate => {
    console.log(`\n✅ Current state test completed. Success rate: ${successRate.toFixed(1)}%`);
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Test failed:', error);
    process.exit(1);
  });
