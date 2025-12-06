"""
Tests for TenantIsolationChecker.

Tests verify that missing tenant_id filters are detected in Prisma queries.
"""

import sys
import tempfile
import json
from pathlib import Path

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from enforcement.checkers.tenant_isolation_checker import TenantIsolationChecker
from enforcement.checkers.models import Violation


def test_missing_tenant_filter():
    """Test that Prisma query without tenant_id filter is detected."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        
        # Create tenant_tables.json
        tenant_tables_file = project_root / '.cursor' / 'enforcement' / 'tenant_tables.json'
        tenant_tables_file.parent.mkdir(parents=True, exist_ok=True)
        tenant_tables_file.write_text(json.dumps({
            'tenant_scoped_tables': ['customer', 'order']
        }))
        
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '03-security-tenant.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Tenant isolation"\n---\n')
        
        checker = TenantIsolationChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='03-security-tenant.mdc',
            always_apply=False
        )
        
        # Create test file with Prisma query without tenant_id
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
        
        result = checker.check(['apps/api/src/test.service.ts'])
        
        assert result.status.value == 'failed'
        assert len(result.violations) > 0
        assert any('tenant_id' in v['message'].lower() for v in result.violations)


def test_tenant_filter_present():
    """Test that Prisma query with tenant_id filter is allowed."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        
        # Create tenant_tables.json
        tenant_tables_file = project_root / '.cursor' / 'enforcement' / 'tenant_tables.json'
        tenant_tables_file.parent.mkdir(parents=True, exist_ok=True)
        tenant_tables_file.write_text(json.dumps({
            'tenant_scoped_tables': ['customer', 'order']
        }))
        
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '03-security-tenant.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Tenant isolation"\n---\n')
        
        checker = TenantIsolationChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='03-security-tenant.mdc',
            always_apply=False
        )
        
        # Create test file with Prisma query with tenant_id
        test_file = project_root / 'apps' / 'api' / 'src' / 'test.service.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { PrismaService } from '@verofield/common/prisma';

export class TestService {
  constructor(private prisma: PrismaService) {}
  
  async findAll(currentUser: any) {
    return this.prisma.customer.findMany({
      where: {
        tenant_id: currentUser.tenant_id,
        status: 'active'
      }
    });
  }
}
''')
        
        result = checker.check(['apps/api/src/test.service.ts'])
        
        # Should not have violations for queries with tenant_id
        violations = [v for v in result.violations if 'SEC-R01-001' in v.get('rule_ref', '')]
        assert len(violations) == 0


def test_multiple_calls_partial_violation():
    """Test that only violating calls are flagged when multiple Prisma calls exist."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        
        # Create tenant_tables.json
        tenant_tables_file = project_root / '.cursor' / 'enforcement' / 'tenant_tables.json'
        tenant_tables_file.parent.mkdir(parents=True, exist_ok=True)
        tenant_tables_file.write_text(json.dumps({
            'tenant_scoped_tables': ['customer', 'order']
        }))
        
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '03-security-tenant.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Tenant isolation"\n---\n')
        
        checker = TenantIsolationChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='03-security-tenant.mdc',
            always_apply=False
        )
        
        # Create test file with multiple Prisma calls - only one missing tenant filter
        test_file = project_root / 'apps' / 'api' / 'src' / 'test.service.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { PrismaService } from '@verofield/common/prisma';

export class TestService {
  constructor(private prisma: PrismaService) {}
  
  async findAll(currentUser: any) {
    // This one has tenant_id - should be OK
    const customers = await this.prisma.customer.findMany({
      where: {
        tenant_id: currentUser.tenant_id,
        status: 'active'
      }
    });
    
    // This one is missing tenant_id - should be flagged
    const orders = await this.prisma.order.findMany({
      where: {
        status: 'pending'
      }
    });
    
    return { customers, orders };
  }
}
''')
        
        result = checker.check(['apps/api/src/test.service.ts'])
        
        # Should have exactly one violation (for the order query)
        violations = [v for v in result.violations if 'SEC-R01-001' in v.get('rule_ref', '')]
        assert len(violations) == 1
        assert 'order' in violations[0]['message'].lower()


def test_non_tenant_scoped_model():
    """Test that non-tenant-scoped models don't trigger violations."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        
        # Create tenant_tables.json (only customer is tenant-scoped)
        tenant_tables_file = project_root / '.cursor' / 'enforcement' / 'tenant_tables.json'
        tenant_tables_file.parent.mkdir(parents=True, exist_ok=True)
        tenant_tables_file.write_text(json.dumps({
            'tenant_scoped_tables': ['customer']
        }))
        
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '03-security-tenant.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Tenant isolation"\n---\n')
        
        checker = TenantIsolationChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='03-security-tenant.mdc',
            always_apply=False
        )
        
        # Create test file with query on non-tenant-scoped model
        test_file = project_root / 'apps' / 'api' / 'src' / 'test.service.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { PrismaService } from '@verofield/common/prisma';

export class TestService {
  constructor(private prisma: PrismaService) {}
  
  async findAll() {
    // Tenant is not tenant-scoped, so no violation
    return this.prisma.tenant.findMany({
      where: {
        active: true
      }
    });
  }
}
''')
        
        result = checker.check(['apps/api/src/test.service.ts'])
        
        # Should not have violations for non-tenant-scoped models
        violations = [v for v in result.violations if 'SEC-R01-001' in v.get('rule_ref', '')]
        assert len(violations) == 0


def test_client_provided_tenant_id():
    """Test that client-provided tenantId in where clause is detected."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        
        # Create tenant_tables.json
        tenant_tables_file = project_root / '.cursor' / 'enforcement' / 'tenant_tables.json'
        tenant_tables_file.parent.mkdir(parents=True, exist_ok=True)
        tenant_tables_file.write_text(json.dumps({
            'tenant_scoped_tables': ['customer']
        }))
        
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '03-security-tenant.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Tenant isolation"\n---\n')
        
        checker = TenantIsolationChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='03-security-tenant.mdc',
            always_apply=False
        )
        
        # Create test file with client-provided tenantId
        test_file = project_root / 'apps' / 'api' / 'src' / 'test.service.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { PrismaService } from '@verofield/common/prisma';

export class TestService {
  constructor(private prisma: PrismaService) {}
  
  async findAll(req: any) {
    // VIOLATION: Using client-provided tenantId
    return this.prisma.customer.findMany({
      where: {
        tenantId: req.body.tenantId
      }
    });
  }
}
''')
        
        result = checker.check(['apps/api/src/test.service.ts'])
        
        # Should detect client-provided tenantId
        violations = [v for v in result.violations if 'SEC-R01-002' in v.get('rule_ref', '')]
        assert len(violations) > 0
        assert any('client input' in v['message'].lower() or 'authenticated' in v['message'].lower() for v in violations)


if __name__ == '__main__':
    test_missing_tenant_filter()
    test_tenant_filter_present()
    test_multiple_calls_partial_violation()
    test_non_tenant_scoped_model()
    test_client_provided_tenant_id()
    print("All tests passed!")

