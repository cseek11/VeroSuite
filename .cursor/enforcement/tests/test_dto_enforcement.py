"""
Tests for DtoEnforcementChecker.

Tests verify that missing DTOs, invalid DTO types, and DTOs without validators are detected.
"""

import tempfile
from pathlib import Path

from ..checkers.dto_enforcement_checker import DtoEnforcementChecker
from ..checkers.models import Violation


def test_missing_dto_type():
    """Test that @Body() parameter without type is detected."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '08-backend-dto.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "DTO enforcement"\n---\n')
        
        checker = DtoEnforcementChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='08-backend-dto.mdc',
            always_apply=False
        )
        
        # Create test controller with missing DTO type
        test_file = project_root / 'apps' / 'api' / 'src' / 'test' / 'test.controller.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { Controller, Post, Body } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Post()
  async create(@Body() body) {
    return { success: true };
  }
}
''')
        
        result = checker.check(['apps/api/src/test/test.controller.ts'])
        
        assert result.status.value == 'failed'
        assert len(result.violations) > 0
        assert any('BACKEND-R08-DTO-001' in v['rule_ref'] for v in result.violations)
        assert any('missing type' in v['message'].lower() for v in result.violations)


def test_primitive_type():
    """Test that @Body() parameter with primitive type is detected."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '08-backend-dto.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "DTO enforcement"\n---\n')
        
        checker = DtoEnforcementChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='08-backend-dto.mdc',
            always_apply=False
        )
        
        # Create test controller with primitive type
        test_file = project_root / 'apps' / 'api' / 'src' / 'test' / 'test.controller.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { Controller, Post, Body } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Post()
  async create(@Body() body: string) {
    return { success: true };
  }
}
''')
        
        result = checker.check(['apps/api/src/test/test.controller.ts'])
        
        assert result.status.value == 'failed'
        assert len(result.violations) > 0
        assert any('BACKEND-R08-DTO-001' in v['rule_ref'] for v in result.violations)
        assert any('primitive type' in v['message'].lower() for v in result.violations)


def test_field_selector_allowed():
    """Test that @Body('field') with primitive type is allowed (no violation)."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '08-backend-dto.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "DTO enforcement"\n---\n')
        
        checker = DtoEnforcementChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='08-backend-dto.mdc',
            always_apply=False
        )
        
        # Create test controller with field selector (allowed)
        test_file = project_root / 'apps' / 'api' / 'src' / 'test' / 'test.controller.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { Controller, Post, Body } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Post()
  async rename(@Body('name') name: string) {
    return { success: true };
  }
}
''')
        
        result = checker.check(['apps/api/src/test/test.controller.ts'])
        
        # Should not have violations for field selector with primitive
        violations = [v for v in result.violations if 'BACKEND-R08-DTO-001' in v.get('rule_ref', '')]
        assert len(violations) == 0


def test_dto_type_without_file():
    """Test that DTO type without corresponding file is detected."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '08-backend-dto.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "DTO enforcement"\n---\n')
        
        checker = DtoEnforcementChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='08-backend-dto.mdc',
            always_apply=False
        )
        
        # Create test controller with DTO type but no DTO file
        test_file = project_root / 'apps' / 'api' / 'src' / 'test' / 'test.controller.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { Controller, Post, Body } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return { success: true };
  }
}
''')
        
        # Create module file so module root can be found
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
        assert any('BACKEND-R08-DTO-002' in v['rule_ref'] for v in result.violations)
        assert any('no dto' in v['message'].lower() for v in result.violations)


def test_dto_without_validators():
    """Test that DTO file without class-validator decorators is detected."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '08-backend-dto.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "DTO enforcement"\n---\n')
        
        checker = DtoEnforcementChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='08-backend-dto.mdc',
            always_apply=False
        )
        
        # Create test controller with DTO
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
        
        # Create DTO file without validators
        dto_dir = project_root / 'apps' / 'api' / 'src' / 'test' / 'dto'
        dto_dir.mkdir(parents=True, exist_ok=True)
        dto_file = dto_dir / 'create-user.dto.ts'
        dto_file.write_text('''
export class CreateUserDto {
  email: string;
  name: string;
}
''')
        
        result = checker.check(['apps/api/src/test/test.controller.ts'])
        
        assert result.status.value == 'failed'
        assert len(result.violations) > 0
        assert any('BACKEND-R08-DTO-003' in v['rule_ref'] for v in result.violations)
        assert any('no class-validator' in v['message'].lower() for v in result.violations)


def test_dto_with_validators():
    """Test that proper DTO with validators has no violations."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '08-backend-dto.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "DTO enforcement"\n---\n')
        
        checker = DtoEnforcementChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='08-backend-dto.mdc',
            always_apply=False
        )
        
        # Create test controller with DTO
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
        
        # Create DTO file with validators
        dto_dir = project_root / 'apps' / 'api' / 'src' / 'test' / 'dto'
        dto_dir.mkdir(parents=True, exist_ok=True)
        dto_file = dto_dir / 'create-user.dto.ts'
        dto_file.write_text('''
import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;
  
  @IsString()
  name!: string;
}
''')
        
        result = checker.check(['apps/api/src/test/test.controller.ts'])
        
        # Should not have DTO-related violations
        violations = [v for v in result.violations if 'BACKEND-R08-DTO' in v.get('rule_ref', '')]
        assert len(violations) == 0


if __name__ == '__main__':
    test_missing_dto_type()
    test_primitive_type()
    test_field_selector_allowed()
    test_dto_type_without_file()
    test_dto_without_validators()
    test_dto_with_validators()
    print("All tests passed!")



