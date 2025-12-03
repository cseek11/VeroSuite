<!-- SSM:CHUNK_BOUNDARY id="ch10-start" -->
📘 CHAPTER 10 — ERROR HANDLING 🟡 Intermediate

> **Quick Answer:** Use `Result<T, E>` discriminated unions for recoverable errors, custom error classes extending `Error` for exceptional cases. Always narrow `unknown` with `instanceof`. Prefer explicit error types over `any` in catch blocks.

### 10.1 Typed Errors

Use discriminated unions for typed errors:

Example:

```typescript
type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return { success: false, error: "Division by zero" };
  }
  return { success: true, data: a / b };
}
```

### 10.2 Error Patterns

Common error handling patterns:

- **Result types**: Explicit success/error handling
- **Option types**: Handling null/undefined
- **Exception handling**: Try/catch with typed errors

**Production Failure: Phantom Type Guard in Authentication**

An AI "wrote" a user guard `if (isUser(obj)) { obj.email }` but omitted the predicate `obj is User`. Production auth bypassed checks, exposing PII. Real guard: `function isUser(x: unknown): x is User { ... }`.

**Lesson**: Never trust AI guards untested—runtime narrowing fails silently. Always verify type guard predicates.

**Production Failure: Non-Null Bang in Async Hooks**

In a React hook, AI suggested `data!.map(...)` assuming fetch success, but intermittent nulls crashed production renders (50% error rate). Replaced with optional chaining `data?.map(...)`.

**Lesson**: AIs dismiss async nulls—enforce ESLint no-bang rules. Always handle async null/undefined cases.

### 10.3 Stack Traces & Debugging

Understanding stack traces and debugging techniques:

#### 10.3.1 Error.stack

**Error.stack**: String representation of the call stack.

Example:

```typescript
function a() {
  b();
}

function b() {
  c();
}

function c() {
  throw new Error("Something went wrong");
}

try {
  a();
} catch (error: unknown) {
  if (error instanceof Error) {
    console.log(error.stack);
    // Error: Something went wrong
    //     at c (file.ts:10:11)
    //     at b (file.ts:6:5)
    //     at a (file.ts:2:5)
  }
}
```

#### 10.3.2 Source Maps

**Source Maps**: Map compiled JavaScript back to TypeScript source.

**Configuration:**

```json
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```

**Benefits:**
- Stack traces show TypeScript file names and line numbers
- Debugger can step through TypeScript source
- Better error messages in production

### 10.4 Common TypeScript Errors and Resolutions

This section provides step-by-step solutions for the most common TypeScript errors developers encounter.

#### 10.4.1 Type Inference Issues

**Error: "Type 'X' is not assignable to type 'Y'"**

**Common Causes:**
- Type inference too narrow or too wide
- Missing type annotations
- Union type mismatches

**Resolution Steps:**

1. **Check inferred types:**
```typescript
// Add explicit type annotation to see what TypeScript infers
const value: typeof someVariable = someVariable;
// Hover over 'value' in IDE to see inferred type
```

2. **Use type assertions (when safe):**
```typescript
// If you're certain about the type
const value = someVariable as ExpectedType;
```

3. **Fix type definitions:**
```typescript
// Instead of:
function process(data: any) { ... }

// Use:
function process<T>(data: T): Processed<T> { ... }
```

**Error: "Property 'X' does not exist on type 'Y'"**

**Common Causes:**
- Missing property in type definition
- Property name typo
- Wrong type being used

**Resolution Steps:**

1. **Verify property exists:**
```typescript
// Check if property exists in type
type Keys = keyof MyType; // See all available keys
```

2. **Use optional chaining:**
```typescript
// If property might not exist
const value = obj?.property;
```

3. **Add property to type:**
```typescript
// Extend interface
interface MyType {
  newProperty: string; // Add missing property
}
```

#### 10.4.2 Module Resolution Errors

**Error: "Cannot find module 'X' or its type declarations"**

**Common Causes:**
- Missing `@types/X` package
- Incorrect `moduleResolution` setting
- Path alias not configured

**Resolution Steps:**

1. **Install type definitions:**
```bash
npm install --save-dev @types/node
npm install --save-dev @types/react
```

2. **Check moduleResolution in tsconfig.json:**
```json
{
  "compilerOptions": {
    "moduleResolution": "bundler", // or "node16"/"nodenext" for Node.js
    "resolveJsonModule": true
  }
}
```

3. **Configure path aliases:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"]
    }
  }
}
```

**Error: "Module 'X' has no exported member 'Y'"**

**Common Causes:**
- Member not exported from module
- Wrong import syntax
- Default vs named export confusion

**Resolution Steps:**

1. **Check export in source file:**
```typescript
// Ensure member is exported
export function myFunction() { ... }
export const myConstant = 123;
```

2. **Use correct import syntax:**
```typescript
// Named export
import { myFunction } from "./module";

// Default export
import myDefault from "./module";

// Mixed
import myDefault, { myFunction } from "./module";
```

3. **Re-export if needed:**
```typescript
// In index.ts
export { myFunction } from "./module";
```

#### 10.4.3 Configuration Problems

**Error: "Cannot use 'X' because it is a type, but it is being used as a value"**

**Common Causes:**
- Using type as value (runtime)
- Missing `import type` for type-only imports
- Incorrect `isolatedModules` configuration

**Resolution Steps:**

1. **Use `import type` for type-only imports:**
```typescript
// Type-only import
import type { User } from "./types";

// Value import
import { createUser } from "./api";
```

2. **Check `isolatedModules` setting:**
```json
{
  "compilerOptions": {
    "isolatedModules": true // Required for some bundlers
  }
}
```

3. **Separate type and value:**
```typescript
// If you need both type and value
import { User, createUser } from "./api";
// User is type, createUser is value
```

**Error: "Property 'X' is missing in type 'Y' but required in type 'Z'"**

**Common Causes:**
- Required property missing
- Partial type used where full type expected
- Optional property not marked as optional

**Resolution Steps:**

1. **Add missing property:**
```typescript
const obj: RequiredType = {
  existingProp: "value",
  missingProp: "value" // Add missing property
};
```

2. **Use Partial if appropriate:**
```typescript
function update(obj: Partial<RequiredType>) {
  // obj can have some properties missing
}
```

3. **Make property optional:**
```typescript
interface MyType {
  required: string;
  optional?: string; // Add ? to make optional
}
```

#### 10.4.4 Generic Type Errors

**Error: "Type parameter 'X' has a circular constraint"**

**Common Causes:**
- Recursive type without guard
- Circular type reference
- Infinite type expansion

**Resolution Steps:**

1. **Add function guard:**
```typescript
// ❌ Wrong: Infinite recursion
type DeepReadonly<T> = T extends object 
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> } 
  : T;

// ✅ Correct: Function guard prevents recursion
type DeepReadonly<T> = 
  T extends (...args: any[]) => any ? T :
  T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T;
```

2. **Limit recursion depth:**
```typescript
type DeepPartial<T, Depth extends number = 5> = 
  Depth extends 0 ? T :
  T extends object ? { [K in keyof T]?: DeepPartial<T[K], Prev<Depth>> } : T;
```

**Error: "Argument of type 'X' is not assignable to parameter of type 'Y'"**

**Common Causes:**
- Generic constraint violation
- Variance issues (contravariant/covariant)
- Type narrowing not working

**Resolution Steps:**

1. **Check generic constraints:**
```typescript
// Ensure argument satisfies constraint
function process<T extends string>(value: T) { ... }
// value must be string or string literal
```

2. **Use proper variance:**
```typescript
// For read-only operations (covariant)
type ReadOnly<T> = { readonly [K in keyof T]: T[K] };

// For write operations (contravariant)
type WriteOnly<T> = { [K in keyof T]: (value: T[K]) => void };
```

3. **Add type narrowing:**
```typescript
function process(value: string | number) {
  if (typeof value === "string") {
    // TypeScript knows value is string here
    value.toUpperCase();
  }
}
```

#### 10.4.5 Strict Mode Errors

**Error: "Object is possibly 'null' or 'undefined'"**

**Common Causes:**
- `strictNullChecks` enabled
- Property might be null/undefined
- Missing null check

**Resolution Steps:**

1. **Add null check:**
```typescript
if (obj !== null && obj !== undefined) {
  obj.property; // Safe to access
}
```

2. **Use optional chaining:**
```typescript
const value = obj?.property?.nested;
```

3. **Use non-null assertion (when certain):**
```typescript
const value = obj!.property; // Only if you're 100% sure obj is not null
```

**Error: "Type 'X' is not assignable to type 'Y'. Property 'Z' is missing"**

**Common Causes:**
- Missing required properties
- Type mismatch
- Partial type used incorrectly

**Resolution Steps:**

1. **Add all required properties:**
```typescript
const obj: RequiredType = {
  prop1: "value1",
  prop2: "value2", // Add all required props
};
```

2. **Use satisfies for exact matching:**
```typescript
const config = {
  apiUrl: "https://api.com",
  timeout: 5000,
} satisfies Config; // Ensures exact match
```

#### 10.4.6 Build and Compilation Errors

**Error: "File 'X.ts' is not a module"**

**Common Causes:**
- File has no imports/exports
- Incorrect file extension
- Missing module declaration

**Resolution Steps:**

1. **Add export to make it a module:**
```typescript
// Add at least one export
export const something = 123;
// Or
export {};
```

2. **Check file extension:**
```typescript
// Ensure file is .ts or .tsx (not .js)
```

**Error: "Cannot find name 'X'"**

**Common Causes:**
- Missing type definition
- Global not declared
- Wrong lib configuration

**Resolution Steps:**

1. **Install @types package:**
```bash
npm install --save-dev @types/node
```

2. **Add global declaration:**
```typescript
// In .d.ts file
declare global {
  const myGlobal: string;
}
```

3. **Check lib in tsconfig.json:**
```json
{
  "compilerOptions": {
    "lib": ["ES2022", "DOM"] // Include needed libraries
  }
}
```

#### 10.4.7 Quick Reference: Error Code Lookup

| Error Code | Error Message | Common Solution |
|------------|---------------|-----------------|
| TS2322 | Type 'X' is not assignable to type 'Y' | Check type compatibility, use type assertion if safe |
| TS2339 | Property 'X' does not exist on type 'Y' | Add property to type or use optional chaining |
| TS2307 | Cannot find module 'X' | Install package or @types/X, check moduleResolution |
| TS2304 | Cannot find name 'X' | Add type definition or declare global |
| TS2345 | Argument of type 'X' is not assignable | Check function signature, add type narrowing |
| TS2532 | Object is possibly 'undefined' | Add null check or use optional chaining |
| TS2589 | Type instantiation is excessively deep | Add recursion guard or limit depth |
| TS2741 | Property 'X' is missing in type 'Y' | Add missing property or use Partial<T> |

**Debugging Tips:**

1. **Enable verbose errors:**
```bash
tsc --pretty --listFiles
```

2. **Check type at specific location:**
```typescript
// Add this to see inferred type
type DebugType = typeof myVariable;
```

3. **Use TypeScript Playground:**
- Copy error code to [TypeScript Playground](https://www.typescriptlang.org/play)
- Isolate the issue
- Test solutions

#### 10.3.3 Error.captureStackTrace (Node.js)

**Error.captureStackTrace**: Customize stack traces.

Example:

```typescript
class CustomError extends Error {
  constructor(message: string) {
    super(message);
    Error.captureStackTrace(this, CustomError);
    this.name = "CustomError";
  }
}

function throwError() {
  throw new CustomError("Custom error");
}

try {
  throwError();
} catch (error) {
  console.log(error.stack);
}
```

#### 10.3.4 Debugging Techniques

**Console Debugging:**

```typescript
console.trace("Current stack trace");
console.log("Variable:", variable);
console.dir(object, { depth: null });
```

**Debugger Statement:**

```typescript
function debugFunction() {
  debugger; // Pauses execution if debugger attached
  // ... code
}
```

**Type-Safe Error Handling:**

```typescript
function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === "string") {
    return error;
  } else {
    return "Unknown error";
  }
}
```

---

<!-- SSM:PART id="part3" title="Part III: ADVANCED TOPICS" -->
# PART III — ADVANCED TOPICS


<!-- SSM:CHUNK_BOUNDARY id="ch10-end" -->
