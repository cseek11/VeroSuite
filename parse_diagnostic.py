#!/usr/bin/env python3
"""Parse diagnostic output from enforcer logs."""
import json
from collections import Counter

# Read the output file
with open('enforcer_output.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

diagnostic_entries = []
legitimacy_summaries = []

for line in lines:
    line = line.strip()
    if not line:
        continue
    try:
        data = json.loads(line)
        message = data.get('message', '')
        operation = data.get('operation', '')
        
        # Look for diagnostic entries
        if 'Violation diagnostic' in message or 'violation_type' in data:
            diagnostic_entries.append(data)
        
        # Look for summary entries
        if 'Violation legitimacy summary' in message:
            legitimacy_summaries.append(data)
        
        # Also check for the diagnostic start message
        if 'Diagnosing legitimacy' in message or 'Running violation legitimacy' in message:
            print(f"Found diagnostic start: {message}")
            print(f"  Context: {data.get('context', 'N/A')}")
            print(f"  Sample size: {data.get('sample_size', 'N/A')}")
    except json.JSONDecodeError:
        continue

print(f"\n=== Diagnostic Entries Found: {len(diagnostic_entries)} ===")
if diagnostic_entries:
    violation_types = Counter()
    for entry in diagnostic_entries:
        vtype = entry.get('violation_type', 'UNKNOWN')
        violation_types[vtype] += 1
        if len(diagnostic_entries) <= 10:
            print(f"\nViolation: {entry.get('file', 'N/A')}:{entry.get('line_number', 'N/A')}")
            print(f"  Type: {vtype}")
            print(f"  Was modified: {entry.get('was_modified', 'N/A')}")
            print(f"  Line changed: {entry.get('line_changed', 'N/A')}")
            print(f"  Git status: {entry.get('git_status', 'N/A')}")
    
    print(f"\n=== Violation Type Distribution ===")
    for vtype, count in violation_types.items():
        percentage = count / len(diagnostic_entries) * 100
        print(f"  {vtype}: {count} ({percentage:.1f}%)")
else:
    print("No diagnostic entries found!")
    print("\nSearching for any date_checker related messages...")
    for line in lines[:100]:
        if 'date_checker' in line.lower() or 'check_hardcoded_dates' in line.lower():
            try:
                data = json.loads(line.strip())
                print(f"  {data.get('message', '')[:100]}")
            except:
                pass

print(f"\n=== Legitimacy Summaries Found: {len(legitimacy_summaries)} ===")
for summary in legitimacy_summaries:
    print(f"  Distribution: {summary.get('distribution', {})}")
    print(f"  Percentages: {summary.get('percentages', {})}")










