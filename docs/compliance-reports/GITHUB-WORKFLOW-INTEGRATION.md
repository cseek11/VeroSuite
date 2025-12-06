# GitHub Workflow Integration: VeroField Rules 2.1 Compliance System

**Date:** 2025-12-05  
**Status:** Current Implementation  
**Purpose:** Document how the compliance system integrates with GitHub Actions workflows

---

## Executive Summary

The VeroField Rules 2.1 compliance system integrates with GitHub Actions through a dedicated workflow (`opa_compliance_check.yml`) that:

1. **Triggers automatically** on PR events (opened, synchronized, reopened)
2. **Evaluates all 25 rules** using OPA policies
3. **Posts results** as PR comments
4. **Blocks merges** for Tier 1 (BLOCK) violations
5. **Sends data** to compliance API (Phase 3 dashboard) when configured

---

## Workflow Architecture

### Primary Workflow: `opa_compliance_check.yml`

**Location:** `.github/workflows/opa_compliance_check.yml`

**Triggers:**
```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
    branches: [main, master, develop]
  push:
    branches: [main, master, develop]
```

**Key Features:**
- ✅ Automatic evaluation on PR events
- ✅ Full git history for diff analysis
- ✅ OPA policy evaluation (all 13 policies)
- ✅ PR comment integration
- ✅ Artifact upload for debugging
- ✅ API integration (Phase 3 dashboard)

---

## Workflow Execution Flow

### Step 1: Trigger & Setup

**When:** PR opened, updated, or pushed to main branches

**Actions:**
1. Checkout code with full history (`fetch-depth: 0`)
2. Download and install OPA CLI (v1.10.1)
3. Verify OPA installation

**Output:** OPA ready for evaluation

---

### Step 2: Changed Files Detection

**Purpose:** Identify which files changed in the PR

**Process:**
```bash
# Get base and head SHAs
BASE_SHA = PR base commit
HEAD_SHA = PR head commit

# Get changed files with diffs
git diff --name-only BASE_SHA HEAD_SHA
git diff BASE_SHA HEAD_SHA -- [file]  # Full diff per file
```

**Output:** `changed_files.json` with:
```json
{
  "changed_files": [
    {
      "path": "apps/api/src/users/users.service.ts",
      "diff": "...",
      "additions": 10,
      "deletions": 5
    }
  ]
}
```

---

### Step 3: Build OPA Input

**Purpose:** Combine changed files with PR metadata

**Process:**
```bash
# Merge changed files with PR context
jq --arg title "$PR_TITLE" \
   --arg body "$PR_BODY" \
   --argjson number "$PR_NUMBER" \
   --arg author "$AUTHOR" \
   '. + {
     "pr_title": $title,
     "pr_body": $body,
     "pr_number": $number,
     "author": $author
   }' changed_files.json > opa-input.json
```

**Output:** `opa-input.json` with:
```json
{
  "changed_files": [...],
  "pr_title": "Add user authentication",
  "pr_body": "Implements JWT auth...",
  "pr_number": 123,
  "author": "developer"
}
```

---

### Step 4: OPA Policy Evaluation

**Purpose:** Evaluate all compliance policies against changed files

**Command:**
```bash
opa eval \
  --data services/opa/policies/ \
  --data services/opa/data/ \
  --input opa-input.json \
  --format pretty \
  'data.compliance' > opa-results.json
```

**What Gets Evaluated:**
- **13 OPA Policy Files:**
  - `security.rego` (R01, R02, R12, R13)
  - `architecture.rego` (R03, R21, R22)
  - `data-integrity.rego` (R04, R05, R06)
  - `error-handling.rego` (R07)
  - `observability.rego` (R08, R09)
  - `quality.rego` (R10)
  - `backend.rego` (R11)
  - `tech-debt.rego` (R14, R15)
  - `quality.rego` (R16, R17, R18)
  - `ux-consistency.rego` (R19, R20)
  - `documentation.rego` (R23)
  - `frontend.rego` (R24)
  - `operations.rego` (R25)

**Output:** `opa-results.json` with violations:
```json
{
  "deny": [
    "HARD STOP [Security]: Database query missing tenant_id filter"
  ],
  "override": [
    "OVERRIDE REQUIRED [Data]: Schema change without migration guide"
  ],
  "warn": [
    "WARNING [Naming]: Component name doesn't match file name"
  ]
}
```

---

### Step 5: Parse Results

**Purpose:** Extract violation counts and messages

**Process:**
```bash
# Count violations by severity
DENY_COUNT=$(jq '[.. | .deny? | select(. != null)] | flatten | length' opa-results.json)
OVERRIDE_COUNT=$(jq '[.. | .override? | select(. != null)] | flatten | length' opa-results.json)
WARN_COUNT=$(jq '[.. | .warn? | select(. != null)] | flatten | length' opa-results.json)

# Extract messages
jq -r '[.. | .deny? | select(. != null)] | flatten | .[]' opa-results.json > deny_messages.txt
jq -r '[.. | .override? | select(. != null)] | flatten | .[]' opa-results.json > override_messages.txt
jq -r '[.. | .warn? | select(. != null)] | flatten | .[]' opa-results.json > warn_messages.txt
```

**Output:**
- `deny_count`, `override_count`, `warn_count` (GitHub outputs)
- `deny_messages.txt`, `override_messages.txt`, `warn_messages.txt`

---

### Step 6: Generate Compliance Report

**Purpose:** Create human-readable markdown report

**Content:**
```markdown
## 📋 OPA Compliance Check Report

**Status:** ✅ PASSED / ❌ FAILED

### Violations Summary
- 🚫 **HARD STOP:** 2
- ⚠️  **OVERRIDE REQUIRED:** 1
- 💡 **WARNINGS:** 5

### 🚫 HARD STOP Violations
These violations MUST be fixed before merge:
- HARD STOP [Security]: Database query missing tenant_id filter
- HARD STOP [Architecture]: Cross-service relative import detected

### ⚠️ OVERRIDE REQUIRED
These require explicit override justification:
- OVERRIDE REQUIRED [Data]: Schema change without migration guide

### 💡 Warnings
These are logged but don't block merge:
- WARNING [Naming]: Component name doesn't match file name
...
```

**Output:** `compliance-report.md`

---

### Step 7: Post PR Comment

**Purpose:** Update PR with compliance results

**Process:**
1. Find existing bot comment (if any)
2. Update existing comment OR create new comment
3. Post markdown report to PR

**Result:** PR comment with compliance status visible to reviewers

---

### Step 8: Upload Artifacts

**Purpose:** Store results for debugging/analysis

**Artifacts Uploaded:**
- `opa-input.json` - Input to OPA
- `opa-results.json` - Raw OPA results
- `compliance-report.md` - Human-readable report

**Retention:** 30 days

---

### Step 9: Enforce Violations

**Purpose:** Block merges for critical violations

**Process:**

#### HARD STOP (Tier 1) Violations:
```bash
if [ "$DENY_COUNT" -gt 0 ]; then
  echo "❌ HARD STOP: $DENY_COUNT violations found"
  exit 1  # FAILS WORKFLOW - BLOCKS MERGE
fi
```

**Result:** Workflow fails → PR cannot merge

#### OVERRIDE REQUIRED (Tier 2) Violations:
```bash
if [ "$OVERRIDE_COUNT" -gt 0 ]; then
  echo "⚠️ OVERRIDE REQUIRED: $OVERRIDE_COUNT violations found"
  echo "Add override justification to PR description to proceed."
  exit 0  # WARNING ONLY - DOESN'T BLOCK
fi
```

**Result:** Workflow passes but violation logged → Requires override justification

#### WARNINGS (Tier 3):
```bash
# Logged but don't block
echo "💡 $WARN_COUNT warnings logged (non-blocking)"
```

**Result:** Workflow passes → Warnings visible in PR comment

---

### Step 10: Send to Compliance API (Phase 3)

**Purpose:** Store results in compliance database for dashboard

**Condition:** Only if `COMPLIANCE_API_TOKEN` is configured

**Process:**
```bash
# For each DENY violation
curl -X POST "$API_URL/compliance/checks" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pr_number": 123,
    "commit_sha": "abc123",
    "rule_id": "R01",
    "status": "VIOLATION",
    "severity": "BLOCK",
    "violation_message": "..."
  }'
```

**Result:** Violations stored in compliance database → Dashboard can display

**Note:** Currently optional (Phase 3 not fully deployed)

---

## Integration with Other Workflows

### Relationship to Reward Score Workflow

**Workflow:** `swarm_compute_reward_score.yml`

**Integration:**
- Reward Score workflow runs **after** OPA compliance check
- Uses compliance results to adjust reward score
- BLOCK violations reduce reward score significantly

**Flow:**
```
PR Created
  ↓
OPA Compliance Check (opa_compliance_check.yml)
  ↓
Reward Score Computation (swarm_compute_reward_score.yml)
  ↓
Pattern Extraction / Anti-Pattern Logging (if score thresholds met)
```

---

### Relationship to Pattern Extraction

**Workflow:** `swarm_suggest_patterns.yml`

**Trigger:** High reward score (≥6) from PR

**Integration:**
- OPA compliance violations reduce reward score
- Lower reward score = less likely to trigger pattern extraction
- Clean PRs (no violations) = higher reward score = pattern extraction eligible

---

### Relationship to Anti-Pattern Logging

**Workflow:** `swarm_log_anti_patterns.yml`

**Trigger:** Low reward score (≤0) from PR

**Integration:**
- OPA compliance violations contribute to low reward score
- Low reward score = triggers anti-pattern logging
- Violations logged in `.cursor/anti_patterns.md`

---

## Enforcement Levels

### Tier 1 MAD (BLOCK) - 3 Rules

**Rules:** R01 (Tenant Isolation), R02 (RLS Enforcement), R03 (Architecture Boundaries)

**Enforcement:**
- ❌ **Workflow FAILS** if any DENY violations
- 🚫 **PR CANNOT MERGE** until violations fixed
- 🔴 **Status:** Red X in GitHub

**Example:**
```yaml
# If R01 violation detected:
deny = ["HARD STOP [Security]: Database query missing tenant_id filter"]
# Result: exit 1 → Workflow fails → PR blocked
```

---

### Tier 2 MAD (OVERRIDE) - 10 Rules

**Rules:** R04-R13 (Layer Sync, State Machines, Error Handling, etc.)

**Enforcement:**
- ⚠️ **Workflow PASSES** but violation logged
- ✅ **PR CAN MERGE** if override justification provided
- 🟡 **Status:** Yellow warning in GitHub

**Example:**
```yaml
# If R04 violation detected:
override = ["OVERRIDE REQUIRED [Data]: Schema change without migration guide"]
# Result: exit 0 → Workflow passes → PR can merge with justification
```

**Override Process:**
1. Developer adds override justification to PR description
2. Reviewer approves override
3. PR can merge

---

### Tier 3 MAD (WARNING) - 12 Rules

**Rules:** R14-R25 (Tech Debt, Testing, UX, Naming, etc.)

**Enforcement:**
- 💡 **Workflow PASSES** always
- ✅ **PR CAN MERGE** without action
- 🔵 **Status:** Blue info in GitHub

**Example:**
```yaml
# If R23 violation detected:
warn = ["WARNING [Naming]: Component name doesn't match file name"]
# Result: exit 0 → Workflow passes → PR can merge (warning logged)
```

---

## Performance Characteristics

### OPA Evaluation Time

**Target:** <2 seconds total  
**Hard Limit:** <5 seconds total  
**Per Policy:** <200ms

**Current Performance:**
- 13 policies evaluated in parallel
- Average evaluation time: ~1.5 seconds
- Within performance budgets ✅

### Workflow Total Time

**Current:** ~3-5 minutes (including setup, evaluation, reporting)  
**Breakdown:**
- Setup: ~30 seconds
- Changed files detection: ~10 seconds
- OPA evaluation: ~1.5 seconds
- Report generation: ~5 seconds
- PR comment: ~10 seconds
- API integration: ~5 seconds (if configured)

---

## Configuration

### Required Secrets

**None** - Workflow runs without secrets (API integration optional)

### Optional Secrets

**For Phase 3 Dashboard Integration:**
- `COMPLIANCE_API_URL` - API endpoint (default: `http://localhost:3001/api/v1`)
- `COMPLIANCE_API_TOKEN` - Authentication token

**Setup:**
```bash
# In GitHub repository settings → Secrets
COMPLIANCE_API_URL=https://api.example.com/api/v1
COMPLIANCE_API_TOKEN=your-token-here
```

---

## Troubleshooting

### Workflow Not Triggering

**Check:**
1. PR is targeting `main`, `master`, or `develop` branch
2. PR event is `opened`, `synchronize`, or `reopened`
3. Workflow file exists at `.github/workflows/opa_compliance_check.yml`

### OPA Evaluation Failing

**Check:**
1. OPA policies exist in `services/opa/policies/`
2. OPA data exists in `services/opa/data/`
3. Input JSON is valid (check `opa-input.json` artifact)

### Violations Not Showing

**Check:**
1. OPA results JSON is valid (check `opa-results.json` artifact)
2. Violation messages are in correct format
3. PR comment was posted (check PR comments)

### API Integration Not Working

**Check:**
1. `COMPLIANCE_API_TOKEN` secret is configured
2. API endpoint is accessible from GitHub Actions
3. API accepts POST requests to `/compliance/checks`

---

## Future Enhancements (Phase 3)

### Planned Improvements

1. **Parallel Policy Evaluation**
   - Evaluate policies in parallel (matrix strategy)
   - Reduce total evaluation time

2. **Caching**
   - Cache OPA evaluation results for unchanged files
   - Skip evaluation if no relevant files changed

3. **Incremental Evaluation**
   - Only evaluate policies relevant to changed files
   - Skip policies for unchanged domains

4. **Real-Time Dashboard Updates**
   - Webhook integration for instant dashboard updates
   - No polling required

5. **Advanced Reporting**
   - Trend analysis in PR comments
   - Historical comparison
   - Remediation suggestions

---

## Summary

**Current State:**
- ✅ OPA compliance check workflow fully operational
- ✅ All 25 rules evaluated automatically
- ✅ PR comments posted with results
- ✅ Tier 1 violations block merges
- ✅ Tier 2/3 violations logged but don't block
- ⏸️ Phase 3 dashboard integration optional (not required)

**Integration Points:**
1. **PR Events** → Triggers workflow
2. **OPA Policies** → Evaluates compliance
3. **PR Comments** → Reports results
4. **Workflow Status** → Enforces blocking
5. **Compliance API** → Stores for dashboard (optional)

**Enforcement:**
- **Tier 1 (BLOCK):** Workflow fails → PR blocked
- **Tier 2 (OVERRIDE):** Workflow passes → Requires justification
- **Tier 3 (WARNING):** Workflow passes → Logged only

---

**Last Updated:** 2025-12-05  
**Status:** ✅ **FULLY OPERATIONAL**



