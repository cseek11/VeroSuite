#!/usr/bin/env python3
"""
Validate file organization compliance per `.cursor/rules/file-organization.md`.

Checks for prohibited files in root directory and validates directory structure.
"""

import argparse
import json
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple


# Files allowed in root directory
ALLOWED_ROOT_FILES = {
    "README.md",
    "package.json",
    "package-lock.json",
    ".gitignore",
    ".gitattributes",
    "tsconfig.json",
    "nest-cli.json",
    ".cursorrules",
}

# Prohibited file extensions in root
PROHIBITED_EXTENSIONS = {
    ".md",  # Except README.md
    ".txt",
    ".docx",
    ".doc",
    ".pdf",
    ".sql",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".mp4",
    ".mov",
    ".avi",
}

# Required directories
REQUIRED_DIRECTORIES = {
    "docs/",
    ".cursor/",
}

# Documentation subdirectories (from file-organization.md)
DOCS_SUBDIRECTORIES = {
    "reference",
    "guides",
    "architecture",
    "planning",
    "archive",
    "developer",
    "examples",
    "contracts",
    "state-machines",
}


def get_changed_files(pr_num: str, repo_path: Path) -> List[str]:
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


def check_root_directory_violations(files: List[str]) -> List[Dict]:
    """Check for prohibited files in root directory."""
    violations = []
    
    for file_path in files:
        # Only check files that are in root (no / in path except leading ./)
        path_parts = Path(file_path).parts
        if len(path_parts) == 1 or (len(path_parts) == 2 and path_parts[0] in [".", "a", "b"]):
            filename = path_parts[-1]
            
            # Check if file is allowed
            if filename not in ALLOWED_ROOT_FILES:
                # Check extension
                ext = Path(filename).suffix.lower()
                if ext in PROHIBITED_EXTENSIONS:
                    violations.append({
                        "type": "prohibited_file_in_root",
                        "file": file_path,
                        "reason": f"File with prohibited extension '{ext}' in root directory",
                        "severity": "high",
                        "suggestion": f"Move to appropriate subdirectory (e.g., docs/)"
                    })
                elif filename.endswith(".md") and filename != "README.md":
                    violations.append({
                        "type": "prohibited_file_in_root",
                        "file": file_path,
                        "reason": "Markdown file (except README.md) in root directory",
                        "severity": "high",
                        "suggestion": "Move to docs/ subdirectory"
                    })
                elif ext == ".sql":
                    violations.append({
                        "type": "prohibited_file_in_root",
                        "file": file_path,
                        "reason": "SQL script in root directory",
                        "severity": "high",
                        "suggestion": "Move to docs/archive/migrations/ or supabase/migrations/"
                    })
                elif ext in {".png", ".jpg", ".jpeg", ".gif", ".mp4", ".mov", ".avi"}:
                    violations.append({
                        "type": "prohibited_file_in_root",
                        "file": file_path,
                        "reason": f"Media file in root directory",
                        "severity": "medium",
                        "suggestion": "Move to branding/assets/ or docs/assets/"
                    })
    
    return violations


def check_documentation_organization(files: List[str]) -> List[Dict]:
    """Check if documentation files are properly organized."""
    violations = []
    
    for file_path in files:
        path = Path(file_path)
        
        # Check if it's a documentation file
        if path.suffix == ".md" and path.name != "README.md":
            # Check if it's in docs/ directory
            if "docs/" not in str(path):
                # Check if it's a new file (starts with a/)
                if file_path.startswith("a/") or not file_path.startswith(("b/", "docs/")):
                    violations.append({
                        "type": "documentation_not_in_docs",
                        "file": file_path,
                        "reason": "Documentation file not in docs/ directory",
                        "severity": "high",
                        "suggestion": "Move to appropriate docs/ subdirectory"
                    })
            else:
                # Check if it's in a proper subdirectory
                parts = path.parts
                if "docs" in parts:
                    docs_index = parts.index("docs")
                    if len(parts) > docs_index + 1:
                        subdir = parts[docs_index + 1]
                        if subdir not in DOCS_SUBDIRECTORIES and subdir not in {"archive", "reference", "guides"}:
                            # Allow some flexibility for archive subdirectories
                            if "archive" not in str(path):
                                violations.append({
                                    "type": "documentation_in_wrong_subdirectory",
                                    "file": file_path,
                                    "reason": f"Documentation file in unexpected subdirectory: {subdir}",
                                    "severity": "low",
                                    "suggestion": f"Consider moving to appropriate docs/ subdirectory"
                                })
    
    return violations


def check_test_outputs(files: List[str]) -> List[Dict]:
    """Check for test outputs that should be gitignored."""
    violations = []
    
    test_output_patterns = [
        "coverage/",
        "test-results/",
        "playwright-report/",
        ".nyc_output/",
        "__pycache__/",
        ".pytest_cache/",
    ]
    
    for file_path in files:
        for pattern in test_output_patterns:
            if pattern in file_path:
                violations.append({
                    "type": "test_output_in_repo",
                    "file": file_path,
                    "reason": f"Test output file should be gitignored: {pattern}",
                    "severity": "medium",
                    "suggestion": "Add to .gitignore and remove from repository"
                })
                break
    
    return violations


def validate_file_organization(pr_num: str, repo_path: Path) -> Tuple[List[Dict], Dict]:
    """Validate file organization for PR."""
    all_violations = []
    
    # Get changed files
    files = get_changed_files(pr_num, repo_path)
    
    # Check root directory violations
    root_violations = check_root_directory_violations(files)
    all_violations.extend(root_violations)
    
    # Check documentation organization
    docs_violations = check_documentation_organization(files)
    all_violations.extend(docs_violations)
    
    # Check test outputs
    test_violations = check_test_outputs(files)
    all_violations.extend(test_violations)
    
    # Count by severity
    severity_counts = {
        "critical": len([v for v in all_violations if v["severity"] == "critical"]),
        "high": len([v for v in all_violations if v["severity"] == "high"]),
        "medium": len([v for v in all_violations if v["severity"] == "medium"]),
        "low": len([v for v in all_violations if v["severity"] == "low"]),
    }
    
    metadata = {
        "pr": pr_num,
        "files_checked": len(files),
        "violations_found": len(all_violations),
        "severity_counts": severity_counts,
        "validated_at": datetime.utcnow().isoformat() + "Z"
    }
    
    return all_violations, metadata


def generate_report(violations: List[Dict], metadata: Dict) -> str:
    """Generate validation report."""
    if not violations:
        return """# File Organization Validation

✅ **All files comply with file organization rules.**

No violations detected.
"""
    
    report = f"""# File Organization Validation Report

**PR:** #{metadata['pr']}
**Files Checked:** {metadata['files_checked']}
**Violations Found:** {metadata['violations_found']}

## Violations by Severity

- **Critical:** {metadata['severity_counts']['critical']}
- **High:** {metadata['severity_counts']['high']}
- **Medium:** {metadata['severity_counts']['medium']}
- **Low:** {metadata['severity_counts']['low']}

## Detailed Violations

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
    
    report += """
## Required Actions

1. Review each violation above
2. Move prohibited files to appropriate directories
3. Ensure documentation files are in `docs/` subdirectories
4. Add test outputs to `.gitignore` if not already present
5. Remove test outputs from repository

## Reference

See `.cursor/rules/file-organization.md` for complete file organization rules.
"""
    
    return report


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pr", required=True, help="PR number")
    parser.add_argument("--out", required=True, help="Output JSON path")
    args = parser.parse_args()
    
    repo_path = Path(__file__).resolve().parents[2]
    
    # Validate file organization
    violations, metadata = validate_file_organization(args.pr, repo_path)
    
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
        print(f"Found {len(violations)} file organization violation(s)", file=__import__("sys").stderr)
        # Exit with error if critical or high severity violations
        critical_high = [v for v in violations if v["severity"] in ["critical", "high"]]
        if critical_high:
            print(f"Found {len(critical_high)} critical/high severity violation(s)", file=__import__("sys").stderr)
            exit(1)
    else:
        print("File organization validation passed", file=__import__("sys").stderr)


if __name__ == "__main__":
    main()



