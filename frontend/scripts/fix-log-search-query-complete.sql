-- Fix the log_search_query function to handle all NOT NULL constraints
-- Run this in your Supabase SQL Editor

-- Drop the existing function
DROP FUNCTION IF EXISTS log_search_query(
    p_tenant_id UUID,
    p_user_id UUID,
    p_session_id VARCHAR,
    p_query_text TEXT,
    p_query_type VARCHAR,
    p_search_mode VARCHAR,
    p_results_count INTEGER,
    p_execution_time_ms INTEGER,
    p_cache_hit BOOLEAN,
    p_search_successful BOOLEAN,
    p_error_message TEXT,
    p_user_agent TEXT,
    p_ip_address INET
);

-- Create the corrected function that handles all NOT NULL constraints
CREATE OR REPLACE FUNCTION log_search_query(
    p_tenant_id UUID,
    p_user_id UUID,
    p_session_id VARCHAR,
    p_query_text TEXT,
    p_query_type VARCHAR,
    p_search_mode VARCHAR,
    p_results_count INTEGER,
    p_execution_time_ms INTEGER,
    p_cache_hit BOOLEAN DEFAULT false,
    p_search_successful BOOLEAN DEFAULT true,
    p_error_message TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_log_id UUID;
BEGIN
    -- Debug logging
    RAISE NOTICE 'Inserting search log with query_text: %', p_query_text;
    
    -- Insert the search log - handling all NOT NULL constraints
    INSERT INTO search_logs (
        tenant_id,
        user_id,
        session_id,
        query,                    -- NOT NULL
        query_text,               -- nullable
        query_type,               -- NOT NULL, has default 'hybrid'
        search_mode,              -- NOT NULL, has default 'hybrid'
        results_count,            -- NOT NULL
        time_taken_ms,            -- NOT NULL - map from execution_time_ms
        execution_time_ms,        -- NOT NULL, has default 0
        cache_hit,                -- nullable, has default false
        search_successful,        -- NOT NULL, has default true
        error_message,            -- nullable
        user_agent,               -- nullable
        ip_address,               -- nullable
        created_at                -- nullable, has default now()
    ) VALUES (
        p_tenant_id,
        p_user_id,
        p_session_id,
        p_query_text,             -- Map to query column (NOT NULL)
        p_query_text,             -- Also store in query_text column
        p_query_type,
        p_search_mode,
        p_results_count,
        p_execution_time_ms,      -- Map to time_taken_ms (NOT NULL)
        p_execution_time_ms,      -- Store in execution_time_ms
        p_cache_hit,
        p_search_successful,
        p_error_message,
        p_user_agent,
        p_ip_address,
        NOW()
    )
    RETURNING id INTO v_log_id;
    
    -- Return the log ID as text
    RETURN v_log_id::TEXT;
    
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to log search query: %', SQLERRM;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION log_search_query TO authenticated;

-- Test the function with your actual data
DO $$
DECLARE
    test_tenant_id UUID := '7193113e-ece2-4f7b-ae8c-176df4367e28'; -- Your tenant ID
    test_user_id UUID := 'c9c3a91e-e176-4f4c-b7cc-61ccf3c1c8b1'; -- Your user ID
    result_id TEXT;
BEGIN
    -- Call the function
    SELECT log_search_query(
        p_tenant_id := test_tenant_id,
        p_user_id := test_user_id,
        p_session_id := 'test_session_123',
        p_query_text := 'test query john smith',
        p_query_type := 'hybrid',
        p_search_mode := 'hybrid',
        p_results_count := 5,
        p_execution_time_ms := 150,
        p_cache_hit := false,
        p_search_successful := true,
        p_error_message := null,
        p_user_agent := 'Mozilla/5.0 Test Browser',
        p_ip_address := null
    ) INTO result_id;
    
    RAISE NOTICE '✅ Function call successful, log ID: %', result_id;
    
    -- Show the created record
    SELECT 
        query,                    -- This should now be populated
        query_text,               -- This should also be populated
        time_taken_ms,            -- This should now be populated
        execution_time_ms,        -- This should also be populated
        query_type,
        search_mode,
        results_count
    FROM search_logs 
    WHERE id = result_id::UUID;
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Error calling function: %', SQLERRM;
END $$;

-- Verify the function signature
SELECT 
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as arguments,
    pg_get_function_result(p.oid) as return_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'log_search_query';

-- Check the most recent search logs to see if all columns are now populated
SELECT 
    id,
    query,                       -- This should now have the search text
    query_text,                  -- This should also have the search text
    time_taken_ms,               -- This should now be populated
    execution_time_ms,            -- This should also be populated
    query_type,
    search_mode,
    results_count,
    created_at
FROM search_logs 
ORDER BY created_at DESC 
LIMIT 5;















