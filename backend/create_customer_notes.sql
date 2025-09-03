-- Create customer_notes table manually
CREATE TABLE IF NOT EXISTS customer_notes (
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
CREATE UNIQUE INDEX IF NOT EXISTS customer_notes_tenant_id_unique ON customer_notes (tenant_id, id);

-- Add foreign key constraints (if accounts table exists)
-- ALTER TABLE customer_notes ADD CONSTRAINT customer_notes_account_fkey 
-- FOREIGN KEY (tenant_id, customer_id) REFERENCES accounts(tenant_id, id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS customer_notes_customer_id_idx ON customer_notes (customer_id);
CREATE INDEX IF NOT EXISTS customer_notes_tenant_id_idx ON customer_notes (tenant_id);
CREATE INDEX IF NOT EXISTS customer_notes_created_at_idx ON customer_notes (created_at);
CREATE INDEX IF NOT EXISTS customer_notes_is_internal_idx ON customer_notes (is_internal);








