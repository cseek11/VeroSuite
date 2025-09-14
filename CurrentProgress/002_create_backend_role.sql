-- ============================================================================
-- CREATE BACKEND ROLE FOR NEW SUPABASE API KEY SYSTEM
-- ============================================================================
-- This script creates a dedicated backend role with proper permissions
-- for the new Supabase API key system (2025)
-- 
-- Priority: P0 - REQUIRED FOR BACKEND API TO WORK
-- 
-- Usage: Run this in your Supabase SQL Editor as the service role
-- 
-- Author: VeroField Security Audit
-- Date: January 2, 2025
-- ============================================================================

-- Ensure we're connected as service role
SELECT current_user, current_setting('role');

-- ============================================================================
-- CREATE BACKEND ROLE
-- ============================================================================

-- Create a dedicated backend role for accounts access
CREATE ROLE backend_accounts;

-- Grant necessary schema permissions
GRANT USAGE ON SCHEMA public TO backend_accounts;

-- Grant table permissions for accounts
GRANT SELECT, INSERT, UPDATE, DELETE ON accounts TO backend_accounts;

-- Grant permissions for related tables that might be needed
GRANT SELECT ON customer_profiles TO backend_accounts;
GRANT SELECT ON customer_contacts TO backend_accounts;
GRANT SELECT ON customer_segments TO backend_accounts;

-- Grant sequence permissions (for auto-incrementing IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO backend_accounts;

-- ============================================================================
-- CREATE RLS POLICIES FOR BACKEND ROLE
-- ============================================================================

-- Create a policy that allows the backend role to access all accounts
-- This is safe because the backend role will only be used server-side
CREATE POLICY "backend can access all accounts"
  ON accounts
  FOR ALL
  TO backend_accounts
  USING (true)
  WITH CHECK (true);

-- Create policies for related tables
CREATE POLICY "backend can access customer profiles"
  ON customer_profiles
  FOR SELECT
  TO backend_accounts
  USING (true);

CREATE POLICY "backend can access customer contacts"
  ON customer_contacts
  FOR SELECT
  TO backend_accounts
  USING (true);

CREATE POLICY "backend can access customer segments"
  ON customer_segments
  FOR SELECT
  TO backend_accounts
  USING (true);

-- ============================================================================
-- GRANT BYPASS RLS (REQUIRED FOR BACKEND ACCESS)
-- ============================================================================

-- Grant bypass RLS for this specific role
-- This allows the backend to access data without being blocked by RLS policies
ALTER ROLE backend_accounts WITH BYPASSRLS;

-- ============================================================================
-- VERIFY SETUP
-- ============================================================================

-- Verify the role was created
SELECT rolname, rolbypassrls 
FROM pg_roles 
WHERE rolname = 'backend_accounts';

-- Verify permissions
SELECT 
    table_schema,
    table_name,
    privilege_type
FROM information_schema.table_privileges 
WHERE grantee = 'backend_accounts'
ORDER BY table_name, privilege_type;

-- ============================================================================
-- NEXT STEPS
-- ============================================================================
-- 1. Go to your Supabase Dashboard → API → Keys
-- 2. Click "Generate new key" → Secret
-- 3. Assign it to the 'backend_accounts' role
-- 4. Copy the new key and update your backend/.env file
-- 5. Test the backend API
-- ============================================================================
