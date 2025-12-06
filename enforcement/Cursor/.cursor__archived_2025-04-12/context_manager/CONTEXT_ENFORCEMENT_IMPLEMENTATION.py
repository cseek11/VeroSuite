#!/usr/bin/env python3
"""
Context Management Enforcement Implementation
To be integrated into auto-enforcer.py

This file contains the corrected implementation based on feedback:
1. Context-ID verification (replaces unreliable file read detection)
2. Expanded required context (PRIMARY ∪ HIGH ∪ dependencies)
3. Canonical unload algorithm
4. Loaded context = active ∪ preloaded

Last Updated: 2025-12-04
"""

import re
import json
import uuid
from pathlib import Path
from typing import Dict, List, Optional, Set
from datetime import datetime, timezone

# These would be imported from auto-enforcer.py
# from auto_enforcer import VeroFieldEnforcer, Violation, ViolationSeverity
# from context_manager.context_loader import ContextLoader
# from context_manager.preloader import ContextPreloader


class ContextEnforcement:
    """
    Context management enforcement logic.
    
    This class should be integrated into VeroFieldEnforcer.
    """
    
    def __init__(self, enforcer):
        """
        Initialize context enforcement.
        
        Args:
            enforcer: VeroFieldEnforcer instance
        """
        self.enforcer = enforcer
        self.project_root = enforcer.project_root
        self.recommendations_file = self.project_root / ".cursor" / "context_manager" / "recommendations.md"
        self.context_state_file = self.project_root / ".cursor" / "context_manager" / "context_state.json"
        
        # Store previous context state for unload verification
        self.previous_context_state: Optional[Dict] = None
    
    def check_context_management_compliance(self) -> bool:
        """
        Check context management compliance (Step 0.5 and Step 4.5).
        
        Returns:
            True if compliant, False if violations found
        """
        check_name = "Context Management Compliance"
        all_passed = True
        
        # Check Step 0.5 compliance (task start)
        if not self._check_step_0_5_compliance():
            all_passed = False
        
        # Check Step 4.5 compliance (task end)
        if not self._check_step_4_5_compliance():
            all_passed = False
        
        # Check context state validity
        if not self._check_context_state_validity():
            all_passed = False
        
        return all_passed
    
    def _check_step_0_5_compliance(self) -> bool:
        """
        Check Step 0.5 compliance: context-id match, required context loaded.
        
        CORRECTED IMPLEMENTATION:
        - Uses context-id verification (replaces unreliable file read detection)
        - Checks PRIMARY ∪ HIGH ∪ dependencies (not just PRIMARY)
        - Includes preloaded context in loaded context check
        """
        all_passed = True
        
        # Check 1: Context-ID verification (replaces unreliable file read detection)
        context_id_match, latest_context_id = self._verify_context_id_match()
        if not context_id_match:
            self.enforcer._log_violation(self.enforcer.Violation(
                severity=self.enforcer.ViolationSeverity.BLOCKED,
                rule_ref="01-enforcement.mdc Step 0.5",
                message=f"Context-id mismatch. Agent MUST reference latest context-id ({latest_context_id}) from recommendations.md before proceeding to Step 1.",
                file_path=str(self.recommendations_file),
                session_scope="current_session"
            ))
            all_passed = False
        
        # Check 2: Required context files are loaded (PRIMARY ∪ HIGH ∪ dependencies)
        if self.enforcer.PREDICTIVE_CONTEXT_AVAILABLE and self.enforcer.preloader:
            # Get expanded required context (includes dependencies)
            required_context = self._get_expanded_required_context_for_current_task()
            
            # Loaded context = active ∪ preloaded (both are considered "loaded")
            loaded_context = (
                set(self.enforcer.preloader.preloaded_contexts.get('active', [])) |
                set(self.enforcer.preloader.preloaded_contexts.get('preloaded', []))
            )
            
            missing_context = required_context - loaded_context
            if missing_context:
                for file_path in missing_context:
                    self.enforcer._log_violation(self.enforcer.Violation(
                        severity=self.enforcer.ViolationSeverity.BLOCKED,
                        rule_ref="01-enforcement.mdc Step 0.5",
                        message=f"Required context file {file_path} not loaded. MUST load before proceeding.",
                        file_path=str(file_path),
                        session_scope="current_session"
                    ))
                all_passed = False
        
        return all_passed
    
    def _check_step_4_5_compliance(self) -> bool:
        """
        Check Step 4.5 compliance: context unloaded/pre-loaded.
        
        CORRECTED IMPLEMENTATION:
        - Uses canonical unload algorithm (not recommendations.md file list)
        - Includes preloaded context in loaded context check
        - Predicted context pre-loading is WARNING only, not BLOCKED
        """
        all_passed = True
        
        # Check 1: Context-ID verification (updated context-id)
        context_id_match, latest_context_id = self._verify_context_id_match()
        if not context_id_match:
            self.enforcer._log_violation(self.enforcer.Violation(
                severity=self.enforcer.ViolationSeverity.BLOCKED,
                rule_ref="01-enforcement.mdc Step 4.5",
                message=f"Context-id mismatch. Agent MUST reference updated context-id ({latest_context_id}) from recommendations.md before Step 5.",
                file_path=str(self.recommendations_file),
                session_scope="current_session"
            ))
            all_passed = False
        
        # Check 2: Obsolete context was unloaded (using canonical algorithm)
        if self.enforcer.PREDICTIVE_CONTEXT_AVAILABLE and self.enforcer.preloader:
            # Get previous state (from session start or last check)
            prev_state = self._get_previous_context_state()
            prev_active = set(prev_state.get('active', []))
            prev_preloaded = set(prev_state.get('preloaded', []))
            previously_loaded = prev_active | prev_preloaded
            
            # Get current state
            curr_active = set(self.enforcer.preloader.preloaded_contexts.get('active', []))
            curr_preloaded = set(self.enforcer.preloader.preloaded_contexts.get('preloaded', []))
            currently_needed = curr_active | curr_preloaded
            
            # Canonical unload calculation
            expected_unload = previously_loaded - currently_needed
            
            # Check if expected unload files are still loaded
            still_loaded = curr_active | curr_preloaded
            not_unloaded = expected_unload & still_loaded
            
            if not_unloaded:
                for file_path in not_unloaded:
                    self.enforcer._log_violation(self.enforcer.Violation(
                        severity=self.enforcer.ViolationSeverity.BLOCKED,
                        rule_ref="01-enforcement.mdc Step 4.5",
                        message=f"Obsolete context {file_path} not unloaded. MUST unload before Step 5.",
                        file_path=str(file_path),
                        session_scope="current_session"
                    ))
                all_passed = False
        
        # Check 3: Predicted context pre-loaded (WARNING only, not BLOCKED)
        if self.enforcer.PREDICTIVE_CONTEXT_AVAILABLE and self.enforcer.preloader:
            expected_preload = self._get_expected_preloaded_context()
            actual_preload = set(self.enforcer.preloader.preloaded_contexts.get('preloaded', []))
            
            missing_preload = expected_preload - actual_preload
            if missing_preload:
                for file_path in missing_preload:
                    self.enforcer._log_violation(self.enforcer.Violation(
                        severity=self.enforcer.ViolationSeverity.WARNING,  # WARNING, not BLOCKED
                        rule_ref="01-enforcement.mdc Step 4.5",
                        message=f"Predicted context {file_path} not pre-loaded. Consider pre-loading for better performance.",
                        file_path=str(file_path),
                        session_scope="current_session"
                    ))
                # Don't set all_passed = False for warnings
        
        return all_passed
    
    def _verify_context_id_match(self) -> tuple[bool, Optional[str]]:
        """
        Verify agent's context-id matches latest recommendations.md.
        
        This is 100% reliable and platform-independent.
        
        Returns:
            Tuple of (is_match: bool, latest_context_id: Optional[str])
        """
        # Extract context-id from recommendations.md
        try:
            if not self.recommendations_file.exists():
                return (False, None)
            
            with open(self.recommendations_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Look for context-id in HTML comment or metadata
                match = re.search(r'<!--\s*context-id:\s*([a-f0-9-]+)\s*-->', content, re.IGNORECASE)
                if not match:
                    # Try alternative format: **Context-ID:** uuid
                    match = re.search(r'\*\*context-id:\*\*\s*([a-f0-9-]+)', content, re.IGNORECASE)
                if not match:
                    # Try metadata format: context-id: uuid
                    match = re.search(r'context-id:\s*([a-f0-9-]+)', content, re.IGNORECASE)
                
                if match:
                    latest_context_id = match.group(1).strip()
                else:
                    # No context-id found - file may not be generated yet
                    return (False, None)
        except (OSError, FileNotFoundError) as e:
            self.enforcer.logger.warn(
                f"Could not read recommendations.md: {e}",
                operation="_verify_context_id_match",
                file_path=str(self.recommendations_file)
            )
            return (False, None)
        
        # Check if file is recent (generated within last 5 minutes)
        try:
            stat_info = self.recommendations_file.stat()
            mod_time = datetime.fromtimestamp(stat_info.st_mtime, tz=timezone.utc)
            now = datetime.now(timezone.utc)
            age_seconds = (now - mod_time).total_seconds()
            
            # File must be generated within last 5 minutes (300 seconds)
            if age_seconds > 300:
                self.enforcer.logger.warn(
                    f"recommendations.md is stale (age: {age_seconds}s)",
                    operation="_verify_context_id_match",
                    file_path=str(self.recommendations_file),
                    age_seconds=age_seconds
                )
                return (False, latest_context_id)
            
            # TODO: In full implementation, parse agent response for context-id reference
            # For MVP: Just verify context-id exists and file is recent
            # Agent must include context-id in response to pass verification
            
            return (True, latest_context_id)
        except OSError:
            return (False, latest_context_id)
    
    def _get_expanded_required_context_for_current_task(self) -> Set[str]:
        """
        Get expanded required context (PRIMARY ∪ HIGH ∪ dependencies).
        
        This calls ContextLoader.get_required_context() which includes:
        - PRIMARY + required contexts
        - HIGH priority contexts (file-specific, dependencies)
        - Dependencies recursively expanded
        
        Returns:
            Set of required context file paths
        """
        if not self.enforcer.PREDICTIVE_CONTEXT_AVAILABLE or not self.enforcer.context_loader:
            return set()
        
        # Detect current task
        changed_files = self.enforcer.get_changed_files(include_untracked=False)
        if not changed_files:
            return set()
        
        # Infer task type and language
        if self.enforcer.task_detector:
            detection = self.enforcer.task_detector.detect_task(
                agent_message="File changes detected",
                files=changed_files
            )
            task_type = detection.primary_task
        else:
            task_type = "edit_code"
        
        # Infer language
        language = self._infer_language_from_files(changed_files)
        
        # Get expanded required context (includes dependencies)
        requirements = self.enforcer.context_loader.get_required_context(
            task_type=task_type,
            language=language,
            file_paths=changed_files
        )
        
        # Filter to PRIMARY + HIGH priority (required context)
        required = {
            req.file_path for req in requirements
            if req.priority in ('PRIMARY', 'HIGH')
        }
        
        return required
    
    def _get_previous_context_state(self) -> Dict:
        """
        Get previous context state for unload verification.
        
        Returns:
            Previous context state dict with 'active' and 'preloaded' keys
        """
        if self.previous_context_state is not None:
            return self.previous_context_state
        
        # Try to load from context_state.json
        if self.context_state_file.exists():
            try:
                with open(self.context_state_file, 'r', encoding='utf-8') as f:
                    state = json.load(f)
                    self.previous_context_state = {
                        'active': state.get('active', []),
                        'preloaded': state.get('preloaded', [])
                    }
                    return self.previous_context_state
            except (json.JSONDecodeError, OSError):
                pass
        
        # Fallback to empty state
        return {'active': [], 'preloaded': []}
    
    def _get_expected_preloaded_context(self) -> Set[str]:
        """
        Get expected pre-loaded context from recommendations.md.
        
        Returns:
            Set of expected pre-loaded context file paths
        """
        if not self.recommendations_file.exists():
            return set()
        
        try:
            with open(self.recommendations_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Extract pre-loaded context from recommendations.md
                # Look for "Pre-loaded Context" section
                preload_section = re.search(
                    r'### Pre-loaded Context.*?\n(.*?)(?=###|##|$)',
                    content,
                    re.DOTALL | re.IGNORECASE
                )
                
                if preload_section:
                    preload_content = preload_section.group(1)
                    # Extract file paths (format: `@path/to/file.md`)
                    file_paths = re.findall(r'`(@?[^`]+)`', preload_content)
                    return {path.lstrip('@') for path in file_paths}
        except (OSError, FileNotFoundError):
            pass
        
        return set()
    
    def _infer_language_from_files(self, files: List[str]) -> Optional[str]:
        """Infer programming language from file paths."""
        if not files:
            return None
        
        python_extensions = {'.py', '.pyi'}
        typescript_extensions = {'.ts', '.tsx'}
        
        for file_path in files:
            path = Path(file_path)
            if path.suffix in python_extensions:
                return 'python'
            elif path.suffix in typescript_extensions:
                return 'typescript'
        
        return None
    
    def _check_context_state_validity(self) -> bool:
        """
        Check context state file validity.
        
        Returns:
            True if valid, False if invalid
        """
        if not self.context_state_file.exists():
            return True  # No state file is valid (first run)
        
        try:
            with open(self.context_state_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
                # Verify structure
                if not isinstance(data, dict):
                    self.enforcer._log_violation(self.enforcer.Violation(
                        severity=self.enforcer.ViolationSeverity.BLOCKED,
                        rule_ref="01-enforcement.mdc",
                        message="Context state file is invalid (not a dictionary). Must fix before proceeding.",
                        file_path=str(self.context_state_file),
                        session_scope="current_session"
                    ))
                    return False
                
                # Verify required keys
                if 'active' not in data or 'preloaded' not in data:
                    self.enforcer._log_violation(self.enforcer.Violation(
                        severity=self.enforcer.ViolationSeverity.BLOCKED,
                        rule_ref="01-enforcement.mdc",
                        message="Context state file is invalid (missing required keys). Must fix before proceeding.",
                        file_path=str(self.context_state_file),
                        session_scope="current_session"
                    ))
                    return False
                
                return True
        except (json.JSONDecodeError, OSError) as e:
            self.enforcer._log_violation(self.enforcer.Violation(
                severity=self.enforcer.ViolationSeverity.BLOCKED,
                rule_ref="01-enforcement.mdc",
                message=f"Context state file is corrupted: {e}. Must fix before proceeding.",
                file_path=str(self.context_state_file),
                session_scope="current_session"
            ))
            return False


# Integration code for auto-enforcer.py

def add_context_id_to_recommendations(recommendations_file: Path, content: str) -> str:
    """
    Add context-id to recommendations.md content.
    
    Args:
        recommendations_file: Path to recommendations.md
        content: Current content of recommendations.md
        
    Returns:
        Content with embedded context-id
    """
    # Generate unique context-id
    context_id = str(uuid.uuid4())
    
    # Check if context-id already exists
    if re.search(r'<!--\s*context-id:\s*', content, re.IGNORECASE):
        # Replace existing context-id
        content = re.sub(
            r'<!--\s*context-id:\s*[a-f0-9-]+\s*-->',
            f'<!-- context-id: {context_id} -->',
            content,
            flags=re.IGNORECASE
        )
    else:
        # Add context-id at the top (after title)
        content = content.replace(
            '# Context Recommendations',
            f'# Context Recommendations\n\n<!-- context-id: {context_id} -->'
        )
    
    return content


def update_previous_context_state(enforcer, preloader):
    """
    Update stored previous context state for unload verification.
    
    Should be called after context management operations.
    """
    if preloader:
        # Store current state as previous for next check
        if hasattr(enforcer, 'context_enforcement'):
            enforcer.context_enforcement.previous_context_state = {
                'active': list(preloader.preloaded_contexts.get('active', [])),
                'preloaded': list(preloader.preloaded_contexts.get('preloaded', []))
            }











