import React, { createContext, useContext, useState, ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50" 
            onClick={() => onOpenChange(false)}
          />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

export function DialogContent({ children, className = '' }: DialogContentProps) {
  return (
    <div className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-4 ${className}`}>
      {children}
    </div>
  );
}

interface DialogHeaderProps {
  children: ReactNode;
}

export function DialogHeader({ children }: DialogHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      {children}
    </div>
  );
}

interface DialogTitleProps {
  children: ReactNode;
  className?: string;
}

export function DialogTitle({ children, className = '' }: DialogTitleProps) {
  return (
    <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
}

interface DialogDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function DialogDescription({ children, className = '' }: DialogDescriptionProps) {
  return (
    <p className={`text-sm text-gray-600 mt-1 ${className}`}>
      {children}
    </p>
  );
}

interface DialogFooterProps {
  children: ReactNode;
  className?: string;
}

export function DialogFooter({ children, className = '' }: DialogFooterProps) {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 flex justify-end gap-2 ${className}`}>
      {children}
    </div>
  );
}

interface DialogCloseProps {
  children: ReactNode;
  className?: string;
}

export function DialogClose({ children, className = '' }: DialogCloseProps) {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('DialogClose must be used within a Dialog');
  }

  return (
    <button
      onClick={() => context.onOpenChange(false)}
      className={className}
    >
      {children}
    </button>
  );
}

