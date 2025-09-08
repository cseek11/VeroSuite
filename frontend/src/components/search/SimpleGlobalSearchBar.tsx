// ============================================================================
// SIMPLE GLOBAL SEARCH BAR
// ============================================================================
// Simplified version without dropdowns for header use
// Focuses on core search and command functionality

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';
import { 
  Search, 
  X, 
  Zap, 
  Command
} from 'lucide-react';
import type { SearchFilters } from '@/types/enhanced-types';
import type { IntentResult, IntentType } from '@/lib/intent-classification-service';
import type { ActionResult } from '@/lib/action-handlers';
import { intentClassificationService } from '@/lib/intent-classification-service';
import { actionExecutorService } from '@/lib/action-handlers';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import CommandHelpModal from '@/components/CommandHelpModal';

interface SimpleGlobalSearchBarProps {
  onResultsChange?: (results: any[]) => void;
  onActionExecuted?: (result: ActionResult) => void;
  onFiltersChange?: (filters: SearchFilters) => void;
  placeholder?: string;
  className?: string;
  enableCommands?: boolean;
}

export const SimpleGlobalSearchBar: React.FC<SimpleGlobalSearchBarProps> = ({
  onResultsChange,
  onActionExecuted,
  onFiltersChange,
  placeholder = "Search customers or use natural language commands...",
  className = "",
  enableCommands = true
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    data: any;
    result: ActionResult;
  }>({
    isOpen: false,
    data: null,
    result: {} as ActionResult
  });
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use the advanced search hook but without suggestions
  const {
    results,
    isLoading,
    error,
    search,
    clearSearch: clearSearchResults
  } = useAdvancedSearch({
    enableSuggestions: false, // Disable suggestions to prevent dropdowns
    enableAutoCorrection: false
  });

  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Only perform search if it's not a command
    if (value.trim() && !isCommandQuery(value)) {
      search(value);
    }
  }, [search]);

  // Check if query looks like a command
  const isCommandQuery = (query: string): boolean => {
    // First check if it's a help command
    const helpPatterns = [
      /^help$/i,
      /^what\s+can\s+I\s+do/i,
      /^how\s+do\s+I/i,
      /^show\s+me\s+examples/i,
      /^commands$/i,
      /^what\s+commands/i,
      /^help\s+me/i,
      /^how\s+to/i,
      /^examples$/i,
      /^tutorial$/i,
      /^guide$/i
    ];
    
    if (helpPatterns.some(pattern => pattern.test(query.trim()))) {
      return true;
    }
    
    // Then check other command patterns
    const commandPatterns = [
      /^(create|add|new)\s+(a\s+)?(new\s+)?(customer|client|account)/i,
      /^(schedule|book)\s+(an?\s+)?(appointment|visit|service)/i,
      /^(update|edit|modify)\s+(a\s+)?(customer|client|account)/i,
      /^(update|edit|modify)\s+(.+?)\s+(phone|email|address|name)\s+to\s+(.+)/i,
      /^(delete|remove|cancel|close)\s+(the\s+)?(customer\s+)?(account\s+)?(for\s+)?(.+)/i,
      /^(show|display|list)\s+(all\s+)?(customers|clients|accounts)/i,
      /^(search|find)\s+(a\s+)?(customer|client|account)/i,
      /^(view|show|display)\s+customer\s+(.+)/i,
      /^(start|begin)\s+(job|work)\s+(.+)/i,
      /^(complete|finish|done)\s+(job|work)\s+(.+)/i,
      /^(pause|stop|hold)\s+(job|work)\s+(.+)/i,
      /^(resume|continue|restart)\s+(job|work)\s+(.+)/i,
      /^(create|generate|new)\s+invoice\s+(.+)/i,
      /^(record|log)\s+payment\s+(.+)/i,
      /^(send|email|mail)\s+invoice\s+(.+)/i,
      /^(payment|billing)\s+history\s+(.+)/i,
      /^(outstanding|unpaid|pending|overdue)\s+invoices/i
    ];
    
    return commandPatterns.some(pattern => pattern.test(query.trim()));
  };

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;

    // Check if it's a command
    if (enableCommands && isCommandQuery(query)) {
      await executeCommand(query);
    } else {
      // Regular search - perform search and handle results
      await performSearchAndNavigate(query);
    }
  }, [query, enableCommands, search, results, navigate, clearSearchResults]);

  // Perform search and navigate to results or customer page
  const performSearchAndNavigate = async (searchQuery: string) => {
    try {
      // Perform the search
      search(searchQuery);
      
      // Wait a moment for search results to load
      setTimeout(() => {
        // Check if we have search results
        if (results && results.length > 0) {
          // If there's exactly one result and it's a close match, navigate to that customer
          const exactMatch = results.find((result: any) => 
            result.name && result.name.toLowerCase() === searchQuery.toLowerCase()
          );
          
          if (exactMatch) {
            console.log('🎯 Exact match found, navigating to customer page:', exactMatch.name);
            navigate(`/customers/${exactMatch.id}`);
            setQuery('');
            clearSearchResults();
            return;
          }
          
          // If there are multiple results, navigate to customers page with search
          console.log('🔍 Multiple results found, navigating to customers page');
          navigate(`/customers?search=${encodeURIComponent(searchQuery)}`);
          setQuery('');
          clearSearchResults();
        } else {
          // No results found, navigate to customers page with search anyway
          console.log('🔍 No results found, navigating to customers page');
          navigate(`/customers?search=${encodeURIComponent(searchQuery)}`);
          setQuery('');
          clearSearchResults();
        }
      }, 500); // Wait 500ms for search results to load
      
    } catch (error) {
      console.error('Search navigation error:', error);
    }
  };

  // Execute natural language command
  const executeCommand = async (commandQuery: string) => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    
    try {
      // Classify the intent
      const intentResult: IntentResult = await intentClassificationService.classifyIntent(commandQuery);
      
      if (intentResult.intent && intentResult.confidence > 0.7) {
        // Execute the action
        const result = await actionExecutorService.executeAction(intentResult);
        
        if (result.success) {
          // Clear the search after successful command
          setQuery('');
          clearSearchResults();
          
          // Handle navigation if present
          if (result.navigation) {
            console.log('🧭 Navigating to:', result.navigation.path);
            navigate(result.navigation.path);
          }
          
          // Notify parent component
          onActionExecuted?.(result);
          
          // Show success feedback (you could add a toast here)
          console.log('✅ Command executed successfully:', result.message);
        } else if (result.requiresConfirmation) {
          // Show confirmation dialog
          console.log('🔔 Command requires confirmation:', result.message);
          setConfirmationDialog({
            isOpen: true,
            data: result.data,
            result: result
          });
        } else {
          console.error('❌ Command failed:', result.message);
        }
      } else {
        // Fallback to regular search
        search(commandQuery);
      }
    } catch (error) {
      console.error('❌ Error executing command:', error);
      // Fallback to regular search
      search(commandQuery);
    } finally {
      setIsExecuting(false);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery('');
      clearSearchResults();
      inputRef.current?.blur();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      // Trigger form submission
      handleSubmit(e as any);
    }
  }, [clearSearchResults, handleSubmit]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    clearSearchResults();
    inputRef.current?.focus();
  }, [clearSearchResults]);

  // Handle confirmation dialog
  const handleConfirmAction = useCallback(async () => {
    if (!confirmationDialog.data) return;

    setIsExecuting(true);
    
    try {
      // Create a new intent result for the confirmation action
      const confirmIntentResult: IntentResult = {
        intent: 'confirmDeleteCustomer',
        confidence: 1.0,
        entities: {},
        originalQuery: '',
        processedQuery: '',
        actionData: confirmationDialog.data
      };

      // Execute the confirmed action
      const result = await actionExecutorService.executeAction(confirmIntentResult);
      
      if (result.success) {
        // Clear the search after successful command
        setQuery('');
        clearSearchResults();
        
        // Handle navigation if present
        if (result.navigation) {
          console.log('🧭 Navigating to:', result.navigation.path);
          navigate(result.navigation.path);
        }
        
        // Notify parent component
        onActionExecuted?.(result);
        
        console.log('✅ Confirmed action executed successfully:', result.message);
      } else {
        console.error('❌ Confirmed action failed:', result.message);
      }
    } catch (error) {
      console.error('❌ Confirmation execution error:', error);
    } finally {
      setIsExecuting(false);
      setConfirmationDialog({ isOpen: false, data: null, result: {} as ActionResult });
    }
  }, [confirmationDialog.data, clearSearchResults, onActionExecuted]);

  const handleCancelAction = useCallback(() => {
    setConfirmationDialog({ isOpen: false, data: null, result: {} as ActionResult });
    setQuery('');
    clearSearchResults();
  }, [clearSearchResults]);

  // Notify parent of results changes
  useEffect(() => {
    onResultsChange?.(results);
  }, [results, onResultsChange]);

  // Notify parent of filters changes (empty for simple version)
  useEffect(() => {
    onFiltersChange?.({});
  }, [onFiltersChange]);

  // Handle help modal events
  useEffect(() => {
    const handleShowCommandHelp = () => {
      setHelpModalOpen(true);
    };

    window.addEventListener('showCommandHelp', handleShowCommandHelp);
    return () => window.removeEventListener('showCommandHelp', handleShowCommandHelp);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        {/* Search Icon */}
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        
        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="global-search-input w-full pl-10 pr-16 py-2 bg-white text-gray-900 placeholder-gray-500 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white hover:bg-white transition-colors duration-200"
          disabled={isExecuting}
        />
        
        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {/* Command Indicator */}
        {enableCommands && query && isCommandQuery(query) && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <Zap className="w-4 h-4 text-purple-500" />
          </div>
        )}
      </form>
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
        </div>
      )}
      
      {/* Command Execution Indicator */}
      {isExecuting && (
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
          <div className="flex items-center space-x-1">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
            <span className="text-xs text-purple-600">Executing...</span>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={handleCancelAction}
        onConfirm={handleConfirmAction}
        title={confirmationDialog.result.confirmationData?.title || 'Confirm Action'}
        message={confirmationDialog.result.confirmationData?.message || 'Are you sure?'}
        confirmText={confirmationDialog.result.confirmationData?.confirmText || 'Confirm'}
        cancelText={confirmationDialog.result.confirmationData?.cancelText || 'Cancel'}
        type={confirmationDialog.result.confirmationData?.type || 'danger'}
        isLoading={isExecuting}
      />

      {/* Command Help Modal */}
      <CommandHelpModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />
    </div>
  );
};
