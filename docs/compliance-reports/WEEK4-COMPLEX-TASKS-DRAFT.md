# Week 4 Complex Tasks - DRAFT FOR REVIEW

**Created:** 2025-12-05  
**Status:** DRAFT - Awaiting Human Review  
**Purpose:** Draft replacements for complex terminology and pattern changes

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

**Proposed Replacement:**
```markdown
**MAD (Major Action/Decision):** An action or decision with high potential for risk, significant impact, or requiring human validation.

Categories:
- **Tier 1 MAD (BLOCK):** Security, tenant isolation, architecture boundaries
- **Tier 2 MAD (OVERRIDE):** Breaking changes, state transitions, layer synchronization  
- **Tier 3 MAD (WARNING):** Tech debt, TODO additions, style violations

Architectural or design decision affecting:
```

**[REVIEW NEEDED]:**
- Context: Glossary definition in main rules document
- Recommendation: Use comprehensive MAD definition with tier breakdown
- Impact: This is a key definition that other sections reference

**Human Decision:**
- [ ] Approve proposed replacement
- [ ] Modify: ___________

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

**Proposed Replacement (Option A - Generic "MAD"):**
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

**[REVIEW NEEDED]:**
- Context: Example code and templates
- Recommendation: Use generic "MAD" for flexibility (templates should work for all tiers)
- Alternative: Could specify "Tier 1/2/3 MAD" if examples need to be tier-specific
- Impact: These are templates that will be copied/adapted

**Human Decision:**
- [ ] Approve Option A (generic "MAD")
- [ ] Use tier-specific (specify which): ___________
- [ ] Other: ___________

---

### Instance Group 2: # VeroField Rules 2.md (3 instances)

#### Lines 91, 214, 221

**Current:**
```
Line 91: #### GAP #7: "Significant Decision" Still In Use ⚠️ PARTIAL
Line 214: - All 15 `.cursor/rules/*.mdc` files (9 instances of "Significant Decision")
Line 221: 1. Replace "Significant Decision" with MAD classification:
```

**Proposed Replacement:**
```
Line 91: #### GAP #7: "Significant Decision" → MAD Migration ✅ COMPLETE
Line 214: - All 15 `.cursor/rules/*.mdc` files (MAD terminology implemented)
Line 221: 1. MAD classification implementation (COMPLETE):
```

**[REVIEW NEEDED]:**
- Context: Audit plan document tracking implementation progress
- Recommendation: Update to reflect completion status
- Impact: Shows project progress accurately

**Human Decision:**
- [ ] Approve (mark as complete)
- [ ] Keep as-is (preserve historical state)
- [ ] Other: ___________

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

**Proposed Action:**

**Option A: Leave as-is (Historical Record)**
- This document describes the problem and solution
- Keeping "Significant Decision" shows what was replaced
- Provides migration context

**Option B: Update to Past Tense**
```
Line 3: ...was using "Significant Decision" (now replaced with MAD)...
Line 6: 1. Resolved: "Significant Decision" → MAD Migration
Line 233: ✅ COMPLETE: No instances of "Significant Decision" remain
Line 246: ✅ COMPLETE: MAD/Significant Decision conflict resolved (2025-12-05)
```

**[REVIEW NEEDED]:**
- Context: Compliance analysis document (meta-documentation)
- Recommendation: Option A (preserve historical context for future reference)
- Impact: This document explains WHY the change was made

**Human Decision:**
- [ ] Approve Option A (leave as-is)
- [ ] Use Option B (update to completion)
- [ ] Other: ___________

---

### Instance Group 4: mad-decision-tree.md (0 instances)

✅ No "Significant Decision" found - already uses MAD terminology

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

**Proposed Replacement:**
```markdown
**Stateful Entity:** Any component that retains information about past interactions and uses that information to influence behavior. Two types:

1. **Technical Stateful Entity:** Infrastructure components that store state
   - Examples: Databases, caches, queues, session storage, AI agent memory
   - Risk: Data corruption, inconsistency, loss
   - Requires: Transaction management, backup/recovery procedures

2. **Business Stateful Entity:** Domain models with defined state machines
   - Examples: WorkOrder, Invoice, Payment, User
   - Has: Status/state field, workflow states, lifecycle transitions
   - Requires: State machine documentation in `docs/state-machines/`
   - Validation: Legal transitions enforced, audit logs maintained
```

**[REVIEW NEEDED]:**
- Context: Main glossary definition
- Recommendation: Split into two clear categories with distinct requirements
- Impact: Affects how rules check for "stateful entity" changes
- Question: Should we create separate glossary entries or keep combined?

**Human Decision:**
- [ ] Approve combined definition with two types
- [ ] Split into two separate glossary entries
- [ ] Modify: ___________

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

**Proposed Replacement Strategy:**

**Option A: Specify "Business Stateful Entity" (most instances)**
```
Line 1456: | 4 | 05-data.mdc | State Machine Docs | Business stateful entity change | MUST verify...
Line 4522: - [ ] State machine docs updated (if business stateful entity)
Line 5967: ### What is a "Business Stateful Entity"?
Line 5993: #### New Business Stateful Entity:
Line 7000: # HARD STOP: Business stateful entity without state machine docs
Line 7005: msg := "HARD STOP [State Machines]: Business stateful entity detected..."
```

**Rationale:** These contexts refer to entities requiring state machine documentation (WorkOrder, Invoice, etc.), which are Business Stateful Entities.

**Option B: Keep generic "Stateful Entity"**
- Use context to determine which type applies
- Add clarification in surrounding text

**[REVIEW NEEDED]:**
- Context: State machine documentation requirements
- Recommendation: Option A (specify "Business Stateful Entity")
- Impact: Makes requirements more precise
- Question: Should Technical Stateful Entities have different checks?

**Human Decision:**
- [ ] Approve Option A (specify "Business")
- [ ] Use Option B (keep generic)
- [ ] Add separate checks for Technical Stateful Entities
- [ ] Other: ___________

---

### Instance Group 2: mad-decision-tree.md (3 instances)

#### Lines 63, 137, 224

**Current:**
```
Line 63: │ Stateful Entity? │
Line 137: **Question:** Does the action involve interaction with a Stateful Entity...
Line 224: - Changing stateful entity schemas
```

**Proposed Replacement:**
```
Line 63: │ Stateful Entity (Technical or Business)? │
Line 137: **Question:** Does the action involve interaction with a Stateful Entity (Technical or Business) in a way that could corrupt data or create an unrecoverable state?
Line 224: - Changing stateful entity schemas (database or business model)
```

**[REVIEW NEEDED]:**
- Context: MAD decision tree (applies to both types)
- Recommendation: Keep generic but clarify both types apply
- Impact: Decision tree should catch both Technical and Business stateful entities
- Question: Should we have separate decision tree branches for each type?

**Human Decision:**
- [ ] Approve (clarify both types)
- [ ] Create separate branches for Technical vs Business
- [ ] Keep as-is (generic is sufficient)
- [ ] Other: ___________

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

**Proposed Replacement:**
```markdown
- [ ] **MUST** verify using shared libraries from `libs/common/` when:
  - Code is reusable across multiple apps/services
  - Logic is domain-agnostic (auth, validation, types, utilities)
  - NOT applicable for: app-specific business logic, UI components
```

**[REVIEW NEEDED]:**
- Context: Monorepo shared library usage
- Recommendation: Specify when shared libraries should be used
- Question: Are there other criteria for shared libraries?

**Human Decision:**
- [ ] Approve proposed triggers
- [ ] Add criteria: ___________
- [ ] Modify: ___________

---

#### Instance 3.2: Line 59/76 - Security Event Logging

**Current:**
```markdown
- [ ] **MUST** verify security event logging (if applicable)
```

**Proposed Replacement:**
```markdown
- [ ] **MUST** verify security event logging when:
  - Authentication or authorization logic changed
  - PII or sensitive data accessed/modified
  - Security policies (RLS, permissions) changed
  - Admin actions performed
  - NOT applicable for: read-only operations, public endpoints
```

**[REVIEW NEEDED]:**
- Context: Security audit trail requirements
- Recommendation: Specify security-sensitive operations
- Question: Should all PII access be logged or only modifications?

**Human Decision:**
- [ ] Approve proposed triggers
- [ ] Modify PII logging requirement: ___________
- [ ] Add criteria: ___________

---

#### Instance 3.3: Line 64/81 - Cross-Platform Compatibility

**Current:**
```markdown
- [ ] **MUST** verify cross-platform compatibility (if applicable)
```

**Proposed Replacement:**
```markdown
- [ ] **MUST** verify cross-platform compatibility when:
  - Code touches mobile app (`VeroFieldMobile/`)
  - Shared code used by web + mobile
  - File system operations (path separators)
  - Date/time handling (timezone, locale)
  - NOT applicable for: web-only features, backend-only code
```

**[REVIEW NEEDED]:**
- Context: Web + mobile app compatibility
- Recommendation: Specify cross-platform scenarios
- Question: Are there other platform-specific concerns?

**Human Decision:**
- [ ] Approve proposed triggers
- [ ] Add criteria: ___________
- [ ] Modify: ___________

---

#### Instance 3.4: Line 70/87 - Tech Debt Logging

**Current:**
```markdown
- [ ] **MUST** verify tech debt logged (if applicable)
```

**Proposed Replacement:**
```markdown
- [ ] **MUST** verify tech debt logged when:
  - TODO/FIXME comments added
  - Workarounds or temporary solutions implemented
  - Known limitations introduced
  - Performance optimizations deferred
  - NOT applicable for: bug fixes, feature completion, refactoring to better patterns
```

**[REVIEW NEEDED]:**
- Context: Tech debt tracking requirements
- Recommendation: Specify when debt must be logged
- Question: Should all TODOs require tech debt log entries?

**Human Decision:**
- [ ] Approve proposed triggers
- [ ] Modify TODO requirement: ___________
- [ ] Add criteria: ___________

---

### Instance Group 2: 00-master.mdc (1 instance)

#### Instance 3.5: Line 240 - Error Pattern Documentation

**Current:**
```markdown
3. Document error pattern in `docs/error-patterns.md` (if applicable)
```

**Proposed Replacement:**
```markdown
3. Document error pattern in `docs/error-patterns.md` when:
  - Bug fix addresses a recurring pattern
  - Root cause is non-obvious or complex
  - Prevention strategy can help future development
  - ALWAYS applicable for: security bugs, data corruption bugs, production incidents
  - NOT applicable for: typos, simple logic errors with obvious fixes
```

**[REVIEW NEEDED]:**
- Context: Bug fix documentation requirements
- Recommendation: Specify when pattern documentation adds value
- Question: Should all bugs be documented or only complex/recurring ones?

**Human Decision:**
- [ ] Approve proposed triggers
- [ ] Require documentation for ALL bugs
- [ ] Modify criteria: ___________

---

## Summary of Review Decisions Needed

### Task 1: "Significant Decision" → MAD (22 instances)

1. **VeroField_Rules_2.1.md Line 294:** Approve comprehensive MAD definition?
2. **VeroField_Rules_2.1.md Lines 1453-4215:** Use generic "MAD" or tier-specific?
3. **# VeroField Rules 2.md:** Mark as complete or preserve historical state?
4. **Glossary Compliance Analysis.md:** Leave as-is or update to completion?

### Task 2: "Stateful Entity" Split (11 instances)

1. **VeroField_Rules_2.1.md Line 306:** Combined definition or separate entries?
2. **VeroField_Rules_2.1.md Lines 1456-7005:** Specify "Business" or keep generic?
3. **mad-decision-tree.md:** Clarify both types or separate branches?
4. **Should Technical Stateful Entities have different checks?**

### Task 3: "if applicable" → Explicit Triggers (9 instances)

1. **Shared libraries:** Approve proposed criteria?
2. **Security logging:** Approve proposed triggers? Clarify PII logging?
3. **Cross-platform:** Approve proposed criteria? Add more?
4. **Tech debt:** Approve proposed triggers? All TODOs or selective?
5. **Error patterns:** Document all bugs or only complex/recurring?

---

## Next Steps

1. **Human reviews this document**
2. **Human provides decisions for each `[REVIEW NEEDED]` section**
3. **AI implements approved changes**
4. **Human verifies final changes**
5. **Mark Week 4 Complex Tasks as complete**

---

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-12-05  
**Review By:** [Human to specify]
