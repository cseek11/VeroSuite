# Week 2-3: Debug API Errors - 400 Bad Request

**Date:** 2025-12-05  
**Status:** 🔍 **INVESTIGATING**

---

## Problem

After restarting backend server, still getting 400 Bad Request errors:
- `Failed to fetch invoices: Bad Request`
- `Failed to fetch payment methods: Bad Request`

---

## Investigation Steps

### Step 1: Check Backend Logs

**Action Required:**
Check the backend server console/logs for detailed error messages.

**Look for:**
- Error stack traces
- "Failed to fetch payment methods" messages
- "Tenant context not found" errors
- Database query errors
- Authentication errors

**Expected Log Format:**
```
[ERROR] Failed to fetch payment methods: <actual error message>
```

### Step 2: Verify req.user.tenantId is Available

**Potential Issue:**
`req.user.tenantId` might be `undefined` if:
- JWT token doesn't include `tenantId` in payload
- JwtAuthGuard doesn't extract `tenantId` correctly
- Token payload structure is different than expected

**Check:**
1. Decode JWT token to see payload structure
2. Verify `tenantId` is in token payload
3. Check if `req.user` structure matches expectations

### Step 3: Check getCurrentTenantId() Implementation

**Potential Issue:**
If `tenantId` is not provided, service calls `await this.getCurrentTenantId()` which might:
- Fail if tenant context is not set
- Return undefined
- Throw an error

**Action:**
Check if `getCurrentTenantId()` is working correctly.

### Step 4: Improve Error Logging

**Current Issue:**
Service catches errors and throws generic `BadRequestException('Failed to fetch payment methods')` without the actual error details.

**Fix Needed:**
Log the actual error before throwing generic exception.

---

## Potential Root Causes

### 1. req.user.tenantId is undefined ⚠️ HIGH PROBABILITY

**Symptom:**
- `req.user.tenantId` is `undefined`
- Service calls `getCurrentTenantId()` which fails
- Error is caught and generic BadRequestException is thrown

**Check:**
```typescript
// In controller, add logging:
async getPaymentMethods(
  @Request() req: any,
  @Query('accountId') accountId?: string
): Promise<PaymentMethodResponseDto[]> {
  console.log('req.user:', req.user);
  console.log('req.user.tenantId:', req.user?.tenantId);
  return this.billingService.getPaymentMethods(accountId, req.user.tenantId);
}
```

### 2. getCurrentTenantId() Fails ⚠️ MEDIUM PROBABILITY

**Symptom:**
- `tenantId` parameter is `undefined`
- Service tries to get tenant from context
- `getCurrentTenantId()` throws error or returns undefined

**Check:**
- Verify `getCurrentTenantId()` implementation
- Check if tenant context is properly set
- Verify database connection

### 3. Database Query Fails ⚠️ MEDIUM PROBABILITY

**Symptom:**
- Query to `paymentMethod.findMany()` fails
- Prisma error is caught
- Generic BadRequestException is thrown

**Check:**
- Verify database connection
- Check if `payment_methods` table exists
- Verify table schema matches query
- Check RLS policies if using Supabase

### 4. Authentication Issue ⚠️ LOW PROBABILITY

**Symptom:**
- JWT token is invalid or expired
- `req.user` is undefined
- JwtAuthGuard might be rejecting request

**Check:**
- Verify token is valid
- Check token expiration
- Verify JwtAuthGuard is working

---

## Immediate Debug Actions

### Action 1: Add Detailed Logging to Controller

**File:** `backend/src/billing/billing.controller.ts`

**Add:**
```typescript
@Get('payment-methods')
async getPaymentMethods(
  @Request() req: any,
  @Query('accountId') accountId?: string
): Promise<PaymentMethodResponseDto[]> {
  this.logger.log(`getPaymentMethods called with accountId: ${accountId}`);
  this.logger.log(`req.user: ${JSON.stringify(req.user)}`);
  this.logger.log(`req.user.tenantId: ${req.user?.tenantId}`);
  
  if (!req.user?.tenantId) {
    this.logger.error('req.user.tenantId is undefined!');
    throw new BadRequestException('Tenant ID not found in request');
  }
  
  return this.billingService.getPaymentMethods(accountId, req.user.tenantId);
}
```

### Action 2: Add Detailed Logging to Service

**File:** `backend/src/billing/billing.service.ts`

**Update:**
```typescript
async getPaymentMethods(accountId?: string, tenantId?: string): Promise<PaymentMethodResponseDto[]> {
  this.logger.log(`Fetching payment methods${accountId ? ` for account ${accountId}` : ''}`);
  this.logger.log(`tenantId parameter: ${tenantId}`);

  try {
    const finalTenantId = tenantId || await this.getCurrentTenantId();
    this.logger.log(`Using tenantId: ${finalTenantId}`);
    
    const where: any = {
      tenant_id: finalTenantId,
      is_active: true,
    };

    if (accountId) {
      where.account_id = accountId;
    }

    this.logger.log(`Query where clause: ${JSON.stringify(where)}`);

    const paymentMethods = await this.databaseService.paymentMethod.findMany({
      where,
      include: {
        account: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: [
        { is_default: 'desc' },
        { created_at: 'desc' }
      ]
    });

    this.logger.log(`Found ${paymentMethods.length} payment methods`);
    return paymentMethods as unknown as PaymentMethodResponseDto[];
  } catch (error) {
    this.logger.error(`Failed to fetch payment methods: ${(error as Error).message}`, (error as Error).stack);
    this.logger.error(`Error details: ${JSON.stringify(error)}`);
    throw new BadRequestException(`Failed to fetch payment methods: ${(error as Error).message}`);
  }
}
```

### Action 3: Check Frontend Request

**Verify:**
1. Token is being sent in Authorization header
2. Token includes `tenantId` in payload
3. Request URL is correct
4. Query parameters are correct

**Check Browser Network Tab:**
- Look at actual request headers
- Check Authorization header format
- Verify accountId query parameter
- Check response status and body

---

## Quick Fix: Add Error Details to Response

**Current:**
```typescript
catch (error) {
  this.logger.error(`Failed to fetch payment methods: ${(error as Error).message}`, (error as Error).stack);
  throw new BadRequestException('Failed to fetch payment methods');
}
```

**Better:**
```typescript
catch (error) {
  const errorMessage = (error as Error).message || 'Unknown error';
  this.logger.error(`Failed to fetch payment methods: ${errorMessage}`, (error as Error).stack);
  throw new BadRequestException(`Failed to fetch payment methods: ${errorMessage}`);
}
```

This will at least show the actual error message in the response.

---

## Next Steps

1. ⚠️ **Add detailed logging** to controller and service
2. ⚠️ **Restart backend** with new logging
3. ⚠️ **Check backend logs** for actual error messages
4. ⚠️ **Check browser Network tab** for request/response details
5. ⚠️ **Decode JWT token** to verify payload structure

---

**Status:** 🔍 **DEBUGGING IN PROGRESS**












