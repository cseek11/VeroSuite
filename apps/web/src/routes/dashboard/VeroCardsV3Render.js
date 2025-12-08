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
exports.useVeroCardsRender = void 0;
var react_1 = require("react");
var constants_1 = require("./utils/constants");
var renderHelpers_1 = require("./utils/renderHelpers");
var cardHelpers_1 = require("./utils/cardHelpers");
var constants_2 = require("./utils/constants");
var useVeroCardsRender = function (props) {
    var layout = props.layout, dashboardState = props.dashboardState, modalManagement = props.modalManagement, serverPersistence = props.serverPersistence, kpiData = props.kpiData, setKpiData = props.setKpiData, processedKpisRef = props.processedKpisRef, userKpis = props.userKpis, userKpisStatus = props.userKpisStatus, isUserKpisLoading = props.isUserKpisLoading, isUserKpisError = props.isUserKpisError, cardTypes = props.cardTypes;
    // Track current kpiData in a ref to avoid dependency issues
    var kpiDataRef = (0, react_1.useRef)(kpiData);
    var hasProcessedUserKpisRef = (0, react_1.useRef)(false);
    var lastUserKpisLengthRef = (0, react_1.useRef)(0);
    var layoutCardsRef = (0, react_1.useRef)(layout.cards);
    var lastKpiDisplayCardCountRef = (0, react_1.useRef)(0);
    var hasClearedEmptyKpisRef = (0, react_1.useRef)(false);
    // Keep refs in sync with state
    (0, react_1.useEffect)(function () {
        kpiDataRef.current = kpiData;
    }, [kpiData]);
    // Track layout.cards changes by counting KPI display cards (more stable than object reference)
    (0, react_1.useEffect)(function () {
        layoutCardsRef.current = layout.cards;
        var kpiDisplayCardCount = Object.values(layout.cards).filter(function (c) { return c.type === 'kpi-display'; }).length;
        lastKpiDisplayCardCountRef.current = kpiDisplayCardCount;
    }, [layout.cards]);
    // Rehydrate KPI data only if server failed to load
    (0, react_1.useEffect)(function () {
        if (serverPersistence.serverLoadSucceeded)
            return;
        try {
            var raw = localStorage.getItem('vero_kpi_data_v1');
            if (raw) {
                var parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object') {
                    setKpiData(parsed);
                    Object.values(parsed).forEach(function (entry) {
                        if (entry && entry.id) {
                            processedKpisRef.current.add(entry.id);
                        }
                    });
                }
            }
        }
        catch (_e) { /* noop */ }
    }, [serverPersistence.serverLoadSucceeded, setKpiData]);
    // Load user KPIs into kpiData state when they become available
    (0, react_1.useEffect)(function () {
        if (isUserKpisLoading || isUserKpisError) {
            return;
        }
        // Reset processing flag if userKpis array length changed (new KPIs added/removed)
        var currentUserKpisLength = (userKpis === null || userKpis === void 0 ? void 0 : userKpis.length) || 0;
        if (currentUserKpisLength !== lastUserKpisLengthRef.current) {
            hasProcessedUserKpisRef.current = false;
            lastUserKpisLengthRef.current = currentUserKpisLength;
        }
        // Use ref to access layout.cards to avoid dependency on object reference
        var currentCards = layoutCardsRef.current;
        var existingKpiDisplayCards = Object.values(currentCards).filter(function (c) { return c.type === 'kpi-display'; });
        var currentKpiDisplayCardCount = existingKpiDisplayCards.length;
        // Reset processing flag if KPI display card count changed
        if (currentKpiDisplayCardCount !== lastKpiDisplayCardCountRef.current) {
            hasProcessedUserKpisRef.current = false;
            lastKpiDisplayCardCountRef.current = currentKpiDisplayCardCount;
        }
        if (userKpis && userKpis.length > 0) {
            var hasExistingKpiData = Object.keys(kpiDataRef.current).length > 0;
            // If we've already processed these KPIs and data exists, don't process again
            if (hasProcessedUserKpisRef.current && hasExistingKpiData) {
                return;
            }
            if (existingKpiDisplayCards.length > 0 && !hasExistingKpiData) {
                var sortedCards = __spreadArray([], existingKpiDisplayCards, true).sort(function (a, b) { return a.id.localeCompare(b.id); });
                var mapped_1 = {};
                sortedCards.forEach(function (card, index) {
                    var kpi = userKpis[index % userKpis.length];
                    var display = (0, cardHelpers_1.normalizeKpiForDisplay)(kpi);
                    mapped_1[card.id] = display;
                    if (display.id) {
                        processedKpisRef.current.add(display.id);
                    }
                });
                hasProcessedUserKpisRef.current = true;
                setKpiData(mapped_1);
                return;
            }
            if (existingKpiDisplayCards.length > 0 || hasExistingKpiData) {
                hasProcessedUserKpisRef.current = true;
                return;
            }
            var unprocessedKpis_1 = userKpis.filter(function (kpi) { return !processedKpisRef.current.has(kpi.id); });
            if (unprocessedKpis_1.length === 0) {
                hasProcessedUserKpisRef.current = true;
                return;
            }
            if (!constants_2.AUTO_CREATE_FROM_USER_KPIS) {
                hasProcessedUserKpisRef.current = true;
                return;
            }
            // Process unprocessed KPIs asynchronously
            (function () { return __awaiter(void 0, void 0, void 0, function () {
                var _loop_1, _i, unprocessedKpis_2, kpi;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _loop_1 = function (kpi) {
                                var cardId, kpiDisplayData;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, serverPersistence.addCard('kpi-display', { x: 0, y: 0 })];
                                        case 1:
                                            cardId = _b.sent();
                                            kpiDisplayData = {
                                                id: kpi.id,
                                                name: kpi.name,
                                                description: kpi.description || 'User-defined KPI',
                                                category: kpi.category || 'operational',
                                                formula_expression: kpi.formula_expression,
                                                formula_fields: kpi.formula_fields || [],
                                                threshold_config: kpi.threshold_config || {},
                                                chart_config: kpi.chart_config || { type: 'number' },
                                                data_source_config: kpi.data_source_config || {},
                                                tags: kpi.tags || [],
                                                is_active: kpi.is_active,
                                                created_at: kpi.created_at,
                                                template_id: kpi.template_id,
                                                user_id: kpi.user_id,
                                                tenant_id: kpi.tenant_id,
                                                enabled: kpi.is_active !== false,
                                                realTime: false,
                                                threshold: kpi.threshold_config || { green: 80, yellow: 60, unit: '%' },
                                                chart: kpi.chart_config || { type: 'line' }
                                            };
                                            setKpiData(function (prev) {
                                                var _a;
                                                return (__assign(__assign({}, prev), (_a = {}, _a[cardId] = kpiDisplayData, _a)));
                                            });
                                            processedKpisRef.current.add(kpi.id);
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            _i = 0, unprocessedKpis_2 = unprocessedKpis_1;
                            _a.label = 1;
                        case 1:
                            if (!(_i < unprocessedKpis_2.length)) return [3 /*break*/, 4];
                            kpi = unprocessedKpis_2[_i];
                            return [5 /*yield**/, _loop_1(kpi)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            hasProcessedUserKpisRef.current = true;
                            return [2 /*return*/];
                    }
                });
            }); })();
        }
        else if (userKpisStatus === 'success' && Array.isArray(userKpis) && userKpis.length === 0) {
            // Only clear once to prevent infinite loops
            if (!hasClearedEmptyKpisRef.current) {
                hasClearedEmptyKpisRef.current = true;
                setKpiData({});
                processedKpisRef.current.clear();
                hasProcessedUserKpisRef.current = false;
                lastUserKpisLengthRef.current = 0;
                lastKpiDisplayCardCountRef.current = 0;
            }
        }
        else {
            // Reset the cleared flag when userKpis has items again
            if (userKpis && userKpis.length > 0) {
                hasClearedEmptyKpisRef.current = false;
            }
        }
    }, [userKpis, userKpisStatus, isUserKpisLoading, isUserKpisError, serverPersistence.addCard, setKpiData]);
    // Event handlers
    var handleCardClick = (0, react_1.useCallback)(function (cardId, e) {
        e.stopPropagation();
        if (props.isDragging)
            return;
        // Clear search when a card is selected
        if (dashboardState.searchTerm.trim()) {
            dashboardState.setSearchTerm('');
        }
        if (e.ctrlKey || e.metaKey) {
            dashboardState.setSelectedCards(function (prev) {
                var newSet = new Set(prev);
                if (newSet.has(cardId)) {
                    newSet.delete(cardId);
                }
                else {
                    newSet.add(cardId);
                }
                return newSet;
            });
        }
        else {
            dashboardState.setSelectedCards(new Set([cardId]));
        }
    }, [props.isDragging, dashboardState]);
    var handleResetAll = (0, react_1.useCallback)(function () {
        modalManagement.setConfirmModal({
            isOpen: true,
            title: 'Reset Dashboard',
            message: 'Reset dashboard and remove all groups? This cannot be undone.',
            type: 'danger',
            onConfirm: function () {
                props.clearAllGroups();
                props.resetLayout();
                setKpiData({});
                processedKpisRef.current.clear();
                try {
                    localStorage.removeItem('vero_kpi_data_v1');
                }
                catch (_a) { }
            }
        });
    }, [props.clearAllGroups, props.resetLayout]);
    var handleGroupDeleteRequest = (0, react_1.useCallback)(function (groupId) {
        var group = props.groups[groupId];
        if (group) {
            modalManagement.setGroupDeleteModal({
                isOpen: true,
                groupId: groupId,
                groupName: group.name
            });
        }
    }, [props.groups]);
    var handleGroupDeleteConfirm = (0, react_1.useCallback)(function () {
        props.deleteGroup(modalManagement.groupDeleteModal.groupId);
        modalManagement.setGroupDeleteModal({
            isOpen: false,
            groupId: '',
            groupName: ''
        });
    }, [modalManagement.groupDeleteModal.groupId, props.deleteGroup]);
    var handleFullscreenToggle = (0, react_1.useCallback)(function () {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(function () {
                dashboardState.setIsMobileFullscreen(true);
            }).catch(function () { });
        }
        else {
            document.exitFullscreen().then(function () {
                dashboardState.setIsMobileFullscreen(false);
            }).catch(function () { });
        }
    }, []);
    var handleMobileNavigate = (0, react_1.useCallback)(function (_page) {
        // Handle navigation logic here
    }, []);
    var handleMobileSearch = (0, react_1.useCallback)(function (query) {
        dashboardState.setSearchTerm(query);
    }, []);
    var handleToggleMobileView = (0, react_1.useCallback)(function (_view) {
        // Handle view mode toggle logic here
    }, []);
    var handleLoadPreset = (0, react_1.useCallback)(function (presetLayout) {
        var newLayout = {
            cards: presetLayout.cards || {},
            canvasHeight: presetLayout.canvasHeight || 600,
            theme: presetLayout.theme || 'light',
            zoom: presetLayout.zoom,
            pan: presetLayout.pan
        };
        props.loadLayoutFromData(newLayout);
        if (presetLayout.zoom !== undefined || presetLayout.pan !== undefined) {
            props.setZoom(presetLayout.zoom || 1);
            if (presetLayout.pan) {
                props.setPan(presetLayout.pan);
            }
        }
    }, [props.loadLayoutFromData, props.setZoom, props.setPan]);
    // Memoized filtered cards - now only for highlighting, not hiding
    var filteredCards = (0, react_1.useMemo)(function () {
        if (!dashboardState.searchTerm.trim()) {
            return [];
        }
        var term = dashboardState.searchTerm.toLowerCase();
        return Object.values(layout.cards).filter(function (card) {
            // Search in card type name
            var cardType = cardTypes.find(function (t) { return t.id === card.type; });
            var cardName = (cardType === null || cardType === void 0 ? void 0 : cardType.name) || '';
            // Search in KPI data for kpi-display cards
            var cardKpiData = kpiData[card.id];
            var kpiName = (cardKpiData === null || cardKpiData === void 0 ? void 0 : cardKpiData.name) || '';
            var kpiDescription = (cardKpiData === null || cardKpiData === void 0 ? void 0 : cardKpiData.description) || '';
            var kpiCategory = (cardKpiData === null || cardKpiData === void 0 ? void 0 : cardKpiData.category) || '';
            // Search in all relevant fields
            return cardName.toLowerCase().includes(term) ||
                card.type.toLowerCase().includes(term) ||
                card.id.toLowerCase().includes(term) ||
                kpiName.toLowerCase().includes(term) ||
                kpiDescription.toLowerCase().includes(term) ||
                kpiCategory.toLowerCase().includes(term);
        });
    }, [layout.cards, dashboardState.searchTerm, cardTypes, kpiData]);
    // Auto-scroll to first matching card when search results change
    (0, react_1.useEffect)(function () {
        if (dashboardState.searchTerm.trim() && filteredCards.length > 0) {
            var firstCard_1 = filteredCards[0];
            if (firstCard_1) {
                // Small delay to ensure DOM has been updated with search highlighting
                var timeoutId_1 = setTimeout(function () {
                    // Find the card element in the DOM
                    var cardElement = document.querySelector("[data-card-id=\"".concat(firstCard_1.id, "\"]"));
                    if (cardElement) {
                        // Scroll the card into view with smooth behavior
                        cardElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                            inline: 'center'
                        });
                    }
                }, 100); // Small delay to ensure DOM updates
                return function () { return clearTimeout(timeoutId_1); };
            }
        }
        return undefined;
    }, [filteredCards, dashboardState.searchTerm]);
    var renderVirtualCard = (0, react_1.useMemo)(function () {
        return (0, renderHelpers_1.createRenderVirtualCard)(dashboardState.selectedCards, props.isDraggingMultiple, props.draggedCardId, props.isCardLocked, props.getCardGroup, dashboardState.searchTerm, filteredCards, props.handleDragStart, handleCardClick, props.toggleCardLock, serverPersistence.removeCard, cardTypes, kpiData, dashboardState.setShowTemplateLibrary, props.resizingCardId, props.handleResizeStart, props.keyboardNavigation);
    }, [
        dashboardState.selectedCards,
        props.isDraggingMultiple,
        props.draggedCardId,
        props.isCardLocked,
        props.getCardGroup,
        dashboardState.searchTerm,
        filteredCards,
        props.handleDragStart,
        handleCardClick,
        props.toggleCardLock,
        serverPersistence.removeCard,
        cardTypes,
        kpiData,
        dashboardState.setShowTemplateLibrary,
        props.resizingCardId,
        props.handleResizeStart,
        props.keyboardNavigation
    ]);
    return {
        handleCardClick: handleCardClick,
        handleResetAll: handleResetAll,
        handleGroupDeleteRequest: handleGroupDeleteRequest,
        handleGroupDeleteConfirm: handleGroupDeleteConfirm,
        handleFullscreenToggle: handleFullscreenToggle,
        handleMobileNavigate: handleMobileNavigate,
        handleMobileSearch: handleMobileSearch,
        handleToggleMobileView: handleToggleMobileView,
        handleLoadPreset: handleLoadPreset,
        filteredCards: filteredCards,
        renderVirtualCard: renderVirtualCard,
        availableKpiFields: constants_1.availableKpiFields
    };
};
exports.useVeroCardsRender = useVeroCardsRender;
