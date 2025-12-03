"""
Tests for Prisma query parser.

Tests verify parsing of Prisma calls, where clause extraction, and tenant key detection.
"""

import sys
import tempfile
from pathlib import Path

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from enforcement.prisma_query_parser import parse_prisma_calls, PrismaCall


def test_simple_where_with_tenant():
    """Test parsing a simple where clause with tenantId."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        test_file = project_root / 'test.service.ts'
        test_file.write_text('''
async findAll() {
  await prisma.customer.findMany({
    where: { tenantId: currentUser.tenantId }
  });
}
''')
        
        calls = parse_prisma_calls(test_file, test_file.read_text())
        
        assert len(calls) == 1
        call = calls[0]
        assert call.model == 'customer'
        assert call.op == 'findMany'
        assert call.where_text is not None
        assert call.where_has_tenant_key is True
        assert 'tenantId' in call.where_text


def test_nested_and_with_tenant():
    """Test parsing nested AND clause with tenantId."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        test_file = project_root / 'test.service.ts'
        test_file.write_text('''
return prisma.customer.findMany({
  where: {
    AND: [
      { tenantId: currentUser.tenantId },
      { active: true },
    ]
  }
});
''')
        
        calls = parse_prisma_calls(test_file, test_file.read_text())
        
        assert len(calls) == 1
        call = calls[0]
        assert call.model == 'customer'
        assert call.op == 'findMany'
        assert call.where_text is not None
        assert call.where_has_tenant_key is True


def test_no_where_clause():
    """Test parsing Prisma call without where clause."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        test_file = project_root / 'test.service.ts'
        test_file.write_text('''
prisma.customer.findMany();
''')
        
        calls = parse_prisma_calls(test_file, test_file.read_text())
        
        assert len(calls) == 1
        call = calls[0]
        assert call.model == 'customer'
        assert call.op == 'findMany'
        assert call.where_text is None
        assert call.where_has_tenant_key is False


def test_where_without_tenant():
    """Test parsing where clause without tenantId."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        test_file = project_root / 'test.service.ts'
        test_file.write_text('''
prisma.customer.findMany({
  where: { active: true }
});
''')
        
        calls = parse_prisma_calls(test_file, test_file.read_text())
        
        assert len(calls) == 1
        call = calls[0]
        assert call.model == 'customer'
        assert call.op == 'findMany'
        assert call.where_text is not None
        assert call.where_has_tenant_key is False


def test_multiple_calls():
    """Test parsing multiple Prisma calls in one file."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        test_file = project_root / 'test.service.ts'
        test_file.write_text('''
async findAll() {
  const customers = await prisma.customer.findMany({
    where: { tenantId: currentUser.tenantId }
  });
  
  const jobs = await prisma.job.findMany({
    where: { active: true }
  });
  
  return { customers, jobs };
}
''')
        
        calls = parse_prisma_calls(test_file, test_file.read_text())
        
        assert len(calls) == 2
        
        # First call (customer) should have tenant key
        customer_call = calls[0]
        assert customer_call.model == 'customer'
        assert customer_call.where_has_tenant_key is True
        
        # Second call (job) should not have tenant key
        job_call = calls[1]
        assert job_call.model == 'job'
        assert job_call.where_has_tenant_key is False


def test_this_prisma_pattern():
    """Test parsing this.prisma pattern."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        test_file = project_root / 'test.service.ts'
        test_file.write_text('''
async findAll() {
  return this.prisma.user.findMany({
    where: { tenantId: currentUser.tenantId }
  });
}
''')
        
        calls = parse_prisma_calls(test_file, test_file.read_text())
        
        assert len(calls) == 1
        call = calls[0]
        assert call.model == 'user'
        assert call.op == 'findMany'
        assert call.where_has_tenant_key is True


def test_tenant_id_variant():
    """Test parsing with tenant_id (snake_case) variant."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        test_file = project_root / 'test.service.ts'
        test_file.write_text('''
prisma.customer.findMany({
  where: { tenant_id: currentUser.tenant_id }
});
''')
        
        calls = parse_prisma_calls(test_file, test_file.read_text())
        
        assert len(calls) == 1
        call = calls[0]
        assert call.where_has_tenant_key is True


def test_complex_nested_where():
    """Test parsing complex nested where clause."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        test_file = project_root / 'test.service.ts'
        test_file.write_text('''
prisma.customer.findMany({
  where: {
    tenantId: currentUser.tenantId,
    OR: [
      { status: 'active' },
      { status: 'pending' }
    ],
    AND: [
      { created_at: { gte: startDate } }
    ]
  },
  include: { orders: true }
});
''')
        
        calls = parse_prisma_calls(test_file, test_file.read_text())
        
        assert len(calls) == 1
        call = calls[0]
        assert call.where_text is not None
        assert call.where_has_tenant_key is True
        assert 'tenantId' in call.where_text


if __name__ == '__main__':
    test_simple_where_with_tenant()
    test_nested_and_with_tenant()
    test_no_where_clause()
    test_where_without_tenant()
    test_multiple_calls()
    test_this_prisma_pattern()
    test_tenant_id_variant()
    test_complex_nested_where()
    print("All tests passed!")

