-- ============================================================================
-- FIX MISSING LOG_SEARCH_SUCCESS FUNCTION
-- ============================================================================
-- Add the missing log_search_success function

-- Create the missing log_search_success function
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION log_search_success(TEXT, TEXT, INTEGER, INTEGER, JSONB) TO authenticated;

-- Test the function
DO $$
DECLARE
    test_tenant_id UUID := '7193113e-ece2-4f7b-ae8c-176df4367e28';
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
    
    RAISE NOTICE '🎉 Missing log_search_success function added successfully!';
END $$;
