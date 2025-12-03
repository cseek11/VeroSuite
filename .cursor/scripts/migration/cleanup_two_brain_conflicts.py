#!/usr/bin/env python3
"""
Cleanup script for Two-Brain Model conflicts.

Removes or disables conflicting files from Single-Brain Model.

Last Updated: 2025-12-02
"""

import shutil
from pathlib import Path
from datetime import datetime


def cleanup_conflicts():
    """Clean up conflicting files for Two-Brain Model."""
    
    project_root = Path.cwd()
    rules_dir = project_root / ".cursor" / "rules"
    
    print("🧹 Two-Brain Model: Conflict Cleanup")
    print("=" * 60)
    
    changes = []
    errors = []
    
    # 1. Disable agent-instructions.mdc
    print("\n1️⃣ Disabling agent-instructions.mdc...")
    agent_instructions = rules_dir / "agent-instructions.mdc"
    
    if agent_instructions.exists():
        try:
            # Rename to .disabled to prevent auto-loading
            disabled_name = "agent-instructions.mdc.disabled"
            disabled_path = rules_dir / disabled_name
            
            if disabled_path.exists():
                # Backup existing disabled file
                backup_name = f"agent-instructions.mdc.disabled.backup-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
                shutil.move(str(disabled_path), str(rules_dir / backup_name))
                print(f"   ✓ Backed up existing disabled file to: {backup_name}")
            
            shutil.move(str(agent_instructions), str(disabled_path))
            changes.append(f"Disabled: agent-instructions.mdc → {disabled_name}")
            print(f"   ✓ Renamed to: {disabled_name}")
        except Exception as e:
            errors.append(f"Failed to disable agent-instructions.mdc: {e}")
            print(f"   ❌ Error: {e}")
    else:
        print("   ⊘ File not found (may already be disabled)")
    
    # 2. Delete context folder
    print("\n2️⃣ Deleting .cursor/rules/context/ folder...")
    context_dir = rules_dir / "context"
    
    if context_dir.exists():
        try:
            # List files before deletion
            context_files = list(context_dir.glob("*"))
            file_count = len(context_files)
            
            # Delete the folder
            shutil.rmtree(str(context_dir))
            changes.append(f"Deleted: .cursor/rules/context/ ({file_count} files)")
            print(f"   ✓ Deleted context folder ({file_count} files)")
        except Exception as e:
            errors.append(f"Failed to delete context folder: {e}")
            print(f"   ❌ Error: {e}")
    else:
        print("   ⊘ Folder not found (may already be deleted)")
    
    # 3. Verify cleanup
    print("\n3️⃣ Verifying cleanup...")
    
    # Check agent-instructions
    if (rules_dir / "agent-instructions.mdc").exists():
        errors.append("agent-instructions.mdc still exists")
        print("   ⚠️  WARNING: agent-instructions.mdc still exists")
    else:
        print("   ✓ agent-instructions.mdc not found (disabled or removed)")
    
    # Check context folder
    if context_dir.exists():
        errors.append(".cursor/rules/context/ still exists")
        print("   ⚠️  WARNING: context folder still exists")
    else:
        print("   ✓ context folder not found (deleted)")
    
    # 4. Summary
    print("\n" + "=" * 60)
    print("📊 Cleanup Summary")
    print("=" * 60)
    
    if changes:
        print("\n✅ Changes Made:")
        for change in changes:
            print(f"   - {change}")
    
    if errors:
        print("\n❌ Errors:")
        for error in errors:
            print(f"   - {error}")
    else:
        print("\n✅ No errors")
    
    # 5. Current state
    print("\n📁 Current .cursor/rules/ Contents:")
    if rules_dir.exists():
        files = [f.name for f in rules_dir.iterdir() if f.is_file() and f.suffix == ".mdc"]
        dirs = [d.name for d in rules_dir.iterdir() if d.is_dir()]
        
        print(f"   Files: {len(files)}")
        for file in sorted(files):
            status = "⚠️" if file.startswith("agent-instructions") else "✓"
            print(f"   {status} {file}")
        
        if dirs:
            print(f"   Directories: {len(dirs)}")
            for dir_name in sorted(dirs):
                print(f"   - {dir_name}/")
        else:
            print("   Directories: 0")
    
    # 6. Expected state
    print("\n✅ Expected Two-Brain Model State:")
    print("   ✓ 00-llm-interface.mdc")
    print("   ✓ 01-llm-security-lite.mdc")
    print("   ✓ 02-llm-fix-mode.mdc")
    print("   ✓ SESSION_RESTART_REQUIRED.mdc (dynamic)")
    print("   ⊘ agent-instructions.mdc (disabled)")
    print("   ⊘ context/ folder (deleted)")
    
    print("\n" + "=" * 60)
    
    if errors:
        print("⚠️  Cleanup completed with errors")
        print("   Review errors above and fix manually if needed")
        return False
    else:
        print("✅ Cleanup completed successfully!")
        return True


if __name__ == "__main__":
    success = cleanup_conflicts()
    exit(0 if success else 1)




