-- Quick check to see what migrations have been applied
-- Run this in your Supabase SQL Editor

-- Check if version column exists (from enhance_dashboard_regions_rls_security.sql)
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'dashboard_regions' 
      AND column_name = 'version'
    ) THEN '✅ Version column exists'
    ELSE '❌ Version column MISSING - Run enhance_dashboard_regions_rls_security.sql'
  END as version_check;

-- Check if dashboard_events table exists (from create_dashboard_events_table.sql)
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'dashboard_events'
    ) THEN '✅ Events table exists'
    ELSE '❌ Events table MISSING - Run create_dashboard_events_table.sql'
  END as events_table_check;

-- Check if dashboard_regions table exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'dashboard_regions'
    ) THEN '✅ Regions table exists'
    ELSE '❌ Regions table MISSING - Run create_dashboard_regions.sql first'
  END as regions_table_check;

-- List all dashboard tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'dashboard_%'
ORDER BY table_name;




