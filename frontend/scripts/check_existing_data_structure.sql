-- Check the structure of tables that actually have data
-- This will show us the correct column names to use

-- Check popular_searches structure (has 95 records)
SELECT '=== popular_searches STRUCTURE (95 records) ===' as info;
SELECT column_name, data_type, is_nullable, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'popular_searches' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check search_logs structure (has 439 records)
SELECT '=== search_logs STRUCTURE (439 records) ===' as info;
SELECT column_name, data_type, is_nullable, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'search_logs' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show sample data from popular_searches to understand the structure
SELECT '=== popular_searches SAMPLE DATA ===' as info;
SELECT * FROM popular_searches LIMIT 3;

-- Show sample data from search_logs to understand the structure
SELECT '=== search_logs SAMPLE DATA ===' as info;
SELECT * FROM search_logs LIMIT 3;

-- Check what search terms are most popular
SELECT '=== TOP 10 POPULAR SEARCHES ===' as info;
SELECT query_text, search_count, last_searched_at 
FROM popular_searches 
ORDER BY search_count DESC 
LIMIT 10;














