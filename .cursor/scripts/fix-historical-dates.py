#!/usr/bin/env python3
"""
Fix all historical date violations by updating them to current date.
This script updates hardcoded dates and "Last Updated" fields to the current system date.
"""

import json
import re
from datetime import datetime
from pathlib import Path
from collections import defaultdict

# Current system date
CURRENT_DATE = datetime.now().strftime("%Y-%m-%d")

def extract_date_from_message(message: str) -> str | None:
    """Extract date from violation message."""
    # Pattern: "Hardcoded date found: 2025-11-28 (current date: 2025-11-30)"
    match = re.search(r'(\d{4}-\d{2}-\d{2})', message)
    if match:
        return match.group(1)
    return None

def update_file_dates(file_path: str, violations: list) -> tuple[int, int]:
    """
    Update dates in a file based on violations.
    Returns: (dates_updated, lines_updated)
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return (0, 0)
    
    dates_updated = 0
    lines_updated = 0
    line_numbers_to_update = {}
    
    # Collect all line numbers that need updating
    for v in violations:
        line_num = v.get('line_number', v.get('line', None))
        if line_num and isinstance(line_num, (int, str)):
            try:
                line_idx = int(line_num) - 1  # Convert to 0-based index
                if 0 <= line_idx < len(lines):
                    message = v.get('message', '')
                    
                    # Check if it's a "Last Updated" field issue
                    if "'Last Updated'" in message or '"Last Updated"' in message:
                        # Extract the old date from message
                        old_date_match = re.search(r'(\d{4}-\d{2}-\d{2})', message)
                        if old_date_match:
                            old_date = old_date_match.group(1)
                            line_numbers_to_update[line_idx] = ('last_updated', old_date)
                    else:
                        # Regular hardcoded date
                        old_date = extract_date_from_message(message)
                        if old_date:
                            line_numbers_to_update[line_idx] = ('hardcoded', old_date)
            except (ValueError, TypeError):
                continue
    
    # Update lines
    for line_idx, (update_type, old_date) in line_numbers_to_update.items():
        original_line = lines[line_idx]
        updated_line = original_line
        
        # Replace old date with current date
        # Handle various date formats in the line
        date_patterns = [
            (rf'\b{re.escape(old_date)}\b', CURRENT_DATE),  # Exact match
            (rf'{re.escape(old_date)}', CURRENT_DATE),  # Partial match
        ]
        
        for pattern, replacement in date_patterns:
            if re.search(pattern, updated_line):
                updated_line = re.sub(pattern, replacement, updated_line)
                if updated_line != original_line:
                    lines[line_idx] = updated_line
                    dates_updated += 1
                    lines_updated += 1
                    break
    
    # Write updated file
    if lines_updated > 0:
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.writelines(lines)
            return (dates_updated, lines_updated)
        except Exception as e:
            print(f"Error writing {file_path}: {e}")
            return (0, 0)
    
    return (0, 0)

def main():
    """Main function to fix all historical date violations."""
    session_file = Path('.cursor/enforcement/session.json')
    
    if not session_file.exists():
        print("Error: session.json not found")
        return
    
    with open(session_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Filter for historical BLOCKED violations in modified files
    historical_blocked = [
        v for v in data.get('violations', [])
        if v.get('severity') == 'BLOCKED' 
        and v.get('session_scope') == 'historical'
        and ('modified line' in v.get('message', '') or 'Last Updated' in v.get('message', ''))
    ]
    
    # Group by file
    by_file = defaultdict(list)
    for v in historical_blocked:
        file_path = v.get('file_path', v.get('file', None))
        if file_path:
            by_file[file_path].append(v)
    
    print(f"# Fixing Historical Date Violations\n")
    print(f"**Current Date:** {CURRENT_DATE}\n")
    print(f"**Total Violations:** {len(historical_blocked)}\n")
    print(f"**Total Files:** {len(by_file)}\n")
    print("---\n")
    
    total_dates_updated = 0
    total_files_updated = 0
    
    # Process each file
    for file_path, violations in sorted(by_file.items()):
        print(f"Processing: {file_path} ({len(violations)} violations)...")
        
        dates_updated, lines_updated = update_file_dates(file_path, violations)
        
        if lines_updated > 0:
            total_dates_updated += dates_updated
            total_files_updated += 1
            print(f"  ✓ Updated {dates_updated} date(s) in {lines_updated} line(s)")
        else:
            print(f"  ⚠ No updates made (dates may already be current or pattern didn't match)")
    
    print("\n---\n")
    print(f"**Summary:**\n")
    print(f"- Files Updated: {total_files_updated}/{len(by_file)}\n")
    print(f"- Total Dates Updated: {total_dates_updated}\n")
    print(f"\n**Next Step:** Run enforcement check to verify all violations are resolved.\n")

if __name__ == '__main__':
    main()

















