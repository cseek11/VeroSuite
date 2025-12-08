"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMobileLayout = useMobileLayout;
var react_1 = require("react");
function useMobileLayout(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.mobileBreakpoint, mobileBreakpoint = _c === void 0 ? 768 : _c, _d = _b.tabletBreakpoint, tabletBreakpoint = _d === void 0 ? 1024 : _d;
    var _e = (0, react_1.useState)({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenWidth: typeof window !== 'undefined' ? window.innerWidth : 1920,
        screenHeight: typeof window !== 'undefined' ? window.innerHeight : 1080
    }), config = _e[0], setConfig = _e[1];
    var updateConfig = (0, react_1.useCallback)(function () {
        if (typeof window === 'undefined')
            return;
        var width = window.innerWidth;
        var height = window.innerHeight;
        setConfig({
            isMobile: width < mobileBreakpoint,
            isTablet: width >= mobileBreakpoint && width < tabletBreakpoint,
            isDesktop: width >= tabletBreakpoint,
            screenWidth: width,
            screenHeight: height
        });
    }, [mobileBreakpoint, tabletBreakpoint]);
    (0, react_1.useEffect)(function () {
        if (typeof window === 'undefined')
            return;
        updateConfig();
        var handleResize = function () {
            updateConfig();
        };
        window.addEventListener('resize', handleResize);
        return function () {
            window.removeEventListener('resize', handleResize);
        };
    }, [updateConfig]);
    var shouldStackVertically = config.isMobile || config.isTablet;
    var shouldHideRegion = (0, react_1.useCallback)(function (isHiddenMobile) {
        return isHiddenMobile && config.isMobile;
    }, [config.isMobile]);
    return {
        config: config,
        shouldStackVertically: shouldStackVertically,
        shouldHideRegion: shouldHideRegion
    };
}
