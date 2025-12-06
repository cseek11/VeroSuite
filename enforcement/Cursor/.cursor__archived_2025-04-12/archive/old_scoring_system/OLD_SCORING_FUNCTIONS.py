"""
ARCHIVED: Old Scoring System Functions

This file contains the old scoring functions that used the legacy rubric format:
- tests (weight: 3)
- bug_fix (weight: 2)
- docs (weight: 1)
- performance (weight: 1)
- security (weight: 2)
- penalties: failing_ci (-4), missing_tests (-2), regression (-3)

These functions are archived as of 2025-12-04 when the new rubric system was adopted.

New system uses:
- search_first, pattern_match, security_correct, architecture_compliant, test_quality, observability_correct, docs_updated
- Penalties: hardcoded_values, rls_violation, missing_tests, architecture_drift, unstructured_logging, unsafe_frontend
"""

# This file is a placeholder - the actual old functions are in compute_reward_score.py backup
# See .cursor/backup_20251121/scripts/compute_reward_score.py for the full old implementation

ARCHIVED_DATE = "2025-12-04"
REPLACED_BY = "New rubric system in .cursor/reward_rubric.yaml"









