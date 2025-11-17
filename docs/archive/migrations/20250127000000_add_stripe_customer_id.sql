-- Migration: Add stripe_customer_id to accounts table
-- Date: 2025-01-27
-- Purpose: Store Stripe customer IDs for reuse in recurring payments

-- Add stripe_customer_id column to accounts table
ALTER TABLE accounts 
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_accounts_stripe_customer_id 
ON accounts(stripe_customer_id) 
WHERE stripe_customer_id IS NOT NULL;

-- Add comment
COMMENT ON COLUMN accounts.stripe_customer_id IS 'Stripe customer ID for recurring payments and payment processing';

