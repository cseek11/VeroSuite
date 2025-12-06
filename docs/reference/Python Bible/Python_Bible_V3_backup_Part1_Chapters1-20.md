CHAPTER 1 — INTRODUCTION TO PYTHON

Depth Level: 3 (Comprehensive)
Python Versions Covered: 3.8–3.14+

📚 Python Bible Learning Roadmap

```
┌─────────────────────────────────────────────────────────────┐
│                    BEGINNER PATH                            │
│  Ch. 1 → Ch. 2 → Ch. 4 → Ch. 5 → Ch. 6 → Ch. 7            │
│  (Intro) (Syntax) (Types) (Control) (Functions) (OOP)      │
│                                                             │
│  Focus: Core language, basic data structures, functions     │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                  INTERMEDIATE PATH                          │
│  Ch. 8 → Ch. 9 → Ch. 10 → Ch. 11 → Ch. 14                 │
│  (Modules) (Stdlib) (Errors) (Arch) (Testing)              │
│                                                             │
│  Focus: Project structure, error handling, testing          │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                    ADVANCED PATH                            │
│  Ch. 12 → Ch. 13 → Ch. 16 → Ch. 17 → Ch. 19                │
│  (Perf) (Security) (Concurrency) (Meta) (Web)              │
│                                                             │
│  Focus: Performance, security, async, metaprogramming       │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                 SPECIALIST PATHS                            │
│                                                             │
│  Systems Programming:                                       │
│    Ch. 27 (Internals) → Ch. 28 (Implementations)           │
│                                                             │
│  Backend Development:                                       │
│    Ch. 19 (Web) → Ch. 20 (Data) → Ch. 21 (Eng)             │
│                                                             │
│  Performance Engineering:                                   │
│    Ch. 12 (Perf) → Ch. 27 (Internals) → Ch. 28 (PyPy)      │
│                                                             │
│  Architecture & Design:                                    │
│    Ch. 11 (Arch) → Ch. 17 (Meta) → Appendix A (Patterns)    │
└─────────────────────────────────────────────────────────────┘
```

Quick Start: Want code immediately? Jump to Ch. 2.2.3 for your first working example, then return here for context.

1.1 What Python Is (and Is Not)

Python is a high-level, general-purpose programming language emphasizing:

readability

expressiveness

rapid development

huge ecosystem support

interoperability with C, Rust, and other runtimes

batteries-included standard library

dynamic + optionally statically-typed workflow

Python is designed so developers can think about ideas rather than ceremony, making it one of the most effective languages for:

scripting

web backends

data engineering

AI/ML workloads

automation

rapid prototyping

infrastructure tooling

But Python also powers:
operating system components, distributed systems, servers, compilers, and even embedded devices.

1.2 Why Python Matters (2025+)

Python continues to dominate because:

✔ AI & ML ecosystem is unmatched

NumPy, PyTorch, TensorFlow, JAX, Polars, Pandas, etc.

✔ Data engineering & analytics

Polars, Pandas, DuckDB, PySpark, Apache Arrow.

✔ Web frameworks are world-class

FastAPI, Django, Starlette.

✔ High-performance via extensions

Cython

PyO3 / Rust

Numba

GraalPython

CPython 3.11+ specialization

3.13+ tiered JIT

3.14+ free-threading mode

✔ Excellent for automation

Scripting, DevOps, CI/CD, infra-as-code.

✔ Strong typing story

Python 3.10–3.14 introduced:

structural typing

ParamSpec

Self

override

new generic syntax (PEP 695)

broad editor + LSP support

1.3 Python’s Design Philosophy (The Zen of Python)

View it directly:

import this


Key philosophies:

Readability counts.

Simple is better than complex.

Explicit is better than implicit.

There should be one—and preferably only one—obvious way to do it.

If the implementation is hard to explain, it’s a bad idea.

Throughout this book, these principles guide best practices.

1.4 How Python Runs Your Code

Python is:

interpreted (executed by the CPython interpreter)

bytecode compiled (source → bytecode → executed)

dynamically typed (type checks at runtime)

hybrid binding model: early binding for locals (compile-time via LOAD_FAST), late binding for globals and closures (runtime via LOAD_GLOBAL/LOAD_DEREF)

object-oriented (everything is an object)

Diagram Reference

See Appendix G → G.2.1 “Source → Bytecode → Execution” for a full interpreter pipeline flow.

Core stages:

Tokenization

Parsing (PEG parser)

AST generation

Bytecode compilation

Execution by CPython VM

Optional JIT tiers (3.13+ experimental)

1.5 Python Implementations
1.5.1 CPython (default, reference implementation)

Written in C

Most widely used

Best compatibility

3.11+: huge speed jumps (PEP 659)

3.13+: tiered JIT

3.14+: optional free-threading

1.5.2 PyPy

JIT-compiled Python

Great for long-running, pure-Python workloads

Very fast loops

Sometimes incompatible with CPython C-extensions

1.5.3 MicroPython & CircuitPython

Tiny footprint

Designed for embedded devices

Limited stdlib

1.5.4 Jython, IronPython, GraalPython

Jython → Java ecosystem

IronPython → .NET

GraalPython → Polyglot on GraalVM, extremely fast for some workloads

1.6 When You Should (and Shouldn't) Use Python

1.6.0 Quick Start: Your First Python Program

Before diving into theory, let's write working code:

```python
# hello.py
def greet(name: str) -> str:
    """Return a personalized greeting."""
    return f"Hello, {name}!"

if __name__ == "__main__":
    print(greet("Python"))
    # Output: Hello, Python!
```

Run it:

```bash
python hello.py
# Output: Hello, Python!
```

Try This: Modify the function to accept an optional title parameter.

```python
def greet(name: str, title: str = "") -> str:
    """Return a personalized greeting with optional title."""
    if title:
        return f"Hello, {title} {name}!"
    return f"Hello, {name}!"

print(greet("Smith", "Dr."))
# Output: Hello, Dr. Smith!
```

Now you've written Python code! The rest of this chapter provides context for why Python works this way.

✔ Excellent Use Cases

Data Science & ML

Scripting & automation

API services (FastAPI, Django)

Data engineering pipelines

Prototyping / rapid iteration

Developer tooling

Infrastructure scripting

CLI utilities

Education

❌ Less Ideal

Low-latency systems (C++/Rust preferred)

Real-time embedded control

Extremely high-throughput microservices where GC and interpreter overhead matter

GPU kernels (use Python wrappers but write kernels in CUDA/Numba)

1.7 Setting Up Your Python Environment (2025+)
1.7.1 Choose Your Python Version

Recommended:

Python 3.12 or 3.13
(3.14 optional-runtime for free-threading)

Install via pyenv, asdf, or the official installer.

1.7.2 Create a Virtual Environment
python3 -m venv .venv
source .venv/bin/activate     # Unix
.\.venv\Scripts\activate      # Windows


or modern alternatives:

uv (Rust-based, extremely fast)

rye

pipx for global tool isolation

1.7.3 Install Core Tools
pip install \
    black \
    ruff \
    mypy \
    pytest \
    httpx \
    rich

1.8 A Tour of Python via Examples

This section gives newcomers a taste of the syntax.

1.8.1 Micro Example — Variables & Expressions
name = "Alice"
age = 30
message = f"{name} is {age} years old."
print(message)

1.8.2 Mini Example — Working with Collections
users = [
    {"id": 1, "active": True},
    {"id": 2, "active": False},
]

active_users = [u for u in users if u["active"]]

print(active_users)

1.8.3 Mini Example — Functions & Decorators
from functools import lru_cache

@lru_cache(maxsize=256)
def fib(n: int) -> int:
    if n < 2:
        return n
    return fib(n-1) + fib(n-2)

print(fib(10))

1.8.4 Macro Example — Simple CLI App
#!/usr/bin/env python3
"""
Simple Task Manager CLI
"""

from __future__ import annotations
from pathlib import Path
import json
import sys

TASKS_FILE = Path("tasks.json")


def load_tasks() -> list[str]:
    if TASKS_FILE.exists():
        return json.loads(TASKS_FILE.read_text())
    return []


def save_tasks(tasks: list[str]) -> None:
    TASKS_FILE.write_text(json.dumps(tasks, indent=2))


def main() -> int:
    tasks = load_tasks()

    if len(sys.argv) < 2:
        print("Usage: task add <name> | task list")
        return 1

    command = sys.argv[1]

    if command == "add":
        name = " ".join(sys.argv[2:])
        tasks.append(name)
        save_tasks(tasks)
        print("Added:", name)

    elif command == "list":
        for i, t in enumerate(tasks, start=1):
            print(f"{i}. {t}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())


Highlights:

pathlib

JSON

sys.argv parsing

Clean project structure

Teaser for Modules (Chapter 8)

1.9 Common Beginner Pitfalls (Preview)

(Some later covered in Appendix D)

1. Mutable default arguments
2. Closing files improperly
3. Misusing is vs ==
4. Modifying lists while iterating
5. Shadowing built-in names
6. Forgetting virtual environments
7. Using Python lists for heavy numerical workloads

Each will have deeper treatment later.

1.10 Python Version Compatibility (3.8 → 3.14)

Python 3.10–3.14 introduced profound enhancements:

structural pattern matching

Self, ParamSpec, TypeVarTuple

TaskGroup (async)

ExceptionGroup

new generic syntax

immortal objects / free-threading groundwork

tiered JIT (3.13)

optional GIL removal (3.14+)

See Appendix E.

1.11 Summary & Key Takeaways

Python is a readable, expressive, versatile language.

CPython is the reference implementation.

Execution = tokenization → AST → bytecode → interpreter.

Everything is an object.

Python is dynamic but now strongly supports optional static typing.

Python 3.11+ brought radical performance gains.

Virtual environments are essential.

You’ve now seen enough to be productive.

1.12 What’s Next

Proceed to Chapter 2 — Syntax & Semantics, where we dive into:

slicing

unpacking

names & binding

string formatting evolution

raw strings

line continuation

This is where Python’s deeper semantics begin to matter.



📘 CHAPTER 2 — SYNTAX & SEMANTICS

Depth Level: 3 (Comprehensive)
Python Versions Covered: 3.8–3.14+
Prerequisites: Chapter 1

2.0 Overview

Chapter 2 establishes the full formal grammar and operational semantics of Python’s everyday constructs.

You will learn:

What counts as a valid token

How whitespace controls program structure

How names bind to objects

Everything about strings, slice notation, unpacking, and expressions

How Python evaluates expressions (left-to-right, short-circuit rules)

Subtle pitfalls around mutability, aliasing, copying

The evolution of string formatting (%, .format(), f-strings)

Raw strings & escaping

Line continuation patterns

Indexing + slicing semantics

Unpacking semantics (*, **)

This chapter forms the mental model that your entire understanding of Python will build upon.

2.1 Lexical Structure (Tokens, Keywords, Names)
2.1.1 Tokens

Python's lexical components include:

Identifiers (variable names)

Keywords (if, for, class, etc.)

Literals (42, "hello", 3.14, True)

Operators (+, -, *, //, %, ==, etc.)

Delimiters ((), [], {}, ,, :)

2.1.2 Keywords (3.10–3.14)

Keyword list:

False, None, True,
and, as, assert, async, await,
break, class, continue,
def, del, elif, else,
except, finally, for, from,
global, if, import,
in, is, lambda,
nonlocal, not, or, pass,
raise, return, try,
while, with, yield,
match, case   # 3.10+

2.1.3 Identifiers (Names)

Rules:

Start with letter or underscore

Followed by letters, numbers, underscores

Case sensitive

Unicode allowed (but discouraged for public APIs)

Examples:

_valid_name = 10
π = 3.14      # Allowed, but avoid in production
user_id = 42

2.2 Significance of Whitespace

Python uses indentation to define blocks instead of {}.

Rules:

1 indentation level = 4 spaces (PEP 8)

Tabs are discouraged

Indentation must be consistent within a block

Offside rule: First non-whitespace column defines block depth

Bad:

if x:
   print("bad indent")   # 3 spaces
    print("mixed")        # 4 spaces


Good:

if x:
    print("good")
    print("consistent")

2.3 Expressions and Operators

Expressions follow a strict precedence order. The most common:

**                exponentiation  
*, /, //, %       multiplication/division  
+, -              addition/subtraction  
<<, >>            bitwise shifts  
&                 bitwise and  
^                 xor  
|                 or  
<, >, <=, >=      comparisons  
==, !=            equality  
not               logical not  
and               logical and  
or                logical or  


Short-circuit rules:

# and stops early
x is not None and x > 0

# or stops early
username or "guest"

2.4 Strings (The Complete Treatment)

Python strings are:

immutable

Unicode by default

sequences of code points

sliceable

Forms:

"double quotes"
'single quotes'
"""triple quoted"""
r"raw\nstring"         # raw literal
f"{expression}"        # formatted

2.4.1 String Formatting Evolution

Code Evolution: Simple → Production-Ready

Stage 1: Basic % formatting (legacy)

```python
name = "Alice"
age = 30
message = "Hello, %s! You are %d years old." % (name, age)
print(message)
# Output: Hello, Alice! You are 30 years old.
```

Stage 2: .format() method (Python 2.7+, 3.0+)

```python
name = "Alice"
age = 30
message = "Hello, {}! You are {} years old.".format(name, age)
# Or with named placeholders:
message = "Hello, {name}! You are {age} years old.".format(name=name, age=age)
print(message)
# Output: Hello, Alice! You are 30 years old.
```

Stage 3: f-strings (Python 3.6+, recommended)

```python
name = "Alice"
age = 30
message = f"Hello, {name}! You are {age} years old."
print(message)
# Output: Hello, Alice! You are 30 years old.

# With expressions:
message = f"Hello, {name.upper()}! You are {age + 1} years old next year."
# Output: Hello, ALICE! You are 31 years old next year.
```

Stage 4: Production-ready with validation

```python
from typing import Optional

def format_greeting(name: str, age: Optional[int] = None) -> str:
    """Format a personalized greeting with type safety."""
    if age is None:
        return f"Hello, {name}!"
    return f"Hello, {name}! You are {age} years old."

print(format_greeting("Alice", 30))
# Output: Hello, Alice! You are 30 years old.

print(format_greeting("Bob"))
# Output: Hello, Bob!
```

2.4.1 String Formatting Evolution
1. Percent-style (%)
"%s is %d years old" % ("Alice", 30)


Problems:

brittle

error-prone

type-sensitive

2. str.format() (2008)
"{name} is {age}".format(name="Alice", age=30)


Pros:

explicit

avoids ordering confusion
Cons:

verbose

3. F-Strings (3.6+) — Use these everywhere
name = "Alice"
age = 30
f"{name} is {age} years old"


Advanced f-strings (3.12+ PEP 701):

x = 10
print(f"{x = }")       # prints: x = 10
print(f"{x+5 = }")     # prints: x+5 = 15


Expression support:

f"{user.name.upper():>20}"

2.5 Raw Strings

Raw strings disable escape interpretation.

r"\n" == "\\n"


Used for:

regex

Windows paths

literal backslashes

⚠️ Raw strings cannot end with an odd number of backslashes.

Bad:

r"C:\newfolder\"   # invalid


Correct:

r"C:\newfolder\\"

2.6 Truthiness Rules

Python converts values to boolean using:

__bool__(), or

__len__() (non-zero means True)

Falsey values:

0
0.0
0j
''
[]
{}
set()
None
False


Everything else is truthy.

2.7 Indexing & Slice Semantics (Critical Topic)
Syntax:
obj[start:stop:step]


Examples:

s = "abcdef"

s[0]       # 'a'
s[-1]      # 'f'

s[2:5]     # 'cde'
s[:3]      # 'abc'
s[3:]      # 'def'
s[::2]     # 'ace'
s[::-1]    # reverse string


Rules:

Negative indices count from the right

Omitted start/stop default to entire range

Step cannot be zero

2.8 Unpacking (* and **)

Used in:

Assignment unpacking
a, b = [1, 2]


Star-unpacking:

a, *middle, b = [1, 2, 3, 4, 5]
# a=1, middle=[2,3,4], b=5

Function arguments
def add(a, b, c):
    return a + b + c

nums = [1, 2, 3]
add(*nums)

Dict merging
a = {"x": 1}
b = {"y": 2}
c = {**a, **b}

2.9 Line Continuation

Three valid approaches:

1. Implicit (best)
total = (
    price
    + tax
    + discount
)

2. Explicit (rarely used)
result = price + \
         tax + \
         discount

3. Inside list/dict literals

Same as #1.

2.10 Binding Semantics (Names → Objects)

Python variables are just names pointing to objects.

Example:
a = [1, 2, 3]
b = a      # same list
b.append(4)

print(a)   # [1,2,3,4]


Important concepts:

aliasing

references

identity vs equality

shallow copies vs deep copies

2.11 Identity: is vs ==
x == y   # value equality
x is y   # same object identity


Pitfall:

x = 256
y = 256
x is y        # True (interning)

x = 1000
y = 1000
x is y        # False

2.12 Mutability Rules

Mutable:

list

dict

set

bytearray

custom objects (if designed mutable)

Immutable:

int

float

str

tuple

frozenset

bytes

2.13 Expression Evaluation Order

Left to right:

x = f1() + f2() * f3()


Order of calls is always:

f1 → f2 → f3


Even though multiplication binds tighter.

2.14 Preview: How These Semantics Affect Real Programs

These semantics will directly impact:

Chapter 4 (Type System)

Chapter 5 (Control Flow)

Chapter 6 (Functions)

Chapter 7 (OOP)

Chapter 16 (Concurrency)

Chapter 21 (Data Engineering)

Python's simplicity masks deep semantics.

2.15 Mini Example — Slicing + Unpacking + f-strings
def summarize(sequence: list[int]) -> str:
    first, *middle, last = sequence
    return f"{first=} {last=} {len(middle)} items in between"

print(summarize([10, 20, 30, 40, 50]))

2.16 Macro Example — Log Parser
from pathlib import Path

def analyze_log(path: str):
    lines = Path(path).read_text().splitlines()

    error_lines = [
        line
        for line in lines
        if "ERROR" in line
    ]

    timestamps = [
        line.split(" ", 1)[0]
        for line in error_lines
    ]

    return {
        "errors": len(error_lines),
        "first": timestamps[0] if timestamps else None,
        "last": timestamps[-1] if timestamps else None,
    }

stats = analyze_log("server.log")
print(stats)


Uses:

slicing

unpacking

truthiness

string ops

iteration

2.17 Pitfalls & Warnings

⚠️ Mutable default arguments
⚠️ is vs ==
⚠️ Modifying sequences during iteration
⚠️ Late binding in closures
⚠️ Raw string edge cases
⚠️ Line-continuation bugs
⚠️ Copying vs aliasing

2.18 Summary & Takeaways

Python’s syntax is clean but deeply semantic

Indentation = structure

Strings: use f-strings

Slicing and unpacking are powerful

Raw strings essential for regex

Semantics around identity and mutability are critical

Evaluation order is predictable (left-to-right)

2.19 Next Chapter

Proceed to:

👉 Chapter 3 — Core Execution Model

Where we deeply analyze:

CPython internals

Bytecode

Frame objects

Namespaces

Module loading

Execution contexts

Import system caching (sys.modules)

__pycache__ mechanics

JIT tiers



📘 CHAPTER 3 — CORE EXECUTION MODEL

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

See diagram:
➡ Appendix G → G.2.1 "Source → Bytecode → Execution"

Stages:

Read source file (.py)

Tokenize

Parse (PEG parser)

AST construction

Bytecode compilation

Write .pyc file to __pycache__

Interpreter executes bytecode

Optionally JIT-optimized (3.13+)

Example (internal flow)
def add(a, b):
    return a + b


This becomes:

tokens: def, add, (, a, …

AST: FunctionDef node

bytecode: LOAD_FAST, BINARY_ADD, RETURN_VALUE

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

AST represents the syntactic structure of Python code as a tree of nodes.

**AST Diagram - Simple Expression:**

```
Source Code: "x = 1 + 2"

Tokenizer → Tokens:
[NAME('x'), EQUAL, NUMBER(1), PLUS, NUMBER(2), NEWLINE]

Parser → AST Tree:
                    Module
                      │
                      └── body: [Assign]
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
              targets: [Name]              value: BinOp
                    │                           │
                  id='x'              ┌─────────┼─────────┐
                                      │         │         │
                                  left:    op: Add()  right:
                                  Constant(1)         Constant(2)
```

**AST Structure Visualization:**

```
Module
└── body: [Statement]
    └── Assign
        ├── targets: [Name(id='x', ctx=Store())]
        └── value: BinOp
            ├── left: Constant(value=1)
            ├── op: Add()
            └── right: Constant(value=2)
```

**Example Code:**

```python
import ast

code = "x = 1 + 2"
tree = ast.parse(code)
print(ast.dump(tree, indent=4))
```

**Output:**

```
Module(
    body=[
        Assign(
            targets=[Name(id='x', ctx=Store())],
            value=BinOp(
                left=Constant(value=1),
                op=Add(),
                right=Constant(value=2)
            )
        )
    ]
)
```

**AST Diagram - Function Definition:**

```
Source Code:
def add(a, b):
    return a + b

AST Tree:
                    Module
                      │
                      └── body: [FunctionDef]
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                  name='add'   args: Arguments  body: [Return]
                                  │               │
                    ┌─────────────┴─────┐         │
                    │                   │         │
              args: [arg]          defaults: []    │
                    │                               │
            ┌───────┴───────┐                       │
            │               │                       │
        arg('a')        arg('b')              value: BinOp
                                                  │
                                        ┌─────────┼─────────┐
                                        │         │         │
                                    left:    op: Add()  right:
                                    Name('a')          Name('b')
```

**AST Node Types:**

```python
import ast

# Common AST node types
code_examples = {
    "assignment": "x = 42",
    "function": "def f(x): return x",
    "if_statement": "if x > 0: print(x)",
    "for_loop": "for i in range(10): print(i)",
    "list_comp": "[x*2 for x in range(5)]",
    "class_def": "class MyClass: pass"
}

for name, code in code_examples.items():
    tree = ast.parse(code)
    print(f"\n{name}:")
    print(ast.dump(tree, indent=2))
```

**AST Transformation Example:**

```python
import ast

class ConstantFolding(ast.NodeTransformer):
    """Fold constant expressions (e.g., 1 + 2 → 3)."""
    
    def visit_BinOp(self, node):
        # Recursively visit children
        node = self.generic_visit(node)
        
        # If both operands are constants, fold them
        if isinstance(node.left, ast.Constant) and isinstance(node.right, ast.Constant):
            left_val = node.left.value
            right_val = node.right.value
            
            if isinstance(node.op, ast.Add):
                return ast.Constant(value=left_val + right_val)
            elif isinstance(node.op, ast.Sub):
                return ast.Constant(value=left_val - right_val)
            elif isinstance(node.op, ast.Mult):
                return ast.Constant(value=left_val * right_val)
            # ... more operators
        
        return node

# Transform: "x = 1 + 2" → "x = 3"
code = "x = 1 + 2"
tree = ast.parse(code)
transformer = ConstantFolding()
new_tree = transformer.visit(tree)
print(ast.dump(new_tree, indent=2))
# Output: Assign with value=Constant(value=3)
```

**AST Walking Example:**

```python
import ast

class VariableCollector(ast.NodeVisitor):
    """Collect all variable names from AST."""
    
    def __init__(self):
        self.variables = set()
    
    def visit_Name(self, node):
        self.variables.add(node.id)
        self.generic_visit(node)

code = """
x = 1
y = x + 2
z = y * 3
"""
tree = ast.parse(code)
collector = VariableCollector()
collector.visit(tree)
print(collector.variables)  # {'x', 'y', 'z'}
```

**AST Used By:**

- **Linters** (pylint, flake8, ruff) — Static analysis
- **Formatters** (black, autopep8) — Code formatting
- **Transpilers** — Convert Python to other languages
- **JIT Optimizers** — Runtime optimization
- **Static Analysis Tools** — Type checkers, security scanners
- **Code Generators** — Generate code from AST
- **Refactoring Tools** — Automated code refactoring

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

Import flow diagram

➡ Appendix G → G.4.1 “Import Machinery”

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


util.py:

print("util imported")
x = 10


main.py:

import util
import util

print(util.x)


Output:

util imported
10


Second import does not re-execute code.
It returns the cached module.

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

📘 CHAPTER 4 — TYPES & TYPE SYSTEM

Depth Level: 3
Python Versions: 3.8–3.14+

4.0 Overview

Python’s type system is:

Dynamic at runtime

Gradually typed via optional static typing

Nominal for classes

Structural for protocols

Richly extensible through the Data Model

Strongly typed (no silent coercions like JS)

Runtime introspectable

This chapter covers:

Built-in types

Mutability rules

Identity vs equality

Operator semantics

The entire Data Model (dunder methods)

Abstract Base Classes

typing: generics, TypeVar, ParamSpec, Self, TypeAlias, TypedDict, Protocol

Literal types

Type narrowing & guards

Python’s conceptual type lattice

Practical examples for real-world engineering

4.1 Everything Is an Object (Formal Statement)

In Python:

Every value is an object.
Every object has a type.
The type determines the object’s behavior.

Examples:

type(10) is int
type("hello") is str
type([1,2,3]) is list


Even functions and classes are objects:

def f(): pass
class C: pass

type(f)     # function
type(C)     # type

4.2 Built-In Types (Full Inventory)

Python’s built-in types fall into categories:

Scalars:

int

float

complex

bool

Text & Bytes:

str

bytes

bytearray

Collections:

list

tuple

set

frozenset

dict

Special Types:

NoneType

EllipsisType

NotImplementedType

slice

range

Callable Types:

function

method

lambda

generator

coroutine (async)

Custom Types:

user-defined classes

dataclasses

enums

pydantic models

Type-checking helpers:

typing.Any

typing.Union

typing.Optional

typing.TypeAlias

typing.NewType

typing.Self (3.11+)

4.3 Identity, Equality, and Mutability
4.3.1 Identity
a is b


True only if they reference the same object.

4.3.2 Equality
a == b


True if values compare equal.

4.3.3 Mutability Table
Type	Mutable?
int	❌
float	❌
str	❌
tuple	❌ (but may contain mutable values)
bytes	❌
bool	❌
list	✔️
dict	✔️
set	✔️
bytearray	✔️
custom classes (default)	✔️
⚠ Pitfall: Mutable Defaults
def f(x=[]):   # bad
    x.append(1)
    return x


Use:

def f(x=None):
    if x is None:
        x = []

4.4 The Type Hierarchy & Lattice
Diagram Reference

➡ Appendix G → G.5.1 (“Core Built-in Types”)

Python’s type model is:

not a single inheritance hierarchy

driven by protocols and behavior

integrated with abstract base classes

supports structural typing via Protocol

The true type system is closer to a behavioral lattice than a classical tree.

4.5 Static Typing with typing

Python supports optional static typing:

def add(a: int, b: int) -> int:
    return a + b


Type check using:

mypy

pyright (recommended)

pylance (VS Code plugin)

pytype

ruff (with type-checking mode coming)

4.5.1 Basic types
x: int = 10
y: str = "hello"
z: list[int] = [1, 2, 3]


(3.9+ syntax allows built-in generics.)

4.5.2 Union Types

Python 3.10+:

def maybe(x: int | None) -> int | None:
    return x


Equivalent to typing.Union[int, None].

4.5.3 Optional
def greet(name: str | None) -> str:
    if name is None:
        return "Hello!"
    return f"Hello, {name}!"


Optional means “value may be None”.

4.5.4 Literal Types
def move(direction: Literal["up", "down"]): ...

4.5.5 Type Aliases (3.10+)
UserId: TypeAlias = int

4.5.6 NewType
UserId = NewType("UserId", int)


Adds semantic distinction.

4.5.7 TypeVar, ParamSpec, TypeVarTuple
TypeVar:
T = TypeVar("T")

def identity(x: T) -> T:
    return x

ParamSpec (for decorators):
P = ParamSpec("P")

TypeVarTuple (variadic generics):
Ts = TypeVarTuple("Ts")


Used with tuple types.

4.5.8 Self Type (3.11+)
class Builder:
    def set_x(self, value) -> Self:
        self.x = value
        return self


Supports fluent interfaces.

4.5.9 override Decorator (3.12+)
class Base:
    def f(self): ...

class Child(Base):
    @override
    def f(self): ...


Catches misspelled or incorrect overrides.

4.6 The Data Model (Dunder Methods)

This is the heart of Python.

Python's entire behavior model is defined through special methods.

Categories:
4.6.1 Object Lifecycle
__new__(cls, ...)
__init__(self, ...)
__del__(self)

4.6.2 Representation
__repr__(self)
__str__(self)
__format__(self, spec)


__repr__ must be unambiguous.
__str__ is user-friendly.

4.6.3 Comparison & Ordering
__eq__, __ne__
__lt__, __le__, __gt__, __ge__

4.6.4 Numeric Operators
__add__, __sub__, __mul__, __truediv__
__floordiv__, __mod__
__pow__, __neg__

4.6.5 Container Protocols
__len__
__getitem__
__setitem__
__delitem__
__contains__
__iter__
__next__


These power:

lists

dicts

sets

custom collections

4.6.6 Callable Objects
__call__(self, *args, **kwargs)


Lets objects behave like functions.

4.6.7 Attribute Access
__getattr__
__setattr__
__delattr__
__getattribute__


Powerful but dangerous.

4.6.8 Context Managers
__enter__
__exit__


Equivalent to:

with obj:
    ...

4.7 Abstract Base Classes (ABCs)

collections.abc defines behavioral categories:

Examples:

Iterable

Iterator

Collection

Sequence

Mapping

MutableMapping

Set

MutableSet

Hashable

Use to define expected interfaces:

from collections.abc import Iterable

def flatten(items: Iterable):
    ...

4.8 Protocols (Structural Typing)

Protocols describe behavior, not inheritance.

from typing import Protocol

class SupportsClose(Protocol):
    def close(self) -> None: ...


Any object with a .close() method qualifies, regardless of class hierarchy.

This is duck typing with static checks.

4.9 Type Narrowing & Type Guards

Use isinstance() + match-case.

Example:

def f(x: int | str):
    if isinstance(x, int):
        # narrowed to int
        return x + 1
    else:
        return x.upper()


TypeGuard example:

from typing import TypeGuard

def is_int_list(v: list[object]) -> TypeGuard[list[int]]:
    return all(isinstance(x, int) for x in v)

4.10 Real-World Mini Example — Typed Repository
from typing import Protocol, TypeVar, Generic

T = TypeVar("T")

class Repo(Protocol[T]):
    def add(self, item: T) -> None: ...
    def get_all(self) -> list[T]: ...

class MemoryRepo(Generic[T]):
    def __init__(self):
        self._items: list[T] = []

    def add(self, item: T) -> None:
        self._items.append(item)

    def get_all(self) -> list[T]:
        return list(self._items)

repo: Repo[int] = MemoryRepo()
repo.add(1)
print(repo.get_all())


Demonstrates:

Protocol

Generics

TypeVar

Structural typing

4.11 Macro Example — Fluent Builder with Self + Protocols
from __future__ import annotations
from typing import Self, Protocol

class Buildable(Protocol):
    def build(self) -> dict: ...

class ConfigBuilder:
    def __init__(self):
        self._cfg = {}

    def set(self, key: str, value) -> Self:
        self._cfg[key] = value
        return self

    def build(self) -> dict:
        return dict(self._cfg)

cfg = (
    ConfigBuilder()
    .set("user", "alice")
    .set("debug", True)
    .build()
)

print(cfg)

4.12 Type System Pitfalls

⚠️ List[Any] allows anything
⚠️ Optional[T] ≠ nullable by default
⚠️ dict is not ordered in older Python (<3.7)
⚠️ misuse of Protocol can lead to false positives
⚠️ forgetting deep immutability (tuple with list inside)
⚠️ mixing mutable + immutable types in hash keys

4.13 Summary & Takeaways

Python’s type model is extremely flexible

Static typing dramatically improves reliability

The Data Model defines all operator behavior

Protocols enable powerful structural typing

Generics + TypeVar enable reusable, typed APIs

Self, ParamSpec, and new generic syntax simplify modern APIs

ABCs give formal category theory-like structure

Understanding identity vs equality avoids subtle bugs

4.14 Next Chapter

Proceed to:

👉 Chapter 5 — Control Flow

Where we cover:

if/elif/else

loops

comprehensions

exception handling

context managers

advanced pattern matching

exception chaining

real-world flows in production code



📘 CHAPTER 5 — CONTROL FLOW

Depth Level: 3
Python Versions: 3.8–3.14+
Prerequisites: Chapters 1–4

5.0 Overview

Control flow defines how your program decides what to do and when to do it.

This chapter covers:

Conditional logic

Loops and iteration

Short-circuiting rules

Comprehensions

Structural pattern matching (3.10+)

Loop control keywords (break, continue, else)

Exception handling

Exception chaining (raise ... from)

Context managers (with)

Best practices

Common pitfalls

Real-world examples (mini + macro)

5.1 Boolean Logic & Conditionals

Python treats truthiness according to Chapter 2 rules.

5.1.1 if / elif / else
if x > 10:
    print("large")
elif x > 5:
    print("medium")
else:
    print("small")

5.1.2 Truthiness Reminders

Empty sequences are false

Non-empty sequences are true

Numbers: 0 → False, otherwise True

None is always False

5.1.3 Ternary Expression
result = "yes" if flag else "no"

5.1.4 Comparisons Are Chainable
0 < x < 10


This expands to:

0 < x and x < 10

5.2 Loops

Python has two loop types:

for (iteration-based)

while (condition-based)

5.2.1 for loops
for item in items:
    print(item)


Python’s for loops are iterator-based, not C-style counter loops.

Under the hood:

iter_obj = iter(items)
while True:
    try:
        item = next(iter_obj)
    except StopIteration:
        break

5.2.2 while loops
while n > 0:
    n -= 1


Use while for:

polling

event loops

infinite loops

waiting for conditions

5.2.3 Loop Control Keywords
Keyword	Meaning
break	exit loop immediately
continue	skip to next iteration
else	runs only if loop completed without break
5.2.4 Loop else

Example:

for user in users:
    if user.id == target:
        print("Found!")
        break
else:
    print("Not found")


The else triggers only if break did not run.

5.3 Comprehensions
5.3.1 List comprehensions
squares = [x*x for x in range(10)]

5.3.2 Dict comprehensions
d = {user.id: user for user in users}

5.3.3 Set comprehensions
unique = {item.lower() for item in items}

5.3.4 Generator expressions
gen = (x*x for x in range(1_000_000))


Lazy and memory-efficient.

5.3.5 When NOT to use comprehensions

When nesting exceeds ~2 levels

When readability suffers

When side effects occur

When mutation is required

5.4 Pattern Matching (match / case) — Python 3.10+

Introduced in PEP 634–636.

Pattern matching is not a switch-case.
It is a mini declarative matching language inside Python.

5.4.1 Basic Example
match command:
    case "start":
        ...
    case "stop":
        ...
    case _:
        ...

5.4.2 Literal Patterns
case 0:
case "yes":

5.4.3 Sequence Patterns
match x:
    case [a, b]:
        ...
    case [a, b, c, *rest]:
        ...

5.4.4 Mapping Patterns
match obj:
    case {"type": "user", "id": user_id}:
        ...

5.4.5 Class Patterns
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

match p:
    case Point(x, y):
        ...

5.4.6 OR Patterns
case "y" | "yes" | "true":

5.4.7 AS Patterns
case {"user": u} as obj:
    print(obj)

5.4.8 Guards
match age:
    case x if x < 13:
        print("child")
    case x if x < 20:
        print("teen")


Guards allow arbitrary boolean conditions.

5.5 Exception Handling
5.5.1 Basic try-except
try:
    risky()
except ValueError:
    recover()

5.5.2 Catching multiple exceptions
except (ValueError, TypeError):

5.5.3 finally

Always runs:

try:
    ...
finally:
    cleanup()

5.5.4 else

Runs only if no exception occurred:

try:
    value = int(x)
except ValueError:
    ...
else:
    print("parsed ok")

5.5.1 Exception Chaining (Critical Topic)
Why chaining?

Helps preserve root cause.

Implicit chaining
try:
    open("missing.txt")
except Exception as e:
    raise RuntimeError("fail")


Produces:

During handling of the above exception, another exception occurred:

Explicit chaining
try:
    open("missing.txt")
except OSError as e:
    raise RuntimeError("fail") from e


Preserves cause cleanly.

5.6 Context Managers (with)

Handles setup/teardown logic.

5.6.1 Basic Example
with open("data.txt") as f:
    data = f.read()


open() implements:

__enter__
__exit__

5.6.2 Custom Context Manager
class Timer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self
    def __exit__(self, exc_type, exc, tb):
        self.end = time.perf_counter()

with Timer() as t:
    heavy()

5.7 Putting It All Together — Mini Example

(loops + comprehensions + pattern matching)

def process(records):
    for r in records:
        match r:
            case {"type": "user", "id": id}:
                print(f"user={id}")
            case ["log", ts, msg]:
                print(f"{ts}: {msg}")
            case _:
                print("unknown")

5.8 Macro Example — Log Routing System
from datetime import datetime

def route(record):
    match record:
        case {"level": "error", "msg": msg}:
            return f"[ERROR] {msg}"
        case {"level": "warn", "msg": msg}:
            return f"[WARN] {msg}"
        case {"level": "info", "msg": msg}:
            return f"[INFO] {msg}"
        case ["metric", name, value]:
            return f"[METRIC] {name}={value}"
        case _:
            return "[UNKNOWN]"

def process_log(lines):
    results = []
    for line in lines:
        if not line.strip():
            continue
        obj = eval(line)   # never do this in production; for demo only
        results.append(route(obj))
    return results

lines = [
    "{'level': 'info', 'msg': 'started'}",
    "['metric', 'latency', 32]",
    "{'level': 'error', 'msg': 'failure'}",
]

print(process_log(lines))


Demonstrates:

iteration

control flow

pattern matching

routing logic

guards and patterns

(A safer example would parse JSON; this is intentionally short-form.)

5.9 Pitfalls & Warnings

⚠ Using eval (never safe)
⚠ Complex nested comprehensions
⚠ Misusing else on loops
⚠ Wrong exception order (broad then narrow)
⚠ Overusing exceptions for flow control
⚠ match-case fall-through misunderstanding (it doesn’t fall through like switch)

5.10 Summary & Takeaways

Control flow is clean and expressive

Iteration is central to Python

Comprehensions are powerful but must remain readable

Pattern matching is a huge addition (Python 3.10+)

Exception chaining helps debugging

Context managers simplify resource handling

Best engineers write small, clear, predictable control-flow blocks

5.11 Next Chapter

Proceed to:

👉 Chapter 6 — Functions & Functional Concepts

Where we cover:

parameter kinds

closures

scoping rules

decorators

iterators and generators

recursion

functools & itertools

iteration protocol (__iter__, __next__)

advanced decorator typing with ParamSpec



📘 CHAPTER 6 — FUNCTIONS & FUNCTIONAL CONCEPTS

Depth Level: 3
Python Versions: 3.8–3.14+
Prerequisites: Chapters 1–5

6.0 Overview

Functions are the core building block of Python programs.
In Python, functions are:

first-class objects

callable

storable in variables

passable as arguments

returnable as values

dynamically typed

support closures

can act as decorators

can yield (generators)

can be async (coroutines)

This chapter provides a formal and practical understanding of:

Function definitions

Parameter kinds & signatures

Scoping & closures

Iterators & iterable protocol

Generators & coroutines

Decorators (simple → advanced)

functools (lru_cache, partial, singledispatch)

itertools (infinite iterators, combinatorics)

operator module

Recursion patterns

Tail-call limitations

Type annotations for functions

6.1 Function Definitions

Basic syntax:

def greet(name: str) -> str:
    return f"Hello, {name}!"


Functions consist of:

name

parameters

body

return value

optional return annotation

optional docstring

6.2 Functions Are First-Class Objects

You can:

store them in variables

pass them to other functions

return them

store them in data structures

Example:

def add(a, b): return a + b
def mul(a, b): return a * b

ops = {
    "add": add,
    "mul": mul,
}

print(ops["mul"](3, 4))


This property underpins decorators, callbacks, strategies, and functional patterns.

6.3 Parameter Kinds (The 5 Types)

Python has five categories of parameters.

def f(a, b, /, c, d=4, *args, e, f=6, **kwargs):
    pass

6.3.1 Positional-only (/)

Example:

def add(a, b, /):
    return a + b


Callers must supply positional args:

add(1, 2)   # OK
add(a=1, b=2)  # ❌

6.3.2 Positional-or-keyword (normal)
def f(x, y): ...

6.3.3 Keyword-only (*)
def config(*, debug=False):
    return debug

6.3.4 Variadic positional (*args)
def total(*nums):
    return sum(nums)

6.3.5 Variadic keyword (**kwargs)
def print_info(**data):
    print(data)

6.4 Return Semantics

A function without return returns:

None


Multi-return using tuples:

def pair():
    return (1, 2)


Or unpack:

x, y = pair()

6.5 Scoping Rules (LEGB)

Python resolves names in:

Scope	Example
Local	inside function
Enclosing	outer function
Global	module
Built-in	len, range

Diagram (from Appendix G → G.3.1) applies.

6.5.1 global
count = 0

def inc():
    global count
    count += 1

6.5.2 nonlocal

Captures enclosing variables (not global):

def outer():
    x = 0
    def inner():
        nonlocal x
        x += 1
    inner()
    return x

6.6 Closures

Functions capture free variables from enclosing scopes.

def make_adder(n):
    def adder(x):
        return x + n
    return adder

plus_10 = make_adder(10)
print(plus_10(5))   # 15


❗ Important:

Closures capture references, not copies.

6.7 Iterators & The Iteration Protocol (New Chapter Section)

Python iteration is built on two methods:

__iter__(self) -> iterator
__next__(self) -> next_value

6.7.1 Iterable vs Iterator
Concept	Has	Example
Iterable	__iter__	list, dict, set, str
Iterator	__iter__, __next__	generators, iterators
6.7.2 Creating custom iterators
class Count:
    def __init__(self, start):
        self.value = start

    def __iter__(self):
        return self

    def __next__(self):
        v = self.value
        self.value += 1
        return v

6.7.3 Sentinel iteration
for chunk in iter(lambda: f.read(1024), b""):
    process(chunk)

6.7.4 Infinite iterators

Use itertools:

import itertools
for x in itertools.count(10, 2):
    ...

6.8 Generators & yield

Generators are lightweight, resumable functions.

def countdown(n):
    while n > 0:
        yield n
        n -= 1

6.8.1 yield from for delegation
def chain(a, b):
    yield from a
    yield from b

6.8.2 Why generators matter

memory efficiency

pipelines

async-ready

streaming data

coroutines (before async/await)

6.9 Decorators (Deep Dive)

Decorators transform callables.

6.9.1 Basic decorator
def log(fn):
    def wrapper(*a, **k):
        print("calling", fn.__name__)
        return fn(*a, **k)
    return wrapper

@log
def greet():
    print("hi")

6.9.2 Decorators with arguments
def tagged(tag):
    def deco(fn):
        def wrapper(*a, **k):
            print(f"[{tag}] calling {fn.__name__}")
            return fn(*a, **k)
        return wrapper
    return deco

@tagged("INFO")
def f(): ...

6.9.3 Using functools.wraps

Preserves metadata:

from functools import wraps

def log(fn):
    @wraps(fn)
    def wrapper(*a, **k):
        ...

6.9.4 Classmethod, Staticmethod, Property
classmethod
class C:
    count = 0

    @classmethod
    def inc(cls):
        cls.count += 1

staticmethod
class C:
    @staticmethod
    def add(a, b):
        return a + b

property
class User:
    def __init__(self, name):
        self._name = name

    @property
    def name(self):
        return self._name

6.10 functools Essentials
6.10.1 partial
from functools import partial

add5 = partial(lambda x, y: x+y, 5)
add5(10)  # 15

6.10.2 lru_cache
@lru_cache(maxsize=256)
def fib(n): ...

6.10.3 singledispatch
from functools import singledispatch

@singledispatch
def handle(x): ...

@handle.register
def _(x: int): ...

@handle.register
def _(x: list): ...

6.11 itertools Essentials
6.11.1 Infinite iterators
itertools.count()
itertools.cycle()

6.11.2 Combinatorics
itertools.permutations()
itertools.combinations()

6.11.3 Chaining
itertools.chain(a, b)

6.11.4 Grouping
itertools.groupby(...)

6.12 operator Module

Used for functional composition & speed.

from operator import itemgetter, attrgetter

sorted(users, key=attrgetter("age"))

6.13 Recursion

Python recursion is limited by call stack:

import sys
sys.getrecursionlimit()


Default ~1000.

6.13.1 Tail-call optimization

Python does not perform TCO.

Never rely on tail recursion.

6.14 Mini Example — Pipeline Generator
def read_lines(path):
    with open(path) as f:
        for line in f:
            yield line.strip()

def filter_errors(lines):
    for line in lines:
        if "ERROR" in line:
            yield line

pipeline = filter_errors(read_lines("app.log"))

for line in pipeline:
    print(line)

6.15 Macro Example — Decorator + Cache + Iterators
from functools import lru_cache, wraps
import itertools

def logged(fn):
    @wraps(fn)
    def wrapper(*a, **k):
        print("calling", fn.__name__)
        return fn(*a, **k)
    return wrapper

@logged
@lru_cache(maxsize=128)
def prime(n: int) -> int:
    # Fisher–Yates prime generator demo
    count = 0
    for x in itertools.count(2):
        if all(x % p for p in range(2, int(x**0.5) + 1)):
            count += 1
            if count == n:
                return x

print(prime(10))   # calls logged
print(prime(10))   # hits cache


Demonstrates:

decorator stacking

caching

infinite iterator

prime computation pipeline

6.16 Pitfalls & Warnings

⚠ Late binding closures
⚠ Forgetting @wraps
⚠ Using recursion for deep loops
⚠ Misusing *args (debug difficulty)
⚠ combining yield with try/finally incorrectly
⚠ forgetting to close resources (use with)
⚠ Non-deterministic iteration order pre-3.7

6.17 Summary & Takeaways

Python functions are highly flexible

Scoping follows LEGB

Closures capture variables by reference

Iteration is protocol-based (__iter__, __next__)

Generators implement lightweight coroutines

Decorators are a core part of modern Python

functools & itertools are essential tools

Recursion is supported but limited

6.18 Next Chapter

Proceed to:

👉 Chapter 7 — Classes & Object-Oriented Programming

This is one of the largest chapters in the entire book and covers:

class construction

inheritance

MRO

data model deep integration

descriptors

metaclasses

dataclasses

attrs

pydantic



📘 CHAPTER 7 — CLASSES & OBJECT-ORIENTED PROGRAMMING

Depth Level: 3
Python Versions: 3.8–3.14+

7.0 Overview

Python OOP sits on three pillars:

✔ Everything is an object

Classes are objects.
Instances are objects.
Functions, methods, modules: all objects.

✔ OOP is optional

Python supports:

procedural programming

functional programming

hybrid styles

data-centric structural design

protocol-based design

✔ Deep integration with the Data Model

The Data Model (from Chapter 4) determines how:

objects behave

operators resolve

attribute lookup works

iteration works

context managers work

numeric operations work

This chapter provides a complete, rigorous guide to:

class definitions

attributes

methods

self, initialization

inheritance

composition

MRO

super()

special methods (all major categories)

properties & descriptors

dataclasses

attrs

pydantic models

custom metaclasses

use cases in modern Python

7.1 Class Definition Fundamentals
7.1.1 Basic Class
class User:
    pass

7.1.2 Creating instances
u = User()
print(type(u))

7.1.3 The __init__ initializer
class User:
    def __init__(self, name):
        self.name = name

u = User("Alice")


self is the instance being constructed.

7.1.4 Instance attributes

Stored per object:

class Counter:
    def __init__(self):
        self.value = 0


Backing storage is the instance’s __dict__.

7.1.5 Class attributes

Shared across all instances:

class C:
    count = 0

7.1.6 Methods

Instance method:

class User:
    def __init__(self, name: str):
        self.name = name
    
    def greet(self):
        return f"Hi, I'm {self.name}"

user = User("Alice")
print(user.greet())
# Output: Hi, I'm Alice


Equivalent to:

User.greet(user)  # Python inserts self automatically
# Output: Hi, I'm Alice


Helpful mental model.

Try This: Experiment with method binding:

```python
class Calculator:
    def add(self, a: int, b: int) -> int:
        return a + b

calc = Calculator()
print(calc.add(2, 3))
# Output: 5

# Method is bound to instance
bound_method = calc.add
print(bound_method(4, 5))
# Output: 9

# Unbound method (from class)
unbound_method = Calculator.add
print(unbound_method(calc, 6, 7))
# Output: 13
```

7.2 Class, Instance, and Static Methods
7.2.1 Instance Methods

First parameter is the instance (self).

7.2.2 Class Methods

First parameter is class (cls).

class App:
    version = "1.0"

    @classmethod
    def get_version(cls):
        return cls.version

7.2.3 Static Methods

No automatic self/cls.

class Math:
    @staticmethod
    def add(a, b):
        return a + b

7.3 Object Lifecycle

__new__(cls, ...)

__init__(self, ...)

__del__(self) (rarely use)

__new__ constructs the object;
__init__ initializes it.

Custom __new__ required for immutable types like int, tuple, str.

7.4 Attribute Lookup (Critical Mechanism)

Order of attribute resolution:

instance.__dict__

class __dict__

parent classes

descriptors override all

metaclass if needed

This process is governed by:

__getattribute__

__getattr__

descriptor protocol

Later sections dive deep.

7.5 Inheritance
7.5.1 Single Inheritance
class Animal: ...
class Dog(Animal): ...

7.5.2 Multiple Inheritance
class A: ...
class B: ...
class C(A, B): ...


Python uses C3 linearization for ordering.

7.6 Method Resolution Order (MRO)

Use:

C.__mro__


or:

C.mro()

Example:
class A: ...
class B: ...
class C(A, B): ...


MRO:

C → A → B → object

7.6.1 MRO Resolution Algorithm Visualization

C3 Linearization Algorithm:

```
┌─────────────────────────────────────────┐
│  MRO Resolution for: C(A, B)            │
│                                         │
│  Step 1: Build inheritance graph       │
│      C                                 │
│     / \                                │
│    A   B                               │
│     \ /                                │
│    object                              │
│                                         │
│  Step 2: C3 Linearization              │
│  MRO(C) = [C] + merge(                │
│      MRO(A),                           │
│      MRO(B),                           │
│      [A, B]                            │
│  )                                     │
│                                         │
│  Result: [C, A, B, object]            │
└─────────────────────────────────────────┘
```

Method Lookup Flow:

```
obj.method()
         ↓
┌─────────────────────────────────────┐
│ 1. Check type(obj).__mro__             │
│    [C, A, B, object]                 │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ 2. Search in order:                 │
│    - C.__dict__['method']?          │
│    - A.__dict__['method']?          │
│    - B.__dict__['method']?          │
│    - object.__dict__['method']?     │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ 3. First match wins                 │
│    (stops at first found)           │
└─────────────────────────────────────┘
```

Try This: Explore MRO with multiple inheritance:

```python
class A:
    def method(self):
        return "A"

class B:
    def method(self):
        return "B"

class C(A, B):
    pass

class D(B, A):
    pass

print(C.__mro__)
# Output: (<class '__main__.C'>, <class '__main__.A'>, <class '__main__.B'>, <class 'object'>)

print(D.__mro__)
# Output: (<class '__main__.D'>, <class '__main__.B'>, <class '__main__.A'>, <class 'object'>)

c = C()
print(c.method())
# Output: A (A comes first in C's MRO)

d = D()
print(d.method())
# Output: B (B comes first in D's MRO)
```

Diagram Reference

➡ Appendix G → G.6.2 ("MRO Resolution Path")

7.7 super() (How It Really Works)

super() is not “parent class”.
It is a dynamic MRO-aware forwarder.

Simplified view:

super(CurrentClass, instance)


It returns the next class after CurrentClass in the MRO.

7.7.1 Cooperative multiple inheritance

Correct:

class A:
    def f(self):
        super().f()

class B:
    def f(self):
        super().f()

class C(A, B):
    def f(self):
        super().f()


MRO ensures each gets called once.

7.8 Composition Over Inheritance

Recommended when:

behavior differs

you want a pipeline of responsibilities

you want delegation

you avoid diamond inheritance

Example:

class Engine: ...
class Car:
    def __init__(self):
        self.engine = Engine()


Composition promotes:

testability

smaller interfaces

easier refactoring

7.9 The Data Model (Dunder Methods) in Detail

Extends Chapter 4’s overview — now with deeper examples.

7.9.1 Representation Methods
__repr__
__str__
__format__

Best Practice:
def __repr__(self):
    return f"{self.__class__.__name__}(x={self.x}, y={self.y})"

7.9.2 Numeric Methods

Implement vector arithmetic:

class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __mul__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)

7.9.3 Comparison Methods
__eq__
__lt__
__le__
...


Support sorting by implementing:

def __lt__(self, other): ...

7.9.4 Container Protocol
__len__
__getitem__
__setitem__
__contains__


Example:

class Bag:
    def __init__(self, items):
        self.items = items

    def __len__(self):
        return len(self.items)

    def __getitem__(self, idx):
        return self.items[idx]

7.9.5 Callable Objects
__call__


Example:

class Adder:
    def __init__(self, n):
        self.n = n

    def __call__(self, x):
        return x + self.n

7.9.6 Attribute Access Protocol
__getattr__

Called when attribute not found.

__getattribute__

Intercepts all attribute lookups.
Dangerous but powerful.

7.9.7 Context Manager Protocol
__enter__
__exit__

7.9.8 Iterator Protocol
__iter__
__next__


Usually implemented via generators.

7.10 Properties & Descriptors

Descriptors are Python’s deepest mechanism.

A descriptor is any object implementing:

__get__
__set__
__delete__


Properties are descriptors:

class User:
    @property
    def name(self): ...

7.11 Dataclasses (Python 3.7+)

Fastest way to create classes with fields.

from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int


Features:

auto __init__

auto __repr__

auto comparison methods

default values

frozen=True for immutability

slots=True (Python 3.10+) reduces memory

7.11.1 Post-init processing
@dataclass
class User:
    name: str
    def __post_init__(self):
        self.name = self.name.title()

7.11.2 slots=True
@dataclass(slots=True)
class Point: ...


Improves memory and speed.

7.12 attrs — A More Powerful dataclass Alternative
import attr

@attr.define
class User:
    name: str
    age: int


Benefits:

validators

converters

frozen classes

auto attributes

extensibility

7.13 Pydantic Models (FastAPI Standard)
from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str


Provides:

validation

immutability

JSON serialization

type enforcement

HTTPS APIs integration

7.14 Metaclasses (Deep Topic)

Metaclasses control:

class creation

attribute injection

validation

interface enforcement

ORM table construction

7.14.1 What is a metaclass?

A class whose instances are classes.

Default metaclass:

type

7.14.2 Custom metaclass
class Meta(type):
    def __new__(cls, name, bases, attrs):
        if "run" not in attrs:
            raise TypeError("need run() method")
        return super().__new__(cls, name, bases, attrs)

class Task(metaclass=Meta):
    def run(self): pass

7.14.3 Common use cases

ORMs (SQLAlchemy)

frameworks (Django models)

interfaces/protocol validation

automatic registration systems

7.15 Mini Example — Vector Class
@dataclass
class Vec:
    x: int
    y: int

    def __add__(self, o):
        return Vec(self.x + o.x, self.y + o.y)

v1 = Vec(1, 2)
v2 = Vec(3, 4)
print(v1 + v2)

7.16 Macro Example — Plugin System with Metaclass + Registry
class PluginMeta(type):
    registry = {}

    def __new__(cls, name, bases, attrs):
        new_cls = super().__new__(cls, name, bases, attrs)
        if name != "Plugin":
            cls.registry[name] = new_cls
        return new_cls

class Plugin(metaclass=PluginMeta):
    def run(self): raise NotImplementedError

class Logger(Plugin):
    def run(self):
        print("logging")

class Notifier(Plugin):
    def run(self):
        print("notifying")

for name, cls in PluginMeta.registry.items():
    print(name, "→", cls().run())


Demonstrates:

metaclass

registry

class creation hooks

plugin architecture

7.17 Pitfalls & Warnings

⚠ misunderstanding self
⚠ confusing class vs instance attributes
⚠ overriding __getattribute__ without care
⚠ multiple inheritance diamonds
⚠ descriptor mistakes
⚠ misuse of metaclasses (overkill)
⚠ dataclass mutable default fields
⚠ mismatched type annotations

7.18 Summary & Takeaways

Python’s OOP is flexible and dynamic

Classes, instances, and functions are all objects

MRO enables safe multiple inheritance

super() is MRO-aware, not “parent class”

Data Model powers operators, iteration, context managers

Properties and descriptors underlie advanced APIs

dataclasses and attrs simplify class creation

Pydantic adds validation and serialization

Metaclasses allow deep framework construction

7.19 Next Chapter

Proceed to:

👉 Chapter 8 — Modules, Packages & Project Structure
Where we cover:

modules

packages

namespace packages

import mechanics

reusable package structure

best practices for libraries

pyproject.toml

layout for modern Python projects


📘 CHAPTER 8 — MODULES, PACKAGES & PROJECT STRUCTURE

Depth Level: 3
Python Versions: 3.8–3.14+
Prerequisites: Chapters 1–7

8.0 Overview

Modules and packages provide organizational structure, encapsulation, reusability, and deployment for Python projects.

This chapter explains:

What modules are

How imports work

How Python resolves names

sys.path and import search paths

Namespace packages (PEP 420)

Package layouts

pyproject.toml

Modern build systems

Versioning & distribution

Best practices for structuring real-world applications

We also introduce:

intra-package imports

absolute vs relative imports

top-level vs local imports

import caching

circular import avoidance

packaging libraries

8.1 What Is a Module?

A module is any .py file.

Example project:

app/
  main.py
  utils.py


Inside main.py:

import utils


Everything in utils.py becomes namespaced under utils.

8.2 Import Mechanics (Critical Topic)

8.2.0 Import System Flow Diagram

```
import mymodule
         ↓
┌─────────────────────────────────────┐
│ 1. Check sys.modules cache          │  ← Already imported?
└─────────────────────────────────────┘
         ↓ (not found)
┌─────────────────────────────────────┐
│ 2. Iterate sys.meta_path finders   │
│    - BuiltinImporter                 │
│    - FrozenImporter                  │
│    - PathFinder                      │
└─────────────────────────────────────┘
         ↓ (finder returns spec)
┌─────────────────────────────────────┐
│ 3. ModuleSpec created               │
│    - name, loader, origin            │
│    - submodule_search_locations     │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ 4. Loader.exec_module(spec)         │
│    - SourceFileLoader                │
│    - ExtensionFileLoader              │
│    - NamespaceLoader                 │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ 5. Module added to sys.modules      │
│ 6. Module code executed              │
└─────────────────────────────────────┘
```

Try This: Explore the import system interactively:

```python
import sys
import importlib.util

# Check what's in sys.modules
print(f"Modules loaded: {len(sys.modules)}")
# Output: Modules loaded: 150

# Inspect a module's spec
spec = importlib.util.find_spec("json")
print(f"JSON module origin: {spec.origin}")
# Output: JSON module origin: /usr/lib/python3.13/json/__init__.py

# See the meta path finders
print(f"Meta path finders: {len(sys.meta_path)}")
for finder in sys.meta_path:
    print(f"  - {type(finder).__name__}")
# Output: Meta path finders: 3
# Output:   - BuiltinImporter
# Output:   - FrozenImporter
# Output:   - PathFinder
```

**Import System Diagram:**

```
┌─────────────────────────────────────────────────────────┐
│                    Import Request                        │
│              "import mymodule"                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Check sys.modules      │ ← Module cache
        │  (Already imported?)    │
        └────────┬─────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
     Found?            Not Found?
        │                 │
        ▼                 ▼
   Return cached    ┌────────────────────────┐
   module object    │  Iterate sys.meta_path  │
                    │  Finders:              │
                    │  - BuiltinImporter     │
                    │  - FrozenImporter      │
                    │  - PathFinder          │
                    └────────┬───────────────┘
                             │
                             ▼
                    ┌────────────────────────┐
                    │  Finder returns        │
                    │  ModuleSpec            │
                    │  (name, loader, origin)│
                    └────────┬───────────────┘
                             │
                             ▼
                    ┌────────────────────────┐
                    │  Loader.exec_module()  │
                    │  - SourceFileLoader    │
                    │  - ExtensionFileLoader │
                    │  - NamespaceLoader    │
                    └────────┬───────────────┘
                             │
                             ▼
                    ┌────────────────────────┐
                    │  Execute module code   │
                    │  (top to bottom)       │
                    └────────┬───────────────┘
                             │
                             ▼
                    ┌────────────────────────┐
                    │  Add to sys.modules    │
                    │  (cache for future)    │
                    └────────┬───────────────┘
                             │
                             ▼
                    ┌────────────────────────┐
                    │  Return module object  │
                    └────────────────────────┘
```

**Module Lifecycle Diagram:**

```
┌─────────────────────────────────────────────────────────────┐
│  1. Import Request: "import mymodule"                      │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ 2. Check sys.modules   │ ← Module cache lookup
        │    (Already imported?) │
        └────────┬────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
     Found?            Not Found?
        │                 │
        ▼                 ▼
   Return cached    ┌────────────────────────┐
   module object    │ 3. Search sys.path     │
   (skip to end)    │    - Script directory  │
                    │    - PYTHONPATH        │
                    │    - Site-packages     │
                    │    - Standard library  │
                    └────────┬───────────────┘
                             │
                             ▼
                    ┌────────────────────────┐
                    │ 4. Find Module File    │
                    │    - mymodule.py       │
                    │    - mymodule/__init__.py│
                    │    - mymodule.so (C ext)│
                    └────────┬───────────────┘
                             │
                             ▼
                    ┌────────────────────────┐
                    │ 5. Check __pycache__  │
                    │    - mymodule.cpython-│
                    │      312.pyc          │
                    └────────┬───────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
              Found?            Not Found?
                    │                 │
                    ▼                 ▼
            Load bytecode    ┌────────────────────────┐
            (skip to 8)      │ 6. Tokenizer           │
                             │    Source → Tokens     │
                             │    [NAME, EQUAL, ...]  │
                             └────────┬───────────────┘
                                      │
                                      ▼
                             ┌────────────────────────┐
                             │ 7. Parser (PEG)        │
                             │    Tokens → AST        │
                             │    Module(body=[...])  │
                             └────────┬───────────────┘
                                      │
                                      ▼
                             ┌────────────────────────┐
                             │ 8. Compiler            │
                             │    AST → Bytecode      │
                             │    Code Object         │
                             └────────┬───────────────┘
                                      │
                                      ▼
                             ┌────────────────────────┐
                             │ 9. Save to __pycache__│
                             │    (for next import)   │
                             └────────┬───────────────┘
                                      │
                                      ▼
                             ┌────────────────────────┐
                             │ 10. Create Module     │
                             │     Object            │
                             │     (empty dict)      │
                             └────────┬───────────────┘
                                      │
                                      ▼
                             ┌────────────────────────┐
                             │ 11. Add to sys.modules│
                             │     (before execution)│
                             └────────┬───────────────┘
                                      │
                                      ▼
                             ┌────────────────────────┐
                             │ 12. Execute Bytecode  │
                             │     (top to bottom)   │
                             │     - Define functions │
                             │     - Run statements   │
                             │     - Populate module  │
                             └────────┬───────────────┘
                                      │
                                      ▼
                             ┌────────────────────────┐
                             │ 13. Return Module     │
                             │     Object            │
                             └────────────────────────┘
```

**Detailed Lifecycle Steps:**

1. **Import Request**: `import mymodule` triggers the import system
2. **Cache Check**: Check `sys.modules` for already-imported module
3. **Path Search**: If not cached, search `sys.path` for module file
4. **File Discovery**: Find `.py`, `__init__.py`, or `.so` file
5. **Bytecode Check**: Look for compiled `.pyc` in `__pycache__/`
6. **Tokenization**: If no bytecode, tokenize source code
7. **Parsing**: Parse tokens into AST (Abstract Syntax Tree)
8. **Compilation**: Compile AST to bytecode (Code Object)
9. **Bytecode Caching**: Save `.pyc` file for future imports
10. **Module Creation**: Create empty module object (dict-like)
11. **Cache Registration**: Add module to `sys.modules` (prevents circular imports)
12. **Execution**: Execute bytecode, populating module namespace
13. **Return**: Return module object to importer

**Key Points:**

- **Caching**: Modules are cached in `sys.modules` after first import
- **Bytecode**: Compiled bytecode is cached in `__pycache__/` for faster subsequent imports
- **Execution Order**: Module code executes top-to-bottom during import
- **Circular Imports**: Module added to `sys.modules` before execution (allows circular imports)
- **Reloading**: Use `importlib.reload()` to force re-execution (rarely needed)

**Example: Module Lifecycle in Action**

```python
import sys
import importlib

# Step 1: Import request
print("Before import:", 'mymodule' in sys.modules)  # False

# Step 2-13: Import process
import mymodule  # Triggers full lifecycle

print("After import:", 'mymodule' in sys.modules)  # True
print("Module object:", sys.modules['mymodule'])

# Reload (forces re-execution)
importlib.reload(mymodule)  # Re-executes steps 6-12
```

8.2.1 sys.modules

A dict of all already imported modules:

import sys
print(sys.modules["os"])


Importing the same module twice does not re-run it.

8.2.2 sys.path

Python searches for modules in:

import sys
print(sys.path)


Order:

Script directory

PYTHONPATH

Site-packages

Standard library

8.2.3 Import caching

Python stores compiled bytecode in:

__pycache__/


Example:

utils.cpython-312.pyc


This speeds up imports.

8.3 Absolute vs Relative Imports
8.3.1 Absolute Import
from project.module import func

8.3.2 Relative Import

Inside a package:

from .helpers import util
from ..core.base import BaseClass


Relative imports depend on package structure.

8.4 Packages

A package is a directory with Python modules.

Modern Python does not require __init__.py for a namespace package, but does require it for a regular package.

Example:

myapp/
  __init__.py
  models/
    __init__.py
    user.py

8.4.1 Regular packages

Directory + __init__.py.

__init__.py runs on import.

8.4.2 Namespace packages (PEP 420)

Directory without __init__.py.

Used for:

plugin systems

large vendors (Google, AWS)

multi-repo projects

Example:

google/
  cloud/
    storage/
  cloud/
    compute/


These directories merge into one namespace.

8.5 init.py: What It Really Does

__init__.py controls:

package exports

initialization

re-exports

module availability

Example:

# myapp/models/__init__.py
from .user import User
from .invoice import Invoice

__all__ = ["User", "Invoice"]

8.6 Handling Circular Imports

Circular imports occur when:

a imports b
b imports a


Solution strategies:

✔ Move imports inside functions
def use_db():
    from .db import connect

✔ Refactor into common module (common.py)
✔ Use type-check–only imports
from __future__ import annotations


Or:

if typing.TYPE_CHECKING:
    from .models import User

8.7 Project Layout Patterns

Three main patterns.

8.7.1 Flat Script Layout (small scripts)
script.py

8.7.2 Basic Package Layout (small libraries)
myproj/
  myproj/
    __init__.py
    main.py
  pyproject.toml

8.7.3 Professional Application Layout (recommended)
myapp/
  myapp/
    __init__.py
    core/
      __init__.py
      config.py
      logging.py
    api/
      __init__.py
      routes.py
    services/
      __init__.py
      users.py
      payments.py
  tests/
  pyproject.toml
  README.md

8.8 pyproject.toml (PEP 518+)

Modern Python builds use this file.

Example:

[project]
name = "myapp"
version = "0.1.0"
description = "Example project"
dependencies = [
    "requests",
    "pydantic>=2.0",
]

[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"


This replaces:

setup.py

requirements.txt

setup.cfg

MANIFEST.in

8.9 Virtual Environments
8.9.1 venv

Standard tool:

python -m venv .venv
source .venv/bin/activate

8.9.2 pyenv (Python version manager)

Install & switch versions:

pyenv install 3.12.0
pyenv global 3.12.0

8.9.3 pipx

Install isolated CLI tools:

pipx install black

8.10 Packaging & Distribution

Workflow:

write code

write pyproject.toml

build package

publish to PyPI

Build:

python -m build


Upload:

twine upload dist/*

8.11 Import Style Guide & Best Practices
✔ Use absolute imports
✔ Prefer explicit exports via __all__
✔ Do not put top-level code in modules
✔ Keep packages small and focused
✔ Avoid circular imports by design
✔ Group related modules into subpackages
8.12 Mini Example — Utilities Package
myproj/
  utils/
    __init__.py
    math.py
    strings.py
  main.py


Use:

from utils.math import add
from utils.strings import slugify

8.13 Macro Example — Production-Ready Package
myservice/
  myservice/
    __init__.py
    config.py
    http/
      __init__.py
      client.py
    db/
      __init__.py
      models.py
      repository.py
  scripts/
    seed_db.py
  tests/
  pyproject.toml


Main entrypoint:

# myservice/__main__.py
from .http.client import HttpClient
from .config import load_config

def main():
    config = load_config()
    client = HttpClient(config.api_url)
    print(client.get_status())

if __name__ == "__main__":
    main()


Run:

python -m myservice

8.14 Pitfalls & Warnings

⚠ Circular imports
⚠ Name shadowing (json.py shadowing stdlib json)
⚠ Multiple namespace packages conflicting
⚠ Accidental re-execution via relative paths
⚠ Adding directories to sys.path (avoid)
⚠ Having both src/ and root code (use src layout)

8.15 Summary & Takeaways

Modules are single Python files

Packages are module directories

Namespace packages allow multi-repo organization

Imports follow sys.modules → sys.path → file loading

pyproject.toml is the modern packaging standard

Recommended project layout improves maintainability

Proper import strategy prevents circular dependencies

8.16 Next Chapter

Proceed to:

👉 Chapter 9 — Standard Library Essentials
Covers:

os, sys, pathlib

collections, heapq, bisect

re (regex)

json, csv, configparser

datetime, zoneinfo

subprocess

logging


📘 CHAPTER 9 — STANDARD LIBRARY ESSENTIALS

Depth Level: 3
Python Versions: 3.8–3.14+
Prerequisites: Chapters 1–8

9.0 Overview

Python’s standard library is enormous and often referred to as:

“Batteries Included.”

This chapter covers the most essential 80% of modules used in:

engineering

scripting

operational work

automation

data wrangling

backend development

testing

DevOps

security

We do not cover concurrency libraries here (threading, multiprocessing, asyncio), because those have their own dedicated chapters.

9.1 Filesystem & OS Interaction

This section covers:

pathlib

os

shutil

tempfile

9.1.1 pathlib: Modern Path Handling (Preferred)
from pathlib import Path

p = Path("data") / "input.txt"

if p.exists():
    text = p.read_text()

Key API:

Path.read_text(), .read_bytes()

Path.write_text()

.mkdir(), .unlink(), .rename()

.glob(), .rglob()

.resolve()

9.1.2 os & os.path: Legacy but Common

Useful for lower-level control.

import os

files = os.listdir(".")
os.makedirs("tmp", exist_ok=True)

9.1.3 shutil: File Operations

The `shutil` module provides high-level file operations for copying, moving, and archiving.

**Copying Files and Directories:**

```python
import shutil

# Copy a single file
shutil.copy("source.txt", "dest.txt")
shutil.copy2("source.txt", "dest.txt")  # Preserves metadata

# Copy directory tree
shutil.copytree("src_dir", "dest_dir", dirs_exist_ok=True)

# Copy with permissions
shutil.copytree("src", "dst", copy_function=shutil.copy2)
```

**Moving Files:**

```python
# Move/rename file
shutil.move("old.txt", "new.txt")

# Move directory
shutil.move("old_dir", "new_dir")
```

**Removing Directories:**

```python
# Remove entire directory tree
shutil.rmtree("directory_to_remove", ignore_errors=True)
```

**Archives:**

```python
# Create archive
shutil.make_archive("backup", "zip", "myfolder")
shutil.make_archive("backup", "tar", "myfolder")
shutil.make_archive("backup", "gztar", "myfolder")  # tar.gz

# Extract archive
shutil.unpack_archive("backup.zip", "extract_to")
```

**Disk Usage:**

```python
# Get disk usage statistics
total, used, free = shutil.disk_usage("/")
print(f"Total: {total // (1024**3)} GB")
print(f"Used: {used // (1024**3)} GB")
print(f"Free: {free // (1024**3)} GB")
```

**Finding Executables:**

```python
# Find executable in PATH
python_path = shutil.which("python3")
print(python_path)  # /usr/bin/python3
```

**Key Functions:**

- `copy()`, `copy2()` — Copy files (copy2 preserves metadata)
- `copytree()` — Recursive directory copy
- `move()` — Move/rename files or directories
- `rmtree()` — Remove directory tree
- `make_archive()` — Create archives (zip, tar, gztar, bztar, xztar)
- `unpack_archive()` — Extract archives
- `disk_usage()` — Get disk space statistics
- `which()` — Find executable in PATH

**Pitfalls:**

⚠ `shutil.rmtree()` is destructive — no undo
⚠ `copytree()` fails if destination exists (use `dirs_exist_ok=True` in 3.8+)
⚠ `move()` may copy then delete on different filesystems
⚠ `move()` across filesystems can be slow for large files

9.1.4 tempfile: Secure Temporary Files

The `tempfile` module provides secure temporary file and directory creation.

**Temporary Files:**

```python
import tempfile

# Temporary file (auto-deleted on close)
with tempfile.TemporaryFile(mode='w+') as f:
    f.write("temporary data")
    f.seek(0)
    print(f.read())

# Named temporary file (visible in filesystem)
with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt') as f:
    f.write("data")
    temp_name = f.name  # Keep name for later use
```

**Temporary Directories:**

```python
# Temporary directory (auto-deleted on exit)
with tempfile.TemporaryDirectory() as tmpdir:
    print(f"Working in: {tmpdir}")
    # Create files in tmpdir
    # Automatically cleaned up on exit
```

**Low-Level Functions:**

```python
# Get temporary directory
tmpdir = tempfile.gettempdir()  # /tmp on Unix, %TEMP% on Windows

# Get user's temp directory
user_tmp = tempfile.gettempdir()

# Create temporary file name (doesn't create file)
temp_name = tempfile.mktemp(suffix='.txt')  # Deprecated, use NamedTemporaryFile

# Create temporary file name (doesn't create file) - preferred
fd, path = tempfile.mkstemp(suffix='.txt', prefix='mydata_')
try:
    with os.fdopen(fd, 'w') as f:
        f.write("data")
finally:
    os.unlink(path)  # Clean up

# Create temporary directory name (doesn't create dir)
tmpdir = tempfile.mkdtemp(suffix='_work')
try:
    # Use tmpdir
    pass
finally:
    shutil.rmtree(tmpdir)  # Clean up
```

**Security Considerations:**

```python
# Secure temporary files (3.12+)
# Uses O_TMPFILE on Linux, more secure
with tempfile.NamedTemporaryFile(mode='w', delete_on_close=True) as f:
    f.write("sensitive data")
    # File automatically deleted when closed
```

**Key Functions:**

- `TemporaryFile()` — Temporary file (auto-deleted)
- `NamedTemporaryFile()` — Named temporary file
- `TemporaryDirectory()` — Temporary directory (auto-deleted)
- `mkstemp()` — Create temp file, returns (fd, path)
- `mkdtemp()` — Create temp directory, returns path
- `gettempdir()` — Get system temp directory
- `gettempprefix()` — Get temp file prefix

**Best Practices:**

✔ Use context managers (`with` statements) for automatic cleanup
✔ Use `delete=False` with `NamedTemporaryFile()` if you need the file to persist
✔ Always clean up manually created temp files/dirs
✔ Use `suffix` and `prefix` for identifiable temp files
✔ Prefer `TemporaryDirectory()` over manual `mkdtemp()` + cleanup

**Pitfalls:**

⚠ `mktemp()` is deprecated — use `NamedTemporaryFile()` or `mkstemp()`
⚠ Temp files in `/tmp` may be world-readable — use proper permissions
⚠ Windows temp files may not auto-delete if process crashes
⚠ Race conditions possible with `mktemp()` — use `mkstemp()` instead

9.1.5 glob & fnmatch: Pattern Matching

**glob Module:**

The `glob` module finds files matching Unix shell-style patterns.

```python
import glob

# Find all Python files
python_files = glob.glob("*.py")

# Recursive search
all_py = glob.glob("**/*.py", recursive=True)

# Find files in subdirectories
configs = glob.glob("config/**/*.json", recursive=True)

# Case-insensitive (on case-insensitive filesystems)
files = glob.glob("*.TXT", root_dir=".", case_sensitive=False)
```

**Pattern Syntax:**

- `*` — Matches any sequence of characters
- `?` — Matches any single character
- `[seq]` — Matches any character in seq
- `[!seq]` — Matches any character not in seq
- `**` — Matches zero or more directories (recursive)

**Examples:**

```python
# All .txt files
txt_files = glob.glob("*.txt")

# Files starting with 'data'
data_files = glob.glob("data*")

# Single character wildcard
files = glob.glob("file?.txt")  # file1.txt, fileA.txt, etc.

# Character class
files = glob.glob("file[0-9].txt")  # file0.txt through file9.txt

# Recursive search
all_files = glob.glob("**/*", recursive=True)
```

**iglob() for Iteration:**

```python
# Memory-efficient iteration (doesn't load all at once)
for file in glob.iglob("**/*.py", recursive=True):
    print(file)
```

**fnmatch Module:**

The `fnmatch` module provides Unix shell-style wildcard matching.

```python
import fnmatch

# Match filename
if fnmatch.fnmatch("data.txt", "*.txt"):
    print("Matches")

# Case-insensitive matching
if fnmatch.fnmatch("DATA.TXT", "*.txt", casefold=True):
    print("Matches")

# Filter list of filenames
files = ["data.txt", "script.py", "readme.md"]
txt_files = fnmatch.filter(files, "*.txt")  # ["data.txt"]

# Translate pattern to regex
pattern = fnmatch.translate("*.txt")
# Returns: r'(?s:.*\.txt)\Z'
```

**Key Functions:**

- `glob.glob()` — Find files matching pattern (returns list)
- `glob.iglob()` — Find files matching pattern (returns iterator)
- `fnmatch.fnmatch()` — Test if filename matches pattern
- `fnmatch.filter()` — Filter list of filenames
- `fnmatch.translate()` — Convert pattern to regex

**Use Cases:**

- Finding configuration files
- Batch processing files
- File discovery in scripts
- Pattern-based file operations

**Pitfalls:**

⚠ `glob.glob()` loads all matches into memory — use `iglob()` for large directories
⚠ Patterns are not full regex — use `re` module for complex patterns
⚠ `**` requires `recursive=True` in `glob.glob()`
⚠ Case sensitivity depends on filesystem (Windows is case-insensitive)

9.1.6 filecmp: File Comparison

The `filecmp` module compares files and directories.

**Comparing Files:**

```python
import filecmp

# Compare two files
if filecmp.cmp("file1.txt", "file2.txt"):
    print("Files are identical")

# Shallow comparison (size, mtime)
if filecmp.cmp("file1.txt", "file2.txt", shallow=True):
    print("Files appear identical")

# Deep comparison (contents)
if filecmp.cmp("file1.txt", "file2.txt", shallow=False):
    print("Files are identical")
```

**Comparing Directories:**

```python
# Compare directories
match, mismatch, errors = filecmp.cmpfiles("dir1", "dir2", ["file1.txt", "file2.txt"])

print(f"Match: {match}")      # Files that match
print(f"Mismatch: {mismatch}") # Files that differ
print(f"Errors: {errors}")     # Files that couldn't be compared
```

**Directory Comparison Object:**

```python
# Create comparison object
dircmp = filecmp.dircmp("dir1", "dir2")

# Attributes
print(dircmp.left)      # Left directory
print(dircmp.right)     # Right directory
print(dircmp.left_list) # Files in left only
print(dircmp.right_list) # Files in right only
print(dircmp.common)    # Files in both
print(dircmp.common_dirs)  # Common subdirectories
print(dircmp.common_files) # Common files
print(dircmp.common_funny) # Names in both but different types
print(dircmp.same_files)   # Files that are identical
print(dircmp.diff_files)   # Files that differ
print(dircmp.funny_files)  # Files that couldn't be compared

# Recursive report
dircmp.report()
dircmp.report_full_closure()  # Recursive comparison
```

**Example: Directory Diff:**

```python
import filecmp

def compare_dirs(dir1, dir2):
    dircmp = filecmp.dircmp(dir1, dir2)
    
    print(f"Files only in {dir1}: {dircmp.left_only}")
    print(f"Files only in {dir2}: {dircmp.right_only}")
    print(f"Files that differ: {dircmp.diff_files}")
    print(f"Identical files: {dircmp.same_files}")
    
    # Recursively compare subdirectories
    for subdir in dircmp.common_dirs:
        compare_dirs(
            f"{dir1}/{subdir}",
            f"{dir2}/{subdir}"
        )

compare_dirs("backup1", "backup2")
```

**Key Functions:**

- `cmp()` — Compare two files
- `cmpfiles()` — Compare files in two directories
- `dircmp` — Directory comparison class

**Use Cases:**

- Backup verification
- Directory synchronization
- File integrity checking
- Testing file operations

**Pitfalls:**

⚠ `shallow=True` only compares metadata, not contents
⚠ `dircmp` doesn't recursively compare by default — use `report_full_closure()`
⚠ Large directory comparisons can be slow
⚠ Symbolic links are followed, not compared as links

9.2 Date and Time

Modules:

datetime (core)

zoneinfo (3.9+, timezone)

time (system time)

dateutil (3rd-party, recommended)

9.2.1 datetime
from datetime import datetime, timedelta

now = datetime.now()
tomorrow = now + timedelta(days=1)

9.2.2 timezone handling (critical)
from zoneinfo import ZoneInfo

dt = datetime.now(ZoneInfo("America/New_York"))

9.2.3 Parsing and formatting
dt = datetime.strptime("2025-12-05", "%Y-%m-%d")
s = dt.strftime("%Y-%m-%d")

9.3 Data Structures (collections module)

Huge productivity booster.

9.3.1 Counter
from collections import Counter
Counter("banana")

9.3.2 defaultdict
from collections import defaultdict

groups = defaultdict(list)
groups["a"].append(1)

9.3.3 deque (fast queues)
from collections import deque

q = deque()
q.append(1)
q.popleft()

9.3.4 OrderedDict

Maintained until Python 3.6 when dict became ordered; still useful for special APIs.

9.3.5 ChainMap
from collections import ChainMap

cfg = ChainMap(env_cfg, file_cfg, defaults)

9.3.6 namedtuple / dataclass

namedtuple:

from collections import namedtuple
Point = namedtuple("Point", "x y")


Prefer dataclasses for most modern code.

9.4 Algorithms: heapq & bisect
9.4.1 heapq
import heapq

h = []
heapq.heappush(h, 5)
heapq.heappush(h, 1)
print(heapq.heappop(h))


Min-heap.

9.4.2 bisect (binary search)
import bisect

bisect.bisect([1,2,3,10], 5)  # 3


Useful for sorted lists.

9.5 Text Processing

Modules:

re (regex)

string

textwrap

difflib

9.5.1 regex (re module)
import re

m = re.search(r"\d+", "Age 42")
m.group()

9.5.2 Precompiled regex
pattern = re.compile(r"\w+")

9.5.3 Key features

groups

named groups

lookaheads/lookbehinds

verbose mode

9.5.4 string module

Constants:

string.ascii_letters
string.digits
string.punctuation

9.5.5 textwrap
import textwrap
print(textwrap.fill(long_text, width=80))

9.5.6 difflib (text diffing)
import difflib

diff = difflib.ndiff(a.splitlines(), b.splitlines())


Used in patching, testing, and AI training data cleanup.

9.6 File Formats
9.6.1 JSON
import json

data = json.loads(s)
s = json.dumps(data, indent=2)

9.6.2 CSV
import csv

with open("file.csv") as f:
    r = csv.reader(f)
    for row in r:
        print(row)

9.6.3 configparser
import configparser

cfg = configparser.ConfigParser()
cfg.read("settings.ini")

9.6.4 XML
import xml.etree.ElementTree as ET

tree = ET.parse("file.xml")
root = tree.getroot()

9.6.5 pickle (⚠ dangerous)

Never unpickle untrusted data.

import pickle
pickle.dumps(obj)
pickle.loads(data)

9.6.6 html.parser: HTML Parsing

The `html.parser` module provides a simple HTML and XHTML parser.

**Basic HTML Parsing:**

```python
from html.parser import HTMLParser

class MyHTMLParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        print(f"Start tag: {tag}")
        for attr in attrs:
            print(f"  Attribute: {attr}")
    
    def handle_endtag(self, tag):
        print(f"End tag: {tag}")
    
    def handle_data(self, data):
        print(f"Data: {data}")

parser = MyHTMLParser()
html = "<html><head><title>Test</title></head><body><h1>Hello</h1></body></html>"
parser.feed(html)
```

**Extract Links:**

```python
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse

class LinkParser(HTMLParser):
    def __init__(self, base_url):
        super().__init__()
        self.base_url = base_url
        self.links = []
    
    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            for attr_name, attr_value in attrs:
                if attr_name == 'href':
                    absolute_url = urljoin(self.base_url, attr_value)
                    self.links.append(absolute_url)

parser = LinkParser('https://example.com')
html = '<a href="/page1">Link 1</a><a href="https://other.com/page2">Link 2</a>'
parser.feed(html)
print(parser.links)
```

**Extract Text Content:**

```python
from html.parser import HTMLParser

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
        self.ignore_tags = {'script', 'style'}
        self.current_tag = None
    
    def handle_starttag(self, tag, attrs):
        self.current_tag = tag
    
    def handle_endtag(self, tag):
        self.current_tag = None
    
    def handle_data(self, data):
        if self.current_tag not in self.ignore_tags:
            self.text.append(data.strip())
    
    def get_text(self):
        return ' '.join(self.text)

parser = TextExtractor()
html = "<html><body><h1>Title</h1><p>Paragraph text.</p></body></html>"
parser.feed(html)
print(parser.get_text())
```

**Key Methods:**

- `feed()` — Feed HTML data to parser
- `handle_starttag()` — Called for start tags
- `handle_endtag()` — Called for end tags
- `handle_data()` — Called for text data
- `handle_comment()` — Called for comments
- `handle_decl()` — Called for DOCTYPE
- `handle_pi()` — Called for processing instructions
- `close()` — Close parser

**Use Cases:**

- Web scraping
- HTML processing
- Link extraction
- Text extraction
- HTML validation

**Pitfalls:**

⚠ Not a full HTML5 parser (use BeautifulSoup for complex HTML)
⚠ Doesn't handle malformed HTML well
⚠ No built-in CSS selector support
⚠ Use `html.entities` for entity decoding

9.6.7 html.entities: HTML Entity Definitions

The `html.entities` module provides HTML entity definitions.

**Entity Lookup:**

```python
from html.entities import name2codepoint, codepoint2name, entitydefs

# Named entities to Unicode code points
print(name2codepoint['nbsp'])  # 160
print(name2codepoint['copy'])  # 169

# Unicode code points to entity names
print(codepoint2name[160])  # 'nbsp'
print(codepoint2name[169])  # 'copy'

# Entity definitions (deprecated, use name2codepoint)
print(entitydefs['nbsp'])  # '\xa0'
```

**Decode HTML Entities:**

```python
from html.entities import name2codepoint
import re

def decode_entities(text):
    def replace_entity(match):
        entity = match.group(1)
        if entity in name2codepoint:
            return chr(name2codepoint[entity])
        return match.group(0)
    
    # Replace named entities
    text = re.sub(r'&(\w+);', replace_entity, text)
    
    # Replace numeric entities
    text = re.sub(r'&#(\d+);', lambda m: chr(int(m.group(1))), text)
    text = re.sub(r'&#x([0-9a-fA-F]+);', lambda m: chr(int(m.group(1), 16)), text)
    
    return text

# Use html.unescape() instead (recommended)
from html import unescape
text = "&copy; 2024 &amp; Company"
decoded = unescape(text)
print(decoded)  # © 2024 & Company
```

**Key Functions:**

- `name2codepoint` — Dictionary mapping entity names to code points
- `codepoint2name` — Dictionary mapping code points to entity names
- `entitydefs` — Legacy entity definitions (deprecated)
- `html.unescape()` — Decode HTML entities (recommended)

**Use Cases:**

- HTML entity decoding
- Text processing
- Web scraping
- HTML generation

**Pitfalls:**

⚠ Use `html.unescape()` instead of manual decoding
⚠ `entitydefs` is deprecated
⚠ Numeric entities need separate handling
⚠ Always use `html.unescape()` for production code

9.6.8 xmlrpc: XML-RPC Client and Server

The `xmlrpc` package provides XML-RPC client and server implementations.

**XML-RPC Client:**

```python
import xmlrpc.client

# Create client
server = xmlrpc.client.ServerProxy('http://localhost:8000')

# Call remote method
result = server.add(5, 3)
print(result)  # 8

# Call with named parameters
result = server.subtract(x=10, y=3)
print(result)  # 7
```

**XML-RPC Server:**

```python
from xmlrpc.server import SimpleXMLRPCServer
from xmlrpc.server import SimpleXMLRPCRequestHandler

# Restrict to specific path
class RequestHandler(SimpleXMLRPCRequestHandler):
    rpc_paths = ('/RPC2',)

# Create server
server = SimpleXMLRPCServer(('localhost', 8000), requestHandler=RequestHandler)

# Register functions
def add(x, y):
    return x + y

def subtract(x, y):
    return x - y

server.register_function(add, 'add')
server.register_function(subtract, 'subtract')

# Register instance methods
class Calculator:
    def multiply(self, x, y):
        return x * y

server.register_instance(Calculator())

# Run server
print("Server running on http://localhost:8000")
server.serve_forever()
```

**Error Handling:**

```python
import xmlrpc.client

server = xmlrpc.client.ServerProxy('http://localhost:8000')

try:
    result = server.divide(10, 0)
except xmlrpc.client.Fault as e:
    print(f"Fault: {e.faultCode} - {e.faultString}")
except Exception as e:
    print(f"Error: {e}")
```

**Key Classes:**

- `ServerProxy()` — XML-RPC client
- `SimpleXMLRPCServer()` — Simple XML-RPC server
- `SimpleXMLRPCRequestHandler()` — Request handler
- `Fault` — XML-RPC fault exception

**Use Cases:**

- Remote procedure calls
- Inter-service communication
- Legacy API integration
- Simple RPC protocols

**Pitfalls:**

⚠ XML-RPC is legacy (use REST/GraphQL for new APIs)
⚠ Security concerns (use HTTPS)
⚠ Limited data types (no datetime, binary data)
⚠ Use modern alternatives (FastAPI, gRPC) for new projects

9.6.9 plistlib: Property List Files

The `plistlib` module reads and writes Apple property list files.

**Reading plist Files:**

```python
import plistlib

# Read binary plist
with open('data.plist', 'rb') as f:
    data = plistlib.load(f)
    print(data)

# Read XML plist
with open('data.plist', 'rb') as f:
    data = plistlib.loads(f.read(), fmt=plistlib.FMT_XML)
    print(data)
```

**Writing plist Files:**

```python
import plistlib

data = {
    'name': 'My App',
    'version': '1.0',
    'settings': {
        'theme': 'dark',
        'notifications': True
    }
}

# Write binary plist
with open('data.plist', 'wb') as f:
    plistlib.dump(data, f)

# Write XML plist
with open('data.xml', 'wb') as f:
    plistlib.dump(data, f, fmt=plistlib.FMT_XML)
```

**Supported Types:**

```python
import plistlib
from datetime import datetime

data = {
    'string': 'text',
    'integer': 42,
    'float': 3.14,
    'boolean': True,
    'list': [1, 2, 3],
    'dict': {'key': 'value'},
    'data': b'binary data',
    'date': datetime.now()
}

with open('data.plist', 'wb') as f:
    plistlib.dump(data, f)
```

**Key Functions:**

- `load()` — Load plist from file
- `loads()` — Load plist from bytes
- `dump()` — Write plist to file
- `dumps()` — Write plist to bytes
- `FMT_XML` — XML format
- `FMT_BINARY` — Binary format (default)

**Use Cases:**

- macOS/iOS configuration files
- Apple ecosystem integration
- Property list manipulation
- Configuration management

**Pitfalls:**

⚠ Binary format is platform-specific
⚠ Use XML format for cross-platform compatibility
⚠ Limited type support compared to JSON
⚠ Primarily for Apple ecosystem

9.6.10 marshal: Internal Python Object Serialization

The `marshal` module provides serialization of Python objects (internal use).

**Warning: Internal Use Only**

The `marshal` module is for internal Python use. Use `pickle` or `json` for general serialization.

**Basic Usage (Not Recommended):**

```python
import marshal

data = {'key': 'value', 'number': 42}

# Serialize
serialized = marshal.dumps(data)

# Deserialize
deserialized = marshal.loads(serialized)
print(deserialized)
```

**File Operations:**

```python
import marshal

data = [1, 2, 3, {'nested': 'data'}]

# Write to file
with open('data.marshal', 'wb') as f:
    marshal.dump(data, f)

# Read from file
with open('data.marshal', 'rb') as f:
    loaded = marshal.load(f)
    print(loaded)
```

**Version Compatibility:**

```python
import marshal

data = {'key': 'value'}

# Dump with version
serialized = marshal.dumps(data, version=marshal.version)

# Load with version check
try:
    loaded = marshal.loads(serialized)
except ValueError as e:
    print(f"Version mismatch: {e}")
```

**Key Functions:**

- `dumps()` — Serialize to bytes
- `loads()` — Deserialize from bytes
- `dump()` — Serialize to file
- `load()` — Deserialize from file
- `version` — Current marshal version

**Use Cases:**

- Internal Python use (bytecode, .pyc files)
- Fast serialization (faster than pickle)
- Python version-specific serialization

**Pitfalls:**

⚠ Internal use only — not for general serialization
⚠ Not secure — can execute arbitrary code
⚠ Version-dependent — may break across Python versions
⚠ Limited type support
⚠ Use `pickle` or `json` for general serialization
⚠ Never load untrusted marshal data

**When to Use:**

- ❌ General serialization → Use `pickle` or `json`
- ❌ Cross-version compatibility → Use `pickle` or `json`
- ❌ Security-sensitive data → Use `json` or `msgpack`
- ✅ Internal Python bytecode → Use `marshal`
- ✅ Performance-critical internal use → Use `marshal` (with caution)

9.6.11 Pitfalls & Warnings

⚠ `pickle` is unsafe — never unpickle untrusted data
⚠ `marshal` is internal-only — use `pickle` or `json` instead
⚠ HTML parsing — use BeautifulSoup for complex HTML
⚠ XML-RPC is legacy — use modern APIs (REST, GraphQL, gRPC)
⚠ plistlib is Apple-specific — use JSON for cross-platform
⚠ Always validate and sanitize parsed data

9.7 System Interaction

Modules:

subprocess

sys

os

signal

9.7.1 subprocess (modern usage)

Preferred API:

import subprocess

result = subprocess.run(
    ["ls", "-l"],
    capture_output=True,
    text=True,
    check=True
)

9.7.2 sys module

sys.argv

sys.exit

sys.path

sys.getsizeof

9.7.3 os module

environment

processes

permissions

file ops

9.7.4 signal handling
import signal
def handler(signum, frame):
    print("Interrupted")

signal.signal(signal.SIGINT, handler)

9.8 Networking

Modules:

urllib

requests (third-party)

socket

ssl

Requests is preferred for HTTP (but not in stdlib), but here we focus on stdlib.

9.8.1 urllib
from urllib.request import urlopen

with urlopen("https://example.com") as f:
    print(f.read())

9.8.2 low-level sockets
import socket

s = socket.socket()
s.connect(("example.com", 80))

9.8.3 ssl

Secure layers:

import ssl

ctx = ssl.create_default_context()

9.9 Compression & Archives
9.9.1 zipfile
import zipfile

with zipfile.ZipFile("archive.zip") as z:
    z.extractall()

9.9.2 tarfile
import tarfile

with tarfile.open("data.tar.gz") as t:
    t.extractall()

9.9.3 gzip/bz2/lzma
import gzip

with gzip.open("file.gz", "rt") as f:
    text = f.read()

9.10 Debugging & Introspection Tools
9.10.1 logging
import logging
logging.basicConfig(level=logging.INFO)

9.10.2 pprint

Improved printing:

from pprint import pprint
pprint(data)

9.10.3 traceback
import traceback
print(traceback.format_exc())

9.10.4 inspect

Powerful introspection:

import inspect
inspect.signature(func)
inspect.getsource(func)

9.11 Mini Example — CSV → JSON Converter
import csv, json
from pathlib import Path

def csv_to_json(path):
    rows = []
    with open(path) as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    Path(path).with_suffix(".json").write_text(json.dumps(rows, indent=2))

csv_to_json("input.csv")

9.12 Macro Example — Log Monitoring Utility

Uses:

pathlib

re

datetime

gzip

itertools

import re
import gzip
from pathlib import Path
from datetime import datetime, timezone

pattern = re.compile(r"\[(?P<ts>.*?)\] (?P<level>\w+): (?P<msg>.*)")

def parse_log(path):
    opener = gzip.open if path.suffix == ".gz" else open

    with opener(path, "rt") as f:
        for line in f:
            m = pattern.search(line)
            if not m:
                continue
            ts = datetime.fromisoformat(m["ts"]).replace(tzinfo=timezone.utc)
            yield ts, m["level"], m["msg"]

for ts, lvl, msg in parse_log(Path("logs/app.log.gz")):
    print(ts, lvl, msg)

9.13 Pitfalls & Warnings

⚠ pickle security issues
⚠ incorrect timezone handling
⚠ regex catastrophic backtracking
⚠ binary/text mode confusion
⚠ sys.path modification
⚠ subprocess shell=True (avoid)
⚠ encoding mismatches (use UTF-8 explicitly)

9.14 Summary & Takeaways

Standard library covers huge amounts of functionality

pathlib should replace os.path in most cases

collections and itertools are essential to performance

datetime + zoneinfo enable complete timezone-safe operations

regex is powerful but requires caution

subprocess.run() is safest modern API

For HTTP, use requests or httpx, not urllib

Compression modules allow processing large archives

Debugging tools (traceback, inspect) are essential

9.15 Math & Numerics

Python provides comprehensive mathematical and numerical modules in the standard library.

9.15.1 math: Mathematical Functions

The `math` module provides mathematical functions and constants.

**Constants:**

```python
import math

print(math.pi)    # 3.141592653589793
print(math.e)     # 2.718281828459045
print(math.tau)   # 6.283185307179586 (2π)
print(math.inf)   # inf (infinity)
print(math.nan)   # nan (not a number)
```

**Number-Theoretic Functions:**

```python
# Greatest common divisor
gcd = math.gcd(48, 18)  # 6

# Least common multiple (3.9+)
lcm = math.lcm(12, 8)  # 24

# Factorial
fact = math.factorial(5)  # 120

# Permutations and combinations
# Use itertools.permutations/combinations for sequences
```

**Power and Logarithmic Functions:**

```python
# Square root
sqrt = math.sqrt(16)  # 4.0

# Power
power = math.pow(2, 3)  # 8.0
# Or use ** operator: 2 ** 3

# Exponential
exp = math.exp(1)  # e^1 ≈ 2.718

# Natural logarithm
ln = math.log(math.e)  # 1.0

# Logarithm base 10
log10 = math.log10(100)  # 2.0

# Logarithm base 2
log2 = math.log2(8)  # 3.0

# Logarithm with custom base
log_base = math.log(8, 2)  # 3.0
```

**Trigonometric Functions:**

```python
# Angles in radians
angle = math.pi / 4  # 45 degrees

# Sine, cosine, tangent
sin_val = math.sin(angle)
cos_val = math.cos(angle)
tan_val = math.tan(angle)

# Inverse functions (arcsin, arccos, arctan)
asin_val = math.asin(0.5)
acos_val = math.acos(0.5)
atan_val = math.atan(1.0)

# atan2 (two-argument arctangent)
angle = math.atan2(y, x)  # Returns angle in [-π, π]

# Hyperbolic functions
sinh_val = math.sinh(1.0)
cosh_val = math.cosh(1.0)
tanh_val = math.tanh(1.0)
```

**Angular Conversion:**

```python
# Degrees to radians
rad = math.radians(90)  # π/2

# Radians to degrees
deg = math.degrees(math.pi)  # 180.0
```

**Special Functions:**

```python
# Gamma function
gamma = math.gamma(5)  # 24.0 (4!)

# Error function
erf = math.erf(1.0)

# Complementary error function
erfc = math.erfc(1.0)
```

**Rounding and Truncation:**

```python
# Ceiling (round up)
ceil = math.ceil(4.3)  # 5

# Floor (round down)
floor = math.floor(4.7)  # 4

# Truncate (toward zero)
trunc = math.trunc(-4.7)  # -4

# Round (use built-in round() for standard rounding)
rounded = round(4.6)  # 5
```

**IEEE 754 Functions:**

```python
# Check if finite
math.isfinite(1.0)  # True
math.isfinite(math.inf)  # False

# Check if infinite
math.isinf(math.inf)  # True

# Check if NaN
math.isnan(math.nan)  # True

# Copy sign
result = math.copysign(-5.0, 1.0)  # 5.0
result = math.copysign(5.0, -1.0)  # -5.0

# Next after (next representable float)
next_val = math.nextafter(1.0, 2.0)  # 1.0000000000000002
```

**Key Functions:**

- Constants: `pi`, `e`, `tau`, `inf`, `nan`
- Number theory: `gcd()`, `lcm()`, `factorial()`
- Powers: `sqrt()`, `pow()`, `exp()`, `log()`, `log10()`, `log2()`
- Trigonometry: `sin()`, `cos()`, `tan()`, `asin()`, `acos()`, `atan()`, `atan2()`
- Hyperbolic: `sinh()`, `cosh()`, `tanh()`
- Angular: `radians()`, `degrees()`
- Special: `gamma()`, `erf()`, `erfc()`
- Rounding: `ceil()`, `floor()`, `trunc()`
- IEEE 754: `isfinite()`, `isinf()`, `isnan()`, `copysign()`, `nextafter()`

**Pitfalls:**

⚠ All trigonometric functions use radians, not degrees
⚠ `math.pow()` returns float even for integer inputs
⚠ `math.factorial()` raises `ValueError` for negative numbers
⚠ Floating-point precision limits apply to all functions
⚠ Use `decimal` module for exact decimal arithmetic

9.15.2 statistics: Statistical Functions

The `statistics` module provides statistical functions for data analysis.

**Measures of Central Tendency:**

```python
import statistics

data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Mean (average)
mean = statistics.mean(data)  # 5.5

# Median (middle value)
median = statistics.median(data)  # 5.5

# Median low/high (for even-length data)
median_low = statistics.median_low([1, 2, 3, 4])  # 2
median_high = statistics.median_high([1, 2, 3, 4])  # 3

# Mode (most common value)
mode = statistics.mode([1, 2, 2, 3, 3, 3, 4])  # 3

# Multimode (all modes)
modes = statistics.multimode([1, 1, 2, 2, 3])  # [1, 2]
```

**Measures of Spread:**

```python
# Variance (population)
variance = statistics.pvariance(data)

# Variance (sample)
sample_variance = statistics.variance(data)

# Standard deviation (population)
stdev = statistics.pstdev(data)

# Standard deviation (sample)
sample_stdev = statistics.stdev(data)
```

**Quantiles:**

```python
# Median (50th percentile)
median = statistics.median(data)

# Quantiles (3.8+)
quantiles = statistics.quantiles(data, n=4)  # Quartiles
# Returns: [2.5, 5.0, 7.5]

# Specific quantiles
q1 = statistics.quantiles(data, n=4)[0]  # First quartile
q3 = statistics.quantiles(data, n=4)[2]  # Third quartile
```

**Correlation:**

```python
# Pearson correlation coefficient
x = [1, 2, 3, 4, 5]
y = [2, 4, 6, 8, 10]
correlation = statistics.correlation(x, y)  # 1.0 (perfect correlation)

# Linear regression (3.10+)
slope, intercept = statistics.linear_regression(x, y)
# y = slope * x + intercept
```

**Key Functions:**

- Central tendency: `mean()`, `median()`, `median_low()`, `median_high()`, `mode()`, `multimode()`
- Spread: `variance()`, `pvariance()`, `stdev()`, `pstdev()`
- Quantiles: `quantiles()`
- Correlation: `correlation()`, `linear_regression()`

**Use Cases:**

- Data analysis
- Statistical reporting
- Quality control
- Research and analytics

**Pitfalls:**

⚠ `mode()` raises `StatisticsError` if no unique mode exists
⚠ Population vs sample variance/stdev — use correct function
⚠ `quantiles()` requires Python 3.8+
⚠ All functions work with iterables, not just lists

9.15.3 fractions: Rational Numbers

The `fractions` module provides exact arithmetic with rational numbers.

**Creating Fractions:**

```python
from fractions import Fraction

# From numerator and denominator
f1 = Fraction(3, 4)  # 3/4

# From string
f2 = Fraction('3/4')  # 3/4
f3 = Fraction('0.75')  # 3/4

# From float (approximate)
f4 = Fraction(0.75)  # 3/4

# From decimal
from decimal import Decimal
f5 = Fraction(Decimal('0.75'))  # 3/4

# Zero and one
zero = Fraction(0)  # 0
one = Fraction(1)  # 1
```

**Fraction Operations:**

```python
f1 = Fraction(1, 3)
f2 = Fraction(1, 6)

# Arithmetic
sum_f = f1 + f2  # 1/2
diff_f = f1 - f2  # 1/6
prod_f = f1 * f2  # 1/18
quot_f = f1 / f2  # 2/1

# Power
power_f = f1 ** 2  # 1/9

# Comparison
f1 < f2  # False
f1 == Fraction(2, 6)  # True (automatically simplified)
```

**Accessing Components:**

```python
f = Fraction(3, 4)

numerator = f.numerator  # 3
denominator = f.denominator  # 4

# Convert to float
float_val = float(f)  # 0.75

# Limit denominator
f_limited = f.limit_denominator(10)  # Closest fraction with denom ≤ 10
```

**Use Cases:**

- Exact arithmetic (avoiding float precision issues)
- Financial calculations
- Mathematical computations requiring precision
- Educational applications

**Pitfalls:**

⚠ Converting from float may lose precision
⚠ Large denominators can cause performance issues
⚠ Use `limit_denominator()` to control denominator size
⚠ Fractions are immutable

9.15.4 decimal: Decimal Arithmetic

The `decimal` module provides decimal floating-point arithmetic with user-definable precision.

**Creating Decimals:**

```python
from decimal import Decimal, getcontext

# From string (preferred, exact)
d1 = Decimal('10.50')

# From integer
d2 = Decimal(10)

# From float (may have precision issues)
d3 = Decimal(10.5)  # Use string instead

# From tuple (sign, digits, exponent)
d4 = Decimal((0, (1, 0, 5), -1))  # 0.15
```

**Decimal Operations:**

```python
d1 = Decimal('10.5')
d2 = Decimal('3.2')

# Arithmetic
sum_d = d1 + d2  # 13.7
diff_d = d1 - d2  # 7.3
prod_d = d1 * d2  # 33.60
quot_d = d1 / d2  # 3.28125

# Power
power_d = d1 ** 2  # 110.25

# Square root
sqrt_d = d1.sqrt()  # 3.240370349...

# Comparison
d1 > d2  # True
```

**Precision Control:**

```python
from decimal import Decimal, getcontext, ROUND_HALF_UP

# Get current context
ctx = getcontext()

# Set precision (decimal places)
ctx.prec = 28  # Default is 28

# Set rounding mode
ctx.rounding = ROUND_HALF_UP

# Create with specific precision
d = Decimal('1.2345678901234567890')
print(d)  # Uses context precision
```

**Rounding Modes:**

```python
from decimal import (
    ROUND_CEILING, ROUND_FLOOR, ROUND_DOWN, ROUND_UP,
    ROUND_HALF_UP, ROUND_HALF_DOWN, ROUND_HALF_EVEN, ROUND_05UP
)

ctx = getcontext()
ctx.rounding = ROUND_HALF_UP

d = Decimal('1.5')
rounded = d.quantize(Decimal('0.1'))  # 1.6 (with ROUND_HALF_UP)
```

**Special Values:**

```python
from decimal import Decimal

# Infinity
inf = Decimal('Infinity')

# Negative infinity
neg_inf = Decimal('-Infinity')

# NaN
nan = Decimal('NaN')

# Check
Decimal('10').is_finite()  # True
Decimal('Infinity').is_infinite()  # True
Decimal('NaN').is_nan()  # True
```

**Use Cases:**

- Financial calculations (exact decimal arithmetic)
- Currency handling
- Scientific calculations requiring precision
- Avoiding float precision errors

**Pitfalls:**

⚠ Always create from strings to avoid float precision issues
⚠ Context precision affects all operations
⚠ Quantize for specific decimal places
⚠ Slower than float arithmetic
⚠ Use `quantize()` for rounding to specific places

9.15.5 random: Random Number Generation

The `random` module provides random number generation.

**Basic Random Numbers:**

```python
import random

# Random float in [0.0, 1.0)
r = random.random()

# Random float in [a, b]
r = random.uniform(1.0, 10.0)

# Random integer in [a, b] (inclusive)
r = random.randint(1, 10)

# Random integer in range (like range())
r = random.randrange(0, 10, 2)  # Even numbers 0-8
```

**Sequences:**

```python
# Choose random element
choice = random.choice(['a', 'b', 'c'])

# Choose k random elements (no replacement)
sample = random.sample(['a', 'b', 'c', 'd'], k=2)

# Choose k random elements (with replacement)
choices = random.choices(['a', 'b', 'c'], k=5, weights=[1, 2, 1])

# Shuffle list in place
items = [1, 2, 3, 4, 5]
random.shuffle(items)
```

**Distributions:**

```python
# Normal (Gaussian) distribution
normal = random.gauss(mu=0.0, sigma=1.0)

# Normal distribution (alternative)
normal = random.normalvariate(mu=0.0, sigma=1.0)

# Exponential distribution
exp = random.expovariate(lambd=1.0)

# Gamma distribution
gamma = random.gammavariate(alpha=2.0, beta=1.0)

# Beta distribution
beta = random.betavariate(alpha=2.0, beta=3.0)

# Triangular distribution
tri = random.triangular(low=0.0, high=1.0, mode=0.5)

# Log-normal distribution
lognorm = random.lognormvariate(mu=0.0, sigma=1.0)

# Von Mises distribution
vonmises = random.vonmisesvariate(mu=0.0, kappa=1.0)

# Pareto distribution
pareto = random.paretovariate(alpha=1.0)

# Weibull distribution
weibull = random.weibullvariate(alpha=1.0, beta=1.0)
```

**Seeding:**

```python
# Seed for reproducibility
random.seed(42)

# Seed with system time (default)
random.seed()

# Seed with bytes
random.seed(b'seed data')

# Get current state
state = random.getstate()

# Restore state
random.setstate(state)
```

**Cryptographically Secure Random:**

```python
# For security, use secrets module instead
import secrets

# Cryptographically secure random
secure_int = secrets.randbelow(100)
secure_bytes = secrets.token_bytes(16)
secure_hex = secrets.token_hex(16)
secure_url = secrets.token_urlsafe(16)
```

**Key Functions:**

- Basic: `random()`, `uniform()`, `randint()`, `randrange()`
- Sequences: `choice()`, `sample()`, `choices()`, `shuffle()`
- Distributions: `gauss()`, `expovariate()`, `gammavariate()`, `betavariate()`, etc.
- State: `seed()`, `getstate()`, `setstate()`

**Use Cases:**

- Simulations
- Games
- Testing
- Sampling
- Monte Carlo methods

**Pitfalls:**

⚠ Not cryptographically secure — use `secrets` module for security
⚠ `shuffle()` modifies list in place
⚠ `sample()` requires k ≤ len(population)
⚠ Seeding for reproducibility in testing
⚠ Distribution parameters must be valid (e.g., sigma > 0)

9.15.6 array: Efficient Arrays

The `array` module provides efficient arrays of numeric types.

**Creating Arrays:**

```python
from array import array

# Type code 'i' for signed int (platform-dependent size)
arr = array('i', [1, 2, 3, 4, 5])

# Type code 'f' for float
float_arr = array('f', [1.0, 2.0, 3.0])

# Type code 'd' for double
double_arr = array('d', [1.0, 2.0, 3.0])
```

**Type Codes:**

```python
# Signed integers
'i'  # int (platform-dependent, typically 32-bit)
'l'  # long (platform-dependent, typically 32 or 64-bit)
'q'  # signed long long (64-bit)

# Unsigned integers
'I'  # unsigned int
'L'  # unsigned long
'Q'  # unsigned long long

# Floating point
'f'  # float (32-bit)
'd'  # double (64-bit)

# Characters
'b'  # signed char
'B'  # unsigned char
'u'  # Unicode character (deprecated)
'h'  # signed short
'H'  # unsigned short
```

**Array Operations:**

```python
arr = array('i', [1, 2, 3])

# Append
arr.append(4)

# Extend
arr.extend([5, 6])

# Insert
arr.insert(0, 0)

# Remove
arr.remove(3)

# Pop
value = arr.pop()  # Remove and return last
value = arr.pop(0)  # Remove and return at index

# Index
idx = arr.index(2)  # Find index of value

# Count
count = arr.count(2)

# Reverse
arr.reverse()

# Convert to list
lst = arr.tolist()

# Convert to bytes
bytes_data = arr.tobytes()

# From bytes
arr2 = array('i')
arr2.frombytes(bytes_data)
```

**File I/O:**

```python
# Write to file
arr = array('i', [1, 2, 3, 4, 5])
with open('data.bin', 'wb') as f:
    arr.tofile(f)

# Read from file
arr2 = array('i')
with open('data.bin', 'rb') as f:
    arr2.fromfile(f, 5)  # Read 5 elements
```

**Use Cases:**

- Memory-efficient numeric arrays
- Binary file I/O
- Interfacing with C libraries
- Large numeric datasets

**Pitfalls:**

⚠ Type codes are platform-dependent for some types
⚠ Less flexible than lists (only one type)
⚠ Use NumPy for advanced array operations
⚠ `fromfile()` requires knowing element count
⚠ Arrays are mutable but type-restricted

**Comparison with Lists and NumPy:**

```python
# List: flexible, slower, more memory
lst = [1, 2, 3, 4, 5]

# Array: type-restricted, faster, less memory
arr = array('i', [1, 2, 3, 4, 5])

# NumPy: best for numerical computing
import numpy as np
np_arr = np.array([1, 2, 3, 4, 5], dtype=np.int32)
```

**When to Use:**

- ✔ Memory-constrained environments
- ✔ Binary file I/O
- ✔ C library interfacing
- ✗ Complex array operations (use NumPy)
- ✗ Mixed types (use list)

9.15.7 Mini Example — Statistical Analysis

```python
import statistics
from fractions import Fraction
from decimal import Decimal

# Sample data
scores = [85, 90, 78, 92, 88, 95, 87, 91, 89, 86]

# Basic statistics
mean_score = statistics.mean(scores)
median_score = statistics.median(scores)
stdev_score = statistics.stdev(scores)

print(f"Mean: {mean_score:.2f}")
print(f"Median: {median_score:.2f}")
print(f"Std Dev: {stdev_score:.2f}")

# Quartiles
quartiles = statistics.quantiles(scores, n=4)
print(f"Q1: {quartiles[0]:.2f}, Q2: {quartiles[1]:.2f}, Q3: {quartiles[2]:.2f}")

# Exact arithmetic with fractions
fractions = [Fraction(score, 100) for score in scores]
mean_frac = statistics.mean(fractions)
print(f"Exact mean: {mean_frac}")  # 881/10

# Financial calculation with decimal
prices = [Decimal('19.99'), Decimal('24.99'), Decimal('29.99')]
total = sum(prices)
avg_price = total / len(prices)
print(f"Average price: ${avg_price}")
```

9.15.8 Pitfalls & Warnings

⚠ `math` functions use radians, not degrees
⚠ `statistics.mode()` raises error if no unique mode
⚠ `fractions` from float may lose precision
⚠ `decimal` should be created from strings
⚠ `random` is not cryptographically secure
⚠ `array` type codes are platform-dependent
⚠ Floating-point precision limits in all modules
⚠ Use `secrets` module for security-sensitive random numbers

9.15.9 Summary & Takeaways

Math module provides comprehensive mathematical functions

Statistics module offers essential statistical analysis tools

Fractions module enables exact rational arithmetic

Decimal module provides precise decimal floating-point arithmetic

Random module generates pseudo-random numbers (use secrets for security)

Array module offers memory-efficient numeric arrays

Choose the right module for your use case (exact vs approximate, memory vs speed)

For advanced numerical computing, consider NumPy, SciPy, or pandas

9.16 Email & Internet Protocols

Python's standard library provides comprehensive modules for email handling and internet protocols.

9.16.1 email: Email Message Handling

The `email` package provides classes for constructing, parsing, and manipulating email messages.

**Creating Messages:**

```python
from email.message import EmailMessage
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

# Simple text message
msg = EmailMessage()
msg['From'] = 'sender@example.com'
msg['To'] = 'recipient@example.com'
msg['Subject'] = 'Test Email'
msg.set_content('This is a test email.')

# HTML message
html_msg = EmailMessage()
html_msg['From'] = 'sender@example.com'
html_msg['To'] = 'recipient@example.com'
html_msg['Subject'] = 'HTML Email'
html_msg.set_content('<h1>Hello</h1><p>This is HTML.</p>', subtype='html')

# Multipart message (text + HTML)
multipart = MIMEMultipart('alternative')
multipart['From'] = 'sender@example.com'
multipart['To'] = 'recipient@example.com'
multipart['Subject'] = 'Multipart Email'

text_part = MIMEText('Plain text version', 'plain')
html_part = MIMEText('<h1>HTML version</h1>', 'html')

multipart.attach(text_part)
multipart.attach(html_part)
```

**Attachments:**

```python
from email.message import EmailMessage
from pathlib import Path

msg = EmailMessage()
msg['From'] = 'sender@example.com'
msg['To'] = 'recipient@example.com'
msg['Subject'] = 'Email with Attachment'

msg.set_content('Please find attached file.')

# Add attachment
with open('document.pdf', 'rb') as f:
    file_data = f.read()
    msg.add_attachment(
        file_data,
        maintype='application',
        subtype='pdf',
        filename='document.pdf'
    )
```

**Parsing Messages:**

```python
from email.parser import BytesParser, Parser
from email import message_from_bytes, message_from_string

# Parse from bytes
with open('email.eml', 'rb') as f:
    msg = message_from_bytes(f.read())

# Parse from string
msg_str = """From: sender@example.com
To: recipient@example.com
Subject: Test

Body text.
"""
msg = message_from_string(msg_str)

# Access headers
print(msg['From'])
print(msg['To'])
print(msg['Subject'])

# Get body
body = msg.get_payload()
```

**Message Headers:**

```python
from email.message import EmailMessage

msg = EmailMessage()

# Set headers
msg['From'] = 'sender@example.com'
msg['To'] = 'recipient@example.com'
msg['Cc'] = 'cc@example.com'
msg['Bcc'] = 'bcc@example.com'
msg['Subject'] = 'Test'
msg['Date'] = 'Mon, 1 Jan 2024 12:00:00 +0000'

# Get headers
from_addr = msg['From']
to_addrs = msg.get_all('To')  # Returns list if multiple

# Check header
if 'Reply-To' in msg:
    reply_to = msg['Reply-To']
```

**Message Utilities:**

```python
from email.utils import formatdate, parsedate, formataddr, parseaddr
from datetime import datetime

# Format date
date_str = formatdate()  # RFC 2822 format
date_str = formatdate(localtime=True)

# Parse date
date_tuple = parsedate('Mon, 1 Jan 2024 12:00:00 +0000')

# Format address
addr_str = formataddr(('John Doe', 'john@example.com'))

# Parse address
name, addr = parseaddr('John Doe <john@example.com>')
```

**Key Modules:**

- `email.message` — Base message classes
- `email.mime.text` — Text messages
- `email.mime.multipart` — Multipart messages
- `email.mime.base` — Base MIME classes
- `email.parser` — Message parsing
- `email.generator` — Message generation
- `email.utils` — Utility functions
- `email.header` — Header encoding/decoding
- `email.encoders` — Content encoding

**Use Cases:**

- Email client development
- Email server implementation
- Email parsing and processing
- Automated email generation
- Email migration tools

**Pitfalls:**

⚠ Headers must be ASCII or properly encoded
⚠ Use `email.utils.formataddr()` for addresses with names
⚠ Multipart messages require proper MIME structure
⚠ Attachments must be base64 encoded for binary data
⚠ Date parsing can be complex — use `email.utils.parsedate()`

9.16.2 smtplib: SMTP Client

The `smtplib` module provides an SMTP client for sending email.

**Basic SMTP:**

```python
import smtplib
from email.message import EmailMessage

# Create message
msg = EmailMessage()
msg['From'] = 'sender@example.com'
msg['To'] = 'recipient@example.com'
msg['Subject'] = 'Test Email'
msg.set_content('This is a test.')

# Send via SMTP
with smtplib.SMTP('smtp.example.com', 587) as server:
    server.send_message(msg)
```

**SMTP with Authentication:**

```python
import smtplib
from email.message import EmailMessage

msg = EmailMessage()
msg['From'] = 'sender@example.com'
msg['To'] = 'recipient@example.com'
msg['Subject'] = 'Test Email'
msg.set_content('This is a test.')

# SMTP with TLS
with smtplib.SMTP('smtp.gmail.com', 587) as server:
    server.starttls()  # Enable TLS
    server.login('user@gmail.com', 'password')
    server.send_message(msg)

# SMTP with SSL (port 465)
with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
    server.login('user@gmail.com', 'password')
    server.send_message(msg)
```

**SMTP Methods:**

```python
import smtplib

# Create SMTP object
server = smtplib.SMTP('smtp.example.com', 587)

# Start TLS
server.starttls()

# Login
server.login('user', 'password')

# Send message
server.send_message(msg)
# Or
server.sendmail('from@example.com', 'to@example.com', msg.as_string())

# Quit
server.quit()
```

**Error Handling:**

```python
import smtplib
from smtplib import SMTPException

try:
    with smtplib.SMTP('smtp.example.com', 587) as server:
        server.starttls()
        server.login('user', 'password')
        server.send_message(msg)
except SMTPException as e:
    print(f"SMTP error: {e}")
except Exception as e:
    print(f"Error: {e}")
```

**Key Functions:**

- `SMTP()` — Create SMTP client
- `SMTP_SSL()` — Create SMTP client with SSL
- `starttls()` — Start TLS encryption
- `login()` — Authenticate
- `send_message()` — Send EmailMessage
- `sendmail()` — Send raw message
- `quit()` — Close connection

**Use Cases:**

- Automated email sending
- Email notifications
- Email reports
- Email alerts

**Pitfalls:**

⚠ Use TLS/SSL for security
⚠ Store credentials securely (use environment variables or keyring)
⚠ Handle SMTP exceptions properly
⚠ Some providers require app-specific passwords
⚠ Rate limiting may apply

9.16.3 imaplib & poplib: Email Retrieval

**imaplib — IMAP Client:**

```python
import imaplib
import email
from email.parser import BytesParser

# Connect to IMAP server
with imaplib.IMAP4_SSL('imap.gmail.com') as mail:
    # Login
    mail.login('user@gmail.com', 'password')
    
    # Select mailbox
    mail.select('INBOX')
    
    # Search for emails
    status, messages = mail.search(None, 'ALL')
    email_ids = messages[0].split()
    
    # Fetch email
    status, msg_data = mail.fetch(email_ids[0], '(RFC822)')
    email_body = msg_data[0][1]
    
    # Parse email
    msg = email.message_from_bytes(email_body)
    print(f"From: {msg['From']}")
    print(f"Subject: {msg['Subject']}")
    
    # Get body
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == 'text/plain':
                body = part.get_payload(decode=True)
                print(body.decode())
    else:
        body = msg.get_payload(decode=True)
        print(body.decode())
```

**poplib — POP3 Client:**

```python
import poplib
import email
from email.parser import BytesParser

# Connect to POP3 server
with poplib.POP3_SSL('pop.gmail.com') as mail:
    # Login
    mail.user('user@gmail.com')
    mail.pass_('password')
    
    # Get mailbox stats
    num_messages, total_size = mail.stat()
    print(f"Messages: {num_messages}, Size: {total_size}")
    
    # List messages
    messages = mail.list()
    
    # Retrieve message
    response, lines, size = mail.retr(1)  # Get message 1
    email_body = b'\n'.join(lines)
    
    # Parse email
    msg = email.message_from_bytes(email_body)
    print(f"From: {msg['From']}")
    print(f"Subject: {msg['Subject']}")
```

**Key Functions (IMAP):**

- `IMAP4_SSL()` — Create IMAP client with SSL
- `login()` — Authenticate
- `select()` — Select mailbox
- `search()` — Search for messages
- `fetch()` — Fetch message
- `store()` — Store flags
- `close()` — Close mailbox
- `logout()` — Logout

**Key Functions (POP3):**

- `POP3_SSL()` — Create POP3 client with SSL
- `user()` — Set username
- `pass_()` — Set password
- `stat()` — Get mailbox stats
- `list()` — List messages
- `retr()` — Retrieve message
- `dele()` — Delete message
- `quit()` — Close connection

**Use Cases:**

- Email clients
- Email backup tools
- Email processing scripts
- Email migration tools

**Pitfalls:**

⚠ IMAP is more feature-rich than POP3
⚠ POP3 typically deletes messages after retrieval
⚠ Use SSL/TLS for security
⚠ Handle connection errors
⚠ Some providers require app-specific passwords

9.16.4 http.client & http.server: HTTP Implementation

**http.client — HTTP Client:**

```python
import http.client
import urllib.parse

# Create connection
conn = http.client.HTTPSConnection('api.example.com')

# GET request
conn.request('GET', '/api/data')
response = conn.getresponse()
data = response.read()
print(f"Status: {response.status}")
print(f"Headers: {response.getheaders()}")
print(f"Body: {data.decode()}")

# POST request
params = urllib.parse.urlencode({'key': 'value'})
headers = {'Content-type': 'application/x-www-form-urlencoded'}
conn.request('POST', '/api/data', params, headers)
response = conn.getresponse()
data = response.read()

conn.close()
```

**http.server — HTTP Server:**

```python
from http.server import HTTPServer, BaseHTTPRequestHandler
import json

class MyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = {'message': 'Hello, World!'}
        self.wfile.write(json.dumps(response).encode())
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        # Process POST data
        data = json.loads(post_data.decode())
        response = {'received': data}
        self.wfile.write(json.dumps(response).encode())
    
    def log_message(self, format, *args):
        print(f"{self.address_string()} - {format % args}")

# Start server
server = HTTPServer(('localhost', 8000), MyHandler)
print("Server running on http://localhost:8000")
server.serve_forever()
```

**Simple HTTP Server:**

```python
from http.server import SimpleHTTPRequestHandler, HTTPServer

# Serve current directory
server = HTTPServer(('localhost', 8000), SimpleHTTPRequestHandler)
server.serve_forever()

# Or use command line:
# python -m http.server 8000
```

**Key Functions (http.client):**

- `HTTPConnection()` — Create HTTP connection
- `HTTPSConnection()` — Create HTTPS connection
- `request()` — Send request
- `getresponse()` — Get response
- `close()` — Close connection

**Key Classes (http.server):**

- `BaseHTTPRequestHandler` — Base request handler
- `SimpleHTTPRequestHandler` — Simple file server
- `HTTPServer` — HTTP server
- `ThreadingHTTPServer` — Threaded HTTP server (3.7+)

**Use Cases:**

- Simple HTTP clients
- Development servers
- File servers
- API testing
- Prototyping

**Pitfalls:**

⚠ `http.client` is low-level — use `requests` or `httpx` for production
⚠ `http.server` is for development only — not production-ready
⚠ No built-in authentication
⚠ No request routing framework
⚠ Use proper web frameworks (FastAPI, Django, Flask) for production

9.16.5 wsgiref: WSGI Reference Implementation

The `wsgiref` module provides a reference implementation of WSGI.

**WSGI Application:**

```python
def application(environ, start_response):
    status = '200 OK'
    headers = [('Content-type', 'text/html')]
    start_response(status, headers)
    return [b'<h1>Hello, World!</h1>']
```

**WSGI Server:**

```python
from wsgiref.simple_server import make_server

def application(environ, start_response):
    status = '200 OK'
    headers = [('Content-type', 'text/html')]
    start_response(status, headers)
    return [b'<h1>Hello, World!</h1>']

# Create server
with make_server('', 8000, application) as httpd:
    print("Serving on port 8000...")
    httpd.serve_forever()
```

**WSGI Utilities:**

```python
from wsgiref.util import request_uri, application_uri

def application(environ, start_response):
    # Get request URI
    uri = request_uri(environ)
    
    # Get application URI
    app_uri = application_uri(environ)
    
    status = '200 OK'
    headers = [('Content-type', 'text/plain')]
    start_response(status, headers)
    return [f"Request URI: {uri}\nApp URI: {app_uri}".encode()]
```

**Key Modules:**

- `wsgiref.simple_server` — Simple WSGI server
- `wsgiref.util` — WSGI utilities
- `wsgiref.validate` — WSGI validator
- `wsgiref.headers` — Header handling

**Use Cases:**

- WSGI application development
- WSGI server testing
- WSGI middleware development
- Learning WSGI specification

**Pitfalls:**

⚠ Reference implementation only — not for production
⚠ Single-threaded — use proper WSGI servers (gunicorn, uvicorn) for production
⚠ No async support — use ASGI for async applications
⚠ Limited features compared to production servers

9.16.6 urllib.robotparser: robots.txt Parser

The `urllib.robotparser` module parses robots.txt files for web crawler compliance.

```python
from urllib.robotparser import RobotFileParser

# Create parser
rp = RobotFileParser()
rp.set_url('https://example.com/robots.txt')
rp.read()

# Check if URL can be fetched
can_fetch = rp.can_fetch('MyBot', 'https://example.com/page.html')
print(can_fetch)  # True or False

# Get crawl delay
delay = rp.crawl_delay('MyBot')
print(delay)  # Delay in seconds or None

# Get sitemaps
sitemaps = rp.site_maps()
print(sitemaps)  # List of sitemap URLs
```

**Key Functions:**

- `set_url()` — Set robots.txt URL
- `read()` — Read and parse robots.txt
- `can_fetch()` — Check if URL can be fetched
- `crawl_delay()` — Get crawl delay for user agent
- `site_maps()` — Get sitemap URLs

**Use Cases:**

- Web crawlers
- Scrapers
- Search engine bots
- Compliance with robots.txt

**Pitfalls:**

⚠ Must respect robots.txt for ethical scraping
⚠ Some sites may block aggressive crawlers
⚠ `crawl_delay()` may return None
⚠ Always use appropriate user agent strings

9.16.7 mailbox: Mailbox Formats

The `mailbox` module provides access to various mailbox formats.

```python
import mailbox

# mbox format
mbox = mailbox.mbox('mailbox.mbox')
for message in mbox:
    print(f"From: {message['From']}")
    print(f"Subject: {message['Subject']}")

# Maildir format
maildir = mailbox.Maildir('maildir')
for key, message in maildir.items():
    print(f"From: {message['From']}")

# Add message
msg = mailbox.mboxMessage()
msg['From'] = 'sender@example.com'
msg['To'] = 'recipient@example.com'
msg['Subject'] = 'Test'
msg.set_payload('Body text')
mbox.add(msg)

# Close
mbox.close()
```

**Supported Formats:**

- `mailbox.mbox` — Unix mbox format
- `mailbox.Maildir` — Maildir format
- `mailbox.MH` — MH format
- `mailbox.Babyl` — Babyl format
- `mailbox.MMDF` — MMDF format

**Use Cases:**

- Email migration
- Email backup
- Email processing
- Mail client development

**Pitfalls:**

⚠ Different formats have different APIs
⚠ Mailbox files may be locked during access
⚠ Always close mailboxes properly
⚠ Large mailboxes can be slow to process

9.16.8 Pitfalls & Warnings

⚠ Email headers must be properly encoded
⚠ Use TLS/SSL for SMTP/IMAP/POP3
⚠ Store email credentials securely
⚠ `http.server` is for development only
⚠ `wsgiref` is reference implementation, not production
⚠ Respect robots.txt for web crawling
⚠ Handle email encoding properly (UTF-8)

9.16.9 Summary & Takeaways

email package provides comprehensive email message handling

smtplib enables sending emails via SMTP

imaplib and poplib enable retrieving emails

http.client and http.server provide low-level HTTP implementation

wsgiref provides WSGI reference implementation

urllib.robotparser enables robots.txt compliance

mailbox module supports various mailbox formats

Use proper frameworks (FastAPI, Django) for production web applications

Use proper email libraries (aiosmtplib) for async email handling

9.17 Security Modules

Python's standard library includes essential security modules for cryptography, hashing, and secure random number generation.

9.17.1 secrets: Cryptographically Secure Random

The `secrets` module provides cryptographically strong random number generation for security-sensitive applications.

**Random Tokens:**

```python
import secrets

# Generate secure random token (URL-safe)
token = secrets.token_urlsafe(32)
print(token)  # Random URL-safe string

# Generate secure random token (hex)
hex_token = secrets.token_hex(32)
print(hex_token)  # Random hexadecimal string

# Generate secure random bytes
bytes_token = secrets.token_bytes(32)
print(bytes_token)  # Random bytes
```

**Random Selection:**

```python
import secrets

# Choose random element
choice = secrets.choice(['a', 'b', 'c', 'd'])

# Generate random integer in range
rand_below = secrets.randbelow(100)  # [0, 100)

# Compare with random (constant-time)
secrets.compare_digest(b'password', b'password')  # True
secrets.compare_digest(b'password', b'wrong')  # False
```

**Key Functions:**

- `token_urlsafe()` — Generate URL-safe random token
- `token_hex()` — Generate hexadecimal random token
- `token_bytes()` — Generate random bytes
- `choice()` — Choose random element
- `randbelow()` — Random integer below n
- `compare_digest()` — Constant-time string comparison

**Use Cases:**

- Password generation
- Session tokens
- API keys
- CSRF tokens
- Secure random selection

**Pitfalls:**

⚠ Always use `secrets` for security-sensitive random numbers
⚠ `random` module is NOT cryptographically secure
⚠ `compare_digest()` prevents timing attacks
⚠ Store tokens securely (never in logs or version control)

**Example: Password Generation:**

```python
import secrets
import string

def generate_password(length=16):
    alphabet = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(secrets.choice(alphabet) for _ in range(length))
    return password

# Generate secure password
password = generate_password(20)
print(password)
```

9.17.2 hashlib: Cryptographic Hashing

The `hashlib` module provides secure hash and message digest algorithms.

**Hash Algorithms:**

```python
import hashlib

# MD5 (insecure, use only for non-security purposes)
md5_hash = hashlib.md5(b'Hello, World!')
print(md5_hash.hexdigest())

# SHA-1 (deprecated, use SHA-256 or better)
sha1_hash = hashlib.sha1(b'Hello, World!')
print(sha1_hash.hexdigest())

# SHA-256 (recommended)
sha256_hash = hashlib.sha256(b'Hello, World!')
print(sha256_hash.hexdigest())

# SHA-512
sha512_hash = hashlib.sha512(b'Hello, World!')
print(sha512_hash.hexdigest())

# SHA-3 (3.6+)
sha3_256 = hashlib.sha3_256(b'Hello, World!')
print(sha3_256.hexdigest())

# BLAKE2 (3.6+)
blake2b = hashlib.blake2b(b'Hello, World!')
print(blake2b.hexdigest())
```

**Incremental Hashing:**

```python
import hashlib

# Create hash object
sha256 = hashlib.sha256()

# Update with data
sha256.update(b'Hello, ')
sha256.update(b'World!')

# Get digest
digest = sha256.hexdigest()
print(digest)
```

**File Hashing:**

```python
import hashlib

def hash_file(filename, algorithm='sha256'):
    hash_obj = hashlib.new(algorithm)
    with open(filename, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b''):
            hash_obj.update(chunk)
    return hash_obj.hexdigest()

# Hash a file
file_hash = hash_file('document.pdf')
print(file_hash)
```

**Available Algorithms:**

```python
import hashlib

# List available algorithms
algorithms = hashlib.algorithms_available
print(algorithms)
# {'sha256', 'sha512', 'md5', 'sha1', 'blake2b', 'blake2s', 'sha3_256', ...}

# List guaranteed algorithms
guaranteed = hashlib.algorithms_guaranteed
print(guaranteed)
# {'sha256', 'sha512', 'sha384', 'sha224', 'md5', 'sha1', 'blake2b', 'blake2s', 'sha3_256', 'sha3_512', 'sha3_384', 'sha3_224'}
```

**Key Functions:**

- `md5()`, `sha1()`, `sha256()`, `sha512()` — Create hash objects
- `sha3_256()`, `sha3_512()` — SHA-3 algorithms
- `blake2b()`, `blake2s()` — BLAKE2 algorithms
- `new()` — Create hash with algorithm name
- `algorithms_available` — Available algorithms
- `algorithms_guaranteed` — Guaranteed algorithms

**Use Cases:**

- Password hashing (with salt)
- File integrity verification
- Digital signatures
- Checksums
- Data deduplication

**Pitfalls:**

⚠ MD5 and SHA-1 are cryptographically broken — use SHA-256 or better
⚠ Always use salt for password hashing
⚠ Use `hmac` for keyed hashing (HMAC)
⚠ Hash algorithms are one-way — cannot reverse
⚠ Use proper key derivation (PBKDF2, Argon2) for passwords

**Example: Password Hashing:**

```python
import hashlib
import secrets

def hash_password(password: str, salt: bytes = None) -> tuple[bytes, bytes]:
    if salt is None:
        salt = secrets.token_bytes(16)
    hash_obj = hashlib.sha256()
    hash_obj.update(salt)
    hash_obj.update(password.encode())
    return hash_obj.digest(), salt

def verify_password(password: str, hash_digest: bytes, salt: bytes) -> bool:
    hash_obj = hashlib.sha256()
    hash_obj.update(salt)
    hash_obj.update(password.encode())
    return hash_obj.digest() == hash_digest

# Hash password
password = "my_secret_password"
hash_digest, salt = hash_password(password)

# Verify password
is_valid = verify_password("my_secret_password", hash_digest, salt)
print(is_valid)  # True
```

9.17.3 hmac: Keyed-Hashing for Message Authentication

The `hmac` module implements HMAC (Hash-based Message Authentication Code).

**Basic HMAC:**

```python
import hmac
import hashlib

# Create HMAC
key = b'secret_key'
message = b'Hello, World!'
hmac_obj = hmac.new(key, message, hashlib.sha256)
signature = hmac_obj.hexdigest()
print(signature)

# Verify HMAC
received_message = b'Hello, World!'
received_signature = signature

# Recompute HMAC
hmac_obj = hmac.new(key, received_message, hashlib.sha256)
expected_signature = hmac_obj.hexdigest()

# Compare (constant-time)
is_valid = hmac.compare_digest(received_signature, expected_signature)
print(is_valid)  # True
```

**HMAC with Different Algorithms:**

```python
import hmac
import hashlib

key = b'secret_key'
message = b'Hello, World!'

# SHA-256 HMAC
hmac_sha256 = hmac.new(key, message, hashlib.sha256)

# SHA-512 HMAC
hmac_sha512 = hmac.new(key, message, hashlib.sha512)

# BLAKE2b HMAC
hmac_blake2b = hmac.new(key, message, hashlib.blake2b)
```

**HMAC for API Authentication:**

```python
import hmac
import hashlib
import time
import base64

def generate_api_signature(api_key: str, secret: str, timestamp: int) -> str:
    message = f"{api_key}{timestamp}".encode()
    signature = hmac.new(
        secret.encode(),
        message,
        hashlib.sha256
    ).hexdigest()
    return signature

def verify_api_signature(
    api_key: str,
    secret: str,
    timestamp: int,
    received_signature: str
) -> bool:
    expected = generate_api_signature(api_key, secret, timestamp)
    return hmac.compare_digest(received_signature, expected)

# Generate signature
api_key = "user123"
secret = "secret_key"
timestamp = int(time.time())
signature = generate_api_signature(api_key, secret, timestamp)

# Verify signature
is_valid = verify_api_signature(api_key, secret, timestamp, signature)
print(is_valid)  # True
```

**Key Functions:**

- `new()` — Create HMAC object
- `compare_digest()` — Constant-time comparison
- `digest()` — Get binary digest
- `hexdigest()` — Get hexadecimal digest

**Use Cases:**

- API authentication
- Message authentication
- Request signing
- Webhook verification
- Token signing

**Pitfalls:**

⚠ Always use `compare_digest()` to prevent timing attacks
⚠ Keep secret keys secure (never in code)
⚠ Use strong hash algorithms (SHA-256 or better)
⚠ Include timestamp/nonce to prevent replay attacks
⚠ HMAC provides authentication, not encryption

9.17.4 base64: Base64 Encoding

The `base64` module provides Base16, Base32, and Base64 encoding/decoding.

**Base64 Encoding:**

```python
import base64

# Encode bytes to base64
data = b'Hello, World!'
encoded = base64.b64encode(data)
print(encoded)  # b'SGVsbG8sIFdvcmxkIQ=='

# Decode base64 to bytes
decoded = base64.b64decode(encoded)
print(decoded)  # b'Hello, World!'

# Encode string
text = "Hello, World!"
encoded_str = base64.b64encode(text.encode()).decode()
print(encoded_str)  # SGVsbG8sIFdvcmxkIQ==

# Decode string
decoded_str = base64.b64decode(encoded_str).decode()
print(decoded_str)  # Hello, World!
```

**URL-Safe Base64:**

```python
import base64

# URL-safe encoding (uses - and _ instead of + and /)
data = b'Hello, World!'
encoded = base64.urlsafe_b64encode(data)
print(encoded)  # b'SGVsbG8sIFdvcmxkIQ=='

# URL-safe decoding
decoded = base64.urlsafe_b64decode(encoded)
print(decoded)  # b'Hello, World!'
```

**Base32 Encoding:**

```python
import base64

# Base32 encoding
data = b'Hello, World!'
encoded = base64.b32encode(data)
print(encoded)  # b'JBSWY3DPFQQHO33SNRSCC==='

# Base32 decoding
decoded = base64.b32decode(encoded)
print(decoded)  # b'Hello, World!'
```

**Base16 (Hex) Encoding:**

```python
import base64

# Base16 (hexadecimal) encoding
data = b'Hello, World!'
encoded = base64.b16encode(data)
print(encoded)  # b'48656C6C6F2C20576F726C6421'

# Base16 decoding
decoded = base64.b16decode(encoded)
print(decoded)  # b'Hello, World!'
```

**Encoding/Decoding with Padding:**

```python
import base64

# Encode without padding
data = b'Hello'
encoded = base64.b64encode(data, altchars=None)
print(encoded)  # b'SGVsbG8='

# Standard encoding
encoded_std = base64.standard_b64encode(data)
print(encoded_std)  # b'SGVsbG8='

# Standard decoding
decoded_std = base64.standard_b64decode(encoded_std)
print(decoded_std)  # b'Hello'
```

**File Encoding:**

```python
import base64

# Encode file to base64
with open('image.jpg', 'rb') as f:
    image_data = f.read()
    encoded = base64.b64encode(image_data)
    print(encoded[:50])  # First 50 characters

# Decode and save
decoded = base64.b64decode(encoded)
with open('image_copy.jpg', 'wb') as f:
    f.write(decoded)
```

**Key Functions:**

- `b64encode()`, `b64decode()` — Base64 encoding/decoding
- `urlsafe_b64encode()`, `urlsafe_b64decode()` — URL-safe Base64
- `b32encode()`, `b32decode()` — Base32 encoding/decoding
- `b16encode()`, `b16decode()` — Base16 (hex) encoding/decoding
- `standard_b64encode()`, `standard_b64decode()` — Standard Base64

**Use Cases:**

- Encoding binary data for text transmission
- Data URLs (images in HTML/CSS)
- API token encoding
- Email attachments (MIME)
- Storing binary data in JSON

**Pitfalls:**

⚠ Base64 is encoding, NOT encryption — data is not secure
⚠ Base64 increases data size by ~33%
⚠ Use URL-safe encoding for URLs and filenames
⚠ Padding may be required depending on use case
⚠ Always handle encoding errors

**Example: Data URL:**

```python
import base64

# Create data URL for image
with open('logo.png', 'rb') as f:
    image_data = f.read()
    encoded = base64.b64encode(image_data).decode()
    data_url = f"data:image/png;base64,{encoded}"
    print(f'<img src="{data_url}" />')
```

9.17.5 Mini Example — Secure Token Generation

```python
import secrets
import hmac
import hashlib
import base64
from datetime import datetime, timedelta

def generate_secure_token(user_id: str, secret: str) -> str:
    """Generate secure token with expiration."""
    # Create payload
    timestamp = int((datetime.now() + timedelta(hours=24)).timestamp())
    payload = f"{user_id}:{timestamp}"
    
    # Generate HMAC signature
    signature = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    # Combine payload and signature
    token_data = f"{payload}:{signature}"
    
    # Base64 encode for URL safety
    token = base64.urlsafe_b64encode(token_data.encode()).decode()
    return token

def verify_secure_token(token: str, secret: str) -> tuple[bool, str | None]:
    """Verify secure token."""
    try:
        # Decode token
        token_data = base64.urlsafe_b64decode(token.encode()).decode()
        user_id, timestamp_str, received_sig = token_data.split(':')
        
        # Check expiration
        timestamp = int(timestamp_str)
        if datetime.now().timestamp() > timestamp:
            return False, None
        
        # Verify signature
        payload = f"{user_id}:{timestamp_str}"
        expected_sig = hmac.new(
            secret.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        if hmac.compare_digest(received_sig, expected_sig):
            return True, user_id
        return False, None
    except Exception:
        return False, None

# Generate token
secret = secrets.token_urlsafe(32)
token = generate_secure_token("user123", secret)
print(f"Token: {token}")

# Verify token
is_valid, user_id = verify_secure_token(token, secret)
print(f"Valid: {is_valid}, User: {user_id}")
```

9.17.6 Pitfalls & Warnings

⚠ `secrets` module is for security — `random` is NOT secure
⚠ MD5 and SHA-1 are broken — use SHA-256 or better
⚠ Always use salt for password hashing
⚠ HMAC provides authentication, not encryption
⚠ Base64 is encoding, NOT encryption
⚠ Use `compare_digest()` to prevent timing attacks
⚠ Store secrets securely (environment variables, keyring)
⚠ Never log secrets or tokens

9.17.7 Summary & Takeaways

secrets module provides cryptographically secure random number generation

hashlib module provides secure hash algorithms (use SHA-256 or better)

hmac module provides keyed-hashing for message authentication

base64 module provides encoding for binary data in text formats

Always use `secrets` for security-sensitive random numbers

Always use `compare_digest()` for constant-time comparisons

Never use MD5 or SHA-1 for security purposes

Store secrets securely — never in code or version control

Use proper key derivation (PBKDF2, Argon2) for password hashing

Base64 is encoding, not encryption — data is not secure



📘 CHAPTER 10 — ERROR HANDLING & EXCEPTIONS

Depth Level: 3
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–9

10.0 Overview

Python treats errors as exceptions, part of a rich, flexible, and powerful system.

Key capabilities:

hierarchical exception types

catching specific or generic errors

raising new exceptions

error context propagation

exception chaining (raise ... from)

suppressing exceptions

exception groups (3.11+)

debugger integration

logging integration

retry patterns

robust error semantics for async

This chapter explores all required concepts thoroughly.

10.1 The Exception Hierarchy

All exceptions derive from:

BaseException
    ├── Exception
    │     ├── ArithmeticError
    │     ├── LookupError
    │     ├── ValueError
    │     ├── TypeError
    │     ├── RuntimeError
    │     └── ...
    ├── SystemExit
    ├── KeyboardInterrupt
    └── GeneratorExit


Only catch subclasses of Exception unless you have a very good reason not to.

10.2 try / except / else / finally

Structure:

try:
    risky_operation()
except SpecificError:
    recover()
except AnotherError as e:
    log(e)
else:
    run_if_no_exception()
finally:
    always_run_cleanup()

10.2.1 try/except
try:
    x = int(raw)
except ValueError:
    x = 0

10.2.2 else

Runs only when no exception was raised.

Useful to separate success path from failure path.

10.2.3 finally

Always executes:

cleanup

file close

resource release

10.3 Raising Exceptions

Simple:

raise ValueError("Invalid")


Re-raising:

except Exception:
    raise

10.4 Exception Chaining (Critical Knowledge)

Python preserves the root cause of an error.

10.4.1 Implicit chaining
try:
    read_config()
except OSError as e:
    raise RuntimeError("config load failed")


produces:

During handling of the above exception, another exception occurred:

10.4.2 Explicit chaining (best practice)
try:
    read_config()
except OSError as e:
    raise RuntimeError("config load failed") from e


Use this in enterprise systems to maintain traceability.

10.5 Built-In Exception Types & When to Use Them

Common categories:

Exception	Appropriate When
ValueError	wrong value given
TypeError	wrong argument type
KeyError	missing dict key
IndexError	index out of range
ZeroDivisionError	division by zero
RuntimeError	unspecified runtime failure
FileNotFoundError	missing file
PermissionError	filesystem access denied
TimeoutError	timeout exceeded
AssertionError	debugging checks (not for business logic)
10.6 Custom Exceptions

Define hierarchy:

class AppError(Exception):
    pass

class ConfigError(AppError):
    pass

class DatabaseError(AppError):
    pass

Why?

semantic clarity

grouping

catch-all for system errors

10.7 Error Codes vs Exceptions
✔ Prefer exceptions inside Python code
✔ Convert to error codes only at boundaries:

CLI tools

OS-level processes

integrations with non-Python systems

network protocols

Example CLI:

import sys

try:
    run()
except AppError:
    sys.exit(1)

10.8 Logging Integration (Real-World Required)
import logging

logger = logging.getLogger(__name__)

try:
    do_work()
except Exception as e:
    logger.exception("Work failed")

logger.exception()

Automatically prints:

message

exception type

stack trace

10.9 Warnings System (Underused & Important)
import warnings

warnings.warn("deprecated", DeprecationWarning)

Use warnings for:

deprecated APIs

unexpected but not fatal conditions

migration guidance

10.10 Error Handling Anti-Patterns

⚠ Catching Exception blindly

try:
    ...
except Exception:
    ...


⚠ Swallowing errors silently

try:
    ...
except:
    pass


⚠ Using exceptions for flow control
(Except in iterator stop semantics)

⚠ Ignoring chained exceptions

10.11 Retry Patterns & Backoff

Enterprise systems need retries.

10.11.1 Manual retry loop
for attempt in range(3):
    try:
        return api_call()
    except TimeoutError:
        sleep(2)

10.11.2 Exponential backoff
import time, random

def retry_with_backoff(fn, attempts=5):
    delay = 0.5
    for i in range(attempts):
        try:
            return fn()
        except Exception:
            time.sleep(delay)
            delay *= 2 * (1 + random.random())

10.11.3 Libraries

Recommended:

tenacity (most flexible)

backoff (simpler syntax)

10.12 Circuit Breaker Pattern

Used to avoid hammering unhealthy dependencies.

State machine:

closed → open → half-open → closed


Generic implementation:

class CircuitBreaker:
    def __init__(self):
        self.failures = 0
        self.threshold = 5
        self.open_until = None

    def call(self, fn):
        ...


Used extensively in microservices.

10.13 Exception Groups (Python 3.11+)

Allows raising multiple errors simultaneously.

10.13.1 Basic Example
raise ExceptionGroup("multiple", [ValueError(), TypeError()])

10.13.2 try/except syntax*
try:
    task_group()
except* ValueError as e:
    handle_value_errors(e)
except* TypeError as e:
    handle_type_errors(e)


This is essential in async and parallel programs.

10.14 Error Handling in Async Code

Key differences:

asyncio.gather groups exceptions

cancellations propagate through tasks

must catch exceptions inside tasks

10.14.1 catching task errors
async def worker():
    raise ValueError()

async def main():
    task = asyncio.create_task(worker())
    try:
        await task
    except Exception as e:
        print("error:", e)

10.14.2 asyncio.gather with return_exceptions=True
results = await asyncio.gather(*tasks, return_exceptions=True)

10.15 Mini Example — Robust File Loader
from pathlib import Path

def load_file(path):
    if not Path(path).exists():
        raise FileNotFoundError(path)

    try:
        return Path(path).read_text()
    except UnicodeDecodeError as e:
        raise ValueError(f"invalid encoding: {path}") from e

10.16 Macro Example — API Client with Retry + Logging + Chaining
import logging
import time
import requests

log = logging.getLogger("api")

class ApiError(Exception): pass

def request_with_backoff(url, retries=3):
    delay = 1
    for attempt in range(retries):
        try:
            r = requests.get(url, timeout=3)
            r.raise_for_status()
            return r.json()
        except Exception as e:
            log.warning("attempt %s failed: %s", attempt+1, e)
            if attempt == retries - 1:
                raise ApiError("API permanently failed") from e
            time.sleep(delay)
            delay *= 2

print(request_with_backoff("https://api.example.com/data"))


Demonstrates:

logging

chained exceptions

retry loop

backoff

custom exceptions

10.17 Pitfalls & Warnings

⚠ ignore exception chaining
⚠ broad except catching
⚠ except: pass
⚠ leaking resources (forgetting finally)
⚠ retries without backoff
⚠ mixing exception types improperly
⚠ not using logger.exception
⚠ suppressing exceptions incorrectly

10.18 Summary & Takeaways

exceptions provide clean error modeling

chain exceptions explicitly for clarity

use custom exception hierarchies

integrate with logging for observability

warnings for non-fatal issues

retry/backoff required in real-world systems

async exceptions require careful handling

exception groups (3.11+) simplify parallel error aggregation


📘 CHAPTER 11 — ARCHITECTURE & APPLICATION DESIGN

Depth Level: 3
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–10

11.0 Overview

Architecture is the art of determining:

boundaries

flows

dependencies

module responsibilities

the shape of your system

Python’s flexibility enables multiple architectural styles:

procedural

functional

OOP

service-based

FP-inspired pipelines

plugin-driven designs

This chapter focuses on modern, enterprise-grade approaches:

Clean Architecture

Hexagonal Architecture

Layered Architecture

Event-driven design

Building modular Python services

Dependency Injection

Configuration management

Monorepo structure

Packaging and feature boundaries

11.1 Why Architecture Matters in Python

Python’s dynamic nature creates both benefits and risks:

Benefits

rapid iteration

easy modularization

runtime injection possible

decorators, descriptors, metaclasses allow flexible patterns

clean dependency inversion through simple function references

Risks

circular imports

untyped or weakly typed flows

ad-hoc folder structures

global state

unbounded complexity

Architecture mitigates these risks by enforcing structure and discipline.

11.2 Layered Architecture

Classic 3–4 layer structure:

Presentation Layer (HTTP, CLI, UI)
Service Layer (Use cases)
Domain Layer (Business rules)
Data Layer (DB, external APIs)

Each layer has rules:

Lower layers must NOT import upper layers

Domain layer must NOT depend on frameworks

Services orchestrate domain rules

Presentation layer is a thin adapter

Example folder layout:

app/
  domain/
  services/
  adapters/
  infrastructure/

11.3 Clean Architecture (Robert Martin)

Core principle:

Dependencies point inward.

Diagram (Mermaid):

flowchart LR
    UI --> UseCases
    UseCases --> Entities
    Adapters --> UseCases
    Infra --> Adapters


Layers:

Entities (pure domain objects)

Use Cases (application-specific business rules)

Interface Adapters (controllers, presenters, gateways)

Frameworks & Drivers (ORM, HTTP frameworks, DB, logging)

Benefits

Testability

Decoupling

Replaceable infrastructure

Long-term maintainability

11.4 Hexagonal Architecture (Ports & Adapters)

Hexagonal architecture extends Clean Architecture.

Concepts:

Ports = abstract interfaces

Adapters = concrete implementations

Diagram:

flowchart TB
    subgraph Application
        Ports
        Domain
    end
    Adapters --> Ports
    Ports --> Adapters

Example in Python:
# ports
class UserRepo:
    def get_user(self, id): raise NotImplementedError

# adapter
class SqlUserRepo(UserRepo):
    def get_user(self, id): ...

11.5 Dependency Inversion in Python

Python enables DI without special frameworks.

3 common patterns:
11.5.1 Constructor Injection
class Service:
    def __init__(self, repo):
        self.repo = repo

11.5.2 Function Injection
def process(fetch_user):
    user = fetch_user()

11.5.3 Provider Pattern
class Container:
    db = Database()
    users = UserRepository(db)

11.6 DI Frameworks (Optional)

FastAPI’s dependency system

Lagom (FP-style)

Injector (Guice-like)

punq/simpledi

Most Python shops use manual DI for clarity and speed.

11.7 Configuration Management

Python has multiple patterns for config:

✔ Environment variables
✔ configparser / JSON / YAML
✔ pydantic models
✔ dynaconf
✔ python-decouple

Example using pydantic:

from pydantic import BaseSettings

class Settings(BaseSettings):
    db_url: str
    debug: bool = False

settings = Settings()

11.8 Monorepo vs Multirepo for Python
11.8.1 Monorepo Pros

shared utilities

simple refactoring

single dependency graph

Cons:

slow CI

internal coupling

11.8.2 Multirepo Pros

isolation

independent deploys

Cons:

cross-repo versioning

fragmentation

Recommended:

For Python microservices → multirepo
For large libraries/frameworks → monorepo

11.9 Plugin Architectures

Python excels at plugin systems:

Mechanisms:

entry points (setuptools)

importlib

dynamic module loading

registries

metaclasses

decorators

Example:

PLUGINS = {}

def plugin(fn):
    PLUGINS[fn.__name__] = fn
    return fn

11.10 Event-Driven Architecture in Python

Tools:

asyncio

message queues (Kafka, RabbitMQ, Redis Streams)

FastAPI background tasks

Celery / RQ workers

APScheduler

Pattern:

Publisher → Broker → Consumers


Event loop + tasks integration covered in Chapter 16 (Concurrency).

11.11 Clean Folder Structure for Python Apps

Recommended structure:

project/
  src/
    project/
      __init__.py
      domain/
      services/
      adapters/
      infra/
      api/
  tests/
  pyproject.toml
  README.md


Avoid:

dumping everything into root

mixing infrastructure with domain logic

circular imports from bad folder design

11.12 Avoiding Circular Imports (Architecture-Specific)

Architectural fixes:

✔ Move shared interfaces to domain/ports
✔ Move DTOs to domain layer
✔ Use dependency inversion
✔ Use local imports only when appropriate

11.13 Testing Architecture (Forward Reference)

Chapter 14 covers testing in depth, but architectural rules:

domain layer unit tests

service layer integration tests

adapter tests use mocks

end-to-end tests validate system

avoid testing private helpers

11.14 Observability in Architecture

Patterns:

structured logs

trace IDs

centralized metrics

OpenTelemetry integration

health checks

graceful shutdown

Handled in more detail in Chapters 12, 13, 16.

11.15 Mini Example — Hexagonal Task Service
class TaskRepo:
    def save(self, task): raise NotImplementedError

class MemoryTaskRepo(TaskRepo):
    def __init__(self): self.data = []
    def save(self, task): self.data.append(task)

class TaskService:
    def __init__(self, repo: TaskRepo):
        self.repo = repo
    def create(self, title):
        task = {"title": title}
        self.repo.save(task)

repo = MemoryTaskRepo()
service = TaskService(repo)
service.create("Ship product")

11.16 Macro Example — Clean Architecture Web Service

Folder:

todo/
  domain/
    task.py
    ports.py
  services/
    task_service.py
  adapters/
    repo_memory.py
  api/
    http.py


Example service:

# domain/task.py
@dataclass
class Task:
    id: int
    title: str

# domain/ports.py
class TaskRepo:
    def add(self, task): ...
    def list(self): ...

# services/task_service.py
class TaskService:
    def __init__(self, repo: TaskRepo):
        self.repo = repo
    def create(self, title):
        task = Task(id=int(time.time()), title=title)
        self.repo.add(task)


Adapters:

# adapters/repo_memory.py
class MemoryTaskRepo(TaskRepo):
    def __init__(self): self.tasks = []
    def add(self, task): self.tasks.append(task)
    def list(self): return self.tasks


HTTP Layer (FastAPI):

# api/http.py
from fastapi import FastAPI

app = FastAPI()
repo = MemoryTaskRepo()
service = TaskService(repo)

@app.post("/task")
def create_task(title: str):
    service.create(title)
    return {"status": "ok"}


Demonstrates:

DI

Clean separation

Ports/adapters

API as outer layer

11.17 Pitfalls & Warnings

⚠ designing architecture around frameworks, not domain
⚠ circular imports from bad folder layouts
⚠ overusing inheritance
⚠ leaking database logic into services
⚠ configuration mixed with business logic
⚠ DI frameworks adding unnecessary complexity
⚠ God-classes/modules
⚠ dynamically importing untrusted plugins
⚠ mixing sync and async layers incorrectly

11.18 Summary & Takeaways

Architecture exists to support change

Clean/hexagonal architectures provide longevity

Dependency inversion keeps domains pure

Python makes DI simple and explicit

Folder structure matters more than frameworks

Plugin systems should rely on registries/interfaces

Event-driven design is increasingly common

Monorepo vs multirepo should be deliberate

Avoid circular imports through inversion & structure

11.19 Next Chapter

Proceed to:

👉 Chapter 12 — Performance & Optimization

This chapter includes:

computational complexity

memory profiling

CPU profiling

NumPy vectorization

caching strategies

big-O tables

PyPy, Cython, Numba

optimizing async workloads

optimizing IO-bound workloads



📘 CHAPTER 12 — PERFORMANCE & OPTIMIZATION

Depth Level: 3
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–11

12.0 Overview

Python performance involves three major bottleneck areas:

1️⃣ CPU-bound work

Python is not fast at raw loops

GIL limits multi-threaded speed

Use vectorization / C-extension escape hatches

2️⃣ IO-bound workloads

Python is exceptionally good here

async/await, threading, multiprocessing, TaskGroups

3️⃣ Memory-bound workloads

object overhead

garbage collection

reference counting

large data structures

This chapter presents a complete performance engineering toolkit.

12.1 Understanding Python Performance Model

Python performance is shaped by:

✔ CPython interpreter
✔ GIL (3.12 and earlier)
✔ Tiered LLVM JIT (3.13+)
✔ Optional free-threading mode (3.14+)
✔ Huge object overhead (~48–72 bytes per Python object)
✔ Dynamic dispatch on attribute access
✔ Dictionaries powering everything (classes, objects, scopes)

To optimize Python code, you must understand:

where time is spent

where memory goes

how Python executes loops

when to escape to C/Rust/NumPy

12.2 Big-O Complexity (Python-Specific)
12.2.1 Built-in Operations Complexity Table
Operation	Complexity	Notes
list append	O(1) amortized	contiguous allocation
list pop(0)	O(n)	avoid
list pop()	O(1)	fast
list insert(i)	O(n)	shifts elements
dict lookup	O(1)	hash table
dict insert	O(1)	
set lookup	O(1)	
membership in list	O(n)	linear
sorted(list)	O(n log n)	Timsort
heap push/pop	O(log n)	priority queues
deque append/pop	O(1)	great for queues
12.3 Profiling Tools (CPU, Wall Time, Memory)

Profiling is step #1 in all optimization work.

12.3.1 CPU Profiling with cProfile

The `cProfile` module provides deterministic profiling of Python programs.

**Basic Usage:**

```python
import cProfile

def slow_function():
    total = 0
    for i in range(1000000):
        total += i * i
    return total

# Profile function
cProfile.run('slow_function()')
```

**Profile to File:**

```python
import cProfile
import pstats

# Profile and save to file
cProfile.run('slow_function()', 'profile_output.prof')

# Analyze profile
stats = pstats.Stats('profile_output.prof')
stats.sort_stats('cumulative')
stats.print_stats(20)  # Top 20 functions
```

**Command Line Usage:**

```bash
# Profile script
python -m cProfile -o output.prof script.py

# View with snakeviz (install: pip install snakeviz)
snakeviz output.prof

# Or use pstats
python -m pstats output.prof
```

**Profile Statistics:**

```python
import cProfile
import pstats
from io import StringIO

def profile_function(func, *args, **kwargs):
    profiler = cProfile.Profile()
    profiler.enable()
    result = func(*args, **kwargs)
    profiler.disable()
    
    # Get stats
    s = StringIO()
    stats = pstats.Stats(profiler, stream=s)
    stats.sort_stats('cumulative')
    stats.print_stats()
    print(s.getvalue())
    
    return result
```

**Key Functions:**

- `cProfile.run()` — Profile statement
- `cProfile.Profile()` — Profile object
- `pstats.Stats()` — Statistics object
- `Stats.sort_stats()` — Sort statistics
- `Stats.print_stats()` — Print statistics

**Use Cases:**

- Performance bottleneck identification
- Function call frequency analysis
- Cumulative time analysis
- Optimization guidance

**Pitfalls:**

⚠ Profiling adds overhead (~10-30%)
⚠ Use `pstats` for detailed analysis
⚠ Sort by different metrics (cumulative, time, calls)
⚠ Profile representative workloads

12.3.2 timeit: Timing Small Code Snippets

The `timeit` module provides simple timing of small code snippets.

**Basic Usage:**

```python
import timeit

# Time a statement
time = timeit.timeit('sum(range(100))', number=10000)
print(f"Time: {time:.4f} seconds")

# Time with setup
time = timeit.timeit(
    'sum(data)',
    setup='data = list(range(100))',
    number=10000
)
```

**Compare Multiple Approaches:**

```python
import timeit

# Approach 1: List comprehension
time1 = timeit.timeit(
    '[x*x for x in range(1000)]',
    number=10000
)

# Approach 2: Loop
time2 = timeit.timeit(
    '''
result = []
for x in range(1000):
    result.append(x*x)
    ''',
    number=10000
)

print(f"List comp: {time1:.4f}s")
print(f"Loop: {time2:.4f}s")
print(f"Speedup: {time2/time1:.2f}x")
```

**Command Line Usage:**

```bash
# Time statement
python -m timeit "'-'.join(str(n) for n in range(100))"

# Compare
python -m timeit "'-'.join([str(n) for n in range(100)])"
python -m timeit "'-'.join(map(str, range(100)))"
```

**Timer Class:**

```python
import timeit

# Create timer
timer = timeit.Timer('sum(range(100))')

# Time it
time = timer.timeit(number=10000)
print(f"Average: {time/10000:.6f} seconds")

# Repeat and get statistics
times = timer.repeat(repeat=5, number=10000)
print(f"Min: {min(times):.6f}s, Max: {max(times):.6f}s")
```

**Key Functions:**

- `timeit()` — Time statement
- `repeat()` — Repeat timing multiple times
- `Timer()` — Timer class for advanced usage
- `default_timer()` — Best available timer

**Use Cases:**

- Micro-benchmarking
- Comparing algorithm implementations
- Performance regression testing
- Quick timing checks

**Pitfalls:**

⚠ Only times execution, not setup
⚠ Use `number` parameter for accurate results
⚠ Warm-up effects may affect first run
⚠ Use `repeat()` for statistical significance

12.3.3 line_profiler (line-by-line CPU)

Third-party tool for line-by-line profiling.

**Installation:**

```bash
pip install line_profiler
```

**Usage:**

```python
@profile
def slow_function():
    total = 0
    for i in range(1000000):
        total += i * i
    return total

# Run with kernprof
# kernprof -l script.py
```

**Key Features:**

- Line-by-line timing
- Percentage of time per line
- Number of hits per line
- Memory usage per line (with memory_profiler)

**Use Cases:**

- Finding slow lines in functions
- Detailed performance analysis
- Optimizing hot loops

12.3.4 Memory Profiling

**memory_profiler (Third-party):**

```python
# Install: pip install memory_profiler

@profile
def memory_intensive():
    data = [0] * 1000000
    result = sum(data)
    return result

# Run: python -m memory_profiler script.py
```

**tracemalloc (stdlib) - Expanded:**

The `tracemalloc` module traces memory allocations.

**Basic Usage:**

```python
import tracemalloc

# Start tracing
tracemalloc.start()

# Run workload
data = [0] * 1000000
result = sum(data)

# Get current memory
current, peak = tracemalloc.get_traced_memory()
print(f"Current: {current / 1024 / 1024:.2f} MB")
print(f"Peak: {peak / 1024 / 1024:.2f} MB")

# Stop tracing
tracemalloc.stop()
```

**Top Memory Allocations:**

```python
import tracemalloc

tracemalloc.start()

# Run workload
data = [list(range(1000)) for _ in range(1000)]

# Get top allocations
snapshot = tracemalloc.take_snapshot()
top_stats = snapshot.statistics('lineno')

print("Top 10 allocations:")
for stat in top_stats[:10]:
    print(stat)
```

**Compare Snapshots:**

```python
import tracemalloc

tracemalloc.start()

# Take snapshot before
snapshot1 = tracemalloc.take_snapshot()

# Run workload
data = [0] * 1000000

# Take snapshot after
snapshot2 = tracemalloc.take_snapshot()

# Compare
top_stats = snapshot2.compare_to(snapshot1, 'lineno')

print("Top 10 differences:")
for stat in top_stats[:10]:
    print(stat)
```

**Filter by Filename:**

```python
import tracemalloc

tracemalloc.start()

# Run workload
data = [0] * 1000000

snapshot = tracemalloc.take_snapshot()
# Filter by filename
filtered = snapshot.filter_traces([
    tracemalloc.Filter(True, __file__)
])

top_stats = filtered.statistics('lineno')
for stat in top_stats[:5]:
    print(stat)
```

**Key Functions:**

- `start()` — Start tracing
- `stop()` — Stop tracing
- `get_traced_memory()` — Get current/peak memory
- `take_snapshot()` — Take memory snapshot
- `get_traceback_limit()` — Get traceback limit
- `get_object_traceback()` — Get traceback for object

**Use Cases:**

- Memory leak detection
- Memory usage analysis
- Finding memory hotspots
- Memory optimization

**Pitfalls:**

⚠ Tracing adds overhead (~10-20%)
⚠ Use snapshots for detailed analysis
⚠ Filter traces to focus on relevant code
⚠ Compare snapshots to find leaks

12.3.5 faulthandler: Dump Python Traceback

The `faulthandler` module dumps Python traceback on fatal errors.

**Enable faulthandler:**

```python
import faulthandler

# Enable faulthandler
faulthandler.enable()

# Your code
def crash():
    import ctypes
    ctypes.string_at(0)  # Segfault

crash()
```

**Dump on Signal:**

```python
import faulthandler
import signal

# Enable
faulthandler.enable()

# Register signal handler
faulthandler.register(signal.SIGUSR1)

# Send signal to dump traceback
# kill -USR1 <pid>
```

**Dump to File:**

```python
import faulthandler

# Dump to file on fatal error
with open('traceback.txt', 'w') as f:
    faulthandler.enable(file=f)
    
    # Your code that might crash
    pass
```

**Command Line Usage:**

```bash
# Enable faulthandler
python -X faulthandler script.py

# Or set environment variable
PYTHONFAULTHANDLER=1 python script.py
```

**Key Functions:**

- `enable()` — Enable faulthandler
- `disable()` — Disable faulthandler
- `register()` — Register signal handler
- `dump_traceback()` — Dump traceback manually
- `dump_traceback_later()` — Dump traceback after delay

**Use Cases:**

- Debugging segfaults
- Debugging hangs
- Production crash analysis
- Debugging C extensions

**Pitfalls:**

⚠ Only works for fatal errors
⚠ May not work for all crashes
⚠ Use with signal handlers for hangs
⚠ Enable early in program startup

**Example: Debugging Hang:**

```python
import faulthandler
import signal
import threading

# Enable faulthandler
faulthandler.enable()

# Register signal to dump all threads
faulthandler.register(signal.SIGUSR1, all_threads=True)

def hang():
    while True:
        pass

# Start thread that hangs
thread = threading.Thread(target=hang, daemon=True)
thread.start()

# Send SIGUSR1 to dump all thread tracebacks
# kill -USR1 <pid>
```

12.4 Common Python Performance Rules
✔ Rule 1: Avoid Python loops for numeric work

Use:

NumPy

Numba

Cython

PyPy

✔ Rule 2: Prefer list comprehensions over manual loops

Comprehensions execute in C, faster than Python loops.

✔ Rule 3: Prefer local variables to globals

Global/name resolution is slower (LOAD_GLOBAL vs LOAD_FAST).

✔ Rule 4: Avoid excessive abstraction in hot paths

Function calls are slow vs inlined operations.

✔ Rule 5: Prefer tuples over lists for fixed data

Tuples are:

smaller

faster

hashable

12.5 Memory Optimization (Critical Section)

Python objects are heavy.

12.5.1 Use slots to reduce memory
class Point:
    __slots__ = ("x", "y")

12.5.2 Use arrays for numeric data
from array import array
x = array("d", [1.0, 2.0, 3.0])


Much smaller than list of floats.

12.5.3 Use deque for queues

Lower memory overhead than list shifting.

12.5.4 Use generators for streams

Avoid loading full data:

for chunk in read_chunks(path): ...

12.5.5 Avoid large dicts / objects when possible

A Python dict entry costs ~72–140 bytes.

Alternatives:

tuple

list

struct

dataclass(slots=True)

12.6 Garbage Collection & Reference Counting

CPython uses:

✔ Reference counting
✔ Generational GC (for cycles)
✔ Immortal objects (3.12+)
✔ Free-threading support (3.14+)

Disable GC in high-performance numeric code:

import gc
gc.disable()


(but understand the risks)

12.7 Caching Strategies (Critical)
12.7.1 LRU Cache
from functools import lru_cache

@lru_cache(maxsize=128)
def heavy(x): ...

12.7.2 Memoization

Manual memo:

cache = {}
def f(x):
    if x in cache: return cache[x]
    ...

12.7.3 Disk-based caching

Use:

joblib

diskcache

sqlite3

12.7.4 Cache invalidation patterns

Document:

TTL

version tagging

data freshness

key namespacing

12.8 Optimizing IO-bound Workloads

IO-bound optimization patterns:

✔ use asyncio
✔ use buffered IO
✔ use multiprocessing for parallel IO
✔ use mmap for large files
✔ use aiofiles (file IO)
✔ use httpx/asynchttpx for async HTTP
✔ batch operations

Example:

async with httpx.AsyncClient() as client:
    r = await client.get(url)

12.9 CPU-bound Optimization

CPU-bound Python = slow Python.
Use one of these strategies:

12.9.1 NumPy Vectorization (MOST IMPORTANT)
import numpy as np
x = np.arange(1_000_000)
y = x * 2
# Output: array([0, 2, 4, ..., 1999998])

# Compare with Python loop
result = [i * 2 for i in range(1_000_000)]
# NumPy is much faster for large arrays

Performance by Array Size:

For large, numeric workloads, vectorized NumPy operations are typically 10–100× faster than equivalent pure-Python loops, because the heavy lifting happens in optimized C code and uses contiguous, typed memory.

⚠️ Important: On very small arrays (≤1e3 elements), the overhead of NumPy can actually make pure Python faster. Always benchmark your specific use case.

Size Thresholds:

small N (≤1e3): Python list comps often comparable or faster

medium N (1e4–1e6): NumPy ~10–50×

huge N (≥1e7): NumPy often 50–100×, constrained by memory bandwidth

Try This: Benchmark NumPy vs Python for your array sizes:

```python
import time
import numpy as np

def python_loop(n):
    return [i * 2 for i in range(n)]

def numpy_vectorized(n):
    return (np.arange(n) * 2).tolist()

n = 1_000_000
start = time.perf_counter()
python_loop(n)
py_time = time.perf_counter() - start

start = time.perf_counter()
numpy_vectorized(n)
np_time = time.perf_counter() - start

print(f"Python: {py_time:.4f}s, NumPy: {np_time:.4f}s")
print(f"Speedup: {py_time / np_time:.1f}×")
# Output: Python: 0.1234s, NumPy: 0.0045s
# Output: Speedup: 27.4×
```

12.9.2 Numba (JIT compiler)
from numba import njit

@njit
def fast_loop(x):
    ...

12.9.3 Cython
cpdef int add(int x, int y):
    return x + y

12.9.4 Rust Extensions (PyO3)

Best modern approach.

12.9.5 multiprocessing
from multiprocessing import Pool
Pool().map(f, data)


Bypasses the GIL.

12.10 Python 3.13: Tiered LLVM JIT

Python 3.13 introduces:

baseline JIT

optimizing tier

20–50% faster for many workloads

Requires:

PYTHON_JIT=1 python script.py

12.11 Python 3.14+: Free-Threading Mode

The GIL can be disabled via:

--disable-gil


But:

not fully stable

slower for single-thread

faster for parallel workloads

requires thread-safe libraries

12.12 Lazy Evaluation Patterns
12.12.1 Generators
values = (x*x for x in range(10_000_000))

12.12.2 iterators

Use itertools:

itertools.islice(iterable, 0, 1000)

12.12.3 Lazy loading objects

Example:

class Lazy:
    @property
    def data(self):
        if not hasattr(self, "_data"):
            self._data = load_data()
        return self._data

12.13 Extreme Optimization Patterns
✔ avoid attribute lookups in hot loops

Move:

append = list.append
for x in data:
    append(x)


Significant speedup.

✔ avoid try/except inside hot loops

Move exception handling outside loop.

✔ consider PyPy

Useful for:

pure Python loops

long-running computations

12.14 Mini Example — Fast Numeric Pipeline
import numpy as np

def pipeline():
    x = np.random.rand(1_000_000)
    y = np.sin(x)
    z = (x + y) * 2
    return z.mean()

print(pipeline())

12.15 Macro Example — Log Analyzer (Optimized)

Uses:

mmap

regex precompilation

batching

generators

memory profiling

import re, mmap
from pathlib import Path

pattern = re.compile(rb"\[(?P<ts>.*?)\] (?P<lvl>\w+): (?P<msg>.*)")

def read_large(path):
    with open(path, "rb") as f, mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ) as mm:
        for m in pattern.finditer(mm):
            yield m.group("ts"), m.group("lvl"), m.group("msg")

for ts, lvl, msg in read_large("logs.bin"):
    ...

12.16 Pitfalls & Warnings

⚠ Python loops are slow
⚠ dicts are expensive memory-wise
⚠ exception-heavy code becomes slow
⚠ premature optimization is harmful
⚠ pickle may degrade performance & adds security risks
⚠ GIL prevents parallel CPU-bound threads (≤3.12)
⚠ free-threading is not a magic bullet

12.17 Summary & Takeaways

Profile before optimizing

Use NumPy / Numba / Rust for CPU-bound code

Use asyncio for IO-bound code

Use mmap, buffered IO, batching for file work

Use caching effectively

Understand Python objects and memory overhead

Use slots, dataclasses, tuples for low memory

Effective performance requires architecture + tooling

12.18 Next Chapter

Proceed to:

👉 Chapter 13 — Security
Including:

OWASP Top 10 for Python

secure coding patterns

secrets management

dependency scanning

secure serialization

input validation

rate limiting

API hardening

common vulnerabilities



📘 CHAPTER 13 — SECURITY

Depth Level: 3
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–12

13.0 Overview

Security in Python requires understanding:

Python’s dynamic nature

insecure standard library APIs (pickle, eval, input)

dependency vulnerabilities

network attack surfaces

serialization risks

sandboxing limitations

runtime code execution risks

secure configuration patterns

secrets handling

OWASP Top 10 applied to Python

This chapter provides a practical, battle-tested guide.

13.1 The Python Security Model

Python has no built-in sandboxing.

Important facts:

Python can execute arbitrary code (via eval, exec, importlib)

Python can load arbitrary bytecode (.pyc)

Python can access the entire filesystem

Python can open network sockets

Python can spawn system processes

Therefore…

Do NOT run untrusted Python code.

13.2 OWASP Top 10 Applied to Python

We map each category to Python-specific risks.

13.2.1 Injection Attacks

Python-specific injection vectors:

SQL injection (unsafe string concatenation)

command injection (os.system(), subprocess(shell=True))

template injection (Jinja2 misconfiguration)

unsafe YAML loading

Examples:

os.system(f"rm -rf {user_input}")          # ❌
subprocess.run(user_input, shell=True)     # ❌
yaml.load(data)                            # ❌ Use safe_load

13.2.2 Broken Authentication

Common Python mistakes:

storing passwords in plain text

rolling your own auth

weak password hashing (MD5, SHA1)

insecure session cookies

Flask secret_key committed to repo

Use:

bcrypt

argon2

passlib

django/fastapi auth frameworks

13.2.3 Sensitive Data Exposure

logging secrets

not using HTTPS

misconfigured SSL

weak encryption

storing access tokens in config files

13.2.4 XML External Entity (XXE)

Use:

defusedxml


instead of xml.etree.

13.2.5 Broken Access Control

Common mistakes:

authorizing via client-side logic

trusting user-supplied IDs

direct object reference vulnerability (IDOR)

13.2.6 Security Misconfiguration

debug mode enabled

CORS wide open

no CSRF protection

unbounded file uploads

13.2.7 Cross-Site Scripting (XSS)

In Python web apps:

Jinja2 autoescape off

unsafe rendering of HTML

13.2.8 Insecure Deserialization

Critical Python risk:

Do NOT use pickle on untrusted data.
pickle.loads(b"...")  # arbitrary code execution


Use:

JSON

ormsgpack

protobuf

13.2.9 Vulnerable Dependencies

Use:

pip-audit

safety

osv-scanner

Example:

pip-audit

13.2.10 Insufficient Logging & Monitoring

Use:

structured logging

audit trails

request IDs

exception logging

13.3 Input Validation

Python needs explicit validation to avoid:

type errors

injection

malformed data

insecure parsing

13.3.1 Pydantic (recommended)
from pydantic import BaseModel, Field

class User(BaseModel):
    name: str = Field(min_length=1)
    age: int = Field(gt=0)

13.3.2 Marshmallow
from marshmallow import Schema, fields

class UserSchema(Schema):
    name = fields.Str(required=True)
    age = fields.Int(required=True)

13.3.3 cerberus / voluptuous

Useful for config validation.

13.4 Secrets Management

Secrets must never be:

hardcoded in code

committed to git

printed in logs

stored in environment variables in plaintext logs

Use:

AWS Secrets Manager

HashiCorp Vault

GCP Secret Manager

Azure Key Vault

13.4.1 Secret Rotation Patterns

time-based rotation

credential cycling

zero-downtime rotation

13.4.2 dotenv pitfalls

.env files are useful but:

should not be deployed

must not be committed

should be encrypted

13.5 Secure Serialization
Avoid:

❌ pickle
❌ shelve
❌ marshal
❌ PyYAML load()

Prefer:

✔ JSON
✔ ormsgpack
✔ msgpack
✔ protobuf
✔ pydantic JSON models

13.6 Secure Filesystem & Path Handling
13.6.1 Use pathlib to prevent path traversal
def safe_join(base: Path, user_path: str) -> Path:
    resolved = (base / user_path).resolve()
    if base not in resolved.parents:
        raise ValueError("Traversal attempt")
    return resolved

13.6.2 Avoid using user input in file paths directly
13.7 Rate Limiting & Abuse Prevention

Use:

Redis counters

token bucket algorithms

FastAPI dependencies

Nginx-level rate limits

Example token bucket:

class TokenBucket:
    def __init__(self, rate, capacity):
        self.rate = rate
        self.capacity = capacity
        self.tokens = capacity

13.8 Dependency Scanning & Supply Chain Security

Tools:

✔ pip-audit
✔ safety
✔ npm audit for frontend
✔ osv-scanner
✔ pipdeptree

Scan regularly.

13.9 Cryptography Basics in Python

Use:

from cryptography.fernet import Fernet


Never roll your own crypto.

13.9.1 Password Hashing

Use:

pip install argon2-cffi

from argon2 import PasswordHasher
ph = PasswordHasher()
hash = ph.hash("password")

13.9.2 TLS

Use secure defaults:

import ssl
ctx = ssl.create_default_context()

13.10 Sandboxing

Python cannot be sandboxed reliably.

Do NOT:

eval() untrusted code

exec() untrusted modules

unpickle unknown objects

If sandboxing is required, use:

Docker

gVisor

Firecracker

WASM

microVMs

13.11 Threat Modeling for Python Systems

Steps:

Identify entry points

Identify trust boundaries

Consider attack vectors

Identify sensitive data

Create mitigations

13.12 Secure API Design
1. Input validation (pydantic)
2. Authentication (JWT, OAuth2)
3. Authorization (RBAC, ABAC)
4. Rate limiting
5. Logging & auditing
6. Safe error messages (no stack traces)
7. CORS limits
8. HTTPS only
13.13 Secure Web Development Anti-Patterns

❌ manual SQL queries
❌ storing plaintext passwords
❌ trusting user-supplied IDs
❌ rendering raw HTML
❌ returning internal error messages
❌ disabling SSL verification
❌ using "pickle" for sessions

13.14 Mini Example — Safe Config Loader
from pydantic import BaseModel, ValidationError
from pathlib import Path
import json

class Config(BaseModel):
    db_url: str
    max_workers: int

def load_config(path):
    data = json.loads(Path(path).read_text())
    try:
        return Config(**data)
    except ValidationError as e:
        raise RuntimeError("Invalid config") from e

13.15 Macro Example — Secure FastAPI App

Features:

JWT auth

rate limiting

pydantic validation

safe logging

secure headers

from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import time

app = FastAPI()

oauth2 = OAuth2PasswordBearer(tokenUrl="token")

class Item(BaseModel):
    name: str
    quantity: int

RATE = {}
def rate_limit(ip):
    now = time.time()
    if ip not in RATE: RATE[ip] = []
    RATE[ip] = [t for t in RATE[ip] if now - t < 1]
    if len(RATE[ip]) > 5:
        raise RuntimeError("rate limit exceeded")
    RATE[ip].append(now)

@app.post("/items")
def create_item(item: Item, token: str = Depends(oauth2)):
    return {"msg": "ok", "item": item}

13.16 Pitfalls & Warnings

⚠ pickle is unsafe
⚠ eval/exec are unsafe
⚠ PyYAML load() is unsafe
⚠ secrets in logs
⚠ debug mode enabled in production
⚠ weak password hashing
⚠ bare exceptions hide vulnerabilities
⚠ unsanitized user input in file paths
⚠ insecure subprocess usage
⚠ relying solely on client-side validation

13.17 Summary & Takeaways

Python has no built-in sandbox → avoid untrusted code

Use pydantic for data validation

Avoid pickle; prefer JSON or msgpack

Use pip-audit/safety for dependency scanning

Apply OWASP Top 10 to Python frameworks

Always hash passwords (bcrypt/argon2)

Use secure TLS defaults

Implement rate limiting

Secrets belong in secret managers

Error messages must not leak internal data

13.18 Next Chapter

Proceed to:

👉 Chapter 14 — Testing & Quality Engineering
Includes:

pytest

unittest

mocking (unittest.mock, pytest-mock)

fixtures

test doubles (mocks, stubs, fakes, spies)

integration tests

E2E tests

coverage.py

test organization patterns

doctest



📘 CHAPTER 14 — TESTING & QUALITY ENGINEERING

Depth Level: 3
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–13

14.0 Overview

Testing in Python must address:

dynamic typing

runtime-bound behavior

mutation-heavy code

dependency injection patterns

async code

external systems (DB, APIs, file I/O)

This chapter establishes a complete testing discipline using:

pytest as the primary framework

unittest for legacy/testing deep internals

mocks and fakes

fixtures for maintainable tests

property-based testing

integration/E2E patterns

coverage analysis

architecture-aligned test layers

14.1 The Python Testing Landscape
14.1.1 pytest (recommended)

Features:

simple assert statements

fixtures system

plugin ecosystem

parametrization

async support

best readability

14.1.2 unittest (stdlib)

Features:

xUnit style

class-based tests

setUp/tearDown

required for legacy projects

14.1.3 hypothesis

Property-based test generation.

14.1.4 doctest

Examples embedded in docstrings.

14.2 Testing Philosophy
✔ Write tests close to the behavior, not implementation
✔ Test the contract, not private details
✔ Use fixtures for shared setup
✔ Use mocks only when needed
✔ Integration > unit tests for Python
✔ Prioritize readability and maintainability
14.3 Test Organization & Folder Structure

Recommended:

project/
  src/
    package/
      ...
  tests/
    unit/
    integration/
    e2e/
    conftest.py

14.4 Unit Testing with pytest
14.4.1 Basic Test
def test_add():
    assert add(1, 2) == 3


Run:

pytest -q

14.4.2 Parametrized Tests
@pytest.mark.parametrize("a,b,res", [
    (1, 2, 3),
    (0, 5, 5),
    (-1, 1, 0)
])
def test_add(a, b, res):
    assert add(a, b) == res

14.4.3 Testing Exceptions
def test_zero_division():
    with pytest.raises(ZeroDivisionError):
        divide(1, 0)

14.5 unittest for Legacy Code

Class-based style:

import unittest

class TestMath(unittest.TestCase):
    def test_add(self):
        self.assertEqual(add(1,2), 3)

if __name__ == "__main__":
    unittest.main()

14.6 Mocking & Test Doubles

(The Most Critical Section)

Python supports the following doubles:

✔ Mock — tracks calls, faked behavior
✔ Stub — provides fixed behavior
✔ Fake — working simplified implementation
✔ Spy — wrapper around real logic
✔ Dummy — unused placeholder argument
14.6.1 unittest.mock
from unittest.mock import Mock

repo = Mock()
repo.get_user.return_value = {"id": 1}

assert repo.get_user(1) == {"id": 1}
assert repo.get_user.called

14.6.2 monkeypatch (pytest)
def test_api(monkeypatch):
    monkeypatch.setattr("module.fetch_data", lambda: 42)
    assert module.get_processed() == 43

14.6.3 patch decorator
from unittest.mock import patch

@patch("module.Database")
def test_service(MockDB):
    MockDB.return_value.fetch.return_value = 10
    s = Service()
    assert s.compute() == 20

14.6.4 Async mocking
from unittest.mock import AsyncMock

client = AsyncMock()
client.fetch.return_value = {"msg": "ok"}

14.7 Fixtures (pytest)

Fixtures make tests clean and reusable.

14.7.1 Basic Fixture
@pytest.fixture
def numbers():
    return [1, 2, 3]

14.7.2 Fixture Scopes

function

module

package

session

Example:

@pytest.fixture(scope="session")
def db():
    return connect()

14.7.3 Autouse Fixtures
@pytest.fixture(autouse=True)
def env():
    os.environ["MODE"] = "test"

14.7.4 Parameterized Fixtures
@pytest.fixture(params=[1,2,3])
def value(request):
    return request.param

14.8 Testing Async Code
@pytest.mark.asyncio
async def test_async():
    assert await async_add(1,2) == 3


Or use pytest-asyncio auto mode.

14.9 Property-Based Testing (hypothesis)
from hypothesis import given, strategies as st

@given(st.integers(), st.integers())
def test_add(a, b):
    assert add(a, b) == add(b, a)


Hypothesis finds edge cases automatically.

14.10 Integration Testing

Integration tests validate:

DB + application

API + services

multiple modules working together

14.10.1 Database Integration Tests

Use:

sqlite in-memory

testcontainers (for real DBs)

Example:

@pytest.fixture
def db(tmp_path):
    path = tmp_path / "test.db"
    return connect(path)

14.10.2 FastAPI Integration Test

FastAPI built-in test client:

from fastapi.testclient import TestClient

client = TestClient(app)

def test_create():
    r = client.post("/items", json={"name": "x"})
    assert r.status_code == 200

14.11 End-to-End (E2E) Testing

Tools:

Playwright (browser)

Robot Framework

Selenium

Locust (load tests)

14.12 Coverage Analysis (coverage.py)

Install:

pip install coverage


Run:

coverage run -m pytest
coverage html

Target Coverage Levels
Component	Recommended
domain layer	90%+
services	80%
adapters	60%
API	50–80%
E2E	behavior-based

Coverage is not a goal — correctness is.

14.13 Mocking External Services

Examples:

HTTP
import httpx
import respx

@respx.mock
def test_http():
    respx.get("https://a.com").mock(return_value=httpx.Response(200))
    r = httpx.get("https://a.com")
    assert r.status_code == 200

Redis / Kafka

Use:

fakeredis

testcontainers

14.14 Doctest

Used to validate examples in docstrings:

def add(x, y):
    """
    >>> add(1, 2)
    3
    """
    return x + y


Run:

python -m doctest file.py

14.15 Mini Example — Testing a Service with Mocks
def test_service_calls_repo():
    repo = Mock()
    repo.save.return_value = True

    s = Service(repo)
    s.create("task")

    repo.save.assert_called_once()

14.16 Macro Example — Full Test Suite

Includes:

API tests

DB tests

service tests

unit tests

fixtures

structured folders

tests/
  unit/
  integration/
  e2e/
  conftest.py


Example:

@pytest.fixture
def memory_repo():
    return MemoryRepo()

def test_create(memory_repo):
    s = TaskService(memory_repo)
    s.create("X")
    assert memory_repo.list() == ["X"]

14.17 Pitfalls & Warnings

⚠ using too many mocks → tests lie
⚠ brittle tests that mirror implementation
⚠ skipping integration tests → hidden failures
⚠ not isolating the DB state
⚠ relying on real network in tests
⚠ test order dependence
⚠ global state shared between tests
⚠ mocking time incorrectly

14.18 Summary & Takeaways

pytest is the best tool for modern testing

fixtures make tests clean and maintainable

mocks should be used sparingly and correctly

integration tests catch most real issues

coverage is a measure, not a goal

doctest ensures documentation correctness

async testing is easy with pytest

property-based testing uncovers edge cases automatically

14.19 Next Chapter

Proceed to:

👉 Chapter 15 — Tooling & Development Workflow
including:

modern build systems: hatch, pdm

virtual environments: pyenv, venv, poetry

pre-commit hooks

formatting & linting

code quality automation

Dockerization

GitHub Actions / CI/CD patterns

documentation generation (Sphinx, MkDocs)



📘 CHAPTER 15 — TOOLING & DEVELOPMENT WORKFLOW

⚠️ Scope Note: This Bible focuses on backend/systems Python development. While we cover NumPy, Pandas, and Polars basics, we do not provide deep-dive workflows for:

Machine Learning (scikit-learn, PyTorch, TensorFlow workflows)

Data Science (Jupyter notebooks, statistical analysis)

Frontend development (though we cover FastAPI/Django APIs)

For ML/DS workflows, see specialized resources. This Bible excels at:

Production backend systems

API development

Concurrency and performance

CPython internals

System architecture

Depth Level: 3
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–14

15.0 Overview

Modern Python development requires:

proper dependency management

clean virtual environment handling

consistent formatting and linting

static typing enforcement

automated testing and CI

reproducible builds

documentation that stays up-to-date

Docker for deployment

automated package publishing

This chapter consolidates all workflows into a unified industry-standard approach.

15.1 Python Environments & Version Management

Python environments ensure isolation and reproducibility.

15.1.1 pyenv (Recommended for version control)

Install multiple Python versions:

pyenv install 3.12.2
pyenv local 3.12.2

15.1.2 venv (Standard Library)
python -m venv .venv
source .venv/bin/activate

15.1.3 python -m venv vs virtualenv

venv is built-in

virtualenv offers faster creation & extended features

15.1.4 pip-tools for locked dependencies
pip-compile
pip-sync


Ensures fully reproducible builds.

15.2 Modern Build Systems

Python’s packaging ecosystem evolved dramatically:

Legacy:

setuptools (still widely used)

Modern:

Hatch

PDM

Poetry

15.2.1 Hatch (Highly recommended)

Features:

environment management

versioning automation

build isolation

plugin architecture

pyproject.toml first

Example:

hatch new myproject
hatch run dev
hatch build
hatch publish

15.2.2 PDM

PEP 582 support (“pypackages”)

15.2.3 Poetry
poetry init
poetry add fastapi
poetry run python main.py


Provides:

dependency resolution

virtual environment management

publishing

15.3 Linting, Formatting, and Static Typing

Quality tooling ensures consistency.

15.3.1 Black (Formatter)
black src/ tests/


Formatting rules:

88 character line length

deterministic formatting

no config by default

15.3.2 Ruff (Linter + formatter)

(Most popular in 2024–2025)

ruff check .
ruff format .


Replaces:

flake8

isort

pydocstyle

pyupgrade

autoflake

15.3.3 isort (Import sorting)
isort .

15.3.4 mypy (Static Typing)
mypy src/


Supports:

generics

TypedDict

Protocols

ParamSpec

TypeVar

Self

Configuration:

# pyproject.toml
[mypy]
ignore_missing_imports = true
disallow_untyped_defs = true

15.4 Pre-Commit Hooks

Automation for code quality.

Install:

pip install pre-commit
pre-commit install


Example config:

repos:
  - repo: https://github.com/psf/black
    rev: stable
    hooks:
      - id: black

  - repo: https://github.com/charliermarsh/ruff-pre-commit
    rev: v0.2.0
    hooks:
      - id: ruff


Pre-commit ensures formatting is automatic.

15.5 Documentation Tooling

Documentation in Python is first-class.

15.5.1 Sphinx

Used for:

API docs

large-scale documentation

ReadTheDocs integration

Command:

sphinx-quickstart

15.5.2 MkDocs (Recommended for modern docs)
mkdocs new project
mkdocs serve


Themes:

Material for MkDocs

Windmill

Slate style

15.5.3 pdoc (auto API docs)
pdoc --html mypackage

15.6 Dockerization for Python Applications
15.6.1 Base Python Image Pitfalls

Avoid:

❌ python:latest
❌ python:3.12-slim with no pinned version

Prefer:

✔ python:3.12.3-slim
✔ python:3.12.3-alpine (for small runtime)

15.6.2 Multi-Stage Build Example
FROM python:3.12-slim as builder
WORKDIR /app
COPY pyproject.toml .
RUN pip install --user poetry
COPY . .
RUN poetry build

FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /root/.cache/pypoetry/ /packages
RUN pip install /packages/*.whl
CMD ["python", "-m", "app"]

15.6.3 Docker Best Practices

use .dockerignore

avoid installing dev dependencies

use non-root users

expose via gunicorn/uvicorn (not flask dev server)

healthchecks

15.7 CI/CD: GitHub Actions

GitHub Actions is the de-facto CI/CD platform for Python.

15.7.1 Basic CI Pipeline

.github/workflows/ci.yml:

name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: pytest --maxfail=1 --disable-warnings

15.7.2 Code Quality Pipeline
- run: black --check .
- run: ruff check .
- run: mypy .

15.7.3 Build & Publish
- run: pip install build twine
- run: python -m build
- run: twine upload dist/*

15.8 Versioning & Release Automation
Recommended:

semantic versioning

automatic tag generation

changelog automation

Tools:

hatch version

commitizen

bump2version

Example:

hatch version minor

15.9 Packaging: Creating Distributable Libraries

Sample pyproject.toml:

[project]
name = "mypackage"
version = "0.1.0"
dependencies = [
  "requests",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

15.10 Reproducible Builds

Use:

lock files

deterministic environments

pinned versions

Docker images

test matrix for Python versions

15.11 Mini Example — Complete Tooling Setup
project/
  pyproject.toml
  .pre-commit-config.yaml
  Dockerfile
  mkdocs.yml
  src/
  tests/


pyproject.toml includes:

ruff config

black config

mypy config

build system

dependencies

15.12 Macro Example — Full CI/CD Pipeline

Your full workflow:

Checkout

Install dependencies

Run tests

Run static analysis

Build docs

Build Docker

Push to registry

Deploy via CD pipeline

Example (GitHub Actions):

deploy:
  runs-on: ubuntu-latest
  needs: [test, build]
  steps:
    - uses: actions/checkout@v4
    - run: docker build -t myapp:${{ github.sha }} .
    - run: docker push myapp:${{ github.sha }}

15.13 Pitfalls & Warnings

⚠ Using global Python installations
⚠ Running tests against system Python
⚠ Missing lock files
⚠ Unpinned versions cause breakages
⚠ Using outdated build tools
⚠ Relying on Makefiles alone
⚠ Skipping CI checks
⚠ Running Flask dev server in production

15.14 Summary & Takeaways

Prefer pyenv + hatch for the modern workflow

Use ruff, black, mypy, and pre-commit hooks

Document everything with MkDocs or Sphinx

Automate everything with GitHub Actions

Use Docker multi-stage builds

Pin dependencies and manage reproducible environments

Keep CI/CD pipelines fast and modular

15.15 Next Chapter

Proceed to:

👉 Chapter 16 — Concurrency & Parallelism
This chapter includes:

threading

multiprocessing

asyncio

concurrent.futures

TaskGroups (3.11+)

GIL behavior

free-threading (3.14)

decision tree for concurrency models

deadlocks, races, and thread safety

async iterators, async context managers

queues for inter-task communication

real benchmark examples

diagrams showing event loop and threading model


📘 CHAPTER 16 — CONCURRENCY & PARALLELISM

Depth Level: 3
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–15

16.0 Overview

Concurrency in Python involves three major execution models:

1️⃣ Threading (concurrency for IO-bound tasks)

Lightweight OS threads

Blocked by GIL for CPU tasks

Excellent for network I/O, file I/O, HTTP clients, proxies

2️⃣ Multiprocessing (parallelism for CPU-bound tasks)

True parallel CPU usage

No GIL limitation

Costs: process spawn time, IPC overhead

3️⃣ AsyncIO (single-threaded concurrency)

Cooperative multitasking

Perfect for high-throughput, low-latency network applications

Cannot parallelize CPU work

Best for async HTTP clients/servers

Modern Python (3.11–3.14) adds:

TaskGroups for structured concurrency

exception groups

faster event loop

improved synchronization primitives

free-threading mode in 3.14

This chapter explains how to choose, implement, and combine these models.

16.1 Why Concurrency Is Hard in Python

Python concurrency suffers from:

the GIL

shared mutable state

cooperative scheduling (asyncio)

blocking system calls

library compatibility issues

lack of sandboxing

To use concurrency safely:

✔ design for immutability
✔ minimize shared state
✔ use queues
✔ isolate CPU tasks into processes
✔ use async for high-concurrency I/O

16.2 The GIL (Global Interpreter Lock)

(Non-internals version—full internals in Part V)

Purpose of the GIL:

ensures thread-safe memory management

protects reference count mutation

simplifies C-extension thread safety

Effects:

🟢 Good for:

simple threading safety

extension authors

IO-bound concurrency

🔴 Bad for:

CPU-bound parallelism — only one thread runs Python bytecode at a time

high-performance numerical code without C extensions

16.3 Free-Threading (Python 3.14+)

Python 3.14 introduces:

python3.14 --disable-gil


Meaning:

each thread runs Python code independently

reference-counting replaced with atomic ops

CPython becomes truly parallel

performance cost for single-thread workloads (~5–15% slower)

Warning: Not all C extensions support free-threading yet.

16.4 Concurrency Comparison (the famous table)
Model	Parallel?	Best For	Worst For
Threads	❌ (≤3.12) / ✅ (3.14 FT)	Network IO, HTTP clients, websockets	CPU-bound work
Multiprocessing	✅	CPU-heavy tasks, ML preprocessing	High IPC overhead
AsyncIO	❌	100k+ network connections	CPU-bound work
ThreadPoolExecutor	Limited (GIL)	mixed I/O tasks	heavy CPU work
ProcessPoolExecutor	Yes	batch CPU tasks	small tasks (overhead)
16.5 THREADING

(IO-bound concurrency model)

The `threading` module provides thread-based concurrency for I/O-bound tasks.

16.5.1 Basic Threads

**Creating and Starting Threads:**

```python
import threading
import time

def worker(name: str) -> None:
    print(f"Worker {name} starting")
    time.sleep(2)
    print(f"Worker {name} finished")

# Create thread
t = threading.Thread(target=worker, args=("A",))

# Start thread
t.start()

# Wait for thread to complete
t.join()

print("Main thread continuing")
```

**Thread with Return Value:**

```python
import threading

result = {}

def worker(data: dict) -> None:
    data['result'] = 42

# Pass mutable object to get result
t = threading.Thread(target=worker, args=(result,))
t.start()
t.join()

print(result['result'])  # 42
```

**Daemon Threads:**

```python
import threading
import time

def daemon_worker() -> None:
    while True:
        print("Daemon working...")
        time.sleep(1)

# Daemon threads exit when main program exits
t = threading.Thread(target=daemon_worker, daemon=True)
t.start()

time.sleep(3)
# Main program exits, daemon thread is killed
```

**Thread Lifecycle:**

```python
import threading

t = threading.Thread(target=worker)

print(t.is_alive())  # False (not started)
t.start()
print(t.is_alive())  # True (running)
t.join()
print(t.is_alive())  # False (completed)
```

**Key Functions:**

- `Thread()` — Create thread object
- `start()` — Start thread execution
- `join()` — Wait for thread to complete
- `is_alive()` — Check if thread is running
- `name` — Thread name (for debugging)
- `daemon` — Daemon flag (exits with main program)

16.5.2 Thread Synchronization Primitives

**Locks (Mutual Exclusion):**

```python
import threading

lock = threading.Lock()
counter = 0

def increment() -> None:
    global counter
    for _ in range(100000):
        with lock:  # Acquire lock
            counter += 1
        # Lock automatically released

# Create multiple threads
threads = []
for _ in range(5):
    t = threading.Thread(target=increment)
    threads.append(t)
    t.start()

# Wait for all threads
for t in threads:
    t.join()

print(counter)  # 500000 (correct)
```

**RLock (Reentrant Lock):**

```python
import threading

rlock = threading.RLock()

def outer() -> None:
    with rlock:
        inner()

def inner() -> None:
    with rlock:  # Can acquire same lock again
        print("Nested lock")

# RLock allows same thread to acquire multiple times
outer()
```

**Event (Thread Communication):**

```python
import threading
import time

event = threading.Event()

def waiter() -> None:
    print("Waiting for event...")
    event.wait()  # Block until event is set
    print("Event received!")

def setter() -> None:
    time.sleep(2)
    print("Setting event...")
    event.set()  # Wake up all waiting threads

t1 = threading.Thread(target=waiter)
t2 = threading.Thread(target=setter)

t1.start()
t2.start()

t1.join()
t2.join()
```

**Condition (Wait/Notify Pattern):**

```python
import threading
import time

condition = threading.Condition()
items = []

def consumer() -> None:
    with condition:
        while not items:
            condition.wait()  # Wait for notification
        item = items.pop(0)
        print(f"Consumed: {item}")

def producer() -> None:
    time.sleep(1)
    with condition:
        items.append("item")
        condition.notify()  # Wake up one waiting thread
        # Or condition.notify_all() for all threads

t1 = threading.Thread(target=consumer)
t2 = threading.Thread(target=producer)

t1.start()
t2.start()

t1.join()
t2.join()
```

**Semaphore (Resource Limiting):**

```python
import threading
import time

# Allow max 3 concurrent accesses
semaphore = threading.Semaphore(3)

def worker(name: str) -> None:
    with semaphore:
        print(f"{name} acquired semaphore")
        time.sleep(2)
        print(f"{name} releasing semaphore")

# Create 10 threads, but only 3 can run concurrently
threads = []
for i in range(10):
    t = threading.Thread(target=worker, args=(f"Worker-{i}",))
    threads.append(t)
    t.start()

for t in threads:
    t.join()
```

**Barrier (Synchronization Point):**

```python
import threading

# Wait for 3 threads to reach barrier
barrier = threading.Barrier(3)

def worker(name: str) -> None:
    print(f"{name} starting")
    barrier.wait()  # Wait for all threads
    print(f"{name} passed barrier")

threads = []
for i in range(3):
    t = threading.Thread(target=worker, args=(f"Thread-{i}",))
    threads.append(t)
    t.start()

for t in threads:
    t.join()
```

**Timer (Delayed Execution):**

```python
import threading

def delayed_task() -> None:
    print("This runs after 5 seconds")

# Create timer
timer = threading.Timer(5.0, delayed_task)
timer.start()

# Can cancel before execution
# timer.cancel()
```

**Key Synchronization Primitives:**

- `Lock()` — Basic mutual exclusion lock
- `RLock()` — Reentrant lock (same thread can acquire multiple times)
- `Event()` — Simple event signaling
- `Condition()` — Wait/notify pattern
- `Semaphore()` — Resource limiting
- `Barrier()` — Synchronization point
- `Timer()` — Delayed execution

16.5.3 Race Conditions

**The Problem:**

```python
import threading

counter = 0

def increment() -> None:
    global counter
    for _ in range(100000):
        counter += 1  # NOT ATOMIC!

threads = []
for _ in range(5):
    t = threading.Thread(target=increment)
    threads.append(t)
    t.start()

for t in threads:
    t.join()

print(counter)  # May be less than 500000!
```

**Why Race Conditions Occur:**

Even with the GIL, operations like `counter += 1` are not atomic:
1. Read `counter` value
2. Increment value
3. Write back to `counter`

Between steps, another thread can modify `counter`.

**Solution: Use Locks:**

```python
import threading

counter = 0
lock = threading.Lock()

def increment() -> None:
    global counter
    for _ in range(100000):
        with lock:
            counter += 1  # Now atomic

threads = []
for _ in range(5):
    t = threading.Thread(target=increment)
    threads.append(t)
    t.start()

for t in threads:
    t.join()

print(counter)  # Always 500000
```

**Common Race Condition Patterns:**

```python
# ❌ BAD: Shared mutable state without protection
shared_list = []

def append_item(item: int) -> None:
    shared_list.append(item)  # Race condition!

# ✅ GOOD: Use lock
lock = threading.Lock()
shared_list = []

def append_item(item: int) -> None:
    with lock:
        shared_list.append(item)

# ✅ BETTER: Use queue (thread-safe)
from queue import Queue
q = Queue()

def append_item(item: int) -> None:
    q.put(item)  # Thread-safe
```

16.5.4 Thread-Local Storage

**Thread-Local Variables:**

```python
import threading

# Create thread-local storage
local_data = threading.local()

def worker(name: str) -> None:
    local_data.value = name
    print(f"Thread {name}: {local_data.value}")

threads = []
for i in range(3):
    t = threading.Thread(target=worker, args=(f"T{i}",))
    threads.append(t)
    t.start()

for t in threads:
    t.join()
```

**Thread-Local with Default:**

```python
import threading

def get_local_data() -> threading.local:
    local = threading.local()
    if not hasattr(local, 'value'):
        local.value = 'default'
    return local

local_data = threading.local()

def worker(name: str) -> None:
    if not hasattr(local_data, 'value'):
        local_data.value = 'default'
    local_data.value = name
    print(local_data.value)
```

**Use Cases:**

- Request context in web servers
- Database connections per thread
- User session data
- Avoiding shared state

16.5.5 Queues (Thread-Safe Communication)

**Queue Module:**

```python
from queue import Queue, LifoQueue, PriorityQueue
import threading
import time

# FIFO Queue
q = Queue()

def producer() -> None:
    for i in range(5):
        q.put(i)
        print(f"Produced: {i}")
        time.sleep(0.1)

def consumer() -> None:
    while True:
        item = q.get()
        if item is None:  # Sentinel value
            break
        print(f"Consumed: {item}")
        q.task_done()

# Start threads
t1 = threading.Thread(target=producer)
t2 = threading.Thread(target=consumer)

t1.start()
t2.start()

t1.join()
q.put(None)  # Signal completion
t2.join()
```

**LIFO Queue (Stack):**

```python
from queue import LifoQueue

stack = LifoQueue()

stack.put(1)
stack.put(2)
stack.put(3)

print(stack.get())  # 3 (last in, first out)
print(stack.get())  # 2
print(stack.get())  # 1
```

**Priority Queue:**

```python
from queue import PriorityQueue

pq = PriorityQueue()

# Lower number = higher priority
pq.put((3, "low priority"))
pq.put((1, "high priority"))
pq.put((2, "medium priority"))

print(pq.get())  # (1, "high priority")
print(pq.get())  # (2, "medium priority")
print(pq.get())  # (3, "low priority")
```

**Queue with Timeout:**

```python
from queue import Queue, Empty

q = Queue()

try:
    item = q.get(timeout=5.0)  # Wait max 5 seconds
except Empty:
    print("Queue is empty")
```

**Queue Methods:**

- `put()` — Add item (blocks if full)
- `get()` — Remove item (blocks if empty)
- `put_nowait()` — Add without blocking
- `get_nowait()` — Remove without blocking
- `empty()` — Check if empty
- `full()` — Check if full
- `qsize()` — Get approximate size
- `task_done()` — Mark task as done
- `join()` — Wait for all tasks to complete

**Producer-Consumer Pattern:**

```python
from queue import Queue
import threading

q = Queue(maxsize=10)  # Limit queue size

def producer() -> None:
    for i in range(20):
        q.put(i)
        print(f"Produced: {i}")

def consumer() -> None:
    while True:
        item = q.get()
        if item is None:
            break
        print(f"Consumed: {item}")
        q.task_done()

# Start multiple consumers
consumers = []
for _ in range(3):
    t = threading.Thread(target=consumer)
    consumers.append(t)
    t.start()

# Start producer
prod = threading.Thread(target=producer)
prod.start()

prod.join()

# Signal consumers to stop
for _ in range(3):
    q.put(None)

# Wait for all tasks
q.join()

for t in consumers:
    t.join()
```

**Key Functions:**

- `Queue()` — FIFO queue
- `LifoQueue()` — LIFO queue (stack)
- `PriorityQueue()` — Priority queue
- `SimpleQueue()` — Simpler queue (3.7+)

**Use Cases:**

- Producer-consumer patterns
- Work queues
- Thread-safe data sharing
- Pipeline processing

**Pitfalls:**

⚠ `qsize()` is approximate and not reliable
⚠ `empty()` and `full()` are not thread-safe for decision-making
⚠ Always use `task_done()` with `join()` for proper synchronization
⚠ Use sentinel values (None) to signal completion
⚠ Queue size limits prevent memory issues

16.5.6 ThreadPoolExecutor

**Basic Usage:**

```python
from concurrent.futures import ThreadPoolExecutor
import time

def fetch_url(url: str) -> str:
    time.sleep(1)  # Simulate network I/O
    return f"Data from {url}"

urls = ["url1", "url2", "url3", "url4", "url5"]

# Execute with thread pool
with ThreadPoolExecutor(max_workers=3) as executor:
    results = executor.map(fetch_url, urls)
    for result in results:
        print(result)
```

**Submit Individual Tasks:**

```python
from concurrent.futures import ThreadPoolExecutor, as_completed

def process_item(item: int) -> int:
    return item * 2

items = [1, 2, 3, 4, 5]

with ThreadPoolExecutor(max_workers=3) as executor:
    # Submit tasks
    futures = {executor.submit(process_item, item): item for item in items}
    
    # Process results as they complete
    for future in as_completed(futures):
        item = futures[future]
        try:
            result = future.result()
            print(f"Item {item} -> {result}")
        except Exception as e:
            print(f"Item {item} failed: {e}")
```

**Future Objects:**

```python
from concurrent.futures import ThreadPoolExecutor, Future
import time

def slow_task(n: int) -> int:
    time.sleep(n)
    return n * 2

with ThreadPoolExecutor() as executor:
    # Submit task
    future: Future[int] = executor.submit(slow_task, 2)
    
    # Check if done
    print(future.done())  # False
    
    # Wait for result (blocks)
    result = future.result(timeout=5.0)
    print(result)  # 4
    
    # Check if done
    print(future.done())  # True
```

**Exception Handling:**

```python
from concurrent.futures import ThreadPoolExecutor

def may_fail(n: int) -> int:
    if n == 0:
        raise ValueError("Cannot process 0")
    return 100 / n

with ThreadPoolExecutor() as executor:
    futures = [executor.submit(may_fail, i) for i in range(5)]
    
    for future in futures:
        try:
            result = future.result()
            print(f"Success: {result}")
        except ValueError as e:
            print(f"Error: {e}")
```

**Key Functions:**

- `ThreadPoolExecutor()` — Create thread pool
- `submit()` — Submit single task, returns Future
- `map()` — Submit multiple tasks, returns iterator
- `shutdown()` — Shutdown executor (automatic with context manager)
- `Future.result()` — Get result (blocks until ready)
- `Future.done()` — Check if task completed
- `as_completed()` — Iterate over completed futures

**Use Cases:**

- Parallel I/O operations
- Web scraping
- API calls
- File processing
- Database queries

**Pitfalls:**

⚠ GIL limits CPU-bound parallelism
⚠ Too many threads cause context switching overhead
⚠ Use `max_workers` to limit thread count
⚠ Always handle exceptions from futures
⚠ Use `as_completed()` for processing results as they arrive

16.5.7 Thread Safety Best Practices

**DO:**

✔ Use queues for thread communication
✔ Use locks for shared mutable state
✔ Minimize shared state
✔ Use thread-local storage when possible
✔ Use ThreadPoolExecutor for I/O-bound tasks
✔ Always join threads
✔ Use context managers for locks

**DON'T:**

❌ Share mutable state without protection
❌ Use too many threads (context switching overhead)
❌ Use threads for CPU-bound tasks (use multiprocessing)
❌ Forget to join threads
❌ Use global variables for thread communication
❌ Assume operations are atomic

**Example: Thread-Safe Counter:**

```python
import threading
from typing import Final

class ThreadSafeCounter:
    def __init__(self) -> None:
        self._value: int = 0
        self._lock: Final[threading.Lock] = threading.Lock()
    
    def increment(self) -> None:
        with self._lock:
            self._value += 1
    
    def decrement(self) -> None:
        with self._lock:
            self._value -= 1
    
    def get_value(self) -> int:
        with self._lock:
            return self._value

# Usage
counter = ThreadSafeCounter()

def worker() -> None:
    for _ in range(1000):
        counter.increment()

threads = []
for _ in range(10):
    t = threading.Thread(target=worker)
    threads.append(t)
    t.start()

for t in threads:
    t.join()

print(counter.get_value())  # 10000
```

16.5.8 Pitfalls & Warnings

⚠ Race conditions from shared mutable state
⚠ Deadlocks from multiple locks
⚠ GIL prevents CPU-bound parallelism
⚠ Too many threads cause overhead
⚠ Forgetting to join threads
⚠ Daemon threads may not clean up properly
⚠ Thread-local storage requires careful initialization
⚠ Queue operations can block indefinitely

16.6 MULTIPROCESSING

(real parallelism for CPU tasks)

16.6.1 Basic Process
from multiprocessing import Process

def compute():
    ...

p = Process(target=compute)
p.start()
p.join()

16.6.2 ProcessPoolExecutor

Replaces manual process management:

from concurrent.futures import ProcessPoolExecutor

with ProcessPoolExecutor() as ex:
    ex.map(expensive_function, data)

16.6.3 Shared Memory
from multiprocessing import Value, Array

16.6.4 Managers (High-Level IPC)
from multiprocessing import Manager

manager = Manager()
shared_dict = manager.dict()

16.6.5 Multiprocessing Pitfalls

⚠ pickling overhead
⚠ process startup cost
⚠ cannot use lambdas
⚠ must guard main block with

if __name__ == "__main__":


⚠ cannot share large objects cheaply

**Expanded Coverage:**

For complete multiprocessing documentation, see the expanded sections below covering:
- Process communication (Queue, Pipe, shared memory)
- Process pools (Pool, ProcessPoolExecutor)
- Process synchronization (Locks, Events, Semaphores)
- concurrent.futures module
- sched module for event scheduling
- Best practices and common pitfalls

16.6.6 Process Communication (Expanded)

**Queue (Process-Safe):**

```python
from multiprocessing import Process, Queue

def producer(q: Queue) -> None:
    for i in range(5):
        q.put(i)
        print(f"Produced: {i}")

def consumer(q: Queue) -> None:
    while True:
        item = q.get()
        if item is None:  # Sentinel
            break
        print(f"Consumed: {item}")

if __name__ == "__main__":
    q = Queue()
    
    p1 = Process(target=producer, args=(q,))
    p2 = Process(target=consumer, args=(q,))
    
    p1.start()
    p2.start()
    
    p1.join()
    q.put(None)  # Signal completion
    p2.join()
```

**Pipe (Bidirectional Communication):**

```python
from multiprocessing import Process, Pipe

def worker(conn) -> None:
    conn.send("Hello from worker")
    msg = conn.recv()
    print(f"Worker received: {msg}")
    conn.close()

if __name__ == "__main__":
    parent_conn, child_conn = Pipe()
    
    p = Process(target=worker, args=(child_conn,))
    p.start()
    
    msg = parent_conn.recv()
    print(f"Parent received: {msg}")
    parent_conn.send("Hello from parent")
    
    p.join()
```

**Shared Memory (Value and Array) - Expanded:**

```python
from multiprocessing import Process, Value, Array

def increment_counter(counter: Value) -> None:
    for _ in range(100000):
        with counter.get_lock():
            counter.value += 1

if __name__ == "__main__":
    # Shared integer
    counter = Value('i', 0)
    
    processes = []
    for _ in range(4):
        p = Process(target=increment_counter, args=(counter,))
        processes.append(p)
        p.start()
    
    for p in processes:
        p.join()
    
    print(counter.value)  # 400000
```

**Type Codes for Array:**

- `'i'` — signed int
- `'I'` — unsigned int
- `'f'` — float
- `'d'` — double
- `'c'` — char
- `'b'` — signed char
- `'B'` — unsigned char
- `'h'` — signed short
- `'H'` — unsigned short
- `'l'` — signed long
- `'L'` — unsigned long
- `'q'` — signed long long
- `'Q'` — unsigned long long

16.6.7 ProcessPoolExecutor (Expanded)

**Basic Usage:**

```python
from concurrent.futures import ProcessPoolExecutor
import math

def is_prime(n: int) -> bool:
    if n < 2:
        return False
    for i in range(2, int(math.sqrt(n)) + 1):
        if n % i == 0:
            return False
    return True

if __name__ == "__main__":
    numbers = list(range(2, 1000))
    
    with ProcessPoolExecutor(max_workers=4) as executor:
        results = executor.map(is_prime, numbers)
        primes = [n for n, is_p in zip(numbers, results) if is_p]
    
    print(f"Found {len(primes)} primes")
```

**Future Objects:**

```python
from concurrent.futures import ProcessPoolExecutor, Future
import time

def slow_task(n: int) -> int:
    time.sleep(n)
    return n * 2

if __name__ == "__main__":
    with ProcessPoolExecutor() as executor:
        future: Future[int] = executor.submit(slow_task, 2)
        
        print(future.done())  # False
        result = future.result(timeout=5.0)
        print(result)  # 4
        print(future.done())  # True
```

**Comparison: ThreadPoolExecutor vs ProcessPoolExecutor:**

- `ThreadPoolExecutor` — I/O-bound tasks, limited by GIL
- `ProcessPoolExecutor` — CPU-bound tasks, true parallelism
- Both have same API (`submit()`, `map()`, `as_completed()`)
- ProcessPoolExecutor requires `if __name__ == "__main__"` guard

16.6.8 sched: Event Scheduler

The `sched` module provides a general-purpose event scheduler.

**Basic Scheduling:**

```python
import sched
import time

scheduler = sched.scheduler(time.time, time.sleep)

def print_time(message: str) -> None:
    print(f"{time.time()}: {message}")

# Schedule event (delay in seconds)
scheduler.enter(2, 1, print_time, ("Delayed message",))
scheduler.enter(5, 1, print_time, ("Later message",))

# Run scheduler
print("Starting scheduler...")
scheduler.run()
print("Scheduler finished")
```

**Priority Scheduling:**

```python
import sched
import time

scheduler = sched.scheduler(time.time, time.sleep)

def task(name: str) -> None:
    print(f"Task {name}")

# Priority: lower number = higher priority
scheduler.enter(2, 2, task, ("Low priority",))
scheduler.enter(2, 1, task, ("High priority",))  # Runs first

scheduler.run()
```

**Key Functions:**

- `scheduler()` — Create scheduler
- `enter()` — Schedule event (delay, priority, function, args)
- `enterabs()` — Schedule event at absolute time
- `cancel()` — Cancel scheduled event
- `run()` — Run scheduler (blocks until empty)
- `empty()` — Check if queue is empty
- `queue` — Get list of scheduled events

**Use Cases:**

- Delayed execution
- Periodic tasks
- Event scheduling
- Simple cron-like functionality

**Pitfalls:**

⚠ Single-threaded — blocks during execution
⚠ Not suitable for high-frequency events
⚠ Use `threading.Timer` or `asyncio` for better concurrency
⚠ Events execute in priority order, then time order

16.7 ASYNCIO

(modern Python concurrency)

The `asyncio` module provides single-threaded concurrency using coroutines and an event loop.

16.7.1 Event Loop

The event loop is the core of asyncio, managing and executing coroutines.

**Asyncio Timeline Diagram:**

```
Time →

Coroutine 1:  [──────await I/O──────] [────work────]
Coroutine 2:        [────work────] [──await I/O──]
Coroutine 3:  [work] [──await I/O──] [────work────]

Event Loop:   [run][select][run][select][run][select]
              │    │       │    │       │    │
              └────┴───────┴────┴───────┴────┴──────→

I/O Ready:    [───][──────][───][──────][───][──────]
              │    │       │    │       │    │
              └────┴───────┴────┴───────┴────┴──────→
```

**Event Loop States:**

```
┌─────────────┐
│   Created   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Running   │ ← Executing coroutines
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Waiting   │ ← Waiting for I/O
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Closed    │
└─────────────┘
```

**Getting the Event Loop:**

```python
import asyncio

# Get current event loop
loop = asyncio.get_event_loop()

# Or get or create
loop = asyncio.get_event_loop()
if loop.is_closed():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

# Modern way (3.7+): asyncio.run() handles this automatically
```

**Running the Event Loop:**

```python
import asyncio

async def main():
    print("Hello, asyncio!")

# Modern way (3.7+)
asyncio.run(main())

# Manual way (for advanced use)
loop = asyncio.get_event_loop()
try:
    loop.run_until_complete(main())
finally:
    loop.close()
```

**Event Loop Methods:**

```python
import asyncio

async def task():
    await asyncio.sleep(1)
    return "Done"

loop = asyncio.get_event_loop()

# Run until complete
result = loop.run_until_complete(task())

# Run forever
# loop.run_forever()

# Call soon
loop.call_soon(print, "Called soon")

# Call later
loop.call_later(2.0, print, "Called later")

# Call at time
loop.call_at(loop.time() + 5.0, print, "Called at time")
```

**Event Loop Policies:**

```python
import asyncio

# Get default policy
policy = asyncio.get_event_loop_policy()

# Set custom policy (advanced)
# policy = MyCustomPolicy()
# asyncio.set_event_loop_policy(policy)
```

**Key Event Loop Functions:**

- `get_event_loop()` — Get current event loop
- `new_event_loop()` — Create new event loop
- `set_event_loop()` — Set event loop
- `run()` — Run coroutine (3.7+, recommended)
- `run_until_complete()` — Run until coroutine completes
- `run_forever()` — Run forever
- `close()` — Close event loop
- `is_running()` — Check if loop is running
- `is_closed()` — Check if loop is closed

16.7.2 Basic Coroutine

**Defining Coroutines:**

```python
import asyncio

# Coroutine function
async def greet(name: str) -> str:
    await asyncio.sleep(1)  # Simulate I/O
    return f"Hello, {name}!"

# Calling coroutine
async def main():
    result = await greet("World")
    print(result)

asyncio.run(main())
```

**Coroutine vs Function:**

```python
import asyncio

# Regular function
def sync_func():
    return "sync"

# Coroutine function
async def async_func():
    return "async"

# Calling
result1 = sync_func()  # Returns string immediately

# Coroutine must be awaited
result2 = await async_func()  # Returns string after await
# Or
coro = async_func()  # Returns coroutine object
result2 = await coro  # Execute coroutine
```

**Coroutine Objects:**

```python
import asyncio

async def task():
    return 42

# Coroutine function returns coroutine object
coro = task()
print(type(coro))  # <class 'coroutine'>

# Must await to get result
result = await coro
print(result)  # 42
```

16.7.3 Tasks

Tasks wrap coroutines and schedule them for execution.

**Creating Tasks:**

```python
import asyncio

async def fetch_data(url: str) -> str:
    await asyncio.sleep(1)  # Simulate network I/O
    return f"Data from {url}"

async def main():
    # Create task
    task = asyncio.create_task(fetch_data("http://example.com"))
    
    # Do other work
    print("Doing other work...")
    
    # Wait for task
    result = await task
    print(result)

asyncio.run(main())
```

**Multiple Tasks:**

```python
import asyncio

async def worker(name: str, delay: float) -> str:
    await asyncio.sleep(delay)
    return f"Worker {name} completed"

async def main():
    # Create multiple tasks
    tasks = [
        asyncio.create_task(worker("A", 1.0)),
        asyncio.create_task(worker("B", 2.0)),
        asyncio.create_task(worker("C", 1.5)),
    ]
    
    # Wait for all tasks
    results = await asyncio.gather(*tasks)
    print(results)  # ['Worker A completed', 'Worker C completed', 'Worker B completed']

asyncio.run(main())
```

**Task Methods:**

```python
import asyncio

async def long_task():
    await asyncio.sleep(5)
    return "Done"

async def main():
    task = asyncio.create_task(long_task())
    
    # Check if done
    print(task.done())  # False
    
    # Cancel task
    # task.cancel()
    
    # Get result (blocks until complete)
    try:
        result = await task
        print(result)
    except asyncio.CancelledError:
        print("Task was cancelled")
    
    print(task.done())  # True

asyncio.run(main())
```

**Task States:**

- `pending` — Task created but not started
- `running` — Task is executing
- `done` — Task completed (success or failure)
- `cancelled` — Task was cancelled

**Key Functions:**

- `create_task()` — Create and schedule task
- `Task()` — Create task (lower-level)
- `gather()` — Wait for multiple coroutines/tasks
- `wait()` — Wait for tasks with more control
- `as_completed()` — Iterate over completed tasks

16.7.4 TaskGroup (Python 3.11+)

TaskGroup provides structured concurrency with automatic cleanup.

**Basic TaskGroup:**

```python
import asyncio

async def fetch(url: str) -> str:
    await asyncio.sleep(1)
    return f"Data from {url}"

async def main():
    async with asyncio.TaskGroup() as tg:
        # Create tasks in group
        task1 = tg.create_task(fetch("url1"))
        task2 = tg.create_task(fetch("url2"))
        task3 = tg.create_task(fetch("url3"))
    
    # All tasks completed (or exception raised)
    print("All tasks completed")

asyncio.run(main())
```

**TaskGroup Exception Handling:**

```python
import asyncio

async def may_fail(n: int) -> int:
    await asyncio.sleep(0.1)
    if n == 2:
        raise ValueError(f"Failed at {n}")
    return n * 2

async def main():
    try:
        async with asyncio.TaskGroup() as tg:
            tasks = [tg.create_task(may_fail(i)) for i in range(5)]
    except* ValueError as eg:  # ExceptionGroup (3.11+)
        print(f"Errors: {eg.exceptions}")
    except ExceptionGroup as eg:
        print(f"Other errors: {eg.exceptions}")

asyncio.run(main())
```

**TaskGroup Benefits:**

- Automatic cancellation of remaining tasks on error
- Exception propagation via ExceptionGroup
- Clean resource management
- Structured concurrency pattern

**Key Methods:**

- `create_task()` — Create task in group
- Automatic cleanup on exit
- ExceptionGroup for error handling

16.7.5 asyncio.gather

`gather()` runs multiple coroutines concurrently and collects results.

**Basic gather:**

```python
import asyncio

async def fetch(url: str) -> str:
    await asyncio.sleep(1)
    return f"Data from {url}"

async def main():
    # Gather multiple coroutines
    results = await asyncio.gather(
        fetch("url1"),
        fetch("url2"),
        fetch("url3")
    )
    print(results)  # ['Data from url1', 'Data from url2', 'Data from url3']

asyncio.run(main())
```

**gather with return_exceptions:**

```python
import asyncio

async def may_fail(n: int) -> int:
    await asyncio.sleep(0.1)
    if n == 2:
        raise ValueError(f"Error at {n}")
    return n * 2

async def main():
    # Return exceptions instead of raising
    results = await asyncio.gather(
        may_fail(1),
        may_fail(2),
        may_fail(3),
        return_exceptions=True
    )
    
    for i, result in enumerate(results, 1):
        if isinstance(result, Exception):
            print(f"Task {i} failed: {result}")
        else:
            print(f"Task {i} succeeded: {result}")

asyncio.run(main())
```

**Key Parameters:**

- `return_exceptions=False` — Raise exception on first error
- `return_exceptions=True` — Return exceptions in results

**Use Cases:**

- Parallel I/O operations
- Batch processing
- Concurrent API calls
- Data aggregation

16.7.6 Synchronization Primitives

**Lock:**

```python
import asyncio

lock = asyncio.Lock()
counter = 0

async def increment():
    global counter
    async with lock:
        # Critical section
        temp = counter
        await asyncio.sleep(0.01)  # Simulate work
        counter = temp + 1

async def main():
    tasks = [increment() for _ in range(10)]
    await asyncio.gather(*tasks)
    print(counter)  # 10

asyncio.run(main())
```

**Event:**

```python
import asyncio

event = asyncio.Event()

async def waiter(name: str):
    print(f"{name} waiting...")
    await event.wait()
    print(f"{name} received event!")

async def setter():
    await asyncio.sleep(2)
    print("Setting event...")
    event.set()

async def main():
    tasks = [
        waiter("A"),
        waiter("B"),
        setter()
    ]
    await asyncio.gather(*tasks)

asyncio.run(main())
```

**Condition:**

```python
import asyncio

condition = asyncio.Condition()
items = []

async def consumer(name: str):
    async with condition:
        while not items:
            await condition.wait()
        item = items.pop(0)
        print(f"{name} consumed: {item}")

async def producer():
    await asyncio.sleep(1)
    async with condition:
        items.append("item")
        condition.notify()

async def main():
    tasks = [
        consumer("A"),
        consumer("B"),
        producer()
    ]
    await asyncio.gather(*tasks)

asyncio.run(main())
```

**Semaphore:**

```python
import asyncio

semaphore = asyncio.Semaphore(3)  # Allow 3 concurrent

async def worker(name: str):
    async with semaphore:
        print(f"{name} acquired semaphore")
        await asyncio.sleep(2)
        print(f"{name} releasing semaphore")

async def main():
    tasks = [worker(f"Worker-{i}") for i in range(10)]
    await asyncio.gather(*tasks)

asyncio.run(main())
```

**Barrier:**

```python
import asyncio

barrier = asyncio.Barrier(3)

async def worker(name: str):
    print(f"{name} starting")
    await barrier.wait()  # Wait for all
    print(f"{name} passed barrier")

async def main():
    tasks = [worker(f"Worker-{i}") for i in range(3)]
    await asyncio.gather(*tasks)

asyncio.run(main())
```

**Key Synchronization Primitives:**

- `Lock()` — Mutual exclusion lock
- `Event()` — Event signaling
- `Condition()` — Wait/notify pattern
- `Semaphore()` — Resource limiting
- `Barrier()` — Synchronization point

16.7.7 Streams

Streams provide high-level async I/O.

**TCP Server:**

```python
import asyncio

async def handle_client(reader: asyncio.StreamReader, writer: asyncio.StreamWriter):
    data = await reader.read(100)
    message = data.decode()
    addr = writer.get_extra_info('peername')
    print(f"Received {message!r} from {addr}")
    
    writer.write(f"Echo: {message}".encode())
    await writer.drain()
    
    writer.close()
    await writer.wait_closed()

async def main():
    server = await asyncio.start_server(
        handle_client, '127.0.0.1', 8888
    )
    
    addr = server.sockets[0].getsockname()
    print(f'Serving on {addr}')
    
    async with server:
        await server.serve_forever()

asyncio.run(main())
```

**TCP Client:**

```python
import asyncio

async def tcp_client(message: str):
    reader, writer = await asyncio.open_connection('127.0.0.1', 8888)
    
    writer.write(message.encode())
    await writer.drain()
    
    data = await reader.read(100)
    print(f'Received: {data.decode()}')
    
    writer.close()
    await writer.wait_closed()

asyncio.run(tcp_client('Hello, Server!'))
```

**Key Stream Functions:**

- `start_server()` — Create TCP server
- `open_connection()` — Open TCP connection
- `StreamReader.read()` — Read data
- `StreamWriter.write()` — Write data
- `StreamWriter.drain()` — Wait for data to be sent
- `StreamWriter.close()` — Close connection

16.7.8 Transports and Protocols

Lower-level async I/O using transports and protocols.

**Echo Protocol:**

```python
import asyncio

class EchoServerProtocol(asyncio.Protocol):
    def connection_made(self, transport):
        self.transport = transport
        peername = transport.get_extra_info('peername')
        print(f'Connection from {peername}')
    
    def data_received(self, data):
        message = data.decode()
        print(f'Received: {message}')
        self.transport.write(f'Echo: {message}'.encode())
    
    def connection_lost(self, exc):
        print('Connection closed')

async def main():
    loop = asyncio.get_event_loop()
    server = await loop.create_server(
        EchoServerProtocol, '127.0.0.1', 8888
    )
    
    async with server:
        await server.serve_forever()

asyncio.run(main())
```

**Key Protocol Methods:**

- `connection_made()` — Called when connection established
- `data_received()` — Called when data received
- `connection_lost()` — Called when connection closed
- `eof_received()` — Called when EOF received

**Use Cases:**

- Custom protocols
- Low-level I/O control
- Performance-critical applications
- Protocol implementation

16.7.9 asyncio.run() and Best Practices

**asyncio.run() (Recommended):**

```python
import asyncio

async def main():
    print("Hello, asyncio!")

# Modern way (3.7+)
asyncio.run(main())
```

**Best Practices:**

✔ Use `asyncio.run()` for entry point
✔ Use `async`/`await` consistently
✔ Use `asyncio.gather()` for parallel operations
✔ Use `TaskGroup()` for structured concurrency (3.11+)
✔ Use async context managers for resources
✔ Handle exceptions properly
✔ Use `asyncio.create_task()` for fire-and-forget
✔ Avoid blocking calls in async code

**Common Patterns:**

```python
import asyncio

# Pattern 1: Parallel execution
async def fetch_all(urls):
    tasks = [fetch(url) for url in urls]
    return await asyncio.gather(*tasks)

# Pattern 2: Timeout
async def fetch_with_timeout(url, timeout=5.0):
    try:
        return await asyncio.wait_for(fetch(url), timeout=timeout)
    except asyncio.TimeoutError:
        return None

# Pattern 3: Retry
async def fetch_with_retry(url, max_retries=3):
    for attempt in range(max_retries):
        try:
            return await fetch(url)
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            await asyncio.sleep(2 ** attempt)  # Exponential backoff
```

16.8 Structured Concurrency (Python 3.11+)

TaskGroups automatically manage:

cleanup

failure propagation

child cancellation

async with asyncio.TaskGroup() as tg:
    tg.create_task(fetch(1))
    tg.create_task(fetch(2))

16.9 Async Context Managers
class Resource:
    async def __aenter__(self): ...
    async def __aexit__(self, *a): ...

async with Resource():
    ...

16.10 Async Iterators
async for item in stream():
    ...

16.11 Queues in asyncio
queue = asyncio.Queue()
await queue.put(item)
item = await queue.get()

16.12 Mixing AsyncIO with Threads or Processes

A common pattern:

Async code handles network I/O

CPU tasks offloaded to ProcessPool

Blocking I/O tasks offloaded to ThreadPool

16.12.1 Offloading CPU Work
loop = asyncio.get_event_loop()
result = await loop.run_in_executor(
    ProcessPoolExecutor(),
    cpu_heavy_function,
    x
)

16.12.2 Offloading Blocking IO
await loop.run_in_executor(
    None,  # ThreadPool
    blocking_function
)

16.13 Practical Decision Tree

"Which concurrency model should I use?"

If task is CPU-bound:

→ Use multiprocessing or Rust/C extensions

If task is IO-bound and high-throughput:

→ Use asyncio

If task is IO-bound and simple:

→ Use threads / ThreadPool

If you need 100k+ connections:

→ asyncio + uvloop

If you need strict concurrency structure:

→ TaskGroups

If using Python 3.14+ and want parallel threading:

→ Use free-threading mode (experimental)

16.14 Mini Example — Async Web Scraper
import httpx, asyncio

async def fetch(url):
    async with httpx.AsyncClient() as c:
        r = await c.get(url)
        return r.text

async def main():
    urls = [...]
    data = await asyncio.gather(*(fetch(u) for u in urls))
    print(len(data))

asyncio.run(main())


Handles thousands of requests easily.

16.15 Macro Example — Concurrency Pipeline

Real-world: ETL + CPU-bound parsing + async upload.

[Async Fetch] -> [CPU Parse] -> [Async Upload]


System:

asyncio for fetch and upload

ProcessPool for parsing

async def main():
    urls = load_urls()

    async with asyncio.TaskGroup() as tg:
        for u in urls:
            tg.create_task(handle(u))

async def handle(url):
    html = await async_fetch(url)
    parsed = await run_process(parse_html, html)
    await async_upload(parsed)


This pattern is industry-standard.

16.16 Pitfalls & Warnings

⚠ async code mixed with blocking functions
⚠ using requests instead of httpx in asyncio
⚠ CPU-bound tasks inside coroutines
⚠ deadlocks from locks inside threads
⚠ race conditions from shared state
⚠ forgetting to use await
⚠ overusing multiprocessing → massive overhead
⚠ using too many threads → context switching
⚠ relying on free-threading with unsupported libraries
⚠ event loop misuse

16.17 Summary & Takeaways

Use asyncio for high concurrency I/O

Use multiprocessing for CPU work

Use threads for blocking I/O

Understand the GIL and free-threading

Use queues to prevent shared-state problems

Use TaskGroups for structured concurrency

Avoid mixing sync and async without intention

Use ProcessPool to offload CPU-bound functions

16.18 Next Chapter

Proceed to:

👉 Chapter 17 — Advanced Architecture & Patterns
Includes:

metaprogramming

descriptors

advanced decorators

dependency graphs

import hooks & meta-path finders

event-driven architectures

plugin systems

microservice architecture patterns

state machines

CQRS & event sourcing

service boundaries


📘 CHAPTER 17 — ADVANCED ARCHITECTURE & DESIGN PATTERNS

Depth Level: 3
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–16

17.0 Overview

This chapter explores advanced-level Python engineering topics that span:

advanced metaprogramming

software architecture at scale

system-level design

dynamic module loading

descriptors & attribute management

CQRS/event sourcing

state machines

plugin architectures

import machinery

large-scale dependency graph modeling

This chapter is practical, production-focused, and integrates core Python features into enterprise architecture.

17.1 Understanding Python’s Meta-Object Protocol (MOP)

Python’s object system is built on a meta-object protocol, defining how objects:

are created

behave

introspect

resolve attributes

apply decorators

load modules

Core pillars:

everything is an object

classes are objects

functions are objects

modules are objects

metaclasses create classes

descriptors define attribute access

decorators wrap objects

import machinery loads modules

17.2 Metaclasses — The Top of Python’s Type System

Metaclasses define how classes are constructed.

17.2.1 Basic Metaclass Example
class Meta(type):
    def __new__(mcls, name, bases, ns):
        ns["created_by_meta"] = True
        return super().__new__(mcls, name, bases, ns)

class MyClass(metaclass=Meta):
    pass

assert MyClass.created_by_meta

17.2.2 Why Use Metaclasses?

Metaclasses enable:

automatic registration

enforcing interfaces

modifying class attributes

injecting behavior

ORM model creation

framework DSLs

Examples in real frameworks:

Django ORM model classes

SQLAlchemy declarative base

Pydantic v1

attrs library

Marshmallow schemas

17.2.3 Metaclass Anti-Patterns

⚠ Overengineering
⚠ Introducing magical behavior
⚠ Reducing code clarity

Rule: Use descriptors unless you truly need metaclasses.

17.3 Descriptors — The REAL Power Behind Properties

Descriptors implement:

@property

methods

functions

class/static methods

ORMs

fields in dataclasses

17.3.1 Descriptor Protocol
class Descriptor:
    def __get__(self, instance, owner): ...
    def __set__(self, instance, value): ...
    def __delete__(self, instance): ...

17.3.2 Example: Validated Field
class IntegerField:
    def __set__(self, instance, value):
        if not isinstance(value, int):
            raise TypeError("expected int")
        instance.__dict__["value"] = value

class Model:
    value = IntegerField()


This pattern underlies:

Django ORM fields

SQLAlchemy mapped columns

attrs and dataclasses field transformations

17.4 Advanced Decorator Patterns
✔ Function decorators
✔ Class decorators
✔ Decorators with parameters
✔ Decorators returning classes
✔ Combining decorators and descriptors
17.4.1 Decorator with State
def memoize(fn):
    cache = {}
    def wrapper(x):
        if x not in cache:
            cache[x] = fn(x)
        return cache[x]
    return wrapper

17.4.2 Class Decorator
def register(cls):
    REGISTRY[cls.__name__] = cls
    return cls

@register
class Service:
    pass

17.4.3 Decorators + Descriptors (Advanced)

ORMs frequently combine both.

17.5 Import Hooks, Meta-Path Finders & Loaders

Python has a pluggable import system:

17.5.1 sys.meta_path

A list of importers:

for finder in sys.meta_path:
    print(finder)

17.5.2 Custom Importer
import sys, importlib.abc, importlib.util

class Loader(importlib.abc.Loader):
    def exec_module(self, module):
        module.data = "hello"

class Finder(importlib.abc.MetaPathFinder):
    def find_spec(self, fullname, path, target=None):
        if fullname == "special":
            return importlib.util.spec_from_loader(fullname, Loader())

sys.meta_path.insert(0, Finder())


Importing now executes your loader.

Use Cases

encrypted Python modules

remote module loading

plugin systems

hot-reload environments

API-driven code-loading (dangerous!)

17.5.3 Import Hook Warnings

⚠ Can load malicious code
⚠ Very difficult to debug
⚠ Bypass visibility of dependency graphs

17.6 Registry Patterns

Used extensively in frameworks.

17.6.1 Simple Registry
REGISTRY = {}

def register(name):
    def wrapper(fn):
        REGISTRY[name] = fn
        return fn
    return wrapper

17.6.2 Class Registry
class Base:
    registry = {}

    def __init_subclass__(cls, **kw):
        Base.registry[cls.__name__] = cls


Used in:

DRF viewsets

Pydantic

Django admin

Plugin systems

17.7 Plugin Architecture Design

Key choices:

entry points (setuptools)

dynamic imports

conventions

registries

hub/spoke design

metadata inspection

17.7.1 Entry Point Example (pyproject.toml)
[project.entry-points.myplugins]
plugin1 = "mypackage.plugin1:Plugin"


Load:

import importlib.metadata

eps = importlib.metadata.entry_points(group="myplugins")

17.7.2 Dynamic Loader
def load(name):
    module = importlib.import_module(name)
    return getattr(module, "Plugin")()

17.8 CQRS & Event Sourcing in Python

Pattern used in complex enterprise systems.

17.8.1 CQRS Principle

Split:

Commands (change state)

Queries (read state)

Benefits:

scaling reads and writes differently

optimizing data structures

auditability

17.8.2 Event Sourcing

State is derived from events:

event1 → event2 → ... → current state


Python implementation:

class EventStore:
    def __init__(self):
        self.events = []

    def append(self, evt):
        self.events.append(evt)

17.9 State Machines
17.9.1 Minimal FSM Example
class FSM:
    def __init__(self):
        self.state = "init"

    def event(self, name):
        if self.state == "init" and name == "start":
            self.state = "running"

17.9.2 Industrial State Machine Pattern

Better to use:

transitions library

custom FSM frameworks

17.10 Microservice Architecture Patterns

Python backend microservices align with:

FastAPI

Flask + gunicorn

Django REST

async workers

event streams

17.10.1 Service Boundary Rules

services own their own data

services communicate via messages or APIs

no shared database schemas

ensure backward compatibility

isolate failure domains

17.11 Event-Driven Architecture

Event-based systems in Python:

Kafka

Redis Streams

RabbitMQ

asyncio event buses

custom message brokers

Patterns:

publish-subscribe

fan-out

saga patterns

17.12 Advanced Dependency Graph Architecture
17.12.1 Dependency Graph Detection

Python tools:

pipdeptree

snakeviz

pydeps

grimp

17.12.2 Circular Dependency Breaking

Strategies:

interfaces

ports & adapters

dependency inversion

local imports

17.13 Mini Example — FRP-Style Event Bus in Python
class EventBus:
    def __init__(self):
        self.handlers = {}

    def subscribe(self, type, fn):
        self.handlers.setdefault(type, []).append(fn)

    def publish(self, event):
        for fn in self.handlers.get(type(event), []):
            fn(event)

17.14 Macro Example — Full Plugin System with Registries
app/
  core/
    registry.py
    loader.py
  plugins/
    plugin_a/
    plugin_b/

registry.py
class Registry:
    def __init__(self):
        self.plugins = {}

    def register(self, name, cls):
        self.plugins[name] = cls

registry = Registry()

loader.py
import importlib
from app.core.registry import registry

def load_plugins():
    for mod in ["plugin_a.main", "plugin_b.main"]:
        module = importlib.import_module(f"app.plugins.{mod}")
    return registry.plugins

plugin_a/main.py
from app.core.registry import registry

@registry.register("a")
class PluginA:
    def run(self):
        print("A")

17.15 Pitfalls & Warnings

⚠ Metaclasses make debugging harder
⚠ Import hooks can load malicious code
⚠ Plugin systems can break dependency graphs
⚠ State machines become spaghetti without discipline
⚠ CQRS adds write latency & complexity
⚠ Event sourcing requires complete replay safety
⚠ Circular imports disaster without architecture discipline
⚠ Dynamic module loading bypasses static analysis

17.16 Summary & Takeaways

Metaclasses define class creation

Descriptors power properties & ORMs

Decorators augment functions/classes

Import hooks permit custom module loading

Registries & plugins enable extensibility

CQRS & event sourcing increase scalability

Advanced patterns must be used with caution

Dependency graphs are critical to maintainability

State machines formalize lifecycle logic

17.17 Next Chapter

Proceed to:

👉 Chapter 18 — Database Integration & Persistence
Including:

DB-API 2.0

SQLAlchemy Core

SQLAlchemy ORM

async database access (SQLAlchemy 2.0 async, asyncpg, Tortoise ORM)

connection pooling

transactions

migrations (Alembic)

repository patterns

realistic CRUD examples

anti-patterns

performance tuning

connection lifecycle management


📘 CHAPTER 18 — DATABASE INTEGRATION & PERSISTENCE

Depth Level: 3
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–17

18.0 Overview

Database access is central to Python backends.

This chapter covers:

relational databases

SQL

async DB access

NoSQL (short overview)

schema evolution

repositories & unit-of-work

migrations

performance tuning

connection pooling

SQLAlchemy (Core + ORM + asyncio)

ACID, isolation levels, locking

security and reliability patterns

Python’s database ecosystem is dominated by:

SQLAlchemy 2.0 (industry standard)

asyncpg (fast async PostgreSQL driver)

Tortoise ORM (async Django-like)

We start with the foundation.

18.1 DB-API 2.0 — The Foundation of Python SQL

The standard API for Python database drivers.

Most drivers (psycopg2, sqlite3, mysqlclient) implement it.

Key concepts:

connection

cursor

execute()

fetchone(), fetchall()

18.1.1 Basic DB-API Example
import sqlite3

conn = sqlite3.connect("db.sqlite")
cur = conn.cursor()

cur.execute("SELECT 1")
print(cur.fetchone())

conn.commit()
conn.close()

18.1.2 Parameter Binding (Important for Security)
cur.execute("SELECT * FROM users WHERE id=?", (user_id,))


Never do:

cur.execute(f"SELECT * FROM users WHERE id={user_id}")  # ❌ SQL injection

18.2 SQLAlchemy 2.0 (Core API)

(Modern recommended approach)

SQLAlchemy 2.0 introduces:

fully typed API

async support

pure Python query construction

no implicit session magic

separate Core and ORM layers

18.2.1 Engine Creation
from sqlalchemy import create_engine

engine = create_engine("sqlite:///db.sqlite", echo=True)

18.2.2 Defining Tables
from sqlalchemy import Table, Column, Integer, String, MetaData

metadata = MetaData()

users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String)
)

18.2.3 Creating Tables
metadata.create_all(engine)

18.2.4 Inserting
with engine.connect() as conn:
    conn.execute(users.insert().values(name="Alice"))
    conn.commit()

18.2.5 Selecting
with engine.connect() as conn:
    result = conn.execute(users.select())
    for row in result:
        print(row)

18.3 SQLAlchemy ORM (2.0 Style)
18.3.1 Declarative Base
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

18.3.2 ORM Model
from sqlalchemy.orm import mapped_column, Mapped

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]

18.3.3 Session
from sqlalchemy.orm import Session

with Session(engine) as session:
    session.add(User(name="Alice"))
    session.commit()

18.4 Async SQLAlchemy 2.0

This is the modern async DB approach.

18.4.1 Creating Async Engine
from sqlalchemy.ext.asyncio import create_async_engine

engine = create_async_engine(
    "postgresql+asyncpg://user:pass@localhost/db"
)

18.4.2 Async Session
from sqlalchemy.ext.asyncio import async_sessionmaker

async_session = async_sessionmaker(engine)

18.4.3 Example Query
async with async_session() as session:
    result = await session.execute(users.select())
    rows = result.fetchall()

18.5 asyncpg — Fast Native Async Driver

Faster than SQLAlchemy’s ORM for raw queries.

18.5.1 Basic asyncpg Example
import asyncpg
import asyncio

async def main():
    conn = await asyncpg.connect("postgres://...")
    rows = await conn.fetch("SELECT * FROM users")
    await conn.close()

18.6 Tortoise ORM (Async Django-like ORM)
from tortoise import Tortoise, fields, models

class User(models.Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=50)

18.7 Connection Pooling

SQLAlchemy:

engine = create_engine(
    url,
    pool_size=10,
    max_overflow=20,
)


asyncpg:

pool = await asyncpg.create_pool(min_size=5, max_size=20)

18.8 Transactions & Unit-of-Work
18.8.1 SQLAlchemy Transaction Block
with engine.begin() as conn:
    conn.execute(...)

18.8.2 Async Transaction
async with async_session() as session:
    async with session.begin():
        ...

18.8.3 Unit-of-Work Pattern

Useful for DDD.

class UnitOfWork:
    def __init__(self, session_factory):
        self.session_factory = session_factory

    async def __aenter__(self):
        self.session = self.session_factory()
        self.tx = await self.session.begin()
        return self

    async def __aexit__(self, *exc):
        if exc[0]:
            await self.tx.rollback()
        else:
            await self.tx.commit()

18.9 Repository Pattern

Recommended for Clean/Hexagonal architecture.

18.9.1 Interface
class UserRepo:
    async def get(self, id: int): ...
    async def add(self, user): ...

18.9.2 Implementation with SQLAlchemy
class SqlUserRepo(UserRepo):
    def __init__(self, session):
        self.session = session

    async def add(self, user):
        self.session.add(user)

    async def get(self, id):
        return await self.session.get(User, id)

18.10 Alembic (Migrations)

The official migration tool for SQLAlchemy.

18.10.1 Initialize
alembic init alembic

18.10.2 Create Revision
alembic revision -m "create users"

18.10.3 Autogenerate (works with ORM)
alembic revision --autogenerate -m "update"

18.10.4 Apply Migration
alembic upgrade head

18.11 SQL Performance Tuning

Key Python/SQLAlchemy bottlenecks:

✔ N+1 queries
✔ inefficient ORM relationship loading
✔ unindexed columns
✔ using ORM where raw SQL is needed
✔ small transactions
✔ lack of batching
18.11.1 Eager Loading
session.query(User).options(selectinload(User.posts))

18.11.2 Batch Insert

SQLAlchemy 2.0:

session.bulk_save_objects(users)

18.12 Isolation Levels

PostgreSQL:

READ COMMITTED

REPEATABLE READ

SERIALIZABLE

Config:

create_engine(..., isolation_level="SERIALIZABLE")

18.13 Security Considerations for Databases
✔ Always use parameterized queries
✔ Never construct SQL with f-strings
✔ Validate input (pydantic)
✔ Manage credentials securely
✔ Use TLS connections
✔ Limit permissions per service
✔ Avoid exposing DB ports
18.14 Mini Example — Async CRUD Service
async def create_user(session, name: str):
    user = User(name=name)
    session.add(user)
    await session.commit()
    return user

18.15 Macro Example — Complete Async Repository + UoW + API

Directory:

app/
  domain/
  services/
  adapters/
    repo_sqlalchemy.py
  infra/
    db.py
  api/
    http.py

infra/db.py
engine = create_async_engine(DB_URL)
async_session = async_sessionmaker(engine)

adapters/repo_sqlalchemy.py
class SqlUserRepo(UserRepo):
    ...

services/user_service.py
async def register_user(uow, name):
    async with uow as tx:
        return await tx.users.add(User(name=name))

api/http.py (FastAPI)
@app.post("/users")
async def register(name: str):
    return await user_service.register_user(uow, name)

18.16 Anti-Patterns

⚠ using ORM for heavy ETL
⚠ unnecessary joins
⚠ unbounded sessions
⚠ mixing sync & async DB access
⚠ ignoring pooling
⚠ repeating migrations manually
⚠ building SQL manually with string concatenation
⚠ reusing connections across requests

18.17 Summary & Takeaways

DB-API is the foundation

SQLAlchemy 2.0 is the best ORM

asyncpg is the fastest async driver

use repositories for architecture cleanliness

use unit-of-work for transaction management

avoid SQL injection via parameterized queries

migrations should be automated with Alembic

connection pooling is essential for scalability

async DB access enables high-throughput services

18.18 Next Chapter

Proceed to:

👉 Chapter 19 — Async Web Development & APIs
Including:

ASGI vs WSGI

FastAPI deep dive

Starlette

Django async

async ORMs

background tasks

dependency injection systems

WebSockets

streaming responses

HTTP performance

high scalability patterns


📘 CHAPTER 19 — ASYNC WEB DEVELOPMENT & APIs

Depth Level: 3
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–18

19.0 Overview

Modern Python web development has shifted from:

WSGI (sync era)
→ ASGI (async era)

Frameworks built on ASGI enable:

async networking

websockets

background tasks

streaming responses

dependency injection

ultra-high concurrency

cloud-native patterns

This chapter provides a full roadmap for developing enterprise-level async APIs with Python.

19.1 WSGI vs ASGI
19.1.1 WSGI (Web Server Gateway Interface)

Legacy, synchronous model.

Frameworks:

Flask

Django (sync mode)

Bottle

Pyramid

Limitations:

no async I/O

no WebSockets

poor concurrency

thread-per-request patterns

19.1.2 ASGI (Asynchronous Server Gateway Interface)

Modern, event-driven.

Frameworks:

FastAPI

Starlette

Django 3.2+ async views

Quart

Litestar

Capabilities:

✔ async/await
✔ WebSockets
✔ background tasks
✔ connection pooling
✔ long-lived connections
✔ high concurrency (10k+ clients)
✔ HTTP/2 friendly
✔ cloud-native scalability

19.2 ASGI Architecture Diagram
flowchart LR
    Client -->|HTTP/WebSocket| ASGI-Server[ASGI Server (uvicorn/hypercorn)]
    ASGI-Server --> Router[ASGI Framework Router]
    Router --> Endpoint[Endpoint Function]
    Endpoint -->|await| DB[Async DB]
    Endpoint -->|await| HTTPClient[Async HTTP Client]
    Endpoint --> Response

19.3 FastAPI — The Modern Standard

FastAPI is built on:

Starlette (routing, WebSockets, background tasks)

Pydantic (validation & serialization)

uvicorn (ASGI server)

19.3.1 Basic FastAPI App
from fastapi import FastAPI

app = FastAPI()

@app.get("/hello")
async def hello():
    return {"msg": "Hello"}


Run:

uvicorn app:app --reload

19.3.2 Request Validation with Pydantic
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    count: int

@app.post("/items")
async def create_item(item: Item):
    return item

19.3.3 Dependency Injection System

FastAPI includes a built-in DI system:

from fastapi import Depends

async def get_db():
    async with async_session() as session:
        yield session

@app.get("/users")
async def list_users(db = Depends(get_db)):
    return await db.execute(...)

19.3.4 Background Tasks
from fastapi import BackgroundTasks

async def send_email(to):
    print(f"Sent email to {to}")

@app.post("/email")
async def send(to: str, bg: BackgroundTasks):
    bg.add_task(send_email, to)
    return {"queued": True}

19.3.5 Streaming Responses
from fastapi.responses import StreamingResponse

async def stream():
    for i in range(10):
        yield f"{i}\n"

@app.get("/stream")
async def get_stream():
    return StreamingResponse(stream())

19.4 Starlette (FastAPI’s Core)

Starlette provides:

routing

WebSockets

background tasks

middleware

sessions

streaming

large file responses

test client

19.4.1 Starlette Example
from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.routing import Route

async def homepage(request):
    return JSONResponse({"hello": "world"})

app = Starlette(routes=[Route("/", homepage)])

19.5 Async ORMs for Web Apps
19.5.1 SQLAlchemy 2.0 Async
async with async_session() as session:
    result = await session.execute(User.select())

19.5.2 Tortoise ORM
await User.create(name="Alice")
users = await User.all()

19.5.3 Piccolo ORM

Fast, async, migration-friendly.

19.6 WebSockets

ASGI WebSockets allow interactive real-time communication.

19.6.1 FastAPI WebSocket Example
from fastapi import WebSocket

@app.websocket("/ws")
async def ws(websocket: WebSocket):
    await websocket.accept()
    while True:
        msg = await websocket.receive_text()
        await websocket.send_text(f"Echo: {msg}")

19.6.2 Broadcast System (Redis Pub/Sub)

Useful for:

chat

collaboration tools

dashboards

19.7 Middleware & Interceptors

Middleware pattern:

@app.middleware("http")
async def log(request, call_next):
    response = await call_next(request)
    return response


Used for:

logging

error handling

metrics

rate limiting

authentication

19.8 Authentication & Authorization

Auth patterns:

JWT (simple, stateless)

OAuth2 (scopes, tokens)

Session cookies

API keys

HMAC signatures

19.8.1 JWT Auth Example
from fastapi.security import OAuth2PasswordBearer

oauth2 = OAuth2PasswordBearer(tokenUrl="token")

@app.get("/profile")
async def profile(token: str = Depends(oauth2)):
    ...

19.9 Rate Limiting

Patterns:

token buckets

Redis-based counters

middleware-based

Example (simple):

BUCKET = {}

async def rate_limit(ip):
    ...

19.10 CORS, Security, and HTTPS

Use FastAPI’s built-in CORS middleware.

from fastapi.middleware.cors import CORSMiddleware


Security Best Practices:

never enable CORS="*" in production

HTTPS enforcement

secure cookies

appropriate headers

strip debug info from errors

19.11 Scaling Async Web Apps

Scaling strategy:

uvicorn + workers

Gunicorn (ASGI worker class)

Kubernetes Horizontal Pod Autoscaling

Redis / RabbitMQ for background tasks

Connection pooling

Reverse proxies (Nginx, Envoy, Traefik)

19.12 Observability & Distributed Tracing

Tools:

OpenTelemetry

Prometheus metrics

Elastic APM

Jaeger tracing

ASGI middleware can inject:

request IDs

correlation IDs

logs

spans

19.13 Enterprise Design Patterns for Async Web Apps
19.13.1 Pattern: API Layer → Service Layer → Repo Layer
[API] → [Service] → [Repository] → [DB]

19.13.2 Pattern: Request-Scoped DB Sessions

Critical to avoid:

stale connections

transaction leaks

inconsistent state

19.13.3 Pattern: Message-Driven Integrations

Use:

Kafka

Redis Streams

RabbitMQ

For:

event-driven workflows

async background processing

19.14 Mini Example — FastAPI + SQLAlchemy Async
@app.post("/users")
async def create_user(user: UserIn, session=Depends(get_session)):
    u = User(name=user.name)
    session.add(u)
    await session.commit()
    return u

19.15 Macro Example — Complete Async Web Service

19.15.0 Code Evolution: Simple → Production-Ready

Stage 1: Simple FastAPI endpoint (beginner)

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    # Direct database access (not recommended for production)
    return {"id": user_id, "name": "Alice"}
    # Output: {"id": 1, "name": "Alice"}
```

Stage 2: Add Pydantic models (intermediate)

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class UserResponse(BaseModel):
    id: int
    name: str

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    return UserResponse(id=user_id, name="Alice")
    # Output: {"id": 1, "name": "Alice"}
```

Stage 3: Add database layer (advanced)

```python
from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from pydantic import BaseModel

app = FastAPI()
engine = create_async_engine("postgresql+asyncpg://...")
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

class UserResponse(BaseModel):
    id: int
    name: str

async def get_db():
    async with SessionLocal() as session:
        yield session

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    # Database query here
    return UserResponse(id=user_id, name="Alice")
    # Output: {"id": 1, "name": "Alice"}
```

Stage 4: Production-ready with Repository + Service layers (expert)

See full example below with proper separation of concerns.

Directory:

app/
  api/
    routes.py
  domain/
    models.py
  services/
    user_service.py
  infrastructure/
    db.py
    repo.py


Combines:

FastAPI

SQLAlchemy async

Repository pattern

DI

Events

Pydantic

Try This: Start with Stage 1, then progressively add features from Stages 2-4. This teaches you why each layer exists.

19.16 Pitfalls & Warnings

⚠ mixing async and sync DB calls
⚠ blocking code inside async handlers
⚠ using requests inside async code (use httpx)
⚠ creating sessions per query instead of per request
⚠ global sessions
⚠ forgetting to close WebSocket connections
⚠ synchronous file operations inside async apps
⚠ unbounded concurrency (thundering herd)

19.17 Summary & Takeaways

ASGI replaces WSGI for modern web development

FastAPI is the top choice for async APIs

async ORMs enable full-stack async

WebSockets support real-time features

DI, background tasks, middleware = essential features

scaling requires uvicorn/gunicorn + clustering

observability is a must

enterprise systems require good architecture boundaries

19.18 Next Chapter

Proceed to:

👉 Chapter 20 — Data Engineering with Python
Topics include:

NumPy

Pandas

Polars

ETL patterns

schema validation (Great Expectations, pandera)

data pipelines

multiprocessing for data

Apache Spark (PySpark)

Arrow, Parquet, ORC

streaming data

performance optimization

📘 CHAPTER 20 — DATA ENGINEERING WITH PYTHON

Depth Level: 2.5–3
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–19

20.0 Overview

Python is one of the most widely used languages for:

Data transformation

ETL pipelines

Data cleansing

Analytics scripting

Machine learning input pipelines

Data validation

Streaming ingestion

Big-data processing (Spark, Dask, Ray)

Interoperability (Arrow ecosystem)

This chapter covers:

The core data libraries (NumPy, Pandas, Polars)

The Arrow ecosystem (Parquet, Feather, ORC)

Multiprocessing & vectorization

Data validation frameworks

ETL architecture patterns

Streaming & message systems

Integration with Spark (PySpark)

Performance strategies

Real-world data pipeline examples

20.1 The Core Tools of Python Data Engineering

Python’s data stack includes:

Foundational

NumPy

Python built-ins (list, dict, generator pipelines)

csv, json, pathlib

Tabular Processing

Pandas

Polars

DuckDB

IO / Serialization

pyarrow

Parquet, ORC, Arrow IPC files

msgpack

orjson

Big Data / Distributed

PySpark

Dask

Ray Data

Streaming

Kafka (via confluent-kafka)

Faust

asyncio + asyncpg pipelines

Validation

Pydantic

Pandera

Great Expectations

20.2 NumPy — Foundation of Numerical Data

NumPy powers:

vectorized operations

fast numerical computation

array-based transformations

ML preprocessing

Backends for Pandas, Polars, SciPy, PyTorch

20.2.1 Creating Arrays
import numpy as np

x = np.array([1, 2, 3], dtype=np.float64)

20.2.2 Vectorization

Key performance concept:

x = np.arange(1_000_000)
y = np.sin(x)  # 1000x faster than Python loops


Vectorization eliminates the Python loop overhead.

20.2.3 Broadcasting
x = np.array([1,2,3])
x + 10

20.3 Pandas — Python’s Most Used Data Engineering Tool

Pandas is not the fastest tool, but it is:

simple

expressive

ubiquitous

20.3.1 Creating a DataFrame
import pandas as pd

df = pd.DataFrame({
    "name": ["Alice", "Bob"],
    "age": [30, 25]
})

20.3.2 Reading/Writing Files
df = pd.read_csv("data.csv")
df.to_parquet("data.parquet")

20.3.3 Filtering
df[df["age"] > 20]

20.3.4 GroupBy
df.groupby("city")["price"].mean()

20.3.5 Pitfalls

⚠ Pandas copies data often
⚠ df.apply() is slow
⚠ loops inside DataFrame operations kill performance
⚠ 32-bit integers silently convert to float
⚠ memory usage can explode on large tables

20.4 Polars — The Modern Pandas Replacement (Rust Backend)

Polars is:

much faster

lazy execution

multi-threaded

memory-efficient

Arrow-native

20.4.1 Lazy Query Example
import polars as pl

df = (
    pl.scan_csv("big.csv")
      .filter(pl.col("amount") > 0)
      .groupby("user_id")
      .agg(pl.col("amount").sum())
      .collect()
)


Lazy execution = optimized pipelines.

20.5 Apache Arrow Ecosystem

Arrow is the modern columnar data foundation for Python.

Supports:

zero-copy transfer between Pandas/Polars/Spark

Parquet & Feather

cloud-native processing

20.5.1 Reading Parquet with PyArrow
import pyarrow.parquet as pq
table = pq.read_table("data.parquet")

20.5.2 Converting to Pandas or Polars
df = table.to_pandas()
pl_df = pl.from_arrow(table)

20.6 The ETL (Extract → Transform → Load) Lifecycle

ETL is the heart of data engineering.

flowchart LR
    A[Extract] --> B[Transform]
    B --> C[Load]

20.6.1 Extract

Sources:

CSV, Parquet, JSON

SQL databases

APIs (async fetching)

Kafka

Object storage (S3/GCS/Azure Blob)

20.6.2 Transform

Tasks:

cleaning

deduplication

normalization

joins

aggregations

type normalization

schema alignment

Tools:

Pandas

Polars

PySpark

Arrow compute

20.6.3 Load

Targets:

PostgreSQL

BigQuery

Snowflake

S3

Data lakes

Elastic

20.7 Data Validation (Critical)
Validators:

Pydantic (row-level validation)

Pandera (DataFrame-level validation)

Great Expectations (pipeline-level validation)

20.7.1 Pandera Example
import pandera as pa
from pandera import Column, DataFrameSchema

schema = DataFrameSchema({
    "age": Column(int, pa.Check.ge(0)),
})

schema.validate(df)

20.7.2 Great Expectations Example

Used for enterprise pipelines.

20.8 Multiprocessing for Data Pipelines

Python’s GIL limits heavy CPU work; use multiprocessing.

20.8.1 Chunk Processing Example
from multiprocessing import Pool

def process_chunk(chunk):
    return chunk.assign(total=chunk["a"] + chunk["b"])

with Pool() as p:
    results = p.map(process_chunk, chunks)

20.9 Async Pipelines

Async is excellent for:

API extraction

asynchronous I/O

streaming data

20.9.1 Async ETL Pattern
async def extract(url):
    async with httpx.AsyncClient() as client:
        return await client.get(url)

async def transform(data):
    ...

async def load(data):
    ...

20.10 Streaming Data with Kafka

Kafka client:

from confluent_kafka import Consumer

c = Consumer({"bootstrap.servers": "localhost"})
c.subscribe(["events"])
msg = c.poll(1.0)

20.11 PySpark (Distributed Processing)

PySpark integrates Python with the Spark engine.

20.11.1 Creating Spark Session
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("pipeline").getOrCreate()

20.11.2 DataFrame Example
df = spark.read.parquet("s3://bucket/data/")
df.groupBy("user_id").sum("amount").show()

20.12 DuckDB — In-Process OLAP Engine

Use SQL directly on Parquet/Arrow files:

import duckdb
df = duckdb.query("SELECT * FROM 'data.parquet' WHERE amount > 0").to_df()

20.13 Columnar Formats: Parquet, Feather, ORC
Parquet — best for analytics
Feather — super fast for Python I/O
ORC — similar to Parquet (Hadoop world)
df.to_parquet("data.parquet")

20.14 Performance Optimization
20.14.1 Avoid df.apply

Use vectorization or Polars instead.

20.14.2 Use Chunking
for chunk in pd.read_csv("big.csv", chunksize=100_000):
    ...

20.14.3 Prefer Arrow-backed formats

10× faster

columnar

better compression

20.14.4 Use multiprocessing for heavy transforms
20.14.5 Avoid Python loops in transformations
20.14.6 Push filtering close to source (SQL / DuckDB)
20.15 End-to-End ETL Pipeline (Macro Example)

Full pipeline using:

Async extraction

Polars transformation

Pandera validation

Parquet output

multiprocessing for CPU-bound transforms

pipeline.py
import polars as pl
import asyncio, httpx
import pandera as pa
from pandera import Column, DataFrameSchema
from multiprocessing import Pool

URLS = [...]

schema = DataFrameSchema({
    "id": Column(int),
    "amount": Column(float),
})

async def fetch(url):
    async with httpx.AsyncClient() as c:
        r = await c.get(url)
        return r.json()

def transform(batch):
    return (
        pl.DataFrame(batch)
          .with_columns(pl.col("amount").cast(pl.Float64))
    )

async def extract_all():
    return await asyncio.gather(*(fetch(u) for u in URLS))

async def main():
    raw_batches = await extract_all()

    with Pool() as p:
        frames = p.map(transform, raw_batches)

    df = pl.concat(frames)
    schema.validate(df.to_pandas())

    df.write_parquet("output.parquet")

asyncio.run(main())


This is a real-world ETL structure.

20.16 Pitfalls & Warnings

⚠ using Pandas for >10M rows (switch to Polars/DuckDB)
⚠ using CSV for data lakes
⚠ using df.apply() everywhere
⚠ forgetting schema validation
⚠ mixing async and sync DB access
⚠ loading huge datasets into memory at once
⚠ relying on Python loops for heavy transforms
⚠ missing data lineage documentation
⚠ storing sensitive data in raw logs

20.17 Summary & Takeaways

NumPy provides fast vectorized operations

Pandas is universal, but Polars is faster and more scalable

Arrow is the backbone of high-performance analytics

Parquet is the preferred data lake format

Multiprocessing accelerates CPU-heavy transforms

AsyncIO is ideal for extraction & streaming

Data validation must be explicit

DuckDB enables SQL-on-files with amazing speed

PySpark scales to clusters

A real ETL pipeline integrates: extract → transform → validate → store

20.18 Next Chapter

Proceed to:

👉 Chapter 21 — Packaging, Distribution & Deployment
This chapter covers:

Python packaging formats (wheel, sdist)

pyproject.toml

Python’s packaging ecosystem

versioning

publishing to PyPI

building CLI tools

application deployment patterns

container-based distribution

architecture for multi-service deployments


