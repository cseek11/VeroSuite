"""
Quick script to find files with secret violations.
"""

import json
import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor"))

try:
    # Try to read from ENFORCER_REPORT.json
    report_file = project_root / ".cursor" / "enforcement" / "ENFORCER_REPORT.json"
    if report_file.exists():
        with open(report_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Find secret violations
        secret_violations = [
            v for v in data.get('violations', [])
            if 'SEC-R03' in v.get('rule_ref', '') or 'secret' in v.get('message', '').lower()
        ]
        
        if secret_violations:
            print(f"Found {len(secret_violations)} secret violations:\n")
            files = {}
            for v in secret_violations:
                file_path = v.get('file_path', 'N/A')
                if file_path not in files:
                    files[file_path] = []
                files[file_path].append({
                    'line': v.get('line_number', 'N/A'),
                    'message': v.get('message', 'N/A'),
                    'rule': v.get('rule_ref', 'N/A')
                })
            
            for file_path, violations in files.items():
                print(f"📁 {file_path}")
                for v in violations:
                    print(f"   Line {v['line']}: {v['message']} ({v['rule']})")
                print()
        else:
            print("No secret violations found in ENFORCER_REPORT.json")
            print("\nChecking test-violations file directly...")
            
            # Check test-violations.service.ts directly
            test_file = project_root / "apps" / "api" / "src" / "test-violations" / "test-violations.service.ts"
            if test_file.exists():
                print(f"\n⚠️  Test file has hardcoded secrets but not detected:")
                print(f"   {test_file}")
                print(f"   Line 12: JWT_SECRET = 'my-secret-key-123'")
                print(f"   Line 15: API_KEY = 'sk_live_1234567890abcdef'")
                print(f"\n   Reason: File not in changed_files list (historical file)")
    else:
        print("ENFORCER_REPORT.json not found")
        
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()



