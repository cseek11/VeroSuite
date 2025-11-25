/**
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
