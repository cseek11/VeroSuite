<!-- SSM:CHUNK_BOUNDARY id="ch27-start" -->
📘 CHAPTER 27 — FORMAL SEMANTICS & THE PYTHON EXECUTION MODEL 🔴 Advanced

Depth Level: 4
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–25, strong CS background

27.0 Overview

Most Python developers learn syntax and behavior — but very few understand the formal semantics that define why Python behaves the way it does.

This chapter provides:

formal operational semantics

theoretical evaluation models

references to lambda calculus

abstract machines (CEK, SECD variants)

scoping rules

binding and environment models

the Python Data Model as mathematical objects

exception propagation semantics

concurrency semantics (threads, tasks, the GIL)

memory & object lifetime semantics

The goal:
Make Python fully explainable as a rigorous programming language with mathematical precision.

27.1 What Are Formal Semantics?

Formal semantics explain how a language executes, independent of implementation.

Three classical approaches:

1. Operational Semantics

Rules that say: this statement transforms the state into that state.

2. Denotational Semantics

Mathematical objects represent program meaning.

3. Axiomatic Semantics

Logic rules for proving correctness.

Python is best described with small-step operational semantics.

27.2 Python as a State Machine

Python code is executed as a sequence of state transitions.

A program state includes:

global environment

local environment

call stack

instruction pointer

exception state

value stack

heap (objects)

coroutine/task registry

**Formal State Definition:**

We define a program state using standard operational semantics notation:

```
State = (Env, Stack, Heap, IP, Exception, Tasks)

where:
  Env = Env_global × Env_local × Env_enclosing  (environment chain)
  Stack = [Frame₁, Frame₂, ..., Frameₙ]  (call stack, Frame = (code, locals, IP))
  Heap = {ref ↦ Object}  (object store, ref ∈ Address)
  IP = instruction pointer (bytecode offset)
  Exception = None | (exc_type, exc_value, exc_tb)
  Tasks = {task_id ↦ CoroutineState}  (for asyncio)
```

**State Transition Rules:**

Each Python statement/expression applies a small-step transition:

```
⟨stmt, σ⟩ → σ'    (statement transforms state)

or

⟨expr, σ⟩ → ⟨v, σ'⟩    (expression evaluates to value, may modify state)
```

**Example: Assignment Statement**

```
──────────────────────────────────────────────────  [Eval-Assign]
⟨expr, σ⟩ → ⟨v, σ'⟩    σ'[name ↦ v] = σ''
──────────────────────────────────────────────────
⟨name = expr, σ⟩ → σ''
```

**Reference:** This follows Plotkin's Structural Operational Semantics (SOS) framework.

27.3 Evaluation Strategy

Python uses:

✔ Applicative-order (eager)

arguments are evaluated before the function call

✔ Strict evaluation

no laziness except generators & iterators

✔ Call-by-value semantics (but values = object references)
✔ Left-to-right evaluation order

This is guaranteed by the language spec.

Example:
f(g(), h())


Evaluation order is:

evaluate g() → v₁

evaluate h() → v₂

call f(v₁, v₂)

**Formal Semantics (Small-Step Operational Semantics):**

We use standard notation from operational semantics literature (Plotkin, Wright & Felleisen):

```
State = (Env, Stack, Heap, IP, Exception)

where:
  Env = {name ↦ reference}  (environment mapping names to heap references)
  Stack = [Frame₁, Frame₂, ...]  (call stack)
  Heap = {ref ↦ Object}  (object store)
  IP = instruction pointer
  Exception = None | (ExceptionType, value, traceback)
```

**Evaluation Rules (Inference Rules):**

```
─────────────────────────────────────────────  [Eval-App]
⟨g(), σ⟩ → v₁    ⟨h(), σ'⟩ → v₂
─────────────────────────────────────────────
⟨f(g(), h()), σ⟩ → ⟨f(v₁, v₂), σ''⟩
```

**Complete Evaluation Sequence:**

```
Step 1: ⟨g(), σ⟩ → v₁
Step 2: ⟨h(), σ⟩ → v₂  
Step 3: ⟨f(v₁, v₂), σ⟩ → result

Final: ⟨f(g(), h()), σ⟩ → result
```

**Reference:** This follows the standard small-step operational semantics approach used in:
- Plotkin, G. D. (1981). "A Structural Approach to Operational Semantics"
- Wright, A. K., & Felleisen, M. (1994). "A Syntactic Approach to Type Soundness"
- Politz, J. G., et al. (2013). "Python: The Full Monty" (Python semantics work)

27.4 The Python Environment Model

Python’s model is a hybrid of:

lexical scoping

dynamic stack frames

runtime objects

late binding of names in closures

A binding maps a name to an object:

Env = { name ↦ object_reference }


Every function call creates a new local environment with:

locals

cell variables

free variables

27.5 LEGB Rule as Formal Semantics

The LEGB rule describes name resolution:

Local

Enclosing

Global

Builtins

**Formal Name Resolution Semantics:**

Using standard environment model notation:

```
resolve(name, Env) = 
  if name ∈ dom(Env_local):
    Env_local[name]
  else if name ∈ dom(Env_enclosing):
    Env_enclosing[name]
  else if name ∈ dom(Env_global):
    Env_global[name]
  else if name ∈ dom(Builtins):
    Builtins[name]
  else:
    NameError
```

**Environment Concatenation:**

```
Env = Env_local ⊎ Env_enclosing ⊎ Env_global ⊎ Builtins

where ⊎ denotes environment union (with precedence: local > enclosing > global > builtins)
```

**Inference Rule Form:**

```
──────────────────────────────────────  [Resolve-Local]
name ∈ dom(Env_local)
──────────────────────────────────────
⟨name, Env⟩ → Env_local[name]

──────────────────────────────────────  [Resolve-Enclosing]
name ∉ dom(Env_local)    name ∈ dom(Env_enclosing)
──────────────────────────────────────
⟨name, Env⟩ → Env_enclosing[name]

──────────────────────────────────────  [Resolve-Global]
name ∉ dom(Env_local ∪ Env_enclosing)    name ∈ dom(Env_global)
──────────────────────────────────────
⟨name, Env⟩ → Env_global[name]

──────────────────────────────────────  [Resolve-Builtin]
name ∉ dom(Env_local ∪ Env_enclosing ∪ Env_global)    name ∈ dom(Builtins)
──────────────────────────────────────
⟨name, Env⟩ → Builtins[name]

──────────────────────────────────────  [Resolve-Error]
name ∉ dom(Env_local ∪ Env_enclosing ∪ Env_global ∪ Builtins)
──────────────────────────────────────
⟨name, Env⟩ → NameError("name 'name' is not defined")
```

27.6 Closures — A Mathematical View

Given:

def outer(x):
    def inner(y):
        return x + y
    return inner


**Formal Closure Semantics:**

A closure is a pair of function code and captured environment:

```
Closure = (code, Env_captured)

where:
  code = function body (AST or bytecode)
  Env_captured = {free_var ↦ reference}  (free variables from enclosing scope)
```

**Closure Creation Rule:**

```
────────────────────────────────────────────────────  [Eval-FunDef]
Env' = {x ↦ v | x ∈ free_vars(fun_body) ∧ x ∈ dom(Env)}
────────────────────────────────────────────────────
⟨def outer(x): ... def inner(y): return x + y, Env⟩ 
  → ⟨closure(inner_code, Env' = {x ↦ Env[x]}), Env⟩
```

**Closure Application Rule:**

```
────────────────────────────────────────────────────  [Eval-ClosureApp]
⟨closure(code, Env_captured), Env⟩ → fun_obj
⟨arg, Env⟩ → v
Env_new = Env_captured ∪ {param ↦ v}  (extend with argument)
⟨code, Env_new⟩ → result
────────────────────────────────────────────────────
⟨closure(code, Env_captured)(arg), Env⟩ → result
```

**Example:**

```python
def outer(x):
    def inner(y):
        return x + y
    return inner

# Formal representation:
# outer_code = λx. (λy. x + y)
# When outer(5) is called:
#   Env_captured = {x ↦ 5}
#   Returns: closure(inner_code, {x ↦ 5})
# When closure(3) is called:
#   Env_new = {x ↦ 5, y ↦ 3}
#   Evaluates: x + y → 5 + 3 → 8
```

**Lexical vs Dynamic Scoping:**

- **Lexical (Python)**: Environment captured at definition time
- **Dynamic**: Environment from call site (not used in Python)

**Reference:** This follows the standard closure semantics from:
- Abelson, H., & Sussman, G. J. (1996). "Structure and Interpretation of Computer Programs"
- Felleisen, M., et al. (2009). "Semantics Engineering with PLT Redex"

27.7 Python & Lambda Calculus

Python is not purely functional, but:

lambdas = anonymous functions

closures = environments + function bodies

comprehensions = higher-order combinators

decorators = higher-order functions

Mapping example:

lambda x: x + 1


In lambda calculus:

λx. x + 1


Function application:

(λx. E)(v) → E[x := v]


Python function call semantics approximate this, but with:

references instead of values

side effects

exceptions

dynamic typing

27.8 Python's Type System: Formal View

Python is:

dynamically typed

gradually typed (PEP 484+)

nominal for classes

structural for protocols

duck-typed for runtime

sound but incomplete (type checkers only approximate truth)

**Formal Type System Semantics:**

Using standard type theory notation:

```
Typing Judgment: Γ ⊢ e : τ

where:
  Γ = {x₁ : τ₁, x₂ : τ₂, ...}  (typing environment)
  e = expression
  τ = type
```

**Type Inference Rules:**

```
────────────────────────────────  [T-Var]
x : τ ∈ Γ
────────────────────────────────
Γ ⊢ x : τ

────────────────────────────────  [T-Int]
────────────────────────────────
Γ ⊢ n : int    (for integer literal n)

────────────────────────────────  [T-Str]
────────────────────────────────
Γ ⊢ s : str    (for string literal s)

────────────────────────────────  [T-Fun]
Γ, x : τ₁ ⊢ body : τ₂
────────────────────────────────
Γ ⊢ (λx: τ₁. body) : τ₁ → τ₂

────────────────────────────────  [T-App]
Γ ⊢ f : τ₁ → τ₂    Γ ⊢ arg : τ₁
────────────────────────────────
Γ ⊢ f(arg) : τ₂

────────────────────────────────  [T-Union]
Γ ⊢ e : τ₁    or    Γ ⊢ e : τ₂
────────────────────────────────
Γ ⊢ e : τ₁ | τ₂
```

**Type Checker Properties:**

- **Sound but Incomplete**: Type checkers reject some valid programs (false positives)
- **Partial Constraint Solver**: mypy, pyright, pyre solve type constraints approximately
- **Gradual Typing**: Untyped code (Any) can interact with typed code

**Reference:** 
- Pierce, B. C. (2002). "Types and Programming Languages"
- Siek, J., & Taha, W. (2006). "Gradual Typing for Functional Languages"

27.9 The Python Data Model as Algebraic Structures

Objects follow:

identity

equality

ordering

hashing

mutability

**Equality Semantics:**

```
──────────────────────────────────────  [Eval-Eq]
⟨obj.__eq__(other), σ⟩ → ⟨True, σ'⟩    or    ⟨False, σ'⟩
──────────────────────────────────────
⟨obj == other, σ⟩ → ⟨obj.__eq__(other), σ⟩

Properties:
  - Reflexive: ∀x. x == x
  - Symmetric: x == y ⟺ y == x
  - Transitive: (x == y) ∧ (y == z) ⟹ (x == z)
  - Not guaranteed: objects may violate these (bad practice)
```

**Ordering Semantics (Partial Order):**

```
──────────────────────────────────────  [Eval-Lt]
⟨obj.__lt__(other), σ⟩ → ⟨True, σ'⟩    or    ⟨False, σ'⟩
──────────────────────────────────────
⟨obj < other, σ⟩ → ⟨obj.__lt__(other), σ⟩

Properties:
  - Partial: Not all objects are comparable
  - If comparable: must satisfy transitivity, antisymmetry
  - TypeError raised if objects are not comparable
```

**Hashing Semantics:**

```
──────────────────────────────────────  [Eval-Hash]
⟨obj.__hash__(), σ⟩ → ⟨h, σ'⟩    h ∈ ℤ
──────────────────────────────────────
⟨hash(obj), σ⟩ → ⟨h, σ'⟩

Invariant (for hashable objects):
  obj₁ == obj₂ ⟹ hash(obj₁) == hash(obj₂)
  
Violation raises TypeError at runtime.
```

**Algebraic Structures:**

Python objects form various algebraic structures:

- **Sets**: `{x, y, z}` - unordered, unique elements
- **Mappings**: `{k: v}` - key-value pairs
- **Sequences**: `[x, y, z]` - ordered, indexed
- **Iterables**: Objects with `__iter__()` method
- **Iterators**: Objects with `__next__()` method

**Formal Structure Definitions:**

```
Set = {x₁, x₂, ..., xₙ}    (unordered, unique)

Map = {k₁ ↦ v₁, k₂ ↦ v₂, ...}    (key-value pairs)

Sequence = [v₁, v₂, ..., vₙ]    (ordered, indexed)

Iterable = {obj | obj has __iter__()}

Iterator = {obj | obj has __next__() ∧ obj ∈ Iterable}
```

contexts

These are algebraic categories.

27.10 Control Flow Semantics

Conditional:

if E1: S1 else S2


Operational rule:

if eval(E1) == true:
    S1
else:
    S2

Loops

Python uses a combination of:

guard evaluation

iterator protocol

implicit StopIteration

For:

for x in iterable:
    body


Formal expansion:

it = iter(iterable)
loop:
    try:
        x = next(it)
        body
        goto loop
    except StopIteration:
        pass

27.11 Exception Semantics

Exceptions use stack unwinding.

State = (Stack, Environment, Exception?)


When an exception is raised:

push exception

unwind frames

search for handler

if none found → propagate to top level

Formal rule:

⟨raise E, σ⟩ → ⟨σ', Exception(E)⟩

27.12 Function Call Semantics (Full Formal Model)

Call form:

result = f(a1, a2, ..., an)


Steps:

evaluate function expression → f

evaluate args → v1..vn

create new frame

bind parameters

initialize locals

evaluate body

return value

27.13 Generator Semantics (Coroutines in Disguise)

Generators implement the resumable function model:

State = (Code, Env, InstructionPointer, YieldValue)


next(gen) performs:

resume execution

run until yield

suspend state

Formal model:
⟨yield v, σ⟩ → ⟨paused(v), σ'⟩


This is similar to a CEK machine (Control, Environment, Kontinuation).

27.14 Concurrency Semantics

Python has 3 concurrency models:

1. Preemptive Threading (GIL-controlled)

Threads run one at a time under the GIL.

Formal model:

only one bytecode instruction executes at any instant

2. Cooperative AsyncIO

Coroutines explicitly yield control.

Formal rule:

await E → suspend until E complete


This forms an event loop machine.

3. Multiprocessing

Independent processes → separate interpreter + GIL.

27.15 Memory Model & Object Lifetime

Python uses:

reference counting

generational garbage collector

Lifetime rule:

object is destroyed when refcount drops to 0


Ref cycles:

detected by GC

but objects with __del__ require special handling

26.16 Bytecode Semantics (CPython)

Python source → AST → bytecode → interpreter loop.

Formal model:

IP = Instruction Pointer
Stack = Value Stack

execute(bytecode[i], Stack) → Stack'
next IP


Example bytecode:

import dis

def f(x):
    return x + 1

dis.dis(f)

26.17 The Interpreter Loop (Eval Loop)

Core pseudocode:

for (;;) {
    opcode = *ip++;
    switch(opcode) {
        case LOAD_CONST:
            push(const);
            break;
        case BINARY_ADD:
            b = pop();
            a = pop();
            push(a+b);
            break;
    }
}

26.18 Abstract Interpretation (Type Inference)

Used in:

mypy

pyre

pyright

Works by:

constructing control-flow graph

propagating constraints

fixing a least fixed point

This is how static analyzers reason about dynamic code.

26.19 Pitfalls of Python Semantics

⚠ Late binding inside lambdas & loops
⚠ Mutable default arguments
⚠ Name resolution surprises
⚠ Generator close semantics
⚠ Exception shadowing
⚠ Async context schedule ordering

26.20 Summary & Takeaways

Python’s semantics can be modeled using formal operational rules

execution is a sequence of state transitions

names resolve via LEGB lexical environments

closures capture environment frames

Python maps to lambda calculus with side effects

bytecode evaluation uses a stack machine

exceptions propagate via stack unwinding

generators implement resumable functions

concurrency semantics vary by model (threading vs async vs processes)

understanding formal semantics enables reliable reasoning about code behavior
