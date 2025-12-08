import React, { forwardRef } from 'react';
import { CardContainer } from './CardContainer';
import { ScrollableArea } from './ScrollableArea';
import { ResponsiveContent } from './ResponsiveContent';
import { cn } from '@/lib/utils';

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'page' | 'kpi' | 'template';
  size?: 'small' | 'medium' | 'large' | 'auto';
  scrollbarStyle?: 'thin' | 'normal' | 'hidden';
  autoScroll?: boolean;
  responsive?: boolean;
  breakpoint?: number;
  cardId?: string;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ 
    children,
    className = '',
    variant = 'default',
    size = 'auto',
    scrollbarStyle = 'thin',
    autoScroll = false,
    responsive = true,
    breakpoint = 50,
    cardId,
    onScroll,
    ...props
  }, ref) => {
    const content = responsive ? (
      <ResponsiveContent 
        breakpoint={breakpoint}
        {...(cardId !== undefined && cardId !== null ? { cardId } : {})}
        className="h-full w-full"
      >
        <ScrollableArea
          scrollbarStyle={scrollbarStyle}
          autoScroll={autoScroll}
          {...(onScroll !== undefined && onScroll !== null ? { onScroll } : {})}
          className="h-full w-full"
        >
          {children}
        </ScrollableArea>
      </ResponsiveContent>
    ) : (
      <ScrollableArea
        scrollbarStyle={scrollbarStyle}
        autoScroll={autoScroll}
        {...(onScroll !== undefined && onScroll !== null ? { onScroll } : {})}
        className="h-full w-full"
      >
        {children}
      </ScrollableArea>
    );

    return (
      <CardContainer
        ref={ref}
        variant={variant}
        size={size}
        className={cn(className)}
        {...props}
      >
        {content}
      </CardContainer>
    );
  }
);

CardContent.displayName = 'CardContent';
