-- Temporarily disable RLS to test if that's causing the issue
ALTER TABLE customer_notes DISABLE ROW LEVEL SECURITY;

-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'customer_notes';








