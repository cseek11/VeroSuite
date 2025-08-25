-- Fix RLS Policies for Agreements and Payments Tables
-- This script adds the necessary RLS policies to allow access to agreements and payments

-- First, let's check the current RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('agreements', 'payments');

-- Enable RLS on agreements table (if not already enabled)
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;

-- Enable RLS on payments table (if not already enabled)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON agreements;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON agreements;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON agreements;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON agreements;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON payments;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON payments;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON payments;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON payments;

-- Create policies for agreements table
CREATE POLICY "Enable read access for authenticated users" ON agreements
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        tenant_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid())
    );

CREATE POLICY "Enable insert access for authenticated users" ON agreements
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        tenant_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid())
    );

CREATE POLICY "Enable update access for authenticated users" ON agreements
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND 
        tenant_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid())
    );

CREATE POLICY "Enable delete access for authenticated users" ON agreements
    FOR DELETE USING (
        auth.role() = 'authenticated' AND 
        tenant_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid())
    );

-- Create policies for payments table
CREATE POLICY "Enable read access for authenticated users" ON payments
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        tenant_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid())
    );

CREATE POLICY "Enable insert access for authenticated users" ON payments
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        tenant_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid())
    );

CREATE POLICY "Enable update access for authenticated users" ON payments
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND 
        tenant_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid())
    );

CREATE POLICY "Enable delete access for authenticated users" ON payments
    FOR DELETE USING (
        auth.role() = 'authenticated' AND 
        tenant_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid())
    );

-- Verify the policies were created
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
WHERE tablename IN ('agreements', 'payments')
ORDER BY tablename, policyname;

-- Test query to verify access works
SELECT 
    'agreements' as table_name,
    COUNT(*) as record_count
FROM agreements 
WHERE tenant_id = 'fb39f15b-b382-4525-8404-1e32ca1486c9'

UNION ALL

SELECT 
    'payments' as table_name,
    COUNT(*) as record_count
FROM payments 
WHERE tenant_id = 'fb39f15b-b382-4525-8404-1e32ca1486c9';
