#!/usr/bin/env python3
"""
Detailed content verification - check if actual text content is preserved
"""
import re
from pathlib import Path

def extract_unique_phrases(text, min_length=20):
    """Extract unique meaningful phrases from text"""
    # Extract sentences and meaningful phrases
    sentences = re.split(r'[.!?]\s+', text)
    phrases = []
    for sent in sentences:
        sent = sent.strip()
        if len(sent) >= min_length and not sent.startswith('#'):
            # Remove markdown formatting
            sent = re.sub(r'\*\*([^*]+)\*\*', r'\1', sent)
            sent = re.sub(r'`([^`]+)`', r'\1', sent)
            phrases.append(sent[:100])  # First 100 chars
    return set(phrases)

def extract_code_examples(text):
    """Extract code block content"""
    pattern = r'```\w*\n(.*?)```'
    examples = []
    for match in re.finditer(pattern, text, re.DOTALL):
        code = match.group(1).strip()
        # Get first 3 lines as signature
        lines = code.split('\n')[:3]
        examples.append('\n'.join(lines))
    return examples

def check_content_preservation(original_path, compiled_path):
    """Check if key content is preserved"""
    print("=" * 80)
    print("DETAILED CONTENT PRESERVATION CHECK")
    print("=" * 80)
    print()
    
    original = original_path.read_text(encoding="utf-8")
    compiled = compiled_path.read_text(encoding="utf-8")
    
    # Check key sections
    key_sections = [
        ("Preface", "Why This Book Exists"),
        ("Chapter 1", "Introduction to OPA and Rego"),
        ("Chapter 2", "Language Specification"),
        ("Chapter 18", "Rego Cheat Sheet"),
        ("Chapter 19", "Glossary"),
        ("PART I", "FOUNDATIONS"),
        ("PART II", "CORE LANGUAGE"),
    ]
    
    print("KEY SECTION VERIFICATION:")
    print("-" * 80)
    
    all_found = True
    for section_name, section_content in key_sections:
        # Check if section appears in original
        orig_has = section_name.lower() in original.lower() or section_content.lower() in original.lower()
        # Check if section appears in compiled
        comp_has = section_name.lower() in compiled.lower() or section_content.lower() in compiled.lower()
        
        status = "✅" if comp_has else "❌"
        if not comp_has:
            all_found = False
        
        print(f"{status} {section_name}: {section_content}")
        print(f"   Original: {'Found' if orig_has else 'Not found'}")
        print(f"   Compiled: {'Found' if comp_has else 'Not found'}")
        print()
    
    # Check for specific important content
    print("IMPORTANT CONTENT CHECKS:")
    print("-" * 80)
    
    important_phrases = [
        "OPA (Open Policy Agent) is a general-purpose policy decision engine",
        "Rego is a declarative logic language",
        "package http.authz",
        "allow if {",
        "opa fmt --write",
        "with input as {",
        "every item in items",
        "some role in input.user.roles",
        "contains",
        "default allow := false",
    ]
    
    for phrase in important_phrases:
        orig_count = original.count(phrase)
        comp_count = compiled.count(phrase)
        status = "✅" if comp_count >= orig_count * 0.8 else "⚠️"  # Allow 20% variance
        print(f"{status} '{phrase[:50]}...': {orig_count} → {comp_count}")
    
    # Check code examples
    print()
    print("CODE EXAMPLE VERIFICATION:")
    print("-" * 80)
    
    orig_code = extract_code_examples(original)
    comp_code = extract_code_examples(compiled)
    
    print(f"Original code blocks: {len(orig_code)}")
    print(f"Compiled code blocks: {len(comp_code)}")
    
    # Check if key code examples are preserved
    key_examples = [
        "package http.authz",
        "default allow := false",
        "allow if {",
        "import rego.v1",
    ]
    
    for example in key_examples:
        orig_has = any(example in code for code in orig_code)
        comp_has = any(example in code for code in comp_code)
        status = "✅" if comp_has else "❌"
        print(f"{status} Code example '{example}': {'Found' if comp_has else 'Missing'}")
    
    # Summary
    print()
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    
    if all_found:
        print("✅ All key sections found in compiled output")
    else:
        print("❌ Some key sections may be missing")
    
    print(f"\nOriginal: {len(original):,} chars, {len(original.splitlines()):,} lines")
    print(f"Compiled: {len(compiled):,} chars, {len(compiled.splitlines()):,} lines")
    print(f"Expansion ratio: {len(compiled) / len(original):.2f}x (expected for SSM format)")

if __name__ == "__main__":
    script_dir = Path(__file__).parent
    original = script_dir.parent / "rego_opa_bible.md"
    compiled = script_dir.parent / "rego_opa_bible_compiled.ssm.md"
    
    check_content_preservation(original, compiled)

