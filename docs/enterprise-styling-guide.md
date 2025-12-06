---
title: Enterprise CRM Styling Guide v2
category: Reference
status: active
last_reviewed: 2025-12-05
owner: design_lead
related:
  - docs/reference/design-system.md
  - docs/guides/development/styling-guide.md
  - docs/reference/accessibility-standards.md
---

# Enterprise CRM Styling Guide v2

## Overview

This document defines the **visual and interaction standards** for the VeroField Enterprise CRM interface.  

It incorporates production-tested patterns from industry leaders (Salesforce, HubSpot, ServiceTitan, Zoho) with a focus on **information density, visual stability, and productivity at scale**.

The guide ensures consistent design decisions across modules, reducing visual fatigue and cognitive load for users working full days in the system.

---

## Core Philosophy

Enterprise-grade CRMs prioritize:

- **Information Density** – Fit maximum relevant data within the viewport  

- **Cognitive Efficiency** – Predictable layouts, minimal distraction  

- **Consistency** – Unified visual language across all modules  

- **Accessibility** – WCAG AA+ compliant by default  

- **Focus Retention** – Reduce unnecessary motion, maintain user flow  

---

## Display Density Modes

Enterprise systems often support multiple density settings.  

All spacing, font, and component sizing should scale according to the selected mode.

| Mode | Intended Use | Font Scale | Vertical Spacing | Row Height | Description |
|------|---------------|-------------|------------------|-------------|--------------|
| **Compact** | Data-heavy, scheduler, tables | -1 step | -20% | 40px | Maximum density, ideal for advanced users |
| **Standard** | Default application mode | Base | Base | 44px | Balanced comfort and productivity |
| **Comfortable** | Read-heavy dashboards | +1 step | +20% | 48px | More breathing room for analysis |

Each module should **persist user density preference** via local storage or profile settings.

### Density Mode Implementation

```css
/* Density mode CSS variables */
:root {
  --density-compact-scale: 0.9;
  --density-standard-scale: 1.0;
  --density-comfortable-scale: 1.1;
  
  --density-row-height-compact: 40px;
  --density-row-height-standard: 44px;
  --density-row-height-comfortable: 48px;
}

[data-density="compact"] {
  font-size: calc(var(--font-base) * var(--density-compact-scale));
  --row-height: var(--density-row-height-compact);
}

[data-density="comfortable"] {
  font-size: calc(var(--font-base) * var(--density-comfortable-scale));
  --row-height: var(--density-row-height-comfortable);
}
```

---

## Typography Standards

### Hierarchy

| Level | Size (px/rem) | Line Height | Usage | Tailwind Class |
|-------|---------------|-------------|-------|----------------|
| Page Title | 18–20px (1.125–1.25rem) | 1.4 | Page headers | `text-xl` |
| Section Header | 14–16px | 1.3–1.4 | Section titles | `text-base` |
| Body Text | 13–14px | 1.4–1.5 | Default | `text-sm` |
| Metadata / Labels | 12px | 1.4 | Descriptive text | `text-xs` |
| Inputs / Buttons | 13–14px | 1.4 | Form content | `text-sm` |

### Font Family

Use a compact, legible sans-serif:

- `Inter`, `IBM Plex Sans`, `Segoe UI`, or `Open Sans`

- Avoid wide or playful fonts (e.g., Lato, Nunito)

### Letter & Line Spacing

- Slight negative letter spacing: `-0.1px` to `-0.2px`

- Line height: `1.3–1.5` based on density mode

---

## Layout System

### Grid

- **Base grid:** 8px  

- **Breakpoints:**

  - `sm`: 640px  

  - `md`: 768px  

  - `lg`: 1024px  

  - `xl`: 1280px  

  - `2xl`: 1440px (maximum content width)

### Page Structure

| Element | Padding | Behavior |
|----------|----------|-----------|
| Global gutters | 24–32px | Fixed at 2xl breakpoint |
| Section spacing | 16–20px | Consistent vertical rhythm |
| Form groups | 12–16px | Between fieldsets |
| Buttons & inputs | 8–12px padding | Compact by default |

---

## Density Tokens

| Token | Value | Usage |
|--------|--------|--------|
| `--space-1` | 4px | Icon gaps |
| `--space-2` | 8px | Base unit |
| `--space-3` | 12px | Field spacing |
| `--space-4` | 16px | Card padding |
| `--space-5` | 24px | Page gutters |
| `--space-6` | 32px | Expanded padding |

---

## Containers & Components

| Component | Width / Height | Padding | Notes |
|------------|----------------|----------|--------|
| Dashboard card | 16px | 16px | `p-4` |
| Data table card | 12px | 12px | `p-3` |
| Modal | 640–800px | 24px | Max width constraint |
| Drawer | 360–480px | 24px | Compact mobile side panels |
| Button | 32–36px | 12–16px | `h-8`–`h-9` |
| Input | 32–36px | 12–16px | Match buttons for rhythm |

---

## Visual Hierarchy & Rhythm

### Vertical Flow

- **Section headers**: 12px top / 8px bottom  

- **Between cards**: 16px  

- **Field groups**: 12px  

- Maintain **consistent rhythm** per viewport for scannability.

### Horizontal Alignment

- Use strict left alignment for data-heavy views.

- Center align only in onboarding or modals.

---

## Color & Contrast

| Category | Token | Example | Contrast Target |
|-----------|--------|----------|----------------|
| Primary Text | `--color-text-primary` | #1E1E1E | ≥7:1 |
| Secondary Text | `--color-text-secondary` | #6B7280 | ≥4.5:1 |
| Borders | `--color-border` | #E5E7EB | Neutral dividers |
| Background | `--color-bg` | #FFFFFF | Base layer |
| Surface | `--color-surface` | #F9FAFB | Card backgrounds |
| Accent | `--color-primary` | #2563EB | Brand color |
| Success | `--color-success` | #16A34A | State |
| Warning | `--color-warning` | #F59E0B | State |
| Error | `--color-error` | #DC2626 | State |

Use color only for **status and interactivity**. Avoid decorative saturation.

---

## Interactions

| State | Visual Rule |
|--------|--------------|
| **Hover** | Subtle background tint (`gray-50`) |
| **Focus** | 2px brand outline or `blue-500` |
| **Active** | Slight darken or inset shadow |
| **Disabled** | Opacity 0.5–0.6; muted cursor |
| **Transitions** | 150–200ms ease-in-out |

---

## Data Tables

| Element | Spec |
|----------|------|
| Row height | 44px (Standard), 40px (Compact) |
| Header font | 14px semi-bold |
| Body font | 13px regular |
| Hover | gray-100 background |
| Alternating rows | gray-50 optional |
| Scroll behavior | Sticky header + first column |
| Visible rows (1080p) | 14–16 ideal |

---

## Accessibility & Compliance

- **Contrast**: Meet or exceed WCAG 2.2 AA  

- **Focus**: Always visible; avoid relying solely on color  

- **Keyboard navigation**: Full tab order on all forms/tables  

- **Touch targets**: Minimum 44x44px  

- **Motion sensitivity**: Respect `prefers-reduced-motion`  

### Color Tokens for Accessibility

```css
:root {
  --color-focus-outline: #2563eb;
  --color-focus-bg: #eff6ff;
  --color-error-bg: #fef2f2;
  --color-success-bg: #f0fdf4;
}
```

### Density Mode Accessibility Notes

- **Compact mode**: Ensure minimum touch targets (44x44px) are maintained
- **Comfortable mode**: Verify contrast ratios remain compliant with increased spacing
- All modes must meet WCAG AA+ standards

---

## Component Visual Tokens

| Property | Small | Medium | Large |
|----------|-------|--------|-------|
| Radius | 2px | 4px | 8px |
| Shadow | shadow-sm | shadow-md | shadow-lg |
| Elevation | Level 1 | Level 2 | Level 3 (rare) |

**Avoid** `shadow-xl` and radii >8px to maintain an enterprise aesthetic.

---

## UX Productivity Targets

| Metric | Target |
|-----------|--------|
| Visible data density | 14–16 rows per 1080p screen |
| Reading contrast | WCAG AA+ |
| Click efficiency | 3–4 actions per visible viewport |
| Scan recognition time | ≤1.5 seconds per object cluster |
| Eye movement fatigue | <12 saccades per viewport (benchmark) |

---

## Practical Adjustments for Overly Large UIs

✅ Reduce base font size: 16px → 14px  
✅ Tighten line height: 1.5 → 1.35  
✅ Compress inner paddings: 12px → 8px  
✅ Standardize card radius: 8px → 4px  
✅ Use Compact Density Mode for tables and forms  

---

## Example: Global CSS Variables

```css
:root {
  --font-base: 14px;
  --font-small: 12px;
  --font-large: 18px;
  --font-page-title: 20px;
  --font-section-header: 16px;

  --line-tight: 1.3;
  --line-normal: 1.4;
  --line-relaxed: 1.5;

  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;

  --color-bg: #fff;
  --color-surface: #f9fafb;
  --color-border: #e5e7eb;
  --color-text-primary: #1f2937;
  --color-text-secondary: #6b7280;
  --color-primary: #2563eb;

  /* Density mode scales */
  --density-compact-scale: 0.9;
  --density-standard-scale: 1.0;
  --density-comfortable-scale: 1.1;
  
  /* Density row heights */
  --density-row-height-compact: 40px;
  --density-row-height-standard: 44px;
  --density-row-height-comfortable: 48px;
}
```

---

## Anti-Patterns

❌ Oversized titles (>20px)  
❌ Playful rounding (rounded-xl)  
❌ Excess shadows (shadow-xl)  
❌ Under-padded pages (<24px)  
❌ Card padding >16px on data views  
❌ Table rows >48px or <40px  
❌ Button heights >36px  

---

## Implementation Checklist

- [ ] Apply density modes across all modules  
- [ ] Standardize table row height to 44px  
- [ ] Normalize radius to 4px system-wide  
- [ ] Ensure focus outlines visible and accessible  
- [ ] Reduce global font size to 14px  
- [ ] Re-test scan efficiency after adjustments  
- [ ] Validate contrast ratios ≥4.5:1 on all UI text  

---

## Related Documentation

- [Design System Reference](design-system.md) - Complete design system
- [Styling Guide](../guides/development/styling-guide.md) - Development patterns
- [Component Library Guide](../guides/development/component-library.md) - Component usage
- [Accessibility Standards](accessibility-standards.md) - Accessibility guidelines

---

**Last Updated:** 2025-12-05  
**Maintained By:** Design Lead  
**Review Frequency:** Quarterly  
**Version:** 2.0 (Enterprise Standard)
