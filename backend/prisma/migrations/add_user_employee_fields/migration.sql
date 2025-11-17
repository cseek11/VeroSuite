-- Add employee information fields to users table
-- Migration: add_user_employee_fields

-- Add emergency contact relationship
ALTER TABLE "public"."users" 
ADD COLUMN IF NOT EXISTS "emergency_contact_relationship" VARCHAR(50);

-- Add address fields
ALTER TABLE "public"."users" 
ADD COLUMN IF NOT EXISTS "address_line1" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "address_line2" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "city" VARCHAR(100),
ADD COLUMN IF NOT EXISTS "state" VARCHAR(2),
ADD COLUMN IF NOT EXISTS "postal_code" VARCHAR(20),
ADD COLUMN IF NOT EXISTS "country" VARCHAR(100) DEFAULT 'US';

-- Add personal information fields
ALTER TABLE "public"."users" 
ADD COLUMN IF NOT EXISTS "date_of_birth" DATE,
ADD COLUMN IF NOT EXISTS "social_security_number" VARCHAR(255), -- Encrypted at rest
ADD COLUMN IF NOT EXISTS "driver_license_number" VARCHAR(255), -- Encrypted at rest
ADD COLUMN IF NOT EXISTS "driver_license_state" VARCHAR(2),
ADD COLUMN IF NOT EXISTS "driver_license_expiry" DATE;

-- Add qualifications array
ALTER TABLE "public"."users" 
ADD COLUMN IF NOT EXISTS "qualifications" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add custom permissions array
ALTER TABLE "public"."users" 
ADD COLUMN IF NOT EXISTS "custom_permissions" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Create indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS "idx_users_state" ON "public"."users"("state");
CREATE INDEX IF NOT EXISTS "idx_users_city" ON "public"."users"("city");
CREATE INDEX IF NOT EXISTS "idx_users_postal_code" ON "public"."users"("postal_code");
CREATE INDEX IF NOT EXISTS "idx_users_employment_type" ON "public"."users"("employment_type");





