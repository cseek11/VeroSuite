"use strict";
/**
 * PWA Utilities
 * Handles service worker registration, offline detection, and install prompts
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
exports.registerServiceWorker = registerServiceWorker;
exports.isInstalled = isInstalled;
exports.isOnline = isOnline;
exports.onOnlineStatusChange = onOnlineStatusChange;
exports.showInstallPrompt = showInstallPrompt;
exports.canInstall = canInstall;
exports.initPWA = initPWA;
exports.getCacheSize = getCacheSize;
exports.clearCache = clearCache;
var deferredPrompt = null;
/**
 * Register service worker
 */
function registerServiceWorker() {
    return __awaiter(this, void 0, void 0, function () {
        var registration_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!('serviceWorker' in navigator)) {
                        console.warn('Service workers are not supported');
                        return [2 /*return*/, null];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, navigator.serviceWorker.register('/service-worker.js', {
                            scope: '/'
                        })];
                case 2:
                    registration_1 = _a.sent();
                    console.log('Service Worker registered:', registration_1);
                    // Handle updates
                    registration_1.addEventListener('updatefound', function () {
                        var newWorker = registration_1.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', function () {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New service worker available
                                    console.log('New service worker available');
                                    // You can show a notification to the user here
                                }
                            });
                        }
                    });
                    return [2 /*return*/, registration_1];
                case 3:
                    error_1 = _a.sent();
                    console.error('Service Worker registration failed:', error_1);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Check if app is installed
 */
function isInstalled() {
    return (window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://'));
}
/**
 * Check if app is online
 */
function isOnline() {
    return navigator.onLine;
}
/**
 * Listen for online/offline events
 */
function onOnlineStatusChange(callback) {
    var handleOnline = function () { return callback(true); };
    var handleOffline = function () { return callback(false); };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    // Return cleanup function
    return function () {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
}
/**
 * Show install prompt
 */
function showInstallPrompt() {
    return __awaiter(this, void 0, void 0, function () {
        var outcome, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!deferredPrompt) {
                        return [2 /*return*/, false];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, deferredPrompt.prompt()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, deferredPrompt.userChoice];
                case 3:
                    outcome = (_a.sent()).outcome;
                    deferredPrompt = null;
                    return [2 /*return*/, outcome === 'accepted'];
                case 4:
                    error_2 = _a.sent();
                    console.error('Error showing install prompt:', error_2);
                    return [2 /*return*/, false];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Check if install prompt is available
 */
function canInstall() {
    return deferredPrompt !== null;
}
/**
 * Initialize PWA features
 */
function initPWA() {
    // Register service worker
    if (typeof window !== 'undefined') {
        registerServiceWorker();
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', function (e) {
            e.preventDefault();
            deferredPrompt = e;
            console.log('Install prompt available');
            // Dispatch custom event for UI to show install button
            window.dispatchEvent(new CustomEvent('pwa-installable'));
        });
        // Listen for app installed
        window.addEventListener('appinstalled', function () {
            console.log('PWA installed');
            deferredPrompt = null;
            window.dispatchEvent(new CustomEvent('pwa-installed'));
        });
    }
}
/**
 * Get cache size (approximate)
 */
function getCacheSize() {
    return __awaiter(this, void 0, void 0, function () {
        var cacheNames, totalSize, _i, cacheNames_1, cacheName, cache, keys, _a, keys_1, request, response, blob, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!('caches' in window)) {
                        return [2 /*return*/, 0];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 12, , 13]);
                    return [4 /*yield*/, caches.keys()];
                case 2:
                    cacheNames = _b.sent();
                    totalSize = 0;
                    _i = 0, cacheNames_1 = cacheNames;
                    _b.label = 3;
                case 3:
                    if (!(_i < cacheNames_1.length)) return [3 /*break*/, 11];
                    cacheName = cacheNames_1[_i];
                    return [4 /*yield*/, caches.open(cacheName)];
                case 4:
                    cache = _b.sent();
                    return [4 /*yield*/, cache.keys()];
                case 5:
                    keys = _b.sent();
                    _a = 0, keys_1 = keys;
                    _b.label = 6;
                case 6:
                    if (!(_a < keys_1.length)) return [3 /*break*/, 10];
                    request = keys_1[_a];
                    return [4 /*yield*/, cache.match(request)];
                case 7:
                    response = _b.sent();
                    if (!response) return [3 /*break*/, 9];
                    return [4 /*yield*/, response.blob()];
                case 8:
                    blob = _b.sent();
                    totalSize += blob.size;
                    _b.label = 9;
                case 9:
                    _a++;
                    return [3 /*break*/, 6];
                case 10:
                    _i++;
                    return [3 /*break*/, 3];
                case 11: return [2 /*return*/, totalSize];
                case 12:
                    error_3 = _b.sent();
                    console.error('Error calculating cache size:', error_3);
                    return [2 /*return*/, 0];
                case 13: return [2 /*return*/];
            }
        });
    });
}
/**
 * Clear all caches
 */
function clearCache() {
    return __awaiter(this, void 0, void 0, function () {
        var cacheNames, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!('caches' in window)) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, caches.keys()];
                case 2:
                    cacheNames = _a.sent();
                    return [4 /*yield*/, Promise.all(cacheNames.map(function (name) { return caches.delete(name); }))];
                case 3:
                    _a.sent();
                    console.log('Cache cleared');
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    console.error('Error clearing cache:', error_4);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
