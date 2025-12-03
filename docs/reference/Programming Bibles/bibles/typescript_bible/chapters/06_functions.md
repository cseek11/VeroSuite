<!-- SSM:CHUNK_BOUNDARY id="ch6-start" -->
📘 CHAPTER 6 — FUNCTIONS 🟡 Intermediate

> **Quick Answer:** Use arrow functions for callbacks, named functions for hoisting. Prefer `unknown` over `any` for input types. Use `never` for functions that don't return. Overloads define multiple signatures; implementation handles all cases.

### 6.1 Function Types

Function types describe the signature of functions:

Example:

```typescript
// Function type annotation
type Add = (a: number, b: number) => number;

// Function implementation
const add: Add = (a, b) => a + b;
```

### 6.2 Optional and Rest Parameters

Functions can have optional and rest parameters:

Example:

```typescript
function greet(name: string, title?: string, ...others: string[]): string {
  const fullName = title ? `${title} ${name}` : name;
  return `Hello, ${fullName}${others.length > 0 ? ` and ${others.join(", ")}` : ""}`;
}
```

**Tuple Labels (TS 4.0+):**

Tuple elements can be labeled for better readability and documentation:

```typescript
// Unlabeled tuple (less readable)
type Point = [number, number];
const point: Point = [10, 20];
// What does point[0] represent? x or y?

// Labeled tuple (more readable)
type LabeledPoint = [x: number, y: number];
const labeledPoint: LabeledPoint = [10, 20];
// Clear: first element is x, second is y

// Labeled tuple in function parameters
function createPoint(x: number, y: number): [x: number, y: number] {
  return [x, y];
}

// Labeled tuple with optional and rest elements
type Config = [
  host: string,
  port: number,
  ssl?: boolean,
  ...headers: string[]
];

function createConfig(...config: Config): void {
  const [host, port, ssl, ...headers] = config;
  console.log(`Connecting to ${host}:${port}${ssl ? " (SSL)" : ""}`);
  if (headers.length > 0) {
    console.log("Headers:", headers);
  }
}

createConfig("example.com", 443, true, "Authorization: Bearer token", "X-API-Key: key");
```

**Benefits of Tuple Labels:**
- Improved readability and self-documentation
- Better IDE autocomplete hints
- Clearer intent in function signatures
- Easier refactoring (labels help identify element positions)

**Note:** Labels are purely for documentation and type checking. They don't affect runtime behavior or allow named access (e.g., `point.x` is not valid).

### 6.3 Function Overloads

Function overloads provide multiple signatures for the same function:

Example:

```typescript
function pad(value: string): string;
function pad(value: number, length: number): string;
function pad(value: string | number, length?: number): string {
  if (typeof value === "string") {
    return value.padEnd(length ?? 0);
  } else {
    return value.toString().padStart(length!, "0");
  }
}
```

**Important**: Most specific signature should be last. Prefer unions + type guards over overloads when possible.

### 6.4 Generic Functions

Generic functions work with multiple types:

Example:

```typescript
function identity<T>(arg: T): T {
  return arg;
}

// Type inference
const str = identity("hello"); // string

// Explicit type
const num = identity<number>(42); // number
```

**Production Failure: Generic Constraint Slip**

An AI-generated generic validator function `validate<T>(data: T): T` (no constraint) allowed passing non-objects, causing production crashes when it assumed `data.prop`. A constraint like `T extends object` fixed it, but not before 20% of API calls failed. Developers now lint for `extends` in generics.

**Lesson**: Always compile-test AI generics; they skip edge cases. Always add constraints: `T extends object`.

### 6.5 Const Generics (TS 5.0+)

Const generics preserve literal types by inferring `as const` behavior:

**Basic Usage:**

Example:

```typescript
function makeArray<const T extends readonly string[]>(...items: T): T {
  return items;
}

const arr = makeArray("a", "b"); // readonly ["a", "b"]
```

**Real-World Example: React useState Pattern:**

```typescript
// More examples needed for const type parameters
declare function useState<const T>(
  initialValue: T
): [T, (value: T) => void];

const [state] = useState({ count: 0 }); 
// type: { readonly count: 0 }, not { count: number }

// Without const:
declare function useStateWithoutConst<T>(
  initialValue: T
): [T, (value: T) => void];

const [state2] = useStateWithoutConst({ count: 0 });
// type: { count: number } (widened)
```

**When to Use Const Generics:**

- Preserve literal types in function parameters
- Create type-safe configuration objects
- Maintain exact tuple types
- Prevent type widening in generic functions

**Limitations:**

- Only works with `extends` constraints
- Requires TypeScript 5.0+
- May cause type inference issues with complex types

### 6.6 Call Semantics

Understanding how function calls work in TypeScript/JavaScript:

#### 6.6.1 By-Value Semantics

**Primitive types** are passed by value (a copy is made):

Example:

```typescript
function increment(n: number): number {
  n = n + 1;  // Modifies local copy
  return n;
}

let x = 5;
let result = increment(x);
console.log(x);      // 5 (unchanged)
console.log(result); // 6
```

#### 6.6.2 By-Reference Semantics

**Object types** are passed by reference (reference is copied, object is shared):

Example:

```typescript
function modify(obj: { value: number }): void {
  obj.value = 100;  // Modifies shared object
}

let myObj = { value: 5 };
modify(myObj);
console.log(myObj.value); // 100 (changed!)
```

#### 6.6.3 By-Sharing (JavaScript's Model)

JavaScript/TypeScript uses **"call by sharing"** (also called "call by object reference"):

- Primitive values are copied
- Object references are copied (but point to same object)
- Reassigning parameter doesn't affect caller
- Modifying object properties affects caller

Example:

```typescript
function reassign(obj: { value: number }): void {
  obj = { value: 999 };  // Reassigns local parameter
  // Caller's object unchanged
}

function mutate(obj: { value: number }): void {
  obj.value = 999;  // Mutates shared object
  // Caller's object changed
}

let myObj = { value: 5 };
reassign(myObj);
console.log(myObj.value); // 5 (unchanged)

mutate(myObj);
console.log(myObj.value); // 999 (changed)
```

#### 6.6.4 Immutability Patterns

To prevent accidental mutations, use immutability patterns:

Example:

```typescript
// ❌ Invalid: readonly is not a valid parameter modifier
function bad(readonly obj: { value: number }): void {
  // Syntax error: 'readonly' modifier can only appear on a property declaration
}

// ✅ Valid: Use Readonly<T> utility type instead
function process(obj: Readonly<{ value: number }>): void {
  // obj.value = 100; // ❌ Error: Cannot assign to readonly property
}

// Deep readonly
type DeepReadonly<T> = T extends object ? { readonly [P in keyof T]: DeepReadonly<T[P]> } : T;

function processDeep(obj: DeepReadonly<{ nested: { value: number } }>): void {
  // obj.nested.value = 100; // ❌ Error: Cannot assign to readonly property
}
```

**Note**: `readonly` is not a valid parameter modifier in TypeScript. Parameters are always mutable references (call-by-sharing). Use `Readonly<T>` utility type to prevent accidental mutations:

```typescript
// Parameters are call-by-sharing - object references are copied
// Use Readonly<T> utility type, not readonly modifier
function process(obj: Readonly<{ value: number }>): void {
  // obj.value = 100; // Error: readonly
  // obj = { value: 200 }; // OK: reassigning parameter doesn't affect caller
}
```

**Key Point**: TypeScript parameters use "call-by-sharing" semantics:
- Primitive values are copied (by value)
- Object references are copied (by reference to the same object)
- Reassigning the parameter variable doesn't affect the caller
- Modifying object properties affects the caller
- `Readonly<T>` prevents property mutations but doesn't prevent parameter reassignment

---


<!-- SSM:CHUNK_BOUNDARY id="ch6-end" -->
