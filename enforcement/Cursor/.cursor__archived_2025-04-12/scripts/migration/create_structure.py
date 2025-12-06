#!/usr/bin/env python3
"""
Create new Two-Brain directory structure.

Last Updated: 2025-12-04
"""

import os
from pathlib import Path


def create_structure():
    """Create all new directories."""
    
    base = Path(".cursor")
    
    # New directories
    dirs = [
        base / "enforcement" / "rules",
        base / "scripts" / "migration",
    ]
    
    for dir_path in dirs:
        dir_path.mkdir(parents=True, exist_ok=True)
        print(f"✓ Created: {dir_path}")
    
    print("\n✅ Directory structure created")


if __name__ == "__main__":
    create_structure()









