# R12: Security Event Logging — Step 5 Procedures (DRAFT)

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R12 - Security Event Logging  
**Priority:** HIGH (Tier 2 - OVERRIDE)  
**MAD Tier:** 2 (OVERRIDE REQUIRED - Needs justification)

---

## Purpose

R12 ensures that all security events are properly logged for audit trails, compliance, and security monitoring:

- **Authentication Events:** Login attempts (success/failure), logout, token refresh, password changes
- **Authorization Events:** Permission checks, role changes, access denials
- **PII Access Events:** Access to sensitive data in privileged contexts (admin, security diagnostics)
- **Security Policy Changes:** RLS policy changes, permission changes, role assignments
- **Admin Actions:** Impersonation, privilege escalation, security configuration changes
- **Financial Transactions:** Payment processing, refunds, billing changes

**Key Requirements:**
- Security events must be logged using AuditService
- Log metadata only, never raw PII values (SOC2/privacy compliance)
- Include required fields: tenantId, userId, action, resourceType, resourceId, timestamp, ipAddress
- Security events must be logged even if main operation fails
- Audit logs must be immutable and tamper-proof

---

## Step 5: Post-Implementation Audit for Security Event Logging

### R12: Security Event Logging — Audit Procedures

**For code changes affecting authentication, authorization, PII access, security policies, or admin actions:**

#### Authentication Event Logging

- [ ] **MANDATORY:** Verify login attempts are logged (success and failure)
- [ ] **MANDATORY:** Verify logout events are logged
- [ ] **MANDATORY:** Verify password changes are logged
- [ ] **MANDATORY:** Verify token refresh events are logged (if applicable)
- [ ] **MANDATORY:** Verify authentication failures include: userId (if known), email (hashed or partial), ipAddress, reason
- [ ] **MANDATORY:** Verify authentication logs do NOT include passwords or tokens
- [ ] **MANDATORY:** Verify authentication logs include tenantId
- [ ] **RECOMMENDED:** Verify suspicious login patterns are detected and logged (multiple failures, unusual locations)

#### Authorization Event Logging

- [ ] **MANDATORY:** Verify permission denials are logged
- [ ] **MANDATORY:** Verify role changes are logged (assignments, removals)
- [ ] **MANDATORY:** Verify permission changes are logged (grants, revocations)
- [ ] **MANDATORY:** Verify authorization logs include: userId, resourceType, resourceId, action, requiredPermission
- [ ] **MANDATORY:** Verify authorization logs include tenantId
- [ ] **MANDATORY:** Verify authorization logs include ipAddress and userAgent
- [ ] **RECOMMENDED:** Verify repeated authorization failures trigger alerts

#### PII Access Event Logging

- [ ] **MANDATORY:** Verify PII access in privileged contexts is logged (admin, security diagnostics)
- [ ] **MANDATORY:** Verify PII modifications are logged (create, update, delete)
- [ ] **MANDATORY:** Verify PII exports are logged (bulk exports, data downloads)
- [ ] **MANDATORY:** Verify PII logs include: userId, resourceType, resourceId, action, dataType (not raw PII)
- [ ] **MANDATORY:** Verify PII logs do NOT include raw PII values (only metadata)
- [ ] **MANDATORY:** Verify PII logs include tenantId
- [ ] **MANDATORY:** Verify PII logs include access reason/justification (if applicable)
- [ ] **RECOMMENDED:** Verify PII access logs include data classification level

#### Security Policy Change Logging

- [ ] **MANDATORY:** Verify RLS policy changes are logged
- [ ] **MANDATORY:** Verify permission policy changes are logged
- [ ] **MANDATORY:** Verify role definition changes are logged
- [ ] **MANDATORY:** Verify security configuration changes are logged
- [ ] **MANDATORY:** Verify policy change logs include: userId, policyType, policyName, beforeState, afterState
- [ ] **MANDATORY:** Verify policy change logs include tenantId
- [ ] **MANDATORY:** Verify policy change logs include change reason/justification

#### Admin Action Logging

- [ ] **MANDATORY:** Verify user impersonation is logged
- [ ] **MANDATORY:** Verify privilege escalation is logged
- [ ] **MANDATORY:** Verify admin user management is logged (create, update, delete, suspend)
- [ ] **MANDATORY:** Verify admin configuration changes are logged
- [ ] **MANDATORY:** Verify admin action logs include: adminUserId, targetUserId (if applicable), action, resourceType, resourceId
- [ ] **MANDATORY:** Verify admin action logs include tenantId
- [ ] **MANDATORY:** Verify admin action logs include ipAddress and userAgent
- [ ] **RECOMMENDED:** Verify admin actions require additional approval/confirmation

#### Financial Transaction Logging

- [ ] **MANDATORY:** Verify payment processing is logged
- [ ] **MANDATORY:** Verify refunds are logged
- [ ] **MANDATORY:** Verify billing changes are logged
- [ ] **MANDATORY:** Verify financial transaction logs include: userId, transactionType, amount, currency, transactionId
- [ ] **MANDATORY:** Verify financial transaction logs do NOT include full credit card numbers (only last 4 digits)
- [ ] **MANDATORY:** Verify financial transaction logs include tenantId
- [ ] **MANDATORY:** Verify financial transaction logs include beforeState and afterState

#### Audit Log Format

- [ ] **MANDATORY:** Verify audit logs use AuditService.log() method
- [ ] **MANDATORY:** Verify audit logs include required fields: tenantId, userId, action, resourceType, resourceId
- [ ] **MANDATORY:** Verify audit logs include optional fields when applicable: beforeState, afterState, ipAddress, userAgent, requestId
- [ ] **MANDATORY:** Verify audit logs are structured (JSON format)
- [ ] **MANDATORY:** Verify audit logs include timestamp (ISO 8601)
- [ ] **MANDATORY:** Verify audit logs include traceId (for correlation)
- [ ] **RECOMMENDED:** Verify audit logs are stored in immutable storage

#### Privacy Compliance

- [ ] **MANDATORY:** Verify no raw PII values are logged (only metadata)
- [ ] **MANDATORY:** Verify no passwords are logged
- [ ] **MANDATORY:** Verify no tokens are logged (only token type/metadata)
- [ ] **MANDATORY:** Verify no credit card numbers are logged (only last 4 digits)
- [ ] **MANDATORY:** Verify no SSNs are logged (only metadata)
- [ ] **MANDATORY:** Verify PII access logs comply with SOC2/privacy requirements
- [ ] **RECOMMENDED:** Verify audit logs are encrypted at rest

#### Error Handling

- [ ] **MANDATORY:** Verify audit logging failures do not break main operations
- [ ] **MANDATORY:** Verify audit logging failures are logged (structured logging)
- [ ] **MANDATORY:** Verify audit logging uses try-catch blocks
- [ ] **MANDATORY:** Verify audit logging failures are monitored and alerted
- [ ] **RECOMMENDED:** Verify audit logging has retry mechanism for transient failures

#### Automated Checks

```bash
# Run security event logging checker
python .cursor/scripts/check-security-logging.py --file <file_path>

# Check all changed files
python .cursor/scripts/check-security-logging.py --pr <PR_NUMBER>

# Check specific security event types
python .cursor/scripts/check-security-logging.py --event-type auth

# Expected: No violations found
```

#### OPA Policy

- **Policy:** `services/opa/policies/security.rego` (R12 section)
- **Enforcement:** OVERRIDE (Tier 2 MAD) - Requires justification
- **Tests:** `services/opa/tests/security_r12_test.rego`

#### Manual Verification (When Needed)

1. **Review Security Events** - Identify all security events in changed code
2. **Verify Audit Logging** - Check that all security events are logged
3. **Check Privacy Compliance** - Verify no raw PII values are logged
4. **Validate Log Format** - Verify audit logs include required fields

**Example Authentication Event Logging (✅):**

```typescript
// ✅ CORRECT: Authentication event logged
async login(email: string, password: string, ipAddress: string, userAgent: string) {
  try {
    const user = await this.validateCredentials(email, password);
    
    // Log successful login
    await this.auditService.log({
      tenantId: user.tenant_id,
      userId: user.id,
      action: 'USER_LOGIN_SUCCESS',
      resourceType: 'User',
      resourceId: user.id,
      ipAddress,
      userAgent,
      requestId: this.requestContext.getRequestId()
    });
    
    return this.generateToken(user);
  } catch (error) {
    // Log failed login (without password)
    await this.auditService.log({
      tenantId: null, // Unknown tenant on failed login
      userId: null, // Unknown user on failed login
      action: 'USER_LOGIN_FAILED',
      resourceType: 'User',
      resourceId: null,
      ipAddress,
      userAgent,
      afterState: { reason: error.message }, // Log reason, not password
      requestId: this.requestContext.getRequestId()
    });
    
    throw error;
  }
}
```

**Example Missing Authentication Logging (❌):**

```typescript
// ❌ VIOLATION: Authentication event not logged
async login(email: string, password: string) {
  const user = await this.validateCredentials(email, password);
  return this.generateToken(user);
  // Missing audit log - VIOLATION
}
```

**Example Authorization Event Logging (✅):**

```typescript
// ✅ CORRECT: Authorization event logged
async checkPermission(userId: string, resource: string, action: string) {
  const hasPermission = await this.permissionsService.hasPermission(userId, resource, action);
  
  if (!hasPermission) {
    // Log permission denial
    await this.auditService.log({
      tenantId: this.requestContext.getTenantId(),
      userId,
      action: 'PERMISSION_DENIED',
      resourceType: resource,
      resourceId: null,
      afterState: {
        requiredPermission: `${resource}:${action}`,
        reason: 'User does not have required permission'
      },
      ipAddress: this.requestContext.getIpAddress(),
      userAgent: this.requestContext.getUserAgent(),
      requestId: this.requestContext.getRequestId()
    });
    
    throw new ForbiddenException('Permission denied');
  }
  
  return true;
}
```

**Example PII Access Logging (✅):**

```typescript
// ✅ CORRECT: PII access logged (metadata only, no raw PII)
async getCustomerPII(customerId: string, adminUserId: string) {
  const customer = await this.db.customer.findUnique({
    where: { id: customerId },
    select: {
      id: true,
      email: true, // PII
      phone: true, // PII
      ssn: true, // Sensitive PII
    }
  });
  
  // Log PII access (metadata only, not raw values)
  await this.auditService.log({
    tenantId: this.requestContext.getTenantId(),
    userId: adminUserId,
    action: 'PII_ACCESS',
    resourceType: 'Customer',
    resourceId: customerId,
    afterState: {
      dataTypes: ['email', 'phone', 'ssn'], // Types accessed, not values
      accessReason: 'Admin security diagnostics',
      dataClassification: 'SENSITIVE'
    },
    ipAddress: this.requestContext.getIpAddress(),
    userAgent: this.requestContext.getUserAgent(),
    requestId: this.requestContext.getRequestId()
  });
  
  return customer;
}
```

**Example Missing PII Access Logging (❌):**

```typescript
// ❌ VIOLATION: PII access not logged
async getCustomerPII(customerId: string, adminUserId: string) {
  const customer = await this.db.customer.findUnique({
    where: { id: customerId },
    select: {
      email: true, // PII
      phone: true, // PII
      ssn: true, // Sensitive PII
    }
  });
  
  // Missing audit log for PII access - VIOLATION
  return customer;
}
```

**Example Admin Action Logging (✅):**

```typescript
// ✅ CORRECT: Admin action logged
async impersonateUser(adminUserId: string, targetUserId: string) {
  // Verify admin has permission
  await this.checkAdminPermission(adminUserId, 'USER_IMPERSONATE');
  
  // Log impersonation
  await this.auditService.log({
    tenantId: this.requestContext.getTenantId(),
    userId: adminUserId,
    action: 'USER_IMPERSONATION',
    resourceType: 'User',
    resourceId: targetUserId,
    afterState: {
      impersonatedUserId: targetUserId,
      reason: 'Admin support request'
    },
    ipAddress: this.requestContext.getIpAddress(),
    userAgent: this.requestContext.getUserAgent(),
    requestId: this.requestContext.getRequestId()
  });
  
  return this.generateImpersonationToken(targetUserId);
}
```

**Example Privacy Violation (❌):**

```typescript
// ❌ VIOLATION: Raw PII logged
async updateCustomer(customerId: string, data: UpdateCustomerDto) {
  const customer = await this.db.customer.update({
    where: { id: customerId },
    data
  });
  
  // VIOLATION: Logging raw PII values
  await this.auditService.log({
    tenantId: customer.tenant_id,
    userId: this.requestContext.getUserId(),
    action: 'CUSTOMER_UPDATE',
    resourceType: 'Customer',
    resourceId: customerId,
    afterState: {
      email: customer.email, // VIOLATION: Raw PII
      ssn: customer.ssn, // VIOLATION: Raw sensitive PII
    }
  });
  
  return customer;
}
```

**Example Privacy Compliant Logging (✅):**

```typescript
// ✅ CORRECT: Metadata only, no raw PII
async updateCustomer(customerId: string, data: UpdateCustomerDto) {
  const customer = await this.db.customer.update({
    where: { id: customerId },
    data
  });
  
  // CORRECT: Logging metadata only
  await this.auditService.log({
    tenantId: customer.tenant_id,
    userId: this.requestContext.getUserId(),
    action: 'CUSTOMER_UPDATE',
    resourceType: 'Customer',
    resourceId: customerId,
    afterState: {
      fieldsUpdated: Object.keys(data), // Fields changed, not values
      dataTypes: ['email', 'phone'], // Types modified, not values
    },
    ipAddress: this.requestContext.getIpAddress(),
    userAgent: this.requestContext.getUserAgent(),
    requestId: this.requestContext.getRequestId()
  });
  
  return customer;
}
```

---

**Last Updated:** 2025-11-23  
**Maintained By:** Security Team  
**Review Frequency:** Quarterly or when security requirements change



