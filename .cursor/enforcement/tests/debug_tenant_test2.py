"""Debug tenant isolation test with detailed output."""

import sys
import tempfile
import json
from pathlib import Path

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
    
    print(f"Tenant scoped tables: {checker.tenant_scoped_tables}")
    
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
    
    # Test parser directly
    calls = parse_prisma_calls(test_file, content)
    print(f"\nParser found {len(calls)} calls:")
    for call in calls:
        print(f"  - {call.model}.{call.op} at line {call.line_number}")
        print(f"    where_text: {call.where_text}")
        print(f"    where_has_tenant_key: {call.where_has_tenant_key}")
        print(f"    model in tenant_scoped: {call.model.lower() in {t.lower() for t in checker.tenant_scoped_tables}}")
    
    result = checker.check(['apps/api/src/test.service.ts'])
    
    print(f"\nChecker result:")
    print(f"Status: {result.status.value}")
    print(f"Violations: {len(result.violations)}")
    for v in result.violations:
        print(f"  - {v.get('rule_ref')}: {v.get('message')}")




