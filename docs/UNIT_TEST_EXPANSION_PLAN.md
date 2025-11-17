# Unit Test Expansion Plan - Phased Approach to 80% Coverage

**Date:** 2025-11-15  
**Current Coverage:** 9.21% statements, 5.87% branches, 6.95% functions, 9.17% lines  
**Target Coverage:** 80% statements, 80% branches, 80% functions, 80% lines  
**Strategy:** Phased approach prioritizing critical business logic

---

## Overview

This plan outlines a systematic approach to expand unit test coverage from 9.21% to 80% by prioritizing critical business logic modules and following established test patterns.

### Key Principles

1. **Prioritize Business Logic** - Services and repositories over controllers and DTOs
2. **Follow Existing Patterns** - Use established test utilities and mock patterns
3. **Incremental Milestones** - Set achievable targets (25%, 50%, 75%, 80%)
4. **Quality over Quantity** - Focus on meaningful tests, not just coverage numbers
5. **Exclude Low-Value Files** - Module files, simple DTOs, index files

---

## Phase 1: Configuration Updates

### Step 1.1: Update Coverage Configuration

**File:** `backend/test/enterprise-testing.config.js`

**Changes:**
- Exclude module files (DI configuration only)
- Exclude simple DTOs (validation-only files)
- Keep existing exclusions (main.ts, index.ts, test files)

**Updated `collectCoverageFrom`:**
```javascript
collectCoverageFrom: [
  'src/**/*.ts',
  '!src/**/*.d.ts',
  '!src/**/*.spec.ts',
  '!src/**/*.test.ts',
  '!src/main.ts',
  '!src/**/index.ts',
  '!src/**/*.module.ts',           // Exclude module files (DI only)
  '!src/**/dto/**/*.dto.ts',       // Exclude simple DTOs (test selectively)
  '!src/**/*.gateway.ts'           // WebSocket gateways (test via integration)
]
```

**Note:** DTOs with complex validation logic should still be tested. This exclusion is for simple data transfer objects.

---

## Phase 2: Critical Business Logic (Target: 80%+ Coverage)

**Goal:** Achieve 80%+ coverage for security and business-critical modules  
**Estimated Impact:** +15-20% overall coverage

### Module 2.1: Authentication (`src/auth/`)

**Current Coverage:** 21.47% statements  
**Target Coverage:** 90%+ statements

**Files to Test:**

1. **`auth.service.ts`** (Partially tested - expand)
   - ✅ Already has tests: `test/unit/auth/auth.service.test.ts`
   - **Expand coverage:**
     - Test all error paths (lines 22, 79-85, 172, 249-250)
     - Test edge cases for token exchange
     - Test session management
   - **Test File:** `test/unit/auth/auth.service.test.ts` (expand existing)

2. **`jwt.strategy.ts`** (0% coverage)
   - Test JWT validation
   - Test token extraction from headers
   - Test error handling for invalid tokens
   - **Test File:** `test/unit/auth/jwt.strategy.test.ts` (new)

3. **`permissions.guard.ts`** (0% coverage)
   - Test permission checking logic
   - Test role-based access
   - Test custom permissions
   - **Test File:** `test/unit/auth/permissions.guard.test.ts` (new)

4. **`roles.guard.ts`** (0% coverage)
   - Test role validation
   - Test multiple roles
   - Test role hierarchy
   - **Test File:** `test/unit/auth/roles.guard.test.ts` (new)

5. **`session.service.ts`** (0% coverage)
   - Test session creation
   - Test session validation
   - Test session cleanup
   - **Test File:** `test/unit/auth/session.service.test.ts` (new)

**Estimated Tests:** 40-50 new tests  
**Estimated Time:** 2-3 days

---

### Module 2.2: Billing (`src/billing/`)

**Current Coverage:** 0% statements  
**Target Coverage:** 85%+ statements

**Files to Test:**

1. **`billing.service.ts`** (0% coverage - 1209 lines)
   - Test invoice creation
   - Test payment processing
   - Test subscription management
   - Test webhook handling
   - Test error handling
   - **Test File:** `test/unit/billing/billing.service.test.ts` (new)

2. **`stripe.service.ts`** (0% coverage - 224 lines)
   - Test Stripe API integration
   - Test payment method management
   - Test subscription operations
   - Test error handling
   - **Test File:** `test/unit/billing/stripe.service.test.ts` (new)

3. **`billing.controller.ts`** (0% coverage - 250 lines)
   - Test API endpoints
   - Test request validation
   - Test response formatting
   - **Test File:** `test/unit/billing/billing.controller.test.ts` (new)

4. **`stripe-webhook.controller.ts`** (0% coverage - 201 lines)
   - Test webhook signature validation
   - Test event handling
   - Test error scenarios
   - **Test File:** `test/unit/billing/stripe-webhook.controller.test.ts` (new)

**Estimated Tests:** 80-100 new tests  
**Estimated Time:** 4-5 days

---

### Module 2.3: User Management (`src/user/`)

**Current Coverage:** 0% statements  
**Target Coverage:** 85%+ statements

**Files to Test:**

1. **`user.service.ts`** (0% coverage - 825 lines)
   - Test user CRUD operations
   - Test user search and filtering
   - Test permission management
   - Test tenant isolation
   - Test error handling
   - **Test File:** `test/unit/user/user.service.test.ts` (new)

2. **`user.controller.ts`** (0% coverage - 192 lines)
   - Test API endpoints
   - Test request validation
   - Test response formatting
   - **Test File:** `test/unit/user/user.controller.test.ts` (new)

3. **`user-v2.controller.ts`** (0% coverage - 317 lines)
   - Test V2 API endpoints
   - Test enhanced features
   - Test backward compatibility
   - **Test File:** `test/unit/user/user-v2.controller.test.ts` (new)

4. **`user-metrics.service.ts`** (0% coverage - 190 lines)
   - Test metrics collection
   - Test analytics calculations
   - Test reporting features
   - **Test File:** `test/unit/user/user-metrics.service.test.ts` (new)

5. **`import-export.service.ts`** (0% coverage - 208 lines)
   - Test data import
   - Test data export
   - Test format validation
   - Test error handling
   - **Test File:** `test/unit/user/import-export.service.test.ts` (new)

**Estimated Tests:** 60-80 new tests  
**Estimated Time:** 3-4 days

---

### Module 2.4: Accounts (`src/accounts/`)

**Current Coverage:** 13.88% statements  
**Target Coverage:** 90%+ statements

**Files to Test:**

1. **`accounts.service.ts`** (90.16% coverage - expand)
   - ✅ Already has tests: `test/unit/customers/customers.service.test.ts`
   - **Expand coverage:**
     - Test uncovered lines (56, 59, 96-97, 112-113)
     - Test edge cases
   - **Test File:** `test/unit/customers/customers.service.test.ts` (expand existing)

2. **`enhanced-accounts.service.ts`** (0% coverage - 502 lines)
   - Test enhanced account features
   - Test advanced search
   - Test bulk operations
   - **Test File:** `test/unit/accounts/enhanced-accounts.service.test.ts` (new)

3. **`accounts.controller.ts`** (0% coverage - 111 lines)
   - Test API endpoints
   - Test request validation
   - **Test File:** `test/unit/accounts/accounts.controller.test.ts` (new)

4. **`basic-accounts.controller.ts`** (0% coverage - 227 lines)
   - Test basic API endpoints
   - Test simplified operations
   - **Test File:** `test/unit/accounts/basic-accounts.controller.test.ts` (new)

5. **`simple-accounts.controller.ts`** (0% coverage - 115 lines)
   - Test simple operations
   - Test minimal API surface
   - **Test File:** `test/unit/accounts/simple-accounts.controller.test.ts` (new)

**Estimated Tests:** 50-70 new tests  
**Estimated Time:** 3-4 days

---

## Phase 3: Core Features (Target: 75%+ Coverage)

**Goal:** Achieve 75%+ coverage for core business features  
**Estimated Impact:** +20-25% overall coverage

### Module 3.1: Jobs (`src/jobs/`)

**Current Coverage:** 0% statements  
**Target Coverage:** 80%+ statements

**Files to Test:**

1. **`jobs.service.ts`** (0% coverage - 748 lines)
   - Test job creation and management
   - Test job assignment
   - Test scheduling and conflicts
   - Test recurring jobs
   - Test photo management
   - **Test File:** `test/unit/jobs/jobs.service.test.ts` (new)

2. **`jobs.controller.ts`** (0% coverage - 156 lines)
   - Test API endpoints
   - Test request validation
   - **Test File:** `test/unit/jobs/jobs.controller.test.ts` (new)

3. **`jobs.actions.ts`** (0% coverage - 13 lines)
   - Test job actions
   - **Test File:** `test/unit/jobs/jobs.actions.test.ts` (new)

**Estimated Tests:** 60-80 new tests  
**Estimated Time:** 3-4 days

---

### Module 3.2: Work Orders (`src/work-orders/`)

**Current Coverage:** 0% statements  
**Target Coverage:** 80%+ statements

**Files to Test:**

1. **`work-orders.service.ts`** (0% coverage - 447 lines)
   - Test work order creation
   - Test status management
   - Test assignment logic
   - Test completion workflows
   - **Test File:** `test/unit/work-orders/work-orders.service.test.ts` (new)

2. **`work-orders.controller.ts`** (0% coverage - 188 lines)
   - Test API endpoints
   - Test request validation
   - **Test File:** `test/unit/work-orders/work-orders.controller.test.ts` (new)

3. **`work-orders-v2.controller.ts`** (0% coverage - 170 lines)
   - Test V2 API endpoints
   - Test enhanced features
   - **Test File:** `test/unit/work-orders/work-orders-v2.controller.test.ts` (new)

**Estimated Tests:** 50-70 new tests  
**Estimated Time:** 3-4 days

---

### Module 3.3: Technician Management (`src/technician/`)

**Current Coverage:** 0% statements  
**Target Coverage:** 80%+ statements

**Files to Test:**

1. **`technician.service.ts`** (0% coverage - 807 lines)
   - Test technician CRUD operations
   - Test availability management
   - Test skill management
   - Test assignment logic
   - **Test File:** `test/unit/technician/technician.service.test.ts` (new)

2. **`technician.controller.ts`** (0% coverage - 141 lines)
   - Test API endpoints
   - Test request validation
   - **Test File:** `test/unit/technician/technician.controller.test.ts` (new)

3. **`technician-v2.controller.ts`** (0% coverage - 236 lines)
   - Test V2 API endpoints
   - Test enhanced features
   - **Test File:** `test/unit/technician/technician-v2.controller.test.ts` (new)

**Estimated Tests:** 50-70 new tests  
**Estimated Time:** 3-4 days

---

### Module 3.4: Dashboard Services (`src/dashboard/`)

**Current Coverage:** 9.87% statements  
**Target Coverage:** 80%+ statements

**Files to Test:**

1. **`dashboard.service.ts`** (26.96% coverage - expand)
   - ✅ Already has tests: `src/dashboard/__tests__/dashboard.service.spec.ts`
   - **Expand coverage:**
     - Test all CRUD operations
     - Test versioning logic
     - Test collaboration features
     - Test uncovered lines (302, 378, 430, 490, 537, 562-739, 763-1180)
   - **Test File:** `src/dashboard/__tests__/dashboard.service.spec.ts` (expand existing)

2. **`versioning.service.ts`** (0% coverage - 318 lines)
   - Test version creation
   - Test version management
   - Test rollback logic
   - **Test File:** `test/unit/dashboard/versioning.service.test.ts` (new)

3. **`collaboration.service.ts`** (0% coverage - 126 lines)
   - Test collaboration features
   - Test sharing logic
   - Test permissions
   - **Test File:** `test/unit/dashboard/collaboration.service.test.ts` (new)

4. **`widget-registry.service.ts`** (0% coverage - 198 lines)
   - Test widget registration
   - Test widget discovery
   - Test widget validation
   - **Test File:** `test/unit/dashboard/widget-registry.service.test.ts` (new)

5. **`ssr.service.ts`** (0% coverage - 92 lines)
   - Test SSR rendering
   - Test caching logic
   - **Test File:** `test/unit/dashboard/ssr.service.test.ts` (new)

**Estimated Tests:** 60-80 new tests  
**Estimated Time:** 3-4 days

---

## Phase 4: Supporting Features (Target: 70%+ Coverage)

**Goal:** Achieve 70%+ coverage for supporting features  
**Estimated Impact:** +15-20% overall coverage

### Module 4.1: KPIs (`src/kpis/`)

**Files to Test:**
1. **`kpis.service.ts`** (0% coverage - 877 lines)
2. **`kpis.controller.ts`** (0% coverage - 117 lines)
3. **`kpis-v2.controller.ts`** (0% coverage - 196 lines)

**Estimated Tests:** 50-70 new tests  
**Estimated Time:** 3-4 days

---

### Module 4.2: KPI Templates (`src/kpi-templates/`)

**Files to Test:**
1. **`kpi-templates.service.ts`** (0% coverage - 618 lines)
2. **`kpi-templates.controller.ts`** (0% coverage - 267 lines)
3. **`kpi-templates-v2.controller.ts`** (0% coverage - 329 lines)

**Estimated Tests:** 40-60 new tests  
**Estimated Time:** 2-3 days

---

### Module 4.3: Agreements (`src/agreements/`)

**Files to Test:**
1. **`agreements.service.ts`** (0% coverage - 427 lines)
2. **`agreements.controller.ts`** (0% coverage - 114 lines)

**Estimated Tests:** 30-50 new tests  
**Estimated Time:** 2-3 days

---

### Module 4.4: CRM (`src/crm/`)

**Files to Test:**
1. **`crm.service.ts`** (0% coverage - 209 lines)
2. **`crm.controller.ts`** (0% coverage - 129 lines)
3. **`crm-v2.controller.ts`** (0% coverage - 162 lines)

**Estimated Tests:** 30-50 new tests  
**Estimated Time:** 2-3 days

---

## Phase 5: Infrastructure & Utilities (Target: 60%+ Coverage)

**Goal:** Achieve 60%+ coverage for shared infrastructure  
**Estimated Impact:** +10-15% overall coverage

### Module 5.1: Common Services (`src/common/services/`) ✅ **COMPLETE**

**Current Coverage:** 15.18% statements  
**Target Coverage:** 70%+ statements  
**Status:** ✅ All 12 services tested (200+ tests created)

**Files to Test:**

1. **`cache.service.ts`** (3.18% coverage - 459 lines) ✅ **COMPLETE**
   - ✅ Test caching operations (L1 memory, L2 Redis, L3 DB)
   - ✅ Test cache invalidation (layout, region, user, KPI)
   - ✅ Test TTL management
   - ✅ Test cache statistics and metrics
   - ✅ Test cache warming and stale-while-revalidate
   - ✅ Test error handling for Redis failures
   - **Test File:** `test/unit/common/services/cache.service.test.ts` ✅ **CREATED** (70+ tests)

2. **`database.service.ts`** (10.63% coverage - 100 lines) ✅ **COMPLETE**
   - ✅ Test database operations (query with/without parameters)
   - ✅ Test connection management (onModuleInit, onModuleDestroy)
   - ✅ Test tenant isolation (withTenant, getCurrentTenantId)
   - ✅ Test connection pool configuration
   - ✅ Test error handling
   - **Test File:** `test/unit/common/services/database.service.test.ts` ✅ **CREATED** (25+ tests)

3. **`encryption.service.ts`** (0% coverage - 159 lines) ✅ **COMPLETE**
   - ✅ Test encryption/decryption (AES-256-GCM)
   - ✅ Test key management (hex, base64, UTF-8)
   - ✅ Test encryptFields and decryptFields
   - ✅ Test error handling and edge cases
   - **Test File:** `test/unit/common/services/encryption.service.test.ts` ✅ **CREATED** (30+ tests)

4. **`feature-flag.service.ts`** (0% coverage - 201 lines) ✅ **COMPLETE**
   - ✅ Test feature flag evaluation
   - ✅ Test percentage-based rollout
   - ✅ Test user group targeting
   - ✅ Test tenant targeting
   - ✅ Test database flags
   - ✅ Test flag management (setFlag, getAllFlags)
   - **Test File:** `test/unit/common/services/feature-flag.service.test.ts` ✅ **CREATED** (25+ tests)

5. **`geocoding.service.ts`** (0% coverage - 25 lines) ✅ **COMPLETE**
   - ✅ Test geocoding operations (API key validation)
   - ✅ Test address validation (various formats)
   - ✅ Test error handling
   - **Test File:** `test/unit/common/services/geocoding.service.test.ts` ✅ **CREATED** (8+ tests)

6. **`logger.service.ts`** (0% coverage - 98 lines) ✅ **COMPLETE**
   - ✅ Test logging operations (log, error, warn, debug, verbose)
   - ✅ Test log levels and structured logging
   - ✅ Test request context management
   - ✅ Test production vs development logging
   - **Test File:** `test/unit/common/services/logger.service.test.ts` ✅ **CREATED** (20+ tests)

7. **`metrics.service.ts`** (5.26% coverage - 153 lines) ✅ **COMPLETE**
   - ✅ Test metrics collection (counters, histograms, gauges)
   - ✅ Test Prometheus formatting
   - ✅ Test aggregation and statistics
   - ✅ Test label handling
   - **Test File:** `test/unit/common/services/metrics.service.test.ts` ✅ **CREATED** (25+ tests)

8. **`redis.service.ts`** (0% coverage - 259 lines) ✅ **COMPLETE**
   - ✅ Test Redis operations (get, set, del, exists, expire)
   - ✅ Test batch operations (mget, mset)
   - ✅ Test pattern operations (keys, flushPattern)
   - ✅ Test connection management
   - ✅ Test error handling and graceful degradation
   - **Test File:** `test/unit/common/services/redis.service.test.ts` ✅ **CREATED** (30+ tests)

9. **`redis-pubsub.service.ts`** (0% coverage - 191 lines) ✅ **COMPLETE**
   - ✅ Test pub/sub operations (publish, subscribe, unsubscribe)
   - ✅ Test message handling and routing
   - ✅ Test multiple handlers per channel
   - ✅ Test connection management
   - **Test File:** `test/unit/common/services/redis-pubsub.service.test.ts` ✅ **CREATED** (20+ tests)

10. **`sentry.service.ts`** (0% coverage - 142 lines) ✅ **COMPLETE**
    - ✅ Test error reporting (captureException, captureMessage)
    - ✅ Test context management (setUser, setContext, setTag)
    - ✅ Test initialization and configuration
    - ✅ Test error filtering (beforeSend, beforeBreadcrumb)
    - **Test File:** `test/unit/common/services/sentry.service.test.ts` ✅ **CREATED** (20+ tests)

**Tests Created:** 200+ tests across 12 services  
**Status:** ✅ **COMPLETE** - All services in Module 5.1 now have comprehensive test coverage

11. **`supabase.service.ts`** (38.46% coverage - 24 lines) ✅ **COMPLETE**
    - ✅ Test client initialization
    - ✅ Test environment variable validation
    - ✅ Test key format detection (new vs legacy)
    - ✅ Test getClient method
    - **Test File:** `test/unit/common/services/supabase.service.test.ts` ✅ **CREATED** (10+ tests)

12. **`audit.service.ts`** (0% coverage - 41 lines) ✅ **COMPLETE**
    - ✅ Test audit logging with all fields
    - ✅ Test optional field handling
    - ✅ Test UUID generation
    - ✅ Test error handling
    - **Test File:** `test/unit/common/services/audit.service.test.ts` ✅ **CREATED** (8+ tests)

**Estimated Tests:** 80-100 new tests  
**Estimated Time:** 4-5 days

---

### Module 5.2: Common Middleware (`src/common/middleware/`) ✅ **COMPLETE**

**Current Coverage:** 47.3% statements  
**Target Coverage:** 70%+ statements  
**Status:** ✅ All 3 middleware files tested (50+ tests created)

**Files to Test:**

1. **`rate-limit.middleware.ts`** (88.76% coverage) ✅ **EXPANDED**
   - ✅ Expanded existing tests: `src/common/middleware/__tests__/rate-limit.middleware.spec.ts`
   - ✅ Test uncovered lines (117, 138, 143, 224, 248-251, 256, 264)
   - ✅ Test endpoint categorization (expensive, websocket, normal)
   - ✅ Test tier limits (free, basic, premium, enterprise)
   - ✅ Test cost calculation (bulk, write operations, complex GET)
   - ✅ Test sliding window algorithm
   - ✅ Test error handling (fail open)
   - **Test File:** `src/common/middleware/__tests__/rate-limit.middleware.spec.ts` ✅ **EXPANDED** (30+ tests total)

2. **`security-headers.middleware.ts`** (0% coverage - 72 lines) ✅ **COMPLETE**
   - ✅ Test security header injection (CSP, X-Frame-Options, etc.)
   - ✅ Test CSP nonce generation and usage
   - ✅ Test Permissions-Policy configuration
   - ✅ Test header configuration
   - **Test File:** `test/unit/common/middleware/security-headers.middleware.test.ts` ✅ **CREATED** (15+ tests)

3. **`tenant.middleware.ts`** (0% coverage - 137 lines) ✅ **COMPLETE**
   - ✅ Test tenant context extraction (user, header, JWT)
   - ✅ Test tenant validation (UUID format)
   - ✅ Test database session setup (tenant_id, user_id, roles, teams)
   - ✅ Test error handling
   - ✅ Test unauthenticated endpoint handling
   - **Test File:** `test/unit/common/middleware/tenant.middleware.test.ts` ✅ **CREATED** (20+ tests)

**Tests Created:** 50+ tests across 3 middleware files  
**Status:** ✅ **COMPLETE** - All middleware in Module 5.2 now have comprehensive test coverage

---

### Module 5.3: Common Interceptors (`src/common/interceptors/`) ✅ **COMPLETE**

**Current Coverage:** 0% statements  
**Target Coverage:** 60%+ statements  
**Status:** ✅ All 4 interceptors tested (40+ tests created)

**Files to Test:**

1. **`deprecation.interceptor.ts`** (0% coverage - 43 lines) ✅ **COMPLETE**
   - ✅ Test deprecation header injection (Deprecation, Sunset, Link)
   - ✅ Test successor path construction (v1 to v2)
   - ✅ Test route path vs URL handling
   - **Test File:** `test/unit/common/interceptors/deprecation.interceptor.test.ts` ✅ **CREATED** (10+ tests)

2. **`idempotency.interceptor.ts`** (0% coverage - 72 lines) ✅ **COMPLETE**
   - ✅ Test idempotency key handling
   - ✅ Test cached response return for duplicate requests
   - ✅ Test response storage for new requests
   - ✅ Test user context validation
   - ✅ Test non-idempotent endpoint passthrough
   - **Test File:** `test/unit/common/interceptors/idempotency.interceptor.test.ts` ✅ **CREATED** (15+ tests)

3. **`metrics.interceptor.ts`** (0% coverage - 65 lines) ✅ **COMPLETE**
   - ✅ Test request duration histogram recording
   - ✅ Test request count counter recording
   - ✅ Test error metrics recording
   - ✅ Test route path extraction
   - ✅ Test status code handling
   - **Test File:** `test/unit/common/interceptors/metrics.interceptor.test.ts` ✅ **CREATED** (10+ tests)

4. **`tenant-context.interceptor.ts`** (0% coverage - 23 lines) ✅ **COMPLETE**
   - ✅ Test tenant context logging
   - ✅ Test public endpoint handling
   - ✅ Test request passthrough
   - **Test File:** `test/unit/common/interceptors/tenant-context.interceptor.test.ts` ✅ **CREATED** (5+ tests)

**Tests Created:** 40+ tests across 4 interceptors  
**Status:** ✅ **COMPLETE** - All interceptors in Module 5.3 now have comprehensive test coverage

---

### Module 5.4: Other Modules ✅ **COMPLETE**

**Status:** ✅ All 6 services tested (80+ tests created)

**Files to Test:**

1. **`company.service.ts`** ✅ **COMPLETE**
   - ✅ Test get/update company settings
   - ✅ Test logo upload/delete operations
   - ✅ Test default settings handling
   - ✅ Test Supabase storage integration
   - **Test File:** `test/unit/company/company.service.test.ts` ✅ **CREATED** (20+ tests)

2. **`layouts.service.ts`** ✅ **COMPLETE**
   - ✅ Test layout creation (upload + database)
   - ✅ Test layout retrieval (getUserLayouts, getLayout)
   - ✅ Test layout data download from storage
   - ✅ Test layout update and delete
   - ✅ Test layout search
   - ✅ Test error handling and cleanup
   - **Test File:** `test/unit/layouts/layouts.service.test.ts` ✅ **CREATED** (15+ tests)

3. **`routing.service.ts`** ✅ **COMPLETE**
   - ✅ Test route grouping by technician
   - ✅ Test route optimization (priority + time)
   - ✅ Test route metrics calculation
   - ✅ Test distance calculations
   - ✅ Test unassigned jobs handling
   - **Test File:** `test/unit/routing/routing.service.test.ts` ✅ **CREATED** (15+ tests)

4. **`service-types.service.ts`** ✅ **COMPLETE**
   - ✅ Test CRUD operations (create, findAll, findOne, update, remove)
   - ✅ Test pagination
   - ✅ Test active/inactive filtering
   - ✅ Test error handling
   - **Test File:** `test/unit/service-types/service-types.service.test.ts` ✅ **CREATED** (15+ tests)

5. **`health.service.ts`** ✅ **COMPLETE**
   - ✅ Test database health check
   - ✅ Test error handling
   - ✅ Test response time measurement
   - **Test File:** `test/unit/health/health.service.test.ts` ✅ **CREATED** (5+ tests)

6. **`audit.service.ts`** ✅ **COMPLETE**
   - ✅ Test placeholder implementation
   - ✅ Test demo log retrieval
   - **Test File:** `test/unit/audit/audit.service.test.ts` ✅ **CREATED** (2+ tests)

**Note:** `src/uploads/` and `src/websocket/` are excluded from unit testing (integration tests recommended)

**Tests Created:** 80+ tests across 6 services  
**Status:** ✅ **COMPLETE** - All services in Module 5.4 now have comprehensive test coverage

---

## Test Patterns & Utilities

### Existing Test Utilities

1. **`test/setup.ts`** - Global mocks (Supabase, etc.)
2. **`test/utils/test-auth.ts`** - Auth helpers
3. **`test/utils/test-app.ts`** - App setup utilities
4. **`test/setup/enterprise-setup.ts`** - MockFactory, TestDatabase
5. **`test/mocks/`** - External service mocks

### Test Pattern Template

```typescript
/**
 * [Service Name] Unit Tests
 * Tests for [description]
 */

import { Test, TestingModule } from '@nestjs/testing';
import { [Service] } from '../../../src/[module]/[service].service';
import { [Dependency] } from '../../../src/[module]/[dependency]';

describe('[Service]', () => {
  let service: [Service];
  let dependency: jest.Mocked<[Dependency]>;

  const mockUser = {
    id: 'user-123',
    tenant_id: 'tenant-123',
    // ... other fields
  };

  beforeEach(async () => {
    const mockDependency = {
      // Mock methods
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        [Service],
        { provide: [Dependency], useValue: mockDependency }
      ]
    }).compile();

    service = module.get<[Service]>([Service]);
    dependency = module.get([Dependency]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('[Method Name]', () => {
    it('should [expected behavior]', async () => {
      // Arrange
      // Act
      // Assert
    });

    it('should handle [error case]', async () => {
      // Test error handling
    });
  });
});
```

### Testing Best Practices

1. **Follow AAA Pattern** - Arrange, Act, Assert
2. **Test One Thing** - Each test verifies a single behavior
3. **Use Descriptive Names** - Clear test descriptions
4. **Mock External Dependencies** - Use existing mocks from `test/setup.ts`
5. **Test Error Cases** - Don't just test happy paths
6. **Test Edge Cases** - Boundary conditions, null values, etc.
7. **Maintain Test Isolation** - Each test should be independent
8. **Use Test Fixtures** - Reusable test data from `MockFactory`

---

## Milestone Targets

### Milestone 1: 25% Coverage
**Target Date:** Week 1-2  
**Focus:** Complete Phase 2 (Critical Business Logic)
- Auth module: 90%+
- Billing module: 85%+
- User module: 85%+
- Accounts module: 90%+

**Expected Coverage:** 25-30% overall

---

### Milestone 2: 50% Coverage
**Target Date:** Week 3-4  
**Focus:** Complete Phase 3 (Core Features)
- Jobs module: 80%+
- Work Orders module: 80%+
- Technician module: 80%+
- Dashboard services: 80%+

**Expected Coverage:** 50-55% overall

---

### Milestone 3: 75% Coverage
**Target Date:** Week 5-6  
**Focus:** Complete Phase 4 (Supporting Features)
- KPIs module: 70%+
- KPI Templates module: 70%+
- Agreements module: 70%+
- CRM module: 70%+

**Expected Coverage:** 75-80% overall

---

### Milestone 4: 80% Coverage
**Target Date:** Week 7-8  
**Focus:** Complete Phase 5 (Infrastructure) + Polish
- Common services: 70%+
- Common middleware: 70%+
- Common interceptors: 60%+
- Other modules: 60%+
- Fill gaps in existing tests

**Expected Coverage:** 80%+ overall

---

## Implementation Strategy

### Week-by-Week Breakdown

**Week 1-2: Critical Security & Business Logic**
- Day 1-2: Expand auth tests (Module 2.1)
- Day 3-5: Billing service tests (Module 2.2)
- Day 6-7: User service tests (Module 2.3)
- Day 8-9: Expand accounts tests (Module 2.4)
- Day 10: Review, fix issues, update coverage config

**Week 3-4: Core Business Features**
- Day 1-3: Jobs service tests (Module 3.1)
- Day 4-6: Work orders service tests (Module 3.2)
- Day 7-9: Technician service tests (Module 3.3)
- Day 10: Dashboard service expansion (Module 3.4)

**Week 5-6: Supporting Features**
- Day 1-3: KPIs tests (Module 4.1)
- Day 4-5: KPI Templates tests (Module 4.2)
- Day 6-7: Agreements tests (Module 4.3)
- Day 8-9: CRM tests (Module 4.4)
- Day 10: Review and gap analysis

**Week 7-8: Infrastructure & Polish**
- Day 1-3: Common services tests (Module 5.1)
- Day 4-5: Common middleware tests (Module 5.2)
- Day 6-7: Common interceptors tests (Module 5.3)
- Day 8-9: Other modules tests (Module 5.4)
- Day 10: Final review, coverage verification, documentation

---

## Success Metrics

### Coverage Metrics
- **Statements:** 80%+ (currently 9.21%)
- **Branches:** 80%+ (currently 5.87%)
- **Functions:** 80%+ (currently 6.95%)
- **Lines:** 80%+ (currently 9.17%)

### Quality Metrics
- All critical business logic modules: 85%+ coverage
- All core feature modules: 80%+ coverage
- All supporting modules: 70%+ coverage
- All infrastructure modules: 60%+ coverage

### Test Quality
- All tests follow AAA pattern
- All tests have descriptive names
- All error paths tested
- All edge cases covered
- All tests are isolated and independent

---

## Risk Mitigation

### Potential Risks

1. **Time Overruns**
   - **Risk:** Testing complex services takes longer than estimated
   - **Mitigation:** Prioritize critical paths, defer edge cases if needed

2. **Test Maintenance**
   - **Risk:** Tests break when code changes
   - **Mitigation:** Use proper mocking, test behavior not implementation

3. **Coverage Gaps**
   - **Risk:** Some code paths difficult to test
   - **Mitigation:** Document untestable code, use coverage exclusions appropriately

4. **Integration Issues**
   - **Risk:** Tests don't reflect real-world usage
   - **Mitigation:** Complement with integration tests, use realistic mocks

---

## Next Steps

1. **Immediate Actions:**
   - [ ] Update `enterprise-testing.config.js` with exclusions
   - [ ] Create test directory structure for new modules
   - [ ] Set up test utilities/fixtures if needed
   - [ ] Review existing test patterns

2. **Start Implementation:**
   - [ ] Begin with Phase 2, Module 2.1 (Auth expansion)
   - [ ] Follow test pattern template
   - [ ] Run tests after each module completion
   - [ ] Update coverage reports

3. **Track Progress:**
   - [ ] Update this document with completion status
   - [ ] Track coverage metrics weekly
   - [ ] Review and adjust plan as needed

---

**Last Updated:** 2025-11-15  
**Status:** Plan Ready for Implementation  
**Next Review:** After Milestone 1 completion

