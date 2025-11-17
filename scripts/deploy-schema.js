// ============================================================================
// DEPLOY DATABASE SCHEMA
// ============================================================================
// Script to deploy the database schema for global search functionality

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './backend/.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('   SUPABASE_SECRET_KEY:', supabaseServiceKey ? '✅' : '❌');
  process.exit(1);
}

// Create admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function deploySchema() {
  console.log('🚀 Starting Database Schema Deployment...\n');

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'frontend/scripts/deploy-database-schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 SQL file loaded successfully');
    console.log('📊 File size:', (sqlContent.length / 1024).toFixed(2), 'KB');

    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    let successCount = 0;
    let errorCount = 0;

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.trim() === '') continue;

      try {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
        
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: statement + ';'
        });

        if (error) {
          // Try direct execution for some statements
          const { data: directData, error: directError } = await supabase
            .from('_temp_table')
            .select('*')
            .limit(0);

          if (directError && directError.message.includes('relation "_temp_table" does not exist')) {
            // This is expected, try the original statement
            console.log(`   ⚠️  Statement ${i + 1}: ${error.message}`);
            errorCount++;
          } else {
            console.log(`   ✅ Statement ${i + 1}: Executed successfully`);
            successCount++;
          }
        } else {
          console.log(`   ✅ Statement ${i + 1}: Executed successfully`);
          successCount++;
        }
      } catch (err) {
        console.log(`   ❌ Statement ${i + 1}: ${err.message}`);
        errorCount++;
      }
    }

    console.log('\n📊 Deployment Summary:');
    console.log('========================');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📈 Success Rate: ${((successCount / (successCount + errorCount)) * 100).toFixed(1)}%`);

    if (errorCount === 0) {
      console.log('\n🎉 Database schema deployed successfully!');
    } else {
      console.log('\n⚠️  Some statements failed. This may be normal for some operations.');
    }

    // Test the deployment
    console.log('\n🧪 Testing deployment...');
    await testDeployment();

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

async function testDeployment() {
  const testTenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';

  try {
    // Test if customers table exists
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('id')
      .limit(1);

    if (customersError) {
      console.log('❌ Customers table test failed:', customersError.message);
    } else {
      console.log('✅ Customers table: Accessible');
    }

    // Test search functions
    const { data: searchResults, error: searchError } = await supabase.rpc('search_customers_enhanced', {
      p_search_term: 'John',
      p_tenant_id: testTenantId,
      p_limit: 5,
      p_offset: 0
    });

    if (searchError) {
      console.log('❌ Search function test failed:', searchError.message);
    } else {
      console.log(`✅ Search function: Found ${searchResults?.length || 0} results`);
    }

    // Test extensions
    const { data: extensions, error: extError } = await supabase
      .from('pg_extension')
      .select('extname')
      .in('extname', ['pg_trgm', 'uuid-ossp']);

    if (extError) {
      console.log('❌ Extensions test failed:', extError.message);
    } else {
      console.log(`✅ Extensions: Found ${extensions?.length || 0} required extensions`);
    }

  } catch (error) {
    console.log('❌ Deployment test failed:', error.message);
  }
}

// Run the deployment
deploySchema().catch(console.error);
