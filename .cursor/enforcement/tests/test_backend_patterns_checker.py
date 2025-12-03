"""
Tests for BackendPatternsChecker.

Tests verify pattern detection: business logic in controllers, transactions, Prisma in controllers, pass-through services.
"""

import tempfile
from pathlib import Path

from ..checkers.backend_patterns_checker import BackendPatternsChecker
from ..checkers.models import Violation


def test_prisma_in_controller():
    """Test that Prisma usage in controller is detected."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '08-backend-patterns.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Backend patterns"\n---\n')
        
        checker = BackendPatternsChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='08-backend-patterns.mdc',
            always_apply=False
        )
        
        # Create test controller with Prisma calls
        test_file = project_root / 'apps' / 'api' / 'src' / 'test' / 'test.controller.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '@verofield/common/prisma';

@Controller('test')
export class TestController {
  constructor(private readonly prisma: PrismaService) {}
  
  @Get()
  async findAll() {
    return this.prisma.user.findMany();
  }
}
''')
        
        result = checker.check(['apps/api/src/test/test.controller.ts'])
        
        assert result.status.value == 'failed'
        assert len(result.violations) > 0
        assert any('BACKEND-R08-PATTERN-003' in v['rule_ref'] for v in result.violations)
        assert any('calls prisma directly' in v['message'].lower() for v in result.violations)


def test_multi_step_without_transaction():
    """Test that multi-step operations without transaction are detected."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '08-backend-patterns.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Backend patterns"\n---\n')
        
        checker = BackendPatternsChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='08-backend-patterns.mdc',
            always_apply=False
        )
        
        # Create test service with multiple mutations without transaction
        test_file = project_root / 'apps' / 'api' / 'src' / 'test' / 'test.service.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@verofield/common/prisma';

@Injectable()
export class TestService {
  constructor(private readonly prisma: PrismaService) {}
  
  async updateOrder(orderId: string, data: any) {
    await this.prisma.order.update({ where: { id: orderId }, data });
    await this.prisma.orderItem.updateMany({ where: { order_id: orderId }, data: data.items });
  }
}
''')
        
        result = checker.check(['apps/api/src/test/test.service.ts'])
        
        assert result.status.value == 'failed'
        assert len(result.violations) > 0
        assert any('BACKEND-R08-PATTERN-002' in v['rule_ref'] for v in result.violations)
        assert any('without using $transaction' in v['message'].lower() for v in result.violations)


def test_business_logic_in_controller():
    """Test that business logic in controller is detected."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '08-backend-patterns.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Backend patterns"\n---\n')
        
        checker = BackendPatternsChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='08-backend-patterns.mdc',
            always_apply=False
        )
        
        # Create test controller with business logic
        test_file = project_root / 'apps' / 'api' / 'src' / 'test' / 'test.controller.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { Controller, Post, Body } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Post()
  async calculate(@Body() data: any) {
    // Business logic: filtering
    const filtered = data.items.filter(item => item.status === 'active');
    
    // Business logic: calculations
    const total = filtered.reduce((sum, item) => sum + item.price, 0);
    
    // Multiple conditionals
    if (total > 1000) {
      if (data.discount) {
        return { total: total * 0.9 };
      }
    }
    
    return { total };
  }
}
''')
        
        result = checker.check(['apps/api/src/test/test.controller.ts'])
        
        assert result.status.value == 'failed'
        assert len(result.violations) > 0
        assert any('BACKEND-R08-PATTERN-001' in v['rule_ref'] for v in result.violations)
        assert any('business logic' in v['message'].lower() for v in result.violations)


def test_passthrough_service():
    """Test that pass-through service is detected."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '08-backend-patterns.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Backend patterns"\n---\n')
        
        checker = BackendPatternsChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='08-backend-patterns.mdc',
            always_apply=False
        )
        
        # Create test service with pass-through methods
        test_file = project_root / 'apps' / 'api' / 'src' / 'test' / 'test.service.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@verofield/common/prisma';

@Injectable()
export class TestService {
  constructor(private readonly prisma: PrismaService) {}
  
  async findAll() {
    return this.prisma.user.findMany();
  }
  
  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  
  async create(data: any) {
    return this.prisma.user.create({ data });
  }
  
  async update(id: string, data: any) {
    return this.prisma.user.update({ where: { id }, data });
  }
}
''')
        
        result = checker.check(['apps/api/src/test/test.service.ts'])
        
        assert result.status.value == 'failed'
        assert len(result.violations) > 0
        assert any('BACKEND-R08-PATTERN-004' in v['rule_ref'] for v in result.violations)
        assert any('pass-through' in v['message'].lower() for v in result.violations)


def test_clean_implementation_no_violations():
    """Test that clean implementations have no violations."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '08-backend-patterns.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Backend patterns"\n---\n')
        
        checker = BackendPatternsChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='08-backend-patterns.mdc',
            always_apply=False
        )
        
        # Create clean controller (delegates to service)
        controller_file = project_root / 'apps' / 'api' / 'src' / 'test' / 'test.controller.ts'
        controller_file.parent.mkdir(parents=True, exist_ok=True)
        controller_file.write_text('''
import { Controller, Post, Body } from '@nestjs/common';
import { TestService } from './test.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}
  
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.testService.createUser(dto);
  }
}
''')
        
        # Create clean service (with domain logic and transactions)
        service_file = project_root / 'apps' / 'api' / 'src' / 'test' / 'test.service.ts'
        service_file.write_text('''
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@verofield/common/prisma';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class TestService {
  constructor(private readonly prisma: PrismaService) {}
  
  async createUser(dto: CreateUserDto) {
    // Domain logic: validation
    if (await this.emailExists(dto.email)) {
      throw new Error('Email already exists');
    }
    
    // Multi-step operation with transaction
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({ data: dto });
      await tx.auditLog.create({ data: { action: 'user_created', user_id: user.id } });
      return user;
    });
  }
  
  private async emailExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return !!user;
  }
}
''')
        
        result = checker.check([
            'apps/api/src/test/test.controller.ts',
            'apps/api/src/test/test.service.ts'
        ])
        
        # Should not have pattern violations
        violations = [v for v in result.violations if 'BACKEND-R08-PATTERN' in v.get('rule_ref', '')]
        assert len(violations) == 0


if __name__ == '__main__':
    test_prisma_in_controller()
    test_multi_step_without_transaction()
    test_business_logic_in_controller()
    test_passthrough_service()
    test_clean_implementation_no_violations()
    print("All tests passed!")




