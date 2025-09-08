// ============================================================================
// GLOBAL SEARCH BAR
// ============================================================================
// Unified search interface that handles both search and natural language commands
// 
// This component extends the AdvancedSearchBar to support natural language
// commands like "create customer", "schedule appointment", etc.

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';
import { 
  Search, 
  X, 
  Zap, 
  Target, 
  Brain, 
  Sparkles,
  ChevronDown,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Command,
  UserPlus,
  Calendar,
  FileText,
  DollarSign,
  UserCheck,
  Bell,
  Settings,
  HelpCircle
} from 'lucide-react';
import { Card, Button } from '@/components/ui/EnhancedUI';
import type { SearchFilters } from '@/types/enhanced-types';
import type { IntentResult, IntentType } from '@/lib/intent-classification-service';
import type { ActionResult, ConfirmationData } from '@/lib/action-handlers';
import { intentClassificationService } from '@/lib/intent-classification-service';
import { actionExecutorService } from '@/lib/action-handlers';
import CommandHelpModal from '@/components/CommandHelpModal';

interface GlobalSearchBarProps {
  onResultsChange?: (results: any[]) => void;
  onActionExecuted?: (result: ActionResult) => void;
  onFiltersChange?: (filters: SearchFilters) => void;
  placeholder?: string;
  className?: string;
  showModeSelector?: boolean;
  showSuggestions?: boolean;
  enableAutoCorrection?: boolean;
  enableCommands?: boolean;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  onResultsChange,
  onActionExecuted,
  onFiltersChange,
  placeholder = "Search customers or use natural language commands...",
  className = '',
  showModeSelector = true,
  showSuggestions = true,
  enableAutoCorrection = true,
  enableCommands = true
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false);
  const [showCommandExamples, setShowCommandExamples] = useState(false);
  const [currentIntent, setCurrentIntent] = useState<IntentResult | null>(null);
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null);
  const [isExecutingAction, setIsExecutingAction] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    query,
    results,
    suggestions,
    correctedQuery,
    isLoading,
    error,
    searchMode,
    hasSearched,
    search,
    clearSearch,
    updateSearchMode,
    searchWithSuggestion,
    searchWithCorrection,
    getSearchStats
  } = useAdvancedSearch({
    enableAutoCorrection,
    enableSuggestions: showSuggestions,
    defaultSearchMode: 'hybrid'
  });

  // Classify intent when query changes
  useEffect(() => {
    if (query.length > 3 && enableCommands) {
      const intent = intentClassificationService.classifyIntent(query);
      setCurrentIntent(intent);
      
      // If it's a high-confidence action intent, show confirmation
      if (intent.intent !== 'search' && intent.confidence >= 0.7) {
        const confirmation = actionExecutorService.getConfirmationData(intent);
        setConfirmationData(confirmation);
      } else {
        setConfirmationData(null);
      }
    } else {
      setCurrentIntent(null);
      setConfirmationData(null);
    }
  }, [query, enableCommands]);

  // Notify parent when results change
  useEffect(() => {
    if (hasSearched && !isLoading && onResultsChange) {
      onResultsChange(results);
    }
  }, [results, hasSearched, isLoading, onResultsChange]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestionsDropdown(false);
        setShowModeDropdown(false);
        setShowCommandExamples(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle help modal events
  useEffect(() => {
    const handleShowCommandHelp = () => {
      setHelpModalOpen(true);
    };

    window.addEventListener('showCommandHelp', handleShowCommandHelp);
    return () => window.removeEventListener('showCommandHelp', handleShowCommandHelp);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    search(value);
    setShowSuggestionsDropdown(value.length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowSuggestionsDropdown(false);
      setShowModeDropdown(false);
      setShowCommandExamples(false);
      inputRef.current?.blur();
    } else if (e.key === 'Enter' && confirmationData && !isExecutingAction) {
      handleExecuteAction();
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    searchWithSuggestion(suggestion);
    setShowSuggestionsDropdown(false);
    inputRef.current?.focus();
  };

  const handleCorrectionClick = () => {
    if (correctedQuery) {
      searchWithCorrection(correctedQuery);
      setShowSuggestionsDropdown(false);
    }
  };

  const handleExecuteAction = async () => {
    if (!currentIntent || !confirmationData || isExecutingAction) return;

    setIsExecutingAction(true);
    try {
      const result = await actionExecutorService.executeAction(currentIntent);
      
      if (onActionExecuted) {
        onActionExecuted(result);
      }

      if (result.success) {
        // Clear the search and show success
        clearSearch();
        setConfirmationData(null);
        setCurrentIntent(null);
      }
    } catch (error) {
      console.error('Action execution failed:', error);
    } finally {
      setIsExecutingAction(false);
    }
  };

  const handleCancelAction = () => {
    setConfirmationData(null);
    setCurrentIntent(null);
  };

  const getSearchModeIcon = (mode: string) => {
    switch (mode) {
      case 'standard': return <Target className="w-4 h-4" />;
      case 'fuzzy': return <Zap className="w-4 h-4" />;
      case 'hybrid': return <Sparkles className="w-4 h-4" />;
      case 'vector': return <Brain className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getSearchModeLabel = (mode: string) => {
    switch (mode) {
      case 'standard': return 'Standard';
      case 'fuzzy': return 'Fuzzy';
      case 'hybrid': return 'Hybrid';
      case 'vector': return 'Vector';
      default: return 'Search';
    }
  };

  const getSearchModeDescription = (mode: string) => {
    switch (mode) {
      case 'standard': return 'Exact text matching';
      case 'fuzzy': return 'Typo-tolerant matching';
      case 'hybrid': return 'Best of both worlds';
      case 'vector': return 'AI-powered semantic search';
      default: return '';
    }
  };

  const getIntentIcon = (intent: IntentType) => {
    switch (intent) {
      case 'createCustomer': return <UserPlus className="w-4 h-4" />;
      case 'scheduleAppointment': return <Calendar className="w-4 h-4" />;
      case 'updateAppointment': return <Calendar className="w-4 h-4" />;
      case 'cancelAppointment': return <X className="w-4 h-4" />;
      case 'addNote': return <FileText className="w-4 h-4" />;
      case 'markInvoicePaid': return <DollarSign className="w-4 h-4" />;
      case 'assignTechnician': return <UserCheck className="w-4 h-4" />;
      case 'sendReminder': return <Bell className="w-4 h-4" />;
      case 'createServicePlan': return <Settings className="w-4 h-4" />;
      case 'showReports': return <Target className="w-4 h-4" />;
      case 'help': return <HelpCircle className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getIntentColor = (intent: IntentType) => {
    switch (intent) {
      case 'createCustomer': return 'text-green-600 bg-green-50 border-green-200';
      case 'scheduleAppointment': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'updateAppointment': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'cancelAppointment': return 'text-red-600 bg-red-50 border-red-200';
      case 'addNote': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'markInvoicePaid': return 'text-green-600 bg-green-50 border-green-200';
      case 'assignTechnician': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'sendReminder': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'createServicePlan': return 'text-teal-600 bg-teal-50 border-teal-200';
      case 'showReports': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'help': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCommandExamples = () => {
    const examples = intentClassificationService.getIntentExamples();
    return [
      ...examples.createCustomer.slice(0, 2),
      ...examples.scheduleAppointment.slice(0, 2),
      ...examples.addNote.slice(0, 1)
    ];
  };

  const stats = getSearchStats();

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="flex items-center space-x-2">
          {/* Search Mode Selector */}
          {showModeSelector && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowModeDropdown(!showModeDropdown)}
                className="flex items-center space-x-2 min-w-[100px]"
              >
                {getSearchModeIcon(searchMode)}
                <span className="hidden sm:inline">{getSearchModeLabel(searchMode)}</span>
                <ChevronDown className="w-3 h-3" />
              </Button>

              {/* Mode Dropdown */}
              {showModeDropdown && (
                <Card className="absolute top-full left-0 mt-1 z-50 min-w-[200px] p-2 bg-white border border-gray-200 shadow-lg backdrop-blur-sm">
                  <div className="space-y-1">
                    {['standard', 'fuzzy', 'hybrid', 'vector'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => {
                          updateSearchMode(mode as any);
                          setShowModeDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors ${
                          searchMode === mode
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'hover:bg-gray-100 hover:border-gray-200'
                        }`}
                      >
                        {getSearchModeIcon(mode)}
                        <div>
                          <div className="font-medium">{getSearchModeLabel(mode)}</div>
                          <div className="text-xs text-gray-500">{getSearchModeDescription(mode)}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  setIsFocused(true);
                  if (query.length > 0) setShowSuggestionsDropdown(true);
                }}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                className="global-search-input w-full pl-10 pr-10 py-2 bg-white text-gray-900 placeholder-gray-500 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white hover:bg-white transition-colors duration-200"
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
              </div>
            )}
          </div>

          {/* Command Examples Button */}
          {enableCommands && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCommandExamples(!showCommandExamples)}
              className="flex items-center space-x-2"
            >
              <Command className="w-4 h-4" />
              <span className="hidden sm:inline">Examples</span>
            </Button>
          )}
        </div>

        {/* Intent Detection */}
        {currentIntent && currentIntent.intent !== 'search' && (
          <div className={`mt-2 p-3 rounded-lg border ${getIntentColor(currentIntent.intent)}`}>
            <div className="flex items-center space-x-2">
              {getIntentIcon(currentIntent.intent)}
              <span className="font-medium">
                {currentIntent.intent.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <span className="text-sm opacity-75">
                ({(currentIntent.confidence * 100).toFixed(0)}% confidence)
              </span>
            </div>
            {currentIntent.entities.customerName && (
              <div className="text-sm mt-1">
                Customer: <span className="font-medium">{currentIntent.entities.customerName}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Confirmation */}
        {confirmationData && (
          <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-900">{confirmationData.action}</h4>
                <p className="text-sm text-blue-700 mt-1">{confirmationData.description}</p>
                
                {confirmationData.benefits && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-blue-800">Benefits:</p>
                    <ul className="text-xs text-blue-700 list-disc list-inside">
                      {confirmationData.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {confirmationData.risks && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-blue-800">Risks:</p>
                    <ul className="text-xs text-blue-700 list-disc list-inside">
                      {confirmationData.risks.map((risk, index) => (
                        <li key={index}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-3">
              <Button
                onClick={handleExecuteAction}
                disabled={isExecutingAction}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                {isExecutingAction ? 'Executing...' : 'Execute Action'}
              </Button>
              <Button
                onClick={handleCancelAction}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-600 hover:bg-blue-100"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Auto-correction Notice */}
        {correctedQuery && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-700">
                Did you mean "{correctedQuery}"?
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCorrectionClick}
                className="ml-auto text-blue-600 border-blue-300 hover:bg-blue-100"
              >
                Use correction
              </Button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Search Statistics */}
        {hasSearched && stats && (
          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
            <span>{stats.totalResults} results</span>
            {stats.exactMatches > 0 && <span>{stats.exactMatches} exact</span>}
            {stats.fuzzyMatches > 0 && <span>{stats.fuzzyMatches} fuzzy</span>}
            {stats.vectorMatches > 0 && <span>{stats.vectorMatches} vector</span>}
            <span>Avg relevance: {(stats.averageRelevance * 100).toFixed(0)}%</span>
          </div>
        )}
      </div>

      {/* Command Examples Dropdown */}
      {showCommandExamples && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-40 max-h-60 overflow-y-auto bg-white border border-gray-200 shadow-lg backdrop-blur-sm">
          <div className="p-3">
            <div className="text-xs font-medium text-gray-500 mb-3 flex items-center justify-between">
              <span>Natural Language Commands</span>
              <span className="text-purple-600 font-medium">Try these examples</span>
            </div>
            <div className="space-y-2">
              {getCommandExamples().map((example, index) => (
                <button
                  key={index}
                  onClick={() => {
                    search(example);
                    setShowCommandExamples(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-purple-50 hover:border-purple-200 border border-transparent transition-colors"
                >
                  <div className="font-medium text-gray-900">{example}</div>
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestionsDropdown && suggestions.length > 0 && !showCommandExamples && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-40 max-h-60 overflow-y-auto bg-white border border-gray-200 shadow-lg backdrop-blur-sm">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 mb-2 flex items-center justify-between">
              <span>Smart Suggestions</span>
              <span className="text-purple-600 font-medium">{suggestions.length} found</span>
            </div>
            <div className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-purple-50 hover:border-purple-200 border border-transparent flex items-center space-x-2 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{suggestion.text}</div>
                    <div className="text-xs text-gray-500 flex items-center space-x-2">
                      <span className="capitalize">{suggestion.type}</span>
                      <span>•</span>
                      <span className="font-medium text-purple-600">
                        {(suggestion.confidence * 100).toFixed(0)}% match
                      </span>
                    </div>
                  </div>
                  {suggestion.type === 'correction' && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  {suggestion.type === 'completion' && (
                    <ArrowRight className="w-4 h-4 text-purple-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Command Help Modal */}
      <CommandHelpModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />
    </div>
  );
};

export default GlobalSearchBar;
