-- Fix the users table UUID default value
-- First, let's see what's happening with the users table
SELECT 
    table_name, 
    column_name, 
    column_default,
    is_nullable,
    data_type
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'id';

-- Fix the users table id column
ALTER TABLE "users" 
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- Verify the fix
SELECT 
    table_name, 
    column_name, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'id';
