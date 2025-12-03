# R19: Accessibility Requirements — Step 5 Procedures (DRAFT)

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R19 - Accessibility Requirements  
**Priority:** MEDIUM (Tier 3 - WARNING)  
**MAD Tier:** 3 (WARNING - Logged but doesn't block)

---

## Purpose

R19 ensures that UI components meet WCAG AA accessibility standards, providing comprehensive accessibility enforcement including keyboard navigation, screen reader support, color contrast, focus management, accessibility testing, and accessibility documentation.

**Key Requirements:**
- WCAG AA compliance (keyboard navigation, screen reader support, color contrast ≥ 4.5:1, focus management)
- Accessibility testing (automated with axe-core/Lighthouse, manual keyboard/screen reader testing)
- Accessibility exemptions (documented, justified, with remediation plans and expiration dates)
- Accessibility reporting (WCAG compliance score, issue prioritization, trend tracking)
- Accessibility documentation (component accessibility docs, best practices)

**Relationship to R13:**
- R13 covers: General UX consistency, design system usage, component patterns, spacing, typography
- R19 covers: Accessibility-specific requirements (WCAG AA, keyboard navigation, screen reader, color contrast, focus management, accessibility testing)

---

## Step 5: Post-Implementation Audit for Accessibility Requirements

### R19: Accessibility Requirements — Audit Procedures

**For code changes affecting UI components, frontend pages, or user-facing features:**

#### WCAG AA Compliance

- [ ] **MANDATORY:** Verify UI components meet WCAG AA standards
- [ ] **MANDATORY:** Verify keyboard navigation works for all interactive elements (buttons, links, form inputs, custom components)
- [ ] **MANDATORY:** Verify screen reader support (ARIA labels, roles, descriptions present and correct)
- [ ] **MANDATORY:** Verify color contrast meets WCAG AA requirements (normal text ≥ 4.5:1, large text ≥ 3:1)
- [ ] **MANDATORY:** Verify focus management (visible focus indicators, logical focus order, focus traps in modals)
- [ ] **RECOMMENDED:** Verify semantic HTML is used (proper heading hierarchy, form labels, list structures)
- [ ] **RECOMMENDED:** Verify error messages are announced to screen readers (aria-live regions, role="alert")

#### Keyboard Navigation

- [ ] **MANDATORY:** Verify all interactive elements are keyboard accessible (no mouse-only interactions)
- [ ] **MANDATORY:** Verify Tab key navigation works (logical focus order, no keyboard traps)
- [ ] **MANDATORY:** Verify Enter/Space keys activate buttons and links
- [ ] **MANDATORY:** Verify Escape key closes modals/dialogs
- [ ] **MANDATORY:** Verify arrow keys work for custom components (dropdowns, menus, carousels)
- [ ] **RECOMMENDED:** Verify keyboard shortcuts are documented (if custom shortcuts added)
- [ ] **RECOMMENDED:** Verify keyboard navigation is tested manually (Tab through entire page)

#### Screen Reader Support

- [ ] **MANDATORY:** Verify ARIA labels are present for all interactive elements without visible text
- [ ] **MANDATORY:** Verify ARIA roles are correct (button, link, dialog, alert, etc.)
- [ ] **MANDATORY:** Verify ARIA descriptions are provided for complex components (aria-describedby)
- [ ] **MANDATORY:** Verify form inputs have associated labels (aria-label or <label> element)
- [ ] **MANDATORY:** Verify icons are marked as decorative (aria-hidden="true") when appropriate
- [ ] **RECOMMENDED:** Verify screen reader announcements work (aria-live regions for dynamic content)
- [ ] **RECOMMENDED:** Verify screen reader testing is performed manually (NVDA, JAWS, VoiceOver)

#### Color Contrast

- [ ] **MANDATORY:** Verify text color contrast meets WCAG AA (normal text ≥ 4.5:1, large text ≥ 3:1)
- [ ] **MANDATORY:** Verify UI component contrast meets WCAG AA (buttons, links, borders ≥ 3:1)
- [ ] **MANDATORY:** Verify color contrast is validated using automated tools (axe-core, Lighthouse, WebAIM Contrast Checker)
- [ ] **MANDATORY:** Verify color is not the only means of conveying information (icons, text labels also present)
- [ ] **RECOMMENDED:** Verify color contrast ratios are documented in component documentation
- [ ] **RECOMMENDED:** Verify color contrast is tested in different themes (light mode, dark mode)

#### Focus Management

- [ ] **MANDATORY:** Verify focus indicators are visible (outline, border, or background change)
- [ ] **MANDATORY:** Verify focus order is logical (top-to-bottom, left-to-right)
- [ ] **MANDATORY:** Verify focus traps are implemented in modals/dialogs (focus stays within modal)
- [ ] **MANDATORY:** Verify focus is restored when modals/dialogs close (returns to trigger element)
- [ ] **MANDATORY:** Verify skip links are present for main content (skip navigation, skip to content)
- [ ] **RECOMMENDED:** Verify focus management is tested with keyboard navigation
- [ ] **RECOMMENDED:** Verify focus management works with screen readers

#### Accessibility Testing

- [ ] **MANDATORY:** Verify automated accessibility testing is performed (axe-core, Lighthouse accessibility audit)
- [ ] **MANDATORY:** Verify accessibility violations are identified and documented
- [ ] **MANDATORY:** Verify manual keyboard navigation testing is performed (Tab through page, test all interactions)
- [ ] **MANDATORY:** Verify manual screen reader testing is performed (NVDA, JAWS, or VoiceOver)
- [ ] **MANDATORY:** Verify accessibility audit reports are generated (HTML or JSON format)
- [ ] **RECOMMENDED:** Verify accessibility testing is integrated into CI/CD pipeline
- [ ] **RECOMMENDED:** Verify accessibility regression tests are added (Playwright accessibility tests)

#### Accessibility Exemptions

- [ ] **MANDATORY:** Verify accessibility exemptions are documented (if WCAG AA cannot be met)
- [ ] **MANDATORY:** Verify accessibility exemptions include justification (why exemption is needed)
- [ ] **MANDATORY:** Verify accessibility exemptions include remediation plan (how to improve accessibility)
- [ ] **MANDATORY:** Verify accessibility exemptions include expiration date (when exemption expires)
- [ ] **MANDATORY:** Verify accessibility exemptions include WCAG level (A, AA, AAA) and specific criteria
- [ ] **RECOMMENDED:** Verify accessibility exemptions are reviewed periodically (quarterly review)
- [ ] **RECOMMENDED:** Verify accessibility exemptions are categorized (Legacy, Third-party, Experimental)

#### Accessibility Reporting

- [ ] **MANDATORY:** Verify accessibility reports are generated (per-component, per-page)
- [ ] **MANDATORY:** Verify accessibility reports are accessible (CI/CD artifacts, dashboards)
- [ ] **MANDATORY:** Verify accessibility reports include WCAG compliance score (0-100)
- [ ] **MANDATORY:** Verify accessibility reports include violation details (component, issue, WCAG criteria, severity)
- [ ] **MANDATORY:** Verify accessibility reports include trend tracking (accessibility improvements over time)
- [ ] **RECOMMENDED:** Verify accessibility reports include prioritized issues (HIGH/MEDIUM/LOW priority)
- [ ] **RECOMMENDED:** Verify accessibility reports include quick wins (high-impact, low-effort fixes)

#### Accessibility Documentation

- [ ] **MANDATORY:** Verify component accessibility documentation exists (for complex components)
- [ ] **MANDATORY:** Verify accessibility documentation includes keyboard navigation instructions
- [ ] **MANDATORY:** Verify accessibility documentation includes screen reader instructions
- [ ] **MANDATORY:** Verify accessibility best practices are documented (design system, component library)
- [ ] **RECOMMENDED:** Verify accessibility documentation includes code examples (accessible patterns)
- [ ] **RECOMMENDED:** Verify accessibility documentation includes testing guidelines (how to test accessibility)

**Total:** 50+ checklist items (mix of MANDATORY, RECOMMENDED)

---

## Automated Checks

### Accessibility Testing Script

```bash
# Check accessibility for all components
python .cursor/scripts/check-accessibility.py --all

# Check keyboard navigation
python .cursor/scripts/check-accessibility.py --keyboard

# Check ARIA attributes
python .cursor/scripts/check-accessibility.py --aria

# Check color contrast
python .cursor/scripts/check-accessibility.py --contrast

# Check focus management
python .cursor/scripts/check-accessibility.py --focus

# Generate accessibility report
python .cursor/scripts/check-accessibility.py --generate-report

# Check exemptions
python .cursor/scripts/check-accessibility.py --exemptions
```

### OPA Policy Approach

**File:** `services/opa/policies/ux-consistency.rego`

**R19 Warnings (8-10 warnings):**
- **R19-W01:** Missing ARIA labels on interactive elements
- **R19-W02:** Color contrast below WCAG AA (normal text < 4.5:1, large text < 3:1)
- **R19-W03:** Missing keyboard navigation (mouse-only interactions)
- **R19-W04:** Missing focus indicators (no visible focus outline)
- **R19-W05:** Accessibility exemption expired
- **R19-W06:** Accessibility exemption missing justification
- **R19-W07:** Accessibility exemption missing remediation plan
- **R19-W08:** High-priority accessibility issue identified (WCAG AA violation in critical component)
- **R19-W09:** Accessibility report not generated
- **R19-W10:** Accessibility trend not tracked

**Enforcement:** WARNING-level (Tier 3 MAD) - Logged but doesn't block PRs

---

## Examples

### ✅ Correct Pattern: Accessible Button

```typescript
// ✅ CORRECT: Accessible button with ARIA label and keyboard support
<button
  aria-label="Close dialog"
  onClick={handleClose}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClose();
    }
  }}
  className="focus:outline-2 focus:outline-purple-500"
>
  <X className="h-4 w-4" aria-hidden="true" />
</button>
```

**Accessibility Features:**
- ✅ ARIA label for screen readers
- ✅ Keyboard support (Enter/Space)
- ✅ Visible focus indicator
- ✅ Icon marked as decorative

### ❌ Violation Pattern: Inaccessible Button

```typescript
// ❌ VIOLATION: Missing ARIA label, no keyboard support, no focus indicator
<button onClick={handleClose}>
  <X className="h-4 w-4" />
</button>
```

**Accessibility Issues:**
- ❌ No ARIA label (screen readers can't identify button)
- ❌ No keyboard support (keyboard users can't activate)
- ❌ No focus indicator (keyboard users can't see focus)
- ❌ Icon not marked as decorative

### ✅ Correct Pattern: Accessible Form Input

```typescript
// ✅ CORRECT: Accessible form input with label and error announcement
<div>
  <label htmlFor="customer-name" className="block text-sm font-medium">
    Customer Name
  </label>
  <input
    id="customer-name"
    type="text"
    aria-required="true"
    aria-invalid={!!errors.customer}
    aria-describedby={errors.customer ? 'customer-error' : undefined}
    className="focus:outline-2 focus:outline-purple-500"
  />
  {errors.customer && (
    <div
      id="customer-error"
      role="alert"
      aria-live="polite"
      className="text-red-600"
    >
      {errors.customer}
    </div>
  )}
</div>
```

**Accessibility Features:**
- ✅ Associated label (htmlFor + id)
- ✅ ARIA required indicator
- ✅ ARIA invalid indicator
- ✅ Error announcement (aria-live="polite")
- ✅ Visible focus indicator

### ❌ Violation Pattern: Inaccessible Form Input

```typescript
// ❌ VIOLATION: Missing label, no error announcement, no focus indicator
<div>
  <span>Customer Name</span>
  <input type="text" />
  {errors.customer && (
    <div className="text-red-600">{errors.customer}</div>
  )}
</div>
```

**Accessibility Issues:**
- ❌ No associated label (screen readers can't identify input)
- ❌ No error announcement (screen readers don't know about errors)
- ❌ No focus indicator (keyboard users can't see focus)
- ❌ No ARIA attributes (required, invalid states not communicated)

### ✅ Correct Pattern: Accessible Modal

```typescript
// ✅ CORRECT: Accessible modal with focus trap and ARIA attributes
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Save previous focus
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus trap implementation
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements?.[0] as HTMLElement;
      firstElement?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
        // Focus trap logic (Tab key handling)
        // ... (focus trap implementation)
      };

      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        previousFocusRef.current?.focus(); // Restore focus
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={modalRef}
      className="focus:outline-none"
    >
      <h2 id="modal-title">Modal Title</h2>
      {children}
      <button
        aria-label="Close modal"
        onClick={onClose}
        className="focus:outline-2 focus:outline-purple-500"
      >
        Close
      </button>
    </div>
  );
}
```

**Accessibility Features:**
- ✅ ARIA dialog role and attributes
- ✅ Focus trap (focus stays within modal)
- ✅ Escape key closes modal
- ✅ Focus restored on close
- ✅ Visible focus indicators

### ❌ Violation Pattern: Inaccessible Modal

```typescript
// ❌ VIOLATION: No focus trap, no ARIA attributes, no keyboard support
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div>
      <h2>Modal Title</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

**Accessibility Issues:**
- ❌ No focus trap (keyboard users can tab outside modal)
- ❌ No ARIA attributes (screen readers don't know it's a modal)
- ❌ No Escape key support (keyboard users can't close)
- ❌ No focus restoration (focus lost when modal closes)

---

## OPA Policy Reference

**Policy File:** `services/opa/policies/ux-consistency.rego`  
**Test File:** `services/opa/tests/ux_consistency_r19_test.rego`  
**Enforcement:** WARNING (Tier 3 MAD) - Logged but doesn't block PRs

---

**Last Updated:** 2025-11-23  
**Status:** DRAFT - Awaiting Review  
**Next Step:** Review and approve before implementation





