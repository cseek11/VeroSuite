"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DensityModeProvider = exports.useDensityMode = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var DensityModeContext = (0, react_1.createContext)(undefined);
var STORAGE_KEY = 'verofield-density-mode';
var DEFAULT_DENSITY = 'standard';
var useDensityMode = function () {
    var ctx = (0, react_1.useContext)(DensityModeContext);
    if (!ctx)
        throw new Error('useDensityMode must be used within a DensityModeProvider');
    return ctx;
};
exports.useDensityMode = useDensityMode;
var DensityModeProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(function () {
        // Load from localStorage on initialization
        if (typeof window !== 'undefined') {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (stored && ['compact', 'standard', 'comfortable'].includes(stored)) {
                return stored;
            }
        }
        return DEFAULT_DENSITY;
    }), densityMode = _b[0], setDensityModeState = _b[1];
    // Update document root attribute and localStorage when density changes
    (0, react_1.useEffect)(function () {
        var root = document.documentElement;
        root.setAttribute('data-density', densityMode);
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, densityMode);
        }
    }, [densityMode]);
    // Initialize on mount
    (0, react_1.useEffect)(function () {
        var root = document.documentElement;
        root.setAttribute('data-density', densityMode);
    }, []);
    var setDensityMode = function (mode) {
        setDensityModeState(mode);
    };
    return ((0, jsx_runtime_1.jsx)(DensityModeContext.Provider, { value: { densityMode: densityMode, setDensityMode: setDensityMode }, children: children }));
};
exports.DensityModeProvider = DensityModeProvider;
