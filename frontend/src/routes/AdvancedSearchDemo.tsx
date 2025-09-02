// ============================================================================
// ADVANCED SEARCH DEMO PAGE
// ============================================================================
// Demo page to showcase advanced search features

import React, { useState, useCallback } from 'react';
import { AdvancedSearchBar } from '@/components/search/AdvancedSearchBar';
import { Card, Button } from '@/components/ui/EnhancedUI';
import { 
  Search, 
  Zap, 
  Target, 
  Brain, 
  Sparkles,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

export default function AdvancedSearchDemo() {
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const searchModes = [
    { id: 'standard', label: 'Standard', icon: Target, description: 'Exact text matching' },
    { id: 'fuzzy', label: 'Fuzzy', icon: Zap, description: 'Typo-tolerant matching' },
    { id: 'hybrid', label: 'Hybrid', icon: Sparkles, description: 'Best of both worlds' },
    { id: 'vector', label: 'Vector', icon: Brain, description: 'AI-powered semantic search' }
  ];

  // Memoize the callback to prevent infinite loops
  const handleResultsChange = useCallback((newResults: any[]) => {
    console.log('🎯 AdvancedSearchDemo handleResultsChange called with:', newResults?.length || 0, 'results');
    
    if (newResults && newResults.length > 0) {
      console.log('🎯 First result sample:', newResults[0]);
    }
    
    setResults(newResults || []);
    setHasSearched(true);
  }, []);

  // Calculate simple stats from results
  const stats = results.length > 0 ? {
    totalResults: results.length,
    exactMatches: results.filter(r => r.match_type === 'exact').length,
    fuzzyMatches: results.filter(r => r.match_type === 'fuzzy').length,
    partialMatches: results.filter(r => r.match_type === 'partial').length,
    vectorMatches: results.filter(r => r.match_type === 'vector').length,
    averageRelevance: results.reduce((sum, r) => sum + (r.relevance_score || 0), 0) / results.length,
    hasCorrection: false,
    suggestionsCount: 0
  } : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Advanced Search Features Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience fuzzy matching, typo tolerance, auto-correction, and intelligent suggestions
            powered by PostgreSQL's advanced search capabilities.
          </p>
        </div>

        {/* Search Modes Info */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {searchModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <div
                  key={mode.id}
                  className="p-4 rounded-lg border-2 border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-6 h-6 text-gray-400" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        {mode.label}
                      </div>
                      <div className="text-sm text-gray-500">{mode.description}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Advanced Search Bar */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Try Advanced Search</h2>
          <AdvancedSearchBar
            onResultsChange={handleResultsChange}
            placeholder="Try searching with typos like 'smtih' or 'jhon'..."
            showModeSelector={true}
            showSuggestions={true}
            enableAutoCorrection={true}
          />
        </Card>

        {/* Search Results Section */}
        {hasSearched && (
          <div className="space-y-6">
            {/* Search Stats */}
            {stats && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalResults}</div>
                    <div className="text-sm text-gray-600">Total Results</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.exactMatches}</div>
                    <div className="text-sm text-gray-600">Exact Matches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.fuzzyMatches}</div>
                    <div className="text-sm text-gray-600">Fuzzy Matches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {stats.averageRelevance ? (stats.averageRelevance * 100).toFixed(0) : '0'}%
                    </div>
                    <div className="text-sm text-gray-600">Avg Relevance</div>
                  </div>
                </div>
              </Card>
            )}

            {/* Search Results */}
            {results.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Search Results ({results.length})
                </h3>
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div
                      key={result.id || index}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{result.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              result.match_type === 'exact' ? 'bg-green-100 text-green-700' :
                              result.match_type === 'fuzzy' ? 'bg-blue-100 text-blue-700' :
                              result.match_type === 'vector' ? 'bg-purple-100 text-purple-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {result.match_type}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>📧 {result.email}</div>
                            <div>📞 {result.phone}</div>
                            <div>📍 {result.address}, {result.city}, {result.state}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-purple-600">
                            {result.relevance_score ? (result.relevance_score * 100).toFixed(0) : '0'}% match
                          </div>
                          {result.match_details && result.match_details.field && (
                            <div className="text-xs text-gray-500 mt-1">
                              {result.match_details.field}: {result.match_details.match_count || 0} matches
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* No Results */}
            {results.length === 0 && hasSearched && (
              <Card className="p-6 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or using a different search mode.
                </p>
              </Card>
            )}
          </div>
        )}

        {/* Features Overview */}
        <Card className="p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Advanced Search Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <Zap className="w-6 h-6 text-blue-500 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Fuzzy Matching</h3>
                <p className="text-sm text-gray-600">
                  Find results even with typos and misspellings using PostgreSQL's trigram similarity.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-6 h-6 text-yellow-500 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Auto-correction</h3>
                <p className="text-sm text-gray-600">
                  Automatically suggests corrections for common typos and misspellings.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Smart Suggestions</h3>
                <p className="text-sm text-gray-600">
                  Get intelligent search suggestions based on your query and search history.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Target className="w-6 h-6 text-purple-500 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Multiple Search Modes</h3>
                <p className="text-sm text-gray-600">
                  Choose between standard, fuzzy, hybrid, or vector search modes.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Brain className="w-6 h-6 text-indigo-500 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Vector Search</h3>
                <p className="text-sm text-gray-600">
                  AI-powered semantic search for finding conceptually similar results.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Sparkles className="w-6 h-6 text-pink-500 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Relevance Ranking</h3>
                <p className="text-sm text-gray-600">
                  Advanced relevance scoring to show the most relevant results first.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
