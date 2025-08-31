// ============================================================================
// VERIFY PGVECTOR EXTENSION
// ============================================================================
// Script to verify pgvector extension is properly enabled and working

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyPgvector() {
  try {
    console.log('🔍 Verifying pgvector extension...\n');

    // Test 1: Check if pgvector extension is available
    console.log('1️⃣ Testing pgvector extension availability...');
    const { data: extensionData, error: extensionError } = await supabase.rpc(
      'check_pgvector_extension'
    );

    if (extensionError) {
      console.log('❌ Extension check failed:', extensionError.message);
      console.log('   This might mean the function doesn\'t exist yet');
    } else {
      console.log('✅ Extension check successful:', extensionData);
    }

    // Test 2: Try to create a simple vector
    console.log('\n2️⃣ Testing vector creation...');
    const { data: vectorTest, error: vectorError } = await supabase.rpc(
      'test_vector_creation'
    );

    if (vectorError) {
      console.log('❌ Vector creation failed:', vectorError.message);
    } else {
      console.log('✅ Vector creation successful:', vectorTest);
    }

    // Test 3: Check if vector column can be added
    console.log('\n3️⃣ Testing vector column addition...');
    const { data: columnTest, error: columnError } = await supabase.rpc(
      'test_vector_column'
    );

    if (columnError) {
      console.log('❌ Vector column test failed:', columnError.message);
    } else {
      console.log('✅ Vector column test successful:', columnTest);
    }

    // Test 4: Check current table structure
    console.log('\n4️⃣ Checking current table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'accounts')
      .eq('table_schema', 'public')
      .order('column_name');

    if (tableError) {
      console.log('❌ Table structure check failed:', tableError.message);
    } else {
      console.log('✅ Current accounts table columns:');
      tableInfo.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type}`);
      });
    }

    // Test 5: Try to run the vector search migration
    console.log('\n5️⃣ Testing vector search migration...');
    console.log('   Run this SQL in your Supabase SQL editor:');
    console.log('   \\i frontend/scripts/vector-search-migration.sql');

  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

// Run the verification
verifyPgvector();
