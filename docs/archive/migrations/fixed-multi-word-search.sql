-- Fixed multi-word search function with improved logic
CREATE OR REPLACE FUNCTION search_customers_multi_word(
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
  relevance_score float8,
  match_type text,
  match_details jsonb,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
DECLARE
  search_terms text[];
  search_phone_digits text;
  has_phone_search boolean := false;
  terms_count integer;
BEGIN
  -- Normalize search term
  p_search_term := trim(p_search_term);
  
  -- Split search term into individual words
  search_terms := string_to_array(lower(p_search_term), ' ');
  terms_count := array_length(search_terms, 1);
  
  -- Extract phone digits if search term contains numbers
  search_phone_digits := regexp_replace(p_search_term, '[^0-9]', '', 'g');
  has_phone_search := length(search_phone_digits) >= 3;
  
  -- Return ranked results using simplified multi-word search
  RETURN QUERY
  WITH matched_accounts AS (
    SELECT 
      a.id, a.name, a.email, a.phone, a.address, a.city, a.state, a.zip_code, 
      a.status, a.account_type, a.created_at, a.updated_at,
      -- Count how many search terms match the name
      (SELECT count(*) 
       FROM unnest(search_terms) term 
       WHERE lower(a.name) LIKE '%' || term || '%') as name_matches,
      -- Count how many search terms match other fields
      (SELECT count(*) 
       FROM unnest(search_terms) term 
       WHERE (lower(a.email) LIKE '%' || term || '%' 
              OR lower(a.address) LIKE '%' || term || '%' 
              OR lower(a.city) LIKE '%' || term || '%'
              OR lower(a.state) LIKE '%' || term || '%')) as other_matches,
      -- Check phone match
      CASE 
        WHEN has_phone_search AND a.phone_digits LIKE '%' || search_phone_digits || '%' THEN 1
        ELSE 0
      END as phone_matches
    FROM accounts a
    WHERE a.tenant_id = p_tenant_id
  ),
  ranked_results AS (
    SELECT 
      m.*,
      CASE 
        -- All terms match name (highest priority)
        WHEN m.name_matches = terms_count THEN 1.0::float8
        -- Most terms match name 
        WHEN m.name_matches >= GREATEST(2, terms_count - 1) THEN 0.9::float8
        -- Some terms match name
        WHEN m.name_matches >= 1 THEN 0.7::float8
        -- Phone exact match
        WHEN m.phone_matches = 1 AND has_phone_search THEN 0.8::float8
        -- Other field matches
        WHEN m.other_matches >= 1 THEN 0.4::float8
        ELSE 0.0::float8
      END as relevance_score,
      CASE 
        WHEN m.name_matches = terms_count THEN 'multi_word_exact'
        WHEN m.name_matches >= 2 THEN 'multi_word_partial'
        WHEN m.name_matches = 1 THEN 'single_word_exact'
        WHEN m.phone_matches = 1 THEN 'phone'
        ELSE 'other_fields'
      END as match_type,
      jsonb_build_object(
        'matched_terms', search_terms,
        'name_matches', m.name_matches,
        'other_matches', m.other_matches,
        'phone_matches', m.phone_matches,
        'total_terms', terms_count,
        'field', CASE 
          WHEN m.name_matches >= 1 THEN 'name'
          WHEN m.phone_matches = 1 THEN 'phone'
          ELSE 'other'
        END
      ) as match_details
    FROM matched_accounts m
    WHERE 
      m.name_matches >= 1 
      OR (has_phone_search AND m.phone_matches = 1)
      OR m.other_matches >= 1
  )
  SELECT 
    r.id, r.name, r.email, r.phone, r.address, r.city, r.state, r.zip_code,
    r.status, r.account_type, r.relevance_score, r.match_type, r.match_details,
    r.created_at, r.updated_at
  FROM ranked_results r
  WHERE r.relevance_score > 0
  ORDER BY r.relevance_score DESC, r.name ASC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION search_customers_multi_word(text, uuid, integer, integer) TO authenticated;





































