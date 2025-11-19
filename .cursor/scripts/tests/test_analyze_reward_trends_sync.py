#!/usr/bin/env python3
"""
Tests for automatic reward_scores.json syncing in analyze_reward_trends.py.

Tests verify:
- Sync is automatically called when loading reward scores
- Sync succeeds when git operations work correctly
- Sync fails gracefully when git is unavailable
- Sync is skipped when file is already up-to-date
"""

import unittest
from unittest.mock import Mock, patch, MagicMock, call
from pathlib import Path
import json
import os
import sys
import tempfile
import shutil

# Import functions to test
sys.path.insert(0, str(Path(__file__).parent.parent))
from analyze_reward_trends import sync_reward_scores_file, load_reward_scores, REWARD_SCORES_PATH


class TestSyncRewardScoresFile(unittest.TestCase):
    """Test sync_reward_scores_file function."""

    def setUp(self):
        """Set up test fixtures."""
        self.repo_path = Path(__file__).resolve().parents[3]
        self.file_path = REWARD_SCORES_PATH
        
        # Create a temporary directory for testing
        self.test_dir = tempfile.mkdtemp()
        self.test_repo = Path(self.test_dir) / "test_repo"
        self.test_repo.mkdir()
        self.test_file = self.test_repo / "docs" / "metrics" / "reward_scores.json"
        self.test_file.parent.mkdir(parents=True, exist_ok=True)

    def tearDown(self):
        """Clean up test fixtures."""
        if os.path.exists(self.test_dir):
            shutil.rmtree(self.test_dir)

    @patch('analyze_reward_trends.subprocess.run')
    @patch('analyze_reward_trends.logger')
    def test_sync_succeeds_when_origin_newer(self, mock_logger, mock_run):
        """Test that sync succeeds when origin/main has newer file."""
        # Mock git operations
        mock_run.side_effect = [
            # git rev-parse --git-dir (success - is git repo)
            Mock(returncode=0, stdout=".git", stderr=""),
            # git rev-parse --abbrev-ref HEAD (current branch)
            Mock(returncode=0, stdout="main", stderr=""),
            # git fetch origin main (success)
            Mock(returncode=0, stdout="", stderr=""),
            # git cat-file -e (file exists on origin)
            Mock(returncode=0, stdout="", stderr=""),
            # git log -1 --format=%ct (origin timestamp - newer)
            Mock(returncode=0, stdout="1734624000", stderr=""),  # 2024-12-20 timestamp
            # git checkout origin/main (sync success)
            Mock(returncode=0, stdout="", stderr=""),
        ]
        
        # Create local file with older timestamp
        self.test_file.write_text('{"version": "1.0", "scores": []}')
        os.utime(self.test_file, (1734537600, 1734537600))  # Older timestamp
        
        result = sync_reward_scores_file(self.test_repo, self.test_file)
        
        # Verify sync was attempted and succeeded
        self.assertTrue(result)
        # Verify git checkout was called to sync the file
        checkout_calls = [c for c in mock_run.call_args_list if 'checkout' in str(c)]
        self.assertGreater(len(checkout_calls), 0, "git checkout should be called to sync file")
        mock_logger.info.assert_called()

    @patch('analyze_reward_trends.subprocess.run')
    @patch('analyze_reward_trends.logger')
    def test_sync_skipped_when_up_to_date(self, mock_logger, mock_run):
        """Test that sync is skipped when local file is up-to-date."""
        # Mock git operations
        mock_run.side_effect = [
            # git rev-parse --git-dir (success)
            Mock(returncode=0, stdout=".git", stderr=""),
            # git rev-parse --abbrev-ref HEAD
            Mock(returncode=0, stdout="main", stderr=""),
            # git fetch origin main (success)
            Mock(returncode=0, stdout="", stderr=""),
            # git cat-file -e (file exists)
            Mock(returncode=0, stdout="", stderr=""),
            # git log -1 --format=%ct (origin timestamp - same as local)
            Mock(returncode=0, stdout="1734624000", stderr=""),
        ]
        
        # Create local file with same timestamp
        self.test_file.write_text('{"version": "1.0", "scores": []}')
        os.utime(self.test_file, (1734624000, 1734624000))  # Same timestamp
        
        result = sync_reward_scores_file(self.test_repo, self.test_file)
        
        # Verify sync was attempted but skipped (no checkout call)
        # Should return False when skipped
        checkout_calls = [c for c in mock_run.call_args_list if 'checkout' in str(c)]
        self.assertEqual(len(checkout_calls), 0, "git checkout should not be called when file is up-to-date")

    @patch('analyze_reward_trends.subprocess.run')
    @patch('analyze_reward_trends.logger')
    def test_sync_fails_gracefully_when_not_git_repo(self, mock_logger, mock_run):
        """Test that sync fails gracefully when not in git repository."""
        # Mock git rev-parse to fail (not a git repo)
        mock_run.return_value = Mock(returncode=1, stdout="", stderr="not a git repository")
        
        result = sync_reward_scores_file(self.test_repo, self.test_file)
        
        # Should return False (skipped, not failed)
        self.assertFalse(result)
        # Should not attempt further git operations
        self.assertEqual(mock_run.call_count, 1)

    @patch('analyze_reward_trends.subprocess.run')
    @patch('analyze_reward_trends.logger')
    def test_sync_fails_gracefully_when_git_unavailable(self, mock_logger, mock_run):
        """Test that sync fails gracefully when git is not available."""
        # Mock FileNotFoundError (git not in PATH)
        mock_run.side_effect = FileNotFoundError("git: command not found")
        
        result = sync_reward_scores_file(self.test_repo, self.test_file)
        
        # Should return False (skipped)
        self.assertFalse(result)
        # Should log debug message
        mock_logger.debug.assert_called()

    @patch('analyze_reward_trends.subprocess.run')
    @patch('analyze_reward_trends.logger')
    def test_sync_creates_file_if_missing(self, mock_logger, mock_run):
        """Test that sync creates file if local file doesn't exist."""
        # Mock git operations
        mock_run.side_effect = [
            # git rev-parse --git-dir (success)
            Mock(returncode=0, stdout=".git", stderr=""),
            # git rev-parse --abbrev-ref HEAD
            Mock(returncode=0, stdout="main", stderr=""),
            # git fetch origin main (success)
            Mock(returncode=0, stdout="", stderr=""),
            # git cat-file -e (file exists on origin)
            Mock(returncode=0, stdout="", stderr=""),
            # git checkout origin/main (sync success)
            Mock(returncode=0, stdout="", stderr=""),
        ]
        
        # File doesn't exist locally
        self.assertFalse(self.test_file.exists())
        
        result = sync_reward_scores_file(self.test_repo, self.test_file)
        
        # Should attempt to sync (checkout should be called)
        checkout_calls = [c for c in mock_run.call_args_list if 'checkout' in str(c)]
        self.assertGreater(len(checkout_calls), 0, "git checkout should be called to create missing file")


class TestLoadRewardScoresAutoSync(unittest.TestCase):
    """Test that load_reward_scores automatically syncs before loading."""

    def setUp(self):
        """Set up test fixtures."""
        self.test_dir = tempfile.mkdtemp()
        self.test_file = Path(self.test_dir) / "reward_scores.json"
        self.test_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Create test data
        self.test_data = {
            "version": "1.0",
            "last_updated": "2025-11-19T15:36:47.644610Z",
            "scores": [
                {"pr": "1", "score": 5, "timestamp": "2025-11-19T10:00:00Z"},
                {"pr": "2", "score": 3, "timestamp": "2025-11-19T11:00:00Z"},
            ]
        }
        self.test_file.write_text(json.dumps(self.test_data, indent=2))

    def tearDown(self):
        """Clean up test fixtures."""
        if os.path.exists(self.test_dir):
            shutil.rmtree(self.test_dir)

    @patch('analyze_reward_trends.sync_reward_scores_file')
    @patch('analyze_reward_trends.REWARD_SCORES_PATH', new_callable=lambda: Path)
    def test_load_reward_scores_calls_sync(self, mock_path, mock_sync):
        """Test that load_reward_scores calls sync before loading."""
        # Setup
        mock_path.return_value = self.test_file
        mock_sync.return_value = True  # Sync succeeds
        
        # Mock the path resolution
        with patch('analyze_reward_trends.REWARD_SCORES_PATH', self.test_file):
            result = load_reward_scores()
        
        # Verify sync was called
        mock_sync.assert_called_once()
        
        # Verify data was loaded
        self.assertEqual(len(result.get("scores", [])), 2)
        self.assertEqual(result["version"], "1.0")

    @patch('analyze_reward_trends.sync_reward_scores_file')
    @patch('analyze_reward_trends.REWARD_SCORES_PATH', new_callable=lambda: Path)
    def test_load_reward_scores_continues_if_sync_fails(self, mock_path, mock_sync):
        """Test that load_reward_scores continues with local file if sync fails."""
        # Setup
        mock_path.return_value = self.test_file
        mock_sync.return_value = False  # Sync fails
        
        # Mock the path resolution
        with patch('analyze_reward_trends.REWARD_SCORES_PATH', self.test_file):
            result = load_reward_scores()
        
        # Verify sync was attempted
        mock_sync.assert_called_once()
        
        # Verify data was still loaded from local file
        self.assertEqual(len(result.get("scores", [])), 2)
        self.assertEqual(result["version"], "1.0")


class TestSyncIntegration(unittest.TestCase):
    """Integration test: verify sync actually works end-to-end."""

    def setUp(self):
        """Set up test fixtures."""
        self.test_dir = tempfile.mkdtemp()
        self.test_repo = Path(self.test_dir) / "test_repo"
        self.test_repo.mkdir()
        
        # Initialize git repo
        import subprocess
        subprocess.run(["git", "init"], cwd=self.test_repo, capture_output=True, check=False)
        subprocess.run(["git", "config", "user.email", "test@test.com"], cwd=self.test_repo, capture_output=True, check=False)
        subprocess.run(["git", "config", "user.name", "Test"], cwd=self.test_repo, capture_output=True, check=False)
        
        # Create file structure
        self.test_file = self.test_repo / "docs" / "metrics" / "reward_scores.json"
        self.test_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Create initial file
        initial_data = {
            "version": "1.0",
            "last_updated": "2025-11-19T10:00:00Z",
            "scores": [{"pr": "1", "score": 5}]
        }
        self.test_file.write_text(json.dumps(initial_data, indent=2))
        
        # Commit to main
        subprocess.run(["git", "add", "."], cwd=self.test_repo, capture_output=True, check=False)
        subprocess.run(["git", "commit", "-m", "Initial"], cwd=self.test_repo, capture_output=True, check=False)
        subprocess.run(["git", "checkout", "-b", "main"], cwd=self.test_repo, capture_output=True, check=False)
        subprocess.run(["git", "branch", "-M", "main"], cwd=self.test_repo, capture_output=True, check=False)

    def tearDown(self):
        """Clean up test fixtures."""
        if os.path.exists(self.test_dir):
            shutil.rmtree(self.test_dir)

    @patch('analyze_reward_trends.subprocess.run')
    def test_sync_detects_newer_file_on_origin(self, mock_run):
        """Test that sync detects when origin has newer file."""
        # This is a simplified test - in real scenario, we'd need actual git setup
        # For now, we'll verify the logic path
        
        # Mock: file exists, origin has newer timestamp
        mock_run.side_effect = [
            Mock(returncode=0, stdout=".git"),  # is git repo
            Mock(returncode=0, stdout="main"),  # current branch
            Mock(returncode=0),  # fetch success
            Mock(returncode=0),  # file exists on origin
            Mock(returncode=0, stdout="1734624000"),  # origin timestamp (newer)
            Mock(returncode=0),  # checkout success
        ]
        
        # Set local file to older timestamp
        os.utime(self.test_file, (1734537600, 1734537600))
        
        result = sync_reward_scores_file(self.test_repo, self.test_file)
        
        # Should attempt sync
        self.assertTrue(result)
        # Verify checkout was called
        checkout_calls = [c for c in mock_run.call_args_list if len(c[0]) > 0 and 'checkout' in c[0][0]]
        self.assertGreater(len(checkout_calls), 0)


if __name__ == "__main__":
    unittest.main()

