-- Create KPI Configurations table
CREATE TABLE IF NOT EXISTS kpi_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('financial', 'operational', 'customer', 'compliance')),
  threshold JSONB NOT NULL,
  drill_down JSONB,
  real_time BOOLEAN DEFAULT false,
  enabled BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create KPI Data table for storing actual KPI values
CREATE TABLE IF NOT EXISTS kpi_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id UUID REFERENCES kpi_configs(id) ON DELETE CASCADE,
  metric VARCHAR(255) NOT NULL,
  value DECIMAL(15,4) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB,
  tenant_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_kpi_configs_tenant_id ON kpi_configs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_kpi_configs_category ON kpi_configs(category);
CREATE INDEX IF NOT EXISTS idx_kpi_configs_enabled ON kpi_configs(enabled);
CREATE INDEX IF NOT EXISTS idx_kpi_configs_created_at ON kpi_configs(created_at);

CREATE INDEX IF NOT EXISTS idx_kpi_data_tenant_id ON kpi_data(tenant_id);
CREATE INDEX IF NOT EXISTS idx_kpi_data_kpi_id ON kpi_data(kpi_id);
CREATE INDEX IF NOT EXISTS idx_kpi_data_metric ON kpi_data(metric);
CREATE INDEX IF NOT EXISTS idx_kpi_data_timestamp ON kpi_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_kpi_data_metric_timestamp ON kpi_data(metric, timestamp);

-- Enable Row Level Security (RLS)
ALTER TABLE kpi_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for kpi_configs
CREATE POLICY "Users can view KPIs for their tenant" ON kpi_configs
  FOR SELECT USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  );

CREATE POLICY "Users can create KPIs for their tenant" ON kpi_configs
  FOR INSERT WITH CHECK (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid AND
    user_id = (auth.jwt() ->> 'sub')::uuid
  );

CREATE POLICY "Users can update KPIs for their tenant" ON kpi_configs
  FOR UPDATE USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  );

CREATE POLICY "Users can delete KPIs for their tenant" ON kpi_configs
  FOR DELETE USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  );

-- Create RLS policies for kpi_data
CREATE POLICY "Users can view KPI data for their tenant" ON kpi_data
  FOR SELECT USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  );

CREATE POLICY "Users can insert KPI data for their tenant" ON kpi_data
  FOR INSERT WITH CHECK (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  );

CREATE POLICY "Users can update KPI data for their tenant" ON kpi_data
  FOR UPDATE USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  );

CREATE POLICY "Users can delete KPI data for their tenant" ON kpi_data
  FOR DELETE USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for kpi_configs updated_at
CREATE TRIGGER update_kpi_configs_updated_at
  BEFORE UPDATE ON kpi_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample KPI configurations
INSERT INTO kpi_configs (name, description, category, threshold, drill_down, real_time, enabled, tenant_id, user_id) VALUES
(
  'Jobs Completed Today',
  'Number of jobs completed today',
  'operational',
  '{"green": 40, "yellow": 30, "red": 20}',
  '{"endpoint": "/api/jobs/completed", "filters": {"date": "today", "status": "completed"}, "title": "Completed Jobs Details", "description": "View detailed breakdown of completed jobs"}',
  true,
  true,
  '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
  '85b4bc59-650a-4fdf-beac-1dd2ba3066f4'::uuid
),
(
  'Daily Revenue',
  'Total daily revenue',
  'financial',
  '{"green": 10000, "yellow": 7500, "red": 5000, "unit": "USD"}',
  '{"endpoint": "/api/financial/revenue", "filters": {"period": "daily"}, "title": "Revenue Breakdown", "description": "Detailed revenue analysis by service type"}',
  true,
  true,
  '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
  '85b4bc59-650a-4fdf-beac-1dd2ba3066f4'::uuid
),
(
  'Customer Satisfaction',
  'Average customer satisfaction score',
  'customer',
  '{"green": 4.0, "yellow": 3.5, "red": 3.0, "unit": "stars"}',
  '{"endpoint": "/api/customers/satisfaction", "filters": {"period": "monthly"}, "title": "Customer Feedback", "description": "Detailed customer satisfaction metrics"}',
  false,
  true,
  '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
  '85b4bc59-650a-4fdf-beac-1dd2ba3066f4'::uuid
),
(
  'Cancellation Rate',
  'Percentage of cancelled jobs',
  'operational',
  '{"green": 3, "yellow": 7, "red": 10, "unit": "%"}',
  null,
  true,
  true,
  '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid,
  '85b4bc59-650a-4fdf-beac-1dd2ba3066f4'::uuid
);

-- Insert some sample KPI data
INSERT INTO kpi_data (kpi_id, metric, value, tenant_id)
SELECT 
  c.id,
  c.name,
  CASE 
    WHEN c.name = 'Jobs Completed Today' THEN 45
    WHEN c.name = 'Daily Revenue' THEN 12500
    WHEN c.name = 'Customer Satisfaction' THEN 4.2
    WHEN c.name = 'Cancellation Rate' THEN 5.2
    ELSE 0
  END,
  c.tenant_id
FROM kpi_configs c
WHERE c.tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28'::uuid;
