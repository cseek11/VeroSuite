# REWARD_SCORE Granularity Analysis

**Date:** 2025-11-17  
**Question:** Should we automate PR creation after every file to ensure accuracy and fair rewards?

---

## Current System (PR-Based)

**How it works:**
- One PR = One REWARD_SCORE
- PRs can contain multiple files
- Scoring happens at PR level
- Metrics aggregated per PR

**Example:**
- PR #123 contains 5 files
- Gets one score: +6/10
- All 5 files share the same score

---

## Proposed System (File-Based)

**How it would work:**
- One file = One PR = One REWARD_SCORE
- Each file gets its own score
- Automated PR creation after each file save
- More granular tracking

**Example:**
- File 1: PR #123 → Score +3/10
- File 2: PR #124 → Score +2/10
- File 3: PR #125 → Score +1/10
- File 4: PR #126 → Score +0/10
- File 5: PR #127 → Score -1/10
- **Total:** +5/10 (more accurate breakdown)

---

## Trade-Off Analysis

### ✅ Pros of File-Based Scoring

1. **More Accurate Attribution**
   - Can see exactly which files contributed what score
   - Better performance tracking per file
   - Identifies problem files more easily

2. **Fairer Rewards**
   - Each file gets its own score
   - High-quality files aren't dragged down by low-quality ones
   - Low-quality files don't get credit from high-quality ones

3. **Better Granularity**
   - Can identify which file types are problematic
   - Can track improvements per file over time
   - More detailed metrics for analysis

4. **Better Learning**
   - Can see which patterns work for which file types
   - Can identify anti-patterns at file level
   - More precise pattern extraction

### ❌ Cons of File-Based PRs

1. **Too Many PRs**
   - Creates noise in PR list
   - Harder to review
   - Overwhelming for developers

2. **CI Resource Overhead**
   - Every file = CI run
   - More compute costs
   - Slower feedback loops

3. **Review Overhead**
   - Too many PRs to review
   - Loses context (files are part of features)
   - Reviewers can't see the big picture

4. **Workflow Disruption**
   - Developers work on features, not individual files
   - Breaks natural workflow
   - Harder to understand feature completeness

5. **Context Loss**
   - Files are often interdependent
   - Can't evaluate feature as a whole
   - Missing architectural context

---

## Recommended Hybrid Approach

**Best of Both Worlds:**

### Option 1: File-Level Scoring Within PRs (Recommended)

**How it works:**
- Keep PR-based workflow (practical)
- Score each file within the PR
- Aggregate file scores into PR score
- Store file-level metrics for analysis

**Implementation:**
1. Compute score for each file in PR
2. Aggregate into PR-level score
3. Store file-level breakdown in metrics
4. Dashboard shows both PR and file-level views

**Benefits:**
- ✅ Accuracy: File-level tracking
- ✅ Fairness: Individual file contributions visible
- ✅ Practicality: Still use PR-based workflow
- ✅ Better metrics: Can analyze which files/types contribute most
- ✅ No workflow disruption

**Example:**
```
PR #123 (Total Score: +6/10)
├── File 1: +3/10 (tests, docs)
├── File 2: +2/10 (tests)
├── File 3: +1/10 (docs)
├── File 4: +0/10 (no contributions)
└── File 5: +0/10 (no contributions)
```

### Option 2: Commit-Level Scoring

**How it works:**
- Score at commit level (not PR level)
- Commits are more granular than PRs
- Still practical workflow
- Better than file-level but less granular

**Benefits:**
- More granular than PRs
- Less overhead than file-level
- Natural workflow (developers commit frequently)

**Drawbacks:**
- Commits can be too granular (typo fixes, etc.)
- Still loses some context

### Option 3: Feature/Branch-Level Scoring

**How it works:**
- Score at feature branch level
- One score per feature branch
- More context than file-level
- Less granular than file-level

**Benefits:**
- Better context (complete features)
- Less overhead than file-level
- Natural workflow

**Drawbacks:**
- Less granular than file-level
- Features can span many files

---

## Recommendation

**Implement Option 1: File-Level Scoring Within PRs**

### Why This Is Best:

1. **Accuracy & Fairness**
   - Each file gets its own score
   - Can see exact contributions
   - Fair attribution

2. **Practicality**
   - No workflow disruption
   - Still use PR-based workflow
   - Reviewers see complete features

3. **Better Metrics**
   - Can analyze file-level patterns
   - Identify problem file types
   - Track improvements per file

4. **Flexibility**
   - Dashboard can show PR-level or file-level
   - Can aggregate in different ways
   - Supports both views

### Implementation Plan:

1. **Enhance `compute_reward_score.py`:**
   - Add file-level scoring function
   - Score each file in PR diff
   - Aggregate into PR score
   - Store file-level breakdown

2. **Update Metrics Collection:**
   - Store file-level scores in metrics
   - Add file-level aggregates
   - Track file type performance

3. **Enhance Dashboard:**
   - Add file-level view
   - Show file contributions per PR
   - File type performance charts

4. **Update Documentation:**
   - Document file-level scoring
   - Explain aggregation logic
   - Show examples

---

## Conclusion

**Answer:** While file-based PRs would be more accurate, they're not practical. Instead, we should implement **file-level scoring within PRs** to get:
- ✅ Accuracy and fairness (file-level tracking)
- ✅ Practicality (PR-based workflow)
- ✅ Better metrics (file-level analysis)

This gives us the best of both worlds without the overhead of per-file PRs.

---

**Next Steps:**
1. Enhance scoring to include file-level breakdown
2. Update metrics to store file-level data
3. Enhance dashboard to show file-level views
4. Document the hybrid approach

