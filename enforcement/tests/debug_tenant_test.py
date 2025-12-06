"""Debug tenant isolation test."""

import sys
import tempfile
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from enforcement.checkers.tenant_isolation_checker import TenantIsolationChecker

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
    
    print(f"Status: {result.status.value}")
    print(f"Violations: {len(result.violations)}")
    for v in result.violations:
        print(f"  - {v.get('rule_ref')}: {v.get('message')}")







