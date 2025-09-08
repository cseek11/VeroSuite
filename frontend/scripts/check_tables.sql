-- Check what tables exist in the current database
-- Run this in Supabase SQL editor to see available tables

-- List all tables
SELECT 
    table_schema,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
ORDER BY table_schema, table_name;

-- Check for tables that might contain customer data
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
    AND (
        table_name ILIKE '%customer%' 
        OR table_name ILIKE '%client%' 
        OR table_name ILIKE '%user%'
        OR table_name ILIKE '%account%'
        OR table_name ILIKE '%contact%'
    )
ORDER BY table_name;

-- Check for search-related tables
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
    AND (
        table_name ILIKE '%search%' 
        OR table_name ILIKE '%log%'
        OR table_name ILIKE '%query%'
    )
ORDER BY table_name;






