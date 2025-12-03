<!-- SSM:CHUNK_BOUNDARY id="ch20-start" -->
📘 CHAPTER 20 — NODE.JS TYPES & MODULES 🔴 Advanced

> **Quick Answer:**
> - Install `@types/node` for Node.js type definitions: `npm install --save-dev @types/node`
> - Node.js types are organized by module (fs, path, http, crypto, etc.)
> - Use `NodeJS.Process`, `NodeJS.Timeout`, `Buffer` for Node.js-specific types
> - Avoid mixing DOM types (`Window`, `Document`) with Node.js globals
>
> **Example — Correct Pattern:**
> ```typescript
> // ✅ CORRECT: Node.js types from @types/node
> import * as fs from "fs";
> import * as path from "path";
> 
> const filePath = path.join(__dirname, "data.txt");
> fs.readFile(filePath, "utf8", (err, data) => {
>   if (err) throw err;
>   console.log(data);
> });
> ```
>
> **Estimated time:** 3–4 hours to master Node.js types  
> **When you need this:** Building Node.js applications, CLI tools, servers, or any backend code

### 20.1 Global Types

**NodeJS.Process**: Node.js process object.

**Complete API Reference:**

```typescript
declare namespace NodeJS {
  interface Process extends EventEmitter {
    readonly argv: string[];
    readonly argv0: string;
    readonly execArgv: string[];
    readonly execPath: string;
    readonly abort: () => never;
    readonly chdir: (directory: string) => void;
    readonly cwd: () => string;
    readonly debugPort: number;
    readonly domain: Domain | null;
    readonly emitWarning: (warning: string | Error, name?: string, ctor?: Function) => void;
    readonly env: ProcessEnv;
    readonly exit: (code?: number) => never;
    readonly exitCode?: number | undefined;
    readonly getgid?: () => number;
    readonly getuid?: () => number;
    readonly hasUncaughtExceptionCaptureCallback: () => boolean;
    readonly hrtime: (time?: [number, number]) => [number, number];
    readonly hrtime.bigint: () => bigint;
    readonly initgroups: (user: number | string, extraGroup: number | string) => void;
    readonly kill: (pid: number, signal?: string | number) => void;
    readonly memoryUsage: () => MemoryUsage;
    readonly nextTick: (callback: Function, ...args: any[]) => void;
    readonly pid: number;
    readonly ppid: number;
    readonly platform: Platform;
    readonly release: ProcessRelease;
    readonly send?: ((message: any, sendHandle?: any, options?: { swallowErrors?: boolean | undefined }, callback?: (error: Error | null) => void) => boolean) | undefined;
    readonly setgid: (id: number | string) => void;
    readonly setgroups: (groups: ReadonlyArray<string | number>) => void;
    readonly setuid: (id: number | string) => void;
    readonly stderr: WriteStream;
    readonly stdin: ReadStream;
    readonly stdout: WriteStream;
    readonly title: string;
    readonly umask: (mask?: string | number) => number;
    readonly uptime: () => number;
    readonly version: string;
    readonly versions: ProcessVersions;
    
    // Event handlers
    on(event: "beforeExit", listener: (code: number) => void): this;
    on(event: "disconnect", listener: () => void): this;
    on(event: "exit", listener: (code: number) => void): this;
    on(event: "message", listener: (message: any, sendHandle: any) => void): this;
    on(event: "rejectionHandled", listener: (promise: Promise<any>) => void): this;
    on(event: "uncaughtException", listener: (error: Error) => void): this;
    on(event: "uncaughtExceptionMonitor", listener: (error: Error) => void): this;
    on(event: "unhandledRejection", listener: (reason: any, promise: Promise<any>) => void): this;
    on(event: "warning", listener: (warning: Error) => void): this;
    on(event: "worker", listener: (worker: Worker) => void): this;
  }
  
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
  
  interface ProcessRelease {
    name: string;
    sourceUrl?: string;
    headersUrl?: string;
    libUrl?: string;
    lts?: string;
  }
  
  interface ProcessVersions {
    node: string;
    v8: string;
    uv?: string;
    zlib?: string;
    brotli?: string;
    ares?: string;
    modules?: string;
    nghttp2?: string;
    napi?: string;
    llhttp?: string;
    openssl?: string;
    cldr?: string;
    icu?: string;
    tz?: string;
    unicode?: string;
  }
  
  type Platform = 
    | "aix"
    | "android"
    | "darwin"
    | "freebsd"
    | "linux"
    | "openbsd"
    | "sunos"
    | "win32"
    | "cygwin"
    | "netbsd";
}

declare var process: NodeJS.Process;
```

**NodeJS.Timeout**: Timer handle type.

**Complete API Reference:**

```typescript
declare namespace NodeJS {
  interface Timeout {
    ref(): this;
    unref(): this;
    refresh(): this;
    [Symbol.toPrimitive](): number;
  }
}

// Usage
const timeout: NodeJS.Timeout = setTimeout(() => {
  console.log("Delayed");
}, 1000);

timeout.ref(); // Keep event loop alive
timeout.unref(); // Allow process to exit
```

**Buffer**: Node.js buffer type.

**Complete API Reference:**

```typescript
interface Buffer extends Uint8Array {
  readonly buffer: ArrayBuffer;
  readonly byteOffset: number;
  readonly length: number;
  
  // Static methods
  static alloc(size: number, fill?: string | Buffer | number, encoding?: BufferEncoding): Buffer;
  static allocUnsafe(size: number): Buffer;
  static allocUnsafeSlow(size: number): Buffer;
  static from(arrayBuffer: ArrayBuffer | SharedArrayBuffer, byteOffset?: number, length?: number): Buffer;
  static from(data: Uint8Array): Buffer;
  static from(data: ReadonlyArray<any>): Buffer;
  static from(str: string, encoding?: BufferEncoding): Buffer;
  static isBuffer(obj: any): obj is Buffer;
  static isEncoding(encoding: string): encoding is BufferEncoding;
  static concat(list: ReadonlyArray<Uint8Array>, totalLength?: number): Buffer;
  static compare(buf1: Uint8Array, buf2: Uint8Array): number;
  
  // Instance methods
  compare(target: Uint8Array, targetStart?: number, targetEnd?: number, sourceStart?: number, sourceEnd?: number): number;
  copy(target: Uint8Array, targetStart?: number, sourceStart?: number, sourceEnd?: number): number;
  entries(): IterableIterator<[number, number]>;
  equals(otherBuffer: Uint8Array): boolean;
  fill(value: string | Uint8Array | number, offset?: number, end?: number, encoding?: BufferEncoding): this;
  includes(value: string | number | Buffer, byteOffset?: number, encoding?: BufferEncoding): boolean;
  indexOf(value: string | number | Uint8Array | Buffer, byteOffset?: number, encoding?: BufferEncoding): number;
  keys(): IterableIterator<number>;
  lastIndexOf(value: string | number | Uint8Array | Buffer, byteOffset?: number, encoding?: BufferEncoding): number;
  readBigInt64BE(offset?: number): bigint;
  readBigInt64LE(offset?: number): bigint;
  readBigUInt64BE(offset?: number): bigint;
  readBigUInt64LE(offset?: number): bigint;
  readDoubleBE(offset?: number): number;
  readDoubleLE(offset?: number): number;
  readFloatBE(offset?: number): number;
  readFloatLE(offset?: number): number;
  readInt8(offset?: number): number;
  readInt16BE(offset?: number): number;
  readInt16LE(offset?: number): number;
  readInt32BE(offset?: number): number;
  readInt32LE(offset?: number): number;
  readIntBE(offset: number, byteLength: number): number;
  readIntLE(offset: number, byteLength: number): number;
  readUInt8(offset?: number): number;
  readUInt16BE(offset?: number): number;
  readUInt16LE(offset?: number): number;
  readUInt32BE(offset?: number): number;
  readUInt32LE(offset?: number): number;
  readUIntBE(offset: number, byteLength: number): number;
  readUIntLE(offset: number, byteLength: number): number;
  subarray(start?: number, end?: number): Buffer;
  swap16(): Buffer;
  swap32(): Buffer;
  swap64(): Buffer;
  toJSON(): { type: "Buffer"; data: number[] };
  toString(encoding?: BufferEncoding, start?: number, end?: number): string;
  values(): IterableIterator<number>;
  write(string: string, encoding?: BufferEncoding): number;
  write(string: string, offset: number, encoding?: BufferEncoding): number;
  write(string: string, offset: number, length: number, encoding?: BufferEncoding): number;
  writeBigInt64BE(value: bigint, offset?: number): number;
  writeBigInt64LE(value: bigint, offset?: number): number;
  writeBigUInt64BE(value: bigint, offset?: number): number;
  writeBigUInt64LE(value: bigint, offset?: number): number;
  writeDoubleBE(value: number, offset?: number): number;
  writeDoubleLE(value: number, offset?: number): number;
  writeFloatBE(value: number, offset?: number): number;
  writeFloatLE(value: number, offset?: number): number;
  writeInt8(value: number, offset?: number): number;
  writeInt16BE(value: number, offset?: number): number;
  writeInt16LE(value: number, offset?: number): number;
  writeInt32BE(value: number, offset?: number): number;
  writeInt32LE(value: number, offset?: number): number;
  writeIntBE(value: number, offset: number, byteLength: number): number;
  writeIntLE(value: number, offset: number, byteLength: number): number;
  writeUInt8(value: number, offset?: number): number;
  writeUInt16BE(value: number, offset?: number): number;
  writeUInt16LE(value: number, offset?: number): number;
  writeUInt32BE(value: number, offset?: number): number;
  writeUInt32LE(value: number, offset?: number): number;
  writeUIntBE(value: number, offset: number, byteLength: number): number;
  writeUIntLE(value: number, offset: number, byteLength: number): number;
}

type BufferEncoding = 
  | "ascii"
  | "utf8"
  | "utf-8"
  | "utf16le"
  | "ucs2"
  | "ucs-2"
  | "base64"
  | "base64url"
  | "latin1"
  | "binary"
  | "hex";
```

### 20.2 Core Modules Overview

**fs (File System)**: File system operations.

**Key Types:**

```typescript
declare module "fs" {
  export type PathLike = string | Buffer | URL;
  export type PathOrFileDescriptor = PathLike | number;
  export type Mode = number | string;
  export type OpenMode = number | string;
  
  export interface Stats {
    isFile(): boolean;
    isDirectory(): boolean;
    isBlockDevice(): boolean;
    isCharacterDevice(): boolean;
    isSymbolicLink(): boolean;
    isFIFO(): boolean;
    isSocket(): boolean;
    dev: number;
    ino: number;
    mode: number;
    nlink: number;
    uid: number;
    gid: number;
    rdev: number;
    size: number;
    blksize: number;
    blocks: number;
    atimeMs: number;
    mtimeMs: number;
    ctimeMs: number;
    birthtimeMs: number;
    atime: Date;
    mtime: Date;
    ctime: Date;
    birthtime: Date;
  }
  
  // Callback-based APIs
  export function readFile(
    path: PathOrFileDescriptor,
    options: { encoding: BufferEncoding; flag?: string } | BufferEncoding,
    callback: (err: NodeJS.ErrnoException | null, data: string) => void
  ): void;
  export function readFile(
    path: PathOrFileDescriptor,
    options?: { encoding?: null; flag?: string } | null,
    callback?: (err: NodeJS.ErrnoException | null, data: Buffer) => void
  ): void;
  export function writeFile(
    file: PathOrFileDescriptor,
    data: string | NodeJS.ArrayBufferView,
    options: { encoding?: BufferEncoding | null; mode?: Mode | null; flag?: string | null } | BufferEncoding | null,
    callback: (err: NodeJS.ErrnoException | null) => void
  ): void;
  
  // Promise-based APIs (from fs/promises)
  export namespace promises {
    export function readFile(
      path: PathOrFileDescriptor,
      options?: { encoding?: BufferEncoding | null; flag?: string } | BufferEncoding | null
    ): Promise<Buffer>;
    export function readFile(
      path: PathOrFileDescriptor,
      options: { encoding: BufferEncoding; flag?: string } | BufferEncoding
    ): Promise<string>;
    export function writeFile(
      file: PathOrFileDescriptor,
      data: string | NodeJS.ArrayBufferView,
      options?: { encoding?: BufferEncoding | null; mode?: Mode | null; flag?: string | null } | BufferEncoding | null
    ): Promise<void>;
  }
}
```

**path**: Path manipulation utilities.

**Key Types:**

```typescript
declare module "path" {
  export function basename(path: string, ext?: string): string;
  export function dirname(path: string): string;
  export function extname(path: string): string;
  export function format(pathObject: FormatInputPathObject): string;
  export function isAbsolute(path: string): boolean;
  export function join(...paths: string[]): string;
  export function normalize(path: string): string;
  export function parse(path: string): ParsedPath;
  export function relative(from: string, to: string): string;
  export function resolve(...paths: string[]): string;
  export function sep: string;
  export function delimiter: string;
  
  export interface ParsedPath {
    root: string;
    dir: string;
    base: string;
    ext: string;
    name: string;
  }
  
  export interface FormatInputPathObject {
    root?: string;
    dir?: string;
    base?: string;
    ext?: string;
    name?: string;
  }
  
  // Platform-specific
  export namespace posix {
    export function basename(path: string, ext?: string): string;
    export function dirname(path: string): string;
    // ... same methods as above
  }
  
  export namespace win32 {
    export function basename(path: string, ext?: string): string;
    export function dirname(path: string): string;
    // ... same methods as above
  }
}
```

**http & https**: HTTP client and server.

**Key Types:**

```typescript
declare module "http" {
  import * as stream from "stream";
  import { URL } from "url";
  
  export interface IncomingMessage extends stream.Readable {
    readonly aborted: boolean;
    readonly complete: boolean;
    readonly headers: IncomingHttpHeaders;
    readonly httpVersion: string;
    readonly httpVersionMajor: number;
    readonly httpVersionMinor: number;
    readonly method?: string;
    readonly rawHeaders: string[];
    readonly rawTrailers: string[];
    readonly socket: Socket;
    readonly statusCode?: number;
    readonly statusMessage?: string;
    readonly trailers: NodeJS.Dict<string>;
    readonly url?: string;
    
    setTimeout(msecs: number, callback?: () => void): this;
  }
  
  export interface ServerResponse extends stream.Writable {
    readonly finished: boolean;
    readonly headersSent: boolean;
    readonly sendDate: boolean;
    readonly statusCode: number;
    readonly statusMessage: string;
    readonly writableEnded: boolean;
    readonly writableFinished: boolean;
    readonly writableHighWaterMark: number;
    readonly writableLength: number;
    readonly writableObjectMode: boolean;
    readonly writableCorked: number;
    
    addTrailers(headers: OutgoingHttpHeaders | ReadonlyArray<[string, string]>): void;
    appendHeader(name: string, value: string | ReadonlyArray<string>): this;
    end(callback?: () => void): this;
    end(chunk: any, callback?: () => void): this;
    end(chunk: any, encoding: BufferEncoding, callback?: () => void): this;
    getHeader(name: string): number | string | string[] | undefined;
    getHeaderNames(): string[];
    getHeaders(): OutgoingHttpHeaders;
    hasHeader(name: string): boolean;
    removeHeader(name: string): void;
    setHeader(name: string, value: number | string | ReadonlyArray<string>): this;
    setTimeout(msecs: number, callback?: () => void): this;
    write(chunk: any, encoding?: BufferEncoding, callback?: (error?: Error | null) => void): boolean;
    write(chunk: any, callback?: (error?: Error | null) => void): boolean;
    writeContinue(): void;
    writeHead(statusCode: number, statusMessage?: string, headers?: OutgoingHttpHeaders): this;
    writeHead(statusCode: number, headers?: OutgoingHttpHeaders): this;
  }
  
  export interface Server extends EventEmitter {
    listen(port?: number, hostname?: string, backlog?: number, listeningListener?: () => void): this;
    listen(port?: number, hostname?: string, listeningListener?: () => void): this;
    listen(port?: number, listeningListener?: () => void): this;
    listen(options: ListenOptions, listeningListener?: () => void): this;
    listen(handle: any, listeningListener?: () => void): this;
    close(callback?: (err?: Error) => void): this;
    setTimeout(msecs?: number, callback?: () => void): this;
    maxHeadersCount: number | null;
    timeout: number;
    keepAliveTimeout: number;
    headersTimeout: number;
  }
  
  export function createServer(requestListener?: RequestListener): Server;
  export function request(options: RequestOptions | string | URL, callback?: (res: IncomingMessage) => void): ClientRequest;
  export function get(options: RequestOptions | string | URL, callback?: (res: IncomingMessage) => void): ClientRequest;
}
```

**crypto**: Cryptographic operations.

**Key Types:**

```typescript
declare module "crypto" {
  import * as stream from "stream";
  
  export interface Hash extends stream.Transform {
    update(data: string | BinaryLike, inputEncoding?: Encoding): this;
    digest(encoding: BufferEncoding): string;
    digest(): Buffer;
  }
  
  export interface Hmac extends stream.Transform {
    update(data: string | BinaryLike, inputEncoding?: Encoding): this;
    digest(encoding: BufferEncoding): string;
    digest(): Buffer;
  }
  
  export interface Cipher extends stream.Transform {
    update(data: BinaryLike, inputEncoding?: Encoding, outputEncoding?: BufferEncoding): string;
    update(data: BinaryLike, inputEncoding?: Encoding, outputEncoding?: BufferEncoding): Buffer;
    final(outputEncoding?: BufferEncoding): string;
    final(): Buffer;
    setAutoPadding(autoPadding?: boolean): this;
  }
  
  export interface Decipher extends stream.Transform {
    update(data: BinaryLike, inputEncoding?: BufferEncoding, outputEncoding?: BufferEncoding): string;
    update(data: BinaryLike, inputEncoding?: BufferEncoding, outputEncoding?: BufferEncoding): Buffer;
    final(outputEncoding?: BufferEncoding): string;
    final(): Buffer;
    setAutoPadding(autoPadding?: boolean): this;
  }
  
  export function createHash(algorithm: string, options?: HashOptions): Hash;
  export function createHmac(algorithm: string, key: BinaryLike | KeyObject, options?: stream.TransformOptions): Hmac;
  export function createCipher(algorithm: string, password: BinaryLike, options?: stream.TransformOptions): Cipher;
  export function createDecipher(algorithm: string, password: BinaryLike, options?: stream.TransformOptions): Decipher;
  export function createCipheriv(algorithm: string, key: BinaryLike | KeyObject, iv: BinaryLike | null, options?: stream.TransformOptions): Cipher;
  export function createDecipheriv(algorithm: string, key: BinaryLike | KeyObject, iv: BinaryLike | null, options?: stream.TransformOptions): Decipher;
  export function randomBytes(size: number): Buffer;
  export function randomBytes(size: number, callback: (err: Error | null, buf: Buffer) => void): void;
  export function pbkdf2(password: BinaryLike, salt: BinaryLike, iterations: number, keylen: number, digest: string, callback: (err: Error | null, derivedKey: Buffer) => void): void;
  export function pbkdf2Sync(password: BinaryLike, salt: BinaryLike, iterations: number, keylen: number, digest: string): Buffer;
}
```

### 20.3 Advanced Node.js Modules

**child_process**: Spawn child processes.

**Complete API Reference:**

```typescript
declare module "child_process" {
  import * as stream from "stream";
  import { EventEmitter } from "events";
  
  export interface ChildProcess extends EventEmitter {
    readonly stdin: stream.Writable | null;
    readonly stdout: stream.Readable | null;
    readonly stderr: stream.Readable | null;
    readonly stdio: [stream.Writable | null, stream.Readable | null, stream.Readable | null, any, any];
    readonly pid?: number;
    readonly killed: boolean;
    readonly exitCode: number | null;
    readonly signalCode: NodeJS.Signals | null;
    readonly spawnargs: string[];
    readonly spawnfile: string;
    
    kill(signal?: NodeJS.Signals): boolean;
    send(message: any, sendHandle?: any, options?: { keepOpen?: boolean }, callback?: (error: Error | null) => void): boolean;
    disconnect(): void;
    unref(): void;
    ref(): void;
  }
  
  export interface SpawnOptions {
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    argv0?: string;
    stdio?: StdioOptions;
    detached?: boolean;
    uid?: number;
    gid?: number;
    shell?: boolean | string;
    windowsVerbatimArguments?: boolean;
    windowsHide?: boolean;
  }
  
  export function spawn(command: string, args?: ReadonlyArray<string>, options?: SpawnOptions): ChildProcess;
  export function exec(command: string, callback?: (error: ExecException | null, stdout: string, stderr: string) => void): ChildProcess;
  export function exec(command: string, options: ExecOptions, callback?: (error: ExecException | null, stdout: string, stderr: string) => void): ChildProcess;
  export function execFile(file: string, callback?: (error: ExecException | null, stdout: string, stderr: string) => void): ChildProcess;
  export function execFile(file: string, args?: ReadonlyArray<string>, callback?: (error: ExecException | null, stdout: string, stderr: string) => void): ChildProcess;
  export function fork(modulePath: string, args?: ReadonlyArray<string>, options?: ForkOptions): ChildProcess;
}

// Example: Spawn process
import { spawn } from "child_process";

const ls = spawn("ls", ["-la"], {
  cwd: "/usr",
  env: { ...process.env, CUSTOM_VAR: "value" },
  stdio: ["pipe", "pipe", "pipe"],
});

ls.stdout?.on("data", (data: Buffer) => {
  console.log(`stdout: ${data}`);
});

ls.stderr?.on("data", (data: Buffer) => {
  console.error(`stderr: ${data}`);
});

ls.on("close", (code: number | null) => {
  console.log(`Process exited with code ${code}`);
});

// Example: Execute command
import { exec } from "child_process";

exec("git status", (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
});

// Example: Fork process
import { fork } from "child_process";

const child = fork("./worker.js", ["arg1", "arg2"], {
  cwd: process.cwd(),
  silent: false, // Share stdio with parent
});

child.on("message", (message: any) => {
  console.log("Received from child:", message);
});

child.send({ type: "start", data: "payload" });
```

**cluster**: Create child processes that share server ports.

**Complete API Reference:**

```typescript
declare module "cluster" {
  import * as child_process from "child_process";
  import * as events from "events";
  import * as net from "net";
  
  export interface ClusterSettings {
    execArgv?: string[];
    exec?: string;
    args?: string[];
    silent?: boolean;
    stdio?: any[];
    uid?: number;
    gid?: number;
    inspectPort?: number | (() => number);
  }
  
  export interface Worker extends events.EventEmitter {
    id: number;
    process: child_process.ChildProcess;
    send(message: any, sendHandle?: any, callback?: (error: Error | null) => void): boolean;
    kill(signal?: string): void;
    disconnect(): void;
    isDead(): boolean;
    isConnected(): boolean;
  }
  
  export const isMaster: boolean;
  export const isPrimary: boolean; // Alias for isMaster (Node.js 16+)
  export const isWorker: boolean;
  export const settings: ClusterSettings;
  export const worker?: Worker;
  export const workers: NodeJS.Dict<Worker>;
  
  export function setupMaster(settings?: ClusterSettings): void;
  export function setupPrimary(settings?: ClusterSettings): void; // Alias for setupMaster (Node.js 16+)
  export function fork(env?: any): Worker;
  export function disconnect(callback?: () => void): void;
}

// Example: Cluster setup
import cluster from "cluster";
import os from "os";

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} is running`);
  
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on("exit", (worker: cluster.Worker, code: number, signal: string) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // Worker process
  const http = require("http");
  http
    .createServer((req: any, res: any) => {
      res.writeHead(200);
      res.end(`Hello from worker ${process.pid}`);
    })
    .listen(8000);
  
  console.log(`Worker ${process.pid} started`);
}
```

**worker_threads**: Lightweight threads for CPU-intensive tasks.

**Complete API Reference:**

```typescript
declare module "worker_threads" {
  import { EventEmitter } from "events";
  import * as stream from "stream";
  
  export interface WorkerOptions {
    eval?: boolean;
    workerData?: any;
    stdin?: boolean;
    stdout?: boolean;
    stderr?: boolean;
    execArgv?: string[];
    resourceLimits?: ResourceLimits;
    argv?: any[];
  }
  
  export interface ResourceLimits {
    maxYoungGenerationSizeMb?: number;
    maxOldGenerationSizeMb?: number;
    codeRangeSizeMb?: number;
    stackSizeMb?: number;
  }
  
  export class Worker extends EventEmitter {
    readonly stdin: stream.Writable | null;
    readonly stdout: stream.Readable;
    readonly stderr: stream.Readable;
    readonly threadId: number;
    readonly resourceLimits?: ResourceLimits;
    
    postMessage(value: any, transferList?: TransferListItem[]): void;
    ref(): void;
    unref(): void;
    terminate(): Promise<number>;
    getHeapSnapshot(): Promise<ReadableStream>;
  }
  
  export interface MessagePort extends EventTarget {
    postMessage(value: any, transferList?: TransferListItem[]): void;
    start(): void;
    close(): void;
  }
  
  export interface TransferListItem {
    transferList?: MessagePort[];
  }
  
  export const isMainThread: boolean;
  export const parentPort: MessagePort | null;
  export const resourceLimits: ResourceLimits;
  export const threadId: number;
  export const workerData: any;
}

// Example: Worker thread
// main.ts
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";

if (isMainThread) {
  // Main thread
  const worker = new Worker(__filename, {
    workerData: { start: 0, end: 1000000 },
  });
  
  worker.on("message", (result: number) => {
    console.log("Result from worker:", result);
  });
  
  worker.on("error", (error: Error) => {
    console.error("Worker error:", error);
  });
  
  worker.on("exit", (code: number) => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`);
    }
  });
} else {
  // Worker thread
  const { start, end } = workerData;
  let sum = 0;
  for (let i = start; i < end; i++) {
    sum += i;
  }
  parentPort?.postMessage(sum);
}
```

**perf_hooks**: Performance measurement APIs.

**Complete API Reference:**

```typescript
declare module "perf_hooks" {
  export interface PerformanceEntry {
    readonly duration: number;
    readonly entryType: string;
    readonly name: string;
    readonly startTime: number;
    toJSON(): any;
  }
  
  export interface PerformanceMark extends PerformanceEntry {
    readonly detail: any;
    readonly entryType: "mark";
  }
  
  export interface PerformanceMeasure extends PerformanceEntry {
    readonly detail: any;
    readonly entryType: "measure";
  }
  
  export interface PerformanceObserver {
    disconnect(): void;
    observe(options?: { entryTypes: ReadonlyArray<string>; buffered?: boolean }): void;
  }
  
  export class PerformanceObserver {
    constructor(callback: (list: PerformanceObserverEntryList, observer: PerformanceObserver) => void);
    disconnect(): void;
    observe(options: { entryTypes: ReadonlyArray<string>; buffered?: boolean }): void;
  }
  
  export interface Performance {
    mark(name: string, options?: { detail?: any; startTime?: number }): PerformanceMark;
    measure(name: string, startMark?: string, endMark?: string): PerformanceMeasure;
    measure(name: string, options: { start?: string; end?: string; duration?: number; detail?: any }): PerformanceMeasure;
    now(): number;
    timeOrigin: number;
    getEntries(): PerformanceEntry[];
    getEntriesByType(type: string): PerformanceEntry[];
    getEntriesByName(name: string, type?: string): PerformanceEntry[];
    clearMarks(name?: string): void;
    clearMeasures(name?: string): void;
  }
  
  export const performance: Performance;
  
  export function createHistogram(options?: { lowest?: number; highest?: number; figures?: number }): any;
}

// Example: Performance measurement
import { performance, PerformanceObserver } from "perf_hooks";

const obs = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
});

obs.observe({ entryTypes: ["measure", "mark"] });

performance.mark("start");
// ... do work ...
performance.mark("end");
performance.measure("work-duration", "start", "end");

// Async performance
async function measureAsync() {
  const start = performance.now();
  await someAsyncOperation();
  const duration = performance.now() - start;
  console.log(`Operation took ${duration}ms`);
}
```

**async_hooks**: Track async resources.

**Complete API Reference:**

```typescript
declare module "async_hooks" {
  export interface AsyncResource {
    asyncId(): number;
    triggerAsyncId(): number;
    runInAsyncScope<T>(fn: () => T, ...args: any[]): T;
    runInAsyncScope<T, R>(fn: (this: T, ...args: any[]) => R, thisArg: T, ...args: any[]): R;
    emitDestroy(): void;
  }
  
  export interface AsyncHook {
    enable(): this;
    disable(): this;
  }
  
  export interface HookCallbacks {
    init?(asyncId: number, type: string, triggerAsyncId: number, resource: any): void;
    before?(asyncId: number): void;
    after?(asyncId: number): void;
    destroy?(asyncId: number): void;
    promiseResolve?(asyncId: number): void;
  }
  
  export function createHook(callbacks: HookCallbacks): AsyncHook;
  export function executionAsyncId(): number;
  export function triggerAsyncId(): number;
  export function executionAsyncResource(): any;
  export class AsyncResource {
    constructor(type: string, triggerAsyncId?: number);
    static bind<Func extends (...args: any[]) => any>(
      fn: Func,
      type?: string,
      thisArg?: any
    ): Func;
  }
}

// Example: Async context tracking
import { createHook, executionAsyncId } from "async_hooks";

const hook = createHook({
  init(asyncId: number, type: string, triggerAsyncId: number) {
    console.log(`Init: ${type} (${asyncId}) triggered by ${triggerAsyncId}`);
  },
  before(asyncId: number) {
    console.log(`Before: ${asyncId}`);
  },
  after(asyncId: number) {
    console.log(`After: ${asyncId}`);
  },
  destroy(asyncId: number) {
    console.log(`Destroy: ${asyncId}`);
  },
});

hook.enable();

// Example: Async resource
import { AsyncResource } from "async_hooks";

class MyResource extends AsyncResource {
  async run() {
    this.runInAsyncScope(() => {
      console.log("Running in async scope");
    });
  }
}

const resource = new MyResource("MyResource");
resource.run();
```

**diagnostics_channel**: Publish/subscribe to diagnostic events for internal diagnostics and tracing.

The Diagnostics Channel API (Node.js 15.1.0+) provides a pub/sub mechanism for internal diagnostics and tracing. It's designed for low-overhead event publishing that can be consumed by diagnostic tools, APM systems, or logging frameworks.

**Purpose:**
- Internal diagnostics and tracing (not for application events)
- Low-overhead event publishing (only active when subscribers exist)
- Type-safe event payloads
- Integration with APM tools, logging frameworks, and debugging tools

**Complete API Reference:**

```typescript
declare module "diagnostics_channel" {
  export interface Channel {
    readonly name: string;
    publish(message: unknown): boolean; // Returns true if message was delivered
    subscribe(onMessage: (message: unknown, name: string) => void): void;
    unsubscribe(onMessage: (message: unknown, name: string) => void): void;
    readonly hasSubscribers: boolean; // Check before expensive operations
  }
  
  export function channel(name: string): Channel;
  export function hasSubscribers(name: string): boolean;
  export function subscribe(name: string, onMessage: (message: unknown, name: string) => void): void;
  export function unsubscribe(name: string, onMessage: (message: unknown, name: string) => void): void;
}
```

**Type-Safe Usage Patterns:**

```typescript
import diagnostics_channel from "diagnostics_channel";

// Define typed event payloads
interface HttpRequestEvent {
  method: string;
  url: string;
  headers: Record<string, string>;
  startTime: number;
}

interface HttpResponseEvent {
  statusCode: number;
  headers: Record<string, string>;
  duration: number;
}

// Create typed channel wrapper
class TypedDiagnosticsChannel<T> {
  private channel: diagnostics_channel.Channel;
  
  constructor(name: string) {
    this.channel = diagnostics_channel.channel(name);
  }
  
  publish(message: T): boolean {
    if (this.channel.hasSubscribers) {
      return this.channel.publish(message);
    }
    return false;
  }
  
  subscribe(onMessage: (message: T) => void): void {
    this.channel.subscribe((msg) => {
      onMessage(msg as T);
    });
  }
  
  unsubscribe(onMessage: (message: T) => void): void {
    this.channel.unsubscribe((msg) => {
      onMessage(msg as T);
    });
  }
  
  get hasSubscribers(): boolean {
    return this.channel.hasSubscribers;
  }
}

// Usage: HTTP request/response tracing
const httpRequestChannel = new TypedDiagnosticsChannel<HttpRequestEvent>("http.request");
const httpResponseChannel = new TypedDiagnosticsChannel<HttpResponseEvent>("http.response");

// Subscribe to events (e.g., in APM tool)
httpRequestChannel.subscribe((event) => {
  console.log(`[HTTP Request] ${event.method} ${event.url}`, {
    headers: event.headers,
    startTime: event.startTime,
  });
});

httpResponseChannel.subscribe((event) => {
  console.log(`[HTTP Response] Status: ${event.statusCode}`, {
    duration: event.duration,
    headers: event.headers,
  });
});

// Publish events (e.g., in HTTP middleware)
function httpMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  
  // Publish request event (only if subscribers exist)
  if (httpRequestChannel.hasSubscribers) {
    httpRequestChannel.publish({
      method: req.method,
      url: req.url,
      headers: req.headers as Record<string, string>,
      startTime,
    });
  }
  
  res.on("finish", () => {
    // Publish response event
    if (httpResponseChannel.hasSubscribers) {
      httpResponseChannel.publish({
        statusCode: res.statusCode,
        headers: res.getHeaders() as Record<string, string>,
        duration: Date.now() - startTime,
      });
    }
  });
  
  next();
}
```

**Database Query Tracing:**

```typescript
interface DatabaseQueryEvent {
  query: string;
  params: unknown[];
  duration: number;
  error?: Error;
}

const dbQueryChannel = new TypedDiagnosticsChannel<DatabaseQueryEvent>("db.query");

// Subscribe in monitoring tool
dbQueryChannel.subscribe((event) => {
  if (event.error) {
    console.error(`[DB Query Failed] ${event.query}`, {
      params: event.params,
      error: event.error.message,
      duration: event.duration,
    });
  } else {
    console.log(`[DB Query] ${event.query}`, {
      duration: event.duration,
    });
  }
});

// Publish in database client wrapper
async function executeQuery<T>(
  query: string,
  params: unknown[]
): Promise<T> {
  const startTime = Date.now();
  let error: Error | undefined;
  
  try {
    const result = await db.query(query, params);
    return result as T;
  } catch (err) {
    error = err as Error;
    throw err;
  } finally {
    if (dbQueryChannel.hasSubscribers) {
      dbQueryChannel.publish({
        query,
        params,
        duration: Date.now() - startTime,
        error,
      });
    }
  }
}
```

**Performance Optimization Pattern:**

```typescript
// Only perform expensive operations if subscribers exist
function expensiveOperation(data: unknown) {
  // Check before expensive serialization
  if (performanceChannel.hasSubscribers) {
    const serialized = JSON.stringify(data); // Expensive!
    performanceChannel.publish({
      operation: "expensiveOperation",
      dataSize: serialized.length,
      timestamp: Date.now(),
    });
  }
  
  // Main operation continues regardless
  return processData(data);
}
```

**Integration with APM Tools:**

```typescript
// APM tool integration
import { channel } from "diagnostics_channel";

// Subscribe to Node.js built-in channels
channel("http.client.request").subscribe((message) => {
  // Track outgoing HTTP requests
  apm.startTransaction("http.request", {
    method: message.method,
    url: message.url,
  });
});

channel("http.client.response").subscribe((message) => {
  // Complete transaction
  apm.endTransaction({
    statusCode: message.statusCode,
  });
});

// Custom application channels
channel("app.user.login").subscribe((message) => {
  apm.addCustomContext({
    userId: message.userId,
    email: message.email,
  });
});
```

**Best Practices:**

1. **Use typed channels** for type safety and better developer experience
2. **Check `hasSubscribers`** before expensive operations (serialization, formatting)
3. **Use descriptive channel names** following a naming convention (e.g., `app.*`, `http.*`, `db.*`)
4. **Keep payloads lightweight** - only include essential diagnostic data
5. **Don't use for application events** - use EventEmitter or message queues instead
6. **Subscribe early** - set up subscriptions before publishing events

### 20.4 Streams in Node.js

**Readable**: Readable stream.

**Complete API Reference:**

```typescript
declare module "stream" {
  class Readable extends Stream implements NodeJS.ReadableStream {
    readonly readable: boolean;
    readonly readableEncoding: BufferEncoding | null;
    readonly readableEnded: boolean;
    readonly readableFlowing: boolean | null;
    readonly readableHighWaterMark: number;
    readonly readableLength: number;
    readonly readableObjectMode: boolean;
    readonly destroyed: boolean;
    
    _construct?(callback: (error?: Error | null) => void): void;
    _read(size: number): void;
    _destroy(error: Error | null, callback: (error?: Error | null) => void): void;
    
    read(size?: number): any;
    setEncoding(encoding: BufferEncoding): this;
    pause(): this;
    resume(): this;
    isPaused(): boolean;
    unpipe(destination?: Writable): this;
    unshift(chunk: any, encoding?: BufferEncoding): void;
    wrap(oldStream: Readable): this;
    push(chunk: any, encoding?: BufferEncoding): boolean;
    destroy(error?: Error): this;
    
    // Event handlers
    on(event: "close", listener: () => void): this;
    on(event: "data", listener: (chunk: any) => void): this;
    on(event: "end", listener: () => void): this;
    on(event: "error", listener: (err: Error) => void): this;
    on(event: "pause", listener: () => void): this;
    on(event: "readable", listener: () => void): this;
    on(event: "resume", listener: () => void): this;
  }
}
```

**Writable**: Writable stream.

**Complete API Reference:**

```typescript
declare module "stream" {
  class Writable extends Stream implements NodeJS.WritableStream {
    readonly writable: boolean;
    readonly writableEnded: boolean;
    readonly writableFinished: boolean;
    readonly writableHighWaterMark: number;
    readonly writableLength: number;
    readonly writableObjectMode: boolean;
    readonly destroyed: boolean;
    
    _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void;
    _writev?(chunks: Array<{ chunk: any; encoding: BufferEncoding }>, callback: (error?: Error | null) => void): void;
    _destroy(error: Error | null, callback: (error?: Error | null) => void): void;
    _final(callback: (error?: Error | null) => void): void;
    
    write(chunk: any, encoding?: BufferEncoding, cb?: (error: Error | null | undefined) => void): boolean;
    write(chunk: any, cb?: (error: Error | null | undefined) => void): boolean;
    setDefaultEncoding(encoding: BufferEncoding): this;
    end(cb?: () => void): this;
    end(chunk: any, cb?: () => void): this;
    end(chunk: any, encoding?: BufferEncoding, cb?: () => void): this;
    cork(): void;
    uncork(): void;
    destroy(error?: Error): this;
    
    // Event handlers
    on(event: "close", listener: () => void): this;
    on(event: "drain", listener: () => void): this;
    on(event: "error", listener: (err: Error) => void): this;
    on(event: "finish", listener: () => void): this;
    on(event: "pipe", listener: (src: Readable) => void): this;
    on(event: "unpipe", listener: (src: Readable) => void): this;
  }
}
```

**Transform**: Transform stream (readable + writable).

**Complete API Reference:**

```typescript
declare module "stream" {
  class Transform extends Duplex {
    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void;
    _flush(callback: TransformCallback): void;
  }
  
  type TransformCallback = (error?: Error | null, data?: any) => void;
}
```

**Duplex**: Duplex stream (readable and writable).

**Complete API Reference:**

```typescript
declare module "stream" {
  class Duplex extends Readable implements Writable {
    readonly writable: boolean;
    readonly writableEnded: boolean;
    readonly writableFinished: boolean;
    readonly writableHighWaterMark: number;
    readonly writableLength: number;
    readonly writableObjectMode: boolean;
    
    _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void;
    _writev?(chunks: Array<{ chunk: any; encoding: BufferEncoding }>, callback: (error?: Error | null) => void): void;
    _destroy(error: Error | null, callback: (error?: Error | null) => void): void;
    _final(callback: (error?: Error | null) => void): void;
    
    write(chunk: any, encoding?: BufferEncoding, cb?: (error: Error | null | undefined) => void): boolean;
    write(chunk: any, cb?: (error: Error | null | undefined) => void): boolean;
    setDefaultEncoding(encoding: BufferEncoding): this;
    end(cb?: () => void): this;
    end(chunk: any, cb?: () => void): this;
    end(chunk: any, encoding?: BufferEncoding, cb?: () => void): this;
    cork(): void;
    uncork(): void;
  }
}
```

**Example — Type-Safe Stream Processing:**

```typescript
// ✅ CORRECT: Type-safe stream processing
import { Readable, Writable, Transform } from "stream";

const readable = new Readable({
  read() {
    this.push("chunk1");
    this.push("chunk2");
    this.push(null); // End stream
  },
});

const transform = new Transform({
  transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback) {
    const upper = chunk.toString().toUpperCase();
    callback(null, upper);
  },
});

const writable = new Writable({
  write(chunk: Buffer, encoding: BufferEncoding, callback: (error?: Error | null) => void) {
    console.log(chunk.toString());
    callback();
  },
});

readable.pipe(transform).pipe(writable);
```

**Backpressure Patterns:**

```typescript
// ✅ CORRECT: Handling backpressure
const writable = new Writable({
  write(chunk: Buffer, encoding: BufferEncoding, callback: (error?: Error | null) => void) {
    // Simulate slow operation
    setTimeout(() => {
      console.log(chunk.toString());
      callback(); // Signal ready for next chunk
    }, 100);
  },
});

writable.on("drain", () => {
  console.log("Buffer drained, ready for more");
});
```

### 20.5 Node vs DOM Types

**Critical Distinction**: Node.js and DOM types must not be mixed.

**Node.js Globals:**

```typescript
// Node.js environment
declare var process: NodeJS.Process;
declare var Buffer: BufferConstructor;
declare var __dirname: string;
declare var __filename: string;
declare var global: typeof globalThis;
declare var console: Console;
```

**DOM Globals:**

```typescript
// Browser environment
declare var window: Window;
declare var document: Document;
declare var navigator: Navigator;
declare var localStorage: Storage;
declare var sessionStorage: Storage;
```

**Pitfalls & Warnings:**

❌ **Mixing Node.js and DOM Types:**

```typescript
// ❌ INCORRECT: Mixing Node.js and DOM types
function processData() {
  const element = document.getElementById("app"); // Error: 'document' is not defined
  const file = fs.readFileSync("data.txt"); // Error: 'fs' is not defined in browser
}

// ✅ CORRECT: Use environment-specific types
// Node.js code
import * as fs from "fs";
function processFile() {
  const data = fs.readFileSync("data.txt", "utf8");
}

// Browser code
function processDOM() {
  const element = document.getElementById("app");
}
```

❌ **Global Type Conflicts:**

```typescript
// ❌ INCORRECT: Using DOM types in Node.js
// In Node.js, 'window' and 'document' don't exist
if (typeof window !== "undefined") {
  // This check is needed when code runs in both environments
  window.localStorage.setItem("key", "value");
}

// ✅ CORRECT: Environment detection
if (typeof process !== "undefined") {
  // Node.js code
  console.log(process.env.NODE_ENV);
} else if (typeof window !== "undefined") {
  // Browser code
  console.log(window.location.href);
}
```

### 20.6 ESM vs CJS Types

**ES Modules (ESM)**: Modern module system.

**Complete API Reference:**

```typescript
// ESM imports
import * as fs from "fs";
import { readFile } from "fs/promises";
import type { Stats } from "fs";

// ESM exports
export function processFile(path: string): Promise<string> {
  return readFile(path, "utf8");
}

// Type-only imports
import type { Readable } from "stream";
```

**CommonJS (CJS)**: Traditional module system.

**Complete API Reference:**

```typescript
// CJS require
const fs = require("fs");
const { readFile } = require("fs/promises");

// CJS exports
module.exports = {
  processFile: (path: string) => readFile(path, "utf8"),
};

// Or
exports.processFile = (path: string) => readFile(path, "utf8");
```

**Module Type Definitions:**

```typescript
declare module "fs" {
  // Module exports
  export function readFile(/* ... */): void;
  export namespace promises {
    export function readFile(/* ... */): Promise<Buffer>;
  }
}

// Type-only module augmentation
declare module "custom-module" {
  export interface CustomType {
    value: string;
  }
}
```

**__dirname and __filename in ESM:**

```typescript
// ❌ INCORRECT: __dirname not available in ESM
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ CORRECT: Use import.meta.url
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

**Pitfalls & Warnings:**

❌ **Module Resolution Issues:**

```typescript
// ❌ INCORRECT: Wrong import path
import * as fs from "node:fs"; // Requires Node.js 14.18+ or 16+

// ✅ CORRECT: Use standard import
import * as fs from "fs";

// Or with node: prefix (Node.js 14.18+)
import * as fs from "node:fs";
```

❌ **Type vs Value Imports:**

```typescript
// ❌ INCORRECT: Importing type as value
import { Stats } from "fs"; // Stats is a type, not a value

// ✅ CORRECT: Type-only import
import type { Stats } from "fs";

// Or use in type position
import * as fs from "fs";
function getStats(path: string): Promise<Stats> {
  return fs.promises.stat(path);
}
```

**Try This:**

1. Create a type-safe file processing utility using Node.js fs types
2. Implement a type-safe HTTP server using Node.js http types
3. Build a type-safe stream pipeline with error handling
4. Create a utility that works in both Node.js and browser environments

---


<!-- SSM:CHUNK_BOUNDARY id="ch20-end" -->
