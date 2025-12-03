<!-- SSM:CHUNK_BOUNDARY id="ch03-start" -->
📘 CHAPTER 3 — CORE EXECUTION MODEL 🟡 Intermediate

Depth Level: 3 (Comprehensive)
Python Versions Covered: 3.8–3.14+
Prerequisites: Chapters 1–2

3.0 Overview

This chapter provides a deep, formal understanding of:

How Python processes, compiles, and executes code

The token → AST → bytecode → execution cycle

Frames, namespaces, and scope resolution mechanics

How functions, classes, modules, and scripts load

The role of the CPython virtual machine

The import system (including caching via sys.modules)

__pycache__ and .pyc bytecode files

Optimization flags and effects

Execution contexts, globals, locals

How Python finds modules via sys.path

How __name__ == "__main__" actually works

Evaluation order and stack frames

3.13+ JIT tiers and 3.14+ free-threading impact

Understanding this chapter is essential before learning:

OOP

async/await

multiprocessing

performance optimization

packaging

import complexity

debugging and profiling

3.1 From Source File to Running Program

Python executes code in a multi-stage pipeline, not line-by-line.

**Complete Execution Pipeline:**

```mermaid
flowchart TD
    Source[Source Code<br/>hello.py] --> Tokenization[1. TOKENIZATION<br/>Tokenizer converts characters → tokens<br/>Example: def → NAME, ( → LPAR, x → NAME]
    
    Tokenization --> Parsing[2. PARSING PEG Parser<br/>Tokens → Abstract Syntax Tree AST<br/>Example: FunctionDef name='greet', args=[...]]
    
    Parsing --> ASTOpt[3. AST OPTIMIZATION<br/>Constant folding, dead code elimination<br/>Example: 2 + 3 → 5 compile-time]
    
    ASTOpt --> Bytecode[4. BYTECODE COMPILATION<br/>AST → Bytecode instructions<br/>Example: LOAD_FAST, CALL_FUNCTION, RETURN_VALUE]
    
    Bytecode --> ByteOpt[5. BYTECODE OPTIMIZATION Peephole<br/>Dead jump removal, constant tuple building<br/>Example: JUMP_IF_FALSE → removed if always true]
    
    ByteOpt --> CodeObj[6. CODE OBJECT CREATION<br/>Bytecode + metadata → code object<br/>Stored in: __pycache__/hello.cpython-313.pyc]
    
    CodeObj --> Execution[7. EXECUTION CPython VM]
    
    Execution --> Tier0[Tier 0: Baseline Interpreter<br/>Standard bytecode execution]
    
    Tier0 -->|hot code detected| Tier1[Tier 1: Adaptive Interpreter 3.11+<br/>Specialized opcodes<br/>Type-specific optimizations]
    
    Tier1 -->|very hot code, 3.13+| Tier2[Tier 2: JIT Compiler 3.13+ experimental<br/>Copy-and-patch JIT<br/>Native machine code]
    
    Tier0 --> Runtime[Runtime Execution<br/>Frame objects, stack, namespaces]
    Tier1 --> Runtime
    Tier2 --> Runtime
    
    style Source fill:#e1f5ff
    style Runtime fill:#fff4e1
    style Tier0 fill:#ffe1f5
    style Tier1 fill:#e1ffe1
    style Tier2 fill:#ffe1e1
```

**Stages:**

1. **Read source file (.py)**: Python reads the source file from disk
2. **Tokenize**: Convert character stream to token stream
3. **Parse (PEG parser)**: Convert tokens to Abstract Syntax Tree (AST)
4. **AST construction**: Build tree structure representing code semantics
5. **Bytecode compilation**: Convert AST to bytecode instructions
6. **Write .pyc file to __pycache__**: Cache compiled bytecode for faster subsequent runs
7. **Interpreter executes bytecode**: CPython VM executes bytecode instructions
8. **Optionally JIT-optimized (3.13+)**: Hot code paths compiled to native machine code

*See Appendix G → G.2.1 for additional memory layout and frame structure diagrams.*

**Example: Complete Transformation Pipeline**

Source code:
```python
def add(a, b):
    return a + b
```

**1. Tokenization:**
```python
import tokenize
from io import BytesIO

code = b"def add(a, b):\n    return a + b"
for token in tokenize.tokenize(BytesIO(code).readline):
    print(f"{token.type:15} {token.string:20} {token.start} → {token.end}")
```

Output:
```
NAME            def                  (1, 0) → (1, 3)
NAME            add                  (1, 4) → (1, 7)
OP              (                    (1, 7) → (1, 8)
NAME            a                    (1, 8) → (1, 9)
OP              ,                    (1, 9) → (1, 10)
NAME            b                    (1, 10) → (1, 11)
OP              )                    (1, 11) → (1, 12)
OP              :                    (1, 12) → (1, 13)
NEWLINE         \n                   (1, 13) → (1, 14)
INDENT          \n    \n             (2, 0) → (2, 4)
NAME            return               (2, 4) → (2, 10)
NAME            a                    (2, 11) → (2, 12)
OP              +                    (2, 13) → (2, 14)
NAME            b                    (2, 15) → (2, 16)
NEWLINE         \n                   (2, 16) → (2, 17)
DEDENT          \n                   (3, 0) → (3, 0)
ENDMARKER       \n                   (3, 0) → (3, 0)
```

**2. AST (Abstract Syntax Tree):**
```python
import ast

tree = ast.parse("def add(a, b):\n    return a + b")
print(ast.dump(tree, indent=2))
```

Output:
```python
Module(
  body=[
    FunctionDef(
      name='add',
      args=arguments(
        posonlyargs=[],
        args=[
          arg(arg='a'),
          arg(arg='b')
        ],
        kwonlyargs=[],
        kw_defaults=[],
        defaults=[]
      ),
      body=[
        Return(
          value=BinOp(
            left=Name(id='a', ctx=Load()),
            op=Add(),
            right=Name(id='b', ctx=Load())
          )
        )
      ],
      decorator_list=[]
    )
  ]
)
```

**3. Bytecode (Actual CPython Output):**
```python
import dis

def add(a, b):
    return a + b

dis.dis(add)
```

Output:
```
  2           0 LOAD_FAST                0 (a)
              2 LOAD_FAST                1 (b)
              4 BINARY_ADD
              6 RETURN_VALUE
```

**Bytecode Explanation:**

- `LOAD_FAST 0 (a)`: Load local variable `a` (index 0 in fast locals array)
- `LOAD_FAST 1 (b)`: Load local variable `b` (index 1 in fast locals array)
- `BINARY_ADD`: Pop two values from stack, add them, push result
- `RETURN_VALUE`: Pop value from stack and return it

**Try This:** Inspect bytecode for different operations:
```python
import dis

# Compare different operations
dis.dis(lambda x: x + 1)      # Simple addition
dis.dis(lambda x: x * 2)      # Multiplication
dis.dis(lambda x: x if x > 0 else 0)  # Conditional
```

3.2 Tokenization

The tokenizer converts raw characters to tokens.

Inspect tokens:

import tokenize
from io import BytesIO

code = b"1 + 2 * 3"
print(list(tokenize.tokenize(BytesIO(code).readline)))


Output includes:

NUMBER

OP

NEWLINE

INDENT

DEDENT

ENDMARKER

This is the basis for syntax errors.

3.3 Parsing (PEG Parser)

Python 3.9+ replaced the LL(1) parser with a PEG parser:

Benefits:

simpler grammar

fewer parsing restrictions

allows new syntax like pattern matching

fewer “ambiguous grammar” errors

The PEG parser constructs a tree of AST nodes.

3.4 Abstract Syntax Tree (AST)

AST represents the syntactic structure.

Example:

import ast
print(ast.dump(ast.parse("x = 1 + 2"), indent=4))


Output:

Module(
    body=[
        Assign(
            targets=[Name(id='x')],
            value=BinOp(
                left=Constant(1),
                op=Add(),
                right=Constant(2)
            )
        )
    ]
)


Used by:

linters

formatters

transpilers

JIT optimizers

static analysis tools

3.5 Bytecode Compilation

The AST is compiled to bytecode, a list of VM instructions.

Use dis:

import dis

def add(a, b):
    return a + b

dis.dis(add)


Common opcodes:

LOAD_FAST

STORE_FAST

LOAD_GLOBAL

BINARY_ADD

RETURN_VALUE

CALL / CALL_FUNCTION (3.11 has new CALL opcodes)

3.6 The CPython Execution Loop (Interpreter)

CPython is a stack-based virtual machine.

Execution logic (simplified):

while True:
    instruction = next_bytecode
    execute instruction
    manipulate stack


Stack-based example:

LOAD_FAST a
LOAD_FAST b
BINARY_ADD
RETURN_VALUE


Internally:

values pushed/popped from the VM stack

locals stored in frame objects

execution context preserved in a stack of frames

3.7 Frame Objects & Namespaces

Each function call creates a frame:

import inspect

def f(a):
    frame = inspect.currentframe()
    print(frame.f_locals)

f(10)


Output:

{'a': 10}

A frame contains:

locals (f_locals)

globals (f_globals)

builtins (f_builtins)

bytecode instruction pointer

evaluation stack

closure cell references

Understanding frames is essential for:

debugging

tail recursion limits

closures

context managers

async/await internals

3.8 The Import System (Critical Topic)

Python’s module loader is one of its most misunderstood subsystems.

Import phases:

Check sys.modules cache

Find module (via sys.meta_path)

Load and execute module

Store module object in sys.modules

Import returns the module object

**Import Machinery Flow:**

```mermaid
flowchart TD
    Start[import mymodule] --> Step1[STEP 1: Check sys.modules cache<br/>if 'mymodule' in sys.modules:<br/>    return sys.modules['mymodule']  # Already loaded]
    
    Step1 -->|found| Return[Return cached module]
    Step1 -->|not found| Step2[STEP 2: Iterate sys.meta_path finders]
    
    Step2 --> Finder1[1. BuiltinImporter<br/>Checks built-in modules<br/>Examples: sys, builtins]
    
    Finder1 -->|not found| Finder2[2. FrozenImporter<br/>Checks frozen modules<br/>Examples: _frozen_importlib]
    
    Finder2 -->|not found| Finder3[3. PathFinder<br/>Searches sys.path<br/>Uses SourceFileLoader, etc.]
    
    Finder3 -->|finder returns ModuleSpec| Step3[STEP 3: Create ModuleSpec<br/>spec = ModuleSpec(<br/>    name='mymodule',<br/>    loader=SourceFileLoader...,<br/>    origin='/path/to/mymodule.py',<br/>    submodule_search_locations=None<br/>)]
    
    Step3 --> Step4[STEP 4: Loader.exec_module spec]
    
    Step4 --> Loader1[SourceFileLoader:<br/>1. Read .py file<br/>2. Compile to bytecode<br/>3. Execute bytecode<br/>4. Create module object]
    
    Step4 --> Loader2[ExtensionFileLoader:<br/>1. Load .so/.pyd file<br/>2. Initialize module]
    
    Step4 --> Loader3[NamespaceLoader:<br/>1. Create namespace package<br/>2. Set __path__]
    
    Loader1 --> Step5[STEP 5: Store in sys.modules<br/>sys.modules['mymodule'] = module_object]
    Loader2 --> Step5
    Loader3 --> Step5
    
    Step5 --> Step6[STEP 6: Module code executed<br/>Top-level code runs<br/>Functions/classes defined<br/>Module-level variables assigned]
    
    Step6 --> Return
    
    style Start fill:#e1f5ff
    style Step1 fill:#ffe1f5
    style Step2 fill:#e1ffe1
    style Step3 fill:#fff4e1
    style Step4 fill:#ffe1e1
    style Step5 fill:#e1f5ff
    style Step6 fill:#ffe1f5
    style Return fill:#e1ffe1
```
         ▼
    Return module object

**Key Points:**

- `sys.modules` acts as a cache (prevents re-importing)
- `sys.meta_path` contains finders (BuiltinImporter, FrozenImporter, PathFinder)
- `ModuleSpec` contains all metadata about a module
- Loaders execute the module code
- Module is stored in `sys.modules` before execution completes

*See Appendix G → G.4.1 for additional details.*

3.8.1 Module Search Path (sys.path)

Python looks for modules in:

Directory of running script

PYTHONPATH

Site-packages

Built-in modules

Inspect:

import sys
print(sys.path)

3.8.2 sys.modules: The Global Module Cache

Key fact:

A module is executed once.
All future imports return the cached object.

Example:

import sys
print(sys.modules["sys"])


Important for:

hot reloading

circular import debugging

plugin systems

3.9 __pycache__ and .pyc Files

When Python imports a module:

It compiles bytecode

Writes .pyc to __pycache__

Example file:

example.cpython-311.pyc


Contains:

magic number

timestamp

bytecode

To disable bytecode generation:

PYTHONDONTWRITEBYTECODE=1 python app.py

3.10 Execution Modes
3.10.1 Running as script

python script.py
Executes file as __main__.

3.10.2 Running as module

python -m package.module

3.10.3 Running in REPL/interactive

IPython, Jupyter, Python Shell.

3.11 __name__ == "__main__" Explained

This idiom controls whether code runs during:

script execution

module import

def main():
    print("running")

if __name__ == "__main__":
    main()


Flow:

Running as script

__name__ = "__main__"

Imported as module

__name__ = "<module_name>"

Use cases:

CLI entrypoints

Prevent code from running unintentionally

Testing reusable modules

3.12 Optimization Levels

Run Python optimized:

python -O script.py
python -OO script.py


Effects:

removes assert statements

removes docstrings

creates .opt-1.pyc / .opt-2.pyc

⚠️ Do not rely on assert for production validation.

3.13 CPython 3.11+ Performance Model

3.11 introduced:

adaptive specializing interpreter

zero-cost exception handling

improved bytecode

inline caching

faster function calls

drastically faster async execution

Performance gain:
10%–60% faster without changing code.

**See also:** 
- Chapter 8 (Modules & Imports) for how modules are loaded and cached during execution
- Chapter 12 (Performance) for optimization techniques that leverage Python's execution model
- Chapter 27 (CPython Internals) for deep dive into bytecode and the evaluation loop

3.14 CPython 3.13–3.14+ JIT & Free-Threading

3.13: Tier 2 JIT (Copy-and-Patch, Experimental)

⚠️ Important: Python 3.13 introduces an optional, experimental JIT compiler enabled at build time (`--enable-experimental-jit`). The implementation is a copy-and-patch JIT (PEP 744), not LLVM-based.

Architecture:

Tier 0: Baseline interpreter (standard bytecode execution)

Tier 1: Adaptive interpreter (specialized opcodes based on runtime types)

Tier 2: Copy-and-patch JIT (experimental, 3.13+)

How Copy-and-Patch Works:

CPython still uses the regular bytecode interpreter as tier 0.

"Hot" regions of bytecode are compiled by stitching together pre-generated machine code templates.

The JIT patches constants, jump targets, and metadata at runtime.

This design minimizes compile overhead and complexity, in exchange for more modest optimization compared with full SSA/LLVM-style JITs.

No IR → machine code pipeline like LLVM; instead, templates are copied and patched.

Adaptive thresholds determine when to promote code to JIT tier.

Performance: Real-world benchmarks show 5–15% speedups on pyperformance, with larger gains on tight numeric/control-flow heavy code and negligible benefits for I/O-bound or extension-heavy workloads.

Enable with: `PYTHON_JIT=1 python script.py`

3.14: Free-threading Mode

⚠️ Experimental: Free-threading is a build-time optional feature in 3.13+ (e.g., `python3.13t`, or `--disable-gil` when building from source).

Use:

python3.13t script.py  # or python3.13 --disable-gil script.py


True parallelism for Python threads, but:

Higher per-object synchronization cost; single-threaded code may slow down.

Many C extensions assume the GIL and must be audited or ported.

In 3.14+, PEP 779 moves free-threading toward "supported but not default" status.

Compatibility issues:

C-extension libraries may not be thread-safe without GIL

Performance degradation possible for CPU-bound single-threaded code

Interpreter lock internal redesign required

Immortal objects stabilization not complete

Frame semantics changes

Reality Check: Free-Threading in Production

Safe to experiment in CPU-bound, thread-friendly workloads you control

Don't assume drop-in gains; measure with pyperformance & your own load tests

This will eventually reshape Python's performance landscape.

3.15 Mini Example — Inspecting Execution
import dis

def compute(x):
    return x * 2 + 3

print(dis.dis(compute))


Teaches:

how to read bytecode

what optimizations Python performs

3.16 Mini Example — Import Behavior

Directory:

app/
  main.py
  util.py


**Example: Import Caching via sys.modules**

util.py:

```python
print("util imported")
x = 10
y = 20

def helper():
    return "helper function"
```

main.py:

```python
import sys
import util

# First import: module is loaded and cached
print(f"util in sys.modules: {'util' in sys.modules}")
# Output: util in sys.modules: True

# Second import: returns cached module (no re-execution)
import util  # No "util imported" printed again

# Verify it's the same object
import util as util2
print(f"Same object: {util is util2}")
# Output: Same object: True

# Access cached module directly
cached_util = sys.modules['util']
print(f"Direct access: {cached_util.x}")
# Output: Direct access: 10

# All references point to same module
print(f"All same: {util is util2 is cached_util}")
# Output: All same: True
```

**Output:**

```
util imported
util in sys.modules: True
Same object: True
Direct access: 10
All same: True
```

**Key Points:**

1. **First import:** Module code executes, module object created and stored in `sys.modules`
2. **Subsequent imports:** Python checks `sys.modules` first, returns cached module without re-execution
3. **Same object:** All import statements return the same module object (singleton behavior)
4. **Direct access:** Can access cached modules via `sys.modules['module_name']`

**Try This:** Experiment with import caching:

```python
import sys

# Clear module cache (for testing only - dangerous in production!)
if 'util' in sys.modules:
    del sys.modules['util']

# Now import will execute code again
import util  # "util imported" printed again
```

**See also:** 
- Chapter 3.1 (Execution Model) for how Python loads and executes modules
- Chapter 3.17 (Module Loader) for custom module loading examples
- Chapter 11.12 (Circular Imports) for architectural solutions

3.17 Macro Example — Simple Module Loader
import importlib
import sys
from pathlib import Path

def load_module(path: str, name: str):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module

# usage
m = load_module("config.py", "config")
print(m)


Demonstrates:

module specs

loaders

sys.modules

custom loading workflow

This is how plugin systems work.

3.18 Pitfalls & Warnings

⚠️ Circular imports
⚠️ Mutable module-level state
⚠️ Overusing import *
⚠️ Confusing script vs module execution
⚠️ Using assert for runtime checks
⚠️ Modifying sys.path directly
⚠️ Relying on bytecode-only releases

Full treatment in Appendix D.

3.19 Summary & Takeaways

Python compiles source to bytecode before running

The interpreter is a stack machine

Frames model execution state

Imports are cached in sys.modules

.pyc files improve startup speed

JIT and free-threading are transforming performance

Understanding execution model leads to better debugging, testing, and performance tuning

3.20 Next Chapter

Proceed to:

👉 Chapter 4 — Types & Type System

Where you’ll learn:

data model

dunder methods

protocols

Self

TypeAlias

NewType

generics

type narrowing

ABCs

the entire Python type lattice



Depth Level: 3 (Comprehensive)
Length Equivalent: 10–15 pages
Versions Covered: 3.8 → 3.14+
