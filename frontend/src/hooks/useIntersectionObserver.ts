import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
}

interface IntersectionObserverResult {
  isIntersecting: (element: Element) => boolean;
  observe: (element: Element) => void;
  unobserve: (element: Element) => void;
  disconnect: () => void;
}

/**
 * Hook for observing element intersection with viewport
 */
export function useIntersectionObserver(
  containerRef: RefObject<HTMLElement>,
  options: UseIntersectionObserverOptions = {}
): IntersectionObserverResult | null {
  const [observer, setObserver] = useState<IntersectionObserver | null>(null);
  const observedElements = useRef<Map<Element, boolean>>(new Map());

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          observedElements.current.set(entry.target, entry.isIntersecting);
        });
      },
      {
        threshold: options.threshold ?? 0,
        rootMargin: options.rootMargin ?? '0px',
        root: options.root ?? containerRef.current
      }
    );

    setObserver(obs);

    return () => {
      obs.disconnect();
      observedElements.current.clear();
    };
  }, [containerRef, options.threshold, options.rootMargin, options.root]);

  if (!observer) {
    return null;
  }

  return {
    isIntersecting: (element: Element) => {
      return observedElements.current.get(element) ?? false;
    },
    observe: (element: Element) => {
      observer.observe(element);
    },
    unobserve: (element: Element) => {
      observer.unobserve(element);
      observedElements.current.delete(element);
    },
    disconnect: () => {
      observer.disconnect();
      observedElements.current.clear();
    }
  };
}




