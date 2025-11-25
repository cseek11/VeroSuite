#!/usr/bin/env python3
"""
Test Phase 6 PR Creation - Creates a test PR with Phase 6 files and monitors workflow.

Usage:
    python .cursor/scripts/test_phase6_pr.py
"""

import os
import sys
import time
import subprocess
from pathlib import Path
from datetime import datetime, timezone

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from supabase import create_client, Client
except ImportError:
    print("❌ Missing supabase-py package. Install with: pip install supabase", file=sys.stderr)
    sys.exit(1)

from veroscore_v3.pr_creator import PRCreator
from veroscore_v3.session_manager import SessionManager
from veroscore_v3.file_change import FileChange
from logger_util import get_logger

logger = get_logger(context="test_phase6_pr")


def create_test_session():
    """Create a test session with Phase 6 files."""
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SECRET_KEY")
    
    if not supabase_url or not supabase_key:
        print("❌ Error: SUPABASE_URL and SUPABASE_SECRET_KEY environment variables required", file=sys.stderr)
        sys.exit(1)
    
    supabase = create_client(supabase_url, supabase_key)
    session_manager = SessionManager(supabase)
    
    # Create session
    author = "test-user"
    session_id = session_manager.get_or_create_session(author=author)
    print(f"✅ Created session: {session_id}")
    
    # Add Phase 6 files to session
    phase6_files = [
        ".github/workflows/verofield_auto_pr.yml",
        ".github/scripts/extract_context.py",
        ".github/scripts/score_pr.py",
        ".github/scripts/enforce_decision.py",
        ".github/scripts/update_session.py",
        "docs/Auto-PR/PHASE6_IMPLEMENTATION_SUMMARY.md",
        "docs/Auto-PR/PHASE6_POST_IMPLEMENTATION_AUDIT.md",
    ]
    
    changes = []
    for file_path in phase6_files:
        full_path = project_root / file_path
        if full_path.exists():
            # Read file content
            content = full_path.read_text(encoding='utf-8')
            
            # Create file change
            change = FileChange(
                path=file_path,
                change_type="added" if file_path not in [".github/workflows/verofield_auto_pr.yml"] else "modified",
                timestamp=datetime.now(timezone.utc).isoformat(),
                lines_added=len(content.split('\n')),
                lines_removed=0
            )
            changes.append(change)
            print(f"  ✅ Prepared {file_path} for session")
        else:
            print(f"  ⚠️  File not found: {file_path}")
    
    # Add all changes in batch
    if changes:
        session_manager.add_changes_batch(session_id, changes)
        print(f"  ✅ Added {len(changes)} files to session")
    
    return session_id, supabase


def create_pr(session_id, supabase):
    """Create PR for session."""
    pr_creator = PRCreator(supabase, project_root)
    
    print(f"\n🚀 Creating PR for session: {session_id}")
    pr_result = pr_creator.create_pr(session_id, force=False)
    
    if pr_result:
        pr_number = pr_result.get('pr_number')
        pr_url = pr_result.get('pr_url')
        print(f"\n✅ PR created successfully!")
        print(f"   PR Number: {pr_number}")
        print(f"   PR URL: {pr_url}")
        return pr_number, pr_url
    else:
        print(f"\n❌ Failed to create PR", file=sys.stderr)
        return None, None


def monitor_workflow(pr_number, max_wait=300):
    """Monitor workflow execution for PR."""
    print(f"\n📊 Monitoring workflow for PR #{pr_number}...")
    print(f"   Waiting up to {max_wait} seconds...")
    
    start_time = time.time()
    last_status = None
    
    while time.time() - start_time < max_wait:
        try:
            # Get workflow runs for this PR
            result = subprocess.run(
                ["gh", "run", "list", "--workflow=verofield_auto_pr.yml", "--limit", "5"],
                capture_output=True,
                text=True,
                check=True
            )
            
            # Check if any run is for this PR
            lines = result.stdout.strip().split('\n')
            for line in lines[1:]:  # Skip header
                if str(pr_number) in line or f"#{pr_number}" in line:
                    parts = line.split()
                    if len(parts) >= 3:
                        run_id = parts[0]
                        status = parts[1]
                        conclusion = parts[2] if len(parts) > 2 else "in_progress"
                        
                        if status != last_status or conclusion != "in_progress":
                            print(f"   [{time.strftime('%H:%M:%S')}] Run {run_id}: {status} - {conclusion}")
                            last_status = status
                            
                            if conclusion != "in_progress" and conclusion != "queued":
                                print(f"\n✅ Workflow completed: {conclusion}")
                                return conclusion
            
            time.sleep(10)  # Check every 10 seconds
            
        except subprocess.CalledProcessError as e:
            print(f"   ⚠️  Error checking workflow: {e.stderr}")
            time.sleep(10)
        except Exception as e:
            print(f"   ⚠️  Error: {e}")
            time.sleep(10)
    
    print(f"\n⏱️  Timeout reached ({max_wait}s)")
    return None


def check_pr_comments(pr_number):
    """Check PR comments for VeroScore results."""
    print(f"\n💬 Checking PR comments for PR #{pr_number}...")
    
    try:
        result = subprocess.run(
            ["gh", "pr", "view", str(pr_number), "--json", "comments"],
            capture_output=True,
            text=True,
            check=True
        )
        
        import json
        pr_data = json.loads(result.stdout)
        comments = pr_data.get("comments", [])
        
        for comment in comments:
            body = comment.get("body", "")
            if "VeroScore" in body or "Auto-BLOCK" in body or "Auto-APPROVE" in body or "Review Required" in body:
                print(f"\n📝 Found VeroScore comment:")
                print(f"   {body[:200]}...")
                return body
        
        print("   No VeroScore comments found yet")
        return None
        
    except Exception as e:
        print(f"   ⚠️  Error checking comments: {e}")
        return None


def main():
    """Main execution."""
    print("=" * 60)
    print("Phase 6 PR Test - Creating PR and Monitoring Workflow")
    print("=" * 60)
    
    # Create session
    session_id, supabase = create_test_session()
    
    # Create PR
    pr_number, pr_url = create_pr(session_id, supabase)
    
    if not pr_number:
        print("\n❌ Failed to create PR. Exiting.")
        sys.exit(1)
    
    # Monitor workflow
    conclusion = monitor_workflow(pr_number, max_wait=300)
    
    # Check PR comments
    comment = check_pr_comments(pr_number)
    
    # Summary
    print("\n" + "=" * 60)
    print("Summary")
    print("=" * 60)
    print(f"Session ID: {session_id}")
    print(f"PR Number: {pr_number}")
    print(f"PR URL: {pr_url}")
    print(f"Workflow Conclusion: {conclusion or 'Timeout'}")
    print(f"VeroScore Comment: {'Found' if comment else 'Not found'}")
    print("\n✅ Test complete!")


if __name__ == '__main__':
    main()

