#!/usr/bin/env python3
"""
Investigate why penalties are -6 instead of expected -4.

The rubric says failing_ci should be -4, but we're seeing -6 penalties.
"""

import json
import sys
from pathlib import Path
from collections import defaultdict

sys.path.insert(0, str(Path(__file__).parent))
from analyze_reward_trends import REWARD_SCORES_PATH


def investigate_penalties():
    """Investigate penalty calculation issues."""
    with open(REWARD_SCORES_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    scores = data.get("scores", [])
    
    print("=" * 80)
    print("PENALTY INVESTIGATION")
    print("=" * 80)
    
    # Focus on -6 penalty scores
    minus_six = [s for s in scores if s.get("breakdown", {}).get("penalties") == -6]
    print(f"\nPRs with -6 penalties: {len(minus_six)}")
    
    # Check if there's a pattern in coverage
    print("\n" + "-" * 80)
    print("ANALYZING COVERAGE DATA")
    print("-" * 80)
    
    # The breakdown shows the pattern, but we need to understand why
    # Let's check the rubric values
    rubric_path = Path(__file__).resolve().parents[1] / "reward_rubric.yaml"
    print(f"\nRubric file: {rubric_path}")
    if rubric_path.exists():
        import yaml
        with open(rubric_path, "r") as f:
            rubric = yaml.safe_load(f)
        print(f"\nRubric penalties: {rubric.get('penalties', {})}")
    
    # Analyze the breakdown pattern
    print("\n" + "-" * 80)
    print("BREAKDOWN PATTERN ANALYSIS")
    print("-" * 80)
    
    # All -6 scores have the same breakdown pattern
    breakdowns = [s.get("breakdown", {}) for s in minus_six]
    
    # Check if breakdowns are identical
    unique_breakdowns = set()
    for bd in breakdowns:
        unique_breakdowns.add(tuple(sorted(bd.items())))
    
    print(f"\nUnique breakdown patterns for -6 scores: {len(unique_breakdowns)}")
    if len(unique_breakdowns) == 1:
        print("ALL -6 scores have IDENTICAL breakdown!")
        print(f"Breakdown: {dict(breakdowns[0])}")
    
    # Calculate what the penalty should be based on rubric
    # failing_ci: -4, missing_tests: -2
    # If both were applied: -4 + -2 = -6
    print("\n" + "-" * 80)
    print("HYPOTHESIS: DOUBLE PENALTY BUG")
    print("-" * 80)
    print("\nPossible bug: Both 'failing_ci' (-4) and 'missing_tests' (-2) are being applied")
    print("Expected behavior: Only one should apply (if/elif logic)")
    print("\nChecking penalty calculation logic...")
    
    # Read the actual penalty calculation code
    compute_script = Path(__file__).parent / "compute_reward_score.py"
    if compute_script.exists():
        with open(compute_script, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Find the penalty calculation function
        if "def calculate_penalties" in content:
            start = content.find("def calculate_penalties")
            end = content.find("\n\n", start + 100)
            if end == -1:
                end = start + 500
            penalty_code = content[start:end]
            
            print("\nPenalty calculation code:")
            print("-" * 80)
            # Show relevant lines
            lines = penalty_code.split("\n")
            for i, line in enumerate(lines[:25], 1):
                if "if" in line or "elif" in line or "penalty" in line.lower() or "total_penalty" in line:
                    print(f"{i:3d}: {line}")
    
    # Check if there's a regression penalty being applied
    print("\n" + "-" * 80)
    print("CHECKING FOR REGRESSION PENALTY")
    print("-" * 80)
    print("\nRubric has 'regression: -3' but it's not used in calculate_penalties()")
    print("This might be a missing feature or the -6 could be:")
    print("  - failing_ci (-4) + missing_tests (-2) = -6 (BUG: both applied)")
    print("  - failing_ci (-4) + regression (-2 somewhere?) = -6")
    print("  - Some other combination")
    
    # Summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"\n1. {len(minus_six)} PRs have -6 penalties")
    print("2. All have identical breakdown: tests=1, docs=1, performance=1, security=-3, penalties=-6")
    print("3. Security is consistently -3 (critical issues detected)")
    print("4. Penalties are -6, but rubric says failing_ci should be -4")
    print("\nRECOMMENDATION:")
    print("  - Check if both failing_ci and missing_tests penalties are being applied")
    print("  - Verify coverage parsing (maybe {} is being interpreted incorrectly)")
    print("  - Check if there's a regression penalty being applied somewhere")
    print("  - Review actual coverage values for these PRs")


if __name__ == "__main__":
    investigate_penalties()


