#!/usr/bin/env python3
"""
Unit tests for Phase 2 fixes: Dependency expansion.

Tests:
- Issue 3: Cascade dependencies are loaded recursively
- Circular dependency handling
- Dependency priority assignment
"""

import pytest
import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor" / "context_manager"))

from context_manager.context_loader import ContextLoader, ContextRequirement


class TestDependencyExpansion:
    """Test Issue 3: Cascade dependencies are loaded recursively."""
    
    def test_dependencies_are_added_with_high_priority(self):
        """Verify dependencies are added as HIGH priority."""
        context_profiles = {
            "edit_code": {
                "python": {
                    "required": ["@rules/python_bible.mdc"],
                    "optional": [],
                    "file_specific": {}
                }
            }
        }
        
        dependencies = {
            "@rules/python_bible.mdc": ["@rules/02-core.mdc", "@rules/07-observability.mdc"]
        }
        
        loader = ContextLoader()
        loader.context_profiles = context_profiles
        loader.dependencies = dependencies
        
        reqs = loader.get_required_context("edit_code", language="python", file_paths=["app/main.py"])
        
        paths = {r.file_path: r for r in reqs}
        
        # Verify all files are present
        assert "@rules/python_bible.mdc" in paths
        assert "@rules/02-core.mdc" in paths
        assert "@rules/07-observability.mdc" in paths
        
        # Verify priorities
        assert paths["@rules/python_bible.mdc"].priority == "PRIMARY"
        assert paths["@rules/02-core.mdc"].priority == "HIGH"
        assert paths["@rules/07-observability.mdc"].priority == "HIGH"
        
        # Verify categories
        assert paths["@rules/python_bible.mdc"].category == "required"
        assert paths["@rules/02-core.mdc"].category == "dependency"
        assert paths["@rules/07-observability.mdc"].category == "dependency"
    
    def test_dependencies_are_loaded_recursively(self):
        """Verify nested dependencies are loaded."""
        context_profiles = {
            "edit_code": {
                "python": {
                    "required": ["@rules/python_bible.mdc"],
                    "optional": [],
                    "file_specific": {}
                }
            }
        }
        
        dependencies = {
            "@rules/python_bible.mdc": ["@rules/02-core.mdc"],
            "@rules/02-core.mdc": ["@rules/07-observability.mdc"]
        }
        
        loader = ContextLoader()
        loader.context_profiles = context_profiles
        loader.dependencies = dependencies
        
        reqs = loader.get_required_context("edit_code", language="python", file_paths=["app/main.py"])
        
        paths = {r.file_path: r for r in reqs}
        
        # Verify all three levels are loaded
        assert "@rules/python_bible.mdc" in paths
        assert "@rules/02-core.mdc" in paths
        assert "@rules/07-observability.mdc" in paths
    
    def test_circular_dependencies_are_handled(self):
        """Verify circular dependencies don't cause infinite loops."""
        context_profiles = {
            "edit_code": {
                "python": {
                    "required": ["@rules/file_a.mdc"],
                    "optional": [],
                    "file_specific": {}
                }
            }
        }
        
        # Circular dependency: A -> B -> A
        dependencies = {
            "@rules/file_a.mdc": ["@rules/file_b.mdc"],
            "@rules/file_b.mdc": ["@rules/file_a.mdc"]
        }
        
        loader = ContextLoader()
        loader.context_profiles = context_profiles
        loader.dependencies = dependencies
        
        # Should not raise or loop infinitely
        reqs = loader.get_required_context("edit_code", language="python", file_paths=["app/main.py"])
        
        paths = {r.file_path: r for r in reqs}
        
        # Verify both files are present (visited set prevents infinite loop)
        assert "@rules/file_a.mdc" in paths
        assert "@rules/file_b.mdc" in paths
    
    def test_existing_dependency_keeps_higher_priority(self):
        """Verify if dependency already exists with higher priority, it's not downgraded."""
        context_profiles = {
            "edit_code": {
                "python": {
                    "required": ["@rules/python_bible.mdc", "@rules/02-core.mdc"],  # 02-core already PRIMARY
                    "optional": [],
                    "file_specific": {}
                }
            }
        }
        
        dependencies = {
            "@rules/python_bible.mdc": ["@rules/02-core.mdc"]  # 02-core is dependency of python_bible
        }
        
        loader = ContextLoader()
        loader.context_profiles = context_profiles
        loader.dependencies = dependencies
        
        reqs = loader.get_required_context("edit_code", language="python", file_paths=["app/main.py"])
        
        paths = {r.file_path: r for r in reqs}
        
        # Verify 02-core keeps PRIMARY priority (not downgraded to HIGH)
        assert paths["@rules/02-core.mdc"].priority == "PRIMARY"
        assert paths["@rules/02-core.mdc"].category == "required"
    
    def test_dependency_upgrades_lower_priority(self):
        """Verify dependencies upgrade existing lower priority requirements."""
        context_profiles = {
            "edit_code": {
                "python": {
                    "required": ["@rules/python_bible.mdc"],
                    "optional": ["@rules/02-core.mdc"],  # 02-core is optional (MEDIUM)
                    "file_specific": {}
                }
            }
        }
        
        dependencies = {
            "@rules/python_bible.mdc": ["@rules/02-core.mdc"]  # 02-core is dependency
        }
        
        loader = ContextLoader()
        loader.context_profiles = context_profiles
        loader.dependencies = dependencies
        
        reqs = loader.get_required_context("edit_code", language="python", file_paths=["app/main.py"])
        
        paths = {r.file_path: r for r in reqs}
        
        # Verify 02-core is upgraded to HIGH (dependency priority)
        assert paths["@rules/02-core.mdc"].priority == "HIGH"
        assert "dependency" in paths["@rules/02-core.mdc"].category.lower() or \
               "upgraded" in paths["@rules/02-core.mdc"].reason.lower()


if __name__ == "__main__":
    pytest.main([__file__, "-v"])











