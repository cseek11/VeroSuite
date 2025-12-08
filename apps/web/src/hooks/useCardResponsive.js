"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCardResponsive = useCardResponsive;
var react_1 = require("react");
function useCardResponsive(_a) {
    var cardId = _a.cardId, _b = _a.threshold, threshold = _b === void 0 ? 50 : _b;
    var _c = (0, react_1.useState)({
        isMobile: false,
        cardWidth: 0,
        viewportWidth: 0,
        percentage: 0
    }), state = _c[0], setState = _c[1];
    var observerRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        var cardElement = document.querySelector("[data-card-id=\"".concat(cardId, "\"]"));
        if (!cardElement)
            return;
        var updateResponsiveState = function () {
            var cardRect = cardElement.getBoundingClientRect();
            var viewportWidth = window.innerWidth;
            var cardWidth = cardRect.width;
            var percentage = (cardWidth / viewportWidth) * 100;
            var isMobile = percentage < threshold;
            setState({
                isMobile: isMobile,
                cardWidth: cardWidth,
                viewportWidth: viewportWidth,
                percentage: percentage
            });
            // Add/remove mobile class for CSS targeting
            if (isMobile) {
                cardElement.classList.add('card-mobile-mode');
            }
            else {
                cardElement.classList.remove('card-mobile-mode');
            }
        };
        // Initial check
        updateResponsiveState();
        // Set up ResizeObserver to watch card size changes
        observerRef.current = new ResizeObserver(function () {
            updateResponsiveState();
        });
        observerRef.current.observe(cardElement);
        // Also listen for window resize
        var handleWindowResize = function () {
            updateResponsiveState();
        };
        window.addEventListener('resize', handleWindowResize);
        return function () {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [cardId, threshold]);
    return state;
}
