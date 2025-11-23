Glossary Compliance Analysis
Executive Summary
Your glossary has significant terminology inconsistencies that will confuse AI agents and developers. The most critical issue: you're still using "Significant Decision" in your current glossary (Section 1), which directly contradicts the MAD consolidation we just created.

Critical Issues (HARD STOP)
1. Conflicting "Significant Decision" Definition
Problem:
markdown**Significant Decision:** Architectural or design decision affecting:
- Service boundaries
- Database schema (multiple modules)
- Major refactoring (>50 files)
- Technology stack
- Design patterns
This conflicts with MAD terminology. You have two competing decision classification systems.
Fix Required:
markdown**Major Action/Decision (MAD):** An Action or Decision with high 
potential for risk, significant impact, or requiring human validation.

Categories:
1. **Production Impact:** Production changes, deployment operations
2. **Code Integration:** Merging to primary branches (main, master, develop)
3. **Architecture:** Service boundaries, database schema (multiple modules), 
   major refactoring (>50 files), technology stack changes, design patterns
4. **Data Sensitivity:** PII handling, security-sensitive changes
5. **Breaking Changes:** Non-backward-compatible alterations
6. **Data Safety:** Stateful entity modifications risking corruption

**Decision Tree:** See Section 3 for MAD classification logic.

2. "Stateful Entity" Definition Mismatch
Your Current Definition:
markdown**Stateful Entity:** Entity with:
- Status/state field that changes over time
- Workflow states (e.g., draft → review → approved)
- Lifecycle states (e.g., created → active → archived)
- Examples: WorkOrder, Invoice, Payment, User
Our MAD Glossary Definition:
markdown**Stateful Entity:** Any component that retains information about 
past interactions and uses that information to influence behavior.
Examples: Databases, caches, session storage, AI agent memory
These are fundamentally different concepts:

Yours: Business domain entities with state machines (WorkOrder, Invoice)
Ours: Technical infrastructure components (databases, caches)

Resolution Options:
Option A (Recommended): Split into two terms
markdown**Stateful Entity (Technical):** Infrastructure component retaining 
information across interactions (databases, caches, session storage).

**Stateful Business Entity:** Domain model with workflow states 
(draft→review→approved). Examples: WorkOrder, Invoice, Payment.
Option B: Context-specific disambiguation
markdown**Stateful Entity:** 
- **In infrastructure context:** Components like databases, caches
- **In domain context:** Business entities with lifecycle states
- **Use explicit modifiers** when writing rules to avoid confusion

3. "Breaking Change" Lacks Decision Tree Integration
Current Definition:
markdown**Breaking Change:** Non-backward-compatible alteration...
- **Triggers:** Schema changes, API modifications
- **Requirements:** Migration guide, version bump
- **Consequences:** Missing documentation = HARD STOP
Problem: Doesn't reference MAD classification.
Fix:
markdown**Breaking Change:** Non-backward-compatible alteration requiring 
consumer updates. **Classified as MAD (Breaking Changes category).**

**Triggers:**
- Schema changes removing fields
- API endpoint modifications
- Event contract changes
- DTO field removals

**MANDATORY Requirements:**
- Migration guide (see `docs/migrations/`)
- Version bump (MAJOR increment)
- Consumer notification (minimum 2 weeks notice)
- **MAD approval process** (see Section 3 Decision Tree)

**Consequences:**
- Missing migration guide = HARD STOP (CI blocks)
- Missing MAD approval = HARD STOP (human review required)

4. "Layer Sync" Missing from Glossary
Current Status:
markdown**Layer Sync:** Ensuring schema, DTOs, API types remain consistent.
- **Triggers:** Schema changes, DTO modifications
- **Requirements:** All layers updated in same PR
- **Consequences:** Missing synchronization = HARD STOP
Problem: Uses vague "HARD STOP" without linking to enforcement.
Fix:
markdown**Layer Sync:** Ensuring schema, DTOs, API types, and frontend types 
remain synchronized across all layers of the application stack.

**Classified as:** MANDATORY requirement for data-related MADs

**Triggers:**
- Database schema changes
- DTO modifications in `src/dtos/`
- API type changes in `src/types/api/`
- Event model changes in `src/events/`

**Requirements:**
- All layers MUST be updated in the same PR
- Regression tests MUST cover all updated layers
- Run `npm run verify:layer-sync` before committing

**Enforcement:**
- CI check: `layer-sync.rego` policy (pre-merge stage)
- Agent check: Step 5 verification checklist

**Consequences:**
- Missing synchronization = CI blocks merge + human review required
- False positive exemption: Add to `.compliance-exemptions.json`

Medium Priority Issues
5. Inconsistent "If Applicable" Equivalent: "Required for"
You've eliminated "if applicable" but introduced "Required for:" which has the same problem:
Examples in your glossary:
markdown**Regression Test:** ... MANDATORY for all bug fixes.
**Rollback Plan:** Required for:
- Database migrations
- Feature flags
- Infrastructure changes
Problem: "Required for" is still ambiguous. What about bug fixes to documentation? What about feature flags in dev environments?
Fix Pattern:
markdown**Regression Test:** Test added after fixing a reproducible bug to 
prevent recurrence.

**MANDATORY Triggers:**
- Bug fix in production code (src/, excluding tests/)
- Bug affects user-facing functionality
- Bug was reported in production environment

**Exclusions:**
- Documentation fixes
- Test-only changes
- Build/tooling configuration changes

**Enforcement:** CI requires test file in same PR as bug fix commit

6. Missing Terms That Should Be in Glossary
Based on your Rule Template (Section 2), you reference terms not defined in Section 1:
Missing from Glossary:

HARD STOP (used 3 times in definitions)
Step 5 Verification (referenced in Rule Template)
OPA Policy (mentioned in Section 3)
CI Stage (pre-merge, post-merge, etc.)
Compliance Exemption (.compliance-exemptions.json)
Grandfathering (mentioned once, needs more detail)

Add These:
markdown**HARD STOP:** A compliance violation that automatically blocks code 
from merging until resolved. Enforced by CI/CD pipeline failures.
- **Examples:** Missing migration guide for breaking changes, unsynchronized layers
- **Override process:** Requires manual exemption in `.compliance-exemptions.json`

**Step 5 Verification:** Final pre-commit checklist agents/developers 
must complete before submitting code. Maps to OPA policies where automatable.
- **Location:** Each rule's Section 6
- **Format:** Checkbox list of MUST/SHOULD requirements

**OPA Policy (Open Policy Agent):** Automated compliance check written 
in Rego language, executed in CI/CD pipelines.
- **Location:** `.opa/policies/`
- **Naming:** Matches rule file (e.g., `05-data.mdc` → `layer-sync.rego`)

**CI Stage:** Phase in CI/CD pipeline where checks execute:
- **pre-commit:** Local checks before git commit
- **pre-merge:** Checks before PR can merge (e.g., layer-sync)
- **post-merge:** Checks after merge to main (e.g., deployment validation)
- **continuous:** Ongoing monitoring (e.g., performance budgets)

Low Priority Issues (Polish)
7. Alphabetization Breaks with Headers
You have A-C, D-F, G-L groupings, but:

"Grandfathered Code" (G) comes after "Golden Path" (G) ✅
"High Complexity" (H) is in G-L section ✅
But "Meaningful Tech Debt" (M) is in M-O section, while "Migration Guide" (M) is also in M-O

This works, but consider flat alphabetical listing or more granular headers (A-B, C-D, etc.) for better scannability.

8. Examples Are Too Generic
Current:
markdown**Stateful Entity:** ... Examples: WorkOrder, Invoice, Payment, User
Better (with context):
markdown**Stateful Business Entity:** Domain model with lifecycle management.

**Examples:**
- `WorkOrder`: draft → in_progress → completed → cancelled
- `Invoice`: pending → sent → paid → overdue → voided
- `Payment`: initiated → processing → succeeded → failed → refunded
- `User`: invited → active → suspended → deleted

**Triggers MAD when:**
- Adding/removing states
- Changing state transition rules
- Modifying state machine logic

Actionable Recommendations
Immediate Actions (Before Next PR)

Replace "Significant Decision" with MAD throughout the glossary
Disambiguate "Stateful Entity" using Option A (split into Technical vs Business)
Add missing enforcement terms (HARD STOP, Step 5, OPA Policy, CI Stage)
Link Breaking Change to MAD classification
Add explicit triggers/exclusions to "Required for" patterns

Quick Wins (High Impact, Low Effort)
markdown# Add cross-references between related terms:
**Breaking Change:** ... (See also: MAD, Version Bump, Migration Guide)

# Add "See Section X" references:
**Stateful Entity:** ... (Classification logic: See Section 3 MAD Decision Tree)

# Standardize consequence language:
Instead of: "Missing documentation = HARD STOP"
Use: "**Enforcement:** CI blocks merge if migration guide missing (HARD STOP)"
Long-Term Improvements

Create a compliance terminology validator: Script that scans all .mdc files and flags usage of deprecated terms (e.g., "if applicable", "significant decision")
Generate glossary from rules: Auto-extract terms used in rules files to ensure glossary completeness
Add glossary version control: Track term definition changes over time in changelog


Validation Checklist
Before deploying this glossary to .cursor/rules/:

 No instances of "Significant Decision" remain (use MAD)
 "Stateful Entity" clearly distinguishes technical vs business contexts
 All "Required for" patterns have explicit triggers + exclusions
 All terms referenced in Rule Template (Section 2) are defined in Section 1
 All enforcement mechanisms (HARD STOP, OPA, Step 5) are defined
 Breaking Change links to MAD classification
 Cross-references use consistent format: (See: [Term], [Section])


Final Recommendation
Overall Assessment: ⚠️ Solid foundation with critical terminology conflicts that must be resolved.
Priority Order:

Fix MAD/Significant Decision conflict (30 mins)
Disambiguate Stateful Entity (15 mins)
Add missing enforcement terms (20 mins)
Convert "Required for" to explicit triggers (1 hour)
Polish: Add cross-references, examples, validators (2 hours)

Estimated total effort to make glossary production-ready: 4 hours
This glossary will be excellent once you resolve the terminology conflicts. The structure is logical, the enforcement mapping is clear, and the Rule Template is well-designed. Just needs consistency with the MAD framework we established.

# AI Agent Rules Enforcement Glossary

## Section 1: Core Terminology

### 1.1 Actions and Decisions

**Action**  
An operation performed by an AI Agent that modifies the codebase, environment, or system state.

*Examples:*
- Creating, deleting, or modifying a file
- Merging a pull request
- Deploying code to any environment
- Modifying environment variables
- Installing or removing dependencies

**Decision**  
A determination made by an AI Agent based on its objectives and context, which may or may not lead to an Action.

*Examples:*
- Choosing between multiple implementation approaches
- Determining whether a code change requires testing
- Selecting which files to modify to implement a feature

**Major Action/Decision (MAD)**  
An Action or Decision that has high potential for risk, significant impact on the project, or requires human validation.

*This term replaces:* "Significant decision", "meaningful decision", "major decision"

**MAD Categories:**
1. **Production Impact**: Modifying production environment settings, deploying to production
2. **Code Integration**: Merging code into primary development branches (`main`, `master`, `develop`)
3. **Architecture**: Making architectural changes, modifying core system design
4. **Data Sensitivity**: Handling sensitive user data, modifying data schemas
5. **System Operations**: Initiating deployments, rollbacks, or failovers
6. **Breaking Changes**: Committing breaking changes to shared libraries or APIs
7. **Security**: Modifying authentication, authorization, or security configurations

### 1.2 System State

**Stateful Entity**  
Any component within the software system that retains information about past interactions and uses that information to influence current behavior or outputs.

*Examples:*
- Databases (SQL, NoSQL, graph databases)
- Caches (Redis, Memcached)
- Session storage (server-side sessions, JWT stores)
- Environment variables (persistent configuration)
- AI agent's persistent memory or context management system
- Message queues with durable messages
- File systems with persistent data

**Stateless Entity**  
A component that does not retain data from previous interactions; each request is treated as an independent transaction.

*Examples:*
- Pure functions without side effects
- Stateless API endpoints (no session data)
- Read-only configuration files
- Immutable data structures
- Static content delivery

---

## Section 2: Explicit Rule Triggers

This section replaces all instances of "if applicable" with clear, actionable conditions.

### 2.1 Logging Requirements

**Rule:** The agent must log all Major Actions/Decisions (MADs) and any actions involving Stateful Entities.

**Triggers:**
- The action is categorized as a MAD (see Section 3 decision tree)
- The action reads from or writes to a Stateful Entity
- The action modifies environment configuration
- The action results in an error or exception

**Exclusions:**
- Read-only operations on Stateless Entities
- Internal agent reasoning that doesn't result in system changes
- Temporary variable assignments in memory

### 2.2 Security Review Requirements

**Rule:** Code must be reviewed for security vulnerabilities under the following conditions.

**Triggers:**
- Changes within security-sensitive directories: `src/auth`, `src/payment`, `src/security`, `src/api/middleware`
- Modifications to authentication or authorization logic
- Changes to data validation or sanitization functions
- Introduction of external dependencies
- Modifications to API endpoints that accept user input

**Exclusions:**
- Changes to UI components that don't handle sensitive data
- Documentation updates
- Test file modifications (unless testing security features)

### 2.3 Human Approval Requirements

**Rule:** Human approval is required before executing actions that meet MAD criteria.

**Triggers:**
- Action is identified as MAD via decision tree (Section 3)
- Action affects production environment
- Action modifies primary development branch
- Action introduces breaking changes
- Action handles sensitive user data (PII, payment information, credentials)

**Exclusions:**
- Routine development tasks on feature branches
- Automated testing and linting
- Documentation generation
- Non-production environment updates (dev, staging) unless they involve sensitive data

### 2.4 Code Review Requirements

**Rule:** Code review is required before merging.

**Triggers:**
- Pull request targets `main`, `master`, or `develop` branches
- Changes exceed 500 lines of code
- Changes modify core system files (listed in `.cursor/core-files.json`)
- Changes introduce new dependencies
- Changes modify database schemas or migrations

**Exclusions:**
- Automated formatting or linting fixes (with human verification)
- Hotfixes already approved through emergency process
- Documentation-only changes to feature branches

---

## Section 3: Decision Tree for Major Actions/Decisions (MAD)

Use this decision tree to determine if an action qualifies as a MAD and requires special oversight.

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
         │                     │       └─────────┘            │ Stateful Entity? │
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

### Decision Tree Logic (Text Format)

**Question 1:** Does the action modify a production environment or handle user data?
- **YES** → **MAD (Production Impact)** → Requires human approval/oversight
- **NO** → Proceed to Question 2

**Question 2:** Does the action merge code into primary development branch (`main`, `master`, `develop`)?
- **YES** → **MAD (Code Integration)** → Requires human code review
- **NO** → Proceed to Question 3

**Question 3:** Does the action change system architecture, core dependencies, or introduce a known breaking change?
- **YES** → **MAD (Architecture)** → Requires human design review
- **NO** → Proceed to Question 4

**Question 4:** Does the action involve interaction with a Stateful Entity in a way that could corrupt data or create an unrecoverable state?
- **YES** → **MAD (Data Safety)** → Requires human validation
- **NO** → **Routine Action** → May proceed automatically (subject to other specific rules)

---

## Section 4: Implementation Guidelines

### 4.1 For Developers

When writing rules for AI agents in Cursor:

1. **Always use MAD terminology** instead of "significant", "meaningful", or "major" when describing high-impact actions
2. **Reference the decision tree** explicitly: "Use Section 3 decision tree to determine if action is MAD"
3. **Avoid "if applicable"** — instead specify exact triggers or exclusions
4. **Link to glossary definitions** using markdown anchors when introducing specialized terms

### 4.2 For AI Agents

When executing tasks:

1. **Check MAD status** for every action before execution using the Section 3 decision tree
2. **Log context** when a MAD is identified: what triggered the classification, which category applies
3. **Request human input** before executing any MAD with clear explanation of risk/impact
4. **Document reasoning** for why an action was classified as routine vs. MAD

### 4.3 Validation Checklist

Before implementing a new rule, verify:

- [ ] All terminology matches Section 1 definitions
- [ ] No instances of "if applicable" without explicit triggers
- [ ] References to MAD include decision tree citation
- [ ] Stateful vs Stateless entity distinctions are clear
- [ ] Triggers and exclusions are mutually exclusive and comprehensive

---

## Section 5: Quick Reference

| Old Term | New Term | Definition Reference |
|----------|----------|---------------------|
| Significant decision | Major Action/Decision (MAD) | Section 1.1 |
| Meaningful decision | Major Action/Decision (MAD) | Section 1.1 |
| Major decision | Major Action/Decision (MAD) | Section 1.1 |
| If applicable | [Use explicit triggers] | Section 2 |
| Stateful entity | Stateful Entity | Section 1.2 |

### Common Scenarios

| Scenario | Classification | Required Action |
|----------|---------------|-----------------|
| Create new feature file on feature branch | Routine | Proceed with logging |
| Merge PR to `main` | MAD (Code Integration) | Human code review required |
| Update dev environment variable | Routine | Proceed with logging |
| Update prod environment variable | MAD (Production Impact) | Human approval required |
| Read from database | Routine (with Stateful Entity) | Log the action |
| Migrate database schema | MAD (Data Safety + Architecture) | Human validation required |
| Install npm package | MAD (Architecture - if core dependency) | Human review for security |
| Fix typo in documentation | Routine | Proceed automatically |

---

## Appendix: Changelog

**Version 1.0** (Initial Release)
- Consolidated "significant/meaningful/major decision" → MAD
- Replaced all "if applicable" with explicit triggers
- Added decision tree for MAD classification
- Defined Stateful vs Stateless entities
- Created quick reference tables