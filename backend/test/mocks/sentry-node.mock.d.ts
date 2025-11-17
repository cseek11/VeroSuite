export type SeverityLevel = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
export declare const init: jest.Mock<any, any, any>;
export declare const captureException: jest.Mock<any, any, any>;
export declare const captureMessage: jest.Mock<any, any, any>;
export declare const withScope: (fn: (scope: any) => void) => void;
export declare const setUser: jest.Mock<any, any, any>;
export declare const addBreadcrumb: jest.Mock<any, any, any>;
export declare const setContext: jest.Mock<any, any, any>;
export declare const setTag: jest.Mock<any, any, any>;
