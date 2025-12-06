---
title: Design System Reference
category: Reference
status: active
last_reviewed: 2025-12-05
owner: design_lead
related:
  - docs/guides/development/styling-guide.md
  - docs/reference/component-catalog.md
---

# VeroField Design System

## Overview

This design system establishes consistent layout patterns and sizing standards across all pages in the VeroField application, based on the Settings page layout that provides a clean, modern, and professional appearance.

## Core Layout Standards

### Page Container
```css
min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6
/* or p-8 for maximum breathing room (24-32px) */
```

### Card Container (Enterprise)
```css
/* Dashboard Cards */
bg-white/80 backdrop-blur-xl rounded-md shadow-sm border border-white/20 p-4

/* Data-heavy Cards (Tables, Lists) */
bg-white/80 backdrop-blur-xl rounded-md shadow-sm border border-white/20 p-3
```

### Header Pattern (Enterprise)
```css
/* Header Container */
bg-white/80 backdrop-blur-xl rounded-md shadow-sm border border-white/20 p-4 mb-4

/* Header Content */
flex items-center justify-between mb-3

/* Title - Enterprise Standard */
text-xl font-bold text-slate-900 mb-1
/* Alternative: Subtle gradient for brand pages only */
text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1

/* Description */
text-slate-600 text-sm

/* Icon Container */
p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md
w-5 h-5 text-white
```

## Typography Scale (Enterprise CRM Standards)

### Headings
- **Page Title**: `text-xl font-bold` (20px) - Line height: 1.3-1.4
- **Section Headers**: `text-base font-semibold` (16px) - Line height: 1.3-1.4
- **Subsection Headers**: `text-sm font-semibold` (14px) - Line height: 1.4
- **Column Headers**: `text-sm font-medium` (14px) - Line height: 1.3-1.4

### Body Text
- **Primary**: `text-sm` (14px) - Line height: 1.4-1.5
- **Secondary/Metadata**: `text-xs` (12px) - Line height: 1.4
- **Labels**: `text-xs font-semibold` (12px, semibold) - Line height: 1.4

### Enterprise Typography Tokens
- Use Tailwind classes: `text-enterprise-xl` (20px), `text-enterprise-md` (16px), `text-enterprise-base` (14px), `text-enterprise-xs` (12px)
- Line heights: `leading-enterprise-tight` (1.3), `leading-enterprise-normal` (1.4), `leading-enterprise-relaxed` (1.5)

## Spacing System (Enterprise CRM Standards - 8px Base Grid)

### Margins & Padding
- **Page Padding**: `p-6` or `p-8` (24-32px) - Use `enterprise-5` (24px) or `enterprise-6` (32px)
- **Card Padding (Dashboards)**: `p-4` (16px) - Use `enterprise-4`
- **Card Padding (Data-heavy)**: `p-3` (12px) - Use `enterprise-3` for tables, lists, dense content
- **Section Spacing**: `mb-3` or `mb-4` (12-16px) - Use `enterprise-3` or `enterprise-4`
- **Element Spacing**: `mb-2` or `mb-3` (8-12px) - Use `enterprise-2` or `enterprise-3`
- **Grid Gaps**: `gap-2` (8px), `gap-3` (12px), `gap-4` (16px) - Use `enterprise-2`, `enterprise-3`, `enterprise-4`

### Component Spacing
- **Button Height**: 32-36px - Use `h-8` (32px) or `h-9` (36px)
- **Button Padding**: `px-3 py-1.5` (12px horizontal, 6px vertical)
- **Input Height**: 32-36px - Use `h-8` (32px) or `h-9` (36px)
- **Input Padding**: `px-2 py-1.5` (8px horizontal, 6px vertical)
- **Table Row Height**: 44-48px - Use `h-11` (44px) or `h-12` (48px)
- **Icon Padding**: `p-1` (4px) - Use `enterprise-1`
- **Icon + Text Gap**: `gap-2` (8px) - Use `enterprise-2`

### Enterprise Spacing Tokens
- `enterprise-1`: 4px - Tight spacing, icon padding
- `enterprise-2`: 8px - Base unit, icon-text gaps
- `enterprise-3`: 12px - Field groups, compact card padding
- `enterprise-4`: 16px - Section blocks, dashboard card padding
- `enterprise-5`: 24px - Page padding (minimum)
- `enterprise-6`: 32px - Page padding (maximum)

## Display Density Modes

VeroField supports three density modes that adjust spacing, font sizes, and component heights:

| Mode | Use Case | Font Scale | Vertical Spacing | Row Height |
|------|----------|------------|------------------|------------|
| **Compact** | Data-heavy views, scheduler, tables | -10% | -20% | 40px |
| **Standard** | Default application mode | Base | Base | 44px |
| **Comfortable** | Read-heavy dashboards, analysis | +10% | +20% | 48px |

### Using Density Modes

Density mode is managed via React context (`useDensityMode`) and persists to localStorage. Components automatically scale using CSS variables:

- `--density-scale`: Multiplier for font sizes and spacing (0.9/1.0/1.1)
- `--row-height`: Table row height (40px/44px/48px)

**Example:**
```tsx
import { useDensityMode } from '@/context/DensityModeContext';

// Component automatically uses density-aware CSS variables
<tr style={{ height: 'var(--row-height, 44px)' }}>
  <td className="px-3 py-2">Content</td>
</tr>
```

See [Enterprise Styling Guide v2](enterprise-styling-guide.md) for complete density mode documentation.

## Icon Sizing

### Standard Icons
- **Header Icons**: `w-5 h-5` (20px)
- **Section Icons**: `w-4 h-4` (16px)
- **Button Icons**: `w-3 h-3` (12px)
- **Status Icons**: `w-2 h-2` (8px)

### Icon Containers
- **Header Icon Container**: `p-1.5` (6px)
- **Section Icon Container**: `p-1` (4px)

## Color Palette

### Primary Colors
- **Indigo**: `#6366F1` (Primary brand color)
- **Purple**: `#8B5CF6` (Secondary brand color)
- **Emerald**: `#10B981` (Success/positive)
- **Amber**: `#F59E0B` (Warning/attention)
- **Rose**: `#EF4444` (Error/danger)

### Background Colors
- **Page Background**: `from-slate-50 via-blue-50 to-indigo-50`
- **Card Background**: `bg-white/80 backdrop-blur-xl`
- **Gradient Backgrounds**: Various color combinations with opacity

**Important**: Use `slate-*` colors for neutrals, not `gray-*`.

## Component Standards

### Buttons (Enterprise)
```css
/* Primary Button - Compact Enterprise Style */
bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-md hover:from-indigo-700 hover:to-purple-700 shadow-sm hover:shadow-md transition-all duration-200 font-medium text-sm h-8

/* Secondary Button - Compact Enterprise Style */
bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 font-medium text-sm h-8
```

### Form Elements (Enterprise)
```css
/* Input Fields - Compact Enterprise Style */
w-full px-2 py-1.5 border border-slate-200 rounded-md bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm h-8

/* Select Dropdowns - Compact Enterprise Style */
border border-slate-200 rounded-md px-2 py-1.5 min-w-[120px] bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm h-8
```

### Cards & Containers (Enterprise)
```css
/* Standard Card - Dashboard */
bg-white/80 backdrop-blur-xl rounded-md shadow-sm border border-white/20 p-4

/* Data-heavy Card - Tables, Lists */
bg-white/80 backdrop-blur-xl rounded-md shadow-sm border border-white/20 p-3

/* Status Cards - Compact */
text-center p-2 bg-gradient-to-br from-[color]-50 to-[color]-100 rounded-md border border-[color]-200
```

## Layout Patterns

### Two-Column Layout
```css
/* Main Container */
flex gap-4

/* Sidebar */
w-56 flex-shrink-0

/* Main Content */
flex-1 space-y-4
```

### Grid Layouts
```css
/* Standard Grid */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4

/* Compact Grid */
grid grid-cols-1 md:grid-cols-2 gap-3
```

### Chart Containers
```css
/* Chart Height */
height: 250px

/* Chart Padding */
p-4

/* Chart Headers */
text-lg font-bold text-slate-800 mb-3 flex items-center gap-2
```

## Animation & Transitions

### Standard Transitions
```css
transition-all duration-200
transition-all duration-300 ease-out
```

### Hover Effects
```css
hover:from-indigo-700 hover:to-purple-700
hover:bg-white hover:shadow-lg
hover:shadow-xl
```

## Responsive Design

### Breakpoints
- **Mobile**: Default (single column)
- **Tablet**: `md:` prefix (768px+)
- **Desktop**: `lg:` prefix (1024px+)

### Responsive Patterns
- **Grid Columns**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Flex Direction**: `flex-col lg:flex-row`
- **Text Sizing**: Responsive text classes as needed

## Implementation Guidelines (Enterprise CRM Standards)

### For New Pages
1. Use the standard page container with `p-6` or `p-8` padding (24-32px)
2. Implement the header pattern with `text-xl` title (20px, not 24px)
3. Use `p-4` padding for dashboard cards, `p-3` for data-heavy cards
4. Apply `text-base` (16px) for section headers, not `text-lg` (18px)
5. Use `text-sm` (14px) for body text and `text-xs` (12px) for labels
6. Maintain consistent spacing with `mb-3` or `mb-4` (12-16px), `gap-3` or `gap-4` (12-16px)
7. Use `rounded-md` (4px) instead of `rounded-xl` (12px) for enterprise feel
8. Use `shadow-sm` instead of `shadow-xl` for subtle, professional appearance
9. Ensure table rows are 44-48px height for optimal information density
10. Target 14-16 visible rows per standard 1080p screen

### For Components
1. Follow the established icon sizing standards
2. Use the defined color palette
3. Implement consistent button and form element styling
4. Apply standard transitions and hover effects
5. Maintain glass morphism effects with `backdrop-blur-xl`

### For Charts & Data Visualization
1. Use `height: 250px` for chart containers
2. Apply `p-4` padding to chart cards
3. Use `text-lg` for chart headers
4. Maintain consistent tooltip styling
5. Apply the established color palette for chart elements

## Accessibility Considerations

### Color Contrast
- Ensure sufficient contrast ratios for all text elements
- Use semantic colors for status indicators
- Maintain accessibility in gradient backgrounds

### Focus States
- Implement visible focus rings on interactive elements
- Use `focus:ring-2 focus:ring-indigo-500` for form elements
- Ensure keyboard navigation works properly

### Screen Reader Support
- Use semantic HTML elements
- Provide appropriate ARIA labels
- Ensure proper heading hierarchy

## File Structure

### Components
- Follow the established component patterns
- Use consistent naming conventions
- Maintain separation of concerns

### Styling
- Use Tailwind CSS utility classes
- Follow the established class ordering
- Maintain consistency across similar components

This design system ensures a cohesive, professional appearance across all pages while maintaining the clean, modern aesthetic that users appreciate.

## Enterprise CRM Standards Summary

### Key Principles
- **Information Density**: Maximize data per viewport without clutter
- **Hierarchical Clarity**: Visual rhythm and clear grouping
- **Minimal Cognitive Friction**: Uniform alignment, consistent spacing
- **Reduced Visual Fatigue**: Neutral colors, restrained elevation

### Benchmark Targets
- **Visual Density**: ~14-16 visible rows per standard 1080p screen
- **Readability**: WCAG AA+ contrast ratios maintained
- **Click Efficiency**: 3-4 actions reachable within visible viewport
- **Scan Speed**: 1.2-1.5 seconds average to identify key information

### Anti-Patterns to Avoid
- ❌ Page titles larger than 20px (`text-2xl` = 24px is too large)
- ❌ Border radius larger than 8px (`rounded-xl` = 12px is too playful)
- ❌ Shadows larger than `shadow-md` (`shadow-xl` is too prominent)
- ❌ Page padding less than 24px (`p-3` = 12px is too tight)
- ❌ Card padding of 16px in data-heavy areas (use 12px instead)
- ❌ Table rows smaller than 44px or larger than 48px

**Last Updated:** 2025-12-05  
**Maintained By:** Design Lead  
**Review Frequency:** Quarterly  
**Enterprise Standards Applied:** Yes

