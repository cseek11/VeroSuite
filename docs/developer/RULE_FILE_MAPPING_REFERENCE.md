# Rule File Mapping Reference

**Date:** 2025-11-21  
**Purpose:** Quick reference for mapping old rule file names to new Hybrid Rule System v2.0 format  
**Status:** Active

---

## Overview

This document provides a mapping from the old rule file naming convention (`.md` files) to the new Hybrid Rule System v2.0 format (numbered `.mdc` files).

---

## Complete Mapping Table

| Old File Name | New File Name | Notes |
|--------------|---------------|-------|
| `.cursor/rules/enforcement.md` | `.cursor/rules/01-enforcement.mdc` | Direct mapping - 5-step enforcement pipeline |
| `.cursor/rules/core.md` | `.cursor/rules/02-core.mdc` | Direct mapping - Core philosophy and standards |
| `.cursor/rules/security.md` | `.cursor/rules/03-security.mdc` | Direct mapping - Security rules |
| `.cursor/rules/monorepo.md` | `.cursor/rules/04-architecture.mdc` | Consolidated + renamed - Monorepo structure |
| `.cursor/rules/file-organization.md` | `.cursor/rules/04-architecture.mdc` | Consolidated into architecture rules |
| `.cursor/rules/docs.md` | `.cursor/rules/02-core.mdc` or `.cursor/rules/04-architecture.mdc` | Split across multiple rules |
| `.cursor/rules/error-resilience.md` | `.cursor/rules/06-error-resilience.mdc` | Direct mapping - Error handling |
| `.cursor/rules/observability.md` | `.cursor/rules/07-observability.mdc` | Direct mapping - Logging and tracing |
| `.cursor/rules/tech-debt.md` | `.cursor/rules/12-tech-debt.mdc` | Direct mapping - Tech debt logging |
| `.cursor/rules/ux-consistency.md` | `.cursor/rules/13-ux-consistency.mdc` | Direct mapping - UX consistency |
| `.cursor/rules/verification.md` | `.cursor/rules/14-verification.mdc` | Direct mapping - Testing standards |
| `.cursor/rules/ci-automation.md` | `.cursor/rules/11-operations.mdc` | Consolidated + renamed - CI/CD rules |
| `.cursor/rules/ai-behavior.md` | `.cursor/rules/00-master.mdc` or `.cursor/rules/02-core.mdc` | Consolidated into master/core rules |
| `.cursor/rules/state-integrity.md` | `.cursor/rules/05-data.mdc` | Consolidated - Data contracts and state machines |
| `.cursor/rules/contracts.md` | `.cursor/rules/05-data.mdc` | Consolidated - Data contracts |
| `.cursor/rules/pattern-learning.md` | `.cursor/rules/00-master.mdc` | Consolidated into master rule |
| `.cursor/rules/predictive-prevention.md` | Various rules (00, 01, 06, 07) | Split across multiple rules |
| `.cursor/rules/database-integrity.md` | `.cursor/rules/05-data.mdc` | Consolidated - Data contracts |
| `.cursor/rules/layer-sync.md` | `.cursor/rules/05-data.mdc` | Consolidated - Layer synchronization |
| `.cursor/rules/naming-consistency.md` | `.cursor/rules/02-core.mdc` or `.cursor/rules/04-architecture.mdc` | Split across core/architecture |
| `.cursor/rules/architecture-scope.md` | `.cursor/rules/04-architecture.mdc` | Consolidated - Architecture scope limits |
| `.cursor/rules/dependencies.md` | `.cursor/rules/02-core.mdc` | Consolidated - Core standards |
| `.cursor/rules/performance.md` | `.cursor/rules/10-quality.mdc` | Consolidated - Quality standards |
| `.cursor/rules/eventing.md` | `.cursor/rules/05-data.mdc` | Consolidated - Event contracts |
| `.cursor/rules/cross-platform.md` | `.cursor/rules/09-frontend.mdc` | Consolidated - Frontend architecture |
| `.cursor/rules/accessibility.md` | `.cursor/rules/09-frontend.mdc` or `.cursor/rules/13-ux-consistency.mdc` | Split across frontend/UX rules |
| `.cursor/rules/tooling.md` | `.cursor/rules/02-core.mdc` | Consolidated - Core standards |
| `.cursor/rules/refactoring.md` | `.cursor/rules/01-enforcement.mdc` | Consolidated - Enforcement pipeline |
| `.cursor/rules/ownership.md` | `.cursor/rules/04-architecture.mdc` | Consolidated - Architecture rules |
| `.cursor/rules/veroai.md` | `.cursor/rules/00-master.mdc` | Consolidated - Master rule |

---

## New Rule System Structure (00-14)

### Global Rules (Always Apply)
- **00-master.mdc** - CI integration, REWARD_SCORE, pattern extraction, precedence
- **01-enforcement.mdc** - Mandatory 5-step enforcement pipeline
- **02-core.mdc** - Core philosophy, date handling, tech stack standards
- **03-security.mdc** - Security rules: tenant isolation, RLS, auth, secrets

### Domain-Specific Rules (Context-Aware)
- **04-architecture.mdc** - Monorepo structure, service boundaries, scope limits
- **05-data.mdc** - Data contracts, state machines, layer synchronization
- **06-error-resilience.mdc** - Error handling, no silent failures
- **07-observability.mdc** - Structured logging, tracing, metrics
- **08-backend.mdc** - Backend architecture: NestJS, Prisma, patterns
- **09-frontend.mdc** - Frontend architecture: React/React Native, design system
- **10-quality.mdc** - Quality standards: testing, coverage, performance
- **11-operations.mdc** - CI/CD rules, workflows, reward score plumbing
- **12-tech-debt.mdc** - Tech debt logging & TODO/FIXME rules
- **13-ux-consistency.mdc** - UI/UX coherence, spacing, typography
- **14-verification.mdc** - Verification & testing standards

### Additional Rules
- **01-auto-pr-format.mdc** - Auto-PR structured description standard

---

## Quick Reference: Common Rule Lookups

### When you need rules about...
- **Enforcement/Workflow** → `01-enforcement.mdc`
- **Core Standards/Philosophy** → `02-core.mdc`
- **Security/Auth/RLS** → `03-security.mdc`
- **File Structure/Monorepo** → `04-architecture.mdc`
- **Database/Schema/Contracts** → `05-data.mdc`
- **Error Handling** → `06-error-resilience.mdc`
- **Logging/Tracing** → `07-observability.mdc`
- **Backend Code** → `08-backend.mdc`
- **Frontend Code** → `09-frontend.mdc`
- **Testing/Quality** → `10-quality.mdc` or `14-verification.mdc`
- **CI/CD/Workflows** → `11-operations.mdc`
- **Tech Debt** → `12-tech-debt.mdc`
- **UI/UX** → `13-ux-consistency.mdc`

---

## Monorepo Path Mapping

| Old Path | New Path | Rule Reference |
|----------|----------|----------------|
| `backend/src/` | `apps/api/src/` | `04-architecture.mdc` |
| `backend/prisma/` | `libs/common/prisma/` | `04-architecture.mdc` |
| Root-level `src/` | `apps/[service]/src/` or `libs/common/src/` | `04-architecture.mdc` |

---

## Usage

When updating documentation:
1. Find old rule file reference (e.g., `.cursor/rules/enforcement.md`)
2. Look up in mapping table
3. Replace with new format (e.g., `.cursor/rules/01-enforcement.mdc`)
4. Verify the rule file exists in `.cursor/rules/`

---

**Last Updated:** 2025-11-21  
**Maintained By:** Development Team  
**Related Documents:**
- `.cursor/README.md` - Complete rule system overview
- `docs/architecture/cursor_rules_upgrade.md` - Migration documentation

