#!/usr/bin/env python3
"""
Validate documentation date compliance.

Checks for "Last Updated" timestamp presence and verifies dates use current
system date (not hardcoded).
"""

import argparse
import json
import re
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple


def get_changed_md_files(pr_num: str, repo_path: Path) -> List[str]:
    """Get list of .md files changed in PR."""
    try:
        result = subprocess.run(
            ["git", "diff", "--name-only", "origin/main...HEAD"],
            cwd=repo_path,
            capture_output=True,
            text=True,
            timeout=30
        )
        files = result.stdout.strip().split("\n") if result.stdout.strip() else []
        # Filter for .md files (excluding README.md in root)
        md_files = [f for f in files if f.endswith(".md") and not (f == "README.md" or f.endswith("/README.md"))]
        return md_files
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return []


def get_file_content(file_path: str, repo_path: Path) -> str:
    """Get file content from git (handles both added and modified files)."""
    try:
        # Try to get file from HEAD
        result = subprocess.run(
            ["git", "show", f"HEAD:{file_path}"],
            cwd=repo_path,
            capture_output=True,
            text=True,
            timeout=10
        )
        if result.returncode == 0:
            return result.stdout
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pass
    
    # Fallback: try to read from filesystem
    full_path = repo_path / file_path
    if full_path.exists():
        return full_path.read_text(encoding="utf-8")
    
    return ""


def check_date_compliance(file_path: str, content: str, current_date: str) -> Dict:
    """Check date compliance for a single file."""
    violations = []
    
    # Pattern for "Last Updated" or "last_updated"
    date_patterns = [
        r"last[_\s]?updated[:\s]+(\d{4}-\d{2}-\d{2})",
        r"last[_\s]?updated[:\s]+(\d{4}/\d{2}/\d{2})",
        r"date[:\s]+(\d{4}-\d{2}-\d{2})",
    ]
    
    found_date = False
    date_value = None
    
    for pattern in date_patterns:
        matches = re.finditer(pattern, content, re.IGNORECASE | re.MULTILINE)
        for match in matches:
            found_date = True
            date_str = match.group(1)
            # Normalize date format
            date_str = date_str.replace("/", "-")
            date_value = date_str
            break
        if found_date:
            break
    
    # Check if date is present
    if not found_date:
        violations.append({
            "type": "missing_last_updated",
            "file": file_path,
            "reason": "No 'Last Updated' timestamp found",
            "severity": "medium",
            "suggestion": f"Add 'Last Updated: {current_date}' to file header"
        })
    else:
        # Check if date matches current date
        if date_value != current_date:
            violations.append({
                "type": "hardcoded_date",
                "file": file_path,
                "reason": f"Last Updated date ({date_value}) does not match current date ({current_date})",
                "severity": "low",
                "suggestion": f"Update 'Last Updated' to current date: {current_date}"
            })
    
    # Check for hardcoded dates in content (not in Last Updated field)
    hardcoded_date_pattern = r"\b(202[0-9]|20[3-9][0-9])-\d{2}-\d{2}\b"
    hardcoded_matches = re.finditer(hardcoded_date_pattern, content)
    for match in hardcoded_matches:
        date_str = match.group(0)
        # Skip if it's in a Last Updated field (already checked)
        context_before = content[max(0, match.start() - 50):match.start()]
        if "last" not in context_before.lower() and "updated" not in context_before.lower():
            violations.append({
                "type": "hardcoded_date_in_content",
                "file": file_path,
                "reason": f"Hardcoded date found in content: {date_str}",
                "severity": "low",
                "suggestion": "Use current system date or relative dates instead of hardcoded dates"
            })
    
    return {
        "file": file_path,
        "has_last_updated": found_date,
        "date_value": date_value,
        "violations": violations
    }


def validate_documentation_dates(pr_num: str, repo_path: Path) -> Tuple[List[Dict], Dict]:
    """Validate documentation date compliance for PR."""
    current_date = datetime.now().strftime("%Y-%m-%d")
    all_results = []
    all_violations = []
    
    # Get changed .md files
    md_files = get_changed_md_files(pr_num, repo_path)
    
    for file_path in md_files:
        # Get file content
        content = get_file_content(file_path, repo_path)
        
        if not content:
            continue
        
        # Check compliance
        result = check_date_compliance(file_path, content, current_date)
        all_results.append(result)
        all_violations.extend(result["violations"])
    
    metadata = {
        "pr": pr_num,
        "current_date": current_date,
        "files_checked": len(md_files),
        "violations_found": len(all_violations),
        "validated_at": datetime.utcnow().isoformat() + "Z"
    }
    
    return all_violations, metadata


def generate_report(violations: List[Dict], metadata: Dict) -> str:
    """Generate validation report."""
    if not violations:
        return f"""# Documentation Date Compliance

✅ **All documentation files comply with date requirements.**

**Current Date:** {metadata['current_date']}
**Files Checked:** {metadata['files_checked']}

No violations detected.
"""
    
    report = f"""# Documentation Date Compliance Report

**PR:** #{metadata['pr']}
**Current Date:** {metadata['current_date']}
**Files Checked:** {metadata['files_checked']}
**Violations Found:** {metadata['violations_found']}

## Violations

"""
    
    # Group by type
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
            report += f"""- **{v['file']}** ({v['severity']})
  - Reason: {v['reason']}
  - Suggestion: {v['suggestion']}

"""
    
    report += f"""
## Required Actions

1. Review each violation above
2. Add 'Last Updated: {metadata['current_date']}' to files missing it
3. Update hardcoded dates to current date: {metadata['current_date']}
4. Use current system date (not hardcoded dates) for all "Last Updated" fields

## Reference

See `.cursor/rules/core.md` for date handling requirements.
"""
    
    return report


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pr", required=True, help="PR number")
    parser.add_argument("--out", required=True, help="Output JSON path")
    args = parser.parse_args()
    
    repo_path = Path(__file__).resolve().parents[2]
    
    # Validate documentation dates
    violations, metadata = validate_documentation_dates(args.pr, repo_path)
    
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
        print(f"Found {len(violations)} documentation date violation(s)", file=__import__("sys").stderr)
    else:
        print("Documentation date validation passed", file=__import__("sys").stderr)


if __name__ == "__main__":
    main()






