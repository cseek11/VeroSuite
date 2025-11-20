import React from 'react';
import Card from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/CRMComponents';

/**
 * BillingSkeletons
 * 
 * Loading skeleton components for billing UI.
 * Provides better UX during data loading.
 * 
 * Last Updated: 2025-11-16
 */

export function InvoiceListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Statistics Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </Card>
        ))}
      </div>

      {/* Filters Skeleton */}
      <Card className="p-4">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </Card>

      {/* Invoice Cards Skeleton */}
      <Card className="p-4">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <Skeleton className="h-5 w-5" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function InvoiceDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Skeleton className="h-5 w-24 mb-3" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-5 w-32 mb-3" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </Card>

      {/* Items Table Skeleton */}
      <Card className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function PaymentMethodSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function PaymentHistorySkeleton() {
  return (
    <div className="space-y-6">
      {/* Statistics Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          </Card>
        ))}
      </div>

      {/* Payment List Skeleton */}
      <Card className="p-4">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-6 w-6 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}











