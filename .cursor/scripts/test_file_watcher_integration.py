#!/usr/bin/env python3
"""
File Watcher Integration Test
Tests end-to-end file watcher functionality.

Last Updated: 2025-11-24

Usage:
    python .cursor/scripts/test_file_watcher_integration.py
"""

import os
import sys
import time
import tempfile
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from logger_util import get_logger

logger = get_logger(context="test_file_watcher_integration")


def test_file_watcher_imports():
    """Test that all file watcher components can be imported."""
    print("1. Testing imports...")
    
    try:
        from veroscore_v3.file_change import FileChange
        from veroscore_v3.change_buffer import ChangeBuffer
        from veroscore_v3.git_diff_analyzer import GitDiffAnalyzer
        from veroscore_v3.change_handler import VeroFieldChangeHandler
        from veroscore_v3.session_manager import SessionManager
        from veroscore_v3.threshold_checker import ThresholdChecker
        from file_watcher import FileWatcher
        
        print("✅ All imports successful")
        return True
    except ImportError as e:
        print(f"❌ Import failed: {e}")
        return False


def test_file_change_creation():
    """Test creating FileChange instances."""
    print("\n2. Testing FileChange creation...")
    
    try:
        from veroscore_v3.file_change import FileChange
        from datetime import datetime, timezone
        
        change = FileChange(
            path="test.py",
            change_type="modified",
            timestamp=datetime.now(timezone.utc).isoformat(),
            lines_added=10,
            lines_removed=5
        )
        
        assert change.path == "test.py"
        assert change.change_type == "modified"
        assert change.lines_added == 10
        assert change.lines_removed == 5
        
        print("✅ FileChange creation successful")
        return True
    except Exception as e:
        print(f"❌ FileChange creation failed: {e}")
        return False


def test_change_buffer():
    """Test ChangeBuffer functionality."""
    print("\n3. Testing ChangeBuffer...")
    
    try:
        from veroscore_v3.change_buffer import ChangeBuffer
        from veroscore_v3.file_change import FileChange
        from datetime import datetime, timezone
        
        buffer = ChangeBuffer(debounce_seconds=0.1)
        
        change = FileChange(
            path="test.py",
            change_type="modified",
            timestamp=datetime.now(timezone.utc).isoformat()
        )
        
        buffer.add_change(change)
        assert buffer.count() == 1
        
        changes = buffer.get_all()
        assert len(changes) == 1
        assert buffer.count() == 0  # Should be cleared
        
        print("✅ ChangeBuffer functionality successful")
        return True
    except Exception as e:
        print(f"❌ ChangeBuffer test failed: {e}")
        return False


def test_session_manager_init():
    """Test SessionManager initialization (without Supabase)."""
    print("\n4. Testing SessionManager initialization...")
    
    try:
        from veroscore_v3.session_manager import SessionManager
        
        # This will fail if Supabase not configured, but we can test the import
        if not os.getenv("SUPABASE_URL") or not os.getenv("SUPABASE_SECRET_KEY"):
            print("⚠️  Skipping: SUPABASE_URL and SUPABASE_SECRET_KEY not set")
            print("   (This is expected if environment not configured)")
            return True  # Not a failure
        
        # Try to initialize
        from supabase import create_client
        supabase = create_client(
            os.getenv("SUPABASE_URL"),
            os.getenv("SUPABASE_SECRET_KEY")
        )
        
        manager = SessionManager(supabase)
        print("✅ SessionManager initialization successful")
        return True
    except ImportError:
        print("⚠️  Skipping: supabase-py package not installed")
        return True  # Not a failure
    except Exception as e:
        print(f"❌ SessionManager initialization failed: {e}")
        return False


def test_threshold_checker():
    """Test ThresholdChecker with mock session manager."""
    print("\n5. Testing ThresholdChecker...")
    
    try:
        from veroscore_v3.threshold_checker import ThresholdChecker
        from unittest.mock import Mock
        
        # Mock session manager
        mock_session_manager = Mock()
        mock_session_manager.supabase = Mock()
        
        config = {
            "thresholds": {
                "min_files": 3,
                "min_lines": 50,
                "max_wait_seconds": 300,
                "batch_size": 10
            }
        }
        
        checker = ThresholdChecker(config, mock_session_manager)
        
        # Mock session data
        mock_session = {
            "session_id": "test",
            "total_files": 5,
            "total_lines_added": 0,
            "total_lines_removed": 0,
            "last_activity": "2025-11-24T12:00:00Z"
        }
        
        checker._get_session_data = lambda x: mock_session
        checker._get_pending_changes_count = lambda x: 0
        
        should_create, reason = checker.should_create_pr("test")
        assert should_create == True
        
        print("✅ ThresholdChecker functionality successful")
        return True
    except Exception as e:
        print(f"❌ ThresholdChecker test failed: {e}")
        return False


def main():
    """Run all integration tests."""
    print("=" * 60)
    print("File Watcher Integration Test")
    print("=" * 60)
    print()
    
    results = []
    
    # Run tests
    results.append(("Imports", test_file_watcher_imports()))
    results.append(("FileChange Creation", test_file_change_creation()))
    results.append(("ChangeBuffer", test_change_buffer()))
    results.append(("SessionManager Init", test_session_manager_init()))
    results.append(("ThresholdChecker", test_threshold_checker()))
    
    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print()
    
    all_passed = all(passed for _, passed in results)
    if all_passed:
        print("✅ All integration tests passed!")
        print("\nNote: Some tests may be skipped if dependencies are missing.")
        print("This is expected and not a failure.")
        return 0
    else:
        print("❌ Some tests failed.")
        return 1


if __name__ == '__main__':
    sys.exit(main())

