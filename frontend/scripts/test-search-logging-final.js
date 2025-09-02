// ============================================================================
// FINAL SEARCH LOGGING TEST
// ============================================================================
// Final test to verify search logging integration is working

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSearchLoggingFinal() {
  console.log('🔍 Final Search Logging Integration Test...\n');
  
  try {
    // Test 1: Login to get a real user ID
    console.log('1️⃣ Logging in to get real user ID...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'admin@veropestsolutions.com',
      password: 'password123'
    });
    
    if (loginError) {
      console.log('❌ Login failed:', loginError.message);
      return;
    }
    
    console.log('✅ Login successful, user ID:', loginData.user.id);
    
    // Test 2: Get tenant ID
    console.log('\n2️⃣ Getting tenant ID...');
    const { data: tenantId, error: tenantError } = await supabase
      .rpc('get_user_tenant_id', {
        user_email: 'admin@veropestsolutions.com'
      });
    
    if (tenantError) {
      console.log('❌ Get tenant ID failed:', tenantError.message);
      return;
    }
    
    console.log('✅ Tenant ID:', tenantId);
    
    // Test 3: Log a search query
    console.log('\n3️⃣ Logging a search query...');
    const { data: logData, error: logError } = await supabase
      .from('search_logs')
      .insert({
        user_id: loginData.user.id,
        tenant_id: tenantId,
        query: 'test search integration',
        results_count: 8,
        time_taken_ms: 150,
        search_filters: { status: 'active', type: 'residential' }
      })
      .select('id')
      .single();
    
    if (logError) {
      console.log('❌ Log insert failed:', logError.message);
      return;
    }
    
    console.log('✅ Search logged successfully, log ID:', logData.id);
    
    // Test 4: Update log with click
    console.log('\n4️⃣ Logging a click...');
    const { data: clickData, error: clickError } = await supabase
      .from('search_logs')
      .update({ clicked_record_id: 'test-customer-id' })
      .eq('id', logData.id)
      .select('clicked_record_id')
      .single();
    
    if (clickError) {
      console.log('❌ Click log failed:', clickError.message);
      return;
    }
    
    console.log('✅ Click logged successfully, record ID:', clickData.clicked_record_id);
    
    // Test 5: Get recent searches
    console.log('\n5️⃣ Getting recent searches...');
    const { data: recentData, error: recentError } = await supabase
      .from('search_logs')
      .select('query, created_at')
      .eq('tenant_id', tenantId)
      .eq('user_id', loginData.user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (recentError) {
      console.log('❌ Recent searches failed:', recentError.message);
      return;
    }
    
    console.log('✅ Recent searches retrieved:');
    recentData.forEach((search, index) => {
      console.log(`   ${index + 1}. "${search.query}" (${search.created_at})`);
    });
    
    // Test 6: Get popular searches
    console.log('\n6️⃣ Getting popular searches...');
    const { data: popularData, error: popularError } = await supabase
      .from('search_logs')
      .select('query')
      .eq('tenant_id', tenantId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
    
    if (popularError) {
      console.log('❌ Popular searches failed:', popularError.message);
      return;
    }
    
    // Count query frequency
    const queryCounts = {};
    popularData.forEach(log => {
      queryCounts[log.query] = (queryCounts[log.query] || 0) + 1;
    });
    
    const topQueries = Object.entries(queryCounts)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    console.log('✅ Popular searches:');
    topQueries.forEach((query, index) => {
      console.log(`   ${index + 1}. "${query.query}" (${query.count} times)`);
    });
    
    // Test 7: Calculate basic analytics
    console.log('\n7️⃣ Calculating basic analytics...');
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('search_logs')
      .select('results_count, time_taken_ms, clicked_record_id')
      .eq('tenant_id', tenantId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
    
    if (analyticsError) {
      console.log('❌ Analytics failed:', analyticsError.message);
      return;
    }
    
    const totalSearches = analyticsData.length;
    const avgResults = totalSearches > 0 ? analyticsData.reduce((sum, log) => sum + log.results_count, 0) / totalSearches : 0;
    const avgTime = totalSearches > 0 ? analyticsData.reduce((sum, log) => sum + log.time_taken_ms, 0) / totalSearches : 0;
    const totalClicks = analyticsData.filter(log => log.clicked_record_id).length;
    const clickThroughRate = totalSearches > 0 ? totalClicks / totalSearches : 0;
    
    console.log('✅ Analytics calculated:');
    console.log(`   Total searches: ${totalSearches}`);
    console.log(`   Average results: ${avgResults.toFixed(1)}`);
    console.log(`   Average time: ${avgTime.toFixed(0)}ms`);
    console.log(`   Click-through rate: ${(clickThroughRate * 100).toFixed(1)}%`);
    
    // Sign out
    await supabase.auth.signOut();
    console.log('\n✅ Signed out');
    
    console.log('\n🎯 FINAL SEARCH LOGGING TEST RESULTS:');
    console.log('✅ ALL TESTS PASSED!');
    console.log('   ✅ User authentication: WORKING');
    console.log('   ✅ Tenant ID resolution: WORKING');
    console.log('   ✅ Search logging: WORKING');
    console.log('   ✅ Click tracking: WORKING');
    console.log('   ✅ Recent searches: WORKING');
    console.log('   ✅ Popular searches: WORKING');
    console.log('   ✅ Analytics calculation: WORKING');
    console.log('✅ Search logging integration is fully functional!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testSearchLoggingFinal();
