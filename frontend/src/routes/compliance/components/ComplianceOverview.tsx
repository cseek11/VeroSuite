/**
 * Compliance Overview Component
 * Displays all 25 rules with compliance status
 * 
 * Last Updated: 2025-12-06
 */

import { useMemo, useState } from 'react';
import { useRules, useComplianceChecks } from '../hooks/useComplianceData';
import Card from '@/components/ui/Card';
import { Heading, Text, Badge } from '@/components/ui';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  FileCode,
  AlertCircle,
  Filter,
  Search,
} from 'lucide-react';
import type { RuleTier, ComplianceStatus } from '@/types/compliance.types';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface ComplianceOverviewProps {
  className?: string;
}

export default function ComplianceOverview({ className = '' }: ComplianceOverviewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<RuleTier | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Fetch rules and compliance checks
  const { data: rules = [], isLoading: rulesLoading, error: rulesError } = useRules();
  const { data: checks = [], isLoading: checksLoading } = useComplianceChecks();

  // Create a map of rule_id -> latest check status
  const ruleStatusMap = useMemo(() => {
    const map = new Map<string, ComplianceStatus>();
    checks.forEach((check) => {
      const existing = map.get(check.rule_id);
      // Keep the most recent check (or VIOLATION if any exists)
      if (!existing || check.status === 'VIOLATION' || check.created_at > (existing as any)) {
        map.set(check.rule_id, check.status);
      }
    });
    return map;
  }, [checks]);

  // Filter rules
  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (
          !rule.name.toLowerCase().includes(searchLower) &&
          !rule.id.toLowerCase().includes(searchLower) &&
          !rule.description?.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Tier filter
      if (tierFilter !== 'all' && rule.tier !== tierFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && rule.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [rules, searchTerm, tierFilter, categoryFilter]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    rules.forEach((rule) => {
      if (rule.category) cats.add(rule.category);
    });
    return Array.from(cats).sort();
  }, [rules]);

  // Count violations by tier
  const violationCounts = useMemo(() => {
    const counts = { BLOCK: 0, OVERRIDE: 0, WARNING: 0 };
    checks
      .filter((check) => check.status === 'VIOLATION')
      .forEach((check) => {
        if (check.severity === 'BLOCK') counts.BLOCK++;
        else if (check.severity === 'OVERRIDE') counts.OVERRIDE++;
        else if (check.severity === 'WARNING') counts.WARNING++;
      });
    return counts;
  }, [checks]);

  const isLoading = rulesLoading || checksLoading;
  const hasError = rulesError;

  if (hasError) {
    return (
      <Card className={className}>
        <div className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <Heading level={3} className="text-red-900 mb-2">
            Failed to Load Compliance Data
          </Heading>
          <Text variant="body" className="text-red-700">
            {(rulesError as Error)?.message || 'An error occurred while loading compliance data'}
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
            Compliance Overview
          </Heading>
          <Text variant="body" className="text-gray-600">
            Monitor compliance status for all 25 rules (R01-R25)
          </Text>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="body" className="text-gray-600 text-sm">
                  Total Rules
                </Text>
                <Heading level={2} className="text-2xl font-bold text-gray-900">
                  {rules.length}
                </Heading>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="body" className="text-gray-600 text-sm">
                  BLOCK Violations
                </Text>
                <Heading level={2} className="text-2xl font-bold text-red-600">
                  {violationCounts.BLOCK}
                </Heading>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="body" className="text-gray-600 text-sm">
                  OVERRIDE Violations
                </Text>
                <Heading level={2} className="text-2xl font-bold text-yellow-600">
                  {violationCounts.OVERRIDE}
                </Heading>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="body" className="text-gray-600 text-sm">
                  WARNING Violations
                </Text>
                <Heading level={2} className="text-2xl font-bold text-orange-600">
                  {violationCounts.WARNING}
                </Heading>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="inline h-4 w-4 mr-1" />
                Search
              </label>
              <Input
                type="text"
                placeholder="Search rules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                Tier
              </label>
              <Select
                value={tierFilter}
                onValueChange={(value) => setTierFilter(value as RuleTier | 'all')}
              >
                <option value="all">All Tiers</option>
                <option value="BLOCK">BLOCK</option>
                <option value="OVERRIDE">OVERRIDE</option>
                <option value="WARNING">WARNING</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                Category
              </label>
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </Card>

        {/* Rules Grid */}
        {isLoading ? (
          <Card className="p-12">
            <LoadingSpinner text="Loading compliance rules..." />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRules.map((rule) => {
              const status = ruleStatusMap.get(rule.id) || 'PASS';
              const isViolation = status === 'VIOLATION';
              const isOverride = status === 'OVERRIDE';

              return (
                <Card key={rule.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Heading level={3} className="text-lg font-semibold text-gray-900">
                          {rule.id}
                        </Heading>
                        <Badge
                          variant={
                            rule.tier === 'BLOCK'
                              ? 'destructive'
                              : rule.tier === 'OVERRIDE'
                              ? 'warning'
                              : 'secondary'
                          }
                        >
                          {rule.tier}
                        </Badge>
                      </div>
                      <Text variant="body" className="text-sm font-medium text-gray-700 mb-1">
                        {rule.name}
                      </Text>
                      {rule.category && (
                        <Text variant="body" className="text-xs text-gray-500">
                          {rule.category}
                        </Text>
                      )}
                    </div>
                    <div className="ml-2">
                      {isViolation ? (
                        <XCircle className="h-6 w-6 text-red-500" />
                      ) : isOverride ? (
                        <AlertTriangle className="h-6 w-6 text-yellow-500" />
                      ) : (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      )}
                    </div>
                  </div>

                  {rule.description && (
                    <Text variant="body" className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {rule.description}
                    </Text>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t">
                    <span>
                      Status: <strong>{status}</strong>
                    </span>
                    {rule.opa_policy && (
                      <span className="flex items-center gap-1">
                        <FileCode className="h-3 w-3" />
                        OPA
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {!isLoading && filteredRules.length === 0 && (
          <Card className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <Heading level={3} className="text-gray-900 mb-2">
              No Rules Found
            </Heading>
            <Text variant="body" className="text-gray-600">
              Try adjusting your filters to see more results
            </Text>
          </Card>
        )}
      </div>
    </ErrorBoundary>
  );
}



