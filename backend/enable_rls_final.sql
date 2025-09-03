-- Re-enable RLS on customer_notes table
ALTER TABLE customer_notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own tenant's customer notes" ON customer_notes;

-- Create comprehensive RLS policy for customer_notes
CREATE POLICY "Users can manage their own tenant's customer notes" ON customer_notes
    FOR ALL USING (
        tenant_id::text = current_setting('request.jwt.claims', true)::json->>'tenant_id'
    );

-- Check RLS status and policies
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'customer_notes';

SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'customer_notes';








