-- ============================================================================
-- VeroScore V3 - RPC Functions for Supabase Schema Access
-- ============================================================================
-- These RPC functions allow Supabase Python client to access veroscore schema
-- tables when the schema is not exposed in the API configuration.
--
-- Created: 2025-11-24
-- Usage: Run this SQL in Supabase SQL Editor after main migration
-- ============================================================================

-- ============================================================================
-- SESSION MANAGEMENT RPC FUNCTIONS
-- ============================================================================

-- Insert session
CREATE OR REPLACE FUNCTION veroscore.insert_session(
    p_session_id TEXT,
    p_author TEXT,
    p_branch_name TEXT DEFAULT NULL,
    p_status TEXT DEFAULT 'active'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO veroscore.sessions (
        session_id, author, branch_name, status,
        total_files, total_lines_added, total_lines_removed,
        prs, config, metadata
    )
    VALUES (
        p_session_id, p_author, p_branch_name, p_status,
        0, 0, 0, '[]'::JSONB, '{}'::JSONB, '{}'::JSONB
    )
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$$;

-- Get session by session_id
CREATE OR REPLACE FUNCTION veroscore.get_session(p_session_id TEXT)
RETURNS SETOF veroscore.sessions
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM veroscore.sessions
    WHERE veroscore.sessions.session_id = p_session_id;
END;
$$;

-- Find active session for author
CREATE OR REPLACE FUNCTION veroscore.find_active_session(p_author TEXT)
RETURNS SETOF veroscore.sessions
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM veroscore.sessions
    WHERE veroscore.sessions.author = p_author
      AND veroscore.sessions.status = 'active'
    ORDER BY veroscore.sessions.last_activity DESC
    LIMIT 1;
END;
$$;

-- Update session stats
CREATE OR REPLACE FUNCTION veroscore.update_session_stats(
    p_session_id TEXT,
    p_file_count INTEGER DEFAULT 0,
    p_lines_added INTEGER DEFAULT 0,
    p_lines_removed INTEGER DEFAULT 0
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE veroscore.sessions
    SET 
        total_files = total_files + p_file_count,
        total_lines_added = total_lines_added + p_lines_added,
        total_lines_removed = total_lines_removed + p_lines_removed,
        last_activity = NOW()
    WHERE veroscore.sessions.session_id = p_session_id;
    
    RETURN FOUND;
END;
$$;

-- ============================================================================
-- CHANGES QUEUE RPC FUNCTIONS
-- ============================================================================

-- Insert changes batch
CREATE OR REPLACE FUNCTION veroscore.insert_changes(
    p_session_id TEXT,
    p_changes JSONB
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    INSERT INTO veroscore.changes_queue (
        session_id, file_path, change_type, old_path,
        lines_added, lines_removed, commit_hash, processed, metadata
    )
    SELECT
        p_session_id,
        (change->>'path')::TEXT,
        (change->>'change_type')::TEXT,
        (change->>'old_path')::TEXT,
        COALESCE((change->>'lines_added')::INTEGER, 0),
        COALESCE((change->>'lines_removed')::INTEGER, 0),
        (change->>'commit_hash')::TEXT,
        FALSE,
        COALESCE((change->>'metadata')::JSONB, '{}'::JSONB)
    FROM jsonb_array_elements(p_changes) AS change;
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$;

-- Get pending changes count
CREATE OR REPLACE FUNCTION veroscore.get_pending_changes_count(p_session_id TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM veroscore.changes_queue
    WHERE veroscore.changes_queue.session_id = p_session_id
      AND veroscore.changes_queue.processed = FALSE;
    
    RETURN v_count;
END;
$$;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant execute permissions to service role
GRANT EXECUTE ON FUNCTION veroscore.insert_session TO service_role;
GRANT EXECUTE ON FUNCTION veroscore.get_session TO service_role;
GRANT EXECUTE ON FUNCTION veroscore.find_active_session TO service_role;
GRANT EXECUTE ON FUNCTION veroscore.update_session_stats TO service_role;
GRANT EXECUTE ON FUNCTION veroscore.insert_changes TO service_role;
GRANT EXECUTE ON FUNCTION veroscore.get_pending_changes_count TO service_role;



