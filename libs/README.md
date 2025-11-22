# Shared Libraries Directory

**Purpose:** Contains shared code used across multiple services in the VeroField monorepo.

**Last Updated:** 2025-11-22

---

## Structure

```
libs/
  common/           # Shared types, auth helpers, domain utilities, Prisma schema
    prisma/         # Single DB schema source of truth
    src/            # Shared TypeScript code
```

---

## Shared Libraries

### `libs/common/`

**Purpose:** Common utilities, types, and database schema shared across all services.

**Contents:**
- `prisma/schema.prisma` - Single source of truth for database schema
- `src/auth/` - Authentication helpers
- `src/types/` - Shared TypeScript types
- `src/utils/` - Shared utility functions

**Usage:**
```typescript
// Import from shared library
import { TenantContext } from '@verofield/common/auth';
import { Account } from '@verofield/common/types';
```

---

## Rules

### ✅ DO:
- Put shared code in `libs/common/`
- Use `@verofield/common/*` import paths
- Keep shared code framework-agnostic when possible

### ❌ DON'T:
- Duplicate code across services
- Put service-specific code in shared libraries
- Create circular dependencies

---

## Migration Status

- ✅ **Directory structure created** (2025-11-22)
- 🟡 **Migration in progress:** `backend/prisma/` → `libs/common/prisma/` (Phase 1)

---

**Reference:** `.cursor/rules/04-architecture.mdc`

