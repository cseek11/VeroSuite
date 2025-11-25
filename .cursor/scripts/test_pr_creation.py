#!/usr/bin/env python3
"""
Test PR Creation Script - Creates a test PR and logs any errors.

Phase 3: PR Creator Testing
Last Updated: 2025-11-24

Usage:
    python .cursor/scripts/test_pr_creation.py
"""

import os
import sys
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

logger = get_logger(context="test_pr_creation")

# Error log file
ERROR_LOG_FILE = project_root / ".cursor" / "scripts" / "test_pr_errors.log"


def log_error(error_type: str, error_message: str, details: dict = None):
    """Log error to file and console."""
    timestamp = datetime.now(timezone.utc).isoformat()
    error_entry = {
        "timestamp": timestamp,
        "error_type": error_type,
        "error_message": error_message,
        "details": details or {}
    }
    
    # Log to file
    try:
        with open(ERROR_LOG_FILE, 'a', encoding='utf-8') as f:
            import json
            f.write(json.dumps(error_entry) + '\n')
    except Exception as e:
        print(f"⚠️  Failed to write to error log: {e}", file=sys.stderr)
    
    # Log to console
    print(f"❌ [{error_type}] {error_message}", file=sys.stderr)
    if details:
        print(f"   Details: {details}", file=sys.stderr)
    
    # Log via structured logger
    logger.error(
        error_message,
        operation="test_pr_creation",
        error_code=error_type,
        root_cause=error_message,
        **details or {}
    )


def check_prerequisites():
    """Check if all prerequisites are met."""
    errors = []
    
    # Check environment variables
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SECRET_KEY")
    github_token = os.getenv("AUTO_PR_PAT") or os.getenv("GITHUB_TOKEN")
    
    if not supabase_url:
        errors.append("SUPABASE_URL environment variable not set")
    if not supabase_key:
        errors.append("SUPABASE_SECRET_KEY environment variable not set")
    if not github_token:
        errors.append("AUTO_PR_PAT or GITHUB_TOKEN environment variable not set")
    
    # Check GitHub CLI
    import shutil
    if not shutil.which("gh"):
        errors.append("GitHub CLI (gh) not found in PATH")
    
    # Check Git
    if not shutil.which("git"):
        errors.append("Git not found in PATH")
    
    # Check if we're in a git repository
    try:
        import subprocess
        result = subprocess.run(
            ['git', 'rev-parse', '--git-dir'],
            capture_output=True,
            timeout=5
        )
        if result.returncode != 0:
            errors.append("Not in a git repository")
    except Exception as e:
        errors.append(f"Git check failed: {e}")
    
    return errors


def create_test_session(supabase: Client) -> str:
    """Create a test session with sample changes."""
    try:
        session_manager = SessionManager(supabase)
        
        # Create session
        author = "test-user"
        session_id = session_manager.get_or_create_session(author=author)
        print(f"✅ Created test session: {session_id}")
        
        # Create test file changes
        now = datetime.now(timezone.utc).isoformat()
        test_changes = [
            FileChange(
                path=".cursor/scripts/test_file_1.py",
                change_type="added",
                timestamp=now,
                lines_added=10,
                lines_removed=0
            ),
            FileChange(
                path=".cursor/scripts/test_file_2.py",
                change_type="added",
                timestamp=now,
                lines_added=15,
                lines_removed=0
            ),
            FileChange(
                path=".cursor/scripts/test_file_3.py",
                change_type="modified",
                timestamp=now,
                lines_added=5,
                lines_removed=3
            )
        ]
        
        # Add changes to session
        session_manager.add_changes_batch(session_id, test_changes)
        print(f"✅ Added {len(test_changes)} test changes to session")
        
        return session_id
        
    except Exception as e:
        log_error("SESSION_CREATION_FAILED", str(e), {"context": "create_test_session"})
        raise


def create_test_files():
    """Create test files for the PR."""
    try:
        test_dir = project_root / ".cursor" / "scripts"
        test_dir.mkdir(parents=True, exist_ok=True)
        
        # Create test file 1
        test_file_1 = test_dir / "test_file_1.py"
        test_file_1.write_text("""#!/usr/bin/env python3
\"\"\"Test file 1 for PR creation.\"\"\"

def test_function_1():
    return "test 1"

if __name__ == '__main__':
    print(test_function_1())
""")
        
        # Create test file 2
        test_file_2 = test_dir / "test_file_2.py"
        test_file_2.write_text("""#!/usr/bin/env python3
\"\"\"Test file 2 for PR creation.\"\"\"

def test_function_2():
    return "test 2"

if __name__ == '__main__':
    print(test_function_2())
""")
        
        # Create test file 3
        test_file_3 = test_dir / "test_file_3.py"
        if test_file_3.exists():
            # Modify existing file
            content = test_file_3.read_text()
            content += "\n# Modified for test PR\n"
            test_file_3.write_text(content)
        else:
            test_file_3.write_text("""#!/usr/bin/env python3
\"\"\"Test file 3 for PR creation.\"\"\"

def test_function_3():
    return "test 3"
""")
        
        print(f"✅ Created test files in {test_dir}")
        return True
        
    except Exception as e:
        log_error("TEST_FILE_CREATION_FAILED", str(e), {"operation": "create_test_files"})
        return False


def main():
    """Main test execution."""
    print("=" * 60)
    print("VeroScore V3 - Test PR Creation")
    print("=" * 60)
    print()
    
    # Clear error log
    if ERROR_LOG_FILE.exists():
        ERROR_LOG_FILE.unlink()
        print("✅ Cleared previous error log")
    
    # Check prerequisites
    print("📋 Checking prerequisites...")
    errors = check_prerequisites()
    if errors:
        print("\n❌ Prerequisites not met:")
        for error in errors:
            log_error("PREREQUISITE_CHECK_FAILED", error)
        return 1
    print("✅ All prerequisites met")
    print()
    
    # Initialize Supabase
    print("🔌 Initializing Supabase...")
    try:
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SECRET_KEY")
        supabase = create_client(supabase_url, supabase_key)
        print("✅ Supabase initialized")
    except Exception as e:
        log_error("SUPABASE_INIT_FAILED", str(e))
        return 1
    print()
    
    # Create test files
    print("📝 Creating test files...")
    if not create_test_files():
        return 1
    print()
    
    # Create test session
    print("📦 Creating test session...")
    try:
        session_id = create_test_session(supabase)
    except Exception as e:
        log_error("SESSION_CREATION_FAILED", str(e))
        return 1
    print()
    
    # Create PR
    print("🚀 Creating PR...")
    try:
        pr_creator = PRCreator(supabase, project_root)
        pr_result = pr_creator.create_pr(session_id, force=False)
        
        if pr_result:
            print("\n" + "=" * 60)
            print("✅ PR CREATED SUCCESSFULLY!")
            print("=" * 60)
            print(f"PR Number: {pr_result.get('pr_number', 'N/A')}")
            print(f"PR URL: {pr_result.get('pr_url', 'N/A')}")
            print(f"Session ID: {session_id}")
            print()
            print("✅ No errors found during PR creation")
            return 0
        else:
            log_error("PR_CREATION_RETURNED_NONE", "PR creation returned None", {"session_id": session_id})
            return 1
            
    except Exception as e:
        log_error("PR_CREATION_FAILED", str(e), {"session_id": session_id})
        import traceback
        traceback.print_exc()
        return 1
    
    finally:
        # Print error log summary
        if ERROR_LOG_FILE.exists():
            print("\n" + "=" * 60)
            print("📋 ERROR LOG SUMMARY")
            print("=" * 60)
            with open(ERROR_LOG_FILE, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                if lines:
                    print(f"Found {len(lines)} error(s) - see {ERROR_LOG_FILE}")
                    for line in lines[:5]:  # Show first 5 errors
                        print(f"  {line.strip()}")
                    if len(lines) > 5:
                        print(f"  ... and {len(lines) - 5} more errors")
                else:
                    print("✅ No errors logged")
            print()


if __name__ == '__main__':
    sys.exit(main())

