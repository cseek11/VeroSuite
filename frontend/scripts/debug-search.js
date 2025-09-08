import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugSearch() {
  const tenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';
  
  console.log('🔍 Testing different search terms...\n');
  
  // Test 1: Search for existing names
  const testQueries = ['john', 'smith', 'john smith', 'sarah', 'johnson'];
  
  for (const query of testQueries) {
    console.log(`📋 Testing: "${query}"`);
    try {
      const { data, error } = await supabase.rpc('search_customers_multi_word', {
        p_search_term: query,
        p_tenant_id: tenantId,
        p_limit: 10,
        p_offset: 0
      });
      
      if (error) {
        console.log('  ❌ Error:', error.message);
      } else {
        console.log(`  ✅ Results: ${data?.length || 0}`);
        if (data && data.length > 0) {
          console.log(`  📊 Sample: ${data[0].name} (${data[0].match_type}, score: ${data[0].relevance_score})`);
        }
      }
    } catch (err) {
      console.log('  ❌ Exception:', err.message);
    }
    console.log('');
  }
  
  // Test 2: Check what accounts exist
  console.log('📋 Checking existing accounts...');
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('name, email')
      .eq('tenant_id', tenantId)
      .limit(5);
    
    if (error) {
      console.log('❌ Error getting accounts:', error);
    } else {
      console.log('✅ Available accounts:');
      data?.forEach(account => {
        console.log(`  - ${account.name} (${account.email})`);
      });
    }
  } catch (err) {
    console.log('❌ Exception getting accounts:', err.message);
  }
}

debugSearch()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Debug failed:', err);
    process.exit(1);
  });







