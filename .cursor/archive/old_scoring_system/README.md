# Old Scoring System Archive

**Archived Date:** 2025-11-21  
**Status:** Replaced by new rubric system

---

## Overview

This directory contains archived code from the old scoring system that was replaced on 2025-11-21.

## Old System Details

### Scoring Categories (Old)
- **tests**: Weight 3 (max +3 points)
- **bug_fix**: Weight 2 (max +2 points)
- **docs**: Weight 1 (max +1 point)
- **performance**: Weight 1 (max +1 point)
- **security**: Weight 2 (max +2 points, or -3 for critical)

### Penalties (Old)
- **failing_ci**: -4 points
- **missing_tests**: -2 points
- **regression**: -3 points

### Score Range
- Scale: -10 to +10
- High: 6-10
- Medium: 3-5
- Low: 0-2
- Blocking: < -3

---

## New System

See `.cursor/reward_rubric.yaml` for the new scoring system.

### New Categories
- search_first: +10
- pattern_match: +10
- security_correct: +20
- architecture_compliant: +10
- test_quality: +15
- observability_correct: +10
- docs_updated: +5

### New Penalties
- hardcoded_values: -20
- rls_violation: -50
- missing_tests: -20
- architecture_drift: -25
- unstructured_logging: -10
- unsafe_frontend: -15

### New Thresholds
- min_pass_score: 40
- warning_score: 20
- fail_score: 0

---

## Migration Notes

The old scoring functions were located in:
- `.cursor/scripts/compute_reward_score.py` (functions: `score_tests`, `detect_bug_fix`, `score_documentation`, `score_performance`, `score_security`, `calculate_penalties`)

These have been replaced with new implementations that use the new rubric format.

---

**Last Updated:** 2025-11-21









