/**
 * Mobile Design Patterns
 * 
 * Defines mobile interaction patterns, touch targets, gestures, and responsive design guidelines
 * for the VeroField dashboard and card system.
 */

export interface TouchTarget {
  minWidth: number; // pixels
  minHeight: number; // pixels
  spacing: number; // pixels between targets
  description: string;
}

export interface GesturePattern {
  name: string;
  description: string;
  useCase: string;
  implementation: string;
  accessibility: string;
}

export interface ResponsiveBreakpoint {
  name: string;
  minWidth: number;
  maxWidth?: number;
  description: string;
  layout: string;
}

export interface MobileDesignPatterns {
  touchTargets: {
    primary: TouchTarget;
    secondary: TouchTarget;
    icon: TouchTarget;
    card: TouchTarget;
    text: TouchTarget;
  };
  
  gestures: {
    tap: GesturePattern;
    longPress: GesturePattern;
    swipe: GesturePattern;
    pinch: GesturePattern;
    drag: GesturePattern;
  };
  
  breakpoints: ResponsiveBreakpoint[];
  
  spacing: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  
  typography: {
    mobile: {
      base: number;
      heading: number;
      small: number;
    };
    tablet: {
      base: number;
      heading: number;
      small: number;
    };
  };
}

/**
 * Mobile Design Patterns Configuration
 * 
 * Based on:
 * - Apple Human Interface Guidelines
 * - Material Design Guidelines
 * - WCAG 2.1 Accessibility Guidelines
 * - Real-world mobile UX best practices
 */
export const mobileDesignPatterns: MobileDesignPatterns = {
  touchTargets: {
    primary: {
      minWidth: 44,
      minHeight: 44,
      spacing: 8,
      description: 'Primary action buttons (Save, Submit, etc.)',
    },
    secondary: {
      minWidth: 40,
      minHeight: 40,
      spacing: 8,
      description: 'Secondary action buttons',
    },
    icon: {
      minWidth: 44,
      minHeight: 44,
      spacing: 8,
      description: 'Icon buttons (menu, close, etc.)',
    },
    card: {
      minWidth: 44,
      minHeight: 44,
      spacing: 12,
      description: 'Card interaction areas (drag handle, controls)',
    },
    text: {
      minWidth: 44,
      minHeight: 44,
      spacing: 4,
      description: 'Text links and clickable text',
    },
  },
  
  gestures: {
    tap: {
      name: 'Tap',
      description: 'Single finger tap for selection and activation',
      useCase: 'Select cards, open modals, trigger actions',
      implementation: 'onClick, onTouchEnd with 300ms debounce',
      accessibility: 'Keyboard equivalent: Enter/Space, Screen reader: Button role',
    },
    longPress: {
      name: 'Long Press',
      description: 'Press and hold for 500ms+ to trigger context menu',
      useCase: 'Card context menu, item details, drag initiation',
      implementation: 'onTouchStart + setTimeout(500ms) + onTouchEnd check',
      accessibility: 'Keyboard equivalent: Right-click or Shift+F10, Screen reader: Context menu announcement',
    },
    swipe: {
      name: 'Swipe',
      description: 'Horizontal or vertical swipe gesture',
      useCase: 'Navigate between cards, dismiss modals, scroll lists',
      implementation: 'onTouchStart + onTouchMove + onTouchEnd with velocity calculation',
      accessibility: 'Keyboard equivalent: Arrow keys, Screen reader: Navigation announcement',
    },
    pinch: {
      name: 'Pinch/Zoom',
      description: 'Two-finger pinch to zoom in/out',
      useCase: 'Zoom dashboard, scale cards, view details',
      implementation: 'TouchEvent.touches.length === 2 + distance calculation',
      accessibility: 'Keyboard equivalent: Ctrl+Plus/Minus, Screen reader: Zoom level announcement',
    },
    drag: {
      name: 'Drag',
      description: 'Press and drag to move cards or items',
      useCase: 'Move cards, reorder lists, drag-and-drop',
      implementation: 'onTouchStart + onTouchMove + onTouchEnd with position tracking',
      accessibility: 'Keyboard equivalent: Arrow keys with modifier, Screen reader: Drag mode announcement',
    },
  },
  
  breakpoints: [
    {
      name: 'mobile',
      minWidth: 0,
      maxWidth: 767,
      description: 'Mobile phones (portrait and landscape)',
      layout: 'Single column, stacked cards, bottom navigation',
    },
    {
      name: 'tablet',
      minWidth: 768,
      maxWidth: 1023,
      description: 'Tablets (portrait and landscape)',
      layout: 'Two columns, side-by-side cards, side navigation',
    },
    {
      name: 'desktop',
      minWidth: 1024,
      description: 'Desktop and large screens',
      layout: 'Multi-column, grid layout, top navigation',
    },
  ],
  
  spacing: {
    mobile: 8, // 8px base spacing on mobile
    tablet: 12, // 12px base spacing on tablet
    desktop: 16, // 16px base spacing on desktop
  },
  
  typography: {
    mobile: {
      base: 14, // 14px base font size
      heading: 20, // 20px heading size
      small: 12, // 12px small text
    },
    tablet: {
      base: 16, // 16px base font size
      heading: 24, // 24px heading size
      small: 14, // 14px small text
    },
  },
};

/**
 * Get touch target size for a given element type
 */
export function getTouchTarget(type: keyof MobileDesignPatterns['touchTargets']): TouchTarget {
  return mobileDesignPatterns.touchTargets[type];
}

/**
 * Get responsive breakpoint for a given width
 */
export function getBreakpoint(width: number): ResponsiveBreakpoint {
  const found = mobileDesignPatterns.breakpoints.find(
    bp => width >= bp.minWidth && (!bp.maxWidth || width <= bp.maxWidth)
  );
  return found ?? mobileDesignPatterns.breakpoints[mobileDesignPatterns.breakpoints.length - 1]!;
}

/**
 * Check if device is mobile
 */
export function isMobile(width: number = window.innerWidth): boolean {
  return width < 768;
}

/**
 * Check if device is tablet
 */
export function isTablet(width: number = window.innerWidth): boolean {
  return width >= 768 && width < 1024;
}

/**
 * Check if device is desktop
 */
export function isDesktop(width: number = window.innerWidth): boolean {
  return width >= 1024;
}

/**
 * Get base spacing for current breakpoint
 */
export function getSpacing(width: number = window.innerWidth): number {
  if (isMobile(width)) return mobileDesignPatterns.spacing.mobile;
  if (isTablet(width)) return mobileDesignPatterns.spacing.tablet;
  return mobileDesignPatterns.spacing.desktop;
}






