#!/usr/bin/env python3
"""Test date detection on logger_util.py"""

import sys
from pathlib import Path

project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor"))

from enforcement.date_detector import DateDetector, DocumentContext, DateClassification
from datetime import datetime

# Read the file
file_path = project_root / ".cursor" / "scripts" / "logger_util.py"
content = file_path.read_text(encoding='utf-8')

print("=" * 60)
print("Testing Date Detection on logger_util.py")
print("=" * 60)
print(f"\nCurrent date: {datetime.now().strftime('%Y-%m-%d')}")
print(f"File: {file_path}")

# Create detector
detector = DateDetector(current_date=datetime.now().strftime('%Y-%m-%d'))
doc_context = DocumentContext(file_path)

print(f"\nDocument context:")
print(f"  is_log_file: {doc_context.is_log_file}")
print(f"  is_historical_doc: {doc_context.is_historical_doc}")

# Find dates
matches = detector.find_dates(content, context_lines=3)
print(f"\nDate matches found: {len(matches)}")

for match in matches:
    print(f"\nMatch:")
    print(f"  Date: {match.date_str}")
    print(f"  Line: {match.line_number}")
    print(f"  Content: {match.line_content.strip()}")
    
    # Classify
    classification = detector.classify_date(match, doc_context)
    print(f"  Classification: {classification.value}")
    
    # Check if it's a "Last Updated" field
    import re
    is_last_updated = bool(re.search(
        r'(last\s+updated|updated\s+on|date\s+updated|modified\s+on)',
        match.line_content,
        re.IGNORECASE
    ))
    print(f"  Is 'Last Updated' field: {is_last_updated}")
    print(f"  Should be current: {match.date_str == detector.current_date}")
    print(f"  Would be violation: {match.date_str != detector.current_date and (is_last_updated or classification == DateClassification.CURRENT)}")


