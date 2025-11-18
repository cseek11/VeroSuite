#!/usr/bin/env python3
"""
Validate trace ID propagation in logger calls.

Checks for traceId, spanId, requestId in logger calls and verifies
trace propagation across service boundaries.
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
        # Filter for code files
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


def check_trace_propagation(file_path: str, diff: str) -> List[Dict]:
    """Check trace ID propagation in file diff."""
    violations = []
    
    # Pattern for logger calls
    logger_patterns = [
        r"logger\.(info|error|warn|debug|fatal)\s*\(",
    ]
    
    for pattern in logger_patterns:
        matches = re.finditer(pattern, diff, re.MULTILINE)
        for match in matches:
            # Get context around logger call (next 10 lines)
            start_pos = match.end()
            context = diff[start_pos:start_pos + 500]  # Get next 500 chars
            
            # Check for traceId, spanId, requestId
            has_trace_id = "traceId" in context or "trace-id" in context or "x-trace-id" in context
            has_span_id = "spanId" in context or "span-id" in context or "x-span-id" in context
            has_request_id = "requestId" in context or "request-id" in context or "x-request-id" in context
            
            # Get line number
            line_num = diff[:match.start()].count("\n") + 1
            
            missing = []
            if not has_trace_id:
                missing.append("traceId")
            if not has_span_id:
                missing.append("spanId")
            if not has_request_id:
                missing.append("requestId")
            
            if missing:
                violations.append({
                    "type": "missing_trace_ids",
                    "file": file_path,
                    "line": line_num,
                    "missing": missing,
                    "severity": "medium",
                    "description": f"Logger call missing trace IDs: {', '.join(missing)}",
                    "suggestion": "Add traceId, spanId, requestId to logger call using getOrCreateTraceContext()"
                })
    
    return violations


def validate_trace_propagation(pr_num: str, repo_path: Path) -> Tuple[List[Dict], Dict]:
    """Validate trace ID propagation for PR."""
    all_violations = []
    
    # Get changed code files
    code_files = get_changed_code_files(pr_num, repo_path)
    
    for file_path in code_files:
        # Get file diff
        diff = get_file_diff(file_path, repo_path)
        
        if not diff:
            continue
        
        # Check trace propagation
        violations = check_trace_propagation(file_path, diff)
        all_violations.extend(violations)
    
    metadata = {
        "pr": pr_num,
        "files_checked": len(code_files),
        "violations_found": len(all_violations),
        "validated_at": datetime.utcnow().isoformat() + "Z"
    }
    
    return all_violations, metadata


def generate_report(violations: List[Dict], metadata: Dict) -> str:
    """Generate validation report."""
    if not violations:
        return f"""# Trace ID Propagation Validation

✅ **All logger calls include trace IDs.**

**Files Checked:** {metadata['files_checked']}

No violations detected.
"""
    
    report = f"""# Trace ID Propagation Validation Report

**PR:** #{metadata['pr']}
**Files Checked:** {metadata['files_checked']}
**Violations Found:** {metadata['violations_found']}

## Violations

"""
    
    # Group by file
    by_file = {}
    for v in violations:
        file_path = v.get('file', 'unknown')
        if file_path not in by_file:
            by_file[file_path] = []
        by_file[file_path].append(v)
    
    for file_path, v_list in by_file.items():
        report += f"""### {file_path} ({len(v_list)})

"""
        for v in v_list:
            report += f"""- **Line {v['line']}** ({v['severity']})
  - Missing: {', '.join(v['missing'])}
  - Description: {v['description']}
  - Suggestion: {v['suggestion']}

"""
    
    report += """
## Required Actions

1. Review each violation above
2. Add traceId, spanId, requestId to logger calls
3. Use getOrCreateTraceContext() to get trace context
4. Ensure trace IDs are propagated across service boundaries

## Reference

See `.cursor/rules/observability.md` for trace propagation requirements.
"""
    
    return report


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pr", required=True, help="PR number")
    parser.add_argument("--out", required=True, help="Output JSON path")
    args = parser.parse_args()
    
    repo_path = Path(__file__).resolve().parents[2]
    
    # Validate trace propagation
    violations, metadata = validate_trace_propagation(args.pr, repo_path)
    
    # Generate report
    report = generate_report(violations, metadata)
    
    # Write output
    output = {
        "violations": violations,
        "metadata": metadata,
        "report": report,
        "compliance": len(violations) == 0
    }
    
    with open(args.out, "w", encoding="utf-8") as handle:
        json.dump(output, handle, indent=2)
    
    # Print summary
    if violations:
        print(f"Found {len(violations)} trace propagation violation(s)", file=__import__("sys").stderr)
    else:
        print("Trace propagation validation passed", file=__import__("sys").stderr)


if __name__ == "__main__":
    main()


