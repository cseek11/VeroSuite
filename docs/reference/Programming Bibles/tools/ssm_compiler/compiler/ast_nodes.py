from __future__ import annotations

from dataclasses import dataclass, field
from typing import List

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


