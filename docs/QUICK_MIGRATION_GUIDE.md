# Quick Migration Guide - Region Dashboard

## ⚠️ IMPORTANT: Run SQL Files, NOT Markdown Files

**SQL files end with `.sql`** - these are the ones to run in Supabase SQL Editor.

**Markdown files end with `.md`** - these are documentation, NOT SQL!

## Migration Files to Run (in order)

Run these files in your **Supabase SQL Editor** (one at a time):

### 1. Base Tables (if not already applied)
**File:** `backend/prisma/migrations/create_dashboard_regions.sql`
- Creates all base dashboard tables
- Sets up initial RLS policies

### 2. Fix ACL Policies
**File:** `backend/prisma/migrations/fix_dashboard_regions_rls_for_acls.sql`
- Fixes RLS policies to support ACL sharing

### 3. Enhanced Security + Version Column ⚠️ CRITICAL
**File:** `backend/prisma/migrations/enhance_dashboard_regions_rls_security.sql`
- **Adds `version` column** (required for optimistic locking)
- Enhances security policies
- Adds performance indexes

### 4. Event Store (for audit trail)
**File:** `backend/prisma/migrations/create_dashboard_events_table.sql`
- Creates event store table for audit logging

## How to Run in Supabase

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** (left sidebar)
4. For each `.sql` file:
   - Open the file in your code editor
   - Copy **ALL** the contents (Ctrl+A, Ctrl+C)
   - Paste into Supabase SQL Editor
   - Click **Run** or press `Ctrl+Enter`
   - Wait for success message ✅

## Verify Success

After running all migrations, run this in SQL Editor:

```sql
-- Check version column exists
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'dashboard_regions' 
AND column_name = 'version';
-- Should return: version

-- Check events table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'dashboard_events';
-- Should return: dashboard_events
```

## Troubleshooting

**Error: "policy already exists"**
- The migration will now handle this automatically (updated to drop all policy variations)

**Error: "table already exists"**
- Tables use `CREATE TABLE IF NOT EXISTS`, so this is safe to ignore

**Error: "column already exists"**
- The migration checks for this, so it's safe to re-run

## File Locations

All SQL files are in: `backend/prisma/migrations/`

- ✅ `create_dashboard_regions.sql` - SQL file
- ✅ `fix_dashboard_regions_rls_for_acls.sql` - SQL file
- ✅ `enhance_dashboard_regions_rls_security.sql` - SQL file
- ✅ `create_dashboard_events_table.sql` - SQL file
- ❌ `SETUP_INSTRUCTIONS.md` - Documentation (DO NOT RUN)
- ❌ `DATABASE_MIGRATIONS_GUIDE.md` - Documentation (DO NOT RUN)




