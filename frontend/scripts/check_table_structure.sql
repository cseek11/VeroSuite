-- Check the exact structure of search tables to understand constraints
-- Run this in Supabase SQL editor to see what columns are required

-- Check popular_searches table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'popular_searches' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check search_logs table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'search_logs' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check search_trends table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'search_trends' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check search_suggestions_analytics table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'search_suggestions_analytics' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if there are any existing tenants we can use
SELECT 'tenants' as table_name, * FROM tenants LIMIT 3;

-- Check what the actual tenant_id values look like
SELECT DISTINCT tenant_id FROM popular_searches WHERE tenant_id IS NOT NULL LIMIT 5;
SELECT DISTINCT tenant_id FROM search_logs WHERE tenant_id IS NOT NULL LIMIT 5;
SELECT DISTINCT tenant_id FROM search_trends WHERE tenant_id IS NOT NULL LIMIT 5;
SELECT DISTINCT tenant_id FROM search_suggestions_analytics WHERE tenant_id IS NOT NULL LIMIT 5;
