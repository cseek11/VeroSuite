# Compliance Dashboard - Quick Start Guide

**Date:** 2025-12-05  
**Purpose:** Quick reference for setting up and using the compliance dashboard

---

## 🚀 Quick Setup (5 minutes)

### 1. Apply Database Migration

```powershell
# Option A: Using Prisma
cd libs/common/prisma
npx prisma migrate deploy

# Option B: Manual script
cd C:\Users\ashse\Documents\VeroField\Training\VeroField
.\scripts\apply-write-queue-migration.ps1
```

### 2. Start API Server

```bash
cd apps/api
npm run start:dev
```

**Verify:** Look for log message: `Queue processor started (database-based)`

### 3. Start Frontend (if not already running)

```bash
cd frontend
npm run dev
```

### 4. Access Dashboard

Open: `http://localhost:5173/compliance`

---

## 🔧 Configuration

### GitHub Secrets (for OPA Integration)

1. Go to: **GitHub Repository → Settings → Secrets and variables → Actions**
2. Add secrets:
   - `COMPLIANCE_API_TOKEN` - Your JWT token
   - `COMPLIANCE_API_URL` - Optional (defaults to localhost)

**Full guide:** `docs/compliance-reports/GITHUB-SECRETS-SETUP.md`

---

## 🧪 Testing

### Test API Endpoints

```powershell
.\scripts\test-compliance-integration.ps1
```

### Manual API Test

```bash
# Get rules
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/v1/compliance/rules

# Create test check
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pr_number": 999,
    "commit_sha": "test-123",
    "rule_id": "R01",
    "status": "VIOLATION",
    "severity": "WARNING",
    "violation_message": "Test violation"
  }' \
  http://localhost:3001/api/v1/compliance/checks
```

### Test Dashboard

1. Open: `http://localhost:5173/compliance`
2. **Overview Tab:** Should show 25 rules
3. **Violations Tab:** Should show violations (if any)
4. **Score Tab:** Enter PR number to see score

---

## 📊 Dashboard Features

### Overview Tab
- View all 25 rules (R01-R25)
- Filter by tier (BLOCK/OVERRIDE/WARNING)
- Filter by category
- Search rules
- See violation counts

### Violations Tab
- List all violations
- Filter by status, severity, rule ID, PR number
- Search violations
- View violation details

### Score Tab
- Enter PR number
- View compliance score (0-100)
- See violation breakdown
- Check if PR can merge

---

## 🔍 Verification Checklist

- [ ] Migration applied (`write_queue` table exists)
- [ ] API server running (port 3001)
- [ ] Queue processor started (check logs)
- [ ] Frontend running (port 5173)
- [ ] Dashboard accessible (`/compliance`)
- [ ] All 25 rules visible in Overview
- [ ] API endpoints working (test script passes)
- [ ] GitHub Secrets configured (for OPA)

---

## 🐛 Common Issues

### Issue: "Queue processor not starting"

**Solution:**
- Check database connection
- Verify `write_queue` table exists
- Check API logs for errors

### Issue: "Dashboard shows no data"

**Solution:**
- Verify API server is running
- Check browser console for errors
- Verify authentication token

### Issue: "OPA integration not working"

**Solution:**
- Verify GitHub Secrets are set
- Check GitHub Actions logs
- Test API endpoint manually

---

## 📚 Documentation

- **Setup Complete:** `docs/compliance-reports/PHASE3-SETUP-COMPLETE.md`
- **GitHub Secrets:** `docs/compliance-reports/GITHUB-SECRETS-SETUP.md`
- **Frontend:** `docs/compliance-reports/PHASE3-FRONTEND-COMPLETE.md`
- **Days 6-7:** `docs/compliance-reports/PHASE3-DAYS6-7-COMPLETE.md`

---

**Last Updated:** 2025-12-05



