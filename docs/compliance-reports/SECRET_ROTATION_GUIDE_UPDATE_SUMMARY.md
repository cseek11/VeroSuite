# Secret Rotation Guide Update Summary

**Date:** 2025-11-22  
**Update:** Incorporated November 2025 Supabase API key system changes  
**Status:** ✅ **COMPLETE**

---

## Updates Made

### 1. New Supabase API Key System (November 2025)

**Key Changes:**
- ✅ Updated guide to reflect new non-JWT API keys (`sb_publishable_...` and `sb_secret_...`)
- ✅ Documented migration path from legacy JWT keys (`anon` and `service_role`)
- ✅ Added zero-downtime rotation procedures for new keys
- ✅ Updated navigation paths: **Project Settings → API Keys**

### 2. Rotation Procedures Updated

**New Key System:**
- Generate new key → Update code → Delete old key (zero downtime)
- Multiple secret keys supported (one per service)
- Instant revocation without affecting other keys
- Audit logging available in Dashboard

**Legacy Key System:**
- Migration path documented
- JWT secret rotation (invalidates all user sessions)
- Both systems can coexist during transition

### 3. Best Practices Added

- ✅ Use `apikey` header for new keys (not `Authorization: Bearer`)
- ✅ Secret keys blocked from browser (401 if used client-side)
- ✅ Publishable keys safe for client-side use
- ✅ Enable audit logging and Security Advisor
- ✅ Use Network Restrictions for database access
- ✅ Enable RLS policies on all tables

### 4. Verification Steps Updated

- ✅ Check Dashboard "Last Used" indicators
- ✅ Test with `apikey` header for new keys
- ✅ Verify old keys return 401 when invalidated
- ✅ Monitor key usage via Dashboard metrics

---

## Key Differences: New vs Legacy

| Feature | New Keys (`sb_secret_...`) | Legacy Keys (`service_role`) |
|---------|---------------------------|----------------------------|
| **Type** | Non-JWT, API Gateway managed | JWT-based, tied to project JWT secret |
| **Rotation** | Zero downtime (generate, update, delete) | May require downtime (rotates JWT secret) |
| **Multiple Keys** | ✅ Supported (one per service) | ❌ Single key per type |
| **Revocation** | ✅ Instant, independent | ⚠️ Affects all JWTs |
| **Header** | `apikey` header | `Authorization: Bearer` |
| **Browser Use** | ❌ Blocked (401) | ⚠️ Possible but not recommended |
| **Deprecation** | ✅ Current system | ⚠️ Late 2026 (tentative) |

---

## Migration Recommendation

**If using legacy keys (`service_role`):**
1. ✅ Generate new keys in Dashboard (Project Settings → API Keys)
2. ✅ Update code to use new keys (`apikey` header)
3. ✅ Test thoroughly (auth, database, Realtime, Edge Functions)
4. ✅ Monitor "Last Used" indicators
5. ✅ Deactivate legacy keys once stable

**Benefits:**
- Easier future rotations (zero downtime)
- Better security (non-JWT, multiple keys)
- Audit logging and usage tracking
- Preparation for legacy key deprecation

---

## Compliance Status

### ✅ Verified Against Supabase Documentation:
- New API key system (November 2025) ✅
- Navigation paths (Project Settings → API Keys) ✅
- Rotation procedures ✅
- Best practices ✅
- Migration path ✅

### ✅ Guide Updated:
- `docs/SECRET_ROTATION_GUIDE.md` - Complete update
- `docs/compliance-reports/SUPABASE_DOCS_VERIFICATION.md` - Verification status updated

---

## Next Steps

1. **Immediate:**
   - Verify if using new keys (`sb_secret_...`) or legacy (`service_role`)
   - If legacy, plan migration to new keys
   - Rotate exposed secrets

2. **Short-term:**
   - Complete migration (if using legacy)
   - Rotate all exposed secrets
   - Enable audit logging

3. **Long-term:**
   - Set up automated rotation schedule (every 90 days)
   - Use multiple secret keys (one per service)
   - Monitor key usage regularly

---

**Last Updated:** 2025-11-22  
**Status:** ✅ **COMPLETE** - Guide updated with November 2025 Supabase changes







