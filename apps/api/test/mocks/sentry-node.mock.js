"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTag = exports.setContext = exports.addBreadcrumb = exports.setUser = exports.withScope = exports.captureMessage = exports.captureException = exports.init = void 0;
exports.init = jest.fn();
exports.captureException = jest.fn();
exports.captureMessage = jest.fn();
const withScope = (fn) => {
    const scope = {
        setLevel: jest.fn(),
        setContext: jest.fn(),
        setTag: jest.fn(),
    };
    fn(scope);
};
exports.withScope = withScope;
exports.setUser = jest.fn();
exports.addBreadcrumb = jest.fn();
exports.setContext = jest.fn();
exports.setTag = jest.fn();
//# sourceMappingURL=sentry-node.mock.js.map