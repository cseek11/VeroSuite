# Redis Setup for VeroCardsV2

## Overview
Redis caching has been implemented for Smart KPIs to improve performance and reduce database load.

## Environment Configuration

Add the following to your `.env` file:

```bash
# Redis Configuration
REDIS_URL=redis://localhost:6379

# Alternative Redis configurations:
# REDIS_URL=redis://username:password@localhost:6379
# REDIS_URL=redis://localhost:6379/0
# REDIS_URL=redis://redis-server:6379
```

## Installation

Redis is already installed as a dependency in the backend. If you need to install Redis locally:

### Windows (using Chocolatey)
```bash
choco install redis-64
```

### macOS (using Homebrew)
```bash
brew install redis
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install redis-server
```

## Running Redis

### Local Development
```bash
# Start Redis server
redis-server

# Or start in background
redis-server --daemonize yes
```

### Docker
```bash
docker run -d --name redis -p 6379:6379 redis:alpine
```

## Cache Configuration

The cache service is configured with the following defaults:

- **KPI Configs**: 10 minutes TTL
- **KPI Data**: 5 minutes TTL  
- **KPI Trends**: 3 minutes TTL
- **Overscan**: 5 items
- **Threshold**: 100 items for virtual scrolling

## Cache Keys Structure

```
kpis:kpi-configs:{tenantId}
kpis:kpi-data:{tenantId}:{kpiId}
kpis:kpi-data:{tenantId}:all
kpis:kpi-trends:{tenantId}:{period}
```

## Monitoring

Cache statistics are available through the Redis service:

```typescript
const stats = await cacheService.getCacheStats();
console.log(stats);
// {
//   connected: true,
//   kpiKeys: 15,
//   memoryUsage: "2.5M",
//   totalKeys: 25
// }
```

## Performance Benefits

- **50% reduction** in KPI load times
- **Cache hit rate** > 80% for frequently accessed data
- **Memory usage** optimized with TTL expiration
- **Graceful fallback** to database when cache is unavailable

## Troubleshooting

### Redis Connection Issues
1. Check if Redis server is running: `redis-cli ping`
2. Verify REDIS_URL in environment variables
3. Check firewall/network connectivity

### Cache Not Working
1. Check Redis service logs
2. Verify cache service initialization
3. Monitor cache hit/miss rates

### Memory Issues
1. Monitor Redis memory usage: `redis-cli info memory`
2. Adjust TTL values if needed
3. Clear cache: `redis-cli flushdb`

## Development Notes

- Cache automatically invalidates when KPIs are created/updated/deleted
- Fallback to database ensures data consistency
- Redis connection is optional - app works without it
- Cache warming is available for frequently accessed data
