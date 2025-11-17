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
    -- Get current tenant ID safely
    BEGIN
        v_tenant_id := current_setting('app.current_tenant_id')::UUID;
    EXCEPTION WHEN OTHERS THEN
        v_tenant_id := NULL;
    END;
    
    -- Clean and normalize the input query
    v_query := trim(p_query);
    v_query_lower := lower(v_query);
    v_query_clean := regexp_replace(v_query_lower, '[^a-z0-9\s]', '', 'g');
    
    -- Require minimum query length
    IF length(v_query_clean) < 2 THEN
        RETURN;
    END IF;
    
    RETURN QUERY
    WITH all_suggestions AS (
        -- Customer names (exact matches and prefix matches only)
        SELECT DISTINCT
            CASE 
                WHEN lower(first_name) LIKE v_query_lower || '%' THEN first_name
                WHEN lower(last_name) LIKE v_query_lower || '%' THEN last_name
                WHEN lower(first_name || ' ' || last_name) LIKE v_query_lower || '%' THEN first_name || ' ' || last_name
                ELSE NULL
            END as suggestion,
            CASE 
                WHEN lower(first_name) = v_query_lower THEN 90.0  -- Exact first name
                WHEN lower(last_name) = v_query_lower THEN 90.0   -- Exact last name
                WHEN lower(first_name || ' ' || last_name) = v_query_lower THEN 95.0  -- Exact full name
                WHEN lower(first_name) LIKE v_query_lower || '%' THEN 85.0  -- Prefix first name
                WHEN lower(last_name) LIKE v_query_lower || '%' THEN 85.0   -- Prefix last name
                WHEN lower(first_name || ' ' || last_name) LIKE v_query_lower || '%' THEN 90.0  -- Prefix full name
                ELSE 0.0
            END as score,
            'customers' as source
        FROM customers 
        WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
            AND (
                lower(first_name) LIKE v_query_lower || '%'
                OR lower(last_name) LIKE v_query_lower || '%'
                OR lower(first_name || ' ' || last_name) LIKE v_query_lower || '%'
            )
            AND first_name IS NOT NULL 
            AND last_name IS NOT NULL
        
        UNION ALL
        
        -- Search logs (if table exists and has data)
        SELECT DISTINCT
            query as suggestion,
            CASE 
                WHEN lower(query) = v_query_lower THEN 85.0  -- Exact match
                WHEN lower(query) LIKE v_query_lower || '%' THEN 80.0  -- Prefix match
                WHEN similarity(lower(query), v_query_lower) > 0.5 THEN 75.0  -- High similarity
                ELSE 70.0  -- Lower similarity
            END as score,
            'logs' as source
        FROM search_logs 
        WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
            AND success = true 
            AND (lower(query) LIKE v_query_lower || '%'
                OR lower(query) = v_query_lower
                OR similarity(lower(query), v_query_lower) > 0.5)
            AND query != v_query  -- Don't suggest the exact same query
            AND query IS NOT NULL
            AND length(query) >= 2
        
        UNION ALL
        
        -- Popular searches (if table exists)
        SELECT 
            query as suggestion,
            CASE 
                WHEN lower(query) = v_query_lower THEN 100.0  -- Exact match
                WHEN lower(query) LIKE v_query_lower || '%' THEN 95.0  -- Prefix match
                ELSE 90.0  -- Other popular searches
            END as score,
            'popular' as source
        FROM popular_searches 
        WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
            AND (lower(query) LIKE v_query_lower || '%'
                OR lower(query) = v_query_lower
                OR similarity(lower(query), v_query_lower) > 0.4)
            AND query IS NOT NULL
            AND length(query) >= 2
    ),
    ranked_suggestions AS (
        SELECT 
            suggestion,
            score,
            source,
            -- Add tie-breakers: length, recency, uniqueness
            ROW_NUMBER() OVER (
                PARTITION BY suggestion 
                ORDER BY score DESC, 
                         length(suggestion) ASC,  -- Prefer shorter matches
                         source = 'customers' DESC,  -- Prefer customer names
                         source = 'popular' DESC    -- Then popular searches
            ) as rn
        FROM all_suggestions
        WHERE score > 0  -- Only include valid suggestions
            AND suggestion IS NOT NULL
            AND length(suggestion) >= 2
    )
    SELECT 
        suggestion,
        score,
        source
    FROM ranked_suggestions 
    WHERE rn = 1  -- Remove duplicates, keep best score
    ORDER BY 
        score DESC,
        length(suggestion) ASC,  -- Shorter suggestions first
        source = 'customers' DESC,  -- Customer names first
        source = 'popular' DESC     -- Then popular searches
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
