/**
 * Compliance Dashboard Route
 * Main compliance dashboard page with tabs for overview and violations
 * 
 * Last Updated: 2025-12-07
 */

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent, Heading, Text } from '@/components/ui';
import { Shield, AlertTriangle, BarChart3 } from 'lucide-react';
import ComplianceOverview from './components/ComplianceOverview';
import ViolationList from './components/ViolationList';
import ComplianceScore from './components/ComplianceScore';

type TabType = 'overview' | 'violations' | 'score';

export default function ComplianceDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedPR, setSelectedPR] = useState<number | undefined>(undefined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Heading level={1} className="font-bold text-gray-900 mb-2">
            Compliance Dashboard
          </Heading>
          <Text variant="body" className="text-gray-600">
            Monitor and manage rule compliance across all 25 rules (R01-R25)
          </Text>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">
              <Shield className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="violations">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Violations
            </TabsTrigger>
            <TabsTrigger value="score">
              <BarChart3 className="h-4 w-4 mr-2" />
              Score
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ComplianceOverview />
          </TabsContent>

          <TabsContent value="violations">
            <ViolationList />
          </TabsContent>

          <TabsContent value="score">
            <div className="space-y-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PR Number
                </label>
                <input
                  type="number"
                  placeholder="Enter PR number..."
                  value={selectedPR || ''}
                  onChange={(e) => setSelectedPR(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {selectedPR !== undefined ? (
                <ComplianceScore prNumber={selectedPR} />
              ) : (
                <ComplianceScore />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

