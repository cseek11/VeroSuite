// ============================================================================
// TEST MULTI-WORD SEARCH FUNCTION
// ============================================================================
// This script tests the new multi-word search function

import { createClient } from '@supabase/supabase-js';

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

async function testMultiWordSearch() {
  try {
    console.log('🧪 Testing multi-word search function...');
    
    // First, get the current user's tenant ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('❌ No authenticated user found');
      return;
    }
    
    console.log('👤 User:', user.email);
    
    // Get tenant ID
    const { data: tenantId, error: tenantError } = await supabase
      .rpc('get_user_tenant_id', { user_email: user.email });
    
    if (tenantError) {
      console.error('❌ Failed to get tenant ID:', tenantError.message);
      return;
    }
    
    console.log('🏢 Tenant ID:', tenantId);
    
    // Test queries
    const testQueries = [
      'john',           // Single word
      'smith',          // Single word
      'john smith',     // Multi-word (should find both)
      'smith john',     // Multi-word reversed (should find both)
      'last first',     // Multi-word (should find both)
      'first last',     // Multi-word reversed (should find both)
      'john doe',       // Multi-word (should find both)
      'doe john',       // Multi-word reversed (should find both)
    ];
    
    for (const query of testQueries) {
      console.log(`\n🔍 Testing query: "${query}"`);
      
      try {
        const { data, error } = await supabase
          .rpc('search_customers_multi_word', {
            p_search_term: query,
            p_tenant_id: tenantId,
            p_limit: 10,
            p_offset: 0
          });
        
        if (error) {
          console.error(`❌ Query "${query}" failed:`, error.message);
          continue;
        }
        
        console.log(`✅ Query "${query}" returned ${data?.length || 0} results`);
        
        if (data && data.length > 0) {
          console.log('📊 Top results:');
          data.slice(0, 3).forEach((result, index) => {
            console.log(`  ${index + 1}. ${result.name} (${result.match_type}) - Score: ${result.relevance_score}`);
            if (result.match_details) {
              console.log(`     Matched terms: ${result.match_details.matched_terms?.join(', ') || 'N/A'}`);
              console.log(`     Match count: ${result.match_details.match_count || 'N/A'}`);
            }
          });
        }
        
      } catch (queryError) {
        console.error(`❌ Query "${query}" error:`, queryError.message);
      }
    }
    
    console.log('\n🎉 Multi-word search testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testMultiWordSearch();





