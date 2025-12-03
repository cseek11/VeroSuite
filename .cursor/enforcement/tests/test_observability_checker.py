"""
Tests for ObservabilityChecker.

Tests verify console.log detection, comment handling, and test file filtering.
"""

import tempfile
import os
from pathlib import Path

from ..checkers.observability_checker import ObservabilityChecker
from ..checkers.models import Violation


def test_production_console_log():
    """Test that console.log in production code is detected."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '07-observability.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Observability"\n---\n')
        
        checker = ObservabilityChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='07-observability.mdc',
            always_apply=False
        )
        
        # Create test file with console.log
        test_file = project_root / 'apps' / 'api' / 'src' / 'users' / 'users.service.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  async findAll() {
    console.log('debug');
    return [];
  }
}
''')
        
        result = checker.check(['apps/api/src/users/users.service.ts'])
        
        assert result.status.value == 'failed'
        assert len(result.violations) > 0
        assert any('console.log' in v['message'].lower() for v in result.violations)
        assert any(v['line_number'] == 6 for v in result.violations)


def test_commented_console_log():
    """Test that console.log in comments is ignored."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '07-observability.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Observability"\n---\n')
        
        checker = ObservabilityChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='07-observability.mdc',
            always_apply=False
        )
        
        # Create test file with commented console.log
        test_file = project_root / 'apps' / 'api' / 'src' / 'users' / 'users.service.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  async findAll() {
    // console.log('debug');
    return [];
  }
}
''')
        
        result = checker.check(['apps/api/src/users/users.service.ts'])
        
        # Should not have violations for commented console.log
        violations = [v for v in result.violations if 'console.log' in v.get('message', '').lower()]
        assert len(violations) == 0


def test_test_violations_file_checked():
    """Test that test-violations.service.ts is checked (not skipped)."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '07-observability.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Observability"\n---\n')
        
        checker = ObservabilityChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='07-observability.mdc',
            always_apply=False
        )
        
        # Create test-violations.service.ts with console.log
        test_file = project_root / 'apps' / 'api' / 'src' / 'test-violations' / 'test-violations.service.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestViolationsService {
  async create() {
    console.log('should be caught');
    return {};
  }
}
''')
        
        result = checker.check(['apps/api/src/test-violations/test-violations.service.ts'])
        
        # Should detect violations (file should NOT be skipped)
        assert result.status.value == 'failed'
        assert len(result.violations) > 0
        assert any('console.log' in v['message'].lower() for v in result.violations)


def test_actual_test_file_skipped():
    """Test that actual test files are skipped."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '07-observability.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Observability"\n---\n')
        
        checker = ObservabilityChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='07-observability.mdc',
            always_apply=False
        )
        
        # Create actual test file (should be skipped)
        test_file = project_root / 'apps' / 'api' / 'src' / 'users' / '__tests__' / 'users.service.spec.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { Test } from '@nestjs/testing';
import { UsersService } from '../users.service';

describe('UsersService', () => {
  it('should work', () => {
    console.log('test debug'); // This is OK in test files
  });
});
''')
        
        result = checker.check(['apps/api/src/users/__tests__/users.service.spec.ts'])
        
        # Should not have violations (test file is skipped)
        assert len(result.violations) == 0


def test_spec_file_extension_skipped():
    """Test that .spec.ts files are skipped."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '07-observability.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Observability"\n---\n')
        
        checker = ObservabilityChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='07-observability.mdc',
            always_apply=False
        )
        
        # Create .spec.ts file (should be skipped)
        test_file = project_root / 'apps' / 'api' / 'src' / 'users' / 'users.service.spec.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { Test } from '@nestjs/testing';

describe('UsersService', () => {
  it('should work', () => {
    console.log('test'); // OK in spec files
  });
});
''')
        
        result = checker.check(['apps/api/src/users/users.service.spec.ts'])
        
        # Should not have violations (spec file is skipped)
        assert len(result.violations) == 0


def test_multiple_console_logs():
    """Test that multiple console.log statements are all detected."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '07-observability.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Observability"\n---\n')
        
        checker = ObservabilityChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='07-observability.mdc',
            always_apply=False
        )
        
        # Create test file with multiple console.log statements
        test_file = project_root / 'apps' / 'api' / 'src' / 'users' / 'users.service.ts'
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text('''
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  async findAll() {
    console.log('first');
    console.error('second');
    console.warn('third');
    return [];
  }
}
''')
        
        result = checker.check(['apps/api/src/users/users.service.ts'])
        
        # Should detect all console statements
        assert result.status.value == 'failed'
        assert len(result.violations) >= 3  # At least 3 violations


if __name__ == '__main__':
    test_production_console_log()
    test_commented_console_log()
    test_test_violations_file_checked()
    test_actual_test_file_skipped()
    test_spec_file_extension_skipped()
    test_multiple_console_logs()
    print("All tests passed!")



