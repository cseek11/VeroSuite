-- Check and remove ALL RLS policies
-- Run this in your Supabase SQL Editor

-- First, let's see what policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public';

-- Drop ALL policies on accounts table
DROP POLICY IF EXISTS "Enable read access for all users" ON "accounts";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "accounts";
DROP POLICY IF EXISTS "Enable update for users based on email" ON "accounts";
DROP POLICY IF EXISTS "Enable delete for users based on email" ON "accounts";
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON "accounts";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "accounts";
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON "accounts";
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON "accounts";
DROP POLICY IF EXISTS "accounts_policy" ON "accounts";
DROP POLICY IF EXISTS "accounts_select_policy" ON "accounts";
DROP POLICY IF EXISTS "accounts_insert_policy" ON "accounts";
DROP POLICY IF EXISTS "accounts_update_policy" ON "accounts";
DROP POLICY IF EXISTS "accounts_delete_policy" ON "accounts";

-- Drop ALL policies on jobs table
DROP POLICY IF EXISTS "Enable read access for all users" ON "jobs";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "jobs";
DROP POLICY IF EXISTS "Enable update for users based on email" ON "jobs";
DROP POLICY IF EXISTS "Enable delete for users based on email" ON "jobs";
DROP POLICY IF EXISTS "jobs_policy" ON "jobs";

-- Drop ALL policies on locations table
DROP POLICY IF EXISTS "Enable read access for all users" ON "locations";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "locations";
DROP POLICY IF EXISTS "Enable update for users based on email" ON "locations";
DROP POLICY IF EXISTS "Enable delete for users based on email" ON "locations";
DROP POLICY IF EXISTS "locations_policy" ON "locations";

-- Drop ALL policies on work_orders table
DROP POLICY IF EXISTS "Enable read access for all users" ON "work_orders";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "work_orders";
DROP POLICY IF EXISTS "Enable update for users based on email" ON "work_orders";
DROP POLICY IF EXISTS "Enable delete for users based on email" ON "work_orders";
DROP POLICY IF EXISTS "work_orders_policy" ON "work_orders";

-- Drop ALL policies on users table
DROP POLICY IF EXISTS "Enable read access for all users" ON "users";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "users";
DROP POLICY IF EXISTS "Enable update for users based on email" ON "users";
DROP POLICY IF EXISTS "Enable delete for users based on email" ON "users";
DROP POLICY IF EXISTS "users_policy" ON "users";

-- Drop ALL policies on tenant table
DROP POLICY IF EXISTS "Enable read access for all users" ON "tenant";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "tenant";
DROP POLICY IF EXISTS "Enable update for users based on email" ON "tenant";
DROP POLICY IF EXISTS "Enable delete for users based on email" ON "tenant";
DROP POLICY IF EXISTS "tenant_policy" ON "tenant";

-- Drop ALL policies on agreements table
DROP POLICY IF EXISTS "Enable read access for all users" ON "agreements";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "agreements";
DROP POLICY IF EXISTS "Enable update for users based on email" ON "agreements";
DROP POLICY IF EXISTS "Enable delete for users based on email" ON "agreements";
DROP POLICY IF EXISTS "agreements_policy" ON "agreements";
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON "agreements";
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON "agreements";
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON "agreements";
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON "agreements";

-- Drop ALL policies on payments table
DROP POLICY IF EXISTS "Enable read access for all users" ON "payments";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "payments";
DROP POLICY IF EXISTS "Enable update for users based on email" ON "payments";
DROP POLICY IF EXISTS "Enable delete for users based on email" ON "payments";
DROP POLICY IF EXISTS "payments_policy" ON "payments";
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON "payments";
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON "payments";
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON "payments";
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON "payments";

-- Disable RLS on all tables
ALTER TABLE "accounts" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "jobs" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "locations" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "work_orders" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "tenant" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "agreements" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "payments" DISABLE ROW LEVEL SECURITY;

-- Grant permissions to anon and authenticated roles
GRANT ALL ON "accounts" TO anon;
GRANT ALL ON "accounts" TO authenticated;
GRANT ALL ON "jobs" TO anon;
GRANT ALL ON "jobs" TO authenticated;
GRANT ALL ON "locations" TO anon;
GRANT ALL ON "locations" TO authenticated;
GRANT ALL ON "work_orders" TO anon;
GRANT ALL ON "work_orders" TO authenticated;
GRANT ALL ON "users" TO anon;
GRANT ALL ON "users" TO authenticated;
GRANT ALL ON "tenant" TO anon;
GRANT ALL ON "tenant" TO authenticated;
GRANT ALL ON "agreements" TO anon;
GRANT ALL ON "agreements" TO authenticated;
GRANT ALL ON "payments" TO anon;
GRANT ALL ON "payments" TO authenticated;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('accounts', 'jobs', 'locations', 'work_orders', 'users', 'tenant', 'agreements', 'payments');

-- Test query to verify access
SELECT COUNT(*) FROM "accounts";
SELECT COUNT(*) FROM "agreements";
SELECT COUNT(*) FROM "payments";

-- Show remaining policies (should be empty)
SELECT schemaname, tablename, policyname
FROM pg_policies 
WHERE schemaname = 'public';
