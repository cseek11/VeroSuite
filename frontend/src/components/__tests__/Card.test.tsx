import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from '../ui/Card';

describe('Card', () => {
  it('renders children content', () => {
    render(<Card>Test content</Card>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(<Card title="Test Title">Content</Card>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders with actions', () => {
    const actions = [
      <button key="1">Action 1</button>,
      <button key="2">Action 2</button>
    ];
    render(<Card title="Test Title" actions={actions}>Content</Card>);
    expect(screen.getByText('Action 1')).toBeInTheDocument();
    expect(screen.getByText('Action 2')).toBeInTheDocument();
  });

  it('renders without header when no title or actions', () => {
    render(<Card>Content</Card>);
    const card = screen.getByText('Content').closest('div');
    expect(card?.querySelector('.px-6.py-4')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Card className="custom-class">Content</Card>);
    const card = screen.getByText('Content').closest('.bg-white');
    expect(card).toHaveClass('custom-class');
  });

  it('has proper structure with title and actions', () => {
    const actions = [<button key="1">Action</button>];
    render(<Card title="Test Title" actions={actions}>Content</Card>);
    
    const card = screen.getByText('Content').closest('.bg-white');
    expect(card).toHaveClass('bg-white', 'rounded-xl', 'shadow-sm');
  });
});
