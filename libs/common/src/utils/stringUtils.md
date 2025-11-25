# stringUtils Module

**Last Updated:** 2025-11-25

## Overview

Utility functions for string manipulation. Pure functions with no external dependencies.

## Functions

### `truncate(str: string, maxLength: number, ellipsis?: string): string`

Truncates a string to a specified length with optional ellipsis.

**Parameters:**
- `str` - The string to truncate
- `maxLength` - Maximum length of the truncated string
- `ellipsis` - String to append if truncated (default: '...')

**Returns:** Truncated string

**Example:**
```typescript
truncate("Hello World", 5) // "He..."
truncate("Hi", 10) // "Hi" (no truncation needed)
```

### `capitalize(str: string): string`

Capitalizes the first letter of a string.

**Parameters:**
- `str` - The string to capitalize

**Returns:** String with first letter capitalized

**Example:**
```typescript
capitalize("hello") // "Hello"
capitalize("HELLO") // "Hello"
```

## Usage

```typescript
import { truncate, capitalize } from '@verofield/common/utils/stringUtils';

const short = truncate("Long string here", 10);
const title = capitalize("hello world");
```

