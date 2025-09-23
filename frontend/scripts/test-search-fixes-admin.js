// ============================================================================
// TEST SEARCH FIXES - ADMIN VERSION
// ============================================================================
// Comprehensive test script using service role key for testing

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../backend/.env' });

// Configuration - Using service role key for testing
const supabaseUrl = process.env.SUPABASE_URL || 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const testTenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

class AdminSearchTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  async runAllTests() {
    console.log('🧪 Starting Admin Search Tests...\n');

    await this.testDatabaseFunctions();
    await this.testSearchOperations();
    await this.testCRUDOperations();
    await this.testErrorHandling();
    await this.testPerformance();

    this.printResults();
  }

  async testDatabaseFunctions() {
    console.log('🗄️  Testing Database Functions...');

    const functions = [
      'search_customers_enhanced',
      'search_customers_multi_word',
      'search_customers_fuzzy'
    ];

    for (const funcName of functions) {
      try {
        let data, error;
        
        if (funcName === 'search_customers_fuzzy') {
          // Fuzzy search has different parameter order
          const { data: fuzzyData, error: fuzzyError } = await supabase.rpc(funcName, {
            p_tenant_id: testTenantId,
            p_search_term: 'test',
            p_threshold: 0.3,
            p_limit: 10
          });
          data = fuzzyData;
          error = fuzzyError;
        } else {
          // Enhanced and multi-word search use same parameters
          const { data: searchData, error: searchError } = await supabase.rpc(funcName, {
            p_search_term: 'test',
            p_tenant_id: testTenantId,
            p_limit: 10,
            p_offset: 0
          });
          data = searchData;
          error = searchError;
        }

        if (error) {
          this.logError(`Database Function: ${funcName}`, 'Function call failed', error);
        } else {
          console.log(`✅ ${funcName}: Function call successful`);
          this.logPass(`Database Function: ${funcName}`);
        }
      } catch (error) {
        this.logError(`Database Function: ${funcName}`, 'Function call failed', error);
      }
    }
  }

  async testSearchOperations() {
    console.log('\n🔍 Testing Search Operations...');

    const searchTests = [
      { name: 'Empty query (should return all)', query: '' },
      { name: 'Simple name search', query: 'John' },
      { name: 'Multi-word search', query: 'John Smith' },
      { name: 'Phone number search', query: '555-1234' },
      { name: 'Email search', query: 'john@example.com' },
      { name: 'Address search', query: '123 Main St' }
    ];

    for (const test of searchTests) {
      try {
        const { data, error } = await supabase.rpc('search_customers_enhanced', {
          p_search_term: test.query,
          p_tenant_id: testTenantId,
          p_limit: 10,
          p_offset: 0
        });

        if (error) {
          this.logError(`Search: ${test.name}`, 'Search failed', error);
        } else {
          console.log(`✅ Search: ${test.name}: Found ${data?.length || 0} results`);
          this.logPass(`Search: ${test.name}`);
        }
      } catch (error) {
        this.logError(`Search: ${test.name}`, 'Search failed', error);
      }
    }
  }

  async testCRUDOperations() {
    console.log('\n📝 Testing CRUD Operations...');

    // Test Create
    try {
      const testCustomer = {
        tenant_id: testTenantId,
        first_name: 'Test',
        last_name: 'Customer',
        email: 'test@example.com',
        phone: '555-9999',
        address: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zip_code: '12345'
      };

      const { data, error } = await supabase
        .from('customers')
        .insert(testCustomer)
        .select()
        .single();

      if (error) {
        this.logError('CRUD: Create', 'Failed to create customer', error);
      } else {
        console.log('✅ CRUD: Create: Customer created successfully');
        this.logPass('CRUD: Create');
        
        // Test Update
        const { data: updateData, error: updateError } = await supabase
          .from('customers')
          .update({ first_name: 'Updated Test' })
          .eq('id', data.id)
          .select()
          .single();

        if (updateError) {
          this.logError('CRUD: Update', 'Failed to update customer', updateError);
        } else {
          console.log('✅ CRUD: Update: Customer updated successfully');
          this.logPass('CRUD: Update');
        }

        // Test Delete
        const { error: deleteError } = await supabase
          .from('customers')
          .delete()
          .eq('id', data.id);

        if (deleteError) {
          this.logError('CRUD: Delete', 'Failed to delete customer', deleteError);
        } else {
          console.log('✅ CRUD: Delete: Customer deleted successfully');
          this.logPass('CRUD: Delete');
        }
      }
    } catch (error) {
      this.logError('CRUD: Create', 'Failed to create customer', error);
    }
  }

  async testErrorHandling() {
    console.log('\n⚠️  Testing Error Handling...');

    // Test invalid tenant ID
    try {
      const { data, error } = await supabase.rpc('search_customers_enhanced', {
        p_search_term: 'test',
        p_tenant_id: 'invalid-tenant-id',
        p_limit: 10,
        p_offset: 0
      });

      if (error) {
        console.log('✅ Invalid tenant ID: Properly rejected');
        this.logPass('Error Handling: Invalid Tenant');
      } else {
        this.logError('Error Handling: Invalid Tenant', 'Should have been rejected', 'No error returned');
      }
    } catch (error) {
      console.log('✅ Invalid tenant ID: Properly rejected');
      this.logPass('Error Handling: Invalid Tenant');
    }

    // Test non-existent function
    try {
      const { data, error } = await supabase.rpc('non_existent_function', {
        p_search_term: 'test'
      });

      if (error) {
        console.log('✅ Non-existent function: Properly rejected');
        this.logPass('Error Handling: Non-existent Function');
      } else {
        this.logError('Error Handling: Non-existent Function', 'Should have been rejected', 'No error returned');
      }
    } catch (error) {
      console.log('✅ Non-existent function: Properly rejected');
      this.logPass('Error Handling: Non-existent Function');
    }
  }

  async testPerformance() {
    console.log('\n⚡ Testing Performance...');

    const performanceTests = [
      { name: 'Single character search', query: 'a' },
      { name: 'Multi-word search', query: 'John Smith' },
      { name: 'Phone search', query: '555' }
    ];

    for (const test of performanceTests) {
      const times = [];
      const iterations = 5;

      for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        
        try {
          const { data, error } = await supabase.rpc('search_customers_enhanced', {
            p_search_term: test.query,
            p_tenant_id: testTenantId,
            p_limit: 10,
            p_offset: 0
          });

          const end = Date.now();
          const duration = end - start;
          times.push(duration);

          if (error) {
            this.logError(`Performance: ${test.name}`, 'Search failed', error);
            break;
          }
        } catch (error) {
          this.logError(`Performance: ${test.name}`, 'Search failed', error);
          break;
        }
      }

      if (times.length === iterations) {
        const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);
        
        console.log(`✅ ${test.name}: Avg ${avgTime.toFixed(1)}ms (Min: ${minTime}ms, Max: ${maxTime}ms)`);
        this.logPass(`Performance: ${test.name}`);
      }
    }
  }

  logPass(testName) {
    this.results.passed++;
    console.log(`✅ ${testName}: PASSED`);
  }

  logError(testName, message, error) {
    this.results.failed++;
    this.results.errors.push({
      test: testName,
      message: message,
      error: error?.message || error
    });
    console.log(`❌ ${testName}: ${message}`);
    if (error?.message) {
      console.log(`   Error: ${error.message}`);
    }
  }

  printResults() {
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);

    if (this.results.errors.length > 0) {
      console.log('\n🚨 Failed Tests:');
      this.results.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.test}: ${error.message}`);
        if (error.error) {
          console.log(`   Error: ${error.error}`);
        }
      });
    }

    console.log('\n🎯 Recommendations:');
    if (this.results.failed === 0) {
      console.log('🎉 All tests passed! The search system is working correctly.');
    } else {
      console.log('🔧 Some tests failed. Please review the errors above and:');
      console.log('   1. Check database functions are deployed');
      console.log('   2. Verify RLS policies are correct');
      console.log('   3. Ensure proper authentication');
      console.log('   4. Check network connectivity');
    }
  }
}

// Run the tests
const tester = new AdminSearchTester();
tester.runAllTests().catch(console.error);
