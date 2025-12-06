#!/usr/bin/env python3
"""
PRCreator - Main orchestrator for PR creation with structured descriptions.

Phase 3: PR Creator Implementation
Last Updated: 2025-12-05
"""

import os
import subprocess
import shutil
from pathlib import Path
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone

try:
    from supabase import Client
except ImportError:
    Client = None

from .enforcement_pipeline_section import EnforcementPipelineSection
from .idempotency_manager import IdempotencyManager
from .session_manager import SessionManager
from logger_util import get_logger, get_or_create_trace_context

logger = get_logger(context="PRCreator")


class PRCreator:
    """
    Creates PRs with structured descriptions and enforcement pipeline compliance.
    
    Features:
    - Idempotency management (prevents duplicate PRs)
    - Git automation (branch, commit, push)
    - GitHub CLI integration
    - Structured PR descriptions
    - Session state updates
    - Session completion detection
    - Reward Score eligibility marking
    """
    
    def __init__(self, supabase: Client, repo_path: Optional[Path] = None):
        """
        Initialize PR creator.
        
        Args:
            supabase: Supabase client instance
            repo_path: Repository path (default: current working directory)
        """
        self.supabase = supabase
        self.repo_path = repo_path or Path.cwd()
        self.session_manager = SessionManager(supabase)
        self.idempotency = IdempotencyManager(supabase)
        self.trace_ctx = get_or_create_trace_context()
        
        # Verify GitHub CLI is available
        self.gh_path = self._find_gh_cli()
        if not self.gh_path:
            logger.warn(
                "GitHub CLI not found",
                operation="__init__",
                error_code="GH_CLI_NOT_FOUND",
                **self.trace_ctx
            )
        
        logger.info(
            "PRCreator initialized",
            operation="__init__",
            repo_path=str(self.repo_path),
            gh_cli_available=bool(self.gh_path),
            **self.trace_ctx
        )
    
    def _find_gh_cli(self) -> Optional[str]:
        """Find GitHub CLI executable."""
        gh_path = shutil.which("gh")
        if gh_path:
            return gh_path
        return None
    
    def create_pr(
        self,
        session_id: str,
        force: bool = False
    ) -> Optional[Dict[str, Any]]:
        """
        Create PR for session.
        
        Args:
            session_id: Session ID
            force: Force creation even if idempotency key exists
        
        Returns:
            Dict with pr_number and pr_url, or None on failure
        """
        try:
            trace_ctx = get_or_create_trace_context()
            
            # Check idempotency
            if not force:
                existing, is_new = self.idempotency.get_or_create_key('create_pr', session_id)
                if not is_new and existing:
                    logger.info(
                        "PR already created (idempotency check)",
                        operation="create_pr",
                        session_id=session_id,
                        existing_result=existing,
                        **trace_ctx
                    )
                    return existing
                elif not is_new:
                    # Operation in progress or failed
                    logger.warn(
                        "PR creation already in progress or failed",
                        operation="create_pr",
                        session_id=session_id,
                        **trace_ctx
                    )
                    return None
            
            # Mark session as processing
            self._update_session_status(session_id, "processing")
            
            # Get session data
            session = self.session_manager._get_session(session_id)
            if not session:
                raise ValueError(f"Session not found: {session_id}")
            
            # Get all unprocessed changes
            changes = self._get_unprocessed_changes(session_id)
            if not changes:
                logger.warn(
                    "No unprocessed changes to commit",
                    operation="create_pr",
                    session_id=session_id,
                    error_code="NO_CHANGES_TO_COMMIT",
                    **trace_ctx
                )
                self.idempotency.mark_failed('create_pr', session_id, "No changes to commit")
                return None
            
            # Create branch
            branch_name = session.get("branch_name") or f"auto-pr-{session.get('author', 'unknown')}-{datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')}-{session_id[:8]}"
            self._create_branch(branch_name)
            
            # Stage and commit files
            commit_msg = self._create_commit(session_id, changes)
            
            # Push branch
            self._push_branch(branch_name)
            
            # Generate PR description
            description = self._generate_description(session_id, changes)
            
            # Create PR via GitHub CLI
            if not self.gh_path:
                raise RuntimeError("GitHub CLI not available. Install with: https://cli.github.com/")
            
            pr_result = self._create_github_pr(
                branch_name,
                session_id,
                description
            )
            
            if not pr_result:
                raise RuntimeError("Failed to create PR via GitHub CLI")
            
            # Mark changes as processed
            self._mark_changes_processed(session_id)
            
            # Update session with PR info
            self._update_session_with_pr(session_id, pr_result)
            
            # Check if session is complete and mark for Reward Score
            self._check_and_mark_session_complete(session_id)
            
            # Mark idempotency key as completed
            self.idempotency.mark_completed('create_pr', session_id, pr_result)
            
            logger.info(
                "PR created successfully",
                operation="create_pr",
                session_id=session_id,
                pr_number=pr_result.get('pr_number'),
                pr_url=pr_result.get('pr_url'),
                **trace_ctx
            )
            
            return pr_result
            
        except Exception as e:
            logger.error(
                "PR creation failed",
                operation="create_pr",
                error_code="PR_CREATION_FAILED",
                root_cause=str(e),
                session_id=session_id,
                **self.trace_ctx
            )
            
            # Mark as failed
            self.idempotency.mark_failed('create_pr', session_id, str(e))
            self._update_session_status(session_id, "failed")
            
            raise
    
    def _get_unprocessed_changes(self, session_id: str) -> List[Dict[str, Any]]:
        """Get all unprocessed changes for session."""
        try:
            # Use .schema() method for direct access
            if hasattr(self.supabase, 'schema'):
                result = (
                    self.supabase.schema("veroscore")
                    .table("changes_queue")
                    .select("*")
                    .eq("session_id", session_id)
                    .eq("processed", False)
                    .order("timestamp", desc=False)
                    .execute()
                )
            else:
                result = (
                    self.supabase.table("veroscore.changes_queue")
                    .select("*")
                    .eq("session_id", session_id)
                    .eq("processed", False)
                    .order("timestamp", desc=False)
                    .execute()
                )
            
            if result.data:
                return result.data
            return []
            
        except Exception as e:
            logger.error(
                "Failed to get unprocessed changes",
                operation="_get_unprocessed_changes",
                error_code="CHANGES_FETCH_FAILED",
                root_cause=str(e),
                session_id=session_id,
                **self.trace_ctx
            )
            return []
    
    def _create_branch(self, branch_name: str):
        """Create and checkout branch."""
        try:
            # Check if branch already exists
            result = subprocess.run(
                ['git', 'branch', '--list', branch_name],
                cwd=self.repo_path,
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode == 0 and result.stdout.strip():
                logger.warn(
                    "Branch already exists, checking out",
                    operation="_create_branch",
                    branch_name=branch_name,
                    **self.trace_ctx
                )
                subprocess.run(
                    ['git', 'checkout', branch_name],
                    cwd=self.repo_path,
                    check=True,
                    timeout=30
                )
            else:
                # Create new branch
                subprocess.run(
                    ['git', 'checkout', '-b', branch_name],
                    cwd=self.repo_path,
                    check=True,
                    timeout=30
                )
            
            logger.info(
                "Branch created/checked out",
                operation="_create_branch",
                branch_name=branch_name,
                **self.trace_ctx
            )
            
        except subprocess.CalledProcessError as e:
            logger.error(
                "Failed to create branch",
                operation="_create_branch",
                error_code="BRANCH_CREATE_FAILED",
                root_cause=str(e),
                branch_name=branch_name,
                **self.trace_ctx
            )
            raise
        except Exception as e:
            logger.error(
                "Unexpected error creating branch",
                operation="_create_branch",
                error_code="BRANCH_CREATE_UNEXPECTED",
                root_cause=str(e),
                branch_name=branch_name,
                **self.trace_ctx
            )
            raise
    
    def _create_commit(self, session_id: str, changes: List[Dict[str, Any]]) -> str:
        """Stage files and create commit."""
        try:
            # Get list of file paths from changes
            file_paths = [change.get('file_path') for change in changes if change.get('file_path')]
            
            if not file_paths:
                raise ValueError("No file paths found in changes")
            
            # Stage files
            subprocess.run(
                ['git', 'add'] + file_paths,
                cwd=self.repo_path,
                check=True,
                timeout=30
            )
            
            # Generate commit message
            commit_msg = f"Auto-PR: {session_id}\n\n"
            commit_msg += f"Files changed: {len(changes)}\n"
            commit_msg += f"Session ID: {session_id}\n"
            commit_msg += f"Generated: {datetime.now(timezone.utc).isoformat()}\n"
            
            # Commit (skip hooks for automated commits)
            subprocess.run(
                ['git', 'commit', '--no-verify', '-m', commit_msg],
                cwd=self.repo_path,
                check=True,
                timeout=30
            )
            
            logger.info(
                "Commit created",
                operation="_create_commit",
                session_id=session_id,
                file_count=len(changes),
                **self.trace_ctx
            )
            
            return commit_msg
            
        except subprocess.CalledProcessError as e:
            logger.error(
                "Failed to create commit",
                operation="_create_commit",
                error_code="COMMIT_CREATE_FAILED",
                root_cause=str(e),
                session_id=session_id,
                **self.trace_ctx
            )
            raise
        except Exception as e:
            logger.error(
                "Unexpected error creating commit",
                operation="_create_commit",
                error_code="COMMIT_CREATE_UNEXPECTED",
                root_cause=str(e),
                session_id=session_id,
                **self.trace_ctx
            )
            raise
    
    def _push_branch(self, branch_name: str):
        """Push branch to remote."""
        try:
            subprocess.run(
                ['git', 'push', '-u', 'origin', branch_name],
                cwd=self.repo_path,
                check=True,
                timeout=60
            )
            
            logger.info(
                "Branch pushed",
                operation="_push_branch",
                branch_name=branch_name,
                **self.trace_ctx
            )
            
        except subprocess.CalledProcessError as e:
            logger.error(
                "Failed to push branch",
                operation="_push_branch",
                error_code="BRANCH_PUSH_FAILED",
                root_cause=str(e),
                branch_name=branch_name,
                **self.trace_ctx
            )
            raise
        except Exception as e:
            logger.error(
                "Unexpected error pushing branch",
                operation="_push_branch",
                error_code="BRANCH_PUSH_UNEXPECTED",
                root_cause=str(e),
                branch_name=branch_name,
                **self.trace_ctx
            )
            raise
    
    def _generate_description(self, session_id: str, changes: List[Dict[str, Any]]) -> str:
        """Generate full PR description with enforcement section."""
        try:
            # Generate enforcement pipeline section
            pipeline_section = EnforcementPipelineSection(session_id, changes).generate()
            
            # Build full description
            description = f"# Auto-PR: {session_id}\n\n"
            
            # Summary
            description += "## Summary\n\n"
            description += f"Automated PR generated from {len(changes)} file changes.\n\n"
            
            # File changes list
            description += "## Files Changed\n\n"
            for change in changes[:20]:  # First 20
                file_path = change.get('file_path', 'unknown')
                change_type = change.get('change_type', 'unknown')
                lines_added = change.get('lines_added', 0)
                lines_removed = change.get('lines_removed', 0)
                description += f"- `{file_path}` ({change_type}, +{lines_added}/-{lines_removed})\n"
            
            if len(changes) > 20:
                description += f"- ... and {len(changes) - 20} more files\n"
            description += "\n"
            
            # Enforcement pipeline section (MANDATORY)
            description += pipeline_section
            
            return description
            
        except Exception as e:
            logger.error(
                "Failed to generate PR description",
                operation="_generate_description",
                error_code="DESCRIPTION_GENERATION_FAILED",
                root_cause=str(e),
                session_id=session_id,
                **self.trace_ctx
            )
            # Return minimal description on error
            return f"# Auto-PR: {session_id}\n\n*Error generating detailed description. PR created successfully.*\n"
    
    def _create_github_pr(
        self,
        branch_name: str,
        session_id: str,
        description: str
    ) -> Optional[Dict[str, Any]]:
        """Create PR via GitHub CLI."""
        try:
            # Set PAT for authentication
            env = os.environ.copy()
            env['GITHUB_TOKEN'] = os.environ.get('AUTO_PR_PAT', os.environ.get('GITHUB_TOKEN'))
            
            if not env.get('GITHUB_TOKEN'):
                raise ValueError("GITHUB_TOKEN or AUTO_PR_PAT environment variable required")
            
            # Get base branch from config or default to 'main'
            base_branch = os.environ.get('AUTO_PR_BASE_BRANCH', 'main')
            
            # Create PR
            result = subprocess.run(
                [
                    self.gh_path, 'pr', 'create',
                    '--title', f'Auto-PR: {session_id}',
                    '--body', description,
                    '--base', base_branch,
                    '--head', branch_name
                ],
                cwd=self.repo_path,
                capture_output=True,
                text=True,
                env=env,
                check=True,
                timeout=60
            )
            
            # Parse PR URL from output
            pr_url = result.stdout.strip()
            
            # Extract PR number from URL (format: https://github.com/owner/repo/pull/123)
            pr_number = None
            if '/pull/' in pr_url:
                try:
                    pr_number = int(pr_url.split('/pull/')[-1].split()[0])
                except (ValueError, IndexError):
                    logger.warn(
                        "Could not parse PR number from URL",
                        operation="_create_github_pr",
                        pr_url=pr_url,
                        **self.trace_ctx
                    )
            
            pr_result = {
                'pr_number': pr_number,
                'pr_url': pr_url
            }
            
            logger.info(
                "PR created via GitHub CLI",
                operation="_create_github_pr",
                session_id=session_id,
                pr_number=pr_number,
                pr_url=pr_url,
                **self.trace_ctx
            )
            
            return pr_result
            
        except subprocess.CalledProcessError as e:
            logger.error(
                "GitHub CLI command failed",
                operation="_create_github_pr",
                error_code="GH_CLI_COMMAND_FAILED",
                root_cause=str(e),
                stdout=e.stdout if hasattr(e, 'stdout') else None,
                stderr=e.stderr if hasattr(e, 'stderr') else None,
                session_id=session_id,
                **self.trace_ctx
            )
            return None
        except Exception as e:
            logger.error(
                "Unexpected error creating PR via GitHub CLI",
                operation="_create_github_pr",
                error_code="GH_CLI_UNEXPECTED_ERROR",
                root_cause=str(e),
                session_id=session_id,
                **self.trace_ctx
            )
            return None
    
    def _mark_changes_processed(self, session_id: str):
        """Mark all session changes as processed."""
        try:
            now = datetime.now(timezone.utc).isoformat()
            update_data = {
                "processed": True,
                "processed_at": now
            }
            
            # Update using .schema() method
            if hasattr(self.supabase, 'schema'):
                self.supabase.schema("veroscore").table("changes_queue").update(update_data).eq("session_id", session_id).eq("processed", False).execute()
            else:
                self.supabase.table("veroscore.changes_queue").update(update_data).eq("session_id", session_id).eq("processed", False).execute()
            
            logger.info(
                "Changes marked as processed",
                operation="_mark_changes_processed",
                session_id=session_id,
                **self.trace_ctx
            )
            
        except Exception as e:
            logger.error(
                "Failed to mark changes as processed",
                operation="_mark_changes_processed",
                error_code="MARK_PROCESSED_FAILED",
                root_cause=str(e),
                session_id=session_id,
                **self.trace_ctx
            )
            # Non-critical error, don't raise
    
    def _update_session_status(self, session_id: str, status: str):
        """Update session status."""
        try:
            update_data = {
                "status": status,
                "last_activity": datetime.now(timezone.utc).isoformat()
            }
            
            # Use session manager's update method
            if hasattr(self.supabase, 'schema'):
                self.supabase.schema("veroscore").table("sessions").update(update_data).eq("session_id", session_id).execute()
            else:
                self.supabase.table("veroscore.sessions").update(update_data).eq("session_id", session_id).execute()
            
        except Exception as e:
            logger.error(
                "Failed to update session status",
                operation="_update_session_status",
                error_code="SESSION_STATUS_UPDATE_FAILED",
                root_cause=str(e),
                session_id=session_id,
                status=status,
                **self.trace_ctx
            )
            # Non-critical error, don't raise
    
    def _update_session_with_pr(self, session_id: str, pr_result: Dict[str, Any]):
        """Update session with PR information."""
        try:
            session = self.session_manager._get_session(session_id)
            if not session:
                return
            
            # Get existing PRs list
            existing_prs = session.get("prs", [])
            if not isinstance(existing_prs, list):
                existing_prs = []
            
            # Add new PR number
            pr_number = pr_result.get('pr_number')
            if pr_number and pr_number not in existing_prs:
                existing_prs.append(pr_number)
            
            update_data = {
                "prs": existing_prs,
                "status": "completed",
                "completed_at": datetime.now(timezone.utc).isoformat(),
                "last_activity": datetime.now(timezone.utc).isoformat()
            }
            
            # Update using .schema() method
            if hasattr(self.supabase, 'schema'):
                self.supabase.schema("veroscore").table("sessions").update(update_data).eq("session_id", session_id).execute()
            else:
                self.supabase.table("veroscore.sessions").update(update_data).eq("session_id", session_id).execute()
            
            logger.info(
                "Session updated with PR info",
                operation="_update_session_with_pr",
                session_id=session_id,
                pr_number=pr_number,
                **self.trace_ctx
            )
            
        except Exception as e:
            logger.error(
                "Failed to update session with PR info",
                operation="_update_session_with_pr",
                error_code="SESSION_UPDATE_FAILED",
                root_cause=str(e),
                session_id=session_id,
                **self.trace_ctx
            )
            # Non-critical error, don't raise
    
    def _check_and_mark_session_complete(self, session_id: str):
        """
        Check if session is complete and mark for Reward Score if eligible.
        
        A session is considered complete when:
        - PR has been created
        - All changes have been processed
        - Session status is 'completed'
        """
        try:
            session = self.session_manager._get_session(session_id)
            if not session:
                return
            
            # Check if session is completed
            if session.get("status") != "completed":
                return
            
            # Check if there are any unprocessed changes
            unprocessed = self._get_unprocessed_changes(session_id)
            if unprocessed:
                logger.debug(
                    "Session has unprocessed changes, not marking as complete",
                    operation="_check_and_mark_session_complete",
                    session_id=session_id,
                    unprocessed_count=len(unprocessed),
                    **self.trace_ctx
                )
                return
            
            # Mark session as reward-eligible
            self.session_manager.mark_reward_eligible(session_id)
            
            logger.info(
                "Session marked as reward-eligible",
                operation="_check_and_mark_session_complete",
                session_id=session_id,
                **self.trace_ctx
            )
            
        except Exception as e:
            logger.error(
                "Failed to check and mark session complete",
                operation="_check_and_mark_session_complete",
                error_code="SESSION_COMPLETE_CHECK_FAILED",
                root_cause=str(e),
                session_id=session_id,
                **self.trace_ctx
            )
            # Non-critical error, don't raise

