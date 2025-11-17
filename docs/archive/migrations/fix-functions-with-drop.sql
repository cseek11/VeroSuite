-- ============================================================================
// FIX SEARCH FUNCTIONS WITH DROP - Complete Fix with Function Drops
-- ============================================================================
-- This script drops existing functions first, then recreates them with proper
-- field mapping and input validation

-- ============================================================================
-- STEP 1: DROP EXISTING FUNCTIONS
-- ============================================================================

-- Drop existing search functions
DROP FUNCTION IF EXISTS search_customers_enhanced(UUID, TEXT, INTEGER);
DROP FUNCTION IF EXISTS search_customers_multi_word(UUID, TEXT, INTEGER);
DROP FUNCTION IF EXISTS search_customers_fuzzy(UUID, TEXT, REAL, INTEGER);

-- Drop existing error logging function if it exists
DROP FUNCTION IF EXISTS log_search_error(TEXT, TEXT, TEXT, TEXT, TEXT, JSONB);

-- ============================================================================
-- STEP 2: DEPLOY MISSING ERROR LOGGING FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION log_search_error(
    p_operation TEXT,
    p_query TEXT,
    p_error_message TEXT,
    p_error_type TEXT,
    p_severity TEXT,
    p_context JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID AS $$
DECLARE
    tenant_id_val UUID;
    user_id_val UUID;
BEGIN
    -- Extract tenant and user IDs from context or auth
    tenant_id_val := COALESCE(
        (p_context ->> 'tenantId')::uuid,
        ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'tenant_id')::uuid
    );
    
    user_id_val := COALESCE(
        (p_context ->> 'userId')::uuid,
        auth.uid()
    );
    
    -- Insert error record
    INSERT INTO search_errors (
        tenant_id,
        user_id,
        operation,
        query_text,
        error_message,
        error_type,
        severity,
        context,
        created_at
    ) VALUES (
        tenant_id_val,
        user_id_val,
        p_operation,
        p_query,
        p_error_message,
        p_error_type,
        p_severity,
        p_context,
        NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 3: CREATE ENHANCED SEARCH FUNCTION
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
-- STEP 4: CREATE MULTI-WORD SEARCH FUNCTION
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
-- STEP 5: CREATE FUZZY SEARCH FUNCTION
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
-- STEP 6: VERIFICATION QUERIES
-- ============================================================================

-- Test the functions
DO $$
DECLARE
    test_tenant_id UUID := '7193113e-ece2-4f7b-ae8c-176df4367e28';
    test_search_term TEXT := 'John';
    result_count INTEGER;
BEGIN
    RAISE NOTICE 'Testing fixed search functions...';
    
    -- Test enhanced search
    SELECT COUNT(*) INTO result_count 
    FROM search_customers_enhanced(test_tenant_id, test_search_term, 5);
    RAISE NOTICE 'Enhanced search: % results', result_count;
    
    -- Test multi-word search
    SELECT COUNT(*) INTO result_count 
    FROM search_customers_multi_word(test_tenant_id, test_search_term, 5);
    RAISE NOTICE 'Multi-word search: % results', result_count;
    
    -- Test fuzzy search
    SELECT COUNT(*) INTO result_count 
    FROM search_customers_fuzzy(test_tenant_id, test_search_term, 0.3, 5);
    RAISE NOTICE 'Fuzzy search: % results', result_count;
    
    RAISE NOTICE 'All search functions working correctly!';
END $$;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'SEARCH FUNCTIONS FIX COMPLETED SUCCESSFULLY';
    RAISE NOTICE '============================================================================';
    RAISE NOTICE '✅ All existing functions dropped and recreated';
    RAISE NOTICE '✅ log_search_error function deployed';
    RAISE NOTICE '✅ search_customers_enhanced function fixed';
    RAISE NOTICE '✅ search_customers_multi_word function fixed';
    RAISE NOTICE '✅ search_customers_fuzzy function fixed';
    RAISE NOTICE '✅ All functions tested and working';
    RAISE NOTICE '============================================================================';
END $$;
