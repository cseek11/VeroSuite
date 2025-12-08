"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeHtml = sanitizeHtml;
exports.sanitizeConfig = sanitizeConfig;
exports.sanitizeText = sanitizeText;
exports.sanitizeColor = sanitizeColor;
exports.normalizeColor = normalizeColor;
exports.sanitizeRegionConfig = sanitizeRegionConfig;
exports.sanitizeWidgetConfig = sanitizeWidgetConfig;
/**
 * Sanitize HTML content to prevent XSS attacks
 * Note: For production, install and use DOMPurify: npm install isomorphic-dompurify
 */
function sanitizeHtml(dirty) {
    if (!dirty || typeof dirty !== 'string') {
        return '';
    }
    // Remove script tags and event handlers
    var sanitized = dirty
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/data:text\/html/gi, '');
    // Only allow safe HTML tags
    var allowedTags = ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'];
    var tagPattern = new RegExp("<(?!/?(?:".concat(allowedTags.join('|'), ")(?:s|>))[^>]+>"), 'gi');
    sanitized = sanitized.replace(tagPattern, '');
    // Remove dangerous attributes
    sanitized = sanitized.replace(/\s*(on\w+|javascript:|data:text\/html)\s*=\s*["'][^"']*["']/gi, '');
    return sanitized;
}
/**
 * Sanitize region config object to prevent XSS
 */
function sanitizeConfig(config) {
    var sanitized = {};
    for (var _i = 0, _a = Object.entries(config); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (typeof value === 'string') {
            // Sanitize string values
            sanitized[key] = sanitizeHtml(value);
        }
        else if (typeof value === 'object' && value !== null) {
            // Recursively sanitize nested objects
            sanitized[key] = sanitizeConfig(value);
        }
        else {
            // Keep non-string values as-is
            sanitized[key] = value;
        }
    }
    return sanitized;
}
/**
 * Sanitize region title/description
 */
function sanitizeText(text) {
    // Remove HTML tags and dangerous characters
    return sanitizeHtml(text)
        .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
        .trim();
}
/**
 * Validate and sanitize color value
 */
function sanitizeColor(color) {
    if (!color)
        return null;
    var value = color;
    // Only allow hex colors or rgb() format
    var hexPattern = /^#[0-9A-Fa-f]{6}$/;
    var rgbPattern = /^rgb\(\d{1,3},\s?\d{1,3},\s?\d{1,3}\)$/;
    if (hexPattern.test(value) || rgbPattern.test(value)) {
        return value;
    }
    return null;
}
/**
 * Convert hex color to RGB format
 */
function hexToRgb(hex) {
    var _a, _b, _c;
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result)
        return null;
    var r = parseInt((_a = result[1]) !== null && _a !== void 0 ? _a : '0', 16);
    var g = parseInt((_b = result[2]) !== null && _b !== void 0 ? _b : '0', 16);
    var b = parseInt((_c = result[3]) !== null && _c !== void 0 ? _c : '0', 16);
    return "rgb(".concat(r, ",").concat(g, ",").concat(b, ")");
}
/**
 * Normalize color format to match backend validation
 * Backend expects: #rrggbb OR rgb(\d{1,3},\s?\d{1,3},\s?\d{1,3})
 * We'll normalize to rgb(r,g,b) format (no spaces) for consistency
 */
function normalizeColor(color) {
    if (!color)
        return undefined;
    // Remove whitespace
    var cleaned = color.trim();
    // Already in hex format - convert to RGB
    if (/^#[0-9A-Fa-f]{6}$/i.test(cleaned)) {
        var rgb = hexToRgb(cleaned);
        return rgb || undefined;
    }
    // Already in rgb format - normalize to rgb(r,g,b) without spaces
    var rgbMatch = cleaned.match(/rgb\(?\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)?/i);
    if (rgbMatch) {
        var rStr = rgbMatch[1], gStr = rgbMatch[2], bStr = rgbMatch[3];
        var r = parseInt(rStr !== null && rStr !== void 0 ? rStr : '0', 10);
        var g = parseInt(gStr !== null && gStr !== void 0 ? gStr : '0', 10);
        var b = parseInt(bStr !== null && bStr !== void 0 ? bStr : '0', 10);
        // Ensure values are in valid range
        if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
            return "rgb(".concat(r, ",").concat(g, ",").concat(b, ")");
        }
    }
    // If we can't parse it, return undefined (will be filtered out)
    return undefined;
}
/**
 * Sanitize config object and normalize color values
 */
function sanitizeRegionConfig(config) {
    var sanitized = sanitizeConfig(config);
    // Normalize color fields - remove if invalid
    if (sanitized.backgroundColor) {
        var normalized = normalizeColor(sanitized.backgroundColor);
        if (normalized) {
            sanitized.backgroundColor = normalized;
        }
        else {
            // Remove invalid color instead of keeping invalid value
            delete sanitized.backgroundColor;
        }
    }
    if (sanitized.headerColor) {
        var normalized = normalizeColor(sanitized.headerColor);
        if (normalized) {
            sanitized.headerColor = normalized;
        }
        else {
            delete sanitized.headerColor;
        }
    }
    if (sanitized.borderColor) {
        var normalized = normalizeColor(sanitized.borderColor);
        if (normalized) {
            sanitized.borderColor = normalized;
        }
        else {
            delete sanitized.borderColor;
        }
    }
    return sanitized;
}
/**
 * Sanitize widget config
 */
function sanitizeWidgetConfig(config) {
    return sanitizeConfig(config);
}
