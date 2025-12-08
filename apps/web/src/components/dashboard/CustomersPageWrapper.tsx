import { useEffect, useRef } from 'react';
import CustomersPage from '@/components/CustomersPage';
import { logger } from '@/utils/logger';

interface CustomersPageWrapperProps {
  className?: string;
}

export default function CustomersPageWrapper({ className = '' }: CustomersPageWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure search functionality works in card context
    const handleSearchFocus = (event: FocusEvent) => {
      const target = event.target as HTMLInputElement;
      if (target.tagName === 'INPUT' && target.placeholder?.toLowerCase().includes('search')) {
        // Ensure the search input is properly focused and functional
        target.style.zIndex = '1000';
        logger.debug('Search input focused in card context', {}, 'CustomersPageWrapper');
      }
    };

    const handleSearchInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.tagName === 'INPUT' && target.placeholder?.toLowerCase().includes('search')) {
        logger.debug('Search input changed', { value: target.value }, 'CustomersPageWrapper');
      }
    };

    document.addEventListener('focusin', handleSearchFocus);
    document.addEventListener('input', handleSearchInput);

    return () => {
      document.removeEventListener('focusin', handleSearchFocus);
      document.removeEventListener('input', handleSearchInput);
    };
  }, []);

  return (
    <div ref={containerRef} className={`h-full w-full flex flex-col ${className}`}>
      <CustomersPage />
    </div>
  );
}
