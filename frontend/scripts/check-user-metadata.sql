-- ============================================================================
-- CHECK AND FIX USER METADATA
-- ============================================================================
-- Check current user metadata and fix tenant_id if needed

-- Check all users and their metadata
SELECT 
  id,
  email,
  raw_user_meta_data,
  raw_app_meta_data,
  CASE 
    WHEN raw_user_meta_data->>'tenant_id' IS NOT NULL THEN raw_user_meta_data->>'tenant_id'
    WHEN raw_app_meta_data->>'tenant_id' IS NOT NULL THEN raw_app_meta_data->>'tenant_id'
    ELSE 'NO_TENANT_ID'
  END as current_tenant_id,
  CASE 
    WHEN raw_user_meta_data->>'tenant_id' IS NOT NULL THEN 'user_metadata'
    WHEN raw_app_meta_data->>'tenant_id' IS NOT NULL THEN 'app_metadata'
    ELSE 'NO_TENANT_ID'
  END as tenant_id_location
FROM auth.users 
ORDER BY created_at DESC;

-- Check specific user by email (replace with your email)
-- SELECT 
--   id,
--   email,
--   raw_user_meta_data,
--   raw_app_meta_data,
--   raw_user_meta_data->>'tenant_id' as user_meta_tenant,
--   raw_app_meta_data->>'tenant_id' as app_meta_tenant
-- FROM auth.users 
-- WHERE email = 'admin@veropestsolutions.com';

-- Fix tenant_id for specific user (uncomment and modify as needed)
/*
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || 
    jsonb_build_object('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
WHERE email = 'admin@veropestsolutions.com'
  AND (raw_user_meta_data->>'tenant_id' IS NULL OR raw_user_meta_data->>'tenant_id' != '7193113e-ece2-4f7b-ae8c-176df4367e28');
*/

-- Verify the fix worked
-- SELECT 
--   id,
--   email,
--   raw_user_meta_data->>'tenant_id' as tenant_id,
--   raw_user_meta_data->>'roles' as roles
-- FROM auth.users 
-- WHERE email = 'admin@veropestsolutions.com';







