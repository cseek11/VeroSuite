<!-- SSM:CHUNK_BOUNDARY id="ch32-start" -->
📘 CHAPTER 32 — DECLARATION FILES 🔴 Advanced

> **Quick Answer:** Use `declare module "name"` for ambient declarations. Generate with `tsc --declaration`. Use `@types/package` from DefinitelyTyped when available. Module augmentation extends existing types.

### 32.1 Writing .d.ts Files

Create declaration files for JavaScript libraries:

Example:

```typescript
// types/my-lib.d.ts
declare module "my-lib" {
  export function add(a: number, b: number): number;
  export interface Config {
    apiUrl: string;
  }
}
```

### 32.2 Module Augmentation

Augment existing module types:

Example:

```typescript
declare module "lodash" {
  interface LoDashStatic {
    custom(): this;
  }
}
```

---


<!-- SSM:CHUNK_BOUNDARY id="ch32-end" -->
