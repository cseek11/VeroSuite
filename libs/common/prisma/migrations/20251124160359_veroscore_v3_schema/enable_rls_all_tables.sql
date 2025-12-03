-- ============================================================================
-- VeroScore V3 - Enable RLS on All Tables (SECURITY FIX)
-- ============================================================================
-- Some tables are missing RLS - this enables it on all tables
-- ============================================================================

-- ============================================================================
-- STEP 1: Enable RLS on All Tables
-- ============================================================================
ALTER TABLE veroscore.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE veroscore.changes_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE veroscore.pr_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE veroscore.detection_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE veroscore.audit_log ENABLE ROW LEVEL SECURITY;  -- Was missing!
ALTER TABLE veroscore.idempotency_keys ENABLE ROW LEVEL SECURITY;  -- Was missing!
ALTER TABLE veroscore.system_metrics ENABLE ROW LEVEL SECURITY;  -- Was missing!

-- ============================================================================
-- STEP 2: Create RLS Policies for Tables Missing Policies
-- ============================================================================

-- Audit Log Policies
-- Service role can do everything (for backend processes)
CREATE POLICY IF NOT EXISTS "Service role full access audit_log"
    ON veroscore.audit_log FOR ALL
    USING (auth.role() = 'service_role');

-- Authenticated users can view audit logs (read-only for transparency)
CREATE POLICY IF NOT EXISTS "Authenticated users can view audit_log"
    ON veroscore.audit_log FOR SELECT
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Idempotency Keys Policies
-- Service role can do everything (for backend processes)
CREATE POLICY IF NOT EXISTS "Service role full access idempotency_keys"
    ON veroscore.idempotency_keys FOR ALL
    USING (auth.role() = 'service_role');

-- System Metrics Policies
-- Service role can do everything (for backend processes)
CREATE POLICY IF NOT EXISTS "Service role full access system_metrics"
    ON veroscore.system_metrics FOR ALL
    USING (auth.role() = 'service_role');

-- Authenticated users can view metrics (read-only for observability)
CREATE POLICY IF NOT EXISTS "Authenticated users can view system_metrics"
    ON veroscore.system_metrics FOR SELECT
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ============================================================================
-- STEP 3: Verify RLS is Enabled on All Tables
-- ============================================================================
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
JOIN pg_namespace n ON n.nspname = t.schemaname AND n.oid = c.relnamespace
WHERE schemaname = 'veroscore'
ORDER BY tablename;

-- All should show rls_enabled = true
-- If any show false, RLS is not enabled - SECURITY RISK!

-- ============================================================================
-- STEP 4: Verify Policies Exist
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'veroscore'
ORDER BY tablename, policyname;

-- Should show policies for all tables

-- ============================================================================
-- SECURITY STATUS
-- ============================================================================
-- After running this:
-- ✅ All tables have RLS enabled
-- ✅ All tables have appropriate policies
-- ✅ Most secure approach maintained
-- ============================================================================



