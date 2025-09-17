export abstract class TenantAwareDto {
  // Explicitly forbid client-provided tenant_id on any DTO that extends this
  // Global ValidationPipe with whitelist:true will strip it, and typing it as never prevents usage.
  tenant_id?: never;
}

export function TenantAware(): ClassDecorator {
  return (_target) => {
    // No-op at runtime; acts as an explicit marker for code review and scanners.
  };
}
