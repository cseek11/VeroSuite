# Widget Security Guide

## Overview

Widget security is critical for protecting tenant data and preventing XSS attacks. All widgets run in isolated iframes with strict Content Security Policies.

## Security Architecture

### Sandboxing

- **iframe Isolation**: All widgets render in separate iframes
- **CSP Enforcement**: Strict Content Security Policy
- **Origin Validation**: Messages validated by origin
- **No Frame Ancestors**: Widgets cannot be embedded elsewhere

### Content Security Policy

Default CSP for widgets:
```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'none';
```

### Message Validation

All postMessage communication is validated:

```typescript
// Parent validates widget origin
const widgetOrigin = new URL(manifest.entry_point).origin;
if (event.origin !== widgetOrigin) {
  console.warn('Unauthorized origin');
  return;
}

// Widget validates message source
if (event.source !== window.parent) {
  return; // Ignore
}
```

## Widget Manifest Security

### Validation Rules

1. **widget_id**: Alphanumeric, hyphens, underscores only
2. **entry_point**: Must be valid HTTPS URL
3. **config_schema**: Valid JSON Schema
4. **signature**: Cryptographic signature (future)

### Approval Workflow

1. Widget submitted with manifest
2. Server validates manifest
3. Admin reviews and approves
4. Widget signed and added to registry
5. Available to approved tenants

## Data Sanitization

### Server-Side

- All widget configs sanitized before storage
- XSS vectors removed
- Script tags stripped
- Event handlers removed
- URL validation

### Client-Side

- Config values validated against schema
- HTML sanitization for user inputs
- URL validation for external resources
- JSON parsing with error handling

## PII Handling

### Tagging

Widgets that display PII must tag it:

```typescript
{
  pii_tags: ['email', 'phone', 'address']
}
```

### Masking

- PII can be masked in preview modes
- Configurable masking rules per tenant
- Audit logging for PII access

## Best Practices

### For Widget Developers

1. **Never trust config data** - Always validate
2. **Sanitize all outputs** - Prevent XSS
3. **Use HTTPS only** - No HTTP resources
4. **Limit permissions** - Request minimum needed
5. **Tag PII properly** - Mark sensitive data
6. **Handle errors gracefully** - Don't expose internals
7. **Use secure storage** - Encrypt sensitive data
8. **Validate origins** - Check message sources

### For Administrators

1. **Review all widgets** - Before approval
2. **Monitor widget registry** - For suspicious activity
3. **Audit PII access** - Track sensitive data
4. **Update CSP policies** - As needed
5. **Revoke compromised widgets** - Immediately

## Threat Mitigation

### XSS Prevention

- CSP prevents inline scripts (except 'unsafe-inline' for compatibility)
- HTML sanitization
- No eval() or Function() constructors
- Content validation

### Data Leakage

- Tenant isolation via RLS
- Widget configs scoped to tenant
- No cross-tenant data access
- Audit logging

### Malicious Widgets

- Approval workflow
- Signature verification (future)
- Runtime monitoring
- Automatic revocation

## Incident Response

### If Widget Compromised

1. Immediately revoke widget approval
2. Notify affected tenants
3. Review audit logs
4. Update security policies
5. Investigate root cause

### Reporting Issues

- Report security issues immediately
- Include reproduction steps
- Do not disclose publicly until fixed
- Follow responsible disclosure

## Compliance

### GDPR

- PII tagging required
- Data retention policies
- Right to deletion
- Audit trails

### SOC 2

- Access controls
- Audit logging
- Change management
- Security monitoring

## Related Documentation

- [Architecture Overview](../DASHBOARD_REGIONS.md)
- [Widget SDK](../developer/WIDGET_SDK.md)





