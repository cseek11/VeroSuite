# MAD Decision Tree - VeroField Rules 2.1

**Created:** 2025-12-05  
**Version:** 1.0.0  
**Status:** Active  
**Purpose:** Decision tree for classifying Major Actions/Decisions (MAD) into enforcement tiers

---

## Overview

The MAD (Major Action/Decision) framework classifies actions into three tiers based on risk and impact:

- **Tier 1 MAD (BLOCK):** Critical rules that block merge if violated (security, tenant isolation, architecture)
- **Tier 2 MAD (OVERRIDE):** Important rules requiring override justification (breaking changes, state transitions)
- **Tier 3 MAD (WARNING):** Best practice rules that warn but don't block (tech debt, TODO additions)

---

## Decision Tree Flowchart

```
START: Is this action a Major Action/Decision (MAD)?

┌─────────────────────────────────────────────────────────────┐
│ Question 1: Does the action modify a production            │
│ environment or handle user data?                            │
└─────────────────────────────────────────────────────────────┘
                          │
         ┌────────────────┴────────────────┐
         │                                  │
        YES                                NO
         │                                  │
         ▼                                  ▼
    ┌─────────┐                  ┌──────────────────┐
    │   MAD   │                  │   Question 2:    │
    │CATEGORY:│                  │ Does the action  │
    │Production│                 │ merge code into  │
    │ Impact  │                  │ primary branch?  │
    └─────────┘                  └──────────────────┘
         │                                  │
         │                     ┌────────────┴────────────┐
         │                     │                          │
         │                    YES                        NO
         │                     │                          │
         │                     ▼                          ▼
         │                ┌─────────┐           ┌─────────────────┐
         │                │   MAD   │           │   Question 3:   │
         │                │CATEGORY:│           │ Does the action │
         │                │  Code   │           │ change system   │
         │                │Integration│         │ architecture?   │
         │                └─────────┘           └─────────────────┘
         │                     │                          │
         │                     │            ┌─────────────┴─────────────┐
         │                     │            │                            │
         │                     │           YES                          NO
         │                     │            │                            │
         │                     │            ▼                            ▼
         │                     │       ┌─────────┐            ┌──────────────────┐
         │                     │       │   MAD   │            │   Question 4:    │
         │                     │       │CATEGORY:│            │ Does the action  │
         │                     │       │Architecture│         │ risk corrupting  │
         │                     │       └─────────┘            │ Stateful Entity  │
         │                     │       │            │ (Technical or    │
         │                     │       │            │ Business)?       │
         │                     │            │                 └──────────────────┘
         │                     │            │                           │
         │                     │            │              ┌────────────┴───────────┐
         │                     │            │              │                         │
         │                     │            │             YES                       NO
         │                     │            │              │                         │
         │                     │            │              ▼                         ▼
         │                     │            │         ┌─────────┐          ┌──────────────┐
         │                     │            │         │   MAD   │          │   ROUTINE    │
         │                     │            │         │CATEGORY:│          │   ACTION     │
         │                     │            │         │  Data   │          │ (No special  │
         │                     │            │         │ Safety  │          │  oversight)  │
         │                     │            │         └─────────┘          └──────────────┘
         │                     │            │              │                         │
         └─────────────────────┴────────────┴──────────────┘                         │
                               │                                                     │
                               ▼                                                     ▼
                    ┌────────────────────┐                              ┌─────────────────────┐
                    │ REQUIRES HUMAN     │                              │ MAY PROCEED         │
                    │ APPROVAL/OVERSIGHT │                              │ AUTOMATICALLY       │
                    │                    │                              │ (subject to other   │
                    │ - Log action       │                              │ specific rules)     │
                    │ - Request approval │                              └─────────────────────┘
                    │ - Provide context  │
                    │ - Wait for response│
                    └────────────────────┘
```

---

## Decision Tree Logic (Text Format)

### Question 1: Production Impact

**Question:** Does the action modify a production environment or handle user data?

- **YES** → **MAD (Production Impact)** → **Tier 1 (BLOCK)** → Requires human approval/oversight
- **NO** → Proceed to Question 2

**Examples:**
- ✅ YES: Deploying to production, handling PII, modifying production database
- ❌ NO: Local development, documentation updates, test code

---

### Question 2: Code Integration

**Question:** Does the action merge code into primary development branch (`main`, `master`, `develop`)?

- **YES** → **MAD (Code Integration)** → **Tier 2 (OVERRIDE)** → Requires human code review
- **NO** → Proceed to Question 3

**Examples:**
- ✅ YES: Merging PR to `main`, pushing to `develop`, hotfix to `master`
- ❌ NO: Feature branch work, local commits, draft PRs

---

### Question 3: Architecture Changes

**Question:** Does the action change system architecture, core dependencies, or introduce a known breaking change?

- **YES** → **MAD (Architecture)** → **Tier 1 (BLOCK)** → Requires human design review
- **NO** → Proceed to Question 4

**Examples:**
- ✅ YES: Adding new microservice, changing database schema, breaking API contracts
- ❌ NO: Adding new endpoint, refactoring within service, adding utility functions

---

### Question 4: Data Safety

**Question:** Does the action involve interaction with a Stateful Entity (Technical or Business) in a way that could corrupt data or create an unrecoverable state?

- **YES** → **MAD (Data Safety)** → **Tier 2 (OVERRIDE)** → Requires human validation
- **NO** → **Routine Action** → **Tier 3 (WARNING)** → May proceed automatically (subject to other specific rules)

**Technical Stateful Entity examples:**
- ✅ YES: Modifying database schemas without migration, changing cache invalidation logic, altering queue message formats, breaking transaction boundaries
- ❌ NO: Adding database indexes, updating cache TTL, adding queue consumers

**Business Stateful Entity examples:**
- ✅ YES: Adding new workflow states without documentation, changing state transition rules, bypassing state validation, modifying lifecycle definitions
- ❌ NO: Reading entity state, adding new fields, updating non-critical records

**When in doubt about Data Safety:**
- If the change could corrupt data if interrupted → Business MAD
- If the change could cause race conditions → Technical MAD
- If the change affects state transitions → Business MAD
- If the change affects infrastructure reliability → Technical MAD

---

## MAD Categories

### 1. Production Impact (Tier 1 - BLOCK)

**Definition:** Actions that modify production environments or handle user data.

**Enforcement:** HARD STOP - Blocks merge if violated.

**Examples:**
- Deploying to production
- Handling PII or sensitive data
- Modifying production database
- Changing production configuration
- Accessing production secrets

**Required Actions:**
- Log action with full context
- Request explicit human approval
- Provide risk assessment
- Wait for approval before proceeding

---

### 2. Code Integration (Tier 2 - OVERRIDE)

**Definition:** Actions that merge code into primary development branches.

**Enforcement:** Requires override justification in PR.

**Examples:**
- Merging PR to `main` branch
- Pushing to `develop` branch
- Hotfix to `master` branch
- Releasing to staging

**Required Actions:**
- Include override marker in PR: `@override:code-integration`
- Provide justification for merge
- Ensure all checks pass
- Get code review approval

---

### 3. Architecture (Tier 1 - BLOCK)

**Definition:** Actions that change system architecture, core dependencies, or introduce breaking changes.

**Enforcement:** HARD STOP - Blocks merge if violated.

**Examples:**
- Adding new microservice
- Changing database schema (multiple modules)
- Breaking API contracts
- Major refactoring (>50 files)
- Technology stack changes
- Service boundary modifications

**Required Actions:**
- Log architectural decision
- Request design review
- Document breaking changes
- Provide migration plan
- Wait for approval before proceeding

---

### 4. Data Safety (Tier 2 - OVERRIDE)

**Definition:** Actions that interact with Stateful Entities in ways that could corrupt data or create unrecoverable states.

**Enforcement:** Requires override justification in PR.

**Examples:**
- Modifying state machine transitions
- Bulk data migrations
- Deleting critical records
- Changing stateful entity schemas (database or business model)
- Modifying RLS policies
- Breaking transaction boundaries (Technical)
- Changing cache invalidation logic (Technical)
- Altering queue message formats (Technical)

**Required Actions:**
- Include override marker: `@override:data-safety`
- Provide data safety assessment
- Document rollback procedure
- Get approval from data team

---

### 5. Routine Action (Tier 3 - WARNING)

**Definition:** Actions that do not fall into any MAD category.

**Enforcement:** WARNING - Logged but does not block merge.

**Examples:**
- Adding new features
- Fixing bugs
- Updating documentation
- Adding tests
- Refactoring within service boundaries
- Adding utility functions

**Required Actions:**
- Log action (for tracking)
- Proceed automatically
- Subject to other specific rules

---

## Tier Classification Summary

| Tier | Enforcement | MAD Categories | Examples |
|------|-------------|----------------|----------|
| **Tier 1** | **BLOCK** | Production Impact, Architecture | Security violations, tenant isolation, service boundaries |
| **Tier 2** | **OVERRIDE** | Code Integration, Data Safety | Breaking changes, state transitions, PR merges |
| **Tier 3** | **WARNING** | Routine Actions | Tech debt, TODO additions, best practices |

---

## Usage Guidelines

### For Developers

When writing rules for AI agents in Cursor:

1. **Always use MAD terminology** instead of "significant", "meaningful", or "major"
2. **Reference this decision tree** explicitly: "Use MAD decision tree to determine if action is MAD"
3. **Avoid "if applicable"** — instead specify exact triggers or exclusions
4. **Link to this document** when introducing MAD terminology

### For AI Agents

When executing tasks:

1. **Check MAD status** for every action before execution using this decision tree
2. **Log context** when a MAD is identified: what triggered the classification, which category applies
3. **Request human input** before executing any Tier 1 or Tier 2 MAD with clear explanation of risk/impact
4. **Document reasoning** for why an action was classified as routine vs. MAD

### For Code Reviewers

When reviewing PRs:

1. **Verify MAD classification** matches the decision tree
2. **Check override markers** for Tier 2 MAD actions
3. **Block Tier 1 violations** immediately
4. **Request clarification** if MAD classification is unclear

---

## Validation Checklist

Before implementing a new rule, verify:

- [ ] All terminology matches MAD definitions
- [ ] No instances of "if applicable" without explicit triggers
- [ ] References to MAD include decision tree citation
- [ ] Stateful vs Stateless entity distinctions are clear
- [ ] Triggers and exclusions are mutually exclusive and comprehensive
- [ ] Tier classification matches enforcement level

---

## Related Documentation

- **Glossary:** `docs/developer/Glossary Compliance Analysis.md`
- **Rule Compliance Matrix:** `docs/compliance-reports/rule-compliance-matrix.md`
- **OPA Policies:** `services/opa/policies/`
- **Enforcement Rules:** `.cursor/rules/*.mdc`

---

**Last Updated:** 2025-12-05  
**Maintained By:** Rules Champion Team  
**Version:** 1.0.0

