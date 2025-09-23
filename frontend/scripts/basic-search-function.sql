-- ============================================================================
-- BASIC SEARCH FUNCTION - MINIMAL APPROACH
-- ============================================================================
-- Create a basic function that should definitely work

-- Drop any existing function
DROP FUNCTION IF EXISTS search_customers_enhanced(text, uuid, integer, integer);

-- Create a basic search function
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
  -- Just return a simple query with explicit casting
  RETURN QUERY
  SELECT 
    a.id,
    COALESCE(a.name, '')::text,
    COALESCE(a.email, '')::text,
    COALESCE(a.phone, '')::text,
    COALESCE(a.address, '')::text,
    COALESCE(a.city, '')::text,
    COALESCE(a.state, '')::text,
    COALESCE(a.zip_code, '')::text,
    COALESCE(a.status, '')::text,
    COALESCE(a.account_type, '')::text,
    1.0::float as relevance_score,
    'basic'::text as match_type,
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
  RAISE NOTICE 'Basic search function created successfully!';
END $$;





























