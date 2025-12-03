#!/usr/bin/env python3
"""
GitDiffAnalyzer - Analyzes git diffs to get accurate line counts.

Last Updated: 2025-11-24
"""

import subprocess
from pathlib import Path
from typing import Tuple, Optional

from logger_util import get_logger

logger = get_logger(context="GitDiffAnalyzer")


class GitDiffAnalyzer:
    """
    Analyzes git diffs to get accurate line counts.
    
    Features:
    - Accurate line count analysis using git diff
    - .gitignore checking
    - Error handling for non-git repos
    """
    
    @staticmethod
    def get_diff_stats(file_path: str, repo_root: Optional[str] = None) -> Tuple[int, int]:
        """
        Get line count statistics for a file using git diff.
        
        Args:
            file_path: Relative path to file from repository root
            repo_root: Optional repository root path (auto-detected if None)
        
        Returns:
            Tuple of (lines_added, lines_removed)
        """
        try:
            # Get repository root if not provided
            if repo_root is None:
                result = subprocess.run(
                    ['git', 'rev-parse', '--show-toplevel'],
                    capture_output=True,
                    text=True,
                    check=True,
                    timeout=5
                )
                repo_root = result.stdout.strip()
            
            # Get diff for the file
            try:
                result = subprocess.run(
                    ['git', 'diff', '--numstat', 'HEAD', '--', file_path],
                    cwd=repo_root,
                    capture_output=True,
                    text=True,
                    check=False,
                    timeout=10
                )
            except (subprocess.TimeoutExpired, FileNotFoundError) as e:
                logger.warning(f"Error running git diff: {e}")
                return None
            
            if result.returncode == 0 and result.stdout.strip():
                # Parse: "added\tremoved\tfilename"
                parts = result.stdout.strip().split('\t')
                if len(parts) >= 2:
                    added = int(parts[0]) if parts[0] != '-' else 0
                    removed = int(parts[1]) if parts[1] != '-' else 0
                    
                    logger.debug(
                        "Git diff stats retrieved",
                        operation="get_diff_stats",
                        file_path=file_path,
                        lines_added=added,
                        lines_removed=removed
                    )
                    
                    return added, removed
            
            # File not in git or no changes
            logger.debug(
                "No git diff found for file",
                operation="get_diff_stats",
                file_path=file_path
            )
            return 0, 0
            
        except subprocess.TimeoutExpired:
            logger.warn(
                "Git diff command timed out",
                operation="get_diff_stats",
                error_code="GIT_DIFF_TIMEOUT",
                file_path=file_path
            )
            return 0, 0
        except subprocess.CalledProcessError as e:
            logger.warn(
                "Git diff command failed",
                operation="get_diff_stats",
                error_code="GIT_DIFF_FAILED",
                root_cause=str(e),
                file_path=file_path,
                returncode=e.returncode
            )
            return 0, 0
        except ValueError as e:
            logger.warn(
                "Failed to parse git diff output",
                operation="get_diff_stats",
                error_code="GIT_DIFF_PARSE_FAILED",
                root_cause=str(e),
                file_path=file_path
            )
            return 0, 0
        except Exception as e:
            logger.error(
                "Unexpected error getting git diff stats",
                operation="get_diff_stats",
                error_code="GIT_DIFF_UNEXPECTED_ERROR",
                root_cause=str(e),
                file_path=file_path
            )
            return 0, 0
    
    @staticmethod
    def is_git_ignored(file_path: str, repo_root: Optional[str] = None) -> bool:
        """
        Check if file is in .gitignore.
        
        Args:
            file_path: Relative path to file from repository root
            repo_root: Optional repository root path (auto-detected if None)
        
        Returns:
            True if file is ignored, False otherwise
        """
        try:
            # Get repository root if not provided
            if repo_root is None:
                result = subprocess.run(
                    ['git', 'rev-parse', '--show-toplevel'],
                    capture_output=True,
                    text=True,
                    check=True,
                    timeout=5
                )
                repo_root = result.stdout.strip()
            
            # Check if file is ignored
            try:
                result = subprocess.run(
                    ['git', 'check-ignore', file_path],
                    cwd=repo_root,
                    capture_output=True,
                    check=False,
                    timeout=5
                )
            except (subprocess.TimeoutExpired, FileNotFoundError) as e:
                logger.warning(f"Error running git check-ignore: {e}")
                return False
            
            is_ignored = result.returncode == 0
            
            if is_ignored:
                logger.debug(
                    "File is git-ignored",
                    operation="is_git_ignored",
                    file_path=file_path
                )
            
            return is_ignored
            
        except subprocess.TimeoutExpired:
            logger.warn(
                "Git check-ignore command timed out",
                operation="is_git_ignored",
                error_code="GIT_CHECK_IGNORE_TIMEOUT",
                file_path=file_path
            )
            return False
        except subprocess.CalledProcessError:
            # Not a git repo or other error - assume not ignored
            return False
        except Exception as e:
            logger.error(
                "Unexpected error checking git ignore",
                operation="is_git_ignored",
                error_code="GIT_CHECK_IGNORE_UNEXPECTED_ERROR",
                root_cause=str(e),
                file_path=file_path
            )
            return False
    
    @staticmethod
    def get_repo_root() -> Optional[str]:
        """
        Get repository root path.
        
        Returns:
            Repository root path or None if not a git repo
        """
        try:
            result = subprocess.run(
                ['git', 'rev-parse', '--show-toplevel'],
                capture_output=True,
                text=True,
                check=True,
                timeout=5
            )
            return result.stdout.strip()
        except (subprocess.CalledProcessError, subprocess.TimeoutExpired):
            return None
        except Exception as e:
            logger.error(
                "Failed to get repository root",
                operation="get_repo_root",
                error_code="GIT_REPO_ROOT_FAILED",
                root_cause=str(e)
            )
            return None



