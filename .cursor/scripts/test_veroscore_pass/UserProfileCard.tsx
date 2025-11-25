/**
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
