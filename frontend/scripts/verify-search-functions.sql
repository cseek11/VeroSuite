-- ============================================================================
-- VERIFY SEARCH FUNCTIONS
-- ============================================================================
-- Script to verify all search functions exist and have proper permissions

-- Check if required extensions are enabled
SELECT 
    extname as extension_name,
    extversion as version
FROM pg_extension 
WHERE extname IN ('pg_trgm', 'uuid-ossp');

-- Check if search functions exist
SELECT 
    routine_name,
    routine_type,
    data_type as return_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_name LIKE 'search_customers%'
ORDER BY routine_name;

-- Check function permissions
SELECT 
    p.proname as function_name,
    p.proacl as permissions,
    r.rolname as role_name
FROM pg_proc p
LEFT JOIN pg_roles r ON r.oid = ANY(p.proacl)
WHERE p.proname LIKE 'search_customers%';

-- Test basic search function
DO $$
DECLARE
    test_tenant_id UUID := '7193113e-ece2-4f7b-ae8c-176df4367e28';
    test_result RECORD;
BEGIN
    -- Test search_customers_enhanced
    BEGIN
        SELECT * INTO test_result
        FROM search_customers_enhanced('test', test_tenant_id, 5, 0)
        LIMIT 1;
        
        RAISE NOTICE '✅ search_customers_enhanced: Working';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE '❌ search_customers_enhanced: %', SQLERRM;
    END;

    -- Test search_customers_multi_word
    BEGIN
        SELECT * INTO test_result
        FROM search_customers_multi_word('test', test_tenant_id, 5, 0)
        LIMIT 1;
        
        RAISE NOTICE '✅ search_customers_multi_word: Working';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE '❌ search_customers_multi_word: %', SQLERRM;
    END;

    -- Test search_customers_fuzzy (if pg_trgm is available)
    BEGIN
        SELECT * INTO test_result
        FROM search_customers_fuzzy(test_tenant_id, 'test', 0.3, 5)
        LIMIT 1;
        
        RAISE NOTICE '✅ search_customers_fuzzy: Working';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE '❌ search_customers_fuzzy: %', SQLERRM;
    END;
END $$;

-- Check RLS policies on accounts table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'accounts';

-- Check if accounts table has RLS enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'accounts';

-- Check tenant isolation
SELECT 
    COUNT(*) as total_accounts,
    COUNT(DISTINCT tenant_id) as unique_tenants
FROM accounts;

-- Check if search_errors table exists
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name = 'search_errors';

-- If search_errors table doesn't exist, create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'search_errors') THEN
        CREATE TABLE search_errors (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tenant_id UUID,
            user_id UUID,
            error_type VARCHAR(100) NOT NULL,
            error_message TEXT NOT NULL,
            error_stack TEXT,
            query_text TEXT,
            user_agent TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            is_resolved BOOLEAN DEFAULT FALSE,
            resolved_at TIMESTAMP WITH TIME ZONE
        );
        
        -- Enable RLS
        ALTER TABLE search_errors ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policy
        CREATE POLICY search_errors_tenant_isolation ON search_errors
            FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
        
        -- Grant permissions
        GRANT ALL ON search_errors TO authenticated;
        
        RAISE NOTICE '✅ Created search_errors table with RLS';
    ELSE
        RAISE NOTICE '✅ search_errors table already exists';
    END IF;
END $$;

-- Final verification
SELECT 'Search Functions Verification Complete' as status;
