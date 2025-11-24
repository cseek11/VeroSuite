/**
 * Violation List Component
 * Displays list of compliance violations with filtering and search
 * 
 * Last Updated: 2025-11-24
 */

import { useMemo, useState } from 'react';
import { useComplianceChecks } from '../hooks/useComplianceData';
import Card from '@/components/ui/Card';
import { Heading, Text, Badge } from '@/components/ui';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import {
  AlertCircle,
  XCircle,
  AlertTriangle,
  FileCode,
  GitBranch,
  Calendar,
  User,
  Search,
  Filter,
  X,
  CheckCircle2,
} from 'lucide-react';
import type { ComplianceCheck, ComplianceStatus, ComplianceSeverity } from '@/types/compliance.types';

interface ViolationListProps {
  className?: string;
}

export default function ViolationList({ className = '' }: ViolationListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<ComplianceSeverity | 'all'>('all');
  const [ruleIdFilter, setRuleIdFilter] = useState<string>('all');
  const [prNumberFilter, setPrNumberFilter] = useState<string>('');

  // Fetch compliance checks
  const { data: checks = [], isLoading, error } = useComplianceChecks();

  // Filter violations
  const filteredChecks = useMemo(() => {
    return checks.filter((check) => {
      // Only show violations by default (unless status filter is set)
      if (statusFilter === 'all' && check.status !== 'VIOLATION') {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && check.status !== statusFilter) {
        return false;
      }

      // Severity filter
      if (severityFilter !== 'all' && check.severity !== severityFilter) {
        return false;
      }

      // Rule ID filter
      if (ruleIdFilter !== 'all' && check.rule_id !== ruleIdFilter) {
        return false;
      }

      // PR number filter
      if (prNumberFilter && check.pr_number.toString() !== prNumberFilter) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (
          !check.rule_id.toLowerCase().includes(searchLower) &&
          !check.file_path?.toLowerCase().includes(searchLower) &&
          !check.violation_message?.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [checks, searchTerm, statusFilter, severityFilter, ruleIdFilter, prNumberFilter]);

  // Get unique rule IDs and PR numbers for filters
  const uniqueRuleIds = useMemo(() => {
    const ids = new Set<string>();
    checks.forEach((check) => ids.add(check.rule_id));
    return Array.from(ids).sort();
  }, [checks]);

  // Count violations
  const violationCounts = useMemo(() => {
    const counts = { total: 0, block: 0, override: 0, warning: 0 };
    filteredChecks.forEach((check) => {
      counts.total++;
      if (check.severity === 'BLOCK') counts.block++;
      else if (check.severity === 'OVERRIDE') counts.override++;
      else if (check.severity === 'WARNING') counts.warning++;
    });
    return counts;
  }, [filteredChecks]);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSeverityFilter('all');
    setRuleIdFilter('all');
    setPrNumberFilter('');
  };

  const hasActiveFilters =
    searchTerm || statusFilter !== 'all' || severityFilter !== 'all' || ruleIdFilter !== 'all' || prNumberFilter;

  if (error) {
    return (
      <Card className={className}>
        <div className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <Heading level={3} className="text-red-900 mb-2">
            Failed to Load Violations
          </Heading>
          <Text variant="body" className="text-red-700">
            {(error as Error)?.message || 'An error occurred while loading violations'}
          </Text>
        </div>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <div className={className}>
        {/* Header */}
        <div className="mb-6">
          <Heading level={1} className="font-bold text-gray-900 mb-2">
            Compliance Violations
          </Heading>
          <Text variant="body" className="text-gray-600">
            View and manage compliance violations across all rules
          </Text>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <Text variant="body" className="text-gray-600 text-sm mb-1">
              Total Violations
            </Text>
            <Heading level={2} className="text-2xl font-bold text-gray-900">
              {violationCounts.total}
            </Heading>
          </Card>
          <Card className="p-4">
            <Text variant="body" className="text-gray-600 text-sm mb-1">
              BLOCK
            </Text>
            <Heading level={2} className="text-2xl font-bold text-red-600">
              {violationCounts.block}
            </Heading>
          </Card>
          <Card className="p-4">
            <Text variant="body" className="text-gray-600 text-sm mb-1">
              OVERRIDE
            </Text>
            <Heading level={2} className="text-2xl font-bold text-yellow-600">
              {violationCounts.override}
            </Heading>
          </Card>
          <Card className="p-4">
            <Text variant="body" className="text-gray-600 text-sm mb-1">
              WARNING
            </Text>
            <Heading level={2} className="text-2xl font-bold text-orange-600">
              {violationCounts.warning}
            </Heading>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Heading level={3} className="text-lg font-semibold text-gray-900">
              Filters
            </Heading>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="inline h-4 w-4 mr-1" />
                Search
              </label>
              <Input
                type="text"
                placeholder="Search violations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                Status
              </label>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as ComplianceStatus | 'all')}
              >
                <option value="all">All Status</option>
                <option value="VIOLATION">Violation</option>
                <option value="PASS">Pass</option>
                <option value="OVERRIDE">Override</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                Severity
              </label>
              <Select
                value={severityFilter}
                onValueChange={(value) => setSeverityFilter(value as ComplianceSeverity | 'all')}
              >
                <option value="all">All Severity</option>
                <option value="BLOCK">BLOCK</option>
                <option value="OVERRIDE">OVERRIDE</option>
                <option value="WARNING">WARNING</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                Rule ID
              </label>
              <Select value={ruleIdFilter} onValueChange={(value) => setRuleIdFilter(value)}>
                <option value="all">All Rules</option>
                {uniqueRuleIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <GitBranch className="inline h-4 w-4 mr-1" />
                PR Number
              </label>
              <Input
                type="number"
                placeholder="PR #"
                value={prNumberFilter}
                onChange={(e) => setPrNumberFilter(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* Violations List */}
        {isLoading ? (
          <Card className="p-12">
            <LoadingSpinner text="Loading violations..." />
          </Card>
        ) : filteredChecks.length === 0 ? (
          <Card className="p-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <Heading level={3} className="text-gray-900 mb-2">
              No Violations Found
            </Heading>
            <Text variant="body" className="text-gray-600">
              {hasActiveFilters
                ? 'Try adjusting your filters to see more results'
                : 'All compliance checks are passing!'}
            </Text>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredChecks.map((check) => (
              <Card key={check.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={
                          check.severity === 'BLOCK'
                            ? 'destructive'
                            : check.severity === 'OVERRIDE'
                            ? 'warning'
                            : 'secondary'
                        }
                      >
                        {check.severity}
                      </Badge>
                      <Badge variant={check.status === 'VIOLATION' ? 'destructive' : 'secondary'}>
                        {check.status}
                      </Badge>
                      <Text variant="body" className="text-sm font-semibold text-gray-900">
                        {check.rule_id}
                      </Text>
                    </div>
                    {check.violation_message && (
                      <Text variant="body" className="text-sm text-gray-700 mb-2">
                        {check.violation_message}
                      </Text>
                    )}
                  </div>
                  <div className="ml-4">
                    {check.severity === 'BLOCK' ? (
                      <XCircle className="h-6 w-6 text-red-500" />
                    ) : check.severity === 'OVERRIDE' ? (
                      <AlertTriangle className="h-6 w-6 text-yellow-500" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-orange-500" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  {check.file_path && (
                    <div className="flex items-center gap-2">
                      <FileCode className="h-4 w-4" />
                      <span className="font-mono text-xs">{check.file_path}</span>
                      {check.line_number && <span className="text-gray-500">:{check.line_number}</span>}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    <span>PR #{check.pr_number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(check.created_at).toLocaleDateString()}</span>
                  </div>
                  {check.resolved_at && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Resolved {new Date(check.resolved_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

