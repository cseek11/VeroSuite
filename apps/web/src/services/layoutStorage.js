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
exports.layoutStorage = void 0;
var auth_1 = require("@/stores/auth");
var logger_1 = require("@/utils/logger");
var LayoutStorageServiceImpl = /** @class */ (function () {
    function LayoutStorageServiceImpl() {
    }
    Object.defineProperty(LayoutStorageServiceImpl.prototype, "getApiHeaders", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var authStore = auth_1.useAuthStore.getState();
            if (!authStore.token) {
                throw new Error('No authentication token found');
            }
            return {
                'Authorization': "Bearer ".concat(authStore.token),
                'Content-Type': 'application/json'
            };
        }
    });
    Object.defineProperty(LayoutStorageServiceImpl.prototype, "getApiBaseUrl", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
        }
    });
    Object.defineProperty(LayoutStorageServiceImpl.prototype, "saveLayout", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (name_1, layout_1, description_1, tags_1) {
            return __awaiter(this, arguments, void 0, function (name, layout, description, tags, isPublic) {
                var headers, apiUrl, layoutData, response, errorData, result, error_1;
                if (isPublic === void 0) { isPublic = false; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            headers = this.getApiHeaders();
                            apiUrl = this.getApiBaseUrl();
                            layoutData = {
                                name: name.trim(),
                                description: (description === null || description === void 0 ? void 0 : description.trim()) || null,
                                layout: layout,
                                tags: tags || [],
                                is_public: isPublic
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            return [4 /*yield*/, fetch("".concat(apiUrl, "/layouts"), {
                                    method: 'POST',
                                    headers: headers,
                                    body: JSON.stringify(layoutData)
                                })];
                        case 2:
                            response = _a.sent();
                            if (!!response.ok) return [3 /*break*/, 4];
                            return [4 /*yield*/, response.json().catch(function () { return ({ message: 'Unknown error' }); })];
                        case 3:
                            errorData = _a.sent();
                            throw new Error("Failed to save layout: ".concat(errorData.message || response.statusText));
                        case 4: return [4 /*yield*/, response.json()];
                        case 5:
                            result = _a.sent();
                            return [2 /*return*/, result];
                        case 6:
                            error_1 = _a.sent();
                            logger_1.logger.error('Error saving layout', error_1, 'layoutStorage');
                            throw error_1;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(LayoutStorageServiceImpl.prototype, "loadLayout", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var headers, apiUrl, response, errorData, result, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            headers = this.getApiHeaders();
                            apiUrl = this.getApiBaseUrl();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            return [4 /*yield*/, fetch("".concat(apiUrl, "/layouts/").concat(id), {
                                    method: 'GET',
                                    headers: headers
                                })];
                        case 2:
                            response = _a.sent();
                            if (!!response.ok) return [3 /*break*/, 4];
                            if (response.status === 404) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, response.json().catch(function () { return ({ message: 'Unknown error' }); })];
                        case 3:
                            errorData = _a.sent();
                            throw new Error("Failed to load layout: ".concat(errorData.message || response.statusText));
                        case 4: return [4 /*yield*/, response.json()];
                        case 5:
                            result = _a.sent();
                            return [2 /*return*/, result];
                        case 6:
                            error_2 = _a.sent();
                            logger_1.logger.error('Error loading layout', error_2, 'layoutStorage');
                            return [2 /*return*/, null];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(LayoutStorageServiceImpl.prototype, "loadLayoutData", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (layoutId) {
            return __awaiter(this, void 0, void 0, function () {
                var headers, apiUrl, response, errorData, result, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            headers = this.getApiHeaders();
                            apiUrl = this.getApiBaseUrl();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            return [4 /*yield*/, fetch("".concat(apiUrl, "/layouts/").concat(layoutId, "/data"), {
                                    method: 'GET',
                                    headers: headers
                                })];
                        case 2:
                            response = _a.sent();
                            if (!!response.ok) return [3 /*break*/, 4];
                            if (response.status === 404) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, response.json().catch(function () { return ({ message: 'Unknown error' }); })];
                        case 3:
                            errorData = _a.sent();
                            throw new Error("Failed to load layout data: ".concat(errorData.message || response.statusText));
                        case 4: return [4 /*yield*/, response.json()];
                        case 5:
                            result = _a.sent();
                            return [2 /*return*/, result];
                        case 6:
                            error_3 = _a.sent();
                            logger_1.logger.error('Error loading layout data', error_3, 'layoutStorage');
                            return [2 /*return*/, null];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(LayoutStorageServiceImpl.prototype, "getUserLayouts", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var headers, apiUrl, response, errorData, result, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            headers = this.getApiHeaders();
                            apiUrl = this.getApiBaseUrl();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            return [4 /*yield*/, fetch("".concat(apiUrl, "/layouts"), {
                                    method: 'GET',
                                    headers: headers
                                })];
                        case 2:
                            response = _a.sent();
                            if (!!response.ok) return [3 /*break*/, 4];
                            return [4 /*yield*/, response.json().catch(function () { return ({ message: 'Unknown error' }); })];
                        case 3:
                            errorData = _a.sent();
                            throw new Error("Failed to load user layouts: ".concat(errorData.message || response.statusText));
                        case 4: return [4 /*yield*/, response.json()];
                        case 5:
                            result = _a.sent();
                            return [2 /*return*/, result];
                        case 6:
                            error_4 = _a.sent();
                            logger_1.logger.error('Error loading user layouts', error_4, 'layoutStorage');
                            throw error_4;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(LayoutStorageServiceImpl.prototype, "deleteLayout", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var headers, apiUrl, response, errorData, result, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            headers = this.getApiHeaders();
                            apiUrl = this.getApiBaseUrl();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            return [4 /*yield*/, fetch("".concat(apiUrl, "/layouts/").concat(id), {
                                    method: 'DELETE',
                                    headers: headers
                                })];
                        case 2:
                            response = _a.sent();
                            if (!!response.ok) return [3 /*break*/, 4];
                            return [4 /*yield*/, response.json().catch(function () { return ({ message: 'Unknown error' }); })];
                        case 3:
                            errorData = _a.sent();
                            throw new Error("Failed to delete layout: ".concat(errorData.message || response.statusText));
                        case 4: return [4 /*yield*/, response.json()];
                        case 5:
                            result = _a.sent();
                            return [2 /*return*/, result.success || true];
                        case 6:
                            error_5 = _a.sent();
                            logger_1.logger.error('Error deleting layout', error_5, 'layoutStorage');
                            throw error_5;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(LayoutStorageServiceImpl.prototype, "updateLayout", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (id, updates) {
            return __awaiter(this, void 0, void 0, function () {
                var headers, apiUrl, response, errorData, result, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            headers = this.getApiHeaders();
                            apiUrl = this.getApiBaseUrl();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            return [4 /*yield*/, fetch("".concat(apiUrl, "/layouts/").concat(id), {
                                    method: 'PUT',
                                    headers: headers,
                                    body: JSON.stringify(updates)
                                })];
                        case 2:
                            response = _a.sent();
                            if (!!response.ok) return [3 /*break*/, 4];
                            if (response.status === 404) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, response.json().catch(function () { return ({ message: 'Unknown error' }); })];
                        case 3:
                            errorData = _a.sent();
                            throw new Error("Failed to update layout: ".concat(errorData.message || response.statusText));
                        case 4: return [4 /*yield*/, response.json()];
                        case 5:
                            result = _a.sent();
                            return [2 /*return*/, result];
                        case 6:
                            error_6 = _a.sent();
                            logger_1.logger.error('Error updating layout', error_6, 'layoutStorage');
                            return [2 /*return*/, null];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(LayoutStorageServiceImpl.prototype, "searchLayouts", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var headers, apiUrl, response, errorData, result, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            headers = this.getApiHeaders();
                            apiUrl = this.getApiBaseUrl();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            return [4 /*yield*/, fetch("".concat(apiUrl, "/layouts/search?q=").concat(encodeURIComponent(query)), {
                                    method: 'GET',
                                    headers: headers
                                })];
                        case 2:
                            response = _a.sent();
                            if (!!response.ok) return [3 /*break*/, 4];
                            return [4 /*yield*/, response.json().catch(function () { return ({ message: 'Unknown error' }); })];
                        case 3:
                            errorData = _a.sent();
                            throw new Error("Failed to search layouts: ".concat(errorData.message || response.statusText));
                        case 4: return [4 /*yield*/, response.json()];
                        case 5:
                            result = _a.sent();
                            return [2 /*return*/, result];
                        case 6:
                            error_7 = _a.sent();
                            logger_1.logger.error('Error searching layouts', error_7, 'layoutStorage');
                            throw error_7;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(LayoutStorageServiceImpl.prototype, "downloadLayout", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var headers, apiUrl, response, errorData, contentDisposition, filename, filenameMatch, blob, url, link, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            headers = this.getApiHeaders();
                            apiUrl = this.getApiBaseUrl();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            return [4 /*yield*/, fetch("".concat(apiUrl, "/layouts/").concat(id, "/download"), {
                                    method: 'GET',
                                    headers: headers
                                })];
                        case 2:
                            response = _a.sent();
                            if (!!response.ok) return [3 /*break*/, 4];
                            return [4 /*yield*/, response.json().catch(function () { return ({ message: 'Unknown error' }); })];
                        case 3:
                            errorData = _a.sent();
                            throw new Error("Failed to download layout: ".concat(errorData.message || response.statusText));
                        case 4:
                            contentDisposition = response.headers.get('Content-Disposition');
                            filename = 'layout.json';
                            if (contentDisposition) {
                                filenameMatch = contentDisposition.match(/filename="(.+)"/);
                                if (filenameMatch && filenameMatch[1]) {
                                    filename = filenameMatch[1];
                                }
                            }
                            return [4 /*yield*/, response.blob()];
                        case 5:
                            blob = _a.sent();
                            url = window.URL.createObjectURL(blob);
                            link = document.createElement('a');
                            link.href = url;
                            link.download = filename;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            window.URL.revokeObjectURL(url);
                            return [3 /*break*/, 7];
                        case 6:
                            error_8 = _a.sent();
                            logger_1.logger.error('Error downloading layout', error_8, 'layoutStorage');
                            throw error_8;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(LayoutStorageServiceImpl.prototype, "uploadLayout", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (file, name, description) {
            return __awaiter(this, void 0, void 0, function () {
                var fileContent, layoutData, layout, fileName, fileDescription, fileTags, error_9;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, file.text()];
                        case 1:
                            fileContent = _c.sent();
                            layoutData = JSON.parse(fileContent);
                            layout = layoutData.layout || layoutData;
                            fileName = name || file.name.replace('.json', '');
                            fileDescription = description || ((_a = layoutData.metadata) === null || _a === void 0 ? void 0 : _a.description) || '';
                            fileTags = ((_b = layoutData.metadata) === null || _b === void 0 ? void 0 : _b.tags) || [];
                            return [2 /*return*/, this.saveLayout(fileName, layout, fileDescription, fileTags)];
                        case 2:
                            error_9 = _c.sent();
                            logger_1.logger.error('Error uploading layout', error_9, 'layoutStorage');
                            throw new Error("Failed to upload layout: ".concat(error_9 instanceof Error ? error_9.message : 'Unknown error'));
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    });
    return LayoutStorageServiceImpl;
}());
// Export singleton instance
exports.layoutStorage = new LayoutStorageServiceImpl();
exports.default = exports.layoutStorage;
