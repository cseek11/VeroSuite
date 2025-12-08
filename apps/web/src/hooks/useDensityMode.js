"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDensityMode = void 0;
var react_1 = require("react");
var userPreferences_1 = require("@/stores/userPreferences");
// Simple media query hook
var useMediaQuery = function (query) {
    var _a = (0, react_1.useState)(false), matches = _a[0], setMatches = _a[1];
    (0, react_1.useEffect)(function () {
        var media = window.matchMedia(query);
        setMatches(media.matches);
        var listener = function () { return setMatches(media.matches); };
        media.addEventListener('change', listener);
        return function () { return media.removeEventListener('change', listener); };
    }, [query]);
    return matches;
};
var useDensityMode = function () {
    var _a = (0, userPreferences_1.useUserPreferences)(), preferences = _a.preferences, setDensityMode = _a.setDensityMode;
    // Mobile detection
    var isMobile = useMediaQuery('(max-width: 768px)');
    var isTablet = useMediaQuery('(max-width: 1024px) and (min-width: 769px)');
    // Auto-adjust density mode based on screen size
    (0, react_1.useEffect)(function () {
        if (isMobile && preferences.densityMode === 'dense') {
            // Force standard mode on mobile for better usability
            setDensityMode('standard');
        }
    }, [isMobile, preferences.densityMode, setDensityMode]);
    var toggleDensity = (0, react_1.useCallback)(function () {
        var newMode = preferences.densityMode === 'dense' ? 'standard' : 'dense';
        // Don't allow dense mode on mobile
        if (isMobile && newMode === 'dense') {
            return;
        }
        setDensityMode(newMode);
    }, [preferences.densityMode, isMobile, setDensityMode]);
    var setDensity = (0, react_1.useCallback)(function (mode) {
        // Don't allow dense mode on mobile
        if (isMobile && mode === 'dense') {
            return;
        }
        setDensityMode(mode);
    }, [isMobile, setDensityMode]);
    // Effective density mode (considering mobile constraints)
    var effectiveMode = isMobile && preferences.densityMode === 'dense'
        ? 'standard'
        : preferences.densityMode;
    return {
        densityMode: effectiveMode,
        toggleDensity: toggleDensity,
        setDensity: setDensity,
        isMobile: isMobile,
        isTablet: isTablet,
        canUseDense: !isMobile,
        isForcedStandard: isMobile && preferences.densityMode === 'dense',
    };
};
exports.useDensityMode = useDensityMode;
