-- ============================================================================
-- DEPLOY ERROR LOGGING SYSTEM
-- ============================================================================
-- Database functions and procedures to support comprehensive error logging

-- Create function to log search success
CREATE OR REPLACE FUNCTION log_search_success(
  p_operation TEXT,
  p_query TEXT,
  p_results_count INTEGER,
  p_execution_time_ms INTEGER,
  p_context JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID AS $$
DECLARE
  tenant_id_val UUID;
  user_id_val UUID;
BEGIN
  -- Extract tenant_id with proper type handling
  tenant_id_val := COALESCE(
    (p_context ->> 'tenantId')::uuid,
    ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'tenant_id')::uuid
  );
  
  -- Extract user_id with proper type handling
  user_id_val := COALESCE(
    (p_context ->> 'userId')::uuid,
    auth.uid()
  );

  INSERT INTO search_logs (
    tenant_id,
    user_id,
    query_text,
    result_count,
    response_time_ms,
    search_type,
    created_at
  ) VALUES (
    tenant_id_val,
    user_id_val,
    p_query,
    p_results_count,
    p_execution_time_ms,
    p_operation,
    NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get error statistics
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
    COUNT(*) as total_errors,
    jsonb_object_agg(error_type, type_count) as errors_by_type,
    jsonb_object_agg(severity, severity_count) as errors_by_severity,
    COUNT(*) FILTER (WHERE is_resolved = false) as unresolved_errors,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour' * p_hours_back) as recent_errors,
    COALESCE(
      AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600) FILTER (WHERE is_resolved = true),
      0
    ) as avg_resolution_time_hours
  FROM (
    SELECT 
      error_type,
      COUNT(*) as type_count
    FROM search_errors 
    WHERE (tenant_filter IS NULL OR tenant_id = tenant_filter)
    GROUP BY error_type
  ) type_stats
  CROSS JOIN (
    SELECT 
      CASE 
        WHEN error_message ILIKE '%critical%' OR error_message ILIKE '%fatal%' THEN 'critical'
        WHEN error_message ILIKE '%error%' THEN 'high'
        WHEN error_message ILIKE '%warning%' THEN 'medium'
        ELSE 'low'
      END as severity,
      COUNT(*) as severity_count
    FROM search_errors 
    WHERE (tenant_filter IS NULL OR tenant_id = tenant_filter)
    GROUP BY severity
  ) severity_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get recent errors
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

-- Create function to resolve errors
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

-- Create function to get search performance metrics
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
    COUNT(*) as total_searches,
    AVG(response_time_ms) as avg_response_time_ms,
    AVG(result_count) as avg_results_count,
    jsonb_object_agg(search_type, type_count) as searches_by_type,
    jsonb_object_agg(
      date_trunc('day', created_at)::date::text,
      daily_count
    ) as performance_trend
  FROM (
    SELECT 
      search_type,
      COUNT(*) as type_count
    FROM search_logs 
    WHERE (tenant_filter IS NULL OR tenant_id = tenant_filter)
      AND created_at > NOW() - INTERVAL '1 day' * p_days_back
    GROUP BY search_type
  ) type_stats
  CROSS JOIN (
    SELECT 
      date_trunc('day', created_at)::date,
      COUNT(*) as daily_count
    FROM search_logs 
    WHERE (tenant_filter IS NULL OR tenant_id = tenant_filter)
      AND created_at > NOW() - INTERVAL '1 day' * p_days_back
    GROUP BY date_trunc('day', created_at)::date
  ) trend_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION log_search_success(TEXT, TEXT, INTEGER, INTEGER, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_error_statistics(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_errors(UUID, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION resolve_error(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_search_performance_metrics(UUID, INTEGER) TO authenticated;

-- Test the functions
DO $$
DECLARE
    test_tenant_id UUID := '7193113e-ece2-4f7b-ae8c-176df4367e28';
    test_result RECORD;
BEGIN
    -- Test log_search_success
    PERFORM log_search_success(
        'test_operation',
        'test query',
        5,
        100,
        jsonb_build_object('tenantId', test_tenant_id)
    );
    
    RAISE NOTICE '✅ log_search_success: Function working';
    
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
    
    RAISE NOTICE '🎉 Error logging system deployment completed successfully!';
END $$;
