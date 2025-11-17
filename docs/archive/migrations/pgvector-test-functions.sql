-- ============================================================================
-- PGVECTOR TEST FUNCTIONS
-- ============================================================================
-- Helper functions to test pgvector functionality

-- Function to check if pgvector extension is available
CREATE OR REPLACE FUNCTION check_pgvector_extension()
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  -- Check if pgvector extension exists
  SELECT json_build_object(
    'extension_exists', EXISTS (
      SELECT 1 FROM pg_extension WHERE extname = 'pgvector'
    ),
    'extension_version', (
      SELECT extversion FROM pg_extension WHERE extname = 'pgvector'
    ),
    'vector_type_available', EXISTS (
      SELECT 1 FROM pg_type WHERE typname = 'vector'
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to test vector creation
CREATE OR REPLACE FUNCTION test_vector_creation()
RETURNS json AS $$
DECLARE
  test_vector vector(3);
  result json;
BEGIN
  -- Try to create a simple 3-dimensional vector
  test_vector := '[1,2,3]'::vector;
  
  SELECT json_build_object(
    'success', true,
    'vector_created', test_vector,
    'vector_dimensions', 3
  ) INTO result;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    SELECT json_build_object(
      'success', false,
      'error', SQLERRM,
      'error_code', SQLSTATE
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to test vector column addition
CREATE OR REPLACE FUNCTION test_vector_column()
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  -- Try to add a test vector column to a temporary table
  CREATE TEMP TABLE test_vector_table (
    id serial PRIMARY KEY,
    test_vector vector(3)
  );
  
  -- Insert a test vector
  INSERT INTO test_vector_table (test_vector) VALUES ('[1,2,3]'::vector);
  
  -- Query the vector
  SELECT json_build_object(
    'success', true,
    'table_created', true,
    'vector_inserted', true,
    'vector_queried', (SELECT test_vector FROM test_vector_table LIMIT 1)
  ) INTO result;
  
  -- Clean up
  DROP TABLE test_vector_table;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Clean up on error
    DROP TABLE IF EXISTS test_vector_table;
    
    SELECT json_build_object(
      'success', false,
      'error', SQLERRM,
      'error_code', SQLSTATE
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to test vector similarity operations
CREATE OR REPLACE FUNCTION test_vector_similarity()
RETURNS json AS $$
DECLARE
  v1 vector(3);
  v2 vector(3);
  similarity float;
  result json;
BEGIN
  -- Create test vectors
  v1 := '[1,2,3]'::vector;
  v2 := '[4,5,6]'::vector;
  
  -- Test cosine similarity
  similarity := 1 - (v1 <=> v2);
  
  SELECT json_build_object(
    'success', true,
    'vector1', v1,
    'vector2', v2,
    'cosine_similarity', similarity,
    'distance', v1 <=> v2
  ) INTO result;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    SELECT json_build_object(
      'success', false,
      'error', SQLERRM,
      'error_code', SQLSTATE
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION check_pgvector_extension() TO authenticated;
GRANT EXECUTE ON FUNCTION test_vector_creation() TO authenticated;
GRANT EXECUTE ON FUNCTION test_vector_column() TO authenticated;
GRANT EXECUTE ON FUNCTION test_vector_similarity() TO authenticated;
