<!-- SSM:CHUNK_BOUNDARY id="ch15-start" -->
📘 CHAPTER 15 — DEBUGGING & TROUBLESHOOTING 🟡 Intermediate

Depth Level: 3
Python Versions: 3.8–3.14+
Prerequisites: Chapters 1–14

15.0 Overview

Debugging is the art of systematically finding and fixing bugs. This chapter covers:

- Interactive debugging with `pdb` and `ipdb`
- IDE debugging (VS Code, PyCharm)
- Remote debugging
- Structured logging for debugging
- Production debugging techniques
- Crash analysis and core dumps
- Performance debugging
- Memory debugging

15.1 Interactive Debugging with pdb

Python's built-in debugger `pdb` is essential for debugging Python code.

15.1.1 Basic pdb Usage

```python
import pdb

def divide(a, b):
    pdb.set_trace()  # Breakpoint
    return a / b

result = divide(10, 2)
```

**Common pdb Commands:**

| Command | Description |
|---------|-------------|
| `n` (next) | Execute next line |
| `s` (step) | Step into function |
| `c` (continue) | Continue execution |
| `l` (list) | Show current code |
| `p <var>` | Print variable |
| `pp <var>` | Pretty print variable |
| `w` (where) | Show stack trace |
| `u` (up) | Move up stack frame |
| `d` (down) | Move down stack frame |
| `q` (quit) | Quit debugger |

15.1.2 breakpoint() Built-in (Python 3.7+)

```python
def process_data(data):
    breakpoint()  # Modern way (calls pdb.set_trace())
    return data.upper()
```

**Environment Variable Control:**

```bash
# Disable breakpoints in production
PYTHONBREAKPOINT=0 python script.py

# Use custom debugger
PYTHONBREAKPOINT=ipdb.set_trace python script.py
```

15.2 ipdb: Enhanced Interactive Debugger

`ipdb` provides IPython-enhanced debugging with syntax highlighting and better UX.

**Installation:**

```bash
pip install ipdb
```

**Usage:**

```python
import ipdb

def complex_function():
    ipdb.set_trace()  # Enhanced breakpoint
    # ... your code ...
```

**Features:**
- Syntax highlighting
- Tab completion
- Better error messages
- IPython integration

15.3 IDE Debugging

15.3.1 VS Code Debugging

**Launch Configuration (`.vscode/launch.json`):**

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: Current File",
            "type": "debugpy",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal",
            "justMyCode": true
        },
        {
            "name": "Python: FastAPI",
            "type": "debugpy",
            "request": "launch",
            "module": "uvicorn",
            "args": ["main:app", "--reload"],
            "jinja": true,
            "justMyCode": false
        }
    ]
}
```

**Key Features:**
- Breakpoints (click left margin)
- Variable inspection
- Watch expressions
- Call stack navigation
- Step through code

15.3.2 PyCharm Debugging

PyCharm provides advanced debugging features:

- **Breakpoints:** Click left margin or `Ctrl+F8`
- **Conditional Breakpoints:** Right-click breakpoint → Add condition
- **Evaluate Expression:** `Alt+F8` to evaluate expressions
- **Attach to Process:** Debug → Attach to Process

15.4 Remote Debugging

For debugging production or remote servers:

15.4.1 debugpy (VS Code Remote Debugging)

**Server Code:**

```python
import debugpy

# Start debug server
debugpy.listen(5678)
print("Waiting for debugger to attach...")
debugpy.wait_for_client()  # Optional: wait for connection

# Your code here
def main():
    result = process_data()
    return result
```

**VS Code Configuration:**

```json
{
    "name": "Python: Remote Attach",
    "type": "debugpy",
    "request": "attach",
    "connect": {
        "host": "localhost",
        "port": 5678
    },
    "pathMappings": [
        {
            "localRoot": "${workspaceFolder}",
            "remoteRoot": "/app"
        }
    ]
}
```

15.5 Structured Logging for Debugging

Structured logging helps debug production issues.

15.5.1 Basic Structured Logging

```python
import logging
import json
from datetime import datetime

class StructuredLogger:
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s %(name)s %(levelname)s %(message)s'
        )
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)
        self.logger.setLevel(logging.DEBUG)
    
    def debug(self, event: str, **kwargs):
        self.logger.debug(json.dumps({
            "event": event,
            "timestamp": datetime.utcnow().isoformat(),
            **kwargs
        }))
```

15.5.2 Using structlog

```python
import structlog

logger = structlog.get_logger()

def process_order(order_id: str):
    logger.info("order.processing", order_id=order_id)
    try:
        result = validate_order(order_id)
        logger.info("order.validated", order_id=order_id, valid=result)
    except Exception as e:
        logger.error("order.failed", order_id=order_id, error=str(e))
        raise
```

15.6 Production Debugging Techniques

15.6.1 Logging Levels

```python
import logging

# Development
logging.basicConfig(level=logging.DEBUG)

# Production
logging.basicConfig(level=logging.INFO)
```

15.6.2 Correlation IDs

```python
import uuid
import logging

class CorrelationFilter(logging.Filter):
    def filter(self, record):
        record.correlation_id = getattr(
            record, 'correlation_id', str(uuid.uuid4())
        )
        return True

logger = logging.getLogger()
logger.addFilter(CorrelationFilter())
```

15.7 Performance Debugging

15.7.1 cProfile for Performance

```python
import cProfile
import pstats

def profile_function():
    profiler = cProfile.Profile()
    profiler.enable()
    
    # Your code
    result = slow_function()
    
    profiler.disable()
    stats = pstats.Stats(profiler)
    stats.sort_stats('cumulative')
    stats.print_stats(20)  # Top 20 functions
```

15.7.2 line_profiler for Line-by-Line

```python
# Install: pip install line_profiler

@profile  # Decorator for line_profiler
def slow_function():
    total = 0
    for i in range(1000000):
        total += i ** 2
    return total
```

**Run:**

```bash
kernprof -l -v script.py
```

15.8 Memory Debugging

15.8.1 tracemalloc for Memory Leaks

```python
import tracemalloc

tracemalloc.start()

# Your code
data = process_large_dataset()

snapshot = tracemalloc.take_snapshot()
top_stats = snapshot.statistics('lineno')

print("Top 10 memory allocations:")
for stat in top_stats[:10]:
    print(stat)
```

15.8.2 memory_profiler

```python
# Install: pip install memory-profiler

@profile
def memory_intensive():
    data = [i for i in range(1000000)]
    return sum(data)
```

**Run:**

```bash
python -m memory_profiler script.py
```

15.9 Common Debugging Patterns

15.9.1 Print Debugging (Quick & Dirty)

```python
def debug_print(*args, **kwargs):
    """Print with context."""
    import inspect
    frame = inspect.currentframe().f_back
    print(f"[{frame.filename}:{frame.lineno}]", *args, **kwargs)
```

15.9.2 Assertion-Based Debugging

```python
def process_data(data):
    assert data is not None, "Data cannot be None"
    assert len(data) > 0, "Data cannot be empty"
    # ... processing ...
```

15.10 Debugging Checklist

- [ ] Reproduce the bug consistently
- [ ] Add logging at key points
- [ ] Use breakpoints to inspect state
- [ ] Check variable types and values
- [ ] Verify assumptions with assertions
- [ ] Test edge cases
- [ ] Review recent changes (git blame)
- [ ] Check for race conditions (if concurrent)
- [ ] Verify environment (Python version, dependencies)

15.11 Summary & Takeaways

- `pdb` and `ipdb` are essential for interactive debugging
- `breakpoint()` is the modern way to add breakpoints
- IDE debugging provides powerful visual debugging
- Remote debugging enables production debugging
- Structured logging is crucial for production debugging
- Performance and memory profilers help find bottlenecks
- Always add correlation IDs for distributed systems

15.12 Next Chapter

Proceed to:
👉 Chapter 16 — Tooling & Development Workflow
