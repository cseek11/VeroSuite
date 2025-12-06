#!/usr/bin/env python3
"""
CLI entry point for PR creation.

Phase 3: PR Creator Implementation
Last Updated: 2025-12-04

Usage:
    python .cursor/scripts/create_pr_cli.py <session_id> [--force]
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

from veroscore_v3.pr_creator import PRCreator
from logger_util import get_logger

logger = get_logger(context="create_pr_cli")


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="Create PR for VeroScore V3 session"
    )
    parser.add_argument(
        "session_id",
        type=str,
        help="Session ID to create PR for"
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Force PR creation even if idempotency key exists"
    )
    parser.add_argument(
        "--repo-path",
        type=Path,
        default=project_root,
        help="Repository path (default: project root)"
    )
    
    args = parser.parse_args()
    
    try:
        # Initialize Supabase
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SECRET_KEY")
        
        if not supabase_url or not supabase_key:
            print("❌ Error: SUPABASE_URL and SUPABASE_SECRET_KEY environment variables required", file=sys.stderr)
            return 1
        
        supabase = create_client(supabase_url, supabase_key)
        
        # Create PR creator
        pr_creator = PRCreator(supabase, args.repo_path)
        
        # Create PR
        print(f"🚀 Creating PR for session: {args.session_id}")
        pr_result = pr_creator.create_pr(args.session_id, force=args.force)
        
        if pr_result:
            print(f"\n✅ PR created successfully!")
            print(f"   PR Number: {pr_result.get('pr_number', 'N/A')}")
            print(f"   PR URL: {pr_result.get('pr_url', 'N/A')}")
            return 0
        else:
            print(f"\n❌ Failed to create PR", file=sys.stderr)
            return 1
            
    except Exception as e:
        logger.error(
            "CLI execution failed",
            operation="main",
            error_code="CLI_EXECUTION_FAILED",
            root_cause=str(e),
            session_id=args.session_id
        )
        print(f"❌ Error: {e}", file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())



