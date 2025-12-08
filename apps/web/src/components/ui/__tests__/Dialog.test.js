"use strict";
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
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Dialog Component Tests
 *
 * Tests for the Dialog component including:
 * - Modal rendering
 * - Open/close functionality
 * - Backdrop click
 * - Escape key handling
 * - Dialog content, header, footer
 */
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var Dialog_1 = require("../Dialog");
(0, vitest_1.describe)('Dialog', function () {
    var mockOnOpenChange = vitest_1.vi.fn();
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Rendering', function () {
        (0, vitest_1.it)('should not render when open is false', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: false, onOpenChange: mockOnOpenChange, children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogContent, { children: "Test Content" }) }));
            (0, vitest_1.expect)(react_1.screen.queryByText('Test Content')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should render when open is true', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: true, onOpenChange: mockOnOpenChange, children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogContent, { children: "Test Content" }) }));
            (0, vitest_1.expect)(react_1.screen.getByText('Test Content')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render dialog with backdrop', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: true, onOpenChange: mockOnOpenChange, children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogContent, { children: "Test Content" }) }));
            var backdrop = document.querySelector('.fixed.inset-0.bg-black');
            (0, vitest_1.expect)(backdrop).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Open/Close Functionality', function () {
        (0, vitest_1.it)('should call onOpenChange when backdrop is clicked', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: true, onOpenChange: mockOnOpenChange, children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogContent, { children: "Test Content" }) }));
            var backdrop = document.querySelector('.fixed.inset-0.bg-black');
            react_1.fireEvent.click(backdrop);
            (0, vitest_1.expect)(mockOnOpenChange).toHaveBeenCalledWith(false);
        });
        (0, vitest_1.it)('should call onOpenChange when DialogClose is clicked', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: true, onOpenChange: mockOnOpenChange, children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogContent, { children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogClose, { children: "Close" }) }) }));
            var closeButton = react_1.screen.getByText('Close');
            react_1.fireEvent.click(closeButton);
            (0, vitest_1.expect)(mockOnOpenChange).toHaveBeenCalledWith(false);
        });
    });
    (0, vitest_1.describe)('DialogContent', function () {
        (0, vitest_1.it)('should render dialog content', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: true, onOpenChange: mockOnOpenChange, children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogContent, { children: "Content" }) }));
            (0, vitest_1.expect)(react_1.screen.getByText('Content')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply custom className', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: true, onOpenChange: mockOnOpenChange, children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogContent, { className: "custom-class", children: "Content" }) }));
            var content = react_1.screen.getByText('Content').closest('.bg-white');
            (0, vitest_1.expect)(content).toHaveClass('custom-class');
        });
    });
    (0, vitest_1.describe)('DialogHeader', function () {
        (0, vitest_1.it)('should render dialog header', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: true, onOpenChange: mockOnOpenChange, children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogContent, { children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogHeader, { children: "Header" }) }) }));
            (0, vitest_1.expect)(react_1.screen.getByText('Header')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('DialogTitle', function () {
        (0, vitest_1.it)('should render dialog title', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: true, onOpenChange: mockOnOpenChange, children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogContent, { children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: "Dialog Title" }) }) }));
            (0, vitest_1.expect)(react_1.screen.getByText('Dialog Title')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply custom className', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: true, onOpenChange: mockOnOpenChange, children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogContent, { children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { className: "custom-title", children: "Title" }) }) }));
            var title = react_1.screen.getByText('Title');
            (0, vitest_1.expect)(title).toHaveClass('custom-title');
        });
    });
    (0, vitest_1.describe)('DialogDescription', function () {
        (0, vitest_1.it)('should render dialog description', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: true, onOpenChange: mockOnOpenChange, children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogContent, { children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogDescription, { children: "Description text" }) }) }));
            (0, vitest_1.expect)(react_1.screen.getByText('Description text')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('DialogFooter', function () {
        (0, vitest_1.it)('should render dialog footer', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: true, onOpenChange: mockOnOpenChange, children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogContent, { children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogFooter, { children: "Footer" }) }) }));
            (0, vitest_1.expect)(react_1.screen.getByText('Footer')).toBeInTheDocument();
        });
        // Regression Prevention: DIALOG_FOOTER_EXPORT_MISSING - 2025-11-16
        // Pattern: DIALOG_FOOTER_EXPORT_MISSING (see docs/error-patterns.md)
        // Test ensures DialogFooter is properly exported and importable
        (0, vitest_1.it)('should be importable from index file', function () {
            // This test prevents regression of the bug where DialogFooter was defined
            // but not exported, causing "does not provide an export named 'DialogFooter'"
            (0, vitest_1.expect)(Dialog_1.DialogFooter).toBeDefined();
            (0, vitest_1.expect)(typeof Dialog_1.DialogFooter).toBe('function');
        });
        (0, vitest_1.it)('should be importable from ui/index.ts', function () { return __awaiter(void 0, void 0, void 0, function () {
            var uiIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../index')); })];
                    case 1:
                        uiIndex = _a.sent();
                        (0, vitest_1.expect)(uiIndex.DialogFooter).toBeDefined();
                        (0, vitest_1.expect)(typeof uiIndex.DialogFooter).toBe('function');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('DialogClose', function () {
        (0, vitest_1.it)('should throw error when used outside Dialog context', function () {
            // Suppress console.error for this test
            var consoleError = vitest_1.vi.spyOn(console, 'error').mockImplementation(function () { });
            (0, vitest_1.expect)(function () {
                (0, react_1.render)((0, jsx_runtime_1.jsx)(Dialog_1.DialogClose, { children: "Close" }));
            }).toThrow('DialogClose must be used within a Dialog');
            consoleError.mockRestore();
        });
        (0, vitest_1.it)('should close dialog when clicked', function () {
            (0, react_1.render)((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: true, onOpenChange: mockOnOpenChange, children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogContent, { children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogClose, { children: "Close" }) }) }));
            var closeButton = react_1.screen.getByText('Close');
            react_1.fireEvent.click(closeButton);
            (0, vitest_1.expect)(mockOnOpenChange).toHaveBeenCalledWith(false);
        });
    });
});
