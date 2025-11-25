# UserProfileCard Component

**Last Updated:** 2025-11-25

## Overview

The `UserProfileCard` component provides a reusable, accessible, and type-safe way to display and edit user profile information in the VeroField application.

## Features

- ✅ **Type Safety**: Full TypeScript support with proper interfaces
- ✅ **Input Validation**: Email format validation and required field checks
- ✅ **Error Handling**: Comprehensive error handling with user-friendly messages
- ✅ **Accessibility**: ARIA labels and semantic HTML
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **Test Coverage**: Comprehensive test suite with edge cases

## Usage

```tsx
import { UserProfileCard } from '@/components/UserProfileCard';

function ProfilePage() {
  const handleUpdate = async (userId: string, updates: ProfileUpdates) => {
    // Update user profile via API
    await updateUserProfile(userId, updates);
  };

  return (
    <UserProfileCard
      userId="user-123"
      name="John Doe"
      email="john@example.com"
      onUpdate={handleUpdate}
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `userId` | `string` | Yes | Unique user identifier |
| `name` | `string` | Yes | User's full name |
| `email` | `string` | Yes | User's email address |
| `onUpdate` | `function` | No | Callback when profile is updated |
| `className` | `string` | No | Additional CSS classes |

## Testing

Run tests with:
```bash
npm test UserProfileCard.test.tsx
```

Test coverage includes:
- Component rendering
- User interactions
- Form validation
- Error handling
- Edge cases

## Architecture

- **Location**: `frontend/src/components/ui/UserProfileCard.tsx`
- **Tests**: `frontend/src/components/ui/__tests__/UserProfileCard.test.tsx`
- **Dependencies**: React, TypeScript
