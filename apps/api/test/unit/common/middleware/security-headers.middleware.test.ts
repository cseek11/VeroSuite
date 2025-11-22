/**
 * Security Headers Middleware Unit Tests
 * Tests for security header injection and CSP nonce generation
 */

import { Test, TestingModule } from '@nestjs/testing';
import { SecurityHeadersMiddleware } from '../../../../src/common/middleware/security-headers.middleware';
import { Request, Response, NextFunction } from 'express';

describe('SecurityHeadersMiddleware', () => {
  let middleware: SecurityHeadersMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let responseHeaders: Record<string, string>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecurityHeadersMiddleware],
    }).compile();

    middleware = module.get<SecurityHeadersMiddleware>(SecurityHeadersMiddleware);

    // Setup mock request
    mockRequest = {
      headers: {},
      url: '/test',
      method: 'GET',
    };

    // Setup mock response
    responseHeaders = {};
    mockResponse = {
      setHeader: jest.fn((key: string, value: string) => {
        responseHeaders[key] = value;
      }),
      getHeader: jest.fn((key: string) => responseHeaders[key]),
      locals: {},
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('use', () => {
    it('should set Content-Security-Policy header', () => {
      // Act
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Security-Policy',
        expect.stringContaining("default-src 'self'")
      );
    });

    it('should include nonce in CSP script-src directive', () => {
      // Act
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      const cspHeader = responseHeaders['Content-Security-Policy'];
      expect(cspHeader).toContain("script-src 'self' 'nonce-");
      expect(cspHeader).toMatch(/script-src 'self' 'nonce-[A-Za-z0-9+/=]+/);
    });

    it('should include nonce in CSP style-src directive', () => {
      // Act
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      const cspHeader = responseHeaders['Content-Security-Policy'];
      expect(cspHeader).toContain("style-src 'self' 'nonce-");
      expect(cspHeader).toMatch(/style-src 'self' 'nonce-[A-Za-z0-9+/=]+/);
    });

    it('should set X-Frame-Options header', () => {
      // Act
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'SAMEORIGIN');
    });

    it('should set X-Content-Type-Options header', () => {
      // Act
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
    });

    it('should set Referrer-Policy header', () => {
      // Act
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Referrer-Policy',
        'strict-origin-when-cross-origin'
      );
    });

    it('should set Permissions-Policy header', () => {
      // Act
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Permissions-Policy',
        expect.stringContaining('geolocation=()')
      );
    });

    it('should set X-XSS-Protection header', () => {
      // Act
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-XSS-Protection', '1; mode=block');
    });

    it('should store nonce in res.locals.cspNonce', () => {
      // Act
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.locals.cspNonce).toBeDefined();
      expect(typeof mockResponse.locals.cspNonce).toBe('string');
      expect(mockResponse.locals.cspNonce.length).toBeGreaterThan(0);
    });

    it('should generate unique nonce for each request', () => {
      // Act
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      const nonce1 = mockResponse.locals.cspNonce;

      const mockResponse2 = {
        ...mockResponse,
        locals: {},
      };
      middleware.use(mockRequest as Request, mockResponse2 as Response, mockNext);
      const nonce2 = mockResponse2.locals.cspNonce;

      // Assert
      expect(nonce1).not.toBe(nonce2);
    });

    it('should call next() to continue request processing', () => {
      // Act
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should include all required CSP directives', () => {
      // Act
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      const cspHeader = responseHeaders['Content-Security-Policy'];
      expect(cspHeader).toContain("default-src 'self'");
      expect(cspHeader).toContain("img-src 'self' data:");
      expect(cspHeader).toContain("font-src 'self' data:");
      expect(cspHeader).toContain("connect-src 'self'");
      expect(cspHeader).toContain("frame-src 'self'");
      expect(cspHeader).toContain("object-src 'none'");
      expect(cspHeader).toContain("base-uri 'self'");
      expect(cspHeader).toContain("form-action 'self'");
      expect(cspHeader).toContain("frame-ancestors 'self'");
      expect(cspHeader).toContain('upgrade-insecure-requests');
    });

    it('should include all required Permissions-Policy directives', () => {
      // Act
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      const permissionsPolicy = responseHeaders['Permissions-Policy'];
      expect(permissionsPolicy).toContain('geolocation=()');
      expect(permissionsPolicy).toContain('microphone=()');
      expect(permissionsPolicy).toContain('camera=()');
      expect(permissionsPolicy).toContain('payment=()');
      expect(permissionsPolicy).toContain('usb=()');
      expect(permissionsPolicy).toContain('magnetometer=()');
      expect(permissionsPolicy).toContain('gyroscope=()');
      expect(permissionsPolicy).toContain('speaker=()');
      expect(permissionsPolicy).toContain('vibrate=()');
      expect(permissionsPolicy).toContain('fullscreen=(self)');
      expect(permissionsPolicy).toContain('sync-xhr=()');
    });

    it('should generate base64-encoded nonce', () => {
      // Act
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      const nonce = mockResponse.locals.cspNonce;
      // Base64 characters: A-Z, a-z, 0-9, +, /, =
      expect(nonce).toMatch(/^[A-Za-z0-9+/=]+$/);
    });

    it('should use same nonce in script-src and style-src', () => {
      // Act
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      const cspHeader = responseHeaders['Content-Security-Policy'];
      const nonce = mockResponse.locals.cspNonce;
      expect(cspHeader).toContain(`script-src 'self' 'nonce-${nonce}'`);
      expect(cspHeader).toContain(`style-src 'self' 'nonce-${nonce}'`);
    });
  });
});

