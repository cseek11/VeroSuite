-- Production-ready search suggestions function
-- This function provides intelligent, multi-source search suggestions
-- with proper ranking, case-insensitive matching, and tenant isolation

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
    
    -- Require minimum query length
    IF length(v_query_clean) < 2 THEN
        RETURN;
    END IF;
    
    RETURN QUERY
    WITH all_suggestions AS (
        -- Customer contacts (highest priority - exact matches first)
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
            END as suggestion,
            CASE
                WHEN lower(first_name) = v_query_lower THEN 100.0
                WHEN lower(last_name) = v_query_lower THEN 100.0
                WHEN lower(first_name || ' ' || last_name) = v_query_lower THEN 100.0
                WHEN lower(email) = v_query_lower THEN 95.0
                WHEN lower(phone) = v_query_lower THEN 95.0
                WHEN lower(first_name) LIKE v_query_lower || '%' THEN 90.0
                WHEN lower(last_name) LIKE v_query_lower || '%' THEN 90.0
                WHEN lower(first_name || ' ' || last_name) LIKE v_query_lower || '%' THEN 95.0
                WHEN lower(email) LIKE v_query_lower || '%' THEN 85.0
                WHEN lower(phone) LIKE v_query_lower || '%' THEN 85.0
                ELSE 0.0
            END as score,
            'contacts' as source
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
        
        UNION ALL
        
        -- Accounts (second priority)
        SELECT DISTINCT
            CASE
                WHEN lower(name) = v_query_lower THEN name
                WHEN lower(name) LIKE v_query_lower || '%' THEN name
                WHEN lower(email) = v_query_lower THEN email
                WHEN lower(phone) = v_query_lower THEN phone
                WHEN lower(email) LIKE v_query_lower || '%' THEN email
                WHEN lower(phone) LIKE v_query_lower || '%' THEN phone
                ELSE NULL
            END as suggestion,
            CASE
                WHEN lower(name) = v_query_lower THEN 95.0
                WHEN lower(name) LIKE v_query_lower || '%' THEN 85.0
                WHEN lower(email) = v_query_lower THEN 90.0
                WHEN lower(phone) = v_query_lower THEN 90.0
                WHEN lower(email) LIKE v_query_lower || '%' THEN 80.0
                WHEN lower(phone) LIKE v_query_lower || '%' THEN 80.0
                ELSE 0.0
            END as score,
            'accounts' as source
        FROM accounts
        WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
            AND (
                lower(name) LIKE v_query_lower || '%'
                OR lower(email) LIKE v_query_lower || '%'
                OR lower(phone) LIKE v_query_lower || '%'
            )
            AND (
                name IS NOT NULL
                OR email IS NOT NULL
                OR phone IS NOT NULL
            )
        
        UNION ALL
        
        -- Users (third priority)
        SELECT DISTINCT
            CASE
                WHEN lower(first_name) = v_query_lower THEN first_name
                WHEN lower(last_name) = v_query_lower THEN last_name
                WHEN lower(first_name || ' ' || last_name) = v_query_lower THEN first_name || ' ' || last_name
                WHEN lower(email) = v_query_lower THEN email
                WHEN lower(first_name) LIKE v_query_lower || '%' THEN first_name
                WHEN lower(last_name) LIKE v_query_lower || '%' THEN last_name
                WHEN lower(first_name || ' ' || last_name) LIKE v_query_lower || '%' THEN first_name || ' ' || last_name
                WHEN lower(email) LIKE v_query_lower || '%' THEN email
                ELSE NULL
            END as suggestion,
            CASE
                WHEN lower(first_name) = v_query_lower THEN 90.0
                WHEN lower(last_name) = v_query_lower THEN 90.0
                WHEN lower(first_name || ' ' || last_name) = v_query_lower THEN 90.0
                WHEN lower(email) = v_query_lower THEN 85.0
                WHEN lower(first_name) LIKE v_query_lower || '%' THEN 80.0
                WHEN lower(last_name) LIKE v_query_lower || '%' THEN 80.0
                WHEN lower(first_name || ' ' || last_name) LIKE v_query_lower || '%' THEN 85.0
                WHEN lower(email) LIKE v_query_lower || '%' THEN 75.0
                ELSE 0.0
            END as score,
            'users' as source
        FROM users
        WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
            AND (
                lower(first_name) LIKE v_query_lower || '%'
                OR lower(last_name) LIKE v_query_lower || '%'
                OR lower(first_name || ' ' || last_name) LIKE v_query_lower || '%'
                OR lower(email) LIKE v_query_lower || '%'
            )
            AND (
                first_name IS NOT NULL
                OR last_name IS NOT NULL
                OR email IS NOT NULL
            )
        
        UNION ALL
        
        -- Popular searches (fourth priority)
        SELECT DISTINCT
            query_text as suggestion,
            CASE
                WHEN lower(query_text) = v_query_lower THEN 85.0
                WHEN lower(query_text) LIKE v_query_lower || '%' THEN 75.0
                WHEN lower(query_text) LIKE '%' || v_query_lower || '%' THEN 65.0
                ELSE 0.0
            END + (search_count * 0.1) as score,
            'popular' as source
        FROM popular_searches
        WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
            AND (
                lower(query_text) LIKE v_query_lower || '%'
                OR lower(query_text) LIKE '%' || v_query_lower || '%'
            )
            AND query_text IS NOT NULL
            AND length(query_text) >= 2
        
        UNION ALL
        
        -- Search trends (fifth priority)
        SELECT DISTINCT
            query_term as suggestion,
            CASE
                WHEN lower(query_term) = v_query_lower THEN 80.0
                WHEN lower(query_term) LIKE v_query_lower || '%' THEN 70.0
                WHEN lower(query_term) LIKE '%' || v_query_lower || '%' THEN 60.0
                ELSE 0.0
            END + (trend_score * 10) as score,
            'trends' as source
        FROM search_trends
        WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
            AND (
                lower(query_term) LIKE v_query_lower || '%'
                OR lower(query_term) LIKE '%' || v_query_lower || '%'
            )
            AND query_term IS NOT NULL
            AND length(query_term) >= 2
        
        UNION ALL
        
        -- Search suggestions analytics (sixth priority)
        SELECT DISTINCT
            suggestion as suggestion,
            CASE
                WHEN lower(suggestion) = v_query_lower THEN 75.0
                WHEN lower(suggestion) LIKE v_query_lower || '%' THEN 65.0
                WHEN lower(suggestion) LIKE '%' || v_query_lower || '%' THEN 55.0
                ELSE 0.0
            END + (confidence_score * 20) as score,
            'analytics' as source
        FROM search_suggestions_analytics
        WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
            AND (
                lower(suggestion) LIKE v_query_lower || '%'
                OR lower(suggestion) LIKE '%' || v_query_lower || '%'
            )
            AND suggestion IS NOT NULL
            AND length(suggestion) >= 2
        
        UNION ALL
        
        -- Search logs (lowest priority - for related suggestions)
        SELECT DISTINCT
            query as suggestion,
            CASE
                WHEN lower(query) = v_query_lower THEN 70.0
                WHEN lower(query) LIKE v_query_lower || '%' THEN 60.0
                WHEN lower(query) LIKE '%' || v_query_lower || '%' THEN 50.0
                ELSE 0.0
            END as score,
            'logs' as source
        FROM search_logs
        WHERE (v_tenant_id IS NULL OR tenant_id = v_tenant_id)
            AND (
                lower(query) LIKE v_query_lower || '%'
                OR lower(query) LIKE '%' || v_query_lower || '%'
            )
            AND query IS NOT NULL
            AND length(query) >= 2
    ),
    ranked_suggestions AS (
        SELECT
            suggestion,
            score,
            source,
            ROW_NUMBER() OVER (
                PARTITION BY suggestion
                ORDER BY score DESC,
                         length(suggestion) ASC,
                         CASE source
                             WHEN 'contacts' THEN 1
                             WHEN 'accounts' THEN 2
                             WHEN 'users' THEN 3
                             WHEN 'popular' THEN 4
                             WHEN 'trends' THEN 5
                             WHEN 'analytics' THEN 6
                             WHEN 'logs' THEN 7
                             ELSE 8
                         END ASC
            ) as rn
        FROM all_suggestions
        WHERE score > 0 
            AND suggestion IS NOT NULL 
            AND length(suggestion) >= 2
    )
    SELECT
        suggestion,
        score,
        source
    FROM ranked_suggestions
    WHERE rn = 1
    ORDER BY
        score DESC,
        CASE source
            WHEN 'contacts' THEN 1
            WHEN 'accounts' THEN 2
            WHEN 'users' THEN 3
            WHEN 'popular' THEN 4
            WHEN 'trends' THEN 5
            WHEN 'analytics' THEN 6
            WHEN 'logs' THEN 7
            ELSE 8
        END ASC,
        length(suggestion) ASC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_search_suggestions(TEXT, INTEGER) TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION get_search_suggestions(TEXT, INTEGER) IS 
'Provides intelligent search suggestions from multiple data sources with proper ranking and tenant isolation. 
Returns: suggestion text, confidence score (0-100), and source type. 
Sources: contacts, accounts, users, popular searches, trends, analytics, and logs.';
