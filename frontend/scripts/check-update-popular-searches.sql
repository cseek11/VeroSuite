-- Check the update_popular_searches function
-- Run this in your Supabase SQL Editor

-- Check if the function exists
SELECT 
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as arguments,
    pg_get_function_result(p.oid) as return_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'update_popular_searches';

-- Check the popular_searches table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'popular_searches' 
ORDER BY ordinal_position;

-- Check if the table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'popular_searches'
);

-- Check the current data in popular_searches
SELECT * FROM popular_searches LIMIT 5;





