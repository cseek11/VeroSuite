# DATABASE_URL Configuration Guide

**Date:** 2025-12-05  
**Purpose:** Step-by-step guide for configuring DATABASE_URL for Phase 3 migrations

---

## What is DATABASE_URL?

`DATABASE_URL` is a PostgreSQL connection string that tells Prisma (and your application) how to connect to your database. It contains all the information needed: host, port, database name, username, and password.

---

## DATABASE_URL Format

### Standard Format

```
postgresql://[username]:[password]@[host]:[port]/[database]?[parameters]
```

### Example (Supabase)

```
postgresql://postgres:your_password@db.your-project-ref.supabase.co:5432/postgres?connect_timeout=30
```

### Example (Local PostgreSQL)

```
postgresql://postgres:password@localhost:5432/verofield
```

---

## Where to Get DATABASE_URL

### Option 1: Supabase (Recommended - Already Configured)

If you're using Supabase (which appears to be the case), get it from:

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Select your project

2. **Navigate to Database Settings:**
   - Click **Settings** (gear icon) in left sidebar
   - Click **Database** in settings menu

3. **Get Connection String:**
   - Scroll to **Connection string** section
   - Select **URI** tab
   - Copy the connection string
   - Format: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

4. **Or Get Direct Connection:**
   - Use **Connection pooling** → **Direct connection**
   - Format: `postgresql://postgres:password@db.[ref].supabase.co:5432/postgres`

**⚠️ Important:** Use the **Direct connection** for migrations (port 5432), not the pooler (port 6543).

### Option 2: Local PostgreSQL

If running PostgreSQL locally:

1. **Install PostgreSQL** (if not already installed)
2. **Create database:**
   ```sql
   CREATE DATABASE verofield;
   ```
3. **Format:**
   ```
   postgresql://postgres:your_local_password@localhost:5432/verofield
   ```

---

## Current Configuration

Based on your existing `.env` file, you already have:

```env
DATABASE_URL=postgresql://postgres:hhUH1lFpOGSkxPZL@db.iehzwglvmbtrlhdgofew.supabase.co:5432/postgres?connect_timeout=30
```

**This should work!** ✅

---

## How to Set DATABASE_URL

### Method 1: Environment File (Recommended)

**Location:** `apps/api/.env`

1. **Open or create the file:**
   ```bash
   # Windows
   notepad apps/api/.env
   
   # Or use your editor
   code apps/api/.env
   ```

2. **Add or update DATABASE_URL:**
   ```env
   DATABASE_URL=postgresql://postgres:your_password@db.your-project.supabase.co:5432/postgres?connect_timeout=30
   ```

3. **Save the file**

**Note:** The `.env` file is in `.gitignore` and won't be committed to git.

### Method 2: Environment Variable (Temporary)

**Windows PowerShell:**
```powershell
$env:DATABASE_URL="postgresql://postgres:password@db.project.supabase.co:5432/postgres"
```

**Windows Command Prompt:**
```cmd
set DATABASE_URL=postgresql://postgres:password@db.project.supabase.co:5432/postgres
```

**Linux/Mac:**
```bash
export DATABASE_URL="postgresql://postgres:password@db.project.supabase.co:5432/postgres"
```

**Note:** This only lasts for the current terminal session.

### Method 3: System Environment Variable (Persistent)

**Windows:**
1. Open **System Properties** → **Environment Variables**
2. Add new variable:
   - Name: `DATABASE_URL`
   - Value: `postgresql://postgres:password@db.project.supabase.co:5432/postgres`
3. Restart terminal/IDE

**Linux/Mac:**
Add to `~/.bashrc` or `~/.zshrc`:
```bash
export DATABASE_URL="postgresql://postgres:password@db.project.supabase.co:5432/postgres"
```

Then reload:
```bash
source ~/.bashrc  # or source ~/.zshrc
```

---

## Verify DATABASE_URL is Set

### Check if Variable is Set

**Windows PowerShell:**
```powershell
$env:DATABASE_URL
```

**Windows Command Prompt:**
```cmd
echo %DATABASE_URL%
```

**Linux/Mac:**
```bash
echo $DATABASE_URL
```

**Expected Output:**
```
postgresql://postgres:password@db.project.supabase.co:5432/postgres
```

### Test Database Connection

**Using psql:**
```bash
# Windows (if psql is installed)
psql $env:DATABASE_URL -c "SELECT version();"

# Linux/Mac
psql $DATABASE_URL -c "SELECT version();"
```

**Using Prisma:**
```bash
cd libs/common/prisma
npx prisma db pull
```

If connection works, you'll see:
```
✔ Introspected database
```

---

## Connection String Components

### Breaking Down the URL

```
postgresql://postgres:password@db.project.supabase.co:5432/postgres?connect_timeout=30
│          │         │         │                        │    │         │              │
│          │         │         │                        │    │         │              └─ Query parameters
│          │         │         │                        │    │         └─ Database name
│          │         │         │                        │    └─ Port (5432 = PostgreSQL default)
│          │         │         │                        └─ Hostname
│          │         │         └─ Password
│          │         └─ Username
│          └─ Protocol
└─ Scheme
```

### Common Parameters

- `connect_timeout=30` - Connection timeout in seconds
- `connection_limit=10` - Max connections in pool
- `pool_timeout=60` - Pool timeout
- `sslmode=require` - Require SSL (Supabase uses this)

**Example with parameters:**
```
postgresql://postgres:password@db.project.supabase.co:5432/postgres?connect_timeout=30&sslmode=require
```

---

## Troubleshooting

### Error: "Environment variable not found: DATABASE_URL"

**Solution:**
1. Verify `.env` file exists in `apps/api/` directory
2. Check file name is exactly `.env` (not `.env.txt` or `.env.local`)
3. Verify `DATABASE_URL` line is not commented out (no `#` at start)
4. Restart terminal/IDE after creating `.env` file

### Error: "Connection refused" or "Connection timeout"

**Possible Causes:**
1. **Wrong host/port:**
   - Verify hostname is correct
   - Verify port is 5432 (not 6543 for pooler)
   - Check if using Direct connection (not Pooler) for migrations

2. **Wrong password:**
   - Verify password in connection string matches Supabase database password
   - Check for special characters that need URL encoding

3. **Network/Firewall:**
   - Check if your IP is allowed in Supabase (Settings → Database → Connection Pooling)
   - Verify firewall isn't blocking port 5432

4. **Database doesn't exist:**
   - Verify database name is `postgres` (Supabase default)
   - Or create database if using local PostgreSQL

**Solution:**
```bash
# Test connection manually
psql "postgresql://postgres:password@db.project.supabase.co:5432/postgres" -c "SELECT 1;"
```

### Error: "Password authentication failed"

**Solution:**
1. Reset database password in Supabase:
   - Settings → Database → Database password
   - Click "Reset database password"
   - Update `DATABASE_URL` with new password

2. **URL encode special characters:**
   - If password contains special characters, URL encode them:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
   - `%` → `%25`

### Error: "Permission denied for schema compliance"

**Solution:**
1. **Grant schema creation permission:**
   ```sql
   -- Connect as superuser or database owner
   GRANT CREATE ON DATABASE your_database TO postgres;
   ```

2. **Or create schema manually:**
   ```sql
   CREATE SCHEMA IF NOT EXISTS compliance;
   GRANT ALL ON SCHEMA compliance TO postgres;
   ```

---

## Security Best Practices

### ✅ DO:
- Store `DATABASE_URL` in `.env` file (in `.gitignore`)
- Use different passwords for dev/staging/production
- Rotate passwords regularly
- Use connection pooling for production (port 6543)
- Use direct connection for migrations (port 5432)

### ❌ DON'T:
- Commit `.env` files to git
- Share `DATABASE_URL` in chat/email
- Use production database for development
- Hardcode `DATABASE_URL` in source code
- Use pooler connection (port 6543) for migrations

---

## Quick Setup Checklist

- [ ] Locate your Supabase project dashboard
- [ ] Go to Settings → Database
- [ ] Copy Connection String (Direct connection, port 5432)
- [ ] Create/update `apps/api/.env` file
- [ ] Add `DATABASE_URL=postgresql://...` line
- [ ] Verify variable is set: `echo $DATABASE_URL` (or `$env:DATABASE_URL` on Windows)
- [ ] Test connection: `npx prisma db pull` (in `libs/common/prisma`)
- [ ] Run migration: `npx prisma migrate dev --name add_compliance_schema`

---

## Example .env File

```env
# Database Connection
DATABASE_URL=postgresql://postgres:your_password@db.your-project.supabase.co:5432/postgres?connect_timeout=30

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=sb_secret_your_key_here

# JWT
JWT_SECRET=your_jwt_secret_here

# Optional
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

---

## Next Steps

Once `DATABASE_URL` is configured:

1. ✅ **Run migration:**
   ```bash
   cd libs/common/prisma
   npx prisma migrate dev --name add_compliance_schema
   ```

2. ✅ **Seed rules:**
   ```bash
   npx ts-node seed-compliance-rules.ts
   ```

3. ✅ **Start API:**
   ```bash
   cd apps/api
   npm run start:dev
   ```

---

**Last Updated:** 2025-12-05  
**Status:** Ready for Configuration



