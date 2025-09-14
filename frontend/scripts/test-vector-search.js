// ============================================================================
// TEST VECTOR SEARCH FUNCTIONALITY
// ============================================================================
// Script to test vector search once pgvector is properly configured

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testVectorSearch() {
  try {
    console.log('🔍 Testing Vector Search Functionality...\n');

    // Test 1: Check if vector search function exists
    console.log('1️⃣ Testing vector search function...');
    const testEmbedding = Array(1536).fill(0.1); // Simple test embedding
    
    const { data: vectorResults, error: vectorError } = await supabase.rpc(
      'search_customers_vector',
      {
        p_embedding: testEmbedding,
        p_tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
        p_limit: 5,
        p_threshold: 0.1
      }
    );

    if (vectorError) {
      console.log('❌ Vector search failed:', vectorError.message);
    } else {
      console.log('✅ Vector search function working');
      console.log(`   Results: ${vectorResults?.length || 0} customers found`);
      if (vectorResults?.length > 0) {
        console.log(`   First result: ${vectorResults[0].name} (similarity: ${vectorResults[0].similarity_score})`);
      }
    }

    // Test 2: Check if embedding column exists
    console.log('\n2️⃣ Checking embedding column...');
    const { data: columnInfo, error: columnError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'accounts')
      .eq('column_name', 'embedding');

    if (columnError) {
      console.log('❌ Column check failed:', columnError.message);
    } else {
      if (columnInfo?.length > 0) {
        console.log('✅ Embedding column exists:', columnInfo[0].data_type);
      } else {
        console.log('❌ Embedding column not found');
      }
    }

    // Test 3: Check if any customers have embeddings
    console.log('\n3️⃣ Checking for existing embeddings...');
    const { data: embeddingCount, error: countError } = await supabase
      .from('accounts')
      .select('id, name, embedding')
      .not('embedding', 'is', null)
      .limit(5);

    if (countError) {
      console.log('❌ Embedding count failed:', countError.message);
    } else {
      console.log(`✅ Found ${embeddingCount?.length || 0} customers with embeddings`);
      if (embeddingCount?.length > 0) {
        console.log(`   Example: ${embeddingCount[0].name} has embedding`);
      }
    }

    // Test 4: Test with enhanced search service
    console.log('\n4️⃣ Testing enhanced search service...');
    
    // Import the enhanced search service
    const { enhancedSearch } = await import('../src/lib/enhanced-search-service.ts');
    
    const vectorResults2 = await enhancedSearch.searchCustomersVector(
      testEmbedding,
      5,
      0.1
    );

    console.log(`✅ Enhanced service vector search: ${vectorResults2.length} results`);

    // Test 5: Generate a sample embedding for testing
    console.log('\n5️⃣ Generating sample embedding...');
    
    // Create a simple embedding for "John Smith" (this would normally come from an AI service)
    const sampleEmbedding = Array(1536).fill(0).map((_, i) => {
      // Create a simple pattern for testing
      return Math.sin(i * 0.1) * 0.5 + 0.5;
    });

    const sampleResults = await enhancedSearch.searchCustomersVector(
      sampleEmbedding,
      3,
      0.1
    );

    console.log(`✅ Sample embedding search: ${sampleResults.length} results`);
    if (sampleResults.length > 0) {
      console.log(`   Top result: ${sampleResults[0].name} (similarity: ${sampleResults[0]._similarity_score})`);
    }

    console.log('\n🎉 Vector search testing completed!');
    console.log('\nNext steps:');
    console.log('1. Generate real embeddings for your customers using an AI service');
    console.log('2. Test vector search with real customer data');
    console.log('3. Integrate vector search into your frontend');

  } catch (error) {
    console.error('❌ Vector search test failed:', error);
  }
}

// Run the test
testVectorSearch();


















