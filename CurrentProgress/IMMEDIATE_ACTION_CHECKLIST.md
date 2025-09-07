# 🚨 IMMEDIATE ACTION CHECKLIST - VeroSuite CRM Security

**CRITICAL: These actions must be completed within 48 hours to secure the system**

---

## 🚨 P0 - CRITICAL SECURITY ISSUES (Next 24-48 Hours)

### ✅ Step 1: Rotate All Exposed Secrets (IMMEDIATE - Next 2 Hours)

#### Supabase Secrets Rotation
1. **Login to Supabase Dashboard**: https://app.supabase.com
2. **Navigate to Settings > API**
3. **Regenerate Keys:**
   - Click "Regenerate" next to Service Role Key
   - Click "Regenerate" next to Anonymous Key
   - **IMPORTANT**: Copy new keys immediately

4. **Update Environment Variables:**
   ```bash
   # Update backend/.env
   SUPABASE_SERVICE_ROLE_KEY=NEW_SERVICE_ROLE_KEY_HERE
   
   # Update frontend/.env  
   VITE_SUPABASE_ANON_KEY=NEW_ANON_KEY_HERE
   ```

#### JWT Secret Rotation
1. **Generate New JWT Secret:**
   ```bash
   # Generate a strong 256-bit secret
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

2. **Update backend/.env:**
   ```bash
   JWT_SECRET=NEW_JWT_SECRET_HERE
   ```

#### Clean Git History
1. **Remove secrets from git history:**
   ```bash
   # Navigate to project root
   cd "C:\Users\ashse\Documents\VeroPest Suite\Training\VeroSuite"
   
   # Remove .env files from history
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch backend/.env frontend/.env' \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (WARNING: This rewrites history)
   git push origin --force --all
   ```

2. **Verify .gitignore includes .env files:**
   ```bash
   # Check .gitignore contains:
   .env
   .env.local
   .env.*.local
   ```

### ✅ Step 2: Re-enable Row Level Security (Next 4 Hours)

1. **Apply RLS Policies:**
   - Open Supabase SQL Editor
   - Run the script: `CurrentProgress/001_reenable_rls_policies.sql`
   - **CRITICAL**: This fixes the major tenant isolation vulnerability

2. **Test Tenant Isolation:**
   ```sql
   -- Test 1: Set tenant A context
   SET LOCAL app.tenant_id = '7193113e-ece2-4f7b-ae8c-176df4367e28';
   SELECT COUNT(*) FROM accounts; -- Should show tenant A data only
   
   -- Test 2: Set different tenant context  
   SET LOCAL app.tenant_id = 'different-tenant-uuid';
   SELECT COUNT(*) FROM accounts; -- Should show different/no data
   ```

3. **Verify Application Still Works:**
   - Start frontend: `npm run dev`
   - Start backend: `npm run start:dev`
   - Test login and customer creation
   - **If issues occur**: Check tenant middleware is setting `app.tenant_id`

### ✅ Step 3: Fix Dependency Vulnerabilities (Next 2 Hours)

#### Frontend Dependencies
```bash
cd frontend
npm audit fix
npm audit --audit-level=high  # Verify no high/critical issues remain
```

#### Backend Dependencies  
```bash
cd backend
npm audit fix --force  # May require breaking changes
npm audit --audit-level=high  # Verify no high/critical issues remain
```

#### Test After Updates
```bash
# Frontend
cd frontend && npm run build && npm run typecheck

# Backend  
cd backend && npm run build
```

### ✅ Step 4: Verify Database Schema Fixes (Already Applied)

The UUID and timestamp default issues have been resolved by the fixes applied earlier:
- ✅ UUID generation working
- ✅ Timestamp defaults working  
- ✅ Customer creation working

**No action needed** unless you encounter database errors.

---

## ⚠️ P1 - HIGH PRIORITY (Next 1-2 Weeks)

### Authentication Enhancements
1. **Reduce JWT Expiration:**
   ```typescript
   // backend/src/auth/auth.module.ts
   JwtModule.register({
     secret: process.env.JWT_SECRET,
     signOptions: { expiresIn: '2h' }, // Changed from 24h
   })
   ```

2. **Add Rate Limiting:**
   ```typescript
   // backend/src/main.ts
   import rateLimit from 'express-rate-limit';
   
   app.use('/api/auth', rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 5 // 5 login attempts per window
   }));
   ```

### State Management Cleanup
1. **Remove Direct localStorage Access:**
   - Fix `frontend/src/components/DispatcherDashboard.tsx:41`
   - Centralize all auth state in Zustand store
   - Test auth flow thoroughly

### Testing Implementation
1. **Backend Tests (Priority):**
   - Auth module tests
   - Tenant isolation tests
   - API endpoint tests

2. **Frontend E2E Tests:**
   - Customer management flow
   - Authentication flow
   - Error handling

---

## 📋 VERIFICATION CHECKLIST

### Security Verification
- [ ] **Secrets Rotated**: All old keys deactivated, new keys working
- [ ] **RLS Enabled**: Tenant isolation verified with SQL tests  
- [ ] **Dependencies Fixed**: No high/critical vulnerabilities in `npm audit`
- [ ] **Git History Clean**: No secrets found in repository history

### Functionality Verification  
- [ ] **Login Works**: Can authenticate with new JWT secret
- [ ] **Customer Creation**: Can create customers without database errors
- [ ] **Customer Update**: Can update existing customers
- [ ] **Tenant Isolation**: Users cannot see other tenant data
- [ ] **Application Performance**: No significant slowdowns after changes

### Monitoring Setup
- [ ] **Error Tracking**: Monitor for RLS access denied errors
- [ ] **Performance**: Monitor for slow queries after index changes
- [ ] **Auth Failures**: Monitor for increased authentication failures

---

## 🆘 EMERGENCY CONTACTS & ROLLBACK

### If Issues Occur After Changes:

#### Rollback RLS (Emergency Only)
```sql
-- ONLY use if application completely breaks
ALTER TABLE accounts DISABLE ROW LEVEL SECURITY;
-- (Apply to other tables as needed)
```

#### Rollback Dependencies
```bash
# Revert to previous package-lock.json
git checkout HEAD~1 -- package-lock.json
npm ci
```

#### Check Application Logs
```bash
# Backend logs
npm run start:dev  # Check console for errors

# Frontend logs  
npm run dev  # Check browser console
```

### Support Resources
- **Supabase Documentation**: https://supabase.com/docs/guides/auth/row-level-security
- **NestJS Security**: https://docs.nestjs.com/security/authentication
- **Database Issues**: Check `backend/prisma/schema.prisma` for schema reference

---

## 📊 PROGRESS TRACKING

### Day 1 (Today)
- [ ] Secrets rotated (2 hours)
- [ ] RLS policies applied (4 hours)  
- [ ] Dependencies updated (2 hours)
- [ ] Basic functionality verified (2 hours)

### Day 2 (Tomorrow)
- [ ] Comprehensive testing of all features
- [ ] Performance monitoring after index changes
- [ ] Documentation of new security procedures
- [ ] Team briefing on security changes

### Week 1 
- [ ] Authentication enhancements implemented
- [ ] Rate limiting deployed
- [ ] State management refactored
- [ ] Basic test suite implemented

---

**⚠️ CRITICAL REMINDER**: Do NOT deploy to production until ALL P0 issues are resolved and thoroughly tested. The current system has serious security vulnerabilities that must be fixed first.

**📞 ESCALATION**: If any P0 fixes fail or break the application, immediately escalate to senior engineering team and consider reverting changes to maintain system availability while investigating.


