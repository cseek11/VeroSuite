#!/usr/bin/env python3
"""Check for unclosed code fences in markdown files."""

import sys
import importlib.util
from pathlib import Path

# Import structured logger
_project_root = Path(__file__).parent.parent.parent.parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

logger_util_path = _project_root / ".cursor" / "scripts" / "logger_util.py"
if logger_util_path.exists():
    spec = importlib.util.spec_from_file_location("logger_util", logger_util_path)
    logger_util = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(logger_util)
    get_logger = logger_util.get_logger
    logger = get_logger("check_code_fences")
else:
    logger = None

def check_code_fences(file_path: Path) -> tuple[bool, list]:
    """Check if all code fences are properly closed."""
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    issues = []
    in_code = False
    code_start_line = None
    code_type = None
    
    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        
        # Check for closing fence (must be exactly ``` and we must be in a code block)
        if stripped == '```':
            if in_code:
                in_code = False
                code_start_line = None
                code_type = None
            else:
                # If we're not in a code block, this is an opening fence for a plain code block
                in_code = True
                code_start_line = i
                code_type = 'plain'
        
        # Check for opening fence with language (starts with ``` and has language)
        elif stripped.startswith('```') and len(stripped) > 3 and stripped[3:].strip():
            if in_code:
                issues.append(f"Line {i}: Opening fence found while already in code block (started at line {code_start_line})")
            else:
                in_code = True
                code_start_line = i
                code_type = stripped[3:].strip()
    
    # Check if we ended in a code block
    if in_code:
        issues.append(f"Line {code_start_line}: Unclosed code fence (type: {code_type})")
    
    return len(issues) == 0, issues

if __name__ == '__main__':
    if len(sys.argv) < 2:
        if logger:
            logger.error(
                "Invalid usage",
                operation="main",
                error_code="INVALID_USAGE",
                root_cause="Missing required file_path argument",
                usage="python check_code_fences.py <file_path>"
            )
        sys.exit(1)
    
    file_path = Path(sys.argv[1])
    if not file_path.exists():
        if logger:
            logger.error(
                "File not found",
                operation="main",
                error_code="FILE_NOT_FOUND",
                root_cause=f"File does not exist: {file_path}",
                file_path=str(file_path)
            )
        sys.exit(1)
    
    is_valid, issues = check_code_fences(file_path)
    
    if is_valid:
        if logger:
            logger.info(
                "All code fences are properly closed",
                operation="check_code_fences",
                file_path=str(file_path)
            )
        sys.exit(0)
    else:
        if logger:
            logger.error(
                "Found unclosed code fences",
                operation="check_code_fences",
                error_code="UNCLOSED_FENCES",
                root_cause=f"Found {len(issues)} unclosed code fences",
                file_path=str(file_path),
                issues=issues
            )
        sys.exit(1)

