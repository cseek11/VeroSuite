# Database Migrations Guide for Region Dashboard

## Overview

The Region Dashboard Enterprise improvements require several database migrations to be applied. These migrations add:
- Event sourcing table for audit trails
- Enhanced RLS (Row-Level Security) policies
- Version column for optimistic locking
- Performance indexes

## Required Migrations

The following migration files need to be applied in order:

1. **`create_dashboard_regions.sql`** - Base dashboard tables (if not already applied)
2. **`fix_dashboard_regions_rls_for_acls.sql`** - Fix RLS policies for ACL support
3. **`enhance_dashboard_regions_rls_security.sql`** - Enhanced security policies + version column
4. **`create_dashboard_events_table.sql`** - Event store for audit trail

## How to Apply Migrations

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. For each migration file, in order:
   - Open the file: `backend/prisma/migrations/[filename].sql`
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click **Run** or press `Ctrl+Enter`
   - Verify success message

### Option 2: Using psql (Command Line)

```bash
cd backend

# Set your database connection string
export DATABASE_URL="postgresql://user:password@host:port/database"

# Apply migrations in order
psql $DATABASE_URL -f prisma/migrations/create_dashboard_regions.sql
psql $DATABASE_URL -f prisma/migrations/fix_dashboard_regions_rls_for_acls.sql
psql $DATABASE_URL -f prisma/migrations/enhance_dashboard_regions_rls_security.sql
psql $DATABASE_URL -f prisma/migrations/create_dashboard_events_table.sql
```

### Option 3: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

## Migration Order

**IMPORTANT:** Apply migrations in this exact order:

1. **First:** `create_dashboard_regions.sql` (if tables don't exist)
2. **Second:** `fix_dashboard_regions_rls_for_acls.sql` (fixes ACL policies)
3. **Third:** `enhance_dashboard_regions_rls_security.sql` (adds version column + enhanced policies)
4. **Fourth:** `create_dashboard_events_table.sql` (event store)

## Verify Migrations

After applying all migrations, verify they were successful:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'dashboard_%'
ORDER BY table_name;

-- Should show:
-- dashboard_events
-- dashboard_layout_audit
-- dashboard_layout_versions
-- dashboard_migration_logs
-- dashboard_region_acls
-- dashboard_region_presence
-- dashboard_regions
-- dashboard_widget_registry

-- Check version column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'dashboard_regions' 
AND column_name = 'version';

-- Should show: version | integer

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'dashboard_%';

-- Should show rowsecurity = true for all dashboard tables
```

## What Each Migration Does

### 1. create_dashboard_regions.sql
- Creates base dashboard tables (regions, layouts, versions, ACLs, etc.)
- Sets up basic RLS policies
- Creates initial indexes

### 2. fix_dashboard_regions_rls_for_acls.sql
- Fixes RLS policies to allow viewing regions shared via ACLs
- Ensures proper tenant isolation

### 3. enhance_dashboard_regions_rls_security.sql
- **Adds `version` column** for optimistic locking (CRITICAL)
- Enhances RLS policies with comprehensive security checks
- Adds performance indexes
- Prevents tenant_id/user_id tampering

### 4. create_dashboard_events_table.sql
- Creates event store table for audit trail
- Sets up indexes for efficient querying
- Enables RLS for event store

## Troubleshooting

### Error: "relation already exists"
- The table already exists, skip that migration
- Check if you need to update existing tables instead

### Error: "column already exists"
- The column already exists, the migration will skip it (uses `IF NOT EXISTS`)
- This is safe to ignore

### Error: "policy already exists"
- Drop the existing policy first, or modify the migration to use `CREATE OR REPLACE POLICY`

### Error: "permission denied"
- Ensure you're using a database user with sufficient privileges
- For Supabase, use the service role key for migrations

## After Migration

Once all migrations are applied:

1. **Restart your backend server** to pick up schema changes
2. **Test region creation** - should work without validation errors
3. **Verify optimistic locking** - check that `version` column is being used
4. **Check event logging** - verify events are being written to `dashboard_events`

## Rollback (If Needed)

If you need to rollback:

```sql
-- Remove version column (if needed)
ALTER TABLE dashboard_regions DROP COLUMN IF EXISTS version;

-- Drop event table (if needed)
DROP TABLE IF EXISTS dashboard_events CASCADE;

-- Revert RLS policies (restore from backup or recreate original policies)
```

**Note:** Always backup your database before applying migrations in production!

## Support

If you encounter issues:
1. Check the migration SQL files for syntax errors
2. Verify your database connection
3. Check Supabase logs for detailed error messages
4. Ensure you have the correct permissions




