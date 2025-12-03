<!-- SSM:CHUNK_BOUNDARY id="ch31-start" -->
📘 CHAPTER 31 — RUNTIME ENGINES 🔴 Advanced

### 31.1 V8 Internals

How V8 executes TypeScript-compiled JavaScript:

- JIT compilation
- Optimization tiers
- Garbage collection

### 31.2 Performance Considerations

Runtime performance:

- **Type annotations** are erased and add no runtime overhead. However, certain TypeScript **features** generate runtime code:
  - `enum Color { Red, Green, Blue }` → Generates runtime object with reverse mappings
  - `@decorator` → Generates decorator metadata (if enabled)
  - Parameter properties (`constructor(public x: number)`) → Generates class field assignments
  - Class field semantics → May affect property initialization order
  - Downleveling targets → May affect emitted code size and performance
- JavaScript performance applies
- Optimize for V8 patterns

### 31.3 JIT vs AOT

**JIT (Just-In-Time) Compilation**: TypeScript compiles to JavaScript, which is then JIT-compiled by the JavaScript engine.

**Compilation Pipeline:**

1. **TypeScript Compiler (AOT)**: TypeScript → JavaScript (ahead-of-time)
2. **JavaScript Engine (JIT)**: JavaScript → Machine code (just-in-time)

**TypeScript (AOT):**
- Compiles once before execution
- Type checking happens at compile time
- Generates JavaScript output
- No runtime type information

**JavaScript Engine (JIT):**
- Compiles JavaScript to machine code at runtime
- Optimizes hot code paths
- Deoptimizes when assumptions fail
- Multiple optimization tiers (interpreter → baseline → optimized)

**Performance Implications:**
- TypeScript compilation is fast (seconds)
- JavaScript JIT compilation is fast (milliseconds)
- Hot code paths are heavily optimized
- Cold code paths use interpreter

### 31.4 VM/Bytecode

**JavaScript Engine Internals:**

JavaScript engines (V8, SpiderMonkey, etc.) use bytecode:

1. **Parser**: JavaScript → AST
2. **Ignition (V8) / Baseline (SpiderMonkey)**: AST → Bytecode
3. **Turbofan (V8) / Ion (SpiderMonkey)**: Bytecode → Optimized Machine Code

**Bytecode Example (Conceptual):**

```javascript
// JavaScript
function add(a, b) {
  return a + b;
}

// Bytecode (simplified)
Ldar a1        // Load argument 1
Add a2         // Add argument 2
Return         // Return result
```

**TypeScript Impact:**
- TypeScript types are erased before bytecode generation
- No bytecode-level type information
- Optimizations based on runtime behavior, not types

### 31.5 Garbage Collector Internals

**Garbage Collection**: Automatic memory management in JavaScript engines.

#### 31.5.1 Mark-and-Sweep

**Mark-and-Sweep Algorithm:**

1. **Mark**: Traverse object graph, mark reachable objects
2. **Sweep**: Free unmarked objects

Example:

```typescript
// Objects are marked as reachable or unreachable
let obj1 = { data: "important" };
let obj2 = { data: "temporary" };

obj1 = null; // obj1 can be garbage collected
// obj2 is still reachable, not collected
```

#### 31.5.2 Generational GC

**Generational Garbage Collection**: Objects are divided into generations.

- **Young Generation**: Newly allocated objects (frequently collected)
- **Old Generation**: Long-lived objects (infrequently collected)

**Rationale**: Most objects die young. Focus GC effort on young generation.

**TypeScript Impact:**
- TypeScript doesn't affect GC behavior
- Object allocation patterns matter more than types
- Avoid creating unnecessary objects in hot paths

#### 31.5.3 GC Strategies

**Incremental GC**: GC runs in small increments to avoid blocking.

**Concurrent GC**: GC runs on separate thread (doesn't block main thread).

**GC Tuning:**
- Minimize object allocation in hot paths
- Reuse objects when possible
- Avoid circular references
- Use object pools for frequently allocated objects

### 31.6 Memory Model

**Memory Layout**: How JavaScript objects are stored in memory.

#### 28.6.1 Heap Structure

**Heap**: Region of memory for dynamic allocation.

- **New Space**: Young generation (small, fast GC)
- **Old Space**: Old generation (large, slow GC)
- **Large Object Space**: Large objects (>1MB)
- **Code Space**: Compiled code

#### 28.6.2 Object Representation

**Object Structure in Memory:**

```
[Header] [Hidden Class] [Properties] [Elements] [In-Object Properties]
```

- **Header**: GC metadata, object size
- **Hidden Class**: Object shape (for optimization)
- **Properties**: Named properties
- **Elements**: Array elements (if array-like)
- **In-Object Properties**: Fast properties stored inline

**Size Overhead:**
- Empty object: ~48 bytes (V8)
- Each property: ~8-16 bytes
- String properties: Additional string storage

### 31.7 Threading Model

**Single-Threaded Event Loop**: JavaScript/TypeScript runs on a single thread.

#### 28.7.1 Event Loop

**Event Loop**: Manages asynchronous operations.

- **Call Stack**: Synchronous code execution
- **Task Queue**: Callback queue (macrotasks)
- **Microtask Queue**: Promise callbacks (microtasks)

**Execution Order:**
1. Execute synchronous code (call stack)
2. Execute all microtasks (Promise.then, queueMicrotask)
3. Execute one macrotask (setTimeout, I/O callbacks)
4. Repeat

#### 28.7.2 Web Workers

**Web Workers**: Separate threads for parallel execution.

Example:

```typescript
// main.ts
const worker = new Worker("worker.js", { type: "module" });
worker.postMessage({ data: "process this" });
worker.onmessage = (event: MessageEvent) => {
  console.log(event.data);
};

// worker.ts
self.onmessage = (event: MessageEvent) => {
  const result = processData(event.data);
  self.postMessage(result);
};
```

**Limitations:**
- No shared memory (use SharedArrayBuffer for shared memory)
- Communication via message passing
- No DOM access in workers

### 31.8 Event Loop Details

**Event Loop Phases:**

1. **Timers**: Execute `setTimeout` and `setInterval` callbacks
2. **Pending Callbacks**: Execute I/O callbacks
3. **Idle/Prepare**: Internal use
4. **Poll**: Fetch new I/O events
5. **Check**: Execute `setImmediate` callbacks
6. **Close Callbacks**: Execute close callbacks

**Microtasks:**
- `Promise.then/catch/finally`
- `queueMicrotask`
- `MutationObserver`

**Macrotasks:**
- `setTimeout/setInterval`
- I/O callbacks
- `setImmediate` (Node.js)

Example:

```typescript
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");

// Output: 1, 4, 3, 2
// Microtasks (Promise) run before macrotasks (setTimeout)
```

### 31.9 Stack vs Heap

**Stack**: Stores primitive values and function call frames.

- **Fast allocation/deallocation**
- **Fixed size** (limited, ~1-8MB)
- **LIFO** (Last In, First Out)
- **Stores**: Primitives, function frames, local variables

**Heap**: Stores objects and dynamic data.

- **Slower allocation/deallocation**
- **Large size** (limited by system memory)
- **Managed by GC**
- **Stores**: Objects, arrays, functions, closures

Example:

```typescript
// Stack: Primitive values
let num: number = 42;        // Stored on stack
let str: string = "hello";   // String object on heap, reference on stack

// Heap: Objects
let obj = { x: 1, y: 2 };    // Object on heap, reference on stack
let arr = [1, 2, 3];         // Array on heap, reference on stack

// Function frames on stack
function add(a: number, b: number): number {
  // a, b, return value on stack
  return a + b;
}
```

**Memory Management:**
- Stack: Automatic (function returns free stack frame)
- Heap: Garbage collection (GC frees unreachable objects)

---


<!-- SSM:CHUNK_BOUNDARY id="ch31-end" -->
