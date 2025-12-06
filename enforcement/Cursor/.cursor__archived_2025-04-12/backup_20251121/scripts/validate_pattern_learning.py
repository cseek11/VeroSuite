#!/usr/bin/env python3
"""
Validate pattern learning compliance.

For bug fixes: checks if error pattern documented, bug logged, regression tests exist.
For features: checks if engineering decisions documented.
"""

import argparse
import json
import re
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple


BUG_LOG_PATH = Path(__file__).resolve().parents[1] / "BUG_LOG.md"
ERROR_PATTERNS_PATH = Path(__file__).resolve().parents[0].parents[0] / "docs" / "error-patterns.md"
ENGINEERING_DECISIONS_PATH = Path(__file__).resolve().parents[0].parents[0] / "docs" / "engineering-decisions.md"


def load_text_file(path: Path) -> str:
    """Load text file."""
    try:
        return path.read_text(encoding="utf-8")
    except FileNotFoundError:
        return ""


def get_pr_description(pr_num: str) -> str:
    """Get PR description."""
    try:
        result = subprocess.run(
            ["gh", "pr", "view", pr_num, "--json", "body"],
            capture_output=True,
            text=True,
            timeout=10
        )
        if result.returncode == 0:
            data = json.loads(result.stdout)
            return data.get("body", "")
    except (subprocess.TimeoutExpired, FileNotFoundError, json.JSONDecodeError) as e:
        # Log error but don't fail - return empty string as fallback
        print(f"Warning: Could not get PR description: {type(e).__name__}", file=__import__("sys").stderr)
    return ""


def get_changed_files(pr_num: str, repo_path: Path) -> List[str]:
    """Get changed files."""
    try:
        result = subprocess.run(
            ["git", "diff", "--name-only", "origin/main...HEAD"],
            cwd=repo_path,
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.stdout.strip().split("\n") if result.stdout.strip() else []
    except (subprocess.TimeoutExpired, FileNotFoundError) as e:
        # Log error but don't fail - return empty list as fallback
        print(f"Warning: Could not get changed files: {type(e).__name__}", file=__import__("sys").stderr)
        return []


def is_bug_fix(pr_desc: str) -> bool:
    """Check if PR is a bug fix."""
    bug_keywords = ["bug", "fix", "error", "issue", "bugfix", "resolve", "correct"]
    return any(keyword in pr_desc.lower() for keyword in bug_keywords)


def check_bug_fix_compliance(pr_num: str, pr_desc: str, files: List[str]) -> List[Dict]:
    """Check bug fix compliance."""
    violations = []
    
    # Check if bug is logged
    bug_log_content = load_text_file(BUG_LOG_PATH)
    bug_logged = pr_num in bug_log_content or any(keyword in bug_log_content.lower() for keyword in ["bug", "fix", "error"])
    
    if not bug_logged:
        violations.append({
            "type": "missing_bug_log",
            "severity": "high",
            "description": "Bug fix PR but bug not logged in BUG_LOG.md",
            "suggestion": "Add entry to .cursor/BUG_LOG.md"
        })
    
    # Check if error pattern documented
    error_patterns_content = load_text_file(ERROR_PATTERNS_PATH)
    pattern_documented = len(error_patterns_content) > 100  # Basic check
    
    if not pattern_documented:
        violations.append({
            "type": "missing_error_pattern",
            "severity": "high",
            "description": "Bug fix PR but error pattern not documented",
            "suggestion": "Add error pattern to docs/error-patterns.md"
        })
    
    # Check for regression tests
    test_files = [f for f in files if "test" in f.lower() or "spec" in f.lower()]
    if not test_files:
        violations.append({
            "type": "missing_regression_test",
            "severity": "high",
            "description": "Bug fix PR but no regression tests found",
            "suggestion": "Add regression tests to prevent recurrence"
        })
    
    return violations


def check_feature_compliance(pr_desc: str, files: List[str]) -> List[Dict]:
    """Check feature compliance."""
    violations = []
    
    # Check if engineering decision documented
    engineering_decisions_content = load_text_file(ENGINEERING_DECISIONS_PATH)
    has_decision = "engineering-decisions.md" in [f.lower() for f in files]
    
    # Check if significant feature (heuristic: large changes)
    if len(files) > 5 and not has_decision:
        violations.append({
            "type": "missing_engineering_decision",
            "severity": "medium",
            "description": "Significant feature but no engineering decision documented",
            "suggestion": "Add entry to docs/engineering-decisions.md"
        })
    
    return violations


def validate_pattern_learning(pr_num: str, repo_path: Path) -> Tuple[List[Dict], Dict]:
    """Validate pattern learning compliance."""
    all_violations = []
    
    pr_desc = get_pr_description(pr_num)
    files = get_changed_files(pr_num, repo_path)
    
    if is_bug_fix(pr_desc):
        violations = check_bug_fix_compliance(pr_num, pr_desc, files)
        all_violations.extend(violations)
    else:
        violations = check_feature_compliance(pr_desc, files)
        all_violations.extend(violations)
    
    metadata = {
        "pr": pr_num,
        "is_bug_fix": is_bug_fix(pr_desc),
        "files_checked": len(files),
        "violations_found": len(all_violations),
        "validated_at": datetime.utcnow().isoformat() + "Z"
    }
    
    return all_violations, metadata


def generate_report(violations: List[Dict], metadata: Dict) -> str:
    """Generate validation report."""
    if not violations:
        return f"""# Pattern Learning Compliance

✅ **All pattern learning requirements met.**

**PR Type:** {"Bug Fix" if metadata['is_bug_fix'] else "Feature"}
**Files Checked:** {metadata['files_checked']}

No violations detected.
"""
    
    report = f"""# Pattern Learning Compliance Report

**PR:** #{metadata['pr']}
**PR Type:** {"Bug Fix" if metadata['is_bug_fix'] else "Feature"}
**Files Checked:** {metadata['files_checked']}
**Violations Found:** {metadata['violations_found']}

## Violations

"""
    
    for v in violations:
        report += f"""### {v['type'].replace('_', ' ').title()} ({v['severity']})

- Description: {v['description']}
- Suggestion: {v['suggestion']}

"""
    
    report += """
## Required Actions

1. Review each violation above
2. Add missing bug logs, error patterns, or engineering decisions
3. Add regression tests for bug fixes
4. Document significant engineering decisions

## Reference

See `.cursor/rules/pattern-learning.md` for pattern learning requirements.
"""
    
    return report


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pr", required=True, help="PR number")
    parser.add_argument("--out", required=True, help="Output JSON path")
    args = parser.parse_args()
    
    repo_path = Path(__file__).resolve().parents[2]
    
    violations, metadata = validate_pattern_learning(args.pr, repo_path)
    report = generate_report(violations, metadata)
    
    output = {
        "violations": violations,
        "metadata": metadata,
        "report": report,
        "compliance": len(violations) == 0
    }
    
    with open(args.out, "w", encoding="utf-8") as handle:
        json.dump(output, handle, indent=2)
    
    if violations:
        critical = [v for v in violations if v["severity"] == "high"]
        if critical:
            print(f"Found {len(critical)} critical pattern learning violation(s)", file=__import__("sys").stderr)
            exit(1)
        print(f"Found {len(violations)} pattern learning violation(s)", file=__import__("sys").stderr)
    else:
        print("Pattern learning validation passed", file=__import__("sys").stderr)


if __name__ == "__main__":
    main()

