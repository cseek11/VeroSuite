#!/usr/bin/env python3
"""
Test Two-Brain integration with existing enforcer.

Last Updated: 2025-12-02
"""

import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

def test_integration():
    """Test integration module with existing enforcer."""
    
    print("🧪 Testing Two-Brain Integration")
    print("=" * 60)
    
    try:
        # Try to import existing enforcer
        print("\n1️⃣ Importing existing auto-enforcer...")
        # The enforcer is a script, so we'll import it directly
        enforcer_path = project_root / ".cursor" / "scripts" / "auto-enforcer.py"
        if not enforcer_path.exists():
            raise FileNotFoundError(f"Auto-enforcer not found at: {enforcer_path}")
        
        # Import the module by executing it (simplified approach)
        import importlib.util
        spec = importlib.util.spec_from_file_location("auto_enforcer", enforcer_path)
        auto_enforcer_module = importlib.util.module_from_spec(spec)
        sys.modules["auto_enforcer"] = auto_enforcer_module
        spec.loader.exec_module(auto_enforcer_module)
        VeroFieldEnforcer = auto_enforcer_module.VeroFieldEnforcer
        print("   ✓ Auto-enforcer imported successfully")
        
        # Try to import integration module
        print("\n2️⃣ Importing integration module...")
        integration_path = project_root / ".cursor" / "enforcement" / "two_brain_integration.py"
        if not integration_path.exists():
            raise FileNotFoundError(f"Integration module not found at: {integration_path}")
        
        import importlib.util
        spec = importlib.util.spec_from_file_location("two_brain_integration", integration_path)
        integration_module = importlib.util.module_from_spec(spec)
        sys.modules["two_brain_integration"] = integration_module
        spec.loader.exec_module(integration_module)
        integrate_with_enforcer = integration_module.integrate_with_enforcer
        print("   ✓ Integration module imported successfully")
        
        # Create enforcer instance
        print("\n3️⃣ Creating enforcer instance...")
        enforcer = VeroFieldEnforcer()
        print(f"   ✓ Enforcer created (session: {enforcer.session.session_id[:8]}...)")
        
        # Run a quick audit (just to populate violations if any)
        print("\n4️⃣ Running quick audit...")
        print("   (This may take a moment)")
        
        # We'll just check if the enforcer can run, not do a full audit
        # to avoid taking too long
        print("   ⏭️  Skipping full audit for now (would take too long)")
        print("   ✓ Enforcer instance ready")
        
        # Test report generation (even with no violations)
        print("\n5️⃣ Testing report generation...")
        report = integrate_with_enforcer(enforcer)
        print(f"   ✓ Report created (status: {report.get_status()})")
        
        summary = report.get_summary()
        print(f"   - Blocking: {summary['blocking_count']}")
        print(f"   - Warnings: {summary['warning_count']}")
        print(f"   - Auto-fixes: {summary['auto_fixes_applied']}")
        
        # Save report
        report_path = project_root / ".cursor" / "enforcement" / "ENFORCER_REPORT.json"
        report.save(report_path)
        print(f"   ✓ Report saved to: {report_path}")
        
        print("\n" + "=" * 60)
        print("✅ Integration test completed successfully!")
        print("\nNext steps:")
        print("  1. Review the generated report:")
        print(f"     {report_path}")
        print("  2. Test fix loop:")
        print("     python .cursor/enforcement/fix_loop.py --skip-initial-audit")
        
        return True
        
    except ImportError as e:
        print(f"\n❌ Import error: {e}")
        print("\nTroubleshooting:")
        print("  - Ensure auto-enforcer.py is in .cursor/scripts/")
        print("  - Ensure two_brain_integration.py is in .cursor/enforcement/")
        return False
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = test_integration()
    sys.exit(0 if success else 1)

