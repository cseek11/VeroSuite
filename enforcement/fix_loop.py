#!/usr/bin/env python3
"""
Autonomous Fix Loop.
Repeatedly call enforcer → LLM → enforcer until clean.

Last Updated: 2025-12-05
"""

import time
import subprocess
import sys
from pathlib import Path
from typing import Optional

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

# Import with fallback for both module and direct execution
try:
    from .report_generator import EnforcerReport
    from .llm_caller import LLMCaller
except ImportError:
    # Fallback for direct execution
    enforcement_dir = Path(__file__).parent
    sys.path.insert(0, str(enforcement_dir))
    from report_generator import EnforcerReport
    from llm_caller import LLMCaller


class FixLoop:
    """Autonomous enforcement loop."""
    
    def __init__(self, max_iterations: int = 10, enforcer_script: Path = None):
        self.max_iterations = max_iterations
        self.llm_caller = LLMCaller()
        self.report_path = Path(".cursor/enforcement/ENFORCER_REPORT.json")
        
        if enforcer_script is None:
            # Try to find auto-enforcer in standard locations
            possible_paths = [
                Path(".cursor/enforcement/auto-enforcer.py"),
                Path(".cursor/scripts/auto-enforcer.py"),
            ]
            for path in possible_paths:
                if path.exists():
                    self.enforcer_script = path
                    break
            else:
                raise FileNotFoundError("Could not find auto-enforcer.py")
        else:
            self.enforcer_script = enforcer_script
        
        # Note: Enforcer doesn't have "audit" command, just run without args
        self.enforcer_args = []  # No arguments needed
    
    def run(self, initial_audit: bool = True) -> bool:
        """
        Run autonomous fix loop.
        
        Args:
            initial_audit: If True, run enforcer before starting loop
        
        Returns:
            True if system is clean, False if max iterations exceeded
        """
        
        print("🔄 Starting autonomous fix loop")
        print(f"   Max iterations: {self.max_iterations}")
        print(f"   Enforcer script: {self.enforcer_script}\n")
        
        if initial_audit:
            print("━━━━ Initial Audit ━━━━")
            print("1️⃣ Running initial auto-enforcer audit...")
            if not self._run_enforcer():
                print("❌ Initial audit failed")
                return False
        
        for iteration in range(1, self.max_iterations + 1):
            print(f"\n━━━━ Iteration {iteration}/{self.max_iterations} ━━━━")
            
            # Step 1: Load report
            print("1️⃣ Loading report...")
            report = EnforcerReport.load(self.report_path)
            
            if report is None:
                print("⚠️ No report found, running enforcer...")
                if not self._run_enforcer():
                    print("❌ Enforcer failed")
                    return False
                report = EnforcerReport.load(self.report_path)
                if report is None:
                    print("❌ Still no report after running enforcer")
                    return False
            
            # Step 2: Check status
            status = report.get_status()
            summary = report.get_summary()
            
            print(f"   Status: {status}")
            print(f"   Blocking: {summary['blocking_count']}")
            print(f"   Warnings: {summary['warning_count']}")
            print(f"   Auto-fixes: {summary['auto_fixes_applied']}")
            
            if status == "OK":
                print("\n✅ System is clean!")
                return True
            
            # Step 3: Call LLM to fix
            print(f"\n2️⃣ Calling LLM to apply fixes...")
            print(f"   {summary['blocking_count']} BLOCKING violations to fix")
            print(f"   {summary['warning_count']} WARNING violations to consider")
            
            response = self.llm_caller.call_fix_mode(self.report_path, timeout=300)
            
            if response is None:
                print("⚠️ LLM did not respond (timeout or error)")
                print("   Manual intervention may be needed")
                return False
            
            # Step 4: Check if fixes complete
            if not self.llm_caller.check_fix_complete(response):
                print("⚠️ LLM did not complete fixes")
                print("   Response may indicate issues:")
                if "[FIX_INCOMPLETE]" in response.upper():
                    print("   - LLM needs clarification")
                if "[FIX_BLOCKED]" in response.upper():
                    print("   - LLM cannot apply fix (may break functionality)")
                print("\n   Manual intervention may be needed")
                return False
            
            print("✓ Fixes applied by LLM")
            
            # Step 5: Re-run enforcer to verify
            print(f"\n3️⃣ Re-running enforcer to verify fixes...")
            if not self._run_enforcer():
                print("⚠️ Enforcer warning (may be non-fatal)")
            
            # Brief pause before next iteration
            if iteration < self.max_iterations:
                print("\n⏸️  Brief pause before next iteration...")
                time.sleep(2)
        
        print(f"\n❌ Max iterations ({self.max_iterations}) exceeded")
        print("   System may have complex violations requiring human review")
        print(f"   Check: {self.report_path}")
        return False
    
    def _run_enforcer(self) -> bool:
        """Run the auto-enforcer script."""
        
        if not self.enforcer_script.exists():
            print(f"❌ Enforcer script not found: {self.enforcer_script}")
            return False
        
        try:
            # Run enforcer (no arguments needed - it runs audit by default)
            result = subprocess.run(
                [sys.executable, str(self.enforcer_script)] + self.enforcer_args,
                capture_output=True,
                text=True,
                timeout=120,  # 2 minute timeout for enforcer
                cwd=project_root
            )
            
            if result.stdout:
                # Print enforcer output (filtered for key messages)
                for line in result.stdout.split('\n'):
                    if any(keyword in line.lower() for keyword in ['violation', 'blocking', 'warning', 'error', '✓', '❌']):
                        print(f"   {line}")
            
            if result.returncode != 0:
                print(f"⚠️ Enforcer exited with code {result.returncode}")
                if result.stderr:
                    print(f"   Error: {result.stderr[:200]}")
                return False
            
            return True
        
        except subprocess.TimeoutExpired:
            print("❌ Enforcer timeout (2 minutes)")
            return False
        except Exception as e:
            print(f"❌ Enforcer error: {e}")
            return False


def main():
    """Run the fix loop."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Autonomous fix loop for Two-Brain Model")
    parser.add_argument(
        "--max-iterations",
        type=int,
        default=10,
        help="Maximum iterations before giving up (default: 10)"
    )
    parser.add_argument(
        "--skip-initial-audit",
        action="store_true",
        help="Skip initial audit (assume report already exists)"
    )
    parser.add_argument(
        "--enforcer-script",
        type=Path,
        help="Path to auto-enforcer.py (auto-detected if not specified)"
    )
    
    args = parser.parse_args()
    
    try:
        loop = FixLoop(
            max_iterations=args.max_iterations,
            enforcer_script=args.enforcer_script
        )
        
        success = loop.run(initial_audit=not args.skip_initial_audit)
        
        if success:
            print("\n🎉 All violations resolved!")
            sys.exit(0)
        else:
            print("\n❌ Could not resolve all violations automatically")
            print(f"   Review {loop.report_path} for details")
            sys.exit(1)
    
    except KeyboardInterrupt:
        print("\n\n🛑 Fix loop interrupted by user")
        sys.exit(130)
    except Exception as e:
        print(f"\n❌ Fix loop error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()

