# Task 5: R06 (Breaking Change Documentation) — Draft Summary

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R06 - Breaking Change Documentation  
**Priority:** HIGH (Tier 2 - OVERRIDE)

---

## What Was Generated

### 1. Step 5 Audit Checklist (18 items)
- **Breaking Change Detection:** 3 checks
- **PR Flagging:** 3 checks
- **Migration Guide:** 4 checks
- **Version Bump:** 3 checks
- **CHANGELOG Update:** 2 checks
- **API Documentation:** 3 checks
- **Consumer Notification:** 4 checks (2 mandatory, 2 should)

### 2. OPA Policy Mapping
- **4 violation patterns + 1 warning:**
  1. Breaking change without `[BREAKING]` tag in PR title
  2. Breaking change without migration guide
  3. Breaking change without version bump (MAJOR increment)
  4. Breaking change without CHANGELOG update
  5. Warning: API breaking change without docs update (OVERRIDE)
- **Enforcement level:** OVERRIDE (Tier 2 MAD)
- **Policy file:** `services/opa/policies/data-integrity.rego` (R06 section)

### 3. Automated Check Script
- **Script:** `.cursor/scripts/check-breaking-changes.py`
- **Checks:**
  - Detects breaking changes (API, Database, Configuration, Behavioral)
  - Verifies `[BREAKING]` tag in PR title
  - Verifies migration guide exists (`docs/migrations/`)
  - Verifies version bump (MAJOR increment)
  - Verifies CHANGELOG.md updated
  - Verifies API documentation updated (if API changes)
  - Provides actionable error messages

### 4. Manual Verification Procedures
- **4-step procedure:**
  1. Review PR title (verify `[BREAKING]` tag)
  2. Review migration guide (verify completeness)
  3. Check version bump (verify MAJOR increment)
  4. Verify CHANGELOG (verify breaking changes documented)
- **4 verification criteria**

### 5. OPA Policy Implementation
- **Full Rego code provided**
- **4 deny rules + 1 warn rule**
- **Heuristic-based detection** (pattern matching, file existence checks)

### 6. Test Cases
- **10 test cases specified:**
  1. Happy path (breaking change with complete documentation)
  2. Happy path (API breaking change with docs update)
  3. Happy path (database breaking change with migration guide)
  4. Violation (breaking change without `[BREAKING]` tag)
  5. Violation (breaking change without migration guide)
  6. Violation (breaking change without version bump)
  7. Violation (breaking change without CHANGELOG update)
  8. Warning (API breaking change without docs update)
  9. Override (with marker)
  10. Edge case (multiple breaking changes)

---

## Review Needed

### Question 1: Breaking Change Detection
**Context:** How should the automated script detect breaking changes?

**Options:**
- A) Pattern matching (search for removal patterns: `-`, `remove`, `delete`, `deprecated`)
- B) AST parsing (parse code, detect structural changes)
- C) Heuristic-based (check for common breaking change patterns)
- D) Combination: Pattern matching + heuristic checks

**Recommendation:** Option D - Combination approach. Use pattern matching for common breaking change patterns (removed endpoints, deleted fields, changed types) combined with heuristic checks (file deletions, major refactors). This balances accuracy with performance.

**Rationale:** Breaking changes can be detected through multiple signals:
- Code removal patterns (`-`, `remove`, `delete`)
- File deletions (removed endpoints, removed models)
- Type changes (changing field types, changing return types)
- Configuration changes (removed env vars, changed defaults)

Combination approach catches most breaking changes without requiring full AST parsing.

---

### Question 2: Migration Guide Location
**Context:** Should migration guides be required in `docs/migrations/` or can they be in PR description?

**Options:**
- A) Required in `docs/migrations/` directory (separate file)
- B) Can be in PR description (inline documentation)
- C) Can be in either location (flexible)
- D) Required in both (PR description + separate file)

**Recommendation:** Option A - Required in `docs/migrations/` directory. Migration guides are long-lived documentation that should be version-controlled and easily discoverable. PR descriptions are ephemeral and hard to find later.

**Rationale:** Migration guides are reference documentation that consumers need to find months or years later. Having them in a dedicated directory makes them:
- Easy to discover (`docs/migrations/`)
- Version-controlled (git history)
- Searchable (can grep for migration guides)
- Permanent (not lost when PR is merged)

PR description can link to migration guide, but guide itself must be in `docs/migrations/`.

---

### Question 3: Version Bump Detection
**Context:** How should the script detect version bumps?

**Options:**
- A) Check `package.json` for version change (MAJOR increment)
- B) Check multiple files (`package.json`, `version.txt`, etc.)
- C) Check git diff for version changes
- D) Combination: Check multiple sources, verify MAJOR increment

**Recommendation:** Option D - Combination approach. Check `package.json` (primary), also check other version files if they exist. Verify MAJOR increment (not just any increment). This ensures version bump is correct, not just present.

**Rationale:** Version bumps can be in multiple places:
- `package.json` (most common)
- `version.txt` (some projects)
- `VERSION` file (some projects)
- Git tags (for releases)

Script should check all common locations and verify MAJOR increment (e.g., 1.5.3 → 2.0.0, not 1.5.3 → 1.6.0).

---

### Question 4: CHANGELOG Format
**Context:** Should the script verify CHANGELOG format or just existence?

**Options:**
- A) Verify CHANGELOG exists and has breaking changes section
- B) Verify CHANGELOG format matches Keep a Changelog standard
- C) Verify CHANGELOG includes specific breaking change details
- D) Combination: Verify existence + format + content

**Recommendation:** Option A - Verify CHANGELOG exists and has breaking changes section. Format verification is too strict (different projects use different formats). Content verification (specific details) is too complex. Focus on ensuring breaking changes are documented, not perfect formatting.

**Rationale:** CHANGELOG formats vary:
- Keep a Changelog format
- Custom formats
- Simple bullet lists
- Detailed descriptions

What matters is that breaking changes are documented, not perfect formatting. Script should check for:
- CHANGELOG.md exists
- Breaking changes section exists (or "Breaking Changes" heading)
- Breaking change is mentioned

---

### Question 5: Consumer Notification
**Context:** Should R06 require consumer notification, or is that optional?

**Options:**
- A) Required for all breaking changes (mandatory notification)
- B) Required only for external API breaking changes
- C) Optional but recommended (SHOULD, not MUST)
- D) Not R06's responsibility (separate rule/process)

**Recommendation:** Option B - Required only for external API breaking changes. Internal breaking changes (within same codebase) don't need formal notification. External API breaking changes require notification to prevent production failures.

**Rationale:** Consumer notification is critical for external APIs but less critical for internal changes:
- **External APIs:** Consumers may not be aware of changes → notification required
- **Internal changes:** Teams can coordinate via PR reviews → notification optional
- **Database changes:** Usually internal → notification optional
- **Configuration changes:** Usually internal → notification optional

R06 should focus on documentation (migration guide, CHANGELOG), not communication (notifications). Notifications can be handled by separate process or rule.

---

## Estimated Implementation Time

| Task | Estimated Time |
|------|----------------|
| OPA Policy Implementation | 30 minutes |
| Automated Script Implementation | 45 minutes |
| Test Cases Implementation | 25 minutes |
| Documentation Updates | 15 minutes |
| **Total** | **2 hours** |

**Note:** Script is simpler than R05 because it focuses on:
- Pattern matching (breaking change detection)
- File existence checks (migration guide, CHANGELOG)
- Version comparison (MAJOR increment)
- Less complex than state machine parsing

---

## Files to Create/Modify

### To Create
1. `services/opa/policies/data-integrity.rego` — Update with R06 section (already exists, add R06)
2. `services/opa/tests/data_integrity_r06_test.rego` — Test cases
3. `.cursor/scripts/check-breaking-changes.py` — Automated check script
4. `docs/migrations/README.md` — Migration guide template and index (NEW)

### To Modify
1. `.cursor/rules/05-data.mdc` — Add Step 5 section for R06
2. `services/opa/policies/data-integrity.rego` — Add R06 violation patterns (already has placeholder)

---

## Key Characteristics of R06

### Scope
- **Breaking change detection:** Identify breaking changes (API, Database, Configuration, Behavioral)
- **PR flagging:** Verify `[BREAKING]` tag in PR title
- **Migration guide:** Verify migration guide exists and is complete
- **Version bump:** Verify MAJOR version increment
- **CHANGELOG:** Verify breaking changes documented
- **API docs:** Verify API documentation updated (if API changes)
- **Consumer notification:** Verify consumers notified (if external APIs)

### Tier 2 (OVERRIDE) vs Tier 1 (BLOCK)
- **Tier 1 (R01-R03):** BLOCK - Cannot proceed without fix
- **Tier 2 (R06):** OVERRIDE - Can proceed with justification
- **Rationale:** Breaking change documentation issues can be fixed in follow-up PRs, but should be flagged

### Different from R04-R05
- **R04:** Layer synchronization (schema ↔ DTO ↔ frontend)
- **R05:** State machine enforcement (documentation ↔ code ↔ validation)
- **R06:** Breaking change documentation (PR flagging, migration guides, version bumps)
- **Complexity:** Lower (pattern matching, file checks, version comparison)

---

## Verification Checklist

Before moving to R07, verify:

- [ ] Step 5 audit checklist is comprehensive (18 items)
- [ ] OPA policy patterns are correct (4 patterns + 1 warning)
- [ ] Automated script specification is clear
- [ ] Manual procedures are actionable (4-step process)
- [ ] Test cases cover all scenarios (10 tests)
- [ ] Review questions are answered
- [ ] Implementation time is reasonable (2 hours)
- [ ] Complements R04-R05 (different domain, same file)

---

## Next Steps

### Option A: Approve and Implement
1. Review draft procedures
2. Answer review questions
3. Approve for implementation
4. Implement OPA policy
5. Implement automated script
6. Add test cases
7. Update documentation
8. **Move to R07 (Error Handling)**

### Option B: Request Changes
1. Provide feedback on draft
2. Request specific changes
3. AI revises draft
4. Re-review
5. Approve or iterate

### Option C: Batch Review
1. Generate drafts for R07-R09 (related rules)
2. Review R06-R09 together
3. Implement as batch
4. More efficient for related rules

---

## Recommendation

**Proceed with Option A** - R06 is critical for breaking change compliance. After R06:
- **Breaking changes flagged** (PR title includes `[BREAKING]`)
- **Migration guides created** (consumers have migration path)
- **Version bumps enforced** (semantic versioning)
- **CHANGELOG updated** (breaking changes documented)
- **API docs updated** (if API changes)

**Answers to Review Questions:**
- Q1: Option D (Pattern matching + heuristic checks combination)
- Q2: Option A (Required in `docs/migrations/` directory)
- Q3: Option D (Check multiple sources, verify MAJOR increment)
- Q4: Option A (Verify existence + breaking changes section)
- Q5: Option B (Required only for external API breaking changes)

**Rationale:** R06 focuses on documentation and versioning, not communication. Breaking changes must be documented and versioned correctly. Consumer notification is important but can be handled separately for external APIs.

---

## Draft Location

**Full Draft:** `.cursor/rules/05-data-R06-DRAFT.md`

**Review Instructions:**
1. Read the full draft
2. Answer the 5 review questions
3. Approve or request changes
4. AI will implement approved procedures

---

## Breaking Change Types

Based on existing documentation, breaking changes include:

### API Changes
- Removing endpoints
- Changing request/response schemas
- Changing authentication requirements
- Changing error response formats
- Removing or renaming fields

### Database Changes
- Removing columns
- Changing column types
- Removing tables
- Changing constraints
- Breaking foreign key relationships

### Configuration Changes
- Removing environment variables
- Changing required configuration
- Changing default values (if relied upon)

### Behavioral Changes
- Changing business logic outcomes
- Changing validation rules (more restrictive)
- Changing default behaviors

**NOT Breaking Changes:**
- Adding new endpoints
- Adding optional fields
- Adding new fields to responses
- Adding new nullable columns
- Deprecating (but not removing) features
- Performance improvements
- Bug fixes (unless consumers rely on buggy behavior)

---

**Status:** AWAITING YOUR REVIEW  
**Prepared By:** AI Assistant  
**Date:** 2025-11-23  
**Estimated Review Time:** 15-20 minutes

---

## Progress Update (After R06 Draft)

### Task 5 Status

| Rule | Status | Time | Notes |
|------|--------|------|-------|
| ✅ R01: Tenant Isolation | COMPLETE | 2.25h | Tier 1 |
| ✅ R02: RLS Enforcement | COMPLETE | 2.25h | Tier 1 |
| ✅ R03: Architecture Boundaries | COMPLETE | 2.08h | Tier 1 |
| ✅ R04: Layer Synchronization | COMPLETE | 2.58h | Tier 2 |
| ✅ R05: State Machine Enforcement | COMPLETE | 3.08h | Tier 2 |
| ⏸️ R06: Breaking Change Documentation | DRAFT | 2h | Tier 2 |
| ⏸️ R07-R13 (Tier 2) | PENDING | 5h | Remaining Tier 2 |
| ⏸️ R14-R25 (Tier 3) | PENDING | 15h | Tier 3 |

**Progress:** 5/25 rules complete (20%), 1/25 in review (4%)  
**Time Spent:** 12.24 hours  
**Time Estimated (if R06 approved):** 14.24 hours  
**Remaining:** 19 rules, ~17.26 hours

**Tier 1:** 100% complete ✅  
**Tier 2:** 20% complete (2/10), 10% in review (1/10)

---

## Tier 2 Characteristics

**Tier 2 Rules (OVERRIDE):**
- Important but not blocking
- Can proceed with justification
- Flagged for review
- Fixable in follow-up PRs

**R06 Focus:**
- Breaking change flagging
- Migration guide creation
- Version bumping
- CHANGELOG updates
- API documentation updates

This provides strong foundation for breaking change compliance.





