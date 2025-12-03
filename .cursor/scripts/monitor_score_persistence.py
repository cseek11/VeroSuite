#!/usr/bin/env python3
"""
Monitor score persistence - detect PRs that were scored but scores weren't saved.

Usage:
    python .cursor/scripts/monitor_score_persistence.py --check-last-24h
    python .cursor/scripts/monitor_score_persistence.py --pr-numbers 370,371,372,373,374
"""

import os
import sys
import argparse
import subprocess
from datetime import datetime, timezone, timedelta
from pathlib import Path

# Add scripts directory to path
scripts_dir = Path(__file__).parent
if str(scripts_dir) not in sys.path:
    sys.path.insert(0, str(scripts_dir))

from logger_util import get_logger, get_or_create_trace_context
from supabase import create_client, Client

logger = get_logger(context="MonitorScorePersistence")


def get_prs_with_veroscore_comments(repository: str, since: datetime = None) -> list[dict]:
    """
    Get PRs that have VeroScore comments (indicating they were scored).
    
    Args:
        repository: Repository name (owner/repo)
        since: Only check PRs updated since this time
        
    Returns:
        List of PR numbers with VeroScore comments
    """
    trace_ctx = get_or_create_trace_context()
    
    try:
        # Get PRs using GitHub CLI
        cmd = ["gh", "pr", "list", "--repo", repository, "--json", "number,comments,updatedAt"]
        if since:
            # Get PRs updated since the specified time
            since_str = since.strftime("%Y-%m-%dT%H:%M:%SZ")
            cmd.extend(["--search", f"updated:>={since_str}"])
        
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        prs = eval(result.stdout) if result.stdout else []
        
        # Filter PRs with VeroScore comments
        scored_prs = []
        for pr in prs:
            comments = pr.get('comments', [])
            for comment in comments:
                body = comment.get('body', '')
                if 'VeroScore' in body or 'Auto-BLOCK' in body or 'Auto-APPROVE' in body or 'Review Required' in body:
                    scored_prs.append({
                        'number': pr['number'],
                        'updated_at': pr.get('updatedAt'),
                        'comment_date': comment.get('createdAt')
                    })
                    break
        
        logger.info(
            f"Found {len(scored_prs)} PRs with VeroScore comments",
            operation="get_prs_with_veroscore_comments",
            repository=repository,
            **trace_ctx
        )
        
        return scored_prs
        
    except Exception as e:
        logger.error(
            "Failed to get PRs with VeroScore comments",
            operation="get_prs_with_veroscore_comments",
            repository=repository,
            error_code="GH_CLI_FAILED",
            root_cause=str(e),
            **trace_ctx
        )
        return []


def check_missing_scores(supabase: Client, repository: str, pr_numbers: list[int] = None, check_last_24h: bool = False):
    """
    Check for PRs that were scored but scores weren't persisted.
    
    Args:
        supabase: Supabase client
        repository: Repository name
        pr_numbers: Specific PR numbers to check
        check_last_24h: Check PRs from last 24 hours
    """
    trace_ctx = get_or_create_trace_context()
    
    # Get PRs that were scored
    if check_last_24h:
        since = datetime.now(timezone.utc) - timedelta(hours=24)
        scored_prs = get_prs_with_veroscore_comments(repository, since)
        pr_numbers = [pr['number'] for pr in scored_prs]
    elif not pr_numbers:
        scored_prs = get_prs_with_veroscore_comments(repository)
        pr_numbers = [pr['number'] for pr in scored_prs]
    else:
        scored_prs = [{'number': n} for n in pr_numbers]
    
    if not pr_numbers:
        print("✅ No PRs to check")
        return
    
    print(f"\n🔍 Checking {len(pr_numbers)} PR(s) for missing scores...\n")
    
    # Get scores from database
    try:
        response = supabase.schema('veroscore').table('pr_scores').select('pr_number').eq('repository', repository).in_('pr_number', pr_numbers).execute()
        scored_pr_numbers = {score['pr_number'] for score in response.data}
    except Exception as e:
        logger.error(
            "Failed to query database",
            operation="check_missing_scores",
            error_code="QUERY_FAILED",
            root_cause=str(e),
            **trace_ctx
        )
        print(f"❌ Error querying database: {e}")
        return
    
    # Find missing scores
    missing_scores = set(pr_numbers) - scored_pr_numbers
    
    if missing_scores:
        print(f"⚠️  Found {len(missing_scores)} PR(s) with missing scores:\n")
        for pr_num in sorted(missing_scores):
            pr_info = next((p for p in scored_prs if p['number'] == pr_num), {})
            print(f"  PR #{pr_num}")
            if pr_info.get('comment_date'):
                print(f"    Commented: {pr_info['comment_date']}")
            print(f"    URL: https://github.com/{repository}/pull/{pr_num}")
            print()
        
        print(f"\n❌ Total missing scores: {len(missing_scores)}/{len(pr_numbers)}")
        return len(missing_scores)
    else:
        print(f"✅ All {len(pr_numbers)} PR(s) have scores in database")
        return 0


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(description="Monitor score persistence")
    parser.add_argument("--pr-numbers", type=str, help="Comma-separated list of PR numbers")
    parser.add_argument("--check-last-24h", action="store_true", help="Check PRs from last 24 hours")
    parser.add_argument("--repository", type=str, default=None, help="Repository (owner/repo), defaults to current repo")
    parser.add_argument("--alert-on-failures", action="store_true", help="Exit with error code if failures found")
    
    args = parser.parse_args()
    
    # Get repository
    repository = args.repository
    if not repository:
        try:
            result = subprocess.run(["gh", "repo", "view", "--json", "nameWithOwner"], capture_output=True, text=True, check=True)
            repo_data = eval(result.stdout)
            repository = repo_data['nameWithOwner']
        except Exception:
            print("❌ Could not determine repository. Use --repository flag")
            sys.exit(1)
    
    # Parse PR numbers
    pr_numbers = None
    if args.pr_numbers:
        try:
            pr_numbers = [int(n.strip()) for n in args.pr_numbers.split(',')]
        except ValueError:
            print("❌ Invalid PR numbers format")
            sys.exit(1)
    
    # Initialize Supabase
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SECRET_KEY")
    
    if not supabase_url or not supabase_key:
        print("❌ Missing Supabase credentials")
        sys.exit(1)
    
    supabase = create_client(supabase_url, supabase_key)
    
    # Check for missing scores
    missing_count = check_missing_scores(supabase, repository, pr_numbers, args.check_last_24h)
    
    if args.alert_on_failures and missing_count > 0:
        sys.exit(1)
    
    sys.exit(0)


if __name__ == "__main__":
    main()



