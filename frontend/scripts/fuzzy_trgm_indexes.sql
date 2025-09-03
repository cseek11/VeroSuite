-- ============================================================================
-- Trigram indexes to accelerate fuzzy search (pg_trgm)
-- Safe to run multiple times; checks for existing indexes
-- ============================================================================

-- Ensure pg_trgm extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = 'idx_accounts_name_trgm'
  ) THEN
    EXECUTE 'CREATE INDEX idx_accounts_name_trgm ON accounts USING gin (lower(name) gin_trgm_ops)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = 'idx_accounts_email_trgm'
  ) THEN
    EXECUTE 'CREATE INDEX idx_accounts_email_trgm ON accounts USING gin (lower(email) gin_trgm_ops)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = 'idx_accounts_address_trgm'
  ) THEN
    EXECUTE 'CREATE INDEX idx_accounts_address_trgm ON accounts USING gin (lower(address) gin_trgm_ops)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = 'idx_accounts_city_trgm'
  ) THEN
    EXECUTE 'CREATE INDEX idx_accounts_city_trgm ON accounts USING gin (lower(city) gin_trgm_ops)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = 'idx_accounts_state_trgm'
  ) THEN
    EXECUTE 'CREATE INDEX idx_accounts_state_trgm ON accounts USING gin (lower(state) gin_trgm_ops)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = 'idx_accounts_zip_trgm'
  ) THEN
    EXECUTE 'CREATE INDEX idx_accounts_zip_trgm ON accounts USING gin (lower(zip_code) gin_trgm_ops)';
  END IF;
END$$;




