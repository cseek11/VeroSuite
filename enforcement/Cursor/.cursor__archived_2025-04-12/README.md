# VeroField Cursor Rule System
## Hybrid Architecture — Version 2.0
**Last Updated:** 2025-12-04

This directory contains the complete VeroField AI Governance System for Cursor.

It includes:
- The Hybrid 15-File Rule System (00–14 .mdc files)
- Persona Prompts for review, refactor, testing, frontend, backend, security
- A Multi-Agent System with .cursor/agents.json
- Full CI/Reward Score integration
- Pattern extraction + anti-pattern logging
- Enforcement pipeline across all generated code

This is an enterprise-grade, deterministic development system for Cursor.

---

## 📁 Directory Overview

```
.cursor/
├── rules/          # 00–14 .mdc rule files
├── prompts/        # Role-specific AI personas
├── patterns/      # Golden patterns + anti-patterns
├── agents.json    # Multi-agent routing & capabilities
└── README.md      # (this file)
```

---

## 🔐 Rule System Overview (.cursor/rules/*.mdc)

The VeroField rule system is loaded alphabetically, which is why file names start with numbers.

### Rule Load Order
1. 00-master.mdc
2. 01-enforcement.mdc
3. 02-core.mdc
4. 03-security.mdc
5. 04–14 domain-specific rules

### Global Rules
These always apply:
- **00-master.mdc** — CI, Reward Score, pattern system, precedence
- **01-enforcement.mdc** — mandatory 5-step workflow
- **02-core.mdc** — dates, TS-only, tech stack rules
- **03-security.mdc** — RLS, auth, secrets, validation

### Contextual Rules
These load based on file type & location:

| File Pattern | Rules Loaded |
|-------------|-------------|
| `apps/api/**` | 08-backend, 06-error-resilience, 07-observability |
| `frontend/**` | 09-frontend, 13-ux-consistency |
| `libs/common/**` | 04-architecture, 05-data |
| `.github/workflows/**` | 11-operations |
| `**/*.test.ts` | 10-quality, 14-verification |

---

## 🔧 Enforcement Pipeline (01-enforcement.mdc)

Every agent and every code generation step MUST follow:

1. **SEARCH**
   - Existing patterns
   - Existing code in the same service
   - Related tests
   - Docs/state-machines
   - Patterns in .cursor/patterns/

2. **PATTERN ANALYSIS**
   - Determine which pattern applies
   - Check golden/anti patterns
   - Ensure consistency with service style

3. **COMPLIANCE CHECK**
   - Verify across:
     - Core rules
     - Security rules
     - Error handling
     - Observability
     - Architectural boundaries
     - DTO/schema/type synchronization

4. **IMPLEMENTATION PLAN**
   - Includes:
     - Files to create/edit
     - Test plan
     - Migration plan (if applicable)
     - Estimated scope

5. **POST-IMPLEMENTATION AUDIT**
   - Final mandatory checks:
     - No hardcoded dates
     - RLS enforced
     - Logging correct
     - Type safety
     - Tests included
     - No architecture violations

**Failure at any step = stop immediately.**

---

## 🔥 Security Rules (03-security.mdc)

Security is non-negotiable.

AI MUST refuse output if it violates:
- Tenant isolation
- RLS requirements
- Auth/permission checks
- Secrets handling
- Input validation
- Audit logging rules

Security rules override all other rules if a conflict occurs.

---

## 📊 CI/Reward Score Integration (00-master.mdc)

CI is the source of truth.

Agents must:
- Read CI Reward Score if available
- Label local evaluations as DRAFT
- Use .cursor/reward_rubric.yaml if provided
- Follow score thresholds for PR approval or pattern extraction

---

## 🧠 Patterns System (00-master.mdc + /patterns)

### Golden Patterns
- **Stored in:** `.cursor/patterns/*.md`
- **AI behavior:**
  - Must prefer golden patterns over general logic
  - Must not invent new architectures
  - Must propose patterns only via @coach mode

### Anti-Patterns
- **Stored in:** `.cursor/anti_patterns.md`
- **Generated when:**
  - Reward Score ≤ 0
  - Repeated violations occur

### Bug Log
- **Stored in:** `.cursor/BUG_LOG.md`
- **Records:**
  - Historical bug classes
  - Prevents regressions
  - Feeds into test generation agents

---

## 🤖 Multi-Agent System (agents.json)

Cursor loads all agents automatically from agents.json.

### Included Agents

| Agent | Role |
|-------|------|
| Backend Refactor Agent | Backend logic, NestJS, Prisma |
| UI Component Generator | React/RN components, hooks, UI/UX consistency |
| Migration Assistant | Prisma migrations + contract sync |
| Bug Fix Agent | Regression test driven repair |
| Test Coverage Agent | Full test suite creation |
| Security Auditor | RLS, auth, secrets enforcement |
| Monorepo Navigator | File structure + architecture correctness |
| CI Workflow Auditor | GitHub Actions validator |
| Architecture Advisor | High-level architectural correctness |
| Tech Debt Agent | Modernization + cleanup |
| AI Coach | Pattern extraction + explanations |
| Lead Engineer Review Agent | Final approval gate |

Each agent loads:
- Core global rules
- Domain rules
- Strict hard-stop violations

They are fully isolated—no agent will step outside its domain.

---

## 👤 Persona Prompts (.cursor/prompts/)

Your system includes:
- **lead_review.md** — PR-level lead engineer analysis, CI-aware.
- **backend_reviewer.md** — Backend architecture, DTOs, RLS, Prisma.
- **frontend_reviewer.md** — React, React Native, design system, UX patterns.
- **infra_reviewer.md** — CI/CD, workflows, deployments, config.
- **security_review.md** — Auth, RLS, secrets, input validation.
- **tester.md** — Regression/unit/integration/E2E test generation.
- **coach.md** — Pattern extraction, explanation, best practices.

Each persona is designed to be:
- Task-scoped
- Deterministic
- Rule-driven
- Failure-safe

---

## 🗃 Where to Put New Rules

To extend the system, add new files following:
- **Guidelines:** `NN-new-rule-name.mdc`
- Prefix determines load order
- Do not edit 00-master.mdc without approval
- Domain rules belong between 04–14
- Always run the test harness after adding new rules

---

## 🧪 Testing the Rule System

To test correct load order and routing:
Ask Cursor:
- "What rules apply to this file?"
- "Audit this code against all active rules."
- "What agent should handle this task?"
- "Show me the enforcement pipeline for this change."

---

## ♻️ Updating the System

All rule changes must be reviewed by the Rules Champion.

**Allowed:**
- Adding new patterns
- Adding clarifications
- Enhancing domain rules

**Requires Approval:**
- Editing 00-master.mdc
- Editing agents.json

**Forbidden:**
- Reducing security constraints
- Weakening enforcement pipeline
- Changing rule precedence

---

## 🧨 Emergency Overrides

Use only during CI failures or urgent patches:
- `@emergency_override:<rule-id>:<YYYY-MM-DD expiry>`
- Cannot exceed 7 days
- Logged in `docs/architecture/cursor_rules_upgrade.md`

---

## 🏁 Final Notes

This is a deterministic AI governance system.

Its goals:
- Prevent regressions
- Prevent architectural drift
- Ensure security correctness
- Guarantee consistency across the monorepo
- Make AI-generated code trustworthy and reviewable

If the AI ever produces unsafe/incorrect output, the system is designed to catch and stop it automatically through the pipeline.

**Need help?**
Ask Cursor:
- "Show me the rule hierarchy."
- "Explain the enforcement pipeline."
- "Which rules did this output violate?"

