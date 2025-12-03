<!-- SSM:CHUNK_BOUNDARY id="ch15-start" -->
📘 CHAPTER 15 — TOOLING 🔴 Advanced

> **Quick Answer:** Always enable `"strict": true`. Use `"moduleResolution": "bundler"` for web, `"node16"` for Node.js. ESLint with `@typescript-eslint/parser` for linting. Prettier for formatting.

### 15.1 tsconfig.json

Best practices for `tsconfig.json`:

**Complete Strict Configuration:**

```json
{
  "compilerOptions": {
    // Type Checking (Strict)
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    
    // Additional Type Checking
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false,
    
    // Modules
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true, // Required by transpiler-based builds (esbuild, SWC, ts-node)
    
    // Isolated Declarations (TypeScript 5.5+)
    "declaration": true,
    "declarationMap": true,
    
    // Emit
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "removeComments": false,
    "importHelpers": true,
    
    // Interop Constraints
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    
    // Language and Environment
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    
    // Completeness
    "skipDefaultLibCheck": false
  }
}
```

**Module Resolution Options:**

- `"moduleResolution": "node"` - Node.js resolution (CommonJS/ESM)
- `"moduleResolution": "bundler"` - Modern bundler resolution (Vite, esbuild, Webpack 5+)
- `"moduleResolution": "classic"` - Legacy TypeScript resolution (deprecated)
- `"moduleResolution": "node16"` or `"nodenext"` - Node.js ESM resolution (Node 16+)

### 15.2 ESLint

Use ESLint with TypeScript:

- `@typescript-eslint/eslint-plugin` for TypeScript-specific rules
- `@typescript-eslint/parser` for parsing TypeScript
- Configure rules to enforce type safety

### 15.3 IDE Integrations

TypeScript provides excellent IDE support through the Language Server Protocol (LSP).

#### 15.3.1 Language Server Protocol (LSP)

**tsserver**: TypeScript's language server implementation.

**Features:**
- Code completion (IntelliSense)
- Go to definition
- Find references
- Rename symbol
- Quick fixes
- Error diagnostics

**LSP Protocol:**
- Standardized protocol for language servers
- Works with any LSP-compatible editor
- VS Code, Vim, Emacs, Sublime Text support

#### 15.3.2 Autocomplete & IntelliSense

**IntelliSense**: Intelligent code completion.

Example:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

const user: User = {
  // IDE suggests: id, name, email
  // IDE shows types for each property
  // IDE validates required properties
};
```

**Trigger Characters:**
- `.` (property access)
- `(` (function call)
- `[` (array access)
- `{` (object literal)

#### 15.3.3 Go to Definition

**Go to Definition**: Navigate to symbol definition.

- **F12** (VS Code): Go to definition
- **Ctrl+Click**: Go to definition
- **Peek Definition**: Show definition inline

**Works for:**
- Functions, classes, interfaces
- Type definitions
- Imported symbols
- Variables and constants

#### 15.3.4 Find References

**Find References**: Find all usages of a symbol.

- **Shift+F12** (VS Code): Find all references
- Shows all locations where symbol is used
- Updates in real-time as code changes

#### 15.3.5 Rename Symbol

**Rename Symbol**: Rename symbol across entire codebase.

- **F2** (VS Code): Rename symbol
- Type-safe renaming
- Updates all references automatically
- Previews changes before applying

#### 15.3.6 Quick Fixes

**Quick Fixes**: Automatic code fixes.

- **Ctrl+.** (VS Code): Show quick fixes
- Add missing imports
- Fix type errors
- Add missing properties
- Remove unused code

#### 15.3.7 Error Diagnostics

**Error Diagnostics**: Real-time error reporting.

- Red squiggles for errors
- Yellow squiggles for warnings
- Hover for error details
- Problems panel for all errors

#### 15.3.8 Formatting

**Formatting**: Automatic code formatting.

- **Shift+Alt+F** (VS Code): Format document
- Uses Prettier or built-in formatter
- Format on save (configurable)
- Respects `.prettierrc` or `tsconfig.json` formatting options

#### 15.3.9 Refactoring

**Refactoring**: Code transformation tools.

- Extract function
- Extract variable
- Inline variable
- Move to new file
- Convert to async/await

#### 15.3.10 Code Navigation

**Code Navigation**: Navigate codebase efficiently.

- **Ctrl+P**: Quick file open
- **Ctrl+Shift+O**: Go to symbol in file
- **Ctrl+T**: Go to symbol in workspace
- **Ctrl+Shift+F**: Search in files

---


<!-- SSM:CHUNK_BOUNDARY id="ch15-end" -->
