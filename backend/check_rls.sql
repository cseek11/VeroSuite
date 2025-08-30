-- Check if RLS is enabled on customer_notes table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'customer_notes';

-- Enable RLS on customer_notes table
ALTER TABLE customer_notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for customer_notes
CREATE POLICY "Users can view their own tenant's customer notes" ON customer_notes
    FOR ALL USING (
        tenant_id::text = current_setting('request.jwt.claims', true)::json->>'tenant_id'
    );

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'customer_notes';

-- Test the policy by setting the JWT claim
SET request.jwt.claims = '{"tenant_id": "fb39f15b-b382-4525-8404-1e32ca1486c9"}';

-- Try to select from the table
SELECT * FROM customer_notes;

