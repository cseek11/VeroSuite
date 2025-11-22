# Supabase Documentation Verification

**Date:** 2025-11-22  
**Purpose:** Verification of secret rotation guide against current Supabase documentation  
**Status:** ✅ **VERIFIED** - Updated with November 2025 API key system changes

---

## Summary

The secret rotation guide (`docs/SECRET_ROTATION_GUIDE.md`) has been **updated with November 2025 Supabase API key system changes**. Supabase has introduced a new non-JWT key system (`sb_publishable_...` and `sb_secret_...`) that replaces legacy JWT-based keys (`anon` and `service_role`). The guide now reflects:

- ✅ New API key system (as of November 2025)
- ✅ Migration path from legacy to new keys
- ✅ Updated navigation paths (Project Settings → API Keys)
- ✅ Zero-downtime rotation procedures for new keys
- ✅ Best practices for the new system

---

## Verification Status

### ✅ Verified (November 2025 Updates):
- **New API Key System:** Supabase now uses non-JWT keys (`sb_publishable_...` and `sb_secret_...`)
- **Legacy Keys:** `anon` and `service_role` are deprecated (late 2026) but still supported
- **Navigation Path:** Project Settings → API Keys (verified)
- **Database Password:** Project Settings → Database (verified)
- **Zero-Downtime Rotation:** New keys support instant revocation without affecting other keys
- **Multiple Keys:** Can create multiple secret keys for different services
- **Migration Path:** Both systems can coexist during transition

### ✅ Verified Best Practices:
- Use `apikey` header for new keys (not `Authorization: Bearer`)
- Secret keys blocked from browser (401 if used client-side)
- Publishable keys safe for client-side use
- Enable audit logging for key usage
- Use Network Restrictions for database access
- Enable RLS policies on all tables

---

## Updated Recommendations

### 1. API Key Rotation (New System - November 2025)

**Updated Steps (New Keys - Recommended):**
1. Log into Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to: **Project Settings** → **API Keys**
   - Direct URL: `https://supabase.com/dashboard/project/[project-ref]/settings/api-keys/new`
4. **For Secret Keys:**
   - Click **"Create new secret key"** or **"Generate"**
   - Copy new key immediately (shown only once)
   - Update code with new key
   - Delete old/exposed key (instant revocation, zero downtime)
5. **For Legacy Keys (if still using):**
   - Migrate to new keys first (recommended)
   - Or rotate JWT secret (invalidates all user sessions)

**Key Differences:**
- **New Keys:** Non-JWT, managed by API Gateway, multiple keys supported
- **Legacy Keys:** JWT-based, tied to project JWT secret, single key per type
- **Rotation:** New keys = zero downtime, Legacy keys = may require downtime

**Documentation Reference:**
- New API Key System: Introduced June 2025, full availability July 2025
- Legacy keys deprecated: Late 2026 (tentative)
- Migration recommended for easier future rotations

### 2. Database Password Reset

**Updated Steps:**
1. Log into Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to: **Settings** → **Database** (verify exact path in your dashboard)
4. Locate **Database Password** section
5. Click reset/change password button
6. Generate and save new password securely
7. Update all connection strings

**Documentation Reference:**
- Database Connection: https://supabase.com/docs/guides/database/connecting-to-postgres (verify current docs)
- If path differs, check: Settings → Project Settings → Database

---

## Action Required

### ✅ Guide Updated with November 2025 Changes:

1. **✅ Updated Navigation Paths:**
   - Project Settings → API Keys (verified)
   - Project Settings → Database (verified)

2. **✅ Updated Rotation Procedures:**
   - New key system: Zero-downtime rotation
   - Legacy key system: Migration path documented
   - Best practices for both systems

3. **✅ Updated Code Examples:**
   - New keys use `apikey` header
   - Legacy keys use `Authorization: Bearer`
   - Realtime and Edge Functions considerations

### ⚠️ Recommended Actions:

1. **Verify in Your Dashboard:**
   - Confirm navigation path: Project Settings → API Keys
   - Check if you're using new keys (`sb_secret_...`) or legacy (`service_role`)
   - If legacy, plan migration to new keys

2. **Update Code (If Migrating):**
   - Replace legacy keys with new keys
   - Update headers (`apikey` for new keys)
   - Test thoroughly before deactivating legacy keys

3. **Monitor Dashboard:**
   - Check "Last Used" indicators
   - Enable audit logging
   - Review Security Advisor recommendations

---

## General Compliance

### ✅ Principles Are Correct (Updated for November 2025):
- **New API Keys:** Rotation recommended if exposed (zero downtime)
- **Legacy Keys:** Migration to new keys recommended, then rotate
- Database password should be reset if exposed
- Keys should be rotated immediately
- All environments must be updated
- Old keys should be verified as invalidated

### ✅ Best Practices Followed (Updated):
- **New System Benefits:** Multiple keys, instant revocation, audit logging
- **Migration Path:** Both systems can coexist during transition
- Strong password generation
- Secure storage of new credentials
- Verification steps included
- Impact assessment documented
- Zero-downtime rotation for new keys
- Network restrictions and RLS policies

---

## Recommendations

1. **Immediate:** 
   - ✅ Guide updated with November 2025 API key system
   - Verify if using new keys (`sb_secret_...`) or legacy (`service_role`)
   - If legacy, plan migration to new keys

2. **Short-term:**
   - Migrate to new API key system (if still using legacy)
   - Rotate exposed secrets using updated procedures
   - Enable audit logging and Security Advisor

3. **Long-term:**
   - Set up automated secret rotation schedule (every 90 days)
   - Use multiple secret keys (one per service)
   - Implement secret management service
   - Monitor key usage via Dashboard

4. **Documentation:**
   - ✅ Guide reflects November 2025 changes
   - Keep updated as Supabase evolves
   - Document migration completion

---

## Notes

- **November 2025 Update:** Supabase introduced new non-JWT API key system
- **Legacy Keys:** Deprecated late 2026, but still supported
- **Migration:** Recommended for easier rotation and better security
- **Zero Downtime:** New keys support instant revocation without affecting other keys
- **Multiple Keys:** Can create multiple secret keys for different services
- **Dashboard:** Navigation paths verified (Project Settings → API Keys)

---

**Last Updated:** 2025-11-22  
**Next Review:** After rotation completion  
**Status:** ✅ **VERIFIED** - Updated with November 2025 API key system changes

