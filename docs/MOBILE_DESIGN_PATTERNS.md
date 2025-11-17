# Mobile Design Patterns Documentation

**Date:** November 9, 2025  
**Phase:** PHASE0-003  
**Status:** ✅ Defined

---

## Overview

Mobile design patterns define touch targets, gestures, responsive breakpoints, and interaction guidelines for the VeroField dashboard on mobile devices.

---

## Touch Targets

### Minimum Sizes
All interactive elements must meet minimum touch target sizes:

- **Primary Actions:** 44x44px (Save, Submit, etc.)
- **Secondary Actions:** 40x40px
- **Icon Buttons:** 44x44px (menu, close, etc.)
- **Card Controls:** 44x44px (drag handle, controls)
- **Text Links:** 44x44px (clickable text area)

### Spacing
- **Between Targets:** 8px minimum
- **Card Controls:** 12px spacing
- **Text Links:** 4px spacing

### Best Practices
- Use padding to increase touch target size without affecting visual size
- Group related actions together
- Provide visual feedback on touch
- Ensure targets are not too close together

---

## Gestures

### Tap
- **Description:** Single finger tap for selection and activation
- **Use Case:** Select cards, open modals, trigger actions
- **Implementation:** `onClick`, `onTouchEnd` with 300ms debounce
- **Accessibility:** Keyboard equivalent: Enter/Space, Screen reader: Button role

### Long Press
- **Description:** Press and hold for 500ms+ to trigger context menu
- **Use Case:** Card context menu, item details, drag initiation
- **Implementation:** `onTouchStart` + `setTimeout(500ms)` + `onTouchEnd` check
- **Accessibility:** Keyboard equivalent: Right-click or Shift+F10

### Swipe
- **Description:** Horizontal or vertical swipe gesture
- **Use Case:** Navigate between cards, dismiss modals, scroll lists
- **Implementation:** `onTouchStart` + `onTouchMove` + `onTouchEnd` with velocity calculation
- **Accessibility:** Keyboard equivalent: Arrow keys

### Pinch/Zoom
- **Description:** Two-finger pinch to zoom in/out
- **Use Case:** Zoom dashboard, scale cards, view details
- **Implementation:** `TouchEvent.touches.length === 2` + distance calculation
- **Accessibility:** Keyboard equivalent: Ctrl+Plus/Minus

### Drag
- **Description:** Press and drag to move cards or items
- **Use Case:** Move cards, reorder lists, drag-and-drop
- **Implementation:** `onTouchStart` + `onTouchMove` + `onTouchEnd` with position tracking
- **Accessibility:** Keyboard equivalent: Arrow keys with modifier

---

## Responsive Breakpoints

### Mobile (0-767px)
- **Layout:** Single column, stacked cards
- **Navigation:** Bottom navigation
- **Spacing:** 8px base
- **Typography:** 14px base, 20px heading, 12px small

### Tablet (768-1023px)
- **Layout:** Two columns, side-by-side cards
- **Navigation:** Side navigation
- **Spacing:** 12px base
- **Typography:** 16px base, 24px heading, 14px small

### Desktop (1024px+)
- **Layout:** Multi-column, grid layout
- **Navigation:** Top navigation
- **Spacing:** 16px base
- **Typography:** 16px base, 24px heading, 14px small

---

## Card System on Mobile

### Card Layout
- **Single Column:** Cards stack vertically on mobile
- **Full Width:** Cards take full width on mobile
- **Spacing:** 12px between cards
- **Padding:** 16px internal padding

### Card Interactions
- **Tap:** Select card, open details
- **Long Press:** Context menu
- **Swipe:** Dismiss card (optional)
- **Drag:** Move card (with visual feedback)

### Card Controls
- **Size:** 44x44px minimum
- **Spacing:** 8px between controls
- **Position:** Top-right corner (accessible)
- **Visibility:** Show on hover/long press

---

## Typography

### Mobile
- **Base:** 14px
- **Heading:** 20px
- **Small:** 12px
- **Line Height:** 1.5

### Tablet
- **Base:** 16px
- **Heading:** 24px
- **Small:** 14px
- **Line Height:** 1.5

---

## Spacing

### Mobile
- **Base:** 8px
- **Card Spacing:** 12px
- **Section Spacing:** 16px

### Tablet
- **Base:** 12px
- **Card Spacing:** 16px
- **Section Spacing:** 24px

### Desktop
- **Base:** 16px
- **Card Spacing:** 20px
- **Section Spacing:** 32px

---

## Best Practices

### Performance
- Use CSS transforms for animations
- Avoid layout shifts
- Optimize images for mobile
- Use lazy loading

### Accessibility
- Provide keyboard equivalents
- Support screen readers
- Ensure sufficient contrast
- Test with assistive technologies

### User Experience
- Provide visual feedback
- Use haptic feedback (where available)
- Minimize typing requirements
- Optimize for one-handed use

---

## Testing

### Devices
- **iOS:** iPhone SE, iPhone 12, iPhone 14 Pro Max
- **Android:** Pixel 5, Samsung Galaxy S21, OnePlus 9

### Networks
- **3G:** Test on 3G throttling
- **4G:** Test on 4G throttling
- **Offline:** Test offline functionality

### Tools
- **Chrome DevTools:** Device emulation
- **BrowserStack:** Real device testing
- **Lighthouse:** Mobile performance

---

## Implementation Examples

### Touch Target

```tsx
<button
  className="touch-target"
  style={{
    minWidth: '44px',
    minHeight: '44px',
    padding: '8px',
  }}
>
  Save
</button>
```

### Responsive Layout

```tsx
import { isMobile, isTablet } from '@/config/mobileDesignPatterns';

<div className={isMobile() ? 'mobile-layout' : isTablet() ? 'tablet-layout' : 'desktop-layout'}>
  {/* Content */}
</div>
```

### Gesture Handling

```tsx
const handleTouchStart = (e: React.TouchEvent) => {
  // Handle touch start
};

const handleTouchMove = (e: React.TouchEvent) => {
  // Handle touch move
};

const handleTouchEnd = (e: React.TouchEvent) => {
  // Handle touch end
};

<div
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
>
  {/* Content */}
</div>
```

---

## Future Enhancements

- Haptic feedback support
- Advanced gesture recognition
- Voice commands
- Accessibility improvements
- Performance optimizations

---

**Last Updated:** November 9, 2025






