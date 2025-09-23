-- ===== SEARCH ANALYTICS SCHEMA - CORRECTED VERSION =====
-- Comprehensive tracking and analysis of search performance and user behavior
-- This version handles existing tables and potential conflicts

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===== SEARCH LOGS TABLE =====
-- Tracks every search query for detailed analysis
DO $$ 
BEGIN
    -- Check if table exists and has the right structure
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'search_logs') THEN
        -- Create new table
        CREATE TABLE search_logs (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tenant_id UUID NOT NULL,
            user_id UUID NOT NULL,
            session_id VARCHAR(255),
            
            -- Search query details
            query_text TEXT NOT NULL,
            query_type VARCHAR(50) NOT NULL, -- 'standard', 'fuzzy', 'hybrid', 'vector'
            search_mode VARCHAR(50) NOT NULL, -- 'standard', 'fuzzy', 'hybrid', 'vector'
            
            -- Results and performance
            results_count INTEGER NOT NULL DEFAULT 0,
            execution_time_ms INTEGER NOT NULL, -- Search execution time in milliseconds
            cache_hit BOOLEAN DEFAULT FALSE,
            
            -- User interaction
            clicked_result_id UUID,
            clicked_result_position INTEGER,
            time_to_click_ms INTEGER, -- Time from search to first click
            
            -- Search success metrics
            search_successful BOOLEAN NOT NULL DEFAULT TRUE,
            error_message TEXT,
            
            -- Metadata
            user_agent TEXT,
            ip_address INET,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            
            -- Indexes for performance
            CONSTRAINT fk_search_logs_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
            CONSTRAINT fk_search_logs_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
        );
    ELSE
        -- Table exists, check if we need to add missing columns
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'query_type') THEN
            ALTER TABLE search_logs ADD COLUMN query_type VARCHAR(50) NOT NULL DEFAULT 'hybrid';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'search_mode') THEN
            ALTER TABLE search_logs ADD COLUMN search_mode VARCHAR(50) NOT NULL DEFAULT 'hybrid';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'session_id') THEN
            ALTER TABLE search_logs ADD COLUMN session_id VARCHAR(255);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'clicked_result_id') THEN
            ALTER TABLE search_logs ADD COLUMN clicked_result_id UUID;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'clicked_result_position') THEN
            ALTER TABLE search_logs ADD COLUMN clicked_result_position INTEGER;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'time_to_click_ms') THEN
            ALTER TABLE search_logs ADD COLUMN time_to_click_ms INTEGER;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'cache_hit') THEN
            ALTER TABLE search_logs ADD COLUMN cache_hit BOOLEAN DEFAULT FALSE;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'user_agent') THEN
            ALTER TABLE search_logs ADD COLUMN user_agent TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_logs' AND column_name = 'ip_address') THEN
            ALTER TABLE search_logs ADD COLUMN ip_address INET;
        END IF;
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_search_logs_tenant_created ON search_logs(tenant_id, created_at);
CREATE INDEX IF NOT EXISTS idx_search_logs_query_type ON search_logs(query_type, tenant_id);
CREATE INDEX IF NOT EXISTS idx_search_logs_user_session ON search_logs(user_id, session_id);
CREATE INDEX IF NOT EXISTS idx_search_logs_performance ON search_logs(execution_time_ms, tenant_id);

-- ===== SEARCH PERFORMANCE METRICS TABLE =====
-- Aggregated performance data for trending and alerts
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'search_performance_metrics') THEN
        CREATE TABLE search_performance_metrics (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tenant_id UUID NOT NULL,
            
            -- Time period
            metric_date DATE NOT NULL,
            metric_hour INTEGER NOT NULL, -- 0-23 for hourly aggregation
            
            -- Search volume
            total_searches INTEGER NOT NULL DEFAULT 0,
            unique_users INTEGER NOT NULL DEFAULT 0,
            unique_queries INTEGER NOT NULL DEFAULT 0,
            
            -- Performance metrics
            avg_execution_time_ms DECIMAL(10,2) NOT NULL DEFAULT 0,
            median_execution_time_ms DECIMAL(10,2) NOT NULL DEFAULT 0,
            p95_execution_time_ms DECIMAL(10,2) NOT NULL DEFAULT 0,
            p99_execution_time_ms DECIMAL(10,2) NOT NULL DEFAULT 0,
            
            -- Success rates
            success_rate DECIMAL(5,4) NOT NULL DEFAULT 1.0, -- 0.0000 to 1.0000
            error_count INTEGER NOT NULL DEFAULT 0,
            
            -- Cache performance
            cache_hit_rate DECIMAL(5,4) NOT NULL DEFAULT 0.0,
            cache_hits INTEGER NOT NULL DEFAULT 0,
            cache_misses INTEGER NOT NULL DEFAULT 0,
            
            -- User engagement
            avg_results_per_search DECIMAL(5,2) NOT NULL DEFAULT 0,
            click_through_rate DECIMAL(5,4) NOT NULL DEFAULT 0.0,
            avg_time_to_click_ms DECIMAL(10,2) NOT NULL DEFAULT 0,
            
            -- Search mode distribution
            standard_searches INTEGER NOT NULL DEFAULT 0,
            fuzzy_searches INTEGER NOT NULL DEFAULT 0,
            hybrid_searches INTEGER NOT NULL DEFAULT 0,
            vector_searches INTEGER NOT NULL DEFAULT 0,
            
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            
            -- Constraints
            CONSTRAINT fk_search_performance_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
            UNIQUE(tenant_id, metric_date, metric_hour)
        );
    END IF;
END $$;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_search_performance_tenant_date ON search_performance_metrics(tenant_id, metric_date);
CREATE INDEX IF NOT EXISTS idx_search_performance_created ON search_performance_metrics(created_at);

-- ===== POPULAR SEARCHES TABLE =====
-- Tracks most common queries and their success rates
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'popular_searches') THEN
        CREATE TABLE popular_searches (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tenant_id UUID NOT NULL,
            
            -- Query details
            query_text TEXT NOT NULL,
            query_hash VARCHAR(64) NOT NULL, -- Hash of normalized query for grouping
            
            -- Usage statistics
            search_count INTEGER NOT NULL DEFAULT 1,
            unique_users INTEGER NOT NULL DEFAULT 1,
            last_searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            
            -- Success metrics
            success_rate DECIMAL(5,4) NOT NULL DEFAULT 1.0,
            avg_results_count DECIMAL(5,2) NOT NULL DEFAULT 0,
            click_through_rate DECIMAL(5,4) NOT NULL DEFAULT 0.0,
            
            -- Query analysis
            query_length INTEGER NOT NULL,
            word_count INTEGER NOT NULL,
            has_numbers BOOLEAN NOT NULL DEFAULT FALSE,
            has_special_chars BOOLEAN NOT NULL DEFAULT FALSE,
            
            -- Trending
            is_trending BOOLEAN NOT NULL DEFAULT FALSE,
            trend_score DECIMAL(5,4) NOT NULL DEFAULT 0.0,
            
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            
            -- Constraints
            CONSTRAINT fk_popular_searches_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
            UNIQUE(tenant_id, query_hash)
        );
    END IF;
END $$;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_popular_searches_tenant ON popular_searches(tenant_id);
CREATE INDEX IF NOT EXISTS idx_popular_searches_trending ON popular_searches(tenant_id, is_trending, trend_score);
CREATE INDEX IF NOT EXISTS idx_popular_searches_usage ON popular_searches(tenant_id, search_count DESC);

-- ===== SEARCH SUGGESTIONS ANALYTICS =====
-- Tracks effectiveness of search suggestions and auto-corrections
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'search_suggestions_analytics') THEN
        CREATE TABLE search_suggestions_analytics (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tenant_id UUID NOT NULL,
            
            -- Suggestion details
            original_query TEXT NOT NULL,
            suggested_query TEXT NOT NULL,
            suggestion_type VARCHAR(50) NOT NULL, -- 'correction', 'completion', 'related'
            confidence_score DECIMAL(5,4) NOT NULL, -- 0.0000 to 1.0000
            
            -- Usage statistics
            times_suggested INTEGER NOT NULL DEFAULT 1,
            times_accepted INTEGER NOT NULL DEFAULT 0,
            times_rejected INTEGER NOT NULL DEFAULT 0,
            
            -- User behavior
            avg_time_to_accept_ms DECIMAL(10,2) NOT NULL DEFAULT 0,
            acceptance_rate DECIMAL(5,4) NOT NULL DEFAULT 0.0,
            
            -- Performance impact
            avg_original_results INTEGER NOT NULL DEFAULT 0,
            avg_suggested_results INTEGER NOT NULL DEFAULT 0,
            result_improvement_rate DECIMAL(5,4) NOT NULL DEFAULT 0.0,
            
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            
            -- Constraints
            CONSTRAINT fk_search_suggestions_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
        );
    END IF;
END $$;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_search_suggestions_tenant ON search_suggestions_analytics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_search_suggestions_type ON search_suggestions_analytics(tenant_id, suggestion_type);
CREATE INDEX IF NOT EXISTS idx_search_suggestions_confidence ON search_suggestions_analytics(tenant_id, confidence_score DESC);

-- ===== SEARCH ERROR TRACKING =====
-- Detailed error analysis for debugging and improvement
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'search_errors') THEN
        CREATE TABLE search_errors (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tenant_id UUID NOT NULL,
            user_id UUID,
            
            -- Error details
            error_type VARCHAR(100) NOT NULL, -- 'database_error', 'timeout', 'validation_error', etc.
            error_message TEXT NOT NULL,
            error_stack TEXT,
            
            -- Context
            query_text TEXT,
            search_mode VARCHAR(50),
            user_agent TEXT,
            ip_address INET,
            
            -- Impact
            affected_users INTEGER NOT NULL DEFAULT 1,
            error_frequency INTEGER NOT NULL DEFAULT 1,
            
            -- Resolution
            is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
            resolution_notes TEXT,
            resolved_at TIMESTAMP WITH TIME ZONE,
            resolved_by UUID,
            
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            
            -- Constraints
            CONSTRAINT fk_search_errors_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
            CONSTRAINT fk_search_errors_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL,
            CONSTRAINT fk_search_errors_resolved_by FOREIGN KEY (resolved_by) REFERENCES auth.users(id) ON DELETE SET NULL
        );
    END IF;
END $$;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_search_errors_tenant ON search_errors(tenant_id);
CREATE INDEX IF NOT EXISTS idx_search_errors_type ON search_errors(tenant_id, error_type);
CREATE INDEX IF NOT EXISTS idx_search_errors_resolved ON search_errors(tenant_id, is_resolved);

-- ===== SEARCH USER BEHAVIOR TABLE =====
-- Individual user search patterns and preferences
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'search_user_behavior') THEN
        CREATE TABLE search_user_behavior (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tenant_id UUID NOT NULL,
            user_id UUID NOT NULL,
            
            -- User preferences
            preferred_search_mode VARCHAR(50),
            preferred_result_count INTEGER,
            avg_session_searches DECIMAL(5,2) NOT NULL DEFAULT 0,
            
            -- Search patterns
            most_common_queries TEXT[], -- Array of top queries
            search_time_preferences INTEGER[], -- Hours when user searches most
            avg_query_length DECIMAL(5,2) NOT NULL DEFAULT 0,
            
            -- Engagement metrics
            total_searches INTEGER NOT NULL DEFAULT 0,
            successful_searches INTEGER NOT NULL DEFAULT 0,
            avg_time_to_click_ms DECIMAL(10,2) NOT NULL DEFAULT 0,
            click_through_rate DECIMAL(5,4) NOT NULL DEFAULT 0.0,
            
            -- Learning preferences
            accepts_suggestions BOOLEAN NOT NULL DEFAULT FALSE,
            suggestion_acceptance_rate DECIMAL(5,4) NOT NULL DEFAULT 0.0,
            learns_from_corrections BOOLEAN NOT NULL DEFAULT FALSE,
            
            -- Performance
            avg_search_success_rate DECIMAL(5,4) NOT NULL DEFAULT 1.0,
            last_search_at TIMESTAMP WITH TIME ZONE,
            
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            
            -- Constraints
            CONSTRAINT fk_search_user_behavior_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
            CONSTRAINT fk_search_user_behavior_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
            UNIQUE(tenant_id, user_id)
        );
    END IF;
END $$;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_search_user_behavior_tenant ON search_user_behavior(tenant_id);
CREATE INDEX IF NOT EXISTS idx_search_user_behavior_user ON search_user_behavior(tenant_id, user_id);

-- ===== SEARCH TRENDS TABLE =====
-- Tracks trending searches and seasonal patterns
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'search_trends') THEN
        CREATE TABLE search_trends (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tenant_id UUID NOT NULL,
            
            -- Trend details
            trend_period VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly'
            trend_date DATE NOT NULL,
            
            -- Trending queries
            trending_queries JSONB NOT NULL, -- Array of {query, score, change_percent}
            emerging_queries JSONB NOT NULL, -- New queries gaining popularity
            declining_queries JSONB NOT NULL, -- Queries losing popularity
            
            -- Trend metrics
            total_trending_queries INTEGER NOT NULL DEFAULT 0,
            avg_trend_score DECIMAL(5,4) NOT NULL DEFAULT 0.0,
            trend_volatility DECIMAL(5,4) NOT NULL DEFAULT 0.0, -- How much trends change
            
            -- Seasonal patterns
            is_seasonal BOOLEAN NOT NULL DEFAULT FALSE,
            season_name VARCHAR(50), -- 'summer', 'winter', 'pest_season', etc.
            seasonal_multiplier DECIMAL(5,4) NOT NULL DEFAULT 1.0,
            
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            
            -- Constraints
            CONSTRAINT fk_search_trends_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
            UNIQUE(tenant_id, trend_period, trend_date)
        );
    END IF;
END $$;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_search_trends_tenant ON search_trends(tenant_id);
CREATE INDEX IF NOT EXISTS idx_search_trends_period_date ON search_trends(tenant_id, trend_period, trend_date);

-- ===== ROW LEVEL SECURITY (RLS) =====
-- Ensure data isolation between tenants

-- Search logs RLS
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS search_logs_tenant_isolation ON search_logs;
CREATE POLICY search_logs_tenant_isolation ON search_logs
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Search performance metrics RLS
ALTER TABLE search_performance_metrics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS search_performance_tenant_isolation ON search_performance_metrics;
CREATE POLICY search_performance_tenant_isolation ON search_performance_metrics
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Popular searches RLS
ALTER TABLE popular_searches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS popular_searches_tenant_isolation ON popular_searches;
CREATE POLICY popular_searches_tenant_isolation ON popular_searches
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Search suggestions analytics RLS
ALTER TABLE search_suggestions_analytics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS search_suggestions_tenant_isolation ON search_suggestions_analytics;
CREATE POLICY search_suggestions_tenant_isolation ON search_suggestions_analytics
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Search errors RLS
ALTER TABLE search_errors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS search_errors_tenant_isolation ON search_errors;
CREATE POLICY search_errors_tenant_isolation ON search_errors
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Search user behavior RLS
ALTER TABLE search_user_behavior ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS search_user_behavior_tenant_isolation ON search_user_behavior;
CREATE POLICY search_user_behavior_tenant_isolation ON search_user_behavior
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Search trends RLS
ALTER TABLE search_trends ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS search_trends_tenant_isolation ON search_trends;
CREATE POLICY search_trends_tenant_isolation ON search_trends
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- ===== GRANT PERMISSIONS =====
-- Grant appropriate permissions to authenticated users

GRANT SELECT, INSERT ON search_logs TO authenticated;
GRANT SELECT ON search_performance_metrics TO authenticated;
GRANT SELECT ON popular_searches TO authenticated;
GRANT SELECT ON search_suggestions_analytics TO authenticated;
GRANT SELECT ON search_errors TO authenticated;
GRANT SELECT ON search_user_behavior TO authenticated;
GRANT SELECT ON search_trends TO authenticated;

-- Grant admin permissions for analytics
GRANT ALL ON search_logs TO authenticated;
GRANT ALL ON search_performance_metrics TO authenticated;
GRANT ALL ON popular_searches TO authenticated;
GRANT ALL ON search_suggestions_analytics TO authenticated;
GRANT ALL ON search_errors TO authenticated;
GRANT ALL ON search_user_behavior TO authenticated;
GRANT ALL ON search_trends TO authenticated;

-- ===== COMMENTS =====
COMMENT ON TABLE search_logs IS 'Detailed log of all search queries for performance analysis and debugging';
COMMENT ON TABLE search_performance_metrics IS 'Aggregated search performance metrics for trending and alerts';
COMMENT ON TABLE popular_searches IS 'Most common search queries and their success rates';
COMMENT ON TABLE search_suggestions_analytics IS 'Effectiveness tracking for search suggestions and auto-corrections';
COMMENT ON TABLE search_errors IS 'Detailed error tracking for debugging and improvement';
COMMENT ON TABLE search_user_behavior IS 'Individual user search patterns and preferences';
COMMENT ON TABLE search_trends IS 'Trending searches and seasonal patterns analysis';

-- ===== VERIFICATION =====
-- Verify all tables were created successfully
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'search_%'
ORDER BY table_name;

-- Show table structure for search_logs
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'search_logs' 
ORDER BY ordinal_position;


























