import { useState, useCallback, useRef } from 'react';

interface TouchPoint {
  x: number;
  y: number;
  id: number;
}

interface GestureState {
  isGesturing: boolean;
  gestureType: 'pinch' | 'pan' | 'tap' | 'double-tap' | 'long-press' | 'swipe' | null;
  startPoints: TouchPoint[];
  currentPoints: TouchPoint[];
  deltaX: number;
  deltaY: number;
  scale: number;
  rotation: number;
  velocity: { x: number; y: number };
  direction: 'up' | 'down' | 'left' | 'right' | null;
}

interface UseTouchGesturesProps {
  onPan?: (deltaX: number, deltaY: number, velocity: { x: number; y: number }) => void;
  onPinch?: (scale: number, center: { x: number; y: number }) => void;
  onRotate?: (rotation: number, center: { x: number; y: number }) => void;
  onTap?: (point: { x: number; y: number }) => void;
  onDoubleTap?: (point: { x: number; y: number }) => void;
  onLongPress?: (point: { x: number; y: number }) => void;
  onSwipe?: (direction: 'up' | 'down' | 'left' | 'right', velocity: { x: number; y: number }) => void;
  onGestureStart?: (gestureType: string) => void;
  onGestureEnd?: (gestureType: string) => void;
  enablePinch?: boolean;
  enablePan?: boolean;
  enableTap?: boolean;
  enableSwipe?: boolean;
  longPressDelay?: number;
  swipeThreshold?: number;
  pinchThreshold?: number;
}

export function useTouchGestures({
  onPan,
  onPinch,
  onRotate,
  onTap,
  onDoubleTap,
  onLongPress,
  onSwipe,
  onGestureStart,
  onGestureEnd,
  enablePinch = true,
  enablePan = true,
  enableTap = true,
  enableSwipe = true,
  longPressDelay = 500,
  swipeThreshold = 50,
  pinchThreshold = 0.1
}: UseTouchGesturesProps = {}) {
  const [gestureState, setGestureState] = useState<GestureState>({
    isGesturing: false,
    gestureType: null,
    startPoints: [],
    currentPoints: [],
    deltaX: 0,
    deltaY: 0,
    scale: 1,
    rotation: 0,
    velocity: { x: 0, y: 0 },
    direction: null
  });

  const lastTapTime = useRef<number>(0);
  const lastTapPoint = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const lastMoveTime = useRef<number>(0);
  const lastMovePoint = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Helper function to get touch points from event
  const getTouchPoints = useCallback((e: TouchEvent): TouchPoint[] => {
    return Array.from(e.touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
      id: touch.identifier
    }));
  }, []);

  // Helper function to calculate distance between two points
  const getDistance = useCallback((p1: TouchPoint, p2: TouchPoint): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Helper function to calculate angle between two points
  const getAngle = useCallback((p1: TouchPoint, p2: TouchPoint): number => {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
  }, []);

  // Helper function to calculate center point
  const getCenter = useCallback((points: TouchPoint[]): { x: number; y: number } => {
    if (points.length === 0) return { x: 0, y: 0 };
    if (points.length === 1 && points[0]) return { x: points[0].x, y: points[0].y };
    
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    return {
      x: sumX / points.length,
      y: sumY / points.length
    };
  }, []);

  // Helper function to detect swipe direction
  const getSwipeDirection = useCallback((deltaX: number, deltaY: number): 'up' | 'down' | 'left' | 'right' | null => {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    if (absX > absY) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }, []);

  // Touch start handler
  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    const points = getTouchPoints(e);
    const center = getCenter(points);
    
    // Clear any existing long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    // Start long press timer for single touch
    if (points.length === 1 && onLongPress) {
      longPressTimer.current = setTimeout(() => {
        onLongPress(center);
        setGestureState(prev => ({ ...prev, gestureType: 'long-press' }));
      }, longPressDelay);
    }

    setGestureState(prev => ({
      ...prev,
      isGesturing: true,
      gestureType: null,
      startPoints: points,
      currentPoints: points,
      deltaX: 0,
      deltaY: 0,
      scale: 1,
      rotation: 0,
      velocity: { x: 0, y: 0 },
      direction: null
    }));

    // Initialize velocity tracking
    lastMoveTime.current = Date.now();
    lastMovePoint.current = center;
  }, [getTouchPoints, getCenter, onLongPress, longPressDelay]);

  // Touch move handler
  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    const points = getTouchPoints(e);
    const center = getCenter(points);
    const currentTime = Date.now();
    
    // Calculate velocity
    const timeDelta = currentTime - lastMoveTime.current;
    if (timeDelta > 0) {
      const velocityX = (center.x - lastMovePoint.current.x) / timeDelta;
      const velocityY = (center.y - lastMovePoint.current.y) / timeDelta;
      
      setGestureState(prev => ({
        ...prev,
        currentPoints: points,
        velocity: { x: velocityX, y: velocityY }
      }));
    }

    lastMoveTime.current = currentTime;
    lastMovePoint.current = center;

    setGestureState(prev => {
      const startCenter = getCenter(prev.startPoints);
      const deltaX = center.x - startCenter.x;
      const deltaY = center.y - startCenter.y;
      
      let gestureType = prev.gestureType;
      let scale = prev.scale;
      let rotation = prev.rotation;

      // Detect gesture type if not already detected
      if (!gestureType) {
        if (points.length === 1 && enablePan) {
          gestureType = 'pan';
          if (onGestureStart) onGestureStart('pan');
        } else if (points.length === 2 && enablePinch) {
          gestureType = 'pinch';
          if (onGestureStart) onGestureStart('pinch');
        }
      }

      // Handle pan gesture
      if (gestureType === 'pan' && points.length === 1 && onPan) {
        onPan(deltaX, deltaY, prev.velocity);
      }

      // Handle pinch gesture
      if (gestureType === 'pinch' && points.length === 2 && prev.startPoints[0] && prev.startPoints[1] && points[0] && points[1]) {
        const startDistance = getDistance(prev.startPoints[0], prev.startPoints[1]);
        const currentDistance = getDistance(points[0], points[1]);
        const newScale = currentDistance / startDistance;
        
        if (Math.abs(newScale - scale) > pinchThreshold && onPinch) {
          scale = newScale;
          onPinch(scale, center);
        }

        // Handle rotation
        if (prev.startPoints[0] && prev.startPoints[1] && points[0] && points[1]) {
          const startAngle = getAngle(prev.startPoints[0], prev.startPoints[1]);
          const currentAngle = getAngle(points[0], points[1]);
          const angleDelta = currentAngle - startAngle;
          
          if (Math.abs(angleDelta) > 0.1 && onRotate) {
            rotation = angleDelta;
            onRotate(rotation, center);
          }
        }
      }

      return {
        ...prev,
        currentPoints: points,
        deltaX,
        deltaY,
        scale,
        rotation,
        gestureType
      };
    });
  }, [getTouchPoints, getCenter, enablePan, enablePinch, onPan, onPinch, onRotate, onGestureStart, getDistance, getAngle, pinchThreshold]);

  // Touch end handler
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    setGestureState(prev => {
      const { gestureType, deltaX, deltaY, velocity } = prev;
      
      // Handle tap gestures
      if (gestureType === null || gestureType === 'tap') {
        const currentTime = Date.now();
        const timeSinceLastTap = currentTime - lastTapTime.current;
        const center = getCenter(prev.currentPoints);
        
        // Check for double tap
        if (timeSinceLastTap < 300 && 
            Math.abs(center.x - lastTapPoint.current.x) < 30 && 
            Math.abs(center.y - lastTapPoint.current.y) < 30 &&
            onDoubleTap) {
          onDoubleTap(center);
          lastTapTime.current = 0; // Reset to prevent triple tap
        } else if (enableTap && onTap) {
          // Single tap
          onTap(center);
          lastTapTime.current = currentTime;
          lastTapPoint.current = center;
        }
      }

      // Handle swipe gesture
      if (gestureType === 'pan' && enableSwipe && onSwipe) {
        const swipeDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (swipeDistance > swipeThreshold) {
          const direction = getSwipeDirection(deltaX, deltaY);
          if (direction) {
            onSwipe(direction, velocity);
          }
        }
      }

      // End gesture
      if (gestureType && onGestureEnd) {
        onGestureEnd(gestureType);
      }

      return {
        isGesturing: false,
        gestureType: null,
        startPoints: [],
        currentPoints: [],
        deltaX: 0,
        deltaY: 0,
        scale: 1,
        rotation: 0,
        velocity: { x: 0, y: 0 },
        direction: null
      };
    });
  }, [getCenter, enableTap, enableSwipe, onTap, onDoubleTap, onSwipe, onGestureEnd, getSwipeDirection, swipeThreshold]);

  // Touch cancel handler
  const handleTouchCancel = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    setGestureState(prev => ({
      ...prev,
      isGesturing: false,
      gestureType: null
    }));
  }, []);

  return {
    gestureState,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel
  };
}















