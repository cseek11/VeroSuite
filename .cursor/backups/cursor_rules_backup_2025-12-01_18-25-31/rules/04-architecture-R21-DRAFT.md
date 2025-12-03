# R21: File Organization — Step 5 Procedures (DRAFT)

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R21 - File Organization  
**Priority:** MEDIUM (Tier 3 - WARNING)

---

## R21: File Organization — Audit Procedures

### Rule-Specific Audit Checklist

For code changes affecting **file locations, directory structure, or monorepo organization**:

#### Monorepo Path Compliance

- [ ] **MANDATORY:** Verify files are in correct monorepo paths (`apps/`, `libs/`, `frontend/`, `VeroFieldMobile/`)
- [ ] **MANDATORY:** Verify backend files are in `apps/api/src/` (not `backend/src/`)
- [ ] **MANDATORY:** Verify database schema is in `libs/common/prisma/` (not `backend/prisma/`)
- [ ] **MANDATORY:** Verify shared code is in `libs/common/src/` (not duplicated across services)
- [ ] **MANDATORY:** Verify frontend files are in `frontend/src/` (not root-level `src/`)
- [ ] **RECOMMENDED:** Verify file paths follow established patterns (check similar files)
- [ ] **RECOMMENDED:** Verify file organization matches component type (UI components in `ui/`, feature components in feature folders)

#### Deprecated Path Detection

- [ ] **MANDATORY:** Verify no files in deprecated paths (`backend/src/`, `backend/prisma/`, root-level `src/`)
- [ ] **MANDATORY:** Verify no files moved to deprecated paths (check git history if file moved)
- [ ] **MANDATORY:** Verify deprecated paths are not referenced in imports or documentation
- [ ] **RECOMMENDED:** Verify deprecated paths are documented for migration reference

#### Top-Level Directory Compliance

- [ ] **MANDATORY:** Verify no new top-level directories created without approval
- [ ] **MANDATORY:** Verify new directories are within approved monorepo structure (`apps/`, `libs/`, `frontend/`, `docs/`, `services/`)
- [ ] **MANDATORY:** Verify new directories follow naming conventions (lowercase, kebab-case)
- [ ] **RECOMMENDED:** Verify new directories are documented in architecture documentation

#### File Naming Conventions

- [ ] **MANDATORY:** Verify file names follow conventions (PascalCase for components, camelCase for utilities, kebab-case for configs)
- [ ] **MANDATORY:** Verify file extensions are correct (`.ts` for TypeScript, `.tsx` for React components, `.mdc` for rules)
- [ ] **MANDATORY:** Verify file names match their content (component files match component name)
- [ ] **RECOMMENDED:** Verify file names are descriptive and follow established patterns

#### Directory Structure Compliance

- [ ] **MANDATORY:** Verify directory structure follows monorepo patterns (feature-based or layer-based organization)
- [ ] **MANDATORY:** Verify nested directories don't exceed reasonable depth (typically 3-4 levels)
- [ ] **MANDATORY:** Verify directory structure matches similar features (check comparable features)
- [ ] **RECOMMENDED:** Verify directory structure is documented or self-explanatory

#### Import Path Compliance

- [ ] **MANDATORY:** Verify imports use correct monorepo paths (`@verofield/common/*` for shared code)
- [ ] **MANDATORY:** Verify imports don't use deprecated paths (`@verosuite/*`, old relative paths)
- [ ] **MANDATORY:** Verify imports don't cross service boundaries (no `../../other-service/`)
- [ ] **RECOMMENDED:** Verify imports are consistent across similar files

#### File Type Organization

- [ ] **MANDATORY:** Verify components are in correct locations (`frontend/src/components/ui/` for reusable, feature folders for feature-specific)
- [ ] **MANDATORY:** Verify services are in correct locations (`apps/[service]/src/` for app services, `libs/common/src/` for shared)
- [ ] **MANDATORY:** Verify types are in correct locations (`frontend/src/types/` for frontend types, `libs/common/src/types/` for shared types)
- [ ] **RECOMMENDED:** Verify file organization matches component library catalog

#### Missing Files Detection

- [ ] **MANDATORY:** Verify required files exist (`.gitkeep` for empty directories, `index.ts` for barrel exports)
- [ ] **MANDATORY:** Verify test files are co-located or in test directories (follow project conventions)
- [ ] **RECOMMENDED:** Verify file organization supports discoverability (easy to find related files)

#### Automated Checks

```bash
# Check file organization for all files
python .cursor/scripts/check-file-organization.py --all

# Check specific directory
python .cursor/scripts/check-file-organization.py --directory apps/api/src

# Check for deprecated paths
python .cursor/scripts/check-file-organization.py --deprecated-paths

# Check for new top-level directories
python .cursor/scripts/check-file-organization.py --top-level-dirs

# Generate file organization report
python .cursor/scripts/check-file-organization.py --generate-report
```

#### OPA Policy

- **Policy:** `services/opa/policies/architecture.rego` (R21 section)
- **Enforcement:** WARNING (Tier 3 MAD) - Logged but doesn't block PRs
- **Tests:** `services/opa/tests/architecture_r21_test.rego`

#### Manual Verification (When Needed)

1. **Review File Locations** - Verify all files are in correct monorepo paths
2. **Check Deprecated Paths** - Search for files in deprecated locations
3. **Validate Directory Structure** - Verify directory organization matches patterns
4. **Review Import Paths** - Check imports use correct monorepo paths

**Example Correct File Organization (✅):**

```typescript
// ✅ CORRECT: Backend service in apps/api/src/
// apps/api/src/work-orders/work-orders.service.ts
@Injectable()
export class WorkOrdersService { ... }

// ✅ CORRECT: Shared utility in libs/common/src/
// libs/common/src/auth/tenant-context.service.ts
export class TenantContextService { ... }

// ✅ CORRECT: Frontend component in frontend/src/components/ui/
// frontend/src/components/ui/Button.tsx
export const Button = () => { ... }

// ✅ CORRECT: Database schema in libs/common/prisma/
// libs/common/prisma/schema.prisma
model WorkOrder { ... }
```

**Example File Organization Violation (❌):**

```typescript
// ❌ VIOLATION: Backend file in deprecated path
// backend/src/work-orders/work-orders.service.ts
// Should be: apps/api/src/work-orders/work-orders.service.ts

// ❌ VIOLATION: Database schema in deprecated path
// backend/prisma/schema.prisma
// Should be: libs/common/prisma/schema.prisma

// ❌ VIOLATION: Frontend file in root-level src/
// src/components/Button.tsx
// Should be: frontend/src/components/ui/Button.tsx

// ❌ VIOLATION: New top-level directory without approval
// new-service/src/service.ts
// Should be: apps/new-service/src/service.ts (with approval)
```

**Example Import Path Compliance (✅):**

```typescript
// ✅ CORRECT: Using monorepo import paths
import { TenantContextService } from '@verofield/common/auth';
import { Button } from '@/components/ui/Button';
import type { User } from '@verofield/common/types';
```

**Example Import Path Violation (❌):**

```typescript
// ❌ VIOLATION: Using deprecated import path
import { TenantContextService } from '@verosuite/common/auth';
// Should be: @verofield/common/auth

// ❌ VIOLATION: Cross-service relative import
import { CrmService } from '../../../crm-ai/src/crm.service';
// Should use HTTP/events or shared libs

// ❌ VIOLATION: Using deprecated relative path
import { Button } from '../../backend/src/components/Button';
// Should be: @/components/ui/Button or @verofield/common/components
```

**Example Directory Structure Compliance (✅):**

```typescript
// ✅ CORRECT: Feature-based organization
// apps/api/src/work-orders/
//   - work-orders.controller.ts
//   - work-orders.service.ts
//   - work-orders.module.ts
//   - dto/
//     - create-work-order.dto.ts
//     - update-work-order.dto.ts

// ✅ CORRECT: Component organization
// frontend/src/components/
//   - ui/ (reusable components)
//     - Button.tsx
//     - Input.tsx
//   - work-orders/ (feature-specific)
//     - WorkOrderForm.tsx
//     - WorkOrderList.tsx
```

**Example Directory Structure Violation (❌):**

```typescript
// ❌ VIOLATION: Too deep nesting
// apps/api/src/modules/features/work-orders/services/work-orders.service.ts
// Should be: apps/api/src/work-orders/work-orders.service.ts

// ❌ VIOLATION: Inconsistent organization
// Some features use feature-based, others use layer-based
// Should be consistent across all features

// ❌ VIOLATION: Files in wrong location
// frontend/src/components/Button.tsx (should be in ui/ if reusable)
// Should be: frontend/src/components/ui/Button.tsx
```

---

**Last Updated:** 2025-11-23  
**Maintained By:** Architecture Team  
**Review Frequency:** Quarterly or when file organization requirements change





