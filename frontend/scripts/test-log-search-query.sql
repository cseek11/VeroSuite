-- Test the log_search_query function directly
-- Run this in your Supabase SQL Editor to see if the function is working

-- First, let's see what the function signature looks like
SELECT 
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as arguments,
    pg_get_function_result(p.oid) as return_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'log_search_query';

-- Test calling the function with sample data
-- Replace the UUIDs with actual values from your database
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
    
    RAISE NOTICE 'Function call result: %', result_id;
    
    -- Check if the record was created
    IF result_id IS NOT NULL THEN
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
    ELSE
        RAISE NOTICE '❌ Function call failed';
    END IF;
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Error calling function: %', SQLERRM;
END $$;

-- Check the most recent search logs
SELECT 
    id,
    query_text,
    query_type,
    search_mode,
    results_count,
    execution_time_ms,
    created_at
FROM search_logs 
ORDER BY created_at DESC 
LIMIT 5;


























