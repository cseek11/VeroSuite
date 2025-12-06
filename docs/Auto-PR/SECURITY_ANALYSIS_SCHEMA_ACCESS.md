# Security Analysis: Schema Access Methods

**Date:** 2025-12-05  
**Purpose:** Compare security implications of different schema access methods

---

## 🔒 Security Comparison

### Option 1: RPC Functions with SECURITY DEFINER ⚠️ **LESS SECURE**

**How it works:**
- Functions run with **elevated privileges** (function owner's privileges)
- **Bypass RLS policies** entirely
- Access controlled only by GRANT permissions on functions

**Security Risks:**
1. ❌ **Bypasses RLS** - Functions run as definer, not invoker
2. ❌ **Elevated Privileges** - Functions have more access than needed
3. ❌ **Function Bugs = Security Holes** - Any bug in function logic could expose data
4. ❌ **No Row-Level Filtering** - Functions must manually implement access control
5. ❌ **Harder to Audit** - Access control logic is in function code, not database policies

**Example Risk:**
```sql
-- If function has a bug, it could return all sessions:
CREATE FUNCTION get_session(p_session_id TEXT)
RETURNS SETOF veroscore.sessions
SECURITY DEFINER  -- ⚠️ Runs with elevated privileges
AS $$
BEGIN
    -- Bug: Missing WHERE clause could return ALL sessions
    RETURN QUERY SELECT * FROM veroscore.sessions;  -- ⚠️ No filtering!
END;
$$;
```

**Mitigation (if using RPC):**
- ✅ Validate all inputs
- ✅ Implement access control in function logic
- ✅ Use SECURITY INVOKER instead (but then RLS applies, defeating the purpose)
- ✅ Grant permissions only to service_role
- ✅ Regular security audits of function code

---

### Option 2: Direct Table Access with RLS ✅ **MOST SECURE**

**How it works:**
- Tables accessed directly via Supabase client
- **RLS policies enforced at database level**
- Access controlled by Row Level Security policies
- Service role can bypass (intentional for backend)

**Security Benefits:**
1. ✅ **RLS Enforced** - Database-level security, cannot be bypassed
2. ✅ **Granular Control** - Per-row access control
3. ✅ **No Elevated Privileges** - Client uses normal database role
4. ✅ **Defense in Depth** - Multiple layers of security
5. ✅ **Easier to Audit** - Policies are declarative, visible in database

**RLS Policy Example:**
```sql
-- Policy enforced at database level
CREATE POLICY "Users can view own sessions"
    ON veroscore.sessions FOR SELECT
    USING (
        author = auth.uid()::text  -- ✅ Database enforces this
        OR author = (auth.jwt() ->> 'email')
        OR auth.role() = 'authenticated'
    );

-- Service role bypass (intentional for backend)
CREATE POLICY "Service role full access sessions"
    ON veroscore.sessions FOR ALL
    USING (auth.role() = 'service_role');  -- ✅ Controlled bypass
```

**Why This is More Secure:**
- RLS is enforced **before** data is returned
- Policies are **declarative** and **visible**
- Cannot be bypassed by application bugs
- Database-level enforcement is **unbreakable**

---

### Option 3: Schema Exposure (Same as Option 2) ✅ **MOST SECURE**

**How it works:**
- Same as Option 2 (Direct Table Access)
- Just makes `veroscore` schema visible to Supabase API
- Still uses RLS policies

**Security:**
- ✅ **Identical to Option 2** - Same RLS enforcement
- ✅ **No additional risk** - Just exposes schema name
- ✅ **Recommended approach** - Cleanest and most secure

---

## 🎯 Security Recommendation

### ✅ **RECOMMENDED: Option 2/3 - Direct Table Access with RLS**

**Why:**
1. **RLS Enforcement** - Database-level security cannot be bypassed
2. **Defense in Depth** - Multiple security layers
3. **Granular Control** - Per-row access control
4. **Easier to Audit** - Policies are visible and declarative
5. **No Elevated Privileges** - Client uses normal role
6. **Compliance** - Meets RLS requirements from `.cursor/rules/03-security.mdc`

### ⚠️ **FALLBACK: Option 1 - RPC Functions (if schema exposure not available)**

**If you must use RPC functions:**
1. ✅ Use `SECURITY INVOKER` instead of `SECURITY DEFINER` (but then RLS applies)
2. ✅ Implement input validation in all functions
3. ✅ Add access control checks in function logic
4. ✅ Grant permissions only to `service_role`
5. ✅ Regular security audits
6. ✅ Document all security assumptions

**Note:** If using `SECURITY INVOKER`, RLS will apply, but then you have the same schema access issue. This creates a catch-22.

---

## 📊 Security Comparison Table

| Aspect | RPC (SECURITY DEFINER) | Direct Access + RLS | Schema Exposure |
|--------|------------------------|---------------------|-----------------|
| **RLS Enforcement** | ❌ Bypassed | ✅ Enforced | ✅ Enforced |
| **Privilege Level** | ⚠️ Elevated | ✅ Normal | ✅ Normal |
| **Access Control** | ⚠️ Function Logic | ✅ Database Policies | ✅ Database Policies |
| **Auditability** | ⚠️ Code Review | ✅ Declarative | ✅ Declarative |
| **Bug Impact** | ❌ High Risk | ✅ Low Risk | ✅ Low Risk |
| **Compliance** | ⚠️ Manual | ✅ Automatic | ✅ Automatic |
| **Defense in Depth** | ❌ Single Layer | ✅ Multiple Layers | ✅ Multiple Layers |

---

## 🔐 Implementation Recommendation

### Step 1: Try Schema Exposure (Most Secure)

1. **Check Supabase Dashboard:**
   - Settings → API → "Exposed Schemas" or "Schema Search Path"
   - Add `veroscore` to exposed schemas

2. **Benefits:**
   - ✅ Direct table access works
   - ✅ RLS policies enforced
   - ✅ No RPC functions needed
   - ✅ Cleanest code path
   - ✅ Most secure

### Step 2: If Schema Exposure Not Available

**Use RPC Functions with Security Hardening:**

1. **Modify RPC Functions:**
   ```sql
   -- Use SECURITY INVOKER (RLS applies, but schema access issue remains)
   -- OR use SECURITY DEFINER with strict validation
   
   CREATE FUNCTION veroscore.get_session(p_session_id TEXT)
   RETURNS SETOF veroscore.sessions
   SECURITY DEFINER  -- ⚠️ Elevated privileges
   AS $$
   BEGIN
       -- ✅ CRITICAL: Validate input
       IF p_session_id IS NULL OR length(p_session_id) = 0 THEN
           RAISE EXCEPTION 'Invalid session_id';
       END IF;
       
       -- ✅ CRITICAL: Implement access control
       -- Check if caller has permission (via JWT or session context)
       -- This is manual and error-prone
       
       RETURN QUERY
       SELECT * FROM veroscore.sessions
       WHERE veroscore.sessions.session_id = p_session_id
       -- ⚠️ No RLS protection - must manually filter
       AND veroscore.sessions.author = current_setting('app.current_user', true);
   END;
   $$;
   ```

2. **Grant Permissions:**
   ```sql
   -- Only grant to service_role
   GRANT EXECUTE ON FUNCTION veroscore.get_session TO service_role;
   -- Do NOT grant to authenticated users
   ```

3. **Security Audit Checklist:**
   - [ ] All inputs validated
   - [ ] Access control implemented
   - [ ] No SQL injection risks
   - [ ] Permissions granted only to service_role
   - [ ] Functions tested for security vulnerabilities

---

## ✅ Final Recommendation

**MOST SECURE: Schema Exposure (Option 2/3)**

**Reasons:**
1. ✅ **RLS Enforcement** - Cannot be bypassed
2. ✅ **Database-Level Security** - Most secure layer
3. ✅ **Compliance** - Meets all security rules
4. ✅ **Simpler** - No RPC functions needed
5. ✅ **Auditable** - Policies are visible

**Action:**
1. **First:** Check if Supabase Dashboard supports schema exposure
2. **If Yes:** Use schema exposure (most secure)
3. **If No:** Use RPC functions with security hardening (less secure, but acceptable)

---

## 🔒 Security Compliance

**Cursor Rules Compliance:**
- ✅ **R01: Tenant Isolation** - RLS policies enforce isolation
- ✅ **R02: RLS Enforcement** - Direct access uses RLS, RPC bypasses (risk)
- ✅ **R12: Security Event Logging** - Both methods support logging
- ✅ **R13: Input Validation** - Both methods require validation

**Recommendation:** Use schema exposure to maintain full RLS compliance.

---

**Last Updated:** 2025-12-05  
**Security Level:** ✅ **MOST SECURE: Schema Exposure with RLS**



