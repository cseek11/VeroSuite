<!-- SSM:CHUNK_BOUNDARY id="ch7-start" -->
📘 CHAPTER 7 — CLASSES & OOP 🟡 Intermediate

### 7.1 Class Basics

Classes define blueprints for objects:

Example:

```typescript
class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  distance(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
}
```

### 7.2 Inheritance

Classes can extend other classes:

Example:

```typescript
class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  speak(): void {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  speak(): void {
    console.log(`${this.name} barks`);
  }
}
```

**Override Keyword (TS 4.3+):**

The `override` keyword explicitly marks methods that override a base class method:

```typescript
class Animal {
  speak(): void {
    console.log("Animal makes a sound");
  }
  
  move(): void {
    console.log("Animal moves");
  }
}

class Dog extends Animal {
  // ✅ Explicitly marks override
  override speak(): void {
    console.log("Dog barks");
  }
  
  // ❌ Error: Method 'move' does not exist in base class
  // override move(): void { } // TypeScript error if base method doesn't exist
  
  // ✅ Valid: New method (not overriding)
  fetch(): void {
    console.log("Dog fetches");
  }
}

// With noImplicitOverride: true, override is required
class Cat extends Animal {
  // ❌ Error: Method 'speak' overrides base class method but is not marked with 'override'
  speak(): void {
    console.log("Cat meows");
  }
  
  // ✅ Correct: Explicitly marked
  override move(): void {
    console.log("Cat moves silently");
  }
}
```

**Benefits of `override`:**
- Prevents accidental method hiding (typos in method names)
- Makes inheritance relationships explicit
- Enables `noImplicitOverride` compiler option for stricter checking
- Improves code readability and maintainability

**Configuration:**
```json
{
  "compilerOptions": {
    "noImplicitOverride": true  // Requires override keyword for all overrides
  }
}
```

### 7.3 Abstract Classes

Abstract classes cannot be instantiated directly:

Example:

```typescript
abstract class Shape {
  abstract area(): number;
  abstract perimeter(): number;
}

class Circle extends Shape {
  radius: number;

  constructor(radius: number) {
    super();
    this.radius = radius;
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}
```

**Production Failure: Abstract Class in React Components**

An AI proposed `abstract class BaseComponent` for React hooks, but React couldn't instantiate abstracts. Production SSR failed with "cannot construct abstract." Used composition instead.

**Lesson**: AIs blend OOP with FP—specify "React" in prompts. Use composition over inheritance for React components.

### 7.4 Interfaces

Interfaces define contracts for classes:

Example:

```typescript
interface Drawable {
  draw(): void;
}

class Circle implements Drawable {
  draw(): void {
    console.log("Drawing circle");
  }
}
```

### 7.5 This Types

**`this` type**: Represents the type of the current instance:

Example:

```typescript
class Builder {
  value = 0;

  add(n: number): this {
    this.value += n;
    return this;
  }

  multiply(n: number): this {
    this.value *= n;
    return this;
  }
}

const builder = new Builder();
builder.add(5).multiply(2); // Fluent API
```

### 7.6 Memory Layout

Understanding how TypeScript/JavaScript objects are laid out in memory:

#### 7.6.1 Object Representation

JavaScript objects are represented as **hash maps** (dictionaries) in memory:

- Properties are stored as key-value pairs
- Properties can be added/removed dynamically
- No fixed memory layout (unlike C++ structs)
- Hidden class optimization (V8 engine)

Example:

```typescript
class Point {
  x: number;
  y: number;
}

const p = new Point();
p.x = 10;
p.y = 20;

// Memory layout (conceptual):
// {
//   "x": 10,
//   "y": 20,
//   "__proto__": Point.prototype
// }
```

#### 7.6.2 Property Storage

**Fast Properties**: Properties stored directly on object (optimized by V8)

**Slow Properties**: Properties stored in separate dictionary (when object shape changes frequently)

Example:

```typescript
// Fast path: Same shape objects
const p1 = { x: 1, y: 2 };
const p2 = { x: 3, y: 4 }; // Same shape, fast

// Slow path: Different shapes
const p3 = { x: 1, y: 2, z: 3 }; // Different shape, slower
```

#### 7.6.3 Prototype Chain

Objects have a prototype chain stored in memory:

Example:

```typescript
class Animal {
  name: string;
}

class Dog extends Animal {
  breed: string;
}

const dog = new Dog();

// Memory layout (conceptual):
// dog -> {
//   breed: "Labrador",
//   __proto__: Dog.prototype -> {
//     __proto__: Animal.prototype -> {
//       __proto__: Object.prototype -> null
//     }
//   }
// }
```

#### 7.6.4 Hidden Classes (V8 Optimization)

V8 engine uses **hidden classes** (also called "shapes" or "maps") to optimize property access:

- Objects with same property order share hidden class
- Property access is optimized based on hidden class
- Changing property order creates new hidden class

Example:

```typescript
// ✅ GOOD: Same property order
function createPoint1(x: number, y: number) {
  return { x, y }; // Hidden class: {x, y}
}

// ❌ BAD: Different property order
function createPoint2(x: number, y: number) {
  return { y, x }; // Different hidden class: {y, x}
}
```

#### 7.6.5 Memory Overhead

JavaScript objects have memory overhead:

- Object header (hidden class pointer, property count)
- Property descriptors
- Prototype chain
- Garbage collection metadata

**Approximate sizes:**

- Empty object: ~48 bytes (V8)
- Each property: ~8-16 bytes (depending on type)
- String properties: Additional string storage

#### 7.6.6 Arrays vs Objects

**Arrays**: Specialized object type with numeric indices:

- Optimized for sequential access
- Can have holes (sparse arrays)
- Typed arrays (Int8Array, etc.) have fixed layout

Example:

```typescript
// Regular array (object-based)
const arr = [1, 2, 3]; // Stored as object with numeric keys

// Typed array (fixed layout, more efficient)
const typedArr = new Int32Array([1, 2, 3]); // Fixed 32-bit integers
```

### See Also {#chapter-7-see-also}

- **Chapter 6: Functions** — Method signatures and callable interfaces
- **Chapter 21: Architecture Patterns** — Dependency injection and class design
- **Chapter 28: Runtime Engines** — How classes are executed at runtime
- **Appendix H: Diagrams** — Decorator Execution Timeline

---


<!-- SSM:CHUNK_BOUNDARY id="ch7-end" -->
