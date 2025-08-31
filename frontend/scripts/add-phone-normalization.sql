-- ============================================================================
-- PHONE NUMBER NORMALIZATION & SEARCH IMPROVEMENTS
-- ============================================================================
-- This script adds phone number normalization and improves search performance

-- 1. Add phone_digits column for normalized phone numbers
ALTER TABLE accounts 
ADD COLUMN IF NOT EXISTS phone_digits TEXT;

-- 2. Create function to normalize phone numbers
CREATE OR REPLACE FUNCTION normalize_phone(phone TEXT)
RETURNS TEXT AS $$
BEGIN
  IF phone IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN regexp_replace(phone, '[^0-9]', '', 'g');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. Update existing phone_digits with normalized values
UPDATE accounts 
SET phone_digits = normalize_phone(phone)
WHERE phone IS NOT NULL AND phone_digits IS NULL;

-- 4. Create trigger to automatically update phone_digits
CREATE OR REPLACE FUNCTION update_phone_digits()
RETURNS TRIGGER AS $$
BEGIN
  NEW.phone_digits = normalize_phone(NEW.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS trigger_update_phone_digits ON accounts;

-- Create trigger
CREATE TRIGGER trigger_update_phone_digits
  BEFORE INSERT OR UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_phone_digits();

-- 5. Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_accounts_phone_digits ON accounts(phone_digits);
CREATE INDEX IF NOT EXISTS idx_accounts_name_lower ON accounts(LOWER(name));
CREATE INDEX IF NOT EXISTS idx_accounts_email_lower ON accounts(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_accounts_address_lower ON accounts(LOWER(address));
CREATE INDEX IF NOT EXISTS idx_accounts_city_lower ON accounts(LOWER(city));
CREATE INDEX IF NOT EXISTS idx_accounts_state_lower ON accounts(LOWER(state));

-- 6. Create GIN index for full-text search (if pg_trgm extension is available)
-- Uncomment if you have the pg_trgm extension enabled:
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE INDEX IF NOT EXISTS idx_accounts_name_trgm ON accounts USING GIN (name gin_trgm_ops);
-- CREATE INDEX IF NOT EXISTS idx_accounts_address_trgm ON accounts USING GIN (address gin_trgm_ops);

-- 7. Create composite index for common search patterns
CREATE INDEX IF NOT EXISTS idx_accounts_search_composite 
ON accounts(tenant_id, status, account_type);

-- 8. Add comments for documentation
COMMENT ON COLUMN accounts.phone_digits IS 'Normalized phone number (digits only) for improved search performance';
COMMENT ON INDEX idx_accounts_phone_digits IS 'Index for phone number search by digits';
COMMENT ON INDEX idx_accounts_search_composite IS 'Composite index for common search patterns';
