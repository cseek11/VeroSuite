-- ============================================================================
-- SIMPLE WORKING SEARCH FUNCTION
-- ============================================================================
-- A simple but working search function

-- Drop the existing function
DROP FUNCTION IF EXISTS search_customers_enhanced(text, uuid, integer, integer);

-- Create a simple working sear
ch function
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
  -- Simple search that actually filters results
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
    CASE 
      WHEN p_search_term = '' THEN 1.0::double precision
      WHEN a.name ILIKE '%' || p_search_term || '%' THEN 0.8::double precision
      WHEN a.phone ILIKE '%' || p_search_term || '%' THEN 0.7::double precision
      WHEN a.address ILIKE '%' || p_search_term || '%' THEN 0.6::double precision
      WHEN a.email ILIKE '%' || p_search_term || '%' THEN 0.5::double precision
      ELSE 0.1::double precision
    END as relevance_score,
    CASE 
      WHEN p_search_term = '' THEN 'all'
      WHEN a.name ILIKE '%' || p_search_term || '%' THEN 'name_match'
      WHEN a.phone ILIKE '%' || p_search_term || '%' THEN 'phone_match'
      WHEN a.address ILIKE '%' || p_search_term || '%' THEN 'address_match'
      WHEN a.email ILIKE '%' || p_search_term || '%' THEN 'email_match'
      ELSE 'other_match'
    END as match_type,
    a.created_at,
    a.updated_at
  FROM accounts a
  WHERE a.tenant_id = p_tenant_id
    AND (
      p_search_term = '' OR
      a.name ILIKE '%' || p_search_term || '%' OR
      a.phone ILIKE '%' || p_search_term || '%' OR
      a.address ILIKE '%' || p_search_term || '%' OR
      a.email ILIKE '%' || p_search_term || '%'
    )
  ORDER BY relevance_score DESC, a.name ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION search_customers_enhanced(text, uuid, integer, integer) TO authenticated;

-- Test the function
DO $$
BEGIN
  RAISE NOTICE 'Simple working search function created successfully!';
END $$;



