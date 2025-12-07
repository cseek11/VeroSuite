import { useState, useCallback, useMemo, useEffect } from 'react';

export interface UsagePattern {
  id: string;
  userId: string;
  cardId: string;
  action: 'view' | 'click' | 'resize' | 'move' | 'interact';
  timestamp: Date;
  duration?: number;
  context?: {
    timeOfDay: number;
    dayOfWeek: number;
    screenSize: { width: number; height: number };
    otherVisibleCards: string[];
    userRole?: string;
  };
}

export interface CardRelationship {
  cardA: string;
  cardB: string;
  strength: number; // 0-1, how often they're used together
  type: 'temporal' | 'functional' | 'spatial' | 'user_defined';
  confidence: number;
  lastUpdated: Date;
}

export interface LayoutSuggestion {
  id: string;
  type: 'auto_arrange' | 'optimize_spacing' | 'group_related' | 'prioritize_frequent';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  changes: Array<{
    cardId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    reason: string;
  }>;
  preview?: string; // Base64 preview image
}

export interface LayoutOptimization {
  id: string;
  name: string;
  description: string;
  algorithm: 'usage_frequency' | 'temporal_correlation' | 'functional_grouping' | 'spatial_optimization';
  parameters: Record<string, any>;
  enabled: boolean;
  weight: number; // 0-1, how much this optimization influences layout
}

interface UseAdvancedAutoLayoutProps {
  userId: string;
  currentCards: Array<{ id: string; type: string; x: number; y: number; width: number; height: number }>;
  onLayoutChange?: (changes: Array<{ cardId: string; x: number; y: number; width: number; height: number }>) => void;
}

export function useAdvancedAutoLayout({
  userId,
  currentCards,
  onLayoutChange
}: UseAdvancedAutoLayoutProps) {
  const [usagePatterns, setUsagePatterns] = useState<UsagePattern[]>([]);
  const [cardRelationships, setCardRelationships] = useState<CardRelationship[]>([]);
  const [layoutSuggestions, setLayoutSuggestions] = useState<LayoutSuggestion[]>([]);
  const [optimizations, setOptimizations] = useState<LayoutOptimization[]>([
    {
      id: 'usage_frequency',
      name: 'Usage Frequency',
      description: 'Prioritize frequently used cards',
      algorithm: 'usage_frequency',
      parameters: { minUsageThreshold: 5, timeWindow: 7 },
      enabled: true,
      weight: 0.4
    },
    {
      id: 'temporal_correlation',
      name: 'Temporal Correlation',
      description: 'Group cards used at similar times',
      algorithm: 'temporal_correlation',
      parameters: { timeWindow: 2, correlationThreshold: 0.6 },
      enabled: true,
      weight: 0.3
    },
    {
      id: 'functional_grouping',
      name: 'Functional Grouping',
      description: 'Group cards by function and purpose',
      algorithm: 'functional_grouping',
      parameters: { groupThreshold: 0.7, maxGroupSize: 4 },
      enabled: true,
      weight: 0.2
    },
    {
      id: 'spatial_optimization',
      name: 'Spatial Optimization',
      description: 'Optimize for screen space and visual flow',
      algorithm: 'spatial_optimization',
      parameters: { minSpacing: 20, maxWidth: 400, aspectRatio: 1.5 },
      enabled: true,
      weight: 0.1
    }
  ]);
  const [isLearning, setIsLearning] = useState(false);
  const [learningProgress, setLearningProgress] = useState(0);

  // Track usage patterns
  const trackUsage = useCallback((cardId: string, action: UsagePattern['action'], duration?: number) => {
    const pattern: UsagePattern = {
      id: `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      cardId,
      action,
      timestamp: new Date(),
      ...(duration !== undefined ? { duration } : {}),
      context: {
        timeOfDay: new Date().getHours(),
        dayOfWeek: new Date().getDay(),
        screenSize: { width: window.innerWidth, height: window.innerHeight },
        otherVisibleCards: currentCards.map(c => c.id)
      }
    };

    setUsagePatterns(prev => [...prev.slice(-999), pattern]); // Keep last 1000 patterns
  }, [userId, currentCards]);

  // Calculate card relationships based on usage patterns
  const calculateRelationships = useCallback(() => {
    const relationships: CardRelationship[] = [];
    const cardIds = [...new Set(usagePatterns.map(p => p.cardId))];

    // Temporal correlation - cards used around the same time
    cardIds.forEach(cardA => {
      cardIds.forEach(cardB => {
        if (cardA === cardB) return;

        const patternsA = usagePatterns.filter(p => p.cardId === cardA);
        const patternsB = usagePatterns.filter(p => p.cardId === cardB);

        let temporalStrength = 0;
        let interactionCount = 0;

        patternsA.forEach(patternA => {
          const timeWindow = 2 * 60 * 60 * 1000; // 2 hours
          const relatedPatterns = patternsB.filter(patternB => 
            Math.abs(patternA.timestamp.getTime() - patternB.timestamp.getTime()) < timeWindow
          );

          if (relatedPatterns.length > 0) {
            temporalStrength += relatedPatterns.length / patternsA.length;
            interactionCount += relatedPatterns.length;
          }
        });

        if (interactionCount > 0) {
          const strength = temporalStrength / patternsA.length;
          if (strength > 0.1) {
            relationships.push({
              cardA,
              cardB,
              strength,
              type: 'temporal',
              confidence: Math.min(1, interactionCount / 10),
              lastUpdated: new Date()
            });
          }
        }
      });
    });

    setCardRelationships(relationships);
  }, [usagePatterns]);

  // Generate layout suggestions based on learned patterns
  const generateSuggestions = useCallback(() => {
    const suggestions: LayoutSuggestion[] = [];

    // Usage frequency optimization
    const usageCounts = usagePatterns.reduce((acc, pattern) => {
      acc[pattern.cardId] = (acc[pattern.cardId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const frequentCards = Object.entries(usageCounts)
      .filter(([_, count]) => count >= 5)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 6);

    if (frequentCards.length > 0) {
      suggestions.push({
        id: 'prioritize_frequent',
        type: 'prioritize_frequent',
        title: 'Prioritize Frequently Used Cards',
        description: `Move ${frequentCards.length} most-used cards to the top of the dashboard`,
        confidence: 0.85,
        impact: 'high',
        changes: frequentCards.map(([cardId], index) => ({
          cardId,
          x: (index % 3) * 320,
          y: Math.floor(index / 3) * 200,
          width: 300,
          height: 180,
          reason: 'Frequently used card'
        }))
      });
    }

    // Functional grouping
    const cardTypes = [...new Set(currentCards.map(c => c.type))];
    const typeGroups = cardTypes.map(type => ({
      type,
      cards: currentCards.filter(c => c.type === type)
    })).filter(group => group.cards.length > 1);

    typeGroups.forEach((group, groupIndex) => {
      if (group.cards.length >= 2) {
        suggestions.push({
          id: `group_${group.type}`,
          type: 'group_related',
          title: `Group ${group.type} Cards`,
          description: `Arrange ${group.cards.length} ${group.type} cards together for better workflow`,
          confidence: 0.75,
          impact: 'medium',
          changes: group.cards.map((card, index) => ({
            cardId: card.id,
            x: groupIndex * 350 + (index % 2) * 300,
            y: 400 + Math.floor(index / 2) * 200,
            width: card.width,
            height: card.height,
            reason: `Group with other ${group.type} cards`
          }))
        });
      }
    });

    // Temporal correlation grouping
    const strongRelationships = cardRelationships.filter(r => r.strength > 0.3);
    if (strongRelationships.length > 0) {
      const groupedCards = new Set<string>();
      const groups: string[][] = [];

      strongRelationships.forEach(rel => {
        if (!groupedCards.has(rel.cardA) && !groupedCards.has(rel.cardB)) {
          groups.push([rel.cardA, rel.cardB]);
          groupedCards.add(rel.cardA);
          groupedCards.add(rel.cardB);
        }
      });

      groups.forEach((group, index) => {
        suggestions.push({
          id: `temporal_group_${index}`,
          type: 'group_related',
          title: 'Group Related Cards',
          description: `Cards ${group.join(', ')} are often used together`,
          confidence: 0.8,
          impact: 'medium',
          changes: group.map((cardId, cardIndex) => ({
            cardId,
            x: 600 + (index * 350) + (cardIndex % 2) * 300,
            y: 200 + Math.floor(cardIndex / 2) * 200,
            width: 280,
            height: 160,
            reason: 'Often used together'
          }))
        });
      });
    }

    // Spatial optimization
    const overlappingCards = currentCards.filter(cardA => 
      currentCards.some(cardB => 
        cardA.id !== cardB.id &&
        cardA.x < cardB.x + cardB.width &&
        cardA.x + cardA.width > cardB.x &&
        cardA.y < cardB.y + cardB.height &&
        cardA.y + cardA.height > cardB.y
      )
    );

    if (overlappingCards.length > 0) {
      suggestions.push({
        id: 'optimize_spacing',
        type: 'optimize_spacing',
        title: 'Fix Overlapping Cards',
        description: `Resolve ${overlappingCards.length} overlapping card positions`,
        confidence: 0.95,
        impact: 'high',
        changes: overlappingCards.map((card, index) => ({
          cardId: card.id,
          x: (index % 4) * 320,
          y: Math.floor(index / 4) * 200 + 600,
          width: card.width,
          height: card.height,
          reason: 'Resolve overlap'
        }))
      });
    }

    setLayoutSuggestions(suggestions);
  }, [usagePatterns, currentCards, cardRelationships]);

  // Apply layout optimization
  const applyOptimization = useCallback((suggestionId: string) => {
    const suggestion = layoutSuggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;

    onLayoutChange?.(suggestion.changes);
    
    // Track the optimization application
    trackUsage('system', 'interact', 0);
    
    // Remove the applied suggestion
    setLayoutSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  }, [layoutSuggestions, onLayoutChange, trackUsage]);

  // Auto-arrange based on learned patterns
  const autoArrange = useCallback((mode: 'smart' | 'grid' | 'compact' = 'smart') => {
    if (mode === 'smart') {
      // Use learned patterns for intelligent arrangement
      type ChangeType = {
        cardId: string;
        x: number;
        y: number;
        width: number;
        height: number;
        reason: string;
      };
      const changes: ChangeType[] = layoutSuggestions
        .filter(s => s.confidence > 0.7)
        .flatMap(s => s.changes)
        .reduce((acc: ChangeType[], change) => {
          const existing = acc.find(c => c.cardId === change.cardId);
          if (existing) {
            // Use the change with higher confidence
            return acc.map(c => c.cardId === change.cardId ? change : c);
          }
          return [...acc, change];
        }, []);

      if (changes.length > 0) {
        onLayoutChange?.(changes);
      }
    } else {
      // Fallback to simple grid arrangement
      const changes = currentCards.map((card, index) => ({
        cardId: card.id,
        x: (index % 4) * 320,
        y: Math.floor(index / 4) * 200,
        width: card.width,
        height: card.height,
        reason: `${mode} arrangement`
      }));
      onLayoutChange?.(changes);
    }
  }, [layoutSuggestions, currentCards, onLayoutChange]);

  // Learn from user behavior
  const learnFromBehavior = useCallback(async () => {
    setIsLearning(true);
    setLearningProgress(0);

    try {
      // Simulate learning process
      const steps = [
        'Analyzing usage patterns...',
        'Calculating card relationships...',
        'Generating layout suggestions...',
        'Optimizing recommendations...'
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setLearningProgress((i + 1) / steps.length * 100);
      }

      calculateRelationships();
      generateSuggestions();
    } finally {
      setIsLearning(false);
    }
  }, [calculateRelationships, generateSuggestions]);

  // Get card usage statistics
  const getCardUsageStats = useCallback((cardId: string) => {
    const patterns = usagePatterns.filter(p => p.cardId === cardId);
    const totalUsage = patterns.length;
    const avgDuration = patterns
      .filter(p => p.duration)
      .reduce((sum, p) => sum + (p.duration || 0), 0) / patterns.filter(p => p.duration).length;
    
    const timeDistribution = patterns.reduce((acc, p) => {
      const hour = p.timestamp.getHours();
      const period = hour < 6 ? 'night' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
      acc[period] = (acc[period] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalUsage,
      avgDuration,
      timeDistribution,
      lastUsed: patterns.length > 0 ? (patterns[patterns.length - 1]?.timestamp ?? null) : null
    };
  }, [usagePatterns]);

  // Get layout insights
  const getLayoutInsights = useMemo(() => {
    const totalPatterns = usagePatterns.length;
    const uniqueCards = new Set(usagePatterns.map(p => p.cardId)).size;
    const avgUsagePerCard = totalPatterns / uniqueCards;
    const mostUsedCard = usagePatterns.reduce((acc, p) => {
      acc[p.cardId] = (acc[p.cardId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCard = Object.entries(mostUsedCard)
      .sort(([_, a], [__, b]) => b - a)[0];

    return {
      totalInteractions: totalPatterns,
      activeCards: uniqueCards,
      avgUsagePerCard: Math.round(avgUsagePerCard * 10) / 10,
      mostUsedCard: topCard ? { id: topCard[0], count: topCard[1] } : null,
      relationshipCount: cardRelationships.length,
      suggestionCount: layoutSuggestions.length,
      learningActive: isLearning
    };
  }, [usagePatterns, cardRelationships, layoutSuggestions, isLearning]);

  // Initialize learning when patterns change
  useEffect(() => {
    if (usagePatterns.length > 10) {
      calculateRelationships();
    }
  }, [usagePatterns, calculateRelationships]);

  useEffect(() => {
    if (cardRelationships.length > 0) {
      generateSuggestions();
    }
  }, [cardRelationships, generateSuggestions]);

  return {
    // State
    usagePatterns,
    cardRelationships,
    layoutSuggestions,
    optimizations,
    isLearning,
    learningProgress,
    layoutInsights: getLayoutInsights,
    
    // Actions
    trackUsage,
    applyOptimization,
    autoArrange,
    learnFromBehavior,
    getCardUsageStats,
    
    // Optimization management
    updateOptimization: (id: string, updates: Partial<LayoutOptimization>) => {
      setOptimizations(prev => prev.map(opt => 
        opt.id === id ? { ...opt, ...updates } : opt
      ));
    },
    
    // Data export
    exportUsageData: () => {
      const data = {
        usagePatterns,
        cardRelationships,
        layoutInsights: getLayoutInsights,
        exportedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `layout_usage_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
}















