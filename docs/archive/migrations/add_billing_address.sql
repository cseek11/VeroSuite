-- Add billing_address column to accounts table
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS billing_address JSONB;






