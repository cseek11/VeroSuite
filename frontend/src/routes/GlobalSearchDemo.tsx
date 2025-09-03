// ============================================================================
// GLOBAL SEARCH DEMO PAGE
// ============================================================================
// Test page for the new global search functionality with natural language processing

import React, { useState, useCallback } from 'react';
import { Card, Button } from '@/components/ui/EnhancedUI';
import { 
  Search, 
  Brain, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  UserPlus, 
  Calendar,
  Edit3,
  FileText,
  Users,
  Settings
} from 'lucide-react';
import { advancedSearchService } from '@/lib/advanced-search-service';
import type { GlobalSearchResult, IntentResult } from '@/lib/advanced-search-service';
import type { ActionResult } from '@/lib/action-handlers';

export default function GlobalSearchDemo() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExamples, setShowExamples] = useState(false);

  // Example queries for testing
  const exampleQueries = [
    // Search examples
    "Find John Smith",
    "Lookup customer at 123 Maple Ave",
    "Show all termite jobs in August",
    
    // Create customer examples
    "Create a new account for John Doe at 123 Maple Ave",
    "New customer Lisa Nguyen, phone 555-1234",
    "Add customer Mike Johnson, email mike@email.com",
    
    // Schedule appointment examples
    "Schedule bed bug treatment for Lisa Nguyen at 7pm tomorrow",
    "Book roach treatment for John Smith",
    "Schedule termite inspection for 456 Oak St",
    
    // Update appointment examples
    "Reschedule today's appointment for Jake to Friday at 10am",
    "Change the appointment for Mike to 2pm tomorrow",
    "Move Lisa's appointment to next Monday",
    
    // Add note examples
    "Add note: Customer has pets, use only organic products",
    "Note for Emily: Prefers morning appointments",
    "Add note for John: Allergic to certain chemicals"
  ];

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResults(null);
    
    try {
      console.log('🔍 Executing global search for:', query);
      const result = await advancedSearchService.globalSearch(query);
      setResults(result);
      console.log('✅ Global search result:', result);
    } catch (err) {
      console.error('❌ Global search error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const handleExecuteAction = useCallback(async (intentResult: IntentResult) => {
    try {
      console.log('🚀 Executing confirmed action:', intentResult);
      const actionResult = await advancedSearchService.executeConfirmedAction(intentResult);
      
      // Update results with the executed action
      setResults(prev => prev ? {
        ...prev,
        actionResult,
        requiresConfirmation: false
      } : null);
      
      console.log('✅ Action executed:', actionResult);
    } catch (err) {
      console.error('❌ Action execution error:', err);
      setError(err instanceof Error ? err.message : 'Failed to execute action');
    }
  }, []);

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setShowExamples(false);
  };

  const getIntentIcon = (intent: string) => {
    switch (intent) {
      case 'createCustomer': return <UserPlus className="h-5 w-5 text-green-600" />;
      case 'scheduleAppointment': return <Calendar className="h-5 w-5 text-blue-600" />;
      case 'updateAppointment': return <Edit3 className="h-5 w-5 text-orange-600" />;
      case 'addNote': return <FileText className="h-5 w-5 text-purple-600" />;
      case 'search': return <Search className="h-5 w-5 text-gray-600" />;
      default: return <Brain className="h-5 w-5 text-indigo-600" />;
    }
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'createCustomer': return 'bg-green-50 border-green-200 text-green-800';
      case 'scheduleAppointment': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'updateAppointment': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'addNote': return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'search': return 'bg-gray-50 border-gray-200 text-gray-800';
      default: return 'bg-indigo-50 border-indigo-200 text-indigo-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Brain className="h-8 w-8 text-indigo-600" />
              Global Search Demo
            </h1>
            <p className="text-slate-600 mt-2">
              Test natural language search and commands with AI-powered intent classification
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowExamples(!showExamples)}
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-white hover:shadow-lg"
            >
              <Zap className="h-4 w-4 mr-2" />
              {showExamples ? 'Hide' : 'Show'} Examples
            </Button>
          </div>
        </div>
      </div>

      {/* Search Interface */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-6 mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Try natural language: 'Create customer John Doe at 123 Main St' or 'Find Lisa Nguyen'..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading || !query.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Clock className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Examples Dropdown */}
          {showExamples && (
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-600" />
                Try These Examples
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {exampleQueries.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="text-left p-2 rounded text-sm text-slate-600 hover:bg-white hover:text-slate-800 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Error:</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Results Display */}
      {results && (
        <div className="space-y-6">
          {/* Intent Classification */}
          {results.intent && (
            <Card className="bg-white/80 backdrop-blur-xl border border-white/20">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    {getIntentIcon(results.intent.intent)}
                    Intent Classification
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getIntentColor(results.intent.intent)}`}>
                    {results.intent.intent}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-slate-700 mb-2">Query Analysis</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Original:</span> {results.intent.originalQuery}</div>
                      <div><span className="font-medium">Processed:</span> {results.intent.processedQuery}</div>
                      <div><span className="font-medium">Confidence:</span> {(results.intent.confidence * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-slate-700 mb-2">Extracted Entities</h3>
                    <div className="space-y-1 text-sm">
                      {Object.entries(results.intent.entities).map(([key, value]) => (
                        value && (
                          <div key={key}>
                            <span className="font-medium capitalize">{key}:</span> {value}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Search Results */}
          {results.type === 'search' && results.searchResults && (
            <Card className="bg-white/80 backdrop-blur-xl border border-white/20">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Search className="h-6 w-6 text-indigo-600" />
                  Search Results ({results.searchResults.length})
                </h2>
                
                {results.searchResults.length > 0 ? (
                  <div className="space-y-3">
                    {results.searchResults.slice(0, 5).map((customer, index) => (
                      <div key={customer.id || index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <div className="font-medium text-slate-800">{customer.name}</div>
                          <div className="text-sm text-slate-600">{customer.email}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-600">{customer.phone}</div>
                          <div className="text-xs text-slate-500">Score: {(customer.relevance_score * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Search className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>No search results found</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Action Results */}
          {results.type === 'action' && (
            <Card className="bg-white/80 backdrop-blur-xl border border-white/20">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Zap className="h-6 w-6 text-green-600" />
                  Action Execution
                </h2>
                
                {results.requiresConfirmation && results.confirmationData ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Action Requires Confirmation</span>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="font-medium text-yellow-800 mb-2">{results.confirmationData.action}</h3>
                      <p className="text-yellow-700">{results.confirmationData.summary}</p>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleExecuteAction(results.intent!)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm & Execute
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setResults(null)}
                        className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : results.actionResult ? (
                  <div className={`border rounded-lg p-4 ${results.actionResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {results.actionResult.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className={`font-medium ${results.actionResult.success ? 'text-green-800' : 'text-red-800'}`}>
                        {results.actionResult.message}
                      </span>
                    </div>
                    
                    {results.actionResult.data && (
                      <div className="mt-3 p-3 bg-white rounded border">
                        <pre className="text-sm text-slate-700 whitespace-pre-wrap">
                          {JSON.stringify(results.actionResult.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Zap className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>Action ready to execute</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Help Section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Settings className="h-6 w-6 text-slate-600" />
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="font-medium text-slate-800 mb-2">1. Intent Classification</h3>
            <p className="text-sm text-slate-600">
              The system analyzes your natural language query and determines what you want to do
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-slate-800 mb-2">2. Action Execution</h3>
            <p className="text-sm text-slate-600">
              For commands, the system executes the action. For searches, it performs the search
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-slate-800 mb-2">3. Smart Fallback</h3>
            <p className="text-sm text-slate-600">
              If intent classification fails, it automatically falls back to regular search
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
