# Week 2-3: Backend API Investigation Report

**Date:** 2025-11-16  
**Phase:** Week 2-3 - Payment Processing UI  
**Status:** ⚠️ **ISSUES IDENTIFIED**

---

## Investigation Summary

### API Endpoints Analyzed

1. **GET `/api/v1/billing/invoices`**
   - **Controller:** `backend/src/billing/billing.controller.ts:56`
   - **Service:** `backend/src/billing/billing.service.ts:146`
   - **Query Parameters:** `accountId?`, `status?`
   - **Authentication:** ✅ Required (`@UseGuards(JwtAuthGuard)`)
   - **Tenant Isolation:** ✅ Uses `req.user.tenantId`

2. **GET `/api/v1/billing/payment-methods`**
   - **Controller:** `backend/src/billing/billing.controller.ts:150`
   - **Service:** `backend/src/billing/billing.service.ts:525`
   - **Query Parameters:** `accountId?`
   - **Authentication:** ✅ Required (`@UseGuards(JwtAuthGuard)`)
   - **Tenant Isolation:** ⚠️ **POTENTIAL ISSUE** (see below)

---

## Issues Identified

### Issue 1: Missing Request Context in getPaymentMethods ⚠️

**Location:** `backend/src/billing/billing.controller.ts:155`

**Problem:**
The `getPaymentMethods` endpoint doesn't extract `req.user.tenantId` from the request, unlike `getInvoices` which does.

**Current Code:**
```typescript
@Get('payment-methods')
async getPaymentMethods(@Query('accountId') accountId?: string): Promise<PaymentMethodResponseDto[]> {
  return this.billingService.getPaymentMethods(accountId);
}
```

**Comparison with getInvoices:**
```typescript
@Get('invoices')
async getInvoices(
  @Request() req: any,
  @Query('accountId') accountId?: string,
  @Query('status') status?: InvoiceStatus
): Promise<InvoiceResponseDto[]> {
  return this.billingService.getInvoices(accountId, status, req.user.tenantId);
}
```

**Impact:**
- The service method `getPaymentMethods` calls `await this.getCurrentTenantId()` internally
- This might fail if tenant context is not properly set
- Could cause 400 Bad Request if tenant validation fails

**Recommendation:**
Update `getPaymentMethods` to extract tenantId from request, similar to `getInvoices`:

```typescript
@Get('payment-methods')
async getPaymentMethods(
  @Request() req: any,
  @Query('accountId') accountId?: string
): Promise<PaymentMethodResponseDto[]> {
  return this.billingService.getPaymentMethods(accountId, req.user.tenantId);
}
```

And update the service method signature:
```typescript
async getPaymentMethods(accountId?: string, tenantId?: string): Promise<PaymentMethodResponseDto[]>
```

---

### Issue 2: Authentication Token Validation

**Status:** ⚠️ **NEEDS VERIFICATION**

**Potential Issues:**
1. JWT token might not be properly formatted
2. Token might be expired
3. Token might not include `tenantId` in payload
4. `JwtAuthGuard` might be rejecting the token

**Investigation Steps:**
1. Check if token is being sent correctly in Authorization header
2. Verify token payload includes `tenantId`
3. Check backend logs for authentication errors
4. Verify JWT secret is correct

---

### Issue 3: AccountId Format Validation

**Status:** ⚠️ **NEEDS VERIFICATION**

**Potential Issues:**
1. `accountId` format might not match database schema
2. Database might expect UUID format
3. `accountId` might need to be validated before querying

**Investigation Steps:**
1. Check database schema for `account_id` column type
2. Verify `accountId` format in frontend matches backend expectations
3. Check if Prisma validation is rejecting the format

---

## Backend Code Analysis

### getInvoices Endpoint

**Controller:**
```typescript
@Get('invoices')
@ApiQuery({ name: 'accountId', required: false })
@ApiQuery({ name: 'status', required: false })
async getInvoices(
  @Request() req: any,
  @Query('accountId') accountId?: string,
  @Query('status') status?: InvoiceStatus
): Promise<InvoiceResponseDto[]> {
  return this.billingService.getInvoices(accountId, status, req.user.tenantId);
}
```

**Service:**
```typescript
async getInvoices(accountId?: string, status?: InvoiceStatus, tenantId?: string): Promise<InvoiceResponseDto[]> {
  const where: any = {
    tenant_id: tenantId || await this.getCurrentTenantId(),
  };
  
  if (accountId) {
    where.account_id = accountId;
  }
  
  if (status) {
    where.status = status;
  }
  
  const invoices = await this.databaseService.invoice.findMany({ where, ... });
}
```

**Status:** ✅ **CORRECT** - Properly extracts tenantId from request

---

### getPaymentMethods Endpoint

**Controller:**
```typescript
@Get('payment-methods')
@ApiQuery({ name: 'accountId', required: false })
async getPaymentMethods(@Query('accountId') accountId?: string): Promise<PaymentMethodResponseDto[]> {
  return this.billingService.getPaymentMethods(accountId);
}
```

**Service:**
```typescript
async getPaymentMethods(accountId?: string): Promise<PaymentMethodResponseDto[]> {
  const where: any = {
    tenant_id: await this.getCurrentTenantId(),
    is_active: true,
  };
  
  if (accountId) {
    where.account_id = accountId;
  }
  
  const paymentMethods = await this.databaseService.paymentMethod.findMany({ where, ... });
}
```

**Status:** ⚠️ **INCONSISTENT** - Doesn't extract tenantId from request, relies on `getCurrentTenantId()`

---

## Recommended Fixes

### Fix 1: Update getPaymentMethods Controller (HIGH PRIORITY)

**File:** `backend/src/billing/billing.controller.ts`

**Change:**
```typescript
@Get('payment-methods')
@ApiOperation({ summary: 'Get all payment methods' })
@ApiQuery({ name: 'accountId', required: false, description: 'Filter by account ID' })
@ApiResponse({ status: 200, description: 'Payment methods retrieved successfully', type: [PaymentMethodResponseDto] })
@ApiResponse({ status: 401, description: 'Unauthorized' })
async getPaymentMethods(
  @Request() req: any,
  @Query('accountId') accountId?: string
): Promise<PaymentMethodResponseDto[]> {
  return this.billingService.getPaymentMethods(accountId, req.user.tenantId);
}
```

### Fix 2: Update getPaymentMethods Service (HIGH PRIORITY)

**File:** `backend/src/billing/billing.service.ts`

**Change:**
```typescript
async getPaymentMethods(accountId?: string, tenantId?: string): Promise<PaymentMethodResponseDto[]> {
  this.logger.log(`Fetching payment methods${accountId ? ` for account ${accountId}` : ''}`);

  try {
    const where: any = {
      tenant_id: tenantId || await this.getCurrentTenantId(),
      is_active: true,
    };

    if (accountId) {
      where.account_id = accountId;
    }

    const paymentMethods = await this.databaseService.paymentMethod.findMany({
      where,
      include: {
        account: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return paymentMethods.map((method) => this.mapPaymentMethodToDto(method));
  } catch (error) {
    this.logger.error('Error fetching payment methods', error);
    throw error;
  }
}
```

---

## Testing Recommendations

### 1. Test API Endpoints Directly

**Using curl:**
```bash
# Test getInvoices
curl -X GET "http://localhost:3001/api/v1/billing/invoices?accountId=123" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test getPaymentMethods
curl -X GET "http://localhost:3001/api/v1/billing/payment-methods?accountId=123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Using Postman:**
1. Create GET request to `http://localhost:3001/api/v1/billing/invoices`
2. Add query parameter `accountId` with a valid customer ID
3. Add Authorization header: `Bearer YOUR_TOKEN`
4. Check response status and body

### 2. Check Backend Logs

**Look for:**
- Authentication errors
- Tenant ID extraction errors
- Database query errors
- Validation errors

### 3. Verify Token Payload

**Check if JWT token includes:**
- `tenantId` field
- `userId` field
- Valid expiration

---

## Root Cause Hypothesis

### Most Likely Causes (in order):

1. **Missing tenantId in getPaymentMethods** (60% probability)
   - Controller doesn't extract tenantId from request
   - Service relies on `getCurrentTenantId()` which might fail
   - Could cause validation error → 400 Bad Request

2. **Authentication Issues** (30% probability)
   - JWT token not properly formatted
   - Token missing tenantId in payload
   - JwtAuthGuard rejecting token

3. **AccountId Format Issues** (10% probability)
   - AccountId format doesn't match database schema
   - UUID validation failing
   - Type mismatch in Prisma query

---

## Next Steps

### Immediate Actions:

1. ✅ **Fix getPaymentMethods controller** - Add `@Request() req` parameter
2. ✅ **Fix getPaymentMethods service** - Accept `tenantId` parameter
3. ⚠️ **Test API endpoints** - Verify fixes work
4. ⚠️ **Check backend logs** - Identify any remaining issues

### Verification Steps:

1. Test API endpoints with Postman/curl
2. Check backend logs for detailed error messages
3. Verify JWT token payload includes tenantId
4. Test with valid and invalid accountId values

---

## Status

**Investigation:** ✅ **COMPLETE**  
**Fixes Identified:** ✅ **2 FIXES NEEDED**  
**Implementation:** ⚠️ **PENDING**

---

**Report Created:** 2025-11-16  
**Status:** Active






