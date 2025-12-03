<!-- SSM:CHUNK_BOUNDARY id="ch29-start" -->
📘 CHAPTER 29 — TYPE SYSTEM INTERNALS 🔴 Advanced

Understanding TypeScript's type system internals helps write better types and debug complex type errors.

> **Quick Answer:** TypeScript uses structural typing, not nominal. Two types are compatible if they have the same shape, regardless of name.

### 29.1 Type Inference Heuristics

#### 26.1.1 Contextual Typing

TypeScript infers types from context:

```typescript
// ✅ Contextual typing from array type
const users: User[] = [];
users.push({ id: "1", name: "John" }); // Type checked against User

// ✅ Contextual typing in callbacks
const numbers = [1, 2, 3];
numbers.map(n => n * 2); // n is inferred as number

// ✅ Contextual typing from function parameter
document.addEventListener("click", e => {
  // e is inferred as MouseEvent
  console.log(e.clientX, e.clientY);
});

// ✅ Contextual typing from variable type
const handler: (event: Event) => void = e => {
  // e is inferred as Event
  console.log(e.type);
};
```

#### 26.1.2 Best Common Type

When inferring types from multiple expressions:

```typescript
// Best common type: number | string
const mixed = [1, "hello", 2]; // (string | number)[]

// Best common type: Animal (common supertype)
class Animal { name: string = ""; }
class Dog extends Animal { bark() {} }
class Cat extends Animal { meow() {} }

const animals = [new Dog(), new Cat()]; // Animal[]

// When no common supertype exists
const things = [new Date(), "hello"]; // (Date | string)[]
```

#### 26.1.3 Type Widening

```typescript
// ✅ Widening: literals widen to base types
let x = "hello"; // string (not "hello")
let y = 42;      // number (not 42)
let z = true;    // boolean (not true)

// ❌ No widening with const
const a = "hello"; // "hello" (literal type)
const b = 42;      // 42 (literal type)

// ✅ as const prevents widening
const config = {
  port: 3000,
  host: "localhost",
} as const;
// { readonly port: 3000; readonly host: "localhost" }

// ✅ Object property widening
const obj = { x: 10 }; // { x: number }
const objConst = { x: 10 } as const; // { readonly x: 10 }
```

#### 26.1.4 Type Narrowing

Control flow analysis narrows types:

```typescript
function process(value: string | number | null) {
  // Type: string | number | null
  
  if (value === null) {
    // Type: null
    return;
  }
  // Type: string | number
  
  if (typeof value === "string") {
    // Type: string
    console.log(value.toUpperCase());
  } else {
    // Type: number
    console.log(value.toFixed(2));
  }
}

// ✅ User-defined type guards
interface Cat { meow(): void; }
interface Dog { bark(): void; }

function isCat(pet: Cat | Dog): pet is Cat {
  return (pet as Cat).meow !== undefined;
}

function handlePet(pet: Cat | Dog) {
  if (isCat(pet)) {
    pet.meow(); // pet is Cat
  } else {
    pet.bark(); // pet is Dog
  }
}

// ✅ Discriminated unions
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
  }
}
```

### 29.2 Variance

#### 26.2.1 Covariance and Contravariance

```typescript
// ✅ Return types are COVARIANT (same direction)
class Animal { name = "animal"; }
class Dog extends Animal { bark() {} }

type AnimalFactory = () => Animal;
type DogFactory = () => Dog;

const dogFactory: DogFactory = () => new Dog();
const animalFactory: AnimalFactory = dogFactory; // ✅ OK: Dog is subtype of Animal

// ✅ Parameter types are CONTRAVARIANT (opposite direction)
type AnimalHandler = (animal: Animal) => void;
type DogHandler = (dog: Dog) => void;

const animalHandler: AnimalHandler = (animal) => console.log(animal.name);
const dogHandler: DogHandler = animalHandler; // ✅ OK: Animal handler can handle Dogs

// ⚠️ Bivariance (legacy, unsafe)
// With strictFunctionTypes: false, both directions allowed
// With strictFunctionTypes: true (recommended), proper variance enforced
```

#### 26.2.2 Variance in Generics

```typescript
// ✅ Readonly arrays are covariant
type ReadonlyDogs = ReadonlyArray<Dog>;
type ReadonlyAnimals = ReadonlyArray<Animal>;
const dogs: ReadonlyDogs = [new Dog()];
const animals: ReadonlyAnimals = dogs; // ✅ OK

// ❌ Mutable arrays are invariant
type Dogs = Dog[];
type Animals = Animal[];
const mutableDogs: Dogs = [new Dog()];
// const mutableAnimals: Animals = mutableDogs; // ❌ Error: invariant

// ✅ Explicit variance annotations (TypeScript 4.7+)
interface Producer<out T> {
  produce(): T;
}

interface Consumer<in T> {
  consume(value: T): void;
}

interface Transformer<in I, out O> {
  transform(input: I): O;
}
```

### 29.3 Structural vs Nominal Typing

#### 26.3.1 Structural Typing

```typescript
// TypeScript uses STRUCTURAL typing
interface Point {
  x: number;
  y: number;
}

interface Coordinate {
  x: number;
  y: number;
}

const point: Point = { x: 1, y: 2 };
const coord: Coordinate = point; // ✅ OK: same shape

// ✅ Classes are also structurally typed
class PointClass {
  constructor(public x: number, public y: number) {}
}

const pointFromClass: Point = new PointClass(1, 2); // ✅ OK
```

#### 26.3.2 Simulating Nominal Types (Branded Types)

```typescript
// ✅ Pattern: Branded types for nominal-like behavior
declare const brandSymbol: unique symbol;

type Brand<T, B extends string> = T & { readonly [brandSymbol]: B };

type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

function createUserId(id: string): UserId {
  return id as UserId;
}

function createOrderId(id: string): OrderId {
  return id as OrderId;
}

function getUser(id: UserId): User {
  // ...
}

const userId = createUserId("user-123");
const orderId = createOrderId("order-456");

getUser(userId);   // ✅ OK
// getUser(orderId); // ❌ Type error: OrderId not assignable to UserId
// getUser("plain"); // ❌ Type error: string not assignable to UserId
```

### 29.4 Excess Property Checking (Freshness)

```typescript
interface Config {
  host: string;
  port: number;
}

// ✅ Direct object literal: excess property checking
// const config: Config = { host: "localhost", port: 3000, debug: true }; // ❌ Error

// ✅ Indirect assignment: no excess property checking
const obj = { host: "localhost", port: 3000, debug: true };
const config: Config = obj; // ✅ OK (object is not "fresh")

// ✅ Type assertion bypasses excess checking
const config2 = { host: "localhost", port: 3000, debug: true } as Config; // ✅ OK

// ✅ Index signature allows extra properties
interface FlexibleConfig {
  host: string;
  port: number;
  [key: string]: unknown;
}
const flexible: FlexibleConfig = { host: "localhost", port: 3000, debug: true }; // ✅ OK
```

### 29.5 Type Instantiation

How generic types are instantiated:

```typescript
// ✅ Type parameter substitution
type Box<T> = { value: T };
type StringBox = Box<string>; // { value: string }
type NumberBox = Box<number>; // { value: number }

// ✅ Conditional type instantiation
type IsString<T> = T extends string ? true : false;
type A = IsString<string>;  // true
type B = IsString<number>;  // false
type C = IsString<"hello">; // true (literal extends string)

// ✅ Distributive conditionals
type ToArray<T> = T extends unknown ? T[] : never;
type D = ToArray<string | number>; // string[] | number[]

// ✅ Non-distributive (wrap in tuple)
type ToArrayNonDist<T> = [T] extends [unknown] ? T[] : never;
type E = ToArrayNonDist<string | number>; // (string | number)[]
```

### 29.6 Type Compatibility Rules

```typescript
// ✅ Assignability rules
// 1. Same type
const a: string = "hello"; // ✅

// 2. Subtype to supertype
const b: unknown = "hello"; // ✅ (string extends unknown)

// 3. any is assignable to/from anything (escape hatch)
const c: any = 42;
const d: string = c; // ✅ (but unsafe)

// 4. never is subtype of everything
function throwError(): never {
  throw new Error();
}
const e: string = throwError(); // ✅ (never is bottom type)

// 5. Object compatibility (structural)
interface Named { name: string; }
interface Person { name: string; age: number; }
const person: Person = { name: "John", age: 30 };
const named: Named = person; // ✅ (Person has all properties of Named)

// 6. Function compatibility
type F1 = (a: number) => number;
type F2 = (a: number, b: string) => number;
const f1: F1 = (a) => a;
// const f2: F2 = f1; // ❌ f1 doesn't accept second parameter
```

### 29.7 Type Resolution Order

```typescript
// 1. Local declarations
function example() {
  type T = string; // Local type
  const x: T = "hello";
}

// 2. Module imports
import { SomeType } from "./types";

// 3. Ambient declarations
declare global {
  interface Window {
    myApp: App;
  }
}

// 4. lib.d.ts (built-in types)
// Array, Promise, Map, etc.

// ✅ Declaration merging order
interface User {
  id: string;
}

interface User {
  name: string;
}

// Merged: interface User { id: string; name: string; }
```

### See Also {#chapter-26-see-also}

- **Chapter 4: Types & Type System** — User-facing type system
- **Chapter 5: Control Flow Analysis** — Type narrowing implementation
- **Chapter 27: Compiler Pipeline** — How types are processed
- **Chapter 34: Type Theory** — Formal foundations
- **Appendix J: Formal Semantics** — Type system formalization

---


<!-- SSM:CHUNK_BOUNDARY id="ch29-end" -->
