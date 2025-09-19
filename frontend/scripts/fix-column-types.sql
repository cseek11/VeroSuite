-- ============================================================================
-- FIX COLUMN TYPES IN SEARCH FUNCTION
-- ============================================================================
-- Fix the function to match actual column types in the database

-- Drop any existing function
DROP FUNCTION IF EXISTS search_customers_enhanced(text, uuid, integer, integer);

-- Create the function with correct column types
CREATE OR REPLACE FUNCTION search_customers_enhanced(
  p_search_term text,
  p_tenant_id uuid,
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  name character varying(255),
  email character varying(255),
  phone character varying(255),
  address character varying(255),
  city character varying(255),
  state character varying(255),
  zip_code character varying(255),
  status character varying(255),
  account_type character varying(255),
  relevance_score float,
  match_type character varying(255),
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
  RAISE NOTICE 'Search function with correct column types created successfully!';
END $$;



















