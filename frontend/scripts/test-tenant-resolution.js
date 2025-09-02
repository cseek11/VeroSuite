// ============================================================================
// TEST TENANT ID RESOLUTION
// ============================================================================
// Test script to verify tenant ID resolution from user authentication

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testTenantResolution() {
  console.log('🧪 Testing Tenant ID Resolution...\n');
  
  try {
    // Test 1: Get current user
    console.log('1️⃣ Getting current user...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.log('❌ User error:', userError.message);
      return;
    }
    
    if (!user) {
      console.log('❌ No user found - please login first');
      return;
    }
    
    console.log('✅ User authenticated:', user.email);
    console.log('   User ID:', user.id);
    console.log('   User metadata:', user.user_metadata);
    console.log('   App metadata:', user.app_metadata);
    
    // Test 2: Extract tenant ID
    console.log('\n2️⃣ Extracting tenant ID...');
    const tenantId = user.user_metadata?.tenant_id || user.app_metadata?.tenant_id;
    console.log('   Tenant ID:', tenantId || 'NOT FOUND');
    
    if (!tenantId) {
      console.log('⚠️  No tenant ID found in user metadata');
      console.log('   This means the user needs to have tenant_id added to their metadata');
      return;
    }
    
    // Test 3: Test API call with resolved tenant ID
    console.log('\n3️⃣ Testing API call with resolved tenant ID...');
    const { data: customers, error: customerError } = await supabase
      .from('accounts')
      .select('id, name, email, tenant_id')
      .eq('tenant_id', tenantId)
      .limit(5);
    
    if (customerError) {
      console.log('❌ Customer fetch error:', customerError.message);
    } else {
      console.log('✅ Customers found:', customers?.length || 0);
      if (customers && customers.length > 0) {
        customers.forEach(c => {
          console.log(`   - ${c.name} (${c.email}) - Tenant: ${c.tenant_id}`);
        });
      } else {
        console.log('   No customers found for this tenant');
      }
    }
    
    // Test 4: Verify tenant isolation
    console.log('\n4️⃣ Testing tenant isolation...');
    const { data: allCustomers, error: allError } = await supabase
      .from('accounts')
      .select('id, name, email, tenant_id')
      .limit(10);
    
    if (allError) {
      console.log('❌ All customers fetch error:', allError.message);
    } else {
      const otherTenants = allCustomers?.filter(c => c.tenant_id !== tenantId) || [];
      console.log(`   Total customers in system: ${allCustomers?.length || 0}`);
      console.log(`   Customers from other tenants: ${otherTenants.length}`);
      
      if (otherTenants.length > 0) {
        console.log('   Other tenants found:');
        const uniqueTenants = [...new Set(otherTenants.map(c => c.tenant_id))];
        uniqueTenants.forEach(t => {
          const count = otherTenants.filter(c => c.tenant_id === t).length;
          console.log(`     - ${t}: ${count} customers`);
        });
      }
    }
    
    console.log('\n🎉 Tenant ID resolution test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testTenantResolution();


