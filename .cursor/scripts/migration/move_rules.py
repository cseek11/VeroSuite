#!/usr/bin/env python3
"""
Move existing rules to enforcer-only directory.

Last Updated: 2025-12-02
"""

import shutil
from pathlib import Path


def move_rules():
    """Move rule files to enforcement/rules/."""
    
    source = Path(".cursor/rules")
    target = Path(".cursor/enforcement/rules")
    
    # Rules to move (enforcer-only)
    rules_to_move = [
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
        "context_enforcement.mdc",
    ]
    
    # Create backup
    backup = Path(".cursor/rules_backup")
    backup.mkdir(exist_ok=True)
    
    moved = []
    skipped = []
    
    for rule in rules_to_move:
        source_file = source / rule
        target_file = target / rule
        backup_file = backup / rule
        
        if source_file.exists():
            # Backup
            shutil.copy2(source_file, backup_file)
            # Move
            target_file.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(source_file), str(target_file))
            moved.append(rule)
            print(f"✓ Moved: {rule}")
        else:
            skipped.append(rule)
            print(f"⊘ Skipped (not found): {rule}")
    
    print(f"\n✅ Moved {len(moved)} rules")
    print(f"⊘ Skipped {len(skipped)} rules")
    print(f"📦 Backup saved to: {backup}")


if __name__ == "__main__":
    move_rules()






