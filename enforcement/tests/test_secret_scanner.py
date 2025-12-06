"""
Tests for SecretScannerChecker.

Tests verify that hardcoded secrets are detected and environment variable usage is allowed.
"""

import tempfile
import os
from pathlib import Path

from ..checkers.secret_scanner_checker import SecretScannerChecker
from ..checkers.models import Violation


def test_hardcoded_jwt_secret():
    """Test that hardcoded JWT_SECRET is detected."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '03-security-secrets.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Secret scanning"\n---\n')
        
        checker = SecretScannerChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='03-security-secrets.mdc',
            always_apply=False
        )
        
        # Create test file with hardcoded secret
        test_file = project_root / 'test-service.ts'
        test_file.write_text('''
export class TestService {
  private readonly JWT_SECRET = 'my-secret-key-123';
}
''')
        
        result = checker.check(['test-service.ts'])
        
        assert result.status.value == 'failed'
        assert len(result.violations) > 0
        assert any('JWT_SECRET' in v['message'] for v in result.violations)


def test_env_variable_allowed():
    """Test that environment variable usage is allowed."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '03-security-secrets.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Secret scanning"\n---\n')
        
        checker = SecretScannerChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='03-security-secrets.mdc',
            always_apply=False
        )
        
        # Create test file with environment variable
        test_file = project_root / 'test-service.ts'
        test_file.write_text('''
export class TestService {
  private readonly JWT_SECRET = process.env.JWT_SECRET;
}
''')
        
        result = checker.check(['test-service.ts'])
        
        # Should not have violations for env variable usage
        violations = [v for v in result.violations if 'JWT_SECRET' in v.get('message', '')]
        assert len(violations) == 0


def test_hardcoded_api_key():
    """Test that hardcoded API_KEY is detected."""
    with tempfile.TemporaryDirectory() as tmpdir:
        project_root = Path(tmpdir)
        rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '03-security-secrets.mdc'
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Secret scanning"\n---\n')
        
        checker = SecretScannerChecker(
            project_root=project_root,
            rule_file=rule_file,
            rule_ref='03-security-secrets.mdc',
            always_apply=False
        )
        
        # Create test file with hardcoded API key
        test_file = project_root / 'test-service.ts'
        test_file.write_text('''
export class TestService {
  private readonly API_KEY = 'sk_live_1234567890abcdef';
}
''')
        
        result = checker.check(['test-service.ts'])
        
        assert result.status.value == 'failed'
        assert len(result.violations) > 0
        assert any('API_KEY' in v['message'] for v in result.violations)


if __name__ == '__main__':
    test_hardcoded_jwt_secret()
    test_env_variable_allowed()
    test_hardcoded_api_key()
    print("All tests passed!")







