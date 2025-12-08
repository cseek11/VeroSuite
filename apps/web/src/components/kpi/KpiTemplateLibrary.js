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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = KpiTemplateLibrary;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var useKpiTemplates_1 = require("@/hooks/useKpiTemplates");
var KpiTemplateEditor_1 = __importDefault(require("./KpiTemplateEditor"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var coerceString = function (value, fallback) {
    if (fallback === void 0) { fallback = ''; }
    return typeof value === 'string' ? value : fallback;
};
var templateCategories = [
    'user',
    'financial',
    'operational',
    'customer',
    'compliance',
];
var templateTypes = ['system', 'user', 'shared'];
var templateStatuses = ['draft', 'published', 'archived'];
var normalizeCategory = function (value) {
    var maybeCategory = coerceString(value);
    return templateCategories.includes(maybeCategory) ? maybeCategory : 'operational';
};
var normalizeTemplateType = function (value) {
    var maybeType = coerceString(value);
    return templateTypes.includes(maybeType) ? maybeType : 'system';
};
var normalizeStatus = function (value) {
    var maybeStatus = coerceString(value);
    return templateStatuses.includes(maybeStatus) ? maybeStatus : 'published';
};
var normalizeThresholdConfig = function (value) {
    if (value &&
        typeof value === 'object' &&
        typeof value.green === 'number' &&
        typeof value.yellow === 'number' &&
        typeof value.red === 'number') {
        return value;
    }
    return undefined;
};
var normalizeChartConfig = function (value) {
    if (value &&
        typeof value === 'object' &&
        typeof value.type === 'string' &&
        Array.isArray(value.colorScheme)) {
        return value;
    }
    return undefined;
};
var normalizeDataSourceConfig = function (value) {
    if (value &&
        typeof value === 'object' &&
        typeof value.table === 'string' &&
        typeof value.timeRange === 'string') {
        return value;
    }
    return undefined;
};
var ensureTemplateArray = function (value) {
    return Array.isArray(value) ? value : [];
};
function KpiTemplateLibrary(_a) {
    var _this = this;
    var onTemplateSelect = _a.onTemplateSelect, onUseTemplate = _a.onUseTemplate, _b = _a.showCreateButton, showCreateButton = _b === void 0 ? true : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var _d = (0, react_1.useState)(''), searchTerm = _d[0], setSearchTerm = _d[1];
    var _e = (0, react_1.useState)(''), debouncedSearchTerm = _e[0], setDebouncedSearchTerm = _e[1];
    var _f = (0, react_1.useState)('all'), selectedCategory = _f[0], setSelectedCategory = _f[1];
    var _g = (0, react_1.useState)('all'), selectedType = _g[0], setSelectedType = _g[1];
    var _h = (0, react_1.useState)(false), showFilters = _h[0], setShowFilters = _h[1];
    var _j = (0, react_1.useState)(false), showTemplateEditor = _j[0], setShowTemplateEditor = _j[1];
    var _k = (0, react_1.useState)(), editingTemplateId = _k[0], setEditingTemplateId = _k[1];
    // Debounce search term to prevent excessive filtering
    (0, react_1.useEffect)(function () {
        var timer = setTimeout(function () {
            setDebouncedSearchTerm(searchTerm);
        }, 300); // 300ms delay
        return function () { return clearTimeout(timer); };
    }, [searchTerm]);
    // API hooks - remove server-side search to prevent excessive API calls
    var templateQueryParams = {};
    if (selectedCategory !== 'all') {
        templateQueryParams.category = selectedCategory;
    }
    if (selectedType !== 'all') {
        templateQueryParams.template_type = selectedType;
    }
    var _l = (0, useKpiTemplates_1.useKpiTemplates)(templateQueryParams), _m = _l.data, templates = _m === void 0 ? [] : _m, templatesLoading = _l.isLoading, _templatesError = _l.error;
    var _o = (0, useKpiTemplates_1.useUserKpis)().data, userKpis = _o === void 0 ? [] : _o;
    var _p = (0, useKpiTemplates_1.useFeaturedKpiTemplates)().data, _featuredTemplates = _p === void 0 ? [] : _p;
    var _q = (0, useKpiTemplates_1.usePopularKpiTemplates)(6).data, popularTemplates = _q === void 0 ? [] : _q;
    var trackUsageMutation = (0, useKpiTemplates_1.useTrackTemplateUsage)();
    // Get favorited templates to sort them first
    var _r = (0, useKpiTemplates_1.useFavoritedTemplates)(), _s = _r.data, favoritedTemplatesData = _s === void 0 ? [] : _s, favoritesLoading = _r.isLoading, favoritesError = _r.error;
    var favoritedTemplateIds = new Set(favoritedTemplatesData.map(function (t) { return t.id; }));
    // Local optimistic overrides so clicking heart immediately reorders list
    var _t = (0, react_1.useState)({}), favoriteOverrides = _t[0], setFavoriteOverrides = _t[1];
    // Clear optimistic overrides when favorites data is successfully loaded
    react_1.default.useEffect(function () {
        if (favoritedTemplatesData.length > 0 && !favoritesLoading && !favoritesError) {
            setFavoriteOverrides({});
        }
    }, [favoritedTemplatesData.length, favoritesLoading, favoritesError]);
    // Effective favorited IDs (server + optimistic overrides)
    var effectiveFavoritedIds = (0, react_1.useMemo)(function () {
        var set = new Set(favoritedTemplateIds);
        Object.entries(favoriteOverrides).forEach(function (_a) {
            var id = _a[0], isFav = _a[1];
            if (isFav)
                set.add(id);
            else
                set.delete(id);
        });
        return set;
    }, [favoritedTemplateIds, favoriteOverrides]);
    // Map user KPIs to template-like objects
    var userTemplates = (0, react_1.useMemo)(function () {
        if (!Array.isArray(userKpis)) {
            logger_1.logger.warn('userKpis is not an array', { userKpis: userKpis }, 'KpiTemplateLibrary');
            return [];
        }
        return userKpis.map(function (k) {
            var _a, _b;
            var id = coerceString(k.template_id || k.id);
            var tenantId = typeof k.tenant_id === 'string' ? k.tenant_id : undefined;
            var thresholdConfig = normalizeThresholdConfig(k.threshold_config);
            var chartConfig = normalizeChartConfig(k.chart_config);
            var dataSourceConfig = normalizeDataSourceConfig(k.data_source_config);
            var status = normalizeStatus((_a = k.status) !== null && _a !== void 0 ? _a : 'published');
            var createdAt = typeof k.created_at === 'string' ? k.created_at : undefined;
            var creator = k.creator && typeof k.creator === 'object' && ((_b = k.creator) === null || _b === void 0 ? void 0 : _b.id)
                ? k.creator
                : undefined;
            var baseTemplate = __assign(__assign(__assign(__assign({ id: id, userKpiId: k.id, name: coerceString(k.name, 'Untitled'), description: coerceString(k.description, ''), category: normalizeCategory(k.category), template_type: normalizeTemplateType('user'), is_from_template: !!k.template_id, formula_expression: coerceString(k.formula_expression, ''), formula_fields: Array.isArray(k.formula_fields) ? k.formula_fields : [] }, (thresholdConfig ? { threshold_config: thresholdConfig } : {})), (chartConfig ? { chart_config: chartConfig } : {})), (dataSourceConfig ? { data_source_config: dataSourceConfig } : {})), { tags: Array.isArray(k.tags) ? k.tags : [], is_public: false, is_featured: false, usage_count: typeof k.usage_count === 'number' ? k.usage_count : 0, status: status });
            return tenantId
                ? __assign(__assign(__assign(__assign({}, baseTemplate), (createdAt ? { created_at: createdAt } : {})), (creator ? { creator: creator } : {})), { tenant_id: tenantId }) : __assign(__assign(__assign({}, baseTemplate), (createdAt ? { created_at: createdAt } : {})), (creator ? { creator: creator } : {}));
        });
    }, [userKpis]);
    // Combine user templates + system templates
    var combinedTemplates = (0, react_1.useMemo)(function () {
        var sys = ensureTemplateArray(templates).map(function (t) {
            var _a;
            var normalizedThreshold = normalizeThresholdConfig(t.threshold_config);
            var normalizedChart = normalizeChartConfig(t.chart_config);
            var normalizedDataSource = normalizeDataSourceConfig(t.data_source_config);
            var createdAt = typeof t.created_at === 'string' ? t.created_at : undefined;
            var creator = t.creator && typeof t.creator === 'object' && ((_a = t.creator) === null || _a === void 0 ? void 0 : _a.id)
                ? t.creator
                : undefined;
            return __assign(__assign(__assign(__assign(__assign(__assign(__assign({}, t), { template_type: normalizeTemplateType(t.template_type), category: normalizeCategory(t.category), status: normalizeStatus(t.status) }), (normalizedThreshold ? { threshold_config: normalizedThreshold } : {})), (normalizedChart ? { chart_config: normalizedChart } : {})), (normalizedDataSource ? { data_source_config: normalizedDataSource } : {})), (createdAt ? { created_at: createdAt } : {})), (creator ? { creator: creator } : {}));
        });
        return __spreadArray(__spreadArray([], userTemplates, true), sys, true);
    }, [templates, userTemplates]);
    // Derive user templates (user-created templates)
    var derivedUserTemplates = (0, react_1.useMemo)(function () {
        var list = combinedTemplates.filter(function (t) { return t.template_type === 'user'; });
        return __spreadArray([], list, true).sort(function (a, b) { return coerceString(a.name).localeCompare(coerceString(b.name)); });
    }, [combinedTemplates]);
    // Derive favorites list for the section at the top (optimistic)
    var derivedFavoritedTemplates = (0, react_1.useMemo)(function () {
        var favoritedList = [];
        Array.from(effectiveFavoritedIds).forEach(function (favoritedId) {
            var userTemplate = combinedTemplates.find(function (t) { return t.template_type === 'user' && t.id === favoritedId && t.is_from_template; });
            if (userTemplate) {
                favoritedList.push(userTemplate);
                return;
            }
            var systemTemplate = combinedTemplates.find(function (t) { return t.template_type !== 'user' && t.id === favoritedId; });
            if (systemTemplate) {
                favoritedList.push(systemTemplate);
            }
        });
        return __spreadArray([], favoritedList, true).sort(function (a, b) { return coerceString(a.name).localeCompare(coerceString(b.name)); });
    }, [combinedTemplates, effectiveFavoritedIds]);
    // Filter and sort templates based on search, category, and favorites
    var filteredTemplates = (0, react_1.useMemo)(function () {
        var filtered = __spreadArray([], combinedTemplates, true);
        if (debouncedSearchTerm) {
            var search_1 = debouncedSearchTerm.toLowerCase();
            filtered = filtered.filter(function (template) {
                var name = coerceString(template.name).toLowerCase();
                var description = coerceString(template.description).toLowerCase();
                var tags = Array.isArray(template.tags)
                    ? template.tags.filter(function (tag) { return typeof tag === 'string'; })
                    : [];
                return (name.includes(search_1) ||
                    description.includes(search_1) ||
                    tags.some(function (tag) { return tag.toLowerCase().includes(search_1); }));
            });
        }
        return filtered.sort(function (a, b) {
            var aIsFavorited = a.id ? effectiveFavoritedIds.has(a.id) : false;
            var bIsFavorited = b.id ? effectiveFavoritedIds.has(b.id) : false;
            if (aIsFavorited && !bIsFavorited)
                return -1;
            if (!aIsFavorited && bIsFavorited)
                return 1;
            return coerceString(a.name).localeCompare(coerceString(b.name));
        });
    }, [combinedTemplates, debouncedSearchTerm, effectiveFavoritedIds]);
    // Get unique categories and types for filters
    var categories = (0, react_1.useMemo)(function () {
        var cats = new Set(['all']);
        combinedTemplates.forEach(function (t) { return cats.add(coerceString(t.category, 'uncategorized')); });
        return Array.from(cats);
    }, [combinedTemplates]);
    var types = (0, react_1.useMemo)(function () {
        var typeSet = new Set(['all']);
        ensureTemplateArray(templates).forEach(function (t) { return typeSet.add(coerceString(t.template_type, 'unknown')); });
        return Array.from(typeSet);
    }, [templates]);
    // Handle template actions
    var handleTemplateClick = function (template) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Track view
                return [4 /*yield*/, trackUsageMutation.mutateAsync({
                        templateId: template.id,
                        action: 'viewed'
                    })];
                case 1:
                    // Track view
                    _a.sent();
                    onTemplateSelect === null || onTemplateSelect === void 0 ? void 0 : onTemplateSelect(template);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleUseTemplate = function (template) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Fire-and-forget tracking so failures don't block using the template
            trackUsageMutation
                .mutateAsync({ templateId: template.id, action: 'viewed' })
                .catch(function (err) { return logger_1.logger.warn('Failed to track template usage', err, 'KpiTemplateLibrary'); });
            // Always proceed to use the template
            try {
                onUseTemplate === null || onUseTemplate === void 0 ? void 0 : onUseTemplate(template);
            }
            catch (error) {
                logger_1.logger.error('Failed to use template', error, 'KpiTemplateLibrary');
            }
            return [2 /*return*/];
        });
    }); };
    // Share template functionality (currently unused but kept for future implementation)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    var _handleShareTemplate = function (_template) { return __awaiter(_this, void 0, void 0, function () {
        var templateUrl, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    // Track the share action
                    return [4 /*yield*/, trackUsageMutation.mutateAsync({
                            templateId: _template.id,
                            action: 'shared'
                        })];
                case 1:
                    // Track the share action
                    _a.sent();
                    templateUrl = "".concat(window.location.origin, "/templates/").concat(_template.id);
                    return [4 /*yield*/, navigator.clipboard.writeText(templateUrl)];
                case 2:
                    _a.sent();
                    logger_1.logger.debug('Template URL copied to clipboard', { templateUrl: templateUrl }, 'KpiTemplateLibrary');
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error('Failed to share template', error_1, 'KpiTemplateLibrary');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Mark placeholder handler as intentionally unused for now
    void _handleShareTemplate;
    // Get category icon and color
    var getCategoryIcon = function (category) {
        switch (category) {
            case 'financial': return lucide_react_1.DollarSign;
            case 'operational': return lucide_react_1.Settings;
            case 'customer': return lucide_react_1.Users;
            case 'compliance': return lucide_react_1.Shield;
            default: return lucide_react_1.BarChart3;
        }
    };
    var getCategoryColor = function (category) {
        switch (category) {
            case 'financial': return 'bg-green-100 text-green-800';
            case 'operational': return 'bg-blue-100 text-blue-800';
            case 'customer': return 'bg-purple-100 text-purple-800';
            case 'compliance': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    var getTypeColor = function (type) {
        switch (type) {
            case 'system': return 'bg-blue-100 text-blue-800';
            case 'user': return 'bg-green-100 text-green-800';
            case 'shared': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    // Template list item component
    var TemplateListItem = function (_a) {
        var _b, _c;
        var template = _a.template, _d = _a.featured, featured = _d === void 0 ? false : _d;
        var templateId = template.id;
        var CategoryIcon = getCategoryIcon(coerceString(template.category, ''));
        // Only show favorite functionality for templates that can be favorited
        // User-created KPIs (not from templates) can't be favorited through the template system
        var canBeFavorited = template.template_type !== 'user' || template.is_from_template;
        var favoriteStatus = (0, useKpiTemplates_1.useTemplateFavoriteStatus)(templateId).data;
        var favoriteMutation = (0, useKpiTemplates_1.useFavoriteTemplate)();
        return ((0, jsx_runtime_1.jsx)("div", { className: "group cursor-pointer transition-all duration-200 hover:bg-gray-50 border rounded-lg p-3 ".concat(featured ? 'ring-2 ring-red-400 bg-red-50' : 'bg-white border-gray-200'), onClick: function () { return handleTemplateClick(__assign(__assign({}, template), { id: templateId })); }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)(CategoryIcon, { className: "h-5 w-5 text-gray-600 flex-shrink-0" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between gap-2 mb-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors truncate", children: coerceString(template.name, 'Untitled Template') }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-1 flex-shrink-0", children: [(0, jsx_runtime_1.jsx)(ui_1.Badge, { className: "text-xs ".concat(getCategoryColor(coerceString(template.category, ''))), children: template.category || 'uncategorized' }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { className: "text-xs ".concat(getTypeColor(coerceString(template.template_type, ''))), children: template.template_type }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { className: "text-xs bg-green-100 text-green-700 border-green-200", children: "Live View" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 text-xs text-gray-500 flex-shrink-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsx)("span", { children: template.usage_count || 0 })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsx)("span", { children: template.created_at ? new Date(template.created_at).toLocaleDateString() : '' })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 line-clamp-1 flex-1 min-w-0 pr-2", children: coerceString(template.description) }), template.creator && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-xs text-gray-500 flex-shrink-0", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsxs)("span", { className: "truncate max-w-32", children: [coerceString((_b = template.creator) === null || _b === void 0 ? void 0 : _b.first_name), " ", coerceString((_c = template.creator) === null || _c === void 0 ? void 0 : _c.last_name)] })] }))] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 flex-shrink-0 ml-4", children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { size: "sm", onClick: function () {
                                    handleUseTemplate(__assign(__assign({}, template), { id: templateId }));
                                }, disabled: trackUsageMutation.isPending, className: "px-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 mr-1" }), "Use Template"] }), canBeFavorited && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () {
                                    var next = !(favoriteStatus === null || favoriteStatus === void 0 ? void 0 : favoriteStatus.isFavorited);
                                    // optimistic override
                                    setFavoriteOverrides(function (prev) {
                                        var _a;
                                        return (__assign(__assign({}, prev), (_a = {}, _a[templateId] = next, _a)));
                                    });
                                    favoriteMutation.mutate({ templateId: templateId, isFavorited: next }, {
                                        onSuccess: function () {
                                            // clear override after server confirms (query invalidation will refresh)
                                            setFavoriteOverrides(function (prev) {
                                                var _a = prev, _b = templateId, _omit = _a[_b], rest = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                                                return rest;
                                            });
                                        },
                                        onError: function () {
                                            // revert override on error
                                            setFavoriteOverrides(function (prev) {
                                                var _a = prev, _b = templateId, _omit = _a[_b], rest = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                                                return rest;
                                            });
                                        }
                                    });
                                }, disabled: favoriteMutation.isPending, className: "px-2 ".concat((favoriteStatus === null || favoriteStatus === void 0 ? void 0 : favoriteStatus.isFavorited) || favoriteOverrides[templateId] ? "text-red-500 border-red-500" : ""), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Heart, { className: "h-4 w-4 ".concat((favoriteStatus === null || favoriteStatus === void 0 ? void 0 : favoriteStatus.isFavorited) || favoriteOverrides[templateId] ? "fill-current" : "") }) }))] })] }) }));
    };
    if (templatesLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-6 ".concat(className), children: (0, jsx_runtime_1.jsxs)("div", { className: "animate-pulse", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-8 bg-gray-200 rounded w-1/3 mb-4" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: __spreadArray([], Array(10), true).map(function (_, i) { return ((0, jsx_runtime_1.jsx)("div", { className: "h-16 bg-gray-200 rounded-lg" }, i)); }) })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6 ".concat(className), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-gray-900", children: "KPI Templates" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mt-1", children: "Browse and use pre-built KPI templates for your dashboard" })] }), showCreateButton && ((0, jsx_runtime_1.jsxs)(Button_1.default, { onClick: function () { return setShowTemplateEditor(true); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 mr-2" }), "Create Template"] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative flex-1 max-w-md", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)(Input_1.default, { placeholder: "Search templates...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "pl-10" })] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", onClick: function () { return setShowFilters(!showFilters); }, className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "h-4 w-4" }), "Filters"] })] }), showFilters && ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-700", children: "Category:" }), (0, jsx_runtime_1.jsx)("select", { value: selectedCategory, onChange: function (e) { return setSelectedCategory(e.target.value); }, className: "px-3 py-1 border border-gray-300 rounded text-sm", children: categories.map(function (category) { return ((0, jsx_runtime_1.jsx)("option", { value: category, children: category.charAt(0).toUpperCase() + category.slice(1) }, category)); }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-700", children: "Type:" }), (0, jsx_runtime_1.jsx)("select", { value: selectedType, onChange: function (e) { return setSelectedType(e.target.value); }, className: "px-3 py-1 border border-gray-300 rounded text-sm", children: types.map(function (type) { return ((0, jsx_runtime_1.jsx)("option", { value: type, children: type.charAt(0).toUpperCase() + type.slice(1) }, type)); }) })] })] }))] }), derivedUserTemplates.length > 0 && !debouncedSearchTerm && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-4", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-5 w-5 text-green-600" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-green-900", children: "Your Templates" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: derivedUserTemplates
                            .filter(function (template) { return !!template.id; })
                            .map(function (template) { return ((0, jsx_runtime_1.jsx)(TemplateListItem, { template: template }, template.id)); }) })] })), derivedFavoritedTemplates.length > 0 && !debouncedSearchTerm && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-4", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Heart, { className: "h-5 w-5 text-red-500 fill-current" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-red-900", children: "Your Favorites" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: derivedFavoritedTemplates
                            .filter(function (template) { return !!template.id; })
                            .slice(0, 6)
                            .map(function (template) { return ((0, jsx_runtime_1.jsx)(TemplateListItem, { template: template, featured: true }, template.id)); }) })] })), popularTemplates.length > 0 && !debouncedSearchTerm && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-4", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-5 w-5 text-green-500" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: "Popular Templates" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: popularTemplates
                            .filter(function (template) { return !!template.id; })
                            .map(function (template) { return ((0, jsx_runtime_1.jsx)(TemplateListItem, { template: template }, template.id)); }) })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-4", children: (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: debouncedSearchTerm ? "Search Results for \"".concat(debouncedSearchTerm, "\" (").concat(filteredTemplates.length, ")") : "All Templates (".concat(filteredTemplates.length, ")") }) }), filteredTemplates.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No templates found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mb-4", children: debouncedSearchTerm ? 'Try adjusting your search terms' : 'No templates available yet' }), showCreateButton && ((0, jsx_runtime_1.jsxs)(Button_1.default, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 mr-2" }), "Create First Template"] }))] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: filteredTemplates
                            .filter(function (template) { return !!template.id; })
                            .map(function (template) { return ((0, jsx_runtime_1.jsx)(TemplateListItem, { template: template }, template.id)); }) }))] }), (0, jsx_runtime_1.jsx)(KpiTemplateEditor_1.default, __assign({}, (editingTemplateId ? { templateId: editingTemplateId } : { templateId: null }), { isOpen: showTemplateEditor, onClose: function () {
                    setShowTemplateEditor(false);
                    setEditingTemplateId(undefined);
                }, onSave: function (_template) {
                    // Refresh templates list
                    // The hook will automatically refetch due to mutation invalidation
                    setShowTemplateEditor(false);
                    setEditingTemplateId(undefined);
                } }))] }));
}
