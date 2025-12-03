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
from .exceptions import CheckerExecutionError

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
    
    def check(self, changed_files: List[str], user_message: Optional[str] = None) -> CheckerResult:
        """
        Execute core checks (hardcoded date detection).
        
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
            
            # Check each file for hardcoded dates
            for file_path_str in files_to_check:
                file_violations = self._check_file_for_dates(file_path_str)
                violations.extend(file_violations)
            
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
        ]
        
        for file_path_str in changed_files:
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
            
            # Skip log files and historical documents
            if self._is_log_file(file_path) or self._is_historical_document_file(file_path):
                continue
            
            filtered.append(file_path_str)
        
        return filtered
    
    def _check_file_for_dates(self, file_path_str: str) -> List[dict]:
        """
        Check a single file for hardcoded dates.
        
        Args:
            file_path_str: File path to check
            
        Returns:
            List of violation dictionaries
        """
        violations = []
        file_path = self.project_root / file_path_str
        
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
                
                # Read file and detect dates
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    file_content = f.read()
                
                date_matches = self.detector.find_dates(file_content, context_lines=3)
                
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
            pass
        
        return violations
    
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


