-- ============================================================================
-- SIMPLE RLS POLICIES FOR TESTING
-- ============================================================================
-- These are simple RLS policies that allow basic access for testing
-- ============================================================================

-- Enable RLS on key tables
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Simple policies that allow access for testing
-- These will be replaced with proper tenant-based policies later

-- Accounts table
CREATE POLICY "Allow all access to accounts" ON accounts
  FOR ALL TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- Customer notes table
CREATE POLICY "Allow all access to customer_notes" ON customer_notes
  FOR ALL TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- Customer profiles table
CREATE POLICY "Allow all access to customer_profiles" ON customer_profiles
  FOR ALL TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- Users table
CREATE POLICY "Allow all access to users" ON users
  FOR ALL TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- Verify policies were created
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
WHERE schemaname = 'public' 
  AND policyname LIKE '%Allow all access%'
ORDER BY tablename, policyname;
