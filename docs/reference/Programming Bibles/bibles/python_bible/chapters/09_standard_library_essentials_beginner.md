<!-- SSM:CHUNK_BOUNDARY id="ch09-start" -->
📘 CHAPTER 9 — STANDARD LIBRARY ESSENTIALS 🟢 Beginner

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

The `shutil` module provides high-level file operations for copying, moving, and archiving files and directories.

**Copying Files:**

```python
import shutil

# Copy single file
shutil.copy("source.txt", "dest.txt")  # Copies file, preserves permissions
shutil.copy2("source.txt", "dest.txt")  # Also preserves metadata (timestamps)

# Copy directory tree
shutil.copytree("src_dir", "dest_dir", dirs_exist_ok=True)  # Python 3.8+
```

**Moving Files:**

```python
# Move/rename file or directory
shutil.move("old_name.txt", "new_name.txt")
shutil.move("source_dir", "dest_dir")  # Moves entire directory
```

**Removing Directories:**

```python
# Remove directory tree (destructive, no undo!)
shutil.rmtree("directory_to_remove", ignore_errors=True)  # ignore_errors prevents exceptions
```

**Creating Archives:**

```python
# Create archive (zip, tar, gztar, bztar, xztar)
shutil.make_archive("backup", "zip", "myfolder")
# Creates: backup.zip containing myfolder/

# Supported formats:
# - "zip": ZIP archive
# - "tar": uncompressed tar
# - "gztar": gzip-compressed tar
# - "bztar": bzip2-compressed tar
# - "xztar": xz-compressed tar
```

**Extracting Archives:**

```python
# Extract archive
shutil.unpack_archive("backup.zip", "extract_to/")
```

**Disk Usage:**

```python
# Get disk space statistics
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

**Try This:** Create a backup script using `shutil.make_archive()`:
```python
import shutil
from pathlib import Path
from datetime import datetime

def backup_directory(source: Path, backup_dir: Path = Path("backups")):
    """Create timestamped backup of directory."""
    backup_dir.mkdir(exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    archive_name = f"{source.name}_{timestamp}"
    shutil.make_archive(
        str(backup_dir / archive_name),
        "zip",
        source.parent,
        source.name
    )
    print(f"Backup created: {archive_name}.zip")

backup_directory(Path("my_project"))
```

9.1.4 tempfile: Secure Temporary Files

The `tempfile` module provides secure temporary file and directory creation with automatic cleanup.

**Temporary Files:**

```python
import tempfile

# Temporary file (auto-deleted on close)
with tempfile.TemporaryFile(mode='w+') as f:
    f.write("temporary data")
    f.seek(0)
    print(f.read())
# File automatically deleted when context exits

# Named temporary file (visible in filesystem)
with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt') as f:
    f.write("data")
    temp_name = f.name  # Keep name for later use
# File persists after context (delete=False)
# Clean up manually: os.unlink(temp_name)
```

**Temporary Directories:**

```python
# Temporary directory (auto-deleted on exit)
with tempfile.TemporaryDirectory() as tmpdir:
    print(f"Working in: {tmpdir}")
    # Create files in tmpdir
    temp_file = Path(tmpdir) / "data.txt"
    temp_file.write_text("temporary content")
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
```

**Secure Temporary Files (Best Practice):**

```python
# Use mkstemp() for maximum security (OS-level file creation)
import os

fd, path = tempfile.mkstemp(suffix='.txt', prefix='data_')
try:
    with os.fdopen(fd, 'w') as f:
        f.write("secure temporary data")
    # Process file
    with open(path) as f:
        print(f.read())
finally:
    os.unlink(path)  # Always clean up
```

**Temporary Files with Specific Permissions:**

```python
# Create temporary file with specific permissions (Unix)
import stat

fd, path = tempfile.mkstemp()
os.chmod(path, stat.S_IRUSR | stat.S_IWUSR)  # 0600: user read/write only
```

**Key Functions:**

- `TemporaryFile()` — Temporary file (auto-deleted)
- `NamedTemporaryFile()` — Named temporary file (visible in filesystem)
- `TemporaryDirectory()` — Temporary directory (auto-deleted)
- `mkstemp()` — Low-level secure file creation (returns file descriptor)
- `mkdtemp()` — Low-level secure directory creation
- `gettempdir()` — Get system temp directory
- `gettempprefix()` — Get temp file prefix

**Pitfalls:**

⚠ `mktemp()` is deprecated — use `NamedTemporaryFile()` instead
⚠ Temporary files may persist if process crashes — use context managers
⚠ On Windows, files in use cannot be deleted — ensure files are closed
⚠ Race conditions possible with `mktemp()` — use `mkstemp()` for security

**Try This:** Create a secure temporary file processor:
```python
import tempfile
import os
from pathlib import Path

def process_with_temp_file(data: str) -> str:
    """Process data in a secure temporary file."""
    fd, path = tempfile.mkstemp(suffix='.txt', text=True)
    try:
        with os.fdopen(fd, 'w') as f:
            f.write(data)
        # Process file (e.g., read, transform, etc.)
        with open(path) as f:
            result = f.read().upper()  # Example: uppercase transformation
        return result
    finally:
        os.unlink(path)  # Always clean up

result = process_with_temp_file("hello world")
print(result)  # HELLO WORLD
```

9.2 Date and Time

Python's datetime handling is comprehensive but requires careful attention to timezones and formatting.

**Modules:**

- `datetime` (core) — Main datetime classes
- `zoneinfo` (3.9+, timezone) — Timezone support (replaces pytz)
- `time` (system time) — Low-level time functions
- `dateutil` (3rd-party, recommended) — Advanced parsing and timezone handling

9.2.1 datetime: Core Date/Time Classes

The `datetime` module provides classes for working with dates and times.

**Basic Usage:**

```python
from datetime import datetime, timedelta, date, time

# Current time
now = datetime.now()
print(now)  # 2025-12-05 14:30:45.123456

# Specific datetime
dt = datetime(2025, 1, 27, 14, 30, 45)
print(dt)  # 2025-12-05 14:30:45

# Date arithmetic
tomorrow = now + timedelta(days=1)
next_week = now + timedelta(weeks=1)
in_2_hours = now + timedelta(hours=2)

# Time differences
diff = tomorrow - now
print(diff.total_seconds())  # 86400.0 seconds
```

**Date and Time Components:**

```python
# Extract components
dt = datetime.now()
print(dt.year)      # 2025
print(dt.month)     # 1
print(dt.day)       # 27
print(dt.hour)      # 14
print(dt.minute)    # 30
print(dt.second)    # 45
print(dt.microsecond)  # 123456
print(dt.weekday())    # 0 (Monday = 0, Sunday = 6)
print(dt.isoweekday()) # 1 (Monday = 1, Sunday = 7)
```

**Date and Time Objects:**

```python
# Date only (no time)
d = date(2025, 1, 27)
print(d)  # 2025-12-05

# Time only (no date)
t = time(14, 30, 45)
print(t)  # 14:30:45

# Combine date and time
dt = datetime.combine(d, t)
print(dt)  # 2025-12-05 14:30:45
```

**Timedelta Operations:**

```python
# Create timedelta
delta = timedelta(days=5, hours=3, minutes=30, seconds=15)
print(delta)  # 5 days, 3:30:15

# Access components
print(delta.days)         # 5
print(delta.seconds)      # 12615 (hours*3600 + minutes*60 + seconds)
print(delta.total_seconds())  # 447615.0

# Arithmetic
dt1 = datetime(2025, 1, 1)
dt2 = datetime(2025, 1, 10)
diff = dt2 - dt1
print(diff.days)  # 9
```

9.2.2 timezone handling (critical)

**⚠️ CRITICAL:** Always use timezone-aware datetimes in production code. Timezone-naive datetimes cause bugs.

**Using zoneinfo (Python 3.9+):**

```python
from datetime import datetime
from zoneinfo import ZoneInfo

# Timezone-aware datetime
dt_ny = datetime.now(ZoneInfo("America/New_York"))
dt_utc = datetime.now(ZoneInfo("UTC"))
dt_tokyo = datetime.now(ZoneInfo("Asia/Tokyo"))

# Convert between timezones
dt_utc = dt_ny.astimezone(ZoneInfo("UTC"))
print(f"NY: {dt_ny}")
print(f"UTC: {dt_utc}")
```

**Creating Timezone-Aware Datetimes:**

```python
# From naive datetime
naive = datetime(2025, 1, 27, 14, 30)
aware = naive.replace(tzinfo=ZoneInfo("America/New_York"))

# Direct creation
aware = datetime(2025, 1, 27, 14, 30, tzinfo=ZoneInfo("America/New_York"))
```

**Common Timezones:**

```python
# UTC (Coordinated Universal Time)
utc = ZoneInfo("UTC")

# US Timezones
eastern = ZoneInfo("America/New_York")
pacific = ZoneInfo("America/Los_Angeles")
central = ZoneInfo("America/Chicago")

# European Timezones
london = ZoneInfo("Europe/London")
paris = ZoneInfo("Europe/Paris")
berlin = ZoneInfo("Europe/Berlin")

# Asian Timezones
tokyo = ZoneInfo("Asia/Tokyo")
beijing = ZoneInfo("Asia/Shanghai")
```

**Timezone Conversion:**

```python
# Convert between timezones
dt_ny = datetime.now(ZoneInfo("America/New_York"))
dt_utc = dt_ny.astimezone(ZoneInfo("UTC"))
dt_tokyo = dt_ny.astimezone(ZoneInfo("Asia/Tokyo"))

# All represent the same moment in time
print(f"NY:    {dt_ny}")
print(f"UTC:   {dt_utc}")
print(f"Tokyo: {dt_tokyo}")
```

**Pitfalls:**

⚠ **Never mix naive and aware datetimes** — raises TypeError
⚠ **DST (Daylight Saving Time) transitions** — some times don't exist or occur twice
⚠ **Use zoneinfo, not pytz** — pytz has different API, zoneinfo is standard library

**Try This:** Create a timezone-aware event scheduler:
```python
from datetime import datetime
from zoneinfo import ZoneInfo

def schedule_event(local_time: str, timezone: str, event_name: str):
    """Schedule event in local timezone, convert to UTC."""
    # Parse local time
    dt_local = datetime.strptime(local_time, "%Y-%m-%d %H:%M")
    dt_local = dt_local.replace(tzinfo=ZoneInfo(timezone))
    
    # Convert to UTC for storage
    dt_utc = dt_local.astimezone(ZoneInfo("UTC"))
    
    print(f"Event: {event_name}")
    print(f"Local ({timezone}): {dt_local}")
    print(f"UTC: {dt_utc}")
    return dt_utc

# Schedule meeting in New York
utc_time = schedule_event(
    "2025-12-05 14:00",
    "America/New_York",
    "Team Meeting"
)
```

9.2.3 Parsing and Formatting

**Parsing Strings to Datetime:**

```python
# Parse ISO format (recommended)
dt = datetime.fromisoformat("2025-12-05T14:30:45")
dt_tz = datetime.fromisoformat("2025-12-05T14:30:45-05:00")  # With timezone

# Parse custom format
dt = datetime.strptime("2025-12-05", "%Y-%m-%d")
dt = datetime.strptime("Jan 27, 2025 2:30 PM", "%b %d, %Y %I:%M %p")

# Common format codes:
# %Y - 4-digit year
# %m - Month (01-12)
# %d - Day (01-31)
# %H - Hour (00-23)
# %M - Minute (00-59)
# %S - Second (00-59)
# %I - Hour (01-12, 12-hour format)
# %p - AM/PM
# %b - Abbreviated month name
# %A - Full weekday name
```

**Formatting Datetime to String:**

```python
dt = datetime.now()

# ISO format (recommended for APIs)
iso_str = dt.isoformat()
print(iso_str)  # 2025-12-05T14:30:45.123456

# Custom format
formatted = dt.strftime("%Y-%m-%d")
formatted = dt.strftime("%B %d, %Y")  # January 27, 2025
formatted = dt.strftime("%A, %B %d, %Y at %I:%M %p")  # Monday, January 27, 2025 at 02:30 PM

# Common format codes (same as strptime)
```

**Human-Readable Formatting:**

```python
# Using strftime for readable output
dt = datetime.now()
print(dt.strftime("%A, %B %d, %Y"))  # Monday, January 27, 2025
print(dt.strftime("%I:%M %p"))        # 02:30 PM
print(dt.strftime("%Y-%m-%d %H:%M:%S"))  # 2025-12-05 14:30:45
```

**Try This:** Create a date range generator:
```python
from datetime import datetime, timedelta

def date_range(start: str, end: str, step_days: int = 1):
    """Generate dates in range."""
    start_dt = datetime.strptime(start, "%Y-%m-%d")
    end_dt = datetime.strptime(end, "%Y-%m-%d")
    current = start_dt
    
    while current <= end_dt:
        yield current.date()
        current += timedelta(days=step_days)

# Generate all dates in January 2025
for date in date_range("2025-12-05", "2025-12-05"):
    print(date.strftime("%A, %B %d, %Y"))
```

9.3 Data Structures (collections module)

The `collections` module provides specialized data structures that are more efficient or convenient than built-in types for specific use cases. These are essential productivity boosters.

9.3.1 Counter: Counting Hashable Objects

`Counter` is a dictionary subclass for counting hashable objects. It's perfect for frequency analysis.

**Basic Usage:**

```python
from collections import Counter

# Count characters in string
c = Counter("banana")
print(c)  # Counter({'a': 3, 'n': 2, 'b': 1})

# Count items in list
words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
word_count = Counter(words)
print(word_count)  # Counter({'apple': 3, 'banana': 2, 'cherry': 1})
```

**Common Operations:**

```python
c = Counter("banana")

# Access counts
print(c['a'])      # 3
print(c['z'])      # 0 (doesn't raise KeyError)

# Most common elements
print(c.most_common(2))  # [('a', 3), ('n', 2)]

# Update counter
c.update("apple")  # Add more items
print(c)  # Counter({'a': 4, 'n': 2, 'b': 1, 'p': 2, 'l': 1, 'e': 1})

# Arithmetic operations
c1 = Counter("ab")
c2 = Counter("bc")
print(c1 + c2)  # Counter({'b': 2, 'a': 1, 'c': 1})
print(c1 - c2)  # Counter({'a': 1}) (negative counts removed)
```

**Practical Examples:**

```python
# Word frequency analysis
text = "the quick brown fox jumps over the lazy dog"
words = text.split()
word_freq = Counter(words)
print(word_freq.most_common(3))  # [('the', 2), ('quick', 1), ('brown', 1)]

# Finding most common elements
data = [1, 2, 3, 1, 2, 1, 3, 3, 3]
counter = Counter(data)
top_2 = counter.most_common(2)
print(top_2)  # [(3, 4), (1, 3)]
```

**Try This:** Analyze log file for most common error types:
```python
from collections import Counter

def analyze_errors(log_file: str):
    """Count error types in log file."""
    errors = []
    with open(log_file) as f:
        for line in f:
            if "ERROR" in line:
                # Extract error type (simplified)
                error_type = line.split("ERROR")[1].split(":")[0].strip()
                errors.append(error_type)
    
    error_counts = Counter(errors)
    return error_counts.most_common(5)

# Usage
top_errors = analyze_errors("app.log")
for error, count in top_errors:
    print(f"{error}: {count}")
```

9.3.2 defaultdict: Dictionary with Default Factory

`defaultdict` automatically creates default values for missing keys, eliminating the need for `if key in dict` checks.

**Basic Usage:**

```python
from collections import defaultdict

# Default to empty list
groups = defaultdict(list)
groups["a"].append(1)  # No KeyError, list created automatically
groups["a"].append(2)
print(groups)  # defaultdict(<class 'list'>, {'a': [1, 2]})

# Default to 0 (for counting)
counts = defaultdict(int)
counts["apple"] += 1  # No KeyError
counts["banana"] += 1
print(counts)  # defaultdict(<class 'int'>, {'apple': 1, 'banana': 1})
```

**Common Factory Functions:**

```python
# Default to empty list
dd_list = defaultdict(list)
dd_list["key"].append("value")

# Default to 0
dd_int = defaultdict(int)
dd_int["count"] += 1

# Default to empty set
dd_set = defaultdict(set)
dd_set["tags"].add("python")

# Default to empty dict
dd_dict = defaultdict(dict)
dd_dict["user"]["name"] = "Alice"

# Custom default factory
def default_factory():
    return {"count": 0, "items": []}

dd_custom = defaultdict(default_factory)
dd_custom["group"]["count"] += 1
```

**Grouping Data:**

```python
# Group items by category
items = [
    ("fruit", "apple"),
    ("fruit", "banana"),
    ("vegetable", "carrot"),
    ("fruit", "cherry"),
    ("vegetable", "broccoli"),
]

grouped = defaultdict(list)
for category, item in items:
    grouped[category].append(item)

print(grouped)
# defaultdict(<class 'list'>, {
#     'fruit': ['apple', 'banana', 'cherry'],
#     'vegetable': ['carrot', 'broccoli']
# })
```

**Try This:** Group users by department:
```python
from collections import defaultdict

users = [
    {"name": "Alice", "dept": "Engineering"},
    {"name": "Bob", "dept": "Sales"},
    {"name": "Charlie", "dept": "Engineering"},
    {"name": "Diana", "dept": "Marketing"},
]

dept_users = defaultdict(list)
for user in users:
    dept_users[user["dept"]].append(user["name"])

for dept, names in dept_users.items():
    print(f"{dept}: {', '.join(names)}")
```

9.3.3 deque: Fast Queues and Stacks

`deque` (double-ended queue) provides O(1) append/pop operations from both ends, making it ideal for queues and stacks.

**Basic Usage:**

```python
from collections import deque

# Create deque
q = deque()
q.append(1)        # Add to right
q.append(2)
q.appendleft(0)    # Add to left
print(q)  # deque([0, 1, 2])

# Remove from ends
right = q.pop()        # Remove from right: 2
left = q.popleft()     # Remove from left: 0
print(q)  # deque([1])
```

**Queue Operations (FIFO):**

```python
# Use as queue (FIFO)
queue = deque()
queue.append("first")   # Enqueue
queue.append("second")
queue.append("third")

while queue:
    item = queue.popleft()  # Dequeue
    print(item)
# Output: first, second, third
```

**Stack Operations (LIFO):**

```python
# Use as stack (LIFO)
stack = deque()
stack.append("first")    # Push
stack.append("second")
stack.append("third")

while stack:
    item = stack.pop()   # Pop
    print(item)
# Output: third, second, first
```

**Bounded Deque:**

```python
# Bounded deque (maxlen)
d = deque(maxlen=3)
d.append(1)
d.append(2)
d.append(3)
d.append(4)  # Automatically removes leftmost item
print(d)  # deque([2, 3, 4], maxlen=3)
```

**Performance Comparison:**

```python
# deque vs list for queue operations
from collections import deque
import time

# deque: O(1) popleft
q_deque = deque(range(1000000))
start = time.perf_counter()
while q_deque:
    q_deque.popleft()
deque_time = time.perf_counter() - start

# list: O(n) pop(0)
q_list = list(range(1000000))
start = time.perf_counter()
while q_list:
    q_list.pop(0)  # Very slow!
list_time = time.perf_counter() - start

print(f"deque: {deque_time:.4f}s")
print(f"list:  {list_time:.4f}s")  # Much slower!
```

**Try This:** Implement a sliding window using bounded deque:
```python
from collections import deque

def sliding_window(iterable, window_size: int):
    """Yield sliding windows of size window_size."""
    window = deque(maxlen=window_size)
    for item in iterable:
        window.append(item)
        if len(window) == window_size:
            yield tuple(window)

# Usage
data = [1, 2, 3, 4, 5, 6, 7]
for window in sliding_window(data, 3):
    print(window)
# (1, 2, 3)
# (2, 3, 4)
# (3, 4, 5)
# (4, 5, 6)
# (5, 6, 7)
```

9.3.4 OrderedDict: Dict with Insertion Order

Since Python 3.7, regular `dict` maintains insertion order. `OrderedDict` is still useful for:

- Explicit ordering guarantees (backward compatibility)
- `move_to_end()` and `popitem(last=False)` methods
- Equality comparisons that consider order

**Usage:**

```python
from collections import OrderedDict

# OrderedDict maintains insertion order
od = OrderedDict()
od['first'] = 1
od['second'] = 2
od['third'] = 3
print(list(od.keys()))  # ['first', 'second', 'third']

# Move item to end
od.move_to_end('first')
print(list(od.keys()))  # ['second', 'third', 'first']

# Pop from beginning
first = od.popitem(last=False)
print(first)  # ('second', 2)
```

**When to Use:**

- ✅ Need `move_to_end()` or `popitem(last=False)`
- ✅ Working with Python < 3.7 code
- ✅ Need order-aware equality: `OrderedDict([('a', 1), ('b', 2)]) != OrderedDict([('b', 2), ('a', 1)])`
- ❌ Python 3.7+: Regular `dict` is usually sufficient

9.3.5 ChainMap: Multiple Dicts as Single Mapping

`ChainMap` groups multiple dictionaries into a single mapping, searching each dict in order until a key is found.

**Basic Usage:**

```python
from collections import ChainMap

# Configuration with fallback
defaults = {"host": "localhost", "port": 8080}
file_config = {"port": 9000, "debug": True}
env_config = {"host": "prod.example.com"}

# ChainMap searches in order: env_config → file_config → defaults
config = ChainMap(env_config, file_config, defaults)

print(config["host"])   # "prod.example.com" (from env_config)
print(config["port"])   # 9000 (from file_config)
print(config["debug"])  # True (from file_config)
```

**Practical Example:**

```python
# Application configuration with precedence
import os
from collections import ChainMap

# Default configuration
defaults = {
    "database_url": "sqlite:///app.db",
    "log_level": "INFO",
    "max_connections": 10,
}

# File-based configuration (loaded from config file)
file_config = {
    "log_level": "DEBUG",
    "max_connections": 20,
}

# Environment variable overrides
env_config = {
    key.replace("APP_", "").lower(): value
    for key, value in os.environ.items()
    if key.startswith("APP_")
}

# Final configuration (env > file > defaults)
config = ChainMap(env_config, file_config, defaults)
```

**Try This:** Create a configuration system:
```python
from collections import ChainMap
import json

def load_config():
    """Load configuration with precedence: env > file > defaults."""
    # Defaults
    defaults = {"theme": "light", "language": "en"}
    
    # File config
    try:
        with open("config.json") as f:
            file_config = json.load(f)
    except FileNotFoundError:
        file_config = {}
    
    # Environment (simplified)
    env_config = {}  # Would load from os.environ
    
    return ChainMap(env_config, file_config, defaults)

config = load_config()
print(config["theme"])  # Uses file_config or defaults
```

9.3.6 namedtuple / dataclass

**namedtuple (Legacy, but still useful):**

```python
from collections import namedtuple

# Create named tuple type
Point = namedtuple("Point", "x y")
p = Point(1, 2)
print(p.x, p.y)  # 1 2
print(p)  # Point(x=1, y=2)

# Named tuple with defaults (Python 3.7+)
Person = namedtuple("Person", "name age", defaults=["Unknown", 0])
p1 = Person("Alice")
p2 = Person("Bob", 30)
```

**dataclass (Modern, Preferred):**

```python
from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int
    
    def distance(self, other: "Point") -> float:
        """Calculate distance to another point."""
        return ((self.x - other.x) ** 2 + (self.y - other.y) ** 2) ** 0.5

p1 = Point(1, 2)
p2 = Point(4, 6)
print(p1.distance(p2))  # 5.0
```

**When to Use:**

- **namedtuple**: ✅ Immutable data, memory-efficient, tuple-like behavior
- **dataclass**: ✅ Mutable data, type hints, methods, modern Python (3.7+)

**Try This:** Compare namedtuple vs dataclass:
```python
from collections import namedtuple
from dataclasses import dataclass

# namedtuple (immutable)
PointNT = namedtuple("Point", "x y")
p1 = PointNT(1, 2)
# p1.x = 3  # Error: can't modify

# dataclass (mutable by default)
@dataclass
class PointDC:
    x: int
    y: int

p2 = PointDC(1, 2)
p2.x = 3  # OK: can modify
print(p2)  # PointDC(x=3, y=2)
```

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

Python provides powerful tools for text manipulation, pattern matching, and formatting.

**Modules:**

- `re` (regex) — Regular expressions for pattern matching
- `string` — String constants and utilities
- `textwrap` — Text wrapping and formatting
- `difflib` — Text diffing and comparison

9.5.1 regex (re module): Pattern Matching

The `re` module provides regular expression operations for pattern matching and text manipulation.

**Basic Pattern Matching:**

```python
import re

# Search for pattern
text = "Age 42 years old"
m = re.search(r"\d+", text)
if m:
    print(m.group())  # "42"
    print(m.start())  # 4
    print(m.end())    # 6

# Match at start
m = re.match(r"Age", text)  # Matches only at start
if m:
    print(m.group())  # "Age"

# Find all matches
numbers = re.findall(r"\d+", "I have 3 cats and 2 dogs")
print(numbers)  # ['3', '2']

# Find all with positions
for m in re.finditer(r"\d+", "I have 3 cats and 2 dogs"):
    print(f"{m.group()} at {m.start()}-{m.end()}")
# 3 at 7-8
# 2 at 18-19
```

**Groups and Capturing:**

```python
# Capturing groups
text = "John Doe, age 42"
m = re.search(r"(\w+) (\w+), age (\d+)", text)
if m:
    print(m.group(0))  # Full match: "John Doe, age 42"
    print(m.group(1))  # First group: "John"
    print(m.group(2))  # Second group: "Doe"
    print(m.group(3))  # Third group: "42"
    print(m.groups())  # All groups: ('John', 'Doe', '42')

# Named groups (more readable)
m = re.search(r"(?P<first>\w+) (?P<last>\w+), age (?P<age>\d+)", text)
if m:
    print(m.group('first'))  # "John"
    print(m.group('last'))   # "Doe"
    print(m.group('age'))    # "42"
    print(m.groupdict())     # {'first': 'John', 'last': 'Doe', 'age': '42'}
```

**Common Patterns:**

```python
# Email pattern (simplified)
email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
emails = re.findall(email_pattern, "Contact: alice@example.com or bob@test.org")

# Phone number (US format)
phone_pattern = r"\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}"
phones = re.findall(phone_pattern, "Call 555-1234 or (555) 987-6543")

# URL pattern
url_pattern = r"https?://[^\s]+"
urls = re.findall(url_pattern, "Visit https://example.com for more info")
```

**Substitution:**

```python
# Replace pattern
text = "Hello World"
new_text = re.sub(r"World", "Python", text)
print(new_text)  # "Hello Python"

# Replace with function
def replacer(match):
    return match.group(0).upper()

text = "hello world"
new_text = re.sub(r"\w+", replacer, text)
print(new_text)  # "HELLO WORLD"

# Replace with backreferences
text = "2025-12-05"
new_text = re.sub(r"(\d{4})-(\d{2})-(\d{2})", r"\3/\2/\1", text)
print(new_text)  # "27/01/2025" (US format)
```

**Flags:**

```python
# Case-insensitive matching
text = "Hello WORLD"
m = re.search(r"world", text, re.IGNORECASE)
print(m.group())  # "WORLD"

# Multiline matching
text = "Line 1\nLine 2\nLine 3"
matches = re.findall(r"^Line", text, re.MULTILINE)
print(matches)  # ['Line', 'Line', 'Line']

# Dot matches newline
text = "Start\nEnd"
m = re.search(r"Start.*End", text, re.DOTALL)
print(m.group())  # "Start\nEnd"

# Verbose mode (allows comments and whitespace)
pattern = re.compile(r"""
    \d{3}      # Area code
    -          # Separator
    \d{3}      # Exchange
    -          # Separator
    \d{4}      # Number
""", re.VERBOSE)
```

9.5.2 Precompiled regex: Performance Optimization

**Always precompile regex patterns for repeated use:**

```python
import re

# Compile once, use many times
pattern = re.compile(r"\d+")

# Much faster than re.search(r"\d+", text) in loops
for text in large_text_list:
    m = pattern.search(text)
    if m:
        print(m.group())

# Compiled patterns support same methods
pattern = re.compile(r"(\w+)@(\w+\.\w+)", re.IGNORECASE)
m = pattern.search("Contact: alice@example.com")
if m:
    print(m.groups())  # ('alice', 'example.com')
```

**Performance Comparison:**

```python
import re
import time

text = "The number is 42"
pattern_str = r"\d+"
pattern_compiled = re.compile(pattern_str)

# Uncompiled (slower in loops)
start = time.perf_counter()
for _ in range(1000000):
    re.search(pattern_str, text)
uncompiled_time = time.perf_counter() - start

# Compiled (faster)
start = time.perf_counter()
for _ in range(1000000):
    pattern_compiled.search(text)
compiled_time = time.perf_counter() - start

print(f"Uncompiled: {uncompiled_time:.4f}s")
print(f"Compiled:   {compiled_time:.4f}s")
print(f"Speedup:    {uncompiled_time/compiled_time:.1f}x")
```

9.5.3 Key features: Advanced Regex

**Lookaheads and Lookbehinds:**

```python
# Positive lookahead: match followed by pattern
text = "Python3 Python2"
matches = re.findall(r"Python(?=\d)", text)
print(matches)  # ['Python', 'Python'] (matches Python before digit)

# Negative lookahead: match NOT followed by pattern
matches = re.findall(r"Python(?!\d)", text)
print(matches)  # [] (no Python without digit)

# Positive lookbehind: match preceded by pattern
text = "$100 and €50"
matches = re.findall(r"(?<=\$)\d+", text)
print(matches)  # ['100'] (number after $)

# Negative lookbehind: match NOT preceded by pattern
matches = re.findall(r"(?<!\$)\d+", text)
print(matches)  # ['50'] (number not after $)
```

**Non-capturing Groups:**

```python
# Use (?:...) for grouping without capturing
text = "abc123 def456"
# Capture only numbers, not the letters
matches = re.findall(r"(?:\w+)(\d+)", text)
print(matches)  # ['123', '456']
```

**Greedy vs Non-greedy:**

```python
text = "<tag>content</tag><tag>more</tag>"

# Greedy (default): matches as much as possible
greedy = re.findall(r"<tag>.*</tag>", text)
print(greedy)  # ['<tag>content</tag><tag>more</tag>'] (one match)

# Non-greedy: matches as little as possible
non_greedy = re.findall(r"<tag>.*?</tag>", text)
print(non_greedy)  # ['<tag>content</tag>', '<tag>more</tag>'] (two matches)
```

**Pitfalls:**

⚠ **Catastrophic backtracking** — Complex patterns can be extremely slow
⚠ **ReDoS attacks** — Malicious regex can cause denial of service
⚠ **Always escape special characters** when matching literal text: `re.escape("$100")`

**Try This:** Extract structured data from log lines:
```python
import re

log_line = "[2025-12-05 14:30:45] ERROR: Database connection failed (code: 5001)"

# Pattern with named groups
pattern = re.compile(r"""
    \[(?P<timestamp>.*?)\]     # Timestamp in brackets
    \s+
    (?P<level>\w+)            # Log level
    :\s+
    (?P<message>.*?)          # Message
    \s*
    \(code:\s*(?P<code>\d+)\) # Optional error code
""", re.VERBOSE)

m = pattern.search(log_line)
if m:
    print(f"Time: {m.group('timestamp')}")
    print(f"Level: {m.group('level')}")
    print(f"Message: {m.group('message')}")
    print(f"Code: {m.group('code')}")
```

9.5.4 string module: Constants and Utilities

The `string` module provides useful constants and string manipulation utilities.

**Constants:**

```python
import string

# Character sets
print(string.ascii_letters)  # 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
print(string.ascii_lowercase)  # 'abcdefghijklmnopqrstuvwxyz'
print(string.ascii_uppercase)  # 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
print(string.digits)  # '0123456789'
print(string.hexdigits)  # '0123456789abcdefABCDEF'
print(string.octdigits)  # '01234567'
print(string.punctuation)  # '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
print(string.whitespace)  # ' \t\n\r\x0b\x0c'
print(string.printable)  # All printable ASCII characters
```

**Template Strings:**

```python
from string import Template

# Safe string substitution (prevents injection)
t = Template('Hello, $name! You have $count messages.')
result = t.substitute(name='Alice', count=5)
print(result)  # "Hello, Alice! You have 5 messages."

# Safe substitution (ignores missing keys)
result = t.safe_substitute(name='Bob')  # count missing
print(result)  # "Hello, Bob! You have $count messages."
```

**Formatter (Advanced):**

```python
from string import Formatter

f = Formatter()
# Custom formatting logic
result = f.format("{name:>10} {age:03d}", name="Alice", age=5)
print(result)  # "     Alice 005"
```

**Try This:** Generate random password:
```python
import string
import secrets

def generate_password(length: int = 16) -> str:
    """Generate secure random password."""
    alphabet = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(alphabet) for _ in range(length))

password = generate_password(20)
print(password)
```

9.5.5 textwrap: Text Wrapping and Formatting

The `textwrap` module provides text wrapping, filling, and indentation utilities.

**Basic Wrapping:**

```python
import textwrap

long_text = "This is a very long line of text that needs to be wrapped to fit within a certain width for better readability."

# Wrap to list of lines
wrapped = textwrap.wrap(long_text, width=40)
for line in wrapped:
    print(line)

# Fill to single string with newlines
filled = textwrap.fill(long_text, width=40)
print(filled)
```

**Advanced Options:**

```python
# Custom indentation
text = "This is a paragraph that needs indentation."
indented = textwrap.fill(
    text,
    width=30,
    initial_indent="  ",      # First line indent
    subsequent_indent="    "   # Subsequent lines indent
)
print(indented)
#   This is a paragraph that
#     needs indentation.

# Preserve whitespace
text = "Line 1\n\nLine 2"
preserved = textwrap.fill(text, width=20, replace_whitespace=False)
print(preserved)
```

**Dedent (Remove Common Indentation):**

```python
# Remove common leading whitespace
text = """
    This is indented.
    So is this.
    And this too.
"""
dedented = textwrap.dedent(text)
print(dedented)
# This is indented.
# So is this.
# And this too.
```

**Shorten Text:**

```python
# Truncate text to fit width
long_text = "This is a very long text that needs to be shortened."
short = textwrap.shorten(long_text, width=30, placeholder="...")
print(short)  # "This is a very long..."
```

**Try This:** Format code comments:
```python
import textwrap

def format_docstring(text: str, width: int = 72) -> str:
    """Format docstring with proper indentation."""
    # Remove common indentation
    text = textwrap.dedent(text).strip()
    # Wrap and indent
    return textwrap.fill(text, width=width, initial_indent="    ", subsequent_indent="    ")

doc = """
    This is a long docstring that explains
    what the function does in detail.
    It should be properly formatted.
"""
print(format_docstring(doc))
```

9.5.6 difflib: Text Diffing and Comparison

The `difflib` module provides tools for comparing sequences and generating diffs.

**Basic Diff:**

```python
import difflib

text1 = "Hello world\nPython is great"
text2 = "Hello Python\nPython is awesome"

# Unified diff
diff = difflib.unified_diff(
    text1.splitlines(keepends=True),
    text2.splitlines(keepends=True),
    fromfile='old.txt',
    tofile='new.txt',
    lineterm=''
)
print(''.join(diff))
# --- old.txt
# +++ new.txt
# @@ -1,2 +1,2 @@
# -Hello world
# +Hello Python
# -Python is great
# +Python is awesome

# Context diff
diff = difflib.context_diff(
    text1.splitlines(keepends=True),
    text2.splitlines(keepends=True),
    fromfile='old.txt',
    tofile='new.txt'
)
print(''.join(diff))
```

**Sequence Matching:**

```python
# Find similar sequences
s1 = ['apple', 'banana', 'cherry']
s2 = ['apple', 'berry', 'cherry']

matcher = difflib.SequenceMatcher(None, s1, s2)
ratio = matcher.ratio()
print(f"Similarity: {ratio:.2%}")  # Similarity: 66.67%

# Get matching blocks
for tag, i1, i2, j1, j2 in matcher.get_opcodes():
    print(f"{tag:7} s1[{i1}:{i2}] -> s2[{j1}:{j2}]")
# equal   s1[0:1] -> s2[0:1]  (apple matches)
# replace s1[1:2] -> s2[1:2]  (banana -> berry)
# equal   s1[2:3] -> s2[2:3]  (cherry matches)
```

**Finding Close Matches:**

```python
# Find closest matches
words = ['apple', 'banana', 'cherry', 'date']
target = 'appel'  # Typo for 'apple'

matches = difflib.get_close_matches(target, words, n=2, cutoff=0.6)
print(matches)  # ['apple'] (closest match)
```

**HTML Diff:**

```python
# Generate HTML diff
diff = difflib.HtmlDiff()
html_diff = diff.make_file(
    text1.splitlines(),
    text2.splitlines(),
    fromdesc='Old Version',
    todesc='New Version'
)
# Save to file
with open('diff.html', 'w') as f:
    f.write(html_diff)
```

**Try This:** Create a simple diff viewer:
```python
import difflib

def show_diff(old_text: str, new_text: str):
    """Show unified diff between two texts."""
    diff = difflib.unified_diff(
        old_text.splitlines(keepends=True),
        new_text.splitlines(keepends=True),
        lineterm='',
        n=3  # Context lines
    )
    for line in diff:
        if line.startswith('+'):
            print(f"\033[92m{line}\033[0m", end='')  # Green for additions
        elif line.startswith('-'):
            print(f"\033[91m{line}\033[0m", end='')  # Red for deletions
        else:
            print(line, end='')

old = "Hello world\nPython"
new = "Hello Python\nPython 3.12"
show_diff(old, new)
```

9.6 File Formats

Python's standard library provides robust support for common file formats used in data exchange and configuration.

9.6.1 JSON: JavaScript Object Notation

JSON is the de facto standard for data exchange in web APIs and configuration files.

**Basic Usage:**

```python
import json

# Parse JSON string
json_str = '{"name": "Alice", "age": 30, "city": "New York"}'
data = json.loads(json_str)
print(data["name"])  # "Alice"

# Serialize to JSON string
data = {"name": "Alice", "age": 30, "city": "New York"}
json_str = json.dumps(data)
print(json_str)  # '{"name": "Alice", "age": 30, "city": "New York"}'

# Pretty printing
json_str = json.dumps(data, indent=2)
print(json_str)
# {
#   "name": "Alice",
#   "age": 30,
#   "city": "New York"
# }
```

**File Operations:**

```python
# Read from file
with open("data.json") as f:
    data = json.load(f)

# Write to file
data = {"users": [{"name": "Alice"}, {"name": "Bob"}]}
with open("output.json", "w") as f:
    json.dump(data, f, indent=2)
```

**Advanced Options:**

```python
# Custom serialization
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

def person_encoder(obj):
    if isinstance(obj, Person):
        return {"name": obj.name, "age": obj.age}
    raise TypeError(f"Object of type {type(obj)} is not JSON serializable")

person = Person("Alice", 30)
json_str = json.dumps(person, default=person_encoder)
print(json_str)  # '{"name": "Alice", "age": 30}'

# Custom deserialization
def person_decoder(dct):
    if "name" in dct and "age" in dct:
        return Person(dct["name"], dct["age"])
    return dct

data = json.loads(json_str, object_hook=person_decoder)
print(type(data))  # <class '__main__.Person'>
```

**Error Handling:**

```python
import json

def safe_json_loads(text: str):
    """Safely parse JSON with error handling."""
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}")
        print(f"Error at line {e.lineno}, column {e.colno}")
        return None

result = safe_json_loads('{"invalid": json}')
```

**Try This:** Create a JSON configuration manager:
```python
import json
from pathlib import Path

class ConfigManager:
    def __init__(self, config_path: Path):
        self.config_path = config_path
        self.config = self.load()
    
    def load(self) -> dict:
        """Load configuration from JSON file."""
        if self.config_path.exists():
            with open(self.config_path) as f:
                return json.load(f)
        return {}
    
    def save(self):
        """Save configuration to JSON file."""
        with open(self.config_path, "w") as f:
            json.dump(self.config, f, indent=2)
    
    def get(self, key: str, default=None):
        """Get configuration value."""
        return self.config.get(key, default)
    
    def set(self, key: str, value):
        """Set configuration value."""
        self.config[key] = value
        self.save()

config = ConfigManager(Path("config.json"))
config.set("theme", "dark")
print(config.get("theme"))  # "dark"
```

9.6.2 CSV: Comma-Separated Values

The `csv` module provides robust CSV reading and writing with proper handling of edge cases.

**Reading CSV:**

```python
import csv

# Simple reader
with open("data.csv") as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)  # Each row is a list

# DictReader (more convenient)
with open("data.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["age"])  # Access by column name
```

**Writing CSV:**

```python
# Simple writer
data = [
    ["Name", "Age", "City"],
    ["Alice", "30", "New York"],
    ["Bob", "25", "London"],
]

with open("output.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(data)

# DictWriter (more convenient)
fieldnames = ["name", "age", "city"]
data = [
    {"name": "Alice", "age": "30", "city": "New York"},
    {"name": "Bob", "age": "25", "city": "London"},
]

with open("output.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(data)
```

**Advanced Options:**

```python
# Custom delimiter
with open("data.tsv") as f:
    reader = csv.reader(f, delimiter="\t")  # Tab-separated

# Custom quoting
with open("data.csv") as f:
    reader = csv.reader(f, quoting=csv.QUOTE_NONNUMERIC)

# Skip initial whitespace
with open("data.csv") as f:
    reader = csv.reader(f, skipinitialspace=True)

# Handle different line endings
with open("data.csv", newline="") as f:  # Always use newline="" in Python 3
    reader = csv.reader(f)
```

**Pitfalls:**

⚠ **Always use `newline=""` when opening CSV files** — prevents extra blank lines
⚠ **CSV injection attacks** — sanitize user input (especially formulas starting with `=`, `+`, `-`, `@`)
⚠ **Encoding issues** — specify encoding explicitly: `open("data.csv", encoding="utf-8")`

**Try This:** Process CSV with data validation:
```python
import csv
from typing import List, Dict

def read_csv_safe(filename: str) -> List[Dict[str, str]]:
    """Read CSV with error handling and validation."""
    rows = []
    with open(filename, "r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, start=2):  # Start at 2 (header is row 1)
            try:
                # Validate required fields
                if not row.get("name") or not row.get("age"):
                    print(f"Warning: Row {i} missing required fields, skipping")
                    continue
                rows.append(row)
            except Exception as e:
                print(f"Error processing row {i}: {e}")
                continue
    return rows

data = read_csv_safe("users.csv")
for row in data:
    print(f"{row['name']}: {row['age']}")
```

9.6.3 configparser: INI File Parsing

The `configparser` module reads and writes INI-style configuration files.

**Basic Usage:**

```python
import configparser

# Create parser
cfg = configparser.ConfigParser()

# Read from file
cfg.read("settings.ini")

# Access values
db_host = cfg.get("database", "host")
db_port = cfg.getint("database", "port")  # Auto-convert to int
debug = cfg.getboolean("app", "debug")     # Auto-convert to bool

# Write configuration
cfg["database"] = {
    "host": "localhost",
    "port": "5432",
    "name": "mydb"
}
cfg["app"] = {
    "debug": "true",
    "log_level": "INFO"
}

with open("settings.ini", "w") as f:
    cfg.write(f)
```

**INI File Format:**

```ini
[database]
host = localhost
port = 5432
name = mydb

[app]
debug = true
log_level = INFO
timeout = 30.5
```

**Advanced Features:**

```python
# Default values
db_host = cfg.get("database", "host", fallback="localhost")

# Check if section/key exists
if cfg.has_section("database"):
    if cfg.has_option("database", "host"):
        host = cfg.get("database", "host")

# Get all sections
for section in cfg.sections():
    print(f"Section: {section}")
    for key, value in cfg.items(section):
        print(f"  {key} = {value}")
```

**Try This:** Create a configuration loader with validation:
```python
import configparser
from pathlib import Path

class AppConfig:
    def __init__(self, config_path: Path):
        self.cfg = configparser.ConfigParser()
        self.cfg.read(config_path)
        self.validate()
    
    def validate(self):
        """Validate required configuration."""
        required = {
            "database": ["host", "port", "name"],
            "app": ["debug", "log_level"]
        }
        for section, keys in required.items():
            if not self.cfg.has_section(section):
                raise ValueError(f"Missing section: {section}")
            for key in keys:
                if not self.cfg.has_option(section, key):
                    raise ValueError(f"Missing option: {section}.{key}")
    
    @property
    def db_host(self):
        return self.cfg.get("database", "host")
    
    @property
    def db_port(self):
        return self.cfg.getint("database", "port")
    
    @property
    def debug(self):
        return self.cfg.getboolean("app", "debug")

config = AppConfig(Path("settings.ini"))
print(f"Database: {config.db_host}:{config.db_port}")
```

9.6.4 XML: Extensible Markup Language

The `xml.etree.ElementTree` module provides a simple and efficient API for parsing and creating XML.

**Parsing XML:**

```python
import xml.etree.ElementTree as ET

# Parse from file
tree = ET.parse("data.xml")
root = tree.getroot()

# Parse from string
xml_str = "<root><item>Value</item></root>"
root = ET.fromstring(xml_str)

# Access elements
for child in root:
    print(child.tag, child.text)

# Find elements
items = root.findall("item")
for item in items:
    print(item.text)

# Find single element
item = root.find("item")
if item is not None:
    print(item.text)
```

**Creating XML:**

```python
# Create element tree
root = ET.Element("users")
user1 = ET.SubElement(root, "user")
user1.set("id", "1")
name1 = ET.SubElement(user1, "name")
name1.text = "Alice"
age1 = ET.SubElement(user1, "age")
age1.text = "30"

# Convert to string
xml_str = ET.tostring(root, encoding="unicode")
print(xml_str)

# Write to file
tree = ET.ElementTree(root)
tree.write("output.xml", encoding="utf-8", xml_declaration=True)
```

**XPath-like Searching:**

```python
# Find all elements with tag
items = root.findall(".//item")  # Find all 'item' elements anywhere

# Find with attribute
items = root.findall(".//item[@id='1']")  # Items with id="1"

# Iterate all elements
for elem in root.iter():
    print(elem.tag, elem.text)
```

**Pitfalls:**

⚠ **XML parsing can be slow for large files** — consider streaming parsers for large XML
⚠ **XML injection (XXE attacks)** — never parse untrusted XML without disabling external entity resolution
⚠ **Use `xml.etree.ElementTree`, not `xml.dom`** — ElementTree is faster and simpler

**Try This:** Parse and transform XML:
```python
import xml.etree.ElementTree as ET

def transform_xml(input_file: str, output_file: str):
    """Transform XML structure."""
    tree = ET.parse(input_file)
    root = tree.getroot()
    
    # Create new structure
    new_root = ET.Element("transformed")
    for item in root.findall("item"):
        new_item = ET.SubElement(new_root, "entry")
        new_item.set("value", item.text)
    
    # Write output
    new_tree = ET.ElementTree(new_root)
    new_tree.write(output_file, encoding="utf-8", xml_declaration=True)

transform_xml("input.xml", "output.xml")
```

9.6.5 pickle: Python Object Serialization (⚠ dangerous)

**⚠️ CRITICAL WARNING:** `pickle` is insecure and should NEVER be used with untrusted data. It can execute arbitrary code during unpickling.

**When to Use:**

✅ **Only for trusted data** — Same process, same machine, same user
✅ **Temporary caching** — Fast serialization of Python objects
✅ **Inter-process communication** — Between trusted processes

**Basic Usage:**

```python
import pickle

# Serialize object
data = {"name": "Alice", "items": [1, 2, 3]}
pickled = pickle.dumps(data)

# Deserialize
unpickled = pickle.loads(pickled)
print(unpickled)  # {'name': 'Alice', 'items': [1, 2, 3]}

# File operations
with open("data.pkl", "wb") as f:
    pickle.dump(data, f)

with open("data.pkl", "rb") as f:
    loaded = pickle.load(f)
```

**Protocol Versions:**

```python
# Use highest protocol for efficiency (Python 3.8+)
pickled = pickle.dumps(data, protocol=pickle.HIGHEST_PROTOCOL)

# Protocol 5 (Python 3.8+) supports out-of-band data for large objects
```

**Secure Alternatives:**

```python
# Use JSON for simple data structures
import json
data = {"name": "Alice", "age": 30}
json_str = json.dumps(data)  # Safe, human-readable

# Use msgpack for binary serialization (faster than JSON, still safe)
import msgpack  # Third-party
packed = msgpack.packb(data)

# Use database for complex objects
# Use ORM (SQLAlchemy) for structured data
```

**Try This:** Safe object serialization wrapper:
```python
import pickle
import hashlib
from pathlib import Path

class SafePickleCache:
    """Safe pickle-based cache with validation."""
    
    def __init__(self, cache_dir: Path):
        self.cache_dir = cache_dir
        self.cache_dir.mkdir(exist_ok=True)
    
    def _get_cache_path(self, key: str) -> Path:
        """Get cache file path for key."""
        key_hash = hashlib.md5(key.encode()).hexdigest()
        return self.cache_dir / f"{key_hash}.pkl"
    
    def get(self, key: str):
        """Get cached object."""
        cache_path = self._get_cache_path(key)
        if cache_path.exists():
            try:
                with open(cache_path, "rb") as f:
                    return pickle.load(f)
            except Exception as e:
                print(f"Cache read error: {e}")
                cache_path.unlink()  # Remove corrupted cache
        return None
    
    def set(self, key: str, value):
        """Cache object."""
        cache_path = self._get_cache_path(key)
        try:
            with open(cache_path, "wb") as f:
                pickle.dump(value, f, protocol=pickle.HIGHEST_PROTOCOL)
        except Exception as e:
            print(f"Cache write error: {e}")

# Usage (only for trusted data!)
cache = SafePickleCache(Path(".cache"))
cache.set("user_data", {"name": "Alice"})
data = cache.get("user_data")
```

9.7 System Interaction

Python provides comprehensive tools for interacting with the operating system, running external programs, and managing system resources.

**Modules:**

- `subprocess` — Run external programs and commands
- `sys` — System-specific parameters and functions
- `os` — Operating system interface
- `signal` — Signal handling for Unix systems

9.7.1 subprocess: Running External Programs

The `subprocess` module is the recommended way to run external programs. **Never use `os.system()` or `os.popen()`.**

**Basic Usage:**

```python
import subprocess

# Run command and capture output
result = subprocess.run(
    ["ls", "-l"],
    capture_output=True,
    text=True,
    check=True
)
print(result.stdout)
print(result.returncode)  # 0 for success

# Run without capturing output
result = subprocess.run(["echo", "Hello"], text=True)
```

**Error Handling:**

```python
try:
    result = subprocess.run(
        ["command", "args"],
        capture_output=True,
        text=True,
        check=True  # Raises CalledProcessError on non-zero exit
    )
except subprocess.CalledProcessError as e:
    print(f"Command failed: {e}")
    print(f"Return code: {e.returncode}")
    print(f"Error output: {e.stderr}")
```

**Advanced Options:**

```python
# Set working directory
result = subprocess.run(
    ["ls"],
    cwd="/tmp",
    capture_output=True,
    text=True
)

# Set environment variables
env = {"PATH": "/usr/bin", "LANG": "en_US.UTF-8"}
result = subprocess.run(
    ["command"],
    env=env,
    capture_output=True,
    text=True
)

# Timeout (Python 3.3+)
try:
    result = subprocess.run(
        ["slow_command"],
        timeout=5.0,  # Seconds
        capture_output=True,
        text=True
    )
except subprocess.TimeoutExpired:
    print("Command timed out")

# Redirect input
result = subprocess.run(
    ["grep", "pattern"],
    input="line1\nline2\npattern\nline4",
    capture_output=True,
    text=True
)
```

**Popen for Advanced Control:**

```python
# For streaming output or interactive programs
process = subprocess.Popen(
    ["command"],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

# Read output line by line
for line in process.stdout:
    print(line.strip())

# Wait for completion
process.wait()
if process.returncode != 0:
    error = process.stderr.read()
    print(f"Error: {error}")
```

**⚠️ CRITICAL: Security Best Practices:**

```python
# ❌ NEVER DO THIS (shell injection vulnerability)
subprocess.run(f"rm {user_input}", shell=True)  # DANGEROUS!

# ✅ ALWAYS DO THIS (safe)
subprocess.run(["rm", user_input])  # Safe: user_input is single argument

# ❌ NEVER use shell=True with user input
subprocess.run(f"ls {user_dir}", shell=True)  # DANGEROUS!

# ✅ Use list form
subprocess.run(["ls", user_dir])  # Safe
```

**Try This:** Create a safe command runner:
```python
import subprocess
from typing import List, Optional

def run_command_safe(
    command: List[str],
    timeout: Optional[float] = None,
    cwd: Optional[str] = None
) -> tuple[int, str, str]:
    """Safely run command and return (returncode, stdout, stderr)."""
    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd=cwd,
            check=False  # Don't raise on error
        )
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired as e:
        return -1, "", f"Command timed out after {timeout}s"
    except Exception as e:
        return -1, "", str(e)

# Usage
returncode, stdout, stderr = run_command_safe(["ls", "-l"], timeout=5.0)
if returncode == 0:
    print(stdout)
else:
    print(f"Error: {stderr}")
```

9.7.2 sys module: System-Specific Parameters

The `sys` module provides access to system-specific parameters and functions.

**Command-Line Arguments:**

```python
import sys

# Access command-line arguments
print(sys.argv)  # ['script.py', 'arg1', 'arg2']
if len(sys.argv) > 1:
    first_arg = sys.argv[1]

# Better: use argparse module (see Chapter 9.15)
```

**Exit Codes:**

```python
# Exit with code
sys.exit(0)   # Success
sys.exit(1)   # General error
sys.exit(2)   # Misuse of command

# Or raise SystemExit
raise SystemExit(1)
```

**Python Path:**

```python
# Modify module search path (use sparingly!)
sys.path.insert(0, "/custom/module/path")

# Get current path
print(sys.path)
```

**System Information:**

```python
# Python version
print(sys.version)      # Detailed version info
print(sys.version_info) # (3, 12, 0, 'final', 0)

# Platform
print(sys.platform)     # 'linux', 'win32', 'darwin'

# Executable
print(sys.executable)   # Path to Python interpreter

# Byte order
print(sys.byteorder)   # 'little' or 'big'
```

**Memory and Performance:**

```python
# Object size
import sys
x = [1, 2, 3, 4, 5]
print(sys.getsizeof(x))  # Size in bytes

# Recursion limit
print(sys.getrecursionlimit())  # Default: 1000
sys.setrecursionlimit(2000)     # Change limit (use carefully!)

# Reference count (debugging)
import sys
x = [1, 2, 3]
print(sys.getrefcount(x))  # Number of references
```

**Standard Streams:**

```python
# Redirect stdout
import sys
with open("output.txt", "w") as f:
    sys.stdout = f
    print("This goes to file")
sys.stdout = sys.__stdout__  # Restore

# Better: use context manager
from contextlib import redirect_stdout
with open("output.txt", "w") as f:
    with redirect_stdout(f):
        print("This goes to file")
```

**Try This:** Create a CLI argument parser:
```python
import sys

def parse_args():
    """Simple argument parser."""
    if len(sys.argv) < 2:
        print("Usage: script.py <command> [args...]")
        sys.exit(1)
    
    command = sys.argv[1]
    args = sys.argv[2:]
    
    if command == "hello":
        name = args[0] if args else "World"
        print(f"Hello, {name}!")
    elif command == "version":
        print(f"Python {sys.version}")
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)

parse_args()
```

9.7.3 os module: Operating System Interface

The `os` module provides a portable way to use operating system functionality.

**Environment Variables:**

```python
import os

# Get environment variable
home = os.getenv("HOME")
path = os.getenv("PATH", "/usr/bin")  # With default

# Set environment variable
os.environ["MY_VAR"] = "value"

# Get all environment variables
for key, value in os.environ.items():
    print(f"{key}={value}")
```

**File and Directory Operations:**

```python
# Current working directory
cwd = os.getcwd()
os.chdir("/tmp")  # Change directory

# List directory
files = os.listdir(".")
for file in files:
    print(file)

# Create/remove directories
os.makedirs("path/to/dir", exist_ok=True)
os.rmdir("empty_dir")  # Only removes empty directories
os.removedirs("path/to/dir")  # Removes empty parent dirs too

# File operations
os.rename("old.txt", "new.txt")
os.remove("file.txt")
os.link("source", "hardlink")  # Create hard link
os.symlink("source", "symlink")  # Create symbolic link
```

**Path Operations (Prefer pathlib, but os.path still common):**

```python
import os.path

# Join paths (handles OS differences)
path = os.path.join("dir", "subdir", "file.txt")

# Split paths
dirname, filename = os.path.split("/path/to/file.txt")
basename = os.path.basename("/path/to/file.txt")
dirname = os.path.dirname("/path/to/file.txt")

# Get extension
name, ext = os.path.splitext("file.txt")  # ("file", ".txt")

# Absolute path
abs_path = os.path.abspath("relative/path")

# Check existence
if os.path.exists("file.txt"):
    if os.path.isfile("file.txt"):
        print("It's a file")
    elif os.path.isdir("file.txt"):
        print("It's a directory")
```

**Process Information:**

```python
# Process ID
pid = os.getpid()
print(f"Process ID: {pid}")

# Parent process ID
ppid = os.getppid()
print(f"Parent PID: {ppid}")

# User ID (Unix)
uid = os.getuid()  # Current user ID
gid = os.getgid()  # Current group ID
```

**Permissions (Unix):**

```python
# Get file permissions
mode = os.stat("file.txt").st_mode
print(oct(mode))  # Permission bits

# Change permissions
os.chmod("file.txt", 0o755)  # rwxr-xr-x

# Change owner (requires privileges)
os.chown("file.txt", uid, gid)
```

**File Timestamps:**

In Python, the best way to determine when a file was last modified is using `os.path.getmtime()` or `pathlib.Path.stat().st_mtime`. These return the modification time, which is specifically updated when file **content** changes, not when files are moved or merely opened.

Here's the key distinction between file timestamps:

- **`st_mtime` (modification time)**: Updated when file *content* changes - this is what you want
- **`st_atime` (access time)**: Updated when file is opened/read (though often disabled on modern systems for performance)
- **`st_ctime` (change time)**: On Unix, tracks metadata changes (permissions, ownership, moves); on Windows, tracks creation time

**Recommended approach:**

```python
from pathlib import Path
from datetime import datetime

# Using pathlib (modern, recommended)
file_path = Path("myfile.txt")
mtime = file_path.stat().st_mtime
last_modified = datetime.fromtimestamp(mtime)
print(f"Last modified: {last_modified}")

# Or using os module
import os
mtime = os.path.getmtime("myfile.txt")
last_modified = datetime.fromtimestamp(mtime)
```

**Filtering files by modification time:**

```python
from pathlib import Path
from datetime import datetime, timedelta

def get_recently_modified_files(directory, hours=24):
    cutoff = datetime.now() - timedelta(hours=hours)
    modified_files = []
    
    for file_path in Path(directory).rglob("*"):
        if file_path.is_file():
            mtime = datetime.fromtimestamp(file_path.stat().st_mtime)
            if mtime > cutoff:
                modified_files.append((file_path, mtime))
    
    return modified_files
```

**Important notes:**

- Moving a file preserves `st_mtime` on most systems, so you'll correctly see the original modification time
- Opening a file without changing it does **not** update `st_mtime`
- `st_mtime` is exactly what you need for detecting actual content modifications

**Try This:** Create a file system utility:
```python
import os
from pathlib import Path

def find_files(directory: str, extension: str) -> list[str]:
    """Find all files with given extension."""
    files = []
    for root, dirs, filenames in os.walk(directory):
        for filename in filenames:
            if filename.endswith(extension):
                full_path = os.path.join(root, filename)
                files.append(full_path)
    return files

# Usage
py_files = find_files(".", ".py")
for file in py_files:
    print(file)
```

9.7.4 signal handling: Unix Signal Management

The `signal` module allows programs to handle Unix signals (not available on Windows).

**Basic Signal Handling:**

```python
import signal
import sys

def signal_handler(signum, frame):
    """Handle interrupt signal."""
    print("\nInterrupted! Cleaning up...")
    # Perform cleanup
    sys.exit(0)

# Register handler for SIGINT (Ctrl+C)
signal.signal(signal.SIGINT, signal_handler)

# Register handler for SIGTERM (termination request)
signal.signal(signal.SIGTERM, signal_handler)

# Your main program
while True:
    # Do work
    pass
```

**Common Signals:**

```python
# SIGINT: Interrupt (Ctrl+C)
signal.signal(signal.SIGINT, handler)

# SIGTERM: Termination request
signal.signal(signal.SIGTERM, handler)

# SIGHUP: Hang up (terminal closed)
signal.signal(signal.SIGHUP, handler)

# SIGALRM: Alarm clock (for timeouts)
signal.signal(signal.SIGALRM, handler)
```

**Timeout with Signals:**

```python
import signal

class TimeoutError(Exception):
    pass

def timeout_handler(signum, frame):
    raise TimeoutError("Operation timed out")

def with_timeout(seconds: int):
    """Decorator for function timeout."""
    def decorator(func):
        def wrapper(*args, **kwargs):
            signal.signal(signal.SIGALRM, timeout_handler)
            signal.alarm(seconds)
            try:
                result = func(*args, **kwargs)
            finally:
                signal.alarm(0)  # Cancel alarm
            return result
        return wrapper
    return decorator

@with_timeout(5)
def slow_operation():
    import time
    time.sleep(10)  # Will timeout

try:
    slow_operation()
except TimeoutError:
    print("Operation timed out")
```

**⚠️ Windows Limitation:**

Signal handling is Unix-specific. On Windows, only `SIGINT` and `SIGTERM` are available, and behavior differs.

**Try This:** Graceful shutdown handler:
```python
import signal
import sys
import time

class GracefulShutdown:
    def __init__(self):
        self.shutdown_requested = False
        signal.signal(signal.SIGINT, self._handler)
        signal.signal(signal.SIGTERM, self._handler)
    
    def _handler(self, signum, frame):
        print(f"\nReceived signal {signum}, shutting down gracefully...")
        self.shutdown_requested = True
    
    def should_continue(self):
        return not self.shutdown_requested

shutdown = GracefulShutdown()

# Main loop
while shutdown.should_continue():
    print("Working...")
    time.sleep(1)
    # Do work, check shutdown.should_continue() periodically

print("Shutdown complete")
```

9.8 Networking

Python's standard library provides networking capabilities, though third-party libraries like `requests` and `httpx` are preferred for HTTP.

**Modules:**

- `urllib` — URL handling and HTTP client (stdlib)
- `requests` (third-party) — Preferred for HTTP (not in stdlib)
- `socket` — Low-level networking interface
- `ssl` — SSL/TLS support

**Note:** For HTTP requests, use `requests` or `httpx` (third-party). `urllib` is shown here for completeness and when stdlib-only is required.

9.8.1 urllib: URL Handling and HTTP Client

The `urllib` module provides URL handling and basic HTTP client functionality.

**Basic HTTP Requests:**

```python
from urllib.request import urlopen, Request
from urllib.parse import urlencode, quote

# Simple GET request
with urlopen("https://example.com") as response:
    data = response.read()
    print(data.decode('utf-8'))

# With headers
req = Request("https://api.example.com/data")
req.add_header("User-Agent", "MyApp/1.0")
req.add_header("Authorization", "Bearer token123")

with urlopen(req) as response:
    data = response.read()

# POST request
data = urlencode({"key": "value"}).encode()
req = Request("https://api.example.com/submit", data=data)
req.add_header("Content-Type", "application/x-www-form-urlencoded")

with urlopen(req) as response:
    result = response.read()
```

**URL Parsing and Encoding:**

```python
from urllib.parse import urlparse, urljoin, quote, unquote

# Parse URL
url = "https://example.com/path?query=value#fragment"
parsed = urlparse(url)
print(parsed.scheme)    # "https"
print(parsed.netloc)    # "example.com"
print(parsed.path)      # "/path"
print(parsed.query)     # "query=value"
print(parsed.fragment)  # "fragment"

# Join URLs
base = "https://example.com/api/"
relative = "users/123"
full_url = urljoin(base, relative)
print(full_url)  # "https://example.com/api/users/123"

# URL encoding
encoded = quote("hello world")
print(encoded)  # "hello%20world"

decoded = unquote("hello%20world")
print(decoded)  # "hello world"
```

**Error Handling:**

```python
from urllib.request import urlopen
from urllib.error import URLError, HTTPError

try:
    with urlopen("https://example.com") as response:
        data = response.read()
except HTTPError as e:
    print(f"HTTP Error {e.code}: {e.reason}")
except URLError as e:
    print(f"URL Error: {e.reason}")
```

**⚠️ Limitations:**

- No connection pooling
- No automatic retries
- Verbose API
- Limited authentication options

**Recommendation:** Use `requests` or `httpx` for production HTTP clients.

**Try This:** Simple HTTP client wrapper:
```python
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from urllib.parse import urlencode

def http_get(url: str, headers: dict = None) -> tuple[int, bytes]:
    """Simple GET request with error handling."""
    try:
        req = Request(url)
        if headers:
            for key, value in headers.items():
                req.add_header(key, value)
        
        with urlopen(req, timeout=10) as response:
            return response.status, response.read()
    except HTTPError as e:
        return e.code, e.read()
    except URLError as e:
        raise ConnectionError(f"Failed to connect: {e.reason}")

status, data = http_get("https://example.com")
print(f"Status: {status}")
print(f"Data: {data[:100]}...")
```

9.8.2 low-level sockets: Raw Network Programming

The `socket` module provides low-level network interface (rarely needed for most applications).

**Basic TCP Client:**

```python
import socket

# Create socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Connect to server
s.connect(("example.com", 80))

# Send data
s.sendall(b"GET / HTTP/1.1\r\nHost: example.com\r\n\r\n")

# Receive data
data = s.recv(4096)
print(data.decode())

# Close connection
s.close()

# Better: use context manager
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect(("example.com", 80))
    s.sendall(b"GET / HTTP/1.1\r\nHost: example.com\r\n\r\n")
    data = s.recv(4096)
    print(data.decode())
```

**Basic TCP Server:**

```python
import socket

# Create server socket
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind(("localhost", 8080))
server.listen(5)

print("Server listening on port 8080")

while True:
    client, addr = server.accept()
    print(f"Connection from {addr}")
    
    with client:
        data = client.recv(1024)
        if data:
            client.sendall(b"Echo: " + data)
    
    # For production, use threading or asyncio
```

**UDP Socket:**

```python
# UDP client
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.sendto(b"Hello", ("example.com", 53))
data, addr = sock.recvfrom(1024)
sock.close()
```

**⚠️ When to Use:**

- ✅ Custom protocols (not HTTP)
- ✅ High-performance networking
- ✅ Direct TCP/UDP access needed
- ❌ HTTP requests (use `requests` or `httpx`)
- ❌ Most web applications (use frameworks)

**Try This:** Simple echo server:
```python
import socket
import threading

def handle_client(client, addr):
    """Handle client connection."""
    with client:
        print(f"Client connected: {addr}")
        while True:
            data = client.recv(1024)
            if not data:
                break
            client.sendall(b"Echo: " + data)
    print(f"Client disconnected: {addr}")

def start_server(host="localhost", port=8080):
    """Start echo server."""
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind((host, port))
    server.listen(5)
    
    print(f"Server listening on {host}:{port}")
    
    while True:
        client, addr = server.accept()
        thread = threading.Thread(target=handle_client, args=(client, addr))
        thread.start()

# start_server()  # Uncomment to run
```

9.8.3 ssl: Secure Socket Layer

The `ssl` module provides SSL/TLS support for secure connections.

**SSL Context:**

```python
import ssl
import socket

# Create default SSL context
ctx = ssl.create_default_context()

# Create secure socket
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
secure_sock = ctx.wrap_socket(sock, server_hostname="example.com")
secure_sock.connect(("example.com", 443))

# Send HTTPS request
secure_sock.sendall(b"GET / HTTP/1.1\r\nHost: example.com\r\n\r\n")
response = secure_sock.recv(4096)
print(response.decode())

secure_sock.close()
```

**Certificate Verification:**

```python
# Default: verifies certificates (secure)
ctx = ssl.create_default_context()

# Disable verification (INSECURE - only for testing!)
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE  # ⚠️ DANGEROUS!
```

**Custom Certificates:**

```python
# Load custom CA certificates
ctx = ssl.create_default_context()
ctx.load_verify_locations("/path/to/ca-bundle.crt")

# Client certificate
ctx.load_cert_chain("client.crt", "client.key")
```

**⚠️ Security Best Practices:**

- ✅ Always use `create_default_context()` for production
- ✅ Never disable certificate verification in production
- ✅ Use proper certificate validation
- ❌ Never use `CERT_NONE` in production code

**Try This:** Secure HTTPS client:
```python
import ssl
import socket
from urllib.request import urlopen

def secure_get(url: str) -> bytes:
    """Secure HTTPS GET with proper certificate validation."""
    ctx = ssl.create_default_context()
    
    # Parse URL
    from urllib.parse import urlparse
    parsed = urlparse(url)
    
    # Create secure connection
    sock = socket.create_connection((parsed.hostname, 443))
    secure_sock = ctx.wrap_socket(sock, server_hostname=parsed.hostname)
    
    try:
        # Send request
        request = f"GET {parsed.path or '/'} HTTP/1.1\r\nHost: {parsed.hostname}\r\n\r\n"
        secure_sock.sendall(request.encode())
        
        # Receive response
        response = secure_sock.recv(4096)
        return response
    finally:
        secure_sock.close()

# Usage
response = secure_get("https://example.com")
print(response.decode()[:200])
```

9.9 Compression & Archives

Python provides comprehensive support for compression and archive formats.

9.9.1 zipfile: ZIP Archive Handling

The `zipfile` module handles ZIP archives (the most common archive format).

**Reading ZIP Files:**

```python
import zipfile

# List contents
with zipfile.ZipFile("archive.zip") as z:
    print(z.namelist())  # List of file names
    print(z.infolist())  # List of ZipInfo objects
    
    # Extract all
    z.extractall("extract_to/")
    
    # Extract specific file
    z.extract("file.txt", "extract_to/")
    
    # Read file without extracting
    content = z.read("file.txt")
    print(content.decode('utf-8'))
```

**Creating ZIP Files:**

```python
# Create ZIP archive
with zipfile.ZipFile("output.zip", "w", zipfile.ZIP_DEFLATED) as z:
    z.write("file1.txt")
    z.write("file2.txt", "renamed.txt")  # Rename in archive
    z.writestr("data.txt", "Content as string")

# Compression levels
with zipfile.ZipFile("archive.zip", "w", zipfile.ZIP_STORED) as z:
    # No compression (fastest)
    z.write("file.txt")

with zipfile.ZipFile("archive.zip", "w", zipfile.ZIP_DEFLATED) as z:
    # Deflate compression (default, good balance)
    z.write("file.txt")

with zipfile.ZipFile("archive.zip", "w", zipfile.ZIP_BZIP2) as z:
    # BZIP2 compression (better compression, slower)
    z.write("file.txt")

with zipfile.ZipFile("archive.zip", "w", zipfile.ZIP_LZMA) as z:
    # LZMA compression (best compression, slowest)
    z.write("file.txt")
```

**Password-Protected ZIPs:**

```python
# Create password-protected ZIP
with zipfile.ZipFile("secure.zip", "w") as z:
    z.write("file.txt", pwd=b"password123")

# Extract password-protected ZIP
with zipfile.ZipFile("secure.zip") as z:
    z.extractall(pwd=b"password123")
```

**Try This:** Create a backup utility:
```python
import zipfile
from pathlib import Path
from datetime import datetime

def create_backup(source_dir: Path, backup_path: Path):
    """Create timestamped ZIP backup of directory."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = backup_path / f"backup_{timestamp}.zip"
    
    with zipfile.ZipFile(backup_file, "w", zipfile.ZIP_DEFLATED) as z:
        for file in source_dir.rglob("*"):
            if file.is_file():
                arcname = file.relative_to(source_dir)
                z.write(file, arcname)
    
    print(f"Backup created: {backup_file}")
    return backup_file

backup = create_backup(Path("my_project"), Path("backups"))
```

9.9.2 tarfile: TAR Archive Handling

The `tarfile` module handles TAR archives (common on Unix systems).

**Reading TAR Files:**

```python
import tarfile

# Open and extract
with tarfile.open("data.tar.gz", "r:gz") as t:
    t.extractall("extract_to/")
    
    # List contents
    for member in t.getmembers():
        print(f"{member.name} ({member.size} bytes)")

# Different compression formats
with tarfile.open("data.tar", "r") as t:      # Uncompressed
    t.extractall()

with tarfile.open("data.tar.gz", "r:gz") as t:  # Gzip
    t.extractall()

with tarfile.open("data.tar.bz2", "r:bz2") as t:  # Bzip2
    t.extractall()

with tarfile.open("data.tar.xz", "r:xz") as t:  # XZ
    t.extractall()
```

**Creating TAR Files:**

```python
# Create TAR archive
with tarfile.open("output.tar.gz", "w:gz") as t:
    t.add("file1.txt")
    t.add("file2.txt", arcname="renamed.txt")  # Rename in archive
    t.add("directory/", recursive=True)  # Add directory

# Compression formats
with tarfile.open("archive.tar", "w") as t:      # Uncompressed
    t.add("file.txt")

with tarfile.open("archive.tar.gz", "w:gz") as t:  # Gzip (common)
    t.add("file.txt")

with tarfile.open("archive.tar.bz2", "w:bz2") as t:  # Bzip2
    t.add("file.txt")
```

**Try This:** Archive with filtering:
```python
import tarfile
from pathlib import Path

def create_tar_filtered(source_dir: Path, output: Path, exclude_patterns: list[str]):
    """Create TAR excluding certain patterns."""
    def filter_func(tarinfo):
        """Filter out excluded patterns."""
        for pattern in exclude_patterns:
            if pattern in tarinfo.name:
                return None
        return tarinfo
    
    with tarfile.open(output, "w:gz") as t:
        t.add(source_dir, arcname=source_dir.name, filter=filter_func)

create_tar_filtered(
    Path("project"),
    Path("project.tar.gz"),
    exclude_patterns=[".git", "__pycache__", ".pyc"]
)
```

9.9.3 gzip/bz2/lzma: Compression Modules

These modules provide compression for individual files.

**gzip (GNU Zip):**

```python
import gzip

# Compress file
with open("file.txt", "rb") as f_in:
    with gzip.open("file.txt.gz", "wb") as f_out:
        f_out.writelines(f_in)

# Decompress file
with gzip.open("file.txt.gz", "rb") as f_in:
    with open("file.txt", "wb") as f_out:
        f_out.writelines(f_in)

# Text mode
with gzip.open("file.txt.gz", "rt") as f:
    text = f.read()
    print(text)

# Compression level (1-9, 9 = best compression)
with gzip.open("file.txt.gz", "wb", compresslevel=9) as f:
    f.write(b"data")
```

**bz2 (Bzip2):**

```python
import bz2

# Compress
with open("file.txt", "rb") as f_in:
    with bz2.open("file.txt.bz2", "wb") as f_out:
        f_out.writelines(f_in)

# Decompress
with bz2.open("file.txt.bz2", "rb") as f:
    data = f.read()
```

**lzma (XZ/LZMA):**

```python
import lzma

# Compress
with open("file.txt", "rb") as f_in:
    with lzma.open("file.txt.xz", "wb") as f_out:
        f_out.writelines(f_in)

# Decompress
with lzma.open("file.txt.xz", "rb") as f:
    data = f.read()
```

**Compression Comparison:**

```python
import gzip
import bz2
import lzma

data = b"x" * 1000000  # 1MB of data

# Gzip
with gzip.open("test.gz", "wb") as f:
    f.write(data)
gz_size = Path("test.gz").stat().st_size

# Bzip2
with bz2.open("test.bz2", "wb") as f:
    f.write(data)
bz2_size = Path("test.bz2").stat().st_size

# LZMA
with lzma.open("test.xz", "wb") as f:
    f.write(data)
xz_size = Path("test.xz").stat().st_size

print(f"Original: 1,000,000 bytes")
print(f"Gzip:     {gz_size:,} bytes")
print(f"Bzip2:    {bz2_size:,} bytes")
print(f"LZMA:     {xz_size:,} bytes")
```

**Try This:** Compress log files:
```python
import gzip
from pathlib import Path

def compress_logs(log_dir: Path, keep_original: bool = False):
    """Compress all .log files in directory."""
    for log_file in log_dir.glob("*.log"):
        gz_file = log_file.with_suffix(".log.gz")
        
        with open(log_file, "rb") as f_in:
            with gzip.open(gz_file, "wb") as f_out:
                f_out.writelines(f_in)
        
        if not keep_original:
            log_file.unlink()
        
        print(f"Compressed: {log_file.name} -> {gz_file.name}")

compress_logs(Path("logs"))
```

9.10 Debugging & Introspection Tools

Python provides powerful tools for debugging and code introspection.

9.10.1 logging: Structured Logging

The `logging` module is essential for production applications.

**Basic Setup:**

```python
import logging

# Basic configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

logger = logging.getLogger(__name__)

# Log messages
logger.debug("Debug message")      # Not shown (level=INFO)
logger.info("Info message")        # Shown
logger.warning("Warning message")   # Shown
logger.error("Error message")       # Shown
logger.critical("Critical message") # Shown
```

**Advanced Configuration:**

```python
import logging
from logging.handlers import RotatingFileHandler, TimedRotatingFileHandler

# Create logger
logger = logging.getLogger("myapp")
logger.setLevel(logging.DEBUG)

# Console handler
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_format = logging.Formatter('%(levelname)s - %(message)s')
console_handler.setFormatter(console_format)

# File handler with rotation
file_handler = RotatingFileHandler(
    "app.log",
    maxBytes=10*1024*1024,  # 10MB
    backupCount=5
)
file_handler.setLevel(logging.DEBUG)
file_format = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
file_handler.setFormatter(file_format)

# Add handlers
logger.addHandler(console_handler)
logger.addHandler(file_handler)

# Use logger
logger.info("Application started")
logger.error("An error occurred", exc_info=True)  # Include traceback
```

**Structured Logging (with context):**

```python
import logging

logger = logging.getLogger(__name__)

# Add context
logger.info("Processing request", extra={
    "user_id": 123,
    "request_id": "abc-123",
    "endpoint": "/api/users"
})

# Use filters for automatic context
class ContextFilter(logging.Filter):
    def filter(self, record):
        record.request_id = getattr(record, "request_id", "unknown")
        return True

logger.addFilter(ContextFilter())
```

**Try This:** Create a logging utility:
```python
import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path

def setup_logging(log_dir: Path, app_name: str = "app"):
    """Setup production-ready logging."""
    log_dir.mkdir(exist_ok=True)
    log_file = log_dir / f"{app_name}.log"
    
    # Configure root logger
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - [%(request_id)s] - %(message)s',
        handlers=[
            logging.StreamHandler(),
            RotatingFileHandler(log_file, maxBytes=10*1024*1024, backupCount=5)
        ]
    )
    
    return logging.getLogger(app_name)

logger = setup_logging(Path("logs"), "myapp")
logger.info("Application started")
```

9.10.2 pprint: Pretty Printing

The `pprint` module provides improved printing for data structures.

**Basic Usage:**

```python
from pprint import pprint

data = {
    "users": [
        {"name": "Alice", "age": 30, "city": "New York"},
        {"name": "Bob", "age": 25, "city": "London"},
    ],
    "metadata": {"version": "1.0", "count": 2}
}

# Pretty print
pprint(data)
# {
#     'metadata': {'count': 2, 'version': '1.0'},
#     'users': [
#         {'age': 30, 'city': 'New York', 'name': 'Alice'},
#         {'age': 25, 'city': 'London', 'name': 'Bob'}
#     ]
# }

# Custom options
pprint(data, width=40, indent=2, depth=2)
```

**Try This:** Debug data structures:
```python
from pprint import pprint, pformat

def debug_print(data, label="Data"):
    """Pretty print with label."""
    print(f"\n{label}:")
    print("=" * 50)
    pprint(data, width=80, indent=2)
    print("=" * 50)

# Usage
debug_print({"key": "value"}, "Configuration")
```

9.10.3 traceback: Exception Tracebacks

The `traceback` module provides detailed exception information.

**Printing Tracebacks:**

```python
import traceback

try:
    1 / 0
except Exception:
    # Print to stderr
    traceback.print_exc()
    
    # Get as string
    tb_str = traceback.format_exc()
    print(f"Traceback:\n{tb_str}")
    
    # Get traceback object
    exc_type, exc_value, exc_tb = sys.exc_info()
    tb_lines = traceback.format_exception(exc_type, exc_value, exc_tb)
    print(''.join(tb_lines))
```

**Custom Exception Formatting:**

```python
import traceback
import sys

def format_exception(e: Exception) -> str:
    """Format exception with full context."""
    exc_type, exc_value, exc_tb = sys.exc_info()
    tb_lines = traceback.format_exception(exc_type, exc_value, exc_tb)
    return ''.join(tb_lines)

try:
    risky_operation()
except Exception as e:
    error_msg = format_exception(e)
    logger.error(f"Operation failed:\n{error_msg}")
```

**Try This:** Exception logger:
```python
import traceback
import logging

logger = logging.getLogger(__name__)

def log_exception(func):
    """Decorator to log exceptions with full traceback."""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(
                f"Exception in {func.__name__}:\n{traceback.format_exc()}"
            )
            raise
    return wrapper

@log_exception
def risky_function():
    1 / 0

risky_function()
```

9.10.4 inspect: Code Introspection

The `inspect` module provides powerful introspection capabilities.

**Function Signatures:**

```python
import inspect

def example(a: int, b: str = "default", *args, **kwargs) -> str:
    """Example function."""
    pass

# Get signature
sig = inspect.signature(example)
print(sig)  # (a: int, b: str = 'default', *args, **kwargs) -> str

# Get parameters
for name, param in sig.parameters.items():
    print(f"{name}: {param.annotation} = {param.default}")

# Get return annotation
print(sig.return_annotation)  # <class 'str'>
```

**Source Code:**

```python
# Get source code
source = inspect.getsource(example)
print(source)

# Get file location
file = inspect.getfile(example)
line = inspect.getsourcelines(example)[1]
print(f"Defined in {file}:{line}")
```

**Class and Object Inspection:**

```python
import inspect

class MyClass:
    def method(self):
        pass

# Get members
members = inspect.getmembers(MyClass)
for name, value in members:
    print(f"{name}: {type(value)}")

# Check if callable
print(inspect.iscallable(MyClass))  # True

# Get method resolution order
print(inspect.getmro(MyClass))  # MRO tuple
```

**Frame Inspection (Debugging):**

```python
import inspect

def debug_function():
    # Get current frame
    frame = inspect.currentframe()
    print(f"Function: {frame.f_code.co_name}")
    print(f"File: {frame.f_code.co_filename}")
    print(f"Line: {frame.f_lineno}")
    print(f"Locals: {frame.f_locals}")

debug_function()
```

**Try This:** Create a function inspector:
```python
import inspect

def inspect_function(func):
    """Inspect function and print details."""
    sig = inspect.signature(func)
    doc = inspect.getdoc(func)
    source = inspect.getsource(func)
    
    print(f"Function: {func.__name__}")
    print(f"Signature: {sig}")
    print(f"Docstring: {doc}")
    print(f"Source:\n{source}")

def example(a: int, b: str) -> str:
    """Example function."""
    return f"{a}: {b}"

inspect_function(example)
```

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
