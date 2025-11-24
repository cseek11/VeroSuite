# Phase 1: Foundation & Database Setup - Setup Guide

**Created:** 2025-11-24  
**Last Updated:** 2025-11-24  
**Phase:** 1 - Foundation & Database Setup  
**Status:** In Progress

---

## 📋 Overview

This guide walks through setting up the foundation for VeroScore V3, including:
- Supabase project configuration
- Database schema deployment
- Environment variables setup
- Configuration files
- Verification and testing

---

## ✅ Prerequisites

Before starting, ensure you have:

1. **Supabase Account** - Access to Supabase dashboard
2. **GitHub Access** - Repository access with appropriate permissions
3. **Python 3.12+** - For running scripts
4. **PostgreSQL Client** - For database operations (optional, can use Supabase dashboard)

---

## 🔧 Step 1: Supabase Project Setup

### Option A: Use Existing Supabase Project

If you already have a Supabase project:

1. **Get Connection Details:**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Navigate to **Settings → API**
   - Copy:
     - `SUPABASE_URL` (Project URL)
     - `SUPABASE_SECRET_KEY` (Service Role Key - starts with `sb_secret_` or `eyJ...`)
     - `SUPABASE_PUBLISHABLE_KEY` (Anon Key - starts with `sb_publishable_` or `eyJ...`)

2. **Get Database Connection:**
   - Navigate to **Settings → Database**
   - Copy the connection string (or individual components)

### Option B: Use Same Database as OPA Compliance ✅ **RECOMMENDED**

**VeroScore V3 uses the same Supabase database as OPA Compliance, with a separate `veroscore` schema.**

1. **Use Existing Database:**
   - VeroScore V3 will use the same `DATABASE_URL` as your main application
   - The migration creates a `veroscore` schema (similar to `compliance` schema)
   - No need for a separate Supabase project

2. **Get Connection Details:**
   - Use the same `DATABASE_URL` from your existing `.env` file
   - Use the same `SUPABASE_URL` and `SUPABASE_SECRET_KEY`
   - No additional configuration needed

---

## 🗄️ Step 2: Deploy Database Schema

### Method 1: Using Supabase Dashboard (Recommended)

1. **Open SQL Editor:**
   - In Supabase Dashboard, go to **SQL Editor**
   - Click **New Query**

2. **Run Migration:**
   - Open the migration file: `libs/common/prisma/migrations/20251124160359_veroscore_v3_schema/migration.sql`
   - Copy entire contents
   - Paste into SQL Editor
   - Click **Run** (or press `Ctrl+Enter`)

3. **Verify Success:**
   - Check for errors in output
   - All tables should be created successfully
   - Check **Table Editor** to see new tables (prefixed with `veroscore_`)

### Method 2: Using psql Command Line

```bash
# Set environment variables
export SUPABASE_URL="https://your-project.supabase.co"
export DATABASE_URL="postgresql://postgres:password@db.your-project.supabase.co:5432/postgres"

# Run migration
psql $DATABASE_URL -f libs/common/prisma/migrations/20251124160359_veroscore_v3_schema/migration.sql
```

### Method 3: Using Prisma Migrate (If Using Prisma)

```bash
# Navigate to project root
cd /path/to/VeroField

# Run migration
npx prisma migrate deploy
```

---

## 🔐 Step 3: Configure Environment Variables

### For Local Development

1. **Create/Update `.env` file:**
   ```bash
   # In project root or apps/api/
   cp apps/api/env.example apps/api/.env
   ```

2. **Add VeroScore V3 Variables:**
   ```bash
   # Supabase Configuration (already in .env)
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SECRET_KEY=sb_secret_...  # Service role key
   SUPABASE_PUBLISHABLE_KEY=sb_publishable_...  # Anon key
   
   # Database Connection
   DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
   
   # GitHub Integration (for PR creation)
   GITHUB_TOKEN=ghp_...  # Personal Access Token
   AUTO_PR_PAT=ghp_...  # Fine-grained PAT for Auto-PR
   ```

3. **For GitHub Actions:**
   - Go to **Repository Settings → Secrets and variables → Actions**
   - Add the following secrets:
     - `SUPABASE_URL`
     - `SUPABASE_SECRET_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY` (same as SUPABASE_SECRET_KEY)
     - `AUTO_PR_PAT` (GitHub fine-grained PAT)
     - `DATABASE_URL` (if needed for direct DB access)

### Environment Variable Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SUPABASE_URL` | ✅ Yes | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_SECRET_KEY` | ✅ Yes | Service role key (backend only) | `sb_secret_...` |
| `SUPABASE_PUBLISHABLE_KEY` | ⚠️ Optional | Anon key (for client access) | `sb_publishable_...` |
| `DATABASE_URL` | ⚠️ Optional | Direct PostgreSQL connection | `postgresql://...` |
| `GITHUB_TOKEN` | ✅ Yes | GitHub PAT for PR creation | `ghp_...` |
| `AUTO_PR_PAT` | ✅ Yes | Fine-grained PAT for Auto-PR | `ghp_...` |

---

## ⚙️ Step 4: Configure RLS Policies

The migration includes basic RLS policies, but you may need to customize:

1. **Review Policies:**
   - Check policies in migration file
   - Adjust based on your security requirements

2. **Test Access:**
   - Verify service role can access all tables
   - Verify users can only see their own sessions
   - Test from application code

---

## ✅ Step 5: Verify Setup

### 5.1 Database Verification

Run these queries in Supabase SQL Editor:

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'veroscore_%'
ORDER BY table_name;

-- Check indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename LIKE 'veroscore_%'
ORDER BY tablename, indexname;

-- Check views
SELECT viewname 
FROM pg_views 
WHERE viewname LIKE 'v_veroscore_%'
ORDER BY viewname;

-- Check functions
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name LIKE 'veroscore_%'
ORDER BY routine_name;
```

**Expected Output:**
- 7 tables: `sessions`, `changes_queue`, `pr_scores`, `detection_results`, `idempotency_keys`, `system_metrics`, `audit_log`
- Multiple indexes on each table
- 4 views: `v_active_sessions`, `v_pr_score_summary`, `v_system_health`, `v_dashboard_summary`
- Multiple helper functions

### 5.2 Test Data Insertion

```sql
-- Insert test session
INSERT INTO veroscore_sessions (session_id, author, branch_name, status)
VALUES ('test-setup-20251124', 'test-user', 'auto-pr-test-setup-20251124', 'active')
RETURNING *;

-- Insert test change
INSERT INTO veroscore_changes_queue (session_id, file_path, change_type, lines_added, lines_removed)
VALUES ('test-setup-20251124', 'test/file.ts', 'added', 10, 0)
RETURNING *;

-- Query active sessions view
SELECT * FROM v_veroscore_active_sessions;

-- Cleanup test data
DELETE FROM veroscore_changes_queue WHERE session_id = 'test-setup-20251124';
DELETE FROM veroscore_sessions WHERE session_id = 'test-setup-20251124';
```

### 5.3 Configuration Verification

```bash
# Check configuration file exists
ls -la .cursor/config/auto_pr_config.yaml

# Validate YAML syntax (if yq installed)
yq eval . .cursor/config/auto_pr_config.yaml

# Or use Python
python -c "import yaml; yaml.safe_load(open('.cursor/config/auto_pr_config.yaml'))"
```

---

## 🧪 Step 6: Test Database Connectivity

### Python Test Script

Create a test script to verify connectivity:

```python
# test_supabase_connection.py
import os
from supabase import create_client, Client

# Load environment variables
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SECRET_KEY")

if not supabase_url or not supabase_key:
    print("❌ Missing SUPABASE_URL or SUPABASE_SECRET_KEY")
    exit(1)

# Create client
supabase: Client = create_client(supabase_url, supabase_key)

# Test query
try:
    result = supabase.table("veroscore_sessions").select("count").execute()
    print("✅ Database connection successful!")
    print(f"✅ Tables accessible")
except Exception as e:
    print(f"❌ Database connection failed: {e}")
    exit(1)
```

Run test:
```bash
python test_supabase_connection.py
```

---

## 📝 Step 7: Document Configuration

1. **Update `.env.example`:**
   - Add VeroScore V3 variables (without actual values)

2. **Update Documentation:**
   - Document Supabase project details
   - Document any custom RLS policies
   - Document environment variable setup

---

## 🚨 Troubleshooting

### Issue: Migration Fails with "Extension Not Found"

**Solution:**
```sql
-- Enable extensions manually
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";
```

### Issue: RLS Policies Blocking Access

**Solution:**
- Check service role key is being used
- Verify policies allow service role access
- Test with: `SET ROLE service_role;`

### Issue: Tables Not Created

**Solution:**
- Check SQL Editor for errors
- Verify you're running migration in correct database
- Check for existing tables with same names

### Issue: Environment Variables Not Loading

**Solution:**
- Verify `.env` file location (should be in `apps/api/` or project root)
- Check variable names match exactly
- Restart application/server after changes

---

## ✅ Phase 1 Completion Checklist

- [ ] Supabase project created or configured
- [ ] Database schema deployed successfully
- [ ] All tables created (7 tables)
- [ ] All views created (4 views)
- [ ] All functions created
- [ ] RLS policies configured
- [ ] Environment variables set
- [ ] Configuration files created
- [ ] Database connectivity tested
- [ ] Test data insertion verified
- [ ] Documentation updated

---

## 📚 Next Steps

After completing Phase 1:

1. **Review Phase 1 Deliverables:**
   - Database schema deployed
   - Configuration files created
   - Environment setup documented

2. **Get Approval:**
   - Create PR with Phase 1 completion summary
   - Request stakeholder review
   - Get explicit approval before Phase 2

3. **Begin Phase 2:**
   - File Watcher Implementation
   - See `V3_IMPLEMENTATION_PLAN.md` for details

---

**Last Updated:** 2025-11-24  
**Related Documents:**
- `V3_IMPLEMENTATION_PLAN.md` - Full implementation plan
- `V3_QUESTIONS.md` - Implementation questions and answers

