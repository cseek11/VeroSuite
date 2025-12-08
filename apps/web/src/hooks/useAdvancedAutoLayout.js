"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAdvancedAutoLayout = useAdvancedAutoLayout;
var react_1 = require("react");
function useAdvancedAutoLayout(_a) {
    var _this = this;
    var userId = _a.userId, currentCards = _a.currentCards, onLayoutChange = _a.onLayoutChange;
    var _b = (0, react_1.useState)([]), usagePatterns = _b[0], setUsagePatterns = _b[1];
    var _c = (0, react_1.useState)([]), cardRelationships = _c[0], setCardRelationships = _c[1];
    var _d = (0, react_1.useState)([]), layoutSuggestions = _d[0], setLayoutSuggestions = _d[1];
    var _e = (0, react_1.useState)([
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
    ]), optimizations = _e[0], setOptimizations = _e[1];
    var _f = (0, react_1.useState)(false), isLearning = _f[0], setIsLearning = _f[1];
    var _g = (0, react_1.useState)(0), learningProgress = _g[0], setLearningProgress = _g[1];
    // Track usage patterns
    var trackUsage = (0, react_1.useCallback)(function (cardId, action, duration) {
        var pattern = __assign(__assign({ id: "pattern_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9)), userId: userId, cardId: cardId, action: action, timestamp: new Date() }, (duration !== undefined ? { duration: duration } : {})), { context: {
                timeOfDay: new Date().getHours(),
                dayOfWeek: new Date().getDay(),
                screenSize: { width: window.innerWidth, height: window.innerHeight },
                otherVisibleCards: currentCards.map(function (c) { return c.id; })
            } });
        setUsagePatterns(function (prev) { return __spreadArray(__spreadArray([], prev.slice(-999), true), [pattern], false); }); // Keep last 1000 patterns
    }, [userId, currentCards]);
    // Calculate card relationships based on usage patterns
    var calculateRelationships = (0, react_1.useCallback)(function () {
        var relationships = [];
        var cardIds = __spreadArray([], new Set(usagePatterns.map(function (p) { return p.cardId; })), true);
        // Temporal correlation - cards used around the same time
        cardIds.forEach(function (cardA) {
            cardIds.forEach(function (cardB) {
                if (cardA === cardB)
                    return;
                var patternsA = usagePatterns.filter(function (p) { return p.cardId === cardA; });
                var patternsB = usagePatterns.filter(function (p) { return p.cardId === cardB; });
                var temporalStrength = 0;
                var interactionCount = 0;
                patternsA.forEach(function (patternA) {
                    var timeWindow = 2 * 60 * 60 * 1000; // 2 hours
                    var relatedPatterns = patternsB.filter(function (patternB) {
                        return Math.abs(patternA.timestamp.getTime() - patternB.timestamp.getTime()) < timeWindow;
                    });
                    if (relatedPatterns.length > 0) {
                        temporalStrength += relatedPatterns.length / patternsA.length;
                        interactionCount += relatedPatterns.length;
                    }
                });
                if (interactionCount > 0) {
                    var strength = temporalStrength / patternsA.length;
                    if (strength > 0.1) {
                        relationships.push({
                            cardA: cardA,
                            cardB: cardB,
                            strength: strength,
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
    var generateSuggestions = (0, react_1.useCallback)(function () {
        var suggestions = [];
        // Usage frequency optimization
        var usageCounts = usagePatterns.reduce(function (acc, pattern) {
            acc[pattern.cardId] = (acc[pattern.cardId] || 0) + 1;
            return acc;
        }, {});
        var frequentCards = Object.entries(usageCounts)
            .filter(function (_a) {
            var _ = _a[0], count = _a[1];
            return count >= 5;
        })
            .sort(function (_a, _b) {
            var _ = _a[0], a = _a[1];
            var __ = _b[0], b = _b[1];
            return b - a;
        })
            .slice(0, 6);
        if (frequentCards.length > 0) {
            suggestions.push({
                id: 'prioritize_frequent',
                type: 'prioritize_frequent',
                title: 'Prioritize Frequently Used Cards',
                description: "Move ".concat(frequentCards.length, " most-used cards to the top of the dashboard"),
                confidence: 0.85,
                impact: 'high',
                changes: frequentCards.map(function (_a, index) {
                    var cardId = _a[0];
                    return ({
                        cardId: cardId,
                        x: (index % 3) * 320,
                        y: Math.floor(index / 3) * 200,
                        width: 300,
                        height: 180,
                        reason: 'Frequently used card'
                    });
                })
            });
        }
        // Functional grouping
        var cardTypes = __spreadArray([], new Set(currentCards.map(function (c) { return c.type; })), true);
        var typeGroups = cardTypes.map(function (type) { return ({
            type: type,
            cards: currentCards.filter(function (c) { return c.type === type; })
        }); }).filter(function (group) { return group.cards.length > 1; });
        typeGroups.forEach(function (group, groupIndex) {
            if (group.cards.length >= 2) {
                suggestions.push({
                    id: "group_".concat(group.type),
                    type: 'group_related',
                    title: "Group ".concat(group.type, " Cards"),
                    description: "Arrange ".concat(group.cards.length, " ").concat(group.type, " cards together for better workflow"),
                    confidence: 0.75,
                    impact: 'medium',
                    changes: group.cards.map(function (card, index) { return ({
                        cardId: card.id,
                        x: groupIndex * 350 + (index % 2) * 300,
                        y: 400 + Math.floor(index / 2) * 200,
                        width: card.width,
                        height: card.height,
                        reason: "Group with other ".concat(group.type, " cards")
                    }); })
                });
            }
        });
        // Temporal correlation grouping
        var strongRelationships = cardRelationships.filter(function (r) { return r.strength > 0.3; });
        if (strongRelationships.length > 0) {
            var groupedCards_1 = new Set();
            var groups_1 = [];
            strongRelationships.forEach(function (rel) {
                if (!groupedCards_1.has(rel.cardA) && !groupedCards_1.has(rel.cardB)) {
                    groups_1.push([rel.cardA, rel.cardB]);
                    groupedCards_1.add(rel.cardA);
                    groupedCards_1.add(rel.cardB);
                }
            });
            groups_1.forEach(function (group, index) {
                suggestions.push({
                    id: "temporal_group_".concat(index),
                    type: 'group_related',
                    title: 'Group Related Cards',
                    description: "Cards ".concat(group.join(', '), " are often used together"),
                    confidence: 0.8,
                    impact: 'medium',
                    changes: group.map(function (cardId, cardIndex) { return ({
                        cardId: cardId,
                        x: 600 + (index * 350) + (cardIndex % 2) * 300,
                        y: 200 + Math.floor(cardIndex / 2) * 200,
                        width: 280,
                        height: 160,
                        reason: 'Often used together'
                    }); })
                });
            });
        }
        // Spatial optimization
        var overlappingCards = currentCards.filter(function (cardA) {
            return currentCards.some(function (cardB) {
                return cardA.id !== cardB.id &&
                    cardA.x < cardB.x + cardB.width &&
                    cardA.x + cardA.width > cardB.x &&
                    cardA.y < cardB.y + cardB.height &&
                    cardA.y + cardA.height > cardB.y;
            });
        });
        if (overlappingCards.length > 0) {
            suggestions.push({
                id: 'optimize_spacing',
                type: 'optimize_spacing',
                title: 'Fix Overlapping Cards',
                description: "Resolve ".concat(overlappingCards.length, " overlapping card positions"),
                confidence: 0.95,
                impact: 'high',
                changes: overlappingCards.map(function (card, index) { return ({
                    cardId: card.id,
                    x: (index % 4) * 320,
                    y: Math.floor(index / 4) * 200 + 600,
                    width: card.width,
                    height: card.height,
                    reason: 'Resolve overlap'
                }); })
            });
        }
        setLayoutSuggestions(suggestions);
    }, [usagePatterns, currentCards, cardRelationships]);
    // Apply layout optimization
    var applyOptimization = (0, react_1.useCallback)(function (suggestionId) {
        var suggestion = layoutSuggestions.find(function (s) { return s.id === suggestionId; });
        if (!suggestion)
            return;
        onLayoutChange === null || onLayoutChange === void 0 ? void 0 : onLayoutChange(suggestion.changes);
        // Track the optimization application
        trackUsage('system', 'interact', 0);
        // Remove the applied suggestion
        setLayoutSuggestions(function (prev) { return prev.filter(function (s) { return s.id !== suggestionId; }); });
    }, [layoutSuggestions, onLayoutChange, trackUsage]);
    // Auto-arrange based on learned patterns
    var autoArrange = (0, react_1.useCallback)(function (mode) {
        if (mode === void 0) { mode = 'smart'; }
        if (mode === 'smart') {
            var changes = layoutSuggestions
                .filter(function (s) { return s.confidence > 0.7; })
                .flatMap(function (s) { return s.changes; })
                .reduce(function (acc, change) {
                var existing = acc.find(function (c) { return c.cardId === change.cardId; });
                if (existing) {
                    // Use the change with higher confidence
                    return acc.map(function (c) { return c.cardId === change.cardId ? change : c; });
                }
                return __spreadArray(__spreadArray([], acc, true), [change], false);
            }, []);
            if (changes.length > 0) {
                onLayoutChange === null || onLayoutChange === void 0 ? void 0 : onLayoutChange(changes);
            }
        }
        else {
            // Fallback to simple grid arrangement
            var changes = currentCards.map(function (card, index) { return ({
                cardId: card.id,
                x: (index % 4) * 320,
                y: Math.floor(index / 4) * 200,
                width: card.width,
                height: card.height,
                reason: "".concat(mode, " arrangement")
            }); });
            onLayoutChange === null || onLayoutChange === void 0 ? void 0 : onLayoutChange(changes);
        }
    }, [layoutSuggestions, currentCards, onLayoutChange]);
    // Learn from user behavior
    var learnFromBehavior = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var steps, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLearning(true);
                    setLearningProgress(0);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 6, 7]);
                    steps = [
                        'Analyzing usage patterns...',
                        'Calculating card relationships...',
                        'Generating layout suggestions...',
                        'Optimizing recommendations...'
                    ];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < steps.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 3:
                    _a.sent();
                    setLearningProgress((i + 1) / steps.length * 100);
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    calculateRelationships();
                    generateSuggestions();
                    return [3 /*break*/, 7];
                case 6:
                    setIsLearning(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); }, [calculateRelationships, generateSuggestions]);
    // Get card usage statistics
    var getCardUsageStats = (0, react_1.useCallback)(function (cardId) {
        var _a, _b;
        var patterns = usagePatterns.filter(function (p) { return p.cardId === cardId; });
        var totalUsage = patterns.length;
        var avgDuration = patterns
            .filter(function (p) { return p.duration; })
            .reduce(function (sum, p) { return sum + (p.duration || 0); }, 0) / patterns.filter(function (p) { return p.duration; }).length;
        var timeDistribution = patterns.reduce(function (acc, p) {
            var hour = p.timestamp.getHours();
            var period = hour < 6 ? 'night' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
            acc[period] = (acc[period] || 0) + 1;
            return acc;
        }, {});
        return {
            totalUsage: totalUsage,
            avgDuration: avgDuration,
            timeDistribution: timeDistribution,
            lastUsed: patterns.length > 0 ? ((_b = (_a = patterns[patterns.length - 1]) === null || _a === void 0 ? void 0 : _a.timestamp) !== null && _b !== void 0 ? _b : null) : null
        };
    }, [usagePatterns]);
    // Get layout insights
    var getLayoutInsights = (0, react_1.useMemo)(function () {
        var totalPatterns = usagePatterns.length;
        var uniqueCards = new Set(usagePatterns.map(function (p) { return p.cardId; })).size;
        var avgUsagePerCard = totalPatterns / uniqueCards;
        var mostUsedCard = usagePatterns.reduce(function (acc, p) {
            acc[p.cardId] = (acc[p.cardId] || 0) + 1;
            return acc;
        }, {});
        var topCard = Object.entries(mostUsedCard)
            .sort(function (_a, _b) {
            var _ = _a[0], a = _a[1];
            var __ = _b[0], b = _b[1];
            return b - a;
        })[0];
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
    (0, react_1.useEffect)(function () {
        if (usagePatterns.length > 10) {
            calculateRelationships();
        }
    }, [usagePatterns, calculateRelationships]);
    (0, react_1.useEffect)(function () {
        if (cardRelationships.length > 0) {
            generateSuggestions();
        }
    }, [cardRelationships, generateSuggestions]);
    return {
        // State
        usagePatterns: usagePatterns,
        cardRelationships: cardRelationships,
        layoutSuggestions: layoutSuggestions,
        optimizations: optimizations,
        isLearning: isLearning,
        learningProgress: learningProgress,
        layoutInsights: getLayoutInsights,
        // Actions
        trackUsage: trackUsage,
        applyOptimization: applyOptimization,
        autoArrange: autoArrange,
        learnFromBehavior: learnFromBehavior,
        getCardUsageStats: getCardUsageStats,
        // Optimization management
        updateOptimization: function (id, updates) {
            setOptimizations(function (prev) { return prev.map(function (opt) {
                return opt.id === id ? __assign(__assign({}, opt), updates) : opt;
            }); });
        },
        // Data export
        exportUsageData: function () {
            var data = {
                usagePatterns: usagePatterns,
                cardRelationships: cardRelationships,
                layoutInsights: getLayoutInsights,
                exportedAt: new Date().toISOString()
            };
            var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "layout_usage_data_".concat(new Date().toISOString().split('T')[0], ".json");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };
}
