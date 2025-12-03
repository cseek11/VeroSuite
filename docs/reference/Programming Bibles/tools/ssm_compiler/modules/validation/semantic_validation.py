"""
Semantic Validation Phase

Validates AST structure after parsing, before enrichment.
Fixes structural issues like duplicate chapter codes, incorrect heading levels,
and misclassified special sections (diagrams, appendices, etc.).

This is Solution 1 from the engineering solutions document.
"""
from __future__ import annotations

from typing import Optional, List, Dict, Set
from dataclasses import dataclass

from ..ast_nodes import ASTDocument, ASTNode

# Import runtime components (optional)
try:
    from runtime.error_bus import ErrorBus
except ImportError:
    ErrorBus = None  # type: ignore


@dataclass
class ValidationResult:
    """Result of validation phase"""
    valid: bool
    errors: List[str]
    warnings: List[str]
    fixes_applied: List[str]


class SemanticValidationPhase:
    """
    Validates structure after parsing, before enrichment.
    
    Performs:
    - Chapter code uniqueness validation
    - Heading hierarchy validation
    - Special section classification (diagrams, appendices, etc.)
    """
    
    def __init__(self, errors: Optional["ErrorBus"] = None):
        """
        Initialize validation phase.
        
        Args:
            errors: ErrorBus instance for diagnostics (optional)
        """
        self.errors = errors
        if errors is None and ErrorBus is not None:
            self.errors = ErrorBus()
    
    def execute(self, ast: ASTDocument) -> ASTDocument:
        """
        Execute validation phase on AST.
        
        Validates and fixes:
        - Duplicate chapter codes
        - Incorrect heading levels
        - Misclassified special sections
        
        Args:
            ast: AST document to validate
            
        Returns:
            Validated AST (modified in place)
        """
        result = ValidationResult(valid=True, errors=[], warnings=[], fixes_applied=[])
        
        # Validate chapter codes
        self._validate_chapter_codes(ast, result)
        
        # Validate heading hierarchy
        self._validate_heading_levels(ast, result)
        
        # Classify special sections
        self._classify_special_sections(ast, result)
        
        # Report results
        if self.errors:
            for error_msg in result.errors:
                self.errors.error(
                    code="VALIDATION_ERROR",
                    message=error_msg,
                    line=0,
                    column=0,
                    context="Semantic validation phase"
                )
            for warning_msg in result.warnings:
                self.errors.warning(
                    code="VALIDATION_WARNING",
                    message=warning_msg,
                    line=0,
                    column=0,
                    context="Semantic validation phase"
                )
        
        return ast
    
    def validate(self, ast: ASTDocument) -> bool:
        """
        Check if AST passes validation (without modifying).
        
        Args:
            ast: AST document to validate
            
        Returns:
            True if valid, False otherwise
        """
        result = ValidationResult(valid=True, errors=[], warnings=[], fixes_applied=[])
        
        # Check chapter codes (without fixing)
        chapters = ast.get_all_chapters()
        codes: Dict[str, List[ASTNode]] = {}
        
        for chapter in chapters:
            code = chapter.meta.get("code", "")
            if code:
                if code not in codes:
                    codes[code] = []
                codes[code].append(chapter)
        
        # Check for duplicates
        for code, chapter_list in codes.items():
            if len(chapter_list) > 1:
                result.valid = False
                result.errors.append(
                    f"Duplicate chapter code '{code}' found {len(chapter_list)} times"
                )
        
        # Check heading levels
        for chapter in chapters:
            level = chapter.level
            if level != 2:
                result.valid = False
                result.errors.append(
                    f"Chapter '{chapter.meta.get('title', '')}' has incorrect heading level {level} (expected 2)"
                )
        
        return result.valid
    
    def _validate_chapter_codes(self, ast: ASTDocument, result: ValidationResult):
        """
        Ensure chapter codes are globally unique.
        
        If duplicates are found, converts special sections (diagrams, etc.) to sections.
        """
        chapters = ast.get_all_chapters()
        codes: Dict[str, List[ASTNode]] = {}
        
        # Collect chapters by code
        for chapter in chapters:
            code = chapter.meta.get("code", "")
            if code:
                if code not in codes:
                    codes[code] = []
                codes[code].append(chapter)
        
        # Handle duplicates
        for code, chapter_list in codes.items():
            if len(chapter_list) > 1:
                # Separate real chapters from special sections
                real_chapters = []
                special_sections = []
                
                for chapter in chapter_list:
                    if self._is_special_section(chapter):
                        special_sections.append(chapter)
                    else:
                        real_chapters.append(chapter)
                
                # Convert special sections to sections
                for special in special_sections:
                    self._convert_chapter_to_section(special, result)
                    # Remove from chapters list
                    if special in ast.chapters:
                        ast.chapters.remove(special)
                    result.fixes_applied.append(
                        f"Converted special section '{special.meta.get('title', '')}' "
                        f"from chapter to section (duplicate code: {code})"
                    )
                
                # If multiple real chapters with same code, generate unique codes
                if len(real_chapters) > 1:
                    for i, chapter in enumerate(real_chapters):
                        if i > 0:  # Keep first one as-is
                            original_code = code
                            suffix = chr(64 + i)  # A, B, C, ...
                            new_code = f"{original_code}-{suffix}"
                            chapter.meta["code"] = new_code
                            result.fixes_applied.append(
                                f"Generated unique chapter code '{new_code}' for '{chapter.meta.get('title', '')}'"
                            )
    
    def _validate_heading_levels(self, ast: ASTDocument, result: ValidationResult):
        """
        Ensure heading hierarchy is correct.
        
        Rules:
        - Only level-2 headings should be chapters
        - Sections must be level-3 or higher
        - Sections should have a parent chapter (warning, not error)
        """
        def traverse_and_validate(node: ASTNode, parent_chapter: Optional[ASTNode]):
            """Recursively validate heading levels"""
            
            if node.type == "chapter":
                level = node.level
                if level != 2:
                    # Convert to section if level > 2
                    if level > 2:
                        self._convert_chapter_to_section(node, result)
                        result.fixes_applied.append(
                            f"Converted chapter '{node.meta.get('title', '')}' "
                            f"to section (incorrect heading level {level})"
                        )
                    else:
                        result.errors.append(
                            f"Chapter '{node.meta.get('title', '')}' has incorrect heading level {level} (expected 2)"
                        )
                parent_chapter = node
            
            elif node.type == "section":
                # Sections without parent chapter are warnings (may be fixed by other validation)
                if not parent_chapter and not node.parent:
                    result.warnings.append(
                        f"Section '{node.meta.get('title', '')}' has no parent chapter"
                    )
                level = node.level
                if level <= 2:
                    result.warnings.append(
                        f"Section '{node.meta.get('title', '')}' has heading level {level} (expected 3+)"
                    )
            
            # Recursively validate children
            for child in node.children:
                traverse_and_validate(child, parent_chapter if node.type != "chapter" else node)
        
        # Validate all nodes
        for part in ast.parts:
            traverse_and_validate(part, None)
        
        for chapter in ast.chapters:
            traverse_and_validate(chapter, None)
        
        # Also validate top-level nodes
        for node in ast.nodes:
            if node.type in ["chapter", "section"] and node not in ast.chapters:
                traverse_and_validate(node, None)
    
    def _classify_special_sections(self, ast: ASTDocument, result: ValidationResult):
        """
        Classify and fix special sections (diagrams, appendices, etc.).
        
        These should be sections, not chapters.
        """
        chapters = ast.get_all_chapters()
        
        for chapter in chapters:
            if self._is_special_section(chapter):
                self._convert_chapter_to_section(chapter, result)
                result.fixes_applied.append(
                    f"Classified '{chapter.meta.get('title', '')}' as special section (not a chapter)"
                )
    
    def _is_special_section(self, node: ASTNode) -> bool:
        """
        Determine if node is a special section, not a real chapter.
        
        Checks:
        - Diagram indicators in title (primary indicator)
        - Appendix indicators in title
        - Incorrect heading level (> 2)
        
        Note: We don't check content count here because chapters may have
        content added later. We rely on explicit indicators (diagram, appendix)
        or structural issues (wrong heading level).
        """
        title = node.meta.get("title", "").lower()
        
        # Primary check: Diagram indicators in title
        if "(diagram)" in title or "diagram:" in title:
            return True
        
        # Check for appendix indicators
        if "appendix" in title:
            return True
        
        # Check heading level - only h2 should be chapters
        if node.level > 2:
            return True
        
        # Don't classify as special based on content alone
        # (chapters may have content added later in processing)
        
        return False
    
    def _convert_chapter_to_section(self, chapter: ASTNode, result: ValidationResult):
        """
        Convert a chapter node to a section node.
        
        Preserves content and metadata, but changes type and adjusts hierarchy.
        """
        # Find parent chapter (look for nearest chapter in document)
        parent_chapter = None
        
        # First check ancestors
        ancestors = chapter.get_ancestors()
        for ancestor in ancestors:
            if ancestor.type == "chapter":
                parent_chapter = ancestor
                break
        
        # If no parent, try to find previous chapter in document
        # This is a simplified approach - full implementation would need document traversal
        # For now, we'll keep it as a top-level section
        
        # Change type to section
        chapter.type = "section"
        
        # Update metadata
        if "section_type" not in chapter.meta:
            chapter.meta["section_type"] = "special"
        
        # Ensure heading level is 3 or higher
        if chapter.level <= 2:
            chapter.level = 3
        
        # Move to parent chapter if found
        if parent_chapter:
            # Remove from current parent
            if chapter.parent:
                try:
                    chapter.parent.children.remove(chapter)
                except ValueError:
                    pass  # Already removed or not in children
            
            # Add to parent chapter
            parent_chapter.add_child(chapter)
        
        result.fixes_applied.append(
            f"Converted chapter '{chapter.meta.get('title', '')}' to section"
        )

