#!/usr/bin/env python3
"""Run full compiler and log all errors"""
import sys
import traceback
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

# Load compiler
import importlib.util
compiler_path = Path(__file__).parent / "compiler.py"
spec = importlib.util.spec_from_file_location("compiler_v3", compiler_path)
compiler = importlib.util.module_from_spec(spec)
spec.loader.exec_module(compiler)

input_file = Path("../rego_opa_bible.md")
output_file = Path("../rego_opa_bible_compiled.ssm.md")
error_log_file = Path("../compiler_errors.log")

errors_found = []

def log_error(msg):
    errors_found.append(msg)
    print(f"ERROR: {msg}", file=sys.stderr, flush=True)

print("=" * 80)
print("SSM Compiler - Full Run")
print("=" * 80)
print(f"Input: {input_file}")
print(f"Output: {output_file}")
print()

if not input_file.exists():
    log_error(f"Input file not found: {input_file}")
    sys.exit(1)

print("Reading input file...", flush=True)
text = input_file.read_text(encoding="utf-8")
print(f"Read {len(text)} characters, {len(text.splitlines())} lines", flush=True)

print("\nStarting compilation...", flush=True)
start_time = time.time()

try:
    result, metadata = compiler.compile_markdown_to_ssm_v3(
        text, 
        source_file=str(input_file)
    )
    elapsed = time.time() - start_time
    
    print(f"\nCompilation completed in {elapsed:.2f} seconds", flush=True)
    print(f"Output length: {len(result)} characters", flush=True)
    
    # Write output
    output_file.write_text(result, encoding="utf-8")
    print(f"Output written to: {output_file}", flush=True)
    
    # Write error log
    if errors_found:
        error_log_file.write_text("\n".join(errors_found), encoding="utf-8")
        print(f"\n{len(errors_found)} errors logged to: {error_log_file}", flush=True)
    else:
        print("\nNo errors found!", flush=True)
    
    # Write metadata summary
    if metadata:
        meta_file = Path("../compiler_metadata.json")
        import json
        meta_file.write_text(json.dumps(metadata, indent=2), encoding="utf-8")
        print(f"Metadata written to: {meta_file}", flush=True)
    
    print("\n" + "=" * 80)
    print("SUCCESS: Compilation completed")
    print("=" * 80)
    sys.exit(0)
    
except Exception as e:
    elapsed = time.time() - start_time
    log_error(f"Compilation failed after {elapsed:.2f} seconds: {type(e).__name__}: {e}")
    log_error(f"Traceback:\n{traceback.format_exc()}")
    
    # Write error log
    error_log_file.write_text("\n".join(errors_found), encoding="utf-8")
    print(f"\nErrors logged to: {error_log_file}", flush=True)
    
    sys.exit(1)

