-- Drop all problematic tables that reference auth.users
-- These tables are causing cross-schema reference issues

DROP TABLE IF EXISTS public.search_errors CASCADE;
DROP TABLE IF EXISTS public.search_logs CASCADE;
DROP TABLE IF EXISTS public.search_user_behavior CASCADE;
DROP TABLE IF EXISTS public.search_analytics CASCADE;
DROP TABLE IF EXISTS public.search_performance CASCADE;

-- Also drop any related constraints or indexes
DROP INDEX IF EXISTS idx_search_errors_resolved_by;
DROP INDEX IF EXISTS idx_search_errors_created_at;
DROP INDEX IF EXISTS idx_search_logs_user_id;
DROP INDEX IF EXISTS idx_search_logs_created_at;
DROP INDEX IF EXISTS idx_search_user_behavior_user;
DROP INDEX IF EXISTS idx_search_user_behavior_created_at;
DROP INDEX IF EXISTS idx_search_analytics_created_at;
DROP INDEX IF EXISTS idx_search_performance_created_at;
