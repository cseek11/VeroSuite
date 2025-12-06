#!/usr/bin/env python3
"""
Comprehensive Test Suite for Predictive Context Management System

Tests all areas of the system with small, medium, and large tasks.
Logs all steps, shows loading/unloading behavior, and estimates tokens.

Last Updated: 2025-12-04
"""

import os
import sys
import json
import time
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="test_predictive_context")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("test_predictive_context")

# Import context management modules
context_manager_path = project_root / ".cursor" / "context_manager"
sys.path.insert(0, str(context_manager_path.parent))

from context_manager.task_detector import TaskDetector
from context_manager.context_loader import ContextLoader
from context_manager.workflow_tracker import WorkflowTracker
from context_manager.predictor import ContextPredictor
from context_manager.preloader import ContextPreloader
from context_manager.analytics import PredictionAnalytics
from context_manager.token_estimator import TokenEstimator


@dataclass
class TestResult:
    """Test result data."""
    test_name: str
    status: str  # PASSED, FAILED, SKIPPED
    duration_ms: float
    details: Dict
    errors: List[str]
    warnings: List[str]


@dataclass
class ContextSnapshot:
    """Snapshot of context state at a point in time."""
    timestamp: str
    active_context: List[str]
    suggested_context: List[str]
    preloaded_context: List[str]
    context_to_unload: List[str]
    active_tokens: int
    preloaded_tokens: int
    total_tokens: int


class PredictiveContextSystemTester:
    """Comprehensive test suite for Predictive Context Management System."""
    
    def __init__(self, output_dir: Optional[Path] = None):
        """
        Initialize test suite.
        
        Args:
            output_dir: Directory for test output files (default: .cursor/tests/predictive-context/)
        """
        self.project_root = project_root
        self.output_dir = output_dir or (project_root / ".cursor" / "tests" / "predictive-context")
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialize components
        self.task_detector = TaskDetector()
        self.context_loader = ContextLoader()
        self.workflow_tracker = WorkflowTracker()
        self.predictor = ContextPredictor(self.workflow_tracker)
        self.preloader = ContextPreloader(self.predictor, self.context_loader)
        self.analytics = PredictionAnalytics()
        self.token_estimator = TokenEstimator()
        
        # Test results
        self.test_results: List[TestResult] = []
        self.context_snapshots: List[ContextSnapshot] = []
        
        # Test state
        self.current_test: Optional[str] = None
        self.test_start_time: Optional[float] = None
        
        logger.info(
            "Predictive Context System Tester initialized",
            operation="__init__",
            output_dir=str(self.output_dir)
        )
    
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
    
    def end_test(self, status: str, details: Dict = None, errors: List[str] = None, warnings: List[str] = None):
        """End a test and record result."""
        duration_ms = (time.time() - self.test_start_time) * 1000 if self.test_start_time else 0
        
        result = TestResult(
            test_name=self.current_test,
            status=status,
            duration_ms=duration_ms,
            details=details or {},
            errors=errors or [],
            warnings=warnings or []
        )
        self.test_results.append(result)
        
        self.log_step(
            f"Test {status.lower()}",
            {
                "duration_ms": duration_ms,
                "errors": len(errors or []),
                "warnings": len(warnings or [])
            }
        )
        
        self.current_test = None
        self.test_start_time = None
    
    def capture_context_snapshot(self, context_plan: Dict) -> ContextSnapshot:
        """Capture a snapshot of current context state."""
        active_context = context_plan.get('active_context', [])
        suggested_context = context_plan.get('suggested_context', [])
        preloaded_context = context_plan.get('preloaded_context', [])
        context_to_unload = context_plan.get('context_to_unload', [])
        
        # Estimate tokens
        active_tokens = sum(self.token_estimator.estimate_tokens(f) for f in active_context)
        preloaded_tokens = sum(self.token_estimator.estimate_tokens(f) * 0.3 for f in preloaded_context)  # 30% cost
        total_tokens = active_tokens + preloaded_tokens
        
        snapshot = ContextSnapshot(
            timestamp=datetime.now(timezone.utc).isoformat(),
            active_context=active_context,
            suggested_context=suggested_context,
            preloaded_context=preloaded_context,
            context_to_unload=context_to_unload,
            active_tokens=int(active_tokens),
            preloaded_tokens=int(preloaded_tokens),
            total_tokens=int(total_tokens)
        )
        
        self.context_snapshots.append(snapshot)
        return snapshot
    
    def test_small_task_python_edit(self):
        """Test small task: Edit single Python file."""
        self.start_test("small_task_python_edit")
        
        try:
            # Simulate task
            files = ["apps/api/src/test_service.py"]
            task_detection = self.task_detector.detect_task(
                agent_message="Fix bug in test_service",
                files=files
            )
            
            self.log_step("Task detected", {
                "primary_task": task_detection.primary_task,
                "confidence": task_detection.confidence,
                "files": files
            })
            
            # Create task dict
            current_task = {
                'primary_task': task_detection.primary_task,
                'files': files,
                'user_message': 'Fix bug in test_service'
            }
            
            # Get context plan
            context_plan = self.preloader.manage_context(current_task)
            
            # Capture snapshot
            snapshot = self.capture_context_snapshot(context_plan)
            
            self.log_step("Context plan generated", {
                "active_context_count": len(context_plan['active_context']),
                "suggested_context_count": len(context_plan['suggested_context']),
                "preloaded_context_count": len(context_plan['preloaded_context']),
                "context_to_unload_count": len(context_plan['context_to_unload']),
                "active_tokens": snapshot.active_tokens,
                "total_tokens": snapshot.total_tokens
            })
            
            # Verify expectations
            errors = []
            warnings = []
            
            # Should only load 2 files (python_bible, 02-core)
            if len(context_plan['active_context']) != 2:
                errors.append(f"Expected 2 active context files, got {len(context_plan['active_context'])}")
            
            # Should have suggested context
            if len(context_plan['suggested_context']) == 0:
                warnings.append("No suggested context provided")
            
            # Should have minimal tokens
            if snapshot.total_tokens > 50000:
                warnings.append(f"Token usage high: {snapshot.total_tokens}")
            
            # Check state persistence
            state_file = self.preloader.state_file
            if not state_file.exists():
                errors.append(f"State file not created: {state_file}")
            else:
                self.log_step("State file exists", {"path": str(state_file)})
            
            status = "FAILED" if errors else "PASSED"
            self.end_test(status, {
                "snapshot": asdict(snapshot),
                "context_plan": context_plan
            }, errors, warnings)
            
        except Exception as e:
            self.end_test("FAILED", {"exception": str(e)}, [str(e)])
    
    def test_medium_task_multiple_files(self):
        """Test medium task: Edit multiple files."""
        self.start_test("medium_task_multiple_files")
        
        try:
            # Simulate task with 25 files
            files = [f"apps/api/src/file_{i}.py" for i in range(25)]
            task_detection = self.task_detector.detect_task(
                agent_message="Refactor multiple services",
                files=files
            )
            
            self.log_step("Task detected", {
                "primary_task": task_detection.primary_task,
                "file_count": len(files)
            })
            
            current_task = {
                'primary_task': task_detection.primary_task,
                'files': files,
                'user_message': 'Refactor multiple services'
            }
            
            context_plan = self.preloader.manage_context(current_task)
            snapshot = self.capture_context_snapshot(context_plan)
            
            self.log_step("Context plan generated", {
                "active_context_count": len(context_plan['active_context']),
                "total_tokens": snapshot.total_tokens
            })
            
            errors = []
            warnings = []
            
            # Should still only load 2 files (minimal)
            if len(context_plan['active_context']) > 5:
                warnings.append(f"Too many active context files: {len(context_plan['active_context'])}")
            
            status = "FAILED" if errors else "PASSED"
            self.end_test(status, {
                "snapshot": asdict(snapshot)
            }, errors, warnings)
            
        except Exception as e:
            self.end_test("FAILED", {"exception": str(e)}, [str(e)])
    
    def test_large_task_many_files(self):
        """Test large task: Many files changed."""
        self.start_test("large_task_many_files")
        
        try:
            # Simulate task with 200 files
            files = [f"apps/api/src/file_{i}.py" for i in range(200)]
            task_detection = self.task_detector.detect_task(
                agent_message="Large refactoring",
                files=files
            )
            
            self.log_step("Task detected", {
                "primary_task": task_detection.primary_task,
                "file_count": len(files)
            })
            
            current_task = {
                'primary_task': task_detection.primary_task,
                'files': files,
                'user_message': 'Large refactoring'
            }
            
            context_plan = self.preloader.manage_context(current_task)
            snapshot = self.capture_context_snapshot(context_plan)
            
            self.log_step("Context plan generated", {
                "active_context_count": len(context_plan['active_context']),
                "total_tokens": snapshot.total_tokens
            })
            
            errors = []
            warnings = []
            
            # Should still maintain minimal loading
            if len(context_plan['active_context']) > 10:
                warnings.append(f"Too many active context files for large task: {len(context_plan['active_context'])}")
            
            status = "FAILED" if errors else "PASSED"
            self.end_test(status, {
                "snapshot": asdict(snapshot)
            }, errors, warnings)
            
        except Exception as e:
            self.end_test("FAILED", {"exception": str(e)}, [str(e)])
    
    def test_context_unloading(self):
        """Test context unloading between tasks."""
        self.start_test("context_unloading")
        
        try:
            errors = []
            warnings = []
            
            # Task 1: Edit Python file
            files1 = ["apps/api/src/service1.py"]
            task1 = {
                'primary_task': 'edit_code',
                'files': files1,
                'user_message': 'Edit service1'
            }
            
            context_plan1 = self.preloader.manage_context(task1)
            snapshot1 = self.capture_context_snapshot(context_plan1)
            
            self.log_step("Task 1 context", {
                "active_context": context_plan1['active_context'],
                "active_tokens": snapshot1.active_tokens
            })
            
            # Task 2: Run tests (different context needed)
            files2 = ["apps/api/src/service1.test.ts"]
            task2 = {
                'primary_task': 'run_tests',
                'files': files2,
                'user_message': 'Run tests'
            }
            
            context_plan2 = self.preloader.manage_context(task2)
            snapshot2 = self.capture_context_snapshot(context_plan2)
            
            self.log_step("Task 2 context", {
                "active_context": context_plan2['active_context'],
                "context_to_unload": context_plan2['context_to_unload'],
                "active_tokens": snapshot2.active_tokens
            })
            
            # Verify unloading
            if len(context_plan2['context_to_unload']) == 0:
                warnings.append("No context unloaded between different tasks")
            else:
                self.log_step("Context unloaded", {
                    "unloaded_files": context_plan2['context_to_unload']
                })
            
            # Verify different context loaded
            if context_plan1['active_context'] == context_plan2['active_context']:
                warnings.append("Same context loaded for different task types")
            
            status = "FAILED" if errors else "PASSED"
            self.end_test(status, {
                "snapshot1": asdict(snapshot1),
                "snapshot2": asdict(snapshot2),
                "unloaded_count": len(context_plan2['context_to_unload'])
            }, errors, warnings)
            
        except Exception as e:
            self.end_test("FAILED", {"exception": str(e)}, [str(e)])
    
    def test_file_specific_context(self):
        """Test file-specific context is suggested, not loaded."""
        self.start_test("file_specific_context")
        
        try:
            # Edit database file
            files = ["libs/common/prisma/schema.prisma"]
            task = {
                'primary_task': 'edit_code',
                'files': files,
                'user_message': 'Update schema'
            }
            
            context_plan = self.preloader.manage_context(task)
            snapshot = self.capture_context_snapshot(context_plan)
            
            self.log_step("Context plan", {
                "active_context": context_plan['active_context'],
                "suggested_context": context_plan['suggested_context']
            })
            
            errors = []
            warnings = []
            
            # Database context should be in suggested, not active
            db_context = [f for f in context_plan['suggested_context'] if 'schema.prisma' in f or '05-data' in f]
            if not db_context:
                warnings.append("Database context not suggested for schema file")
            
            # Should still only have 2 active files
            if len(context_plan['active_context']) != 2:
                errors.append(f"Expected 2 active context files, got {len(context_plan['active_context'])}")
            
            status = "FAILED" if errors else "PASSED"
            self.end_test(status, {
                "snapshot": asdict(snapshot)
            }, errors, warnings)
            
        except Exception as e:
            self.end_test("FAILED", {"exception": str(e)}, [str(e)])
    
    def test_state_persistence(self):
        """Test state persistence across runs."""
        self.start_test("state_persistence")
        
        try:
            errors = []
            warnings = []
            
            # First run
            files1 = ["apps/api/src/file1.py"]
            task1 = {
                'primary_task': 'edit_code',
                'files': files1,
                'user_message': 'Edit file1'
            }
            
            context_plan1 = self.preloader.manage_context(task1)
            snapshot1 = self.capture_context_snapshot(context_plan1)
            
            self.log_step("First run", {
                "active_context": context_plan1['active_context']
            })
            
            # Check state file exists
            state_file = self.preloader.state_file
            if not state_file.exists():
                errors.append(f"State file not created: {state_file}")
            else:
                # Read state file
                with open(state_file, 'r') as f:
                    state_data = json.load(f)
                
                self.log_step("State file read", {
                    "active_in_state": state_data.get('active', []),
                    "preloaded_in_state": state_data.get('preloaded', [])
                })
                
                # Verify state matches
                if state_data.get('active', []) != context_plan1['active_context']:
                    errors.append("State file doesn't match active context")
            
            # Create new preloader instance (simulates new run)
            new_preloader = ContextPreloader(self.predictor, self.context_loader, state_file)
            
            # Second run - should use persisted state
            files2 = ["apps/api/src/file2.py"]
            task2 = {
                'primary_task': 'run_tests',
                'files': files2,
                'user_message': 'Run tests'
            }
            
            context_plan2 = new_preloader.manage_context(task2)
            snapshot2 = self.capture_context_snapshot(context_plan2)
            
            self.log_step("Second run (new instance)", {
                "active_context": context_plan2['active_context'],
                "context_to_unload": context_plan2['context_to_unload']
            })
            
            # Should unload previous context
            if len(context_plan2['context_to_unload']) == 0:
                warnings.append("No context unloaded in second run (state persistence may not be working)")
            
            status = "FAILED" if errors else "PASSED"
            self.end_test(status, {
                "snapshot1": asdict(snapshot1),
                "snapshot2": asdict(snapshot2),
                "state_file_exists": state_file.exists()
            }, errors, warnings)
            
        except Exception as e:
            self.end_test("FAILED", {"exception": str(e)}, [str(e)])
    
    def test_prediction_accuracy(self):
        """Test prediction system."""
        self.start_test("prediction_accuracy")
        
        try:
            # Task 1: Edit code
            task1 = {
                'primary_task': 'edit_code',
                'files': ['apps/api/src/service.py'],
                'user_message': 'Edit service'
            }
            
            predictions1 = self.predictor.predict_next_tasks(task1)
            
            self.log_step("Predictions for edit_code", {
                "predictions": [f"{p.task} ({p.probability:.0%})" for p in predictions1]
            })
            
            # Task 2: Run tests (actual next task)
            task2 = {
                'primary_task': 'run_tests',
                'files': ['apps/api/src/service.test.ts'],
                'user_message': 'Run tests'
            }
            
            # Log prediction outcome
            self.analytics.log_prediction(
                predicted=[{
                    'task': p.task,
                    'probability': p.probability,
                    'reason': p.reason
                } for p in predictions1],
                actual='run_tests',
                context={'test': True}
            )
            
            self.log_step("Prediction logged", {
                "predicted": [p.task for p in predictions1],
                "actual": 'run_tests'
            })
            
            errors = []
            warnings = []
            
            # Check if run_tests was predicted
            predicted_tasks = [p.task for p in predictions1]
            if 'run_tests' not in predicted_tasks:
                warnings.append("run_tests not predicted after edit_code")
            
            status = "PASSED"
            self.end_test(status, {
                "predictions": [asdict(p) for p in predictions1]
            }, errors, warnings)
            
        except Exception as e:
            self.end_test("FAILED", {"exception": str(e)}, [str(e)])
    
    def run_all_tests(self):
        """Run all tests."""
        logger.info(
            "Starting comprehensive test suite",
            operation="run_all_tests",
            test_count=7
        )
        
        # Run all tests
        self.test_small_task_python_edit()
        self.test_medium_task_multiple_files()
        self.test_large_task_many_files()
        self.test_context_unloading()
        self.test_file_specific_context()
        self.test_state_persistence()
        self.test_prediction_accuracy()
        
        # Generate report
        self.generate_report()
    
    def generate_report(self):
        """Generate comprehensive test report."""
        report_path = self.output_dir / "test_report.json"
        summary_path = self.output_dir / "test_summary.md"
        
        # JSON report
        report_data = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "test_results": [asdict(r) for r in self.test_results],
            "context_snapshots": [asdict(s) for s in self.context_snapshots],
            "summary": {
                "total_tests": len(self.test_results),
                "passed": len([r for r in self.test_results if r.status == "PASSED"]),
                "failed": len([r for r in self.test_results if r.status == "FAILED"]),
                "total_errors": sum(len(r.errors) for r in self.test_results),
                "total_warnings": sum(len(r.warnings) for r in self.test_results)
            }
        }
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False)
        
        # Markdown summary
        summary_lines = [
            "# Predictive Context Management System - Test Report",
            "",
            f"**Generated:** {datetime.now(timezone.utc).isoformat()}",
            "",
            "## Summary",
            "",
            f"- **Total Tests:** {report_data['summary']['total_tests']}",
            f"- **Passed:** {report_data['summary']['passed']}",
            f"- **Failed:** {report_data['summary']['failed']}",
            f"- **Total Errors:** {report_data['summary']['total_errors']}",
            f"- **Total Warnings:** {report_data['summary']['total_warnings']}",
            "",
            "## Test Results",
            ""
        ]
        
        for result in self.test_results:
            status_icon = "✅" if result.status == "PASSED" else "❌" if result.status == "FAILED" else "⚠️"
            summary_lines.append(f"### {status_icon} {result.test_name}")
            summary_lines.append(f"- **Status:** {result.status}")
            summary_lines.append(f"- **Duration:** {result.duration_ms:.2f}ms")
            if result.errors:
                summary_lines.append(f"- **Errors:** {len(result.errors)}")
                for error in result.errors:
                    summary_lines.append(f"  - {error}")
            if result.warnings:
                summary_lines.append(f"- **Warnings:** {len(result.warnings)}")
                for warning in result.warnings:
                    summary_lines.append(f"  - {warning}")
            summary_lines.append("")
        
        summary_lines.extend([
            "## Context Snapshots",
            "",
            "### Token Usage Over Time",
            ""
        ])
        
        for i, snapshot in enumerate(self.context_snapshots):
            summary_lines.append(f"#### Snapshot {i+1} - {snapshot.timestamp}")
            summary_lines.append(f"- **Active Context:** {len(snapshot.active_context)} files, {snapshot.active_tokens:,} tokens")
            summary_lines.append(f"- **Pre-loaded Context:** {len(snapshot.preloaded_context)} files, {snapshot.preloaded_tokens:,} tokens")
            summary_lines.append(f"- **Total Tokens:** {snapshot.total_tokens:,}")
            summary_lines.append(f"- **Context to Unload:** {len(snapshot.context_to_unload)} files")
            summary_lines.append("")
        
        with open(summary_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(summary_lines))
        
        logger.info(
            "Test report generated",
            operation="generate_report",
            report_path=str(report_path),
            summary_path=str(summary_path)
        )
        
        print(f"\n✅ Test Report: {report_path}")
        print(f"✅ Test Summary: {summary_path}")


def main():
    """Main entry point."""
    tester = PredictiveContextSystemTester()
    tester.run_all_tests()
    
    # Print summary
    passed = len([r for r in tester.test_results if r.status == "PASSED"])
    failed = len([r for r in tester.test_results if r.status == "FAILED"])
    
    print(f"\n{'='*60}")
    print(f"Test Suite Complete: {passed} passed, {failed} failed")
    print(f"{'='*60}\n")
    
    return 0 if failed == 0 else 1


if __name__ == '__main__':
    sys.exit(main())











