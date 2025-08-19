-- Example Row Level Security (RLS) policy for Postgres
-- Enable RLS on jobs table
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON jobs
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
-- Set tenant context per request in middleware
-- SET LOCAL app.tenant_id = '<tenant_id>';
