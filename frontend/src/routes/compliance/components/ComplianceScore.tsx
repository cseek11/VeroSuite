/**
 * Compliance Score Component
 * Displays compliance score with visualization
 * 
 * Last Updated: 2025-11-24
 */

import { useMemo } from 'react';
import { usePRComplianceScore } from '../hooks/useComplianceData';
import Card from '@/components/ui/Card';
import { Heading, Text, Badge } from '@/components/ui';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
} from 'lucide-react';
import type { ComplianceScore } from '@/types/compliance.types';

interface ComplianceScoreProps {
  prNumber?: number;
  className?: string;
}

export default function ComplianceScore({ prNumber, className = '' }: ComplianceScoreProps) {
  const { data: score, isLoading, error } = usePRComplianceScore(prNumber || 0);

  // Calculate score color and status
  const scoreStatus = useMemo(() => {
    if (!score) return { color: 'gray', label: 'N/A', icon: Minus };
    if (score.score >= 90) return { color: 'green', label: 'Excellent', icon: CheckCircle2 };
    if (score.score >= 75) return { color: 'blue', label: 'Good', icon: Shield };
    if (score.score >= 50) return { color: 'yellow', label: 'Fair', icon: AlertTriangle };
    return { color: 'red', label: 'Poor', icon: XCircle };
  }, [score]);

  // Calculate score percentage for progress bar
  const scorePercentage = score ? Math.max(0, Math.min(100, score.score)) : 0;

  if (error) {
    return (
      <Card className={className}>
        <div className="p-6 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <Heading level={3} className="text-red-900 mb-2">
            Failed to Load Compliance Score
          </Heading>
          <Text variant="body" className="text-red-700">
            {(error as Error)?.message || 'An error occurred while loading compliance score'}
          </Text>
        </div>
      </Card>
    );
  }

  if (!prNumber) {
    return (
      <Card className={className}>
        <div className="p-6 text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <Heading level={3} className="text-gray-900 mb-2">
            No PR Selected
          </Heading>
          <Text variant="body" className="text-gray-600">
            Select a PR number to view its compliance score
          </Text>
        </div>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card className={className}>
        {isLoading ? (
          <div className="p-12">
            <LoadingSpinner text="Loading compliance score..." />
          </div>
        ) : score ? (
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <Heading level={2} className="text-2xl font-bold text-gray-900 mb-1">
                  Compliance Score
                </Heading>
                <Text variant="body" className="text-gray-600">
                  PR #{score.pr_number}
                </Text>
              </div>
              <Badge
                variant={
                  scoreStatus.color === 'green'
                    ? 'default'
                    : scoreStatus.color === 'red'
                    ? 'destructive'
                    : 'secondary'
                }
                className="text-lg px-4 py-2"
              >
                <scoreStatus.icon className="h-4 w-4 mr-2 inline" />
                {score.score}/100
              </Badge>
            </div>

            {/* Score Visualization */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <Text variant="body" className="text-sm font-medium text-gray-700">
                  Overall Score
                </Text>
                <Text
                  variant="body"
                  className={`text-sm font-bold ${
                    scoreStatus.color === 'green'
                      ? 'text-green-600'
                      : scoreStatus.color === 'red'
                      ? 'text-red-600'
                      : scoreStatus.color === 'yellow'
                      ? 'text-yellow-600'
                      : 'text-gray-600'
                  }`}
                >
                  {scoreStatus.label}
                </Text>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${
                    scoreStatus.color === 'green'
                      ? 'bg-green-500'
                      : scoreStatus.color === 'red'
                      ? 'bg-red-500'
                      : scoreStatus.color === 'yellow'
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${scorePercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>0</span>
                <span>50</span>
                <span>75</span>
                <span>90</span>
                <span>100</span>
              </div>
            </div>

            {/* Violation Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <Text variant="body" className="text-sm font-medium text-red-900">
                    BLOCK Violations
                  </Text>
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <Heading level={2} className="text-3xl font-bold text-red-600">
                  {score.block_count}
                </Heading>
                <Text variant="body" className="text-xs text-red-700 mt-1">
                  {score.block_count > 0
                    ? 'Merge blocked'
                    : 'No blocking violations'}
                </Text>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <Text variant="body" className="text-sm font-medium text-yellow-900">
                    OVERRIDE Violations
                  </Text>
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </div>
                <Heading level={2} className="text-3xl font-bold text-yellow-600">
                  {score.override_count}
                </Heading>
                <Text variant="body" className="text-xs text-yellow-700 mt-1">
                  {score.override_count > 0
                    ? 'Override required'
                    : 'No override violations'}
                </Text>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <Text variant="body" className="text-sm font-medium text-orange-900">
                    WARNING Violations
                  </Text>
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                </div>
                <Heading level={2} className="text-3xl font-bold text-orange-600">
                  {score.warning_count}
                </Heading>
                <Text variant="body" className="text-xs text-orange-700 mt-1">
                  {score.warning_count > 0
                    ? 'Warnings logged'
                    : 'No warnings'}
                </Text>
              </div>
            </div>

            {/* Score Details */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text variant="body" className="text-sm text-gray-600 mb-1">
                    Weighted Violations
                  </Text>
                  <Text variant="body" className="text-lg font-semibold text-gray-900">
                    {score.weighted_violations}
                  </Text>
                </div>
                <div>
                  <Text variant="body" className="text-sm text-gray-600 mb-1">
                    Can Merge
                  </Text>
                  <div className="flex items-center gap-2">
                    {score.can_merge ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <Text variant="body" className="text-lg font-semibold text-green-600">
                          Yes
                        </Text>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-500" />
                        <Text variant="body" className="text-lg font-semibold text-red-600">
                          No
                        </Text>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Score Calculation Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <Text variant="body" className="text-xs text-gray-600">
                <strong>Score Calculation:</strong> BLOCK violations (-10 each), OVERRIDE violations
                (-3 each), WARNING violations (-1 each). Maximum score: 100. Merge is blocked if any
                BLOCK violations exist.
              </Text>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <Heading level={3} className="text-gray-900 mb-2">
              No Score Available
            </Heading>
            <Text variant="body" className="text-gray-600">
              No compliance data found for PR #{prNumber}
            </Text>
          </div>
        )}
      </Card>
    </ErrorBoundary>
  );
}



