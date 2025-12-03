# TypeScript Bible Split Preparation Plan

**Date:** 2025-11-30  
**Status:** Planning  
**Target:** Prepare `typescript_bible_unified.mdc` for splitting via `split_book.py`

---

## Executive Summary

This plan addresses all compliance issues identified in the split requirements checklist and prepares the TypeScript Bible for successful splitting. The plan includes directory structure setup, chapter ordering fixes, configuration file creation, and validation steps.

---

## Issues Identified

### Critical (Blocking)
1. ❌ **Missing configuration file** (`bible_config.yaml`)
2. ❌ **Missing SSM chunk boundaries** (optional but recommended)
3. ⚠️ **Chapter numbering issues** (decimal chapters, out-of-order)

### Non-Critical (Warnings)
4. ⚠️ **File not in expected directory structure**
5. ⚠️ **Missing `book.yaml` structure file**

---

## Phase 1: Directory Structure Setup

### Step 1.1: Create Base Directory Structure

**Action:** Create the TypeScript Bible directory structure following Python Bible pattern.

**Commands:**
```bash
# Create base directory
mkdir -p "docs/reference/Programming Bibles/bibles/typescript_bible"

# Create subdirectories
mkdir -p "docs/reference/Programming Bibles/bibles/typescript_bible/config"
mkdir -p "docs/reference/Programming Bibles/bibles/typescript_bible/chapters"
mkdir -p "docs/reference/Programming Bibles/bibles/typescript_bible/source"
mkdir -p "docs/reference/Programming Bibles/bibles/typescript_bible/dist"
```

**Expected Structure:**
```
docs/reference/Programming Bibles/bibles/typescript_bible/
├── config/
│   ├── bible_config.yaml (to be created)
│   └── book.yaml (to be created after split)
├── chapters/ (will contain split chapter files)
├── source/
│   └── typescript_bible_unified.mdc (to be moved here)
└── dist/ (for merged/compiled outputs)
```

**Verification:**
- [ ] All directories created successfully
- [ ] Directory structure matches Python Bible pattern

---

## Phase 2: Fix Chapter Ordering Issues

### Step 2.1: Identify Chapter Ordering Problems

**Current Issues:**
- Chapter 40 appears **after** Chapter 41 (lines 18,818 vs 18,636)
- Decimal chapters: 18.5, 18.6, 18.7 (may need special handling)

**Action:** Fix chapter ordering in source file.

**Decision Required:** Choose one approach:

**Option A: Renumber Decimal Chapters (Recommended)**
- Rename Chapter 18.5 → Chapter 19
- Rename Chapter 18.6 → Chapter 20
- Rename Chapter 18.7 → Chapter 21
- Renumber subsequent chapters (19→22, 20→23, etc.)
- Move Chapter 40 before Chapter 41

**Option B: Keep Decimal Chapters**
- Update regex pattern to support decimals: `(\d+(?:\.\d+)?)`
- Move Chapter 40 before Chapter 41
- Accept non-sequential numbering

**Recommended:** Option A (renumber) for cleaner structure.

### Step 2.2: Fix Chapter 40/41 Ordering

**Action:** Move Chapter 40 content to appear before Chapter 41.

**Current Order:**
```
Line 18,636: ## Chapter 41 — Language Specification Alignment
Line 18,818: ## Chapter 40 — Capstone
```

**Target Order:**
```
Line 18,636: ## Chapter 40 — Capstone
Line 18,818: ## Chapter 41 — Language Specification Alignment
```

**Steps:**
1. Extract Chapter 40 content (lines 18,818 to 18,909)
2. Extract Chapter 41 content (lines 18,636 to 18,817)
3. Swap positions in file
4. Verify chapter order is now: 39 → 40 → 41 → 42

**Verification:**
- [ ] Chapter 40 appears before Chapter 41
- [ ] Chapter sequence is: 39, 40, 41, 42
- [ ] No content lost during reordering

### Step 2.3: Handle Decimal Chapters (If Option A)

**Action:** Renumber decimal chapters to sequential integers.

**Current:**
- Chapter 18.5 — DOM & Web API Types
- Chapter 18.6 — Node.js Types & Modules
- Chapter 18.7 — Third-Party Type Libraries

**Target (if renumbering):**
- Chapter 19 — DOM & Web API Types
- Chapter 20 — Node.js Types & Modules
- Chapter 21 — Third-Party Type Libraries

**Steps:**
1. Find all occurrences of "Chapter 18.5", "Chapter 18.6", "Chapter 18.7"
2. Replace with "Chapter 19", "Chapter 20", "Chapter 21"
3. Renumber subsequent chapters:
   - Chapter 19 → Chapter 22
   - Chapter 20 → Chapter 23
   - Chapter 21 → Chapter 24
   - ... (continue through Chapter 42)
4. Update all cross-references to these chapters

**Verification:**
- [ ] All decimal chapters renumbered
- [ ] All subsequent chapters renumbered
- [ ] Cross-references updated
- [ ] Chapter sequence is now: 1, 2, 3, ..., 42 (no gaps, no decimals)

---

## Phase 3: Create Configuration Files

### Step 3.1: Create `bible_config.yaml`

**File Path:** `docs/reference/Programming Bibles/bibles/typescript_bible/config/bible_config.yaml`

**Content:**
```yaml
# Bible Configuration for TypeScript Bible
# This file defines the patterns and rules for splitting and processing the TypeScript Bible

# Chapter title patterns (primary method - no boundaries needed)
# Must capture chapter number in group 1, title in group 2
chapter_title_patterns:
  - pattern: '^## Chapter (\d+) — (.+)$'
    description: "Matches Chapter X — Title format (sequential integers)"
  
  # Alternative pattern if keeping decimal chapters:
  # - pattern: '^## Chapter (\d+(?:\.\d+)?) — (.+)$'
  #   description: "Matches Chapter X — Title format (supports decimals)"

# Part header patterns (optional, for organizing chapters into parts)
# Must capture part identifier in group 1, part name in group 2
part_header_patterns:
  - pattern: '^# PART (I{1,3}|IV|V|VI{0,3}) — (.+)$'
    description: "Matches PART X — TITLE format (Roman numerals I-V)"

# Slug generation rules for chapter filenames
slug_rules:
  remove_emoji: false          # No emoji in TypeScript Bible
  lowercase: true              # Convert to lowercase
  replace_non_alnum_with_space: true  # Replace non-alphanumeric with spaces
  collapse_whitespace: true   # Collapse multiple spaces to single space
  separator: "_"               # Use underscore as separator

# Book metadata for SSM compilation
book_metadata:
  title: "TypeScript Bible"
  version: "1.0.0"
  namespace: "typescript_bible"
```

**Verification:**
- [ ] File created at correct path
- [ ] YAML syntax is valid (no errors)
- [ ] Patterns match actual chapter/part formats in source file
- [ ] Slug rules are appropriate for TypeScript Bible

### Step 3.2: Validate Configuration File

**Action:** Test configuration file can be loaded and patterns match.

**Test Command:**
```bash
cd docs/reference/Programming Bibles
python -c "
from pathlib import Path
from tools.precompile.loaders.config_loader import load_config
config = load_config(Path('bibles/typescript_bible/config/bible_config.yaml'))
print('Config loaded successfully')
print(f'Chapter title patterns: {len(config.get(\"chapter_title_patterns\", []))}')
print(f'Part header patterns: {len(config.get(\"part_header_patterns\", []))}')
"
```

**Verification:**
- [ ] Configuration file loads without errors
- [ ] Patterns are valid regex
- [ ] Pattern count matches expected

---

## Phase 4: Move Source File

### Step 4.1: Move Unified File to Source Directory

**Action:** Move the unified file to the expected location.

**Source:** `docs/bibles/typescript_bible_unified.mdc`  
**Target:** `docs/reference/Programming Bibles/bibles/typescript_bible/source/typescript_bible_unified.mdc`

**Command:**
```bash
# Copy file to preserve original
cp "docs/bibles/typescript_bible_unified.mdc" \
   "docs/reference/Programming Bibles/bibles/typescript_bible/source/typescript_bible_unified.mdc"
```

**Alternative (if keeping original):**
```bash
# Move file (removes from original location)
mv "docs/bibles/typescript_bible_unified.mdc" \
   "docs/reference/Programming Bibles/bibles/typescript_bible/source/typescript_bible_unified.mdc"
```

**Verification:**
- [ ] File exists at target location
- [ ] File is readable
- [ ] File size matches original (617,704 bytes)
- [ ] File content is unchanged

---

## Phase 5: Optional - Add SSM Chunk Boundaries

### Step 5.1: Decide on SSM Boundaries

**Decision:** Add SSM chunk boundaries for better structure tracking?

**Pros:**
- Enables boundary-based splitting (alternative to title-based)
- Better structure tracking in compiled SSM
- Matches Python Bible pattern

**Cons:**
- Requires editing 42+ chapter boundaries
- Not strictly required (title-based splitting works)

**Recommendation:** Optional - can be added later if needed. Title-based splitting is sufficient.

### Step 5.2: Add SSM Boundaries (If Chosen)

**Action:** Add SSM chunk boundaries at start and end of each chapter.

**Format:**
```html
<!-- SSM:CHUNK_BOUNDARY id="ch01-start" -->
## Chapter 1 — Introduction to TypeScript
...
<!-- SSM:CHUNK_BOUNDARY id="ch01-end" -->
```

**Steps:**
1. For each chapter (1-42):
   - Add `<!-- SSM:CHUNK_BOUNDARY id="chXX-start" -->` before chapter heading
   - Add `<!-- SSM:CHUNK_BOUNDARY id="chXX-end" -->` after chapter content
   - Use zero-padded format: `ch01`, `ch02`, ..., `ch42`

**Automation Script (Python):**
```python
import re
from pathlib import Path

file_path = Path("docs/reference/Programming Bibles/bibles/typescript_bible/source/typescript_bible_unified.mdc")
content = file_path.read_text(encoding='utf-8')

# Find all chapter headings
chapter_pattern = r'^## Chapter (\d+) — (.+)$'
chapters = re.finditer(chapter_pattern, content, re.MULTILINE)

# Add boundaries (simplified - would need full implementation)
# This is a placeholder - full script would need to track chapter ends
```

**Verification:**
- [ ] All chapters have start boundaries
- [ ] All chapters have end boundaries
- [ ] Boundary IDs are correctly formatted (ch01, ch02, etc.)
- [ ] No duplicate boundary IDs

---

## Phase 6: Validation and Testing

### Step 6.1: Dry-Run Split

**Action:** Run `split_book.py` in dry-run mode to verify configuration.

**Command:**
```bash
cd docs/reference/Programming Bibles/tools/precompile

python split_book.py \
  --config "../../bibles/typescript_bible/config/bible_config.yaml" \
  --input "../../bibles/typescript_bible/source/typescript_bible_unified.mdc" \
  --output "../../bibles/typescript_bible/chapters/" \
  --book-yaml "../../bibles/typescript_bible/config/book.yaml" \
  --dry-run \
  --verbose
```

**Expected Output:**
- ✅ "Loaded configuration from ..."
- ✅ "Compiled pattern matchers"
- ✅ "Read X lines from ..."
- ✅ "Processed N chapters" (should be 42)
- ✅ "Chapter files would be written to ..."
- ✅ "Book structure would be written to ..."
- ⚠️ Warnings only for non-critical issues

**Verification:**
- [ ] Dry-run completes without errors
- [ ] All 42 chapters detected
- [ ] All 5 parts detected
- [ ] No critical errors
- [ ] Warnings are acceptable (if any)

### Step 6.2: Verify Chapter Detection

**Action:** Verify all chapters are correctly identified.

**Check:**
- [ ] Chapter 1 detected
- [ ] All chapters 1-42 detected
- [ ] No duplicate chapter numbers
- [ ] Chapter titles extracted correctly
- [ ] Part headers detected correctly

### Step 6.3: Verify Pattern Matching

**Action:** Test that patterns match actual content.

**Test Commands:**
```bash
# Test chapter title pattern
python -c "
import re
pattern = r'^## Chapter (\d+) — (.+)$'
test_lines = [
    '## Chapter 1 — Introduction to TypeScript',
    '## Chapter 18.5 — DOM & Web API Types',  # Should NOT match if using integer-only pattern
    '## Chapter 42 — Governance'
]
for line in test_lines:
    match = re.match(pattern, line)
    if match:
        print(f'MATCH: {line} -> Chapter {match.group(1)}, Title: {match.group(2)}')
    else:
        print(f'NO MATCH: {line}')
"

# Test part header pattern
python -c "
import re
pattern = r'^# PART (I{1,3}|IV|V|VI{0,3}) — (.+)$'
test_lines = [
    '# PART I — FOUNDATIONS',
    '# PART II — LANGUAGE CONCEPTS',
    '# PART V — APPENDICES'
]
for line in test_lines:
    match = re.match(pattern, line)
    if match:
        print(f'MATCH: {line} -> Part {match.group(1)}, Name: {match.group(2)}')
    else:
        print(f'NO MATCH: {line}')
"
```

**Verification:**
- [ ] Chapter title pattern matches all chapter headings
- [ ] Part header pattern matches all part headers
- [ ] Patterns do not match false positives

---

## Phase 7: Execute Split

### Step 7.1: Run Actual Split

**Action:** Execute the split operation (after dry-run succeeds).

**Command:**
```bash
cd docs/reference/Programming Bibles/tools/precompile

python split_book.py \
  --config "../../bibles/typescript_bible/config/bible_config.yaml" \
  --input "../../bibles/typescript_bible/source/typescript_bible_unified.mdc" \
  --output "../../bibles/typescript_bible/chapters/" \
  --book-yaml "../../bibles/typescript_bible/config/book.yaml" \
  --verbose
```

**Expected Output:**
- ✅ "Loaded configuration from ..."
- ✅ "Compiled pattern matchers"
- ✅ "Read 21,808 lines from ..."
- ✅ "Processed 42 chapters"
- ✅ "Chapter files written to ..."
- ✅ "Book structure written to ..."

**Verification:**
- [ ] Split completes successfully
- [ ] All 42 chapter files created in `chapters/` directory
- [ ] `book.yaml` file created in `config/` directory
- [ ] No errors during split

### Step 7.2: Verify Split Output

**Action:** Verify all chapter files and book.yaml are correct.

**Checks:**
- [ ] 42 chapter files exist in `chapters/` directory
- [ ] All chapter files are non-empty
- [ ] Chapter files are named correctly (e.g., `01_introduction_to_typescript.md`)
- [ ] `book.yaml` contains all 42 chapters
- [ ] `book.yaml` has correct part structure (5 parts)
- [ ] All chapter paths in `book.yaml` use forward slashes
- [ ] No duplicate chapter paths in `book.yaml`

**Verification Commands:**
```bash
# Count chapter files
ls "docs/reference/Programming Bibles/bibles/typescript_bible/chapters/" | wc -l
# Should be 42

# Verify book.yaml structure
python -c "
import yaml
from pathlib import Path
book_yaml = Path('docs/reference/Programming Bibles/bibles/typescript_bible/config/book.yaml')
data = yaml.safe_load(book_yaml.read_text())
print(f'Parts: {len(data[\"parts\"])}')
total_chapters = sum(len(part[\"chapters\"]) for part in data[\"parts\"])
print(f'Total chapters: {total_chapters}')
"
```

---

## Phase 8: Post-Split Validation

### Step 8.1: Verify Chapter Content

**Action:** Spot-check chapter files for content integrity.

**Checks:**
- [ ] Chapter 1 contains expected content
- [ ] Chapter 40 appears before Chapter 41 (if reordered)
- [ ] No content duplication
- [ ] No content missing
- [ ] Code blocks preserved
- [ ] Mermaid diagrams preserved
- [ ] Frontmatter included in Chapter 1

**Sample Verification:**
```bash
# Check Chapter 1
head -20 "docs/reference/Programming Bibles/bibles/typescript_bible/chapters/01_introduction_to_typescript.md"

# Check Chapter 40 (should be before 41)
grep -l "Chapter 40" "docs/reference/Programming Bibles/bibles/typescript_bible/chapters/"*.md
grep -l "Chapter 41" "docs/reference/Programming Bibles/bibles/typescript_bible/chapters/"*.md
```

### Step 8.2: Verify book.yaml Structure

**Action:** Validate `book.yaml` structure matches requirements.

**Required Checks:**
- [ ] `book.yaml` is valid YAML
- [ ] Contains `parts` list
- [ ] Each part has `name` field
- [ ] Each part has `chapters` list
- [ ] All chapter paths use forward slashes
- [ ] No duplicate chapter paths
- [ ] All chapter paths reference actual files

**Verification Script:**
```python
import yaml
from pathlib import Path

book_yaml = Path("docs/reference/Programming Bibles/bibles/typescript_bible/config/book.yaml")
data = yaml.safe_load(book_yaml.read_text())

# Verify structure
assert "parts" in data, "Missing 'parts' field"
assert len(data["parts"]) == 5, f"Expected 5 parts, found {len(data['parts'])}"

# Verify each part
all_chapters = []
for part in data["parts"]:
    assert "name" in part, f"Part missing 'name': {part}"
    assert "chapters" in part, f"Part missing 'chapters': {part}"
    for chapter_path in part["chapters"]:
        assert chapter_path.startswith("chapters/"), f"Invalid path format: {chapter_path}"
        assert "/" in chapter_path, f"Path should use forward slashes: {chapter_path}"
        assert chapter_path not in all_chapters, f"Duplicate chapter path: {chapter_path}"
        all_chapters.append(chapter_path)
        
        # Verify file exists
        chapter_file = Path("docs/reference/Programming Bibles/bibles/typescript_bible") / chapter_path
        assert chapter_file.exists(), f"Chapter file not found: {chapter_path}"

print(f"✅ book.yaml validation passed: {len(all_chapters)} chapters across {len(data['parts'])} parts")
```

---

## Implementation Checklist

### Pre-Implementation
- [ ] Review and approve plan
- [ ] Decide on decimal chapter handling (Option A or B)
- [ ] Decide on SSM boundaries (add or skip)

### Phase 1: Directory Structure
- [ ] Create base directory: `docs/reference/Programming Bibles/bibles/typescript_bible/`
- [ ] Create `config/` subdirectory
- [ ] Create `chapters/` subdirectory
- [ ] Create `source/` subdirectory
- [ ] Create `dist/` subdirectory
- [ ] Verify directory structure matches Python Bible pattern

### Phase 2: Fix Chapter Ordering
- [ ] Fix Chapter 40/41 ordering (move 40 before 41)
- [ ] If Option A: Renumber decimal chapters (18.5→19, 18.6→20, 18.7→21)
- [ ] If Option A: Renumber subsequent chapters (19→22, 20→23, etc.)
- [ ] If Option A: Update all cross-references
- [ ] Verify chapter sequence is now: 1, 2, 3, ..., 42 (no gaps, no decimals if Option A)

### Phase 3: Configuration Files
- [ ] Create `bible_config.yaml` with correct patterns
- [ ] Test configuration file loads without errors
- [ ] Verify patterns match actual content format
- [ ] Validate YAML syntax

### Phase 4: Move Source File
- [ ] Copy/move unified file to `source/` directory
- [ ] Verify file is readable at new location
- [ ] Verify file size matches original
- [ ] Verify file content is unchanged

### Phase 5: SSM Boundaries (Optional)
- [ ] If adding boundaries: Add start boundary for each chapter
- [ ] If adding boundaries: Add end boundary for each chapter
- [ ] If adding boundaries: Verify all boundaries have correct IDs
- [ ] If adding boundaries: Verify no duplicate boundary IDs

### Phase 6: Validation
- [ ] Run dry-run split
- [ ] Verify all 42 chapters detected
- [ ] Verify all 5 parts detected
- [ ] Test pattern matching with sample content
- [ ] Fix any pattern matching issues

### Phase 7: Execute Split
- [ ] Run actual split operation
- [ ] Verify split completes successfully
- [ ] Verify 42 chapter files created
- [ ] Verify `book.yaml` created
- [ ] Verify no errors during split

### Phase 8: Post-Split Validation
- [ ] Verify all chapter files exist and are non-empty
- [ ] Verify `book.yaml` structure is correct
- [ ] Spot-check chapter content for integrity
- [ ] Verify no content duplication or loss
- [ ] Verify code blocks and diagrams preserved

---

## Decision Points

### Decision 1: Decimal Chapter Handling

**Option A: Renumber (Recommended)**
- **Pros:** Clean sequential numbering, easier to manage
- **Cons:** Requires updating all cross-references
- **Effort:** Medium (requires find/replace and cross-reference updates)

**Option B: Keep Decimals**
- **Pros:** Preserves original numbering, no cross-reference updates
- **Cons:** Requires regex pattern to support decimals, non-standard
- **Effort:** Low (just update regex pattern)

**Recommendation:** Option A (renumber) for cleaner structure and easier maintenance.

### Decision 2: SSM Chunk Boundaries

**Option A: Add Boundaries**
- **Pros:** Better structure tracking, enables boundary-based splitting
- **Cons:** Requires editing 84+ boundary markers (42 chapters × 2)
- **Effort:** High (manual or script-assisted)

**Option B: Skip Boundaries**
- **Pros:** Title-based splitting works without boundaries
- **Cons:** No boundary-based splitting option
- **Effort:** None

**Recommendation:** Option B (skip) - title-based splitting is sufficient and less effort.

---

## Risk Assessment

### Low Risk
- ✅ Directory structure creation
- ✅ Configuration file creation
- ✅ File movement

### Medium Risk
- ⚠️ Chapter reordering (risk of content loss if not careful)
- ⚠️ Chapter renumbering (risk of missing cross-references)

### High Risk
- ⚠️ Adding SSM boundaries manually (risk of typos, missing boundaries)

**Mitigation:**
- Always backup original file before making changes
- Use version control (git) to track changes
- Test with dry-run before actual split
- Verify content integrity after each major change

---

## Backup Strategy

### Before Starting

**Action:** Create backup of original file.

**Command:**
```bash
# Create timestamped backup
cp "docs/bibles/typescript_bible_unified.mdc" \
   "docs/bibles/typescript_bible_unified_BACKUP_$(date +%Y-%m-%d_%H-%M-%S).mdc"
```

**Verification:**
- [ ] Backup file created
- [ ] Backup file size matches original
- [ ] Backup file is readable

---

## Success Criteria

The preparation is **SUCCESSFUL** when:

1. ✅ **Directory structure created** - All required directories exist
2. ✅ **Configuration file created** - `bible_config.yaml` exists and is valid
3. ✅ **Chapter ordering fixed** - Chapter 40 before 41, sequential numbering (if Option A)
4. ✅ **Source file moved** - File is in `source/` directory
5. ✅ **Dry-run succeeds** - Split dry-run completes without errors
6. ✅ **Split succeeds** - Actual split creates 42 chapter files
7. ✅ **book.yaml created** - Valid `book.yaml` with all chapters
8. ✅ **Content integrity** - No content loss, duplication, or corruption

---

## Timeline Estimate

- **Phase 1 (Directory Structure):** 5 minutes
- **Phase 2 (Chapter Ordering):** 30-60 minutes (depending on Option A/B)
- **Phase 3 (Configuration):** 15 minutes
- **Phase 4 (File Move):** 2 minutes
- **Phase 5 (SSM Boundaries):** 60-120 minutes (if chosen, optional)
- **Phase 6 (Validation):** 15 minutes
- **Phase 7 (Split):** 5 minutes
- **Phase 8 (Post-Validation):** 15 minutes

**Total Estimated Time:**
- **Without SSM boundaries:** 1.5-2 hours
- **With SSM boundaries:** 2.5-3.5 hours

---

## Next Steps After Split

Once split is successful:

1. **Merge Stage:** Run `merge_book.py` to create `dist/typescript_bible_raw.md`
2. **Compile Stage:** Run SSM Compiler to create `dist/typescript_bible.ssm.md`
3. **Ingest Stage:** Run `bible_pipeline.py` to create Cursor outputs

---

## References

- **Split Requirements:** `docs/reference/Programming Bibles/tools/precompile/SPLIT_REQUIREMENTS_CHECKLIST.md`
- **Python Bible Config:** `docs/reference/Programming Bibles/bibles/python_bible/config/bible_config.yaml`
- **Split Tool:** `docs/reference/Programming Bibles/tools/precompile/split_book.py`
- **Merge Requirements:** `docs/reference/Programming Bibles/Planning/Resources/Requirements for Successful Compile and Ingest.md`

---

**Last Updated:** 2025-11-30  
**Status:** Ready for Implementation  
**Next Action:** Review plan and begin Phase 1













