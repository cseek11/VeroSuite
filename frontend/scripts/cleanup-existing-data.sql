-- ============================================================================
-- CLEANUP EXISTING DATA SCRIPT
-- ============================================================================
-- This script safely removes all existing data for your tenant
-- It handles foreign key constraints by deleting in the correct order
-- 
-- WARNING: This will DELETE ALL DATA for tenant: 7193113e-ece2-4f7b-ae8c-176df4367e28
-- Only run this if you want to start completely fresh!

-- ============================================================================
-- STEP 1: DELETE DATA IN REVERSE FOREIGN KEY ORDER
-- ============================================================================

-- First, delete from tables that reference other tables (child tables)
DELETE FROM public.search_logs WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid;

-- Delete from other child tables that might reference accounts
DELETE FROM public.customer_contacts WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid;
DELETE FROM public.customer_profiles WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid;
DELETE FROM public.customer_notes WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid;
DELETE FROM public.service_history WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid;
DELETE FROM public.locations WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid;
DELETE FROM public.service_pricing WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid;

-- Delete from service-related tables
DELETE FROM public.service_types WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid;
DELETE FROM public.service_categories WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid;
DELETE FROM public.service_areas WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid;
DELETE FROM public.pricing_tiers WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid;

-- Delete from customer segments
DELETE FROM public.customer_segments WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid;

-- Finally, delete from the main tables (parent tables)
DELETE FROM public.accounts WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid;
DELETE FROM public.tenants WHERE id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid;

-- ============================================================================
-- STEP 2: VERIFY CLEANUP
-- ============================================================================

-- Check that all data has been removed
SELECT 'CLEANUP VERIFICATION' as info, 'tenants' as table_name, COUNT(*) as record_count FROM public.tenants WHERE id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid
UNION ALL
SELECT 'CLEANUP VERIFICATION' as info, 'accounts' as table_name, COUNT(*) as record_count FROM public.accounts WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid
UNION ALL
SELECT 'CLEANUP VERIFICATION' as info, 'customer_profiles' as table_name, COUNT(*) as record_count FROM public.customer_profiles WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid
UNION ALL
SELECT 'CLEANUP VERIFICATION' as info, 'customer_segments' as table_name, COUNT(*) as record_count FROM public.customer_segments WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid
UNION ALL
SELECT 'CLEANUP VERIFICATION' as info, 'search_logs' as table_name, COUNT(*) as record_count FROM public.search_logs WHERE tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid;

-- ============================================================================
-- NEXT STEPS
-- ============================================================================
-- After running this cleanup script successfully:
-- 1. Run add-missing-columns.sql (if you haven't already)
-- 2. Run mock-customer-data-proper.sql to populate fresh data


