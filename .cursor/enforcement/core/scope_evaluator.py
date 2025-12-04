import re
from pathlib import Path
from typing import Any

HISTORICAL_DOCUMENT_DIR_PATTERNS = (
    "docs/auto-pr/",
    "docs/archive/",
    "docs/historical/",
)


def is_historical_dir_path(path_value: Any) -> bool:
    """
    Determine if a path belongs to a known historical document directory.
    
    Accepts Path objects or strings, normalizes separators/case, and checks for
    any configured historical directory pattern.
    """
    if not path_value:
        return False
    
    normalized = str(path_value).replace("\\", "/").lower()
    return any(pattern in normalized for pattern in HISTORICAL_DOCUMENT_DIR_PATTERNS)


def is_historical_document_file(file_path: Path) -> bool:
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
    if is_historical_dir_path(file_path):
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


def is_log_file(file_path: Path) -> bool:
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


def is_documentation_file(file_path: Path) -> bool:
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
    for pattern in doc_patterns:
        if re.search(pattern, file_path.name.lower()):
            return True
    
    return False

