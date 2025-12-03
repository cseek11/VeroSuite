"""Quick verification that test-violations.service.ts is now checked."""

import sys
from pathlib import Path

# Add parent to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from enforcement.checkers.observability_checker import ObservabilityChecker
import tempfile

def main():
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '07-observability.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Observability"\n---\n')
        
        checker = ObservabilityChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='07-observability.mdc',
            always_apply=False
        )
        
        # Create test-violations.service.ts (should be checked, not skipped)
        test_file = project_root / 'apps' / 'api' / 'src' / 'test-violations' / 'test-violations.service.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('console.log("test");')
        
        result = checker.check(['apps/api/src/test-violations/test-violations.service.ts'])
        
        print(f"Status: {result.status.value}")
        print(f"Violations: {len(result.violations)}")
        print(f"Files checked: {result.files_checked}")
        
        if len(result.violations) > 0:
            print("✅ SUCCESS: test-violations.service.ts is now checked and violations detected!")
            return 0
        else:
            print("❌ FAILED: test-violations.service.ts should have violations but none found")
            return 1

if __name__ == '__main__':
    sys.exit(main())




