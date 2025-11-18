#!/usr/bin/env python3
"""
Regression tests for Auto-PR consolidation logic.

Tests verify:
- Consolidation identifies small PRs correctly
- File filtering works (excludes files already in PRs)
- Consolidation closes smallest PRs first
- Large PRs (100+ files) handled correctly with additions/deletions
"""

import unittest
from unittest.mock import Mock, patch, MagicMock
from pathlib import Path
import json

# Import functions to test
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))
from monitor_changes import consolidate_small_prs, get_open_auto_prs, get_files_in_open_prs, load_config


class TestAutoPRConsolidation(unittest.TestCase):
    """Test Auto-PR consolidation logic."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.repo_path = Path(__file__).parent.parent.parent
        self.config = load_config()
    
    def test_consolidation_closes_smallest_first(self):
        """Verify consolidation closes smallest PRs first."""
        # Mock open PRs with varying file counts
        open_prs = [
            {"number": 1, "headRefName": "auto-pr-1"},
            {"number": 2, "headRefName": "auto-pr-2"},
            {"number": 3, "headRefName": "auto-pr-3"},
        ]
        
        # Mock PR file data
        pr_files_data = {
            1: [{"path": "file1.txt", "additions": 10, "deletions": 5}],  # 1 file
            2: [{"path": "file2.txt", "additions": 20, "deletions": 10},
                {"path": "file3.txt", "additions": 15, "deletions": 5}],  # 2 files
            3: [{"path": "file4.txt", "additions": 30, "deletions": 15},
                {"path": "file5.txt", "additions": 25, "deletions": 10},
                {"path": "file6.txt", "additions": 20, "deletions": 5}],  # 3 files
        }
        
        with patch('monitor_changes.subprocess.run') as mock_run:
            # Mock gh pr view and close calls
            def mock_subprocess(*args, **kwargs):
                cmd = args[0] if args else []
                result = Mock()
                result.returncode = 0
                
                # Handle gh pr view calls
                if len(cmd) > 2 and cmd[0] == "gh" and cmd[1] == "pr" and cmd[2] == "view":
                    pr_num = int(cmd[3])
                    files = pr_files_data.get(pr_num, [])
                    result.stdout = json.dumps({"files": files})
                # Handle gh pr close calls
                elif len(cmd) > 2 and cmd[0] == "gh" and cmd[1] == "pr" and cmd[2] == "close":
                    result.stdout = ""
                else:
                    result.stdout = ""
                
                return result
            
            mock_run.side_effect = mock_subprocess
            
            # Set max_open_prs to 1 (should close 2 smallest)
            self.config["pr_settings"]["max_open_prs"] = 1
            
            closed_count = consolidate_small_prs(open_prs, self.config, self.repo_path)
            
            # Should close 2 PRs (PR #1 with 1 file, PR #2 with 2 files)
            # Keep PR #3 with 3 files (largest)
            self.assertEqual(closed_count, 2)
    
    def test_consolidation_handles_large_prs(self):
        """Verify consolidation handles PRs with 100+ files using additions/deletions."""
        # Mock PR with 100 files (GitHub API limit)
        large_pr_files = [{"path": f"file{i}.txt", "additions": 10, "deletions": 5} for i in range(100)]
        small_pr_files = [{"path": "file1.txt", "additions": 10, "deletions": 5}]
        
        open_prs = [
            {"number": 1, "headRefName": "auto-pr-1"},  # 1 file
            {"number": 2, "headRefName": "auto-pr-2"},  # 100 files, 1500 changes
        ]
        
        pr_files_data = {
            1: small_pr_files,
            2: large_pr_files,
        }
        
        with patch('monitor_changes.subprocess.run') as mock_run:
            def mock_subprocess(*args, **kwargs):
                cmd = args[0] if args else []
                result = Mock()
                result.returncode = 0
                
                # Handle gh pr view calls
                if len(cmd) > 2 and cmd[0] == "gh" and cmd[1] == "pr" and cmd[2] == "view":
                    pr_num = int(cmd[3])
                    files = pr_files_data.get(pr_num, [])
                    result.stdout = json.dumps({"files": files})
                # Handle gh pr close calls
                elif len(cmd) > 2 and cmd[0] == "gh" and cmd[1] == "pr" and cmd[2] == "close":
                    result.stdout = ""
                else:
                    result.stdout = ""
                
                return result
            
            mock_run.side_effect = mock_subprocess
            
            self.config["pr_settings"]["max_open_prs"] = 1
            
            closed_count = consolidate_small_prs(open_prs, self.config, self.repo_path)
            
            # Should close PR #1 (smaller), keep PR #2 (larger)
            self.assertEqual(closed_count, 1)
    
    def test_file_filtering_excludes_duplicates(self):
        """Verify file filtering excludes files already in open PRs."""
        # Mock open PRs with files
        open_prs = [
            {"number": 1, "headRefName": "auto-pr-1"},
        ]
        
        pr_files_data = {
            1: [
                {"path": "file1.txt"},
                {"path": "file2.txt"},
            ],
        }
        
        # Files to create PR for
        new_files = {
            "file1.txt": {"status": "M", "lines_changed": 10},  # Already in PR #1
            "file3.txt": {"status": "M", "lines_changed": 20},  # New file
        }
        
        with patch('monitor_changes.subprocess.run') as mock_run:
            def mock_subprocess(*args, **kwargs):
                cmd = args[0] if args else []
                result = Mock()
                result.returncode = 0
                
                # Handle gh pr view calls
                if len(cmd) > 2 and cmd[0] == "gh" and cmd[1] == "pr" and cmd[2] == "view":
                    pr_num = int(cmd[3])
                    files = pr_files_data.get(pr_num, [])
                    result.stdout = json.dumps({"files": files})
                else:
                    result.stdout = ""
                
                return result
            
            mock_run.side_effect = mock_subprocess
            
            files_in_prs = get_files_in_open_prs(open_prs, self.repo_path)
            
            # file1.txt should be in the set, file3.txt should not
            self.assertIn("file1.txt", files_in_prs)
            self.assertNotIn("file3.txt", files_in_prs)
            
            # Filtered files should only include file3.txt
            filtered_files = {f: d for f, d in new_files.items() if f not in files_in_prs}
            self.assertEqual(len(filtered_files), 1)
            self.assertIn("file3.txt", filtered_files)
    
    def test_consolidation_respects_min_files_threshold(self):
        """Verify consolidation only closes PRs below min_files threshold."""
        open_prs = [
            {"number": 1, "headRefName": "auto-pr-1"},  # 5 files (below threshold)
            {"number": 2, "headRefName": "auto-pr-2"},  # 10 files (at threshold)
            {"number": 3, "headRefName": "auto-pr-3"},  # 15 files (above threshold)
        ]
        
        pr_files_data = {
            1: [{"path": f"file{i}.txt"} for i in range(5)],
            2: [{"path": f"file{i}.txt"} for i in range(10)],
            3: [{"path": f"file{i}.txt"} for i in range(15)],
        }
        
        with patch('monitor_changes.subprocess.run') as mock_run:
            def mock_subprocess(*args, **kwargs):
                cmd = args[0] if args else []
                result = Mock()
                result.returncode = 0
                
                # Handle gh pr view calls
                if len(cmd) > 2 and cmd[0] == "gh" and cmd[1] == "pr" and cmd[2] == "view":
                    pr_num = int(cmd[3])
                    files = pr_files_data.get(pr_num, [])
                    result.stdout = json.dumps({"files": files})
                # Handle gh pr close calls
                elif len(cmd) > 2 and cmd[0] == "gh" and cmd[1] == "pr" and cmd[2] == "close":
                    result.stdout = ""
                else:
                    result.stdout = ""
                
                return result
            
            mock_run.side_effect = mock_subprocess
            
            self.config["change_threshold"]["min_files"] = 10
            self.config["pr_settings"]["max_open_prs"] = 2
            
            closed_count = consolidate_small_prs(open_prs, self.config, self.repo_path)
            
            # Should only close PR #1 (5 files < 10 threshold)
            # PR #2 and #3 are at or above threshold
            self.assertEqual(closed_count, 1)


if __name__ == "__main__":
    unittest.main()

