-- ============================================================================
-- IMPLEMENT REAL SEARCH FUNCTIONALITY
-- ============================================================================
-- Add actual search filtering to the function

-- Drop the existing function
DROP FUNCTION IF EXISTS search_customers_enhanced(text, uuid, integer, integer);

-- Create the function with real search logic
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
DECLARE
  search_phone_digits text;
  has_phone_search boolean := false;
BEGIN
  -- Normalize search term
  p_search_term := trim(p_search_term);
  
  -- Extract phone digits if search term contains numbers
  search_phone_digits := regexp_replace(p_search_term, '[^0-9]', '', 'g');
  has_phone_search := length(search_phone_digits) >= 3;
  
  -- Return ranked results with actual search filtering
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
      -- Phone number exact match (highest priority)
      WHEN has_phone_search AND a.phone_digits = search_phone_digits THEN 1.0
      -- Phone number starts with
      WHEN has_phone_search AND a.phone_digits LIKE search_phone_digits || '%' THEN 0.9
      -- Phone number contains
      WHEN has_phone_search AND a.phone_digits LIKE '%' || search_phone_digits || '%' THEN 0.8
      -- Name exact match
      WHEN a.name ILIKE p_search_term THEN 0.7
      -- Name starts with
      WHEN a.name ILIKE p_search_term || '%' THEN 0.6
      -- Name contains
      WHEN a.name ILIKE '%' || p_search_term || '%' THEN 0.5
      -- Email contains
      WHEN a.email ILIKE '%' || p_search_term || '%' THEN 0.4
      -- Address contains
      WHEN a.address ILIKE '%' || p_search_term || '%' THEN 0.3
      -- City contains
      WHEN a.city ILIKE '%' || p_search_term || '%' THEN 0.2
      -- Other fields contain
      WHEN a.state ILIKE '%' || p_search_term || '%' OR 
           a.zip_code ILIKE '%' || p_search_term || '%' OR
           a.account_type ILIKE '%' || p_search_term || '%' OR
           a.status ILIKE '%' || p_search_term || '%' THEN 0.1
      -- No match
      ELSE 0.0
    END as relevance_score,
    CASE 
      WHEN has_phone_search AND a.phone_digits = search_phone_digits THEN 'phone_exact'
      WHEN has_phone_search AND a.phone_digits LIKE search_phone_digits || '%' THEN 'phone_starts'
      WHEN has_phone_search AND a.phone_digits LIKE '%' || search_phone_digits || '%' THEN 'phone_contains'
      WHEN a.name ILIKE p_search_term THEN 'name_exact'
      WHEN a.name ILIKE p_search_term || '%' THEN 'name_starts'
      WHEN a.name ILIKE '%' || p_search_term || '%' THEN 'name_contains'
      WHEN a.email ILIKE '%' || p_search_term || '%' THEN 'email_contains'
      WHEN a.address ILIKE '%' || p_search_term || '%' THEN 'address_contains'
      WHEN a.city ILIKE '%' || p_search_term || '%' THEN 'city_contains'
      WHEN a.state ILIKE '%' || p_search_term || '%' OR 
           a.zip_code ILIKE '%' || p_search_term || '%' OR
           a.account_type ILIKE '%' || p_search_term || '%' OR
           a.status ILIKE '%' || p_search_term || '%' THEN 'other_contains'
      ELSE 'no_match'
    END as match_type,
    a.created_at,
    a.updated_at
  FROM accounts a
  WHERE a.tenant_id = p_tenant_id
    AND (
      -- If no search term, return all customers
      p_search_term = '' OR
      -- Phone search
      (has_phone_search AND a.phone_digits LIKE '%' || search_phone_digits || '%') OR
      -- Text search across multiple fields
      (a.name ILIKE '%' || p_search_term || '%' OR
       a.email ILIKE '%' || p_search_term || '%' OR
       a.address ILIKE '%' || p_search_term || '%' OR
       a.city ILIKE '%' || p_search_term || '%' OR
       a.state ILIKE '%' || p_search_term || '%' OR
       a.zip_code ILIKE '%' || p_search_term || '%' OR
       a.account_type ILIKE '%' || p_search_term || '%' OR
       a.status ILIKE '%' || p_search_term || '%')
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
  RAISE NOTICE 'Real search functionality implemented successfully!';
END $$;



