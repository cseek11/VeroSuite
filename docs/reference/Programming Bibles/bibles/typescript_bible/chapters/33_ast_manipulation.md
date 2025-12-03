<!-- SSM:CHUNK_BOUNDARY id="ch33-start" -->
📘 CHAPTER 33 — AST MANIPULATION 🔴 Advanced

> **Quick Answer:** Use `ts-morph` for high-level AST manipulation, TypeScript Compiler API for low-level access. `ts.createSourceFile()` parses code, `ts.visitNode()` traverses. Custom transformers modify emit.

### 33.1 ts-morph

Use ts-morph for AST manipulation:

Example:

```typescript
import { Project } from "ts-morph";

const project = new Project();
const sourceFile = project.addSourceFileAtPath("file.ts");

// Manipulate AST
sourceFile.addClass({
  name: "MyClass",
  // ...
});
```

### 33.2 Compiler Plugins

**tsserver Plugins**: Extend TypeScript language service.

Example:

```typescript
// plugin.ts
import * as ts from "typescript";

function init(modules: { typescript: typeof ts }) {
  const ts = modules.typescript;
  
  return {
    create(info: ts.server.PluginCreateInfo) {
      // Custom language service features
      return info.languageService;
    },
  };
}

export = init;
```

**Usage:**

```json
{
  "compilerOptions": {
    "plugins": [
      { "name": "./plugin" }
    ]
  }
}
```

### 33.3 Reflection

**Runtime Reflection**: TypeScript types are erased, but you can use runtime reflection.

Example:

```typescript
// Runtime type information (limited)
function getTypeName(value: unknown): string {
  return typeof value;
}

// Decorators for metadata (experimental)
function Log(target: any, propertyKey: string) {
  console.log(`Property: ${propertyKey}`);
}

class MyClass {
  @Log
  myProperty: string = "value";
}
```

**Reflect Metadata (Legacy Experimental Decorators):**

```typescript
import "reflect-metadata";

// Note: This pattern uses legacy experimental decorators. TypeScript 5.0+ 
// supports standard TC39 decorators which handle metadata differently and 
// don't require the reflect-metadata polyfill.

// Enable experimental decorators and metadata
// tsconfig.json: { "compilerOptions": { "experimentalDecorators": true, "emitDecoratorMetadata": true } }

class MyClass {
  @Reflect.metadata("design:type", String)
  name: string = "John";
  
  @Reflect.metadata("design:paramtypes", [String, Number])
  method(param1: string, param2: number): void {
    // Method implementation
  }
}

// Retrieve metadata at runtime
const type = Reflect.getMetadata("design:type", MyClass.prototype, "name");
// type is String constructor

const paramTypes = Reflect.getMetadata("design:paramtypes", MyClass.prototype, "method");
// paramTypes is [String, Number]

// Custom metadata
@Reflect.metadata("controller", "/api/users")
class UserController {
  @Reflect.metadata("route", { method: "GET", path: "/:id" })
  getUser(id: string): User {
    // Implementation
  }
}

// Framework can read metadata for routing
const controllerMeta = Reflect.getMetadata("controller", UserController);
const routeMeta = Reflect.getMetadata("route", UserController.prototype, "getUser");
```

**TC39 Decorators (Stage 3) - Standard Decorators with Metadata:**

TypeScript 5.0+ supports standard TC39 decorators (Stage 3) which handle metadata differently from legacy experimental decorators.

**Complete API Reference:**

```typescript
// Standard decorator types (TC39 Stage 3)
type ClassDecorator = (value: Function, context: ClassDecoratorContext) => Function | void;
type ClassFieldDecorator = (value: undefined, context: ClassFieldDecoratorContext) => (initialValue: unknown) => unknown | void;
type ClassMethodDecorator = (value: Function, context: ClassMethodDecoratorContext) => Function | void;
type ClassGetterDecorator = (value: Function, context: ClassGetterDecoratorContext) => Function | void;
type ClassSetterDecorator = (value: Function, context: ClassSetterDecoratorContext) => Function | void;
type ClassAccessorDecorator = (value: ClassAccessorDecoratorResult<unknown, unknown>, context: ClassAccessorDecoratorContext) => ClassAccessorDecoratorResult<unknown, unknown> | void;

interface DecoratorContext {
  readonly kind: "class" | "method" | "getter" | "setter" | "field" | "accessor";
  readonly name: string | symbol;
  readonly metadata: DecoratorMetadata;
}

interface ClassDecoratorContext extends DecoratorContext {
  readonly kind: "class";
}

interface ClassMethodDecoratorContext extends DecoratorContext {
  readonly kind: "method";
  readonly static: boolean;
  readonly private: boolean;
  readonly access: { has(object: unknown): boolean; get(object: unknown): unknown };
}

interface ClassFieldDecoratorContext extends DecoratorContext {
  readonly kind: "field";
  readonly static: boolean;
  readonly private: boolean;
  readonly access: { has(object: unknown): boolean; get(object: unknown): unknown; set(object: unknown, value: unknown): void };
}

interface DecoratorMetadata {
  [key: string | symbol]: unknown;
}

// Example: Class decorator with metadata
function Controller(path: string) {
  return function (target: Function, context: ClassDecoratorContext) {
    // Add metadata to class
    context.metadata.controllerPath = path;
    return target;
  };
}

@Controller("/api/users")
class UserController {
  // Class implementation
}

// Example: Method decorator with metadata
function Route(method: string, path: string) {
  return function (value: Function, context: ClassMethodDecoratorContext) {
    // Add metadata to method
    context.metadata.route = { method, path };
    return value;
  };
}

class UserController {
  @Route("GET", "/:id")
  getUser(id: string): User {
    // Implementation
  }
  
  @Route("POST", "/")
  createUser(data: CreateUserDto): User {
    // Implementation
  }
}

// Example: Field decorator with validation
function Validate(min: number, max: number) {
  return function (value: undefined, context: ClassFieldDecoratorContext) {
    context.metadata.validation = { min, max };
    
    return function (initialValue: unknown) {
      if (typeof initialValue === "number") {
        if (initialValue < min || initialValue > max) {
          throw new Error(`Value must be between ${min} and ${max}`);
        }
      }
      return initialValue;
    };
  };
}

class User {
  @Validate(0, 120)
  age: number = 0;
  
  @Validate(1, 100)
  score: number = 0;
}

// Example: Accessor decorator with metadata
function Cached(target: ClassAccessorDecoratorResult<unknown, unknown>, context: ClassAccessorDecoratorContext) {
  context.metadata.cached = true;
  
  let cache: unknown = undefined;
  
  return {
    get(this: unknown) {
      if (cache === undefined) {
        cache = target.get.call(this);
      }
      return cache;
    },
    set(this: unknown, value: unknown) {
      cache = undefined; // Invalidate cache on set
      target.set.call(this, value);
    },
    init(this: unknown, value: unknown) {
      return target.init.call(this, value);
    },
  };
}

class DataService {
  @Cached
  accessor expensiveData: string = "";
}

// Example: Reading metadata
function getMetadata(target: object, key: string | symbol): unknown {
  // Metadata is stored on the target object
  return (target as any)[Symbol.metadata]?.[key];
}

// Example: Framework using decorator metadata
class Router {
  private routes: Map<string, Function> = new Map();
  
  register(controller: new () => any) {
    const instance = new controller();
    const metadata = (controller as any)[Symbol.metadata];
    const controllerPath = metadata?.controllerPath || "";
    
    // Get all methods
    const prototype = controller.prototype;
    for (const key of Object.getOwnPropertyNames(prototype)) {
      if (key === "constructor") continue;
      
      const method = prototype[key];
      const methodMetadata = metadata?.[key];
      
      if (methodMetadata?.route) {
        const { method: httpMethod, path } = methodMetadata.route;
        const fullPath = `${controllerPath}${path}`;
        this.routes.set(`${httpMethod} ${fullPath}`, method.bind(instance));
      }
    }
  }
  
  handle(method: string, path: string): Function | undefined {
    return this.routes.get(`${method} ${path}`);
  }
}

// Usage
const router = new Router();
router.register(UserController);

const handler = router.handle("GET", "/api/users/:id");
if (handler) {
  const result = handler("123");
}
```

**Legacy Experimental Decorators vs TC39 Decorators:**

**Legacy (experimentalDecorators: true):**

```typescript
// Legacy decorator signature
function legacyDecorator(target: any, propertyKey: string, descriptor?: PropertyDescriptor) {
  // Decorator logic
}

class MyClass {
  @legacyDecorator
  myMethod() {}
}
```

**TC39 Standard (TypeScript 5.0+):**

```typescript
// Standard decorator signature
function standardDecorator(value: Function, context: ClassMethodDecoratorContext) {
  // Decorator logic with context
  return value;
}

class MyClass {
  @standardDecorator
  myMethod() {}
}
```

**Key Differences:**

1. **Context Object**: TC39 decorators receive a `context` object with metadata, access, and kind information
2. **Metadata API**: TC39 decorators use `context.metadata` instead of `reflect-metadata`
3. **Return Values**: TC39 decorators can return replacement values or void
4. **Field Decorators**: TC39 field decorators return initializer functions
5. **Accessor Decorators**: TC39 accessor decorators return accessor descriptor objects

**Decorator Metadata Patterns:**

**Pattern 1: Dependency Injection with Metadata:**

```typescript
function Injectable(target: Function, context: ClassDecoratorContext) {
  context.metadata.injectable = true;
  return target;
}

function Inject(token: string) {
  return function (value: undefined, context: ClassFieldDecoratorContext) {
    context.metadata.injectToken = token;
    return value;
  };
}

@Injectable
class UserService {
  @Inject("database")
  private db: Database;
  
  @Inject("logger")
  private logger: Logger;
}

// DI Container reads metadata
class Container {
  resolve<T>(target: new () => T): T {
    const instance = new target();
    const metadata = (target as any)[Symbol.metadata];
    
    for (const [key, value] of Object.entries(metadata || {})) {
      if (value?.injectToken) {
        const dependency = this.get(value.injectToken);
        (instance as any)[key] = dependency;
      }
    }
    
    return instance;
  }
  
  private get(token: string): any {
    // Resolve dependency
  }
}
```

**Pattern 2: Validation with Metadata:**

```typescript
function Required(target: undefined, context: ClassFieldDecoratorContext) {
  context.metadata.required = true;
  return function (initialValue: unknown) {
    if (initialValue === undefined || initialValue === null) {
      throw new Error(`Field ${String(context.name)} is required`);
    }
    return initialValue;
  };
}

function MinLength(length: number) {
  return function (target: undefined, context: ClassFieldDecoratorContext) {
    context.metadata.minLength = length;
    return function (initialValue: unknown) {
      if (typeof initialValue === "string" && initialValue.length < length) {
        throw new Error(`Field ${String(context.name)} must be at least ${length} characters`);
      }
      return initialValue;
    };
  };
}

class User {
  @Required
  @MinLength(3)
  name: string = "";
  
  @Required
  email: string = "";
}

// Validation framework
function validate<T>(instance: T): ValidationResult {
  const metadata = (instance.constructor as any)[Symbol.metadata];
  const errors: string[] = [];
  
  for (const [key, value] of Object.entries(metadata || {})) {
    const fieldValue = (instance as any)[key];
    const fieldMeta = value;
    
    if (fieldMeta?.required && (fieldValue === undefined || fieldValue === null)) {
      errors.push(`${key} is required`);
    }
    
    if (fieldMeta?.minLength && typeof fieldValue === "string" && fieldValue.length < fieldMeta.minLength) {
      errors.push(`${key} must be at least ${fieldMeta.minLength} characters`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}
```

**Pattern 3: ORM with Metadata:**

```typescript
function Entity(tableName: string) {
  return function (target: Function, context: ClassDecoratorContext) {
    context.metadata.entity = { tableName };
    return target;
  };
}

function Column(options: { type: string; nullable?: boolean }) {
  return function (target: undefined, context: ClassFieldDecoratorContext) {
    context.metadata.column = options;
    return target;
  };
}

function PrimaryKey(target: undefined, context: ClassFieldDecoratorContext) {
  context.metadata.primaryKey = true;
  return target;
}

@Entity("users")
class User {
  @PrimaryKey
  @Column({ type: "uuid" })
  id: string = "";
  
  @Column({ type: "varchar", nullable: false })
  name: string = "";
  
  @Column({ type: "varchar", nullable: true })
  email: string | null = null;
}

// ORM reads metadata for schema generation
function generateSchema<T>(target: new () => T): string {
  const metadata = (target as any)[Symbol.metadata];
  const entityMeta = metadata?.entity;
  
  if (!entityMeta) {
    throw new Error("Class must be decorated with @Entity");
  }
  
  const columns: string[] = [];
  for (const [key, value] of Object.entries(metadata || {})) {
    if (value?.column) {
      const col = value.column;
      const nullable = col.nullable !== false ? "NULL" : "NOT NULL";
      const primaryKey = value.primaryKey ? " PRIMARY KEY" : "";
      columns.push(`${key} ${col.type} ${nullable}${primaryKey}`);
    }
  }
  
  return `CREATE TABLE ${entityMeta.tableName} (${columns.join(", ")});`;
}
```

**Decorator Metadata Limitations:**

- Requires TypeScript 5.0+ with standard decorators (or legacy `experimentalDecorators: true`)
- Metadata is only available for decorated members
- Not all type information is preserved (generics are erased, union types become `Object`)
- Metadata is stored on the target object, not globally
- Use with frameworks like NestJS, TypeORM, or custom dependency injection
- TC39 decorators are still Stage 3 (may change before finalization)

### 33.3.1 Migration Guide: Legacy Experimental Decorators → ES Decorators

**Migration Overview:**

This guide helps you migrate from TypeScript's legacy experimental decorators to standard ES decorators (TC39 Stage 3) supported in TypeScript 5.0+.

**Step 1: Update tsconfig.json**

```json
{
  "compilerOptions": {
    // ❌ REMOVE: "experimentalDecorators": true,
    // ❌ REMOVE: "emitDecoratorMetadata": true,
    
    // ✅ ADD: Standard decorators are enabled by default in TS 5.0+
    // No special flags needed for ES decorators
    "target": "ES2022", // ES decorators require ES2022+
    "lib": ["ES2022"]
  }
}
```

**Step 2: Update Decorator Signatures**

**Class Decorators:**

```typescript
// ❌ Legacy (experimentalDecorators: true)
function Injectable(target: Function) {
  // target is the constructor function
  return target;
}

// ✅ ES Decorators (TypeScript 5.0+)
function Injectable(target: Function, context: ClassDecoratorContext) {
  // target is the constructor function
  // context provides metadata, kind, name
  context.metadata.injectable = true;
  return target;
}
```

**Method Decorators:**

```typescript
// ❌ Legacy
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey}`);
    return originalMethod.apply(this, args);
  };
  return descriptor;
}

// ✅ ES Decorators
function Log(value: Function, context: ClassMethodDecoratorContext) {
  return function (this: any, ...args: any[]) {
    console.log(`Calling ${String(context.name)}`);
    return value.apply(this, args);
  };
}
```

**Property/Field Decorators:**

```typescript
// ❌ Legacy
function Required(target: any, propertyKey: string) {
  // Cannot modify property value directly
  // Must use descriptor or metadata
}

// ✅ ES Decorators
function Required(value: undefined, context: ClassFieldDecoratorContext) {
  context.metadata.required = true;
  return function (initialValue: unknown) {
    if (initialValue === undefined || initialValue === null) {
      throw new Error(`Field ${String(context.name)} is required`);
    }
    return initialValue;
  };
}
```

**Parameter Decorators:**

```typescript
// ❌ Legacy (experimentalDecorators: true)
function Inject(token: string) {
  return function (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
    // Store injection token
    Reflect.defineMetadata(`param:${parameterIndex}`, token, target);
  };
}

// ✅ ES Decorators (No direct parameter decorators)
// Use field decorators with dependency injection pattern instead
function Inject(token: string) {
  return function (value: undefined, context: ClassFieldDecoratorContext) {
    context.metadata.injectToken = token;
    return value;
  };
}
```

**Step 3: Update Metadata Access**

```typescript
// ❌ Legacy (reflect-metadata)
import "reflect-metadata";

@Reflect.metadata("key", "value")
class MyClass {}

const value = Reflect.getMetadata("key", MyClass);

// ✅ ES Decorators (context.metadata)
function MyDecorator(target: Function, context: ClassDecoratorContext) {
  context.metadata.key = "value";
  return target;
}

@MyDecorator
class MyClass {}

// Access metadata
const metadata = (MyClass as any)[Symbol.metadata];
const value = metadata?.key;
```

**Step 4: Common Migration Patterns**

**Pattern 1: Dependency Injection**

```typescript
// ❌ Legacy
import "reflect-metadata";

function Injectable(target: Function) {
  return target;
}

function Inject(token: string) {
  return function (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
    Reflect.defineMetadata(`param:${parameterIndex}`, token, target);
  };
}

class UserService {
  constructor(@Inject("database") private db: Database) {}
}

// ✅ ES Decorators
function Injectable(target: Function, context: ClassDecoratorContext) {
  context.metadata.injectable = true;
  return target;
}

function Inject(token: string) {
  return function (value: undefined, context: ClassFieldDecoratorContext) {
    context.metadata.injectToken = token;
    return value;
  };
}

@Injectable
class UserService {
  @Inject("database")
  private db: Database;
}
```

**Pattern 2: Validation**

```typescript
// ❌ Legacy
function MinLength(length: number) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata("minLength", length, target, propertyKey);
  };
}

class User {
  @MinLength(3)
  name: string = "";
}

// ✅ ES Decorators
function MinLength(length: number) {
  return function (value: undefined, context: ClassFieldDecoratorContext) {
    context.metadata.minLength = length;
    return function (initialValue: unknown) {
      if (typeof initialValue === "string" && initialValue.length < length) {
        throw new Error(`Field must be at least ${length} characters`);
      }
      return initialValue;
    };
  };
}

class User {
  @MinLength(3)
  name: string = "";
}
```

**Step 5: Remove reflect-metadata Dependency**

```bash
# Remove reflect-metadata package
npm uninstall reflect-metadata

# Remove import statements
# import "reflect-metadata"; // ❌ Remove this
```

**Step 6: Update Framework-Specific Code**

**NestJS Migration:**

```typescript
// NestJS 10+ supports ES decorators
// Update @nestjs/common and @nestjs/core to latest versions
// Most decorators work the same, but check migration guide for breaking changes
```

**TypeORM Migration:**

```typescript
// TypeORM 0.3+ supports ES decorators
// Update @typeorm packages to latest versions
// Entity decorators work similarly, but metadata access changed
```

**Migration Checklist:**

- [ ] Update `tsconfig.json` (remove `experimentalDecorators`, `emitDecoratorMetadata`)
- [ ] Update all decorator signatures (add `context` parameter)
- [ ] Replace `reflect-metadata` with `context.metadata`
- [ ] Update field decorators to return initializer functions
- [ ] Update method decorators to return replacement functions
- [ ] Remove `reflect-metadata` package and imports
- [ ] Update framework dependencies (NestJS, TypeORM, etc.)
- [ ] Test all decorator functionality
- [ ] Update build tools (esbuild, SWC may need updates)

**Breaking Changes:**

1. **Parameter Decorators**: ES decorators don't support parameter decorators directly. Use field decorators instead.
2. **Metadata Access**: Changed from `Reflect.getMetadata()` to `context.metadata` and `Symbol.metadata`.
3. **Field Initialization**: Field decorators must return initializer functions, not modify descriptors.
4. **Method Replacement**: Method decorators return replacement functions, not PropertyDescriptor objects.

**Benefits of Migration:**

- ✅ Standard ECMAScript feature (not TypeScript-specific)
- ✅ Better performance (no reflect-metadata polyfill)
- ✅ Better type safety (context object is typed)
- ✅ Future-proof (Stage 3 proposal, likely to be finalized)
- ✅ Better IDE support (context object provides rich metadata)

### 33.4 Procedural Code Generation

**Code Generation**: Generate TypeScript code programmatically.

Example:

```typescript
import { Project, SourceFile } from "ts-morph";

const project = new Project();

function generateService(name: string): SourceFile {
  const sourceFile = project.createSourceFile(
    `${name.toLowerCase()}.service.ts`,
    "",
    { overwrite: true }
  );

  sourceFile.addClass({
    name: `${name}Service`,
    methods: [
      {
        name: `get${name}`,
        returnType: `Promise<${name}>`,
        parameters: [{ name: "id", type: "string" }],
        statements: `return fetch(\`/api/${name.toLowerCase()}/\${id}\`).then(r => r.json());`,
      },
    ],
  });

  return sourceFile;
}

const service = generateService("User");
service.saveSync();
```

**Template-Based Generation:**

Example:

```typescript
function generateType(name: string, fields: string[]): string {
  return `
export interface ${name} {
${fields.map(f => `  ${f}: string;`).join("\n")}
}
  `.trim();
}

const typeCode = generateType("User", ["id", "name", "email"]);
```

**Use Cases:**
- Generate API clients from OpenAPI specs
- Generate types from database schemas
- Generate boilerplate code
- Transform code between formats

---


<!-- SSM:CHUNK_BOUNDARY id="ch33-end" -->
