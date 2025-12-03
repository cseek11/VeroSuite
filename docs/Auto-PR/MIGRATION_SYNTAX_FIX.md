# Migration Syntax Fix - Dollar-Quote Conflict

**Created:** 2025-11-24  
**Last Updated:** 2025-11-24  
**Issue:** Syntax error with nested dollar-quoted strings

---

## 🐛 Error

```
ERROR: 42601: syntax error at or near "SELECT"
LINE 329: $$SELECT veroscore_auto_timeout_sessions()$$
```

---

## 🔍 Root Cause

**Nested Dollar-Quote Conflict:**
- Outer block uses `DO $$ ... END $$;`
- Inner `cron.schedule()` tried to use `$$SELECT ...$$`
- PostgreSQL can't parse nested `$$` delimiters

---

## ✅ Fix Applied

### Solution: Use Different Dollar-Quote Tags

**Before (Broken):**
```sql
DO $$
BEGIN
    ...
    PERFORM cron.schedule(
        'job-name',
        'schedule',
        $$SELECT function_name()$$  -- ❌ Conflicts with outer $$
    );
END $$;
```

**After (Fixed):**
```sql
DO $cron_setup$  -- Different tag
BEGIN
    ...
    PERFORM cron.schedule(
        'job-name',
        'schedule',
        'SELECT function_name()'  -- ✅ Simple string, no dollar quotes needed
    );
END $cron_setup$;
```

### Alternative: Use Regular Strings

Since the cron command is a simple SQL string, we can use regular single quotes instead of dollar quotes:

```sql
PERFORM cron.schedule(
    'veroscore-auto-timeout-sessions',
    '*/15 * * * *',
    'SELECT veroscore_auto_timeout_sessions()'  -- Simple string
);
```

---

## 📝 Changes Made

1. **Changed outer block delimiter:** `DO $$` → `DO $cron_setup$`
2. **Changed inner strings:** `$$SELECT ...$$` → `'SELECT ...'`
3. **Added error handling:** Wraps cron scheduling in exception handler
4. **Added extension check:** Checks if pg_cron exists before using

---

## ✅ Files Updated

- ✅ `migration_safe.sql` - Fixed syntax error
- ✅ `migration.sql` - Fixed syntax error (also added error handling)

---

## 🧪 Testing

The migration should now run successfully in Supabase SQL Editor:

1. **On Free Tier:**
   - Creates all tables, functions, views
   - Skips cron scheduling (extension not available)
   - Shows helpful notices

2. **On Pro/Enterprise Tier:**
   - Creates all tables, functions, views
   - Schedules cron jobs successfully
   - Shows success notice

---

**Last Updated:** 2025-11-30  
**Status:** ✅ Fixed - Ready to use



