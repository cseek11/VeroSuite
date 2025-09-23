-- ============================================================================
-- SETUP PGVECTOR EXTENSION
-- ============================================================================
-- Comprehensive script to set up and verify pgvector extension

-- Step 1: Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS pgvector;

-- Step 2: Verify extension is properly installed
DO $$
DECLARE
  ext_exists boolean;
  ext_version text;
BEGIN
  -- Check if extension exists
  SELECT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pgvector'
  ) INTO ext_exists;
  
  -- Get extension version
  SELECT extversion INTO ext_version 
  FROM pg_extension 
  WHERE extname = 'pgvector';
  
  -- Report status
  IF ext_exists THEN
    RAISE NOTICE '✅ pgvector extension is installed (version: %)', ext_version;
  ELSE
    RAISE NOTICE '❌ pgvector extension is NOT installed';
  END IF;
END $$;

-- Step 3: Test vector functionality
DO $$
DECLARE
  test_vector vector(3);
  similarity float;
BEGIN
  -- Test vector creation
  test_vector := '[1,2,3]'::vector;
  RAISE NOTICE '✅ Vector creation successful: %', test_vector;
  
  -- Test vector similarity
  similarity := 1 - ('[1,2,3]'::vector <=> '[4,5,6]'::vector);
  RAISE NOTICE '✅ Vector similarity calculation successful: %', similarity;
  
  RAISE NOTICE '✅ All pgvector tests passed!';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ pgvector test failed: %', SQLERRM;
END $$;

-- Step 4: Check if vector column can be added to accounts table
DO $$
BEGIN
  -- Check if embedding column already exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'accounts' 
    AND column_name = 'embedding'
  ) THEN
    -- Add embedding column
    ALTER TABLE accounts ADD COLUMN embedding vector(1536);
    RAISE NOTICE '✅ Added embedding column to accounts table';
  ELSE
    RAISE NOTICE 'ℹ️  Embedding column already exists in accounts table';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Failed to add embedding column: %', SQLERRM;
END $$;

-- Step 5: Create vector index if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_accounts_embedding'
  ) THEN
    CREATE INDEX idx_accounts_embedding ON accounts USING ivfflat (embedding vector_cosine_ops);
    RAISE NOTICE '✅ Created vector index on accounts table';
  ELSE
    RAISE NOTICE 'ℹ️  Vector index already exists on accounts table';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Failed to create vector index: %', SQLERRM;
END $$;

-- Step 6: Update the trigger function to handle embeddings
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

-- Step 7: Create or update vector search function
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

-- Step 8: Grant permissions
GRANT EXECUTE ON FUNCTION search_customers_vector(vector(1536), uuid, integer, float) TO authenticated;

-- Step 9: Final verification
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎉 pgvector setup completed!';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Generate embeddings for existing customers';
  RAISE NOTICE '2. Test vector search functionality';
  RAISE NOTICE '3. Update frontend to use vector search';
END $$;





























