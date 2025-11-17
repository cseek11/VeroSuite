-- Fix RLS Policies for Dashboard Regions to Support ACL Sharing
-- This migration updates the RLS policies to allow users to view regions
-- that are shared with them via ACLs (Access Control Lists)

-- ============================================================================
-- Drop existing restrictive policies
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own regions" ON dashboard_regions;
DROP POLICY IF EXISTS "Users can update own regions" ON dashboard_regions;

-- ============================================================================
-- New RLS Policies - Dashboard Regions with ACL Support
-- ============================================================================

-- Users can view regions they own OR regions shared with them via ACLs
CREATE POLICY "Users can view accessible regions" ON dashboard_regions
  FOR SELECT USING (
    tenant_id = current_setting('app.tenant_id')::uuid AND (
      -- Own regions
      user_id = (current_setting('app.user_id')::uuid) OR
      -- Regions shared via ACLs
      id IN (
        SELECT region_id 
        FROM dashboard_region_acls
        WHERE tenant_id = current_setting('app.tenant_id')::uuid
        AND (
          -- Shared with user directly
          (principal_type = 'user' AND principal_id = current_setting('app.user_id')::uuid) OR
          -- Shared with user's role
          (principal_type = 'role' AND principal_id = ANY(
            COALESCE(
              string_to_array(current_setting('app.user_roles', true), ',')::uuid[],
              ARRAY[]::uuid[]
            )
          )) OR
          -- Shared with user's team
          (principal_type = 'team' AND principal_id = ANY(
            COALESCE(
              string_to_array(current_setting('app.user_teams', true), ',')::uuid[],
              ARRAY[]::uuid[]
            )
          ))
        )
        AND (permission_set->>'read')::boolean = true
      )
    )
  );

-- Users can update regions they own OR regions shared with edit permission
CREATE POLICY "Users can update accessible regions" ON dashboard_regions
  FOR UPDATE USING (
    tenant_id = current_setting('app.tenant_id')::uuid AND (
      -- Own regions
      (user_id = (current_setting('app.user_id')::uuid)) OR
      -- Regions shared with edit permission
      id IN (
        SELECT region_id 
        FROM dashboard_region_acls
        WHERE tenant_id = current_setting('app.tenant_id')::uuid
        AND (
          (principal_type = 'user' AND principal_id = current_setting('app.user_id')::uuid) OR
          (principal_type = 'role' AND principal_id = ANY(
            COALESCE(
              string_to_array(current_setting('app.user_roles', true), ',')::uuid[],
              ARRAY[]::uuid[]
            )
          )) OR
          (principal_type = 'team' AND principal_id = ANY(
            COALESCE(
              string_to_array(current_setting('app.user_teams', true), ',')::uuid[],
              ARRAY[]::uuid[]
            )
          ))
        )
        AND (permission_set->>'edit')::boolean = true
      )
    )
  );

-- ============================================================================
-- Comments
-- ============================================================================
COMMENT ON POLICY "Users can view accessible regions" ON dashboard_regions IS 
  'Allows users to view their own regions and regions shared with them via ACLs';

COMMENT ON POLICY "Users can update accessible regions" ON dashboard_regions IS 
  'Allows users to update their own regions and regions shared with edit permission via ACLs';




