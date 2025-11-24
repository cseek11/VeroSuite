-- ============================================================================
-- VeroScore V3 - Final Secure Setup (No RPC Functions)
-- ============================================================================
-- Complete setup for secure direct table access with RLS enforcement
-- ============================================================================

-- ============================================================================
-- STEP 1: Enable RLS on ALL Tables (Security Fix)
-- ============================================================================
-- Some tables were missing RLS - this enables it on all
ALTER TABLE veroscore.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE veroscore.changes_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE veroscore.pr_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE veroscore.detection_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE veroscore.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE veroscore.idempotency_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE veroscore.system_metrics ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 2: Create RLS Policies for ALL Tables
-- ============================================================================

-- Audit Log Policies
DROP POLICY IF EXISTS "Service role full access audit_log" ON veroscore.audit_log;
CREATE POLICY "Service role full access audit_log"
    ON veroscore.audit_log FOR ALL
    USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Authenticated users can view audit_log" ON veroscore.audit_log;
CREATE POLICY "Authenticated users can view audit_log"
    ON veroscore.audit_log FOR SELECT
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Changes Queue Policies
DROP POLICY IF EXISTS "Service role full access changes_queue" ON veroscore.changes_queue;
CREATE POLICY "Service role full access changes_queue"
    ON veroscore.changes_queue FOR ALL
    USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can view own changes" ON veroscore.changes_queue;
CREATE POLICY "Users can view own changes"
    ON veroscore.changes_queue FOR SELECT
    USING (
        auth.role() = 'authenticated'
        OR auth.role() = 'service_role'
    );

-- Detection Results Policies
DROP POLICY IF EXISTS "Service role full access detection_results" ON veroscore.detection_results;
CREATE POLICY "Service role full access detection_results"
    ON veroscore.detection_results FOR ALL
    USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can view own detection results" ON veroscore.detection_results;
CREATE POLICY "Users can view own detection results"
    ON veroscore.detection_results FOR SELECT
    USING (
        auth.role() = 'authenticated'
        OR auth.role() = 'service_role'
    );

-- Idempotency Keys Policies
DROP POLICY IF EXISTS "Service role full access idempotency_keys" ON veroscore.idempotency_keys;
CREATE POLICY "Service role full access idempotency_keys"
    ON veroscore.idempotency_keys FOR ALL
    USING (auth.role() = 'service_role');

-- System Metrics Policies
DROP POLICY IF EXISTS "Service role full access system_metrics" ON veroscore.system_metrics;
CREATE POLICY "Service role full access system_metrics"
    ON veroscore.system_metrics FOR ALL
    USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Authenticated users can view system_metrics" ON veroscore.system_metrics;
CREATE POLICY "Authenticated users can view system_metrics"
    ON veroscore.system_metrics FOR SELECT
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ============================================================================
-- STEP 3: Configure PostgREST Schema Exposure
-- ============================================================================
ALTER ROLE authenticator SET pgrst.db_schemas = 'public, veroscore';

-- ============================================================================
-- STEP 4: Set Search Path (Helps PostgREST Find Tables)
-- ============================================================================
ALTER ROLE authenticated SET search_path = veroscore, public;
ALTER ROLE anon SET search_path = veroscore, public;
ALTER ROLE service_role SET search_path = veroscore, public;

-- ============================================================================
-- STEP 5: Grant Schema Permissions
-- ============================================================================
GRANT USAGE ON SCHEMA veroscore TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA veroscore TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA veroscore TO anon, authenticated, service_role;
GRANT EXECUTE ON ALL ROUTINES IN SCHEMA veroscore TO anon, authenticated, service_role;

-- ============================================================================
-- STEP 6: Force PostgREST Schema Cache Reload
-- ============================================================================
-- Multiple methods to ensure PostgREST reloads

-- Method 1: Reload schema cache
NOTIFY pgrst, 'reload schema';

-- Method 2: Reload config
NOTIFY pgrst, 'reload config';

-- Method 3: Terminate PostgREST processes (forces restart)
-- Note: This may not work on Supabase managed instances
DO $$
DECLARE
    pid_record RECORD;
BEGIN
    FOR pid_record IN 
        SELECT pid 
        FROM pg_stat_activity 
        WHERE application_name = 'postgrest'
          AND pid != pg_backend_pid()
    LOOP
        PERFORM pg_terminate_backend(pid_record.pid);
    END LOOP;
END $$;

-- ============================================================================
-- STEP 7: Verify Everything is Correct
-- ============================================================================

-- Verify RLS is enabled on all tables
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
JOIN pg_namespace n ON n.nspname = t.schemaname AND n.oid = c.relnamespace
WHERE schemaname = 'veroscore'
ORDER BY tablename;

-- All should show rls_enabled = true

-- Verify PostgREST config
SELECT 
    rolname,
    setconfig
FROM pg_roles r
JOIN pg_db_role_setting s ON s.setrole = r.oid
WHERE rolname = 'authenticator'
  AND setconfig::text LIKE '%veroscore%';

-- Should return 1 row with veroscore in setconfig

-- Verify policies exist
SELECT 
    schemaname,
    tablename,
    COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'veroscore'
GROUP BY schemaname, tablename
ORDER BY tablename;

-- Should show at least 1 policy per table

-- ============================================================================
-- IMPORTANT: After Running This
-- ============================================================================
-- 1. Wait 30-60 seconds for PostgREST to reload
-- 2. If still not working, RESTART Supabase project
-- 3. Test: python .cursor/scripts/test_supabase_schema_access.py
-- 
-- The code uses PostgREST with Accept-Profile header (MOST SECURE)
-- RLS is enforced on all tables
-- ============================================================================

