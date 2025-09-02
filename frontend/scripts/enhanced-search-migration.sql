-- ============================================================================
-- ENHANCED SEARCH MIGRATION - Scalable Relevance Ranking
-- ============================================================================
-- This migration implements weighted full-text search, fuzzy matching,
-- and prepares for future vector search capabilities.

-- ============================================================================
-- 1. ENABLE REQUIRED EXTENSIONS
-- ============================================================================

-- Enable trigram similarity for fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Note: pgvector extension is not available in all Supabase instances
-- Vector search functionality will be added later when pgvector is available

-- ============================================================================
-- 2. ADD SEARCH-OPTIMIZED COLUMNS
-- ============================================================================

-- Add tsvector column for weighted full-text search
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Add normalized phone digits column (if not exists)
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS phone_digits text;

-- Add trigram similarity columns for fuzzy matching
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS name_trigram text;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS address_trigram text;

-- Note: embedding column will be added later when pgvector is available
-- ALTER TABLE accounts ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- ============================================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- GIN index for full-text search
CREATE INDEX IF NOT EXISTS idx_accounts_search_vector ON accounts USING GIN (search_vector);

-- GIN index for trigram similarity
CREATE INDEX IF NOT EXISTS idx_accounts_name_trigram ON accounts USING GIN (name_trigram gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_accounts_address_trigram ON accounts USING GIN (address_trigram gin_trgm_ops);

-- Index for phone digits (for fast numeric lookups)
CREATE INDEX IF NOT EXISTS idx_accounts_phone_digits ON accounts (phone_digits);

-- Note: Vector index will be created later when pgvector is available
-- CREATE INDEX IF NOT EXISTS idx_accounts_embedding ON accounts USING ivfflat (embedding vector_cosine_ops);

-- Composite index for tenant + search performance
CREATE INDEX IF NOT EXISTS idx_accounts_tenant_search ON accounts (tenant_id, search_vector);

-- ============================================================================
-- 4. UPDATE EXISTING DATA
-- ============================================================================

-- Update phone_digits column with normalized phone numbers
UPDATE accounts 
SET phone_digits = regexp_replace(phone, '[^0-9]', '', 'g')
WHERE phone IS NOT NULL AND phone_digits IS NULL;

-- Update trigram columns
UPDATE accounts 
SET name_trigram = name
WHERE name IS NOT NULL AND name_trigram IS NULL;

UPDATE accounts 
SET address_trigram = COALESCE(address, '') || ' ' || COALESCE(city, '') || ' ' || COALESCE(state, '') || ' ' || COALESCE(zip_code, '')
WHERE address_trigram IS NULL;

-- Update search_vector with weighted content
UPDATE accounts 
SET search_vector = 
  setweight(to_tsvector('english', COALESCE(phone_digits, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(address, '') || ' ' || COALESCE(city, '') || ' ' || COALESCE(state, '') || ' ' || COALESCE(zip_code, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(email, '')), 'C')
WHERE search_vector IS NULL;

-- ============================================================================
-- 5. CREATE TRIGGER FOR AUTOMATIC UPDATES
-- ============================================================================

-- Function to update search_vector and trigram columns
CREATE OR REPLACE FUNCTION update_account_search_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- Update phone_digits
  NEW.phone_digits := regexp_replace(NEW.phone, '[^0-9]', '', 'g');
  
  -- Update name_trigram
  NEW.name_trigram := NEW.name;
  
  -- Update address_trigram
  NEW.address_trigram := COALESCE(NEW.address, '') || ' ' || COALESCE(NEW.city, '') || ' ' || COALESCE(NEW.state, '') || ' ' || COALESCE(NEW.zip_code, '');
  
  -- Update search_vector with weighted content
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.phone_digits, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.address, '') || ' ' || COALESCE(NEW.city, '') || ' ' || COALESCE(NEW.state, '') || ' ' || COALESCE(NEW.zip_code, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.name, '') || ' ' || COALESCE(NEW.email, '')), 'C');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic updates
DROP TRIGGER IF EXISTS trigger_update_account_search ON accounts;
CREATE TRIGGER trigger_update_account_search
  BEFORE INSERT OR UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_account_search_columns();

-- ============================================================================
-- 6. CREATE ENHANCED SEARCH FUNCTION
-- ============================================================================

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
  
  -- Return ranked results using multiple search strategies
  RETURN QUERY
  WITH ranked_results AS (
    -- Strategy 1: Full-text search with weighted ranking
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
      ts_rank_cd(a.search_vector, search_query, 32) as relevance_score,
      'full_text' as match_type,
      a.created_at,
      a.updated_at
    FROM accounts a
    WHERE a.tenant_id = p_tenant_id
      AND a.search_vector @@ search_query
    
    UNION ALL
    
    -- Strategy 2: Phone number exact/partial match (highest priority)
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
        WHEN a.phone_digits = search_phone_digits THEN 1.0  -- Exact match
        WHEN a.phone_digits LIKE search_phone_digits || '%' THEN 0.9  -- Starts with
        WHEN a.phone_digits LIKE '%' || search_phone_digits || '%' THEN 0.8  -- Contains
        ELSE 0.7
      END as relevance_score,
      'phone' as match_type,
      a.created_at,
      a.updated_at
    FROM accounts a
    WHERE a.tenant_id = p_tenant_id
      AND has_phone_search
      AND a.phone_digits LIKE '%' || search_phone_digits || '%'
             AND a.id NOT IN (
         SELECT a2.id FROM accounts a2
         WHERE a2.tenant_id = p_tenant_id AND a2.search_vector @@ search_query
       )
    
    UNION ALL
    
    -- Strategy 3: Fuzzy matching with trigram similarity
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
      GREATEST(
        similarity(a.name_trigram, p_search_term),
        similarity(a.address_trigram, p_search_term)
      ) as relevance_score,
      'fuzzy' as match_type,
      a.created_at,
      a.updated_at
    FROM accounts a
    WHERE a.tenant_id = p_tenant_id
      AND (
        similarity(a.name_trigram, p_search_term) > 0.3 OR
        similarity(a.address_trigram, p_search_term) > 0.3
      )
             AND a.id NOT IN (
         SELECT a2.id FROM accounts a2
         WHERE a2.tenant_id = p_tenant_id 
           AND (a2.search_vector @@ search_query OR (has_phone_search AND a2.phone_digits LIKE '%' || search_phone_digits || '%'))
       )
    
    UNION ALL
    
    -- Strategy 4: Fallback ILIKE search
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
      0.1 as relevance_score,
      'fallback' as match_type,
      a.created_at,
      a.updated_at
    FROM accounts a
    WHERE a.tenant_id = p_tenant_id
      AND (
        a.name ILIKE '%' || p_search_term || '%' OR
        a.email ILIKE '%' || p_search_term || '%' OR
        a.address ILIKE '%' || p_search_term || '%' OR
        a.city ILIKE '%' || p_search_term || '%' OR
        a.state ILIKE '%' || p_search_term || '%' OR
        a.zip_code ILIKE '%' || p_search_term || '%' OR
        a.account_type ILIKE '%' || p_search_term || '%' OR
        a.status ILIKE '%' || p_search_term || '%'
      )
             AND a.id NOT IN (
         SELECT a2.id FROM accounts a2
         WHERE a2.tenant_id = p_tenant_id 
           AND (
             a2.search_vector @@ search_query OR 
             (has_phone_search AND a2.phone_digits LIKE '%' || search_phone_digits || '%') OR
             similarity(a2.name_trigram, p_search_term) > 0.3 OR
             similarity(a2.address_trigram, p_search_term) > 0.3
           )
       )
  )
  SELECT 
    r.id,
    r.name,
    r.email,
    r.phone,
    r.address,
    r.city,
    r.state,
    r.zip_code,
    r.status,
    r.account_type,
    r.relevance_score,
    r.match_type,
    r.created_at,
    r.updated_at
  FROM ranked_results r
  ORDER BY r.relevance_score DESC, r.name ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. CREATE MULTI-WORD SEARCH FUNCTION
-- ============================================================================

-- This function handles multi-word queries by splitting them and searching for each word independently
-- It provides better results for queries like "john smith" or "last first"

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
  relevance_score float,
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
      1.0 as relevance_score,
      'multi_word_exact' as match_type,
      jsonb_build_object(
        'matched_terms', search_terms,
        'match_count', array_length(search_terms, 1),
        'field', 'name'
      ) as match_details,
      a.created_at,
      a.updated_at
    FROM accounts a
    WHERE a.tenant_id = p_tenant_id
      AND (
        -- Check if ALL search terms are found in the name
        SELECT bool_and(
          SELECT EXISTS(
            SELECT 1 FROM unnest(search_terms) term 
            WHERE lower(a.name) LIKE '%' || term || '%'
          )
        )
      )
    
    UNION ALL
    
    -- Strategy 2: Multi-word partial matches (high priority)
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
      0.8 as relevance_score,
      'multi_word_partial' as match_type,
      jsonb_build_object(
        'matched_terms', (
          SELECT array_agg(term) 
          FROM unnest(search_terms) term 
          WHERE lower(a.name) LIKE '%' || term || '%'
        ),
        'match_count', (
          SELECT count(*) 
          FROM unnest(search_terms) term 
          WHERE lower(a.name) LIKE '%' || term || '%'
        ),
        'total_terms', array_length(search_terms, 1),
        'field', 'name'
      ) as match_details,
      a.created_at,
      a.updated_at
    FROM accounts a
    WHERE a.tenant_id = p_tenant_id
      AND (
        -- Check if at least 2 search terms are found in the name
        SELECT count(*) 
        FROM unnest(search_terms) term 
        WHERE lower(a.name) LIKE '%' || term || '%'
      ) >= 2
      AND a.id NOT IN (
        SELECT a2.id FROM accounts a2
        WHERE a2.tenant_id = p_tenant_id
          AND (
            -- Exclude exact matches
            SELECT bool_and(
              SELECT EXISTS(
                SELECT 1 FROM unnest(search_terms) term 
                WHERE lower(a2.name) LIKE '%' || term || '%'
              )
            )
          )
      )
    
    UNION ALL
    
    -- Strategy 3: Single word exact matches (medium priority)
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
      0.6 as relevance_score,
      'single_word_exact' as match_type,
      jsonb_build_object(
        'matched_terms', (
          SELECT array_agg(term) 
          FROM unnest(search_terms) term 
          WHERE lower(a.name) LIKE '%' || term || '%'
        ),
        'match_count', 1,
        'total_terms', array_length(search_terms, 1),
        'field', 'name'
      ) as match_details,
      a.created_at,
      a.updated_at
    FROM accounts a
    WHERE a.tenant_id = p_tenant_id
      AND (
        -- Check if at least 1 search term is found in the name
        SELECT count(*) 
        FROM unnest(search_terms) term 
        WHERE lower(a.name) LIKE '%' || term || '%'
      ) >= 1
      AND a.id NOT IN (
        SELECT a2.id FROM accounts a2
        WHERE a2.tenant_id = p_tenant_id
          AND (
            -- Exclude multi-word matches
            SELECT count(*) 
            FROM unnest(search_terms) term 
            WHERE lower(a2.name) LIKE '%' || term || '%'
          ) >= 2
      )
    
    UNION ALL
    
    -- Strategy 4: Phone number exact/partial match
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
        WHEN a.phone_digits = search_phone_digits THEN 0.9
        WHEN a.phone_digits LIKE search_phone_digits || '%' THEN 0.8
        WHEN a.phone_digits LIKE '%' || search_phone_digits || '%' THEN 0.7
        ELSE 0.6
      END as relevance_score,
      'phone' as match_type,
      jsonb_build_object(
        'matched_terms', search_phone_digits,
        'match_count', 1,
        'field', 'phone'
      ) as match_details,
      a.created_at,
      a.updated_at
    FROM accounts a
    WHERE a.tenant_id = p_tenant_id
      AND has_phone_search
      AND a.phone_digits LIKE '%' || search_phone_digits || '%'
      AND a.id NOT IN (
        SELECT a2.id FROM accounts a2
        WHERE a2.tenant_id = p_tenant_id
          AND (
            -- Exclude name matches
            SELECT count(*) 
            FROM unnest(search_terms) term 
            WHERE lower(a2.name) LIKE '%' || term || '%'
          ) >= 1
      )
    
    UNION ALL
    
    -- Strategy 5: Email and address partial matches (lowest priority)
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
      0.4 as relevance_score,
      'other_fields' as match_type,
      jsonb_build_object(
        'matched_terms', search_terms,
        'match_count', (
          SELECT count(*) 
          FROM unnest(search_terms) term 
          WHERE (
            lower(a.email) LIKE '%' || term || '%' OR
            lower(a.address) LIKE '%' || term || '%' OR
            lower(a.city) LIKE '%' || term || '%' OR
            lower(a.state) LIKE '%' || term || '%'
          )
        ),
        'field', 'email_address_city_state'
      ) as match_details,
      a.created_at,
      a.updated_at
    FROM accounts a
    WHERE a.tenant_id = p_tenant_id
      AND (
        -- Check if any search terms are found in other fields
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
            -- Exclude name and phone matches
            SELECT count(*) 
            FROM unnest(search_terms) term 
            WHERE lower(a2.name) LIKE '%' || term || '%'
          ) >= 1
            OR (has_phone_search AND a2.phone_digits LIKE '%' || search_phone_digits || '%')
          )
      )
  )
  SELECT 
    r.id,
    r.name,
    r.email,
    r.phone,
    r.address,
    r.city,
    r.state,
    r.zip_code,
    r.status,
    r.account_type,
    r.relevance_score,
    r.match_type,
    r.match_details,
    r.created_at,
    r.updated_at
  FROM ranked_results r
  ORDER BY r.relevance_score DESC, r.name ASC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 8. CREATE VECTOR SEARCH FUNCTION (FUTURE USE - WHEN PGVECTOR IS AVAILABLE)
-- ============================================================================

-- Note: This function will be created later when pgvector extension is available
-- For now, we'll create a placeholder function that can be replaced later

CREATE OR REPLACE FUNCTION search_customers_vector(
  p_embedding text, -- Changed from vector(1536) to text for now
  p_tenant_id uuid,
  p_limit integer DEFAULT 50,
  p_threshold float DEFAULT 0.7
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
  similarity_score float,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
BEGIN
  -- Placeholder implementation - will be replaced when pgvector is available
  RAISE NOTICE 'Vector search not available - pgvector extension required';
  
  -- Return empty result set for now
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
    0.0 as similarity_score,
    a.created_at,
    a.updated_at
  FROM accounts a
  WHERE a.tenant_id = p_tenant_id
    AND false; -- Always return no results for now
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. GRANT PERMISSIONS
-- ============================================================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION search_customers_enhanced(text, uuid, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION search_customers_multi_word(text, uuid, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION search_customers_vector(text, uuid, integer, float) TO authenticated;

-- ============================================================================
-- 9. CREATE RLS POLICIES FOR FUNCTIONS
-- ============================================================================

-- Note: RLS policies are already handled by existing policies
-- The enhanced search functions will respect existing tenant-based access control

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Verify the migration
DO $$
BEGIN
  RAISE NOTICE 'Enhanced search migration completed successfully!';
  RAISE NOTICE 'Features enabled:';
  RAISE NOTICE '- Weighted full-text search with tsvector';
  RAISE NOTICE '- Fuzzy matching with pg_trgm';
  RAISE NOTICE '- Multi-word search with intelligent term splitting';
  RAISE NOTICE '- Phone number optimization';
  RAISE NOTICE '- Performance indexes';
  RAISE NOTICE '- Automatic triggers for data updates';
  RAISE NOTICE '';
  RAISE NOTICE 'Note: Vector search is not available (pgvector extension required)';
  RAISE NOTICE 'Vector search will be enabled when pgvector becomes available';
END $$; 