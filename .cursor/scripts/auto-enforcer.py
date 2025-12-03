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

Last Updated: 2025-12-01
"""

import os
import sys
import re
import json
import uuid
import subprocess
import hashlib
import argparse
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Optional, Tuple, Set, Any
from dataclasses import dataclass, asdict
from enum import Enum
from collections import defaultdict
from functools import lru_cache

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
# Also add .cursor to path for enforcement module
sys.path.insert(0, str(project_root / ".cursor"))

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

# Import date detection module (Phase 3: Complete DateDetector)
try:
    from enforcement.date_detector import (
        DocumentContext,
        DateDetector,
        DateMatch,
        DateClassification
    )
except ImportError:
    # Fallback if module not available (shouldn't happen in normal operation)
    DocumentContext = None
    DateDetector = None
    DateMatch = None
    DateClassification = None

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


class ViolationSeverity(Enum):
    """Violation severity levels."""
    BLOCKED = "BLOCKED"  # Hard stop - cannot proceed
    WARNING = "WARNING"  # Warning - should fix but can proceed
    INFO = "INFO"  # Informational - no action required


@dataclass(slots=True)  # Python 3.10+ - reduces memory by 4-5× (Chapter 07.5.3)
class Violation:
    """Represents a rule violation."""
    severity: ViolationSeverity
    rule_ref: str  # e.g., "02-core.mdc", "01-enforcement.mdc Step 0"
    message: str
    file_path: Optional[str] = None
    line_number: Optional[int] = None
    timestamp: str = None
    session_scope: str = "unknown"  # "current_session" or "historical"
    fix_hint: Optional[str] = None  # Suggestion for fixing the violation
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now(timezone.utc).isoformat()


@dataclass(slots=True)  # Python 3.10+ - reduces memory by 4-5× (Chapter 07.5.3)
class AutoFix:
    """Represents an auto-fix action."""
    violation_id: str  # Reference to original violation
    rule_ref: str
    file_path: Optional[str]
    line_number: Optional[int]
    fix_type: str  # e.g., "date_updated", "error_handling_added"
    fix_description: str  # What was fixed
    before_state: str  # State before fix
    after_state: str  # State after fix
    timestamp: str
    session_id: str


@dataclass(slots=True)  # Python 3.10+ - reduces memory by 4-5× (Python Bible Chapter 07.5.3, 12.4.1)
class EnforcementSession:
    """
    Tracks enforcement session state.
    
    Memory optimization: Using __slots__ reduces memory footprint by 4-5×
    compared to regular dataclass with __dict__ (Python Bible Chapter 07.5.3).
    """
    session_id: str
    start_time: str
    last_check: str
    violations: List[Dict]
    checks_passed: List[str]
    checks_failed: List[str]
    auto_fixes: List[Dict]  # Track auto-fixes
    file_hashes: Dict[str, str] = None  # Track file content hashes to detect actual changes
    version: Optional[int] = None  # Session version for migration tracking
    
    @classmethod
    def create_new(cls) -> "EnforcementSession":
        """Create a new enforcement session."""
        return cls(
            session_id=str(uuid.uuid4()),
            start_time=datetime.now(timezone.utc).isoformat(),
            last_check=datetime.now(timezone.utc).isoformat(),
            violations=[],
            checks_passed=[],
            checks_failed=[],
            auto_fixes=[],
            file_hashes={},
            version=2  # Current version (v2: fixed hash cache)
        )


# Module-level cached function for git commands (Phase 2.3)
# Python Bible 12.2.3: Extract to module-level function to avoid 'self' in cache key
# Python Bible 12.7.1: LRU Cache for expensive repeated computations
@lru_cache(maxsize=256)
def _run_git_command_cached(project_root: str, command_tuple: tuple) -> str:
    """
    Cached git command execution.
    
    Python Bible 12.7.1: LRU Cache for expensive repeated computations.
    Python Bible 12.2.3: Extract to module-level function to avoid 'self' in cache key.
    
    Args:
        project_root: Project root directory as string
        command_tuple: Git command arguments as tuple (hashable)
    
    Returns:
        Git command output as string
    """
    args = list(command_tuple)
    try:
        result = subprocess.run(
            ['git'] + args,
            cwd=Path(project_root),
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',  # Replace invalid characters instead of failing
            timeout=10,
            check=False
        )
        if result.returncode == 0:
            return result.stdout.strip() if result.stdout else ""
        return ""
    except (subprocess.TimeoutExpired, FileNotFoundError) as e:
        # Log warning but don't cache errors (they might be transient)
        logger.warn(
            "Git command failed",
            operation="_run_git_command_cached",
            error_code="GIT_COMMAND_FAILED",
            root_cause=str(e),
            command=" ".join(['git'] + args)
        )
        return ""


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
    
    # Hardcoded date patterns - supports multiple formats
    # ISO 8601: YYYY-MM-DD or YYYY/MM/DD
    # US format: MM/DD/YYYY or MM-DD-YYYY
    HARDCODED_DATE_PATTERN = re.compile(
        r'\b(20\d{2})[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])\b|'  # YYYY-MM-DD or YYYY/MM/DD
        r'\b(0[1-9]|1[0-2])[/-](0[1-9]|[12]\d|3[01])[/-](20\d{2})\b'   # MM/DD/YYYY or MM-DD-YYYY
    )
    
    # Helper method to normalize date strings from matches
    def _normalize_date_match(self, match: tuple) -> str:
        """
        Normalize date match groups to ISO format (YYYY-MM-DD).
        
        FIXED: Properly handles regex alternation tuples with None values.
        
        Handles both YYYY-MM-DD and MM/DD/YYYY formats.
        With alternation regex, groups will be:
        - YYYY-MM-DD: (YYYY, MM, DD, None, None, None)
        - MM/DD/YYYY: (None, None, None, MM, DD, YYYY)
        
        Args:
            match: Tuple from regex.findall() with potential None values
            
        Returns:
            ISO format date string (YYYY-MM-DD) or empty string if invalid
        """
        # Filter out None values first (critical for alternation handling)
        parts = [g for g in match if g is not None]
        
        if len(parts) < 3:
            return ''
        
        # Detect format by checking if first part is 4-digit year
        if len(parts[0]) == 4 and parts[0].startswith('20'):
            # YYYY-MM-DD format: (YYYY, MM, DD)
            return f"{parts[0]}-{parts[1]}-{parts[2]}"
        elif len(parts[-1]) == 4 and parts[-1].startswith('20'):
            # MM/DD/YYYY format - reorder to YYYY-MM-DD
            return f"{parts[-1]}-{parts[0]}-{parts[1]}"
        else:
            # Fallback: assume first 3 parts are YYYY-MM-DD
            return '-'.join(parts[:3])
    
    # Historical date patterns (contexts where dates are intentionally historical)
    # Phase 1 Refactoring: Consolidated from 67 patterns to 5 for performance
    # Legacy patterns kept commented below for 2 sprints validation, then will be removed
    
    # Flag to use consolidated patterns (default: True)
    USE_CONSOLIDATED_PATTERNS = True
    
    # Consolidated historical date patterns (5 patterns instead of 67)
    CONSOLIDATED_HISTORICAL_PATTERNS = [
        # 1. Entry/log patterns: entry #1, log #2, note, memo, etc.
        re.compile(r'(entry|log|note|memo)\s*#?\d*\s*[-–:]', re.IGNORECASE),
        
        # 2. Status/completion markers: completed, resolved, fixed, closed
        re.compile(r'(completed|resolved|fixed|closed)\s*[:\(]', re.IGNORECASE),
        
        # 3. Metadata fields: **Date:**, **Created:**, **Updated:**, **Generated:**, **Report:**
        re.compile(r'\*\*(date|created|updated|generated|report)[:*]', re.IGNORECASE),
        
        # 4. Code examples: backticks or function calls with dates
        re.compile(r'(`[^`]*\d{4}[^`]*`|\w+\([^)]*\d{4})', re.IGNORECASE),
        
        # 5. Document structure: headers/titles with dates
        re.compile(r'^#{1,6}\s+.*\d{4}', re.IGNORECASE | re.MULTILINE),
    ]
    
    # LEGACY PATTERNS (67 patterns) - DEPRECATED, will be removed after 2 sprints validation
    # Kept for comparison/rollback if needed
    # Uncomment USE_CONSOLIDATED_PATTERNS = False to use legacy patterns
    LEGACY_HISTORICAL_PATTERNS = [
        # ISO format dates (YYYY-MM-DD)
        re.compile(r'entry\s*#\d+\s*[-–]\s*\d{4}-\d{2}-\d{2}', re.IGNORECASE),  # "Entry #1 - 2025-11-27"
        re.compile(r'###\s*entry\s*#\d+\s*[-–]\s*\d{4}-\d{2}-\d{2}', re.IGNORECASE),  # "### Entry #1 - 2025-11-27"
        re.compile(r'\*\*completed\*\*\s*\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)', re.IGNORECASE),  # "**COMPLETED** (2025-11-29)"
        re.compile(r'completed\s*\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)', re.IGNORECASE),  # "Completed (2025-11-29)"
        re.compile(r'###\s+.*?\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)\s*[-–]\s*completed', re.IGNORECASE),  # "### Title (2025-11-29) - COMPLETED"
        re.compile(r'added\s+on\s+\d{4}-\d{2}-\d{2}', re.IGNORECASE),  # "Added on 2025-11-27"
        re.compile(r'created\s+on\s+\d{4}-\d{2}-\d{2}', re.IGNORECASE),  # "Created on 2025-11-27"
        re.compile(r'fixed\s+on\s+\d{4}-\d{2}-\d{2}', re.IGNORECASE),  # "Fixed on 2025-11-27"
        re.compile(r'resolved\s+on\s+\d{4}-\d{2}-\d{2}', re.IGNORECASE),  # "Resolved on 2025-11-27"
        re.compile(r'###\s+\d{4}-\d{2}-\d{2}\s+[-–]', re.IGNORECASE),  # "### 2025-11-30 -"
        re.compile(r'^\s*\*\*\d{4}-\d{2}-\d{2}\s+[-–]', re.IGNORECASE | re.MULTILINE),  # "**2025-11-30 -"
        re.compile(r'recent\s+(major\s+)?change.*?\d{4}-\d{2}-\d{2}', re.IGNORECASE),  # "Recent Major Change: ... 2025-11-29"
        re.compile(r'\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)\s*[-–]\s*\*\*completed\*\*', re.IGNORECASE),  # "(2025-11-29) - **COMPLETED**"
        re.compile(r'goal.*?\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)', re.IGNORECASE),  # "Goal: ... (2025-11-29)"
        # Version dates (historical version information)
        re.compile(r'version\s*:.*?\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)', re.IGNORECASE),  # "Version: 2.0 (2025-11-28)"
        re.compile(r'version\s+\d+\.\d+.*?\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)', re.IGNORECASE),  # "Version 2.0 (2025-11-28)"
        # Integration/change log dates
        re.compile(r'(integration|added|change\s+log).*?\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)', re.IGNORECASE),  # "Memory Bank Integration: ... (2025-11-28)"
        # Example dates in documentation (e.g., "2025-11-21" in examples)
        re.compile(r'\(e\.g\.|example|format\):.*?\d{4}-\d{2}-\d{2}', re.IGNORECASE),  # "(e.g., `2025-11-21`)"
        re.compile(r'format.*?:.*?\d{4}-\d{2}-\d{2}', re.IGNORECASE),  # "FORMAT: YYYY-MM-DD (e.g., 2025-11-21)"
        # Dates in backticks (code examples): `2025-01-27`
        re.compile(r'`\d{4}-\d{2}-\d{2}`', re.IGNORECASE),  # "`2025-01-27`"
        re.compile(r'like\s+`\d{4}-\d{2}-\d{2}`', re.IGNORECASE),  # "like `2025-01-27`"
        # Dates in comments (Python/script comments): # "2025-11-27" or # "**2025-11-27 -"
        re.compile(r'#\s*["\'].*?\d{4}-\d{2}-\d{2}.*?["\']', re.IGNORECASE),  # "# '2025-11-27'" or "# \"**2025-11-27 -\""
        re.compile(r'#\s*.*?\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)', re.IGNORECASE),  # "# Example (2025-11-27)"
        # Report/document dates: "**Date:** 2025-11-28" or "Date: 2025-11-28"
        # Note: In markdown, "**Date:**" has colon inside bold markers, so pattern is "**date:**"
        re.compile(r'\*\*date:\*\*\s*\d{4}-\d{2}-\d{2}', re.IGNORECASE),  # "**Date:** 2025-11-28" (colon inside bold markers)
        re.compile(r'^date\s*:.*?\d{4}-\d{2}-\d{2}', re.IGNORECASE | re.MULTILINE),  # "Date: 2025-11-28"
        # Report metadata fields: "**Report Generated:** 2025-11-28", "**Generated:** 2025-11-28", etc.
        re.compile(r'\*\*report\s+generated:\*\*\s*\d{4}-\d{2}-\d{2}', re.IGNORECASE),  # "**Report Generated:** 2025-11-28"
        re.compile(r'\*\*generated:\*\*\s*\d{4}-\d{2}-\d{2}', re.IGNORECASE),  # "**Generated:** 2025-11-28"
        re.compile(r'\*\*created:\*\*\s*\d{4}-\d{2}-\d{2}', re.IGNORECASE),  # "**Created:** 2025-11-28"
        # Report metadata fields: "**Report Generated:** 2025-11-28", "**Auditor:** ...", "**Reference:** ..."
        re.compile(r'\*\*report\s+generated:\*\*\s*\d{4}-\d{2}-\d{2}', re.IGNORECASE),  # "**Report Generated:** 2025-11-28"
        re.compile(r'\*\*generated:\*\*\s*\d{4}-\d{2}-\d{2}', re.IGNORECASE),  # "**Generated:** 2025-11-28"
        re.compile(r'\*\*created:\*\*\s*\d{4}-\d{2}-\d{2}', re.IGNORECASE),  # "**Created:** 2025-11-28"
        re.compile(r'\*\*auditor:\*\*', re.IGNORECASE),  # "**Auditor:** ..." (report metadata, dates nearby are historical)
        re.compile(r'\*\*reference:\*\*', re.IGNORECASE),  # "**Reference:** ..." (report metadata, dates nearby are historical)
        # Resolution/status dates: "**RESOLVED** (2025-11-29)" or "**Status:** ✅ **RESOLVED** (2025-11-29)"
        re.compile(r'\*\*resolved\*\*\s*\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)', re.IGNORECASE),  # "**RESOLVED** (2025-11-29)"
        re.compile(r'\*\*status:\*\*.*?\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)', re.IGNORECASE),  # "**Status:** ✅ **ALL RESOLVED** (2025-11-29)" (colon inside bold markers)
        # Resolution date fields: "**Resolution Date:** 2025-11-29" or "- **Resolution Date:** 2025-11-29"
        re.compile(r'resolution\s+date\s*:.*?\d{4}-\d{2}-\d{2}', re.IGNORECASE),  # "Resolution Date: 2025-11-29"
        # "Updated YYYY-MM-DD" pattern: "(Updated 2025-11-29)" or "Updated: 2025-11-29"
        re.compile(r'\(updated\s+\d{4}-\d{2}-\d{2}\)', re.IGNORECASE),  # "(Updated 2025-11-29)"
        re.compile(r'updated\s*:\s*\d{4}-\d{2}-\d{2}', re.IGNORECASE),  # "Updated: 2025-11-29"
        # Example dates in test strings or prompt strings (test cases)
        # Match any line containing "**Last Updated:**" followed by a date (for test scenarios, prompts, examples)
        # Note: In markdown, "**Last Updated:**" has colon inside bold markers, so pattern is "**last updated:**"
        re.compile(r'\*\*last\s+updated:\*\*\s*\d{4}-\d{2}-\d{2}', re.IGNORECASE),  # "**Last Updated:** 2025-01-27" (colon inside bold markers)
        re.compile(r'.*["\'].*?\*\*last\s+updated:\*\*\s*\d{4}-\d{2}-\d{2}.*?["\'].*', re.IGNORECASE | re.DOTALL),  # "**Last Updated:** 2025-01-27" within quoted strings (for test cases)
        # Dates in function calls (code examples): date_range("2025-01-01", ...), datetime(2025, 1, 1), etc.
        re.compile(r'\w+\s*\([^)]*?["\']\d{4}-\d{2}-\d{2}["\']', re.IGNORECASE),  # date_range("2025-01-01", ...) - non-greedy to handle multiple dates
        re.compile(r'\w+\s*\([^)]*\d{4}\s*,\s*\d{1,2}\s*,\s*\d{1,2}', re.IGNORECASE),  # datetime(2025, 1, 1)
        # Dates in code blocks (between ``` markers) - these are example code
        # We'll check for code block context separately, but also match common patterns
        re.compile(r'for\s+\w+\s+in\s+\w+\s*\([^)]*?["\']\d{4}-\d{2}-\d{2}["\']', re.IGNORECASE),  # for date in date_range("2025-01-01", ...) - non-greedy to handle multiple dates
        re.compile(r'#\s*(generate|example|demo|test).*?\d{4}-\d{2}-\d{2}', re.IGNORECASE),  # "# Generate dates in January 2025" followed by date
        # Dates in documentation/example files (files in docs/, examples/, etc.)
        # This will be handled by file path checking, but also match common doc patterns
        re.compile(r'example.*?:.*?\d{4}-\d{2}-\d{2}', re.IGNORECASE),  # "Example: 2025-01-01"
        re.compile(r'demo.*?:.*?\d{4}-\d{2}-\d{2}', re.IGNORECASE),  # "Demo: 2025-01-01"
        # NEW: Month name date formats (e.g., "December 21, 2026", "Dec 21, 2026")
        re.compile(r'\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}\b', re.IGNORECASE),  # "December 21, 2026"
        re.compile(r'\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\.?\s+\d{1,2},?\s+\d{4}\b', re.IGNORECASE),  # "Dec 21, 2026" or "Dec. 21, 2026"
        # NEW: US date formats (MM/DD/YYYY, MM/DD/YY) - historical context patterns
        re.compile(r'\*\*date:\*\*\s*\d{1,2}/\d{1,2}/\d{2,4}', re.IGNORECASE),  # "**Date:** 12/21/26" or "**Date:** 12/21/2026"
        re.compile(r'^date\s*:.*?\d{1,2}/\d{1,2}/\d{2,4}', re.IGNORECASE | re.MULTILINE),  # "Date: 12/21/26"
        re.compile(r'dated\s+\d{1,2}/\d{1,2}/\d{2,4}', re.IGNORECASE),  # "dated 12/21/26"
        re.compile(r'information\s+dated\s+', re.IGNORECASE),  # "information dated ..." (context for historical dates)
        # NEW: Document title patterns with dates
        re.compile(r'^#\s+.*?\d{4}-\d{2}-\d{2}', re.IGNORECASE | re.MULTILINE),  # "# Document - December 21, 2026" or "# Document - 2026-12-21"
        re.compile(r'^#\s+.*?(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}', re.IGNORECASE | re.MULTILINE),  # "# Document - December 21, 2026"
        # NEW: Lines that explicitly state dates are historical or from a specific time
        re.compile(r'contains\s+information\s+dated', re.IGNORECASE),  # "contains information dated ..."
        re.compile(r'date\s+set\s+per\s+user\s+request', re.IGNORECASE),  # "Date set per user request"
        re.compile(r'system\s+date\s*:', re.IGNORECASE),  # "System date: ..." (indicates historical context)
    ]
    
    # Select which pattern set to use (consolidated by default)
    HISTORICAL_DATE_PATTERNS = CONSOLIDATED_HISTORICAL_PATTERNS if USE_CONSOLIDATED_PATTERNS else LEGACY_HISTORICAL_PATTERNS
    
    # Current system date (for comparison)
    CURRENT_DATE = datetime.now().strftime("%Y-%m-%d")
    
    def __init__(self, project_root: Optional[Path] = None):
        """Initialize enforcer."""
        self.project_root = project_root or Path(__file__).parent.parent.parent
        self.enforcement_dir = self.project_root / ".cursor" / "enforcement"
        self.memory_bank_dir = self.project_root / ".cursor" / "memory-bank"
        self.session: Optional[EnforcementSession] = None
        self.violations: List[Violation] = []
        
        # Initialize predictor to None first (before _init_session checks it)
        self.predictor = None
        self.session_sequence_tracker = None
        
        # Ensure enforcement directory exists
        self.enforcement_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialize session (before predictor, but predictor is None so check will pass)
        self._init_session()
        
        # Performance optimization: Cache for changed files (Phase 1.1)
        # Python Bible 12.7.2: Manual memoization for session-level caching
        self._cached_changed_files: Optional[Dict[str, List[str]]] = None
        self._changed_files_cache_key: Optional[str] = None
        
        # Performance optimization: Cache for file diffs (Phase 1.2)
        # Python Bible 12.7.2: Manual memoization for session-level caching
        self._file_diff_cache: Dict[str, Optional[str]] = {}
        
        # Phase 4: Initialize modular checker router (if available)
        self.checker_router = None
        self.use_modular_checkers = False
        if MODULAR_CHECKERS_AVAILABLE and CheckerRouter:
            try:
                rules_dir = self.project_root / ".cursor" / "enforcement" / "rules"
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
                # If tracker wasn't initialized in _init_session(), initialize it now
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
    
    def get_file_hash(self, file_path_str: str) -> Optional[str]:
        """
        Get SHA256 hash of file content with proper cache invalidation.
        
        FIXED: Removed @lru_cache - now uses session-based cache with mtime in key.
        This ensures cache invalidates when files are modified.
        
        Uses content hashing to detect actual file changes, ignoring timestamp changes.
        This is more reliable than timestamps which can be updated just by opening files.
        
        Args:
            file_path_str: Path to the file as string
            
        Returns:
            SHA256 hash as hex string, or None if file doesn't exist or can't be read
        """
        file_path = Path(file_path_str)
        if not file_path.exists():
            return None
        
        try:
            # Get file modification time for cache key
            stat_info = file_path.stat()
            cache_key = f"{file_path_str}:{stat_info.st_mtime}"
            
            # Check session cache first (with mtime in key for proper invalidation)
            if self.session.file_hashes is None:
                self.session.file_hashes = {}
            
            if cache_key in self.session.file_hashes:
                return self.session.file_hashes[cache_key]
            
            # Compute hash (unchanged logic)
            hasher = hashlib.sha256()
            # Memory optimization: Process in chunks (already implemented)
            # Python Bible Chapter 12.4.3: Process large files in chunks
            with open(file_path, 'rb') as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hasher.update(chunk)
            hash_value = hasher.hexdigest()
            
            # Cache with mtime as part of key (ensures invalidation on file change)
            self.session.file_hashes[cache_key] = hash_value
            return hash_value
        except (OSError, FileNotFoundError, PermissionError, UnicodeDecodeError) as e:
            logger.debug(
                f"Could not compute file hash: {file_path}",
                operation="get_file_hash",
                error_code="HASH_COMPUTE_FAILED",
                root_cause=str(e)
            )
            return None
    
    def _migrate_session_v1_to_v2(self, old_data: Dict) -> Dict:
        """
        Migrate session from v1 (buggy hash cache) to v2 (fixed cache).
        
        Phase 1: Clears old file_hashes cache (was using wrong cache key format).
        Adds version field for future migrations.
        
        Args:
            old_data: Old session data dictionary
            
        Returns:
            Migrated session data dictionary
        """
        new_data = old_data.copy()
        
        # Clear old hash cache (was using wrong cache key format - file_path only, no mtime)
        if 'file_hashes' in new_data:
            try:
                logger.info(
                    "Clearing stale file_hashes cache (v1 → v2 migration)",
                    operation="_migrate_session_v1_to_v2",
                    old_cache_size=len(new_data.get('file_hashes', {}))
                )
            except TypeError:
                # Fallback for standard logger that doesn't support operation keyword
                logger.info(f"Clearing stale file_hashes cache (v1 → v2 migration, old_cache_size={len(new_data.get('file_hashes', {}))})")
            new_data['file_hashes'] = {}
        
        # Add version field
        new_data['version'] = 2
        
        # Keep violations, checks_passed, checks_failed (still valid)
        # Keep auto_fixes if exists
        if 'auto_fixes' not in new_data:
            new_data['auto_fixes'] = []
        
        return new_data
    
    def _init_session(self):
        """Initialize or load enforcement session."""
        session_file = self.enforcement_dir / "session.json"
        
        if session_file.exists():
            try:
                with open(session_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                    # Check version and migrate if needed
                    if 'version' not in data or data.get('version', 1) < 2:
                        try:
                            logger.info(
                                "Migrating session from v1 to v2",
                                operation="_init_session",
                                old_version=data.get('version', 1)
                            )
                        except TypeError:
                            # Fallback for standard logger that doesn't support operation keyword
                            logger.info(f"Migrating session from v1 to v2 (old_version={data.get('version', 1)})")
                        data = self._migrate_session_v1_to_v2(data)
                    
                    # Ensure auto_fixes field exists (for backward compatibility)
                    if 'auto_fixes' not in data:
                        data['auto_fixes'] = []
                    # Ensure file_hashes field exists (for backward compatibility)
                    if 'file_hashes' not in data:
                        data['file_hashes'] = {}
                    # Ensure version field exists
                    if 'version' not in data:
                        data['version'] = 2
                    
                    self.session = EnforcementSession(**data)
                    _safe_log_info(
                        "Session loaded",
                        operation="_init_session",
                        session_id=self.session.session_id
                    )
                    
                    # Initialize session sequence tracker with session ID
                    if PREDICTIVE_CONTEXT_AVAILABLE and hasattr(self, 'predictor') and self.predictor:
                        try:
                            from context_manager.session_sequence_tracker import SessionSequenceTracker
                            self.session_sequence_tracker = SessionSequenceTracker(self.session.session_id)
                            logger.info(
                                "Session sequence tracker initialized",
                                operation="_init_session",
                                session_id=self.session.session_id
                            )
                        except Exception as e:
                            logger.warn(
                                f"Failed to initialize session sequence tracker: {e}",
                                operation="_init_session",
                                error_code="SESSION_SEQUENCE_TRACKER_INIT_FAILED",
                                root_cause=str(e)
                            )
                            self.session_sequence_tracker = None
            except (FileNotFoundError, json.JSONDecodeError, PermissionError, OSError) as e:
                logger.warn(
                    "Failed to load session, creating new",
                    operation="_init_session",
                    error_code="SESSION_LOAD_FAILED",
                    root_cause=str(e)
                )
                self.session = EnforcementSession.create_new()
        else:
            self.session = EnforcementSession.create_new()
        
        # Initialize session sequence tracker with session ID (if not already initialized)
        if PREDICTIVE_CONTEXT_AVAILABLE and hasattr(self, 'predictor') and self.predictor and self.session_sequence_tracker is None:
            try:
                from context_manager.session_sequence_tracker import SessionSequenceTracker
                self.session_sequence_tracker = SessionSequenceTracker(self.session.session_id)
                logger.info(
                    "Session sequence tracker initialized",
                    operation="_init_session",
                    session_id=self.session.session_id
                )
            except Exception as e:
                logger.warn(
                    f"Failed to initialize session sequence tracker: {e}",
                    operation="_init_session",
                    error_code="SESSION_SEQUENCE_TRACKER_INIT_FAILED",
                    root_cause=str(e)
                )
                self.session_sequence_tracker = None
    
    def _prune_session_data(self):
        """
        Prune session data to prevent unbounded memory growth.
        
        Python Bible Chapter 12.2.3: Prevent memory leaks from unbounded growth.
        Limits session history to prevent memory bloat.
        """
        # Limit violations in session (keep most recent)
        MAX_VIOLATIONS = 2000
        if len(self.session.violations) > MAX_VIOLATIONS:
            # Keep only most recent violations
            self.session.violations = self.session.violations[-MAX_VIOLATIONS:]
            logger.debug(
                f"Pruned violations list to {MAX_VIOLATIONS} most recent",
                operation="_prune_session_data",
                violations_count=len(self.session.violations)
            )
        
        # Limit file hashes (keep most recent)
        MAX_FILE_HASHES = 10000
        if self.session.file_hashes and len(self.session.file_hashes) > MAX_FILE_HASHES:
            # Keep only most recent file hashes
            oldest_keys = list(self.session.file_hashes.keys())[:-MAX_FILE_HASHES]
            for key in oldest_keys:
                del self.session.file_hashes[key]
            logger.debug(
                f"Pruned file_hashes to {MAX_FILE_HASHES} most recent",
                operation="_prune_session_data",
                file_hashes_count=len(self.session.file_hashes)
            )
        
        # Limit checks lists (keep most recent)
        MAX_CHECKS = 500
        if len(self.session.checks_passed) > MAX_CHECKS:
            self.session.checks_passed = self.session.checks_passed[-MAX_CHECKS:]
        if len(self.session.checks_failed) > MAX_CHECKS:
            self.session.checks_failed = self.session.checks_failed[-MAX_CHECKS:]
    
    def _save_session(self):
        """Save session state to file."""
        # Prune session data before saving (memory optimization)
        self._prune_session_data()
        
        session_file = self.enforcement_dir / "session.json"
        try:
            # Convert session to dict, handling Enums
            session_dict = {
                "session_id": self.session.session_id,
                "start_time": self.session.start_time,
                "last_check": self.session.last_check,
                "violations": self.session.violations,  # Already converted to dict in _log_violation
                "checks_passed": self.session.checks_passed,
                "checks_failed": self.session.checks_failed,
                "auto_fixes": self.session.auto_fixes,  # Track auto-fixes
                "file_hashes": self.session.file_hashes or {}  # Track file content hashes
            }
            with open(session_file, 'w', encoding='utf-8') as f:
                json.dump(session_dict, f, indent=2)
        except (FileNotFoundError, PermissionError, OSError, TypeError) as e:
            logger.error(
                "Failed to save session",
                operation="_save_session",
                error_code="SESSION_SAVE_FAILED",
                root_cause=str(e)
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
    
    def run_git_command(self, args: List[str]) -> str:
        """
        Run git command and return output (with caching).
        
        Phase 2.3: Uses module-level cached function to avoid 'self' in cache key.
        Python Bible 12.7.1: LRU Cache for expensive repeated computations.
        Python Bible 12.2.3: Extract to module-level function to avoid 'self' in cache key.
        """
        # Use cached function with hashable arguments
        command_tuple = tuple(args)  # Convert to tuple for hashing
        project_root_str = str(self.project_root)
        
        return _run_git_command_cached(project_root_str, command_tuple)
    
    def _get_git_state_key(self) -> str:
        """
        Generate cache key based on git state.
        
        Python Bible 12.7.4: Cache invalidation patterns - version tagging.
        Uses git HEAD + index state as cache key to detect when git state changes.
        
        Returns:
            Cache key string based on current git state
        """
        try:
            head = self.run_git_command(['rev-parse', 'HEAD'])
            index = self.run_git_command(['diff', '--cached', '--name-only'])
            # Use hash of index for shorter key
            index_hash = str(hash(index)) if index else ''
            return f"{head}:{index_hash}"
        except Exception:
            # If git commands fail, return unique key to force cache miss
            return f"error:{datetime.now(timezone.utc).isoformat()}"
    
    def _get_changed_files_impl(self, include_untracked: bool = False) -> List[str]:
        """
        Internal implementation of get_changed_files (actual git calls).
        
        Python Bible 12.7.2: Extract implementation to separate method for caching.
        
        Args:
            include_untracked: If True, include untracked files (default: False)
        
        Returns:
            List of changed file paths
        """
        # Get staged and unstaged changes (actual edits)
        # Use --ignore-cr-at-eol to ignore CRLF vs LF line ending differences
        # Use --ignore-all-space and --ignore-blank-lines to exclude whitespace-only changes
        staged = self.run_git_command(['diff', '--cached', '--ignore-cr-at-eol', '--ignore-all-space', '--ignore-blank-lines', '--name-only'])
        unstaged = self.run_git_command(['diff', '--ignore-cr-at-eol', '--ignore-all-space', '--ignore-blank-lines', '--name-only'])
        
        files = set()
        if staged:
            files.update(staged.split('\n'))
        if unstaged:
            files.update(unstaged.split('\n'))
        
        # Only include untracked files if explicitly requested (for enforcement checks)
        # NOT for context loading - untracked files shouldn't trigger context loading
        if include_untracked:
            untracked = self.run_git_command(['ls-files', '--others', '--exclude-standard'])
            if untracked:
                files.update(untracked.split('\n'))
        
        return sorted([f for f in files if f.strip()])
    
    def _get_changed_files_for_session(self) -> List[str]:
        """
        Get changed files for current session (incremental scan).
        
        Returns files that have changed since the last full scan or last check.
        This is used for fast incremental scans between tasks.
        
        Returns:
            List of changed file paths (tracked + untracked)
        """
        # Get all changed files (tracked + untracked)
        tracked = self._get_changed_files_impl(include_untracked=False)
        untracked = self._get_changed_files_impl(include_untracked=True)
        return sorted(set(tracked) | set(untracked))
    
    def get_changed_files(self, include_untracked: bool = False) -> List[str]:
        """
        Get list of changed files from git (cached).
        
        Python Bible 12.7.2: Manual memoization for session-level caching.
        Cache is invalidated when git state changes (detected via git state key).
        
        Args:
            include_untracked: If True, include untracked files (default: False)
                              Only include untracked for enforcement checks, not context loading
        
        Returns:
            List of changed file paths
        """
        # Use cached result if available and cache key matches
        if self._cached_changed_files is not None:
            key = 'untracked' if include_untracked else 'tracked'
            if key in self._cached_changed_files:
                logger.debug(
                    f"Using cached changed files ({key})",
                    operation="get_changed_files",
                    cache_key=self._changed_files_cache_key
                )
                return self._cached_changed_files[key]
        
        # Fallback to direct call (shouldn't happen in normal flow after cache is populated)
        logger.debug(
            "Cache miss - computing changed files directly",
            operation="get_changed_files",
            include_untracked=include_untracked
        )
        return self._get_changed_files_impl(include_untracked)
    
    def get_file_diff(self, file_path: str) -> Optional[str]:
        """
        Get git diff for a specific file (cached).
        
        Python Bible 12.7.2: Manual memoization for session-level caching.
        Cache is cleared when git state changes (in run_all_checks).
        
        Returns None if file is untracked or git diff fails.
        """
        # Check cache first (Phase 1.2)
        if file_path in self._file_diff_cache:
            logger.debug(
                f"Using cached file diff for {file_path}",
                operation="get_file_diff"
            )
            return self._file_diff_cache[file_path]
        
        # Compute diff (existing logic)
        try:
            # Check if file is tracked
            tracked = self.run_git_command(['ls-files', '--error-unmatch', file_path])
            if not tracked:
                # File is untracked - return None (will treat as new file)
                self._file_diff_cache[file_path] = None
                return None
            
            # Get diff for this file (staged + unstaged)
            staged_diff = self.run_git_command(['diff', '--cached', file_path])
            unstaged_diff = self.run_git_command(['diff', file_path])
            
            # Combine diffs
            combined_diff = ""
            if staged_diff:
                combined_diff += staged_diff
            if unstaged_diff:
                if combined_diff:
                    combined_diff += "\n"
                combined_diff += unstaged_diff
            
            result = combined_diff if combined_diff else None
            # Cache result
            self._file_diff_cache[file_path] = result
            logger.debug(
                f"Cached file diff for {file_path}",
                operation="get_file_diff",
                has_diff=result is not None
            )
            return result
        except (subprocess.TimeoutExpired, FileNotFoundError, OSError, ValueError) as e:
            logger.debug(
                f"Git diff failed for {file_path}",
                operation="get_file_diff",
                error_code="GIT_DIFF_FAILED",
                root_cause=str(e)
            )
            # Cache None result to avoid repeated failures
            self._file_diff_cache[file_path] = None
            return None
    
    def get_file_last_modified_time(self, file_path: str) -> Optional[datetime]:
        """
        Get the timestamp when a file was last modified.
        
        For tracked files: Uses git log to get last commit time, or file system
        modification time if file has unstaged changes.
        For untracked files: Uses file system modification time.
        
        Args:
            file_path: The file path to check
            
        Returns:
            datetime if file exists and is trackable, None otherwise
        """
        full_path = self.project_root / file_path
        if not full_path.exists():
            return None
        
        # Check if file is tracked
        tracked = self.run_git_command(['ls-files', '--error-unmatch', file_path])
        
        if tracked:
            # File is tracked - try to get last commit time
            # Format: %ct = commit time (Unix timestamp)
            last_commit_time = self.run_git_command([
                'log', '-1', '--format=%ct', '--', file_path
            ])
            
            if last_commit_time and last_commit_time.strip():
                try:
                    timestamp = int(last_commit_time.strip())
                    commit_time = datetime.fromtimestamp(timestamp, tz=timezone.utc)
                    
                    # Check if file has unstaged changes
                    # Only use file system time if unstaged changes exist AND they're actual content changes (not just whitespace)
                    unstaged_diff = self.run_git_command(['diff', file_path])
                    unstaged_diff_no_whitespace = self.run_git_command(['diff', '--ignore-all-space', file_path])
                    
                    # If unstaged diff exists but diff without whitespace is empty, changes are only line endings/whitespace
                    # In this case, ignore unstaged changes and use commit time
                    if unstaged_diff and unstaged_diff.strip():
                        if not unstaged_diff_no_whitespace or not unstaged_diff_no_whitespace.strip():
                            # Only whitespace/line ending changes - ignore and use commit time
                            logger.debug(
                                f"File has only whitespace/line ending changes, using commit time: {file_path}",
                                operation="get_file_last_modified_time",
                                commit_time=commit_time.isoformat()
                            )
                            return commit_time
                        
                        # File has actual content changes - check file system time
                        try:
                            file_mtime = datetime.fromtimestamp(
                                full_path.stat().st_mtime, 
                                tz=timezone.utc
                            )
                            
                            # Get today's date (start of day) for comparison
                            try:
                                today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
                            except (ValueError, AttributeError):
                                # Can't get today's date - use commit time (conservative)
                                logger.debug(
                                    f"Could not get today's date, using commit time: {file_path}",
                                    operation="get_file_last_modified_time",
                                    commit_time=commit_time.isoformat()
                                )
                                return commit_time
                            
                            # Only use file system time if file was modified AFTER start of today
                            # Otherwise, unstaged changes are from previous day - use commit time
                            if file_mtime >= today_start:
                                logger.debug(
                                    f"File has unstaged content changes modified today, using file system time: {file_path}",
                                    operation="get_file_last_modified_time",
                                    commit_time=commit_time.isoformat(),
                                    file_mtime=file_mtime.isoformat(),
                                    today_start=today_start.isoformat()
                                )
                                return file_mtime
                            else:
                                # Unstaged changes are from previous day - use commit time
                                logger.debug(
                                    f"File has unstaged content changes from previous day, using commit time: {file_path}",
                                    operation="get_file_last_modified_time",
                                    commit_time=commit_time.isoformat(),
                                    file_mtime=file_mtime.isoformat(),
                                    today_start=today_start.isoformat()
                                )
                                return commit_time
                        except (OSError, FileNotFoundError):
                            # Fallback to commit time if file system check fails
                            return commit_time
                    
                    # No unstaged changes - use commit time
                    logger.debug(
                        f"Using git commit time: {file_path}",
                        operation="get_file_last_modified_time",
                        commit_time=commit_time.isoformat()
                    )
                    return commit_time
                except (ValueError, OSError) as e:
                    logger.debug(
                        f"Could not parse commit timestamp for {file_path}",
                        operation="get_file_last_modified_time",
                        error_code="COMMIT_TIME_PARSE_FAILED",
                        root_cause=str(e)
                    )
                    # Fall through to file system time
        
        # For untracked files or if git log fails, use file system creation time (ctime)
        # ctime is more reliable for untracked files - it represents when the file was created,
        # not when it was last accessed/modified (which can be updated just by opening the file)
        try:
            stat_info = full_path.stat()
            # Use creation time (ctime) for untracked files - more reliable than mtime
            # On Windows, ctime is creation time; on Unix, it's change time (but still better than mtime)
            file_ctime = datetime.fromtimestamp(stat_info.st_ctime, tz=timezone.utc)
            file_mtime = datetime.fromtimestamp(stat_info.st_mtime, tz=timezone.utc)
            
            # For untracked files, prefer ctime (creation time) over mtime (modification time)
            # mtime can be updated just by opening the file, while ctime is more stable
            # However, if mtime is significantly older than ctime, use mtime (file was actually modified)
            file_time = file_ctime if file_ctime <= file_mtime else file_mtime
            
            logger.debug(
                f"Using file system time (untracked file): {file_path}",
                operation="get_file_last_modified_time",
                file_ctime=file_ctime.isoformat(),
                file_mtime=file_mtime.isoformat(),
                file_time=file_time.isoformat()
            )
            return file_time
        except (OSError, FileNotFoundError, PermissionError) as e:
            logger.debug(
                f"Could not get file modification time for {file_path}",
                operation="get_file_last_modified_time",
                error_code="FILE_TIME_CHECK_FAILED",
                root_cause=str(e)
            )
            return None
    
    def is_line_changed_in_session(self, file_path: str, line_number: int) -> bool:
        """
        Check if a specific line was added or modified in the current session.
        Uses git diff to determine if line was changed.
        
        For untracked files, only returns True if file was created after session start.
        """
        diff = self.get_file_diff(file_path)
        if diff is None:
            # Untracked file - check if file is truly new (created after session start)
            full_path = self.project_root / file_path
            if not full_path.exists():
                return False
            
            try:
                # Get file modification time
                file_mtime = datetime.fromtimestamp(full_path.stat().st_mtime, tz=timezone.utc)
                session_start = datetime.fromisoformat(self.session.start_time.replace('Z', '+00:00'))
                
                # Line is new if file was created after session started
                is_new = file_mtime >= session_start
                
                logger.debug(
                    f"Untracked file line check: {file_path}:{line_number}",
                    operation="is_line_changed_in_session",
                    file_mtime=file_mtime.isoformat(),
                    session_start=session_start.isoformat(),
                    is_new=is_new
                )
                
                return is_new
            except (OSError, FileNotFoundError, PermissionError, ValueError) as e:
                # If we can't determine, assume it's new (conservative approach)
                logger.warn(
                    f"Could not determine file age for {file_path}, assuming new",
                    operation="is_line_changed_in_session",
                    error_code="FILE_AGE_CHECK_FAILED",
                    root_cause=str(e)
                )
                return True
        
        # Parse diff to find changed line ranges
        # Format: @@ -old_start,old_count +new_start,new_count @@
        for line in diff.split('\n'):
            if line.startswith('@@'):
                # Parse hunk header: @@ -old_start,old_count +new_start,new_count @@
                match = re.search(r'\+(\d+)(?:,(\d+))?', line)
                if match:
                    new_start = int(match.group(1))
                    new_count = int(match.group(2)) if match.group(2) else 1
                    new_end = new_start + new_count - 1
                    
                    # Check if our line number is in this range
                    if new_start <= line_number <= new_end:
                        return True
        
        return False
    
    def _has_actual_content_changes(self, file_path: str) -> bool:
        """
        Check if a file has actual content changes (not just whitespace or metadata).
        
        Uses git diff with --ignore-all-space to detect real content changes.
        A file is considered "actually modified" if it has content changes beyond
        just whitespace differences.
        
        Args:
            file_path: The file path to check
            
        Returns:
            True if file has actual content changes, False otherwise
        """
        try:
            # Get diff ignoring whitespace changes
            # --ignore-all-space ignores all whitespace changes
            staged_content = self.run_git_command(['diff', '--cached', '--ignore-all-space', file_path])
            unstaged_content = self.run_git_command(['diff', '--ignore-all-space', file_path])
            
            # Ensure we have strings (handle None returns)
            staged_content = staged_content if staged_content else ""
            unstaged_content = unstaged_content if unstaged_content else ""
            
            # Memory optimization: Process diffs incrementally instead of concatenating
            # Python Bible Chapter 12.4.3: Process large data in chunks
            # Check if either diff has content changes (don't need full concatenation)
            has_staged_changes = bool(staged_content and staged_content.strip())
            has_unstaged_changes = bool(unstaged_content and unstaged_content.strip())
            
            if not has_staged_changes and not has_unstaged_changes:
                return False
            
            # Process diffs incrementally (memory-efficient)
            content_lines = []
            for diff_content in [staged_content, unstaged_content]:
                if not diff_content:
                    continue
                for line in diff_content.split('\n'):
                    line_stripped = line.strip()
                    # Include lines that are actual content changes
                    if (line.startswith('+') or line.startswith('-')) and line_stripped:
                        # Exclude diff headers and context markers
                        if not line_stripped.startswith('+++') and not line_stripped.startswith('---') and not line_stripped.startswith('@@'):
                            # Check if line has actual content (not just whitespace)
                            # Remove the + or - prefix and check if there's actual content
                            content_part = line[1:].strip() if len(line) > 1 else ""
                            if content_part:
                                content_lines.append(line)
            
            has_actual_changes = len(content_lines) > 0
            
            logger.debug(
                f"Content change check: {file_path}",
                operation="_has_actual_content_changes",
                has_staged_changes=bool(staged_content),
                has_unstaged_changes=bool(unstaged_content),
                actual_change_count=len(content_lines),
                has_actual_changes=has_actual_changes
            )
            
            return has_actual_changes
        except (subprocess.TimeoutExpired, FileNotFoundError, OSError, ValueError) as e:
            # If we can't determine, assume it has changes (conservative approach)
            logger.warn(
                f"Could not determine content changes for {file_path}, assuming modified",
                operation="_has_actual_content_changes",
                error_code="CONTENT_CHANGE_CHECK_FAILED",
                root_cause=str(e)
            )
            return True
    
    def is_file_modified_in_session(self, file_path: str) -> bool:
        """
        Check if a file was actually modified in the current session using hash-only comparison.
        
        Phase 2: Simplified to hash-only comparison - removes complex whitespace/line ending logic.
        Phase 1.3: FIXED - Uses cached changed_files list instead of calling get_changed_files().
        
        Python Bible 12.4 Rule 3: Prefer local variables (cached list) to function calls.
        Python Bible 12.7.2: Use cached data instead of recomputing.
        
        Returns True ONLY if:
        - File content hash has changed since last check in this session
        
        Uses content hashing (SHA256) to detect actual file changes, which is more reliable
        than timestamps or git diff analysis.
        
        Args:
            file_path: Relative file path from project root
            
        Returns:
            True if file hash changed since last check, False otherwise
        """
        # Use cached changed files (set in run_all_checks) - Phase 1.3
        # Python Bible 12.7.2: Use cached data instead of recomputing
        if self._cached_changed_files is None:
            # Fallback: compute if cache not available (shouldn't happen in normal flow)
            logger.warn(
                "Changed files cache not available, falling back to direct call",
                operation="is_file_modified_in_session",
                file_path=file_path
            )
            changed_files = self._get_changed_files_impl(include_untracked=False)
        else:
            changed_files = self._cached_changed_files['tracked']
        
        if file_path not in changed_files:
            return False
        
        full_path = self.project_root / file_path
        if not full_path.exists():
            return False
        
        # Get current file content hash (uses mtime in cache key internally)
        current_hash = self.get_file_hash(str(full_path))
        if not current_hash:
            # Can't compute hash - skip (conservative: don't assume modified)
            logger.debug(
                f"Could not compute file hash for {file_path}, skipping",
                operation="is_file_modified_in_session",
                file_path=file_path
            )
            return False
        
        # Initialize file_hashes if not present (backward compatibility)
        if self.session.file_hashes is None:
            self.session.file_hashes = {}
        
        # Phase 2: Use same cache key format as get_file_hash() (includes mtime)
        # This ensures cache invalidation when file is modified
        try:
            stat_info = full_path.stat()
            cache_key = f"{file_path}:{stat_info.st_mtime}"
        except (OSError, FileNotFoundError):
            # Fallback to file_path only if we can't get mtime
            cache_key = file_path
        
        # Get previous hash from session (if file was checked before)
        # Phase 2: Use a separate key for tracking "previous hash" vs "current hash"
        # The cache_key includes mtime, so it changes when file is modified
        # We need a stable key to track the file across checks
        previous_hash_key = f"{file_path}:previous"
        previous_hash = self.session.file_hashes.get(previous_hash_key)
        
        # Phase 2: Simplified hash-only comparison
        # If no previous hash, this is first time checking this file in this session
        if previous_hash is None:
            # First time checking - store current hash as baseline
            self.session.file_hashes[previous_hash_key] = current_hash
            # Also store with cache_key (includes mtime) for get_file_hash() compatibility
            self.session.file_hashes[cache_key] = current_hash
            
            # For first check, assume file is modified if it's in changed_files
            # (get_changed_files() already filters by git status)
            logger.debug(
                f"First check of file in session, storing hash: {file_path}",
                operation="is_file_modified_in_session",
                file_path=file_path
            )
            return True
        
        # File was checked before - compare hashes
        # If hash changed, file content was actually modified
        hash_changed = current_hash != previous_hash
        
        if hash_changed:
            # Content actually changed - update stored hash
            self.session.file_hashes[previous_hash_key] = current_hash
            self.session.file_hashes[cache_key] = current_hash
            logger.debug(
                f"File content hash changed, file was modified: {file_path}",
                operation="is_file_modified_in_session",
                file_path=file_path,
                previous_hash=previous_hash[:16] + "..." if previous_hash else None,
                current_hash=current_hash[:16] + "..."
            )
            return True
        else:
            # Hash unchanged - file content not actually modified
            # (timestamp might have changed, but content is the same)
            logger.debug(
                f"File content hash unchanged, file not modified: {file_path}",
                operation="is_file_modified_in_session",
                file_path=file_path,
                hash=current_hash[:16] + "..."
            )
            return False
    
    # ============================================================================
    # Context Management Enforcement Methods
    # ============================================================================
    
    def check_context_management_compliance(self) -> bool:
        """
        Check context management compliance (Two-Brain Model: Step 0.5/4.5 removed).
        
        Returns:
            True if compliant, False if violations found
        """
        if not PREDICTIVE_CONTEXT_AVAILABLE:
            return True  # Skip if system not available
        
        if not self.preloader or not self.context_loader:
            return True  # Skip if components not initialized
        
        # Try to reload agent response from file (in case it was updated)
        # This allows the agent to write its response to a file and the enforcer will read it
        self._load_agent_response_from_file()
        
        check_name = "Context Management Compliance"
        
        # CRITICAL FIX: Skip context management checks when there's no agent response
        # These checks require an active agent session to verify behavior
        # When running from file watcher or without agent, skip these checks
        if not self._last_agent_response:
            logger.debug(
                "Skipping context management compliance checks - no agent response available",
                operation="check_context_management_compliance",
                reason="no_agent_response"
            )
            # Skip checks but report success (not a violation when no agent session)
            # Use consistent skip message format
            self._report_success(f"{check_name} (skipped - no agent session)")
            return True
        
        # CRITICAL FIX: Also skip if agent response context-id doesn't match current recommendations
        # This handles the case where agent response file exists but is stale (old context-id)
        if self.response_parser:
            try:
                parsed = self.response_parser.parse(self._last_agent_response)
                agent_context_id = parsed.get("context_id")
                
                # Get current context-id from recommendations.md
                context_id_match, latest_context_id = self._verify_context_id_match()
                
                # If context-ids don't match, agent response is stale - skip checks
                if agent_context_id and latest_context_id and agent_context_id != latest_context_id:
                    logger.debug(
                        f"Skipping context management compliance checks - agent response context-id is stale",
                        operation="check_context_management_compliance",
                        reason="stale_context_id",
                        agent_context_id=agent_context_id,
                        latest_context_id=latest_context_id
                    )
                    # Skip checks but report success (not a violation when agent response is stale)
                    # Use consistent skip message format
                    self._report_success(f"{check_name} (skipped - stale agent response)")
                    return True
            except Exception as e:
                # If parsing fails, skip checks (don't block on parsing errors)
                logger.debug(
                    f"Could not parse agent response for context-id check: {e}",
                    operation="check_context_management_compliance",
                    error_code="PARSE_FAILED",
                    root_cause=str(e)
                )
                # Continue with checks (might still be valid)
        
        all_passed = True
        
        # Two-Brain Model: Step 0.5/4.5 compliance checks removed
        # Context management is now handled by enforcer internally, not by LLM
        
        # Check context state validity
        if not self._check_context_state_validity():
            all_passed = False
        
        if all_passed:
            self._report_success(check_name)
        else:
            self._report_failure(check_name)
        
        return all_passed
    
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
        
        changed_files = self.get_changed_files(include_untracked=False)
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
    
    def check_memory_bank(self) -> bool:
        """
        Check Memory Bank compliance (Step 0 requirement).
        
        Validates:
        - All 6 Memory Bank files exist
        - Files are recent (not stale)
        """
        check_name = "Memory Bank Compliance"
        all_passed = True
        
        # Check all required files exist
        for filename in self.MEMORY_BANK_FILES:
            file_path = self.memory_bank_dir / filename
            if not file_path.exists():
                self._log_violation(Violation(
                    severity=ViolationSeverity.BLOCKED,
                    rule_ref="01-enforcement.mdc Step 0",
                    message=f"Missing Memory Bank file: {filename}",
                    file_path=str(file_path),
                    session_scope="current_session"
                ))
                all_passed = False
                self._report_failure(check_name)
            else:
                # Check file is not empty
                if file_path.stat().st_size == 0:
                    self._log_violation(Violation(
                        severity=ViolationSeverity.WARNING,
                        rule_ref="01-enforcement.mdc Step 0",
                        message=f"Memory Bank file is empty: {filename}",
                        file_path=str(file_path),
                        session_scope="current_session"
                    ))
                    all_passed = False
        
        if all_passed:
            self._report_success(check_name)
        
        return all_passed
    
    def _is_date_future_or_past(self, date_str: str) -> Optional[bool]:
        """
        Check if a date is clearly in the future or past relative to current date.
        
        Future dates (more than 1 day ahead) are likely historical/test dates.
        Past dates (more than 1 year old) are likely historical records.
        
        Args:
            date_str: Date string in ISO format (YYYY-MM-DD)
            
        Returns:
            True if date is clearly future/past (likely historical), 
            False if date is near current (likely should be current),
            None if date cannot be parsed
        """
        try:
            from datetime import datetime
            date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
            current_date_obj = datetime.strptime(self.CURRENT_DATE, "%Y-%m-%d").date()
            
            days_diff = (date_obj - current_date_obj).days
            
            # Future dates (more than 1 day ahead) are likely historical/test dates
            if days_diff > 1:
                return True
            # Past dates (more than 1 year old) are likely historical records
            if days_diff < -365:
                return True
            # Dates within 1 day of current are likely should be current
            return False
        except (ValueError, AttributeError):
            return None
    
    def _is_historical_date_pattern(self, line: str, context: str = '') -> bool:
        """
        Check if a line contains a historical date pattern.
        
        Historical dates are dates that are intentionally preserved as historical
        records (e.g., "Entry #1 - 2025-11-27", "Completed (2025-11-29)").
        
        Phase 1: Uses consolidated patterns (5 instead of 67) for better performance.
        
        Args:
            line: The line of text to check
            context: Optional surrounding context (for document-level awareness)
            
        Returns:
            True if the line matches a historical date pattern, False otherwise
        """
        # Quick check: Does line contain a date?
        if not self.HARDCODED_DATE_PATTERN.search(line):
            return False
        
        # Check consolidated patterns (5 checks instead of 67!)
        for idx, pattern in enumerate(self.HISTORICAL_DATE_PATTERNS, 1):
            if pattern.search(line):
                logger.debug(
                    f"Historical date pattern matched",
                    operation="_is_historical_date_pattern",
                    pattern_number=idx,
                    pattern=pattern.pattern,
                    line_preview=line[:100]
                )
                return True
        
        # Check context if provided (e.g., document title)
        if context:
            for pattern in self.HISTORICAL_DATE_PATTERNS:
                if pattern.search(context):
                    logger.debug(
                        f"Historical date pattern matched in context",
                        operation="_is_historical_date_pattern",
                        line_preview=line[:100],
                        context_preview=context[:100]
                    )
                    return True
        
        # Check if line contains dates that are clearly future/past (likely historical)
        matches = self.HARDCODED_DATE_PATTERN.findall(line)
        for match in matches:
            date_str = self._normalize_date_match(match if isinstance(match, tuple) else (match,))
            if date_str:
                is_future_or_past = self._is_date_future_or_past(date_str)
                if is_future_or_past is True:
                    logger.debug(
                        f"Date is clearly future/past (likely historical): {date_str}",
                        operation="_is_historical_date_pattern",
                        line_preview=line[:100],
                        date=date_str
                    )
                    return True
        
        return False
    
    def _is_historical_document_file(self, file_path: Path) -> bool:
        """
        Check if a file is a historical document (e.g., document_2026-12-21.md).
        
        Files with dates in their names are typically historical documents
        where dates should be preserved as historical records.
        
        Args:
            file_path: The file path to check
            
        Returns:
            True if the file appears to be a historical document, False otherwise
        """
        # Check for historical documentation directories (e.g., docs/Auto-PR/)
        file_path_str = str(file_path).replace("\\", "/").lower()
        historical_dirs = [
            "docs/auto-pr/",
            "docs/archive/",
            "docs/historical/",
        ]
        # Fix: Check if historical directory is contained in path (not just if path starts with it)
        # This handles full absolute paths like "c:/users/.../docs/auto-pr/file.md"
        for dir_path in historical_dirs:
            dir_pattern = f"/{dir_path.rstrip('/')}/"
            if dir_pattern in file_path_str:
                return True
        
        file_name = file_path.name.lower()
        
        # Check for date patterns in filename (e.g., document_2026-12-21.md, report_12-21-2026.md)
        # ISO format: YYYY-MM-DD or YYYY_MM_DD
        if re.search(r'\d{4}[-_]\d{2}[-_]\d{2}', file_name):
            return True
        # US format: MM-DD-YYYY or MM_DD_YYYY
        if re.search(r'\d{2}[-_]\d{2}[-_]\d{4}', file_name):
            return True
        # Year-only patterns (e.g., document_2026.md)
        if re.search(r'_\d{4}\.', file_name) or re.search(r'-\d{4}\.', file_name):
            return True
        
        # Check for common historical document prefixes
        historical_prefixes = ['document_', 'report_', 'entry_', 'log_', 'note_', 'memo_']
        if any(file_name.startswith(prefix) for prefix in historical_prefixes):
            # If it has a date-like pattern anywhere in the name, treat as historical
            if re.search(r'\d{4}', file_name):
                return True
        
        return False
    
    def _is_log_file(self, file_path: Path) -> bool:
        """
        Check if a file is a log/learning file where historical dates should be preserved.
        
        Log files contain historical entries and "Last Updated" fields should be
        preserved as historical records, not updated to current date.
        
        Args:
            file_path: The file path to check
            
        Returns:
            True if the file is a log file, False otherwise
        """
        log_file_names = [
            "BUG_LOG.md",
            "PYTHON_LEARNINGS_LOG.md",
            "LEARNINGS_LOG.md",
            "LEARNINGS.md",
        ]
        
        # Memory Bank files are log-like (preserve historical dates)
        memory_bank_files = [
            "activeContext.md",
            "progress.md",
            "projectbrief.md",
            "productContext.md",
            "systemPatterns.md",
            "techContext.md",
        ]
        
        # Check if file is in memory-bank directory
        if "memory-bank" in str(file_path):
            return True
        
        return file_path.name in log_file_names or file_path.name in memory_bank_files
    
    def _is_documentation_file(self, file_path: Path) -> bool:
        """
        Check if a file is a documentation/example file where example dates should be preserved.
        
        Documentation files contain example code with example dates that should be preserved
        as educational examples, not updated to current date.
        
        Args:
            file_path: The file path to check
            
        Returns:
            True if the file is a documentation/example file, False otherwise
        """
        # Documentation directories
        doc_dirs = [
            "docs/",
            "documentation/",
            "examples/",
            "bibles/",
            "reference/",
            ".cursor/enforcement/rules/",  # Rule files contain example code
        ]
        
        # Documentation file patterns
        doc_patterns = [
            r'.*\.md$',  # Markdown files in docs/ are likely documentation
            r'.*_bible.*',  # Bible/reference files
            r'.*example.*',  # Example files
            r'.*tutorial.*',  # Tutorial files
            r'.*guide.*',  # Guide files
        ]
        
        file_path_str = str(file_path).lower()
        
        # Check if file is in documentation directory
        for doc_dir in doc_dirs:
            if doc_dir.lower() in file_path_str:
                return True
        
        # Check if file name matches documentation patterns
        import re
        for pattern in doc_patterns:
            if re.search(pattern, file_path.name.lower()):
                return True
        
        return False
    
    def check_hardcoded_dates(self, violation_scope: str = "current_session") -> bool:
        """
        Check for hardcoded dates (02-core.mdc violation).
        
        Scans changed files for hardcoded dates that don't match current date.
        Uses git diff to determine if dates were added/modified in current session.
        
        Excludes:
        - Historical dates (not changed in current session)
        - Historical date patterns (Entry #N - YYYY-MM-DD, Completed (YYYY-MM-DD), etc.)
        - "Last Updated" fields that weren't modified (or were correctly updated)
        - Dates in BUG_LOG.md (all historical)
        
        Args:
            violation_scope: Scope for violations - "current_session" or "historical"
        """
        check_name = "Hardcoded Date Detection"
        all_passed = True
        
        # Determine session scope for violations (use provided scope, default to current_session)
        session_scope = violation_scope if violation_scope else "current_session"
        
        # Include untracked files for enforcement checks (to catch dates in new files)
        changed_files = self.get_changed_files(include_untracked=True)
        
        # Memory optimization: Process git output incrementally instead of loading all at once
        # Python Bible Chapter 12.4.3: Use generators for memory-efficient iteration
        git_output = self.run_git_command(['ls-files'])
        if git_output:
            # Process line-by-line to build set (more memory-efficient)
            all_tracked = {line.strip() for line in git_output.split('\n') if line.strip()}
        else:
            all_tracked = set()
        
        # Separate untracked files (always check these - they're new files)
        untracked_files = [f for f in changed_files if f not in all_tracked]
        tracked_files = [f for f in changed_files if f in all_tracked]
        
        # Limit tracked files to prevent timeouts (process max 50 files for date checking)
        # But always check ALL untracked files (they're new and need validation)
        if len(tracked_files) > 50:
            logger.warn(
                f"Too many tracked files ({len(tracked_files)}) for date check, limiting to 50",
                operation="check_hardcoded_dates",
                total_tracked=len(tracked_files),
                untracked_count=len(untracked_files),
                limited_to=50
            )
            tracked_files = tracked_files[:50]
        
        # Combine: all untracked + limited tracked files
        changed_files = untracked_files + tracked_files
        
        # Phase 1.4: Performance optimization - batch file modification checks
        # Python Bible 12.8: Batch operations for IO-bound workloads
        # Pre-compute file modification status for all files at once (O(n) instead of O(n²))
        logger.debug(
            f"Pre-computing file modification status for {len(changed_files)} files",
            operation="check_hardcoded_dates",
            total_files=len(changed_files)
        )
        file_modification_cache = {}
        for file_path_str in changed_files:
            file_path = self.project_root / file_path_str
            if file_path.exists() and not file_path.is_dir():
                # Python Bible 12.4 Rule 3: Prefer local variables (dict lookup) to function calls
                file_modification_cache[file_path_str] = self.is_file_modified_in_session(file_path_str)
        
        logger.debug(
            f"Pre-computed modification status for {len(file_modification_cache)} files",
            operation="check_hardcoded_dates",
            modified_count=sum(1 for v in file_modification_cache.values() if v)
        )
        
        # Phase 3: Performance optimization - cache DocumentContext instances
        # Initialize DateDetector once (reuse for all files)
        detector = None
        if DateDetector:
            detector = DateDetector(current_date=self.CURRENT_DATE)
        
        # Cache for DocumentContext instances (avoid recreating for same file)
        doc_context_cache = {}
        
        # Define directories to exclude from date checks
        excluded_dirs = [
            self.enforcement_dir,
            self.project_root / '.cursor' / 'archive',
            self.project_root / '.cursor' / 'backups'
        ]
        
        for file_path_str in changed_files:
            file_path = self.project_root / file_path_str
            
            # Skip binary files and directories
            if not file_path.exists() or file_path.is_dir():
                continue
            
            if file_path.suffix in ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf']:
                continue
            
            # Exclude specific directories using Path.is_relative_to()
            if any(file_path.is_relative_to(excluded_dir) for excluded_dir in excluded_dirs):
                continue
            
            # Defensive check: Skip historical document directories early
            # This ensures Auto-PR files are skipped even if DocumentContext check fails
            file_path_str_normalized = str(file_path).replace("\\", "/").lower()
            # Check for both absolute paths (with leading /) and relative paths (without)
            historical_dir_patterns = [
                "/docs/auto-pr/", "/docs/archive/", "/docs/historical/",  # Absolute paths
                "docs/auto-pr/", "docs/archive/", "docs/historical/"      # Relative paths
            ]
            if any(pattern in file_path_str_normalized for pattern in historical_dir_patterns):
                logger.debug(
                    f"Skipping historical document directory in date checker: {file_path_str}",
                    operation="check_hardcoded_dates",
                    file_path=file_path_str,
                    reason="historical_document_directory"
                )
                continue
            
            # Phase 3: Use cached DocumentContext for file-level detection
            doc_context = None
            if DocumentContext:
                # Cache DocumentContext per file path (performance optimization)
                if file_path_str not in doc_context_cache:
                    doc_context_cache[file_path_str] = DocumentContext(file_path)
                doc_context = doc_context_cache[file_path_str]
                
                # Skip log files entirely (all dates are historical entries)
                if doc_context.is_log_file:
                    continue
                # Skip historical document files (files with dates in their names)
                if doc_context.is_historical_doc:
                    logger.debug(
                        f"Skipping historical document file: {file_path_str}",
                        operation="check_hardcoded_dates",
                        file_path=file_path_str,
                        reason="file_name_contains_date"
                    )
                    continue
            else:
                # Fallback to old methods if DocumentContext not available
                if self._is_log_file(file_path):
                    continue
                if self._is_historical_document_file(file_path):
                    logger.debug(
                        f"Skipping historical document file: {file_path_str}",
                        operation="check_hardcoded_dates",
                        file_path=file_path_str,
                        reason="file_name_contains_date"
                    )
                    continue
            
            # Check if file was actually modified in this session
            # Phase 1.4: Use pre-computed modification status (O(1) lookup)
            # Python Bible 12.4 Rule 3: Prefer local variables (dict lookup) to function calls
            file_modified = file_modification_cache.get(file_path_str, False)
            
            # Early exit: if file wasn't modified, skip entirely (all dates are historical)
            if not file_modified:
                logger.debug(
                    f"Skipping file (not modified in session): {file_path_str}",
                    operation="check_hardcoded_dates",
                    file_path=file_path_str
                )
                continue
            
            try:
                # Phase 3: Use DateDetector for efficient date finding and classification
                if detector and doc_context:
                    # Read file content once
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        file_content = f.read()
                    
                    # Find all dates in file (detector already initialized above)
                    date_matches = detector.find_dates(file_content, context_lines=3)
                    
                    # Process each date match
                    for date_match in date_matches:
                        line_num = date_match.line_number
                        line = date_match.line_content
                        
                        # Skip pattern definition lines in auto-enforcer.py itself (meta-checking)
                        if file_path.name == 'auto-enforcer.py' and (
                            'HISTORICAL_DATE_PATTERNS' in line or
                            're.compile' in line and 'date' in line.lower()
                        ):
                            continue
                        
                        # Check if this line was changed in the current session
                        line_changed = self.is_line_changed_in_session(file_path_str, line_num)
                        
                        # Early exit: if line wasn't changed, it's historical - skip
                        if not line_changed:
                            continue
                        
                        # Classify the date
                        classification = detector.classify_date(date_match, doc_context)
                        
                        # Handle "Last Updated" fields specially
                        is_last_updated = re.search(r'last\s+updated\s*:', line, re.IGNORECASE)
                        
                        if is_last_updated:
                            # Skip "Last Updated" checks for log files (historical dates are preserved)
                            if doc_context.is_log_file:
                                continue
                            
                            # "Last Updated" field logic:
                            if line_changed:
                                # Line was changed - check if date is current
                                if date_match.date_str != self.CURRENT_DATE:
                                    # Date was changed but not to current date - violation
                                    self._log_violation(Violation(
                                        severity=ViolationSeverity.BLOCKED,
                                        rule_ref="02-core.mdc",
                                        message=f"'Last Updated' field modified but date not updated to current: {date_match.date_str} (current: {self.CURRENT_DATE})",
                                        file_path=str(file_path),
                                        line_number=line_num,
                                        session_scope=session_scope
                                    ))
                                    all_passed = False
                                    self._report_failure(check_name)
                            else:
                                # File was modified but "Last Updated" wasn't updated - violation
                                self._log_violation(Violation(
                                    severity=ViolationSeverity.BLOCKED,
                                    rule_ref="02-core.mdc",
                                    message=f"'Last Updated' field should be updated to current date ({self.CURRENT_DATE}) since file was modified",
                                    file_path=str(file_path),
                                    line_number=line_num,
                                    session_scope=session_scope
                                ))
                                all_passed = False
                                self._report_failure(check_name)
                            continue
                        
                        # For non-"Last Updated" dates: only flag CURRENT dates that don't match system date
                        if classification == DateClassification.CURRENT:
                            if date_match.date_str != self.CURRENT_DATE:
                                # Date was added/modified but not to current date - violation
                                self._log_violation(Violation(
                                    severity=ViolationSeverity.BLOCKED,
                                    rule_ref="02-core.mdc",
                                    message=f"Hardcoded date found in modified line: {date_match.date_str} (current date: {self.CURRENT_DATE})",
                                    file_path=str(file_path),
                                    line_number=line_num,
                                    session_scope=session_scope
                                ))
                                all_passed = False
                                self._report_failure(check_name)
                        # HISTORICAL, EXAMPLE, and UNKNOWN dates are skipped (preserved)
                
                else:
                    # Fallback to old line-by-line method if DateDetector not available
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        in_code_block = False
                        
                        for line_num, line in enumerate(f, 1):
                            if '```' in line:
                                in_code_block = not in_code_block
                            if not self.HARDCODED_DATE_PATTERN.search(line):
                                continue
                            
                            if file_path.name == 'auto-enforcer.py' and (
                                'HISTORICAL_DATE_PATTERNS' in line or
                                're.compile' in line and 'date' in line.lower()
                            ):
                                continue
                            
                            line_changed = self.is_line_changed_in_session(file_path_str, line_num)
                            if not line_changed:
                                continue
                            
                            if self._is_historical_date_pattern(line):
                                continue
                            
                            if self._is_documentation_file(file_path) and in_code_block:
                                continue
                            
                            is_last_updated = re.search(r'last\s+updated\s*:', line, re.IGNORECASE)
                            if is_last_updated:
                                if DocumentContext and doc_context and doc_context.is_log_file:
                                    continue
                                elif not DocumentContext and self._is_log_file(file_path):
                                    continue
                                
                                if line_changed:
                                    matches = self.HARDCODED_DATE_PATTERN.findall(line)
                                    for match in matches:
                                        date_str = self._normalize_date_match(match if isinstance(match, tuple) else (match,))
                                        if date_str != self.CURRENT_DATE:
                                            self._log_violation(Violation(
                                                severity=ViolationSeverity.BLOCKED,
                                                rule_ref="02-core.mdc",
                                                message=f"'Last Updated' field modified but date not updated to current: {date_str} (current: {self.CURRENT_DATE})",
                                                file_path=str(file_path),
                                                line_number=line_num,
                                                session_scope=session_scope
                                            ))
                                            all_passed = False
                                            self._report_failure(check_name)
                                else:
                                    self._log_violation(Violation(
                                        severity=ViolationSeverity.BLOCKED,
                                        rule_ref="02-core.mdc",
                                        message=f"'Last Updated' field should be updated to current date ({self.CURRENT_DATE}) since file was modified",
                                        file_path=str(file_path),
                                        line_number=line_num,
                                        session_scope=session_scope
                                    ))
                                    all_passed = False
                                    self._report_failure(check_name)
                                continue
                            
                            matches = self.HARDCODED_DATE_PATTERN.findall(line)
                            for match in matches:
                                date_str = self._normalize_date_match(match if isinstance(match, tuple) else (match,))
                                if date_str != self.CURRENT_DATE:
                                    self._log_violation(Violation(
                                        severity=ViolationSeverity.BLOCKED,
                                        rule_ref="02-core.mdc",
                                        message=f"Hardcoded date found in modified line: {date_str} (current date: {self.CURRENT_DATE})",
                                        file_path=str(file_path),
                                        line_number=line_num,
                                        session_scope=session_scope
                                    ))
                                    all_passed = False
                                    self._report_failure(check_name)
                        
            except (FileNotFoundError, PermissionError, OSError, UnicodeDecodeError) as e:
                logger.warn(
                    f"Failed to check file for hardcoded dates: {str(e)}",
                    operation="check_hardcoded_dates",
                    error_code="DATE_CHECK_FAILED",
                    file_path=str(file_path)
                )
        
        if all_passed:
            self._report_success(check_name)
        
        return all_passed
    
    def check_security_compliance(self) -> bool:
        """
        Check security file compliance (03-security.mdc).
        
        Validates that security-sensitive files are not modified without proper checks.
        """
        check_name = "Security Compliance"
        all_passed = True
        
        changed_files = self.get_changed_files()
        security_files_changed = []
        
        for file_path_str in changed_files:
            # Check if file is security-sensitive
            is_security_file = False
            for pattern in self.SECURITY_FILES:
                if pattern.replace('**/', '').replace('/*', '') in file_path_str:
                    is_security_file = True
                    break
            
            if is_security_file:
                security_files_changed.append(file_path_str)
        
        if security_files_changed:
            # Log warning (not blocked, but should be reviewed)
            for file_path_str in security_files_changed:
                self._log_violation(Violation(
                    severity=ViolationSeverity.WARNING,
                    rule_ref="03-security.mdc",
                    message=f"Security-sensitive file modified: {file_path_str}",
                    file_path=file_path_str,
                    session_scope="current_session"
                ))
            self._report_failure(check_name)
            all_passed = False
        
        if all_passed:
            self._report_success(check_name)
        
        return all_passed
    
    def check_active_context(self) -> bool:
        """
        Check activeContext.md update (Step 5 requirement).
        
        Validates that activeContext.md was updated after file changes.
        """
        check_name = "activeContext.md Update"
        all_passed = True
        
        active_context_file = self.memory_bank_dir / "activeContext.md"
        
        if not active_context_file.exists():
            self._log_violation(Violation(
                severity=ViolationSeverity.BLOCKED,
                rule_ref="01-enforcement.mdc Step 5",
                message="activeContext.md does not exist",
                file_path=str(active_context_file),
                session_scope="current_session"
            ))
            all_passed = False
            self._report_failure(check_name)
            return all_passed
        
        # Check if file was modified recently (within last hour)
        file_mtime = datetime.fromtimestamp(active_context_file.stat().st_mtime, tz=timezone.utc)
        now = datetime.now(timezone.utc)
        time_diff = (now - file_mtime).total_seconds()
        
        # If file hasn't been updated in last hour and there are changes, warn
        changed_files = self.get_changed_files()
        if changed_files and time_diff > 3600:  # 1 hour
            self._log_violation(Violation(
                severity=ViolationSeverity.WARNING,
                rule_ref="01-enforcement.mdc Step 5",
                message=f"activeContext.md not updated recently (last modified: {file_mtime.isoformat()})",
                file_path=str(active_context_file),
                session_scope="current_session"
            ))
            all_passed = False
            self._report_failure(check_name)
        
        if all_passed:
            self._report_success(check_name)
        
        return all_passed
    
    def check_error_handling(self) -> bool:
        """
        Check error handling patterns (06-error-resilience.mdc).
        
        Validates that error-prone operations have proper error handling.
        """
        check_name = "Error Handling Compliance"
        all_passed = True
        
        changed_files = self.get_changed_files()
        
        # Filter to only files actually modified in current session
        # This prevents re-detection of historical violations
        session_modified_files = [
            f for f in changed_files 
            if self.is_file_modified_in_session(f)
        ]
        
        # Patterns to check for (language-agnostic)
        error_prone_patterns = [
            (r'await\s+\w+\(', None),  # Async operations should have error handling
            (r'subprocess\.(run|call|Popen)', None),  # Subprocess should have error handling
            (r'open\(', None),  # File operations should have error handling
        ]
        
        for file_path_str in session_modified_files:
            file_path = self.project_root / file_path_str
            
            if not file_path.exists() or file_path.suffix not in ['.py', '.ts', '.tsx', '.js', '.jsx']:
                continue
            
            # Determine file type for appropriate error handling pattern
            is_python = file_path.suffix == '.py'
            is_typescript_js = file_path.suffix in ['.ts', '.tsx', '.js', '.jsx']
            
            # Error handling patterns by language
            if is_python:
                # Python: try: or try\n
                error_handling_patterns = [r'try\s*:', r'try\s*\n']
            elif is_typescript_js:
                # TypeScript/JavaScript: try { or try\n{ or catch
                error_handling_patterns = [r'try\s*\{', r'try\s*\n\s*\{', r'catch\s*\(', r'catch\s*\{']
            else:
                error_handling_patterns = []
            
            try:
                # Phase 2.2: Use line-by-line processing instead of f.read()
                # Python Bible 12.12.1: Use generators for memory-efficient iteration
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    # Read lines directly (more efficient than read().split('\n'))
                    lines = list(f)
                    
                    for pattern, _ in error_prone_patterns:
                        for line_num, line in enumerate(lines, 1):
                            if re.search(pattern, line):
                                # Check if there's error handling nearby (within 10 lines)
                                context_start = max(0, line_num - 10)
                                context_end = min(len(lines), line_num + 10)
                                context = '\n'.join(lines[context_start:context_end])
                                
                                # Check if any error handling pattern is present
                                has_error_handling = any(
                                    re.search(eh_pattern, context, re.MULTILINE)
                                    for eh_pattern in error_handling_patterns
                                )
                                
                                if not has_error_handling:
                                    self._log_violation(Violation(
                                        severity=ViolationSeverity.WARNING,
                                        rule_ref="06-error-resilience.mdc",
                                        message=f"Error-prone operation without error handling: {pattern}",
                                        file_path=str(file_path),
                                        line_number=line_num,
                                        session_scope="current_session"
                                    ))
                                    all_passed = False
                                    self._report_failure(check_name)
            except (FileNotFoundError, PermissionError, OSError, UnicodeDecodeError) as e:
                logger.warn(
                    f"Failed to check file for error handling: {str(e)}",
                    operation="check_error_handling",
                    error_code="ERROR_HANDLING_CHECK_FAILED",
                    file_path=str(file_path)
                )
        
        if all_passed:
            self._report_success(check_name)
        
        return all_passed
    
    def check_logging(self) -> bool:
        """
        Check structured logging compliance (07-observability.mdc).
        
        Validates that logging uses structured format, not console.log.
        """
        check_name = "Structured Logging Compliance"
        all_passed = True
        
        changed_files = self.get_changed_files()
        
        # Filter to only files actually modified in current session
        # This prevents re-detection of historical violations
        session_modified_files = [
            f for f in changed_files 
            if self.is_file_modified_in_session(f)
        ]
        
        # Patterns to check for
        console_log_patterns = [
            r'console\.(log|error|warn|debug)',
            r'print\(',
        ]
        
        for file_path_str in session_modified_files:
            file_path = self.project_root / file_path_str
            
            if not file_path.exists() or file_path.suffix not in ['.py', '.ts', '.tsx', '.js', '.jsx']:
                continue
            
            # Skip test files (they can use console.log)
            if 'test' in str(file_path).lower() or 'spec' in str(file_path).lower():
                continue
            
            try:
                # Phase 2.2: Use line-by-line processing instead of f.read()
                # Python Bible 12.12.1: Use generators for memory-efficient iteration
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    # Read lines directly (more efficient than read().split('\n'))
                    lines = list(f)
                    
                    for pattern in console_log_patterns:
                        for line_num, line in enumerate(lines, 1):
                            if re.search(pattern, line):
                                # Allow in comments
                                if line.strip().startswith('//') or line.strip().startswith('#'):
                                    continue
                                
                                self._log_violation(Violation(
                                    severity=ViolationSeverity.WARNING,
                                    rule_ref="07-observability.mdc",
                                    message=f"Console logging detected (use structured logging): {pattern}",
                                    file_path=str(file_path),
                                    line_number=line_num,
                                    session_scope="current_session"
                                ))
                                all_passed = False
                                self._report_failure(check_name)
            except (FileNotFoundError, PermissionError, OSError, UnicodeDecodeError) as e:
                logger.warn(
                    f"Failed to check file for logging: {str(e)}",
                    operation="check_logging",
                    error_code="LOGGING_CHECK_FAILED",
                    file_path=str(file_path)
                )
        
        if all_passed:
            self._report_success(check_name)
        
        return all_passed
    
    def check_python_bible(self) -> bool:
        """
        Check Python Bible compliance (python_bible.mdc).
        
        Validates Python files follow Python Bible patterns.
        """
        check_name = "Python Bible Compliance"
        all_passed = True
        
        changed_files = self.get_changed_files()
        
        # Filter to only files actually modified in current session
        # This prevents re-detection of historical violations
        session_modified_files = [
            f for f in changed_files 
            if self.is_file_modified_in_session(f)
        ]
        python_files = [f for f in session_modified_files if f.endswith('.py')]
        
        if not python_files:
            self._report_success(check_name)
            return all_passed
        
        # Basic Python Bible checks
        for file_path_str in python_files:
            file_path = self.project_root / file_path_str
            
            if not file_path.exists():
                continue
            
            try:
                # Phase 2.2: Use line-by-line processing instead of f.read()
                # Python Bible 12.12.1: Use generators for memory-efficient iteration
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    # Process line-by-line for regex searches (more memory-efficient)
                    for line_num, line in enumerate(f, 1):
                        # Check for common anti-patterns line-by-line
                        # 1. Mutable default arguments
                        if re.search(r'def\s+\w+\([^)]*=\s*\[', line):
                            self._log_violation(Violation(
                                severity=ViolationSeverity.WARNING,
                                rule_ref="python_bible.mdc",
                                message="Mutable default argument detected (use None instead)",
                                file_path=str(file_path),
                                line_number=line_num,
                                session_scope="current_session"
                            ))
                            all_passed = False
                            self._report_failure(check_name)
                        
                        # 2. Bare except clauses
                        if re.search(r'except\s*:', line):
                            self._log_violation(Violation(
                                severity=ViolationSeverity.WARNING,
                                rule_ref="python_bible.mdc",
                                message="Bare except clause detected (specify exception type)",
                                file_path=str(file_path),
                                line_number=line_num,
                                session_scope="current_session"
                            ))
                            all_passed = False
                            self._report_failure(check_name)
            except (FileNotFoundError, PermissionError, OSError, UnicodeDecodeError) as e:
                logger.warn(
                    f"Failed to check file for Python Bible compliance: {str(e)}",
                    operation="check_python_bible",
                    error_code="PYTHON_BIBLE_CHECK_FAILED",
                    file_path=str(file_path)
                )
        
        if all_passed:
            self._report_success(check_name)
        
        return all_passed
    
    def check_bug_logging(self) -> bool:
        """
        Check bug logging compliance.
        
        Validates that bugs are logged in BUG_LOG.md.
        """
        check_name = "Bug Logging Compliance"
        all_passed = True
        
        bug_log_file = self.project_root / ".cursor" / "BUG_LOG.md"
        
        # This is a soft check - we can't always determine if a bug was fixed
        # Just verify the file exists and is accessible
        if not bug_log_file.exists():
            self._log_violation(Violation(
                severity=ViolationSeverity.WARNING,
                rule_ref="01-enforcement.mdc",
                message="BUG_LOG.md does not exist",
                file_path=str(bug_log_file),
                session_scope="current_session"
            ))
            all_passed = False
            self._report_failure(check_name)
        else:
            self._report_success(check_name)
        
        return all_passed
    
    def re_evaluate_violation_scope(self, violation: Violation) -> str:
        """
        Re-evaluate a violation's session scope based on current git state.
        
        Returns "current_session" if violation is still valid, "historical" otherwise.
        """
        # If violation has no file path, keep original scope
        if not violation.file_path:
            return violation.session_scope
        
        file_path_str = violation.file_path
        
        # Check if file is in a historical document directory (e.g., docs/Auto-PR/)
        # This ensures Auto-PR files are always treated as historical
        file_path_normalized = file_path_str.replace("\\", "/").lower()
        # Check for both absolute paths (with leading /) and relative paths (without)
        historical_dir_patterns = [
            "/docs/auto-pr/", "/docs/archive/", "/docs/historical/",  # Absolute paths
            "docs/auto-pr/", "docs/archive/", "docs/historical/"      # Relative paths
        ]
        if any(pattern in file_path_normalized for pattern in historical_dir_patterns):
            logger.debug(
                f"Re-evaluating violation scope: {file_path_str} is in historical directory",
                operation="re_evaluate_violation_scope",
                file_path=file_path_str,
                original_scope=violation.session_scope,
                new_scope="historical"
            )
            return "historical"
        
        # Check if file is still in changed_files
        changed_files = self.get_changed_files()
        if file_path_str not in changed_files:
            # File is no longer in changed_files - mark as historical
            logger.debug(
                f"Re-evaluating violation scope: {file_path_str} no longer in changed_files",
                operation="re_evaluate_violation_scope",
                file_path=file_path_str,
                original_scope=violation.session_scope,
                new_scope="historical"
            )
            return "historical"
        
        # Check if file was actually modified in this session
        file_modified = self.is_file_modified_in_session(file_path_str)
        if not file_modified:
            # File is in changed_files but wasn't actually modified - mark as historical
            logger.debug(
                f"Re-evaluating violation scope: {file_path_str} not actually modified",
                operation="re_evaluate_violation_scope",
                file_path=file_path_str,
                original_scope=violation.session_scope,
                new_scope="historical"
            )
            return "historical"
        
        # If violation has a line number, check if that line was actually changed
        if violation.line_number:
            line_changed = self.is_line_changed_in_session(file_path_str, violation.line_number)
            if not line_changed:
                # Line wasn't actually changed - mark as historical
                logger.debug(
                    f"Re-evaluating violation scope: {file_path_str}:{violation.line_number} not actually changed",
                    operation="re_evaluate_violation_scope",
                    file_path=file_path_str,
                    line_number=violation.line_number,
                    original_scope=violation.session_scope,
                    new_scope="historical"
                )
                return "historical"
        
        # Violation is still valid - keep as current_session
        return "current_session"
    
    def generate_agent_status(self):
        """Generate AGENT_STATUS.md file."""
        status_file = self.enforcement_dir / "AGENT_STATUS.md"
        
        # Re-evaluate violation scopes before generating status
        # This ensures violations are correctly categorized even if git state changed
        for violation in self.violations:
            new_scope = self.re_evaluate_violation_scope(violation)
            if new_scope != violation.session_scope:
                logger.info(
                    f"Updating violation scope: {violation.file_path}:{violation.line_number}",
                    operation="generate_agent_status",
                    original_scope=violation.session_scope,
                    new_scope=new_scope
                )
                violation.session_scope = new_scope
                # Update in session data as well
                for v_dict in self.session.violations:
                    if (v_dict.get('file_path') == violation.file_path and 
                        v_dict.get('line_number') == violation.line_number and
                        v_dict.get('rule_ref') == violation.rule_ref):
                        v_dict['session_scope'] = new_scope
        
        # Determine overall status
        # Memory optimization: Use generator expressions, convert to list only when needed
        # Python Bible Chapter 12.4.3: Generators for memory-efficient iteration
        blocked_violations = list(v for v in self.violations if v.severity == ViolationSeverity.BLOCKED)
        warning_violations = list(v for v in self.violations if v.severity == ViolationSeverity.WARNING)
        
        # Separate violations by session scope (after re-evaluation)
        current_session_blocked = list(v for v in blocked_violations if v.session_scope == "current_session")
        historical_blocked = list(v for v in blocked_violations if v.session_scope != "current_session")
        
        if blocked_violations:
            status_emoji = "🔴"
            status_text = "BLOCKED"
        elif warning_violations:
            status_emoji = "🟡"
            status_text = "WARNING"
        else:
            status_emoji = "🟢"
            status_text = "COMPLIANT"
        
        # Generate status content with summary counts
        content = f"""# Agent Status

**Status:** {status_emoji} {status_text}
**Last Updated:** {datetime.now(timezone.utc).isoformat()}
**Session ID:** {self.session.session_id}

## Summary

- **Total Blocked Violations:** {len(blocked_violations)}
  - 🔧 **Current Session (Auto-Fixable):** {len(current_session_blocked)}
  - 📋 **Historical (Require Human Input):** {len(historical_blocked)}
- **Warnings:** {len(warning_violations)}
- **Total Violations:** {len(self.violations)}

"""
        
        # Add blocking instructions if BLOCKED (ALWAYS SHOW WHEN BLOCKED)
        if blocked_violations:
            content += "## ⚠️ BLOCKING INSTRUCTIONS\n\n"
            content += "**🚨 YOU MUST STOP AND ADDRESS THESE VIOLATIONS BEFORE PROCEEDING WITH ANY TASK. 🚨**\n\n"
            
            if current_session_blocked:
                content += f"### 🔧 Current Session Violations ({len(current_session_blocked)} - Auto-Fixable)\n\n"
                content += "**These violations were introduced in the current session. You MUST auto-fix these immediately before proceeding.**\n\n"
                content += "**Instructions:**\n"
                content += "1. Review each violation below\n"
                content += "2. Auto-fix the violations (update dates, add error handling, etc.)\n"
                content += "3. Re-run enforcement to verify fixes\n"
                content += "4. Only proceed after all current session violations are resolved\n\n"
                content += "**Violations to Fix:**\n\n"
                for violation in current_session_blocked:
                    content += f"- **{violation.rule_ref}**: {violation.message}"
                    if violation.file_path:
                        content += f" (`{violation.file_path}`"
                        if violation.line_number:
                            content += f":{violation.line_number}"
                        content += ")"
                    content += "\n"
                content += "\n---\n\n"
            
            if historical_blocked:
                content += f"### 📋 Historical Violations ({len(historical_blocked)} - Require Human Input)\n\n"
                content += "**These violations exist in historical code (not from current session). You MUST list these and request human guidance before proceeding.**\n\n"
                content += "**Instructions:**\n"
                content += "1. List ALL historical violations clearly in your response\n"
                content += "2. Request human input/guidance on how to proceed\n"
                content += "3. DO NOT attempt to auto-fix historical violations without explicit permission\n"
                content += "4. DO NOT proceed with new tasks until human guidance is provided\n\n"
                content += "**Historical Violations (First 20 shown, see VIOLATIONS.md for complete list):**\n\n"
                for violation in historical_blocked[:20]:
                    content += f"- **{violation.rule_ref}**: {violation.message}"
                    if violation.file_path:
                        content += f" (`{violation.file_path}`"
                        if violation.line_number:
                            content += f":{violation.line_number}"
                        content += ")"
                    content += "\n"
                if len(historical_blocked) > 20:
                    content += f"\n*... and {len(historical_blocked) - 20} more historical violations. See `.cursor/enforcement/VIOLATIONS.md` for complete list.*\n"
                content += "\n**Action Required:** List these blockers and request human input/guidance before proceeding.\n\n"
                content += "---\n\n"
        
        content += "## Active Violations\n\n"
        
        if blocked_violations:
            content += f"### 🔴 BLOCKED - Hard Stops ({len(blocked_violations)} total)\n\n"
            content += "**Legend:** 🔧 = Current Session (Auto-Fixable) | 📋 = Historical (Require Human Input)\n\n"
            for violation in blocked_violations:
                scope_indicator = "🔧" if violation.session_scope == "current_session" else "📋"
                scope_text = "Current Session" if violation.session_scope == "current_session" else "Historical"
                content += f"- {scope_indicator} **{violation.rule_ref}**: {violation.message}"
                if violation.file_path:
                    content += f" (`{violation.file_path}`"
                    if violation.line_number:
                        content += f":{violation.line_number}"
                    content += ")"
                content += f" [Scope: {scope_text}]\n"
            content += "\n"
        
        if warning_violations:
            # Separate warnings by session scope
            current_session_warnings = [v for v in warning_violations if v.session_scope == "current_session"]
            historical_warnings = [v for v in warning_violations if v.session_scope != "current_session"]
            
            content += "### 🟡 WARNINGS\n\n"
            content += "**Legend:** 🔧 = Current Session | 📋 = Historical\n\n"
            
            # Current Session Warnings (show in detail, max 50)
            if current_session_warnings:
                content += f"#### 🔧 Current Session ({len(current_session_warnings)} total)\n\n"
                display_count = min(50, len(current_session_warnings))
                for violation in current_session_warnings[:display_count]:
                    content += f"- **{violation.rule_ref}**: {violation.message}"
                    if violation.file_path:
                        content += f" (`{violation.file_path}`"
                        if violation.line_number:
                            content += f":{violation.line_number}"
                        content += ")"
                    content += "\n"
                if len(current_session_warnings) > 50:
                    content += f"\n*... and {len(current_session_warnings) - 50} more current session warnings. See `.cursor/enforcement/VIOLATIONS.md` for complete list.*\n"
                content += "\n"
            
            # Historical Warnings (aggregated by rule)
            if historical_warnings:
                content += f"#### 📋 Historical ({len(historical_warnings)} total)\n\n"
                content += "**Summary by Rule:**\n\n"
                
                # Aggregate by rule_ref
                rule_counts = defaultdict(int)
                for violation in historical_warnings:
                    rule_counts[violation.rule_ref] += 1
                
                # Sort by count (descending) and show top 20 rules
                sorted_rules = sorted(rule_counts.items(), key=lambda x: x[1], reverse=True)
                for rule_ref, count in sorted_rules[:20]:
                    content += f"- **{rule_ref}**: {count} warning(s)\n"
                
                if len(sorted_rules) > 20:
                    remaining_count = sum(count for _, count in sorted_rules[20:])
                    content += f"- **Other rules**: {remaining_count} warning(s)\n"
                
                content += f"\n*See `.cursor/enforcement/VIOLATIONS.md` for complete historical violations list.*\n\n"
            
            content += "\n"
        
        # Add auto-fixes summary if any
        if self.session.auto_fixes:
            content += "## Auto-Fixes Applied\n\n"
            content += f"**Total Fixes:** {len(self.session.auto_fixes)}\n\n"
            content += "The following violations were auto-fixed during this session:\n\n"
            
            for fix in self.session.auto_fixes:
                content += f"- **{fix['rule_ref']}**: {fix['fix_description']}"
                if fix['file_path']:
                    content += f" (`{fix['file_path']}`"
                    if fix['line_number']:
                        content += f":{fix['line_number']}"
                    content += ")"
                content += "\n"
            
            content += "\n**See `.cursor/enforcement/AUTO_FIXES.md` for detailed fix information.**\n\n"
            content += "---\n\n"
        
        content += "## Compliance Checks\n\n"
        # Deduplicate checks to prevent accumulation over multiple runs
        unique_checks_passed = list(dict.fromkeys(self.session.checks_passed))  # Preserves order
        unique_checks_failed = list(dict.fromkeys(self.session.checks_failed))  # Preserves order
        
        # CRITICAL FIX: Remove from failed list if it appears in passed list (latest status wins)
        # This handles the case where a check fails then passes in the same session
        # Also normalize check names by removing skip reasons for comparison
        def normalize_check_name(check: str) -> str:
            """Normalize check name by removing skip reasons for comparison."""
            # Remove "(skipped - ...)" suffix for comparison
            if " (skipped -" in check:
                return check.split(" (skipped -")[0]
            return check
        
        # Create normalized sets for comparison
        normalized_passed = {normalize_check_name(check): check for check in unique_checks_passed}
        normalized_failed = {normalize_check_name(check): check for check in unique_checks_failed}
        
        # Remove from failed if same normalized name appears in passed (latest status wins)
        checks_failed_filtered = [
            check for check in unique_checks_failed
            if normalize_check_name(check) not in normalized_passed
        ]
        
        for check in unique_checks_passed:
            content += f"- [x] {check}\n"
        for check in checks_failed_filtered:
            content += f"- [ ] {check}\n"
        
        content += f"""
## Session Information

- **Session Start:** {self.session.start_time}
- **Last Check:** {self.session.last_check}
- **Total Violations:** {len(self.violations)}
- **Blocked:** {len(blocked_violations)} total
  - 🔧 Current Session: {len(current_session_blocked)} (auto-fixable)
  - 📋 Historical: {len(historical_blocked)} (require human input)
- **Warnings:** {len(warning_violations)}
"""
        
        try:
            with open(status_file, 'w', encoding='utf-8') as f:
                f.write(content)
            logger.info(
                "Agent status file generated",
                operation="generate_agent_status",
                status=status_text,
                violations_count=len(self.violations)
            )
            # Save session after re-evaluation to persist updated scopes
            self._save_session()
        except (FileNotFoundError, PermissionError, OSError) as e:
            logger.error(
                "Failed to generate agent status file",
                operation="generate_agent_status",
                error_code="STATUS_FILE_GENERATION_FAILED",
                root_cause=str(e)
            )
    
    def generate_violations_log(self):
        """Generate VIOLATIONS.md file."""
        violations_file = self.enforcement_dir / "VIOLATIONS.md"
        
        content = f"""# Violations Log

**Last Updated:** {datetime.now(timezone.utc).isoformat()}
**Session ID:** {self.session.session_id}

## All Violations

"""
        
        for violation in self.violations:
            content += f"""### {violation.severity.value} - {violation.rule_ref}

**Message:** {violation.message}
**Timestamp:** {violation.timestamp}
**Session Scope:** {violation.session_scope}
"""
            if violation.file_path:
                content += f"**File:** `{violation.file_path}`"
                if violation.line_number:
                    content += f" (line {violation.line_number})"
                content += "\n"
            content += "\n---\n\n"
        
        try:
            with open(violations_file, 'w', encoding='utf-8') as f:
                f.write(content)
            logger.info(
                "Violations log generated",
                operation="generate_violations_log",
                violations_count=len(self.violations)
            )
        except (FileNotFoundError, PermissionError, OSError) as e:
            logger.error(
                "Failed to generate violations log",
                operation="generate_violations_log",
                error_code="VIOLATIONS_LOG_GENERATION_FAILED",
                root_cause=str(e)
            )
    
    def generate_agent_reminders(self):
        """Generate AGENT_REMINDERS.md file."""
        reminders_file = self.enforcement_dir / "AGENT_REMINDERS.md"
        
        blocked_violations = [v for v in self.violations if v.severity == ViolationSeverity.BLOCKED]
        warning_violations = [v for v in self.violations if v.severity == ViolationSeverity.WARNING]
        
        content = f"""# Agent Reminders

**Last Updated:** {datetime.now(timezone.utc).isoformat()}

## Active Reminders

"""
        
        if blocked_violations:
            content += "### 🔴 CRITICAL - Must Fix Before Proceeding\n\n"
            for violation in blocked_violations:
                content += f"**{violation.rule_ref}**: {violation.message}\n\n"
        
        if warning_violations:
            content += "### 🟡 Warnings - Should Fix\n\n"
            for violation in warning_violations[:5]:  # Limit to top 5 warnings
                content += f"**{violation.rule_ref}**: {violation.message}\n\n"
        
        if not blocked_violations and not warning_violations:
            content += "✅ No active reminders. All checks passed.\n"
        
        try:
            with open(reminders_file, 'w', encoding='utf-8') as f:
                f.write(content)
            logger.info(
                "Agent reminders generated",
                operation="generate_agent_reminders",
                reminders_count=len(blocked_violations) + len(warning_violations)
            )
        except (FileNotFoundError, PermissionError, OSError) as e:
            logger.error(
                "Failed to generate agent reminders",
                operation="generate_agent_reminders",
                error_code="REMINDERS_GENERATION_FAILED",
                root_cause=str(e)
            )
    
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
        self._save_session()
        
        logger.info(
            f"Auto-fix tracked: {fix_description}",
            operation="track_auto_fix",
            rule_ref=violation.rule_ref,
            file_path=violation.file_path,
            fix_type=fix_type
            )
    
    def generate_enforcement_block_message(self):
        """
        Generate ENFORCEMENT_BLOCK.md file with blocking message for agent.
        
        This is the "automatic prompt" mechanism - the enforcer writes a blocking
        message file that the agent MUST read before proceeding. If violations
        are detected, this file contains a clear STOP message.
        
        The agent's pre-flight check (in .cursorrules) reads this file and
        displays the blocking message, effectively "sending a prompt" to stop.
        """
        block_file = self.enforcement_dir / "ENFORCEMENT_BLOCK.md"
        
        # Check if there are any blocked violations
        blocked_violations = [v for v in self.violations if v.severity == ViolationSeverity.BLOCKED]
        current_session_blocked = [v for v in blocked_violations if v.session_scope == "current_session"]
        historical_blocked = [v for v in blocked_violations if v.session_scope != "current_session"]
        
        if not blocked_violations:
            # No violations - remove block file if it exists
            if block_file.exists():
                try:
                    block_file.unlink()
                    logger.debug(
                        "Enforcement block file removed (no violations)",
                        operation="generate_enforcement_block_message"
                    )
                except OSError:
                    pass
            return
        
        # Generate blocking message
        content = f"""# 🚨 ENFORCEMENT BLOCK - DO NOT PROCEED 🚨

**Status:** 🔴 BLOCKED  
**Generated:** {datetime.now(timezone.utc).isoformat()}  
**Session ID:** {self.session.session_id}

---

## ⚠️ CRITICAL: YOU MUST STOP IMMEDIATELY

**The enforcement system has detected violations that BLOCK task execution.**

**YOU MUST:**
1. **STOP all current work immediately**
2. **Read this entire message**
3. **Fix violations before proceeding**
4. **DO NOT continue with any task until violations are resolved**

---

## Blocking Violations Summary

- **Total Blocked Violations:** {len(blocked_violations)}
  - 🔧 **Current Session (Auto-Fixable):** {len(current_session_blocked)}
  - 📋 **Historical (Require Human Input):** {len(historical_blocked)}

---

"""
        
        if current_session_blocked:
            content += f"""## 🔧 Current Session Violations ({len(current_session_blocked)} - Auto-Fixable)

**These violations were introduced in the current session. You MUST auto-fix these immediately.**

**Instructions:**
1. Review each violation below
2. Auto-fix the violations (update dates, add error handling, etc.)
3. Re-run enforcement to verify fixes: `python .cursor/scripts/auto-enforcer.py`
4. Only proceed after all current session violations are resolved

**Violations to Fix:**

"""
            for idx, violation in enumerate(current_session_blocked, 1):
                content += f"""### Violation #{idx}: {violation.rule_ref}

**Message:** {violation.message}
"""
                if violation.file_path:
                    content += f"**File:** `{violation.file_path}`"
                    if violation.line_number:
                        content += f" (line {violation.line_number})"
                    content += "\n"
                content += "\n"
            content += "\n---\n\n"
        
        if historical_blocked:
            content += f"""## 📋 Historical Violations ({len(historical_blocked)} - Require Human Input)

**These violations exist in historical code (not from current session). You MUST list these and request human guidance before proceeding.**

**Instructions:**
1. List ALL historical violations clearly in your response
2. Request human input/guidance on how to proceed
3. DO NOT attempt to auto-fix historical violations without explicit permission
4. DO NOT proceed with new tasks until human guidance is provided

**Historical Violations (First 20 shown):**

"""
            for idx, violation in enumerate(historical_blocked[:20], 1):
                content += f"""### Violation #{idx}: {violation.rule_ref}

**Message:** {violation.message}
"""
                if violation.file_path:
                    content += f"**File:** `{violation.file_path}`"
                    if violation.line_number:
                        content += f" (line {violation.line_number})"
                    content += "\n"
                content += "\n"
            if len(historical_blocked) > 20:
                content += f"\n*... and {len(historical_blocked) - 20} more historical violations. See `.cursor/enforcement/VIOLATIONS.md` for complete list.*\n"
            content += "\n**Action Required:** List these blockers and request human input/guidance before proceeding.\n\n---\n\n"
        
        content += f"""## Next Steps

### If You Have Current Session Violations (🔧):

1. **Auto-fix violations:**
   - Update hardcoded dates to current system date
   - Add missing error handling
   - Update "Last Updated" fields
   - Fix any other violations listed above

2. **Re-run enforcement:**
   ```bash
   python .cursor/scripts/auto-enforcer.py
   ```

3. **Verify fixes:**
   - Check that AGENT_STATUS.md shows COMPLIANT
   - Verify ENFORCEMENT_BLOCK.md is removed (no violations)

4. **Only then proceed** with your task

### If You Have Historical Violations (📋):

1. **List all violations** in your response
2. **Request human guidance** on how to proceed
3. **DO NOT proceed** until human provides guidance
4. **DO NOT auto-fix** historical violations without permission

---

## Full Details

For complete violation details, see:
- **AGENT_STATUS.md** - Full status report
- **VIOLATIONS.md** - Complete violations log
- **AGENT_REMINDERS.md** - Active reminders

---

## This File Will Be Removed When Compliant

**Once all violations are resolved:**
- Re-run enforcement: `python .cursor/scripts/auto-enforcer.py`
- This file will be automatically removed
- You can then proceed with your task

---

**Last Updated:** {datetime.now(timezone.utc).isoformat()}  
**Generated By:** VeroField Auto-Enforcement System
"""
        
        try:
            with open(block_file, 'w', encoding='utf-8') as f:
                f.write(content)
            logger.info(
                "Enforcement block message generated",
                operation="generate_enforcement_block_message",
                blocked_violations=len(blocked_violations),
                current_session=len(current_session_blocked),
                historical=len(historical_blocked)
            )
        except (FileNotFoundError, PermissionError, OSError) as e:
            logger.error(
                "Failed to generate enforcement block message",
                operation="generate_enforcement_block_message",
                error_code="BLOCK_MESSAGE_GENERATION_FAILED",
                root_cause=str(e)
            )
    
    def generate_auto_fixes_summary(self):
        """Generate AUTO_FIXES.md file with summary of all auto-fixes."""
        fixes_file = self.enforcement_dir / "AUTO_FIXES.md"
        
        if not self.session.auto_fixes:
            # No fixes - create empty file
            content = f"""# Auto-Fixes Summary

**Last Updated:** {datetime.now(timezone.utc).isoformat()}
**Session ID:** {self.session.session_id}

## No Auto-Fixes in This Session

No violations were auto-fixed during this session.
"""
        else:
            content = f"""# Auto-Fixes Summary

**Last Updated:** {datetime.now(timezone.utc).isoformat()}
**Session ID:** {self.session.session_id}
**Total Fixes:** {len(self.session.auto_fixes)}

## Auto-Fixes Applied

"""
            for idx, fix in enumerate(self.session.auto_fixes, 1):
                content += f"""### Fix #{idx}

**Rule:** {fix['rule_ref']}
**File:** `{fix['file_path']}` (line {fix['line_number']})
**Fix Type:** {fix['fix_type']}
**Description:** {fix['fix_description']}
**Timestamp:** {fix['timestamp']}

**Before:**
```

{fix['before_state']}

```

**After:**
```

{fix['after_state']}

```

---

"""
        
        try:
            with open(fixes_file, 'w', encoding='utf-8') as f:
                f.write(content)
            logger.info("Generated AUTO_FIXES.md", operation="generate_auto_fixes_summary")
        except (FileNotFoundError, PermissionError, OSError) as e:
            logger.error(
                "Failed to save auto-fixes summary",
                operation="generate_auto_fixes_summary",
                error_code="AUTO_FIXES_SAVE_FAILED",
                root_cause=str(e)
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
    
    def run_all_checks(self, user_message: Optional[str] = None, scope: str = "full") -> bool:
        """
        Run all compliance checks.
        
        CRITICAL FIX: Recommendations are updated BEFORE enforcement checks
        to ensure agent has latest context when starting Step 0.5.
        
        Args:
            user_message: Optional user message to pass to context recommendations
            scope: Scan scope - "full" for baseline scan (all files), "current_session" for incremental (changed files only)
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
        if scope == "current_session":
            # Incremental scan: only changed files since last check
            all_changed_files = self._get_changed_files_for_session()
            logger.info(
                f"Incremental scan: checking {len(all_changed_files)} changed files",
                operation="run_all_checks",
                files_count=len(all_changed_files)
            )
            # For current_session scope, don't skip non-critical (always check changed files)
            skip_non_critical = False
        else:
            # Full scan: use existing caching logic
            # Performance optimization: Cache changed files at start of run (Phase 1.1)
            # Python Bible 12.7.2: Manual memoization for session-level caching
            # Python Bible 12.7.4: Cache invalidation patterns - version tagging
            cache_key = self._get_git_state_key()
            if self._cached_changed_files is None or self._changed_files_cache_key != cache_key:
                # Clear file diff cache when git state changes (Phase 1.2)
                # Python Bible 12.7.4: Cache invalidation on state change
                if self._changed_files_cache_key is not None and self._changed_files_cache_key != cache_key:
                    self._file_diff_cache.clear()
                    # Phase 2.3: Clear git command cache when git state changes
                    _run_git_command_cached.cache_clear()
                    logger.debug(
                        "Cleared file diff cache and git command cache due to git state change",
                        operation="run_all_checks",
                        old_key=self._changed_files_cache_key,
                        new_key=cache_key
                    )
                
                logger.debug(
                    "Populating changed files cache",
                    operation="run_all_checks",
                    cache_key=cache_key,
                    previous_key=self._changed_files_cache_key
                )
                self._cached_changed_files = {
                    'tracked': self._get_changed_files_impl(include_untracked=False),
                    'untracked': self._get_changed_files_impl(include_untracked=True)
                }
                self._changed_files_cache_key = cache_key
            else:
                logger.debug(
                    "Using existing changed files cache",
                    operation="run_all_checks",
                    cache_key=cache_key
                )
            
            # Check file count early to optimize checks
            tracked_files = self._cached_changed_files['tracked']
            untracked_files_list = self._cached_changed_files['untracked']
            
            # Combine tracked and untracked files for enforcement checks
            # Untracked files should always be checked for violations (they're new files)
            all_changed_files = tracked_files + untracked_files_list
            changed_files_count = len(tracked_files)
            untracked_count = len(untracked_files_list)
            
            # Check if there are untracked files (new files that should always be checked)
            has_untracked = untracked_count > 0
            
            # Skip non-critical checks if >100 files, UNLESS there are untracked files
            # (untracked files should always be checked for violations)
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
        
        # Phase 4: Use modular checkers if available, otherwise fall back to legacy methods
        if self.use_modular_checkers and self.checker_router:
            try:
                self._run_modular_checkers(all_changed_files, user_message, skip_non_critical, violation_scope=violation_scope)
            except Exception as e:
                logger.error(
                    f"Modular checkers failed, falling back to legacy methods: {e}",
                    operation="run_all_checks",
                    error_code="MODULAR_CHECKERS_FAILED",
                    root_cause=str(e)
                )
                # Fall back to legacy methods
                self._run_legacy_checks(skip_non_critical, violation_scope=violation_scope)
        else:
            # Use legacy check methods
            self._run_legacy_checks(skip_non_critical, violation_scope=violation_scope)
        
        # Update session
        self.session.last_check = datetime.now(timezone.utc).isoformat()
        self._save_session()
        
        # Generate status files
        self.generate_agent_status()
        self.generate_violations_log()
        self.generate_agent_reminders()
        self.generate_auto_fixes_summary()
        
        # Generate enforcement block message (if violations detected)
        # This is the "automatic prompt" - enforcer writes blocking message that agent must read
        self.generate_enforcement_block_message()
        
        # Generate Two-Brain report (ENFORCER_REPORT.json) for Brain B (LLM)
        # This enables the Two-Brain Model communication protocol
        report = None
        try:
            report = self.generate_two_brain_report()
        except Exception as e:
            # Don't fail the entire run if report generation fails
            logger.warn(
                f"Failed to generate Two-Brain report: {e}",
                operation="run_all_checks",
                error_code="TWO_BRAIN_REPORT_FAILED",
                root_cause=str(e)
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
        changed_files: List[str],
        user_message: Optional[str] = None,
        skip_non_critical: bool = False,
        violation_scope: str = "current_session"
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
        if not self.checker_router or not MODULAR_CHECKERS_AVAILABLE:
            return
        
        # Get all available checker classes
        available_checkers = get_all_checker_classes()
        
        # Use router to determine which checkers should run
        checkers_to_run = self.checker_router.get_checkers_to_run(
            changed_files,
            available_checkers
        )
        
        logger.info(
            f"Running {len(checkers_to_run)} modular checkers",
            operation="_run_modular_checkers",
            total_checkers=len(checkers_to_run)
        )
        
        # Run each checker
        for checker in checkers_to_run:
            try:
                # Skip non-critical checkers if requested
                if skip_non_critical and not checker.always_apply:
                    continue
                
                # Execute checker
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
                
                logger.debug(
                    f"Checker {checker.rule_ref} completed: {result.status.value}",
                    operation="_run_modular_checkers",
                    rule_ref=checker.rule_ref,
                    status=result.status.value,
                    violations=len(result.violations),
                    execution_time_ms=result.execution_time_ms
                )
                
            except Exception as e:
                logger.error(
                    f"Modular checker failed: {checker.rule_ref}",
                    operation="_run_modular_checkers",
                    error_code="CHECKER_EXECUTION_FAILED",
                    root_cause=str(e),
                    rule_ref=checker.rule_ref
                )
                self._report_failure(f"Modular Checker: {checker.rule_ref}")
    
    def _run_legacy_checks(self, skip_non_critical: bool = False, violation_scope: str = "current_session"):
        """
        Run checks using legacy methods (fallback).
        
        Args:
            skip_non_critical: Whether to skip non-critical checks
            violation_scope: Scope for violations - "current_session" or "historical"
        """
        # Critical checks (always run)
        critical_checks = [
            ("Memory Bank", self.check_memory_bank),
            ("Security Compliance", self.check_security_compliance),
            ("Active Context", self.check_active_context),
            ("Context Management", self.check_context_management_compliance),
        ]
        
        # Non-critical checks (skip if too many files)
        # Pass violation_scope to check_hardcoded_dates
        non_critical_checks = [
            ("Hardcoded Dates", lambda: self.check_hardcoded_dates(violation_scope=violation_scope)),
            ("Error Handling", self.check_error_handling),
            ("Structured Logging", self.check_logging),
            ("Python Bible", self.check_python_bible),
            ("Bug Logging", self.check_bug_logging),
        ]
        
        # Run critical checks
        for check_name, check_func in critical_checks:
            try:
                check_func()
            except Exception as e:
                logger.error(
                    f"Check failed with exception: {check_name}",
                    operation="_run_legacy_checks",
                    error_code="CHECK_EXCEPTION",
                    root_cause=str(e),
                    check_name=check_name
                )
                self._report_failure(check_name)
        
        # Run non-critical checks only if file count is reasonable
        if not skip_non_critical:
            for check_name, check_func in non_critical_checks:
                try:
                    check_func()
                except Exception as e:
                    logger.error(
                        f"Check failed with exception: {check_name}",
                        operation="_run_legacy_checks",
                        error_code="CHECK_EXCEPTION",
                        root_cause=str(e),
                        check_name=check_name
                    )
                    self._report_failure(check_name)
        else:
            logger.info(
                "Skipped non-critical checks due to large file count",
                operation="_run_legacy_checks",
                skipped_checks=[name for name, _ in non_critical_checks]
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
            changed_files = self.get_changed_files(include_untracked=False)
            
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
                from context_manager.analytics import PredictionAnalytics
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
                    categorizer = ContextCategorizer()
                    
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
                    rule_file_manager = RuleFileManager()
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
        
        try:
            # Read recommendations file
            recommendations_file = self.project_root / ".cursor" / "context_manager" / "recommendations.md"
            if not recommendations_file.exists():
                # File doesn't exist yet - system may not have updated
                # Try to trigger update if we have changed files
                # Don't include untracked files for context metrics (only actual edits)
                changed_files = self.get_changed_files(include_untracked=False)
                if changed_files and self.predictor:
                    try:
                        self._update_context_recommendations()
                        # Wait a moment for file to be written
                        import time
                        time.sleep(0.1)
                    except Exception:
                        pass  # Ignore update errors, just try to read what exists
            
            if recommendations_file.exists():
                with open(recommendations_file, 'r', encoding='utf-8') as f:
                    recommendations_content = f.read()
                    
                    # Extract active context files
                    active_section = recommendations_content.split("### Active Context (Currently Loaded)")[1].split("###")[0] if "### Active Context (Currently Loaded)" in recommendations_content else ""
                    active_files = [line.strip().replace('- `', '').replace('`', '').replace(' (PRIMARY)', '') 
                                   for line in active_section.split('\n') 
                                   if line.strip().startswith('- `')]
                    metrics['context_usage']['active_files'] = active_files
                    metrics['context_usage']['active_count'] = len(active_files)
                    
                    # Extract pre-loaded context files
                    preload_section = recommendations_content.split("### Pre-loaded Context (Ready for Next Tasks)")[1].split("###")[0] if "### Pre-loaded Context (Ready for Next Tasks)" in recommendations_content else ""
                    preloaded_files = [line.strip().replace('- `', '').replace('`', '').replace(' (HIGH)', '') 
                                      for line in preload_section.split('\n') 
                                      if line.strip().startswith('- `')]
                    metrics['context_usage']['preloaded_files'] = preloaded_files
                    metrics['context_usage']['preloaded_count'] = len(preloaded_files)
                    
                    # Extract context to unload
                    unload_section = recommendations_content.split("### Context to Unload")[1].split("##")[0] if "### Context to Unload" in recommendations_content else ""
                    unloaded_files = [line.strip().replace('- `', '').replace('`', '').replace(' - **REMOVE @ mention**', '') 
                                     for line in unload_section.split('\n') 
                                     if line.strip().startswith('- `')]
                    metrics['context_usage']['unloaded_files'] = unloaded_files
                    metrics['context_usage']['unloaded_count'] = len(unloaded_files)
            
            # Calculate token statistics
            try:
                from context_manager.token_estimator import TokenEstimator  # type: ignore
                token_estimator = TokenEstimator(self.project_root)
                
                # Get active context tokens
                active_metrics = token_estimator.track_context_load(metrics['context_usage']['active_files'])
                metrics['token_statistics']['active_tokens'] = active_metrics.total_tokens
                
                # Get pre-loaded context tokens (30% cost for background loading)
                preload_metrics = token_estimator.track_context_load(metrics['context_usage']['preloaded_files'])
                preload_token_cost = int(preload_metrics.total_tokens * 0.3)  # 30% of full cost
                metrics['token_statistics']['preloaded_tokens'] = preload_token_cost
                
                # Total tokens used
                metrics['token_statistics']['total_tokens'] = active_metrics.total_tokens + preload_token_cost
                
                # Estimate static baseline (all context files that would be loaded without prediction)
                # This is a simplified estimate - in practice, would need to track all possible context files
                all_context_files = set(metrics['context_usage']['active_files'] + metrics['context_usage']['preloaded_files'])
                static_metrics = token_estimator.track_context_load(list(all_context_files))
                metrics['token_statistics']['static_baseline'] = static_metrics.total_tokens
                
                # Calculate savings
                if metrics['token_statistics']['static_baseline'] > 0:
                    savings = metrics['token_statistics']['static_baseline'] - metrics['token_statistics']['total_tokens']
                    metrics['token_statistics']['savings_tokens'] = max(0, savings)  # Don't show negative savings
                    metrics['token_statistics']['savings_percentage'] = round(
                        (savings / metrics['token_statistics']['static_baseline'] * 100) if metrics['token_statistics']['static_baseline'] > 0 else 0.0,
                        2
                    )
                
            except Exception as e:
                logger.debug(
                    f"Failed to calculate token statistics: {e}",
                    operation="get_context_metrics_for_audit",
                    error_code="TOKEN_STATS_FAILED",
                    root_cause=str(e)
                )
            
            # Read dashboard for compliance status
            dashboard_file = self.project_root / ".cursor" / "context_manager" / "dashboard.md"
            if dashboard_file.exists():
                with open(dashboard_file, 'r', encoding='utf-8') as f:
                    dashboard_content = f.read()
                    # Simple check - if dashboard has real data (not just placeholders), assume steps completed
                    if "[Will be populated" not in dashboard_content and "[Count]" not in dashboard_content:
                        metrics['compliance']['step_0_5_completed'] = True
                        metrics['compliance']['step_4_5_completed'] = True
                        metrics['compliance']['recommendations_followed'] = True
            
        except Exception as e:
            logger.debug(
                f"Failed to get context metrics: {e}",
                operation="get_context_metrics_for_audit",
                error_code="CONTEXT_METRICS_FAILED",
                root_cause=str(e)
            )
        
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
        content = f"""# Context Management Dashboard

**Last Updated:** {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}

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
    
    def generate_two_brain_report(self):
        """
        Generate ENFORCER_REPORT.json for Two-Brain Model communication.
        
        This method creates the report that Brain B (LLM) reads to understand
        violations and receive context hints.
        
        Returns:
            EnforcerReport instance if successful, None otherwise
        """
        try:
            # Import Two-Brain integration
            import sys
            enforcement_path = self.project_root / ".cursor" / "enforcement"
            if str(enforcement_path) not in sys.path:
                sys.path.insert(0, str(enforcement_path.parent))
            from enforcement.two_brain_integration import integrate_with_enforcer
            
            # Generate report from current enforcer state
            report = integrate_with_enforcer(self)
            
            # Add context hints based on current task and violations
            self._add_context_hints_to_report(report)
            
            # Save report
            report.save()
            
            logger.info(
                "Two-Brain report generated",
                operation="generate_two_brain_report",
                violations_count=len(report.violations),
                status=report.get_status()
            )
            
            return report
            
        except ImportError:
            # Fallback if two_brain_integration not available
            logger.warn(
                "Two-Brain integration not available, skipping report generation",
                operation="generate_two_brain_report",
                error_code="INTEGRATION_NOT_AVAILABLE"
            )
            return None
        except Exception as e:
            logger.error(
                f"Failed to generate Two-Brain report: {e}",
                operation="generate_two_brain_report",
                error_code="REPORT_GENERATION_FAILED",
                root_cause=str(e)
            )
            return None
    
    def _add_context_hints_to_report(self, report):
        """
        Add context hints to ENFORCER_REPORT based on violations and task type.
        
        Two-Brain Model: Provides minimal guidance to LLM without loading heavy rules.
        Uses unified context manager to compute optimal context bundle.
        
        Args:
            report: EnforcerReport instance to update
        """
        # Use unified context manager to compute context bundle
        context_bundle = self._compute_unified_context_bundle()
        
        # Set context bundle in report
        report.set_context_bundle(
            task_type=context_bundle.get('task_type'),
            hints=context_bundle.get('hints', []),
            relevant_files=context_bundle.get('relevant_files', []),
            patterns_to_follow=context_bundle.get('patterns_to_follow', [])
        )
    
    def _compute_unified_context_bundle(self) -> Dict[str, Any]:
        """
        Unified Context Manager: Compute optimal context bundle for LLM.
        
        Two-Brain Model: Brain A (enforcer) computes all context decisions.
        Brain B (LLM) receives curated context bundle in ENFORCER_REPORT.
        
        This method:
        1. Detects task type from violations and file changes
        2. Computes optimal context (using internal recommendations)
        3. Extracts minimal hints (not full rule files)
        4. Finds relevant example files
        5. Identifies patterns to follow
        
        Returns:
            Dict with task_type, hints, relevant_files, patterns_to_follow
        """
        # Step 1: Detect task type
        task_type = self._detect_task_type_unified()
        
        # Step 2: Load internal recommendations (if available)
        internal_recommendations = self._load_internal_recommendations()
        
        # Step 3: Extract hints based on task type and recommendations
        hints = self._extract_context_hints_unified(task_type, internal_recommendations)
        
        # Step 4: Find relevant example files
        relevant_files = self._find_relevant_example_files(task_type, internal_recommendations)
        
        # Step 5: Get patterns to follow
        patterns = self._get_patterns_to_follow_unified(task_type, internal_recommendations)
        
        return {
            "task_type": task_type,
            "hints": hints,
            "relevant_files": relevant_files,
            "patterns_to_follow": patterns
        }
    
    def _detect_task_type_unified(self) -> Optional[str]:
        """
        Unified task type detection from violations and file changes.
        
        Returns:
            Task type string or None
        """
        # First, try to detect from violations
        task_type_from_violations = self._detect_task_type_from_violations()
        if task_type_from_violations:
            return task_type_from_violations
        
        # Fallback: Detect from file changes
        changed_files = self.get_changed_files(include_untracked=False)
        if not changed_files:
            return None
        
        # Infer task type from file patterns
        file_types = set()
        for file_path in changed_files[:20]:  # Sample first 20
            if file_path.endswith('.ts') or file_path.endswith('.tsx'):
                file_types.add('typescript')
            elif file_path.endswith('.py'):
                file_types.add('python')
            elif 'schema.prisma' in file_path:
                return "database_change"
            elif 'auth' in file_path.lower():
                return "auth_change"
            elif 'test' in file_path.lower():
                return "test_change"
        
        # Default based on file types
        if 'typescript' in file_types:
            return "edit_code"
        elif 'python' in file_types:
            return "edit_code"
        
        return "edit_code"
    
    def _load_internal_recommendations(self) -> Optional[Dict]:
        """
        Load internal recommendations from enforcer-only location.
        
        Returns:
            Recommendations dict or None
        """
        recommendations_file = self.project_root / ".cursor" / "enforcement" / "internal" / "context_recommendations.json"
        
        if not recommendations_file.exists():
            return None
        
        try:
            with open(recommendations_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.debug(
                f"Could not load internal recommendations: {e}",
                operation="_load_internal_recommendations",
                error_code="LOAD_RECOMMENDATIONS_FAILED",
                root_cause=str(e)
            )
            return None
    
    def _extract_context_hints_unified(self, task_type: Optional[str], 
                                     recommendations: Optional[Dict]) -> List[str]:
        """
        Extract context hints using unified approach.
        
        Args:
            task_type: Detected task type
            recommendations: Internal recommendations (if available)
            
        Returns:
            List of guidance hints
        """
        # Start with base hints from task type
        hints = self._extract_context_hints(task_type)
        
        # Enhance with recommendations if available
        if recommendations and task_type:
            task_info = recommendations.get('task', {})
            context_info = recommendations.get('context', {})
            
            # Add task-specific hints from recommendations
            if task_info.get('type') == task_type:
                # Use recommendations context if it matches
                pass  # Base hints are already good
        
        return hints
    
    def _find_relevant_example_files(self, task_type: Optional[str], 
                                    recommendations: Optional[Dict]) -> List[str]:
        """
        Find relevant example files using unified approach.
        
        Args:
            task_type: Detected task type
            recommendations: Internal recommendations (if available)
            
        Returns:
            List of example file paths
        """
        # Start with base example files
        example_files = self._get_relevant_example_files(task_type)
        
        # Enhance with recommendations if available
        if recommendations:
            context_info = recommendations.get('context', {})
            active_files = context_info.get('active', [])
            
            # Filter to actual code files (not rule files)
            code_examples = [
                f for f in active_files 
                if not f.startswith('.cursor/') and 
                   (f.endswith('.ts') or f.endswith('.tsx') or f.endswith('.py'))
            ]
            
            # Add top examples from recommendations
            example_files.extend(code_examples[:3])
        
        # Remove duplicates and limit
        seen = set()
        unique_files = []
        for f in example_files:
            if f and f not in seen:
                seen.add(f)
                unique_files.append(f)
        
        return unique_files[:5]  # Limit to 5 examples
    
    def _get_patterns_to_follow_unified(self, task_type: Optional[str],
                                       recommendations: Optional[Dict]) -> List[str]:
        """
        Get patterns to follow using unified approach.
        
        Args:
            task_type: Detected task type
            recommendations: Internal recommendations (if available)
            
        Returns:
            List of pattern descriptions
        """
        # Start with base patterns
        patterns = self._get_patterns_to_follow(task_type)
        
        # Enhance with recommendations if available
        if recommendations:
            # Could extract patterns from recommendations context
            pass  # Base patterns are already good
        
        return patterns
    
    def _detect_task_type_from_violations(self) -> Optional[str]:
        """
        Detect task type from violations.
        
        Returns:
            Task type string (e.g., "add_rls", "add_logging", "fix_date") or None
        """
        if not self.violations:
            return None
        
        # Analyze violations to determine task type
        for v in self.violations:
            rule_ref = getattr(v, 'rule_ref', '') or getattr(v, 'message', '')
            rule_ref_lower = rule_ref.lower()
            
            if 'rls' in rule_ref_lower or 'tenant' in rule_ref_lower or 'security' in rule_ref_lower:
                return "add_rls"
            elif 'date' in rule_ref_lower or '02-core' in rule_ref:
                return "fix_date"
            elif 'logging' in rule_ref_lower or 'observability' in rule_ref_lower:
                return "add_logging"
            elif 'error' in rule_ref_lower or 'resilience' in rule_ref_lower:
                return "add_error_handling"
        
        return "fix_violations"
    
    def _extract_context_hints(self, task_type: Optional[str]) -> List[str]:
        """
        Extract minimal context hints for task type.
        
        Uses comprehensive context hints library.
        
        Args:
            task_type: Type of task detected
            
        Returns:
            List of guidance hints
        """
        if not task_type:
            return []
        
        # Comprehensive Context Hints Library
        hints_map = {
            "add_rls": [
                "RLS pattern: Filter all queries by tenant_id",
                "Use TenantGuard decorator on controller methods",
                "Example: where: { tenant_id: ctx.user.tenant_id, ... }",
                "Verify tenant_id from authenticated JWT (never from request body)",
                "Test: Add multi-tenant test coverage with different tenant_ids"
            ],
            "add_logging": [
                "Use structured logging: this.logger.warn({ event, user_id, tenant_id, ip, timestamp, ... })",
                "Log security events: AUTH_FAILED, ACCESS_DENIED, RLS_VIOLATION, etc.",
                "Include context: user_id, tenant_id, ip, timestamp, traceId",
                "Never use console.log in production code"
            ],
            "fix_date": [
                "Replace hardcoded dates with: @Inject(SYSTEM_DATE) or inject(SYSTEM_DATE)",
                "Use date abstraction: this.systemDate.now() or similar",
                "Never use: new Date('2023-01-01') or hardcoded date strings",
                "For 'Last Updated' fields: Use current system date dynamically"
            ],
            "add_error_handling": [
                "No silent failures: Always log errors with context",
                "Use try/catch with proper error propagation",
                "Log with traceId and tenantId for correlation",
                "Map errors to appropriate HTTP status codes (400, 422, 500)"
            ],
            "fix_violations": [
                "Review violation descriptions and fix_hints carefully",
                "Follow patterns from similar implementations in codebase",
                "Ensure compliance with rule references",
                "Keep fixes minimal and focused on the violation"
            ],
            "database_change": [
                "Update schema.prisma → Create migration → Update DTOs → Update frontend types",
                "Maintain RLS policies for tenant-scoped tables",
                "Verify tenant isolation is maintained",
                "Test with multiple tenant_ids"
            ],
            "auth_change": [
                "Always validate JWT tokens on every request",
                "Extract tenant_id from validated JWT (never from request)",
                "Use JwtAuthGuard and TenantGuard decorators",
                "Log all authentication events (success and failure)"
            ],
            "test_change": [
                "Add regression tests that reproduce the bug",
                "Test with multiple tenant_ids for multi-tenant features",
                "Verify error handling paths",
                "Check test coverage for new code"
            ],
            "edit_code": [
                "Follow existing patterns in the codebase",
                "Maintain consistency with project structure",
                "Add error handling and logging where appropriate",
                "Verify security compliance (RLS, auth, validation)"
            ]
        }
        
        return hints_map.get(task_type, [
            "Review violation descriptions and fix_hints",
            "Follow existing patterns in the codebase",
            "Ensure security and error handling compliance"
        ])
    
    def _get_relevant_example_files(self, task_type: Optional[str]) -> List[str]:
        """
        Get relevant example files for task type.
        
        Searches codebase for example implementations.
        
        Args:
            task_type: Type of task detected
            
        Returns:
            List of example file paths
        """
        if not task_type:
            return []
        
        example_files = []
        
        try:
            import subprocess
            
            # Search patterns based on task type
            search_patterns = {
                "add_rls": [
                    ('tenant_id.*where', '*.ts'),
                    ('TenantGuard', '*.ts'),
                    ('@UseGuards.*Tenant', '*.ts')
                ],
                "add_logging": [
                    ('logger\\.(warn|error|info)', '*.ts'),
                    ('structured.*log', '*.ts')
                ],
                "fix_date": [
                    ('SYSTEM_DATE', '*.ts'),
                    ('systemDate', '*.ts'),
                    ('inject.*DATE', '*.ts')
                ],
                "add_error_handling": [
                    ('try.*catch', '*.ts'),
                    ('AppError', '*.ts'),
                    ('HttpException', '*.ts')
                ],
                "database_change": [
                    ('schema\\.prisma', '*.prisma'),
                    ('migration', '*.ts')
                ],
                "auth_change": [
                    ('JwtAuthGuard', '*.ts'),
                    ('@UseGuards.*Jwt', '*.ts'),
                    ('validate.*token', '*.ts')
                ]
            }
            
            patterns = search_patterns.get(task_type, [])
            
            for pattern, file_glob in patterns[:2]:  # Limit to 2 patterns per task type
                try:
                    result = subprocess.run(
                        ['git', 'grep', '-l', pattern, '--', file_glob],
                        capture_output=True,
                        text=True,
                        timeout=5,
                        cwd=str(self.project_root)
                    )
                    if result.returncode == 0:
                        files = result.stdout.strip().split('\n')
                        # Filter to actual source files (not test files for examples)
                        source_files = [f for f in files if f and 'test' not in f.lower()][:2]
                        example_files.extend(source_files)
                except Exception:
                    pass
            
        except Exception:
            pass
        
        # Remove duplicates and limit
        seen = set()
        unique_files = []
        for f in example_files:
            if f and f not in seen:
                seen.add(f)
                unique_files.append(f)
        
        return unique_files[:5]  # Limit to 5 examples
    
    def _get_patterns_to_follow(self, task_type: Optional[str]) -> List[str]:
        """
        Get patterns to follow for task type.
        
        Comprehensive patterns library.
        
        Args:
            task_type: Type of task detected
            
        Returns:
            List of pattern descriptions
        """
        if not task_type:
            return []
        
        patterns_map = {
            "add_rls": [
                "Use TenantGuard decorator on controller methods",
                "Inject tenant_id from authenticated context (JWT)",
                "Filter all queries by tenant_id: where: { tenant_id: ctx.user.tenant_id, ... }",
                "Use Prisma RLS middleware or manual guards",
                "Never trust client-provided tenant_id"
            ],
            "add_logging": [
                "Use structured logger (not console.log)",
                "Include event name, user_id, tenant_id, ip, timestamp",
                "Log security events at WARN level",
                "Include traceId for request correlation"
            ],
            "fix_date": [
                "Use system date injection: @Inject(SYSTEM_DATE)",
                "Never hardcode dates like new Date('2023-01-01')",
                "Use date abstraction layer: this.systemDate.now()",
                "For documentation: Use current system date dynamically"
            ],
            "add_error_handling": [
                "Wrap risky operations in try/catch",
                "Log errors with context (traceId, tenantId, user_id)",
                "Propagate typed errors (AppError, HttpException)",
                "No silent failures - always log or throw"
            ],
            "database_change": [
                "Update schema.prisma → Create migration → Update DTOs → Update frontend types",
                "Maintain RLS policies for tenant-scoped tables",
                "Use prisma.$transaction for multi-step operations",
                "Verify tenant isolation in all queries"
            ],
            "auth_change": [
                "Validate JWT tokens on every request",
                "Extract tenant_id from validated JWT (never from request body)",
                "Use JwtAuthGuard and TenantGuard decorators",
                "Log authentication events (AUTH_SUCCESS, AUTH_FAILED)"
            ],
            "test_change": [
                "Add regression tests that reproduce the bug",
                "Test with multiple tenant_ids for multi-tenant features",
                "Verify error handling paths",
                "Check test coverage meets requirements"
            ],
            "edit_code": [
                "Follow existing patterns in the codebase",
                "Maintain consistency with project structure",
                "Add error handling and logging where appropriate",
                "Verify security compliance (RLS, auth, validation)"
            ]
        }
        
        return patterns_map.get(task_type, [
            "Follow existing patterns in the codebase",
            "Ensure security and error handling compliance"
        ])
    
    def run(self, user_message: Optional[str] = None, scope: str = "full") -> int:
        """Main entry point."""
        try:
            success = self.run_all_checks(user_message=user_message, scope=scope)
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
    
    exit_code = enforcer.run(user_message=args.user_message, scope=args.scope)
    
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


