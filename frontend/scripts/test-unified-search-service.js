// ============================================================================
// TEST UNIFIED SEARCH SERVICE
// ============================================================================
// Comprehensive test script to verify unified search service functionality

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../backend/.env' });

// Configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY || 'sb_secret_ZzGLSBjMOlOgJ5Q8a-1pMQ_9wODxv6s';
const testTenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';

// Create admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

class UnifiedSearchServiceTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  async runAllTests() {
    console.log('🧪 Starting Unified Search Service Tests...\n');

    await this.testEnhancedSearch();
    await this.testMultiWordSearch();
    await this.testFuzzySearch();
    await this.testFallbackSearch();
    await this.testEmptyQuery();
    await this.testErrorHandling();
    await this.testPerformance();
    await this.testIntegrationWithErrorLogging();

    this.printResults();
  }

  async testEnhancedSearch() {
    console.log('🔍 Testing Enhanced Search...');

    try {
      const { data, error } = await supabase.rpc('search_customers_enhanced', {
        p_search_term: 'John',
        p_tenant_id: testTenantId,
        p_limit: 10,
        p_offset: 0
      });

      if (error) {
        this.logError('Enhanced Search', 'Enhanced search failed', error);
      } else {
        console.log(`✅ Enhanced Search: Found ${data?.length || 0} results for "John"`);
        this.logPass('Enhanced Search');
      }
    } catch (error) {
      this.logError('Enhanced Search', 'Enhanced search failed', error);
    }
  }

  async testMultiWordSearch() {
    console.log('\n🔍 Testing Multi-Word Search...');

    try {
      const { data, error } = await supabase.rpc('search_customers_multi_word', {
        p_search_term: 'John Smith',
        p_tenant_id: testTenantId,
        p_limit: 10,
        p_offset: 0
      });

      if (error) {
        this.logError('Multi-Word Search', 'Multi-word search failed', error);
      } else {
        console.log(`✅ Multi-Word Search: Found ${data?.length || 0} results for "John Smith"`);
        this.logPass('Multi-Word Search');
      }
    } catch (error) {
      this.logError('Multi-Word Search', 'Multi-word search failed', error);
    }
  }

  async testFuzzySearch() {
    console.log('\n🔍 Testing Fuzzy Search...');

    try {
      const { data, error } = await supabase.rpc('search_customers_fuzzy', {
        p_tenant_id: testTenantId,
        p_search_term: 'Jon',
        p_threshold: 0.3,
        p_limit: 10
      });

      if (error) {
        this.logError('Fuzzy Search', 'Fuzzy search failed', error);
      } else {
        console.log(`✅ Fuzzy Search: Found ${data?.length || 0} results for "Jon" (fuzzy)`);
        this.logPass('Fuzzy Search');
      }
    } catch (error) {
      this.logError('Fuzzy Search', 'Fuzzy search failed', error);
    }
  }

  async testFallbackSearch() {
    console.log('\n🔍 Testing Fallback Search...');

    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('tenant_id', testTenantId)
        .or(`first_name.ilike.%John%,last_name.ilike.%John%,email.ilike.%John%`)
        .order('first_name')
        .limit(10);

      if (error) {
        this.logError('Fallback Search', 'Fallback search failed', error);
      } else {
        console.log(`✅ Fallback Search: Found ${data?.length || 0} results for "John"`);
        this.logPass('Fallback Search');
      }
    } catch (error) {
      this.logError('Fallback Search', 'Fallback search failed', error);
    }
  }

  async testEmptyQuery() {
    console.log('\n🔍 Testing Empty Query (All Customers)...');

    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('tenant_id', testTenantId)
        .order('first_name')
        .limit(10);

      if (error) {
        this.logError('Empty Query', 'Empty query failed', error);
      } else {
        console.log(`✅ Empty Query: Retrieved ${data?.length || 0} customers`);
        this.logPass('Empty Query');
      }
    } catch (error) {
      this.logError('Empty Query', 'Empty query failed', error);
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
        console.log('✅ Invalid Tenant ID: Properly rejected');
        this.logPass('Error Handling: Invalid Tenant');
      } else {
        this.logError('Error Handling: Invalid Tenant', 'Should have been rejected', 'No error returned');
      }
    } catch (error) {
      console.log('✅ Invalid Tenant ID: Properly rejected');
      this.logPass('Error Handling: Invalid Tenant');
    }

    // Test invalid search term
    try {
      const { data, error } = await supabase.rpc('search_customers_enhanced', {
        p_search_term: null,
        p_tenant_id: testTenantId,
        p_limit: 10,
        p_offset: 0
      });

      if (error) {
        console.log('✅ Invalid Search Term: Properly rejected');
        this.logPass('Error Handling: Invalid Search Term');
      } else {
        this.logError('Error Handling: Invalid Search Term', 'Should have been rejected', 'No error returned');
      }
    } catch (error) {
      console.log('✅ Invalid Search Term: Properly rejected');
      this.logPass('Error Handling: Invalid Search Term');
    }
  }

  async testPerformance() {
    console.log('\n⚡ Testing Performance...');

    const searchTests = [
      { name: 'Enhanced search', query: 'John' },
      { name: 'Multi-word search', query: 'John Smith' },
      { name: 'Fuzzy search', query: 'Jon' },
      { name: 'Phone search', query: '555' }
    ];

    for (const test of searchTests) {
      const times = [];
      const iterations = 3;

      for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        
        try {
          let data, error;
          
          if (test.name === 'Enhanced search') {
            const result = await supabase.rpc('search_customers_enhanced', {
              p_search_term: test.query,
              p_tenant_id: testTenantId,
              p_limit: 10,
              p_offset: 0
            });
            data = result.data;
            error = result.error;
          } else if (test.name === 'Multi-word search') {
            const result = await supabase.rpc('search_customers_multi_word', {
              p_search_term: test.query,
              p_tenant_id: testTenantId,
              p_limit: 10,
              p_offset: 0
            });
            data = result.data;
            error = result.error;
          } else if (test.name === 'Fuzzy search') {
            const result = await supabase.rpc('search_customers_fuzzy', {
              p_tenant_id: testTenantId,
              p_search_term: test.query,
              p_threshold: 0.3,
              p_limit: 10
            });
            data = result.data;
            error = result.error;
          } else if (test.name === 'Phone search') {
            const result = await supabase.rpc('search_customers_enhanced', {
              p_search_term: test.query,
              p_tenant_id: testTenantId,
              p_limit: 10,
              p_offset: 0
            });
            data = result.data;
            error = result.error;
          }

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

  async testIntegrationWithErrorLogging() {
    console.log('\n📊 Testing Integration with Error Logging...');

    try {
      // Test search success logging
      const { data, error } = await supabase.rpc('log_search_success', {
        p_operation: 'unified_search_test',
        p_query: 'integration test',
        p_results_count: 5,
        p_execution_time_ms: 100,
        p_context: { 
          tenantId: testTenantId,
          userId: '00000000-0000-0000-0000-000000000001',
          testType: 'integration'
        }
      });

      if (error) {
        this.logError('Error Logging Integration', 'Failed to log search success', error);
      } else {
        console.log('✅ Error Logging Integration: Successfully logged search operation');
        this.logPass('Error Logging Integration');
      }
    } catch (error) {
      this.logError('Error Logging Integration', 'Failed to test error logging integration', error);
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
      console.log('🎉 All unified search service tests passed! The system is ready for production.');
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
const tester = new UnifiedSearchServiceTester();
tester.runAllTests().catch(console.error);
