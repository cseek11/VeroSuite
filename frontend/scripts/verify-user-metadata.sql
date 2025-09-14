-- ============================================================================
-- VERIFY AND UPDATE USER METADATA
-- ============================================================================
-- Script to check and update user metadata with tenant_id

-- Check current user metadata structure
SELECT 
  id,
  email,
  raw_user_meta_data,
  raw_app_meta_data,
  CASE 
    WHEN raw_user_meta_data->>'tenant_id' IS NOT NULL THEN 'user_metadata'
    WHEN raw_app_meta_data->>'tenant_id' IS NOT NULL THEN 'app_metadata'
    ELSE 'NO_TENANT_ID'
  END as tenant_id_location
FROM auth.users 
ORDER BY created_at DESC
LIMIT 10;

-- Check if any users have tenant_id
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN raw_user_meta_data->>'tenant_id' IS NOT NULL THEN 1 END) as users_with_tenant_in_user_meta,
  COUNT(CASE WHEN raw_app_meta_data->>'tenant_id' IS NOT NULL THEN 1 END) as users_with_tenant_in_app_meta,
  COUNT(CASE WHEN raw_user_meta_data->>'tenant_id' IS NULL AND raw_app_meta_data->>'tenant_id' IS NULL THEN 1 END) as users_without_tenant
FROM auth.users;

-- Update users without tenant_id (if needed)
-- Uncomment the following lines if you want to add tenant_id to users who don't have it
/*
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || 
    jsonb_build_object('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
WHERE raw_user_meta_data->>'tenant_id' IS NULL 
  AND raw_app_meta_data->>'tenant_id' IS NULL;
*/

-- Verify the update worked
SELECT 
  id,
  email,
  raw_user_meta_data->>'tenant_id' as tenant_id_from_user_meta,
  raw_app_meta_data->>'tenant_id' as tenant_id_from_app_meta
FROM auth.users 
WHERE raw_user_meta_data->>'tenant_id' IS NOT NULL 
   OR raw_app_meta_data->>'tenant_id' IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;

















