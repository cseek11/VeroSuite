-- Comprehensive check of all search tables
-- This will show us the complete picture

-- First, let's see what tables actually exist
SELECT '=== EXISTING SEARCH TABLES ===' as section;
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name LIKE '%search%'
ORDER BY table_name;

-- Now let's check the structure of each existing table
SELECT '=== popular_searches STRUCTURE ===' as section;
SELECT column_name, data_type, is_nullable, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'popular_searches' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT '=== search_logs STRUCTURE ===' as section;
SELECT column_name, data_type, is_nullable, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'search_logs' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT '=== search_trends STRUCTURE ===' as section;
SELECT column_name, data_type, is_nullable, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'search_trends' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT '=== search_suggestions_analytics STRUCTURE ===' as section;
SELECT column_name, data_type, is_nullable, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'search_suggestions_analytics' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check record counts for each table
SELECT '=== RECORD COUNTS ===' as section;
SELECT 'popular_searches' as table_name, COUNT(*) as record_count FROM popular_searches
UNION ALL
SELECT 'search_logs' as table_name, COUNT(*) as record_count FROM search_logs
UNION ALL
SELECT 'search_trends' as table_name, COUNT(*) as record_count FROM search_trends
UNION ALL
SELECT 'search_suggestions_analytics' as table_name, COUNT(*) as record_count FROM search_suggestions_analytics;














