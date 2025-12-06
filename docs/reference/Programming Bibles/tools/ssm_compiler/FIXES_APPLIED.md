# SSM V3 Compilation Fixes - Implementation Log

**Date:** 2025-12-05  
**Status:** In Progress

---

## Fix 1: Chapter Hierarchy Correction

### Problem
Standalone "Chapter X – Title" text (without `##` markdown heading) is being treated as chapters, creating misclassified chapters like CH-05-A, CH-06-A.

### Root Cause
Lines 392-460 in `parser_markdown.py` detect standalone "Chapter X" text and create chapters from them, even when they're just narrative text in the document body.

### Fix
Disable or restrict standalone chapter detection to only work when:
1. The text is actually a markdown heading (has `##` prefix)
2. OR it's at the start of a new section with proper context

**File:** `modules/parser_markdown.py`  
**Lines:** 391-460

---

## Fix 2: Term Chapter Field Population

### Problem
All terms have empty `chapter:` fields, preventing cross-referencing.

### Root Cause
Term extraction doesn't track the current chapter context during AST traversal.

### Fix
Track current chapter during AST traversal and assign to terms.

**File:** `modules/extractor_terms_v3.py`  
**Method:** `extract()` - needs chapter context tracking

---

## Fix 3: Pattern Block Extraction

### Problem
Code patterns are classified as `::: code-pattern` but not as `::: pattern` blocks.

### Root Cause
Pattern extraction only creates `code-pattern` blocks, not conceptual `pattern` blocks.

### Fix
Add pattern block extraction that creates `::: pattern` blocks for conceptual patterns.

**File:** `modules/extractor_code_enhanced.py` or new `extractor_patterns.py`

---

## Fix 4: Symbol Reference Population

### Problem
All blocks have empty `symbol_refs: []`.

### Root Cause
Symbol table is not being used to populate cross-references during block creation.

### Fix
Implement symbol reference extraction and resolution during block creation.

**File:** `modules/parser_ssm.py` or enrichment modules

---

## Fix 5: Semantic Role Mapping

### Problem
Only 4 semantic roles used instead of 14 expected.

### Root Cause
Block type to semantic role mapping is incomplete.

### Fix
Add comprehensive mapping in `modules/v3_metadata.py`.

---

## Implementation Order

1. Fix 1 (Chapter Hierarchy) - **HIGHEST PRIORITY**
2. Fix 2 (Term Chapter Fields) - **HIGH PRIORITY**
3. Fix 4 (Symbol References) - **HIGH PRIORITY**
4. Fix 3 (Pattern Blocks) - **MEDIUM PRIORITY**
5. Fix 5 (Semantic Roles) - **MEDIUM PRIORITY**

---

**Next:** Begin implementing Fix 1

