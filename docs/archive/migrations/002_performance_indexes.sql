-- ============================================================================
-- PERFORMANCE OPTIMIZATION: Add Missing Database Indexes
-- ============================================================================
-- This script adds critical indexes for query performance optimization
-- 
-- Priority: P1 - Important for performance
-- Risk: Slow queries without proper indexing
-- 
-- Usage: Run this in your Supabase SQL Editor
-- 
-- Author: VeroField Security Audit
-- Date: January 2, 2025
-- ============================================================================

-- Enable timing to measure index creation performance
-- Note: \timing is only available in psql client, not in Supabase SQL Editor
-- You can manually check timing by noting start/end times

-- Accounts table indexes
-- Primary query patterns: tenant_id + name, tenant_id + account_type
CREATE INDEX IF NOT EXISTS idx_accounts_tenant_name 
    ON accounts(tenant_id, name);

CREATE INDEX IF NOT EXISTS idx_accounts_tenant_type 
    ON accounts(tenant_id, account_type);

CREATE INDEX IF NOT EXISTS idx_accounts_tenant_status 
    ON accounts(tenant_id, status) 
    WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_accounts_tenant_email 
    ON accounts(tenant_id, email) 
    WHERE email IS NOT NULL;

-- Jobs table indexes  
-- Primary query patterns: tenant_id + scheduled_date, tenant_id + status, tenant_id + technician_id
CREATE INDEX IF NOT EXISTS idx_jobs_tenant_scheduled 
    ON jobs(tenant_id, scheduled_date);

CREATE INDEX IF NOT EXISTS idx_jobs_tenant_status 
    ON jobs(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_jobs_tenant_technician 
    ON jobs(tenant_id, technician_id) 
    WHERE technician_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_jobs_tenant_account 
    ON jobs(tenant_id, account_id);

-- Work Orders table indexes
-- Primary query patterns: tenant_id + account_id, tenant_id + status
CREATE INDEX IF NOT EXISTS idx_work_orders_tenant_account 
    ON work_orders(tenant_id, account_id);

CREATE INDEX IF NOT EXISTS idx_work_orders_tenant_status 
    ON work_orders(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_work_orders_tenant_location 
    ON work_orders(tenant_id, location_id);

-- Locations table indexes
-- Primary query patterns: tenant_id + account_id, geographic queries
CREATE INDEX IF NOT EXISTS idx_locations_tenant_account 
    ON locations(tenant_id, account_id);

CREATE INDEX IF NOT EXISTS idx_locations_tenant_area 
    ON locations(tenant_id, service_area_id) 
    WHERE service_area_id IS NOT NULL;

-- Geographic index for location-based queries (if using PostGIS)
-- CREATE INDEX IF NOT EXISTS idx_locations_geom 
--     ON locations USING GIST(ST_Point(longitude, latitude))
--     WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Audit Logs table indexes
-- Primary query patterns: tenant_id + timestamp (DESC), tenant_id + user_id
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_timestamp 
    ON audit_logs(tenant_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_user 
    ON audit_logs(tenant_id, user_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_resource 
    ON audit_logs(tenant_id, resource_type, resource_id);

-- Users table indexes (if not already present)
-- Primary query patterns: tenant_id + email, tenant_id + status
CREATE INDEX IF NOT EXISTS idx_users_tenant_email 
    ON users(tenant_id, email);

CREATE INDEX IF NOT EXISTS idx_users_tenant_status 
    ON users(tenant_id, status) 
    WHERE status = 'active';

-- Performance analysis queries
-- Use these to verify index effectiveness

-- 1. Check index usage statistics
SELECT 
    schemaname,
    relname as tablename,
    indexrelname as indexname,
    idx_scan as times_used,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
    AND relname IN ('accounts', 'jobs', 'work_orders', 'locations', 'audit_logs', 'users')
ORDER BY relname, times_used DESC;

-- 2. Check table sizes and index sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size('"'||schemaname||'"."'||tablename||'"')) as total_size,
    pg_size_pretty(pg_relation_size('"'||schemaname||'"."'||tablename||'"')) as table_size,
    pg_size_pretty(pg_total_relation_size('"'||schemaname||'"."'||tablename||'"') - pg_relation_size('"'||schemaname||'"."'||tablename||'"')) as index_size
FROM pg_tables 
WHERE schemaname = 'public'
    AND tablename IN ('accounts', 'jobs', 'work_orders', 'locations', 'audit_logs', 'users')
ORDER BY pg_total_relation_size('"'||schemaname||'"."'||tablename||'"') DESC;

-- 3. Identify slow queries (enable pg_stat_statements extension first)
-- SELECT 
--     query,
--     calls,
--     total_time,
--     mean_time,
--     rows
-- FROM pg_stat_statements 
-- WHERE query LIKE '%accounts%' OR query LIKE '%jobs%'
-- ORDER BY mean_time DESC 
-- LIMIT 10;

-- ============================================================================
-- QUERY OPTIMIZATION EXAMPLES
-- ============================================================================

-- Example: Optimized customer search query
-- BEFORE: Full table scan
-- SELECT * FROM accounts WHERE name ILIKE '%smith%' AND tenant_id = '...';

-- AFTER: Uses index efficiently  
-- SELECT * FROM accounts 
-- WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28' 
--   AND name ILIKE '%smith%';

-- Example: Optimized jobs query for technician dashboard
-- BEFORE: Multiple table scans
-- SELECT j.*, a.name as account_name 
-- FROM jobs j 
-- JOIN accounts a ON j.account_id = a.id 
-- WHERE j.technician_id = '...' AND j.scheduled_date >= CURRENT_DATE;

-- AFTER: Uses indexes efficiently
-- SELECT j.*, a.name as account_name 
-- FROM jobs j 
-- JOIN accounts a ON j.account_id = a.id AND j.tenant_id = a.tenant_id
-- WHERE j.tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'
--   AND j.technician_id = '...' 
--   AND j.scheduled_date >= CURRENT_DATE;

-- ============================================================================
-- MONITORING QUERIES
-- ============================================================================

-- Monitor index effectiveness over time
CREATE OR REPLACE VIEW v_index_effectiveness AS
SELECT 
    schemaname,
    relname as tablename,
    indexrelname as indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch,
    CASE 
        WHEN idx_scan = 0 THEN 'UNUSED'
        WHEN idx_scan < 100 THEN 'LOW_USAGE'
        WHEN idx_scan < 1000 THEN 'MODERATE_USAGE'
        ELSE 'HIGH_USAGE'
    END as usage_level
FROM pg_stat_user_indexes 
WHERE schemaname = 'public';

-- View slow queries (requires pg_stat_statements)
-- CREATE OR REPLACE VIEW v_slow_queries AS
-- SELECT 
--     substring(query, 1, 100) as query_start,
--     calls,
--     total_time,
--     mean_time,
--     rows,
--     100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
-- FROM pg_stat_statements 
-- ORDER BY mean_time DESC;

-- ============================================================================
-- POST-DEPLOYMENT VERIFICATION
-- ============================================================================
-- 
-- □ 1. Verify all indexes were created successfully
-- □ 2. Run EXPLAIN ANALYZE on common queries to verify index usage
-- □ 3. Monitor query performance improvement
-- □ 4. Check that application performance has improved
-- □ 5. Monitor index usage statistics over time
-- 
-- Expected improvements:
-- - Customer search queries: 50-90% faster
-- - Job dashboard queries: 60-80% faster  
-- - Audit log queries: 70-90% faster
-- ============================================================================

-- Check final index status
SELECT 
    'INDEX CREATION COMPLETE' as status,
    COUNT(*) as total_indexes_created
FROM pg_indexes 
WHERE schemaname = 'public' 
    AND indexname LIKE 'idx_%'
    AND tablename IN ('accounts', 'jobs', 'work_orders', 'locations', 'audit_logs', 'users');

-- Script completed successfully
-- All indexes should now be created
