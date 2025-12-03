# Troubleshooting: Violations Not Showing in Dashboard

**Date:** 2025-11-24  
**Issue:** Compliance check created but not showing in Violations tab

---

## ✅ What We Know

1. ✅ Compliance check was queued successfully (201 response)
2. ✅ Job should be in `write_queue` table
3. ❓ Queue processor may not have processed it yet
4. ❓ Compliance check may not have been created
5. ❓ Frontend may be filtering incorrectly

---

## 🔍 Step-by-Step Troubleshooting

### Step 1: Check Queue Status

**Check if job is in queue:**
```sql
SELECT 
    id,
    job_type,
    status,
    attempts,
    created_at,
    processed_at,
    error_message
FROM compliance.write_queue
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Results:**
- If `status = 'pending'`: Queue hasn't processed yet (wait 5-10 seconds)
- If `status = 'processing'`: Job is being processed now
- If `status = 'completed'`: Job processed successfully
- If `status = 'failed'`: Check `error_message` for details

---

### Step 2: Check Compliance Checks Table

**Check if compliance check was created:**
```sql
SELECT 
    id,
    tenant_id,
    pr_number,
    rule_id,
    status,
    severity,
    violation_message,
    created_at
FROM compliance.compliance_checks
ORDER BY created_at DESC
LIMIT 5;
```

**If no checks found:**
- Queue may not have processed yet
- Or there was an error during processing

---

### Step 3: Check API Server Logs

**Look for:**
1. Queue processor startup:
   ```
   [ComplianceQueueService] Queue processor started (database-based)
   ```

2. Queue processing logs:
   ```
   [ComplianceQueueService] Processing queue...
   ```

3. Error messages:
   ```
   [ComplianceQueueService] Error processing job...
   ```

---

### Step 4: Check Tenant ID

**Important:** The compliance check is created with the tenant ID from your JWT token.

**Verify tenant ID:**
```sql
-- Check what tenant ID was used
SELECT DISTINCT tenant_id 
FROM compliance.compliance_checks
ORDER BY created_at DESC;

-- Compare with your user's tenant ID
SELECT id, email, tenant_id 
FROM users 
WHERE email = 'your-email@example.com';
```

**If tenant IDs don't match:**
- Frontend filters by your tenant ID
- Check created with different tenant ID won't show

---

### Step 5: Test API Endpoint Directly

**Get compliance checks via API:**
```bash
curl -X GET \
  "http://localhost:3001/api/v1/compliance/checks" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

**Check response:**
- Does it return your check?
- What tenant_id is in the check?
- Does it match your user's tenant_id?

---

### Step 6: Check Frontend Filtering

**Frontend filters by:**
- Tenant ID (from your auth token)
- PR number (if specified)
- Rule ID (if specified)
- Status (if specified)

**Verify:**
1. Open browser DevTools → Network tab
2. Check the API call to `/api/v1/compliance/checks`
3. Verify the response includes your check
4. Check if frontend is filtering it out

---

## 🐛 Common Issues

### Issue 1: Queue Processor Not Running

**Symptoms:**
- Jobs stay in `pending` status
- No queue processing logs

**Fix:**
- Check API server logs for queue processor startup
- Verify `ComplianceQueueService` is initialized
- Restart API server

### Issue 2: Tenant ID Mismatch

**Symptoms:**
- Check exists in database
- Not showing in frontend
- API returns empty array

**Fix:**
- Verify tenant ID in check matches your user's tenant ID
- Check JWT token includes correct tenant_id
- Re-authenticate if needed

### Issue 3: Error During Processing

**Symptoms:**
- Job status is `failed`
- `error_message` contains error details

**Fix:**
- Check `error_message` in `write_queue` table
- Fix the issue (usually database constraint or missing field)
- Retry the job or create new check

### Issue 4: Frontend Not Refreshing

**Symptoms:**
- Check exists in database
- API returns check
- Frontend doesn't show it

**Fix:**
- Hard refresh frontend (Ctrl+F5)
- Check React Query cache
- Verify polling is working (5-minute intervals)

---

## ✅ Quick Verification Commands

**PowerShell Script:**
```powershell
.\scripts\check-compliance-queue-status.ps1
```

**Manual SQL:**
```sql
-- Check queue
SELECT * FROM compliance.write_queue ORDER BY created_at DESC LIMIT 5;

-- Check compliance checks
SELECT * FROM compliance.compliance_checks ORDER BY created_at DESC LIMIT 5;

-- Check your tenant ID
SELECT id, email, tenant_id FROM users WHERE email = 'your-email@example.com';
```

---

## 🎯 Expected Flow

1. **Create check** → Job added to `write_queue` (status: `pending`)
2. **Queue processor** → Picks up job (status: `processing`)
3. **Process job** → Creates compliance check in `compliance_checks` table
4. **Mark complete** → Job status: `completed`
5. **Frontend** → Fetches checks via API, displays in Violations tab

**If any step fails, check the troubleshooting steps above.**

---

**Last Updated:** 2025-11-30  
**Status:** Use diagnostic script to identify the issue



