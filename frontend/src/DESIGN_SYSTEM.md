# VeroSuite Design System

## Overview
This design system establishes consistent layout patterns and sizing standards across all pages in the VeroSuite application, based on the Settings page layout that provides a clean, modern, and professional appearance.

## Core Layout Standards

### Page Container
```css
min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3
```

### Card Container
```css
bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4
```

### Header Pattern
```css
/* Header Container */
bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4

/* Header Content */
flex items-center justify-between mb-3

/* Title */
text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1

/* Description */
text-slate-600 text-sm

/* Icon Container */
p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg
w-5 h-5 text-white
```

## Typography Scale

### Headings
- **Page Title**: `text-2xl font-bold` (24px)
- **Section Headers**: `text-lg font-bold` (18px)
- **Subsection Headers**: `text-sm font-semibold` (14px)

### Body Text
- **Primary**: `text-sm` (14px)
- **Secondary**: `text-xs` (12px)
- **Labels**: `text-xs font-semibold` (12px, semibold)

## Spacing System

### Margins & Padding
- **Page Padding**: `p-3` (12px)
- **Card Padding**: `p-4` (16px)
- **Section Spacing**: `mb-4` (16px)
- **Element Spacing**: `mb-3` (12px)
- **Grid Gaps**: `gap-4` (16px), `gap-3` (12px), `gap-2` (8px)

### Component Spacing
- **Button Padding**: `px-3 py-1.5` (12px horizontal, 6px vertical)
- **Input Padding**: `px-2 py-1.5` (8px horizontal, 6px vertical)
- **Icon Padding**: `p-1` (4px)

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

## Component Standards

### Buttons
```css
/* Primary Button */
bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm

/* Secondary Button */
bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 font-medium text-sm
```

### Form Elements
```css
/* Input Fields */
w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm

/* Select Dropdowns */
border border-slate-200 rounded-lg px-2 py-1.5 min-w-[120px] bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm
```

### Cards & Containers
```css
/* Standard Card */
bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4

/* Status Cards */
text-center p-2 bg-gradient-to-br from-[color]-50 to-[color]-100 rounded-lg border border-[color]-200
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

## Implementation Guidelines

### For New Pages
1. Use the standard page container with `p-3` padding
2. Implement the header pattern with `text-2xl` title
3. Use `p-4` padding for all card containers
4. Apply `text-lg` for section headers
5. Use `text-sm` for body text and `text-xs` for labels
6. Maintain consistent spacing with `mb-4`, `mb-3`, `gap-4`, `gap-3`

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

