#!/usr/bin/env python3
"""
CLI wrapper for SSM compiler

Usage:
    python -m opa_ssm_compiler input.md output.ssm.md
"""
from __future__ import annotations

import sys
from pathlib import Path

# Import compiler
from compiler import compile_markdown_to_ssm_v3


def main():
    """CLI entry point."""
    if len(sys.argv) < 3:
        print("Usage: python -m opa_ssm_compiler <input.md> <output.ssm.md>", file=sys.stderr)
        sys.exit(1)
    
    inp = Path(sys.argv[1])
    out = Path(sys.argv[2])
    
    if not inp.exists():
        print(f"Error: Input file not found: {inp}", file=sys.stderr)
        sys.exit(1)
    
    text = inp.read_text(encoding="utf-8")
    result = compile_markdown_to_ssm_v3(text)
    out.write_text(result, encoding="utf-8")
    
    print(f"Wrote unified SSM v3 → {out}")


if __name__ == "__main__":
    main()

