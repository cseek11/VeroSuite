<!-- SSM:CHUNK_BOUNDARY id="ch21-start" -->
📘 CHAPTER 21 — THIRD-PARTY TYPE LIBRARIES 🔴 Advanced

**Third-Party Type Definitions**: Community-maintained type definitions for JavaScript libraries.

### 21.1 @types/* Packages

**@types Packages**: TypeScript type definitions published on npm under the `@types` scope.

**Installation:**

```bash
# Install type definitions for a library
npm install --save-dev @types/lodash
npm install --save-dev @types/react
npm install --save-dev @types/node
```

**Automatic Resolution:**

TypeScript automatically resolves `@types/*` packages when:
- The library doesn't include its own type definitions
- The `@types/*` package name matches the library name

Example:

```typescript
// If you install 'lodash', TypeScript looks for '@types/lodash'
import _ from "lodash";
// TypeScript automatically uses types from @types/lodash

// If you install 'react', TypeScript looks for '@types/react'
import React from "react";
// TypeScript automatically uses types from @types/react
```

**Package.json Types Field:**

Libraries can include their own types:

```json
{
  "name": "my-library",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

TypeScript checks in this order:
1. `types` or `typings` field in `package.json`
2. `@types/<package-name>` package
3. `index.d.ts` in package root

### 21.2 DefinitelyTyped

**DefinitelyTyped**: The repository that hosts community-maintained type definitions.

**Repository:** https://github.com/DefinitelyTyped/DefinitelyTyped

**Structure:**

```
DefinitelyTyped/
├── types/
│   ├── lodash/
│   │   ├── index.d.ts
│   │   ├── tsconfig.json
│   │   └── lodash-tests.ts
│   ├── react/
│   │   ├── index.d.ts
│   │   ├── tsconfig.json
│   │   └── react-tests.tsx
│   └── ...
```

**Contributing to DefinitelyTyped:**

1. **Fork the repository**
2. **Create a new type definition:**

```typescript
// types/my-library/index.d.ts
declare module "my-library" {
  export function doSomething(input: string): number;
  export interface Config {
    apiUrl: string;
  }
}
```

3. **Create test file:**

```typescript
// types/my-library/my-library-tests.ts
import { doSomething, Config } from "my-library";

doSomething("test"); // Should return number
const config: Config = { apiUrl: "https://api.example.com" };
```

4. **Create tsconfig.json:**

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "lib": ["es6"],
    "noImplicitAny": true,
    "strictNullChecks": true
  },
  "files": ["index.d.ts", "my-library-tests.ts"]
}
```

5. **Submit a PR** to DefinitelyTyped

**Type Definition Requirements:**

- Must pass `tsc --noEmit` (no type errors)
- Must have test file demonstrating usage
- Must follow DefinitelyTyped conventions
- Must include JSDoc comments for public APIs

### 21.3 Creating Declaration Files

**Local Declaration Files:**

Create `.d.ts` files in your project:

```typescript
// types/custom-module.d.ts
declare module "custom-module" {
  export function process(data: string): number;
  export interface Options {
    verbose?: boolean;
  }
}
```

**Global Declaration Files:**

```typescript
// types/global.d.ts
declare global {
  interface Window {
    myCustomProperty: string;
  }
}

export {}; // Make this a module
```

**Module Augmentation:**

```typescript
// types/lodash-custom.d.ts
import * as _ from "lodash";

declare module "lodash" {
  interface LoDashStatic {
    customMethod(): string;
  }
}
```

### 21.4 Type Declaration Versioning

**Version Alignment:**

`@types/*` packages should match library versions:

```bash
# Library version: 4.17.21
# @types package: @types/lodash@4.14.x (covers 4.x)
npm install lodash@4.17.21
npm install --save-dev @types/lodash@4.14.202
```

**Versioning Strategy:**

- `@types/lodash@4.14.x` covers all `lodash@4.x` versions
- Major version changes require new `@types` package
- Minor/patch versions share the same `@types` package

**Checking Type Versions:**

```bash
# Check installed @types version
npm list @types/lodash

# Check available versions
npm view @types/lodash versions
```

**Best Practices:**

1. **Keep types in sync** with library versions
2. **Use exact versions** in `package.json` for stability
3. **Check for breaking changes** when updating `@types` packages
4. **Contribute fixes** to DefinitelyTyped if types are incorrect

### 21.5 Type-Only Packages

**Type-Only Packages**: Packages that only provide types, no runtime code.

Example:

```json
{
  "name": "@my-org/types",
  "version": "1.0.0",
  "types": "./index.d.ts",
  "main": "./index.d.ts",
  "files": ["*.d.ts"]
}
```

**Usage:**

```typescript
// Install type-only package
// npm install --save-dev @my-org/types

import type { User, Config } from "@my-org/types";
```

**Benefits:**

- Share types across multiple projects
- Version types independently
- No runtime overhead
- Better tree-shaking

**Pitfalls & Warnings:**

❌ **Missing @types package:**

```typescript
// ❌ INCORRECT: Library has no types
import _ from "lodash"; // Error: Could not find a declaration file
```

✅ **Correct: Install @types:**

```bash
npm install --save-dev @types/lodash
```

❌ **Version mismatch:**

```bash
# ❌ INCORRECT: Types don't match library version
npm install lodash@5.0.0
npm install --save-dev @types/lodash@4.14.202
```

✅ **Correct: Match versions:**

```bash
# ✅ CORRECT: Types match library version
npm install lodash@4.17.21
npm install --save-dev @types/lodash@4.14.202
```

---


<!-- SSM:CHUNK_BOUNDARY id="ch21-end" -->
