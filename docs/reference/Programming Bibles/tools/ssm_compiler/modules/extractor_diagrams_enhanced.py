"""
Enhanced Diagram Extractor with Enrichment

Enriches diagrams with metadata, chapter attachment, and type classification.
This is the solution for Issue 6.
"""
from __future__ import annotations

import re
from typing import List, Optional, Dict, Any
from dataclasses import dataclass

from .ast_nodes import ASTDocument, ASTNode
from .extractor_diagrams import DiagramEntry


@dataclass
class EnrichedDiagramEntry(DiagramEntry):
    """Enhanced diagram entry with metadata"""
    metadata: Dict[str, Any]
    chapter_code: Optional[str] = None
    chapter_title: Optional[str] = None
    diagram_type: Optional[str] = None  # flowchart, sequence, graph, etc.


class DiagramEnricher:
    """Enrich diagrams with metadata and chapter attachment"""

    def enrich_diagrams(
        self,
        diagrams: List[DiagramEntry],
        ast_root: ASTDocument
    ) -> List[EnrichedDiagramEntry]:
        """Enrich diagrams with chapter attachment and metadata"""
        enriched = []

        for diagram in diagrams:
            # Find parent chapter
            parent_chapter = self._find_parent_chapter(diagram, ast_root)
            
            # Extract diagram metadata
            metadata = self._extract_diagram_metadata(diagram)
            
            # Classify diagram type
            diagram_type = self._classify_diagram_type(diagram)

            # Create enriched entry
            enriched_entry = EnrichedDiagramEntry(
                lang=diagram.lang,
                code=diagram.code,
                line_no=diagram.line_no,
                type=diagram.type,
                metadata=metadata,
                chapter_code=parent_chapter.meta.get('code') if parent_chapter else None,
                chapter_title=parent_chapter.meta.get('title') if parent_chapter else None,
                diagram_type=diagram_type
            )

            enriched.append(enriched_entry)

        return enriched

    def _find_parent_chapter(
        self,
        diagram: DiagramEntry,
        ast_root: ASTDocument
    ) -> Optional[ASTNode]:
        """Find the chapter containing this diagram"""
        # Find the node at diagram's line number
        def find_node_at_line(node: ASTNode, line_no: int) -> Optional[ASTNode]:
            if node.line_no == line_no:
                return node
            for child in node.children:
                result = find_node_at_line(child, line_no)
                if result:
                    return result
            return None

        # Find diagram node
        diagram_node = None
        for node in ast_root.nodes:
            result = find_node_at_line(node, diagram.line_no)
            if result:
                diagram_node = result
                break

        if not diagram_node:
            return None

        # Traverse up to find chapter
        current = diagram_node.parent
        while current:
            if current.type == 'chapter':
                return current
            current = current.parent

        # Also check in document's chapter list
        for chapter in ast_root.get_all_chapters():
            if chapter.line_no <= diagram.line_no:
                # Check if diagram is within this chapter's range
                chapter_end = self._find_chapter_end(chapter, ast_root)
                if chapter_end and diagram.line_no <= chapter_end:
                    return chapter

        return None

    def _find_chapter_end(self, chapter: ASTNode, ast_root: ASTDocument) -> Optional[int]:
        """Find the line number where chapter ends"""
        chapters = ast_root.get_all_chapters()
        chapter_index = chapters.index(chapter) if chapter in chapters else -1
        
        if chapter_index >= 0 and chapter_index < len(chapters) - 1:
            # Next chapter starts where this one ends
            return chapters[chapter_index + 1].line_no
        
        # Last chapter - find last node
        if ast_root.nodes:
            last_node = max(ast_root.nodes, key=lambda n: n.line_no)
            return last_node.line_no
        
        return None

    def _extract_diagram_metadata(self, diagram: DiagramEntry) -> Dict[str, Any]:
        """Extract nodes, edges, and normalized content"""
        content = diagram.code
        diagram_type = diagram.type

        metadata = {
            'nodes': [],
            'edges': [],
            'normalized_content': ''
        }

        if diagram_type == 'mermaid':
            metadata = self._extract_mermaid_metadata(content)
        elif diagram_type == 'ascii':
            metadata = self._extract_ascii_metadata(content)
        elif diagram_type == 'flow':
            metadata = self._extract_flow_metadata(content)

        return metadata

    def _extract_mermaid_metadata(self, content: str) -> Dict[str, Any]:
        """Extract metadata from Mermaid diagram"""
        nodes = []
        edges = []

        # Extract nodes: "A[Label]" or "A(Label)" or "A{Label}"
        node_pattern = r'(\w+)[\[\({]([^\]\)}]+)[\]\)}]'
        for match in re.finditer(node_pattern, content):
            node_id = match.group(1)
            node_label = match.group(2)
            nodes.append({'id': node_id, 'label': node_label})

        # Extract edges: "A --> B" or "A[Label] --> B[Label]" or "A --- B"
        # Handle multi-line by processing line by line
        lines = content.split('\n')
        for line in lines:
            # Skip graph declaration line
            if line.strip().startswith('graph') or line.strip().startswith('flowchart'):
                continue
            
            # Extract edges from this line
            # Pattern: node_id (with optional brackets) --> node_id (with optional brackets)
            # First, try to match edges with brackets: "A[Label] --> B[Label]"
            edge_pattern_with_brackets = r'(\w+)(?:\[[^\]]+\]|\([^\)]+\)|\{[^\}]+\})?\s*(-->|--|\.\.->|===>|==>|->)\s*(\w+)(?:\[[^\]]+\]|\([^\)]+\)|\{[^\}]+\})?'
            for match in re.finditer(edge_pattern_with_brackets, line):
                source = match.group(1)
                edge_type = match.group(2)
                target = match.group(3)
                # Avoid duplicates
                if not any(e['source'] == source and e['target'] == target for e in edges):
                    edges.append({
                        'source': source,
                        'target': target,
                        'type': self._normalize_edge_type(edge_type)
                    })
            
            # Also try simple pattern without brackets: "A --> B"
            simple_edge_pattern = r'(\w+)\s*(-->|--|\.\.->|===>|==>|->)\s*(\w+)'
            for match in re.finditer(simple_edge_pattern, line):
                source = match.group(1)
                edge_type = match.group(2)
                target = match.group(3)
                # Avoid duplicates
                if not any(e['source'] == source and e['target'] == target for e in edges):
                    edges.append({
                        'source': source,
                        'target': target,
                        'type': self._normalize_edge_type(edge_type)
                    })

        # Generate normalized content
        normalized = self._generate_normalized_mermaid(nodes, edges)

        return {
            'nodes': nodes,
            'edges': edges,
            'normalized_content': normalized
        }

    def _extract_ascii_metadata(self, content: str) -> Dict[str, Any]:
        """Extract metadata from ASCII diagram"""
        nodes = []
        edges = []

        # Extract boxes and their content
        lines = content.split('\n')
        current_box = None

        for i, line in enumerate(lines):
            # Detect box top
            if re.search(r'[┌┬┐╔╦╗]', line):
                # Extract box content from next lines
                content_lines = []
                j = i + 1
                while j < len(lines) and not re.search(r'[└┴┘╚╩╝]', lines[j]):
                    # Extract text between box edges
                    text = re.sub(r'[│║]', '', lines[j]).strip()
                    if text:
                        content_lines.append(text)
                    j += 1

                if content_lines:
                    node_id = f"node_{len(nodes)}"
                    node_label = ' '.join(content_lines)
                    nodes.append({'id': node_id, 'label': node_label})

            # Detect arrows
            arrow_match = re.search(r'([→↓↑←]|-->|<--|\|)', line)
            if arrow_match and len(nodes) >= 2:
                # Simple heuristic: connect last two nodes
                if len(nodes) >= 2:
                    edges.append({
                        'source': nodes[-2]['id'],
                        'target': nodes[-1]['id'],
                        'type': 'directed'
                    })

        normalized = self._generate_normalized_ascii(nodes, edges)

        return {
            'nodes': nodes,
            'edges': edges,
            'normalized_content': normalized
        }

    def _extract_flow_metadata(self, content: str) -> Dict[str, Any]:
        """Extract metadata from flow diagram"""
        nodes = []
        edges = []

        # Extract flow elements: "[Box]" or "(Circle)" or "{Diamond}"
        node_pattern = r'[\[\({]([^\]\)}]+)[\]\)}]'
        for i, match in enumerate(re.finditer(node_pattern, content)):
            node_label = match.group(1)
            nodes.append({'id': f"node_{i}", 'label': node_label})

        # Extract arrows: "→" or "->" or "=>"
        arrow_pattern = r'(→|->|=>)'
        edge_positions = [m.start() for m in re.finditer(arrow_pattern, content)]

        # Connect nodes based on arrow positions
        for i in range(len(nodes) - 1):
            edges.append({
                'source': nodes[i]['id'],
                'target': nodes[i+1]['id'],
                'type': 'directed'
            })

        normalized = self._generate_normalized_flow(nodes, edges)

        return {
            'nodes': nodes,
            'edges': edges,
            'normalized_content': normalized
        }

    def _classify_diagram_type(self, diagram: DiagramEntry) -> str:
        """Classify diagram as flowchart, sequence, graph, etc."""
        content = diagram.code.lower()
        format_type = diagram.type

        if format_type == 'mermaid':
            content_no_spaces = content.replace(' ', '')
            if 'sequencediagram' in content_no_spaces:
                return 'sequence'
            elif 'graph' in content or 'flowchart' in content:
                return 'flowchart'
            elif 'classdiagram' in content_no_spaces:
                return 'class'
            elif 'statediagram' in content_no_spaces:
                return 'state'
            else:
                return 'flowchart'  # Default for mermaid

        # ASCII and flow diagrams
        if '→' in content or '->' in content or '=>' in content:
            # Has directional flow
            if '{' in content or '?' in content:
                return 'decision'  # Decision flowchart
            else:
                return 'flowchart'

        return 'diagram'  # Generic

    def _normalize_edge_type(self, edge_str: str) -> str:
        """Normalize edge type to standard names"""
        edge_map = {
            '-->': 'directed',
            '--': 'undirected',
            '---': 'undirected',
            '-.->': 'dotted',
            '===>': 'bold',
            '==>': 'bold',
            '->': 'directed'
        }
        return edge_map.get(edge_str, 'directed')

    def _generate_normalized_mermaid(self, nodes: List[Dict], edges: List[Dict]) -> str:
        """Generate normalized representation"""
        lines = ["graph TD"]

        for node in nodes:
            lines.append(f"  {node['id']}[{node['label']}]")

        for edge in edges:
            connector = '-->' if edge['type'] == 'directed' else '---'
            lines.append(f"  {edge['source']} {connector} {edge['target']}")

        return '\n'.join(lines)

    def _generate_normalized_ascii(self, nodes: List[Dict], edges: List[Dict]) -> str:
        """Generate normalized representation from ASCII"""
        lines = []
        for node in nodes:
            lines.append(f"[{node['label']}]")
        for edge in edges:
            lines.append(f"{edge['source']} -> {edge['target']}")
        return '\n'.join(lines)

    def _generate_normalized_flow(self, nodes: List[Dict], edges: List[Dict]) -> str:
        """Generate normalized representation from flow"""
        return self._generate_normalized_ascii(nodes, edges)

