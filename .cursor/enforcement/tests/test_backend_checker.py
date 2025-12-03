"""
Tests for BackendChecker.

Tests verify architectural checks: DTO directory, heavy body usage, and auth guards.
"""

import tempfile
from pathlib import Path

from ..checkers.backend_checker import BackendChecker
from ..checkers.models import Violation


def test_controller_without_dto_directory():
    """Test that controller with @Body() but no dto/ directory is detected."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '08-backend.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Backend architecture"\n---\n')
        
        checker = BackendChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='08-backend.mdc',
            always_apply=False
        )
        
        # Create test controller with @Body() but no dto/ directory
        test_file = project_root / 'apps' / 'api' / 'src' / 'users' / 'users.controller.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { Controller, Post, Body } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Post()
  async create(@Body() data: any) {
    return { success: true };
  }
}
''')
        
        # Create module file so module root can be found
        module_file = project_root / 'apps' / 'api' / 'src' / 'users' / 'users.module.ts'
        module_file.write_text('''
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
})
export class UsersModule {}
''')
        
        result = checker.check(['apps/api/src/users/users.controller.ts'])
        
        assert result.status.value == 'failed'
        assert len(result.violations) > 0
        assert any('BACKEND-R08-ARCH-001' in v['rule_ref'] for v in result.violations)
        assert any('no dto/ directory' in v['message'].lower() for v in result.violations)


def test_heavy_body_usage_without_dtos():
    """Test that controller with many @Body() params but no DTOs is detected."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '08-backend.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Backend architecture"\n---\n')
        
        checker = BackendChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='08-backend.mdc',
            always_apply=False
        )
        
        # Create test controller with 3+ @Body() params but no DTOs
        test_file = project_root / 'apps' / 'api' / 'src' / 'test' / 'test.controller.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { Controller, Post, Put, Patch, Body } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Post('create')
  async create(@Body() data: any) {
    return { success: true };
  }
  
  @Put('update')
  async update(@Body() body: any) {
    return { success: true };
  }
  
  @Patch('patch')
  async patch(@Body() payload: string) {
    return { success: true };
  }
}
''')
        
        # Create module file
        module_file = project_root / 'apps' / 'api' / 'src' / 'test' / 'test.module.ts'
        module_file.write_text('''
import { Module } from '@nestjs/common';
import { TestController } from './test.controller';

@Module({
  controllers: [TestController],
})
export class TestModule {}
''')
        
        result = checker.check(['apps/api/src/test/test.controller.ts'])
        
        assert result.status.value == 'failed'
        assert len(result.violations) > 0
        assert any('BACKEND-R08-ARCH-002' in v['rule_ref'] for v in result.violations)
        assert any('does not use any dto types' in v['message'].lower() for v in result.violations)


def test_mutating_method_without_auth():
    """Test that mutating method with @Body() but no auth guard is detected."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '08-backend.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Backend architecture"\n---\n')
        
        checker = BackendChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='08-backend.mdc',
            always_apply=False
        )
        
        # Create test controller with mutating method and @Body() but no auth
        test_file = project_root / 'apps' / 'api' / 'src' / 'test' / 'test.controller.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('test')
export class TestController {
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return { success: true };
  }
}
''')
        
        # Create module file
        module_file = project_root / 'apps' / 'api' / 'src' / 'test' / 'test.module.ts'
        module_file.write_text('''
import { Module } from '@nestjs/common';
import { TestController } from './test.controller';

@Module({
  controllers: [TestController],
})
export class TestModule {}
''')
        
        # Create dto directory and file to avoid ARCH-001 violation
        dto_dir = project_root / 'apps' / 'api' / 'src' / 'test' / 'dto'
        dto_dir.mkdir(parents=True, exist_ok=True)
        dto_file = dto_dir / 'create-user.dto.ts'
        dto_file.write_text('''
import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name!: string;
}
''')
        
        result = checker.check(['apps/api/src/test/test.controller.ts'])
        
        assert result.status.value == 'failed'
        assert len(result.violations) > 0
        assert any('BACKEND-R08-ARCH-003' in v['rule_ref'] for v in result.violations)
        assert any('no auth guard' in v['message'].lower() for v in result.violations)


def test_proper_controller_no_violations():
    """Test that controller with proper DTO, auth, and dto/ directory has no violations."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '08-backend.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Backend architecture"\n---\n')
        
        checker = BackendChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='08-backend.mdc',
            always_apply=False
        )
        
        # Create test controller with proper setup
        test_file = project_root / 'apps' / 'api' / 'src' / 'test' / 'test.controller.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('test')
@UseGuards(JwtAuthGuard)
export class TestController {
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return { success: true };
  }
}
''')
        
        # Create module file
        module_file = project_root / 'apps' / 'api' / 'src' / 'test' / 'test.module.ts'
        module_file.write_text('''
import { Module } from '@nestjs/common';
import { TestController } from './test.controller';

@Module({
  controllers: [TestController],
})
export class TestModule {}
''')
        
        # Create dto directory and file
        dto_dir = project_root / 'apps' / 'api' / 'src' / 'test' / 'dto'
        dto_dir.mkdir(parents=True, exist_ok=True)
        dto_file = dto_dir / 'create-user.dto.ts'
        dto_file.write_text('''
import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name!: string;
}
''')
        
        result = checker.check(['apps/api/src/test/test.controller.ts'])
        
        # Should not have architectural violations
        violations = [v for v in result.violations if 'BACKEND-R08-ARCH' in v.get('rule_ref', '')]
        assert len(violations) == 0


if __name__ == '__main__':
    test_controller_without_dto_directory()
    test_heavy_body_usage_without_dtos()
    test_mutating_method_without_auth()
    test_proper_controller_no_violations()
    print("All tests passed!")




