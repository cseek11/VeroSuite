<!-- SSM:CHUNK_BOUNDARY id="ch10-start" -->
📘 CHAPTER 10 — ERROR HANDLING & EXCEPTIONS 🟡 Intermediate

Depth Level: 3
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–9

> **Quick Answer:**
> - **Always catch specific exceptions**, not bare `except:`
> - **Use `try/except/else/finally`** for full control
> - **Raise with context:** `raise NewError() from original_error`
> - **Use context managers (`with`)** for resource cleanup
> 
> ```python
> try:
>     result = risky_operation()
> except SpecificError as e:
>     logger.error(f"Failed: {e}")
>     raise CustomError("Operation failed") from e
> else:
>     return result  # Only runs if no exception
> finally:
>     cleanup()  # Always runs
> ```

**Estimated time:** 2-3 hours
**When you need this:** Robust application development, API design, production systems

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
