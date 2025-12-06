---
title: Backend Architecture
category: Architecture
status: active
last_reviewed: 2025-12-05
owner: backend_team
related:
  - docs/architecture/system-overview.md
  - docs/architecture/database-architecture.md
  - docs/architecture/security.md
---

# Backend Architecture

## Overview

The VeroField backend is built with NestJS and TypeScript, following a modular architecture with clear separation of concerns and multi-tenant security.

## Directory Structure

```
backend/src/
├── accounts/            # Account management module
├── agreements/          # Service agreements module
├── auth/                # Authentication module
├── billing/             # Billing and payments module
├── crm/                 # CRM operations module
├── jobs/                # Job management module
├── kpis/                # KPI management module
├── layouts/             # Dashboard layouts module
├── routing/             # Route optimization module
├── technician/          # Technician management module
├── work-orders/         # Work order management module
├── common/              # Shared utilities and DTOs
│   ├── dto/             # Data Transfer Objects
│   ├── middleware/      # Shared middleware
│   └── services/        # Shared services
└── main.ts              # Application entry point
```

## Module Structure

Each module follows NestJS conventions:

```
module-name/
├── module-name.controller.ts    # HTTP endpoints
├── module-name.service.ts       # Business logic
├── module-name.module.ts        # Module definition
└── dto/                         # Data Transfer Objects
    ├── create-module.dto.ts
    └── update-module.dto.ts
```

## Core Modules

### Authentication (`auth/`)
- JWT token generation and validation
- User authentication
- Role-based access control
- Multi-tenant user management

### CRM (`crm/`)
- Customer account management
- Location management
- Customer search and filtering

### Jobs (`jobs/`)
- Job creation and scheduling
- Technician assignment
- Job status tracking
- Job completion handling

### Billing (`billing/`)
- Invoice generation
- Payment processing (Stripe integration)
- Payment history tracking

### Work Orders (`work-orders/`)
- Work order creation
- Service type management
- Recurring job management

## Middleware

### Tenant Middleware
Sets tenant context for each request:
```typescript
SET LOCAL app.tenant_id = <tenant_id>
SET LOCAL ROLE verofield_app
```

### Authentication Middleware
- Validates JWT tokens
- Extracts user and tenant information
- Attaches user context to request

## Database Access

### Prisma ORM
- Type-safe database access
- Migration management
- Schema definition

### Row Level Security (RLS)
- Automatic tenant isolation
- Policy-based access control
- Secure by default

## API Design

### RESTful Endpoints
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Resource-based URLs
- Consistent response formats

### Error Handling
- Standardized error responses
- Proper HTTP status codes
- Error logging and monitoring

## Security

### Multi-Tenant Isolation
- Row Level Security (RLS) policies
- Tenant-scoped queries
- Secure session management

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Permission checking

See [Security Architecture](security.md) for details.

## Related Documentation

- [Backend API](../guides/api/backend-api.md) - API endpoints
- [Database Architecture](database-architecture.md) - Database design
- [Security Architecture](security.md) - Security model
- [Tenant Context](../reference/tenant-context.md) - Multi-tenant details

---

**Last Updated:** 2025-12-05  
**Maintained By:** Backend Team  
**Review Frequency:** Quarterly






