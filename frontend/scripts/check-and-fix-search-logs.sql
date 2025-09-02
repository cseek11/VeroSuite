-- First, let's see what columns actually exist in search_logs
-- Run this in your Supabase SQL Editor

-- Check the actual table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default,
    is_identity
FROM information_schema.columns 
WHERE table_name = 'search_logs' 
ORDER BY ordinal_position;

-- Check if there are any constraints
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'search_logs';

-- Check the actual data in the table
SELECT * FROM search_logs LIMIT 1;

-- Now let's see what the current function looks like
SELECT 
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as arguments,
    pg_get_function_result(p.oid) as return_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'log_search_query';
