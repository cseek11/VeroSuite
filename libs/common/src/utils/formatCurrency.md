# formatCurrency Utility

**Last Updated:** 2025-11-25

## Overview

The `formatCurrency` utility function provides a simple, pure way to format numbers as currency strings using the Intl.NumberFormat API.

## Features

- ✅ **Pure Function**: No side effects, no external dependencies
- ✅ **Type Safe**: Full TypeScript support
- ✅ **Locale Support**: Supports any locale and currency code
- ✅ **Error Handling**: Validates input and throws descriptive errors
- ✅ **Test Coverage**: Comprehensive test suite

## Usage

```typescript
import { formatCurrency } from '@verofield/common/utils';

// Basic usage
const price = formatCurrency(1234.56); // "$1,234.56"

// With currency
const euro = formatCurrency(1234.56, 'EUR'); // "€1,234.56"

// With locale
const german = formatCurrency(1234.56, 'EUR', 'de-DE'); // "1.234,56 €"
```

## API

### `formatCurrency(amount, currency?, locale?)`

**Parameters:**
- `amount` (number, required): The numeric amount to format
- `currency` (string, optional): Currency code (default: 'USD')
- `locale` (string, optional): Locale string (default: 'en-US')

**Returns:** Formatted currency string

**Throws:** Error if amount is not a valid number

## Examples

```typescript
formatCurrency(1234.56)              // "$1,234.56"
formatCurrency(1234.56, 'EUR')       // "€1,234.56"
formatCurrency(1234.56, 'EUR', 'de-DE') // "1.234,56 €"
formatCurrency(-100)                 // "-$100.00"
formatCurrency(0)                     // "$0.00"
```

## Testing

Run tests with:
```bash
npm test formatCurrency.test.ts
```

Test coverage includes:
- Basic formatting
- Different currencies
- Different locales
- Edge cases (negative, large, small numbers)
- Error handling

## Architecture

- **Location**: `libs/common/src/utils/formatCurrency.ts`
- **Tests**: `libs/common/src/utils/__tests__/formatCurrency.test.ts`
- **Dependencies**: None (pure TypeScript)



