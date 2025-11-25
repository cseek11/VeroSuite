#!/usr/bin/env python3
"""
CLI script for scoring PRs in GitHub Actions workflow.

Usage:
    python .github/scripts/score_pr.py --pr-number <PR_NUMBER> --session-id <SESSION_ID>
"""

import os
import sys
import argparse
from pathlib import Path

# Add scripts directory to path
# Priority: Use PYTHONPATH if set, otherwise calculate from file location
import os
scripts_dir_str = None

# Check PYTHONPATH first (set by GitHub Actions)
if "PYTHONPATH" in os.environ:
    pythonpath_dirs = os.environ["PYTHONPATH"].split(os.pathsep)
    for dir_path in pythonpath_dirs:
        if ".cursor/scripts" in dir_path or "veroscore_v3" in dir_path:
            scripts_dir_str = dir_path
            break

# Fallback: Calculate from file location
if not scripts_dir_str:
    scripts_dir = Path(__file__).parent.parent.parent / ".cursor" / "scripts"
    scripts_dir_str = str(scripts_dir.resolve() if scripts_dir.exists() else scripts_dir)

# Add to sys.path if not already there
if scripts_dir_str and scripts_dir_str not in sys.path:
    sys.path.insert(0, scripts_dir_str)

# Debug: Print path for troubleshooting
if os.getenv("DEBUG_PYTHON_PATH"):
    print(f"DEBUG: Python path: {sys.path[:3]}")  # First 3 entries
    print(f"DEBUG: Scripts dir: {scripts_dir_str}")
    print(f"DEBUG: Scripts dir exists: {Path(scripts_dir_str).exists() if scripts_dir_str else False}")
    print(f"DEBUG: PYTHONPATH: {os.environ.get('PYTHONPATH', 'not set')}")

from veroscore_v3.scoring_engine import HybridScoringEngine
from veroscore_v3.detection_functions import MasterDetector
from logger_util import get_logger, get_or_create_trace_context

logger = get_logger(context="ScorePRCLI")


def get_changed_files(pr_number: int) -> List[str]:
    """
    Get list of changed files from PR.
    
    Args:
        pr_number: PR number
        
    Returns:
        List of file paths
    """
    import subprocess
    
    try:
        # Get changed files using GitHub CLI
        result = subprocess.run(
            ["gh", "pr", "view", str(pr_number), "--json", "files", "--jq", ".files[].path"],
            capture_output=True,
            text=True,
            check=True
        )
        
        files = [f.strip() for f in result.stdout.split("\n") if f.strip()]
        return files
        
    except subprocess.CalledProcessError as e:
        logger.error(
            "Failed to get changed files",
            operation="get_changed_files",
            pr_number=pr_number,
            root_cause=str(e),
            **get_or_create_trace_context()
        )
        return []
    except FileNotFoundError:
        logger.error(
            "GitHub CLI not found",
            operation="get_changed_files",
            pr_number=pr_number,
            root_cause="gh command not available",
            **get_or_create_trace_context()
        )
        return []


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(description="Score PR using VeroScore V3")
    parser.add_argument("--pr-number", type=int, required=True, help="PR number")
    parser.add_argument("--session-id", type=str, required=True, help="Session ID")
    parser.add_argument("--repository", type=str, default=None, help="Repository (default: from GITHUB_REPOSITORY)")
    parser.add_argument("--author", type=str, default=None, help="Author (default: from PR)")
    
    args = parser.parse_args()
    
    trace_ctx = get_or_create_trace_context()
    
    # Get repository from environment
    repository = args.repository or os.getenv("GITHUB_REPOSITORY", "unknown/unknown")
    
    # Get changed files
    logger.info(
        "Getting changed files from PR",
        operation="main",
        pr_number=args.pr_number,
        **trace_ctx
    )
    
    changed_files = get_changed_files(args.pr_number)
    
    if not changed_files:
        logger.error(
            "No changed files found",
            operation="main",
            pr_number=args.pr_number,
            **trace_ctx
        )
        sys.exit(1)
    
    # Filter to only files that exist in workspace
    workspace_root = Path.cwd()
    existing_files = []
    for file_path in changed_files:
        full_path = workspace_root / file_path
        if full_path.exists() and full_path.is_file():
            existing_files.append(str(full_path))
    
    if not existing_files:
        logger.warn(
            "No existing files found in workspace",
            operation="main",
            pr_number=args.pr_number,
            changed_files_count=len(changed_files),
            **trace_ctx
        )
        sys.exit(0)
    
    # Run detection
    logger.info(
        "Running detection functions",
        operation="main",
        pr_number=args.pr_number,
        files_count=len(existing_files),
        **trace_ctx
    )
    
    detector = MasterDetector()
    detection_result = detector.detect_all(existing_files)
    
    # Run scoring
    logger.info(
        "Running scoring engine",
        operation="main",
        pr_number=args.pr_number,
        violations_count=len(detection_result.get("violations", [])),
        **trace_ctx
    )
    
    engine = HybridScoringEngine()
    
    # Get PR description for pipeline compliance check
    pr_description = ""
    try:
        import subprocess
        result = subprocess.run(
            ["gh", "pr", "view", str(args.pr_number), "--json", "body", "--jq", ".body"],
            capture_output=True,
            text=True,
            check=True
        )
        pr_description = result.stdout.strip()
    except Exception as e:
        logger.warn(
            "Failed to get PR description",
            operation="main",
            pr_number=args.pr_number,
            root_cause=str(e),
            **trace_ctx
        )
    
    # Score PR
    result = engine.score_pr(
        pr_number=args.pr_number,
        repository=repository,
        session_id=args.session_id,
        file_paths=existing_files,
        violations=detection_result.get("violations", []),
        warnings=detection_result.get("warnings", []),
        pr_description=pr_description,
        author=args.author
    )
    
    if not result:
        logger.error(
            "Scoring failed",
            operation="main",
            pr_number=args.pr_number,
            **trace_ctx
        )
        sys.exit(1)
    
    # Output results
    print(f"VEROSCORE={result.stabilized_score:.2f}")
    print(f"DECISION={result.decision}")
    print(f"RAW_SCORE={result.raw_score:.2f}")
    print(f"VIOLATIONS={len(detection_result.get('violations', []))}")
    print(f"WARNINGS={len(detection_result.get('warnings', []))}")
    
    logger.info(
        "Scoring completed",
        operation="main",
        pr_number=args.pr_number,
        stabilized_score=result.stabilized_score,
        decision=result.decision,
        **trace_ctx
    )
    
    sys.exit(0)


if __name__ == "__main__":
    main()

