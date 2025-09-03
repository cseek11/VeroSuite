-- Fix UUID default values for tables that need them
-- This script adds the missing DEFAULT gen_random_uuid() to id columns

-- Fix accounts table
ALTER TABLE "accounts" 
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- Fix other tables that might have the same issue
ALTER TABLE "tenant" 
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

ALTER TABLE "users" 
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

ALTER TABLE "locations" 
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

ALTER TABLE "work_orders" 
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

ALTER TABLE "jobs" 
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- Verify the changes
SELECT 
    table_name, 
    column_name, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('accounts', 'tenant', 'users', 'locations', 'work_orders', 'jobs')
AND column_name = 'id'
ORDER BY table_name;
