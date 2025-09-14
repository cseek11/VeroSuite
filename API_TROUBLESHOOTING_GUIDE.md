# API Troubleshooting Guide

## Customer Loading Issues

### Problem: AgreementForm not loading customers
**Date Fixed:** 2025-01-14

**Symptoms:**
- Customer search field shows "No customers available"
- No errors in console
- Other pages (CustomersPage, WorkOrders) load customers fine

**Root Cause:**
The AgreementForm was using `accountsApi.getAccounts()` which has authentication issues, while working pages use `secureApiClient.getAllAccounts()`.

**Solution:**
1. **Change API Client:**
   ```typescript
   // ❌ Wrong - doesn't work
   import { accountsApi } from '@/lib/accounts-api';
   queryFn: () => accountsApi.getAccounts({ page: 1, limit: 1000 })

   // ✅ Correct - works
   import { secureApiClient } from '@/lib/secure-api-client';
   queryFn: () => secureApiClient.getAllAccounts()
   ```

2. **Fix Data Structure:**
   ```typescript
   // ❌ Wrong - accountsApi returns { accounts: [...] }
   customers={customers?.accounts || []}

   // ✅ Correct - secureApiClient returns array directly
   customers={customers || []}
   ```

**Why This Works:**
- `secureApiClient` uses proper authentication through auth service
- `secureApiClient` handles token exchange automatically
- `secureApiClient` is what all working pages use (CustomersPage, V4Dashboard, etc.)

## API Client Usage Guidelines

### Use `secureApiClient` for:
- ✅ Customer/Account operations
- ✅ All authenticated API calls
- ✅ Any operation that needs proper JWT authentication

### Use specific API clients only for:
- ✅ Service-specific operations (agreements, service-types)
- ✅ When you need specific response formatting
- ✅ Legacy compatibility (but prefer secureApiClient)

## Common Authentication Issues

### Problem: "No valid authorization token provided"
**Solution:** Use `secureApiClient` instead of direct API calls

### Problem: 401 Unauthorized errors
**Solution:** Ensure using `secureApiClient` which handles token exchange automatically

### Problem: Data structure mismatches
**Solution:** Check if API returns array directly or wrapped in object property

## Debug Checklist

When customer loading fails:
1. ✅ Check if using `secureApiClient.getAllAccounts()`
2. ✅ Verify data structure (array vs object with 'accounts' property)
3. ✅ Check browser console for authentication errors
4. ✅ Compare with working pages (CustomersPage, V4Dashboard)
5. ✅ Verify backend is running and accessible

## Future Prevention

- Always use `secureApiClient` for customer/account operations
- Test customer loading in any new forms that need customer selection
- Document API client choices in component comments
- Use consistent data structure handling across components
