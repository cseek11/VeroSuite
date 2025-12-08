// Web Worker for widget computations
// This worker handles heavy computations off the main thread

export interface WidgetComputationMessage {
  type: 'compute' | 'cancel';
  id: string;
  payload?: any;
}

export interface WidgetComputationResult {
  id: string;
  result: any;
  executionTime: number;
}

// Frame budget monitoring
const FRAME_BUDGET_MS = 16; // 60fps = 16ms per frame
let computationStartTime = 0;

self.addEventListener('message', (event: MessageEvent<WidgetComputationMessage>) => {
  const { type, id, payload } = event.data;

  if (type === 'compute') {
    computationStartTime = performance.now();
    
    try {
      // Perform computation
      const result = performComputation(payload);
      const executionTime = performance.now() - computationStartTime;

      // Check frame budget
      if (executionTime > FRAME_BUDGET_MS) {
        console.warn(`Widget computation exceeded frame budget: ${executionTime}ms`);
      }

      const response: WidgetComputationResult = {
        id,
        result,
        executionTime
      };

      self.postMessage(response);
    } catch (error) {
      self.postMessage({
        id,
        error: error instanceof Error ? error.message : 'Computation failed',
        executionTime: performance.now() - computationStartTime
      });
    }
  } else if (type === 'cancel') {
    // Cancel ongoing computation if possible
    // Implementation depends on specific computation type
  }
});

function performComputation(payload: any): any {
  // Placeholder for actual computation logic
  // This would be replaced with actual widget-specific computations
  
  if (payload?.type === 'data-transform') {
    // Example: Transform data
    return payload.data;
  }

  if (payload?.type === 'calculation') {
    // Example: Perform calculation
    return { value: 0 };
  }

  return null;
}

// Export for type checking
export default null as any;





