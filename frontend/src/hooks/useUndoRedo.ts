import { useState, useCallback, useRef } from 'react';

interface UseUndoRedoProps<T> {
  initialState: T;
  maxHistorySize?: number;
}

interface UndoRedoState<T> {
  history: T[];
  currentIndex: number;
}

export function useUndoRedo<T>({ initialState, maxHistorySize = 50 }: UseUndoRedoProps<T>) {
  const [state, setState] = useState<UndoRedoState<T>>({
    history: [initialState],
    currentIndex: 0
  });

  const isUpdatingRef = useRef(false);

  // Get current value
  const currentValue = state.history[state.currentIndex];

  // Check if undo is possible
  const canUndo = state.currentIndex > 0;

  // Check if redo is possible
  const canRedo = state.currentIndex < state.history.length - 1;

  // Push new state to history
  const pushState = useCallback((newState: T) => {
    if (isUpdatingRef.current) return; // Prevent recursive updates

    setState(prevState => {
      // If we're not at the end of history, remove everything after current index
      const newHistory = prevState.history.slice(0, prevState.currentIndex + 1);
      
      // Add new state
      newHistory.push(newState);
      
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        return {
          history: newHistory,
          currentIndex: newHistory.length - 1
        };
      }
      
      return {
        history: newHistory,
        currentIndex: newHistory.length - 1
      };
    });
  }, [maxHistorySize]);

  // Undo operation
  const undo = useCallback(() => {
    if (!canUndo) return null;

    setState(prevState => ({
      ...prevState,
      currentIndex: prevState.currentIndex - 1
    }));

    return state.history[state.currentIndex - 1];
  }, [canUndo, state.history, state.currentIndex]);

  // Redo operation
  const redo = useCallback(() => {
    if (!canRedo) return null;

    setState(prevState => ({
      ...prevState,
      currentIndex: prevState.currentIndex + 1
    }));

    return state.history[state.currentIndex + 1];
  }, [canRedo, state.history, state.currentIndex]);

  // Clear history
  const clearHistory = useCallback(() => {
    setState({
      history: [currentValue],
      currentIndex: 0
    });
  }, [currentValue]);

  // Get history info
  const getHistoryInfo = useCallback(() => {
    return {
      historyLength: state.history.length,
      currentIndex: state.currentIndex,
      canUndo,
      canRedo
    };
  }, [state.history.length, state.currentIndex, canUndo, canRedo]);

  // Set updating flag to prevent recursive updates
  const setUpdating = useCallback((updating: boolean) => {
    isUpdatingRef.current = updating;
  }, []);

  return {
    currentValue,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    getHistoryInfo,
    setUpdating
  };
}
