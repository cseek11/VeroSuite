# SSM Compiler V3 Issues Analysis & Fix Plan

**Date:** 2025-12-05  
**Source:** User analysis of `rego_opa_bible_v3.ssm.md`  
**Status:** Investigation & Fixing in Progress

## Summary

The SSM Compiler V3 output has 11 critical issues that need to be addressed. This document provides detailed analysis and fix plans for each issue.

---

## Issue 1: Duplicate Chapter Codes ⚠️ **CRITICAL**

### Problem
Chapter code "CH-03" appears twice:
- Line 39: "Core Concepts and Evaluation Model" (legitimate chapter)
- Line 55: "Evaluation Flow (Diagram)" (should be a section/diagram, not a chapter)

### Root Cause
The parser is detecting headings that match chapter patterns (e.g., "Chapter 3 — ...") but some of these are actually:
- Diagram titles
- Section headings
- Special content blocks

The `CHAPTER_HEADING_RE` pattern is too permissive or the context checking is insufficient.

### Fix Plan
1. **Enhance chapter detection** in `modules/parser_markdown.py`:
   - ✅ Add stricter context checking (must be level-2 heading, not embedded in other content) - **FIXED**
   - ✅ Detect diagram titles and exclude them from chapter detection - **FIXED**
   - ⏳ Add validation: chapters must have substantial content (not just a title) - **PENDING**

2. **Normalize duplicate chapter codes**:
   - ✅ When duplicate chapter numbers are detected, generate unique codes (CH-03-A, CH-03-B) - **FIXED**
   - ✅ Prevent diagrams from being detected as chapters - **FIXED**

3. **Attach diagrams to chapters**:
   - Diagrams should be attached to the nearest chapter, not create new chapters
   - Diagram blocks should reference their parent chapter

### Files to Modify
- ✅ `modules/parser_markdown.py` (chapter detection logic) - **FIXED**
- ✅ `modules/parser_ssm.py` (chapter code generation with duplicate handling) - **FIXED**
- `runtime/symbol_table.py` (duplicate chapter handling) - **PENDING** (may not be needed)

---

## Issue 2: Term Extraction Truncation ⚠️ **HIGH**

### Problem
Term definitions are truncated at backticks:
```
- `import rego
```
Instead of full definition.

### Root Cause
The term extractor is cutting text at code fence markers (backticks). The parser is not properly handling code blocks within term definitions.

### Fix Plan
1. **Fix term extraction** in `modules/extractor_terms.py`:
   - ✅ Preserve code blocks within term definitions - **FIXED** (improved regex with DOTALL flag)
   - ✅ Use proper markdown parsing that handles nested code blocks - **FIXED** (regex now captures multi-line content)
   - ✅ Extract full definition text, including code examples - **FIXED** (regex stops at paragraph boundaries, not first period)

2. **Improve AST parsing**:
   - Ensure code blocks within paragraphs are preserved
   - Don't split paragraphs at code fence boundaries

### Files to Modify
- ✅ `modules/extractor_terms.py` (term extraction logic) - **FIXED**
- ✅ `modules/utils/patterns.py` (TERM_DEF_RE and QUOTED_TERM_RE improved) - **FIXED**
- `modules/parser_markdown.py` (code block handling in paragraphs) - **PENDING**

---

## Issue 3: Concept Summaries Are Numbers ⚠️ **HIGH**

### Problem
Many concept summaries are single numbers:
```
summary: 1
summary: 4
summary: 1
```

### Root Cause
The summary generation in `modules/parser_ssm.py` line 468 uses:
```python
summary = text.split(". ")[0] if ". " in text else text[:100]
```

When text starts with a list item like "1. " or "4. ", it captures just the number. List items are being captured as paragraphs instead of being properly parsed.

### Fix Plan
1. **Fix summary generation**:
   - ✅ Strip list markers (numbers, bullets) before generating summary - **FIXED**
   - ✅ Use first sentence after list marker - **FIXED**
   - ⏳ Generate semantic summaries instead of naive text extraction - **PARTIAL** (improved fallback logic)

2. **Improve list handling**:
   - Parse lists as separate AST nodes
   - Coalesce multi-line list items
   - Don't create concept blocks from single list items

3. **Add semantic summary generation**:
   - Use LLM or rule-based summarization
   - Extract key concepts from paragraph text
   - Generate meaningful summaries (V3.1 feature)

### Files to Modify
- ✅ `modules/parser_ssm.py` (summary generation, line 468) - **FIXED**
- `modules/parser_markdown.py` (list parsing) - **PENDING**
- `modules/enrichment_v3/semantic_vector.py` (semantic summary generation) - **PENDING** (V3.1 feature)

---

## Issue 4: Missing Semantic Relations ⚠️ **MEDIUM**

### Problem
Relation blocks only have reverse neighbors (`graph_neighbors`, `graph_degree`), not semantic relations like:
- `requires`
- `contradicts`
- `extends`
- `used_by`
- `related_to`
- `part_of`
- `defined_in`

### Root Cause
The relation extractor (`modules/extractor_relations.py`) only extracts explicit chapter references ("See Chapter X"), not semantic relationships.

### Fix Plan
1. **Enhance relation extraction**:
   - Add semantic relation detection (requires, contradicts, extends, etc.)
   - Use pattern matching for common relation phrases
   - Extract implicit relationships from text

2. **Add relation type classification**:
   - Classify relations by type (dependency, contradiction, extension, etc.)
   - Add confidence scores
   - Support bidirectional relations

### Files to Modify
- `modules/extractor_relations.py` (semantic relation extraction)
- `modules/enrichment_v3/chapter_graph.py` (relation graph building)

---

## Issue 5: Missing V3 Block Types ⚠️ **CRITICAL**

### Problem
Missing required V3 block types:
- `::: pattern` ❌
- `::: qa` ❌
- `::: antipattern` ❌
- `::: rationale` ❌
- `::: contrast` ❌
- `::: relation` ✅ (exists but may not be properly generated)
- `::: diagram` ✅ (exists but may not be properly generated)

### Root Cause
1. **QA blocks**: `enrich_qa` function exists but may not be called or may not be generating blocks correctly
2. **Pattern blocks**: Pattern extraction exists but may not be generating `pattern` blocks (only `code-pattern`)
3. **Antipattern blocks**: No extractor for antipatterns
4. **Rationale blocks**: No extractor for rationale
5. **Contrast blocks**: No extractor for contrast/comparison blocks

### Fix Plan
1. **Verify enrichment pipeline**:
   - Check that `enrich_qa` is being called
   - Verify QA blocks are being added to output

2. **Add missing extractors**:
   - Create `extractor_antipatterns.py`
   - Create `extractor_rationale.py`
   - Create `extractor_contrast.py`

3. **Enhance pattern extraction**:
   - Generate `pattern` blocks (not just `code-pattern`)
   - Classify patterns by type

### Files to Modify
- `compiler.py` (enrichment pipeline)
- `modules/enrichment_v3/qa_generator.py` (verify QA generation)
- Create new extractors for missing block types

---

## Issue 6: Diagram Handling ⚠️ **MEDIUM**

### Problem
- "Diagram chapters" appear (e.g., "Evaluation Flow (Diagram)")
- But no extracted `::: diagram` blocks appear afterwards
- ASCII diagrams likely exist but aren't being detected/classified

### Root Cause
1. Diagrams are being detected as chapters instead of diagram blocks
2. Diagram extractor may not be finding all diagrams
3. ASCII diagrams may not be properly classified

### Fix Plan
1. **Fix diagram detection**:
   - Prevent diagrams from being detected as chapters
   - Improve ASCII diagram detection
   - Classify diagrams by type (flowchart, sequence, graph)

2. **Attach diagrams to chapters**:
   - Diagrams should reference their parent chapter
   - Don't create separate chapters for diagrams

3. **Enhance diagram extraction**:
   - Extract node lists and edge lists for diagrams
   - Normalize diagram content
   - Add diagram metadata (type, nodes, edges)

### Files to Modify
- `modules/extractor_diagrams.py` (diagram detection)
- `modules/parser_markdown.py` (prevent diagrams as chapters)
- `modules/parser_ssm.py` (diagram block generation)

---

## Issue 7: Missing V3 SSM Fields ⚠️ **MEDIUM**

### Problem
Missing required V3 SSM fields:
- `token_range`
- `char_offset`
- `digest`
- `source_ref`
- `symbol_refs`
- `semantic_role`

### Root Cause
These fields are not being generated during SSM block creation. They require:
- Token-level tracking (token_range, char_offset)
- Content hashing (digest)
- Source reference tracking (source_ref)
- Symbol table integration (symbol_refs)
- Semantic role classification (semantic_role)

### Fix Plan
1. **Add token tracking**:
   - Track token ranges for each block
   - Calculate character offsets
   - Store in block metadata

2. **Add content hashing**:
   - Generate SHA-256 digest for each block
   - Store in `digest` field

3. **Add source references**:
   - Track source file and line numbers
   - Store in `source_ref` field

4. **Add symbol references**:
   - Link blocks to symbols in symbol table
   - Store in `symbol_refs` field

5. **Add semantic role classification**:
   - Classify blocks by semantic role
   - Store in `semantic_role` field

### Files to Modify
- `modules/ast_nodes.py` (SSMBlock class - add fields)
- `modules/parser_ssm.py` (generate V3 fields)
- `runtime/tokens.py` (token range tracking)

---

## Issue 8: Heading Normalization ⚠️ **HIGH**

### Problem
Sections are being detected as chapters:
- "Real-World Comprehension Examples" emits a full chapter with code "CH-05"
- But this is a section, not a chapter

### Root Cause
The heading-level parsing is not properly normalizing to chapter outline. The parser is treating level-3+ headings as chapters when they should be sections.

### Fix Plan
1. **Fix heading normalization**:
   - Only level-2 headings should be chapters
   - Level-3+ headings should be sections
   - Add validation: chapters must match "Chapter X — Title" pattern

2. **Improve hierarchical AST**:
   - Ensure proper parent-child relationships
   - Sections must be children of chapters
   - Validate AST structure

### Files to Modify
- `modules/parser_markdown.py` (heading normalization)
- `modules/parser_ssm.py` (chapter/section detection)

---

## Issue 9: Wrong Summary Generation ⚠️ **MEDIUM**

### Problem
Concept summaries use the first markdown token (even when useless):
```
summary: 1
```

### Root Cause
Same as Issue 3 - summary generation is naive and doesn't handle edge cases.

### Fix Plan
Same as Issue 3 - improve summary generation with semantic understanding.

---

## Issue 10: Bad Block Boundaries ⚠️ **MEDIUM**

### Problem
Code blocks are not being properly classified:
- Should produce `::: code-pattern` (recognize as API usage)
- Should produce `::: concept` summary explaining built-ins
- Should produce `::: example` block for code-only segments

### Root Cause
Block boundary detection is not sophisticated enough. Code blocks are being treated as single units instead of being split into pattern/concept/example blocks.

### Fix Plan
1. **Improve block boundary detection**:
   - Split code blocks into pattern/concept/example segments
   - Classify code blocks by usage (API, example, pattern)
   - Generate multiple blocks from single code block when appropriate

2. **Enhance code classification**:
   - Better pattern recognition
   - API usage detection
   - Example vs pattern distinction

### Files to Modify
- `modules/extractor_patterns.py` (pattern classification)
- `modules/parser_ssm.py` (block boundary detection)

---

## Issue 11: Empty Chapters ⚠️ **MEDIUM**

### Problem
Too many "empty chapters" appear:
```
title: Deployment Topologies (Sidecar vs Central vs Embedded)
sections: []
```

These are actually subsections, not full chapters.

### Root Cause
Same as Issue 8 - heading normalization problem. Sections are being detected as chapters.

### Fix Plan
Same as Issue 8 - fix heading normalization and hierarchical AST.

---

## Priority Order

1. **Critical (Fix First)**:
   - ✅ Issue 1: Duplicate Chapter Codes - **FIXED**
   - ✅ Issue 5: Missing V3 Block Types - **PARTIALLY FIXED** (QA blocks verified, others pending)

2. **High Priority**:
   - 🔄 Issue 2: Term Extraction Truncation - **IN PROGRESS** (regex improved)
   - ✅ Issue 3: Concept Summaries Are Numbers - **FIXED**
   - Issue 8: Heading Normalization - **PENDING**

3. **Medium Priority**:
   - Issue 4: Missing Semantic Relations
   - Issue 6: Diagram Handling
   - Issue 7: Missing V3 SSM Fields
   - Issue 9: Wrong Summary Generation (same as Issue 3)
   - Issue 10: Bad Block Boundaries
   - Issue 11: Empty Chapters (related to Issue 8)

---

## Implementation Notes

- Many issues are related (e.g., Issues 3, 8, 9, 11)
- Fixes should be done incrementally with testing
- Some fixes require new extractors/enrichers
- Some fixes require changes to core parser logic

---

**Next Steps:**
1. Start with Issue 1 (Duplicate Chapter Codes) - highest impact
2. Then Issue 5 (Missing Block Types) - critical for V3 compliance
3. Then Issues 2, 3, 8 (high priority, related fixes)

