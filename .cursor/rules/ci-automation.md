---
# Cursor Rule Metadata
version: 1.0
project: VeroField
scope:
  - ci
  - workflows
  - automation
priority: critical
last_updated: 2025-11-17
always_apply: true
---

# PRIORITY: CRITICAL - CI Automation Workflow Requirements

## Overview

This rule file establishes comprehensive requirements for GitHub Actions workflow configuration, trigger validation, artifact naming, and workflow chain dependencies. It ensures CI automation workflows are properly configured and triggered.

**⚠️ MANDATORY:** All workflows MUST comply with these rules. No exceptions.

---

## PRIORITY: CRITICAL - Workflow Trigger Configuration

### Trigger Requirements

**MANDATORY:** All workflows must have an `on:` section with appropriate triggers.

#### Pull Request Workflows

**MANDATORY:** PR workflows must include:
```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
```

**Rationale:**
- `opened` - Triggers on new PRs
- `synchronize` - Triggers on new commits to PR
- `reopened` - Triggers when PR is reopened

**Example:**
```yaml
name: Validate Documentation

on:
  pull_request:
    types: [opened, synchronize, reopened]
```

#### Cascading Workflows (workflow_run)

**MANDATORY:** `workflow_run` triggers must:
1. Match exact workflow names (case-sensitive)
2. Reference workflows that exist in `.github/workflows/`
3. Use appropriate `types: [completed]`

**Format:**
```yaml
on:
  workflow_run:
    workflows: ["Exact Workflow Name"]
    types: [completed]
```

**Validation Rules:**
- Workflow name in `workflows:` array must exactly match the `name:` field of the target workflow
- Workflow file must exist in `.github/workflows/`
- Workflow name is case-sensitive

**Example:**
```yaml
name: Swarm - Suggest Patterns

on:
  workflow_run:
    workflows: ["Swarm - Compute Reward Score"]
    types: [completed]
```

#### Scheduled Workflows

**MANDATORY:** Scheduled workflows must use cron format:
```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC
```

**Best Practices:**
- Use UTC timezone
- Document schedule in comments
- Consider timezone impact on team

#### Manual Workflows (workflow_dispatch)

**MANDATORY:** Manual workflows must include:
```yaml
on:
  workflow_dispatch:
```

**Optional:** Add input parameters:
```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        type: choice
        options:
          - staging
          - production
```

---

## PRIORITY: CRITICAL - Artifact Naming Standards

### Standard Artifact Names

**MANDATORY:** Artifact names must be consistent across workflows.

**Standard Artifacts:**
- `reward` - REWARD_SCORE JSON output
- `frontend-coverage` - Frontend test coverage data
- `backend-coverage` - Backend test coverage data
- `pattern-suggestions` - Pattern extraction results
- `anti-pattern-detection` - Anti-pattern detection results
- `metrics-data` - Metrics dashboard data

### Artifact Naming Rules

**MANDATORY:**
1. Artifact names must match exactly between upload and download steps
2. Use kebab-case (lowercase with hyphens)
3. Use descriptive names that indicate content
4. Document artifact names in workflow comments

**Upload Pattern:**
```yaml
- name: Upload reward artifact
  uses: actions/upload-artifact@v4
  with:
    name: reward
    path: reward.json
```

**Download Pattern:**
```yaml
- name: Download reward artifact
  uses: actions/download-artifact@v4
  with:
    name: reward
    path: .
```

**Validation:**
- Artifact name in `upload-artifact` must match `download-artifact`
- Artifact name must be documented in workflow comments
- Artifact name must follow kebab-case convention

---

## PRIORITY: CRITICAL - Workflow Chain Validation

### Workflow Dependencies

**MANDATORY:** Cascading workflows must:
1. Verify parent workflow completed successfully
2. Implement conditional logic for score thresholds
3. Handle missing artifacts gracefully

#### Conditional Execution

**MANDATORY:** Workflows triggered by `workflow_run` must check:
- Parent workflow status
- Artifact availability
- Score thresholds (if applicable)

**Example Pattern:**
```yaml
jobs:
  suggest-patterns:
    runs-on: ubuntu-latest
    if: github.event.workflow_run.conclusion == 'success'
    steps:
      - name: Download reward artifact
        uses: actions/download-artifact@v4
        with:
          name: reward
          path: .
      
      - name: Check if artifact exists
        id: check-artifact
        run: |
          if [ ! -f reward.json ]; then
            echo "Artifact not found, skipping"
            exit 0
          fi
      
      - name: Check score threshold
        id: check-score
        run: |
          SCORE=$(jq -r '.score' reward.json)
          if [ "$SCORE" -lt 6 ]; then
            echo "Score $SCORE below threshold 6, skipping"
            exit 0
          fi
```

#### Error Handling

**MANDATORY:** Workflows must handle:
- Missing artifacts (graceful exit, not failure)
- Invalid artifact format (clear error messages)
- Workflow run failures (conditional execution)

**Pattern:**
```yaml
- name: Download artifact
  uses: actions/download-artifact@v4
  with:
    name: reward
    continue-on-error: true

- name: Verify artifact
  run: |
    if [ ! -f reward.json ]; then
      echo "::warning::Artifact not found, skipping workflow"
      exit 0
    fi
```

---

## PRIORITY: HIGH - Workflow Validation

### Validation Requirements

**MANDATORY:** Before merging workflow changes:
1. Run `.cursor/scripts/validate_workflow_triggers.py`
2. Verify all `workflow_run` references exist
3. Verify artifact names match between workflows
4. Verify trigger types are appropriate

### Validation Script

**Location:** `.cursor/scripts/validate_workflow_triggers.py`

**Checks:**
- All workflows have `on:` sections
- `workflow_run` workflows exist in `.github/workflows/`
- Artifact names match between upload/download
- Trigger types are appropriate
- Workflow names match exactly (case-sensitive)

**Usage:**
```bash
python .cursor/scripts/validate_workflow_triggers.py
```

---

## PRIORITY: MEDIUM - Best Practices

### Workflow Organization

- Keep workflows focused (single responsibility)
- Use descriptive workflow names
- Document workflow purpose in comments
- Group related workflows together

### Performance

- Use conditional execution to skip unnecessary steps
- Cache dependencies when possible
- Use matrix builds for parallel execution
- Optimize artifact sizes

### Security

- Never commit secrets to workflows
- Use GitHub Secrets for sensitive data
- Validate inputs in workflow_dispatch
- Use least-privilege permissions

---

## References

- `.cursor/rules/enforcement.md` - Enforcement checklist
- `.cursor/rules.md` - CI Integration section
- `docs/planning/WORKFLOW_TRIGGER_COMPLIANCE_AUDIT.md` - Audit document
- `.cursor/scripts/validate_workflow_triggers.py` - Validation script

---

## Compliance Checklist

When creating or modifying workflows:

- [ ] Workflow has `on:` section with appropriate triggers
- [ ] PR workflows include `types: [opened, synchronize, reopened]`
- [ ] `workflow_run` workflows reference existing workflows (exact name match)
- [ ] Artifact names match between upload/download steps
- [ ] Artifact names follow kebab-case convention
- [ ] Conditional execution implemented for score thresholds
- [ ] Error handling for missing artifacts
- [ ] Validation script passes
- [ ] Workflow name matches file name pattern

---

**Last Updated:** 2025-11-17


