#!/usr/bin/env python3
"""
Validate workflow trigger compliance per `.cursor/rules/ci-automation.md`.

Checks for:
- All workflows have `on:` sections
- `workflow_run` workflows exist in `.github/workflows/`
- Artifact names match between upload/download
- Trigger types are appropriate
- Workflow names match exactly (case-sensitive)
"""

import argparse
import json
import re
import subprocess
import sys
import yaml
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple

# Import structured logger
try:
    from logger_util import get_logger
    logger = get_logger(context="validate_workflow_triggers")
except ImportError:
    # Fallback if logger_util not available (should not happen)
    import logging
    logger = logging.getLogger("validate_workflow_triggers")


# Standard artifact names
STANDARD_ARTIFACTS = {
    "reward",
    "frontend-coverage",
    "backend-coverage",
    "pattern-suggestions",
    "anti-pattern-detection",
    "metrics-data",
}


def load_workflow_file(file_path: Path) -> Optional[Dict]:
    """Load and parse YAML workflow file."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    except Exception as e:
        logger.error(
            f"Error loading workflow file: {file_path}",
            operation="load_workflow_yaml",
            error=e,
            file_path=str(file_path)
        )
        return None


def get_workflow_name(workflow: Dict) -> Optional[str]:
    """Extract workflow name from YAML."""
    return workflow.get("name")


def get_workflow_triggers(workflow: Dict) -> Optional[Dict]:
    """Extract triggers from workflow YAML."""
    return workflow.get("on")


def check_has_on_section(workflow: Dict, file_path: Path) -> List[Dict]:
    """Check if workflow has `on:` section."""
    violations = []
    if "on" not in workflow:
        violations.append({
            "type": "missing_on_section",
            "file": str(file_path),
            "reason": "Workflow missing required `on:` section",
            "severity": "critical",
            "suggestion": "Add `on:` section with appropriate triggers"
        })
    return violations


def check_pr_trigger_types(workflow: Dict, file_path: Path) -> List[Dict]:
    """Check if PR workflows have correct trigger types."""
    violations = []
    triggers = get_workflow_triggers(workflow)
    
    if triggers and "pull_request" in triggers:
        pr_config = triggers["pull_request"]
        if isinstance(pr_config, dict):
            types = pr_config.get("types", [])
            required_types = {"opened", "synchronize", "reopened"}
            missing_types = required_types - set(types)
            
            if missing_types:
                violations.append({
                    "type": "missing_pr_trigger_types",
                    "file": str(file_path),
                    "reason": f"PR workflow missing trigger types: {', '.join(missing_types)}",
                    "severity": "high",
                    "suggestion": f"Add types: {list(required_types)} to pull_request trigger"
                })
    
    return violations


def get_workflow_run_dependencies(workflow: Dict) -> List[str]:
    """Extract workflow_run dependencies from workflow."""
    dependencies = []
    triggers = get_workflow_triggers(workflow)
    
    if triggers and "workflow_run" in triggers:
        workflow_run = triggers["workflow_run"]
        if isinstance(workflow_run, dict):
            workflows = workflow_run.get("workflows", [])
            if isinstance(workflows, list):
                dependencies.extend(workflows)
            elif isinstance(workflows, str):
                dependencies.append(workflows)
    
    return dependencies


def check_workflow_run_dependencies(
    workflow: Dict,
    file_path: Path,
    all_workflow_names: Dict[str, Path]
) -> List[Dict]:
    """Check if workflow_run dependencies exist."""
    violations = []
    dependencies = get_workflow_run_dependencies(workflow)
    
    for dep_name in dependencies:
        if dep_name not in all_workflow_names:
            violations.append({
                "type": "missing_workflow_dependency",
                "file": str(file_path),
                "reason": f"workflow_run references non-existent workflow: '{dep_name}'",
                "severity": "critical",
                "suggestion": f"Verify workflow name matches exactly (case-sensitive) or create workflow: {dep_name}"
            })
        else:
            # Check case sensitivity
            actual_name = all_workflow_names[dep_name]
            if dep_name != actual_name:
                violations.append({
                    "type": "workflow_name_case_mismatch",
                    "file": str(file_path),
                    "reason": f"workflow_run name '{dep_name}' case mismatch with actual '{actual_name}'",
                    "severity": "critical",
                    "suggestion": f"Update workflow_run to use exact name: '{actual_name}'"
                })
    
    return violations


def extract_artifact_names(workflow: Dict) -> Tuple[Set[str], Set[str]]:
    """Extract artifact names from upload and download steps."""
    upload_artifacts = set()
    download_artifacts = set()
    
    jobs = workflow.get("jobs", {})
    for job_name, job_config in jobs.items():
        steps = job_config.get("steps", [])
        for step in steps:
            uses = step.get("uses", "")
            with_config = step.get("with", {})
            
            if "upload-artifact" in uses:
                artifact_name = with_config.get("name")
                if artifact_name:
                    upload_artifacts.add(artifact_name)
            
            if "download-artifact" in uses:
                artifact_name = with_config.get("name")
                if artifact_name:
                    download_artifacts.add(artifact_name)
    
    return upload_artifacts, download_artifacts


def check_artifact_consistency(
    all_workflows: Dict[Path, Dict],
    all_workflow_names: Dict[str, Path]
) -> List[Dict]:
    """Check artifact name consistency across workflows."""
    violations = []
    
    # Build artifact usage map
    artifact_uploads: Dict[str, List[Path]] = {}
    artifact_downloads: Dict[str, List[Path]] = {}
    
    for file_path, workflow in all_workflows.items():
        uploads, downloads = extract_artifact_names(workflow)
        
        for artifact in uploads:
            if artifact not in artifact_uploads:
                artifact_uploads[artifact] = []
            artifact_uploads[artifact].append(file_path)
        
        for artifact in downloads:
            if artifact not in artifact_downloads:
                artifact_downloads[artifact] = []
            artifact_downloads[artifact].append(file_path)
    
    # Check for downloads without matching uploads
    for artifact, download_files in artifact_downloads.items():
        if artifact not in artifact_uploads:
            violations.append({
                "type": "artifact_download_without_upload",
                "file": str(download_files[0]),
                "reason": f"Artifact '{artifact}' is downloaded but never uploaded",
                "severity": "high",
                "suggestion": f"Verify artifact name matches upload step or add upload step for '{artifact}'"
            })
    
    # Check for kebab-case convention
    all_artifacts = set(artifact_uploads.keys()) | set(artifact_downloads.keys())
    for artifact in all_artifacts:
        if not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", artifact):
            violations.append({
                "type": "artifact_naming_convention",
                "file": "multiple",
                "reason": f"Artifact '{artifact}' does not follow kebab-case convention",
                "severity": "medium",
                "suggestion": f"Rename to kebab-case (lowercase with hyphens): {artifact.lower().replace('_', '-')}"
            })
    
    return violations


def validate_workflows(workflows_dir: Path) -> Tuple[List[Dict], Dict[str, Path]]:
    """Validate all workflows in directory."""
    violations = []
    all_workflows: Dict[Path, Dict] = {}
    all_workflow_names: Dict[str, Path] = {}
    
    # Load all workflow files
    workflow_files = list(workflows_dir.glob("*.yml")) + list(workflows_dir.glob("*.yaml"))
    
    for file_path in workflow_files:
        workflow = load_workflow_file(file_path)
        if workflow:
            all_workflows[file_path] = workflow
            workflow_name = get_workflow_name(workflow)
            if workflow_name:
                all_workflow_names[workflow_name] = file_path
    
    # Validate each workflow
    for file_path, workflow in all_workflows.items():
        # Check for on: section
        violations.extend(check_has_on_section(workflow, file_path))
        
        # Check PR trigger types
        violations.extend(check_pr_trigger_types(workflow, file_path))
        
        # Check workflow_run dependencies
        violations.extend(check_workflow_run_dependencies(workflow, file_path, all_workflow_names))
    
    # Check artifact consistency
    violations.extend(check_artifact_consistency(all_workflows, all_workflow_names))
    
    return violations, all_workflow_names


def main():
    """Main validation function."""
    parser = argparse.ArgumentParser(
        description="Validate workflow trigger compliance"
    )
    parser.add_argument(
        "--workflows-dir",
        type=Path,
        default=Path(".github/workflows"),
        help="Directory containing workflow files"
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output results as JSON"
    )
    parser.add_argument(
        "--exit-on-error",
        action="store_true",
        help="Exit with non-zero code on violations"
    )
    
    args = parser.parse_args()
    
    if not args.workflows_dir.exists():
        logger.error(
            f"Workflows directory not found: {args.workflows_dir}",
            operation="main",
            workflows_dir=str(args.workflows_dir)
        )
        print(f"Error: Workflows directory not found: {args.workflows_dir}", file=sys.stderr)
        sys.exit(1)
    
    violations, workflow_names = validate_workflows(args.workflows_dir)
    
    if args.json:
        output = {
            "violations": violations,
            "workflow_count": len(workflow_names),
            "violation_count": len(violations)
        }
        print(json.dumps(output, indent=2))
    else:
        if violations:
            print(f"❌ Found {len(violations)} violation(s):\n")
            for i, violation in enumerate(violations, 1):
                print(f"{i}. [{violation['severity'].upper()}] {violation['type']}")
                print(f"   File: {violation['file']}")
                print(f"   Reason: {violation['reason']}")
                print(f"   Suggestion: {violation['suggestion']}")
                print()
        else:
            print("✅ All workflows pass validation")
    
    if violations and args.exit_on_error:
        critical_violations = [v for v in violations if v["severity"] == "critical"]
        if critical_violations:
            sys.exit(1)
    
    sys.exit(0 if not violations else 0)


if __name__ == "__main__":
    main()

