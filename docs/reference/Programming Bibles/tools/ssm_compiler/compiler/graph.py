from __future__ import annotations

from typing import List, Dict, Set

import re

from .ast_nodes import Chapter, SectionNode

from .utils import make_id

from .classifiers import normalize_whitespace

# Toggle sequential dependencies (CH-n depends on CH-(n-1))

SEQUENTIAL_DEP = False

def build_chapter_text(ch: Chapter) -> str:

    parts: List[str] = []

    for blk in ch.blocks:

        parts.append(blk.text)

    def walk(sections: List[SectionNode]):

        for s in sections:

            parts.append(s.title)

            for b in s.blocks:

                parts.append(b.text)

            walk(s.children)

    walk(ch.sections)

    return "\n\n".join(parts)

def build_chapter_graph(chapters: List[Chapter], chapter_texts: Dict[str, str]) -> Dict[str, Set[str]]:

    graph: Dict[str, Set[str]] = {}

    num_to_code: Dict[int, str] = {ch.number: ch.code for ch in chapters}

    for ch in chapters:

        code = ch.code

        graph.setdefault(code, set())

        text = chapter_texts.get(code, "")

        if SEQUENTIAL_DEP and ch.number > 1:

            prev_code = num_to_code.get(ch.number - 1)

            if prev_code:

                graph[code].add(prev_code)

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

    out: List[str] = []

    def add_rel(target_num: int, rel_type: str, summary_suffix: str):

        target_code = f"CH-{target_num:02d}"

        rel_id = make_id("REL", f"{chapter.code}->{target_code}:{rel_type}", length=16)

        out.append(

            "::: relation\n"

            f"id: {rel_id}\n"

            f"from: {chapter.code}\n"

            f"to: {target_code}\n"

            f"type: {rel_type}\n"

            f"summary: {chapter.code} {summary_suffix} {target_code}\n"

            ":::\n"

        )

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


