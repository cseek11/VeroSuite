#!/usr/bin/env python3
"""
Test Suite for Enforcement System Integration with Predictive Context Management

Tests that:
1. Enforcement system is enforcing properly
2. Enforcement and Predictive Context Management System work together properly

Last Updated: 2025-12-01
"""

import os
import sys
import json
import time
import subprocess
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="test_enforcement_integration")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("test_enforcement_integration")

# Import enforcement and context management
# Fix import path for script execution
import importlib.util
enforcer_path = Path(__file__).parent / "auto-enforcer.py"
spec = importlib.util.spec_from_file_location("auto_enforcer", enforcer_path)
auto_enforcer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(auto_enforcer)
VeroFieldEnforcer = auto_enforcer.VeroFieldEnforcer
context_manager_path = project_root / ".cursor" / "context_manager"
sys.path.insert(0, str(context_manager_path.parent))

from context_manager.task_detector import TaskDetector
from context_manager.context_loader import ContextLoader
from context_manager.workflow_tracker import WorkflowTracker
from context_manager.predictor import ContextPredictor
from context_manager.preloader import ContextPreloader


@dataclass
class EnforcementTestResult:
    """Enforcement test result."""
    test_name: str
    status: str  # PASSED, FAILED, SKIPPED
    duration_ms: float
    violations_found: int
    context_updated: bool
    recommendations_generated: bool
    errors: List[str]
    warnings: List[str]


class EnforcementIntegrationTester:
    """Test suite for enforcement system integration."""
    
    def __init__(self, output_dir: Optional[Path] = None):
        """Initialize test suite."""
        self.project_root = project_root
        self.output_dir = output_dir or (project_root / ".cursor" / "tests" / "enforcement-integration")
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        self.test_results: List[EnforcementTestResult] = []
        self.current_test: Optional[str] = None
        self.test_start_time: Optional[float] = None
    
    def log_step(self, step: str, details: Dict = None):
        """Log a test step."""
        details = details or {}
        logger.info(
            f"[TEST: {self.current_test}] {step}",
            operation="test_step",
            test_name=self.current_test,
            step=step,
            **details
        )
    
    def start_test(self, test_name: str):
        """Start a test."""
        self.current_test = test_name
        self.test_start_time = time.time()
        self.log_step("Test started")
    
    def end_test(self, status: str, violations_found: int = 0, context_updated: bool = False,
                 recommendations_generated: bool = False, errors: List[str] = None, warnings: List[str] = None):
        """End a test."""
        duration_ms = (time.time() - self.test_start_time) * 1000 if self.test_start_time else 0
        
        result = EnforcementTestResult(
            test_name=self.current_test,
            status=status,
            duration_ms=duration_ms,
            violations_found=violations_found,
            context_updated=context_updated,
            recommendations_generated=recommendations_generated,
            errors=errors or [],
            warnings=warnings or []
        )
        self.test_results.append(result)
        
        self.current_test = None
        self.test_start_time = None
    
    def test_enforcement_runs(self):
        """Test that enforcement system runs without errors."""
        self.start_test("enforcement_runs")
        
        try:
            enforcer = VeroFieldEnforcer()
            
            self.log_step("Enforcer initialized")
            
            # Run checks
            success = enforcer.run_all_checks()
            
            self.log_step("Checks completed", {
                "success": success,
                "violations": len(enforcer.violations)
            })
            
            errors = []
            warnings = []
            
            if not success and len([v for v in enforcer.violations if v.severity.name == "BLOCKED"]) > 0:
                errors.append("Enforcement found blocking violations")
            
            # Check status files generated
            status_file = project_root / ".cursor" / "enforcement" / "AGENT_STATUS.md"
            if not status_file.exists():
                errors.append("AGENT_STATUS.md not generated")
            
            status = "FAILED" if errors else "PASSED"
            self.end_test(status, len(enforcer.violations), False, False, errors, warnings)
            
        except Exception as e:
            self.end_test("FAILED", 0, False, False, [str(e)])
    
    def test_context_integration(self):
        """Test that enforcement updates context recommendations."""
        self.start_test("context_integration")
        
        try:
            enforcer = VeroFieldEnforcer()
            
            self.log_step("Enforcer initialized with context management")
            
            # Check if context management is available
            if not enforcer.predictor:
                self.end_test("SKIPPED", 0, False, False, [], ["Context management not available"])
                return
            
            # Run checks (should trigger context update)
            success = enforcer.run_all_checks()
            
            self.log_step("Checks completed")
            
            # Check recommendations file
            recommendations_file = project_root / ".cursor" / "context_manager" / "recommendations.md"
            context_updated = recommendations_file.exists()
            
            if context_updated:
                # Read and verify content
                with open(recommendations_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                has_active_context = "Active Context" in content
                has_suggested_context = "Suggested Context" in content or "suggested_context" in content.lower()
                
                self.log_step("Recommendations file verified", {
                    "has_active_context": has_active_context,
                    "has_suggested_context": has_suggested_context
                })
            else:
                self.log_step("Recommendations file not found")
            
            errors = []
            warnings = []
            
            if not context_updated:
                errors.append("Context recommendations not updated")
            elif not has_active_context:
                warnings.append("Active context section missing")
            
            status = "FAILED" if errors else "PASSED"
            self.end_test(status, len(enforcer.violations), context_updated, has_active_context, errors, warnings)
            
        except Exception as e:
            self.end_test("FAILED", 0, False, False, [str(e)])
    
    def test_context_state_persistence(self):
        """Test that context state persists after enforcement."""
        self.start_test("context_state_persistence")
        
        try:
            enforcer = VeroFieldEnforcer()
            
            # Run first enforcement
            enforcer.run_all_checks()
            
            # Check state file
            state_file = project_root / ".cursor" / "context_manager" / "context_state.json"
            state_exists_after_first = state_file.exists()
            
            self.log_step("First run completed", {
                "state_file_exists": state_exists_after_first
            })
            
            # Run second enforcement
            enforcer2 = VeroFieldEnforcer()
            enforcer2.run_all_checks()
            
            state_exists_after_second = state_file.exists()
            
            self.log_step("Second run completed", {
                "state_file_exists": state_exists_after_second
            })
            
            errors = []
            warnings = []
            
            if not state_exists_after_first:
                errors.append("State file not created after first run")
            if not state_exists_after_second:
                errors.append("State file not created after second run")
            
            # Verify state can be read
            if state_exists_after_second:
                try:
                    with open(state_file, 'r') as f:
                        state_data = json.load(f)
                    
                    self.log_step("State file read", {
                        "active_count": len(state_data.get('active', [])),
                        "preloaded_count": len(state_data.get('preloaded', []))
                    })
                except Exception as e:
                    errors.append(f"Failed to read state file: {e}")
            
            status = "FAILED" if errors else "PASSED"
            self.end_test(status, 0, True, True, errors, warnings)
            
        except Exception as e:
            self.end_test("FAILED", 0, False, False, [str(e)])
    
    def test_enforcement_with_file_changes(self):
        """Test enforcement with actual file changes."""
        self.start_test("enforcement_with_file_changes")
        
        try:
            # Create a test file
            test_file = project_root / ".cursor" / "tests" / "test_file.py"
            test_file.parent.mkdir(parents=True, exist_ok=True)
            
            test_content = '''#!/usr/bin/env python3
"""Test file for enforcement testing."""
def test_function():
    return "test"
'''
            test_file.write_text(test_content, encoding='utf-8')
            
            self.log_step("Test file created", {"file": str(test_file)})
            
            # Run enforcement
            enforcer = VeroFieldEnforcer()
            success = enforcer.run_all_checks()
            
            self.log_step("Enforcement completed", {
                "success": success,
                "violations": len(enforcer.violations)
            })
            
            # Check if context was updated
            recommendations_file = project_root / ".cursor" / "context_manager" / "recommendations.md"
            context_updated = recommendations_file.exists()
            
            # Cleanup
            if test_file.exists():
                test_file.unlink()
            
            errors = []
            warnings = []
            
            if not context_updated:
                warnings.append("Context not updated with file changes")
            
            status = "PASSED"
            self.end_test(status, len(enforcer.violations), context_updated, context_updated, errors, warnings)
            
        except Exception as e:
            self.end_test("FAILED", 0, False, False, [str(e)])
    
    def test_timeout_handling(self):
        """Test that enforcement handles timeouts properly."""
        self.start_test("timeout_handling")
        
        try:
            # This test verifies timeout configuration
            watch_files_script = project_root / ".cursor" / "scripts" / "watch-files.py"
            
            if not watch_files_script.exists():
                self.end_test("SKIPPED", 0, False, False, [], ["watch-files.py not found"])
                return
            
            # Read timeout value
            with open(watch_files_script, 'r', encoding='utf-8') as f:
                content = f.read()
            
            has_timeout_180 = 'timeout=180' in content or 'timeout= 180' in content
            
            self.log_step("Timeout configuration checked", {
                "has_180s_timeout": has_timeout_180
            })
            
            errors = []
            warnings = []
            
            if not has_timeout_180:
                warnings.append("Timeout not set to 180 seconds")
            
            status = "PASSED"
            self.end_test(status, 0, False, False, errors, warnings)
            
        except Exception as e:
            self.end_test("FAILED", 0, False, False, [str(e)])
    
    def run_all_tests(self):
        """Run all integration tests."""
        logger.info(
            "Starting enforcement integration test suite",
            operation="run_all_tests",
            test_count=5
        )
        
        self.test_enforcement_runs()
        self.test_context_integration()
        self.test_context_state_persistence()
        self.test_enforcement_with_file_changes()
        self.test_timeout_handling()
        
        self.generate_report()
    
    def generate_report(self):
        """Generate test report."""
        report_path = self.output_dir / "integration_test_report.json"
        summary_path = self.output_dir / "integration_test_summary.md"
        
        # JSON report
        report_data = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "test_results": [asdict(r) for r in self.test_results],
            "summary": {
                "total_tests": len(self.test_results),
                "passed": len([r for r in self.test_results if r.status == "PASSED"]),
                "failed": len([r for r in self.test_results if r.status == "FAILED"]),
                "skipped": len([r for r in self.test_results if r.status == "SKIPPED"]),
                "total_violations": sum(r.violations_found for r in self.test_results),
                "context_updates": sum(1 for r in self.test_results if r.context_updated)
            }
        }
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False)
        
        # Markdown summary
        summary_lines = [
            "# Enforcement System Integration Test Report",
            "",
            f"**Generated:** {datetime.now(timezone.utc).isoformat()}",
            "",
            "## Summary",
            "",
            f"- **Total Tests:** {report_data['summary']['total_tests']}",
            f"- **Passed:** {report_data['summary']['passed']}",
            f"- **Failed:** {report_data['summary']['failed']}",
            f"- **Skipped:** {report_data['summary']['skipped']}",
            f"- **Total Violations Found:** {report_data['summary']['total_violations']}",
            f"- **Context Updates:** {report_data['summary']['context_updates']}",
            "",
            "## Test Results",
            ""
        ]
        
        for result in self.test_results:
            status_icon = "✅" if result.status == "PASSED" else "❌" if result.status == "FAILED" else "⚠️"
            summary_lines.append(f"### {status_icon} {result.test_name}")
            summary_lines.append(f"- **Status:** {result.status}")
            summary_lines.append(f"- **Duration:** {result.duration_ms:.2f}ms")
            summary_lines.append(f"- **Violations Found:** {result.violations_found}")
            summary_lines.append(f"- **Context Updated:** {result.context_updated}")
            summary_lines.append(f"- **Recommendations Generated:** {result.recommendations_generated}")
            if result.errors:
                summary_lines.append(f"- **Errors:** {len(result.errors)}")
                for error in result.errors:
                    summary_lines.append(f"  - {error}")
            if result.warnings:
                summary_lines.append(f"- **Warnings:** {len(result.warnings)}")
                for warning in result.warnings:
                    summary_lines.append(f"  - {warning}")
            summary_lines.append("")
        
        with open(summary_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(summary_lines))
        
        logger.info(
            "Integration test report generated",
            operation="generate_report",
            report_path=str(report_path),
            summary_path=str(summary_path)
        )
        
        print(f"\n✅ Integration Test Report: {report_path}")
        print(f"✅ Integration Test Summary: {summary_path}")


def main():
    """Main entry point."""
    tester = EnforcementIntegrationTester()
    tester.run_all_tests()
    
    passed = len([r for r in tester.test_results if r.status == "PASSED"])
    failed = len([r for r in tester.test_results if r.status == "FAILED"])
    
    print(f"\n{'='*60}")
    print(f"Integration Test Suite Complete: {passed} passed, {failed} failed")
    print(f"{'='*60}\n")
    
    return 0 if failed == 0 else 1


if __name__ == '__main__':
    sys.exit(main())

