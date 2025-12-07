/**
 * Sanitize HTML content to prevent XSS attacks
 * Note: For production, install and use DOMPurify: npm install isomorphic-dompurify
 */
export function sanitizeHtml(dirty?: string | null): string {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  // Remove script tags and event handlers
  let sanitized = dirty
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '');

  // Only allow safe HTML tags
  const allowedTags = ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'];
  const tagPattern = new RegExp(`<(?!\/?(?:${allowedTags.join('|')})(?:\s|>))[^>]+>`, 'gi');
  sanitized = sanitized.replace(tagPattern, '');

  // Remove dangerous attributes
  sanitized = sanitized.replace(/\s*(on\w+|javascript:|data:text\/html)\s*=\s*["'][^"']*["']/gi, '');

  return sanitized;
}

/**
 * Sanitize region config object to prevent XSS
 */
export function sanitizeConfig(config: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(config)) {
    if (typeof value === 'string') {
      // Sanitize string values
      sanitized[key] = sanitizeHtml(value);
    } else if (typeof value === 'object' && value !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeConfig(value);
    } else {
      // Keep non-string values as-is
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Sanitize region title/description
 */
export function sanitizeText(text?: string | null): string {
  // Remove HTML tags and dangerous characters
  return sanitizeHtml(text)
    .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
    .trim();
}

/**
 * Validate and sanitize color value
 */
export function sanitizeColor(color?: string | null): string | null {
  if (!color) return null;
  const value = color;
  // Only allow hex colors or rgb() format
  const hexPattern = /^#[0-9A-Fa-f]{6}$/;
  const rgbPattern = /^rgb\(\d{1,3},\s?\d{1,3},\s?\d{1,3}\)$/;

  if (hexPattern.test(value) || rgbPattern.test(value)) {
    return value;
  }

  return null;
}

/**
 * Convert hex color to RGB format
 */
function hexToRgb(hex: string): string | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  
  const r = parseInt(result[1] ?? '0', 16);
  const g = parseInt(result[2] ?? '0', 16);
  const b = parseInt(result[3] ?? '0', 16);
  
  return `rgb(${r},${g},${b})`;
}

/**
 * Normalize color format to match backend validation
 * Backend expects: #rrggbb OR rgb(\d{1,3},\s?\d{1,3},\s?\d{1,3})
 * We'll normalize to rgb(r,g,b) format (no spaces) for consistency
 */
export function normalizeColor(color?: string | null): string | undefined {
  if (!color) return undefined;
  
  // Remove whitespace
  const cleaned = color.trim();
  
  // Already in hex format - convert to RGB
  if (/^#[0-9A-Fa-f]{6}$/i.test(cleaned)) {
    const rgb = hexToRgb(cleaned);
    return rgb || undefined;
  }
  
  // Already in rgb format - normalize to rgb(r,g,b) without spaces
  const rgbMatch = cleaned.match(/rgb\(?\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)?/i);
  if (rgbMatch) {
    const [, rStr, gStr, bStr] = rgbMatch;
    const r = parseInt(rStr ?? '0', 10);
    const g = parseInt(gStr ?? '0', 10);
    const b = parseInt(bStr ?? '0', 10);
    // Ensure values are in valid range
    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      return `rgb(${r},${g},${b})`;
    }
  }
  
  // If we can't parse it, return undefined (will be filtered out)
  return undefined;
}

/**
 * Sanitize config object and normalize color values
 */
export function sanitizeRegionConfig(config: Record<string, any>): Record<string, any> {
  const sanitized = sanitizeConfig(config);
  
  // Normalize color fields - remove if invalid
  if (sanitized.backgroundColor) {
    const normalized = normalizeColor(sanitized.backgroundColor);
    if (normalized) {
      sanitized.backgroundColor = normalized;
    } else {
      // Remove invalid color instead of keeping invalid value
      delete sanitized.backgroundColor;
    }
  }
  if (sanitized.headerColor) {
    const normalized = normalizeColor(sanitized.headerColor);
    if (normalized) {
      sanitized.headerColor = normalized;
    } else {
      delete sanitized.headerColor;
    }
  }
  if (sanitized.borderColor) {
    const normalized = normalizeColor(sanitized.borderColor);
    if (normalized) {
      sanitized.borderColor = normalized;
    } else {
      delete sanitized.borderColor;
    }
  }
  
  return sanitized;
}

/**
 * Sanitize widget config
 */
export function sanitizeWidgetConfig(config: Record<string, any>): Record<string, any> {
  return sanitizeConfig(config);
}

