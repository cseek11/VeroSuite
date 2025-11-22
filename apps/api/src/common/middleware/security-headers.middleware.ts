import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

/**
 * Security headers middleware
 * 
 * Adds security headers to all responses:
 * - Content-Security-Policy (CSP) with nonce-based inline script support
 * - X-Frame-Options
 * - X-Content-Type-Options
 * - Referrer-Policy
 * - Permissions-Policy
 */
@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  use(_req: Request, res: Response, next: NextFunction) {
    // Generate a unique nonce for this request
    // This allows inline scripts/styles with matching nonce attribute while blocking all others
    const nonce = crypto.randomBytes(16).toString('base64');
    res.locals.cspNonce = nonce;

    // Content Security Policy
    // Strict CSP without unsafe-eval or unsafe-inline
    // Use nonces for any legitimate inline scripts/styles
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}'`, // Only allow scripts from same origin or with nonce
      `style-src 'self' 'nonce-${nonce}'`, // Only allow styles from same origin or with nonce
      "img-src 'self' data:", // Removed https: wildcard - only allow same origin and data URIs
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests"
    ].join('; ');

    res.setHeader('Content-Security-Policy', csp);
    
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Referrer policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions policy (formerly Feature-Policy)
    const permissionsPolicy = [
      'geolocation=()',
      'microphone=()',
      'camera=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'speaker=()',
      'vibrate=()',
      'fullscreen=(self)',
      'sync-xhr=()'
    ].join(', ');
    
    res.setHeader('Permissions-Policy', permissionsPolicy);
    
    // XSS Protection (legacy, but still useful)
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    next();
  }
}


