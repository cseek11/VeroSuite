-- Check the current RLS policy
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'customer_notes';

-- Test the JWT claims setting
SELECT current_setting('request.jwt.claims', true) as jwt_claims;

-- Temporarily disable RLS to test if that's the issue
ALTER TABLE customer_notes DISABLE ROW LEVEL SECURITY;

-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'customer_notes';

