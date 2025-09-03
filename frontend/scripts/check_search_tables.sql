-- Check the actual structure of search-related tables
-- Run this in Supabase SQL editor to see what columns exist

-- Check popular_searches table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'popular_searches' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check search_logs table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'search_logs' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check search_trends table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'search_trends' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check search_suggestions_analytics table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'search_suggestions_analytics' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Sample some data from these tables to see the structure
SELECT 'popular_searches' as table_name, * FROM popular_searches LIMIT 3;
SELECT 'search_logs' as table_name, * FROM search_logs LIMIT 3;
SELECT 'search_trends' as table_name, * FROM search_trends LIMIT 3;
SELECT 'search_suggestions_analytics' as table_name, * FROM search_suggestions_analytics LIMIT 3;


