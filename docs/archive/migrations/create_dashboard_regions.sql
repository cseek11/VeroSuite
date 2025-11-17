-- Enterprise Region-Based Dashboard System
-- Migration: Create dashboard regions, versioning, ACLs, widget registry, presence, and audit tables

-- ============================================================================
-- 1. Dashboard Regions Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS dashboard_regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layout_id UUID NOT NULL REFERENCES dashboard_layouts(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  region_type VARCHAR(50) NOT NULL,
  grid_row INTEGER NOT NULL DEFAULT 0,
  grid_col INTEGER NOT NULL DEFAULT 0,
  row_span INTEGER NOT NULL DEFAULT 1,
  col_span INTEGER NOT NULL DEFAULT 1,
  min_width INTEGER DEFAULT 200,
  min_height INTEGER DEFAULT 150,
  is_collapsed BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  is_hidden_mobile BOOLEAN DEFAULT false,
  config JSONB DEFAULT '{}',
  widget_type VARCHAR(100),
  widget_config JSONB DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes for dashboard_regions
CREATE INDEX IF NOT EXISTS idx_dashboard_regions_layout_id ON dashboard_regions(layout_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_regions_tenant_id ON dashboard_regions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_regions_user_id ON dashboard_regions(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_regions_layout_tenant_user ON dashboard_regions(layout_id, tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_regions_display_order ON dashboard_regions(display_order);
CREATE INDEX IF NOT EXISTS idx_dashboard_regions_grid_position ON dashboard_regions(grid_row, grid_col);
CREATE INDEX IF NOT EXISTS idx_dashboard_regions_config ON dashboard_regions USING GIN (config);
CREATE INDEX IF NOT EXISTS idx_dashboard_regions_widget_config ON dashboard_regions USING GIN (widget_config);
CREATE INDEX IF NOT EXISTS idx_dashboard_regions_deleted_at ON dashboard_regions(deleted_at) WHERE deleted_at IS NULL;

-- ============================================================================
-- 2. Layout Versions Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS dashboard_layout_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layout_id UUID NOT NULL REFERENCES dashboard_layouts(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'preview', 'published')),
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  payload JSONB NOT NULL,
  diff JSONB,
  notes TEXT,
  tenant_id UUID NOT NULL,
  UNIQUE(layout_id, version_number)
);

-- Indexes for dashboard_layout_versions
CREATE INDEX IF NOT EXISTS idx_layout_versions_layout_id ON dashboard_layout_versions(layout_id);
CREATE INDEX IF NOT EXISTS idx_layout_versions_tenant_id ON dashboard_layout_versions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_layout_versions_status ON dashboard_layout_versions(status);
CREATE INDEX IF NOT EXISTS idx_layout_versions_created_at ON dashboard_layout_versions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_layout_versions_payload ON dashboard_layout_versions USING GIN (payload);
CREATE INDEX IF NOT EXISTS idx_layout_versions_diff ON dashboard_layout_versions USING GIN (diff);

-- ============================================================================
-- 3. Region ACLs Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS dashboard_region_acls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id UUID NOT NULL REFERENCES dashboard_regions(id) ON DELETE CASCADE,
  principal_type VARCHAR(20) NOT NULL CHECK (principal_type IN ('user', 'role', 'team')),
  principal_id UUID NOT NULL,
  permission_set JSONB NOT NULL DEFAULT '{"read": true, "edit": false, "share": false}',
  tenant_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(region_id, principal_type, principal_id)
);

-- Indexes for dashboard_region_acls
CREATE INDEX IF NOT EXISTS idx_region_acls_region_id ON dashboard_region_acls(region_id);
CREATE INDEX IF NOT EXISTS idx_region_acls_tenant_id ON dashboard_region_acls(tenant_id);
CREATE INDEX IF NOT EXISTS idx_region_acls_principal ON dashboard_region_acls(principal_type, principal_id);
CREATE INDEX IF NOT EXISTS idx_region_acls_permission_set ON dashboard_region_acls USING GIN (permission_set);

-- ============================================================================
-- 4. Widget Registry Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS dashboard_widget_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  widget_id VARCHAR(100) UNIQUE NOT NULL,
  manifest JSONB NOT NULL,
  signature TEXT,
  allowed_tenants UUID[],
  is_public BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for dashboard_widget_registry
CREATE INDEX IF NOT EXISTS idx_widget_registry_widget_id ON dashboard_widget_registry(widget_id);
CREATE INDEX IF NOT EXISTS idx_widget_registry_is_approved ON dashboard_widget_registry(is_approved) WHERE is_approved = true;
CREATE INDEX IF NOT EXISTS idx_widget_registry_is_public ON dashboard_widget_registry(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_widget_registry_manifest ON dashboard_widget_registry USING GIN (manifest);
CREATE INDEX IF NOT EXISTS idx_widget_registry_allowed_tenants ON dashboard_widget_registry USING GIN (allowed_tenants);

-- ============================================================================
-- 5. Migration Logs Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS dashboard_migration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  layout_id UUID NOT NULL,
  migration_payload JSONB NOT NULL,
  status VARCHAR(20) NOT NULL,
  errors JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL
);

-- Indexes for dashboard_migration_logs
CREATE INDEX IF NOT EXISTS idx_migration_logs_user_id ON dashboard_migration_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_migration_logs_layout_id ON dashboard_migration_logs(layout_id);
CREATE INDEX IF NOT EXISTS idx_migration_logs_tenant_id ON dashboard_migration_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_migration_logs_status ON dashboard_migration_logs(status);
CREATE INDEX IF NOT EXISTS idx_migration_logs_created_at ON dashboard_migration_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_migration_logs_payload ON dashboard_migration_logs USING GIN (migration_payload);

-- ============================================================================
-- 6. Region Presence Table (for collaboration)
-- ============================================================================
CREATE TABLE IF NOT EXISTS dashboard_region_presence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id UUID NOT NULL REFERENCES dashboard_regions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  session_id VARCHAR(255) NOT NULL,
  is_editing BOOLEAN DEFAULT false,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL,
  UNIQUE(region_id, user_id, session_id)
);

-- Indexes for dashboard_region_presence
CREATE INDEX IF NOT EXISTS idx_region_presence_region_id ON dashboard_region_presence(region_id);
CREATE INDEX IF NOT EXISTS idx_region_presence_tenant_id ON dashboard_region_presence(tenant_id);
CREATE INDEX IF NOT EXISTS idx_region_presence_user_id ON dashboard_region_presence(user_id);
CREATE INDEX IF NOT EXISTS idx_region_presence_last_seen ON dashboard_region_presence(last_seen);
CREATE INDEX IF NOT EXISTS idx_region_presence_is_editing ON dashboard_region_presence(is_editing) WHERE is_editing = true;

-- ============================================================================
-- 7. Layout Audit Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS dashboard_layout_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layout_id UUID NOT NULL,
  user_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,
  changes JSONB,
  metadata JSONB,
  tenant_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for dashboard_layout_audit
CREATE INDEX IF NOT EXISTS idx_layout_audit_layout_id ON dashboard_layout_audit(layout_id);
CREATE INDEX IF NOT EXISTS idx_layout_audit_user_id ON dashboard_layout_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_layout_audit_tenant_id ON dashboard_layout_audit(tenant_id);
CREATE INDEX IF NOT EXISTS idx_layout_audit_action ON dashboard_layout_audit(action);
CREATE INDEX IF NOT EXISTS idx_layout_audit_created_at ON dashboard_layout_audit(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_layout_audit_changes ON dashboard_layout_audit USING GIN (changes);
CREATE INDEX IF NOT EXISTS idx_layout_audit_metadata ON dashboard_layout_audit USING GIN (metadata);

-- ============================================================================
-- 8. Enable Row Level Security
-- ============================================================================
ALTER TABLE dashboard_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_layout_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_region_acls ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_widget_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_migration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_region_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_layout_audit ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 9. RLS Policies - Dashboard Regions
-- ============================================================================
-- Users can view their own regions
CREATE POLICY "Users can view own regions" ON dashboard_regions
  FOR SELECT USING (
    tenant_id = current_setting('app.tenant_id')::uuid AND
    user_id = (current_setting('app.user_id')::uuid)
  );

-- Users can insert their own regions
CREATE POLICY "Users can insert own regions" ON dashboard_regions
  FOR INSERT WITH CHECK (
    tenant_id = current_setting('app.tenant_id')::uuid AND
    user_id = (current_setting('app.user_id')::uuid)
  );

-- Users can update their own regions
CREATE POLICY "Users can update own regions" ON dashboard_regions
  FOR UPDATE USING (
    tenant_id = current_setting('app.tenant_id')::uuid AND
    user_id = (current_setting('app.user_id')::uuid)
  );

-- Users can delete their own regions (soft delete)
CREATE POLICY "Users can delete own regions" ON dashboard_regions
  FOR UPDATE USING (
    tenant_id = current_setting('app.tenant_id')::uuid AND
    user_id = (current_setting('app.user_id')::uuid)
  );

-- ============================================================================
-- 10. RLS Policies - Layout Versions
-- ============================================================================
CREATE POLICY "Users can view own layout versions" ON dashboard_layout_versions
  FOR SELECT USING (tenant_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY "Users can insert own layout versions" ON dashboard_layout_versions
  FOR INSERT WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY "Users can update own layout versions" ON dashboard_layout_versions
  FOR UPDATE USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- ============================================================================
-- 11. RLS Policies - Region ACLs
-- ============================================================================
CREATE POLICY "Users can view region ACLs" ON dashboard_region_acls
  FOR SELECT USING (tenant_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY "Users can manage region ACLs" ON dashboard_region_acls
  FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- ============================================================================
-- 12. RLS Policies - Widget Registry
-- ============================================================================
-- Public widgets are visible to all tenants
-- Approved widgets are visible to their allowed tenants
CREATE POLICY "Users can view approved widgets" ON dashboard_widget_registry
  FOR SELECT USING (
    is_approved = true AND (
      is_public = true OR
      (current_setting('app.tenant_id')::uuid = ANY(allowed_tenants))
    )
  );

-- Only admins can insert widgets (handled at application level)
CREATE POLICY "Admins can manage widgets" ON dashboard_widget_registry
  FOR ALL USING (true); -- Application-level check for admin role

-- ============================================================================
-- 13. RLS Policies - Migration Logs
-- ============================================================================
CREATE POLICY "Users can view own migration logs" ON dashboard_migration_logs
  FOR SELECT USING (
    tenant_id = current_setting('app.tenant_id')::uuid AND
    user_id = (current_setting('app.user_id')::uuid)
  );

CREATE POLICY "Users can insert own migration logs" ON dashboard_migration_logs
  FOR INSERT WITH CHECK (
    tenant_id = current_setting('app.tenant_id')::uuid AND
    user_id = (current_setting('app.user_id')::uuid)
  );

-- ============================================================================
-- 14. RLS Policies - Region Presence
-- ============================================================================
CREATE POLICY "Users can view region presence" ON dashboard_region_presence
  FOR SELECT USING (tenant_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY "Users can update own presence" ON dashboard_region_presence
  FOR ALL USING (
    tenant_id = current_setting('app.tenant_id')::uuid AND
    user_id = (current_setting('app.user_id')::uuid)
  );

-- ============================================================================
-- 15. RLS Policies - Layout Audit
-- ============================================================================
CREATE POLICY "Users can view layout audit logs" ON dashboard_layout_audit
  FOR SELECT USING (tenant_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY "System can insert audit logs" ON dashboard_layout_audit
  FOR INSERT WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);

-- ============================================================================
-- 16. Triggers for updated_at timestamps
-- ============================================================================
-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_dashboard_regions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for dashboard_regions
CREATE TRIGGER trigger_update_dashboard_regions_updated_at
  BEFORE UPDATE ON dashboard_regions
  FOR EACH ROW
  EXECUTE FUNCTION update_dashboard_regions_updated_at();

-- Trigger for dashboard_widget_registry
CREATE TRIGGER trigger_update_widget_registry_updated_at
  BEFORE UPDATE ON dashboard_widget_registry
  FOR EACH ROW
  EXECUTE FUNCTION update_dashboard_regions_updated_at();

-- ============================================================================
-- 17. Function to clean up stale presence records
-- ============================================================================
CREATE OR REPLACE FUNCTION cleanup_stale_presence()
RETURNS void AS $$
BEGIN
  DELETE FROM dashboard_region_presence
  WHERE last_seen < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 18. Comments
-- ============================================================================
COMMENT ON TABLE dashboard_regions IS 'Dashboard regions for region-based layout system';
COMMENT ON TABLE dashboard_layout_versions IS 'Version history for dashboard layouts with draft/preview/published states';
COMMENT ON TABLE dashboard_region_acls IS 'Access control lists for fine-grained region permissions';
COMMENT ON TABLE dashboard_widget_registry IS 'Registry of approved widgets with manifests and signatures';
COMMENT ON TABLE dashboard_migration_logs IS 'Logs of card-to-region migration operations';
COMMENT ON TABLE dashboard_region_presence IS 'Real-time presence tracking for collaborative editing';
COMMENT ON TABLE dashboard_layout_audit IS 'Audit trail for all layout changes';





