-- ============================================================================
-- SEARCH LOGGING MIGRATION (FIXED VERSION)
-- ============================================================================
-- Adds search logging table and functionality for AI-enhanced search
-- Fixed to work without user_tenants table dependency

-- Create search_logs table
CREATE TABLE IF NOT EXISTS search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  tenant_id UUID NOT NULL,
  query TEXT NOT NULL,
  results_count INTEGER NOT NULL,
  time_taken_ms INTEGER NOT NULL,
  clicked_record_id UUID REFERENCES accounts(id),
  search_filters JSONB, -- Store any filters applied (status, account_type, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_search_logs_tenant_id ON search_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_search_logs_user_id ON search_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_search_logs_created_at ON search_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_search_logs_query ON search_logs USING gin(to_tsvector('english', query));

-- Create search_corrections table for Phase 2
CREATE TABLE IF NOT EXISTS search_corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  original_query TEXT NOT NULL,
  corrected_query TEXT NOT NULL,
  success_count INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  confidence_score DECIMAL(3,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for corrections
CREATE INDEX IF NOT EXISTS idx_search_corrections_tenant_id ON search_corrections(tenant_id);
CREATE INDEX IF NOT EXISTS idx_search_corrections_original_query ON search_corrections(original_query);
CREATE INDEX IF NOT EXISTS idx_search_corrections_confidence ON search_corrections(confidence_score DESC);

-- Create function to update confidence score
CREATE OR REPLACE FUNCTION update_correction_confidence()
RETURNS TRIGGER AS $$
BEGIN
  NEW.confidence_score = CASE 
    WHEN NEW.total_attempts = 0 THEN 0.0
    ELSE ROUND((NEW.success_count::DECIMAL / NEW.total_attempts::DECIMAL)::DECIMAL, 2)
  END;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update confidence score
CREATE TRIGGER trigger_update_correction_confidence
  BEFORE UPDATE ON search_corrections
  FOR EACH ROW
  EXECUTE FUNCTION update_correction_confidence();

-- Create function to log search queries
CREATE OR REPLACE FUNCTION log_search(
  p_user_id UUID,
  p_tenant_id UUID,
  p_query TEXT,
  p_results_count INTEGER,
  p_time_taken_ms INTEGER,
  p_clicked_record_id UUID DEFAULT NULL,
  p_search_filters JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO search_logs (
    user_id,
    tenant_id,
    query,
    results_count,
    time_taken_ms,
    clicked_record_id,
    search_filters
  ) VALUES (
    p_user_id,
    p_tenant_id,
    p_query,
    p_results_count,
    p_time_taken_ms,
    p_clicked_record_id,
    p_search_filters
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to get search analytics
CREATE OR REPLACE FUNCTION get_search_analytics(
  p_tenant_id UUID,
  p_days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
  total_searches INTEGER,
  avg_results_count DECIMAL,
  avg_time_taken_ms DECIMAL,
  most_common_queries JSONB,
  zero_result_queries JSONB,
  click_through_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH search_stats AS (
    SELECT 
      COUNT(*) as total_searches,
      AVG(results_count) as avg_results_count,
      AVG(time_taken_ms) as avg_time_taken_ms,
      COUNT(CASE WHEN clicked_record_id IS NOT NULL THEN 1 END) as total_clicks
    FROM search_logs 
    WHERE tenant_id = p_tenant_id 
    AND created_at >= NOW() - INTERVAL '1 day' * p_days_back
  ),
  common_queries AS (
    SELECT 
      jsonb_agg(
        jsonb_build_object(
          'query', query,
          'count', query_count
        ) ORDER BY query_count DESC
      ) as most_common_queries
    FROM (
      SELECT query, COUNT(*) as query_count
      FROM search_logs 
      WHERE tenant_id = p_tenant_id 
      AND created_at >= NOW() - INTERVAL '1 day' * p_days_back
      GROUP BY query
      ORDER BY query_count DESC
      LIMIT 10
    ) q
  ),
  zero_results AS (
    SELECT 
      jsonb_agg(
        jsonb_build_object(
          'query', query,
          'count', query_count
        ) ORDER BY query_count DESC
      ) as zero_result_queries
    FROM (
      SELECT query, COUNT(*) as query_count
      FROM search_logs 
      WHERE tenant_id = p_tenant_id 
      AND created_at >= NOW() - INTERVAL '1 day' * p_days_back
      AND results_count = 0
      GROUP BY query
      ORDER BY query_count DESC
      LIMIT 10
    ) z
  )
  SELECT 
    s.total_searches,
    s.avg_results_count,
    s.avg_time_taken_ms,
    COALESCE(c.most_common_queries, '[]'::jsonb) as most_common_queries,
    COALESCE(z.zero_result_queries, '[]'::jsonb) as zero_result_queries,
    CASE 
      WHEN s.total_searches = 0 THEN 0.0
      ELSE ROUND((s.total_clicks::DECIMAL / s.total_searches::DECIMAL * 100)::DECIMAL, 2)
    END as click_through_rate
  FROM search_stats s
  CROSS JOIN common_queries c
  CROSS JOIN zero_results z;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT SELECT, INSERT ON search_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON search_corrections TO authenticated;
GRANT EXECUTE ON FUNCTION log_search(UUID, UUID, TEXT, INTEGER, INTEGER, UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_search_analytics(UUID, INTEGER) TO authenticated;

-- Add RLS policies (simplified without user_tenants dependency)
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_corrections ENABLE ROW LEVEL SECURITY;

-- RLS policy for search_logs - allow users to see their own logs
CREATE POLICY "Users can view their own search logs" ON search_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own search logs" ON search_logs
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS policy for search_corrections - allow users to see tenant corrections
CREATE POLICY "Users can view tenant corrections" ON search_corrections
  FOR SELECT USING (true); -- Allow all authenticated users to view corrections

CREATE POLICY "Users can insert tenant corrections" ON search_corrections
  FOR INSERT WITH CHECK (true); -- Allow all authenticated users to insert corrections

CREATE POLICY "Users can update tenant corrections" ON search_corrections
  FOR UPDATE USING (true); -- Allow all authenticated users to update corrections

-- Insert some initial synonym mappings for Phase 2
-- Use a generic tenant ID that will work for all users
INSERT INTO search_corrections (tenant_id, original_query, corrected_query, success_count, total_attempts) VALUES
  ('00000000-0000-0000-0000-000000000000', 'st', 'street', 0, 0),
  ('00000000-0000-0000-0000-000000000000', 'ave', 'avenue', 0, 0),
  ('00000000-0000-0000-0000-000000000000', 'rd', 'road', 0, 0),
  ('00000000-0000-0000-0000-000000000000', 'blvd', 'boulevard', 0, 0),
  ('00000000-0000-0000-0000-000000000000', 'dr', 'drive', 0, 0),
  ('00000000-0000-0000-0000-000000000000', 'ln', 'lane', 0, 0),
  ('00000000-0000-0000-0000-000000000000', 'ct', 'court', 0, 0),
  ('00000000-0000-0000-0000-000000000000', 'pl', 'place', 0, 0),
  ('00000000-0000-0000-0000-000000000000', 'apt', 'apartment', 0, 0),
  ('00000000-0000-0000-0000-000000000000', 'ste', 'suite', 0, 0)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE search_logs IS 'Stores search queries and results for AI training and analytics';
COMMENT ON TABLE search_corrections IS 'Stores search corrections and synonyms for improved search accuracy';
COMMENT ON FUNCTION log_search IS 'Logs a search query with metadata for analytics and AI training';
COMMENT ON FUNCTION get_search_analytics IS 'Returns search analytics for a tenant over a specified time period';



















