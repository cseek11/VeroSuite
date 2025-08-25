-- Remove all RLS policies and ensure RLS is disabled
-- Run this in your Supabase SQL Editor

-- Drop all RLS policies
DROP POLICY IF EXISTS "Enable read access for all users" ON "accounts";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "accounts";
DROP POLICY IF EXISTS "Enable update for users based on email" ON "accounts";
DROP POLICY IF EXISTS "Enable delete for users based on email" ON "accounts";

DROP POLICY IF EXISTS "Enable read access for all users" ON "jobs";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "jobs";
DROP POLICY IF EXISTS "Enable update for users based on email" ON "jobs";
DROP POLICY IF EXISTS "Enable delete for users based on email" ON "jobs";

DROP POLICY IF EXISTS "Enable read access for all users" ON "locations";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "locations";
DROP POLICY IF EXISTS "Enable update for users based on email" ON "locations";
DROP POLICY IF EXISTS "Enable delete for users based on email" ON "locations";

DROP POLICY IF EXISTS "Enable read access for all users" ON "work_orders";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "work_orders";
DROP POLICY IF EXISTS "Enable update for users based on email" ON "work_orders";
DROP POLICY IF EXISTS "Enable delete for users based on email" ON "work_orders";

DROP POLICY IF EXISTS "Enable read access for all users" ON "users";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "users";
DROP POLICY IF EXISTS "Enable update for users based on email" ON "users";
DROP POLICY IF EXISTS "Enable delete for users based on email" ON "users";

DROP POLICY IF EXISTS "Enable read access for all users" ON "tenant";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "tenant";
DROP POLICY IF EXISTS "Enable update for users based on email" ON "tenant";
DROP POLICY IF EXISTS "Enable delete for users based on email" ON "tenant";

-- Disable RLS on all tables
ALTER TABLE "accounts" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "jobs" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "locations" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "work_orders" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "tenant" DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('accounts', 'jobs', 'locations', 'work_orders', 'users', 'tenant');

-- Test query to verify access
SELECT COUNT(*) FROM "accounts";



