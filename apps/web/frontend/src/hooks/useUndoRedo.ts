import { useState, useCallback, useRef } from 'react';
import { DashboardRegion } from '@/routes/dashboard/types/region.types';

interface HistoryState {
  regions: DashboardRegion[];
  timestamp: number;
}

interface UseUndoRedoOptions {
  maxHistorySize?: number;
  debounceMs?: number;
}

interface UseUndoRedoReturn {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => DashboardRegion[] | null;
  redo: () => DashboardRegion[] | null;
  saveState: (regions: DashboardRegion[]) => void;
  clearHistory: () => void;
  historySize: number;
}

export function useUndoRedo({
  maxHistorySize = 50,
  debounceMs = 300
}: UseUndoRedoOptions = {}): UseUndoRedoReturn {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const saveState = useCallback((regions: DashboardRegion[]) => {
    // Debounce to avoid saving on every keystroke
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setHistory(prev => {
        // Remove any states after current index (when user undid and then made new changes)
        const newHistory = prev.slice(0, currentIndex + 1);
        
        // Add new state
        const newState: HistoryState = {
          regions: JSON.parse(JSON.stringify(regions)), // Deep clone
          timestamp: Date.now()
        };

        const updated = [...newHistory, newState];

        // Limit history size
        if (updated.length > maxHistorySize) {
          return updated.slice(-maxHistorySize);
        }

        return updated;
      });

      setCurrentIndex(prev => {
        const newIndex = prev + 1;
        // Ensure index doesn't exceed history length
        return Math.min(newIndex, maxHistorySize - 1);
      });
    }, debounceMs);
  }, [currentIndex, maxHistorySize, debounceMs]);

  const undo = useCallback((): DashboardRegion[] | null => {
    if (currentIndex <= 0) return null;

    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    return history[newIndex]?.regions || null;
  }, [currentIndex, history]);

  const redo = useCallback((): DashboardRegion[] | null => {
    if (currentIndex >= history.length - 1) return null;

    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    return history[newIndex]?.regions || null;
  }, [currentIndex, history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  return {
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    undo,
    redo,
    saveState,
    clearHistory,
    historySize: history.length
  };
}
