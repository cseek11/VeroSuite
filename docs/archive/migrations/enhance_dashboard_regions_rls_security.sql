-- Enhanced RLS Policies for Dashboard Regions with Comprehensive Security
-- This migration enhances existing RLS policies with additional security checks

-- ============================================================================
-- Drop existing policies to recreate with enhancements
-- Drop all possible policy name variations from previous migrations
-- ============================================================================
-- Drop policies from create_dashboard_regions.sql (original names)
DROP POLICY IF EXISTS "Users can view own regions" ON dashboard_regions;
DROP POLICY IF EXISTS "Users can update own regions" ON dashboard_regions;
DROP POLICY IF EXISTS "Users can insert own regions" ON dashboard_regions;
DROP POLICY IF EXISTS "Users can delete own regions" ON dashboard_regions;

-- Drop policies from fix_dashboard_regions_rls_for_acls.sql (intermediate names)
DROP POLICY IF EXISTS "Users can view accessible regions" ON dashboard_regions;
DROP POLICY IF EXISTS "Users can update accessible regions" ON dashboard_regions;

-- Drop policies that might have been created by enhance migration (if re-running)
DROP POLICY IF EXISTS "Users can delete accessible regions" ON dashboard_regions;

-- ============================================================================
-- Enhanced RLS Policies - Dashboard Regions
-- ============================================================================

-- Users can view regions they own OR regions shared with them via ACLs
-- Enhanced with explicit tenant isolation and deleted_at check
-- Drop and recreate to ensure clean state
DROP POLICY IF EXISTS "Users can view accessible regions" ON dashboard_regions;
CREATE POLICY "Users can view accessible regions" ON dashboard_regions
  FOR SELECT USING (
    -- Tenant isolation (CRITICAL)
    tenant_id = current_setting('app.tenant_id')::uuid AND
    -- Exclude soft-deleted regions
    deleted_at IS NULL AND (
      -- Own regions
      user_id = (current_setting('app.user_id')::uuid) OR
      -- Regions shared via ACLs with read permission
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

-- Users can insert regions only for their own tenant and user
-- Enhanced with explicit tenant and user validation
-- Drop and recreate to ensure clean state
DROP POLICY IF EXISTS "Users can insert own regions" ON dashboard_regions;
CREATE POLICY "Users can insert own regions" ON dashboard_regions
  FOR INSERT WITH CHECK (
    -- Tenant isolation (CRITICAL)
    tenant_id = current_setting('app.tenant_id')::uuid AND
    -- User must match authenticated user
    user_id = (current_setting('app.user_id')::uuid) AND
    -- Prevent inserting with deleted_at set
    deleted_at IS NULL
  );

-- Users can update regions they own OR regions shared with edit permission
-- Enhanced with version checking support and tenant isolation
-- Drop and recreate to ensure clean state
DROP POLICY IF EXISTS "Users can update accessible regions" ON dashboard_regions;
CREATE POLICY "Users can update accessible regions" ON dashboard_regions
  FOR UPDATE USING (
    -- Tenant isolation (CRITICAL)
    tenant_id = current_setting('app.tenant_id')::uuid AND
    -- Exclude soft-deleted regions
    deleted_at IS NULL AND (
      -- Own regions
      (user_id = (current_setting('app.user_id')::uuid)) OR
      -- Regions shared with edit permission via ACLs
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
  )
  WITH CHECK (
    -- Ensure tenant_id and user_id cannot be changed
    tenant_id = current_setting('app.tenant_id')::uuid AND
    user_id = (current_setting('app.user_id')::uuid)
  );

-- Users can soft-delete regions they own OR regions shared with edit permission
-- Enhanced with explicit permission checks
-- Drop and recreate to ensure clean state
DROP POLICY IF EXISTS "Users can delete accessible regions" ON dashboard_regions;
CREATE POLICY "Users can delete accessible regions" ON dashboard_regions
  FOR UPDATE USING (
    -- Tenant isolation (CRITICAL)
    tenant_id = current_setting('app.tenant_id')::uuid AND
    -- Only allow soft-delete of non-deleted regions
    deleted_at IS NULL AND (
      -- Own regions
      (user_id = (current_setting('app.user_id')::uuid)) OR
      -- Regions shared with edit permission via ACLs
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
  )
  WITH CHECK (
    -- Ensure tenant_id and user_id cannot be changed
    tenant_id = current_setting('app.tenant_id')::uuid AND
    user_id = (current_setting('app.user_id')::uuid)
  );

-- ============================================================================
-- Add version column if it doesn't exist (for optimistic locking)
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'dashboard_regions' 
    AND column_name = 'version'
  ) THEN
    ALTER TABLE dashboard_regions ADD COLUMN version INTEGER DEFAULT 1 NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_dashboard_regions_version ON dashboard_regions(id, version);
  END IF;
END $$;

-- ============================================================================
-- Add indexes for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_dashboard_regions_tenant_user ON dashboard_regions(tenant_id, user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dashboard_regions_layout ON dashboard_regions(layout_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dashboard_regions_deleted_at ON dashboard_regions(deleted_at) WHERE deleted_at IS NOT NULL;

-- ============================================================================
-- Comments
-- ============================================================================
COMMENT ON POLICY "Users can view accessible regions" ON dashboard_regions IS 
  'Allows users to view their own regions and regions shared with them via ACLs. Includes tenant isolation and soft-delete filtering.';

COMMENT ON POLICY "Users can insert own regions" ON dashboard_regions IS 
  'Allows users to insert regions only for their own tenant and user. Prevents tenant_id and user_id tampering.';

COMMENT ON POLICY "Users can update accessible regions" ON dashboard_regions IS 
  'Allows users to update their own regions and regions shared with edit permission via ACLs. Includes tenant isolation and prevents tenant_id/user_id changes.';

COMMENT ON POLICY "Users can delete accessible regions" ON dashboard_regions IS 
  'Allows users to soft-delete their own regions and regions shared with edit permission via ACLs. Includes tenant isolation.';

