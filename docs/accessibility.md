---
# Cursor Rule Metadata
version: 1.0
project: VeroField
scope:
  - frontend
  - mobile
priority: high
last_updated: 2025-11-16
always_apply: true
---

# PRIORITY: HIGH - Accessibility Enforcement Rules

## Overview

This rule file enforces WCAG AA compliance for all UI components, ensuring color contrast, aria labels, focus traps, keyboard navigation, and accessibility testing.

**⚠️ MANDATORY:** All UI components must be accessible, meet WCAG AA standards, and pass accessibility checks before completion.

---

## I. WCAG AA Compliance

### Rule 1: Color Contrast Requirements

**MANDATORY:** Enforce WCAG AA color contrast ratios:

- **Normal Text:** 4.5:1 contrast ratio
- **Large Text (18pt+):** 3:1 contrast ratio
- **UI Components:** 3:1 contrast ratio

**Example:**
```typescript
// ✅ CORRECT: WCAG AA compliant colors
const colors = {
  text: '#1a1a1a',        // Dark text
  background: '#ffffff',  // White background
  // Contrast ratio: 16.6:1 (exceeds 4.5:1 requirement)
  
  primary: '#7c3aed',     // Purple primary
  primaryText: '#ffffff', // White text on purple
  // Contrast ratio: 4.8:1 (exceeds 4.5:1 requirement)
};

// ❌ WRONG: Low contrast
const badColors = {
  text: '#cccccc',        // Light gray text
  background: '#ffffff',  // White background
  // Contrast ratio: 1.6:1 (fails 4.5:1 requirement)
};
```

**MANDATORY:** Verify contrast ratios using tools (axe-core, Lighthouse, WebAIM Contrast Checker).

### Rule 2: Aria Labels

**MANDATORY:** Add aria labels to all interactive elements:

```typescript
// ✅ CORRECT: Aria labels present
<button
  aria-label="Close dialog"
  onClick={handleClose}
>
  <X className="h-4 w-4" />
</button>

// ✅ CORRECT: Aria labels for form inputs
<input
  type="text"
  aria-label="Customer name"
  aria-required="true"
  aria-invalid={hasError}
/>

// ✅ CORRECT: Aria labels for icons
<button aria-label="Delete work order">
  <Trash className="h-4 w-4" aria-hidden="true" />
</button>

// ❌ WRONG: Missing aria labels
<button onClick={handleClose}>
  <X className="h-4 w-4" /> {/* No label for screen readers */}
</button>
```

### Rule 3: Focus Traps

**MANDATORY:** Implement focus traps for modals and dialogs:

```typescript
// ✅ CORRECT: Focus trap in modal
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Trap focus within modal
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };

      modalRef.current.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => {
        modalRef.current?.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent ref={modalRef}>
        {children}
      </DialogContent>
    </Dialog>
  );
}
```

### Rule 4: Keyboard Navigation

**MANDATORY:** Ensure keyboard navigation works for all interactive elements:

```typescript
// ✅ CORRECT: Keyboard navigation
function WorkOrderCard({ workOrder, onSelect }) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(workOrder);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(workOrder)}
      onKeyDown={handleKeyDown}
      aria-label={`Work order ${workOrder.id}`}
    >
      {/* Card content */}
    </div>
  );
}

// ✅ CORRECT: Keyboard shortcuts
function WorkOrderList({ workOrders }) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Close modal or cancel action
      }
      if (e.ctrlKey && e.key === 'k') {
        // Open search
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
}
```

---

## II. Accessibility Testing

### Rule 5: Accessibility Checks

**MANDATORY:** Run accessibility checks before completing UI components:

**Tools:**
- **axe-core** - Automated accessibility testing
- **Lighthouse** - Accessibility audits
- **WAVE** - Web accessibility evaluation
- **Screen Readers** - Manual testing (NVDA, JAWS, VoiceOver)

**Example:**
```typescript
// Accessibility test with axe-core
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should have no accessibility violations', async () => {
  const { container } = render(<WorkOrderForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Rule 6: Accessibility Snapshots/Tests

**MANDATORY:** Add accessibility snapshots/tests for critical flows:

```typescript
describe('WorkOrderForm Accessibility', () => {
  it('should be keyboard navigable', async () => {
    render(<WorkOrderForm />);
    
    // Tab through form
    const firstInput = screen.getByLabelText('Customer');
    firstInput.focus();
    expect(document.activeElement).toBe(firstInput);
    
    // Tab to next field
    userEvent.tab();
    const secondInput = screen.getByLabelText('Service Type');
    expect(document.activeElement).toBe(secondInput);
  });

  it('should have proper ARIA attributes', () => {
    render(<WorkOrderForm />);
    
    const form = screen.getByRole('form');
    expect(form).toHaveAttribute('aria-label', 'Work order form');
    
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('should announce errors to screen readers', () => {
    render(<WorkOrderForm />);
    
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('Please fill in all required fields');
  });
});
```

---

## III. Accessibility Patterns

### Rule 7: Semantic HTML

**MANDATORY:** Use semantic HTML elements:

```typescript
// ✅ CORRECT: Semantic HTML
<form aria-label="Work order form">
  <fieldset>
    <legend>Customer Information</legend>
    <label htmlFor="customer">Customer</label>
    <input id="customer" aria-required="true" />
  </fieldset>
  
  <button type="submit">Submit</button>
</form>

// ❌ WRONG: Non-semantic HTML
<div>
  <div>Customer Information</div>
  <div>
    <span>Customer</span>
    <input />
  </div>
  <div onClick={handleSubmit}>Submit</div>
</div>
```

### Rule 8: Error Announcements

**MANDATORY:** Announce errors to screen readers:

```typescript
// ✅ CORRECT: Error announcement
function WorkOrderForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <form>
      <input
        aria-label="Customer"
        aria-invalid={!!errors.customer}
        aria-describedby={errors.customer ? 'customer-error' : undefined}
      />
      {errors.customer && (
        <div id="customer-error" role="alert" aria-live="polite">
          {errors.customer}
        </div>
      )}
    </form>
  );
}
```

---

## IV. Integration with Enforcement Pipeline

### Step 1: Mandatory Search

**MANDATORY:** During Step 1, search for:

- Existing accessibility patterns
- Accessibility test examples
- WCAG compliance documentation

### Step 2: Pattern Analysis

**MANDATORY:** During Step 2, verify:

- Accessibility patterns match existing code
- WCAG AA requirements understood
- Accessibility testing approach planned

### Step 3: Rule Compliance Check

**MANDATORY:** During Step 3, verify:

- Color contrast meets WCAG AA
- Aria labels present
- Keyboard navigation works
- Focus traps implemented

### Step 5: Post-Implementation Audit

**MANDATORY:** During Step 5, verify:

- Accessibility checks pass
- No accessibility violations
- Keyboard navigation works
- Screen reader compatible
- Accessibility tests pass

---

## Violations

**HARD STOP violations:**
- Missing aria labels on interactive elements
- Color contrast below WCAG AA (4.5:1)
- Missing keyboard navigation
- Missing focus traps in modals

**Must fix before proceeding:**
- Missing accessibility tests
- Missing error announcements
- Non-semantic HTML
- Missing accessibility documentation

---

**Last Updated:** 2025-11-16  
**Status:** Active Enforcement  
**Priority:** HIGH - Must be followed for every UI component

