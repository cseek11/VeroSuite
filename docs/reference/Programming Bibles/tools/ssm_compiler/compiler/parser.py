from __future__ import annotations

from typing import List, Optional

from .ast_nodes import Block, SectionNode, Chapter

from .utils import HEADING_RE, PART_RE, CHAPTER_RE, CODE_FENCE_RE, make_id, looks_like_hr

def parse_document(md: str) -> List[Chapter]:
    """
    Streaming markdown parser:

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

        if looks_like_hr(blk.text):

            return

        if stack:

            stack[-1].blocks.append(blk)

        else:

            ch.blocks.append(blk)

    def flush_text_block(current_line: int):

        nonlocal pending_text_lines, text_start_line

        if pending_text_lines and current_chapter is not None:

            text = "\n".join(pending_text_lines).rstrip()

            if text.strip() and not looks_like_hr(text):

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

        for sec in section_stack:

            if sec.line_end == 0:

                sec.line_end = last_line

    for idx, line in enumerate(lines, start=1):

        # === inside fenced code ===

        if inside_code:

            # Fence close?

            m_close = CODE_FENCE_RE.match(line)

            if m_close and line.startswith(code_fence[0] * len(code_fence)):

                inside_code = False

                fence_end_line = idx

                code_text = "\n".join(code_lines)

                if current_chapter is not None:

                    kind = "diagram" if code_lang.lower() == "mermaid" else "code"

                    blk = Block(

                        kind=kind,

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

        # === not inside code ===

        # PART heading

        m_part = PART_RE.match(line)

        if m_part:

            flush_text_block(idx)

            current_part_title = f"PART {m_part.group(1).strip()} — {m_part.group(2).strip()}"

            continue

        # CHAPTER heading
        # Only accept if:
        # 1. It's a level-2 heading (## Chapter X)
        # 2. OR it's a standalone line (no ##) that appears after a blank line or section break
        m_ch = CHAPTER_RE.match(line)
        if m_ch:
            # Check if it's a level-2 heading
            is_level2_heading = line.startswith("##")
            
            # Check context: previous line should be blank or a section break
            prev_line_idx = idx - 2  # idx is 1-based, lines is 0-based
            prev_line = lines[prev_line_idx] if prev_line_idx >= 0 else ""
            has_good_context = (
                prev_line.strip() == "" or
                looks_like_hr(prev_line) or
                prev_line_idx < 0  # Start of file
            )
            
            # Only accept if it's a level-2 heading OR has good context
            if is_level2_heading or has_good_context:
                flush_text_block(idx)
                close_chapter(idx - 1)
                
                chapter_num = int(m_ch.group(1))
                chapter_title = m_ch.group(2).strip()
                
                # Skip if this chapter number was already seen (duplicate)
                if any(ch.number == chapter_num for ch in chapters):
                    continue
                
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

        # Code fence start

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

            # Skip PART/CHAPTER, they're already handled

            if PART_RE.match(line) or CHAPTER_RE.match(line):

                continue

            if current_chapter is None:

                continue

            sec_id = make_id("SEC", f"{current_chapter.code}:{level}:{heading_text}")

            sec = SectionNode(

                level=level,

                title=heading_text,

                id=sec_id,

                line_start=idx,

            )

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

        # Blank line

        if line.strip() == "":

            flush_text_block(idx)

            continue

        # Normal text line

        if current_chapter is None:

            continue

        if not pending_text_lines:

            text_start_line = idx

        pending_text_lines.append(line)

    # End of file

    flush_text_block(len(lines) + 1)

    close_chapter(len(lines))

    return chapters

