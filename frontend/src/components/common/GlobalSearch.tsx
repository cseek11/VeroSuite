import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  User,
  Briefcase,
  Calendar,
  FileText,
  Wrench,
  FileCheck,
  Loader2,
  ArrowRight,
  Command
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { enhancedApi } from '@/lib/enhanced-api';
import { Account, WorkOrder, Job, Invoice } from '@/types/enhanced-types';
import { logger } from '@/utils/logger';
import { getOrCreateTraceContext } from '@/lib/trace-propagation';

interface SearchResult {
  id: string;
  type: 'customer' | 'workOrder' | 'job' | 'invoice' | 'technician' | 'agreement';
  title: string;
  subtitle?: string;
  route: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SearchResultsGroup {
  type: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  results: SearchResult[];
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const traceContext = getOrCreateTraceContext();

  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Search customers
  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ['global-search-customers', debouncedSearchTerm],
    queryFn: async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) return [];
      try {
        return await enhancedApi.customers.getAll({ search: debouncedSearchTerm });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(
          `Failed to search customers: ${errorMessage}`,
          'GlobalSearch',
          error as Error,
          undefined,
          undefined,
          undefined,
          traceContext.traceId,
          traceContext.spanId,
          traceContext.requestId
        );
        return [];
      }
    },
    enabled: debouncedSearchTerm.length >= 2 && isOpen,
    staleTime: 5 * 60 * 1000,
  });

  // Search work orders
  const { data: workOrders = [], isLoading: workOrdersLoading } = useQuery({
    queryKey: ['global-search-work-orders', debouncedSearchTerm],
    queryFn: async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) return [];
      try {
        return await enhancedApi.workOrders.getAll({ search: debouncedSearchTerm });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(
          `Failed to search work orders: ${errorMessage}`,
          'GlobalSearch',
          error as Error,
          undefined,
          undefined,
          undefined,
          traceContext.traceId,
          traceContext.spanId,
          traceContext.requestId
        );
        return [];
      }
    },
    enabled: debouncedSearchTerm.length >= 2 && isOpen,
    staleTime: 5 * 60 * 1000,
  });

  // Search jobs
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['global-search-jobs', debouncedSearchTerm],
    queryFn: async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) return [];
      try {
        return await enhancedApi.jobs.getAll({ search: debouncedSearchTerm });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(
          `Failed to search jobs: ${errorMessage}`,
          'GlobalSearch',
          error as Error,
          undefined,
          undefined,
          undefined,
          traceContext.traceId,
          traceContext.spanId,
          traceContext.requestId
        );
        return [];
      }
    },
    enabled: debouncedSearchTerm.length >= 2 && isOpen,
    staleTime: 5 * 60 * 1000,
  });

  // Transform results into unified format
  useEffect(() => {
    const results: SearchResult[] = [];

    // Add customers
    customers.slice(0, 5).forEach((customer: Account) => {
      results.push({
        id: customer.id,
        type: 'customer',
        title: customer.name,
        subtitle: customer.email || customer.phone || customer.address,
        route: `/customers/${customer.id}`,
        icon: User,
      });
    });

    // Add work orders
    workOrders.slice(0, 5).forEach((wo: WorkOrder) => {
      results.push({
        id: wo.id,
        type: 'workOrder',
        title: `WO-${wo.wo_number || wo.id.slice(0, 8)}`,
        subtitle: wo.description || wo.status,
        route: `/work-orders/${wo.id}`,
        icon: Briefcase,
      });
    });

    // Add jobs
    jobs.slice(0, 5).forEach((job: Job) => {
      results.push({
        id: job.id,
        type: 'job',
        title: `Job ${job.id.slice(0, 8)}`,
        subtitle: job.scheduled_date ? new Date(job.scheduled_date).toLocaleDateString() : 'No date',
        route: `/jobs/${job.id}`,
        icon: Calendar,
      });
    });

    setAllResults(results);
    setSelectedIndex(0);
  }, [customers, workOrders, jobs]);

  // Group results by type
  const groupedResults = useMemo<SearchResultsGroup[]>(() => {
    const groups: Record<string, SearchResult[]> = {};
    
    allResults.forEach(result => {
      if (!groups[result.type]) {
        groups[result.type] = [];
      }
      groups[result.type].push(result);
    });

    const typeConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
      customer: { label: 'Customers', icon: User },
      workOrder: { label: 'Work Orders', icon: Briefcase },
      job: { label: 'Jobs', icon: Calendar },
      invoice: { label: 'Invoices', icon: FileText },
      technician: { label: 'Technicians', icon: Wrench },
      agreement: { label: 'Agreements', icon: FileCheck },
    };

    return Object.entries(groups).map(([type, results]) => ({
      type,
      label: typeConfig[type]?.label || type,
      icon: typeConfig[type]?.icon || Search,
      results,
    }));
  }, [allResults]);

  // Keyboard shortcut handler (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
      setSelectedIndex(0);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, allResults.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (event.key === 'Enter' && allResults[selectedIndex]) {
      event.preventDefault();
      handleSelectResult(allResults[selectedIndex]);
    }
  }, [allResults, selectedIndex]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selectedElement = resultsRef.current.querySelector(
        `[data-result-index="${selectedIndex}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const handleSelectResult = useCallback((result: SearchResult) => {
    try {
      navigate(result.route);
      setIsOpen(false);
      setSearchTerm('');
      setSelectedIndex(0);
      
      logger.info(
        `Global search: Navigated to ${result.type} ${result.id}`,
        'GlobalSearch',
        undefined,
        undefined,
        undefined,
        undefined,
        traceContext.traceId,
        traceContext.spanId,
        traceContext.requestId
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(
        `Failed to navigate to search result: ${errorMessage}`,
        'GlobalSearch',
        error as Error,
        undefined,
        undefined,
        undefined,
        traceContext.traceId,
        traceContext.spanId,
        traceContext.requestId
      );
    }
  }, [navigate, traceContext]);

  const isLoading = customersLoading || workOrdersLoading || jobsLoading;
  const hasResults = allResults.length > 0;
  const hasSearchTerm = debouncedSearchTerm.length >= 2;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <div className="flex flex-col">
          {/* Search Input */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search customers, work orders, jobs..."
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                aria-label="Global search"
                aria-autocomplete="list"
                aria-expanded={isOpen}
                aria-controls="search-results"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedIndex(0);
                    inputRef.current?.focus();
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">Esc</kbd> to close</span>
              <span>Use <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">↓</kbd> to navigate</span>
            </div>
          </div>

          {/* Results */}
          <div
            ref={resultsRef}
            id="search-results"
            className="overflow-y-auto flex-1"
            role="listbox"
            aria-label="Search results"
          >
            {isLoading && hasSearchTerm && (
              <div className="p-8 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Searching...</p>
              </div>
            )}

            {!isLoading && hasSearchTerm && !hasResults && (
              <div className="p-8 text-center">
                <Search className="h-8 w-8 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No results found</p>
                <p className="mt-1 text-xs text-gray-400">Try a different search term</p>
              </div>
            )}

            {!isLoading && !hasSearchTerm && (
              <div className="p-8 text-center">
                <Command className="h-8 w-8 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Start typing to search</p>
                <p className="mt-1 text-xs text-gray-400">Search across customers, work orders, jobs, and more</p>
              </div>
            )}

            {!isLoading && hasResults && (
              <div className="py-2">
                {groupedResults.map((group) => (
                  <div key={group.type} className="mb-4">
                    <div className="px-4 py-2 flex items-center space-x-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <group.icon className="h-4 w-4" />
                      <span>{group.label}</span>
                      <span className="text-gray-400">({group.results.length})</span>
                    </div>
                    {group.results.map((result, index) => {
                      const globalIndex = allResults.findIndex(r => r.id === result.id && r.type === result.type);
                      const isSelected = globalIndex === selectedIndex;
                      const Icon = result.icon;

                      return (
                        <button
                          key={`${result.type}-${result.id}`}
                          data-result-index={globalIndex}
                          onClick={() => handleSelectResult(result)}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors ${
                            isSelected ? 'bg-purple-50 border-l-4 border-purple-500' : ''
                          }`}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <div className="flex-shrink-0">
                            <Icon className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {result.title}
                            </div>
                            {result.subtitle && (
                              <div className="text-xs text-gray-500 truncate mt-0.5">
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


