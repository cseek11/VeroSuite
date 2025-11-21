---
# Cursor Rule Metadata
version: 2.1
project: VeroField
scope:
  - all
priority: critical
last_updated: 2025-11-16
always_apply: true
---

# PRIORITY: CRITICAL - Monorepo Structure Rules

## PRIORITY: CRITICAL - Root-Level File Organization

**MANDATORY:** Root directory must be kept clean and organized.

**Reference:** See `.cursor/rules/file-organization.md` for comprehensive root directory rules.

### Files Allowed in Root

**ONLY** the following files may remain in root:
- `README.md` - Project overview (required)
- `package.json`, `package-lock.json` - Package management
- `.gitignore`, `.gitattributes` - Git configuration
- Essential config files: `tsconfig.json`, `nest-cli.json` (if at root)
- `.cursorrules`, `.cursor/` - Cursor AI configuration

**Prohibited in Root:**
- ❌ Any `.md` files except `README.md`
- ❌ Any source code files
- ❌ Any documentation files
- ❌ Any test outputs
- ❌ Any temporary files
- ❌ Any asset files

**MANDATORY:** All other files must be in appropriate subdirectories per `.cursor/rules/file-organization.md`.

---

## Project Structure (Post-Restructuring)

### Directory Organization
```
VeroSuite/
├── apps/                    # Microservices
│   ├── api/                 # Main API (was backend/)
│   ├── crm-ai/              # AI CodeGen microservice
│   ├── ai-soc/              # AI Security Operations Center
│   ├── feature-ingestion/   # Feature store ingestion
│   └── kpi-gate/            # KPI evaluation service
├── libs/                    # Shared libraries
│   └── common/              # Common utilities, Kafka, Prisma
│       ├── src/
│       │   ├── kafka/       # Kafka producer/consumer
│       │   ├── prisma/      # Prisma service
│       │   ├── cache/       # Redis cache
│       │   ├── interceptors/ # Telemetry interceptor
│       │   └── types/       # Shared TypeScript types
│       └── prisma/          # Prisma schema (shared database)
│           └── schema.prisma
├── services/                # External services
│   ├── flink-jobs/          # Flink stream processing
│   ├── feast/               # Feast feature store
│   └── opa/                 # Open Policy Agent
├── frontend/                # React frontend
├── VeroFieldMobile/         # React Native mobile app (may still be named VeroSuiteMobile/ until renamed)
└── deploy/                  # Infrastructure as Code
```

---

## PRIORITY: CRITICAL - File Path Rules

### Backend Services
- **Main API modules** → `apps/api/src/[module]/`
- **AI CodeGen service** → `apps/crm-ai/src/`
- **AI SOC service** → `apps/ai-soc/src/`
- **Feature ingestion** → `apps/feature-ingestion/src/`
- **KPI gate service** → `apps/kpi-gate/src/`

### Shared Libraries
- **Database schema** → `libs/common/prisma/schema.prisma` ⭐ **CRITICAL**
- **Kafka services** → `libs/common/src/kafka/`
- **Prisma service** → `libs/common/src/prisma/`
- **Cache service** → `libs/common/src/cache/`
- **Telemetry interceptor** → `libs/common/src/interceptors/`
- **Shared types** → `libs/common/src/types/`

### Import Patterns
```typescript
// ✅ CORRECT - Import from shared library
import { PrismaService } from '@verofield/common/prisma';
import { KafkaProducerService } from '@verofield/common/kafka';
import { TenantContext, KafkaEvent } from '@verofield/common/types';

// ❌ WRONG - Relative imports across services
import { PrismaService } from '../../common/prisma';
```

---

## PRIORITY: HIGH - Monorepo Development Rules

### Workspace Management
- Use NPM Workspaces for dependency management
- All services share `libs/common/` - no duplication
- Each service has its own `package.json` in `apps/[service]/`
- Root `package.json` manages workspace scripts

### Service Independence
- Each microservice in `apps/` is independently deployable
- Services communicate via HTTP/gRPC, not direct imports
- Shared code goes in `libs/common/`, not duplicated
- Services can have service-specific dependencies

### Database Access
- **ALL services share the same database** (PostgreSQL)
- **Prisma schema is in `libs/common/prisma/`** - single source of truth
- All services import Prisma from `@verofield/common/prisma`
- Never duplicate Prisma schema across services

---

## PRIORITY: HIGH - Microservices Patterns

### Service Communication
```typescript
// ✅ CORRECT - HTTP/gRPC between services
const response = await axios.post('http://crm-ai:3001/generate', data);

// ❌ WRONG - Direct imports between services
import { CodeGenService } from '../../crm-ai/src/services/codegen.service';
```

### Shared Code Rules
- **Common utilities** → `libs/common/src/`
- **Service-specific code** → `apps/[service]/src/`
- **Never duplicate** shared code in multiple services
- **Extract to libs/** if used by 2+ services

### Environment Variables
- Root `.env` for shared secrets (DB, Redis, etc.)
- Service-specific `.env.local` for service configs
- Use `dotenv-cli` to compose environments
- Never hardcode service URLs - use env vars

---

## PRIORITY: HIGH - Docker & Deployment

### Docker Build Context
```bash
# ✅ CORRECT - Build from root
docker build -f apps/api/Dockerfile .

# ❌ WRONG - Build from service directory
cd apps/api && docker build .
```

### Service Deployment
- Each service has its own Dockerfile in `apps/[service]/Dockerfile`
- All builds must be from repository root
- Use Docker Compose for local development
- Use Kubernetes for production deployments

---

## PRIORITY: MEDIUM - Development Workflow

### Running Services
```bash
# Run specific service
npm run dev --workspace=apps/api
npm run dev --workspace=apps/crm-ai

# Run all services
npm run dev --workspaces

# Build all services
npm run build --workspaces
```

### Testing
- Each service has its own test suite
- Shared test utilities in `libs/common/src/testing/`
- Run tests per service: `npm test --workspace=apps/api`
- Run all tests: `npm test --workspaces`

---

## PRIORITY: HIGH - Shared and Other Directories

### Shared Directory (`shared/`)

**If `shared/` directory exists:**
- **Action:** Migrate to `libs/common/src/` per monorepo structure
- **Reason:** Follows standard monorepo patterns
- **Timeline:** Should be migrated during restructuring

**MANDATORY:** New shared code must go to `libs/common/src/`, not `shared/`.

### Tests Directory (`tests/`)

**Rules:**
- Test files should be co-located with source code (e.g., `__tests__/` directories)
- Shared test utilities → `libs/common/src/testing/`
- Integration tests → Appropriate service directories
- Test outputs → `docs/archive/test-results/` (if keeping) or gitignored

**MANDATORY:** Follow test organization per `.cursor/rules/file-organization.md`.

### Other Project Directories

**Documentation:** See `.cursor/rules/docs.md` and `.cursor/rules/file-organization.md`
- All documentation → `docs/` subdirectories
- No documentation files in root or scattered directories

**Assets:** See `.cursor/rules/file-organization.md`
- Branding assets → `branding/assets/`
- Documentation assets → `docs/assets/`

**Configuration:** See `.cursor/rules/file-organization.md`
- Deployment configs → `deploy/` subdirectories
- Environment configs → Appropriate service directories

**MANDATORY:** All directories must follow organization rules in `.cursor/rules/file-organization.md`.

---

## Migration Notes

### During Restructuring
- Old paths (`backend/src/`) will be migrated to `apps/api/src/`
- Update all imports when restructuring is complete
- Validation script will check for old import paths

### After Restructuring
- All new code must use new structure
- Old import paths are invalid
- Use `@verofield/common/*` for shared libraries

---

**Last Updated:** 2025-11-16  
**Status:** Active - Reflects Post-Restructuring Structure

**Related Rules:**
- `.cursor/rules/file-organization.md` - Comprehensive file organization rules
- `.cursor/rules/docs.md` - Documentation organization (subset of file organization)

