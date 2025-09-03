// ============================================================================
// ADVANCED SEARCH BAR
// ============================================================================
// Advanced search component with fuzzy matching, suggestions, and auto-correction

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
  ArrowRight
} from 'lucide-react';
import { Card, Button } from '@/components/ui/EnhancedUI';
import type { SearchFilters } from '@/types/enhanced-types';

interface AdvancedSearchBarProps {
  onResultsChange?: (results: any[]) => void;
  onFiltersChange?: (filters: SearchFilters) => void;
  placeholder?: string;
  className?: string;
  showModeSelector?: boolean;
  showSuggestions?: boolean;
  enableAutoCorrection?: boolean;
}

export const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  onResultsChange,
  onFiltersChange,
  placeholder = "Search customers with fuzzy matching...",
  className = '',
  showModeSelector = true,
  showSuggestions = true,
  enableAutoCorrection = true
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false);
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

  // Notify parent when results change (but only after search)
  // Use a stable callback reference to prevent infinite loops
  const stableOnResultsChange = useCallback((newResults: any[]) => {
    if (onResultsChange) {
      console.log('🔄 AdvancedSearchBar calling onResultsChange with:', newResults.length, 'results');
      onResultsChange(newResults);
    }
  }, [onResultsChange]);
  
  useEffect(() => {
    if (hasSearched && !isLoading) {
      console.log('🔄 AdvancedSearchBar effect triggered:', {
        hasSearched,
        isLoading,
        resultsLength: results.length
      });
      stableOnResultsChange(results);
    }
  }, [results, hasSearched, isLoading, stableOnResultsChange]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestionsDropdown(false);
        setShowModeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      inputRef.current?.blur();
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
                className="advanced-search-input w-full pl-10 pr-10 py-2 bg-white border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white hover:bg-white transition-colors duration-200"
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
        </div>

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

      {/* Suggestions Dropdown */}
      {showSuggestionsDropdown && suggestions.length > 0 && (
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
    </div>
  );
};

export default AdvancedSearchBar;
