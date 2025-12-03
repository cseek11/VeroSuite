<!-- SSM:CHUNK_BOUNDARY id="ch12-start" -->
📘 CHAPTER 12 — PERFORMANCE ENGINEERING 🔴 Advanced

> **Quick Answer:** Limit recursive type depth, use branded strings over template literals for paths, prefer `skipLibCheck` in development. Profile with `tsc --extendedDiagnostics`. Watch for exponential unions.

### 12.1 Type System Performance

Type checking performance considerations:

- Deep recursive types can slow compilation
- Large unions can impact inference
- Mapped types on large objects can be expensive
- Template literal types with unbounded strings can explode

### 12.2 Optimization Patterns

Optimize type system performance:

- Limit recursion depth in recursive types
- Use bounded template literal types
- Prefer unions over large mapped types
- Cache expensive type computations

**Performance Tuning: Route Explosion in Next.js App**

An AI agent was tasked with typed routes: `type Path = \`/${string}\`;`. It hallucinated a massive union of every possible path (e.g., `/a/b/c/...`), bloating types and crashing VS Code. Production builds timed out in CI. Developers simplified to branded strings, but AI kept "improving" it with unnecessary expansions.

**Fix**: Use branded strings instead of template literal types for unbounded paths:

```typescript
// ❌ Wrong: Explodes compiler
type Path = `/${string}`;

// ✅ Correct: Bounded and performant
type Path = string & { __path: never };
```

**Performance Tuning: Enum Bundle Bloat**

An AI-suggested refactor replaced union types with string enums for UI states (`"loading" | "error"`), assuring the team it was "zero-runtime." In production, the app's bundle swelled 15% from enum reverse mappings, tanking load times on low-end devices. The fix: Revert to `as const` objects.

**Fix**: Use `as const` objects instead of enums:

```typescript
// ❌ Wrong: Runtime bloat
enum State {
  Loading = "loading",
  Error = "error",
}

// ✅ Correct: Zero runtime cost
const State = {
  Loading: "loading",
  Error: "error",
} as const;
type State = typeof State[keyof typeof State];
```

**Performance Tuning: DeepReadonly Circular Type Explosion**

Standard `DeepReadonly<T>` causes "type is referenced directly or indirectly in its own base constraint" on circular types. Production type-checks OOM'd in VS Code.

**Fix**: Add function guard and array handling to break circularity:

```typescript
// ✅ Correct: Function guard prevents infinite recursion, array handling preserves array types
type DeepReadonly<T> = 
  T extends (...args: any[]) => any ? T : // Functions are unchanged
  T extends readonly any[] ? readonly [...{ [K in keyof T]: DeepReadonly<T[K]> }] : // Arrays
  T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : // Objects
  T; // Primitives

// Test cases
type Test1 = DeepReadonly<number[]>; // readonly [...{ [K in keyof number[]]: DeepReadonly<number> }]
type Test2 = DeepReadonly<{ items: string[] }>; // { readonly items: readonly string[] }
type Test3 = DeepReadonly<{ nested: { value: number } }>; // { readonly nested: { readonly value: number } }
```

**Performance Tuning: Infinite Infer in API Client**

An AI's conditional for unwrapping `Promise<infer T>` looped on non-promises, crashing VS Code. Production type-checks timed out in monorepo CI (hours). Simplified to `Awaited<T>`.

**Fix**: Use built-in `Awaited<T>` instead of custom recursive unwrap:

```typescript
// ❌ Wrong: Infinite recursion
type Unwrap<T> = T extends Promise<infer U> ? Unwrap<U> : T;

// ✅ Correct: Use built-in utility
type Unwrap<T> = Awaited<T>;
```

**Performance Tuning: Type Check Timeout in Monorepo**

A 400k-line monorepo had type-check times exceeding 10 minutes. Investigation revealed:
- Deep recursive types without guards
- Unbounded template literal types
- Large unions (50+ members)

**Fix**: 
1. Added function guards to recursive types
2. Replaced unbounded template literals with branded strings
3. Split large unions into smaller, manageable pieces
4. Enabled incremental compilation (`tsc --build`)

Result: Type-check time reduced from 10+ minutes to 2 minutes.

### 12.2.1 Advanced Recursion Patterns

Advanced recursive types enable powerful type-level programming but require careful handling to avoid performance issues and circular type errors.

#### Flatten (Array Flattening)

Flatten nested arrays to a specified depth:

```typescript
// Flatten array to specified depth
type Flatten<T, Depth extends number = 1> = 
  Depth extends 0 ? T :
  T extends readonly (infer U)[] ?
    U extends readonly any[] ?
      [...Flatten<U, Prev<Depth>>] :
      [U] :
    T extends readonly any[] ?
      T :
      never;

// Helper: Decrement number type
type Prev<N extends number> = 
  N extends 0 ? 0 :
  N extends 1 ? 0 :
  N extends 2 ? 1 :
  N extends 3 ? 2 :
  N extends 4 ? 3 :
  N extends 5 ? 4 :
  N extends 6 ? 5 :
  N extends 7 ? 6 :
  N extends 8 ? 7 :
  N extends 9 ? 8 :
  N extends 10 ? 9 :
  never;

// Usage
type Test1 = Flatten<number[][], 1>; // number[]
type Test2 = Flatten<number[][][], 2>; // number[]
type Test3 = Flatten<[1, [2, [3]]], 1>; // [1, 2, [3]]
type Test4 = Flatten<[1, [2, [3]]], 2>; // [1, 2, 3]
```

**Performance Note**: Limit depth to reasonable values (≤10) to avoid excessive recursion.

#### DeepMerge (Deep Object Merging)

Merge two objects deeply, with the second object taking precedence:

```typescript
// Deep merge two objects
type DeepMerge<T, U> = 
  // If U is a function, use it
  U extends (...args: any[]) => any ? U :
  // If U is an array, use it (arrays are not merged)
  U extends readonly any[] ? U :
  // If both are objects, merge recursively
  T extends object ? U extends object ? {
    [K in keyof T | keyof U]: 
      K extends keyof U ? 
        K extends keyof T ? DeepMerge<T[K], U[K]> : U[K] :
        K extends keyof T ? T[K] : never
  } : U : U :
  // Otherwise use U
  U;

// Usage
type Merged = DeepMerge<
  { a: { b: 1; c: 2 }; d: 3 },
  { a: { b: 10 }; e: 4 }
>;
// Result: { a: { b: 10; c: 2 }; d: 3; e: 4 }
```

#### DeepPick (Pick Nested Properties)

Pick nested properties from an object using dot-notation paths:

```typescript
// Split path string into array
type SplitPath<S extends string> = 
  S extends `${infer Head}.${infer Tail}` 
    ? [Head, ...SplitPath<Tail>] 
    : [S];

// Get nested property type
type GetNested<T, Path extends readonly string[]> = 
  Path extends readonly [infer Head, ...infer Tail] ?
    Head extends keyof T ?
      Tail extends readonly string[] ?
        T[Head] extends object ?
          GetNested<T[Head], Tail> :
          never :
        T[Head] :
      never :
    never :
  T;

// Deep pick by path
type DeepPick<T, Path extends string> = 
  GetNested<T, SplitPath<Path>>;

// Usage
type User = {
  id: string;
  profile: {
    name: string;
    email: string;
    address: {
      street: string;
      city: string;
    };
  };
};

type UserName = DeepPick<User, "profile.name">; // string
type UserCity = DeepPick<User, "profile.address.city">; // string
```

#### DeepOmit (Omit Nested Properties)

Omit nested properties from an object:

```typescript
// Omit nested property
type DeepOmit<T, Path extends string> = 
  Path extends `${infer Head}.${infer Tail}` ?
    Head extends keyof T ?
      T[Head] extends object ?
        { [K in keyof T]: K extends Head ? DeepOmit<T[K], Tail> : T[K] } :
        Omit<T, Head> :
      T :
    T extends object ?
      Omit<T, Path & keyof T> :
      T;

// Usage
type UserWithoutEmail = DeepOmit<User, "profile.email">;
// Result: { id: string; profile: { name: string; address: { ... } } }
```

#### Recursive Type Guards

Handle circular references in recursive types:

```typescript
// Type guard for circular types
type CircularGuard<T> = T extends object 
  ? T & { __circular?: never } 
  : T;

// Example: Linked list with circular guard
type ListNode<T> = {
  value: T;
  next: ListNode<T> | null;
} & { __circular?: never };

// Usage
const node: ListNode<number> = {
  value: 1,
  next: {
    value: 2,
    next: null,
  },
};
```

#### Bounded Recursion with Depth Counter

Limit recursion depth to prevent infinite types:

```typescript
// Recursion depth counter
type RecursionDepth = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Deep transform with depth limit
type DeepTransform<T, F, Depth extends number = 5> = 
  Depth extends RecursionDepth[number] ?
    T extends readonly any[] ?
      { [K in keyof T]: DeepTransform<T[K], F, Depth extends 0 ? 0 : Depth extends 1 ? 0 : Depth extends 2 ? 1 : Depth extends 3 ? 2 : Depth extends 4 ? 3 : 4> } :
      T extends object ?
        { [K in keyof T]: DeepTransform<T[K], F, Depth extends 0 ? 0 : Depth extends 1 ? 0 : Depth extends 2 ? 1 : Depth extends 3 ? 2 : Depth extends 4 ? 3 : 4> } :
        F :
      T;

// Usage: Transform all string properties to uppercase (type-level)
type UpperCaseStrings<T> = DeepTransform<T, Uppercase<string>>;
```

#### Pattern: Recursive Union Distribution

Handle unions in recursive types correctly:

```typescript
// Correct: Non-distributive union handling
type DeepPartial<T> = 
  [T] extends [any] ? // Non-distributive check
    T extends readonly any[] ?
      T extends readonly (infer U)[] ? DeepPartial<U>[] : T :
      T extends object ?
        { [K in keyof T]?: DeepPartial<T[K]> } :
        T :
    never;

// Usage
type PartialUser = DeepPartial<User | { role: string }>;
// Correctly handles union without distributing
```

**Best Practices for Advanced Recursion:**

1. **Always add function guards** to prevent infinite recursion on function types
2. **Limit recursion depth** using depth counters or bounded recursion
3. **Use non-distributive checks** (`[T] extends [U]`) when handling unions
4. **Add array handling** explicitly for array types
5. **Test with circular references** to ensure guards work correctly
6. **Monitor type-check performance** - if types become slow, simplify recursion

### 12.3 SIMD Limitations

**Note**: TypeScript/JavaScript does not have native SIMD (Single Instruction, Multiple Data) support like languages such as Rust or C++.

**Alternatives:**

1. **WebAssembly**: Use WASM for SIMD operations (browser support)

Example:

```typescript
// Compile Rust/C++ with SIMD to WASM
// Then use from TypeScript
import { simdAdd } from "./simd.wasm";

const result = simdAdd(array1, array2);
```

2. **Typed Arrays**: Use typed arrays for vectorized operations

Example:

```typescript
// Typed arrays are optimized by engines
const a = new Float32Array([1, 2, 3]);
const b = new Float32Array([4, 5, 6]);
const result = new Float32Array(3);

// Manual vectorization (not true SIMD, but optimized)
for (let i = 0; i < 3; i++) {
  result[i] = a[i] + b[i];
}
```

3. **Native Modules**: Use native Node.js addons for SIMD (Node.js only)

**Performance Considerations:**
- For heavy numeric computation, consider WebAssembly or native modules
- JavaScript engines optimize typed array operations
- True SIMD requires WebAssembly or native code

---


<!-- SSM:CHUNK_BOUNDARY id="ch12-end" -->
