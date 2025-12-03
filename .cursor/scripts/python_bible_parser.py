#!/usr/bin/env python3
"""
Python Bible Parser
Extracts anti-patterns, recommendations, and code examples from Python Bible chapters.

Last Updated: 2025-11-30
"""

import re
from pathlib import Path
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass, field
from collections import defaultdict


@dataclass
class BiblePattern:
    """Represents an anti-pattern or recommendation from Python Bible."""
    pattern_id: str
    chapter: str
    chapter_file: str
    category: str  # security, error_handling, performance, etc.
    anti_pattern: str  # The bad code pattern
    recommended_pattern: Optional[str] = None  # The good code pattern
    description: str = ""
    severity: str = "MEDIUM"  # HIGH, MEDIUM, LOW
    code_examples: List[str] = field(default_factory=list)
    bible_reference: str = ""  # e.g., "Chapter 13.2.1"


@dataclass
class BibleKnowledge:
    """Structured knowledge extracted from Python Bible."""
    patterns: List[BiblePattern] = field(default_factory=list)
    chapter_index: Dict[str, str] = field(default_factory=dict)  # chapter_name -> file_path


class PythonBibleParser:
    """Parses Python Bible chapters to extract patterns and recommendations."""
    
    def __init__(self, bible_root: Path):
        """Initialize parser with Python Bible root directory."""
        self.bible_root = bible_root
        self.chapters_dir = bible_root / "chapters"
        self.knowledge = BibleKnowledge()
        
    def parse_all_chapters(self) -> BibleKnowledge:
        """Parse all Python Bible chapters and extract patterns."""
        if not self.chapters_dir.exists():
            return self.knowledge
        
        # Map chapter files to topics
        chapter_mapping = {
            '13_security_critical.md': ('security', 'HIGH'),
            '10_error_handling_exceptions_intermediate.md': ('error_handling', 'MEDIUM'),
            '06_functions_functional_concepts_beginner.md': ('pythonic', 'MEDIUM'),
            '12_performance_optimization_advanced.md': ('performance', 'MEDIUM'),
            '17_concurrency_parallelism_advanced.md': ('concurrency', 'MEDIUM'),
            '04_types_type_system_intermediate.md': ('type_safety', 'LOW'),
            '11_architecture_application_design_intermediate.md': ('architecture', 'MEDIUM'),
            '14_testing_quality_engineering_intermediate.md': ('testing', 'MEDIUM'),
        }
        
        for chapter_file, (category, default_severity) in chapter_mapping.items():
            chapter_path = self.chapters_dir / chapter_file
            if chapter_path.exists():
                patterns = self._parse_chapter(chapter_path, category, default_severity)
                self.knowledge.patterns.extend(patterns)
                self.knowledge.chapter_index[chapter_file] = str(chapter_path)
        
        return self.knowledge
    
    def _parse_chapter(self, chapter_path: Path, category: str, default_severity: str) -> List[BiblePattern]:
        """Parse a single chapter file and extract patterns."""
        patterns = []
        
        try:
            with open(chapter_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
        except Exception:
            return patterns
        
        chapter_name = chapter_path.stem
        chapter_num = self._extract_chapter_number(chapter_name)
        
        # Extract Quick Answer section
        quick_answer = self._extract_quick_answer(content)
        
        # Extract code blocks with ❌ and ✅ markers
        code_patterns = self._extract_code_patterns(content, chapter_num)
        
        # Extract list items with ❌ markers
        list_patterns = self._extract_list_patterns(content, chapter_num)
        
        # Combine all patterns
        all_patterns = quick_answer + code_patterns + list_patterns
        
        # Create BiblePattern objects
        for i, pattern_data in enumerate(all_patterns):
            pattern = BiblePattern(
                pattern_id=f"{chapter_name}_{i}",
                chapter=chapter_name,
                chapter_file=str(chapter_path.relative_to(self.bible_root)),
                category=category,
                anti_pattern=pattern_data.get('anti_pattern', ''),
                recommended_pattern=pattern_data.get('recommended', ''),
                description=pattern_data.get('description', ''),
                severity=pattern_data.get('severity', default_severity),
                code_examples=pattern_data.get('examples', []),
                bible_reference=pattern_data.get('reference', f"Chapter {chapter_num}")
            )
            patterns.append(pattern)
        
        return patterns
    
    def _extract_chapter_number(self, chapter_name: str) -> str:
        """Extract chapter number from filename."""
        match = re.search(r'(\d+)_', chapter_name)
        return match.group(1) if match else "?"
    
    def _extract_quick_answer(self, content: str) -> List[Dict]:
        """Extract patterns from Quick Answer section."""
        patterns = []
        
        # Find Quick Answer section
        quick_match = re.search(r'> \*\*Quick Answer:\*\*(.*?)(?=\n\n|\*\*)', content, re.DOTALL)
        if not quick_match:
            return patterns
        
        quick_section = quick_match.group(1)
        
        # Extract ❌ patterns
        anti_patterns = re.findall(r'❌\s+(.+?)(?=\n|❌|✅)', quick_section)
        for anti in anti_patterns:
            patterns.append({
                'anti_pattern': anti.strip(),
                'description': f"Quick Answer: {anti.strip()}",
                'severity': 'HIGH',
                'reference': 'Quick Answer'
            })
        
        return patterns
    
    def _extract_code_patterns(self, content: str, chapter_num: str) -> List[Dict]:
        """Extract patterns from code blocks with ❌ and ✅ markers."""
        patterns = []
        
        # Find code blocks with ❌ and ✅ comments
        code_block_pattern = re.compile(
            r'```python\n(.*?)(?=```|$)',
            re.DOTALL | re.MULTILINE
        )
        
        for match in code_block_pattern.finditer(content):
            code_block = match.group(1)
            
            # Check for ❌ markers
            if '❌' in code_block or '# ❌' in code_block:
                # Extract the vulnerable code
                vulnerable_lines = []
                safe_lines = []
                
                for line in code_block.split('\n'):
                    if '❌' in line or '# ❌' in line:
                        # Clean the line
                        clean_line = re.sub(r'#\s*❌.*', '', line).strip()
                        if clean_line and not clean_line.startswith('#'):
                            vulnerable_lines.append(clean_line)
                    elif '✅' in line or '# ✅' in line:
                        clean_line = re.sub(r'#\s*✅.*', '', line).strip()
                        if clean_line and not clean_line.startswith('#'):
                            safe_lines.append(clean_line)
                
                if vulnerable_lines:
                    # Find section reference
                    section_ref = self._find_section_reference(content, match.start())
                    
                    patterns.append({
                        'anti_pattern': '\n'.join(vulnerable_lines[:3]),  # First 3 lines
                        'recommended': '\n'.join(safe_lines[:3]) if safe_lines else None,
                        'description': self._extract_description_near_code(content, match.start()),
                        'severity': 'HIGH' if 'VULNERABLE' in code_block or 'DANGEROUS' in code_block else 'MEDIUM',
                        'examples': vulnerable_lines[:5],
                        'reference': section_ref
                    })
        
        return patterns
    
    def _extract_list_patterns(self, content: str, chapter_num: str) -> List[Dict]:
        """Extract patterns from lists with ❌ markers."""
        patterns = []
        
        # Find list items with ❌
        list_pattern = re.compile(r'❌\s+(.+?)(?=\n|❌|✅)', re.MULTILINE)
        
        for match in list_pattern.finditer(content):
            anti_pattern_text = match.group(1).strip()
            
            # Skip if it's in a code block (already handled)
            if self._is_in_code_block(content, match.start()):
                continue
            
            # Find corresponding ✅ if nearby
            recommended = self._find_recommended_nearby(content, match.end())
            
            section_ref = self._find_section_reference(content, match.start())
            
            patterns.append({
                'anti_pattern': anti_pattern_text,
                'recommended': recommended,
                'description': anti_pattern_text,
                'severity': 'HIGH' if any(word in anti_pattern_text.lower() for word in ['vulnerable', 'dangerous', 'injection', 'security']) else 'MEDIUM',
                'reference': section_ref
            })
        
        return patterns
    
    def _extract_description_near_code(self, content: str, position: int) -> str:
        """Extract description text near a code block."""
        # Look backwards for section header or description
        start = max(0, position - 500)
        context = content[start:position]
        
        # Find the last heading
        headings = re.findall(r'^#{1,4}\s+(.+)$', context, re.MULTILINE)
        if headings:
            return headings[-1]
        
        # Find the last sentence before code
        sentences = re.findall(r'([A-Z][^.!?]*[.!?])', context)
        if sentences:
            return sentences[-1]
        
        return "Code pattern from Python Bible"
    
    def _find_section_reference(self, content: str, position: int) -> str:
        """Find the section reference (e.g., '13.2.1') near a position."""
        start = max(0, position - 1000)
        context = content[start:position]
        
        # Find section numbers like 13.2.1, 10.4.1, etc.
        section_match = re.search(r'(\d+\.\d+(?:\.\d+)?)', context)
        if section_match:
            return f"Chapter {section_match.group(1)}"
        
        # Find chapter number
        chapter_match = re.search(r'CHAPTER\s+(\d+)', context, re.IGNORECASE)
        if chapter_match:
            return f"Chapter {chapter_match.group(1)}"
        
        return "Python Bible"
    
    def _find_recommended_nearby(self, content: str, position: int) -> Optional[str]:
        """Find recommended pattern nearby (within 200 chars)."""
        end = min(len(content), position + 200)
        context = content[position:end]
        
        # Look for ✅ marker
        safe_match = re.search(r'✅\s+(.+?)(?=\n|❌|$)', context)
        if safe_match:
            return safe_match.group(1).strip()
        
        return None
    
    def _is_in_code_block(self, content: str, position: int) -> bool:
        """Check if position is inside a code block."""
        before = content[:position]
        # Count ``` before position
        code_blocks_before = before.count('```')
        return code_blocks_before % 2 == 1
    
    def get_patterns_by_category(self, category: str) -> List[BiblePattern]:
        """Get all patterns for a specific category."""
        return [p for p in self.knowledge.patterns if p.category == category]
    
    def get_security_patterns(self) -> List[BiblePattern]:
        """Get all security-related patterns."""
        return self.get_patterns_by_category('security')
    
    def find_matching_pattern(self, code_snippet: str, category: Optional[str] = None) -> Optional[BiblePattern]:
        """Find a Bible pattern that matches the given code snippet."""
        patterns_to_check = self.knowledge.patterns
        if category:
            patterns_to_check = self.get_patterns_by_category(category)
        
        code_lower = code_snippet.lower()
        
        for pattern in patterns_to_check:
            # Check if anti-pattern text appears in code
            if pattern.anti_pattern.lower() in code_lower:
                return pattern
            
            # Check code examples
            for example in pattern.code_examples:
                if example.lower() in code_lower:
                    return pattern
        
        return None















