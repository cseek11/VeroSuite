# Compliance Dashboard - Testing Guide

**Date:** 2025-11-24  
**Purpose:** Step-by-step guide for testing the compliance dashboard

---

## 🚀 Quick Start Testing

### Step 1: Start API Server

```bash
cd apps/api
npm run start:dev
```

**Expected Output:**
```
[Nest] Starting Nest application...
[ComplianceQueueService] Queue processor started (database-based)
[Nest] Server listening on port 3001
```

**Key Log to Look For:**
```
[ComplianceQueueService] Queue processor started (database-based)
```

This confirms the queue service is working.

---

### Step 2: Verify API is Running

**Check health endpoint:**
```bash
curl http://localhost:3001/api
```

**Or open in browser:**
- Swagger UI: `http://localhost:3001/api/docs`
- API Base: `http://localhost:3001/api/v1`

---

### Step 3: Run Integration Tests

**Using test script:**
```powershell
.\scripts\test-compliance-integration.ps1
```

**Or manually test endpoints:**

1. **Get Rules:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3001/api/v1/compliance/rules
   ```

2. **Create Test Check:**
   ```bash
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

3. **Get Compliance Checks:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3001/api/v1/compliance/checks?prNumber=999
   ```

4. **Get Compliance Score:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3001/api/v1/compliance/pr/999/score
   ```

---

### Step 4: Test Dashboard

1. **Start Frontend** (if not running):
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open Dashboard:**
   - URL: `http://localhost:5173/compliance`
   - Login if required

3. **Test Each Tab:**
   - **Overview Tab:** Should show all 25 rules
   - **Violations Tab:** Should show violations (after creating test check)
   - **Score Tab:** Enter PR number 999 to see score

---

## ✅ Verification Checklist

### API Server
- [ ] Server starts without errors
- [ ] Queue processor log appears: `Queue processor started (database-based)`
- [ ] Swagger UI accessible: `http://localhost:3001/api/docs`
- [ ] Health endpoint responds

### API Endpoints
- [ ] `GET /compliance/rules` returns 25 rules
- [ ] `POST /compliance/checks` queues check successfully
- [ ] `GET /compliance/checks` returns checks
- [ ] `GET /compliance/pr/:prNumber/score` returns score

### Queue Processing
- [ ] Test check is queued (check `write_queue` table)
- [ ] Queue processes job within 5-10 seconds
- [ ] Compliance check appears in `compliance_checks` table
- [ ] Queue job status changes to `completed`

### Dashboard
- [ ] Dashboard loads without errors
- [ ] Overview tab shows 25 rules
- [ ] Violations tab shows test violation
- [ ] Score tab calculates score correctly
- [ ] Filters and search work

---

## 🧪 Test Scenarios

### Scenario 1: Create and View Violation

1. Create a test violation via API
2. Wait 5-10 seconds for queue to process
3. Check dashboard Violations tab
4. Verify violation appears with correct details

### Scenario 2: Compliance Score

1. Create multiple violations (different severities)
2. Get compliance score for PR
3. Verify score calculation:
   - BLOCK: -10 points each
   - OVERRIDE: -3 points each
   - WARNING: -1 point each
4. Verify `can_merge` is false if BLOCK violations exist

### Scenario 3: Queue Processing

1. Create multiple compliance checks quickly
2. Check `write_queue` table: jobs should be `pending`
3. Wait 5-10 seconds
4. Check again: jobs should be `completed`
5. Verify all checks appear in `compliance_checks` table

---

## 🐛 Troubleshooting

### Issue: Queue processor not starting

**Check:**
- API server logs for errors
- Database connection is working
- `write_queue` table exists

**Fix:**
- Verify migration was applied
- Check database connection string
- Restart API server

### Issue: Jobs not processing

**Check:**
- Queue processor log message appears
- No errors in API logs
- Database is accessible

**Fix:**
- Check API logs for queue processing errors
- Verify `write_queue` table structure
- Check database permissions

### Issue: Dashboard shows no data

**Check:**
- API server is running
- Frontend can connect to API
- Authentication token is valid

**Fix:**
- Check browser console for errors
- Verify API URL in frontend config
- Check network tab for failed requests

---

## 📊 Expected Results

### API Responses

**GET /compliance/rules:**
```json
{
  "data": [...25 rules...],
  "total": 25
}
```

**POST /compliance/checks:**
```json
{
  "message": "Compliance check queued successfully",
  "queued": true
}
```

**GET /compliance/checks:**
```json
{
  "data": [...checks...],
  "total": 1,
  "page": 1,
  "limit": 100
}
```

**GET /compliance/pr/999/score:**
```json
{
  "score": 99,
  "block_count": 0,
  "override_count": 0,
  "warning_count": 1,
  "weighted_violations": 1,
  "can_merge": true,
  "pr_number": 999
}
```

---

## 🎯 Success Criteria

- ✅ API server starts without errors
- ✅ Queue processor starts automatically
- ✅ All API endpoints respond correctly
- ✅ Queue processes jobs within 5-10 seconds
- ✅ Dashboard displays data correctly
- ✅ All features work as expected

---

**Last Updated:** 2025-11-30



