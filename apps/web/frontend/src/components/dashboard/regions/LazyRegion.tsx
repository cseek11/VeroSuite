import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { DashboardRegion } from '@/routes/dashboard/types/region.types';
import { RegionContainer } from './RegionContainer';

interface LazyRegionProps {
  region: DashboardRegion;
  children?: ReactNode;
  onResize?: (id: string, width: number, height: number) => void;
  onMove?: (id: string, row: number, col: number) => void;
  onToggleCollapse?: (id: string) => void;
  onToggleLock?: (id: string) => void;
  onDelete?: (id: string) => void;
  renderSkeleton?: () => ReactNode;
}

export const LazyRegion: React.FC<LazyRegionProps> = ({
  region,
  children,
  onResize,
  onMove,
  onToggleCollapse,
  onToggleLock,
  onDelete,
  renderSkeleton
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Simulate loading delay
            setTimeout(() => {
              setIsLoading(false);
            }, 200);
          }
        });
      },
      {
        root: null,
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0.1
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const defaultSkeleton = () => (
    <div className="p-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  );

  return (
    <div ref={containerRef}>
      {isVisible ? (
        isLoading ? (
          <RegionContainer
            region={region}
            {...(onResize ? { onResize } : {})}
            {...(onMove ? { onMove } : {})}
            {...(onToggleCollapse ? { onToggleCollapse } : {})}
            {...(onToggleLock ? { onToggleLock } : {})}
            {...(onDelete ? { onDelete } : {})}
          >
            {renderSkeleton ? renderSkeleton() : defaultSkeleton()}
          </RegionContainer>
        ) : (
          <RegionContainer
            region={region}
            {...(onResize ? { onResize } : {})}
            {...(onMove ? { onMove } : {})}
            {...(onToggleCollapse ? { onToggleCollapse } : {})}
            {...(onToggleLock ? { onToggleLock } : {})}
            {...(onDelete ? { onDelete } : {})}
          >
            {children}
          </RegionContainer>
        )
      ) : (
        <RegionContainer
          region={region}
          {...(onResize ? { onResize } : {})}
          {...(onMove ? { onMove } : {})}
          {...(onToggleCollapse ? { onToggleCollapse } : {})}
          {...(onToggleLock ? { onToggleLock } : {})}
          {...(onDelete ? { onDelete } : {})}
        >
          {renderSkeleton ? renderSkeleton() : defaultSkeleton()}
        </RegionContainer>
      )}
    </div>
  );
};





