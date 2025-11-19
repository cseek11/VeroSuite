# Cursor Rules Upgrade

## 1. Overview
This document complements `.cursor/rules.md`, capturing diagrams, rollout phases, changelog, and ownership expectations.

### Version & Changelog
- **2025-11-17:** Initial rollout (version 1.0). Future updates must append entries here and in `.cursor/rules.md`.

### Rules Champions
- Primary: TBA
- Backup: TBA

## 2. ASCII Diagrams

### 2.1 Agent Routing (Additive, Multi-Load)
```
Developer Request / PR
        │
        ▼
  Cursor Triager
  ┌─────────────────────────────────────────────┐
  │ 1) Always load patterns + security + tester │
  │ 2) Add domain prompts based on file paths   │
  │    - backend -> distill_backend             │
  │    - frontend -> distill_frontend           │
  │    - infra -> distill_infra                 │
  │    - data -> distill_data                   │
  └─────────────────────────────────────────────┘
        │
        ▼
Composed Output = sum of all active prompt roles
```
**Description:** Routing is additive, preventing loss of cross-cutting concerns like security and testing.

### 2.2 Full CI Pipeline
```
Dev Push → Open PR
        │
        ▼
CI: checkout → tests → static analysis → coverage
        │
        ▼
run compute_reward_score.py → reward.json + PR comment
        │
        ├─ score ≥ 6 → extract_patterns.py → suggestion PR
        ├─ score ≤ 0 → anti_patterns.md + BUG_LOG.md entries
        └─ score anywhere → Cursor reads comment for reviews
        │
        ▼
Human @lead confirms/overrides → merge → reindex_embeddings.py (optional)
```
**Description:** CI remains the source of truth for REWARD_SCORE and triggers follow-up automation.

### 2.3 Knowledge Graph Loop
```
              ┌───────────────┐
              │   PR Diffs    │
              └──────┬────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
   High score (≥6)           Low score (≤0)
        │                         │
        ▼                         ▼
Candidate patterns        Anti-pattern + BUG_LOG
        │
        ▼
Human review → merge into .cursor/patterns/*
        │
        ▼
Reindex + semantic search availability → informs next PR
```
**Description:** Self-reinforcing loop with human checkpoints.

### 2.4 PR Lifecycle with Feedback Closure
```
1. Dev opens PR
2. Local Cursor assist (distill prompts + tester)
3. CI runs + posts REWARD_SCORE
4. Cursor/@lead review referencing CI
   - High → suggest patterns
   - Low → log anti-patterns, require fixes
5. Human lead approves / overrides
6. Merge + update patterns/anti-patterns + reindex
```
**Description:** Ensures CI metrics feed both automation and human review, closing the loop.

## 3. Implementation Checklist

### Phase 0 — Validation (Week 0–1)
- [x] Add `.cursor/rules.md` with precedence & namespaces.
- [x] Create base prompts (`lead_review`, `tester`, `coach`, `distill_*`, `security_review`).
- [x] Seed metadata files (`reward_rubric.yaml`, `golden_patterns.md`, `anti_patterns.md`, `BUG_LOG.md`, `DEPRECATED_RULES.md`).
- [x] Add initial CI scripts and templates.

### Phase 1 — Core (Week 2–4)
- [ ] Appoint two Rules Champions and document them above.
- [ ] Enable reward-score GitHub Action on a pilot repo.
- [ ] Run weekly pattern review cadence; log decisions.
- [ ] Begin reconciliation of top-priority legacy rule files (security, enforcement, core).

### Phase 2 — Expand & Automate (Week 5–10)
- [ ] Enable pattern suggestion workflow for all repos with Guard rails (manual PR).
- [ ] Add anti-pattern automation for low scores (requires human approval).
- [ ] Hook reindex job to `.cursor/patterns/**` pushes.
- [ ] Build dashboard (REWARD_SCORE distribution, human edit rate).

### Phase 3 — Optimize (Week 11+)
- [ ] Explore partial automation for pattern extraction with human sign-off.
- [ ] Expand to additional repos / mobile targets.
- [ ] Iterate rubric weights based on metrics.
- [ ] Graduate reconciliation checklist to “completed” and archive deprecated files.

## 4. Testing Harness & Verification
- **Prompt Load Smoke Test:** Run `cursor` with mock diffs to ensure correct prompts activated.
- **CI Dry Run:** Execute GitHub workflow in a sandbox PR to verify reward comment generation.
- **Conflict Scan:** Script in CI compares unified rules vs legacy references, failing if blocking keywords remain.
- **Semantic Search QA:** Validate `.cursor/patterns/*` appears in search results; run `reindex_embeddings.py` if not.

## 5. Rollback & Emergency Override
- Overrides must cite `@emergency_override:<rule-id>:<expires>` in PR descriptions and be logged here.
- To rollback rules, revert the specific commit touching `.cursor/rules.md` plus associated prompt/script changes.
- Ensure `DEPRECATED_RULES.md` is updated when reverting to avoid stale reconciliation state.

## 6. Legacy Reconciliation Process
1. Record each legacy file in `DEPRECATED_RULES.md` with status.
2. Evaluate overlap/conflicts with unified rules.
3. Options per file:
   - **Migrate:** Pull relevant content into unified doc/prompt/pattern.
   - **Amend:** Update legacy file to explicitly defer to unified rules.
   - **Deprecate:** Mark as superseded once content absorbed.
4. Update the table with owner, PR link, and timeline.
5. CI conflict checker uses this table to know when to stop alerting.

## 7. Open Items
- Assign Rules Champions.
- Fill out starter pattern files (5 recommended).
- Configure CI workflows (`compute reward`, `suggest patterns`, `reindex`).
- Establish meeting cadence for reviewing metrics and overrides.





