import React from 'react';

interface PageCardManagerProps {
  cardId: string;
  cardType: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

/**
 * Simplified PageCardManager - Just a wrapper for page content
 * All minimize/maximize/restore logic handled by global VeroCardsV3 system
 * This ensures consistent behavior across ALL card types
 */
export default function PageCardManager({ 
  cardId, 
  cardType, 
  children, 
  className = '',
  onClose
}: PageCardManagerProps) {
  
  // Just render the content - no special minimize logic
  // The global system (VeroCardsV3 + renderHelpers) handles everything
  return (
    <div className={`h-full w-full flex flex-col ${className}`}>
      {children}
    </div>
  );
}

