// Lightweight Jest stub for @sentry/node used in tests
export type SeverityLevel = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';

export const init = jest.fn();
export const captureException = jest.fn();
export const captureMessage = jest.fn();
export const withScope = (fn: (scope: any) => void) => {
  const scope = {
    setLevel: jest.fn(),
    setContext: jest.fn(),
    setTag: jest.fn(),
  };
  fn(scope);
};
export const setUser = jest.fn();
export const addBreadcrumb = jest.fn();
export const setContext = jest.fn();
export const setTag = jest.fn();



