// ============================================================================
// DEPLOY DATA CONSISTENCY FIX
// ============================================================================
// This script deploys the data consistency fixes to the database

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// ============================================================================
// CONFIGURATION
// ============================================================================

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// DEPLOYMENT FUNCTIONS
// ============================================================================

async function deployDataConsistencyFix() {
  console.log('🔧 Deploying Data Consistency Fix...\n');
  
  try {
    // Read the SQL file
    const sqlContent = readFileSync('scripts/fix-data-consistency.sql', 'utf8');
    
    // Split into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.length === 0) continue;
      
      try {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: statement
        });
        
        if (error) {
          console.log(`❌ Statement ${i + 1} failed: ${error.message}`);
          errorCount++;
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
          successCount++;
        }
      } catch (err) {
        console.log(`❌ Statement ${i + 1} error: ${err.message}`);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Deployment Results:`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📈 Success Rate: ${((successCount / (successCount + errorCount)) * 100).toFixed(1)}%`);
    
    return errorCount === 0;
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    return false;
  }
}

async function testDataConsistency() {
  console.log('\n🧪 Testing Data Consistency...\n');
  
  const testTenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';
  
  try {
    // Test enhanced search
    console.log('1. Testing enhanced search...');
    const { data: enhancedResults, error: enhancedError } = await supabase.rpc('search_customers_enhanced', {
      p_tenant_id: testTenantId,
      p_search_term: 'John',
      p_limit: 5
    });
    
    if (enhancedError) {
      console.log(`   ❌ Enhanced search failed: ${enhancedError.message}`);
      return false;
    }
    
    console.log(`   ✅ Enhanced search: Found ${enhancedResults.length} results`);
    
    // Test data consistency
    for (const result of enhancedResults) {
      const { data: dbCustomer, error: dbError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', result.id)
        .eq('tenant_id', testTenantId)
        .single();
      
      if (dbError || !dbCustomer) {
        console.log(`   ❌ Search result ${result.id} not found in database`);
        return false;
      }
      
      // Check field mapping
      const expectedName = `${dbCustomer.first_name} ${dbCustomer.last_name}`;
      if (result.name !== expectedName) {
        console.log(`   ❌ Name mismatch: expected "${expectedName}", got "${result.name}"`);
        return false;
      }
      
      if (result.email !== dbCustomer.email) {
        console.log(`   ❌ Email mismatch: expected "${dbCustomer.email}", got "${result.email}"`);
        return false;
      }
      
      if (result.phone !== dbCustomer.phone) {
        console.log(`   ❌ Phone mismatch: expected "${dbCustomer.phone}", got "${result.phone}"`);
        return false;
      }
      
      if (result.address !== dbCustomer.address) {
        console.log(`   ❌ Address mismatch: expected "${dbCustomer.address}", got "${result.address}"`);
        return false;
      }
      
      if (result.status !== dbCustomer.status) {
        console.log(`   ❌ Status mismatch: expected "${dbCustomer.status}", got "${result.status}"`);
        return false;
      }
      
      if (result.type !== dbCustomer.account_type) {
        console.log(`   ❌ Type mismatch: expected "${dbCustomer.account_type}", got "${result.type}"`);
        return false;
      }
    }
    
    console.log('   ✅ All search results consistent with database');
    
    // Test input validation
    console.log('\n2. Testing input validation...');
    
    // Test empty search term
    const { data: emptyResults, error: emptyError } = await supabase.rpc('search_customers_enhanced', {
      p_tenant_id: testTenantId,
      p_search_term: '',
      p_limit: 5
    });
    
    if (emptyError) {
      console.log('   ✅ Empty search term properly rejected');
    } else {
      console.log('   ❌ Empty search term should have been rejected');
      return false;
    }
    
    // Test invalid tenant ID
    const { data: invalidTenantResults, error: invalidTenantError } = await supabase.rpc('search_customers_enhanced', {
      p_tenant_id: '00000000-0000-0000-0000-000000000000',
      p_search_term: 'test',
      p_limit: 5
    });
    
    if (invalidTenantError) {
      console.log('   ✅ Invalid tenant ID properly rejected');
    } else {
      console.log('   ❌ Invalid tenant ID should have been rejected');
      return false;
    }
    
    // Test invalid limit
    const { data: invalidLimitResults, error: invalidLimitError } = await supabase.rpc('search_customers_enhanced', {
      p_tenant_id: testTenantId,
      p_search_term: 'test',
      p_limit: 0
    });
    
    if (invalidLimitError) {
      console.log('   ✅ Invalid limit properly rejected');
    } else {
      console.log('   ❌ Invalid limit should have been rejected');
      return false;
    }
    
    console.log('   ✅ All input validation tests passed');
    
    return true;
    
  } catch (error) {
    console.error('❌ Data consistency test failed:', error.message);
    return false;
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('🚀 Starting Data Consistency Fix Deployment...\n');
  
  // Deploy the fix
  const deploySuccess = await deployDataConsistencyFix();
  
  if (!deploySuccess) {
    console.log('\n❌ Deployment failed. Please check the errors above.');
    process.exit(1);
  }
  
  // Test the fix
  const testSuccess = await testDataConsistency();
  
  if (testSuccess) {
    console.log('\n🎉 Data Consistency Fix Successfully Deployed!');
    console.log('✅ All search functions updated with proper field mapping');
    console.log('✅ Input validation added to all functions');
    console.log('✅ Data consistency verified');
    console.log('✅ Input validation verified');
  } else {
    console.log('\n❌ Data consistency test failed. Please check the errors above.');
    process.exit(1);
  }
}

// Run the deployment
main()
  .then(() => {
    console.log('\n✅ Deployment completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Deployment failed:', error);
    process.exit(1);
  });
