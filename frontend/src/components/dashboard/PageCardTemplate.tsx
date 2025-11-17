import React from 'react';
import PageCardManager from '@/components/dashboard/PageCardManager';

interface PageCardTemplateProps {
  cardId?: string;
  cardType: string;
  onClose?: () => void;
  className?: string;
  children: React.ReactNode;
}

/**
 * Template component for creating page cards with minimize/expand functionality
 * 
 * Usage:
 * ```tsx
 * import PageCardTemplate from '@/components/dashboard/PageCardTemplate';
 * import MyPageComponent from '@/components/MyPageComponent';
 * 
 * function MyPageCard({ cardId, onClose, className }) {
 *   return (
 *     <PageCardTemplate
 *       cardId={cardId}
 *       cardType="my-page"
 *       onClose={onClose}
 *       className={className}
 *     >
 *       <div className="h-full overflow-auto">
 *         <Suspense fallback={<LoadingSpinner />}>
 *           <MyPageComponent />
 *         </Suspense>
 *       </div>
 *     </PageCardTemplate>
 *   );
 * }
 * ```
 * 
 * Supported card types:
 * - customers-page (blue, Users icon)
 * - reports-page (green, FileText icon)
 * - analytics-page (purple, BarChart3 icon)
 * - calendar-page (orange, Calendar icon)
 * - settings-page (gray, Settings icon)
 */
export default function PageCardTemplate({ 
  cardId, 
  cardType, 
  onClose, 
  className = '',
  children 
}: PageCardTemplateProps) {
  return (
    <PageCardManager
      cardId={cardId || ''}
      cardType={cardType}
      onClose={onClose}
      className={className}
    >
      {children}
    </PageCardManager>
  );
}











