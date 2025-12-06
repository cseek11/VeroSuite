# R09: Trace Propagation — Step 5 Procedures (DRAFT)

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-12-04  
**Rule:** R09 - Trace Propagation  
**Priority:** HIGH (Tier 2 - OVERRIDE)  
**MAD Tier:** 2 (OVERRIDE REQUIRED - Needs justification)

---

## Purpose

R09 ensures that traceId propagates across all service boundaries, HTTP calls, database queries, and external service calls. This completes the observability trilogy with R07 (Error Handling) and R08 (Structured Logging).

**Key Requirements:**
- TraceId propagates through service-to-service calls
- TraceId propagates in HTTP headers (x-trace-id, x-span-id, x-request-id)
- TraceId propagates to database layer (RLS context, query context)
- TraceId propagates to external service calls
- TraceId propagates to message queues
- TraceId propagates across frontend-backend boundaries

---

## Step 5: Post-Implementation Audit for Trace Propagation

### R09: Trace Propagation — Audit Procedures

**For code changes affecting service boundaries, HTTP calls, or external integrations:**

#### HTTP Header Propagation

- [ ] **MANDATORY:** Verify traceId extracted from incoming HTTP headers (x-trace-id)
- [ ] **MANDATORY:** Verify traceId added to outgoing HTTP headers (x-trace-id, x-span-id, x-request-id)
- [ ] **MANDATORY:** Verify traceId propagates through HTTP client calls (fetch, axios, etc.)
- [ ] **MANDATORY:** Verify traceId propagates through HTTP server responses (when applicable)

#### Service-to-Service Propagation

- [ ] **MANDATORY:** Verify traceId passed to downstream service methods
- [ ] **MANDATORY:** Verify traceId included in service call parameters
- [ ] **MANDATORY:** Verify traceId propagates through microservice calls
- [ ] **MANDATORY:** Verify traceId propagates through internal API calls

#### Database Layer Propagation

- [ ] **MANDATORY:** Verify traceId included in database query context
- [ ] **MANDATORY:** Verify traceId propagates to RLS context (app.trace_id)
- [ ] **MANDATORY:** Verify traceId included in Prisma query context
- [ ] **MANDATORY:** Verify traceId propagates to database transaction context

#### External Service Propagation

- [ ] **MANDATORY:** Verify traceId added to external API call headers
- [ ] **MANDATORY:** Verify traceId propagates to third-party service calls
- [ ] **MANDATORY:** Verify traceId included in webhook payloads (when applicable)
- [ ] **MANDATORY:** Verify traceId propagates to external integrations

#### Message Queue Propagation

- [ ] **MANDATORY:** Verify traceId included in message queue message headers
- [ ] **MANDATORY:** Verify traceId propagates to event payloads
- [ ] **MANDATORY:** Verify traceId extracted from message queue messages
- [ ] **MANDATORY:** Verify traceId propagates through async message processing

#### Frontend-Backend Propagation

- [ ] **MANDATORY:** Verify traceId extracted from API response headers
- [ ] **MANDATORY:** Verify traceId added to API request headers
- [ ] **MANDATORY:** Verify traceId propagates through frontend API calls
- [ ] **MANDATORY:** Verify traceId maintained across page navigation (session storage)

#### Trace Context Management

- [ ] **MANDATORY:** Verify traceId generated for new requests (when not present)
- [ ] **MANDATORY:** Verify traceId extended for new spans (when trace exists)
- [ ] **MANDATORY:** Verify traceId stored in request context
- [ ] **MANDATORY:** Verify traceId available throughout request lifecycle

#### Automated Checks

```bash
# Run trace propagation checker
python .cursor/scripts/check-trace-propagation.py --file <file_path>

# Check all changed files
python .cursor/scripts/check-trace-propagation.py --pr <PR_NUMBER>

# Expected: No violations found
```

#### OPA Policy

- **Policy:** `services/opa/policies/observability.rego` (R09 section)
- **Enforcement:** OVERRIDE (Tier 2 MAD) - Requires justification
- **Tests:** `services/opa/tests/observability_r09_test.rego`

#### Manual Verification (When Needed)

1. **Review Service Boundaries** - Identify all service-to-service calls
2. **Verify HTTP Propagation** - Check traceId in HTTP headers
3. **Check Database Propagation** - Verify traceId in query context
4. **Validate External Calls** - Verify traceId in external API headers

**Example Missing HTTP Header Propagation (VIOLATION):**

```typescript
// ❌ VIOLATION: HTTP call without traceId in headers
const response = await fetch('https://api.example.com/data', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
    // Missing x-trace-id header
  }
});
```

**Example Proper HTTP Header Propagation (CORRECT):**

```typescript
// ✅ CORRECT: HTTP call with traceId in headers
const traceContext = this.requestContext.getTraceContext();
const response = await fetch('https://api.example.com/data', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'x-trace-id': traceContext.traceId,
    'x-span-id': traceContext.spanId,
    'x-request-id': traceContext.requestId
  }
});
```

**Example Missing Service Propagation (VIOLATION):**

```typescript
// ❌ VIOLATION: Service call without traceId
await this.downstreamService.process(data); // Missing traceId parameter
```

**Example Proper Service Propagation (CORRECT):**

```typescript
// ✅ CORRECT: Service call with traceId
const traceId = this.requestContext.getTraceId();
await this.downstreamService.process(traceId, data);
```

**Example Missing Database Propagation (VIOLATION):**

```typescript
// ❌ VIOLATION: Database query without traceId in context
await this.prisma.user.findMany({
  where: { tenantId }
  // Missing traceId in query context
});
```

**Example Proper Database Propagation (CORRECT):**

```typescript
// ✅ CORRECT: Database query with traceId in context
const traceId = this.requestContext.getTraceId();
await this.prisma.$executeRaw`
  SET LOCAL app.trace_id = ${traceId};
  SELECT * FROM users WHERE tenant_id = ${tenantId};
`;
```

**Example Trace Context Utility Usage (CORRECT):**

```typescript
// ✅ CORRECT: Using trace propagation utilities
import { 
  extractTraceContextFromHeaders,
  addTraceContextToHeaders,
  createOrExtendTraceContext
} from '@common/utils/trace-propagation.util';

// Extract from incoming request
const traceContext = extractTraceContextFromHeaders(req.headers) 
  || createOrExtendTraceContext();

// Add to outgoing request
const headers = addTraceContextToHeaders({}, traceContext);
const response = await fetch(url, { headers });
```

---

**Last Updated:** 2025-12-04  
**Maintained By:** Platform Core Team  
**Review Frequency:** Quarterly or when observability requirements change





