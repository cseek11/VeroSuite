#!/usr/bin/env python3
"""
Version 2: Streaming Markdown → SSM Knowledge Compiler
------------------------------------------------------

Usage:
    python convert_ssm_v2.py rego_opa_bible.md > rego_opa_bible.ssm.md

Features:
- Streaming markdown parser with simple AST:
    - PART / Chapter hierarchy
    - Sections (###, ####, …)
    - Blocks (text, code, diagram)
- Difficulty inference per chapter (beginner → phd)
- Term + alias extraction
- Code classification with multi-language hooks (Rego/TS/Python/Go)
- Rego code pattern taxonomy
- Diagram taxonomy (Mermaid & ASCII)
- Q/A generation for “X vs Y” sections
- Anti-pattern / common-mistake tagging
- Chapter dependency graph (direct + transitive prerequisites)
- SSM-style blocks:
    - ::: chapter-meta
    - ::: term
    - ::: concept / fact / example / common-mistake
    - ::: code / code-pattern
    - ::: diagram
    - ::: qa
    - ::: relation
    - ::: graph (Mermaid)
"""

from __future__ import annotations

import re
import sys
import hashlib
from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Dict, Any, Optional, Callable, Set

# ===================== Utilities ======================

def normalize_whitespace(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()

def make_id(prefix: str, content: str) -> str:
    """Stable content-based IDs (12 hex chars of SHA1)."""
    h = hashlib.sha1(content.encode("utf-8")).hexdigest()[:12]
    return f"{prefix}-{h}"

# =================== Regex Patterns ===================

HEADING_RE = re.compile(r"^(#+)\s+(.*)$")
PART_RE = re.compile(r"^#\s+PART\s+([IVXLC]+)\s*[–—-]\s*(.+)$")
CHAPTER_RE = re.compile(r"^##\s+Chapter\s+(\d+)\s*[–—-]\s*(.+)$")
CODE_FENCE_RE = re.compile(r"^([`~]{3,})(\w+)?\s*$")

# ===================== Data Model =====================

@dataclass
class Block:
    kind: str           # 'text', 'code', 'diagram'
    text: str
    lang: str = ""
    line_start: int = 0
    line_end: int = 0

@dataclass
class SectionNode:
    level: int
    title: str
    id: str
    line_start: int
    line_end: int = 0
    blocks: List[Block] = field(default_factory=list)
    children: List["SectionNode"] = field(default_factory=list)

@dataclass
class Chapter:
    number: int
    title: str
    part_title: str
    id: str
    code: str
    line_start: int
    line_end: int = 0
    sections: List[SectionNode] = field(default_factory=list)
    blocks: List[Block] = field(default_factory=list)

# ================== Streaming Parser ==================

def parse_document(md: str) -> List[Chapter]:
    """
    Single-pass streaming parser:
    - Tracks PART / Chapter
    - Builds Chapter + Section tree
    - Emits Blocks (text, code, diagram) attached to sections or chapter root
    """
    lines = md.splitlines()
    chapters: List[Chapter] = []
    current_part_title = ""
    current_chapter: Optional[Chapter] = None
    section_stack: List[SectionNode] = []

    pending_text_lines: List[str] = []
    text_start_line: Optional[int] = None

    inside_code = False
    code_fence = ""
    code_lang = ""
    code_lines: List[str] = []
    code_start_line: Optional[int] = None

    def attach_block(ch: Chapter, stack: List[SectionNode], blk: Block):
        if stack:
            stack[-1].blocks.append(blk)
        else:
            ch.blocks.append(blk)

    def flush_text_block(current_line: int):
        nonlocal pending_text_lines, text_start_line
        if pending_text_lines and current_chapter is not None:
            text = "\n".join(pending_text_lines).rstrip()
            if text.strip():
                blk = Block(
                    kind="text",
                    text=text,
                    lang="",
                    line_start=text_start_line or current_line,
                    line_end=current_line - 1,
                )
                attach_block(current_chapter, section_stack, blk)
        pending_text_lines = []
        text_start_line = None

    def close_chapter(last_line: int):
        nonlocal current_chapter
        if current_chapter is not None:
            current_chapter.line_end = last_line
        # finalize sections line_end if unset
        for sec in section_stack:
            if sec.line_end == 0:
                sec.line_end = last_line

    for idx, line in enumerate(lines, start=1):
        # ====== inside fenced code ======
        if inside_code:
            if CODE_FENCE_RE.match(line) and line.startswith(code_fence[0] * len(code_fence)):
                # close fence
                inside_code = False
                fence_end_line = idx
                code_text = "\n".join(code_lines)
                if current_chapter is not None:
                    if code_lang.lower() == "mermaid":
                        blk = Block(
                            kind="diagram",
                            text=code_text,
                            lang="mermaid",
                            line_start=code_start_line or idx,
                            line_end=fence_end_line,
                        )
                    else:
                        blk = Block(
                            kind="code",
                            text=code_text,
                            lang=code_lang,
                            line_start=code_start_line or idx,
                            line_end=fence_end_line,
                        )
                    attach_block(current_chapter, section_stack, blk)
                code_lines = []
                code_lang = ""
                code_fence = ""
                code_start_line = None
                continue
            else:
                code_lines.append(line)
                continue

        # ====== not inside code ======

        # PART heading?
        m_part = PART_RE.match(line)
        if m_part:
            flush_text_block(idx)
            current_part_title = f"PART {m_part.group(1).strip()} — {m_part.group(2).strip()}"
            continue

        # CHAPTER heading?
        m_ch = CHAPTER_RE.match(line)
        if m_ch:
            flush_text_block(idx)
            close_chapter(idx - 1)
            chapter_num = int(m_ch.group(1))
            chapter_title = m_ch.group(2).strip()
            chapter_id = make_id("CH", f"{chapter_num}:{chapter_title}")
            chapter_code = f"CH-{chapter_num:02d}"
            current_chapter = Chapter(
                number=chapter_num,
                title=chapter_title,
                part_title=current_part_title,
                id=chapter_id,
                code=chapter_code,
                line_start=idx,
            )
            chapters.append(current_chapter)
            section_stack = []
            continue

        # Code fence start?
        m_cf = CODE_FENCE_RE.match(line)
        if m_cf:
            flush_text_block(idx)
            inside_code = True
            code_fence = m_cf.group(1)
            code_lang = (m_cf.group(2) or "").strip()
            code_lines = []
            code_start_line = idx
            continue

        # Heading (section)
        m_h = HEADING_RE.match(line)
        if m_h:
            flush_text_block(idx)
            hashes, heading_text = m_h.group(1), m_h.group(2).strip()
            level = len(hashes)

            # Skip PART / CHAPTER headings (already handled)
            if PART_RE.match(line) or CHAPTER_RE.match(line):
                continue

            if current_chapter is None:
                # heading before any chapter → ignore for now
                continue

            sec_id = make_id("SEC", f"{current_chapter.code}:{level}:{heading_text}")
            sec = SectionNode(
                level=level,
                title=heading_text,
                id=sec_id,
                line_start=idx,
            )

            # Pop until strictly less level
            while section_stack and section_stack[-1].level >= level:
                top = section_stack.pop()
                if top.line_end == 0:
                    top.line_end = idx - 1

            if section_stack:
                section_stack[-1].children.append(sec)
            else:
                current_chapter.sections.append(sec)

            section_stack.append(sec)
            continue

        # Blank line → end of current prose block
        if line.strip() == "":
            flush_text_block(idx)
            continue

        # Normal text line
        if current_chapter is None:
            # front-matter before first chapter; ignore for now
            continue
        if not pending_text_lines:
            text_start_line = idx
        pending_text_lines.append(line)

    # End of file
    flush_text_block(len(lines) + 1)
    close_chapter(len(lines))

    return chapters

# =============== Difficulty / Terms / Relations ===============

INTERMEDIATE_MARKERS = [
    "comprehension",
    "partial evaluation",
    "bundle distribution",
    "decision logging",
]

ADVANCED_MARKERS = [
    "multi-tenant architecture",
    "stateful policy",
    "temporal logic",
    "graph reachability",
]

PHD_MARKERS = [
    "fixpoint",
    "horn clause",
    "stratified negation",
    "immediate consequence operator",
    "herbrand universe",
    "denotational semantics",
]

def infer_difficulty(chapter_num: int, content: str) -> List[str]:
    levels: List[str] = []

    # position-based heuristic
    if chapter_num <= 2:
        levels.append("beginner")
    if 3 <= chapter_num <= 8:
        levels.append("intermediate")
    if 9 <= chapter_num <= 15:
        levels.append("advanced")
    if chapter_num > 15:
        levels.append("phd")

    # content-based markers
    lc = content.lower()
    if any(m in lc for m in INTERMEDIATE_MARKERS) and "intermediate" not in levels:
        levels.append("intermediate")
    if any(m in lc for m in ADVANCED_MARKERS) and "advanced" not in levels:
        levels.append("advanced")
    if any(m in lc for m in PHD_MARKERS) and "phd" not in levels:
        levels.append("phd")

    if not levels:
        levels.append("unspecified")
    return levels

# -------- Term & alias extraction --------

TERM_PATTERNS = [
    # **Term**: definition   (start-of-line)
    re.compile(r"^\s*\*\*([^*]+)\*\*\s*[:\-–—]\s*([^.\n]+)", re.MULTILINE),
    # "term" is definition   (start-of-line)
    re.compile(r'^\s*"([^"]+)"\s+(?:is|means|refers to)\s+([^.\n]+)', re.MULTILINE),
]

ALIAS_PATTERN = re.compile(
    r"\*\*([^*]+)\*\*\s*\((?:also called|aka|or)\s+([^)]+)\)",
    re.IGNORECASE,
)

def extract_terms(content: str) -> List[Dict[str, Any]]:
    terms: Dict[str, Dict[str, Any]] = {}

    def key_for(name: str, definition: str) -> str:
        return f"{name.strip().lower()}||{definition.strip().lower()}"

    # Base terms
    for pat in TERM_PATTERNS:
        for m in pat.finditer(content):
            name = normalize_whitespace(m.group(1))
            definition = normalize_whitespace(m.group(2))
            key = key_for(name, definition)
            if key not in terms:
                terms[key] = {
                    "name": name,
                    "definition": definition,
                    "aliases": set(),
                }

    # Aliases
    for m in ALIAS_PATTERN.finditer(content):
        name = normalize_whitespace(m.group(1))
        alias_str = m.group(2)
        aliases = [normalize_whitespace(a) for a in alias_str.split(",")]
        for data in terms.values():
            if data["name"].lower() == name.lower():
                data["aliases"].update(aliases)

    out: List[Dict[str, Any]] = []
    for data in terms.values():
        name = data["name"]
        definition = data["definition"]
        aliases = sorted(data["aliases"]) if data["aliases"] else []
        out.append(
            {
                "name": name,
                "definition": definition,
                "aliases": aliases,
                "id": make_id("TERM", f"{name}:{definition}"),
            }
        )
    return out

# -------- Paragraph classification --------

def classify_paragraph(text: str) -> str:
    """
    Weighted heuristic classification:
    - concept / fact / example / common-mistake
    """
    t = text.lower()
    scores = {
        "concept": 0,
        "fact": 0,
        "example": 0,
        "common-mistake": 0,
    }

    # Common mistakes / anti-patterns
    if "unsafe" in t and "variable" in t:
        scores["common-mistake"] += 3
    if "common mistake" in t or "anti-pattern" in t or "pitfall" in t or "trap" in t:
        scores["common-mistake"] += 2

    # Theory markers → concept
    theory_markers = [
        "unification",
        "evaluation model",
        "semantics",
        "fixpoint",
        "model theory",
        "stratified",
        "denotational",
    ]
    if any(m in t for m in theory_markers):
        scores["concept"] += 2

    # Normative markers → fact
    fact_markers = ["must", "should", "shall", "required", "never", "always"]
    if any(m in t for m in fact_markers):
        scores["fact"] += 2
    if "opa" in t or "rego" in t or "rule" in t:
        scores["fact"] += 1

    # Example-ish markers
    example_markers = ["example", "for instance", "e.g.", "consider:"]
    if any(m in t for m in example_markers):
        scores["example"] += 2
    if "```" in text:
        scores["example"] += 2

    label, best = max(scores.items(), key=lambda kv: kv[1])
    return label if best > 0 else "concept"

# -------- Mistakes / vs headings helpers --------

def looks_like_mistake_heading(text: str) -> bool:
    t = text.lower()
    return any(
        kw in t
        for kw in [
            "common mistake",
            "common mistakes",
            "anti-pattern",
            "anti pattern",
            "pitfall",
            "trap",
            "🚫",
            "❌",
        ]
    )

def looks_like_vs_heading(text: str) -> bool:
    return bool(re.search(r"\bvs\b", text, flags=re.IGNORECASE))

def generate_vs_qa(heading: str, block_text: str) -> Dict[str, str]:
    m = re.search(r"(.+?)\s+vs\.?\s+(.+)", heading, re.IGNORECASE)
    if m:
        x, y = m.group(1).strip(), m.group(2).strip()
        q = f"What is the difference between {x} and {y}?"
    else:
        q = f"What is explained in the section about {heading}?"

    sentences = re.split(r"[.!?]\s+", block_text.strip())
    answer = sentences[0] if sentences and sentences[0] else block_text.strip()
    return {
        "q": q,
        "a": normalize_whitespace(answer),
    }

# -------- Diagram detection / taxonomy --------

def classify_mermaid_diagram(text: str) -> Dict[str, Any]:
    body = text.lower()
    if "sequencediagram" in body:
        return {"diagram_type": "sequence", "tags": ["sequence", "flow"]}
    if "graph td" in body or "graph lr" in body:
        return {"diagram_type": "flowchart", "tags": ["flowchart", "graph"]}
    if "classdiagram" in body:
        return {"diagram_type": "class", "tags": ["class", "uml"]}
    if "statediagram" in body:
        return {"diagram_type": "state", "tags": ["state", "fsm"]}
    if "gantt" in body:
        return {"diagram_type": "timeline", "tags": ["timeline", "gantt"]}
    return {"diagram_type": "mermaid", "tags": []}

def detect_ascii_diagram(text: str) -> Optional[Dict[str, Any]]:
    stripped = text.strip()
    lines = stripped.splitlines()
    if len(lines) < 3:
        return None
    box_chars = ["+", "-", "|", "╔", "╗", "╚", "╝", "═", "║", "┌", "┐", "└", "┘"]
    box_lines = sum(1 for line in lines if any(c in line for c in box_chars))
    arrows = sum(1 for line in lines if "->" in line or "→" in line or "⇨" in line)
    if box_lines >= 3 or arrows >= 3:
        return {"diagram_type": "ascii", "tags": ["ascii", "diagram"]}
    return None

# ========== Code classification / language guessing ==========

def guess_unlabeled_language(code: str) -> str:
    head = "\n".join(code.strip().splitlines()[:5]).lower()
    # Rego-ish
    if "package " in head or "default " in head or "allow if" in head or "deny if" in head:
        return "rego"
    # Python-ish
    if re.search(r"\bdef\s+\w+\s*\(", head):
        return "python"
    # TS / NestJS-ish
    if "@controller(" in head or "@module(" in head or "export " in head or "async " in head:
        return "typescript"
    # Default for this project
    return "rego"

def get_rego_pattern_taxonomy(code: str) -> Dict[str, Any]:
    t = code
    if "allow if" in t or "deny if" in t:
        return {
            "pattern_category": "authorization",
            "pattern_type": "allow-deny",
            "pattern_tags": ["auth", "rbac", "policy"],
        }
    if "not any_" in t or "every " in t:
        return {
            "pattern_category": "quantification",
            "pattern_type": "universal-via-negation",
            "pattern_tags": ["quantification", "negation", "helper-rule"],
        }
    if "[ " in t and "|" in t and "]" in t:
        return {
            "pattern_category": "comprehension",
            "pattern_type": "array-comprehension",
            "pattern_tags": ["comprehension", "array"],
        }
    if "{ " in t and "|" in t and "}" in t and ":" in t:
        return {
            "pattern_category": "comprehension",
            "pattern_type": "object-comprehension",
            "pattern_tags": ["comprehension", "object"],
        }
    if "{ " in t and "|" in t and "}" in t and ":" not in t:
        return {
            "pattern_category": "comprehension",
            "pattern_type": "set-comprehension",
            "pattern_tags": ["comprehension", "set"],
        }
    if "with input as" in t or "with data as" in t:
        return {
            "pattern_category": "testing",
            "pattern_type": "with-mock",
            "pattern_tags": ["testing", "mock", "with"],
        }
    return {"pattern_category": "", "pattern_type": "", "pattern_tags": []}

def classify_rego_code(code: str) -> str:
    t = code
    if "allow if" in t or "deny if" in t:
        return "code-pattern"
    if "every " in t or "all_" in t or "any_" in t:
        return "code-pattern"
    if "[ " in t and "|" in t and "]" in t:
        return "code-pattern"
    if "{ " in t and "|" in t and "}" in t:
        return "code-pattern"
    if "not any_" in t:
        return "code-pattern"
    if "contains" in t and " if {" in t:
        return "code-pattern"
    return "example"

def classify_ts_code(code: str) -> str:
    return "example"

def classify_python_code(code: str) -> str:
    return "example"

def classify_go_code(code: str) -> str:
    return "example"

LANGUAGE_CONFIG: Dict[str, Dict[str, Any]] = {
    "rego": {
        "names": ["rego", "policy", "opa"],
        "classifier": classify_rego_code,
    },
    "typescript": {
        "names": ["ts", "typescript"],
        "classifier": classify_ts_code,
    },
    "python": {
        "names": ["py", "python"],
        "classifier": classify_python_code,
    },
    "go": {
        "names": ["go", "golang"],
        "classifier": classify_go_code,
    },
}

def classify_code(lang: str, code: str) -> str:
    l = (lang or "").strip().lower()
    if not l:
        guessed = guess_unlabeled_language(code)
        if guessed == "python":
            return classify_python_code(code)
        if guessed == "typescript":
            return classify_ts_code(code)
        return classify_rego_code(code)

    for _lname, cfg in LANGUAGE_CONFIG.items():
        if l in cfg.get("names", []):
            classifier: Callable[[str], str] = cfg["classifier"]
            return classifier(code)

    return "example"

# ========== Chapter graph / learning paths ==========

# Optional: treat each chapter as depending on previous one
SEQUENTIAL_DEP = False

def build_chapter_text(ch: Chapter) -> str:
    """Flatten a chapter (title + sections + blocks) into plain text."""
    parts: List[str] = []
    for blk in ch.blocks:
        parts.append(blk.text)

    def walk_sections(sections: List[SectionNode]):
        for s in sections:
            parts.append(s.title)
            for b in s.blocks:
                parts.append(b.text)
            walk_sections(s.children)

    walk_sections(ch.sections)
    return "\n\n".join(parts)

def build_chapter_graph(chapters: List[Chapter], chapter_texts: Dict[str, str]) -> Dict[str, Set[str]]:
    graph: Dict[str, Set[str]] = {}
    num_to_code: Dict[int, str] = {ch.number: ch.code for ch in chapters}

    for ch in chapters:
        code = ch.code
        graph.setdefault(code, set())
        text = chapter_texts.get(code, "")

        # Optional sequential dependency
        if SEQUENTIAL_DEP and ch.number > 1:
            prev_code = num_to_code.get(ch.number - 1)
            if prev_code:
                graph[code].add(prev_code)

        # Explicit references: "Chapter N"
        for m in re.finditer(r"[Cc]hapter\s+(\d+)", text):
            target_num = int(m.group(1))
            dep_code = num_to_code.get(target_num)
            if dep_code:
                graph[code].add(dep_code)

    return graph

def compute_transitive_closure(graph: Dict[str, Set[str]]) -> Dict[str, Set[str]]:
    closure: Dict[str, Set[str]] = {node: set(deps) for node, deps in graph.items()}

    def dfs(start: str, current: str):
        for neighbor in graph.get(current, set()):
            if neighbor not in closure[start]:
                closure[start].add(neighbor)
                dfs(start, neighbor)

    for node in list(graph.keys()):
        dfs(node, node)
    return closure

def extract_relations_for_chapter(chapter: Chapter, chapter_text: str) -> List[str]:
    """Emit :::relation blocks based on textual references."""
    out: List[str] = []

    def add_rel(target_num: int, rel_type: str, summary_suffix: str):
        target_code = f"CH-{target_num:02d}"
        rel_id = make_id("REL", f"{chapter.code}->{target_code}:{rel_type}")
        out.append(
            "::: relation\n"
            f"id: {rel_id}\n"
            f"from: {chapter.code}\n"
            f"to: {target_code}\n"
            f"type: {rel_type}\n"
            f"summary: {chapter.code} {summary_suffix} {target_code}\n"
            ":::\n"
        )

    # "See Chapter X"
    for m in re.finditer(r"[Ss]ee\s+Chapter\s+(\d+)", chapter_text):
        add_rel(int(m.group(1)), "references", "references")

    dep_patterns = [
        (r"requires understanding of Chapter (\d+)", "requires", "requires"),
        (r"builds on Chapter (\d+)", "builds_on", "builds on"),
        (r"covered in Chapter (\d+)", "covered_in", "is covered in"),
        (r"as explained in Chapter (\d+)", "explained_in", "is explained in"),
    ]
    for pattern, rel_type, suffix in dep_patterns:
        for m in re.finditer(pattern, chapter_text, flags=re.IGNORECASE):
            add_rel(int(m.group(1)), rel_type, suffix)

    return out

def render_chapter_graph_mermaid(graph: Dict[str, Set[str]]) -> str:
    lines = ["graph TD"]
    for src, targets in graph.items():
        for tgt in sorted(targets):
            lines.append(f"  {src} --> {tgt}")
    return "\n".join(lines)

# =============== SSM Conversion ===============

def make_front_matter_yaml(
    chapter: Chapter,
    levels: List[str],
    direct: List[str],
    all_deps: List[str],
) -> str:
    lines = []
    lines.append(f"  code: {chapter.code}")
    lines.append(f"  number: {chapter.number}")
    lines.append(f"  title: \"{chapter.title}\"")
    lines.append(f"  part: \"{chapter.part_title}\"")
    lines.append("  level:")
    for lv in levels:
        lines.append(f"    - {lv}")
    lines.append("  prerequisites_direct:")
    for d in direct:
        lines.append(f"    - {d}")
    lines.append("  prerequisites_all:")
    for d in all_deps:
        lines.append(f"    - {d}")
    return "front_matter_yaml: |\n" + "\n".join(lines)

def convert_chapter_to_ssm(
    chapter: Chapter,
    chapter_text: str,
    levels: List[str],
    prereqs_direct: List[str],
    prereqs_all: List[str],
) -> str:
    out: List[str] = []
    level_list_str = ", ".join(levels)
    fm_yaml = make_front_matter_yaml(chapter, levels, prereqs_direct, prereqs_all)

    prereqs_direct_str = "[" + ", ".join(prereqs_direct) + "]"
    prereqs_all_str = "[" + ", ".join(prereqs_all) + "]"

    # ---- chapter-meta ----
    out.append(
        "::: chapter-meta\n"
        f"id: {chapter.id}\n"
        f"code: {chapter.code}\n"
        f"number: {chapter.number}\n"
        f"title: {chapter.title}\n"
        f"part: {chapter.part_title or 'UNSPECIFIED'}\n"
        f"level: [{level_list_str}]\n"
        f"slug: chapter-{chapter.number:02d}\n"
        f"prerequisites_direct: {prereqs_direct_str}\n"
        f"prerequisites_all: {prereqs_all_str}\n"
        f"{fm_yaml}\n"
        ":::\n"
    )

    # ---- term blocks ----
    for term in extract_terms(chapter_text):
        aliases_str = "[" + ", ".join(term["aliases"]) + "]" if term["aliases"] else "[]"
        out.append(
            "::: term\n"
            f"id: {term['id']}\n"
            f"name: {term['name']}\n"
            f"definition: {term['definition']}\n"
            f"first_defined_in: {chapter.code}\n"
            f"aliases: {aliases_str}\n"
            ":::\n"
        )

    # ---- helper to process blocks for chapter + sections ----

    def process_blocks(blocks: List[Block], heading_text: Optional[str] = None) -> List[str]:
        pending_mistake_heading: Optional[str] = None
        pending_qa_heading: Optional[str] = None

        if heading_text:
            if looks_like_mistake_heading(heading_text):
                pending_mistake_heading = heading_text
            if looks_like_vs_heading(heading_text):
                pending_qa_heading = heading_text

        local_out: List[str] = []

        for blk in blocks:
            # CODE
            if blk.kind == "code":
                kind = classify_code(blk.lang or "rego", blk.text)
                bid = make_id("CODE", blk.text)
                pattern_category = ""
                pattern_type = ""
                pattern_tags: List[str] = []
                if kind == "code-pattern":
                    l = (blk.lang or "").strip().lower()
                    if l in ("", "rego", "policy", "opa"):
                        tax = get_rego_pattern_taxonomy(blk.text)
                        pattern_category = tax["pattern_category"]
                        pattern_type = tax["pattern_type"]
                        pattern_tags = tax["pattern_tags"]
                tags_str = "[" + ", ".join(pattern_tags) + "]" if pattern_tags else "[]"
                local_out.append(
                    f"::: {kind}\n"
                    f"id: {bid}\n"
                    f"chapter: {chapter.code}\n"
                    f"language: {blk.lang or 'rego'}\n"
                    f"level: [{level_list_str}]\n"
                    "name: \"\"\n"
                    f"pattern_category: \"{pattern_category}\"\n"
                    f"pattern_type: \"{pattern_type}\"\n"
                    f"pattern_tags: {tags_str}\n"
                    "tags: []\n"
                    ":::\n"
                    f"```{blk.lang}\n{blk.text}\n```\n"
                    ":::\n"
                )
                continue

            # DIAGRAM (Mermaid)
            if blk.kind == "diagram":
                if blk.lang.lower() == "mermaid":
                    info = classify_mermaid_diagram(blk.text)
                else:
                    info = {"diagram_type": "diagram", "tags": []}
                did = make_id("DIAGRAM", chapter.code + "::" + blk.text)
                tags_str = "[" + ", ".join(info["tags"]) + "]" if info["tags"] else "[]"
                local_out.append(
                    "::: diagram\n"
                    f"id: {did}\n"
                    f"chapter: {chapter.code}\n"
                    f"level: [{level_list_str}]\n"
                    f"type: {info['diagram_type']}\n"
                    f"tags: {tags_str}\n"
                    "summary: Visual diagram (requires interpretation)\n"
                    ":::\n"
                    f"{blk.text}\n"
                    ":::\n"
                )
                continue

            # TEXT → maybe ASCII diagram
            ascii_info = detect_ascii_diagram(blk.text)
            if ascii_info:
                did = make_id("DIAGRAM", chapter.code + "::" + blk.text)
                tags_str = "[" + ", ".join(ascii_info["tags"]) + "]" if ascii_info["tags"] else "[]"
                local_out.append(
                    "::: diagram\n"
                    f"id: {did}\n"
                    f"chapter: {chapter.code}\n"
                    f"level: [{level_list_str}]\n"
                    f"type: {ascii_info['diagram_type']}\n"
                    f"tags: {tags_str}\n"
                    "summary: ASCII diagram (requires interpretation)\n"
                    ":::\n"
                    f"{blk.text}\n"
                    ":::\n"
                )
                continue

            # Q/A from “X vs Y”
            if pending_qa_heading:
                qa = generate_vs_qa(pending_qa_heading, blk.text)
                qa_id = make_id("QA", pending_qa_heading + blk.text)
                local_out.append(
                    "::: qa\n"
                    f"id: {qa_id}\n"
                    f"chapter: {chapter.code}\n"
                    f"level: [{level_list_str}]\n"
                    f"q: {qa['q']}\n"
                    f"a: {qa['a']}\n"
                    "reference: \"\"\n"
                    ":::\n"
                )
                pending_qa_heading = None  # type: ignore

            # Explicit common-mistake section → first block tagged high severity
            if pending_mistake_heading:
                bid = make_id("MISTAKE", blk.text)
                summary = normalize_whitespace(
                    pending_mistake_heading + " — " + blk.text.split(". ")[0]
                )
                local_out.append(
                    "::: common-mistake\n"
                    f"id: {bid}\n"
                    f"chapter: {chapter.code}\n"
                    f"level: [{level_list_str}]\n"
                    "severity: high\n"
                    f"summary: {summary}\n"
                    "category: safety\n"
                    ":::\n"
                    f"{blk.text}\n"
                    ":::\n"
                )
                pending_mistake_heading = None  # type: ignore
                continue

            # Normal prose classification
            kind = classify_paragraph(blk.text)
            bid = make_id("BLK", blk.text)
            summary = normalize_whitespace(blk.text.split(". ")[0])

            if kind == "common-mistake":
                local_out.append(
                    "::: common-mistake\n"
                    f"id: {bid}\n"
                    f"chapter: {chapter.code}\n"
                    f"level: [{level_list_str}]\n"
                    "severity: medium\n"
                    f"summary: {summary}\n"
                    "category: safety\n"
                    ":::\n"
                    f"{blk.text}\n"
                    ":::\n"
                )
            else:
                local_out.append(
                    f"::: {kind}\n"
                    f"id: {bid}\n"
                    f"chapter: {chapter.code}\n"
                    f"level: [{level_list_str}]\n"
                    f"summary: {summary}\n"
                    "tags: []\n"
                    ":::\n"
                    f"{blk.text}\n"
                    ":::\n"
                )

        return local_out

    # Root blocks (not in any section)
    out.extend(process_blocks(chapter.blocks))

    # Sections depth-first
    def walk_sections(sections: List[SectionNode]):
        for s in sections:
            hashes = "#" * s.level
            out.append(f"{hashes} {s.title}\n")
            out.extend(process_blocks(s.blocks, heading_text=s.title))
            walk_sections(s.children)

    walk_sections(chapter.sections)

    # Explicit relations (Chapter X references, etc.)
    out.extend(extract_relations_for_chapter(chapter, chapter_text))

    return "\n".join(out)

def convert(md: str) -> str:
    """Top-level conversion: markdown → SSM markdown."""
    chapters = parse_document(md)
    if not chapters:
        return ""

    chapter_texts: Dict[str, str] = {
        ch.code: build_chapter_text(ch) for ch in chapters
    }
    difficulties: Dict[str, List[str]] = {
        ch.code: infer_difficulty(ch.number, chapter_texts[ch.code])
        for ch in chapters
    }

    graph = build_chapter_graph(chapters, chapter_texts)
    closure = compute_transitive_closure(graph)

    out: List[str] = []

    for ch in chapters:
        direct = sorted(graph.get(ch.code, set()))
        all_deps = sorted(closure.get(ch.code, set()))
        levels = difficulties[ch.code]
        text = chapter_texts[ch.code]
        out.append(
            convert_chapter_to_ssm(ch, text, levels, direct, all_deps)
        )

    # Global chapter dependency graph as Mermaid
    mermaid = render_chapter_graph_mermaid(graph)
    gid = make_id("GRAPH", mermaid)
    out.append(
        "::: graph\n"
        f"id: {gid}\n"
        "type: mermaid\n"
        "summary: Chapter dependency graph (direct edges)\n"
        ":::\n"
        "```mermaid\n"
        f"{mermaid}\n"
        "```\n"
        ":::\n"
    )

    return "\n\n".join(out)

# ======================= CLI =========================

def read_markdown(path: Path) -> str:
    return path.read_text(encoding="utf-8")

def main_cli(argv=None):
    if argv is None:
        argv = sys.argv
    if len(argv) < 2:
        print("Usage: convert_ssm_v2.py <input.md> [output.md]", file=sys.stderr)
        raise SystemExit(1)
    path = Path(argv[1])
    md = read_markdown(path)
    result = convert(md)
    
    # If output file specified, write directly with UTF-8 encoding
    if len(argv) >= 3:
        output_path = Path(argv[2])
        output_path.write_text(result, encoding='utf-8')
        print(f"Written to {output_path}", file=sys.stderr)
    else:
        # Force UTF-8 encoding for stdout to handle Unicode characters
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        print(result)

if __name__ == "__main__":
    main_cli()
