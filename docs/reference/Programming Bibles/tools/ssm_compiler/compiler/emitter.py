from __future__ import annotations

from typing import List

from .ast_nodes import Chapter, SectionNode, Block

from .utils import make_id

from .utils import normalize_whitespace  # re-exported for convenience

from .classifiers import (

    infer_difficulty,

    extract_terms,

    classify_paragraph,

    looks_like_mistake_heading,

    looks_like_vs_heading,

    generate_vs_qa,

    classify_mermaid_diagram,

    detect_ascii_diagram,

    classify_code,

    get_rego_pattern_taxonomy,

)

from .graph import extract_relations_for_chapter

def _make_front_matter_yaml(chapter: Chapter, levels: List[str], direct: List[str], all_deps: List[str]) -> str:

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

def _process_blocks_for_context(

    chapter: Chapter,

    blocks: List[Block],

    levels: List[str],

    heading_text: str | None = None,

) -> List[str]:

    out: List[str] = []

    level_list_str = ", ".join(levels)

    pending_mistake_heading = heading_text if (heading_text and looks_like_mistake_heading(heading_text)) else None

    pending_qa_heading = heading_text if (heading_text and looks_like_vs_heading(heading_text)) else None

    for blk in blocks:

        # Code

        if blk.kind == "code":

            kind = classify_code(blk.lang or "rego", blk.text)

            bid = make_id("CODE", blk.text, length=16)

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

            out.append(

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

        # Mermaid diagram

        if blk.kind == "diagram":

            info = classify_mermaid_diagram(blk.text) if blk.lang.lower() == "mermaid" else {"diagram_type": "diagram", "tags": []}

            did = make_id("DIAGRAM", chapter.code + "::" + blk.text, length=16)

            tags_str = "[" + ", ".join(info["tags"]) + "]" if info["tags"] else "[]"

            out.append(

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

        # ASCII diagram from text

        ascii_info = detect_ascii_diagram(blk.text)

        if ascii_info:

            did = make_id("DIAGRAM", chapter.code + "::" + blk.text, length=16)

            tags_str = "[" + ", ".join(ascii_info["tags"]) + "]"

            out.append(

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

        # QA for vs heading

        if pending_qa_heading:

            qa = generate_vs_qa(pending_qa_heading, blk.text)

            qa_id = make_id("QA", pending_qa_heading + blk.text, length=16)

            out.append(

                "::: qa\n"

                f"id: {qa_id}\n"

                f"chapter: {chapter.code}\n"

                f"level: [{level_list_str}]\n"

                f"q: {qa['q']}\n"

                f"a: {qa['a']}\n"

                "reference: \"\"\n"

                ":::\n"

            )

            pending_qa_heading = None

        # Explicit common-mistake section

        if pending_mistake_heading:

            bid = make_id("MISTAKE", blk.text, length=16)

            summary = normalize_whitespace(

                pending_mistake_heading + " — " + blk.text.split(". ")[0]

            )

            out.append(

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

            pending_mistake_heading = None

            continue

        # Normal prose

        kind = classify_paragraph(blk.text)

        bid = make_id("BLK", blk.text, length=16)

        first_sentence = blk.text.split(". ")[0]

        summary = normalize_whitespace(first_sentence)

        if kind == "common-mistake":

            out.append(

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

            out.append(

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

    return out

def _walk_sections(chapter: Chapter, sections: List[SectionNode], levels: List[str]) -> List[str]:

    out: List[str] = []

    for s in sections:

        hashes = "#" * s.level

        out.append(f"{hashes} {s.title}\n")

        out.extend(_process_blocks_for_context(chapter, s.blocks, levels, heading_text=s.title))

        out.extend(_walk_sections(chapter, s.children, levels))

    return out

def convert_chapter_to_ssm(

    chapter: Chapter,

    chapter_text: str,

    prereqs_direct: List[str],

    prereqs_all: List[str],

) -> str:

    out: List[str] = []

    levels = infer_difficulty(chapter.number, chapter_text)

    level_list_str = ", ".join(levels)

    fm_yaml = _make_front_matter_yaml(chapter, levels, prereqs_direct, prereqs_all)

    prereqs_direct_str = "[" + ", ".join(prereqs_direct) + "]"

    prereqs_all_str = "[" + ", ".join(prereqs_all) + "]"

    # chapter-meta

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

    # term blocks

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

    # root blocks

    out.extend(_process_blocks_for_context(chapter, chapter.blocks, levels))

    # sections

    out.extend(_walk_sections(chapter, chapter.sections, levels))

    # explicit relations

    out.extend(extract_relations_for_chapter(chapter, chapter_text))

    return "\n".join(out)


