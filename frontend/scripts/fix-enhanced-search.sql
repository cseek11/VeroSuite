-- ============================================================================
-- FIX ENHANCED SEARCH FUNCTION
-- ============================================================================
-- Simplified version to fix the structure mismatch error

-- Drop the existing function first
DROP FUNCTION IF EXISTS search_customers_enhanced(text, uuid, integer, integer);

-- Create a simplified enhanced search function
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
DECLARE
  search_query tsquery;
  search_phone_digits text;
  has_phone_search boolean := false;
BEGIN
  -- Normalize search term
  p_search_term := trim(p_search_term);
  
  -- Extract phone digits if search term contains numbers
  search_phone_digits := regexp_replace(p_search_term, '[^0-9]', '', 'g');
  has_phone_search := length(search_phone_digits) >= 3;
  
  -- Create tsquery for full-text search
  search_query := plainto_tsquery('english', p_search_term);
  
  -- Return ranked results using a simpler approach
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
      -- Full-text search
      WHEN a.search_vector @@ search_query THEN ts_rank_cd(a.search_vector, search_query, 32)
      -- Fuzzy matching
      WHEN similarity(a.name_trigram, p_search_term) > 0.3 OR similarity(a.address_trigram, p_search_term) > 0.3 THEN 
        GREATEST(similarity(a.name_trigram, p_search_term), similarity(a.address_trigram, p_search_term))
      -- Fallback ILIKE
      ELSE 0.1
    END as relevance_score,
    CASE 
      WHEN has_phone_search AND a.phone_digits = search_phone_digits THEN 'phone_exact'
      WHEN has_phone_search AND a.phone_digits LIKE search_phone_digits || '%' THEN 'phone_starts'
      WHEN has_phone_search AND a.phone_digits LIKE '%' || search_phone_digits || '%' THEN 'phone_contains'
      WHEN a.search_vector @@ search_query THEN 'full_text'
      WHEN similarity(a.name_trigram, p_search_term) > 0.3 OR similarity(a.address_trigram, p_search_term) > 0.3 THEN 'fuzzy'
      ELSE 'fallback'
    END as match_type,
    a.created_at,
    a.updated_at
  FROM accounts a
  WHERE a.tenant_id = p_tenant_id
    AND (
      -- Phone search
      (has_phone_search AND a.phone_digits LIKE '%' || search_phone_digits || '%') OR
      -- Full-text search
      (a.search_vector @@ search_query) OR
      -- Fuzzy search
      (similarity(a.name_trigram, p_search_term) > 0.3 OR similarity(a.address_trigram, p_search_term) > 0.3) OR
      -- Fallback ILIKE
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
  RAISE NOTICE 'Enhanced search function fixed and ready for testing!';
END $$;



