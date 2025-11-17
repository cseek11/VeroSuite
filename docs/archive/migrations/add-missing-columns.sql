-- ============================================================================
-- ADD MISSING COLUMNS FOR SYSTEM STABILITY AND VALUE
-- ============================================================================
-- This script adds columns that will enhance your pest control management system

-- Add is_active column to service_categories for better service management
ALTER TABLE public.service_categories 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add is_active column to service_types for service availability control
ALTER TABLE public.service_types 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add is_active column to service_areas for geographic service control
ALTER TABLE public.service_areas 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add is_active column to pricing_tiers for pricing control
ALTER TABLE public.pricing_tiers 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add estimated_duration to service_types for scheduling optimization
ALTER TABLE public.service_types 
ADD COLUMN IF NOT EXISTS estimated_duration INTEGER;

-- Add service_code to service_types for better service identification
ALTER TABLE public.service_types 
ADD COLUMN IF NOT EXISTS service_code VARCHAR(50);

-- Add area_code to service_areas for geographic identification
ALTER TABLE public.service_areas 
ADD COLUMN IF NOT EXISTS area_code VARCHAR(50);

-- Add tier_code to pricing_tiers for pricing identification
ALTER TABLE public.pricing_tiers 
ADD COLUMN IF NOT EXISTS tier_code VARCHAR(50);

-- Add segment_code to customer_segments for customer classification
ALTER TABLE public.customer_segments 
ADD COLUMN IF NOT EXISTS segment_code VARCHAR(50);

-- Add default_service_types to customer_segments for service planning
ALTER TABLE public.customer_segments 
ADD COLUMN IF NOT EXISTS default_service_types JSONB;

-- Add compliance_requirements to customer_segments for regulatory compliance
ALTER TABLE public.customer_segments 
ADD COLUMN IF NOT EXISTS compliance_requirements JSONB;

-- Add discount_percentage to pricing_tiers for pricing flexibility
ALTER TABLE public.pricing_tiers 
ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(5,2) DEFAULT 0.0;

-- Add coverage_radius_miles to service_areas for geographic planning
ALTER TABLE public.service_areas 
ADD COLUMN IF NOT EXISTS coverage_radius_miles DECIMAL(8,2);

-- Add description columns for better documentation
ALTER TABLE public.service_categories 
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE public.service_types 
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE public.service_areas 
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE public.pricing_tiers 
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE public.customer_segments 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add unique constraints for data integrity (using proper PostgreSQL syntax)
DO $$
BEGIN
    -- Add unique constraint for service_categories if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'service_categories_tenant_code_unique'
    ) THEN
        ALTER TABLE public.service_categories 
        ADD CONSTRAINT service_categories_tenant_code_unique 
        UNIQUE (tenant_id, category_code);
    END IF;

    -- Add unique constraint for service_types if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'service_types_tenant_code_unique'
    ) THEN
        ALTER TABLE public.service_types 
        ADD CONSTRAINT service_types_tenant_code_unique 
        UNIQUE (tenant_id, service_code);
    END IF;

    -- Add unique constraint for service_areas if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'service_areas_tenant_code_unique'
    ) THEN
        ALTER TABLE public.service_areas 
        ADD CONSTRAINT service_areas_tenant_code_unique 
        UNIQUE (tenant_id, area_code);
    END IF;

    -- Add unique constraint for pricing_tiers if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'pricing_tiers_tenant_code_unique'
    ) THEN
        ALTER TABLE public.pricing_tiers 
        ADD CONSTRAINT pricing_tiers_tenant_code_unique 
        UNIQUE (tenant_id, tier_code);
    END IF;

    -- Add unique constraint for customer_segments if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'customer_segments_tenant_code_unique'
    ) THEN
        ALTER TABLE public.customer_segments 
        ADD CONSTRAINT customer_segments_tenant_code_unique 
        UNIQUE (tenant_id, segment_code);
    END IF;
END $$;

-- Verify the changes
SELECT 'COLUMNS ADDED SUCCESSFULLY' as status;
