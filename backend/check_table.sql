-- Check if customer_notes table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'customer_notes';

-- Show table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'customer_notes'
ORDER BY ordinal_position;

-- Test inserting a sample note
INSERT INTO customer_notes (
    tenant_id, 
    customer_id, 
    note_type, 
    note_source, 
    note_content, 
    created_by, 
    priority, 
    is_internal
) VALUES (
    'fb39f15b-b382-4525-8404-1e32ca1486c9'::uuid,
    'e5c6914c-9fe0-47c9-8cfb-9a9663c835cf'::uuid,
    'internal',
    'office',
    'Test note from SQL',
    'Christopher Seek',
    'low',
    true
) RETURNING *;
