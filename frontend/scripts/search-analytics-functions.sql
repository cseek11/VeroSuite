-- ===== SEARCH ANALYTICS FUNCTIONS =====
-- Functions for collecting, aggregating, and analyzing search performance data

-- ===== SEARCH LOGGING FUNCTIONS =====

-- Function to log a search query
CREATE OR REPLACE FUNCTION log_search_query(
    p_tenant_id UUID,
    p_user_id UUID,
    p_session_id VARCHAR(255),
    p_query_text TEXT,
    p_query_type VARCHAR(50),
    p_search_mode VARCHAR(50),
    p_results_count INTEGER,
    p_execution_time_ms INTEGER,
    p_cache_hit BOOLEAN DEFAULT FALSE,
    p_search_successful BOOLEAN DEFAULT TRUE,
    p_error_message TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    -- Insert search log
    INSERT INTO search_logs (
        tenant_id, user_id, session_id, query_text, query_type, search_mode,
        results_count, execution_time_ms, cache_hit, search_successful,
        error_message, user_agent, ip_address
    ) VALUES (
        p_tenant_id, p_user_id, p_session_id, p_query_text, p_query_type, p_search_mode,
        p_results_count, p_execution_time_ms, p_cache_hit, p_search_successful,
        p_error_message, p_user_agent, p_ip_address
    ) RETURNING id INTO v_log_id;

    -- Update popular searches
    PERFORM update_popular_searches(p_tenant_id, p_query_text, p_results_count, p_search_successful);
    
    -- Update user behavior
    PERFORM update_user_search_behavior(p_tenant_id, p_user_id, p_query_text, p_search_mode, p_results_count, p_search_successful);
    
    -- Update performance metrics
    PERFORM update_search_performance_metrics(p_tenant_id, p_execution_time_ms, p_cache_hit, p_search_successful);
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log search result clicks
CREATE OR REPLACE FUNCTION log_search_click(
    p_log_id UUID,
    p_clicked_result_id UUID,
    p_clicked_result_position INTEGER,
    p_time_to_click_ms INTEGER
) RETURNS VOID AS $$
BEGIN
    UPDATE search_logs 
    SET 
        clicked_result_id = p_clicked_result_id,
        clicked_result_position = p_clicked_result_position,
        time_to_click_ms = p_time_to_click_ms
    WHERE id = p_log_id;
    
    -- Update click-through metrics
    PERFORM update_click_through_metrics(p_log_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log search errors
CREATE OR REPLACE FUNCTION log_search_error(
    p_tenant_id UUID,
    p_user_id UUID,
    p_error_type VARCHAR(100),
    p_error_message TEXT,
    p_error_stack TEXT DEFAULT NULL,
    p_query_text TEXT DEFAULT NULL,
    p_search_mode VARCHAR(50) DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_error_id UUID;
BEGIN
    -- Check if similar error already exists
    SELECT id INTO v_error_id 
    FROM search_errors 
    WHERE tenant_id = p_tenant_id 
    AND error_type = p_error_type 
    AND error_message = p_error_message
    AND is_resolved = FALSE;
    
    IF v_error_id IS NOT NULL THEN
        -- Update existing error frequency
        UPDATE search_errors 
        SET 
            error_frequency = error_frequency + 1,
            affected_users = affected_users + CASE WHEN user_id != p_user_id THEN 1 ELSE 0 END,
            updated_at = NOW()
        WHERE id = v_error_id;
        
        RETURN v_error_id;
    ELSE
        -- Create new error record
        INSERT INTO search_errors (
            tenant_id, user_id, error_type, error_message, error_stack,
            query_text, search_mode, user_agent, ip_address
        ) VALUES (
            p_tenant_id, p_user_id, p_error_type, p_error_message, p_error_stack,
            p_query_text, p_search_mode, p_user_agent, p_ip_address
        ) RETURNING id INTO v_error_id;
        
        RETURN v_error_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== POPULAR SEARCHES FUNCTIONS =====

-- Function to update popular searches
CREATE OR REPLACE FUNCTION update_popular_searches(
    p_tenant_id UUID,
    p_query_text TEXT,
    p_results_count INTEGER,
    p_search_successful BOOLEAN
) RETURNS VOID AS $$
DECLARE
    v_query_hash VARCHAR(64);
    v_query_length INTEGER;
    v_word_count INTEGER;
    v_has_numbers BOOLEAN;
    v_has_special_chars BOOLEAN;
    v_existing_id UUID;
BEGIN
    -- Generate query hash for grouping similar queries
    v_query_hash := encode(sha256(p_query_text::bytea), 'hex');
    
    -- Analyze query characteristics
    v_query_length := length(p_query_text);
    v_word_count := array_length(string_to_array(trim(p_query_text), ' '), 1);
    v_has_numbers := p_query_text ~ '[0-9]';
    v_has_special_chars := p_query_text ~ '[^a-zA-Z0-9\s]';
    
    -- Check if query already exists
    SELECT id INTO v_existing_id 
    FROM popular_searches 
    WHERE tenant_id = p_tenant_id AND query_hash = v_query_hash;
    
    IF v_existing_id IS NOT NULL THEN
        -- Update existing query
        UPDATE popular_searches 
        SET 
            search_count = search_count + 1,
            last_searched_at = NOW(),
            success_rate = (success_rate * (search_count - 1) + CASE WHEN p_search_successful THEN 1 ELSE 0 END) / search_count,
            avg_results_count = (avg_results_count * (search_count - 1) + p_results_count) / search_count,
            updated_at = NOW()
        WHERE id = v_existing_id;
    ELSE
        -- Create new query record
        INSERT INTO popular_searches (
            tenant_id, query_text, query_hash, query_length, word_count,
            has_numbers, has_special_chars, success_rate, avg_results_count
        ) VALUES (
            p_tenant_id, p_query_text, v_query_hash, v_query_length, v_word_count,
            v_has_numbers, v_has_special_chars, 
            CASE WHEN p_search_successful THEN 1.0 ELSE 0.0 END,
            p_results_count
        );
    END IF;
    
    -- Update trending status
    PERFORM update_trending_status(p_tenant_id, v_query_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update trending status
CREATE OR REPLACE FUNCTION update_trending_status(
    p_tenant_id UUID,
    p_query_hash VARCHAR(64)
) RETURNS VOID AS $$
DECLARE
    v_recent_searches INTEGER;
    v_trend_score DECIMAL(5,4);
BEGIN
    -- Count searches in last 24 hours
    SELECT COUNT(*) INTO v_recent_searches
    FROM search_logs 
    WHERE tenant_id = p_tenant_id 
    AND query_text IN (SELECT query_text FROM popular_searches WHERE query_hash = p_query_hash)
    AND created_at >= NOW() - INTERVAL '24 hours';
    
    -- Calculate trend score (0.0 to 1.0)
    v_trend_score := LEAST(v_recent_searches::DECIMAL / 10.0, 1.0);
    
    -- Update trending status
    UPDATE popular_searches 
    SET 
        is_trending = v_trend_score >= 0.3,
        trend_score = v_trend_score,
        updated_at = NOW()
    WHERE tenant_id = p_tenant_id AND query_hash = p_query_hash;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== USER BEHAVIOR FUNCTIONS =====

-- Function to update user search behavior
CREATE OR REPLACE FUNCTION update_user_search_behavior(
    p_tenant_id UUID,
    p_user_id UUID,
    p_query_text TEXT,
    p_search_mode VARCHAR(50),
    p_results_count INTEGER,
    p_search_successful BOOLEAN
) RETURNS VOID AS $$
DECLARE
    v_existing_id UUID;
    v_total_searches INTEGER;
    v_avg_query_length DECIMAL(5,2);
    v_most_common_queries TEXT[];
BEGIN
    -- Check if user behavior record exists
    SELECT id, total_searches, avg_query_length, most_common_queries 
    INTO v_existing_id, v_total_searches, v_avg_query_length, v_most_common_queries
    FROM search_user_behavior 
    WHERE tenant_id = p_tenant_id AND user_id = p_user_id;
    
    IF v_existing_id IS NOT NULL THEN
        -- Update existing record
        UPDATE search_user_behavior 
        SET 
            total_searches = total_searches + 1,
            successful_searches = successful_searches + CASE WHEN p_search_successful THEN 1 ELSE 0 END,
            avg_query_length = (avg_query_length * v_total_searches + length(p_query_text)) / (v_total_searches + 1),
            avg_search_success_rate = (avg_search_success_rate * v_total_searches + CASE WHEN p_search_successful THEN 1 ELSE 0 END) / (v_total_searches + 1),
            last_search_at = NOW(),
            updated_at = NOW()
        WHERE id = v_existing_id;
        
        -- Update most common queries (keep top 10)
        v_most_common_queries := array_append(v_most_common_queries, p_query_text);
        IF array_length(v_most_common_queries, 1) > 10 THEN
            v_most_common_queries := v_most_common_queries[2:11];
        END IF;
        
        UPDATE search_user_behavior 
        SET most_common_queries = v_most_common_queries
        WHERE id = v_existing_id;
        
    ELSE
        -- Create new record
        INSERT INTO search_user_behavior (
            tenant_id, user_id, preferred_search_mode, total_searches, successful_searches,
            avg_query_length, avg_search_success_rate, most_common_queries, last_search_at
        ) VALUES (
            p_tenant_id, p_user_id, p_search_mode, 1, 
            CASE WHEN p_search_successful THEN 1 ELSE 0 END,
            length(p_query_text), 
            CASE WHEN p_search_successful THEN 1.0 ELSE 0.0 END,
            ARRAY[p_query_text], NOW()
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== PERFORMANCE METRICS FUNCTIONS =====

-- Function to update search performance metrics
CREATE OR REPLACE FUNCTION update_search_performance_metrics(
    p_tenant_id UUID,
    p_execution_time_ms INTEGER,
    p_cache_hit BOOLEAN,
    p_search_successful BOOLEAN
) RETURNS VOID AS $$
DECLARE
    v_metric_date DATE;
    v_metric_hour INTEGER;
    v_existing_id UUID;
BEGIN
    -- Get current date and hour
    v_metric_date := CURRENT_DATE;
    v_metric_hour := EXTRACT(HOUR FROM NOW());
    
    -- Check if metrics record exists for this hour
    SELECT id INTO v_existing_id 
    FROM search_performance_metrics 
    WHERE tenant_id = p_tenant_id 
    AND metric_date = v_metric_date 
    AND metric_hour = v_metric_hour;
    
    IF v_existing_id IS NOT NULL THEN
        -- Update existing metrics
        UPDATE search_performance_metrics 
        SET 
            total_searches = total_searches + 1,
            avg_execution_time_ms = (avg_execution_time_ms * total_searches + p_execution_time_ms) / (total_searches + 1),
            cache_hits = cache_hits + CASE WHEN p_cache_hit THEN 1 ELSE 0 END,
            cache_misses = cache_misses + CASE WHEN p_cache_hit THEN 0 ELSE 1 END,
            cache_hit_rate = (cache_hits + CASE WHEN p_cache_hit THEN 1 ELSE 0 END)::DECIMAL / (total_searches + 1),
            error_count = error_count + CASE WHEN NOT p_search_successful THEN 1 ELSE 0 END,
            success_rate = (success_rate * total_searches + CASE WHEN p_search_successful THEN 1 ELSE 0 END) / (total_searches + 1),
            updated_at = NOW()
        WHERE id = v_existing_id;
    ELSE
        -- Create new metrics record
        INSERT INTO search_performance_metrics (
            tenant_id, metric_date, metric_hour, total_searches,
            avg_execution_time_ms, cache_hits, cache_misses, cache_hit_rate,
            error_count, success_rate
        ) VALUES (
            p_tenant_id, v_metric_date, v_metric_hour, 1,
            p_execution_time_ms, 
            CASE WHEN p_cache_hit THEN 1 ELSE 0 END,
            CASE WHEN p_cache_hit THEN 0 ELSE 1 END,
            CASE WHEN p_cache_hit THEN 1.0 ELSE 0.0 END,
            CASE WHEN NOT p_search_successful THEN 1 ELSE 0 END,
            CASE WHEN p_search_successful THEN 1.0 ELSE 0.0 END
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== ANALYTICS QUERY FUNCTIONS =====

-- Function to get search performance summary
CREATE OR REPLACE FUNCTION get_search_performance_summary(
    p_tenant_id UUID,
    p_days_back INTEGER DEFAULT 30
) RETURNS TABLE (
    total_searches BIGINT,
    unique_users BIGINT,
    avg_execution_time_ms DECIMAL(10,2),
    success_rate DECIMAL(5,4),
    cache_hit_rate DECIMAL(5,4),
    avg_results_per_search DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        SUM(spm.total_searches)::BIGINT,
        COUNT(DISTINCT sl.user_id)::BIGINT,
        AVG(spm.avg_execution_time_ms),
        AVG(spm.success_rate),
        AVG(spm.cache_hit_rate),
        AVG(spm.avg_results_per_search)
    FROM search_performance_metrics spm
    LEFT JOIN search_logs sl ON sl.tenant_id = spm.tenant_id 
        AND DATE(sl.created_at) = spm.metric_date
    WHERE spm.tenant_id = p_tenant_id
    AND spm.metric_date >= CURRENT_DATE - INTERVAL '1 day' * p_days_back;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get trending searches
CREATE OR REPLACE FUNCTION get_trending_searches(
    p_tenant_id UUID,
    p_limit INTEGER DEFAULT 10
) RETURNS TABLE (
    query_text TEXT,
    search_count INTEGER,
    trend_score DECIMAL(5,4),
    success_rate DECIMAL(5,4),
    avg_results_count DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ps.query_text,
        ps.search_count,
        ps.trend_score,
        ps.success_rate,
        ps.avg_results_count
    FROM popular_searches ps
    WHERE ps.tenant_id = p_tenant_id
    AND ps.is_trending = TRUE
    ORDER BY ps.trend_score DESC, ps.search_count DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get search error summary
CREATE OR REPLACE FUNCTION get_search_error_summary(
    p_tenant_id UUID,
    p_days_back INTEGER DEFAULT 30
) RETURNS TABLE (
    error_type VARCHAR(100),
    error_count BIGINT,
    affected_users BIGINT,
    is_resolved BOOLEAN,
    last_occurrence TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        se.error_type,
        SUM(se.error_frequency)::BIGINT,
        SUM(se.affected_users)::BIGINT,
        se.is_resolved,
        MAX(se.created_at)
    FROM search_errors se
    WHERE se.tenant_id = p_tenant_id
    AND se.created_at >= NOW() - INTERVAL '1 day' * p_days_back
    GROUP BY se.error_type, se.is_resolved
    ORDER BY SUM(se.error_frequency) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user search behavior insights
CREATE OR REPLACE FUNCTION get_user_search_insights(
    p_tenant_id UUID,
    p_user_id UUID
) RETURNS TABLE (
    total_searches INTEGER,
    success_rate DECIMAL(5,4),
    preferred_mode VARCHAR(50),
    avg_query_length DECIMAL(5,2),
    click_through_rate DECIMAL(5,4),
    last_search_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sub.record_id,
        sub.record_id,
        sub.record_id,
        sub.record_id,
        sub.record_id,
        sub.record_id
    FROM (
        SELECT 
            sub.total_searches,
            sub.avg_search_success_rate,
            sub.preferred_search_mode,
            sub.avg_query_length,
            sub.click_through_rate,
            sub.last_search_at
        FROM search_user_behavior sub
        WHERE sub.tenant_id = p_tenant_id AND sub.user_id = p_user_id
    ) sub;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== MAINTENANCE FUNCTIONS =====

-- Function to clean old search logs (keep last 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_search_logs(
    p_tenant_id UUID DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    IF p_tenant_id IS NOT NULL THEN
        DELETE FROM search_logs 
        WHERE tenant_id = p_tenant_id 
        AND created_at < NOW() - INTERVAL '90 days';
        GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    ELSE
        DELETE FROM search_logs 
        WHERE created_at < NOW() - INTERVAL '90 days';
        GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    END IF;
    
    RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to aggregate daily metrics (run daily via cron)
CREATE OR REPLACE FUNCTION aggregate_daily_search_metrics(
    p_tenant_id UUID DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    -- This function would aggregate hourly metrics into daily summaries
    -- Implementation depends on specific business requirements
    -- For now, it's a placeholder for future enhancement
    
    -- Example: Could create daily rollup tables for faster analytics queries
    -- Example: Could calculate daily trends and seasonal patterns
    
    RAISE NOTICE 'Daily metrics aggregation called for tenant: %', COALESCE(p_tenant_id::TEXT, 'ALL');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== GRANT PERMISSIONS =====
-- Grant execute permissions on all functions

GRANT EXECUTE ON FUNCTION log_search_query(UUID, UUID, VARCHAR, TEXT, VARCHAR, VARCHAR, INTEGER, INTEGER, BOOLEAN, BOOLEAN, TEXT, TEXT, INET) TO authenticated;
GRANT EXECUTE ON FUNCTION log_search_click(UUID, UUID, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION log_search_error(UUID, UUID, VARCHAR, TEXT, TEXT, TEXT, VARCHAR, TEXT, INET) TO authenticated;
GRANT EXECUTE ON FUNCTION update_popular_searches(UUID, TEXT, INTEGER, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION update_trending_status(UUID, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_search_behavior(UUID, UUID, TEXT, VARCHAR, INTEGER, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION update_search_performance_metrics(UUID, INTEGER, BOOLEAN, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION get_search_performance_summary(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_trending_searches(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_search_error_summary(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_search_insights(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_search_logs(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION aggregate_daily_search_metrics(UUID) TO authenticated;

-- ===== VERIFICATION =====
-- Verify all functions were created successfully
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%search%'
ORDER BY routine_name;



