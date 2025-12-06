#!/usr/bin/env python3
"""
Unit tests for Detection Functions.

Phase 4: Detection Functions Implementation
Last Updated: 2025-12-04
"""

import unittest
from pathlib import Path
import tempfile
import os

# Add project root to path
project_root = Path(__file__).parent.parent.parent.parent.parent
import sys
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(Path(__file__).parent.parent))

from detection_functions import (
    ViolationResult,
    RLSViolationDetector,
    ArchitectureDriftDetector,
    HardcodedValueDetector,
    SecurityVulnerabilityDetector,
    LoggingComplianceDetector,
    MasterDetector
)


class TestRLSViolationDetector(unittest.TestCase):
    """Test RLS violation detection."""
    
    def setUp(self):
        self.detector = RLSViolationDetector()
    
    def test_detect_missing_tenant_filter(self):
        """Test detection of missing tenant_id filter."""
        content = """
        const users = await supabase
            .from('users')
            .select()
        """
        violations = self.detector.detect("test.ts", content)
        self.assertGreater(len(violations), 0)
        self.assertEqual(violations[0].penalty, -100.0)
        self.assertEqual(violations[0].rule_id, 'RLS-001')
    
    def test_detect_prisma_without_tenant(self):
        """Test detection of Prisma query without tenant filter."""
        content = """
        const users = await prisma.user.findMany()
        """
        violations = self.detector.detect("test.ts", content)
        self.assertGreater(len(violations), 0)
    
    def test_skip_rls_exempt(self):
        """Test that RLS-exempt comments are skipped."""
        content = """
        const users = await supabase.from('users').select() // RLS-exempt
        """
        violations = self.detector.detect("test.ts", content)
        self.assertEqual(len(violations), 0)
    
    def test_skip_rls_exempt_above(self):
        """Test that RLS-exempt comments on line above are skipped."""
        content = """
        // RLS-exempt
        const users = await supabase.from('users').select()
        """
        violations = self.detector.detect("test.ts", content)
        self.assertEqual(len(violations), 0)
    
    def test_skip_rls_exempt_multiline(self):
        """Test that RLS-exempt comments work with multi-line queries."""
        content = """
        // RLS-exempt
        const users = await supabase
            .from('users')
            .select()
        """
        violations = self.detector.detect("test.ts", content)
        self.assertEqual(len(violations), 0)
    
    def test_skip_rls_exempt_block_comment(self):
        """Test that RLS-exempt in block comments are skipped."""
        content = """
        /* RLS-exempt */
        const users = await supabase.from('users').select()
        """
        violations = self.detector.detect("test.ts", content)
        self.assertEqual(len(violations), 0)
    
    def test_skip_veroscore_ignore(self):
        """Test that veroscore:ignore rls comments are skipped."""
        content = """
        const users = await supabase.from('users').select() // veroscore:ignore rls
        """
        violations = self.detector.detect("test.ts", content)
        self.assertEqual(len(violations), 0)
    
    def test_skip_non_database_files(self):
        """Test that non-database files are skipped."""
        content = """
        const x = 5;
        function test() { return x; }
        """
        violations = self.detector.detect("test.ts", content)
        self.assertEqual(len(violations), 0)


class TestArchitectureDriftDetector(unittest.TestCase):
    """Test architecture drift detection."""
    
    def setUp(self):
        self.detector = ArchitectureDriftDetector()
    
    def test_detect_cross_service_import(self):
        """Test detection of cross-service imports."""
        content = """
        import { something } from '../../../apps/crm-ai/src/service'
        """
        violations = self.detector.detect("test.ts", content)
        self.assertGreater(len(violations), 0)
        self.assertEqual(violations[0].penalty, -75.0)
    
    def test_detect_deprecated_path(self):
        """Test detection of deprecated backend paths."""
        content = """
        import { something } from '../../backend/src/service'
        """
        violations = self.detector.detect("test.ts", content)
        self.assertGreater(len(violations), 0)
    
    def test_detect_old_naming(self):
        """Test detection of old VeroSuite naming."""
        content = """
        import { something } from '@verosuite/common'
        """
        violations = self.detector.detect("test.ts", content)
        self.assertGreater(len(violations), 0)
    
    def test_check_file_placement(self):
        """Test file placement checking."""
        violations = self.detector._check_file_placement("backend/src/service.ts")
        self.assertGreater(len(violations), 0)
        self.assertEqual(violations[0].penalty, -75.0)


class TestHardcodedValueDetector(unittest.TestCase):
    """Test hardcoded value detection."""
    
    def setUp(self):
        self.detector = HardcodedValueDetector()
    
    def test_detect_hardcoded_secret(self):
        """Test detection of hardcoded secrets."""
        content = """
        const api_key = "TEST_SECRET_KEY_PATTERN_123456789012345678901234567890"
        """
        violations = self.detector.detect("test.ts", content)
        self.assertGreater(len(violations), 0)
        self.assertEqual(violations[0].penalty, -60.0)
        self.assertEqual(violations[0].rule_id, 'HARDCODE-SECRET')
    
    def test_detect_hardcoded_tenant_id(self):
        """Test detection of hardcoded tenant ID."""
        content = """
        const tenant_id = "550e8400-e29b-41d4-a716-446655440000"
        """
        violations = self.detector.detect("test.ts", content)
        self.assertGreater(len(violations), 0)
        self.assertEqual(violations[0].rule_id, 'HARDCODE-TENANT-ID')
    
    def test_detect_hardcoded_date(self):
        """Test detection of hardcoded dates."""
        content = """
        const date = "2025-12-04"
        """
        violations = self.detector.detect("test.ts", content)
        self.assertGreater(len(violations), 0)
        self.assertEqual(violations[0].rule_id, 'HARDCODE-DATE')
    
    def test_skip_test_files(self):
        """Test that test files are skipped for dates."""
        content = """
        const date = "2025-12-04"
        """
        violations = self.detector.detect("test_file.spec.ts", content)
        # Should skip date detection in test files
        date_violations = [v for v in violations if v.rule_id == 'HARDCODE-DATE']
        self.assertEqual(len(date_violations), 0)


class TestSecurityVulnerabilityDetector(unittest.TestCase):
    """Test security vulnerability detection."""
    
    def setUp(self):
        self.detector = SecurityVulnerabilityDetector()
    
    def test_detect_xss(self):
        """Test detection of XSS vulnerabilities."""
        content = """
        <div dangerouslySetInnerHTML={{ __html: userInput }} />
        """
        violations = self.detector.detect("test.tsx", content)
        self.assertGreater(len(violations), 0)
        self.assertEqual(violations[0].penalty, -50.0)
        self.assertEqual(violations[0].rule_id, 'SEC-XSS')
    
    def test_detect_sql_injection(self):
        """Test detection of SQL injection vulnerabilities."""
        content = """
        query = f"SELECT * FROM users WHERE id = {user_id}"
        """
        violations = self.detector.detect("test.py", content)
        self.assertGreater(len(violations), 0)
        self.assertEqual(violations[0].rule_id, 'SEC-SQL-INJECTION')
    
    def test_skip_sanitized_xss(self):
        """Test that sanitized XSS is skipped."""
        content = """
        <div dangerouslySetInnerHTML={{ __html: sanitize(userInput) }} />
        """
        violations = self.detector.detect("test.tsx", content)
        # Should skip if sanitize is present
        xss_violations = [v for v in violations if v.rule_id == 'SEC-XSS']
        self.assertEqual(len(xss_violations), 0)


class TestLoggingComplianceDetector(unittest.TestCase):
    """Test logging compliance detection."""
    
    def setUp(self):
        self.detector = LoggingComplianceDetector()
    
    def test_detect_console_log(self):
        """Test detection of console.log."""
        content = """
        console.log('Debug message')
        """
        violations = self.detector.detect("test.ts", content)
        self.assertGreater(len(violations), 0)
        self.assertEqual(violations[0].penalty, -30.0)
        self.assertEqual(violations[0].rule_id, 'LOG-UNSTRUCTURED')
    
    def test_skip_test_files(self):
        """Test that test files are skipped."""
        content = """
        console.log('Test output')
        """
        violations = self.detector.detect("test.spec.ts", content)
        self.assertEqual(len(violations), 0)
    
    def test_skip_structured_logging(self):
        """Test that structured logging is skipped."""
        content = """
        logger.info('Message', { context: 'test' })
        """
        violations = self.detector.detect("test.ts", content)
        console_violations = [v for v in violations if 'console' in v.message.lower()]
        self.assertEqual(len(console_violations), 0)


class TestMasterDetector(unittest.TestCase):
    """Test master detector orchestrator."""
    
    def setUp(self):
        self.detector = MasterDetector()
        self.temp_dir = tempfile.mkdtemp()
    
    def tearDown(self):
        import shutil
        shutil.rmtree(self.temp_dir)
    
    def test_detect_all_single_file(self):
        """Test detection on a single file."""
        test_file = Path(self.temp_dir) / "test.ts"
        test_file.write_text("""
        const users = await supabase.from('users').select()
        console.log('Debug')
        """)
        
        result = self.detector.detect_all([str(test_file)], base_path=Path(self.temp_dir))
        
        self.assertIn('violations', result)
        self.assertIn('warnings', result)
        self.assertIn('summary', result)
        self.assertGreater(result['summary']['total_violations'], 0)
    
    def test_detect_all_multiple_files(self):
        """Test detection on multiple files."""
        files = []
        for i in range(3):
            test_file = Path(self.temp_dir) / f"test{i}.ts"
            test_file.write_text("console.log('test')")
            files.append(str(test_file))
        
        result = self.detector.detect_all(files, base_path=Path(self.temp_dir))
        
        self.assertEqual(result['summary']['files_checked'], 3)
        self.assertGreater(result['summary']['total_violations'], 0)
    
    def test_detect_all_nonexistent_file(self):
        """Test handling of nonexistent files."""
        result = self.detector.detect_all(["nonexistent.ts"], base_path=Path(self.temp_dir))
        
        # Should not crash, but may have warnings
        self.assertIn('summary', result)
    
    def test_summary_calculation(self):
        """Test summary calculation."""
        test_file = Path(self.temp_dir) / "test.ts"
        test_file.write_text("""
        const users = await supabase.from('users').select()
        console.log('Debug')
        """)
        
        result = self.detector.detect_all([str(test_file)], base_path=Path(self.temp_dir))
        
        summary = result['summary']
        self.assertIn('total_violations', summary)
        self.assertIn('total_warnings', summary)
        self.assertIn('total_penalty', summary)
        self.assertIn('violations_by_detector', summary)
        self.assertIn('files_checked', summary)


if __name__ == '__main__':
    unittest.main()

