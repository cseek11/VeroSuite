<!-- SSM:CHUNK_BOUNDARY id="ch17-start" -->
📘 CHAPTER 17 — CONCURRENCY & PARALLELISM 🔴 Advanced

Depth Level: 3
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–15

> **Quick Answer:** 
> - **I/O-bound (many connections):** Use `asyncio` 
> - **CPU-bound (heavy computation):** Use `multiprocessing`
> - **Simple background tasks:** Use `threading`
> 
> ```python
> # asyncio for I/O-bound
> async def fetch_all(urls):
>     async with httpx.AsyncClient() as client:
>         tasks = [client.get(url) for url in urls]
>         return await asyncio.gather(*tasks)
> 
> # multiprocessing for CPU-bound
> from multiprocessing import Pool
> with Pool(4) as p:
>     results = p.map(cpu_heavy_function, data)
> ```

**Estimated time:** 4-6 hours
**When you need this:** High-concurrency servers, parallel data processing, background tasks

17.0 Overview

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

17.1 Why Concurrency Is Hard in Python

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

17.2 The GIL (Global Interpreter Lock)

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

17.3 Free-Threading (Python 3.14+)

Python 3.14 introduces:

python3.14 --disable-gil


Meaning:

each thread runs Python code independently

reference-counting replaced with atomic ops

CPython becomes truly parallel

performance cost for single-thread workloads (~5–15% slower)

Warning: Not all C extensions support free-threading yet.

17.4 Concurrency Comparison (the famous table)
Model	Parallel?	Best For	Worst For
Threads	❌ (≤3.12) / ✅ (3.14 FT)	Network IO, HTTP clients, websockets	CPU-bound work
Multiprocessing	✅	CPU-heavy tasks, ML preprocessing	High IPC overhead
AsyncIO	❌	100k+ network connections	CPU-bound work
ThreadPoolExecutor	Limited (GIL)	mixed I/O tasks	heavy CPU work
ProcessPoolExecutor	Yes	batch CPU tasks	small tasks (overhead)
17.5 THREADING

(IO-bound concurrency model)

17.5.1 Basic Threads
import threading

def worker():
    print("Hi")

t = threading.Thread(target=worker)
t.start()
t.join()

17.5.2 Race Conditions

Shared mutable state causes unpredictable bugs:

counter = 0

def inc():
    global counter
    for _ in range(100000):
        counter += 1


Even with GIL, += is not atomic → race condition.

17.5.3 Locks
lock = threading.Lock()

with lock:
    counter += 1

17.5.4 Queues (Thread-Safe)

Always prefer queues.

from queue import Queue
q = Queue()

q.put(1)
q.get()

17.5.5 ThreadPoolExecutor
from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor(max_workers=10) as ex:
    results = ex.map(fetch_url, urls)

17.6 MULTIPROCESSING

Multiprocessing provides true parallelism by running code in separate processes, bypassing the GIL entirely. Each process has its own Python interpreter and memory space.

**When to Use:**

✅ CPU-bound tasks (image processing, data analysis, ML preprocessing)
✅ Tasks that benefit from multiple CPU cores
✅ Isolated computations that don't need frequent communication
❌ IO-bound tasks (use threading or asyncio instead)
❌ Tasks requiring frequent data sharing (high IPC overhead)

17.6.1 Basic Process: Manual Process Management

**Creating and Running Processes:**

```python
from multiprocessing import Process
import os

def compute(name: str, data: list[int]):
    """CPU-intensive task."""
    print(f"Process {name} (PID: {os.getpid()}) processing {len(data)} items")
    result = sum(x * x for x in data)
    print(f"Process {name} result: {result}")
    return result

if __name__ == "__main__":
    # Create processes
    p1 = Process(target=compute, args=("Worker-1", range(1000000)))
    p2 = Process(target=compute, args=("Worker-2", range(1000000, 2000000)))
    
    # Start processes (non-blocking)
    p1.start()
    p2.start()
    
    # Wait for completion
    p1.join()
    p2.join()
    
    print("All processes completed")
```

**Process Communication:**

```python
from multiprocessing import Process, Queue
import time

def worker(name: str, queue: Queue):
    """Worker process that sends results back."""
    for i in range(5):
        result = f"{name}: Task {i} completed"
        queue.put(result)
        time.sleep(0.1)
    queue.put(None)  # Sentinel value

if __name__ == "__main__":
    queue = Queue()
    
    # Start worker
    p = Process(target=worker, args=("Worker", queue))
    p.start()
    
    # Collect results
    while True:
        result = queue.get()
        if result is None:
            break
        print(result)
    
    p.join()
```

**Process Attributes:**

```python
p = Process(target=compute, args=("test",))

# Process properties
print(p.name)        # Process name
print(p.pid)         # Process ID (None before start)
print(p.is_alive())  # Check if running
print(p.daemon)      # Daemon flag

# Start and wait
p.start()
p.join(timeout=5.0)  # Wait with timeout

# Terminate if needed
if p.is_alive():
    p.terminate()
    p.join()
```

**Try This:** Parallel file processing:
```python
from multiprocessing import Process
from pathlib import Path

def process_file(file_path: Path):
    """Process a single file."""
    print(f"Processing {file_path.name}")
    # Simulate CPU-intensive work
    data = file_path.read_text()
    result = len(data.split())
    return result

if __name__ == "__main__":
    files = list(Path("data").glob("*.txt"))
    processes = []
    
    # Create process for each file
    for file_path in files:
        p = Process(target=process_file, args=(file_path,))
        p.start()
        processes.append(p)
    
    # Wait for all
    for p in processes:
        p.join()
    
    print("All files processed")
```

17.6.2 ProcessPoolExecutor: High-Level Process Management

`ProcessPoolExecutor` provides a high-level interface for process pools, similar to `ThreadPoolExecutor` but for CPU-bound tasks.

**Basic Usage:**

```python
from concurrent.futures import ProcessPoolExecutor, as_completed
import time

def expensive_computation(n: int) -> int:
    """CPU-intensive computation."""
    result = sum(i * i for i in range(n))
    return result

if __name__ == "__main__":
    data = [1000000, 2000000, 3000000, 4000000, 5000000]
    
    # Process pool with automatic cleanup
    with ProcessPoolExecutor(max_workers=4) as executor:
        # Submit tasks
        futures = [executor.submit(expensive_computation, n) for n in data]
        
        # Get results as they complete
        for future in as_completed(futures):
            result = future.result()
            print(f"Result: {result}")
```

**Map Operations:**

```python
# Parallel map (similar to built-in map)
with ProcessPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(expensive_computation, data))
    print(results)

# Map with timeout
try:
    with ProcessPoolExecutor() as executor:
        results = list(executor.map(
            expensive_computation,
            data,
            timeout=30.0  # Total timeout for all tasks
        ))
except TimeoutError:
    print("Some tasks timed out")
```

**Error Handling:**

```python
def risky_computation(n: int) -> int:
    """May raise exception."""
    if n < 0:
        raise ValueError("Negative number")
    return n * n

with ProcessPoolExecutor() as executor:
    futures = [executor.submit(risky_computation, n) for n in [-1, 2, 3]]
    
    for future in as_completed(futures):
        try:
            result = future.result()
            print(f"Success: {result}")
        except ValueError as e:
            print(f"Error: {e}")
```

**Performance Comparison:**

```python
import time
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor

def cpu_task(n: int) -> int:
    """CPU-bound task."""
    return sum(i * i for i in range(n))

data = list(range(1000, 5000, 100))

# ThreadPool (limited by GIL)
start = time.perf_counter()
with ThreadPoolExecutor(max_workers=4) as executor:
    list(executor.map(cpu_task, data))
thread_time = time.perf_counter() - start

# ProcessPool (true parallelism)
start = time.perf_counter()
with ProcessPoolExecutor(max_workers=4) as executor:
    list(executor.map(cpu_task, data))
process_time = time.perf_counter() - start

print(f"ThreadPool: {thread_time:.2f}s")
print(f"ProcessPool: {process_time:.2f}s")
print(f"Speedup: {thread_time/process_time:.2f}x")
```

**Try This:** Parallel image processing:
```python
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path
from PIL import Image

def process_image(image_path: Path) -> Path:
    """Process single image (CPU-intensive)."""
    img = Image.open(image_path)
    # Resize and apply filters
    img = img.resize((800, 600))
    img = img.filter(Image.Filter.SHARPEN)
    output_path = image_path.parent / f"processed_{image_path.name}"
    img.save(output_path)
    return output_path

if __name__ == "__main__":
    images = list(Path("photos").glob("*.jpg"))
    
    with ProcessPoolExecutor(max_workers=4) as executor:
        results = list(executor.map(process_image, images))
    
    print(f"Processed {len(results)} images")
```

17.6.3 Shared Memory: Efficient Inter-Process Communication

For processes that need to share data, `multiprocessing` provides shared memory objects that are more efficient than pickling.

**Value and Array (Shared Memory):**

```python
from multiprocessing import Process, Value, Array
import time

def increment_counter(counter: Value, lock):
    """Increment shared counter."""
    for _ in range(100000):
        with lock:
            counter.value += 1

if __name__ == "__main__":
    # Shared integer (Value)
    counter = Value('i', 0)  # 'i' = integer type
    lock = multiprocessing.Lock()
    
    # Create processes
    processes = [
        Process(target=increment_counter, args=(counter, lock))
        for _ in range(4)
    ]
    
    for p in processes:
        p.start()
    for p in processes:
        p.join()
    
    print(f"Final counter value: {counter.value}")  # Should be 400000
```

**Shared Arrays:**

```python
from multiprocessing import Process, Array

def square_array(arr: Array, start: int, end: int):
    """Square elements in range."""
    for i in range(start, end):
        arr[i] = arr[i] * arr[i]

if __name__ == "__main__":
    # Shared array (typecode 'i' = int)
    shared_arr = Array('i', [1, 2, 3, 4, 5, 6, 7, 8])
    
    # Split work across processes
    p1 = Process(target=square_array, args=(shared_arr, 0, 4))
    p2 = Process(target=square_array, args=(shared_arr, 4, 8))
    
    p1.start()
    p2.start()
    p1.join()
    p2.join()
    
    print(list(shared_arr))  # [1, 4, 9, 16, 25, 36, 49, 64]
```

**Type Codes:**

```python
# Common type codes for Array/Value
'i'  # signed int (32-bit)
'f'  # float (32-bit)
'd'  # double/float (64-bit)
'c'  # char (1-byte)
'b'  # signed char
'B'  # unsigned char
'h'  # short
'H'  # unsigned short
'l'  # long
'L'  # unsigned long
'q'  # long long
'Q'  # unsigned long long

# Example
arr = Array('f', [1.0, 2.0, 3.0])  # Float array
val = Value('d', 3.14159)           # Double precision float
```

**⚠️ Synchronization Required:**

```python
# ❌ WRONG: Race condition
counter = Value('i', 0)
def bad_increment():
    counter.value += 1  # Not atomic!

# ✅ CORRECT: Use lock
from multiprocessing import Lock

lock = Lock()
def good_increment():
    with lock:
        counter.value += 1
```

**Try This:** Parallel matrix computation with shared memory:
```python
from multiprocessing import Process, Array, Lock
import math

def compute_row(arr: Array, row: int, cols: int, lock: Lock):
    """Compute values for one row."""
    for col in range(cols):
        index = row * cols + col
        with lock:
            arr[index] = math.sin(row) * math.cos(col)

if __name__ == "__main__":
    rows, cols = 1000, 1000
    shared_matrix = Array('d', [0.0] * (rows * cols))
    lock = Lock()
    
    # Process each row in parallel
    processes = [
        Process(target=compute_row, args=(shared_matrix, r, cols, lock))
        for r in range(rows)
    ]
    
    for p in processes:
        p.start()
    for p in processes:
        p.join()
    
    # Access results
    result = [shared_matrix[i] for i in range(rows * cols)]
    print(f"Computed {len(result)} values")
```

17.6.4 Managers: High-Level Inter-Process Communication

`Manager` provides high-level shared objects (dicts, lists, etc.) that work across processes but with more overhead than shared memory.

**Manager Objects:**

```python
from multiprocessing import Manager, Process

def worker(shared_dict: dict, shared_list: list):
    """Worker that modifies shared objects."""
    shared_dict['count'] = shared_dict.get('count', 0) + 1
    shared_list.append(os.getpid())

if __name__ == "__main__":
    manager = Manager()
    shared_dict = manager.dict()
    shared_list = manager.list()
    
    # Start workers
    processes = [
        Process(target=worker, args=(shared_dict, shared_list))
        for _ in range(5)
    ]
    
    for p in processes:
        p.start()
    for p in processes:
        p.join()
    
    print(f"Dict: {dict(shared_dict)}")
    print(f"List: {list(shared_list)}")
```

**Manager Types:**

```python
manager = Manager()

# Available types
shared_dict = manager.dict()
shared_list = manager.list()
shared_namespace = manager.Namespace()
shared_queue = manager.Queue()
shared_lock = manager.Lock()
shared_event = manager.Event()
shared_semaphore = manager.Semaphore(5)
shared_barrier = manager.Barrier(4)
```

**Namespace for Structured Data:**

```python
from multiprocessing import Manager, Process

def update_stats(stats):
    """Update statistics."""
    stats.processed += 1
    stats.total_time += 0.5

if __name__ == "__main__":
    manager = Manager()
    stats = manager.Namespace()
    stats.processed = 0
    stats.total_time = 0.0
    
    processes = [
        Process(target=update_stats, args=(stats,))
        for _ in range(10)
    ]
    
    for p in processes:
        p.start()
    for p in processes:
        p.join()
    
    print(f"Processed: {stats.processed}")
    print(f"Total time: {stats.total_time}")
```

**⚠️ Performance Trade-off:**

- **Managers**: Easy to use, but slower (pickling overhead)
- **Shared Memory (Value/Array)**: Faster, but limited types
- **Queues**: Good balance for producer-consumer patterns

**Try This:** Distributed task queue with Manager:
```python
from multiprocessing import Manager, Process
import time

def worker(task_queue: 'Queue', result_dict: dict, worker_id: int):
    """Worker process."""
    while True:
        task = task_queue.get()
        if task is None:  # Sentinel
            break
        
        # Process task
        result = task * 2
        result_dict[task] = result
        print(f"Worker {worker_id} processed task {task}")

if __name__ == "__main__":
    manager = Manager()
    task_queue = manager.Queue()
    result_dict = manager.dict()
    
    # Add tasks
    for i in range(20):
        task_queue.put(i)
    
    # Add sentinels
    num_workers = 4
    for _ in range(num_workers):
        task_queue.put(None)
    
    # Start workers
    workers = [
        Process(target=worker, args=(task_queue, result_dict, i))
        for i in range(num_workers)
    ]
    
    for w in workers:
        w.start()
    for w in workers:
        w.join()
    
    print(f"Results: {dict(result_dict)}")
```

17.6.5 Multiprocessing Pitfalls: Common Mistakes

**1. Pickling Overhead:**

```python
# ❌ BAD: Large objects passed to processes
large_data = [list(range(10000)) for _ in range(1000)]

def process(data):
    return sum(sum(row) for row in data)

# Each process receives full copy → huge memory usage
with ProcessPoolExecutor() as executor:
    results = executor.map(process, [large_data] * 10)

# ✅ BETTER: Pass indices or file paths
def process_by_index(start_idx, end_idx):
    # Load data in process
    data = load_data_slice(start_idx, end_idx)
    return process(data)
```

**2. Process Startup Cost:**

```python
# ❌ BAD: Many small tasks
def tiny_task(x):
    return x * 2

# Process startup overhead > task time
with ProcessPoolExecutor() as executor:
    results = list(executor.map(tiny_task, range(100)))  # Slow!

# ✅ BETTER: Batch small tasks
def batch_task(batch):
    return [x * 2 for x in batch]

batches = [list(range(i, i+100)) for i in range(0, 1000, 100)]
with ProcessPoolExecutor() as executor:
    results = list(executor.map(batch_task, batches))
```

**3. Lambda Functions:**

```python
# ❌ BAD: Lambdas can't be pickled
with ProcessPoolExecutor() as executor:
    results = executor.map(lambda x: x * 2, data)  # Error!

# ✅ CORRECT: Use named functions
def double(x):
    return x * 2

with ProcessPoolExecutor() as executor:
    results = executor.map(double, data)
```

**4. Main Guard Required:**

```python
# ❌ BAD: Without main guard (Windows/spawn mode)
p = Process(target=worker)
p.start()  # May re-import module, causing infinite loop!

# ✅ CORRECT: Always guard
if __name__ == "__main__":
    p = Process(target=worker)
    p.start()
    p.join()
```

**5. Shared State Issues:**

```python
# ❌ BAD: Trying to share unpicklable objects
class Unpicklable:
    def __init__(self):
        self.lock = threading.Lock()  # Can't pickle locks!

# ✅ CORRECT: Use Manager or shared memory
manager = Manager()
shared_obj = manager.Namespace()
```

**6. Fork vs Spawn:**

```python
# Unix: fork (fast, shares memory initially)
# Windows: spawn (slower, clean process)

# Force spawn mode (more portable)
import multiprocessing
multiprocessing.set_start_method('spawn')  # Must be called once, early

# Check current method
print(multiprocessing.get_start_method())  # 'fork', 'spawn', or 'forkserver'
```

**Try This:** Avoid common pitfalls:
```python
from multiprocessing import Process, Queue
import multiprocessing

# Set start method early
if __name__ == "__main__":
    multiprocessing.set_start_method('spawn')  # Portable
    
    def worker(q: Queue):
        """Worker that processes tasks."""
        while True:
            task = q.get()
            if task is None:
                break
            # Process task
            result = expensive_computation(task)
            print(f"Processed: {result}")
    
    queue = Queue()
    p = Process(target=worker, args=(queue,))
    p.start()
    
    # Send tasks
    for task in range(10):
        queue.put(task)
    queue.put(None)  # Sentinel
    
    p.join()
```

17.6.6 Process Communication: Advanced Patterns

**Pipes (Bidirectional Communication):**

```python
from multiprocessing import Process, Pipe

def worker(conn):
    """Worker with bidirectional communication."""
    while True:
        msg = conn.recv()
        if msg == "STOP":
            break
        result = process(msg)
        conn.send(result)
    conn.close()

if __name__ == "__main__":
    parent_conn, child_conn = Pipe()
    p = Process(target=worker, args=(child_conn,))
    p.start()
    
    # Send and receive
    parent_conn.send("task1")
    result = parent_conn.recv()
    print(result)
    
    parent_conn.send("STOP")
    p.join()
```

**Queues (Producer-Consumer):**

```python
from multiprocessing import Process, Queue
import time

def producer(queue: Queue):
    """Produce items."""
    for i in range(10):
        queue.put(f"Item {i}")
        time.sleep(0.1)
    queue.put(None)  # Sentinel

def consumer(queue: Queue):
    """Consume items."""
    while True:
        item = queue.get()
        if item is None:
            break
        print(f"Consumed: {item}")

if __name__ == "__main__":
    queue = Queue()
    
    p1 = Process(target=producer, args=(queue,))
    p2 = Process(target=consumer, args=(queue,))
    
    p1.start()
    p2.start()
    
    p1.join()
    p2.join()
```

**Try This:** Parallel data processing pipeline:
```python
from multiprocessing import Process, Queue
from typing import List

def stage1(input_queue: Queue, output_queue: Queue):
    """First stage: Load and filter."""
    while True:
        item = input_queue.get()
        if item is None:
            output_queue.put(None)
            break
        if item > 0:  # Filter
            output_queue.put(item * 2)

def stage2(input_queue: Queue, output_queue: Queue):
    """Second stage: Transform."""
    while True:
        item = input_queue.get()
        if item is None:
            output_queue.put(None)
            break
        output_queue.put(item ** 2)

def stage3(input_queue: Queue, results: List):
    """Third stage: Collect results."""
    while True:
        item = input_queue.get()
        if item is None:
            break
        results.append(item)

if __name__ == "__main__":
    q1, q2, q3 = Queue(), Queue(), Queue()
    results = []
    
    # Create pipeline
    p1 = Process(target=stage1, args=(q1, q2))
    p2 = Process(target=stage2, args=(q2, q3))
    p3 = Process(target=stage3, args=(q3, results))
    
    p1.start()
    p2.start()
    p3.start()
    
    # Feed data
    for i in range(-5, 10):
        q1.put(i)
    q1.put(None)
    
    p1.join()
    p2.join()
    p3.join()
    
    print(f"Results: {results}")
```

17.7 ASYNCIO

(modern Python concurrency)

17.7.1 Event Loop Diagram
flowchart TD
    A[Coroutines] --> B[Event Loop]
    B --> C[Await I/O]
    C --> D[Resume Coroutine]
    D --> B

17.7.2 Basic Coroutine
async def greet():
    return "hi"

17.7.3 Awaiting Tasks
async def main():
    await greet()
asyncio.run(main())

17.7.4 asyncio.gather
results = await asyncio.gather(
    fetch(1), fetch(2), fetch(3)
)

17.8 Structured Concurrency (Python 3.11+)

TaskGroups automatically manage:

cleanup

failure propagation

child cancellation

async with asyncio.TaskGroup() as tg:
    tg.create_task(fetch(1))
    tg.create_task(fetch(2))

17.9 Async Context Managers
class Resource:
    async def __aenter__(self): ...
    async def __aexit__(self, *a): ...

async with Resource():
    ...

17.10 Async Iterators
async for item in stream():
    ...

17.11 Queues in asyncio
queue = asyncio.Queue()
await queue.put(item)
item = await queue.get()

17.12 Mixing AsyncIO with Threads or Processes

A common pattern:

Async code handles network I/O

CPU tasks offloaded to ProcessPool

Blocking I/O tasks offloaded to ThreadPool

17.12.1 Offloading CPU Work
loop = asyncio.get_event_loop()
result = await loop.run_in_executor(
    ProcessPoolExecutor(),
    cpu_heavy_function,
    x
)

17.12.2 Offloading Blocking IO
await loop.run_in_executor(
    None,  # ThreadPool
    blocking_function
)

17.13 Practical Decision Tree

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

17.14 Mini Example — Async Web Scraper
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

17.15 Macro Example — Concurrency Pipeline

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

17.16 Pitfalls & Warnings

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

17.17 Summary & Takeaways

Use asyncio for high concurrency I/O

Use multiprocessing for CPU work

Use threads for blocking I/O

Understand the GIL and free-threading

Use queues to prevent shared-state problems

Use TaskGroups for structured concurrency

Avoid mixing sync and async without intention

Use ProcessPool to offload CPU-bound functions

17.18 Next Chapter

Proceed to:

👉 Chapter 18 — Advanced Architecture & Patterns
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
