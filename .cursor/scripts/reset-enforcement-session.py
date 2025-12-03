#!/usr/bin/env python3
"""
Reset Enforcement Session Script

Creates a completely fresh enforcement session, clearing all violations and starting fresh.
This is useful when historical violations are blocking work and need to be completely cleared.

Usage:
    python .cursor/scripts/reset-enforcement-session.py
"""

import json
import sys
import uuid
from pathlib import Path
from datetime import datetime, timezone

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="reset_enforcement_session")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("reset_enforcement_session")


def reset_enforcement_session():
    """Create a completely fresh enforcement session."""
    session_file = project_root / ".cursor" / "enforcement" / "session.json"
    
    # Create fresh session data
    new_session = {
        "session_id": str(uuid.uuid4()),
        "start_time": datetime.now(timezone.utc).isoformat(),
        "last_check": datetime.now(timezone.utc).isoformat(),
        "violations": [],
        "checks_passed": [],
        "checks_failed": [],
        "auto_fixes": [],
        "file_hashes": {}
    }
    
    # Backup old session if it exists
    if session_file.exists():
        backup_file = session_file.with_suffix('.json.backup')
        try:
            with open(session_file, 'r', encoding='utf-8') as f:
                old_data = json.load(f)
            
            with open(backup_file, 'w', encoding='utf-8') as f:
                json.dump(old_data, f, indent=2)
            
            old_violations = len(old_data.get('violations', []))
            print(f"📦 Backed up old session to: {backup_file.name}")
            print(f"   Old session had {old_violations} violations")
        except Exception as e:
            logger.warn(
                f"Could not backup old session: {e}",
                operation="reset_enforcement_session",
                error_code="BACKUP_FAILED",
                root_cause=str(e)
            )
            print(f"⚠️  Could not backup old session: {e}")
    
    # Write new session
    try:
        session_file.parent.mkdir(parents=True, exist_ok=True)
        with open(session_file, 'w', encoding='utf-8') as f:
            json.dump(new_session, f, indent=2)
        
        logger.info(
            "Enforcement session reset",
            operation="reset_enforcement_session",
            new_session_id=new_session["session_id"]
        )
        
        print(f"✅ Created fresh enforcement session")
        print(f"   New Session ID: {new_session['session_id']}")
        print(f"   Start Time: {new_session['start_time']}")
        
        # Regenerate status files
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
                operation="reset_enforcement_session",
                error_code="STATUS_REGENERATION_FAILED",
                root_cause=str(e)
            )
            print(f"⚠️  Could not regenerate status files automatically: {e}")
            print("   Please run manually: python .cursor/scripts/auto-enforcer.py")
            return True  # Still successful - session was reset
        
    except Exception as e:
        logger.error(
            f"Failed to reset session: {e}",
            operation="reset_enforcement_session",
            error_code="RESET_FAILED",
            root_cause=str(e)
        )
        print(f"❌ Error: {e}")
        return False


def main():
    """Main entry point."""
    print("=" * 60)
    print("Reset Enforcement Session")
    print("=" * 60)
    print()
    print("⚠️  WARNING: This will clear ALL violations and start a fresh session.")
    print("   Old session will be backed up to session.json.backup")
    print()
    
    success = reset_enforcement_session()
    
    print()
    print("=" * 60)
    if success:
        print("✅ Enforcement session reset successfully")
        print()
        print("Next steps:")
        print("1. Check .cursor/enforcement/AGENT_STATUS.md for updated status")
        print("2. The system should now be COMPLIANT (no violations)")
        print("3. New violations will be tracked from this point forward")
    else:
        print("❌ Failed to reset enforcement session")
        print("   Check logs for details")
    
    return 0 if success else 1


if __name__ == '__main__':
    sys.exit(main())







