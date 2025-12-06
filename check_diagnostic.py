#!/usr/bin/env python3
"""Check if diagnostic is running."""
import json
import sys

# Read the output file
try:
    with open('full_output.txt', 'r', encoding='utf-8') as f:
        lines = f.readlines()
except FileNotFoundError:
    print("full_output.txt not found. Run enforcer first.")
    sys.exit(1)

date_checker_msgs = []
diagnostic_msgs = []

for line in lines:
    line = line.strip()
    if not line:
        continue
    try:
        data = json.loads(line)
        message = data.get('message', '')
        operation = data.get('operation', '')
        
        if 'date_checker' in operation.lower() or 'check_hardcoded_dates' in operation.lower():
            date_checker_msgs.append(data)
        
        if 'diagnostic' in message.lower() or 'legitimacy' in message.lower() or 'violation_type' in data:
            diagnostic_msgs.append(data)
    except json.JSONDecodeError:
        # Skip non-JSON lines
        if '[DIAGNOSTIC]' in line or 'Preparing to run' in line or 'Date checker' in line:
            print(f"Non-JSON line: {line[:100]}")

print(f"\n=== Date Checker Messages: {len(date_checker_msgs)} ===")
for msg in date_checker_msgs[:15]:
    print(f"  {msg.get('message', '')[:100]}")
    if 'total_violations' in msg or 'filtered_violations' in msg:
        print(f"    total_violations: {msg.get('total_violations', 'N/A')}")
        print(f"    filtered_violations: {msg.get('filtered_violations', 'N/A')}")

print(f"\n=== Diagnostic Messages: {len(diagnostic_msgs)} ===")
for msg in diagnostic_msgs[:15]:
    print(f"  {msg.get('message', '')[:100]}")
    if 'violation_type' in msg:
        print(f"    violation_type: {msg.get('violation_type', 'N/A')}")

# Check for "Date checker completed" message
completed_msgs = [m for m in date_checker_msgs if 'completed' in m.get('message', '').lower()]
print(f"\n=== Date Checker Completed Messages: {len(completed_msgs)} ===")
for msg in completed_msgs:
    print(f"  Total violations: {msg.get('total_violations', 'N/A')}")
    print(f"  Filtered violations: {msg.get('filtered_violations', 'N/A')}")
    print(f"  Filtered out: {msg.get('filtered_out', 'N/A')}")










