#!/usr/bin/env python3
"""
Analyze data loss between SSM compiled output and Cursor rules file.

This script compares:
1. SSM output blocks (antipattern, code-pattern, pattern)
2. Cursor rules file entries (BLK-, antipattern-, CODE-, PATTERN-)
"""

import re
import sys
import importlib.util
from pathlib import Path
from collections import Counter
from typing import Dict, List, Set

# Import structured logger
_project_root = Path(__file__).parent.parent.parent.parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

logger_util_path = _project_root / ".cursor" / "scripts" / "logger_util.py"
if logger_util_path.exists():
    spec = importlib.util.spec_from_file_location("logger_util", logger_util_path)
    logger_util = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(logger_util)
    get_logger = logger_util.get_logger
    logger = get_logger("analyze_rules_data_loss")
else:
    logger = None

def parse_ssm_blocks(ssm_path: Path) -> Dict[str, List[Dict]]:
    """Parse SSM file and extract relevant blocks."""
    content = ssm_path.read_text(encoding='utf-8')
    
    # Find all block type declarations
    block_pattern = re.compile(r'^::: (\w+)', re.MULTILINE)
    block_types = block_pattern.findall(content)
    
    # Count block types
    type_counts = Counter(block_types)
    
    # Extract detailed block information
    blocks = {
        'antipattern': [],
        'common-mistake': [],
        'code-pattern': [],
        'pattern': [],
        'concept': []  # May contain anti-patterns
    }
    
    # Parse blocks more carefully
    block_sections = re.split(r'^:::', content, flags=re.MULTILINE)
    
    for section in block_sections[1:]:  # Skip first empty section
        lines = section.split('\n')
        if not lines:
            continue
        
        block_type = lines[0].strip().split()[0] if lines[0].strip() else ''
        
        # Extract metadata
        meta = {}
        body_start = 0
        for i, line in enumerate(lines[1:], 1):
            if line.strip() == ':::' or not line.strip():
                body_start = i + 1
                break
            if ':' in line:
                key, value = line.split(':', 1)
                meta[key.strip()] = value.strip()
        
        # Extract body
        body = '\n'.join(lines[body_start:]).strip()
        
        # Check for anti-pattern indicators in concept blocks
        if block_type == 'concept':
            if any(indicator in body.lower() for indicator in ['❌', 'anti-pattern', 'pitfall', 'warning', 'do not', 'avoid']):
                blocks['concept'].append({
                    'id': meta.get('id', ''),
                    'summary': meta.get('summary', ''),
                    'body': body[:200],
                    'chapter': meta.get('chapter', '')
                })
        
        # Store relevant blocks
        if block_type in blocks:
            blocks[block_type].append({
                'id': meta.get('id', ''),
                'summary': meta.get('summary', ''),
                'body': body[:200],
                'chapter': meta.get('chapter', '')
            })
    
    return {
        'type_counts': dict(type_counts),
        'blocks': blocks
    }

def parse_rules_file(rules_path: Path) -> Dict[str, int]:
    """Parse Cursor rules file and count entries."""
    content = rules_path.read_text(encoding='utf-8')
    
    return {
        'BLK': len(re.findall(r'^### BLK-', content, re.MULTILINE)),
        'antipattern': len(re.findall(r'^### antipattern-', content, re.MULTILINE)),
        'CODE': len(re.findall(r'^### CODE-', content, re.MULTILINE)),
        'PATTERN': len(re.findall(r'^### PATTERN-', content, re.MULTILINE)),
        'CODEPAT': len(re.findall(r'^### CODEPAT-', content, re.MULTILINE))
    }

def main():
    ssm_path = Path('docs/reference/Programming Bibles/bibles/python_bible/dist/python_bible/python_bible.ssm.md')
    rules_path = Path('.cursor/rules/python_bible.mdc')
    
    if not ssm_path.exists():
        if logger:
            logger.error(
                "SSM file not found",
                operation="main",
                error_code="FILE_NOT_FOUND",
                root_cause=f"SSM file does not exist: {ssm_path}",
                file_path=str(ssm_path)
            )
        return 1
    
    if not rules_path.exists():
        if logger:
            logger.error(
                "Rules file not found",
                operation="main",
                error_code="FILE_NOT_FOUND",
                root_cause=f"Rules file does not exist: {rules_path}",
                file_path=str(rules_path)
            )
        return 1
    
    if logger:
        logger.info(
            "Starting data loss analysis",
            operation="main",
            stage="start"
        )
    
    # Parse SSM output
    if logger:
        logger.progress("Analyzing SSM compiled output", operation="analyze_ssm", stage="parsing")
    ssm_data = parse_ssm_blocks(ssm_path)
    
    # Log block types
    if logger:
        logger.info(
            "Block types in SSM output",
            operation="analyze_ssm",
            stage="parsing_complete",
            block_types=ssm_data['type_counts']
        )
    
    # Count relevant blocks
    ssm_antipatterns = len(ssm_data['blocks']['antipattern']) + len(ssm_data['blocks']['common-mistake'])
    ssm_patterns = len(ssm_data['blocks']['code-pattern']) + len(ssm_data['blocks']['pattern'])
    ssm_concept_antipatterns = len(ssm_data['blocks']['concept'])
    
    if logger:
        logger.info(
            "Relevant blocks for rules extraction",
            operation="analyze_ssm",
            stage="counting",
            antipatterns_explicit=ssm_antipatterns,
            patterns_explicit=ssm_patterns,
            concept_antipatterns=ssm_concept_antipatterns
        )
    
    # Parse rules file
    if logger:
        logger.progress("Analyzing Cursor rules file", operation="analyze_rules", stage="parsing")
    rules_data = parse_rules_file(rules_path)
    
    if logger:
        logger.info(
            "Entries in rules file",
            operation="analyze_rules",
            stage="parsing_complete",
            entries=rules_data
        )
    
    total_rules_anti = rules_data['BLK'] + rules_data['antipattern']
    total_rules_patterns = rules_data['CODE'] + rules_data['PATTERN'] + rules_data['CODEPAT']
    
    if logger:
        logger.info(
            "Rules file totals",
            operation="analyze_rules",
            stage="counting",
            total_antipatterns=total_rules_anti,
            total_patterns=total_rules_patterns
        )
    
    # Compare
    if logger:
        logger.progress("Data loss analysis", operation="compare", stage="analysis")
    
    # Anti-patterns
    if ssm_antipatterns > 0:
        anti_loss = ((ssm_antipatterns - total_rules_anti) / ssm_antipatterns) * 100
        missing_anti = ssm_antipatterns - total_rules_anti
        if logger:
            logger.info(
                "Anti-patterns analysis",
                operation="compare",
                stage="antipatterns",
                ssm_output=ssm_antipatterns,
                rules_file=total_rules_anti,
                missing=missing_anti,
                loss_percentage=anti_loss
            )
    else:
        if logger:
            logger.info(
                "Anti-patterns analysis (no explicit blocks)",
                operation="compare",
                stage="antipatterns",
                ssm_output=ssm_antipatterns,
                rules_file=total_rules_anti,
                note="Anti-patterns may be embedded in concept blocks",
                concept_antipatterns=ssm_concept_antipatterns
            )
    
    # Patterns
    if ssm_patterns > 0:
        pattern_loss = ((ssm_patterns - total_rules_patterns) / ssm_patterns) * 100
        missing_patterns = ssm_patterns - total_rules_patterns
        if logger:
            logger.info(
                "Patterns analysis",
                operation="compare",
                stage="patterns",
                ssm_output=ssm_patterns,
                rules_file=total_rules_patterns,
                missing=missing_patterns,
                loss_percentage=pattern_loss
            )
    
    # Recommendations
    if logger:
        logger.progress("Generating recommendations", operation="recommendations", stage="analysis")
    
    recommendations = []
    if ssm_antipatterns == 0 and ssm_concept_antipatterns > 0:
        recommendations.append({
            "type": "warning",
            "message": "Anti-patterns are embedded in concept blocks, not extracted as separate blocks",
            "action": "Consider enhancing SSM compiler to extract anti-patterns from concept blocks"
        })
        if logger:
            logger.warn(
                "Anti-patterns embedded in concept blocks",
                operation="recommendations",
                error_code="EMBEDDED_ANTIPATTERNS",
                root_cause="Anti-patterns not extracted as separate blocks",
                concept_antipatterns=ssm_concept_antipatterns
            )
    
    if ssm_patterns > total_rules_patterns:
        missing = ssm_patterns - total_rules_patterns
        recommendations.append({
            "type": "warning",
            "message": f"{missing} patterns missing from rules file",
            "action": "Regenerate rules file using: python tools/bible_pipeline.py --language python --ssm <path> --out-mdc .cursor/rules/python_bible.mdc"
        })
        if logger:
            logger.warn(
                "Patterns missing from rules file",
                operation="recommendations",
                error_code="MISSING_PATTERNS",
                root_cause=f"{missing} patterns not in rules file",
                missing_count=missing
            )
    
    if total_rules_anti < 100 and ssm_concept_antipatterns > 100:
        recommendations.append({
            "type": "warning",
            "message": f"Many anti-pattern indicators found in concept blocks ({ssm_concept_antipatterns})",
            "action": "Rules file may need to extract from concept blocks, not just explicit antipattern blocks"
        })
        if logger:
            logger.warn(
                "Many anti-pattern indicators in concept blocks",
                operation="recommendations",
                error_code="CONCEPT_ANTIPATTERNS",
                root_cause="Anti-patterns may be in concept blocks",
                concept_antipatterns=ssm_concept_antipatterns
            )
    
    if logger:
        logger.info(
            "Analysis complete",
            operation="main",
            stage="complete",
            recommendations=recommendations
        )
    
    return 0

if __name__ == '__main__':
    exit(main())


