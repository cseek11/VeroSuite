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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PageCardTemplate;
var jsx_runtime_1 = require("react/jsx-runtime");
var PageCardManager_1 = __importDefault(require("@/components/dashboard/PageCardManager"));
/**
 * Template component for creating page cards with minimize/expand functionality
 *
 * Usage:
 * ```tsx
 * import PageCardTemplate from '@/components/dashboard/PageCardTemplate';
 * import MyPageComponent from '@/components/MyPageComponent';
 *
 * function MyPageCard({ cardId, onClose, className }) {
 *   return (
 *     <PageCardTemplate
 *       cardId={cardId}
 *       cardType="my-page"
 *       onClose={onClose}
 *       className={className}
 *     >
 *       <div className="h-full overflow-auto">
 *         <Suspense fallback={<LoadingSpinner />}>
 *           <MyPageComponent />
 *         </Suspense>
 *       </div>
 *     </PageCardTemplate>
 *   );
 * }
 * ```
 *
 * Supported card types:
 * - customers-page (blue, Users icon)
 * - reports-page (green, FileText icon)
 * - analytics-page (purple, BarChart3 icon)
 * - calendar-page (orange, Calendar icon)
 * - settings-page (gray, Settings icon)
 */
function PageCardTemplate(_a) {
    var cardId = _a.cardId, cardType = _a.cardType, onClose = _a.onClose, _b = _a.className, className = _b === void 0 ? '' : _b, children = _a.children;
    return ((0, jsx_runtime_1.jsx)(PageCardManager_1.default, __assign({ cardId: cardId || '', cardType: cardType }, (onClose !== undefined ? { onClose: onClose } : {}), (className !== undefined ? { className: className } : {}), { children: children })));
}
