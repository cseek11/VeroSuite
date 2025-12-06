#!/usr/bin/env python3
"""
Unit tests for PRCreator.

Phase 3: PR Creator Implementation
Last Updated: 2025-12-05
"""

import unittest
from unittest.mock import Mock, patch, MagicMock, call
from pathlib import Path
from datetime import datetime, timezone

import sys
from pathlib import Path
project_root = Path(__file__).parent.parent.parent.parent.parent
sys.path.insert(0, str(project_root))

from veroscore_v3.pr_creator import PRCreator
from veroscore_v3.enforcement_pipeline_section import EnforcementPipelineSection
from veroscore_v3.idempotency_manager import IdempotencyManager


class TestPRCreator(unittest.TestCase):
    """Test cases for PRCreator."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.mock_supabase = Mock()
        self.repo_path = Path("/tmp/test_repo")
        self.pr_creator = PRCreator(self.mock_supabase, self.repo_path)
        
        # Mock session data
        self.mock_session = {
            "session_id": "test-session-123",
            "author": "test-author",
            "branch_name": "auto-pr-test-author-20251124-123456-abc123",
            "status": "active",
            "prs": [],
            "total_files": 5,
            "total_lines_added": 100,
            "total_lines_removed": 50
        }
        
        # Mock changes data
        self.mock_changes = [
            {
                "file_path": "test/file1.py",
                "change_type": "modified",
                "lines_added": 20,
                "lines_removed": 10
            },
            {
                "file_path": "test/file2.py",
                "change_type": "added",
                "lines_added": 30,
                "lines_removed": 0
            }
        ]
    
    @patch('veroscore_v3.pr_creator.shutil.which')
    def test_init(self, mock_which):
        """Test PRCreator initialization."""
        mock_which.return_value = "/usr/bin/gh"
        
        creator = PRCreator(self.mock_supabase, self.repo_path)
        
        self.assertEqual(creator.repo_path, self.repo_path)
        self.assertEqual(creator.gh_path, "/usr/bin/gh")
        self.assertIsNotNone(creator.session_manager)
        self.assertIsNotNone(creator.idempotency)
    
    @patch('veroscore_v3.pr_creator.shutil.which')
    def test_init_no_gh_cli(self, mock_which):
        """Test PRCreator initialization without GitHub CLI."""
        mock_which.return_value = None
        
        creator = PRCreator(self.mock_supabase, self.repo_path)
        
        self.assertIsNone(creator.gh_path)
    
    @patch('veroscore_v3.pr_creator.subprocess.run')
    @patch.object(PRCreator, '_get_unprocessed_changes')
    @patch.object(PRCreator, '_update_session_status')
    @patch.object(PRCreator, '_mark_changes_processed')
    @patch.object(PRCreator, '_update_session_with_pr')
    @patch.object(PRCreator, '_check_and_mark_session_complete')
    def test_create_pr_success(
        self,
        mock_check_complete,
        mock_update_pr,
        mock_mark_processed,
        mock_update_status,
        mock_get_changes,
        mock_subprocess
    ):
        """Test successful PR creation."""
        # Setup mocks
        self.pr_creator.gh_path = "/usr/bin/gh"
        self.pr_creator.session_manager._get_session = Mock(return_value=self.mock_session)
        mock_get_changes.return_value = self.mock_changes
        
        # Mock idempotency
        self.pr_creator.idempotency.get_or_create_key = Mock(return_value=(None, True))
        self.pr_creator.idempotency.mark_completed = Mock()
        
        # Mock subprocess calls
        mock_subprocess.side_effect = [
            Mock(returncode=0, stdout=""),  # git branch --list
            Mock(returncode=0),  # git checkout -b
            Mock(returncode=0),  # git add
            Mock(returncode=0),  # git commit
            Mock(returncode=0),  # git push
            Mock(returncode=0, stdout="https://github.com/owner/repo/pull/123\n"),  # gh pr create
        ]
        
        # Mock GitHub CLI
        with patch.dict('os.environ', {'AUTO_PR_PAT': 'test-token'}):
            result = self.pr_creator.create_pr("test-session-123")
        
        # Verify result
        self.assertIsNotNone(result)
        self.assertEqual(result['pr_number'], 123)
        self.assertIn('pr_url', result)
        
        # Verify idempotency was marked as completed
        self.pr_creator.idempotency.mark_completed.assert_called_once()
    
    def test_get_unprocessed_changes(self):
        """Test getting unprocessed changes."""
        # Mock Supabase response
        mock_result = Mock()
        mock_result.data = self.mock_changes
        
        with patch.object(self.pr_creator.supabase, 'schema') as mock_schema:
            mock_table = Mock()
            mock_table.select.return_value = mock_table
            mock_table.eq.return_value = mock_table
            mock_table.order.return_value = mock_table
            mock_table.execute.return_value = mock_result
            mock_schema.return_value.table.return_value = mock_table
            
            changes = self.pr_creator._get_unprocessed_changes("test-session-123")
            
            self.assertEqual(len(changes), 2)
            self.assertEqual(changes[0]['file_path'], "test/file1.py")
    
    def test_generate_description(self):
        """Test PR description generation."""
        description = self.pr_creator._generate_description("test-session-123", self.mock_changes)
        
        self.assertIn("Auto-PR: test-session-123", description)
        self.assertIn("## Summary", description)
        self.assertIn("## Files Changed", description)
        self.assertIn("Enforcement Pipeline Compliance", description)
        self.assertIn("test/file1.py", description)
        self.assertIn("test/file2.py", description)


class TestEnforcementPipelineSection(unittest.TestCase):
    """Test cases for EnforcementPipelineSection."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.changes = [
            {"file_path": "test/file1.py", "change_type": "modified"},
            {"file_path": "test/file2.py", "change_type": "added"}
        ]
        self.section_gen = EnforcementPipelineSection("test-session-123", self.changes)
    
    def test_generate(self):
        """Test section generation."""
        section = self.section_gen.generate()
        
        self.assertIn("Enforcement Pipeline Compliance", section)
        self.assertIn("Step 1: Search & Discovery", section)
        self.assertIn("Step 2: Pattern Analysis", section)
        self.assertIn("Step 3: Rule Compliance Check", section)
        self.assertIn("Step 4: Implementation Plan", section)
        self.assertIn("Step 5: Post-Implementation Audit", section)
        self.assertIn("test-session-123", section)
        self.assertIn("Machine-Verifiable Compliance", section)
    
    def test_generate_with_error(self):
        """Test section generation handles errors gracefully."""
        # Force an error by passing invalid changes
        section_gen = EnforcementPipelineSection("test-session-123", None)
        
        # Should not raise, should return minimal section
        section = section_gen.generate()
        self.assertIn("Enforcement Pipeline Compliance", section)


class TestIdempotencyManager(unittest.TestCase):
    """Test cases for IdempotencyManager."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.mock_supabase = Mock()
        self.idempotency = IdempotencyManager(self.mock_supabase)
    
    def test_generate_key(self):
        """Test idempotency key generation."""
        key1 = self.idempotency._generate_key("create_pr", "session-123")
        key2 = self.idempotency._generate_key("create_pr", "session-123")
        key3 = self.idempotency._generate_key("create_pr", "session-456")
        
        # Same operation + identifier = same key
        self.assertEqual(key1, key2)
        
        # Different identifier = different key
        self.assertNotEqual(key1, key3)
    
    def test_get_or_create_key_new(self):
        """Test creating new idempotency key."""
        # Mock Supabase response (no existing key)
        mock_result = Mock()
        mock_result.data = []
        
        with patch.object(self.idempotency.supabase, 'schema') as mock_schema:
            mock_table = Mock()
            mock_table.select.return_value = mock_table
            mock_table.eq.return_value = mock_table
            mock_table.limit.return_value = mock_table
            mock_table.execute.return_value = mock_result
            
            # Mock insert
            mock_insert_result = Mock()
            mock_insert_result.data = [{"key": "test-key"}]
            mock_table.insert.return_value.execute.return_value = mock_insert_result
            
            mock_schema.return_value.table.return_value = mock_table
            
            existing, is_new = self.idempotency.get_or_create_key("create_pr", "session-123")
            
            self.assertIsNone(existing)
            self.assertTrue(is_new)
    
    def test_get_or_create_key_existing(self):
        """Test getting existing idempotency key."""
        # Mock Supabase response (existing completed key)
        mock_result = Mock()
        mock_result.data = [{
            "key": "test-key",
            "status": "completed",
            "result": {"pr_number": 123, "pr_url": "https://github.com/owner/repo/pull/123"}
        }]
        
        with patch.object(self.idempotency.supabase, 'schema') as mock_schema:
            mock_table = Mock()
            mock_table.select.return_value = mock_table
            mock_table.eq.return_value = mock_table
            mock_table.limit.return_value = mock_table
            mock_table.execute.return_value = mock_result
            
            mock_schema.return_value.table.return_value = mock_table
            
            existing, is_new = self.idempotency.get_or_create_key("create_pr", "session-123")
            
            self.assertIsNotNone(existing)
            self.assertFalse(is_new)
            self.assertEqual(existing['pr_number'], 123)


if __name__ == '__main__':
    unittest.main()



