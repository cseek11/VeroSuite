# Week 2-3: Error Evaluation Report

**Date:** 2025-11-16  
**Phase:** Week 2-3 - Payment Processing UI  
**Status:** ⚠️ **API Errors Identified**

---

## Error Summary

### 1. API Error: Failed to fetch invoices
**Error:** `Failed to fetch invoices: Bad Request`  
**Location:** `CustomerPaymentPortal.tsx:46`  
**API Call:** `billing.getInvoices(customerId)`  
**HTTP Status:** 400 (Bad Request)

### 2. API Error: Failed to fetch payment methods
**Error:** `Failed to fetch payment methods: Bad Request`  
**Location:** `CustomerPaymentPortal.tsx:53`  
**API Call:** `billing.getPaymentMethods(customerId)`  
**HTTP Status:** 400 (Bad Request)

### 3. Web Vital Performance Warning
**Error:** `Web Vital exceeds error threshold`  
**Location:** `logger.ts:79` (CardSystem)  
**Type:** Performance monitoring warning

---

## Root Cause Analysis

### API Errors (Primary Issue)

**Problem:**
- API calls to `getInvoices(customerId)` and `getPaymentMethods(customerId)` are returning 400 Bad Request
- The errors are being logged but not handled gracefully in the UI
- No user-friendly error messages are displayed

**Possible Causes:**
1. **Backend API Issue:**
   - Backend endpoint might not accept `accountId` query parameter
   - Backend might require different parameter name (e.g., `customerId` instead of `accountId`)
   - Backend might require additional parameters (e.g., `tenantId`)
   - Backend validation might be rejecting the `accountId` format

2. **Parameter Mismatch:**
   - Frontend passes `customerId` to API functions
   - API functions expect `accountId?: string`
   - The parameter name might be correct, but the value format might be wrong

3. **Missing Error Handling:**
   - `useQuery` calls in `CustomerPaymentPortal.tsx` don't have `onError` handlers
   - Errors are logged but not displayed to users
   - Component continues to render with empty data arrays

4. **Backend Endpoint Not Implemented:**
   - The billing endpoints might not be fully implemented on the backend
   - Endpoints might exist but don't handle the `accountId` parameter correctly

---

## Error Details

### Error 1: getInvoices API Call

**Code Location:**
```typescript
// CustomerPaymentPortal.tsx:46
const { data: invoices = [] } = useQuery({
  queryKey: ['billing', 'invoices', customerId],
  queryFn: () => billing.getInvoices(customerId),
  enabled: !!customerId,
});
```

**API Implementation:**
```typescript
// enhanced-api.ts:2033
getInvoices: async (accountId?: string, status?: string): Promise<Invoice[]> => {
  // ...
  const params = new URLSearchParams();
  if (accountId) params.append('accountId', accountId);
  // ...
  const response = await fetch(`http://localhost:3001/api/v1/billing/invoices?${params.toString()}`, {
    // ...
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch invoices: ${response.statusText}`);
  }
}
```

**Issue:**
- API call fails with 400 Bad Request
- No error handling in `useQuery`
- User sees empty invoice list without knowing why

### Error 2: getPaymentMethods API Call

**Code Location:**
```typescript
// CustomerPaymentPortal.tsx:53
const { data: paymentMethods = [] } = useQuery({
  queryKey: ['billing', 'payment-methods', customerId],
  queryFn: () => billing.getPaymentMethods(customerId),
  enabled: !!customerId,
});
```

**API Implementation:**
```typescript
// enhanced-api.ts:2287
getPaymentMethods: async (accountId?: string): Promise<PaymentMethod[]> => {
  // ...
  const params = new URLSearchParams();
  if (accountId) params.append('accountId', accountId);
  // ...
  const response = await fetch(`http://localhost:3001/api/v1/billing/payment-methods?${params.toString()}`, {
    // ...
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch payment methods: ${response.statusText}`);
  }
}
```

**Issue:**
- API call fails with 400 Bad Request
- No error handling in `useQuery`
- User sees empty payment methods list without knowing why

---

## Impact Assessment

### User Experience Impact: ⚠️ **HIGH**
- Users cannot see invoices in the Customer Payment Portal
- Users cannot see payment methods
- No error messages inform users of the issue
- Portal appears broken/empty

### Functional Impact: ⚠️ **HIGH**
- Core functionality (viewing invoices, payment methods) is broken
- Payment processing cannot proceed without payment methods
- Invoice selection and payment flow is blocked

### Technical Impact: ⚠️ **MEDIUM**
- Errors are logged correctly (good)
- No graceful degradation
- No user feedback
- Component renders with empty data

---

## Recommended Fixes

### Fix 1: Add Error Handling to useQuery Calls (IMMEDIATE)

**Priority:** 🔴 **CRITICAL**

Add `onError` handlers to both `useQuery` calls in `CustomerPaymentPortal.tsx`:

```typescript
const { data: invoices = [], error: invoicesError, isLoading: invoicesLoading } = useQuery({
  queryKey: ['billing', 'invoices', customerId],
  queryFn: () => billing.getInvoices(customerId),
  enabled: !!customerId,
  onError: (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load invoices';
    logger.error('Failed to fetch customer invoices', error, 'CustomerPaymentPortal');
    toast.error(`Unable to load invoices. ${errorMessage}. Please try again or contact support.`);
  },
});

const { data: paymentMethods = [], error: paymentMethodsError, isLoading: paymentMethodsLoading } = useQuery({
  queryKey: ['billing', 'payment-methods', customerId],
  queryFn: () => billing.getPaymentMethods(customerId),
  enabled: !!customerId,
  onError: (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load payment methods';
    logger.error('Failed to fetch payment methods', error, 'CustomerPaymentPortal');
    toast.error(`Unable to load payment methods. ${errorMessage}. Please try again or contact support.`);
  },
});
```

### Fix 2: Add Error UI States (IMMEDIATE)

**Priority:** 🔴 **CRITICAL**

Display error messages in the UI when API calls fail:

```typescript
// In CustomerPaymentPortal component
{invoicesError && (
  <Card className="bg-red-50 border-red-200">
    <div className="p-4">
      <Text className="text-red-800">
        Failed to load invoices. Please try refreshing the page or contact support.
      </Text>
    </div>
  </Card>
)}

{paymentMethodsError && (
  <Card className="bg-red-50 border-red-200">
    <div className="p-4">
      <Text className="text-red-800">
        Failed to load payment methods. Please try refreshing the page or contact support.
      </Text>
    </div>
  </Card>
)}
```

### Fix 3: Investigate Backend API (HIGH PRIORITY)

**Priority:** 🟡 **HIGH**

1. **Check Backend Endpoint Implementation:**
   - Verify `/api/v1/billing/invoices` endpoint exists
   - Verify `/api/v1/billing/payment-methods` endpoint exists
   - Check if endpoints accept `accountId` query parameter
   - Check if endpoints require `tenantId` or other parameters

2. **Check Parameter Validation:**
   - Verify `accountId` format validation on backend
   - Check if backend expects `customerId` instead of `accountId`
   - Verify backend RLS policies allow access

3. **Test API Endpoints Directly:**
   - Test with Postman/curl
   - Verify authentication token is valid
   - Check response format

### Fix 4: Add Retry Logic (MEDIUM PRIORITY)

**Priority:** 🟢 **MEDIUM**

Add retry logic to `useQuery` calls:

```typescript
const { data: invoices = [] } = useQuery({
  queryKey: ['billing', 'invoices', customerId],
  queryFn: () => billing.getInvoices(customerId),
  enabled: !!customerId,
  retry: 2,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  onError: (error: unknown) => {
    // ... error handling
  },
});
```

### Fix 5: Improve API Error Messages (MEDIUM PRIORITY)

**Priority:** 🟢 **MEDIUM**

Enhance `handleApiError` in `enhanced-api.ts` to provide more detailed error messages:

```typescript
if (!response.ok) {
  let errorMessage = `Failed to fetch invoices: ${response.statusText}`;
  try {
    const errorData = await response.json();
    if (errorData.message) {
      errorMessage = `Failed to fetch invoices: ${errorData.message}`;
    }
  } catch {
    // Use default error message
  }
  throw new Error(errorMessage);
}
```

---

## Immediate Action Plan

### Step 1: Add Error Handling (NOW)
- ✅ Add `onError` handlers to both `useQuery` calls
- ✅ Add error state variables
- ✅ Display error messages in UI

### Step 2: Test Error Handling (NOW)
- ✅ Verify error messages display correctly
- ✅ Verify toast notifications show
- ✅ Verify logging works

### Step 3: Investigate Backend (NEXT)
- ⚠️ Check backend API endpoint implementation
- ⚠️ Verify parameter names and formats
- ⚠️ Test API endpoints directly

### Step 4: Fix Backend Issues (IF NEEDED)
- ⚠️ Update backend endpoints if needed
- ⚠️ Fix parameter validation if needed
- ⚠️ Add missing parameters if needed

---

## Error Pattern Documentation

This error should be documented in `docs/error-patterns.md` as:

**Pattern:** `API_BAD_REQUEST_400` - API calls returning 400 Bad Request without proper error handling

**Prevention:**
- Always add `onError` handlers to `useQuery` calls
- Always display error messages to users
- Always log errors with context
- Always test API endpoints directly
- Always verify parameter names and formats

---

## Status

**Current Status:** ⚠️ **ERRORS IDENTIFIED - FIXES NEEDED**

**Next Steps:**
1. Add error handling to `CustomerPaymentPortal.tsx` (IMMEDIATE)
2. Add error UI states (IMMEDIATE)
3. Investigate backend API issues (HIGH PRIORITY)
4. Document error pattern (MEDIUM PRIORITY)

---

**Report Created:** 2025-11-16  
**Status:** Active



