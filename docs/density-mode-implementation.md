---
title: Density Mode Implementation Guide
category: Development
status: active
last_reviewed: 2025-12-05
owner: frontend_team
related:
  - docs/reference/enterprise-styling-guide.md
  - docs/guides/development/styling-guide.md
---

# Density Mode Implementation Guide

## Overview

VeroField supports three display density modes (Compact, Standard, Comfortable) that allow users to customize the information density of the interface. This guide explains how to implement density-aware components.

## Quick Start

### 1. Using Density Mode in Components

Components automatically scale using CSS variables. No additional code needed for most cases:

```tsx
// Table rows automatically use density-aware height
<tr style={{ height: 'var(--row-height, 44px)' }}>
  <td className="px-3 py-2">Content</td>
</tr>

// Form inputs automatically scale
<input className="crm-input" />

// Buttons automatically scale
<button className="crm-button">Click</button>
```

### 2. Accessing Density Mode State

```tsx
import { useDensityMode } from '@/context/DensityModeContext';

function MyComponent() {
  const { densityMode, setDensityMode } = useDensityMode();
  
  // Current mode: 'compact' | 'standard' | 'comfortable'
  console.log('Current density:', densityMode);
  
  // Change density (persists to localStorage)
  setDensityMode('compact');
}
```

## CSS Variables Reference

### Available Variables

| Variable | Values | Usage |
|----------|--------|-------|
| `--density-scale` | 0.9 (Compact), 1.0 (Standard), 1.1 (Comfortable) | Multiplier for font sizes and spacing |
| `--row-height` | 40px (Compact), 44px (Standard), 48px (Comfortable) | Table row height |

### Using CSS Variables

```css
/* Density-aware component */
.my-component {
  font-size: calc(14px * var(--density-scale, 1));
  padding: calc(16px * var(--density-scale, 1));
  height: var(--row-height, 44px);
}
```

## Component Examples

### Table Rows

```tsx
// ✅ Correct: Uses density-aware height
<tr style={{ height: 'var(--row-height, 44px)' }}>
  <td>Content</td>
</tr>

// ❌ Incorrect: Hardcoded height
<tr className="h-11">
  <td>Content</td>
</tr>
```

### Form Inputs

```tsx
// ✅ Correct: Uses crm-input class (automatically density-aware)
<input className="crm-input" />

// ✅ Correct: Custom input with density scaling
<input 
  style={{ 
    height: 'calc(32px * var(--density-scale, 1))',
    fontSize: 'calc(0.875rem * var(--density-scale, 1))'
  }} 
/>

// ❌ Incorrect: Hardcoded height
<input className="h-8" />
```

### Buttons

```tsx
// ✅ Correct: Uses crm-button class (automatically density-aware)
<button className="crm-button">Click</button>

// ✅ Correct: Custom button with density scaling
<button 
  style={{ 
    height: 'calc(32px * var(--density-scale, 1))',
    padding: 'calc(12px * var(--density-scale, 1)) calc(16px * var(--density-scale, 1))'
  }}
>
  Click
</button>
```

### Cards

```tsx
// ✅ Correct: Density-aware padding
<div 
  className="bg-white rounded-md shadow-sm"
  style={{ padding: 'calc(var(--space-4, 16px) * var(--density-scale, 1))' }}
>
  Content
</div>
```

## Migration Guide

### Migrating Existing Components

#### Before (Hardcoded)
```tsx
<tr className="h-11">
  <td className="px-6 py-4">Content</td>
</tr>

<input className="h-8 px-3 py-2" />
```

#### After (Density-Aware)
```tsx
<tr style={{ height: 'var(--row-height, 44px)' }}>
  <td className="px-3 py-2">Content</td>
</tr>

<input className="crm-input" />
// or
<input style={{ height: 'calc(32px * var(--density-scale, 1))' }} />
```

## Best Practices

1. **Use CSS Variables**: Always use `var(--row-height)` and `var(--density-scale)` instead of hardcoded values
2. **Default Values**: Always provide fallback values: `var(--row-height, 44px)`
3. **Use CRM Classes**: Prefer `crm-input`, `crm-button`, `crm-table-row` classes which are already density-aware
4. **Test All Modes**: Verify components work correctly in all three density modes
5. **Accessibility**: Ensure minimum touch targets (44x44px) are maintained in Compact mode

## Common Patterns

### Conditional Styling Based on Density

```tsx
import { useDensityMode } from '@/context/DensityModeContext';

function MyComponent() {
  const { densityMode } = useDensityMode();
  
  return (
    <div className={densityMode === 'compact' ? 'gap-2' : 'gap-4'}>
      {/* Content */}
    </div>
  );
}
```

### Density-Aware Spacing

```tsx
// Use calc() with density scale
<div style={{ 
  padding: `calc(var(--space-4, 16px) * var(--density-scale, 1))`,
  gap: `calc(var(--space-2, 8px) * var(--density-scale, 1))`
}}>
  Content
</div>
```

## Testing Density Modes

### Manual Testing Checklist

- [ ] Component scales correctly in Compact mode (smaller)
- [ ] Component scales correctly in Standard mode (base)
- [ ] Component scales correctly in Comfortable mode (larger)
- [ ] Table rows show correct height (40px/44px/48px)
- [ ] Form inputs maintain usability in all modes
- [ ] Touch targets remain ≥44px in Compact mode
- [ ] Text remains readable in all modes
- [ ] Spacing feels appropriate for each mode

### Automated Testing

```tsx
import { render } from '@testing-library/react';
import { DensityModeProvider } from '@/context/DensityModeContext';

test('component scales with density mode', () => {
  const { container } = render(
    <DensityModeProvider>
      <MyComponent />
    </DensityModeProvider>
  );
  
  // Test density-aware styles
  const element = container.querySelector('.my-component');
  expect(element).toHaveStyle({ height: 'var(--row-height, 44px)' });
});
```

## Troubleshooting

### Component Not Scaling

**Problem**: Component doesn't change when density mode changes.

**Solution**: 
- Ensure component uses CSS variables (`var(--density-scale)`)
- Check that `data-density` attribute is set on document root
- Verify component is within `DensityModeProvider`

### Row Heights Not Updating

**Problem**: Table rows don't change height with density mode.

**Solution**:
- Use `style={{ height: 'var(--row-height, 44px)' }}` instead of Tailwind classes
- Ensure CSS variable is defined in root styles

### Font Sizes Too Small/Large

**Problem**: Text becomes unreadable in certain density modes.

**Solution**:
- Verify density scale is applied: `calc(baseSize * var(--density-scale, 1))`
- Check minimum font size (should be ≥12px in Compact mode)
- Test contrast ratios in all modes

## Related Documentation

- [Enterprise Styling Guide v2](../reference/enterprise-styling-guide.md) - Complete density mode specifications
- [Styling Guide](styling-guide.md) - General styling patterns
- [Design System Reference](../reference/design-system.md) - Design system overview

---

**Last Updated:** 2025-12-05  
**Maintained By:** Frontend Team  
**Review Frequency:** On density mode changes





