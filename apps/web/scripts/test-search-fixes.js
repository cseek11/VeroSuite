// ============================================================================
// TEST SEARCH FIXES
// ============================================================================
// Comprehensive test script to verify all search functionality works

import { createClient } from '@supabase/supabase-js';

// Configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
const testTenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';

// Test credentials (you'll need to create a test user)
const testEmail = 'test@veropest.com';
const testPassword = 'TestPassword123!';

const supabase = createClient(supabaseUrl, supabaseKey);

// Simple auth helper
async function ensureAuthenticated() {
  try {
    // Check current session
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (user && !error) {
      return user;
    }

    // Try to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    if (signInData.user && !signInError) {
      return signInData.user;
    }

    // Try to create user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          tenant_id: testTenantId
        }
      }
    });

    if (signUpData.user && !signUpError) {
      return signUpData.user;
    }

    throw new Error('Failed to authenticate');
  } catch (error) {
    console.warn('Authentication failed:', error.message);
    return null;
  }
}

class SearchTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  async runAllTests() {
    console.log('🧪 Starting Comprehensive Search Tests...\n');

    await this.testAuthentication();
    await this.testDatabaseFunctions();
    await this.testSearchOperations();
    await this.testCRUDOperations();
    await this.testErrorHandling();
    await this.testPerformance();

    this.printResults();
  }

  async testAuthentication() {
    console.log('🔐 Testing Authentication...');
    
    try {
      const user = await ensureAuthenticated();
      
      if (user) {
        console.log('✅ User authenticated:', user.email);
        this.logPass('Authentication');
      } else {
        this.logError('Authentication', 'Failed to authenticate user', new Error('No user returned'));
      }
    } catch (error) {
      this.logError('Authentication', 'Authentication test failed', error);
    }
  }

  async testDatabaseFunctions() {
    console.log('\n🗄️  Testing Database Functions...');

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
            p_limit: 5
          });
          data = fuzzyData;
          error = fuzzyError;
        } else {
          // Enhanced and multi-word search use same parameters
          const { data: searchData, error: searchError } = await supabase.rpc(funcName, {
            p_search_term: 'test',
            p_tenant_id: testTenantId,
            p_limit: 5,
            p_offset: 0
          });
          data = searchData;
          error = searchError;
        }

        if (error) {
          this.logError(`Database Function: ${funcName}`, 'Function call failed', error);
        } else {
          console.log(`✅ ${funcName}: Working (${data?.length || 0} results)`);
          this.logPass(`Database Function: ${funcName}`);
        }
      } catch (error) {
        this.logError(`Database Function: ${funcName}`, 'Unexpected error', error);
      }
    }
  }

  async testSearchOperations() {
    console.log('\n🔍 Testing Search Operations...');

    const testQueries = [
      { query: '', description: 'Empty query (should return all)' },
      { query: 'john', description: 'Simple name search' },
      { query: 'john smith', description: 'Multi-word search' },
      { query: '555-1234', description: 'Phone number search' },
      { query: 'test@example.com', description: 'Email search' },
      { query: '123 main st', description: 'Address search' }
    ];

    for (const test of testQueries) {
      try {
        const startTime = Date.now();
        
        const { data, error } = await supabase.rpc('search_customers_enhanced', {
          p_search_term: test.query,
          p_tenant_id: testTenantId,
          p_limit: 10,
          p_offset: 0
        });

        const executionTime = Date.now() - startTime;

        if (error) {
          this.logError(`Search: ${test.description}`, 'Search failed', error);
        } else {
          console.log(`✅ ${test.description}: ${data?.length || 0} results (${executionTime}ms)`);
          this.logPass(`Search: ${test.description}`);
        }
      } catch (error) {
        this.logError(`Search: ${test.description}`, 'Unexpected error', error);
      }
    }
  }

  async testCRUDOperations() {
    console.log('\n📝 Testing CRUD Operations...');

    // Test Create
    try {
      const testCustomer = {
        name: `Test Customer ${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        phone: '555-9999',
        account_type: 'residential',
        tenant_id: testTenantId
      };

      const { data: createData, error: createError } = await supabase
        .from('accounts')
        .insert(testCustomer)
        .select()
        .single();

      if (createError) {
        this.logError('CRUD: Create', 'Failed to create customer', createError);
      } else {
        console.log('✅ Create: Customer created successfully');
        this.logPass('CRUD: Create');

        // Test Read
        const { data: readData, error: readError } = await supabase
          .from('accounts')
          .select('*')
          .eq('id', createData.id)
          .single();

        if (readError) {
          this.logError('CRUD: Read', 'Failed to read customer', readError);
        } else {
          console.log('✅ Read: Customer retrieved successfully');
          this.logPass('CRUD: Read');

          // Test Update
          const { data: updateData, error: updateError } = await supabase
            .from('accounts')
            .update({ phone: '555-8888' })
            .eq('id', createData.id)
            .select()
            .single();

          if (updateError) {
            this.logError('CRUD: Update', 'Failed to update customer', updateError);
          } else {
            console.log('✅ Update: Customer updated successfully');
            this.logPass('CRUD: Update');

            // Test Delete
            const { error: deleteError } = await supabase
              .from('accounts')
              .delete()
              .eq('id', createData.id);

            if (deleteError) {
              this.logError('CRUD: Delete', 'Failed to delete customer', deleteError);
            } else {
              console.log('✅ Delete: Customer deleted successfully');
              this.logPass('CRUD: Delete');
            }
          }
        }
      }
    } catch (error) {
      this.logError('CRUD Operations', 'Unexpected error', error);
    }
  }

  async testErrorHandling() {
    console.log('\n⚠️  Testing Error Handling...');

    // Test invalid tenant ID
    try {
      const { data, error } = await supabase.rpc('search_customers_enhanced', {
        p_search_term: 'test',
        p_tenant_id: 'invalid-tenant-id',
        p_limit: 5,
        p_offset: 0
      });

      if (error) {
        console.log('✅ Invalid tenant ID: Properly rejected');
        this.logPass('Error Handling: Invalid Tenant');
      } else {
        console.log('⚠️  Invalid tenant ID: Should have been rejected');
        this.logError('Error Handling: Invalid Tenant', 'Should have failed', new Error('No error returned'));
      }
    } catch (error) {
      console.log('✅ Invalid tenant ID: Properly rejected');
      this.logPass('Error Handling: Invalid Tenant');
    }

    // Test non-existent function
    try {
      const { data, error } = await supabase.rpc('non_existent_function', {
        p_test: 'test'
      });

      if (error) {
        console.log('✅ Non-existent function: Properly rejected');
        this.logPass('Error Handling: Non-existent Function');
      } else {
        this.logError('Error Handling: Non-existent Function', 'Should have failed', new Error('No error returned'));
      }
    } catch (error) {
      console.log('✅ Non-existent function: Properly rejected');
      this.logPass('Error Handling: Non-existent Function');
    }
  }

  async testPerformance() {
    console.log('\n⚡ Testing Performance...');

    const performanceTests = [
      { query: 'a', description: 'Single character search' },
      { query: 'john smith', description: 'Multi-word search' },
      { query: '555-1234', description: 'Phone search' }
    ];

    for (const test of performanceTests) {
      try {
        const iterations = 5;
        const times = [];

        for (let i = 0; i < iterations; i++) {
          const startTime = Date.now();
          
          await supabase.rpc('search_customers_enhanced', {
            p_search_term: test.query,
            p_tenant_id: testTenantId,
            p_limit: 10,
            p_offset: 0
          });

          times.push(Date.now() - startTime);
        }

        const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
        const maxTime = Math.max(...times);
        const minTime = Math.min(...times);

        console.log(`✅ ${test.description}: Avg ${avgTime.toFixed(1)}ms (Min: ${minTime}ms, Max: ${maxTime}ms)`);
        
        if (avgTime < 500) {
          this.logPass(`Performance: ${test.description}`);
        } else {
          this.logError(`Performance: ${test.description}`, 'Too slow', new Error(`Average time: ${avgTime}ms`));
        }
      } catch (error) {
        this.logError(`Performance: ${test.description}`, 'Performance test failed', error);
      }
    }
  }

  logPass(testName) {
    this.results.passed++;
    console.log(`✅ ${testName}: PASSED`);
  }

  logError(testName, description, error) {
    this.results.failed++;
    this.results.errors.push({
      test: testName,
      description,
      error: error.message || error
    });
    console.log(`❌ ${testName}: FAILED - ${description}`);
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
        console.log(`${index + 1}. ${error.test}: ${error.description}`);
        console.log(`   Error: ${error.error}`);
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
async function main() {
  const tester = new SearchTester();
  await tester.runAllTests();
}

main().catch(console.error);
