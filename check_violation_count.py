#!/usr/bin/env python3
"""Check why violation count increased."""

import json
from pathlib import Path

# Check session state
session_file = Path('.cursor/enforcement/session.json')
if session_file.exists():
    with open(session_file, 'r', encoding='utf-8') as f:
        session = json.load(f)
    
    print("=== Session State ===")
    print(f"Session violations: {len(session.get('violations', []))}")
    print(f"Session start: {session.get('start_time', 'N/A')}")
    print(f"File hashes count: {len(session.get('file_hashes', {}))}")
    print(f"Session version: {session.get('version', 'N/A')}")
    print()

# Check report
report_file = Path('.cursor/enforcement/ENFORCER_REPORT.json')
if report_file.exists():
    with open(report_file, 'r', encoding='utf-8') as f:
        report = json.load(f)
    
    print("=== Report State ===")
    violations = report.get('violations', [])
    print(f"Total violations in report: {len(violations)}")
    
    date_violations = [v for v in violations if '02-core' in v.get('rule_ref', '')]
    print(f"Date violations: {len(date_violations)}")
    
    current_session = [v for v in date_violations if v.get('session_scope') == 'current_session']
    historical = [v for v in date_violations if v.get('session_scope') == 'historical']
    print(f"  Current session: {len(current_session)}")
    print(f"  Historical: {len(historical)}")
    print()
    
    # Check file modification status
    print("=== File Status Check (sample of 20) ===")
    import subprocess
    for v in date_violations[:20]:
        file_path = v['file']
        try:
            result = subprocess.run(
                ['git', 'status', '--porcelain', file_path],
                capture_output=True,
                text=True,
                timeout=2
            )
            git_status = result.stdout.strip()[:2] if result.stdout.strip() else "clean"
        except:
            git_status = "error"
        
        print(f"{file_path}: {git_status}")









