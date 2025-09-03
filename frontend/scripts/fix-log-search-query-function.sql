-- Fix the log_search_query function to properly handle query_text
-- Run this in your Supabase SQL Editor

-- First, drop the existing function if it exists
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

-- Create the corrected function
CREATE OR REPLACE FUNCTION log_search_query(
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
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_log_id UUID;
BEGIN
    -- Insert the search log
    INSERT INTO search_logs (
        tenant_id,
        user_id,
        session_id,
        query_text,
        query_type,
        search_mode,
        results_count,
        execution_time_ms,
        cache_hit,
        search_successful,
        error_message,
        user_agent,
        ip_address,
        created_at,
        updated_at
    ) VALUES (
        p_tenant_id,
        p_user_id,
        p_session_id,
        p_query_text,
        p_query_type,
        p_search_mode,
        p_results_count,
        p_execution_time_ms,
        p_cache_hit,
        p_search_successful,
        p_error_message,
        p_user_agent,
        p_ip_address,
        NOW(),
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

-- Test the function
DO $$
DECLARE
    test_tenant_id UUID := '7193113e-ece2-4f7b-ae8c-176df4367e28'; -- Replace with your actual tenant ID
    test_user_id UUID := 'c9c3a91e-e176-4f4c-b7cc-61ccf3c1c8b1'; -- Replace with your actual user ID
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
        query_text,
        query_type,
        search_mode,
        results_count,
        execution_time_ms
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



