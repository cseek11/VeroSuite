"""
LLM-ready Indexing & Prompt Glue (Phase 8)

Prepares SSM blocks for embedding and RAG ingestion.
"""
from __future__ import annotations

import sys
import json
import importlib.util
from typing import List, Dict, Any, Optional
from pathlib import Path

# Import structured logger
_project_root = Path(__file__).parent.parent.parent.parent.parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

logger_util_path = _project_root / ".cursor" / "scripts" / "logger_util.py"
if logger_util_path.exists():
    spec = importlib.util.spec_from_file_location("logger_util", logger_util_path)
    logger_util = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(logger_util)
    get_logger = logger_util.get_logger
    logger = get_logger("embedding_prep")
else:
    logger = None

# Add parent directory to path
indexing_dir = Path(__file__).parent.parent
if str(indexing_dir) not in sys.path:
    sys.path.insert(0, str(indexing_dir))

from modules.ast_nodes import SSMBlock


class EmbeddingChunk:
    """A chunk ready for embedding."""
    
    def __init__(
        self,
        id: str,
        type: str,
        content: str,
        metadata: Dict[str, Any]
    ):
        self.id = id
        self.type = type
        self.content = content
        self.metadata = metadata
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSONL."""
        return {
            "id": self.id,
            "type": self.type,
            "content": self.content,
            "metadata": self.metadata
        }


def prepare_for_embedding(
    blocks: List[SSMBlock],
    respect_hints: bool = True
) -> List[EmbeddingChunk]:
    """
    Prepare SSM blocks for embedding.
    
    Args:
        blocks: List of SSM blocks
        respect_hints: Whether to respect embedding_hint_* fields
        
    Returns:
        List of EmbeddingChunk objects
    """
    chunks: List[EmbeddingChunk] = []
    
    for block in blocks:
        # Get embedding hints
        importance = block.meta.get("embedding_hint_importance", "medium")
        scope = block.meta.get("embedding_hint_scope", "local")
        chunk_strategy = block.meta.get("embedding_hint_chunk", "auto")
        
        # Skip low-importance blocks if respecting hints
        if respect_hints and importance == "low":
            continue
        
        # Build content
        content_parts = []
        
        # Add metadata as text
        if block.block_type == "term":
            name = block.meta.get("name", "")
            definition = block.meta.get("definition", "")
            content_parts.append(f"Term: {name}\nDefinition: {definition}")
        elif block.block_type == "concept":
            summary = block.meta.get("summary", "")
            content_parts.append(f"Concept: {summary}")
        elif block.block_type == "code-pattern":
            pattern_type = block.meta.get("pattern_type", "")
            content_parts.append(f"Code Pattern: {pattern_type}")
        elif block.block_type == "qa":
            q = block.meta.get("q", "")
            a = block.meta.get("a", "")
            content_parts.append(f"Q: {q}\nA: {a}")
        else:
            # Use body or summary
            if block.body:
                content_parts.append(block.body)
            elif block.meta.get("summary"):
                content_parts.append(block.meta.get("summary"))
        
        content = "\n\n".join(content_parts)
        
        # Build metadata
        metadata = {
            "block_id": block.id,
            "block_type": block.block_type,
            "chapter": block.chapter or "",
            "importance": importance,
            "scope": scope,
            "chunk_strategy": chunk_strategy,
        }
        
        # Add semantic role if present
        if "semantic_role" in block.meta:
            metadata["semantic_role"] = block.meta["semantic_role"]
        
        # Add pattern type if present
        if "pattern_type" in block.meta:
            metadata["pattern_type"] = block.meta["pattern_type"]
        
        # Add symbol references if present
        if "symbol_refs" in block.meta and block.meta["symbol_refs"]:
            metadata["symbol_refs"] = block.meta["symbol_refs"]
        
        # Handle chunking strategy
        if chunk_strategy == "split" and len(content) > 1000:
            # Split large content into multiple chunks
            sentences = content.split('. ')
            current_chunk = []
            current_length = 0
            
            for sentence in sentences:
                sentence_length = len(sentence)
                if current_length + sentence_length > 1000 and current_chunk:
                    # Flush current chunk
                    chunk_content = '. '.join(current_chunk) + '.'
                    chunks.append(EmbeddingChunk(
                        id=f"{block.id}-chunk-{len(chunks)}",
                        type=block.block_type,
                        content=chunk_content,
                        metadata={**metadata, "chunk_index": len(chunks)}
                    ))
                    current_chunk = [sentence]
                    current_length = sentence_length
                else:
                    current_chunk.append(sentence)
                    current_length += sentence_length
            
            # Flush remaining
            if current_chunk:
                chunk_content = '. '.join(current_chunk) + '.'
                chunks.append(EmbeddingChunk(
                    id=f"{block.id}-chunk-{len(chunks)}",
                    type=block.block_type,
                    content=chunk_content,
                    metadata={**metadata, "chunk_index": len(chunks)}
                ))
        else:
            # Single chunk
            chunks.append(EmbeddingChunk(
                id=block.id,
                type=block.block_type,
                content=content,
                metadata=metadata
            ))
    
    return chunks


def write_jsonl(chunks: List[EmbeddingChunk], output_path: Path) -> None:
    """
    Write chunks to JSONL file.
    
    Args:
        chunks: List of EmbeddingChunk objects
        output_path: Path to output JSONL file
    """
    with open(output_path, 'w', encoding='utf-8') as f:
        for chunk in chunks:
            json.dump(chunk.to_dict(), f, ensure_ascii=False)
            f.write('\n')


def index_ssm_file(ssm_path: Path, output_path: Path) -> int:
    """
    Index an SSM file and write JSONL output.
    
    Args:
        ssm_path: Path to SSM markdown file
        output_path: Path to output JSONL file
        
    Returns:
        Number of chunks created
    """
    from modules.parser_ssm_read import parse_ssm_blocks_from_text
    
    try:
        ssm_text = ssm_path.read_text(encoding='utf-8')
        blocks = parse_ssm_blocks_from_text(ssm_text)
    except (FileNotFoundError, UnicodeDecodeError) as e:
        if logger:
            logger.error(
                "Error reading SSM file",
                operation="index_ssm_file",
                error_code="FILE_READ_ERROR",
                root_cause=str(e),
                ssm_file=str(ssm_path)
            )
        return 0
    except (AttributeError, ValueError, TypeError) as e:
        if logger:
            logger.error(
                "Error parsing SSM file",
                operation="index_ssm_file",
                error_code="PARSE_ERROR",
                root_cause=str(e),
                ssm_file=str(ssm_path)
            )
        return 0
    except Exception as e:
        if logger:
            logger.error(
                "Unexpected error parsing SSM file",
                operation="index_ssm_file",
                error_code="UNEXPECTED_ERROR",
                root_cause=str(e),
                ssm_file=str(ssm_path),
                exc_info=True
            )
        return 0
    
    if not blocks:
        if logger:
            logger.warn(
                "No blocks found in SSM file",
                operation="index_ssm_file",
                error_code="NO_BLOCKS_FOUND",
                root_cause="SSM file contains no blocks",
                ssm_file=str(ssm_path)
            )
        return 0
    
    chunks = prepare_for_embedding(blocks)
    write_jsonl(chunks, output_path)
    
    return len(chunks)

