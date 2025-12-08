"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CustomersPageWrapper;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var CustomersPage_1 = __importDefault(require("@/components/CustomersPage"));
var logger_1 = require("@/utils/logger");
function CustomersPageWrapper(_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b;
    var containerRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        // Ensure search functionality works in card context
        var handleSearchFocus = function (event) {
            var _a;
            var target = event.target;
            if (target.tagName === 'INPUT' && ((_a = target.placeholder) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes('search'))) {
                // Ensure the search input is properly focused and functional
                target.style.zIndex = '1000';
                logger_1.logger.debug('Search input focused in card context', {}, 'CustomersPageWrapper');
            }
        };
        var handleSearchInput = function (event) {
            var _a;
            var target = event.target;
            if (target.tagName === 'INPUT' && ((_a = target.placeholder) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes('search'))) {
                logger_1.logger.debug('Search input changed', { value: target.value }, 'CustomersPageWrapper');
            }
        };
        document.addEventListener('focusin', handleSearchFocus);
        document.addEventListener('input', handleSearchInput);
        return function () {
            document.removeEventListener('focusin', handleSearchFocus);
            document.removeEventListener('input', handleSearchInput);
        };
    }, []);
    return ((0, jsx_runtime_1.jsx)("div", { ref: containerRef, className: "h-full w-full flex flex-col ".concat(className), children: (0, jsx_runtime_1.jsx)(CustomersPage_1.default, {}) }));
}
