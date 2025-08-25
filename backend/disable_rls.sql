-- Temporarily disable RLS for development
-- Run this in your Supabase SQL Editor

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



