"""Analyze V3 features in compiled SSM output"""
import re
from collections import defaultdict

def analyze_v3_features(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Find all block types
    block_types = re.findall(r'^::: (\w+)', text, re.MULTILINE)
    block_counts = defaultdict(int)
    for bt in block_types:
        block_counts[bt] += 1
    
    print("=" * 80)
    print("V3 FEATURE ANALYSIS")
    print("=" * 80)
    print()
    
    # Required V3 block types (from V3_UPGRADE_PLAN.md)
    required_v3_blocks = {
        'part-meta': 'Part metadata',
        'chapter-meta': 'Chapter metadata',
        'section-meta': 'Section metadata',
        'concept': 'Concept blocks',
        'fact': 'Fact blocks',
        'example': 'Example blocks',
        'code-pattern': 'Code pattern blocks',
        'term': 'Term definitions',
        'relation': 'Relation blocks',
        'antipattern': 'Anti-pattern blocks',
        'diagram': 'Diagram blocks',
        'table': 'Table blocks',
        'qa': 'Q/A blocks',
        'reasoning-chain': 'Reasoning chain blocks',
        'inference': 'Inference blocks',
        'pathway': 'Pathway blocks',
        'constraint': 'Constraint blocks',
        'pattern': 'Conceptual pattern blocks',
        'rationale': 'Rationale blocks',
        'contrast': 'Contrast blocks',
    }
    
    print("V3 BLOCK TYPES:")
    print("-" * 80)
    missing = []
    present = []
    for block_type, description in sorted(required_v3_blocks.items()):
        count = block_counts.get(block_type, 0)
        if count > 0:
            print(f"  ✅ {block_type:20s} {count:4d} blocks - {description}")
            present.append(block_type)
        else:
            print(f"  ❌ {block_type:20s}    0 blocks - {description} [MISSING]")
            missing.append(block_type)
    
    print()
    print(f"Present: {len(present)}/{len(required_v3_blocks)}")
    print(f"Missing: {len(missing)}/{len(required_v3_blocks)}")
    print()
    
    # V3 Metadata fields
    print("=" * 80)
    print("V3 METADATA FIELDS:")
    print("-" * 80)
    
    v3_metadata_fields = {
        'pattern_type': 'Pattern type (for code-pattern blocks)',
        'pattern_subtype': 'Pattern subtype',
        'semantic_role': 'Semantic role classification',
        'embedding_hint_importance': 'Embedding importance hint',
        'embedding_hint_scope': 'Embedding scope hint',
        'embedding_hint_chunk': 'Embedding chunk hint',
        'symbol_refs': 'Symbol references',
        'graph_neighbors': 'Graph neighbors (1-hop)',
        'graph_two_hop': 'Graph neighbors (2-hop)',
        'graph_three_hop': 'Graph neighbors (3-hop)',
        'intuition': 'Intuitive explanation',
        'code_smell_probability': 'Code smell probability',
        'pattern_role': 'Pattern role',
    }
    
    metadata_counts = defaultdict(int)
    for field in v3_metadata_fields:
        pattern = rf'{re.escape(field)}:'
        matches = re.findall(pattern, text, re.MULTILINE)
        metadata_counts[field] = len(matches)
    
    for field, description in sorted(v3_metadata_fields.items()):
        count = metadata_counts[field]
        if count > 0:
            print(f"  ✅ {field:30s} {count:4d} occurrences - {description}")
        else:
            print(f"  ❌ {field:30s}    0 occurrences - {description} [MISSING]")
    
    print()
    
    # Check for specific V3 features
    print("=" * 80)
    print("V3 SPECIFIC FEATURES:")
    print("-" * 80)
    
    # Check pattern_type in code-pattern blocks
    pattern_type_blocks = len(re.findall(r'pattern_type:', text, re.MULTILINE))
    print(f"  Code-pattern blocks with pattern_type: {pattern_type_blocks}")
    
    # Check semantic roles
    semantic_roles = set(re.findall(r'semantic_role: (\w+)', text, re.MULTILINE))
    print(f"  Unique semantic roles: {len(semantic_roles)}")
    if semantic_roles:
        print(f"    Roles: {', '.join(sorted(semantic_roles)[:10])}")
    
    # Check symbol_refs population
    empty_symbol_refs = len(re.findall(r'symbol_refs: \[\]', text, re.MULTILINE))
    populated_symbol_refs = len(re.findall(r'symbol_refs: \[[^\]]+\]', text, re.MULTILINE))
    print(f"  Symbol references:")
    print(f"    Empty: {empty_symbol_refs}")
    print(f"    Populated: {populated_symbol_refs}")
    
    # Check graph fields
    graph_neighbors = len(re.findall(r'graph_neighbors:', text, re.MULTILINE))
    graph_two_hop = len(re.findall(r'graph_two_hop:', text, re.MULTILINE))
    graph_three_hop = len(re.findall(r'graph_three_hop:', text, re.MULTILINE))
    print(f"  Graph fields:")
    print(f"    graph_neighbors: {graph_neighbors}")
    print(f"    graph_two_hop: {graph_two_hop}")
    print(f"    graph_three_hop: {graph_three_hop}")
    
    # Check chapter-meta completeness
    chapter_meta_blocks = re.findall(r'::: chapter-meta\n(.*?)\n:::', text, re.DOTALL)
    print(f"\n  Chapter-meta blocks: {len(chapter_meta_blocks)}")
    if chapter_meta_blocks:
        sample = chapter_meta_blocks[0]
        required_fields = ['code', 'number', 'title', 'level', 'prerequisites']
        for field in required_fields:
            if field + ':' in sample:
                print(f"    ✅ {field}")
            else:
                print(f"    ❌ {field} [MISSING]")
    
    print()
    print("=" * 80)
    print("SUMMARY:")
    print("-" * 80)
    print(f"Total blocks: {len(block_types)}")
    print(f"Unique block types: {len(block_counts)}")
    print(f"V3 block types present: {len(present)}/{len(required_v3_blocks)}")
    print(f"V3 block types missing: {len(missing)}")
    if missing:
        print(f"Missing types: {', '.join(missing)}")

if __name__ == '__main__':
    analyze_v3_features('FinalCompilerTest_Fixed.ssm.md')

