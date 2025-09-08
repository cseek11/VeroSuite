-- ============================================================================
-- SIMPLE FIX FOR ERROR LOGGING FUNCTIONS
-- ============================================================================
-- Simplified functions that work with the existing search_errors table structure

-- Drop existing problematic functions
DROP FUNCTION IF EXISTS get_error_statistics(UUID, INTEGER);
DROP FUNCTION IF EXISTS get_recent_errors(UUID, INTEGER, INTEGER);
DROP FUNCTION IF EXISTS get_search_performance_metrics(UUID, INTEGER);
DROP FUNCTION IF EXISTS resolve_error(UUID);

-- Create simplified get_error_statistics function
CREATE OR REPLACE FUNCTION get_error_statistics(
  p_tenant_id UUID DEFAULT NULL,
  p_hours_back INTEGER DEFAULT 24
)
RETURNS TABLE (
  total_errors BIGINT,
  errors_by_type JSONB,
  errors_by_severity JSONB,
  unresolved_errors BIGINT,
  recent_errors BIGINT,
  avg_resolution_time_hours NUMERIC
) AS $$
DECLARE
  tenant_filter UUID;
BEGIN
  -- Determine tenant filter
  tenant_filter := COALESCE(
    p_tenant_id,
    ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'tenant_id')::uuid
  );

  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM search_errors WHERE (tenant_filter IS NULL OR tenant_id = tenant_filter)) as total_errors,
    (SELECT COALESCE(jsonb_object_agg(error_type, count), '{}'::jsonb) 
     FROM (SELECT error_type, COUNT(*) as count 
           FROM search_errors 
           WHERE (tenant_filter IS NULL OR tenant_id = tenant_filter)
           GROUP BY error_type) t) as errors_by_type,
    (SELECT COALESCE(jsonb_object_agg(severity, count), '{}'::jsonb)
     FROM (SELECT 
             CASE 
               WHEN error_message ILIKE '%critical%' OR error_message ILIKE '%fatal%' THEN 'critical'
               WHEN error_message ILIKE '%error%' THEN 'high'
               WHEN error_message ILIKE '%warning%' THEN 'medium'
               ELSE 'low'
             END as severity,
             COUNT(*) as count
           FROM search_errors 
           WHERE (tenant_filter IS NULL OR tenant_id = tenant_filter)
           GROUP BY severity) s) as errors_by_severity,
    (SELECT COUNT(*) FROM search_errors 
     WHERE (tenant_filter IS NULL OR tenant_id = tenant_filter) 
     AND is_resolved = false) as unresolved_errors,
    (SELECT COUNT(*) FROM search_errors 
     WHERE (tenant_filter IS NULL OR tenant_id = tenant_filter) 
     AND created_at > NOW() - INTERVAL '1 hour' * p_hours_back) as recent_errors,
    (SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600), 0)
     FROM search_errors 
     WHERE (tenant_filter IS NULL OR tenant_id = tenant_filter) 
     AND is_resolved = true) as avg_resolution_time_hours;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create simplified get_recent_errors function
CREATE OR REPLACE FUNCTION get_recent_errors(
  p_tenant_id UUID DEFAULT NULL,
  p_limit INTEGER DEFAULT 50,
  p_hours_back INTEGER DEFAULT 24
)
RETURNS TABLE (
  id UUID,
  error_type TEXT,
  error_message TEXT,
  query_text TEXT,
  created_at TIMESTAMPTZ,
  is_resolved BOOLEAN,
  resolved_at TIMESTAMPTZ
) AS $$
DECLARE
  tenant_filter UUID;
BEGIN
  -- Determine tenant filter
  tenant_filter := COALESCE(
    p_tenant_id,
    ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'tenant_id')::uuid
  );

  RETURN QUERY
  SELECT 
    se.id,
    se.error_type,
    se.error_message,
    se.query_text,
    se.created_at,
    se.is_resolved,
    se.resolved_at
  FROM search_errors se
  WHERE (tenant_filter IS NULL OR se.tenant_id = tenant_filter)
    AND se.created_at > NOW() - INTERVAL '1 hour' * p_hours_back
  ORDER BY se.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create simplified get_search_performance_metrics function
CREATE OR REPLACE FUNCTION get_search_performance_metrics(
  p_tenant_id UUID DEFAULT NULL,
  p_days_back INTEGER DEFAULT 7
)
RETURNS TABLE (
  total_searches BIGINT,
  avg_response_time_ms NUMERIC,
  avg_results_count NUMERIC,
  searches_by_type JSONB,
  performance_trend JSONB
) AS $$
DECLARE
  tenant_filter UUID;
BEGIN
  -- Determine tenant filter
  tenant_filter := COALESCE(
    p_tenant_id,
    ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'tenant_id')::uuid
  );

  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM search_logs 
     WHERE (tenant_filter IS NULL OR tenant_id = tenant_filter)
     AND created_at > NOW() - INTERVAL '1 day' * p_days_back) as total_searches,
    (SELECT AVG(response_time_ms) FROM search_logs 
     WHERE (tenant_filter IS NULL OR tenant_id = tenant_filter)
     AND created_at > NOW() - INTERVAL '1 day' * p_days_back) as avg_response_time_ms,
    (SELECT AVG(result_count) FROM search_logs 
     WHERE (tenant_filter IS NULL OR tenant_id = tenant_filter)
     AND created_at > NOW() - INTERVAL '1 day' * p_days_back) as avg_results_count,
    (SELECT COALESCE(jsonb_object_agg(search_type, count), '{}'::jsonb)
     FROM (SELECT search_type, COUNT(*) as count 
           FROM search_logs 
           WHERE (tenant_filter IS NULL OR tenant_id = tenant_filter)
           AND created_at > NOW() - INTERVAL '1 day' * p_days_back
           GROUP BY search_type) t) as searches_by_type,
    (SELECT COALESCE(jsonb_object_agg(date_str, count), '{}'::jsonb)
     FROM (SELECT date_trunc('day', created_at)::date::text as date_str, COUNT(*) as count
           FROM search_logs 
           WHERE (tenant_filter IS NULL OR tenant_id = tenant_filter)
           AND created_at > NOW() - INTERVAL '1 day' * p_days_back
           GROUP BY date_trunc('day', created_at)::date) d) as performance_trend;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create simplified resolve_error function
CREATE OR REPLACE FUNCTION resolve_error(
  p_error_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  tenant_filter UUID;
BEGIN
  -- Determine tenant filter
  tenant_filter := ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'tenant_id')::uuid;

  UPDATE search_errors 
  SET 
    is_resolved = true,
    resolved_at = NOW()
  WHERE id = p_error_id
    AND (tenant_filter IS NULL OR tenant_id = tenant_filter);

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_error_statistics(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_errors(UUID, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_search_performance_metrics(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION resolve_error(UUID) TO authenticated;

-- Test the functions
DO $$
DECLARE
    test_tenant_id UUID := '7193113e-ece2-4f7b-ae8c-176df4367e28';
    test_result RECORD;
BEGIN
    -- Test get_error_statistics
    SELECT * INTO test_result
    FROM get_error_statistics(test_tenant_id, 24);
    
    RAISE NOTICE '✅ get_error_statistics: Function working';
    
    -- Test get_recent_errors
    SELECT * INTO test_result
    FROM get_recent_errors(test_tenant_id, 10, 24)
    LIMIT 1;
    
    RAISE NOTICE '✅ get_recent_errors: Function working';
    
    -- Test get_search_performance_metrics
    SELECT * INTO test_result
    FROM get_search_performance_metrics(test_tenant_id, 7);
    
    RAISE NOTICE '✅ get_search_performance_metrics: Function working';
    
    RAISE NOTICE '🎉 Simplified error logging functions deployed successfully!';
END $$;
