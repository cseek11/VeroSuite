#!/usr/bin/env python3
"""
Check if PR scores were saved to Supabase database.

Usage:
    python .cursor/scripts/check_pr_scores.py --pr-numbers 370,371,372,373,374
    python .cursor/scripts/check_pr_scores.py --all-recent
"""

import os
import sys
import argparse
from datetime import datetime, timezone, timedelta
from pathlib import Path

# Add scripts directory to path
scripts_dir = Path(__file__).parent
if str(scripts_dir) not in sys.path:
    sys.path.insert(0, str(scripts_dir))

from logger_util import get_logger, get_or_create_trace_context
from supabase import create_client, Client

logger = get_logger(context="CheckPRScores")


def check_pr_scores(supabase: Client, pr_numbers: list[int] = None, all_recent: bool = False):
    """
    Check if PR scores exist in database.
    
    Args:
        supabase: Supabase client
        pr_numbers: List of PR numbers to check
        all_recent: If True, check all PRs from last 24 hours
    """
    trace_ctx = get_or_create_trace_context()
    
    try:
        # Build query
        query = supabase.schema('veroscore').table('pr_scores').select('*')
        
        if pr_numbers:
            query = query.in_('pr_number', pr_numbers)
        elif all_recent:
            # Get PRs from last 24 hours
            cutoff = (datetime.now(timezone.utc) - timedelta(hours=24)).isoformat()
            query = query.gte('created_at', cutoff)
        else:
            logger.error(
                "Must specify either --pr-numbers or --all-recent",
                operation="check_pr_scores",
                **trace_ctx
            )
            return
        
        # Execute query
        response = query.order('created_at', desc=True).execute()
        
        if not response.data:
            print("❌ No scores found in database")
            if pr_numbers:
                print(f"   Checked PRs: {pr_numbers}")
            return
        
        print(f"\n✅ Found {len(response.data)} score(s) in database:\n")
        print("=" * 100)
        
        for score in response.data:
            print(f"\nPR #{score['pr_number']} ({score['repository']})")
            print(f"  Session ID: {score.get('session_id', 'N/A')}")
            print(f"  Author: {score.get('author', 'N/A')}")
            print(f"  Stabilized Score: {score.get('stabilized_score', 0):.2f}/10")
            print(f"  Raw Score: {score.get('raw_score', 0):.2f}")
            print(f"  Decision: {score.get('decision', 'N/A')}")
            print(f"  Violations: {len(score.get('violations', []))}")
            print(f"  Warnings: {len(score.get('warnings', []))}")
            print(f"  Created: {score.get('created_at', 'N/A')}")
            print("-" * 100)
        
        # Check for missing PRs
        if pr_numbers:
            found_prs = {score['pr_number'] for score in response.data}
            missing_prs = set(pr_numbers) - found_prs
            if missing_prs:
                print(f"\n⚠️  Missing scores for PRs: {sorted(missing_prs)}")
                print("   These PRs were scored but scores were not persisted to database.")
        
    except Exception as e:
        logger.error(
            "Failed to check PR scores",
            operation="check_pr_scores",
            error_code="QUERY_FAILED",
            root_cause=str(e),
            **trace_ctx
        )
        print(f"❌ Error querying database: {e}")
        sys.exit(1)


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(description="Check if PR scores were saved to database")
    parser.add_argument("--pr-numbers", type=str, help="Comma-separated list of PR numbers (e.g., 370,371,372)")
    parser.add_argument("--all-recent", action="store_true", help="Check all PRs from last 24 hours")
    
    args = parser.parse_args()
    
    # Parse PR numbers
    pr_numbers = None
    if args.pr_numbers:
        try:
            pr_numbers = [int(n.strip()) for n in args.pr_numbers.split(',')]
        except ValueError:
            print("❌ Invalid PR numbers format. Use comma-separated integers (e.g., 370,371,372)")
            sys.exit(1)
    
    # Initialize Supabase
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SECRET_KEY")
    
    if not supabase_url or not supabase_key:
        print("❌ Missing Supabase credentials")
        print("   Set SUPABASE_URL and SUPABASE_SECRET_KEY environment variables")
        sys.exit(1)
    
    supabase = create_client(supabase_url, supabase_key)
    
    # Check scores
    check_pr_scores(supabase, pr_numbers, args.all_recent)


if __name__ == "__main__":
    main()

