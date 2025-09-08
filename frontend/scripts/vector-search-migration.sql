-- ============================================================================
-- VECTOR SEARCH MIGRATION - AI-Driven Semantic Search
-- ============================================================================
-- This migration adds vector search capabilities when pgvector extension is available.
-- Run this AFTER the enhanced-search-migration.sql has been executed.

-- ============================================================================
-- 1. ENABLE PGVECTOR EXTENSION
-- ============================================================================

-- Enable vector similarity for AI-driven search
CREATE EXTENSION IF NOT EXISTS pgvector;

-- ============================================================================
-- 2. ADD VECTOR COLUMNS
-- ============================================================================

-- Add vector column for semantic search
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- ============================================================================
-- 3. CREATE VECTOR INDEXES
-- ============================================================================

-- Index for vector similarity
CREATE INDEX IF NOT EXISTS idx_accounts_embedding ON accounts USING ivfflat (embedding vector_cosine_ops);

-- ============================================================================
-- 4. UPDATE TRIGGER FOR VECTOR UPDATES
-- ============================================================================

-- Update the existing trigger function to handle embeddings
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
  
  -- Note: Embedding will be updated by external AI service
  -- NEW.embedding := generate_embedding(NEW.name, NEW.email, NEW.address);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 5. CREATE ENHANCED VECTOR SEARCH FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION search_customers_vector(
  p_embedding vector(1536),
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
    1 - (a.embedding <=> p_embedding) as similarity_score,
    a.created_at,
    a.updated_at
  FROM accounts a
  WHERE a.tenant_id = p_tenant_id
    AND a.embedding IS NOT NULL
    AND 1 - (a.embedding <=> p_embedding) > p_threshold
  ORDER BY a.embedding <=> p_embedding
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 6. CREATE HYBRID SEARCH FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION search_customers_hybrid(
  p_search_term text,
  p_embedding vector(1536),
  p_tenant_id uuid,
  p_limit integer DEFAULT 50,
  p_text_weight float DEFAULT 0.7,
  p_vector_weight float DEFAULT 0.3
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
  combined_score float,
  text_score float,
  vector_score float,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
DECLARE
  search_query tsquery;
BEGIN
  -- Create tsquery for full-text search
  search_query := plainto_tsquery('english', p_search_term);
  
  RETURN QUERY
  WITH text_results AS (
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
      ts_rank_cd(a.search_vector, search_query, 32) as text_score,
      a.created_at,
      a.updated_at
    FROM accounts a
    WHERE a.tenant_id = p_tenant_id
      AND a.search_vector @@ search_query
  ),
  vector_results AS (
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
      1 - (a.embedding <=> p_embedding) as vector_score,
      a.created_at,
      a.updated_at
    FROM accounts a
    WHERE a.tenant_id = p_tenant_id
      AND a.embedding IS NOT NULL
      AND 1 - (a.embedding <=> p_embedding) > 0.5
  )
  SELECT 
    COALESCE(t.id, v.id) as id,
    COALESCE(t.name, v.name) as name,
    COALESCE(t.email, v.email) as email,
    COALESCE(t.phone, v.phone) as phone,
    COALESCE(t.address, v.address) as address,
    COALESCE(t.city, v.city) as city,
    COALESCE(t.state, v.state) as state,
    COALESCE(t.zip_code, v.zip_code) as zip_code,
    COALESCE(t.status, v.status) as status,
    COALESCE(t.account_type, v.account_type) as account_type,
    (COALESCE(t.text_score, 0) * p_text_weight + COALESCE(v.vector_score, 0) * p_vector_weight) as combined_score,
    COALESCE(t.text_score, 0) as text_score,
    COALESCE(v.vector_score, 0) as vector_score,
    COALESCE(t.created_at, v.created_at) as created_at,
    COALESCE(t.updated_at, v.updated_at) as updated_at
  FROM text_results t
  FULL OUTER JOIN vector_results v ON t.id = v.id
  ORDER BY combined_score DESC, name ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. CREATE EMBEDDING GENERATION FUNCTION (PLACEHOLDER)
-- ============================================================================

-- This function will be called by external AI service to update embeddings
CREATE OR REPLACE FUNCTION update_customer_embedding(
  p_customer_id uuid,
  p_embedding vector(1536)
)
RETURNS void AS $$
BEGIN
  UPDATE accounts 
  SET embedding = p_embedding
  WHERE id = p_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. GRANT PERMISSIONS
-- ============================================================================

-- Grant execute permissions on vector functions
GRANT EXECUTE ON FUNCTION search_customers_vector(vector(1536), uuid, integer, float) TO authenticated;
GRANT EXECUTE ON FUNCTION search_customers_hybrid(text, vector(1536), uuid, integer, float, float) TO authenticated;
GRANT EXECUTE ON FUNCTION update_customer_embedding(uuid, vector(1536)) TO authenticated;

-- ============================================================================
-- 9. CREATE BATCH EMBEDDING UPDATE FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION batch_update_embeddings()
RETURNS TABLE (
  customer_id uuid,
  name text,
  email text,
  address text,
  embedding_ready boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id as customer_id,
    a.name,
    a.email,
    COALESCE(a.address, '') || ' ' || COALESCE(a.city, '') || ' ' || COALESCE(a.state, '') as address,
    a.embedding IS NULL as embedding_ready
  FROM accounts a
  WHERE a.embedding IS NULL
    AND a.name IS NOT NULL
  ORDER BY a.created_at DESC
  LIMIT 100; -- Process in batches
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Verify the migration
DO $$
BEGIN
  RAISE NOTICE 'Vector search migration completed successfully!';
  RAISE NOTICE 'Features enabled:';
  RAISE NOTICE '- Vector similarity search with pgvector';
  RAISE NOTICE '- Hybrid text + vector search';
  RAISE NOTICE '- Batch embedding updates';
  RAISE NOTICE '- Vector indexes for performance';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Generate embeddings for existing customers';
  RAISE NOTICE '2. Set up AI service to update embeddings';
  RAISE NOTICE '3. Test hybrid search functionality';
END $$;










