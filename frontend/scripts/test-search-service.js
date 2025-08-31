// ============================================================================
// TEST SEARCH SERVICE
// ============================================================================
// Test script to check if the search service is working correctly

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (same as in search-service.ts)
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mock the getTenantId function from search-service.ts
const getTenantId = async () => {
  const knownTenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.user_metadata?.tenant_id) {
      return user.user_metadata.tenant_id;
    }
  } catch (error) {
    console.log('Using fallback tenant ID');
  }
  
  return knownTenantId;
};

// Mock the searchCustomers function from search-service.ts
async function searchCustomers(filters = {}) {
  const startTime = performance.now();
  
  try {
    const tenantId = await getTenantId();
    console.log(`🔍 Using tenant ID: ${tenantId}`);
    
    let query = supabase
      .from('accounts')
      .select(`
        *,
        customer_profiles (*),
        customer_contacts (*),
        locations (*),
        work_orders (*),
        jobs (*)
      `)
      .eq('tenant_id', tenantId);

    if (filters.search) {
      const searchTerm = filters.search.trim();
      if (searchTerm.length > 0) {
        console.log(`🔍 Applying search filter: "${searchTerm}"`);
        
        // Build search query (simplified version)
        const phoneDigits = searchTerm.replace(/\D/g, '');
        let searchQuery = `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`;
        
        if (phoneDigits.length > 0) {
          searchQuery += `,phone.ilike.%${searchTerm}%,phone_digits.ilike.%${phoneDigits}%`;
          searchQuery += `,phone.ilike.%${phoneDigits}%`;
        } else {
          searchQuery += `,phone.ilike.%${searchTerm}%`;
        }
        
        // Address search
        const addressTokens = searchTerm.split(/\s+/).filter(token => token.length > 0);
        if (addressTokens.length > 1) {
          addressTokens.forEach(token => {
            searchQuery += `,address.ilike.%${token}%,city.ilike.%${token}%,state.ilike.%${token}%,zip_code.ilike.%${token}%`;
          });
        } else {
          searchQuery += `,address.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,state.ilike.%${searchTerm}%,zip_code.ilike.%${searchTerm}%`;
        }
        
        searchQuery += `,account_type.ilike.%${searchTerm}%,status.ilike.%${searchTerm}%`;
        
        console.log(`🔍 Search query: ${searchQuery}`);
        query = query.or(searchQuery);
      }
    }

    if (filters.status) {
      console.log(`🔍 Applying status filter: "${filters.status}"`);
      query = query.eq('status', filters.status);
    }

    if (filters.segmentId) {
      console.log(`🔍 Applying segment filter: "${filters.segmentId}"`);
      query = query.eq('segment_id', filters.segmentId);
    }

    const { data, error } = await query.order('name');
    if (error) throw error;

    const results = data || [];
    const endTime = performance.now();
    const timeTakenMs = Math.round(endTime - startTime);

    console.log(`✅ Search completed in ${timeTakenMs}ms`);
    return results;
  } catch (error) {
    console.error('❌ Error in search:', error);
    throw error;
  }
}

async function testSearchService() {
  try {
    console.log('🧪 Testing Search Service...\n');
    
    // Test 1: Empty search (should return all customers)
    console.log('1️⃣ Testing empty search...');
    const emptyResults = await searchCustomers({});
    console.log(`✅ Empty search returned ${emptyResults.length} customers`);
    emptyResults.forEach(customer => {
      console.log(`   - ${customer.name} (${customer.phone})`);
    });
    console.log('');
    
    // Test 2: Search by name
    console.log('2️⃣ Testing name search: "john"...');
    const nameResults = await searchCustomers({ search: 'john' });
    console.log(`✅ Name search returned ${nameResults.length} customers`);
    nameResults.forEach(customer => {
      console.log(`   - ${customer.name} (${customer.phone})`);
    });
    console.log('');
    
    // Test 3: Search by phone
    console.log('3️⃣ Testing phone search: "5551234"...');
    const phoneResults = await searchCustomers({ search: '5551234' });
    console.log(`✅ Phone search returned ${phoneResults.length} customers`);
    phoneResults.forEach(customer => {
      console.log(`   - ${customer.name} (${customer.phone})`);
    });
    console.log('');
    
    // Test 4: Search by address
    console.log('4️⃣ Testing address search: "321 oak"...');
    const addressResults = await searchCustomers({ search: '321 oak' });
    console.log(`✅ Address search returned ${addressResults.length} customers`);
    addressResults.forEach(customer => {
      console.log(`   - ${customer.name} (${customer.phone})`);
    });
    console.log('');
    
    // Test 5: Status filter
    console.log('5️⃣ Testing status filter: "active"...');
    const statusResults = await searchCustomers({ status: 'active' });
    console.log(`✅ Status filter returned ${statusResults.length} customers`);
    statusResults.forEach(customer => {
      console.log(`   - ${customer.name} (${customer.status})`);
    });
    console.log('');
    
    console.log('📋 Summary:');
    console.log(`   Empty search: ${emptyResults.length} customers`);
    console.log(`   Name search: ${nameResults.length} customers`);
    console.log(`   Phone search: ${phoneResults.length} customers`);
    console.log(`   Address search: ${addressResults.length} customers`);
    console.log(`   Status filter: ${statusResults.length} customers`);
    
  } catch (error) {
    console.error('❌ Error testing search service:', error);
  }
}

// Run the test
testSearchService();
