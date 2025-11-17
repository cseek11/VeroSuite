# Automated PR Creation Strategy

**Date:** 2025-11-17  
**Question:** How to automate PR creation while maintaining accuracy and avoiding workflow disruption?

---

## Problem Statement

**Goal:** Automate PR creation to ensure accurate REWARD_SCORE tracking  
**Constraint:** Per-file PRs create too many PRs and workflow disruption  
**Challenge:** Find the right balance between accuracy and practicality

---

## Analysis of Options

### Option 1: Per-File PRs ❌ (Not Recommended)

**How it works:**
- Create PR after every file save
- One PR per file

**Pros:**
- Maximum accuracy (each file scored individually)
- Fair attribution

**Cons:**
- Too many PRs (creates noise)
- CI overhead (every file = CI run)
- Review overhead (too many PRs to review)
- Loses context (files are part of features)
- Workflow disruption

**Verdict:** ❌ Not practical

---

### Option 2: Per-Commit PRs ⚠️ (Not Recommended)

**How it works:**
- Create PR after every commit
- One PR per commit

**Pros:**
- More granular than feature-based
- Natural workflow (developers commit frequently)

**Cons:**
- Still too many PRs (commits can be frequent)
- Commits can be too small (typo fixes, etc.)
- Loses feature context
- Review overhead

**Verdict:** ⚠️ Better than per-file, but still too granular

---

### Option 3: Feature/Branch-Based ✅ (Recommended)

**How it works:**
- Create PR when feature branch is ready
- One PR per feature/branch
- Triggered by branch push or explicit command

**Pros:**
- Natural workflow (features are logical units)
- Good context (complete features)
- Reasonable PR count
- Aligns with code review process

**Cons:**
- Less granular than per-file
- Features can span many files

**Verdict:** ✅ Good balance, but still manual trigger

---

### Option 4: Smart Batching (Time-Based) ✅ (Recommended)

**How it works:**
- Batch changes over time period (e.g., 1 hour, 4 hours, 1 day)
- Create PR when batch period ends
- Include all changes in that period

**Pros:**
- Automatic (no manual trigger needed)
- Reasonable PR count
- Good for continuous work
- Can adjust batch period

**Cons:**
- Less granular than per-file
- Time-based batching may not align with logical features

**Verdict:** ✅ Good for continuous development

---

### Option 5: Smart Batching (Change Threshold) ✅ (Recommended)

**How it works:**
- Batch changes until threshold reached
- Thresholds: file count, line count, test files added, etc.
- Create PR when threshold met

**Pros:**
- Automatic (no manual trigger needed)
- Logical batching (based on change size)
- Reasonable PR count
- Can adjust thresholds

**Cons:**
- Less granular than per-file
- May batch unrelated changes

**Verdict:** ✅ Good for logical batching

---

### Option 6: Hybrid Approach ✅✅ (BEST - Recommended)

**How it works:**
- Combine multiple triggers:
  - Time-based: Create PR after X hours of inactivity
  - Change threshold: Create PR when N files changed
  - Logical grouping: Group related files (same directory, same feature)
  - Manual override: Allow explicit PR creation

**Pros:**
- Automatic when appropriate
- Logical batching
- Flexible (multiple triggers)
- Can still create PRs manually
- Best of all approaches

**Cons:**
- More complex to implement
- Requires configuration

**Verdict:** ✅✅ **BEST OPTION** - Most flexible and practical

---

## Recommended Solution: Hybrid Smart Batching

### Implementation Strategy

**Trigger Conditions (any of these can trigger PR creation):**

1. **Time-Based:**
   - Create PR after 4 hours of inactivity
   - Or after 1 day of work (whichever comes first)

2. **Change Threshold:**
   - Create PR when 5+ files changed
   - Or when 200+ lines changed
   - Or when test files added

3. **Logical Grouping:**
   - Group files by directory (same feature area)
   - Group files by type (all tests together, all docs together)
   - Group files by related changes (files that import each other)

4. **Manual Override:**
   - Allow explicit PR creation command
   - Allow "create PR now" trigger

5. **Feature Detection:**
   - Detect when feature is "complete" (tests added, docs updated)
   - Create PR when feature appears ready

### Configuration

```yaml
# .cursor/config/auto_pr_config.yaml
triggers:
  time_based:
    enabled: true
    inactivity_hours: 4
    max_work_hours: 8
  
  change_threshold:
    enabled: true
    min_files: 5
    min_lines: 200
    require_test_file: false
  
  logical_grouping:
    enabled: true
    group_by_directory: true
    group_by_file_type: true
    max_group_size: 10
  
  feature_detection:
    enabled: true
    require_tests: false
    require_docs: false
  
  manual_override:
    enabled: true
    command: "python .cursor/scripts/create_pr.py --auto"
```

---

## Implementation Plan

### Phase 1: Basic Auto-PR Creation

**Features:**
- Monitor file changes in working directory
- Batch changes over time period
- Create PR when threshold met
- Use existing `create_pr.py` script

**Timeline:** 1-2 days

### Phase 2: Smart Batching

**Features:**
- Logical file grouping
- Change threshold detection
- Feature detection
- Configuration file

**Timeline:** 2-3 days

### Phase 3: Integration

**Features:**
- Integrate with REWARD_SCORE system
- Dashboard updates
- Metrics tracking
- Documentation

**Timeline:** 1 day

---

## Recommended Default Configuration

**For Continuous Development:**
- Time-based: 4 hours of inactivity OR 8 hours of work
- Change threshold: 5 files OR 200 lines
- Logical grouping: Enabled (by directory)
- Manual override: Enabled

**For Feature Development:**
- Time-based: 1 day of work
- Change threshold: 3 files OR 100 lines
- Feature detection: Enabled (require tests)
- Manual override: Enabled

---

## Example Workflow

### Scenario: Developer Working on Feature

```
Developer starts working
    ↓
File 1 saved → Tracked (no PR yet)
File 2 saved → Tracked (no PR yet)
File 3 saved → Tracked (no PR yet)
    ↓
4 hours pass OR 5 files changed
    ↓
Auto-PR Creation Triggered
    ↓
PR Created: "Auto-PR: Feature X (3 files, 150 lines)"
    ↓
REWARD_SCORE Automation Runs
    ↓
File-level scores computed
    ↓
PR Comment Posted
    ↓
Metrics Collected
```

---

## Benefits of Hybrid Approach

1. **Automatic:** No manual PR creation needed
2. **Logical:** Batches related changes together
3. **Flexible:** Multiple trigger options
4. **Practical:** Reasonable PR count
5. **Accurate:** File-level scoring still works
6. **Configurable:** Can adjust thresholds

---

## Recommendation

**Implement Hybrid Smart Batching with these defaults:**

- **Time-based:** 4 hours of inactivity
- **Change threshold:** 5 files OR 200 lines
- **Logical grouping:** Enabled
- **Manual override:** Enabled
- **Feature detection:** Optional

This gives you:
- ✅ Automatic PR creation (no manual work)
- ✅ Reasonable PR count (not too many)
- ✅ Logical batching (related changes together)
- ✅ File-level scoring (accurate attribution)
- ✅ Flexibility (can adjust or override)

---

**Would you like me to implement this hybrid approach?**

