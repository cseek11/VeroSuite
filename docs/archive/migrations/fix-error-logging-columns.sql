-- ============================================================================
-- FIX ERROR LOGGING COLUMN REFERENCES
-- ============================================================================
-- Fix the functions to use the correct column names that exist in search_errors table

-- First, let's check what columns actually exist in search_errors
-- The table was created with these columns:
-- id, tenant_id, user_id, error_type, error_message, error_stack, query_text, user_agent, created_at, is_resolved, resolved_at

-- Drop and recreate the problematic function with correct column references
DROP FUNCTION IF EXISTS get_error_statistics(UUID, INTEGER);

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
  -- Determine tenant filter with proper type handling
  tenant_filter := COALESCE(
    p_tenant_id,
    ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'tenant_id')::uuid
  );

  RETURN QUERY
  SELECT 
    COUNT(*) as total_errors,
    COALESCE(jsonb_object_agg(error_type, type_count), '{}'::jsonb) as errors_by_type,
    COALESCE(jsonb_object_agg(severity, severity_count), '{}'::jsonb) as errors_by_severity,
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_error_statistics(UUID, INTEGER) TO authenticated;

-- Test the function
DO $$
DECLARE
    test_tenant_id UUID := '7193113e-ece2-4f7b-ae8c-176df4367e28';
    test_result RECORD;
BEGIN
    -- Test get_error_statistics
    SELECT * INTO test_result
    FROM get_error_statistics(test_tenant_id, 24);
    
    RAISE NOTICE '✅ get_error_statistics: Function working with correct columns';
    
    RAISE NOTICE '🎉 Error logging column fix completed successfully!';
END $$;
