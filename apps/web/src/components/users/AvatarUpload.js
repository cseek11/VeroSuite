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
exports.default = AvatarUpload;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
function AvatarUpload(_a) {
    var _this = this;
    var userId = _a.userId, currentAvatarUrl = _a.currentAvatarUrl, onUploadComplete = _a.onUploadComplete, _b = _a.size, size = _b === void 0 ? 'md' : _b;
    var _c = (0, react_1.useState)(false), uploading = _c[0], setUploading = _c[1];
    var _d = (0, react_1.useState)(currentAvatarUrl || null), preview = _d[0], setPreview = _d[1];
    var _e = (0, react_1.useState)(null), error = _e[0], setError = _e[1];
    var fileInputRef = (0, react_1.useRef)(null);
    var sizeClasses = {
        sm: 'h-16 w-16',
        md: 'h-24 w-24',
        lg: 'h-32 w-32',
    };
    var handleFileSelect = function (event) { return __awaiter(_this, void 0, void 0, function () {
        var file, reader_1, token, tenantId, presignResponse, _a, upload_url, file_key, avatarUrl, err_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    file = (_b = event.target.files) === null || _b === void 0 ? void 0 : _b[0];
                    if (!file)
                        return [2 /*return*/];
                    // Validate file type
                    if (!file.type.startsWith('image/')) {
                        setError('Please select an image file');
                        return [2 /*return*/];
                    }
                    // Validate file size (max 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                        setError('Image size must be less than 5MB');
                        return [2 /*return*/];
                    }
                    setError(null);
                    setUploading(true);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, 5, 6]);
                    reader_1 = new FileReader();
                    reader_1.onloadend = function () {
                        setPreview(reader_1.result);
                    };
                    reader_1.readAsDataURL(file);
                    token = localStorage.getItem('verofield_auth')
                        ? JSON.parse(localStorage.getItem('verofield_auth')).token
                        : localStorage.getItem('jwt');
                    tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/v1/uploads/presign"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(token),
                                'x-tenant-id': tenantId,
                            },
                            body: JSON.stringify({
                                filename: "avatar-".concat(userId, "-").concat(Date.now(), ".").concat(file.name.split('.').pop()),
                                content_type: file.type,
                                file_size: file.size,
                            }),
                        })];
                case 2:
                    presignResponse = _c.sent();
                    if (!presignResponse.ok) {
                        throw new Error('Failed to get upload URL');
                    }
                    return [4 /*yield*/, presignResponse.json()];
                case 3:
                    _a = _c.sent(), upload_url = _a.upload_url, file_key = _a.file_key;
                    avatarUrl = upload_url || "https://mock-bucket.local/".concat(file_key);
                    // TODO: Update user's avatar_url via API
                    // For now, just call the callback
                    if (onUploadComplete) {
                        onUploadComplete(avatarUrl);
                    }
                    logger_1.logger.debug('Avatar upload complete', { avatarUrl: avatarUrl }, 'AvatarUpload');
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _c.sent();
                    logger_1.logger.error('Avatar upload error', err_1, 'AvatarUpload');
                    setError(err_1 instanceof Error ? err_1.message : 'Upload failed');
                    setPreview(currentAvatarUrl || null);
                    return [3 /*break*/, 6];
                case 5:
                    setUploading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleRemove = function () {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        // TODO: Call API to remove avatar
        if (onUploadComplete) {
            onUploadComplete('');
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center space-y-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "relative", children: preview ? ((0, jsx_runtime_1.jsxs)("div", { className: "".concat(sizeClasses[size], " rounded-full overflow-hidden border-2 border-gray-200 relative"), children: [(0, jsx_runtime_1.jsx)("img", { src: preview, alt: "Avatar", className: "w-full h-full object-cover" }), uploading && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-white" }) }))] })) : ((0, jsx_runtime_1.jsx)("div", { className: "".concat(sizeClasses[size], " rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center"), children: (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "".concat(size === 'lg' ? 'h-16 w-16' : size === 'md' ? 'h-12 w-12' : 'h-8 w-8', " text-gray-400") }) })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsxs)("label", { className: "cursor-pointer", children: [(0, jsx_runtime_1.jsx)("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleFileSelect, disabled: uploading, className: "hidden" }), (0, jsx_runtime_1.jsxs)("span", { className: "inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "h-4 w-4 mr-2" }), uploading ? 'Uploading...' : 'Upload'] })] }), preview && ((0, jsx_runtime_1.jsxs)("button", { onClick: handleRemove, disabled: uploading, className: "inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4 mr-2" }), "Remove"] }))] }), error && ((0, jsx_runtime_1.jsx)("div", { className: "text-sm text-red-600 text-center max-w-xs", children: error })), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 text-center max-w-xs", children: "JPG, PNG or GIF. Max size 5MB" })] }));
}
