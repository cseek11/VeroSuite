// ============================================================================
// PHONE NUMBER DATA DEBUG SCRIPT
// ============================================================================
// Debugs phone number data to understand search issues

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugPhoneData() {
  try {
    console.log('🔍 Debugging Phone Number Data...\n');
    
    // Get all customers with phone data
    const { data: customers, error } = await supabase
      .from('accounts')
      .select('name, phone, phone_digits')
      .not('phone', 'is', null)
      .order('name');
    
    if (error) {
      throw error;
    }
    
    console.log(`📊 Found ${customers.length} customers with phone numbers:\n`);
    
    customers.forEach((customer, index) => {
      console.log(`${index + 1}. ${customer.name}`);
      console.log(`   Phone: "${customer.phone}"`);
      console.log(`   Normalized: "${customer.phone_digits}"`);
      console.log('');
    });
    
    // Test specific search scenarios
    console.log('🧪 Testing Specific Search Scenarios:\n');
    
    // Test 1: Search for "5551234"
    console.log('1. Searching for "5551234":');
    const search1 = customers.filter(c => 
      c.phone_digits?.includes('5551234') || 
      c.phone?.includes('5551234')
    );
    console.log(`   Found ${search1.length} matches:`);
    search1.forEach(c => console.log(`   - ${c.name}: ${c.phone} (${c.phone_digits})`));
    console.log('');
    
    // Test 2: Search for "555"
    console.log('2. Searching for "555":');
    const search2 = customers.filter(c => 
      c.phone_digits?.includes('555') || 
      c.phone?.includes('555')
    );
    console.log(`   Found ${search2.length} matches:`);
    search2.forEach(c => console.log(`   - ${c.name}: ${c.phone} (${c.phone_digits})`));
    console.log('');
    
    // Test 3: Search for "(555)"
    console.log('3. Searching for "(555)":');
    const search3 = customers.filter(c => 
      c.phone?.includes('(555)')
    );
    console.log(`   Found ${search3.length} matches:`);
    search3.forEach(c => console.log(`   - ${c.name}: ${c.phone} (${c.phone_digits})`));
    console.log('');
    
    // Test 4: Check for John Smith specifically
    console.log('4. John Smith phone data:');
    const johnSmith = customers.filter(c => c.name.toLowerCase().includes('john smith'));
    johnSmith.forEach(c => {
      console.log(`   ${c.name}:`);
      console.log(`     Phone: "${c.phone}"`);
      console.log(`     Normalized: "${c.phone_digits}"`);
      console.log(`     Contains "5551234": ${c.phone_digits?.includes('5551234')}`);
      console.log(`     Contains "555": ${c.phone_digits?.includes('555')}`);
    });
    console.log('');
    
    // Test 5: Database query test
    console.log('5. Testing database query for "5551234":');
    const { data: dbResults, error: dbError } = await supabase
      .from('accounts')
      .select('name, phone, phone_digits')
      .or('phone_digits.ilike.%5551234%,phone.ilike.%5551234%');
    
    if (dbError) {
      console.log(`   Database error: ${dbError.message}`);
    } else {
      console.log(`   Database found ${dbResults.length} matches:`);
      dbResults.forEach(c => console.log(`   - ${c.name}: ${c.phone} (${c.phone_digits})`));
    }
    
  } catch (error) {
    console.error('❌ Error debugging phone data:', error);
  }
}

// Run the debug
debugPhoneData();


















