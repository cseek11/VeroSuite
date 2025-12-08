import { createContext, useContext, ReactNode } from 'react';
import { createPortal } from 'react-dom';

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
  if (!open) return null;

  const dialogContent = (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto py-4 px-4">
        <div 
          className="fixed inset-0 bg-black bg-opacity-50" 
          onClick={() => onOpenChange(false)}
          style={{ zIndex: -1 }}
        />
        <div className="relative w-full max-w-full flex-shrink-0" style={{ zIndex: 1 }}>
          {children}
        </div>
      </div>
    </DialogContext.Provider>
  );

  // Render dialog at document body level using portal
  return typeof document !== 'undefined' 
    ? createPortal(dialogContent, document.body)
    : dialogContent;
}

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

export function DialogContent({ children, className = '' }: DialogContentProps) {
  // Extract max-width from className if provided, otherwise use default
  const hasMaxWidth = className.includes('max-w-');
  const defaultMaxWidth = hasMaxWidth ? '' : 'max-w-md';
  
  // Check if max-height is provided, if not add a default
  const hasMaxHeight = className.includes('max-h-');
  const defaultMaxHeight = hasMaxHeight ? '' : 'max-h-[90vh]';
  
  return (
    <div className={`bg-white rounded-lg shadow-xl ${defaultMaxWidth} ${defaultMaxHeight} w-full mx-auto min-h-[400px] ${className}`}>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

interface DialogHeaderProps {
  children: ReactNode;
}

export function DialogHeader({ children }: DialogHeaderProps) {
  return (
    <div className="-mx-6 -mt-6 px-6 py-4 mb-4 border-b border-gray-200">
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
    <div className={`-mx-6 -mb-6 px-6 py-4 mt-4 border-t border-gray-200 flex justify-end gap-2 ${className}`}>
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

