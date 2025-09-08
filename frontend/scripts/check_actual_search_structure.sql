-- Check the actual structure of all existing search tables
-- This will show us the correct column names to use

-- Check popular_searches structure
SELECT 'popular_searches structure:' as table_name;
SELECT column_name, data_type, is_nullable, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'popular_searches' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check search_logs structure  
SELECT 'search_logs structure:' as table_name;
SELECT column_name, data_type, is_nullable, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'search_logs' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check search_trends structure
SELECT 'search_trends structure:' as table_name;
SELECT column_name, data_type, is_nullable, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'search_trends' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check search_suggestions_analytics structure
SELECT 'search_suggestions_analytics structure:' as table_name;
SELECT column_name, data_type, is_nullable, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'search_suggestions_analytics' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check search_corrections structure (new table we didn't know about)
SELECT 'search_corrections structure:' as table_name;
SELECT column_name, data_type, is_nullable, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'search_corrections' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check search_errors structure (new table we didn't know about)
SELECT 'search_errors structure:' as table_name;
SELECT column_name, data_type, is_nullable, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'search_errors' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check search_performance_metrics structure (new table we didn't know about)
SELECT 'search_performance_metrics structure:' as table_name;
SELECT column_name, data_type, is_nullable, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'search_performance_metrics' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check search_typo_corrections structure (new table we didn't know about)
SELECT 'search_typo_corrections structure:' as table_name;
SELECT column_name, data_type, is_nullable, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'search_typo_corrections' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check search_user_behavior structure (new table we didn't know about)
SELECT 'search_user_behavior structure:' as table_name;
SELECT column_name, data_type, is_nullable, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'search_user_behavior' 
    AND table_schema = 'public'
ORDER BY ordinal_position;






