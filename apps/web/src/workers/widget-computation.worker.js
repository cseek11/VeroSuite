"use strict";
// Web Worker for widget computations
// This worker handles heavy computations off the main thread
Object.defineProperty(exports, "__esModule", { value: true });
// Frame budget monitoring
var FRAME_BUDGET_MS = 16; // 60fps = 16ms per frame
var computationStartTime = 0;
self.addEventListener('message', function (event) {
    var _a = event.data, type = _a.type, id = _a.id, payload = _a.payload;
    if (type === 'compute') {
        computationStartTime = performance.now();
        try {
            // Perform computation
            var result = performComputation(payload);
            var executionTime = performance.now() - computationStartTime;
            // Check frame budget
            if (executionTime > FRAME_BUDGET_MS) {
                console.warn("Widget computation exceeded frame budget: ".concat(executionTime, "ms"));
            }
            var response = {
                id: id,
                result: result,
                executionTime: executionTime
            };
            self.postMessage(response);
        }
        catch (error) {
            self.postMessage({
                id: id,
                error: error instanceof Error ? error.message : 'Computation failed',
                executionTime: performance.now() - computationStartTime
            });
        }
    }
    else if (type === 'cancel') {
        // Cancel ongoing computation if possible
        // Implementation depends on specific computation type
    }
});
function performComputation(payload) {
    // Placeholder for actual computation logic
    // This would be replaced with actual widget-specific computations
    if ((payload === null || payload === void 0 ? void 0 : payload.type) === 'data-transform') {
        // Example: Transform data
        return payload.data;
    }
    if ((payload === null || payload === void 0 ? void 0 : payload.type) === 'calculation') {
        // Example: Perform calculation
        return { value: 0 };
    }
    return null;
}
// Export for type checking
exports.default = null;
