# Keyboard Navigation Guide

The VeroPest Suite application includes comprehensive keyboard navigation support for improved accessibility and productivity.

## Quick Start

- Press `?` to view all available keyboard shortcuts
- Use `Tab` to navigate between interactive elements
- Press `Esc` to close modals and dialogs
- Use number keys `1-7` for quick navigation to main sections

## Navigation Shortcuts

### Main Navigation
| Shortcut | Action |
|----------|--------|
| `1` | Go to Dashboard |
| `2` | Go to Jobs |
| `3` | Go to Customers |
| `4` | Go to Routing |
| `5` | Go to Reports |
| `6` | Go to Uploads |
| `7` | Go to Settings |

### Quick Navigation
| Shortcut | Action |
|----------|--------|
| `h` | Go to Dashboard (Home) |
| `j` | Go to Jobs |
| `c` | Go to Customers |
| `r` | Go to Reports |
| `s` | Go to Settings |

## Action Shortcuts

### Content Creation
| Shortcut | Action |
|----------|--------|
| `Ctrl + N` | Create New Job |
| `Ctrl + Shift + N` | Create New Customer |

### Search and Navigation
| Shortcut | Action |
|----------|--------|
| `Ctrl + F` | Focus search input |
| `Ctrl + K` | Toggle sidebar |
| `Ctrl + R` | Refresh page |

### General Actions
| Shortcut | Action |
|----------|--------|
| `?` | Show keyboard shortcuts modal |
| `Esc` | Close modal/dialog |

## Focus Management

### Tab Navigation
- `Tab` - Move to next focusable element
- `Shift + Tab` - Move to previous focusable element
- `Home` - Move to first focusable element
- `End` - Move to last focusable element

### Focus Indicators
- All interactive elements have visible focus indicators
- Focus indicators use purple outline (`#8b5cf6`)
- High contrast mode available for better visibility

## Accessibility Features

### Skip Links
- Press `Tab` when the page loads to access the skip link
- Skip link allows quick navigation to main content
- Helps screen reader users and keyboard-only users

### Screen Reader Support
- All interactive elements have proper ARIA labels
- Semantic HTML structure for better navigation
- Focus management for dynamic content

### Keyboard-Only Navigation
- All functionality accessible via keyboard
- No mouse-dependent interactions
- Logical tab order throughout the application

## Visual Feedback

### Shortcut Feedback
- Visual feedback when shortcuts are used
- Toast notifications for successful actions
- Clear indication of current focus state

### Focus Indicators
- Purple outline for focused elements
- High contrast mode support
- Reduced motion support for users with vestibular disorders

## Components

### KeyboardNavigationProvider
The main provider that wraps the application and provides:
- Global keyboard event handling
- Shortcut registration and management
- Focus management utilities
- Accessibility features

### KeyboardShortcutsModal
A comprehensive modal that displays:
- All available shortcuts
- Searchable shortcut list
- Categorized shortcuts (Navigation, Actions, Focus)
- Keyboard-friendly navigation

### FocusManager
A utility component for:
- Focus trapping in modals
- Auto-focus management
- Focus restoration
- Focus change tracking

### SkipLink
An accessibility component that:
- Provides quick navigation to main content
- Is hidden by default, visible on focus
- Helps keyboard and screen reader users

## Implementation Details

### Hook: useKeyboardNavigation
```typescript
const {
  focusFirstElement,
  focusLastElement,
  focusNextElement,
  focusPreviousElement,
  getFocusableElements,
  getAllShortcuts
} = useKeyboardNavigation({
  enabled: true,
  onShortcut: (shortcut) => console.log(shortcut)
});
```

### Focus Management
```typescript
// Get all focusable elements
const focusableElements = getFocusableElements();

// Focus first element
focusFirstElement();

// Focus last element
focusLastElement();
```

### Custom Shortcuts
You can add custom shortcuts by extending the hook:
```typescript
const customShortcuts = [
  {
    key: 'b',
    description: 'Go to Backend',
    action: () => navigate('/backend')
  }
];
```

## Browser Support

- Chrome/Edge (Chromium) - Full support
- Firefox - Full support
- Safari - Full support
- Mobile browsers - Limited support (keyboard shortcuts disabled on touch devices)

## Best Practices

### For Users
1. Use `?` to learn available shortcuts
2. Use `Tab` for systematic navigation
3. Use number keys for quick section access
4. Use `Esc` to close unwanted dialogs

### For Developers
1. Always provide keyboard alternatives to mouse actions
2. Use semantic HTML elements
3. Include proper ARIA labels
4. Test with keyboard-only navigation
5. Ensure logical tab order

## Troubleshooting

### Shortcuts Not Working
1. Check if you're typing in an input field
2. Ensure keyboard navigation is enabled
3. Try refreshing the page
4. Check browser console for errors

### Focus Issues
1. Use `Tab` to navigate systematically
2. Press `Home` to go to first element
3. Press `End` to go to last element
4. Use `Esc` to close modals

### Accessibility Issues
1. Ensure screen reader is enabled
2. Use `Tab` to access skip links
3. Check focus indicators are visible
4. Test with high contrast mode

## Future Enhancements

- Voice command support
- Customizable shortcuts
- Shortcut conflict resolution
- Advanced focus management
- Mobile gesture support
- International keyboard layouts

## Contributing

When adding new features:
1. Include keyboard navigation support
2. Add proper focus management
3. Include ARIA labels
4. Test with keyboard-only navigation
5. Update this documentation

## Support

For issues or questions about keyboard navigation:
1. Check this documentation
2. Use the `?` shortcut to view all shortcuts
3. Test with different browsers
4. Report issues with specific steps to reproduce





