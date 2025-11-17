-- Dashboard Templates Migration
-- Stores dashboard templates for sharing across devices/users

CREATE TABLE IF NOT EXISTS dashboard_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail TEXT,
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  is_system BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  regions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dashboard_templates_tenant_id ON dashboard_templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_templates_user_id ON dashboard_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_templates_is_public ON dashboard_templates(is_public) WHERE is_public = true AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dashboard_templates_is_system ON dashboard_templates(is_system) WHERE is_system = true AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dashboard_templates_deleted_at ON dashboard_templates(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dashboard_templates_created_at ON dashboard_templates(created_at DESC);

-- RLS Policies
ALTER TABLE dashboard_templates ENABLE ROW LEVEL SECURITY;

-- Users can view their own templates and public templates from their tenant
CREATE POLICY "Users can view own and public tenant templates" ON dashboard_templates
  FOR SELECT USING (
    user_id = auth.uid() OR 
    (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND is_public = true AND deleted_at IS NULL)
  );

-- Users can insert their own templates
CREATE POLICY "Users can insert own templates" ON dashboard_templates
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own templates
CREATE POLICY "Users can update own templates" ON dashboard_templates
  FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own templates (soft delete)
CREATE POLICY "Users can delete own templates" ON dashboard_templates
  FOR DELETE USING (user_id = auth.uid());


