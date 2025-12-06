"""Debug tenant isolation test with checker debug."""

import sys
import os
import tempfile
import json
from pathlib import Path

# Enable debug
os.environ['VEROFIELD_ENFORCER_DEBUG'] = '1'

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from enforcement.checkers.tenant_isolation_checker import TenantIsolationChecker
from enforcement.prisma_query_parser import parse_prisma_calls

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
    content = '''
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
'''
    test_file.write_text(content)
    
    result = checker.check(['apps/api/src/test.service.ts'])
    
    print(f"Status: {result.status.value}")
    print(f"Violations: {len(result.violations)}")
    for v in result.violations:
        print(f"  - {v.get('rule_ref')}: {v.get('message')}")
    
    # Check debug log
    debug_log = project_root / '.cursor' / 'enforcer_tenant_isolation_debug.log'
    if debug_log.exists():
        print(f"\nDebug log:")
        print(debug_log.read_text())







