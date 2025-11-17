import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CacheService } from '../services/cache.service';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  cost?: number; // Request cost (default: 1)
}

/**
 * Endpoint category for rate limiting
 */
enum EndpointCategory {
  NORMAL = 'normal',      // Standard read/write operations
  EXPENSIVE = 'expensive', // Resource-intensive operations (bulk, export, import)
  WEBSOCKET = 'websocket'  // WebSocket connections
}

/**
 * Rate limiting middleware with sliding window algorithm and tiered limits
 */
@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly defaultLimits: RateLimitConfig = {
    windowMs: 60000, // 1 minute
    maxRequests: 100,
    cost: 1
  };

  // Tier limits per category
  private readonly tierLimits: Map<string, Map<EndpointCategory, RateLimitConfig>> = new Map([
    ['free', new Map([
      [EndpointCategory.NORMAL, { windowMs: 60000, maxRequests: 50, cost: 1 }],
      [EndpointCategory.EXPENSIVE, { windowMs: 60000, maxRequests: 5, cost: 1 }],
      [EndpointCategory.WEBSOCKET, { windowMs: 60000, maxRequests: 10, cost: 1 }]
    ])],
    ['basic', new Map([
      [EndpointCategory.NORMAL, { windowMs: 60000, maxRequests: 200, cost: 1 }],
      [EndpointCategory.EXPENSIVE, { windowMs: 60000, maxRequests: 20, cost: 1 }],
      [EndpointCategory.WEBSOCKET, { windowMs: 60000, maxRequests: 50, cost: 1 }]
    ])],
    ['premium', new Map([
      [EndpointCategory.NORMAL, { windowMs: 60000, maxRequests: 1000, cost: 1 }],
      [EndpointCategory.EXPENSIVE, { windowMs: 60000, maxRequests: 100, cost: 1 }],
      [EndpointCategory.WEBSOCKET, { windowMs: 60000, maxRequests: 200, cost: 1 }]
    ])],
    ['enterprise', new Map([
      [EndpointCategory.NORMAL, { windowMs: 60000, maxRequests: 10000, cost: 1 }],
      [EndpointCategory.EXPENSIVE, { windowMs: 60000, maxRequests: 500, cost: 1 }],
      [EndpointCategory.WEBSOCKET, { windowMs: 60000, maxRequests: 1000, cost: 1 }]
    ])]
  ]);

  constructor(private readonly cacheService: CacheService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Get user identifier (from JWT or IP)
      const userId = (req as any).user?.userId || req.ip;
      const userTier = (req as any).user?.tier || 'free';
      
      // Determine endpoint category
      const category = this.categorizeEndpoint(req);
      
      // Get rate limit config for user tier and category
      const tierConfigs = this.tierLimits.get(userTier);
      const limitConfig = tierConfigs?.get(category) || 
                         tierConfigs?.get(EndpointCategory.NORMAL) || 
                         this.defaultLimits;
      
      // Calculate request cost (can vary by endpoint)
      const requestCost = this.calculateRequestCost(req, limitConfig, category);
      
      // Check rate limit with category-specific key
      const allowed = await this.checkRateLimit(
        userId,
        limitConfig,
        requestCost,
        category
      );

      if (!allowed) {
        // Get remaining time
        const remainingTime = await this.getRemainingTime(userId, limitConfig, category);
        
        res.setHeader('X-RateLimit-Limit', limitConfig.maxRequests.toString());
        res.setHeader('X-RateLimit-Remaining', '0');
        res.setHeader('X-RateLimit-Reset', new Date(Date.now() + remainingTime).toISOString());
        res.setHeader('X-RateLimit-Category', category);
        res.setHeader('Retry-After', Math.ceil(remainingTime / 1000).toString());

        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: `Rate limit exceeded for ${category} operations. Please try again later.`,
            retryAfter: Math.ceil(remainingTime / 1000),
            category: category
          },
          HttpStatus.TOO_MANY_REQUESTS
        );
      }

      // Set rate limit headers
      const remaining = await this.getRemainingRequests(userId, limitConfig, category);
      res.setHeader('X-RateLimit-Limit', limitConfig.maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', remaining.toString());
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + limitConfig.windowMs).toISOString());
      res.setHeader('X-RateLimit-Category', category);

      next();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      // On error, allow request (fail open)
      next();
    }
  }

  /**
   * Categorize endpoint based on path and method
   */
  private categorizeEndpoint(req: Request): EndpointCategory {
    const path = req.path.toLowerCase();
    const method = req.method.toUpperCase();

    // Expensive operations
    if (
      path.includes('/export') ||
      path.includes('/import') ||
      path.includes('/bulk') ||
      path.includes('/clone') ||
      path.includes('/reset') ||
      (path.includes('/dashboard/layouts') && method === 'POST') ||
      (path.includes('/dashboard/regions') && method === 'POST' && req.body?.length > 1)
    ) {
      return EndpointCategory.EXPENSIVE;
    }

    // WebSocket connections
    if (path.includes('/ws') || path.includes('/socket') || path.includes('/presence')) {
      return EndpointCategory.WEBSOCKET;
    }

    // Normal operations (default)
    return EndpointCategory.NORMAL;
  }

  /**
   * Check rate limit using sliding window algorithm
   */
  private async checkRateLimit(
    userId: string,
    config: RateLimitConfig,
    cost: number,
    category: EndpointCategory
  ): Promise<boolean> {
    const key = `ratelimit:${category}:${userId}`;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get current request timestamps from cache
    const cached = await this.cacheService.get<number[]>(key);
    const requests = cached || [];

    // Filter requests within current window
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);

    // Calculate total cost of recent requests
    const totalCost = recentRequests.length * (config.cost || 1);

    // Check if adding this request would exceed limit
    if (totalCost + cost > config.maxRequests) {
      return false;
    }

    // Add current request timestamp
    recentRequests.push(now);

    // Store updated requests (with TTL = window size)
    await this.cacheService.set(key, recentRequests, Math.ceil(config.windowMs / 1000));

    return true;
  }

  /**
   * Get remaining requests in current window
   */
  private async getRemainingRequests(
    userId: string,
    config: RateLimitConfig,
    category: EndpointCategory
  ): Promise<number> {
    const key = `ratelimit:${category}:${userId}`;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    const cached = await this.cacheService.get<number[]>(key);
    const requests = cached || [];
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    const totalCost = recentRequests.length * (config.cost || 1);

    return Math.max(0, config.maxRequests - totalCost);
  }

  /**
   * Get remaining time until window resets
   */
  private async getRemainingTime(
    userId: string,
    config: RateLimitConfig,
    category: EndpointCategory
  ): Promise<number> {
    const key = `ratelimit:${category}:${userId}`;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    const cached = await this.cacheService.get<number[]>(key);
    const requests = cached || [];
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);

    if (recentRequests.length === 0) {
      return 0;
    }

    // Find oldest request in window
    const oldestRequest = Math.min(...recentRequests);
    const oldestWindowStart = oldestRequest;
    const oldestWindowEnd = oldestWindowStart + config.windowMs;

    return Math.max(0, oldestWindowEnd - now);
  }

  /**
   * Calculate request cost based on endpoint and method
   */
  private calculateRequestCost(
    req: Request, 
    config: RateLimitConfig,
    category: EndpointCategory
  ): number {
    const baseCost = config.cost || 1;

    // Expensive operations have higher base cost
    if (category === EndpointCategory.EXPENSIVE) {
      // Bulk operations cost more
      if (req.body && Array.isArray(req.body) && req.body.length > 1) {
        return baseCost * req.body.length;
      }
      return baseCost * 10; // 10x cost for expensive operations
    }

    // Higher cost for write operations
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return baseCost * 2;
    }

    // Higher cost for complex GET operations
    if (req.path.includes('/dashboard/layouts') && req.method === 'GET') {
      return baseCost * 1.5;
    }

    return baseCost;
  }
}

