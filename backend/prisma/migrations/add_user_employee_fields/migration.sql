-- Add employee information fields to users table               
-- Migration: add_user_employee_fields                          

-- Add employee fields first (needed for index)
ALTER TABLE "public"."users"    
ADD COLUMN IF NOT EXISTS "employee_id" VARCHAR(20),
ADD COLUMN IF NOT EXISTS "technician_number" VARCHAR(20),
ADD COLUMN IF NOT EXISTS "pesticide_license_number" VARCHAR(50),
ADD COLUMN IF NOT EXISTS "license_expiration_date" DATE,
ADD COLUMN IF NOT EXISTS "hire_date" DATE,
ADD COLUMN IF NOT EXISTS "position" VARCHAR(100),
ADD COLUMN IF NOT EXISTS "department" VARCHAR(100),
ADD COLUMN IF NOT EXISTS "employment_type" VARCHAR(20) DEFAULT 'full_time';

-- Add emergency contact relationship                           
ALTER TABLE "public"."users"    
ADD COLUMN IF NOT EXISTS "emergency_contact_name" VARCHAR(100),
ADD COLUMN IF NOT EXISTS "emergency_contact_phone" VARCHAR(20),
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

-- Create unique constraint for employee_id
CREATE UNIQUE INDEX IF NOT EXISTS "users_employee_id_key" ON "public"."users"("employee_id") WHERE "employee_id" IS NOT NULL;

-- Create indexes for commonly queried fields                   
CREATE INDEX IF NOT EXISTS "idx_users_state" ON "public"."users"("state");                      
CREATE INDEX IF NOT EXISTS "idx_users_city" ON "public"."users"("city");                        
CREATE INDEX IF NOT EXISTS "idx_users_postal_code" ON "public"."users"("postal_code");          
CREATE INDEX IF NOT EXISTS "idx_users_employment_type" ON "public"."users"("employment_type");





