---
# Cursor Rule Metadata
version: 1.0
project: VeroField
scope:
  - frontend
  - backend
  - mobile
  - microservices
priority: critical
last_updated: 2025-11-17
always_apply: true
---

# PRIORITY: CRITICAL - Security & Tenant Isolation

**⚠️ CRITICAL:** This file consolidates all security requirements for VeroField. All security rules are NON-NEGOTIABLE.

**Reference Documentation:**
- `docs/security.md` - Core security rules
- `docs/architecture/security.md` - Security architecture
- `docs/PRODUCTION_SECURITY_CHECKLIST.md` - Production security checklist
- `docs/SECURITY_SETUP_GUIDE.md` - Security setup guide
- `docs/WIDGET_SECURITY.md` - Widget security requirements
- `docs/PHASE_3_SECURITY_HARDENING.md` - Security hardening status

---

## PRIORITY: CRITICAL - Tenant Isolation & Row Level Security (RLS)

### Database Operations

**MANDATORY RULES:**
- ✅ **ALWAYS** verify `tenant_id` is set before database queries
- ✅ **ALWAYS** use RLS policies for tenant-scoped tables
- ✅ **ALWAYS** set tenant context per request: `SET LOCAL app.tenant_id = <tenant_id>`
- ✅ **ALWAYS** use `SET LOCAL ROLE verofield_app` for application queries
- ✅ **ALWAYS** verify tenant isolation is maintained in all queries
- ✅ **ALWAYS** use Prisma with RLS-aware queries (never bypass RLS)

**NEVER:**
- ❌ **NEVER** bypass tenant isolation
- ❌ **NEVER** expose tenant data across boundaries
- ❌ **NEVER** query without tenant_id filter
- ❌ **NEVER** use superuser roles in application requests
- ❌ **NEVER** disable RLS policies
- ❌ **NEVER** trust client-provided tenant_id

### API Operations

**MANDATORY RULES:**
- ✅ **ALWAYS** verify tenant context in requests
- ✅ **ALWAYS** use tenant middleware to set context
- ✅ **ALWAYS** extract tenant_id from authenticated JWT (never from request body/params)
- ✅ **ALWAYS** validate tenant_id matches authenticated user's tenant
- ✅ **ALWAYS** enforce tenant isolation at controller/service layer

**NEVER:**
- ❌ **NEVER** trust client-provided tenant_id
- ❌ **NEVER** skip authentication checks
- ❌ **NEVER** allow cross-tenant data access
- ❌ **NEVER** expose tenant_id in error messages

### RLS Policy Requirements

**MANDATORY:**
- ✅ All tenant-scoped tables MUST have RLS enabled
- ✅ RLS policies MUST enforce tenant isolation
- ✅ RLS policies MUST include soft-delete filtering (if applicable)
- ✅ RLS policies MUST support ACL-based sharing (if applicable)
- ✅ RLS policies MUST be tested for cross-tenant isolation

**Verification:**
- Before any database change: Verify RLS policies exist and are enabled
- After any schema change: Verify RLS policies are updated
- Test: Verify cross-tenant access is prevented

**Reference:** `docs/architecture/security.md` - Multi-Tenant Security section

---

## PRIORITY: CRITICAL - Authentication & Authorization

### JWT Authentication

**MANDATORY RULES:**
- ✅ **ALWAYS** validate JWT tokens on every request
- ✅ **ALWAYS** verify token signature and expiration
- ✅ **ALWAYS** extract tenant_id and roles from validated JWT
- ✅ **ALWAYS** use strong JWT secrets (minimum 32 characters, randomly generated)
- ✅ **ALWAYS** set appropriate token expiration (24h for access, 7d for refresh)
- ✅ **ALWAYS** store tokens securely (httpOnly cookies or secure storage)
- ✅ **ALWAYS** require HTTPS in production

**NEVER:**
- ❌ **NEVER** hardcode JWT secrets
- ❌ **NEVER** use weak JWT secrets
- ❌ **NEVER** skip token validation
- ❌ **NEVER** expose JWT secrets in logs or error messages
- ❌ **NEVER** use same secrets for dev/staging/prod

**Token Requirements:**
- JWT_SECRET must be at least 32 characters
- JWT_SECRET must be randomly generated (use `openssl rand -hex 64`)
- Different secrets for dev/staging/prod environments
- Secrets stored in environment variables (never in code)

### Role-Based Access Control (RBAC)

**MANDATORY RULES:**
- ✅ **ALWAYS** check permissions at controller/service layer
- ✅ **ALWAYS** use tenant-scoped permissions
- ✅ **ALWAYS** implement resource-level authorization
- ✅ **ALWAYS** verify user roles before allowing actions
- ✅ **ALWAYS** maintain audit trail for permission changes

**Roles:**
- `tenant_admin` - Full access to tenant
- `dispatcher` - Job scheduling and assignment
- `technician` - Job management and completion
- `accountant` - Billing and financial access
- `read_only` - Read-only access

**Permission Checking:**
- ✅ Check permissions at multiple layers (controller, service, database)
- ✅ Use centralized `AuthorizationService` (when implemented)
- ✅ Define permission constants (e.g., `dashboard_layout:read`, `dashboard_region:write`)
- ✅ Add guards/decorators to controllers for permission enforcement

**NEVER:**
- ❌ **NEVER** skip permission checks
- ❌ **NEVER** trust client-provided roles
- ❌ **NEVER** allow privilege escalation
- ❌ **NEVER** expose permission logic to client

**Reference:** `docs/architecture/security.md` - Role-Based Access Control section

---

## PRIORITY: CRITICAL - Reward Score Quality Enforcement (Anti-Gaming)

**Purpose:** Prevent artificial inflation of Reward Scores through low-quality additions.

**MANDATORY RULES:**
- ✅ **ALWAYS** ensure tests are substantive, accurate, and context-appropriate
- ✅ **ALWAYS** ensure documentation is meaningful and relevant to the changes
- ✅ **ALWAYS** prioritize quality over quantity
- ✅ **ALWAYS** verify tests actually test functionality (not just pass)
- ✅ **ALWAYS** verify documentation adds value (not just filler text)

**NEVER:**
- ❌ **NEVER** add low-quality, trivial, or meaningless tests for the purpose of increasing Reward Score
- ❌ **NEVER** add low-quality, trivial, or meaningless documentation for the purpose of increasing Reward Score
- ❌ **NEVER** add tests that don't actually test anything meaningful
- ❌ **NEVER** add documentation that doesn't provide useful information
- ❌ **NEVER** add placeholder comments or empty test cases just to meet requirements

**Quality Standards:**
- Tests must cover actual functionality, edge cases, and error conditions
- Tests must use proper assertions and mocking where appropriate
- Documentation must explain why, not just what
- Documentation must be accurate and up-to-date
- Better to have fewer high-quality tests than many trivial ones
- Better to have no documentation than misleading documentation

**Enforcement:**
- Cursor must verify test quality before adding tests
- Cursor must verify documentation value before adding documentation
- If in doubt, prioritize correctness and usefulness over score points
- Reference `.cursor/reward_rubric.yaml` for quality requirements

**Reference:** `.cursor/rules.md` - REWARD SCORE IMPROVEMENT RULE

---

## PRIORITY: CRITICAL - Secrets Management

### Environment Variables

**MANDATORY RULES:**
- ✅ **ALWAYS** use environment variables for all secrets
- ✅ **ALWAYS** exclude `.env` files from version control (`.gitignore` verified)
- ✅ **ALWAYS** create `env.example` template files
- ✅ **ALWAYS** validate required environment variables at startup
- ✅ **ALWAYS** use different secrets for dev/staging/prod
- ✅ **ALWAYS** use secret management services in production (AWS Secrets Manager, Vercel, etc.)

**NEVER:**
- ❌ **NEVER** commit `.env` files
- ❌ **NEVER** hardcode secrets in source code
- ❌ **NEVER** use production keys in development
- ❌ **NEVER** share secrets in chat/email
- ❌ **NEVER** use weak secrets
- ❌ **NEVER** expose secrets in error messages
- ❌ **NEVER** log secrets

### Secret Requirements

**JWT_SECRET:**
- Minimum 32 characters
- Randomly generated (use `openssl rand -hex 64`)
- Different for each environment

**Database Credentials:**
- Stored securely (not in code)
- Use SSL/TLS for connections
- Rotated regularly

**Supabase Keys:**
- Production keys only in production
- Service role key stored securely
- Anon key can be public (but validate usage)

**Key Rotation:**
- Rotate keys regularly
- Rotate immediately if exposed
- Document rotation procedures

**Reference:** `docs/SECURITY_SETUP_GUIDE.md` - Secrets Management section

---

## PRIORITY: CRITICAL - Input Validation & XSS Prevention

### Input Validation

**MANDATORY RULES:**
- ✅ **ALWAYS** validate all user inputs on the backend
- ✅ **ALWAYS** use shared validation constants consistently
- ✅ **ALWAYS** enforce input size limits
- ✅ **ALWAYS** validate file uploads (type, size, content)
- ✅ **ALWAYS** use parameterized queries (Prisma handles this)
- ✅ **ALWAYS** validate against schemas (DTOs, JSON Schema)

**NEVER:**
- ❌ **NEVER** trust client input
- ❌ **NEVER** skip input validation
- ❌ **NEVER** use SQL concatenation
- ❌ **NEVER** allow arbitrary file uploads
- ❌ **NEVER** expose validation errors with sensitive details

### XSS Prevention

**MANDATORY RULES:**
- ✅ **ALWAYS** sanitize HTML content before storage
- ✅ **ALWAYS** sanitize config objects recursively
- ✅ **ALWAYS** validate for XSS vectors:
  - Script tags (`<script>`)
  - `javascript:` protocol
  - Event handlers (`on*` attributes)
  - `eval()` calls
- ✅ **ALWAYS** use React's built-in XSS protection (don't use `dangerouslySetInnerHTML` unless necessary)
- ✅ **ALWAYS** sanitize widget configs before storage

**Sanitization Points:**
- Backend: `RegionValidationService.validateConfigForXSS()`
- Frontend: `frontend/src/lib/sanitization.ts`
- Backend Middleware: `WidgetSecurityMiddleware`
- Shared: `shared/validation/region-constants.ts`

**NEVER:**
- ❌ **NEVER** use `dangerouslySetInnerHTML` without sanitization
- ❌ **NEVER** allow `eval()` or `Function()` constructors
- ❌ **NEVER** trust widget configs without validation
- ❌ **NEVER** skip sanitization for user-generated content

**Reference:** `docs/PHASE_3_SECURITY_HARDENING.md` - Centralized Validation and XSS Safety section

---

## PRIORITY: HIGH - Production Security Requirements

### Security Headers

**MANDATORY RULES:**
- ✅ **ALWAYS** configure Content Security Policy (CSP) headers
- ✅ **ALWAYS** set `X-Frame-Options: SAMEORIGIN`
- ✅ **ALWAYS** set `X-Content-Type-Options: nosniff`
- ✅ **ALWAYS** set `Referrer-Policy: strict-origin-when-cross-origin`
- ✅ **ALWAYS** set `Permissions-Policy` appropriately
- ✅ **ALWAYS** set `X-XSS-Protection: 1; mode=block`
- ✅ **ALWAYS** configure HSTS headers (if using HTTPS)

**CSP Configuration:**
- Use nonce-based inline script support (not `unsafe-inline`)
- Minimize `unsafe-eval` (only where necessary for widgets)
- Allow only necessary sources
- Test CSP doesn't break functionality

**Implementation:**
- `backend/src/common/middleware/security-headers.middleware.ts` - Security headers middleware
- Must be registered in application middleware

**Reference:** `docs/PRODUCTION_SECURITY_CHECKLIST.md` - Security Headers section

### Rate Limiting

**MANDATORY RULES:**
- ✅ **ALWAYS** enable rate limiting on dashboard routes
- ✅ **ALWAYS** configure appropriate rate limits for production traffic
- ✅ **ALWAYS** return rate limit headers (`X-RateLimit-*`)
- ✅ **ALWAYS** configure rate limit tiers (free, basic, premium, enterprise)
- ✅ **ALWAYS** ensure rate limiting doesn't block legitimate users

**Verification:**
- Test rate limiting in production
- Monitor rate limit violations
- Adjust limits based on traffic patterns

**Reference:** `docs/PRODUCTION_SECURITY_CHECKLIST.md` - Rate Limiting section

### CORS Configuration

**MANDATORY RULES:**
- ✅ **ALWAYS** configure CORS for production domains only
- ✅ **ALWAYS** exclude development origins (`localhost`, `127.0.0.1`) in production
- ✅ **ALWAYS** configure CORS credentials properly
- ✅ **ALWAYS** handle CORS preflight requests correctly
- ✅ **ALWAYS** test CORS configuration

**NEVER:**
- ❌ **NEVER** allow `*` origin in production
- ❌ **NEVER** include localhost in production CORS
- ❌ **NEVER** skip CORS validation

**Reference:** `docs/PRODUCTION_SECURITY_CHECKLIST.md` - CORS Configuration section

### Network Security

**MANDATORY RULES:**
- ✅ **ALWAYS** enforce HTTPS for all endpoints in production
- ✅ **ALWAYS** ensure SSL/TLS certificates are valid and not expired
- ✅ **ALWAYS** configure HTTP to HTTPS redirect
- ✅ **ALWAYS** set HSTS headers
- ✅ **ALWAYS** ensure API endpoints require authentication
- ✅ **ALWAYS** ensure database is not publicly accessible

**Reference:** `docs/PRODUCTION_SECURITY_CHECKLIST.md` - Network Security section

---

## PRIORITY: HIGH - Widget Security

### Sandboxing

**MANDATORY RULES:**
- ✅ **ALWAYS** render widgets in isolated iframes
- ✅ **ALWAYS** enforce strict Content Security Policy for widgets
- ✅ **ALWAYS** validate widget origin for postMessage communication
- ✅ **ALWAYS** prevent widgets from being embedded elsewhere (`frame-ancestors 'none'`)

**Widget CSP:**
```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'none';
```

### Widget Manifest Security

**MANDATORY RULES:**
- ✅ **ALWAYS** validate widget manifest:
  - `widget_id`: Alphanumeric, hyphens, underscores only
  - `entry_point`: Must be valid HTTPS URL
  - `config_schema`: Valid JSON Schema
- ✅ **ALWAYS** require approval workflow for widgets
- ✅ **ALWAYS** validate widget signatures (when implemented)

### Widget Data Sanitization

**MANDATORY RULES:**
- ✅ **ALWAYS** sanitize widget configs before storage
- ✅ **ALWAYS** remove XSS vectors from widget configs
- ✅ **ALWAYS** validate config values against schema
- ✅ **ALWAYS** sanitize HTML for user inputs in widgets

### Widget PII Handling

**MANDATORY RULES:**
- ✅ **ALWAYS** tag widgets that display PII (`pii_tags: ['email', 'phone', 'address']`)
- ✅ **ALWAYS** support PII masking in preview modes
- ✅ **ALWAYS** audit log PII access

### Widget Message Validation

**MANDATORY RULES:**
- ✅ **ALWAYS** validate postMessage origin matches widget manifest
- ✅ **ALWAYS** validate message source is window.parent
- ✅ **ALWAYS** whitelist allowed communication patterns

**NEVER:**
- ❌ **NEVER** trust widget configs without validation
- ❌ **NEVER** allow widgets to access parent window directly
- ❌ **NEVER** skip widget approval workflow
- ❌ **NEVER** allow malicious widgets to execute

**Reference:** `docs/WIDGET_SECURITY.md` - Complete widget security guide

---

## PRIORITY: HIGH - OWASP Security Testing

### OWASP Top 10 Testing Requirements

**MANDATORY RULES:**
- ✅ **ALWAYS** test for injection attacks (SQL, NoSQL, command injection)
- ✅ **ALWAYS** test for broken authentication (credential stuffing, session fixation)
- ✅ **ALWAYS** test for sensitive data exposure
- ✅ **ALWAYS** test for XML external entities (XXE)
- ✅ **ALWAYS** test for broken access control
- ✅ **ALWAYS** test for security misconfiguration
- ✅ **ALWAYS** test for XSS (stored, reflected, DOM-based)
- ✅ **ALWAYS** test for insecure deserialization
- ✅ **ALWAYS** test for using components with known vulnerabilities
- ✅ **ALWAYS** test for insufficient logging and monitoring

**Test Implementation:**
- `backend/test/security/owasp-security.test.ts` - OWASP security test suite
- Must be run as part of CI/CD pipeline
- Must be updated when new vulnerabilities are discovered

**Test Generation:**
- When creating new endpoints: Generate OWASP tests
- When modifying authentication: Update OWASP tests
- When adding input validation: Add OWASP tests

**Reference:** `backend/test/security/owasp-security.test.ts` - OWASP test implementation

---

## PRIORITY: MODERATE - Monitoring & Audit Logging

### Audit Logging

**MANDATORY RULES:**
- ✅ **ALWAYS** log user authentication events
- ✅ **ALWAYS** log data modifications (create, update, delete)
- ✅ **ALWAYS** log permission changes
- ✅ **ALWAYS** log security events (failed login, unauthorized access)
- ✅ **ALWAYS** include in audit logs:
  - Tenant ID
  - User ID
  - Action type
  - Resource type and ID
  - Before/after state (for modifications)
  - Timestamp
  - IP address
  - User agent

**NEVER:**
- ❌ **NEVER** log sensitive data (passwords, secrets, PII)
- ❌ **NEVER** skip audit logging for sensitive operations
- ❌ **NEVER** expose audit logs to unauthorized users

### Error Tracking

**MANDATORY RULES:**
- ✅ **ALWAYS** configure Sentry for production (backend and frontend)
- ✅ **ALWAYS** filter sensitive data from error reports
- ✅ **ALWAYS** include user context in error reports (without PII)
- ✅ **ALWAYS** test error tracking is working

### Structured Logging

**MANDATORY RULES:**
- ✅ **ALWAYS** use structured logging
- ✅ **ALWAYS** set appropriate log levels (INFO, WARN, ERROR)
- ✅ **ALWAYS** configure log aggregation (CloudWatch, Datadog, etc.)
- ✅ **ALWAYS** set log retention policies

**Reference:** `docs/PRODUCTION_SECURITY_CHECKLIST.md` - Monitoring & Logging section

---

## Security Checklist (Quick Reference)

### Before Any Database Operation:
- [ ] Verify tenant_id is set
- [ ] Verify RLS policies are enabled
- [ ] Verify tenant context is set
- [ ] Verify no cross-tenant access possible

### Before Any API Endpoint:
- [ ] Verify authentication is required
- [ ] Verify authorization is checked
- [ ] Verify tenant isolation is enforced
- [ ] Verify input validation is implemented
- [ ] Verify XSS prevention is in place

### Before Any Code Change:
- [ ] Verify no secrets are hardcoded
- [ ] Verify environment variables are used
- [ ] Verify `.env` files are gitignored
- [ ] Verify security headers are configured
- [ ] Verify audit logging is implemented

### Before Production Deployment:
- [ ] Complete `docs/PRODUCTION_SECURITY_CHECKLIST.md`
- [ ] Verify all security headers are set
- [ ] Verify rate limiting is enabled
- [ ] Verify CORS is configured correctly
- [ ] Verify HTTPS is enforced
- [ ] Verify monitoring is configured
- [ ] Verify OWASP tests pass

---

## Security Anti-Patterns

### ❌ DO NOT:
- Break tenant isolation
- Commit `.env` files or secrets
- Hardcode credentials
- Skip authentication checks
- Expose sensitive data in error messages
- Trust client-provided tenant_id
- Bypass RLS policies
- Skip input validation
- Use `dangerouslySetInnerHTML` without sanitization
- Allow SQL injection (use Prisma parameterized queries)
- Skip OWASP security testing
- Deploy without security headers
- Allow cross-tenant data access
- Log sensitive data
- Expose secrets in logs or errors

### ✅ DO:
- Use environment variables for all secrets
- Verify tenant isolation in all operations
- Use existing authentication patterns
- Maintain audit logging
- Validate all input data
- Sanitize all user-generated content
- Use security headers
- Enable rate limiting
- Configure CORS properly
- Test with OWASP security tests
- Monitor security events
- Rotate keys regularly
- Use strong, randomly generated secrets
- Follow security setup guide

---

## References

**Primary Documentation:**
- `docs/security.md` - Core security rules
- `docs/architecture/security.md` - Security architecture
- `docs/PRODUCTION_SECURITY_CHECKLIST.md` - Production security checklist
- `docs/SECURITY_SETUP_GUIDE.md` - Security setup guide
- `docs/WIDGET_SECURITY.md` - Widget security requirements
- `docs/PHASE_3_SECURITY_HARDENING.md` - Security hardening status

**Implementation Files:**
- `backend/src/common/middleware/security-headers.middleware.ts` - Security headers
- `backend/test/security/owasp-security.test.ts` - OWASP security tests

**Related Rules:**
- `.cursor/rules/enforcement.md` - Rule enforcement checklist
- `.cursor/rules/core.md` - Core philosophy (Security > Speed)
- `.cursor/prompts/security_review.md` - Security review prompt

---

**Last Updated:** 2025-11-17  
**Maintained By:** Security Team  
**Review Frequency:** Quarterly or when security requirements change


