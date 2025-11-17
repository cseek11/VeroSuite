import React, { createContext, useContext, useEffect, useState, useRef, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveState {
  isMobile: boolean;
  cardWidth: number;
  cardHeight: number;
  viewportWidth: number;
  percentage: number;
}

export interface ResponsiveContentProps {
  children: React.ReactNode;
  className?: string;
  breakpoint?: number; // Percentage threshold for mobile mode (default 50%)
  cardId?: string;
}

const ResponsiveContext = createContext<ResponsiveState>({
  isMobile: false,
  cardWidth: 0,
  cardHeight: 0,
  viewportWidth: 0,
  percentage: 0,
});

export const useResponsive = () => useContext(ResponsiveContext);

export const ResponsiveContent = forwardRef<HTMLDivElement, ResponsiveContentProps>(
  ({ 
    children, 
    className = '', 
    breakpoint = 50,
    cardId,
    ...props 
  }, ref) => {
    const [state, setState] = useState<ResponsiveState>({
      isMobile: false,
      cardWidth: 0,
      cardHeight: 0,
      viewportWidth: 0,
      percentage: 0,
    });
    
    const containerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<ResizeObserver | null>(null);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const updateResponsiveState = () => {
        const rect = container.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const cardWidth = rect.width;
        const percentage = (cardWidth / viewportWidth) * 100;
        const isMobile = percentage < breakpoint;

        setState({
          isMobile,
          cardWidth,
          cardHeight: rect.height,
          viewportWidth,
          percentage,
        });

        // Add/remove mobile class for CSS targeting
        if (isMobile) {
          container.classList.add('card-mobile-mode');
        } else {
          container.classList.remove('card-mobile-mode');
        }
      };

      // Initial check
      updateResponsiveState();

      // Set up ResizeObserver
      observerRef.current = new ResizeObserver(() => {
        updateResponsiveState();
      });

      observerRef.current.observe(container);

      // Listen for window resize
      const handleWindowResize = () => {
        updateResponsiveState();
      };

      window.addEventListener('resize', handleWindowResize);

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
        window.removeEventListener('resize', handleWindowResize);
      };
    }, [breakpoint]);

    return (
      <ResponsiveContext.Provider value={state}>
        <div
          ref={(node) => {
            containerRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          className={cn(
            'responsive-content',
            'h-full w-full',
            {
              'mobile-mode': state.isMobile,
              'desktop-mode': !state.isMobile,
            },
            className
          )}
          data-card-id={cardId}
          {...props}
        >
          {children}
        </div>
      </ResponsiveContext.Provider>
    );
  }
);

ResponsiveContent.displayName = 'ResponsiveContent';
