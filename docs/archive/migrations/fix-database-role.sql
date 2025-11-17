-- Create the missing verofield_app role
-- Run this in your Supabase SQL Editor

-- Create the verofield_app role
CREATE ROLE verofield_app;

-- Grant necessary permissions to the role
GRANT USAGE ON SCHEMA public TO verofield_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO verofield_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO verofield_app;

-- Grant permissions on future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO verofield_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO verofield_app;

-- Verify the role was created
SELECT rolname FROM pg_roles WHERE rolname = 'verofield_app';

