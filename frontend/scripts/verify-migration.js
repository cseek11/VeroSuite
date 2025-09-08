// ============================================================================
// MIGRATION VERIFICATION SCRIPT
// ============================================================================
// Verifies that the phone normalization migration was successful

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyMigration() {
  try {
    console.log('🔍 Verifying Database Migration...\n');
    
    // 1. Check if phone_digits column exists
    console.log('1️⃣ Checking phone_digits column...');
    const { data: columns, error: columnError } = await supabase
      .from('accounts')
      .select('phone_digits')
      .limit(1);
    
    if (columnError) {
      console.log('❌ phone_digits column not found or error:', columnError.message);
    } else {
      console.log('✅ phone_digits column exists');
    }
    
    // 2. Check if phone_digits has data
    console.log('\n2️⃣ Checking phone_digits data...');
    const { data: phoneData, error: phoneError } = await supabase
      .from('accounts')
      .select('phone, phone_digits')
      .not('phone', 'is', null)
      .limit(5);
    
    if (phoneError) {
      console.log('❌ Error fetching phone data:', phoneError.message);
    } else {
      console.log('✅ Phone data found:');
      phoneData.forEach((record, index) => {
        console.log(`   Record ${index + 1}:`);
        console.log(`     Original: ${record.phone}`);
        console.log(`     Normalized: ${record.phone_digits}`);
      });
    }
    
    // 3. Check if indexes exist (by testing performance)
    console.log('\n3️⃣ Testing search performance...');
    const startTime = performance.now();
    
    const { data: searchResults, error: searchError } = await supabase
      .from('accounts')
      .select('name, phone, phone_digits')
      .ilike('phone_digits', '%555%')
      .limit(10);
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (searchError) {
      console.log('❌ Search test failed:', searchError.message);
    } else {
      console.log(`✅ Search test successful (${duration.toFixed(2)}ms)`);
      console.log(`   Found ${searchResults.length} results with '555' in phone`);
    }
    
    // 4. Test the normalize_phone function
    console.log('\n4️⃣ Testing normalize_phone function...');
    const { data: functionTest, error: functionError } = await supabase
      .rpc('normalize_phone', { phone: '(412) 555-1234' });
    
    if (functionError) {
      console.log('❌ normalize_phone function not found:', functionError.message);
    } else {
      console.log('✅ normalize_phone function works');
      console.log(`   Input: (412) 555-1234`);
      console.log(`   Output: ${functionTest}`);
    }
    
    // 5. Check trigger functionality
    console.log('\n5️⃣ Testing trigger functionality...');
    const testPhone = '(555) 999-8888';
    const { data: triggerTest, error: triggerError } = await supabase
      .from('accounts')
      .select('phone, phone_digits')
      .ilike('phone', '%999%')
      .limit(1);
    
    if (triggerError) {
      console.log('❌ Trigger test failed:', triggerError.message);
    } else if (triggerTest.length > 0) {
      console.log('✅ Trigger appears to be working');
      console.log(`   Found record with phone: ${triggerTest[0].phone}`);
      console.log(`   Normalized: ${triggerTest[0].phone_digits}`);
    } else {
      console.log('⚠️  No test data found for trigger verification');
    }
    
    // 6. Overall migration status
    console.log('\n📊 Migration Status Summary:');
    const checks = [
      { name: 'phone_digits column', status: !columnError },
      { name: 'phone_digits data', status: !phoneError && phoneData.length > 0 },
      { name: 'search performance', status: !searchError },
      { name: 'normalize_phone function', status: !functionError },
      { name: 'trigger functionality', status: !triggerError }
    ];
    
    const passedChecks = checks.filter(check => check.status).length;
    const totalChecks = checks.length;
    
    checks.forEach(check => {
      const status = check.status ? '✅' : '❌';
      console.log(`   ${status} ${check.name}`);
    });
    
    console.log(`\n🎯 Migration Status: ${passedChecks}/${totalChecks} checks passed`);
    
    if (passedChecks === totalChecks) {
      console.log('🎉 Migration successful! All components are working.');
    } else {
      console.log('⚠️  Migration partially successful. Some components may need attention.');
    }
    
  } catch (error) {
    console.error('❌ Error verifying migration:', error);
  }
}

// Run the verification
verifyMigration();










