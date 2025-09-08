-- ============================================================================
-- DEPLOY DATABASE SCHEMA FOR GLOBAL SEARCH
-- ============================================================================
-- Complete database setup for VeroSuite CRM Global Search functionality

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Drop existing tables if they have wrong column types
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS search_errors CASCADE;
DROP TABLE IF EXISTS search_logs CASCADE;

-- Create customers table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'USA',
    status TEXT DEFAULT 'active',
    account_type TEXT DEFAULT 'residential',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- Create accounts table (if it doesn't exist) - for compatibility
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'USA',
    status TEXT DEFAULT 'active',
    account_type TEXT DEFAULT 'residential',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- Create search_errors table for error logging
CREATE TABLE IF NOT EXISTS search_errors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID,
    user_id UUID,
    error_type TEXT NOT NULL,
    error_message TEXT NOT NULL,
    error_stack TEXT,
    query_text TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create search_logs table for analytics
CREATE TABLE IF NOT EXISTS search_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    user_id UUID,
    query_text TEXT NOT NULL,
    result_count INTEGER DEFAULT 0,
    response_time_ms INTEGER,
    search_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for customers table
DROP POLICY IF EXISTS customers_tenant_isolation ON customers;
CREATE POLICY customers_tenant_isolation ON customers
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Create RLS policies for accounts table
DROP POLICY IF EXISTS accounts_tenant_isolation ON accounts;
CREATE POLICY accounts_tenant_isolation ON accounts
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Create RLS policies for search_errors table
DROP POLICY IF EXISTS search_errors_tenant_isolation ON search_errors;
CREATE POLICY search_errors_tenant_isolation ON search_errors
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Create RLS policies for search_logs table
DROP POLICY IF EXISTS search_logs_tenant_isolation ON search_logs;
CREATE POLICY search_logs_tenant_isolation ON search_logs
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Grant permissions
GRANT ALL ON customers TO authenticated;
GRANT ALL ON accounts TO authenticated;
GRANT ALL ON search_errors TO authenticated;
GRANT ALL ON search_logs TO authenticated;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_tenant_id ON customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers USING gin((first_name || ' ' || last_name) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_address ON customers USING gin(address gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_accounts_tenant_id ON accounts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_accounts_name ON accounts USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_accounts_email ON accounts(email);
CREATE INDEX IF NOT EXISTS idx_accounts_phone ON accounts(phone);
CREATE INDEX IF NOT EXISTS idx_accounts_address ON accounts USING gin(address gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_search_errors_tenant_id ON search_errors(tenant_id);
CREATE INDEX IF NOT EXISTS idx_search_errors_created_at ON search_errors(created_at);
CREATE INDEX IF NOT EXISTS idx_search_logs_tenant_id ON search_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_search_logs_created_at ON search_logs(created_at);

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS search_customers_enhanced(text, uuid, integer, integer);
DROP FUNCTION IF EXISTS search_customers_multi_word(text, uuid, integer, integer);
DROP FUNCTION IF EXISTS search_customers_fuzzy(uuid, text, real, integer);

-- Create enhanced search function
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
  relevance_score double precision,
  match_type text,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    (c.first_name || ' ' || c.last_name)::text as name,
    c.email,
    c.phone,
    c.address,
    c.city,
    c.state,
    c.zip_code,
    c.status,
    c.account_type,
    CASE 
      WHEN p_search_term = '' THEN 1.0::double precision
      WHEN (c.first_name || ' ' || c.last_name) ILIKE '%' || p_search_term || '%' THEN 0.9::double precision
      WHEN c.first_name ILIKE '%' || p_search_term || '%' THEN 0.8::double precision
      WHEN c.last_name ILIKE '%' || p_search_term || '%' THEN 0.8::double precision
      WHEN c.phone ILIKE '%' || p_search_term || '%' THEN 0.7::double precision
      WHEN c.address ILIKE '%' || p_search_term || '%' THEN 0.6::double precision
      WHEN c.email ILIKE '%' || p_search_term || '%' THEN 0.5::double precision
      WHEN c.city ILIKE '%' || p_search_term || '%' THEN 0.4::double precision
      ELSE 0.1::double precision
    END as relevance_score,
    CASE 
      WHEN p_search_term = '' THEN 'all'
      WHEN (c.first_name || ' ' || c.last_name) ILIKE '%' || p_search_term || '%' THEN 'full_name_match'
      WHEN c.first_name ILIKE '%' || p_search_term || '%' THEN 'first_name_match'
      WHEN c.last_name ILIKE '%' || p_search_term || '%' THEN 'last_name_match'
      WHEN c.phone ILIKE '%' || p_search_term || '%' THEN 'phone_match'
      WHEN c.address ILIKE '%' || p_search_term || '%' THEN 'address_match'
      WHEN c.email ILIKE '%' || p_search_term || '%' THEN 'email_match'
      WHEN c.city ILIKE '%' || p_search_term || '%' THEN 'city_match'
      ELSE 'other_match'
    END as match_type,
    c.created_at,
    c.updated_at
  FROM customers c
  WHERE c.tenant_id = p_tenant_id
    AND (
      p_search_term = '' OR
      (c.first_name || ' ' || c.last_name) ILIKE '%' || p_search_term || '%' OR
      c.first_name ILIKE '%' || p_search_term || '%' OR
      c.last_name ILIKE '%' || p_search_term || '%' OR
      c.phone ILIKE '%' || p_search_term || '%' OR
      c.address ILIKE '%' || p_search_term || '%' OR
      c.email ILIKE '%' || p_search_term || '%' OR
      c.city ILIKE '%' || p_search_term || '%'
    )
  ORDER BY relevance_score DESC, c.first_name ASC, c.last_name ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create multi-word search function
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
  relevance_score double precision,
  match_type text,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
DECLARE
  search_words text[];
  word text;
  word_count integer;
BEGIN
  -- Split search term into words
  search_words := string_to_array(trim(p_search_term), ' ');
  word_count := array_length(search_words, 1);
  
  RETURN QUERY
  SELECT 
    c.id,
    (c.first_name || ' ' || c.last_name)::text as name,
    c.email,
    c.phone,
    c.address,
    c.city,
    c.state,
    c.zip_code,
    c.status,
    c.account_type,
    CASE 
      WHEN p_search_term = '' THEN 1.0::double precision
      WHEN word_count = 1 THEN
        CASE 
          WHEN (c.first_name || ' ' || c.last_name) ILIKE '%' || search_words[1] || '%' THEN 0.9::double precision
          WHEN c.first_name ILIKE '%' || search_words[1] || '%' THEN 0.8::double precision
          WHEN c.last_name ILIKE '%' || search_words[1] || '%' THEN 0.8::double precision
          WHEN c.phone ILIKE '%' || search_words[1] || '%' THEN 0.7::double precision
          WHEN c.address ILIKE '%' || search_words[1] || '%' THEN 0.6::double precision
          WHEN c.email ILIKE '%' || search_words[1] || '%' THEN 0.5::double precision
          ELSE 0.1::double precision
        END
      WHEN word_count = 2 THEN
        CASE 
          WHEN c.first_name ILIKE '%' || search_words[1] || '%' AND c.last_name ILIKE '%' || search_words[2] || '%' THEN 0.95::double precision
          WHEN c.first_name ILIKE '%' || search_words[2] || '%' AND c.last_name ILIKE '%' || search_words[1] || '%' THEN 0.95::double precision
          WHEN (c.first_name || ' ' || c.last_name) ILIKE '%' || search_words[1] || '%' AND (c.first_name || ' ' || c.last_name) ILIKE '%' || search_words[2] || '%' THEN 0.9::double precision
          ELSE 0.3::double precision
        END
      ELSE 0.5::double precision
    END as relevance_score,
    CASE 
      WHEN p_search_term = '' THEN 'all'
      WHEN word_count = 2 AND c.first_name ILIKE '%' || search_words[1] || '%' AND c.last_name ILIKE '%' || search_words[2] || '%' THEN 'first_last_match'
      WHEN word_count = 2 AND c.first_name ILIKE '%' || search_words[2] || '%' AND c.last_name ILIKE '%' || search_words[1] || '%' THEN 'last_first_match'
      ELSE 'multi_word_match'
    END as match_type,
    c.created_at,
    c.updated_at
  FROM customers c
  WHERE c.tenant_id = p_tenant_id
    AND (
      p_search_term = '' OR
      (word_count = 1 AND (
        (c.first_name || ' ' || c.last_name) ILIKE '%' || search_words[1] || '%' OR
        c.first_name ILIKE '%' || search_words[1] || '%' OR
        c.last_name ILIKE '%' || search_words[1] || '%' OR
        c.phone ILIKE '%' || search_words[1] || '%' OR
        c.address ILIKE '%' || search_words[1] || '%' OR
        c.email ILIKE '%' || search_words[1] || '%'
      )) OR
      (word_count = 2 AND (
        (c.first_name ILIKE '%' || search_words[1] || '%' AND c.last_name ILIKE '%' || search_words[2] || '%') OR
        (c.first_name ILIKE '%' || search_words[2] || '%' AND c.last_name ILIKE '%' || search_words[1] || '%') OR
        ((c.first_name || ' ' || c.last_name) ILIKE '%' || search_words[1] || '%' AND (c.first_name || ' ' || c.last_name) ILIKE '%' || search_words[2] || '%')
      )) OR
      (word_count > 2 AND (
        (c.first_name || ' ' || c.last_name) ILIKE '%' || p_search_term || '%' OR
        c.address ILIKE '%' || p_search_term || '%'
      ))
    )
  ORDER BY relevance_score DESC, c.first_name ASC, c.last_name ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create fuzzy search function (requires pg_trgm)
CREATE OR REPLACE FUNCTION search_customers_fuzzy(
  p_tenant_id uuid,
  p_search_term text,
  p_threshold real DEFAULT 0.3,
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
  similarity_score real,
  match_type text,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    (c.first_name || ' ' || c.last_name)::text as name,
    c.email,
    c.phone,
    c.address,
    c.city,
    c.state,
    c.zip_code,
    c.status,
    c.account_type,
    GREATEST(
      similarity((c.first_name || ' ' || c.last_name), p_search_term),
      similarity(c.first_name, p_search_term),
      similarity(c.last_name, p_search_term),
      similarity(c.phone, p_search_term),
      similarity(c.address, p_search_term),
      similarity(c.email, p_search_term)
    ) as similarity_score,
    CASE 
      WHEN similarity((c.first_name || ' ' || c.last_name), p_search_term) >= p_threshold THEN 'full_name_fuzzy'
      WHEN similarity(c.first_name, p_search_term) >= p_threshold THEN 'first_name_fuzzy'
      WHEN similarity(c.last_name, p_search_term) >= p_threshold THEN 'last_name_fuzzy'
      WHEN similarity(c.phone, p_search_term) >= p_threshold THEN 'phone_fuzzy'
      WHEN similarity(c.address, p_search_term) >= p_threshold THEN 'address_fuzzy'
      WHEN similarity(c.email, p_search_term) >= p_threshold THEN 'email_fuzzy'
      ELSE 'other_fuzzy'
    END as match_type,
    c.created_at,
    c.updated_at
  FROM customers c
  WHERE c.tenant_id = p_tenant_id
    AND (
      similarity((c.first_name || ' ' || c.last_name), p_search_term) >= p_threshold OR
      similarity(c.first_name, p_search_term) >= p_threshold OR
      similarity(c.last_name, p_search_term) >= p_threshold OR
      similarity(c.phone, p_search_term) >= p_threshold OR
      similarity(c.address, p_search_term) >= p_threshold OR
      similarity(c.email, p_search_term) >= p_threshold
    )
  ORDER BY similarity_score DESC, c.first_name ASC, c.last_name ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions on functions
GRANT EXECUTE ON FUNCTION search_customers_enhanced(text, uuid, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION search_customers_multi_word(text, uuid, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION search_customers_fuzzy(uuid, text, real, integer) TO authenticated;

-- Insert some test data
INSERT INTO customers (tenant_id, first_name, last_name, email, phone, address, city, state, zip_code) VALUES
('7193113e-ece2-4f7b-ae8c-176df4367e28', 'John', 'Smith', 'john.smith@example.com', '555-1234', '123 Main St', 'Anytown', 'CA', '12345'),
('7193113e-ece2-4f7b-ae8c-176df4367e28', 'Jane', 'Doe', 'jane.doe@example.com', '555-5678', '456 Oak Ave', 'Somewhere', 'NY', '67890'),
('7193113e-ece2-4f7b-ae8c-176df4367e28', 'Bob', 'Johnson', 'bob.johnson@example.com', '555-9999', '789 Pine Rd', 'Elsewhere', 'TX', '54321'),
('7193113e-ece2-4f7b-ae8c-176df4367e28', 'Alice', 'Williams', 'alice.williams@example.com', '555-1111', '321 Elm St', 'Nowhere', 'FL', '98765'),
('7193113e-ece2-4f7b-ae8c-176df4367e28', 'Charlie', 'Brown', 'charlie.brown@example.com', '555-2222', '654 Maple Dr', 'Everywhere', 'WA', '13579')
ON CONFLICT DO NOTHING;

-- Test the functions
DO $$
DECLARE
    test_tenant_id UUID := '7193113e-ece2-4f7b-ae8c-176df4367e28';
    test_result RECORD;
    result_count INTEGER;
BEGIN
    -- Test search_customers_enhanced
    SELECT COUNT(*) INTO result_count
    FROM search_customers_enhanced('John', test_tenant_id, 10, 0);
    
    RAISE NOTICE '✅ search_customers_enhanced: Found % results for "John"', result_count;
    
    -- Test search_customers_multi_word
    SELECT COUNT(*) INTO result_count
    FROM search_customers_multi_word('John Smith', test_tenant_id, 10, 0);
    
    RAISE NOTICE '✅ search_customers_multi_word: Found % results for "John Smith"', result_count;
    
    -- Test search_customers_fuzzy
    SELECT COUNT(*) INTO result_count
    FROM search_customers_fuzzy(test_tenant_id, 'Jon', 0.3, 10);
    
    RAISE NOTICE '✅ search_customers_fuzzy: Found % results for "Jon" (fuzzy)', result_count;
    
    RAISE NOTICE '🎉 Database schema deployment completed successfully!';
END $$;
