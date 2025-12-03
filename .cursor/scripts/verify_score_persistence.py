#!/usr/bin/env python3
"""
Verify that a PR score was successfully persisted to the database.

Usage:
    python .cursor/scripts/verify_score_persistence.py --pr-number 374 --repository owner/repo
"""

import os
import sys
import argparse
from pathlib import Path

# Add scripts directory to path
scripts_dir = Path(__file__).parent
if str(scripts_dir) not in sys.path:
    sys.path.insert(0, str(scripts_dir))

from logger_util import get_logger, get_or_create_trace_context
from supabase import create_client, Client

logger = get_logger(context="VerifyScorePersistence")


def verify_score_persistence(supabase: Client, pr_number: int, repository: str) -> bool:
    """
    Verify that a PR score exists in the database.
    
    Args:
        supabase: Supabase client
        pr_number: PR number to check
        repository: Repository name (owner/repo)
        
    Returns:
        True if score exists, False otherwise
    """
    trace_ctx = get_or_create_trace_context()
    
    try:
        # Query for score
        response = supabase.schema('veroscore').table('pr_scores').select('*').eq('pr_number', pr_number).eq('repository', repository).order('created_at', desc=True).limit(1).execute()
        
        if not response.data or len(response.data) == 0:
            logger.error(
                "Score not found in database",
                operation="verify_score_persistence",
                pr_number=pr_number,
                repository=repository,
                **trace_ctx
            )
            print(f"❌ Score for PR #{pr_number} not found in database")
            return False
        
        score = response.data[0]
        logger.info(
            "Score verified in database",
            operation="verify_score_persistence",
            pr_number=pr_number,
            repository=repository,
            score_id=score.get('id'),
            stabilized_score=score.get('stabilized_score'),
            **trace_ctx
        )
        
        print(f"✅ Score verified for PR #{pr_number}")
        print(f"   Score ID: {score.get('id')}")
        print(f"   Stabilized Score: {score.get('stabilized_score', 0):.2f}/10")
        print(f"   Decision: {score.get('decision', 'N/A')}")
        print(f"   Created: {score.get('created_at', 'N/A')}")
        
        return True
        
    except Exception as e:
        logger.error(
            "Failed to verify score persistence",
            operation="verify_score_persistence",
            pr_number=pr_number,
            repository=repository,
            error_code="VERIFY_FAILED",
            root_cause=str(e),
            **trace_ctx
        )
        print(f"❌ Error verifying score: {e}")
        return False


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(description="Verify PR score was persisted to database")
    parser.add_argument("--pr-number", type=int, required=True, help="PR number")
    parser.add_argument("--repository", type=str, required=True, help="Repository (owner/repo)")
    
    args = parser.parse_args()
    
    # Initialize Supabase
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SECRET_KEY")
    
    if not supabase_url or not supabase_key:
        print("❌ Missing Supabase credentials")
        print("   Set SUPABASE_URL and SUPABASE_SECRET_KEY environment variables")
        sys.exit(1)
    
    supabase = create_client(supabase_url, supabase_key)
    
    # Verify score
    success = verify_score_persistence(supabase, args.pr_number, args.repository)
    
    if not success:
        sys.exit(1)
    
    sys.exit(0)


if __name__ == "__main__":
    main()



