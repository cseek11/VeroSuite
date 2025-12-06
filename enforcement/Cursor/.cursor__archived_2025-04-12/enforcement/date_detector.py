#!/usr/bin/env python3
"""
Date Detection Module for VeroField Auto-Enforcer

Phase 3: Complete DateDetector class with full classification logic.

Last Updated: 2025-12-04
"""

import re
from pathlib import Path
from typing import Optional, List, Tuple
from dataclasses import dataclass
from enum import Enum
from datetime import datetime


class DocumentContext:
    """
    Document context detection for date validation.
    
    Phase 2: Expanded with title date extraction and historical markers detection.
    Phase 3: Will integrate with full DateDetector class.
    """
    
    def __init__(self, file_path: Path):
        """
        Initialize document context.
        
        Args:
            file_path: Path to the document file
        """
        self.file_path = file_path
        self.is_log_file = self._detect_log_file()
        self.title_date = self._extract_title_date()  # Phase 2: Extract date from title
        self.historical_markers = self._detect_historical_markers()  # Phase 2: Detect markers
        self.is_historical_doc = self._detect_historical_doc()
    
    def _detect_log_file(self) -> bool:
        """
        Check if a file is a log/learning file where historical dates should be preserved.
        
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
        if "memory-bank" in str(self.file_path):
            return True
        
        return self.file_path.name in log_file_names or self.file_path.name in memory_bank_files
    
    def _detect_historical_doc(self) -> bool:
        """
        Check if a file is a historical document (e.g., document_2026-12-21.md).
        
        Files with dates in their names are typically historical documents
        where dates should be preserved as historical records.
        
        Returns:
            True if the file appears to be a historical document, False otherwise
        """
        # Check for historical documentation directories (e.g., docs/Auto-PR/)
        file_path_str = str(self.file_path).replace("\\", "/").lower()
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
        
        file_name = self.file_path.name.lower()
        
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
        
        # Check first 10 lines for historical markers (now uses _detect_historical_markers)
        if self.historical_markers:
            return True
        
        return False
    
    def _extract_title_date(self) -> Optional[str]:
        """
        Extract date from document title (first 10 lines).
        
        Phase 2: Scans document header for dates in titles (e.g., "# Document - December 21, 2026").
        
        Returns:
            Date string in YYYY-MM-DD format if found, None otherwise
        """
        if not self.file_path.exists():
            return None
        
        try:
            with open(self.file_path, 'r', encoding='utf-8', errors='ignore') as f:
                # Read first 10 lines
                lines = [next(f, '') for _ in range(10)]
                header = '\n'.join(lines)
                
                # Look for dates in title/header (common patterns)
                # Only match dates in lines that start with # (headers)
                # Process line by line to ensure we only match header lines
                for line in lines:
                    line = line.strip()
                    if not line.startswith('#'):
                        continue  # Skip non-header lines
                    
                    # Check for dates in this header line
                    title_date_patterns = [
                        # "# Document - December 21, 2026" or "# Document: December 21, 2026"
                        r'[-:]?\s+([A-Za-z]+\s+\d{1,2},?\s+\d{4})',
                        # "# Document - 2025-12-04"
                        r'[-:]?\s+(\d{4}-\d{2}-\d{2})',
                        # "# Document - 12/21/2026"
                        r'[-:]?\s+(\d{1,2}/\d{1,2}/\d{4})',
                    ]
                    
                    for pattern in title_date_patterns:
                        match = re.search(pattern, line, re.IGNORECASE)
                        if match:
                            date_str = match.group(1)
                            # Try to normalize to YYYY-MM-DD
                            normalized = self._normalize_date_string(date_str)
                            if normalized:
                                return normalized
        except (OSError, FileNotFoundError, PermissionError, UnicodeDecodeError):
            pass
        
        return None
    
    def _normalize_date_string(self, date_str: str) -> Optional[str]:
        """
        Normalize various date formats to YYYY-MM-DD.
        
        Args:
            date_str: Date string in various formats
            
        Returns:
            Normalized date string (YYYY-MM-DD) or None if parsing fails
        """
        from datetime import datetime
        
        # Try common formats
        formats = [
            '%Y-%m-%d',           # 2025-12-04
            '%m/%d/%Y',           # 12/21/2026
            '%B %d, %Y',          # December 21, 2026
            '%b %d, %Y',          # Dec 21, 2026
            '%d %B %Y',           # 21 December 2026
            '%d %b %Y',           # 21 Dec 2026
        ]
        
        for fmt in formats:
            try:
                dt = datetime.strptime(date_str.strip(), fmt)
                return dt.strftime('%Y-%m-%d')
            except ValueError:
                continue
        
        return None
    
    def _detect_historical_markers(self) -> bool:
        """
        Detect historical markers in document header.
        
        Phase 2: Enhanced detection of historical document markers.
        
        Returns:
            True if historical markers are found, False otherwise
        """
        if not self.file_path.exists():
            return False
        
        try:
            with open(self.file_path, 'r', encoding='utf-8', errors='ignore') as f:
                # Read first 15 lines (expanded from 10 for better coverage)
                lines = [next(f, '') for _ in range(15)]
                header = '\n'.join(lines).lower()
                
                # Enhanced historical markers (Phase 2)
                historical_marker_patterns = [
                    r'dated\s+',
                    r'information\s+dated',
                    r'report\s+generated',
                    r'document.*\d{4}',
                    r'date\s+set\s+per\s+user\s+request',
                    r'system\s+date:',
                    r'historical\s+document',
                    r'archived\s+on',
                    r'created\s+on\s+\d{4}',  # "Created on 2026"
                    r'last\s+updated:\s+\d{4}-\d{2}-\d{2}',  # Historical "Last Updated" with old date
                ]
                
                for pattern in historical_marker_patterns:
                    if re.search(pattern, header, re.IGNORECASE):
                        return True
        except (OSError, FileNotFoundError, PermissionError, UnicodeDecodeError):
            pass
        
        return False


class DateClassification(Enum):
    """Classification of a detected date."""
    CURRENT = "current"  # Current date (should be updated)
    HISTORICAL = "historical"  # Historical date (should be preserved)
    EXAMPLE = "example"  # Example date in code/documentation (should be preserved)
    UNKNOWN = "unknown"  # Cannot determine classification


@dataclass
class DateMatch:
    """
    Represents a detected date in a document.
    
    Attributes:
        date_str: Normalized date string (YYYY-MM-DD)
        line_number: Line number where date was found (1-indexed)
        line_content: Full content of the line
        context: Surrounding context (3 lines before + 3 lines after)
    """
    date_str: str
    line_number: int
    line_content: str
    context: str = ""


class DateDetector:
    """
    Complete date detection and classification system.
    
    Phase 3: Full implementation with find_dates() and classify_date() methods.
    """
    
    # Pre-compiled regex patterns for performance
    HARDCODED_DATE_PATTERN = re.compile(
        r'\b(20\d{2})[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])\b|'  # YYYY-MM-DD or YYYY/MM/DD
        r'\b(0[1-9]|1[0-2])[/-](0[1-9]|[12]\d|3[01])[/-](20\d{2})\b'   # MM/DD/YYYY or MM-DD-YYYY
    )
    
    # Consolidated historical date patterns (5 patterns)
    HISTORICAL_DATE_PATTERNS = [
        re.compile(r'(entry|log|note|memo)\s*#?\d*\s*[-–:]', re.IGNORECASE),
        re.compile(r'(completed|resolved|fixed|closed)\s*[:\(]', re.IGNORECASE),
        re.compile(r'\*\*(date|created|updated|generated|report)[:*]', re.IGNORECASE),
        re.compile(r'(`[^`]*\d{4}[^`]*`|\w+\([^)]*\d{4})', re.IGNORECASE),
        re.compile(r'^#{1,6}\s+.*\d{4}', re.IGNORECASE | re.MULTILINE),
    ]
    
    def __init__(self, current_date: Optional[str] = None):
        """
        Initialize DateDetector.
        
        Args:
            current_date: Current date in YYYY-MM-DD format. If None, uses today's date.
        """
        if current_date is None:
            self.current_date = datetime.now().strftime("%Y-%m-%d")
        else:
            self.current_date = current_date
    
    def find_dates(self, text: str, context_lines: int = 3) -> List[DateMatch]:
        """
        Find all dates in text with context.
        
        Args:
            text: Text to search for dates
            context_lines: Number of lines before/after to include in context
            
        Returns:
            List of DateMatch objects
        """
        matches = []
        lines = text.split('\n')
        
        for line_num, line in enumerate(lines, start=1):
            # Find all date matches in this line
            date_matches = self.HARDCODED_DATE_PATTERN.findall(line)
            
            for match in date_matches:
                # Normalize date
                date_str = self._normalize_date_match(match)
                if not date_str:
                    continue
                
                # Get context (surrounding lines)
                start_line = max(0, line_num - context_lines - 1)
                end_line = min(len(lines), line_num + context_lines)
                context = '\n'.join(lines[start_line:end_line])
                
                matches.append(DateMatch(
                    date_str=date_str,
                    line_number=line_num,
                    line_content=line,
                    context=context
                ))
        
        return matches
    
    def classify_date(self, date_match: DateMatch, doc_context: DocumentContext) -> DateClassification:
        """
        Classify a date match based on context and document type.
        
        Args:
            date_match: DateMatch object to classify
            doc_context: DocumentContext for the file
            
        Returns:
            DateClassification enum value
        """
        # If document is historical or log file, all dates are historical
        if doc_context.is_historical_doc or doc_context.is_log_file:
            return DateClassification.HISTORICAL
        
        # Check if date is in code block (example code)
        if self._is_in_code_block(date_match.line_content, date_match.context):
            return DateClassification.EXAMPLE
        
        # Check if date is current date FIRST (takes precedence over historical patterns)
        # This ensures current dates are correctly identified even if they match patterns
        if date_match.date_str == self.current_date:
            return DateClassification.CURRENT
        
        # Check if date matches historical pattern
        if self._is_historical_date_pattern(date_match.line_content, date_match.context):
            return DateClassification.HISTORICAL
        
        # Check if date is far in past or future (likely historical or example)
        if self._is_far_past_or_future(date_match.date_str):
            return DateClassification.HISTORICAL
        
        # Default: assume current date that needs updating
        return DateClassification.CURRENT
    
    def _normalize_date_match(self, match: tuple) -> str:
        """
        Normalize date match groups to ISO format (YYYY-MM-DD).
        
        Args:
            match: Tuple from regex.findall() with potential None values
            
        Returns:
            ISO format date string (YYYY-MM-DD) or empty string if invalid
        """
        # Filter out None values and empty strings
        parts = [g for g in match if g is not None and g != '']
        
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
            # Fallback: try to detect format by checking which part is year
            for i, part in enumerate(parts):
                if len(part) == 4 and part.startswith('20'):
                    if i == 0:
                        return f"{parts[0]}-{parts[1]}-{parts[2]}"
                    elif i == 2:
                        return f"{parts[2]}-{parts[0]}-{parts[1]}"
            # Last resort: join first 3 parts
            return '-'.join(parts[:3])
    
    def _is_in_code_block(self, line: str, context: str) -> bool:
        """
        Check if date is inside a code block.
        
        Args:
            line: Line containing the date
            context: Surrounding context
            
        Returns:
            True if date is in code block, False otherwise
        """
        # Check for backticks (markdown code blocks)
        if '`' in line:
            return True
        
        # Check if line is indented (likely code)
        if line.strip() and line[0] in [' ', '\t']:
            return True
        
        # Check context for code block markers
        lines_before = context.split('\n')[:3]
        code_block_open = False
        for ctx_line in lines_before:
            if '```' in ctx_line:
                code_block_open = not code_block_open
            if code_block_open:
                return True
        
        return False
    
    def _is_historical_date_pattern(self, line: str, context: str = '') -> bool:
        """
        Check if line contains historical date pattern.
        
        Args:
            line: Current line to check
            context: Surrounding lines for context
            
        Returns:
            True if historical pattern found, False otherwise
        """
        # Quick check: Does line contain a date?
        if not self.HARDCODED_DATE_PATTERN.search(line):
            return False
        
        # Check consolidated patterns
        for pattern in self.HISTORICAL_DATE_PATTERNS:
            if pattern.search(line):
                return True
        
        # Check context if provided
        if context:
            for pattern in self.HISTORICAL_DATE_PATTERNS:
                if pattern.search(context):
                    return True
        
        return False
    
    def _is_far_past_or_future(self, date_str: str) -> bool:
        """
        Check if date is far in past (>1 year) or future (>1 day).
        
        Args:
            date_str: Date string in YYYY-MM-DD format
            
        Returns:
            True if date is far past/future, False otherwise
        """
        try:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
            current_date_obj = datetime.strptime(self.current_date, "%Y-%m-%d").date()
            days_diff = (date_obj - current_date_obj).days
            
            # More than 1 day in future or more than 365 days in past
            return days_diff > 1 or days_diff < -365
        except (ValueError, TypeError):
            return False

