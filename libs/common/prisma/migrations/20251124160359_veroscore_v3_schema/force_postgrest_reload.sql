-- ============================================================================
-- VeroScore V3 - Force PostgREST Reload
-- ============================================================================
-- If PostgREST hasn't reloaded after configuration change, try this
-- ============================================================================

-- Method 1: Notify PostgREST again
NOTIFY pgrst, 'reload config';

-- Method 2: Check if PostgREST is listening
SELECT pg_listening_channels();

-- Should show 'pgrst' in the list if PostgREST is running

-- Method 3: Verify configuration is still set
SELECT 
    rolname,
    setconfig
FROM pg_roles r
JOIN pg_db_role_setting s ON s.setrole = r.oid
WHERE rolname = 'authenticator'
  AND setconfig::text LIKE '%veroscore%';

-- Should return 1 row

-- ============================================================================
-- IMPORTANT NOTES
-- ============================================================================
-- 1. PostgREST may need 30-60 seconds to fully reload
-- 2. You may need to restart your Supabase project
-- 3. Check Supabase Dashboard → Settings → API → Restart API (if available)
-- 4. The Python client may need to be restarted/reconnected
-- ============================================================================

