import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WidgetManifestDto } from '../dto/dashboard-region.dto';

@Injectable()
export class WidgetSecurityMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Sanitize widget configs in request body
    if (req.body && (req.body.widget_config || req.body.config)) {
      req.body.widget_config = this.sanitizeConfig(req.body.widget_config || {});
      req.body.config = this.sanitizeConfig(req.body.config || {});
    }

    // Add CSP headers for widget responses
    res.setHeader('Content-Security-Policy', this.getCSPPolicy());

    next();
  }

  private sanitizeConfig(config: any): any {
    if (!config || typeof config !== 'object') {
      return {};
    }

    const sanitized: any = {};

    for (const [key, value] of Object.entries(config)) {
      // Sanitize key
      const sanitizedKey = this.sanitizeString(key);
      
      if (!sanitizedKey) continue;

      // Sanitize value based on type
      if (typeof value === 'string') {
        sanitized[sanitizedKey] = this.sanitizeString(value);
      } else if (typeof value === 'number' && isFinite(value)) {
        sanitized[sanitizedKey] = value;
      } else if (typeof value === 'boolean') {
        sanitized[sanitizedKey] = value;
      } else if (Array.isArray(value)) {
        sanitized[sanitizedKey] = value.map(item => 
          typeof item === 'string' ? this.sanitizeString(item) : item
        );
      } else if (typeof value === 'object' && value !== null) {
        sanitized[sanitizedKey] = this.sanitizeConfig(value);
      }
    }

    return sanitized;
  }

  private sanitizeString(str: string): string {
    if (typeof str !== 'string') {
      return '';
    }

    // Remove potential XSS vectors
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim()
      .substring(0, 10000); // Limit length
  }

  private getCSPPolicy(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'none'"
    ].join('; ');
  }

  static validateWidgetManifest(manifest: WidgetManifestDto): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!manifest.widget_id || typeof manifest.widget_id !== 'string') {
      errors.push('widget_id is required and must be a string');
    } else if (!/^[a-zA-Z0-9_-]+$/.test(manifest.widget_id)) {
      errors.push('widget_id must contain only alphanumeric characters, hyphens, and underscores');
    }

    if (!manifest.name || typeof manifest.name !== 'string') {
      errors.push('name is required and must be a string');
    }

    if (!manifest.version || typeof manifest.version !== 'string') {
      errors.push('version is required and must be a string');
    }

    if (!manifest.entry_point || typeof manifest.entry_point !== 'string') {
      errors.push('entry_point is required and must be a string');
    } else {
      try {
        new URL(manifest.entry_point);
      } catch {
        errors.push('entry_point must be a valid URL');
      }
    }

    if (manifest.performance_budget !== undefined) {
      if (typeof manifest.performance_budget !== 'number' || manifest.performance_budget < 0) {
        errors.push('performance_budget must be a non-negative number');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static validateWidgetConfig(_widgetType: string, config: any, schema?: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config || typeof config !== 'object') {
      return { valid: false, errors: ['Config must be an object'] };
    }

    if (schema && schema.properties) {
      // Basic schema validation
      for (const [field, fieldSchema] of Object.entries(schema.properties)) {
        const fieldDef = fieldSchema as any;
        
        if (fieldDef.required && !(field in config)) {
          errors.push(`Required field missing: ${field}`);
        }

        if (field in config) {
          const value = config[field];
          const expectedType = fieldDef.type;

          if (expectedType === 'string' && typeof value !== 'string') {
            errors.push(`Field ${field} must be a string`);
          } else if (expectedType === 'number' && typeof value !== 'number') {
            errors.push(`Field ${field} must be a number`);
          } else if (expectedType === 'boolean' && typeof value !== 'boolean') {
            errors.push(`Field ${field} must be a boolean`);
          } else if (expectedType === 'array' && !Array.isArray(value)) {
            errors.push(`Field ${field} must be an array`);
          } else if (expectedType === 'object' && (typeof value !== 'object' || Array.isArray(value))) {
            errors.push(`Field ${field} must be an object`);
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

