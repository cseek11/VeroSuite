#!/usr/bin/env python3
"""
Detect anti-patterns from low-scoring PRs (REWARD_SCORE ≤ 0).

Parses PR diff and detects common anti-patterns, then generates entries
for `.cursor/anti_patterns.md` and `.cursor/BUG_LOG.md`.
"""

import argparse
import ast
import json
import re
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple


def get_pr_diff(pr_num: str, repo_path: Path) -> str:
    """Get PR diff using git commands."""
    try:
        result = subprocess.run(
            ["git", "diff", "origin/main...HEAD"],
            cwd=repo_path,
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.stdout
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return ""


def detect_empty_catch_blocks(diff: str) -> List[Dict]:
    """Detect empty catch blocks in diff."""
    violations = []
    
    # Pattern 1: catch {} or catch (e) {}
    pattern1 = r"catch\s*\([^)]*\)\s*\{\s*\}"
    matches1 = re.finditer(pattern1, diff, re.MULTILINE)
    for match in matches1:
        # Try to find line number
        line_num = diff[:match.start()].count("\n") + 1
        violations.append({
            "type": "empty_catch_block",
            "pattern": match.group(0),
            "line": line_num,
            "severity": "high",
            "description": "Empty catch block swallows errors silently"
        })
    
    # Pattern 2: catch with only comment
    pattern2 = r"catch\s*\([^)]*\)\s*\{\s*//[^}]*\}"
    matches2 = re.finditer(pattern2, diff, re.MULTILINE)
    for match in matches2:
        line_num = diff[:match.start()].count("\n") + 1
        violations.append({
            "type": "empty_catch_block",
            "pattern": match.group(0),
            "line": line_num,
            "severity": "high",
            "description": "Catch block with only comment (effectively empty)"
        })
    
    return violations


def detect_missing_await(diff: str) -> List[Dict]:
    """Detect missing await on promises."""
    violations = []
    
    # Look for function calls that return promises without await
    # This is a heuristic - look for common async patterns
    async_patterns = [
        r"(\w+)\s*\(\s*[^)]*\)\s*;",  # Function call followed by semicolon
        r"(\w+)\s*\(\s*[^)]*\)\s*\.then",  # Function call with .then
    ]
    
    # Common async function names
    async_functions = [
        "fetch", "axios", "request", "query", "execute", "save", "create", "update", "delete",
        "get", "post", "put", "patch", "delete", "find", "findOne", "findMany"
    ]
    
    for pattern in async_patterns:
        matches = re.finditer(pattern, diff, re.MULTILINE)
        for match in matches:
            func_name = match.group(1)
            if func_name in async_functions:
                # Check if await is present before this
                before = diff[max(0, match.start() - 50):match.start()]
                if "await" not in before and "async" not in before:
                    line_num = diff[:match.start()].count("\n") + 1
                    violations.append({
                        "type": "missing_await",
                        "pattern": match.group(0),
                        "line": line_num,
                        "severity": "medium",
                        "description": f"Potential missing await on async function: {func_name}"
                    })
    
    return violations


def detect_missing_error_handling(diff: str) -> List[Dict]:
    """Detect missing error handling."""
    violations = []
    
    # Look for async operations without try/catch
    async_functions = ["fetch", "axios", "query", "execute"]
    
    for func in async_functions:
        pattern = rf"{func}\s*\("
        matches = re.finditer(pattern, diff, re.MULTILINE)
        for match in matches:
            # Check if there's a try/catch around this
            start_pos = match.start()
            # Look backwards for try
            before = diff[max(0, start_pos - 200):start_pos]
            if "try" not in before:
                line_num = diff[:start_pos].count("\n") + 1
                violations.append({
                    "type": "missing_error_handling",
                    "pattern": match.group(0),
                    "line": line_num,
                    "severity": "medium",
                    "description": f"Async operation {func} without try/catch error handling"
                })
    
    return violations


def detect_security_violations(diff: str) -> List[Dict]:
    """Detect security violations."""
    violations = []
    
    # SQL injection patterns
    sql_patterns = [
        r"query\s*\(\s*['\"][^'\"]*\$",  # SQL with string interpolation
        r"execute\s*\(\s*['\"][^'\"]*\+",  # SQL concatenation
    ]
    
    for pattern in sql_patterns:
        matches = re.finditer(pattern, diff, re.MULTILINE | re.IGNORECASE)
        for match in matches:
            line_num = diff[:match.start()].count("\n") + 1
            violations.append({
                "type": "security_violation",
                "pattern": match.group(0),
                "line": line_num,
                "severity": "critical",
                "description": "Potential SQL injection vulnerability"
            })
    
    # Hardcoded secrets
    secret_patterns = [
        r"password\s*=\s*['\"][^'\"]+['\"]",
        r"api[_-]?key\s*=\s*['\"][^'\"]+['\"]",
        r"secret\s*=\s*['\"][^'\"]+['\"]",
    ]
    
    for pattern in secret_patterns:
        matches = re.finditer(pattern, diff, re.MULTILINE | re.IGNORECASE)
        for match in matches:
            line_num = diff[:match.start()].count("\n") + 1
            violations.append({
                "type": "security_violation",
                "pattern": match.group(0)[:50] + "...",  # Truncate to avoid exposing secret
                "line": line_num,
                "severity": "critical",
                "description": "Potential hardcoded secret in code"
            })
    
    return violations


def detect_missing_tests(diff: str, files: List[str]) -> List[Dict]:
    """Detect missing tests for changed code."""
    violations = []
    
    # Check if test files exist for changed source files
    source_files = [f for f in files if not any(x in f for x in ["test", "spec", "__tests__"])]
    test_files = [f for f in files if any(x in f for x in ["test", "spec", "__tests__"])]
    
    for source_file in source_files:
        # Check if corresponding test file exists
        test_exists = False
        for test_file in test_files:
            # Simple heuristic: test file name contains source file name
            source_name = Path(source_file).stem
            if source_name in test_file:
                test_exists = True
                break
        
        if not test_exists and any(ext in source_file for ext in [".ts", ".tsx", ".js", ".jsx", ".py"]):
            violations.append({
                "type": "missing_tests",
                "pattern": source_file,
                "line": 0,
                "severity": "medium",
                "description": f"No test file found for {source_file}"
            })
    
    return violations


def detect_pattern_drift(diff: str) -> List[Dict]:
    """Detect pattern drift (inconsistent patterns)."""
    violations = []
    
    # Check for inconsistent logging patterns
    logger_calls = re.findall(r"logger\.(info|error|warn|debug)\s*\(", diff, re.MULTILINE)
    if logger_calls:
        # Check if traceId is present in logger calls
        trace_id_pattern = r"traceId"
        trace_id_matches = len(re.findall(trace_id_pattern, diff, re.MULTILINE))
        logger_count = len(logger_calls)
        
        if trace_id_matches < logger_count * 0.5:  # Less than 50% have traceId
            violations.append({
                "type": "pattern_drift",
                "pattern": "inconsistent_logging",
                "line": 0,
                "severity": "low",
                "description": f"Only {trace_id_matches}/{logger_count} logger calls include traceId"
            })
    
    return violations


def generate_anti_pattern_entry(violations: List[Dict], pr_num: str) -> str:
    """Generate anti-pattern entry for .cursor/anti_patterns.md."""
    if not violations:
        return ""
    
    entry = f"""## Anti-Pattern Detected (PR #{pr_num})

**Date:** {datetime.now().strftime("%Y-%m-%d")}
**Source PR:** #{pr_num}
**Violations Found:** {len(violations)}

### Detected Issues:

"""
    
    for i, violation in enumerate(violations, 1):
        entry += f"""#### {i}. {violation['type'].replace('_', ' ').title()}

- **Severity:** {violation['severity']}
- **Description:** {violation['description']}
- **Pattern:** `{violation['pattern'][:100]}`
- **Line:** {violation['line']}

"""
    
    entry += f"""
### Remediation Guidance:

1. Review each violation above
2. Fix empty catch blocks by adding proper error handling
3. Add missing await keywords for async operations
4. Add try/catch blocks around error-prone operations
5. Remove hardcoded secrets and use environment variables
6. Add tests for new or modified code
7. Ensure consistent logging patterns with traceId

### Follow-up Owner:

- [ ] Assign to PR author for remediation
- [ ] Create follow-up issue if needed

---

"""
    
    return entry


def generate_bug_log_entry(violations: List[Dict], pr_num: str) -> str:
    """Generate bug log entry for .cursor/BUG_LOG.md."""
    critical_violations = [v for v in violations if v['severity'] == 'critical']
    high_violations = [v for v in violations if v['severity'] == 'high']
    
    if not critical_violations and not high_violations:
        return ""
    
    entry = f"""## Bug Log Entry (PR #{pr_num})

**Date:** {datetime.now().strftime("%Y-%m-%d")}
**Source PR:** #{pr_num}
**Severity:** {"Critical" if critical_violations else "High"}

### Issues:

"""
    
    for violation in critical_violations + high_violations:
        entry += f"""- **{violation['type']}:** {violation['description']}
  - Pattern: `{violation['pattern'][:100]}`
  - Line: {violation['line']}

"""
    
    entry += f"""
### Status:

- [ ] Fixed
- [ ] Regression test added
- [ ] Error pattern documented

---

"""
    
    return entry


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pr", required=True, help="PR number")
    parser.add_argument("--score", required=True, type=int, help="REWARD_SCORE")
    parser.add_argument("--diff", help="Path to PR diff file (optional)")
    parser.add_argument("--out", required=True, help="Output JSON path")
    args = parser.parse_args()
    
    if args.score > 0:
        print(f"PR score is {args.score} (not ≤ 0), skipping anti-pattern detection", file=__import__("sys").stderr)
        with open(args.out, "w", encoding="utf-8") as handle:
            json.dump({"violations": [], "anti_pattern_entry": "", "bug_log_entry": ""}, handle, indent=2)
        return
    
    repo_path = Path(__file__).resolve().parents[2]
    
    # Get PR diff
    if args.diff:
        with open(args.diff, "r", encoding="utf-8") as handle:
            diff = handle.read()
    else:
        diff = get_pr_diff(args.pr, repo_path)
    
    # Get changed files
    try:
        result = subprocess.run(
            ["git", "diff", "--name-only", "origin/main...HEAD"],
            cwd=repo_path,
            capture_output=True,
            text=True,
            timeout=30
        )
        files = result.stdout.strip().split("\n") if result.stdout.strip() else []
    except (subprocess.TimeoutExpired, FileNotFoundError):
        files = []
    
    # Detect all anti-patterns
    all_violations = []
    all_violations.extend(detect_empty_catch_blocks(diff))
    all_violations.extend(detect_missing_await(diff))
    all_violations.extend(detect_missing_error_handling(diff))
    all_violations.extend(detect_security_violations(diff))
    all_violations.extend(detect_missing_tests(diff, files))
    all_violations.extend(detect_pattern_drift(diff))
    
    # Generate entries
    anti_pattern_entry = generate_anti_pattern_entry(all_violations, args.pr)
    bug_log_entry = generate_bug_log_entry(all_violations, args.pr)
    
    # Write output
    output = {
        "violations": all_violations,
        "anti_pattern_entry": anti_pattern_entry,
        "bug_log_entry": bug_log_entry,
        "metadata": {
            "pr": args.pr,
            "score": args.score,
            "detected_at": datetime.utcnow().isoformat() + "Z",
            "violation_count": len(all_violations)
        }
    }
    
    with open(args.out, "w", encoding="utf-8") as handle:
        json.dump(output, handle, indent=2)
    
    print(f"Detected {len(all_violations)} anti-pattern violation(s) in PR {args.pr}", file=__import__("sys").stderr)


if __name__ == "__main__":
    main()





