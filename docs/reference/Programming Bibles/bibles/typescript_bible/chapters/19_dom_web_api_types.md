<!-- SSM:CHUNK_BOUNDARY id="ch19-start" -->
📘 CHAPTER 19 — DOM & WEB API TYPES 🔴 Advanced

> **Quick Answer:**
> - TypeScript's DOM library (`lib.dom.d.ts`) provides types for all browser APIs. The library includes comprehensive coverage of DOM interfaces, Web APIs, and browser-specific types. This chapter documents the most commonly used interfaces and patterns; for the complete list of all interfaces, refer to `lib.dom.d.ts` directly.
> - DOM types are automatically included when `lib: ["DOM"]` is set in `tsconfig.json`
> - Use `Window`, `Document`, `HTMLElement`, and event types for type-safe DOM manipulation
>
> **Example — Correct Pattern:**
> ```typescript
> // ✅ CORRECT: Type-safe DOM manipulation
> const element = document.getElementById("app") as HTMLElement;
> element.addEventListener("click", (event: MouseEvent) => {
>   console.log(event.clientX, event.clientY);
> });
> ```
>
> **Estimated time:** 4–6 hours to master DOM types  
> **When you need this:** Building web applications, browser extensions, or any code that interacts with the DOM

### 19.1 Core DOM Tree Types

**Node**: Base interface for all DOM nodes.

**Complete API Reference:**

```typescript
interface Node extends EventTarget {
  readonly nodeType: number;
  readonly nodeName: string;
  readonly nodeValue: string | null;
  readonly parentNode: Node | null;
  readonly parentElement: Element | null;
  readonly childNodes: NodeListOf<ChildNode>;
  readonly firstChild: ChildNode | null;
  readonly lastChild: ChildNode | null;
  readonly previousSibling: ChildNode | null;
  readonly nextSibling: ChildNode | null;
  readonly ownerDocument: Document | null;
  readonly baseURI: string;
  readonly textContent: string | null;
  
  appendChild<T extends Node>(newChild: T): T;
  cloneNode(deep?: boolean): Node;
  compareDocumentPosition(other: Node): number;
  contains(other: Node | null): boolean;
  getRootNode(options?: GetRootNodeOptions): Node;
  hasChildNodes(): boolean;
  insertBefore<T extends Node>(newChild: T, refChild: Node | null): T;
  isDefaultNamespace(namespace: string | null): boolean;
  isEqualNode(otherNode: Node | null): boolean;
  isSameNode(otherNode: Node | null): boolean;
  lookupNamespaceURI(prefix: string | null): string | null;
  lookupPrefix(namespace: string | null): string | null;
  normalize(): void;
  removeChild<T extends Node>(oldChild: T): T;
  replaceChild<T extends Node>(newChild: Node, oldChild: T): T;
}

// Node types (constants)
Node.ELEMENT_NODE: 1;
Node.ATTRIBUTE_NODE: 2;
Node.TEXT_NODE: 3;
Node.CDATA_SECTION_NODE: 4;
Node.PROCESSING_INSTRUCTION_NODE: 7;
Node.COMMENT_NODE: 8;
Node.DOCUMENT_NODE: 9;
Node.DOCUMENT_TYPE_NODE: 10;
Node.DOCUMENT_FRAGMENT_NODE: 11;
```

**Element**: Base interface for all HTML/XML elements.

**Complete API Reference:**

```typescript
interface Element extends Node, ParentNode, ChildNode, NonDocumentTypeChildNode {
  readonly attributes: NamedNodeMap;
  readonly classList: DOMTokenList;
  readonly className: string;
  readonly id: string;
  readonly localName: string;
  readonly namespaceURI: string | null;
  readonly outerHTML: string;
  readonly prefix: string | null;
  readonly scrollHeight: number;
  readonly scrollLeft: number;
  readonly scrollTop: number;
  readonly scrollWidth: number;
  readonly shadowRoot: ShadowRoot | null;
  readonly slot: string;
  readonly tagName: string;
  
  attachShadow(init: ShadowRootInit): ShadowRoot;
  closest<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K] | null;
  closest(selector: string): Element | null;
  getAttribute(qualifiedName: string): string | null;
  getAttributeNS(namespace: string | null, localName: string): string | null;
  getAttributeNames(): string[];
  getBoundingClientRect(): DOMRect;
  getClientRects(): DOMRectList;
  getElementsByClassName(classNames: string): HTMLCollectionOf<Element>;
  getElementsByTagName<K extends keyof HTMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
  getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
  getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1999/xhtml" | null, localName: string): HTMLCollectionOf<HTMLElement>;
  getElementsByTagNameNS(namespaceURI: string | null, localName: string): HTMLCollectionOf<Element>;
  hasAttribute(qualifiedName: string): boolean;
  hasAttributeNS(namespace: string | null, localName: string): boolean;
  hasAttributes(): boolean;
  hasPointerCapture(pointerId: number): boolean;
  insertAdjacentElement(where: InsertPosition, element: Element): Element | null;
  insertAdjacentHTML(position: InsertPosition, text: string): void;
  insertAdjacentText(where: InsertPosition, data: string): void;
  matches(selectors: string): boolean;
  releasePointerCapture(pointerId: number): void;
  removeAttribute(qualifiedName: string): void;
  removeAttributeNS(namespace: string | null, localName: string): void;
  setAttribute(qualifiedName: string, value: string): void;
  setAttributeNS(namespace: string | null, qualifiedName: string, value: string): void;
  setPointerCapture(pointerId: number): void;
  toggleAttribute(qualifiedName: string, force?: boolean): boolean;
}
```

**HTMLElement**: Base interface for all HTML elements.

**Complete API Reference:**

```typescript
interface HTMLElement extends Element, DocumentAndElementEventHandlers, ElementCSSInlineStyle, ElementContentEditable, GlobalEventHandlers, HTMLOrSVGElement {
  accessKey: string;
  readonly accessKeyLabel: string;
  autocapitalize: string;
  dir: string;
  draggable: boolean;
  hidden: boolean;
  inert: boolean;
  innerText: string;
  inputMode: string;
  lang: string;
  readonly offsetHeight: number;
  readonly offsetLeft: number;
  readonly offsetParent: Element | null;
  readonly offsetTop: number;
  readonly offsetWidth: number;
  outerText: string;
  spellcheck: boolean;
  title: string;
  translate: boolean;
  
  attachInternals(): ElementInternals;
  click(): void;
  blur(): void;
  focus(options?: FocusOptions): void;
}
```

**Document**: Root of the DOM tree.

**Complete API Reference:**

```typescript
interface Document extends Node, DocumentOrShadowRoot, FontFaceSource, GlobalEventHandlers, NonElementParentNode, ParentNode, XPathEvaluatorBase {
  readonly activeElement: Element | null;
  readonly body: HTMLBodyElement | null;
  readonly characterSet: string;
  readonly compatMode: string;
  readonly contentType: string;
  readonly currentScript: HTMLScriptElement | SVGScriptElement | null;
  readonly defaultView: Window | null;
  readonly designMode: string;
  readonly dir: string;
  readonly doctype: DocumentType | null;
  readonly documentElement: HTMLHtmlElement | null;
  readonly documentURI: string;
  readonly domain: string;
  readonly embeds: HTMLCollectionOf<HTMLEmbedElement>;
  readonly featurePolicy: FeaturePolicy;
  readonly forms: HTMLCollectionOf<HTMLFormElement>;
  readonly fullscreenElement: Element | null;
  readonly head: HTMLHeadElement;
  readonly hidden: boolean;
  readonly images: HTMLCollectionOf<HTMLImageElement>;
  readonly implementation: DOMImplementation;
  readonly lastElementChild: Element | null;
  readonly lastModified: string;
  readonly links: HTMLCollectionOf<HTMLAnchorElement | HTMLAreaElement>;
  readonly location: Location | null;
  readonly onreadystatechange: ((this: Document, ev: Event) => any) | null;
  readonly origin: string;
  readonly plugins: HTMLCollectionOf<HTMLEmbedElement>;
  readonly pointerLockElement: Element | null;
  readonly readyState: DocumentReadyState;
  readonly referrer: string;
  readonly rootElement: SVGSVGElement | null;
  readonly scripts: HTMLCollectionOf<HTMLScriptElement>;
  readonly scrollingElement: Element | null;
  readonly styleSheets: StyleSheetList;
  readonly timeline: DocumentTimeline;
  readonly title: string;
  readonly URL: string;
  readonly visibilityState: DocumentVisibilityState;
  readonly webkitFullscreenElement: Element | null;
  readonly webkitHidden: boolean;
  readonly xmlEncoding: string | null;
  readonly xmlStandalone: boolean;
  readonly xmlVersion: string | null;
  
  adoptNode<T extends Node>(source: T): T;
  append(...nodes: (Node | string)[]): void;
  caretPositionFromPoint(x: number, y: number): CaretPosition | null;
  caretRangeFromPoint(x: number, y: number): Range | null;
  clear(): void;
  close(): void;
  createAttribute(localName: string): Attr;
  createAttributeNS(namespace: string | null, qualifiedName: string): Attr;
  createCDATASection(data: string): CDATASection;
  createComment(data: string): Comment;
  createDocumentFragment(): DocumentFragment;
  createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K];
  createElement(tagName: string, options?: ElementCreationOptions): HTMLElement;
  createElementNS(namespaceURI: "http://www.w3.org/1999/xhtml", qualifiedName: string): HTMLElement;
  createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: string): SVGElement;
  createElementNS(namespaceURI: string | null, qualifiedName: string, options?: ElementCreationOptions | string): Element;
  createEvent(eventInterface: "AnimationEvent" | "AnimationPlaybackEvent" | "BeforeUnloadEvent" | "ClipboardEvent" | "CloseEvent" | "CompositionEvent" | "CustomEvent" | "DragEvent" | "ErrorEvent" | "FocusEvent" | "HashChangeEvent" | "InputEvent" | "KeyboardEvent" | "MessageEvent" | "MouseEvent" | "PageTransitionEvent" | "PointerEvent" | "PopStateEvent" | "ProgressEvent" | "SecurityPolicyViolationEvent" | "StorageEvent" | "TouchEvent" | "TransitionEvent" | "UIEvent" | "WheelEvent"): Event;
  createExpression(expression: string, resolver?: XPathNSResolver): XPathExpression;
  createNSResolver(nodeResolver: Node): XPathNSResolver;
  createNodeIterator(root: Node, whatToShow?: number, filter?: NodeFilter | null): NodeIterator;
  createProcessingInstruction(target: string, data: string): ProcessingInstruction;
  createRange(): Range;
  createTextNode(data: string): Text;
  createTreeWalker(root: Node, whatToShow?: number, filter?: NodeFilter | null): TreeWalker;
  elementFromPoint(x: number, y: number): Element | null;
  elementsFromPoint(x: number, y: number): Element[];
  evaluate(expression: string, contextNode: Node, resolver: XPathNSResolver | null, type: number, result: XPathResult | null): XPathResult;
  exitFullscreen(): Promise<void>;
  exitPointerLock(): void;
  getAnimations(): Animation[];
  getElementById(elementId: string): Element | null;
  getElementsByClassName(classNames: string): HTMLCollectionOf<Element>;
  getElementsByName(elementName: string): NodeListOf<HTMLElement>;
  getElementsByTagName<K extends keyof HTMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
  getElementsByTagName(qualifiedName: string): HTMLCollectionOf<HTMLElement>;
  getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1999/xhtml", localName: string): HTMLCollectionOf<HTMLElement>;
  getElementsByTagNameNS(namespaceURI: string | null, localName: string): HTMLCollectionOf<Element>;
  getSelection(): Selection | null;
  hasFocus(): boolean;
  hasStorageAccess(): Promise<boolean>;
  importNode<T extends Node>(importedNode: T, deep?: boolean): T;
  open(unused1?: string, unused2?: string): Document;
  prepend(...nodes: (Node | string)[]): void;
  querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
  querySelector(selectors: string): Element | null;
  querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
  querySelectorAll(selectors: string): NodeListOf<Element>;
  releaseCapture(): void;
  replaceChildren(...nodes: (Node | string)[]): void;
  requestStorageAccess(): Promise<void>;
  write(...text: string[]): void;
  writeln(...text: string[]): void;
}
```

**Window**: Global window object.

**Complete API Reference:**

```typescript
interface Window extends EventTarget, AnimationFrameProvider, GlobalEventHandlers, WindowEventHandlers, WindowLocalStorage, WindowOrWorkerGlobalScope, WindowSessionStorage {
  readonly applicationCache: ApplicationCache;
  readonly caches: CacheStorage;
  readonly clientInformation: Navigator;
  readonly closed: boolean;
  readonly console: Console;
  readonly crypto: Crypto;
  readonly customElements: CustomElementRegistry;
  readonly devicePixelRatio: number;
  readonly document: Document;
  readonly event: Event | undefined;
  readonly external: External;
  readonly frameElement: Element | null;
  readonly frames: WindowProxy;
  readonly history: History;
  readonly indexedDB: IDBFactory;
  readonly innerHeight: number;
  readonly innerWidth: number;
  readonly isSecureContext: boolean;
  readonly length: number;
  readonly location: Location;
  readonly locationbar: BarProp;
  readonly menubar: BarProp;
  readonly name: string;
  readonly navigator: Navigator;
  readonly opener: Window | null;
  readonly outerHeight: number;
  readonly outerWidth: number;
  readonly pageXOffset: number;
  readonly pageYOffset: number;
  readonly parent: WindowProxy;
  readonly performance: Performance;
  readonly personalbar: BarProp;
  readonly screen: Screen;
  readonly screenLeft: number;
  readonly screenTop: number;
  readonly screenX: number;
  readonly screenY: number;
  readonly scrollX: number;
  readonly scrollY: number;
  readonly scrollbars: BarProp;
  readonly self: Window;
  readonly speechSynthesis: SpeechSynthesis;
  readonly status: string;
  readonly statusbar: BarProp;
  readonly toolbar: BarProp;
  readonly top: WindowProxy;
  readonly visualViewport: VisualViewport | null;
  readonly window: Window;
  
  alert(message?: any): void;
  blur(): void;
  cancelAnimationFrame(handle: number): void;
  captureEvents(): void;
  close(): void;
  confirm(message?: string): boolean;
  focus(): void;
  getComputedStyle(elt: Element, pseudoElt?: string | null): CSSStyleDeclaration;
  getSelection(): Selection | null;
  matchMedia(query: string): MediaQueryList;
  moveBy(x: number, y: number): void;
  moveTo(x: number, y: number): void;
  open(url?: string | URL, target?: string, features?: string): WindowProxy | null;
  postMessage(message: any, targetOrigin: string, transfer?: Transferable[]): void;
  print(): void;
  prompt(message?: string, defaultText?: string): string | null;
  releaseEvents(): void;
  requestAnimationFrame(callback: FrameRequestCallback): number;
  resizeBy(x: number, y: number): void;
  resizeTo(width: number, height: number): void;
  scroll(x?: number, y?: number): void;
  scrollBy(x?: number, y?: number): void;
  scrollTo(x?: number, y?: number): void;
  stop(): void;
}
```

### 19.2 Events & EventTarget

**EventTarget**: Base interface for all event targets.

**Complete API Reference:**

```typescript
interface EventTarget {
  addEventListener(type: string, listener: EventListener | EventListenerObject | null, options?: boolean | AddEventListenerOptions): void;
  dispatchEvent(event: Event): boolean;
  removeEventListener(type: string, listener: EventListener | EventListenerObject | null, options?: boolean | EventListenerOptions): void;
}
```

**Event**: Base interface for all events.

**Complete API Reference:**

```typescript
interface Event {
  readonly bubbles: boolean;
  readonly cancelable: boolean;
  readonly composed: boolean;
  readonly currentTarget: EventTarget | null;
  readonly defaultPrevented: boolean;
  readonly eventPhase: number;
  readonly isTrusted: boolean;
  readonly target: EventTarget | null;
  readonly timeStamp: number;
  readonly type: string;
  
  composedPath(): EventTarget[];
  initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void;
  preventDefault(): void;
  stopImmediatePropagation(): void;
  stopPropagation(): void;
}

// Event phases
Event.NONE: 0;
Event.CAPTURING_PHASE: 1;
Event.AT_TARGET: 2;
Event.BUBBLING_PHASE: 3;
```

**Common Event Types:**

| Event Type | Interface | Description |
|------------|-----------|-------------|
| `MouseEvent` | `MouseEvent extends UIEvent` | Mouse interactions |
| `KeyboardEvent` | `KeyboardEvent extends UIEvent` | Keyboard input |
| `FocusEvent` | `FocusEvent extends UIEvent` | Focus changes |
| `InputEvent` | `InputEvent extends UIEvent` | Input changes |
| `TouchEvent` | `TouchEvent extends UIEvent` | Touch interactions |
| `PointerEvent` | `PointerEvent extends MouseEvent` | Pointer (mouse/touch/pen) |
| `WheelEvent` | `WheelEvent extends MouseEvent` | Mouse wheel |
| `DragEvent` | `DragEvent extends MouseEvent` | Drag and drop |
| `ClipboardEvent` | `ClipboardEvent extends Event` | Clipboard operations |
| `MessageEvent` | `MessageEvent extends Event` | Messages (postMessage, workers) |
| `ErrorEvent` | `ErrorEvent extends Event` | Errors |
| `ProgressEvent` | `ProgressEvent extends Event` | Progress (XHR, fetch) |
| `CustomEvent` | `CustomEvent extends Event` | Custom events |

**Example — Type-Safe Event Handling:**

```typescript
// ✅ CORRECT: Type-safe event handling
element.addEventListener("click", (event: MouseEvent) => {
  console.log(event.clientX, event.clientY);
  console.log(event.button); // 0 = left, 1 = middle, 2 = right
});

input.addEventListener("input", (event: Event) => {
  const target = event.target as HTMLInputElement;
  console.log(target.value);
});

form.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();
  // Handle form submission
});
```

**Pitfalls & Warnings:**

❌ **Event Type Inference Issues:**

```typescript
// ❌ INCORRECT: Event type not inferred correctly
element.addEventListener("click", (event) => {
  console.log(event.clientX); // Error: Property 'clientX' does not exist on 'Event'
});

// ✅ CORRECT: Explicit type annotation
element.addEventListener("click", (event: MouseEvent) => {
  console.log(event.clientX);
});
```

❌ **Event Listener Options:**

```typescript
// ❌ INCORRECT: Wrong options format
element.addEventListener("click", handler, true); // Old boolean format

// ✅ CORRECT: Use options object
element.addEventListener("click", handler, { 
  capture: true, 
  once: true, 
  passive: true 
});
```

### 19.3 Fetch & HTTP APIs

**fetch**: Modern HTTP client API.

**Complete API Reference:**

```typescript
function fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;

interface RequestInit {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit | null;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  mode?: RequestMode;
  credentials?: RequestCredentials;
  cache?: RequestCache;
  redirect?: RequestRedirect;
  integrity?: string;
  keepalive?: boolean;
  signal?: AbortSignal | null;
  window?: any;
}

interface Response extends Body {
  readonly headers: Headers;
  readonly ok: boolean;
  readonly redirected: boolean;
  readonly status: number;
  readonly statusText: string;
  readonly type: ResponseType;
  readonly url: string;
  
  clone(): Response;
  error(): Response;
  redirect(url: string | URL, status?: number): Response;
}

interface Body {
  readonly body: ReadableStream<Uint8Array> | null;
  readonly bodyUsed: boolean;
  
  arrayBuffer(): Promise<ArrayBuffer>;
  blob(): Promise<Blob>;
  formData(): Promise<FormData>;
  json(): Promise<any>;
  text(): Promise<string>;
}
```

**Headers**: HTTP headers container.

**Complete API Reference:**

```typescript
interface Headers extends Iterable<[string, string]> {
  append(name: string, value: string): void;
  delete(name: string): void;
  get(name: string): string | null;
  has(name: string): boolean;
  set(name: string, value: string): void;
  forEach(callbackfn: (value: string, key: string, parent: Headers) => void, thisArg?: any): void;
  entries(): IterableIterator<[string, string]>;
  keys(): IterableIterator<string>;
  values(): IterableIterator<string>;
  [Symbol.iterator](): IterableIterator<[string, string]>;
}
```

**URL & URLSearchParams**: URL parsing and manipulation.

**Complete API Reference:**

```typescript
interface URL {
  hash: string;
  host: string;
  hostname: string;
  href: string;
  readonly origin: string;
  password: string;
  pathname: string;
  port: string;
  protocol: string;
  search: string;
  readonly searchParams: URLSearchParams;
  username: string;
  
  toJSON(): string;
  toString(): string;
}

interface URLSearchParams extends Iterable<[string, string]> {
  append(name: string, value: string): void;
  delete(name: string): void;
  get(name: string): string | null;
  getAll(name: string): string[];
  has(name: string): boolean;
  set(name: string, value: string): void;
  sort(): void;
  toString(): string;
  forEach(callbackfn: (value: string, key: string, parent: URLSearchParams) => void, thisArg?: any): void;
  entries(): IterableIterator<[string, string]>;
  keys(): IterableIterator<string>;
  values(): IterableIterator<string>;
  [Symbol.iterator](): IterableIterator<[string, string]>;
}
```

**Example — Type-Safe Fetch:**

```typescript
// ✅ CORRECT: Type-safe fetch with error handling
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json() as Promise<User>;
}
```

### 19.4 Streams & WebSockets

**ReadableStream**: Stream reader API.

**Complete API Reference:**

```typescript
interface ReadableStream<R = any> {
  readonly locked: boolean;
  
  cancel(reason?: any): Promise<void>;
  getReader(options?: ReadableStreamGetReaderOptions): ReadableStreamDefaultReader<R>;
  getReader(options: { mode: "byob" }): ReadableStreamBYOBReader;
  pipeTo(destination: WritableStream<W>, options?: StreamPipeOptions): Promise<void>;
  pipeThrough<RS extends ReadableStream>(transform: ReadableWritablePair<RS, W>, options?: StreamPipeOptions): ReadableStream<RS>;
  tee(): [ReadableStream<R>, ReadableStream<R>];
}

interface ReadableStreamDefaultReader<R = any> {
  readonly closed: Promise<void>;
  
  cancel(reason?: any): Promise<void>;
  read(): Promise<ReadableStreamReadResult<R>>;
  releaseLock(): void;
}
```

**WritableStream**: Stream writer API.

**Complete API Reference:**

```typescript
interface WritableStream<W = any> {
  readonly locked: boolean;
  
  abort(reason?: any): Promise<void>;
  close(): Promise<void>;
  getWriter(): WritableStreamDefaultWriter<W>;
}

interface WritableStreamDefaultWriter<W = any> {
  readonly closed: Promise<void>;
  readonly desiredSize: number | null;
  readonly ready: Promise<void>;
  
  abort(reason?: any): Promise<void>;
  close(): Promise<void>;
  releaseLock(): void;
  write(chunk: W): Promise<void>;
}
```

**WebSocket**: WebSocket client API.

**Complete API Reference:**

```typescript
interface WebSocket extends EventTarget {
  readonly binaryType: BinaryType;
  readonly bufferedAmount: number;
  readonly extensions: string;
  readonly protocol: string;
  readonly readyState: number;
  readonly url: string;
  
  close(code?: number, reason?: string): void;
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
  
  // Event handlers
  onclose: ((this: WebSocket, ev: CloseEvent) => any) | null;
  onerror: ((this: WebSocket, ev: Event) => any) | null;
  onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null;
  onopen: ((this: WebSocket, ev: Event) => any) | null;
}

// WebSocket states
WebSocket.CONNECTING: 0;
WebSocket.OPEN: 1;
WebSocket.CLOSING: 2;
WebSocket.CLOSED: 3;
```

**Example — Type-Safe WebSocket:**

```typescript
// ✅ CORRECT: Type-safe WebSocket with message types
interface ServerMessage {
  type: "user_joined" | "user_left" | "message";
  data: any;
}

const ws = new WebSocket("wss://example.com/chat");

ws.addEventListener("message", (event: MessageEvent) => {
  const message: ServerMessage = JSON.parse(event.data);
  
  switch (message.type) {
    case "user_joined":
      console.log("User joined:", message.data);
      break;
    case "message":
      console.log("Message:", message.data);
      break;
  }
});
```

### 19.5 Storage & IndexedDB

**localStorage & sessionStorage**: Simple key-value storage.

**Complete API Reference:**

```typescript
interface Storage {
  readonly length: number;
  
  clear(): void;
  getItem(key: string): string | null;
  key(index: number): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
  [name: string]: any;
}

// Global storage objects
declare var localStorage: Storage;
declare var sessionStorage: Storage;
```

**IndexedDB**: Client-side database API.

**Complete API Reference:**

```typescript
interface IDBFactory {
  cmp(first: any, second: any): number;
  databases(): Promise<IDBDatabaseInfo[]>;
  deleteDatabase(name: string): IDBOpenDBRequest;
  open(name: string, version?: number): IDBOpenDBRequest;
}

interface IDBDatabase extends EventTarget {
  readonly name: string;
  readonly objectStoreNames: DOMStringList;
  readonly version: number;
  
  close(): void;
  createObjectStore(name: string, options?: IDBObjectStoreParameters): IDBObjectStore;
  deleteObjectStore(name: string): void;
  transaction(storeNames: string | string[], mode?: IDBTransactionMode, options?: IDBTransactionOptions): IDBTransaction;
}

interface IDBObjectStore {
  readonly indexNames: DOMStringList;
  readonly keyPath: string | string[] | null;
  readonly name: string;
  readonly transaction: IDBTransaction;
  
  add(value: any, key?: IDBValidKey): IDBRequest<IDBValidKey>;
  clear(): IDBRequest<undefined>;
  count(query?: IDBValidKey | IDBKeyRange): IDBRequest<number>;
  createIndex(name: string, keyPath: string | string[], options?: IDBIndexParameters): IDBIndex;
  delete(key: IDBValidKey | IDBKeyRange): IDBRequest<undefined>;
  deleteIndex(name: string): void;
  get(query: IDBValidKey | IDBKeyRange): IDBRequest<any>;
  getAll(query?: IDBValidKey | IDBKeyRange, count?: number): IDBRequest<any[]>;
  getAllKeys(query?: IDBValidKey | IDBKeyRange, count?: number): IDBRequest<IDBValidKey[]>;
  getKey(query: IDBValidKey | IDBKeyRange): IDBRequest<IDBValidKey | undefined>;
  index(name: string): IDBIndex;
  openCursor(query?: IDBValidKey | IDBKeyRange, direction?: IDBCursorDirection): IDBRequest<IDBCursorWithValue | null>;
  openKeyCursor(query?: IDBValidKey | IDBKeyRange, direction?: IDBCursorDirection): IDBRequest<IDBCursor | null>;
  put(value: any, key?: IDBValidKey): IDBRequest<IDBValidKey>;
}
```

**Example — Type-Safe IndexedDB:**

```typescript
// ✅ CORRECT: Type-safe IndexedDB operations
interface User {
  id: number;
  name: string;
  email: string;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MyDatabase", 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("users")) {
        const store = db.createObjectStore("users", { keyPath: "id" });
        store.createIndex("email", "email", { unique: true });
      }
    };
  });
}

async function saveUser(user: User): Promise<void> {
  const db = await openDatabase();
  const transaction = db.transaction("users", "readwrite");
  const store = transaction.objectStore("users");
  await new Promise((resolve, reject) => {
    const request = store.put(user);
    request.onsuccess = () => resolve(undefined);
    request.onerror = () => reject(request.error);
  });
}
```

### 19.6 Workers & Concurrency

**Worker**: Web Worker API.

**Complete API Reference:**

```typescript
interface Worker extends EventTarget, AbstractWorker {
  readonly location: WorkerLocation;
  onmessage: ((this: Worker, ev: MessageEvent) => any) | null;
  onmessageerror: ((this: Worker, ev: MessageEvent) => any) | null;
  
  postMessage(message: any, transfer: Transferable[]): void;
  postMessage(message: any, options?: StructuredSerializeOptions): void;
  terminate(): void;
}

interface SharedWorker extends EventTarget {
  readonly port: MessagePort;
  onerror: ((this: SharedWorker, ev: ErrorEvent) => any) | null;
  
  terminate(): void;
}
```

**ServiceWorker**: Service Worker API.

**Complete API Reference:**

```typescript
interface ServiceWorker extends EventTarget, AbstractWorker {
  readonly scriptURL: string;
  readonly state: ServiceWorkerState;
  
  postMessage(message: any, transfer: Transferable[]): void;
  postMessage(message: any, options?: StructuredSerializeOptions): void;
}

// ServiceWorker states
ServiceWorker.INSTALLING: "installing";
ServiceWorker.INSTALLED: "installed";
ServiceWorker.ACTIVATING: "activating";
ServiceWorker.ACTIVATED: "activated";
ServiceWorker.REDUNDANT: "redundant";
```

**Example — Type-Safe Worker Communication:**

```typescript
// ✅ CORRECT: Type-safe worker messages
interface WorkerMessage {
  type: "process" | "result" | "error";
  data: any;
}

// Main thread
const worker = new Worker(new URL("worker.ts", import.meta.url), {
  type: "module",
});

worker.postMessage({ type: "process", data: [1, 2, 3] } as WorkerMessage);

worker.addEventListener("message", (event: MessageEvent<WorkerMessage>) => {
  if (event.data.type === "result") {
    console.log("Result:", event.data.data);
  }
});

// Worker thread (worker.ts)
self.addEventListener("message", (event: MessageEvent<WorkerMessage>) => {
  if (event.data.type === "process") {
    const result = event.data.data.map((x: number) => x * 2);
    self.postMessage({ type: "result", data: result } as WorkerMessage);
  }
});
```

### 19.7 Media, Canvas, and Graphics

**HTMLMediaElement**: Base for audio/video elements.

**Complete API Reference:**

```typescript
interface HTMLMediaElement extends HTMLElement {
  readonly audioTracks: AudioTrackList;
  autoplay: boolean;
  readonly buffered: TimeRanges;
  controls: boolean;
  crossOrigin: string | null;
  readonly currentSrc: string;
  currentTime: number;
  defaultMuted: boolean;
  defaultPlaybackRate: number;
  disableRemotePlayback: boolean;
  readonly duration: number;
  readonly ended: boolean;
  readonly error: MediaError | null;
  loop: boolean;
  readonly mediaKeys: MediaKeys | null;
  muted: boolean;
  readonly networkState: number;
  readonly paused: boolean;
  playbackRate: number;
  readonly played: TimeRanges;
  preload: string;
  readonly readyState: number;
  readonly seekable: TimeRanges;
  readonly seeking: boolean;
  src: string;
  srcObject: MediaStream | MediaSource | Blob | null;
  readonly textTracks: TextTrackList;
  readonly videoTracks: VideoTrackList;
  volume: number;
  
  addTextTrack(kind: TextTrackKind, label?: string, language?: string): TextTrack;
  canPlayType(type: string): CanPlayTypeResult;
  captureStream(): MediaStream;
  fastSeek(seekTime: number): void;
  load(): void;
  pause(): void;
  play(): Promise<void>;
  setMediaKeys(mediaKeys: MediaKeys | null): Promise<void>;
}
```

**Canvas API**: 2D and WebGL graphics.

**Complete API Reference:**

```typescript
interface HTMLCanvasElement extends HTMLElement {
  height: number;
  width: number;
  
  captureStream(frameRequestRate?: number): MediaStream;
  getContext(contextId: "2d", options?: CanvasRenderingContext2DSettings): CanvasRenderingContext2D | null;
  getContext(contextId: "bitmaprenderer", options?: ImageBitmapRenderingContextSettings): ImageBitmapRenderingContext | null;
  getContext(contextId: "webgl", options?: WebGLContextAttributes): WebGLRenderingContext | null;
  getContext(contextId: "webgl2", options?: WebGLContextAttributes): WebGL2RenderingContext | null;
  toBlob(callback: BlobCallback, type?: string, quality?: any): void;
  toDataURL(type?: string, quality?: any): string;
}

interface CanvasRenderingContext2D extends CanvasCompositing, CanvasDrawImage, CanvasDrawPath, CanvasFillStrokeStyles, CanvasFilters, CanvasImageData, CanvasImageSmoothing, CanvasPath, CanvasPathDrawingStyles, CanvasRect, CanvasShadowStyles, CanvasState, CanvasText, CanvasTextDrawingStyles, CanvasTransform, CanvasUserInterface {
  readonly canvas: HTMLCanvasElement;
  
  // Drawing methods
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
  beginPath(): void;
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
  clearRect(x: number, y: number, w: number, h: number): void;
  clip(fillRule?: CanvasFillRule): void;
  closePath(): void;
  createImageData(sw: number, sh: number, settings?: ImageDataSettings): ImageData;
  createImageData(imagedata: ImageData): ImageData;
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
  createPattern(image: CanvasImageSource, repetition: string | null): CanvasPattern | null;
  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
  drawImage(image: CanvasImageSource, dx: number, dy: number): void;
  drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
  drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
  fill(fillRule?: CanvasFillRule): void;
  fillRect(x: number, y: number, w: number, h: number): void;
  fillText(text: string, x: number, y: number, maxWidth?: number): void;
  getImageData(sx: number, sy: number, sw: number, sh: number, settings?: ImageDataSettings): ImageData;
  getLineDash(): number[];
  getTransform(): DOMMatrix;
  isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean;
  isPointInStroke(x: number, y: number): boolean;
  lineTo(x: number, y: number): void;
  measureText(text: string): TextMetrics;
  moveTo(x: number, y: number): void;
  putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX?: number, dirtyY?: number, dirtyWidth?: number, dirtyHeight?: number): void;
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
  rect(x: number, y: number, w: number, h: number): void;
  resetTransform(): void;
  restore(): void;
  rotate(angle: number): void;
  save(): void;
  scale(x: number, y: number): void;
  setLineDash(segments: number[]): void;
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
  setTransform(transform?: DOMMatrix2DInit): void;
  stroke(): void;
  strokeRect(x: number, y: number, w: number, h: number): void;
  strokeText(text: string, x: number, y: number, maxWidth?: number): void;
  transform(a: number, b: number, c: number, d: number, e: number, f: number): void;
  translate(x: number, y: number): void;
}
```

**Pitfalls & Warnings:**

❌ **DOM Type Safety Issues:**

```typescript
// ❌ INCORRECT: Unsafe type assertion
const element = document.getElementById("app"); // HTMLElement | null
element.innerHTML = "Hello"; // Error: Object is possibly 'null'

// ✅ CORRECT: Null check or non-null assertion
const element = document.getElementById("app");
if (element) {
  element.innerHTML = "Hello";
}

// Or with non-null assertion (when certain)
const element = document.getElementById("app")!;
element.innerHTML = "Hello";
```

❌ **Event Handler Type Mismatches:**

```typescript
// ❌ INCORRECT: Wrong event type
button.onclick = (event: Event) => {
  console.log(event.clientX); // Error: Property 'clientX' does not exist on 'Event'
};

// ✅ CORRECT: Use correct event type
button.onclick = (event: MouseEvent) => {
  console.log(event.clientX);
};
```

**Try This:**

1. Create a type-safe DOM manipulation utility function
2. Implement a type-safe event delegation system
3. Build a type-safe form validation system using DOM types
4. Create a type-safe drag-and-drop implementation

### 19.8 Observers & Modern Web APIs

**MutationObserver**: Observe changes to the DOM tree.

**Complete API Reference:**

```typescript
interface MutationObserver {
  disconnect(): void;
  observe(target: Node, options?: MutationObserverInit): void;
  takeRecords(): MutationRecord[];
}

interface MutationObserverInit {
  attributeFilter?: string[];
  attributeOldValue?: boolean;
  attributes?: boolean;
  characterData?: boolean;
  characterDataOldValue?: boolean;
  childList?: boolean;
  subtree?: boolean;
}

interface MutationRecord {
  readonly addedNodes: NodeList;
  readonly attributeName: string | null;
  readonly attributeNamespace: string | null;
  readonly nextSibling: Node | null;
  readonly oldValue: string | null;
  readonly previousSibling: Node | null;
  readonly removedNodes: NodeList;
  readonly target: Node;
  readonly type: "attributes" | "characterData" | "childList";
}

// Example: Observe DOM changes
const observer = new MutationObserver((mutations: MutationRecord[]) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      console.log("Children added:", mutation.addedNodes);
      console.log("Children removed:", mutation.removedNodes);
    } else if (mutation.type === "attributes") {
      console.log(`Attribute ${mutation.attributeName} changed on`, mutation.target);
    }
  });
});

const target = document.getElementById("app");
if (target) {
  observer.observe(target, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true,
  });
}

// Cleanup
observer.disconnect();
```

**IntersectionObserver**: Observe when elements enter or leave the viewport.

**Complete API Reference:**

```typescript
interface IntersectionObserver {
  readonly root: Element | Document | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;
  
  disconnect(): void;
  observe(target: Element): void;
  takeRecords(): IntersectionObserverEntry[];
  unobserve(target: Element): void;
}

interface IntersectionObserverEntry {
  readonly boundingClientRect: DOMRectReadOnly;
  readonly intersectionRatio: number;
  readonly intersectionRect: DOMRectReadOnly;
  readonly isIntersecting: boolean;
  readonly rootBounds: DOMRectReadOnly | null;
  readonly target: Element;
  readonly time: number;
}

interface IntersectionObserverInit {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
}

// Example: Lazy loading images
const imageObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target as HTMLImageElement;
      img.src = img.dataset.src || "";
      img.classList.remove("lazy");
      imageObserver.unobserve(img);
    }
  });
}, {
  rootMargin: "50px", // Start loading 50px before entering viewport
});

document.querySelectorAll("img.lazy").forEach((img) => {
  imageObserver.observe(img);
});

// Example: Infinite scroll
const sentinelObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    loadMoreContent();
  }
});

const sentinel = document.getElementById("sentinel");
if (sentinel) {
  sentinelObserver.observe(sentinel);
}
```

**ResizeObserver**: Observe when element sizes change.

**Complete API Reference:**

```typescript
interface ResizeObserver {
  disconnect(): void;
  observe(target: Element, options?: ResizeObserverOptions): void;
  unobserve(target: Element): void;
}

interface ResizeObserverEntry {
  readonly borderBoxSize: ReadonlyArray<ResizeObserverSize>;
  readonly contentBoxSize: ReadonlyArray<ResizeObserverSize>;
  readonly contentRect: DOMRectReadOnly;
  readonly devicePixelContentBoxSize: ReadonlyArray<ResizeObserverSize>;
  readonly target: Element;
}

interface ResizeObserverSize {
  readonly blockSize: number;
  readonly inlineSize: number;
}

interface ResizeObserverOptions {
  box?: "border-box" | "content-box" | "device-pixel-content-box";
}

// Example: Responsive layout adjustments
const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
  entries.forEach((entry) => {
    const { width, height } = entry.contentRect;
    const target = entry.target as HTMLElement;
    
    if (width < 600) {
      target.classList.add("mobile");
      target.classList.remove("desktop");
    } else {
      target.classList.add("desktop");
      target.classList.remove("mobile");
    }
  });
});

const container = document.getElementById("container");
if (container) {
  resizeObserver.observe(container);
}
```

**PerformanceObserver**: Observe performance metrics.

**Complete API Reference:**

```typescript
interface PerformanceObserver {
  disconnect(): void;
  observe(options?: PerformanceObserverInit): void;
  takeRecords(): PerformanceEntry[];
}

interface PerformanceObserverInit {
  buffered?: boolean;
  entryTypes: ReadonlyArray<string>;
  type?: string;
}

interface PerformanceEntry {
  readonly duration: number;
  readonly entryType: string;
  readonly name: string;
  readonly startTime: number;
  toJSON(): any;
}

interface PerformanceMark extends PerformanceEntry {
  readonly detail: any;
  readonly entryType: "mark";
}

interface PerformanceMeasure extends PerformanceEntry {
  readonly detail: any;
  readonly entryType: "measure";
}

// Example: Performance monitoring
const perfObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.entryType === "mark") {
      console.log(`Mark: ${entry.name} at ${entry.startTime}ms`);
    } else if (entry.entryType === "measure") {
      console.log(`Measure: ${entry.name} took ${entry.duration}ms`);
    } else if (entry.entryType === "navigation") {
      const navEntry = entry as PerformanceNavigationTiming;
      console.log(`Page load: ${navEntry.loadEventEnd - navEntry.fetchStart}ms`);
    }
  });
});

perfObserver.observe({ entryTypes: ["mark", "measure", "navigation"] });

// Create performance marks and measures
performance.mark("start-processing");
// ... do work ...
performance.mark("end-processing");
performance.measure("processing-time", "start-processing", "end-processing");
```

**PerformanceMark and PerformanceMeasure Usage:**

```typescript
// Creating marks
performance.mark("script-start");
// ... code execution ...
performance.mark("script-end");

// Creating measures
performance.measure("script-duration", "script-start", "script-end");

// Retrieving entries
const marks = performance.getEntriesByType("mark") as PerformanceMark[];
const measures = performance.getEntriesByType("measure") as PerformanceMeasure[];

// Custom detail data
performance.mark("custom-mark", { detail: { userId: "123", action: "login" } });
const mark = performance.getEntriesByName("custom-mark")[0] as PerformanceMark;
console.log(mark.detail); // { userId: "123", action: "login" }
```

### 19.9 WebRTC Types

**WebRTC**: Real-time communication APIs.

**Complete API Reference:**

```typescript
interface RTCPeerConnection extends EventTarget {
  readonly localDescription: RTCSessionDescription | null;
  readonly remoteDescription: RTCSessionDescription | null;
  readonly signalingState: RTCSignalingState;
  readonly iceConnectionState: RTCIceConnectionState;
  readonly connectionState: RTCPeerConnectionState;
  
  addIceCandidate(candidate: RTCIceCandidateInit | RTCIceCandidate): Promise<void>;
  addTrack(track: MediaStreamTrack, ...streams: MediaStream[]): RTCRtpSender;
  close(): void;
  createAnswer(options?: RTCAnswerOptions): Promise<RTCSessionDescriptionInit>;
  createDataChannel(label: string, dataChannelDict?: RTCDataChannelInit): RTCDataChannel;
  createOffer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit>;
  getConfiguration(): RTCConfiguration;
  getReceivers(): RTCRtpReceiver[];
  getSenders(): RTCRtpSender[];
  getStats(selector?: MediaStreamTrack | null): Promise<RTCStatsReport>;
  removeTrack(sender: RTCRtpSender): void;
  setConfiguration(configuration: RTCConfiguration): void;
  setLocalDescription(description?: RTCSessionDescriptionInit): Promise<void>;
  setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void>;
}

interface RTCDataChannel extends EventTarget {
  readonly binaryType: RTCBinaryType;
  readonly bufferedAmount: number;
  readonly bufferedAmountLowThreshold: number;
  readonly id: number | null;
  readonly label: string;
  readonly maxPacketLifeTime: number | null;
  readonly maxRetransmits: number | null;
  readonly negotiated: boolean;
  readonly ordered: boolean;
  readonly protocol: string;
  readonly readyState: RTCDataChannelState;
  
  close(): void;
  send(data: string | ArrayBuffer | ArrayBufferView | Blob): void;
}

// Example: WebRTC peer connection
const pc = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});

pc.onicecandidate = (event) => {
  if (event.candidate) {
    // Send candidate to remote peer
    sendToRemotePeer(event.candidate);
  }
};

pc.ontrack = (event) => {
  // Handle incoming media stream
  const remoteVideo = document.getElementById("remote-video") as HTMLVideoElement;
  remoteVideo.srcObject = event.streams[0];
};

// Create offer
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);
// Send offer to remote peer

// Receive answer from remote peer
await pc.setRemoteDescription(remoteAnswer);

// Data channel
const dataChannel = pc.createDataChannel("chat", { ordered: true });
dataChannel.onmessage = (event) => {
  console.log("Received:", event.data);
};
dataChannel.send("Hello from peer!");
```

### 19.10 WebGL2 Specifics

**WebGL2RenderingContext**: Enhanced WebGL context with additional features.

**Key Differences from WebGL1:**

```typescript
interface WebGL2RenderingContext extends WebGLRenderingContextBase, WebGL2RenderingContextOverloads {
  // New buffer targets
  readonly COPY_READ_BUFFER: number;
  readonly COPY_WRITE_BUFFER: number;
  readonly PIXEL_PACK_BUFFER: number;
  readonly PIXEL_UNPACK_BUFFER: number;
  readonly TRANSFORM_FEEDBACK_BUFFER: number;
  readonly UNIFORM_BUFFER: number;
  
  // New texture formats
  readonly RED: number;
  readonly RG: number;
  readonly R8: number;
  readonly RG8: number;
  readonly R16F: number;
  readonly RG16F: number;
  readonly R32F: number;
  readonly RG32F: number;
  readonly RGBA32F: number;
  
  // New shader types
  readonly VERTEX_SHADER: number;
  readonly FRAGMENT_SHADER: number;
  readonly COMPUTE_SHADER: number;
  
  // New methods
  bindBufferBase(target: number, index: number, buffer: WebGLBuffer | null): void;
  bindBufferRange(target: number, index: number, buffer: WebGLBuffer | null, offset: number, size: number): void;
  getUniformBlockIndex(program: WebGLProgram, uniformBlockName: string): number;
  uniformBlockBinding(program: WebGLProgram, uniformBlockIndex: number, uniformBlockBinding: number): void;
  createVertexArray(): WebGLVertexArrayObject | null;
  deleteVertexArray(vertexArray: WebGLVertexArrayObject | null): void;
  bindVertexArray(array: WebGLVertexArrayObject | null): void;
  isVertexArray(vertexArray: WebGLVertexArrayObject | null): boolean;
  drawArraysInstanced(mode: number, first: number, count: number, instanceCount: number): void;
  drawElementsInstanced(mode: number, count: number, type: number, offset: number, instanceCount: number): void;
  vertexAttribDivisor(index: number, divisor: number): void;
  getInternalformatParameter(target: number, internalformat: number, pname: number): any;
  waitSync(sync: WebGLSync, flags: number, timeout: number): number;
  clientWaitSync(sync: WebGLSync, flags: number, timeout: number): number;
  fenceSync(condition: number, flags: number): WebGLSync | null;
  deleteSync(sync: WebGLSync | null): void;
  isSync(sync: WebGLSync | null): boolean;
  getSyncParameter(sync: WebGLSync, pname: number): any;
}

// Example: WebGL2 setup
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

if (!gl) {
  throw new Error("WebGL2 not supported");
}

// Use WebGL2 features
const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

// Uniform buffer objects
const uniformBuffer = gl.createBuffer();
gl.bindBuffer(gl.UNIFORM_BUFFER, uniformBuffer);
gl.bufferData(gl.UNIFORM_BUFFER, new Float32Array([1.0, 0.0, 0.0, 1.0]), gl.STATIC_DRAW);
gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, uniformBuffer);
```

### 19.10.1 WebGPU Types Overview

**WebGPU** is a modern graphics API that provides low-level access to GPU hardware, offering better performance and more features than WebGL. TypeScript provides comprehensive type definitions for the WebGPU API.

**Key WebGPU Interfaces:**

```typescript
// GPU adapter and device
interface GPUAdapter {
  readonly features: GPUSupportedFeatures;
  readonly limits: GPUSupportedLimits;
  requestDevice(descriptor?: GPUDeviceDescriptor): Promise<GPUDevice>;
}

interface GPUDevice extends EventTarget {
  readonly features: GPUSupportedFeatures;
  readonly limits: GPUSupportedLimits;
  readonly lost: Promise<GPUDeviceLostInfo>;
  createBuffer(descriptor: GPUBufferDescriptor): GPUBuffer;
  createTexture(descriptor: GPUTextureDescriptor): GPUTexture;
  createSampler(descriptor?: GPUSamplerDescriptor): GPUSampler;
  createBindGroupLayout(descriptor: GPUBindGroupLayoutDescriptor): GPUBindGroupLayout;
  createPipelineLayout(descriptor: GPUPipelineLayoutDescriptor): GPUPipelineLayout;
  createRenderPipeline(descriptor: GPURenderPipelineDescriptor): GPURenderPipeline;
  createComputePipeline(descriptor: GPUComputePipelineDescriptor): GPUComputePipeline;
  createCommandEncoder(descriptor?: GPUCommandEncoderDescriptor): GPUCommandEncoder;
  createRenderBundleEncoder(descriptor: GPURenderBundleEncoderDescriptor): GPURenderBundleEncoder;
  createQuerySet(descriptor: GPUQuerySetDescriptor): GPUQuerySet;
  pushErrorScope(filter: GPUErrorFilter): void;
  popErrorScope(): Promise<GPUError | null>;
  setLabel(label: string | null): void;
}

// Request adapter and device
interface Navigator {
  gpu: GPU;
}

interface GPU {
  requestAdapter(options?: GPURequestAdapterOptions): Promise<GPUAdapter | null>;
}

// Basic WebGPU setup example
async function initWebGPU() {
  if (!navigator.gpu) {
    throw new Error("WebGPU not supported");
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw new Error("No GPU adapter found");
  }

  const device = await adapter.requestDevice();
  
  // Get canvas context
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const context = canvas.getContext("webgpu");
  
  if (!context) {
    throw new Error("WebGPU context not available");
  }

  // Configure canvas
  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device,
    format,
  });

  return { device, context, format };
}
```

**Type-Safe WebGPU Usage:**

```typescript
// Buffer creation with types
interface VertexData {
  position: [number, number, number];
  color: [number, number, number, number];
}

function createVertexBuffer(
  device: GPUDevice,
  vertices: VertexData[]
): GPUBuffer {
  const vertexArray = new Float32Array(
    vertices.flatMap(v => [...v.position, ...v.color])
  );

  const buffer = device.createBuffer({
    label: "Vertex Buffer",
    size: vertexArray.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });

  device.queue.writeBuffer(buffer, 0, vertexArray);
  return buffer;
}

// Shader module with type-safe entry points
interface ShaderModule {
  code: string;
  entryPoint: string;
}

function createShaderModule(
  device: GPUDevice,
  shader: ShaderModule
): GPUShaderModule {
  return device.createShaderModule({
    label: shader.entryPoint,
    code: shader.code,
  });
}

// Render pipeline with typed vertex attributes
function createRenderPipeline(
  device: GPUDevice,
  shaderModule: GPUShaderModule,
  format: GPUTextureFormat
): GPURenderPipeline {
  return device.createRenderPipeline({
    label: "Render Pipeline",
    layout: "auto",
    vertex: {
      module: shaderModule,
      entryPoint: "vs_main",
      buffers: [
        {
          arrayStride: 7 * 4, // 3 position + 4 color floats
          attributes: [
            { shaderLocation: 0, offset: 0, format: "float32x3" }, // position
            { shaderLocation: 1, offset: 12, format: "float32x4" }, // color
          ],
        },
      ],
    },
    fragment: {
      module: shaderModule,
      entryPoint: "fs_main",
      targets: [{ format }],
    },
    primitive: {
      topology: "triangle-list",
    },
  });
}
```

**WebGPU vs WebGL Type Differences:**

| Feature | WebGL | WebGPU |
|---------|-------|--------|
| **Context Type** | `WebGLRenderingContext` | `GPUDevice` + `GPUCanvasContext` |
| **Buffer Creation** | `createBuffer()` → `WebGLBuffer` | `createBuffer()` → `GPUBuffer` with typed descriptors |
| **Shader Compilation** | `createShader()` + `compileShader()` | `createShaderModule()` with WGSL |
| **Pipeline Creation** | Separate shader/program setup | `createRenderPipeline()` with complete descriptor |
| **Command Recording** | Immediate mode | Command encoder pattern |
| **Type Safety** | Limited (mostly `number` types) | Strong (enums, interfaces, unions) |

**TypeScript Configuration for WebGPU:**

```json
{
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "WebWorker"],
    "types": []
  }
}
```

**Note**: WebGPU types are included in TypeScript's DOM library (`lib.dom.d.ts`) as of TypeScript 4.8+. No additional `@types` package is required.

**Browser Support:**

- Chrome/Edge 113+ (with flag in earlier versions)
- Firefox 110+ (with flag)
- Safari 16.4+ (with flag)

**Type Safety Benefits:**

1. **Enum Types**: WebGPU uses string literal types for formats, operations, etc.
2. **Interface Descriptors**: All descriptor objects are strongly typed
3. **Error Handling**: `GPUError` types for different error categories
4. **Resource Types**: Each resource type (buffer, texture, etc.) has its own interface

### 19.11 Credential Management API

**Credential Management API**: Secure credential storage and retrieval.

**Complete API Reference:**

```typescript
interface Credential {
  readonly id: string;
  readonly type: string;
}

interface CredentialsContainer {
  create(options?: CredentialCreationOptions): Promise<Credential | null>;
  get(options?: CredentialRequestOptions): Promise<Credential | null>;
  preventSilentAccess(): Promise<void>;
  store(credential: Credential): Promise<Credential>;
}

interface PasswordCredential extends Credential {
  readonly iconURL: string | null;
  readonly name: string | null;
  readonly password: string;
  readonly idName: string;
  readonly passwordName: string;
}

interface FederatedCredential extends Credential {
  readonly iconURL: string | null;
  readonly name: string | null;
  readonly provider: string;
  readonly protocol: string | null;
}

interface PublicKeyCredential extends Credential {
  readonly rawId: ArrayBuffer;
  readonly response: AuthenticatorResponse;
  getClientExtensionResults(): AuthenticationExtensionsClientOutputs;
}

interface AuthenticatorResponse {
  readonly clientDataJSON: ArrayBuffer;
}

interface AuthenticatorAttestationResponse extends AuthenticatorResponse {
  readonly attestationObject: ArrayBuffer;
}

interface AuthenticatorAssertionResponse extends AuthenticatorResponse {
  readonly authenticatorData: ArrayBuffer;
  readonly signature: ArrayBuffer;
  readonly userHandle: ArrayBuffer | null;
}

// Example: Password credential
if ("PasswordCredential" in window) {
  const cred = new PasswordCredential({
    id: "user@example.com",
    password: "secret",
    name: "User Name",
  });
  
  await navigator.credentials.store(cred);
  
  // Later: retrieve credential
  const storedCred = await navigator.credentials.get({
    password: true,
  }) as PasswordCredential | null;
  
  if (storedCred) {
    console.log("Auto-filled:", storedCred.id);
  }
}

// Example: WebAuthn (Public Key Credential)
const publicKeyCredential = await navigator.credentials.create({
  publicKey: {
    challenge: new Uint8Array(32),
    rp: { name: "Example Corp" },
    user: {
      id: new Uint8Array(16),
      name: "user@example.com",
      displayName: "User Name",
    },
    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      userVerification: "required",
    },
  },
}) as PublicKeyCredential | null;
```

### 19.12 Payment Request API

**Payment Request API**: Standardized payment flow.

**Complete API Reference:**

```typescript
interface PaymentRequest extends EventTarget {
  readonly id: string;
  readonly shippingAddress: PaymentAddress | null;
  readonly shippingOption: string | null;
  readonly shippingType: string | null;
  
  abort(): Promise<void>;
  canMakePayment(): Promise<boolean>;
  show(detailsPromise?: PaymentDetailsUpdate | Promise<PaymentDetailsUpdate>): Promise<PaymentResponse>;
  updateWith(detailsPromise: PaymentDetailsUpdate | Promise<PaymentDetailsUpdate>): Promise<void>;
}

interface PaymentResponse {
  readonly details: any;
  readonly methodName: string;
  readonly payerEmail: string | null;
  readonly payerName: string | null;
  readonly payerPhone: string | null;
  readonly requestId: string;
  readonly shippingAddress: PaymentAddress | null;
  readonly shippingOption: string | null;
  
  complete(result?: PaymentComplete): Promise<void>;
  toJSON(): any;
}

interface PaymentAddress {
  readonly addressLine: string[];
  readonly city: string;
  readonly country: string;
  readonly dependentLocality: string;
  readonly languageCode: string;
  readonly organization: string;
  readonly phone: string;
  readonly postalCode: string;
  readonly recipient: string;
  readonly region: string;
  readonly sortingCode: string;
}

// Example: Payment request
const paymentMethods = [
  {
    supportedMethods: "https://example.com/pay",
    data: {
      merchantId: "123456",
    },
  },
];

const paymentDetails: PaymentDetailsInit = {
  total: {
    label: "Total",
    amount: { currency: "USD", value: "10.00" },
  },
  displayItems: [
    {
      label: "Item 1",
      amount: { currency: "USD", value: "5.00" },
    },
    {
      label: "Item 2",
      amount: { currency: "USD", value: "5.00" },
    },
  ],
};

const request = new PaymentRequest(paymentMethods, paymentDetails);

if (await request.canMakePayment()) {
  try {
    const response = await request.show();
    // Process payment
    await processPayment(response);
    await response.complete("success");
  } catch (error) {
    console.error("Payment failed:", error);
  }
}
```

### 19.13 Web Components

**Web Components**: Custom elements, shadow DOM, and templates.

**Complete API Reference:**

```typescript
interface CustomElementRegistry {
  define(name: string, constructor: CustomElementConstructor, options?: ElementDefinitionOptions): void;
  get(name: string): CustomElementConstructor | undefined;
  upgrade(root: Node): void;
  whenDefined(name: string): Promise<CustomElementConstructor>;
}

interface ShadowRoot extends DocumentFragment {
  readonly host: Element;
  readonly mode: ShadowRootMode;
  readonly delegatesFocus: boolean;
  readonly slotAssignment: SlotAssignmentMode;
  
  adoptedStyleSheets: CSSStyleSheet[];
  getSelection(): Selection | null;
  elementFromPoint(x: number, y: number): Element | null;
  elementsFromPoint(x: number, y: number): Element[];
}

interface HTMLTemplateElement extends HTMLElement {
  readonly content: DocumentFragment;
}

interface HTMLSlotElement extends HTMLElement {
  name: string;
  assign(...nodes: (Element | Text)[]): void;
}

// Example: Custom element
class MyCustomElement extends HTMLElement {
  private shadow: ShadowRoot;
  
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  
  connectedCallback() {
    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <slot></slot>
    `;
  }
  
  static get observedAttributes() {
    return ["title"];
  }
  
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "title") {
      this.shadow.querySelector("h1")!.textContent = newValue;
    }
  }
}

// Register custom element
customElements.define("my-custom-element", MyCustomElement);

// Use in HTML
// <my-custom-element title="Hello">Content</my-custom-element>

// Example: Template and slots
const template = document.createElement("template");
template.innerHTML = `
  <div class="card">
    <slot name="header"></slot>
    <slot name="body"></slot>
    <slot name="footer"></slot>
  </div>
`;

class CardElement extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("card-element", CardElement);

// Use with slots
// <card-element>
//   <h1 slot="header">Title</h1>
//   <p slot="body">Content</p>
//   <footer slot="footer">Footer</footer>
// </card-element>
```

---


<!-- SSM:CHUNK_BOUNDARY id="ch19-end" -->
