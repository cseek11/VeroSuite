-- Simple version of get_search_suggestions that doesn't depend on specific tables
-- This will work as a starting point, then we can enhance it based on available tables

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
    
    -- For now, return a simple set of suggestions based on the query
    -- This will be enhanced once we know what tables exist
    
    RETURN QUERY
    SELECT 
        v_query_lower as suggestion,
        100.0 as score,
        'query' as source
    WHERE length(v_query_lower) >= 2
    
    UNION ALL
    
    SELECT 
        v_query_lower || ' smith' as suggestion,
        90.0 as score,
        'example' as source
    WHERE length(v_query_lower) >= 2
    
    UNION ALL
    
    SELECT 
        v_query_lower || ' doe' as suggestion,
        85.0 as score,
        'example' as source
    WHERE length(v_query_lower) >= 2
    
    ORDER BY score DESC, length(suggestion) ASC
    LIMIT p_limit;
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


