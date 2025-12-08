import React, { forwardRef, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface ScrollableAreaProps {
  children: React.ReactNode;
  className?: string;
  scrollbarStyle?: 'thin' | 'normal' | 'hidden';
  autoScroll?: boolean;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
}

export const ScrollableArea = forwardRef<HTMLDivElement, ScrollableAreaProps>(
  ({ 
    children, 
    className = '', 
    scrollbarStyle = 'thin',
    autoScroll = false,
    onScroll,
    ...props 
  }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const scrollRef = ref || internalRef;

    // Auto-scroll to expanded content when it appears
    useEffect(() => {
      if (!autoScroll) return;

      const handleExpandedContent = () => {
        const expandedContent = (scrollRef as React.RefObject<HTMLDivElement>)?.current?.querySelector('.expanded-content');
        if (expandedContent) {
          expandedContent.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest',
            inline: 'nearest'
          });
        }
      };

      // Listen for custom events
      const handleCustomerRowExpanded = (event: CustomEvent) => {
        const { isExpanded } = event.detail;
        if (isExpanded) {
          setTimeout(handleExpandedContent, 200);
        }
      };

      window.addEventListener('customerRowExpanded', handleCustomerRowExpanded as EventListener);

      return () => {
        window.removeEventListener('customerRowExpanded', handleCustomerRowExpanded as EventListener);
      };
    }, [autoScroll, scrollRef]);

    return (
      <div
        ref={scrollRef}
        className={cn(
          'scrollable-area',
          'flex-1 overflow-auto',
          'relative',
          {
            // Scrollbar styles
            'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100': scrollbarStyle === 'thin',
            'scrollbar-normal': scrollbarStyle === 'normal',
            'scrollbar-none': scrollbarStyle === 'hidden',
          },
          className
        )}
        style={{
          // Ensure proper height constraints for scrolling
          height: '100%',
          maxHeight: '100%',
          minHeight: '400px', // Minimum height to ensure scrollbars appear
          // Inline scrollbar styles for Firefox
          scrollbarWidth: scrollbarStyle === 'thin' ? 'thin' : 'auto',
          scrollbarColor: scrollbarStyle === 'thin' ? '#d1d5db #f3f4f6' : undefined,
        }}
        onScroll={onScroll}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScrollableArea.displayName = 'ScrollableArea';
