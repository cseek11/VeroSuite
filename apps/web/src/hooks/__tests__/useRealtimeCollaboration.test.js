"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var vitest_1 = require("vitest");
var react_1 = require("@testing-library/react");
var react_query_1 = require("@tanstack/react-query");
var useRealtimeCollaboration_1 = require("../useRealtimeCollaboration");
// Mock WebSocket
global.WebSocket = vitest_1.vi.fn();
var createWrapper = function () {
    var queryClient = new react_query_1.QueryClient({
        defaultOptions: {
            queries: { retry: false, gcTime: 0 },
            mutations: { retry: false },
        },
    });
    return function (_a) {
        var children = _a.children;
        return ((0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: children }));
    };
};
(0, vitest_1.describe)('useRealtimeCollaboration', function () {
    var mockUser = { id: 'user-1', email: 'test@example.com' };
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)('should establish WebSocket connection', function () {
        var mockWebSocket = {
            addEventListener: vitest_1.vi.fn(),
            send: vitest_1.vi.fn(),
            close: vitest_1.vi.fn(),
            readyState: WebSocket.OPEN,
        };
        global.WebSocket.mockImplementation(function () { return mockWebSocket; });
        (0, react_1.renderHook)(function () { return (0, useRealtimeCollaboration_1.useRealtimeCollaboration)('dashboard-1', mockUser); }, { wrapper: createWrapper() });
        (0, vitest_1.expect)(global.WebSocket).toHaveBeenCalled();
    });
    (0, vitest_1.it)('should handle WebSocket messages', function () {
        var mockWebSocket = {
            addEventListener: vitest_1.vi.fn(function (event, handler) {
                if (event === 'message') {
                    setTimeout(function () {
                        handler({ data: JSON.stringify({ type: 'update', data: {} }) });
                    }, 0);
                }
            }),
            send: vitest_1.vi.fn(),
            close: vitest_1.vi.fn(),
            readyState: WebSocket.OPEN,
        };
        global.WebSocket.mockImplementation(function () { return mockWebSocket; });
        (0, react_1.renderHook)(function () { return (0, useRealtimeCollaboration_1.useRealtimeCollaboration)('dashboard-1', mockUser); }, { wrapper: createWrapper() });
        (0, vitest_1.expect)(mockWebSocket.addEventListener).toHaveBeenCalled();
    });
});
