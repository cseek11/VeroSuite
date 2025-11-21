#!/usr/bin/env python3
"""
Extract candidate patterns from high-scoring PRs (REWARD_SCORE ≥ 6).

Reads PR metadata/diffs and emits candidate pattern JSON for human review.
"""

import argparse
import json
import re
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional


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


def get_pr_files(pr_num: str, repo_path: Path) -> List[str]:
    """Get list of files changed in PR."""
    try:
        result = subprocess.run(
            ["git", "diff", "--name-only", "origin/main...HEAD"],
            cwd=repo_path,
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.stdout.strip().split("\n") if result.stdout.strip() else []
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return []


def detect_domain(file_path: str) -> str:
    """Detect domain from file path."""
    if file_path.startswith("frontend/"):
        return "frontend"
    elif file_path.startswith("backend/") or file_path.startswith("apps/api/"):
        return "backend"
    elif file_path.startswith("infra/") or file_path.startswith("deploy/") or file_path.startswith("k8s/"):
        return "infra"
    elif file_path.startswith("pipelines/") or ".sql" in file_path or "airflow/" in file_path:
        return "data"
    else:
        return "common"


def detect_complexity(diff: str, files: List[str]) -> str:
    """Detect pattern complexity based on diff size and file count."""
    lines_changed = len(diff.split("\n"))
    files_changed = len(files)
    
    if lines_changed > 500 or files_changed > 10:
        return "complex"
    elif lines_changed > 100 or files_changed > 3:
        return "medium"
    else:
        return "simple"


def extract_error_handling_pattern(diff: str, files: List[str]) -> Optional[Dict]:
    """Extract error handling pattern."""
    # Look for structured error handling patterns
    error_patterns = [
        r"try\s*\{[^}]*catch\s*\([^)]*\)\s*\{[^}]*logger\.(error|warn)",
        r"catch\s*\([^)]*error[^)]*\)\s*\{[^}]*traceId",
        r"if\s*\([^)]*error[^)]*\)\s*\{[^}]*throw",
    ]
    
    matches = []
    for pattern in error_patterns:
        if re.search(pattern, diff, re.MULTILINE | re.DOTALL):
            matches.append(pattern)
    
    if not matches:
        return None
    
    # Find example file
    example_file = None
    for file_path in files:
        if any(ext in file_path for ext in [".ts", ".tsx", ".js", ".jsx"]):
            example_file = file_path
            break
    
    if not example_file:
        return None
    
    return {
        "pattern": "error-handling-structured",
        "when": "Handling errors in async operations or API calls",
        "do": [
            "Use try/catch blocks with proper error logging",
            "Include traceId, spanId, requestId in error logs",
            "Throw typed error objects with context",
            "Provide user-safe error messages"
        ],
        "why": "Ensures errors are properly logged and traceable across services",
        "example": f"{example_file}#L1",
        "metadata": {
            "domain": detect_domain(example_file),
            "complexity": detect_complexity(diff, files),
            "source_pr": "",
            "created_at": datetime.utcnow().isoformat() + "Z",
            "author": ""
        }
    }


def extract_logging_pattern(diff: str, files: List[str]) -> Optional[Dict]:
    """Extract structured logging pattern."""
    # Look for structured logging patterns
    logging_patterns = [
        r"logger\.(info|error|warn|debug)\s*\([^,]+,\s*[^,]+,\s*[^)]*traceId",
        r"logger\.(info|error|warn|debug)\s*\([^,]+,\s*\{[^}]*traceId",
    ]
    
    matches = []
    for pattern in logging_patterns:
        if re.search(pattern, diff, re.MULTILINE | re.DOTALL):
            matches.append(pattern)
    
    if not matches:
        return None
    
    example_file = None
    for file_path in files:
        if "logger" in file_path.lower() or any(ext in file_path for ext in [".ts", ".tsx"]):
            example_file = file_path
            break
    
    if not example_file:
        return None
    
    return {
        "pattern": "structured-logging",
        "when": "Adding logging to application code",
        "do": [
            "Use structured logger with required fields: message, context, traceId, operation, severity",
            "Include traceId, spanId, requestId for distributed tracing",
            "Use appropriate log levels (info, warn, error, debug)",
            "Avoid logging sensitive data"
        ],
        "why": "Enables distributed tracing and structured log analysis",
        "example": f"{example_file}#L1",
        "metadata": {
            "domain": detect_domain(example_file),
            "complexity": detect_complexity(diff, files),
            "source_pr": "",
            "created_at": datetime.utcnow().isoformat() + "Z",
            "author": ""
        }
    }


def extract_test_pattern(diff: str, files: List[str]) -> Optional[Dict]:
    """Extract test pattern."""
    test_files = [f for f in files if "test" in f.lower() or "spec" in f.lower()]
    
    if not test_files:
        return None
    
    # Look for test patterns
    test_patterns = [
        r"describe\s*\([^,]+,\s*\(\)\s*=>",
        r"it\s*\([^,]+,\s*(async\s*)?\(\)\s*=>",
        r"test\s*\([^,]+,\s*(async\s*)?\(\)\s*=>",
    ]
    
    matches = []
    for pattern in test_patterns:
        if re.search(pattern, diff, re.MULTILINE | re.DOTALL):
            matches.append(pattern)
    
    if not matches:
        return None
    
    example_file = test_files[0]
    
    return {
        "pattern": "test-structure",
        "when": "Writing unit or integration tests",
        "do": [
            "Use describe/it blocks for test organization",
            "Test happy path, edge cases, and error cases",
            "Use mocks for external dependencies",
            "Include regression tests for bug fixes"
        ],
        "why": "Ensures comprehensive test coverage and maintainability",
        "example": f"{example_file}#L1",
        "metadata": {
            "domain": detect_domain(example_file),
            "complexity": detect_complexity(diff, files),
            "source_pr": "",
            "created_at": datetime.utcnow().isoformat() + "Z",
            "author": ""
        }
    }


def extract_patterns(pr_num: str, diff: str, files: List[str]) -> List[Dict]:
    """Extract candidate patterns from PR."""
    candidates = []
    
    # Try to extract different pattern types
    error_pattern = extract_error_handling_pattern(diff, files)
    if error_pattern:
        error_pattern["metadata"]["source_pr"] = pr_num
        candidates.append(error_pattern)
    
    logging_pattern = extract_logging_pattern(diff, files)
    if logging_pattern:
        logging_pattern["metadata"]["source_pr"] = pr_num
        candidates.append(logging_pattern)
    
    test_pattern = extract_test_pattern(diff, files)
    if test_pattern:
        test_pattern["metadata"]["source_pr"] = pr_num
        candidates.append(test_pattern)
    
    # If no specific patterns found, create a generic one
    if not candidates:
        domain = "common"
        if files:
            domain = detect_domain(files[0])
        
        candidates.append({
            "pattern": "code-improvement",
            "when": "Improving code quality or adding features",
            "do": [
                "Follow established patterns in codebase",
                "Maintain consistency with existing code",
                "Add appropriate tests and documentation"
            ],
            "why": "Maintains code quality and consistency",
            "example": f"{files[0]}#L1" if files else "unknown",
            "metadata": {
                "domain": domain,
                "complexity": detect_complexity(diff, files),
                "source_pr": pr_num,
                "created_at": datetime.utcnow().isoformat() + "Z",
                "author": ""
            }
        })
    
    return candidates


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pr", required=True, help="PR number")
    parser.add_argument("--diff", help="Path to PR diff file (optional)")
    parser.add_argument("--out", required=True, help="Output JSON path")
    args = parser.parse_args()
    
    repo_path = Path(__file__).resolve().parents[2]
    
    # Get PR diff
    if args.diff:
        with open(args.diff, "r", encoding="utf-8") as handle:
            diff = handle.read()
    else:
        diff = get_pr_diff(args.pr, repo_path)
    
    # Get changed files
    files = get_pr_files(args.pr, repo_path)
    
    # Extract patterns
    candidates = extract_patterns(args.pr, diff, files)
    
    # Write output
    output = {
        "candidates": candidates,
        "metadata": {
            "pr": args.pr,
            "extracted_at": datetime.utcnow().isoformat() + "Z",
            "files_changed": len(files)
        }
    }
    
    with open(args.out, "w", encoding="utf-8") as handle:
        json.dump(output, handle, indent=2)
    
    print(f"Extracted {len(candidates)} candidate pattern(s) from PR {args.pr}", file=__import__("sys").stderr)


if __name__ == "__main__":
    main()
