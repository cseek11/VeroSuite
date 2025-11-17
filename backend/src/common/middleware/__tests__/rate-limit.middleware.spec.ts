import { RateLimitMiddleware } from '../rate-limit.middleware';
import { CacheService } from '../../services/cache.service';
import { Request, Response } from 'express';
import { HttpException } from '@nestjs/common';

describe('RateLimitMiddleware', () => {
  let middleware: RateLimitMiddleware;
  let cacheService: jest.Mocked<CacheService>;

  beforeEach(() => {
    cacheService = {
      get: jest.fn().mockResolvedValue([]),
      set: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn(),
    } as any;

    middleware = new RateLimitMiddleware(cacheService);
  });

  function createRequest(path: string, method: string = 'GET', body?: any): Partial<Request> {
    return {
      path,
      method,
      body,
      ip: '127.0.0.1',
    } as any;
  }

  function createResponse() {
    const headers: Record<string, string> = {};
    return {
      setHeader: (key: string, value: string) => {
        headers[key] = value;
      },
      get headers() {
        return headers;
      },
    } as any as Response & { headers: Record<string, string> };
  }

  it('should allow normal requests under the limit and set headers', async () => {
    const req = createRequest('/api/v1/dashboard/layouts/default');
    const res = createResponse();
    const next = jest.fn();

    await middleware.use(req as Request, res as any, next);

    expect(next).toHaveBeenCalled();
    expect(res.headers['X-RateLimit-Limit']).toBeDefined();
    expect(res.headers['X-RateLimit-Remaining']).toBeDefined();
    expect(res.headers['X-RateLimit-Category']).toBeDefined();
  });

  it('should throw HttpException when limit exceeded', async () => {
    // Simulate a full window by returning many timestamps from cache
    const now = Date.now();
    cacheService.get.mockResolvedValue(
      Array.from({ length: 100 }, () => now),
    );

    const req = createRequest('/api/v1/dashboard/layouts/default');
    const res = createResponse();

    await expect(
      middleware.use(req as Request, res as any, jest.fn()),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('should handle errors gracefully and allow request (fail open)', async () => {
    // Arrange
    cacheService.get.mockRejectedValue(new Error('Cache error'));
    const req = createRequest('/api/v1/test');
    const res = createResponse();
    const next = jest.fn();

    // Act
    await middleware.use(req as Request, res as any, next);

    // Assert - Should allow request on error (line 117)
    expect(next).toHaveBeenCalled();
  });

  describe('categorizeEndpoint', () => {
    it('should categorize export endpoints as EXPENSIVE', () => {
      // Arrange
      const req = createRequest('/api/v1/users/export');

      // Act
      const category = (middleware as any).categorizeEndpoint(req);

      // Assert
      expect(category).toBe('expensive');
    });

    it('should categorize import endpoints as EXPENSIVE', () => {
      // Arrange
      const req = createRequest('/api/v1/users/import');

      // Act
      const category = (middleware as any).categorizeEndpoint(req);

      // Assert
      expect(category).toBe('expensive');
    });

    it('should categorize bulk endpoints as EXPENSIVE', () => {
      // Arrange
      const req = createRequest('/api/v1/jobs/bulk');

      // Act
      const category = (middleware as any).categorizeEndpoint(req);

      // Assert
      expect(category).toBe('expensive');
    });

    it('should categorize clone endpoints as EXPENSIVE', () => {
      // Arrange
      const req = createRequest('/api/v1/dashboard/layouts/clone');

      // Act
      const category = (middleware as any).categorizeEndpoint(req);

      // Assert
      expect(category).toBe('expensive');
    });

    it('should categorize reset endpoints as EXPENSIVE', () => {
      // Arrange
      const req = createRequest('/api/v1/dashboard/reset');

      // Act
      const category = (middleware as any).categorizeEndpoint(req);

      // Assert
      expect(category).toBe('expensive');
    });

    it('should categorize dashboard/layouts POST as EXPENSIVE', () => {
      // Arrange
      const req = createRequest('/api/v1/dashboard/layouts', 'POST');

      // Act
      const category = (middleware as any).categorizeEndpoint(req);

      // Assert
      expect(category).toBe('expensive');
    });

    it('should categorize dashboard/regions POST with multiple items as EXPENSIVE', () => {
      // Arrange
      const req = createRequest('/api/v1/dashboard/regions', 'POST', [{ id: 1 }, { id: 2 }]);

      // Act
      const category = (middleware as any).categorizeEndpoint(req);

      // Assert
      expect(category).toBe('expensive'); // Line 138
    });

    it('should categorize WebSocket endpoints as WEBSOCKET', () => {
      // Arrange
      const req = createRequest('/api/v1/ws');

      // Act
      const category = (middleware as any).categorizeEndpoint(req);

      // Assert
      expect(category).toBe('websocket'); // Line 143
    });

    it('should categorize socket endpoints as WEBSOCKET', () => {
      // Arrange
      const req = createRequest('/api/v1/socket');

      // Act
      const category = (middleware as any).categorizeEndpoint(req);

      // Assert
      expect(category).toBe('websocket');
    });

    it('should categorize presence endpoints as WEBSOCKET', () => {
      // Arrange
      const req = createRequest('/api/v1/presence');

      // Act
      const category = (middleware as any).categorizeEndpoint(req);

      // Assert
      expect(category).toBe('websocket');
    });

    it('should categorize normal endpoints as NORMAL', () => {
      // Arrange
      const req = createRequest('/api/v1/users');

      // Act
      const category = (middleware as any).categorizeEndpoint(req);

      // Assert
      expect(category).toBe('normal');
    });
  });

  describe('tier limits', () => {
    it('should use free tier limits for free users', async () => {
      // Arrange
      const req = createRequest('/api/v1/test');
      (req as any).user = { userId: 'user-123', tier: 'free' };
      const res = createResponse();
      const next = jest.fn();

      // Act
      await middleware.use(req as Request, res as any, next);

      // Assert
      expect(res.headers['X-RateLimit-Limit']).toBe('50'); // Free tier normal limit
    });

    it('should use basic tier limits for basic users', async () => {
      // Arrange
      const req = createRequest('/api/v1/test');
      (req as any).user = { userId: 'user-123', tier: 'basic' };
      const res = createResponse();
      const next = jest.fn();

      // Act
      await middleware.use(req as Request, res as any, next);

      // Assert
      expect(res.headers['X-RateLimit-Limit']).toBe('200'); // Basic tier normal limit
    });
  });

  describe('calculateRequestCost', () => {
    it('should calculate higher cost for bulk operations', () => {
      // Arrange
      const req = createRequest('/api/v1/bulk', 'POST', [{ id: 1 }, { id: 2 }, { id: 3 }]);
      const config = { windowMs: 60000, maxRequests: 100, cost: 1 };
      const category = 'expensive';

      // Act
      const cost = (middleware as any).calculateRequestCost(req, config, category);

      // Assert
      expect(cost).toBe(3); // baseCost * body.length (lines 248-250)
    });

    it('should calculate 10x cost for expensive operations without bulk', () => {
      // Arrange
      const req = createRequest('/api/v1/export', 'GET');
      const config = { windowMs: 60000, maxRequests: 100, cost: 1 };
      const category = 'expensive';

      // Act
      const cost = (middleware as any).calculateRequestCost(req, config, category);

      // Assert
      expect(cost).toBe(10); // baseCost * 10 (line 251)
    });

    it('should calculate 2x cost for write operations', () => {
      // Arrange
      const methods = ['POST', 'PUT', 'PATCH', 'DELETE'];
      const config = { windowMs: 60000, maxRequests: 100, cost: 1 };
      const category = 'normal';

      for (const method of methods) {
        const req = createRequest('/api/v1/test', method);

        // Act
        const cost = (middleware as any).calculateRequestCost(req, config, category);

        // Assert
        expect(cost).toBe(2); // baseCost * 2 (line 256)
      }
    });

    it('should calculate 1.5x cost for complex GET operations', () => {
      // Arrange
      const req = createRequest('/api/v1/dashboard/layouts', 'GET');
      const config = { windowMs: 60000, maxRequests: 100, cost: 1 };
      const category = 'normal';

      // Act
      const cost = (middleware as any).calculateRequestCost(req, config, category);

      // Assert
      expect(cost).toBe(1.5); // baseCost * 1.5
    });

    it('should return base cost for normal GET operations', () => {
      // Arrange
      const req = createRequest('/api/v1/users', 'GET');
      const config = { windowMs: 60000, maxRequests: 100, cost: 1 };
      const category = 'normal';

      // Act
      const cost = (middleware as any).calculateRequestCost(req, config, category);

      // Assert
      expect(cost).toBe(1); // baseCost (line 264)
    });
  });

  describe('getRemainingTime', () => {
    it('should return 0 when no recent requests', async () => {
      // Arrange
      cacheService.get.mockResolvedValue([]);
      const config = { windowMs: 60000, maxRequests: 100, cost: 1 };
      const category = 'normal';

      // Act
      const remainingTime = await (middleware as any).getRemainingTime('user-123', config, category);

      // Assert
      expect(remainingTime).toBe(0); // Line 224
    });

    it('should calculate remaining time based on oldest request', async () => {
      // Arrange
      const now = Date.now();
      const oldRequest = now - 30000; // 30 seconds ago
      cacheService.get.mockResolvedValue([oldRequest, now - 10000]);
      const config = { windowMs: 60000, maxRequests: 100, cost: 1 };
      const category = 'normal';

      // Act
      const remainingTime = await (middleware as any).getRemainingTime('user-123', config, category);

      // Assert
      // Oldest request was 30s ago, window is 60s, so 30s remaining
      expect(remainingTime).toBeGreaterThan(0);
      expect(remainingTime).toBeLessThanOrEqual(30000);
    });
  });

  describe('rate limit headers', () => {
    it('should set all rate limit headers when allowed', async () => {
      // Arrange
      const req = createRequest('/api/v1/test');
      const res = createResponse();
      const next = jest.fn();

      // Act
      await middleware.use(req as Request, res as any, next);

      // Assert
      expect(res.headers['X-RateLimit-Limit']).toBeDefined();
      expect(res.headers['X-RateLimit-Remaining']).toBeDefined();
      expect(res.headers['X-RateLimit-Reset']).toBeDefined();
      expect(res.headers['X-RateLimit-Category']).toBeDefined();
    });

    it('should set rate limit headers when limit exceeded', async () => {
      // Arrange
      const now = Date.now();
      cacheService.get.mockResolvedValue(Array.from({ length: 100 }, () => now));
      const req = createRequest('/api/v1/test');
      const res = createResponse();

      // Act & Assert
      await expect(
        middleware.use(req as Request, res as any, jest.fn())
      ).rejects.toBeInstanceOf(HttpException);

      expect(res.headers['X-RateLimit-Limit']).toBeDefined();
      expect(res.headers['X-RateLimit-Remaining']).toBe('0');
      expect(res.headers['Retry-After']).toBeDefined();
    });
  });

  describe('sliding window algorithm', () => {
    it('should filter out expired requests from window', async () => {
      // Arrange
      const now = Date.now();
      const expiredRequest = now - 70000; // 70 seconds ago (outside 60s window)
      const recentRequest = now - 10000; // 10 seconds ago
      cacheService.get.mockResolvedValue([expiredRequest, recentRequest]);
      const req = createRequest('/api/v1/test');
      const res = createResponse();
      const next = jest.fn();

      // Act
      await middleware.use(req as Request, res as any, next);

      // Assert
      // Should only count recent request, so should be allowed
      expect(next).toHaveBeenCalled();
      const setCall = cacheService.set.mock.calls[0];
      const storedRequests = setCall[1];
      expect(storedRequests.length).toBe(2); // recentRequest + new request
    });

    it('should use IP address when user is not authenticated', async () => {
      // Arrange
      const req = createRequest('/api/v1/test');
      (req as any).user = undefined;
      req.ip = '192.168.1.1';
      const res = createResponse();
      const next = jest.fn();

      // Act
      await middleware.use(req as Request, res as any, next);

      // Assert
      expect(cacheService.get).toHaveBeenCalledWith(
        expect.stringContaining('192.168.1.1')
      );
    });
  });
});


