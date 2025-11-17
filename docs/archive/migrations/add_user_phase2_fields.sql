-- Migration: Add Phase 2 User Management fields
-- Description: Adds manager_id, avatar_url, and tags fields to users table
-- Date: 2025-01-XX

-- Add manager_id column for user hierarchy
ALTER TABLE "users" 
ADD COLUMN IF NOT EXISTS "manager_id" UUID;

-- Add avatar_url column for profile pictures
ALTER TABLE "users" 
ADD COLUMN IF NOT EXISTS "avatar_url" VARCHAR(500);

-- Add tags column as text array for user tags/skills
ALTER TABLE "users" 
ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add foreign key constraint for manager_id
ALTER TABLE "users"
ADD CONSTRAINT "users_manager_id_fkey" 
FOREIGN KEY ("manager_id") 
REFERENCES "users"("id") 
ON DELETE SET NULL;

-- Add index for manager_id for faster hierarchy queries
CREATE INDEX IF NOT EXISTS "idx_users_manager_id" ON "users"("manager_id");

-- Add index for tags array (for tag-based searches)
CREATE INDEX IF NOT EXISTS "idx_users_tags" ON "users" USING GIN("tags");

-- Note: RLS policies already exist for users table, no changes needed





