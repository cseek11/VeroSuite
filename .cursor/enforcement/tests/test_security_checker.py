"""
Tests for SecurityChecker.

Tests verify that:
- SecurityChecker monitors security-sensitive files
- SecurityChecker does NOT overlap with TenantIsolationChecker
- SecurityChecker uses Violation dataclass correctly
"""

import sys
import tempfile
import json
from pathlib import Path

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from enforcement.checkers.security_checker import SecurityChecker
from enforcement.checkers.tenant_isolation_checker import TenantIsolationChecker


def test_security_checker_no_violations():
    """
    Test that SecurityChecker does not create violations for normal files.
    
    Since SecurityChecker is now a monitoring tool (not an enforcement tool),
    it should not create violations for regular code files.
    """
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '03-security.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Security"\n---\n')
        
        checker = SecurityChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='03-security.mdc',
            always_apply=False
        )
        
        # Create a regular backend file
        test_file = project_root / 'apps' / 'api' / 'src' / 'test.service.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
export class TestService {
  async findAll() {
    return [];
  }
}
''')
        
        result = checker.check(['apps/api/src/test.service.ts'])
        
        # Should not have violations (SecurityChecker is monitoring-only)
        assert result.status.value == 'success'
        assert len(result.violations) == 0


def test_security_checker_tracks_security_files():
    """
    Test that SecurityChecker tracks modifications to security-sensitive files.
    """
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '03-security.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Security"\n---\n')
        
        # Create security-sensitive file
        security_file = project_root / 'libs' / 'common' / 'prisma' / 'schema.prisma'
        security_file.parent.mkdir(parents=True, exist_ok=True)
        security_file.write_text('model User { id Int @id }')
        
        checker = SecurityChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='03-security.mdc',
            always_apply=False
        )
        
        result = checker.check(['libs/common/prisma/schema.prisma'])
        
        # Should track the security file modification
        assert result.status.value == 'success'
        assert result.metadata.get('security_files_modified') == 1
        assert 'schema.prisma' in result.metadata.get('security_files_list', [])[0]


def test_security_checker_no_tenant_isolation_overlap():
    """
    Test that SecurityChecker does NOT overlap with TenantIsolationChecker.
    
    This test verifies that SecurityChecker does not flag tenant isolation issues,
    which are the exclusive domain of TenantIsolationChecker.
    """
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        
        # Setup SecurityChecker
        security_rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '03-security.mdc'
        security_rule_file.parent.mkdir(parents=True, exist_ok=True)
        security_rule_file.write_text('---\ndescription: "Security"\n---\n')
        
        security_checker = SecurityChecker(
            project_root=project_root,
            rule_file=security_rule_file,
            rule_ref='03-security.mdc',
            always_apply=False
        )
        
        # Setup TenantIsolationChecker
        tenant_tables_file = project_root / '.cursor' / 'enforcement' / 'tenant_tables.json'
        tenant_tables_file.parent.mkdir(parents=True, exist_ok=True)
        tenant_tables_file.write_text(json.dumps({
            'tenant_scoped_tables': ['customer', 'order']
        }))
        
        tenant_rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '03-security-tenant.mdc'
        tenant_rule_file.parent.mkdir(parents=True, exist_ok=True)
        tenant_rule_file.write_text('---\ndescription: "Tenant isolation"\n---\n')
        
        tenant_checker = TenantIsolationChecker(
            project_root=project_root,
            rule_file=tenant_rule_file,
            rule_ref='03-security-tenant.mdc',
            always_apply=False
        )
        
        # Create a file with a Prisma query missing tenant_id filter
        # This should be caught by TenantIsolationChecker, NOT SecurityChecker
        test_file = project_root / 'apps' / 'api' / 'src' / 'test.service.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { PrismaService } from '@verofield/common/prisma';

export class TestService {
  constructor(private prisma: PrismaService) {}
  
  async findAll() {
    return this.prisma.customer.findMany({
      where: {
        status: 'active'
      }
    });
  }
}
''')
        
        # SecurityChecker should NOT flag this
        security_result = security_checker.check(['apps/api/src/test.service.ts'])
        assert security_result.status.value == 'success'
        assert len(security_result.violations) == 0, \
            "SecurityChecker should not flag tenant isolation issues"
        
        # TenantIsolationChecker SHOULD flag this
        tenant_result = tenant_checker.check(['apps/api/src/test.service.ts'])
        assert tenant_result.status.value == 'failed'
        assert len(tenant_result.violations) > 0, \
            "TenantIsolationChecker should flag missing tenant_id filter"
        assert any('SEC-R01-001' in v.get('rule_ref', '') for v in tenant_result.violations), \
            "TenantIsolationChecker should use SEC-R01-001 rule_ref"


def test_security_checker_uses_violation_dataclass():
    """
    Test that SecurityChecker uses Violation dataclass (when violations are created).
    
    Since SecurityChecker is now monitoring-only and doesn't create violations,
    this test verifies the structure is correct for future use.
    """
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '03-security.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Security"\n---\n')
        
        checker = SecurityChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='03-security.mdc',
            always_apply=False
        )
        
        result = checker.check(['apps/api/src/test.service.ts'])
        
        # Verify result structure is correct
        assert hasattr(result, 'violations')
        assert isinstance(result.violations, list)
        # Violations should be dicts (from Violation.to_dict())
        for v in result.violations:
            assert isinstance(v, dict)
            # If violations existed, they should have required fields
            if v:
                assert 'severity' in v
                assert 'rule_ref' in v
                assert 'message' in v
                assert 'file_path' in v


if __name__ == '__main__':
    test_security_checker_no_violations()
    test_security_checker_tracks_security_files()
    test_security_checker_no_tenant_isolation_overlap()
    test_security_checker_uses_violation_dataclass()
    print("All SecurityChecker tests passed!")




