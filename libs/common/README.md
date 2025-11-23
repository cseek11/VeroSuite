# Common Shared Library

**Purpose:** Shared code, types, utilities, and database schema used across all VeroField services.

**Last Updated:** 2025-11-22

---

## Structure

```
libs/common/
  prisma/
    schema.prisma      # Single DB schema source of truth
    migrations/        # Database migrations
  src/
    auth/              # Authentication helpers
    types/             # Shared TypeScript types
    utils/             # Shared utility functions
  package.json
  tsconfig.json
```

---

## Key Components

### Database Schema
- **Location:** `libs/common/prisma/schema.prisma`
- **Purpose:** Single source of truth for all database models
- **Migration:** Moving from `backend/prisma/schema.prisma`

### Shared Types
- **Location:** `libs/common/src/types/`
- **Purpose:** TypeScript types shared across services
- **Usage:** Import with `@verofield/common/types`

### Authentication Helpers
- **Location:** `libs/common/src/auth/`
- **Purpose:** Tenant context, JWT validation, etc.
- **Usage:** Import with `@verofield/common/auth`

### Utilities
- **Location:** `libs/common/src/utils/`
- **Purpose:** Shared utility functions
- **Usage:** Import with `@verofield/common/utils`

---

## Usage

### Importing from Common Library

```typescript
// Types
import { Account, WorkOrder } from '@verofield/common/types';

// Auth
import { TenantContext } from '@verofield/common/auth';

// Utils
import { formatDate } from '@verofield/common/utils';
```

### TypeScript Path Mapping

Add to `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@verofield/common/*": ["libs/common/src/*"]
    }
  }
}
```

---

## Migration Status

- ✅ **Directory structure created** (2025-11-22)
- 🟡 **Prisma schema migration:** `backend/prisma/` → `libs/common/prisma/` (Planned)
- 🟡 **Shared code migration:** `backend/src/common/` → `libs/common/src/` (Planned)

---

## Development

### Adding New Shared Code

1. Create file in appropriate `libs/common/src/` subdirectory
2. Export from `libs/common/src/index.ts`
3. Update TypeScript path mappings if needed
4. Document in this README

### Database Schema Changes

1. Edit `libs/common/prisma/schema.prisma`
2. Generate migration: `npx prisma migrate dev`
3. Update DTOs and frontend types (per `.cursor/rules/05-data.mdc`)

---

**Reference:** `.cursor/rules/04-architecture.mdc`, `.cursor/rules/05-data.mdc`





