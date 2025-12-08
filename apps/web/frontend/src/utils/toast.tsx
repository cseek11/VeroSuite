// Simple toast notification utility
// Uses a global toast manager that can be used without a provider

import { createRoot } from 'react-dom/client';
import React from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

class ToastManager {
  private toasts: ToastItem[] = [];
  private container: HTMLDivElement | null = null;
  private root: ReturnType<typeof createRoot> | null = null;

  private createContainer() {
    if (this.container) return;
    
    this.container = document.createElement('div');
    this.container.className = 'fixed top-4 right-4 z-[10000] space-y-2';
    this.container.id = 'toast-container';
    document.body.appendChild(this.container);
    this.root = createRoot(this.container);
    this.render();
  }

  private render() {
    if (!this.root) return;
    
    this.root.render(
      <>
        {this.toasts.map((toast) => (
          <ToastNotification key={toast.id} {...toast} onClose={() => this.remove(toast.id)} />
        ))}
      </>
    );
  }

  show(message: string, type: ToastType = 'info', duration = 5000) {
    this.createContainer();
    const id = Math.random().toString(36).substr(2, 9);
    this.toasts.push({ id, message, type, duration });
    this.render();
    
    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  remove(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.render();
  }
}

const ToastNotification: React.FC<ToastItem & { onClose: () => void }> = ({
  message,
  type,
  onClose,
}) => {
  const colors = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const Icon = icons[type];

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${colors[type]} animate-in slide-in-from-right`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm font-medium flex-1">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const manager = new ToastManager();

export const toast = {
  success: (message: string, duration?: number) => manager.show(message, 'success', duration),
  error: (message: string, duration?: number) => manager.show(message, 'error', duration),
  info: (message: string, duration?: number) => manager.show(message, 'info', duration),
  warning: (message: string, duration?: number) => manager.show(message, 'warning', duration),
};






