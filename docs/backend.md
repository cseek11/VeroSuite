---
# Cursor Rule Metadata
version: 2.0
project: VeroField
scope:
  - backend
  - microservices
priority: high
last_updated: 2025-12-05
always_apply: true
---

# PRIORITY: HIGH - Backend Development Rules

## PRIORITY: HIGH - Code Organization

### File Structure Rules
- **Main API modules** → `apps/api/src/[module]/` ⭐ **UPDATED**
- **Database schema** → `libs/common/prisma/schema.prisma` ⭐ **UPDATED**
- **AI services** → `apps/crm-ai/src/`, `apps/ai-soc/src/`, etc. ⭐ **NEW**
- **Shared libraries** → `libs/common/src/` ⭐ **NEW**
- **API endpoints** → Follow NestJS module structure

### Naming Conventions
- Modules: PascalCase (e.g., `JobsModule`)
- Services: PascalCase with "Service" suffix (e.g., `JobsService`)
- Controllers: PascalCase with "Controller" suffix (e.g., `JobsController`)
- DTOs: PascalCase with "Dto" suffix (e.g., `CreateJobDto`)
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE

---

## PRIORITY: HIGH - Backend Architecture

### Tech Stack
- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: JWT with multi-tenant security
- **API Documentation**: Swagger/OpenAPI

### Module Structure
- Each domain has its own module (JobsModule, CrmModule, etc.)
- Services handle business logic
- Controllers handle HTTP requests/responses
- DTOs validate and transform data
- Guards handle authentication/authorization
- Interceptors handle cross-cutting concerns

---

## PRIORITY: HIGH - Database Safety Protocols

```
For database changes:
1. Always review existing schema relationships first
2. Understand current RLS (Row Level Security) policies
3. Test migrations in development environment
4. Verify tenant isolation is maintained
5. Check for breaking changes in existing queries
6. Update seed data if necessary
```

---

## PRIORITY: HIGH - Code Quality Standards

### TypeScript Requirements
- **100% TypeScript coverage** with proper interfaces
- Use proper type definitions for all functions and classes
- Avoid `any` type - use proper types or `unknown`
- Follow ESLint rules from `backend/.eslintrc.cjs`

### Error Handling
- Implement comprehensive error management following existing patterns
- Use NestJS exception filters
- Provide user-friendly error messages
- Log errors appropriately
- Handle edge cases

### Validation
- Use class-validator decorators for DTOs
- Validate input data according to existing schemas
- Validate API responses
- Check for required fields

### Testing
- Include unit tests for new functionality when possible
- Test integration with existing systems
- Verify error handling
- Test tenant isolation





