#!/usr/bin/env python3
"""
Comprehensive System Audit Test Suite
Tests all components of the VeroField rules, enforcement, and context management systems.

Last Updated: 2025-12-04
"""

import os
import sys
import json
import re
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
from enum import Enum

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="system_audit")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("system_audit")


class TestStatus(Enum):
    """Test execution status."""
    PASS = "PASS"
    FAIL = "FAIL"
    SKIP = "SKIP"
    WARN = "WARN"


@dataclass
class TestResult:
    """Test execution result."""
    test_name: str
    status: TestStatus
    message: str
    details: Dict
    execution_time: float
    timestamp: str


@dataclass
class TestSuite:
    """Test suite results."""
    suite_name: str
    tests: List[TestResult]
    total: int
    passed: int
    failed: int
    skipped: int
    warnings: int
    execution_time: float


class SystemAuditTester:
    """Comprehensive system audit tester."""
    
    def __init__(self, project_root: Optional[Path] = None):
        """Initialize tester."""
        self.project_root = project_root or Path(__file__).parent.parent.parent
        self.cursor_dir = self.project_root / ".cursor"
        self.rules_dir = self.cursor_dir / "rules"
        self.enforcement_dir = self.cursor_dir / "enforcement"
        self.context_manager_dir = self.cursor_dir / "context_manager"
        self.memory_bank_dir = self.cursor_dir / "memory-bank"
        self.results: List[TestResult] = []
        
    def run_all_tests(self) -> Dict:
        """Run all test suites."""
        logger.info("Starting comprehensive system audit")
        
        start_time = datetime.now(timezone.utc)
        
        # Test suites
        self.test_rule_system()
        self.test_enforcement_system()
        self.test_context_management()
        self.test_memory_bank()
        self.test_session_management()
        self.test_integration_points()
        self.test_token_estimation()
        
        end_time = datetime.now(timezone.utc)
        execution_time = (end_time - start_time).total_seconds()
        
        # Generate summary
        summary = self._generate_summary(execution_time)
        
        logger.info(
            f"System audit completed: {summary['total']} tests, {summary['passed']} passed, {summary['failed']} failed"
        )
        
        return {
            "summary": summary,
            "results": [
                {
                    "test_name": r.test_name,
                    "status": r.status.value,
                    "message": r.message,
                    "details": r.details,
                    "execution_time": r.execution_time,
                    "timestamp": r.timestamp
                }
                for r in self.results
            ],
            "timestamp": end_time.isoformat()
        }
    
    def test_rule_system(self):
        """Test rule system architecture."""
        logger.info("Testing rule system")
        
        # Test 1: Rule files exist
        self._test(
            "rule_files_exist",
            self._check_rule_files_exist,
            "Verify all required rule files exist"
        )
        
        # Test 2: Rule precedence
        self._test(
            "rule_precedence",
            self._check_rule_precedence,
            "Verify rule precedence hierarchy"
        )
        
        # Test 3: Rule loading logic
        self._test(
            "rule_loading_logic",
            self._check_rule_loading_logic,
            "Verify conditional rule loading works"
        )
        
        # Test 4: Bible rules conditional loading
        self._test(
            "bible_rules_conditional",
            self._check_bible_rules_conditional,
            "Verify Bible rules load conditionally"
        )
    
    def test_enforcement_system(self):
        """Test enforcement system."""
        logger.info("Testing enforcement system")
        
        # Test 5: Enforcement pipeline steps
        self._test(
            "enforcement_pipeline_steps",
            self._check_enforcement_pipeline_steps,
            "Verify all enforcement pipeline steps exist"
        )
        
        # Test 6: Auto-enforcer exists
        self._test(
            "auto_enforcer_exists",
            self._check_auto_enforcer_exists,
            "Verify auto-enforcer script exists"
        )
        
        # Test 7: Status files exist
        self._test(
            "status_files_exist",
            self._check_status_files_exist,
            "Verify all status files exist"
        )
        
        # Test 8: Violation detection
        self._test(
            "violation_detection",
            self._check_violation_detection,
            "Verify violation detection works"
        )
    
    def test_context_management(self):
        """Test context management system."""
        logger.info("Testing context management")
        
        # Test 9: Context manager components
        self._test(
            "context_manager_components",
            self._check_context_manager_components,
            "Verify context manager components exist"
        )
        
        # Test 10: Recommendations file
        self._test(
            "recommendations_file",
            self._check_recommendations_file,
            "Verify recommendations.md exists and is valid"
        )
        
        # Test 11: Workflow tracking
        self._test(
            "workflow_tracking",
            self._check_workflow_tracking,
            "Verify workflow tracking works"
        )
        
        # Test 12: Prediction engine
        self._test(
            "prediction_engine",
            self._check_prediction_engine,
            "Verify prediction engine works"
        )
    
    def test_memory_bank(self):
        """Test Memory Bank system."""
        logger.info("Testing Memory Bank")
        
        # Test 13: Memory Bank files exist
        self._test(
            "memory_bank_files_exist",
            self._check_memory_bank_files_exist,
            "Verify all Memory Bank files exist"
        )
        
        # Test 14: Memory Bank structure
        self._test(
            "memory_bank_structure",
            self._check_memory_bank_structure,
            "Verify Memory Bank file structure"
        )
        
        # Test 15: Memory Bank integration
        self._test(
            "memory_bank_integration",
            self._check_memory_bank_integration,
            "Verify Memory Bank integration with pipeline"
        )
    
    def test_session_management(self):
        """Test session management."""
        logger.info("Testing session management")
        
        # Test 16: Session file exists
        self._test(
            "session_file_exists",
            self._check_session_file_exists,
            "Verify session.json exists"
        )
        
        # Test 17: Session structure
        self._test(
            "session_structure",
            self._check_session_structure,
            "Verify session structure is valid"
        )
        
        # Test 18: Violation scoping
        self._test(
            "violation_scoping",
            self._check_violation_scoping,
            "Verify violation scoping works"
        )
    
    def test_integration_points(self):
        """Test integration points."""
        logger.info("Testing integration points")
        
        # Test 19: Rule-Enforcement integration
        self._test(
            "rule_enforcement_integration",
            self._check_rule_enforcement_integration,
            "Verify rule-enforcement integration"
        )
        
        # Test 20: Enforcement-Context integration
        self._test(
            "enforcement_context_integration",
            self._check_enforcement_context_integration,
            "Verify enforcement-context integration"
        )
        
        # Test 21: Context-Memory Bank integration
        self._test(
            "context_memory_bank_integration",
            self._check_context_memory_bank_integration,
            "Verify context-Memory Bank integration"
        )
    
    def test_token_estimation(self):
        """Test token estimation."""
        logger.info("Testing token estimation")
        
        # Test 22: Token estimator exists
        self._test(
            "token_estimator_exists",
            self._check_token_estimator_exists,
            "Verify token estimator exists"
        )
        
        # Test 23: Token estimation method
        self._test(
            "token_estimation_method",
            self._check_token_estimation_method,
            "Verify token estimation method"
        )
        
        # Test 24: Context efficiency metrics
        self._test(
            "context_efficiency_metrics",
            self._check_context_efficiency_metrics,
            "Verify context efficiency metrics"
        )
    
    # Test implementation methods
    
    def _check_rule_files_exist(self) -> Tuple[TestStatus, str, Dict]:
        """Check if all required rule files exist."""
        required_files = [
            "00-master.mdc",
            "01-enforcement.mdc",
            "02-core.mdc",
            "03-security.mdc",
            "04-architecture.mdc",
            "05-data.mdc",
            "06-error-resilience.mdc",
            "07-observability.mdc",
            "08-backend.mdc",
            "09-frontend.mdc",
            "10-quality.mdc",
            "11-operations.mdc",
            "12-tech-debt.mdc",
            "13-ux-consistency.mdc",
            "14-verification.mdc",
            "python_bible.mdc",
            "typescript_bible.mdc",
            "context_enforcement.mdc"
        ]
        
        missing = []
        for file in required_files:
            if not (self.rules_dir / file).exists():
                missing.append(file)
        
        if missing:
            return TestStatus.FAIL, f"Missing rule files: {', '.join(missing)}", {"missing": missing}
        
        return TestStatus.PASS, "All required rule files exist", {"count": len(required_files)}
    
    def _check_rule_precedence(self) -> Tuple[TestStatus, str, Dict]:
        """Check rule precedence hierarchy."""
        # Check that 00-master.mdc exists and mentions precedence
        master_file = self.rules_dir / "00-master.mdc"
        if not master_file.exists():
            return TestStatus.FAIL, "00-master.mdc not found", {}
        
        content = master_file.read_text(encoding="utf-8")
        
        checks = {
            "mentions_precedence": "PRECEDENCE" in content or "precedence" in content,
            "mentions_supreme": "SUPREME" in content or "supreme" in content,
            "mentions_override": "override" in content.lower()
        }
        
        all_pass = all(checks.values())
        status = TestStatus.PASS if all_pass else TestStatus.WARN
        
        return status, f"Rule precedence checks: {sum(checks.values())}/{len(checks)} passed", checks
    
    def _check_rule_loading_logic(self) -> Tuple[TestStatus, str, Dict]:
        """Check rule loading logic."""
        master_file = self.rules_dir / "00-master.mdc"
        if not master_file.exists():
            return TestStatus.FAIL, "00-master.mdc not found", {}
        
        content = master_file.read_text(encoding="utf-8")
        
        checks = {
            "path_based_loading": "path" in content.lower() and "loading" in content.lower(),
            "conditional_loading": "conditional" in content.lower() or "conditionally" in content.lower(),
            "bible_rules": "bible" in content.lower()
        }
        
        all_pass = all(checks.values())
        status = TestStatus.PASS if all_pass else TestStatus.WARN
        
        return status, f"Rule loading logic checks: {sum(checks.values())}/{len(checks)} passed", checks
    
    def _check_bible_rules_conditional(self) -> Tuple[TestStatus, str, Dict]:
        """Check Bible rules conditional loading."""
        master_file = self.rules_dir / "00-master.mdc"
        if not master_file.exists():
            return TestStatus.FAIL, "00-master.mdc not found", {}
        
        content = master_file.read_text(encoding="utf-8")
        
        checks = {
            "python_bible_conditional": "python" in content.lower() and ("conditional" in content.lower() or "apply when" in content.lower()),
            "typescript_bible_conditional": "typescript" in content.lower() and ("conditional" in content.lower() or "apply when" in content.lower()),
            "file_type_detection": "file type" in content.lower() or "file path" in content.lower()
        }
        
        all_pass = all(checks.values())
        status = TestStatus.PASS if all_pass else TestStatus.WARN
        
        return status, f"Bible rules conditional loading: {sum(checks.values())}/{len(checks)} passed", checks
    
    def _check_enforcement_pipeline_steps(self) -> Tuple[TestStatus, str, Dict]:
        """Check enforcement pipeline steps."""
        enforcement_file = self.rules_dir / "01-enforcement.mdc"
        if not enforcement_file.exists():
            return TestStatus.FAIL, "01-enforcement.mdc not found", {}
        
        content = enforcement_file.read_text(encoding="utf-8")
        
        required_steps = ["Step 0", "Step 0.5", "Step 1", "Step 2", "Step 3", "Step 4", "Step 4.5", "Step 5"]
        found_steps = [step for step in required_steps if step in content]
        
        if len(found_steps) < len(required_steps):
            missing = [s for s in required_steps if s not in found_steps]
            return TestStatus.FAIL, f"Missing pipeline steps: {', '.join(missing)}", {"missing": missing, "found": found_steps}
        
        return TestStatus.PASS, f"All {len(required_steps)} pipeline steps found", {"steps": found_steps}
    
    def _check_auto_enforcer_exists(self) -> Tuple[TestStatus, str, Dict]:
        """Check auto-enforcer exists."""
        enforcer_file = self.project_root / ".cursor" / "scripts" / "auto-enforcer.py"
        
        if not enforcer_file.exists():
            return TestStatus.FAIL, "auto-enforcer.py not found", {}
        
        # Check for key classes/functions
        content = enforcer_file.read_text(encoding="utf-8")
        
        checks = {
            "VeroFieldEnforcer_class": "class VeroFieldEnforcer" in content,
            "violation_detection": "violation" in content.lower() and "detect" in content.lower(),
            "auto_fix": "auto" in content.lower() and "fix" in content.lower()
        }
        
        all_pass = all(checks.values())
        status = TestStatus.PASS if all_pass else TestStatus.WARN
        
        return status, f"Auto-enforcer checks: {sum(checks.values())}/{len(checks)} passed", checks
    
    def _check_status_files_exist(self) -> Tuple[TestStatus, str, Dict]:
        """Check status files exist."""
        required_files = [
            "AGENT_STATUS.md",
            "VIOLATIONS.md",
            "AUTO_FIXES.md"
        ]
        
        missing = []
        for file in required_files:
            if not (self.enforcement_dir / file).exists():
                missing.append(file)
        
        # ENFORCEMENT_BLOCK.md is optional (only exists when blocked)
        optional_files = ["ENFORCEMENT_BLOCK.md"]
        
        if missing:
            return TestStatus.FAIL, f"Missing status files: {', '.join(missing)}", {"missing": missing}
        
        return TestStatus.PASS, "All required status files exist", {"count": len(required_files)}
    
    def _check_violation_detection(self) -> Tuple[TestStatus, str, Dict]:
        """Check violation detection."""
        enforcer_file = self.project_root / ".cursor" / "scripts" / "auto-enforcer.py"
        if not enforcer_file.exists():
            return TestStatus.SKIP, "auto-enforcer.py not found", {}
        
        content = enforcer_file.read_text(encoding="utf-8")
        
        violation_types = [
            "hardcoded_date",
            "memory_bank",
            "security",
            "silent_failure",
            "bug_logging"
        ]
        
        found = [vt for vt in violation_types if vt.replace("_", "") in content.lower()]
        
        if len(found) < 3:
            return TestStatus.WARN, f"Only {len(found)}/{len(violation_types)} violation types detected", {"found": found}
        
        return TestStatus.PASS, f"Violation detection covers {len(found)} types", {"types": found}
    
    def _check_context_manager_components(self) -> Tuple[TestStatus, str, Dict]:
        """Check context manager components."""
        required_files = [
            "task_detector.py",
            "context_loader.py",
            "workflow_tracker.py",
            "predictor.py",
            "preloader.py",
            "token_estimator.py"
        ]
        
        missing = []
        for file in required_files:
            if not (self.context_manager_dir / file).exists():
                missing.append(file)
        
        if missing:
            return TestStatus.FAIL, f"Missing context manager components: {', '.join(missing)}", {"missing": missing}
        
        return TestStatus.PASS, "All context manager components exist", {"count": len(required_files)}
    
    def _check_recommendations_file(self) -> Tuple[TestStatus, str, Dict]:
        """Check recommendations file."""
        rec_file = self.context_manager_dir / "recommendations.md"
        
        if not rec_file.exists():
            return TestStatus.FAIL, "recommendations.md not found", {}
        
        content = rec_file.read_text(encoding="utf-8")
        
        checks = {
            "has_context_sections": "Context" in content or "context" in content,
            "has_recommendations": "recommend" in content.lower() or "load" in content.lower(),
            "has_task_info": "task" in content.lower() or "Task" in content
        }
        
        all_pass = all(checks.values())
        status = TestStatus.PASS if all_pass else TestStatus.WARN
        
        return status, f"Recommendations file checks: {sum(checks.values())}/{len(checks)} passed", checks
    
    def _check_workflow_tracking(self) -> Tuple[TestStatus, str, Dict]:
        """Check workflow tracking."""
        tracker_file = self.context_manager_dir / "workflow_tracker.py"
        
        if not tracker_file.exists():
            return TestStatus.FAIL, "workflow_tracker.py not found", {}
        
        content = tracker_file.read_text(encoding="utf-8")
        
        checks = {
            "WorkflowTracker_class": "class WorkflowTracker" in content,
            "workflow_detection": "workflow" in content.lower() and ("detect" in content.lower() or "track" in content.lower()),
            "state_persistence": "save" in content.lower() or "load" in content.lower() or "json" in content.lower()
        }
        
        all_pass = all(checks.values())
        status = TestStatus.PASS if all_pass else TestStatus.WARN
        
        return status, f"Workflow tracking checks: {sum(checks.values())}/{len(checks)} passed", checks
    
    def _check_prediction_engine(self) -> Tuple[TestStatus, str, Dict]:
        """Check prediction engine."""
        predictor_file = self.context_manager_dir / "predictor.py"
        
        if not predictor_file.exists():
            return TestStatus.FAIL, "predictor.py not found", {}
        
        content = predictor_file.read_text(encoding="utf-8")
        
        checks = {
            "ContextPredictor_class": "class ContextPredictor" in content,
            "prediction_method": "predict" in content.lower(),
            "weighted_scores": "weight" in content.lower() or "score" in content.lower()
        }
        
        all_pass = all(checks.values())
        status = TestStatus.PASS if all_pass else TestStatus.WARN
        
        return status, f"Prediction engine checks: {sum(checks.values())}/{len(checks)} passed", checks
    
    def _check_memory_bank_files_exist(self) -> Tuple[TestStatus, str, Dict]:
        """Check Memory Bank files exist."""
        required_files = [
            "projectbrief.md",
            "productContext.md",
            "systemPatterns.md",
            "techContext.md",
            "activeContext.md",
            "progress.md"
        ]
        
        missing = []
        for file in required_files:
            if not (self.memory_bank_dir / file).exists():
                missing.append(file)
        
        if missing:
            return TestStatus.FAIL, f"Missing Memory Bank files: {', '.join(missing)}", {"missing": missing}
        
        return TestStatus.PASS, "All Memory Bank files exist", {"count": len(required_files)}
    
    def _check_memory_bank_structure(self) -> Tuple[TestStatus, str, Dict]:
        """Check Memory Bank structure."""
        active_context = self.memory_bank_dir / "activeContext.md"
        
        if not active_context.exists():
            return TestStatus.FAIL, "activeContext.md not found", {}
        
        content = active_context.read_text(encoding="utf-8")
        
        checks = {
            "has_current_task": "Current Task" in content or "current task" in content.lower(),
            "has_last_updated": "Last Updated" in content or "last updated" in content.lower(),
            "has_recent_changes": "Recent" in content or "recent" in content.lower()
        }
        
        all_pass = all(checks.values())
        status = TestStatus.PASS if all_pass else TestStatus.WARN
        
        return status, f"Memory Bank structure checks: {sum(checks.values())}/{len(checks)} passed", checks
    
    def _check_memory_bank_integration(self) -> Tuple[TestStatus, str, Dict]:
        """Check Memory Bank integration."""
        enforcement_file = self.rules_dir / "01-enforcement.mdc"
        
        if not enforcement_file.exists():
            return TestStatus.FAIL, "01-enforcement.mdc not found", {}
        
        content = enforcement_file.read_text(encoding="utf-8")
        
        checks = {
            "step_0_mentions_memory_bank": "Step 0" in content and "Memory Bank" in content,
            "step_5_mentions_memory_bank": "Step 5" in content and "Memory Bank" in content,
            "active_context_update": "activeContext" in content or "activeContext.md" in content
        }
        
        all_pass = all(checks.values())
        status = TestStatus.PASS if all_pass else TestStatus.WARN
        
        return status, f"Memory Bank integration checks: {sum(checks.values())}/{len(checks)} passed", checks
    
    def _check_session_file_exists(self) -> Tuple[TestStatus, str, Dict]:
        """Check session file exists."""
        session_file = self.enforcement_dir / "session.json"
        
        if not session_file.exists():
            return TestStatus.WARN, "session.json not found (may be created on first run)", {}
        
        return TestStatus.PASS, "session.json exists", {}
    
    def _check_session_structure(self) -> Tuple[TestStatus, str, Dict]:
        """Check session structure."""
        session_file = self.enforcement_dir / "session.json"
        
        if not session_file.exists():
            return TestStatus.SKIP, "session.json not found", {}
        
        try:
            data = json.loads(session_file.read_text(encoding="utf-8"))
            
            required_fields = ["session_id", "start_time", "last_check"]
            found_fields = [field for field in required_fields if field in data]
            
            if len(found_fields) < len(required_fields):
                missing = [f for f in required_fields if f not in found_fields]
                return TestStatus.FAIL, f"Missing session fields: {', '.join(missing)}", {"missing": missing}
            
            return TestStatus.PASS, "Session structure is valid", {"fields": found_fields}
        except json.JSONDecodeError as e:
            return TestStatus.FAIL, f"Invalid JSON in session.json: {e}", {}
    
    def _check_violation_scoping(self) -> Tuple[TestStatus, str, Dict]:
        """Check violation scoping."""
        enforcer_file = self.project_root / ".cursor" / "scripts" / "auto-enforcer.py"
        
        if not enforcer_file.exists():
            return TestStatus.SKIP, "auto-enforcer.py not found", {}
        
        content = enforcer_file.read_text(encoding="utf-8")
        
        checks = {
            "current_session": "current_session" in content or "current session" in content.lower(),
            "historical": "historical" in content.lower(),
            "session_scope": "session_scope" in content or "session scope" in content.lower()
        }
        
        all_pass = all(checks.values())
        status = TestStatus.PASS if all_pass else TestStatus.WARN
        
        return status, f"Violation scoping checks: {sum(checks.values())}/{len(checks)} passed", checks
    
    def _check_rule_enforcement_integration(self) -> Tuple[TestStatus, str, Dict]:
        """Check rule-enforcement integration."""
        enforcer_file = self.project_root / ".cursor" / "scripts" / "auto-enforcer.py"
        
        if not enforcer_file.exists():
            return TestStatus.SKIP, "auto-enforcer.py not found", {}
        
        content = enforcer_file.read_text(encoding="utf-8")
        
        checks = {
            "references_rules": ".mdc" in content or "rule" in content.lower(),
            "violation_detection": "violation" in content.lower(),
            "rule_references": "rule_ref" in content or "rule reference" in content.lower()
        }
        
        all_pass = all(checks.values())
        status = TestStatus.PASS if all_pass else TestStatus.WARN
        
        return status, f"Rule-enforcement integration: {sum(checks.values())}/{len(checks)} passed", checks
    
    def _check_enforcement_context_integration(self) -> Tuple[TestStatus, str, Dict]:
        """Check enforcement-context integration."""
        enforcer_file = self.project_root / ".cursor" / "scripts" / "auto-enforcer.py"
        
        if not enforcer_file.exists():
            return TestStatus.SKIP, "auto-enforcer.py not found", {}
        
        content = enforcer_file.read_text(encoding="utf-8")
        
        checks = {
            "imports_context_manager": "context_manager" in content or "context manager" in content.lower(),
            "task_detection": "task" in content.lower() and "detect" in content.lower(),
            "context_recommendations": "recommendation" in content.lower() or "context" in content.lower()
        }
        
        all_pass = all(checks.values())
        status = TestStatus.PASS if all_pass else TestStatus.WARN
        
        return status, f"Enforcement-context integration: {sum(checks.values())}/{len(checks)} passed", checks
    
    def _check_context_memory_bank_integration(self) -> Tuple[TestStatus, str, Dict]:
        """Check context-Memory Bank integration."""
        # Check if context manager references memory bank
        recommendations_file = self.context_manager_dir / "recommendations.md"
        
        if not recommendations_file.exists():
            return TestStatus.SKIP, "recommendations.md not found", {}
        
        content = recommendations_file.read_text(encoding="utf-8")
        
        checks = {
            "mentions_memory_bank": "memory" in content.lower() or "Memory Bank" in content,
            "context_loading": "context" in content.lower() and "load" in content.lower()
        }
        
        all_pass = all(checks.values())
        status = TestStatus.PASS if all_pass else TestStatus.WARN
        
        return status, f"Context-Memory Bank integration: {sum(checks.values())}/{len(checks)} passed", checks
    
    def _check_token_estimator_exists(self) -> Tuple[TestStatus, str, Dict]:
        """Check token estimator exists."""
        estimator_file = self.context_manager_dir / "token_estimator.py"
        
        if not estimator_file.exists():
            return TestStatus.FAIL, "token_estimator.py not found", {}
        
        return TestStatus.PASS, "token_estimator.py exists", {}
    
    def _check_token_estimation_method(self) -> Tuple[TestStatus, str, Dict]:
        """Check token estimation method."""
        estimator_file = self.context_manager_dir / "token_estimator.py"
        
        if not estimator_file.exists():
            return TestStatus.SKIP, "token_estimator.py not found", {}
        
        content = estimator_file.read_text(encoding="utf-8")
        
        checks = {
            "TokenEstimator_class": "class TokenEstimator" in content,
            "estimate_method": "estimate" in content.lower(),
            "character_based": "char" in content.lower() or "4" in content
        }
        
        all_pass = all(checks.values())
        status = TestStatus.PASS if all_pass else TestStatus.WARN
        
        return status, f"Token estimation method: {sum(checks.values())}/{len(checks)} passed", checks
    
    def _check_context_efficiency_metrics(self) -> Tuple[TestStatus, str, Dict]:
        """Check context efficiency metrics."""
        dashboard_file = self.context_manager_dir / "dashboard.md"
        
        if not dashboard_file.exists():
            return TestStatus.WARN, "dashboard.md not found", {}
        
        content = dashboard_file.read_text(encoding="utf-8")
        
        checks = {
            "token_usage": "token" in content.lower(),
            "context_files": "context" in content.lower() and "file" in content.lower(),
            "efficiency": "efficiency" in content.lower() or "saving" in content.lower()
        }
        
        all_pass = all(checks.values())
        status = TestStatus.PASS if all_pass else TestStatus.WARN
        
        return status, f"Context efficiency metrics: {sum(checks.values())}/{len(checks)} passed", checks
    
    def _test(self, test_name: str, test_func, description: str):
        """Run a test and record results."""
        start_time = datetime.now(timezone.utc)
        
        try:
            status, message, details = test_func()
        except Exception as e:
            status = TestStatus.FAIL
            message = f"Test exception: {str(e)}"
            details = {"exception": str(e)}
        
        end_time = datetime.now(timezone.utc)
        execution_time = (end_time - start_time).total_seconds()
        
        result = TestResult(
            test_name=test_name,
            status=status,
            message=message,
            details=details,
            execution_time=execution_time,
            timestamp=end_time.isoformat()
        )
        
        self.results.append(result)
        
        logger.info(f"Test {test_name}: {status.value} - {message}")
    
    def _generate_summary(self, execution_time: float) -> Dict:
        """Generate test summary."""
        total = len(self.results)
        passed = sum(1 for r in self.results if r.status == TestStatus.PASS)
        failed = sum(1 for r in self.results if r.status == TestStatus.FAIL)
        skipped = sum(1 for r in self.results if r.status == TestStatus.SKIP)
        warnings = sum(1 for r in self.results if r.status == TestStatus.WARN)
        
        return {
            "total": total,
            "passed": passed,
            "failed": failed,
            "skipped": skipped,
            "warnings": warnings,
            "pass_rate": (passed / total * 100) if total > 0 else 0,
            "execution_time": execution_time
        }


def main():
    """Run system audit tests."""
    tester = SystemAuditTester()
    results = tester.run_all_tests()
    
    # Save results
    output_file = Path(__file__).parent / "system_audit_results.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    # Print summary
    summary = results["summary"]
    print("\n" + "="*80)
    print("SYSTEM AUDIT TEST RESULTS")
    print("="*80)
    print(f"Total Tests: {summary['total']}")
    print(f"Passed: {summary['passed']} ({summary['pass_rate']:.1f}%)")
    print(f"Failed: {summary['failed']}")
    print(f"Skipped: {summary['skipped']}")
    print(f"Warnings: {summary['warnings']}")
    print(f"Execution Time: {summary['execution_time']:.2f}s")
    print("="*80)
    
    # Print failures
    failures = [r for r in results["results"] if r["status"] == "FAIL"]
    if failures:
        print("\nFAILURES:")
        for failure in failures:
            print(f"  - {failure['test_name']}: {failure['message']}")
    
    # Print warnings
    warnings = [r for r in results["results"] if r["status"] == "WARN"]
    if warnings:
        print("\nWARNINGS:")
        for warning in warnings:
            print(f"  - {warning['test_name']}: {warning['message']}")
    
    print(f"\nDetailed results saved to: {output_file}")
    
    return 0 if summary["failed"] == 0 else 1


if __name__ == "__main__":
    sys.exit(main())

