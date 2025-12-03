"""
Q/A Generator Enrichment

Generates Q/A pairs from content.
"""
from __future__ import annotations

import re
from typing import List, Dict, Any
from ..ast_nodes import SSMBlock
from ..utils.hashing import sha1_id
from ..utils.text import normalize_whitespace


def clean_text(text: str, max_length: int = 500) -> str:
    """
    Clean text by removing chapter headers, markdown formatting, and excessive content.
    Works for both questions and answers.
    
    Args:
        text: Raw text
        max_length: Maximum length for cleaned text
        
    Returns:
        Cleaned text
    """
    if not text:
        return ""
    
    # Remove markdown headers (##, ###, etc.) - more aggressive
    text = re.sub(r'^#+\s+', '', text, flags=re.MULTILINE)
    text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
    
    # Remove chapter references (Chapter X, CH-XX, etc.)
    text = re.sub(r'Chapter\s+\d+\s*[–-]\s*[^\n]+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'CH-\d+', '', text)
    text = re.sub(r'Chapter\s+\d+', '', text, flags=re.IGNORECASE)
    
    # Remove emoji and special markers
    text = re.sub(r'[📘📗📙📕📓📔]', '', text)
    
    # Remove standalone "Chapter X" lines
    text = re.sub(r'^Chapter\s+\d+.*$', '', text, flags=re.MULTILINE | re.IGNORECASE)
    
    # Remove markdown list markers at start of lines
    text = re.sub(r'^[-*+]\s+', '', text, flags=re.MULTILINE)
    
    # Remove excessive whitespace and normalize
    text = normalize_whitespace(text)
    
    # Take first meaningful sentence/paragraph (up to max_length chars)
    sentences = re.split(r'[.!?]\s+', text)
    cleaned = ""
    for sent in sentences:
        sent = sent.strip()
        if len(sent) > 20:  # Skip very short fragments
            if cleaned:
                cleaned += ". "
            cleaned += sent
            if len(cleaned) > max_length:
                break
    
    # If we still have too much, truncate at last sentence
    if len(cleaned) > max_length:
        last_period = cleaned.rfind('.', 0, max_length)
        if last_period > 100:
            cleaned = cleaned[:last_period + 1]
        else:
            cleaned = cleaned[:max_length] + "..."
    
    return cleaned.strip()


def clean_answer_text(text: str) -> str:
    """
    Clean answer text by removing chapter headers, markdown formatting, and excessive content.
    
    Args:
        text: Raw answer text
        
    Returns:
        Cleaned answer text
    """
    return clean_text(text, max_length=500)


def enrich_qa(blocks: List[SSMBlock], idx: Dict[str, Any]) -> None:
    """
    Enrich blocks with Q/A pairs.
    
    Generates question/answer pairs from content:
    - "What is X?" questions
    - "How does Y work?" questions
    - "X vs Y" comparison questions
    
    Args:
        blocks: List of SSM blocks (modified in place)
        idx: Index of blocks by ID
    """
    new_qas: List[SSMBlock] = []
    seen_qa_content: Dict[str, int] = {}  # For deduplication
    
    for b in blocks:
        if b.block_type not in {"term", "concept", "fact"}:
            continue
        
        if b.block_type == "term":
            name = str(b.meta.get("name", "")).strip()
        else:
            name = str(b.meta.get("summary", "")).strip().split(":")[0]
        
        # Clean name to remove markdown headers
        name = clean_text(name, max_length=100)
        
        # Skip if name is empty, a markdown header, or chapter reference
        if not name or name.startswith('#') or 'Chapter' in name or 'CH-' in name or len(name) < 3:
            continue
        
        # avoid duplicates if a QA already mentions this name
        exists = False
        for other in blocks:
            if other.block_type == "qa":
                q = str(other.meta.get("q", "")).lower()
                if name.lower() in q:
                    exists = True
                    break
        
        if exists:
            continue
        
        q = f"What is {name} in the context of Rego/OPA?"
        
        # Clean question to remove any markdown headers that might have leaked
        q = clean_text(q, max_length=200)
        
        if b.block_type == "term":
            a = str(b.meta.get("definition", "")).strip()
        else:
            a = b.body or str(b.meta.get("summary", "")).strip()
        
        if not a:
            continue
        
        # Clean answer text to remove chapter leakage and improve quality
        a_cleaned = clean_answer_text(a)
        
        # Skip if answer is too short or just repeats the question
        if len(a_cleaned) < 20 or a_cleaned.lower() == name.lower():
            continue
        
        # Filter low-value QA: Skip if question is just "What is [title]?" for top-level titles
        # Check if name looks like a document title or heading
        if (len(name) > 50 or 
            name.count('—') > 0 or 
            name.count('–') > 0 or
            'Bible' in name or
            'Edition' in name or
            name == q.replace('What is ', '').replace(' in the context of Rego/OPA?', '')):
            # Mark as low importance instead of skipping entirely
            importance = "low"
        else:
            importance = "medium"
        
        # Deduplication: Check if we've seen this exact answer before
        answer_key = a_cleaned[:100].lower().strip()
        if answer_key in seen_qa_content:
            continue  # Skip duplicate
        seen_qa_content[answer_key] = len(new_qas)
        
        qa_id = sha1_id("QA", b.id + name)
        # Ensure chapter is set (use "GLOBAL" if missing)
        chapter = b.chapter or "GLOBAL"
        
        new_qas.append(
            SSMBlock(
                block_type="qa",
                meta={
                    "id": qa_id,
                    "chapter": chapter,
                    "q": q,
                    "a": a_cleaned,  # Use cleaned answer
                    "reference": b.id,
                    "importance": importance,  # Add importance field
                },
                body="",
                index=len(blocks) + len(new_qas),
                id=qa_id,
                chapter=chapter,  # Ensure chapter is set
            )
        )
    
    blocks.extend(new_qas)
