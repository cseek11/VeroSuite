# Documentation Context Map

This map organizes documentation by system context to help developers find relevant information quickly.

## Context Overview

| Context | Key Documentation | Related Areas |
|---------|-------------------|---------------|
| **Frontend** | Component library, styling guide, form patterns | UI, React, TypeScript |
| **Backend** | API docs, backend architecture | NestJS, Prisma, PostgreSQL |
| **Database** | Schema reference, migrations, RLS | PostgreSQL, Supabase |
| **Security** | Security architecture, tenant context | Multi-tenancy, RLS, JWT |
| **Deployment** | Production guide, troubleshooting | DevOps, CI/CD |
| **AI/ML** | AI assistant guide, best practices | AI development, consistency |

## Frontend Context

### Core Documentation
- [Component Library Guide](../guides/development/component-library.md) - UI component usage
- [Styling Guide](../guides/development/styling-guide.md) - Design system and CSS
- [Form Patterns](../guides/development/form-patterns.md) - Form implementation
- [Frontend Architecture](../architecture/frontend-architecture.md) - Frontend structure

### Reference
- [Component Catalog](./component-catalog.md) - Complete component reference
- [Design System](./design-system.md) - Design tokens and patterns
- [Frontend API](../guides/api/frontend-api.md) - API client usage

### Related
- [Development Best Practices](../guides/development/best-practices.md) - Coding standards
- [AI Assistant Guide](../guides/development/ai-assistant-guide.md) - AI development protocol

## Backend Context

### Core Documentation
- [Backend API](../guides/api/backend-api.md) - REST API endpoints
- [Backend Architecture](../architecture/backend-architecture.md) - Backend structure
- [Security Architecture](../architecture/security.md) - Security model

### Reference
- [Database Schema](./database-schema.md) - Database structure
- [Tenant Context](./tenant-context.md) - Multi-tenant architecture

### Related
- [Production Deployment](../guides/deployment/production.md) - Deployment guide
- [Database Migrations](../guides/deployment/database-migrations.md) - Migration process

## Database Context

### Core Documentation
- [Database Schema](./database-schema.md) - Complete schema reference
- [Database Architecture](../architecture/database-architecture.md) - Database design
- [Tenant Context](./tenant-context.md) - Multi-tenant data isolation

### Reference
- [Database Migrations](../guides/deployment/database-migrations.md) - Migration guide
- [RLS Policies](./database-schema.md#row-level-security) - Security policies

### Related
- [Backend Architecture](../architecture/backend-architecture.md) - Backend integration
- [Security Architecture](../architecture/security.md) - Security model

## Security Context

### Core Documentation
- [Security Architecture](../architecture/security.md) - Security model
- [Tenant Context](./tenant-context.md) - Multi-tenant security
- [Database Schema](./database-schema.md#row-level-security) - RLS policies

### Reference
- [Backend API](../guides/api/backend-api.md#authentication) - Auth endpoints
- [Production Deployment](../guides/deployment/production.md#security) - Security setup

### Related
- [Backend Architecture](../architecture/backend-architecture.md) - Backend security
- [Database Architecture](../architecture/database-architecture.md) - Database security

## Deployment Context

### Core Documentation
- [Production Deployment](../guides/deployment/production.md) - Production setup
- [Database Migrations](../guides/deployment/database-migrations.md) - Migration process
- [Troubleshooting](../guides/deployment/troubleshooting.md) - Common issues

### Reference
- [Backend Architecture](../architecture/backend-architecture.md) - System architecture
- [Security Architecture](../architecture/security.md) - Security setup

### Related
- [Getting Started](../guides/getting-started/setup.md) - Development setup
- [Backend API](../guides/api/backend-api.md) - API documentation

## AI/ML Context

### Core Documentation
- [AI Assistant Guide](../guides/development/ai-assistant-guide.md) - AI development protocol
- [Development Best Practices](../guides/development/best-practices.md) - AI consistency rules

### Reference
- [Component Library Guide](../guides/development/component-library.md) - Component discovery
- [Form Patterns](../guides/development/form-patterns.md) - Pattern matching

### Related
- [Development Best Practices](../guides/development/best-practices.md) - Coding standards
- [Component Catalog](./component-catalog.md) - Component reference

## Cross-Context Navigation

### Building a Feature
1. **Design**: [Design System](./design-system.md) → [Component Catalog](./component-catalog.md)
2. **Implement**: [Component Library Guide](../guides/development/component-library.md) → [Form Patterns](../guides/development/form-patterns.md)
3. **Backend**: [Backend API](../guides/api/backend-api.md) → [Database Schema](./database-schema.md)
4. **Deploy**: [Production Deployment](../guides/deployment/production.md)

### Understanding the System
1. **Overview**: [System Architecture](../architecture/system-overview.md)
2. **Frontend**: [Frontend Architecture](../architecture/frontend-architecture.md)
3. **Backend**: [Backend Architecture](../architecture/backend-architecture.md)
4. **Database**: [Database Architecture](../architecture/database-architecture.md)
5. **Security**: [Security Architecture](../architecture/security.md)

### Onboarding New Developers
1. **Start**: [Getting Started](../guides/getting-started/README.md)
2. **Standards**: [Development Best Practices](../guides/development/best-practices.md)
3. **Components**: [Component Library Guide](../guides/development/component-library.md)
4. **Architecture**: [System Architecture](../architecture/system-overview.md)






