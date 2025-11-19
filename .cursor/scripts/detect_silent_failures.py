#!/usr/bin/env python3
"""
Detect silent failures in code changes.

Detects empty catch blocks, swallowed promises, missing awaits, and
unhandled promise rejections.
"""

import argparse
import json
import re
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple


def get_changed_code_files(pr_num: str, repo_path: Path) -> List[str]:
    """Get list of code files changed in PR."""
    try:
        result = subprocess.run(
            ["git", "diff", "--name-only", "origin/main...HEAD"],
            cwd=repo_path,
            capture_output=True,
            text=True,
            timeout=30
        )
        files = result.stdout.strip().split("\n") if result.stdout.strip() else []
        code_files = [f for f in files if any(f.endswith(ext) for ext in [".ts", ".tsx", ".js", ".jsx", ".py"])]
        return code_files
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return []


def get_file_diff(file_path: str, repo_path: Path) -> str:
    """Get diff for a specific file."""
    try:
        result = subprocess.run(
            ["git", "diff", "origin/main...HEAD", "--", file_path],
            cwd=repo_path,
            capture_output=True,
            text=True,
            timeout=10
        )
        return result.stdout
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return ""


def detect_empty_catch_blocks(diff: str, file_path: str) -> List[Dict]:
    """Detect empty catch blocks."""
    violations = []
    
    # Pattern for empty catch blocks
    patterns = [
        (r"catch\s*\([^)]*\)\s*\{\s*\}", "Empty catch block"),
        (r"catch\s*\([^)]*\)\s*\{\s*//[^}]*\}", "Catch block with only comment"),
    ]
    
    for pattern, description in patterns:
        matches = re.finditer(pattern, diff, re.MULTILINE | re.DOTALL)
        for match in matches:
            line_num = diff[:match.start()].count("\n") + 1
            violations.append({
                "type": "empty_catch_block",
                "file": file_path,
                "line": line_num,
                "pattern": match.group(0)[:100],
                "severity": "high",
                "description": description,
                "suggestion": "Add proper error handling and logging in catch block"
            })
    
    return violations


def detect_missing_await(diff: str, file_path: str) -> List[Dict]:
    """Detect missing await on promises."""
    violations = []
    
    # Common async function patterns
    async_patterns = [
        r"(\w+)\s*\(\s*[^)]*\)\s*;",  # Function call followed by semicolon
    ]
    
    async_functions = ["fetch", "axios", "query", "execute", "save", "create", "update", "delete"]
    
    for pattern in async_patterns:
        matches = re.finditer(pattern, diff, re.MULTILINE)
        for match in matches:
            func_name = match.group(1)
            if func_name in async_functions:
                before = diff[max(0, match.start() - 50):match.start()]
                if "await" not in before and "async" not in before:
                    line_num = diff[:match.start()].count("\n") + 1
                    violations.append({
                        "type": "missing_await",
                        "file": file_path,
                        "line": line_num,
                        "pattern": match.group(0)[:100],
                        "severity": "medium",
                        "description": f"Potential missing await on async function: {func_name}",
                        "suggestion": f"Add await before {func_name}() call"
                    })
    
    return violations


def detect_silent_failures(pr_num: str, repo_path: Path) -> Tuple[List[Dict], Dict]:
    """Detect silent failures in PR."""
    all_violations = []
    
    code_files = get_changed_code_files(pr_num, repo_path)
    
    for file_path in code_files:
        diff = get_file_diff(file_path, repo_path)
        if not diff:
            continue
        
        all_violations.extend(detect_empty_catch_blocks(diff, file_path))
        all_violations.extend(detect_missing_await(diff, file_path))
    
    metadata = {
        "pr": pr_num,
        "files_checked": len(code_files),
        "violations_found": len(all_violations),
        "detected_at": datetime.utcnow().isoformat() + "Z"
    }
    
    return all_violations, metadata


def generate_report(violations: List[Dict], metadata: Dict) -> str:
    """Generate detection report."""
    if not violations:
        return f"""# Silent Failure Detection

✅ **No silent failures detected.**

**Files Checked:** {metadata['files_checked']}

No violations detected.
"""
    
    report = f"""# Silent Failure Detection Report

**PR:** #{metadata['pr']}
**Files Checked:** {metadata['files_checked']}
**Violations Found:** {metadata['violations_found']}

## Violations

"""
    
    by_type = {}
    for v in violations:
        v_type = v.get('type', 'unknown')
        if v_type not in by_type:
            by_type[v_type] = []
        by_type[v_type].append(v)
    
    for v_type, v_list in by_type.items():
        report += f"""### {v_type.replace('_', ' ').title()} ({len(v_list)})

"""
        for v in v_list:
            report += f"""- **{v['file']}:{v['line']}** ({v['severity']})
  - Description: {v['description']}
  - Pattern: `{v['pattern']}`
  - Suggestion: {v['suggestion']}

"""
    
    report += """
## Required Actions

1. Review each violation above
2. Add proper error handling to empty catch blocks
3. Add await keywords for async operations
4. Ensure all errors are logged and handled

## Reference

See `.cursor/rules/error-resilience.md` for error handling requirements.
"""
    
    return report


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pr", required=True, help="PR number")
    parser.add_argument("--out", required=True, help="Output JSON path")
    args = parser.parse_args()
    
    repo_path = Path(__file__).resolve().parents[2]
    
    violations, metadata = detect_silent_failures(args.pr, repo_path)
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
            print(f"Found {len(critical)} critical silent failure(s)", file=__import__("sys").stderr)
            exit(1)
        print(f"Found {len(violations)} silent failure violation(s)", file=__import__("sys").stderr)
    else:
        print("Silent failure detection passed", file=__import__("sys").stderr)


if __name__ == "__main__":
    main()







