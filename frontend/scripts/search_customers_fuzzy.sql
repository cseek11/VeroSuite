-- ============================================================================
-- search_customers_fuzzy: Fuzzy customer search with pg_trgm similarity
-- Requirements: pg_trgm extension enabled
-- Tenant-isolated, safe ordering and limit
-- ============================================================================

CREATE OR REPLACE FUNCTION search_customers_fuzzy(
  p_tenant_id uuid,
  p_query text,
  p_threshold double precision DEFAULT 0.3,
  p_limit integer DEFAULT 50
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
  match_details jsonb,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
DECLARE
  q text := trim(lower(coalesce(p_query, '')));
  v_phone_digits text := regexp_replace(q, '[^0-9]', '', 'g');
  v_has_digits boolean := length(v_phone_digits) >= 3;
BEGIN
  IF q = '' THEN
    RETURN;
  END IF;

  -- pg_trgm threshold is enforced via explicit comparisons below; no global set_limit needed

  RETURN QUERY
  WITH base AS (
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
      a.created_at,
      a.updated_at,
      -- Similarities (0..1)
      similarity(lower(a.name), q)                 AS sim_name,
      similarity(lower(coalesce(a.email, '')), q)  AS sim_email,
      GREATEST(
        similarity(lower(coalesce(a.address, '')), q),
        similarity(lower(coalesce(a.city, '')), q),
        similarity(lower(coalesce(a.state, '')), q),
        similarity(lower(coalesce(a.zip_code, '')), q)
      ) AS sim_location,
      CASE WHEN v_has_digits AND regexp_replace(coalesce(a.phone, ''), '[^0-9]', '', 'g') LIKE '%' || v_phone_digits || '%'
           THEN 1.0 ELSE 0.0 END                  AS sim_phone_digits
    FROM accounts a
    WHERE a.tenant_id = p_tenant_id
  ), scored AS (
    SELECT 
      b.*,
      -- Weighted relevance. Tune as needed.
      (
        (b.sim_name * 0.8) +
        (b.sim_email * 0.5) +
        (b.sim_location * 0.6) +
        (b.sim_phone_digits * 1.0)
      ) AS relevance
    FROM base b
  )
  SELECT
    s.id,
    s.name,
    s.email,
    s.phone,
    s.address,
    s.city,
    s.state,
    s.zip_code,
    s.status,
    s.account_type,
    s.relevance AS relevance_score,
    CASE 
      WHEN s.sim_name >= p_threshold THEN 'fuzzy'
      WHEN s.sim_phone_digits > 0 THEN 'phone'
      WHEN s.sim_location >= p_threshold THEN 'fuzzy'
      WHEN s.sim_email >= p_threshold THEN 'fuzzy'
      ELSE 'fallback'
    END AS match_type,
    jsonb_build_object(
      'query', q,
      'phone_digits', v_phone_digits,
      'sim_name', s.sim_name,
      'sim_email', s.sim_email,
      'sim_location', s.sim_location,
      'sim_phone_digits', s.sim_phone_digits,
      'threshold', p_threshold
    ) AS match_details,
    s.created_at,
    s.updated_at
  FROM scored s
  WHERE 
    s.relevance >= p_threshold
    OR (v_has_digits AND s.sim_phone_digits > 0)
  ORDER BY s.relevance DESC, s.name ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

GRANT EXECUTE ON FUNCTION search_customers_fuzzy(uuid, text, double precision, integer) TO authenticated;


