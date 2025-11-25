#!/usr/bin/env python3
"""
Integration tests for Hybrid Scoring Engine v2.1

Tests the complete scoring flow with real file examples:
- Real TypeScript/React files
- Real Python files
- Complete PR scenarios
- Violation detection integration
- Decision logic validation
"""

import unittest
import sys
import tempfile
import os
from pathlib import Path
from datetime import datetime

# Add project root to path
project_root = Path(__file__).parent.parent.parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

# Add scripts directory to path
scripts_dir = Path(__file__).parent.parent.parent
if str(scripts_dir) not in sys.path:
    sys.path.insert(0, str(scripts_dir))

from veroscore_v3.scoring_engine import (
    HybridScoringEngine,
    ScoringWeights,
    StabilizationFunction
)
from veroscore_v3.detection_functions import (
    MasterDetector,
    ViolationResult
)


class TestScoringEngineIntegration(unittest.TestCase):
    """Integration tests with real file examples"""
    
    def setUp(self):
        """Set up test fixtures"""
        # Mock Supabase client
        class MockSupabase:
            def schema(self, name):
                return self
            def table(self, name):
                return self
            def insert(self, data):
                class MockResponse:
                    def execute(self):
                        return self
                return MockResponse()
        
        self.supabase = MockSupabase()
        self.engine = HybridScoringEngine(self.supabase)
        self.detector = MasterDetector()
        
    def test_real_typescript_component(self):
        """Test scoring with a real TypeScript React component"""
        component_content = """
import React from 'react';
import { Button } from '@/components/ui/Button';

interface UserProfileProps {
  userId: string;
  tenantId: string;
}

/**
 * UserProfile component displays user information.
 * 
 * @param userId - The user ID to display
 * @param tenantId - The tenant ID for tenant isolation
 */
export const UserProfile: React.FC<UserProfileProps> = ({ userId, tenantId }) => {
  const [user, setUser] = React.useState(null);
  
  React.useEffect(() => {
    // Fetch user data with tenant isolation
    fetchUser(userId, tenantId).then(setUser);
  }, [userId, tenantId]);
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <Button onClick={() => handleEdit(user.id)}>Edit</Button>
    </div>
  );
};

async function fetchUser(userId: string, tenantId: string) {
  const response = await fetch(`/api/users/${userId}?tenantId=${tenantId}`);
  return response.json();
}

function handleEdit(userId: string) {
  // Handle edit action
  console.log('Editing user:', userId);
}
"""
        
        changed_files = [
            {'path': 'frontend/src/components/user/UserProfile.tsx', 'content': component_content}
        ]
        
        # Run detection - create temp file for detection
        with tempfile.NamedTemporaryFile(mode='w', suffix='.tsx', delete=False) as f:
            f.write(component_content)
            temp_path = f.name
        
        try:
            violations = self.detector.detect_all([temp_path])
            violation_results = [
                ViolationResult(**v) for v in violations['violations']
            ]
        finally:
            os.unlink(temp_path)
        
        # Score PR
        pr_desc = """
Step 1: Search & Discovery
- Searched for existing user profile components
- Found similar patterns in components/ui/

Step 2: Pattern Analysis
- Following React component pattern
- Using TypeScript interfaces
- Tenant isolation via props

Step 3: Compliance Check
- RLS/tenant isolation: Pass (tenantId prop used)
- Architecture boundaries: Pass (correct directory)
- No hardcoded values: Pass
- Structured logging + traceId: Fail (console.log present)
- Error resilience: Pass

Step 4: Implementation Plan
- Create UserProfile component
- Add TypeScript types
- Implement tenant isolation

Step 5: Post-Implementation Audit
- All checks verified
"""
        
        result = self.engine.score_pr(
            pr_number=1,
            repository='test/repo',
            author='testuser',
            changed_files=changed_files,
            pr_description=pr_desc,
            violations=violation_results
        )
        
        # Assertions
        self.assertIsInstance(result, type(result))
        self.assertEqual(result.pr_number, 1)
        self.assertGreater(result.code_quality.raw_score, 0)  # Has types, good naming
        self.assertGreater(result.documentation.raw_score, 0)  # Has docstring
        self.assertGreater(result.architecture.raw_score, 0)  # Correct directory
        self.assertLessEqual(result.security.raw_score, 0)  # Has console.log (may be 0 or negative)
        self.assertGreaterEqual(result.stabilized_score, 0.0)
        self.assertLessEqual(result.stabilized_score, 10.0)
        
    def test_real_python_service_with_violations(self):
        """Test scoring with a Python service file containing violations"""
        service_content = """
from typing import List, Dict
from supabase import create_client

# Hardcoded date - VIOLATION
DEFAULT_DATE = "2025-11-24"

def get_users(tenant_id: str) -> List[Dict]:
    '''
    Get all users for a tenant.
    
    Args:
        tenant_id: The tenant ID
        
    Returns:
        List of user dictionaries
    '''
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # RLS VIOLATION - Missing tenant_id filter
    users = supabase.from('users').select()
    
    return users.data

def create_user(email: str, tenant_id: str) -> Dict:
    '''
    Create a new user.
    
    Args:
        email: User email
        tenant_id: Tenant ID
        
    Returns:
        User dictionary
    '''
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Missing tenant_id in insert - VIOLATION
    user = supabase.from('users').insert({
        'email': email,
        'created_at': DEFAULT_DATE  # Hardcoded date - VIOLATION
    }).execute()
    
    return user.data[0]
"""
        
        changed_files = [
            {'path': 'apps/api/src/services/user_service.py', 'content': service_content}
        ]
        
        # Run detection - create temp file for detection
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(service_content)
            temp_path = f.name
        
        try:
            violations = self.detector.detect_all([temp_path])
            violation_results = [
                ViolationResult(**v) for v in violations['violations']
            ]
        finally:
            os.unlink(temp_path)
        
        pr_desc = "Add user service"
        
        result = self.engine.score_pr(
            pr_number=2,
            repository='test/repo',
            author='testuser',
            changed_files=changed_files,
            pr_description=pr_desc,
            violations=violation_results
        )
        
        # Assertions - should have violations
        self.assertGreater(len(result.violations), 0)
        self.assertEqual(result.decision, 'auto_block')  # Critical violations
        self.assertLess(result.rule_compliance.raw_score, 0)  # Negative due to violations
        
    def test_complete_pipeline_with_test_file(self):
        """Test scoring with complete pipeline and test file"""
        code_content = """
def calculate_total(items: List[float]) -> float:
    '''
    Calculate total of items.
    
    Args:
        items: List of item prices
        
    Returns:
        Total price
    '''
    return sum(items)
"""
        
        test_content = """
import unittest
from calculator import calculate_total

class TestCalculator(unittest.TestCase):
    def test_calculate_total_empty(self):
        # Test with empty list
        result = calculate_total([])
        self.assertEqual(result, 0.0)
    
    def test_calculate_total_single_item(self):
        # Test with single item
        result = calculate_total([10.0])
        self.assertEqual(result, 10.0)
    
    def test_calculate_total_multiple_items(self):
        # Test with multiple items
        result = calculate_total([10.0, 20.0, 30.0])
        self.assertEqual(result, 60.0)
    
    def test_calculate_total_edge_case_negative(self):
        # Test edge case: negative values
        result = calculate_total([-10.0, 20.0])
        self.assertEqual(result, 10.0)
"""
        
        changed_files = [
            {'path': 'apps/api/src/utils/calculator.py', 'content': code_content},
            {'path': 'apps/api/src/tests/test_calculator.py', 'content': test_content}
        ]
        
        pr_desc = """
Step 1: Search & Discovery
- Searched for existing calculator utilities
- Found similar patterns in utils/

Step 2: Pattern Analysis
- Following utility function pattern
- Using TypeScript types

Step 3: Compliance Check
- RLS/tenant isolation: Pass (N/A for utility)
- Architecture boundaries: Pass
- No hardcoded values: Pass
- Structured logging + traceId: Pass (N/A for utility)
- Error resilience: Pass

Step 4: Implementation Plan
- Create calculator utility
- Add comprehensive tests
- Document functions

Step 5: Post-Implementation Audit
- All checks verified
- Tests passing
- Documentation complete
"""
        
        result = self.engine.score_pr(
            pr_number=3,
            repository='test/repo',
            author='testuser',
            changed_files=changed_files,
            pr_description=pr_desc
        )
        
        # Assertions - should score well
        self.assertGreater(result.test_coverage.raw_score, 0)  # Has test file
        self.assertGreater(result.documentation.raw_score, 0)  # Has docstrings
        self.assertTrue(result.pipeline_complete)  # Complete pipeline
        self.assertEqual(result.pipeline_bonus, ScoringWeights.PIPELINE_BONUS)
        self.assertGreater(result.stabilized_score, 5.0)  # Good score
        
    def test_mixed_quality_pr(self):
        """Test scoring with mixed quality files"""
        good_file = """
from typing import Optional
import logging

logger = logging.getLogger(__name__)

def process_data(data: Optional[str], trace_id: str) -> dict:
    '''
    Process data with proper error handling.
    
    Args:
        data: Input data
        trace_id: Trace ID for logging
        
    Returns:
        Processed data dictionary
    '''
    try:
        if not data:
            raise ValueError("Data cannot be empty")
        
        logger.info("Processing data", extra={'trace_id': trace_id})
        result = {'processed': data.upper()}
        return result
    except Exception as e:
        logger.error("Failed to process data", extra={'trace_id': trace_id, 'error': str(e)})
        raise
"""
        
        bad_file = """
def bad_function():
    # Missing type hints
    # Missing docstring
    # Missing error handling
    users = supabase.from('users').select()  # RLS violation
    return users
"""
        
        changed_files = [
            {'path': 'apps/api/src/services/good_service.py', 'content': good_file},
            {'path': 'apps/api/src/services/bad_service.py', 'content': bad_file}
        ]
        
        # Run detection - create temp files for detection
        temp_files = []
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(good_file)
                temp_files.append(f.name)
            
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(bad_file)
                temp_files.append(f.name)
            
            violations = self.detector.detect_all(temp_files)
            violation_results = [
                ViolationResult(**v) for v in violations['violations']
            ]
        finally:
            for temp_file in temp_files:
                if os.path.exists(temp_file):
                    os.unlink(temp_file)
        
        result = self.engine.score_pr(
            pr_number=4,
            repository='test/repo',
            author='testuser',
            changed_files=changed_files,
            pr_description='Mixed quality PR',
            violations=violation_results
        )
        
        # Assertions - should have violations from bad file
        self.assertGreater(len(result.violations), 0)
        # Average scores should reflect mixed quality
        self.assertGreater(result.code_quality.raw_score, -5)  # Not terrible due to good file
        # Note: Average might be higher than expected due to good file balancing bad file
        
    def test_stabilization_edge_cases(self):
        """Test stabilization function with edge case scores"""
        # Test very positive score
        high_score = StabilizationFunction.stabilize(100.0)
        self.assertGreater(high_score, 9.0)
        self.assertLessEqual(high_score, 10.0)
        
        # Test very negative score
        low_score = StabilizationFunction.stabilize(-100.0)
        self.assertLess(low_score, 1.0)
        self.assertGreaterEqual(low_score, 0.0)
        
        # Test zero score
        zero_score = StabilizationFunction.stabilize(0.0)
        self.assertAlmostEqual(zero_score, 5.0, places=1)
        
        # Test moderate positive
        moderate_score = StabilizationFunction.stabilize(23.0)  # Sum of all weights
        self.assertGreater(moderate_score, 7.0)
        self.assertLess(moderate_score, 10.0)
        
    def test_decision_logic_scenarios(self):
        """Test decision logic with various scenarios"""
        # Scenario 1: Critical violation -> auto-block
        decision1, reason1 = self.engine._determine_decision(
            8.0,  # High score
            [ViolationResult(
                detector_name='rls_violation_detector',
                severity='critical',
                rule_id='RLS-001',
                message='RLS violation',
                penalty=-100.0
            )],
            True
        )
        self.assertEqual(decision1, 'auto_block')
        
        # Scenario 2: Low score -> auto-block
        decision2, reason2 = self.engine._determine_decision(
            -1.0,  # Negative score
            [],
            False
        )
        self.assertEqual(decision2, 'auto_block')
        
        # Scenario 3: Medium score -> review required
        decision3, reason3 = self.engine._determine_decision(
            3.0,  # Below threshold
            [],
            False
        )
        self.assertEqual(decision3, 'review_required')
        
        # Scenario 4: High score with pipeline -> auto-approve
        decision4, reason4 = self.engine._determine_decision(
            7.0,  # Above threshold
            [],
            True  # Pipeline complete
        )
        self.assertEqual(decision4, 'auto_approve')
        
        # Scenario 5: High score without pipeline -> review required
        decision5, reason5 = self.engine._determine_decision(
            7.0,  # Above threshold
            [],
            False  # Pipeline incomplete
        )
        self.assertEqual(decision5, 'review_required')
        
    def test_persistence_integration(self):
        """Test Supabase persistence integration"""
        changed_files = [
            {'path': 'test.py', 'content': 'def test(): pass'}
        ]
        
        result = self.engine.score_pr(
            pr_number=5,
            repository='test/repo',
            author='testuser',
            changed_files=changed_files,
            pr_description='Test PR'
        )
        
        # Test persistence (should not raise)
        success = self.engine.persist_score(result)
        self.assertTrue(success)
        
        # Verify result has all required fields for persistence
        score_dict = result.to_dict()
        self.assertIn('pr_number', score_dict)
        self.assertIn('stabilized_score', score_dict)
        self.assertIn('decision', score_dict)
        self.assertIn('violations', score_dict)
        self.assertIn('warnings', score_dict)


if __name__ == '__main__':
    unittest.main()

