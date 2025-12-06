<!-- SSM:CHUNK_BOUNDARY id="ch9-start" -->
📘 CHAPTER 9 — STANDARD LIBRARY 🟡 Intermediate

> **Quick Reference:**
> - **ECMAScript Built-ins**: See Chapter 9.13 for comprehensive catalog
> - **DOM Types**: See Chapter 18.5 for complete DOM & Web API coverage
> - **Node.js Types**: See Chapter 18.6 for complete Node.js module coverage
> - **Standard Library Index**: See Appendix M for complete type lookup

### 9.1 DOM Types

TypeScript includes types for DOM APIs:

Example:

```typescript
const element: HTMLElement = document.getElementById("app")!;
element.addEventListener("click", (event: MouseEvent) => {
  console.log(event.clientX, event.clientY);
});
```

**Note:** For comprehensive DOM & Web API types coverage, see Chapter 18.5 — DOM & Web API Types.

### 9.2 Node.js Types

Install `@types/node` for Node.js types:

Example:

```typescript
import * as fs from "fs";

fs.readFile("file.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

**Note:** For comprehensive Node.js types coverage, see Chapter 18.6 — Node.js Types & Modules.

### 9.3 Collections

TypeScript provides types for JavaScript collection types:

#### 9.3.1 Array

**Array<T>** or **T[]**: Ordered collection of elements.

Example:

```typescript
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ["a", "b", "c"];

// Array methods with types
numbers.map((n) => n * 2); // number[]
numbers.filter((n) => n > 1); // number[]
numbers.reduce((acc, n) => acc + n, 0); // number
```

#### 9.3.2 Map

**Map<K, V>**: Key-value pairs with any key type.

Example:

```typescript
const map = new Map<string, number>();
map.set("one", 1);
map.set("two", 2);

const value: number | undefined = map.get("one");
const hasKey: boolean = map.has("one");
```

#### 9.3.3 Set

**Set<T>**: Collection of unique values.

Example:

```typescript
const set = new Set<number>();
set.add(1);
set.add(2);
set.add(1); // Duplicate ignored

const hasValue: boolean = set.has(1);
const size: number = set.size;
```

#### 9.3.4 WeakMap

**WeakMap<K, V>**: Map with weak references (keys must be objects).

Example:

```typescript
const weakMap = new WeakMap<object, string>();
const key = { id: 1 };
weakMap.set(key, "value");

const value: string | undefined = weakMap.get(key);
```

**Use case**: Private data storage without preventing garbage collection.

#### 9.3.5 WeakSet

**WeakSet<T>**: Set with weak references (values must be objects).

Example:

```typescript
const weakSet = new WeakSet<object>();
const obj = { id: 1 };
weakSet.add(obj);

const hasValue: boolean = weakSet.has(obj);
```

**Use case**: Tracking objects without preventing garbage collection.

### 9.4 Numeric Types

#### 9.4.1 Number

**number**: 64-bit floating-point (IEEE 754).

Example:

```typescript
let num: number = 42;
let float: number = 3.14;
let infinity: number = Infinity;
let nan: number = NaN;
```

**Number Methods:**

```typescript
Number.parseInt("123"); // 123
Number.parseFloat("3.14"); // 3.14
Number.isNaN(NaN); // true
Number.isFinite(42); // true
Number.isInteger(42); // true
```

#### 9.4.2 BigInt

**bigint**: Arbitrary-precision integers.

Example:

```typescript
let big: bigint = 9007199254740991n;
let big2: bigint = BigInt("9007199254740991");

// Operations
let sum: bigint = big + big2;
let product: bigint = big * 2n;
```

**Limitations:**
- Cannot mix with `number` (must convert explicitly)
- Not JSON serializable
- Some libraries don't support BigInt

#### 9.4.3 Math

**Math**: Built-in mathematical functions.

Example:

```typescript
Math.PI; // 3.141592653589793
Math.E; // 2.718281828459045

Math.abs(-5); // 5
Math.max(1, 2, 3); // 3
Math.min(1, 2, 3); // 1
Math.round(3.7); // 4
Math.floor(3.7); // 3
Math.ceil(3.2); // 4
Math.random(); // 0 to 1
Math.sqrt(16); // 4
Math.pow(2, 3); // 8
```

### 9.5 I/O

#### 9.5.1 Console

**console**: Standard output/error logging.

Example:

```typescript
console.log("Info:", data);
console.error("Error:", error);
console.warn("Warning:", message);
console.info("Information:", data);
console.debug("Debug:", data);

// Formatted output
console.log("User: %s, Age: %d", name, age);
```

#### 9.5.2 Readline (Node.js)

**readline**: Interactive input.

Example:

```typescript
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("What is your name? ", (answer: string) => {
  console.log(`Hello, ${answer}!`);
  rl.close();
});
```

#### 9.5.3 Streams (Node.js)

**Streams**: Handle data streams.

Example:

```typescript
import { Readable, Writable } from "stream";

const readable = new Readable({
  read() {
    this.push("data");
    this.push(null); // End stream
  },
});

const writable = new Writable({
  write(chunk: Buffer, encoding: string, callback: () => void) {
    console.log(chunk.toString());
    callback();
  },
});

readable.pipe(writable);
```

### 9.6 File System

#### 9.6.1 fs Module (Node.js)

**fs**: File system operations.

Example:

```typescript
import * as fs from "fs";
import * as fsPromises from "fs/promises";

// Synchronous (blocking)
const data: string = fs.readFileSync("file.txt", "utf8");

// Asynchronous (callback)
fs.readFile("file.txt", "utf8", (err: NodeJS.ErrnoException | null, data: string) => {
  if (err) throw err;
  console.log(data);
});

// Promise-based (recommended)
async function readFile() {
  const data: string = await fsPromises.readFile("file.txt", "utf8");
  return data;
}

// Write file
await fsPromises.writeFile("output.txt", "content", "utf8");
```

#### 9.6.2 Path Operations

**path**: Path manipulation.

Example:

```typescript
import * as path from "path";

const filePath: string = path.join("/users", "john", "file.txt");
const dir: string = path.dirname(filePath);
const base: string = path.basename(filePath);
const ext: string = path.extname(filePath);
const resolved: string = path.resolve("./file.txt");
```

### 9.7 Networking

#### 9.7.1 fetch API

**fetch**: HTTP client (browser and Node.js 18+).

Example:

```typescript
async function fetchData(): Promise<Response> {
  const response: Response = await fetch("https://api.example.com/data");
  const data: unknown = await response.json();
  return response;
}

// With types
interface ApiResponse {
  data: string[];
}

async function fetchTyped(): Promise<ApiResponse> {
  const response = await fetch("https://api.example.com/data");
  const data: ApiResponse = await response.json();
  return data;
}
```

#### 9.7.2 http/https (Node.js)

**http/https**: Low-level HTTP server/client.

Example:

```typescript
import * as http from "http";

const server: http.Server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello World");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

#### 9.7.3 URL

**URL**: URL parsing and manipulation.

Example:

```typescript
const url = new URL("https://example.com/path?query=value");
url.hostname; // "example.com"
url.pathname; // "/path"
url.searchParams.get("query"); // "value"

// URLSearchParams
const params = new URLSearchParams({ a: "1", b: "2" });
params.toString(); // "a=1&b=2"
```

### 9.8 Concurrency

#### 9.8.1 Promise

**Promise<T>**: Represents asynchronous operation.

Example:

```typescript
const promise: Promise<string> = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Success");
  }, 1000);
});

promise.then((value: string) => {
  console.log(value);
});
```

#### 9.8.2 async/await

**async/await**: Syntactic sugar for Promises.

Example:

```typescript
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const user: User = await response.json();
  return user;
}
```

#### 9.8.3 Promise Utilities

**Promise.all**: Wait for all promises.

Example:

```typescript
const promises: Promise<number>[] = [fetchData1(), fetchData2(), fetchData3()];
const results: number[] = await Promise.all(promises);
```

**Promise.race**: First promise to resolve/reject.

Example:

```typescript
const winner: string = await Promise.race([
  slowOperation(),
  fastOperation(),
]);
```

**Promise.allSettled**: Wait for all, get all results.

Example:

```typescript
const results = await Promise.allSettled(promises);
// results: Array<{ status: "fulfilled" | "rejected", value?: T, reason?: any }>
```

### 9.9 Date/Time

#### 9.9.1 Date

**Date**: Date and time representation.

Example:

```typescript
const now: Date = new Date();
const specific: Date = new Date(2025, 0, 1); // January 1, 2025
const fromString: Date = new Date("2025-12-05");
const fromTimestamp: Date = new Date(1735689600000);

// Methods
now.getFullYear(); // 2025
now.getMonth(); // 0-11
now.getDate(); // 1-31
now.getTime(); // milliseconds since epoch
now.toISOString(); // "2025-12-05T00:00:00.000Z"
```

#### 9.9.2 Intl

**Intl**: Internationalization API.

Example:

```typescript
// Date formatting
const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
formatter.format(new Date()); // "January 1, 2025"

// Number formatting
const numFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
numFormatter.format(1234.56); // "$1,234.56"

// Relative time
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
rtf.format(-1, "day"); // "yesterday"

// Collator (String Comparison)
const collator = new Intl.Collator("en", { sensitivity: "base" });
const comparison: number = collator.compare("apple", "Apple"); // 0 (equal)

// PluralRules
const pluralRules = new Intl.PluralRules("en");
const plural: string = pluralRules.select(1); // "one"
const pluralMany: string = pluralRules.select(5); // "other"

// ListFormat
const listFormatter = new Intl.ListFormat("en", { style: "long", type: "conjunction" });
const list: string = listFormatter.format(["apple", "banana", "orange"]);
// "apple, banana, and orange"

// Locale
const locale = new Intl.Locale("en-US", { calendar: "gregory" });
const language: string = locale.language; // "en"
const region: string = locale.region; // "US"

// DisplayNames
const displayNames = new Intl.DisplayNames("en", { type: "region" });
const regionName: string = displayNames.of("US"); // "United States"

// Segmenter (Text Segmentation) - ES2022+
const segmenter = new Intl.Segmenter("en", { granularity: "word" });
const segments = segmenter.segment("Hello world");
for (const segment of segments) {
  console.log(segment.segment, segment.isWordLike);
}
```

### 9.10 Security/Crypto

#### 9.10.1 crypto (Node.js)

**crypto**: Cryptographic functions.

Example:

```typescript
import * as crypto from "crypto";

// Hash
const hash: string = crypto.createHash("sha256").update("data").digest("hex");

// Random bytes
const randomBytes: Buffer = crypto.randomBytes(32);

// HMAC
const hmac: string = crypto.createHmac("sha256", "secret").update("data").digest("hex");

// Encryption (AES)
const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
const encrypted: Buffer = Buffer.concat([cipher.update("data"), cipher.final()]);
```

#### 9.10.2 Web Crypto API (Browser)

**crypto**: Browser crypto API.

Example:

```typescript
// Generate key
const key = await crypto.subtle.generateKey(
  { name: "AES-GCM", length: 256 },
  true,
  ["encrypt", "decrypt"]
);

// Encrypt
const encrypted = await crypto.subtle.encrypt(
  { name: "AES-GCM", iv: iv },
  key,
  data
);
```

### 9.11 JSON/Serialization

#### 9.11.1 JSON

**JSON**: JSON parsing and serialization.

Example:

```typescript
// Parse JSON string to object
const obj: unknown = JSON.parse('{"name": "John", "age": 30}');

// With type assertion (unsafe)
const user = JSON.parse('{"name": "John"}') as { name: string };

// With validation (recommended)
import { z } from "zod";
const UserSchema = z.object({ name: z.string(), age: z.number() });
const validatedUser = UserSchema.parse(JSON.parse(jsonString));

// Stringify object to JSON
const json: string = JSON.stringify({ name: "John", age: 30 });
```

**BigInt Serialization Caveat:**

```typescript
// ❌ Error: BigInt cannot be serialized directly
const big = 123n;
JSON.stringify({ big }); // TypeError: Do not know how to serialize a BigInt

// ✅ Solution 1: Convert to string
const serializable = { big: big.toString() };
JSON.stringify(serializable); // '{"big":"123"}'

// ✅ Solution 2: Custom toJSON
class BigIntValue {
  constructor(public value: bigint) {}
  toJSON() {
    return this.value.toString();
  }
}

JSON.stringify({ big: new BigIntValue(123n) }); // '{"big":"123"}'

// ✅ Solution 3: Replacer function
JSON.stringify({ big }, (key, value) => 
  typeof value === 'bigint' ? value.toString() : value
); // '{"big":"123"}'
```

#### 9.11.2 Custom Serialization

**toJSON**: Custom serialization.

**Important Serialization Order:**

1. `toJSON()` is called recursively on nested objects
2. `replacer` function runs AFTER `toJSON()` is called
3. `replacer` receives the result of `toJSON()`, not the original object

Example:

```typescript
class Point {
  constructor(public x: number, public y: number) {}

  toJSON() {
    return { x: this.x, y: this.y };
  }
}

const point = new Point(1, 2);
JSON.stringify(point); // '{"x":1,"y":2}'

// Example: Recursive toJSON calls
class User {
  constructor(
    public name: string,
    public location: Point
  ) {}

  toJSON() {
    return {
      name: this.name,
      location: this.location, // Point.toJSON() is called here
    };
  }
}

const user = new User("John", new Point(10, 20));
JSON.stringify(user);
// '{"name":"John","location":{"x":10,"y":20}}'
// Note: Point.toJSON() was called automatically

// Example: replacer runs AFTER toJSON()
class CustomValue {
  constructor(public value: number) {}
  
  toJSON() {
    return { type: "custom", value: this.value };
  }
}

const obj = { data: new CustomValue(42) };

// replacer receives the result of toJSON(), not the original object
JSON.stringify(obj, (key, value) => {
  if (value && value.type === "custom") {
    // This is the result of CustomValue.toJSON()
    return `custom:${value.value}`;
  }
  return value;
});
// '{"data":"custom:42"}'
// Note: replacer sees { type: "custom", value: 42 }, not CustomValue instance
```

### 9.12 Reflective APIs

#### 9.12.1 Reflect

**Reflect**: Reflection operations.

Example:

```typescript
const obj = { x: 1, y: 2 };

// Property access
Reflect.get(obj, "x"); // 1
Reflect.set(obj, "x", 3); // obj.x is now 3

// Property existence
Reflect.has(obj, "x"); // true

// Property keys
Reflect.ownKeys(obj); // ["x", "y"]

// Construct objects
class MyClass {
  constructor(public value: number) {}
}
const instance = Reflect.construct(MyClass, [42]);
```

#### 9.12.2 Proxy

**Proxy**: Intercept object operations.

Example:

```typescript
const target = { value: 42 };

const proxy = new Proxy(target, {
  get(target, prop: string | symbol) {
    console.log(`Getting ${String(prop)}`);
    return target[prop as keyof typeof target];
  },
  set(target, prop: string | symbol, value: unknown) {
    console.log(`Setting ${String(prop)} to ${value}`);
    target[prop as keyof typeof target] = value as number;
    return true;
  },
});

proxy.value; // Logs: "Getting value", returns 42
proxy.value = 100; // Logs: "Setting value to 100"
```

**Use cases:**
- Validation
- Logging
- Virtual properties
- Default values

### 9.13 ECMAScript Built-ins Comprehensive Catalog

> **Quick Answer:**
> - TypeScript's standard library (`lib.es*.d.ts`) provides types for all ECMAScript built-in objects and APIs
> - These types are automatically included unless `noLib: true` is set
> - Use `lib` compiler option to control which library versions are included (e.g., `["ES2022", "DOM"]`)
>
> **Example — Correct Pattern:**
> ```typescript
> // ✅ CORRECT: Using built-in types from standard library
> const map = new Map<string, number>();
> const promise = Promise.resolve(42);
> const date = new Date();
> ```
>
> **Estimated time:** 3–4 hours to master all built-ins  
> **When you need this:** Working with JavaScript runtime APIs, collections, async operations, or reflection

#### 9.13.1 Primitives & Wrappers

**String**: Text manipulation and pattern matching.

**Complete API Reference:**

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `charAt(index)` | `(index: number) => string` | `string` | Character at index |
| `charCodeAt(index)` | `(index: number) => number` | `number` | UTF-16 code unit |
| `codePointAt(index)` | `(index: number) => number \| undefined` | `number \| undefined` | Unicode code point |
| `concat(...strings)` | `(...strings: string[]) => string` | `string` | Concatenate strings |
| `includes(searchString)` | `(searchString: string, position?: number) => boolean` | `boolean` | Check substring |
| `indexOf(searchString)` | `(searchString: string, position?: number) => number` | `number` | First index of substring |
| `lastIndexOf(searchString)` | `(searchString: string, position?: number) => number` | `number` | Last index of substring |
| `match(regexp)` | `(regexp: string \| RegExp) => RegExpMatchArray \| null` | `RegExpMatchArray \| null` | Match regex |
| `matchAll(regexp)` | `(regexp: RegExp) => IterableIterator<RegExpMatchArray>` | `IterableIterator<RegExpMatchArray>` | All matches |
| `padStart(targetLength, padString?)` | `(targetLength: number, padString?: string) => string` | `string` | Pad start |
| `padEnd(targetLength, padString?)` | `(targetLength: number, padString?: string) => string` | `string` | Pad end |
| `repeat(count)` | `(count: number) => string` | `string` | Repeat string |
| `replace(searchValue, replaceValue)` | `(searchValue: string \| RegExp, replaceValue: string \| ((substring: string, ...args: any[]) => string)) => string` | `string` | Replace first match |
| `replaceAll(searchValue, replaceValue)` | `(searchValue: string \| RegExp, replaceValue: string \| ((substring: string, ...args: any[]) => string)) => string` | `string` | Replace all matches |
| `search(regexp)` | `(regexp: string \| RegExp) => number` | `number` | Search index |
| `slice(start?, end?)` | `(start?: number, end?: number) => string` | `string` | Extract substring |
| `split(separator?, limit?)` | `(separator?: string \| RegExp, limit?: number) => string[]` | `string[]` | Split into array |
| `startsWith(searchString, position?)` | `(searchString: string, position?: number) => boolean` | `boolean` | Check prefix |
| `endsWith(searchString, endPosition?)` | `(searchString: string, endPosition?: number) => boolean` | `boolean` | Check suffix |
| `substring(start, end?)` | `(start: number, end?: number) => string` | `string` | Extract substring |
| `toLowerCase()` | `() => string` | `string` | Convert to lowercase |
| `toUpperCase()` | `() => string` | `string` | Convert to uppercase |
| `trim()` | `() => string` | `string` | Remove whitespace |
| `trimStart()` | `() => string` | `string` | Remove leading whitespace |
| `trimEnd()` | `() => string` | `string` | Remove trailing whitespace |

**String Static Methods:**

```typescript
String.fromCharCode(...codes: number[]): string;
String.fromCodePoint(...codePoints: number[]): string;
String.raw(template: TemplateStringsArray, ...substitutions: any[]): string;
```

**Number**: Numeric operations and conversions.

**Complete API Reference:**

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `toExponential(fractionDigits?)` | `(fractionDigits?: number) => string` | `string` | Exponential notation |
| `toFixed(fractionDigits?)` | `(fractionDigits?: number) => string` | `string` | Fixed-point notation |
| `toPrecision(precision?)` | `(precision?: number) => string` | `string` | Precision notation |
| `toString(radix?)` | `(radix?: number) => string` | `string` | String representation |
| `valueOf()` | `() => number` | `number` | Primitive value |

**Number Static Methods:**

```typescript
Number.isNaN(value: unknown): boolean;
Number.isFinite(value: unknown): boolean;
Number.isInteger(value: unknown): boolean;
Number.isSafeInteger(value: unknown): boolean;
Number.parseFloat(string: string): number;
Number.parseInt(string: string, radix?: number): number;
```

**Boolean**: Boolean wrapper (rarely used directly).

```typescript
const bool: Boolean = new Boolean(true);
const primitive: boolean = bool.valueOf(); // true
```

**BigInt**: Arbitrary-precision integers.

**Complete API Reference:**

```typescript
// Constructor
new BigInt(value: string | number | bigint): bigint; // ❌ Cannot use 'new'
BigInt(value: string | number | bigint): bigint; // ✅ Correct

// Methods
bigint.toString(radix?: number): string;
bigint.valueOf(): bigint;

// Static methods
BigInt.asIntN(bits: number, bigint: bigint): bigint;
BigInt.asUintN(bits: number, bigint: bigint): bigint;
```

**Symbol**: Unique identifiers and well-known symbols.

**Complete API Reference:**

```typescript
// Constructor
new Symbol(description?: string): Symbol; // ❌ Cannot use 'new'
Symbol(description?: string): symbol; // ✅ Correct

// Static methods
Symbol.for(key: string): symbol;
Symbol.keyFor(sym: symbol): string | undefined;

// Well-known symbols
Symbol.iterator: symbol;
Symbol.asyncIterator: symbol;
Symbol.hasInstance: symbol;
Symbol.isConcatSpreadable: symbol;
Symbol.match: symbol;
Symbol.matchAll: symbol;
Symbol.replace: symbol;
Symbol.search: symbol;
Symbol.species: symbol;
Symbol.split: symbol;
Symbol.toPrimitive: symbol;
Symbol.toStringTag: symbol;
Symbol.unscopables: symbol;
```

#### 9.13.2 Global Objects

**Math**: Mathematical constants and functions.

**Complete API Reference:**

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `abs(x)` | `(x: number) => number` | `number` | Absolute value |
| `acos(x)` | `(x: number) => number` | `number` | Arccosine |
| `acosh(x)` | `(x: number) => number` | `number` | Hyperbolic arccosine |
| `asin(x)` | `(x: number) => number` | `number` | Arcsine |
| `asinh(x)` | `(x: number) => number` | `number` | Hyperbolic arcsine |
| `atan(x)` | `(x: number) => number` | `number` | Arctangent |
| `atan2(y, x)` | `(y: number, x: number) => number` | `number` | Arctangent of y/x |
| `atanh(x)` | `(x: number) => number` | `number` | Hyperbolic arctangent |
| `cbrt(x)` | `(x: number) => number` | `number` | Cube root |
| `ceil(x)` | `(x: number) => number` | `number` | Round up |
| `cos(x)` | `(x: number) => number` | `number` | Cosine |
| `cosh(x)` | `(x: number) => number` | `number` | Hyperbolic cosine |
| `exp(x)` | `(x: number) => number` | `number` | e^x |
| `expm1(x)` | `(x: number) => number` | `number` | e^x - 1 |
| `floor(x)` | `(x: number) => number` | `number` | Round down |
| `fround(x)` | `(x: number) => number` | `number` | Nearest float32 |
| `hypot(...values)` | `(...values: number[]) => number` | `number` | Hypotenuse |
| `imul(x, y)` | `(x: number, y: number) => number` | `number` | 32-bit multiply |
| `log(x)` | `(x: number) => number` | `number` | Natural logarithm |
| `log1p(x)` | `(x: number) => number` | `number` | ln(1 + x) |
| `log10(x)` | `(x: number) => number` | `number` | Base-10 logarithm |
| `log2(x)` | `(x: number) => number` | `number` | Base-2 logarithm |
| `max(...values)` | `(...values: number[]) => number` | `number` | Maximum |
| `min(...values)` | `(...values: number[]) => number` | `number` | Minimum |
| `pow(x, y)` | `(x: number, y: number) => number` | `number` | x^y |
| `random()` | `() => number` | `number` | Random 0-1 |
| `round(x)` | `(x: number) => number` | `number` | Round nearest |
| `sign(x)` | `(x: number) => number` | `number` | Sign (-1, 0, 1) |
| `sin(x)` | `(x: number) => number` | `number` | Sine |
| `sinh(x)` | `(x: number) => number` | `number` | Hyperbolic sine |
| `sqrt(x)` | `(x: number) => number` | `number` | Square root |
| `tan(x)` | `(x: number) => number` | `number` | Tangent |
| `tanh(x)` | `(x: number) => number` | `number` | Hyperbolic tangent |
| `trunc(x)` | `(x: number) => number` | `number` | Truncate |

**Constants:**

```typescript
Math.E: number;        // Euler's constant (2.718...)
Math.LN2: number;     // Natural log of 2
Math.LN10: number;    // Natural log of 10
Math.LOG2E: number;   // Log base 2 of e
Math.LOG10E: number;  // Log base 10 of e
Math.PI: number;      // Pi (3.14159...)
Math.SQRT1_2: number; // Square root of 1/2
Math.SQRT2: number;   // Square root of 2
```

**JSON**: JSON serialization and parsing.

**Complete API Reference:**

```typescript
JSON.parse(text: string, reviver?: (key: string, value: any) => any): any;
JSON.stringify(value: any, replacer?: ((key: string, value: any) => any) | (string | number)[]) | null, space?: string | number): string;
```

**Reflect**: Reflection operations on objects.

**Complete API Reference:**

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `apply(target, thisArgument, argumentsList)` | `(target: Function, thisArgument: any, argumentsList: ArrayLike<any>) => any` | `any` | Call function |
| `construct(target, argumentsList, newTarget?)` | `(target: Function, argumentsList: ArrayLike<any>, newTarget?: Function) => any` | `any` | Construct object |
| `defineProperty(target, propertyKey, attributes)` | `(target: object, propertyKey: string \| symbol, attributes: PropertyDescriptor) => boolean` | `boolean` | Define property |
| `deleteProperty(target, propertyKey)` | `(target: object, propertyKey: string \| symbol) => boolean` | `boolean` | Delete property |
| `get(target, propertyKey, receiver?)` | `(target: object, propertyKey: string \| symbol, receiver?: any) => any` | `any` | Get property |
| `getOwnPropertyDescriptor(target, propertyKey)` | `(target: object, propertyKey: string \| symbol) => PropertyDescriptor \| undefined` | `PropertyDescriptor \| undefined` | Get descriptor |
| `getPrototypeOf(target)` | `(target: object) => object \| null` | `object \| null` | Get prototype |
| `has(target, propertyKey)` | `(target: object, propertyKey: string \| symbol) => boolean` | `boolean` | Check property |
| `isExtensible(target)` | `(target: object) => boolean` | `boolean` | Check extensible |
| `ownKeys(target)` | `(target: object) => (string \| symbol)[]` | `(string \| symbol)[]` | Get own keys |
| `preventExtensions(target)` | `(target: object) => boolean` | `boolean` | Prevent extensions |
| `set(target, propertyKey, value, receiver?)` | `(target: object, propertyKey: string \| symbol, value: any, receiver?: any) => boolean` | `boolean` | Set property |
| `setPrototypeOf(target, proto)` | `(target: object, proto: object \| null) => boolean` | `boolean` | Set prototype |

**Atomics**: Atomic operations for SharedArrayBuffer.

**Complete API Reference:**

```typescript
Atomics.add(typedArray: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array, index: number, value: number): number;
Atomics.and(typedArray: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array, index: number, value: number): number;
Atomics.compareExchange(typedArray: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array, index: number, expectedValue: number, replacementValue: number): number;
Atomics.exchange(typedArray: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array, index: number, value: number): number;
Atomics.isLockFree(size: number): boolean;
Atomics.load(typedArray: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array, index: number): number;
Atomics.notify(typedArray: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array, index: number, count?: number): number;
Atomics.or(typedArray: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array, index: number, value: number): number;
Atomics.store(typedArray: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array, index: number, value: number): number;
Atomics.sub(typedArray: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array, index: number, value: number): number;
Atomics.wait(typedArray: Int32Array | BigInt64Array, index: number, value: number, timeout?: number): "ok" | "not-equal" | "timed-out";
Atomics.xor(typedArray: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array, index: number, value: number): number;
```

#### 9.13.3 Collections — Complete API Reference

**Map<K, V>**: Key-value pairs with any key type.

**Complete API Reference:**

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `clear()` | `() => void` | `void` | Remove all entries |
| `delete(key)` | `(key: K) => boolean` | `boolean` | Remove entry |
| `forEach(callbackfn, thisArg?)` | `(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any) => void` | `void` | Iterate entries |
| `get(key)` | `(key: K) => V \| undefined` | `V \| undefined` | Get value |
| `has(key)` | `(key: K) => boolean` | `boolean` | Check key |
| `set(key, value)` | `(key: K, value: V) => this` | `this` | Set entry |
| `size` | `readonly number` | `number` | Entry count |

**Map Iteration:**

```typescript
map.keys(): IterableIterator<K>;
map.values(): IterableIterator<V>;
map.entries(): IterableIterator<[K, V]>;
map[Symbol.iterator](): IterableIterator<[K, V]>;
```

**Set<T>**: Collection of unique values.

**Complete API Reference:**

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `add(value)` | `(value: T) => this` | `this` | Add value |
| `clear()` | `() => void` | `void` | Remove all values |
| `delete(value)` | `(value: T) => boolean` | `boolean` | Remove value |
| `forEach(callbackfn, thisArg?)` | `(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any) => void` | `void` | Iterate values |
| `has(value)` | `(value: T) => boolean` | `boolean` | Check value |
| `size` | `readonly number` | `number` | Value count |

**Set Iteration:**

```typescript
set.keys(): IterableIterator<T>;
set.values(): IterableIterator<T>;
set.entries(): IterableIterator<[T, T]>;
set[Symbol.iterator](): IterableIterator<T>;
```

**WeakMap<K, V>**: Map with weak references (keys must be objects).

**Complete API Reference:**

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `delete(key)` | `(key: K) => boolean` | `boolean` | Remove entry |
| `get(key)` | `(key: K) => V \| undefined` | `V \| undefined` | Get value |
| `has(key)` | `(key: K) => boolean` | `boolean` | Check key |
| `set(key, value)` | `(key: K, value: V) => this` | `this` | Set entry |

**WeakSet<T>**: Set with weak references (values must be objects).

**Complete API Reference:**

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `add(value)` | `(value: T) => this` | `this` | Add value |
| `delete(value)` | `(value: T) => boolean` | `boolean` | Remove value |
| `has(value)` | `(value: T) => boolean` | `boolean` | Check value |

**Pitfalls & Warnings:**

❌ **WeakMap/WeakSet Key Constraints:**

```typescript
// ❌ INCORRECT: Primitives cannot be WeakMap keys
const weakMap = new WeakMap<string, number>(); // Type error
weakMap.set("key", 42); // Runtime error

// ✅ CORRECT: Only objects/symbols as keys
const weakMap = new WeakMap<object, number>();
const key = { id: 1 };
weakMap.set(key, 42);
```

❌ **Map vs Object Confusion:**

```typescript
// ❌ INCORRECT: Using object as Map
const map: Record<string, number> = {};
map[Symbol("key")] = 42; // Symbol keys don't work

// ✅ CORRECT: Use Map for any key type
const map = new Map<symbol, number>();
map.set(Symbol("key"), 42);
```

#### 9.13.4 Typed Arrays & ArrayBuffer

**ArrayBuffer**: Fixed-length binary data buffer.

**Complete API Reference:**

```typescript
new ArrayBuffer(byteLength: number): ArrayBuffer;

// Properties
buffer.byteLength: number;
buffer.slice(begin: number, end?: number): ArrayBuffer;

// Static methods
ArrayBuffer.isView(arg: any): boolean;
```

**Typed Arrays**: Views over ArrayBuffer.

**Complete Typed Array Types:**

| Type | Bytes per Element | Signed | Range |
|------|-------------------|--------|-------|
| `Int8Array` | 1 | Yes | -128 to 127 |
| `Uint8Array` | 1 | No | 0 to 255 |
| `Uint8ClampedArray` | 1 | No | 0 to 255 (clamped) |
| `Int16Array` | 2 | Yes | -32,768 to 32,767 |
| `Uint16Array` | 2 | No | 0 to 65,535 |
| `Int32Array` | 4 | Yes | -2^31 to 2^31-1 |
| `Uint32Array` | 4 | No | 0 to 2^32-1 |
| `BigInt64Array` | 8 | Yes | -2^63 to 2^63-1 |
| `BigUint64Array` | 8 | No | 0 to 2^64-1 |
| `Float32Array` | 4 | N/A | IEEE 754 single |
| `Float64Array` | 8 | N/A | IEEE 754 double |

**Common Typed Array Methods:**

```typescript
// Constructor overloads
new TypedArray(length: number): TypedArray;
new TypedArray(array: ArrayLike<number> | ArrayBufferLike): TypedArray;
new TypedArray(buffer: ArrayBufferLike, byteOffset?: number, length?: number): TypedArray;

// Properties
array.buffer: ArrayBuffer;
array.byteLength: number;
array.byteOffset: number;
array.length: number;

// Methods
array.copyWithin(target: number, start: number, end?: number): this;
array.entries(): IterableIterator<[number, number]>;
array.fill(value: number, start?: number, end?: number): this;
array.filter(predicate: (value: number, index: number, array: TypedArray) => boolean): TypedArray;
array.find(predicate: (value: number, index: number, array: TypedArray) => boolean): number | undefined;
array.findIndex(predicate: (value: number, index: number, array: TypedArray) => number): number;
array.forEach(callbackfn: (value: number, index: number, array: TypedArray) => void): void;
array.includes(searchElement: number, fromIndex?: number): boolean;
array.indexOf(searchElement: number, fromIndex?: number): number;
array.join(separator?: string): string;
array.keys(): IterableIterator<number>;
array.lastIndexOf(searchElement: number, fromIndex?: number): number;
array.map(callbackfn: (value: number, index: number, array: TypedArray) => number): TypedArray;
array.reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: TypedArray) => number, initialValue?: number): number;
array.reverse(): TypedArray;
array.set(array: ArrayLike<number>, offset?: number): void;
array.slice(start?: number, end?: number): TypedArray;
array.some(predicate: (value: number, index: number, array: TypedArray) => boolean): boolean;
array.sort(compareFn?: (a: number, b: number) => number): this;
array.subarray(begin?: number, end?: number): TypedArray;
array.values(): IterableIterator<number>;
```

**DataView**: Multi-format view over ArrayBuffer.

**Complete API Reference:**

```typescript
new DataView(buffer: ArrayBufferLike, byteOffset?: number, byteLength?: number): DataView;

// Properties
view.buffer: ArrayBuffer;
view.byteLength: number;
view.byteOffset: number;

// Get methods
view.getInt8(byteOffset: number): number;
view.getUint8(byteOffset: number): number;
view.getInt16(byteOffset: number, littleEndian?: boolean): number;
view.getUint16(byteOffset: number, littleEndian?: boolean): number;
view.getInt32(byteOffset: number, littleEndian?: boolean): number;
view.getUint32(byteOffset: number, littleEndian?: boolean): number;
view.getBigInt64(byteOffset: number, littleEndian?: boolean): bigint;
view.getBigUint64(byteOffset: number, littleEndian?: boolean): bigint;
view.getFloat32(byteOffset: number, littleEndian?: boolean): number;
view.getFloat64(byteOffset: number, littleEndian?: boolean): number;

// Set methods
view.setInt8(byteOffset: number, value: number): void;
view.setUint8(byteOffset: number, value: number): void;
view.setInt16(byteOffset: number, value: number, littleEndian?: boolean): void;
view.setUint16(byteOffset: number, value: number, littleEndian?: boolean): void;
view.setInt32(byteOffset: number, value: number, littleEndian?: boolean): void;
view.setUint32(byteOffset: number, value: number, littleEndian?: boolean): void;
view.setBigInt64(byteOffset: number, value: bigint, littleEndian?: boolean): void;
view.setBigUint64(byteOffset: number, value: bigint, littleEndian?: boolean): void;
view.setFloat32(byteOffset: number, value: number, littleEndian?: boolean): void;
view.setFloat64(byteOffset: number, value: number, littleEndian?: boolean): void;
```

#### 9.13.5 Date & Intl

**Date**: Date and time manipulation.

**Complete API Reference:**

**Constructor:**

```typescript
new Date(): Date; // Current date/time
new Date(value: number | string): Date; // From timestamp or string
new Date(year: number, monthIndex: number, date?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number): Date;
```

**Instance Methods:**

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `getDate()` | `() => number` | `number` | Day of month (1-31) |
| `getDay()` | `() => number` | `number` | Day of week (0-6) |
| `getFullYear()` | `() => number` | `number` | Full year |
| `getHours()` | `() => number` | `number` | Hours (0-23) |
| `getMilliseconds()` | `() => number` | `number` | Milliseconds (0-999) |
| `getMinutes()` | `() => number` | `number` | Minutes (0-59) |
| `getMonth()` | `() => number` | `number` | Month (0-11) |
| `getSeconds()` | `() => number` | `number` | Seconds (0-59) |
| `getTime()` | `() => number` | `number` | Timestamp (ms) |
| `getTimezoneOffset()` | `() => number` | `number` | Timezone offset (min) |
| `getUTCDate()` | `() => number` | `number` | UTC day of month |
| `getUTCDay()` | `() => number` | `number` | UTC day of week |
| `getUTCFullYear()` | `() => number` | `number` | UTC full year |
| `getUTCHours()` | `() => number` | `number` | UTC hours |
| `getUTCMilliseconds()` | `() => number` | `number` | UTC milliseconds |
| `getUTCMinutes()` | `() => number` | `number` | UTC minutes |
| `getUTCMonth()` | `() => number` | `number` | UTC month |
| `getUTCSeconds()` | `() => number` | `number` | UTC seconds |
| `setDate(date)` | `(date: number) => number` | `number` | Set day of month |
| `setFullYear(year, month?, date?)` | `(year: number, month?: number, date?: number) => number` | `number` | Set year |
| `setHours(hours, min?, sec?, ms?)` | `(hours: number, min?: number, sec?: number, ms?: number) => number` | `number` | Set hours |
| `setMilliseconds(ms)` | `(ms: number) => number` | `number` | Set milliseconds |
| `setMinutes(min, sec?, ms?)` | `(min: number, sec?: number, ms?: number) => number` | `number` | Set minutes |
| `setMonth(month, date?)` | `(month: number, date?: number) => number` | `number` | Set month |
| `setSeconds(sec, ms?)` | `(sec: number, ms?: number) => number` | `number` | Set seconds |
| `setTime(time)` | `(time: number) => number` | `number` | Set timestamp |
| `setUTCDate(date)` | `(date: number) => number` | `number` | Set UTC day |
| `setUTCFullYear(year, month?, date?)` | `(year: number, month?: number, date?: number) => number` | `number` | Set UTC year |
| `setUTCHours(hours, min?, sec?, ms?)` | `(hours: number, min?: number, sec?: number, ms?: number) => number` | `number` | Set UTC hours |
| `setUTCMilliseconds(ms)` | `(ms: number) => number` | `number` | Set UTC milliseconds |
| `setUTCMinutes(min, sec?, ms?)` | `(min: number, sec?: number, ms?: number) => number` | `number` | Set UTC minutes |
| `setUTCMonth(month, date?)` | `(month: number, date?: number) => number` | `number` | Set UTC month |
| `setUTCSeconds(sec, ms?)` | `(sec: number, ms?: number) => number` | `number` | Set UTC seconds |
| `toDateString()` | `() => string` | `string` | Date string |
| `toISOString()` | `() => string` | `string` | ISO 8601 string |
| `toJSON(key?)` | `(key?: any) => string` | `string` | JSON string |
| `toLocaleDateString(locales?, options?)` | `(locales?: string \| string[], options?: Intl.DateTimeFormatOptions) => string` | `string` | Localized date |
| `toLocaleString(locales?, options?)` | `(locales?: string \| string[], options?: Intl.DateTimeFormatOptions) => string` | `string` | Localized string |
| `toLocaleTimeString(locales?, options?)` | `(locales?: string \| string[], options?: Intl.DateTimeFormatOptions) => string` | `string` | Localized time |
| `toString()` | `() => string` | `string` | String representation |
| `toTimeString()` | `() => string` | `string` | Time string |
| `toUTCString()` | `() => string` | `string` | UTC string |
| `valueOf()` | `() => number` | `number` | Timestamp |

**Static Methods:**

```typescript
Date.now(): number; // Current timestamp
Date.parse(dateString: string): number; // Parse string
Date.UTC(year: number, monthIndex: number, date?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number): number;
```

**Intl**: Internationalization APIs.

**Intl.DateTimeFormat**: Date/time formatting.

```typescript
new Intl.DateTimeFormat(locales?: string | string[], options?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat;

interface Intl.DateTimeFormatOptions {
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
  calendar?: string;
  dayPeriod?: "narrow" | "short" | "long";
  numberingSystem?: string;
  localeMatcher?: "lookup" | "best fit";
  timeZone?: string;
  hour12?: boolean;
  hourCycle?: "h11" | "h12" | "h23" | "h24";
  formatMatcher?: "basic" | "best fit";
  weekday?: "narrow" | "short" | "long";
  era?: "narrow" | "short" | "long";
  year?: "numeric" | "2-digit";
  month?: "numeric" | "2-digit" | "narrow" | "short" | "long";
  day?: "numeric" | "2-digit";
  hour?: "numeric" | "2-digit";
  minute?: "numeric" | "2-digit";
  second?: "numeric" | "2-digit";
  fractionalSecondDigits?: 1 | 2 | 3;
  timeZoneName?: "short" | "long" | "shortOffset" | "longOffset" | "shortGeneric" | "longGeneric";
}

// Methods
formatter.format(date?: Date | number): string;
formatter.formatToParts(date?: Date | number): Intl.DateTimeFormatPart[];
formatter.formatRange(startDate: Date | number, endDate: Date | number): string;
formatter.formatRangeToParts(startDate: Date | number, endDate: Date | number): Intl.DateTimeFormatPart[];
formatter.resolvedOptions(): ResolvedDateTimeFormatOptions;
```

**Intl.NumberFormat**: Number formatting.

```typescript
new Intl.NumberFormat(locales?: string | string[], options?: Intl.NumberFormatOptions): Intl.NumberFormat;

interface Intl.NumberFormatOptions {
  localeMatcher?: "lookup" | "best fit";
  style?: "decimal" | "currency" | "percent" | "unit";
  currency?: string;
  currencyDisplay?: "symbol" | "narrowSymbol" | "code" | "name";
  currencySign?: "standard" | "accounting";
  useGrouping?: boolean | "auto" | "always" | "min2" | "thousands" | "lakh" | "wan";
  minimumIntegerDigits?: number;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  minimumSignificantDigits?: number;
  maximumSignificantDigits?: number;
  notation?: "standard" | "scientific" | "engineering" | "compact";
  compactDisplay?: "short" | "long";
  signDisplay?: "auto" | "never" | "always" | "exceptZero" | "negative";
  unit?: string;
  unitDisplay?: "short" | "narrow" | "long";
  numberingSystem?: string;
  roundingMode?: "ceil" | "floor" | "expand" | "trunc" | "halfCeil" | "halfFloor" | "halfExpand" | "halfTrunc" | "halfEven";
  roundingPriority?: "auto" | "morePrecision" | "lessPrecision";
  roundingIncrement?: number;
  trailingZeroDisplay?: "auto" | "stripIfInteger";
}

// Methods
formatter.format(value: number | bigint): string;
formatter.formatToParts(value: number | bigint): Intl.NumberFormatPart[];
formatter.formatRange(start: number | bigint, end: number | bigint): string;
formatter.formatRangeToParts(start: number | bigint, end: number | bigint): Intl.NumberFormatPart[];
formatter.resolvedOptions(): ResolvedNumberFormatOptions;
```

**Intl.Collator**: String collation (sorting).

```typescript
new Intl.Collator(locales?: string | string[], options?: Intl.CollatorOptions): Intl.Collator;

interface Intl.CollatorOptions {
  localeMatcher?: "lookup" | "best fit";
  usage?: "sort" | "search";
  sensitivity?: "base" | "accent" | "case" | "variant";
  ignorePunctuation?: boolean;
  numeric?: boolean;
  caseFirst?: "upper" | "lower" | "false";
}

// Methods
collator.compare(a: string, b: string): number;
collator.resolvedOptions(): ResolvedCollatorOptions;
```

**Intl.PluralRules**: Pluralization rules.

```typescript
new Intl.PluralRules(locales?: string | string[], options?: Intl.PluralRulesOptions): Intl.PluralRules;

interface Intl.PluralRulesOptions {
  localeMatcher?: "lookup" | "best fit";
  type?: "cardinal" | "ordinal";
}

// Methods
pluralRules.select(n: number): "zero" | "one" | "two" | "few" | "many" | "other";
pluralRules.resolvedOptions(): ResolvedPluralRulesOptions;
```

**Intl.RelativeTimeFormat**: Relative time formatting.

```typescript
new Intl.RelativeTimeFormat(locales?: string | string[], options?: Intl.RelativeTimeFormatOptions): Intl.RelativeTimeFormat;

interface Intl.RelativeTimeFormatOptions {
  localeMatcher?: "lookup" | "best fit";
  numeric?: "always" | "auto";
  style?: "long" | "short" | "narrow";
}

// Methods
formatter.format(value: number, unit: Intl.RelativeTimeFormatUnit): string;
formatter.formatToParts(value: number, unit: Intl.RelativeTimeFormatUnit): Intl.RelativeTimeFormatPart[];
formatter.resolvedOptions(): ResolvedRelativeTimeFormatOptions;
```

**Intl.ListFormat**: List formatting.

```typescript
new Intl.ListFormat(locales?: string | string[], options?: Intl.ListFormatOptions): Intl.ListFormat;

interface Intl.ListFormatOptions {
  localeMatcher?: "lookup" | "best fit";
  type?: "conjunction" | "disjunction" | "unit";
  style?: "long" | "short" | "narrow";
}

// Methods
formatter.format(list: Iterable<string>): string;
formatter.formatToParts(list: Iterable<string>): Intl.ListFormatPart[];
formatter.resolvedOptions(): ResolvedListFormatOptions;
```

**Intl.Locale**: Locale information.

```typescript
new Intl.Locale(tag: string, options?: Intl.LocaleOptions): Intl.Locale;

interface Intl.LocaleOptions {
  calendar?: string;
  collation?: string;
  hourCycle?: "h11" | "h12" | "h23" | "h24";
  caseFirst?: "upper" | "lower" | "false";
  numberingSystem?: string;
  numeric?: boolean;
  language?: string;
  script?: string;
  region?: string;
}

// Properties
locale.baseName: string;
locale.calendar: string | undefined;
locale.caseFirst: string | undefined;
locale.collation: string | undefined;
locale.hourCycle: string | undefined;
locale.numberingSystem: string | undefined;
locale.numeric: boolean | undefined;
locale.language: string;
locale.script: string | undefined;
locale.region: string | undefined;

// Methods
locale.toString(): string;
locale.maximize(): Intl.Locale;
locale.minimize(): Intl.Locale;
```

#### 9.13.6 Iteration & Generators

**Iterable<T>**: Objects that can be iterated.

```typescript
interface Iterable<T> {
  [Symbol.iterator](): Iterator<T>;
}
```

**Iterator<T>**: Iterator protocol.

```typescript
interface Iterator<T, TReturn = any, TNext = undefined> {
  next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
  return?(value?: TReturn): IteratorResult<T, TReturn>;
  throw?(e?: any): IteratorResult<T, TReturn>;
}

interface IteratorResult<T, TReturn = any> {
  done: boolean;
  value: T | TReturn;
}
```

**AsyncIterable<T>**: Async iteration.

```typescript
interface AsyncIterable<T> {
  [Symbol.asyncIterator](): AsyncIterator<T>;
}

interface AsyncIterator<T, TReturn = any, TNext = undefined> {
  next(...args: [] | [TNext]): Promise<IteratorResult<T, TReturn>>;
  return?(value?: TReturn): Promise<IteratorResult<T, TReturn>>;
  throw?(e?: any): Promise<IteratorResult<T, TReturn>>;
}
```

**Generator<T, TReturn, TNext>**: Generator functions.

```typescript
interface Generator<T = unknown, TReturn = any, TNext = unknown> extends Iterator<T, TReturn, TNext> {
  next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
  return(value: TReturn): IteratorResult<T, TReturn>;
  throw(e: any): IteratorResult<T, TReturn>;
  [Symbol.iterator](): Generator<T, TReturn, TNext>;
}

interface AsyncGenerator<T = unknown, TReturn = any, TNext = unknown> extends AsyncIterator<T, TReturn, TNext> {
  next(...args: [] | [TNext]): Promise<IteratorResult<T, TReturn>>;
  return(value: TReturn): Promise<IteratorResult<T, TReturn>>;
  throw(e: any): Promise<IteratorResult<T, TReturn>>;
  [Symbol.asyncIterator](): AsyncGenerator<T, TReturn, TNext>;
}
```

**Example — Generator Function:**

```typescript
function* countTo(n: number): Generator<number> {
  for (let i = 1; i <= n; i++) {
    yield i;
  }
}

const gen = countTo(5);
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
// ... until done: true
```

**Example — Async Generator:**

```typescript
async function* fetchPages(url: string): AsyncGenerator<string> {
  let page = 1;
  while (true) {
    const response = await fetch(`${url}?page=${page}`);
    if (!response.ok) break;
    yield await response.text();
    page++;
  }
}

for await (const page of fetchPages("/api/data")) {
  console.log(page);
}
```

#### 9.13.7 Promise & Async Operations

**Promise<T>**: Asynchronous operations.

**Complete API Reference:**

**Constructor:**

```typescript
new Promise<T>(executor: (resolve: (value: T | PromiseLike<T>) => void) => void, reject: (reason?: any) => void) => void): Promise<T>;
```

**Instance Methods:**

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `then(onFulfilled?, onRejected?)` | `(onFulfilled?: ((value: T) => TResult1 \| PromiseLike<TResult1>) \| null \| undefined, onRejected?: ((reason: any) => TResult2 \| PromiseLike<TResult2>) \| null \| undefined) => Promise<TResult1 \| TResult2>` | `Promise<TResult1 \| TResult2>` | Chain promise |
| `catch(onRejected?)` | `(onRejected?: ((reason: any) => TResult \| PromiseLike<TResult>) \| null \| undefined) => Promise<T \| TResult>` | `Promise<T \| TResult>` | Handle rejection |
| `finally(onFinally?)` | `(onFinally?: (() => void) \| null \| undefined) => Promise<T>` | `Promise<T>` | Always execute |

**Static Methods:**

```typescript
Promise.all<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: Awaited<T[P]>; }>;
Promise.allSettled<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: PromiseSettledResult<Awaited<T[P]>>; }>;
Promise.any<T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>>;
Promise.race<T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>>;
Promise.reject<T = never>(reason?: any): Promise<T>;
Promise.resolve<T>(value: T | PromiseLike<T>): Promise<Awaited<T>>;
```

**PromiseLike<T>**: Thenable interface.

```typescript
interface PromiseLike<T> {
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined
  ): PromiseLike<TResult1 | TResult2>;
}
```

**PromiseSettledResult<T>**: Result of settled promise.

```typescript
type PromiseSettledResult<T> = 
  | { status: "fulfilled"; value: T }
  | { status: "rejected"; reason: any };
```

**Awaited<T>**: Utility type for awaited values.

```typescript
type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
```

**Pitfalls & Warnings:**

❌ **Promise Constructor Anti-Pattern:**

```typescript
// ❌ INCORRECT: Wrapping already-promise value
function fetchData(): Promise<Response> {
  return new Promise((resolve) => {
    resolve(fetch("/api/data")); // Double-wrapping
  });
}

// ✅ CORRECT: Return promise directly
function fetchData(): Promise<Response> {
  return fetch("/api/data");
}
```

❌ **Unhandled Promise Rejection:**

```typescript
// ❌ INCORRECT: Unhandled rejection
async function process() {
  await riskyOperation(); // May throw
}

// ✅ CORRECT: Handle errors
async function process() {
  try {
    await riskyOperation();
  } catch (error) {
    console.error(error);
  }
}
```

**Try This:**

1. Create a `Promise.all` that handles multiple async operations
2. Use `Promise.allSettled` to handle partial failures
3. Implement a retry mechanism with exponential backoff
4. Create a timeout wrapper for promises

#### 9.13.8 ES2021 Features: WeakRef, FinalizationRegistry, AggregateError

**WeakRef<T>** (ES2021): Weak reference to an object that doesn't prevent garbage collection.

**Complete API Reference:**

```typescript
class WeakRef<T extends object> {
  constructor(target: T);
  deref(): T | undefined; // Returns target if still alive, undefined if collected
}

// Example: Cache with automatic cleanup
class WeakCache<K extends object, V> {
  private cache = new Map<K, WeakRef<V>>();
  
  set(key: K, value: V): void {
    this.cache.set(key, new WeakRef(value));
  }
  
  get(key: K): V | undefined {
    const ref = this.cache.get(key);
    if (!ref) return undefined;
    
    const value = ref.deref();
    if (value === undefined) {
      // Garbage collected, remove from cache
      this.cache.delete(key);
    }
    return value;
  }
}
```

**FinalizationRegistry<T>** (ES2021): Register cleanup callbacks for objects when they're garbage collected.

**Complete API Reference:**

```typescript
class FinalizationRegistry<T> {
  constructor(cleanupCallback: (heldValue: T) => void);
  register(target: object, heldValue: T, unregisterToken?: object): void;
  unregister(unregisterToken: object): boolean;
}

// Example: Cleanup file handles when objects are collected
class FileHandle {
  constructor(private path: string) {
    this.open();
  }
  
  private open(): void {
    // Open file
  }
  
  close(): void {
    // Close file
  }
}

const registry = new FinalizationRegistry<string>((path) => {
  console.log(`Cleaning up file: ${path}`);
  // Perform cleanup
});

function createFileHandle(path: string): FileHandle {
  const handle = new FileHandle(path);
  registry.register(handle, path);
  return handle;
}
```

**AggregateError** (ES2021): Error that aggregates multiple errors.

**Complete API Reference:**

```typescript
class AggregateError extends Error {
  constructor(
    errors: Iterable<any>,
    message?: string,
    options?: ErrorOptions
  );
  
  errors: readonly any[]; // Array of aggregated errors
  name: "AggregateError";
}

// Example: Collecting multiple promise rejections
async function processMultiple(data: unknown[]): Promise<void> {
  const errors: Error[] = [];
  
  for (const item of data) {
    try {
      await processItem(item);
    } catch (error) {
      errors.push(error instanceof Error ? error : new Error(String(error)));
    }
  }
  
  if (errors.length > 0) {
    throw new AggregateError(errors, "Multiple processing errors occurred");
  }
}

// Handling AggregateError
try {
  await processMultiple(data);
} catch (error) {
  if (error instanceof AggregateError) {
    console.error(`Failed ${error.errors.length} items:`);
    error.errors.forEach((err, i) => {
      console.error(`  ${i + 1}: ${err.message}`);
    });
  } else {
    throw error;
  }
}
```

**Intl.Segmenter** (ES2021): Text segmentation (grapheme clusters, words, sentences).

**Complete API Reference:**

```typescript
class Intl.Segmenter {
  constructor(
    locales?: string | string[],
    options?: Intl.SegmenterOptions
  );
  
  interface Intl.SegmenterOptions {
    localeMatcher?: "lookup" | "best fit";
    granularity?: "grapheme" | "word" | "sentence";
  }
  
  segment(input: string): Segments;
  resolvedOptions(): ResolvedSegmenterOptions;
}

interface Segments {
  containing(index: number): SegmentData | undefined;
  [Symbol.iterator](): IterableIterator<SegmentData>;
}

interface SegmentData {
  segment: string;
  index: number;
  input: string;
  isWordLike?: boolean; // For word granularity
}

// Example: Word segmentation
const segmenter = new Intl.Segmenter("en", { granularity: "word" });
const segments = segmenter.segment("Hello, world!");

for (const segment of segments) {
  console.log(segment.segment, segment.isWordLike);
  // "Hello" true
  // ", " false
  // "world" true
  // "!" false
}

// Example: Grapheme cluster segmentation (handles emoji correctly)
const graphemeSegmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
const graphemes = graphemeSegmenter.segment("👨‍👩‍👧‍👦");
console.log([...graphemes].map(s => s.segment)); 
// ["👨‍👩‍👧‍👦"] (single grapheme, not split)
```

**String Methods: Enhanced Examples**

**`replaceAll`** (ES2021): Replace all occurrences of a substring.

```typescript
// More examples for replaceAll
const text = "foo bar foo baz";
const replaced = text.replaceAll("foo", "qux");
// "qux bar qux baz"

// With RegExp (must use global flag)
const regexReplaced = text.replaceAll(/foo/g, "qux");
// "qux bar qux baz"

// With function replacer
const functionReplaced = text.replaceAll("foo", (match, offset) => {
  return match.toUpperCase() + offset;
});
// "FOO0 bar FOO8 baz"
```

**`matchAll`** (ES2021): Get all matches with capture groups.

```typescript
// More examples for matchAll
const text = "test1 test2 test3";
const regex = /test(\d)/g;

// Returns iterable of match objects with capture groups
for (const match of text.matchAll(regex)) {
  console.log(match[0]); // "test1", "test2", "test3"
  console.log(match[1]); // "1", "2", "3"
  console.log(match.index); // 0, 6, 12
}

// Convert to array
const matches = Array.from(text.matchAll(regex));
// [{ 0: "test1", 1: "1", index: 0, ... }, ...]
```

**Temporal API** (Stage 3 Proposal): Modern date/time API (not yet in standard library, but widely discussed).

**Note**: The Temporal API is a Stage 3 TC39 proposal and is not yet part of the ECMAScript standard. TypeScript types may be available via `@types/temporal` or polyfills.

```typescript
// Temporal API types (when available)
// These are conceptual - actual API may differ

interface Temporal.PlainDate {
  year: number;
  month: number;
  day: number;
  dayOfWeek: number;
  dayOfYear: number;
  weekOfYear: number;
  daysInMonth: number;
  daysInYear: number;
  inLeapYear: boolean;
  
  add(duration: Temporal.Duration): Temporal.PlainDate;
  subtract(duration: Temporal.Duration): Temporal.PlainDate;
  until(other: Temporal.PlainDate): Temporal.Duration;
  since(other: Temporal.PlainDate): Temporal.Duration;
  equals(other: Temporal.PlainDate): boolean;
  toString(): string;
  toJSON(): string;
}

interface Temporal.PlainTime {
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
  microsecond: number;
  nanosecond: number;
}

interface Temporal.PlainDateTime extends Temporal.PlainDate {
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
  microsecond: number;
  nanosecond: number;
}

interface Temporal.Duration {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  microseconds: number;
  nanoseconds: number;
  
  total(unit: string): number;
  negated(): Temporal.Duration;
  abs(): Temporal.Duration;
  add(other: Temporal.Duration): Temporal.Duration;
  subtract(other: Temporal.Duration): Temporal.Duration;
  round(options: Temporal.RoundingOptions): Temporal.Duration;
  toString(): string;
  toJSON(): string;
}

// Example usage (conceptual)
// const date = Temporal.PlainDate.from("2025-12-05");
// const tomorrow = date.add({ days: 1 });
// const duration = date.until(tomorrow);
```

**Pitfalls & Warnings:**

❌ **WeakRef Anti-Pattern:**

```typescript
// ❌ INCORRECT: Assuming WeakRef always has value
const ref = new WeakRef({ data: "value" });
const value = ref.deref(); // May be undefined if GC'd
value.data; // Runtime error if undefined

// ✅ CORRECT: Always check deref() result
const ref = new WeakRef({ data: "value" });
const value = ref.deref();
if (value !== undefined) {
  console.log(value.data);
}
```

❌ **FinalizationRegistry Timing:**

```typescript
// ❌ INCORRECT: Relying on exact cleanup timing
// FinalizationRegistry callbacks are not guaranteed to run immediately
// or at all - they're best-effort cleanup

// ✅ CORRECT: Use explicit cleanup when possible
class Resource {
  cleanup(): void {
    // Explicit cleanup
  }
}

// Use FinalizationRegistry as backup, not primary cleanup
```

---


<!-- SSM:CHUNK_BOUNDARY id="ch9-end" -->
