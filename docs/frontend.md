---
# Cursor Rule Metadata
version: 1.3
project: VeroField
scope:
  - frontend
priority: critical
last_updated: 2025-12-05 20:13:54
always_apply: true
---

# PRIORITY: CRITICAL - Frontend Development Rules

## PRIORITY: CRITICAL - Component Usage Rules

### Rule 1: Always Use Existing Components
```
IF component exists in frontend/src/components/ui/:
  → USE IT
  → DO NOT create duplicate
  → Extend if needed, don't replace
ELSE:
  → Check if similar component can be extended
  → Only create new if absolutely necessary
  → Add to ui/ directory if reusable
```

### Rule 2: Component Extraction Protocol
**PREVENT FILE BLOAT** by extracting components when:
- File exceeds 500 lines of code
- Component has reusable functionality
- Component has complex internal logic (>50 lines)
- Component can be used in multiple places
- Component has its own state management
- Component has modal/popup functionality

**Extraction Process:**
1. Create separate component file in appropriate directory
2. Extract with proper TypeScript interfaces
3. Create index.ts for clean imports
4. Update parent file to use extracted component
5. Remove embedded component definition
6. Test integration and fix any linting errors

### Rule 3: Customer Selection (CRITICAL)
```
FOR customer selection:
  → ALWAYS use CustomerSearchSelector
  → NEVER create custom implementation
  → NEVER use basic Select dropdown
```

### Rule 4: Service Types
```
FOR service types:
  → Fetch from enhancedApi.serviceTypes.getAll()
  → Use Select component
  → Provide fallback options
```

---

## PRIORITY: HIGH - Standard Imports Pattern

### Always Use These Patterns
```typescript
// Form Components
import Input from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/CRMComponents';
import CustomerSearchSelector from '@/components/ui/CustomerSearchSelector';
import Button from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import Textarea from '@/components/ui/Textarea';
import Checkbox from '@/components/ui/Checkbox';

// Form Libraries
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Data Fetching
import { useQuery, useMutation } from '@tanstack/react-query';
import { enhancedApi } from '@/lib/enhanced-api';

// Layout
import Card from '@/components/ui/Card';
```

### Import Order
1. React & Hooks
2. Form Libraries (react-hook-form, zod)
3. UI Components (from ui/)
4. Icons (lucide-react)
5. API/Data (enhancedApi, react-query)
6. Types/Interfaces
7. Utilities

---

## PRIORITY: HIGH - Code Organization

### File Structure Rules
- **Reusable components** → `frontend/src/components/ui/`
- **Feature components** → `frontend/src/components/[feature]/`
- **Forms** → Use standard form pattern
- **Dialogs** → Use Dialog component from ui/

### Naming Conventions
- Components: PascalCase (e.g., `CustomerSearchSelector.tsx`)
- Files: Match component name
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Types/Interfaces: PascalCase





