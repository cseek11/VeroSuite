# Phase 3 Setup Guide: Compliance Dashboard

**Date:** 2025-12-05  
**Status:** Implementation Ready  
**Phase:** 3 - Dashboard & Operations

---

## Prerequisites

Before starting Phase 3 implementation, ensure you have:

1. ✅ **Database Access**
   - PostgreSQL database with connection string
   - `DATABASE_URL` environment variable configured
   - Database user with CREATE SCHEMA permissions

2. ✅ **Environment Variables**
   - `DATABASE_URL` - PostgreSQL connection string
   - `SUPABASE_URL` - Supabase project URL
   - `SUPABASE_SECRET_KEY` - Supabase secret key
   - `JWT_SECRET` - JWT signing secret

3. ✅ **Node.js & Dependencies**
   - Node.js 18+ installed
   - All npm dependencies installed (`npm install`)

---

## Step 1: Run Database Migration

### Prerequisites Check

Verify `DATABASE_URL` is set:
```bash
# Windows PowerShell
$env:DATABASE_URL

# Linux/Mac
echo $DATABASE_URL
```

If not set, create `.env` file in `apps/api/`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/verofield
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=sb_secret_your_key_here
JWT_SECRET=your_jwt_secret_here
```

### Run Migration

```bash
cd libs/common/prisma
npx prisma migrate dev --name add_compliance_schema
```

**Expected Output:**
```
✔ Generated Prisma Client
✔ Applied migration `20251124120000_add_compliance_schema`
```

**What This Does:**
- Creates `compliance` schema in PostgreSQL
- Creates 6 tables: `rule_definitions`, `compliance_checks`, `compliance_trends`, `override_requests`, `alert_history`, `audit_log`
- Adds indexes for performance
- Enables Row Level Security (RLS) on all tenant-scoped tables
- Creates RLS policies for tenant isolation

**Verification:**
```bash
# Connect to database and verify schema
psql $DATABASE_URL -c "\dn compliance"
psql $DATABASE_URL -c "\dt compliance.*"
```

---

## Step 2: Seed Rule Definitions

### Run Seed Script

```bash
cd libs/common/prisma
npx ts-node seed-compliance-rules.ts
```

**Expected Output:**
```
Seeding compliance rule definitions...
✓ Seeded rule R01: Tenant Isolation
✓ Seeded rule R02: RLS Enforcement
✓ Seeded rule R03: Architecture Boundaries
...
✓ Seeded rule R25: CI/CD Workflow Triggers

✅ Successfully seeded 25 compliance rules
```

**What This Does:**
- Populates `compliance.rule_definitions` table with all 25 rules (R01-R25)
- Includes rule metadata: name, description, tier, category, file_path, opa_policy

**Verification:**
```bash
# Verify rules were seeded
psql $DATABASE_URL -c "SELECT id, name, tier FROM compliance.rule_definitions ORDER BY id;"
```

**Expected:** 25 rows (R01 through R25)

---

## Step 3: Generate Prisma Client

### Generate Client

```bash
cd libs/common/prisma
npx prisma generate
```

**Expected Output:**
```
✔ Generated Prisma Client (v5.22.0) to .\..\..\node_modules\@prisma\client
```

**What This Does:**
- Generates TypeScript types for all Prisma models
- Includes new compliance models: `RuleDefinition`, `ComplianceCheck`, `ComplianceTrend`, `OverrideRequest`, `AlertHistory`, `ComplianceAuditLog`
- Makes models available in `@prisma/client`

**Verification:**
```typescript
// In any TypeScript file
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Should have autocomplete for:
prisma.ruleDefinition.findMany()
prisma.complianceCheck.create()
// etc.
```

---

## Step 4: Start API Server

### Start Development Server

```bash
cd apps/api
npm run start:dev
```

**Expected Output:**
```
[Nest] INFO [Bootstrap] Environment validation passed
[Nest] INFO [Bootstrap] Backend server started successfully
Application is running on: http://localhost:3001
Swagger documentation available at: http://localhost:3001/api/docs
```

**What This Does:**
- Starts NestJS development server
- Loads all modules including `ComplianceModule`
- Exposes API endpoints at `/api/v1/compliance/*`
- Swagger documentation at `/api/docs`

**Verification:**
- Open browser: http://localhost:3001/api/docs
- Look for "Compliance" tag in Swagger UI
- Should see 6 compliance endpoints

---

## Step 5: Test API Endpoints

### 5.1 Get Authentication Token

First, authenticate to get JWT token:

```bash
# Login endpoint (adjust URL/credentials as needed)
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "tenantId": "7193113e-ece2-4f7b-ae8c-176df4367e28"
  }
}
```

Save the `access_token` for subsequent requests.

### 5.2 Test Rule Definitions Endpoint

```bash
# Set token variable
$TOKEN="your_access_token_here"

# Get all rules
curl -X GET http://localhost:3001/api/v1/compliance/rules \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": "R01",
      "name": "Tenant Isolation",
      "description": "All database queries must include tenant_id filter",
      "tier": "BLOCK",
      "category": "Security",
      "file_path": ".cursor/rules/03-security.mdc",
      "opa_policy": "security.rego",
      "created_at": "2025-12-05T...",
      "updated_at": "2025-12-05T..."
    },
    ...
  ],
  "total": 25
}
```

### 5.3 Test Compliance Checks Endpoint

```bash
# Get compliance checks
curl -X GET http://localhost:3001/api/v1/compliance/checks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "data": [],
  "total": 0,
  "page": 1,
  "limit": 100
}
```

(Empty initially, until CI/CD creates checks)

### 5.4 Test Create Compliance Check

```bash
# Create a test compliance check
curl -X POST http://localhost:3001/api/v1/compliance/checks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pr_number": 123,
    "commit_sha": "abc123def456",
    "rule_id": "R01",
    "status": "VIOLATION",
    "severity": "BLOCK",
    "file_path": "apps/api/src/test.ts",
    "line_number": 42,
    "violation_message": "Missing tenant_id filter in database query",
    "context": {
      "opa_output": "...",
      "file_diff": "..."
    }
  }'
```

**Expected Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "tenant_id": "7193113e-ece2-4f7b-ae8c-176df4367e28",
  "pr_number": 123,
  "commit_sha": "abc123def456",
  "rule_id": "R01",
  "status": "VIOLATION",
  "severity": "BLOCK",
  ...
}
```

### 5.5 Test Compliance Score Calculation

```bash
# Get compliance score for PR
curl -X GET http://localhost:3001/api/v1/compliance/pr/123/score \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "score": 90,
  "block_count": 0,
  "override_count": 0,
  "warning_count": 10,
  "weighted_violations": 10,
  "can_merge": true,
  "pr_number": 123
}
```

### 5.6 Test Tenant Isolation

**Test 1: Verify tenant isolation in database**

```sql
-- Connect to database
psql $DATABASE_URL

-- Set tenant context
SET LOCAL app.tenant_id = 'tenant-1-id';

-- Try to query compliance checks
SELECT * FROM compliance.compliance_checks;

-- Should only return checks for tenant-1-id

-- Try to access another tenant's data (should return empty)
SET LOCAL app.tenant_id = 'tenant-2-id';
SELECT * FROM compliance.compliance_checks;
-- Should return empty (RLS blocks cross-tenant access)
```

**Test 2: Verify API tenant isolation**

```bash
# Create check as Tenant A
curl -X POST http://localhost:3001/api/v1/compliance/checks \
  -H "Authorization: Bearer $TOKEN_TENANT_A" \
  -H "Content-Type: application/json" \
  -d '{...}'

# Query as Tenant B (should not see Tenant A's checks)
curl -X GET http://localhost:3001/api/v1/compliance/checks \
  -H "Authorization: Bearer $TOKEN_TENANT_B" \
  -H "Content-Type: application/json"

# Should return empty array (tenant isolation working)
```

---

## Troubleshooting

### Migration Fails: "Environment variable not found: DATABASE_URL"

**Solution:**
1. Create `.env` file in `apps/api/` directory
2. Add `DATABASE_URL=postgresql://...`
3. Re-run migration

### Migration Fails: "Permission denied for schema compliance"

**Solution:**
1. Grant schema creation permission:
   ```sql
   GRANT CREATE ON DATABASE your_database TO your_user;
   ```
2. Or create schema manually:
   ```sql
   CREATE SCHEMA IF NOT EXISTS compliance;
   ```

### Seed Script Fails: "Rule R01 already exists"

**Solution:**
- This is expected if rules were already seeded
- The script uses `upsert`, so it's safe to run multiple times
- It will update existing rules if metadata changed

### API Server Fails: "Cannot find module '@prisma/client'"

**Solution:**
1. Regenerate Prisma client:
   ```bash
   cd libs/common/prisma
   npx prisma generate
   ```
2. Restart API server

### API Endpoint Returns 401 Unauthorized

**Solution:**
1. Verify JWT token is valid and not expired
2. Check token format: `Bearer <token>`
3. Verify `JWT_SECRET` matches the secret used to sign the token

### API Endpoint Returns Empty Results

**Solution:**
1. Verify tenant isolation is working (check `tenant_id` in JWT)
2. Verify data exists in database for that tenant
3. Check RLS policies are enabled:
   ```sql
   SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'compliance';
   ```

---

## Next Steps

After completing setup and testing:

1. ✅ **Week 11, Days 4-5:** Create frontend dashboard
   - Create `frontend/src/routes/compliance/` directory
   - Add compliance routes to router
   - Create dashboard components

2. ✅ **Week 11, Days 6-7:** Implement async write queue
   - Set up Redis (if not already available)
   - Implement BullMQ queue for compliance updates
   - Integrate OPA evaluation results

3. ✅ **Week 12:** Monitoring & Alerts
   - Set up monitoring infrastructure
   - Configure alert system (Slack, Email)
   - Implement alert deduplication and escalation

---

**Last Updated:** 2025-12-05  
**Status:** Ready for Testing



