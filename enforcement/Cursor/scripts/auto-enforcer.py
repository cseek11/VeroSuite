#!/usr/bin/env python3
"""
VeroField Auto-Enforcement System
Main enforcement engine that checks compliance with all VeroField rules.

Features:
- Memory Bank compliance checks (6 files, staleness)
- Hardcoded date detection (02-core.mdc violation)
- Security file validation (03-security.mdc)
- activeContext.md update verification (Step 5 requirement)
- Error handling pattern validation (06-error-resilience.mdc)
- Structured logging compliance (07-observability.mdc)
- Python Bible compliance (python_bible.mdc)
- Bug logging validation (BUG_LOG.md updates)

Last Updated: See git history for current revision metadata
"""

import os
import sys
import re
import json
import uuid
import subprocess
import argparse
from dataclasses import dataclass
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Optional, Tuple, Set, Any

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from enforcement.config_paths import (
    get_rules_root,
    get_memory_bank_root,
    get_cursor_enforcer_root,
)
from enforcement.core.violations import Violation, ViolationSeverity, AutoFix
from enforcement.core.session_state import (
    EnforcementSession,
    load_session,
    save_session,
    get_file_hash,
)
from enforcement.core.scope_evaluator import (
    is_historical_dir_path,
    is_log_file,
)
from enforcement.core.historical import is_historical_path
from enforcement.core.git_utils import (
    GitUtils,
    get_git_state_key,
    get_changed_files_impl,
    run_git_command_cached,
)
from enforcement.core.file_scanner import is_file_modified_in_session
from enforcement.reporting import (
    BlockGenerator,
    ContextBundleBuilder,
    StatusGenerator,
    TwoBrainReporter,
    ViolationsLogger,
)

from enforcement.checks.date_checker import DateChecker
from enforcement.checks.security_checker import SecurityChecker
from enforcement.checks.memory_bank_checker import MemoryBankChecker
from enforcement.checks.error_handling_checker import ErrorHandlingChecker
from enforcement.checks.logging_checker import LoggingChecker
from enforcement.checks.python_bible_checker import PythonBibleChecker
from enforcement.checks.bug_logging_checker import BugLoggingChecker
from enforcement.checks.context_checker import ContextChecker

# Import modular checkers (Phase 4: Modular Architecture)
try:
    from enforcement.checkers.checker_registry import get_all_checker_classes
    from enforcement.checkers.checker_router import CheckerRouter
    from enforcement.checkers.base_checker import CheckerStatus
    MODULAR_CHECKERS_AVAILABLE = True
except ImportError:
    MODULAR_CHECKERS_AVAILABLE = False
    get_all_checker_classes = None
    CheckerRouter = None

# Lazy loading for context management modules (memory optimization)
# Only import when actually needed, not at module load time
# This reduces initial memory footprint by ~2-5MB (Python Bible Chapter 12.4.2)
PREDICTIVE_CONTEXT_AVAILABLE = None  # Will be determined lazily
_CONTEXT_MANAGER_MODULES = {}  # Cache for lazy-loaded modules


def _lazy_import_context_manager(module_name: str):
    """
    Lazy import context manager modules to reduce memory usage.
    
    Python Bible Chapter 12.4.2: Lazy imports reduce initial memory footprint.
    Only import modules when they're actually needed.
    
    Args:
        module_name: Name of module to import (e.g., 'TaskDetector')
        
    Returns:
        Module class or None if not available
    """
    global PREDICTIVE_CONTEXT_AVAILABLE, _CONTEXT_MANAGER_MODULES
    
    # Check if already cached
    if module_name in _CONTEXT_MANAGER_MODULES:
        return _CONTEXT_MANAGER_MODULES[module_name]
    
    # Check availability once (cache result)
    if PREDICTIVE_CONTEXT_AVAILABLE is None:
        context_manager_path = project_root / ".cursor" / "context_manager"
        PREDICTIVE_CONTEXT_AVAILABLE = context_manager_path.exists()
        
        if PREDICTIVE_CONTEXT_AVAILABLE:
            sys.path.insert(0, str(context_manager_path.parent))
    
    # Return None if not available
    if not PREDICTIVE_CONTEXT_AVAILABLE:
        return None
    
    # Lazy import specific module
    try:
        module_map = {
            'TaskDetector': 'context_manager.task_detector',
            'ContextLoader': 'context_manager.context_loader',
            'WorkflowTracker': 'context_manager.workflow_tracker',
            'ContextPredictor': 'context_manager.predictor',
            'ContextPreloader': 'context_manager.preloader',
            'AgentResponseParser': 'context_manager.response_parser',
            'RuleFileManager': 'context_manager.rule_file_manager',
            'ContextCategorizer': 'context_manager.context_categorizer',
            'SessionSequenceTracker': 'context_manager.session_sequence_tracker',
        }
        
        if module_name not in module_map:
            return None
        
        module = __import__(module_map[module_name], fromlist=[module_name])
        cls = getattr(module, module_name)
        _CONTEXT_MANAGER_MODULES[module_name] = cls
        return cls
    except (ImportError, AttributeError):
        return None

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="auto_enforcer")
    _LOGGER_SUPPORTS_OPERATION = True
except ImportError:
    # Fallback logger if logger_util not available
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("auto_enforcer")
    _LOGGER_SUPPORTS_OPERATION = False


def _safe_log_info(message: str, **kwargs):
    """
    Safely log info message, handling both custom and standard loggers.
    
    Args:
        message: Log message
        **kwargs: Additional keyword arguments (operation, etc.)
    """
    if _LOGGER_SUPPORTS_OPERATION:
        logger.info(message, **kwargs)
    else:
        # Standard logger - format message with kwargs
        if kwargs:
            extra_info = ", ".join(f"{k}={v}" for k, v in kwargs.items())
            logger.info(f"{message} ({extra_info})")
        else:
            logger.info(message)


def _use_ascii_output() -> bool:
    """
    Detect if console supports UTF-8 or needs ASCII-safe alternatives.
    
    Returns:
        True if ASCII-safe alternatives should be used, False if UTF-8 is supported
    """
    if sys.platform != 'win32':
        return False  # Unix/Linux/Mac typically support UTF-8
    
    try:
        encoding = sys.stdout.encoding or 'utf-8'
        # Windows console often uses cp1252 which doesn't support emojis
        if encoding.lower() in ('cp1252', 'windows-1252', 'ascii', 'ansi'):
            return True
        # Try to detect UTF-8 support by checking if we can encode emoji
        test_emoji = "🔄"
        test_emoji.encode('utf-8')
        return False
    except (AttributeError, UnicodeEncodeError, OSError, UnicodeError):
        return True  # Default to ASCII-safe if we can't determine


@dataclass
class CheckerContext:
    changed_files_all: List[str]
    changed_files_tracked: List[str]
    changed_files_untracked: List[str]
    classification_map: Dict[str, str]
    skip_non_critical: bool
    violation_scope: str


class VeroFieldEnforcer:
    """
    Main enforcement engine for VeroField rules.
    
    Checks compliance with:
    - Memory Bank requirements (Step 0)
    - Date handling (02-core.mdc)
    - Security rules (03-security.mdc)
    - Error handling (06-error-resilience.mdc)
    - Logging (07-observability.mdc)
    - Python Bible (python_bible.mdc)
    - Bug logging
    """
    
    # Required Memory Bank files
    MEMORY_BANK_FILES = [
        "projectbrief.md",
        "productContext.md",
        "systemPatterns.md",
        "techContext.md",
        "activeContext.md",
        "progress.md"
    ]
    
    # Security-sensitive files
    SECURITY_FILES = [
        ".cursor/enforcement/rules/03-security.mdc",  # Updated for Two-Brain Model
        "libs/common/prisma/schema.prisma",
        "apps/api/src/**/*auth*.ts",
        "apps/api/src/**/*tenant*.ts"
    ]
    
    
    # Current system date (for comparison)
    CURRENT_DATE = datetime.now().strftime("%Y-%m-%d")
    MAX_FILE_BYTES = 5 * 1024 * 1024  # 5MB temporary size cap to skip oversized files
    
    def __init__(self, project_root: Optional[Path] = None):
        """Initialize enforcer."""
        self.project_root = project_root or Path(__file__).parent.parent.parent
        self.enforcement_dir = get_cursor_enforcer_root(self.project_root)
        self.memory_bank_dir = get_memory_bank_root(self.project_root)
        self.session: Optional[EnforcementSession] = None
        self.violations: List[Violation] = []
        
        # Initialize predictor to None first (before load_session potentially uses it)
        self.predictor = None
        self.session_sequence_tracker = None
        
        # Ensure enforcement directory exists
        self.enforcement_dir.mkdir(parents=True, exist_ok=True)
        
        self.session, self.session_sequence_tracker = load_session(
            self.enforcement_dir,
            predictor=self.predictor if hasattr(self, 'predictor') else None,
            session_sequence_tracker_ref=self.session_sequence_tracker
        )
        
        # Git utilities helper (manages git interactions and caching)
        self.git_utils = GitUtils(self.project_root)
        
        # Phase 4: Initialize modular checker router (if available)
        self.checker_router = None
        self.use_modular_checkers = False
        if MODULAR_CHECKERS_AVAILABLE and CheckerRouter:
            try:
                rules_dir = get_rules_root(self.project_root)
                if rules_dir.exists():
                    self.checker_router = CheckerRouter(self.project_root, rules_dir)
                    self.use_modular_checkers = True
                    logger.info(
                        "Modular checker router initialized",
                        operation="__init__"
                    )
            except Exception as e:
                logger.warn(
                    f"Failed to initialize modular checker router: {e}",
                    operation="__init__",
                    error_code="CHECKER_ROUTER_INIT_FAILED",
                    root_cause=str(e)
                )
        
        # Initialize predictive context management (lazy loading - memory optimization)
        # Python Bible Chapter 12.4.2: Lazy imports reduce initial memory footprint
        try:
            TaskDetectorCls = _lazy_import_context_manager('TaskDetector')
            ContextLoaderCls = _lazy_import_context_manager('ContextLoader')
            WorkflowTrackerCls = _lazy_import_context_manager('WorkflowTracker')
            ContextPredictorCls = _lazy_import_context_manager('ContextPredictor')
            ContextPreloaderCls = _lazy_import_context_manager('ContextPreloader')
            AgentResponseParserCls = _lazy_import_context_manager('AgentResponseParser')
            
            if all([TaskDetectorCls, ContextLoaderCls, WorkflowTrackerCls, 
                    ContextPredictorCls, ContextPreloaderCls, AgentResponseParserCls]):
                self.task_detector = TaskDetectorCls()
                self.context_loader = ContextLoaderCls()
                self.workflow_tracker = WorkflowTrackerCls()
                self.predictor = ContextPredictorCls(self.workflow_tracker)
                self.preloader = ContextPreloaderCls(self.predictor, self.context_loader)
                self.response_parser = AgentResponseParserCls()
                
                # Initialize session sequence tracker (for session-aware predictions)
                # CRITICAL FIX: Initialize tracker AFTER predictor is created
                # If tracker wasn't initialized in load_session(), initialize it now
                if not self.session_sequence_tracker and self.session:
                    try:
                        SessionSequenceTrackerCls = _lazy_import_context_manager('SessionSequenceTracker')
                        if SessionSequenceTrackerCls:
                            self.session_sequence_tracker = SessionSequenceTrackerCls(self.session.session_id)
                            logger.info(
                                "Session sequence tracker initialized (after predictor)",
                                operation="__init__",
                                session_id=self.session.session_id
                            )
                    except Exception as e:
                        logger.warn(
                            f"Failed to initialize session sequence tracker: {e}",
                            operation="__init__",
                            error_code="SESSION_SEQUENCE_TRACKER_INIT_FAILED",
                            root_cause=str(e)
                        )
                        self.session_sequence_tracker = None
                
                logger.info(
                    "Predictive context management initialized",
                    operation="__init__"
                )
                # Console output for visibility (with encoding fallback)
                if __name__ == '__main__':
                    if _use_ascii_output():
                        print("   [OK] Predictive context management initialized")
                    else:
                        print("   ✓ Predictive context management initialized")
            else:
                # Lazy loading failed - modules not available
                self.task_detector = None
                self.context_loader = None
                self.workflow_tracker = None
                self.predictor = None
                self.preloader = None
                self.response_parser = None
        except Exception as e:
            logger.warn(
                f"Failed to initialize predictive context management: {e}",
                operation="__init__",
                error_code="PREDICTIVE_CONTEXT_INIT_FAILED",
                root_cause=str(e)
            )
            self.task_detector = None
            self.context_loader = None
            self.workflow_tracker = None
            self.predictor = None
            self.preloader = None
            self.response_parser = None
            self.session_sequence_tracker = None
            self.session_sequence_tracker = None
        
        # Agent response storage for verification
        self._last_agent_response = ""
        
        # Try to load agent response from file (if agent wrote it)
        self._load_agent_response_from_file()
        
        logger.info(
            "VeroFieldEnforcer initialized",
            operation="__init__",
            project_root=str(self.project_root),
            enforcement_dir=str(self.enforcement_dir),
            predictive_context_enabled=PREDICTIVE_CONTEXT_AVAILABLE and self.predictor is not None,
            agent_response_loaded=bool(self._last_agent_response)
        )
        # Console output for visibility (only when run as script, not when imported)
        if __name__ == '__main__':
            if _use_ascii_output():
                print("   [OK] Session loaded: " + self.session.session_id[:8] + "...")
            else:
                print("   ✓ Session loaded: " + self.session.session_id[:8] + "...")
    
    def _load_agent_response_from_file(self):
        """
        Load agent response from file if it exists and is recent.
        
        The agent can write its response to `.cursor/enforcement/agent_response.txt`
        and the enforcer will automatically read it.
        
        Only loads response if file is recent (within last 10 minutes) to avoid
        checking stale responses against fresh recommendations.
        """
        response_file = self.enforcement_dir / "agent_response.txt"
        if response_file.exists():
            try:
                # Check if file is recent (within last 10 minutes)
                stat_info = response_file.stat()
                mod_time = datetime.fromtimestamp(stat_info.st_mtime, tz=timezone.utc)
                now = datetime.now(timezone.utc)
                age_seconds = (now - mod_time).total_seconds()
                
                # Only load if file is recent (within 10 minutes = 600 seconds)
                if age_seconds > 600:
                    logger.debug(
                        f"Agent response file is stale (age: {age_seconds}s), skipping",
                        operation="_load_agent_response_from_file",
                        age_seconds=age_seconds,
                        max_age_seconds=600
                    )
                    # Clear stale response
                    self._last_agent_response = ""
                    return
                
                with open(response_file, 'r', encoding='utf-8') as f:
                    self._last_agent_response = f.read()
                logger.debug(
                    "Agent response loaded from file",
                    operation="_load_agent_response_from_file",
                    response_length=len(self._last_agent_response),
                    age_seconds=age_seconds
                )
            except (OSError, FileNotFoundError, PermissionError, UnicodeDecodeError) as e:
                logger.debug(
                    f"Could not load agent response from file: {e}",
                    operation="_load_agent_response_from_file",
                    error_code="RESPONSE_FILE_READ_FAILED",
                    root_cause=str(e)
                )
                self._last_agent_response = ""
    
    def set_agent_response(self, response: str):
        """
        Store last agent response for verification (Two-Brain Model: Step 0.5/4.5 removed).
        
        This should be called by the system that captures agent responses
        (e.g., Cursor's agent response handler).
        
        Args:
            response: The agent's text response
        """
        self._last_agent_response = response
        logger.debug(
            "Agent response stored for verification",
            operation="set_agent_response",
            response_length=len(response)
        )
    
    def _log_violation(self, violation: Violation):
        """Log violation and add to session."""
        # Log violation creation with diagnostic information
        violation_msg = violation.message[:100] if len(violation.message) > 100 else violation.message
        logger.info(
            f"Violation logged: {violation.rule_ref} - {violation_msg}",
            operation="_log_violation",
            rule_ref=violation.rule_ref,
            severity=violation.severity.value,
            session_scope=violation.session_scope,
            file_path=violation.file_path,
            line_number=violation.line_number
        )
        
        self.violations.append(violation)
        
        # Convert violation to dict for session storage (convert Enum to value)
        violation_dict = {
            "severity": violation.severity.value,
            "rule_ref": violation.rule_ref,
            "message": violation.message,
            "file_path": violation.file_path,
            "line_number": violation.line_number,
            "timestamp": violation.timestamp,
            "session_scope": violation.session_scope,
            "fix_hint": violation.fix_hint
        }
        self.session.violations.append(violation_dict)
        
        # Log based on severity (don't include 'message' in kwargs since it's the first arg)
        log_data = {
            "operation": "_log_violation",
            "severity": violation.severity.value,
            "rule_ref": violation.rule_ref,
            "file_path": violation.file_path,
            "line_number": violation.line_number,
            "session_scope": violation.session_scope
        }
        
        if violation.severity == ViolationSeverity.BLOCKED:
            logger.error(f"Rule violation - BLOCKED: {violation.message}", **log_data)
        elif violation.severity == ViolationSeverity.WARNING:
            logger.warn(f"Rule violation - WARNING: {violation.message}", **log_data)
        else:
            logger.info(f"Rule violation - INFO: {violation.message}", **log_data)
    
    def _report_success(self, check_name: str):
        """Report successful check."""
        self.session.checks_passed.append(check_name)
        logger.info(
            f"Check passed: {check_name}",
            operation="_report_success",
            check_name=check_name
        )
    
    def _report_failure(self, check_name: str):
        """Report failed check."""
        self.session.checks_failed.append(check_name)
        logger.warn(
            f"Check failed: {check_name}",
            operation="_report_failure",
            check_name=check_name
        )
    
    def _get_changed_files_for_session(self) -> List[str]:
        """
        Get changed files for current session (incremental scan).
        
        Returns files that have changed since the last full scan or last check.
        This is used for fast incremental scans between tasks.
        
        Returns:
            List of changed file paths (tracked + untracked)
        """
        # Get all changed files (tracked + untracked)
        tracked = get_changed_files_impl(self.project_root, include_untracked=False)
        untracked = get_changed_files_impl(self.project_root, include_untracked=True)
        return sorted(set(tracked) | set(untracked))
    
    # ============================================================================
    # Context Management Enforcement Methods
    # ============================================================================
    
    # Two-Brain Model: _verify_agent_behavior() removed
    # Step 0.5/4.5 compliance checks are no longer needed
    # Context management is handled by enforcer internally, not by LLM
    
    # Two-Brain Model: Step 0.5/4.5 compliance check methods removed
    # Context management is now handled by enforcer internally, not by LLM
    # These methods are no longer needed in Two-Brain Model
    
    def _verify_context_id_match(self) -> tuple[bool, Optional[str]]:
        """
        Verify agent's context-id matches latest recommendations.md.
        
        This is 100% reliable and platform-independent.
        
        Returns:
            Tuple of (is_match: bool, latest_context_id: Optional[str])
        """
        recommendations_file = self.project_root / ".cursor" / "context_manager" / "recommendations.md"
        
        # Extract context-id from recommendations.md
        try:
            if not recommendations_file.exists():
                return (False, None)
            
            with open(recommendations_file, 'r', encoding='utf-8') as f:
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
            logger.warn(
                f"Could not read recommendations.md: {e}",
                operation="_verify_context_id_match",
                file_path=str(recommendations_file)
            )
            return (False, None)
        
        # Check if file is recent (generated within last 5 minutes)
        try:
            stat_info = recommendations_file.stat()
            mod_time = datetime.fromtimestamp(stat_info.st_mtime, tz=timezone.utc)
            now = datetime.now(timezone.utc)
            age_seconds = (now - mod_time).total_seconds()
            
            # File must be generated within last 5 minutes (300 seconds)
            if age_seconds > 300:
                logger.warn(
                    f"recommendations.md is stale (age: {age_seconds}s)",
                    operation="_verify_context_id_match",
                    file_path=str(recommendations_file),
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
        if not self.context_loader:
            return set()
        
        changed_files = self.git_utils.get_changed_files(include_untracked=False)
        if not changed_files:
            return set()
        
        # Infer task type
        if self.task_detector:
            detection = self.task_detector.detect_task(
                agent_message="File changes detected",
                files=changed_files
            )
            task_type = detection.primary_task
        else:
            task_type = "edit_code"
        
        # Infer language
        language = self._infer_language_from_files(changed_files)
        
        # Get expanded required context (includes dependencies)
        requirements = self.context_loader.get_required_context(
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
        context_state_file = self.project_root / ".cursor" / "context_manager" / "context_state.json"
        
        if context_state_file.exists():
            try:
                with open(context_state_file, 'r', encoding='utf-8') as f:
                    state = json.load(f)
                    return {
                        'active': state.get('active', []),
                        'preloaded': state.get('preloaded', [])
                    }
            except (json.JSONDecodeError, OSError):
                pass
        
        # Fallback to empty state
        return {'active': [], 'preloaded': []}
    
    def _get_expected_preloaded_context(self) -> Set[str]:
        """
        Get expected pre-loaded context from recommendations.md.
        
        Improved parsing: Uses more robust regex patterns to extract file paths
        from the "Pre-loaded Context" section.
        
        Returns:
            Set of expected pre-loaded context file paths
        """
        recommendations_file = self.project_root / ".cursor" / "context_manager" / "recommendations.md"
        
        if not recommendations_file.exists():
            return set()
        
        try:
            with open(recommendations_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Extract pre-loaded context from recommendations.md
                # Look for "Pre-loaded Context" section (more robust pattern)
                preload_section = re.search(
                    r'## Pre-loaded Context.*?\n(.*?)(?=##|$)',
                    content,
                    re.DOTALL | re.IGNORECASE
                )
                
                if not preload_section:
                    # Try alternative heading format
                    preload_section = re.search(
                        r'### Pre-loaded Context.*?\n(.*?)(?=###|##|$)',
                        content,
                        re.DOTALL | re.IGNORECASE
                    )
                
                if preload_section:
                    preload_content = preload_section.group(1)
                    # Extract file paths - multiple patterns for robustness
                    file_paths = set()
                    
                    # Pattern 1: `@path/to/file.md` (with @)
                    matches = re.findall(r'`@([^`]+)`', preload_content)
                    file_paths.update(matches)
                    
                    # Pattern 2: `path/to/file.md` (without @)
                    matches = re.findall(r'`([^`]+\.(?:md|mdc|ts|tsx|py|json|yaml|yml))`', preload_content)
                    file_paths.update(matches)
                    
                    # Pattern 3: @path/to/file.md (direct mention)
                    matches = re.findall(r'@([\w\./-]+\.(?:md|mdc|ts|tsx|py|json|yaml|yml))', preload_content)
                    file_paths.update(matches)
                    
                    return file_paths
        except (OSError, FileNotFoundError) as e:
            logger.debug(
                f"Failed to read recommendations.md for pre-loaded context: {e}",
                operation="_get_expected_preloaded_context",
                file_path=str(recommendations_file)
            )
        
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
        context_state_file = self.project_root / ".cursor" / "context_manager" / "context_state.json"
        
        if not context_state_file.exists():
            return True  # No state file is valid (first run)
        
        try:
            with open(context_state_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
                # Verify structure
                if not isinstance(data, dict):
                    self._log_violation(Violation(
                        severity=ViolationSeverity.BLOCKED,
                        rule_ref="01-enforcement.mdc",
                        message="Context state file is invalid (not a dictionary). Must fix before proceeding.",
                        file_path=str(context_state_file),
                        session_scope="current_session"
                    ))
                    return False
                
                # Verify required keys
                if 'active' not in data or 'preloaded' not in data:
                    self._log_violation(Violation(
                        severity=ViolationSeverity.BLOCKED,
                        rule_ref="01-enforcement.mdc",
                        message="Context state file is invalid (missing required keys). Must fix before proceeding.",
                        file_path=str(context_state_file),
                        session_scope="current_session"
                    ))
                    return False
                
                return True
        except (json.JSONDecodeError, OSError) as e:
            self._log_violation(Violation(
                severity=ViolationSeverity.BLOCKED,
                rule_ref="01-enforcement.mdc",
                message=f"Context state file is corrupted: {e}. Must fix before proceeding.",
                file_path=str(context_state_file),
                session_scope="current_session"
            ))
            return False
    
    # ============================================================================
    # End Context Management Enforcement Methods
    # ============================================================================
    
    
    
    def re_evaluate_violation_scope(self, violation: Violation) -> str:
        """
        Re-evaluate a violation's session scope using conservative rules.
        
        - Historical directories (docs/auto-pr, docs/archive, docs/historical) always return "historical"
        - Existing "historical" scopes remain historical
        - All other cases default to "current_session" (no cache/diff downgrades)
        """
        # Default to the violation's existing scope (fallback to current_session)
        original_scope = violation.session_scope or "current_session"
        
        if not violation.file_path:
            return original_scope
        
        file_path_str = violation.file_path
        
        if is_historical_dir_path(file_path_str):
            logger.debug(
                "Re-evaluating violation scope: historical directory match",
                operation="re_evaluate_violation_scope",
                file_path=file_path_str,
                original_scope=original_scope,
                new_scope="historical"
            )
            return "historical"
        
        if original_scope == "historical":
            return "historical"
        
        # All other cases stay as current_session (conservative default)
        return "current_session"
    
    def track_auto_fix(self, violation: Violation, fix_type: str, 
                       fix_description: str, before_state: str, 
                       after_state: str):
        """Track an auto-fix action."""
        auto_fix = AutoFix(
            violation_id=f"{violation.file_path}:{violation.line_number}",
            rule_ref=violation.rule_ref,
            file_path=violation.file_path,
            line_number=violation.line_number,
            fix_type=fix_type,
            fix_description=fix_description,
            before_state=before_state,
            after_state=after_state,
            timestamp=datetime.now(timezone.utc).isoformat(),
            session_id=self.session.session_id
        )
        
        # Convert to dict for session storage
        auto_fix_dict = {
            "violation_id": auto_fix.violation_id,
            "rule_ref": auto_fix.rule_ref,
            "file_path": auto_fix.file_path,
            "line_number": auto_fix.line_number,
            "fix_type": auto_fix.fix_type,
            "fix_description": auto_fix.fix_description,
            "before_state": auto_fix.before_state,
            "after_state": auto_fix.after_state,
            "timestamp": auto_fix.timestamp
        }
        
        self.session.auto_fixes.append(auto_fix_dict)
        save_session(self.session, self.enforcement_dir)
        
        logger.info(
            f"Auto-fix tracked: {fix_description}",
            operation="track_auto_fix",
            rule_ref=violation.rule_ref,
            file_path=violation.file_path,
            fix_type=fix_type
            )
    
    def _pre_flight_check(self) -> bool:
        """
        Pre-flight check before any task execution.
        
        Verifies context management system is ready.
        
        Returns:
            True if ready, False if blocked
        """
        # Verify context management system is ready
        if PREDICTIVE_CONTEXT_AVAILABLE:
            if not self._check_context_state_validity():
                logger.error(
                    "Pre-flight check failed: Context state invalid",
                    operation="_pre_flight_check",
                    error_code="PRE_FLIGHT_FAILED"
                )
                return False
        
        return True
    
    def run_all_checks(self, user_message: Optional[str] = None, scope: str = "full", max_files: Optional[int] = None) -> bool:
        """
        Run all compliance checks.
        
        CRITICAL FIX: Recommendations are updated BEFORE enforcement checks
        to ensure agent has latest context when starting Step 0.5.
        
        Args:
            user_message: Optional user message to pass to context recommendations
            scope: Scan scope - "full" for baseline scan (all files), "current_session" for incremental (changed files only)
            max_files: DEBUG: Limit number of files processed (for debugging hangs)
        """
        # FIRST: generate fresh recommendations and context-id
        # This must happen BEFORE enforcement checks so agent has latest context
        if PREDICTIVE_CONTEXT_AVAILABLE:
            try:
                self._update_context_recommendations(user_message=user_message)
                logger.debug(
                    "Context recommendations updated before enforcement checks",
                    operation="run_all_checks"
                )
            except Exception as e:
                logger.error(
                    f"Failed to update context recommendations: {e}",
                    operation="run_all_checks",
                    error_code="CONTEXT_UPDATE_FAILED",
                    root_cause=str(e)
                )
                # Continue with checks even if update failed (may use stale recommendations)
        
        # THEN: enforce compliance (agent must acknowledge fresh recommendations)
        logger.info(
            "Starting compliance checks",
            operation="run_all_checks",
            session_id=self.session.session_id
        )
        
        # Pre-flight check (context state validity)
        if not self._pre_flight_check():
            logger.error(
                "Pre-flight check failed, blocking execution",
                operation="run_all_checks",
                error_code="PRE_FLIGHT_BLOCKED"
            )
            return False
        
        # Clear previous violations for this run
        self.violations = []
        
        # Determine violation scope based on scan mode
        violation_scope = "historical" if scope == "full" else "current_session"
        
        logger.info(
            f"Running {scope} scan (violation_scope: {violation_scope})",
            operation="run_all_checks",
            scope=scope,
            violation_scope=violation_scope
        )
        
        # Get files to check based on scope
        def _filter_paths(paths: List[str]) -> List[str]:
            filtered: List[str] = []
            for path_str in paths:
                norm = str(path_str).replace("\\", "/")
                if is_historical_dir_path(norm) or is_historical_path(norm):
                    continue
                try:
                    file_path = self.project_root / path_str
                    if file_path.exists() and file_path.is_file():
                        size_bytes = file_path.stat().st_size
                        if size_bytes >= self.MAX_FILE_BYTES:
                            logger.info(
                                "Skipping large file",
                                operation="run_all_checks",
                                file_path=str(file_path),
                                size_bytes=size_bytes,
                                max_bytes=self.MAX_FILE_BYTES
                            )
                            continue
                except OSError:
                    # If stat fails, keep the file to avoid silently dropping needed checks
                    pass
                filtered.append(path_str)
            return filtered

        if scope == "current_session":
            self.git_utils.clear_diff_cache()
            tracked_files = self.git_utils.get_changed_files(include_untracked=False) or []
            changed_with_untracked = self.git_utils.get_changed_files(include_untracked=True) or []
            untracked_files = [f for f in changed_with_untracked if f not in tracked_files]
            all_changed_files = changed_with_untracked
            classification_map = self.git_utils.get_changed_file_classifications() or {}
            changed_files_count = len(tracked_files)
            untracked_count = len(untracked_files)
            skip_non_critical = (changed_files_count + untracked_count) > 200
            logger.info(
                f"Incremental scan: checking {len(all_changed_files)} changed files",
                operation="run_all_checks",
                files_count=len(all_changed_files)
            )
        else:
            cache_key = get_git_state_key(self.project_root)
            cached_key = self.git_utils.get_cache_key()
            cached_changed_files = self.git_utils.get_cached_changed_files()
            if cached_changed_files is None or cached_key != cache_key:
                if cached_key is not None and cached_key != cache_key:
                    self.git_utils.clear_diff_cache()
                    run_git_command_cached.cache_clear()
                    logger.debug(
                        "Cleared file diff cache and git command cache due to git state change",
                        operation="run_all_checks",
                        old_key=cached_key,
                        new_key=cache_key
                    )
                logger.debug(
                    "Populating changed files cache",
                    operation="run_all_checks",
                    cache_key=cache_key,
                    previous_key=cached_key
                )
                self.git_utils.update_cache(cache_key)
                cached_changed_files = self.git_utils.get_cached_changed_files()
            else:
                logger.debug(
                    "Using existing changed files cache",
                    operation="run_all_checks",
                    cache_key=cache_key
                )

            tracked_files = cached_changed_files['tracked']
            untracked_files = cached_changed_files['untracked']
            all_changed_files = tracked_files + untracked_files
            classification_map = self.git_utils.get_changed_file_classifications() or {}
            changed_files_count = len(tracked_files)
            untracked_count = len(untracked_files)
            has_untracked = untracked_count > 0
            skip_non_critical = changed_files_count > 100 and not has_untracked

            if has_untracked:
                logger.info(
                    f"Including {untracked_count} untracked files in enforcement checks",
                    operation="run_all_checks",
                    tracked_count=changed_files_count,
                    untracked_count=untracked_count
                )

            if skip_non_critical:
                logger.info(
                    f"Large number of changed files ({changed_files_count}), skipping non-critical checks",
                    operation="run_all_checks",
                    changed_files_count=changed_files_count
                )
            elif has_untracked:
                logger.info(
                    f"Untracked files detected, running all checks despite {changed_files_count} changed files",
                    operation="run_all_checks",
                    changed_files_count=changed_files_count
                )

        filtered_all = _filter_paths(all_changed_files)
        filtered_tracked = _filter_paths(tracked_files)
        filtered_untracked = _filter_paths(untracked_files)

        checker_context = CheckerContext(
            changed_files_all=filtered_all,
            changed_files_tracked=filtered_tracked,
            changed_files_untracked=filtered_untracked,
            classification_map=classification_map or {},
            skip_non_critical=skip_non_critical,
            violation_scope=violation_scope,
        )
        
        # DEBUG: Apply file limit if specified (for debugging hangs)
        if max_files is not None and len(checker_context.changed_files_all) > max_files:
            original_count = len(checker_context.changed_files_all)
            checker_context.changed_files_all = checker_context.changed_files_all[:max_files]
            logger.warn(
                f"DEBUG: Limiting files to {max_files} (was {original_count})",
                operation="run_all_checks",
                original_count=original_count,
                limited_count=max_files
            )
            print(f"[DEBUG] Limiting files to {max_files} (was {original_count})", flush=True)
        
        # Phase 4: Use modular checkers if available, otherwise fall back to legacy methods
        if self.use_modular_checkers and self.checker_router:
            try:
                self._run_modular_checkers(checker_context, user_message=user_message)
            except Exception as e:
                logger.error(
                    f"Modular checkers failed, falling back to legacy methods: {e}",
                    operation="run_all_checks",
                    error_code="MODULAR_CHECKERS_FAILED",
                    root_cause=str(e)
                )
                # Fall back to legacy methods
                self._run_legacy_checks(checker_context)
        else:
            # Use legacy check methods
            self._run_legacy_checks(checker_context)
        
        # Update session
        self.session.last_check = datetime.now(timezone.utc).isoformat()
        save_session(self.session, self.enforcement_dir)
        
        status_generator = StatusGenerator()
        violations_logger = ViolationsLogger()
        block_generator = BlockGenerator()

        status_generator.generate_agent_status(
            self.violations,
            self.session,
            self.enforcement_dir,
            self.re_evaluate_violation_scope,
            save_session,
        )
        violations_logger.generate_violations_log(
            self.violations,
            self.session,
            self.enforcement_dir,
        )
        block_generator.generate_agent_reminders(
            self.violations,
            self.session,
            self.enforcement_dir,
        )
        status_generator.generate_auto_fixes_summary(
            self.session,
            self.enforcement_dir,
        )
        block_generator.generate_enforcement_block_message(
            self.violations,
            self.session,
            self.enforcement_dir,
        )

        context_bundle = {}
        try:
            context_bundle_builder = ContextBundleBuilder()
            context_bundle = context_bundle_builder.build_context_bundle(
                violations=self.violations,
                changed_files=checker_context.changed_files_all,
                project_root=self.project_root,
                git_utils=self.git_utils,
            )
        except Exception as e:
            logger.error(
                f"Failed to build context bundle: {e}",
                operation="run_all_checks",
                error_code="CONTEXT_BUNDLE_FAILED",
                root_cause=str(e),
            )
            context_bundle = {}

        reporter = TwoBrainReporter()
        report = reporter.generate_report(
            violations=self.violations,
            session=self.session,
            enforcement_dir=self.enforcement_dir,
            project_root=self.project_root,
            context_bundle=context_bundle,
        )
        
        # Generate handshake files (ENFORCER_STATUS.md, ACTIVE_VIOLATIONS.md, ACTIVE_CONTEXT_DUMP.md)
        # These files provide Brain 1 (LLM) with status, violations, and context
        if report is not None:
            try:
                import sys
                enforcement_path = self.project_root / ".cursor" / "enforcement"
                if str(enforcement_path) not in sys.path:
                    sys.path.insert(0, str(enforcement_path.parent))
                from enforcement.handshake_generator import HandshakeGenerator
                
                handshake_gen = HandshakeGenerator(self.enforcement_dir)
                handshake_gen.generate_all(report)
                
                logger.info(
                    "Handshake files generated",
                    operation="run_all_checks",
                    status=report.get_status()
                )
            except Exception as e:
                # Don't fail the entire run if handshake generation fails
                logger.warn(
                    f"Failed to generate handshake files: {e}",
                    operation="run_all_checks",
                    error_code="HANDSHAKE_GENERATION_FAILED",
                    root_cause=str(e)
                )
        
        # Memory optimization: Clear large in-memory structures after generating reports
        # Python Bible Chapter 12.4.1: Clear large structures after use
        # Keep violations in session for persistence, but clear in-memory list
        # (session.violations already saved, so safe to clear)
        if hasattr(self, 'violations') and len(self.violations) > 100:
            # Keep only recent violations in memory (last 100 for potential re-use)
            self.violations = self.violations[-100:]
            logger.debug(
                "Cleared large violation list after report generation",
                operation="run_all_checks",
                violations_kept=len(self.violations)
            )
        
        # Note: Context recommendations are now updated at the BEGINNING of run_all_checks()
        # to ensure agent has latest context before Step 0.5 compliance checks
        
        # Return True if no blocked violations
        blocked_violations = [v for v in self.violations if v.severity == ViolationSeverity.BLOCKED]
        return len(blocked_violations) == 0
    
    def _run_modular_checkers(
        self,
        checker_context: CheckerContext,
        user_message: Optional[str] = None,
    ):
        """
        Run checks using modular checker architecture.
        
        Phase 4: Modular Enforcer Architecture
        
        Args:
            changed_files: List of changed file paths
            user_message: Optional user message
            skip_non_critical: Whether to skip non-critical checks
            violation_scope: Scope for violations - "current_session" or "historical"
        """
        changed_files = checker_context.changed_files_all
        skip_non_critical = checker_context.skip_non_critical
        violation_scope = checker_context.violation_scope
        classification_map = checker_context.classification_map if checker_context.classification_map is not None else {}
        if not self.checker_router or not MODULAR_CHECKERS_AVAILABLE:
            return
        
        # Get all available checker classes
        available_checkers = get_all_checker_classes()
        
        # Use router to determine which checkers should run
        checkers_to_run = self.checker_router.get_checkers_to_run(
            changed_files,
            available_checkers
        )
        
        import time
        
        logger.info(
            f"Running {len(checkers_to_run)} modular checkers",
            operation="_run_modular_checkers",
            total_checkers=len(checkers_to_run),
            files_count=len(changed_files)
        )
        
        # Print to stdout for immediate visibility
        print(f"[MODULAR_CHECKERS] Starting {len(checkers_to_run)} checkers on {len(changed_files)} files", flush=True)
        
        # Run each checker with detailed logging
        for idx, checker in enumerate(checkers_to_run, 1):
            checker_name = getattr(checker, 'rule_ref', getattr(checker, '__class__', {}).__name__ if hasattr(checker, '__class__') else 'Unknown')
            start_time = time.perf_counter()
            
            # Log checker start
            logger.info(
                f"Starting checker {idx}/{len(checkers_to_run)}: {checker_name}",
                operation="_run_modular_checkers",
                checker_index=idx,
                total_checkers=len(checkers_to_run),
                checker_name=checker_name,
                files_count=len(changed_files)
            )
            print(f"[MODULAR_CHECKERS] [{idx}/{len(checkers_to_run)}] Starting: {checker_name}", flush=True)
            
            try:
                # Skip non-critical checkers if requested
                if skip_non_critical and not checker.always_apply:
                    logger.info(
                        f"Skipping non-critical checker: {checker_name}",
                        operation="_run_modular_checkers",
                        checker_name=checker_name
                    )
                    print(f"[MODULAR_CHECKERS] [{idx}/{len(checkers_to_run)}] SKIPPED (non-critical): {checker_name}", flush=True)
                    continue
                
                # Execute checker
                try:
                    result = checker.check(changed_files, user_message, classification_map=classification_map)
                except TypeError:
                    result = checker.check(changed_files, user_message)
                
                # Convert CheckerResult violations to Violation objects
                for violation_dict in result.violations:
                    violation = Violation(
                        severity=ViolationSeverity[violation_dict['severity']],
                        rule_ref=violation_dict['rule_ref'],
                        message=violation_dict['message'],
                        file_path=violation_dict.get('file_path'),
                        line_number=violation_dict.get('line_number'),
                        session_scope=violation_dict.get('session_scope', violation_scope),
                        fix_hint=violation_dict.get('fix_hint')  # Preserve fix_hint from checker
                    )
                    self._log_violation(violation)
                
                # Report success/failure
                if result.status == CheckerStatus.SUCCESS:
                    for check_name in result.checks_passed:
                        self._report_success(check_name)
                else:
                    for check_name in result.checks_failed:
                        self._report_failure(check_name)
                
                # Calculate duration
                duration_ms = int((time.perf_counter() - start_time) * 1000)
                
                logger.info(
                    f"Finished checker {idx}/{len(checkers_to_run)}: {checker_name}",
                    operation="_run_modular_checkers",
                    checker_index=idx,
                    total_checkers=len(checkers_to_run),
                    checker_name=checker_name,
                    status=result.status.value,
                    violations=len(result.violations),
                    duration_ms=duration_ms,
                    execution_time_ms=result.execution_time_ms
                )
                print(f"[MODULAR_CHECKERS] [{idx}/{len(checkers_to_run)}] Finished: {checker_name} ({duration_ms}ms, {len(result.violations)} violations)", flush=True)
                
            except Exception as e:
                duration_ms = int((time.perf_counter() - start_time) * 1000)
                import traceback
                error_traceback = traceback.format_exc()
                
                logger.error(
                    f"Checker {idx}/{len(checkers_to_run)} FAILED: {checker_name}",
                    operation="_run_modular_checkers",
                    checker_index=idx,
                    total_checkers=len(checkers_to_run),
                    checker_name=checker_name,
                    error_code="CHECKER_EXECUTION_FAILED",
                    root_cause=str(e),
                    error_type=type(e).__name__,
                    duration_ms=duration_ms,
                    traceback=error_traceback
                )
                print(f"[MODULAR_CHECKERS] [{idx}/{len(checkers_to_run)}] FAILED: {checker_name} ({duration_ms}ms) - {str(e)}", flush=True)
                self._report_failure(f"Modular Checker: {checker_name}")
        
        logger.info(
            f"All modular checkers completed",
            operation="_run_modular_checkers",
            total_checkers=len(checkers_to_run)
        )
        print(f"[MODULAR_CHECKERS] All {len(checkers_to_run)} checkers completed", flush=True)
    
    def _run_legacy_checks(self, checker_context: CheckerContext):
        """
        Run checks using the extracted legacy checker classes (fallback path).
        
        Args:
            skip_non_critical: Whether to skip non-critical checks
            violation_scope: Scope for violations - "current_session" or "historical"
        """
        skip_non_critical = checker_context.skip_non_critical
        violation_scope = checker_context.violation_scope
        classification_map = checker_context.classification_map
        changed_files_with_untracked = checker_context.changed_files_all
        changed_files_tracked = checker_context.changed_files_tracked

        # Ensure agent response is up to date for context checks
        self._load_agent_response_from_file()

        date_checker = DateChecker(current_date=self.CURRENT_DATE)
        security_checker = SecurityChecker(self.session)
        memory_bank_checker = MemoryBankChecker()
        error_checker = ErrorHandlingChecker()
        logging_checker = LoggingChecker()
        python_bible_checker = PythonBibleChecker()
        bug_logging_checker = BugLoggingChecker()
        context_checker = ContextChecker(
            git_utils=self.git_utils,
            predictive_context_available=PREDICTIVE_CONTEXT_AVAILABLE,
        )

        is_file_modified = lambda file_path: is_file_modified_in_session(
            file_path,
            self.session,
            self.project_root,
            self.git_utils,
        )

        context_manager_dir = self.project_root / ".cursor" / "context_manager"
        agent_response = getattr(self, "_last_agent_response", None)

        def run_check(check_name: str, func):
            try:
                violations = func()
                if violations:
                    # Filter out violations for log files (memory_bank files)
                    # These files should preserve historical dates and not be flagged
                    filtered_violations = []
                    for violation in violations:
                        # Skip violations for log files
                        violation_file_path = Path(violation.file_path) if violation.file_path else None
                        if violation_file_path and violation_file_path.exists():
                            if is_log_file(violation_file_path):
                                logger.debug(
                                    f"Filtering out violation for log file: {violation.file_path}",
                                    operation="_run_legacy_checks",
                                    check_name=check_name,
                                    file_path=violation.file_path,
                                    rule_ref=violation.rule_ref
                                )
                                continue
                        # Also check for memory_bank in path string (defensive check)
                        if violation.file_path:
                            normalized_path = str(violation.file_path).replace("\\", "/").lower()
                            if ".ai/memory_bank/" in normalized_path or ".ai/memory-bank/" in normalized_path:
                                logger.debug(
                                    f"Filtering out violation for memory_bank file (path check): {violation.file_path}",
                                    operation="_run_legacy_checks",
                                    check_name=check_name,
                                    file_path=violation.file_path,
                                    rule_ref=violation.rule_ref
                                )
                                continue
                        filtered_violations.append(violation)
                    
                    # Log filtered violations
                    if len(filtered_violations) < len(violations):
                        logger.info(
                            f"Filtered out {len(violations) - len(filtered_violations)} log file violations from {check_name}",
                            operation="_run_legacy_checks",
                            check_name=check_name,
                            original_count=len(violations),
                            filtered_count=len(filtered_violations)
                        )
                    
                    # Only log non-filtered violations
                    for violation in filtered_violations:
                        self._log_violation(violation)
                    
                    if filtered_violations:
                        self._report_failure(check_name)
                    else:
                        self._report_success(check_name)
                else:
                    self._report_success(check_name)
            except Exception as exc:
                logger.error(
                    f"Check failed with exception: {check_name}",
                    operation="_run_legacy_checks",
                    error_code="CHECK_EXCEPTION",
                    root_cause=str(exc),
                    check_name=check_name,
                )
                self._report_failure(check_name)

        critical_checks = [
            ("Memory Bank", lambda: memory_bank_checker.check_memory_bank(
                self.memory_bank_dir,
                self.MEMORY_BANK_FILES,
            )),
            ("Security Compliance", lambda: security_checker.check_security_compliance(
                changed_files_tracked,
                self.project_root,
                self.SECURITY_FILES,
            )),
            ("Active Context", lambda: context_checker.check_active_context(
                self.project_root,
                self.memory_bank_dir,
            )),
            ("Context Management", lambda: context_checker.check_context_management_compliance(
                context_manager_dir=context_manager_dir,
                agent_response=agent_response,
                preloader=self.preloader,
                context_loader=self.context_loader,
                response_parser=self.response_parser,
                verify_context_id_match_func=self._verify_context_id_match,
            )),
        ]

        non_critical_checks = [
            ("Hardcoded Dates", lambda: date_checker.check_hardcoded_dates(
                changed_files=changed_files_with_untracked,
                project_root=self.project_root,
                session=self.session,
                git_utils=self.git_utils,
                enforcement_dir=self.enforcement_dir,
                violation_scope=violation_scope,
                classification_map=classification_map,
                tracked_files=checker_context.changed_files_tracked,
                untracked_files=checker_context.changed_files_untracked,
            )),
            ("Error Handling", lambda: error_checker.check_error_handling(
                changed_files=changed_files_tracked,
                project_root=self.project_root,
                git_utils=self.git_utils,
                is_file_modified_in_session_func=is_file_modified,
                classification_map=classification_map,
            )),
            ("Structured Logging", lambda: logging_checker.check_logging(
                changed_files=changed_files_tracked,
                project_root=self.project_root,
                git_utils=self.git_utils,
                is_file_modified_in_session_func=is_file_modified,
            )),
            ("Python Bible", lambda: python_bible_checker.check_python_bible(
                changed_files=changed_files_tracked,
                project_root=self.project_root,
                git_utils=self.git_utils,
                is_file_modified_in_session_func=is_file_modified,
            )),
            ("Bug Logging", lambda: bug_logging_checker.check_bug_logging(
                self.project_root,
            )),
        ]

        for check_name, check_callable in critical_checks:
            run_check(check_name, check_callable)

        if not skip_non_critical:
            max_workers = max(1, int(os.getenv("ENFORCER_MAX_WORKERS", "1") or 1))
            if max_workers > 1:
                with ThreadPoolExecutor(max_workers=max_workers) as executor:
                    future_map = {executor.submit(check_callable): check_name for check_name, check_callable in non_critical_checks}
                    for future in as_completed(future_map):
                        check_name = future_map[future]
                        try:
                            result = future.result()
                            run_check(check_name, lambda result=result: result)
                        except Exception as exc:
                            logger.error(
                                f"Non-critical check failed in parallel execution: {exc}",
                                operation="_run_legacy_checks",
                                error_code="NON_CRITICAL_CHECK_FAILED",
                                check_name=check_name,
                                root_cause=str(exc),
                            )
                            self._report_failure(check_name)
            else:
                for check_name, check_callable in non_critical_checks:
                    run_check(check_name, check_callable)
        else:
            logger.info(
                "Skipped non-critical checks due to large file count",
                operation="_run_legacy_checks",
                skipped_checks=[name for name, _ in non_critical_checks],
            )
    
    def _update_context_recommendations(self, user_message: Optional[str] = None):
        """
        Update context recommendations based on current task and predictions.
        
        Called after enforcement checks to update recommendations file and dynamic rules.
        
        Args:
            user_message: Optional user message to detect task assignment (default: "File changes detected")
        """
        if not self.task_detector or not self.predictor or not self.preloader:
            return
        
        try:
            # CRITICAL FIX: Check if this is a "Session Start" scenario
            # If user message indicates session start, clear sequence and skip context recommendations
            session_start_keywords = ["session start", "sessionstart", "start session", "new session", "begin session"]
            if user_message and any(keyword in user_message.lower().strip() for keyword in session_start_keywords):
                logger.info(
                    "Session Start detected - clearing session sequence and generating minimal recommendations",
                    operation="_update_context_recommendations",
                    reason="session_start",
                    user_message=user_message
                )
                # Clear session sequence on session start
                if self.session_sequence_tracker:
                    self.session_sequence_tracker.clear_sequence()
                # Generate minimal recommendations (no task-specific context)
                self._generate_internal_recommendations()
                return
            
            # CRITICAL FIX: Check if recommendations.md is stale (from previous session)
            # If recommendations are older than session start, generate minimal recommendations
            # BUT: Skip stale check if user message is provided (indicates explicit task assignment)
            recommendations_file = self.project_root / ".cursor" / "context_manager" / "recommendations.md"
            if recommendations_file.exists() and self.session and not user_message:
                try:
                    # Check if recommendations file is older than session start
                    rec_stat = recommendations_file.stat()
                    rec_mtime = datetime.fromtimestamp(rec_stat.st_mtime, tz=timezone.utc)
                    session_start = datetime.fromisoformat(self.session.start_time.replace('Z', '+00:00'))
                    
                    # If recommendations are from before session start, they're stale
                    if rec_mtime < session_start:
                        logger.info(
                            "Recommendations file is stale (from previous session) - generating minimal recommendations",
                            operation="_update_context_recommendations",
                            reason="stale_recommendations",
                            rec_mtime=rec_mtime.isoformat(),
                            session_start=session_start.isoformat()
                        )
                        # Clear session sequence
                        if self.session_sequence_tracker:
                            self.session_sequence_tracker.clear_sequence()
                        # Generate minimal recommendations
                        self._generate_internal_recommendations()
                        return
                except Exception as e:
                    logger.debug(
                        f"Could not check recommendations file age: {e}",
                        operation="_update_context_recommendations",
                        error_code="STALE_CHECK_FAILED",
                        root_cause=str(e)
                    )
                    # Continue with normal flow if check fails
            
            # Get changed files from git (with timeout protection)
            # CRITICAL: Don't include untracked files for context loading
            # Only use actual edits (staged/unstaged) - untracked files shouldn't trigger context loading
            changed_files = self.git_utils.get_changed_files(include_untracked=False)
            
            # Limit file count to prevent timeouts (process max 100 files)
            if len(changed_files) > 100:
                logger.warn(
                    f"Too many changed files ({len(changed_files)}), limiting to 100 for context update",
                    operation="_update_context_recommendations",
                    total_files=len(changed_files),
                    limited_to=100
                )
                changed_files = changed_files[:100]
            
            if not changed_files:
                # No files changed - check if we should generate minimal recommendations
                # This handles "Session Start" scenario where no files have changed yet
                # BUT: Skip stale check if user message is provided (indicates explicit task assignment)
                recommendations_file = self.project_root / ".cursor" / "context_manager" / "recommendations.md"
                if recommendations_file.exists() and self.session and not user_message:
                    try:
                        # Check if recommendations file is stale (from previous session)
                        rec_stat = recommendations_file.stat()
                        rec_mtime = datetime.fromtimestamp(rec_stat.st_mtime, tz=timezone.utc)
                        session_start = datetime.fromisoformat(self.session.start_time.replace('Z', '+00:00'))
                        
                        # If recommendations are from before session start, regenerate minimal
                        if rec_mtime < session_start:
                            logger.info(
                                "No files changed but recommendations are stale - generating minimal recommendations",
                                operation="_update_context_recommendations",
                                reason="stale_recommendations_no_changes"
                            )
                            if self.session_sequence_tracker:
                                self.session_sequence_tracker.clear_sequence()
                            self._generate_internal_recommendations()
                            return
                    except Exception:
                        pass  # Ignore errors, just skip update
                
                # No files changed and recommendations are current, skip update
                # BUT: If user message provided, continue to task assignment check (even with no files)
                if not user_message:
                    return
            
            # Detect current task
            # Use provided user message or default
            if user_message is None:
                user_message = "File changes detected"  # Default - will be updated if agent message available
            task_detection = self.task_detector.detect_task(
                agent_message=user_message,
                files=changed_files
            )
            
            # Check if task is actually assigned (not just detected from file changes)
            # This prevents premature context pre-loading
            task_assigned = False
            if self.session_sequence_tracker:
                task_assigned = self.session_sequence_tracker.is_task_assigned(
                    task_detection.primary_task,
                    user_message,
                    task_detection.confidence
                )
                logger.info(
                    f"Task assignment check: task_type={task_detection.primary_task}, user_message='{user_message}', confidence={task_detection.confidence:.2f}, assigned={task_assigned}",
                    operation="_update_context_recommendations",
                    task_type=task_detection.primary_task,
                    user_message=user_message,
                    confidence=task_detection.confidence,
                    assigned=task_assigned
                )
            else:
                # Fallback: Use confidence threshold if tracker not available
                task_assigned = task_detection.confidence > 0.8
            
            # Create current task dict
            current_task = {
                'primary_task': task_detection.primary_task,
                'files': changed_files,
                'user_message': user_message,
                'file_types': list(task_detection.file_types)
            }
            
            # Add task to workflow tracker
            workflow_id = self.workflow_tracker.add_task(
                task_type=task_detection.primary_task,
                files=changed_files,
                confidence=task_detection.confidence
            )
            
            # Add task to session sequence tracker (if assigned)
            if self.session_sequence_tracker and task_assigned:
                self.session_sequence_tracker.add_task(
                    task_type=task_detection.primary_task,
                    files=changed_files,
                    user_message=user_message,
                    assigned=task_assigned
                )
            
            # Update predictor history
            self.predictor.update_history(task_detection.primary_task)
            
            # CRITICAL FIX: Only predict and pre-load context if task is assigned
            # This prevents wasting context on unassigned tasks
            if not task_assigned:
                logger.debug(
                    f"Task detected but not assigned: {task_detection.primary_task} (confidence: {task_detection.confidence:.2f})",
                    operation="_update_context_recommendations",
                    reason="task_not_assigned",
                    task_type=task_detection.primary_task,
                    confidence=task_detection.confidence
                )
                # Skip prediction and context pre-loading for unassigned tasks
                # This prevents loading Python Bible, etc. before task is actually assigned
                # BUT: Still generate the rule file with correct instructions (even if no task assigned)
                # This ensures the rule file always has the latest instructions
                context_plan = {
                    'active_context': [],
                    'preloaded_context': [],
                    'context_to_unload': [],
                    'core_files': [],
                    'dynamic_files': []
                }
                self._generate_dynamic_rule_file(context_plan, {})
                # CRITICAL FIX: Generate minimal recommendations when task is not assigned
                # This updates recommendations.md to show "NO TASK ASSIGNED YET"
                self._generate_internal_recommendations()
                return
            
            # Get session sequence context for session-aware predictions
            session_sequence_context = None
            if self.session_sequence_tracker:
                session_sequence_context = self.session_sequence_tracker.get_sequence_context()
            
            # Get predictions for dashboard (with session awareness)
            predictions = self.predictor.predict_next_tasks(
                current_task,
                session_sequence_context=session_sequence_context
            )
            
            # Log predictions to analytics (for accuracy tracking)
            try:
                from context_manager.analytics import PredictionAnalytics  # type: ignore
                analytics = PredictionAnalytics()
                # Convert TaskPrediction objects to dicts for logging
                predicted_dicts = [
                    {
                        'task': pred.task,
                        'probability': pred.probability,
                        'reason': pred.reason,
                        'workflow_name': pred.workflow_name
                    }
                    for pred in predictions
                ]
                # Get workflow name for context
                workflow = self.workflow_tracker.get_workflow(workflow_id)
                workflow_name = workflow.detected_pattern if workflow and workflow.detected_pattern else "unknown"
                # Log prediction (actual task will be logged when next task occurs)
                analytics.log_prediction(
                    predicted=predicted_dicts,
                    actual=task_detection.primary_task,  # Current task is the "actual" from previous prediction
                    context={
                        'current_task': task_detection.primary_task,
                        'workflow_id': workflow_id,
                        'workflow_name': workflow_name,
                        'files': changed_files
                    }
                )
            except Exception as e:
                logger.debug(
                    f"Failed to log prediction to analytics: {e}",
                    operation="_update_context_recommendations",
                    error_code="ANALYTICS_LOG_FAILED",
                    root_cause=str(e)
                )
            
            # Get context management plan
            context_plan = self.preloader.manage_context(current_task)
            
            # Filter out rule files from context management (prevent recursion)
            # Exclude both numbered rules (00-14) and context-* rules
            active_context = [f for f in context_plan.get('active_context', []) 
                            if not f.startswith('.cursor/enforcement/rules/') and 
                               not (f.startswith('context-') and f.endswith('.mdc'))]
            preloaded_context = [f for f in context_plan.get('preloaded_context', []) 
                               if not f.startswith('.cursor/enforcement/rules/') and 
                                  not (f.startswith('context-') and f.endswith('.mdc'))]
            context_to_unload = [f for f in context_plan.get('context_to_unload', []) 
                               if not f.startswith('.cursor/enforcement/rules/') and 
                                  not (f.startswith('context-') and f.endswith('.mdc'))]
            
            # Update context_plan with filtered lists
            context_plan['active_context'] = active_context
            context_plan['preloaded_context'] = preloaded_context
            context_plan['context_to_unload'] = context_to_unload
            
            # Categorize files (core vs dynamic)
            rule_changes = {}
            if PREDICTIVE_CONTEXT_AVAILABLE:
                try:
                    # Lazy import ContextCategorizer and RuleFileManager
                    ContextCategorizerCls = _lazy_import_context_manager('ContextCategorizer')
                    RuleFileManagerCls = _lazy_import_context_manager('RuleFileManager')
                    
                    if not ContextCategorizerCls or not RuleFileManagerCls:
                        logger.warn(
                            "ContextCategorizer or RuleFileManager not available, skipping rule file sync",
                            operation="_update_context_recommendations",
                            error_code="CONTEXT_MANAGER_CLASSES_UNAVAILABLE"
                        )
                        raise ImportError("ContextCategorizer or RuleFileManager not available")
                    
                    categorizer = ContextCategorizerCls()
                    
                    # ALWAYS ensure core pattern files have rule files (regardless of context lists)
                    # This ensures "basics" are always loaded at session start
                    # CORE_PATTERNS should NEVER be removed, even if in context_to_unload
                    always_core_files = []
                    for pattern in categorizer.CORE_PATTERNS:
                        source_path = self.project_root / pattern
                        if source_path.exists():
                            always_core_files.append(pattern)
                            logger.debug(
                                f"Core pattern file exists: {pattern}",
                                operation="_update_context_recommendations",
                                file_path=pattern
                            )
                    
                    # Remove CORE_PATTERNS from context_to_unload (they should never be unloaded)
                    # Strip @ prefix before comparing
                    context_to_unload_filtered = [
                        f for f in context_to_unload
                        if f.lstrip('@').strip() not in categorizer.CORE_PATTERNS
                    ]
                    
                    # Categorize files from context lists (core vs dynamic)
                    # Use filtered context_to_unload (without CORE_PATTERNS)
                    core_files_from_context, dynamic_files = categorizer.categorize(
                        active_context + preloaded_context,
                        context_to_unload_filtered
                    )
                    
                    # Merge always-core files with categorized core files (deduplicate)
                    all_core_files = list(set(always_core_files + core_files_from_context))
                    
                    # Filter out CORE_PATTERNS from context_to_remove (never delete core pattern rule files)
                    # Use already-filtered context_to_unload_filtered (CORE_PATTERNS already removed above)
                    context_to_remove_filtered = context_to_unload_filtered
                    
                    # Update context_plan with categorized files
                    context_plan['core_files'] = all_core_files
                    context_plan['dynamic_files'] = dynamic_files
                    
                    # Sync rule files (create/delete/update)
                    rule_file_manager = RuleFileManagerCls()
                    rule_changes = rule_file_manager.sync_context_files(
                        core_context=all_core_files,  # Use merged list
                        context_to_remove=context_to_remove_filtered  # Filtered to exclude CORE_PATTERNS
                    )
                    
                    # Generate session restart alert (if core context changed)
                    if rule_changes.get('created') or rule_changes.get('deleted'):
                        self._generate_session_restart_rule(rule_changes)
                    
                except Exception as e:
                    logger.error(
                        f"Failed to sync rule files: {e}",
                        operation="_update_context_recommendations",
                        error_code="RULE_FILE_SYNC_FAILED",
                        root_cause=str(e)
                    )
                    # Continue without rule file sync
            
            # Generate recommendations file
            self._generate_internal_recommendations(
                current_task,
                context_plan,
                workflow_id,
                rule_changes
            )
            
            # Generate dynamic rule file
            self._generate_dynamic_rule_file(context_plan, rule_changes)
            
            # Update dashboard
            self._update_dashboard(current_task, context_plan, workflow_id, predictions)
            
            logger.info(
                "Context recommendations updated",
                operation="_update_context_recommendations",
                workflow_id=workflow_id,
                active_context_count=len(context_plan['active_context']),
                preloaded_context_count=len(context_plan['preloaded_context'])
            )
            
        except Exception as e:
            logger.error(
                f"Failed to update context recommendations: {e}",
                operation="_update_context_recommendations",
                error_code="CONTEXT_UPDATE_EXCEPTION",
                root_cause=str(e)
            )
    
    def get_context_metrics_for_audit(self) -> Dict:
        """
        Get context usage and token statistics for Step 5 audit.
        
        Returns:
            Dict with context metrics, token statistics, and compliance status
        """
        metrics = {
            'context_usage': {
                'active_files': [],
                'preloaded_files': [],
                'unloaded_files': [],
                'active_count': 0,
                'preloaded_count': 0,
                'unloaded_count': 0
            },
            'token_statistics': {
                'active_tokens': 0,
                'preloaded_tokens': 0,
                'total_tokens': 0,
                'savings_tokens': 0,
                'savings_percentage': 0.0,
                'static_baseline': 0
            },
            'compliance': {
                'step_0_5_completed': False,
                'step_4_5_completed': False,
                'recommendations_followed': False
            },
            'available': False,
            'error': None  # Will be set if system is unavailable
        }
        
        # Check if context management system is available
        if not PREDICTIVE_CONTEXT_AVAILABLE:
            metrics['available'] = False
            metrics['error'] = 'PREDICTIVE_CONTEXT_AVAILABLE is False - system not initialized'
            # Return metrics with zeros - agent must still report them
            return metrics
        
        if not self.preloader:
            metrics['available'] = False
            metrics['error'] = 'Preloader is None - system not fully initialized'
            # Return metrics with zeros - agent must still report them
            return metrics
        
        metrics['available'] = True
        errors: List[str] = []
        recommendations_ok = False
        dashboard_ok = False

        recommendations_file = self.project_root / ".cursor" / "context_manager" / "recommendations.md"
        try:
            if not recommendations_file.exists():
                changed_files = self.git_utils.get_changed_files(include_untracked=False)
                if changed_files and self.predictor:
                    try:
                        self._update_context_recommendations()
                        import time
                        time.sleep(0.1)
                    except Exception:
                        pass

            if recommendations_file.exists():
                with open(recommendations_file, 'r', encoding='utf-8') as f:
                    recommendations_content = f.read()

                active_section = recommendations_content.split("### Active Context (Currently Loaded)")[1].split("###")[0] if "### Active Context (Currently Loaded)" in recommendations_content else ""
                active_files = [line.strip().replace('- `', '').replace('`', '').replace(' (PRIMARY)', '')
                               for line in active_section.split('\n')
                               if line.strip().startswith('- `')]
                metrics['context_usage']['active_files'] = active_files
                metrics['context_usage']['active_count'] = len(active_files)

                preload_section = recommendations_content.split("### Pre-loaded Context (Ready for Next Tasks)")[1].split("###")[0] if "### Pre-loaded Context (Ready for Next Tasks)" in recommendations_content else ""
                preloaded_files = [line.strip().replace('- `', '').replace('`', '').replace(' (HIGH)', '')
                                  for line in preload_section.split('\n')
                                  if line.strip().startswith('- `')]
                metrics['context_usage']['preloaded_files'] = preloaded_files
                metrics['context_usage']['preloaded_count'] = len(preloaded_files)

                unload_section = recommendations_content.split("### Context to Unload")[1].split("##")[0] if "### Context to Unload" in recommendations_content else ""
                unloaded_files = [line.strip().replace('- `', '').replace('`', '').replace(' - **REMOVE @ mention**', '')
                                 for line in unload_section.split('\n')
                                 if line.strip().startswith('- `')]
                metrics['context_usage']['unloaded_files'] = unloaded_files
                metrics['context_usage']['unloaded_count'] = len(unloaded_files)
                recommendations_ok = True
        except Exception as e:
            errors.append("recommendations_read_failed")
            logger.debug(
                f"Failed to read recommendations: {e}",
                operation="get_context_metrics_for_audit",
                error_code="RECOMMENDATIONS_READ_FAILED",
                root_cause=str(e)
            )

        try:
            from context_manager.token_estimator import TokenEstimator  # type: ignore
            token_estimator = TokenEstimator(self.project_root)

            active_metrics = token_estimator.track_context_load(metrics['context_usage']['active_files'])
            metrics['token_statistics']['active_tokens'] = active_metrics.total_tokens

            preload_metrics = token_estimator.track_context_load(metrics['context_usage']['preloaded_files'])
            preload_token_cost = int(preload_metrics.total_tokens * 0.3)
            metrics['token_statistics']['preloaded_tokens'] = preload_token_cost

            metrics['token_statistics']['total_tokens'] = active_metrics.total_tokens + preload_token_cost

            all_context_files = set(metrics['context_usage']['active_files'] + metrics['context_usage']['preloaded_files'])
            static_metrics = token_estimator.track_context_load(list(all_context_files))
            metrics['token_statistics']['static_baseline'] = static_metrics.total_tokens

            if metrics['token_statistics']['static_baseline'] > 0:
                savings = metrics['token_statistics']['static_baseline'] - metrics['token_statistics']['total_tokens']
                metrics['token_statistics']['savings_tokens'] = max(0, savings)
                metrics['token_statistics']['savings_percentage'] = round(
                    (savings / metrics['token_statistics']['static_baseline'] * 100) if metrics['token_statistics']['static_baseline'] > 0 else 0.0,
                    2
                )
        except Exception as e:
            errors.append("token_stats_failed")
            logger.debug(
                f"Failed to calculate token statistics: {e}",
                operation="get_context_metrics_for_audit",
                error_code="TOKEN_STATS_FAILED",
                root_cause=str(e)
            )

        dashboard_file = self.project_root / ".cursor" / "context_manager" / "dashboard.md"
        try:
            if dashboard_file.exists():
                with open(dashboard_file, 'r', encoding='utf-8') as f:
                    dashboard_content = f.read()
                    dashboard_ok = True
                    if "[Will be populated" not in dashboard_content and "[Count]" not in dashboard_content:
                        metrics['compliance']['step_0_5_completed'] = True
                        metrics['compliance']['step_4_5_completed'] = True
                        metrics['compliance']['recommendations_followed'] = True
        except Exception as e:
            errors.append("dashboard_read_failed")
            logger.debug(
                f"Failed to read dashboard: {e}",
                operation="get_context_metrics_for_audit",
                error_code="DASHBOARD_READ_FAILED",
                root_cause=str(e)
            )

        if not recommendations_ok and not dashboard_ok:
            metrics['available'] = False

        if errors:
            metrics['error'] = ";".join(errors)
        
        return metrics
    
    def _generate_internal_recommendations(self, current_task: Optional[Dict] = None, context_plan: Optional[Dict] = None, workflow_id: Optional[str] = None, rule_changes: Optional[Dict] = None):
        """
        Generate context recommendations for ENFORCER'S INTERNAL USE ONLY.
        
        In Two-Brain Model:
        - This is NOT for the LLM to read
        - Enforcer uses this to build context bundles
        - LLM receives minimal hints in ENFORCER_REPORT
        
        Args:
            current_task: Current task dict (optional, for session start use None)
            context_plan: Context management plan from preloader (optional)
            workflow_id: Current workflow ID (optional)
            rule_changes: Dict with rule file changes (optional)
        """
        if rule_changes is None:
            rule_changes = {}
        if context_plan is None:
            context_plan = {
                'active_context': [],
                'preloaded_context': [],
                'context_to_unload': [],
                'core_files': [],
                'dynamic_files': []
            }
        if current_task is None:
            current_task = {
                'primary_task': None,
                'files': [],
                'file_types': [],
                'confidence': 0.0
            }
        
        # Save to enforcer-only location (not visible to LLM)
        internal_dir = self.project_root / ".cursor" / "enforcement" / "internal"
        internal_dir.mkdir(parents=True, exist_ok=True)
        recommendations_file = internal_dir / "context_recommendations.json"
        
        # Get workflow info
        workflow = None
        workflow_name = "Unknown"
        if workflow_id and self.workflow_tracker:
            workflow = self.workflow_tracker.get_workflow(workflow_id)
            workflow_name = workflow.detected_pattern if workflow and workflow.detected_pattern else "Unknown"
        
        # Get predictions
        predictions = []
        if self.predictor and current_task and current_task.get('primary_task'):
            predictions = self.predictor.predict_next_tasks(current_task)
        
        # Generate or reuse context-id
        context_id = None
        now = datetime.now(timezone.utc)
        
        if recommendations_file.exists():
            try:
                stat_info = recommendations_file.stat()
                mod_time = datetime.fromtimestamp(stat_info.st_mtime, tz=timezone.utc)
                age_seconds = (now - mod_time).total_seconds()
                
                # If file is recent (within 5 minutes), reuse context-id
                if age_seconds <= 300:
                    with open(recommendations_file, 'r', encoding='utf-8') as f:
                        existing_data = json.load(f)
                        if 'context_id' in existing_data:
                            context_id = existing_data['context_id']
                            logger.debug(
                                f"Reusing existing context-id (file age: {age_seconds}s)",
                                operation="_generate_internal_recommendations",
                                context_id=context_id
                            )
            except Exception as e:
                logger.debug(
                    f"Could not read existing context-id: {e}",
                    operation="_generate_internal_recommendations",
                    error_code="CONTEXT_ID_READ_FAILED",
                    root_cause=str(e)
                )
        
        # Generate new context-id if needed
        if context_id is None:
            context_id = str(uuid.uuid4())
            logger.debug(
                "Generated new context-id",
                operation="_generate_internal_recommendations",
                context_id=context_id
            )
        
        # Build predictions list
        predictions_list = []
        if predictions:
            for pred in predictions:
                predictions_list.append({
                    "task": pred.task,
                    "probability": pred.probability,
                    "reason": pred.reason,
                    "workflow_name": getattr(pred, 'workflow_name', None)
                })
        
        # Build internal recommendations structure (JSON format)
        recommendations = {
            "context_id": context_id,
            "workflow_id": workflow_id or 'unknown',
            "workflow_name": workflow_name,
            "generated_at": now.isoformat(),
            "task": {
                "type": current_task.get('primary_task', 'unknown'),
                "status": "assigned" if current_task.get('primary_task') else "waiting_for_assignment",
                "files_modified": len(current_task.get('files', [])),
                "file_types": current_task.get('file_types', []),
                "confidence": current_task.get('confidence', 0.0)
            },
            "predictions": predictions_list,
            "context": {
                "active": context_plan.get('active_context', []),
                "preloaded": context_plan.get('preloaded_context', []),
                "to_unload": context_plan.get('context_to_unload', []),
                "core_files": context_plan.get('core_files', []),
                "dynamic_files": context_plan.get('dynamic_files', []),
                "suggested": context_plan.get('suggested_context', [])
            },
            "rule_changes": {
                "created": rule_changes.get('created', []),
                "updated": rule_changes.get('updated', []),
                "deleted": rule_changes.get('deleted', []),
                "unchanged": rule_changes.get('unchanged', [])
            },
            "metrics": {
                "active_context_files": len(context_plan.get('active_context', [])),
                "preloaded_context_files": len(context_plan.get('preloaded_context', [])),
                "context_to_unload": len(context_plan.get('context_to_unload', [])),
                "workflow_position": len(workflow.tasks) if workflow else 0
            },
            "note": "Two-Brain Model: This file is for enforcer's internal use only. LLM does not read this."
        }
        
        # Write JSON file (enforcer-only, not visible to LLM)
        try:
            with open(recommendations_file, 'w', encoding='utf-8') as f:
                json.dump(recommendations, f, indent=2)
            
            logger.info(
                "Internal recommendations generated (enforcer-only)",
                operation="_generate_internal_recommendations",
                context_id=context_id,
                file_path=str(recommendations_file),
                task_type=current_task.get('primary_task', 'none')
            )
            
            return recommendations
            
        except Exception as e:
            logger.error(
                f"Failed to write internal recommendations file: {e}",
                operation="_generate_internal_recommendations",
                error_code="RECOMMENDATIONS_WRITE_FAILED",
                root_cause=str(e)
            )
            return None
    
    def _generate_dynamic_rule_file(self, context_plan: Dict, rule_changes: Dict = None):
        """
        Generate dynamic rule file for Cursor with mandatory context management requirements.
        
        Args:
            context_plan: Context management plan from preloader
            rule_changes: Dict with rule file changes (created, updated, deleted, unchanged)
        """
        if rule_changes is None:
            rule_changes = {}
        
        # Two-Brain Model: Generate context_enforcement.mdc in enforcement/rules/ (enforcer-only)
        # LLM doesn't need this file - it's for enforcer's internal context management
        rule_file = self.project_root / ".cursor" / "enforcement" / "rules" / "context_enforcement.mdc"
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        
        active_context = context_plan.get('active_context', [])
        preloaded_context = context_plan.get('preloaded_context', [])
        context_to_unload = context_plan.get('context_to_unload', [])
        core_files = context_plan.get('core_files', [])
        dynamic_files = context_plan.get('dynamic_files', [])
        
        # Check if session restart is required
        session_restart_required = bool(rule_changes.get('created') or rule_changes.get('deleted'))
        session_restart_notice = ""
        if session_restart_required:
            session_restart_notice = f"""
## ⚠️ SESSION RESTART REQUIRED

**Core context has changed. Please start a new chat session to load updated rule files.**

See `.cursor/enforcement/SESSION_RESTART_REQUIRED.mdc` for details.

**How to restart:**
1. Click the **"+"** button in Cursor chat panel (or **Cmd/Ctrl + N**)
2. Or reload window: **Cmd/Ctrl + Shift + P** → "Reload Window"

**Current session:** You can continue, but context may be stale. New session recommended.

---
"""
        
        # Generate rule file content (Two-Brain Model: No Step 0.5/4.5 instructions)
        content = f"""# Context Enforcement Rules (Auto-Generated)

**Last Updated:** {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}
{session_restart_notice}
## Two-Brain Model: Context Management

**NOTE:** This file is generated by the enforcer (Brain A) for internal context management.
The LLM (Brain B) does not need to read or follow this file.

Context is automatically managed by the enforcer based on task requirements.
The LLM receives context hints in ENFORCER_REPORT.json when needed.

## Context Priorities

This file is automatically generated by the Predictive Context Management System.
It provides dynamic context priorities based on current workflow predictions.

### Core Context (Already Loaded - Automatic)

These files are automatically loaded via rule files - no @ mention needed:

"""
        
        # Show core context files
        rule_files_unchanged = rule_changes.get('unchanged', [])
        rule_files_created = rule_changes.get('created', [])
        all_core_rule_files = set(rule_files_unchanged + rule_files_created)
        
        if all_core_rule_files or core_files:
            for rule_file in sorted(all_core_rule_files)[:10]:
                # Show rule file name (with context- prefix)
                content += f"- `{rule_file}` (auto-loaded via rule file)\n"
            for core_file in core_files[:10]:
                if core_file not in [str(Path(rf).stem) for rf in all_core_rule_files]:
                    content += f"- `{core_file}` (will be auto-loaded)\n"
        else:
            content += "- No core context files.\n"
        
        content += f"""
### Dynamic Context (Load These - REQUIRED)

These files MUST be loaded with @ mentions for the current task:

"""
        
        # Show only dynamic files (not core files)
        dynamic_context_to_show = [f for f in active_context if f in dynamic_files or f not in core_files]
        
        if dynamic_context_to_show:
            for ctx_file in dynamic_context_to_show[:10]:  # Limit to top 10
                clean_file = ctx_file.lstrip('@')
                content += f"- `{clean_file}` - **REQUIRED: Load with @ mention**\n"
        else:
            content += "- No dynamic context files required.\n"
        
        content += f"""
### Pre-loaded Context (Medium Priority) - LOAD FOR NEXT TASKS

These files should be pre-loaded for predicted next tasks (load if probability >70%):

"""
        
        # Filter preloaded context to show only dynamic files
        dynamic_preloaded = [f for f in preloaded_context if f in dynamic_files or f not in core_files]
        
        if dynamic_preloaded:
            for ctx_file in dynamic_preloaded[:5]:  # Limit to top 5
                clean_file = ctx_file.lstrip('@')
                content += f"- `{clean_file}` - **PRE-LOAD: Load with @ mention**\n"
        else:
            content += "- No pre-loaded context files.\n"
        
        if context_to_unload:
            content += f"""
### Context to Unload - REMOVE THESE

These files should be unloaded (no longer needed for current/predicted tasks):

"""
            for ctx_file in context_to_unload[:5]:  # Limit to top 5
                clean_file = ctx_file.lstrip('@')
                content += f"- `{clean_file}` - **UNLOAD: Remove @ mention**\n"
        
        content += f"""
## Two-Brain Model: Context Management

**NOTE:** This file is generated by the enforcer (Brain A) for internal context management.
The LLM (Brain B) does not need to read or follow this file.

Context is automatically managed by the enforcer based on task requirements.

---
*This file is auto-generated by the Predictive Context Management System (Two-Brain Model).*
"""
        
        try:
            with open(rule_file, 'w', encoding='utf-8') as f:
                f.write(content)
        except Exception as e:
            logger.error(
                f"Failed to write dynamic rule file: {e}",
                operation="_generate_dynamic_rule_file",
                error_code="RULE_FILE_WRITE_FAILED",
                root_cause=str(e)
            )
    
    def _generate_session_restart_rule(self, rule_changes: Dict) -> Path:
        """
        Generate session restart alert file.
        
        Creates high-visibility alert when core context changes.
        
        Args:
            rule_changes: Dict with 'created' and 'deleted' lists
            
        Returns:
            Path to alert file
        """
        alert_file = self.project_root / ".cursor" / "rules" / "SESSION_RESTART_REQUIRED.mdc"
        alert_file.parent.mkdir(parents=True, exist_ok=True)
        
        created_files = rule_changes.get('created', [])
        deleted_files = rule_changes.get('deleted', [])
        
        created_list = '\n'.join(f"- {f}" for f in created_files) if created_files else "- None"
        deleted_list = '\n'.join(f"- {f}" for f in deleted_files) if deleted_files else "- None"
        
        content = f"""# ⚠️ SESSION RESTART REQUIRED

**Last Updated:** {datetime.now(timezone.utc).isoformat()}

## Core Context Has Changed

The following rule files have been created or deleted:

**Created:**
{created_list}

**Deleted:**
{deleted_list}

## Action Required

**Cursor requires a new chat session to load updated rule files.**

### How to Restart Session:

1. **Start New Chat** (Recommended):
   - Click the **"+"** button in Cursor chat panel
   - Or use keyboard shortcut: **Cmd/Ctrl + N** (new chat)
   - This will load all updated rule files automatically

2. **Reload Window** (Alternative):
   - Use **Cmd/Ctrl + Shift + P** to open command palette
   - Type "Reload Window" and select it
   - This reloads the entire Cursor window

### Why Restart Is Needed:

- Rule files are loaded at session start
- Core context changes require rule file reload
- New session ensures all context is up-to-date

### Current Session Behavior:

- You can continue in current session, but context may be stale
- Agent will warn about missing/outdated context
- New session recommended for best results

---

**This alert will be removed automatically after 5 minutes or when new session detected.**
"""
        
        try:
            alert_file.write_text(content, encoding='utf-8')
            logger.info(
                "Session restart alert created",
                operation="_generate_session_restart_rule",
                alert_file=str(alert_file),
                created_count=len(created_files),
                deleted_count=len(deleted_files)
            )
        except Exception as e:
            logger.error(
                f"Failed to write session restart alert: {e}",
                operation="_generate_session_restart_rule",
                error_code="ALERT_WRITE_FAILED",
                root_cause=str(e)
            )
        
        return alert_file
    
    def _update_dashboard(self, current_task: Dict, context_plan: Dict, workflow_id: str, predictions: List):
        """
        Update dashboard with current session status.
        
        Args:
            current_task: Current task dict
            context_plan: Context management plan
            workflow_id: Current workflow ID
            predictions: List of predictions
        """
        dashboard_file = self.project_root / ".cursor" / "context_manager" / "dashboard.md"
        dashboard_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Get workflow info
        workflow = self.workflow_tracker.get_workflow(workflow_id)
        workflow_name = workflow.detected_pattern if workflow and workflow.detected_pattern else "Unknown"
        workflow_position = len(workflow.tasks) if workflow else 0
        
        # Get analytics (if available)
        try:
            context_manager_path = self.project_root / ".cursor" / "context_manager"
            if context_manager_path.exists():
                sys.path.insert(0, str(context_manager_path.parent))
                from context_manager.analytics import PredictionAnalytics  # type: ignore
                analytics = PredictionAnalytics()
                accuracy_report = analytics.get_accuracy_report()
                overall_accuracy = accuracy_report.get('overall_accuracy', 0.0)
                total_predictions = accuracy_report.get('total_predictions', 0)
                correct_predictions = accuracy_report.get('correct_predictions', 0)
            else:
                overall_accuracy = 0.0
                total_predictions = 0
                correct_predictions = 0
        except Exception:
            overall_accuracy = 0.0
            total_predictions = 0
            correct_predictions = 0
        
        # Get token metrics (if available)
        try:
            context_manager_path = self.project_root / ".cursor" / "context_manager"
            if context_manager_path.exists():
                sys.path.insert(0, str(context_manager_path.parent))
                from context_manager.token_estimator import TokenEstimator  # type: ignore
                token_estimator = TokenEstimator(self.project_root)
                active_metrics = token_estimator.track_context_load(context_plan.get('active_context', []))
                preload_metrics = token_estimator.track_context_load(context_plan.get('preloaded_context', []))
                total_tokens = active_metrics.total_tokens + int(preload_metrics.total_tokens * 0.3)
            else:
                total_tokens = 0
        except Exception:
            total_tokens = 0
        
        # Generate dashboard content
        current_time_utc = datetime.now(timezone.utc)
        # Align dashboard timestamp with enforcement system date to avoid false positives
        last_updated_str = f"{self.CURRENT_DATE} {current_time_utc.strftime('%H:%M:%S UTC')}"
        content = f"""# Context Management Dashboard

**Last Updated:** {last_updated_str}

*This file is auto-generated by the Predictive Context Management System.*

## Current Session Status

**Status:** Active

**Session Start:** {self.session.start_time if self.session else 'N/A'}

## Active Workflow

**Workflow:** {workflow_name}
**Workflow ID:** {workflow_id}
**Position in Workflow:** {workflow_position} task(s) completed
**Confidence:** {current_task.get('confidence', 0.0):.0%}

## Predicted Next Steps

"""
        
        if predictions:
            for i, pred in enumerate(predictions[:3], 1):
                content += f"{i}. **{pred.task}** ({pred.probability:.0%} confidence)\n   - {pred.reason}\n\n"
        else:
            content += "No predictions available.\n\n"
        
        content += f"""## Context Efficiency

- **Active Context Files:** {len(context_plan.get('active_context', []))}
- **Pre-loaded Context Files:** {len(context_plan.get('preloaded_context', []))}
- **Token Usage:** ~{total_tokens:,} tokens
- **Predictions Used:** {', '.join(context_plan.get('predictions_used', []) or ['None'])}

## Prediction Accuracy

- **Overall Accuracy:** {overall_accuracy:.0%}
- **Total Predictions:** {total_predictions}
- **Correct Predictions:** {correct_predictions}

## Current Task

- **Type:** {current_task.get('primary_task', 'unknown')}
- **Files Modified:** {len(current_task.get('files', []))}
- **File Types:** {', '.join(current_task.get('file_types', [])) or 'N/A'}

## Recommended Context

### Active Context (Currently Loaded)

"""
        
        active_context = context_plan.get('active_context', [])
        if active_context:
            for ctx_file in active_context[:10]:
                content += f"- `{ctx_file}`\n"
        else:
            content += "No active context files.\n"
        
        content += f"""
### Pre-loaded Context (Ready for Next Tasks)

"""
        
        preloaded_context = context_plan.get('preloaded_context', [])
        if preloaded_context:
            for ctx_file in preloaded_context[:5]:
                content += f"- `{ctx_file}`\n"
        else:
            content += "No pre-loaded context files.\n"
        
        content += f"""
---
*Dashboard updates automatically as the system tracks workflow activity.*
"""
        
        try:
            with open(dashboard_file, 'w', encoding='utf-8') as f:
                f.write(content)
        except Exception as e:
            logger.error(
                f"Failed to write dashboard: {e}",
                operation="_update_dashboard",
                error_code="DASHBOARD_WRITE_FAILED",
                root_cause=str(e)
            )
    

    def run(self, user_message: Optional[str] = None, scope: str = "full", max_files: Optional[int] = None) -> int:
        """Main entry point."""
        try:
            success = self.run_all_checks(user_message=user_message, scope=scope, max_files=max_files)
            return 0 if success else 1
        except Exception as e:
            logger.error(
                "Enforcement run failed",
                operation="run",
                error_code="ENFORCEMENT_RUN_FAILED",
                root_cause=str(e)
            )
            return 1


def main():
    """Main entry point for standalone script."""
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description='VeroField Auto-Enforcer')
    parser.add_argument(
        '--user-message',
        type=str,
        default=None,
        help='User message that triggered the enforcer (for task assignment detection)'
    )
    parser.add_argument(
        '--scope',
        type=str,
        choices=['full', 'current_session'],
        default='full',
        help='Scan scope: "full" for baseline scan (all files), "current_session" for incremental scan (changed files only)'
    )
    parser.add_argument(
        '--max-files',
        type=int,
        default=None,
        help='DEBUG: Limit number of files processed (for debugging hangs)'
    )
    args = parser.parse_args()
    
    # Detect Windows console encoding and use ASCII-safe alternatives if needed
    use_ascii = _use_ascii_output()
    
    # Use ASCII-safe alternatives for Windows console compatibility
    if use_ascii:
        print("[*] Loading Auto-Enforcement System...")
        print("   Initializing enforcement layer...")
    else:
        print("🔄 Loading Auto-Enforcement System...")
        print("   Initializing enforcement layer...")
    
    enforcer = VeroFieldEnforcer()
    
    if use_ascii:
        print("   [OK] Enforcement layer initialized")
        print("   [OK] Predictive context management: " + ("Enabled" if PREDICTIVE_CONTEXT_AVAILABLE and enforcer.predictor is not None else "Disabled"))
        print("   [OK] Agent response loaded: " + ("Yes" if enforcer._last_agent_response else "No"))
        print()
        print("[*] Running compliance checks...")
    else:
        print("   ✓ Enforcement layer initialized")
        print("   ✓ Predictive context management: " + ("Enabled" if PREDICTIVE_CONTEXT_AVAILABLE and enforcer.predictor is not None else "Disabled"))
        print("   ✓ Agent response loaded: " + ("Yes" if enforcer._last_agent_response else "No"))
        print()
        print("🔄 Running compliance checks...")
    
    exit_code = enforcer.run(user_message=args.user_message, scope=args.scope, max_files=args.max_files)
    
    print()
    if use_ascii:
        if exit_code == 0:
            print("[OK] All compliance checks passed")
        else:
            print("[WARN] Compliance checks completed with violations")
            print("   Check .cursor/enforcement/AGENT_STATUS.md for details")
    else:
        if exit_code == 0:
            print("✅ All compliance checks passed")
        else:
            print("⚠️  Compliance checks completed with violations")
            print("   Check .cursor/enforcement/AGENT_STATUS.md for details")
    
    sys.exit(exit_code)


if __name__ == '__main__':
    main()


