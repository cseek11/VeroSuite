-- ============================================================================
-- FIX SEARCH LOGGING FUNCTIONS
-- ============================================================================
-- Create the missing search logging functions

-- Create log_search_query function
CREATE OR REPLACE FUNCTION log_search_query(
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

-- Create get_search_analytics function
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
    SELECT jsonb_agg(
      jsonb_build_object('query', query, 'count', query_count)
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
  zero_result_queries AS (
    SELECT jsonb_agg(
      jsonb_build_object('query', query, 'count', query_count)
    ) as zero_result_queries
    FROM (
      SELECT query, COUNT(*) as query_count
      FROM search_logs 
      WHERE tenant_id = p_tenant_id 
        AND results_count = 0
        AND created_at >= NOW() - INTERVAL '1 day' * p_days_back
      GROUP BY query
      ORDER BY query_count DESC
      LIMIT 10
    ) z
  )
  SELECT 
    COALESCE(ss.total_searches, 0)::INTEGER,
    COALESCE(ss.avg_results_count, 0)::DECIMAL,
    COALESCE(ss.avg_time_taken_ms, 0)::DECIMAL,
    COALESCE(cq.most_common_queries, '[]'::jsonb),
    COALESCE(zrq.zero_result_queries, '[]'::jsonb),
    CASE 
      WHEN ss.total_searches > 0 THEN (ss.total_clicks::DECIMAL / ss.total_searches::DECIMAL)
      ELSE 0::DECIMAL
    END
  FROM search_stats ss
  CROSS JOIN common_queries cq
  CROSS JOIN zero_result_queries zrq;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION log_search_query TO authenticated;
GRANT EXECUTE ON FUNCTION get_search_analytics TO authenticated;

-- Add comments
COMMENT ON FUNCTION log_search_query IS 'Logs a search query with results and timing information';
COMMENT ON FUNCTION get_search_analytics IS 'Returns search analytics for a tenant over a specified time period';





