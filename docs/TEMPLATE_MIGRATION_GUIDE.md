# Dashboard Templates Migration Guide

**Migration Status:** ✅ **APPLIED** (2025-12-05)

## Overview

This migration adds backend storage for dashboard templates, migrating from localStorage to a database-backed solution with multi-tenant support and sharing capabilities.

**✅ Migration has been successfully applied. Template features are now fully operational.**

## Migration File

**File:** `backend/prisma/migrations/create_dashboard_templates.sql`

## How to Apply Migration

### Option 1: Supabase SQL Editor (Recommended for Windows)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Click **New Query**

3. **Run the Migration**
   - Open the file: `backend/prisma/migrations/create_dashboard_templates.sql`
   - Copy **ALL** the contents (Ctrl+A, Ctrl+C)
   - Paste into the Supabase SQL Editor
   - Click **Run** or press `Ctrl+Enter`
   - Wait for success message ✅

### Option 2: Using Prisma (Alternative)

If you prefer using Prisma migrations:

```powershell
cd backend
npm run db:push
```

**Note:** This requires the table to be defined in `schema.prisma`. For now, use Option 1 (SQL Editor) since this is a manual SQL migration with RLS policies.

## Verify Migration

After running the migration, verify it was successful:

```sql
-- Check table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'dashboard_templates';

-- Should return: dashboard_templates

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'dashboard_templates';

-- Should show: rowsecurity = true

-- Check indexes exist
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'dashboard_templates';

-- Should show multiple indexes including:
-- idx_dashboard_templates_tenant_id
-- idx_dashboard_templates_user_id
-- idx_dashboard_templates_is_public
```

## What This Migration Does

1. **Creates `dashboard_templates` table** with:
   - Template metadata (name, description, thumbnail)
   - Multi-tenant support (`tenant_id`)
   - User ownership (`user_id`)
   - Public/private sharing (`is_public`)
   - System templates flag (`is_system`)
   - Regions data stored as JSONB
   - Soft delete support (`deleted_at`)

2. **Enables Row Level Security (RLS)**
   - Users can view their own templates
   - Users can view public templates from their tenant
   - Users can only modify their own templates

3. **Creates Performance Indexes**
   - Tenant ID lookups
   - User ID lookups
   - Public template queries
   - System template queries
   - Deleted_at filtering

## After Migration

Once the migration is applied:

1. **Restart your backend server** (if running)
2. **The frontend will automatically migrate** existing localStorage templates on next app load
3. **New templates will be saved to the database** instead of localStorage

## Troubleshooting

**Error: "relation already exists"**
- The table already exists, migration was already applied
- You can skip this migration

**Error: "permission denied"**
- Make sure you're using a database user with CREATE TABLE permissions
- In Supabase, this should work automatically

**Error: "policy already exists"**
- The RLS policies already exist
- This is safe to ignore - the migration uses `CREATE POLICY IF NOT EXISTS` where possible

## Rollback (if needed)

If you need to rollback this migration:

```sql
-- Drop RLS policies
DROP POLICY IF EXISTS "Users can view own and public tenant templates" ON dashboard_templates;
DROP POLICY IF EXISTS "Users can insert own templates" ON dashboard_templates;
DROP POLICY IF EXISTS "Users can update own templates" ON dashboard_templates;
DROP POLICY IF EXISTS "Users can delete own templates" ON dashboard_templates;

-- Drop table (WARNING: This will delete all template data!)
DROP TABLE IF EXISTS dashboard_templates;
```

**⚠️ WARNING:** Rolling back will delete all template data. Make sure to backup first if needed.

