// ============================================================================
// SEARCH BAR COMPONENT - Modern Search Interface
// ============================================================================
// This component provides a modern, accessible search interface that integrates
// with the unified search service and provides real-time search capabilities

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, Filter, Loader2 } from 'lucide-react';
import { useSearchIntegration } from '@/lib/search-integration';
import type { SearchResult } from '@/lib/unified-search-service';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface SearchBarProps {
  placeholder?: string;
  onResultSelect?: (result: SearchResult) => void;
  onSearchChange?: (searchTerm: string) => void;
  showHistory?: boolean;
  showRecentSearches?: boolean;
  maxResults?: number;
  className?: string;
  autoFocus?: boolean;
  debounceMs?: number;
}

interface SearchSuggestionProps {
  result: SearchResult;
  isSelected: boolean;
  onClick: () => void;
}

// ============================================================================
// SEARCH SUGGESTION COMPONENT
// ============================================================================

const SearchSuggestion: React.FC<SearchSuggestionProps> = ({ result, isSelected, onClick }) => {
  return (
    <div
      className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
        isSelected 
          ? 'bg-indigo-50 border-l-4 border-indigo-500' 
          : 'hover:bg-gray-50 border-l-4 border-transparent'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {result.name}
            </h4>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              result.type === 'commercial' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {result.type}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              result.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {result.status}
            </span>
          </div>
          
          <div className="mt-1 space-y-1">
            {result.email && (
              <p className="text-xs text-gray-600 truncate">
                📧 {result.email}
              </p>
            )}
            {result.phone && (
              <p className="text-xs text-gray-600 truncate">
                📞 {result.phone}
              </p>
            )}
            {result.address && (
              <p className="text-xs text-gray-600 truncate">
                📍 {result.address}
              </p>
            )}
          </div>
          
          {result.matchedFields && result.matchedFields.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-indigo-600">
                Matched: {result.matchedFields.join(', ')}
              </p>
            </div>
          )}
        </div>
        
        <div className="ml-4 flex-shrink-0">
          <div className="text-xs text-gray-500">
            {Math.round(result.score * 100)}% match
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SEARCH HISTORY ITEM COMPONENT
// ============================================================================

interface SearchHistoryItemProps {
  term: string;
  onClick: () => void;
  onRemove: () => void;
}

const SearchHistoryItem: React.FC<SearchHistoryItemProps> = ({ term, onClick, onRemove }) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer group">
      <div className="flex items-center gap-2 flex-1" onClick={onClick}>
        <Clock className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-700 truncate">{term}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
      >
        <X className="h-3 w-3 text-gray-400" />
      </button>
    </div>
  );
};

// ============================================================================
// MAIN SEARCH BAR COMPONENT
// ============================================================================

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search customers...',
  onResultSelect,
  onSearchChange,
  showHistory = true,
  showRecentSearches = true,
  maxResults = 10,
  className = '',
  autoFocus = false,
  debounceMs = 300
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    results,
    loading,
    error,
    searchHistory,
    recentSearches,
    search,
    clearAll,
    cancelSearch,
    addToRecentSearches,
    clearSearchHistory
  } = useSearchIntegration({ debounceMs });

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(inputValue);
    }
  }, [inputValue, onSearchChange]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSelectedIndex(-1);

    if (value.trim()) {
      setIsOpen(true);
      await search(value);
    } else {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    const totalItems = results.length + (showHistory ? searchHistory.length : 0) + (showRecentSearches ? recentSearches.length : 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev <= 0 ? totalItems - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleItemSelect(selectedIndex);
        } else if (inputValue.trim()) {
          handleSearch(inputValue.trim());
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleItemSelect = (index: number) => {
    let currentIndex = 0;

    // Check if it's a search result
    if (index < results.length) {
      const result = results[index];
      handleResultSelect(result);
      return;
    }
    currentIndex += results.length;

    // Check if it's a search history item
    if (showHistory && index < currentIndex + searchHistory.length) {
      const historyIndex = index - currentIndex;
      const term = searchHistory[historyIndex];
      setInputValue(term);
      handleSearch(term);
      return;
    }
    currentIndex += searchHistory.length;

    // Check if it's a recent search item
    if (showRecentSearches && index < currentIndex + recentSearches.length) {
      const recentIndex = index - currentIndex;
      const result = recentSearches[recentIndex];
      handleResultSelect(result);
      return;
    }
  };

  const handleResultSelect = (result: SearchResult) => {
    addToRecentSearches(result);
    setInputValue('');
    setIsOpen(false);
    setSelectedIndex(-1);
    
    if (onResultSelect) {
      onResultSelect(result);
    }
  };

  const handleSearch = async (term: string) => {
    if (!term.trim()) return;
    
    setInputValue(term);
    setIsOpen(false);
    setSelectedIndex(-1);
    
    await search(term);
  };

  const handleClear = () => {
    setInputValue('');
    setIsOpen(false);
    setSelectedIndex(-1);
    clearAll();
    cancelSearch();
    inputRef.current?.focus();
  };

  const handleRemoveHistoryItem = (term: string) => {
    // This would need to be implemented in the search integration
    // For now, we'll just clear all history
    clearSearchHistory();
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderSearchResults = () => {
    if (loading) {
      return (
        <div className="px-4 py-8 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-500" />
          <p className="mt-2 text-sm text-gray-500">Searching...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="px-4 py-8 text-center">
          <div className="text-red-500 text-sm">
            <p>Search failed: {error}</p>
            <button
              onClick={() => search(inputValue)}
              className="mt-2 text-indigo-600 hover:text-indigo-800 underline"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    if (results.length === 0 && inputValue.trim()) {
      return (
        <div className="px-4 py-8 text-center">
          <Search className="h-8 w-8 mx-auto text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">No results found</p>
          <p className="text-xs text-gray-400">Try a different search term</p>
        </div>
      );
    }

    return results.slice(0, maxResults).map((result, index) => (
      <SearchSuggestion
        key={result.id}
        result={result}
        isSelected={selectedIndex === index}
        onClick={() => handleResultSelect(result)}
      />
    ));
  };

  const renderSearchHistory = () => {
    if (!showHistory || searchHistory.length === 0) return null;

    return (
      <div className="border-t border-gray-200">
        <div className="px-4 py-2 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Recent Searches
            </h3>
            <button
              onClick={clearSearchHistory}
              className="text-xs text-indigo-600 hover:text-indigo-800"
            >
              Clear
            </button>
          </div>
        </div>
        {searchHistory.slice(0, 5).map((term, index) => (
          <SearchHistoryItem
            key={term}
            term={term}
            onClick={() => handleSearch(term)}
            onRemove={() => handleRemoveHistoryItem(term)}
          />
        ))}
      </div>
    );
  };

  const renderRecentSearches = () => {
    if (!showRecentSearches || recentSearches.length === 0) return null;

    return (
      <div className="border-t border-gray-200">
        <div className="px-4 py-2 bg-gray-50">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gray-400" />
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Recent Results
            </h3>
          </div>
        </div>
        {recentSearches.slice(0, 3).map((result, index) => (
          <SearchSuggestion
            key={result.id}
            result={result}
            isSelected={selectedIndex === results.length + (showHistory ? searchHistory.length : 0) + index}
            onClick={() => handleResultSelect(result)}
          />
        ))}
      </div>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-500"
        />
        
        {inputValue && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
        >
          {renderSearchResults()}
          {renderSearchHistory()}
          {renderRecentSearches()}
          
          {!loading && !error && results.length === 0 && !inputValue.trim() && (
            <div className="px-4 py-8 text-center">
              <Search className="h-8 w-8 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Start typing to search</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
