#!/usr/bin/env python3
"""
Test script to run compiler with timeout and progress tracking
"""
import sys
import signal
import traceback
from pathlib import Path
import importlib.util

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

# Progress tracking
progress_log = []

def log_progress(msg):
    """Log progress message"""
    progress_log.append(msg)
    print(f"[PROGRESS] {msg}", flush=True)

def timeout_handler(signum, frame):
    """Handle timeout"""
    print("\n[TIMEOUT] Compilation timed out!", file=sys.stderr)
    print("\n".join(progress_log[-20:]), file=sys.stderr)  # Last 20 progress messages
    sys.exit(1)

# Set timeout (5 minutes)
signal.signal(signal.SIGALRM, timeout_handler)
signal.alarm(300)  # 5 minutes

try:
    log_progress("Starting compilation test")
    
    # Load compiler module directly
    log_progress("Loading compiler module...")
    compiler_path = Path(__file__).parent / "compiler.py"
    spec = importlib.util.spec_from_file_location("compiler_v3", compiler_path)
    if spec is None or spec.loader is None:
        print(f"ERROR: Could not load compiler.py from {compiler_path}", file=sys.stderr)
        sys.exit(1)
    
    compiler = importlib.util.module_from_spec(spec)
    log_progress("Executing compiler module...")
    spec.loader.exec_module(compiler)
    log_progress("Compiler module loaded successfully")
    
    # Check if function exists
    if not hasattr(compiler, 'compile_markdown_to_ssm_v3'):
        print(f"ERROR: compile_markdown_to_ssm_v3 not found", file=sys.stderr)
        print(f"Available: {[a for a in dir(compiler) if not a.startswith('_')]}", file=sys.stderr)
        sys.exit(1)
    
    log_progress("Function found, reading input file...")
    input_file = Path("../rego_opa_bible.md")
    if not input_file.exists():
        print(f"ERROR: Input file not found: {input_file}", file=sys.stderr)
        sys.exit(1)
    
    text = input_file.read_text(encoding="utf-8")
    log_progress(f"Read {len(text)} characters from input file")
    
    # Try to compile with progress tracking
    log_progress("Starting compilation...")
    try:
        result, metadata = compiler.compile_markdown_to_ssm_v3(
            text, 
            source_file=str(input_file)
        )
        log_progress(f"Compilation successful, result length: {len(result)}")
        
        # Write output
        output_file = Path("../rego_opa_bible_compiled.ssm.md")
        output_file.write_text(result, encoding="utf-8")
        log_progress(f"Wrote output to {output_file}")
        
        # Write progress log
        log_file = Path("../compiler_progress.log")
        log_file.write_text("\n".join(progress_log), encoding="utf-8")
        log_progress(f"Progress log written to {log_file}")
        
        # Cancel timeout
        signal.alarm(0)
        
        print("SUCCESS: Compilation completed")
        sys.exit(0)
        
    except Exception as e:
        signal.alarm(0)  # Cancel timeout
        print(f"ERROR: Compilation failed: {type(e).__name__}: {e}", file=sys.stderr)
        print(f"Traceback:\n{traceback.format_exc()}", file=sys.stderr)
        
        # Write progress log
        log_file = Path("../compiler_progress.log")
        log_file.write_text("\n".join(progress_log), encoding="utf-8")
        print(f"Progress log written to {log_file}", file=sys.stderr)
        
        sys.exit(1)
        
except ImportError as e:
    signal.alarm(0)
    print(f"ERROR: Import error: {e}", file=sys.stderr)
    print(f"Traceback:\n{traceback.format_exc()}", file=sys.stderr)
    sys.exit(1)
except Exception as e:
    signal.alarm(0)
    print(f"ERROR: Unexpected error: {type(e).__name__}: {e}", file=sys.stderr)
    print(f"Traceback:\n{traceback.format_exc()}", file=sys.stderr)
    sys.exit(1)

