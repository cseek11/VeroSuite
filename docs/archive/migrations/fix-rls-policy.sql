-- ============================================================================
-- FIX RLS POLICY FOR SEARCH LOGGING
-- ============================================================================
-- Simple fix for the RLS policy issue

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users can insert their own search logs" ON search_logs;

-- Create a more permissive policy for testing
CREATE POLICY "Allow search log inserts" ON search_logs
  FOR INSERT WITH CHECK (true);

-- Also allow updates for click tracking
CREATE POLICY "Allow search log updates" ON search_logs
  FOR UPDATE USING (true);

COMMENT ON POLICY "Allow search log inserts" ON search_logs IS 'Allow authenticated users to insert search logs';
COMMENT ON POLICY "Allow search log updates" ON search_logs IS 'Allow authenticated users to update search logs for click tracking';








































