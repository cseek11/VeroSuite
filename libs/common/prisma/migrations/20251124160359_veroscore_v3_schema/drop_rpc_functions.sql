-- ============================================================================
-- VeroScore V3 - Remove RPC Functions (No Longer Needed)
-- ============================================================================
-- Since veroscore schema is now exposed in Supabase API configuration,
-- direct table access works and RPC functions are no longer needed.
--
-- Created: 2025-11-24
-- Usage: Run this SQL in Supabase SQL Editor to clean up RPC functions
-- ============================================================================

-- ============================================================================
-- REVOKE PERMISSIONS FIRST
-- ============================================================================

REVOKE EXECUTE ON FUNCTION veroscore.insert_session FROM service_role;
REVOKE EXECUTE ON FUNCTION veroscore.get_session FROM service_role;
REVOKE EXECUTE ON FUNCTION veroscore.find_active_session FROM service_role;
REVOKE EXECUTE ON FUNCTION veroscore.update_session_stats FROM service_role;
REVOKE EXECUTE ON FUNCTION veroscore.insert_changes FROM service_role;
REVOKE EXECUTE ON FUNCTION veroscore.get_pending_changes_count FROM service_role;

-- ============================================================================
-- DROP RPC FUNCTIONS
-- ============================================================================

DROP FUNCTION IF EXISTS veroscore.insert_session(TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS veroscore.get_session(TEXT);
DROP FUNCTION IF EXISTS veroscore.find_active_session(TEXT);
DROP FUNCTION IF EXISTS veroscore.update_session_stats(TEXT, INTEGER, INTEGER, INTEGER);
DROP FUNCTION IF EXISTS veroscore.insert_changes(TEXT, JSONB);
DROP FUNCTION IF EXISTS veroscore.get_pending_changes_count(TEXT);

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- After running this script, verify functions are removed:
-- SELECT routine_name, routine_schema 
-- FROM information_schema.routines 
-- WHERE routine_schema = 'veroscore' 
--   AND routine_name LIKE '%session%' OR routine_name LIKE '%change%';
-- 
-- Should return 0 rows (only cleanup functions should remain)
-- ============================================================================

