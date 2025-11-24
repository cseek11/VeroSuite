# Week 4 Complex Tasks - FINAL DECISIONS

**Created:** 2025-11-23  
**Status:** APPROVED - Ready for Implementation  
**Purpose:** Final approved replacements for complex terminology and pattern changes

---

## Task 1: Replace "Significant Decision" with MAD Classification

### Overview

Found 22 instances of "Significant Decision" across documentation files. Each requires classification into appropriate MAD tier.

---

### Instance Group 1: VeroField_Rules_2.1.md (10 instances)

#### Instance 1.1: Line 294 (Glossary Definition)

**Current:**
```markdown
**Significant Decision:** Architectural or design decision affecting:
```

**Approved Replacement:**
```markdown
**MAD (Major Action/Decision):** An action or decision with high potential for risk, significant impact, or requiring human validation.

Categories:
- **Tier 1 MAD (BLOCK):** Security, tenant isolation, architecture boundaries
- **Tier 2 MAD (OVERRIDE):** Breaking changes, state transitions, layer synchronization  
- **Tier 3 MAD (WARNING):** Tech debt, TODO additions, style violations

Architectural or design decision affecting:
```

**Decision:** ✅ **APPROVED**
- Context: Glossary definition in main rules document
- Rationale: Comprehensive MAD definition with tier breakdown provides clarity for all subsequent references
- Implementation: Replace exact text at Line 294

---

#### Instance 1.2-1.10: Lines 1453, 3849, 3878, 3892, 4029, 4035, 4054, 4192, 4215

**Context:** OPA policy examples, workflow definitions, and CI checks

**Current:**
```
Line 1453: | 1 | 00-master.mdc | Engineering Decisions | Significant decision | MUST verify...
Line 3849: A[Change/Decision Made] --> B{Significant Decision?}
Line 3878: Before finalizing code involving significant decisions, verify:
Line 4029: # HARD STOP: Significant decision without documentation
Line 4035: msg := "HARD STOP [Decisions]: Significant decision detected..."
Line 4054: # Helper: Detect significant decisions
Line 4192: - name: Check if significant decision
Line 4215: echo "❌ Significant decision detected but not documented"
```

**Approved Replacement:**
```
Line 1453: | 1 | 00-master.mdc | Engineering Decisions | MAD | MUST verify...
Line 3849: A[Change/Decision Made] --> B{MAD?}
Line 3878: Before finalizing code involving MADs, verify:
Line 4029: # HARD STOP: MAD without documentation
Line 4035: msg := "HARD STOP [Decisions]: MAD detected..."
Line 4054: # Helper: Detect MADs
Line 4192: - name: Check if MAD
Line 4215: echo "❌ MAD detected but not documented"
```

**Decision:** ✅ **APPROVED - Option A (generic "MAD")**
- Context: Example code and templates
- Rationale: Templates should work for all tiers; tier-specific classification happens in policy logic, not template variables
- Implementation: Find/replace "Significant decision" → "MAD" (case-sensitive variants)

---

### Instance Group 2: # VeroField Rules 2.md (3 instances)

#### Lines 91, 214, 221

**Current:**
```
Line 91: #### GAP #7: "Significant Decision" Still In Use ⚠️ PARTIAL
Line 214: - All 15 `.cursor/rules/*.mdc` files (9 instances of "Significant Decision")
Line 221: 1. Replace "Significant Decision" with MAD classification:
```

**Approved Replacement:**
```
Line 91: #### GAP #7: "Significant Decision" → MAD Migration ✅ COMPLETE (2025-11-23)
Line 214: - All 15 `.cursor/rules/*.mdc` files (MAD terminology implemented)
Line 221: 1. MAD classification implementation (COMPLETE - see VeroField_Rules_2.1.md):
```

**Decision:** ✅ **APPROVED - Mark as complete**
- Context: Audit plan document tracking implementation progress
- Rationale: Tracking documents should reflect current status; version control preserves historical state
- Implementation: Update status markers and add completion date

---

### Instance Group 3: Glossary Compliance Analysis.md (8 instances)

#### Lines 3, 6, 8, 207, 225, 233, 246, 282, 519

**Current:**
```
Line 3: ...you're still using "Significant Decision" in your current glossary...
Line 6: 1. Conflicting "Significant Decision" Definition
Line 8: markdown**Significant Decision:** Architectural or design decision...
Line 207: Replace "Significant Decision" with MAD throughout the glossary
Line 225: ...flags usage of deprecated terms (e.g., "if applicable", "significant decision")
Line 233: No instances of "Significant Decision" remain (use MAD)
Line 246: Fix MAD/Significant Decision conflict (30 mins)
Line 282: *This term replaces:* "Significant decision", "meaningful decision", "major decision"
Line 519: | Significant decision | Major Action/Decision (MAD) | Section 1.1 |
```

**Decision:** ✅ **APPROVED - Option A (leave as-is)**
- Context: Compliance analysis document (meta-documentation)
- Rationale: This document describes the problem and solution; preserving "Significant Decision" shows what was replaced and provides migration context for future reference
- Implementation: **NO CHANGES** - Document serves as historical record of the migration rationale

---

### Instance Group 4: mad-decision-tree.md (0 instances)

✅ **No action needed** - Already uses MAD terminology

---

## Task 2: Split "Stateful Entity" Definitions

### Overview

Need to split "Stateful Entity" into two distinct concepts:
1. **Technical Stateful Entity:** Infrastructure components (databases, caches, queues, session storage)
2. **Business Stateful Entity:** Domain models with state machines (WorkOrder, Invoice, Payment)

Found 11 instances across documentation files.

---

### Instance Group 1: VeroField_Rules_2.1.md (8 instances)

#### Instance 2.1: Line 306 (Glossary Definition)

**Current:**
```markdown
**Stateful Entity:** Entity with:
- Status/state field that changes over time
- Workflow states (e.g., draft → review → approved)
- Lifecycle states (e.g., created → active → archived)
- Examples: WorkOrder, Invoice, Payment, User
```

**Approved Replacement:**
```markdown
**Stateful Entity:** Any component that retains information about past interactions and uses that information to influence behavior. Two types:

1. **Technical Stateful Entity:** Infrastructure components that store state
   - Examples: Databases, caches, Redis, session stores, message queues, AI agent memory
   - Risks: Data corruption, race conditions, inconsistency, data loss
   - Requirements: 
     - Transaction management for ACID operations
     - Backup/recovery procedures documented
     - Connection pooling and timeout handling
     - Cache invalidation strategy (if applicable)
     - Queue ordering guarantees (if applicable)
   - See also: Infrastructure layer rules (03-infrastructure.mdc)

2. **Business Stateful Entity:** Domain models with defined state machines
   - Examples: WorkOrder, Invoice, Payment, User, Tenant
   - Characteristics: Status/state field, workflow states, lifecycle transitions
   - Requirements:
     - State machine documented in `docs/state-machines/{entity}.md`
     - State transition validation enforced in code
     - Audit logs for state changes maintained
   - See also: State machine rules (05-data.mdc)

**When in doubt:** If it has a "status" or "state" field with legal transitions, it's Business. If it's infrastructure that persists data, it's Technical.
```

**Decision:** ✅ **APPROVED - Combined definition with two types**
- Context: Main glossary definition
- Rationale: Maintains conceptual unity while enforcing technical distinction; prevents glossary sprawl; provides clear disambiguation guidance
- Implementation: Replace entire definition at Line 306

---

#### Instance 2.2-2.8: Lines 1456, 4522, 5967, 5993, 7000, 7005

**Current:**
```
Line 1456: | 4 | 05-data.mdc | State Machine Docs | Stateful entity change | MUST verify...
Line 4522: - [ ] State machine docs updated (if stateful entity)
Line 5967: ### What is a "Stateful Entity"?
Line 5993: #### New Stateful Entity:
Line 7000: # HARD STOP: Stateful entity without state machine docs
Line 7005: msg := "HARD STOP [State Machines]: Stateful entity detected..."
```

**Approved Replacement:**
```
Line 1456: | 4 | 05-data.mdc | State Machine Docs | Business stateful entity change | MUST verify...
Line 4522: - [ ] State machine docs updated (if business stateful entity)
Line 5967: ### What is a "Business Stateful Entity"?
Line 5993: #### New Business Stateful Entity:
Line 7000: # HARD STOP: Business stateful entity without state machine docs
Line 7005: msg := "HARD STOP [State Machines]: Business stateful entity detected..."
```

**Decision:** ✅ **APPROVED - Option A (specify "Business Stateful Entity")**
- Context: State machine documentation requirements
- Rationale: These contexts refer to entities requiring state machine documentation (WorkOrder, Invoice, etc.), which are Business Stateful Entities; makes requirements more precise and prevents false positives
- Implementation: Find/replace "Stateful entity" → "Business stateful entity" in these specific contexts

**Additional Action Required:** ✅ **Add separate checks for Technical Stateful Entities**

Add new checklist section after Line 4522:

```markdown
- [ ] Transaction handling verified (if technical stateful entity)
- [ ] Backup/recovery procedures documented and tested (if technical stateful entity)
- [ ] Connection pooling and timeout handling configured (if technical stateful entity)
```

Add new OPA policy section (location: near Line 7005):

```rego
# HARD STOP: Technical stateful entity without resilience measures
technical_stateful_without_resilience[msg] {
  is_technical_stateful_entity
  not has_transaction_handling
  msg := "HARD STOP [Infrastructure]: Technical stateful entity detected without transaction handling. Required: transaction management, backup procedures, timeout handling."
}
```

---

### Instance Group 2: mad-decision-tree.md (3 instances)

#### Lines 63, 137, 224

**Current:**
```
Line 63: │ Stateful Entity? │
Line 137: **Question:** Does the action involve interaction with a Stateful Entity...
Line 224: - Changing stateful entity schemas
```

**Approved Replacement:**
```
Line 63: │ Stateful Entity (Technical or Business)? │

Line 137: **Question:** Does the action involve interaction with a Stateful Entity (Technical or Business) in a way that could corrupt data or create an unrecoverable state?

**Technical Stateful Entity examples:**
- Modifying database schemas without migration
- Changing cache invalidation logic
- Altering queue message formats
- Breaking transaction boundaries

**Business Stateful Entity examples:**
- Adding new workflow states without documentation
- Changing state transition rules
- Bypassing state validation
- Modifying lifecycle definitions

Line 224: - Changing stateful entity schemas (database or business model)
```

**Decision:** ✅ **APPROVED - Clarify both types**
- Context: MAD decision tree (applies to both types)
- Rationale: Decision tree should catch both Technical and Business stateful entities; concrete examples help developers classify correctly without overcomplicating the tree
- Implementation: Update text inline with clarifying examples

---

## Task 3: Add Explicit Triggers for "if applicable"

### Overview

Found 9 instances of "if applicable" in `.cursor/rules/` files. Each requires replacement with explicit trigger conditions.

---

### Instance Group 1: 01-enforcement.mdc & agent-instructions.mdc (8 instances)

#### Instance 3.1: Line 53/70 - Shared Libraries

**Current:**
```markdown
- [ ] **MUST** verify using shared libraries from `libs/common/` if applicable
```

**Approved Replacement:**
```markdown
- [ ] **MUST** verify using shared libraries from `libs/common/` when:
  - Code is reusable across ≥2 apps/services within `apps/`
  - Logic is domain-agnostic (auth, validation, types, utilities)
  - Pattern already exists in `libs/common/` for similar functionality
  - NOT applicable for: app-specific business logic, UI components, one-off features
  - **Decision aid:** If you're copying code between apps, it belongs in shared libs
```

**Decision:** ✅ **APPROVED**
- Context: Monorepo shared library usage
- Rationale: Clear criteria with quantifiable threshold (≥2 apps); decision aid helps edge cases
- Implementation: Replace text at Lines 53 and 70

---

#### Instance 3.2: Line 59/76 - Security Event Logging

**Current:**
```markdown
- [ ] **MUST** verify security event logging (if applicable)
```

**Approved Replacement:**
```markdown
- [ ] **MUST** verify security event logging when:
  - Authentication or authorization logic changed
  - PII or sensitive data modified (always log)
  - PII or sensitive data accessed in privileged contexts (admin, security diagnostics)
  - Security policies (RLS, permissions, roles) changed
  - Admin actions performed (impersonation, privilege escalation)
  - Financial transactions processed
  - NOT applicable for: anonymous public endpoints, static asset serving
  - **Critical:** Log metadata only, never raw PII values (SOC2/privacy compliance)
```

**Decision:** ✅ **APPROVED with refinement**
- Context: Security audit trail requirements
- Rationale: Balances comprehensive logging with privacy compliance; distinguishes privileged access from routine access; emphasizes metadata-only logging
- Implementation: Replace text at Lines 59 and 76

---

#### Instance 3.3: Line 64/81 - Cross-Platform Compatibility

**Current:**
```markdown
- [ ] **MUST** verify cross-platform compatibility (if applicable)
```

**Approved Replacement:**
```markdown
- [ ] **MUST** verify cross-platform compatibility when:
  - Code touches mobile app (`VeroFieldMobile/`)
  - Shared code used by web + mobile
  - File system operations (path separators, case sensitivity)
  - Date/time handling (timezone, locale, formatting)
  - Network requests (connectivity checks, offline handling, API retries)
  - Platform-specific APIs used (localStorage vs AsyncStorage)
  - Third-party library usage that may not have platform parity
  - Push notification logic (mobile-only features)
  - Feature flags used by both platforms
  - NOT applicable for: web-only features, backend-only code, platform-abstracted code
```

**Decision:** ✅ **APPROVED with additions**
- Context: Web + mobile app compatibility
- Rationale: Comprehensive coverage of cross-platform concerns synthesized from expert input; includes network, storage, notifications, and feature flags
- Implementation: Replace text at Lines 64 and 81

---

#### Instance 3.4: Line 70/87 - Tech Debt Logging

**Current:**
```markdown
- [ ] **MUST** verify tech debt logged (if applicable)
```

**Approved Replacement:**
```markdown
- [ ] **MUST** verify tech debt logged when:
  - TODO/FIXME comments representing deferred work or technical shortcuts
  - Workarounds or temporary solutions implemented
  - Known limitations introduced that affect users
  - Performance optimizations deferred (with measurable impact)
  - **Triage rule:** If removing the TODO would require >2 hours OR create risk if forgotten, log it
  - NOT applicable for: Trivial cleanup TODOs, refactoring notes, completed work markers
```

**Decision:** ✅ **APPROVED with triage guidance**
- Context: Tech debt tracking requirements
- Rationale: Selective approach prevents documentation fatigue; triage rule provides clear threshold; focuses on meaningful technical debt
- Implementation: Replace text at Lines 70 and 87

---

### Instance Group 2: 00-master.mdc (1 instance)

#### Instance 3.5: Line 240 - Error Pattern Documentation

**Current:**
```markdown
3. Document error pattern in `docs/error-patterns.md` (if applicable)
```

**Approved Replacement:**
```markdown
3. Document error pattern in `docs/error-patterns.md` when:
  - Bug occurred in production OR affected multiple users
  - Bug fix addresses a recurring pattern (≥2 occurrences)
  - Root cause is non-obvious or required >1 hour to diagnose
  - Prevention strategy can help future development
  - **ALWAYS document:** Security bugs, data corruption, financial calculation errors, production incidents
  - **NOT applicable for:** Typos, simple logic errors with obvious fixes, one-off edge cases
  - **Decision aid:** If someone else could make the same mistake, document it
```

**Decision:** ✅ **APPROVED**
- Context: Bug fix documentation requirements
- Rationale: Balances documentation value against overhead; severity-based rules ensure critical issues are always documented; focuses on reusable knowledge
- Implementation: Replace text at Line 240

---

## Implementation Checklist

### Phase 1: Glossary Updates (30 minutes)
- [ ] Update MAD definition at VeroField_Rules_2.1.md Line 294
- [ ] Update Stateful Entity definition at VeroField_Rules_2.1.md Line 306
- [ ] Verify cross-references in glossary still work

### Phase 2: Template & Example Updates (45 minutes)
- [ ] Replace "Significant decision" → "MAD" at Lines 1453, 3849, 3878, 3892, 4029, 4035, 4054, 4192, 4215
- [ ] Replace "Stateful entity" → "Business stateful entity" at Lines 1456, 4522, 5967, 5993, 7000, 7005
- [ ] Add Technical Stateful Entity checks after Line 4522
- [ ] Add Technical Stateful Entity OPA policy near Line 7005

### Phase 3: Decision Tree Updates (15 minutes)
- [ ] Update mad-decision-tree.md Lines 63, 137, 224 with clarifications
- [ ] Add Technical vs Business examples to decision tree

### Phase 4: Explicit Trigger Replacements (30 minutes)
- [ ] Replace "if applicable" at Lines 53/70 (Shared Libraries)
- [ ] Replace "if applicable" at Lines 59/76 (Security Logging)
- [ ] Replace "if applicable" at Lines 64/81 (Cross-Platform)
- [ ] Replace "if applicable" at Lines 70/87 (Tech Debt)
- [ ] Replace "if applicable" at Line 240 (Error Patterns)

### Phase 5: Status Updates (10 minutes)
- [ ] Mark # VeroField Rules 2.md Lines 91, 214, 221 as COMPLETE
- [ ] Add completion date (2025-11-23)
- [ ] **DO NOT** modify Glossary Compliance Analysis.md (preserve historical record)

### Phase 6: Verification (30 minutes)
- [ ] Search for remaining "Significant Decision" instances (should be 0 except in Glossary Compliance Analysis.md)
- [ ] Search for ambiguous "Stateful entity" references (should specify Technical or Business)
- [ ] Search for remaining "if applicable" instances (should be 0 in enforcement files)
- [ ] Run grep/search for consistency check
- [ ] Human review of final changes

---

## Summary of Approved Changes

### Task 1: "Significant Decision" → MAD (22 instances)
- ✅ Comprehensive MAD definition approved
- ✅ Generic "MAD" in templates (tier-agnostic)
- ✅ Audit tracking marked complete
- ✅ Historical compliance analysis preserved as-is

### Task 2: "Stateful Entity" Split (11 instances + new checks)
- ✅ Combined glossary definition with two clear types
- ✅ Specify "Business" in state machine contexts
- ✅ Add separate checks for Technical Stateful Entities
- ✅ Clarify both types in MAD decision tree

### Task 3: "if applicable" → Explicit Triggers (9 instances)
- ✅ Shared libraries: ≥2 apps threshold + decision aid
- ✅ Security logging: Privileged access nuance + metadata-only rule
- ✅ Cross-platform: 9 specific criteria including network/notifications
- ✅ Tech debt: >2 hour triage rule + selective logging
- ✅ Error patterns: Severity-based with decision aid

---

**Total Estimated Implementation Time:** 2.5 hours  
**Risk Level:** Low (text-only changes, no code execution)  
**Verification Required:** Human review after automated replacements  

**Status:** APPROVED - Ready for Implementation  
**Approved:** 2025-11-23  
**Next Action:** Begin Phase 1 (Glossary Updates)