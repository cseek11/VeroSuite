-- Test script for get_search_suggestions function
-- Run this in Supabase SQL editor to test the function

-- First, let's check if the function exists
SELECT 
    routine_name, 
    routine_type, 
    data_type 
FROM information_schema.routines 
WHERE routine_name = 'get_search_suggestions';

-- Test the function with a simple query
SELECT * FROM get_search_suggestions('john', 5);

-- Test with empty query
SELECT * FROM get_search_suggestions('', 5);

-- Test with short query
SELECT * FROM get_search_suggestions('j', 5);

-- Check if required tables exist
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name IN ('customers', 'search_logs', 'popular_searches');

-- Check customers table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'customers' 
AND column_name IN ('first_name', 'last_name', 'tenant_id');

-- Check search_logs table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'search_logs' 
AND column_name IN ('query', 'tenant_id', 'success');

-- Check popular_searches table structure (if it exists)
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'popular_searches' 
AND column_name IN ('query', 'tenant_id');














