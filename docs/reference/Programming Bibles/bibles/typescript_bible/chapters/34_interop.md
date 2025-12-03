<!-- SSM:CHUNK_BOUNDARY id="ch34-start" -->
📘 CHAPTER 34 — INTEROP 🔴 Advanced

> **Quick Answer:** WASM: use `WebAssembly.instantiate()` with typed exports. FFI: generate bindings with `ffi-napi`. gRPC: use `@grpc/grpc-js` with proto codegen. Always type external interfaces explicitly.

### 34.1 WebAssembly (WASM)

**WebAssembly**: Low-level binary format for high-performance code execution in browsers and Node.js.

**Complete API Reference:**

```typescript
// WebAssembly namespace types
declare namespace WebAssembly {
  interface Module {
    // Opaque module type
  }
  
  interface Instance {
    readonly exports: Exports;
  }
  
  interface Memory {
    readonly buffer: ArrayBuffer;
    grow(delta: number): number;
  }
  
  interface Table {
    readonly length: number;
    get(index: number): Function | null;
    set(index: number, value: Function | null): void;
    grow(delta: number, value?: Function | null): number;
  }
  
  interface CompileError extends Error {
    constructor(message?: string, fileName?: string, lineNumber?: number);
  }
  
  interface RuntimeError extends Error {
    constructor(message?: string, fileName?: string, lineNumber?: number);
  }
  
  interface LinkError extends Error {
    constructor(message?: string, fileName?: string, lineNumber?: number);
  }
  
  interface Exports {
    [name: string]: any;
  }
  
  interface Imports {
    [module: string]: {
      [name: string]: any;
    };
  }
  
  interface ResultObject {
    module: Module;
    instance: Instance;
  }
  
  // Compile WASM from bytes
  function compile(bytes: BufferSource): Promise<Module>;
  function compileStreaming(source: Promise<Response> | Response): Promise<Module>;
  
  // Instantiate module
  function instantiate(bytes: BufferSource, importObject?: Imports): Promise<ResultObject>;
  function instantiate(module: Module, importObject?: Imports): Promise<Instance>;
  function instantiateStreaming(source: Promise<Response> | Response, importObject?: Imports): Promise<ResultObject>;
  
  // Validate module
  function validate(bytes: BufferSource): boolean;
  
  // Memory and Table constructors
  function Memory(descriptor: MemoryDescriptor): Memory;
  function Table(descriptor: TableDescriptor): Table;
  
  interface MemoryDescriptor {
    initial: number;
    maximum?: number;
    shared?: boolean;
  }
  
  interface TableDescriptor {
    element: TableKind;
    initial: number;
    maximum?: number;
  }
  
  type TableKind = "anyfunc" | "externref";
}

// Example: Basic WASM module loading
async function loadWasmModule() {
  // Load WASM from file
  const wasmModule = await WebAssembly.compileStreaming(fetch("module.wasm"));
  
  // Create memory
  const memory = new WebAssembly.Memory({
    initial: 256,  // 256 pages (16MB)
    maximum: 512,  // 512 pages (32MB)
  });
  
  // Create imports
  const imports: WebAssembly.Imports = {
    env: {
      memory,
      log: (ptr: number, len: number) => {
        const bytes = new Uint8Array(memory.buffer, ptr, len);
        const str = new TextDecoder().decode(bytes);
        console.log(str);
      },
    },
  };
  
  // Instantiate module
  const instance = await WebAssembly.instantiate(wasmModule, imports);
  
  // Call exported function
  const result = instance.exports.add(5, 3) as number;
  console.log(result); // 8
}

// Example: Type-safe WASM bindings
interface WasmExports {
  add(a: number, b: number): number;
  multiply(a: number, b: number): number;
  processArray(ptr: number, len: number): number;
  getString(ptr: number): number;
  free(ptr: number): void;
}

async function createTypedWasmInstance(): Promise<WebAssembly.Instance & { exports: WasmExports }> {
  const wasmModule = await WebAssembly.compileStreaming(fetch("math.wasm"));
  const memory = new WebAssembly.Memory({ initial: 256 });
  
  const instance = await WebAssembly.instantiate(wasmModule, {
    env: { memory },
  }) as WebAssembly.Instance & { exports: WasmExports };
  
  return instance;
}

// Usage
const instance = await createTypedWasmInstance();
const sum = instance.exports.add(10, 20); // Type-safe: number
// instance.exports.add("10", "20"); // ❌ Type error

// Example: Memory management
class WasmMemoryManager {
  private memory: WebAssembly.Memory;
  private instance: WebAssembly.Instance;
  
  constructor(memory: WebAssembly.Memory, instance: WebAssembly.Instance) {
    this.memory = memory;
    this.instance = instance;
  }
  
  // Allocate string in WASM memory
  allocateString(str: string): number {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    const ptr = (this.instance.exports as any).malloc(bytes.length);
    const memoryView = new Uint8Array(this.memory.buffer, ptr, bytes.length);
    memoryView.set(bytes);
    return ptr;
  }
  
  // Read string from WASM memory
  readString(ptr: number, len: number): string {
    const bytes = new Uint8Array(this.memory.buffer, ptr, len);
    return new TextDecoder().decode(bytes);
  }
  
  // Free allocated memory
  free(ptr: number): void {
    (this.instance.exports as any).free(ptr);
  }
}

// Example: Table for function references
async function useWasmTable() {
  const table = new WebAssembly.Table({
    element: "anyfunc",
    initial: 10,
    maximum: 100,
  });
  
  // Store JavaScript function in table
  function jsCallback(x: number): number {
    return x * 2;
  }
  
  table.set(0, jsCallback);
  
  // Pass table to WASM module
  const instance = await WebAssembly.instantiate(wasmModule, {
    js: { table },
  });
  
  // WASM can call function via table index
  const result = (instance.exports as any).callViaTable(0, 5); // Calls jsCallback(5)
}

// Example: Shared memory (Web Workers)
if (typeof SharedArrayBuffer !== "undefined") {
  const sharedMemory = new WebAssembly.Memory({
    initial: 256,
    maximum: 512,
    shared: true, // Shared between threads
  });
  
  // Share memory with worker
  const worker = new Worker("worker.js");
  worker.postMessage({ type: "memory", memory: sharedMemory });
}

// Example: Error handling
async function safeWasmLoad(url: string): Promise<WebAssembly.Instance | null> {
  try {
    const wasmModule = await WebAssembly.compileStreaming(fetch(url));
    const instance = await WebAssembly.instantiate(wasmModule);
    return instance;
  } catch (error) {
    if (error instanceof WebAssembly.CompileError) {
      console.error("WASM compilation failed:", error);
    } else if (error instanceof WebAssembly.LinkError) {
      console.error("WASM linking failed:", error);
    } else if (error instanceof WebAssembly.RuntimeError) {
      console.error("WASM runtime error:", error);
    } else {
      console.error("Unknown WASM error:", error);
    }
    return null;
  }
}

// Example: Type generation from WASM (using tools like wasm-bindgen)
// Generated types from Rust wasm-bindgen:
interface WasmBindgenExports {
  greet(name: string): void;
  add(a: number, b: number): number;
  process_data(data: Uint8Array): Uint8Array;
}

// Example: Node.js WASM support
import * as fs from "fs";

async function loadWasmInNode() {
  const wasmBuffer = fs.readFileSync("module.wasm");
  const wasmModule = await WebAssembly.compile(wasmBuffer);
  const instance = await WebAssembly.instantiate(wasmModule);
  return instance;
}
```

**Type Generation Tools:**

1. **wasm-bindgen** (Rust): Generates TypeScript types from Rust WASM modules
2. **embind** (Emscripten): Generates TypeScript bindings from C/C++
3. **wasm-pack**: Rust toolchain for WASM + TypeScript integration

**Best Practices:**

1. **Type Safety**: Always define interfaces for WASM exports
2. **Memory Management**: Properly allocate and free WASM memory
3. **Error Handling**: Handle CompileError, LinkError, RuntimeError
4. **Performance**: Use WASM for CPU-intensive operations
5. **Bundle Size**: Consider WASM file size impact on bundle

**Pitfalls & Warnings:**

❌ **Missing type definitions:**

```typescript
// ❌ INCORRECT: No type safety
const instance = await WebAssembly.instantiate(module);
const result = instance.exports.add(1, 2); // any type
```

✅ **Correct: Type-safe exports:**

```typescript
// ✅ CORRECT: Define export types
interface WasmExports {
  add(a: number, b: number): number;
}

const instance = await WebAssembly.instantiate(module) as WebAssembly.Instance & {
  exports: WasmExports;
};
const result = instance.exports.add(1, 2); // number type
```

❌ **Memory leaks:**

```typescript
// ❌ INCORRECT: Memory not freed
const ptr = instance.exports.allocateString("hello");
// Memory leak: never freed
```

✅ **Correct: Proper cleanup:**

```typescript
// ✅ CORRECT: Free allocated memory
const ptr = instance.exports.allocateString("hello");
try {
  // Use memory
  const result = instance.exports.process(ptr);
} finally {
  instance.exports.free(ptr);
}
```

### 34.2 Native Modules

TypeScript with native modules:

- C++ bindings
- Python interop
- Go interop

### 34.3 Embedding TypeScript Runtime

**Embedding TypeScript**: Running TypeScript in custom environments.

#### 31.3.1 TypeScript Compiler API

**Compiler API**: Programmatic access to TypeScript compiler.

Example:

```typescript
import * as ts from "typescript";

const source = "const x: number = 42;";
const result = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
});

console.log(result.outputText); // var x = 42;
```

#### 31.3.2 Custom Runtime

**Custom Runtime**: Embed TypeScript in non-Node.js environments.

Example:

```typescript
// Custom TypeScript runtime
class TypeScriptRuntime {
  private compiler: typeof ts;
  
  constructor() {
    this.compiler = require("typescript");
  }
  
  execute(code: string): any {
    const result = this.compiler.transpileModule(code, {
      compilerOptions: { target: ts.ScriptTarget.ES2022 },
    });
    
    // Execute in sandbox
    return this.runInSandbox(result.outputText);
  }
  
  private runInSandbox(code: string): any {
    // Sandbox execution (simplified)
    return eval(code);
  }
}
```

#### 31.3.3 Embedded Use Cases

**Use Cases:**
- Plugin systems
- User scripts
- Configuration files
- DSL (Domain-Specific Languages)
- Code generation tools

**Security Considerations:**
- Sandbox execution
- Resource limits
- Permission checks
- Input validation

---


<!-- SSM:CHUNK_BOUNDARY id="ch34-end" -->
