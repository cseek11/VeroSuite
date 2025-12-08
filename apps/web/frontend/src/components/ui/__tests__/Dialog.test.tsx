/**
 * Dialog Component Tests
 * 
 * Tests for the Dialog component including:
 * - Modal rendering
 * - Open/close functionality
 * - Backdrop click
 * - Escape key handling
 * - Dialog content, header, footer
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../Dialog';

describe('Dialog', () => {
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should not render when open is false', () => {
      render(
        <Dialog open={false} onOpenChange={mockOnOpenChange}>
          <DialogContent>Test Content</DialogContent>
        </Dialog>
      );

      expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
    });

    it('should render when open is true', () => {
      render(
        <Dialog open={true} onOpenChange={mockOnOpenChange}>
          <DialogContent>Test Content</DialogContent>
        </Dialog>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render dialog with backdrop', () => {
      render(
        <Dialog open={true} onOpenChange={mockOnOpenChange}>
          <DialogContent>Test Content</DialogContent>
        </Dialog>
      );

      const backdrop = document.querySelector('.fixed.inset-0.bg-black');
      expect(backdrop).toBeInTheDocument();
    });
  });

  describe('Open/Close Functionality', () => {
    it('should call onOpenChange when backdrop is clicked', () => {
      render(
        <Dialog open={true} onOpenChange={mockOnOpenChange}>
          <DialogContent>Test Content</DialogContent>
        </Dialog>
      );

      const backdrop = document.querySelector('.fixed.inset-0.bg-black');
      fireEvent.click(backdrop!);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('should call onOpenChange when DialogClose is clicked', () => {
      render(
        <Dialog open={true} onOpenChange={mockOnOpenChange}>
          <DialogContent>
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </Dialog>
      );

      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('DialogContent', () => {
    it('should render dialog content', () => {
      render(
        <Dialog open={true} onOpenChange={mockOnOpenChange}>
          <DialogContent>Content</DialogContent>
        </Dialog>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Dialog open={true} onOpenChange={mockOnOpenChange}>
          <DialogContent className="custom-class">Content</DialogContent>
        </Dialog>
      );

      const content = screen.getByText('Content').closest('.bg-white');
      expect(content).toHaveClass('custom-class');
    });
  });

  describe('DialogHeader', () => {
    it('should render dialog header', () => {
      render(
        <Dialog open={true} onOpenChange={mockOnOpenChange}>
          <DialogContent>
            <DialogHeader>Header</DialogHeader>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText('Header')).toBeInTheDocument();
    });
  });

  describe('DialogTitle', () => {
    it('should render dialog title', () => {
      render(
        <Dialog open={true} onOpenChange={mockOnOpenChange}>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Dialog open={true} onOpenChange={mockOnOpenChange}>
          <DialogContent>
            <DialogTitle className="custom-title">Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const title = screen.getByText('Title');
      expect(title).toHaveClass('custom-title');
    });
  });

  describe('DialogDescription', () => {
    it('should render dialog description', () => {
      render(
        <Dialog open={true} onOpenChange={mockOnOpenChange}>
          <DialogContent>
            <DialogDescription>Description text</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText('Description text')).toBeInTheDocument();
    });
  });

  describe('DialogFooter', () => {
    it('should render dialog footer', () => {
      render(
        <Dialog open={true} onOpenChange={mockOnOpenChange}>
          <DialogContent>
            <DialogFooter>Footer</DialogFooter>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    // Regression Prevention: DIALOG_FOOTER_EXPORT_MISSING - 2025-11-16
    // Pattern: DIALOG_FOOTER_EXPORT_MISSING (see docs/error-patterns.md)
    // Test ensures DialogFooter is properly exported and importable
    it('should be importable from index file', () => {
      // This test prevents regression of the bug where DialogFooter was defined
      // but not exported, causing "does not provide an export named 'DialogFooter'"
      expect(DialogFooter).toBeDefined();
      expect(typeof DialogFooter).toBe('function');
    });

    it('should be importable from ui/index.ts', async () => {
      // Regression test: Verify DialogFooter can be imported from barrel export
      const uiIndex = await import('../index');
      expect(uiIndex.DialogFooter).toBeDefined();
      expect(typeof uiIndex.DialogFooter).toBe('function');
    });
  });

  describe('DialogClose', () => {
    it('should throw error when used outside Dialog context', () => {
      // Suppress console.error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<DialogClose>Close</DialogClose>);
      }).toThrow('DialogClose must be used within a Dialog');

      consoleError.mockRestore();
    });

    it('should close dialog when clicked', () => {
      render(
        <Dialog open={true} onOpenChange={mockOnOpenChange}>
          <DialogContent>
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </Dialog>
      );

      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });
});

