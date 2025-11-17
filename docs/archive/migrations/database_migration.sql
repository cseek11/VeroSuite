-- Migration to add agreement and overdue tracking to accounts table
-- Run this in your Supabase SQL editor

-- Add new columns to accounts table
ALTER TABLE accounts 
ADD COLUMN IF NOT EXISTS agreements TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS overdue_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_payment_date DATE,
ADD COLUMN IF NOT EXISTS next_payment_date DATE,
ADD COLUMN IF NOT EXISTS agreement_status TEXT DEFAULT 'active' CHECK (agreement_status IN ('active', 'expired', 'cancelled', 'pending'));

-- Add index for better performance on agreement queries
CREATE INDEX IF NOT EXISTS idx_accounts_agreements ON accounts USING GIN (agreements);
CREATE INDEX IF NOT EXISTS idx_accounts_overdue ON accounts (overdue_days) WHERE overdue_days > 30;

-- Add comment to document the agreements column
COMMENT ON COLUMN accounts.agreements IS 'Array of active agreement types: annual_pest_control, monthly_pest_control, annual_termite_renewal, termite_bait_stations, rat_monitoring';
COMMENT ON COLUMN accounts.overdue_days IS 'Number of days past due for payment (0 = not overdue)';
COMMENT ON COLUMN accounts.agreement_status IS 'Status of the account agreements: active, expired, cancelled, pending';

-- Update RLS policy to include new columns
-- (This assumes RLS is already enabled on the accounts table)
-- The existing RLS policy should automatically apply to the new columns
