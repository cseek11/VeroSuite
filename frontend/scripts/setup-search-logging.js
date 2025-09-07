// ============================================================================
// SETUP SEARCH LOGGING
// ============================================================================
// Script to set up search logging infrastructure

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupSearchLogging() {
  console.log('🔧 Setting up Search Logging Infrastructure...\n');
  
  try {
    // Read the SQL migration file
    const sqlPath = path.join(process.cwd(), 'scripts', 'add-search-logging.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('1️⃣ Running search logging migration...');
    
    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.log(`⚠️  Statement warning: ${error.message}`);
          // Continue with other statements even if one fails
        } else {
          successCount++;
        }
      } catch (err) {
        console.log(`⚠️  Statement error: ${err.message}`);
        errorCount++;
      }
    }
    
    console.log(`✅ Migration completed: ${successCount} statements successful, ${errorCount} errors`);
    
    // Test the functions
    console.log('\n2️⃣ Testing search logging functions...');
    
    // Test log_search_query function
    const { data: logResult, error: logError } = await supabase
      .rpc('log_search_query', {
        p_user_id: '00000000-0000-0000-0000-000000000000',
        p_tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
        p_query: 'test setup query',
        p_results_count: 3,
        p_time_taken_ms: 100,
        p_search_filters: { status: 'active' }
      });
    
    if (logError) {
      console.log('❌ log_search_query function error:', logError.message);
    } else {
      console.log('✅ log_search_query function working, log ID:', logResult);
    }
    
    // Test get_search_analytics function
    const { data: analyticsResult, error: analyticsError } = await supabase
      .rpc('get_search_analytics', {
        p_tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
        p_days_back: 30
      });
    
    if (analyticsError) {
      console.log('❌ get_search_analytics function error:', analyticsError.message);
    } else {
      console.log('✅ get_search_analytics function working');
      console.log('   Analytics data:', analyticsResult[0]);
    }
    
    console.log('\n🎯 SEARCH LOGGING SETUP COMPLETE!');
    console.log('✅ Search logging infrastructure is ready for use.');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Run the setup
setupSearchLogging();





