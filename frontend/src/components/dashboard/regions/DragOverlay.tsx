import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import './drag-overlay.css';

interface DragOverlayProps {
  isDragging: boolean;
  isValid: boolean | null;
  message?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

/**
 * Drag overlay component showing visual feedback during drag operations
 */
export const DragOverlay: React.FC<DragOverlayProps> = ({
  isDragging,
  isValid,
  message,
  position,
  size
}) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (isDragging && message) {
      const timer = setTimeout(() => setShowMessage(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowMessage(false);
    }
  }, [isDragging, message]);

  if (!isDragging) return null;

  const overlayClass = `drag-overlay ${isValid === true ? 'valid' : isValid === false ? 'invalid' : ''}`;

  return (
    <AnimatePresence>
      <motion.div
        className={overlayClass}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
          pointerEvents: 'none',
          zIndex: 10000
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {/* Validity indicator */}
        {isValid !== null && (
          <motion.div
            className="validity-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            {isValid ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
          </motion.div>
        )}

        {/* Message tooltip */}
        {showMessage && message && (
          <motion.div
            className="drag-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center gap-2">
              {isValid === false && <AlertCircle className="w-4 h-4" />}
              <span className="text-sm font-medium">{message}</span>
            </div>
          </motion.div>
        )}

        {/* Grid overlay */}
        <div className="drag-grid-overlay" />
      </motion.div>
    </AnimatePresence>
  );
};

interface ValidityIndicatorProps {
  isValid: boolean | null;
  warning?: boolean;
  className?: string;
}

/**
 * Validity indicator component for regions
 */
export const ValidityIndicator: React.FC<ValidityIndicatorProps> = ({
  isValid,
  warning,
  className = ''
}) => {
  if (isValid === null && !warning) return null;

  const indicatorClass = `validity-indicator ${
    isValid === true ? 'valid' : 
    isValid === false ? 'invalid' : 
    warning ? 'warning' : ''
  } ${className}`;

  return (
    <div className={indicatorClass} title={
      isValid === true ? 'Valid position' :
      isValid === false ? 'Invalid position' :
      'Warning'
    }>
      {isValid === true && <CheckCircle className="w-3 h-3 text-green-500" />}
      {isValid === false && <XCircle className="w-3 h-3 text-red-500" />}
      {warning && <AlertCircle className="w-3 h-3 text-yellow-500" />}
    </div>
  );
};




