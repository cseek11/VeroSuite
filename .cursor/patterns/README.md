# VeroField AI Patterns Directory
### Golden Patterns • Anti-Patterns • Pattern Evolution System
_Hybrid Rule System v2.0_

This directory defines the **source of truth** for all reusable patterns enforced by Cursor.

Patterns follow the rules defined in:
- `00-master.mdc` (pattern extraction, rule precedence)
- `01-enforcement.mdc` (mandatory search + pattern analysis)
- `04-architecture.mdc` (service boundaries, monorepo layout)
- `08-backend.mdc` / `09-frontend.mdc` (domain patterns)

---

## 📁 Directory Structure

```
.cursor/patterns/
├── backend/
│   ├── controller.md
│   ├── service.md
│   ├── repository.md
│   ├── prisma.md
│   └── rls.md
├── frontend/
│   ├── component.md
│   ├── hook.md
│   ├── react-query.md
│   └── design-system.md
├── infrastructure/
│   ├── logging.md
│   ├── tracing.md
│   ├── workflow.md
│   └── monitoring.md
├── anti_patterns.md
└── patterns_index.md
```

---

## ⭐ Golden Patterns (Preferred)

Golden Patterns represent **approved, reusable blueprints** for:

- **Backend:**
  - Controller → Service → Repository
  - Prisma transaction patterns
  - DTO validation
  - RLS tenant isolation

- **Frontend:**
  - React Query hooks
  - UI component architecture
  - Global UX rules (spacing, typography, feedback states)

- **Infrastructure:**
  - Logging format
  - Structured error models
  - GitHub Actions workflows
  - Trace propagation rules

AI MUST match new code to the closest Golden Pattern **before** implementing.

---

## ⚠️ Anti-Patterns

These represent known-bad patterns that must be rejected during:
- Code generation
- Review
- Refactoring
- Migration

Examples include:
- ❌ No business logic in controllers
- ❌ Raw Prisma queries without RLS
- ❌ fetch() inside component body
- ❌ Unstructured logging
- ❌ Hardcoded tenantId
- ❌ Missing DTO validation
- ❌ UI components not using design system
- ❌ Creating new directories outside monorepo rules

Anti-patterns automatically feed into **CI Reward Score deductions**.

---

## 🔄 Pattern Evolution System

Patterns are updated through the following pipeline:
1. A new issue triggers pattern extraction (`@coach` mode).
2. AI proposes a new or updated pattern.
3. Lead Reviewer validates proposal.
4. Pattern is added or updated in this folder.
5. Change is documented in `docs/patterns/CHANGELOG.md`.

---

## 🧠 Pattern Index

The file `patterns_index.md` is automatically updated by scripts in:
`.cursor/scripts/patterns/`

It provides:
- A list of all patterns
- When each pattern was last updated
- The applicable rules

---

## ✔ Usage

Ask Cursor:
- "Which pattern applies to this file?"
- "Extract a new reusable pattern from this code."
- "Refactor this to the closest Golden Pattern."

This system ensures **deterministic**, **reusable**, and **enterprise-safe** code generation.

