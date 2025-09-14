-- Simple direct check of search tables
-- Run this to see what actually exists

-- Check if popular_searches table exists and has data
SELECT 'popular_searches exists:' as check_type, 
       EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'popular_searches') as table_exists;

-- Check if search_logs table exists and has data  
SELECT 'search_logs exists:' as check_type,
       EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'search_logs') as table_exists;

-- Check if search_trends table exists and has data
SELECT 'search_trends exists:' as check_type,
       EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'search_trends') as table_exists;

-- Check if search_suggestions_analytics table exists and has data
SELECT 'search_suggestions_analytics exists:' as check_type,
       EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'search_suggestions_analytics') as table_exists;

-- Try to see what columns popular_searches has (if it exists)
SELECT 'popular_searches columns:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'popular_searches' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Try to see what columns search_logs has (if it exists)
SELECT 'search_logs columns:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'search_logs' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Try to see what columns search_trends has (if it exists)
SELECT 'search_trends columns:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'search_trends' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Try to see what columns search_suggestions_analytics has (if it exists)
SELECT 'search_suggestions_analytics columns:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'search_suggestions_analytics' 
    AND table_schema = 'public'
ORDER BY ordinal_position;














