# Migration Verification Checklist

**Created:** 2025-12-05  
**Last Updated:** 2025-12-05  
**Purpose:** Verify VeroScore V3 migration completed successfully

---

## ✅ What to Look For

### 1. Schema Created

**Check:**
```sql
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name = 'veroscore';
```

**Expected:** Should return 1 row with `veroscore`

---

### 2. Tables Created (7 tables)

**Check:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'veroscore'
ORDER BY table_name;
```

**Expected Tables:**
1. ✅ `audit_log` - Full audit trail
2. ✅ `changes_queue` - Buffered file changes
3. ✅ `detection_results` - Individual detector findings
4. ✅ `idempotency_keys` - Prevent duplicate operations
5. ✅ `pr_scores` - Scoring results and history
6. ✅ `sessions` - Core session tracking
7. ✅ `system_metrics` - Observability metrics

---

### 3. Views Created (4 views)

**Check:**
```sql
SELECT viewname 
FROM pg_views 
WHERE schemaname = 'veroscore'
ORDER BY viewname;
```

**Expected Views:**
1. ✅ `v_active_sessions` - Active sessions with stats
2. ✅ `v_dashboard_summary` - Real-time dashboard data
3. ✅ `v_pr_score_summary` - PR scores with decision summary
4. ✅ `v_system_health` - System health metrics

---

### 4. Functions Created (5 functions)

**Check:**
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'veroscore'
ORDER BY routine_name;
```

**Expected Functions:**
1. ✅ `veroscore_archive_old_metrics()` - Archive old metrics
2. ✅ `veroscore_auto_timeout_sessions()` - Auto-timeout inactive sessions
3. ✅ `veroscore_cleanup_expired_idempotency()` - Cleanup old idempotency keys
4. ✅ `veroscore_get_avg_score_today()` - Get average score for today
5. ✅ `veroscore_get_top_authors(days)` - Get top authors by PR count
6. ✅ `veroscore_get_score_trend(days)` - Get score trend
7. ✅ `veroscore_get_violation_types(days)` - Get violation types distribution
8. ✅ `veroscore_increment_session_stats(...)` - Increment session stats
9. ✅ `update_veroscore_updated_at_column()` - Auto-update timestamp trigger

---

### 5. Indexes Created

**Check:**
```sql
SELECT 
    tablename,
    indexname
FROM pg_indexes 
WHERE schemaname = 'veroscore'
ORDER BY tablename, indexname;
```

**Expected:** Multiple indexes on each table (should see ~20+ indexes)

---

### 6. RLS Policies Created

**Check:**
```sql
SELECT 
    schemaname,
    tablename,
    policyname
FROM pg_policies 
WHERE schemaname = 'veroscore'
ORDER BY tablename, policyname;
```

**Expected Policies:**
- `sessions` table: "Service role full access sessions", "Users can view own sessions"
- `pr_scores` table: "Service role full access pr_scores", "Team members can view all PR scores"

---

### 7. Reward Score Integration Columns

**Check Sessions Table:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'veroscore' 
  AND table_name = 'sessions'
  AND column_name LIKE '%reward%'
ORDER BY column_name;
```

**Expected Columns:**
- ✅ `reward_score_eligible` (boolean)
- ✅ `last_reward_score` (numeric)
- ✅ `reward_scored_at` (timestamp with time zone)

**Check PR Scores Table:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'veroscore' 
  AND table_name = 'pr_scores'
  AND column_name LIKE '%reward%'
ORDER BY column_name;
```

**Expected Columns:**
- ✅ `reward_score` (numeric)
- ✅ `reward_score_timestamp` (timestamp with time zone)

---

## 🧪 Quick Test

### Test 1: Insert Test Session

```sql
-- Insert test session
INSERT INTO veroscore.sessions (session_id, author, branch_name, status)
VALUES ('test-verification-20251124', 'test-user', 'test-branch', 'active')
RETURNING *;
```

**Expected:** Should return 1 row with the inserted session

### Test 2: Query View

```sql
-- Query active sessions view
SELECT * FROM veroscore.v_active_sessions;
```

**Expected:** Should return your test session (or empty if no active sessions)

### Test 3: Test Function

```sql
-- Test helper function
SELECT veroscore_get_avg_score_today();
```

**Expected:** Should return `0` (no scores yet) or a numeric value

### Test 4: Cleanup Test Data

```sql
-- Cleanup test session
DELETE FROM veroscore.sessions WHERE session_id = 'test-verification-20251124';
```

---

## 📊 Complete Verification Query

Run this single query to see everything at once:

```sql
-- Complete verification
SELECT 
    'Schema' as object_type,
    schema_name as object_name,
    NULL as details
FROM information_schema.schemata 
WHERE schema_name = 'veroscore'

UNION ALL

SELECT 
    'Table' as object_type,
    table_name as object_name,
    (SELECT COUNT(*) FROM information_schema.columns 
     WHERE table_schema = 'veroscore' AND table_name = t.table_name)::text as details
FROM information_schema.tables t
WHERE table_schema = 'veroscore'

UNION ALL

SELECT 
    'View' as object_type,
    viewname as object_name,
    NULL as details
FROM pg_views 
WHERE schemaname = 'veroscore'

UNION ALL

SELECT 
    'Function' as object_type,
    routine_name as object_name,
    NULL as details
FROM information_schema.routines 
WHERE routine_schema = 'veroscore'

ORDER BY object_type, object_name;
```

---

## ✅ Success Criteria

Migration is successful if you see:

- [x] 1 schema: `veroscore`
- [x] 7 tables (sessions, changes_queue, pr_scores, detection_results, idempotency_keys, system_metrics, audit_log)
- [x] 4 views (v_active_sessions, v_dashboard_summary, v_pr_score_summary, v_system_health)
- [x] 9 functions (including cleanup and helper functions)
- [x] 20+ indexes
- [x] 4 RLS policies
- [x] Reward Score columns in sessions and pr_scores tables

---

## ⚠️ Common Issues

### Issue: Tables Not Found

**Check:**
- Did migration complete without errors?
- Check Supabase SQL Editor for error messages
- Verify you're querying `veroscore` schema (not `public`)

### Issue: Views Not Found

**Check:**
- Views are in `veroscore` schema
- Query: `SELECT * FROM veroscore.v_active_sessions;`

### Issue: Functions Not Found

**Check:**
- Functions are in `veroscore` schema
- Call with schema: `SELECT veroscore_get_avg_score_today();`

---

**Last Updated:** 2025-12-05



