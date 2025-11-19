# 001 Backend Circuit Breaker

## WHEN
External API calls risk cascading failures or SLA breaches.

## DO
- Wrap outbound calls with circuit breaker tracking success/failure windows.
- Emit metrics to observability stack.
- Provide fallback behavior for degraded mode.

## WHY
Protects core workflows from third-party instability.

## EXAMPLE
`backend/src/services/payments/payment.service.ts`

## METADATA
- created_at: 2025-11-17
- author: TBA
- source_pr: TBD
- domain: backend
- complexity: medium




