---
# Cursor Rule Metadata
version: 1.4
project: VeroField
scope:
  - frontend
priority: normal
last_updated: 2025-12-05
always_apply: true
---

# PRIORITY: NORMAL - Styling & UI Guidelines (Enterprise CRM Standards)

## PRIORITY: NORMAL - Enterprise Styling Rules

- Use components from `ui/` directory
- Follow CRM_STYLING_GUIDE.md and enterprise standards
- **Page padding**: Use `p-6` or `p-8` (24-32px), NOT `p-3` (12px)
- **Page titles**: Use `text-xl` (20px), NOT `text-2xl` (24px)
- **Section headers**: Use `text-base` (16px), NOT `text-lg` (18px)
- **Border radius**: Use `rounded-md` (4px), NOT `rounded-xl` (12px)
- **Shadows**: Use `shadow-sm`, NOT `shadow-xl`
- **Card padding**: Use `p-4` for dashboards, `p-3` for data-heavy areas
- **Spacing**: Use 8px base grid (`gap-2`, `gap-3`, `gap-4`)
- **Button height**: 32-36px (`h-8` or `h-9`), NOT 40px+
- **Table rows**: 44-48px (`h-11` or `h-12`)
- Use consistent button variants
- Follow Dialog padding (`p-6`)
- **Density modes**: Support Compact/Standard/Comfortable modes via CSS variables (`--density-scale`, `--row-height`)
- **Table rows**: Use `var(--row-height, 44px)` for density-aware heights, NOT hardcoded `h-11`

---

## PRIORITY: NORMAL - Component Styling (Enterprise)

- Use Tailwind CSS classes with enterprise tokens when available
- Use `text-enterprise-xl`, `text-enterprise-md`, `text-enterprise-base`, `text-enterprise-xs`
- Use `enterprise-1` through `enterprise-6` spacing tokens
- Use `rounded-enterprise-md` (4px) for standard elements
- Use `shadow-enterprise-sm` for subtle shadows
- Follow purple theme preferences
- Maintain consistent spacing and layout (8px base grid)
- Use standard component variants
- Target 14-16 visible rows per 1080p screen for data-heavy pages
- Use density-aware CSS variables: `var(--density-scale, 1)` for scaling, `var(--row-height, 44px)` for table rows
- Components automatically scale with density mode via CSS variables

---

## PRIORITY: NORMAL - Enterprise Styling Anti-Patterns

### ❌ DO NOT (Enterprise Anti-Patterns):
- Use page titles larger than 20px (`text-2xl` = 24px is too large)
- Use border radius larger than 8px (`rounded-xl` = 12px is too playful)
- Use shadows larger than `shadow-md` (`shadow-xl` is too prominent)
- Use page padding less than 24px (`p-3` = 12px is too tight)
- Use card padding of 16px in data-heavy areas (use 12px instead)
- Use table rows smaller than 44px or larger than 48px
- Use button heights larger than 36px (avoid 40px+)
- Mix styling approaches
- Create custom styling when components exist
- Use inline styles for layout
- Hardcode colors (use theme variables)
- Use `gray-*` colors (use `slate-*` instead)
- Hardcode table row heights (use `var(--row-height, 44px)` instead)
- Ignore density mode scaling (components should use CSS variables)

### ✅ DO (Enterprise Patterns):
- Use Tailwind utility classes with enterprise tokens
- Follow enterprise spacing patterns (`p-6`/`p-8` for pages, `p-3`/`p-4` for cards)
- Use component variants consistently
- Match enterprise UI patterns (compact, professional, information-dense)
- Use `text-xl` (20px) for page titles
- Use `text-base` (16px) for section headers
- Use `rounded-md` (4px) for standard elements
- Use `shadow-sm` for subtle shadows
- Ensure proper information density (14-16 rows per screen)
- Maintain WCAG AA+ contrast ratios
- Use density-aware CSS variables for responsive sizing
- Support all three density modes (Compact, Standard, Comfortable) via CSS variables

