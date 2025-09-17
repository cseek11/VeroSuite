-- Create the missing verosuite_app role
-- Run this in your Supabase SQL Editor

-- Create the verosuite_app role
CREATE ROLE verosuite_app;

-- Grant necessary permissions to the role
GRANT USAGE ON SCHEMA public TO verosuite_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO verosuite_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO verosuite_app;

-- Grant permissions on future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO verosuite_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO verosuite_app;

-- Verify the role was created
SELECT rolname FROM pg_roles WHERE rolname = 'verosuite_app';
