# File-Level Scoring Implementation Summary

**Date:** 2025-11-17  
**Status:** ✅ **IMPLEMENTED**

---

## What Was Implemented

### File-Level Scoring Within PRs

The REWARD_SCORE system now scores each file individually within a PR, then aggregates into a PR-level score. This provides:

1. **Accuracy:** Each file gets its own score
2. **Fairness:** High-quality files aren't dragged down by low-quality ones
3. **Practicality:** Still uses PR-based workflow (no per-file PRs)
4. **Better Metrics:** Can analyze which files/types contribute most

---

## Implementation Details

### 1. New Functions Added

**`parse_diff_files(diff: str) -> Dict[str, str]`**
- Parses PR diff to extract individual files
- Returns dictionary mapping file paths to their diff content

**`score_file(file_path, file_diff, coverage, static_analysis, pr_desc, rubric) -> Tuple[int, dict, str]`**
- Scores a single file within a PR
- Returns file score, breakdown, and notes
- Uses same scoring logic as PR-level but per-file

### 2. Enhanced `compute_score()` Function

**Changes:**
- Added `include_file_level: bool = True` parameter
- Returns `(total_score, breakdown, notes, file_scores)` (added file_scores)
- Scores each file individually
- Aggregates file scores into PR-level breakdown
- Includes file-level summary in notes

**File Scores Structure:**
```json
{
  "file_scores": {
    "path/to/file1.ts": {
      "score": 3,
      "breakdown": {
        "tests": 2,
        "docs": 1,
        "bug_fix": 0,
        "performance": 0,
        "security": 0,
        "penalties": 0
      },
      "notes": "File: path/to/file1.ts\nTests: ..."
    },
    "path/to/file2.ts": {
      "score": 2,
      "breakdown": {...},
      "notes": "..."
    }
  }
}
```

### 3. Enhanced Metrics Collection

**`collect_metrics.py` Updates:**
- Added `--reward-json` flag to read complete reward.json
- Automatically extracts `file_scores` from reward.json
- Stores file-level scores in metrics JSON
- Updated `add_score_entry()` to accept `file_scores` parameter

**Metrics Structure:**
```json
{
  "scores": [
    {
      "pr": "123",
      "score": 6,
      "breakdown": {...},
      "file_scores": {
        "file1.ts": {"score": 3, "breakdown": {...}},
        "file2.ts": {"score": 2, "breakdown": {...}}
      }
    }
  ]
}
```

### 4. Updated Workflow

**`update_metrics_dashboard.yml` Updates:**
- Now uses `--reward-json` flag instead of separate breakdown/metadata files
- Automatically extracts file_scores from reward.json
- Simpler and more reliable

---

## How It Works

### Scoring Process

1. **Parse Diff:**
   - Extract individual files from PR diff
   - Each file gets its own diff content

2. **Score Each File:**
   - Run scoring logic for each file
   - Calculate tests, bug_fix, docs, performance scores per file
   - Security and penalties remain PR-level

3. **Aggregate:**
   - Use max() to aggregate file scores (avoid double-counting)
   - Combine with PR-level security/penalties
   - Calculate total PR score

4. **Store:**
   - Store both PR-level and file-level scores
   - Include in reward.json output
   - Store in metrics JSON

### Example Output

**PR #123 with 3 files:**
```json
{
  "score": 6,
  "breakdown": {
    "tests": 3,
    "bug_fix": 0,
    "docs": 2,
    "performance": 1,
    "security": 2,
    "penalties": -2
  },
  "file_scores": {
    "frontend/src/components/Button.tsx": {
      "score": 3,
      "breakdown": {"tests": 2, "docs": 1}
    },
    "frontend/src/components/Button.test.tsx": {
      "score": 2,
      "breakdown": {"tests": 2}
    },
    "docs/components/Button.md": {
      "score": 1,
      "breakdown": {"docs": 1}
    }
  }
}
```

---

## When Automation Kicks In

### Automatic Triggers

**1. PR Events (Primary)**
- **When:** PR created (`opened`), updated (`synchronize`), or reopened
- **Timeline:** ~5-10 minutes from PR creation
- **Workflow:** `.github/workflows/swarm_compute_reward_score.yml`

**2. Workflow Run Events (Secondary)**
- **When:** After CI workflow completes successfully
- **Condition:** Only if CI was triggered by a PR event
- **Timeline:** ~2-5 minutes after CI completes

### Complete Automation Flow

```
Developer creates/updates PR on GitHub
    ↓ (automatic, within seconds)
GitHub triggers CI workflow
    ↓ (automatic, ~2-5 minutes)
CI workflow runs tests, generates coverage
    ↓ (automatic, after CI completes)
REWARD_SCORE workflow triggers
    ↓ (automatic, ~2-5 minutes)
File-level scoring runs for each file in PR
    ↓ (automatic)
PR-level score computed (aggregated from files)
    ↓ (automatic)
PR comment posted with score and file-level breakdown
    ↓ (automatic, ~1-2 minutes)
Metrics collected (including file-level scores)
    ↓ (automatic)
Dashboard updated
```

**Total Time:** ~5-10 minutes from PR creation to complete automation

---

## Benefits

### ✅ Accuracy
- Each file gets its own score
- Can see exactly which files contributed what
- More precise performance tracking

### ✅ Fairness
- High-quality files aren't dragged down
- Low-quality files don't get credit from good ones
- Better attribution

### ✅ Practicality
- Still uses PR-based workflow
- No workflow disruption
- Reviewers see complete features

### ✅ Better Metrics
- Can analyze file type performance
- Identify problem file types
- Track improvements per file

---

## Files Modified

1. **`.cursor/scripts/compute_reward_score.py`**
   - Added `parse_diff_files()` function
   - Added `score_file()` function
   - Enhanced `compute_score()` to include file-level scoring
   - Updated output JSON to include `file_scores`

2. **`.cursor/scripts/collect_metrics.py`**
   - Added `--reward-json` flag
   - Updated `add_score_entry()` to accept `file_scores`
   - Stores file-level scores in metrics

3. **`.github/workflows/update_metrics_dashboard.yml`**
   - Updated to use `--reward-json` flag
   - Automatically extracts file_scores

4. **Documentation:**
   - `docs/planning/REWARD_SCORE_GRANULARITY_ANALYSIS.md` (analysis)
   - `docs/planning/REWARD_SCORE_AUTOMATION_TRIGGER.md` (trigger guide)

---

## Next Steps (Future Enhancements)

1. **Dashboard Enhancement:**
   - Add file-level view to dashboard
   - Show file contributions per PR
   - File type performance charts

2. **Metrics Analysis:**
   - Add file-level aggregates
   - Track file type performance
   - Identify problem file patterns

3. **Pattern Extraction:**
   - Extract patterns from high-scoring files
   - Identify anti-patterns from low-scoring files

---

## Testing

To test file-level scoring:

1. Create a PR with multiple files
2. Wait for automation to complete (~5-10 minutes)
3. Check PR comment for file-level breakdown
4. Check `reward.json` artifact for `file_scores` field
5. Check `docs/metrics/reward_scores.json` for file-level data

---

**Status:** ✅ **READY FOR USE**

File-level scoring is now fully implemented and will run automatically for every PR!


