import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, BookOpen, Video } from 'lucide-react';

interface HelpTopic {
  id: string;
  title: string;
  content: string;
  category: 'getting-started' | 'features' | 'troubleshooting';
}

interface ContextualHelpProps {
  topic?: string;
  position?: { x: number; y: number };
  onClose?: () => void;
}

/**
 * Contextual help component that provides help based on current context
 */
export const ContextualHelp: React.FC<ContextualHelpProps> = ({
  topic,
  position,
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<HelpTopic | null>(null);

  const helpTopics: HelpTopic[] = [
    {
      id: 'drag-drop',
      title: 'Drag and Drop',
      content: 'Click and hold the drag handle (top-left corner) to move regions. Release to drop in a new position.',
      category: 'features'
    },
    {
      id: 'resize',
      title: 'Resizing Regions',
      content: 'Hover over a region and use the resize handles on the edges or corners to change its size.',
      category: 'features'
    },
    {
      id: 'settings',
      title: 'Region Settings',
      content: 'Click the settings icon (purple button) to customize colors, titles, and other properties.',
      category: 'features'
    },
    {
      id: 'collaboration',
      title: 'Real-time Collaboration',
      content: 'See who else is viewing or editing regions. Lock regions to prevent conflicts during editing.',
      category: 'features'
    },
    {
      id: 'templates',
      title: 'Using Templates',
      content: 'Start with a pre-configured template or save your current layout as a template for reuse.',
      category: 'getting-started'
    }
  ];

  useEffect(() => {
    if (topic) {
      const found = helpTopics.find(t => t.id === topic);
      if (found) {
        setCurrentTopic(found);
        setIsOpen(true);
      }
    }
  }, [topic]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  if (!isOpen || !currentTopic) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed z-[9999]"
        style={{
          left: position?.x || '50%',
          top: position?.y || '50%',
          transform: position ? 'translate(-50%, -50%)' : 'translate(-50%, -50%)'
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-sm w-80">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900">{currentTopic.title}</h3>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Close help"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 py-3">
            <p className="text-sm text-gray-700">{currentTopic.content}</p>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 flex items-center gap-2">
            <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
              <BookOpen className="w-4 h-4" />
              Learn More
            </button>
            <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
              <Video className="w-4 h-4" />
              Watch Video
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Help button that shows contextual help
 */
export const HelpButton: React.FC<{ topic?: string; className?: string }> = ({
  topic,
  className = ''
}) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowHelp(true)}
        className={`p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors ${className}`}
        aria-label="Show help"
      >
        <HelpCircle className="w-5 h-5" />
      </button>
      {showHelp && (
        <ContextualHelp
          {...(topic ? { topic } : {})}
          onClose={() => setShowHelp(false)}
        />
      )}
    </>
  );
};




