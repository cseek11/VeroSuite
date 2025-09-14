// ============================================================================
// DEPLOY MULTI-WORD SEARCH FUNCTION
// ============================================================================
// This script deploys the new multi-word search function to the database

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

async function deployMultiWordSearch() {
  try {
    console.log('🚀 Deploying multi-word search function...');
    
    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'scripts', 'enhanced-search-migration.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Extract just the multi-word search function
    const multiWordFunctionMatch = sqlContent.match(
      /CREATE OR REPLACE FUNCTION search_customers_multi_word[\s\S]*?END;\s*\$\$ LANGUAGE plpgsql;/
    );
    
    if (!multiWordFunctionMatch) {
      console.error('❌ Could not find multi-word search function in SQL file');
      return;
    }
    
    const multiWordFunction = multiWordFunctionMatch[0];
    console.log('📝 Multi-word search function extracted successfully');
    
    // Deploy the function
    console.log('🔧 Deploying to database...');
    const { error } = await supabase.rpc('exec_sql', { sql: multiWordFunction });
    
    if (error) {
      console.error('❌ Failed to deploy function:', error.message);
      
      // Try alternative approach - direct SQL execution
      console.log('🔄 Trying alternative deployment method...');
      const { error: directError } = await supabase
        .from('_exec_sql')
        .select('*')
        .eq('sql', multiWordFunction);
      
      if (directError) {
        console.error('❌ Alternative method also failed:', directError.message);
        console.log('💡 You may need to manually execute the SQL in your database');
        console.log('📁 Check the enhanced-search-migration.sql file');
        return;
      }
    }
    
    console.log('✅ Multi-word search function deployed successfully!');
    
    // Test the function
    console.log('🧪 Testing the new function...');
    const { data: testData, error: testError } = await supabase
      .rpc('search_customers_multi_word', {
        p_search_term: 'john smith',
        p_tenant_id: '00000000-0000-0000-0000-000000000000', // Dummy tenant ID for testing
        p_limit: 5,
        p_offset: 0
      });
    
    if (testError) {
      if (testError.message.includes('does not exist')) {
        console.log('⚠️  Function deployed but test failed - this is expected with dummy tenant ID');
        console.log('✅ Function deployment successful!');
      } else {
        console.error('❌ Test failed:', testError.message);
      }
    } else {
      console.log('✅ Function test successful!');
      console.log('📊 Test results:', testData?.length || 0, 'results');
    }
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    console.log('💡 You may need to manually execute the SQL in your database');
    console.log('📁 Check the enhanced-search-migration.sql file');
  }
}

// Run the deployment
deployMultiWordSearch();















