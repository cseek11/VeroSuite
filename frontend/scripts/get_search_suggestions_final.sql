-- Final version of get_search_suggestions using your actual database tables
-- This will provide intelligent suggestions from customer data and search history

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
        -- Customer contacts (exact matches and prefix matches)
        SELECT DISTINCT
            CASE 
                WHEN lower(first_name) LIKE v_query_lower || '%' THEN first_name
                WHEN lower(last_name) LIKE v_query_lower || '%' THEN last_name
                WHEN lower(first_name || ' ' || last_name) LIKE v_query_lower || '%' THEN first_name || ' ' || last_name
                WHEN lower(email) LIKE v_query_lower || '%' THEN email
                WHEN lower(phone) LIKE v_query_lower || '%' THEN phone
                ELSE NULL
            END as suggestion,
            CASE 
                WHEN lower(first_name) = v_query_lower THEN 95.0  -- Exact first name
                WHEN lower(last_name) = v_query_lower THEN 95.0   -- Exact last name
                WHEN lower(first_name || ' ' || last_name) = v_query_lower THEN 100.0  -- Exact full name
                WHEN lower(email) = v_query_lower THEN 90.0  -- Exact email
                WHEN lower(phone) = v_query_lower THEN 90.0  -- Exact phone
                WHEN lower(first_name) LIKE v_query_lower || '%' THEN 90.0  -- Prefix first name
                WHEN lower(last_name) LIKE v_query_lower || '%' THEN 90.0   -- Prefix last name
                WHEN lower(first_name || ' ' || last_name) LIKE v_query_lower || '%' THEN 95.0  -- Prefix full name
                WHEN lower(email) LIKE v_query_lower || '%' THEN 85.0  -- Prefix email
                WHEN lower(phone) LIKE v_query_lower || '%' THEN 85.0  -- Prefix phone
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
        
        -- Accounts (business names, emails, phones)
        SELECT DISTINCT
            CASE 
                WHEN lower(name) LIKE v_query_lower || '%' THEN name
                WHEN lower(email) LIKE v_query_lower || '%' THEN email
                WHEN lower(phone) LIKE v_query_lower || '%' THEN phone
                ELSE NULL
            END as suggestion,
            CASE 
                WHEN lower(name) = v_query_lower THEN 95.0  -- Exact business name
                WHEN lower(email) = v_query_lower THEN 90.0  -- Exact email
                WHEN lower(phone) = v_query_lower THEN 90.0  -- Exact phone
                WHEN lower(name) LIKE v_query_lower || '%' THEN 90.0  -- Prefix business name
                WHEN lower(email) LIKE v_query_lower || '%' THEN 85.0  -- Prefix email
                WHEN lower(phone) LIKE v_query_lower || '%' THEN 85.0  -- Prefix phone
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
        
        -- Users (staff members)
        SELECT DISTINCT
            CASE 
                WHEN lower(first_name) LIKE v_query_lower || '%' THEN first_name
                WHEN lower(last_name) LIKE v_query_lower || '%' THEN last_name
                WHEN lower(first_name || ' ' || last_name) LIKE v_query_lower || '%' THEN first_name || ' ' || last_name
                WHEN lower(email) LIKE v_query_lower || '%' THEN email
                WHEN lower(phone) LIKE v_query_lower || '%' THEN phone
                ELSE NULL
            END as suggestion,
            CASE 
                WHEN lower(first_name) = v_query_lower THEN 88.0  -- Exact first name
                WHEN lower(last_name) = v_query_lower THEN 88.0   -- Exact last name
                WHEN lower(first_name || ' ' || last_name) = v_query_lower THEN 93.0  -- Exact full name
                WHEN lower(email) = v_query_lower THEN 83.0  -- Exact email
                WHEN lower(phone) = v_query_lower THEN 83.0  -- Exact phone
                WHEN lower(first_name) LIKE v_query_lower || '%' THEN 83.0  -- Prefix first name
                WHEN lower(last_name) LIKE v_query_lower || '%' THEN 83.0   -- Prefix last name
                WHEN lower(first_name || ' ' || last_name) LIKE v_query_lower || '%' THEN 88.0  -- Prefix full name
                WHEN lower(email) LIKE v_query_lower || '%' THEN 78.0  -- Prefix email
                WHEN lower(phone) LIKE v_query_lower || '%' THEN 78.0  -- Prefix phone
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
                OR lower(phone) LIKE v_query_lower || '%'
            )
            AND (
                first_name IS NOT NULL 
                OR last_name IS NOT NULL 
                OR email IS NOT NULL 
                OR phone IS NOT NULL
            )
        
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
        
        -- Search logs (if table exists and has data)
        SELECT DISTINCT
            query as suggestion,
            CASE 
                WHEN lower(query) = v_query_lower THEN 85.0  -- Exact match
                WHEN lower(query) LIKE v_query_lower || '%' THEN 80.0  -- Prefix match
                WHEN similarity(lower(query), v_query_lower) > 0.6 THEN 75.0  -- High similarity
                WHEN similarity(lower(query), v_query_lower) > 0.4 THEN 65.0  -- Medium similarity
                ELSE 55.0  -- Lower similarity
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
    ),
    ranked_suggestions AS (
        SELECT 
            suggestion,
            score,
            source,
            -- Add tie-breakers: length, uniqueness, source priority
            ROW_NUMBER() OVER (
                PARTITION BY suggestion 
                ORDER BY score DESC, 
                         length(suggestion) ASC,  -- Prefer shorter matches
                         CASE source 
                             WHEN 'contacts' THEN 1  -- Customer contacts first
                             WHEN 'accounts' THEN 2  -- Business accounts second
                             WHEN 'users' THEN 3     -- Staff users third
                             WHEN 'popular' THEN 4   -- Popular searches fourth
                             WHEN 'logs' THEN 5      -- Search logs last
                             ELSE 6
                         END ASC
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
        CASE source 
            WHEN 'contacts' THEN 1  -- Customer contacts first
            WHEN 'accounts' THEN 2  -- Business accounts second
            WHEN 'users' THEN 3     -- Staff users third
            WHEN 'popular' THEN 4   -- Popular searches fourth
            WHEN 'logs' THEN 5      -- Search logs last
            ELSE 6
        END ASC,
        length(suggestion) ASC  -- Shorter suggestions first
    LIMIT p_limit;
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;














