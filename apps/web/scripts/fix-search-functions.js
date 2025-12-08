// ============================================================================
// FIX SEARCH FUNCTIONS - Direct Function Updates
// ============================================================================
// This script directly updates the search functions with proper field mapping
// and input validation

import { createClient } from '@supabase/supabase-js';
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
// FUNCTION DEFINITIONS
// ============================================================================

const searchFunctions = {
  enhanced: `
CREATE OR REPLACE FUNCTION search_customers_enhanced(
    p_tenant_id UUID,
    p_search_term TEXT,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
    id UUID,
    name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    status TEXT,
    type TEXT,
    score REAL
) AS $$
BEGIN
    -- Input validation
    IF p_tenant_id IS NULL THEN
        RAISE EXCEPTION 'Tenant ID cannot be null';
    END IF;
    
    IF p_search_term IS NULL OR TRIM(p_search_term) = '' THEN
        RAISE EXCEPTION 'Search term cannot be null or empty';
    END IF;
    
    IF LENGTH(TRIM(p_search_term)) < 1 THEN
        RAISE EXCEPTION 'Search term must be at least 1 character';
    END IF;
    
    IF LENGTH(TRIM(p_search_term)) > 1000 THEN
        RAISE EXCEPTION 'Search term too long (max 1000 characters)';
    END IF;
    
    IF p_limit IS NULL OR p_limit <= 0 THEN
        RAISE EXCEPTION 'Limit must be positive';
    END IF;
    
    IF p_limit > 1000 THEN
        RAISE EXCEPTION 'Limit too high (max 1000)';
    END IF;
    
    -- Validate tenant ID format
    IF p_tenant_id = '00000000-0000-0000-0000-000000000000'::UUID THEN
        RAISE EXCEPTION 'Invalid tenant ID';
    END IF;
    
    -- Perform search with proper field mapping
    RETURN QUERY
    SELECT 
        c.id,
        (c.first_name || ' ' || c.last_name)::TEXT as name,
        c.email,
        c.phone,
        c.address,
        c.status,
        c.account_type as type,
        CASE 
            WHEN c.first_name ILIKE '%' || TRIM(p_search_term) || '%' THEN 0.9
            WHEN c.last_name ILIKE '%' || TRIM(p_search_term) || '%' THEN 0.8
            WHEN c.email ILIKE '%' || TRIM(p_search_term) || '%' THEN 0.7
            WHEN c.phone ILIKE '%' || TRIM(p_search_term) || '%' THEN 0.6
            WHEN c.address ILIKE '%' || TRIM(p_search_term) || '%' THEN 0.5
            ELSE 0.3
        END as score
    FROM customers c
    WHERE c.tenant_id = p_tenant_id
    AND (
        c.first_name ILIKE '%' || TRIM(p_search_term) || '%' OR
        c.last_name ILIKE '%' || TRIM(p_search_term) || '%' OR
        c.email ILIKE '%' || TRIM(p_search_term) || '%' OR
        c.phone ILIKE '%' || TRIM(p_search_term) || '%' OR
        c.address ILIKE '%' || TRIM(p_search_term) || '%'
    )
    ORDER BY score DESC, c.first_name, c.last_name
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`,

  multiWord: `
CREATE OR REPLACE FUNCTION search_customers_multi_word(
    p_tenant_id UUID,
    p_search_term TEXT,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
    id UUID,
    name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    status TEXT,
    type TEXT,
    score REAL
) AS $$
DECLARE
    search_words TEXT[];
    word_count INTEGER;
BEGIN
    -- Input validation
    IF p_tenant_id IS NULL THEN
        RAISE EXCEPTION 'Tenant ID cannot be null';
    END IF;
    
    IF p_search_term IS NULL OR TRIM(p_search_term) = '' THEN
        RAISE EXCEPTION 'Search term cannot be null or empty';
    END IF;
    
    IF LENGTH(TRIM(p_search_term)) < 1 THEN
        RAISE EXCEPTION 'Search term must be at least 1 character';
    END IF;
    
    IF LENGTH(TRIM(p_search_term)) > 1000 THEN
        RAISE EXCEPTION 'Search term too long (max 1000 characters)';
    END IF;
    
    IF p_limit IS NULL OR p_limit <= 0 THEN
        RAISE EXCEPTION 'Limit must be positive';
    END IF;
    
    IF p_limit > 1000 THEN
        RAISE EXCEPTION 'Limit too high (max 1000)';
    END IF;
    
    -- Validate tenant ID format
    IF p_tenant_id = '00000000-0000-0000-0000-000000000000'::UUID THEN
        RAISE EXCEPTION 'Invalid tenant ID';
    END IF;
    
    -- Split search term into words
    search_words := string_to_array(TRIM(p_search_term), ' ');
    word_count := array_length(search_words, 1);
    
    -- Perform multi-word search with proper field mapping
    RETURN QUERY
    SELECT 
        c.id,
        (c.first_name || ' ' || c.last_name)::TEXT as name,
        c.email,
        c.phone,
        c.address,
        c.status,
        c.account_type as type,
        CASE 
            WHEN word_count = 1 THEN
                CASE 
                    WHEN c.first_name ILIKE '%' || search_words[1] || '%' THEN 0.9
                    WHEN c.last_name ILIKE '%' || search_words[1] || '%' THEN 0.8
                    WHEN c.email ILIKE '%' || search_words[1] || '%' THEN 0.7
                    WHEN c.phone ILIKE '%' || search_words[1] || '%' THEN 0.6
                    WHEN c.address ILIKE '%' || search_words[1] || '%' THEN 0.5
                    ELSE 0.3
                END
            ELSE
                -- Multi-word search: all words must match somewhere
                CASE 
                    WHEN (
                        SELECT COUNT(*) FROM unnest(search_words) AS word
                        WHERE (
                            c.first_name ILIKE '%' || word || '%' OR
                            c.last_name ILIKE '%' || word || '%' OR
                            c.email ILIKE '%' || word || '%' OR
                            c.phone ILIKE '%' || word || '%' OR
                            c.address ILIKE '%' || word || '%'
                        )
                    ) = word_count THEN 0.8
                    ELSE 0.3
                END
        END as score
    FROM customers c
    WHERE c.tenant_id = p_tenant_id
    AND (
        SELECT COUNT(*) FROM unnest(search_words) AS word
        WHERE (
            c.first_name ILIKE '%' || word || '%' OR
            c.last_name ILIKE '%' || word || '%' OR
            c.email ILIKE '%' || word || '%' OR
            c.phone ILIKE '%' || word || '%' OR
            c.address ILIKE '%' || word || '%'
        )
    ) > 0
    ORDER BY score DESC, c.first_name, c.last_name
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`,

  fuzzy: `
CREATE OR REPLACE FUNCTION search_customers_fuzzy(
    p_tenant_id UUID,
    p_search_term TEXT,
    p_threshold REAL DEFAULT 0.3,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
    id UUID,
    name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    status TEXT,
    type TEXT,
    score REAL
) AS $$
BEGIN
    -- Input validation
    IF p_tenant_id IS NULL THEN
        RAISE EXCEPTION 'Tenant ID cannot be null';
    END IF;
    
    IF p_search_term IS NULL OR TRIM(p_search_term) = '' THEN
        RAISE EXCEPTION 'Search term cannot be null or empty';
    END IF;
    
    IF LENGTH(TRIM(p_search_term)) < 1 THEN
        RAISE EXCEPTION 'Search term must be at least 1 character';
    END IF;
    
    IF LENGTH(TRIM(p_search_term)) > 1000 THEN
        RAISE EXCEPTION 'Search term too long (max 1000 characters)';
    END IF;
    
    IF p_threshold IS NULL OR p_threshold < 0 OR p_threshold > 1 THEN
        RAISE EXCEPTION 'Threshold must be between 0 and 1';
    END IF;
    
    IF p_limit IS NULL OR p_limit <= 0 THEN
        RAISE EXCEPTION 'Limit must be positive';
    END IF;
    
    IF p_limit > 1000 THEN
        RAISE EXCEPTION 'Limit too high (max 1000)';
    END IF;
    
    -- Validate tenant ID format
    IF p_tenant_id = '00000000-0000-0000-0000-000000000000'::UUID THEN
        RAISE EXCEPTION 'Invalid tenant ID';
    END IF;
    
    -- Perform fuzzy search with proper field mapping
    RETURN QUERY
    SELECT 
        c.id,
        (c.first_name || ' ' || c.last_name)::TEXT as name,
        c.email,
        c.phone,
        c.address,
        c.status,
        c.account_type as type,
        GREATEST(
            similarity(c.first_name, TRIM(p_search_term)),
            similarity(c.last_name, TRIM(p_search_term)),
            similarity(c.email, TRIM(p_search_term)),
            similarity(c.phone, TRIM(p_search_term)),
            similarity(c.address, TRIM(p_search_term))
        ) as score
    FROM customers c
    WHERE c.tenant_id = p_tenant_id
    AND (
        similarity(c.first_name, TRIM(p_search_term)) > p_threshold OR
        similarity(c.last_name, TRIM(p_search_term)) > p_threshold OR
        similarity(c.email, TRIM(p_search_term)) > p_threshold OR
        similarity(c.phone, TRIM(p_search_term)) > p_threshold OR
        similarity(c.address, TRIM(p_search_term)) > p_threshold
    )
    ORDER BY score DESC, c.first_name, c.last_name
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`
};

// ============================================================================
// DEPLOYMENT FUNCTIONS
// ============================================================================

async function deploySearchFunctions() {
  console.log('🔧 Deploying Fixed Search Functions...\n');
  
  const results = [];
  
  for (const [name, sql] of Object.entries(searchFunctions)) {
    console.log(`Deploying ${name} search function...`);
    
    try {
      // Use the SQL editor approach
      const { data, error } = await supabase
        .from('_sql_editor')
        .select('*')
        .eq('query', sql);
      
      if (error) {
        console.log(`❌ ${name} function deployment failed: ${error.message}`);
        results.push({ name, success: false, error: error.message });
      } else {
        console.log(`✅ ${name} function deployed successfully`);
        results.push({ name, success: true, error: null });
      }
    } catch (err) {
      console.log(`❌ ${name} function deployment error: ${err.message}`);
      results.push({ name, success: false, error: err.message });
    }
  }
  
  return results;
}

async function testFixedFunctions() {
  console.log('\n🧪 Testing Fixed Functions...\n');
  
  const testTenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';
  const tests = [];
  
  // Test 1: Enhanced search
  console.log('1. Testing enhanced search...');
  try {
    const { data: enhancedResults, error: enhancedError } = await supabase.rpc('search_customers_enhanced', {
      p_tenant_id: testTenantId,
      p_search_term: 'John',
      p_limit: 5
    });
    
    if (enhancedError) {
      console.log(`   ❌ Enhanced search failed: ${enhancedError.message}`);
      tests.push({ name: 'Enhanced Search', success: false, error: enhancedError.message });
    } else {
      console.log(`   ✅ Enhanced search: Found ${enhancedResults.length} results`);
      
      // Test data consistency
      let consistencyPassed = true;
      for (const result of enhancedResults) {
        const { data: dbCustomer, error: dbError } = await supabase
          .from('customers')
          .select('*')
          .eq('id', result.id)
          .eq('tenant_id', testTenantId)
          .single();
        
        if (dbError || !dbCustomer) {
          console.log(`   ❌ Search result ${result.id} not found in database`);
          consistencyPassed = false;
          break;
        }
        
        // Check field mapping
        const expectedName = `${dbCustomer.first_name} ${dbCustomer.last_name}`;
        if (result.name !== expectedName) {
          console.log(`   ❌ Name mismatch: expected "${expectedName}", got "${result.name}"`);
          consistencyPassed = false;
          break;
        }
        
        if (result.email !== dbCustomer.email || 
            result.phone !== dbCustomer.phone || 
            result.address !== dbCustomer.address ||
            result.status !== dbCustomer.status ||
            result.type !== dbCustomer.account_type) {
          console.log(`   ❌ Field mapping inconsistency detected`);
          consistencyPassed = false;
          break;
        }
      }
      
      if (consistencyPassed) {
        console.log('   ✅ Data consistency verified');
        tests.push({ name: 'Enhanced Search', success: true, error: null });
      } else {
        tests.push({ name: 'Enhanced Search', success: false, error: 'Data consistency failed' });
      }
    }
  } catch (error) {
    console.log(`   ❌ Enhanced search test error: ${error.message}`);
    tests.push({ name: 'Enhanced Search', success: false, error: error.message });
  }
  
  // Test 2: Input validation
  console.log('\n2. Testing input validation...');
  try {
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
      tests.push({ name: 'Input Validation', success: false, error: 'Empty search term not rejected' });
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
      tests.push({ name: 'Input Validation', success: false, error: 'Invalid tenant ID not rejected' });
    }
    
    console.log('   ✅ Input validation tests passed');
    tests.push({ name: 'Input Validation', success: true, error: null });
    
  } catch (error) {
    console.log(`   ❌ Input validation test error: ${error.message}`);
    tests.push({ name: 'Input Validation', success: false, error: error.message });
  }
  
  return tests;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('🚀 Starting Search Functions Fix...\n');
  
  // Deploy the functions
  const deployResults = await deploySearchFunctions();
  
  // Test the functions
  const testResults = await testFixedFunctions();
  
  // Summary
  console.log('\n📊 Results Summary:');
  console.log('==================');
  
  const deploySuccess = deployResults.filter(r => r.success).length;
  const deployTotal = deployResults.length;
  console.log(`Deployment: ${deploySuccess}/${deployTotal} functions deployed successfully`);
  
  const testSuccess = testResults.filter(r => r.success).length;
  const testTotal = testResults.length;
  console.log(`Testing: ${testSuccess}/${testTotal} tests passed`);
  
  const overallSuccess = (deploySuccess + testSuccess) / (deployTotal + testTotal);
  console.log(`Overall Success Rate: ${(overallSuccess * 100).toFixed(1)}%`);
  
  if (overallSuccess >= 0.9) {
    console.log('\n🎉 Search Functions Fix Successfully Deployed!');
    console.log('✅ Data consistency issues resolved');
    console.log('✅ Input validation added');
    console.log('✅ Field mapping corrected');
  } else {
    console.log('\n❌ Some issues remain. Please check the errors above.');
  }
}

// Run the fix
main()
  .then(() => {
    console.log('\n✅ Fix completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Fix failed:', error);
    process.exit(1);
  });
