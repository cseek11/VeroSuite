"""Quick verification that Prisma parser works correctly."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from enforcement.prisma_query_parser import parse_prisma_calls

def main():
    test_content = 'await prisma.customer.findMany({ where: { tenantId: currentUser.tenantId } });'
    calls = parse_prisma_calls(Path('test.ts'), test_content)
    
    print(f'Parsed {len(calls)} calls')
    if calls:
        call = calls[0]
        print(f'Call 1: model={call.model}, op={call.op}')
        print(f'  where_text: {call.where_text[:80] if call.where_text else None}')
        print(f'  has_tenant_key: {call.where_has_tenant_key}')
        
        if call.where_has_tenant_key:
            print('✅ SUCCESS: Parser correctly detects tenant key!')
            return 0
        else:
            print('❌ FAILED: Parser should detect tenant key but did not')
            return 1
    else:
        print('❌ FAILED: No calls parsed')
        return 1

if __name__ == '__main__':
    sys.exit(main())




