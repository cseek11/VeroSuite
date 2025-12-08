"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var SkipLink = function (_a) {
    var _b = _a.targetId, targetId = _b === void 0 ? 'main-content' : _b, _c = _a.children, children = _c === void 0 ? 'Skip to main content' : _c;
    var handleClick = function (e) {
        e.preventDefault();
        var target = document.getElementById(targetId);
        if (target) {
            target.focus();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return ((0, jsx_runtime_1.jsx)("a", { href: "#".concat(targetId), onClick: handleClick, className: "skip-link", tabIndex: 0, style: {
            position: 'absolute',
            top: '-40px',
            left: '6px',
            background: '#000',
            color: '#fff',
            padding: '8px',
            textDecoration: 'none',
            zIndex: 1000,
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'top 0.3s',
        }, onFocus: function (e) {
            e.currentTarget.style.top = '6px';
        }, onBlur: function (e) {
            e.currentTarget.style.top = '-40px';
        }, children: children }));
};
exports.default = SkipLink;
