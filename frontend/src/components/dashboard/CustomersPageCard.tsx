import { Suspense } from 'react';
import CustomersPageWrapper from '@/components/dashboard/CustomersPageWrapper';
import PageCardManager from '@/components/dashboard/PageCardManager';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface CustomersPageCardProps {
  onClose?: () => void;
  className?: string;
  cardId?: string;
}

export default function CustomersPageCard({ 
  onClose, 
  className = '', 
  cardId 
}: CustomersPageCardProps) {
  return (
    <PageCardManager
      cardId={cardId || ''}
      cardType="customers-page"
      onClose={onClose}
      className={className}
    >
      <div className="h-full w-full flex flex-col">
        <Suspense fallback={<LoadingSpinner />}>
          <CustomersPageWrapper />
        </Suspense>
      </div>
    </PageCardManager>
  );
}
