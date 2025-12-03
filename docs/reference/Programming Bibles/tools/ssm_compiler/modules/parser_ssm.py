"""
AST → SSM v2 Blocks

Converts Chapter AST nodes into SSM v2 formatted blocks.
This is the SSM emitter (Version 2).
"""
from __future__ import annotations

from typing import List, Dict, Any, Optional, Tuple
from .ast_nodes import ASTDocument, SSMBlock
from .extractor_terms import TermEntry
from .extractor_code import CodeEntry
from .extractor_relations import RelationEntry
from .extractor_diagrams import DiagramEntry
from .extractor_tables import TableEntry
from .extractor_patterns import extract_patterns_from_ast, enhance_code_blocks_with_patterns
from .v3_metadata import generate_v3_metadata
from .utils.patterns import CHAPTER_HEADING_RE
from .utils.hashing import sha1_id
from .utils.text import normalize_whitespace
from .classifier_paragraph import classify_paragraph


def compute_chapter_ranges(doc: ASTDocument) -> List[Tuple[int, int, str]]:
    """
    Compute line number ranges for each chapter.
    
    FIX 2: Use AST chapter nodes instead of just headings to get accurate ranges.
    
    Args:
        doc: AST document
    
    Returns:
        List of (start_line, end_line, chapter_code) tuples
    """
    starts: List[Tuple[int, str]] = []
    
    # FIX 2: Use AST chapter nodes (from doc.chapters) instead of searching headings
    # This ensures we get the correct chapters that were parsed, not standalone text
    for chapter_node in doc.chapters:
        if chapter_node.type == "chapter":
            ch_code = chapter_node.meta.get("code", f"CH-{chapter_node.meta.get('number', 0):02d}")
            starts.append((chapter_node.line_no, ch_code))
    
    # Fallback: if no chapters found in doc.chapters, try headings
    if not starts:
        for n in doc.nodes:
            if n.type == "chapter":
                ch_code = n.meta.get("code", f"CH-{n.meta.get('number', 0):02d}")
                starts.append((n.line_no, ch_code))
    
    # If still no chapters, try headings as last resort
    if not starts:
        for n in doc.nodes:
            if n.type == "heading":
                m = CHAPTER_HEADING_RE.match(n.text)
                if m:
                    num = int(m.group(1))
                    starts.append((n.line_no, f"CH-{num:02d}"))
    
    if not starts:
        return []
    
    # Sort by line number to ensure correct order
    starts.sort(key=lambda x: x[0])
    
    ranges: List[Tuple[int, int, str]] = []
    for i, (start, code) in enumerate(starts):
        end = starts[i + 1][0] if i + 1 < len(starts) else 10**9
        ranges.append((start, end, code))
    return ranges


def chapter_for_line(line: int, ranges: List[Tuple[int, int, str]]) -> Optional[str]:
    """
    Find chapter code for a given line number.
    
    Args:
        line: Line number
        ranges: Chapter ranges
    
    Returns:
        Chapter code or None
    """
    for s, e, c in ranges:
        if s <= line < e:
            return c
    return None


def build_block_index(blocks: List[SSMBlock]) -> Dict[str, Any]:
    """
    Build index of blocks for enrichment passes.
    
    Args:
        blocks: List of SSM blocks
    
    Returns:
        Index dictionary
    """
    by_id: Dict[str, SSMBlock] = {}
    by_type: Dict[str, List[SSMBlock]] = {}
    by_chapter: Dict[str, List[SSMBlock]] = {}
    chapter_meta_by_code: Dict[str, SSMBlock] = {}
    
    for b in blocks:
        if b.id:
            by_id[b.id] = b
        by_type.setdefault(b.block_type, []).append(b)
        if b.chapter:
            by_chapter.setdefault(b.chapter, []).append(b)
        if b.block_type == "chapter-meta":
            code = str(b.meta.get("code", "")).strip()
            if code:
                chapter_meta_by_code[code] = b
    
    return {
        "by_id": by_id,
        "by_type": by_type,
        "by_chapter": by_chapter,
        "chapter_meta_by_code": chapter_meta_by_code,
    }


def ast_to_ssm_blocks(
    doc: ASTDocument,
    terms: List[TermEntry],
    codes: List[CodeEntry],
    rels: List[RelationEntry],
    diags: List[DiagramEntry],
    tables: Optional[List[TableEntry]] = None,  # NEW - Phase 4
    errors: Optional[Any] = None,  # ErrorBus (optional)
    symbols: Optional[Any] = None,  # SymbolTable (optional)
    namespace: str = "default",  # NEW - Phase 5
    compiler_version: str = "3.0.0",  # NEW - Phase 5
    ssm_schema_version: str = "1.0.0",  # NEW - Phase 5
) -> List[SSMBlock]:
    """
    Convert AST to SSM blocks (Version 3 with part-meta and section-meta).
    
    Args:
        doc: AST document
        terms: Extracted terms
        codes: Extracted code entries
        rels: Extracted relations
        diags: Extracted diagrams
        errors: ErrorBus instance (optional)
        symbols: SymbolTable instance (optional)
    
    Returns:
        List of SSMBlock objects
    """
    blocks: List[SSMBlock] = []
    idx = 0
    
    # Phase 5: Add ssm-meta block at the beginning
    from datetime import date
    ssm_meta_block = SSMBlock(
        block_type="ssm-meta",
        meta={
            "id": sha1_id("SSMMETA", f"{namespace}:{compiler_version}"),
            "compiler_version": compiler_version,
            "ssm_schema_version": ssm_schema_version,
            "bible_version": date.today().isoformat(),
            "namespace": namespace,
        },
        body="",
        index=idx,
        id=sha1_id("SSMMETA", f"{namespace}:{compiler_version}"),
        chapter=None,
    )
    blocks.append(ssm_meta_block)
    idx += 1
    
    chapter_ranges = compute_chapter_ranges(doc)
    
    # Part-meta blocks (NEW - Phase 1)
    for part_node in doc.parts:
        if part_node.type == "part":
            part_num = part_node.meta.get("part_number", "")
            part_title = part_node.meta.get("title", part_node.text)
            
            # Get chapters in this part
            chapter_codes = []
            for child in part_node.children:
                if child.type == "chapter":
                    ch_code = child.meta.get("code", f"CH-{child.meta.get('number', 0):02d}")
                    chapter_codes.append(ch_code)
            
            bid = sha1_id("PARTMETA", f"{part_num}:{part_title}")
            blk = SSMBlock(
                block_type="part-meta",
                meta={
                    "id": bid,
                    "part_number": part_num,
                    "title": part_title,
                    "chapters": chapter_codes,
                },
                body="",
                index=idx,
                id=bid,
                chapter=None,  # Parts span multiple chapters
            )
            blocks.append(blk)
            idx += 1
    
    # Chapter-meta blocks (updated to use hierarchical AST)
    # Track chapter codes to prevent duplicates
    seen_chapter_codes = set()
    for chapter_node in doc.get_all_chapters():
        num = chapter_node.meta.get("number", 0)
        title = chapter_node.meta.get("title", chapter_node.text)
        ch_code = chapter_node.meta.get("code", f"CH-{num:02d}")
        
        # Handle duplicate chapter codes by appending suffix
        original_ch_code = ch_code
        suffix = ""
        counter = 0
        while ch_code in seen_chapter_codes:
            counter += 1
            suffix = chr(64 + counter)  # A, B, C, ...
            ch_code = f"{original_ch_code}-{suffix}"
        
        seen_chapter_codes.add(ch_code)
        
        # Update chapter node meta with unique code
        chapter_node.meta["code"] = ch_code
        
        bid = sha1_id("CHMETA", ch_code + title)
        
        # Get sections in this chapter
        sections = doc.get_chapter_sections(chapter_node)
        section_titles = [s.text for s in sections]
        
        blk = SSMBlock(
            block_type="chapter-meta",
            meta={
                "id": bid,
                "code": ch_code,
                "number": num,
                "title": title,
                "level": ["beginner"] if num <= 2 else ["intermediate"],
                "prerequisites": [],
                "sections": section_titles[:10],  # Limit to first 10 sections
            },
            body="",
            index=idx,
            id=bid,
            chapter=ch_code,
        )
        blocks.append(blk)
        idx += 1
    
    # Section-meta blocks (NEW - Phase 1)
    for n in doc.nodes:
        if n.type == "section":
            chapter = n.find_chapter()
            # Find parent section (ancestor that is a section, but not self)
            parent_section = None
            for ancestor in n.get_ancestors():
                if ancestor.type == "section" and ancestor != n:
                    parent_section = ancestor
                    break
            
            ch_code = chapter.meta.get("code") if chapter else None
            parent_section_id = None
            if parent_section:
                parent_section_id = sha1_id("SECMETA", f"{parent_section.line_no}:{parent_section.text[:100]}")
            
            bid = sha1_id("SECMETA", f"{n.line_no}:{n.text[:100]}")
            blk = SSMBlock(
                block_type="section-meta",
                meta={
                    "id": bid,
                    "title": n.text,
                    "level": n.level,
                    "chapter": ch_code,
                    "parent_section": parent_section_id,
                    "line_no": n.line_no,
                },
                body="",
                index=idx,
                id=bid,
                chapter=ch_code,
            )
            blocks.append(blk)
            idx += 1
    
    # Legacy chapter-meta blocks (for backward compatibility with old AST structure)
    # Only process if not already processed via hierarchical AST
    processed_chapters = {b.meta.get("code") for b in blocks if b.block_type == "chapter-meta"}
    for n in doc.nodes:
        if n.type == "heading":
            m = CHAPTER_HEADING_RE.match(n.text)
            if m:
                num = int(m.group(1))
                ch_code = f"CH-{num:02d}"
                # Skip if already processed
                if ch_code in processed_chapters:
                    continue
                title = m.group(2).strip()
                bid = sha1_id("CHMETA", ch_code + title)
                blk = SSMBlock(
                    block_type="chapter-meta",
                    meta={
                        "id": bid,
                        "code": ch_code,
                        "number": num,
                        "title": title,
                        "level": ["beginner"] if num <= 2 else ["intermediate"],
                        "prerequisites": [],
                    },
                    body="",
                    index=idx,
                    id=bid,
                    chapter=ch_code,
                )
                blocks.append(blk)
                idx += 1
    
    # Term blocks
    # FIX 2: Improved chapter assignment for terms
    # FIX 6: Extract code blocks from terms into separate example/pattern blocks
    for t in terms:
        ch = chapter_for_line(t.first_line, chapter_ranges)
        
        # FIX 2: If chapter_for_line returns None, try to find chapter from AST
        if not ch:
            # Find the closest chapter before this term's line
            closest_chapter = None
            closest_line = 0
            for chapter_node in doc.chapters:
                if chapter_node.line_no <= t.first_line and chapter_node.line_no > closest_line:
                    closest_line = chapter_node.line_no
                    closest_chapter = chapter_node.meta.get("code", f"CH-{chapter_node.meta.get('number', 0):02d}")
            if closest_chapter:
                ch = closest_chapter
        
        # FIX 6: Extract code blocks from term definition
        import re
        code_blocks = re.findall(r'```(\w+)?\n(.*?)```', t.definition, re.DOTALL)
        
        # Remove code blocks from term definition (keep text only)
        definition_without_code = t.definition
        for lang, code_content in code_blocks:
            code_block = f"```{lang or ''}\n{code_content}\n```"
            definition_without_code = definition_without_code.replace(code_block, f"[Code example extracted - see example block below]")
        
        bid = sha1_id("TERM", t.name + definition_without_code)
        blk = SSMBlock(
            block_type="term",
            meta={
                "id": bid,
                "name": t.name,
                "definition": definition_without_code,  # FIX 6: Definition without code blocks
                "aliases": t.aliases,
                "chapter": ch or "",  # FIX 2: Should now have chapter code
            },
            body="",
            index=idx,
            id=bid,
            chapter=ch,  # FIX 2: Should now have chapter code
        )
        blocks.append(blk)
        idx += 1
        
        # FIX 6: Create example blocks for code found in term definitions
        for lang, code_content in code_blocks:
            code_bid = sha1_id("CODE", f"{t.name}:{code_content[:50]}")
            code_blk = SSMBlock(
                block_type="example",  # FIX 6: Code from terms becomes example blocks
                meta={
                    "id": code_bid,
                    "language": lang or "rego",
                    "chapter": ch or "",
                    "source": f"term:{t.name}",  # Track that this came from a term
                    "purpose": "definition-example",
                },
                body=code_content.strip(),
                index=idx,
                id=code_bid,
                chapter=ch,
            )
            blocks.append(code_blk)
            idx += 1
    
    # Code blocks → example/code-pattern (enhanced with pattern extraction + Issue 10 solution)
    for ce in codes:
        ch = chapter_for_line(ce.line_no, chapter_ranges)
        role = ce.classification.role
        tags = ce.classification.tags
        
        # Solution 10: Split code into semantic segments if applicable
        try:
            from modules.extractor_code_enhanced import split_code_into_segments
            segments = split_code_into_segments(ce)
            
            # If multiple segments, create multiple blocks
            if len(segments) > 1:
                for seg in segments:
                    bid = sha1_id("CODE", f"{ce.line_no}:{seg.content[:50]}")
                    
                    # Determine block type from segment
                    if seg.segment_type == 'pattern':
                        btype = "code-pattern"
                        # Extract pattern metadata
                        parts = role.split(":")
                        pattern_type = parts[1] if len(parts) > 1 else "generic"
                        pattern_subtype = parts[2] if len(parts) > 2 else ""
                    elif seg.segment_type == 'concept':
                        btype = "concept"
                        pattern_type = ""
                        pattern_subtype = ""
                    else:
                        btype = "example"
                        pattern_type = ""
                        pattern_subtype = ""
                    
                    meta = {
                        "id": bid,
                        "chapter": ch or "",
                        "language": ce.lang or "",
                        "role": role,
                        "tags": tags,
                        "explanation": seg.explanation,
                        "confidence": seg.confidence,
                    }
                    
                    if btype == "code-pattern":
                        meta["pattern_type"] = pattern_type
                        if pattern_subtype:
                            meta["pattern_subtype"] = pattern_subtype
                    
                    blk = SSMBlock(
                        block_type=btype,
                        meta=meta,
                        body=seg.content,
                        index=idx,
                        id=bid,
                        chapter=ch,
                    )
                    blocks.append(blk)
                    idx += 1
            else:
                # Single segment or no splitting - use original logic
                if role.startswith("code-pattern"):
                    btype = "code-pattern"
                    parts = role.split(":")
                    pattern_type = parts[1] if len(parts) > 1 else "generic"
                    pattern_subtype = parts[2] if len(parts) > 2 else ""
                else:
                    btype = "example"
                    pattern_type = ""
                    pattern_subtype = ""
                
                bid = sha1_id("CODE", ce.code + ce.lang + role)
                meta = {
                    "id": bid,
                    "chapter": ch or "",
                    "language": ce.lang or "",
                    "role": role,
                    "tags": tags,
                }
                
                if btype == "code-pattern":
                    meta["pattern_type"] = pattern_type
                    if pattern_subtype:
                        meta["pattern_subtype"] = pattern_subtype
                
                blk = SSMBlock(
                    block_type=btype,
                    meta=meta,
                    body=ce.code,
                    index=idx,
                    id=bid,
                    chapter=ch,
                )
                blocks.append(blk)
                idx += 1
        except ImportError:
            # Fallback to original logic if splitter not available
            if role.startswith("code-pattern"):
                btype = "code-pattern"
                parts = role.split(":")
                pattern_type = parts[1] if len(parts) > 1 else "generic"
                pattern_subtype = parts[2] if len(parts) > 2 else ""
            else:
                btype = "example"
                pattern_type = ""
                pattern_subtype = ""
            
            bid = sha1_id("CODE", ce.code + ce.lang + role)
            meta = {
                "id": bid,
                "chapter": ch or "",
                "language": ce.lang or "",
                "role": role,
                "tags": tags,
            }
            
            if btype == "code-pattern":
                meta["pattern_type"] = pattern_type
                if pattern_subtype:
                    meta["pattern_subtype"] = pattern_subtype
            
            blk = SSMBlock(
                block_type=btype,
                meta=meta,
                body=ce.code,
                index=idx,
                id=bid,
                chapter=ch,
            )
            blocks.append(blk)
            idx += 1
    
    # Extract additional patterns using pattern extractor (Phase 2)
    pattern_blocks = extract_patterns_from_ast(doc, errors=errors, symbols=symbols)
    # Merge pattern blocks (avoid duplicates)
    existing_code_ids = {b.id for b in blocks if b.block_type in ["code", "example", "code-pattern"]}
    for pattern_block in pattern_blocks:
        if pattern_block.id not in existing_code_ids:
            pattern_block.index = idx
            blocks.append(pattern_block)
            idx += 1
    
    # FIX 3: Extract conceptual pattern blocks (::: pattern, not code-pattern)
    try:
        from modules.extractor_conceptual_patterns import extract_conceptual_patterns_from_ast
        conceptual_patterns = extract_conceptual_patterns_from_ast(doc, errors=errors, symbols=symbols)
        for pattern_block in conceptual_patterns:
            pattern_block.index = idx
            blocks.append(pattern_block)
            idx += 1
    except ImportError:
        # Fallback if extractor not available
        pass
    
    # Enhance existing code blocks with pattern metadata
    enhance_code_blocks_with_patterns(blocks, doc, errors=errors, symbols=symbols)
    
    # Diagram blocks (Enhanced for Phase 4 + Issue 6 solution)
    for d in diags:
        # Check if diagram is enriched (has metadata)
        if hasattr(d, 'metadata') and hasattr(d, 'chapter_code'):
            # Use enriched diagram data
            ch = d.chapter_code or chapter_for_line(d.line_no, chapter_ranges)
            bid = sha1_id("DIAG", d.code[:80])
            
            # Use enriched metadata
            meta = {
                "id": bid,
                "chapter": ch or "",
                "language": d.lang,
                "diagram_type": d.diagram_type or d.type,
                "summary": f"{d.diagram_type or d.type} diagram",
            }
            
            # Add enriched metadata if available
            if hasattr(d, 'metadata') and d.metadata:
                meta.update({
                    "nodes": d.metadata.get('nodes', []),
                    "edges": d.metadata.get('edges', []),
                    "normalized_content": d.metadata.get('normalized_content', ''),
                })
        else:
            # Fallback to original logic
            ch = chapter_for_line(d.line_no, chapter_ranges)
            bid = sha1_id("DIAG", d.code[:80])
            
            # Generate summary for diagram
            summary = f"{d.type} diagram"
            if d.type == "mermaid":
                # Extract first line as summary
                first_line = d.code.split("\n")[0] if d.code else ""
                summary = first_line[:100] if first_line else summary
            
            meta = {
                "id": bid,
                "chapter": ch or "",
                "language": d.lang,
                "diagram_type": d.type,
                "summary": summary,
            }
        
        blk = SSMBlock(
            block_type="diagram",
            meta=meta,
            body=d.code,
            index=idx,
            id=bid,
            chapter=ch if 'ch' in locals() else chapter_for_line(d.line_no, chapter_ranges),
        )
        blocks.append(blk)
        idx += 1
    
    # Table blocks (NEW - Phase 4)
    if tables:
        for t in tables:
            ch = chapter_for_line(t.line_no, chapter_ranges)
            bid = sha1_id("TABLE", f"{t.headers}:{len(t.rows)}")
            
            blk = SSMBlock(
                block_type="table",
                meta={
                    "id": bid,
                    "chapter": ch or "",
                    "headers": t.headers,
                    "row_count": len(t.rows),
                    "caption": t.caption,
                },
                body="",  # Table data stored in meta
                index=idx,
                id=bid,
                chapter=ch,
            )
            # Store rows in meta for easy access
            blk.meta["rows"] = t.rows
            blocks.append(blk)
            idx += 1
    
    # Relation blocks (Enhanced for Phase 3)
    # FIX VALIDATION: Ensure all required fields are present
    for r in rels:
        # Skip relations with missing required fields
        if not r.from_ref or not r.to_ref or not r.relation_type:
            if errors:
                errors.warning(
                    code="WARN_INCOMPLETE_RELATION",
                    message=f"Skipping relation with missing fields: from={r.from_ref}, to={r.to_ref}, type={r.relation_type}",
                    line=r.line_no if hasattr(r, 'line_no') else 0,
                    column=0,
                    context=r.context[:100] if r.context else ""
                )
            continue
        
        bid = sha1_id("REL", f"{r.from_ref}->{r.to_ref}:{r.relation_type}")
        meta = {
            "id": bid,
            "from": r.from_ref,  # FIX: Required field
            "to": r.to_ref,      # FIX: Required field
            "type": r.relation_type,  # FIX: Required field
            "context": r.context or "",
            "confidence": r.confidence or 1.0,
        }
        # Phase 6: Add namespace information
        if r.from_namespace:
            meta["from_namespace"] = r.from_namespace
        if r.to_namespace:
            meta["to_namespace"] = r.to_namespace
        
        blk = SSMBlock(
            block_type="relation",
            meta=meta,
            body=r.context or "",
            index=idx,
            id=bid,
            chapter=None,
        )
        blocks.append(blk)
        idx += 1
    
    # Paragraph blocks → concept/fact/example/common-mistake
    # Skip paragraphs that are already covered by terms or are too short
    processed_paragraphs = set()
    for t in terms:
        processed_paragraphs.add(t.first_line)
    
    for n in doc.nodes:
        if n.type == "paragraph":
            # Skip if already processed as term or if too short
            if n.line_no in processed_paragraphs:
                continue
            
            text = normalize_whitespace(n.text)
            if len(text.strip()) < 20:  # Skip very short paragraphs
                continue
            
            # Classify paragraph
            block_type = classify_paragraph(text)
            
            # Skip if it's an example (code blocks are handled separately)
            if block_type == "example" and "```" not in text:
                block_type = "concept"  # Default to concept for non-code examples
            
            ch = chapter_for_line(n.line_no, chapter_ranges)
            # Include line number and more text to ensure uniqueness
            bid = sha1_id("BLK", f"{n.line_no}:{text[:200]}")
            
            # Generate smart summary using SmartSummaryGenerator (Issue 3 solution)
            try:
                from modules.utils.summary_generator import SmartSummaryGenerator
                summary_gen = SmartSummaryGenerator()
                context = {
                    'chapter': ch,
                    'type': block_type,
                }
                summary = summary_gen.generate(text, context)
            except ImportError:
                # Fallback to original logic if generator not available
                summary_text = text.strip()
                import re
                summary_text = re.sub(r'^[\d]+\.\s+', '', summary_text)
                summary_text = re.sub(r'^[-*+]\s+', '', summary_text)
                summary_text = summary_text.strip()
                
                if ". " in summary_text:
                    summary = summary_text.split(". ")[0] + "."
                else:
                    summary = summary_text[:100]
                
                if len(summary.strip()) <= 2 or summary.strip().isdigit():
                    sentences = re.split(r'[.!?]\s+', summary_text)
                    if sentences and len(sentences[0]) > 5:
                        summary = sentences[0] + "."
                    else:
                        summary = summary_text[:150]
                
                if len(summary) > 150:
                    summary = summary[:147] + "..."
            
            blk = SSMBlock(
                block_type=block_type,
                meta={
                    "id": bid,
                    "summary": summary,
                },
                body=text,
                index=idx,
                id=bid,
                chapter=ch,  # Use the chapter code from chapter_for_line
            )
            blocks.append(blk)
            idx += 1
    
    # FIX 4 & 5: Generate v3 metadata for all blocks (symbol_refs, semantic_role, etc.)
    # FIX VALIDATION: Ensure all blocks have IDs before metadata generation
    for block in blocks:
        # Ensure block has an ID (required for validation)
        if not block.id:
            # Generate ID from block content if missing
            # sha1_id is already imported at top of file
            block.id = sha1_id(
                block.block_type.upper(),
                f"{block.body[:100]}:{block.index}:{block.chapter or ''}"
            )
            # Also set in meta if not present
            if "id" not in block.meta:
                block.meta["id"] = block.id
        
        # Find source node if available (for token range, etc.)
        source_node = None
        # Try to find node by line number or ID
        if hasattr(block, 'meta') and 'line_no' in block.meta:
            line_no = block.meta['line_no']
            for node in doc.nodes:
                if hasattr(node, 'line_no') and node.line_no == line_no:
                    source_node = node
                    break
        
        generate_v3_metadata(block, source_node=source_node, symbols=symbols, source_file=None)
    
    return blocks
