-- Debug permissions issue
-- Run this in your Supabase SQL Editor

-- Check current user and role
SELECT current_user, current_setting('role');

-- Check if anon role exists and has permissions
SELECT rolname, rolsuper, rolinherit, rolcreaterole, rolcreatedb, rolcanlogin
FROM pg_roles 
WHERE rolname IN ('anon', 'authenticated', 'postgres');

-- Check schema permissions
SELECT nspname, nspowner, nspacl
FROM pg_namespace 
WHERE nspname = 'public';

-- Check table permissions for anon role
SELECT schemaname, tablename, tableowner, hasinsert, hasselect, hasupdate, hasdelete
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'accounts';

-- Check if anon role can access the table
SELECT has_table_privilege('anon', 'accounts', 'SELECT') as anon_select,
       has_table_privilege('anon', 'accounts', 'INSERT') as anon_insert,
       has_table_privilege('anon', 'accounts', 'UPDATE') as anon_update,
       has_table_privilege('anon', 'accounts', 'DELETE') as anon_delete;

-- Check if authenticated role can access the table
SELECT has_table_privilege('authenticated', 'accounts', 'SELECT') as auth_select,
       has_table_privilege('authenticated', 'accounts', 'INSERT') as auth_insert,
       has_table_privilege('authenticated', 'accounts', 'UPDATE') as auth_update,
       has_table_privilege('authenticated', 'accounts', 'DELETE') as auth_delete;

-- Grant schema usage to anon and authenticated
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant all permissions on all tables to anon and authenticated
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant all permissions on all sequences to anon and authenticated
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant all permissions on all functions to anon and authenticated
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Set default permissions for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;

-- Test query as anon role
SET ROLE anon;
SELECT COUNT(*) FROM "accounts";
RESET ROLE;


