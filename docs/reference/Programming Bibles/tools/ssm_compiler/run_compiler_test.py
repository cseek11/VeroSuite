#!/usr/bin/env python3
"""
Test script to run compiler and capture all errors
"""
import sys
import traceback
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

# Set up error logging
error_log = []

def log_error(msg):
    """Log an error message"""
    error_log.append(msg)
    print(f"ERROR: {msg}", file=sys.stderr)

try:
    # Try to import and run compiler
    # Use importlib to load compiler.py file directly (avoiding package name conflict)
    import importlib.util
    compiler_path = Path(__file__).parent / "compiler.py"
    spec = importlib.util.spec_from_file_location("compiler_v3", compiler_path)
    if spec is None or spec.loader is None:
        log_error(f"Could not create spec for {compiler_path}")
        sys.exit(1)
    compiler = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(compiler)
    
    # Check what's available in the module
    available_attrs = [a for a in dir(compiler) if not a.startswith('_')]
    log_error(f"Available attributes in compiler module: {available_attrs}")
    
    if not hasattr(compiler, 'compile_markdown_to_ssm_v3'):
        log_error(f"compile_markdown_to_ssm_v3 not found. Available functions: {[a for a in available_attrs if callable(getattr(compiler, a, None))]}")
        sys.exit(1)
    
    input_file = Path("../rego_opa_bible.md")
    output_file = Path("../rego_opa_bible_compiled.ssm.md")
    
    if not input_file.exists():
        log_error(f"Input file not found: {input_file}")
        sys.exit(1)
    
    # Read input
    text = input_file.read_text(encoding="utf-8")
    log_error(f"Read {len(text)} characters from input file")
    
    # Try to compile
    try:
        result, metadata = compiler.compile_markdown_to_ssm_v3(
            text, 
            source_file=str(input_file)
        )
        log_error(f"Compilation successful, result length: {len(result)}")
        
        # Write output
        output_file.write_text(result, encoding="utf-8")
        log_error(f"Wrote output to {output_file}")
        
        # Write error log
        log_file = Path("../compiler_errors.log")
        log_file.write_text("\n".join(error_log), encoding="utf-8")
        log_error(f"Error log written to {log_file}")
        
        print("SUCCESS: Compilation completed")
        sys.exit(0)
        
    except Exception as e:
        log_error(f"Compilation failed: {type(e).__name__}: {e}")
        log_error(f"Traceback:\n{traceback.format_exc()}")
        
        # Write error log
        log_file = Path("../compiler_errors.log")
        log_file.write_text("\n".join(error_log), encoding="utf-8")
        log_error(f"Error log written to {log_file}")
        
        sys.exit(1)
        
except ImportError as e:
    log_error(f"Import error: {e}")
    log_error(f"Traceback:\n{traceback.format_exc()}")
    
    # Write error log
    log_file = Path("../compiler_errors.log")
    log_file.write_text("\n".join(error_log), encoding="utf-8")
    log_error(f"Error log written to {log_file}")
    
    sys.exit(1)
except Exception as e:
    log_error(f"Unexpected error: {type(e).__name__}: {e}")
    log_error(f"Traceback:\n{traceback.format_exc()}")
    
    # Write error log
    log_file = Path("../compiler_errors.log")
    log_file.write_text("\n".join(error_log), encoding="utf-8")
    log_error(f"Error log written to {log_file}")
    
    sys.exit(1)

