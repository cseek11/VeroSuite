-- Fix the update_popular_searches function to use the correct conflict resolution
-- Run this in your Supabase SQL Editor

-- Drop the existing function
DROP FUNCTION IF EXISTS update_popular_searches(
    p_tenant_id UUID,
    p_query_text TEXT,
    p_results_count INTEGER,
    p_search_successful BOOLEAN
);

-- Create the corrected function
CREATE OR REPLACE FUNCTION update_popular_searches(
    p_tenant_id UUID,
    p_query_text TEXT,
    p_results_count INTEGER,
    p_search_successful BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_query_hash TEXT;
    v_existing_record RECORD;
BEGIN
    -- Generate query hash
    v_query_hash := md5(p_query_text);
    
    -- Check if record exists
    SELECT * INTO v_existing_record 
    FROM popular_searches 
    WHERE tenant_id = p_tenant_id AND query_hash = v_query_hash;
    
    IF v_existing_record IS NOT NULL THEN
        -- Update existing record
        UPDATE popular_searches SET
            search_count = search_count + 1,
            last_searched_at = NOW(),
            success_count = success_count + CASE WHEN p_search_successful THEN 1 ELSE 0 END,
            total_results = total_results + p_results_count,
            success_rate = (success_count + CASE WHEN p_search_successful THEN 1 ELSE 0 END)::NUMERIC / (search_count + 1),
            avg_results_count = (total_results + p_results_count)::NUMERIC / (search_count + 1),
            updated_at = NOW()
        WHERE tenant_id = p_tenant_id AND query_hash = v_query_hash;
    ELSE
        -- Insert new record
        INSERT INTO popular_searches (
            tenant_id,
            query_text,
            query_hash,
            search_count,
            unique_users,
            last_searched_at,
            success_rate,
            avg_results_count,
            success_count,
            total_results,
            query_length,
            word_count,
            has_numbers,
            has_special_chars,
            is_trending,
            trend_score,
            created_at,
            updated_at
        ) VALUES (
            p_tenant_id,
            p_query_text,
            v_query_hash,
            1,
            1,
            NOW(),
            CASE WHEN p_search_successful THEN 1.0 ELSE 0.0 END,
            p_results_count,
            CASE WHEN p_search_successful THEN 1 ELSE 0 END,
            p_results_count,
            length(p_query_text),
            array_length(string_to_array(p_query_text, ' '), 1),
            p_query_text ~ '[0-9]',
            p_query_text ~ '[^a-zA-Z0-9\s]',
            false,
            0.0,
            NOW(),
            NOW()
        );
    END IF;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION update_popular_searches TO authenticated;

-- Test the function
SELECT update_popular_searches(
    '7193113e-ece2-4f7b-ae8c-176df4367e28'::UUID, -- Your tenant ID
    'test query from sql'::TEXT,
    5::INTEGER,
    true::BOOLEAN
);

-- Check if it was added/updated
SELECT * FROM popular_searches 
WHERE query_text = 'test query from sql' 
ORDER BY created_at DESC 
LIMIT 1;

-- Verify the function signature
SELECT 
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as arguments,
    pg_get_function_result(p.oid) as return_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'update_popular_searches';





