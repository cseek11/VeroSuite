"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTemplateAnalytics = exports.useSearchKpiTemplates = exports.useKpiTemplatesByCategory = exports.useDeleteUserKpi = exports.useUpdateUserKpi = exports.useCreateUserKpi = exports.useUserKpi = exports.useUserKpis = exports.useTemplateFavoriteStatus = exports.useFavoritedTemplates = exports.useFavoriteTemplate = exports.useTrackTemplateUsage = exports.useUseKpiTemplate = exports.useDeleteKpiTemplate = exports.useUpdateKpiTemplate = exports.useCreateKpiTemplate = exports.useFeaturedKpiTemplates = exports.usePopularKpiTemplates = exports.useKpiTemplate = exports.useKpiTemplates = void 0;
var react_query_1 = require("@tanstack/react-query");
var enhanced_api_1 = require("@/lib/enhanced-api");
var queryClient_1 = require("@/lib/queryClient");
var logger_1 = require("@/utils/logger");
// ============================================================================
// KPI TEMPLATES HOOKS
// ============================================================================
// Hook to get all KPI templates with filtering
var useKpiTemplates = function (filters) {
    if (filters === void 0) { filters = {}; }
    var result = (0, react_query_1.useQuery)({
        queryKey: queryClient_1.queryKeys.kpiTemplates.list(filters),
        queryFn: function () {
            logger_1.logger.debug('useKpiTemplates calling API', { filters: filters }, 'useKpiTemplates');
            return enhanced_api_1.enhancedApi.kpiTemplates.list(filters);
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
    // Reduced debug logging for performance (development only)
    if (process.env.NODE_ENV === 'development') {
        logger_1.logger.debug('useKpiTemplates result', {
            dataCount: Array.isArray(result.data) ? result.data.length : 0,
            isLoading: result.isLoading,
            status: result.status
        }, 'useKpiTemplates');
    }
    return result;
};
exports.useKpiTemplates = useKpiTemplates;
// Hook to get a specific KPI template
var useKpiTemplate = function (id) {
    return (0, react_query_1.useQuery)({
        queryKey: queryClient_1.queryKeys.kpiTemplates.detail(id),
        queryFn: function () { return enhanced_api_1.enhancedApi.kpiTemplates.get(id); },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
exports.useKpiTemplate = useKpiTemplate;
// Hook to get popular KPI templates
var usePopularKpiTemplates = function (limit) {
    if (limit === void 0) { limit = 10; }
    return (0, react_query_1.useQuery)({
        queryKey: queryClient_1.queryKeys.kpiTemplates.popular(limit),
        queryFn: function () { return enhanced_api_1.enhancedApi.kpiTemplates.getPopular(limit); },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};
exports.usePopularKpiTemplates = usePopularKpiTemplates;
// Hook to get featured KPI templates
var useFeaturedKpiTemplates = function () {
    return (0, react_query_1.useQuery)({
        queryKey: queryClient_1.queryKeys.kpiTemplates.featured(),
        queryFn: function () { return enhanced_api_1.enhancedApi.kpiTemplates.getFeatured(); },
        staleTime: 15 * 60 * 1000, // 15 minutes
    });
};
exports.useFeaturedKpiTemplates = useFeaturedKpiTemplates;
// Hook to create a new KPI template
var useCreateKpiTemplate = function () {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (data) { return enhanced_api_1.enhancedApi.kpiTemplates.create(data); },
        onSuccess: function () {
            // Invalidate and refetch KPI templates
            queryClient.invalidateQueries({ queryKey: queryClient_1.queryKeys.kpiTemplates.all });
            queryClient.invalidateQueries({ queryKey: queryClient_1.queryKeys.kpiTemplates.featured() });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to create KPI template', error, 'useKpiTemplates');
        },
    });
};
exports.useCreateKpiTemplate = useCreateKpiTemplate;
// Hook to update a KPI template
var useUpdateKpiTemplate = function () {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var id = _a.id, data = _a.data;
            return enhanced_api_1.enhancedApi.kpiTemplates.update(id, data);
        },
        onSuccess: function (_data, variables) {
            // Update the specific template in cache
            queryClient.setQueryData(queryClient_1.queryKeys.kpiTemplates.detail(variables.id), _data);
            // Invalidate lists to ensure consistency
            queryClient.invalidateQueries({ queryKey: queryClient_1.queryKeys.kpiTemplates.lists() });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to update KPI template', error, 'useKpiTemplates');
        },
    });
};
exports.useUpdateKpiTemplate = useUpdateKpiTemplate;
// Hook to delete a KPI template
var useDeleteKpiTemplate = function () {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (id) { return enhanced_api_1.enhancedApi.kpiTemplates.delete(id); },
        onSuccess: function (_, id) {
            // Remove the template from cache
            queryClient.removeQueries({ queryKey: queryClient_1.queryKeys.kpiTemplates.detail(id) });
            // Invalidate lists
            queryClient.invalidateQueries({ queryKey: queryClient_1.queryKeys.kpiTemplates.lists() });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to delete KPI template', error, 'useKpiTemplates');
        },
    });
};
exports.useDeleteKpiTemplate = useDeleteKpiTemplate;
// Hook to use a template to create a user KPI
var useUseKpiTemplate = function () {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var templateId = _a.templateId, data = _a.data;
            return enhanced_api_1.enhancedApi.kpiTemplates.useTemplate(templateId, data);
        },
        onSuccess: function () {
            // Invalidate user KPIs and template lists
            queryClient.invalidateQueries({ queryKey: queryClient_1.queryKeys.userKpis.all });
            queryClient.invalidateQueries({ queryKey: queryClient_1.queryKeys.kpiTemplates.lists() });
            queryClient.invalidateQueries({ queryKey: queryClient_1.queryKeys.kpiTemplates.popular() });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to use KPI template', error, 'useKpiTemplates');
        },
    });
};
exports.useUseKpiTemplate = useUseKpiTemplate;
// Hook to track template usage
var useTrackTemplateUsage = function () {
    return (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var templateId = _a.templateId, action = _a.action;
            return enhanced_api_1.enhancedApi.kpiTemplates.trackUsage(templateId, action);
        },
        onError: function (error) {
            logger_1.logger.error('Failed to track template usage', error, 'useKpiTemplates');
        },
    });
};
exports.useTrackTemplateUsage = useTrackTemplateUsage;
// Hook to favorite/unfavorite a template
var useFavoriteTemplate = function () {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var templateId = _a.templateId, isFavorited = _a.isFavorited;
            var action = isFavorited ? 'favorited' : 'unfavorited';
            logger_1.logger.debug('Favorite API call', { templateId: templateId, action: action }, 'useKpiTemplates');
            return enhanced_api_1.enhancedApi.kpiTemplates.trackUsage(templateId, action);
        },
        onSuccess: function (_data, variables) {
            logger_1.logger.debug('Favorite mutation successful', { templateId: variables.templateId, action: variables.isFavorited ? 'favorited' : 'unfavorited' }, 'useKpiTemplates');
            // Invalidate template queries to refresh the data
            queryClient.invalidateQueries({ queryKey: queryClient_1.queryKeys.kpiTemplates.all });
            queryClient.invalidateQueries({ queryKey: queryClient_1.queryKeys.kpiTemplates.featured() });
            queryClient.invalidateQueries({ queryKey: queryClient_1.queryKeys.kpiTemplates.popular() });
            queryClient.invalidateQueries({ queryKey: queryClient_1.queryKeys.kpiTemplates.favorites() });
            // Also invalidate the specific template's favorite status
            queryClient.invalidateQueries({ queryKey: ['kpi-templates', 'favorite-status', variables.templateId] });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to favorite/unfavorite template', error, 'useKpiTemplates');
        },
    });
};
exports.useFavoriteTemplate = useFavoriteTemplate;
// Hook to get user's favorited templates
var useFavoritedTemplates = function () {
    return (0, react_query_1.useQuery)({
        queryKey: queryClient_1.queryKeys.kpiTemplates.favorites(),
        queryFn: function () {
            logger_1.logger.debug('useFavoritedTemplates calling API', {}, 'useKpiTemplates');
            return enhanced_api_1.enhancedApi.kpiTemplates.getFavorites();
        },
        staleTime: 1 * 60 * 1000, // 1 minute (shorter for favorites)
        refetchOnWindowFocus: true, // Refetch when window regains focus
        refetchOnMount: true, // Always refetch when component mounts
    });
};
exports.useFavoritedTemplates = useFavoritedTemplates;
// Hook to check if a template is favorited
var useTemplateFavoriteStatus = function (templateId) {
    return (0, react_query_1.useQuery)({
        queryKey: ['kpi-templates', 'favorite-status', templateId],
        queryFn: function () { return enhanced_api_1.enhancedApi.kpiTemplates.getFavoriteStatus(templateId); },
        enabled: !!templateId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};
exports.useTemplateFavoriteStatus = useTemplateFavoriteStatus;
// ============================================================================
// USER KPIS HOOKS
// ============================================================================
// Hook to get user's KPIs
var useUserKpis = function (filters) {
    if (filters === void 0) { filters = {}; }
    var result = (0, react_query_1.useQuery)({
        queryKey: queryClient_1.queryKeys.userKpis.list(filters),
        queryFn: function () {
            logger_1.logger.debug('useUserKpis calling API', { filters: filters }, 'useKpiTemplates');
            return enhanced_api_1.enhancedApi.userKpis.list();
        },
        staleTime: 2 * 60 * 1000, // 2 minutes (user KPIs change more frequently)
    });
    // Reduced debug logging for performance
    if (process.env.NODE_ENV === 'development') {
        logger_1.logger.debug('useUserKpis result', {
            dataCount: Array.isArray(result.data) ? result.data.length : 0,
            isLoading: result.isLoading,
            status: result.status
        }, 'useKpiTemplates');
    }
    return result;
};
exports.useUserKpis = useUserKpis;
// Hook to get a specific user KPI
var useUserKpi = function (id) {
    return (0, react_query_1.useQuery)({
        queryKey: queryClient_1.queryKeys.userKpis.detail(id),
        queryFn: function () { return enhanced_api_1.enhancedApi.userKpis.get(id); },
        enabled: !!id,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};
exports.useUserKpi = useUserKpi;
// Hook to create a new user KPI
var useCreateUserKpi = function () {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (data) { return enhanced_api_1.enhancedApi.userKpis.create(data); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: queryClient_1.queryKeys.userKpis.all });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to create user KPI', error, 'useKpiTemplates');
        },
    });
};
exports.useCreateUserKpi = useCreateUserKpi;
// Hook to update a user KPI
var useUpdateUserKpi = function () {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var id = _a.id, data = _a.data;
            return enhanced_api_1.enhancedApi.userKpis.update(id, data);
        },
        onSuccess: function (data, variables) {
            queryClient.setQueryData(queryClient_1.queryKeys.userKpis.detail(variables.id), data);
            queryClient.invalidateQueries({ queryKey: queryClient_1.queryKeys.userKpis.lists() });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to update user KPI', error, 'useKpiTemplates');
        },
    });
};
exports.useUpdateUserKpi = useUpdateUserKpi;
// Hook to delete a user KPI
var useDeleteUserKpi = function () {
    var queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: function (id) { return enhanced_api_1.enhancedApi.userKpis.delete(id); },
        onSuccess: function (_, id) {
            queryClient.removeQueries({ queryKey: queryClient_1.queryKeys.userKpis.detail(id) });
            queryClient.invalidateQueries({ queryKey: queryClient_1.queryKeys.userKpis.lists() });
        },
        onError: function (error) {
            logger_1.logger.error('Failed to delete user KPI', error, 'useKpiTemplates');
        },
    });
};
exports.useDeleteUserKpi = useDeleteUserKpi;
// ============================================================================
// UTILITY HOOKS
// ============================================================================
// Hook to get templates by category
var useKpiTemplatesByCategory = function (category) {
    return (0, react_query_1.useQuery)({
        queryKey: queryClient_1.queryKeys.kpiTemplates.list({ category: category }),
        queryFn: function () { return enhanced_api_1.enhancedApi.kpiTemplates.list({ category: category }); },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
exports.useKpiTemplatesByCategory = useKpiTemplatesByCategory;
// Hook to search templates
var useSearchKpiTemplates = function (searchTerm) {
    return (0, react_query_1.useQuery)({
        queryKey: queryClient_1.queryKeys.kpiTemplates.list({ search: searchTerm }),
        queryFn: function () { return enhanced_api_1.enhancedApi.kpiTemplates.list({ search: searchTerm }); },
        enabled: searchTerm.length >= 2, // Only search with 2+ characters
        staleTime: 2 * 60 * 1000, // 2 minutes (search results change frequently)
    });
};
exports.useSearchKpiTemplates = useSearchKpiTemplates;
// Hook to get template usage analytics
var useTemplateAnalytics = function (templateId) {
    return (0, react_query_1.useQuery)({
        queryKey: ['template-analytics', templateId],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // This would be implemented when analytics endpoints are available
                // For now, return mock data
                return [2 /*return*/, {
                        views: 0,
                        uses: 0,
                        favorites: 0,
                        shares: 0,
                    }];
            });
        }); },
        enabled: !!templateId,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};
exports.useTemplateAnalytics = useTemplateAnalytics;
