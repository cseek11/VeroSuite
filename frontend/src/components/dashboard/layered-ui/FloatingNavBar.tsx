import React, { useState } from 'react';
import { Filter, Search, X, ChevronDown, ChevronUp, Calendar, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RegionType } from '@/routes/dashboard/types/region.types';

interface FilterOption {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

interface AdvancedFilters {
  types: RegionType[];
  status: 'all' | 'active' | 'locked' | 'collapsed';
  dateRange: 'all' | 'today' | 'week' | 'month';
}

interface FloatingNavBarProps {
  filters?: FilterOption[];
  onSearch?: (term: string) => void;
  onAdvancedFiltersChange?: (filters: AdvancedFilters) => void;
  title?: string;
  searchPlaceholder?: string;
  /** When true, renders inline in normal flow instead of fixed top-right floating card */
  inline?: boolean;
  /** Pixel offset from top when floating (fixed). Default ~16px */
  offsetTop?: number;
}

export const FloatingNavBar: React.FC<FloatingNavBarProps> = ({
  filters = [],
  onSearch,
  onAdvancedFiltersChange,
  title = 'Filters & Context',
  searchPlaceholder = 'Search regions...',
  inline = false,
  offsetTop = 16
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    types: [],
    status: 'all',
    dateRange: 'all'
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch?.(term);
  };

  const handleAdvancedFilterChange = (updates: Partial<AdvancedFilters>) => {
    const newFilters = { ...advancedFilters, ...updates };
    setAdvancedFilters(newFilters);
    onAdvancedFiltersChange?.(newFilters);
  };

  const handleTypeToggle = (type: RegionType) => {
    const currentTypes = advancedFilters.types;
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    handleAdvancedFilterChange({ types: newTypes });
  };

  const activeFiltersCount = filters.filter(f => f.active).length + 
    (advancedFilters.types.length > 0 ? 1 : 0) +
    (advancedFilters.status !== 'all' ? 1 : 0) +
    (advancedFilters.dateRange !== 'all' ? 1 : 0);

  const clearAllFilters = () => {
    setSearchTerm('');
    onSearch?.('');
    setAdvancedFilters({ types: [], status: 'all', dateRange: 'all' });
    onAdvancedFiltersChange?.({ types: [], status: 'all', dateRange: 'all' });
  };

  const hasActiveFilters = activeFiltersCount > 0 || searchTerm.length > 0;

  return (
    <motion.div
      initial={{ y: inline ? 0 : -100 }}
      animate={{ y: 0 }}
      className={inline ? 'w-full' : 'fixed right-4 z-40'}
      style={inline ? undefined : (offsetTop !== undefined ? { top: offsetTop } : undefined)}
    >
      <div className={inline
        ? 'bg-white/80 backdrop-blur rounded-md border border-gray-200 overflow-hidden w-full'
        : 'bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-w-[320px] max-w-[400px]'}
      >
        {/* Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors w-full"
        >
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">{title}</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className={`p-4 space-y-4 border-t border-gray-200 ${inline ? 'max-h-72' : 'max-h-[70vh]'} overflow-y-auto`}>
                {/* Search - Always visible when open */}
                {onSearch && (
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder={searchPlaceholder}
                      className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      autoFocus={isOpen}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          onSearch('');
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Clear search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}

                {/* Quick Filters */}
                {filters.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-2">Quick Filters</h4>
                    <div className="space-y-1">
                      {filters.map((filter) => (
                        <button
                          key={filter.id}
                          onClick={filter.onClick}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                            filter.active
                              ? 'bg-purple-100 text-purple-700 font-medium'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Advanced Filters Toggle */}
                <div className="border-t border-gray-200 pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      <span>Advanced Filters</span>
                    </div>
                    {showAdvanced ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* Advanced Filters Content */}
                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-4">
                          {/* Region Type Filter */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                              Region Type
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.values(RegionType).map((type) => {
                                const isSelected = advancedFilters.types.includes(type);
                                return (
                                  <button
                                    key={type}
                                    onClick={() => handleTypeToggle(type)}
                                    className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                                      isSelected
                                        ? 'bg-purple-100 border-purple-300 text-purple-700 font-medium'
                                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                                  >
                                    {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Status Filter */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                              Status
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {(['all', 'active', 'locked', 'collapsed'] as const).map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handleAdvancedFilterChange({ status })}
                                  className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                                    advancedFilters.status === status
                                      ? 'bg-purple-100 border-purple-300 text-purple-700 font-medium'
                                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Date Range Filter */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                              <Calendar className="w-3 h-3 inline mr-1" />
                              Date Range
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {(['all', 'today', 'week', 'month'] as const).map((range) => (
                                <button
                                  key={range}
                                  onClick={() => handleAdvancedFilterChange({ dateRange: range })}
                                  className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                                    advancedFilters.dateRange === range
                                      ? 'bg-purple-100 border-purple-300 text-purple-700 font-medium'
                                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  {range.charAt(0).toUpperCase() + range.slice(1)}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Clear All Button */}
                {hasActiveFilters && (
                  <div className="pt-2 border-t border-gray-200">
                    <button
                      onClick={clearAllFilters}
                      className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
