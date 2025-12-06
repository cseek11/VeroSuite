# SSM Compiler Version 3 Upgrade Plan

**Last Updated:** 2025-12-05  
**Status:** Planning Document - Ready for Implementation

## Executive Summary

**Current State:** Version 2.5 (High-quality SSM output, but missing 20 advanced V3 capabilities)  
**Target State:** Full Version 3 with hierarchical AST, multi-hop graphs, advanced enrichments  
**Timeline:** Phased implementation across 10 major milestones

---

## 📋 Alternative Implementation Roadmap (10-Phase Structure)

This section provides an alternative, more granular 10-phase roadmap that builds from foundation to production-ready compiler. This can be used alongside or instead of the 5-phase structure above.

### Phase 0: Baseline & Typing Foundation

**Goal:** Lock in a typed core so everything else is safe to extend.

**Key Tasks:**

1. **Convert core data structures to typed models:**
   - `ASTNode`, `ASTDocument`, `SSMBlock`, `CodePattern`, `RelationEntry`, `TermEntry` → `@dataclass` + `TypedDict` where useful
   - Optionally add Pydantic models for SSM serialization/deserialization

2. **Add type checking to CI:**
   - Add `mypy` (or `pyright`) to CI
   - Add `pyproject.toml` / `setup.cfg` with strict typing config

**Deliverables:**
- `models/ast.py` - Typed AST models
- `models/ssm.py` - Typed SSM block models
- `models/patterns.py` - Typed pattern models
- `models/relations.py` - Typed relation models
- `mypy.ini` or typed config in `pyproject.toml`
- First pytest run with type checking integrated

**Acceptance Criteria:**
- ✅ `mypy` passes with no or minimal ignores
- ✅ All core models are typed and used consistently
- ✅ Type hints enable better IDE support and catch errors early

**Implementation Example:**

```python
# models/ast.py

from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Literal
from runtime.tokens import Token


@dataclass
class ASTNode:
    """Typed AST node with full type hints."""
    type: Literal["part", "chapter", "section", "paragraph", "code", "diagram", "table"]
    text: str = ""
    line_no: int = 0
    level: int = 0
    lang: str = ""
    code: str = ""
    meta: Dict[str, Any] = field(default_factory=dict)
    token: Optional[Token] = None
    parent: Optional["ASTNode"] = None
    children: List["ASTNode"] = field(default_factory=list)
    errors: List[str] = field(default_factory=list)
    
    def add_child(self, node: "ASTNode") -> None:
        """Add child node with type safety."""
        node.parent = self
        self.children.append(node)
    
    def find_chapter(self) -> Optional["ASTNode"]:
        """Find chapter ancestor with type safety."""
        current = self.parent
        while current:
            if current.type == "chapter":
                return current
            current = current.parent
        return None
```

```python
# models/ssm.py

from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Literal, Union
from enum import Enum


class SSMBlockType(str, Enum):
    """Canonical SSM block types."""
    PART_META = "part-meta"
    CHAPTER_META = "chapter-meta"
    SECTION_META = "section-meta"
    CONCEPT = "concept"
    FACT = "fact"
    EXAMPLE = "example"
    CODE = "code"
    CODE_PATTERN = "code-pattern"
    TERM = "term"
    RELATION = "relation"
    ANTI_PATTERN = "anti-pattern"
    DIAGRAM = "diagram"
    TABLE = "table"
    QA = "qa"
    REASONING_CHAIN = "reasoning_chain"


@dataclass
class SSMBlock:
    """Typed SSM block with render capability."""
    block_type: SSMBlockType
    meta: Dict[str, Any] = field(default_factory=dict)
    body: str = ""
    index: int = 0
    id: str = ""
    chapter: Optional[str] = None
    
    def render(self) -> str:
        """Render SSM block to markdown format."""
        lines = [f"::: {self.block_type.value}"]
        
        # Add metadata
        for key, value in self.meta.items():
            if isinstance(value, list):
                inner = ", ".join(str(x) for x in value)
                lines.append(f"{key}: [{inner}]")
            elif isinstance(value, dict):
                import json
                lines.append(f"{key}: {json.dumps(value)}")
            else:
                lines.append(f"{key}: {value}")
        
        lines.append(":::")
        
        if self.body:
            lines.append(self.body)
            lines.append(":::")
        
        return "\n".join(lines)
```

```toml
# pyproject.toml

[tool.mypy]
python_version = "3.10"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
disallow_incomplete_defs = true
check_untyped_defs = true
disallow_untyped_decorators = true
no_implicit_optional = true
warn_redundant_casts = true
warn_unused_ignores = true
warn_no_return = true
strict_equality = true

[[tool.mypy.overrides]]
module = [
    "tests.*",
]
disallow_untyped_defs = false
```

---

### Phase 1: Hierarchical AST + SSM Core + Renderer

**Goal:** Solid tree structure and a complete SSM render path for existing block types.

#### 1.1 Hierarchical AST

**Implementation:**
- Implement Version-3 AST with `ASTDocument` containing parts, chapters, sections, and child nodes
- `ASTNode` with `parent`, `children`, `find_chapter()`, `find_section()` helpers
- Use streaming markdown parser to build this AST

**Deliverables:**
- `modules/ast_nodes.py` (hierarchical)
- `modules/parser_markdown.py` (streaming AST builder)

**Acceptance Criteria:**
- ✅ AST has proper parent-child relationships
- ✅ `find_chapter()` and `find_section()` work correctly
- ✅ All markdown elements are represented in AST

#### 1.2 SSM Block Renderer

**Define canonical SSM block types:**
- `part-meta`, `chapter-meta`, `section-meta`
- `concept`, `fact`, `example`
- `code`, `code-pattern`
- `term`, `relation`, `anti-pattern`, `diagram`, `table`
- `qa`, `reasoning_chain`

**Implementation:**
- Implement `SSMBlock.render()` to emit normalized SSM for each type
- Implement `ast_to_ssm_blocks(ast_doc, errors, symbols)` that:
  - walks the AST
  - produces these SSM blocks
  - wires in basic metadata (chapter code, section titles, etc.)

**Deliverables:**
- `modules/parser_ssm.py` (AST → SSM)
- `models/ssm_block.py` with `render()`

**Acceptance Criteria:**
- ✅ `rego_opa_bible.md` converts to a single `rego_opa_bible.ssm.md` with:
  - no unclosed `:::` blocks
  - exactly one `chapter-meta` per chapter
  - all chapters and sections represented

---

### Phase 2: Pattern Extractor + Multi-language Plugin System

**Goal:** Deep code pattern extraction, multi-language aware.

#### 2.1 Pattern Extractor

**Implementation:**
- Implement `PatternExtractor` for:
  - Rego (analyze_rego_ast / regex+heuristics)
  - Python (using `ast` module)
  - TypeScript/JS (regex + maybe a simple parser later)
  - SQL (pattern-based)
- Emit `code-pattern` SSM blocks with:
  - `language`, `pattern_type`, `pattern_subtype`, `tags`, `metadata`

**Deliverables:**
- `modules/extractor_patterns.py` coordinating all plugins

#### 2.2 Language Plugin Architecture

**Define LanguagePlugin interface:**

```python
# plugins/base.py

from typing import Protocol, List
from models.patterns import CodePattern


class LanguagePlugin(Protocol):
    """Protocol for language-specific pattern extractors."""
    name: str
    aliases: List[str]
    
    def detect(self, code: str) -> bool:
        """Detect if code is in this language."""
        ...
    
    def classify_patterns(self, code: str) -> List[CodePattern]:
        """Extract patterns from code."""
        ...
```

**Register plugins in LANGUAGE_REGISTRY:**

```python
# plugins/registry.py

from typing import Dict, Type
from plugins.base import LanguagePlugin

LANGUAGE_REGISTRY: Dict[str, Type[LanguagePlugin]] = {
    "rego": RegoPlugin,
    "typescript": TypeScriptPlugin,
    "python": PythonPlugin,
    "sql": SQLPlugin,
    "nestjs": NestJSPlugin,
    "prisma": PrismaPlugin,
    "cursor_rules": CursorRulesPlugin,
}
```

**Use plugins from `ast_to_ssm_blocks` when encountering `ASTNode(type="code")`.**

**Deliverables:**
- `plugins/rego.py`, `plugins/python.py`, `plugins/typescript.py`, `plugins/sql.py`, etc.
- `plugins/base.py` (Protocol definition)
- `plugins/registry.py` (Plugin registry)

**Acceptance Criteria:**
- ✅ For the OPA Bible: all Rego snippets are classified as `example` or `code-pattern` with useful `pattern_type`
- ✅ For test fixtures: TS/Python/SQL examples produce the expected pattern types

---

### Phase 3: Relation Extractor + Concept Graph

**Goal:** Build the graph brain around your document.

#### 3.1 Relation Extractor

**Implementation:**
- `extract_relations_from_ast(ast_doc)`:
  - detect "See Chapter X", "depends on Chapter Y", "builds on..." etc.
  - produce `RelationEntry` models
- Convert `RelationEntry` to `::: relation` SSM blocks with:
  - `from`, `to`, `type`, `context`, `confidence`

**Deliverables:**
- `modules/extractor_relations.py`

#### 3.2 Concept Graph / Multi-hop

**Implementation:**
- Build `concept_graph.py`:
  - input: list of `SSMBlocks`
  - output: adjacency map `node_id -> neighbors`
- Add multi-hop fields:
  - `graph_neighbors`, `graph_two_hop`, `graph_three_hop` into block metadata

**Deliverables:**
- `enrichment_v3/concept_graph.py`

**Acceptance Criteria:**
- ✅ All "See Chapter X" links in the Bible produce `relation` blocks
- ✅ `chapter-meta` includes meaningful prerequisite edges
- ✅ At least some key concepts have non-empty `graph_neighbors`

---

### Phase 4: Diagram Extractor + Table Normalization

**Goal:** Capture high-signal visual structures (diagrams & tables).

#### 4.1 Automatic Diagram Extractor

**Implementation:**
- `extract_diagrams_from_ast(ast_doc)`:
  - detect ` ```mermaid` blocks → diagram type `mermaid`
  - detect ASCII box flows → diagram type `ascii`
- Emit `::: diagram` blocks with:
  - `id`, `type`, `chapter`, `summary`, and raw diagram body

**Deliverables:**
- `modules/extractor_diagrams.py`

#### 4.2 Table Extraction

**Implementation:**
- Normalize markdown tables into `::: table` blocks:
  - `headers`, `rows`, optional `caption`
- Handle simple ASCII tables as a bonus if needed

**Deliverables:**
- `modules/extractor_tables.py`

**Acceptance Criteria:**
- ✅ At least one real diagram from the Bible is captured as a `diagram` block
- ✅ At least one table is converted to `table` SSM with correct headers and rows

---

### Phase 5: Validation, Schema, Versioning, Quality Gates, Tests

**Goal:** Turn this into a typed, validated, versioned compiler with real quality gates.

#### 5.1 SSM Schema & Validation

**Implementation:**
- Define JSON schema for each SSM block type
- Implement `validate_ssm(ssm_content: str) -> list[ValidationError]`
- Enforce:
  - `id` uniqueness
  - required fields present per type
  - references (`relation.to`, `relation.from`, `chapter-code`) resolve

**Deliverables:**
- `schemas/ssm_schema.json`
- `validation/validate_ssm.py`

#### 5.2 Versioning

**Implementation:**
- Add metadata to top of file or as a special SSM block:

```markdown
::: ssm-meta
compiler_version: 3.1.0
ssm_schema_version: 1.0.0
bible_version: 2025-12-05
namespace: rego_opa_bible
:::
```

**Deliverables:**
- `modules/parser_ssm.py` updated to emit `ssm-meta` block
- Version tracking in compiler

#### 5.3 Full Test Suite

**Implementation:**
- `tests/` suite to cover:
  - AST construction
  - pattern extraction (per language)
  - relations & graph
  - diagrams & tables
  - SSM rendering & validation
- Add golden snapshot tests:
  - e.g. `tests/golden/rego_ch3.ssm.md`
  - test ensures diffs are intentional

**Deliverables:**
- `tests/` full pytest suite
- `tests/golden/` directory with snapshot files

#### 5.4 CI Quality Gates

**Implementation:**
- GitHub Actions / CI:
  - `pytest`
  - `mypy`
  - `black` / `ruff` (optional)
  - `validate_ssm` on generated Bible SSM

**Deliverables:**
- `ci/` or `.github/workflows/compiler.yml`

**Acceptance Criteria:**
- ✅ CI builds fail if:
  - schema validation fails
  - tests fail
  - compiler version mismatches schema
- ✅ No unvalidated SSM files go to main

---

### Phase 6: Multi-language, Multi-tenant Symbol Table & Namespaces

**Goal:** Support many Bibles and avoid collisions; prepare for cross-Bible relations.

#### 6.1 SymbolTable v2 (multi-namespace)

**Implementation:**
- Extend `SymbolTable` to be:
  - `self.namespaces: dict[str, NamespaceSymbolTable]`
- `NamespaceSymbolTable` holds:
  - `chapters`, `terms`, `concepts`, `sections`, `patterns`
- Each compilation run:
  - uses a namespace (e.g. `"rego_opa_bible"`, `"typescript_bible"`)

**Deliverables:**
- `runtime/symbol_table.py` v2

#### 6.2 Namespace-aware IDs & relations

**Implementation:**
- All symbols keyed by `(namespace, id)` logically
- Relations optionally annotated with `from_namespace`, `to_namespace` to allow cross-Bible links later

**Deliverables:**
- Updated extractors & SSM emitters to include namespace where relevant

**Acceptance Criteria:**
- ✅ You can compile `rego_opa_bible.md` and a future `typescript_bible.md` in the same process with no collisions
- ✅ Symbol table reports chapter 1 in both Bibles unambiguously

---

### Phase 7: Observability, Metrics, and Safety

**Goal:** Make this thing observable and safe in a real environment.

#### 7.1 Metrics / Telemetry

**Implementation:**
- Create `runtime/metrics.py`:
  - simple counters: number of blocks by type, number of errors/warnings, compile time, etc.
- Optionally log as JSON:
  - `compile_stats.json` per run
- Optionally integrate with Prometheus or just log to stdout for now

**Deliverables:**
- `runtime/metrics.py`

#### 7.2 Quality Indicators

**Implementation:**
- Generate a summary report of:
  - terms, patterns, relations, diagrams, tables
  - unresolved references
  - anti-patterns

**Deliverables:**
- `runtime/metrics.py` extended with quality indicators

#### 7.3 Redaction / Safety Hooks

**Implementation:**
- Provide optional `Redactor` middleware:
  - runs over code and paragraphs
  - masks obvious secrets / tokens / hostnames (basic regex first)
- Configurable per namespace: some Bibles might be internal-only and skip this

**Deliverables:**
- `runtime/redactor.py`
- CI report artifact with metrics JSON

**Acceptance Criteria:**
- ✅ Each compile generates a metrics summary
- ✅ Pipeline can fail if metrics fall outside thresholds (e.g. ">0 schema errors" or "fewer than X patterns")

---

### Phase 8: LLM-ready Indexing & Prompt Glue

**Goal:** Make SSM output trivially consumable by agents / RAG.

#### 8.1 Indexing / RAG Layer

**Implementation:**
- `indexing/prep_for_embedding.py`:
  - splits SSM into embedding chunks:
    - `id`, `type`, `content`, `metadata` (chapter, section, level, pattern_type, etc.)
  - respects:
    - `embedding_hint_importance`
    - `embedding_hint_scope`
    - `embedding_hint_chunk`
- Output: JSONL file ready for vector store ingestion

**Deliverables:**
- `indexing/embedding_prep.py`

#### 8.2 Prompt Glue Library

**Implementation:**
- `llm/prompts.py`:
  - helpers like:
    - `build_system_prompt_from_ssm(blocks, roles)`
    - `format_blocks_for_context(blocks)`
    - `make_few_shot_examples(blocks)`
- Cursor / agent instructions can call this directly

**Deliverables:**
- `llm/prompts.py`

**Acceptance Criteria:**
- ✅ You can run: `biblec index rego_opa_bible.ssm.md → rego_opa_bible.index.jsonl`
- ✅ You can pass indexed chunks to an LLM and have:
  - properly structured system prompts
  - consistent examples drawn from patterns/anti-patterns

---

### Phase 9: Incremental, Fast, Hyper-Optimized Builds

**Goal:** Safe, fast incremental builds → Version-3.1.

#### 9.1 Content Hashing & Delta Detection

**Implementation:**
- Store per-chapter checksum:
  - `chapter.meta["content_hash"]`
- Cache previous compile metadata:
  - `biblec.state.json`
- On next compile:
  - only re-parse / re-enrich chapters whose hash changed

**Deliverables:**
- `runtime/cache.py` (hashing + state)

#### 9.2 Reuse Graph & Symbol Table Across Runs

**Implementation:**
- Persist symbol table and graph summaries:
  - optionally load them to avoid recomputing cross-chapter stuff where possible

**Deliverables:**
- `runtime/cache.py` extended with symbol table persistence

#### 9.3 Parallelization Where Safe

**Implementation:**
- Use multiprocessing or thread pool to:
  - process chapters in parallel during extraction & enrichment steps

**Deliverables:**
- `compiler.py` updated to support `--incremental`
- Parallel processing utilities

**Acceptance Criteria:**
- ✅ Re-running compile after a small edit:
  - significantly faster (e.g. O(Δ) rather than O(N))
- ✅ All tests and validations still pass in incremental mode

---

### Phase 10: Glue: CLI & Deployment

**Goal:** Make the whole thing easy to use across repos.

#### 10.1 CLI Implementation

**Implementation:**
- Implement `biblec` CLI:

```bash
biblec compile docs/rego_opa_bible.md -o docs/rego_opa_bible.ssm.md --namespace rego_opa_bible
biblec validate docs/rego_opa_bible.ssm.md
biblec index docs/rego_opa_bible.ssm.md -o docs/rego_opa_bible.index.jsonl
biblec stats docs/rego_opa_bible.ssm.md
```

**Deliverables:**
- `cli/biblec.py` (CLI entry point)
- `setup.py` or `pyproject.toml` with CLI entry point

#### 10.2 Documentation

**Implementation:**
- Create minimal docs:
  - `docs/USAGE.md`
  - `docs/SCHEMA.md`
  - `docs/EXTENDING.md` (how to add a new language plugin)

**Deliverables:**
- Documentation files

**Acceptance Criteria:**
- ✅ CLI is easy to use and well-documented
- ✅ New users can extend the compiler with new language plugins

---

## Final Outcome

Once you've walked through these 10 phases, you will have:

1. **A typed, validated, versioned knowledge compiler**
   - Typed models, JSON schema, validation step, explicit versions

2. **Hierarchical AST + graph + patterns + diagrams**
   - Structured AST, relation graph, code-pattern library, diagram and table blocks

3. **Multi-language, multi-tenant support**
   - Language plugins + namespaced SymbolTable

4. **Observability, quality gates, and tests**
   - Metrics, error bus, schema validation, pytest suite, golden samples

5. **LLM-ready indexing and prompt glue**
   - Index pipeline and prompt helpers tuned for RAG and agents

6. **Safe, fast, incremental builds**
   - Hash-based delta compilation + Version-3.1 optimizations

---

## 🎯 Phase 0: Foundation Patch (Error Bus, Tokens, Symbol Table)

**Priority:** CRITICAL - Must be implemented first as foundation for all other phases.

This phase provides the runtime infrastructure needed for robust parsing, error handling, and symbol management. It's a drop-in replacement that maintains backward compatibility while adding powerful new capabilities.

### 0.1 Error Event Bus (Centralized Diagnostics)

**Problem:** No centralized error handling, diagnostics scattered, no validation hooks.

**Solution:** Implement centralized error event bus for all diagnostics.

**File Structure:**
```
runtime/
    error_bus.py      # Error event dispatcher
    diagnostics.py    # Diagnostic utilities
```

**Implementation:**

```python
# runtime/error_bus.py

from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any


@dataclass
class ErrorEvent:
    type: str                    # "error", "warning", "info"
    code: str                    # e.g., ERR_DUPLICATE_CHAPTER_NUMBER
    message: str
    line: int
    column: int
    context: str = ""
    severity: str = "error"      # error | warning | info
    suggestion: Optional[str] = None
    meta: Dict[str, Any] = field(default_factory=dict)


class ErrorBus:
    """Central error logging / diagnostic event dispatcher."""

    def __init__(self):
        self.events: List[ErrorEvent] = []

    def emit(self, **kwargs):
        """Emit an error event."""
        evt = ErrorEvent(**kwargs)
        self.events.append(evt)
        # Optionally log to console in debug mode
        if kwargs.get("severity") == "error":
            print(f"ERROR [{evt.code}] Line {evt.line}:{evt.column} - {evt.message}")

    def error(self, code: str, message: str, line: int, column: int = 1, **kwargs):
        """Convenience method for errors."""
        self.emit(
            type="error",
            code=code,
            message=message,
            line=line,
            column=column,
            severity="error",
            **kwargs
        )

    def warning(self, code: str, message: str, line: int, column: int = 1, **kwargs):
        """Convenience method for warnings."""
        self.emit(
            type="warning",
            code=code,
            message=message,
            line=line,
            column=column,
            severity="warning",
            **kwargs
        )

    def info(self, code: str, message: str, line: int, column: int = 1, **kwargs):
        """Convenience method for info messages."""
        self.emit(
            type="info",
            code=code,
            message=message,
            line=line,
            column=column,
            severity="info",
            **kwargs
        )

    def errors(self) -> List[ErrorEvent]:
        """Get all error-level events."""
        return [e for e in self.events if e.severity == "error"]

    def warnings(self) -> List[ErrorEvent]:
        """Get all warning-level events."""
        return [e for e in self.events if e.severity == "warning"]

    def has_errors(self) -> bool:
        """Check if any errors were emitted."""
        return len(self.errors()) > 0

    def to_dict(self) -> List[Dict[str, Any]]:
        """Convert events to dictionary for JSON serialization."""
        return [e.__dict__ for e in self.events]

    def reset(self):
        """Clear all events (useful for testing)."""
        self.events = []

    def summary(self) -> Dict[str, int]:
        """Get summary of event counts."""
        return {
            "total": len(self.events),
            "errors": len(self.errors()),
            "warnings": len(self.warnings()),
            "info": len([e for e in self.events if e.severity == "info"])
        }
```

**Usage Example:**

```python
errors = ErrorBus()

# Emit errors during parsing
errors.error(
    code="ERR_DUPLICATE_CHAPTER_NUMBER",
    message=f"Duplicate chapter number {number}",
    line=line_no,
    column=col,
    context=heading_text,
    suggestion="Chapters must be uniquely numbered."
)

# Check for errors
if errors.has_errors():
    print(f"Compilation failed with {len(errors.errors())} errors")
    for err in errors.errors():
        print(f"  {err.code}: {err.message} at line {err.line}")
```

---

### 0.2 Token Metadata (Line, Column, Raw Text)

**Problem:** No token-level metadata, can't track exact source positions.

**Solution:** Add Token class with full source position information.

**Implementation:**

```python
# runtime/tokens.py

from dataclasses import dataclass, field
from typing import Optional, Dict, Any


@dataclass
class Token:
    """Token with full source position metadata."""
    type: str           # "heading", "paragraph", "code", "blank", "code_fence"
    text: str           # Processed text (stripped, normalized)
    raw: str            # Raw text from source (preserves whitespace)
    line: int           # 1-based line number
    column: int         # 1-based column number (0 = start of line)
    meta: Dict[str, Any] = field(default_factory=dict)  # Additional metadata
    
    def __post_init__(self):
        """Validate token data."""
        if self.line < 1:
            raise ValueError(f"Line number must be >= 1, got {self.line}")
        if self.column < 0:
            raise ValueError(f"Column number must be >= 0, got {self.column}")

    def to_dict(self) -> Dict[str, Any]:
        """Convert token to dictionary."""
        return {
            "type": self.type,
            "text": self.text,
            "raw": self.raw,
            "line": self.line,
            "column": self.column,
            "meta": self.meta
        }

    def position_str(self) -> str:
        """Get human-readable position string."""
        return f"line {self.line}, column {self.column}"
```

**Usage Example:**

```python
from runtime.tokens import Token

# Create token during parsing
token = Token(
    type="heading",
    text="Chapter 1 — Introduction",
    raw="## Chapter 1 — Introduction\n",
    line=31,
    column=1,
    meta={"level": 2}
)

# Attach to AST node
node = ASTNode(
    type="heading",
    text=token.text,
    line_no=token.line,
    token=token
)
```

---

### 0.3 Centralized Symbol Table

**Problem:** No centralized symbol tracking, duplicate detection, or reference resolution.

**Solution:** Implement symbol table for all symbols (terms, concepts, sections, patterns, chapters).

**Implementation:**

```python
# runtime/symbol_table.py

from typing import Dict, List, Optional, Any, Set
from dataclasses import dataclass, field


@dataclass
class SymbolEntry:
    """Entry in symbol table."""
    name: str
    id: str
    type: str  # "term", "concept", "section", "pattern", "chapter"
    line_no: int
    meta: Dict[str, Any] = field(default_factory=dict)


class SymbolTable:
    """Centralized symbol table for all document symbols."""

    def __init__(self):
        # Primary symbol maps: name → id
        self.terms: Dict[str, str] = {}           # term_name → id
        self.concepts: Dict[str, str] = {}        # concept_title → id
        self.sections: Dict[str, str] = {}        # section_title → id
        self.patterns: Dict[str, str] = {}        # pattern_signature → id
        self.chapters: Dict[int, str] = {}        # chapter_number → chapter_id
        
        # Reverse index: id → SymbolEntry
        self.by_id: Dict[str, SymbolEntry] = {}
        
        # Diagnostics helpers
        self.duplicate_chapters: List[tuple] = []  # (number, id) pairs
        self.unresolved_references: List[Dict[str, Any]] = []
        
        # Alias tracking (for term normalization)
        self.aliases: Dict[str, str] = {}  # alias → canonical_name

    # --- Term Handling ---
    def add_term(self, name: str, id: str, line_no: int = 0, **meta) -> bool:
        """
        Add a term to the symbol table.
        
        Returns:
            True if added, False if duplicate
        """
        key = name.lower().strip()
        if key in self.terms:
            return False  # Duplicate
        
        self.terms[key] = id
        self.by_id[id] = SymbolEntry(
            name=name,
            id=id,
            type="term",
            line_no=line_no,
            meta=meta
        )
        return True

    def get_term(self, name: str) -> Optional[str]:
        """Get term ID by name (case-insensitive)."""
        return self.terms.get(name.lower().strip())

    def add_term_alias(self, alias: str, canonical: str):
        """Add an alias for a term."""
        self.aliases[alias.lower()] = canonical.lower()

    # --- Concept Handling ---
    def add_concept(self, title: str, id: str, line_no: int = 0, **meta) -> bool:
        """Add a concept to the symbol table."""
        key = title.lower().strip()
        if key in self.concepts:
            return False
        
        self.concepts[key] = id
        self.by_id[id] = SymbolEntry(
            name=title,
            id=id,
            type="concept",
            line_no=line_no,
            meta=meta
        )
        return True

    def get_concept(self, title: str) -> Optional[str]:
        """Get concept ID by title (case-insensitive)."""
        return self.concepts.get(title.lower().strip())

    # --- Section Handling ---
    def add_section(self, title: str, id: str, line_no: int = 0, **meta) -> bool:
        """Add a section to the symbol table."""
        key = title.lower().strip()
        self.sections[key] = id
        self.by_id[id] = SymbolEntry(
            name=title,
            id=id,
            type="section",
            line_no=line_no,
            meta=meta
        )
        return True

    def get_section(self, title: str) -> Optional[str]:
        """Get section ID by title (case-insensitive)."""
        return self.sections.get(title.lower().strip())

    # --- Pattern Handling ---
    def add_pattern(self, signature: str, id: str, line_no: int = 0, **meta) -> bool:
        """Add a code pattern to the symbol table."""
        if signature in self.patterns:
            return False
        
        self.patterns[signature] = id
        self.by_id[id] = SymbolEntry(
            name=signature,
            id=id,
            type="pattern",
            line_no=line_no,
            meta=meta
        )
        return True

    def get_pattern(self, signature: str) -> Optional[str]:
        """Get pattern ID by signature."""
        return self.patterns.get(signature)

    # --- Chapter Handling ---
    def add_chapter(self, number: int, id: str, line_no: int = 0, **meta) -> bool:
        """
        Add a chapter to the symbol table.
        
        Returns:
            True if added, False if duplicate
        """
        if number in self.chapters:
            # Track duplicate
            existing_id = self.chapters[number]
            self.duplicate_chapters.append((number, existing_id, id))
            return False
        
        self.chapters[number] = id
        self.by_id[id] = SymbolEntry(
            name=f"Chapter {number}",
            id=id,
            type="chapter",
            line_no=line_no,
            meta=meta
        )
        return True

    def get_chapter(self, number: int) -> Optional[str]:
        """Get chapter ID by number."""
        return self.chapters.get(number)

    # --- Reference Resolution ---
    def resolve_reference(self, ref_text: str, ref_type: str = "auto") -> Optional[str]:
        """
        Resolve a reference text to a symbol ID.
        
        Args:
            ref_text: Reference text (e.g., "Chapter 3", "term_name")
            ref_type: Type hint ("chapter", "term", "concept", "auto")
        
        Returns:
            Symbol ID or None if not found
        """
        ref_lower = ref_text.lower().strip()
        
        # Try chapter reference
        if ref_type in ("auto", "chapter"):
            import re
            ch_match = re.search(r"chapter\s+(\d+)", ref_lower)
            if ch_match:
                ch_num = int(ch_match.group(1))
                return self.get_chapter(ch_num)
        
        # Try term reference
        if ref_type in ("auto", "term"):
            # Check aliases first
            canonical = self.aliases.get(ref_lower)
            if canonical:
                return self.get_term(canonical)
            return self.get_term(ref_text)
        
        # Try concept reference
        if ref_type in ("auto", "concept"):
            return self.get_concept(ref_text)
        
        # Try section reference
        if ref_type in ("auto", "section"):
            return self.get_section(ref_text)
        
        return None

    def track_unresolved(self, ref_text: str, ref_type: str, line_no: int, context: str = ""):
        """Track an unresolved reference for diagnostics."""
        self.unresolved_references.append({
            "ref_text": ref_text,
            "ref_type": ref_type,
            "line_no": line_no,
            "context": context
        })

    # --- Statistics ---
    def stats(self) -> Dict[str, int]:
        """Get symbol table statistics."""
        return {
            "terms": len(self.terms),
            "concepts": len(self.concepts),
            "sections": len(self.sections),
            "patterns": len(self.patterns),
            "chapters": len(self.chapters),
            "aliases": len(self.aliases),
            "duplicate_chapters": len(self.duplicate_chapters),
            "unresolved_references": len(self.unresolved_references),
            "total_symbols": len(self.by_id)
        }

    def to_dict(self) -> Dict[str, Any]:
        """Convert symbol table to dictionary for serialization."""
        return {
            "terms": self.terms,
            "concepts": self.concepts,
            "sections": self.sections,
            "patterns": self.patterns,
            "chapters": self.chapters,
            "aliases": self.aliases,
            "duplicate_chapters": self.duplicate_chapters,
            "unresolved_references": self.unresolved_references,
            "stats": self.stats()
        }
```

**Usage Example:**

```python
symbols = SymbolTable()

# Add symbols during parsing
symbols.add_chapter(1, "CH-01", line_no=31, title="Introduction")
symbols.add_term("OPA", "TERM-opa-123", line_no=50)
symbols.add_term_alias("Open Policy Agent", "OPA")

# Resolve references
chapter_id = symbols.resolve_reference("Chapter 1", "chapter")
term_id = symbols.resolve_reference("OPA", "term")
```

---

### 0.4 AST Node Updates (Token + Error Support)

**Problem:** AST nodes don't have token metadata or error tracking.

**Solution:** Update ASTNode to include token reference and error metadata.

**Implementation:**

```python
# modules/ast_nodes.py (UPDATED)

from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any
from runtime.tokens import Token


@dataclass
class ASTNode:
    """AST node with token and hierarchy support."""
    type: str
    text: str = ""
    line_no: int = 0
    level: int = 0
    lang: str = ""
    code: str = ""
    meta: Dict[str, Any] = field(default_factory=dict)
    
    # Token reference (NEW)
    token: Optional[Token] = None
    
    # Hierarchy (NEW)
    parent: Optional["ASTNode"] = None
    children: List["ASTNode"] = field(default_factory=list)
    
    # Error tracking (NEW)
    errors: List[str] = field(default_factory=list)  # Error codes associated with this node
    
    def add_child(self, node: "ASTNode"):
        """Add child node and set parent reference."""
        node.parent = self
        self.children.append(node)
    
    def get_ancestors(self) -> List["ASTNode"]:
        """Get all ancestor nodes (parent, grandparent, etc.)."""
        ancestors = []
        current = self.parent
        while current:
            ancestors.append(current)
            current = current.parent
        return ancestors
    
    def find_chapter(self) -> Optional["ASTNode"]:
        """Find the chapter node this node belongs to."""
        for ancestor in self.get_ancestors():
            if ancestor.type == "chapter":
                return ancestor
        return None
    
    def find_section(self) -> Optional["ASTNode"]:
        """Find the section node this node belongs to."""
        for ancestor in self.get_ancestors():
            if ancestor.type == "section":
                return ancestor
        return None
    
    def get_position(self) -> str:
        """Get human-readable position string."""
        if self.token:
            return self.token.position_str()
        return f"line {self.line_no}"


@dataclass
class ASTDocument:
    """Complete AST document structure."""
    nodes: List[ASTNode] = field(default_factory=list)
    parts: List[ASTNode] = field(default_factory=list)
    chapters: List[ASTNode] = field(default_factory=list)
    
    def get_all_chapters(self) -> List[ASTNode]:
        """Get all chapter nodes recursively."""
        chapters = []
        def collect_chapters(node: ASTNode):
            if node.type == "chapter":
                chapters.append(node)
            for child in node.children:
                collect_chapters(child)
        for part in self.parts:
            collect_chapters(part)
        return chapters
```

---

### 0.5 Parser Integration (Error Detection + Token Creation)

**Problem:** Parser has no validation hooks, no error detection, no token creation.

**Solution:** Integrate ErrorBus, SymbolTable, and Token creation into parser.

**Implementation:**

```python
# modules/parser_markdown.py (UPDATED)

import re
from typing import List
from modules.ast_nodes import ASTNode, ASTDocument
from runtime.tokens import Token
from runtime.error_bus import ErrorBus
from runtime.symbol_table import SymbolTable
from .utils.patterns import (
    HEADING_RE, CHAPTER_HEADING_RE, PART_HEADING_RE, CODE_FENCE_RE
)


def parse_markdown_to_ast(
    text: str,
    errors: Optional[ErrorBus] = None,
    symbols: Optional[SymbolTable] = None
) -> ASTDocument:
    """
    Streaming parser that builds hierarchical AST with error detection.
    
    Args:
        text: Markdown text to parse
        errors: ErrorBus instance for diagnostics (optional)
        symbols: SymbolTable instance for symbol tracking (optional)
    
    Returns:
        ASTDocument with hierarchical structure
    """
    # Create default instances if not provided (backward compatibility)
    if errors is None:
        errors = ErrorBus()
    if symbols is None:
        symbols = SymbolTable()
    
    lines = text.splitlines()
    doc = ASTDocument()
    
    # Stack to track open containers (part → chapter → section)
    node_stack: List[ASTNode] = []
    
    in_code = False
    code_lang = ""
    code_lines: List[str] = []
    para_lines: List[str] = []
    line_no = 0
    code_start_line = 0
    
    def make_token(type: str, raw: str, text: str, line: int, col: int, **meta) -> Token:
        """Helper to create tokens."""
        return Token(
            type=type,
            raw=raw,
            text=text,
            line=line,
            column=col,
            meta=meta
        )
    
    def flush_code():
        """Flush accumulated code block."""
        nonlocal code_lines, in_code, code_start_line
        if code_lines:
            code_text = "\n".join(code_lines)
            code_node = ASTNode(
                type="code",
                text=code_text,
                code=code_text,
                lang=code_lang,
                line_no=code_start_line,
                token=make_token(
                    "code",
                    code_text,
                    code_text,
                    code_start_line,
                    1,
                    lang=code_lang or None
                ),
                meta={"lang": code_lang or None}
            )
            if node_stack:
                node_stack[-1].add_child(code_node)
            doc.nodes.append(code_node)
        code_lines = []
        in_code = False
    
    def flush_paragraph():
        """Flush accumulated paragraph."""
        nonlocal para_lines
        if para_lines:
            content = "\n".join(para_lines).strip()
            if content:
                para_node = ASTNode(
                    type="paragraph",
                    text=content,
                    line_no=line_no,
                    token=make_token("paragraph", "\n".join(para_lines), content, line_no, 1)
                )
                if node_stack:
                    node_stack[-1].add_child(para_node)
                doc.nodes.append(para_node)
            para_lines = []
    
    def close_nodes_above_level(target_level: int):
        """Close all nodes at or above target level."""
        while node_stack:
            top = node_stack[-1]
            if top.type == "part" or (top.type == "chapter" and target_level <= 2):
                break
            if top.type == "section" and top.level >= target_level:
                node_stack.pop()
            else:
                break
    
    for raw_line in lines:
        line_no += 1
        line = raw_line.rstrip("\n")
        col = len(raw_line) - len(raw_line.lstrip(" "))
        
        # Code fence handling
        m_code = CODE_FENCE_RE.match(line)
        if m_code:
            if not in_code:
                # Starting code block
                flush_paragraph()
                in_code = True
                code_lang = m_code.group(1).strip().lower()
                code_lines = []
                code_start_line = line_no
            else:
                # Ending code block
                flush_code()
            continue
        
        if in_code:
            code_lines.append(raw_line)
            continue
        
        # Heading detection
        m_head = HEADING_RE.match(line)
        if m_head:
            flush_paragraph()
            level = len(m_head.group(1))
            text_h = m_head.group(2).strip()
            token = make_token("heading", raw_line, text_h, line_no, col, level=level)
            
            # PART detection
            m_part = PART_HEADING_RE.match(text_h)
            if m_part:
                close_nodes_above_level(1)
                part_num = m_part.group(1)
                part_title = m_part.group(2).strip()
                part_node = ASTNode(
                    type="part",
                    text=text_h,
                    line_no=line_no,
                    level=1,
                    token=token,
                    meta={"part_number": part_num, "title": part_title}
                )
                doc.parts.append(part_node)
                doc.nodes.append(part_node)
                node_stack = [part_node]
                continue
            
            # CHAPTER detection
            m_chapter = CHAPTER_HEADING_RE.match(text_h)
            if m_chapter:
                close_nodes_above_level(2)
                num = int(m_chapter.group(1))
                title = m_chapter.group(2).strip()
                ch_code = f"CH-{num:02d}"
                
                # Check for duplicate chapter numbers
                if not symbols.add_chapter(num, ch_code, line_no=line_no, title=title):
                    errors.error(
                        code="ERR_DUPLICATE_CHAPTER_NUMBER",
                        message=f"Duplicate chapter number {num}",
                        line=line_no,
                        column=col,
                        context=text_h,
                        suggestion="Chapters must be uniquely numbered."
                    )
                
                chapter_node = ASTNode(
                    type="chapter",
                    text=text_h,
                    line_no=line_no,
                    level=2,
                    token=token,
                    meta={"number": num, "title": title, "code": ch_code}
                )
                
                # Attach to current part or document
                if node_stack and node_stack[0].type == "part":
                    node_stack[0].add_child(chapter_node)
                else:
                    doc.parts.append(chapter_node)
                doc.nodes.append(chapter_node)
                doc.chapters.append(chapter_node)
                
                node_stack = [n for n in [node_stack[0] if node_stack else None, chapter_node] if n]
                continue
            
            # SECTION detection (level 3-6)
            if level >= 3:
                close_nodes_above_level(level)
                
                # Validate section is under a chapter
                has_chapter = any(n.type == "chapter" for n in node_stack)
                if not has_chapter:
                    errors.warning(
                        code="WARN_SECTION_OUTSIDE_CHAPTER",
                        message=f"Section '{text_h}' appears before any chapter",
                        line=line_no,
                        column=col,
                        context=raw_line,
                        suggestion="Define this section under a chapter."
                    )
                
                section_node = ASTNode(
                    type="section",
                    text=text_h,
                    line_no=line_no,
                    level=level,
                    token=token
                )
                
                # Attach to current chapter or section
                if node_stack:
                    node_stack[-1].add_child(section_node)
                doc.nodes.append(section_node)
                
                # Add to symbol table
                section_id = f"SEC-{line_no}-{level}"
                symbols.add_section(text_h, section_id, line_no=line_no)
                
                node_stack.append(section_node)
                continue
        
        # Blank line = paragraph separator
        if not line.strip():
            flush_paragraph()
            continue
        
        # Part of paragraph
        para_lines.append(raw_line)
    
    # EOF flush
    flush_paragraph()
    if in_code:
        errors.error(
            code="ERR_UNCLOSED_CODE_FENCE",
            message="Code fence opened but not closed",
            line=line_no,
            column=1,
            context="EOF",
            suggestion="Close all code fences with ```"
        )
        flush_code()  # Flush anyway
    
    return doc
```

---

### 0.6 Compiler Pipeline Integration

**Problem:** Compiler doesn't use ErrorBus or SymbolTable, no diagnostics output.

**Solution:** Integrate runtime components into compiler pipeline.

**Implementation:**

```python
# compiler.py (UPDATED)

#!/usr/bin/env python3
"""
Unified SSM Compiler (Version 3)
--------------------------------
One compiler from raw Markdown → full SSM v3 enriched format.
"""

from __future__ import annotations
import sys
import json
from pathlib import Path

# Add modules to path for local imports
modules_path = Path(__file__).parent / "modules"
if str(modules_path) not in sys.path:
    sys.path.insert(0, str(modules_path.parent))

from runtime.error_bus import ErrorBus
from runtime.symbol_table import SymbolTable
from modules.parser_markdown import parse_markdown_to_ast
from modules.extractor_terms import extract_terms_from_ast
from modules.extractor_code import extract_code_entries
from modules.extractor_relations import extract_relations_from_ast
from modules.extractor_diagrams import extract_diagrams_from_ast
from modules.parser_ssm import ast_to_ssm_blocks, build_block_index
# ... (all enrichment imports) ...
from modules.enrichment_v3.ordering import canonical_sort_blocks
from modules.utils.ids import ensure_ids_unique
from modules.utils.text import write_ssm


def compile_markdown_to_ssm_v3(
    md_text: str,
    errors: Optional[ErrorBus] = None,
    symbols: Optional[SymbolTable] = None
) -> tuple[str, Dict[str, Any]]:
    """
    Compile markdown to SSM v3 format.
    
    Args:
        md_text: Markdown text to compile
        errors: ErrorBus instance (optional, creates new if None)
        symbols: SymbolTable instance (optional, creates new if None)
    
    Returns:
        Tuple of (ssm_output, diagnostics_dict)
    """
    # Create runtime components if not provided
    if errors is None:
        errors = ErrorBus()
    if symbols is None:
        symbols = SymbolTable()
    
    # Step 1: Parse Markdown → AST
    ast = parse_markdown_to_ast(md_text, errors=errors, symbols=symbols)
    
    # Step 2: Extract terms, code, relations, diagrams
    terms = extract_terms_from_ast(ast)
    codes = extract_code_entries(ast)
    rels = extract_relations_from_ast(ast)
    diags = extract_diagrams_from_ast(ast)
    
    # Step 3: Convert AST → SSM v2 blocks
    blocks = ast_to_ssm_blocks(ast, terms, codes, rels, diags, errors=errors, symbols=symbols)
    
    # Build index for enrichments
    idx = build_block_index(blocks)
    
    # Step 4: Apply all 20 v3 enrichment passes
    # ... (all enrichment calls) ...
    
    # Step 5: Canonical sort and validation
    blocks = canonical_sort_blocks(blocks)
    ensure_ids_unique(blocks, errors=errors)
    
    # Step 6: Emit final SSM v3 as markdown
    ssm_output = write_ssm(blocks)
    
    # Build diagnostics
    diagnostics = {
        "errors": errors.to_dict(),
        "warnings": [e.__dict__ for e in errors.warnings()],
        "symbols": symbols.to_dict(),
        "summary": {
            "total_blocks": len(blocks),
            "error_count": len(errors.errors()),
            "warning_count": len(errors.warnings()),
            "symbol_stats": symbols.stats()
        }
    }
    
    return ssm_output, diagnostics


def compile_document(input_path: str, output_path: str, diagnostics_path: Optional[str] = None):
    """
    Compile a markdown document to SSM v3.
    
    Args:
        input_path: Path to input markdown file
        output_path: Path to output SSM file
        diagnostics_path: Optional path for diagnostics JSON (default: output_path + ".diagnostics.json")
    """
    errors = ErrorBus()
    symbols = SymbolTable()
    
    # Read input
    with open(input_path, "r", encoding="utf-8") as f:
        md_text = f.read()
    
    # Compile
    ssm_output, diagnostics = compile_markdown_to_ssm_v3(md_text, errors=errors, symbols=symbols)
    
    # Write SSM output
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(ssm_output)
    
    # Write diagnostics
    if diagnostics_path is None:
        diagnostics_path = output_path + ".diagnostics.json"
    
    with open(diagnostics_path, "w", encoding="utf-8") as f:
        json.dump(diagnostics, f, indent=2, default=str)
    
    # Print summary
    summary = diagnostics["summary"]
    print(f"Compilation complete:")
    print(f"  Blocks: {summary['total_blocks']}")
    print(f"  Errors: {summary['error_count']}")
    print(f"  Warnings: {summary['warning_count']}")
    
    if errors.has_errors():
        print("\nErrors found:")
        for err in errors.errors():
            print(f"  [{err.code}] Line {err.line}:{err.column} - {err.message}")
        return 1
    
    return 0


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python compiler.py input.md output.ssm.md [diagnostics.json]")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    diagnostics_path = sys.argv[3] if len(sys.argv) > 3 else None
    
    exit_code = compile_document(input_path, output_path, diagnostics_path)
    sys.exit(exit_code)
```

---

### 0.7 Backward Compatibility

**Problem:** Need to maintain backward compatibility with existing code.

**Solution:** Make ErrorBus and SymbolTable optional parameters with defaults.

**Backward-Compatible API:**

```python
# Old code still works:
ast = parse_markdown_to_ast(text)  # Creates default ErrorBus and SymbolTable internally

# New code can use explicit instances:
errors = ErrorBus()
symbols = SymbolTable()
ast = parse_markdown_to_ast(text, errors=errors, symbols=symbols)
```

**Migration Guide:**

1. **Phase 1:** Add runtime components as optional parameters (backward compatible)
2. **Phase 2:** Update all call sites to use explicit ErrorBus/SymbolTable
3. **Phase 3:** Remove default creation, require explicit instances

---

### 0.8 Integration Checklist

- [ ] Create `runtime/` directory
- [ ] Implement `runtime/error_bus.py`
- [ ] Implement `runtime/tokens.py`
- [ ] Implement `runtime/symbol_table.py`
- [ ] Update `modules/ast_nodes.py` to include Token support
- [ ] Update `modules/parser_markdown.py` to use ErrorBus and SymbolTable
- [ ] Update `modules/parser_ssm.py` to accept errors and symbols parameters
- [ ] Update `compiler.py` to integrate runtime components
- [ ] Add diagnostics JSON output
- [ ] Update tests to use new runtime components
- [ ] Verify backward compatibility

---

## 🎯 Phase 1: Core Infrastructure (AST & Hierarchy)

### 1.1 True Hierarchical AST Structure

**Problem:** Current AST is flat (list of nodes), not hierarchical. No parent-child relationships.

**Solution:** Implement tree-based AST with explicit hierarchy.

**Code Structure:**

```python
# modules/ast_nodes.py

from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any

@dataclass
class ASTNode:
    """Base AST node with hierarchy support"""
    type: str  # "part", "chapter", "section", "paragraph", "code", "diagram", "table"
    text: str = ""
    line_no: int = 0
    level: int = 0  # Heading level (1-6)
    meta: Dict[str, Any] = field(default_factory=dict)
    
    # Hierarchy
    parent: Optional['ASTNode'] = None
    children: List['ASTNode'] = field(default_factory=list)
    
    def add_child(self, node: 'ASTNode'):
        """Add child node and set parent reference"""
        node.parent = self
        self.children.append(node)
    
    def get_ancestors(self) -> List['ASTNode']:
        """Get all ancestor nodes (parent, grandparent, etc.)"""
        ancestors = []
        current = self.parent
        while current:
            ancestors.append(current)
            current = current.parent
        return ancestors
    
    def find_chapter(self) -> Optional['ASTNode']:
        """Find the chapter node this node belongs to"""
        for ancestor in self.get_ancestors():
            if ancestor.type == "chapter":
                return ancestor
        return None
    
    def find_section(self) -> Optional['ASTNode']:
        """Find the section node this node belongs to"""
        for ancestor in self.get_ancestors():
            if ancestor.type == "section":
                return ancestor
        return None

@dataclass
class ASTDocument:
    """Root document with hierarchical structure"""
    parts: List[ASTNode] = field(default_factory=list)  # Top-level parts
    nodes: List[ASTNode] = field(default_factory=list)  # Flat list for backward compat
    
    def get_all_chapters(self) -> List[ASTNode]:
        """Get all chapter nodes recursively"""
        chapters = []
        def collect_chapters(node: ASTNode):
            if node.type == "chapter":
                chapters.append(node)
            for child in node.children:
                collect_chapters(child)
        for part in self.parts:
            collect_chapters(part)
        return chapters
    
    def get_chapter_sections(self, chapter: ASTNode) -> List[ASTNode]:
        """Get all sections within a chapter"""
        sections = []
        def collect_sections(node: ASTNode):
            if node.type == "section":
                sections.append(node)
            for child in node.children:
                collect_sections(child)
        collect_sections(chapter)
        return sections
```

**Parser Changes:**

```python
# modules/parser_markdown.py

def parse_markdown_to_ast(text: str) -> ASTDocument:
    """
    Streaming parser that builds hierarchical AST.
    
    Maintains a stack of open nodes (parts, chapters, sections).
    """
    lines = text.splitlines()
    doc = ASTDocument()
    
    # Stack to track open containers (part → chapter → section)
    node_stack: List[ASTNode] = []
    
    in_code = False
    code_lang = ""
    code_lines: List[str] = []
    para_lines: List[str] = []
    line_no = 0
    
    def flush_paragraph():
        nonlocal para_lines
        if para_lines:
            content = "\n".join(para_lines).strip()
            if content:
                para_node = ASTNode(
                    type="paragraph",
                    text=content,
                    line_no=line_no
                )
                # Attach to current container
                if node_stack:
                    node_stack[-1].add_child(para_node)
                doc.nodes.append(para_node)
            para_lines = []
    
    def close_nodes_above_level(target_level: int):
        """Close all nodes at or above target level"""
        while node_stack:
            top = node_stack[-1]
            if top.type == "part" or (top.type == "chapter" and target_level <= 2):
                break
            if top.type == "section" and top.level >= target_level:
                node_stack.pop()
            else:
                break
    
    for raw_line in lines:
        line_no += 1
        line = raw_line.rstrip("\n")
        
        # Code fence handling (existing logic)
        m_code = CODE_FENCE_RE.match(line)
        if m_code:
            # ... existing code fence logic ...
            continue
        
        if in_code:
            code_lines.append(raw_line)
            continue
        
        # Heading detection
        m_head = HEADING_RE.match(line)
        if m_head:
            flush_paragraph()
            level = len(m_head.group(1))
            text_h = m_head.group(2).strip()
            
            # Check for part
            m_part = PART_HEADING_RE.match(text_h)
            if m_part:
                close_nodes_above_level(1)
                part_node = ASTNode(
                    type="part",
                    text=text_h,
                    line_no=line_no,
                    level=1,
                    meta={"part_number": m_part.group(1), "title": m_part.group(2)}
                )
                doc.parts.append(part_node)
                doc.nodes.append(part_node)
                node_stack = [part_node]  # Start new stack
                continue
            
            # Check for chapter
            m_chapter = CHAPTER_HEADING_RE.match(text_h)
            if m_chapter:
                close_nodes_above_level(2)
                num = int(m_chapter.group(1))
                title = m_chapter.group(2).strip()
                chapter_node = ASTNode(
                    type="chapter",
                    text=text_h,
                    line_no=line_no,
                    level=2,
                    meta={"number": num, "title": title, "code": f"CH-{num:02d}"}
                )
                # Attach to current part or document
                if node_stack and node_stack[0].type == "part":
                    node_stack[0].add_child(chapter_node)
                else:
                    doc.parts.append(chapter_node)  # Orphan chapter
                doc.nodes.append(chapter_node)
                node_stack = [node_stack[0] if node_stack else None, chapter_node]
                node_stack = [n for n in node_stack if n]  # Remove None
                continue
            
            # Section (level 3-6)
            if level >= 3:
                close_nodes_above_level(level)
                section_node = ASTNode(
                    type="section",
                    text=text_h,
                    line_no=line_no,
                    level=level
                )
                # Attach to current chapter or section
                if node_stack:
                    node_stack[-1].add_child(section_node)
                doc.nodes.append(section_node)
                node_stack.append(section_node)
                continue
        
        # Blank line
        if not line.strip():
            flush_paragraph()
            continue
        
        # Paragraph content
        para_lines.append(raw_line)
    
    flush_paragraph()
    return doc
```

**Diagram:**

```
ASTDocument
├── Part I (ASTNode: type="part")
│   ├── Chapter 1 (ASTNode: type="chapter")
│   │   ├── Section 1.1 (ASTNode: type="section")
│   │   │   ├── Paragraph (ASTNode: type="paragraph")
│   │   │   ├── Code Block (ASTNode: type="code")
│   │   │   └── Paragraph (ASTNode: type="paragraph")
│   │   └── Section 1.2 (ASTNode: type="section")
│   └── Chapter 2 (ASTNode: type="chapter")
└── Part II (ASTNode: type="part")
    └── Chapter 3 (ASTNode: type="chapter")
```

---

### 1.2 Part-Level Metadata

**Problem:** PART I, PART II headings are parsed but not emitted as SSM blocks.

**Solution:** Create `::: part-meta` blocks.

**Implementation:**

```python
# modules/parser_ssm.py

def ast_to_ssm_blocks(...) -> List[SSMBlock]:
    blocks = []
    
    # Part-meta blocks (NEW)
    for n in doc.nodes:
        if n.type == "part":
            part_num = n.meta.get("part_number", "")
            title = n.meta.get("title", n.text)
            bid = sha1_id("PARTMETA", f"{part_num}:{title}")
            blk = SSMBlock(
                block_type="part-meta",
                meta={
                    "id": bid,
                    "part_number": part_num,
                    "title": title,
                    "chapters": [ch.meta.get("code") for ch in n.children if ch.type == "chapter"]
                },
                body="",
                index=idx,
                id=bid,
                chapter=None,  # Parts span multiple chapters
            )
            blocks.append(blk)
            idx += 1
    
    # ... rest of existing code ...
```

**SSM Output Format:**

```markdown
::: part-meta
id: PARTMETA-abc123
part_number: I
title: FOUNDATIONS AND INTRODUCTION
chapters: [CH-01, CH-02]
:::
```

---

### 1.3 Section-Level Metadata

**Problem:** Sections exist in AST but no `::: section-meta` blocks are created.

**Solution:** Emit section-meta blocks with hierarchy information.

**Implementation:**

```python
# modules/parser_ssm.py

def ast_to_ssm_blocks(...) -> List[SSMBlock]:
    # ... existing code ...
    
    # Section-meta blocks (NEW)
    for n in doc.nodes:
        if n.type == "section":
            chapter = n.find_chapter()
            parent_section = n.find_section()  # Parent section if nested
            
            bid = sha1_id("SECMETA", f"{n.line_no}:{n.text[:100]}")
            blk = SSMBlock(
                block_type="section-meta",
                meta={
                    "id": bid,
                    "title": n.text,
                    "level": n.level,
                    "chapter": chapter.meta.get("code") if chapter else None,
                    "parent_section": parent_section.id if parent_section else None,
                    "line_no": n.line_no,
                },
                body="",
                index=idx,
                id=bid,
                chapter=chapter.meta.get("code") if chapter else None,
            )
            blocks.append(blk)
            idx += 1
```

**SSM Output Format:**

```markdown
::: section-meta
id: SECMETA-xyz789
title: 1.1 Why Policy as Code?
level: 3
chapter: CH-01
parent_section: null
line_no: 33
:::
```

---

## 🎯 Phase 2: Advanced Extraction & Classification

### 2.1 Cross-Chapter Relation Extraction

**Problem:** Zero `::: relation` blocks despite "See Chapter X" references.

**Solution:** Extract explicit and implicit cross-references.

**Implementation:**

```python
# modules/extractor_relations.py

from typing import List, Set, Tuple
import re
from .ast_nodes import ASTDocument, ASTNode
from .utils.patterns import SEE_CHAPTER_RE

@dataclass
class RelationEntry:
    from_ref: str  # Source chapter/section code
    to_ref: str    # Target chapter/section code
    relation_type: str  # "prerequisite", "reference", "extends", "depends_on"
    context: str   # Text where relation was found
    line_no: int
    confidence: float = 1.0

def extract_relations_from_ast(doc: ASTDocument) -> List[RelationEntry]:
    """
    Extract cross-chapter and cross-section relations.
    
    Detects:
    - "See Chapter X" explicit references
    - "As discussed in Chapter X" implicit references
    - Prerequisite chains
    - Dependency patterns
    """
    relations: List[RelationEntry] = []
    
    # Pattern: "See Chapter X" or "See Section X.Y"
    see_chapter_pattern = re.compile(
        r"(?:see|refer to|discussed in|covered in)\s+(?:chapter|ch\.?|section)\s+(\d+(?:\.\d+)?)",
        re.IGNORECASE
    )
    
    # Pattern: "Requires Chapter X" or "Prerequisite: Chapter X"
    prerequisite_pattern = re.compile(
        r"(?:requires?|prerequisite|depends? on|builds? on)\s+(?:chapter|ch\.?)\s+(\d+)",
        re.IGNORECASE
    )
    
    def find_node_code(node: ASTNode) -> str:
        """Get code for a node (chapter or section)"""
        if node.type == "chapter":
            return node.meta.get("code", f"CH-{node.meta.get('number', 0):02d}")
        elif node.type == "section":
            chapter = node.find_chapter()
            if chapter:
                ch_code = chapter.meta.get("code", "")
                # Generate section code like "CH-01-SEC-1.1"
                return f"{ch_code}-SEC-{node.text[:20]}"
        return ""
    
    # Scan all nodes for relation patterns
    for node in doc.nodes:
        if node.type in ["paragraph", "section", "chapter"]:
            text = node.text
            source_code = find_node_code(node) or (node.find_chapter() and node.find_chapter().meta.get("code"))
            
            # Find "See Chapter X" references
            for match in see_chapter_pattern.finditer(text):
                target_ch = int(match.group(1).split('.')[0])
                target_code = f"CH-{target_ch:02d}"
                
                relations.append(RelationEntry(
                    from_ref=source_code or "UNKNOWN",
                    to_ref=target_code,
                    relation_type="reference",
                    context=text[match.start()-50:match.end()+50],
                    line_no=node.line_no,
                    confidence=0.9
                ))
            
            # Find prerequisite patterns
            for match in prerequisite_pattern.finditer(text):
                target_ch = int(match.group(1))
                target_code = f"CH-{target_ch:02d}"
                
                relations.append(RelationEntry(
                    from_ref=source_code or "UNKNOWN",
                    to_ref=target_code,
                    relation_type="prerequisite",
                    context=text[match.start()-50:match.end()+50],
                    line_no=node.line_no,
                    confidence=0.85
                ))
    
    # Deduplicate relations
    seen = set()
    unique_relations = []
    for rel in relations:
        key = (rel.from_ref, rel.to_ref, rel.relation_type)
        if key not in seen:
            seen.add(key)
            unique_relations.append(rel)
    
    return unique_relations
```

**SSM Output Format:**

```markdown
::: relation
id: REL-abc123
from: CH-05
to: CH-03
type: prerequisite
context: This chapter builds on the concepts introduced in Chapter 3
confidence: 0.85
line_no: 1020
:::
```

---

### 2.2 Anti-Pattern / Pitfall Detection

**Problem:** No `::: anti-pattern` blocks despite many pitfalls in source.

**Solution:** Classify paragraphs and code blocks as anti-patterns.

**Implementation:**

```python
# modules/extractor_anti_patterns.py

from typing import List
from dataclasses import dataclass
from .ast_nodes import ASTDocument, ASTNode
import re

@dataclass
class AntiPatternEntry:
    title: str
    description: str
    code_example: str = ""
    correct_example: str = ""
    category: str = ""  # "performance", "security", "logic", "syntax"
    line_no: int = 0

def extract_anti_patterns_from_ast(doc: ASTDocument) -> List[AntiPatternEntry]:
    """
    Extract anti-patterns and pitfalls from AST.
    
    Detects:
    - "❌ WRONG" or "❌ INCORRECT" markers
    - "Common Pitfall" headings
    - "Anti-pattern" mentions
    - Code blocks with "WRONG" or "DON'T" comments
    """
    anti_patterns = []
    
    # Patterns that indicate anti-patterns
    wrong_markers = [
        r"❌\s*(?:WRONG|INCORRECT|DON'T|NEVER)",
        r"❌\s*",
        r"Common\s+Pitfall",
        r"Anti-pattern",
        r"Common\s+Mistake",
        r"⚠️\s*Warning",
    ]
    
    wrong_pattern = re.compile("|".join(wrong_markers), re.IGNORECASE)
    
    # Category detection
    category_patterns = {
        "performance": re.compile(r"performance|slow|inefficient|O\(n²\)", re.IGNORECASE),
        "security": re.compile(r"security|vulnerable|unsafe|injection", re.IGNORECASE),
        "logic": re.compile(r"logic|wrong|incorrect|bug", re.IGNORECASE),
        "syntax": re.compile(r"syntax|error|invalid", re.IGNORECASE),
    }
    
    for node in doc.nodes:
        if node.type == "paragraph":
            text = node.text
            if wrong_pattern.search(text):
                # Extract title (first sentence or heading)
                title = text.split('.')[0][:100] if '.' in text else text[:100]
                
                # Determine category
                category = "logic"  # default
                for cat, pattern in category_patterns.items():
                    if pattern.search(text):
                        category = cat
                        break
                
                anti_patterns.append(AntiPatternEntry(
                    title=title,
                    description=text,
                    category=category,
                    line_no=node.line_no
                ))
        
        elif node.type == "code":
            code = node.code or ""
            # Check for "WRONG" or "DON'T" in comments
            if re.search(r"(?:#|//)\s*(?:❌|WRONG|DON'T|NEVER|INCORRECT)", code, re.IGNORECASE):
                # Look for corresponding "CORRECT" or "✅" block
                correct_code = ""
                # Search next few nodes for correct example
                node_idx = doc.nodes.index(node)
                for next_node in doc.nodes[node_idx+1:node_idx+5]:
                    if next_node.type == "code":
                        if re.search(r"(?:#|//)\s*(?:✅|CORRECT|RIGHT)", next_node.code or "", re.IGNORECASE):
                            correct_code = next_node.code or ""
                            break
                
                anti_patterns.append(AntiPatternEntry(
                    title=f"Anti-pattern in {node.lang or 'code'}",
                    description="",
                    code_example=code,
                    correct_example=correct_code,
                    category="logic",
                    line_no=node.line_no
                ))
    
    return anti_patterns
```

**SSM Output Format:**

```markdown
::: anti-pattern
id: ANTIPAT-xyz789
title: Unsafe variable usage in loops
category: logic
description: Using variables in loops without proper scoping can lead to...
code_example: |
  # ❌ WRONG
  items[_] != "foo"
correct_example: |
  # ✅ CORRECT
  not "foo" in items
chapter: CH-04
line_no: 1210
:::
```

---

### 2.3 Advanced Code Pattern Detection (AST-Level)

**Problem:** Code classification is basic (language only), no AST-level patterns.

**Solution:** Parse code into AST and extract semantic patterns.

**Implementation:**

```python
# modules/extractor_code_ast.py

from typing import List, Dict, Set
from dataclasses import dataclass
import ast  # Python AST
import re

@dataclass
class CodePattern:
    pattern_type: str  # "quantifier", "aggregation", "rule_head", "comprehension", etc.
    pattern_subtype: str  # More specific classification
    code_snippet: str
    line_no: int
    metadata: Dict = None

def analyze_rego_ast(code: str) -> List[CodePattern]:
    """
    Analyze Rego code for semantic patterns.
    
    Patterns detected:
    - Quantifiers: some, every
    - Aggregations: count, sum, max, min
    - Comprehensions: array/set/object comprehensions
    - Rule heads: allow, deny, violation
    - Negation: not, negation patterns
    """
    patterns = []
    
    # Quantifier detection
    if re.search(r'\bsome\s+\w+\s+in\b', code):
        patterns.append(CodePattern(
            pattern_type="quantifier",
            pattern_subtype="existential",
            code_snippet=code,
            line_no=0,
            metadata={"quantifier": "some"}
        ))
    
    if re.search(r'\bevery\s+\w+\s+in\b', code):
        patterns.append(CodePattern(
            pattern_type="quantifier",
            pattern_subtype="universal",
            code_snippet=code,
            line_no=0,
            metadata={"quantifier": "every"}
        ))
    
    # Aggregation detection
    agg_functions = ["count", "sum", "max", "min", "product", "all", "any"]
    for func in agg_functions:
        if re.search(rf'\b{func}\s*\(', code):
            patterns.append(CodePattern(
                pattern_type="aggregation",
                pattern_subtype=func,
                code_snippet=code,
                line_no=0,
                metadata={"function": func}
            ))
    
    # Comprehension detection
    if re.search(r'\[.*\s+for\s+.*\]', code):  # Array comprehension
        patterns.append(CodePattern(
            pattern_type="comprehension",
            pattern_subtype="array",
            code_snippet=code,
            line_no=0
        ))
    
    if re.search(r'\{.*\s+for\s+.*\}', code):  # Set/object comprehension
        patterns.append(CodePattern(
            pattern_type="comprehension",
            pattern_subtype="set",
            code_snippet=code,
            line_no=0
        ))
    
    # Rule head detection
    rule_heads = ["allow", "deny", "violation", "warn"]
    for head in rule_heads:
        if re.search(rf'^{head}\s*(?:\[|:=|if)', code, re.MULTILINE):
            patterns.append(CodePattern(
                pattern_type="rule_head",
                pattern_subtype=head,
                code_snippet=code,
                line_no=0,
                metadata={"rule_type": head}
            ))
    
    return patterns

def analyze_python_ast(code: str) -> List[CodePattern]:
    """Analyze Python code using AST parser"""
    patterns = []
    try:
        tree = ast.parse(code)
        for node in ast.walk(tree):
            if isinstance(node, ast.ListComp):
                patterns.append(CodePattern(
                    pattern_type="comprehension",
                    pattern_subtype="list",
                    code_snippet=code,
                    line_no=node.lineno
                ))
            elif isinstance(node, ast.DictComp):
                patterns.append(CodePattern(
                    pattern_type="comprehension",
                    pattern_subtype="dict",
                    code_snippet=code,
                    line_no=node.lineno
                ))
            elif isinstance(node, ast.SetComp):
                patterns.append(CodePattern(
                    pattern_type="comprehension",
                    pattern_subtype="set",
                    code_snippet=code,
                    line_no=node.lineno
                ))
    except SyntaxError:
        pass  # Invalid Python, skip AST analysis
    return patterns
```

**SSM Output Format:**

```markdown
::: code-pattern
id: CODEPAT-abc123
language: rego
pattern_type: quantifier
pattern_subtype: existential
code: |
  some item in items
  item == "admin"
tags: [quantifier, existential, iteration]
metadata:
  quantifier: some
  collection_type: array
chapter: CH-05
:::
```

---

### 2.4 Language Inference for Untagged Code

**Problem:** Code blocks without language tags are not classified.

**Solution:** Infer language from code patterns.

**Implementation:**

```python
# modules/classifier_language.py

import re
from typing import Optional

def infer_language(code: str) -> Optional[str]:
    """
    Infer programming language from code patterns.
    
    Returns: "rego", "python", "typescript", "sql", "json", "yaml", or None
    """
    code_lower = code.lower().strip()
    
    # Rego patterns
    rego_patterns = [
        r'^\s*package\s+\w+',
        r'^\s*(?:allow|deny|violation)\s*(?:\[|:=|if)',
        r'\binput\.\w+',
        r'\bdata\.\w+',
        r':=\s*',
        r'\bif\s+\{',
    ]
    if any(re.search(p, code, re.MULTILINE) for p in rego_patterns):
        return "rego"
    
    # Python patterns
    python_patterns = [
        r'^\s*(?:def|class|import|from)\s+\w+',
        r'\bprint\s*\(',
        r'\bif\s+__name__\s*==\s*["\']__main__',
        r':\s*$',  # Colon at end of line (common in Python)
    ]
    if any(re.search(p, code, re.MULTILINE) for p in python_patterns):
        return "python"
    
    # TypeScript/JavaScript patterns
    ts_patterns = [
        r'^\s*(?:export|import|const|let|var|function|class)\s+\w+',
        r':\s*(?:string|number|boolean|object)\s*[=;]',
        r'@\w+\(',  # Decorators
        r'interface\s+\w+',
    ]
    if any(re.search(p, code, re.MULTILINE) for p in ts_patterns):
        return "typescript"
    
    # SQL patterns
    sql_patterns = [
        r'^\s*(?:SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER)\s+',
        r'\bFROM\s+\w+',
        r'\bWHERE\s+',
        r'\bJOIN\s+',
    ]
    if any(re.search(p, code, re.IGNORECASE | re.MULTILINE) for p in sql_patterns):
        return "sql"
    
    # JSON (try to parse)
    try:
        import json
        json.loads(code)
        return "json"
    except:
        pass
    
    # YAML patterns
    if re.search(r'^[\w-]+:\s*(?:[\w-]+|\[|\{)', code, re.MULTILINE):
        return "yaml"
    
    return None
```

**Integration:**

```python
# modules/parser_ssm.py

def ast_to_ssm_blocks(...):
    # ... existing code ...
    
    for n in doc.nodes:
        if n.type == "code":
            # Infer language if not specified
            if not n.lang or n.lang == "":
                inferred = infer_language(n.code or "")
                if inferred:
                    n.lang = inferred
                    n.meta["inferred_language"] = True
```

---

## 🎯 Phase 3: Advanced Enrichments

### 3.1 Multi-Hop Concept Graph

**Problem:** No concept graph, zero graph edges.

**Solution:** Build concept graph with multi-hop relationships.

**Implementation:**

```python
# modules/enrichment_v3/concept_graph.py

from typing import List, Dict, Set, Tuple
from collections import defaultdict
from .ast_nodes import SSMBlock

def build_concept_graph(blocks: List[SSMBlock], idx: Dict[str, Any]) -> Dict[str, Set[str]]:
    """
    Build multi-hop concept graph.
    
    Graph edges represent:
    - Concept → Concept (related concepts)
    - Concept → Term (defines/uses)
    - Concept → Code Pattern (implements)
    - Chapter → Chapter (prerequisites)
    """
    graph: Dict[str, Set[str]] = defaultdict(set)
    
    # Build concept index
    concepts = {b.id: b for b in blocks if b.block_type == "concept"}
    terms = {b.id: b for b in blocks if b.block_type == "term"}
    code_patterns = {b.id: b for b in blocks if b.block_type == "code-pattern"}
    
    # Extract concept mentions from concept bodies
    for concept_id, concept_block in concepts.items():
        body = concept_block.body.lower()
        
        # Find mentions of other concepts (by title or key phrase)
        for other_id, other_block in concepts.items():
            if other_id == concept_id:
                continue
            
            # Check if other concept's title/keywords appear in this concept
            other_title = other_block.meta.get("title", "").lower()
            other_keywords = other_block.meta.get("keywords", [])
            
            if other_title and other_title in body:
                graph[concept_id].add(other_id)
                graph[other_id].add(concept_id)  # Bidirectional
        
        # Link concepts to terms they mention
        for term_id, term_block in terms.items():
            term_name = term_block.meta.get("term", "").lower()
            if term_name and term_name in body:
                graph[concept_id].add(term_id)
        
        # Link concepts to code patterns
        for code_id, code_block in code_patterns.items():
            code_lang = code_block.meta.get("language", "")
            if code_lang and code_lang in body:
                graph[concept_id].add(code_id)
    
    # Add chapter prerequisite edges
    chapter_meta = {b.id: b for b in blocks if b.block_type == "chapter-meta"}
    for ch_id, ch_block in chapter_meta.items():
        prereqs = ch_block.meta.get("prerequisites", [])
        for prereq_code in prereqs:
            # Find chapter with this code
            for other_ch_id, other_ch_block in chapter_meta.items():
                if other_ch_block.meta.get("code") == prereq_code:
                    graph[ch_id].add(other_ch_id)
    
    return dict(graph)

def enrich_concept_graph(blocks: List[SSMBlock], idx: Dict[str, Any]) -> None:
    """Enrich blocks with concept graph metadata"""
    graph = build_concept_graph(blocks, idx)
    
    # Add graph edges to block metadata
    for block in blocks:
        if block.id in graph:
            neighbors = list(graph[block.id])
            block.meta["graph_neighbors"] = neighbors
            block.meta["graph_degree"] = len(neighbors)
            
            # Multi-hop paths (2-3 hops)
            two_hop = set()
            three_hop = set()
            for neighbor_id in neighbors:
                if neighbor_id in graph:
                    for two_hop_neighbor in graph[neighbor_id]:
                        if two_hop_neighbor != block.id:
                            two_hop.add(two_hop_neighbor)
                            # Three-hop
                            if two_hop_neighbor in graph:
                                for three_hop_neighbor in graph[two_hop_neighbor]:
                                    if three_hop_neighbor != block.id and three_hop_neighbor not in neighbors:
                                        three_hop.add(three_hop_neighbor)
            
            block.meta["graph_two_hop"] = list(two_hop)
            block.meta["graph_three_hop"] = list(three_hop)
```

**SSM Output Format:**

```markdown
::: concept
id: CONCEPT-abc123
title: Universal Quantification
graph_neighbors: [CONCEPT-xyz789, TERM-def456]
graph_degree: 2
graph_two_hop: [CONCEPT-ghi012]
graph_three_hop: [CONCEPT-jkl345]
:::
```

---

### 3.2 Advanced Q/A Generation

**Problem:** Q/A is too literal, no scenario-based questions, no multi-hop questions.

**Solution:** Generate semantic, scenario-based questions with context.

**Implementation:**

```python
# modules/enrichment_v3/qa_generator_advanced.py

from typing import List, Dict
import re
from .ast_nodes import SSMBlock

def generate_scenario_questions(block: SSMBlock, context: Dict[str, Any]) -> List[Dict[str, str]]:
    """
    Generate scenario-based questions from block content.
    
    Question types:
    - Scenario: "How would you handle X in situation Y?"
    - Comparison: "What's the difference between X and Y?"
    - Application: "When would you use X instead of Y?"
    - Troubleshooting: "What happens if X fails?"
    """
    questions = []
    body = block.body.lower()
    block_type = block.block_type
    
    # Scenario questions for concepts
    if block_type == "concept":
        # Extract key concepts
        key_terms = re.findall(r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b', block.body)
        
        for term in key_terms[:3]:  # Top 3 terms
            questions.append({
                "question": f"How would you apply {term} in a real-world authorization scenario?",
                "type": "scenario",
                "difficulty": "intermediate"
            })
    
    # Comparison questions
    if "vs" in body or "versus" in body or "difference" in body:
        # Extract comparison pairs
        vs_pattern = r'(\w+)\s+(?:vs|versus|compared to)\s+(\w+)'
        matches = re.findall(vs_pattern, body, re.IGNORECASE)
        for term1, term2 in matches[:2]:
            questions.append({
                "question": f"What is the key difference between {term1} and {term2}?",
                "type": "comparison",
                "difficulty": "intermediate"
            })
    
    # Application questions for code patterns
    if block_type == "code-pattern":
        lang = block.meta.get("language", "")
        pattern_type = block.meta.get("pattern_type", "")
        
        questions.append({
            "question": f"When would you use this {pattern_type} pattern in {lang}?",
            "type": "application",
            "difficulty": "beginner"
        })
    
    # Multi-hop questions (requires concept graph)
    if "graph_neighbors" in block.meta:
        neighbors = block.meta["graph_neighbors"][:2]
        if neighbors:
            questions.append({
                "question": f"How does this concept relate to {len(neighbors)} related concepts?",
                "type": "multi_hop",
                "difficulty": "advanced",
                "requires": neighbors
            })
    
    return questions

def generate_heading_qa(heading_text: str, section_content: str) -> Dict[str, str]:
    """
    Generate Q/A from section headings.
    
    Many headings are questions themselves or can be converted to questions.
    """
    heading_lower = heading_text.lower()
    
    # If heading is already a question
    if heading_text.endswith("?") or heading_lower.startswith(("what", "how", "why", "when", "where")):
        return {
            "question": heading_text,
            "answer": section_content[:500],  # First 500 chars as answer
            "type": "heading_based",
            "difficulty": "beginner"
        }
    
    # Convert statement headings to questions
    if heading_lower.startswith("introduction to"):
        topic = heading_text.replace("Introduction to", "").strip()
        return {
            "question": f"What is {topic}?",
            "answer": section_content[:500],
            "type": "converted",
            "difficulty": "beginner"
        }
    
    if heading_lower.startswith("how to"):
        return {
            "question": heading_text,
            "answer": section_content[:500],
            "type": "how_to",
            "difficulty": "intermediate"
        }
    
    return None
```

**SSM Output Format:**

```markdown
::: qa
id: QA-abc123
question: How would you apply universal quantification in a real-world authorization scenario?
answer: Universal quantification allows you to check that all elements in a collection...
type: scenario
difficulty: intermediate
related_concepts: [CONCEPT-xyz789]
chapter: CH-05
:::
```

---

### 3.3 Semantic Reasoning Chains

**Problem:** All reasoning chains are identical placeholders.

**Solution:** Generate semantic, context-aware reasoning chains.

**Implementation:**

```python
# modules/enrichment_v3/reasoning_chains_advanced.py

from typing import List, Dict
from .ast_nodes import SSMBlock

def generate_reasoning_chain(block: SSMBlock, qa_block: SSMBlock = None) -> List[str]:
    """
    Generate semantic reasoning chain based on block content.
    
    Chain steps are context-aware, not generic placeholders.
    """
    chain = []
    block_type = block.block_type
    body = block.body
    
    if block_type == "concept":
        # Extract key steps from concept explanation
        sentences = body.split('. ')
        
        # First step: Identify the concept
        if sentences:
            chain.append(f"Identify: {sentences[0][:100]}")
        
        # Second step: Understand the mechanism
        if len(sentences) > 1:
            chain.append(f"Understand: {sentences[1][:100]}")
        
        # Third step: Apply the concept
        if "example" in body.lower() or "use case" in body.lower():
            chain.append("Apply: Consider practical use cases and examples")
        
        # Fourth step: Relate to other concepts
        if "graph_neighbors" in block.meta:
            neighbors = block.meta["graph_neighbors"]
            if neighbors:
                chain.append(f"Relate: Connect to {len(neighbors)} related concepts")
    
    elif block_type == "code-pattern":
        pattern_type = block.meta.get("pattern_type", "")
        lang = block.meta.get("language", "")
        
        chain.append(f"Recognize: This is a {pattern_type} pattern in {lang}")
        chain.append(f"Analyze: Understand the structure and components")
        chain.append(f"Apply: Use this pattern when {_get_pattern_use_case(pattern_type)}")
        chain.append(f"Validate: Ensure the pattern matches your requirements")
    
    elif block_type == "fact":
        # Facts are simpler
        chain.append("Read: Understand the factual statement")
        chain.append("Verify: Check if this fact applies to your context")
        chain.append("Apply: Use this fact in your reasoning")
    
    # If this is for a Q/A, add question-specific steps
    if qa_block:
        question = qa_block.meta.get("question", "")
        if "how" in question.lower():
            chain.append("Method: Break down the 'how' into step-by-step process")
        elif "why" in question.lower():
            chain.append("Reason: Identify the underlying reasons and causes")
        elif "when" in question.lower():
            chain.append("Context: Determine the appropriate situations")
    
    return chain if chain else [
        "Read the content carefully",
        "Identify key concepts and relationships",
        "Apply to your specific context",
        "Validate understanding"
    ]

def _get_pattern_use_case(pattern_type: str) -> str:
    """Get use case description for pattern type"""
    use_cases = {
        "quantifier": "you need to check all or some elements in a collection",
        "aggregation": "you need to compute a summary value (count, sum, etc.)",
        "comprehension": "you need to transform or filter a collection",
        "rule_head": "you need to make an authorization decision",
    }
    return use_cases.get(pattern_type, "the pattern matches your use case")
```

**SSM Output Format:**

```markdown
::: qa
id: QA-abc123
question: How does universal quantification work?
reasoning_chain:
  - Identify: Universal quantification checks that all elements...
  - Understand: The 'every' keyword iterates over all elements...
  - Apply: Consider practical use cases and examples
  - Relate: Connect to 3 related concepts
:::
```

---

### 3.4 Table Normalization

**Problem:** Tables are malformed, not normalized.

**Solution:** Parse and normalize table structures.

**Implementation:

```python
# modules/extractor_tables.py

from typing import List, Dict, Any
from dataclasses import dataclass
import re

@dataclass
class TableEntry:
    headers: List[str]
    rows: List[List[str]]
    caption: str = ""
    line_no: int = 0

def extract_tables_from_ast(doc: ASTDocument) -> List[TableEntry]:
    """
    Extract and normalize markdown tables.
    
    Handles:
    - Markdown table syntax (| col1 | col2 |)
    - ASCII tables
    - Tab-separated tables
    """
    tables = []
    
    # Markdown table pattern
    table_pattern = re.compile(r'^\|.+\|$')
    
    current_table = None
    table_lines = []
    
    for node in doc.nodes:
        if node.type == "paragraph":
            lines = node.text.split('\n')
            
            for line in lines:
                if table_pattern.match(line.strip()):
                    if current_table is None:
                        # Start new table
                        current_table = {
                            "lines": [],
                            "line_no": node.line_no
                        }
                    current_table["lines"].append(line.strip())
                else:
                    # Check if this is a separator line (|---|---|)
                    if re.match(r'^\|[\s\-:]+\|$', line.strip()):
                        current_table["lines"].append(line.strip())
                    elif table_pattern.match(line.strip()):
                        current_table["lines"].append(line.strip())
                    else:
                        # End of table
                        if len(current_table["lines"]) >= 2:
                            table = _parse_markdown_table(current_table["lines"])
                            if table:
                                tables.append(TableEntry(
                                    headers=table["headers"],
                                    rows=table["rows"],
                                    line_no=current_table["line_no"]
                                ))
                        current_table = None
            
            # Flush table if still open
            if current_table and len(current_table["lines"]) >= 2:
                table = _parse_markdown_table(current_table["lines"])
                if table:
                    tables.append(TableEntry(
                        headers=table["headers"],
                        rows=table["rows"],
                        line_no=current_table["line_no"]
                    ))
                current_table = None
    
    return tables

def _parse_markdown_table(lines: List[str]) -> Dict[str, Any]:
    """Parse markdown table lines into headers and rows"""
    if len(lines) < 2:
        return None
    
    # First line is headers
    header_line = lines[0]
    headers = [cell.strip() for cell in header_line.split('|')[1:-1]]
    
    # Skip separator line (second line)
    # Remaining lines are data rows
    rows = []
    for line in lines[2:]:
        cells = [cell.strip() for cell in line.split('|')[1:-1]]
        if len(cells) == len(headers):
            rows.append(cells)
    
    return {"headers": headers, "rows": rows}
```

**SSM Output Format:**

```markdown
::: table
id: TABLE-abc123
headers: [Function, Purpose, Example]
rows:
  - [count, Returns length of collection, count([1,2,3])]
  - [sum, Returns sum of numbers, sum([1,2,3])]
caption: Built-in aggregation functions
chapter: CH-06
:::
```

---

## 🎯 Phase 4: Quality Improvements

### 4.1 Term Extraction Noise Reduction

**Problem:** Some noise in term extraction.

**Solution:** Improve term filtering and validation.

**Implementation:**

```python
# modules/extractor_terms_improved.py

def extract_terms_from_ast(doc: ASTDocument) -> List[TermEntry]:
    """
    Improved term extraction with noise reduction.
    
    Filters:
    - Very short terms (< 3 chars, unless acronym)
    - Common words
    - Stop words
    - Duplicate terms
    """
    terms = []
    seen_terms = set()
    
    # Stop words to ignore
    stop_words = {
        "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
        "of", "with", "by", "from", "as", "is", "are", "was", "were", "be",
        "been", "being", "have", "has", "had", "do", "does", "did", "will",
        "would", "should", "could", "may", "might", "must", "can"
    }
    
    # Existing term extraction logic...
    # ... (from current implementation) ...
    
    # Filter terms
    filtered_terms = []
    for term in terms:
        term_lower = term.term.lower()
        
        # Skip stop words
        if term_lower in stop_words:
            continue
        
        # Skip very short terms (unless all caps = acronym)
        if len(term.term) < 3 and not term.term.isupper():
            continue
        
        # Skip if already seen (case-insensitive)
        if term_lower in seen_terms:
            continue
        
        seen_terms.add(term_lower)
        filtered_terms.append(term)
    
    return filtered_terms
```

---

### 4.2 Embedding Hints Context-Aware

**Problem:** Embedding hints are repetitive, too broad.

**Solution:** Generate context-aware, specific embedding hints.

**Implementation:**

```python
# modules/enrichment_v3/embedding_metadata_improved.py

def enrich_embedding_metadata(blocks: List[SSMBlock], idx: Dict[str, Any]) -> None:
    """
    Generate context-aware embedding hints.
    
    Hints are based on:
    - Block type and content
    - Position in chapter/section
    - Semantic density
    - Relationship to other blocks
    """
    for block in blocks:
        block_type = block.block_type
        body_length = len(block.body) if block.body else 0
        
        # Importance based on block type
        importance_map = {
            "chapter-meta": "critical",
            "section-meta": "high",
            "concept": "high",
            "term": "high",
            "code-pattern": "medium",
            "fact": "medium",
            "example": "low",
        }
        importance = importance_map.get(block_type, "medium")
        
        # Scope based on hierarchy
        if block.chapter:
            scope = "chapter"
        elif block.meta.get("section"):
            scope = "section"
        else:
            scope = "document"
        
        # Chunk strategy based on content
        if body_length > 1000:
            chunk_strategy = "split"
        elif body_length > 500:
            chunk_strategy = "standalone"
        else:
            chunk_strategy = "merge"
        
        block.meta["embedding_hint_importance"] = importance
        block.meta["embedding_hint_scope"] = scope
        block.meta["embedding_hint_chunk"] = chunk_strategy
        
        # Add semantic density score
        # (number of key terms / total words)
        if block.body:
            words = block.body.split()
            key_terms = sum(1 for w in words if w.isupper() or w[0].isupper())
            density = key_terms / len(words) if words else 0
            block.meta["embedding_hint_density"] = round(density, 3)
```

---

### 4.3 Role Notes Per-Chapter

**Problem:** Role notes appear only once, should be per-chapter.

**Solution:** Generate role-specific notes for each chapter.

**Implementation:

```python
# modules/enrichment_v3/role_notes_improved.py

def enrich_role_notes(blocks: List[SSMBlock], idx: Dict[str, Any]) -> None:
    """
    Generate role-specific notes per chapter.
    
    Roles:
    - Developer: Implementation focus
    - Architect: Design and patterns
    - Security: Security implications
    - Operator: Deployment and operations
    """
    roles = ["developer", "architect", "security", "operator"]
    
    # Group blocks by chapter
    by_chapter = idx.get("by_chapter", {})
    
    for chapter_code, chapter_blocks in by_chapter.items():
        # Find chapter-meta block
        chapter_meta = next(
            (b for b in chapter_blocks if b.block_type == "chapter-meta"),
            None
        )
        
        if not chapter_meta:
            continue
        
        # Generate role notes for this chapter
        role_notes = {}
        
        for role in roles:
            notes = []
            
            # Developer notes
            if role == "developer":
                code_blocks = [b for b in chapter_blocks if b.block_type in ["code", "code-pattern"]]
                if code_blocks:
                    notes.append(f"This chapter contains {len(code_blocks)} code examples to study.")
                concepts = [b for b in chapter_blocks if b.block_type == "concept"]
                if concepts:
                    notes.append(f"Focus on understanding {len(concepts)} core concepts.")
            
            # Architect notes
            elif role == "architect":
                patterns = [b for b in chapter_blocks if b.block_type == "code-pattern"]
                if patterns:
                    notes.append(f"Review {len(patterns)} design patterns for system architecture.")
                relations = [b for b in chapter_blocks if b.block_type == "relation"]
                if relations:
                    notes.append(f"Understand {len(relations)} cross-chapter dependencies.")
            
            # Security notes
            elif role == "security":
                anti_patterns = [b for b in chapter_blocks if b.block_type == "anti-pattern"]
                if anti_patterns:
                    notes.append(f"⚠️ Critical: Review {len(anti_patterns)} security anti-patterns.")
                security_concepts = [b for b in chapter_blocks 
                                   if "security" in b.body.lower() or "vulnerable" in b.body.lower()]
                if security_concepts:
                    notes.append(f"Security implications discussed in {len(security_concepts)} sections.")
            
            # Operator notes
            elif role == "operator":
                deployment_blocks = [b for b in chapter_blocks 
                                    if "deploy" in b.body.lower() or "operation" in b.body.lower()]
                if deployment_blocks:
                    notes.append(f"Operational guidance in {len(deployment_blocks)} sections.")
            
            if notes:
                role_notes[role] = notes
        
        # Add to chapter-meta
        if role_notes:
            chapter_meta.meta["role_notes"] = role_notes
```

**SSM Output Format:**

```markdown
::: chapter-meta
id: CHMETA-abc123
code: CH-07
title: Testing, Debugging & Troubleshooting
role_notes:
  developer:
    - This chapter contains 15 code examples to study.
    - Focus on understanding 8 core concepts.
  architect:
    - Review 5 design patterns for system architecture.
  security:
    - ⚠️ Critical: Review 3 security anti-patterns.
:::
```

---

## 🎯 Phase 5: Integration & Testing

### 5.1 Integration Checklist

- [ ] Update `compiler.py` to use new hierarchical AST parser
- [ ] Integrate all new extractors (relations, anti-patterns, tables, code-AST)
- [ ] Integrate all improved enrichments
- [ ] Update SSM block emission to include new block types
- [ ] Add validation for hierarchical structure
- [ ] Update tests to verify V3 features

### 5.2 Testing Strategy

**Unit Tests:**
- Test hierarchical AST construction
- Test each extractor independently
- Test each enrichment pass

**Integration Tests:**
- Test full pipeline with sample markdown
- Verify all 20 V3 capabilities are present
- Check SSM output correctness

**Regression Tests:**
- Ensure V2 features still work
- Verify backward compatibility

### 5.3 Migration Path

1. **Phase 1** (Weeks 1-2): Core infrastructure (AST, hierarchy)
2. **Phase 2** (Weeks 3-4): Advanced extraction
3. **Phase 3** (Weeks 5-6): Advanced enrichments
4. **Phase 4** (Week 7): Quality improvements
5. **Phase 5** (Week 8): Integration & testing

---

## 📊 Success Metrics

**V3 Feature Completion:**
- ✅ 20/20 capabilities implemented
- ✅ Hierarchical AST with parent-child relationships
- ✅ Multi-hop concept graph with edges
- ✅ All block types present (part-meta, section-meta, relation, anti-pattern, table)
- ✅ Advanced Q/A generation with scenarios
- ✅ Semantic reasoning chains
- ✅ Context-aware embedding hints
- ✅ Per-chapter role notes

**Quality Metrics:**
- Zero duplicate chapter-meta blocks
- 100% of blocks have chapter assignments
- All "See Chapter X" references extracted as relations
- All anti-patterns detected and classified
- Tables normalized and properly formatted

---

## 🎓 Implementation Notes

1. **Backward Compatibility:** Maintain V2 output format as fallback
2. **Performance:** Hierarchical AST may be slower; optimize if needed
3. **Error Handling:** Gracefully handle malformed markdown
4. **Extensibility:** Plugin architecture for future languages/patterns

---

**END OF PLAN**

