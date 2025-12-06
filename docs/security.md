---
# Cursor Rule Metadata
version: 1.3
project: VeroField
scope:
  - frontend
  - backend
priority: critical
last_updated: 2025-12-05 20:13:54
always_apply: true
---

# PRIORITY: CRITICAL - Security & Tenant Isolation

## PRIORITY: CRITICAL - Security Standards

**CRITICAL:** Always maintain security standards:

1. **Verify tenant isolation** in all database operations
2. **Use existing authentication patterns** consistently
3. **Follow established error handling** approaches
4. **Validate input data** according to existing schemas
5. **Maintain audit logging** for sensitive operations

---

## PRIORITY: CRITICAL - Database Safety Protocols

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

## PRIORITY: CRITICAL - Security Checklist

- ✅ Verify tenant isolation in all database operations
- ✅ Use existing authentication patterns
- ✅ Follow established error handling
- ✅ Validate input data according to schemas
- ✅ Maintain audit logging for sensitive operations
- ✅ Never commit `.env` files or secrets
- ✅ Use environment variables for all secrets

---

## PRIORITY: CRITICAL - Tenant Isolation Rules

### Database Operations
- **ALWAYS** verify tenant_id is set before database queries
- **ALWAYS** use RLS policies for tenant-scoped tables
- **NEVER** bypass tenant isolation
- **NEVER** expose tenant data across boundaries

### API Operations
- **ALWAYS** verify tenant context in requests
- **ALWAYS** use tenant middleware
- **NEVER** trust client-provided tenant_id
- **NEVER** skip authentication checks

---

## PRIORITY: HIGH - Security Anti-Patterns

### ❌ DO NOT:
- Break tenant isolation
- Commit `.env` files or secrets
- Hardcode credentials
- Skip authentication checks
- Expose sensitive data in error messages

### ✅ DO:
- Use environment variables for all secrets
- Verify tenant isolation in all operations
- Use existing authentication patterns
- Maintain audit logging
- Validate all input data





