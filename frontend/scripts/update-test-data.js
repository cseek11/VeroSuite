// ============================================================================
// UPDATE TEST DATA SCRIPT
// ============================================================================
// This script updates existing customers with better variety for testing

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test data with variety
const testDataUpdates = [
  {
    name: 'John Smith',
    status: 'active',
    ar_balance: 1250.00,
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    name: 'Sarah Johnson',
    status: 'inactive',
    ar_balance: 3200.50,
    created_at: '2024-02-10T09:15:00Z'
  },
  {
    name: 'Mike Wilson',
    status: 'pending',
    ar_balance: 750.25,
    created_at: '2024-03-22T14:45:00Z'
  },
  {
    name: 'Lisa Davis',
    status: 'active',
    ar_balance: 2100.75,
    created_at: '2024-04-05T11:20:00Z'
  },
  {
    name: 'Robert Brown',
    status: 'suspended',
    ar_balance: 4500.00,
    created_at: '2024-05-12T16:30:00Z'
  },
  {
    name: 'Jennifer Garcia',
    status: 'active',
    ar_balance: 1800.00,
    created_at: '2024-06-18T08:45:00Z'
  }
];

async function updateTestData() {
  try {
    console.log('Starting test data update...');
    
    // Get existing customers
    const { data: customers, error: fetchError } = await supabase
      .from('accounts')
      .select('id, name')
      .limit(6);
    
    if (fetchError) {
      throw fetchError;
    }
    
    console.log(`Found ${customers.length} customers to update`);
    
    // Update each customer with test data
    for (let i = 0; i < Math.min(customers.length, testDataUpdates.length); i++) {
      const customer = customers[i];
      const updateData = testDataUpdates[i];
      
      console.log(`Updating ${customer.name} with:`, updateData);
      
      const { error: updateError } = await supabase
        .from('accounts')
        .update(updateData)
        .eq('id', customer.id);
      
      if (updateError) {
        console.error(`Error updating ${customer.name}:`, updateError);
      } else {
        console.log(`✅ Updated ${customer.name}`);
      }
    }
    
    console.log('Test data update completed!');
    
  } catch (error) {
    console.error('Error updating test data:', error);
    process.exit(1);
  }
}

// Run the update
updateTestData();
