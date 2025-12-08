import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './Dialog';
import Button from './Button';
import Input from './Input';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

// ===== AlertDialog Component =====
interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
}

export function AlertDialog({ open, onOpenChange, title, message, type = 'info' }: AlertDialogProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return 'border-amber-300 bg-amber-50';
      case 'error':
        return 'border-red-300 bg-red-50';
      case 'success':
        return 'border-emerald-300 bg-emerald-50';
      default:
        return 'border-blue-300 bg-blue-50';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'warning':
        return 'text-amber-600';
      case 'error':
        return 'text-red-600';
      case 'success':
        return 'text-emerald-600';
      default:
        return 'text-blue-600';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className={`w-5 h-5 ${getIconColor()}`} />;
      case 'error':
        return <AlertCircle className={`w-5 h-5 ${getIconColor()}`} />;
      case 'success':
        return <CheckCircle className={`w-5 h-5 ${getIconColor()}`} />;
      default:
        return <Info className={`w-5 h-5 ${getIconColor()}`} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className={`p-4 rounded-lg border ${getTypeStyles()}`}>
          <div className="flex items-start gap-3">
            {getIcon()}
            <p className={`text-sm font-medium ${getIconColor()} flex-1`}>{message}</p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="primary"
            onClick={() => onOpenChange(false)}
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ===== ConfirmDialog Component =====
interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}: ConfirmDialogProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return 'border-red-300 bg-red-50';
      case 'info':
        return 'border-blue-300 bg-blue-50';
      default:
        return 'border-amber-300 bg-amber-50';
    }
  };

  const getConfirmButtonVariant = () => {
    switch (type) {
      case 'danger':
        return 'danger' as const;
      case 'info':
        return 'primary' as const;
      default:
        return 'primary' as const;
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className={`p-4 rounded-lg border ${getTypeStyles()}`}>
          <p className="text-sm text-slate-700">{message}</p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            {cancelText}
          </Button>
          <Button
            variant={getConfirmButtonVariant()}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ===== PromptDialog Component =====
interface PromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (value: string) => void;
  title: string;
  message: string;
  placeholder?: string;
  defaultValue?: string;
  confirmText?: string;
  cancelText?: string;
}

export function PromptDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  message,
  placeholder = '',
  defaultValue = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}: PromptDialogProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (open) {
      setValue(defaultValue);
    }
  }, [open, defaultValue]);

  const handleConfirm = () => {
    if (value.trim()) {
      onConfirm(value);
      setValue('');
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setValue('');
    onOpenChange(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      handleConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="p-4 rounded-lg border border-blue-300 bg-blue-50">
          <p className="text-sm text-slate-700 mb-3">{message}</p>
          <Input
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            {cancelText}
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!value.trim()}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

