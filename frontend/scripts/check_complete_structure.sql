-- Get the complete structure of tables with existing data
-- This will show us all columns we need for the function

-- Check popular_searches complete structure
SELECT '=== popular_searches COMPLETE STRUCTURE ===' as info;
SELECT column_name, data_type, is_nullable, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'popular_searches' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check search_logs complete structure
SELECT '=== search_logs COMPLETE STRUCTURE ===' as info;
SELECT column_name, data_type, is_nullable, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'search_logs' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show a few more samples to understand the data better
SELECT '=== MORE POPULAR SEARCHES ===' as info;
SELECT query_text, search_count, last_searched_at 
FROM popular_searches 
WHERE length(query_text) > 1  -- Filter out single characters
ORDER BY search_count DESC 
LIMIT 15;

-- Check search_logs sample data
SELECT '=== SEARCH LOGS SAMPLE ===' as info;
SELECT * FROM search_logs LIMIT 5;














