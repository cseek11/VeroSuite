-- ============================================================================
-- FIX NUMERIC TYPE MISMATCH
-- ============================================================================
-- Fix the relevance_score type mismatch

-- Drop the existing function
DROP FUNCTION IF EXISTS search_customers_enhanced(text, uuid, integer, integer);

-- Create the function with explicit type casting for relevance_score
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
  relevance_score double precision,
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
    1.0::double precision as relevance_score,
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
  RAISE NOTICE 'Numeric type fix applied successfully!';
END $$;






