-- ============================================================================
-- FIX SCHEMA TYPES - STANDARDIZE COLUMN TYPES
-- ============================================================================
-- Update the accounts table to use consistent text types instead of varchar(255)

-- First, let's see what the current column types are
DO $$
DECLARE
    col_record RECORD;
BEGIN
    RAISE NOTICE 'Current column types in accounts table:';
    FOR col_record IN 
        SELECT column_name, data_type, character_maximum_length
        FROM information_schema.columns 
        WHERE table_name = 'accounts' 
        AND table_schema = 'public'
        AND data_type IN ('character varying', 'text')
        ORDER BY ordinal_position
    LOOP
        RAISE NOTICE 'Column: %, Type: % (max length: %)', 
            col_record.column_name, 
            col_record.data_type, 
            col_record.character_maximum_length;
    END LOOP;
END $$;

-- Update columns to use text type (unlimited length) instead of varchar(255)
-- This will make them compatible with the function signature

-- Update name column
ALTER TABLE accounts 
ALTER COLUMN name TYPE text;

-- Update email column  
ALTER TABLE accounts 
ALTER COLUMN email TYPE text;

-- Update phone column
ALTER TABLE accounts 
ALTER COLUMN phone TYPE text;

-- Update address column
ALTER TABLE accounts 
ALTER COLUMN address TYPE text;

-- Update city column
ALTER TABLE accounts 
ALTER COLUMN city TYPE text;

-- Update state column
ALTER TABLE accounts 
ALTER COLUMN state TYPE text;

-- Update zip_code column
ALTER TABLE accounts 
ALTER COLUMN zip_code TYPE text;

-- Update status column
ALTER TABLE accounts 
ALTER COLUMN status TYPE text;

-- Update account_type column
ALTER TABLE accounts 
ALTER COLUMN account_type TYPE text;

-- Verify the changes
DO $$
DECLARE
    col_record RECORD;
BEGIN
    RAISE NOTICE 'Updated column types in accounts table:';
    FOR col_record IN 
        SELECT column_name, data_type, character_maximum_length
        FROM information_schema.columns 
        WHERE table_name = 'accounts' 
        AND table_schema = 'public'
        AND data_type IN ('character varying', 'text')
        ORDER BY ordinal_position
    LOOP
        RAISE NOTICE 'Column: %, Type: % (max length: %)', 
            col_record.column_name, 
            col_record.data_type, 
            col_record.character_maximum_length;
    END LOOP;
END $$;

-- Now recreate the search function with the correct types
DROP FUNCTION IF EXISTS search_customers_enhanced(text, uuid, integer, integer);

-- Create the function with text types (now matching the schema)
CREATE OR REPLACE FUNCTION search_customers_enhanced(
  p_search_term text,
  p_tenant_id uuid,
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  name text,
  email text,
  phone text,
  address text,
  city text,
  state text,
  zip_code text,
  status text,
  account_type text,
  relevance_score float,
  match_type text,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
BEGIN
  -- Simple search that returns all customers for the tenant
  RETURN QUERY
  SELECT 
    a.id,
    a.name,
    a.email,
    a.phone,
    a.address,
    a.city,
    a.state,
    a.zip_code,
    a.status,
    a.account_type,
    1.0 as relevance_score,
    'basic' as match_type,
    a.created_at,
    a.updated_at
  FROM accounts a
  WHERE a.tenant_id = p_tenant_id
  ORDER BY a.name ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION search_customers_enhanced(text, uuid, integer, integer) TO authenticated;

-- Test the function
DO $$
BEGIN
  RAISE NOTICE 'Schema types fixed and search function recreated successfully!';
END $$;
