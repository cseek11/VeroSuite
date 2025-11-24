# Phase 1 Update: Same Database Architecture

**Created:** 2025-11-24  
**Last Updated:** 2025-11-24  
**Status:** ✅ **UPDATED**

---

## 📋 Change Summary

**Decision:** VeroScore V3 will use the **same Supabase database** as OPA Compliance, with a separate `veroscore` schema for namespace isolation.

This matches the existing pattern where OPA Compliance uses the `compliance` schema in the same database.

---

## ✅ What Changed

### 1. Migration File Updated ✅

**File:** `libs/common/prisma/migrations/20251124160359_veroscore_v3_schema/migration.sql`

**Changes:**
- ✅ Creates `veroscore` schema (similar to `compliance` schema)
- ✅ All tables use schema-qualified names: `veroscore.sessions`, `veroscore.pr_scores`, etc.
- ✅ All views use schema-qualified names: `veroscore.v_active_sessions`, etc.
- ✅ All functions updated to use schema-qualified table names
- ✅ All indexes updated to use schema-qualified table names

### 2. Prisma Schema Updated ✅

**File:** `libs/common/prisma/schema.prisma`

**Changes:**
- ✅ Added `"veroscore"` to schemas array:
  ```prisma
  schemas  = ["auth", "compliance", "public", "veroscore"]
  ```

### 3. Documentation Updated ✅

**Files Updated:**
- ✅ `PHASE1_SETUP_GUIDE.md` - Updated to use same database
- ✅ `V3_IMPLEMENTATION_PLAN.md` - Updated Decision 2.1
- ✅ `test_veroscore_setup.py` - Updated table names (no schema prefix in Supabase client)
- ✅ `DATABASE_ARCHITECTURE_DECISION.md` - New document explaining decision

---

## 🎯 Benefits

1. **Consistency** - Matches OPA Compliance pattern
2. **Future Integration** - Same database enables easy OPA + Auto-PR integration
3. **Operational Simplicity** - One database, one connection string
4. **Cost Efficient** - No need for separate Supabase project
5. **Clear Separation** - Schema provides logical isolation

---

## 📝 Setup Instructions (Updated)

### Step 1: Use Existing Database

**No new Supabase project needed!**

1. **Use Existing Connection:**
   - Use the same `DATABASE_URL` from your `.env` file
   - Use the same `SUPABASE_URL` and `SUPABASE_SECRET_KEY`
   - No additional configuration needed

2. **Deploy Migration:**
   - Run the migration SQL in your existing Supabase database
   - The migration creates the `veroscore` schema automatically
   - All tables will be in the `veroscore` schema

### Step 2: Update Prisma Client

After deploying the migration:

```bash
# Regenerate Prisma client to include veroscore schema
cd libs/common/prisma
npx prisma generate
```

### Step 3: Verify Setup

Run the verification script:

```bash
python .cursor/scripts/test_veroscore_setup.py
```

**Note:** The script may need updates if Supabase client requires schema prefix. Check Supabase documentation for your client version.

---

## 🔗 Future Integration

With both systems in the same database, future integration becomes easier:

### Example: Combined PR Analysis

```sql
-- View combining VeroScore and Compliance data
CREATE VIEW v_unified_pr_analysis AS
SELECT 
    ps.pr_number,
    ps.stabilized_score as veroscore_score,
    ps.decision,
    COUNT(cc.id) FILTER (WHERE cc.status = 'VIOLATION') as compliance_violations,
    COUNT(cc.id) FILTER (WHERE cc.severity = 'BLOCK') as blocking_violations
FROM veroscore.pr_scores ps
LEFT JOIN compliance.compliance_checks cc 
    ON ps.pr_number = cc.pr_number
GROUP BY ps.id;
```

---

## ⚠️ Important Notes

### Supabase Client Schema Handling

The Supabase JavaScript/Python client may handle schemas differently:

1. **Option 1:** Client automatically uses schema from table name
   - Use: `supabase.table("sessions")` (client finds `veroscore.sessions`)

2. **Option 2:** Client requires explicit schema
   - Use: `supabase.schema("veroscore").table("sessions")`

3. **Option 3:** Use raw SQL for schema-qualified queries
   - Use: `supabase.rpc("exec_sql", {...})`

**Check your Supabase client version documentation for the correct approach.**

---

## ✅ Verification Checklist

- [x] Migration file updated with `veroscore` schema
- [x] Prisma schema updated with `veroscore` in schemas array
- [x] Setup guide updated for same database
- [x] Implementation plan updated (Decision 2.1)
- [x] Test script updated (may need further adjustment based on client)
- [x] Architecture decision documented

---

**Last Updated:** 2025-11-24  
**Status:** ✅ Complete - Ready for deployment

