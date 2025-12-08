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
exports.useCardTemplates = useCardTemplates;
var react_1 = require("react");
function useCardTemplates(_a) {
    var onApplyTemplate = _a.onApplyTemplate, onSaveTemplate = _a.onSaveTemplate, onDeleteTemplate = _a.onDeleteTemplate, _b = _a.userId, userId = _b === void 0 ? 'user' : _b;
    var _c = (0, react_1.useState)([]), templates = _c[0], setTemplates = _c[1];
    var _d = (0, react_1.useState)(false), isLoading = _d[0], _setIsLoading = _d[1];
    var _e = (0, react_1.useState)(''), searchTerm = _e[0], setSearchTerm = _e[1];
    var _f = (0, react_1.useState)('all'), selectedCategory = _f[0], setSelectedCategory = _f[1];
    var _g = (0, react_1.useState)([]), selectedTags = _g[0], setSelectedTags = _g[1];
    // Pre-built templates
    var defaultTemplates = (0, react_1.useMemo)(function () { return [
        {
            id: 'executive-dashboard',
            name: 'Executive Dashboard',
            description: 'High-level overview for executives and managers',
            category: 'dashboard',
            tags: ['executive', 'overview', 'kpis'],
            cards: [
                { type: 'smart-kpis', position: { x: 20, y: 20 }, size: { width: 300, height: 200 } },
                { type: 'financial-summary', position: { x: 340, y: 20 }, size: { width: 280, height: 200 } },
                { type: 'team-overview', position: { x: 640, y: 20 }, size: { width: 300, height: 200 } },
                { type: 'recent-activity', position: { x: 20, y: 240 }, size: { width: 400, height: 250 } },
                { type: 'customer-experience-panel', position: { x: 440, y: 240 }, size: { width: 500, height: 250 } }
            ],
            layout: {
                canvasWidth: 1200,
                canvasHeight: 600,
                zoom: 1,
                pan: { x: 0, y: 0 }
            },
            metadata: {
                author: 'system',
                version: '1.0.0',
                createdAt: new Date(),
                updatedAt: new Date(),
                isPublic: true,
                usageCount: 0
            }
        },
        {
            id: 'operational-center',
            name: 'Operational Center',
            description: 'Daily operations monitoring and management',
            category: 'operational',
            tags: ['operations', 'daily', 'monitoring'],
            cards: [
                { type: 'jobs-calendar', position: { x: 20, y: 20 }, size: { width: 400, height: 300 } },
                { type: 'technician-dispatch-panel', position: { x: 440, y: 20 }, size: { width: 350, height: 300 } },
                { type: 'inventory-compliance-panel', position: { x: 810, y: 20 }, size: { width: 300, height: 300 } },
                { type: 'routing', position: { x: 20, y: 340 }, size: { width: 500, height: 200 } },
                { type: 'reports', position: { x: 540, y: 340 }, size: { width: 400, height: 200 } }
            ],
            layout: {
                canvasWidth: 1200,
                canvasHeight: 600,
                zoom: 1,
                pan: { x: 0, y: 0 }
            },
            metadata: {
                author: 'system',
                version: '1.0.0',
                createdAt: new Date(),
                updatedAt: new Date(),
                isPublic: true,
                usageCount: 0
            }
        },
        {
            id: 'financial-focus',
            name: 'Financial Focus',
            description: 'Financial metrics and revenue tracking',
            category: 'financial',
            tags: ['financial', 'revenue', 'metrics'],
            cards: [
                { type: 'financial-summary', position: { x: 20, y: 20 }, size: { width: 350, height: 250 } },
                { type: 'smart-kpis', position: { x: 390, y: 20 }, size: { width: 400, height: 250 } },
                { type: 'reports', position: { x: 810, y: 20 }, size: { width: 300, height: 250 } },
                { type: 'customer-search', position: { x: 20, y: 290 }, size: { width: 500, height: 200 } },
                { type: 'quick-actions', position: { x: 540, y: 290 }, size: { width: 300, height: 200 } }
            ],
            layout: {
                canvasWidth: 1200,
                canvasHeight: 600,
                zoom: 1,
                pan: { x: 0, y: 0 }
            },
            metadata: {
                author: 'system',
                version: '1.0.0',
                createdAt: new Date(),
                updatedAt: new Date(),
                isPublic: true,
                usageCount: 0
            }
        },
        {
            id: 'customer-service',
            name: 'Customer Service',
            description: 'Customer-focused dashboard for service teams',
            category: 'customer',
            tags: ['customer', 'service', 'support'],
            cards: [
                { type: 'customer-experience-panel', position: { x: 20, y: 20 }, size: { width: 400, height: 300 } },
                { type: 'customer-search', position: { x: 440, y: 20 }, size: { width: 350, height: 300 } },
                { type: 'recent-activity', position: { x: 810, y: 20 }, size: { width: 300, height: 300 } },
                { type: 'jobs-calendar', position: { x: 20, y: 340 }, size: { width: 500, height: 200 } },
                { type: 'quick-actions', position: { x: 540, y: 340 }, size: { width: 400, height: 200 } }
            ],
            layout: {
                canvasWidth: 1200,
                canvasHeight: 600,
                zoom: 1,
                pan: { x: 0, y: 0 }
            },
            metadata: {
                author: 'system',
                version: '1.0.0',
                createdAt: new Date(),
                updatedAt: new Date(),
                isPublic: true,
                usageCount: 0
            }
        },
        {
            id: 'compliance-monitor',
            name: 'Compliance Monitor',
            description: 'Compliance tracking and reporting dashboard',
            category: 'compliance',
            tags: ['compliance', 'monitoring', 'reports'],
            cards: [
                { type: 'inventory-compliance-panel', position: { x: 20, y: 20 }, size: { width: 400, height: 300 } },
                { type: 'reports', position: { x: 440, y: 20 }, size: { width: 350, height: 300 } },
                { type: 'smart-kpis', position: { x: 810, y: 20 }, size: { width: 300, height: 300 } },
                { type: 'dashboard-metrics', position: { x: 20, y: 340 }, size: { width: 500, height: 200 } },
                { type: 'team-overview', position: { x: 540, y: 340 }, size: { width: 400, height: 200 } }
            ],
            layout: {
                canvasWidth: 1200,
                canvasHeight: 600,
                zoom: 1,
                pan: { x: 0, y: 0 }
            },
            metadata: {
                author: 'system',
                version: '1.0.0',
                createdAt: new Date(),
                updatedAt: new Date(),
                isPublic: true,
                usageCount: 0
            }
        }
    ]; }, []);
    // Initialize with default templates
    (0, react_1.useEffect)(function () {
        if (templates.length === 0) {
            setTemplates(defaultTemplates);
        }
    }, [defaultTemplates, templates.length]);
    // Filtered templates
    var filteredTemplates = (0, react_1.useMemo)(function () {
        return templates.filter(function (template) {
            var matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                template.tags.some(function (tag) { return tag.toLowerCase().includes(searchTerm.toLowerCase()); });
            var matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
            var matchesTags = selectedTags.length === 0 ||
                selectedTags.every(function (tag) { return template.tags.includes(tag); });
            return matchesSearch && matchesCategory && matchesTags;
        });
    }, [templates, searchTerm, selectedCategory, selectedTags]);
    // Get all unique categories
    var categories = (0, react_1.useMemo)(function () {
        var cats = __spreadArray([], new Set(templates.map(function (t) { return t.category; })), true);
        return __spreadArray(['all'], cats, true);
    }, [templates]);
    // Get all unique tags
    var allTags = (0, react_1.useMemo)(function () {
        var tags = templates.flatMap(function (t) { return t.tags; });
        return __spreadArray([], new Set(tags), true).sort();
    }, [templates]);
    // Apply template
    var applyTemplate = (0, react_1.useCallback)(function (template) {
        // Increment usage count
        setTemplates(function (prev) { return prev.map(function (t) {
            return t.id === template.id
                ? __assign(__assign({}, t), { metadata: __assign(__assign({}, t.metadata), { usageCount: t.metadata.usageCount + 1 }) }) : t;
        }); });
        onApplyTemplate === null || onApplyTemplate === void 0 ? void 0 : onApplyTemplate(template);
    }, [onApplyTemplate]);
    // Save template
    var saveTemplate = (0, react_1.useCallback)(function (templateData) {
        var newTemplate = __assign(__assign({}, templateData), { id: "template-".concat(Date.now()), metadata: {
                author: userId,
                version: '1.0.0',
                createdAt: new Date(),
                updatedAt: new Date(),
                isPublic: false,
                usageCount: 0
            } });
        setTemplates(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newTemplate], false); });
        onSaveTemplate === null || onSaveTemplate === void 0 ? void 0 : onSaveTemplate(newTemplate);
        return newTemplate;
    }, [userId, onSaveTemplate]);
    // Update template
    var updateTemplate = (0, react_1.useCallback)(function (templateId, updates) {
        setTemplates(function (prev) { return prev.map(function (template) {
            return template.id === templateId
                ? __assign(__assign(__assign({}, template), updates), { metadata: __assign(__assign({}, template.metadata), { updatedAt: new Date() }) }) : template;
        }); });
    }, []);
    // Delete template
    var deleteTemplate = (0, react_1.useCallback)(function (templateId) {
        setTemplates(function (prev) { return prev.filter(function (template) { return template.id !== templateId; }); });
        onDeleteTemplate === null || onDeleteTemplate === void 0 ? void 0 : onDeleteTemplate(templateId);
    }, [onDeleteTemplate]);
    // Duplicate template
    var duplicateTemplate = (0, react_1.useCallback)(function (template) {
        var duplicatedTemplate = __assign(__assign({}, template), { id: "template-".concat(Date.now()), name: "".concat(template.name, " (Copy)"), metadata: __assign(__assign({}, template.metadata), { author: userId, createdAt: new Date(), updatedAt: new Date(), isPublic: false, usageCount: 0 }) });
        setTemplates(function (prev) { return __spreadArray(__spreadArray([], prev, true), [duplicatedTemplate], false); });
        return duplicatedTemplate;
    }, [userId]);
    // Share template
    var shareTemplate = (0, react_1.useCallback)(function (templateId) {
        setTemplates(function (prev) { return prev.map(function (template) {
            return template.id === templateId
                ? __assign(__assign({}, template), { metadata: __assign(__assign({}, template.metadata), { isPublic: true }) }) : template;
        }); });
    }, []);
    // Unshare template
    var unshareTemplate = (0, react_1.useCallback)(function (templateId) {
        setTemplates(function (prev) { return prev.map(function (template) {
            return template.id === templateId
                ? __assign(__assign({}, template), { metadata: __assign(__assign({}, template.metadata), { isPublic: false }) }) : template;
        }); });
    }, []);
    // Create template from current layout
    var createFromLayout = (0, react_1.useCallback)(function (name, description, category, cards, layout, tags) {
        if (tags === void 0) { tags = []; }
        return saveTemplate({
            name: name,
            description: description,
            category: category,
            tags: tags,
            cards: cards.map(function (card) { return ({
                type: card.type,
                position: { x: card.x, y: card.y },
                size: { width: card.width, height: card.height },
                settings: card.settings || {}
            }); }),
            layout: {
                canvasWidth: layout.canvasWidth || 1200,
                canvasHeight: layout.canvasHeight || 600,
                zoom: layout.zoom || 1,
                pan: layout.pan || { x: 0, y: 0 }
            }
        });
    }, [saveTemplate]);
    // Get template by ID
    var getTemplateById = (0, react_1.useCallback)(function (id) {
        return templates.find(function (template) { return template.id === id; });
    }, [templates]);
    // Get templates by category
    var getTemplatesByCategory = (0, react_1.useCallback)(function (category) {
        return templates.filter(function (template) { return template.category === category; });
    }, [templates]);
    // Get popular templates (most used)
    var getPopularTemplates = (0, react_1.useCallback)(function (limit) {
        if (limit === void 0) { limit = 5; }
        return __spreadArray([], templates, true).sort(function (a, b) { return b.metadata.usageCount - a.metadata.usageCount; })
            .slice(0, limit);
    }, [templates]);
    // Get recent templates
    var getRecentTemplates = (0, react_1.useCallback)(function (limit) {
        if (limit === void 0) { limit = 5; }
        return __spreadArray([], templates, true).sort(function (a, b) { return b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime(); })
            .slice(0, limit);
    }, [templates]);
    // Export template to JSON
    var exportTemplate = (0, react_1.useCallback)(function (templateId) {
        var template = templates.find(function (t) { return t.id === templateId; });
        if (!template)
            return null;
        var exportData = __assign(__assign({}, template), { metadata: __assign(__assign({}, template.metadata), { exportedAt: new Date().toISOString(), version: '1.0.0' }) });
        var blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "".concat(template.name.replace(/[^a-z0-9]/gi, '_').toLowerCase(), "_template.json");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return exportData;
    }, [templates]);
    // Import template from JSON
    var importTemplate = (0, react_1.useCallback)(function (file) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var _a, _b;
                try {
                    var data = JSON.parse((_a = e.target) === null || _a === void 0 ? void 0 : _a.result);
                    // Validate template structure
                    if (!data.name || !data.cards || !Array.isArray(data.cards)) {
                        throw new Error('Invalid template format');
                    }
                    var importedTemplate_1 = __assign(__assign({}, data), { id: "template-".concat(Date.now()), metadata: __assign(__assign({}, data.metadata), { author: userId, createdAt: new Date(), updatedAt: new Date(), isPublic: false, usageCount: 0, version: ((_b = data.metadata) === null || _b === void 0 ? void 0 : _b.version) || '1.0.0' }) });
                    setTemplates(function (prev) { return __spreadArray(__spreadArray([], prev, true), [importedTemplate_1], false); });
                    resolve(importedTemplate_1);
                }
                catch (error) {
                    reject(new Error('Failed to import template: Invalid format'));
                }
            };
            reader.onerror = function () { return reject(new Error('Failed to read file')); };
            reader.readAsText(file);
        });
    }, [userId]);
    // Create template version
    var createTemplateVersion = (0, react_1.useCallback)(function (templateId, versionName) {
        var template = templates.find(function (t) { return t.id === templateId; });
        if (!template)
            return null;
        var newVersion = __assign(__assign({}, template), { id: "template-".concat(Date.now()), name: "".concat(template.name, " - ").concat(versionName), metadata: __assign(__assign({}, template.metadata), { author: userId, createdAt: new Date(), updatedAt: new Date(), version: versionName, isPublic: false, usageCount: 0 }) });
        setTemplates(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newVersion], false); });
        return newVersion;
    }, [templates, userId]);
    // Get template versions
    var getTemplateVersions = (0, react_1.useCallback)(function (baseTemplateName) {
        return templates.filter(function (t) {
            return t.name.startsWith(baseTemplateName) ||
                t.name.includes(baseTemplateName);
        }).sort(function (a, b) { return b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime(); });
    }, [templates]);
    // Search and filter functions
    var setSearch = (0, react_1.useCallback)(function (term) {
        setSearchTerm(term);
    }, []);
    var setCategory = (0, react_1.useCallback)(function (category) {
        setSelectedCategory(category);
    }, []);
    var setTags = (0, react_1.useCallback)(function (tags) {
        setSelectedTags(tags);
    }, []);
    var toggleTag = (0, react_1.useCallback)(function (tag) {
        setSelectedTags(function (prev) {
            return prev.includes(tag)
                ? prev.filter(function (t) { return t !== tag; })
                : __spreadArray(__spreadArray([], prev, true), [tag], false);
        });
    }, []);
    var clearFilters = (0, react_1.useCallback)(function () {
        setSearchTerm('');
        setSelectedCategory('all');
        setSelectedTags([]);
    }, []);
    return {
        // State
        templates: templates,
        filteredTemplates: filteredTemplates,
        isLoading: isLoading,
        searchTerm: searchTerm,
        selectedCategory: selectedCategory,
        selectedTags: selectedTags,
        categories: categories,
        allTags: allTags,
        // Actions
        applyTemplate: applyTemplate,
        saveTemplate: saveTemplate,
        updateTemplate: updateTemplate,
        deleteTemplate: deleteTemplate,
        duplicateTemplate: duplicateTemplate,
        shareTemplate: shareTemplate,
        unshareTemplate: unshareTemplate,
        createFromLayout: createFromLayout,
        exportTemplate: exportTemplate,
        importTemplate: importTemplate,
        createTemplateVersion: createTemplateVersion,
        // Getters
        getTemplateById: getTemplateById,
        getTemplatesByCategory: getTemplatesByCategory,
        getPopularTemplates: getPopularTemplates,
        getRecentTemplates: getRecentTemplates,
        getTemplateVersions: getTemplateVersions,
        // Search and filter
        setSearch: setSearch,
        setCategory: setCategory,
        setTags: setTags,
        toggleTag: toggleTag,
        clearFilters: clearFilters,
        // Computed
        hasFilters: searchTerm || selectedCategory !== 'all' || selectedTags.length > 0
    };
}
