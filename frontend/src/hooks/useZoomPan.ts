import { useState, useCallback, useRef, useEffect } from 'react';

interface ZoomPanState {
  zoom: number;
  pan: { x: number; y: number };
  isDragging: boolean;
  dragStart: { x: number; y: number };
}

interface UseZoomPanProps {
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
}

export function useZoomPan({ 
  minZoom = 0.25, 
  maxZoom = 3, 
  zoomStep = 0.1 
}: UseZoomPanProps = {}) {
  const [state, setState] = useState<ZoomPanState>({
    zoom: 1,
    pan: { x: 0, y: 0 },
    isDragging: false,
    dragStart: { x: 0, y: 0 }
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Zoom in
  const zoomIn = useCallback(() => {
    setState(prev => ({
      ...prev,
      zoom: Math.min(maxZoom, prev.zoom + zoomStep)
    }));
  }, [maxZoom, zoomStep]);

  // Zoom out
  const zoomOut = useCallback(() => {
    setState(prev => ({
      ...prev,
      zoom: Math.max(minZoom, prev.zoom - zoomStep)
    }));
  }, [minZoom, zoomStep]);

  // Set specific zoom level
  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({
      ...prev,
      zoom: Math.max(minZoom, Math.min(maxZoom, zoom))
    }));
  }, [minZoom, maxZoom]);

  // Set specific pan position
  const setPan = useCallback((pan: { x: number; y: number }) => {
    setState(prev => ({
      ...prev,
      pan
    }));
  }, []);

  // Reset zoom and pan
  const resetView = useCallback(() => {
    setState(prev => ({
      ...prev,
      zoom: 1,
      pan: { x: 0, y: 0 }
    }));
  }, []);

  // Fit to view
  const fitToView = useCallback((contentBounds: { width: number; height: number }) => {
    if (!containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const scaleX = container.width / contentBounds.width;
    const scaleY = container.height / contentBounds.height;
    const scale = Math.min(scaleX, scaleY, maxZoom);

    setState(prev => ({
      ...prev,
      zoom: Math.max(minZoom, scale * 0.9), // 90% to add some padding
      pan: { x: 0, y: 0 }
    }));
  }, [minZoom, maxZoom]);

  // Handle wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    
    e.preventDefault();
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate zoom point
    const zoomPoint = {
      x: (mouseX - state.pan.x) / state.zoom,
      y: (mouseY - state.pan.y) / state.zoom
    };

    const deltaZoom = e.deltaY > 0 ? -zoomStep : zoomStep;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, state.zoom + deltaZoom));

    // Adjust pan to zoom around mouse position
    const newPan = {
      x: mouseX - zoomPoint.x * newZoom,
      y: mouseY - zoomPoint.y * newZoom
    };

    setState(prev => ({
      ...prev,
      zoom: newZoom,
      pan: newPan
    }));
  }, [state.zoom, state.pan, minZoom, maxZoom, zoomStep]);

  // Handle pan start
  const handlePanStart = useCallback((e: React.MouseEvent) => {
    if (e.button !== 1) return; // Only middle mouse button
    
    e.preventDefault();
    isDraggingRef.current = true;
    
    setState(prev => ({
      ...prev,
      isDragging: true,
      dragStart: { x: e.clientX, y: e.clientY }
    }));

    document.body.style.cursor = 'grabbing';
  }, []);

  // Handle pan move
  const handlePanMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - state.dragStart.x;
    const deltaY = e.clientY - state.dragStart.y;

    setState(prev => ({
      ...prev,
      pan: {
        x: prev.pan.x + deltaX,
        y: prev.pan.y + deltaY
      },
      dragStart: { x: e.clientX, y: e.clientY }
    }));
  }, [state.dragStart]);

  // Handle pan end
  const handlePanEnd = useCallback(() => {
    isDraggingRef.current = false;
    document.body.style.cursor = '';
    
    setState(prev => ({
      ...prev,
      isDragging: false
    }));
  }, []);

  // Add event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });

    if (state.isDragging) {
      document.addEventListener('mousemove', handlePanMove);
      document.addEventListener('mouseup', handlePanEnd);
    }

    return () => {
      container.removeEventListener('wheel', handleWheel);
      document.removeEventListener('mousemove', handlePanMove);
      document.removeEventListener('mouseup', handlePanEnd);
    };
  }, [handleWheel, handlePanMove, handlePanEnd, state.isDragging]);

  // Calculate canvas size based on content bounds
  const calculateCanvasSize = useCallback((contentBounds?: { width: number; height: number; minX?: number; minY?: number; maxX?: number; maxY?: number }) => {
    if (!contentBounds || !containerRef.current) {
      return { width: 0, height: 0 };
    }

    const container = containerRef.current.getBoundingClientRect();
    const viewportWidth = container.width;
    const viewportHeight = container.height;
    
    // Calculate bounding box with padding (20% of viewport)
    const paddingX = viewportWidth * 0.2;
    const paddingY = viewportHeight * 0.2;
    
    const minX = contentBounds.minX ?? 0;
    const minY = contentBounds.minY ?? 0;
    const maxX = contentBounds.maxX ?? contentBounds.width;
    const maxY = contentBounds.maxY ?? contentBounds.height;
    
    const contentWidth = Math.max(maxX - minX, viewportWidth);
    const contentHeight = Math.max(maxY - minY, viewportHeight);
    
    return {
      width: Math.max(contentWidth + paddingX * 2, viewportWidth),
      height: Math.max(contentHeight + paddingY * 2, viewportHeight)
    };
  }, []);

  // Get transform style with improved rendering
  const getTransformStyle = useCallback(() => {
    return {
      transform: `translate3d(${state.pan.x}px, ${state.pan.y}px, 0) scale3d(${state.zoom}, ${state.zoom}, 1)`,
      transformOrigin: '0 0',
      transition: state.isDragging ? 'none' : 'transform 0.1s ease-out',
      willChange: 'transform',
      backfaceVisibility: 'hidden',
      perspective: '1000px'
    } as React.CSSProperties;
  }, [state.zoom, state.pan, state.isDragging]);

  return {
    containerRef,
    zoom: state.zoom,
    pan: state.pan,
    isDragging: state.isDragging,
    zoomIn,
    zoomOut,
    setZoom,
    setPan,
    resetView,
    fitToView,
    handlePanStart,
    getTransformStyle,
    calculateCanvasSize,
    canZoomIn: state.zoom < maxZoom,
    canZoomOut: state.zoom > minZoom
  };
}
