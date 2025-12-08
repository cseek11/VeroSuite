import { useState, useCallback } from 'react';
import {
  Brain,
  Zap,
  Target,
  TrendingUp,
  Users,
  BarChart3,
  Settings,
  Play,
  Pause,
  Download,
  Eye,
  CheckCircle,
  Grid,
  Layout,
  X
} from 'lucide-react';
import { useAdvancedAutoLayout, LayoutSuggestion } from '@/hooks/useAdvancedAutoLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Badge,
  Heading,
  Text,
} from '@/components/ui';
import { cn } from '@/lib/utils';

interface AutoLayoutManagerProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentCards: Array<{ id: string; type: string; x: number; y: number; width: number; height: number }>;
  onLayoutChange: (changes: Array<{ cardId: string; x: number; y: number; width: number; height: number }>) => void;
}

export default function AutoLayoutManager({
  isOpen,
  onClose,
  userId,
  currentCards,
  onLayoutChange
}: AutoLayoutManagerProps) {
  const [activeTab, setActiveTab] = useState<'insights' | 'suggestions' | 'optimizations' | 'analytics'>('insights');
  const [selectedSuggestion, setSelectedSuggestion] = useState<LayoutSuggestion | null>(null);

  const {
    usagePatterns: _usagePatterns,
    cardRelationships,
    layoutSuggestions,
    optimizations,
    isLearning,
    learningProgress,
    layoutInsights,
    trackUsage,
    applyOptimization,
    autoArrange,
    learnFromBehavior,
    getCardUsageStats,
    updateOptimization,
    exportUsageData
  } = useAdvancedAutoLayout({
    userId,
    currentCards,
    onLayoutChange
  });

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleApplySuggestion = useCallback((suggestion: LayoutSuggestion) => {
    applyOptimization(suggestion.id);
    setSelectedSuggestion(null);
  }, [applyOptimization]);

  const handleAutoArrange = useCallback((mode: 'smart' | 'grid' | 'compact') => {
    autoArrange(mode);
    trackUsage('system', 'interact');
  }, [autoArrange, trackUsage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-purple-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Advanced Auto-Layout</h2>
              <p className="text-sm text-gray-500">AI-powered layout optimization and usage pattern learning</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'insights', name: 'Insights', icon: Eye },
            { id: 'suggestions', name: 'Suggestions', icon: Target },
            { id: 'optimizations', name: 'Optimizations', icon: Settings },
            { id: 'analytics', name: 'Analytics', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          {activeTab === 'insights' && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => handleAutoArrange('smart')}
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  variant="primary"
                >
                  <Zap className="w-6 h-6" />
                  <span>Smart Arrange</span>
                </Button>
                <Button
                  onClick={() => handleAutoArrange('grid')}
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  variant="outline"
                >
                  <Grid className="w-6 h-6" />
                  <span>Grid Layout</span>
                </Button>
                <Button
                  onClick={() => handleAutoArrange('compact')}
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  variant="outline"
                >
                  <Layout className="w-6 h-6" />
                  <span>Compact Layout</span>
                </Button>
              </div>

              {/* Learning Status */}
              {isLearning && (
                <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="w-6 h-6 text-purple-600 animate-pulse" />
                    <Heading level={4} className="text-purple-900">
                      Learning from Usage Patterns
                    </Heading>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${learningProgress}%` }}
                    />
                  </div>
                  <Text variant="small" className="text-purple-700">
                    {learningProgress.toFixed(0)}% complete
                  </Text>
                </Card>
              )}

              {/* Usage Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Active Cards</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{layoutInsights.activeCards}</div>
                </Card>

                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Total Interactions</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">{layoutInsights.totalInteractions}</div>
                </Card>

                <Card className="p-4 bg-purple-50 border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Suggestions</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-900">{layoutInsights.suggestionCount}</div>
                </Card>

                <Card className="p-4 bg-orange-50 border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">Relationships</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-900">{layoutInsights.relationshipCount}</div>
                </Card>
              </div>

              {/* Most Used Card */}
              {layoutInsights.mostUsedCard && (
                <Card className="p-6">
                  <Heading level={4} className="text-gray-900 mb-4">
                    Most Frequently Used Card
                  </Heading>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Text variant="body" className="font-medium text-gray-900">
                        {layoutInsights.mostUsedCard.id}
                      </Text>
                      <Text variant="small" className="text-gray-600">
                        Used {layoutInsights.mostUsedCard.count} times
                      </Text>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Top Performer
                    </Badge>
                  </div>
                </Card>
              )}

              {/* Quick Learning */}
              <div className="flex gap-4">
                <Button
                  onClick={learnFromBehavior}
                  disabled={isLearning}
                  className="flex items-center gap-2"
                >
                  {isLearning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isLearning ? 'Learning...' : 'Learn from Behavior'}
                </Button>
                <Button
                  onClick={exportUsageData}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="space-y-6">
              {layoutSuggestions.length === 0 ? (
                  <Card className="p-8 text-center">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <Heading level={4} className="text-gray-900 mb-2">
                    No Suggestions Available
                  </Heading>
                  <Text variant="small" className="text-gray-600 mb-4">
                    Use the dashboard more to generate intelligent layout suggestions
                  </Text>
                  <Button onClick={learnFromBehavior} disabled={isLearning}>
                    Generate Suggestions
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {layoutSuggestions.map((suggestion) => (
                    <Card key={suggestion.id} className="p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {suggestion.type === 'prioritize_frequent' && <TrendingUp className="w-5 h-5 text-green-600" />}
                          {suggestion.type === 'group_related' && <Users className="w-5 h-5 text-blue-600" />}
                          {suggestion.type === 'optimize_spacing' && <Layout className="w-5 h-5 text-orange-600" />}
                          <Heading level={4} className="text-gray-900">
                            {suggestion.title}
                          </Heading>
                        </div>
                        <div className="flex gap-2">
                          <Badge
                            variant="default"
                            className={getImpactColor(suggestion.impact)}
                          >
                            {suggestion.impact} impact
                          </Badge>
                          <Badge
                            variant="default"
                            className={getConfidenceColor(suggestion.confidence)}
                          >
                            {Math.round(suggestion.confidence * 100)}% confidence
                          </Badge>
                        </div>
                      </div>

                      <Text variant="small" className="text-gray-600 mb-4">
                        {suggestion.description}
                      </Text>

                      <div className="space-y-2 mb-4">
                        <Text variant="small" className="font-medium text-gray-700">
                          Changes ({suggestion.changes.length}):
                        </Text>
                        {suggestion.changes.slice(0, 3).map((change, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>{change.cardId}: {change.reason}</span>
                          </div>
                        ))}
                        {suggestion.changes.length > 3 && (
                          <div className="text-sm text-gray-500">
                            +{suggestion.changes.length - 3} more changes
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApplySuggestion(suggestion)}
                          size="sm"
                          className="flex-1"
                        >
                          Apply
                        </Button>
                        <Button
                          onClick={() => setSelectedSuggestion(suggestion)}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'optimizations' && (
            <div className="space-y-6">
              <Heading level={4} className="text-gray-900">
                Layout Optimization Algorithms
              </Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {optimizations.map((optimization) => (
                  <Card key={optimization.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Heading level={4} className="text-gray-900 mb-2">
                          {optimization.name}
                        </Heading>
                        <Text variant="small" className="text-gray-600">
                          {optimization.description}
                        </Text>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={optimization.enabled}
                          onChange={(e) => updateOptimization(optimization.id, { enabled: e.target.checked })}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Text variant="small" className="text-gray-700 mb-1">
                          Weight: {Math.round(optimization.weight * 100)}%
                        </Text>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={optimization.weight}
                          onChange={(e) => updateOptimization(optimization.id, { weight: parseFloat(e.target.value) })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <div className="text-sm text-gray-500">
                        Algorithm: {optimization.algorithm}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <Heading level={4} className="text-gray-900">
                Usage Analytics
              </Heading>
              
              {/* Card Usage Stats */}
              <div className="grid grid-cols-1 gap-4">
                {currentCards.map((card) => {
                  const stats = getCardUsageStats(card.id);
                  return (
                    <Card key={card.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Text variant="body" className="font-medium text-gray-900">
                            {card.id} ({card.type})
                          </Text>
                          <Text variant="small" className="text-gray-600">
                            {stats.totalUsage} interactions
                            {stats.avgDuration && ` • ${Math.round(stats.avgDuration)}s avg`}
                          </Text>
                        </div>
                        <div className="text-right">
                          <Text variant="small" className="text-gray-600">
                            Last used: {stats.lastUsed ? stats.lastUsed.toLocaleDateString() : 'Never'}
                          </Text>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Relationships */}
              {cardRelationships.length > 0 && (
                <div>
                  <Heading level={4} className="text-gray-900 mb-4">
                    Card Relationships
                  </Heading>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cardRelationships.slice(0, 10).map((rel, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Text variant="body" className="font-medium text-gray-900">
                              {rel.cardA} ↔ {rel.cardB}
                            </Text>
                            <Text variant="small" className="text-gray-600">
                              {rel.type} relationship
                            </Text>
                          </div>
                          <div className="text-right">
                            <Text variant="small" className="text-gray-900">
                              {Math.round(rel.strength * 100)}%
                            </Text>
                            <Text variant="small" className="text-gray-600">
                              confidence
                            </Text>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Suggestion Preview Modal */}
      {selectedSuggestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Suggestion Preview</h3>
              <button
                onClick={() => setSelectedSuggestion(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
                        <Heading level={4} className="text-gray-900 mb-2">
                {selectedSuggestion.title}
              </Heading>
              <Text variant="small" className="text-gray-600 mb-4">
                {selectedSuggestion.description}
              </Text>

              <div className="space-y-3">
                {selectedSuggestion.changes.map((change, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Text variant="body" className="font-medium text-gray-900">
                        {change.cardId}
                      </Text>
                      <Text variant="small" className="text-gray-600">
                        {change.reason}
                      </Text>
                    </div>
                    <div className="text-sm text-gray-500">
                      {change.x}, {change.y}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={() => handleApplySuggestion(selectedSuggestion)}
                  className="flex-1"
                >
                  Apply Suggestion
                </Button>
                <Button
                  onClick={() => setSelectedSuggestion(null)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}










