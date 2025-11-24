-- ============================================================================
-- VeroScore V3 - Fix PostgREST Configuration (CRITICAL)
-- ============================================================================
-- This is the KEY fix - PostgREST must be told about veroscore schema
-- ============================================================================

-- ============================================================================
-- STEP 1: Check Current PostgREST Configuration
-- ============================================================================
SELECT 
    rolname,
    setconfig
FROM pg_roles r
LEFT JOIN pg_db_role_setting s ON s.setrole = r.oid
WHERE rolname = 'authenticator';

-- If setconfig is NULL or doesn't include 'veroscore', continue to Step 2

-- ============================================================================
-- STEP 2: Configure PostgREST to Expose veroscore Schema
-- ============================================================================
-- This is REQUIRED - PostgREST won't see veroscore without this!

ALTER ROLE authenticator SET pgrst.db_schemas = 'public, veroscore';

-- ============================================================================
-- STEP 3: Notify PostgREST to Reload (CRITICAL!)
-- ============================================================================
-- PostgREST won't pick up the change without this notification

NOTIFY pgrst, 'reload config';

-- ============================================================================
-- STEP 4: Verify Configuration
-- ============================================================================
-- Check that veroscore is now in the configuration

SELECT 
    rolname,
    setconfig
FROM pg_roles r
JOIN pg_db_role_setting s ON s.setrole = r.oid
WHERE rolname = 'authenticator'
  AND setconfig::text LIKE '%veroscore%';

-- Should return 1 row with veroscore in setconfig

-- ============================================================================
-- IMPORTANT: Wait 10-30 seconds after running this!
-- ============================================================================
-- PostgREST needs time to reload its configuration
-- Then test: python .cursor/scripts/test_supabase_schema_access.py
-- ============================================================================

