import { useEffect, RefObject } from 'react';

/**
 * Hook that triggers a callback when clicking outside of the specified element
 * @param ref - Ref to the element to watch
 * @param handler - Callback function to execute when clicking outside
 * @param excludeRefs - Array of refs to exclude from the click away detection
 */
export const useClickAway = <T extends HTMLElement>(
  ref: RefObject<T>,
  handler: () => void,
  excludeRefs: RefObject<HTMLElement>[] = []
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the main ref
      if (ref.current && !ref.current.contains(event.target as Node)) {
        // Check if the click is inside any of the excluded refs
        const isInsideExcluded = excludeRefs.some(
          excludeRef => excludeRef.current && excludeRef.current.contains(event.target as Node)
        );
        
        // Only trigger handler if not inside excluded refs
        if (!isInsideExcluded) {
          handler();
        }
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler, excludeRefs]);
};











