# Secret Rotation Guide

**Date:** 2025-11-22  
**Purpose:** Guide for rotating exposed secrets identified in compliance audit  
**Priority:** 🔴 CRITICAL

**⚠️ IMPORTANT:** This guide reflects the **new Supabase API key system** (as of November 2025). Supabase has introduced non-JWT keys (`sb_publishable_...` and `sb_secret_...`) that replace legacy JWT-based keys (`anon` and `service_role`). Legacy keys are deprecated (late 2026) but still supported. **Migrate to new keys for easier rotation and better security.**

---

## ⚠️ CRITICAL: Immediate Action Required

The compliance audit identified that `backend/.env` contains production secrets. While the file is not currently tracked in git, these secrets may have been exposed in git history or through other means. **All exposed secrets must be rotated immediately.**

---

## Secrets Requiring Rotation

### 1. Supabase API Keys (HIGHEST PRIORITY)

**Current Value (EXPOSED):**
```
SUPABASE_SECRET_KEY=sb_secret_ZzGLSBjMOlOgJ5Q8a-1pMQ_9wODxv6s
```

**Risk Level:** 🔴 **CRITICAL** - Full database access

**✅ GOOD NEWS:** The exposed key starts with `sb_secret_`, which means you're **already using the new API key system** (not legacy `service_role`). This makes rotation **zero downtime** - you can generate a new key, update code, and delete the old one without affecting other services.

#### Option A: Rotate New Secret Key (Recommended - Zero Downtime)

**If using new API key system (`sb_secret_...`):**

1. Log into Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to: **Project Settings** → **API Keys**
   - Direct URL: `https://supabase.com/dashboard/project/[your-project-ref]/settings/api-keys/new`
4. Locate the exposed **Secret Key** (`sb_secret_...`)
5. **Generate a new Secret Key:**
   - Click **"Create new secret key"** or **"Generate"**
   - **⚠️ IMPORTANT:** Copy the new key immediately - it will only be shown once
   - You can create multiple secret keys for different services
6. Update `backend/.env` with new key:
   ```
   SUPABASE_SECRET_KEY=sb_secret_NEW_KEY_HERE
   ```
7. Update all deployment environments (staging, production)
8. Test all services with new key
9. **Delete the old/exposed key** from Dashboard (instant revocation, zero downtime)
10. **Verify old key is invalidated** (test API call with old key should return 401)

**Benefits of New System:**
- ✅ Zero downtime rotation (generate new, update, delete old)
- ✅ Multiple secret keys supported (one per service)
- ✅ Instant revocation without affecting other keys
- ✅ Audit logging for key usage

#### Option B: Migrate from Legacy to New Keys (If Still Using Legacy)

**If you're still using legacy `service_role` key:**

1. **First, generate new keys:**
   - Navigate to: **Project Settings** → **API Keys**
   - Generate **Publishable Key** (`sb_publishable_...`) - one per project
   - Generate **Secret Key** (`sb_secret_...`) - one or more for backend services
   - Copy keys immediately

2. **Update code to use new keys:**
   - Replace `service_role` with `sb_secret_...` in backend
   - Replace `anon` with `sb_publishable_...` in frontend
   - Update headers: Use `apikey` header (not `Authorization: Bearer` for new keys)
   - For Realtime: Pass as query parameter `?apikey=[key]`
   - For Edge Functions: Add `--no-verify-jwt` flag and implement custom auth

3. **Test thoroughly:**
   - Verify authentication, database queries, Realtime, Edge Functions
   - Monitor Dashboard "Last Used" indicators

4. **Deactivate legacy keys:**
   - Once migration complete, deactivate `anon` and `service_role` keys
   - **⚠️ WARNING:** This is irreversible

**Note:** Legacy keys are deprecated (late 2026). Migration is recommended for easier future rotations.

**Impact:**
- **New Keys:** Zero downtime (generate new, update, delete old)
- **Legacy Keys:** Brief downtime if rotating JWT secret (invalidates all user sessions)
- All backend services using Supabase will need new key
- Update all deployment environments
- **Recommendation:** Migrate to new keys for easier future rotations

---

### 2. JWT Secret (HIGH PRIORITY)

**Current Value (EXPOSED):**
```
JWT_SECRET=6ec969183dafe4892a51932a6ec5afd563e22378d4f9d438d5c200e75bcd854ef46e45bcd4959dffdd110fcee73f25580d8ac37c0ef0e19843ffc4014de79297
```

**Risk Level:** 🔴 **CRITICAL** - Authentication bypass possible

**⚠️ IMPORTANT:** This JWT_SECRET is for **your backend's own JWT signing** (not Supabase's JWT secret). This is separate from Supabase API keys. If exposed, attackers could forge JWT tokens for your backend authentication.

**Rotation Steps:**
1. Generate new strong secret:
   ```bash
   # Windows PowerShell
   openssl rand -hex 64
   
   # Or using Node.js
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
2. Update `backend/.env` with new JWT_SECRET
3. Update all deployment environments
4. **All existing JWT tokens will be invalidated** - Users will need to re-authenticate
5. Coordinate with users about re-authentication requirement

**Impact:**
- All existing user sessions will be invalidated
- Users must log in again
- Plan for increased support requests

**Minimum Requirements:**
- Minimum 32 characters (current: 128 characters ✅)
- Randomly generated (not predictable)
- Different for dev/staging/prod

---

### 3. Database Password (HIGH PRIORITY)

**Current Value (EXPOSED):**
```
DATABASE_URL=postgresql://postgres:JKSumbGKN5BPp7da@db.iehzwglvmbtrlhdgofew.supabase.co:5432/postgres
```

**Risk Level:** 🔴 **CRITICAL** - Direct database access

**Rotation Steps:**
1. Log into Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to: **Settings** → **Database** (or **Project Settings** → **Database**)
4. Locate the **Database Password** section
5. Click **"Reset Database Password"** or **"Change Password"** button
6. **⚠️ IMPORTANT:** Generate and save new strong password securely - you'll need it for connection strings
7. Update `backend/.env` DATABASE_URL with new password:
   ```
   DATABASE_URL=postgresql://postgres:NEW_PASSWORD@db.PROJECT.supabase.co:5432/postgres
   ```
8. Update all deployment environments
9. Update connection strings in all services
10. **Test database connectivity** with new password

**Note:** Dashboard UI may vary. If you cannot find the password reset option, refer to: https://supabase.com/docs/guides/database/connecting-to-postgres or contact Supabase support.

**Impact:**
- Brief downtime during password reset
- All services must update connection strings
- Coordinate maintenance window

**Password Requirements:**
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, special characters
- Store securely (password manager)

---

### 4. Encryption Key (MEDIUM PRIORITY)

**Current Value (EXPOSED):**
```
ENCRYPTION_KEY=86d3334e2a0dac6987b495a7437ff684a8f96ef90dc2b184f8b85e1bcbd9ee66
```

**Risk Level:** 🟠 **HIGH** - Encrypted data at risk

**Rotation Steps:**
1. **CRITICAL:** Before rotating, decrypt all existing encrypted data with old key
2. Generate new encryption key:
   ```bash
   # Node.js (32 bytes = 64 hex characters)
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Re-encrypt all data with new key
4. Update `backend/.env` with new ENCRYPTION_KEY
5. Update all deployment environments
6. **Verify data decryption works** with new key

**Impact:**
- **Data migration required** - All encrypted data must be re-encrypted
- Plan for data migration downtime
- Test decryption thoroughly before deploying

**Key Requirements:**
- 32 bytes (64 hex characters) for AES-256-GCM
- Randomly generated
- Different for dev/staging/prod

---

### 5. Stripe API Keys (LOW PRIORITY - Test Keys)

**Current Value (EXPOSED):**
```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```

**Risk Level:** 🟡 **LOW** - Test keys (not production)

**Rotation Steps:**
1. If these are test keys, verify they're not production keys
2. If production keys were exposed, rotate immediately:
   - Log into Stripe Dashboard: https://dashboard.stripe.com/apikeys
   - Create new API key
   - Revoke old key
   - Update `backend/.env`
   - Update all deployment environments

**Impact:**
- Minimal if test keys
- Payment processing downtime if production keys

---

## Rotation Checklist

### Pre-Rotation
- [ ] Audit git history for committed secrets
- [ ] Identify all environments using secrets (dev, staging, prod)
- [ ] **Determine key system:** Check if using new keys (`sb_secret_...`) or legacy (`service_role`)
- [ ] **If legacy keys:** Plan migration to new keys (recommended)
- [ ] Coordinate maintenance window (if using legacy keys)
- [ ] Notify team of rotation schedule
- [ ] Backup current `.env` files (securely)
- [ ] Document current secret values (for reference only, store securely)

### During Rotation

#### For New API Keys (`sb_secret_...`):
- [ ] Generate new Secret Key in Dashboard (Project Settings → API Keys)
- [ ] Update `backend/.env` with new key
- [ ] Update all deployment environments
- [ ] Test all services with new key
- [ ] Delete old/exposed key from Dashboard (instant revocation)
- [ ] Verify old key is invalidated (401 response)

#### For Legacy Keys (`service_role`):
- [ ] **Option 1 (Recommended):** Migrate to new keys first, then rotate
- [ ] **Option 2:** Rotate JWT secret (invalidates all user sessions - coordinate downtime)
- [ ] Update all environment `.env` files
- [ ] Update all deployment configurations
- [ ] Test each service after rotation

#### Other Secrets:
- [ ] Rotate JWT Secret (if using custom JWT, not Supabase Auth)
- [ ] Rotate Database Password
- [ ] Rotate Encryption Key (with data migration)
- [ ] Rotate Stripe Keys (if production)

### Post-Rotation
- [ ] Verify all services working with new secrets
- [ ] Verify old secrets are invalidated
- [ ] Check Dashboard "Last Used" indicators for new keys
- [ ] Update documentation
- [ ] Monitor for authentication/database errors
- [ ] Document rotation completion
- [ ] **If migrated to new keys:** Deactivate legacy keys once stable

---

## Git History Cleanup

### If Secrets Were Committed to Git

**Option 1: BFG Repo-Cleaner (Recommended)**
```bash
# Install BFG
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Remove secrets from history
java -jar bfg.jar --replace-text secrets.txt

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

**Option 2: Git Filter-Branch**
```bash
# Remove .env files from history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/.env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (coordinate with team)
git push origin --force --all
```

**⚠️ WARNING:** Rewriting git history requires team coordination and may break existing clones.

---

## Secret Generation Commands

### Supabase API Keys
**⚠️ IMPORTANT:** New Supabase API keys (`sb_publishable_...` and `sb_secret_...`) are **generated in the Dashboard**, not via command line. They are non-JWT keys managed by Supabase API Gateway.

**Generation:**
- Navigate to: **Project Settings** → **API Keys**
- Click **"Create new secret key"** or **"Generate publishable key"**
- Copy immediately (shown only once)

**Legacy keys** (`anon` and `service_role`) are JWT-based and tied to project JWT secret. If you need to rotate the JWT secret:
- Navigate to: **Project Settings** → **JWT Settings**
- **⚠️ WARNING:** Rotating JWT secret invalidates ALL JWTs including user sessions

### JWT Secret (64 bytes = 128 hex characters)
**For custom JWT (not Supabase Auth):**
```bash
# Windows PowerShell
openssl rand -hex 64

# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Encryption Key (32 bytes = 64 hex characters)
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Database Password
```bash
# Generate strong password (12+ characters)
# Use password manager or:
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

---

## Verification Steps

After rotation, verify:

1. **Supabase Connection (New Keys):**
   ```bash
   # Test connection with new secret key
   # Use apikey header (not Authorization: Bearer for new keys)
   curl -H "apikey: sb_secret_NEW_KEY" \
        https://PROJECT.supabase.co/rest/v1/
   
   # For legacy keys (if still using):
   curl -H "apikey: LEGACY_SERVICE_ROLE_KEY" \
        -H "Authorization: Bearer LEGACY_SERVICE_ROLE_KEY" \
        https://PROJECT.supabase.co/rest/v1/
   ```

2. **Check Dashboard Usage:**
   - Navigate to: **Project Settings** → **API Keys**
   - Check **"Last Used"** indicators to verify new keys are being used
   - Verify old keys show no recent usage

3. **JWT Token Generation (If Using Custom JWT):**
   ```bash
   # Test JWT signing with new secret
   # Should generate valid token
   ```

4. **Database Connection:**
   ```bash
   # Test connection with new password
   psql "postgresql://postgres:NEW_PASSWORD@db.PROJECT.supabase.co:5432/postgres"
   
   # Or using connection pooling (recommended):
   psql "postgresql://postgres:NEW_PASSWORD@db.PROJECT.supabase.co:6543/postgres"
   ```

5. **Encryption/Decryption:**
   ```bash
   # Test encrypt/decrypt with new key
   # Verify existing encrypted data can be decrypted (after migration)
   ```

6. **Verify Old Keys Invalidated:**
   ```bash
   # Test with old key - should return 401 Unauthorized
   curl -H "apikey: OLD_EXPOSED_KEY" \
        https://PROJECT.supabase.co/rest/v1/
   # Expected: 401 Unauthorized
   ```

---

## Emergency Contacts

- **Supabase Support:** https://supabase.com/support
- **Stripe Support:** https://support.stripe.com
- **Security Team:** [Add contact]

---

## Post-Rotation Tasks

1. **Update Documentation:**
   - [ ] Update `docs/SECURITY_SETUP_GUIDE.md`
   - [ ] Update `backend/env.example` (ensure no real values)
   - [ ] Document rotation date and new key generation dates

2. **Security Improvements:**
   - [ ] Set up secret scanning in CI/CD
   - [ ] Add pre-commit hooks to prevent .env commits
   - [ ] Set up secret rotation schedule (quarterly recommended)
   - [ ] Implement secret management service (AWS Secrets Manager, Vercel, etc.)

3. **Monitoring:**
   - [ ] Monitor for authentication failures
   - [ ] Monitor for database connection errors
   - [ ] Monitor for encryption/decryption errors

---

## Migration to New API Key System

**⚠️ RECOMMENDED:** If you're still using legacy keys (`anon` and `service_role`), migrate to the new system for easier rotation and better security.

### Benefits of New System:
- ✅ **Easier Rotation:** Generate new key, update code, delete old (zero downtime)
- ✅ **Multiple Keys:** Create one secret key per backend service
- ✅ **Instant Revocation:** Delete compromised key without affecting others
- ✅ **Audit Logging:** Track key usage in Dashboard
- ✅ **Better Security:** Non-JWT keys, not tied to project JWT secret
- ✅ **Client-Side Safety:** Publishable keys safe for browsers, secret keys blocked

### Migration Steps:
1. Generate new keys in Dashboard (Project Settings → API Keys)
2. Update code to use new keys (use `apikey` header)
3. Test thoroughly (auth, database, Realtime, Edge Functions)
4. Monitor "Last Used" indicators
5. Deactivate legacy keys once stable

### Important Notes:
- **Legacy keys deprecated:** Late 2026 (tentative)
- **New projects:** Don't generate legacy keys by default
- **Both systems coexist:** Can migrate gradually without downtime
- **Self-hosted/CLI:** New keys not yet supported, must use legacy

**Reference:** See detailed migration guide in Supabase documentation or contact support.

---

**Last Updated:** 2025-11-22  
**Next Review:** After rotation completion  
**Status:** 🔴 CRITICAL - Action Required  
**Supabase API Key System:** Updated for new non-JWT keys (November 2025)

