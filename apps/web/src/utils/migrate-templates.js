"use strict";
/**
 * Template Migration Script
 * Migrates templates from localStorage to backend
 *
 * Usage: Call this function once when the app loads to migrate existing templates
 */
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
exports.isMigrationComplete = isMigrationComplete;
exports.migrateTemplates = migrateTemplates;
exports.initTemplateMigration = initTemplateMigration;
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var STORAGE_KEY = 'dashboard_templates';
var MIGRATION_FLAG = 'dashboard_templates_migrated';
/**
 * Check if migration has already been completed
 */
function isMigrationComplete() {
    return localStorage.getItem(MIGRATION_FLAG) === 'true';
}
/**
 * Mark migration as complete
 */
function markMigrationComplete() {
    localStorage.setItem(MIGRATION_FLAG, 'true');
}
/**
 * Get templates from localStorage
 */
function getLocalStorageTemplates() {
    try {
        var stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return [];
        }
        return JSON.parse(stored);
    }
    catch (error) {
        logger_1.logger.error('Failed to parse localStorage templates', { error: error }, 'migrate-templates');
        return [];
    }
}
/**
 * Migrate templates from localStorage to backend
 */
function migrateTemplates() {
    return __awaiter(this, void 0, void 0, function () {
        var templates, migrated, failed, skipped, _loop_1, _i, templates_1, template;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Check if already migrated
                    if (isMigrationComplete()) {
                        logger_1.logger.debug('Templates already migrated', {}, 'migrate-templates');
                        return [2 /*return*/, { migrated: 0, failed: 0, skipped: 0 }];
                    }
                    templates = getLocalStorageTemplates();
                    if (templates.length === 0) {
                        logger_1.logger.debug('No templates to migrate', {}, 'migrate-templates');
                        markMigrationComplete();
                        return [2 /*return*/, { migrated: 0, failed: 0, skipped: 0 }];
                    }
                    migrated = 0;
                    failed = 0;
                    skipped = 0;
                    logger_1.logger.info("Starting template migration: ".concat(templates.length, " templates found"), {}, 'migrate-templates');
                    _loop_1 = function (template) {
                        var existingTemplates, exists, templateData, error_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 3, , 4]);
                                    // Skip system templates (they should be created by the backend)
                                    if (template.is_system) {
                                        skipped++;
                                        logger_1.logger.debug("Skipping system template: ".concat(template.name), {}, 'migrate-templates');
                                        return [2 /*return*/, "continue"];
                                    }
                                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.templates.list()];
                                case 1:
                                    existingTemplates = _b.sent();
                                    exists = existingTemplates.some(function (t) { return t.name === template.name; });
                                    if (exists) {
                                        skipped++;
                                        logger_1.logger.debug("Template already exists: ".concat(template.name), {}, 'migrate-templates');
                                        return [2 /*return*/, "continue"];
                                    }
                                    templateData = {
                                        name: template.name,
                                        regions: template.regions || [],
                                        is_public: false
                                    };
                                    if (template.description)
                                        templateData.description = template.description;
                                    if (template.thumbnail)
                                        templateData.thumbnail = template.thumbnail;
                                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.templates.create(templateData)];
                                case 2:
                                    _b.sent();
                                    migrated++;
                                    logger_1.logger.debug("Migrated template: ".concat(template.name), {}, 'migrate-templates');
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_1 = _b.sent();
                                    failed++;
                                    logger_1.logger.error("Failed to migrate template: ".concat(template.name), { error: error_1, templateId: template.id }, 'migrate-templates');
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, templates_1 = templates;
                    _a.label = 1;
                case 1:
                    if (!(_i < templates_1.length)) return [3 /*break*/, 4];
                    template = templates_1[_i];
                    return [5 /*yield**/, _loop_1(template)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    // Mark migration as complete if at least some templates were processed
                    if (migrated > 0 || (templates.length > 0 && failed === 0)) {
                        markMigrationComplete();
                        // Optionally clear localStorage templates after successful migration
                        // Uncomment the line below if you want to remove templates from localStorage after migration
                        // localStorage.removeItem(STORAGE_KEY);
                    }
                    logger_1.logger.info("Template migration complete: ".concat(migrated, " migrated, ").concat(failed, " failed, ").concat(skipped, " skipped"), {}, 'migrate-templates');
                    return [2 /*return*/, { migrated: migrated, failed: failed, skipped: skipped }];
            }
        });
    });
}
/**
 * Initialize migration on app load
 * Call this from your app initialization code
 */
function initTemplateMigration() {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof window === 'undefined') {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, migrateTemplates()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    logger_1.logger.error('Template migration initialization failed', { error: error_2 }, 'migrate-templates');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
