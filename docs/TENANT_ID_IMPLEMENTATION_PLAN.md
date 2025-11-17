# Tenant ID Resolution Implementation Plan

**Objective:** Replace hardcoded tenant ID with proper tenant resolution from user authentication

---

## 📊 **CURRENT STATE ANALYSIS**

### **✅ What's Working**
- Authentication system is functional
- User metadata contains `tenant_id` field
- Auth store has `tenantId` field
- All API calls use `getTenantId()` function

### **❌ Current Problem**
- `getTenantId()` function is hardcoded to test tenant: `7193113e-ece2-4f7b-ae8c-176df4367e28`
- No proper tenant resolution from user authentication
- User's actual tenant ID is not being used

---

## 🎯 **IMPLEMENTATION PLAN**

### **Phase 1: Authentication Enhancement** 🔧

#### **Step 1.1: Update Auth Store**
**File:** `frontend/src/stores/auth.ts`

**Changes:**
```typescript
// Add tenant resolution logic
const resolveTenantId = (user: any): string | null => {
  // Try multiple sources for tenant ID
  return user?.user_metadata?.tenant_id || 
         user?.app_metadata?.tenant_id || 
         null;
};

// Update setAuth function
setAuth: ({ token, user }) => {
  if (!token || !user) {
    console.error('setAuth: Missing required fields');
    return;
  }
  
  const tenantId = resolveTenantId(user);
  if (!tenantId) {
    console.warn('No tenant ID found in user metadata');
  }
  
  localStorage.setItem('verofield_auth', JSON.stringify({ token, tenantId, user }));
  set({ token, tenantId, user });
}
```

#### **Step 1.2: Update Login Hook**
**File:** `frontend/src/hooks/useAuth.ts`

**Changes:**
```typescript
// Remove hardcoded tenantId from login
export const useLogin = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  
  return useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      const result = await authApi.signIn(credentials.email, credentials.password);
      return result; // Remove tenantId from here
    },
    onSuccess: (data) => {
      setAuth({ 
        token: data.access_token, 
        user: data.user 
        // tenantId will be resolved from user metadata
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
  });
};
```

### **Phase 2: API Client Enhancement** 🔧

#### **Step 2.1: Update getTenantId Function**
**File:** `frontend/src/lib/enhanced-api.ts`

**Changes:**
```typescript
const getTenantId = async (): Promise<string> => {
  try {
    // First, try to get from auth store
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Try to get tenant ID from user metadata
      const tenantId = user.user_metadata?.tenant_id || user.app_metadata?.tenant_id;
      
      if (tenantId) {
        console.log('Using tenant ID from user metadata:', tenantId);
        return tenantId;
      }
    }
    
    // Fallback: try to get from auth store
    const authStore = useAuthStore.getState();
    if (authStore.tenantId) {
      console.log('Using tenant ID from auth store:', authStore.tenantId);
      return authStore.tenantId;
    }
    
    // Final fallback: use test tenant (for development only)
    const testTenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28';
    console.warn('No tenant ID found, using test tenant:', testTenantId);
    return testTenantId;
    
  } catch (error) {
    console.error('Error resolving tenant ID:', error);
    // Fallback to test tenant
    return '7193113e-ece2-4f7b-ae8c-176df4367e28';
  }
};
```

#### **Step 2.2: Add Tenant Validation**
**File:** `frontend/src/lib/enhanced-api.ts`

**Changes:**
```typescript
// Add tenant validation function
const validateTenantAccess = async (tenantId: string): Promise<boolean> => {
  try {
    // Check if user has access to this tenant
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const userTenantId = user.user_metadata?.tenant_id || user.app_metadata?.tenant_id;
    return userTenantId === tenantId;
  } catch (error) {
    console.error('Error validating tenant access:', error);
    return false;
  }
};

// Update getTenantId to include validation
const getTenantId = async (): Promise<string> => {
  // ... existing logic ...
  
  // Add validation
  const hasAccess = await validateTenantAccess(tenantId);
  if (!hasAccess) {
    console.error('User does not have access to tenant:', tenantId);
    throw new Error('Access denied to tenant');
  }
  
  return tenantId;
};
```

### **Phase 3: Search Service Enhancement** 🔧

#### **Step 3.1: Update Search Service**
**File:** `frontend/src/lib/search-service.ts`

**Changes:**
```typescript
// Replace hardcoded getTenantId with proper resolution
const getTenantId = async (): Promise<string> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const tenantId = user.user_metadata?.tenant_id || user.app_metadata?.tenant_id;
      if (tenantId) {
        console.log('Search service using tenant ID:', tenantId);
        return tenantId;
      }
    }
    
    // Fallback to auth store
    const authStore = useAuthStore.getState();
    if (authStore.tenantId) {
      return authStore.tenantId;
    }
    
    // Development fallback
    console.warn('Using test tenant for search');
    return '7193113e-ece2-4f7b-ae8c-176df4367e28';
  } catch (error) {
    console.error('Error getting tenant ID for search:', error);
    return '7193113e-ece2-4f7b-ae8c-176df4367e28';
  }
};
```

### **Phase 4: Database Schema Verification** 🔧

#### **Step 4.1: Verify User Metadata Structure**
**SQL Query to run in Supabase:**
```sql
-- Check if users have tenant_id in metadata
SELECT 
  id,
  email,
  raw_user_meta_data,
  raw_app_meta_data
FROM auth.users 
WHERE raw_user_meta_data->>'tenant_id' IS NOT NULL
LIMIT 5;
```

#### **Step 4.2: Add Tenant ID to User Metadata (if needed)**
**SQL Script:**
```sql
-- Update existing users with tenant ID if missing
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || 
    jsonb_build_object('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
WHERE raw_user_meta_data->>'tenant_id' IS NULL;
```

### **Phase 5: Testing & Validation** 🧪

#### **Step 5.1: Create Test Script**
**File:** `frontend/scripts/test-tenant-resolution.js`

```javascript
import { createClient } from '@supabase/supabase-js';
import { useAuthStore } from '../src/stores/auth';

const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testTenantResolution() {
  console.log('🧪 Testing Tenant ID Resolution...\n');
  
  // Test 1: Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.log('❌ User error:', userError.message);
    return;
  }
  
  console.log('✅ User authenticated:', user.email);
  console.log('   User metadata:', user.user_metadata);
  console.log('   App metadata:', user.app_metadata);
  
  // Test 2: Extract tenant ID
  const tenantId = user.user_metadata?.tenant_id || user.app_metadata?.tenant_id;
  console.log('   Tenant ID:', tenantId || 'NOT FOUND');
  
  // Test 3: Test API call
  if (tenantId) {
    const { data: customers, error: customerError } = await supabase
      .from('accounts')
      .select('id, name, email')
      .eq('tenant_id', tenantId)
      .limit(3);
    
    if (customerError) {
      console.log('❌ Customer fetch error:', customerError.message);
    } else {
      console.log('✅ Customers found:', customers?.length || 0);
      customers?.forEach(c => console.log(`   - ${c.name} (${c.email})`));
    }
  }
}

testTenantResolution();
```

#### **Step 5.2: Update Existing Test Scripts**
**File:** `frontend/scripts/test-real-search.js`

**Changes:**
```javascript
// Replace hardcoded tenant ID with dynamic resolution
const getTenantId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.user_metadata?.tenant_id || '7193113e-ece2-4f7b-ae8c-176df4367e28';
};

// Update test function
async function testRealSearch() {
  const tenantId = await getTenantId();
  console.log('Using tenant ID:', tenantId);
  // ... rest of test
}
```

---

## 📋 **IMPLEMENTATION STEPS**

### **🔴 IMMEDIATE (Today)**

1. **Update Auth Store** (`frontend/src/stores/auth.ts`)
   - Add tenant resolution logic
   - Update setAuth function

2. **Update Login Hook** (`frontend/src/hooks/useAuth.ts`)
   - Remove hardcoded tenantId
   - Let tenant be resolved from user metadata

3. **Test Authentication**
   - Verify login still works
   - Check tenant ID is properly stored

### **🟡 SHORT-TERM (This Week)**

4. **Update API Client** (`frontend/src/lib/enhanced-api.ts`)
   - Replace hardcoded getTenantId
   - Add tenant validation
   - Add error handling

5. **Update Search Service** (`frontend/src/lib/search-service.ts`)
   - Replace hardcoded getTenantId
   - Add proper error handling

6. **Database Verification**
   - Check user metadata structure
   - Add tenant_id if missing

### **🟢 LONG-TERM (Next Week)**

7. **Comprehensive Testing**
   - Create test scripts
   - Test all API endpoints
   - Verify multi-tenant isolation

8. **Error Handling Enhancement**
   - Add user-friendly error messages
   - Add tenant access validation
   - Add fallback mechanisms

---

## 🚨 **RISK MITIGATION**

### **Backup Strategy**
- Keep hardcoded tenant as fallback
- Add comprehensive error logging
- Test thoroughly before removing fallback

### **Rollback Plan**
- Git commits for each step
- Ability to revert to hardcoded tenant
- Feature flags for gradual rollout

---

## ✅ **SUCCESS CRITERIA**

1. **Authentication**: Login works with proper tenant resolution
2. **API Calls**: All API calls use user's actual tenant ID
3. **Search**: Search functionality works with proper tenant
4. **Isolation**: Users only see their tenant's data
5. **Fallback**: System gracefully handles missing tenant ID
6. **Performance**: No significant performance impact

---

## 📞 **SUPPORT & RESOURCES**

### **Files to Modify**
- `frontend/src/stores/auth.ts`
- `frontend/src/hooks/useAuth.ts`
- `frontend/src/lib/enhanced-api.ts`
- `frontend/src/lib/search-service.ts`

### **Test Files**
- `frontend/scripts/test-tenant-resolution.js`
- `frontend/scripts/test-real-search.js`

### **Database Scripts**
- SQL queries to verify user metadata
- SQL scripts to add tenant_id if needed

**Estimated Time:** 2-3 days  
**Priority:** High  
**Risk Level:** Medium (with fallback)







































