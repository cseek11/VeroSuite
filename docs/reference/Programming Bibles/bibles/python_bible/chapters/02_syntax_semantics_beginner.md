<!-- SSM:CHUNK_BOUNDARY id="ch02-start" -->
📘 CHAPTER 2 — SYNTAX & SEMANTICS 🟢 Beginner

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

Chapter 17 (Concurrency)

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
