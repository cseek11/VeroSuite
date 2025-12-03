<!-- SSM:CHUNK_BOUNDARY id="ch05-start" -->
📘 CHAPTER 5 — CONTROL FLOW 🟢 Beginner

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
