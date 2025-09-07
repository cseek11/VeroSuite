// Test multi-word search order issue
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMDE4NDAsImV4cCI6MjA3MTc3Nzg0MH0.zcHE4kKAJHAKmS1Xqxru3L6QHRBaWV5HXEXwh-Pz7so';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMultiWordOrder() {
  try {
    // Sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@veropestsolutions.com',
      password: 'password123'
    });

    if (authError) {
      console.error('❌ Auth failed:', authError);
      return;
    }

    const tenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';

    // Test both orders
    const testQueries = [
      'john smith',
      'smith john',
      'john', 
      'smith'
    ];

    for (const query of testQueries) {
      console.log(`\n🔍 Testing: "${query}"`);
      
      const { data, error } = await supabase.rpc('search_customers_multi_word', {
        p_search_term: query,
        p_tenant_id: tenantId,
        p_limit: 10,
        p_offset: 0
      });

      if (error) {
        console.error('❌ Error:', error);
      } else {
        console.log(`✅ Results: ${data?.length || 0}`);
        if (data && data.length > 0) {
          console.log('📄 Sample results:');
          data.slice(0, 3).forEach(result => {
            console.log(`  - ${result.name} (${result.match_type}, score: ${result.relevance_score})`);
          });
        }
      }
    }

    // Also check what customers exist with "smith" and "john"
    console.log('\n🔍 Checking existing customers with "smith" or "john":');
    const { data: allCustomers, error: allError } = await supabase
      .from('accounts')
      .select('name')
      .eq('tenant_id', tenantId)
      .or('name.ilike.%smith%,name.ilike.%john%')
      .limit(10);

    if (allError) {
      console.error('❌ Error checking customers:', allError);
    } else {
      console.log('📋 Customers with smith/john:');
      allCustomers?.forEach(customer => {
        console.log(`  - ${customer.name}`);
      });
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

testMultiWordOrder();





