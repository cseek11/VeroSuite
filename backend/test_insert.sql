-- Test direct insertion with explicit UUID generation
INSERT INTO customer_notes (
    id,
    tenant_id, 
    customer_id, 
    note_type, 
    note_source, 
    note_content, 
    created_by, 
    priority, 
    is_internal
) VALUES (
    gen_random_uuid(),
    'fb39f15b-b382-4525-8404-1e32ca1486c9'::uuid,
    'e5c6914c-9fe0-47c9-8cfb-9a9663c835cf'::uuid,
    'internal',
    'office',
    'Test note with explicit UUID',
    'Christopher Seek',
    'low',
    true
) RETURNING *;

-- Check all notes in the table
SELECT * FROM customer_notes ORDER BY created_at DESC;








