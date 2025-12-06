#!/usr/bin/env python3
"""
Check PR Score for a given PR number or session ID.

Usage:
    python .cursor/scripts/check_pr_score.py --pr-number 368
    python .cursor/scripts/check_pr_score.py --session-id session-234438a4c6e4
"""

import os
import sys
import argparse
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from supabase import create_client, Client
except ImportError:
    print("❌ Missing supabase-py package. Install with: pip install supabase", file=sys.stderr)
    sys.exit(1)

from logger_util import get_logger

logger = get_logger(context="check_pr_score")


def get_pr_score_by_number(supabase: Client, pr_number: int, repository: str = "cseek11/VeroSuite"):
    """Get PR score by PR number."""
    try:
        result = (
            supabase.schema("veroscore")
            .table("pr_scores")
            .select("*")
            .eq("pr_number", pr_number)
            .eq("repository", repository)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )
        
        if result.data and len(result.data) > 0:
            return result.data[0]
        return None
        
    except Exception as e:
        logger.error(
            "Failed to get PR score",
            operation="get_pr_score_by_number",
            error_code="PR_SCORE_QUERY_FAILED",
            root_cause=str(e),
            pr_number=pr_number
        )
        return None


def get_pr_score_by_session(supabase: Client, session_id: str):
    """Get PR score by session ID."""
    try:
        result = (
            supabase.schema("veroscore")
            .table("pr_scores")
            .select("*")
            .eq("session_id", session_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )
        
        if result.data and len(result.data) > 0:
            return result.data[0]
        return None
        
    except Exception as e:
        logger.error(
            "Failed to get PR score by session",
            operation="get_pr_score_by_session",
            error_code="PR_SCORE_QUERY_FAILED",
            root_cause=str(e),
            session_id=session_id
        )
        return None


def format_score(score_data: dict):
    """Format score data for display."""
    if not score_data:
        return "No score found"
    
    output = []
    output.append("=" * 60)
    output.append("PR Score Details")
    output.append("=" * 60)
    output.append(f"PR Number: {score_data.get('pr_number', 'N/A')}")
    output.append(f"Repository: {score_data.get('repository', 'N/A')}")
    output.append(f"Session ID: {score_data.get('session_id', 'N/A')}")
    output.append(f"Author: {score_data.get('author', 'N/A')}")
    output.append("")
    
    output.append("Category Scores:")
    output.append(f"  Code Quality: {score_data.get('code_quality', 0)}")
    output.append(f"  Test Coverage: {score_data.get('test_coverage', 0)}")
    output.append(f"  Documentation: {score_data.get('documentation', 0)}")
    output.append(f"  Architecture: {score_data.get('architecture', 0)}")
    output.append(f"  Security: {score_data.get('security', 0)}")
    output.append(f"  Rule Compliance: {score_data.get('rule_compliance', 0)}")
    output.append("")
    
    output.append("Final Scores:")
    output.append(f"  Raw Score: {score_data.get('raw_score', 0)}")
    output.append(f"  Stabilized Score: {score_data.get('stabilized_score', 0)}")
    output.append(f"  Reward Score: {score_data.get('reward_score', 'N/A')}")
    output.append("")
    
    output.append("Pipeline:")
    output.append(f"  Pipeline Complete: {score_data.get('pipeline_complete', False)}")
    output.append(f"  Pipeline Bonus: {score_data.get('pipeline_bonus', 0)}")
    output.append("")
    
    output.append("Decision:")
    output.append(f"  Decision: {score_data.get('decision', 'N/A')}")
    output.append(f"  Decision Reason: {score_data.get('decision_reason', 'N/A')}")
    output.append("")
    
    violations = score_data.get('violations', [])
    warnings = score_data.get('warnings', [])
    output.append(f"Violations: {len(violations) if isinstance(violations, list) else 0}")
    output.append(f"Warnings: {len(warnings) if isinstance(warnings, list) else 0}")
    output.append("")
    
    output.append(f"Created At: {score_data.get('created_at', 'N/A')}")
    output.append("=" * 60)
    
    return "\n".join(output)


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description="Check PR score")
    parser.add_argument("--pr-number", type=int, help="PR number to check")
    parser.add_argument("--session-id", type=str, help="Session ID to check")
    parser.add_argument("--repository", type=str, default="cseek11/VeroSuite", help="Repository name")
    
    args = parser.parse_args()
    
    if not args.pr_number and not args.session_id:
        print("❌ Error: Must provide either --pr-number or --session-id", file=sys.stderr)
        return 1
    
    # Initialize Supabase
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SECRET_KEY")
    
    if not supabase_url or not supabase_key:
        print("❌ Error: SUPABASE_URL and SUPABASE_SECRET_KEY environment variables required", file=sys.stderr)
        return 1
    
    supabase = create_client(supabase_url, supabase_key)
    
    # Get score
    score_data = None
    if args.pr_number:
        print(f"🔍 Checking score for PR #{args.pr_number}...")
        score_data = get_pr_score_by_number(supabase, args.pr_number, args.repository)
    elif args.session_id:
        print(f"🔍 Checking score for session {args.session_id}...")
        score_data = get_pr_score_by_session(supabase, args.session_id)
    
    # Display results
    if score_data:
        print(format_score(score_data))
        return 0
    else:
        print("\n⚠️  No score found for this PR/session.")
        print("   This could mean:")
        print("   - Scoring hasn't been run yet (Phase 5 not implemented)")
        print("   - PR was just created and scoring is pending")
        print("   - Score hasn't been computed yet")
        return 0


if __name__ == '__main__':
    sys.exit(main())



