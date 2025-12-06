# SSM Compiler - Modular Architecture (Version 3)

**Last Updated:** 2025-12-05  
**Version:** 3.0.0

## Overview

The SSM (Structured Semantic Markup) compiler converts raw Markdown documents into enriched SSM v3 format with comprehensive knowledge extraction and enrichment capabilities.

## Architecture

### Directory Structure

```
opa_ssm_compiler/
├── compiler.py              # Unified compiler entrypoint (v3)
├── main.py                  # CLI entry point (supports v2 and v3)
├── __main__.py              # Module CLI wrapper
├── compiler/                # Legacy v2 compiler (backward compatible)
│   ├── parser.py
│   ├── emitter.py
│   ├── classifiers.py
│   ├── graph.py
│   ├── ast_nodes.py
│   └── utils.py
└── modules/                 # New modular architecture
    ├── parser_markdown.py   # Streaming markdown parser → AST
    ├── parser_ssm.py        # AST → SSM v2 blocks
    ├── extractor_terms.py   # Term extraction
    ├── extractor_code.py    # Code block classifier (multi-language)
    ├── extractor_relations.py  # Relation & dependency extractor
    ├── extractor_diagrams.py   # ASCII + Mermaid diagram handler
    ├── enrichment_v3/        # All 20 enrichment capabilities
    │   ├── bidirectional_links.py
    │   ├── embedding_metadata.py
    │   ├── intuition.py
    │   ├── examples_smells.py
    │   ├── role_notes.py
    │   ├── do_dont.py
    │   ├── inference_rules.py
    │   ├── qa_generator.py
    │   ├── constraints.py
    │   ├── chapter_graph.py
    │   ├── reasoning_chains.py
    │   ├── semantic_vector.py
    │   ├── test_hints.py
    │   └── ordering.py
    ├── plugins/             # Language-specific plugins
    │   ├── rego_plugin.py
    │   ├── ts_plugin.py
    │   ├── python_plugin.py
    │   └── sql_plugin.py
    └── utils/               # Utility modules
        ├── hashing.py
        ├── text.py
        ├── ids.py
        └── graph.py
```

## Unified Pipeline

The compiler follows this pipeline:

1. **Parse Markdown → AST** (`parser_markdown.py`)
   - Streaming parser handles headings, sections, paragraphs, code fences, diagrams, lists
   - Builds Chapter + Section tree with Blocks

2. **Extract Blocks** (extractor modules)
   - Terms (`extractor_terms.py`)
   - Code blocks (`extractor_code.py`)
   - Relations (`extractor_relations.py`)
   - Diagrams (`extractor_diagrams.py`)

3. **Emit SSM v2** (`parser_ssm.py`)
   - Converts AST to SSM v2 formatted blocks
   - Mirrors existing Version-2 compiler behavior

4. **Apply Version-3 Enrichments** (20 passes in `enrichment_v3/`)
   - Bidirectional links
   - Embedding metadata
   - Intuition explanations
   - Examples and code smells
   - Role-specific notes
   - Do/don't patterns
   - Inference rules
   - Q/A generation
   - Constraints
   - Chapter summaries and pathways
   - Reasoning chains
   - Semantic vectors
   - Test case hints
   - Canonical ordering

5. **Canonical Sort + Validate**
   - Sort blocks in canonical order
   - Ensure unique IDs

6. **Emit Final SSM v3 Markdown**
   - Output enriched SSM v3 format

## Usage

### Version 2 (Legacy, Default)

```bash
python main.py input.md output.ssm.md
```

### Version 3 (New Unified Compiler)

```bash
python main.py input.md output.ssm.md --v3
```

Or use the unified compiler directly:

```bash
python compiler.py input.md output.ssm.md
```

Or as a module:

```bash
python -m opa_ssm_compiler input.md output.ssm.md
```

## Module Details

### Parser Modules

- **`parser_markdown.py`**: Streaming markdown parser that builds AST
- **`parser_ssm.py`**: Converts AST to SSM v2 blocks

### Extractor Modules

- **`extractor_terms.py`**: Extracts terms and aliases
- **`extractor_code.py`**: Classifies code blocks by language and pattern
- **`extractor_relations.py`**: Extracts chapter dependencies and relations
- **`extractor_diagrams.py`**: Handles Mermaid and ASCII diagrams

### Enrichment Modules (v3)

All 20 enrichment capabilities are in `enrichment_v3/`:

1. **bidirectional_links**: Cross-references between related blocks
2. **embedding_metadata**: Semantic embedding metadata
3. **intuition**: Intuitive explanations and mental models
4. **examples_smells**: Examples and anti-pattern detection
5. **role_notes**: Role-specific guidance (beginner → PhD)
6. **do_dont**: Best practices and anti-patterns
7. **inference_rules**: Logical inference rules
8. **qa_generator**: Q/A pair generation
9. **constraints**: Validation constraints
10. **chapter_graph**: Chapter summaries and learning pathways
11. **reasoning_chains**: Logical reasoning chains
12. **semantic_vector**: Semantic vectors and similarity
13. **test_hints**: Test case hints and examples
14. **ordering**: Canonical block ordering

### Language Plugins

Language-specific code classification:

- **`rego_plugin.py`**: Rego/OPA pattern detection
- **`ts_plugin.py`**: TypeScript/NestJS patterns
- **`python_plugin.py`**: Python patterns
- **`sql_plugin.py`**: SQL patterns

## Implementation Status

### ✅ Completed

- Modular directory structure
- Parser modules (markdown → AST, AST → SSM v2)
- Extractor module stubs
- Enrichment v3 module stubs (20 capabilities)
- Language plugin stubs
- Unified compiler entrypoint
- Backward compatibility (v2 compiler still works)

### 🚧 TODO (Future Implementation)

- Implement enrichment v3 capabilities (currently stubs)
- Implement language plugin pattern detection (TypeScript, Python, SQL)
- Enhance AST-level extraction (terms, code, relations, diagrams)
- Add comprehensive tests
- Performance optimization for large documents

## Backward Compatibility

The legacy v2 compiler (`compiler/` package) remains fully functional. The new modular architecture integrates with it while providing a path for future enhancements.

## Development

To add a new enrichment capability:

1. Create a new module in `modules/enrichment_v3/`
2. Implement the enrichment function: `enrich_<name>(blocks, idx) -> None`
3. Add it to `compiler.py` pipeline
4. Update `modules/enrichment_v3/__init__.py`

To add a new language plugin:

1. Create a new file in `modules/plugins/`
2. Implement `classify(code: str) -> str` and `get_pattern_taxonomy(code: str) -> Dict`
3. Update `modules/plugins/__init__.py`
4. Integrate with `extractor_code.py`

## License

Part of the VeroField project.

