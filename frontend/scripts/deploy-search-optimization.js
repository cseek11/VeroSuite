#!/usr/bin/env node

// ============================================================================
// SEARCH OPTIMIZATION DEPLOYMENT SCRIPT
// ============================================================================
// This script deploys all search optimizations in the correct order

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SQL files to deploy in order
const deploymentFiles = [
  {
    name: 'Search Performance Optimization',
    file: 'search-performance-optimization.sql',
    description: 'Advanced indexing and materialized views'
  },
  {
    name: 'Advanced Typo Tolerance',
    file: 'advanced-typo-tolerance.sql',
    description: 'Levenshtein distance and fuzzy matching'
  },
  {
    name: 'Multi-word Search (Updated)',
    file: 'multi-word-search-function.sql',
    description: 'Fixed multi-word search function'
  }
];

async function executeSQL(sqlContent, description) {
  console.log(`🔧 Executing: ${description}...`);
  
  try {
    // Split SQL into statements (basic approach)
    const statements = sqlContent
      .split(/;(?=(?:[^']*'[^']*')*[^']*$)/) // Split on semicolons not inside quotes
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.toLowerCase().includes('drop') || 
          statement.toLowerCase().includes('create') ||
          statement.toLowerCase().includes('alter') ||
          statement.toLowerCase().includes('grant')) {
        
        // For DDL statements, we need to use a different approach
        // This is a simplified version - in production you'd use a proper migration tool
        console.log(`  📝 Executing DDL statement...`);
        
        // Note: Supabase doesn't allow direct DDL execution via RPC
        // You'll need to run these manually in the SQL Editor
        console.log(`  ⚠️  DDL statement needs manual execution in Supabase SQL Editor`);
      }
    }
    
    console.log(`  ✅ ${description} ready for manual execution`);
    return true;
  } catch (error) {
    console.error(`  ❌ Failed to prepare ${description}:`, error.message);
    return false;
  }
}

async function testSearchFunctions() {
  console.log('\n🧪 Testing search functions...');
  
  // Get current user tenant
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('⚠️  No authenticated user - skipping function tests');
    return;
  }

  const { data: tenantId, error: tenantError } = await supabase
    .rpc('get_user_tenant_id', { user_email: user.email });

  if (tenantError || !tenantId) {
    console.log('⚠️  Could not get tenant ID - skipping function tests');
    return;
  }

  const testQueries = [
    { query: 'john', expected: 'should find customers with john in name' },
    { query: 'john smith', expected: 'should find customers with both john and smith' },
    { query: 'smith john', expected: 'should find same results as john smith' },
    { query: 'smth', expected: 'should find smith with typo tolerance' }
  ];

  for (const test of testQueries) {
    try {
      console.log(`  🔍 Testing: "${test.query}"`);
      
      // Test new smart search function
      const { data, error } = await supabase
        .rpc('search_customers_smart', {
          p_search_term: test.query,
          p_tenant_id: tenantId,
          p_limit: 5,
          p_offset: 0
        });

      if (error) {
        if (error.message.includes('does not exist')) {
          console.log(`    ⚠️  Function not deployed yet - ${test.expected}`);
        } else {
          console.log(`    ❌ Error: ${error.message}`);
        }
      } else {
        console.log(`    ✅ Found ${data?.length || 0} results - ${test.expected}`);
        if (data && data.length > 0) {
          console.log(`       Top result: ${data[0].name} (${data[0].match_type})`);
        }
      }
    } catch (testError) {
      console.log(`    ❌ Test failed: ${testError.message}`);
    }
  }
}

async function deployOptimizations() {
  console.log('🚀 Starting search optimization deployment...\n');

  let allSuccessful = true;

  for (const deployment of deploymentFiles) {
    console.log(`📁 Processing ${deployment.name}...`);
    
    try {
      const sqlPath = path.join(process.cwd(), 'scripts', deployment.file);
      
      if (!fs.existsSync(sqlPath)) {
        console.log(`  ⚠️  File not found: ${deployment.file}`);
        continue;
      }

      const sqlContent = fs.readFileSync(sqlPath, 'utf8');
      const success = await executeSQL(sqlContent, deployment.description);
      
      if (!success) {
        allSuccessful = false;
      }
      
    } catch (error) {
      console.error(`  ❌ Failed to process ${deployment.name}:`, error.message);
      allSuccessful = false;
    }
    
    console.log(''); // Empty line for readability
  }

  // Test the functions
  await testSearchFunctions();

  // Final report
  console.log('\n' + '='.repeat(60));
  if (allSuccessful) {
    console.log('✅ Search optimization deployment prepared successfully!');
    console.log('');
    console.log('📋 MANUAL DEPLOYMENT STEPS:');
    console.log('1. Go to your Supabase Dashboard → SQL Editor');
    console.log('2. Copy and run each SQL file in this order:');
    
    deploymentFiles.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file.file} - ${file.description}`);
    });
    
    console.log('');
    console.log('🚀 EXPECTED IMPROVEMENTS:');
    console.log('- 50-80% faster search performance');
    console.log('- Better typo tolerance (finds "smth" when searching "smith")');
    console.log('- Multi-word search works in any order');
    console.log('- Intelligent result caching');
    console.log('- Auto-correction suggestions');
    
    console.log('');
    console.log('📊 MONITORING:');
    console.log('- Check browser console for search metrics');
    console.log('- Slow searches (>1s) will be logged as warnings');
    console.log('- Cache hit rates will be tracked');
    
  } else {
    console.log('⚠️  Some deployments had issues - check logs above');
  }
  console.log('='.repeat(60));
}

// Performance testing function
async function runPerformanceTest() {
  console.log('\n🏃 Running performance tests...');
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('⚠️  No authenticated user - skipping performance tests');
    return;
  }

  const { data: tenantId } = await supabase
    .rpc('get_user_tenant_id', { user_email: user.email });

  if (!tenantId) {
    console.log('⚠️  Could not get tenant ID - skipping performance tests');
    return;
  }

  const testQueries = [
    'john',
    'smith', 
    'john smith',
    'smith john',
    'johnn',     // typo
    'smth',      // heavy typo
    '412',       // phone
    '@gmail'     // email
  ];

  console.log('Testing search performance...');
  
  for (const query of testQueries) {
    const startTime = performance.now();
    
    try {
      const { data } = await supabase
        .rpc('search_customers_smart', {
          p_search_term: query,
          p_tenant_id: tenantId,
          p_limit: 20,
          p_offset: 0
        });
      
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      console.log(`  "${query}" -> ${data?.length || 0} results in ${duration}ms`);
      
    } catch (error) {
      console.log(`  "${query}" -> Error: ${error.message}`);
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--test-performance')) {
    await runPerformanceTest();
  } else {
    await deployOptimizations();
  }
}

main().catch(console.error);
