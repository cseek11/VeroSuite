// ============================================================================
// ADD CUSTOMERS TO USER'S TENANT
// ============================================================================
// Add test customers to the user's actual tenant ID

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addCustomersToUserTenant() {
  console.log('🏢 Adding customers to user\'s tenant...\n');
  
  try {
    // Get current user to find their tenant ID
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('❌ User error:', userError?.message || 'No user found');
      return;
    }
    
    const tenantId = user.user_metadata?.tenant_id || user.app_metadata?.tenant_id;
    if (!tenantId) {
      console.log('❌ No tenant ID found in user metadata');
      return;
    }
    
    console.log('✅ User tenant ID:', tenantId);
    console.log('✅ User email:', user.email);
    
    // Test customers for the user's tenant
    const testCustomers = [
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        address: '123 Main Street',
        city: 'Anytown',
        state: 'CA',
        zip_code: '90210',
        status: 'active',
        account_type: 'residential',
        tenant_id: tenantId,
        phone_digits: '5551234567'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '(555) 987-6543',
        address: '456 Oak Avenue',
        city: 'Somewhere',
        state: 'NY',
        zip_code: '10001',
        status: 'active',
        account_type: 'commercial',
        tenant_id: tenantId,
        phone_digits: '5559876543'
      },
      {
        name: 'Mike Wilson',
        email: 'mike.wilson@email.com',
        phone: '(555) 456-7890',
        address: '789 Pine Street',
        city: 'Elsewhere',
        state: 'TX',
        zip_code: '75001',
        status: 'inactive',
        account_type: 'residential',
        tenant_id: tenantId,
        phone_digits: '5554567890'
      }
    ];
    
    console.log(`\n📝 Adding ${testCustomers.length} customers to tenant ${tenantId}...`);
    
    // Insert customers
    const { data: insertedCustomers, error: insertError } = await supabase
      .from('accounts')
      .insert(testCustomers)
      .select();
    
    if (insertError) {
      console.log('❌ Insert error:', insertError.message);
      return;
    }
    
    console.log('✅ Successfully added customers:');
    insertedCustomers.forEach(customer => {
      console.log(`   - ${customer.name} (${customer.email})`);
    });
    
    // Verify the customers were added
    console.log('\n🔍 Verifying customers...');
    const { data: verifyCustomers, error: verifyError } = await supabase
      .from('accounts')
      .select('id, name, email, tenant_id')
      .eq('tenant_id', tenantId);
    
    if (verifyError) {
      console.log('❌ Verify error:', verifyError.message);
    } else {
      console.log(`✅ Found ${verifyCustomers.length} customers in tenant ${tenantId}:`);
      verifyCustomers.forEach(customer => {
        console.log(`   - ${customer.name} (${customer.email})`);
      });
    }
    
    console.log('\n🎉 Customer addition completed!');
    
  } catch (error) {
    console.error('❌ Script failed:', error);
  }
}

// Run the script
addCustomersToUserTenant();





