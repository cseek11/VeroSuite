# Tech Context

**Last Updated:** 2025-11-30

## Technologies Used

### Frontend
- **Framework:** React + TypeScript
- **Styling:** Tailwind CSS (purple theme preferences)
- **State Management:** Zustand + React Query
- **Build Tool:** Vite (or similar)
- **Mobile:** React Native with offline-first architecture

See `.cursor/rules/09-frontend.mdc` for frontend architecture and patterns.

### Backend
- **Framework:** NestJS
- **ORM:** Prisma
- **Database:** PostgreSQL with Supabase
- **Authentication:** JWT with multi-tenant security
- **API Style:** RESTful with DTOs

See `.cursor/rules/08-backend.mdc` for backend patterns and `.cursor/rules/02-core.mdc` for tech stack details.

### Database
- **Type:** PostgreSQL
- **Security:** Row Level Security (RLS) for tenant isolation
- **Schema Location:** `libs/common/prisma/schema.prisma`
- **Migrations:** Prisma migrations

See `.cursor/rules/03-security.mdc` for RLS and security requirements.

### External Services
- **Flink:** Stream processing (in `services/`)
- **Feast:** Feature store (in `services/`)
- **OPA:** Policy enforcement (in `services/opa/`)

### AI Governance
- **Rules System:** 15 rule files (00-14 .mdc) in `.cursor/rules/`
- **Patterns:** Golden patterns in `.cursor/patterns/`
- **Memory Bank:** Context preservation (this system)
- **CI Integration:** REWARD_SCORE system

See `.cursor/README.md` for complete AI governance system documentation.

## Development Setup

### Prerequisites
- Node.js (version specified in project)
- PostgreSQL database
- Prisma CLI
- TypeScript

### Key Dependencies
- **Backend:** NestJS, Prisma, JWT libraries
- **Frontend:** React, TypeScript, Tailwind CSS, Zustand, React Query
- **Mobile:** React Native, platform-specific dependencies

See `package.json` files in respective directories for complete dependency lists.

## Technical Constraints

### Security Constraints
- **Tenant Isolation:** Mandatory in all database queries
- **RLS Enforcement:** Cannot be bypassed
- **Secrets Management:** Environment variables only, never hardcoded
- **Input Validation:** Required for all user inputs

See `.cursor/rules/03-security.mdc` for complete security constraints.

### Architecture Constraints
- **Monorepo Structure:** Must follow established structure
- **Service Boundaries:** No cross-service relative imports
- **Shared Code:** Must use `libs/common/` for shared logic
- **File Paths:** Must use correct monorepo paths (not deprecated paths)

See `.cursor/rules/04-architecture.mdc` for architecture constraints.

### Code Quality Constraints
- **TypeScript:** 100% TypeScript coverage, no `any` types
- **Testing:** Comprehensive test coverage required
- **Error Handling:** No silent failures allowed
- **Logging:** Structured logging with traceId required

See `.cursor/rules/10-quality.mdc` for quality standards.

### Date Handling Constraints
- **Never Hardcode Dates:** Must check current system date
- **Format:** ISO 8601 (YYYY-MM-DD)
- **Verification:** Date must match current system date exactly

See `.cursor/rules/02-core.mdc` for date handling rules.

## Development Workflow

### Enforcement Pipeline
All code changes must follow the 5-step enforcement pipeline:
1. Search & Discovery
2. Pattern Analysis
3. Rule Compliance Check
4. Implementation Plan
5. Post-Implementation Audit

See `.cursor/rules/01-enforcement.mdc` for complete pipeline.

### CI/CD Integration
- **REWARD_SCORE:** CI computes quality score for PRs
- **Pattern Extraction:** High-score PRs eligible for pattern extraction
- **Anti-Pattern Detection:** Low-score PRs generate anti-pattern suggestions

See `.cursor/rules/00-master.mdc` for CI integration and `.cursor/rules/11-operations.mdc` for CI/CD workflows.

## Related Documentation

- **Tech Stack:** `.cursor/rules/02-core.mdc` - Complete tech stack details
- **Backend Patterns:** `.cursor/rules/08-backend.mdc` - NestJS/Prisma patterns
- **Frontend Patterns:** `.cursor/rules/09-frontend.mdc` - React/React Native patterns
- **Python Code:** `.cursor/rules/python_bible.mdc` - Python Bible enforcement rules
- **Rego/OPA Code:** `.cursor/rules/rego_bible.mdc` - Rego OPA Bible enforcement rules

## Special Requirements

### Python Code
- Must reference `.cursor/PYTHON_LEARNINGS_LOG.md` when working with Python
- Must follow Python Bible rules in `.cursor/rules/python_bible.mdc`

### Rego/OPA Code
- Must reference Rego OPA Bible when working with Rego files
- Must run `opa fmt --write` immediately after generating/modifying Rego code
- Must use explicit namespaced references in tests

See `.cursor/rules/rego_bible.mdc` for Rego/OPA requirements.


































