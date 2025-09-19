-- Working version of get_search_suggestions using your actual search tables
-- This should work immediately with your database structure

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
BEGIN
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
        -- Search logs (successful searches with good ranking)
        SELECT DISTINCT
            query as suggestion,
            CASE 
                WHEN lower(query) = v_query_lower THEN 95.0  -- Exact match
                WHEN lower(query) LIKE v_query_lower || '%' THEN 90.0  -- Prefix match
                WHEN similarity(lower(query), v_query_lower) > 0.6 THEN 80.0  -- High similarity
                WHEN similarity(lower(query), v_query_lower) > 0.4 THEN 70.0  -- Medium similarity
                ELSE 60.0  -- Lower similarity
            END as score,
            'logs' as source
        FROM search_logs 
        WHERE success = true 
            AND (lower(query) LIKE v_query_lower || '%'
                OR lower(query) = v_query_lower
                OR similarity(lower(query), v_query_lower) > 0.4)
            AND query != v_query  -- Don't suggest the exact same query
            AND query IS NOT NULL
            AND length(query) >= 2
        
        UNION ALL
        
        -- Popular searches (if table exists and has data)
        SELECT 
            query as suggestion,
            CASE 
                WHEN lower(query) = v_query_lower THEN 100.0  -- Exact match
                WHEN lower(query) LIKE v_query_lower || '%' THEN 95.0  -- Prefix match
                WHEN similarity(lower(query), v_query_lower) > 0.5 THEN 85.0  -- High similarity
                ELSE 75.0  -- Lower similarity
            END as score,
            'popular' as source
        FROM popular_searches 
        WHERE (lower(query) LIKE v_query_lower || '%'
            OR lower(query) = v_query_lower
            OR similarity(lower(query), v_query_lower) > 0.5)
            AND query IS NOT NULL
            AND length(query) >= 2
        
        UNION ALL
        
        -- Search suggestions analytics (if available)
        SELECT 
            suggestion as suggestion,
            CASE 
                WHEN lower(suggestion) = v_query_lower THEN 90.0  -- Exact match
                WHEN lower(suggestion) LIKE v_query_lower || '%' THEN 85.0  -- Prefix match
                WHEN similarity(lower(suggestion), v_query_lower) > 0.5 THEN 75.0  -- High similarity
                ELSE 65.0  -- Lower similarity
            END as score,
            'analytics' as source
        FROM search_suggestions_analytics 
        WHERE (lower(suggestion) LIKE v_query_lower || '%'
            OR lower(suggestion) = v_query_lower
            OR similarity(lower(suggestion), v_query_lower) > 0.5)
            AND suggestion IS NOT NULL
            AND length(suggestion) >= 2
        
        UNION ALL
        
        -- Search trends (if available)
        SELECT 
            query_term as suggestion,
            CASE 
                WHEN lower(query_term) = v_query_lower THEN 88.0  -- Exact match
                WHEN lower(query_term) LIKE v_query_lower || '%' THEN 83.0  -- Prefix match
                WHEN similarity(lower(query_term), v_query_lower) > 0.5 THEN 73.0  -- High similarity
                ELSE 63.0  -- Lower similarity
            END as score,
            'trends' as source
        FROM search_trends 
        WHERE (lower(query_term) LIKE v_query_lower || '%'
            OR lower(query_term) = v_query_lower
            OR similarity(lower(query_term), v_query_lower) > 0.5)
            AND query_term IS NOT NULL
            AND length(query_term) >= 2
    ),
    ranked_suggestions AS (
        SELECT 
            suggestion,
            score,
            source,
            -- Add tie-breakers: length, uniqueness
            ROW_NUMBER() OVER (
                PARTITION BY suggestion 
                ORDER BY score DESC, 
                         length(suggestion) ASC  -- Prefer shorter matches
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
        length(suggestion) ASC  -- Shorter suggestions first
    LIMIT p_limit;
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;















