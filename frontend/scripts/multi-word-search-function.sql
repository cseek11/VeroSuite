-- Deploy the multi-word search function
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
BEGIN
  -- Normalize search term
  p_search_term := trim(p_search_term);
  
  -- Split search term into individual words
  search_terms := string_to_array(lower(p_search_term), ' ');
  
  -- Extract phone digits if search term contains numbers
  search_phone_digits := regexp_replace(p_search_term, '[^0-9]', '', 'g');
  has_phone_search := length(search_phone_digits) >= 3;
  
  -- Return ranked results using enhanced multi-word search
  RETURN QUERY
  WITH ranked_results AS (
    -- Strategy 1: Multi-word exact matches (highest priority)
    SELECT 
      a.id, a.name, a.email, a.phone, a.address, a.city, a.state, a.zip_code, a.status, a.account_type,
      1.0::float8 as relevance_score, 'multi_word_exact' as match_type,
      jsonb_build_object(
        'matched_terms', search_terms,
        'match_count', array_length(search_terms, 1),
        'field', 'name'
      ) as match_details,
      a.created_at, a.updated_at
    FROM accounts a
    WHERE a.tenant_id = p_tenant_id
      AND (
        SELECT count(*) = array_length(search_terms, 1)
        FROM unnest(search_terms) term 
        WHERE lower(a.name) LIKE '%' || term || '%'
      )
    
    UNION ALL
    
    -- Strategy 2: Multi-word partial matches (high priority)
    SELECT 
      a.id, a.name, a.email, a.phone, a.address, a.city, a.state, a.zip_code, a.status, a.account_type,
      0.8::float8 as relevance_score, 'multi_word_partial' as match_type,
      jsonb_build_object(
        'matched_terms', (SELECT array_agg(term) FROM unnest(search_terms) term WHERE lower(a.name) LIKE '%' || term || '%'),
        'match_count', (SELECT count(*) FROM unnest(search_terms) term WHERE lower(a.name) LIKE '%' || term || '%'),
        'total_terms', array_length(search_terms, 1),
        'field', 'name'
      ) as match_details,
      a.created_at, a.updated_at
    FROM accounts a
    WHERE a.tenant_id = p_tenant_id
      AND (
        SELECT count(*) 
        FROM unnest(search_terms) term 
        WHERE lower(a.name) LIKE '%' || term || '%'
      ) >= 2
      AND a.id NOT IN (
        SELECT a2.id FROM accounts a2
        WHERE a2.tenant_id = p_tenant_id
          AND (
            SELECT count(*) = array_length(search_terms, 1)
            FROM unnest(search_terms) term 
            WHERE lower(a2.name) LIKE '%' || term || '%'
          )
      )
    
    UNION ALL
    
    -- Strategy 3: Single word exact matches (medium priority)
    SELECT 
      a.id, a.name, a.email, a.phone, a.address, a.city, a.state, a.zip_code, a.status, a.account_type,
      0.6::float8 as relevance_score, 'single_word_exact' as match_type,
      jsonb_build_object(
        'matched_terms', (SELECT array_agg(term) FROM unnest(search_terms) term WHERE lower(a.name) LIKE '%' || term || '%'),
        'match_count', 1,
        'total_terms', array_length(search_terms, 1),
        'field', 'name'
      ) as match_details,
      a.created_at, a.updated_at
    FROM accounts a
    WHERE a.tenant_id = p_tenant_id
      AND (
        SELECT count(*) 
        FROM unnest(search_terms) term 
        WHERE lower(a.name) LIKE '%' || term || '%'
      ) = 1
      AND a.id NOT IN (
        SELECT a2.id FROM accounts a2
        WHERE a2.tenant_id = p_tenant_id
          AND (
            SELECT count(*) 
            FROM unnest(search_terms) term 
            WHERE lower(a2.name) LIKE '%' || term || '%'
          ) >= 2
      )
    
    UNION ALL
    
    -- Strategy 4: Phone number exact/partial match
    SELECT 
      a.id, a.name, a.email, a.phone, a.address, a.city, a.state, a.zip_code, a.status, a.account_type,
      CASE WHEN a.phone_digits = search_phone_digits THEN 0.9::float8 WHEN a.phone_digits LIKE search_phone_digits || '%' THEN 0.8::float8 WHEN a.phone_digits LIKE '%' || search_phone_digits || '%' THEN 0.7::float8 ELSE 0.6::float8 END as relevance_score,
      'phone' as match_type,
      jsonb_build_object(
        'matched_terms', search_phone_digits,
        'match_count', 1,
        'field', 'phone'
      ) as match_details,
      a.created_at, a.updated_at
    FROM accounts a
    WHERE a.tenant_id = p_tenant_id
      AND has_phone_search
      AND a.phone_digits LIKE '%' || search_phone_digits || '%'
      AND a.id NOT IN (
        SELECT a2.id FROM accounts a2
        WHERE a2.tenant_id = p_tenant_id
          AND (
            (SELECT count(*) FROM unnest(search_terms) term WHERE lower(a2.name) LIKE '%' || term || '%') >= 1
            OR (has_phone_search AND a2.phone_digits LIKE '%' || search_phone_digits || '%')
          )
      )
    
    UNION ALL
    
    -- Strategy 5: Email and address partial matches (lowest priority)
    SELECT 
      a.id, a.name, a.email, a.phone, a.address, a.city, a.state, a.zip_code, a.status, a.account_type,
      0.4::float8 as relevance_score, 'other_fields' as match_type,
      jsonb_build_object(
        'matched_terms', search_terms,
        'match_count', (SELECT count(*) FROM unnest(search_terms) term WHERE (lower(a.email) LIKE '%' || term || '%' OR lower(a.address) LIKE '%' || term || '%' OR lower(a.city) LIKE '%' || term || '%' OR lower(a.state) LIKE '%' || term || '%')),
        'field', 'email_address_city_state'
      ) as match_details,
      a.created_at, a.updated_at
    FROM accounts a
    WHERE a.tenant_id = p_tenant_id
      AND (
        SELECT count(*) 
        FROM unnest(search_terms) term 
        WHERE (
          lower(a.email) LIKE '%' || term || '%' OR
          lower(a.address) LIKE '%' || term || '%' OR
          lower(a.city) LIKE '%' || term || '%' OR
          lower(a.state) LIKE '%' || term || '%'
        )
      ) >= 1
      AND a.id NOT IN (
        SELECT a2.id FROM accounts a2
        WHERE a2.tenant_id = p_tenant_id
          AND (
            (SELECT count(*) FROM unnest(search_terms) term WHERE lower(a2.name) LIKE '%' || term || '%') >= 1
            OR (has_phone_search AND a2.phone_digits LIKE '%' || search_phone_digits || '%')
          )
      )
  )
  SELECT DISTINCT ON (r.id)
    r.id, r.name, r.email, r.phone, r.address, r.city, r.state, r.zip_code, 
    r.status, r.account_type, r.relevance_score, r.match_type, r.match_details, r.created_at, r.updated_at
  FROM ranked_results r
  ORDER BY r.id, r.relevance_score DESC, r.name ASC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION search_customers_multi_word(text, uuid, integer, integer) TO authenticated;
