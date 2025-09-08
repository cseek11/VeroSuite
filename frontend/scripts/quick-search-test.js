// Quick test of search_customers_multi_word function
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMDE4NDAsImV4cCI6MjA3MTc3Nzg0MH0.zcHE4kKAJHAKmS1Xqxru3L6QHRBaWV5HXEXwh-Pz7so';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSearch() {
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

    console.log('✅ Authentication successful');

    // Test various search terms
    const testQueries = ['john', 'smith john', 'john smith', 'smith', 'sarah'];

    for (const query of testQueries) {
      console.log(`\n🔍 Testing search: "${query}"`);
      
      const { data, error } = await supabase.rpc('search_customers_multi_word', {
        p_search_term: query,
        p_tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
        p_limit: 10,
        p_offset: 0
      });

      if (error) {
        console.error('❌ Search failed:', error);
      } else {
        console.log(`✅ Found ${data?.length || 0} results`);
        if (data && data.length > 0) {
          console.log('📄 First result:', {
            name: data[0].name,
            relevance_score: data[0].relevance_score,
            match_type: data[0].match_type,
            match_details: data[0].match_details
          });
        }
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

testSearch();







