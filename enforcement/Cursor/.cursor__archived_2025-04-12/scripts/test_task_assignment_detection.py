#!/usr/bin/env python3
"""
Test script to trace task assignment detection in the enforcer.

This script runs the enforcer with a user message and traces each step
to see why task assignment detection might not be working.

Last Updated: 2025-12-04
"""

import sys
import json
from pathlib import Path
from datetime import datetime, timezone

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

# Add context_manager parent to path (same as auto-enforcer.py)
context_manager_path = project_root / ".cursor" / "context_manager"
if context_manager_path.exists():
    sys.path.insert(0, str(context_manager_path.parent))

# Import enforcer components (handle hyphenated filename)
import importlib.util
enforcer_path = project_root / ".cursor" / "scripts" / "auto-enforcer.py"
spec = importlib.util.spec_from_file_location("auto_enforcer", enforcer_path)
auto_enforcer_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(auto_enforcer_module)
VeroFieldEnforcer = auto_enforcer_module.VeroFieldEnforcer

from context_manager.session_sequence_tracker import SessionSequenceTracker

def test_task_assignment_detection():
    """Test task assignment detection with tracing."""
    
    print("=" * 80)
    print("TASK ASSIGNMENT DETECTION TEST")
    print("=" * 80)
    print()
    
    # Test message
    test_message = "Run the enforcer again"
    print(f"Test Message: '{test_message}'")
    print()
    
    # Initialize enforcer
    print("Step 1: Initializing enforcer...")
    enforcer = VeroFieldEnforcer()
    print(f"  ✓ Enforcer initialized")
    print(f"  ✓ Session ID: {enforcer.session.session_id if enforcer.session else 'None'}")
    print(f"  ✓ Session Sequence Tracker: {'Available' if enforcer.session_sequence_tracker else 'Not available'}")
    print()
    
    # Check if session sequence tracker is available
    if not enforcer.session_sequence_tracker:
        print("  ⚠️  WARNING: Session sequence tracker not available!")
        print("  Attempting to initialize manually...")
        try:
            from context_manager.session_sequence_tracker import SessionSequenceTracker
            if enforcer.session:
                enforcer.session_sequence_tracker = SessionSequenceTracker(enforcer.session.session_id)
                print("  ✓ Session sequence tracker initialized manually")
            else:
                print("  ❌ ERROR: No session available to initialize tracker")
                return
        except Exception as e:
            print(f"  ❌ ERROR: Failed to initialize tracker: {e}")
            return
    
    # Test imperative verb detection directly
    print("Step 2: Testing imperative verb detection directly...")
    task_type = "edit_code"  # Simulated detected task
    confidence = 0.5  # Low confidence (should trigger imperative verb check)
    
    is_assigned = enforcer.session_sequence_tracker.is_task_assigned(
        task_type=task_type,
        user_message=test_message,
        confidence=confidence
    )
    
    print(f"  Task Type: {task_type}")
    print(f"  User Message: '{test_message}'")
    print(f"  Confidence: {confidence}")
    print(f"  Is Assigned: {is_assigned}")
    print()
    
    if is_assigned:
        print("  ✓ Imperative verb detection WORKING!")
    else:
        print("  ❌ Imperative verb detection NOT WORKING!")
        print("  Checking why...")
        
        # Check imperative verbs
        user_message_lower = test_message.lower()
        imperative_verbs = [
            'run', 'execute', 'try', 'do', 'perform', 'run the', 'try running',
            'please run', 'please execute', 'can you run', 'could you run',
            'run this', 'execute this', 'try this', 'do this'
        ]
        
        print(f"  User message (lowercase): '{user_message_lower}'")
        print(f"  Checking imperative verbs:")
        for verb in imperative_verbs:
            if verb in user_message_lower:
                print(f"    ✓ Found: '{verb}' in message")
            else:
                print(f"    ✗ Not found: '{verb}'")
        print()
    
    # Test with _update_context_recommendations
    print("Step 3: Testing _update_context_recommendations with user message...")
    print(f"  Calling _update_context_recommendations(user_message='{test_message}')")
    print()
    
    try:
        # Capture what happens
        enforcer._update_context_recommendations(user_message=test_message)
        print("  ✓ _update_context_recommendations completed")
    except Exception as e:
        print(f"  ❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
    
    print()
    
    # Check recommendations.md
    print("Step 4: Checking recommendations.md...")
    recommendations_file = project_root / ".cursor" / "context_manager" / "recommendations.md"
    content = ""
    recommendations_show_assigned = False
    
    if recommendations_file.exists():
        with open(recommendations_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Check for key indicators
        if "NO TASK ASSIGNED YET" in content:
            print("  ❌ Recommendations show 'NO TASK ASSIGNED YET'")
            print("  → Task assignment was NOT detected")
            recommendations_show_assigned = False
        elif "Type:" in content and "None" in content and "Waiting for task assignment" in content:
            print("  ❌ Recommendations show task type 'None' (Waiting for task assignment)")
            print("  → Task assignment was NOT detected")
            recommendations_show_assigned = False
        else:
            print("  ✓ Recommendations show a task is assigned")
            recommendations_show_assigned = True
            # Extract task type
            if "**Type:**" in content:
                lines = content.split('\n')
                for i, line in enumerate(lines):
                    if "**Type:**" in line:
                        print(f"  → Task type: {line.strip()}")
                        break
    else:
        print("  ❌ Recommendations file does not exist")
    
    print()
    
    # Summary
    print("=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    print()
    print(f"Test Message: '{test_message}'")
    print(f"Direct Detection (is_task_assigned): {is_assigned}")
    print(f"Recommendations Status: {'Assigned' if recommendations_show_assigned else 'Not Assigned'}")
    print()
    
    if is_assigned and recommendations_show_assigned:
        print("✅ SUCCESS: Task assignment detection is working!")
    else:
        print("❌ FAILURE: Task assignment detection is NOT working!")
        print()
        print("Diagnosis:")
        if not is_assigned:
            print("  ❌ Imperative verb detection returned False")
            print("     → Check imperative_verbs list and matching logic")
        if not recommendations_show_assigned:
            print("  ❌ Recommendations still show 'NO TASK ASSIGNED YET'")
            print("     → Check if _update_context_recommendations is being called correctly")
            print("     → Check if there's an early return before task assignment check")
            print("     → Check if task_assigned=False is causing minimal recommendations")

if __name__ == '__main__':
    test_task_assignment_detection()

