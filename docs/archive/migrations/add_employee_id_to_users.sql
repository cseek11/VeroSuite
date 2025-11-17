-- Migration: Add employee_id to users table
-- Date: 2025-01-08
-- Description: Adds employee_id field to users table for role-based employee ID generation

-- Add employee_id column to users table
ALTER TABLE "public"."users" 
ADD COLUMN IF NOT EXISTS "employee_id" VARCHAR(20);

-- Create unique index on employee_id
CREATE UNIQUE INDEX IF NOT EXISTS "users_employee_id_key" ON "public"."users"("employee_id");

-- Add comment to column
COMMENT ON COLUMN "public"."users"."employee_id" IS 'Auto-generated employee ID with role-based prefix (TECH-YYYY-NNNN, ADMIN-YYYY-NNNN, DISP-YYYY-NNNN, EMP-YYYY-NNNN)';





