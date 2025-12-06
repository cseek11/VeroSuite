# Queue Processor Verification Guide

**Date:** 2025-12-05  
**Purpose:** Verify the compliance queue processor is working correctly

---

## ✅ What You're Seeing

The Prisma query log you're seeing:
```sql
SELECT id, job_type, job_data, attempts, max_attempts
FROM compliance.write_queue
WHERE status = 'pending'
ORDER BY created_at ASC
LIMIT 10
FOR UPDATE SKIP LOCKED
```

**This is expected behavior!** It means:

1. ✅ **Queue processor is running** - The service started successfully
2. ✅ **Polling is active** - Checking for jobs every 5 seconds
3. ✅ **Concurrent-safe** - `FOR UPDATE SKIP LOCKED` prevents locking conflicts

---

## 🔍 Verification Checklist

### 1. Check Queue Processor Started

**Look for this log message:**
```
[ComplianceQueueService] Queue processor started (database-based)
```

**If you see it:** ✅ Queue processor initialized successfully

**If you don't see it:** Check for errors in the API server logs

---

### 2. Verify Queue Table Structure

**Check if table exists:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'compliance' 
AND table_name = 'write_queue';
```

**Expected:** `write_queue`

---

### 3. Test Queue Processing

**Create a test compliance check via API:**
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

**Check queue table:**
```sql
SELECT * FROM compliance.write_queue 
WHERE status = 'pending' 
ORDER BY created_at DESC 
LIMIT 5;
```

**Expected:** New job with `job_type = 'compliance-check'` and `status = 'pending'`

---

### 4. Verify Job Processing

**Wait 5-10 seconds, then check again:**
```sql
SELECT * FROM compliance.write_queue 
WHERE status IN ('completed', 'processing', 'failed')
ORDER BY processed_at DESC 
LIMIT 5;
```

**Expected:**
- Job status changed to `completed` or `processing`
- `processed_at` timestamp is set
- If `failed`: `error_message` contains error details

---

### 5. Verify Compliance Check Created

**Check if compliance check was created:**
```sql
SELECT * FROM compliance.compliance_checks 
WHERE pr_number = 999 
ORDER BY created_at DESC 
LIMIT 1;
```

**Expected:** New compliance check record with your test data

---

## 📊 Understanding the Query

### Query Breakdown

```sql
SELECT id, job_type, job_data, attempts, max_attempts
FROM compliance.write_queue
WHERE status = 'pending'           -- Only get unprocessed jobs
ORDER BY created_at ASC             -- Process oldest first (FIFO)
LIMIT 10                             -- Process 10 jobs at a time
FOR UPDATE SKIP LOCKED              -- Lock rows, skip if already locked
```

### Why `FOR UPDATE SKIP LOCKED`?

- **Prevents conflicts:** Multiple queue processors can run concurrently
- **Skips locked rows:** If another process is working on a job, skip it
- **Ensures processing:** Each job is processed exactly once

---

## 🐛 Troubleshooting

### Issue: Query runs but no jobs process

**Check:**
1. Are there jobs in the queue?
   ```sql
   SELECT COUNT(*) FROM compliance.write_queue WHERE status = 'pending';
   ```

2. Are jobs stuck in `processing`?
   ```sql
   SELECT * FROM compliance.write_queue WHERE status = 'processing';
   ```

3. Check for errors in API logs

**Fix:**
- Check `ComplianceService.storeComplianceCheck()` method
- Verify database permissions
- Check for constraint violations

---

### Issue: Jobs stay in `pending` status

**Possible causes:**
1. Queue processor not running
2. Database connection issues
3. Errors in job processing (check `error_message`)

**Fix:**
- Verify queue processor log message appears
- Check API server logs for errors
- Verify database connection is stable

---

### Issue: Jobs fail immediately

**Check:**
```sql
SELECT id, job_type, status, error_message, attempts
FROM compliance.write_queue 
WHERE status = 'failed'
ORDER BY created_at DESC 
LIMIT 5;
```

**Common causes:**
- Invalid job data format
- Missing required fields
- Database constraint violations
- Service method errors

**Fix:**
- Review `error_message` for details
- Check job_data JSON structure
- Verify service methods handle errors correctly

---

## ✅ Success Indicators

You'll know the queue is working when:

1. ✅ Query appears in logs every 5 seconds
2. ✅ Jobs move from `pending` → `processing` → `completed`
3. ✅ Compliance checks appear in `compliance_checks` table
4. ✅ No errors in API server logs
5. ✅ `processed_at` timestamps are set

---

## 📝 Monitoring

**Monitor queue health:**
```sql
-- Pending jobs count
SELECT COUNT(*) as pending_jobs 
FROM compliance.write_queue 
WHERE status = 'pending';

-- Processing jobs count
SELECT COUNT(*) as processing_jobs 
FROM compliance.write_queue 
WHERE status = 'processing';

-- Failed jobs count
SELECT COUNT(*) as failed_jobs 
FROM compliance.write_queue 
WHERE status = 'failed';

-- Average processing time
SELECT 
  AVG(EXTRACT(EPOCH FROM (processed_at - created_at))) as avg_seconds
FROM compliance.write_queue 
WHERE status = 'completed' 
AND processed_at IS NOT NULL;
```

---

**Last Updated:** 2025-12-05  
**Status:** Queue processor is running and polling correctly



