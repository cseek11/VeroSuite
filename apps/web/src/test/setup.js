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
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom");
var vitest_1 = require("vitest");
// Mock IntersectionObserver
global.IntersectionObserver = vitest_1.vi.fn().mockImplementation(function () { return ({
    observe: vitest_1.vi.fn(),
    unobserve: vitest_1.vi.fn(),
    disconnect: vitest_1.vi.fn(),
}); });
// Mock ResizeObserver
global.ResizeObserver = vitest_1.vi.fn().mockImplementation(function () { return ({
    observe: vitest_1.vi.fn(),
    unobserve: vitest_1.vi.fn(),
    disconnect: vitest_1.vi.fn(),
}); });
// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vitest_1.vi.fn().mockImplementation(function (query) { return ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vitest_1.vi.fn(), // deprecated
        removeListener: vitest_1.vi.fn(), // deprecated
        addEventListener: vitest_1.vi.fn(),
        removeEventListener: vitest_1.vi.fn(),
        dispatchEvent: vitest_1.vi.fn(),
    }); }),
});
// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: vitest_1.vi.fn(),
});
// Mock localStorage
var localStorageMock = {
    getItem: vitest_1.vi.fn(),
    setItem: vitest_1.vi.fn(),
    removeItem: vitest_1.vi.fn(),
    clear: vitest_1.vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});
// Mock sessionStorage
var sessionStorageMock = {
    getItem: vitest_1.vi.fn(),
    setItem: vitest_1.vi.fn(),
    removeItem: vitest_1.vi.fn(),
    clear: vitest_1.vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
});
// Mock fetch
global.fetch = vitest_1.vi.fn();
// Mock console methods to reduce noise in tests
global.console = __assign(__assign({}, console), { log: vitest_1.vi.fn(), debug: vitest_1.vi.fn(), info: vitest_1.vi.fn(), warn: vitest_1.vi.fn(), error: vitest_1.vi.fn() });
// Mock environment variables
vitest_1.vi.mock('../lib/config', function () { return ({
    config: {
        supabaseUrl: 'https://test.supabase.co',
        supabaseAnonKey: 'test-anon-key',
        environment: 'test',
    },
}); });
// Mock enhancedApi
vitest_1.vi.mock('../lib/enhanced-api', function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual('../lib/enhanced-api')];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { enhancedApi: {
                            technicians: {
                                list: vitest_1.vi.fn().mockResolvedValue({ technicians: [], total: 0, page: 1, limit: 10, total_pages: 0 }),
                            },
                            accounts: {
                                search: vitest_1.vi.fn().mockResolvedValue([]),
                                getAll: vitest_1.vi.fn().mockResolvedValue([]),
                            },
                            workOrders: {
                                list: vitest_1.vi.fn().mockResolvedValue({ data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } }),
                            },
                        } })];
        }
    });
}); });
// Mock secureApiClient
vitest_1.vi.mock('../lib/secure-api-client', function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual('../lib/secure-api-client')];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { secureApiClient: {
                            getAllAccounts: vitest_1.vi.fn().mockResolvedValue([]),
                            getAccount: vitest_1.vi.fn().mockResolvedValue(null),
                            searchAccounts: vitest_1.vi.fn().mockResolvedValue([]),
                        } })];
        }
    });
}); });
// Mock React Router
vitest_1.vi.mock('react-router-dom', function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual('react-router-dom')];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { BrowserRouter: actual.BrowserRouter, useNavigate: function () { return vitest_1.vi.fn(); }, useLocation: function () { return ({ pathname: '/', search: '', hash: '', state: null }); }, useParams: function () { return ({}); } })];
        }
    });
}); });
// Mock lucide-react icons
vitest_1.vi.mock('lucide-react', function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual, React, createMockIcon;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual('lucide-react')];
            case 1:
                actual = _a.sent();
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('react')); })];
            case 2:
                React = _a.sent();
                createMockIcon = function (testId, className) {
                    return React.forwardRef(function (props, ref) {
                        return React.createElement('svg', __assign({ 'data-testid': testId, className: className, ref: ref }, props));
                    });
                };
                return [2 /*return*/, __assign(__assign({}, actual), { Users: createMockIcon('users-icon'), Mail: createMockIcon('mail-icon'), AlertTriangle: createMockIcon('alert-triangle-icon'), Loader2: createMockIcon('loader2-icon', 'animate-spin'), RefreshCw: createMockIcon('refresh-cw-icon'), Search: createMockIcon('search-icon'), X: createMockIcon('x-icon'), Home: createMockIcon('home-icon'), ArrowLeftIcon: createMockIcon('arrow-left-icon'), CheckIcon: createMockIcon('check-icon'), XMarkIcon: createMockIcon('x-mark-icon'), Tag: createMockIcon('tag-icon'), TagIcon: createMockIcon('tag-icon'), Pencil: createMockIcon('pencil-icon'), Phone: createMockIcon('phone-icon'), MapPin: createMockIcon('map-pin-icon'), Calendar: createMockIcon('calendar-icon'), Save: createMockIcon('save-icon'), User: createMockIcon('user-icon'), Clock: createMockIcon('clock-icon'), DollarSign: createMockIcon('dollar-sign-icon'), FileText: createMockIcon('file-text-icon'), Edit: createMockIcon('edit-icon'), Trash2: createMockIcon('trash2-icon'), Printer: createMockIcon('printer-icon'), CheckCircle: createMockIcon('check-circle-icon'), AlertCircle: createMockIcon('alert-circle-icon'), XCircle: createMockIcon('x-circle-icon'), Play: createMockIcon('play-icon'), History: createMockIcon('history-icon'), Building: createMockIcon('building-icon'), Briefcase: createMockIcon('briefcase-icon'), Plus: createMockIcon('plus-icon'), RotateCcw: createMockIcon('rotate-ccw-icon'), Eye: createMockIcon('eye-icon') })];
        }
    });
}); });
