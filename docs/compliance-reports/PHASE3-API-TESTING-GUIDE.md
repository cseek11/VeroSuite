# Phase 3 API Testing Guide

**Date:** 2025-12-05  
**Status:** ✅ Compliance API Module Ready for Testing

---

## Quick Start

### 1. Start the API Server

```powershell
cd apps/api
npm run start:dev
```

The server will start on `http://localhost:3001`

### 2. Access Swagger UI

Open in browser: **http://localhost:3001/api/docs**

### 3. Authenticate

1. Click the **"Authorize"** button (top right)
2. Enter your credentials:
   - Email: Your test user email
   - Password: Your test user password
3. Click **"Authorize"**
4. Click **"Close"**

### 4. Test Compliance Endpoints

Navigate to the **"Compliance"** section in Swagger UI and test:

#### Available Endpoints

1. **GET `/api/v1/compliance/rules`**
   - Get all rule definitions (R01-R25)
   - Should return 25 rules

2. **GET `/api/v1/compliance/checks`**
   - Get all compliance checks for your tenant
   - Supports query parameters: `pr_number`, `rule_id`, `status`

3. **POST `/api/v1/compliance/checks`**
   - Create a new compliance check
   - Body example:
   ```json
   {
     "pr_number": 1234,
     "commit_sha": "abc123def456",
     "rule_id": "R01",
     "status": "VIOLATION",
     "severity": "WARNING",
     "file_path": "apps/api/src/test.ts",
     "line_number": 42,
     "violation_message": "Test violation"
   }
   ```

4. **GET `/api/v1/compliance/pr/{pr_number}/score`**
   - Get compliance score for a specific PR
   - Returns: score, violation counts, can_merge flag

5. **GET `/api/v1/compliance/trends`**
   - Get compliance trends over time
   - Supports date range filters

6. **GET `/api/v1/compliance/dashboard`**
   - Get dashboard summary data
   - Returns: overall score, recent violations, trends

---

## Manual Testing with PowerShell

### Test Rules Endpoint

```powershell
# First, get a token (replace with your credentials)
$authBody = @{
    email = "your-email@example.com"
    password = "your-password"
} | ConvertTo-Json

$authResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $authBody

$token = $authResponse.access_token

# Test rules endpoint
$headers = @{
    "Authorization" = "Bearer $token"
}

$rules = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/compliance/rules" `
    -Method Get `
    -Headers $headers

Write-Host "Total rules: $($rules.total)"
```

### Test Create Check

```powershell
$checkBody = @{
    pr_number = 1234
    commit_sha = "test-commit-123"
    rule_id = "R01"
    status = "VIOLATION"
    severity = "WARNING"
    file_path = "apps/api/src/test.ts"
    line_number = 42
    violation_message = "Test violation"
} | ConvertTo-Json

$check = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/compliance/checks" `
    -Method Post `
    -Headers $headers `
    -Body $checkBody `
    -ContentType "application/json"

Write-Host "Created check: $($check.id)"
```

### Test Score Calculation

```powershell
$score = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/compliance/pr/1234/score" `
    -Method Get `
    -Headers $headers

Write-Host "Compliance Score: $($score.score)/100"
Write-Host "Can merge: $($score.can_merge)"
```

---

## Expected Results

### Rules Endpoint
- ✅ Should return 25 rules (R01-R25)
- ✅ Each rule should have: id, name, description, tier, category
- ✅ Rules should be sorted by id

### Checks Endpoint
- ✅ Should return empty array initially (no checks yet)
- ✅ After creating a check, should return it in the list
- ✅ Should filter by tenant_id automatically

### Create Check
- ✅ Should create a new compliance check
- ✅ Should return the created check with id
- ✅ Should set tenant_id from authenticated user

### Score Calculation
- ✅ Should calculate score based on violation tiers:
  - BLOCK violations: -10 points each
  - OVERRIDE violations: -3 points each
  - WARNING violations: -1 point each
- ✅ Should return `can_merge: false` if BLOCK violations exist
- ✅ Should return `can_merge: true` if only OVERRIDE/WARNING violations

---

## Troubleshooting

### Server Not Starting

**Error:** `MODULE_NOT_FOUND` or compilation errors

**Solution:**
1. Ensure Prisma client is generated:
   ```powershell
   cd libs/common/prisma
   npx prisma generate
   ```

2. Check TypeScript compilation:
   ```powershell
   cd apps/api
   npx tsc --noEmit
   ```

3. Restart the server

### Authentication Fails

**Error:** `401 Unauthorized`

**Solution:**
1. Verify user exists in database
2. Check credentials are correct
3. Ensure user has a `tenant_id` assigned

### Endpoints Return 404

**Error:** `404 Not Found`

**Solution:**
1. Verify `ComplianceModule` is imported in `app.module.ts`
2. Check route prefix is correct: `/api/v1/compliance`
3. Restart the server

### Database Errors

**Error:** `Property 'ruleDefinition' does not exist`

**Solution:**
1. Regenerate Prisma client:
   ```powershell
   cd libs/common/prisma
   npx prisma generate
   ```

2. Verify compliance models are in schema.prisma

---

## Next Steps

After successful API testing:

1. ✅ **API Module:** Complete
2. ⏭️ **Frontend Dashboard:** Create React components
3. ⏭️ **Integration:** Connect frontend to API
4. ⏭️ **CI/CD Integration:** Add compliance checks to workflows

---

**Last Updated:** 2025-12-05  
**Status:** ✅ Ready for Testing



