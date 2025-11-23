# Encryption Key Rotation - Implementation Guide

**Date:** 2025-11-22  
**Secret Type:** AES-256-GCM Encryption Key (for sensitive data)  
**Status:** ⚠️ **MIGRATION SCRIPT CREATED** - Manual execution required

---

## Rotation Summary

### Old Key (EXPOSED):
```
86d3334e2a0dac6987b495a7437ff684a8f96ef90dc2b184f8b85e1bcbd9ee66
```

### New Key (GENERATED):
```
453fe4eeaba8b55e0463ae6118c0be4bbf694704826d78a19a0c5904bc3af003
```

**Length:** 64 hex characters (32 bytes) ✅  
**Strength:** Cryptographically secure random ✅

---

## ⚠️ CRITICAL: Data Migration Required

**Unlike JWT rotation, encryption key rotation requires data migration:**
- All existing encrypted data must be **decrypted with old key**
- Then **re-encrypted with new key**
- Database must be updated before switching to new key

**If you update ENCRYPTION_KEY without migrating data, all encrypted data will be unreadable!**

---

## Migration Script Created

### Script Location:
`backend/scripts/rotate-encryption-key.ts`

### What It Does:
1. ✅ Fetches all users with encrypted fields (`social_security_number`, `driver_license_number`)
2. ✅ Decrypts each field with old key
3. ✅ Re-encrypts with new key
4. ✅ Updates database
5. ✅ Provides detailed progress and error reporting

### Encrypted Fields:
- `users.social_security_number` - SSN (encrypted)
- `users.driver_license_number` - Driver's license number (encrypted)

---

## Step-by-Step Rotation Procedure

### Step 1: Backup Database
```bash
# Create a full database backup before rotation
# Use Supabase Dashboard or pg_dump
```

### Step 2: Set Environment Variables
```bash
# Set old key (current key from .env)
export OLD_ENCRYPTION_KEY=86d3334e2a0dac6987b495a7437ff684a8f96ef90dc2b184f8b85e1bcbd9ee66

# Set new key (generated key)
export NEW_ENCRYPTION_KEY=453fe4eeaba8b55e0463ae6118c0be4bbf694704826d78a19a0c5904bc3af003
```

### Step 3: Run Migration Script
```bash
# From project root
cd backend
npx ts-node scripts/rotate-encryption-key.ts

# Or with environment variables inline:
OLD_ENCRYPTION_KEY=old_key NEW_ENCRYPTION_KEY=new_key npx ts-node scripts/rotate-encryption-key.ts
```

### Step 4: Verify Migration Success
The script will output:
- ✅ Number of users processed
- ✅ Success count
- ❌ Error count (if any)
- Detailed error messages for failures

**⚠️ DO NOT proceed if there are errors!**

### Step 5: Update .env File
```bash
# Update backend/.env with new key
ENCRYPTION_KEY=453fe4eeaba8b55e0463ae6118c0be4bbf694704826d78a19a0c5904bc3af003
```

### Step 6: Update All Deployment Environments
- [ ] **Development:** ✅ Updated (pending migration script execution)
- [ ] **Staging:** Update staging environment variables
- [ ] **Production:** Update production environment variables
- [ ] **CI/CD:** Update any CI/CD secret stores

### Step 7: Restart Backend Services
```bash
# Restart backend to load new ENCRYPTION_KEY
# Services read ENCRYPTION_KEY at startup
```

### Step 8: Verify Decryption Works
```bash
# Test that encrypted data can be decrypted with new key
# Query a user with encrypted fields and verify decryption works
```

---

## Verification Steps

### 1. Test Decryption with New Key
After updating .env and restarting:

```typescript
// In backend, test decryption:
const user = await prisma.user.findFirst({
  where: { social_security_number: { not: null } },
});

if (user?.social_security_number) {
  const decrypted = encryptionService.decrypt(user.social_security_number);
  console.log('Decryption test:', decrypted ? '✅ SUCCESS' : '❌ FAILED');
}
```

### 2. Verify Data Integrity
- [ ] Query users with encrypted fields
- [ ] Verify SSN decryption works
- [ ] Verify driver license decryption works
- [ ] Check for any decryption errors in logs

### 3. Monitor for Errors
- [ ] Check backend logs for decryption errors
- [ ] Monitor API responses for encrypted fields
- [ ] Verify no users report data access issues

---

## Error Handling

### If Migration Script Fails:

1. **Check Error Messages:**
   - Script provides detailed error messages
   - Identify which users failed
   - Review error reasons

2. **Common Issues:**
   - **Invalid encrypted data format:** Data may not be encrypted (legacy)
   - **Decryption failure:** Old key may be incorrect
   - **Database connection:** Verify DATABASE_URL is correct

3. **Recovery:**
   - **DO NOT update ENCRYPTION_KEY** until all errors resolved
   - Fix data issues manually if needed
   - Re-run migration script after fixes

---

## Security Notes

### ✅ Security Improvements:
- Old exposed key will no longer be valid after migration
- New key is cryptographically secure
- Rotation date documented for audit trail

### ⚠️ Remaining Risks:
- Old key may exist in:
  - Git history (if committed)
  - Logs or error messages
  - Other environment files
  - Deployment configurations

**Recommendation:** Audit all locations where old key might exist.

---

## Files Created/Modified

1. ✅ `backend/scripts/rotate-encryption-key.ts` - Migration script created
2. ⚠️ `backend/.env` - **NOT YET UPDATED** (wait for migration script execution)
3. ✅ `docs/compliance-reports/ENCRYPTION_KEY_ROTATION_2025-11-22.md` - This document

---

## Next Steps

### IMMEDIATE:
1. [ ] **Backup database** (critical!)
2. [ ] **Run migration script** with old and new keys
3. [ ] **Verify migration success** (no errors)
4. [ ] **Update backend/.env** with new key
5. [ ] **Restart backend services**
6. [ ] **Test decryption** with new key

### SHORT-TERM:
- [ ] Update staging environment
- [ ] Update production environment
- [ ] Monitor for decryption errors
- [ ] Verify data integrity

### LONG-TERM:
- [ ] Audit git history for old key
- [ ] Review logs for key exposure
- [ ] Set up automated key rotation schedule
- [ ] Implement key versioning system

---

## Related Documentation

- `docs/SECRET_ROTATION_GUIDE.md` - Complete rotation procedures
- `docs/compliance-reports/COMPREHENSIVE_CODEBASE_AUDIT_2025-11-22.md` - Original audit findings
- `backend/src/common/services/encryption.service.ts` - Encryption service implementation

---

**Rotation Status:** ⚠️ **MIGRATION SCRIPT READY** - Manual execution required  
**New Key Generated:** ✅ `453fe4eeaba8b55e0463ae6118c0be4bbf694704826d78a19a0c5904bc3af003`  
**Next Action:** Run migration script before updating .env

**⚠️ CRITICAL:** Do NOT update ENCRYPTION_KEY in .env until migration script completes successfully!





