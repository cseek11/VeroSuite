# Test Violations Summary

This directory contains intentionally broken code to test the auto-enforcer system.

## Created Files

1. `test-violations.controller.ts` - Controller with multiple violations
2. `test-violations.service.ts` - Service with multiple violations
3. `test-violations.module.ts` - Module file

## Violations Created

### Security Violations (03-security.mdc)

1. **Missing tenant_id filter in queries** (R01 - Tenant Isolation)
   - `findAllCustomers()` - Query without tenant_id filter
   - `getCustomerOrders()` - Query without tenant_id filter
   - `getCustomersWithOrders()` - Query without tenant_id filter
   - `searchCustomers()` - Query without tenant_id filter

2. **Trusting client-provided tenant_id** (R01 - Tenant Isolation)
   - Controller accepts `tenant_id` from query params
   - Service accepts `tenant_id` as parameter from client
   - Should extract from authenticated JWT instead

3. **No authentication guards** (R02 - Authentication)
   - All controller endpoints lack `@UseGuards(JwtAuthGuard)`
   - No authentication checks

4. **Hardcoded secrets** (R03 - Secrets Management)
   - `JWT_SECRET = 'my-secret-key-123'` in service
   - `API_KEY = 'sk_live_1234567890abcdef'` in service
   - Should use environment variables

5. **No input validation** (R13 - Input Validation)
   - Controller methods accept `any` type instead of DTOs
   - No class-validator decorators
   - No validation of user input

6. **Exposing tenant_id in logs/errors** (R01 - Tenant Isolation)
   - `console.log('Tenant ID:', tenantId)` in service
   - Error message includes tenant_id

### Backend Architecture Violations (08-backend.mdc)

1. **Business logic in controller** (R11 - Backend Patterns)
   - `getCustomers()` - Filtering logic in controller
   - `createCustomer()` - Email validation in controller
   - Should be in service layer

2. **No DTOs** (R11 - Backend Patterns)
   - All endpoints use `any` type instead of DTOs
   - No request/response DTOs defined

3. **Missing guards** (R11 - Backend Patterns)
   - No `@UseGuards(JwtAuthGuard)` decorators
   - No RBAC decorators

4. **No transactions for multi-step operations** (R11 - Backend Patterns)
   - `updateCustomerStatus()` performs multiple DB operations without transaction
   - `createCustomer()` could benefit from transaction

### Quality Violations (10-quality.mdc)

1. **No tests** (R10 - Testing Coverage)
   - No unit tests
   - No integration tests
   - No regression tests

2. **Console.log instead of structured logging** (R07 - Observability)
   - Multiple `console.log()` statements
   - Should use `StructuredLoggerService`

3. **Hardcoded dates** (R08 - Backend)
   - `new Date('2023-01-01')` - Should use system date injection

4. **N+1 query pattern** (R10 - Quality)
   - `getCustomersWithOrders()` - Queries in loop
   - Should use `include` or batch queries

## Expected Enforcer Detection

The auto-enforcer should detect:
- Multiple security violations (tenant isolation, authentication, secrets)
- Backend architecture violations (business logic in controller, no DTOs)
- Quality violations (no tests, console.log, N+1 queries)

## Testing the Enforcer

Run the auto-enforcer:
```bash
python .cursor/scripts/auto-enforcer.py
```

The enforcer should:
1. Detect all violations listed above
2. Generate a report with fix hints
3. Create an ENFORCER_REPORT.json with violations

## Cleanup

After testing, delete this directory:
```bash
rm -rf apps/api/src/test-violations
```




















