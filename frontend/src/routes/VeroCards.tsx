import React, { useState, useEffect, Suspense, useRef, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { useTodayJobs } from '@/hooks/useJobs';
import { LoadingSpinner, PageLoader } from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
// DashboardHeader removed as part of V4 migration
// DashboardSidebar removed as part of V4 migration

import { DashboardMetric, Job } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { enhancedApi } from '@/lib/enhanced-api';

// TODO: Implement routing API in enhanced API
// For now, using placeholder functions
const routingApi = {
  optimize: async (date: string) => {
    console.log('TODO: Implement routing API in enhanced API');
    return [];
  }
};
import {
  Alert,
  Avatar,
  Button,
  IconButton,
  Card,
  Checkbox,
  Chip,
  Collapse,
  Dropdown,
  Input,
  Modal,
  ProgressBar,
  Tabs,
  Textarea,
  Tooltip,
  Typography,
  Navbar
} from '@/components/ui/EnhancedUI';
import { ReusablePopup } from '@/components/ui';
import { 
  Users, 
  TrendingUp, 
  ShoppingCart, 
  Eye, 
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Filter,
  Upload,
  Download,
  Save,
  Check,
  Info,
  XCircle,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Star,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Camera,
  Image,
  FileText,
  Zap,
  Layers,
  Grid,
  List,
  MoreVertical,
  RefreshCw,
  Copy,
  Share2,
  Maximize2,
  Moon,
  Sun,
  Palette,
  Type,
  Layout,
  Sliders as SlidersIcon,
  Home,
  CreditCard,
  MessageCircle,
  Globe,
  Mail,
  Phone,
  Heart,
  GripVertical,
  Move,
  Lock,
  X,
  Unlock,
  MapPin,
  Search,
  FolderOpen,
  Activity,
  Bell
} from 'lucide-react';


// Empty mock data - will be populated from API
interface ResizableDashboardProps {
  showHeader?: boolean;
}

const ResizableDashboard: React.FC<ResizableDashboardProps> = ({ showHeader = true }) => {
  const navigate = useNavigate();
  const { user, clear: clearAuth } = useAuthStore();
  const { data: jobs, isLoading: jobsLoading, error: jobsError } = useTodayJobs();
  
  // Routing data query
  const [routingDate, setRoutingDate] = useState(() => new Date().toISOString().slice(0, 10));
  const { data: routingData, isLoading: routingLoading, error: routingError } = useQuery({
    queryKey: ['routing', 'optimize', routingDate],
    queryFn: () => routingApi.optimize(routingDate),
    enabled: false, // Don't auto-fetch, only fetch when routing card is active
  });
  
  // Type-safe routing data
  const routingRoutes = Array.isArray(routingData) ? routingData : [];
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [draggingCard, setDraggingCard] = useState<string | null>(null);
  const [dragStartPosition, setDragStartPosition] = useState<{ x: number; y: number } | null>(null);
  const [dragStartGridPosition, setDragStartGridPosition] = useState<{ x: number; y: number } | null>(null);
  const [isResizingCard, setIsResizingCard] = useState<string | null>(null);
  const [resizeDirection, setResizeDirection] = useState<'horizontal' | 'vertical' | 'both' | null>(null);
  const [resizeStartPosition, setResizeStartPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [resizeStartSize, setResizeStartSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [resizeTimeout, setResizeTimeout] = useState<NodeJS.Timeout | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [alignmentGuides, setAlignmentGuides] = useState<{ x?: number; y?: number }[]>([]);
  const [snapDistance] = useState(20); // Distance in pixels to snap to grid/cards
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [selectionBox, setSelectionBox] = useState<{ start: { x: number; y: number }; end: { x: number; y: number } } | null>(null);
  const [isMultiSelecting, setIsMultiSelecting] = useState(false);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const [savedLayouts, setSavedLayouts] = useState<Record<string, any>>({});
  const [currentLayout, setCurrentLayout] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchPalette, setShowSearchPalette] = useState(false);
  const [cardTemplates, setCardTemplates] = useState<Record<string, any>>({
    chart: { minWidth: 300, minHeight: 200, maxWidth: 800, maxHeight: 600 },
    note: { minWidth: 200, minHeight: 150, maxWidth: 500, maxHeight: 400 },
    task: { minWidth: 250, minHeight: 200, maxWidth: 600, maxHeight: 500 },
    widget: { minWidth: 200, minHeight: 150, maxWidth: 400, maxHeight: 300 }
  });
  const [cardGroups, setCardGroups] = useState<Record<string, string[]>>({});
  const [showGroupingMenu, setShowGroupingMenu] = useState(false);
  const [analyticsMode, setAnalyticsMode] = useState(false);
  const [interactionHeatmap, setInteractionHeatmap] = useState<Record<string, number>>({});
  const [cardUsageStats, setCardUsageStats] = useState<Record<string, { timeSpent: number; interactions: number }>>({});
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [lockedCards, setLockedCards] = useState<Set<string>>(new Set());
  const [customCardTypes, setCustomCardTypes] = useState<Record<string, string>>({});
  const [showCardTypeDropdown, setShowCardTypeDropdown] = useState<string | null>(null);
  
  // Swap mode state
  const [swapMode, setSwapMode] = useState<boolean>(false);
  const [swapSourceCard, setSwapSourceCard] = useState<string | null>(null);
  
  // Optimized freehand layout configuration
  const layoutConfig = {
    // Freehand mode settings - optimized for productivity
    freehand: {
      minGap: 12, // Tighter spacing for more cards
      snapDistance: 40, // Reduced snap distance
      collisionBuffer: 8, // Smaller buffer
      autoExpandThreshold: 80, // Reduced threshold
      headerOffset: 60, // Reduced since no traditional header
      sidebarOffset: 20, // Minimal since no sidebar
      sidebarCollapsedOffset: 20, // Minimal since no sidebar
    },
    // Canvas settings - optimized for more content
    canvas: {
      minHeight: 600, // Reduced min height
      padding: 4,
      autoExpandAmount: 150 // Smaller auto-expand
    }
  };


  // Available card types for custom cards
  const availableCardTypes = [
    { id: 'dashboard-metrics', name: 'Dashboard Metrics', icon: BarChart3, description: 'Display key performance metrics' },
    { id: 'jobs-calendar', name: 'Jobs Calendar', icon: Calendar, description: 'View and manage job schedules' },
    { id: 'recent-activity', name: 'Recent Activity', icon: Activity, description: 'Track recent system activities' },
    { id: 'customer-search', name: 'Customer Search', icon: Search, description: 'Search and manage customers' },
    { id: 'reports', name: 'Reports', icon: FileText, description: 'Generate and view reports' },
    { id: 'dashboard-overview', name: 'Dashboard Overview', icon: Layout, description: 'Overview of all dashboard components' },
    { id: 'quick-actions', name: 'Quick Actions', icon: Zap, description: 'Quick access to common actions' },
    { id: 'routing', name: 'Routing', icon: MapPin, description: 'Route optimization with maps' },
    { id: 'uploads', name: 'Uploads', icon: Upload, description: 'File upload and management' },
    { id: 'settings', name: 'Settings', icon: Settings, description: 'System configuration options' }
  ];

  // Handle card type selection
  const handleCardTypeSelect = (cardId: string, cardTypeId: string) => {
    setCustomCardTypes(prev => ({
      ...prev,
      [cardId]: cardTypeId
    }));
    setShowCardTypeDropdown(null);
    
    // Adjust card size based on content type
    const getCardSizeForType = (typeId: string) => {
      switch (typeId) {
        case 'routing':
          return { width: 320, height: 240 }; // Reduced by ~30%
        case 'dashboard-metrics':
          return { width: 280, height: 180 }; // Reduced by ~30%
        case 'jobs-calendar':
          return { width: 300, height: 220 }; // Reduced by ~25%
        case 'recent-activity':
          return { width: 260, height: 200 }; // Reduced by ~25%
        case 'customer-search':
          return { width: 260, height: 160 }; // Reduced by ~25%
        case 'reports':
          return { width: 280, height: 180 }; // Reduced by ~30%
        case 'dashboard-overview':
          return { width: 300, height: 180 }; // Reduced by ~30%
        case 'quick-actions':
          return { width: 260, height: 160 }; // Reduced by ~25%
        case 'uploads':
          return { width: 260, height: 160 }; // Reduced by ~25%
        case 'settings':
          return { width: 260, height: 160 }; // Reduced by ~25%
        default:
          return { width: 280, height: 180 }; // Reduced default size
      }
    };
    
    const newSize = getCardSizeForType(cardTypeId);
    setCardWidths(prev => ({ ...prev, [cardId]: newSize.width }));
    setCardHeights(prev => ({ ...prev, [cardId]: newSize.height }));
    
    // If routing is selected, trigger the routing query
    if (cardTypeId === 'routing') {
      const queryClient = require('@tanstack/react-query').useQueryClient();
      queryClient.prefetchQuery({
        queryKey: ['routing', 'optimize', routingDate],
        queryFn: () => routingApi.optimize(routingDate),
      });
    }
    
    // Save to localStorage
    try {
      const savedTypes = localStorage.getItem('dashboard-custom-card-types');
      const existingTypes = savedTypes ? JSON.parse(savedTypes) : {};
      const updatedTypes = { ...existingTypes, [cardId]: cardTypeId };
      localStorage.setItem('dashboard-custom-card-types', JSON.stringify(updatedTypes));
      
      // Save updated sizes
      const savedWidths = localStorage.getItem('dashboard-card-widths');
      const savedHeights = localStorage.getItem('dashboard-card-heights');
      const existingWidths = savedWidths ? JSON.parse(savedWidths) : {};
      const existingHeights = savedHeights ? JSON.parse(savedHeights) : {};
      
      const updatedWidths = { ...existingWidths, [cardId]: newSize.width };
      const updatedHeights = { ...existingHeights, [cardId]: newSize.height };
      
      localStorage.setItem('dashboard-card-widths', JSON.stringify(updatedWidths));
      localStorage.setItem('dashboard-card-heights', JSON.stringify(updatedHeights));
    } catch (error) {
      console.error('Error saving custom card types:', error);
    }
  };

  // Load custom card types from localStorage
  useEffect(() => {
    try {
      const savedTypes = localStorage.getItem('dashboard-custom-card-types');
      if (savedTypes) {
        setCustomCardTypes(JSON.parse(savedTypes));
      }
    } catch (error) {
      console.error('Error loading custom card types:', error);
    }
  }, []);

  // Close card type dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCardTypeDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest('.card-type-dropdown')) {
          setShowCardTypeDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCardTypeDropdown]);

  // Get card type info
  const getCardTypeInfo = (cardId: string) => {
    const cardTypeId = customCardTypes[cardId];
    return availableCardTypes.find(type => type.id === cardTypeId);
  };



  // Collapsible sidebar state - default to collapsed
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('dashboard-sidebar-collapsed');
      return saved ? JSON.parse(saved) : true; // Default to true (collapsed)
    } catch (error) {
      return true; // Default to collapsed
    }
  });

  // Load saved layout from localStorage or use defaults
  const loadSavedLayout = () => {
    try {
      const savedHeights = localStorage.getItem('dashboard-card-heights');
      const savedWidths = localStorage.getItem('dashboard-card-widths');
      const savedOrder = localStorage.getItem('dashboard-card-order');
      const savedGridPositions = localStorage.getItem('dashboard-grid-positions');
      
      return {
        heights: savedHeights ? JSON.parse(savedHeights) : {
          'dashboard-overview': 250,
          metrics: 200,
          calendar: 300,
          activity: 250,
          quickActions: 200,
          custom: 200,
          'custom-test': 200
        },
        widths: savedWidths ? JSON.parse(savedWidths) : {
          'dashboard-overview': 400,
          metrics: 400,
          calendar: 400,
          activity: 400,
          quickActions: 400,
          custom: 400,
          'custom-test': 400
        },
        order: savedOrder ? JSON.parse(savedOrder) : ['dashboard-overview', 'metrics', 'calendar', 'activity', 'quickActions', 'custom-test'],
        gridPositions: savedGridPositions ? JSON.parse(savedGridPositions) : {
          'dashboard-overview': { x: 0, y: 0 },
          metrics: { x: 1, y: 0 },
          calendar: { x: 2, y: 0 },
          activity: { x: 0, y: 1 },
          quickActions: { x: 1, y: 1 },
          'custom-test': { x: 2, y: 1 }
        }
      };
    } catch (error) {
      console.error('Error loading saved layout:', error);
      return {
        heights: {
          'dashboard-overview': 250,
          metrics: 200,
          calendar: 300,
          activity: 250,
          quickActions: 200,
          custom: 200,
          'custom-test': 200
        },
        widths: {
          'dashboard-overview': 400,
          metrics: 400,
          calendar: 400,
          activity: 400,
          quickActions: 400,
          custom: 400,
          'custom-test': 400
        },
        order: ['dashboard-overview', 'metrics', 'calendar', 'activity', 'quickActions', 'custom-test'],
        gridPositions: {
          'dashboard-overview': { x: 0, y: 0 },
          metrics: { x: 1, y: 0 },
          calendar: { x: 2, y: 0 },
          activity: { x: 0, y: 1 },
          quickActions: { x: 1, y: 1 },
          'custom-test': { x: 2, y: 1 }
        }
      };
    }
  };

  const [cardHeights, setCardHeights] = useState(loadSavedLayout().heights);
  const [cardWidths, setCardWidths] = useState(loadSavedLayout().widths);
  const [cardOrder, setCardOrder] = useState(loadSavedLayout().order);
  const [gridPositions, setGridPositions] = useState<Record<string, { x: number; y: number }>>(loadSavedLayout().gridPositions);
  
  // Simplified to freehand mode only
  const [canvasHeight, setCanvasHeight] = useState<number>(layoutConfig.canvas.minHeight);
  const [cardPositions, setCardPositions] = useState<Record<string, { x: number; y: number }>>({});


  // Ensure all cards have valid grid positions
  useEffect(() => {
    const updatedPositions = { ...gridPositions };
    let hasChanges = false;
    
    cardOrder.forEach((cardId) => {
      if (!updatedPositions[cardId]) {
        // Find a free position for this card
        const freePosition = findFreeGridPosition();
        updatedPositions[cardId] = freePosition;
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      setGridPositions(updatedPositions);
      saveLayout(cardHeights, cardWidths, cardOrder, updatedPositions);
    }
  }, [cardOrder]); // Only run when cardOrder changes



  // Save layout to localStorage
  const saveLayout = (heights: any, widths: any, order: any, positions: any) => {
    try {
      localStorage.setItem('dashboard-card-heights', JSON.stringify(heights));
      localStorage.setItem('dashboard-card-widths', JSON.stringify(widths));
      localStorage.setItem('dashboard-card-order', JSON.stringify(order));
      localStorage.setItem('dashboard-grid-positions', JSON.stringify(positions));
    } catch (error) {
      console.error('Error saving layout:', error);
    }
  };

  // Save layout to named workspace
  const saveLayoutToWorkspace = (workspaceName: string) => {
    const layoutData = {
      cardHeights: { ...cardHeights },
      cardWidths: { ...cardWidths },
      cardOrder: [...cardOrder],
      gridPositions: { ...gridPositions },
      cardGroups: { ...cardGroups },
      timestamp: Date.now()
    };
    
    const updatedLayouts = { ...savedLayouts, [workspaceName]: layoutData };
    setSavedLayouts(updatedLayouts);
    
    try {
      localStorage.setItem('dashboard-saved-layouts', JSON.stringify(updatedLayouts));
    } catch (error) {
      console.error('Error saving workspace:', error);
    }
  };

  // Load layout from named workspace
  const loadLayoutFromWorkspace = (workspaceName: string) => {
    const layoutData = savedLayouts[workspaceName];
    if (!layoutData) return;
    
    setCardHeights(layoutData.cardHeights);
    setCardWidths(layoutData.cardWidths);
    setCardOrder(layoutData.cardOrder);
    setGridPositions(layoutData.gridPositions);
    setCardGroups(layoutData.cardGroups || {});
    setCurrentLayout(workspaceName);
    
    saveLayout(layoutData.cardHeights, layoutData.cardWidths, layoutData.cardOrder, layoutData.gridPositions);
  };

  // Delete workspace
  const deleteWorkspace = (workspaceName: string) => {
    const updatedLayouts = { ...savedLayouts };
    delete updatedLayouts[workspaceName];
    setSavedLayouts(updatedLayouts);
    
    try {
      localStorage.setItem('dashboard-saved-layouts', JSON.stringify(updatedLayouts));
    } catch (error) {
      console.error('Error deleting workspace:', error);
    }
  };

  // Save state to undo stack
  const saveToUndoStack = useCallback(() => {
    const currentState = {
      cardHeights: { ...cardHeights },
      cardWidths: { ...cardWidths },
      cardOrder: [...cardOrder],
      gridPositions: { ...gridPositions }
    };
    
    setUndoStack(prev => [...prev, currentState]);
    setRedoStack([]); // Clear redo stack when new action is performed
  }, [cardHeights, cardWidths, cardOrder, gridPositions]);

  // Undo function
  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    
    const currentState = {
      cardHeights: { ...cardHeights },
      cardWidths: { ...cardWidths },
      cardOrder: [...cardOrder],
      gridPositions: { ...gridPositions }
    };
    
    const previousState = undoStack[undoStack.length - 1];
    
    setCardHeights(previousState.cardHeights);
    setCardWidths(previousState.cardWidths);
    setCardOrder(previousState.cardOrder);
    setGridPositions(previousState.gridPositions);
    
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, currentState]);
    
    saveLayout(previousState.cardHeights, previousState.cardWidths, previousState.cardOrder, previousState.gridPositions);
  }, [undoStack, cardHeights, cardWidths, cardOrder, gridPositions]);

  // Redo function
  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    
    const currentState = {
      cardHeights: { ...cardHeights },
      cardWidths: { ...cardWidths },
      cardOrder: [...cardOrder],
      gridPositions: { ...gridPositions }
    };
    
    const nextState = redoStack[redoStack.length - 1];
    
    setCardHeights(nextState.cardHeights);
    setCardWidths(nextState.cardWidths);
    setCardOrder(nextState.cardOrder);
    setGridPositions(nextState.gridPositions);
    
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, currentState]);
    
    saveLayout(nextState.cardHeights, nextState.cardWidths, nextState.cardOrder, nextState.gridPositions);
  }, [redoStack, cardHeights, cardWidths, cardOrder, gridPositions]);

  // Toggle card lock
  const toggleCardLock = (cardId: string) => {
    setLockedCards(prev => {
      const newLocked = new Set(prev);
      if (newLocked.has(cardId)) {
        newLocked.delete(cardId);
      } else {
        newLocked.add(cardId);
      }
      return newLocked;
    });
  };

  // Check if card is locked
  const isCardLocked = (cardId: string) => lockedCards.has(cardId);

  // Save sidebar state
  const saveSidebarState = (collapsed: boolean) => {
    try {
      localStorage.setItem('dashboard-sidebar-collapsed', JSON.stringify(collapsed));
    } catch (error) {
      console.error('Error saving sidebar state:', error);
    }
  };

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    saveSidebarState(newCollapsed);
  };

  // Swap mode functions
  const handleCardSwap = (cardId: string) => {
    if (!swapMode) {
      // Enter swap mode
      setSwapMode(true);
      setSwapSourceCard(cardId);
    } else {
      // Complete swap
      if (swapSourceCard && swapSourceCard !== cardId) {
        // Swap positions
        // Freehand mode swap
        const sourcePos = cardPositions[swapSourceCard];
        const targetPos = cardPositions[cardId];
        if (sourcePos && targetPos) {
          setCardPositions(prev => ({
            ...prev,
            [swapSourceCard]: targetPos,
            [cardId]: sourcePos
          }));
        }
      }
      // Exit swap mode
      setSwapMode(false);
      setSwapSourceCard(null);
    }
  };

  const cancelSwapMode = () => {
    setSwapMode(false);
    setSwapSourceCard(null);
  };


  // Reset layout to defaults
  const resetLayout = () => {
    const defaultLayout = {
      heights: {
        metrics: 200,
        calendar: 300,
        activity: 250,
        quickActions: 200,
        custom: 200,
        'custom-test': 200
      },
      widths: {
        metrics: 400,
        calendar: 400,
        activity: 400,
        quickActions: 400,
        custom: 400,
        'custom-test': 400
      },
      order: ['metrics', 'calendar', 'activity', 'quickActions', 'custom-test'],
      gridPositions: {
        metrics: { x: 0, y: 0 },
        calendar: { x: 1, y: 0 },
        activity: { x: 0, y: 1 },
        quickActions: { x: 1, y: 1 },
        'custom-test': { x: 2, y: 0 }
      }
    };

    setCardHeights(defaultLayout.heights);
    setCardWidths(defaultLayout.widths);
    setCardOrder(defaultLayout.order);
    setGridPositions(defaultLayout.gridPositions);
    
    // If in freehand mode, also reset card positions with proper spacing
    if (!isGridMode) {
      const sidebarOffset = sidebarCollapsed ? 
        layoutConfig.freehand.sidebarCollapsedOffset : 
        layoutConfig.freehand.sidebarOffset;
      
      const newCardPositions: Record<string, { x: number; y: number }> = {};
      const cardSpacing = layoutConfig.freehand.minGap + 100; // Increased spacing for reset to prevent sticking
      
      defaultLayout.order.forEach((cardId, index) => {
        const row = Math.floor(index / 2);
        const col = index % 2;
        
        const position = {
          x: sidebarOffset + col * (400 + cardSpacing),
          y: layoutConfig.freehand.headerOffset + row * (300 + cardSpacing)
        };
        
        // Ensure position respects boundaries
        newCardPositions[cardId] = constrainPositionToBoundaries(position, cardId);
      });
      
      setCardPositions(newCardPositions);
      
      // Save freehand positions to localStorage
      try {
        localStorage.setItem('dashboard-card-positions', JSON.stringify(newCardPositions));
      } catch (error) {
        console.error('Error saving reset card positions:', error);
      }
    }
    
    // Clear custom card types when resetting layout
    setCustomCardTypes({});
    try {
      localStorage.removeItem('dashboard-custom-card-types');
    } catch (error) {
      console.error('Error clearing custom card types:', error);
    }
    
    saveLayout(defaultLayout.heights, defaultLayout.widths, defaultLayout.order, defaultLayout.gridPositions);
  };

  // Add new custom card
  const addCustomCard = (templateType: string = 'widget') => {
    const newCardId = `custom-${Date.now()}`;
    const template = cardTemplates[templateType] || cardTemplates.widget;
    
    const newHeights = { ...cardHeights, [newCardId]: template.minHeight };
    const newWidths = { ...cardWidths, [newCardId]: template.minWidth };
    const newOrder = [...cardOrder, newCardId];
    
    // Find a free grid position
    const newPosition = findFreeGridPosition();
    const newPositions = { ...gridPositions, [newCardId]: newPosition };
    
    setCardHeights(newHeights);
    setCardWidths(newWidths);
    setCardOrder(newOrder);
    setGridPositions(newPositions);
    saveLayout(newHeights, newWidths, newOrder, newPositions);
  };

  // Group cards
  const groupCards = (groupName: string) => {
    if (selectedCards.size === 0) return;
    
    const newGroups = { ...cardGroups };
    newGroups[groupName] = Array.from(selectedCards);
    setCardGroups(newGroups);
    setSelectedCards(new Set());
    
    // Save to localStorage
    try {
      localStorage.setItem('dashboard-card-groups', JSON.stringify(newGroups));
    } catch (error) {
      console.error('Error saving card groups:', error);
    }
  };

  // Ungroup cards
  const ungroupCards = (groupName: string) => {
    const newGroups = { ...cardGroups };
    delete newGroups[groupName];
    setCardGroups(newGroups);
    
    try {
      localStorage.setItem('dashboard-card-groups', JSON.stringify(newGroups));
    } catch (error) {
      console.error('Error saving card groups:', error);
    }
  };

  // AI Assistant - Auto-arrange cards
  const autoArrangeCards = () => {
    const cards = [...cardOrder];
    const positions = { ...gridPositions };
    
    // Simple auto-arrangement algorithm
    let x = 0, y = 0;
    cards.forEach((cardId, index) => {
      positions[cardId] = { x, y };
      
      x++;
      if (x >= gridLayout.columns) {
        x = 0;
        y++;
      }
    });
    
    setGridPositions(positions);
    saveLayout(cardHeights, cardWidths, cardOrder, positions);
    
    // Generate AI suggestions
    const suggestions = [
      'Consider grouping related cards together for better organization',
      'Try resizing the calendar card for better visibility',
      'The metrics cards could be arranged in a row for easier comparison'
    ];
    setAiSuggestions(suggestions);
  };

  // Track card interactions for analytics
  const trackCardInteraction = (cardId: string, interactionType: string) => {
    const stats = { ...cardUsageStats };
    if (!stats[cardId]) {
      stats[cardId] = { timeSpent: 0, interactions: 0 };
    }
    
    stats[cardId].interactions++;
    setCardUsageStats(stats);
    
    // Update heatmap
    const heatmap = { ...interactionHeatmap };
    heatmap[cardId] = (heatmap[cardId] || 0) + 1;
    setInteractionHeatmap(heatmap);
  };

  // Find free grid position
  const findFreeGridPosition = () => {
    const usedPositions = Object.values(gridPositions);
    for (let x = 0; x < gridLayout.columns; x++) {
      for (let y = 0; y < gridLayout.rows; y++) {
        const position = { x, y };
        if (!usedPositions.some(pos => pos.x === position.x && pos.y === position.y)) {
          return position;
        }
      }
    }
    return { x: 0, y: 0 }; // Fallback
  };



  // Close card
  const closeCard = (cardId: string) => {
    if (['metrics', 'calendar', 'activity', 'quickActions'].includes(cardId)) {
      // Core cards can be closed but will be recreated on reset
      const newOrder = cardOrder.filter(id => id !== cardId);
      const newPositions = { ...gridPositions };
      delete newPositions[cardId];
      
      setCardOrder(newOrder);
      setGridPositions(newPositions);
      saveLayout(cardHeights, cardWidths, newOrder, newPositions);
    } else {
      // Custom cards can be permanently removed
      const newHeights = { ...cardHeights };
      const newWidths = { ...cardWidths };
      const newOrder = cardOrder.filter(id => id !== cardId);
      const newPositions = { ...gridPositions };
      
      delete newHeights[cardId];
      delete newWidths[cardId];
      delete newPositions[cardId];
      
      // Remove custom card type from state and localStorage
      setCustomCardTypes(prev => {
        const newTypes = { ...prev };
        delete newTypes[cardId];
        return newTypes;
      });
      
      // Update localStorage
      try {
        const savedTypes = localStorage.getItem('dashboard-custom-card-types');
        const existingTypes = savedTypes ? JSON.parse(savedTypes) : {};
        delete existingTypes[cardId];
        localStorage.setItem('dashboard-custom-card-types', JSON.stringify(existingTypes));
      } catch (error) {
        console.error('Error removing custom card type:', error);
      }
      
      setCardHeights(newHeights);
      setCardWidths(newWidths);
      setCardOrder(newOrder);
      setGridPositions(newPositions);
      saveLayout(newHeights, newWidths, newOrder, newPositions);
    }
  };

  // Get card width and height - memoized for performance
  const getCardWidth = useCallback((cardId: string) => cardWidths[cardId] || 400, [cardWidths]);
  const getCardHeight = useCallback((cardId: string) => cardHeights[cardId] || 200, [cardHeights]);

  // Hybrid positioning functions
  const getCardBounds = useCallback((cardId: string) => {
    const position = isGridMode ? gridPositions[cardId] : cardPositions[cardId];
    const width = getCardWidth(cardId);
    const height = getCardHeight(cardId);
    
    if (!position) return null;
    
    return {
      x: position.x,
      y: position.y,
      width,
      height,
      right: position.x + width,
      bottom: position.y + height
    };
  }, [isGridMode, gridPositions, cardPositions, getCardWidth, getCardHeight]);

  // Check if two cards overlap
  const checkCollision = useCallback((card1Bounds: any, card2Bounds: any) => {
    if (!card1Bounds || !card2Bounds) return false;
    
    // Use a minimum gap between cards to ensure they repel each other
    const minGap = layoutConfig.freehand.minGap;
    
    return !(
      card1Bounds.right + minGap < card2Bounds.x ||
      card1Bounds.x > card2Bounds.right + minGap ||
      card1Bounds.bottom + minGap < card2Bounds.y ||
      card1Bounds.y > card2Bounds.bottom + minGap
    );
  }, []);

  // Constrain position to stay within boundaries (header and sidebar)
  const constrainPositionToBoundaries = useCallback((position: { x: number; y: number }, cardId: string) => {
    const cardWidth = getCardWidth(cardId);
    const cardHeight = getCardHeight(cardId);
    
    if (isGridMode) {
      // In grid mode, apply sidebar offset constraints
      const sidebarOffset = sidebarCollapsed ? 
        layoutConfig.freehand.sidebarCollapsedOffset : 
        layoutConfig.freehand.sidebarOffset;
      
      // Constrain to stay within boundaries
      const constrainedX = Math.max(sidebarOffset, position.x);
      const constrainedY = Math.max(layoutConfig.freehand.headerOffset, position.y);
      
      return { x: constrainedX, y: constrainedY };
    } else {
      // In freehand mode, allow cards to go to the very edges (just prevent negative values)
      const constrainedX = Math.max(0, position.x);
      const constrainedY = Math.max(0, position.y);
      
      return { x: constrainedX, y: constrainedY };
    }
  }, [sidebarCollapsed, getCardWidth, getCardHeight, isGridMode]);

  // Find nearest free position for a card
  const findNearestFreePosition = useCallback((cardId: string, desiredPosition: { x: number; y: number }) => {
    // First, constrain the desired position to boundaries
    const constrainedPosition = constrainPositionToBoundaries(desiredPosition, cardId);
    
    const cardBounds = {
      x: constrainedPosition.x,
      y: constrainedPosition.y,
      width: getCardWidth(cardId),
      height: getCardHeight(cardId),
      right: constrainedPosition.x + getCardWidth(cardId),
      bottom: constrainedPosition.y + getCardHeight(cardId)
    };

    // Check collision with all other cards
    const collidingCards = cardOrder.filter(otherCardId => 
      otherCardId !== cardId && checkCollision(cardBounds, getCardBounds(otherCardId))
    );

    if (collidingCards.length === 0) {
      return constrainedPosition;
    }

    // Try to find a nearby free position with smaller increments
    const directions = [
      { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 },
      { x: 1, y: -1 }, { x: 1, y: 1 }, { x: -1, y: -1 }, { x: -1, y: 1 }
    ];

    for (let distance = 1; distance <= 5; distance++) { // Reduced from 10 to 5
      for (const direction of directions) {
        const newPosition = {
          x: constrainedPosition.x + direction.x * distance * 10, // Fixed 10px increments instead of minGap
          y: constrainedPosition.y + direction.y * distance * 10
        };

        // Constrain the new position to boundaries
        const constrainedNewPosition = constrainPositionToBoundaries(newPosition, cardId);

        const newBounds = {
          ...cardBounds,
          x: constrainedNewPosition.x,
          y: constrainedNewPosition.y,
          right: constrainedNewPosition.x + cardBounds.width,
          bottom: constrainedNewPosition.y + cardBounds.height
        };

        const hasCollision = cardOrder.some(otherCardId => 
          otherCardId !== cardId && checkCollision(newBounds, getCardBounds(otherCardId))
        );

        if (!hasCollision) {
          return constrainedNewPosition;
        }
      }
    }

    // If no free position found, return the constrained original position
    return constrainedPosition;
  }, [cardOrder, getCardWidth, getCardHeight, getCardBounds, checkCollision, constrainPositionToBoundaries]);

  // Auto-expand canvas height based on card positions
  const updateCanvasHeight = useCallback(() => {
    if (isGridMode) return; // Only for freehand mode

    const maxBottom = Math.max(
      ...Object.keys(cardPositions).map(cardId => {
        const bounds = getCardBounds(cardId);
        return bounds ? bounds.bottom : 0;
      }),
      layoutConfig.canvas.minHeight
    );

    const newHeight = maxBottom + layoutConfig.canvas.padding + layoutConfig.freehand.autoExpandThreshold;
    setCanvasHeight(Math.max(newHeight, layoutConfig.canvas.minHeight));
  }, [isGridMode, cardPositions, getCardBounds]);

  // Update canvas height when cards change
  useEffect(() => {
    if (!isGridMode) {
      updateCanvasHeight();
    }
  }, [isGridMode, cardPositions, cardOrder, updateCanvasHeight]);

  // Calculate grid position to pixel position - memoized for performance
  const getGridPosition = useCallback((gridPos: { x: number; y: number } | undefined) => {
    if (!gridPos) {
      return { x: 0, y: 0 }; // Fallback position
    }
    const sidebarOffset = sidebarCollapsed ? 80 : 240;
    return {
      x: sidebarOffset + gridPos.x * (gridLayout.cellSize.width + gridLayout.gap),
      y: gridPos.y * (gridLayout.cellSize.height + gridLayout.gap)
    };
  }, [sidebarCollapsed, gridLayout.cellSize.width, gridLayout.cellSize.height, gridLayout.gap]);

  // Snap to grid function
  const snapToGrid = useCallback((position: { x: number; y: number }) => {
    const sidebarOffset = sidebarCollapsed ? 80 : 240;
    const adjustedX = position.x - sidebarOffset;
    
    const gridX = Math.round(adjustedX / (gridLayout.cellSize.width + gridLayout.gap));
    const gridY = Math.round(position.y / (gridLayout.cellSize.height + gridLayout.gap));
    
    return {
      x: sidebarOffset + gridX * (gridLayout.cellSize.width + gridLayout.gap),
      y: gridY * (gridLayout.cellSize.height + gridLayout.gap)
    };
  }, [sidebarCollapsed, gridLayout]);

  // Calculate alignment guides
  const calculateAlignmentGuides = useCallback((draggedCardId: string, position: { x: number; y: number }, size: { width: number; height: number }) => {
    const guides: { x?: number; y?: number }[] = [];
    const draggedCard = {
      left: position.x,
      right: position.x + size.width,
      top: position.y,
      bottom: position.y + size.height,
      centerX: position.x + size.width / 2,
      centerY: position.y + size.height / 2
    };

    cardOrder.forEach(cardId => {
      if (cardId === draggedCardId) return;
      
      const cardPos = gridPositions[cardId];
      if (!cardPos) return;
      
      const pixelPos = getGridPosition(cardPos);
      const cardWidth = getCardWidth(cardId);
      const cardHeight = getCardHeight(cardId);
      
      const card = {
        left: pixelPos.x,
        right: pixelPos.x + cardWidth,
        top: pixelPos.y,
        bottom: pixelPos.y + cardHeight,
        centerX: pixelPos.x + cardWidth / 2,
        centerY: pixelPos.y + cardHeight / 2
      };

      // Vertical alignment guides
      if (Math.abs(draggedCard.left - card.left) < snapDistance) guides.push({ x: card.left });
      if (Math.abs(draggedCard.right - card.right) < snapDistance) guides.push({ x: card.right });
      if (Math.abs(draggedCard.centerX - card.centerX) < snapDistance) guides.push({ x: card.centerX });

      // Horizontal alignment guides
      if (Math.abs(draggedCard.top - card.top) < snapDistance) guides.push({ y: card.top });
      if (Math.abs(draggedCard.bottom - card.bottom) < snapDistance) guides.push({ y: card.bottom });
      if (Math.abs(draggedCard.centerY - card.centerY) < snapDistance) guides.push({ y: card.centerY });
    });

    return guides;
  }, [cardOrder, gridPositions, getGridPosition, getCardWidth, getCardHeight, snapDistance]);

  // Apply snap and alignment
  const applySnapAndAlignment = useCallback((position: { x: number; y: number }, draggedCardId: string, size: { width: number; height: number }) => {
    const guides = calculateAlignmentGuides(draggedCardId, position, size);
    setAlignmentGuides(guides);
    
    let snappedPosition = { ...position };
    
    // Apply vertical alignment
    guides.forEach(guide => {
      if (guide.x !== undefined) {
        const draggedCard = {
          left: position.x,
          right: position.x + size.width,
          centerX: position.x + size.width / 2
        };
        
        if (Math.abs(draggedCard.left - guide.x) < snapDistance) {
          snappedPosition.x = guide.x;
        } else if (Math.abs(draggedCard.right - guide.x) < snapDistance) {
          snappedPosition.x = guide.x - size.width;
        } else if (Math.abs(draggedCard.centerX - guide.x) < snapDistance) {
          snappedPosition.x = guide.x - size.width / 2;
        }
      }
      
      if (guide.y !== undefined) {
        const draggedCard = {
          top: position.y,
          bottom: position.y + size.height,
          centerY: position.y + size.height / 2
        };
        
        if (Math.abs(draggedCard.top - guide.y) < snapDistance) {
          snappedPosition.y = guide.y;
        } else if (Math.abs(draggedCard.bottom - guide.y) < snapDistance) {
          snappedPosition.y = guide.y - size.height;
        } else if (Math.abs(draggedCard.centerY - guide.y) < snapDistance) {
          snappedPosition.y = guide.y - size.height / 2;
        }
      }
    });
    
    return snappedPosition;
  }, [calculateAlignmentGuides, snapDistance]);

  // Handle card drag start
  const handleCardDragStart = (e: React.MouseEvent, cardId: string) => {
    // Check if card is locked - if so, don't allow dragging
    if (isCardLocked(cardId)) {
      return; // Card is locked, don't allow dragging
    }

    // Check if the click is on a resize handle - if so, don't start dragging
    const target = e.target as HTMLElement;
    if (target.classList.contains('resize-handle') || target.closest('.resize-handle')) {
      return; // Let the resize handle handle this event
    }

    // Only allow dragging from the card header area (top ~60px of the card)
    const cardElement = e.currentTarget as HTMLElement;
    const cardRect = cardElement.getBoundingClientRect();
    const clickY = e.clientY - cardRect.top;
    const headerHeight = 60; // Height of the header area
    
    if (clickY > headerHeight) {
      return; // Click is below the header area, don't start dragging
    }

    e.preventDefault();
    e.stopPropagation();

    // Calculate offset from where user clicked on the card
    const clickOffsetX = e.clientX - cardRect.left;
    const clickOffsetY = e.clientY - cardRect.top;
    
    setDraggingCard(cardId);
    setDragStartPosition({ x: e.clientX, y: e.clientY });
    setDragStartGridPosition(gridPositions[cardId]);
    
    // Store the click offset for accurate dragging
    setDragOffset({ x: clickOffsetX, y: clickOffsetY });

    // Add dragging styles with hardware acceleration
    cardElement.style.cursor = 'grabbing';
    cardElement.style.zIndex = '9999';
    cardElement.style.transition = 'none';
    cardElement.style.willChange = 'transform';
    
    // Set global styles
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    
    // Immediately change header cursor to grabbing
    const headerElement = cardElement.querySelector('.card-header') as HTMLElement;
    if (headerElement) {
      headerElement.style.cursor = 'grabbing';
    }
  };

  // Handle card drag move
  const handleCardDragMove = (e: MouseEvent) => {
    if (!draggingCard || !dragStartPosition) return;

    const deltaX = e.clientX - dragStartPosition.x;
    const deltaY = e.clientY - dragStartPosition.y;

    if (isGridMode) {
      // Grid mode - use existing grid-based positioning
      if (!dragStartGridPosition) return;

    // Calculate raw position
    const rawPosition = {
      x: dragStartGridPosition.x * (gridLayout.cellSize.width + gridLayout.gap) + deltaX,
      y: dragStartGridPosition.y * (gridLayout.cellSize.height + gridLayout.gap) + deltaY
    };

    // Apply snap-to-grid and alignment guides
    const cardSize = {
      width: getCardWidth(draggingCard),
      height: getCardHeight(draggingCard)
    };
    
    const snappedPosition = applySnapAndAlignment(rawPosition, draggingCard, cardSize);
    
    // Convert back to grid coordinates
    const sidebarOffset = sidebarCollapsed ? 80 : 240;
    const adjustedX = snappedPosition.x - sidebarOffset;
    const gridX = Math.round(adjustedX / (gridLayout.cellSize.width + gridLayout.gap));
    const gridY = Math.round(snappedPosition.y / (gridLayout.cellSize.height + gridLayout.gap));

    // Constrain to grid bounds
    const constrainedX = Math.max(0, Math.min(gridX, gridLayout.columns - 1));
    const constrainedY = Math.max(0, Math.min(gridY, gridLayout.rows - 1));

      // Update position immediately for smooth performance
      setGridPositions(prev => ({
        ...prev,
        [draggingCard]: { x: constrainedX, y: constrainedY }
      }));
    } else {
      // Freehand mode - use pixel-based positioning with collision detection
      const startPos = cardPositions[draggingCard] || { x: 0, y: 0 };
      const newPosition = {
        x: startPos.x + deltaX,
        y: startPos.y + deltaY
      };

      // Constrain position to boundaries first
      const constrainedPosition = constrainPositionToBoundaries(newPosition, draggingCard);

      // Find nearest free position to avoid collisions (cards always repel each other)
      const freePosition = findNearestFreePosition(draggingCard, constrainedPosition);

      // Update position immediately for smooth performance
      setCardPositions(prev => ({
        ...prev,
        [draggingCard]: freePosition
      }));
      
      // Update canvas height if needed
      updateCanvasHeight();
    }
  };

         // Handle card drag end
   const handleCardDragEnd = () => {
     if (draggingCard) {
       
       // Save to undo stack
       saveToUndoStack();
       
       // Save the new layout based on current mode
       if (isGridMode) {
       saveLayout(cardHeights, cardWidths, cardOrder, gridPositions);
       } else {
         // For freehand mode, save both grid and freehand positions
         saveLayout(cardHeights, cardWidths, cardOrder, gridPositions);
         // Also save freehand positions to localStorage
         try {
           localStorage.setItem('dashboard-card-positions', JSON.stringify(cardPositions));
         } catch (error) {
           console.error('Error saving card positions:', error);
         }
       }
       
       // Reset dragging state
       setDraggingCard(null);
       setDragStartPosition(null);
       setDragStartGridPosition(null);
       setDragOffset({ x: 0, y: 0 });

       
       // Clear alignment guides
       setAlignmentGuides([]);
       
       // Reset styles
       document.body.style.cursor = '';
       document.body.style.userSelect = '';
       
       // Reset card cursor styles
       const cardElement = document.querySelector(`[data-card-id="${draggingCard}"]`) as HTMLElement;
       if (cardElement) {
         // Reset the main card element cursor
         cardElement.style.cursor = '';
         
         // Reset header cursor to grab
         const headerElement = cardElement.querySelector('.card-header') as HTMLElement;
         if (headerElement) {
           headerElement.style.cursor = 'grab';
         }
       }
       
       // Remove event listeners - these will be cleaned up by the useEffect
     }
   };

  // Handle card resize start
  const handleCardResizeStart = (cardId: string, direction: 'horizontal' | 'vertical' | 'both', e: React.MouseEvent) => {
    // Check if card is locked - if so, don't allow resizing
    if (isCardLocked(cardId)) {
      return; // Card is locked, don't allow resizing
    }
    
    e.stopPropagation();
    setIsResizingCard(cardId);
    setResizeDirection(direction);
    setResizeStartPosition({ x: e.clientX, y: e.clientY });
    setResizeStartSize({ width: getCardWidth(cardId), height: getCardHeight(cardId) });
  };

  // Handle card resize move
  const handleCardResizeMove = (e: MouseEvent) => {
    if (!isResizingCard || !resizeDirection) return;

    const deltaX = e.clientX - resizeStartPosition.x;
    const deltaY = e.clientY - resizeStartPosition.y;

    let newWidth = resizeStartSize.width;
    let newHeight = resizeStartSize.height;

    if (resizeDirection === 'horizontal' || resizeDirection === 'both') {
      newWidth = Math.max(200, resizeStartSize.width + deltaX);
    }
    if (resizeDirection === 'vertical' || resizeDirection === 'both') {
      newHeight = Math.max(150, resizeStartSize.height + deltaY);
    }

    // Update card dimensions immediately for smooth performance
      setCardWidths(prev => ({ ...prev, [isResizingCard]: newWidth }));
      setCardHeights(prev => ({ ...prev, [isResizingCard]: newHeight }));

    // Debounce save with longer delay to reduce frequency
    if (resizeTimeout) clearTimeout(resizeTimeout);
    const timeout = setTimeout(() => {
      saveLayout(cardHeights, cardWidths, cardOrder, gridPositions);
    }, 500); // Increased delay for better performance
    setResizeTimeout(timeout);
  };

  // Handle card resize end
  const handleCardResizeEnd = () => {
    if (isResizingCard) {
      setIsResizingCard(null);
      setResizeDirection(null);
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
        setResizeTimeout(null);
      }
      saveLayout(cardHeights, cardWidths, cardOrder, gridPositions);
    }
  };

  // Add global resize event listeners
  useEffect(() => {
    if (isResizingCard) {
      const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        handleCardResizeMove(e);
      };
      
      const handleMouseUp = () => {
        handleCardResizeEnd();
      };
      
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizingCard, resizeDirection, resizeStartPosition, resizeStartSize]);

  // Add global drag event listeners
  useEffect(() => {
    if (draggingCard) {
      const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        handleCardDragMove(e);
      };
      
      const handleMouseUp = () => {
        handleCardDragEnd();
      };
      
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingCard, dragStartPosition, dragStartGridPosition]);

  // Load and validate saved freehand positions
  useEffect(() => {
    try {
      const savedPositions = localStorage.getItem('dashboard-card-positions');
      if (savedPositions) {
        const parsedPositions = JSON.parse(savedPositions);
        // Validate and constrain saved positions to boundaries
        const validatedPositions: Record<string, { x: number; y: number }> = {};
        Object.keys(parsedPositions).forEach(cardId => {
          if (cardOrder.includes(cardId)) {
            validatedPositions[cardId] = constrainPositionToBoundaries(parsedPositions[cardId], cardId);
          }
        });
        setCardPositions(validatedPositions);
      }
    } catch (error) {
      console.error('Error loading saved card positions:', error);
    }
  }, [cardOrder, constrainPositionToBoundaries]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in input fields
      const target = e.target as HTMLElement;
      const isInputField = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.contentEditable === 'true' ||
                          target.closest('[contenteditable="true"]') ||
                          target.closest('input') ||
                          target.closest('textarea') ||
                          target.closest('[data-search-input]') ||
                          target.hasAttribute('data-search-input');
      
      // Debug logging for VeroCards
      console.log('🎯 VeroCards keyDown:', {
        key: e.key,
        target: target.tagName,
        isInputField,
        hasDataSearchInput: target.hasAttribute('data-search-input'),
        id: target.id
      });
      
      if (isInputField) {
        console.log('🚫 VeroCards BLOCKED for input field');
        return; // Don't trigger shortcuts when typing in input fields
      }

      // Undo/Redo
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          redo();
        } else if (e.key === 's') {
          e.preventDefault();
          saveLayoutToWorkspace('Auto-Save');
        } else if (e.key === 'f') {
          e.preventDefault();
          setShowSearchPalette(true);
        } else if (e.key === 'g') {
          e.preventDefault();
          setShowGroupingMenu(true);
        } else if (e.key === 'a') {
          e.preventDefault();
          setSelectedCards(new Set(cardOrder));
        }
      }
      
             // Search palette
       if (e.key === 'Escape') {
         setSelectedCards(new Set());
         setSelectionBox(null);
         setShowSearchPalette(false);
         setShowGroupingMenu(false);
         setShowExportModal(false);
         setShowAIAssistant(false);
         setShowKeyboardShortcuts(false);
       }

       // Keyboard shortcuts help
       if (e.key === '?') {
         e.preventDefault();
         setShowKeyboardShortcuts(true);
       }
      
      // Delete selected cards
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedCards.size > 0) {
          selectedCards.forEach(cardId => closeCard(cardId));
          setSelectedCards(new Set());
        }
      }

      // Enhanced Productivity Shortcuts for Freehand Mode
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            addCustomCard('dashboard-metrics');
            break;
          case '2':
            e.preventDefault();
            addCustomCard('jobs-calendar');
            break;
          case '3':
            e.preventDefault();
            addCustomCard('recent-activity');
            break;
          case '4':
            e.preventDefault();
            addCustomCard('customer-search');
            break;
          case '5':
            e.preventDefault();
            addCustomCard('quick-actions');
            break;
          case 'd':
            e.preventDefault();
            // Duplicate selected cards
            if (selectedCards.size > 0) {
              selectedCards.forEach(cardId => {
                const newCardId = `${cardId}-copy-${Date.now()}`;
                const currentPos = cardPositions[cardId];
                if (currentPos) {
                  setCardPositions(prev => ({
                    ...prev,
                    [newCardId]: { x: currentPos.x + 20, y: currentPos.y + 20 }
                  }));
                  addCustomCard('dashboard-metrics', newCardId);
                }
              });
            }
            break;
          case 'g':
            e.preventDefault();
            // Auto-arrange cards in grid
            autoArrangeCards('grid');
            break;
          case 'l':
            e.preventDefault();
            // Auto-arrange cards in list
            autoArrangeCards('list');
            break;
          case 'r':
            e.preventDefault();
            // Reset selected cards to default size
            if (selectedCards.size > 0) {
              selectedCards.forEach(cardId => {
                setCardWidths(prev => ({ ...prev, [cardId]: 280 }));
                setCardHeights(prev => ({ ...prev, [cardId]: 180 }));
              });
            }
            break;
        }
      }

      // Arrow keys for card movement (when cards are selected)
      if (selectedCards.size > 0 && !e.ctrlKey && !e.metaKey) {
        const nudgeAmount = e.shiftKey ? 10 : 1;
        let deltaX = 0, deltaY = 0;
        
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            deltaX = -nudgeAmount;
            break;
          case 'ArrowRight':
            e.preventDefault();
            deltaX = nudgeAmount;
            break;
          case 'ArrowUp':
            e.preventDefault();
            deltaY = -nudgeAmount;
            break;
          case 'ArrowDown':
            e.preventDefault();
            deltaY = nudgeAmount;
            break;
        }
        
        if (deltaX !== 0 || deltaY !== 0) {
          const newPositions = { ...gridPositions };
          selectedCards.forEach(cardId => {
            const currentPos = newPositions[cardId];
            if (currentPos) {
              newPositions[cardId] = {
                x: Math.max(0, Math.min(gridLayout.columns - 1, currentPos.x + deltaX)),
                y: Math.max(0, Math.min(gridLayout.rows - 1, currentPos.y + deltaY))
              };
            }
          });
          setGridPositions(newPositions);
          saveLayout(cardHeights, cardWidths, cardOrder, newPositions);
        }
      }

      // Arrow keys for card movement (when no cards are selected - move all cards)
      if (selectedCards.size === 0 && !e.ctrlKey && !e.metaKey) {
        const nudgeAmount = e.shiftKey ? 10 : 1;
        let deltaX = 0, deltaY = 0;
        
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            deltaX = -nudgeAmount;
            break;
          case 'ArrowRight':
            e.preventDefault();
            deltaX = nudgeAmount;
            break;
          case 'ArrowUp':
            e.preventDefault();
            deltaY = -nudgeAmount;
            break;
          case 'ArrowDown':
            e.preventDefault();
            deltaY = nudgeAmount;
            break;
        }
        
        if (deltaX !== 0 || deltaY !== 0) {
          const newPositions = { ...gridPositions };
          cardOrder.forEach(cardId => {
            const currentPos = newPositions[cardId];
            if (currentPos) {
              newPositions[cardId] = {
                x: Math.max(0, Math.min(gridLayout.columns - 1, currentPos.x + deltaX)),
                y: Math.max(0, Math.min(gridLayout.rows - 1, currentPos.y + deltaY))
              };
            }
          });
          setGridPositions(newPositions);
          saveLayout(cardHeights, cardWidths, cardOrder, newPositions);
        }
      }

      // Space bar scrolling (only when not in input fields)
      if (e.key === ' ' && !isInputField) {
        e.preventDefault();
        const scrollAmount = e.shiftKey ? -300 : 300; // Shift+Space scrolls up, Space scrolls down
        window.scrollBy({
          top: scrollAmount,
          behavior: 'smooth'
        });
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedCards, closeCard, cardOrder, gridPositions, gridLayout]);

  // Export dashboard as PNG
  const exportDashboardAsPNG = async () => {
    try {
      const dashboardElement = document.querySelector('.dashboard-container');
      if (!dashboardElement) return;
      
      // Use html2canvas or similar library for PNG export
      // For now, we'll create a simple export
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = 1920;
      canvas.height = 1080;
      ctx.fillStyle = currentTheme === 'dark' ? '#111827' : '#f9fafb';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Create download link
      const link = document.createElement('a');
      link.download = `dashboard-${currentLayout}-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error exporting dashboard:', error);
    }
  };

  // Share dashboard layout
  const shareDashboardLayout = () => {
    const layoutData = {
      cardHeights: { ...cardHeights },
      cardWidths: { ...cardWidths },
      cardOrder: [...cardOrder],
      gridPositions: { ...gridPositions },
      cardGroups: { ...cardGroups },
      timestamp: Date.now()
    };
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?layout=${encodeURIComponent(JSON.stringify(layoutData))}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Dashboard Layout',
        text: 'Check out my dashboard layout!',
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Dashboard link copied to clipboard!');
    }
  };

  // Multi-select functionality
  const handleCardSelect = useCallback((cardId: string, e: React.MouseEvent) => {
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setSelectedCards(prev => {
        const newSet = new Set(prev);
        if (newSet.has(cardId)) {
          newSet.delete(cardId);
        } else {
          newSet.add(cardId);
        }
        return newSet;
      });
    } else {
      setSelectedCards(new Set([cardId]));
    }
  }, []);

  // Search functionality
  const filteredCards = useMemo(() => {
    if (!searchQuery) return cardOrder;
    
    return cardOrder.filter(cardId => {
      const cardName = getCardDisplayName(cardId);
      return cardName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [cardOrder, searchQuery]);

  const getCardDisplayName = (cardId: string) => {
    switch (cardId) {
      case 'metrics': return 'Dashboard Metrics';
      case 'calendar': return 'Jobs Calendar';
      case 'activity': return 'Recent Activity';
      case 'quickActions': return 'Quick Actions';
      default: 
        if (cardId.startsWith('custom')) {
          const cardTypeInfo = getCardTypeInfo(cardId);
          return cardTypeInfo ? cardTypeInfo.name : 'Custom Card';
        }
        return cardId;
    }
  };

  // Quick jump to card
  const jumpToCard = (cardId: string) => {
    setSelectedCards(new Set([cardId]));
    setShowSearchPalette(false);
    setSearchQuery('');
    
    // Scroll to card if needed
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Use real data from API
  const displayJobs = jobs || [];

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Metrics data - will be populated from API
  const metrics: DashboardMetric[] = [
    {
      title: 'Total Jobs',
      value: displayJobs.length,
      change: 0,
      changeType: 'increase',
      icon: Calendar,
      color: '#3b82f6'
    },
    {
      title: 'Active Technicians',
      value: 0,
      change: 0,
      changeType: 'increase',
      icon: Users,
      color: '#10b981'
    },
    {
      title: 'Revenue',
      value: '$0',
      change: 0,
      changeType: 'increase',
      icon: TrendingUp,
      color: '#f59e0b'
    },
    {
      title: 'Customer Satisfaction',
      value: '0%',
      change: 0,
      changeType: 'increase',
      icon: Eye,
      color: '#8b5cf6'
    }
  ];

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  // Remove the old handleTabChange function since navigation is now handled by the sidebar

  if (!user) {
    return <PageLoader text="Loading dashboard..." />;
  }

  return (
         <ErrorBoundary>
               <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-1">
        {/* Enhanced Header */}
        {showHeader && (
          <Navbar 
            title="VeroPest Suite Dashboard"
            user={{ name: user.first_name || 'User', avatar: user.avatar }}
            sidebarCollapsed={sidebarCollapsed}
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
            onLogout={handleLogout}
          />
        )}

        <div className="flex">
          {/* Sidebar */}
          {/* DashboardSidebar removed as part of V4 migration */}

                    {/* Main Content */}
          <div 
            className="flex-1 transition-all duration-300"
            style={{ marginLeft: showHeader ? (sidebarCollapsed ? '6px' : '6px') : '0px' }}
          >
            <div className="max-w-7xl mx-auto px-2">
              {/* Layout Mode Indicator and Settings */}
              <div className="mb-4 flex items-start justify-between">

                {/* Dashboard Controls */}
                <div className="flex-shrink-0 flex items-center space-x-2">
                  {/* Freehand Mode Indicator */}
                  <div className="flex items-center gap-2 px-2 py-1 bg-white/60 backdrop-blur-sm rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">
                      Customizable Dashboard
                    </span>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>

                  {/* Swap Mode Indicator */}
                  {swapMode && (
                    <div className="flex items-center gap-2 px-2 py-1 bg-green-100 rounded-lg border border-green-300">
                      <span className="text-sm font-medium text-green-700">
                        Swap Mode Active
                      </span>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <button
                        onClick={cancelSwapMode}
                        className="text-xs text-green-600 hover:text-green-800 underline"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                {/* Add Card Button */}
                <button
                  onClick={() => addCustomCard('widget')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 text-sm flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Card
                </button>

                {/* Settings Dropdown */}
                <Dropdown
                  trigger={
                    <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 text-sm flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                  }
                  items={[
                    {
                      label: 'Add Custom Card',
                      icon: Plus,
                      onClick: () => addCustomCard('widget')
                    },
                    {
                      label: 'Reset Layout',
                      icon: RefreshCw,
                      onClick: resetLayout
                    },
                    {
                      label: analyticsMode ? 'Disable Analytics' : 'Enable Analytics',
                      icon: BarChart3,
                      onClick: () => setAnalyticsMode(!analyticsMode)
                    },
                    {
                      label: 'Group Cards',
                      icon: Layers,
                      onClick: () => groupCards('New Group')
                    },
                    {
                      label: 'AI Assistant',
                      icon: Zap,
                      onClick: () => setShowAIAssistant(true)
                    },
                    {
                      label: 'Search Cards',
                      icon: Filter,
                      onClick: () => setShowSearchPalette(true)
                    },
                   ]}
                 />
               </div>
             </div>

              {/* Resizable Cards Grid */}
               <div 
                 className="relative bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border-2 border-dashed border-slate-200"
                 style={{
                   minHeight: '600px',
                   height: isGridMode ? 'auto' : `${Math.max(600, canvasHeight)}px`,
                   transition: 'min-height 0.3s ease-out, height 0.3s ease-out'
                 }}
               >
                 {/* Alignment Guides - Only show in freehand mode */}
                 {!isGridMode && alignmentGuides.map((guide, index) => (
                   <div
                     key={`guide-${index}`}
                     className="absolute pointer-events-none z-50"
                     style={{
                       left: guide.x !== undefined ? guide.x : 0,
                       top: guide.y !== undefined ? guide.y : 0,
                       width: guide.x !== undefined ? '1px' : '100%',
                       height: guide.y !== undefined ? '100%' : '1px',
                       backgroundColor: '#3b82f6',
                       boxShadow: '0 0 4px rgba(59, 130, 246, 0.5)'
                     }}
                   />
                 ))}
                 
                 {/* Selection Box */}
                 {selectionBox && (
                   <div
                     className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-20 pointer-events-none z-40"
                     style={{
                       left: Math.min(selectionBox.start.x, selectionBox.end.x),
                       top: Math.min(selectionBox.start.y, selectionBox.end.y),
                       width: Math.abs(selectionBox.end.x - selectionBox.start.x),
                       height: Math.abs(selectionBox.end.y - selectionBox.start.y)
                     }}
                   />
                 )}
                 
                 {cardOrder.map((cardId) => {
                   // Get position based on current mode
                   let pixelPos;
                   if (isGridMode) {
                   const gridPos = gridPositions[cardId];
                   // Skip rendering if grid position is missing
                   if (!gridPos) {
                     console.warn(`Missing grid position for card: ${cardId}`);
                     return null;
                   }
                     pixelPos = getGridPosition(gridPos);
                   } else {
                     // Freehand mode
                     const freePos = cardPositions[cardId];
                     if (!freePos) {
                       // Initialize position if not set
                       const newPos = { x: 0, y: 0 + cardOrder.indexOf(cardId) * 50 };
                       setCardPositions(prev => ({ ...prev, [cardId]: newPos }));
                       pixelPos = newPos;
                     } else {
                       pixelPos = freePos;
                     }
                   }
                   const isDragging = draggingCard === cardId;
                   const isResizing = isResizingCard === cardId;
                   const isSelected = selectedCards.has(cardId);
               

                  return (
                    <div
                      key={cardId}
                      data-card-id={cardId}
                      className={`absolute rounded-lg shadow-lg border-2 ${
                        swapMode && swapSourceCard === cardId 
                          ? 'bg-green-50/90 backdrop-blur-sm border-green-300' 
                          : 'bg-white/90 backdrop-blur-sm border-slate-200'
                      } ${
                        isDragging ? 'cursor-grabbing shadow-2xl' : 
                        isCardLocked(cardId) ? 'cursor-not-allowed' : 'cursor-pointer'
                      } ${isResizing ? 'select-none' : ''} ${
                        isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                      } ${swapMode && swapSourceCard === cardId ? 'ring-2 ring-green-500 ring-opacity-75' : ''}`}
                       style={{
                         left: pixelPos.x,
                         top: pixelPos.y,
                         width: getCardWidth(cardId),
                         height: getCardHeight(cardId),
                         zIndex: isDragging ? 1000 : (isSelected ? 10 : 1),
                         transform: isDragging ? 'rotate(1deg) scale(1.02)' : 'none',
                         willChange: isDragging || isResizing ? 'transform, left, top, width, height' : 'auto',
                         transition: isDragging || isResizing ? 'none' : 'all 0.15s ease-out',
                       }}
                       onMouseDown={(e) => handleCardDragStart(e, cardId)}
                       onClick={(e) => handleCardSelect(cardId, e)}
                     >
                                                                                           {/* Card Header */}
                        <div 
                          className={`card-header w-full flex items-center justify-between px-2 py-1 border-b ${
                            swapMode && swapSourceCard === cardId ? 'border-green-300 bg-gradient-to-r from-green-100 to-green-200' : 'border-slate-200 bg-gradient-to-r from-slate-100 to-blue-100'
                          } rounded-t-lg min-w-full backdrop-blur-sm ${
                        !isCardLocked(cardId) ? 'cursor-grab' : ''
                          } ${swapMode && swapSourceCard === cardId ? 'ring-2 ring-green-500 ring-opacity-75' : ''}`}
                          style={{ width: '100%', minWidth: '100%' }}
                          onDoubleClick={() => handleCardSwap(cardId)}
                          title={swapMode ? "Double-click to swap with this card" : "Double-click to enter swap mode"}
                        >
                          <div className="flex items-center gap-1">
                            <GripVertical className="h-3 w-3 text-slate-500" />
                            <span className="text-xs font-medium text-slate-900">
                              {getCardDisplayName(cardId)}
                            </span>
                          </div>
                                                     <div className="flex items-center space-x-1">
                                                           {/* Change Type Button - always show for custom cards */}
                              {cardId.startsWith('custom') && (
                                <div className="flex items-center space-x-1">
                                  <Tooltip content="Change card type">
                                    <IconButton
                                      icon={Settings}
                                      size="sm"
                                      variant="default"
                                                                          onClick={() => {
                                       setShowCardTypeDropdown(showCardTypeDropdown === cardId ? null : cardId);
                                    }}
                                      className="text-blue-500 hover:text-blue-600"
                                    />
                                  </Tooltip>
                                  <button
                                    onClick={() => {
                                       setShowCardTypeDropdown(showCardTypeDropdown === cardId ? null : cardId);
                                    }}
                                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                  >
                                    Type
                                  </button>
                                </div>
                              )}
                             <Tooltip content={isCardLocked(cardId) ? "Unlock card" : "Lock card"}>
                               <IconButton
                                 icon={isCardLocked(cardId) ? Lock : Unlock}
                                 size="sm"
                                 variant="default"
                                 onClick={() => toggleCardLock(cardId)}
                                 className={isCardLocked(cardId) ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-600"}
                               />
                             </Tooltip>
                             <Tooltip content="Close card">
                               <IconButton
                                 icon={X}
                                 size="sm"
                                 variant="default"
                                 onClick={() => {
                                   closeCard(cardId);
                                 }}
                                 className="text-gray-400 hover:text-gray-600"
                               />
                             </Tooltip>
                           </div>
                        </div>

                      {/* Card Content */}
                       <div className="p-2 h-full overflow-hidden">
                        {cardId === 'metrics' && (
                          <DashboardMetrics metrics={metrics} />
                        )}
                                                 {cardId === 'calendar' && (
                           <Suspense fallback={<LoadingSpinner text="Loading calendar..." />}>
                             {jobsLoading ? (
                               <LoadingSpinner text="Loading jobs..." />
                             ) : (
                               <div className="p-4 bg-gray-100 rounded-lg">
                                 <p className="text-gray-600">Calendar component removed - using SchedulerPro instead</p>
                               </div>
                             )}
                           </Suspense>
                         )}
                                                                                                   {cardId === 'activity' && (
                            <div className="space-y-3">
                              {displayJobs.slice(0, 5).map((job: Job) => (
                                <div key={job.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                  <Avatar size="sm" fallback={job.technician?.charAt(0) || 'T'} />
                                  <div className="flex-1 min-w-0">
                                    <Typography variant="body2" className="font-medium text-gray-900 truncate">
                                      {job.title}
                                    </Typography>
                                    <Typography variant="caption" className="text-gray-500">
                                      {job.technician} • {job.status}
                                    </Typography>
                                  </div>
                                  <Chip 
                                    variant={
                                      job.status === 'completed' ? 'success' :
                                      job.status === 'in-progress' ? 'primary' :
                                      job.status === 'scheduled' ? 'default' : 'warning'
                                    }
                                  >
                                    {job.status}
                                  </Chip>
                                </div>
                              ))}
                              {displayJobs.length === 0 && (
                                <div className="text-center py-8">
                                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                                  <Typography variant="h6" className="mt-2 text-gray-900">No jobs today</Typography>
                                  <Typography variant="body2" className="text-gray-500">
                                    All caught up! No jobs scheduled for today.
                                  </Typography>
                                </div>
                              )}
                            </div>
                          )}
                                                                                                   {cardId === 'quickActions' && (
                            <div className="space-y-2">
                              <Tooltip content="Create a new job">
                                <Button
                                  variant="primary"
                                  icon={Plus}
                                  className="w-full justify-start"
                                  onClick={() => navigate('/jobs/new')}
                                >
                                  Create New Job
                                </Button>
                              </Tooltip>
                              <Tooltip content="Add a new customer">
                                <Button
                                  variant="secondary"
                                  icon={Users}
                                  className="w-full justify-start"
                                  onClick={() => navigate('/customers/new')}
                                >
                                  Add Customer
                                </Button>
                              </Tooltip>
                              <Tooltip content="View analytics and reports">
                                <Button
                                  variant="outline"
                                  icon={BarChart3}
                                  className="w-full justify-start"
                                  onClick={() => navigate('/reports')}
                                >
                                  View Reports
                                </Button>
                              </Tooltip>
                            </div>
                          )}
                                                 {cardId.startsWith('custom') && (
                           <div className="relative h-full">
                                                           {showCardTypeDropdown === cardId ? (
                               // Card Type Selection Dropdown
                                                                                               <div className="card-type-dropdown absolute inset-0 bg-gray-50 rounded-lg border-4 border-green-500 z-10">
                                  <div className="p-3 h-full flex flex-col">
                                    <div className="flex items-center justify-center mb-3">
                                      <Typography variant="h6" className="text-gray-900">Select Card Type</Typography>
                                    </div>
                                                                                                                                                 <div className="flex-1 overflow-y-auto
           [&::-webkit-scrollbar]:w-2
           [&::-webkit-scrollbar-track]:bg-gray-50
           [&::-webkit-scrollbar-thumb]:bg-purple-300
           hover:[&::-webkit-scrollbar-thumb]:bg-purple-400
           dark:[&::-webkit-scrollbar-track]:bg-gray-50
           dark:[&::-webkit-scrollbar-thumb]:bg-purple-300
           dark:hover:[&::-webkit-scrollbar-thumb]:bg-purple-400">
                                      <div className="grid grid-cols-1 gap-2">
                                     {availableCardTypes.map((cardType) => {
                                       const IconComponent = cardType.icon;
                                       return (
                                         <button
                                           key={cardType.id}
                                           onClick={() => handleCardTypeSelect(cardId, cardType.id)}
                                                                                             className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-blue-300 transition-colors text-left bg-white"
                                         >
                                                                                             <IconComponent className="h-5 w-5 text-blue-500" />
                                           <div>
                                             <Typography variant="body2" className="font-medium text-gray-900">
                                               {cardType.name}
                                             </Typography>
                                             <Typography variant="caption" className="text-gray-500">
                                               {cardType.description}
                                             </Typography>
                                           </div>
                                         </button>
                                       );
                                     })}
                                      </div>
                                   </div>
                                 </div>
                               </div>
                             ) : (
                                                               // Custom Card Content
                                                                 <div 
                                   className="h-full flex flex-col items-center justify-center overflow-hidden"
                                 >
                                  {(() => {
                                    const cardTypeInfo = getCardTypeInfo(cardId);
                                    if (cardTypeInfo) {
                                      const IconComponent = cardTypeInfo.icon;
                                      
                                                                             // Special handling for different card types
                                       switch (cardTypeInfo.id) {
                                                                                   case 'routing':
                                            return (
                                              <div className="h-full w-full p-3 overflow-hidden">
                                               {/* Routing Content */}
                                               <div className="space-y-3">
                                                 {/* Date Selector */}
                                                 <div className="flex items-center space-x-2">
                                                   <input
                                                     type="date"
                                                     value={routingDate}
                                                     onChange={(e) => setRoutingDate(e.target.value)}
                                                     className="text-sm border border-gray-300 rounded px-2 py-1"
                                                     onClick={(e) => e.stopPropagation()}
                                                   />
                                                   <Button
                                                     variant="primary"
                                                     size="sm"
                                                     onClick={() => {
                                                       const queryClient = require('@tanstack/react-query').useQueryClient();
                                                       queryClient.invalidateQueries(['routing', 'optimize', routingDate]);
                                                     }}
                                                   >
                                                     Optimize
                                                   </Button>
                                                 </div>
                                                 
                                                 {/* Loading State */}
                                                 {routingLoading && (
                                                   <div className="text-center py-4">
                                                     <LoadingSpinner text="Optimizing routes..." />
                                                   </div>
                                                 )}
                                                 
                                                 {/* Error State */}
                                                 {routingError && (
                                                   <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
                                                     Failed to load routes
                                                   </div>
                                                 )}
                                                 
                                                 {/* Routes List */}
                                                 {routingRoutes.length > 0 && (
                                                                                                    <div className="space-y-2 max-h-32 overflow-y-auto
                                                     [&::-webkit-scrollbar]:w-2
                                                     [&::-webkit-scrollbar-track]:bg-gray-50
                                                     [&::-webkit-scrollbar-thumb]:bg-purple-300
                                                     hover:[&::-webkit-scrollbar-thumb]:bg-purple-400
                                                     dark:[&::-webkit-scrollbar-track]:bg-gray-50
                                                     dark:[&::-webkit-scrollbar-thumb]:bg-purple-300
                                                     dark:hover:[&::-webkit-scrollbar-thumb]:bg-purple-400">
                                                     {routingRoutes.slice(0, 3).map((route: any, index: number) => (
                                                       <div key={route.technicianId} className="bg-gray-50 rounded p-2 text-sm">
                                                         <div className="font-medium text-gray-900">
                                                           Tech {route.technicianId}
                                                         </div>
                                                         <div className="text-gray-600">
                                                           {route.stops.length} stops • {route.totalDistance}mi
                                                         </div>
                                                       </div>
                                                     ))}
                                                     {routingRoutes.length > 3 && (
                                                       <div className="text-xs text-gray-500 text-center">
                                                         +{routingRoutes.length - 3} more routes
                                                       </div>
                                                     )}
                                                   </div>
                                                 )}
                                                 
                                                 {/* No Data State */}
                                                 {!routingLoading && !routingError && routingRoutes.length === 0 && (
                                                   <div className="text-center py-4">
                                                     <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                     <Typography variant="body2" className="text-gray-500">
                                                       No routes available
                                                     </Typography>
                                                     <Typography variant="caption" className="text-gray-400">
                                                       Click Optimize to generate routes
                                                     </Typography>
                                                   </div>
                                                 )}
                                               </div>
                                             </div>
                                           );

                                                                                   case 'dashboard-metrics':
                                            return (
                                              <div className="h-full w-full p-3 overflow-hidden">
                                               <div className="space-y-3">
                                                 <div className="grid grid-cols-2 gap-2">
                                                   {metrics.slice(0, 4).map((metric, index) => (
                                                     <div key={index} className="bg-gray-50 rounded p-2 text-center">
                                                       <Typography variant="caption" className="text-gray-600">
                                                         {metric.title}
                                                       </Typography>
                                                       <Typography variant="h6" className="text-gray-900 font-semibold">
                                                         {metric.value}
                                                       </Typography>
                                                     </div>
                                                   ))}
                                                 </div>
                                               </div>
                                             </div>
                                           );

                                         case 'jobs-calendar':
                                           return (
                                              <div className="h-full w-full p-3 overflow-hidden">
                                               <div className="space-y-3">
                                                 <div className="flex items-center justify-between">
                                                   <Typography variant="h6" className="text-gray-900">
                                                     Today's Jobs
                                                   </Typography>
                                                   <Chip variant="primary">{displayJobs.length}</Chip>
                                                 </div>
                                                 <div className="space-y-2 max-h-32 overflow-y-auto
                                                   [&::-webkit-scrollbar]:w-2
                                                   [&::-webkit-scrollbar-track]:bg-gray-50
                                                   [&::-webkit-scrollbar-thumb]:bg-purple-300
                                                   hover:[&::-webkit-scrollbar-thumb]:bg-purple-400
                                                   dark:[&::-webkit-scrollbar-track]:bg-gray-50
                                                   dark:[&::-webkit-scrollbar-thumb]:bg-purple-300
                                                   dark:hover:[&::-webkit-scrollbar-thumb]:bg-purple-400">
                                                   {displayJobs.slice(0, 3).map((job: Job) => (
                                                     <div key={job.id} className="bg-gray-50 rounded p-2 text-sm">
                                                       <div className="font-medium text-gray-900 truncate">
                                                         {job.title}
                                                       </div>
                                                       <div className="text-gray-600 text-xs">
                                                         {job.technician} • {job.status}
                                                       </div>
                                                     </div>
                                                   ))}
                                                   {displayJobs.length === 0 && (
                                                     <div className="text-center py-2 text-gray-500 text-sm">
                                                       No jobs today
                                                     </div>
                                                   )}
                                                 </div>
                                               </div>
                                             </div>
                                           );

                                         case 'recent-activity':
                                           return (
                                              <div className="h-full w-full p-3 overflow-hidden">
                                               <div className="space-y-3">
                                                 <Typography variant="h6" className="text-gray-900">
                                                   Recent Activity
                                                 </Typography>
                                                 <div className="space-y-2 max-h-32 overflow-y-auto
                                                   [&::-webkit-scrollbar]:w-2
                                                   [&::-webkit-scrollbar-track]:bg-gray-50
                                                   [&::-webkit-scrollbar-thumb]:bg-purple-300
                                                   hover:[&::-webkit-scrollbar-thumb]:bg-purple-400
                                                   dark:[&::-webkit-scrollbar-track]:bg-gray-50
                                                   dark:[&::-webkit-scrollbar-thumb]:bg-purple-300
                                                   dark:hover:[&::-webkit-scrollbar-thumb]:bg-purple-400">
                                                   {displayJobs.slice(0, 4).map((job: Job, index: number) => (
                                                     <div key={job.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                                                       <Avatar size="sm" fallback={job.technician?.charAt(0) || 'T'} />
                                                       <div className="flex-1 min-w-0">
                                                         <Typography variant="body2" className="font-medium text-gray-900 truncate">
                                                           {job.title}
                                                         </Typography>
                                                         <Typography variant="caption" className="text-gray-500">
                                                           {job.technician} • {job.status}
                                                         </Typography>
                                                       </div>
                                                     </div>
                                                   ))}
                                                 </div>
                                               </div>
                                             </div>
                                           );

                                         case 'customer-search':
                                           return (
                                              <div className="h-full w-full p-3 overflow-hidden">
                                               <div className="space-y-3">
                                                 <Typography variant="h6" className="text-gray-900">
                                                   Customer Search
                                                 </Typography>
                                                 <div className="space-y-2">
                                                   <input
                                                     type="text"
                                                     placeholder="Search customers..."
                                                     className="w-full text-sm border border-gray-300 rounded px-3 py-2"
                                                     onClick={(e) => e.stopPropagation()}
                                                   />
                                                   <Button
                                                     variant="primary"
                                                     size="sm"
                                                     className="w-full"
                                                     onClick={() => navigate('/customers')}
                                                   >
                                                     View All Customers
                                                   </Button>
                                                 </div>
                                               </div>
                                             </div>
                                           );

                                         case 'reports':
                                           return (
                                              <div className="h-full w-full p-3 overflow-hidden">
                                               <div className="space-y-3">
                                                 <Typography variant="h6" className="text-gray-900">
                                                   Reports
                                                 </Typography>
                                                 <div className="space-y-2">
                                                   <Button
                                                     variant="outline"
                                                     size="sm"
                                                     className="w-full justify-start"
                                                     onClick={() => navigate('/reports')}
                                                   >
                                                     <FileText className="h-4 w-4 mr-2" />
                                                     Generate Report
                                                   </Button>
                                                   <Button
                                                     variant="outline"
                                                     size="sm"
                                                     className="w-full justify-start"
                                                     onClick={() => navigate('/reports')}
                                                   >
                                                     <BarChart3 className="h-4 w-4 mr-2" />
                                                     View Analytics
                                                   </Button>
                                                   <Button
                                                     variant="outline"
                                                     size="sm"
                                                     className="w-full justify-start"
                                                     onClick={() => navigate('/reports')}
                                                   >
                                                     <Download className="h-4 w-4 mr-2" />
                                                     Export Data
                                                   </Button>
                                                 </div>
                                               </div>
                                             </div>
                                           );

                                         case 'dashboard-overview':
                                           return (
                                              <div className="h-full w-full p-3 overflow-hidden">
                                               <div className="space-y-3">
                                                 <Typography variant="h6" className="text-gray-900">
                                                   Dashboard Overview
                                                 </Typography>
                                                 <div className="grid grid-cols-2 gap-2 text-sm">
                                                   <div className="bg-blue-50 rounded p-2 text-center">
                                                     <div className="text-blue-600 font-medium">Jobs</div>
                                                     <div className="text-blue-900 font-bold">{displayJobs.length}</div>
                                                   </div>
                                                   <div className="bg-green-50 rounded p-2 text-center">
                                                     <div className="text-green-600 font-medium">Active</div>
                                                     <div className="text-green-900 font-bold">
                                                       {displayJobs.filter((j: Job) => j.status === 'in-progress').length}
                                                     </div>
                                                   </div>
                                                   <div className="bg-yellow-50 rounded p-2 text-center">
                                                     <div className="text-yellow-600 font-medium">Scheduled</div>
                                                     <div className="text-yellow-900 font-bold">
                                                       {displayJobs.filter((j: Job) => j.status === 'scheduled').length}
                                                     </div>
                                                   </div>
                                                   <div className="bg-purple-50 rounded p-2 text-center">
                                                     <div className="text-purple-600 font-medium">Completed</div>
                                                     <div className="text-purple-900 font-bold">
                                                       {displayJobs.filter((j: Job) => j.status === 'completed').length}
                                                     </div>
                                                   </div>
                                                 </div>
                                               </div>
                                             </div>
                                           );

                                         case 'quick-actions':
                                           return (
                                              <div className="h-full w-full p-3 overflow-hidden">
                                               <div className="space-y-3">
                                                 <Typography variant="h6" className="text-gray-900">
                                                   Quick Actions
                                                 </Typography>
                                                 <div className="space-y-2">
                                                   <Button
                                                     variant="primary"
                                                     size="sm"
                                                     className="w-full justify-start"
                                                     onClick={() => navigate('/jobs/new')}
                                                   >
                                                     <Plus className="h-4 w-4 mr-2" />
                                                     New Job
                                                   </Button>
                                                   <Button
                                                     variant="secondary"
                                                     size="sm"
                                                     className="w-full justify-start"
                                                     onClick={() => navigate('/customers/new')}
                                                   >
                                                     <Users className="h-4 w-4 mr-2" />
                                                     Add Customer
                                                   </Button>
                                                   <Button
                                                     variant="outline"
                                                     size="sm"
                                                     className="w-full justify-start"
                                                     onClick={() => navigate('/reports')}
                                                   >
                                                     <BarChart3 className="h-4 w-4 mr-2" />
                                                     View Reports
                                                   </Button>
                                                 </div>
                                               </div>
                                             </div>
                                           );

                                         case 'uploads':
                                           return (
                                              <div className="h-full w-full p-3 overflow-hidden">
                                               <div className="space-y-3">
                                                 <Typography variant="h6" className="text-gray-900">
                                                   File Uploads
                                                 </Typography>
                                                 <div className="space-y-2">
                                                   <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
                                                     <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                     <Typography variant="body2" className="text-gray-500">
                                                       Drop files here or click to upload
                                                     </Typography>
                                                   </div>
                                                   <Button
                                                     variant="outline"
                                                     size="sm"
                                                     className="w-full"
                                                     onClick={() => navigate('/uploads')}
                                                   >
                                                     View All Files
                                                   </Button>
                                                 </div>
                                               </div>
                                             </div>
                                           );

                                         case 'settings':
                                           return (
                                              <div className="h-full w-full p-3 overflow-hidden">
                                               <div className="space-y-3">
                                                 <Typography variant="h6" className="text-gray-900">
                                                   Settings
                                                 </Typography>
                                                 <div className="space-y-2">
                                                   <Button
                                                     variant="outline"
                                                     size="sm"
                                                     className="w-full justify-start"
                                                     onClick={() => navigate('/settings')}
                                                   >
                                                     <Settings className="h-4 w-4 mr-2" />
                                                     System Settings
                                                   </Button>
                                                   <Button
                                                     variant="outline"
                                                     size="sm"
                                                     className="w-full justify-start"
                                                     onClick={() => navigate('/settings')}
                                                   >
                                                     <Users className="h-4 w-4 mr-2" />
                                                     User Management
                                                   </Button>
                                                   <Button
                                                     variant="outline"
                                                     size="sm"
                                                     className="w-full justify-start"
                                                     onClick={() => navigate('/settings')}
                                                   >
                                                     <Palette className="h-4 w-4 mr-2" />
                                                     Appearance
                                                   </Button>
                                                 </div>
                                               </div>
                                             </div>
                                           );

                                         default:
                                           return (
                                             <div className="text-center">
                                               <IconComponent className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                                               <Typography variant="h6" className="text-gray-900 mb-2">
                                                 {cardTypeInfo.name}
                                               </Typography>
                                               <Typography variant="body2" className="text-gray-500 mb-4">
                                                 {cardTypeInfo.description}
                                               </Typography>
                                             </div>
                                           );
                                       }
                                    } else {
                                                                             return (
                                         <div className="text-center">
                                           <div className="text-gray-400 text-4xl mb-2">📊</div>
                                           <Typography variant="body2" className="text-gray-500 mb-2">
                                             Select a card type
                                           </Typography>
                                           <Typography variant="caption" className="text-gray-400">
                                             Use the settings button in the header
                                           </Typography>
                                         </div>
                                       );
                                    }
                                  })()}
                                </div>
                             )}
                           </div>
                         )}
                      </div>

                      {/* Resize Handles - Hidden when card is locked */}
                      {!isCardLocked(cardId) && (
                        <>
                          <div
                            className="resize-handle absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize bg-green-500"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleCardResizeStart(cardId, 'horizontal', e);
                            }}
                            style={{ opacity: 0 }}
                          />
                          <div
                            className="resize-handle absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-blue-500"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleCardResizeStart(cardId, 'vertical', e);
                            }}
                            style={{ opacity: 0 }}
                          />
                          <div
                            className="resize-handle absolute right-0 bottom-0 w-3 h-3 cursor-nwse-resize bg-red-500"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleCardResizeStart(cardId, 'both', e);
                            }}
                            style={{ opacity: 0 }}
                          />
                        </>
                      )}
                    </div>
                                       );
                   })}
                               </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Palette Modal */}
        <ReusablePopup
          isOpen={showSearchPalette}
          onClose={() => setShowSearchPalette(false)}
          title="Search Cards"
          size={{ width: 500, height: 400 }}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              autoFocus
            />
            <div className="space-y-2">
              {filteredCards.map((cardId) => (
                <button
                  key={cardId}
                  onClick={() => jumpToCard(cardId)}
                  className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors"
                >
                  {getCardDisplayName(cardId)}
                </button>
              ))}
            </div>
          </div>
        </ReusablePopup>

        {/* Grouping Menu Modal */}
        <ReusablePopup
          isOpen={showGroupingMenu}
          onClose={() => setShowGroupingMenu(false)}
          title="Group Cards"
          size={{ width: 500, height: 400 }}
        >
          <div className="space-y-4">
            {selectedCards.size > 0 ? (
              <div>
                <input
                  type="text"
                  placeholder="Enter group name..."
                  id="groupName"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  onClick={() => {
                    const groupName = (document.getElementById('groupName') as HTMLInputElement).value;
                    if (groupName) {
                      groupCards(groupName);
                      setShowGroupingMenu(false);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 mt-4"
                >
                  Create Group
                </button>
              </div>
            ) : (
              <p className="text-gray-500">Select cards first to group them</p>
            )}

            {Object.keys(cardGroups).length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Existing Groups</h4>
                {Object.entries(cardGroups).map(([groupName, cardIds]) => (
                  <div key={groupName} className="flex items-center justify-between p-2 border rounded mb-2">
                    <span>{groupName} ({cardIds.length} cards)</span>
                    <button
                      onClick={() => ungroupCards(groupName)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ReusablePopup>

        {/* AI Assistant Modal */}
        {showAIAssistant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`p-6 rounded-lg shadow-xl max-w-lg w-full mx-4 ${
              currentTheme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">AI Assistant</h3>
                <button
                  onClick={() => setShowAIAssistant(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={autoArrangeCards}
                  className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
                >
                  Auto-arrange Cards
                </button>
                
                {aiSuggestions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Suggestions</h4>
                    <ul className="space-y-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <li key={index} className="p-2 bg-gray-100 rounded text-sm">
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`p-6 rounded-lg shadow-xl max-w-md w-full mx-4 ${
              currentTheme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Export Dashboard</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={exportDashboardAsPNG}
                  className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
                >
                  Export as PNG
                </button>
                
                <button
                  onClick={shareDashboardLayout}
                  className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
                >
                  Share Layout
                </button>
                
                <div>
                  <h4 className="font-semibold mb-2">Save Workspace</h4>
                  <input
                    type="text"
                    placeholder="Workspace name..."
                    id="workspaceName"
                    className={`w-full p-3 border rounded-lg mb-2 ${
                      currentTheme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                  <button
                    onClick={() => {
                      const workspaceName = (document.getElementById('workspaceName') as HTMLInputElement).value;
                      if (workspaceName) {
                        saveLayoutToWorkspace(workspaceName);
                        setShowExportModal(false);
                      }
                    }}
                    className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600"
                  >
                    Save Workspace
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Overlay */}
        {analyticsMode && (
          <div className="fixed top-20 right-4 p-4 rounded-lg shadow-lg z-40 ${
            currentTheme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }">
            <h4 className="font-semibold mb-2">Analytics</h4>
            <div className="space-y-2 text-sm">
              <div>Total Cards: {cardOrder.length}</div>
              <div>Selected: {selectedCards.size}</div>
              <div>Groups: {Object.keys(cardGroups).length}</div>
              <div>Interactions: {Object.values(cardUsageStats).reduce((sum, stat) => sum + stat.interactions, 0)}</div>
            </div>
          </div>
        )}

                 {/* Heatmap Overlay */}
         {analyticsMode && (
           <div className="fixed inset-0 pointer-events-none z-30">
             {cardOrder.map((cardId) => {
               const heatmapValue = interactionHeatmap[cardId] || 0;
               const opacity = Math.min(heatmapValue / 10, 0.3);
               if (opacity === 0) return null;
               
               const gridPos = gridPositions[cardId];
               if (!gridPos) return null;
               
               const pixelPos = getGridPosition(gridPos);
               
               return (
                 <div
                   key={`heatmap-${cardId}`}
                   className="absolute rounded-lg"
                   style={{
                     left: pixelPos.x,
                     top: pixelPos.y,
                     width: getCardWidth(cardId),
                     height: getCardHeight(cardId),
                     backgroundColor: `rgba(255, 0, 0, ${opacity})`,
                     pointerEvents: 'none'
                   }}
                 />
               );
             })}
           </div>
         )}

         {/* Keyboard Shortcuts Help Button - Moved to top right */}
         <div className="absolute top-4 right-4 z-40">
           <button
             onClick={() => setShowKeyboardShortcuts(true)}
             className={`p-2 rounded-lg shadow-md transition-all duration-200 hover:scale-105 ${
               currentTheme === 'dark' 
                 ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600' 
                 : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
             }`}
             title="Keyboard Shortcuts (?)"
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
           </button>
         </div>

         {/* Keyboard Shortcuts Modal */}
         {showKeyboardShortcuts && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
             <div className={`p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto
               [&::-webkit-scrollbar]:w-2
               [&::-webkit-scrollbar-track]:bg-gray-50
               [&::-webkit-scrollbar-thumb]:bg-purple-300
               hover:[&::-webkit-scrollbar-thumb]:bg-purple-400
               dark:[&::-webkit-scrollbar-track]:bg-gray-50
               dark:[&::-webkit-scrollbar-thumb]:bg-purple-300
               dark:hover:[&::-webkit-scrollbar-thumb]:bg-purple-400 ${
               currentTheme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
             }`}>
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xl font-semibold">Keyboard Shortcuts</h3>
                 <button
                   onClick={() => setShowKeyboardShortcuts(false)}
                   className="text-gray-400 hover:text-gray-600"
                 >
                   <X className="h-6 w-6" />
                 </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Card Movement */}
                 <div>
                   <h4 className="font-semibold text-lg mb-3 text-blue-600">Card Movement</h4>
                   <div className="space-y-2">
                     <div className="flex justify-between items-center">
                       <span>Move selected cards</span>
                       <kbd className={`px-2 py-1 rounded text-xs ${
                         currentTheme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                       }`}>Arrow Keys</kbd>
                     </div>
                     <div className="flex justify-between items-center">
                       <span>Move all cards</span>
                       <kbd className={`px-2 py-1 rounded text-xs ${
                         currentTheme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                       }`}>Arrow Keys (no selection)</kbd>
                     </div>
                     <div className="flex justify-between items-center">
                       <span>Precise movement (10px)</span>
                       <kbd className={`px-2 py-1 rounded text-xs ${
                         currentTheme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                       }`}>Shift + Arrow Keys</kbd>
                     </div>
                   </div>
                 </div>

                 {/* Navigation */}
                 <div>
                   <h4 className="font-semibold text-lg mb-3 text-green-600">Navigation</h4>
                   <div className="space-y-2">
                     <div className="flex justify-between items-center">
                       <span>Scroll down</span>
                       <kbd className={`px-2 py-1 rounded text-xs ${
                         currentTheme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                       }`}>Space</kbd>
                     </div>
                     <div className="flex justify-between items-center">
                       <span>Scroll up</span>
                       <kbd className={`px-2 py-1 rounded text-xs ${
                         currentTheme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                       }`}>Shift + Space</kbd>
                     </div>
                     <div className="flex justify-between items-center">
                       <span>Search cards</span>
                       <kbd className={`px-2 py-1 rounded text-xs ${
                         currentTheme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                       }`}>Ctrl + F</kbd>
                     </div>
                   </div>
                 </div>

                 {/* Selection */}
                 <div>
                   <h4 className="font-semibold text-lg mb-3 text-purple-600">Selection</h4>
                   <div className="space-y-2">
                     <div className="flex justify-between items-center">
                       <span>Select all cards</span>
                       <kbd className={`px-2 py-1 rounded text-xs ${
                         currentTheme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                       }`}>Ctrl + A</kbd>
                     </div>
                     <div className="flex justify-between items-center">
                       <span>Multi-select</span>
                       <kbd className={`px-2 py-1 rounded text-xs ${
                         currentTheme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                       }`}>Shift + Click</kbd>
                     </div>
                     <div className="flex justify-between items-center">
                       <span>Clear selection</span>
                       <kbd className={`px-2 py-1 rounded text-xs ${
                         currentTheme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                       }`}>Escape</kbd>
                     </div>
                     <div className="flex justify-between items-center">
                       <span>Delete selected</span>
                       <kbd className={`px-2 py-1 rounded text-xs ${
                         currentTheme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                       }`}>Delete / Backspace</kbd>
                     </div>
                   </div>
                 </div>

                 {/* Actions */}
                 <div>
                   <h4 className="font-semibold text-lg mb-3 text-orange-600">Actions</h4>
                   <div className="space-y-2">
                     <div className="flex justify-between items-center">
                       <span>Undo</span>
                       <kbd className={`px-2 py-1 rounded text-xs ${
                         currentTheme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                       }`}>Ctrl + Z</kbd>
                     </div>
                     <div className="flex justify-between items-center">
                       <span>Redo</span>
                       <kbd className={`px-2 py-1 rounded text-xs ${
                         currentTheme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                       }`}>Ctrl + Y</kbd>
                     </div>
                     <div className="flex justify-between items-center">
                       <span>Auto-save</span>
                       <kbd className={`px-2 py-1 rounded text-xs ${
                         currentTheme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                       }`}>Ctrl + S</kbd>
                     </div>
                     <div className="flex justify-between items-center">
                       <span>Group cards</span>
                       <kbd className={`px-2 py-1 rounded text-xs ${
                         currentTheme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                       }`}>Ctrl + G</kbd>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="mt-6 pt-4 border-t border-gray-300">
                 <p className="text-sm text-gray-500">
                   💡 <strong>Tip:</strong> Use Shift + Arrow Keys for precise 10px movements, or just Arrow Keys for 1px movements.
                 </p>
               </div>
             </div>
           </div>
         )}
        
      </ErrorBoundary>
    );
  };

export default ResizableDashboard;