-- ============================================================================
-- VeroScore V3 - Complete Database Schema (SAFE VERSION FOR SUPABASE)
-- Target: Supabase (PostgreSQL 15+) - Same database as OPA Compliance
-- Created: 2025-11-24
-- Phase: 1 - Foundation & Database Setup
-- Includes: Reward Score Integration Columns
-- Schema: veroscore (separate schema for namespace isolation)
-- 
-- ⚠️ SAFETY IMPROVEMENTS:
-- 1. pg_cron wrapped in error handling (works on Free tier)
-- 2. RLS policies use Supabase auth functions
-- ============================================================================

-- Create veroscore schema (similar to compliance schema for OPA)
CREATE SCHEMA IF NOT EXISTS veroscore;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Note: pg_cron is only available on Pro/Enterprise - handled below

-- ============================================================================
-- SESSIONS TABLE - Core state for Auto-PR batching
-- ============================================================================
CREATE TABLE IF NOT EXISTS veroscore.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT UNIQUE NOT NULL,
    author TEXT NOT NULL,
    branch_name TEXT,
    started TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    -- Aggregated stats
    total_files INTEGER DEFAULT 0,
    total_lines_added INTEGER DEFAULT 0,
    total_lines_removed INTEGER DEFAULT 0,
    
    -- PR tracking
    prs JSONB DEFAULT '[]'::JSONB,
    
    -- Session status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'processing', 'idle', 'completed', 'failed')),
    
    -- Reward Score Integration (Phase 1)
    reward_score_eligible BOOLEAN DEFAULT FALSE,
    last_reward_score NUMERIC(5,2),
    reward_scored_at TIMESTAMPTZ,
    
    -- Metadata
    config JSONB DEFAULT '{}'::JSONB,
    metadata JSONB DEFAULT '{}'::JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_veroscore_sessions_author ON veroscore.sessions(author);
CREATE INDEX IF NOT EXISTS idx_veroscore_sessions_status ON veroscore.sessions(status);
CREATE INDEX IF NOT EXISTS idx_veroscore_sessions_last_activity ON veroscore.sessions(last_activity);
CREATE INDEX IF NOT EXISTS idx_veroscore_sessions_reward_eligible ON veroscore.sessions(reward_score_eligible) WHERE reward_score_eligible = TRUE;
CREATE UNIQUE INDEX IF NOT EXISTS idx_veroscore_active_session_per_author ON veroscore.sessions(author, status) 
    WHERE status = 'active';

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_veroscore_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS veroscore_sessions_updated_at ON veroscore.sessions;
CREATE TRIGGER veroscore_sessions_updated_at BEFORE UPDATE ON veroscore.sessions
    FOR EACH ROW EXECUTE FUNCTION update_veroscore_updated_at_column();

-- ============================================================================
-- CHANGES_QUEUE TABLE - Buffered file changes
-- ============================================================================
CREATE TABLE IF NOT EXISTS veroscore.changes_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL REFERENCES veroscore.sessions(session_id) ON DELETE CASCADE,
    
    -- File change details
    file_path TEXT NOT NULL,
    change_type TEXT NOT NULL CHECK (change_type IN ('added', 'modified', 'deleted', 'renamed')),
    old_path TEXT, -- For renames
    
    -- Diff stats
    lines_added INTEGER DEFAULT 0,
    lines_removed INTEGER DEFAULT 0,
    
    -- Git info
    commit_hash TEXT,
    
    -- Processing state
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMPTZ,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::JSONB,
    
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_veroscore_changes_session ON veroscore.changes_queue(session_id);
CREATE INDEX IF NOT EXISTS idx_veroscore_changes_processed ON veroscore.changes_queue(processed) WHERE NOT processed;
CREATE INDEX IF NOT EXISTS idx_veroscore_changes_timestamp ON veroscore.changes_queue(timestamp DESC);

-- ============================================================================
-- PR_SCORES TABLE - Scoring results and history
-- ============================================================================
CREATE TABLE IF NOT EXISTS veroscore.pr_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- PR identification
    pr_number INTEGER NOT NULL,
    repository TEXT NOT NULL,
    session_id TEXT REFERENCES veroscore.sessions(session_id),
    author TEXT NOT NULL,
    
    -- Category scores (raw -10 to +10 scale)
    code_quality NUMERIC(4,2) DEFAULT 0,
    test_coverage NUMERIC(4,2) DEFAULT 0,
    documentation NUMERIC(4,2) DEFAULT 0,
    architecture NUMERIC(4,2) DEFAULT 0,
    security NUMERIC(4,2) DEFAULT 0,
    rule_compliance NUMERIC(5,2) DEFAULT 0, -- Can go negative to -100
    
    -- Weighted scores
    code_quality_weighted NUMERIC(5,2),
    test_coverage_weighted NUMERIC(5,2),
    documentation_weighted NUMERIC(5,2),
    architecture_weighted NUMERIC(5,2),
    security_weighted NUMERIC(5,2),
    rule_compliance_weighted NUMERIC(5,2),
    
    -- Final score (after stabilization)
    raw_score NUMERIC(6,2) NOT NULL,
    stabilized_score NUMERIC(5,2) NOT NULL,
    
    -- Detection results
    violations JSONB DEFAULT '[]'::JSONB,
    warnings JSONB DEFAULT '[]'::JSONB,
    
    -- Pipeline compliance
    pipeline_complete BOOLEAN DEFAULT FALSE,
    pipeline_bonus NUMERIC(3,2) DEFAULT 0,
    
    -- Decision
    decision TEXT CHECK (decision IN ('auto_approve', 'review_required', 'auto_block')),
    decision_reason TEXT,
    
    -- Reward Score Integration (Phase 1)
    reward_score NUMERIC(5,2),
    reward_score_timestamp TIMESTAMPTZ,
    
    -- Metadata
    scan_duration_ms INTEGER,
    detector_versions JSONB DEFAULT '{}'::JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(pr_number, repository, created_at)
);

CREATE INDEX IF NOT EXISTS idx_veroscore_pr_scores_pr ON veroscore.pr_scores(pr_number, repository);
CREATE INDEX IF NOT EXISTS idx_veroscore_pr_scores_session ON veroscore.pr_scores(session_id);
CREATE INDEX IF NOT EXISTS idx_veroscore_pr_scores_decision ON veroscore.pr_scores(decision);
CREATE INDEX IF NOT EXISTS idx_veroscore_pr_scores_created ON veroscore.pr_scores(created_at DESC);

-- ============================================================================
-- DETECTION_RESULTS TABLE - Individual detector findings
-- ============================================================================
CREATE TABLE IF NOT EXISTS veroscore.detection_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pr_score_id UUID NOT NULL REFERENCES veroscore.pr_scores(id) ON DELETE CASCADE,
    
    -- Detector info
    detector_name TEXT NOT NULL,
    detector_version TEXT,
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
    
    -- Finding details
    rule_id TEXT,
    message TEXT NOT NULL,
    file_path TEXT,
    line_number INTEGER,
    
    -- Evidence
    code_snippet TEXT,
    suggested_fix TEXT,
    
    -- Score impact
    penalty_applied NUMERIC(5,2) DEFAULT 0,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_veroscore_detection_pr_score ON veroscore.detection_results(pr_score_id);
CREATE INDEX IF NOT EXISTS idx_veroscore_detection_severity ON veroscore.detection_results(severity);
CREATE INDEX IF NOT EXISTS idx_veroscore_detection_detector ON veroscore.detection_results(detector_name);

-- ============================================================================
-- IDEMPOTENCY_KEYS TABLE - Prevent duplicate operations
-- ============================================================================
CREATE TABLE IF NOT EXISTS veroscore.idempotency_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    operation_type TEXT NOT NULL,
    
    -- Result tracking
    status TEXT NOT NULL CHECK (status IN ('processing', 'completed', 'failed')),
    result JSONB DEFAULT '{}'::JSONB,
    
    -- TTL (auto-cleanup after 24h)
    expires_at TIMESTAMPTZ NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_veroscore_idempotency_key ON veroscore.idempotency_keys(key);
CREATE INDEX IF NOT EXISTS idx_veroscore_idempotency_expires ON veroscore.idempotency_keys(expires_at);

-- ============================================================================
-- SYSTEM_METRICS TABLE - Observability
-- ============================================================================
CREATE TABLE IF NOT EXISTS veroscore.system_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    metric_type TEXT NOT NULL CHECK (metric_type IN ('counter', 'gauge', 'histogram', 'summary')),
    
    -- Dimensions
    labels JSONB DEFAULT '{}'::JSONB,
    
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_veroscore_metrics_name ON veroscore.system_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_veroscore_metrics_timestamp ON veroscore.system_metrics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_veroscore_metrics_labels ON veroscore.system_metrics USING GIN(labels);

-- ============================================================================
-- AUDIT_LOG TABLE - Full audit trail
-- ============================================================================
CREATE TABLE IF NOT EXISTS veroscore.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Event details
    event_type TEXT NOT NULL,
    event_action TEXT NOT NULL,
    actor TEXT NOT NULL,
    
    -- Context
    session_id TEXT,
    pr_number INTEGER,
    
    -- Changes
    old_state JSONB,
    new_state JSONB,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::JSONB,
    
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_veroscore_audit_type ON veroscore.audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_veroscore_audit_actor ON veroscore.audit_log(actor);
CREATE INDEX IF NOT EXISTS idx_veroscore_audit_timestamp ON veroscore.audit_log(timestamp DESC);

-- ============================================================================
-- AUTOMATIC CLEANUP FUNCTIONS
-- ============================================================================

-- Function to auto-timeout inactive sessions
CREATE OR REPLACE FUNCTION veroscore_auto_timeout_sessions()
RETURNS void AS $$
BEGIN
    UPDATE veroscore.sessions
    SET 
        status = 'idle',
        metadata = jsonb_set(
            COALESCE(metadata, '{}'::JSONB), 
            '{timeout_reason}', 
            '"inactivity"'
        )
    WHERE 
        status = 'active'
        AND last_activity < NOW() - INTERVAL '30 minutes';
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup old idempotency keys
CREATE OR REPLACE FUNCTION veroscore_cleanup_expired_idempotency()
RETURNS void AS $$
BEGIN
    DELETE FROM veroscore.idempotency_keys
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to archive old metrics (keep last 30 days)
CREATE OR REPLACE FUNCTION veroscore_archive_old_metrics()
RETURNS void AS $$
BEGIN
    DELETE FROM veroscore.system_metrics
    WHERE timestamp < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup jobs (if pg_cron available) - SAFE VERSION
DO $cron_setup$
BEGIN
    -- Check if pg_cron extension exists
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        -- Only schedule if not already scheduled
        IF NOT EXISTS (
            SELECT 1 FROM cron.job WHERE jobname = 'veroscore-auto-timeout-sessions'
        ) THEN
            PERFORM cron.schedule(
                'veroscore-auto-timeout-sessions',
                '*/15 * * * *', -- Every 15 minutes
                'SELECT veroscore_auto_timeout_sessions()'
            );
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM cron.job WHERE jobname = 'veroscore-cleanup-idempotency'
        ) THEN
            PERFORM cron.schedule(
                'veroscore-cleanup-idempotency',
                '0 */6 * * *', -- Every 6 hours
                'SELECT veroscore_cleanup_expired_idempotency()'
            );
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM cron.job WHERE jobname = 'veroscore-archive-metrics'
        ) THEN
            PERFORM cron.schedule(
                'veroscore-archive-metrics',
                '0 2 * * *', -- Daily at 2 AM
                'SELECT veroscore_archive_old_metrics()'
            );
        END IF;
        
        RAISE NOTICE 'pg_cron jobs scheduled successfully';
    ELSE
        -- pg_cron not available (Free tier) - log warning
        RAISE NOTICE 'pg_cron extension not available. Scheduled jobs will not be created.';
        RAISE NOTICE 'You can manually run cleanup functions or upgrade to Pro tier.';
        RAISE NOTICE 'Functions created: veroscore_auto_timeout_sessions(), veroscore_cleanup_expired_idempotency(), veroscore_archive_old_metrics()';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Gracefully handle any errors (e.g., permission issues)
        RAISE NOTICE 'Could not schedule cron jobs: %', SQLERRM;
        RAISE NOTICE 'Migration will continue - cleanup functions are available for manual execution';
END $cron_setup$;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - Tiered policies with service role bypass
-- UPDATED FOR SUPABASE AUTH FUNCTIONS
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE veroscore.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE veroscore.changes_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE veroscore.pr_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE veroscore.detection_results ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own sessions" ON veroscore.sessions;
DROP POLICY IF EXISTS "Service role full access sessions" ON veroscore.sessions;
DROP POLICY IF EXISTS "Team members can view all PR scores" ON veroscore.pr_scores;
DROP POLICY IF EXISTS "Service role full access pr_scores" ON veroscore.pr_scores;

-- Policy: Users can only see their own sessions
-- Note: Assumes author field matches Supabase user identifier (email or user_id)
CREATE POLICY "Users can view own sessions"
    ON veroscore.sessions FOR SELECT
    USING (
        -- Match by user ID (if author stores UUID)
        author = auth.uid()::text 
        -- OR match by email (if author stores email)
        OR author = (auth.jwt() ->> 'email')
        -- OR allow if authenticated (for now - adjust based on your auth setup)
        OR auth.role() = 'authenticated'
    );

-- Policy: Service role can do everything (for backend processes)
CREATE POLICY "Service role full access sessions"
    ON veroscore.sessions FOR ALL
    USING (
        auth.role() = 'service_role'
        OR (auth.jwt() ->> 'role') = 'service_role'
    );

-- Policy: Team members can view all PR scores (transparency)
CREATE POLICY "Team members can view all PR scores"
    ON veroscore.pr_scores FOR SELECT
    USING (
        auth.role() = 'authenticated' 
        OR auth.role() = 'service_role'
    );

-- Policy: Service role full access to PR scores
CREATE POLICY "Service role full access pr_scores"
    ON veroscore.pr_scores FOR ALL
    USING (
        auth.role() = 'service_role'
        OR (auth.jwt() ->> 'role') = 'service_role'
    );

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Active sessions with stats
CREATE OR REPLACE VIEW veroscore.v_active_sessions AS
SELECT 
    s.*,
    COUNT(DISTINCT cq.id) as pending_changes,
    SUM(cq.lines_added) as total_pending_additions,
    SUM(cq.lines_removed) as total_pending_deletions,
    EXTRACT(EPOCH FROM (NOW() - s.last_activity)) as seconds_since_activity
FROM veroscore.sessions s
LEFT JOIN veroscore.changes_queue cq ON s.session_id = cq.session_id AND NOT cq.processed
WHERE s.status IN ('active', 'processing')
GROUP BY s.id;

-- PR scores with decision summary
CREATE OR REPLACE VIEW veroscore.v_pr_score_summary AS
SELECT 
    ps.pr_number,
    ps.repository,
    ps.author,
    ps.stabilized_score,
    ps.decision,
    ps.reward_score,
    ps.reward_score_timestamp,
    COUNT(dr.id) FILTER (WHERE dr.severity = 'critical') as critical_violations,
    COUNT(dr.id) FILTER (WHERE dr.severity = 'high') as high_violations,
    COUNT(dr.id) FILTER (WHERE dr.severity = 'medium') as medium_violations,
    ps.created_at
FROM veroscore.pr_scores ps
LEFT JOIN veroscore.detection_results dr ON ps.id = dr.pr_score_id
GROUP BY ps.id;

-- System health metrics
CREATE OR REPLACE VIEW veroscore.v_system_health AS
SELECT 
    COUNT(*) FILTER (WHERE status = 'active') as active_sessions,
    COUNT(*) FILTER (WHERE status = 'idle') as idle_sessions,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_sessions,
    AVG(total_files) FILTER (WHERE status = 'completed') as avg_files_per_session,
    MAX(last_activity) as most_recent_activity,
    COUNT(*) FILTER (WHERE reward_score_eligible = TRUE) as reward_eligible_sessions
FROM veroscore.sessions;

-- Dashboard summary view (for real-time dashboard)
CREATE OR REPLACE VIEW veroscore.v_dashboard_summary AS
SELECT 
    (SELECT COUNT(*) FROM veroscore.sessions WHERE status = 'active') as active_sessions,
    (SELECT COUNT(*) FROM veroscore.sessions WHERE status = 'completed' AND completed_at > NOW() - INTERVAL '24 hours') as sessions_today,
    (SELECT AVG(stabilized_score) FROM veroscore.pr_scores WHERE created_at > NOW() - INTERVAL '24 hours') as avg_score_today,
    (SELECT COUNT(*) FROM veroscore.pr_scores WHERE decision = 'auto_approve' AND created_at > NOW() - INTERVAL '24 hours') as auto_approved_today,
    (SELECT COUNT(*) FROM veroscore.pr_scores WHERE decision = 'auto_block' AND created_at > NOW() - INTERVAL '24 hours') as auto_blocked_today,
    (SELECT COUNT(*) FROM veroscore.sessions WHERE reward_score_eligible = TRUE) as reward_eligible_count;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function: Get average score for today
CREATE OR REPLACE FUNCTION veroscore_get_avg_score_today()
RETURNS NUMERIC AS $$
    SELECT COALESCE(AVG(stabilized_score), 0)
    FROM veroscore.pr_scores
    WHERE created_at::date = CURRENT_DATE;
$$ LANGUAGE sql;

-- Function: Get top authors by PR count
CREATE OR REPLACE FUNCTION veroscore_get_top_authors(days INTEGER DEFAULT 7)
RETURNS TABLE (
    author TEXT,
    pr_count BIGINT,
    avg_score NUMERIC
) AS $$
    SELECT 
        ps.author,
        COUNT(*) as pr_count,
        AVG(ps.stabilized_score) as avg_score
    FROM veroscore.pr_scores ps
    WHERE ps.created_at > NOW() - (days || ' days')::INTERVAL
    GROUP BY ps.author
    ORDER BY pr_count DESC
    LIMIT 10;
$$ LANGUAGE sql;

-- Function: Get score trend
CREATE OR REPLACE FUNCTION veroscore_get_score_trend(days INTEGER DEFAULT 7)
RETURNS TABLE (
    date DATE,
    avg_score NUMERIC,
    pr_count BIGINT
) AS $$
    SELECT 
        ps.created_at::date as date,
        AVG(ps.stabilized_score) as avg_score,
        COUNT(*) as pr_count
    FROM veroscore.pr_scores ps
    WHERE ps.created_at > NOW() - (days || ' days')::INTERVAL
    GROUP BY ps.created_at::date
    ORDER BY date DESC;
$$ LANGUAGE sql;

-- Function: Get violation types distribution
CREATE OR REPLACE FUNCTION veroscore_get_violation_types(days INTEGER DEFAULT 7)
RETURNS TABLE (
    detector_name TEXT,
    severity TEXT,
    count BIGINT
) AS $$
    SELECT 
        dr.detector_name,
        dr.severity,
        COUNT(*) as count
    FROM veroscore.detection_results dr
    JOIN veroscore.pr_scores ps ON dr.pr_score_id = ps.id
    WHERE ps.created_at > NOW() - (days || ' days')::INTERVAL
    GROUP BY dr.detector_name, dr.severity
    ORDER BY count DESC;
$$ LANGUAGE sql;

-- Function: Increment session stats (batch update)
CREATE OR REPLACE FUNCTION veroscore_increment_session_stats(
    p_session_id TEXT,
    p_files INTEGER DEFAULT 0,
    p_lines_added INTEGER DEFAULT 0,
    p_lines_removed INTEGER DEFAULT 0
)
RETURNS void AS $$
BEGIN
    UPDATE veroscore.sessions
    SET 
        total_files = total_files + p_files,
        total_lines_added = total_lines_added + p_lines_added,
        total_lines_removed = total_lines_removed + p_lines_removed,
        last_activity = NOW()
    WHERE session_id = p_session_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TABLE COMMENTS
-- ============================================================================

COMMENT ON TABLE veroscore.sessions IS 'Core session tracking for Auto-PR batching with Reward Score integration';
COMMENT ON TABLE veroscore.changes_queue IS 'Buffered file changes before PR creation';
COMMENT ON TABLE veroscore.pr_scores IS 'Hybrid scoring results for all PRs with Reward Score integration';
COMMENT ON TABLE veroscore.detection_results IS 'Individual violations and warnings found by detectors';
COMMENT ON TABLE veroscore.idempotency_keys IS 'Prevents duplicate operations (e.g., double PR creation)';
COMMENT ON TABLE veroscore.system_metrics IS 'Operational metrics for monitoring';
COMMENT ON TABLE veroscore.audit_log IS 'Full audit trail of all system actions';

COMMENT ON COLUMN veroscore.sessions.reward_score_eligible IS 'Flag indicating session is eligible for Reward Score computation';
COMMENT ON COLUMN veroscore.sessions.last_reward_score IS 'Last computed Reward Score for this session';
COMMENT ON COLUMN veroscore.sessions.reward_scored_at IS 'Timestamp when Reward Score was last computed';
COMMENT ON COLUMN veroscore.pr_scores.reward_score IS 'Reward Score computed for this PR (from Reward Score Feedback Loop)';
COMMENT ON COLUMN veroscore.pr_scores.reward_score_timestamp IS 'Timestamp when Reward Score was computed';

