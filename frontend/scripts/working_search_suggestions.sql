-- Working search suggestions function that uses your existing data
-- This function will work immediately with your 95 popular searches and 439 search logs

CREATE OR REPLACE FUNCTION get_search_suggestions(
    p_query TEXT,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    suggestion TEXT,
    score NUMERIC,
    source TEXT
) AS $$
DECLARE
    v_query TEXT;
    v_query_lower TEXT;
    v_query_clean TEXT;
    v_tenant_id UUID;
BEGIN
    -- Safely get tenant_id from context
    BEGIN
        v_tenant_id := current_setting('app.current_tenant_id')::UUID;
    EXCEPTION WHEN OTHERS THEN
        v_tenant_id := NULL;
    END;
    
    -- Normalize the query
    v_query := trim(p_query);
    v_query_lower := lower(v_query);
    v_query_clean := regexp_replace(v_query_lower, '[^a-z0-9\s]', '', 'g');
    
    -- Require minimum query length (filter out single characters like "j")
    IF length(v_query_clean) < 2 THEN
        RETURN;
    END IF;
    
    RETURN QUERY
    WITH all_suggestions AS (
                -- Popular searches (highest priority - using your existing data)
        SELECT DISTINCT
            query_text as suggestion_text,
            CASE
                WHEN lower(query_text) = v_query_lower THEN 100.0
                WHEN lower(query_text) LIKE v_query_lower || '%' THEN 90.0
                WHEN lower(query_text) LIKE '%' || v_query_lower || '%' THEN 80.0
                ELSE 0.0
            END + (search_count * 0.5) as suggestion_score,
            'popular' as suggestion_source
        FROM popular_searches
        WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
            AND (
                lower(query_text) LIKE v_query_lower || '%'
                OR lower(query_text) LIKE '%' || v_query_lower || '%'
            )
            AND query_text IS NOT NULL
            AND length(query_text) >= 2
            AND search_count > 0
        
        UNION ALL
        
        -- Search logs (second priority - using your existing data)
        SELECT DISTINCT
            COALESCE(query_text, query) as suggestion_text,
            CASE
                WHEN lower(COALESCE(query_text, query)) = v_query_lower THEN 85.0
                WHEN lower(COALESCE(query_text, query)) LIKE v_query_lower || '%' THEN 75.0
                WHEN lower(COALESCE(query_text, query)) LIKE '%' || v_query_lower || '%' THEN 65.0
                ELSE 0.0
            END as suggestion_score,
            'logs' as suggestion_source
        FROM search_logs
        WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
            AND (
                lower(COALESCE(query_text, query)) LIKE v_query_lower || '%'
                OR lower(COALESCE(query_text, query)) LIKE '%' || v_query_lower || '%'
            )
            AND COALESCE(query_text, query) IS NOT NULL
            AND length(COALESCE(query_text, query)) >= 2
            AND search_successful = true
        
        UNION ALL
        
        -- Customer contacts (third priority - if table exists)
        SELECT DISTINCT
            CASE
                WHEN lower(first_name) = v_query_lower THEN first_name
                WHEN lower(last_name) = v_query_lower THEN last_name
                WHEN lower(first_name || ' ' || last_name) = v_query_lower THEN first_name || ' ' || last_name
                WHEN lower(email) = v_query_lower THEN email
                WHEN lower(phone) = v_query_lower THEN phone
                WHEN lower(first_name) LIKE v_query_lower || '%' THEN first_name
                WHEN lower(last_name) LIKE v_query_lower || '%' THEN last_name
                WHEN lower(first_name || ' ' || last_name) LIKE v_query_lower || '%' THEN first_name || ' ' || last_name
                WHEN lower(email) LIKE v_query_lower || '%' THEN email
                WHEN lower(phone) LIKE v_query_lower || '%' THEN phone
                ELSE NULL
            END as suggestion_text,
            CASE
                WHEN lower(first_name) = v_query_lower THEN 95.0
                WHEN lower(last_name) = v_query_lower THEN 95.0
                WHEN lower(first_name || ' ' || last_name) = v_query_lower THEN 100.0
                WHEN lower(email) = v_query_lower THEN 90.0
                WHEN lower(phone) = v_query_lower THEN 90.0
                WHEN lower(first_name) LIKE v_query_lower || '%' THEN 85.0
                WHEN lower(last_name) LIKE v_query_lower || '%' THEN 85.0
                WHEN lower(first_name || ' ' || last_name) LIKE v_query_lower || '%' THEN 90.0
                WHEN lower(email) LIKE v_query_lower || '%' THEN 80.0
                WHEN lower(phone) LIKE v_query_lower || '%' THEN 80.0
                ELSE 0.0
                END as suggestion_score,
            'contacts' as suggestion_source
        FROM customer_contacts
        WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
            AND (
                lower(first_name) LIKE v_query_lower || '%'
                OR lower(last_name) LIKE v_query_lower || '%'
                OR lower(first_name || ' ' || last_name) LIKE v_query_lower || '%'
                OR lower(email) LIKE v_query_lower || '%'
                OR lower(phone) LIKE v_query_lower || '%'
            )
            AND (
                first_name IS NOT NULL
                OR last_name IS NOT NULL
                OR email IS NOT NULL
                OR phone IS NOT NULL
            )
    ),
    ranked_suggestions AS (
        SELECT
            suggestion_text,
            suggestion_score,
            suggestion_source,
            ROW_NUMBER() OVER (
                PARTITION BY suggestion_text
                ORDER BY suggestion_score DESC,
                         length(suggestion_text) ASC,
                         CASE suggestion_source
                             WHEN 'contacts' THEN 1
                             WHEN 'popular' THEN 2
                             WHEN 'logs' THEN 3
                             ELSE 4
                         END ASC
            ) as rn
        FROM all_suggestions
        WHERE suggestion_score > 0 
            AND suggestion_text IS NOT NULL 
            AND length(suggestion_text) >= 2
    )
    SELECT
        suggestion_text as suggestion,
        suggestion_score as score,
        suggestion_source as source
    FROM ranked_suggestions
    WHERE rn = 1
    ORDER BY
        suggestion_score DESC,
        CASE suggestion_source
            WHEN 'contacts' THEN 1
            WHEN 'popular' THEN 2
            WHEN 'logs' THEN 3
            ELSE 4
        END ASC,
        length(suggestion_text) ASC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_search_suggestions(TEXT, INTEGER) TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION get_search_suggestions(TEXT, INTEGER) IS 
'Provides intelligent search suggestions using your existing popular_searches and search_logs data. 
Returns: suggestion text, confidence score (0-100), and source type. 
Sources: contacts, popular searches, and search logs.';

-- Test the function with your existing data
SELECT '=== TESTING THE FUNCTION ===' as info;
SELECT 'Testing "john" suggestions:' as test_case;
SELECT * FROM get_search_suggestions('john', 5);

SELECT 'Testing "pest" suggestions:' as test_case;
SELECT * FROM get_search_suggestions('pest', 5);

SELECT 'Testing "control" suggestions:' as test_case;
SELECT * FROM get_search_suggestions('control', 5);
