-- Recurring Jobs System
-- Migration: Create recurring job tables

-- Table: recurring_job_templates
-- Stores templates for recurring job series
CREATE TABLE IF NOT EXISTS recurring_job_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Recurrence pattern
  recurrence_type VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'monthly', 'custom'
  recurrence_interval INTEGER DEFAULT 1, -- Every N days/weeks/months
  recurrence_days_of_week INTEGER[], -- For weekly: [1,3,5] = Mon, Wed, Fri
  recurrence_day_of_month INTEGER, -- For monthly: day of month (1-31)
  recurrence_weekday_of_month VARCHAR(20), -- For monthly: 'first_monday', 'last_friday', etc.
  
  -- Time settings
  start_time TIME NOT NULL,
  end_time TIME,
  estimated_duration INTEGER, -- minutes
  
  -- Date range
  start_date DATE NOT NULL,
  end_date DATE, -- NULL = no end date
  max_occurrences INTEGER, -- NULL = unlimited
  
  -- Job template data (stored as JSON for flexibility)
  job_template JSONB NOT NULL, -- Contains customer_id, service_type_id, location_id, etc.
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_generated_date DATE, -- Last date for which jobs were generated
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  CONSTRAINT valid_recurrence CHECK (
    (recurrence_type = 'daily' AND recurrence_interval > 0) OR
    (recurrence_type = 'weekly' AND recurrence_interval > 0 AND array_length(recurrence_days_of_week, 1) > 0) OR
    (recurrence_type = 'monthly' AND recurrence_interval > 0) OR
    (recurrence_type = 'custom' AND recurrence_interval > 0)
  ),
  CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date >= start_date),
  CONSTRAINT valid_time_range CHECK (end_time IS NULL OR end_time > start_time)
);

-- Table: recurring_job_instances
-- Links individual jobs to their recurring template
CREATE TABLE IF NOT EXISTS recurring_job_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  recurring_template_id UUID NOT NULL REFERENCES recurring_job_templates(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  occurrence_number INTEGER NOT NULL, -- 1, 2, 3, etc.
  is_exception BOOLEAN DEFAULT false, -- True if this occurrence was modified/skipped
  exception_type VARCHAR(50), -- 'skipped', 'modified', 'cancelled'
  exception_notes TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(tenant_id, recurring_template_id, scheduled_date),
  UNIQUE(tenant_id, job_id)
);

-- Add recurrence fields to jobs table (if not already present)
-- Note: These may already exist, so we check first
DO $$ 
BEGIN
  -- Add parent_job_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'jobs' AND column_name = 'parent_job_id'
  ) THEN
    ALTER TABLE jobs ADD COLUMN parent_job_id UUID REFERENCES jobs(id) ON DELETE SET NULL;
  END IF;
  
  -- Add is_recurring if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'jobs' AND column_name = 'is_recurring'
  ) THEN
    ALTER TABLE jobs ADD COLUMN is_recurring BOOLEAN DEFAULT false;
  END IF;
  
  -- Add recurring_template_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'jobs' AND column_name = 'recurring_template_id'
  ) THEN
    ALTER TABLE jobs ADD COLUMN recurring_template_id UUID REFERENCES recurring_job_templates(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_recurring_templates_tenant_active 
  ON recurring_job_templates(tenant_id, is_active) 
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_recurring_templates_date_range 
  ON recurring_job_templates(start_date, end_date) 
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_recurring_instances_template 
  ON recurring_job_instances(tenant_id, recurring_template_id);

CREATE INDEX IF NOT EXISTS idx_recurring_instances_job 
  ON recurring_job_instances(tenant_id, job_id);

CREATE INDEX IF NOT EXISTS idx_recurring_instances_date 
  ON recurring_job_instances(scheduled_date);

CREATE INDEX IF NOT EXISTS idx_jobs_parent_job 
  ON jobs(tenant_id, parent_job_id) 
  WHERE parent_job_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_jobs_recurring_template 
  ON jobs(tenant_id, recurring_template_id) 
  WHERE recurring_template_id IS NOT NULL;

-- Comments
COMMENT ON TABLE recurring_job_templates IS 'Templates for recurring job series';
COMMENT ON TABLE recurring_job_instances IS 'Links individual jobs to their recurring template';
COMMENT ON COLUMN recurring_job_templates.recurrence_days_of_week IS 'Array of day numbers: 0=Sunday, 1=Monday, ..., 6=Saturday';
COMMENT ON COLUMN recurring_job_templates.recurrence_weekday_of_month IS 'Format: first_monday, second_tuesday, last_friday, etc.';






