-- Create Dashboard Events Table for Event Sourcing and Audit Trail
-- This table stores all events for compliance and audit purposes

CREATE TABLE IF NOT EXISTS dashboard_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('region', 'layout', 'version', 'acl')),
  entity_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_dashboard_events_entity ON dashboard_events(entity_type, entity_id, tenant_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_events_tenant ON dashboard_events(tenant_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_dashboard_events_user ON dashboard_events(user_id, tenant_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_dashboard_events_type ON dashboard_events(event_type, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_dashboard_events_timestamp ON dashboard_events(timestamp DESC);

-- Partition by month for large-scale deployments (optional)
-- CREATE TABLE dashboard_events_2024_01 PARTITION OF dashboard_events
--   FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Enable RLS
ALTER TABLE dashboard_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotent migration)
DROP POLICY IF EXISTS "Users can view tenant events" ON dashboard_events;
DROP POLICY IF EXISTS "System can insert events" ON dashboard_events;

-- RLS Policy: Users can only view events from their tenant
CREATE POLICY "Users can view tenant events" ON dashboard_events
  FOR SELECT USING (
    tenant_id = current_setting('app.tenant_id')::uuid
  );

-- RLS Policy: System can insert events (enforced at application level)
-- Events are inserted by the service, not directly by users
CREATE POLICY "System can insert events" ON dashboard_events
  FOR INSERT WITH CHECK (
    tenant_id = current_setting('app.tenant_id')::uuid AND
    user_id = current_setting('app.user_id')::uuid
  );

-- Comments
COMMENT ON TABLE dashboard_events IS 'Event store for dashboard operations. Used for audit trail, compliance, and event replay.';
COMMENT ON COLUMN dashboard_events.event_type IS 'Type of event (e.g., region_created, region_updated)';
COMMENT ON COLUMN dashboard_events.entity_type IS 'Type of entity the event relates to';
COMMENT ON COLUMN dashboard_events.entity_id IS 'ID of the entity this event relates to';
COMMENT ON COLUMN dashboard_events.payload IS 'Event payload containing relevant data';
COMMENT ON COLUMN dashboard_events.metadata IS 'Additional metadata (IP address, user agent, session ID, etc.)';
COMMENT ON COLUMN dashboard_events.version IS 'Entity version at time of event (for optimistic locking)';

