<!-- SSM:CHUNK_BOUNDARY id="ch11-start" -->
📘 CHAPTER 11 — ASYNC & PROMISES 🟡 Intermediate

> **Quick Answer:** Functions returning `Promise<T>` should use `async/await`. Use `Promise.all()` for parallel, `Promise.allSettled()` when some can fail. Type `AsyncGenerator<T>` for async iteration. Avoid mixing sync/async patterns.

### 11.1 Promise Types

Promise types represent asynchronous values:

Example:

```typescript
function fetchUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`).then(res => res.json());
}
```

### 11.2 Async/Await

Async/await provides synchronous-looking code for promises:

Example:

```typescript
async function getUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

**Production Failure: Wrong Async/Sync Mixing**

An AI generated Bun-compatible TS code for a file watcher, but it invented `stat(filePath).then()` as sync, crashing on production deploys (Bun expects promises). Five days of fixes later, they ditched it for manual ESLint.

**Lesson**: Specify "Bun-only" in prompts—AIs default to Node assumptions. Always verify async/sync behavior matches runtime.

**Production Failure: Async Result Types Without Imports**

An AI generated TS skeletons for a Vue login flow, but it hallucinated a `Result.pipe` chain without importing the required library, exposing raw axios calls. Production auth leaked unhandled errors, nearly shipping insecure code.

**Lesson**: Always include `package.json` in prompts; AIs assume globals.

### 11.3 Awaited Utility

`Awaited<T>` recursively unwraps promises:

Example:

```typescript
type Deep = Awaited<Promise<Promise<string>>>; // string
```

### 11.4 Using Declarations (TypeScript 5.2+)

**`using` declarations**: Automatic resource management (disposable pattern).

**Basic Usage:**

```typescript
class FileHandle implements Disposable {
  constructor(private path: string) {}
  
  [Symbol.dispose](): void {
    // Cleanup: close file handle
    this.close();
  }
  
  close(): void {
    // Close file
  }
}

// Automatic cleanup when scope exits
{
  using file = new FileHandle("./data.txt");
  // Use file...
} // file.dispose() called automatically
```

**`await using` for Async Disposal (TypeScript 5.2+):**

```typescript
class AsyncResource implements AsyncDisposable {
  async [Symbol.asyncDispose](): Promise<void> {
    // Async cleanup
    await this.cleanup();
  }
  
  async cleanup(): Promise<void> {
    // Async cleanup logic
  }
}

// Automatic async cleanup
{
  await using resource = new AsyncResource();
  // Use resource...
} // await resource[Symbol.asyncDispose]() called automatically
```

**Production Pattern: Database Connections:**

```typescript
class DatabaseConnection implements AsyncDisposable {
  constructor(private pool: Pool) {}
  
  async [Symbol.asyncDispose](): Promise<void> {
    await this.pool.release();
  }
  
  async query(sql: string): Promise<unknown> {
    return this.pool.query(sql);
  }
}

async function processData() {
  await using db = await pool.acquire();
  const result = await db.query("SELECT * FROM users");
  // Connection automatically released when scope exits
  return result;
}
```

**Error Handling in Disposal:**

```typescript
class ResourceWithErrorHandling implements AsyncDisposable {
  async [Symbol.asyncDispose](): Promise<void> {
    try {
      await this.cleanup();
    } catch (error) {
      // Log but don't throw - disposal should not throw
      console.error("Cleanup error:", error);
      // Optionally re-throw if critical
      // throw error;
    }
  }
  
  async cleanup(): Promise<void> {
    // May throw
  }
}

// Disposal errors are handled gracefully
{
  await using resource = new ResourceWithErrorHandling();
  // Use resource...
} // Cleanup errors are caught and logged
```

**Multiple Resources:**

```typescript
// Multiple resources disposed in reverse order
async function processWithMultipleResources() {
  await using db = await pool.acquire();
  await using cache = await cachePool.acquire();
  await using file = await fileSystem.open("data.txt");
  
  // All three resources disposed when scope exits
  // Disposal order: file, cache, db (reverse of declaration)
}
```

**Database Transaction Pattern:**

```typescript
class Transaction implements AsyncDisposable {
  constructor(private connection: DatabaseConnection) {}
  
  async [Symbol.asyncDispose](): Promise<void> {
    if (this.connection.isActive) {
      await this.connection.rollback();
    }
  }
  
  async commit(): Promise<void> {
    await this.connection.commit();
    this.connection.isActive = false;
  }
}

async function transferFunds(from: string, to: string, amount: number) {
  await using tx = new Transaction(await pool.acquire());
  
  try {
    await tx.connection.query("UPDATE accounts SET balance = balance - ? WHERE id = ?", [amount, from]);
    await tx.connection.query("UPDATE accounts SET balance = balance + ? WHERE id = ?", [amount, to]);
    await tx.commit();
  } catch (error) {
    // Transaction automatically rolls back on error
    throw error;
  }
}
```

**Pitfalls & Warnings:**

❌ **Disposal Anti-Pattern: Throwing in Disposal:**

```typescript
// ❌ INCORRECT: Throwing in disposal
class BadResource implements Disposable {
  [Symbol.dispose](): void {
    throw new Error("Cleanup failed"); // May cause unhandled errors
  }
}

// ✅ CORRECT: Handle errors in disposal
class GoodResource implements Disposable {
  [Symbol.dispose](): void {
    try {
      this.cleanup();
    } catch (error) {
      console.error("Cleanup error:", error);
      // Don't throw
    }
  }
}
```

### 11.5 Concurrency & Parallelism

TypeScript/JavaScript provides several mechanisms for concurrent and parallel execution:

#### 11.4.1 Web Workers

**Web Workers**: Separate threads for CPU-intensive tasks.

Example:

```typescript
// main.ts
const worker = new Worker(new URL("worker.ts", import.meta.url), {
  type: "module",
});

worker.postMessage({ type: "process", data: largeArray });
worker.onmessage = (event: MessageEvent<{ result: number }>) => {
  console.log("Result:", event.data.result);
};
worker.onerror = (error: ErrorEvent) => {
  console.error("Worker error:", error.message);
};

// worker.ts
self.onmessage = (event: MessageEvent<{ type: string; data: number[] }>) => {
  if (event.data.type === "process") {
    const result = event.data.data.reduce((a, b) => a + b, 0);
    self.postMessage({ result });
  }
};
```

**SharedWorker**: Shared across multiple browser tabs/windows.

Example:

```typescript
const sharedWorker = new SharedWorker("shared-worker.ts");
sharedWorker.port.postMessage({ message: "Hello" });
sharedWorker.port.onmessage = (event) => {
  console.log(event.data);
};
```

#### 11.4.2 Async I/O

**Non-Blocking I/O**: JavaScript's event loop enables concurrent I/O operations.

Example:

```typescript
// Multiple I/O operations run concurrently
async function fetchMultiple() {
  const [users, posts, comments] = await Promise.all([
    fetch("/api/users"),
    fetch("/api/posts"),
    fetch("/api/comments"),
  ]);
  
  // All three requests run in parallel
  return { users, posts, comments };
}
```

#### 11.4.3 Memory Ordering

**JavaScript's Single-Threaded Guarantees:**

- **Happens-Before**: Operations in the same thread are ordered
- **No Data Races**: Single-threaded execution prevents races
- **Atomic Operations**: SharedArrayBuffer with Atomics for shared memory

Example:

```typescript
// Single-threaded: No race conditions
let counter = 0;

async function increment() {
  counter++; // Safe: single-threaded
}

// Shared memory (requires SharedArrayBuffer)
const sharedBuffer = new SharedArrayBuffer(4);
const view = new Int32Array(sharedBuffer);

// Atomic operations for thread safety
Atomics.add(view, 0, 1); // Atomic increment
Atomics.load(view, 0); // Atomic read
```

---


<!-- SSM:CHUNK_BOUNDARY id="ch11-end" -->
