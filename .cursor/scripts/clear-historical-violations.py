#!/usr/bin/env python3
"""
Clear Historical Violations Script

Removes all violations with session_scope="historical" from the enforcement session.
This allows the system to start fresh without being blocked by old violations.

Usage:
    python .cursor/scripts/clear-historical-violations.py
"""

import json
import sys
from pathlib import Path
from datetime import datetime, timezone

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="clear_historical_violations")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("clear_historical_violations")


def clear_historical_violations():
    """Clear all historical violations from the enforcement session."""
    session_file = project_root / ".cursor" / "enforcement" / "session.json"
    
    if not session_file.exists():
        logger.warn(
            "Session file does not exist",
            operation="clear_historical_violations",
            file_path=str(session_file)
        )
        print("❌ Session file not found. Nothing to clear.")
        return False
    
    try:
        # Load session
        with open(session_file, 'r', encoding='utf-8') as f:
            session_data = json.load(f)
        
        # Count violations before clearing
        all_violations = session_data.get('violations', [])
        historical_violations = [
            v for v in all_violations 
            if v.get('session_scope') == 'historical'
        ]
        current_violations = [
            v for v in all_violations 
            if v.get('session_scope') != 'historical'
        ]
        
        print(f"📊 Current state:")
        print(f"   Total violations: {len(all_violations)}")
        print(f"   Historical violations: {len(historical_violations)}")
        print(f"   Current session violations: {len(current_violations)}")
        
        if not historical_violations:
            print("✅ No historical violations to clear.")
            return True
        
        # Filter out historical violations
        session_data['violations'] = current_violations
        
        # Update last_check timestamp
        session_data['last_check'] = datetime.now(timezone.utc).isoformat()
        
        # Save updated session
        with open(session_file, 'w', encoding='utf-8') as f:
            json.dump(session_data, f, indent=2)
        
        logger.info(
            f"Cleared {len(historical_violations)} historical violations",
            operation="clear_historical_violations",
            historical_count=len(historical_violations),
            remaining_count=len(current_violations)
        )
        
        print(f"\n✅ Cleared {len(historical_violations)} historical violations")
        print(f"   Remaining violations: {len(current_violations)}")
        
        # Regenerate status files by running enforcer
        print(f"\n🔄 Regenerating status files...")
        try:
            import subprocess
            result = subprocess.run(
                [sys.executable, str(project_root / ".cursor" / "scripts" / "auto-enforcer.py")],
                cwd=project_root,
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode == 0:
                print("✅ Status files regenerated successfully")
                return True
            else:
                print(f"⚠️  Enforcer completed with warnings (return code: {result.returncode})")
                print("   Status files may have been updated. Check AGENT_STATUS.md for details.")
                return True
        except Exception as e:
            logger.warn(
                f"Failed to regenerate status files: {e}",
                operation="clear_historical_violations",
                error_code="STATUS_REGENERATION_FAILED",
                root_cause=str(e)
            )
            print(f"⚠️  Could not regenerate status files automatically: {e}")
            print("   Please run manually: python .cursor/scripts/auto-enforcer.py")
            return True  # Still successful - violations were cleared
        
    except json.JSONDecodeError as e:
        logger.error(
            "Session file is corrupted",
            operation="clear_historical_violations",
            error_code="JSON_DECODE_ERROR",
            root_cause=str(e)
        )
        print(f"❌ Error: Session file is corrupted: {e}")
        return False
    except Exception as e:
        logger.error(
            f"Failed to clear historical violations: {e}",
            operation="clear_historical_violations",
            error_code="CLEAR_FAILED",
            root_cause=str(e)
        )
        print(f"❌ Error: {e}")
        return False


def main():
    """Main entry point."""
    print("=" * 60)
    print("Clear Historical Violations")
    print("=" * 60)
    print()
    
    success = clear_historical_violations()
    
    print()
    print("=" * 60)
    if success:
        print("✅ Historical violations cleared successfully")
        print()
        print("Next steps:")
        print("1. Check .cursor/enforcement/AGENT_STATUS.md for updated status")
        print("2. If status is still BLOCKED, check for current session violations")
        print("3. Current session violations can be auto-fixed")
    else:
        print("❌ Failed to clear historical violations")
        print("   Check logs for details")
    
    return 0 if success else 1


if __name__ == '__main__':
    sys.exit(main())







