-- Focus on the core search tables we need for suggestions
-- Run this to see the exact column names

-- Check popular_searches structure (this is what we need for suggestions)
SELECT '=== popular_searches structure ===' as info;
SELECT column_name, data_type, is_nullable, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'popular_searches' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check search_logs structure (this is what we need for suggestions)
SELECT '=== search_logs structure ===' as info;
SELECT column_name, data_type, is_nullable, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'search_logs' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check search_trends structure (this is what we need for suggestions)
SELECT '=== search_trends structure ===' as info;
SELECT column_name, data_type, is_nullable, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'search_trends' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check search_suggestions_analytics structure (this is what we need for suggestions)
SELECT '=== search_suggestions_analytics structure ===' as info;
SELECT column_name, data_type, is_nullable, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'search_suggestions_analytics' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Also check if there are any existing records to understand the data
SELECT '=== Sample data check ===' as info;
SELECT 'popular_searches count:' as table_name, COUNT(*) as record_count FROM popular_searches;
SELECT 'search_logs count:' as table_name, COUNT(*) as record_count FROM search_logs;
SELECT 'search_trends count:' as table_name, COUNT(*) as record_count FROM search_trends;
SELECT 'search_suggestions_analytics count:' as table_name, COUNT(*) as record_count FROM search_suggestions_analytics;






