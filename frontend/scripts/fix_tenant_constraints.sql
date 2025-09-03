-- Fix tenant constraints to allow system-wide search data
-- This is the proper, long-term solution

-- First, let's see what we're working with
SELECT 'Current table constraints:' as info;

-- Check current constraints
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public' 
    AND tc.table_name IN ('popular_searches', 'search_logs', 'search_trends', 'search_suggestions_analytics')
    AND tc.constraint_type = 'CHECK'
ORDER BY tc.table_name, kcu.column_name;

-- Check current nullable status of tenant_id columns
SELECT 
    table_name,
    column_name,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('popular_searches', 'search_logs', 'search_trends', 'search_suggestions_analytics')
    AND column_name = 'tenant_id'
ORDER BY table_name;

-- Option 1: Create a system tenant for global data
-- This is the cleanest approach - create a special tenant for system-wide suggestions
INSERT INTO tenants (id, name, created_at, updated_at) 
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'System (Global Suggestions)',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Option 2: Modify the tables to allow NULL for system-wide data
-- This is more flexible but requires schema changes

-- For popular_searches - allow NULL tenant_id for system-wide suggestions
ALTER TABLE popular_searches 
ALTER COLUMN tenant_id DROP NOT NULL;

-- For search_logs - allow NULL tenant_id for system-wide logs  
ALTER TABLE search_logs 
ALTER COLUMN tenant_id DROP NOT NULL;

-- For search_trends - allow NULL tenant_id for system-wide trends
ALTER TABLE search_trends 
ALTER COLUMN tenant_id DROP NOT NULL;

-- For search_suggestions_analytics - allow NULL tenant_id for system-wide analytics
ALTER TABLE search_suggestions_analytics 
ALTER COLUMN tenant_id DROP NOT NULL;

-- Add comments to document the purpose
COMMENT ON COLUMN popular_searches.tenant_id IS 'NULL = system-wide suggestions, UUID = tenant-specific suggestions';
COMMENT ON COLUMN search_logs.tenant_id IS 'NULL = system-wide logs, UUID = tenant-specific logs';
COMMENT ON COLUMN search_trends.tenant_id IS 'NULL = system-wide trends, UUID = tenant-specific trends';
COMMENT ON COLUMN search_suggestions_analytics.tenant_id IS 'NULL = system-wide analytics, UUID = tenant-specific analytics';

-- Verify the changes
SELECT 'Updated table constraints:' as info;

SELECT 
    table_name,
    column_name,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('popular_searches', 'search_logs', 'search_trends', 'search_suggestions_analytics')
    AND column_name = 'tenant_id'
ORDER BY table_name;
