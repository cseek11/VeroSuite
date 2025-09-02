-- Drop the existing table and recreate it properly
DROP TABLE IF EXISTS customer_notes;

-- Create customer_notes table with proper UUID generation
CREATE TABLE customer_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    customer_id UUID NOT NULL,
    note_type VARCHAR(50) NOT NULL,
    note_source VARCHAR(50) NOT NULL,
    note_content TEXT NOT NULL,
    created_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    priority VARCHAR(20) DEFAULT 'low',
    is_alert BOOLEAN DEFAULT false,
    is_internal BOOLEAN DEFAULT false,
    technician_id UUID,
    work_order_id UUID,
    location_coords VARCHAR(100)
);

-- Create unique constraint
CREATE UNIQUE INDEX customer_notes_tenant_id_unique ON customer_notes (tenant_id, id);

-- Create indexes for better performance
CREATE INDEX customer_notes_customer_id_idx ON customer_notes (customer_id);
CREATE INDEX customer_notes_tenant_id_idx ON customer_notes (tenant_id);
CREATE INDEX customer_notes_created_at_idx ON customer_notes (created_at);
CREATE INDEX customer_notes_is_internal_idx ON customer_notes (is_internal);

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





