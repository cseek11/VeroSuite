-- ============================================================================
-- CREATE IDEMPOTENCY KEYS TABLE
-- ============================================================================
-- Phase 2.5: Idempotency for critical write operations
-- Ensures retryable operations can be safely retried without side effects

CREATE TABLE IF NOT EXISTS idempotency_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idempotency_key VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    response_data JSONB NOT NULL,
    status_code INTEGER NOT NULL DEFAULT 200,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Unique constraint: same key, user, tenant can only exist once
    CONSTRAINT idempotency_keys_unique UNIQUE (idempotency_key, user_id, tenant_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_idempotency_keys_lookup 
    ON idempotency_keys (idempotency_key, user_id, tenant_id);

-- Index for cleanup (old keys)
CREATE INDEX IF NOT EXISTS idx_idempotency_keys_created_at 
    ON idempotency_keys (created_at);

-- RLS Policy: Users can only see their own idempotency keys
ALTER TABLE idempotency_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY idempotency_keys_tenant_isolation ON idempotency_keys
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY idempotency_keys_user_isolation ON idempotency_keys
    FOR ALL
    USING (user_id = current_setting('app.current_user_id', true)::UUID);

-- Function to clean up old idempotency keys (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_idempotency_keys()
RETURNS void AS $$
BEGIN
    DELETE FROM idempotency_keys
    WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to run cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-idempotency-keys', '0 0 * * *', 'SELECT cleanup_old_idempotency_keys();');

COMMENT ON TABLE idempotency_keys IS 'Stores idempotency keys to prevent duplicate operations';
COMMENT ON COLUMN idempotency_keys.idempotency_key IS 'Unique key provided by client (Idempotency-Key header)';
COMMENT ON COLUMN idempotency_keys.response_data IS 'Cached response from the original request';
COMMENT ON COLUMN idempotency_keys.status_code IS 'HTTP status code from the original request';


