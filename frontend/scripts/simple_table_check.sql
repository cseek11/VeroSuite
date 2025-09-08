-- Simple check to see what search tables exist and their structure
-- Run this in Supabase SQL editor

-- Check if tables exist
SELECT 'Table existence check:' as info;
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name LIKE '%search%'
ORDER BY table_name;

-- Check popular_searches if it exists
SELECT 'popular_searches structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'popular_searches' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check search_logs if it exists  
SELECT 'search_logs structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'search_logs' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check search_trends if it exists
SELECT 'search_trends structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'search_trends' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check search_suggestions_analytics if it exists
SELECT 'search_suggestions_analytics structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'search_suggestions_analytics' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show all tables that might be related
SELECT 'All tables containing "search":' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name ILIKE '%search%'
ORDER BY table_name;






