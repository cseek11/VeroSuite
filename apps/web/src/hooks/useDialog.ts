import React, { useState, useCallback, useRef } from 'react';
import { AlertDialog, ConfirmDialog } from '@/components/ui/DialogModals';

interface AlertOptions {
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

export function useDialog() {
  const [alertState, setAlertState] = useState<{
    open: boolean;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
  }>({
    open: false,
    title: '',
    message: '',
    type: 'info',
  });

  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    type: 'warning' | 'danger' | 'info';
  }>({
    open: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'warning',
  });

  const confirmResolveRef = useRef<((value: boolean) => void) | null>(null);

  const showAlert = useCallback((options: AlertOptions): Promise<void> => {
    return new Promise((resolve) => {
      setAlertState({
        open: true,
        title: options.title,
        message: options.message,
        type: options.type || 'info',
      });

      // Store resolve to call when dialog closes
      const originalClose = () => {
        setAlertState((prev) => ({ ...prev, open: false }));
        resolve();
      };
      (window as any).__alertResolve = originalClose;
    });
  }, []);

  const showConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      confirmResolveRef.current = resolve;
      setConfirmState({
        open: true,
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        type: options.type || 'warning',
      });
    });
  }, []);

  const handleAlertClose = useCallback((open: boolean) => {
    if (!open) {
      setAlertState((prev) => ({ ...prev, open: false }));
      if ((window as any).__alertResolve) {
        (window as any).__alertResolve();
        delete (window as any).__alertResolve;
      }
    }
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmResolveRef.current) {
      confirmResolveRef.current(true);
      confirmResolveRef.current = null;
    }
    setConfirmState((prev) => ({ ...prev, open: false }));
  }, []);

  const handleCancel = useCallback(() => {
    if (confirmResolveRef.current) {
      confirmResolveRef.current(false);
      confirmResolveRef.current = null;
    }
    setConfirmState((prev) => ({ ...prev, open: false }));
  }, []);

  const handleConfirmClose = useCallback((open: boolean) => {
    if (!open) {
      handleCancel();
    }
  }, [handleCancel]);

  const DialogComponents = () => {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(AlertDialog, {
        open: alertState.open,
        onOpenChange: handleAlertClose,
        title: alertState.title,
        message: alertState.message,
        type: alertState.type,
      }),
      React.createElement(ConfirmDialog, {
        open: confirmState.open,
        onOpenChange: handleConfirmClose,
        onConfirm: handleConfirm,
        title: confirmState.title,
        message: confirmState.message,
        confirmText: confirmState.confirmText,
        cancelText: confirmState.cancelText,
        type: confirmState.type,
      })
    );
  };

  return {
    showAlert,
    showConfirm,
    DialogComponents,
  };
}

