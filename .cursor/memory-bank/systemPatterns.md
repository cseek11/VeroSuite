# System Patterns

**Last Updated:** 2025-12-01

## Architecture Overview

VeroField uses a monorepo architecture with clear service boundaries, shared libraries, and comprehensive security enforcement.

### Monorepo Structure
- **Apps:** Independent microservices in `apps/`
- **Frontend:** React web app in `frontend/`
- **Mobile:** React Native app in `VeroFieldMobile/`
- **Shared Libraries:** Common code in `libs/common/`
- **Services:** External services (Flink, Feast, OPA) in `services/`

See `.cursor/rules/04-architecture.mdc` for complete architecture rules.

## Key Technical Decisions

### Security Architecture
- **Row Level Security (RLS):** Enforced at database level
- **Tenant Isolation:** Mandatory in all database queries
- **Authentication:** JWT with multi-tenant security
- **Authorization:** Role-based access control (RBAC)

See `.cursor/rules/03-security.mdc` for complete security rules.

### Data Architecture
- **Database:** PostgreSQL with Prisma ORM
- **Schema:** Single source of truth in `libs/common/prisma/schema.prisma`
- **Layer Synchronization:** Schema ↔ DTO ↔ Frontend Types must stay in sync
- **State Machines:** Documented for stateful entities

See `.cursor/rules/05-data.mdc` for data integrity rules.

### Code Organization
- **Backend:** NestJS modules in `apps/api/src/[module]/`
- **Frontend:** React components in `frontend/src/components/`
- **Shared Code:** Domain-agnostic code in `libs/common/src/`
- **Patterns:** Golden patterns in `.cursor/patterns/`

See `.cursor/rules/04-architecture.mdc` for file organization rules.

## Design Patterns

### Golden Patterns
VeroField maintains a repository of validated patterns:

- **Location:** `.cursor/patterns/`
- **Index:** `.cursor/golden_patterns.md`
- **Usage:** AI must prefer golden patterns over general logic

See `.cursor/patterns/` for available patterns and `.cursor/golden_patterns.md` for pattern index.

### Anti-Patterns
Known bad patterns to avoid:

- **Location:** `.cursor/anti_patterns.md`
- **Source:** Generated from low-score PRs (REWARD_SCORE ≤ 0)
- **Purpose:** Prevent regressions and architectural drift

See `.cursor/anti_patterns.md` for patterns to avoid.

## Component Relationships

### Backend Services
- **API Service:** `apps/api/src/` - Main NestJS API
- **CRM AI:** `apps/crm-ai/src/` - CRM AI service
- **SOC AI:** `apps/ai-soc/src/` - SOC/alerting AI
- **Feature Ingestion:** `apps/feature-ingestion/src/` - Ingestion/ETL
- **KPI Gate:** `apps/kpi-gate/src/` - Metrics & KPIs

### Frontend Architecture
- **UI Components:** `frontend/src/components/ui/` - Reusable components
- **Feature Components:** `frontend/src/components/[feature]/` - Feature-specific
- **API Client:** `frontend/src/lib/` - API integration
- **State Management:** Zustand stores + React Query

### Shared Libraries
- **Common:** `libs/common/src/` - Shared utilities, types, auth
- **Prisma:** `libs/common/prisma/` - Database schema and migrations

## Pattern Enforcement

### Pattern System
- **Extraction:** High-score PRs (REWARD_SCORE ≥ 6) eligible for pattern extraction
- **Validation:** Patterns require human review before adoption
- **Application:** AI must use golden patterns when applicable

### Architecture Boundaries
- **Service Isolation:** No cross-service relative imports
- **Shared Code:** Must use `libs/common/` for shared logic
- **Communication:** Services communicate via HTTP/events

See `.cursor/rules/04-architecture.mdc` for service boundary rules.

## Error Handling Patterns

- **No Silent Failures:** All errors must be logged and handled
- **Error Categorization:** Validation (400), Business (422), System (500)
- **Structured Logging:** All logs include traceId, tenantId, context

See `.cursor/rules/06-error-resilience.mdc` for error handling rules.

## Observability Patterns

- **Structured Logging:** JSON format with required fields
- **Trace Propagation:** traceId propagates through all service calls
- **Metrics:** API latency, error rates, DB query counts

See `.cursor/rules/07-observability.mdc` for observability rules.

## Context Management Patterns

- **Predictive Context System:** Automatically loads/unloads context files based on task predictions
- **Context Enforcement:** Programmatic enforcement with HARD STOP violations (like date violations)
- **Context-ID Verification:** UUID-based verification ensures agent uses latest recommendations
- **Required Context:** PRIMARY ∪ HIGH ∪ dependencies must be loaded before proceeding
- **Canonical Unload Algorithm:** `(prev_active ∪ prev_preloaded) - (new_active ∪ new_preloaded)`
- **Pre-loaded Context:** Optimization only (WARNING, not BLOCKED)

See `.cursor/context_manager/` for context management system and `.cursor/context_manager/CONTEXT_ENFORCEMENT_PLAN.md` for enforcement details.

## Related Documentation

- **Architecture Rules:** `.cursor/rules/04-architecture.mdc`
- **Golden Patterns:** `.cursor/patterns/` and `.cursor/golden_patterns.md`
- **Anti-Patterns:** `.cursor/anti_patterns.md`
- **Bug Log:** `.cursor/BUG_LOG.md` - Historical bug patterns
- **Error Patterns:** `docs/error-patterns.md` - Detailed error pattern knowledge



























