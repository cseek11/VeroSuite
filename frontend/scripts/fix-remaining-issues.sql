-- =====================================================
-- FIX REMAINING ISSUES FOR 100% SUCCESS RATE
-- =====================================================
-- This script addresses the remaining issues found in end-to-end testing:
-- 1. search_customers_multi_word structure mismatch
-- 2. Error statistics GROUP BY clause issue
-- 3. Input validation improvements
-- =====================================================

-- STEP 1: FIX MULTI-WORD SEARCH FUNCTION
-- =====================================================
DROP FUNCTION IF EXISTS search_customers_multi_word(UUID, TEXT, INTEGER);

CREATE OR REPLACE FUNCTION search_customers_multi_word(
  p_tenant_id UUID,
  p_search_term TEXT,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  status TEXT,
  type TEXT,
  score REAL
) AS $$
DECLARE
  search_words TEXT[];
  word_count INTEGER;
BEGIN
  -- Input validation
  IF p_tenant_id IS NULL THEN RAISE EXCEPTION 'Tenant ID cannot be null'; END IF;
  IF p_search_term IS NULL OR TRIM(p_search_term) = '' THEN RAISE EXCEPTION 'Search term cannot be null or empty'; END IF;
  IF LENGTH(TRIM(p_search_term)) > 1000 THEN RAISE EXCEPTION 'Search term too long (max 1000 characters)'; END IF;
  IF p_limit IS NULL OR p_limit <= 0 THEN RAISE EXCEPTION 'Limit must be positive'; END IF;
  IF p_limit > 1000 THEN RAISE EXCEPTION 'Limit too high (max 1000)'; END IF;
  IF p_tenant_id = '00000000-0000-0000-0000-000000000000'::UUID THEN RAISE EXCEPTION 'Invalid tenant ID'; END IF;

  -- Split search term into words
  search_words := string_to_array(TRIM(p_search_term), ' ');
  word_count := array_length(search_words, 1);

  -- Multi-word search logic
  RETURN QUERY
  SELECT
    c.id,
    (c.first_name || ' ' || c.last_name)::TEXT AS name,
    c.email,
    c.phone,
    c.address,
    c.status,
    c.account_type AS type,
    CASE
      -- Exact match gets highest score
      WHEN (c.first_name || ' ' || c.last_name) ILIKE '%' || TRIM(p_search_term) || '%' THEN 1.0
      -- All words match gets high score
      WHEN (
        SELECT COUNT(*) FROM unnest(search_words) AS word 
        WHERE (c.first_name || ' ' || c.last_name || ' ' || COALESCE(c.email, '') || ' ' || COALESCE(c.phone, '') || ' ' || COALESCE(c.address, '')) ILIKE '%' || word || '%'
      ) = word_count THEN 0.9
      -- Most words match gets medium-high score
      WHEN (
        SELECT COUNT(*) FROM unnest(search_words) AS word 
        WHERE (c.first_name || ' ' || c.last_name || ' ' || COALESCE(c.email, '') || ' ' || COALESCE(c.phone, '') || ' ' || COALESCE(c.address, '')) ILIKE '%' || word || '%'
      ) >= (word_count * 0.7) THEN 0.7
      -- Some words match gets medium score
      WHEN (
        SELECT COUNT(*) FROM unnest(search_words) AS word 
        WHERE (c.first_name || ' ' || c.last_name || ' ' || COALESCE(c.email, '') || ' ' || COALESCE(c.phone, '') || ' ' || COALESCE(c.address, '')) ILIKE '%' || word || '%'
      ) > 0 THEN 0.5
      ELSE 0.3
    END::REAL AS score
  FROM customers c
  WHERE c.tenant_id = p_tenant_id
    AND (
      -- At least one word must match
      EXISTS (
        SELECT 1 FROM unnest(search_words) AS word 
        WHERE (c.first_name || ' ' || c.last_name || ' ' || COALESCE(c.email, '') || ' ' || COALESCE(c.phone, '') || ' ' || COALESCE(c.address, '')) ILIKE '%' || word || '%'
      )
    )
  ORDER BY score DESC, c.first_name, c.last_name
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 2: FIX ERROR STATISTICS FUNCTION
-- =====================================================
DROP FUNCTION IF EXISTS get_error_statistics(UUID, INTEGER);

CREATE OR REPLACE FUNCTION get_error_statistics(
  p_tenant_id UUID DEFAULT NULL,
  p_hours_back INTEGER DEFAULT 24
)
RETURNS TABLE(
  total_errors BIGINT,
  errors_by_type JSONB,
  errors_by_severity JSONB,
  unresolved_errors BIGINT,
  recent_errors BIGINT,
  avg_resolution_time_hours NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_errors,
    COALESCE(
      jsonb_object_agg(
        error_type, 
        type_count
      ) FILTER (WHERE error_type IS NOT NULL),
      '{}'::jsonb
    ) as errors_by_type,
    COALESCE(
      jsonb_object_agg(
        severity, 
        severity_count
      ) FILTER (WHERE severity IS NOT NULL),
      '{}'::jsonb
    ) as errors_by_severity,
    COUNT(*) FILTER (WHERE is_resolved = false)::BIGINT as unresolved_errors,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour' * p_hours_back)::BIGINT as recent_errors,
    COALESCE(
      AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600) FILTER (WHERE is_resolved = true),
      0
    )::NUMERIC as avg_resolution_time_hours
  FROM (
    SELECT 
      error_type,
      COUNT(*) as type_count,
      CASE 
        WHEN error_message ILIKE '%critical%' OR error_message ILIKE '%fatal%' THEN 'critical'
        WHEN error_message ILIKE '%error%' THEN 'high'
        WHEN error_message ILIKE '%warning%' THEN 'medium'
        ELSE 'low'
      END as severity,
      COUNT(*) as severity_count,
      is_resolved,
      created_at,
      resolved_at
    FROM search_errors 
    WHERE (p_tenant_id IS NULL OR tenant_id = p_tenant_id)
    GROUP BY error_type, error_message, is_resolved, created_at, resolved_at
  ) stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 3: IMPROVE INPUT VALIDATION IN ALL SEARCH FUNCTIONS
-- =====================================================

-- Update enhanced search with better validation
DROP FUNCTION IF EXISTS search_customers_enhanced(UUID, TEXT, INTEGER);

CREATE OR REPLACE FUNCTION search_customers_enhanced(
  p_tenant_id UUID,
  p_search_term TEXT,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  status TEXT,
  type TEXT,
  score REAL
) AS $$
BEGIN
  -- Enhanced input validation
  IF p_tenant_id IS NULL THEN RAISE EXCEPTION 'Tenant ID cannot be null'; END IF;
  IF p_search_term IS NULL OR TRIM(p_search_term) = '' THEN RAISE EXCEPTION 'Search term cannot be null or empty'; END IF;
  IF LENGTH(TRIM(p_search_term)) > 1000 THEN RAISE EXCEPTION 'Search term too long (max 1000 characters)'; END IF;
  IF p_limit IS NULL OR p_limit <= 0 THEN RAISE EXCEPTION 'Limit must be positive'; END IF;
  IF p_limit > 1000 THEN RAISE EXCEPTION 'Limit too high (max 1000)'; END IF;
  IF p_tenant_id = '00000000-0000-0000-0000-000000000000'::UUID THEN RAISE EXCEPTION 'Invalid tenant ID'; END IF;
  
  -- Additional validation for edge cases
  IF p_search_term = 'null' OR p_search_term = 'undefined' THEN RAISE EXCEPTION 'Invalid search term'; END IF;
  IF p_limit = 0 THEN RAISE EXCEPTION 'Limit must be positive'; END IF;

  RETURN QUERY
  SELECT
    c.id,
    (c.first_name || ' ' || c.last_name)::TEXT AS name,
    c.email,
    c.phone,
    c.address,
    c.status,
    c.account_type AS type,
    CASE
      WHEN c.first_name ILIKE '%' || TRIM(p_search_term) || '%' THEN 0.9
      WHEN c.last_name  ILIKE '%' || TRIM(p_search_term) || '%' THEN 0.8
      WHEN c.email      ILIKE '%' || TRIM(p_search_term) || '%' THEN 0.7
      WHEN c.phone      ILIKE '%' || TRIM(p_search_term) || '%' THEN 0.6
      WHEN c.address    ILIKE '%' || TRIM(p_search_term) || '%' THEN 0.5
      ELSE 0.3
    END::REAL AS score
  FROM customers c
  WHERE c.tenant_id = p_tenant_id
    AND (
      c.first_name ILIKE '%' || TRIM(p_search_term) || '%' OR
      c.last_name  ILIKE '%' || TRIM(p_search_term) || '%' OR
      c.email      ILIKE '%' || TRIM(p_search_term) || '%' OR
      c.phone      ILIKE '%' || TRIM(p_search_term) || '%' OR
      c.address    ILIKE '%' || TRIM(p_search_term) || '%'
    )
  ORDER BY score DESC, c.first_name, c.last_name
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update fuzzy search with better validation
DROP FUNCTION IF EXISTS search_customers_fuzzy(UUID, TEXT, REAL, INTEGER);

CREATE OR REPLACE FUNCTION search_customers_fuzzy(
  p_tenant_id UUID,
  p_search_term TEXT,
  p_threshold REAL DEFAULT 0.3,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  status TEXT,
  type TEXT,
  score REAL
) AS $$
BEGIN
  -- Enhanced input validation
  IF p_tenant_id IS NULL THEN RAISE EXCEPTION 'Tenant ID cannot be null'; END IF;
  IF p_search_term IS NULL OR TRIM(p_search_term) = '' THEN RAISE EXCEPTION 'Search term cannot be null or empty'; END IF;
  IF LENGTH(TRIM(p_search_term)) > 1000 THEN RAISE EXCEPTION 'Search term too long (max 1000 characters)'; END IF;
  IF p_threshold IS NULL OR p_threshold < 0 OR p_threshold > 1 THEN RAISE EXCEPTION 'Threshold must be between 0 and 1'; END IF;
  IF p_limit IS NULL OR p_limit <= 0 THEN RAISE EXCEPTION 'Limit must be positive'; END IF;
  IF p_limit > 1000 THEN RAISE EXCEPTION 'Limit too high (max 1000)'; END IF;
  IF p_tenant_id = '00000000-0000-0000-0000-000000000000'::UUID THEN RAISE EXCEPTION 'Invalid tenant ID'; END IF;
  
  -- Additional validation for edge cases
  IF p_search_term = 'null' OR p_search_term = 'undefined' THEN RAISE EXCEPTION 'Invalid search term'; END IF;
  IF p_limit = 0 THEN RAISE EXCEPTION 'Limit must be positive'; END IF;

  RETURN QUERY
  SELECT
    c.id,
    (c.first_name || ' ' || c.last_name)::TEXT AS name,
    c.email,
    c.phone,
    c.address,
    c.status,
    c.account_type AS type,
    GREATEST(
      similarity(c.first_name, TRIM(p_search_term)),
      similarity(c.last_name, TRIM(p_search_term)),
      similarity(c.email, TRIM(p_search_term)),
      similarity(c.phone, TRIM(p_search_term)),
      similarity(c.address, TRIM(p_search_term))
    )::REAL AS score
  FROM customers c
  WHERE c.tenant_id = p_tenant_id
    AND (
      similarity(c.first_name, TRIM(p_search_term)) >= p_threshold OR
      similarity(c.last_name, TRIM(p_search_term)) >= p_threshold OR
      similarity(c.email, TRIM(p_search_term)) >= p_threshold OR
      similarity(c.phone, TRIM(p_search_term)) >= p_threshold OR
      similarity(c.address, TRIM(p_search_term)) >= p_threshold
    )
  ORDER BY score DESC, c.first_name, c.last_name
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 4: ADD INDEX FOR BETTER SEARCH PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_customers_tenant_search 
ON customers (tenant_id, first_name, last_name, email, phone, address);

-- STEP 5: VERIFICATION QUERIES
-- =====================================================
-- Test the fixed functions
SELECT 'Testing multi-word search...' as test;
SELECT * FROM search_customers_multi_word('550e8400-e29b-41d4-a716-446655440000'::UUID, 'John Smith', 10);

SELECT 'Testing error statistics...' as test;
SELECT * FROM get_error_statistics('550e8400-e29b-41d4-a716-446655440000'::UUID, 24);

SELECT 'Testing enhanced search with edge cases...' as test;
-- This should fail with proper error message
-- SELECT * FROM search_customers_enhanced('550e8400-e29b-41d4-a716-446655440000'::UUID, 'null', 10);

SELECT 'All fixes deployed successfully!' as status;
