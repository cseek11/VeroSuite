#!/usr/bin/env python3
"""Quick test to see where compiler stalls"""
import sys
import importlib.util
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

# Load compiler
compiler_path = Path(__file__).parent / "compiler.py"
spec = importlib.util.spec_from_file_location("compiler_v3", compiler_path)
compiler = importlib.util.module_from_spec(spec)
spec.loader.exec_module(compiler)

# Read small test input
input_file = Path("../rego_opa_bible.md")
text = input_file.read_text(encoding="utf-8")[:10000]  # First 10k chars only

print("Starting compilation with small input...", flush=True)
result, metadata = compiler.compile_markdown_to_ssm_v3(text, source_file=str(input_file))
print(f"Success! Output length: {len(result)}", flush=True)

