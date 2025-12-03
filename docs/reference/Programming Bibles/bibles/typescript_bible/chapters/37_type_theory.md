<!-- SSM:CHUNK_BOUNDARY id="ch37-start" -->
📘 CHAPTER 37 — TYPE THEORY 🔴 Advanced

> **Quick Answer:** TypeScript uses structural subtyping (shape-based), not nominal. Type system is Turing-complete but not fully sound (intentional trade-off for usability). Types are erased at runtime.

### 37.1 Formal Semantics

TypeScript's type system from a formal perspective:

- Type inference rules
- Subtyping rules
- Type equivalence

#### 37.1.1 Formal Grammar

**EBNF Grammar**: Extended Backus-Naur Form for TypeScript syntax.

**Type Grammar:**

```
Type ::= 
  | PrimitiveType
  | ObjectType
  | ArrayType
  | TupleType
  | UnionType
  | IntersectionType
  | FunctionType
  | GenericType
  | TypeReference

PrimitiveType ::= "number" | "string" | "boolean" | "void" | "null" | "undefined"

ObjectType ::= "{" (PropertySignature ",")* "}"

PropertySignature ::= Identifier ":" Type ("?" | "!" | "readonly")?

ArrayType ::= Type "[]" | "Array" "<" Type ">"

TupleType ::= "[" (Type ",")* "]"

UnionType ::= Type "|" Type

IntersectionType ::= Type "&" Type

FunctionType ::= "(" (Parameter ",")* ")" "=>" Type

Parameter ::= Identifier ":" Type ("?" | "...")?

GenericType ::= Identifier "<" (Type ",")* ">"

TypeReference ::= Identifier ("." Identifier)*
```

**Expression Grammar:**

```
Expression ::=
  | Literal
  | Identifier
  | ObjectLiteral
  | ArrayLiteral
  | FunctionExpression
  | CallExpression
  | MemberExpression
  | BinaryExpression
  | UnaryExpression
  | ConditionalExpression
  | TypeAssertion

Literal ::= NumberLiteral | StringLiteral | BooleanLiteral | NullLiteral

ObjectLiteral ::= "{" (Property ",")* "}"

Property ::= Identifier ":" Expression | "[" Expression "]" ":" Expression

ArrayLiteral ::= "[" (Expression ",")* "]"

FunctionExpression ::= "(" (Parameter ",")* ")" "=>" Expression | "function" "(" (Parameter ",")* ")" "{" Statement* "}"

CallExpression ::= Expression "(" (Expression ",")* ")"

MemberExpression ::= Expression "." Identifier | Expression "[" Expression "]"

BinaryExpression ::= Expression BinaryOperator Expression

BinaryOperator ::= "+" | "-" | "*" | "/" | "==" | "===" | "!=" | "!==" | "<" | ">" | "<=" | ">=" | "&&" | "||"

UnaryExpression ::= UnaryOperator Expression

UnaryOperator ::= "+" | "-" | "!" | "~" | "typeof" | "void" | "delete"

ConditionalExpression ::= Expression "?" Expression ":" Expression

TypeAssertion ::= Expression "as" Type | "<" Type ">" Expression
```

#### 37.1.2 Reduction Rules

**Type Reduction**: How types are reduced to simpler forms.

**Structural Subtyping:**

```
If S <: T and T <: U, then S <: U (Transitivity)

If S1 <: T1 and S2 <: T2, then { f: S1, g: S2 } <: { f: T1, g: T2 } (Width subtyping)

If S <: T, then { f: S } <: { f?: T } (Optional property)

If S <: T, then (x: T) => S <: (x: S) => T (Function contravariance)
```

**Type Inference Rules:**

```
Γ ⊢ e : τ    (Expression e has type τ in context Γ)

Γ, x: τ1 ⊢ e : τ2
─────────────────── (Function)
Γ ⊢ (x: τ1) => e : (x: τ1) => τ2

Γ ⊢ e1 : (x: τ1) => τ2    Γ ⊢ e2 : τ1
───────────────────────────────────── (Application)
Γ ⊢ e1(e2) : τ2

Γ ⊢ e : τ1    τ1 <: τ2
─────────────────────── (Subsumption)
Γ ⊢ e : τ2
```

#### 37.1.3 Operational Semantics

**Small-Step Semantics**: How expressions evaluate step-by-step.

**Evaluation Rules:**

```
e1 → e1'
───────────────── (E-App1)
e1(e2) → e1'(e2)

e2 → e2'
───────────────── (E-App2)
v1(e2) → v1(e2')

─────────────────────────────── (E-AppAbs)
((x: τ) => e) v → e[x := v]

e → e'
───────────────── (E-If)
if e then e1 else e2 → if e' then e1 else e2

─────────────────────────────────── (E-IfTrue)
if true then e1 else e2 → e1

──────────────────────────────────── (E-IfFalse)
if false then e1 else e2 → e2
```

**Type Erasure Semantics:**

```
erase(τ) = JavaScript type

erase(number) = number
erase(string) = string
erase((x: τ1) => τ2) = function
erase({ f: τ }) = object
```

#### 37.1.4 Type Soundness

**Type Soundness**: Well-typed programs don't go wrong.

**Progress Theorem:**

```
If ⊢ e : τ, then either:
  - e is a value, or
  - e → e' for some e'
```

**Preservation Theorem:**

```
If ⊢ e : τ and e → e', then ⊢ e' : τ
```

**TypeScript's Pragmatic Approach:**

TypeScript is **intentionally unsound** for pragmatic reasons. The language prioritizes developer productivity and JavaScript compatibility over perfect type safety. This design decision allows TypeScript to:

- Support existing JavaScript codebases without major refactoring
- Provide gradual typing (migrate incrementally)
- Balance type safety with usability
- Avoid overly restrictive type checking that would reject valid JavaScript patterns

**TypeScript Limitations (Intentional Trade-offs):**

- Structural typing allows some unsoundness (e.g., `{ x: number }` is assignable to `{ x: number; y?: number }`)
- `any` type bypasses type checking (escape hatch for dynamic code)
- Type assertions can be incorrect (developer responsibility)
- Runtime type errors possible (types are erased, no runtime checking)
- Bivariant method parameters (for backward compatibility with JavaScript)

**Soundness Guarantees:**

- Type-checked code has fewer runtime errors (empirically proven)
- Type inference is sound (when not using `any`)
- Subtyping is sound for most cases (structural subtyping is sound for readonly properties)
- Type narrowing is sound (discriminated unions, type guards)

### 37.2 Subtyping Judgments

Formal subtyping rules for TypeScript's type system.

#### 37.2.1 Reflexivity and Transitivity

```
─────────── (S-Refl)
  τ <: τ

  S <: T    T <: U
─────────────────── (S-Trans)
      S <: U
```

#### 37.2.2 Top and Bottom Types

```
─────────── (S-Unknown)
  τ <: unknown

─────────── (S-Any-Left)
  any <: τ

─────────── (S-Any-Right)
  τ <: any

─────────── (S-Never)
  never <: τ
```

#### 37.2.3 Primitive Type Subtyping

```
─────────────────────── (S-String-Literal)
  "hello" <: string

─────────────────────── (S-Number-Literal)
  42 <: number

─────────────────────── (S-Boolean-Literal)
  true <: boolean
```

#### 37.2.4 Object Type Subtyping (Width)

```
  { f₁: T₁, ..., fₙ: Tₙ, g: U }
─────────────────────────────────── (S-Width)
  { f₁: T₁, ..., fₙ: Tₙ, g: U } <: { f₁: T₁, ..., fₙ: Tₙ }
```

#### 37.2.5 Object Type Subtyping (Depth)

```
  S₁ <: T₁  ...  Sₙ <: Tₙ
─────────────────────────────────── (S-Depth)
  { f₁: S₁, ..., fₙ: Sₙ } <: { f₁: T₁, ..., fₙ: Tₙ }
```

#### 37.2.6 Function Type Subtyping (Contravariant Parameters)

```
  T₁ <: S₁    S₂ <: T₂
───────────────────────────── (S-Arrow)
  (x: S₁) => S₂ <: (x: T₁) => T₂
```

> **Note:** Parameters are contravariant, return types are covariant.

#### 37.2.7 Union and Intersection Types

```
─────────────────── (S-Union-Left)
  S <: S | T

─────────────────── (S-Union-Right)
  T <: S | T

  S <: U    T <: U
───────────────────── (S-Union-Elim)
    S | T <: U

─────────────────── (S-Intersection-Left)
  S & T <: S

─────────────────── (S-Intersection-Right)
  S & T <: T

  U <: S    U <: T
───────────────────── (S-Intersection-Intro)
    U <: S & T
```

### 37.3 Distributive Conditional Types

Formal rules for conditional type distribution:

#### 37.3.1 Distribution Over Unions

```
T extends U ? X : Y  where T = A | B

Distributes to:

(A extends U ? X : Y) | (B extends U ? X : Y)
```

**TypeScript Example:**

```typescript
// ✅ Naked type parameter distributes
type Distribute<T, U> = T extends U ? "yes" : "no";

type Test1 = Distribute<"a" | "b", "a">;
// → ("a" extends "a" ? "yes" : "no") | ("b" extends "a" ? "yes" : "no")
// → "yes" | "no"

// ✅ Wrapped type parameter does NOT distribute
type NoDistribute<T, U> = [T] extends [U] ? "yes" : "no";

type Test2 = NoDistribute<"a" | "b", "a">;
// → ["a" | "b"] extends ["a"] ? "yes" : "no"
// → "no"
```

#### 37.3.2 Conditional Type Inference

```
  T extends infer U ? X : Y

Infers the type U from T and uses it in X.
```

**TypeScript Example:**

```typescript
// ✅ Infer return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type R1 = ReturnType<() => string>; // string
type R2 = ReturnType<(x: number) => boolean>; // boolean

// ✅ Infer array element
type ElementType<T> = T extends (infer E)[] ? E : never;

type E1 = ElementType<string[]>; // string
type E2 = ElementType<number[]>; // number

// ✅ Infer promise value
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

type A1 = Awaited<Promise<string>>; // string
type A2 = Awaited<Promise<Promise<number>>>; // number
```

### 37.4 Mapped Type Semantics

Formal rules for mapped types:

#### 37.4.1 Basic Mapping

```
{ [P in K]: T }

For each P in keyof K, create property P with type T.
```

**TypeScript Example:**

```typescript
// ✅ Homomorphic mapped type (preserves modifiers)
type ReadonlyPartial<T> = {
  readonly [P in keyof T]?: T[P];
};

// ✅ Key remapping
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

interface User {
  name: string;
  age: number;
}

type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number }
```

#### 37.4.2 Modifier Manipulation

```
+readonly  → Add readonly modifier
-readonly  → Remove readonly modifier
+?         → Add optional modifier
-?         → Remove optional modifier
```

**TypeScript Example:**

```typescript
// ✅ Remove readonly
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// ✅ Make required
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// ✅ Combine modifiers
type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};
```

### 37.5 Category Theory Concepts

Category theory applied to TypeScript types.

#### 37.5.1 Functors

A functor maps types and functions while preserving structure:

```typescript
// ✅ Array is a functor
// map :: (A → B) → F<A> → F<B>

const numbers: number[] = [1, 2, 3];
const strings: string[] = numbers.map(n => n.toString());

// ✅ Functor laws
// Identity: map(id) ≡ id
// Composition: map(f ∘ g) ≡ map(f) ∘ map(g)

interface Functor<F> {
  map<A, B>(fa: F, f: (a: A) => B): F;
}
```

#### 37.5.2 Monads

A monad wraps computations with sequencing:

```typescript
// ✅ Promise is a monad
// flatMap :: (A → M<B>) → M<A> → M<B>

const fetchUser = (id: string): Promise<User> => fetch(`/users/${id}`).then(r => r.json());
const fetchPosts = (user: User): Promise<Post[]> => fetch(`/posts?userId=${user.id}`).then(r => r.json());

// Monadic chaining
const posts: Promise<Post[]> = fetchUser("1").then(fetchPosts);

// ✅ Monad laws
// Left identity: return(a).flatMap(f) ≡ f(a)
// Right identity: m.flatMap(return) ≡ m
// Associativity: m.flatMap(f).flatMap(g) ≡ m.flatMap(a => f(a).flatMap(g))

interface Monad<M> {
  of<A>(a: A): M; // return / pure
  flatMap<A, B>(ma: M, f: (a: A) => M): M; // bind / chain
}
```

#### 37.5.3 Type-Level Programming Patterns

```typescript
// ✅ Type-level If
type If<C extends boolean, T, F> = C extends true ? T : F;

// ✅ Type-level Not
type Not<T extends boolean> = T extends true ? false : true;

// ✅ Type-level And
type And<A extends boolean, B extends boolean> = A extends true
  ? B extends true
    ? true
    : false
  : false;

// ✅ Type-level Or
type Or<A extends boolean, B extends boolean> = A extends true
  ? true
  : B extends true
  ? true
  : false;

// ✅ Type-level equality
type Equals<A, B> = 
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2) ? true : false;

// ✅ Type-level list operations
type Head<T extends any[]> = T extends [infer H, ...any[]] ? H : never;
type Tail<T extends any[]> = T extends [any, ...infer R] ? R : never;
type Length<T extends any[]> = T["length"];

// ✅ Type-level recursion (with depth limit)
type DeepReadonly<T> = T extends object
  ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
  : T;
```

### 37.6 Turing Completeness

TypeScript's type system is Turing complete, meaning it can compute any computable function at the type level:

```typescript
// ✅ Type-level arithmetic (Peano numbers)
type Zero = { tag: "zero" };
type Succ<N> = { tag: "succ"; prev: N };

type One = Succ<Zero>;
type Two = Succ<One>;
type Three = Succ<Two>;

// ✅ Type-level addition
type Add<A, B> = A extends Zero
  ? B
  : A extends Succ<infer APrev>
  ? Add<APrev, Succ<B>>
  : never;

type Five = Add<Two, Three>; // Succ<Succ<Succ<Succ<Succ<Zero>>>>>

// ✅ Type-level Fibonacci (compile-time computation)
type Fib<N extends number, Acc extends number[] = [0, 1]> =
  Acc["length"] extends N
    ? Acc[0]
    : Fib<N, [Acc[1], Acc[0] + Acc[1] & number, ...Acc]>;

// Warning: Deep recursion may hit TypeScript's depth limit
```

### 37.7 Variance in Detail

Variance describes how type relationships change with parameterized types:

```typescript
// ✅ Covariance (out): Producer<Sub> <: Producer<Super>
interface Producer<out T> {
  produce(): T;
}

// ✅ Contravariance (in): Consumer<Super> <: Consumer<Sub>
interface Consumer<in T> {
  consume(item: T): void;
}

// ✅ Invariance: Neither sub nor super
interface MutableBox<T> {
  value: T; // Both read and write → invariant
}

// ✅ Bivariance (TypeScript default for methods)
interface Handler<T> {
  handle(item: T): void; // Methods are bivariant (unsound but practical)
}
```

### See Also {#chapter-34-see-also}

- **Chapter 4: Types & Type System** — Practical type system usage
- **Chapter 26: Type System Internals** — Implementation details
- **Chapter 27: Compiler Pipeline** — Type checking process
- **Chapter 41: Language Specification** — Specification alignment
- **Appendix J: Formal Semantics** — Extended formal rules

---


<!-- SSM:CHUNK_BOUNDARY id="ch37-end" -->
