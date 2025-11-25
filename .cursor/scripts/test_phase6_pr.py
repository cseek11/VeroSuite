#!/usr/bin/env python3
"""
Test Phase 6 PR Creation - Creates a test PR with Phase 6 files and monitors workflow.

Usage:
    python .cursor/scripts/test_phase6_pr.py
"""

import os
import sys
import time
import subprocess
from pathlib import Path
from datetime import datetime, timezone

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from supabase import create_client, Client
except ImportError:
    print("❌ Missing supabase-py package. Install with: pip install supabase", file=sys.stderr)
    sys.exit(1)

from veroscore_v3.pr_creator import PRCreator
from veroscore_v3.session_manager import SessionManager
from veroscore_v3.file_change import FileChange
from logger_util import get_logger

logger = get_logger(context="test_phase6_pr")


def create_test_session():
    """Create a test session with Phase 6 files."""
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SECRET_KEY")
    
    if not supabase_url or not supabase_key:
        print("❌ Error: SUPABASE_URL and SUPABASE_SECRET_KEY environment variables required", file=sys.stderr)
        sys.exit(1)
    
    supabase = create_client(supabase_url, supabase_key)
    session_manager = SessionManager(supabase)
    
    # Create session
    author = "test-user"
    session_id = session_manager.get_or_create_session(author=author)
    print(f"✅ Created session: {session_id}")
    
    # Create high-quality test files that should pass scoring
    # Place in correct frontend location to avoid architecture violations
    component_dir = project_root / "frontend" / "src" / "components" / "ui"
    component_dir.mkdir(parents=True, exist_ok=True)
    
    test_dir = project_root / "frontend" / "src" / "components" / "ui" / "__tests__"
    test_dir.mkdir(parents=True, exist_ok=True)
    
    # 1. Create a well-structured TypeScript component with all best practices
    component_file = test_dir / "UserProfileCard.tsx"
    component_content = """/**
 * UserProfileCard - Displays user profile information with proper security and validation.
 * 
 * Features:
 * - Type-safe props with TypeScript
 * - Input validation
 * - Proper error handling
 * - Accessibility support
 * - Responsive design
 * 
 * @example
 * ```tsx
 * <UserProfileCard
 *   userId="user-123"
 *   name="John Doe"
 *   email="john@example.com"
 *   onUpdate={handleUpdate}
 * />
 * ```
 */

import React, { useState, useCallback } from 'react';

/**
 * Props for UserProfileCard component
 */
interface UserProfileCardProps {
  /** Unique user identifier */
  userId: string;
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** Callback when profile is updated */
  onUpdate?: (userId: string, updates: ProfileUpdates) => Promise<void>;
  /** Optional className for styling */
  className?: string;
}

/**
 * Profile update data structure
 */
interface ProfileUpdates {
  name?: string;
  email?: string;
}

/**
 * UserProfileCard component - Displays and allows editing of user profile
 * 
 * @param props - Component props
 * @returns React component
 */
export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  userId,
  name,
  email,
  onUpdate,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>(name);
  const [editedEmail, setEditedEmail] = useState<string>(email);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Validates email format
   */
  const validateEmail = useCallback((emailValue: string): boolean => {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return emailRegex.test(emailValue);
  }, []);

  /**
   * Handles form submission with validation
   */
  const handleSubmit = useCallback(async (): Promise<void> => {
    setError(null);

    // Input validation
    if (!editedName.trim()) {
      setError('Name is required');
      return;
    }

    if (!validateEmail(editedEmail)) {
      setError('Invalid email format');
      return;
    }

    if (!onUpdate) {
      setIsEditing(false);
      return;
    }

    try {
      setIsLoading(true);
      await onUpdate(userId, {
        name: editedName.trim(),
        email: editedEmail.trim()
      });
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  }, [userId, editedName, editedEmail, onUpdate, validateEmail]);

  return (
    <div className={`user-profile-card ${className}`} role="article" aria-label="User profile">
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      
      {isEditing ? (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <label htmlFor="name-input">
            Name:
            <input
              id="name-input"
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              disabled={isLoading}
              required
            />
          </label>
          
          <label htmlFor="email-input">
            Email:
            <input
              id="email-input"
              type="email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </label>
          
          <div className="button-group">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={() => setIsEditing(false)} disabled={isLoading}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <h2>{name}</h2>
          <p>{email}</p>
          <button onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileCard;
"""
    
    # 2. Create comprehensive test file
    test_file = test_dir / "UserProfileCard.test.tsx"
    test_content = """/**
 * Tests for UserProfileCard component
 * 
 * Coverage:
 * - Component rendering
 * - User interactions
 * - Form validation
 * - Error handling
 * - Edge cases
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserProfileCard } from './UserProfileCard';

describe('UserProfileCard', () => {
  const defaultProps = {
    userId: 'user-123',
    name: 'John Doe',
    email: 'john@example.com'
  };

  describe('Rendering', () => {
    it('should render user information correctly', () => {
      render(<UserProfileCard {...defaultProps} />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <UserProfileCard {...defaultProps} className="custom-class" />
      );
      
      expect(container.querySelector('.user-profile-card.custom-class')).toBeInTheDocument();
    });
  });

  describe('Editing Mode', () => {
    it('should switch to edit mode when Edit button is clicked', () => {
      render(<UserProfileCard {...defaultProps} />);
      
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);
      
      expect(screen.getByLabelText(/name:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
    });

    it('should pre-fill form fields with current values', () => {
      render(<UserProfileCard {...defaultProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      
      const nameInput = screen.getByLabelText(/name:/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/email:/i) as HTMLInputElement;
      
      expect(nameInput.value).toBe('John Doe');
      expect(emailInput.value).toBe('john@example.com');
    });
  });

  describe('Form Validation', () => {
    it('should show error when name is empty', async () => {
      render(<UserProfileCard {...defaultProps} onUpdate={jest.fn()} />);
      
      fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      const nameInput = screen.getByLabelText(/name:/i);
      fireEvent.change(nameInput, { target: { value: '' } });
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });
    });

    it('should show error for invalid email format', async () => {
      render(<UserProfileCard {...defaultProps} onUpdate={jest.fn()} />);
      
      fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      const emailInput = screen.getByLabelText(/email:/i);
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      });
    });

    it('should accept valid email formats', async () => {
      const onUpdate = jest.fn().mockResolvedValue(undefined);
      render(<UserProfileCard {...defaultProps} onUpdate={onUpdate} />);
      
      fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      const emailInput = screen.getByLabelText(/email:/i);
      fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
      
      await waitFor(() => {
        expect(onUpdate).toHaveBeenCalledWith('user-123', {
          name: 'John Doe',
          email: 'newemail@example.com'
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when update fails', async () => {
      const errorMessage = 'Network error';
      const onUpdate = jest.fn().mockRejectedValue(new Error(errorMessage));
      render(<UserProfileCard {...defaultProps} onUpdate={onUpdate} />);
      
      fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should handle update without onUpdate callback', () => {
      render(<UserProfileCard {...defaultProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
      
      // Should exit edit mode without error
      expect(screen.queryByLabelText(/name:/i)).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long names', () => {
      const longName = 'A'.repeat(200);
      render(<UserProfileCard {...defaultProps} name={longName} />);
      
      expect(screen.getByText(longName)).toBeInTheDocument();
    });

    it('should trim whitespace from inputs', async () => {
      const onUpdate = jest.fn().mockResolvedValue(undefined);
      render(<UserProfileCard {...defaultProps} onUpdate={onUpdate} />);
      
      fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      const nameInput = screen.getByLabelText(/name:/i);
      fireEvent.change(nameInput, { target: { value: '  Trimmed Name  ' } });
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
      
      await waitFor(() => {
        expect(onUpdate).toHaveBeenCalledWith('user-123', {
          name: 'Trimmed Name',
          email: expect.any(String)
        });
      });
    });
  });
});
"""
    
    # 3. Create documentation file
    doc_file = test_dir / "README.md"
    doc_content = """# UserProfileCard Component

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
"""
    
    # Write files and create changes
    changes = []
    
    # Component file (in correct frontend location)
    component_file = component_dir / "UserProfileCard.tsx"
    component_file.write_text(component_content, encoding='utf-8')
    changes.append(FileChange(
        path=str(component_file.relative_to(project_root)),
        change_type="added",
        timestamp=datetime.now(timezone.utc).isoformat(),
        lines_added=len(component_content.split('\n')),
        lines_removed=0
    ))
    print(f"  ✅ Created {component_file.relative_to(project_root)}")
    
    # Test file (in correct test location)
    test_file = test_dir / "UserProfileCard.test.tsx"
    test_file.write_text(test_content, encoding='utf-8')
    changes.append(FileChange(
        path=str(test_file.relative_to(project_root)),
        change_type="added",
        timestamp=datetime.now(timezone.utc).isoformat(),
        lines_added=len(test_content.split('\n')),
        lines_removed=0
    ))
    print(f"  ✅ Created {test_file.relative_to(project_root)}")
    
    # Documentation file (in component directory)
    doc_file = component_dir / "UserProfileCard.md"
    doc_file.write_text(doc_content, encoding='utf-8')
    changes.append(FileChange(
        path=str(doc_file.relative_to(project_root)),
        change_type="added",
        timestamp=datetime.now(timezone.utc).isoformat(),
        lines_added=len(doc_content.split('\n')),
        lines_removed=0
    ))
    print(f"  ✅ Created {doc_file.relative_to(project_root)}")
    
    # Add all changes in batch
    if changes:
        session_manager.add_changes_batch(session_id, changes)
        print(f"  ✅ Added {len(changes)} high-quality files to session")
    
    return session_id, supabase


def create_pr(session_id, supabase):
    """Create PR for session."""
    pr_creator = PRCreator(supabase, project_root)
    
    print(f"\n🚀 Creating PR for session: {session_id}")
    pr_result = pr_creator.create_pr(session_id, force=False)
    
    if pr_result:
        pr_number = pr_result.get('pr_number')
        pr_url = pr_result.get('pr_url')
        print(f"\n✅ PR created successfully!")
        print(f"   PR Number: {pr_number}")
        print(f"   PR URL: {pr_url}")
        return pr_number, pr_url
    else:
        print(f"\n❌ Failed to create PR", file=sys.stderr)
        return None, None


def monitor_workflow(pr_number, max_wait=300):
    """Monitor workflow execution for PR."""
    print(f"\n📊 Monitoring workflow for PR #{pr_number}...")
    print(f"   Waiting up to {max_wait} seconds...")
    
    start_time = time.time()
    last_status = None
    
    while time.time() - start_time < max_wait:
        try:
            # Get workflow runs for this PR
            result = subprocess.run(
                ["gh", "run", "list", "--workflow=verofield_auto_pr.yml", "--limit", "5"],
                capture_output=True,
                text=True,
                check=True
            )
            
            # Check if any run is for this PR
            lines = result.stdout.strip().split('\n')
            for line in lines[1:]:  # Skip header
                if str(pr_number) in line or f"#{pr_number}" in line:
                    parts = line.split()
                    if len(parts) >= 3:
                        run_id = parts[0]
                        status = parts[1]
                        conclusion = parts[2] if len(parts) > 2 else "in_progress"
                        
                        if status != last_status or conclusion != "in_progress":
                            print(f"   [{time.strftime('%H:%M:%S')}] Run {run_id}: {status} - {conclusion}")
                            last_status = status
                            
                            if conclusion != "in_progress" and conclusion != "queued":
                                print(f"\n✅ Workflow completed: {conclusion}")
                                return conclusion
            
            time.sleep(10)  # Check every 10 seconds
            
        except subprocess.CalledProcessError as e:
            print(f"   ⚠️  Error checking workflow: {e.stderr}")
            time.sleep(10)
        except Exception as e:
            print(f"   ⚠️  Error: {e}")
            time.sleep(10)
    
    print(f"\n⏱️  Timeout reached ({max_wait}s)")
    return None


def check_pr_comments(pr_number):
    """Check PR comments for VeroScore results."""
    print(f"\n💬 Checking PR comments for PR #{pr_number}...")
    
    try:
        result = subprocess.run(
            ["gh", "pr", "view", str(pr_number), "--json", "comments"],
            capture_output=True,
            text=True,
            check=True
        )
        
        import json
        pr_data = json.loads(result.stdout)
        comments = pr_data.get("comments", [])
        
        for comment in comments:
            body = comment.get("body", "")
            if "VeroScore" in body or "Auto-BLOCK" in body or "Auto-APPROVE" in body or "Review Required" in body:
                print(f"\n📝 Found VeroScore comment:")
                print(f"   {body[:200]}...")
                return body
        
        print("   No VeroScore comments found yet")
        return None
        
    except Exception as e:
        print(f"   ⚠️  Error checking comments: {e}")
        return None


def main():
    """Main execution."""
    print("=" * 60)
    print("Phase 6 PR Test - Creating PR and Monitoring Workflow")
    print("=" * 60)
    
    # Create session
    session_id, supabase = create_test_session()
    
    # Create PR
    pr_number, pr_url = create_pr(session_id, supabase)
    
    if not pr_number:
        print("\n❌ Failed to create PR. Exiting.")
        sys.exit(1)
    
    # Monitor workflow
    conclusion = monitor_workflow(pr_number, max_wait=300)
    
    # Check PR comments
    comment = check_pr_comments(pr_number)
    
    # Summary
    print("\n" + "=" * 60)
    print("Summary")
    print("=" * 60)
    print(f"Session ID: {session_id}")
    print(f"PR Number: {pr_number}")
    print(f"PR URL: {pr_url}")
    print(f"Workflow Conclusion: {conclusion or 'Timeout'}")
    print(f"VeroScore Comment: {'Found' if comment else 'Not found'}")
    print("\n✅ Test complete!")


if __name__ == '__main__':
    main()

