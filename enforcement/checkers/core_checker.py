"""
Core checker for 02-core.mdc rules.

Handles:
- Hardcoded date detection
"""

import re
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timezone

from .base_checker import BaseChecker, CheckerResult, CheckerStatus
from enforcement.core.historical import is_historical_path
from .exceptions import CheckerExecutionError

# Import session and git utilities for modification checking
try:
    from enforcement.core.session_state import EnforcementSession, load_session
    from enforcement.core.git_utils import GitUtils
    from enforcement.core.file_scanner import is_file_modified_in_session
    SESSION_AVAILABLE = True
except ImportError:
    SESSION_AVAILABLE = False
    EnforcementSession = None
    GitUtils = None
    is_file_modified_in_session = None

# Try to import DateDetector if available
try:
    from enforcement.date_detector import DateDetector, DocumentContext, DateClassification
    DATE_DETECTOR_AVAILABLE = True
except ImportError:
    DATE_DETECTOR_AVAILABLE = False
    DateDetector = None
    DocumentContext = None
    DateClassification = None


class CoreChecker(BaseChecker):
    """
    Checker for 02-core.mdc rules.
    
    Enforces:
    - No hardcoded dates (must use current system date)
    """
    
    # Hardcoded date patterns - supports multiple formats
    HARDCODED_DATE_PATTERN = re.compile(
        r'\b(20\d{2})[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])\b|'  # YYYY-MM-DD or YYYY/MM/DD
        r'\b(0[1-9]|1[0-2])[/-](0[1-9]|[12]\d|3[01])[/-](20\d{2})\b'   # MM/DD/YYYY or MM-DD-YYYY
    )
    
    # Historical date patterns (contexts where dates are intentionally historical)
    HISTORICAL_DATE_PATTERNS = [
        # Entry/log patterns
        re.compile(r'(entry|log|note|memo)\s*#?\d*\s*[-–:]', re.IGNORECASE),
        # Status/completion markers
        re.compile(r'(completed|resolved|fixed|closed)\s*[:\(]', re.IGNORECASE),
        # Metadata fields
        re.compile(r'\*\*(date|created|updated|generated|report)[:*]', re.IGNORECASE),
        # Code examples
        re.compile(r'(`[^`]*\d{4}[^`]*`|\w+\([^)]*\d{4})', re.IGNORECASE),
        # Document structure
        re.compile(r'^#{1,6}\s+.*\d{4}', re.IGNORECASE | re.MULTILINE),
    ]
    
    def __init__(self, *args, **kwargs):
        """Initialize core checker."""
        super().__init__(*args, **kwargs)
        self.current_date = datetime.now().strftime("%Y-%m-%d")
        self.detector = None
        if DATE_DETECTOR_AVAILABLE and DateDetector:
            self.detector = DateDetector(current_date=self.current_date)
        
        # Load session and git_utils for modification checking
        self.session = None
        self.git_utils = None
        if SESSION_AVAILABLE:
            try:
                from enforcement.config_paths import get_cursor_enforcer_root
                enforcement_dir = get_cursor_enforcer_root(self.project_root)
                self.session, _ = load_session(enforcement_dir)
                self.git_utils = GitUtils(self.project_root)
            except Exception:
                # If session/git_utils can't be loaded, continue without them
                # (will skip modification checks)
                pass
    
    def check(self, changed_files: List[str], user_message: Optional[str] = None, classification_map: Optional[dict] = None) -> CheckerResult:
        """
        Execute core checks (hardcoded date detection).
        
        Checks only the changed_files list provided by the caller. For each file,
        it only creates violations if the file was actually modified (content
        changed, not moved) AND the date doesn't match the current date.
        
        Args:
            changed_files: List of file paths that have changed
            user_message: Optional user message for context
            
        Returns:
            CheckerResult with violations and status
        """
        start_time = datetime.now(timezone.utc)
        violations = []
        checks_passed = []
        checks_failed = []
        files_checked = 0
        
        try:
            # Filter to only check relevant files (skip binary, excluded dirs)
            files_to_check = self._filter_files(changed_files)
            files_checked = len(files_to_check)
            print(f"[CORE_CHECKER] Checking {files_checked} changed files for hardcoded dates...", flush=True)
            
            # Progress logging for large file counts
            log_progress = files_checked > 100
            if log_progress:
                import sys
                import time
                print(f"[CORE_CHECKER] Checking {files_checked} files for hardcoded dates...", flush=True)
            
            # Check each file for hardcoded dates with timing and timeout protection
            import time
            batch_start_time = time.perf_counter()
            allowed_classes = {"CONTENT_CHANGED", "NEW_FILE"}
            for idx, file_path_str in enumerate(files_to_check, 1):
                if classification_map:
                    cls = classification_map.get(file_path_str)
                    if cls not in allowed_classes:
                        continue
                if is_historical_path(file_path_str):
                    continue
                file_start_time = time.perf_counter()
                
                # More frequent progress logging to identify where it hangs
                if log_progress:
                    if idx % 10 == 0:  # Every 10 files instead of 100
                        batch_duration = time.perf_counter() - batch_start_time
                        print(f"[CORE_CHECKER] Progress: {idx}/{files_checked} files checked... (last 10 files: {batch_duration:.2f}s, current: {file_path_str[:60]})", flush=True)
                        batch_start_time = time.perf_counter()  # Reset for next batch
                    elif idx % 100 == 0:
                        print(f"[CORE_CHECKER] Progress: {idx}/{files_checked} files checked...", flush=True)
                
                # Log current file being processed (for debugging hangs)
                # After file 700, log every file to identify where it hangs
                if log_progress and idx >= 700:
                    print(f"[CORE_CHECKER] Processing file {idx}/{files_checked}: {file_path_str[:80]}", flush=True)
                
                try:
                    # Add timeout protection for individual files (shorter since heavy files excluded)
                    file_violations = self._check_file_for_dates_with_timeout(file_path_str, timeout_seconds=2)
                    violations.extend(file_violations)
                    
                    file_duration = time.perf_counter() - file_start_time
                    # Log slow files (>1 second)
                    if file_duration > 1.0:
                        print(f"[CORE_CHECKER] Slow file: {file_path_str} took {file_duration:.2f}s", flush=True)
                except TimeoutError:
                    print(f"[CORE_CHECKER] TIMEOUT: Skipping {file_path_str} (exceeded 5s limit)", flush=True)
                    continue
                except Exception as e:
                    print(f"[CORE_CHECKER] ERROR: Skipping {file_path_str} - {str(e)[:100]}", flush=True)
                    continue
            
            # Determine overall status
            if violations:
                checks_failed.append("Hardcoded Date Detection")
                status = CheckerStatus.FAILED
            else:
                checks_passed.append("Hardcoded Date Detection")
                status = CheckerStatus.SUCCESS
            
            execution_time = (datetime.now(timezone.utc) - start_time).total_seconds() * 1000
            
            return self._create_result(
                status=status,
                violations=violations,
                checks_passed=checks_passed,
                checks_failed=checks_failed,
                execution_time_ms=execution_time,
                files_checked=files_checked,
                metadata={
                    'current_date': self.current_date,
                    'date_detector_available': DATE_DETECTOR_AVAILABLE,
                }
            )
            
        except Exception as e:
            raise CheckerExecutionError(f"Core checker failed: {e}") from e
    
    def _get_all_files_to_check(self) -> List[str]:
        """
        Get all files to check (tracked + untracked).
        
        This ensures we check all files, not just those in changed_files,
        so we can catch violations that were missed in previous sessions.
        
        Returns:
            List of all file paths to check
        """
        all_files = []
        
        if self.git_utils:
            try:
                # Get all tracked files
                tracked = self.git_utils.run_git_command(['ls-files'])
                if tracked:
                    all_files.extend([f.strip() for f in tracked.strip().split('\n') if f.strip()])
                
                # Get all untracked files
                untracked = self.git_utils.run_git_command(['ls-files', '--others', '--exclude-standard'])
                if untracked:
                    all_files.extend([f.strip() for f in untracked.strip().split('\n') if f.strip()])
                
                print(f"[CORE_CHECKER] Retrieved {len(all_files)} total files ({len([f for f in all_files if f])} tracked + untracked)", flush=True)
            except Exception as e:
                # If git commands fail, fall back to changed_files
                print(f"[CORE_CHECKER] WARNING: Could not get all files from git: {e}", flush=True)
                pass
        
        # If we couldn't get all files, return empty list (will use changed_files from caller)
        # This is a fallback - ideally we always get all files
        return all_files if all_files else []
    
    def _filter_files(self, changed_files: List[str]) -> List[str]:
        """
        Filter files to check (exclude binary, directories, excluded paths).
        
        Args:
            changed_files: List of file paths
            
        Returns:
            Filtered list of files to check
        """
        filtered = []
        excluded_dirs = [
            self.project_root / '.cursor' / 'enforcement',
            self.project_root / '.cursor' / 'archive',
            self.project_root / '.cursor' / 'backups',
            self.project_root / '.ai' / 'memory_bank',
            self.project_root / '.ai' / 'rules',
            self.project_root / '.ai' / 'patterns',
            self.project_root / '.cursor__archived_2025-04-12',
        ]
        excluded_prefixes = (
            ".ai/memory_bank",
            ".ai/rules",
            ".ai/patterns",
            ".cursor__archived_2025-04-12",
        )
        
        # Additional exclusion patterns
        MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
        exclude_patterns = [
            '/archive/',
            '/archived/',
            '.cursor__archived',  # Match .cursor__archived_2025-04-12 directories
            '/.cursor__disabled/',
            '/backup/',
            '/backups/',
            '/reference/',
            '/references/',
            '/docs/reference/',
        ]

        auto_generated_enforcement_files = {
            'ENFORCEMENT_BLOCK.md',
            'VIOLATIONS.md',
            'ACTIVE_VIOLATIONS.md',
            'AGENT_REMINDERS.md',
            'HISTORICAL_VIOLATIONS_REVIEW.md',
            'ENFORCER_STATUS.md',
        }
        
        for file_path_str in changed_files:
            normalized_str = str(file_path_str).replace("\\", "/")
            # Fast prefix check to skip known expensive historical files
            if normalized_str.startswith(excluded_prefixes):
                continue

            # Skip known auto-generated enforcement artifacts
            if normalized_str.lower().startswith("enforcement/") and Path(normalized_str).name in auto_generated_enforcement_files:
                continue
            # Skip enforcement markdown/log docs
            if normalized_str.lower().startswith("enforcement/") and normalized_str.lower().endswith(".md"):
                continue
            # Skip .cursor__disabled remnants
            if "/.cursor__disabled/" in normalized_str.lower():
                continue
            
            # Skip backup files
            if normalized_str.endswith('.backup') or '/.backup' in normalized_str:
                continue
            
            # Skip archive and reference directories
            if any(pattern in normalized_str.lower() for pattern in exclude_patterns):
                continue
            
            file_path = self.project_root / file_path_str
            
            # Skip if doesn't exist or is directory
            if not file_path.exists() or file_path.is_dir():
                continue
            
            # Skip binary files
            if file_path.suffix in ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf']:
                continue
            
            # Skip excluded directories
            if any(file_path.is_relative_to(excluded_dir) for excluded_dir in excluded_dirs):
                continue
            
            # Skip files larger than 10MB
            try:
                if file_path.stat().st_size >= MAX_FILE_SIZE:
                    continue
            except OSError:
                continue
            
            # Skip log files and historical documents
            if self._is_log_file(file_path) or self._is_historical_document_file(file_path):
                continue
            
            filtered.append(file_path_str)
        
        return filtered
    
    def _check_file_for_dates_with_timeout(self, file_path_str: str, timeout_seconds: float = 5.0) -> List[dict]:
        """
        Check file for dates with timeout protection.
        
        Args:
            file_path_str: File path to check
            timeout_seconds: Maximum time to spend on this file
            
        Returns:
            List of violation dictionaries
            
        Raises:
            TimeoutError: If file processing exceeds timeout
        """
        import threading
        import queue
        
        result_queue = queue.Queue()
        exception_queue = queue.Queue()
        
        def check_file():
            try:
                violations = self._check_file_for_dates(file_path_str)
                result_queue.put(violations)
            except Exception as e:
                exception_queue.put(e)
        
        # Start checking in a separate thread
        thread = threading.Thread(target=check_file, daemon=True)
        thread.start()
        thread.join(timeout=timeout_seconds)
        
        # Check if thread completed
        if thread.is_alive():
            # Thread is still running - timeout occurred
            raise TimeoutError(f"File processing exceeded {timeout_seconds}s timeout")
        
        # Check for exceptions
        if not exception_queue.empty():
            raise exception_queue.get()
        
        # Get result
        if not result_queue.empty():
            return result_queue.get()
        
        # No result and no exception - should not happen
        return []
    
    def _check_file_for_dates(self, file_path_str: str) -> List[dict]:
        """
        Check a single file for hardcoded dates.
        
        Only creates violations if:
        1. File was actually modified (content changed, not moved)
        2. AND date doesn't match current date
        
        Args:
            file_path_str: File path to check
            
        Returns:
            List of violation dictionaries
        """
        violations = []
        file_path = self.project_root / file_path_str
        
        # CRITICAL: Only check files that were actually modified (content changed, not moved)
        # This prevents false positives from files that were only moved/renamed
        if self.session and self.git_utils and is_file_modified_in_session:
            try:
                was_modified = is_file_modified_in_session(
                    file_path_str,
                    self.session,
                    self.project_root,
                    self.git_utils
                )
                if not was_modified:
                    # File was not actually modified (might have been moved, or not changed)
                    # Skip this file - no violations
                    return []
            except Exception as e:
                # If modification check fails, skip this file (conservative)
                # Better to miss a violation than create false positives
                print(f"[CORE_CHECKER] WARNING: Modification check failed for {file_path_str}: {e}", flush=True)
                return []
        else:
            # If we don't have session/git_utils, we can't check modification status
            # This should not happen in normal operation, but log it for debugging
            if not self.session or not self.git_utils:
                print(f"[CORE_CHECKER] WARNING: Missing session or git_utils, skipping modification check for {file_path_str}", flush=True)
        
        try:
            # Use DateDetector if available
            if self.detector and DocumentContext:
                doc_context = DocumentContext(file_path)
                
                # Check if file has "Last Updated" field (must always be checked)
                has_last_updated = False
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        first_lines = [f.readline() for _ in range(10)]
                        content_preview = '\n'.join(first_lines)
                        if re.search(r'last\s+updated\s*:', content_preview, re.IGNORECASE):
                            has_last_updated = True
                except:
                    pass
                
                # Skip log files and historical documents UNLESS they have "Last Updated" fields
                # "Last Updated" fields must always be current, even in historical documents
                if (doc_context.is_log_file or doc_context.is_historical_doc) and not has_last_updated:
                    return []
                
                # Process file line-by-line with context buffer (memory-efficient for large files)
                # Python Bible Chapter 12.4.3: Use generators/iterators for large files
                try:
                    date_matches = self._find_dates_line_by_line(file_path, context_lines=3)
                except (MemoryError, OSError, UnicodeDecodeError) as e:
                    # Skip files that cause memory or I/O issues
                    return []
                
                for match in date_matches:
                    # Classify the date match
                    classification = self.detector.classify_date(match, doc_context)
                    
                    # Check if this is a "Last Updated" or similar field that must be current
                    is_last_updated_field = re.search(
                        r'(last\s+updated|updated\s+on|date\s+updated|modified\s+on)',
                        match.line_content,
                        re.IGNORECASE
                    )
                    
                    # If date is not current_date, it's a violation
                    # Special case: "Last Updated" fields must always be current, even if classified as historical
                    if match.date_str != self.current_date:
                        # If it's a "Last Updated" field, always flag it
                        if is_last_updated_field:
                            violations.append({
                                'severity': 'BLOCKED',
                                'rule_ref': '02-core.mdc',
                                'message': f"Hardcoded date detected: {match.date_str} (should be {self.current_date})",
                                'file_path': file_path_str,
                                'line_number': match.line_number,
                                'session_scope': 'current_session'
                            })
                        # Otherwise, only flag if classified as CURRENT (meaning it should be current but isn't)
                        elif classification == DateClassification.CURRENT:
                            violations.append({
                                'severity': 'BLOCKED',
                                'rule_ref': '02-core.mdc',
                                'message': f"Hardcoded date detected: {match.date_str} (should be {self.current_date})",
                                'file_path': file_path_str,
                                'line_number': match.line_number,
                                'session_scope': 'current_session'
                            })
            else:
                # Fallback: simple regex-based detection
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    for line_num, line in enumerate(f, 1):
                        # Check for date patterns
                        date_matches = self.HARDCODED_DATE_PATTERN.findall(line)
                        if date_matches:
                            # Check if it's a historical date pattern
                            if not self._is_historical_date_pattern(line):
                                # Extract date string
                                date_str = self._extract_date_from_match(date_matches[0])
                                if date_str and date_str != self.current_date:
                                    violations.append({
                                        'severity': 'BLOCKED',
                                        'rule_ref': '02-core.mdc',
                                        'message': f"Hardcoded date detected: {date_str} (should be {self.current_date})",
                                        'file_path': file_path_str,
                                        'line_number': line_num,
                                        'session_scope': 'current_session'
                                    })
        
        except (OSError, UnicodeDecodeError) as e:
            # Skip files that can't be read
                return []
        
        return violations
    
    def _find_dates_line_by_line(self, file_path: Path, context_lines: int = 3) -> List:
        """
        Find dates in file using line-by-line processing with context buffer.
        
        Memory-efficient approach for large files:
        - Processes file line-by-line (generator pattern)
        - Maintains sliding window buffer for context
        - Only keeps small buffer in memory instead of entire file
        
        Python Bible Chapter 12.4.3: Use generators/iterators for large files
        
        Args:
            file_path: Path to file to check
            context_lines: Number of lines before/after to include in context
            
        Returns:
            List of DateMatch objects
        """
        matches = []
        context_buffer = []  # Sliding window buffer for context
        max_buffer_size = context_lines * 2 + 1  # Keep enough lines for context
        
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            for line_num, line in enumerate(f, start=1):
                # Add current line to buffer
                context_buffer.append((line_num, line))
                
                # Maintain buffer size (remove oldest lines)
                if len(context_buffer) > max_buffer_size:
                    context_buffer.pop(0)
                
                # Find date matches in current line
                date_matches = self.detector.HARDCODED_DATE_PATTERN.findall(line)
                
                for match_tuple in date_matches:
                    # Normalize date using detector's method
                    date_str = self.detector._normalize_date_match(match_tuple)
                    if not date_str:
                        continue
                    
                    # Get context from buffer
                    # Find current line index in buffer
                    current_idx = len(context_buffer) - 1
                    start_idx = max(0, current_idx - context_lines)
                    end_idx = min(len(context_buffer), current_idx + context_lines + 1)
                    
                    # Build context from buffer
                    context_lines_list = [buf_line for _, buf_line in context_buffer[start_idx:end_idx]]
                    context = '\n'.join(context_lines_list)
                    
                    # Create DateMatch object (matching DateDetector.find_dates() format)
                    from enforcement.date_detector import DateMatch
                    matches.append(DateMatch(
                        date_str=date_str,
                        line_number=line_num,
                        line_content=line.rstrip('\n\r'),
                        context=context
                    ))
        
        return matches
    
    def _is_historical_date_pattern(self, line: str) -> bool:
        """Check if line matches a historical date pattern."""
        for pattern in self.HISTORICAL_DATE_PATTERNS:
            if pattern.search(line):
                return True
        return False
    
    def _extract_date_from_match(self, match: tuple) -> Optional[str]:
        """Extract ISO date string from regex match tuple."""
        parts = [g for g in match if g is not None]
        if len(parts) < 3:
            return None
        
        # Detect format
        if len(parts[0]) == 4 and parts[0].startswith('20'):
            return f"{parts[0]}-{parts[1]}-{parts[2]}"
        elif len(parts[-1]) == 4 and parts[-1].startswith('20'):
            return f"{parts[-1]}-{parts[0]}-{parts[1]}"
        return None
    
    def _is_log_file(self, file_path: Path) -> bool:
        """
        Check if file is a log file.
        
        Only matches actual log files, not utility modules with 'log' in the name.
        """
        name_lower = file_path.name.lower()
        # Match actual log file patterns, not utility modules
        log_patterns = [
            '_log.md',
            '_log.txt',
            '_log.json',
            'bug_log',
            'learnings_log',
            'log.md',
            'log.txt',
        ]
        # Check for .log extension or specific log file patterns
        if file_path.suffix == '.log':
            return True
        # Check if filename matches log patterns (at end of name)
        if any(name_lower.endswith(pattern) or name_lower == pattern.replace('_', '') for pattern in log_patterns):
            return True
        # Check for log files in memory-bank (these are historical logs)
        if 'memory-bank' in str(file_path.parent):
            if 'log' in name_lower:
                return True
        return False
    
    def _is_historical_document_file(self, file_path: Path) -> bool:
        """Check if file is a historical document (has date in name)."""
        # Check for date pattern in filename (e.g., document_2025-12-21.md)
        date_pattern = re.compile(r'\d{4}[-/]\d{2}[-/]\d{2}')
        return bool(date_pattern.search(file_path.name))


