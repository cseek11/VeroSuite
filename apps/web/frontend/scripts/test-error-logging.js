// ============================================================================
// TEST ERROR LOGGING SYSTEM
// ============================================================================
// Comprehensive test script to verify error logging functionality

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../backend/.env' });

// Configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const testTenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';

// Create admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

class ErrorLoggingTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  async runAllTests() {
    console.log('🧪 Starting Error Logging System Tests...\n');

    await this.testErrorLoggingFunctions();
    await this.testSearchSuccessLogging();
    await this.testErrorStatistics();
    await this.testRecentErrors();
    await this.testPerformanceMetrics();
    await this.testErrorResolution();

    this.printResults();
  }

  async testErrorLoggingFunctions() {
    console.log('📊 Testing Error Logging Functions...');

    const functions = [
      'log_search_success',
      'get_error_statistics',
      'get_recent_errors',
      'get_search_performance_metrics',
      'resolve_error'
    ];

    for (const funcName of functions) {
      try {
        let data, error;
        
        if (funcName === 'log_search_success') {
          const { data: logData, error: logError } = await supabase.rpc(funcName, {
            p_operation: 'test_operation',
            p_query: 'test query',
            p_results_count: 5,
            p_execution_time_ms: 100,
            p_context: { tenantId: testTenantId }
          });
          data = logData;
          error = logError;
        } else if (funcName === 'get_error_statistics') {
          const { data: statsData, error: statsError } = await supabase.rpc(funcName, {
            p_tenant_id: testTenantId,
            p_hours_back: 24
          });
          data = statsData;
          error = statsError;
        } else if (funcName === 'get_recent_errors') {
          const { data: errorsData, error: errorsError } = await supabase.rpc(funcName, {
            p_tenant_id: testTenantId,
            p_limit: 10,
            p_hours_back: 24
          });
          data = errorsData;
          error = errorsError;
        } else if (funcName === 'get_search_performance_metrics') {
          const { data: perfData, error: perfError } = await supabase.rpc(funcName, {
            p_tenant_id: testTenantId,
            p_days_back: 7
          });
          data = perfData;
          error = perfError;
        } else if (funcName === 'resolve_error') {
          // This will fail with a non-existent error ID, which is expected
          const { data: resolveData, error: resolveError } = await supabase.rpc(funcName, {
            p_error_id: '00000000-0000-0000-0000-000000000000'
          });
          data = resolveData;
          error = resolveError;
        }

        if (error) {
          this.logError(`Error Logging Function: ${funcName}`, 'Function call failed', error);
        } else {
          console.log(`✅ ${funcName}: Function call successful`);
          this.logPass(`Error Logging Function: ${funcName}`);
        }
      } catch (error) {
        this.logError(`Error Logging Function: ${funcName}`, 'Function call failed', error);
      }
    }
  }

  async testSearchSuccessLogging() {
    console.log('\n📈 Testing Search Success Logging...');

    try {
      const { data, error } = await supabase.rpc('log_search_success', {
        p_operation: 'enhanced_search',
        p_query: 'John Smith',
        p_results_count: 3,
        p_execution_time_ms: 85,
        p_context: { 
          tenantId: testTenantId,
          userId: '00000000-0000-0000-0000-000000000001',
          searchType: 'name'
        }
      });

      if (error) {
        this.logError('Search Success Logging', 'Failed to log search success', error);
      } else {
        console.log('✅ Search Success Logging: Successfully logged search operation');
        this.logPass('Search Success Logging');
      }
    } catch (error) {
      this.logError('Search Success Logging', 'Failed to log search success', error);
    }
  }

  async testErrorStatistics() {
    console.log('\n📊 Testing Error Statistics...');

    try {
      const { data, error } = await supabase.rpc('get_error_statistics', {
        p_tenant_id: testTenantId,
        p_hours_back: 24
      });

      if (error) {
        this.logError('Error Statistics', 'Failed to get error statistics', error);
      } else {
        console.log('✅ Error Statistics: Retrieved statistics successfully');
        console.log(`   Total errors: ${data?.[0]?.total_errors || 0}`);
        console.log(`   Unresolved: ${data?.[0]?.unresolved_errors || 0}`);
        this.logPass('Error Statistics');
      }
    } catch (error) {
      this.logError('Error Statistics', 'Failed to get error statistics', error);
    }
  }

  async testRecentErrors() {
    console.log('\n🔍 Testing Recent Errors...');

    try {
      const { data, error } = await supabase.rpc('get_recent_errors', {
        p_tenant_id: testTenantId,
        p_limit: 10,
        p_hours_back: 24
      });

      if (error) {
        this.logError('Recent Errors', 'Failed to get recent errors', error);
      } else {
        console.log(`✅ Recent Errors: Retrieved ${data?.length || 0} recent errors`);
        this.logPass('Recent Errors');
      }
    } catch (error) {
      this.logError('Recent Errors', 'Failed to get recent errors', error);
    }
  }

  async testPerformanceMetrics() {
    console.log('\n⚡ Testing Performance Metrics...');

    try {
      const { data, error } = await supabase.rpc('get_search_performance_metrics', {
        p_tenant_id: testTenantId,
        p_days_back: 7
      });

      if (error) {
        this.logError('Performance Metrics', 'Failed to get performance metrics', error);
      } else {
        console.log('✅ Performance Metrics: Retrieved metrics successfully');
        console.log(`   Total searches: ${data?.[0]?.total_searches || 0}`);
        console.log(`   Avg response time: ${data?.[0]?.avg_response_time_ms || 0}ms`);
        this.logPass('Performance Metrics');
      }
    } catch (error) {
      this.logError('Performance Metrics', 'Failed to get performance metrics', error);
    }
  }

  async testErrorResolution() {
    console.log('\n🔧 Testing Error Resolution...');

    try {
      // First, let's create a test error
      const { data: insertData, error: insertError } = await supabase
        .from('search_errors')
        .insert({
          tenant_id: testTenantId,
          user_id: '00000000-0000-0000-0000-000000000001',
          error_type: 'test',
          error_message: 'Test error for resolution',
          query_text: 'test query',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        this.logError('Error Resolution', 'Failed to create test error', insertError);
        return;
      }

      // Now try to resolve it
      const { data, error } = await supabase.rpc('resolve_error', {
        p_error_id: insertData.id
      });

      if (error) {
        this.logError('Error Resolution', 'Failed to resolve error', error);
      } else {
        console.log('✅ Error Resolution: Successfully resolved test error');
        this.logPass('Error Resolution');
      }

      // Clean up the test error
      await supabase
        .from('search_errors')
        .delete()
        .eq('id', insertData.id);

    } catch (error) {
      this.logError('Error Resolution', 'Failed to test error resolution', error);
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
      console.log('🎉 All error logging tests passed! The system is ready for production.');
    } else {
      console.log('🔧 Some tests failed. Please review the errors above and:');
      console.log('   1. Check database functions are deployed');
      console.log('   2. Verify RLS policies are correct');
      console.log('   3. Ensure proper permissions');
      console.log('   4. Check network connectivity');
    }
  }
}

// Run the tests
const tester = new ErrorLoggingTester();
tester.runAllTests().catch(console.error);
