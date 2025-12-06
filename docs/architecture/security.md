---
title: Security Architecture
category: Architecture
status: active
last_reviewed: 2025-12-05
owner: backend_team
related:
  - docs/reference/tenant-context.md
  - docs/architecture/database-architecture.md
  - docs/guides/deployment/production.md
---

# Security Architecture

## Overview

VeroField implements a comprehensive multi-tenant security model using PostgreSQL Row Level Security (RLS), JWT authentication, and role-based access control.

## Security Layers

### 1. Authentication
- JWT-based authentication
- Token validation on every request
- Secure token storage
- Token expiration and refresh

### 2. Authorization
- Role-based access control (RBAC)
- Permission checking at controller/service layer
- Tenant-scoped permissions
- Resource-level authorization

### 3. Data Isolation
- Row Level Security (RLS) policies
- Tenant-scoped queries
- Automatic data filtering
- Cross-tenant access prevention

## Multi-Tenant Security

### Tenant Isolation
- Each tenant's data is completely isolated
- RLS policies enforce isolation at database level
- Tenant context set per request
- No cross-tenant data leakage possible

### Tenant Context
```typescript
// Set tenant for current request
SET LOCAL app.tenant_id = <tenant_id>
SET LOCAL ROLE verofield_app

// All queries automatically filtered by RLS
```

See [Tenant Context Reference](../reference/tenant-context.md) for details.

## Authentication Flow

```
1. User Login
   ↓
2. Validate Credentials
   ↓
3. Generate JWT (includes tenant_id, roles)
   ↓
4. Return Token to Client
   ↓
5. Client includes Token in Requests
   ↓
6. Server validates Token
   ↓
7. Extract tenant_id and roles
   ↓
8. Set tenant context
   ↓
9. Process request with tenant isolation
```

## Role-Based Access Control

### Roles
- `tenant_admin` - Full access to tenant
- `dispatcher` - Job scheduling and assignment
- `technician` - Job management and completion
- `accountant` - Billing and financial access
- `read_only` - Read-only access

### Permissions
- Role-based permission checking
- Resource-level permissions
- Action-based permissions
- Dynamic permission evaluation

## Security Best Practices

### Data Protection
- ✅ All tenant-scoped tables have RLS enabled
- ✅ Tenant context set for every request
- ✅ No superuser roles in application requests
- ✅ Audit logging for sensitive actions

### Authentication
- ✅ Strong JWT secrets
- ✅ Token expiration
- ✅ Secure token storage
- ✅ HTTPS only in production

### Authorization
- ✅ Permission checking at multiple layers
- ✅ Resource-level authorization
- ✅ Tenant-scoped permissions
- ✅ Audit trail for access

## Audit Logging

### Logged Actions
- User authentication
- Data modifications
- Permission changes
- Security events

### Audit Log Structure
- Tenant ID
- User ID
- Action type
- Resource type and ID
- Before/after state
- Timestamp
- IP address
- User agent

## Security Checklist

- [ ] RLS enabled on all tenant tables
- [ ] Tenant context set for every request
- [ ] JWT validation on all endpoints
- [ ] Permission checking implemented
- [ ] Audit logging enabled
- [ ] HTTPS enforced in production
- [ ] Secrets stored securely
- [ ] Input validation on all inputs
- [ ] SQL injection prevention (Prisma)
- [ ] XSS prevention (React)

## Related Documentation

- [Tenant Context Reference](../reference/tenant-context.md) - Multi-tenant details
- [Database Architecture](database-architecture.md) - Database security
- [Security Setup Guide](../guides/deployment/production.md#security) - Setup instructions
- [API Documentation](../guides/api/backend-api.md#authentication) - Auth endpoints

---

**Last Updated:** 2025-12-05  
**Maintained By:** Backend Team  
**Review Frequency:** Quarterly
