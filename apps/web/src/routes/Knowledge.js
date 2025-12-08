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
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var auth_1 = require("@/stores/auth");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
var useDialog_1 = require("@/hooks/useDialog");
var lucide_react_1 = require("lucide-react");
var knowledgeService_1 = require("../lib/services/knowledgeService");
// Real data will be fetched from API
// Articles will be fetched from API
var KnowledgePage = function () {
    var DialogComponents = (0, useDialog_1.useDialog)().DialogComponents;
    var user = (0, auth_1.useAuthStore)().user;
    var isAdmin = !!(user && Array.isArray(user.roles) && user.roles.includes('admin'));
    var _a = (0, react_1.useState)('articles'), activeTab = _a[0], setActiveTab = _a[1];
    var _b = (0, react_1.useState)(''), searchQuery = _b[0], setSearchQuery = _b[1];
    var _c = (0, react_1.useState)('all'), selectedCategory = _c[0], setSelectedCategory = _c[1];
    var _d = (0, react_1.useState)([]), expandedCategories = _d[0], setExpandedCategories = _d[1];
    var _e = (0, react_1.useState)(null), selectedArticle = _e[0], setSelectedArticle = _e[1];
    var _f = (0, react_1.useState)([]), fetchedArticles = _f[0], setFetchedArticles = _f[1];
    var _g = (0, react_1.useState)([]), fetchedCategories = _g[0], setFetchedCategories = _g[1];
    var _h = (0, react_1.useState)(false), isEditorOpen = _h[0], setIsEditorOpen = _h[1];
    var _j = (0, react_1.useState)({
        id: undefined,
        title: '',
        category_id: '',
        author: 'VeroField Team',
        read_time: '5 min',
        difficulty: 'beginner',
        tags: [],
        content: '',
        featured: false
    }), editorData = _j[0], setEditorData = _j[1];
    var editorRef = (0, react_1.useRef)(null);
    var tabs = [
        { id: 'articles', label: 'Articles', icon: lucide_react_1.FileText },
        { id: 'verofield', label: 'VeroField', icon: lucide_react_1.BookOpen },
        { id: 'categories', label: 'Categories', icon: lucide_react_1.FolderOpen },
        { id: 'faqs', label: 'FAQs', icon: lucide_react_1.HelpCircle },
        { id: 'favorites', label: 'Favorites', icon: lucide_react_1.Bookmark }
    ];
    (0, react_1.useEffect)(function () {
        var isMounted = true;
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, cats, arts, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, Promise.all([
                                (0, knowledgeService_1.fetchKnowledgeCategories)().catch(function () { return []; }),
                                (0, knowledgeService_1.fetchKnowledgeArticles)().catch(function () { return []; })
                            ])];
                    case 1:
                        _a = _b.sent(), cats = _a[0], arts = _a[1];
                        if (!isMounted)
                            return [2 /*return*/];
                        if (cats && cats.length)
                            setFetchedCategories(cats);
                        if (arts && arts.length)
                            setFetchedArticles(arts);
                        return [3 /*break*/, 4];
                    case 2:
                        e_1 = _b.sent();
                        if (!isMounted)
                            return [2 /*return*/];
                        return [3 /*break*/, 4];
                    case 3:
                        if (isMounted) {
                        }
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); })();
        return function () { isMounted = false; };
    }, []);
    var getDifficultyColor = function (difficulty) {
        switch (difficulty) {
            case 'beginner': return 'bg-green-100 text-green-800';
            case 'intermediate': return 'bg-yellow-100 text-yellow-800';
            case 'advanced': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    var getDifficultyIcon = function (difficulty) {
        switch (difficulty) {
            case 'beginner': return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-600" });
            case 'intermediate': return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-yellow-600" });
            case 'advanced': return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 text-red-600" });
            default: return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-gray-600" });
        }
    };
    var usingFetched = fetchedArticles.length > 0;
    var categories = usingFetched ? fetchedCategories : [];
    var articles = usingFetched ? fetchedArticles : [];
    var filteredArticles = articles.filter(function (article) {
        var title = (article.title || '').toLowerCase();
        var matchesTitle = title.includes(searchQuery.toLowerCase());
        if (selectedCategory === 'all')
            return matchesTitle;
        if (usingFetched) {
            return matchesTitle && article.category_slug === selectedCategory;
        }
        return matchesTitle && article.category === selectedCategory;
    });
    var filteredFaqs = []; // TODO: Add FAQ fetching when API is available
    var toggleCategory = function (categoryId) {
        setExpandedCategories(function (prev) {
            return prev.includes(categoryId)
                ? prev.filter(function (id) { return id !== categoryId; })
                : __spreadArray(__spreadArray([], prev, true), [categoryId], false);
        });
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(DialogComponents, {}), (0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1", children: "Knowledge Base" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-600 text-sm", children: "Access pest control guides, safety protocols, and best practices" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("button", { className: "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "h-3 w-3" }), "Export"] }), (0, jsx_runtime_1.jsxs)("button", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium text-sm", onClick: function () {
                                                var _a;
                                                setEditorData({ id: undefined, title: '', category_id: ((_a = fetchedCategories.find(function (c) { return c.slug === 'verofield-training'; })) === null || _a === void 0 ? void 0 : _a.id) || '', author: 'VeroField Team', read_time: '5 min', difficulty: 'beginner', tags: [], content: '', featured: false });
                                                setIsEditorOpen(true);
                                            }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-3 w-3" }), "New Article"] })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl p-3 text-white relative overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-2", children: (0, jsx_runtime_1.jsx)("div", { className: "p-1.5 bg-white/20 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-5 w-5" }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "text-xl font-bold mb-1", children: articles.length }), (0, jsx_runtime_1.jsx)("div", { className: "text-blue-100 font-medium text-xs", children: "Total Articles" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-xl p-3 text-white relative overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-2", children: (0, jsx_runtime_1.jsx)("div", { className: "p-1.5 bg-white/20 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.FolderOpen, { className: "h-5 w-5" }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "text-xl font-bold mb-1", children: categories.length }), (0, jsx_runtime_1.jsx)("div", { className: "text-emerald-100 font-medium text-xs", children: "Categories" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-xl p-3 text-white relative overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-2", children: (0, jsx_runtime_1.jsx)("div", { className: "p-1.5 bg-white/20 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-5 w-5" }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "text-xl font-bold mb-1", children: articles.reduce(function (sum, article) { return sum + (article.views || 0); }, 0).toLocaleString() }), (0, jsx_runtime_1.jsx)("div", { className: "text-violet-100 font-medium text-xs", children: "Total Views" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-xl p-3 text-white relative overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-2", children: (0, jsx_runtime_1.jsx)("div", { className: "p-1.5 bg-white/20 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "h-5 w-5" }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "text-xl font-bold mb-1", children: articles.length > 0 ? (articles.reduce(function (sum, article) { return sum + (article.rating || 0); }, 0) / articles.length).toFixed(1) : '0.0' }), (0, jsx_runtime_1.jsx)("div", { className: "text-amber-100 font-medium text-xs", children: "Avg Rating" })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 flex-wrap", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative flex-1 max-w-md", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search articles, FAQs, or categories...", value: searchQuery, onChange: function (e) { return setSearchQuery(e.target.value); }, className: "w-full pl-10 pr-4 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm" })] }), (0, jsx_runtime_1.jsxs)("select", { value: selectedCategory, onChange: function (e) { return setSelectedCategory(e.target.value); }, className: "border border-slate-200 rounded-lg px-2 py-1.5 min-w-[150px] bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Categories" }), categories.map(function (category) { return ((0, jsx_runtime_1.jsx)("option", { value: category.slug || category.id, children: category.name }, category.id)); })] }), (0, jsx_runtime_1.jsxs)("button", { className: "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "h-3 w-3" }), "Filters"] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 overflow-hidden mb-4", children: (0, jsx_runtime_1.jsx)("div", { className: "flex space-x-4 overflow-x-auto border-b border-slate-200", children: tabs.map(function (tab) {
                                var Icon = tab.icon;
                                return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setActiveTab(tab.id); }, className: "flex items-center gap-1 py-1 px-1 border-b-2 font-medium text-xs whitespace-nowrap transition-colors duration-200 ".concat(activeTab === tab.id
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'), children: [(0, jsx_runtime_1.jsx)(Icon, { className: "h-3 w-3" }), tab.label] }, tab.id));
                            }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 flex flex-col min-h-0 overflow-hidden", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [activeTab === 'articles' && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-lg font-bold text-slate-800 mb-3 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1 bg-indigo-100 rounded-md", children: (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-4 w-4 text-indigo-600" }) }), "Articles"] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: filteredArticles.map(function (article) {
                                                var _a, _b;
                                                return ((0, jsx_runtime_1.jsxs)("div", { className: "p-3 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm cursor-pointer", onClick: function () { return setSelectedArticle(article); }, role: "button", tabIndex: 0, onKeyDown: function (e) { if (e.key === 'Enter' || e.key === ' ')
                                                        setSelectedArticle(article); }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-4 w-4 text-slate-600" }), (0, jsx_runtime_1.jsx)("span", { className: "px-1.5 py-0.5 text-xs rounded-full ".concat(getDifficultyColor(article.difficulty)), children: article.difficulty }), article.featured && ((0, jsx_runtime_1.jsx)("span", { className: "px-1.5 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800", children: "Featured" }))] }), (0, jsx_runtime_1.jsx)("button", { className: "p-1 text-slate-400 hover:text-slate-600 transition-colors", onClick: function (e) { return e.stopPropagation(); }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreVertical, { className: "h-3 w-3" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-semibold text-slate-900 mb-1 line-clamp-2", children: article.title }), (0, jsx_runtime_1.jsx)("div", { className: "prose max-w-none text-slate-600 text-xs line-clamp-3", dangerouslySetInnerHTML: { __html: (article.content || '').slice(0, 800) } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs text-slate-500 mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { children: article.read_time || article.readTime || '' }), (0, jsx_runtime_1.jsxs)("span", { children: [((_a = article.views) !== null && _a !== void 0 ? _a : 0), " views"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "h-3 w-3 text-amber-500" }), (0, jsx_runtime_1.jsx)("span", { children: Number((_b = article.rating) !== null && _b !== void 0 ? _b : 0).toFixed(1) })] })] }), getDifficultyIcon(article.difficulty)] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-3 w-3 text-slate-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-slate-600", children: article.author || 'VeroField Team' })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-1", children: isAdmin && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { className: "h-6 px-2 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 rounded hover:bg-white hover:shadow-lg transition-all duration-200", onClick: function (e) {
                                                                                    var _a;
                                                                                    e.stopPropagation();
                                                                                    setEditorData({
                                                                                        id: article.id,
                                                                                        title: article.title,
                                                                                        category_id: article.category_id || (((_a = fetchedCategories.find(function (c) { return c.slug === article.category_slug; })) === null || _a === void 0 ? void 0 : _a.id) || ''),
                                                                                        author: article.author || 'VeroField Team',
                                                                                        read_time: article.read_time || '5 min',
                                                                                        difficulty: article.difficulty || 'beginner',
                                                                                        tags: article.tags || [],
                                                                                        content: article.content || '',
                                                                                        featured: !!article.featured
                                                                                    });
                                                                                    setIsEditorOpen(true);
                                                                                }, children: "Edit" }), (0, jsx_runtime_1.jsx)("button", { className: "h-6 px-2 bg-white/80 backdrop-blur-sm border border-rose-200 text-rose-700 rounded hover:bg-white hover:shadow-lg transition-all duration-200", onClick: function (e) { return __awaiter(void 0, void 0, void 0, function () {
                                                                                    var arts, err_1;
                                                                                    return __generator(this, function (_a) {
                                                                                        switch (_a.label) {
                                                                                            case 0:
                                                                                                e.stopPropagation();
                                                                                                _a.label = 1;
                                                                                            case 1:
                                                                                                _a.trys.push([1, 4, , 5]);
                                                                                                if (!article.id)
                                                                                                    return [2 /*return*/];
                                                                                                return [4 /*yield*/, (0, knowledgeService_1.deleteKnowledgeArticle)(article.id)];
                                                                                            case 2:
                                                                                                _a.sent();
                                                                                                return [4 /*yield*/, (0, knowledgeService_1.fetchKnowledgeArticles)()];
                                                                                            case 3:
                                                                                                arts = _a.sent();
                                                                                                setFetchedArticles(arts);
                                                                                                return [3 /*break*/, 5];
                                                                                            case 4:
                                                                                                err_1 = _a.sent();
                                                                                                logger_1.logger.error('Failed to delete article', err_1, 'Knowledge');
                                                                                                toast_1.toast.error('Failed to delete article');
                                                                                                return [3 /*break*/, 5];
                                                                                            case 5: return [2 /*return*/];
                                                                                        }
                                                                                    });
                                                                                }); }, children: "Delete" })] })) })] })] }, article.id));
                                            }) })] })), activeTab === 'verofield' && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-lg font-bold text-slate-800 mb-3 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1 bg-purple-100 rounded-md", children: (0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "h-4 w-4 text-purple-600" }) }), "VeroField Training"] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: articles.filter(function (a) { return (usingFetched ? a.category_slug === 'verofield-training' : a.category === 'verofield-training'); }).map(function (article) {
                                                var _a, _b;
                                                return ((0, jsx_runtime_1.jsxs)("div", { className: "p-3 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm cursor-pointer", onClick: function () { return setSelectedArticle(article); }, role: "button", tabIndex: 0, onKeyDown: function (e) { if (e.key === 'Enter' || e.key === ' ')
                                                        setSelectedArticle(article); }, children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-start justify-between mb-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-4 w-4 text-slate-600" }), (0, jsx_runtime_1.jsx)("span", { className: "px-1.5 py-0.5 text-xs rounded-full ".concat(getDifficultyColor(article.difficulty || 'beginner')), children: article.difficulty || 'beginner' }), article.featured && ((0, jsx_runtime_1.jsx)("span", { className: "px-1.5 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800", children: "Featured" }))] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-semibold text-slate-900 mb-1 line-clamp-2", children: article.title }), (0, jsx_runtime_1.jsx)("div", { className: "prose max-w-none text-slate-600 text-xs line-clamp-3", dangerouslySetInnerHTML: { __html: (article.content || '').slice(0, 800) } })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between text-xs text-slate-500 mb-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { children: article.read_time || article.readTime || '' }), (0, jsx_runtime_1.jsxs)("span", { children: [((_a = article.views) !== null && _a !== void 0 ? _a : 0), " views"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "h-3 w-3 text-amber-500" }), (0, jsx_runtime_1.jsx)("span", { children: Number((_b = article.rating) !== null && _b !== void 0 ? _b : 0).toFixed(1) })] })] }) })] }, article.id));
                                            }) })] })), activeTab === 'categories' && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-lg font-bold text-slate-800 mb-3 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1 bg-emerald-100 rounded-md", children: (0, jsx_runtime_1.jsx)(lucide_react_1.FolderOpen, { className: "h-4 w-4 text-emerald-600" }) }), "Categories"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: categories.map(function (category) {
                                                var isExpanded = expandedCategories.includes(category.id);
                                                var categoryArticles = (usingFetched ? articles.filter(function (a) { return a.category_slug === (category.slug || category.id); }) : articles.filter(function (a) { return a.category === category.id; }));
                                                return ((0, jsx_runtime_1.jsxs)("div", { className: "border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-3 cursor-pointer hover:bg-white/50 transition-colors", onClick: function () { return toggleCategory(category.id); }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: category.icon }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-semibold text-slate-900", children: category.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-600", children: category.description })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsxs)("span", { className: "px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700", children: [category.articleCount, " articles"] }), isExpanded ? ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "h-4 w-4 text-slate-500" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "h-4 w-4 text-slate-500" }))] })] }) }), isExpanded && ((0, jsx_runtime_1.jsx)("div", { className: "border-t border-slate-200 p-3 bg-slate-50", children: (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: categoryArticles.map(function (article) { return ((0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-white rounded border border-slate-200", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-semibold text-slate-900 mb-1", children: article.title }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs text-slate-500", children: [(0, jsx_runtime_1.jsx)("span", { children: article.readTime }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "h-3 w-3 text-amber-500" }), (0, jsx_runtime_1.jsx)("span", { children: article.rating })] })] })] }, article.id)); }) }) }))] }, category.id));
                                            }) })] })), activeTab === 'faqs' && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-lg font-bold text-slate-800 mb-3 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1 bg-amber-100 rounded-md", children: (0, jsx_runtime_1.jsx)(lucide_react_1.HelpCircle, { className: "h-4 w-4 text-amber-600" }) }), "FAQs"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: filteredFaqs.map(function (faq) { return ((0, jsx_runtime_1.jsxs)("div", { className: "p-3 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.HelpCircle, { className: "h-4 w-4 text-slate-600" }), (0, jsx_runtime_1.jsx)("span", { className: "px-1.5 py-0.5 text-xs rounded-full ".concat(faq.category === 'emergency' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'), children: faq.category })] }), (0, jsx_runtime_1.jsx)("button", { className: "p-1 text-slate-400 hover:text-slate-600 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreVertical, { className: "h-3 w-3" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-semibold text-slate-900 mb-1", children: faq.question }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-600", children: faq.answer })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 text-xs text-slate-500", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ThumbsUp, { className: "h-3 w-3 text-emerald-500" }), (0, jsx_runtime_1.jsxs)("span", { children: [faq.helpful, " helpful"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ThumbsDown, { className: "h-3 w-3 text-rose-500" }), (0, jsx_runtime_1.jsxs)("span", { children: [faq.notHelpful, " not helpful"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("button", { className: "h-6 px-2 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 rounded hover:bg-white hover:shadow-lg transition-all duration-200", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ThumbsUp, { className: "h-3 w-3" }) }), (0, jsx_runtime_1.jsx)("button", { className: "h-6 px-2 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 rounded hover:bg-white hover:shadow-lg transition-all duration-200", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Share2, { className: "h-3 w-3" }) })] })] })] }, faq.id)); }) })] })), activeTab === 'favorites' && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-lg font-bold text-slate-800 mb-3 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1 bg-violet-100 rounded-md", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Bookmark, { className: "h-4 w-4 text-violet-600" }) }), "Favorites"] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Bookmark, { className: "h-8 w-8 text-slate-400 mx-auto mb-3" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-base font-semibold text-slate-900 mb-1", children: "No Favorites Yet" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-600 mb-3", children: "Start bookmarking articles and FAQs to access them quickly" }), (0, jsx_runtime_1.jsx)("button", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm", onClick: function () { return setActiveTab('articles'); }, children: "Browse Articles" })] })] }))] }) }), selectedArticle && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-bold text-slate-900", children: selectedArticle.title }), (0, jsx_runtime_1.jsx)("button", { className: "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200", onClick: function () { return setSelectedArticle(null); }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 text-sm text-slate-600", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["By ", selectedArticle.author] }), (0, jsx_runtime_1.jsx)("span", { children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { children: selectedArticle.readTime }), (0, jsx_runtime_1.jsx)("span", { children: "\u2022" }), (0, jsx_runtime_1.jsxs)("span", { children: [selectedArticle.views, " views"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "prose max-w-none text-slate-700", dangerouslySetInnerHTML: { __html: selectedArticle.content || '' } }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2", children: selectedArticle.tags.map(function (tag) { return ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700", children: tag }, tag)); }) })] })] }) }) })), isEditorOpen && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-bold text-slate-900", children: editorData.id ? 'Edit Article' : 'New Article' }), (0, jsx_runtime_1.jsx)("button", { className: "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200", onClick: function () { return setIsEditorOpen(false); }, children: "Close" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-xs text-slate-600 mb-1", children: "Title" }), (0, jsx_runtime_1.jsx)("input", { className: "w-full border border-slate-200 rounded px-3 py-2 text-sm", value: editorData.title, onChange: function (e) { return setEditorData(__assign(__assign({}, editorData), { title: e.target.value })); } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-xs text-slate-600 mb-1", children: "Category" }), (0, jsx_runtime_1.jsxs)("select", { className: "w-full border border-slate-200 rounded px-3 py-2 text-sm", value: editorData.category_id, onChange: function (e) { return setEditorData(__assign(__assign({}, editorData), { category_id: e.target.value })); }, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Select category" }), fetchedCategories.map(function (c) { return ((0, jsx_runtime_1.jsx)("option", { value: c.id, children: c.name }, c.id)); })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-xs text-slate-600 mb-1", children: "Difficulty" }), (0, jsx_runtime_1.jsxs)("select", { className: "w-full border border-slate-200 rounded px-3 py-2 text-sm", value: editorData.difficulty, onChange: function (e) { return setEditorData(__assign(__assign({}, editorData), { difficulty: e.target.value })); }, children: [(0, jsx_runtime_1.jsx)("option", { value: "beginner", children: "Beginner" }), (0, jsx_runtime_1.jsx)("option", { value: "intermediate", children: "Intermediate" }), (0, jsx_runtime_1.jsx)("option", { value: "advanced", children: "Advanced" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-xs text-slate-600 mb-1", children: "Author" }), (0, jsx_runtime_1.jsx)("input", { className: "w-full border border-slate-200 rounded px-3 py-2 text-sm", value: editorData.author, onChange: function (e) { return setEditorData(__assign(__assign({}, editorData), { author: e.target.value })); } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-xs text-slate-600 mb-1", children: "Read Time" }), (0, jsx_runtime_1.jsx)("input", { className: "w-full border border-slate-200 rounded px-3 py-2 text-sm", value: editorData.read_time, onChange: function (e) { return setEditorData(__assign(__assign({}, editorData), { read_time: e.target.value })); } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("input", { id: "featured", type: "checkbox", checked: !!editorData.featured, onChange: function (e) { return setEditorData(__assign(__assign({}, editorData), { featured: e.target.checked })); } }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "featured", className: "text-sm text-slate-700", children: "Featured" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-xs text-slate-600 mb-1", children: "Tags (comma separated)" }), (0, jsx_runtime_1.jsx)("input", { className: "w-full border border-slate-200 rounded px-3 py-2 text-sm", value: (editorData.tags || []).join(', '), onChange: function (e) { return setEditorData(__assign(__assign({}, editorData), { tags: e.target.value.split(',').map(function (t) { return t.trim(); }).filter(Boolean) })); } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 border border-slate-200 rounded px-2 py-1 bg-slate-50", children: [(0, jsx_runtime_1.jsx)("button", { className: "px-2 py-1 text-sm", onClick: function () { return document.execCommand('bold'); }, children: "Bold" }), (0, jsx_runtime_1.jsx)("button", { className: "px-2 py-1 text-sm", onClick: function () { return document.execCommand('italic'); }, children: "Italic" }), (0, jsx_runtime_1.jsx)("button", { className: "px-2 py-1 text-sm", onClick: function () { return document.execCommand('underline'); }, children: "Underline" }), (0, jsx_runtime_1.jsx)("button", { className: "px-2 py-1 text-sm", onClick: function () { return document.execCommand('insertUnorderedList'); }, children: "\u2022 List" }), (0, jsx_runtime_1.jsx)("button", { className: "px-2 py-1 text-sm", onClick: function () { return document.execCommand('insertOrderedList'); }, children: "1. List" }), (0, jsx_runtime_1.jsx)("button", { className: "px-2 py-1 text-sm", onClick: function () {
                                                            var url = prompt('Enter URL');
                                                            if (url)
                                                                document.execCommand('createLink', false, url);
                                                        }, children: "Link" })] }), (0, jsx_runtime_1.jsx)("div", { className: "border border-slate-200 rounded", children: (0, jsx_runtime_1.jsx)("div", { ref: editorRef, className: "min-h-[220px] p-3 text-sm prose max-w-none", contentEditable: true, suppressContentEditableWarning: true, onInput: function () { var _a; return setEditorData(__assign(__assign({}, editorData), { content: ((_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.innerHTML) || '' })); }, dangerouslySetInnerHTML: { __html: editorData.content } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-end gap-2", children: [(0, jsx_runtime_1.jsx)("button", { className: "px-3 py-1.5 border border-slate-200 rounded text-slate-700 text-sm", onClick: function () { return setIsEditorOpen(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { className: "px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm", onClick: function () { return __awaiter(void 0, void 0, void 0, function () {
                                                            var error_1, error_2, arts, error_3, e_2;
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0:
                                                                        _a.trys.push([0, 13, , 14]);
                                                                        if (!editorData.title || !editorData.category_id || !editorData.content) {
                                                                            toast_1.toast.warning('Title, Category, and Content are required');
                                                                            return [2 /*return*/];
                                                                        }
                                                                        if (!editorData.id) return [3 /*break*/, 5];
                                                                        _a.label = 1;
                                                                    case 1:
                                                                        _a.trys.push([1, 3, , 4]);
                                                                        return [4 /*yield*/, (0, knowledgeService_1.updateKnowledgeArticle)(editorData.id, {
                                                                                title: editorData.title,
                                                                                category_id: editorData.category_id,
                                                                                author: editorData.author,
                                                                                read_time: editorData.read_time,
                                                                                difficulty: editorData.difficulty,
                                                                                tags: editorData.tags,
                                                                                content: editorData.content,
                                                                                featured: editorData.featured,
                                                                                last_updated: new Date().toISOString().slice(0, 10)
                                                                            })];
                                                                    case 2:
                                                                        _a.sent();
                                                                        return [3 /*break*/, 4];
                                                                    case 3:
                                                                        error_1 = _a.sent();
                                                                        logger_1.logger.error('Failed to update knowledge article', error_1, 'Knowledge');
                                                                        throw error_1;
                                                                    case 4: return [3 /*break*/, 8];
                                                                    case 5:
                                                                        _a.trys.push([5, 7, , 8]);
                                                                        return [4 /*yield*/, (0, knowledgeService_1.createKnowledgeArticle)({
                                                                                title: editorData.title,
                                                                                category_id: editorData.category_id,
                                                                                author: editorData.author,
                                                                                publish_date: new Date().toISOString().slice(0, 10),
                                                                                last_updated: new Date().toISOString().slice(0, 10),
                                                                                read_time: editorData.read_time,
                                                                                difficulty: editorData.difficulty,
                                                                                rating: 0,
                                                                                views: 0,
                                                                                tags: editorData.tags,
                                                                                content: editorData.content,
                                                                                featured: editorData.featured
                                                                            })];
                                                                    case 6:
                                                                        _a.sent();
                                                                        return [3 /*break*/, 8];
                                                                    case 7:
                                                                        error_2 = _a.sent();
                                                                        logger_1.logger.error('Failed to create knowledge article', error_2, 'Knowledge');
                                                                        throw error_2;
                                                                    case 8:
                                                                        arts = void 0;
                                                                        _a.label = 9;
                                                                    case 9:
                                                                        _a.trys.push([9, 11, , 12]);
                                                                        return [4 /*yield*/, (0, knowledgeService_1.fetchKnowledgeArticles)()];
                                                                    case 10:
                                                                        arts = _a.sent();
                                                                        return [3 /*break*/, 12];
                                                                    case 11:
                                                                        error_3 = _a.sent();
                                                                        logger_1.logger.error('Failed to fetch knowledge articles after save', error_3, 'Knowledge');
                                                                        throw error_3;
                                                                    case 12:
                                                                        setFetchedArticles(arts);
                                                                        setIsEditorOpen(false);
                                                                        return [3 /*break*/, 14];
                                                                    case 13:
                                                                        e_2 = _a.sent();
                                                                        logger_1.logger.error('Failed to save article', e_2, 'Knowledge');
                                                                        toast_1.toast.error('Failed to save article');
                                                                        throw e_2;
                                                                    case 14: return [2 /*return*/];
                                                                }
                                                            });
                                                        }); }, children: "Save" })] })] })] }) }) }))] })] }));
};
exports.default = KnowledgePage;
