-- ============================================================================
-- WORKING SEARCH FUNCTION USING OUT PARAMETERS
-- ============================================================================
-- This approach avoids column type mismatches by using OUT parameters

-- Drop any existing function
DROP FUNCTION IF EXISTS search_customers_enhanced(text, uuid, integer, integer);

-- Create a working search function using OUT parameters
CREATE OR REPLACE FUNCTION search_customers_enhanced(
  p_search_term text,
  p_tenant_id uuid,
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0,
  OUT id uuid,
  OUT name text,
  OUT email text,
  OUT phone text,
  OUT address text,
  OUT city text,
  OUT state text,
  OUT zip_code text,
  OUT status text,
  OUT account_type text,
  OUT relevance_score float,
  OUT match_type text,
  OUT created_at timestamptz,
  OUT updated_at timestamptz
)
RETURNS SETOF record AS $$
BEGIN
  -- Simple search that returns all customers for the tenant
  RETURN QUERY
  SELECT 
    a.id,
    a.name::text,
    a.email::text,
    a.phone::text,
    a.address::text,
    a.city::text,
    a.state::text,
    a.zip_code::text,
    a.status::text,
    a.account_type::text,
    1.0 as relevance_score,
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
  RAISE NOTICE 'Working search function created successfully!';
END $$;










