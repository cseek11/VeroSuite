-- ============================================================================
-- DATA CONSISTENCY FIX - Search Functions Field Mapping
-- ============================================================================
-- This script fixes the data consistency issues in search results by ensuring
-- proper field mapping between search functions and database schema

-- ============================================================================
-- STEP 1: Check Current Database Schema
-- ============================================================================

-- First, let's verify the current database schema
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'customers' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ============================================================================
-- STEP 2: Fix search_customers_enhanced Function
-- ============================================================================

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 3: Fix search_customers_multi_word Function
-- ============================================================================

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 4: Fix search_customers_fuzzy Function
-- ============================================================================

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 5: Test Data Consistency
-- ============================================================================

-- Test the fixed functions
DO $$
DECLARE
    test_tenant_id UUID := '7193113e-ece2-4f7b-ae8c-176df4367e28';
    test_search_term TEXT := 'John';
    search_result RECORD;
    db_customer RECORD;
    consistency_check BOOLEAN := TRUE;
BEGIN
    RAISE NOTICE 'Testing data consistency...';
    
    -- Test enhanced search
    FOR search_result IN 
        SELECT * FROM search_customers_enhanced(test_tenant_id, test_search_term, 5)
    LOOP
        -- Get corresponding database record
        SELECT * INTO db_customer 
        FROM customers 
        WHERE id = search_result.id AND tenant_id = test_tenant_id;
        
        -- Check consistency
        IF db_customer IS NULL THEN
            RAISE NOTICE 'ERROR: Search result % not found in database', search_result.id;
            consistency_check := FALSE;
        ELSE
            -- Check field mapping
            IF search_result.name != (db_customer.first_name || ' ' || db_customer.last_name) THEN
                RAISE NOTICE 'ERROR: Name mismatch for % - expected: %, got: %', 
                    search_result.id, 
                    (db_customer.first_name || ' ' || db_customer.last_name), 
                    search_result.name;
                consistency_check := FALSE;
            END IF;
            
            IF search_result.email != db_customer.email THEN
                RAISE NOTICE 'ERROR: Email mismatch for % - expected: %, got: %', 
                    search_result.id, db_customer.email, search_result.email;
                consistency_check := FALSE;
            END IF;
            
            IF search_result.phone != db_customer.phone THEN
                RAISE NOTICE 'ERROR: Phone mismatch for % - expected: %, got: %', 
                    search_result.id, db_customer.phone, search_result.phone;
                consistency_check := FALSE;
            END IF;
            
            IF search_result.address != db_customer.address THEN
                RAISE NOTICE 'ERROR: Address mismatch for % - expected: %, got: %', 
                    search_result.id, db_customer.address, search_result.address;
                consistency_check := FALSE;
            END IF;
            
            IF search_result.status != db_customer.status THEN
                RAISE NOTICE 'ERROR: Status mismatch for % - expected: %, got: %', 
                    search_result.id, db_customer.status, search_result.status;
                consistency_check := FALSE;
            END IF;
            
            IF search_result.type != db_customer.account_type THEN
                RAISE NOTICE 'ERROR: Type mismatch for % - expected: %, got: %', 
                    search_result.id, db_customer.account_type, search_result.type;
                consistency_check := FALSE;
            END IF;
        END IF;
    END LOOP;
    
    IF consistency_check THEN
        RAISE NOTICE 'SUCCESS: Data consistency check passed!';
    ELSE
        RAISE NOTICE 'FAILURE: Data consistency check failed!';
    END IF;
END $$;

-- ============================================================================
-- STEP 6: Test Input Validation
-- ============================================================================

-- Test invalid inputs
DO $$
DECLARE
    test_tenant_id UUID := '7193113e-ece2-4f7b-ae8c-176df4367e28';
    validation_passed BOOLEAN := TRUE;
BEGIN
    RAISE NOTICE 'Testing input validation...';
    
    -- Test empty search term
    BEGIN
        PERFORM * FROM search_customers_enhanced(test_tenant_id, '', 5);
        RAISE NOTICE 'ERROR: Empty search term should have been rejected';
        validation_passed := FALSE;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'SUCCESS: Empty search term properly rejected';
    END;
    
    -- Test null search term
    BEGIN
        PERFORM * FROM search_customers_enhanced(test_tenant_id, NULL, 5);
        RAISE NOTICE 'ERROR: Null search term should have been rejected';
        validation_passed := FALSE;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'SUCCESS: Null search term properly rejected';
    END;
    
    -- Test invalid tenant ID
    BEGIN
        PERFORM * FROM search_customers_enhanced('00000000-0000-0000-0000-000000000000', 'test', 5);
        RAISE NOTICE 'ERROR: Invalid tenant ID should have been rejected';
        validation_passed := FALSE;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'SUCCESS: Invalid tenant ID properly rejected';
    END;
    
    -- Test invalid limit
    BEGIN
        PERFORM * FROM search_customers_enhanced(test_tenant_id, 'test', 0);
        RAISE NOTICE 'ERROR: Invalid limit should have been rejected';
        validation_passed := FALSE;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'SUCCESS: Invalid limit properly rejected';
    END;
    
    IF validation_passed THEN
        RAISE NOTICE 'SUCCESS: Input validation check passed!';
    ELSE
        RAISE NOTICE 'FAILURE: Input validation check failed!';
    END IF;
END $$;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'DATA CONSISTENCY FIX COMPLETED';
    RAISE NOTICE '============================================================================';
    RAISE NOTICE '✅ All search functions updated with proper field mapping';
    RAISE NOTICE '✅ Input validation added to all functions';
    RAISE NOTICE '✅ Data consistency tests completed';
    RAISE NOTICE '✅ Input validation tests completed';
    RAISE NOTICE '============================================================================';
END $$;
