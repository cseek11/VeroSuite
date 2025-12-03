# Solution 4: Missing Block Types - Implementation

**Date:** 2025-11-26  
**Status:** ✅ Implemented and Tested  
**Priority:** CRITICAL (Fixes Issue 5)

## Overview

Implemented extractors for missing V3 block types: antipattern, rationale, and contrast. These extractors use pattern matching to detect and extract these semantic block types from content.

## Implementation

### Files Created

1. **`modules/extractor_antipatterns.py`**
   - `AntipatternExtractor` class
   - `AntipatternEntry` dataclass
   - Detects bad practices, common mistakes, problematic approaches
   - Extracts problem, solution, rationale, severity

2. **`modules/extractor_rationale.py`**
   - `RationaleExtractor` class
   - `RationaleEntry` dataclass
   - Detects reasoning explanations ("because", "since", "this allows")
   - Extracts explanation and related concept

3. **`modules/extractor_contrast.py`**
   - `ContrastExtractor` class
   - `ContrastEntry` dataclass
   - Detects comparisons ("X vs Y", "unlike X, Y")
   - Extracts concepts and differences

4. **`test_solution4_missing_blocks.py`**
   - Comprehensive test suite

### Integration

**Modified:** `compiler.py`
- Added imports for all three extractors
- Integrated extraction after semantic relations
- Converts extracted entries to SSM blocks

## Features

### 1. Antipattern Extraction

**Indicators:**
- "anti-pattern", "bad practice", "common mistake"
- "don't", "avoid", "never", "must not"
- "incorrect", "wrong", "problematic", "dangerous"
- "pitfall", "gotcha", "trap"
- ❌ emoji

**Extracted Fields:**
- `problem`: Description of problematic pattern
- `solution`: Recommended alternative (if found)
- `rationale`: Why it's bad (if found)
- `severity`: high, medium, low

### 2. Rationale Extraction

**Indicators:**
- "because", "since", "reason", "why"
- "this allows/enables/ensures/prevents"
- "benefit", "advantage", "purpose"
- "in order to", "so that"
- "rationale", "reasoning", "justification"

**Extracted Fields:**
- `explanation`: The rationale/reasoning
- `related_to`: What this rationale explains (if found)

### 3. Contrast Extraction

**Indicators:**
- "vs", "versus", "compared to/with"
- "unlike", "different from", "differs from"
- "in contrast", "on the other hand", "however"
- "whereas", "while", "although"
- "side by side", "comparison", "compare"

**Extracted Fields:**
- `concept_a`: First concept being compared
- `concept_b`: Second concept being compared
- `differences`: Key differences

## Test Results

All tests passing:

```
✅ Test 1: Antipattern Extraction
   - Detects antipatterns correctly
   - Extracts problem, solution, severity

✅ Test 2: Rationale Extraction
   - Detects rationale explanations
   - Extracts reasoning text

✅ Test 3: Contrast Extraction
   - Detects comparisons
   - Extracts both concepts and differences
```

## Impact

### Issues Fixed

- **Issue 5:** Missing V3 Block Types ✅
  - Antipattern blocks now generated
  - Rationale blocks now generated
  - Contrast blocks now generated

### Block Types Status

- ✅ `::: qa` - Already implemented (verified)
- ✅ `::: antipattern` - **NEW** - Implemented
- ✅ `::: rationale` - **NEW** - Implemented
- ✅ `::: contrast` - **NEW** - Implemented
- ✅ `::: relation` - Already exists (enhanced with Solution 2)
- ✅ `::: diagram` - Already exists
- ⚠️ `::: pattern` - Partial (code-pattern exists, non-code pattern pending)

## Usage

The extractors run automatically in the compiler pipeline:

```python
# In compiler.py
# Solution 4: Extract missing block types
if extract_antipatterns_from_ast is not None:
    antipatterns = extract_antipatterns_from_ast(ast, errors=errors, symbols=symbols)
    # Convert to SSM blocks...

if RationaleExtractor is not None:
    rationale_extractor = RationaleExtractor(errors=errors, symbols=symbols)
    rationales = rationale_extractor.extract(ast)
    # Convert to SSM blocks...

if ContrastExtractor is not None:
    contrast_extractor = ContrastExtractor(errors=errors, symbols=symbols)
    contrasts = contrast_extractor.extract(ast)
    # Convert to SSM blocks...
```

## Example Output

**Antipattern Block:**
```ssm
::: antipattern
id: antipattern-10-123
problem: Don't use unsafe variables in Rego policies
solution: Use input validation and proper variable scoping
rationale: Can lead to security vulnerabilities
severity: high
chapter: CH-03
:::
```

**Rationale Block:**
```ssm
::: rationale
id: rationale-20-124
explanation: ensures that negation is evaluated correctly in the presence of variables
related_to: Stratified Negation
chapter: CH-05
:::
```

**Contrast Block:**
```ssm
::: contrast
id: contrast-30-125
concept_a: Sidecar deployment
concept_b: Central deployment
differences: Sidecar runs alongside each service, while Central runs as a separate service
chapter: CH-07
:::
```

## Next Steps

1. ✅ Solution 1: Two-Phase Processing - **COMPLETE**
2. ✅ Solution 2: Semantic Relation Extraction - **COMPLETE**
3. ✅ Solution 3: AST-Based Term Extraction - **COMPLETE**
4. ✅ Solution 4: Missing Block Types - **COMPLETE**
5. ⏳ Solution 5: V3 SSM Fields - **NEXT**

---

**Last Updated:** 2025-11-26

