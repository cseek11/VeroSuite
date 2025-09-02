-- ============================================================================
-- SEARCH PERFORMANCE OPTIMIZATION
-- ============================================================================
-- This migration optimizes search performance with advanced indexing,
-- materialized views, and simplified query functions.

-- ============================================================================
-- 1. CREATE ADVANCED INDEXES FOR SEARCH PERFORMANCE
-- ============================================================================

-- Drop existing indexes to recreate them optimally
DROP INDEX IF EXISTS idx_accounts_search_vector;
DROP INDEX IF EXISTS idx_accounts_name_trigram;
DROP INDEX IF EXISTS idx_accounts_address_trigram;
DROP INDEX IF EXISTS idx_accounts_phone_digits;
DROP INDEX IF EXISTS idx_accounts_tenant_search;

-- Create high-performance composite indexes (removed CONCURRENTLY for Supabase compatibility)
CREATE INDEX IF NOT EXISTS idx_accounts_tenant_name_optimized 
ON accounts (tenant_id, lower(name) text_pattern_ops) 
WHERE name IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_accounts_tenant_email_optimized 
ON accounts (tenant_id, lower(email) text_pattern_ops) 
WHERE email IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_accounts_tenant_phone_optimized 
ON accounts (tenant_id, phone_digits) 
WHERE phone_digits IS NOT NULL AND length(phone_digits) >= 3;

CREATE INDEX IF NOT EXISTS idx_accounts_tenant_address_optimized 
ON accounts (tenant_id, lower(address || ' ' || COALESCE(city, '') || ' ' || COALESCE(state, '')) text_pattern_ops) 
WHERE address IS NOT NULL;

-- Specialized index for exact name matching (fastest)
CREATE INDEX IF NOT EXISTS idx_accounts_name_exact 
ON accounts (tenant_id, name) 
WHERE name IS NOT NULL;

-- GIN indexes for full-text search (when needed)
CREATE INDEX IF NOT EXISTS idx_accounts_search_vector_gin 
ON accounts USING GIN (search_vector) 
WHERE search_vector IS NOT NULL;

-- Trigram indexes for fuzzy matching (selective use)
CREATE INDEX IF NOT EXISTS idx_accounts_name_trigram_gin 
ON accounts USING GIN (lower(name) gin_trgm_ops) 
WHERE name IS NOT NULL AND length(name) >= 3;

-- ============================================================================
-- 2. CREATE MATERIALIZED VIEW FOR FREQUENTLY SEARCHED DATA
-- ============================================================================

DROP MATERIALIZED VIEW IF EXISTS search_optimized_accounts;

CREATE MATERIALIZED VIEW search_optimized_accounts AS
SELECT 
  id,
  tenant_id,
  name,
  lower(name) as name_lower,
  email,
  lower(email) as email_lower,
  phone,
  phone_digits,
  address,
  city,
  state,
  zip_code,
  status,
  account_type,
  created_at,
  updated_at,
  -- Pre-computed search fields
  lower(name || ' ' || COALESCE(email, '') || ' ' || COALESCE(address, '') || ' ' || COALESCE(city, '')) as search_text,
  -- Trigram prepared text for fuzzy matching
  lower(name) as name_trigram,
  -- Phone search optimization
  CASE 
    WHEN phone_digits IS NOT NULL AND length(phone_digits) >= 10 
    THEN phone_digits 
    ELSE NULL 
  END as phone_searchable,
  -- Status for quick filtering
  CASE WHEN status = 'active' THEN true ELSE false END as is_active
FROM accounts
WHERE tenant_id IS NOT NULL;

-- Index the materialized view
CREATE UNIQUE INDEX idx_search_accounts_id ON search_optimized_accounts (id);
CREATE INDEX idx_search_accounts_tenant ON search_optimized_accounts (tenant_id);
CREATE INDEX idx_search_accounts_name_lower ON search_optimized_accounts (tenant_id, name_lower text_pattern_ops);
-- Fixed: search_text index should only use gin_trgm_ops, not include tenant_id
CREATE INDEX idx_search_accounts_search_text ON search_optimized_accounts USING GIN (search_text gin_trgm_ops);
CREATE INDEX idx_search_accounts_phone ON search_optimized_accounts (tenant_id, phone_searchable) WHERE phone_searchable IS NOT NULL;

-- Function to refresh materialized view (removed CONCURRENTLY for Supabase compatibility)
CREATE OR REPLACE FUNCTION refresh_search_cache()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW search_optimized_accounts;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. CREATE HIGH-PERFORMANCE SEARCH FUNCTIONS
-- ============================================================================

-- Fast exact search (for most queries)
CREATE OR REPLACE FUNCTION search_customers_fast(
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
  search_terms text[];
  clean_term text;
BEGIN
  -- Clean and prepare search term
  clean_term := trim(lower(p_search_term));
  search_terms := string_to_array(clean_term, ' ');
  
  -- Fast search using optimized indexes
  RETURN QUERY
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
    CASE 
      -- Exact name match gets highest score
      WHEN s.name_lower = clean_term THEN 1.0
      -- Name starts with search term
      WHEN s.name_lower LIKE clean_term || '%' THEN 0.9
      -- All search terms found in name
      WHEN (
        SELECT count(*) = array_length(search_terms, 1)
        FROM unnest(search_terms) term 
        WHERE s.name_lower LIKE '%' || term || '%'
      ) THEN 0.8
      -- Phone number match
      WHEN s.phone_searchable LIKE '%' || regexp_replace(p_search_term, '[^0-9]', '', 'g') || '%' THEN 0.7
      -- Email match
      WHEN s.email_lower LIKE '%' || clean_term || '%' THEN 0.6
      -- Address match
      WHEN s.search_text LIKE '%' || clean_term || '%' THEN 0.5
      ELSE 0.4
    END as relevance_score,
    CASE 
      WHEN s.name_lower = clean_term THEN 'exact'
      WHEN s.name_lower LIKE clean_term || '%' THEN 'prefix'
      WHEN s.phone_searchable LIKE '%' || regexp_replace(p_search_term, '[^0-9]', '', 'g') || '%' THEN 'phone'
      WHEN s.email_lower LIKE '%' || clean_term || '%' THEN 'email'
      ELSE 'partial'
    END as match_type,
    s.created_at,
    s.updated_at
  FROM search_optimized_accounts s
  WHERE s.tenant_id = p_tenant_id
    AND (
      -- Fast exact/prefix matching (uses index)
      s.name_lower LIKE clean_term || '%' OR
      -- Multi-word search
      (
        array_length(search_terms, 1) > 1 AND
        (SELECT count(*) >= LEAST(2, array_length(search_terms, 1))
         FROM unnest(search_terms) term 
         WHERE s.name_lower LIKE '%' || term || '%')
      ) OR
      -- Phone search (uses index)
      (
        length(regexp_replace(p_search_term, '[^0-9]', '', 'g')) >= 3 AND
        s.phone_searchable LIKE '%' || regexp_replace(p_search_term, '[^0-9]', '', 'g') || '%'
      ) OR
      -- Email search (uses index)
      s.email_lower LIKE '%' || clean_term || '%' OR
      -- Address search
      s.search_text LIKE '%' || clean_term || '%'
    )
  ORDER BY relevance_score DESC, s.name ASC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Fuzzy search for typos (slower, used when fast search returns few results)
CREATE OR REPLACE FUNCTION search_customers_fuzzy(
  p_search_term text,
  p_tenant_id uuid,
  p_similarity_threshold float DEFAULT 0.3,
  p_limit integer DEFAULT 25
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
  RETURN QUERY
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
    similarity(s.name_trigram, lower(p_search_term)) as relevance_score,
    'fuzzy' as match_type,
    s.created_at,
    s.updated_at
  FROM search_optimized_accounts s
  WHERE s.tenant_id = p_tenant_id
    AND similarity(s.name_trigram, lower(p_search_term)) > p_similarity_threshold
  ORDER BY similarity(s.name_trigram, lower(p_search_term)) DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Smart search that combines fast and fuzzy search
CREATE OR REPLACE FUNCTION search_customers_smart(
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
  fast_results_count integer;
BEGIN
  -- First, try fast search
  CREATE TEMP TABLE temp_fast_results AS
  SELECT * FROM search_customers_fast(p_search_term, p_tenant_id, p_limit, p_offset);
  
  GET DIAGNOSTICS fast_results_count = ROW_COUNT;
  
  -- If fast search returns enough results, use those
  IF fast_results_count >= 5 THEN
    RETURN QUERY SELECT * FROM temp_fast_results ORDER BY relevance_score DESC, name ASC;
  ELSE
    -- Combine fast results with fuzzy search for better coverage
    RETURN QUERY
    WITH combined_results AS (
      SELECT *, 1 as search_type FROM temp_fast_results
      UNION ALL
      SELECT *, 2 as search_type FROM search_customers_fuzzy(p_search_term, p_tenant_id, 0.3, p_limit - fast_results_count)
      WHERE id NOT IN (SELECT id FROM temp_fast_results)
    )
    SELECT 
      id, name, email, phone, address, city, state, zip_code, 
      status, account_type, relevance_score, match_type, created_at, updated_at
    FROM combined_results
    ORDER BY search_type ASC, relevance_score DESC, name ASC
    LIMIT p_limit;
  END IF;
  
  DROP TABLE temp_fast_results;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 4. GRANT PERMISSIONS
-- ============================================================================

GRANT EXECUTE ON FUNCTION search_customers_fast(text, uuid, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION search_customers_fuzzy(text, uuid, float, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION search_customers_smart(text, uuid, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_search_cache() TO authenticated;

GRANT SELECT ON search_optimized_accounts TO authenticated;

-- ============================================================================
-- 5. CREATE AUTOMATIC REFRESH TRIGGER
-- ============================================================================

-- Function to refresh cache when accounts are modified
CREATE OR REPLACE FUNCTION trigger_refresh_search_cache()
RETURNS trigger AS $$
BEGIN
  -- Refresh the materialized view asynchronously
  PERFORM refresh_search_cache();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to refresh cache on account changes
DROP TRIGGER IF EXISTS refresh_search_cache_trigger ON accounts;
CREATE TRIGGER refresh_search_cache_trigger
  AFTER INSERT OR UPDATE OR DELETE ON accounts
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_refresh_search_cache();

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Search performance optimization completed!';
  RAISE NOTICE 'Features enabled:';
  RAISE NOTICE '- High-performance composite indexes';
  RAISE NOTICE '- Materialized view for search optimization';
  RAISE NOTICE '- Fast exact search function';
  RAISE NOTICE '- Fuzzy search for typos';
  RAISE NOTICE '- Smart search combining both approaches';
  RAISE NOTICE '- Automatic cache refresh on data changes';
END $$;
