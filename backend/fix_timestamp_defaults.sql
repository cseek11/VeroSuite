-- Fix timestamp default values for tables that need them
-- This script adds the missing DEFAULT CURRENT_TIMESTAMP to timestamp columns

-- Fix accounts table timestamps
ALTER TABLE "accounts" 
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "accounts" 
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- Fix other tables that might have the same issue
ALTER TABLE "tenant" 
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "tenant" 
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "users" 
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "users" 
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "locations" 
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "locations" 
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "work_orders" 
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "work_orders" 
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "jobs" 
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "jobs" 
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- Verify the changes for accounts table
SELECT 
    column_name, 
    column_default,
    is_nullable,
    data_type
FROM information_schema.columns 
WHERE table_name = 'accounts' 
AND column_name IN ('created_at', 'updated_at')
ORDER BY column_name;
